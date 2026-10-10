// @vitest-environment node
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from '@/app/api/v1/movies/route'
import { db } from '@/lib/data/db'
import { getRedis } from '@/lib/server/redis'
import { seedGenre, seedMovie, seedPerson } from '../../../helpers/catalog'
import { resetDatabase } from '../../../helpers/server'

const { cookieStore, requestHeaders } = await vi.hoisted(
  async () => import('../../../helpers/cookies'),
)
vi.mock('next/headers', () => ({
  cookies: async () => cookieStore,
  headers: async () => requestHeaders(),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), refresh: vi.fn() }))

const get = (query = '') => GET(new Request(`http://localhost/api/v1/movies${query}`))

describe('GET /api/v1/movies', () => {
  beforeEach(resetDatabase)
  afterAll(async () => {
    await getRedis().quit()
    await db.$disconnect()
  })

  it('is public and returns the next page with the same title, genre, person and sort filters', async () => {
    const genre = await seedGenre('Drama')
    const person = await seedPerson('Amy Adams')
    const matching = {
      genreIds: [genre.id],
      credits: [{ personId: person.id, role: 'ACTOR' as const }],
    }
    await seedMovie({ title: 'Film A', releaseDate: '2020-01-01', ...matching })
    const second = await seedMovie({ title: 'Film B', releaseDate: '2021-01-01', ...matching })
    await seedMovie({ title: 'Film C', releaseDate: '2022-01-01', genreIds: [genre.id] })
    await seedMovie({ title: 'Film D', releaseDate: '2023-01-01', credits: matching.credits })
    await seedMovie({ title: 'Other title', releaseDate: '2024-01-01', ...matching })

    const response = await get('?q=film&genres=drama&person=amy-adams&sort=oldest&page=2&perPage=1')
    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({
      items: [{ id: second.id, title: 'Film B', releaseDate: '2021-01-01T00:00:00.000Z' }],
      page: 2,
      perPage: 1,
      totalItems: 2,
      totalPages: 2,
    })
  })

  it('decodes a comma-separated genre list and keeps only movies carrying every genre named', async () => {
    const [drama, thriller, comedy] = await Promise.all([
      seedGenre('Drama'),
      seedGenre('Thriller'),
      seedGenre('Comedy'),
    ])
    await seedMovie({ title: 'Both', releaseDate: '2020-01-01', genreIds: [drama.id, thriller.id] })
    await seedMovie({ title: 'Drama only', releaseDate: '2021-01-01', genreIds: [drama.id] })
    await seedMovie({ title: 'Comedy only', releaseDate: '2022-01-01', genreIds: [comedy.id] })

    const response = await get('?genres=drama,thriller&perPage=24')
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.items.map((movie: { title: string }) => movie.title)).toEqual(['Both'])
  })

  it('returns an empty final batch beyond the available movies', async () => {
    await seedMovie({ title: 'Arrival', releaseDate: '2016-01-01' })
    const response = await get('?page=2&perPage=24')
    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({
      items: [],
      page: 2,
      totalItems: 1,
      totalPages: 1,
    })
  })

  it('answers 422 with field errors for a bad query', async () => {
    const response = await get('?page=1001&perPage=0&q=de&sort=invalid&genres=Not%20A%20Slug')
    expect(response.status).toBe(422)
    expect(await response.json()).toMatchObject({
      code: 'VALIDATION',
      fieldErrors: {
        page: expect.any(Array),
        perPage: expect.any(Array),
        q: expect.any(Array),
        sort: expect.any(Array),
        'genres.0': expect.any(Array),
      },
    })
  })
})
