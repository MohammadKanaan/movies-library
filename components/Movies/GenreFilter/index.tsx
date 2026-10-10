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

type GenreFilterProps = {
  /** Every genre, in name order: the list is local, filtered as the visitor types. */
  genres: Genre[]
  /** The selected genres, as slugs. */
  value: string[]
  /** Reports the selection in genre order, so the URL reads the same whatever the click order. */
  onChange: (slugs: string[]) => void
  disabled?: boolean
}

/**
 * The advanced search's genre field: a multi-select combobox over the catalog's genres, each pick a
 * removable chip, capped at `MOVIE_GENRES_MAX`. The whole list shows on focus; typing narrows it.
 */
export const GenreFilter = ({ genres, value, onChange, disabled }: GenreFilterProps) => {
  const inputId = useId()
  const anchor = useComboboxAnchor()
  const selected = genres.filter((genre) => value.includes(genre.slug))
  const atCap = selected.length >= MOVIE_GENRES_MAX

  return (
    <div className={styles.field}>
      <Label htmlFor={inputId}>Genres</Label>
      <Combobox
        multiple
        items={genres}
        value={selected}
        onValueChange={(picked) => {
          const slugs = new Set(picked.map((genre) => genre.slug))
          onChange(genres.filter((genre) => slugs.has(genre.slug)).map((genre) => genre.slug))
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
                  placeholder={picked.length === 0 ? 'Any genre' : 'Add a genre'}
                  autoComplete="off"
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
                disabled={atCap && !value.includes(genre.slug)}
              >
                {genre.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <p className={styles.hint}>Movies carrying every genre picked, up to {MOVIE_GENRES_MAX}.</p>
    </div>
  )
}
