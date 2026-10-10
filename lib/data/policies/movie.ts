import 'server-only'
import type { Policy } from '../policy'
import { isAdmin } from './rules'

/**
 * What a movie rule may look at. `createdById` is carried so an ownership rule (an editor edits
 * the movies they created) can be added here later without touching the DAL.
 */
export type MovieRecord = { createdById: string | null }

export const moviePolicy = {
  update: isAdmin,
  delete: isAdmin,
} satisfies Policy<MovieRecord>
