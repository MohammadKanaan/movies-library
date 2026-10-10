'use client'

import { useId } from 'react'
import { Checkbox } from '@/components/SCN/checkbox'
import { Label } from '@/components/SCN/label'
import type { Genre } from '@/lib/dto/genres'
import { MOVIE_GENRES_MAX } from '@/lib/dto/movies'
import styles from './styles.module.scss'

export type GenrePickerProps = {
  /** Every genre, in name order. */
  genres: Genre[]
  /** The selected genre ids. */
  value: string[]
  onChange: (ids: string[]) => void
  /** The group's error from the form. */
  error?: string
  disabled?: boolean
}

/** A checkbox per genre, capped at `MOVIE_GENRES_MAX`; reports the selection in genre order. */
export const GenrePicker = ({ genres, value, onChange, error, disabled }: GenrePickerProps) => {
  const baseId = useId()
  const errorId = `${baseId}-error`
  const atCap = value.length >= MOVIE_GENRES_MAX

  const toggle = (id: string, checked: boolean) => {
    const next = new Set(value)
    if (checked) {
      next.add(id)
    } else {
      next.delete(id)
    }
    onChange(genres.filter((genre) => next.has(genre.id)).map((genre) => genre.id))
  }

  return (
    <fieldset
      className={styles.fieldset}
      disabled={disabled}
      aria-describedby={error ? errorId : undefined}
    >
      <legend className={styles.legend}>Genres</legend>
      <p className={styles.hint}>Up to {MOVIE_GENRES_MAX}</p>
      <div className={styles.grid}>
        {genres.map((genre) => {
          const checked = value.includes(genre.id)
          const inputId = `${baseId}-${genre.id}`
          return (
            <div key={genre.id} className={styles.option}>
              <Checkbox
                id={inputId}
                checked={checked}
                disabled={disabled || (!checked && atCap)}
                onCheckedChange={(next) => toggle(genre.id, next)}
              />
              <Label htmlFor={inputId}>{genre.name}</Label>
            </div>
          )
        })}
      </div>
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}
