import { z } from 'zod'
import { catalogIdSchema, creditRoleSchema, slugListParamSchema, slugSchema } from './catalog'
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

/** A cast member in billing order; `star` marks the leads the movie's pages highlight. */
export const castMemberSchema = personSummarySchema.extend({ star: z.boolean() })

export type CastMember = z.infer<typeof castMemberSchema>

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
    cast: z.array(castMemberSchema),
  }),
  permissions: permissionsSchema,
})

export type MovieDetail = z.infer<typeof movieDetailSchema>

/**
 * `newest` and `oldest` order by release date, `title` alphabetically, `added` by when the catalog
 * gained the movie (latest first, the admin list's default); `id` breaks every tie.
 */
export const MOVIE_SORTS = ['newest', 'oldest', 'title', 'added'] as const
export const movieSortSchema = z.enum(MOVIE_SORTS).default('newest')

export type MovieSort = z.output<typeof movieSortSchema>

/** The year of `MOVIE_RELEASE_MIN`; a year filter runs from here to the current year. */
export const MOVIE_YEAR_MIN = Number(MOVIE_RELEASE_MIN.slice(0, 4))
const currentYear = () => new Date().getUTCFullYear()

/** A release year a filter can name (a query string carries it as text, so it is coerced). */
export const releaseYearSchema = z.coerce
  .number()
  .int('Enter a year')
  .refine((year) => year >= MOVIE_YEAR_MIN && year <= currentYear(), {
    error: `Enter a year between ${MOVIE_YEAR_MIN} and this year`,
  })

/** A runtime bound in minutes, within the range a movie's runtime can take. */
export const runtimeBoundSchema = z.coerce
  .number()
  .int('Enter whole minutes')
  .min(1, 'Enter at least 1 minute')
  .max(MOVIE_RUNTIME_MAX_MINUTES, `Enter ${MOVIE_RUNTIME_MAX_MINUTES} minutes or fewer`)

const genreFilterSchema = z
  .array(slugSchema)
  .max(MOVIE_GENRES_MAX, `Pick ${MOVIE_GENRES_MAX} genres or fewer`)

const isReversed = (from: number | undefined, to: number | undefined) =>
  from !== undefined && to !== undefined && from > to

/**
 * The movie list's query: a title search and the filters of the advanced search (every genre
 * named, a release year range, a runtime range, a credited person), paged and sorted. A range may
 * be open at either end; given both ends, the first must not be after the last. `listMoviesQuery`
 * is the typed form callers pass; `listMoviesUrlQuery` is the same shape as a URL carries it.
 */
const listMoviesBase = pageQuerySchema.extend({
  /** Matches the title case-insensitively; at least three characters (the trigram index), bounded above. */
  q: searchTermSchema(MOVIE_SEARCH_MAX_LENGTH).optional(),
  /** Only movies carrying every one of these genres (by slug). */
  genres: genreFilterSchema.optional(),
  /** Only movies this person is credited on (by slug). */
  person: slugSchema.optional(),
  /** Only movies released in or after this year. */
  yearFrom: releaseYearSchema.optional(),
  /** Only movies released in or before this year. */
  yearTo: releaseYearSchema.optional(),
  /** Only movies at least this long, in minutes. */
  runtimeMin: runtimeBoundSchema.optional(),
  /** Only movies at most this long, in minutes. */
  runtimeMax: runtimeBoundSchema.optional(),
  sort: movieSortSchema,
})

type ListMoviesOutput = z.output<typeof listMoviesBase>

/** The checks both wire forms of the list share; `.refine` keeps the schema's own output type. */
const withRangeChecks = <S extends z.ZodType>(schema: S): S =>
  schema
    .refine(
      (query) =>
        !isReversed((query as ListMoviesOutput).yearFrom, (query as ListMoviesOutput).yearTo),
      { path: ['yearTo'], error: 'The last year is before the first' },
    )
    .refine(
      (query) =>
        !isReversed((query as ListMoviesOutput).runtimeMin, (query as ListMoviesOutput).runtimeMax),
      { path: ['runtimeMax'], error: 'The longest runtime is shorter than the shortest' },
    )

/** The list's query as a typed caller passes it (`lib/data/movies.ts`). */
export const listMoviesQuery = withRangeChecks(listMoviesBase)

export type ListMoviesQuery = z.input<typeof listMoviesQuery>

/**
 * `listMoviesQuery` as a URL carries it: the one field whose wire type differs is `genres`, which a
 * query string carries comma-separated (`slugListParamSchema`) rather than as an array. Strict,
 * unlike the page's tolerant `moviesUrlQuery`, so `GET /api/v1/movies` answers bad parameters with
 * field errors.
 */
export const listMoviesUrlQuery = withRangeChecks(
  listMoviesBase
    .omit({ genres: true })
    .extend({ genres: slugListParamSchema.pipe(genreFilterSchema).optional() }),
)

export type ListMoviesUrlQuery = z.output<typeof listMoviesUrlQuery>

/**
 * The tolerant URL contract of the movie list: any query string parses, falling back to defaults.
 * Empty filters are `''`, `[]` or `null`, which `useUrlState` leaves out of the URL. The year and
 * runtime ranges are checked per end only: `toListMoviesQuery` puts a reversed range the right way
 * round, so a hand-edited URL still lists instead of failing.
 */
export const moviesUrlQuery = z.object({
  page: pageQuerySchema.shape.page.catch(1),
  q: searchTermSchema(MOVIE_SEARCH_MAX_LENGTH).catch(''),
  genres: slugListParamSchema.pipe(genreFilterSchema).catch([]),
  person: slugSchema.catch(''),
  yearFrom: releaseYearSchema.nullable().catch(null),
  yearTo: releaseYearSchema.nullable().catch(null),
  runtimeMin: runtimeBoundSchema.nullable().catch(null),
  runtimeMax: runtimeBoundSchema.nullable().catch(null),
  sort: movieSortSchema.catch('newest'),
})

export type MoviesUrlQuery = z.output<typeof moviesUrlQuery>

/** The filters of `moviesUrlQuery`, as opposed to its paging and sort. */
export const MOVIE_FILTER_KEYS = [
  'q',
  'genres',
  'person',
  'yearFrom',
  'yearTo',
  'runtimeMin',
  'runtimeMax',
] as const satisfies readonly (keyof MoviesUrlQuery)[]

export type MovieFilterKey = (typeof MOVIE_FILTER_KEYS)[number]

export type MovieFilters = Pick<MoviesUrlQuery, MovieFilterKey>

const isSet = (value: MoviesUrlQuery[MovieFilterKey]) =>
  Array.isArray(value) ? value.length > 0 : value !== '' && value !== null

/** Whether the URL narrows the list at all (paging and sort do not count). */
export const hasMovieFilters = (query: MovieFilters) =>
  MOVIE_FILTER_KEYS.some((key) => isSet(query[key]))

/** The filters of `query`, every one of them empty: what "clear all" writes to the URL. */
export const EMPTY_MOVIE_FILTERS: MovieFilters = {
  q: '',
  genres: [],
  person: '',
  yearFrom: null,
  yearTo: null,
  runtimeMin: null,
  runtimeMax: null,
}

const orderedRange = (from: number | null, to: number | null) =>
  from !== null && to !== null && from > to ? [to, from] : [from, to]

/**
 * The query a page passes to `listMovies` for a parsed URL: empty filters are left out, and a
 * reversed range is put the right way round. The caller adds `perPage`.
 */
export const toListMoviesQuery = ({
  page,
  q,
  genres,
  person,
  yearFrom,
  yearTo,
  runtimeMin,
  runtimeMax,
  sort,
}: MoviesUrlQuery): ListMoviesQuery => {
  const [firstYear, lastYear] = orderedRange(yearFrom, yearTo)
  const [shortest, longest] = orderedRange(runtimeMin, runtimeMax)
  return {
    page,
    sort,
    q: q || undefined,
    genres: genres.length > 0 ? genres : undefined,
    person: person || undefined,
    yearFrom: firstYear ?? undefined,
    yearTo: lastYear ?? undefined,
    runtimeMin: shortest ?? undefined,
    runtimeMax: longest ?? undefined,
  }
}

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

/**
 * One credit as the editor lists it; the DAL numbers `position` from the order within each role.
 * `star` marks a lead (cast only), and left out it is false.
 */
export const creditInputSchema = z.object({
  personId: catalogIdSchema,
  role: creditRoleSchema,
  star: z.boolean().default(false),
})

/** What callers pass (`star` optional). */
export type CreditInput = z.input<typeof creditInputSchema>

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
    )
    .refine(
      (credits) => credits.every((credit) => !credit.star || credit.role === 'ACTOR'),
      'Only cast members can be stars',
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
