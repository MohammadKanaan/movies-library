// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { generateOpenApi } from '@/lib/openapi'

describe('generated OpenAPI document', () => {
  it('documents only the public people and health HTTP operations', () => {
    const spec = generateOpenApi()
    expect(spec.openapi).toBe('3.1.0')
    expect(Object.keys(spec.paths ?? {}).sort()).toEqual(['/api/health', '/api/v1/people'])
    expect(Object.keys(spec.paths?.['/api/v1/people']?.get?.responses ?? {})).toEqual([
      '200',
      '422',
    ])
    expect(Object.keys(spec.paths?.['/api/health']?.get?.responses ?? {})).toEqual(['200', '503'])
    expect(spec.servers).toEqual([{ url: '/' }])
    expect(spec.security).toBeUndefined()
    expect(spec.components?.securitySchemes).toBeUndefined()
    expect(spec.info.description).toMatch(/Server Actions/)
    expect(spec.info.description).toMatch(/disabled/)
    expect(spec.info.description).toContain('https://www.better-auth.com/docs')
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
        description: expect.stringMatching(/trim/i),
      }),
    })
    const searchSchema = q && 'schema' in q ? q.schema : undefined
    expect(searchSchema).not.toHaveProperty('minLength')
    expect(searchSchema).toHaveProperty('description', expect.stringMatching(/empty/i))
    expect(searchSchema).toHaveProperty('description', expect.stringMatching(/3 characters/i))
    expect(searchSchema).toHaveProperty(
      'description',
      expect.stringMatching(/case-insensitive literal/i),
    )
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
