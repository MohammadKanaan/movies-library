import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { GenrePicker } from '@/components/Admin/Movies/GenrePicker'
import { MOVIE_GENRES_MAX } from '@/lib/dto/movies'
import type { Genre } from '@/lib/dto/genres'

const genres: Genre[] = [
  { id: 'g1', name: 'Action', slug: 'action' },
  { id: 'g2', name: 'Comedy', slug: 'comedy' },
  { id: 'g3', name: 'Drama', slug: 'drama' },
]

// Base UI's checkbox is a span with role="checkbox", so disabled shows up as aria-disabled.
const isDisabled = (element: HTMLElement) => element.getAttribute('aria-disabled') === 'true'

describe('GenrePicker', () => {
  it('renders a checkbox per genre inside a Genres group', () => {
    render(<GenrePicker genres={genres} value={['g2']} onChange={vi.fn()} />)
    expect(screen.getByRole('group', { name: 'Genres' })).toBeInTheDocument()
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
    expect(screen.getByRole('checkbox', { name: 'Comedy' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Action' })).not.toBeChecked()
    expect(screen.getByText(`Up to ${MOVIE_GENRES_MAX}`)).toBeInTheDocument()
  })

  it('returns ids in genre order, not click order', async () => {
    const onChange = vi.fn()
    render(<GenrePicker genres={genres} value={['g3']} onChange={onChange} />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Action' }))
    expect(onChange).toHaveBeenCalledWith(['g1', 'g3'])
  })

  it('removes an id when unchecked', async () => {
    const onChange = vi.fn()
    render(<GenrePicker genres={genres} value={['g1', 'g3']} onChange={onChange} />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Action' }))
    expect(onChange).toHaveBeenCalledWith(['g3'])
  })

  it('disables the unchecked boxes at the cap but not the checked ones', () => {
    const many: Genre[] = Array.from({ length: MOVIE_GENRES_MAX + 1 }, (_, index) => ({
      id: `id-${index}`,
      name: `Genre ${index}`,
      slug: `genre-${index}`,
    }))
    const selected = many.slice(0, MOVIE_GENRES_MAX).map((genre) => genre.id)
    render(<GenrePicker genres={many} value={selected} onChange={vi.fn()} />)
    expect(isDisabled(screen.getByRole('checkbox', { name: 'Genre 0' }))).toBe(false)
    expect(isDisabled(screen.getByRole('checkbox', { name: `Genre ${MOVIE_GENRES_MAX}` }))).toBe(
      true,
    )
  })

  it('disables everything when disabled', () => {
    render(<GenrePicker genres={genres} value={[]} onChange={vi.fn()} disabled />)
    for (const box of screen.getAllByRole('checkbox')) {
      expect(isDisabled(box)).toBe(true)
    }
  })

  it('shows the error with role alert and links it to the group', () => {
    render(<GenrePicker genres={genres} value={[]} onChange={vi.fn()} error="Pick a genre" />)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Pick a genre')
    expect(screen.getByRole('group', { name: 'Genres' })).toHaveAccessibleDescription(
      expect.stringContaining('Pick a genre'),
    )
  })
})
