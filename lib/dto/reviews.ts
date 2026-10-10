import { z } from 'zod'
import { catalogIdSchema } from './catalog'
import { pageQuerySchema, permissionsSchema } from './common'
import { userProfileSchema } from './users'

export const REVIEW_BODY_MAX_LENGTH = 10_000
export const RATING_MIN = 0.5
export const RATING_MAX = 5
export const RATING_STEP = 0.5

const RATING_MESSAGE = 'Pick a rating from ½ to 5 stars'

/** A rating in stars, in half steps from ½ to 5. The database stores it as `halfStars` (1 to 10). */
export const ratingSchema = z
  .number(RATING_MESSAGE)
  .min(RATING_MIN, RATING_MESSAGE)
  .max(RATING_MAX, RATING_MESSAGE)
  .multipleOf(RATING_STEP, RATING_MESSAGE)

export const reviewIdSchema = z.uuid('Invalid review id')

const reviewFields = {
  rating: ratingSchema,
  body: z
    .string()
    .trim()
    .max(REVIEW_BODY_MAX_LENGTH, `Review must be ${REVIEW_BODY_MAX_LENGTH} characters or fewer`)
    .nullish()
    .transform((value) => value || null),
  /** Only a review with text can hide spoilers; the form and the database both hold to it. */
  spoiler: z.boolean().default(false),
}

const hasTextForSpoiler = (review: { spoiler: boolean; body: string | null }) =>
  !review.spoiler || review.body !== null

const SPOILER_ISSUE = { path: ['spoiler'], error: 'Only a review with text can contain spoilers' }

/** The fields a review form edits; the movie or review id is added around it. */
export const reviewFormInput = z.object(reviewFields).refine(hasTextForSpoiler, SPOILER_ISSUE)

/** What the form holds (`body` and `spoiler` optional) and what it submits once parsed. */
export type ReviewFormInput = z.input<typeof reviewFormInput>
export type ReviewFormValues = z.output<typeof reviewFormInput>

/**
 * Writing a review: a rating, optional text and whether the text spoils the movie. The movie's id
 * is part of the input; the author is always the viewer.
 */
export const reviewInput = z
  .object({ ...reviewFields, movieId: catalogIdSchema })
  .refine(hasTextForSpoiler, SPOILER_ISSUE)

/** What callers pass (`body` and `spoiler` optional); the DAL works on the parsed output. */
export type ReviewInput = z.input<typeof reviewInput>

/** Editing a review replaces its rating, text and spoiler flag. */
export const updateReviewInput = z
  .object({ ...reviewFields, id: reviewIdSchema })
  .refine(hasTextForSpoiler, SPOILER_ISSUE)

export type UpdateReviewInput = z.input<typeof updateReviewInput>

/** One review as a list and the review page show it. `rating` is in stars. */
export const reviewSchema = z.object({
  id: z.string(),
  movieId: z.string(),
  rating: ratingSchema,
  body: z.string().nullable(),
  spoiler: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  author: userProfileSchema,
  permissions: permissionsSchema,
})

export type Review = z.infer<typeof reviewSchema>

/** A review with the movie it is about, for the review page's header. */
export const reviewDetailSchema = reviewSchema.extend({
  movie: z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    releaseDate: z.coerce.date(),
    posterUrl: z.string().nullable(),
  }),
})

export type ReviewDetail = z.infer<typeof reviewDetailSchema>

/** A movie's ratings: the mean in stars, rounded to one decimal (null without ratings), and how many. */
export const ratingSummarySchema = z.object({
  average: z.number().nullable(),
  count: z.number().int().nonnegative(),
})

export type RatingSummary = z.infer<typeof ratingSummarySchema>

export const listReviewsQuery = pageQuerySchema.extend({ movieId: catalogIdSchema })

export type ListReviewsQuery = z.input<typeof listReviewsQuery>

/** The tolerant URL contract of a movie's review list: any query string parses. */
export const reviewsUrlQuery = z.object({
  page: pageQuerySchema.shape.page.catch(1),
})
