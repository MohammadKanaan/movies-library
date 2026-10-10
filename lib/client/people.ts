import { pageSchema, type Page } from '@/lib/dto/common'
import { personListItemSchema, type PersonListItem } from '@/lib/dto/people'
import { requestErrorOf } from './errors'

const PEOPLE_ENDPOINT = '/api/v1/people'
/** How many matches a typeahead shows. */
export const PEOPLE_SEARCH_LIMIT = 10

const peoplePageSchema = pageSchema(personListItemSchema)

/**
 * The first page of people whose name contains `q`, from `GET /api/v1/people`, parsed with the
 * shared DTO so dates come back as `Date`s. The facade for the people typeaheads (the credits
 * editor, the movie list's person filter); pass the `signal` of an `AbortController` to drop a
 * search the user has already typed past.
 */
export const searchPeople = async (
  q: string,
  signal?: AbortSignal,
): Promise<Page<PersonListItem>> => {
  const query = new URLSearchParams({ q, perPage: String(PEOPLE_SEARCH_LIMIT) })
  const response = await fetch(`${PEOPLE_ENDPOINT}?${query}`, {
    headers: { Accept: 'application/json' },
    signal,
  })
  if (!response.ok) {
    throw await requestErrorOf(response, 'The search failed. Try again.')
  }
  return peoplePageSchema.parse(await response.json())
}
