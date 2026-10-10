'use client'

import clsx from 'clsx'
import { useId, useState } from 'react'
import { fillOf, StarGlyph, STARS } from '@/components/Reviews/StarRating'
import { RATING_STEP } from '@/lib/dto/reviews'
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

const stepLabel = (step: number) => `${step} ${step === 1 ? 'star' : 'stars'}`

/** The two radios of star `position`: its left half, then the whole star. */
const halvesOf = (position: number) => [position - RATING_STEP, position]

/**
 * Picks a rating from ½ to 5 stars. Each star holds two native radios, one per half, so the arrow
 * keys, focus and screen readers work without any script. Hovering previews a rating in a lighter
 * tint with the star under the pointer lifted; picking one pops its star.
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
  // The star that was just picked, until its pop animation ends.
  const [popped, setPopped] = useState<number | null>(null)
  const shown = hovered ?? value
  const previewing = hovered !== null && hovered !== value

  const pick = (step: number) => {
    setPopped(Math.ceil(step))
    onChange(step)
  }

  return (
    <div
      className={styles.group}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-invalid={invalid || undefined}
      data-previewing={previewing || undefined}
      onMouseLeave={() => setHovered(null)}
    >
      <div className={styles.stars}>
        {STARS.map((position) => (
          <span
            key={position}
            className={clsx(
              styles.star,
              hovered !== null && Math.ceil(hovered) === position && styles.lifted,
              popped === position && styles.popped,
            )}
            onAnimationEnd={() => setPopped(null)}
          >
            <StarGlyph fill={fillOf(shown, position)} />
            {halvesOf(position).map((step) => (
              <label
                key={step}
                className={clsx(styles.half, disabled && styles.disabled)}
                onMouseEnter={disabled ? undefined : () => setHovered(step)}
              >
                <input
                  className={styles.radio}
                  type="radio"
                  name={name}
                  value={step}
                  checked={value === step}
                  disabled={disabled}
                  onChange={() => pick(step)}
                  onBlur={onBlur}
                />
                <span className={styles.hidden}>{stepLabel(step)}</span>
              </label>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
