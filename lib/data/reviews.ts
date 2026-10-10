import 'server-only'
import type { Prisma } from '@/generated/prisma/client'
import { MINUTE } from '@/lib/constants-time'
import { slugSchema } from '@/lib/dto/catalog'
import { toPage, type Page } from '@/lib/dto/common'
import {
  listReviewsQuery,
  reviewIdSchema,
  reviewInput,
  updateReviewInput,
  type ListReviewsQuery,
  type RatingSummary,
  type Review,
  type ReviewDetail,
  type ReviewInput,
  type UpdateReviewInput,
} from '@/lib/dto/reviews'
import { invalidateTags } from '@/lib/server/cache'
import { getSessionUser, requireUser, type SessionUser } from './auth'
import { RATINGS_TAG } from './cacheTags'
import { db } from './db'
import { NotFoundError, parseInput, ValidationError } from './errors'
import { reviewPolicy, type ReviewRecord } from './policies/review'
import { authorize, permissionsFor } from './policy'
import { isUniqueViolation } from './prismaErrors'
import { consumeRateLimit } from './rateLimit'
import { userProfileSelect } from './users'

// Community content on the catalog: a signed-in user rates a movie from ½ to 5 stars, with optional
// text that can be marked as a spoiler. One review per user per movie. The database stores the
// rating as `halfStars` (1 to 10); everything outside this file speaks stars. Authors edit and delete
// their own review, an admin can delete any (`reviewPolicy`), nobody edits another's.
//
// A movie's rating is the aggregate of its reviews, kept on the movie row by the
// `reviews_sync_movie_rating` trigger (see its migration) so lists can sort and filter by it. Every
// write here invalidates `RATINGS_TAG`, which the cached reads that show a rating carry.

const PERMISSION_ACTIONS = ['update', 'delete'] as const
/** Reviews one user may write per minute. */
const REVIEW_LIMIT = { max: 10, windowMs: MINUTE * 1000 }

const reviewSelect = {
  id: true,
  movieId: true,
  halfStars: true,
  body: true,
  spoiler: true,
  createdAt: true,
  updatedAt: true,
  author: { select: userProfileSelect },
  _count: { select: { comments: true } },
} satisfies Prisma.ReviewSelect

const reviewDetailSelect = {
  ...reviewSelect,
  movie: {
    select: { id: true, slug: true, title: true, releaseDate: true, posterUrl: true },
  },
} satisfies Prisma.ReviewSelect

/** A movie's rating columns, for any select that shows its `RatingSummary`. */
export const movieRatingSelect = {
  ratingAverage: true,
  ratingCount: true,
} satisfies Prisma.MovieSelect

type MovieRatingRow = Prisma.MovieGetPayload<{ select: typeof movieRatingSelect }>

/** The columns as the DTO's `rating`: the trigger already rounds the average to one decimal. */
export const toRatingSummary = ({ ratingAverage, ratingCount }: MovieRatingRow): RatingSummary => ({
  average: ratingAverage,
  count: ratingCount,
})

type ReviewRow = Prisma.ReviewGetPayload<{ select: typeof reviewSelect }>
type ReviewDetailRow = Prisma.ReviewGetPayload<{ select: typeof reviewDetailSelect }>

/** The policy's record for a loaded review: the review's author. */
const recordOf = ({ author }: Pick<ReviewRow, 'author'>): ReviewRecord => ({
  authorId: author.id,
})

const toReview = (
  { halfStars, _count, ...row }: ReviewRow,
  viewer: SessionUser | null,
): Review => ({
  ...row,
  rating: halfStars / 2,
  commentCount: _count.comments,
  permissions: permissionsFor(reviewPolicy, PERMISSION_ACTIONS, viewer, recordOf(row)),
})

const toReviewDetail = (
  { movie, ...row }: ReviewDetailRow,
  viewer: SessionUser | null,
): ReviewDetail => ({ ...toReview(row, viewer), movie })

const assertMovieExists = async (movieId: string) => {
  const movie = await db.movie.findUnique({ where: { id: movieId }, select: { id: true } })
  if (!movie) {
    throw new NotFoundError('Movie not found')
  }
}

/**
 * The id of the movie with this slug. The reads take the slug a page has before it has read the
 * movie, so the reviews load alongside the movie instead of after it; a malformed slug is not
 * found, like an unknown one.
 */
const readMovieIdBySlug = async (movieSlug: string) => {
  const parsed = slugSchema.safeParse(movieSlug)
  if (!parsed.success) {
    throw new NotFoundError('Movie not found')
  }
  const movie = await db.movie.findUnique({ where: { slug: parsed.data }, select: { id: true } })
  if (!movie) {
    throw new NotFoundError('Movie not found')
  }
  return movie.id
}

/**
 * Public: a page of a movie's reviews, newest first (ids break ties). The movie must exist. Not
 * cached: `permissions` is per viewer and reviews are written often.
 */
export const listReviews = async (query: ListReviewsQuery): Promise<Page<Review>> => {
  const viewer = await getSessionUser()
  const { movieSlug, ...paging } = parseInput(listReviewsQuery, query)
  const movieId = await readMovieIdBySlug(movieSlug)
  const where = { movieId } satisfies Prisma.ReviewWhereInput
  const [rows, totalItems] = await Promise.all([
    db.review.findMany({
      where,
      select: reviewSelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: (paging.page - 1) * paging.perPage,
      take: paging.perPage,
    }),
    db.review.count({ where }),
  ])
  return toPage(
    rows.map((row) => toReview(row, viewer)),
    totalItems,
    paging,
  )
}

/**
 * The viewer's own review of a movie (by slug), or null: signed out, not reviewed yet, or no such
 * movie. A malformed slug is not found.
 */
export const getViewerReview = async (movieSlug: string): Promise<Review | null> => {
  const viewer = await getSessionUser()
  const parsed = slugSchema.safeParse(movieSlug)
  if (!parsed.success) {
    throw new NotFoundError('Movie not found')
  }
  if (!viewer) {
    return null
  }
  // One review per user per movie, so the first match is the only one.
  const row = await db.review.findFirst({
    where: { authorId: viewer.id, movie: { slug: parsed.data } },
    select: reviewSelect,
  })
  return row ? toReview(row, viewer) : null
}

/** Public: one review with its movie. A malformed or unknown id is not found. */
export const getReview = async (id: string): Promise<ReviewDetail> => {
  const viewer = await getSessionUser()
  const parsed = reviewIdSchema.safeParse(id)
  if (!parsed.success) {
    throw new NotFoundError('Review not found')
  }
  const row = await db.review.findUnique({
    where: { id: parsed.data },
    select: reviewDetailSelect,
  })
  if (!row) {
    throw new NotFoundError('Review not found')
  }
  return toReviewDetail(row, viewer)
}

/**
 * Signed in (401) → within the rate limit (429) → input valid (422) → the movie exists (404) →
 * created. A second review of the same movie is a validation error, not a 500.
 */
export const createReview = async (input: ReviewInput): Promise<Review> => {
  const viewer = await requireUser()
  await consumeRateLimit(`review:user:${viewer.id}`, REVIEW_LIMIT)
  const { movieId, rating, body, spoiler } = parseInput(reviewInput, input)
  await assertMovieExists(movieId)
  // Both columns get the same instant, so a review is "edited" only once it changes.
  const now = new Date()
  try {
    const row = await db.review.create({
      data: {
        movieId,
        authorId: viewer.id,
        halfStars: rating * 2,
        body,
        spoiler,
        createdAt: now,
        updatedAt: now,
      },
      select: reviewSelect,
    })
    await invalidateTags(RATINGS_TAG)
    return toReview(row, viewer)
  } catch (error) {
    if (isUniqueViolation(error, 'reviews_movie_id_author_id_key')) {
      throw new ValidationError(
        { base: ['You have already reviewed this movie'] },
        'You have already reviewed this movie',
      )
    }
    throw error
  }
}

/**
 * Signed in → input valid → exists (404) → the author (403) → the rating, text and flag replaced.
 * A resubmission that changes nothing writes nothing, so `updatedAt` (the "edited" marker) moves
 * only when the review did. Cached ratings are dropped only when the rating changed: an edit of
 * the text leaves them as they are.
 */
export const updateReview = async (input: UpdateReviewInput): Promise<Review> => {
  const viewer = await requireUser()
  const { id, rating, body, spoiler } = parseInput(updateReviewInput, input)
  const record = await db.review.findUnique({ where: { id }, select: reviewSelect })
  if (!record) {
    throw new NotFoundError('Review not found')
  }
  authorize(reviewPolicy.update, viewer, recordOf(record))
  const halfStars = rating * 2
  if (record.halfStars === halfStars && record.body === body && record.spoiler === spoiler) {
    return toReview(record, viewer)
  }
  const row = await db.review.update({
    where: { id },
    data: { halfStars, body, spoiler },
    select: reviewSelect,
  })
  if (row.halfStars !== record.halfStars) {
    await invalidateTags(RATINGS_TAG)
  }
  return toReview(row, viewer)
}

/** Signed in → id valid → exists (404) → the author or an admin (403) → deleted. */
export const deleteReview = async (id: string): Promise<void> => {
  const viewer = await requireUser()
  const reviewId = parseInput(reviewIdSchema, id)
  const record = await db.review.findUnique({
    where: { id: reviewId },
    select: { authorId: true },
  })
  if (!record) {
    throw new NotFoundError('Review not found')
  }
  authorize(reviewPolicy.delete, viewer, record)
  await db.review.delete({ where: { id: reviewId } })
  await invalidateTags(RATINGS_TAG)
}
