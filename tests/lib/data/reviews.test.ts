// @vitest-environment node
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '@/lib/data/db'
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '@/lib/data/errors'
import {
  createReview,
  deleteReview,
  getReview,
  getReviewSummary,
  getViewerReview,
  listReviews,
  updateReview,
} from '@/lib/data/reviews'
import { getRedis } from '@/lib/server/redis'
import { seedMovie, seedReview } from '../../helpers/catalog'
import { createUser, resetDatabase, signInAs, signOut } from '../../helpers/server'

const { cookieStore, requestHeaders } = await vi.hoisted(
  async () => import('../../helpers/cookies'),
)
vi.mock('next/headers', () => ({
  cookies: async () => cookieStore,
  headers: async () => requestHeaders(),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), refresh: vi.fn() }))

const MISSING_ID = '0190d1a2-0000-7000-8000-00000000ffff'

const signInAsViewer = async () => {
  const viewer = await createUser({ role: 'viewer' })
  await signInAs(viewer)
  return viewer
}

describe('reviews DAL', () => {
  beforeEach(async () => {
    await resetDatabase()
  })
  afterAll(async () => {
    await getRedis().quit()
    await db.$disconnect()
  })

  describe('createReview', () => {
    it('is 401 signed out, before anything else', async () => {
      await expect(createReview({ movieId: 'nope', rating: 99 })).rejects.toBeInstanceOf(
        UnauthorizedError,
      )
    })

    it('validates the input (422) before it looks for the movie', async () => {
      await signInAsViewer()
      await expect(createReview({ movieId: MISSING_ID, rating: 3.3 })).rejects.toMatchObject({
        code: 'VALIDATION',
        fieldErrors: { rating: ['Pick a rating from ½ to 5 stars'] },
      })
      await expect(
        createReview({ movieId: MISSING_ID, rating: 3, spoiler: true }),
      ).rejects.toMatchObject({ fieldErrors: { spoiler: expect.any(Array) } })
      await expect(createReview({ movieId: 'nope', rating: 3 })).rejects.toBeInstanceOf(
        ValidationError,
      )
    })

    it('is 404 for a movie that does not exist', async () => {
      await signInAsViewer()
      await expect(createReview({ movieId: MISSING_ID, rating: 3 })).rejects.toBeInstanceOf(
        NotFoundError,
      )
    })

    it('stores half stars and returns stars, the author and what the viewer may do', async () => {
      const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      const viewer = await signInAsViewer()
      const review = await createReview({ movieId: movie.id, rating: 4.5, body: '  Stunning.  ' })
      expect(review).toEqual({
        id: expect.any(String),
        movieId: movie.id,
        rating: 4.5,
        body: 'Stunning.',
        spoiler: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        commentCount: 0,
        author: { id: viewer.id, name: viewer.name, username: viewer.username },
        permissions: { update: true, delete: true },
      })
      expect(review.updatedAt).toEqual(review.createdAt)
      expect(await db.review.findUnique({ where: { id: review.id } })).toMatchObject({
        halfStars: 9,
        authorId: viewer.id,
      })
    })

    it('takes a rating alone, and a spoiler with text', async () => {
      const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      await signInAsViewer()
      const plain = await createReview({ movieId: movie.id, rating: 0.5 })
      expect(plain).toMatchObject({ rating: 0.5, body: null, spoiler: false })

      await signInAsViewer()
      const spoiler = await createReview({
        movieId: movie.id,
        rating: 5,
        body: 'The ending!',
        spoiler: true,
      })
      expect(spoiler).toMatchObject({ rating: 5, body: 'The ending!', spoiler: true })
    })

    it('allows one review per user per movie', async () => {
      const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      const other = await seedMovie({ title: 'Arrival', releaseDate: '2016-11-11' })
      await signInAsViewer()
      await createReview({ movieId: movie.id, rating: 4 })
      await expect(createReview({ movieId: movie.id, rating: 2 })).rejects.toMatchObject({
        code: 'VALIDATION',
        fieldErrors: { base: ['You have already reviewed this movie'] },
      })
      await expect(createReview({ movieId: other.id, rating: 2 })).resolves.toBeDefined()
      expect(await db.review.count()).toBe(2)
    })
  })

  describe('updateReview', () => {
    it('is 401 signed out, 422 for a bad id or rating, and 404 for an unknown review', async () => {
      const author = await createUser()
      const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      const review = await seedReview({ movieId: movie.id, authorId: author.id, rating: 3 })
      await expect(updateReview({ id: review.id, rating: 4 })).rejects.toBeInstanceOf(
        UnauthorizedError,
      )
      await signInAs(author)
      await expect(updateReview({ id: 'nope', rating: 4 })).rejects.toBeInstanceOf(ValidationError)
      await expect(updateReview({ id: review.id, rating: 9 })).rejects.toBeInstanceOf(
        ValidationError,
      )
      await expect(updateReview({ id: MISSING_ID, rating: 4 })).rejects.toBeInstanceOf(
        NotFoundError,
      )
    })

    it('lets the author replace the rating, text and flag', async () => {
      const author = await createUser()
      const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      const review = await seedReview({
        movieId: movie.id,
        authorId: author.id,
        rating: 3,
        body: 'Fine.',
      })
      await signInAs(author)
      const updated = await updateReview({
        id: review.id,
        rating: 4.5,
        body: 'Better on a second watch.',
        spoiler: true,
      })
      expect(updated).toMatchObject({
        id: review.id,
        rating: 4.5,
        body: 'Better on a second watch.',
        spoiler: true,
        permissions: { update: true, delete: true },
      })
      expect(updated.updatedAt.getTime()).toBeGreaterThan(updated.createdAt.getTime())

      const cleared = await updateReview({ id: review.id, rating: 4.5 })
      expect(cleared).toMatchObject({ body: null, spoiler: false })
    })

    it('is 403 for anyone else, an admin and an editor included', async () => {
      const author = await createUser()
      const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      const review = await seedReview({
        movieId: movie.id,
        authorId: author.id,
        rating: 3,
        body: 'Fine.',
      })
      for (const role of ['viewer', 'editor', 'admin'] as const) {
        await signInAs(await createUser({ role }))
        await expect(updateReview({ id: review.id, rating: 1 })).rejects.toBeInstanceOf(
          ForbiddenError,
        )
      }
      expect(await db.review.findUnique({ where: { id: review.id } })).toMatchObject({
        halfStars: 6,
        body: 'Fine.',
      })
    })
  })

  describe('deleteReview', () => {
    it('is 401 signed out, 422 for a bad id and 404 for an unknown review', async () => {
      await expect(deleteReview(MISSING_ID)).rejects.toBeInstanceOf(UnauthorizedError)
      await signInAsViewer()
      await expect(deleteReview('nope')).rejects.toBeInstanceOf(ValidationError)
      await expect(deleteReview(MISSING_ID)).rejects.toBeInstanceOf(NotFoundError)
    })

    it('lets the author and an admin delete, and nobody else', async () => {
      const author = await createUser()
      const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      const review = await seedReview({ movieId: movie.id, authorId: author.id, rating: 3 })

      await signInAs(await createUser({ role: 'editor' }))
      await expect(deleteReview(review.id)).rejects.toBeInstanceOf(ForbiddenError)
      await signInAsViewer()
      await expect(deleteReview(review.id)).rejects.toBeInstanceOf(ForbiddenError)
      expect(await db.review.count()).toBe(1)

      await signInAs(await createUser({ role: 'admin' }))
      await expect(deleteReview(review.id)).resolves.toBeUndefined()
      expect(await db.review.count()).toBe(0)

      const own = await seedReview({ movieId: movie.id, authorId: author.id, rating: 5 })
      await signInAs(author)
      await deleteReview(own.id)
      expect(await db.review.count()).toBe(0)
    })
  })

  describe('listReviews', () => {
    it('is public, 422 for a bad movie id and 404 for an unknown movie', async () => {
      await expect(listReviews({ movieId: 'nope' })).rejects.toBeInstanceOf(ValidationError)
      await expect(listReviews({ movieId: MISSING_ID })).rejects.toBeInstanceOf(NotFoundError)
      const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      await expect(listReviews({ movieId: movie.id })).resolves.toMatchObject({
        items: [],
        totalItems: 0,
        totalPages: 1,
      })
    })

    it('lists one movie’s reviews newest first and pages them', async () => {
      const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      const other = await seedMovie({ title: 'Arrival', releaseDate: '2016-11-11' })
      const authors = await Promise.all([createUser(), createUser(), createUser()])
      const [first, second, third] = await Promise.all(
        authors.map((author, index) =>
          seedReview({
            movieId: movie.id,
            authorId: author.id,
            rating: index + 1,
            createdAt: new Date(Date.UTC(2026, 0, index + 1)),
          }),
        ),
      )
      await seedReview({ movieId: other.id, authorId: authors[0].id, rating: 5 })

      const page = await listReviews({ movieId: movie.id, perPage: 2 })
      expect(page).toMatchObject({ page: 1, perPage: 2, totalItems: 3, totalPages: 2 })
      expect(page.items.map((review) => review.id)).toEqual([third.id, second.id])
      expect(page.items[0]).toMatchObject({ rating: 3, movieId: movie.id })

      const next = await listReviews({ movieId: movie.id, perPage: 2, page: 2 })
      expect(next.items.map((review) => review.id)).toEqual([first.id])
    })

    it('computes permissions for each viewer', async () => {
      const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      const author = await createUser()
      await seedReview({ movieId: movie.id, authorId: author.id, rating: 4 })
      const permissionsOf = async () =>
        (await listReviews({ movieId: movie.id })).items[0].permissions

      expect(await permissionsOf()).toEqual({ update: false, delete: false })
      await signInAsViewer()
      expect(await permissionsOf()).toEqual({ update: false, delete: false })
      await signInAs(author)
      expect(await permissionsOf()).toEqual({ update: true, delete: true })
      await signInAs(await createUser({ role: 'admin' }))
      expect(await permissionsOf()).toEqual({ update: false, delete: true })
    })
  })

  describe('getViewerReview', () => {
    it('is null signed out, and for a viewer who has not reviewed', async () => {
      const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      expect(await getViewerReview(movie.id)).toBeNull()
      await signInAsViewer()
      expect(await getViewerReview(movie.id)).toBeNull()
    })

    it('is the viewer’s own review of that movie', async () => {
      const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      const other = await seedMovie({ title: 'Arrival', releaseDate: '2016-11-11' })
      const viewer = await createUser()
      const mine = await seedReview({ movieId: movie.id, authorId: viewer.id, rating: 2.5 })
      await seedReview({ movieId: other.id, authorId: viewer.id, rating: 5 })
      await signInAs(viewer)
      expect(await getViewerReview(movie.id)).toMatchObject({
        id: mine.id,
        rating: 2.5,
        permissions: { update: true, delete: true },
      })
    })

    it('is 404 for a malformed movie id', async () => {
      await expect(getViewerReview('nope')).rejects.toBeInstanceOf(NotFoundError)
    })
  })

  describe('getReview', () => {
    it('is public and returns the review with its movie', async () => {
      const movie = await seedMovie({
        title: 'Dune',
        releaseDate: '2021-10-22',
        posterUrl: 'https://pub.example/dune.jpg',
      })
      const author = await createUser()
      const review = await seedReview({
        movieId: movie.id,
        authorId: author.id,
        rating: 4,
        body: 'Big.',
      })
      expect(await getReview(review.id)).toMatchObject({
        id: review.id,
        rating: 4,
        body: 'Big.',
        author: { id: author.id },
        movie: {
          id: movie.id,
          slug: 'dune-2021',
          title: 'Dune',
          releaseDate: new Date('2021-10-22T00:00:00.000Z'),
          posterUrl: 'https://pub.example/dune.jpg',
        },
        permissions: { update: false, delete: false },
      })
    })

    it('is not found for a malformed or unknown id', async () => {
      await expect(getReview('nope')).rejects.toBeInstanceOf(NotFoundError)
      await expect(getReview(MISSING_ID)).rejects.toBeInstanceOf(NotFoundError)
    })
  })

  describe('getReviewSummary', () => {
    it('has no average until a movie is rated', async () => {
      const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      expect(await getReviewSummary(movie.id)).toEqual({ average: null, count: 0 })
    })

    it('is 404 for a malformed or unknown movie', async () => {
      await expect(getReviewSummary('nope')).rejects.toBeInstanceOf(NotFoundError)
      await expect(getReviewSummary(MISSING_ID)).rejects.toBeInstanceOf(NotFoundError)
    })

    it('averages in stars to one decimal and counts the ratings', async () => {
      const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      for (const rating of [5, 4, 3.5]) {
        await seedReview({ movieId: movie.id, authorId: (await createUser()).id, rating })
      }
      // 12.5 / 3 = 4.1666…
      expect(await getReviewSummary(movie.id)).toEqual({ average: 4.2, count: 3 })
    })

    it('is refreshed by a create, an update and a delete', async () => {
      const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      const other = await createUser()
      await seedReview({ movieId: movie.id, authorId: other.id, rating: 3 })
      expect(await getReviewSummary(movie.id)).toEqual({ average: 3, count: 1 })

      await signInAsViewer()
      const review = await createReview({ movieId: movie.id, rating: 5 })
      expect(await getReviewSummary(movie.id)).toEqual({ average: 4, count: 2 })

      await updateReview({ id: review.id, rating: 1 })
      expect(await getReviewSummary(movie.id)).toEqual({ average: 2, count: 2 })

      await deleteReview(review.id)
      expect(await getReviewSummary(movie.id)).toEqual({ average: 3, count: 1 })
    })

    it('is refreshed by an admin’s delete of another’s review', async () => {
      const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      const review = await seedReview({
        movieId: movie.id,
        authorId: (await createUser()).id,
        rating: 4,
      })
      expect(await getReviewSummary(movie.id)).toEqual({ average: 4, count: 1 })
      await signInAs(await createUser({ role: 'admin' }))
      await deleteReview(review.id)
      expect(await getReviewSummary(movie.id)).toEqual({ average: null, count: 0 })
    })
  })

  describe('cascades', () => {
    it('removes a movie’s reviews with the movie', async () => {
      const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      await seedReview({ movieId: movie.id, authorId: (await createUser()).id, rating: 4 })
      await db.movie.delete({ where: { id: movie.id } })
      expect(await db.review.count()).toBe(0)
    })

    it('removes a user’s reviews with the user', async () => {
      const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      const author = await createUser()
      await seedReview({ movieId: movie.id, authorId: author.id, rating: 4 })
      await db.user.delete({ where: { id: author.id } })
      expect(await db.review.count()).toBe(0)
      expect(await db.movie.count()).toBe(1)
    })
  })

  describe('constraints', () => {
    it('refuse a rating out of range and a spoiler without text', async () => {
      const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      const author = await createUser()
      const data = { movieId: movie.id, authorId: author.id }
      await expect(db.review.create({ data: { ...data, halfStars: 0 } })).rejects.toThrow()
      await expect(db.review.create({ data: { ...data, halfStars: 11 } })).rejects.toThrow()
      await expect(
        db.review.create({ data: { ...data, halfStars: 5, spoiler: true } }),
      ).rejects.toThrow()
      expect(await db.review.count()).toBe(0)
    })
  })

  it('reads as signed out after a sign-out', async () => {
    const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
    const viewer = await signInAsViewer()
    await seedReview({ movieId: movie.id, authorId: viewer.id, rating: 3 })
    expect(await getViewerReview(movie.id)).not.toBeNull()
    signOut()
    expect(await getViewerReview(movie.id)).toBeNull()
  })
})
