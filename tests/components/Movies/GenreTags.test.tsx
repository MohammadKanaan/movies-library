import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GenreTags } from '@/components/Movies/GenreTags'

describe('GenreTags', () => {
  it('links each genre to the movie list filtered by it', () => {
    render(
      <GenreTags
        genres={[
          { id: 'g1', name: 'Drama', slug: 'drama' },
          { id: 'g2', name: 'Science Fiction', slug: 'science-fiction' },
        ]}
      />,
    )
    expect(screen.getByRole('list', { name: 'Genres' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Drama' })).toHaveAttribute(
      'href',
      '/movies?genres=drama',
    )
    expect(screen.getByRole('link', { name: 'Science Fiction' })).toHaveAttribute(
      'href',
      '/movies?genres=science-fiction',
    )
  })

  it('renders nothing without genres', () => {
    const { container } = render(<GenreTags genres={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
