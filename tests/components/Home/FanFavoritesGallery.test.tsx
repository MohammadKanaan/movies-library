import { createEvent, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { FanFavoritesGallery } from '@/components/Home/FanFavoritesGallery'
import type { MovieSummary } from '@/lib/dto/movies'

const movie = (index: number, title: string): MovieSummary => ({
  id: `0190d1a2-0000-7000-8000-00000000000${index}`,
  slug: `${title.toLowerCase().replace(/\W+/g, '-')}-2019`,
  title,
  releaseDate: new Date('2019-05-30T00:00:00.000Z'),
  runtimeMinutes: 132,
  posterUrl: null,
  genres: [],
  rating: { average: 4.7, count: 12 },
})

const movies = [movie(1, 'Parasite'), movie(2, 'Arrival'), movie(3, 'Heat')]

/** The `data-side` of each panel, in order. */
const sides = () => screen.getAllByRole('listitem').map((item) => item.getAttribute('data-side'))

describe('FanFavoritesGallery', () => {
  it('lists each movie as a link named by its title, year and rating, the first one open', () => {
    render(<FanFavoritesGallery movies={movies} />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)
    expect(links[0]).toHaveAttribute('href', '/movies/parasite-2019')
    expect(links[0]).toHaveAccessibleName('Parasite 2019 Rated 4.7 · 12 ratings')
    expect(sides()).toEqual(['active', 'after', 'after'])
  })

  it('leaves out the rating of an unrated movie', () => {
    render(<FanFavoritesGallery movies={[{ ...movies[0], rating: { average: null, count: 0 } }]} />)
    expect(screen.getByRole('link')).toHaveAccessibleName('Parasite 2019')
  })

  it('opens the panel the mouse points at, tilting the others toward it', () => {
    render(<FanFavoritesGallery movies={movies} />)
    fireEvent.pointerEnter(screen.getAllByRole('link')[1], { pointerType: 'mouse' })
    expect(sides()).toEqual(['before', 'active', 'after'])
  })

  it('opens a panel on keyboard focus, and Enter follows its link', async () => {
    const user = userEvent.setup()
    render(<FanFavoritesGallery movies={movies} />)
    await user.tab()
    await user.tab()
    const arrival = screen.getAllByRole('link')[1]
    expect(arrival).toHaveFocus()
    expect(sides()).toEqual(['before', 'active', 'after'])

    // Even after a press that never became a click.
    fireEvent.pointerDown(screen.getAllByRole('link')[2], { pointerType: 'mouse' })
    fireEvent.keyDown(arrival, { key: 'Enter' })
    const enter = createEvent.click(arrival)
    fireEvent(arrival, enter)
    expect(enter.defaultPrevented).toBe(false)
  })

  it('on touch, opens a closed panel on the first tap and follows the link on the second', () => {
    render(<FanFavoritesGallery movies={movies} />)
    const heat = screen.getAllByRole('link')[2]
    /** A tap as a browser fires it: the finger lifts (and leaves) before focus and the click. */
    const tap = () => {
      fireEvent.pointerEnter(heat, { pointerType: 'touch' })
      fireEvent.pointerDown(heat, { pointerType: 'touch' })
      fireEvent.pointerUp(heat, { pointerType: 'touch' })
      fireEvent.pointerLeave(heat, { pointerType: 'touch' })
      fireEvent.focus(heat)
      const click = createEvent.click(heat)
      fireEvent(heat, click)
      return click
    }

    expect(tap().defaultPrevented).toBe(true)
    expect(sides()).toEqual(['before', 'before', 'active'])
    expect(tap().defaultPrevented).toBe(false)
  })

  it('follows a mouse click on the panel the mouse opened', () => {
    render(<FanFavoritesGallery movies={movies} />)
    const heat = screen.getAllByRole('link')[2]
    fireEvent.pointerEnter(heat, { pointerType: 'mouse' })
    fireEvent.pointerDown(heat, { pointerType: 'mouse' })
    const click = createEvent.click(heat)
    fireEvent(heat, click)
    expect(click.defaultPrevented).toBe(false)
  })
})
