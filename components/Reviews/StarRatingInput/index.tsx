'use client'

import { useId, useState } from 'react'
import { StarRating } from '@/components/Reviews/StarRating'
import { RATING_MAX, RATING_STEP } from '@/lib/dto/reviews'
import styles from './styles.module.scss'

type StarRatingInputProps = {
  /** In stars, ½ to 5; 0 means nothing picked yet. */
  value: number
  onChange: (value: number) => void
  onBlur?: () => void
  disabled?: boolean
  invalid?: boolean
  'aria-label'?: string
  'aria-labelledby'?: string
}

const STEPS = Array.from(
  { length: RATING_MAX / RATING_STEP },
  (_, index) => (index + 1) * RATING_STEP,
)

const stepLabel = (step: number) => `${step} ${step === 1 ? 'star' : 'stars'}`

/**
 * Picks a rating from ½ to 5 stars. Ten native radios sit over the stars, one per half star, so the
 * arrow keys, focus and screen readers work without any script; hovering previews a rating.
 */
export const StarRatingInput = ({
  value,
  onChange,
  onBlur,
  disabled = false,
  invalid = false,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}: StarRatingInputProps) => {
  const name = useId()
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div
      className={styles.group}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-invalid={invalid || undefined}
      onMouseLeave={() => setHovered(null)}
    >
      <StarRating rating={hovered ?? value} size="lg" decorative />
      <div className={styles.halves}>
        {STEPS.map((step) => (
          <label
            key={step}
            className={disabled ? `${styles.half} ${styles.disabled}` : styles.half}
            onMouseEnter={() => setHovered(step)}
          >
            <input
              className={styles.radio}
              type="radio"
              name={name}
              value={step}
              checked={value === step}
              disabled={disabled}
              onChange={() => onChange(step)}
              onBlur={onBlur}
            />
            <span className={styles.hidden}>{stepLabel(step)}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
