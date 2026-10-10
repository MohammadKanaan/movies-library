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
  const props = {
    sort: 'newest' as const,
    genres,
    onChange,
    onSortChange,
  }
  const view = render(
    <MovieFilters {...props} filters={{ ...EMPTY_MOVIE_FILTERS, ...filters }} person={person} />,
  )
  /** The URL changed under the component (back/forward, a navigation landing). */
  const rerenderWith = (next: Partial<Filters>) =>
    view.rerender(
      <MovieFilters {...props} filters={{ ...EMPTY_MOVIE_FILTERS, ...next }} person={null} />,
    )
  return { onChange, onSortChange, rerenderWith }
}

/**
 * A range's two thumbs, found through the slider's labelled group: jsdom has no layout, so Base UI
 * keeps the thumbs `visibility: hidden`, which also empties their own accessible names.
 */
const thumbsOf = (name: string) =>
  within(screen.getByRole('group', { name })).getAllByRole('slider', { hidden: true })

const toggle = () => screen.getByRole('button', { name: /^Filters/ })
const apply = () => userEvent.click(screen.getByRole('button', { name: 'Apply filters' }))
const genreField = () =>
  screen.getByRole('combobox', { name: 'Genres' }).closest('[data-slot="combobox-chips"]')

/** Every filter empty: what an Apply sends for fields left as they were. */
const NOTHING = {
  q: '',
  genres: [],
  person: '',
  yearFrom: null,
  yearTo: null,
  runtimeMin: null,
  runtimeMax: null,
  ratingMin: null,
  ratingMax: null,
}

/** The star the rating floor sits on, or null when no floor is picked. */
const pickedRating = () =>
  within(screen.getByRole('radiogroup', { name: 'Rating' }))
    .queryAllByRole('radio')
    .find((radio) => (radio as HTMLInputElement).checked)
    ?.getAttribute('value') ?? null

describe('MovieFilters', () => {
  beforeEach(() => {
    vi.mocked(searchPeople)
      .mockReset()
      .mockResolvedValue({ items: [amy], page: 1, perPage: 10, totalItems: 1, totalPages: 1 })
  })

  it('keeps the panel tucked away and shows no chips without filters', () => {
    setup()
    expect(toggle()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('combobox', { name: 'Genres' })).not.toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Active filters' })).not.toBeInTheDocument()
  })

  it('opens on the title, its fields filled from the URL', async () => {
    setup(
      { q: 'dune', genres: ['drama'], yearFrom: 1990, runtimeMax: 120, person: 'amy-adams' },
      amy,
    )
    // Filters in force do not open it: the chips already say what they are.
    expect(toggle()).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(toggle())
    expect(toggle()).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('searchbox', { name: 'Title' })).toHaveFocus()
    expect(screen.getByRole('searchbox', { name: 'Title' })).toHaveValue('dune')
    expect(genreField()).toHaveTextContent('Drama')
    expect(genreField()).not.toHaveTextContent('Science Fiction')
    const [yearFrom, yearTo] = thumbsOf('Release year')
    expect(yearFrom).toHaveValue('1990')
    expect(yearTo).toHaveValue(String(new Date().getUTCFullYear()))
    expect(screen.getAllByRole('status').map((readout) => readout.textContent)).toEqual([
      'From 1990',
      'Until 120 min',
      'Any rating',
    ])
    const [runtimeFrom, runtimeTo] = thumbsOf('Runtime')
    expect(runtimeFrom).toHaveValue('30')
    expect(runtimeTo).toHaveValue('120')
    expect(screen.getByRole('combobox', { name: 'Person' })).toHaveValue('Amy Adams')
  })

  it('counts every filter in force on its button, the title search included', () => {
    setup({ q: 'dune', genres: ['drama', 'science-fiction'], runtimeMin: 90 })
    expect(toggle()).toHaveTextContent('4')
  })

  it('applies nothing while the fields change, then everything at once on Apply', async () => {
    const { onChange } = setup()
    await userEvent.click(toggle())
    await userEvent.type(screen.getByRole('searchbox', { name: 'Title' }), '  dune ')
    await userEvent.click(screen.getByRole('combobox', { name: 'Genres' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Science Fiction' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Drama' }))
    await userEvent.keyboard('{Escape}')
    const [shortest, longest] = thumbsOf('Runtime')
    shortest!.focus()
    await userEvent.keyboard('{ArrowRight}')
    longest!.focus()
    await userEvent.keyboard('{ArrowLeft}')
    const [from] = thumbsOf('Release year')
    from!.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByText('From 1921')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('radio', { name: '4 stars' }))
    await userEvent.type(screen.getByRole('combobox', { name: 'Person' }), 'amy')
    await userEvent.click(await screen.findByRole('option', { name: 'Amy Adams' }))
    expect(onChange).not.toHaveBeenCalled()

    await apply()
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith({
      ...NOTHING,
      q: 'dune',
      // In catalog order, whatever order they were picked in.
      genres: ['drama', 'science-fiction'],
      person: 'amy-adams',
      yearFrom: 1921,
      runtimeMin: 35,
      runtimeMax: 235,
      ratingMin: 4,
    })
    // Tucked away again: the chips show what is now in force.
    expect(toggle()).toHaveAttribute('aria-expanded', 'false')
  })

  it('applies on Enter in the title', async () => {
    const { onChange } = setup({ genres: ['drama'] })
    await userEvent.click(toggle())
    await userEvent.type(screen.getByRole('searchbox', { name: 'Title' }), 'dune{Enter}')
    expect(onChange).toHaveBeenCalledWith({ ...NOTHING, q: 'dune', genres: ['drama'] })
  })

  it('keeps a bound the track cannot show while the other thumb moves', async () => {
    const { onChange } = setup({ runtimeMax: 300 })
    await userEvent.click(toggle())
    const [shortest] = thumbsOf('Runtime')
    shortest!.focus()
    await userEvent.keyboard('{ArrowRight}')
    await apply()
    expect(onChange).toHaveBeenCalledWith({ ...NOTHING, runtimeMin: 35, runtimeMax: 300 })
  })

  it('resets the fields without applying, beyond-track bounds and the highest rating too', async () => {
    const { onChange } = setup({
      q: 'dune',
      genres: ['drama'],
      yearFrom: 1900,
      ratingMin: 3.5,
      ratingMax: 4.5,
    })
    await userEvent.click(toggle())
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('searchbox', { name: 'Title' })).toHaveValue('')
    expect(genreField()).not.toHaveTextContent('Drama')
    expect(pickedRating()).toBeNull()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled()
    await apply()
    expect(onChange).toHaveBeenCalledWith(NOTHING)
  })

  it('has nothing to reset while the fields are empty', async () => {
    setup()
    await userEvent.click(toggle())
    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled()
  })

  it('waits to apply while a navigation is in flight', async () => {
    const props = { sort: 'newest' as const, genres, onChange: vi.fn(), onSortChange: vi.fn() }
    render(<MovieFilters {...props} filters={EMPTY_MOVIE_FILTERS} person={null} disabled />)
    await userEvent.click(toggle())
    expect(screen.getByRole('button', { name: 'Apply filters' })).toBeDisabled()
  })

  it('follows the URL when its filters change', async () => {
    const { rerenderWith } = setup({ genres: ['drama'] })
    await userEvent.click(toggle())
    expect(genreField()).toHaveTextContent('Drama')
    rerenderWith({ genres: ['science-fiction'], runtimeMin: 90 })
    expect(genreField()).toHaveTextContent('Science Fiction')
    expect(genreField()).not.toHaveTextContent('Drama')
    expect(thumbsOf('Runtime')[0]).toHaveValue('90')
  })

  it('holds what the fields show until the navigation lands, then follows the URL', async () => {
    const props = { sort: 'newest' as const, genres, onChange: vi.fn(), onSortChange: vi.fn() }
    const filters = { ...EMPTY_MOVIE_FILTERS, genres: ['drama'], ratingMin: 3.5 }
    const next = { ...EMPTY_MOVIE_FILTERS, genres: ['science-fiction'], ratingMax: 2 }
    const { rerender } = render(<MovieFilters {...props} filters={filters} person={null} />)
    await userEvent.click(toggle())
    // A navigation is in flight and the URL moves under the fields: they keep what they show.
    rerender(<MovieFilters {...props} filters={next} person={null} disabled />)
    expect(genreField()).toHaveTextContent('Drama')
    expect(pickedRating()).toBe('3.5')
    rerender(<MovieFilters {...props} filters={next} person={null} />)
    expect(genreField()).toHaveTextContent('Science Fiction')
    expect(pickedRating()).toBeNull()
  })

  it('shows a chip per filter and lifts one at a time', async () => {
    const { onChange } = setup(
      {
        q: 'dune',
        genres: ['drama', 'science-fiction'],
        yearFrom: 1990,
        yearTo: 1999,
        runtimeMin: 90,
        ratingMin: 3,
        ratingMax: 4.5,
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
      'Rated 3–4.5',
      'Amy Adams',
      'Clear all',
    ])
    await userEvent.click(chips.getByRole('button', { name: 'Remove Science Fiction' }))
    expect(onChange).toHaveBeenLastCalledWith({ genres: ['drama'] })
    await userEvent.click(chips.getByRole('button', { name: 'Remove 1990–1999' }))
    expect(onChange).toHaveBeenLastCalledWith({ yearFrom: null, yearTo: null })
    await userEvent.click(chips.getByRole('button', { name: 'Remove From 90 min' }))
    expect(onChange).toHaveBeenLastCalledWith({ runtimeMin: null, runtimeMax: null })
    await userEvent.click(chips.getByRole('button', { name: 'Remove Rated 3–4.5' }))
    expect(onChange).toHaveBeenLastCalledWith({ ratingMin: null, ratingMax: null })
    await userEvent.click(chips.getByRole('button', { name: 'Remove Amy Adams' }))
    expect(onChange).toHaveBeenLastCalledWith({ person: '' })
    await userEvent.click(chips.getByRole('button', { name: 'Remove “dune”' }))
    expect(onChange).toHaveBeenLastCalledWith({ q: '' })
    await userEvent.click(chips.getByRole('button', { name: 'Clear all' }))
    expect(onChange).toHaveBeenLastCalledWith(EMPTY_MOVIE_FILTERS)
  })

  it('names an unknown person by slug and a range by its open end', () => {
    setup({ person: 'nobody', yearTo: 1999, runtimeMax: 120, ratingMax: 2 })
    const chips = screen.getByRole('list', { name: 'Active filters' })
    expect(chips).toHaveTextContent('nobody')
    expect(chips).toHaveTextContent('Until 1999')
    expect(chips).toHaveTextContent('Until 120 min')
    expect(chips).toHaveTextContent('Rated up to 2')
  })

  it('names a rating floor by its lowest rating and checks its star', async () => {
    setup({ ratingMin: 3.5 })
    expect(screen.getByRole('list', { name: 'Active filters' })).toHaveTextContent('Rated 3.5+')
    expect(toggle()).toHaveTextContent('1')
    await userEvent.click(toggle())
    expect(pickedRating()).toBe('3.5')
  })

  it('picks a rating floor on the stars, keeping a highest rating, and clears it', async () => {
    const { onChange } = setup({ ratingMin: 3.5, ratingMax: 4.5 })
    await userEvent.click(toggle())
    const rating = within(screen.getByRole('radiogroup', { name: 'Rating' }))
    await userEvent.click(rating.getByRole('radio', { name: '2 stars' }))
    expect(pickedRating()).toBe('2')
    await apply()
    expect(onChange).toHaveBeenLastCalledWith({ ...NOTHING, ratingMin: 2, ratingMax: 4.5 })
    await userEvent.click(toggle())
    await userEvent.click(screen.getByRole('button', { name: 'Clear the rating filter' }))
    await apply()
    expect(onChange).toHaveBeenLastCalledWith({ ...NOTHING, ratingMax: 4.5 })
  })

  it('follows rating-only URL changes and clears the stars on landing', async () => {
    const { rerenderWith } = setup({ ratingMin: 3.5 })
    await userEvent.click(toggle())
    rerenderWith({ ratingMin: 1 })
    expect(pickedRating()).toBe('1')
    rerenderWith({ ratingMax: 2 })
    expect(pickedRating()).toBeNull()
    rerenderWith({})
    expect(screen.getByText('Any rating')).toBeInTheDocument()
  })

  it('lists every genre on focus and narrows it as the visitor types', async () => {
    setup()
    await userEvent.click(toggle())
    const genreBox = screen.getByRole('combobox', { name: 'Genres' })
    await userEvent.click(genreBox)
    expect(await screen.findAllByRole('option')).toHaveLength(2)
    await userEvent.type(genreBox, 'sci')
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Science Fiction',
    ])
  })

  it('removes a picked genre from its chip in the field, applying it with the rest', async () => {
    const { onChange } = setup({ genres: ['drama', 'science-fiction'] })
    await userEvent.click(toggle())
    const field = genreField()
    await userEvent.click(within(field as HTMLElement).getAllByRole('button')[0]!)
    expect(onChange).not.toHaveBeenCalled()
    expect(field).not.toHaveTextContent('Drama')
    expect(field).toHaveTextContent('Science Fiction')
    await apply()
    expect(onChange).toHaveBeenCalledWith({ ...NOTHING, genres: ['science-fiction'] })
  })

  it('changes the sort at once', async () => {
    const { onSortChange, onChange } = setup()
    await userEvent.click(screen.getByRole('combobox', { name: 'Sort' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Recently added' }))
    expect(onSortChange).toHaveBeenCalledWith('added')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('sorts by the highest rating', async () => {
    const { onSortChange } = setup()
    await userEvent.click(screen.getByRole('combobox', { name: 'Sort' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Highest rated' }))
    expect(onSortChange).toHaveBeenCalledWith('rating')
  })
})
