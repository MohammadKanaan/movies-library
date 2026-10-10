import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StarRating } from '@/components/Reviews/StarRating'

describe('StarRating', () => {
  it('is one image that says the rating out of five', () => {
    render(<StarRating rating={4.5} />)
    expect(screen.getByRole('img', { name: '4.5 out of 5 stars' })).toBeInTheDocument()
  })

  it('says a whole rating without a decimal', () => {
    render(<StarRating rating={3} />)
    expect(screen.getByRole('img', { name: '3 out of 5 stars' })).toBeInTheDocument()
  })

  it('can be decorative, for a rating written out beside it', () => {
    render(<StarRating rating={4} decorative />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
