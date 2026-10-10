'use server'

import { refresh } from 'next/cache'
import { toActionFailure } from '@/lib/data/errors'
import { createComment, deleteComment, updateComment } from '@/lib/data/reviewComments'
import type { CommentInput, ReviewComment, UpdateCommentInput } from '@/lib/dto/reviewComments'
import type { ActionResult } from '@/types/api'

export const createCommentAction = async (
  input: CommentInput,
): Promise<ActionResult<ReviewComment>> => {
  try {
    const comment = await createComment(input)
    refresh()
    return { ok: true, data: comment }
  } catch (error) {
    return toActionFailure(error)
  }
}

export const updateCommentAction = async (
  input: UpdateCommentInput,
): Promise<ActionResult<ReviewComment>> => {
  try {
    const comment = await updateComment(input)
    refresh()
    return { ok: true, data: comment }
  } catch (error) {
    return toActionFailure(error)
  }
}

export const deleteCommentAction = async (id: string): Promise<ActionResult<void>> => {
  try {
    await deleteComment(id)
    refresh()
    return { ok: true, data: undefined }
  } catch (error) {
    return toActionFailure(error)
  }
}
