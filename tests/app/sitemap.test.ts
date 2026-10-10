// @vitest-environment node
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import sitemap from '@/app/sitemap'
import { PEOPLE_LIST_HIDDEN } from '@/lib/constants-routes'
import { db } from '@/lib/data/db'
import { getRedis } from '@/lib/server/redis'
import { seedGenre, seedMovie, seedPerson } from '../helpers/catalog'
import { resetDatabase } from '../helpers/server'

const { cookieStore, requestHeaders } = await vi.hoisted(async () => import('../helpers/cookies'))
vi.mock('next/headers', () => ({
  cookies: async () => cookieStore,
  headers: async () => requestHeaders(),
}))
vi.mock('next/server', () => ({ connection: vi.fn(async () => {}) }))

describe('sitemap.xml', () => {
  beforeEach(async () => {
    await resetDatabase()
    vi.stubEnv('BETTER_AUTH_URL', 'https://films.example')
  })
  afterEach(() => vi.unstubAllEnvs())
  afterAll(async () => {
    await getRedis().quit()
    await db.$disconnect()
  })

  it('lists the landing pages (the people list while shown), each genre with films, and every movie and person', async () => {
    const drama = await seedGenre('Drama')
    await seedGenre('Horror')
    const arrival = await seedMovie({
      title: 'Arrival',
      releaseDate: '2016-11-11',
      posterUrl: 'https://cdn.example/arrival.jpg',
      genreIds: [drama.id],
    })
    const amy = await seedPerson('Amy Adams')

    expect(await sitemap()).toEqual([
      { url: 'https://films.example/' },
      { url: 'https://films.example/movies' },
      ...(PEOPLE_LIST_HIDDEN ? [] : [{ url: 'https://films.example/people' }]),
      { url: 'https://films.example/movies?genres=drama' },
      {
        url: 'https://films.example/movies/arrival-2016',
        lastModified: arrival.updatedAt,
        images: ['https://cdn.example/arrival.jpg'],
      },
      { url: 'https://films.example/people/amy-adams', lastModified: amy.updatedAt },
    ])
  })
})
