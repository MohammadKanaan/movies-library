// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RequestError } from '@/lib/client/errors'
import { searchCatalog, SEARCH_SUGGESTIONS_LIMIT } from '@/lib/client/search'

const results = {
  q: 'dune',
  movies: {
    items: [
      {
        id: '0190d1a2-0000-7000-8000-000000000001',
        slug: 'dune-2021',
        title: 'Dune',
        releaseDate: '2021-10-22T00:00:00.000Z',
        runtimeMinutes: 155,
        posterUrl: null,
        genres: [],
      },
    ],
    totalItems: 1,
  },
  people: { items: [], totalItems: 0 },
}

describe('searchCatalog', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('GETs the search endpoint with the term and the suggestion limit, reviving dates', async () => {
    const fetchMock = vi.fn(async () => Response.json(results))
    vi.stubGlobal('fetch', fetchMock)
    const controller = new AbortController()

    const result = await searchCatalog('dune', controller.signal)

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe(`/api/v1/search?q=dune&limit=${SEARCH_SUGGESTIONS_LIMIT}`)
    expect(init.headers).toEqual({ Accept: 'application/json' })
    expect(init.signal).toBe(controller.signal)
    expect(result.movies.items[0]?.releaseDate).toEqual(
      new Date(results.movies.items[0].releaseDate),
    )
  })

  it('throws a RequestError carrying the API message and status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({ code: 'VALIDATION', message: 'Search needs more' }, { status: 422 }),
      ),
    )
    await expect(searchCatalog('du')).rejects.toMatchObject({
      name: 'RequestError',
      message: 'Search needs more',
      status: 422,
    })
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('<html>', { status: 502 })),
    )
    const error = await searchCatalog('dune').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(RequestError)
    expect((error as RequestError).message).toBe('The search failed. Try again.')
  })
})
