import { z } from 'zod'
import { SLUG_MAX_LENGTH as SLUGIFY_MAX_LENGTH } from '@/lib/slug'

/** `slugify` output plus room for the `-2`, `-3` suffix the DAL adds on a collision. */
export const SLUG_MAX_LENGTH = SLUGIFY_MAX_LENGTH + 20

/**
 * A catalog slug as the DAL derives it (`lib/slug.ts`): lowercase words and digits joined by single
 * hyphens. Reads by slug treat anything else as not found; list filters refuse it.
 */
export const slugSchema = z
  .string()
  .trim()
  .min(1, 'Invalid slug')
  .max(SLUG_MAX_LENGTH, 'Invalid slug')
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Invalid slug')

/**
 * Slugs as a URL carries a list of them, comma-separated (`genres=drama,thriller`): split, blanks
 * dropped, duplicates removed, every entry a slug. The output is the array a typed caller passes.
 */
export const slugListParamSchema = z
  .string()
  .transform((value) =>
    value
      .split(',')
      .map((slug) => slug.trim())
      .filter((slug) => slug.length > 0),
  )
  .pipe(z.array(slugSchema))
  .transform((slugs) => [...new Set(slugs)])

/** A movie, genre or person id. Ids are UUID columns, so anything else is refused before PostgreSQL sees it. */
export const catalogIdSchema = z.uuid('Invalid id')

/** The `credit_role` enum of the database; the DAL maps Prisma's enum onto it by value. */
export const creditRoleSchema = z.enum(['DIRECTOR', 'WRITER', 'ACTOR'])

export type CreditRole = z.infer<typeof creditRoleSchema>
