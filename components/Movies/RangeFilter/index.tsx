'use client'

import { useId } from 'react'
import { Slider } from '@/components/SCN/slider'
import styles from './styles.module.scss'

/** A filter's bounds; null is no bound on that side. */
export type Range = { from: number | null; to: number | null }

type RangeFilterProps = {
  label: string
  /** The slider's ends. A thumb at an end means "no bound" there, so it adds no filter. */
  min: number
  max: number
  step: number
  /** What Page Up / Page Down and Shift + arrow move by. */
  largeStep: number
  value: Range
  onChange: (value: Range) => void
  /** The range written out for the eye, e.g. "1990–1999" or "Any length". */
  readout: string
  /** The slider's end labels, e.g. "1888" and "2026", or "0 min" and "4h+". */
  minLabel: string
  maxLabel: string
  disabled?: boolean
}

/**
 * A two-thumb slider over a numeric filter (release year, runtime), with its range written out above
 * it. A bound outside the slider, from the URL, stays as it is until its thumb is moved.
 */
export const RangeFilter = ({
  label,
  min,
  max,
  step,
  largeStep,
  value,
  onChange,
  readout,
  minLabel,
  maxLabel,
  disabled,
}: RangeFilterProps) => {
  const labelId = useId()
  const start = Math.min(Math.max(value.from ?? min, min), max)
  const end = Math.max(Math.min(value.to ?? max, max), min)

  const handleChange = (next: number | readonly number[]) => {
    if (typeof next === 'number') {
      return
    }
    const [from = min, to = max] = next
    onChange({
      from: from > min ? from : value.from !== null && value.from < min ? value.from : null,
      to: to < max ? to : value.to !== null && value.to > max ? value.to : null,
    })
  }

  return (
    <div className={styles.field}>
      <div className={styles.head}>
        <span id={labelId} className={styles.label}>
          {label}
        </span>
        {/* Each thumb announces its own value; this sums them up for the eye. */}
        <span className={styles.readout} aria-hidden="true">
          {readout}
        </span>
      </div>
      <Slider
        value={[start, end]}
        min={min}
        max={max}
        step={step}
        largeStep={largeStep}
        minStepsBetweenValues={1}
        onValueChange={handleChange}
        disabled={disabled}
        aria-labelledby={labelId}
      />
      <div className={styles.ends} aria-hidden="true">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}
