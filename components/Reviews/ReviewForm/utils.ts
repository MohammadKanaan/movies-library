import type { ReviewFormInput } from '@/lib/dto/reviews'

export const REVIEW_FORM_FIELDS = ['rating', 'body', 'spoiler'] as const

/** What the form starts from: a new review has no rating yet (0, which the rating rule refuses). */
export const hydrateReviewForm = (
  review?: { rating: number; body: string | null; spoiler: boolean } | null,
): Required<ReviewFormInput> => {
  return {
    rating: review?.rating ?? 0,
    body: review?.body ?? '',
    spoiler: review?.spoiler ?? false,
  }
}
