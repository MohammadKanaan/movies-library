import 'server-only'
import type { Policy } from '../policy'
import { isAdmin } from './rules'

export type GenreRecord = { id: string }

/** Genres are reference data: admins only. */
export const genrePolicy = {
  update: isAdmin,
  delete: isAdmin,
} satisfies Policy<GenreRecord>
