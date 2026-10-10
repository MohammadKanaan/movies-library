import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MoviesView } from '@/app/(site)/movies/view'
import type { Genre } from '@/lib/dto/genres'
import type { ListMoviesQuery, MovieSummary } from '@/lib/dto/movies'

const navigation = vi.hoisted(() => ({ search: '', push: vi.fn() }))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: navigation.push }),
  usePathname: () => '/movies',
  useSearchParams: () => new URLSearchParams(navigation.search),
}))
vi.mock('@/lib/client/people', () => ({ searchPeople: vi.fn() }))

const genres: Genre[] = [
  { id: 'g-drama', name: 'Drama', slug: 'drama' },
  { id: 'g-scifi', name: 'Science Fiction', slug: 'science-fiction' },
]

const movie = (id: string, title: string): MovieSummary => ({
  id,
  title,
  slug: id,
  releaseDate: new Date('2024-01-01T00:00:00Z'),
  posterUrl: null,
  runtimeMinutes: null,
  genres: [],
})

const query: ListMoviesQuery = { q: 'film', genres: ['drama'], person: 'amy-adams', sort: 'oldest' }

const props = {
  page: 1,
  perPage: 24,
  totalPages: 1,
  query,
  genres,
  person: null,
  initialIds: ['arrival'],
  empty: <p>No movies</p>,
  children: <li>the grid</li>,
}

const view = (overrides: Partial<typeof props> = {}) => <MoviesView {...props} {...overrides} />

const batch = (items = [movie('dune', 'Dune')], page = 2, totalPages = 3) => ({
  items,
  page,
  perPage: 24,
  totalItems: 50,
  totalPages,
})

const observers: { enter: () => void; connected: boolean }[] = []
const enter = () => {
  const observer = observers.findLast((item) => item.connected)
  if (!observer) {
    throw new Error('No active observer')
  }
  act(() => observer.enter())
}

// Base UI keeps a slider's thumbs `visibility: hidden` until it can measure the track, which jsdom
// never does, so the tests find them through the slider's labelled group instead.
describe('MoviesView', () => {
  beforeEach(() => {
    navigation.search = ''
    navigation.push.mockReset()
    observers.length = 0
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        entry: (typeof observers)[number]
        constructor(callback: IntersectionObserverCallback) {
          this.entry = {
            connected: true,
            enter: () =>
              callback(
                [{ isIntersecting: true } as IntersectionObserverEntry],
                this as unknown as IntersectionObserver,
              ),
          }
          observers.push(this.entry)
        }
        observe() {}
        disconnect() {
          this.entry.connected = false
        }
      },
    )
  })
  afterEach(() => vi.unstubAllGlobals())

  it('renders the grid it is given and no load control for a single batch', () => {
    render(view())
    expect(screen.getByText('the grid')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Load more movies' })).not.toBeInTheDocument()
  })

  it('shows the empty state instead of the list when the first batch is empty', () => {
    render(view({ initialIds: [], children: undefined }))
    expect(screen.getByText('No movies')).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Movies' })).not.toBeInTheDocument()
  })

  it('searches by title through the URL from the first page, keeping the other filters', async () => {
    navigation.search = 'page=3&genres=drama'
    render(view({ page: 3, totalPages: 3 }))
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search movies' }), ' dune ')
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(navigation.push).toHaveBeenCalledWith('/movies?genres=drama&q=dune', { scroll: false })
  })

  it('sorts through the URL from the first page', async () => {
    navigation.search = 'page=2'
    render(view({ page: 2, totalPages: 2 }))
    await userEvent.click(screen.getByRole('combobox', { name: 'Sort' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Title A–Z' }))
    expect(navigation.push).toHaveBeenLastCalledWith('/movies?sort=title', { scroll: false })
  })

  it('applies the card’s filters from the first page as each one settles', async () => {
    navigation.search = 'page=2'
    render(view({ page: 2, totalPages: 2 }))
    await userEvent.click(screen.getByRole('button', { name: /^Filters/ }))
    await userEvent.click(screen.getByRole('combobox', { name: 'Genres' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Science Fiction' }))
    expect(navigation.push).toHaveBeenLastCalledWith('/movies?genres=science-fiction', {
      scroll: false,
    })
    await userEvent.keyboard('{Escape}')

    // jsdom has no layout, so Base UI keeps the thumbs hidden; find them through the labelled group.
    const [, longest] = within(screen.getByRole('group', { name: 'Runtime' })).getAllByRole(
      'slider',
      { hidden: true },
    )
    longest!.focus()
    await userEvent.keyboard('{ArrowLeft}')
    await waitFor(() =>
      expect(navigation.push).toHaveBeenLastCalledWith(
        '/movies?genres=science-fiction&runtimeMax=235',
        { scroll: false },
      ),
    )
  })

  it('lifts one filter from its chip and clears them all', async () => {
    navigation.search = 'q=dune&genres=drama%2Cscience-fiction&yearTo=1999&sort=title'
    render(view())
    // The open panel's genre picker has its own Remove Drama, which only edits the draft.
    const activeFilters = within(screen.getByRole('list', { name: 'Active filters' }))
    await userEvent.click(activeFilters.getByRole('button', { name: 'Remove Drama' }))
    expect(navigation.push).toHaveBeenLastCalledWith(
      '/movies?q=dune&genres=science-fiction&yearTo=1999&sort=title',
      { scroll: false },
    )
    await userEvent.click(screen.getByRole('button', { name: 'Clear all' }))
    expect(navigation.push).toHaveBeenLastCalledWith('/movies?sort=title', { scroll: false })
  })

  it('appends batches in the same list, repeats the filters, skips duplicates and stops at the end', async () => {
    const fetchMock = vi.fn(async (url: string) => {
      const params = new URL(url, 'http://localhost').searchParams
      expect(params.get('q')).toBe('film')
      expect(params.get('genres')).toBe('drama')
      expect(params.get('person')).toBe('amy-adams')
      expect(params.get('sort')).toBe('oldest')
      expect(params.get('perPage')).toBe('24')
      return Response.json(
        params.get('page') === '2'
          ? batch([movie('arrival', 'Arrival'), movie('dune', 'Dune'), movie('dune', 'Dune')])
          : batch([movie('blade-runner', 'Blade Runner')], 3),
      )
    })
    vi.stubGlobal('fetch', fetchMock)
    render(view({ totalPages: 3 }))
    expect(screen.getByRole('list', { name: 'Movies' })).toHaveTextContent('the grid')
    expect(fetchMock).not.toHaveBeenCalled()

    enter()
    await screen.findByRole('link', { name: 'Dune 2024' })
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    enter()
    await screen.findByRole('link', { name: 'Blade Runner 2024' })
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.queryByRole('button', { name: 'Load more movies' })).not.toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(observers.every((observer) => !observer.connected)).toBe(true)
  })

  it('allows only one pending request and keeps the existing cards visible while loading', async () => {
    let resolve!: (value: Response) => void
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>((done) => {
          resolve = done
        }),
    )
    vi.stubGlobal('fetch', fetchMock)
    render(view({ totalPages: 3 }))
    const observer = observers[0]
    act(() => {
      observer.enter()
      observer.enter()
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('list', { name: 'Movies' })).toHaveTextContent('the grid')
    expect(screen.getByRole('button', { name: 'Load more movies' })).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent('1 movie loaded.')
    await act(async () => resolve(Response.json(batch())))
    expect(screen.getByRole('link', { name: 'Dune 2024' })).toBeInTheDocument()
  })

  it('pauses automatic loading after a failure and retries the same page on demand', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(Response.json(batch()))
    vi.stubGlobal('fetch', fetchMock)
    render(view({ totalPages: 3 }))
    const observer = observers[0]
    enter()
    await screen.findByRole('alert')
    act(() => observer.enter())
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(screen.getByText('the grid')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /retry/i }))
    await screen.findByRole('link', { name: 'Dune 2024' })
    expect(
      fetchMock.mock.calls.map(([url]) =>
        new URL(url, 'http://localhost').searchParams.get('page'),
      ),
    ).toEqual(['2', '2'])
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('resets appended movies when the filters change', async () => {
    vi.stubGlobal('fetch', async () => Response.json(batch()))
    const { rerender } = render(view({ totalPages: 3 }))
    enter()
    await screen.findByRole('link', { name: 'Dune 2024' })
    rerender(
      view({
        query: { ...query, genres: ['comedy'] },
        initialIds: ['comedy'],
        children: <li>Comedy</li>,
      }),
    )
    expect(screen.queryByRole('link', { name: 'Dune 2024' })).not.toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Movies' })).toHaveTextContent('Comedy')
  })

  it('cancels an obsolete request and ignores its late result after a query change', async () => {
    let resolve!: (value: Response) => void
    let signal: AbortSignal | undefined
    vi.stubGlobal('fetch', (_url: string, init: RequestInit) => {
      signal = init.signal ?? undefined
      return new Promise<Response>((done) => {
        resolve = done
      })
    })
    const { rerender } = render(view({ totalPages: 3 }))
    enter()
    rerender(view({ query: { ...query, sort: 'newest' } }))
    expect(signal?.aborted).toBe(true)
    await act(async () => resolve(Response.json(batch())))
    expect(screen.queryByRole('link', { name: 'Dune 2024' })).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('stops when a page becomes empty instead of repeatedly requesting removed movies', async () => {
    vi.stubGlobal('fetch', async () => Response.json(batch([])))
    render(view({ totalPages: 3 }))
    enter()
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'Load more movies' })).not.toBeInTheDocument(),
    )
    expect(screen.getByText('the grid')).toBeInTheDocument()
  })

  it('supports manual loading when IntersectionObserver is unavailable', async () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    vi.stubGlobal('fetch', async () => Response.json(batch()))
    render(view({ totalPages: 3 }))
    await userEvent.click(screen.getByRole('button', { name: 'Load more movies' }))
    await screen.findByRole('link', { name: 'Dune 2024' })
  })

  it('does not load beyond the DAL page limit', () => {
    render(view({ page: 1000, totalPages: 1001 }))
    expect(screen.queryByRole('button', { name: 'Load more movies' })).not.toBeInTheDocument()
    expect(observers).toHaveLength(0)
  })
})
