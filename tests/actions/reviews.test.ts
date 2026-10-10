// @vitest-environment node
import { refresh } from 'next/cache'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { createReviewAction, deleteReviewAction, updateReviewAction } from '@/actions/reviews'
import { db } from '@/lib/data/db'
import { getRedis } from '@/lib/server/redis'
import { seedMovie, seedReview } from '../helpers/catalog'
import { createUser, resetDatabase, signInAs } from '../helpers/server'

const { cookieStore, requestHeaders } = await vi.hoisted(async () => import('../helpers/cookies'))
vi.mock('next/headers', () => ({
  cookies: async () => cookieStore,
  headers: async () => requestHeaders(),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), refresh: vi.fn() }))

describe('review actions', () => {
  beforeEach(async () => {
    await resetDatabase()
    vi.mocked(refresh).mockClear()
  })
  afterAll(async () => {
    await getRedis().quit()
    await db.$disconnect()
  })

  it('answer 401 signed out and 403 for another user, without refreshing', async () => {
    const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
    const author = await createUser()
    const review = await seedReview({ movieId: movie.id, authorId: author.id, rating: 3 })
    expect(await createReviewAction({ movieId: movie.id, rating: 4 })).toMatchObject({
      ok: false,
      code: 'UNAUTHORIZED',
    })
    await signInAs(await createUser())
    expect(await updateReviewAction({ id: review.id, rating: 1 })).toMatchObject({
      ok: false,
      code: 'FORBIDDEN',
    })
    expect(await deleteReviewAction(review.id)).toMatchObject({ ok: false, code: 'FORBIDDEN' })
    expect(refresh).not.toHaveBeenCalled()
    expect(await db.review.count()).toBe(1)
  })

  it('return field errors as a failed result', async () => {
    const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
    await signInAs(await createUser())
    const result = await createReviewAction({ movieId: movie.id, rating: 3.3, spoiler: true })
    expect(result).toMatchObject({ ok: false, code: 'VALIDATION' })
    expect(!result.ok && Object.keys(result.fieldErrors ?? {}).sort()).toEqual([
      'rating',
      'spoiler',
    ])
    expect(refresh).not.toHaveBeenCalled()
  })

  it('create, update and delete a review, refreshing after each', async () => {
    const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
    await signInAs(await createUser())

    const created = await createReviewAction({ movieId: movie.id, rating: 4, body: 'Good.' })
    expect(created).toMatchObject({ ok: true, data: { rating: 4, body: 'Good.' } })
    expect(refresh).toHaveBeenCalledTimes(1)
    const id = created.ok ? created.data.id : ''

    const updated = await updateReviewAction({ id, rating: 5, body: 'Great.' })
    expect(updated).toMatchObject({ ok: true, data: { id, rating: 5, body: 'Great.' } })
    expect(refresh).toHaveBeenCalledTimes(2)

    expect(await deleteReviewAction(id)).toEqual({ ok: true, data: undefined })
    expect(refresh).toHaveBeenCalledTimes(3)
    expect(await db.review.count()).toBe(0)
  })
})
