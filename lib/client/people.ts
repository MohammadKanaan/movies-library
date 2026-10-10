import { pageSchema, type Page } from '@/lib/dto/common'
import { personListItemSchema, type PersonListItem } from '@/lib/dto/people'
import { RequestError } from './errors'

const PEOPLE_ENDPOINT = '/api/v1/people'
/** How many matches a typeahead shows. */
export const PEOPLE_SEARCH_LIMIT = 10

const peoplePageSchema = pageSchema(personListItemSchema)

const messageOf = async (response: Response) => {
  try {
    const body: unknown = await response.json()
    if (typeof body === 'object' && body !== null && 'message' in body) {
      return typeof body.message === 'string' ? body.message : null
    }
  } catch {
    // Not JSON: an outage page, say.
  }
  return null
}

/**
 * The first page of people whose name contains `q`, from `GET /api/v1/people`, parsed with the
 * shared DTO so dates come back as `Date`s. The facade for the credits editor's typeahead; pass the
 * `signal` of an `AbortController` to drop a search the user has already typed past.
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
    throw new RequestError(
      (await messageOf(response)) ?? 'The search failed. Try again.',
      response.status,
    )
  }
  return peoplePageSchema.parse(await response.json())
}
