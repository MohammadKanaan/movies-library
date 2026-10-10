import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ReviewEditingContext } from '@/components/Reviews/EditReviewAction'
import { ReviewCard } from '@/components/Reviews/ReviewCard'
import type { Review } from '@/lib/dto/reviews'

vi.mock('@/actions/reviews', () => ({ deleteReviewAction: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))

const review = (overrides: Partial<Review> = {}): Review => ({
  id: '0190d1a2-0000-7000-8000-000000000002',
  movieId: '0190d1a2-0000-7000-8000-000000000001',
  rating: 4,
  body: 'The twist is the point.',
  spoiler: false,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
  commentCount: 2,
  author: { id: 'u1', name: 'Leanne Graham', username: 'leanne', image: null },
  permissions: { update: false, delete: false },
  ...overrides,
})

describe('ReviewCard', () => {
  it('links to the review’s page with its number of comments', () => {
    render(<ReviewCard review={review()} movieSlug="dune-2021" preview />)
    expect(screen.getByRole('link', { name: '2 comments' })).toHaveAttribute(
      'href',
      `/movies/dune-2021/reviews/${review().id}#comments`,
    )
    expect(screen.getByRole('link', { name: 'Read full review' })).toBeInTheDocument()
  })

  it('says "1 comment" for a single one', () => {
    render(<ReviewCard review={review({ commentCount: 1 })} movieSlug="dune-2021" />)
    expect(screen.getByRole('link', { name: '1 comment' })).toBeInTheDocument()
  })

  it('keeps a spoiler review’s text and children inside a closed details', () => {
    const { container } = render(
      <ReviewCard review={review({ spoiler: true })} movieSlug="dune-2021">
        <section>Comments here</section>
      </ReviewCard>,
    )
    const details = container.querySelector('details')
    expect(details).not.toBeNull()
    expect(details).not.toHaveAttribute('open')
    expect(details).toHaveTextContent('The twist is the point.')
    expect(details).toHaveTextContent('Comments here')
  })

  it('leaves the children outside any details when the review is no spoiler', () => {
    const { container } = render(
      <ReviewCard review={review()} movieSlug="dune-2021">
        <section>Comments here</section>
      </ReviewCard>,
    )
    expect(container.querySelector('details')).toBeNull()
    expect(screen.getByText('Comments here')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /comments?$/ })).not.toBeInTheDocument()
  })
})

describe('ReviewCard actions', () => {
  const editable = review({ permissions: { update: true, delete: true } })

  it('puts Edit and Delete as icons at the end of the header, Edit first', () => {
    render(<ReviewCard review={editable} movieSlug="dune-2021" editHref="/movies/dune-2021#form" />)
    const group = screen.getByRole('group', { name: 'Review actions' })
    expect(group.closest('header')).not.toBeNull()
    const edit = within(group).getByRole('link', { name: 'Edit review' })
    const remove = within(group).getByRole('button', { name: 'Delete review' })
    expect(edit).toHaveAttribute('href', '/movies/dune-2021#form')
    expect(edit.compareDocumentPosition(remove) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('opens the form in place inside the viewer’s review', async () => {
    const startEditing = vi.fn()
    render(
      <ReviewEditingContext value={startEditing}>
        <ReviewCard review={editable} movieSlug="dune-2021" editHref="#your-review" />
      </ReviewEditingContext>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Edit review' }))
    expect(startEditing).toHaveBeenCalledTimes(1)
  })

  it('offers nothing to someone who may do nothing', () => {
    render(<ReviewCard review={review()} movieSlug="dune-2021" editHref="#your-review" />)
    expect(screen.queryByRole('group', { name: 'Review actions' })).not.toBeInTheDocument()
  })
})
