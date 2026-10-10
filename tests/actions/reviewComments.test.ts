// @vitest-environment node
import { refresh } from 'next/cache'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createCommentAction,
  deleteCommentAction,
  updateCommentAction,
} from '@/actions/reviewComments'
import { db } from '@/lib/data/db'
import { getRedis } from '@/lib/server/redis'
import { seedComment, seedMovie, seedReview } from '../helpers/catalog'
import { createUser, resetDatabase, signInAs } from '../helpers/server'

const { cookieStore, requestHeaders } = await vi.hoisted(async () => import('../helpers/cookies'))
vi.mock('next/headers', () => ({
  cookies: async () => cookieStore,
  headers: async () => requestHeaders(),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), refresh: vi.fn() }))

const seedReviewOfDune = async () => {
  const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
  return seedReview({ movieId: movie.id, authorId: (await createUser()).id, rating: 3 })
}

describe('review comment actions', () => {
  beforeEach(async () => {
    await resetDatabase()
    vi.mocked(refresh).mockClear()
  })
  afterAll(async () => {
    await getRedis().quit()
    await db.$disconnect()
  })

  it('answer 401 signed out and 403 for another user, without refreshing', async () => {
    const review = await seedReviewOfDune()
    const comment = await seedComment({
      reviewId: review.id,
      authorId: (await createUser()).id,
    })
    expect(await createCommentAction({ reviewId: review.id, body: 'Hi' })).toMatchObject({
      ok: false,
      code: 'UNAUTHORIZED',
    })
    await signInAs(await createUser())
    expect(await updateCommentAction({ id: comment.id, body: 'Mine now' })).toMatchObject({
      ok: false,
      code: 'FORBIDDEN',
    })
    expect(await deleteCommentAction(comment.id)).toMatchObject({ ok: false, code: 'FORBIDDEN' })
    expect(refresh).not.toHaveBeenCalled()
    expect(await db.reviewComment.count()).toBe(1)
  })

  it('return field errors as a failed result', async () => {
    const review = await seedReviewOfDune()
    await signInAs(await createUser())
    const result = await createCommentAction({ reviewId: review.id, body: '   ' })
    expect(result).toMatchObject({ ok: false, code: 'VALIDATION' })
    expect(!result.ok && Object.keys(result.fieldErrors ?? {})).toEqual(['body'])
    expect(refresh).not.toHaveBeenCalled()
  })

  it('answer 404 for a review that does not exist', async () => {
    await signInAs(await createUser())
    expect(
      await createCommentAction({
        reviewId: '0190d1a2-0000-7000-8000-00000000ffff',
        body: 'Hi',
      }),
    ).toMatchObject({ ok: false, code: 'NOT_FOUND' })
    expect(refresh).not.toHaveBeenCalled()
  })

  it('create, update and delete a comment, refreshing after each', async () => {
    const review = await seedReviewOfDune()
    await signInAs(await createUser())

    const created = await createCommentAction({ reviewId: review.id, body: 'Agreed.' })
    expect(created).toMatchObject({ ok: true, data: { reviewId: review.id, body: 'Agreed.' } })
    expect(refresh).toHaveBeenCalledTimes(1)
    const id = created.ok ? created.data.id : ''

    const updated = await updateCommentAction({ id, body: 'Mostly agreed.' })
    expect(updated).toMatchObject({ ok: true, data: { id, body: 'Mostly agreed.' } })
    expect(refresh).toHaveBeenCalledTimes(2)

    expect(await deleteCommentAction(id)).toEqual({ ok: true, data: undefined })
    expect(refresh).toHaveBeenCalledTimes(3)
    expect(await db.reviewComment.count()).toBe(0)
  })
})
