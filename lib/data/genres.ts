import 'server-only'
import { z } from 'zod'
import type { Prisma } from '@/generated/prisma/client'
import { MINUTE } from '@/lib/constants-time'
import { catalogIdSchema } from '@/lib/dto/catalog'
import {
  genreInput,
  genreWithCountSchema,
  updateGenreInput,
  type GenreInput,
  type GenreWithCount,
  type UpdateGenreInput,
} from '@/lib/dto/genres'
import { slugify } from '@/lib/slug'
import { invalidateTags, remember } from '@/lib/server/cache'
import { requireAdmin } from './auth'
import { CATALOG_TAG } from './cacheTags'
import { db } from './db'
import { NotFoundError, parseInput, ValidationError } from './errors'
import { genrePolicy } from './policies/genre'
import { authorize } from './policy'
import { isForeignKeyViolation, isUniqueViolation } from './prismaErrors'

// Genres are reference data: public to read, admin-only to write, cached as one list.

export const genreSelect = {
  id: true,
  name: true,
  slug: true,
} satisfies Prisma.GenreSelect

const genreWithCountSelect = {
  ...genreSelect,
  _count: { select: { movies: true } },
} satisfies Prisma.GenreSelect

type GenreWithCountRow = Prisma.GenreGetPayload<{ select: typeof genreWithCountSelect }>

const toGenreWithCount = ({ _count, ...genre }: GenreWithCountRow): GenreWithCount => ({
  ...genre,
  movieCount: _count.movies,
})

const GENRES_CACHE_TTL = 5 * MINUTE

const genreTaken = () => new ValidationError({ name: ['That genre already exists'] })

/** Both `name` and `slug` are unique; either collision means the genre exists. */
const fromUniqueViolation = (error: unknown): never => {
  if (isUniqueViolation(error)) {
    throw genreTaken()
  }
  throw error
}

const stillInUse = (count: number) => {
  const message = `Remove the genre from its ${count} ${count === 1 ? 'movie' : 'movies'} first`
  return new ValidationError({ base: [message] }, message)
}

const readGenre = async (id: string): Promise<GenreWithCount> => {
  const row = await db.genre.findUnique({ where: { id }, select: genreWithCountSelect })
  if (!row) {
    throw new NotFoundError('Genre not found')
  }
  return toGenreWithCount(row)
}

/** Public: every genre by name with how many movies carry it. Cached under the catalog tag. */
export const listGenres = async (): Promise<GenreWithCount[]> => {
  return remember(
    'genres:list',
    { ttl: GENRES_CACHE_TTL, tags: [CATALOG_TAG], schema: z.array(genreWithCountSchema) },
    async () => {
      const rows = await db.genre.findMany({
        select: genreWithCountSelect,
        orderBy: [{ name: 'asc' }, { id: 'asc' }],
      })
      return rows.map(toGenreWithCount)
    },
  )
}

/**
 * Admin only (401/403) → name valid (422) → the slug is derived from the name, so a name that
 * differs only in case or punctuation from an existing genre is the same genre (422 on `name`).
 */
export const createGenre = async (input: GenreInput): Promise<GenreWithCount> => {
  await requireAdmin()
  const { name } = parseInput(genreInput, input)
  const slug = slugify(name)
  if (!slug) {
    throw new ValidationError({ name: ['Name must contain letters or digits'] })
  }
  const genre = await db.genre
    .create({ data: { name, slug }, select: { id: true } })
    .catch(fromUniqueViolation)
  await invalidateTags(CATALOG_TAG)
  return readGenre(genre.id)
}

/** Admin only → input valid → exists (404) → allowed (403) → renames; the slug never changes. */
export const updateGenre = async (input: UpdateGenreInput): Promise<GenreWithCount> => {
  const viewer = await requireAdmin()
  const { id, name } = parseInput(updateGenreInput, input)
  const record = await db.genre.findUnique({ where: { id }, select: { id: true } })
  if (!record) {
    throw new NotFoundError('Genre not found')
  }
  authorize(genrePolicy.update, viewer, record)
  await db.genre.update({ where: { id }, data: { name } }).catch(fromUniqueViolation)
  await invalidateTags(CATALOG_TAG)
  return readGenre(id)
}

/**
 * Admin only → id valid → exists → allowed → not in use: the foreign key is `Restrict`, and this
 * turns that into a message instead of a database error, also for a movie given the genre between
 * the count and the delete.
 */
export const deleteGenre = async (id: string): Promise<void> => {
  const viewer = await requireAdmin()
  const genreId = parseInput(catalogIdSchema, id)
  const record = await db.genre.findUnique({
    where: { id: genreId },
    select: genreWithCountSelect,
  })
  if (!record) {
    throw new NotFoundError('Genre not found')
  }
  authorize(genrePolicy.delete, viewer, record)
  if (record._count.movies > 0) {
    throw stillInUse(record._count.movies)
  }
  await db.genre.delete({ where: { id: genreId } }).catch(async (error: unknown) => {
    if (isForeignKeyViolation(error, 'movie_genres_genre_id_fkey')) {
      throw stillInUse(Math.max(1, await db.movieGenre.count({ where: { genreId } })))
    }
    throw error
  })
  await invalidateTags(CATALOG_TAG)
}
