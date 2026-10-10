import Link from 'next/link'
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
}

/**
 * One review: who wrote it, the stars, the date and the text. A review that spoils the movie keeps
 * its text inside a closed `<details>`, which needs no script. The author may edit it and the author
 * or an admin may delete it (`review.permissions`).
 */
export const ReviewCard = ({
  review,
  movieSlug,
  preview = false,
  editHref,
  deleteRedirect,
}: ReviewCardProps) => {
  const href = reviewPath(movieSlug, review.id)
  const isEdited = review.updatedAt > review.createdAt
  const body = review.body ? (
    <p className={preview ? `${styles.body} ${styles.clamped}` : styles.body}>{review.body}</p>
  ) : null

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <UserAvatar name={review.author.name} image={null} />
        <div className={styles.author}>
          <p className={styles.name}>{review.author.name}</p>
          <p className={styles.meta}>
            <Link href={href} className={styles.date}>
              <time dateTime={review.createdAt.toISOString()}>{formatDate(review.createdAt)}</time>
            </Link>
            {isEdited ? <span> · edited</span> : null}
          </p>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </header>

      {body && review.spoiler ? (
        <details className={styles.spoiler}>
          <summary className={styles.summary}>Contains spoilers: show</summary>
          {body}
        </details>
      ) : (
        body
      )}

      {(preview && review.body) || editHref || review.permissions.delete ? (
        <footer className={styles.actions}>
          {preview && review.body ? (
            <Link href={href} className={styles.more}>
              Read full review
            </Link>
          ) : null}
          {editHref && review.permissions.update ? (
            <ButtonLink href={editHref} variant="outline" size="sm">
              Edit
            </ButtonLink>
          ) : null}
          {review.permissions.delete ? (
            <DeleteReviewDialog review={{ id: review.id }} redirectTo={deleteRedirect} />
          ) : null}
        </footer>
      ) : null}
    </article>
  )
}
