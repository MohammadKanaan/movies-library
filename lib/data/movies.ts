import 'server-only'
import { z } from 'zod'
import { Prisma } from '@/generated/prisma/client'
import { catalogIdSchema, slugSchema, type CreditRole } from '@/lib/dto/catalog'
import { pageSchema, toPage, type Page } from '@/lib/dto/common'
import {
  attachPosterInput,
  listMoviesQuery,
  movieDetailSchema,
  movieInput,
  movieSummarySchema,
  updateMovieInput,
  type AttachPosterInput,
  type ListMoviesQuery,
  type MovieDetail,
  type MovieInput,
  type MovieSort,
  type MovieSummary,
  type UpdateMovieInput,
} from '@/lib/dto/movies'
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
import { personSummarySelect } from './people'
import { moviePolicy } from './policies/movie'
import { authorize, permissionsFor } from './policy'
import { uniqueSlug } from './slugs'
import { deleteObjectAfterTicket, requireOwnKey, verifyStoredObject } from './uploads'
import { userProfileSelect } from './users'

// The catalog's main resource: public to read, admin-only to write. A movie's slug is its title
// and release year (`dune-2021`), numbered on a collision, fixed for life. Genres and credits are
// written with the movie as replace-all sets; the poster comes from an upload (`attachPoster`).

const log = logger.child({ module: 'movies' })

/** Exactly the `MovieSummary` DTO (`toMovieSummary` flattens the genre join); the admin DAL reuses it. */
export const movieSummarySelect = {
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

const movieDetailSelect = {
  ...movieSummarySelect,
  synopsis: true,
  createdAt: true,
  updatedAt: true,
  createdById: true,
  createdBy: { select: userProfileSelect },
  credits: {
    select: { role: true, star: true, person: { select: personSummarySelect } },
    orderBy: [{ position: 'asc' }, { personId: 'asc' }],
  },
} satisfies Prisma.MovieSelect

type MovieSummaryRow = Prisma.MovieGetPayload<{ select: typeof movieSummarySelect }>
type MovieDetailRow = Prisma.MovieGetPayload<{ select: typeof movieDetailSelect }>

/**
 * The detail without `permissions` plus the policy's input (`createdById`): the same for every
 * viewer, so this is what gets cached.
 */
type MovieRecord = Omit<MovieDetail, 'permissions'> & { createdById: string | null }

const movieRecordSchema = movieDetailSchema
  .omit({ permissions: true })
  .extend({ createdById: z.string().nullable() })

const MOVIES_CACHE_TTL = 300
const PERMISSION_ACTIONS = ['update', 'delete'] as const
const CREATE_ATTEMPTS = 3

const ORDER_BY: Record<MovieSort, Prisma.MovieOrderByWithRelationInput[]> = {
  newest: [{ releaseDate: 'desc' }, { id: 'desc' }],
  oldest: [{ releaseDate: 'asc' }, { id: 'asc' }],
  title: [{ title: 'asc' }, { id: 'asc' }],
  added: [{ createdAt: 'desc' }, { id: 'desc' }],
}

export const toMovieSummary = ({ genres, ...movie }: MovieSummaryRow): MovieSummary => ({
  ...movie,
  genres: genres.map(({ genre }) => genre),
})

const toMovieRecord = ({ credits, genres, ...movie }: MovieDetailRow): MovieRecord => {
  const grouped: MovieRecord['credits'] = { directors: [], writers: [], cast: [] }
  for (const { role, star, person } of credits) {
    if (role === 'DIRECTOR') {
      grouped.directors.push(person)
    } else if (role === 'WRITER') {
      grouped.writers.push(person)
    } else {
      grouped.cast.push({ ...person, star })
    }
  }
  return { ...movie, genres: genres.map(({ genre }) => genre), credits: grouped }
}

const withPermissions = (
  { createdById, ...record }: MovieRecord,
  viewer: SessionUser | null,
): MovieDetail => ({
  ...record,
  permissions: permissionsFor(moviePolicy, PERMISSION_ACTIONS, viewer, { createdById }),
})

const loadMovieRecord = async (
  where: Prisma.MovieWhereUniqueInput,
): Promise<MovieRecord | null> => {
  const row = await db.movie.findUnique({ where, select: movieDetailSelect })
  return row ? toMovieRecord(row) : null
}

/** The detail fresh from the database, for the result of a write. */
const readMovieDetail = async (id: string, viewer: SessionUser): Promise<MovieDetail> => {
  const record = await loadMovieRecord({ id })
  if (!record) {
    throw new NotFoundError('Movie not found')
  }
  return withPermissions(record, viewer)
}

/**
 * Public: a page of summaries, searched by title (case-insensitive, wildcards literal) and filtered
 * by genre and person slug. Only the unfiltered list is cached: a search or a filter is an
 * unbounded key and is always read from the database.
 */
export const listMovies = async (query: ListMoviesQuery): Promise<Page<MovieSummary>> => {
  const { page, perPage, q, genre, person, sort } = parseInput(listMoviesQuery, query)
  const load = async () => {
    const where: Prisma.MovieWhereInput = {
      ...(q ? { title: { contains: escapeLike(q), mode: 'insensitive' } } : {}),
      ...(genre ? { genres: { some: { genre: { slug: genre } } } } : {}),
      ...(person ? { credits: { some: { person: { slug: person } } } } : {}),
    }
    const [rows, totalItems] = await Promise.all([
      db.movie.findMany({
        where,
        select: movieSummarySelect,
        orderBy: ORDER_BY[sort],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      db.movie.count({ where }),
    ])
    return toPage(rows.map(toMovieSummary), totalItems, { page, perPage })
  }
  if (q || genre || person) {
    return load()
  }
  return remember(
    `movies:list:${JSON.stringify([page, perPage, sort])}`,
    { ttl: MOVIES_CACHE_TTL, tags: [CATALOG_TAG], schema: pageSchema(movieSummarySchema) },
    load,
  )
}

/**
 * Public: one movie with its genres, credits by role in billing order and creator. A malformed slug
 * is not found, like an unknown one. The record is cached; `permissions` is computed per viewer after.
 */
export const getMovieBySlug = async (slug: string): Promise<MovieDetail> => {
  const viewer = await getSessionUser()
  const parsed = slugSchema.safeParse(slug)
  if (!parsed.success) {
    throw new NotFoundError('Movie not found')
  }
  const record = await remember(
    `movie:${parsed.data}`,
    { ttl: MOVIES_CACHE_TTL, tags: [CATALOG_TAG], schema: movieRecordSchema },
    async () => {
      const loaded = await loadMovieRecord({ slug: parsed.data })
      if (!loaded) {
        throw new NotFoundError('Movie not found')
      }
      return loaded
    },
  )
  return withPermissions(record, viewer)
}

type ParsedMovieInput = z.output<typeof movieInput>

/** The referenced genres and people must exist; a stale id from a form is a field error, not a 500. */
const assertReferencesExist = async ({ genreIds, credits }: ParsedMovieInput) => {
  const personIds = [...new Set(credits.map((credit) => credit.personId))]
  const [genres, people] = await Promise.all([
    db.genre.count({ where: { id: { in: genreIds } } }),
    db.person.count({ where: { id: { in: personIds } } }),
  ])
  const fieldErrors: Record<string, string[]> = {}
  if (genres !== genreIds.length) {
    fieldErrors.genreIds = ['A genre does not exist']
  }
  if (people !== personIds.length) {
    fieldErrors.credits = ['A person does not exist']
  }
  if (Object.keys(fieldErrors).length > 0) {
    throw new ValidationError(fieldErrors)
  }
}

/** `position` is the index within each role, in the order the credits were given. */
const toCreditRows = (credits: ParsedMovieInput['credits']) => {
  const next: Record<CreditRole, number> = { DIRECTOR: 0, WRITER: 0, ACTOR: 0 }
  return credits.map(({ personId, role, star }) => ({
    personId,
    role,
    star,
    position: next[role]++,
  }))
}

/** `YYYY-MM-DD` into the `date` column: midnight UTC, which the UTC session stores as that day. */
const toReleaseDate = (value: string) => new Date(`${value}T00:00:00.000Z`)

const scalarData = (data: ParsedMovieInput) => ({
  title: data.title,
  synopsis: data.synopsis,
  releaseDate: toReleaseDate(data.releaseDate),
  runtimeMinutes: data.runtimeMinutes,
})

const isUniqueViolation = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'

/**
 * Admin only → input valid → genres and people exist → slug from title and year, numbered when
 * taken (two concurrent creates can pick the same free slug; the loser's unique violation is
 * retried) → the movie, its genre links and its credits in one transaction.
 */
export const createMovie = async (input: MovieInput): Promise<MovieDetail> => {
  const viewer = await requireAdmin()
  const data = parseInput(movieInput, input)
  await assertReferencesExist(data)
  const base = `${slugify(data.title) || 'movie'}-${data.releaseDate.slice(0, 4)}`
  for (let attempt = 1; ; attempt += 1) {
    const taken = await db.movie.findMany({
      where: { slug: { startsWith: base } },
      select: { slug: true },
    })
    const slug = uniqueSlug(
      base,
      taken.map((row) => row.slug),
    )
    try {
      const movie = await db.movie.create({
        data: {
          ...scalarData(data),
          slug,
          createdById: viewer.id,
          genres: { createMany: { data: data.genreIds.map((genreId) => ({ genreId })) } },
          credits: { createMany: { data: toCreditRows(data.credits) } },
        },
        select: { id: true },
      })
      await invalidateTags(CATALOG_TAG)
      return readMovieDetail(movie.id, viewer)
    } catch (error) {
      if (!isUniqueViolation(error) || attempt >= CREATE_ATTEMPTS) {
        throw error
      }
    }
  }
}

/**
 * Admin only → input valid → exists (404) → allowed (403) → genres and people exist → replaces the
 * fields, the genre links and the credits in one transaction. The slug never changes.
 */
export const updateMovie = async (input: UpdateMovieInput): Promise<MovieDetail> => {
  const viewer = await requireAdmin()
  const { id, ...data } = parseInput(updateMovieInput, input)
  const record = await db.movie.findUnique({
    where: { id },
    select: { id: true, createdById: true },
  })
  if (!record) {
    throw new NotFoundError('Movie not found')
  }
  authorize(moviePolicy.update, viewer, record)
  await assertReferencesExist(data)
  await db.$transaction([
    db.movie.update({ where: { id }, data: scalarData(data) }),
    db.movieGenre.deleteMany({ where: { movieId: id } }),
    db.movieGenre.createMany({ data: data.genreIds.map((genreId) => ({ movieId: id, genreId })) }),
    db.credit.deleteMany({ where: { movieId: id } }),
    db.credit.createMany({
      data: toCreditRows(data.credits).map((credit) => ({ movieId: id, ...credit })),
    }),
  ])
  await invalidateTags(CATALOG_TAG)
  return readMovieDetail(id, viewer)
}

/**
 * Queues the poster's object for deletion once nothing references it. Only an object under
 * `posters/` is ours (a URL from elsewhere is not in the bucket, `keyFromPublicUrl` says null). A
 * failure to queue leaves an orphaned object, never a broken response.
 */
const queuePosterDeletion = (posterUrl: string | null) => {
  const key = keyFromPublicUrl(posterUrl)
  if (!key?.startsWith('posters/')) {
    return
  }
  deleteObjectAfterTicket(key, 'poster').catch((error) =>
    log.error({ err: error, key }, 'poster not queued for deletion'),
  )
}

/** Admin only → id valid → exists → allowed → deleted (the genre links and credits cascade), its poster queued. */
export const deleteMovie = async (id: string): Promise<void> => {
  const viewer = await requireAdmin()
  const movieId = parseInput(catalogIdSchema, id)
  const record = await db.movie.findUnique({
    where: { id: movieId },
    select: { id: true, createdById: true, posterUrl: true },
  })
  if (!record) {
    throw new NotFoundError('Movie not found')
  }
  authorize(moviePolicy.delete, viewer, record)
  await db.movie.delete({ where: { id: movieId } })
  await invalidateTags(CATALOG_TAG)
  queuePosterDeletion(record.posterUrl)
}

/**
 * Makes an uploaded `poster` object the movie's poster. Admin → input valid (422) → the key is the
 * admin's own and a poster (403; not even another admin's object) → the movie exists (404) → allowed
 * → the stored object is checked against the rule (an object that broke it is deleted at once) → in
 * one transaction that first locks the movie row, the current poster is read and replaced → the
 * replaced object, if it is in the bucket and not the same key, is queued for deletion.
 */
export const attachPoster = async (input: AttachPosterInput): Promise<MovieDetail> => {
  const viewer = await requireAdmin()
  const { id, key } = parseInput(attachPosterInput, input)
  const ownKey = requireOwnKey(viewer, key, 'poster')
  const record = await db.movie.findUnique({
    where: { id },
    select: { id: true, createdById: true },
  })
  if (!record) {
    throw new NotFoundError('Movie not found')
  }
  authorize(moviePolicy.update, viewer, record)
  await verifyStoredObject(ownKey, 'poster')

  const replaced = await db.$transaction(async (tx) => {
    // Two attaches to one movie run one after the other, so the later one sees (and replaces) the
    // earlier poster instead of losing track of it.
    await tx.$queryRaw`SELECT 1 FROM movies WHERE id = ${id}::uuid FOR UPDATE`
    const previous = await tx.movie.findUnique({ where: { id }, select: { posterUrl: true } })
    await tx.movie.update({ where: { id }, data: { posterUrl: publicUrl(ownKey) } })
    return previous?.posterUrl ?? null
  })

  await invalidateTags(CATALOG_TAG)
  if (keyFromPublicUrl(replaced) !== ownKey) {
    queuePosterDeletion(replaced)
  }
  return readMovieDetail(id, viewer)
}

/** Admin only → id valid → exists → allowed → the poster is cleared and its object queued for deletion. */
export const removePoster = async (id: string): Promise<MovieDetail> => {
  const viewer = await requireAdmin()
  const movieId = parseInput(catalogIdSchema, id)
  const record = await db.movie.findUnique({
    where: { id: movieId },
    select: { id: true, createdById: true, posterUrl: true },
  })
  if (!record) {
    throw new NotFoundError('Movie not found')
  }
  authorize(moviePolicy.update, viewer, record)
  await db.movie.update({ where: { id: movieId }, data: { posterUrl: null } })
  await invalidateTags(CATALOG_TAG)
  queuePosterDeletion(record.posterUrl)
  return readMovieDetail(movieId, viewer)
}
