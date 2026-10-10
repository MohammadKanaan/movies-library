import { CommentActions } from '@/components/Reviews/CommentActions'
import { UserAvatar } from '@/components/UserAvatar'
import type { ReviewComment } from '@/lib/dto/reviewComments'
import { formatDate } from '@/lib/formatDate'
import styles from './styles.module.scss'

type CommentItemProps = {
  comment: ReviewComment
}

/** One comment: who wrote it, when, and the text. The author may edit it, the author or an admin delete it. */
export const CommentItem = ({ comment }: CommentItemProps) => {
  const isEdited = comment.updatedAt > comment.createdAt
  const body = <p className={styles.body}>{comment.body}</p>
  const byline = (
    <p className={styles.meta}>
      <span className={styles.name}>{comment.author.name}</span>
      <time dateTime={comment.createdAt.toISOString()}>{formatDate(comment.createdAt)}</time>
      {isEdited ? <span>edited</span> : null}
    </p>
  )

  return (
    <article className={styles.comment}>
      <UserAvatar name={comment.author.name} image={null} size="sm" />
      <div className={styles.main}>
        {comment.permissions.update || comment.permissions.delete ? (
          <CommentActions
            comment={{ id: comment.id, body: comment.body, permissions: comment.permissions }}
            byline={byline}
          >
            {body}
          </CommentActions>
        ) : (
          <>
            {byline}
            {body}
          </>
        )}
      </div>
    </article>
  )
}
