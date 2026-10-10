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
  createComment,
  deleteComment,
  listComments,
  updateComment,
} from '@/lib/data/reviewComments'
import { getReview, listReviews } from '@/lib/data/reviews'
import { getRedis } from '@/lib/server/redis'
import { seedComment, seedMovie, seedReview } from '../../helpers/catalog'
import { createUser, resetDatabase, signInAs } from '../../helpers/server'

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

/** A movie with one review by someone else. */
const seedReviewed = async () => {
  const movie = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
  const reviewer = await createUser()
  const review = await seedReview({ movieId: movie.id, authorId: reviewer.id, rating: 4 })
  return { movie, reviewer, review }
}

describe('review comments DAL', () => {
  beforeEach(async () => {
    await resetDatabase()
  })
  afterAll(async () => {
    await getRedis().quit()
    await db.$disconnect()
  })

  describe('createComment', () => {
    it('is 401 signed out, before anything else', async () => {
      await expect(createComment({ reviewId: 'nope', body: '' })).rejects.toBeInstanceOf(
        UnauthorizedError,
      )
    })

    it('validates the input (422) before it looks for the review', async () => {
      await signInAsViewer()
      await expect(createComment({ reviewId: MISSING_ID, body: '   ' })).rejects.toMatchObject({
        code: 'VALIDATION',
        fieldErrors: { body: ['Write a comment'] },
      })
      await expect(createComment({ reviewId: 'nope', body: 'Hi' })).rejects.toBeInstanceOf(
        ValidationError,
      )
    })

    it('is 404 for a review that does not exist', async () => {
      await signInAsViewer()
      await expect(createComment({ reviewId: MISSING_ID, body: 'Hi' })).rejects.toBeInstanceOf(
        NotFoundError,
      )
    })

    it('returns the trimmed comment, its author and what the viewer may do', async () => {
      const { review } = await seedReviewed()
      const viewer = await signInAsViewer()
      const comment = await createComment({ reviewId: review.id, body: '  Agreed.  ' })
      expect(comment).toEqual({
        id: expect.any(String),
        reviewId: review.id,
        body: 'Agreed.',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        author: { id: viewer.id, name: viewer.name, username: viewer.username, image: null },
        permissions: { update: true, delete: true },
      })
      expect(comment.updatedAt).toEqual(comment.createdAt)
      expect(await db.reviewComment.findUnique({ where: { id: comment.id } })).toMatchObject({
        authorId: viewer.id,
        body: 'Agreed.',
      })
    })

    it('lets a user comment more than once, on their own review too', async () => {
      const { review, reviewer } = await seedReviewed()
      await signInAs(reviewer)
      await createComment({ reviewId: review.id, body: 'First.' })
      await createComment({ reviewId: review.id, body: 'Second.' })
      expect(await db.reviewComment.count()).toBe(2)
    })
  })

  describe('updateComment', () => {
    it('is 401 signed out, 422 for a bad id or text, and 404 for an unknown comment', async () => {
      const { review } = await seedReviewed()
      const author = await createUser()
      const comment = await seedComment({ reviewId: review.id, authorId: author.id })
      await expect(updateComment({ id: comment.id, body: 'Hi' })).rejects.toBeInstanceOf(
        UnauthorizedError,
      )
      await signInAs(author)
      await expect(updateComment({ id: 'nope', body: 'Hi' })).rejects.toBeInstanceOf(
        ValidationError,
      )
      await expect(updateComment({ id: comment.id, body: ' ' })).rejects.toBeInstanceOf(
        ValidationError,
      )
      await expect(updateComment({ id: MISSING_ID, body: 'Hi' })).rejects.toBeInstanceOf(
        NotFoundError,
      )
    })

    it('lets the author replace the text', async () => {
      const { review } = await seedReviewed()
      const author = await createUser()
      const comment = await seedComment({
        reviewId: review.id,
        authorId: author.id,
        body: 'Fine.',
      })
      await signInAs(author)
      const updated = await updateComment({ id: comment.id, body: 'Better on reflection.' })
      expect(updated).toMatchObject({
        id: comment.id,
        body: 'Better on reflection.',
        permissions: { update: true, delete: true },
      })
      expect(updated.updatedAt.getTime()).toBeGreaterThan(updated.createdAt.getTime())
    })

    it('writes nothing for the same text again, so the comment stays unedited', async () => {
      const { review } = await seedReviewed()
      const author = await createUser()
      const comment = await seedComment({
        reviewId: review.id,
        authorId: author.id,
        body: 'Fine.',
      })
      await signInAs(author)
      const same = await updateComment({ id: comment.id, body: '  Fine. ' })
      expect(same).toMatchObject({ id: comment.id, body: 'Fine.' })
      expect(same.updatedAt.getTime()).toBe(comment.updatedAt.getTime())
    })

    it('is 403 for anyone else, an admin and an editor included', async () => {
      const { review } = await seedReviewed()
      const comment = await seedComment({
        reviewId: review.id,
        authorId: (await createUser()).id,
        body: 'Fine.',
      })
      for (const role of ['viewer', 'editor', 'admin'] as const) {
        await signInAs(await createUser({ role }))
        await expect(updateComment({ id: comment.id, body: 'Mine' })).rejects.toBeInstanceOf(
          ForbiddenError,
        )
      }
      expect(await db.reviewComment.findUnique({ where: { id: comment.id } })).toMatchObject({
        body: 'Fine.',
      })
    })
  })

  describe('deleteComment', () => {
    it('is 401 signed out, 422 for a bad id and 404 for an unknown comment', async () => {
      await expect(deleteComment(MISSING_ID)).rejects.toBeInstanceOf(UnauthorizedError)
      await signInAsViewer()
      await expect(deleteComment('nope')).rejects.toBeInstanceOf(ValidationError)
      await expect(deleteComment(MISSING_ID)).rejects.toBeInstanceOf(NotFoundError)
    })

    it('lets the author and an admin delete, and nobody else', async () => {
      const { review } = await seedReviewed()
      const author = await createUser()
      const comment = await seedComment({ reviewId: review.id, authorId: author.id })

      await signInAs(await createUser({ role: 'editor' }))
      await expect(deleteComment(comment.id)).rejects.toBeInstanceOf(ForbiddenError)
      await signInAsViewer()
      await expect(deleteComment(comment.id)).rejects.toBeInstanceOf(ForbiddenError)
      expect(await db.reviewComment.count()).toBe(1)

      await signInAs(await createUser({ role: 'admin' }))
      await expect(deleteComment(comment.id)).resolves.toBeUndefined()
      expect(await db.reviewComment.count()).toBe(0)

      const own = await seedComment({ reviewId: review.id, authorId: author.id })
      await signInAs(author)
      await deleteComment(own.id)
      expect(await db.reviewComment.count()).toBe(0)
    })
  })

  describe('listComments', () => {
    it('is public, 422 for a bad review id and 404 for an unknown review', async () => {
      await expect(listComments({ reviewId: 'nope' })).rejects.toBeInstanceOf(ValidationError)
      await expect(listComments({ reviewId: MISSING_ID })).rejects.toBeInstanceOf(NotFoundError)
      const { review } = await seedReviewed()
      await expect(listComments({ reviewId: review.id })).resolves.toMatchObject({
        items: [],
        totalItems: 0,
        totalPages: 1,
      })
    })

    it('lists one review’s comments oldest first and pages them', async () => {
      const { movie, review } = await seedReviewed()
      const otherReview = await seedReview({
        movieId: movie.id,
        authorId: (await createUser()).id,
        rating: 2,
      })
      const authors = await Promise.all([createUser(), createUser(), createUser()])
      const [first, second, third] = await Promise.all(
        authors.map((author, index) =>
          seedComment({
            reviewId: review.id,
            authorId: author.id,
            body: `Comment ${index + 1}`,
            createdAt: new Date(Date.UTC(2026, 0, index + 1)),
          }),
        ),
      )
      await seedComment({ reviewId: otherReview.id, authorId: authors[0].id })

      const page = await listComments({ reviewId: review.id, perPage: 2 })
      expect(page).toMatchObject({ page: 1, perPage: 2, totalItems: 3, totalPages: 2 })
      expect(page.items.map((comment) => comment.id)).toEqual([first.id, second.id])
      expect(page.items[0]).toMatchObject({ body: 'Comment 1', reviewId: review.id })

      const next = await listComments({ reviewId: review.id, perPage: 2, page: 2 })
      expect(next.items.map((comment) => comment.id)).toEqual([third.id])
    })

    it('computes permissions for each viewer', async () => {
      const { review } = await seedReviewed()
      const author = await createUser()
      await seedComment({ reviewId: review.id, authorId: author.id })
      const permissionsOf = async () =>
        (await listComments({ reviewId: review.id })).items[0].permissions

      expect(await permissionsOf()).toEqual({ update: false, delete: false })
      await signInAsViewer()
      expect(await permissionsOf()).toEqual({ update: false, delete: false })
      await signInAs(author)
      expect(await permissionsOf()).toEqual({ update: true, delete: true })
      await signInAs(await createUser({ role: 'admin' }))
      expect(await permissionsOf()).toEqual({ update: false, delete: true })
    })
  })

  describe('commentCount on reviews', () => {
    it('counts a review’s comments in lists and on its page, and follows creates and deletes', async () => {
      const { movie, review } = await seedReviewed()
      const quiet = await seedReview({
        movieId: movie.id,
        authorId: (await createUser()).id,
        rating: 1,
      })
      expect((await getReview(review.id)).commentCount).toBe(0)

      await signInAsViewer()
      const comment = await createComment({ reviewId: review.id, body: 'One.' })
      await createComment({ reviewId: review.id, body: 'Two.' })
      expect((await getReview(review.id)).commentCount).toBe(2)
      const counts = Object.fromEntries(
        (await listReviews({ movieSlug: movie.slug })).items.map((item) => [
          item.id,
          item.commentCount,
        ]),
      )
      expect(counts).toEqual({ [review.id]: 2, [quiet.id]: 0 })

      await deleteComment(comment.id)
      expect((await getReview(review.id)).commentCount).toBe(1)
    })
  })

  describe('cascades', () => {
    it('removes a review’s comments with the review', async () => {
      const { review } = await seedReviewed()
      await seedComment({ reviewId: review.id, authorId: (await createUser()).id })
      await db.review.delete({ where: { id: review.id } })
      expect(await db.reviewComment.count()).toBe(0)
    })

    it('removes them with the movie too', async () => {
      const { movie, review } = await seedReviewed()
      await seedComment({ reviewId: review.id, authorId: (await createUser()).id })
      await db.movie.delete({ where: { id: movie.id } })
      expect(await db.reviewComment.count()).toBe(0)
    })

    it('removes a user’s comments with the user, leaving the review', async () => {
      const { review } = await seedReviewed()
      const author = await createUser()
      await seedComment({ reviewId: review.id, authorId: author.id })
      await db.user.delete({ where: { id: author.id } })
      expect(await db.reviewComment.count()).toBe(0)
      expect(await db.review.count()).toBe(1)
    })
  })

  describe('constraints', () => {
    it('refuse a blank body', async () => {
      const { review } = await seedReviewed()
      const author = await createUser()
      await expect(
        db.reviewComment.create({ data: { reviewId: review.id, authorId: author.id, body: '  ' } }),
      ).rejects.toThrow()
      expect(await db.reviewComment.count()).toBe(0)
    })
  })
})
