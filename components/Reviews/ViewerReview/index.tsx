'use client'

import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { createReviewAction, updateReviewAction } from '@/actions/reviews'
import { ReviewForm } from '@/components/Reviews/ReviewForm'
import { Button } from '@/components/SCN/button'
import type { Review } from '@/lib/dto/reviews'
import styles from './styles.module.scss'

type ViewerReviewProps = {
  movieId: string
  /** The viewer's review of this movie, if they wrote one. */
  review: Review | null
  /** Opens `review` on its form straight away: the review page's Edit link (`editReviewPath`). */
  startEditing?: boolean
  /** The server-rendered card of `review`. */
  children?: ReactNode
}

/** The viewer's own review of a movie: the form to write it, or the review with an Edit button. */
export const ViewerReview = ({
  movieId,
  review,
  startEditing = false,
  children,
}: ViewerReviewProps) => {
  const [editing, setEditing] = useState(startEditing)

  if (review && !editing) {
    return (
      <div className={styles.stack}>
        <div className={styles.header}>
          <h3 className={styles.title}>Your review</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => setEditing(true)}>
            Edit
          </Button>
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className={styles.box}>
      <h3 className={styles.title}>{review ? 'Edit your review' : 'Rate this movie'}</h3>
      {review ? (
        <ReviewForm
          review={review}
          submitLabel="Save review"
          onCancel={() => setEditing(false)}
          onSubmit={async (values) => {
            const result = await updateReviewAction({ id: review.id, ...values })
            if (result.ok) {
              toast.success('Your review was updated')
              setEditing(false)
            }
            return result
          }}
        />
      ) : (
        <ReviewForm
          submitLabel="Post review"
          onSubmit={async (values) => {
            const result = await createReviewAction({ movieId, ...values })
            if (result.ok) {
              toast.success('Your review was posted')
            }
            return result
          }}
        />
      )}
    </div>
  )
}
