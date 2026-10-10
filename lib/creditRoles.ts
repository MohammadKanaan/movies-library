import { creditRoleSchema, type CreditRole } from '@/lib/dto/catalog'

const ROLE_LABELS: Record<CreditRole, string> = {
  DIRECTOR: 'Director',
  WRITER: 'Writer',
  ACTOR: 'Actor',
}

const ROLE_VERBS: Record<CreditRole, string> = {
  DIRECTOR: 'Directed',
  WRITER: 'Wrote',
  ACTOR: 'Acted in',
}

/** "Director", "Writer", "Actor": a role as a film's credits name it. */
export const creditRoleLabel = (role: CreditRole): string => ROLE_LABELS[role]

/**
 * How many films a person holds each role on, in `credit_role` order: "Directed 3 · Wrote 1 · Acted
 * in 1". A role never held is left out; no credits is an empty string.
 */
export const summarizeFilmography = (roleCounts: Record<CreditRole, number>): string => {
  return creditRoleSchema.options
    .filter((role) => roleCounts[role] > 0)
    .map((role) => `${ROLE_VERBS[role]} ${roleCounts[role]}`)
    .join(' · ')
}
