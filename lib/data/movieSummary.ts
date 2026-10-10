import 'server-only'
import type { Prisma } from '@/generated/prisma/client'
import type { MovieSummary } from '@/lib/dto/movies'
import { genreSelect } from './genres'
import { movieRatingSelect, toRatingSummary } from './reviews'

// The `MovieSummary` DTO's select and mapper, in a file of their own: `movies.ts` imports
// `people.ts` for the credits' people, and `people.ts` needs the summary for filmographies.
// `admin.ts` and `search.ts` reuse them too.

/** The summary's fields without its rating: what the movie detail's cached record shares with it. */
export const movieFieldsSelect = {
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

/** Exactly the `MovieSummary` DTO (`toMovieSummary` flattens the genre join and gathers the rating). */
export const movieSummarySelect = {
  ...movieFieldsSelect,
  ...movieRatingSelect,
} satisfies Prisma.MovieSelect

export type MovieSummaryRow = Prisma.MovieGetPayload<{ select: typeof movieSummarySelect }>

export const toMovieSummary = ({
  genres,
  ratingAverage,
  ratingCount,
  ...movie
}: MovieSummaryRow): MovieSummary => ({
  ...movie,
  genres: genres.map(({ genre }) => genre),
  rating: toRatingSummary({ ratingAverage, ratingCount }),
})
