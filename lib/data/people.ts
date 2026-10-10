import 'server-only'
import { Prisma } from '@/generated/prisma/client'
import { catalogIdSchema, slugSchema } from '@/lib/dto/catalog'
import { pageSchema, toPage, type Page } from '@/lib/dto/common'
import {
  listPeopleQuery,
  personDetailSchema,
  personInput,
  personListItemSchema,
  updatePersonInput,
  type ListPeopleQuery,
  type MovieCredit,
  type PersonDetail,
  type PersonInput,
  type PersonListItem,
  type UpdatePersonInput,
} from '@/lib/dto/people'
import { slugify } from '@/lib/slug'
import { invalidateTags, remember } from '@/lib/server/cache'
import { getSessionUser, requireAdmin, type SessionUser } from './auth'
import { CATALOG_TAG } from './cacheTags'
import { db } from './db'
import { escapeLike } from './escapeLike'
import { NotFoundError, parseInput, ValidationError } from './errors'
import { personPolicy } from './policies/person'
import { authorize, permissionsFor } from './policy'
import { uniqueSlug } from './slugs'

// People (directors, writers, cast): public to read, admin-only to write. A person's slug comes
// from their name once, with a numeric suffix for namesakes, and never changes.

export const personSummarySelect = {
  id: true,
  slug: true,
  name: true,
} satisfies Prisma.PersonSelect

/** A list row: the summary plus the credit count (a person in two roles on one movie counts twice). */
const personListItemSelect = {
  ...personSummarySelect,
  createdAt: true,
  _count: { select: { credits: true } },
} satisfies Prisma.PersonSelect

type PersonListItemRow = Prisma.PersonGetPayload<{ select: typeof personListItemSelect }>

const toPersonListItem = ({ _count, ...person }: PersonListItemRow): PersonListItem => ({
  ...person,
  creditCount: _count.credits,
})

const movieCreditSelect = {
  id: true,
  slug: true,
  title: true,
  releaseDate: true,
  posterUrl: true,
} satisfies Prisma.MovieSelect

const personDetailSelect = {
  ...personSummarySelect,
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

const PEOPLE_CACHE_TTL = 300
const PERMISSION_ACTIONS = ['update', 'delete'] as const
const CREATE_ATTEMPTS = 3

const toPersonRecord = ({ credits, ...person }: PersonDetailRow): PersonRecord => {
  const filmography: PersonRecord['filmography'] = { directed: [], written: [], acted: [] }
  for (const { role, movie } of credits) {
    const entry: MovieCredit = movie
    if (role === 'DIRECTOR') {
      filmography.directed.push(entry)
    } else if (role === 'WRITER') {
      filmography.written.push(entry)
    } else {
      filmography.acted.push(entry)
    }
  }
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
  const { name } = parseInput(personInput, input)
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
      const person = await db.person.create({ data: { name, slug }, select: { id: true } })
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

/** Admin only → input valid → exists (404) → allowed (403) → renames; the slug never changes. */
export const updatePerson = async (input: UpdatePersonInput): Promise<PersonDetail> => {
  const viewer = await requireAdmin()
  const { id, name } = parseInput(updatePersonInput, input)
  const record = await db.person.findUnique({ where: { id }, select: { id: true } })
  if (!record) {
    throw new NotFoundError('Person not found')
  }
  authorize(personPolicy.update, viewer, record)
  await db.person.update({ where: { id }, data: { name } })
  await invalidateTags(CATALOG_TAG)
  return readPersonDetail(id, viewer)
}

/**
 * Admin only → id valid → exists → allowed → not credited: the foreign key is `Restrict`, and this
 * turns that into a message instead of a database error.
 */
export const deletePerson = async (id: string): Promise<void> => {
  const viewer = await requireAdmin()
  const personId = parseInput(catalogIdSchema, id)
  const record = await db.person.findUnique({ where: { id: personId }, select: { id: true } })
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
}
