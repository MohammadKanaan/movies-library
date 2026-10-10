import 'server-only'
import { Prisma } from '@/generated/prisma/client'
import { MINUTE } from '@/lib/constants-time'
import { catalogIdSchema } from '@/lib/dto/catalog'
import { toPage, type Page } from '@/lib/dto/common'
import {
  listReviewsQuery,
  ratingSummarySchema,
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
import { invalidateTags, remember } from '@/lib/server/cache'
import { getSessionUser, requireUser, type SessionUser } from './auth'
import { reviewsTag } from './cacheTags'
import { db } from './db'
import { NotFoundError, parseInput, ValidationError } from './errors'
import { reviewPolicy, type ReviewRecord } from './policies/review'
import { authorize, permissionsFor } from './policy'
import { consumeRateLimit } from './rateLimit'
import { userProfileSelect } from './users'

// Community content on the catalog: a signed-in user rates a movie from ½ to 5 stars, with optional
// text that can be marked as a spoiler. One review per user per movie. The database stores the
// rating as `halfStars` (1 to 10); everything outside this file speaks stars. Authors edit and delete
// their own review, an admin can delete any (`reviewPolicy`), nobody edits another's.

const REVIEWS_CACHE_TTL = 5 * MINUTE
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

const isUniqueViolation = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'

const assertMovieExists = async (movieId: string) => {
  const movie = await db.movie.findUnique({ where: { id: movieId }, select: { id: true } })
  if (!movie) {
    throw new NotFoundError('Movie not found')
  }
}

/** A read by id treats a malformed id as not found, like an unknown one. */
const readMovieId = (movieId: string) => {
  const parsed = catalogIdSchema.safeParse(movieId)
  if (!parsed.success) {
    throw new NotFoundError('Movie not found')
  }
  return parsed.data
}

/**
 * Public: a page of a movie's reviews, newest first (ids break ties). The movie must exist. Not
 * cached: `permissions` is per viewer and reviews are written often.
 */
export const listReviews = async (query: ListReviewsQuery): Promise<Page<Review>> => {
  const viewer = await getSessionUser()
  const { movieId, ...paging } = parseInput(listReviewsQuery, query)
  await assertMovieExists(movieId)
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
 * Public: a movie's mean rating in stars (one decimal, null without ratings) and how many
 * reviews carry one. The same for every viewer, so it is cached under the movie's `reviewsTag`.
 */
export const getReviewSummary = async (movieId: string): Promise<RatingSummary> => {
  const id = readMovieId(movieId)
  return remember(
    `reviews:summary:${id}`,
    { ttl: REVIEWS_CACHE_TTL, tags: [reviewsTag(id)], schema: ratingSummarySchema },
    async () => {
      // An unknown movie throws, so only real movies get a cache key.
      await assertMovieExists(id)
      const { _avg, _count } = await db.review.aggregate({
        where: { movieId: id },
        _avg: { halfStars: true },
        _count: true,
      })
      return {
        average: _avg.halfStars === null ? null : Math.round((_avg.halfStars / 2) * 10) / 10,
        count: _count,
      }
    },
  )
}

/** The viewer's own review of a movie, or null: signed out, or not reviewed yet. */
export const getViewerReview = async (movieId: string): Promise<Review | null> => {
  const viewer = await getSessionUser()
  const id = readMovieId(movieId)
  if (!viewer) {
    return null
  }
  const row = await db.review.findUnique({
    where: { movieId_authorId: { movieId: id, authorId: viewer.id } },
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
    await invalidateTags(reviewsTag(movieId))
    return toReview(row, viewer)
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ValidationError(
        { base: ['You have already reviewed this movie'] },
        'You have already reviewed this movie',
      )
    }
    throw error
  }
}

/** Signed in → input valid → exists (404) → the author (403) → the rating, text and flag replaced. */
export const updateReview = async (input: UpdateReviewInput): Promise<Review> => {
  const viewer = await requireUser()
  const { id, rating, body, spoiler } = parseInput(updateReviewInput, input)
  const record = await db.review.findUnique({
    where: { id },
    select: { movieId: true, authorId: true },
  })
  if (!record) {
    throw new NotFoundError('Review not found')
  }
  authorize(reviewPolicy.update, viewer, record)
  const row = await db.review.update({
    where: { id },
    data: { halfStars: rating * 2, body, spoiler },
    select: reviewSelect,
  })
  await invalidateTags(reviewsTag(record.movieId))
  return toReview(row, viewer)
}

/** Signed in → id valid → exists (404) → the author or an admin (403) → deleted. */
export const deleteReview = async (id: string): Promise<void> => {
  const viewer = await requireUser()
  const reviewId = parseInput(reviewIdSchema, id)
  const record = await db.review.findUnique({
    where: { id: reviewId },
    select: { movieId: true, authorId: true },
  })
  if (!record) {
    throw new NotFoundError('Review not found')
  }
  authorize(reviewPolicy.delete, viewer, record)
  await db.review.delete({ where: { id: reviewId } })
  await invalidateTags(reviewsTag(record.movieId))
}
