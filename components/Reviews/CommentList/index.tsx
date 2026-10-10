import { CommentItem } from '@/components/Reviews/CommentItem'
import type { ReviewComment } from '@/lib/dto/reviewComments'
import styles from './styles.module.scss'

type CommentListProps = {
  comments: ReviewComment[]
}

/** A review's comments in the order they were written. */
export const CommentList = ({ comments }: CommentListProps) => {
  if (comments.length === 0) {
    return <p className={styles.empty}>No comments yet.</p>
  }

  return (
    <ul className={styles.list}>
      {comments.map((comment) => (
        <li key={comment.id}>
          <CommentItem comment={comment} />
        </li>
      ))}
    </ul>
  )
}
