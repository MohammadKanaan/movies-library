import 'server-only'
import { Prisma } from '@/generated/prisma/client'
import { MINUTE } from '@/lib/constants-time'
import { catalogIdSchema, creditRoleSchema, slugSchema } from '@/lib/dto/catalog'
import { pageSchema, toPage, type Page } from '@/lib/dto/common'
import {
  attachHeadshotInput,
  listPeopleQuery,
  personDetailSchema,
  personInput,
  personListItemSchema,
  personSummarySchema,
  updatePersonInput,
  type AttachHeadshotInput,
  type ListPeopleQuery,
  type MovieCredit,
  type PersonDetail,
  type PersonInput,
  type PersonListItem,
  type PersonSummary,
  type UpdatePersonInput,
} from '@/lib/dto/people'
import { slugify } from '@/lib/slug'
import { invalidateTags, remember } from '@/lib/server/cache'
import { logger } from '@/lib/server/logger'
import { keyFromPublicUrl, publicUrl } from '@/lib/server/storage'
import { getSessionUser, requireAdmin, type SessionUser } from './auth'
import { CATALOG_TAG } from './cacheTags'
import { db } from './db'
import { escapeLike } from './escapeLike'
import { NotFoundError, parseInput, ValidationError } from './errors'
import { genreSelect } from './genres'
import { personPolicy } from './policies/person'
import { authorize, permissionsFor } from './policy'
import { uniqueSlug } from './slugs'
import { deleteObjectAfterTicket, requireOwnKey, verifyStoredObject } from './uploads'

// People (directors, writers, cast): public to read, admin-only to write. A person's slug comes
// from their name once, with a numeric suffix for namesakes, and never changes. The headshot comes
// from an upload (`attachHeadshot`), like a movie's poster.

const log = logger.child({ module: 'people' })

export const personSummarySelect = {
  id: true,
  slug: true,
  name: true,
  headshotUrl: true,
} satisfies Prisma.PersonSelect

/**
 * A list row: the summary plus the credit count (a person in two roles on one movie counts twice).
 * Exactly the `PersonListItem` DTO; the search DAL reuses it with `toPersonListItem`.
 */
export const personListItemSelect = {
  ...personSummarySelect,
  createdAt: true,
  _count: { select: { credits: true } },
} satisfies Prisma.PersonSelect

type PersonListItemRow = Prisma.PersonGetPayload<{ select: typeof personListItemSelect }>

export const toPersonListItem = ({ _count, ...person }: PersonListItemRow): PersonListItem => ({
  ...person,
  creditCount: _count.credits,
})

// The fields of `movieSummarySelect` (`lib/data/movies.ts`), which cannot be imported here: movies.ts
// imports this file.
const movieCreditSelect = {
  id: true,
  slug: true,
  title: true,
  releaseDate: true,
  runtimeMinutes: true,
  posterUrl: true,
  genres: {
    select: { genre: { select: genreSelect } },
    orderBy: [{ genre: { name: 'asc' } }, { genreId: 'asc' }],
  },
} satisfies Prisma.MovieSelect

const personDetailSelect = {
  ...personSummarySelect,
  bio: true,
  birthDate: true,
  createdAt: true,
  updatedAt: true,
  credits: {
    select: { role: true, movie: { select: movieCreditSelect } },
    orderBy: [{ movie: { releaseDate: 'desc' } }, { movie: { id: 'desc' } }],
  },
} satisfies Prisma.PersonSelect

type PersonDetailRow = Prisma.PersonGetPayload<{ select: typeof personDetailSelect }>

/** The detail without `permissions`: the same for every viewer, so this is what gets cached. */
type PersonRecord = Omit<PersonDetail, 'permissions'>

const personRecordSchema = personDetailSchema.omit({ permissions: true })

const PEOPLE_CACHE_TTL = 5 * MINUTE
const PERMISSION_ACTIONS = ['update', 'delete'] as const
const CREATE_ATTEMPTS = 3

const ROLE_ORDER = creditRoleSchema.options

/**
 * One entry per movie, in the rows' order (newest release first), carrying every role the person
 * holds on it in `credit_role` order. A writer-director's film appears once.
 */
const toPersonRecord = ({ credits, ...person }: PersonDetailRow): PersonRecord => {
  const byMovie = new Map<string, MovieCredit>()
  for (const { role, movie } of credits) {
    const entry = byMovie.get(movie.id)
    if (entry) {
      entry.roles.push(role)
    } else {
      const { genres, ...fields } = movie
      byMovie.set(movie.id, {
        ...fields,
        genres: genres.map(({ genre }) => genre),
        roles: [role],
      })
    }
  }
  const filmography = [...byMovie.values()].map((entry) => ({
    ...entry,
    roles: [...entry.roles].sort((a, b) => ROLE_ORDER.indexOf(a) - ROLE_ORDER.indexOf(b)),
  }))
  return { ...person, filmography }
}

const withPermissions = (record: PersonRecord, viewer: SessionUser | null): PersonDetail => ({
  ...record,
  permissions: permissionsFor(personPolicy, PERMISSION_ACTIONS, viewer, record),
})

const loadPersonRecord = async (
  where: Prisma.PersonWhereUniqueInput,
): Promise<PersonRecord | null> => {
  const row = await db.person.findUnique({ where, select: personDetailSelect })
  return row ? toPersonRecord(row) : null
}

/** The detail fresh from the database, for the result of a write. */
const readPersonDetail = async (id: string, viewer: SessionUser): Promise<PersonDetail> => {
  const record = await loadPersonRecord({ id })
  if (!record) {
    throw new NotFoundError('Person not found')
  }
  return withPermissions(record, viewer)
}

/**
 * Public: people by name, optionally searched (case-insensitive, wildcards literal), each with their
 * credit count. Only the plain list is cached: a search is an unbounded key and is always read from
 * the database.
 */
export const listPeople = async (query: ListPeopleQuery): Promise<Page<PersonListItem>> => {
  const { page, perPage, q } = parseInput(listPeopleQuery, query)
  const load = async () => {
    const where: Prisma.PersonWhereInput = q
      ? { name: { contains: escapeLike(q), mode: 'insensitive' } }
      : {}
    const [rows, totalItems] = await Promise.all([
      db.person.findMany({
        where,
        select: personListItemSelect,
        orderBy: [{ name: 'asc' }, { id: 'asc' }],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      db.person.count({ where }),
    ])
    return toPage(rows.map(toPersonListItem), totalItems, { page, perPage })
  }
  if (q) {
    return load()
  }
  return remember(
    `people:list:${JSON.stringify([page, perPage])}`,
    { ttl: PEOPLE_CACHE_TTL, tags: [CATALOG_TAG], schema: pageSchema(personListItemSchema) },
    load,
  )
}

/**
 * Public: one person with their filmography by role (newest release first). A malformed slug is
 * not found, like an unknown one. The record is cached; `permissions` is computed per viewer after.
 */
export const getPersonBySlug = async (slug: string): Promise<PersonDetail> => {
  const viewer = await getSessionUser()
  const parsed = slugSchema.safeParse(slug)
  if (!parsed.success) {
    throw new NotFoundError('Person not found')
  }
  const record = await remember(
    `person:${parsed.data}`,
    { ttl: PEOPLE_CACHE_TTL, tags: [CATALOG_TAG], schema: personRecordSchema },
    async () => {
      const loaded = await loadPersonRecord({ slug: parsed.data })
      if (!loaded) {
        throw new NotFoundError('Person not found')
      }
      return loaded
    },
  )
  return withPermissions(record, viewer)
}

/**
 * Public: the summary of one person, for a page that names them without showing their filmography
 * (the movie list's `person` filter). The detail would load every credit for four fields. A malformed
 * slug is not found, like an unknown one; the summary is cached like the detail, viewer-independent.
 */
export const getPersonSummaryBySlug = async (slug: string): Promise<PersonSummary> => {
  const parsed = slugSchema.safeParse(slug)
  if (!parsed.success) {
    throw new NotFoundError('Person not found')
  }
  return remember(
    `person:summary:${parsed.data}`,
    { ttl: PEOPLE_CACHE_TTL, tags: [CATALOG_TAG], schema: personSummarySchema },
    async () => {
      const row = await db.person.findUnique({
        where: { slug: parsed.data },
        select: personSummarySelect,
      })
      if (!row) {
        throw new NotFoundError('Person not found')
      }
      return row
    },
  )
}

/** `YYYY-MM-DD` into the `date` column: midnight UTC, which the UTC session stores as that day. */
const toBirthDate = (value: string | null) => (value ? new Date(`${value}T00:00:00.000Z`) : null)

const slugBaseOf = (name: string) => {
  const base = slugify(name)
  if (!base) {
    throw new ValidationError({ name: ['Name must contain letters or digits'] })
  }
  return base
}

/**
 * Admin only → name valid → the slug is the name's, numbered when a namesake already has it. Two
 * concurrent creates can pick the same free slug; the loser's unique violation is retried.
 */
export const createPerson = async (input: PersonInput): Promise<PersonDetail> => {
  const viewer = await requireAdmin()
  const { name, bio = null, birthDate = null } = parseInput(personInput, input)
  const base = slugBaseOf(name)
  for (let attempt = 1; ; attempt += 1) {
    const taken = await db.person.findMany({
      where: { slug: { startsWith: base } },
      select: { slug: true },
    })
    const slug = uniqueSlug(
      base,
      taken.map((row) => row.slug),
    )
    try {
      const person = await db.person.create({
        data: { name, slug, bio, birthDate: toBirthDate(birthDate) },
        select: { id: true },
      })
      await invalidateTags(CATALOG_TAG)
      return readPersonDetail(person.id, viewer)
    } catch (error) {
      const raced = error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
      if (!raced || attempt >= CREATE_ATTEMPTS) {
        throw error
      }
    }
  }
}

/**
 * Admin only → input valid → exists (404) → allowed (403) → renames and writes the bio and birth
 * date that were given (a field left out keeps its value); the slug never changes.
 */
export const updatePerson = async (input: UpdatePersonInput): Promise<PersonDetail> => {
  const viewer = await requireAdmin()
  const { id, name, bio, birthDate } = parseInput(updatePersonInput, input)
  const record = await db.person.findUnique({ where: { id }, select: { id: true } })
  if (!record) {
    throw new NotFoundError('Person not found')
  }
  authorize(personPolicy.update, viewer, record)
  await db.person.update({
    where: { id },
    data: {
      name,
      ...(bio === undefined ? {} : { bio }),
      ...(birthDate === undefined ? {} : { birthDate: toBirthDate(birthDate) }),
    },
  })
  await invalidateTags(CATALOG_TAG)
  return readPersonDetail(id, viewer)
}

/**
 * Queues the headshot's object for deletion once nothing references it. Only an object under
 * `headshots/` is ours. A failure to queue leaves an orphaned object, never a broken response.
 */
const queueHeadshotDeletion = (headshotUrl: string | null) => {
  const key = keyFromPublicUrl(headshotUrl)
  if (!key?.startsWith('headshots/')) {
    return
  }
  deleteObjectAfterTicket(key, 'headshot').catch((error) =>
    log.error({ err: error, key }, 'headshot not queued for deletion'),
  )
}

/**
 * Admin only → id valid → exists → allowed → not credited: the foreign key is `Restrict`, and this
 * turns that into a message instead of a database error. The headshot's object is queued after.
 */
export const deletePerson = async (id: string): Promise<void> => {
  const viewer = await requireAdmin()
  const personId = parseInput(catalogIdSchema, id)
  const record = await db.person.findUnique({
    where: { id: personId },
    select: { id: true, headshotUrl: true },
  })
  if (!record) {
    throw new NotFoundError('Person not found')
  }
  authorize(personPolicy.delete, viewer, record)
  const credited = await db.credit.findMany({
    where: { personId },
    distinct: ['movieId'],
    select: { movieId: true },
  })
  if (credited.length > 0) {
    const count = credited.length
    const message = `Remove the person from the credits of ${count} ${count === 1 ? 'movie' : 'movies'} first`
    throw new ValidationError({ base: [message] }, message)
  }
  await db.person.delete({ where: { id: personId } })
  await invalidateTags(CATALOG_TAG)
  queueHeadshotDeletion(record.headshotUrl)
}

/**
 * Makes an uploaded `headshot` object the person's headshot, the way `attachPoster` does for a
 * movie. Admin → input valid (422) → the key is the admin's own and a headshot (403) → the person
 * exists (404) → allowed → the stored object is checked against the rule (an object that broke it is
 * deleted at once) → in one transaction that first locks the person row, the current headshot is
 * read and replaced → the replaced object, if it is in the bucket and not the same key, is queued.
 */
export const attachHeadshot = async (input: AttachHeadshotInput): Promise<PersonDetail> => {
  const viewer = await requireAdmin()
  const { id, key } = parseInput(attachHeadshotInput, input)
  const ownKey = requireOwnKey(viewer, key, 'headshot')
  const record = await db.person.findUnique({ where: { id }, select: { id: true } })
  if (!record) {
    throw new NotFoundError('Person not found')
  }
  authorize(personPolicy.update, viewer, record)
  await verifyStoredObject(ownKey, 'headshot')

  const replaced = await db.$transaction(async (tx) => {
    // Two attaches to one person run one after the other, so the later one sees (and replaces) the
    // earlier headshot instead of losing track of it.
    await tx.$queryRaw`SELECT 1 FROM people WHERE id = ${id}::uuid FOR UPDATE`
    const previous = await tx.person.findUnique({ where: { id }, select: { headshotUrl: true } })
    await tx.person.update({ where: { id }, data: { headshotUrl: publicUrl(ownKey) } })
    return previous?.headshotUrl ?? null
  })

  await invalidateTags(CATALOG_TAG)
  if (keyFromPublicUrl(replaced) !== ownKey) {
    queueHeadshotDeletion(replaced)
  }
  return readPersonDetail(id, viewer)
}

/** Admin only → id valid → exists → allowed → the headshot is cleared and its object queued for deletion. */
export const removeHeadshot = async (id: string): Promise<PersonDetail> => {
  const viewer = await requireAdmin()
  const personId = parseInput(catalogIdSchema, id)
  const record = await db.person.findUnique({
    where: { id: personId },
    select: { id: true, headshotUrl: true },
  })
  if (!record) {
    throw new NotFoundError('Person not found')
  }
  authorize(personPolicy.update, viewer, record)
  await db.person.update({ where: { id: personId }, data: { headshotUrl: null } })
  await invalidateTags(CATALOG_TAG)
  queueHeadshotDeletion(record.headshotUrl)
  return readPersonDetail(personId, viewer)
}
