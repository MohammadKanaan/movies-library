import { z } from 'zod'
import { pageQuerySchema, permissionsSchema } from './common'
import { reviewIdSchema } from './reviews'
import { userProfileSchema } from './users'

export const COMMENT_BODY_MAX_LENGTH = 2_000

export const commentIdSchema = z.uuid('Invalid comment id')

const commentBody = z
  .string('Write a comment')
  .trim()
  .min(1, 'Write a comment')
  .max(COMMENT_BODY_MAX_LENGTH, `Comment must be ${COMMENT_BODY_MAX_LENGTH} characters or fewer`)

/** What the comment form edits; the review or comment id is added around it. */
export const commentFormInput = z.object({ body: commentBody })

export type CommentFormInput = z.input<typeof commentFormInput>
export type CommentFormValues = z.output<typeof commentFormInput>

/** Writing a comment: its text under a review. The author is always the viewer. */
export const commentInput = z.object({ reviewId: reviewIdSchema, body: commentBody })

export type CommentInput = z.input<typeof commentInput>

/** Editing a comment replaces its text. */
export const updateCommentInput = z.object({ id: commentIdSchema, body: commentBody })

export type UpdateCommentInput = z.input<typeof updateCommentInput>

/** One comment under a review. */
export const reviewCommentSchema = z.object({
  id: z.string(),
  reviewId: z.string(),
  body: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  author: userProfileSchema,
  permissions: permissionsSchema,
})

export type ReviewComment = z.infer<typeof reviewCommentSchema>

export const listCommentsQuery = pageQuerySchema.extend({ reviewId: reviewIdSchema })

export type ListCommentsQuery = z.input<typeof listCommentsQuery>

/** The tolerant URL contract of a review's comment list: any query string parses. */
export const commentsUrlQuery = z.object({
  page: pageQuerySchema.shape.page.catch(1),
})
