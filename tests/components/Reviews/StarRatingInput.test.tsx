import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { StarRatingInput } from '@/components/Reviews/StarRatingInput'

const Controlled = ({ initial = 0 }: { initial?: number }) => {
  const [value, setValue] = useState(initial)
  return <StarRatingInput value={value} onChange={setValue} aria-label="Your rating" />
}

describe('StarRatingInput', () => {
  it('offers ten radios, ½ to 5 stars, in one group', () => {
    render(<Controlled />)
    expect(screen.getByRole('radiogroup', { name: 'Your rating' })).toBeInTheDocument()
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(10)
    expect(radios.map((radio) => radio.getAttribute('value'))).toEqual([
      '0.5',
      '1',
      '1.5',
      '2',
      '2.5',
      '3',
      '3.5',
      '4',
      '4.5',
      '5',
    ])
    expect(screen.getByRole('radio', { name: '1 star' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '0.5 stars' })).toBeInTheDocument()
    expect(radios.some((radio) => (radio as HTMLInputElement).checked)).toBe(false)
  })

  it('checks the radio of its value', () => {
    render(<Controlled initial={3.5} />)
    expect(screen.getByRole('radio', { name: '3.5 stars' })).toBeChecked()
  })

  it('reports the half star that is clicked', async () => {
    const onChange = vi.fn()
    render(<StarRatingInput value={0} onChange={onChange} aria-label="Your rating" />)
    await userEvent.click(screen.getByRole('radio', { name: '4.5 stars' }))
    expect(onChange).toHaveBeenCalledWith(4.5)
  })

  it('moves by half stars with the arrow keys', async () => {
    render(<Controlled initial={2} />)
    await userEvent.tab()
    expect(screen.getByRole('radio', { name: '2 stars' })).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: '2.5 stars' })).toBeChecked()
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(screen.getByRole('radio', { name: '1.5 stars' })).toBeChecked()
  })

  it('cannot be changed when disabled', () => {
    render(<StarRatingInput value={2} onChange={vi.fn()} disabled aria-label="Your rating" />)
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeDisabled()
    }
  })

  it('writes the rating out beside the stars', async () => {
    const { container } = render(<Controlled />)
    const group = screen.getByRole('radiogroup', { name: 'Your rating' })
    expect(group).not.toHaveTextContent('/ 5')
    await userEvent.click(screen.getByRole('radio', { name: '3.5 stars' }))
    expect(container).toHaveTextContent('3.5 / 5')
  })

  it('previews a hovered rating without picking it, and drops the preview on leave', async () => {
    const onChange = vi.fn()
    const { container } = render(
      <StarRatingInput value={2} onChange={onChange} aria-label="Your rating" />,
    )
    const group = screen.getByRole('radiogroup', { name: 'Your rating' })
    const fourAndAHalf = screen.getByRole('radio', { name: '4.5 stars' }).closest('label')!
    await userEvent.hover(fourAndAHalf)
    expect(group).toHaveAttribute('data-previewing')
    expect(container).toHaveTextContent('4.5 / 5')
    expect(onChange).not.toHaveBeenCalled()
    await userEvent.unhover(group)
    expect(group).not.toHaveAttribute('data-previewing')
    expect(container).toHaveTextContent('2 / 5')
  })
})
