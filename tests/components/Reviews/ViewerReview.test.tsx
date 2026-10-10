import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ViewerReview } from '@/components/Reviews/ViewerReview'
import type { Review } from '@/lib/dto/reviews'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock('@/actions/reviews', () => ({ createReviewAction: vi.fn(), updateReviewAction: vi.fn() }))

const movieId = '0190d1a2-0000-7000-8000-000000000001'

const review: Review = {
  id: '0190d1a2-0000-7000-8000-000000000002',
  movieId,
  rating: 4,
  body: 'The twist is the point.',
  spoiler: false,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
  commentCount: 0,
  author: { id: 'u1', name: 'Leanne Graham', username: 'leanne' },
  permissions: { update: true, delete: true },
}

describe('ViewerReview', () => {
  it('shows the review with an Edit button that opens the form', async () => {
    render(
      <ViewerReview movieId={movieId} review={review}>
        <p>The card</p>
      </ViewerReview>,
    )
    expect(screen.getByRole('heading', { name: 'Your review' })).toBeInTheDocument()
    expect(screen.getByText('The card')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(screen.getByRole('heading', { name: 'Edit your review' })).toBeInTheDocument()
    expect(screen.queryByText('The card')).not.toBeInTheDocument()
  })

  it('starts on the form when asked to', () => {
    render(
      <ViewerReview movieId={movieId} review={review} startEditing>
        <p>The card</p>
      </ViewerReview>,
    )
    expect(screen.getByRole('heading', { name: 'Edit your review' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save review' })).toBeInTheDocument()
  })

  it('offers the form to a viewer without a review', () => {
    render(<ViewerReview movieId={movieId} review={null} />)
    expect(screen.getByRole('heading', { name: 'Rate this movie' })).toBeInTheDocument()
  })
})
