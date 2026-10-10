import { z } from 'zod'
import { SEARCH_MIN_LENGTH, searchTermSchema } from './common'
import { movieSummarySchema } from './movies'
import { personListItemSchema } from './people'

export const SEARCH_MAX_LENGTH = 100
/** How many of each kind one search returns at most; the lists have the full pages. */
export const SEARCH_LIMIT_MAX = 25
export const SEARCH_LIMIT_DEFAULT = 10

/**
 * One search across the catalog: a term (at least three characters, the trigram indexes' floor)
 * and how many matches of each kind to return.
 */
export const searchCatalogQuery = z.object({
  q: searchTermSchema(SEARCH_MAX_LENGTH).refine((term) => term.length > 0, {
    error: `Search needs at least ${SEARCH_MIN_LENGTH} characters`,
  }),
  limit: z.coerce.number().int().positive().max(SEARCH_LIMIT_MAX).default(SEARCH_LIMIT_DEFAULT),
})

export type SearchCatalogQuery = z.input<typeof searchCatalogQuery>

const matchesSchema = <T extends z.ZodType>(item: T) =>
  z.object({
    /** The best matches, in rank order, at most `limit` of them. */
    items: z.array(item),
    /** How many match in all; the list pages (`/movies?q=`, `/people?q=`) show the rest. */
    totalItems: z.number().int().nonnegative(),
  })

/** What a search found: the best-ranked movies and people for the term, with totals. */
export const searchResultsSchema = z.object({
  q: z.string(),
  movies: matchesSchema(movieSummarySchema),
  people: matchesSchema(personListItemSchema),
})

export type SearchResults = z.infer<typeof searchResultsSchema>

/**
 * What the typeahead shows: the best-ranked movies and people for the term, without the totals the
 * search page displays (`GET /api/v1/search`, `suggestCatalog`).
 */
export const searchSuggestionsSchema = z.object({
  q: z.string(),
  movies: z.array(movieSummarySchema),
  people: z.array(personListItemSchema),
})

export type SearchSuggestions = z.infer<typeof searchSuggestionsSchema>

/**
 * The tolerant URL contract of the search page: the term as typed (trimmed and bounded), so a term
 * that is too short is shown back with the hint instead of being dropped.
 */
export const searchUrlQuery = z.object({
  q: z.string().trim().max(SEARCH_MAX_LENGTH).catch(''),
})

export type SearchUrlQuery = z.output<typeof searchUrlQuery>

/** Whether `q` is a term the search accepts. */
export const isSearchable = (q: string) => q.trim().length >= SEARCH_MIN_LENGTH
