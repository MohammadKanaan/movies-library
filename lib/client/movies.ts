import { pageSchema, type Page } from '@/lib/dto/common'
import { movieSummarySchema, type ListMoviesQuery, type MovieSummary } from '@/lib/dto/movies'
import { requestErrorOf } from './errors'

const moviesPageSchema = pageSchema(movieSummarySchema)

/**
 * One page of the catalog from `GET /api/v1/movies`, parsed with the shared DTO so dates come back
 * as `Date`s. The facade for the movie list's infinite scroll; pass the `signal` of an
 * `AbortController` to drop a batch the reader has already navigated past.
 */
export const fetchMovies = async (
  query: ListMoviesQuery,
  signal?: AbortSignal,
): Promise<Page<MovieSummary>> => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') {
      continue
    }
    // `genres` travels as the comma-separated list the URL schema decodes.
    params.set(key, Array.isArray(value) ? value.join(',') : String(value))
  }
  const response = await fetch(`/api/v1/movies?${params}`, {
    headers: { Accept: 'application/json' },
    signal,
  })
  if (!response.ok) {
    throw await requestErrorOf(response, 'Could not load more movies. Try again.')
  }
  return moviesPageSchema.parse(await response.json())
}
