import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MovieCard } from '@/components/Movies/MovieCard'
import type { MovieSummary } from '@/lib/dto/movies'

const dune: MovieSummary = {
  id: '0190d1a2-0000-7000-8000-000000000001',
  slug: 'dune-part-two-2024',
  title: 'Dune: Part Two',
  releaseDate: new Date('2024-03-01T00:00:00.000Z'),
  runtimeMinutes: 166,
  posterUrl: 'https://media.example.com/poster/dune.jpg',
  genres: [
    { id: 'g1', name: 'Adventure', slug: 'adventure' },
    { id: 'g2', name: 'Science Fiction', slug: 'science-fiction' },
    { id: 'g3', name: 'Drama', slug: 'drama' },
  ],
}

describe('MovieCard', () => {
  it('links to the movie and reads as its title, year, runtime and first two genres', () => {
    render(<MovieCard movie={dune} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/movies/dune-part-two-2024')
    expect(link).toHaveAccessibleName('Dune: Part Two 2024 2h 46m · Adventure · Science Fiction')
  })

  it('shows the poster as decoration, lazily unless it is above the fold', () => {
    const { container, rerender } = render(<MovieCard movie={dune} />)
    const image = container.querySelector('img')
    expect(image).toHaveAttribute('src', dune.posterUrl)
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveAttribute('loading', 'lazy')
    rerender(<MovieCard movie={dune} priority />)
    expect(container.querySelector('img')).toHaveAttribute('loading', 'eager')
  })

  it('falls back to the title without a poster and leaves out an unknown runtime', () => {
    const { container } = render(
      <MovieCard movie={{ ...dune, posterUrl: null, runtimeMinutes: null, genres: [] }} />,
    )
    expect(container.querySelector('img')).toBeNull()
    // The fallback title is decoration: the link still reads once as the title.
    expect(screen.getByRole('link')).toHaveAccessibleName('Dune: Part Two 2024')
  })
})
