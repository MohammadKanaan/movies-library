import 'server-only'
import type { Policy } from '../policy'
import { isAdmin, isAuthor } from './rules'

/** What a comment rule may look at. */
export type ReviewCommentRecord = { authorId: string }

/**
 * The same rules as a review: authors edit their own comment, nobody edits another's, not even an
 * admin. An admin moderates by deleting.
 */
export const reviewCommentPolicy = {
  update: isAuthor,
  delete: (viewer, record) => isAuthor(viewer, record) || isAdmin(viewer, record),
} satisfies Policy<ReviewCommentRecord>
