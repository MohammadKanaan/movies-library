import 'server-only'
import type { Prisma } from '@/generated/prisma/client'
import type { MovieSummary } from '@/lib/dto/movies'
import { genreSelect } from './genres'

// The `MovieSummary` DTO's select and mapper, in a file of their own: `movies.ts` imports
// `people.ts` for the credits' people, and `people.ts` needs the summary for filmographies.
// `admin.ts` and `search.ts` reuse them too.

/** Exactly the `MovieSummary` DTO (`toMovieSummary` flattens the genre join). */
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

export type MovieSummaryRow = Prisma.MovieGetPayload<{ select: typeof movieSummarySelect }>

export const toMovieSummary = ({ genres, ...movie }: MovieSummaryRow): MovieSummary => ({
  ...movie,
  genres: genres.map(({ genre }) => genre),
})
