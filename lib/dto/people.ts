import { z } from 'zod'
import { catalogIdSchema } from './catalog'
import { pageQuerySchema, permissionsSchema, searchTermSchema } from './common'

export const PERSON_NAME_MAX_LENGTH = 200
export const PEOPLE_SEARCH_MAX_LENGTH = 100

/** A person as a movie's credits show them. */
export const personSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
})

export type PersonSummary = z.infer<typeof personSummarySchema>

/** A movie as a person's filmography shows it. */
export const movieCreditSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  releaseDate: z.coerce.date(),
  posterUrl: z.string().nullable(),
})

export type MovieCredit = z.infer<typeof movieCreditSchema>

/** One person with their filmography by role (each list newest release first) and the viewer's permissions. */
export const personDetailSchema = personSummarySchema.extend({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  filmography: z.object({
    directed: z.array(movieCreditSchema),
    written: z.array(movieCreditSchema),
    acted: z.array(movieCreditSchema),
  }),
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

/** Create: the slug is derived from the name. Update: the name only, the slug is kept. */
export const personInput = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(PERSON_NAME_MAX_LENGTH, `Name must be ${PERSON_NAME_MAX_LENGTH} characters or fewer`),
})

export type PersonInput = z.infer<typeof personInput>

export const updatePersonInput = personInput.extend({ id: catalogIdSchema })

export type UpdatePersonInput = z.infer<typeof updatePersonInput>
