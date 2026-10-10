import { createDocument, createSchema } from 'zod-openapi'
import type { z } from 'zod'
import { pageSchema, SEARCH_MIN_LENGTH } from '@/lib/dto/common'
import { errorBodySchema } from '@/lib/dto/errors'
import { healthSchema } from '@/lib/dto/health'
import {
  listMoviesUrlQuery,
  MOVIE_GENRES_MAX,
  MOVIE_SEARCH_MAX_LENGTH,
  movieSummarySchema,
} from '@/lib/dto/movies'
import { listPeopleQuery, PEOPLE_SEARCH_MAX_LENGTH, personListItemSchema } from '@/lib/dto/people'
import { searchCatalogQuery, SEARCH_MAX_LENGTH, searchSuggestionsSchema } from '@/lib/dto/search'

// Every public Route Handler (`app/api/**`) has a path here; a new handler adds its own. Query
// coercion accepts strings at runtime, but clients need the parsed numeric constraints, so each
// coerced number is documented with its output schema (`numeric`) while the original defaulted
// schema keeps the input optionality. Refinements JSON Schema cannot express (a minimum search
// length that allows the empty string, an ordered range) are described beside the parameter.

/** A coerced numeric query field, documented with its parsed integer bounds and default. */
const numeric = <S extends z.ZodType>(schema: S): S =>
  schema.meta({ override: createSchema(schema, { io: 'output' }).schema })

const searchDescription = (maxLength: number, matches: string) =>
  `Trimmed before validation. Omitted or empty query means no search. A non-empty query needs at least ${SEARCH_MIN_LENGTH} characters and at most ${maxLength} characters. Matches ${matches} with case-insensitive literal search; wildcard characters are treated literally.`

const peopleQuery = listPeopleQuery.extend({
  page: numeric(listPeopleQuery.shape.page),
  perPage: numeric(listPeopleQuery.shape.perPage),
  q: listPeopleQuery.shape.q.describe(searchDescription(PEOPLE_SEARCH_MAX_LENGTH, 'names')),
})

const moviesQuery = listMoviesUrlQuery.safeExtend({
  page: numeric(listMoviesUrlQuery.shape.page),
  perPage: numeric(listMoviesUrlQuery.shape.perPage),
  q: listMoviesUrlQuery.shape.q.describe(searchDescription(MOVIE_SEARCH_MAX_LENGTH, 'titles')),
  genres: listMoviesUrlQuery.shape.genres.describe(
    `Genre slugs, comma-separated (at most ${MOVIE_GENRES_MAX}); only movies carrying every one of them are listed.`,
  ),
  person: listMoviesUrlQuery.shape.person.describe(
    'The slug of a person; only movies they are credited on are listed.',
  ),
  yearFrom: numeric(listMoviesUrlQuery.shape.yearFrom).describe(
    'Only movies released in or after this year. With yearTo, must not be after it.',
  ),
  yearTo: numeric(listMoviesUrlQuery.shape.yearTo).describe(
    'Only movies released in or before this year.',
  ),
  runtimeMin: numeric(listMoviesUrlQuery.shape.runtimeMin).describe(
    'Only movies at least this long, in minutes. With runtimeMax, must not be above it.',
  ),
  runtimeMax: numeric(listMoviesUrlQuery.shape.runtimeMax).describe(
    'Only movies at most this long, in minutes. A movie without a runtime never falls in a range.',
  ),
  sort: listMoviesUrlQuery.shape.sort.describe(
    'newest and oldest order by release date, title alphabetically, added by when the catalog gained the movie (latest first).',
  ),
})

const searchQuery = searchCatalogQuery.extend({
  q: searchCatalogQuery.shape.q.describe(
    `Trimmed before validation; at least ${SEARCH_MIN_LENGTH} and at most ${SEARCH_MAX_LENGTH} characters. Matches titles and names with case-insensitive literal search; wildcard characters are treated literally.`,
  ),
  limit: numeric(searchCatalogQuery.shape.limit).describe(
    'How many movies and how many people to return at most.',
  ),
})

const moviesPage = pageSchema(movieSummarySchema).meta({ id: 'MoviesPage' })
const peoplePage = pageSchema(personListItemSchema).meta({ id: 'PeoplePage' })
const searchSuggestions = searchSuggestionsSchema.meta({ id: 'SearchSuggestions' })
const errorBody = errorBodySchema.meta({ id: 'ErrorBody' })
const health = healthSchema.meta({ id: 'Health' })

const movieExample = {
  id: '0199c2e8-4f1a-7c3b-9d2e-5a6b7c8d9e0f',
  slug: 'dune-2021',
  title: 'Dune',
  releaseDate: '2021-10-22T00:00:00.000Z',
  runtimeMinutes: 155,
  posterUrl: null,
  genres: [
    {
      id: '0199c2e8-4f1a-7c3b-9d2e-5a6b7c8d9e10',
      name: 'Science Fiction',
      slug: 'science-fiction',
    },
  ],
}

const personExample = {
  id: 'b3ffea3c-d968-4bf9-b7b2-2773f0c7d25d',
  slug: 'greta-gerwig',
  name: 'Greta Gerwig',
  headshotUrl: null,
  creditCount: 3,
  createdAt: '2026-10-10T08:00:00.000Z',
}

const invalidQuery = {
  description: 'Invalid search, filter or pagination query, with per-field errors.',
  content: { 'application/json': { schema: errorBody } },
}

/** DTO-only documentation: generating it never initializes the DAL, auth, DB, or Redis. */
export const generateOpenApi = () =>
  createDocument(
    {
      openapi: '3.1.0',
      info: {
        title: 'Movies Library API',
        version: '1.0.0',
        description:
          'Public HTTP endpoints for Movies Library. Account operations use Server Actions. Selected Better Auth account HTTP routes are intentionally disabled to enforce application rules. Authentication operations are excluded from this generated API contract. See the [Better Auth documentation](https://www.better-auth.com/docs) for the upstream authentication library.',
      },
      servers: [{ url: '/' }],
      paths: {
        '/api/v1/movies': {
          get: {
            operationId: 'listMovies',
            summary: 'List movies',
            description:
              'Public, paginated movie list, searched by title and filtered by genres, a credited person, a release year range and a runtime range.',
            tags: ['Movies'],
            requestParams: { query: moviesQuery },
            responses: {
              200: {
                description: 'Paginated movies.',
                content: {
                  'application/json': {
                    schema: moviesPage,
                    example: {
                      items: [movieExample],
                      page: 1,
                      perPage: 10,
                      totalItems: 1,
                      totalPages: 1,
                    },
                  },
                },
              },
              422: invalidQuery,
            },
          },
        },
        '/api/v1/people': {
          get: {
            operationId: 'listPeople',
            summary: 'List people',
            description:
              'Public, paginated people list ordered by name, optionally filtered by name.',
            tags: ['People'],
            requestParams: { query: peopleQuery },
            responses: {
              200: {
                description: 'Paginated people.',
                content: {
                  'application/json': {
                    schema: peoplePage,
                    example: {
                      items: [personExample],
                      page: 1,
                      perPage: 10,
                      totalItems: 1,
                      totalPages: 1,
                    },
                  },
                },
              },
              422: invalidQuery,
            },
          },
        },
        '/api/v1/search': {
          get: {
            operationId: 'suggestCatalog',
            summary: 'Search the catalog',
            description:
              'Public quick search: the best-ranked movies (by title) and people (by name) for a term, without totals. An exact title or name ranks first, then one starting with the term, then by similarity.',
            tags: ['Search'],
            requestParams: { query: searchQuery },
            responses: {
              200: {
                description: 'The best matches of each kind, in rank order.',
                content: {
                  'application/json': {
                    schema: searchSuggestions,
                    example: { q: 'dune', movies: [movieExample], people: [] },
                  },
                },
              },
              422: invalidQuery,
            },
          },
        },
        '/api/health': {
          get: {
            operationId: 'checkHealth',
            summary: 'Check service health',
            description:
              'Public, live database and Redis probe. Only dependency status is returned.',
            tags: ['Health'],
            responses: {
              200: {
                description: 'Healthy: both dependencies responded successfully.',
                content: {
                  'application/json': {
                    schema: health,
                    example: { status: 'ok', checks: { db: 'ok', redis: 'ok' } },
                  },
                },
              },
              503: {
                description: 'Degraded: at least one dependency failed or timed out.',
                content: {
                  'application/json': {
                    schema: health,
                    example: { status: 'degraded', checks: { db: 'fail', redis: 'ok' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      override: ({ jsonSchema, zodSchema, io }) => {
        // Response.json serializes the DTO's Date objects as ISO strings.
        if (zodSchema._zod.def.type === 'date' && io === 'output') {
          jsonSchema.type = 'string'
          jsonSchema.format = 'date-time'
        }
      },
    },
  )
