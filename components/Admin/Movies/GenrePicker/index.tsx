'use client'

import { useId } from 'react'
import { RemovableChip } from '@/components/Form/RemovableChip'
import {
  Combobox,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/SCN/combobox'
import { Label } from '@/components/SCN/label'
import type { Genre } from '@/lib/dto/genres'
import { MOVIE_GENRES_MAX } from '@/lib/dto/movies'
import styles from './styles.module.scss'

export type GenrePickerProps = {
  /** Every genre, in name order: the list is local, filtered as the editor types. */
  genres: Genre[]
  /** The selected genre ids. */
  value: string[]
  onChange: (ids: string[]) => void
  /** The field's error from the form. */
  error?: string
  disabled?: boolean
}

/**
 * The movie form's genres: a multi-select combobox over every genre, each pick a removable chip,
 * capped at `MOVIE_GENRES_MAX`. The whole list shows on focus and typing narrows it; the selection
 * is reported in genre order, whatever the click order.
 */
export const GenrePicker = ({ genres, value, onChange, error, disabled }: GenrePickerProps) => {
  const inputId = useId()
  const hintId = `${inputId}-hint`
  const errorId = `${inputId}-error`
  const anchor = useComboboxAnchor()
  const selected = genres.filter((genre) => value.includes(genre.id))
  const atCap = selected.length >= MOVIE_GENRES_MAX

  return (
    <div className={styles.field}>
      <Label htmlFor={inputId}>Genres</Label>
      <Combobox
        multiple
        items={genres}
        value={selected}
        onValueChange={(picked) => {
          const ids = new Set(picked.map((genre) => genre.id))
          onChange(genres.filter((genre) => ids.has(genre.id)).map((genre) => genre.id))
        }}
        itemToStringLabel={(genre) => genre.name}
        isItemEqualToValue={(a, b) => a.id === b.id}
        disabled={disabled}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(picked: Genre[]) => (
              <>
                {picked.map((genre) => (
                  <RemovableChip key={genre.id} label={genre.name} />
                ))}
                <ComboboxChipsInput
                  id={inputId}
                  placeholder={picked.length === 0 ? 'Search genres' : 'Add a genre'}
                  autoComplete="off"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${hintId} ${errorId}` : hintId}
                />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No genre matches</ComboboxEmpty>
          <ComboboxList>
            {(genre: Genre) => (
              <ComboboxItem
                key={genre.id}
                value={genre}
                disabled={atCap && !value.includes(genre.id)}
              >
                {genre.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <p id={hintId} className={styles.hint}>
        Up to {MOVIE_GENRES_MAX}
      </p>
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
