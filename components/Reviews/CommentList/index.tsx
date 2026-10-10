import Link from 'next/link'
import { CommentItem } from '@/components/Reviews/CommentItem'
import type { ReviewComment } from '@/lib/dto/reviewComments'
import styles from './styles.module.scss'

type CommentListProps = {
  comments: ReviewComment[]
  /** On a page past the end of the list, where its first page is. */
  firstPageHref?: string
}

/** A review's comments in the order they were written. */
export const CommentList = ({ comments, firstPageHref }: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <p className={styles.empty}>
        {firstPageHref ? (
          <>
            No comments on this page.{' '}
            <Link href={firstPageHref} className={styles.link}>
              Go to the first page
            </Link>
          </>
        ) : (
          'No comments yet.'
        )}
      </p>
    )
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
