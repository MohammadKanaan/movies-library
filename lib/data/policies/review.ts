import 'server-only'
import type { Policy } from '../policy'
import { isAdmin, isAuthor } from './rules'

/** What a review rule may look at. */
export type ReviewRecord = { authorId: string }

/**
 * Authors edit their own review; nobody edits another's, not even an admin. An admin moderates by
 * deleting.
 */
export const reviewPolicy = {
  update: isAuthor,
  delete: (viewer, record) => isAuthor(viewer, record) || isAdmin(viewer, record),
} satisfies Policy<ReviewRecord>
