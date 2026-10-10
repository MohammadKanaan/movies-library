// @vitest-environment node
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '@/lib/data/db'
import { ValidationError } from '@/lib/data/errors'
import { searchCatalog } from '@/lib/data/search'
import { getRedis } from '@/lib/server/redis'
import { seedGenre, seedMovie, seedPerson } from '../../helpers/catalog'
import { resetDatabase } from '../../helpers/server'

const { cookieStore, requestHeaders } = await vi.hoisted(
  async () => import('../../helpers/cookies'),
)
vi.mock('next/headers', () => ({
  cookies: async () => cookieStore,
  headers: async () => requestHeaders(),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), refresh: vi.fn() }))

const movieTitles = async (q: string, limit?: number) =>
  (await searchCatalog({ q, limit })).movies.items.map((movie) => movie.title)

const peopleNames = async (q: string, limit?: number) =>
  (await searchCatalog({ q, limit })).people.items.map((person) => person.name)

describe('searchCatalog', () => {
  beforeEach(resetDatabase)
  afterAll(async () => {
    await getRedis().quit()
    await db.$disconnect()
  })

  it('is public and returns the summaries and list items the lists use, with totals', async () => {
    const scifi = await seedGenre('Science Fiction')
    const denis = await seedPerson('Denis Villeneuve')
    const dune = await seedMovie({
      title: 'Dune',
      releaseDate: '2021-10-22',
      runtimeMinutes: 155,
      genreIds: [scifi.id],
      credits: [{ personId: denis.id, role: 'DIRECTOR' }],
    })
    await seedPerson('Dunia Ayaso')

    const results = await searchCatalog({ q: 'dun' })
    expect(results.q).toBe('dun')
    expect(results.movies).toEqual({
      items: [
        {
          id: dune.id,
          slug: 'dune-2021',
          title: 'Dune',
          releaseDate: new Date('2021-10-22T00:00:00.000Z'),
          runtimeMinutes: 155,
          posterUrl: null,
          genres: [{ id: scifi.id, name: 'Science Fiction', slug: 'science-fiction' }],
        },
      ],
      totalItems: 1,
    })
    expect(results.people).toEqual({
      items: [
        {
          id: expect.any(String),
          slug: 'dunia-ayaso',
          name: 'Dunia Ayaso',
          headshotUrl: null,
          creditCount: 0,
          createdAt: expect.any(Date),
        },
      ],
      totalItems: 1,
    })
  })

  it('ranks an exact match first, then a title starting with the term, then by similarity', async () => {
    await seedMovie({ title: 'Dune: Part Two', releaseDate: '2024-03-01' })
    await seedMovie({ title: 'The Dune Documentary', releaseDate: '2010-01-01' })
    await seedMovie({ title: 'Dune', releaseDate: '1984-12-14' })
    await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
    await seedMovie({ title: 'Dunkirk', releaseDate: '2017-07-21' })
    const titles = await movieTitles('dune')
    // Exact titles first (the newer one before the older), then the prefix match, then the rest.
    expect(titles.slice(0, 2)).toEqual(['Dune', 'Dune'])
    expect(titles[2]).toBe('Dune: Part Two')
    expect(titles[3]).toBe('The Dune Documentary')
    expect(titles).not.toContain('Dunkirk')
    const years = (await searchCatalog({ q: 'dune' })).movies.items
      .slice(0, 2)
      .map((movie) => movie.releaseDate.getUTCFullYear())
    expect(years).toEqual([2021, 1984])
  })

  it('ranks people the same way, A–Z among equals', async () => {
    await seedPerson('Amy Adams')
    await seedPerson('Adam Driver')
    await seedPerson('Adam Sandler')
    await seedPerson('Bryce Dallas Howard')
    await seedPerson('Adam')
    expect(await peopleNames('adam')).toEqual(['Adam', 'Adam Driver', 'Adam Sandler', 'Amy Adams'])
    expect(await peopleNames('dam')).toHaveLength(4)
  })

  it('caps each kind at the limit while the totals count everything', async () => {
    for (const year of [2010, 2011, 2012, 2013]) {
      await seedMovie({ title: `Film ${year}`, releaseDate: `${year}-01-01` })
    }
    await seedPerson('Filmmaker One')
    await seedPerson('Filmmaker Two')
    const results = await searchCatalog({ q: 'film', limit: 2 })
    expect(results.movies.items).toHaveLength(2)
    expect(results.movies.totalItems).toBe(4)
    expect(results.people.items).toHaveLength(2)
    expect(results.people.totalItems).toBe(2)
    // Newest first among equally ranked movies.
    expect(results.movies.items.map((movie) => movie.title)).toEqual(['Film 2013', 'Film 2012'])
  })

  it('matches case-insensitively and treats wildcards literally', async () => {
    await seedMovie({ title: '100% Wolf', releaseDate: '2020-05-29' })
    await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
    expect(await movieTitles('DUNE')).toEqual(['Dune'])
    expect(await movieTitles('100%')).toEqual(['100% Wolf'])
    expect(await movieTitles('d_ne')).toEqual([])
    expect((await searchCatalog({ q: '100%' })).movies.totalItems).toBe(1)
  })

  it('validates the query', async () => {
    await expect(searchCatalog({ q: 'du' })).rejects.toBeInstanceOf(ValidationError)
    await expect(searchCatalog({ q: '' })).rejects.toBeInstanceOf(ValidationError)
    await expect(searchCatalog({ q: 'dune', limit: 0 })).rejects.toBeInstanceOf(ValidationError)
    await expect(searchCatalog({ q: 'dune', limit: 1000 })).rejects.toBeInstanceOf(ValidationError)
  })

  it('finds nothing without error', async () => {
    expect(await searchCatalog({ q: 'nothing' })).toEqual({
      q: 'nothing',
      movies: { items: [], totalItems: 0 },
      people: { items: [], totalItems: 0 },
    })
  })
})
