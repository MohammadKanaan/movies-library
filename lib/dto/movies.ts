import { z } from 'zod'
import { catalogIdSchema, creditRoleSchema, slugSchema } from './catalog'
import { pageQuerySchema, permissionsSchema, searchTermSchema } from './common'
import { genreSchema } from './genres'
import { personSummarySchema } from './people'
import { uploadKeySchema } from './uploads'
import { userProfileSchema } from './users'

export const MOVIE_TITLE_MAX_LENGTH = 200
export const MOVIE_SYNOPSIS_MAX_LENGTH = 5000
export const MOVIE_RUNTIME_MAX_MINUTES = 1000
export const MOVIE_GENRES_MAX = 10
export const MOVIE_CREDITS_MAX = 100
export const MOVIE_SEARCH_MAX_LENGTH = 100
/**
 * The first films date from the late 1880s, and the catalog holds released films only
 * (`docs/DECISIONS.md`, "Release date"), so a release date is never after today (UTC).
 */
export const MOVIE_RELEASE_MIN = '1888-01-01'
const today = () => new Date().toISOString().slice(0, 10)

/** One movie in a list. */
export const movieSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  releaseDate: z.coerce.date(),
  runtimeMinutes: z.number().int().nullable(),
  posterUrl: z.string().nullable(),
  genres: z.array(genreSchema),
})

export type MovieSummary = z.infer<typeof movieSummarySchema>

/** One movie with everything the catalog knows: credits grouped by role in billing order. */
export const movieDetailSchema = movieSummarySchema.extend({
  synopsis: z.string().nullable(),
  /** The admin who added it, or null once that account is gone. */
  createdBy: userProfileSchema.nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  credits: z.object({
    directors: z.array(personSummarySchema),
    writers: z.array(personSummarySchema),
    cast: z.array(personSummarySchema),
  }),
  permissions: permissionsSchema,
})

export type MovieDetail = z.infer<typeof movieDetailSchema>

/** `newest` and `oldest` order by release date, `title` alphabetically; `id` breaks every tie. */
export const MOVIE_SORTS = ['newest', 'oldest', 'title'] as const
export const movieSortSchema = z.enum(MOVIE_SORTS).default('newest')

export type MovieSort = z.output<typeof movieSortSchema>

export const listMoviesQuery = pageQuerySchema.extend({
  /** Matches the title case-insensitively; at least three characters (the trigram index), bounded above. */
  q: searchTermSchema(MOVIE_SEARCH_MAX_LENGTH).optional(),
  /** Only movies carrying this genre (by slug). */
  genre: slugSchema.optional(),
  /** Only movies this person is credited on (by slug). */
  person: slugSchema.optional(),
  sort: movieSortSchema,
})

export type ListMoviesQuery = z.input<typeof listMoviesQuery>

/** The tolerant URL contract of the movie list: any query string parses, falling back to defaults. */
export const moviesUrlQuery = z.object({
  page: pageQuerySchema.shape.page.catch(1),
  q: searchTermSchema(MOVIE_SEARCH_MAX_LENGTH).catch(''),
  genre: slugSchema.catch(''),
  person: slugSchema.catch(''),
  sort: movieSortSchema.catch('newest'),
})

export type MoviesUrlQuery = z.output<typeof moviesUrlQuery>

const hasDuplicate = <T>(values: T[], keyOf: (value: T) => string) => {
  const seen = new Set<string>()
  return values.some((value) => {
    const key = keyOf(value)
    if (seen.has(key)) {
      return true
    }
    seen.add(key)
    return false
  })
}

/** One credit as the editor lists it; the DAL numbers `position` from the order within each role. */
export const creditInputSchema = z.object({
  personId: catalogIdSchema,
  role: creditRoleSchema,
})

export type CreditInput = z.infer<typeof creditInputSchema>

/**
 * Create and update share this shape. The slug is derived from the title and release year on create
 * and never changes; the poster is set through an upload (`attachPosterInput`), not here. Genres and
 * credits replace the movie's current sets.
 */
export const movieInput = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(MOVIE_TITLE_MAX_LENGTH, `Title must be ${MOVIE_TITLE_MAX_LENGTH} characters or fewer`),
  synopsis: z
    .string()
    .trim()
    .max(
      MOVIE_SYNOPSIS_MAX_LENGTH,
      `Synopsis must be ${MOVIE_SYNOPSIS_MAX_LENGTH} characters or fewer`,
    )
    .nullish()
    .transform((value) => value || null),
  /** A calendar day, `YYYY-MM-DD`, not in the future; the DAL stores it in a `date` column. */
  releaseDate: z.iso
    .date('Enter a release date as YYYY-MM-DD')
    .refine((value) => value >= MOVIE_RELEASE_MIN && value <= today(), {
      error: 'Enter a release date between 1888 and today',
    }),
  runtimeMinutes: z
    .number()
    .int('Runtime must be whole minutes')
    .min(1, 'Runtime must be at least 1 minute')
    .max(MOVIE_RUNTIME_MAX_MINUTES, `Runtime must be ${MOVIE_RUNTIME_MAX_MINUTES} minutes or fewer`)
    .nullish()
    .transform((value) => value ?? null),
  genreIds: z
    .array(catalogIdSchema)
    .max(MOVIE_GENRES_MAX, `Pick ${MOVIE_GENRES_MAX} genres or fewer`)
    .refine((ids) => !hasDuplicate(ids, (id) => id), 'A genre is listed twice'),
  credits: z
    .array(creditInputSchema)
    .max(MOVIE_CREDITS_MAX, `List ${MOVIE_CREDITS_MAX} credits or fewer`)
    .refine(
      (credits) => !hasDuplicate(credits, (credit) => `${credit.personId}:${credit.role}`),
      'A person is credited twice in the same role',
    ),
})

/** What callers pass (optional synopsis and runtime); the DAL works on the parsed output. */
export type MovieInput = z.input<typeof movieInput>

export const updateMovieInput = movieInput.extend({ id: catalogIdSchema })

export type UpdateMovieInput = z.input<typeof updateMovieInput>

/** Makes an uploaded `poster` object the movie's poster. */
export const attachPosterInput = z.object({
  id: catalogIdSchema,
  key: uploadKeySchema,
})

export type AttachPosterInput = z.infer<typeof attachPosterInput>
