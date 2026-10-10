import 'server-only'
import type { Rule } from '../policy'

/** The catalog is admin-written for now: one rule shared by every catalog policy. */
export const isAdmin: Rule<unknown> = (viewer) => viewer !== null && viewer.role === 'admin'

/** The viewer wrote the record (it carries an `authorId`). */
export const isAuthor: Rule<{ authorId: string }> = (viewer, record) =>
  viewer !== null && viewer.id === record.authorId
