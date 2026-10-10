import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MoviesView } from '@/app/(site)/movies/view'
import type { Genre } from '@/lib/dto/genres'

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

const view = (page = 1, totalPages = 1) => (
  <MoviesView page={page} totalPages={totalPages} genres={genres} person={null}>
    <p>the grid</p>
  </MoviesView>
)

describe('MoviesView', () => {
  beforeEach(() => {
    navigation.search = ''
    navigation.push.mockReset()
  })

  it('renders the grid it is given and no pagination for a single page', () => {
    render(view())
    expect(screen.getByText('the grid')).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument()
  })

  it('pages through the URL with a history entry, keeping the filters', async () => {
    navigation.search = 'genres=drama&yearFrom=2000'
    render(view(1, 3))
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(navigation.push).toHaveBeenCalledWith('/movies?genres=drama&yearFrom=2000&page=2', {
      scroll: false,
    })
  })

  it('searches by title through the URL from the first page, keeping the other filters', async () => {
    navigation.search = 'page=3&genres=drama'
    render(view(3, 3))
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search movies' }), ' dune ')
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(navigation.push).toHaveBeenCalledWith('/movies?genres=drama&q=dune', { scroll: false })
  })

  it('sorts through the URL from the first page', async () => {
    navigation.search = 'page=2'
    render(view(2, 2))
    await userEvent.click(screen.getByRole('combobox', { name: 'Sort' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Title A–Z' }))
    expect(navigation.push).toHaveBeenLastCalledWith('/movies?sort=title', { scroll: false })
  })

  it('applies the panel filters from the first page', async () => {
    navigation.search = 'page=2'
    render(view(2, 2))
    await userEvent.click(screen.getByRole('button', { name: 'Filters' }))
    await userEvent.click(screen.getByRole('combobox', { name: 'Genres' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Science Fiction' }))
    await userEvent.keyboard('{Escape}')
    await userEvent.type(screen.getByRole('spinbutton', { name: 'From' }), '2000')
    await userEvent.type(screen.getByRole('spinbutton', { name: 'At most' }), '150')
    await userEvent.click(screen.getByRole('button', { name: 'Apply filters' }))
    expect(navigation.push).toHaveBeenLastCalledWith(
      '/movies?genres=science-fiction&yearFrom=2000&runtimeMax=150',
      { scroll: false },
    )
  })

  it('lifts one filter from its chip and clears them all', async () => {
    navigation.search = 'q=dune&genres=drama%2Cscience-fiction&yearTo=1999&sort=title'
    render(view())
    const chips = screen.getByRole('list', { name: 'Active filters' })
    expect(chips).toHaveTextContent('“dune”')
    expect(chips).toHaveTextContent('Drama')
    expect(chips).toHaveTextContent('Science Fiction')
    expect(chips).toHaveTextContent('Until 1999')
    await userEvent.click(screen.getByRole('button', { name: 'Remove Drama' }))
    expect(navigation.push).toHaveBeenLastCalledWith(
      '/movies?q=dune&genres=science-fiction&yearTo=1999&sort=title',
      { scroll: false },
    )
    await userEvent.click(screen.getByRole('button', { name: 'Clear all' }))
    expect(navigation.push).toHaveBeenLastCalledWith('/movies?sort=title', { scroll: false })
  })
})
