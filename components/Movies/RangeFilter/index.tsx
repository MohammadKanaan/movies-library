'use client'

import { useId } from 'react'
import { Slider } from '@/components/SCN/slider'
import type { Thumbs } from '@/lib/filterRange'
import styles from './styles.module.scss'

type RangeFilterProps = {
  label: string
  min: number
  max: number
  step: number
  /** Both thumbs; one resting at an end of the track is an open end. */
  value: Thumbs
  /** What the current value means, shown beside the label (e.g. "1990–1999", "Any year"). */
  readout: string
  /** What the two ends of the track are called. */
  bounds: [string, string]
  /** Every step of a drag, so the readout follows the thumb. */
  onValueChange: (value: Thumbs) => void
  disabled?: boolean
}

const toThumbs = (value: number | readonly number[], fallback: Thumbs): Thumbs =>
  typeof value === 'number' ? fallback : [value[0] ?? fallback[0], value[1] ?? fallback[1]]

/**
 * The advanced search's range field: a dual-thumb slider with a live readout, for a release year
 * or a runtime. The two ends of the track are "no bound", so the URL only carries what was set. It
 * edits the filter panel's draft; the panel's Apply writes it.
 */
export const RangeFilter = ({
  label,
  min,
  max,
  step,
  value,
  readout,
  bounds,
  onValueChange,
  disabled,
}: RangeFilterProps) => {
  const labelId = useId()

  return (
    <div className={styles.field}>
      <div className={styles.head}>
        <span id={labelId} className={styles.label}>
          {label}
        </span>
        <output className={styles.readout}>{readout}</output>
      </div>
      <Slider
        aria-labelledby={labelId}
        min={min}
        max={max}
        step={step}
        minStepsBetweenValues={1}
        value={value}
        disabled={disabled}
        onValueChange={(next) => onValueChange(toThumbs(next, value))}
      />
      <div className={styles.bounds} aria-hidden="true">
        <span>{bounds[0]}</span>
        <span>{bounds[1]}</span>
      </div>
    </div>
  )
}
