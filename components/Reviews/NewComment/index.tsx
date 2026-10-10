'use client'

import { toast } from 'sonner'
import { createCommentAction } from '@/actions/reviewComments'
import { CommentForm } from '@/components/Reviews/CommentForm'
import { useUrlState } from '@/hooks/useUrlState'
import { commentsUrlQuery } from '@/lib/dto/reviewComments'

type NewCommentProps = {
  reviewId: string
  /** The page of the list a new comment lands on (the last one, counting itself). */
  landingPage: number
}

/** The box for the viewer's comment on a review. Once posted, the list shows the comment. */
export const NewComment = ({ reviewId, landingPage }: NewCommentProps) => {
  const { state, setState } = useUrlState(commentsUrlQuery, { history: 'push' })

  return (
    <CommentForm
      submitLabel="Post comment"
      onSubmit={async (values) => {
        const result = await createCommentAction({ reviewId, ...values })
        if (result.ok) {
          toast.success('Your comment was posted')
          // The action refreshed the page in view; a comment that opens a new page is off it.
          if (landingPage !== state.page) {
            setState({ page: landingPage })
          }
        }
        return result
      }}
    />
  )
}
