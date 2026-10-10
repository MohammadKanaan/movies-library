import 'server-only'
import { z } from 'zod'
import type { Prisma } from '@/generated/prisma/client'
import { MINUTE } from '@/lib/constants-time'
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
import type { RatingSummary } from '@/lib/dto/reviews'
import { slugify } from '@/lib/slug'
import { invalidateTags, remember } from '@/lib/server/cache'
import { logger } from '@/lib/server/logger'
import { keyFromPublicUrl, publicUrl } from '@/lib/server/storage'
import { getSessionUser, requireAdmin, type SessionUser } from './auth'
import { CATALOG_TAG, RATINGS_TAG } from './cacheTags'
import { db } from './db'
import { escapeLike } from './escapeLike'
import { NotFoundError, parseInput, ValidationError } from './errors'
import { genreSelect } from './genres'
import { movieSummarySelect, toMovieSummary } from './movieSummary'
import { personSummarySelect } from './people'
import { moviePolicy } from './policies/movie'
import { authorize, permissionsFor } from './policy'
import { isForeignKeyViolation, isUniqueViolation } from './prismaErrors'
import { movieRatingSelect, toRatingSummary } from './reviews'
import { uniqueSlug } from './slugs'
import { deleteObjectAfterTicket, requireOwnKey, verifyStoredObject } from './uploads'
import { userProfileSelect } from './users'

// The catalog's main resource: public to read, admin-only to write. A movie's slug is its title
// and release year (`dune-2021`), numbered on a collision, fixed for life. Genres and credits are
// written with the movie as replace-all sets; the poster comes from an upload (`attachPoster`).

const log = logger.child({ module: 'movies' })

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

/** The detail without its rating, which is read on its own (`loadMovieRating`). */
const movieRecordSelect = {
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

type MovieDetailRow = Prisma.MovieGetPayload<{ select: typeof movieDetailSelect }>
type MovieRecordRow = Prisma.MovieGetPayload<{ select: typeof movieRecordSelect }>

/**
 * The detail without `permissions` and `rating`, plus the policy's input (`createdById`): the same
 * for every viewer and changed by catalog writes only, so this is what gets cached. The rating is
 * left out because reviews change it far more often than the catalog changes the rest.
 */
type MovieRecord = Omit<MovieDetail, 'permissions' | 'rating'> & { createdById: string | null }

const movieRecordSchema = movieDetailSchema
  .omit({ permissions: true, rating: true })
  .extend({ createdById: z.string().nullable() })

const MOVIES_CACHE_TTL = 5 * MINUTE
const PERMISSION_ACTIONS = ['update', 'delete'] as const
const CREATE_ATTEMPTS = 3

const ORDER_BY: Record<MovieSort, Prisma.MovieOrderByWithRelationInput[]> = {
  newest: [{ releaseDate: 'desc' }, { id: 'desc' }],
  oldest: [{ releaseDate: 'asc' }, { id: 'asc' }],
  title: [{ title: 'asc' }, { id: 'asc' }],
  added: [{ createdAt: 'desc' }, { id: 'desc' }],
  rating: [
    { ratingAverage: { sort: 'desc', nulls: 'last' } },
    { ratingCount: 'desc' },
    { id: 'desc' },
  ],
}

const toMovieRecord = ({ credits, genres, ...movie }: MovieRecordRow): MovieRecord => {
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

const toMovieDetail = (
  { createdById, ...record }: MovieRecord,
  rating: RatingSummary,
  viewer: SessionUser | null,
): MovieDetail => ({
  ...record,
  rating,
  permissions: permissionsFor(moviePolicy, PERMISSION_ACTIONS, viewer, { createdById }),
})

const loadMovieRecord = async (
  where: Prisma.MovieWhereUniqueInput,
): Promise<MovieRecord | null> => {
  const row = await db.movie.findUnique({ where, select: movieRecordSelect })
  return row ? toMovieRecord(row) : null
}

const loadMovieRating = async (
  where: Prisma.MovieWhereUniqueInput,
): Promise<RatingSummary | null> => {
  const row = await db.movie.findUnique({ where, select: movieRatingSelect })
  return row ? toRatingSummary(row) : null
}

/** The detail fresh from the database, for the result of a write. */
const readMovieDetail = async (id: string, viewer: SessionUser): Promise<MovieDetail> => {
  const [record, rating] = await Promise.all([loadMovieRecord({ id }), loadMovieRating({ id })])
  if (!record || !rating) {
    throw new NotFoundError('Movie not found')
  }
  return toMovieDetail(record, rating, viewer)
}

/** The first and last day of a year range, as the `date` column holds them (midnight UTC). */
const releasedBetween = (
  yearFrom: number | undefined,
  yearTo: number | undefined,
): Prisma.DateTimeFilter | undefined => {
  if (yearFrom === undefined && yearTo === undefined) {
    return undefined
  }
  return {
    ...(yearFrom === undefined ? {} : { gte: new Date(Date.UTC(yearFrom, 0, 1)) }),
    ...(yearTo === undefined ? {} : { lte: new Date(Date.UTC(yearTo, 11, 31)) }),
  }
}

/** A runtime range; a movie without a runtime never falls in one. */
const runtimeBetween = (
  runtimeMin: number | undefined,
  runtimeMax: number | undefined,
): Prisma.IntNullableFilter | undefined => {
  if (runtimeMin === undefined && runtimeMax === undefined) {
    return undefined
  }
  return {
    ...(runtimeMin === undefined ? {} : { gte: runtimeMin }),
    ...(runtimeMax === undefined ? {} : { lte: runtimeMax }),
  }
}

/** An average rating range in stars; an unrated movie (a null average) never falls in one. */
const ratedBetween = (
  ratingMin: number | undefined,
  ratingMax: number | undefined,
): Prisma.FloatNullableFilter | undefined => {
  if (ratingMin === undefined && ratingMax === undefined) {
    return undefined
  }
  return {
    ...(ratingMin === undefined ? {} : { gte: ratingMin }),
    ...(ratingMax === undefined ? {} : { lte: ratingMax }),
  }
}

/**
 * Public: a page of summaries, searched by title (case-insensitive, wildcards literal) and
 * filtered by genres (a movie must carry every one named), a credited person, a release year range,
 * a runtime range and an average rating range. Only the unfiltered list is cached: a search or a
 * filter is an unbounded key and is always read from the database.
 */
export const listMovies = async (query: ListMoviesQuery): Promise<Page<MovieSummary>> => {
  const { page, perPage, sort, sortBy, direction, ...filters } = parseInput(listMoviesQuery, query)
  const { q, genres, person, yearFrom, yearTo, runtimeMin, runtimeMax, ratingMin, ratingMax } =
    filters
  const load = async () => {
    const releaseDate = releasedBetween(yearFrom, yearTo)
    const runtimeMinutes = runtimeBetween(runtimeMin, runtimeMax)
    const ratingAverage = ratedBetween(ratingMin, ratingMax)
    const where: Prisma.MovieWhereInput = {
      ...(q ? { title: { contains: escapeLike(q), mode: 'insensitive' } } : {}),
      ...(genres?.length
        ? { AND: genres.map((slug) => ({ genres: { some: { genre: { slug } } } })) }
        : {}),
      ...(person ? { credits: { some: { person: { slug: person } } } } : {}),
      ...(releaseDate ? { releaseDate } : {}),
      ...(runtimeMinutes ? { runtimeMinutes } : {}),
      ...(ratingAverage ? { ratingAverage } : {}),
    }
    const [rows, totalItems] = await Promise.all([
      db.movie.findMany({
        where,
        select: movieSummarySelect,
        orderBy: sortBy
          ? [
              sortBy === 'runtimeMinutes'
                ? { runtimeMinutes: { sort: direction, nulls: 'last' } }
                : { [sortBy]: direction },
              { id: 'asc' },
            ]
          : ORDER_BY[sort],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      db.movie.count({ where }),
    ])
    return toPage(rows.map(toMovieSummary), totalItems, { page, perPage })
  }
  const filtered = Object.values(filters).some((value) =>
    Array.isArray(value) ? value.length > 0 : value !== undefined && value !== '',
  )
  if (filtered) {
    return load()
  }
  return remember(
    `movies:list:${JSON.stringify([page, perPage, sort, sortBy, direction])}`,
    {
      ttl: MOVIES_CACHE_TTL,
      tags: [CATALOG_TAG, RATINGS_TAG],
      schema: pageSchema(movieSummarySchema),
    },
    load,
  )
}

/**
 * Public: one movie with its genres, credits by role in billing order, creator and rating. A
 * malformed slug is not found, like an unknown one. The record is cached under `CATALOG_TAG` alone;
 * the rating is read beside it by primary key, so a review never expires the record (nor any other
 * movie's). `permissions` is computed per viewer after.
 */
export const getMovieBySlug = async (slug: string): Promise<MovieDetail> => {
  const viewer = await getSessionUser()
  const parsed = slugSchema.safeParse(slug)
  if (!parsed.success) {
    throw new NotFoundError('Movie not found')
  }
  const [record, rating] = await Promise.all([
    remember(
      `movie:${parsed.data}`,
      { ttl: MOVIES_CACHE_TTL, tags: [CATALOG_TAG], schema: movieRecordSchema },
      async () => {
        const loaded = await loadMovieRecord({ slug: parsed.data })
        if (!loaded) {
          throw new NotFoundError('Movie not found')
        }
        return loaded
      },
    ),
    loadMovieRating({ slug: parsed.data }),
  ])
  // Deleted since its record was cached.
  if (!rating) {
    throw new NotFoundError('Movie not found')
  }
  return toMovieDetail(record, rating, viewer)
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

/**
 * A genre or person that `assertReferencesExist` saw but that was deleted before the write landed:
 * the same field error as if it had never existed, instead of a 500.
 */
const fromReferenceViolation = (error: unknown): never => {
  if (isForeignKeyViolation(error, 'movie_genres_genre_id_fkey')) {
    throw new ValidationError({ genreIds: ['A genre does not exist'] })
  }
  if (isForeignKeyViolation(error, 'credits_person_id_fkey')) {
    throw new ValidationError({ credits: ['A person does not exist'] })
  }
  throw error
}

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
      if (!isUniqueViolation(error, 'movies_slug_key') || attempt >= CREATE_ATTEMPTS) {
        fromReferenceViolation(error)
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
  await db
    .$transaction([
      db.movie.update({ where: { id }, data: scalarData(data) }),
      db.movieGenre.deleteMany({ where: { movieId: id } }),
      db.movieGenre.createMany({
        data: data.genreIds.map((genreId) => ({ movieId: id, genreId })),
      }),
      db.credit.deleteMany({ where: { movieId: id } }),
      db.credit.createMany({
        data: toCreditRows(data.credits).map((credit) => ({ movieId: id, ...credit })),
      }),
    ])
    .catch(fromReferenceViolation)
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

/**
 * Admin only → id valid → exists → allowed → deleted (the genre links, credits and reviews
 * cascade), its poster queued.
 */
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
 * Sets the movie's poster URL and returns the one it replaced, in one transaction that first locks
 * the movie row: two writes to one movie's poster run one after the other, so the later one sees
 * (and replaces) what the earlier one set instead of losing track of it.
 */
const replacePoster = (id: string, posterUrl: string | null) =>
  db.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT 1 FROM movies WHERE id = ${id}::uuid FOR UPDATE`
    const previous = await tx.movie.findUnique({ where: { id }, select: { posterUrl: true } })
    await tx.movie.update({ where: { id }, data: { posterUrl } })
    return previous?.posterUrl ?? null
  })

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
  const replaced = await replacePoster(id, publicUrl(ownKey))
  await invalidateTags(CATALOG_TAG)
  if (keyFromPublicUrl(replaced) !== ownKey) {
    queuePosterDeletion(replaced)
  }
  return readMovieDetail(id, viewer)
}

/**
 * Admin only → id valid → exists → allowed → the poster is cleared under the same row lock as
 * `attachPoster` (so a poster attached meanwhile is the one cleared and queued, never orphaned)
 * and its object queued for deletion.
 */
export const removePoster = async (id: string): Promise<MovieDetail> => {
  const viewer = await requireAdmin()
  const movieId = parseInput(catalogIdSchema, id)
  const record = await db.movie.findUnique({
    where: { id: movieId },
    select: { id: true, createdById: true },
  })
  if (!record) {
    throw new NotFoundError('Movie not found')
  }
  authorize(moviePolicy.update, viewer, record)
  const replaced = await replacePoster(movieId, null)
  await invalidateTags(CATALOG_TAG)
  queuePosterDeletion(replaced)
  return readMovieDetail(movieId, viewer)
}
