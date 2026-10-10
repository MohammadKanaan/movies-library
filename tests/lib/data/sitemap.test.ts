// @vitest-environment node
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '@/lib/data/db'
import { updatePerson } from '@/lib/data/people'
import { getSitemapCatalog } from '@/lib/data/sitemap'
import { getRedis } from '@/lib/server/redis'
import { seedMovie, seedPerson } from '../../helpers/catalog'
import { createUser, resetDatabase, signInAs } from '../../helpers/server'

const { cookieStore, requestHeaders } = await vi.hoisted(
  async () => import('../../helpers/cookies'),
)
vi.mock('next/headers', () => ({
  cookies: async () => cookieStore,
  headers: async () => requestHeaders(),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), refresh: vi.fn() }))

describe('sitemap DAL', () => {
  beforeEach(resetDatabase)
  afterAll(async () => {
    await getRedis().quit()
    await db.$disconnect()
  })

  it('is public and lists every movie and person by slug, with when they changed and their image', async () => {
    const dune = await seedMovie({
      title: 'Dune',
      releaseDate: '2021-10-22',
      posterUrl: 'https://cdn.example/dune.jpg',
    })
    const arrival = await seedMovie({ title: 'Arrival', releaseDate: '2016-11-11' })
    const amy = await seedPerson('Amy Adams')

    expect(await getSitemapCatalog()).toEqual({
      movies: [
        { slug: 'arrival-2016', updatedAt: arrival.updatedAt, imageUrl: null },
        { slug: 'dune-2021', updatedAt: dune.updatedAt, imageUrl: 'https://cdn.example/dune.jpg' },
      ],
      people: [{ slug: 'amy-adams', updatedAt: amy.updatedAt, imageUrl: null }],
    })
  })

  it('is cached until a catalog write invalidates it', async () => {
    const amy = await seedPerson('Amy Adams')
    expect((await getSitemapCatalog()).people).toHaveLength(1)
    // A write that bypasses the DAL is not seen: the entry is served from Redis.
    await seedPerson('Jeremy Renner')
    expect((await getSitemapCatalog()).people).toHaveLength(1)

    await signInAs(await createUser({ role: 'admin' }))
    await updatePerson({ id: amy.id, name: 'Amy Adams' })
    expect((await getSitemapCatalog()).people.map((person) => person.slug)).toEqual([
      'amy-adams',
      'jeremy-renner',
    ])
  })
})
