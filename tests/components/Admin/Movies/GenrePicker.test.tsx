import { render, screen, within } from '@testing-library/react'
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

const chipsOf = () =>
  screen
    .getByRole('combobox', { name: 'Genres' })
    .closest<HTMLElement>('[data-slot="combobox-chips"]')!

describe('GenrePicker', () => {
  it('shows the picked genres as chips in a Genres combobox', () => {
    render(<GenrePicker genres={genres} value={['g2']} onChange={vi.fn()} />)
    expect(chipsOf()).toHaveTextContent('Comedy')
    expect(chipsOf()).not.toHaveTextContent('Action')
    expect(screen.getByText(`Up to ${MOVIE_GENRES_MAX}`)).toBeInTheDocument()
  })

  it('lists every genre on focus and narrows it as the editor types', async () => {
    render(<GenrePicker genres={genres} value={[]} onChange={vi.fn()} />)
    const input = screen.getByRole('combobox', { name: 'Genres' })
    await userEvent.click(input)
    expect(await screen.findAllByRole('option')).toHaveLength(3)
    await userEvent.type(input, 'dra')
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual(['Drama'])
  })

  it('returns ids in genre order, not click order', async () => {
    const onChange = vi.fn()
    render(<GenrePicker genres={genres} value={['g3']} onChange={onChange} />)
    await userEvent.click(screen.getByRole('combobox', { name: 'Genres' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Action' }))
    expect(onChange).toHaveBeenCalledWith(['g1', 'g3'])
  })

  it('removes an id from its chip', async () => {
    const onChange = vi.fn()
    render(<GenrePicker genres={genres} value={['g1', 'g3']} onChange={onChange} />)
    await userEvent.click(within(chipsOf()).getAllByRole('button')[0]!)
    expect(onChange).toHaveBeenCalledWith(['g3'])
  })

  it('disables the unpicked genres at the cap but not the picked ones', async () => {
    const many: Genre[] = Array.from({ length: MOVIE_GENRES_MAX + 1 }, (_, index) => ({
      id: `id-${index}`,
      name: `Genre ${index}`,
      slug: `genre-${index}`,
    }))
    const selected = many.slice(0, MOVIE_GENRES_MAX).map((genre) => genre.id)
    render(<GenrePicker genres={many} value={selected} onChange={vi.fn()} />)
    await userEvent.click(screen.getByRole('combobox', { name: 'Genres' }))
    expect(await screen.findByRole('option', { name: 'Genre 0' })).not.toHaveAttribute(
      'aria-disabled',
      'true',
    )
    expect(screen.getByRole('option', { name: `Genre ${MOVIE_GENRES_MAX}` })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
  })

  it('disables the field when disabled', () => {
    render(<GenrePicker genres={genres} value={[]} onChange={vi.fn()} disabled />)
    expect(screen.getByRole('combobox', { name: 'Genres' })).toBeDisabled()
  })

  it('shows the error with role alert and links it to the field', () => {
    render(<GenrePicker genres={genres} value={[]} onChange={vi.fn()} error="Pick a genre" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Pick a genre')
    const input = screen.getByRole('combobox', { name: 'Genres' })
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription(expect.stringContaining('Pick a genre'))
  })
})
