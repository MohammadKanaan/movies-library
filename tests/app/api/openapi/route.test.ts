// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { GET } from '@/app/api/openapi/route'

describe('GET /api/openapi', () => {
  it('returns the specification as JSON without a session or infrastructure', async () => {
    const response = GET()
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    expect(response.headers.get('set-cookie')).toBeNull()
    expect(await response.json()).toMatchObject({
      openapi: '3.1.0',
      paths: { '/api/v1/people': { get: {} }, '/api/health': { get: {} } },
    })
  })
})
