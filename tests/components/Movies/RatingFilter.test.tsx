import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RatingFilter } from '@/components/Movies/RatingFilter'

describe('RatingFilter', () => {
  it('reads any rating with nothing to clear until a floor is picked', async () => {
    const onChange = vi.fn()
    render(<RatingFilter value={null} onChange={onChange} />)
    expect(screen.getByRole('status')).toHaveTextContent('Any rating')
    expect(
      screen.queryByRole('button', { name: 'Clear the rating filter' }),
    ).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('radio', { name: '4 stars' }))
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('names the floor, checks its star and clears it', async () => {
    const onChange = vi.fn()
    render(<RatingFilter value={1} onChange={onChange} />)
    expect(screen.getByRole('status')).toHaveTextContent('1 star & up')
    expect(screen.getByRole('radio', { name: '1 star' })).toBeChecked()
    await userEvent.click(screen.getByRole('button', { name: 'Clear the rating filter' }))
    expect(onChange).toHaveBeenCalledWith(null)
  })
})
