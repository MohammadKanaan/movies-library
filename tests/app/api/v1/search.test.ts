// @vitest-environment node
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from '@/app/api/v1/search/route'
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

const get = (query = '') => GET(new Request(`http://localhost/api/v1/search${query}`))

describe('GET /api/v1/search', () => {
  beforeEach(resetDatabase)
  afterAll(async () => {
    await getRedis().quit()
    await db.$disconnect()
  })

  it('is public and returns the best movies and people for the term as JSON, no totals', async () => {
    const dune = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
    await seedMovie({ title: 'Dune: Part Two', releaseDate: '2024-03-01' })
    const dunia = await seedPerson('Dunia Ayaso')
    await seedPerson('Amy Adams')

    const response = await get('?q=dune&limit=1')
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      q: 'dune',
      movies: [
        {
          id: dune.id,
          slug: 'dune-2021',
          title: 'Dune',
          releaseDate: '2021-10-22T00:00:00.000Z',
          runtimeMinutes: null,
          posterUrl: null,
          genres: [],
        },
      ],
      people: [],
    })
    const people = (await (await get('?q=dun')).json()).people
    expect(people.map((person: { id: string }) => person.id)).toEqual([dunia.id])
  })

  it('answers 422 with field errors for a bad query', async () => {
    const response = await get('?q=du&limit=0')
    expect(response.status).toBe(422)
    expect(await response.json()).toMatchObject({
      code: 'VALIDATION',
      fieldErrors: { q: expect.any(Array), limit: expect.any(Array) },
    })
    expect((await get()).status).toBe(422)
  })
})
