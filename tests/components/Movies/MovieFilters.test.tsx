import { fireEvent, render, screen, within } from '@testing-library/react'
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

/** The open panel; it stays mounted (and `inert`) while tucked away, so it can animate. */
const sheet = () => screen.getByRole('form', { name: 'Filters', hidden: true }).parentElement

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
    >
      <p>the results</p>
    </MovieFilters>,
  )
  return { onChange, onSortChange }
}

/** A range field's two thumbs (its label also names the slider's root group). */
const thumbsOf = (label: string) =>
  screen.getAllByLabelText(label).filter((element) => element instanceof HTMLInputElement)

// Base UI keeps a slider's thumbs `visibility: hidden` until it can measure the track, which jsdom
// never does, so role queries skip them and keys do not move them: the tests find the thumbs by
// their label and set their value, as assistive tech does with a range input.
describe('MovieFilters', () => {
  beforeEach(() => {
    vi.mocked(searchPeople)
      .mockReset()
      .mockResolvedValue({ items: [amy], page: 1, perPage: 10, totalItems: 1, totalPages: 1 })
  })

  it('keeps the panel tucked away without advanced filters and shows no chips', () => {
    setup()
    expect(screen.getByRole('button', { name: /^Filters/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(sheet()).toHaveAttribute('inert')
    expect(screen.queryByRole('list', { name: 'Active filters' })).not.toBeInTheDocument()
  })

  it('opens the panel from the rail and tucks it back, focus returning to the rail', async () => {
    setup()
    expect(screen.getByText('the results')).toBeInTheDocument()
    const rail = screen.getByRole('button', { name: /^Filters/ })
    await userEvent.click(rail)
    expect(rail).toHaveAttribute('aria-expanded', 'true')
    expect(sheet()).not.toHaveAttribute('inert')
    await userEvent.click(screen.getByRole('button', { name: 'Hide filters' }))
    expect(rail).toHaveAttribute('aria-expanded', 'false')
    expect(sheet()).toHaveAttribute('inert')
    expect(rail).toHaveFocus()
  })

  it('tucks the panel away once the filters are applied', async () => {
    const { onChange } = setup({ genres: ['drama'] })
    await userEvent.click(screen.getByRole('button', { name: 'Apply filters' }))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(sheet()).toHaveAttribute('inert')
  })

  it('opens the panel when an advanced filter is in force, with the fields filled in', () => {
    setup({ genres: ['drama'], yearFrom: 1990, runtimeMax: 120, person: 'amy-adams' }, amy)
    expect(screen.getByRole('button', { name: /^Filters/ })).toHaveAccessibleName(
      'Filters 4 active',
    )
    const genres = screen
      .getByRole('combobox', { name: 'Genres' })
      .closest('[data-slot="combobox-chips"]')
    expect(genres).toHaveTextContent('Drama')
    expect(genres).not.toHaveTextContent('Science Fiction')
    const [yearFrom, yearTo] = thumbsOf('Release year')
    expect(yearFrom).toHaveAttribute('aria-valuenow', '1990')
    expect(yearTo).toHaveAttribute('aria-valuenow', String(new Date().getUTCFullYear()))
    const [, runtimeMax] = thumbsOf('Runtime')
    expect(runtimeMax).toHaveAttribute('aria-valuenow', '120')
    const panel = within(screen.getByRole('form', { name: 'Filters' }))
    expect(panel.getByText('From 1990')).toBeInTheDocument()
    expect(panel.getByText('Until 120 min')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Person' })).toHaveValue('Amy Adams')
  })

  it('applies every panel field together, genres in catalog order', async () => {
    const { onChange } = setup()
    await userEvent.click(screen.getByRole('button', { name: /^Filters/ }))
    const genreBox = screen.getByRole('combobox', { name: 'Genres' })
    await userEvent.click(genreBox)
    await userEvent.click(await screen.findByRole('option', { name: 'Science Fiction' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Drama' }))
    await userEvent.keyboard('{Escape}')
    const [yearFrom] = thumbsOf('Release year')
    fireEvent.change(yearFrom!, { target: { value: '1990' } })
    const [runtimeMin] = thumbsOf('Runtime')
    fireEvent.change(runtimeMin!, { target: { value: '90' } })
    await userEvent.type(screen.getByRole('combobox', { name: 'Person' }), 'amy')
    await userEvent.click(await screen.findByRole('option', { name: 'Amy Adams' }))
    await userEvent.click(screen.getByRole('button', { name: 'Apply filters' }))
    expect(onChange).toHaveBeenCalledWith({
      genres: ['drama', 'science-fiction'],
      person: 'amy-adams',
      yearFrom: 1990,
      yearTo: null,
      runtimeMin: 90,
      runtimeMax: null,
    })
  })

  it('searches by title alone, leaving the panel filters as they are', async () => {
    const { onChange } = setup({ genres: ['drama'] })
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search movies' }), ' dune ')
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(onChange).toHaveBeenCalledWith({ q: 'dune' })
  })

  it('resets the drafts without applying them', async () => {
    const { onChange } = setup({ genres: ['drama'], runtimeMin: 90 })
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled()
    expect(screen.getByText('Any length')).toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'Apply filters' }))
    expect(onChange).toHaveBeenCalledWith({
      genres: [],
      person: '',
      yearFrom: null,
      yearTo: null,
      runtimeMin: null,
      runtimeMax: null,
    })
  })

  it('keeps a bound past the slider until its thumb moves', async () => {
    const { onChange } = setup({ runtimeMax: 500 })
    const [runtimeMin] = thumbsOf('Runtime')
    fireEvent.change(runtimeMin!, { target: { value: '30' } })
    await userEvent.click(screen.getByRole('button', { name: 'Apply filters' }))
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ runtimeMin: 30, runtimeMax: 500 }),
    )
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
