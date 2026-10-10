import { searchResultsSchema, type SearchResults } from '@/lib/dto/search'
import { requestErrorOf } from './errors'

const SEARCH_ENDPOINT = '/api/v1/search'
/** How many movies and how many people the NavBar's suggestions show. */
export const SEARCH_SUGGESTIONS_LIMIT = 5

/**
 * The best matches for `q` across movies and people, from `GET /api/v1/search`, parsed with the
 * shared DTO so dates come back as `Date`s. The facade for the NavBar's typeahead; pass the `signal`
 * of an `AbortController` to drop a search the user has already typed past.
 */
export const searchCatalog = async (q: string, signal?: AbortSignal): Promise<SearchResults> => {
  const query = new URLSearchParams({ q, limit: String(SEARCH_SUGGESTIONS_LIMIT) })
  const response = await fetch(`${SEARCH_ENDPOINT}?${query}`, {
    headers: { Accept: 'application/json' },
    signal,
  })
  if (!response.ok) {
    throw await requestErrorOf(response, 'The search failed. Try again.')
  }
  return searchResultsSchema.parse(await response.json())
}
