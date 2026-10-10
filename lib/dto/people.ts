import { z } from 'zod'
import { catalogIdSchema, creditRoleSchema, personSummarySchema } from './catalog'
import { pageQuerySchema, permissionsSchema, searchTermSchema } from './common'
import { movieSummarySchema } from './movies'
import { uploadKeySchema } from './uploads'

export { personSummarySchema, type PersonSummary } from './catalog'

export const PERSON_NAME_MAX_LENGTH = 200
export const PERSON_BIO_MAX_LENGTH = 2000
export const PEOPLE_SEARCH_MAX_LENGTH = 100
/** The oldest birth date the catalog accepts; the earliest film-makers were born in the 1800s. */
export const PERSON_BIRTH_MIN = '1800-01-01'
const today = () => new Date().toISOString().slice(0, 10)

/** One row of the people list: the summary plus how many credits they hold and when they were added. */
export const personListItemSchema = personSummarySchema.extend({
  creditCount: z.number().int().nonnegative(),
  createdAt: z.coerce.date(),
})

export type PersonListItem = z.infer<typeof personListItemSchema>

/**
 * A movie as a person's filmography shows it: a `MovieSummary` (so a `MovieCard` can render it) plus
 * every role the person holds on it, in `credit_role` order.
 */
export const movieCreditSchema = movieSummarySchema.extend({
  roles: z.array(creditRoleSchema).min(1),
})

export type MovieCredit = z.infer<typeof movieCreditSchema>

/**
 * One person with their profile, their filmography (one entry per movie, newest release first) and
 * the viewer's permissions.
 */
export const personDetailSchema = personSummarySchema.extend({
  bio: z.string().nullable(),
  /** A calendar day, stored as midnight UTC like a release date. */
  birthDate: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  filmography: z.array(movieCreditSchema),
  permissions: permissionsSchema,
})

export type PersonDetail = z.infer<typeof personDetailSchema>

export const listPeopleQuery = pageQuerySchema.extend({
  /** Matches the name case-insensitively; at least three characters (the trigram index), bounded above. */
  q: searchTermSchema(PEOPLE_SEARCH_MAX_LENGTH).optional(),
})

export type ListPeopleQuery = z.infer<typeof listPeopleQuery>

/** The tolerant URL contract of the people list: any query string parses, falling back to defaults. */
export const peopleUrlQuery = z.object({
  page: pageQuerySchema.shape.page.catch(1),
  q: searchTermSchema(PEOPLE_SEARCH_MAX_LENGTH).catch(''),
})

/**
 * Create and update share this shape; the slug is derived from the name on create and never
 * changes. `bio` and `birthDate` are optional: left out, an update keeps the stored value (so a
 * rename sends the name alone), and `null` (or a blank bio) clears it.
 */
export const personInput = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(PERSON_NAME_MAX_LENGTH, `Name must be ${PERSON_NAME_MAX_LENGTH} characters or fewer`),
  bio: z
    .string()
    .trim()
    .max(PERSON_BIO_MAX_LENGTH, `Bio must be ${PERSON_BIO_MAX_LENGTH} characters or fewer`)
    .nullable()
    .transform((value) => value || null)
    .optional(),
  /** A calendar day, `YYYY-MM-DD`, not in the future; the DAL stores it in a `date` column. */
  birthDate: z.iso
    .date('Enter a birth date as YYYY-MM-DD')
    .refine((value) => value >= PERSON_BIRTH_MIN && value <= today(), {
      error: 'Enter a birth date between 1800 and today',
    })
    .nullable()
    .optional(),
})

/** What callers pass (optional profile fields); the DAL works on the parsed output. */
export type PersonInput = z.input<typeof personInput>

export const updatePersonInput = personInput.extend({ id: catalogIdSchema })

export type UpdatePersonInput = z.input<typeof updatePersonInput>

/** Makes an uploaded `headshot` object the person's headshot. */
export const attachHeadshotInput = z.object({
  id: catalogIdSchema,
  key: uploadKeySchema,
})

export type AttachHeadshotInput = z.infer<typeof attachHeadshotInput>
