import { createDocument, createSchema } from 'zod-openapi'
import { pageSchema, SEARCH_MIN_LENGTH } from '@/lib/dto/common'
import { errorBodySchema } from '@/lib/dto/errors'
import { healthSchema } from '@/lib/dto/health'
import { listPeopleQuery, PEOPLE_SEARCH_MAX_LENGTH, personListItemSchema } from '@/lib/dto/people'

// Query coercion accepts strings at runtime, but clients need the parsed numeric constraints.
// Keep the original defaulted schemas so input optionality survives the output-schema override.
const peopleQuery = listPeopleQuery.extend({
  page: listPeopleQuery.shape.page.meta({
    override: createSchema(listPeopleQuery.shape.page, { io: 'output' }).schema,
  }),
  perPage: listPeopleQuery.shape.perPage.meta({
    override: createSchema(listPeopleQuery.shape.perPage, { io: 'output' }).schema,
  }),
  q: listPeopleQuery.shape.q.describe(
    `Trimmed before validation. Omitted or empty query means no search. A non-empty query needs at least ${SEARCH_MIN_LENGTH} characters and at most ${PEOPLE_SEARCH_MAX_LENGTH} characters. Matches names with case-insensitive literal search; wildcard characters are treated literally.`,
  ),
})

const peoplePage = pageSchema(personListItemSchema).meta({ id: 'PeoplePage' })
const errorBody = errorBodySchema.meta({ id: 'ErrorBody' })
const health = healthSchema.meta({ id: 'Health' })

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
                      items: [
                        {
                          id: 'b3ffea3c-d968-4bf9-b7b2-2773f0c7d25d',
                          slug: 'greta-gerwig',
                          name: 'Greta Gerwig',
                          creditCount: 3,
                          createdAt: '2026-10-10T08:00:00.000Z',
                        },
                      ],
                      page: 1,
                      perPage: 10,
                      totalItems: 1,
                      totalPages: 1,
                    },
                  },
                },
              },
              422: {
                description: 'Invalid search or pagination query, with per-field errors.',
                content: { 'application/json': { schema: errorBody } },
              },
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
