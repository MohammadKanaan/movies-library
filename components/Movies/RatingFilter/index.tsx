'use client'

import { useId } from 'react'
import { StarRatingInput } from '@/components/Reviews/StarRatingInput'
import { Button } from '@/components/SCN/button'
import styles from './styles.module.scss'

type RatingFilterProps = {
  /** The lowest mean rating in stars, or null for any rating. */
  value: number | null
  onChange: (value: number | null) => void
  disabled?: boolean
}

/** A rating floor in words, for the readout and the filter's chip. */
export const ratingFloorLabel = (rating: number) =>
  `${rating} ${rating === 1 ? 'star' : 'stars'}${rating === 5 ? '' : ' & up'}`

/**
 * The advanced search's rating field: the lowest mean rating a movie needs, picked on the review
 * form's half stars. Clear lifts it; an unrated movie never passes a floor.
 */
export const RatingFilter = ({ value, onChange, disabled }: RatingFilterProps) => {
  const labelId = useId()

  return (
    <div className={styles.field}>
      <div className={styles.head}>
        <span id={labelId} className={styles.label}>
          Rating
        </span>
        <output className={styles.readout}>
          {value === null ? 'Any rating' : ratingFloorLabel(value)}
        </output>
      </div>
      <div className={styles.control}>
        <StarRatingInput
          value={value ?? 0}
          onChange={onChange}
          disabled={disabled}
          aria-labelledby={labelId}
        />
        {value === null ? null : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Clear the rating filter"
            disabled={disabled}
            onClick={() => onChange(null)}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
