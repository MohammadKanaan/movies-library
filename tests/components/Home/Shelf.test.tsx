import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Shelf } from '@/components/Home/Shelf'

describe('Shelf', () => {
  it('is a section named by its heading, holding its items as a list', () => {
    render(
      <Shelf id="trending" title="Trending movies" description="This week.">
        <li>Dune</li>
        <li>Arrival</li>
      </Shelf>,
    )
    const section = screen.getByRole('region', { name: 'Trending movies' })
    expect(section).toContainElement(screen.getByRole('heading', { level: 2 }))
    expect(screen.getByText('This week.')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'Dune',
      'Arrival',
    ])
  })

  it('can caption its content from below and hold content with its own list', () => {
    render(
      <Shelf id="favorites" title="Fan favorites" layout="none" headingPosition="below">
        <p>Gallery</p>
      </Shelf>,
    )
    const section = screen.getByRole('region', { name: 'Fan favorites' })
    expect(section.firstElementChild).toHaveTextContent('Gallery')
    expect(section.lastElementChild).toContainElement(screen.getByRole('heading', { level: 2 }))
    expect(screen.queryByRole('list')).toBeNull()
  })
})
