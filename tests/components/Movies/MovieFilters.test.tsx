import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MovieFilters } from '@/components/Movies/MovieFilters'
import { searchPeople } from '@/lib/client/people'
import type { Genre } from '@/lib/dto/genres'
import { EMPTY_MOVIE_FILTERS, type MovieFilters as Filters } from '@/lib/dto/movies'
import type { PersonListItem } from '@/lib/dto/people'

vi.mock('@/lib/client/people', () => ({ searchPeople: vi.fn() }))

const genres: Genre[] = [
  { id: 'g-drama', name: 'Drama', slug: 'drama' },
  { id: 'g-scifi', name: 'Science Fiction', slug: 'science-fiction' },
]

const amy: PersonListItem = {
  id: 'p-amy',
  slug: 'amy-adams',
  name: 'Amy Adams',
  headshotUrl: null,
  creditCount: 4,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
}

const setup = (filters: Partial<Filters> = {}, person: typeof amy | null = null) => {
  const onChange = vi.fn()
  const onSortChange = vi.fn()
  render(
    <MovieFilters
      filters={{ ...EMPTY_MOVIE_FILTERS, ...filters }}
      sort="newest"
      genres={genres}
      person={person}
      onChange={onChange}
      onSortChange={onSortChange}
    />,
  )
  return { onChange, onSortChange }
}

describe('MovieFilters', () => {
  beforeEach(() => {
    vi.mocked(searchPeople)
      .mockReset()
      .mockResolvedValue({ items: [amy], page: 1, perPage: 10, totalItems: 1, totalPages: 1 })
  })

  it('keeps the panel closed without advanced filters and shows no chips', () => {
    setup()
    expect(screen.getByRole('button', { name: 'Filters' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(screen.queryByRole('combobox', { name: 'Genres' })).not.toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Active filters' })).not.toBeInTheDocument()
  })

  it('opens the panel when an advanced filter is in force, with the fields filled in', () => {
    setup({ genres: ['drama'], yearFrom: 1990, runtimeMax: 120, person: 'amy-adams' }, amy)
    expect(screen.getByRole('button', { name: 'Filters' })).toHaveAttribute('aria-expanded', 'true')
    const genres = screen
      .getByRole('combobox', { name: 'Genres' })
      .closest('[data-slot="combobox-chips"]')
    expect(genres).toHaveTextContent('Drama')
    expect(genres).not.toHaveTextContent('Science Fiction')
    expect(screen.getByRole('spinbutton', { name: 'From' })).toHaveValue(1990)
    expect(screen.getByRole('spinbutton', { name: 'To' })).toHaveValue(null)
    expect(screen.getByRole('spinbutton', { name: 'At most' })).toHaveValue(120)
    expect(screen.getByRole('combobox', { name: 'Person' })).toHaveValue('Amy Adams')
  })

  it('submits a title search alone while the panel is closed', async () => {
    const { onChange } = setup({ genres: ['drama'], yearTo: 1999 })
    // Opened by the filters in force; close it to search by title only.
    await userEvent.click(screen.getByRole('button', { name: 'Filters' }))
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search movies' }), '  dune ')
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(onChange).toHaveBeenCalledWith({ q: 'dune' })
  })

  it('applies every panel field together, genres in catalog order', async () => {
    const { onChange } = setup()
    await userEvent.click(screen.getByRole('button', { name: 'Filters' }))
    const genreBox = screen.getByRole('combobox', { name: 'Genres' })
    await userEvent.click(genreBox)
    await userEvent.click(await screen.findByRole('option', { name: 'Science Fiction' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Drama' }))
    await userEvent.keyboard('{Escape}')
    await userEvent.type(screen.getByRole('spinbutton', { name: 'From' }), '1990')
    await userEvent.type(screen.getByRole('spinbutton', { name: 'To' }), '1999')
    await userEvent.type(screen.getByRole('spinbutton', { name: 'At least' }), '90')
    await userEvent.type(screen.getByRole('combobox', { name: 'Person' }), 'amy')
    await userEvent.click(await screen.findByRole('option', { name: 'Amy Adams' }))
    await userEvent.click(screen.getByRole('button', { name: 'Apply filters' }))
    expect(onChange).toHaveBeenCalledWith({
      q: '',
      genres: ['drama', 'science-fiction'],
      person: 'amy-adams',
      yearFrom: 1990,
      yearTo: 1999,
      runtimeMin: 90,
      runtimeMax: null,
    })
  })

  it('shows a chip per filter and lifts one at a time', async () => {
    const { onChange } = setup(
      {
        q: 'dune',
        genres: ['drama', 'science-fiction'],
        yearFrom: 1990,
        yearTo: 1999,
        runtimeMin: 90,
        person: 'amy-adams',
      },
      amy,
    )
    const chips = within(screen.getByRole('list', { name: 'Active filters' }))
    expect(chips.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      '“dune”',
      'Drama',
      'Science Fiction',
      '1990–1999',
      'From 90 min',
      'Amy Adams',
      'Clear all',
    ])
    await userEvent.click(chips.getByRole('button', { name: 'Remove Science Fiction' }))
    expect(onChange).toHaveBeenLastCalledWith({ genres: ['drama'] })
    await userEvent.click(chips.getByRole('button', { name: 'Remove 1990–1999' }))
    expect(onChange).toHaveBeenLastCalledWith({ yearFrom: null, yearTo: null })
    await userEvent.click(chips.getByRole('button', { name: 'Remove From 90 min' }))
    expect(onChange).toHaveBeenLastCalledWith({ runtimeMin: null, runtimeMax: null })
    await userEvent.click(chips.getByRole('button', { name: 'Remove Amy Adams' }))
    expect(onChange).toHaveBeenLastCalledWith({ person: '' })
    await userEvent.click(chips.getByRole('button', { name: 'Remove “dune”' }))
    expect(onChange).toHaveBeenLastCalledWith({ q: '' })
    await userEvent.click(chips.getByRole('button', { name: 'Clear all' }))
    expect(onChange).toHaveBeenLastCalledWith(EMPTY_MOVIE_FILTERS)
  })

  it('names an unknown person by slug and the year range by its open end', () => {
    setup({ person: 'nobody', yearTo: 1999, runtimeMax: 120 })
    const chips = screen.getByRole('list', { name: 'Active filters' })
    expect(chips).toHaveTextContent('nobody')
    expect(chips).toHaveTextContent('Until 1999')
    expect(chips).toHaveTextContent('Until 120 min')
  })

  it('lists every genre on focus and narrows it as the visitor types', async () => {
    setup()
    await userEvent.click(screen.getByRole('button', { name: 'Filters' }))
    const genreBox = screen.getByRole('combobox', { name: 'Genres' })
    await userEvent.click(genreBox)
    expect(await screen.findAllByRole('option')).toHaveLength(2)
    await userEvent.type(genreBox, 'sci')
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Science Fiction',
    ])
  })

  it('removes a picked genre from its chip in the field', async () => {
    setup({ genres: ['drama', 'science-fiction'] })
    const field = screen
      .getByRole('combobox', { name: 'Genres' })
      .closest('[data-slot="combobox-chips"]')
    expect(field).toHaveTextContent('Drama')
    await userEvent.click(within(field as HTMLElement).getAllByRole('button')[0]!)
    expect(field).not.toHaveTextContent('Drama')
    expect(field).toHaveTextContent('Science Fiction')
  })

  it('changes the sort at once', async () => {
    const { onSortChange, onChange } = setup()
    await userEvent.click(screen.getByRole('combobox', { name: 'Sort' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Recently added' }))
    expect(onSortChange).toHaveBeenCalledWith('added')
    expect(onChange).not.toHaveBeenCalled()
  })
})
