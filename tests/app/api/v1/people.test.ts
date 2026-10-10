// @vitest-environment node
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from '@/app/api/v1/people/route'
import { db } from '@/lib/data/db'
import { getRedis } from '@/lib/server/redis'
import { seedMovie, seedPerson } from '../../../helpers/catalog'
import { resetDatabase } from '../../../helpers/server'

const { cookieStore, requestHeaders } = await vi.hoisted(
  async () => import('../../../helpers/cookies'),
)
vi.mock('next/headers', () => ({
  cookies: async () => cookieStore,
  headers: async () => requestHeaders(),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), refresh: vi.fn() }))

const get = (query = '') => GET(new Request(`http://localhost/api/v1/people${query}`))

describe('GET /api/v1/people', () => {
  beforeEach(resetDatabase)
  afterAll(async () => {
    await getRedis().quit()
    await db.$disconnect()
  })

  it('is public and returns a page of people as JSON, searched by name', async () => {
    const denis = await seedPerson('Denis Villeneuve')
    await seedPerson('Amy Adams')
    await seedMovie({
      title: 'Dune',
      releaseDate: '2021-10-22',
      credits: [{ personId: denis.id, role: 'DIRECTOR' }],
    })

    const response = await get('?q=denis&perPage=5')
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      items: [
        {
          id: denis.id,
          slug: 'denis-villeneuve',
          name: 'Denis Villeneuve',
          creditCount: 1,
          createdAt: expect.any(String),
        },
      ],
      page: 1,
      perPage: 5,
      totalItems: 1,
      totalPages: 1,
    })
    expect((await (await get()).json()).totalItems).toBe(2)
  })

  it('answers 422 with field errors for a bad query', async () => {
    const response = await get('?q=de&page=0')
    expect(response.status).toBe(422)
    expect(await response.json()).toMatchObject({
      code: 'VALIDATION',
      fieldErrors: { q: expect.any(Array), page: expect.any(Array) },
    })
  })
})
