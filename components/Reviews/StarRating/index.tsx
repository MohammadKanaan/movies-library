import { Star } from 'lucide-react'
import { RATING_MAX } from '@/lib/dto/reviews'
import styles from './styles.module.scss'

type StarRatingProps = {
  /** In stars, ½ to 5 in half steps; 0 shows five empty stars. */
  rating: number
  size?: 'sm' | 'md' | 'lg'
  /** Hides the rating from assistive tech, for when the rating is also written out beside it. */
  decorative?: boolean
}

const STARS = Array.from({ length: RATING_MAX }, (_, index) => index + 1)

/** How much of star number `position` (1 to 5) a rating fills. */
const fillOf = (rating: number, position: number) => {
  if (rating >= position) {
    return 'full'
  }
  return rating >= position - 0.5 ? 'half' : 'empty'
}

/** A read-only star rating with full, half and empty stars. */
export const StarRating = ({ rating, size = 'md', decorative = false }: StarRatingProps) => {
  return (
    <span
      className={`${styles.stars} ${styles[size]}`}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : `${rating} out of ${RATING_MAX} stars`}
      aria-hidden={decorative || undefined}
    >
      {STARS.map((position) => {
        const fill = fillOf(rating, position)
        return (
          <span key={position} className={`${styles.star} ${styles[fill]}`}>
            <Star className={styles.outline} aria-hidden="true" />
            {fill === 'empty' ? null : (
              <span className={styles.fill}>
                <Star className={styles.filled} aria-hidden="true" />
              </span>
            )}
          </span>
        )
      })}
    </span>
  )
}
