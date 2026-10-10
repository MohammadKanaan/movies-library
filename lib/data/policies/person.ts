import 'server-only'
import type { Policy } from '../policy'
import { isAdmin } from './rules'

export type PersonRecord = { id: string }

export const personPolicy = {
  update: isAdmin,
  delete: isAdmin,
} satisfies Policy<PersonRecord>
