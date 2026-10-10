import { describe, expect, it } from 'vitest'
import {
  listReviewsQuery,
  RATING_MAX,
  RATING_MIN,
  ratingSchema,
  REVIEW_BODY_MAX_LENGTH,
  reviewInput,
  reviewsUrlQuery,
  updateReviewInput,
} from '@/lib/dto/reviews'

const MOVIE_ID = '0190d1a2-0000-7000-8000-000000000001'
const REVIEW_ID = '0190d1a2-0000-7000-8000-000000000002'

describe('ratingSchema', () => {
  it('accepts every half step from ½ to 5', () => {
    for (let halfStars = 1; halfStars <= 10; halfStars += 1) {
      expect(ratingSchema.safeParse(halfStars / 2).success).toBe(true)
    }
  })

  it('refuses anything else', () => {
    for (const value of [0, RATING_MIN - 0.5, RATING_MAX + 0.5, 3.3, 4.25, -1, Number.NaN]) {
      const result = ratingSchema.safeParse(value)
      expect(result.success).toBe(false)
      expect(!result.success && result.error.issues[0].message).toBe(
        'Pick a rating from ½ to 5 stars',
      )
    }
    expect(ratingSchema.safeParse('4').success).toBe(false)
  })
})

describe('reviewInput', () => {
  it('trims the body and leaves spoiler off by default', () => {
    expect(reviewInput.parse({ movieId: MOVIE_ID, rating: 4.5, body: '  Great.  ' })).toEqual({
      movieId: MOVIE_ID,
      rating: 4.5,
      body: 'Great.',
      spoiler: false,
    })
  })

  it('turns a missing or blank body into null', () => {
    expect(reviewInput.parse({ movieId: MOVIE_ID, rating: 3 }).body).toBeNull()
    expect(reviewInput.parse({ movieId: MOVIE_ID, rating: 3, body: '   ' }).body).toBeNull()
    expect(reviewInput.parse({ movieId: MOVIE_ID, rating: 3, body: null }).body).toBeNull()
  })

  it('caps the body', () => {
    const body = 'a'.repeat(REVIEW_BODY_MAX_LENGTH + 1)
    expect(reviewInput.safeParse({ movieId: MOVIE_ID, rating: 3, body }).success).toBe(false)
    expect(
      reviewInput.safeParse({ movieId: MOVIE_ID, rating: 3, body: body.slice(1) }).success,
    ).toBe(true)
  })

  it('requires a movie id that is a UUID', () => {
    expect(reviewInput.safeParse({ movieId: 'nope', rating: 3 }).success).toBe(false)
  })

  it('lets only a review with text contain spoilers', () => {
    const result = reviewInput.safeParse({ movieId: MOVIE_ID, rating: 3, spoiler: true })
    expect(result.success).toBe(false)
    expect(!result.success && result.error.issues[0]).toMatchObject({
      path: ['spoiler'],
      message: 'Only a review with text can contain spoilers',
    })
    // A body of spaces is no text.
    expect(
      reviewInput.safeParse({ movieId: MOVIE_ID, rating: 3, spoiler: true, body: '  ' }).success,
    ).toBe(false)
    expect(
      reviewInput.safeParse({ movieId: MOVIE_ID, rating: 3, spoiler: true, body: 'Vader!' })
        .success,
    ).toBe(true)
  })
})

describe('updateReviewInput', () => {
  it('has the same fields with a review id', () => {
    expect(
      updateReviewInput.parse({ id: REVIEW_ID, rating: 0.5, body: ' Meh ', spoiler: false }),
    ).toEqual({ id: REVIEW_ID, rating: 0.5, body: 'Meh', spoiler: false })
    expect(updateReviewInput.safeParse({ id: 'nope', rating: 3 }).success).toBe(false)
    expect(updateReviewInput.safeParse({ id: REVIEW_ID, rating: 3, spoiler: true }).success).toBe(
      false,
    )
  })
})

describe('listReviewsQuery', () => {
  it('pages one movie', () => {
    expect(listReviewsQuery.parse({ movieSlug: 'dune-2021' })).toEqual({
      movieSlug: 'dune-2021',
      page: 1,
      perPage: 10,
    })
    expect(listReviewsQuery.safeParse({}).success).toBe(false)
    expect(listReviewsQuery.safeParse({ movieSlug: 'Not A Slug' }).success).toBe(false)
  })
})

describe('reviewsUrlQuery', () => {
  it('falls back to the first page', () => {
    expect(reviewsUrlQuery.parse({})).toEqual({ page: 1 })
    expect(reviewsUrlQuery.parse({ page: 'garbage' })).toEqual({ page: 1 })
    expect(reviewsUrlQuery.parse({ page: '3' })).toEqual({ page: 3 })
  })
})
