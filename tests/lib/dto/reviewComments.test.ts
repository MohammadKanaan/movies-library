import { describe, expect, it } from 'vitest'
import {
  COMMENT_BODY_MAX_LENGTH,
  commentFormInput,
  commentInput,
  commentsUrlQuery,
  listCommentsQuery,
  updateCommentInput,
} from '@/lib/dto/reviewComments'

const REVIEW_ID = '0190d1a2-0000-7000-8000-000000000002'
const COMMENT_ID = '0190d1a2-0000-7000-8000-000000000003'

describe('commentInput', () => {
  it('trims the body', () => {
    expect(commentInput.parse({ reviewId: REVIEW_ID, body: '  Agreed.  ' })).toEqual({
      reviewId: REVIEW_ID,
      body: 'Agreed.',
    })
  })

  it('needs text', () => {
    for (const body of ['', '   ', undefined]) {
      const result = commentInput.safeParse({ reviewId: REVIEW_ID, body })
      expect(result.success).toBe(false)
      expect(!result.success && result.error.issues[0].message).toBe('Write a comment')
    }
  })

  it('caps the length', () => {
    expect(
      commentInput.safeParse({ reviewId: REVIEW_ID, body: 'a'.repeat(COMMENT_BODY_MAX_LENGTH) })
        .success,
    ).toBe(true)
    expect(
      commentInput.safeParse({
        reviewId: REVIEW_ID,
        body: 'a'.repeat(COMMENT_BODY_MAX_LENGTH + 1),
      }).success,
    ).toBe(false)
  })

  it('needs a review id', () => {
    const result = commentInput.safeParse({ reviewId: 'nope', body: 'Hi' })
    expect(!result.success && result.error.issues[0].message).toBe('Invalid review id')
  })
})

describe('updateCommentInput', () => {
  it('takes a comment id and the new text', () => {
    expect(updateCommentInput.parse({ id: COMMENT_ID, body: ' Edited ' })).toEqual({
      id: COMMENT_ID,
      body: 'Edited',
    })
    const result = updateCommentInput.safeParse({ id: 'nope', body: 'Hi' })
    expect(!result.success && result.error.issues[0].message).toBe('Invalid comment id')
    expect(updateCommentInput.safeParse({ id: COMMENT_ID, body: '  ' }).success).toBe(false)
  })
})

describe('commentFormInput', () => {
  it('is the text alone', () => {
    expect(commentFormInput.parse({ body: ' Hi ' })).toEqual({ body: 'Hi' })
    expect(commentFormInput.safeParse({ body: '' }).success).toBe(false)
  })
})

describe('listCommentsQuery', () => {
  it('defaults the paging and needs a review id', () => {
    expect(listCommentsQuery.parse({ reviewId: REVIEW_ID })).toEqual({
      reviewId: REVIEW_ID,
      page: 1,
      perPage: 10,
    })
    expect(listCommentsQuery.safeParse({ reviewId: 'nope' }).success).toBe(false)
  })
})

describe('commentsUrlQuery', () => {
  it('parses any query string, falling back to the first page', () => {
    expect(commentsUrlQuery.parse({ page: '3' })).toEqual({ page: 3 })
    expect(commentsUrlQuery.parse({ page: 'garbage' })).toEqual({ page: 1 })
    expect(commentsUrlQuery.parse({})).toEqual({ page: 1 })
  })
})
