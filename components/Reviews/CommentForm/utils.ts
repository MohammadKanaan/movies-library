import type { CommentFormInput } from '@/lib/dto/reviewComments'

export const COMMENT_FORM_FIELDS = ['body'] as const

/** What the form starts from: a new comment is empty. */
export const hydrateCommentForm = (
  comment?: { body: string } | null,
): Required<CommentFormInput> => {
  return { body: comment?.body ?? '' }
}
