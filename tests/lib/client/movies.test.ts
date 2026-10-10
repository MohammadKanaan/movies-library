// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RequestError } from '@/lib/client/errors'
import { fetchMovies } from '@/lib/client/movies'

const page = {
  items: [
    {
      id: 'dune',
      slug: 'dune',
      title: 'Dune',
      releaseDate: '2021-10-22T00:00:00Z',
      runtimeMinutes: null,
      posterUrl: null,
      genres: [],
    },
  ],
  page: 2,
  perPage: 24,
  totalItems: 25,
  totalPages: 2,
}

describe('fetchMovies', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('encodes the filters (genres comma-separated), forwards cancellation and revives dates', async () => {
    const controller = new AbortController()
    vi.stubGlobal('fetch', async (url: string, init: RequestInit) => {
      const params = new URL(url, 'http://localhost').searchParams
      expect(params.get('q')).toBe('dune & sand')
      expect(params.get('genres')).toBe('drama,thriller')
      expect(params.get('person')).toBe('amy-adams')
      expect(params.get('sort')).toBe('title')
      expect(params.get('yearFrom')).toBe('1990')
      expect(params.get('page')).toBe('2')
      expect(params.get('perPage')).toBe('24')
      expect(init.signal).toBe(controller.signal)
      return Response.json(page)
    })
    const result = await fetchMovies(
      {
        page: 2,
        perPage: 24,
        q: 'dune & sand',
        genres: ['drama', 'thriller'],
        person: 'amy-adams',
        yearFrom: 1990,
        sort: 'title',
      },
      controller.signal,
    )
    expect(result.items[0].releaseDate).toEqual(new Date('2021-10-22T00:00:00Z'))
  })

  it('carries the server’s message on a failed response', async () => {
    vi.stubGlobal('fetch', async () =>
      Response.json({ code: 'VALIDATION', message: 'Validation failed' }, { status: 422 }),
    )
    const error = await fetchMovies({ page: 2 }).catch((caught) => caught)
    expect(error).toBeInstanceOf(RequestError)
    expect(error).toMatchObject({ status: 422, message: 'Validation failed' })
  })

  it('reports an outage without a message as a retryable failure', async () => {
    vi.stubGlobal('fetch', async () => new Response('<html/>', { status: 503 }))
    await expect(fetchMovies({ page: 2 })).rejects.toMatchObject({
      status: 503,
      message: 'Could not load more movies. Try again.',
    })
  })

  it('rejects a malformed movie response instead of rendering invalid cards', async () => {
    vi.stubGlobal('fetch', async () => Response.json({ ...page, items: [{ title: 'Dune' }] }))
    await expect(fetchMovies({ page: 2 })).rejects.toThrow()
  })
})
