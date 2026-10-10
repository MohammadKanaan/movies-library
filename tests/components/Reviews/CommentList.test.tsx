import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CommentList } from '@/components/Reviews/CommentList'

describe('CommentList', () => {
  it('says there are no comments yet', () => {
    render(<CommentList comments={[]} />)
    expect(screen.getByText('No comments yet.')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('links a page past the end of the list back to the first page', () => {
    render(<CommentList comments={[]} firstPageHref="/movies/dune-2021/reviews/r1#comments" />)
    expect(screen.getByText(/No comments on this page/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to the first page' })).toHaveAttribute(
      'href',
      '/movies/dune-2021/reviews/r1#comments',
    )
  })
})
