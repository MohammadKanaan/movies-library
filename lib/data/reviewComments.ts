import 'server-only'
import type { Prisma } from '@/generated/prisma/client'
import { MINUTE } from '@/lib/constants-time'
import { toPage, type Page } from '@/lib/dto/common'
import {
  commentIdSchema,
  commentInput,
  listCommentsQuery,
  updateCommentInput,
  type CommentInput,
  type ListCommentsQuery,
  type ReviewComment,
  type UpdateCommentInput,
} from '@/lib/dto/reviewComments'
import { getSessionUser, requireUser, type SessionUser } from './auth'
import { db } from './db'
import { NotFoundError, parseInput } from './errors'
import { reviewCommentPolicy, type ReviewCommentRecord } from './policies/reviewComment'
import { authorize, permissionsFor } from './policy'
import { consumeRateLimit } from './rateLimit'
import { userProfileSelect } from './users'

// Flat comments under a review: no threading. Authors edit and delete their own comment, an admin
// can delete any (`reviewCommentPolicy`), nobody edits another's. Nothing here is cached: the list
// is short, ordered by time and `permissions` is per viewer.

const PERMISSION_ACTIONS = ['update', 'delete'] as const
/** Comments one user may write per minute. */
const COMMENT_LIMIT = { max: 20, windowMs: MINUTE * 1000 }

const commentSelect = {
  id: true,
  reviewId: true,
  body: true,
  createdAt: true,
  updatedAt: true,
  author: { select: userProfileSelect },
} satisfies Prisma.ReviewCommentSelect

type CommentRow = Prisma.ReviewCommentGetPayload<{ select: typeof commentSelect }>

/** The policy's record for a loaded comment: the comment's author. */
const recordOf = ({ author }: Pick<CommentRow, 'author'>): ReviewCommentRecord => ({
  authorId: author.id,
})

const toComment = (row: CommentRow, viewer: SessionUser | null): ReviewComment => ({
  ...row,
  permissions: permissionsFor(reviewCommentPolicy, PERMISSION_ACTIONS, viewer, recordOf(row)),
})

const assertReviewExists = async (reviewId: string) => {
  const review = await db.review.findUnique({ where: { id: reviewId }, select: { id: true } })
  if (!review) {
    throw new NotFoundError('Review not found')
  }
}

/**
 * Public: a page of a review's comments, oldest first so the conversation reads down (ids break
 * ties). The review must exist.
 */
export const listComments = async (query: ListCommentsQuery): Promise<Page<ReviewComment>> => {
  const viewer = await getSessionUser()
  const { reviewId, ...paging } = parseInput(listCommentsQuery, query)
  await assertReviewExists(reviewId)
  const where = { reviewId } satisfies Prisma.ReviewCommentWhereInput
  const [rows, totalItems] = await Promise.all([
    db.reviewComment.findMany({
      where,
      select: commentSelect,
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      skip: (paging.page - 1) * paging.perPage,
      take: paging.perPage,
    }),
    db.reviewComment.count({ where }),
  ])
  return toPage(
    rows.map((row) => toComment(row, viewer)),
    totalItems,
    paging,
  )
}

/**
 * Signed in (401) → within the rate limit (429) → input valid (422) → the review exists (404) →
 * created.
 */
export const createComment = async (input: CommentInput): Promise<ReviewComment> => {
  const viewer = await requireUser()
  await consumeRateLimit(`comment:user:${viewer.id}`, COMMENT_LIMIT)
  const { reviewId, body } = parseInput(commentInput, input)
  await assertReviewExists(reviewId)
  const now = new Date()
  // Both columns get the same instant, so a comment is "edited" only once it changes.
  const row = await db.reviewComment.create({
    data: { reviewId, authorId: viewer.id, body, createdAt: now, updatedAt: now },
    select: commentSelect,
  })
  return toComment(row, viewer)
}

/** Signed in → input valid → exists (404) → the author (403) → the text replaced. */
export const updateComment = async (input: UpdateCommentInput): Promise<ReviewComment> => {
  const viewer = await requireUser()
  const { id, body } = parseInput(updateCommentInput, input)
  const record = await db.reviewComment.findUnique({ where: { id }, select: { authorId: true } })
  if (!record) {
    throw new NotFoundError('Comment not found')
  }
  authorize(reviewCommentPolicy.update, viewer, record)
  const row = await db.reviewComment.update({
    where: { id },
    data: { body },
    select: commentSelect,
  })
  return toComment(row, viewer)
}

/** Signed in → id valid → exists (404) → the author or an admin (403) → deleted. */
export const deleteComment = async (id: string): Promise<void> => {
  const viewer = await requireUser()
  const commentId = parseInput(commentIdSchema, id)
  const record = await db.reviewComment.findUnique({
    where: { id: commentId },
    select: { authorId: true },
  })
  if (!record) {
    throw new NotFoundError('Comment not found')
  }
  authorize(reviewCommentPolicy.delete, viewer, record)
  await db.reviewComment.delete({ where: { id: commentId } })
}
