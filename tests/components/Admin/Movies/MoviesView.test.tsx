import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { deleteMovieAction } from '@/actions/movies'
import { MoviesView } from '@/components/Admin/Movies/MoviesView'
import type { Page } from '@/lib/dto/common'
import type { GenreWithCount } from '@/lib/dto/genres'
import type { MovieSummary } from '@/lib/dto/movies'

const navigation = vi.hoisted(() => ({ search: '', replace: vi.fn() }))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: navigation.replace }),
  usePathname: () => '/admin/movies',
  useSearchParams: () => new URLSearchParams(navigation.search),
}))
vi.mock('@/actions/movies', () => ({ deleteMovieAction: vi.fn() }))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const drama = { id: 'g-drama', name: 'Drama', slug: 'drama' }
const scifi = { id: 'g-scifi', name: 'Science Fiction', slug: 'science-fiction' }
const genres: GenreWithCount[] = [
  { ...drama, movieCount: 2 },
  { ...scifi, movieCount: 1 },
]

const dune: MovieSummary = {
  id: 'm-dune',
  slug: 'dune-2021',
  title: 'Dune',
  releaseDate: new Date('2021-10-22T00:00:00.000Z'),
  runtimeMinutes: 155,
  posterUrl: 'https://cdn.example.com/dune.jpg',
  genres: [drama, scifi],
  rating: { average: 4.2, count: 3 },
}
const heat: MovieSummary = {
  id: 'm-heat',
  slug: 'heat-1995',
  title: 'Heat',
  releaseDate: new Date('1995-12-15T00:00:00.000Z'),
  runtimeMinutes: null,
  posterUrl: null,
  genres: [],
  rating: { average: null, count: 0 },
}

const page = (
  items: MovieSummary[],
  overrides: Partial<Page<MovieSummary>> = {},
): Page<MovieSummary> => {
  return { items, page: 1, perPage: 20, totalItems: items.length, totalPages: 1, ...overrides }
}

/** The body rows, in order (the first row is the header). */
const rows = () => screen.getAllByRole('row').slice(1)

const rowOf = (title: string) => {
  const row = rows().find((candidate) => within(candidate).queryByRole('link', { name: title }))
  if (!row) {
    throw new Error(`No row for ${title}`)
  }
  return row
}

describe('MoviesView', () => {
  beforeEach(() => {
    navigation.search = ''
    navigation.replace.mockReset()
    vi.mocked(deleteMovieAction).mockReset()
    vi.mocked(toast.success).mockReset()
  })

  it('sorts runtime from a column while preserving movie filters', async () => {
    navigation.search = 'page=3&q=dune&genres=drama&sort=added'
    render(<MoviesView movies={page([dune])} genres={genres} />)
    await userEvent.click(screen.getByRole('button', { name: 'Runtime' }))
    const params = new URLSearchParams(navigation.replace.mock.lastCall?.[0].split('?')[1])
    expect(Object.fromEntries(params)).toEqual({
      q: 'dune',
      genres: 'drama',
      sort: 'added',
      sortBy: 'runtimeMinutes',
    })
  })

  it('reflects the release sort and switches back from column sorting to the sort menu', async () => {
    navigation.search = 'sortBy=runtimeMinutes&direction=desc'
    render(<MoviesView movies={page([dune])} genres={genres} />)
    expect(screen.getByRole('columnheader', { name: 'Runtime' })).toHaveAttribute(
      'aria-sort',
      'descending',
    )
    await userEvent.click(screen.getByRole('combobox', { name: 'Sort' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Title A–Z' }))
    expect(navigation.replace).toHaveBeenLastCalledWith('/admin/movies?sort=title', {
      scroll: false,
    })
  })

  it('lights no column header while the list is sorted by rating', () => {
    navigation.search = 'sort=rating'
    render(<MoviesView movies={page([dune])} genres={genres} />)
    for (const name of ['Title', 'Runtime', 'Released']) {
      expect(screen.getByRole('columnheader', { name })).not.toHaveAttribute('aria-sort')
    }
  })

  it('lists movies with year, genres, runtime, rating and release date, the title linking to the editor', () => {
    render(<MoviesView movies={page([dune, heat])} genres={genres} />)
    const headers = screen.getAllByRole('columnheader').map((cell) => cell.textContent)
    expect(headers).toEqual([
      'Poster',
      'Title',
      'Genres',
      'Runtime',
      'Rating',
      'Released',
      'Actions',
    ])
    expect(rows()).toHaveLength(2)

    const first = rowOf('Dune')
    expect(within(first).getByRole('link', { name: 'Dune' })).toHaveAttribute(
      'href',
      '/admin/movies/dune-2021/edit',
    )
    expect(within(first).getByText('2021')).toBeInTheDocument()
    expect(within(first).getByText('Drama, Science Fiction')).toBeInTheDocument()
    expect(within(first).getByText('2h 35m')).toBeInTheDocument()
    expect(within(first).getByText('4.2 (3)')).toBeInTheDocument()
    expect(within(first).getByText('Oct 22, 2021')).toBeInTheDocument()

    const second = rowOf('Heat')
    expect(within(second).getByText('None')).toBeInTheDocument()
    // No runtime and no rating.
    expect(within(second).getAllByText('—')).toHaveLength(2)
    expect(within(second).getByText('Dec 15, 1995')).toBeInTheDocument()
  })

  it('shows the poster as a lazy thumbnail, or an empty box without one', () => {
    const { container } = render(<MoviesView movies={page([dune, heat])} genres={genres} />)
    expect(container.querySelectorAll('img')).toHaveLength(1)
    const image = within(rowOf('Dune')).getByRole('presentation', { hidden: true })
    expect(image).toHaveAttribute('src', 'https://cdn.example.com/dune.jpg')
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(within(rowOf('Heat')).queryByRole('presentation', { hidden: true })).toBeNull()
  })

  it('links the edit icon to the editor and the view icon to the public page', () => {
    render(<MoviesView movies={page([dune])} genres={genres} />)
    const row = rowOf('Dune')
    expect(within(row).getByRole('link', { name: 'Edit Dune' })).toHaveAttribute(
      'href',
      '/admin/movies/dune-2021/edit',
    )
    expect(within(row).getByRole('link', { name: 'View Dune' })).toHaveAttribute(
      'href',
      '/movies/dune-2021',
    )
  })

  it('writes the search to the URL and goes back to page 1', async () => {
    navigation.search = 'page=3'
    render(<MoviesView movies={page([dune], { page: 3, totalPages: 4 })} genres={genres} />)
    await userEvent.type(screen.getByLabelText('Search movies'), '  dune ')
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(navigation.replace).toHaveBeenCalledTimes(1)
    expect(navigation.replace).toHaveBeenCalledWith('/admin/movies?q=dune', { scroll: false })
  })

  it('filters by genre through the URL, back on page 1', async () => {
    navigation.search = 'page=2'
    render(<MoviesView movies={page([dune], { page: 2, totalPages: 3 })} genres={genres} />)
    await userEvent.click(screen.getByRole('combobox', { name: 'Genre' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Drama' }))
    expect(navigation.replace).toHaveBeenLastCalledWith('/admin/movies?genres=drama', {
      scroll: false,
    })
  })

  it('sorts through the URL', async () => {
    render(<MoviesView movies={page([dune])} genres={genres} />)
    await userEvent.click(screen.getByRole('combobox', { name: 'Sort' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Recently added' }))
    expect(navigation.replace).toHaveBeenLastCalledWith('/admin/movies?sort=added', {
      scroll: false,
    })
  })

  it('shows the filters from the URL and clears them', async () => {
    navigation.search = 'genres=drama&sort=title&q=dune'
    render(<MoviesView movies={page([dune])} genres={genres} />)
    expect(screen.getByLabelText('Search movies')).toHaveValue('dune')
    expect(screen.getByRole('combobox', { name: 'Genre' })).toHaveTextContent('Drama')
    expect(screen.getByRole('combobox', { name: 'Sort' })).toHaveTextContent('Title A–Z')
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(navigation.replace).toHaveBeenLastCalledWith('/admin/movies?sort=title', {
      scroll: false,
    })
  })

  it('offers no Clear filters button without a filter', () => {
    render(<MoviesView movies={page([dune])} genres={genres} />)
    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument()
  })

  it('deletes a movie after confirming and says so', async () => {
    vi.mocked(deleteMovieAction).mockResolvedValue({ ok: true, data: undefined })
    render(<MoviesView movies={page([dune, heat])} genres={genres} />)
    await userEvent.click(within(rowOf('Dune')).getByRole('button', { name: 'Delete Dune' }))
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('heading', { name: 'Delete Dune?' })).toBeInTheDocument()
    expect(deleteMovieAction).not.toHaveBeenCalled()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete movie' }))
    expect(deleteMovieAction).toHaveBeenCalledWith('m-dune')
    await vi.waitFor(() => expect(toast.success).toHaveBeenCalledWith('Dune was deleted'))
  })

  it('invites adding the first movie when the catalog is empty', () => {
    render(<MoviesView movies={page([], { totalItems: 0 })} genres={genres} />)
    expect(screen.getByText('No movies found')).toBeInTheDocument()
    expect(screen.getByText('Add the first movie.')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Add movie' })).toHaveLength(2)
  })

  it('says so when no movie matches the filters', () => {
    navigation.search = 'q=zzz'
    render(<MoviesView movies={page([], { totalItems: 0 })} genres={genres} />)
    expect(screen.getByText('No movies found')).toBeInTheDocument()
    expect(screen.getByText('No movie matches your filters.')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Add movie' })).toHaveLength(1)
  })

  it('pages through the URL', async () => {
    render(
      <MoviesView
        movies={page([dune], { page: 1, totalItems: 45, totalPages: 3 })}
        genres={genres}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(navigation.replace).toHaveBeenCalledWith('/admin/movies?page=2', { scroll: false })
  })

  it('shows no pagination for a single page', () => {
    render(<MoviesView movies={page([dune])} genres={genres} />)
    expect(screen.queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument()
  })
})
