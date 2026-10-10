import 'server-only'
import type { Rule } from '../policy'

/** The catalog is admin-written for now: one rule shared by every catalog policy. */
export const isAdmin: Rule<unknown> = (viewer) => viewer !== null && viewer.role === 'admin'
