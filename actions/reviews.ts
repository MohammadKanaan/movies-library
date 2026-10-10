'use server'

import { refresh } from 'next/cache'
import { toActionFailure } from '@/lib/data/errors'
import { createReview, deleteReview, updateReview } from '@/lib/data/reviews'
import type { Review, ReviewInput, UpdateReviewInput } from '@/lib/dto/reviews'
import type { ActionResult } from '@/types/api'

export const createReviewAction = async (input: ReviewInput): Promise<ActionResult<Review>> => {
  try {
    const review = await createReview(input)
    refresh()
    return { ok: true, data: review }
  } catch (error) {
    return toActionFailure(error)
  }
}

export const updateReviewAction = async (
  input: UpdateReviewInput,
): Promise<ActionResult<Review>> => {
  try {
    const review = await updateReview(input)
    refresh()
    return { ok: true, data: review }
  } catch (error) {
    return toActionFailure(error)
  }
}

export const deleteReviewAction = async (id: string): Promise<ActionResult<void>> => {
  try {
    await deleteReview(id)
    refresh()
    return { ok: true, data: undefined }
  } catch (error) {
    return toActionFailure(error)
  }
}
