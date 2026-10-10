import { render, screen, waitFor, within } from '@testing-library/react'
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

describe('MovieFilters', () => {
  beforeEach(() => {
    vi.mocked(searchPeople)
      .mockReset()
      .mockResolvedValue({ items: [amy], page: 1, perPage: 10, totalItems: 1, totalPages: 1 })
  })

  it('keeps the card closed without advanced filters and shows no chips', () => {
    setup()
    expect(toggle()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('combobox', { name: 'Genres' })).not.toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Active filters' })).not.toBeInTheDocument()
  })

  it('opens the card when an advanced filter is in force, with the fields filled in', () => {
    setup({ genres: ['drama'], yearFrom: 1990, runtimeMax: 120, person: 'amy-adams' }, amy)
    expect(toggle()).toHaveAttribute('aria-expanded', 'true')
    const genreField = screen
      .getByRole('combobox', { name: 'Genres' })
      .closest('[data-slot="combobox-chips"]')
    expect(genreField).toHaveTextContent('Drama')
    expect(genreField).not.toHaveTextContent('Science Fiction')
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

  it('counts the card’s filters on its button, not the title search', () => {
    setup({ q: 'dune', genres: ['drama', 'science-fiction'], runtimeMin: 90 })
    expect(toggle()).toHaveTextContent('3')
  })

  it('submits a title search alone while the card is closed', async () => {
    const { onChange } = setup({ genres: ['drama'], yearTo: 1999 })
    // Opened by the filters in force; close it to search by title only.
    await userEvent.click(toggle())
    expect(toggle()).toHaveAttribute('aria-expanded', 'false')
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search movies' }), '  dune ')
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(onChange).toHaveBeenCalledWith({ q: 'dune' })
  })

  it('applies each genre as it is picked, in catalog order', async () => {
    const { onChange } = setup()
    await userEvent.click(toggle())
    await userEvent.click(screen.getByRole('combobox', { name: 'Genres' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Science Fiction' }))
    expect(onChange).toHaveBeenLastCalledWith({ genres: ['science-fiction'] })
    await userEvent.click(await screen.findByRole('option', { name: 'Drama' }))
    expect(onChange).toHaveBeenLastCalledWith({ genres: ['drama', 'science-fiction'] })
  })

  it('applies a range when its thumb settles, an end of the track being an open end', async () => {
    const { onChange } = setup()
    await userEvent.click(toggle())
    const [shortest, longest] = thumbsOf('Runtime')
    shortest!.focus()
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith({ runtimeMin: 35, runtimeMax: null }),
    )
    expect(screen.getByText('From 35 min')).toBeInTheDocument()

    longest!.focus()
    await userEvent.keyboard('{ArrowLeft}')
    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith({ runtimeMin: 35, runtimeMax: 235 }),
    )

    const [from] = thumbsOf('Release year')
    from!.focus()
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith({ yearFrom: 1921, yearTo: null }))
  })

  it('keeps a bound the track cannot show while the other thumb moves', async () => {
    const { onChange } = setup({ runtimeMax: 300 })
    const [shortest] = thumbsOf('Runtime')
    shortest!.focus()
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith({ runtimeMin: 35, runtimeMax: 300 }),
    )
  })

  it('sends one write for a burst of key presses', async () => {
    const { onChange } = setup()
    await userEvent.click(toggle())
    const [shortest] = thumbsOf('Runtime')
    shortest!.focus()
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}')
    await waitFor(() => expect(onChange).toHaveBeenCalled())
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith({ runtimeMin: 45, runtimeMax: null })
  })

  it('applies a person once picked', async () => {
    const { onChange } = setup()
    await userEvent.click(toggle())
    await userEvent.type(screen.getByRole('combobox', { name: 'Person' }), 'amy')
    await userEvent.click(await screen.findByRole('option', { name: 'Amy Adams' }))
    expect(onChange).toHaveBeenLastCalledWith({ person: 'amy-adams' })
  })

  it('resets the card’s filters and keeps the title search', async () => {
    const { onChange } = setup({
      q: 'dune',
      genres: ['drama'],
      yearFrom: 1990,
      ratingMin: 3.5,
      ratingMax: 4.5,
    })
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(onChange).toHaveBeenCalledWith({
      genres: [],
      person: '',
      yearFrom: null,
      yearTo: null,
      runtimeMin: null,
      runtimeMax: null,
      ratingMin: null,
      ratingMax: null,
    })
  })

  it('has nothing to reset until a card filter is in force', () => {
    setup({ q: 'dune' })
    expect(screen.queryByRole('button', { name: 'Reset' })).not.toBeInTheDocument()
  })

  it('follows the URL when its filters change', () => {
    const { rerenderWith } = setup({ genres: ['drama'] })
    const field = () =>
      screen.getByRole('combobox', { name: 'Genres' }).closest('[data-slot="combobox-chips"]')
    expect(field()).toHaveTextContent('Drama')
    rerenderWith({ genres: ['science-fiction'], runtimeMin: 90 })
    expect(field()).toHaveTextContent('Science Fiction')
    expect(field()).not.toHaveTextContent('Drama')
    expect(thumbsOf('Runtime')[0]).toHaveValue('90')
  })

  it('holds what was just chosen until the navigation lands, then follows the URL', () => {
    const props = { sort: 'newest' as const, genres, onChange: vi.fn(), onSortChange: vi.fn() }
    const filters = { ...EMPTY_MOVIE_FILTERS, genres: ['drama'], ratingMin: 3.5 }
    const next = { ...EMPTY_MOVIE_FILTERS, genres: ['science-fiction'], ratingMax: 2 }
    const { rerender } = render(<MovieFilters {...props} filters={filters} person={null} />)
    const field = () =>
      screen.getByRole('combobox', { name: 'Genres' }).closest('[data-slot="combobox-chips"]')
    // A navigation is in flight and the URL moves under the fields: they keep what they show.
    rerender(<MovieFilters {...props} filters={next} person={null} disabled />)
    expect(field()).toHaveTextContent('Drama')
    expect(thumbsOf('Average rating (stars)')[0]).toHaveValue('3.5')
    expect(thumbsOf('Average rating (stars)')[1]).toHaveValue('5')
    rerender(<MovieFilters {...props} filters={next} person={null} />)
    expect(field()).toHaveTextContent('Science Fiction')
    expect(thumbsOf('Average rating (stars)')[0]).toHaveValue('0.5')
    expect(thumbsOf('Average rating (stars)')[1]).toHaveValue('2')
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

  it('names a rating range open at the top by its lowest rating', () => {
    setup({ ratingMin: 3.5 })
    expect(screen.getByRole('list', { name: 'Active filters' })).toHaveTextContent('Rated 3.5+')
    expect(toggle()).toHaveAttribute('aria-expanded', 'true')
    expect(toggle()).toHaveTextContent('1')
    expect(thumbsOf('Average rating (stars)')[0]).toHaveValue('3.5')
    expect(thumbsOf('Average rating (stars)')[1]).toHaveValue('5')
  })

  it('applies rating thumbs in half-star steps and clears bounds at the track ends', async () => {
    const { onChange, rerenderWith } = setup()
    await userEvent.click(toggle())
    const [lowest, highest] = thumbsOf('Average rating (stars)')
    lowest!.focus()
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith({ ratingMin: 1, ratingMax: null }),
    )
    expect(screen.getByText('Rated 1+')).toBeInTheDocument()
    rerenderWith({ ratingMin: 1 })
    highest!.focus()
    await userEvent.keyboard('{ArrowLeft}')
    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith({ ratingMin: 1, ratingMax: 4.5 }))
    expect(screen.getByText('Rated 1–4.5')).toBeInTheDocument()
    rerenderWith({ ratingMin: 1, ratingMax: 4.5 })
    lowest!.focus()
    await userEvent.keyboard('{ArrowLeft}')
    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith({ ratingMin: null, ratingMax: 4.5 }),
    )
    rerenderWith({ ratingMax: 4.5 })
    highest!.focus()
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith({ ratingMin: null, ratingMax: null }),
    )
  })

  it('follows rating-only URL changes and resets the rating thumbs on landing', () => {
    const { rerenderWith } = setup({ ratingMin: 3.5 })
    rerenderWith({ ratingMax: 2 })
    expect(thumbsOf('Average rating (stars)')[0]).toHaveValue('0.5')
    expect(thumbsOf('Average rating (stars)')[1]).toHaveValue('2')
    rerenderWith({})
    expect(thumbsOf('Average rating (stars)')[1]).toHaveValue('5')
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

  it('removes a picked genre from its chip in the field', async () => {
    const { onChange } = setup({ genres: ['drama', 'science-fiction'] })
    const field = screen
      .getByRole('combobox', { name: 'Genres' })
      .closest('[data-slot="combobox-chips"]')
    expect(field).toHaveTextContent('Drama')
    await userEvent.click(within(field as HTMLElement).getAllByRole('button')[0]!)
    expect(onChange).toHaveBeenLastCalledWith({ genres: ['science-fiction'] })
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

  it('sorts by the highest rating', async () => {
    const { onSortChange } = setup()
    await userEvent.click(screen.getByRole('combobox', { name: 'Sort' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Highest rated' }))
    expect(onSortChange).toHaveBeenCalledWith('rating')
  })
})
