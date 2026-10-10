'use client'

import { toast } from 'sonner'
import { createCommentAction } from '@/actions/reviewComments'
import { CommentForm } from '@/components/Reviews/CommentForm'

type NewCommentProps = {
  reviewId: string
}

/** The box for the viewer's comment on a review. */
export const NewComment = ({ reviewId }: NewCommentProps) => {
  return (
    <CommentForm
      submitLabel="Post comment"
      onSubmit={async (values) => {
        const result = await createCommentAction({ reviewId, ...values })
        if (result.ok) {
          toast.success('Your comment was posted')
        }
        return result
      }}
    />
  )
}
