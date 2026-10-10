'use client'

import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { updateCommentAction } from '@/actions/reviewComments'
import { ActionButton } from '@/components/ActionButton'
import { ActionGroup } from '@/components/ActionGroup'
import { CommentForm } from '@/components/Reviews/CommentForm'
import { DeleteCommentDialog } from '@/components/Reviews/DeleteCommentDialog'
import type { ReviewComment } from '@/lib/dto/reviewComments'
import styles from './styles.module.scss'

type CommentActionsProps = {
  comment: Pick<ReviewComment, 'id' | 'body' | 'permissions'>
  /** The server-rendered byline of `comment`; the actions sit at its end. */
  byline: ReactNode
  /** The server-rendered text of `comment`, shown until the author edits it. */
  children: ReactNode
}

/**
 * A comment's byline and text with what the viewer may do to it, as icons at the end of the
 * byline: the author edits it in place, the author or an admin deletes it (`comment.permissions`).
 */
export const CommentActions = ({ comment, byline, children }: CommentActionsProps) => {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <>
        {byline}
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
      </>
    )
  }

  return (
    <>
      <div className={styles.head}>
        {byline}
        <ActionGroup label="Comment actions">
          {comment.permissions.update ? (
            <ActionButton action="edit" label="Edit comment" onClick={() => setEditing(true)} />
          ) : null}
          {comment.permissions.delete ? <DeleteCommentDialog comment={{ id: comment.id }} /> : null}
        </ActionGroup>
      </div>
      {children}
    </>
  )
}
