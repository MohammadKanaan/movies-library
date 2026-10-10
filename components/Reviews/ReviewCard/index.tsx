import Link from 'next/link'
import type { ReactNode } from 'react'
import { ButtonLink } from '@/components/ButtonLink'
import { DeleteReviewDialog } from '@/components/Reviews/DeleteReviewDialog'
import { StarRating } from '@/components/Reviews/StarRating'
import { UserAvatar } from '@/components/UserAvatar'
import { reviewPath } from '@/lib/constants-routes'
import type { Review } from '@/lib/dto/reviews'
import { formatDate } from '@/lib/formatDate'
import styles from './styles.module.scss'

type ReviewCardProps = {
  review: Review
  /** The movie's slug, for the link to the review's own page. */
  movieSlug: string
  /** In a list: the text is cut short, with a link to the whole review. */
  preview?: boolean
  /** Offers an Edit link to the author. */
  editHref?: string
  /** Where the page goes once the review is deleted. */
  deleteRedirect?: string
  /**
   * What belongs with the review's text, such as its comments. It sits inside the spoiler's
   * `<details>` when the review has one, so a reply cannot give the plot away. A card with children
   * is the review's own page: its actions come first, so they stay in reach while the text is
   * closed, and it has no links to itself.
   */
  children?: ReactNode
}

/**
 * One review: who wrote it, the stars, the date and the text. A review that spoils the movie keeps
 * its text inside a closed `<details>`, which needs no script. The author may edit it and the author
 * or an admin may delete it (`review.permissions`). Without children it links to the review's page,
 * with its number of comments.
 */
export const ReviewCard = ({
  review,
  movieSlug,
  preview = false,
  editHref,
  deleteRedirect,
  children,
}: ReviewCardProps) => {
  const href = reviewPath(movieSlug, review.id)
  const isEdited = review.updatedAt > review.createdAt
  const isPage = children !== undefined
  const body = review.body ? (
    <p className={preview ? `${styles.body} ${styles.clamped}` : styles.body}>{review.body}</p>
  ) : null
  const content = (
    <>
      {body}
      {children}
    </>
  )
  const canEdit = editHref !== undefined && review.permissions.update
  const date = <time dateTime={review.createdAt.toISOString()}>{formatDate(review.createdAt)}</time>
  const comments = `${review.commentCount} ${review.commentCount === 1 ? 'comment' : 'comments'}`
  const actions =
    isPage && !canEdit && !review.permissions.delete ? null : (
      <footer className={styles.actions}>
        {isPage ? null : (
          <span className={styles.links}>
            {preview && review.body ? (
              <Link href={href} className={styles.more}>
                Read full review
              </Link>
            ) : null}
            <Link href={`${href}#comments`} className={styles.more}>
              {comments}
            </Link>
          </span>
        )}
        {canEdit ? (
          <ButtonLink href={editHref} variant="outline" size="sm">
            Edit
          </ButtonLink>
        ) : null}
        {review.permissions.delete ? (
          <DeleteReviewDialog review={{ id: review.id }} redirectTo={deleteRedirect} />
        ) : null}
      </footer>
    )

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <UserAvatar name={review.author.name} image={null} />
        <div className={styles.author}>
          <p className={styles.name}>{review.author.name}</p>
          <p className={styles.meta}>
            {isPage ? (
              date
            ) : (
              <Link href={href} className={styles.date}>
                {date}
              </Link>
            )}
            {isEdited ? <span> · edited</span> : null}
          </p>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </header>

      {isPage ? actions : null}

      {review.spoiler && review.body ? (
        <details className={styles.spoiler}>
          <summary className={styles.summary}>Contains spoilers: show</summary>
          {content}
        </details>
      ) : (
        content
      )}

      {isPage ? null : actions}
    </article>
  )
}
