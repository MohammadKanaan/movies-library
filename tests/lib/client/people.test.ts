// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RequestError } from '@/lib/client/errors'
import { searchPeople } from '@/lib/client/people'

const page = {
  items: [
    {
      id: '0190d1a2-0000-7000-8000-000000000001',
      slug: 'denis-villeneuve',
      name: 'Denis Villeneuve',
      creditCount: 2,
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  page: 1,
  perPage: 10,
  totalItems: 1,
  totalPages: 1,
}

describe('searchPeople', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('GETs the people endpoint with the term and revives the dates', async () => {
    const fetchMock = vi.fn(async () => Response.json(page))
    vi.stubGlobal('fetch', fetchMock)

    const result = await searchPeople('denis vil')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('/api/v1/people?q=denis+vil&perPage=10')
    expect(init.headers).toEqual({ Accept: 'application/json' })
    expect(result.items[0]).toEqual({
      ...page.items[0],
      createdAt: new Date(page.items[0].createdAt),
    })
  })

  it('passes the abort signal through so a stale search can be cancelled', async () => {
    const fetchMock = vi.fn(async () => Response.json(page))
    vi.stubGlobal('fetch', fetchMock)
    const controller = new AbortController()
    await searchPeople('amy adams', controller.signal)
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(init.signal).toBe(controller.signal)
  })

  it('throws a RequestError carrying the server’s message on a failed response', async () => {
    vi.stubGlobal('fetch', async () =>
      Response.json(
        { code: 'VALIDATION', message: 'Search needs at least 3 characters' },
        { status: 422 },
      ),
    )
    const error = await searchPeople('de').catch((caught) => caught)
    expect(error).toBeInstanceOf(RequestError)
    expect(error).toMatchObject({ status: 422, message: 'Search needs at least 3 characters' })
  })

  it('reports an outage without a message as a retryable failure', async () => {
    vi.stubGlobal('fetch', async () => new Response('<html/>', { status: 503 }))
    await expect(searchPeople('amy adams')).rejects.toMatchObject({
      status: 503,
      message: 'The search failed. Try again.',
    })
  })
})
