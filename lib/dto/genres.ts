import { z } from 'zod'
import { catalogIdSchema } from './catalog'

export const GENRE_NAME_MAX_LENGTH = 50

/** A genre as every reader sees it (on a movie, in a filter). */
export const genreSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
})

export type Genre = z.infer<typeof genreSchema>

/** One row of the genre list: the genre and how many movies carry it. */
export const genreWithCountSchema = genreSchema.extend({
  movieCount: z.number().int(),
})

export type GenreWithCount = z.infer<typeof genreWithCountSchema>

/** Create: the slug is derived from the name. Update: the name only, the slug is kept. */
export const genreInput = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(GENRE_NAME_MAX_LENGTH, `Name must be ${GENRE_NAME_MAX_LENGTH} characters or fewer`),
})

export type GenreInput = z.infer<typeof genreInput>

export const updateGenreInput = genreInput.extend({ id: catalogIdSchema })

export type UpdateGenreInput = z.infer<typeof updateGenreInput>
