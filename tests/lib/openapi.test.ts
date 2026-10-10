// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { generateOpenApi } from '@/lib/openapi'

const parameterNamed = (path: string, name: string) => {
  const spec = generateOpenApi()
  const parameters = spec.paths?.[path]?.get?.parameters ?? []
  return parameters.find((parameter) => 'name' in parameter && parameter.name === name)
}

describe('generated OpenAPI document', () => {
  it('documents every public HTTP operation and nothing else', () => {
    const spec = generateOpenApi()
    expect(Object.keys(spec.paths ?? {}).sort()).toEqual([
      '/api/health',
      '/api/v1/movies',
      '/api/v1/people',
      '/api/v1/search',
    ])
    for (const path of ['/api/v1/movies', '/api/v1/people', '/api/v1/search']) {
      expect(Object.keys(spec.paths?.[path]?.get?.responses ?? {})).toEqual(['200', '422', '429'])
    }
    expect(Object.keys(spec.paths?.['/api/health']?.get?.responses ?? {})).toEqual(['200', '503'])
    expect(spec.security).toBeUndefined()
    expect(spec.components?.securitySchemes).toBeUndefined()
  })

  it('keeps every query optional while documenting numeric bounds and defaults', () => {
    const spec = generateOpenApi()
    const parameters = spec.paths?.['/api/v1/people']?.get?.parameters
    expect(parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'page',
          in: 'query',
          schema: expect.objectContaining({
            type: 'integer',
            exclusiveMinimum: 0,
            maximum: 1000,
            default: 1,
          }),
        }),
        expect.objectContaining({
          name: 'perPage',
          in: 'query',
          schema: expect.objectContaining({
            type: 'integer',
            exclusiveMinimum: 0,
            maximum: 100,
            default: 10,
          }),
        }),
        expect.objectContaining({ name: 'q', in: 'query' }),
      ]),
    )
    for (const parameter of parameters ?? []) {
      expect(parameter).not.toHaveProperty('required', true)
    }
    const q = parameters?.find((parameter) => 'name' in parameter && parameter.name === 'q')
    expect(q).toMatchObject({
      schema: expect.objectContaining({
        type: 'string',
        maxLength: 100,
      }),
    })
    const searchSchema = q && 'schema' in q ? q.schema : undefined
    expect(searchSchema).not.toHaveProperty('minLength')
  })

  it('documents the movie list’s filters as the URL carries them', () => {
    const spec = generateOpenApi()
    const names = (spec.paths?.['/api/v1/movies']?.get?.parameters ?? []).map((parameter) =>
      'name' in parameter ? parameter.name : '',
    )
    expect(names.sort()).toEqual([
      'genres',
      'page',
      'perPage',
      'person',
      'q',
      'runtimeMax',
      'runtimeMin',
      'sort',
      'yearFrom',
      'yearTo',
    ])
    for (const parameter of spec.paths?.['/api/v1/movies']?.get?.parameters ?? []) {
      expect(parameter).not.toHaveProperty('required', true)
    }
    expect(parameterNamed('/api/v1/movies', 'genres')).toMatchObject({
      schema: expect.objectContaining({ type: 'string' }),
    })
    expect(parameterNamed('/api/v1/movies', 'sort')).toMatchObject({
      schema: expect.objectContaining({
        enum: ['newest', 'oldest', 'title', 'added'],
        default: 'newest',
      }),
    })
    expect(parameterNamed('/api/v1/movies', 'yearFrom')).toMatchObject({
      schema: expect.objectContaining({ type: 'integer' }),
    })
    expect(parameterNamed('/api/v1/movies', 'runtimeMax')).toMatchObject({
      schema: expect.objectContaining({ type: 'integer', minimum: 1, maximum: 1000 }),
    })
    expect(spec.paths?.['/api/v1/movies']?.get?.responses?.['200']).toMatchObject({
      content: { 'application/json': { schema: { $ref: '#/components/schemas/MoviesPage' } } },
    })
    expect(spec.components?.schemas?.MoviesPage).toMatchObject({
      properties: {
        items: {
          items: {
            required: expect.arrayContaining(['slug', 'title', 'releaseDate', 'genres']),
            properties: { releaseDate: { type: 'string', format: 'date-time' } },
          },
        },
      },
    })
  })

  it('documents the search term as required and the limit with its bounds', () => {
    const spec = generateOpenApi()
    expect(parameterNamed('/api/v1/search', 'q')).toMatchObject({
      required: true,
      schema: expect.objectContaining({ type: 'string', maxLength: 100 }),
    })
    expect(parameterNamed('/api/v1/search', 'limit')).toMatchObject({
      schema: expect.objectContaining({
        type: 'integer',
        exclusiveMinimum: 0,
        maximum: 25,
        default: 10,
      }),
    })
    expect(parameterNamed('/api/v1/search', 'limit')).not.toHaveProperty('required', true)
    expect(spec.components?.schemas?.SearchSuggestions).toMatchObject({
      required: ['q', 'movies', 'people'],
      properties: { movies: { type: 'array' }, people: { type: 'array' } },
    })
  })

  it('publishes paginated person DTOs with ISO date-time strings on the wire', () => {
    const spec = generateOpenApi()
    expect(spec.paths?.['/api/v1/people']?.get?.responses?.['200']).toMatchObject({
      content: { 'application/json': { schema: { $ref: '#/components/schemas/PeoplePage' } } },
    })
    expect(spec.components?.schemas?.PeoplePage).toMatchObject({
      type: 'object',
      required: ['items', 'page', 'perPage', 'totalItems', 'totalPages'],
      properties: {
        items: {
          type: 'array',
          items: {
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              slug: { type: 'string' },
              creditCount: { type: 'integer', minimum: 0 },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    })
  })

  it('uses health and error DTOs for documented response bodies', () => {
    const spec = generateOpenApi()
    expect(spec.components?.schemas?.Health).toMatchObject({
      required: ['status', 'checks'],
      properties: {
        status: { enum: ['ok', 'degraded'] },
        checks: {
          required: ['db', 'redis'],
          properties: { db: { enum: ['ok', 'fail'] }, redis: { enum: ['ok', 'fail'] } },
        },
      },
    })
    expect(spec.components?.schemas?.ErrorBody).toMatchObject({
      required: ['code', 'message'],
      properties: {
        code: { enum: ['UNAUTHORIZED', 'FORBIDDEN', 'NOT_FOUND', 'VALIDATION', 'RATE_LIMITED'] },
        fieldErrors: {
          type: 'object',
          additionalProperties: { type: 'array', items: { type: 'string' } },
        },
      },
    })
  })
})
