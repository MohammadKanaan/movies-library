'use client'

import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { updateCommentAction } from '@/actions/reviewComments'
import { CommentForm } from '@/components/Reviews/CommentForm'
import { DeleteCommentDialog } from '@/components/Reviews/DeleteCommentDialog'
import { Button } from '@/components/SCN/button'
import type { ReviewComment } from '@/lib/dto/reviewComments'
import styles from './styles.module.scss'

type CommentActionsProps = {
  comment: Pick<ReviewComment, 'id' | 'body' | 'permissions'>
  /** The server-rendered text of `comment`, shown until the author edits it. */
  children: ReactNode
}

/**
 * A comment's text with what the viewer may do to it: the author edits it in place, the author or
 * an admin deletes it (`comment.permissions`).
 */
export const CommentActions = ({ comment, children }: CommentActionsProps) => {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <CommentForm
        comment={comment}
        submitLabel="Save comment"
        onCancel={() => setEditing(false)}
        onSubmit={async (values) => {
          const result = await updateCommentAction({ id: comment.id, ...values })
          if (result.ok) {
            toast.success('Your comment was updated')
            setEditing(false)
          }
          return result
        }}
      />
    )
  }

  return (
    <>
      {children}
      <div className={styles.actions}>
        {comment.permissions.update ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(true)}>
            Edit
          </Button>
        ) : null}
        {comment.permissions.delete ? <DeleteCommentDialog comment={{ id: comment.id }} /> : null}
      </div>
    </>
  )
}
