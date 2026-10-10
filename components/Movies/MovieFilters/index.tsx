'use client'

import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'
import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { Input } from '@/components/Form/Input'
import { GenreFilter } from '@/components/Movies/GenreFilter'
import { PersonFilter } from '@/components/Movies/PersonFilter'
import { RangeFilter } from '@/components/Movies/RangeFilter'
import { Button } from '@/components/SCN/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/SCN/select'
import { fromThumbs, toThumbs, type Thumbs } from '@/lib/filterRange'
import { formatRuntime } from '@/lib/formatRuntime'
import type { Genre } from '@/lib/dto/genres'
import {
  EMPTY_MOVIE_FILTERS,
  MOVIE_SEARCH_MAX_LENGTH,
  movieSortSchema,
  type MovieFilters as Filters,
  type MovieSort,
} from '@/lib/dto/movies'
import type { PersonSummary } from '@/lib/dto/people'
import styles from './styles.module.scss'

export const SORT_LABELS: Record<MovieSort, string> = {
  newest: 'Newest release',
  oldest: 'Oldest release',
  title: 'Title A–Z',
  added: 'Recently added',
}

/**
 * The sliders' tracks. A bound beyond a track (the schema allows any year from 1888 and up to 1000
 * minutes) is still a valid filter: the thumb rests at the end and the chip names the real value.
 */
const YEAR_TRACK_MIN = 1920
const RUNTIME_TRACK = { min: 30, max: 240, step: 5 }

type MovieFiltersProps = {
  /** The page header the Filters toggle and the sort sit beside. */
  header?: ReactNode
  /** The filters in the URL. */
  filters: Filters
  sort: MovieSort
  /** Every genre, in name order. */
  genres: Genre[]
  /** The person `filters.person` names, for the chip and the field; null when unknown. */
  person: PersonSummary | null
  /** A navigation is in flight: the search button, the sort and the chips wait; the fields do not. */
  disabled?: boolean
  /** Writes the given filters to the URL, back on page 1. */
  onChange: (patch: Partial<Filters>) => void
  onSortChange: (sort: MovieSort) => void
}

type Chip = { key: string; label: string; remove: Partial<Filters> }

/** What the panel's fields show: the URL's filters, plus what was just chosen and is still landing. */
type Draft = {
  genres: string[]
  person: PersonSummary | null
  year: Thumbs
  runtime: Thumbs
}

const toSort = (value: string | null): MovieSort => {
  const sort = movieSortSchema.safeParse(value)
  return sort.success ? sort.data : 'newest'
}

const currentYear = () => new Date().getUTCFullYear()

const rangeLabel = (from: number | null, to: number | null, unit = '') =>
  from !== null && to !== null
    ? `${from}–${to}${unit}`
    : from !== null
      ? `From ${from}${unit}`
      : `Until ${to}${unit}`

/** The panel's filters in force, as opposed to the title search that is always shown. */
const hasPanelFilters = (filters: Filters) =>
  filters.genres.length > 0 ||
  filters.person !== '' ||
  filters.yearFrom !== null ||
  filters.yearTo !== null ||
  filters.runtimeMin !== null ||
  filters.runtimeMax !== null

/** The chips for the filters in force, each with the patch that lifts it. */
const chipsOf = (filters: Filters, genres: Genre[], person: PersonSummary | null): Chip[] => {
  const chips: Chip[] = []
  if (filters.q) {
    chips.push({ key: 'q', label: `“${filters.q}”`, remove: { q: '' } })
  }
  for (const slug of filters.genres) {
    chips.push({
      key: `genre:${slug}`,
      label: genres.find((genre) => genre.slug === slug)?.name ?? slug,
      remove: { genres: filters.genres.filter((other) => other !== slug) },
    })
  }
  if (filters.yearFrom !== null || filters.yearTo !== null) {
    chips.push({
      key: 'year',
      label: rangeLabel(filters.yearFrom, filters.yearTo),
      remove: { yearFrom: null, yearTo: null },
    })
  }
  if (filters.runtimeMin !== null || filters.runtimeMax !== null) {
    chips.push({
      key: 'runtime',
      label: rangeLabel(filters.runtimeMin, filters.runtimeMax, ' min'),
      remove: { runtimeMin: null, runtimeMax: null },
    })
  }
  if (filters.person) {
    chips.push({ key: 'person', label: person?.name ?? filters.person, remove: { person: '' } })
  }
  return chips
}

const draftOf = (filters: Filters, person: PersonSummary | null): Draft => ({
  genres: filters.genres,
  person: filters.person ? person : null,
  year: toThumbs({ from: filters.yearFrom, to: filters.yearTo }, YEAR_TRACK_MIN, currentYear()),
  runtime: toThumbs(
    { from: filters.runtimeMin, to: filters.runtimeMax },
    RUNTIME_TRACK.min,
    RUNTIME_TRACK.max,
  ),
})

/** The slider's readout: the range in words, "Any …" when neither end is bound. */
const readoutOf = (from: number | null, to: number | null, any: string, unit = '') =>
  from === null && to === null ? any : rangeLabel(from, to, unit)

/**
 * The movie list's search and filters, IMDb's advanced search beside the page header in one bar:
 * the title search and sort always shown, a card under them (opened by Filters, growing in and
 * pushing the list down) for genres, release year, runtime and person, and a chip per filter in
 * force. Everything lives in the URL through `onChange` / `onSortChange`: the title search applies
 * on its button, the card's fields as each choice settles (a genre picked, a slider released).
 */
export const MovieFilters = ({
  header,
  filters,
  sort,
  genres,
  person,
  disabled,
  onChange,
  onSortChange,
}: MovieFiltersProps) => {
  const panelId = useId()
  const [open, setOpen] = useState(() => hasPanelFilters(filters))
  const [draft, setDraft] = useState(() => draftOf(filters, person))

  // The fields follow the URL (back/forward, a removed chip, a reset), but only once no navigation
  // is in flight: one landing mid-drag must not pull a thumb out from under the visitor. The card
  // is never remounted, so a list or a slider in use keeps its focus while the page re-renders.
  const urlKey = JSON.stringify([
    filters.genres,
    filters.person,
    filters.yearFrom,
    filters.yearTo,
    filters.runtimeMin,
    filters.runtimeMax,
  ])
  const [syncedKey, setSyncedKey] = useState(urlKey)
  if (syncedKey !== urlKey && !disabled) {
    setSyncedKey(urlKey)
    setDraft(draftOf(filters, person))
  }

  const chips = chipsOf(filters, genres, person)
  const panelFilterCount = chips.filter((chip) => chip.key !== 'q').length
  const yearMax = currentYear()
  const yearBounds = fromThumbs(
    draft.year,
    { from: filters.yearFrom, to: filters.yearTo },
    YEAR_TRACK_MIN,
    yearMax,
  )
  const runtimeBounds = fromThumbs(
    draft.runtime,
    { from: filters.runtimeMin, to: filters.runtimeMax },
    RUNTIME_TRACK.min,
    RUNTIME_TRACK.max,
  )

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const q = new FormData(event.currentTarget).get('q')
    onChange({ q: typeof q === 'string' ? q.trim() : '' })
  }

  return (
    <div className={styles.filters}>
      <div className={styles.toolbar}>
        {header}
        <form className={styles.search} role="search" aria-label="Movies" onSubmit={handleSearch}>
          <div className={styles.searchField}>
            {/* Keyed by the URL's search, so a removed chip or the back button refills it. */}
            <Input
              key={filters.q}
              name="q"
              type="search"
              label="Search movies"
              placeholder="Title"
              defaultValue={filters.q}
              maxLength={MOVIE_SEARCH_MAX_LENGTH}
              autoComplete="off"
            />
          </div>
          <Button
            type="submit"
            variant="secondary"
            size="icon"
            aria-label="Search"
            disabled={disabled}
          >
            <Search aria-hidden="true" />
          </Button>
        </form>
        <div className={styles.controls}>
          <Button
            type="button"
            variant="outline"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            <SlidersHorizontal data-icon="inline-start" aria-hidden="true" />
            Filters
            {panelFilterCount > 0 ? <span className={styles.badge}>{panelFilterCount}</span> : null}
            <span className={styles.chevron} data-open={open || undefined}>
              <ChevronDown aria-hidden="true" />
            </span>
          </Button>
          <Select
            items={SORT_LABELS}
            value={sort}
            onValueChange={(value) => onSortChange(toSort(value))}
          >
            <SelectTrigger aria-label="Sort" disabled={disabled}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SORT_LABELS) as MovieSort[]).map((option) => (
                <SelectItem key={option} value={option}>
                  {SORT_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Closed, the card is out of the tab order and the accessibility tree, yet stays mounted so it can animate. */}
      <div
        id={panelId}
        className={styles.collapse}
        data-open={open || undefined}
        aria-hidden={!open}
        inert={!open}
      >
        <div className={styles.clip}>
          <div className={styles.card}>
            <div className={styles.fields}>
              <GenreFilter
                genres={genres}
                value={draft.genres}
                onChange={(slugs) => {
                  setDraft((current) => ({ ...current, genres: slugs }))
                  onChange({ genres: slugs })
                }}
              />
              <RangeFilter
                label="Release year"
                min={YEAR_TRACK_MIN}
                max={yearMax}
                step={1}
                value={draft.year}
                readout={readoutOf(yearBounds.from, yearBounds.to, 'Any year')}
                bounds={[String(YEAR_TRACK_MIN), String(yearMax)]}
                onValueChange={(year) => setDraft((current) => ({ ...current, year }))}
                onValueCommitted={(year) => {
                  const next = fromThumbs(
                    year,
                    { from: filters.yearFrom, to: filters.yearTo },
                    YEAR_TRACK_MIN,
                    yearMax,
                  )
                  if (next.from !== filters.yearFrom || next.to !== filters.yearTo) {
                    onChange({ yearFrom: next.from, yearTo: next.to })
                  }
                }}
              />
              <RangeFilter
                label="Runtime"
                min={RUNTIME_TRACK.min}
                max={RUNTIME_TRACK.max}
                step={RUNTIME_TRACK.step}
                value={draft.runtime}
                readout={readoutOf(runtimeBounds.from, runtimeBounds.to, 'Any length', ' min')}
                bounds={[formatRuntime(RUNTIME_TRACK.min), `${formatRuntime(RUNTIME_TRACK.max)}+`]}
                onValueChange={(runtime) => setDraft((current) => ({ ...current, runtime }))}
                onValueCommitted={(runtime) => {
                  const next = fromThumbs(
                    runtime,
                    { from: filters.runtimeMin, to: filters.runtimeMax },
                    RUNTIME_TRACK.min,
                    RUNTIME_TRACK.max,
                  )
                  if (next.from !== filters.runtimeMin || next.to !== filters.runtimeMax) {
                    onChange({ runtimeMin: next.from, runtimeMax: next.to })
                  }
                }}
              />
              <PersonFilter
                value={draft.person}
                onChange={(next) => {
                  setDraft((current) => ({ ...current, person: next }))
                  onChange({ person: next?.slug ?? '' })
                }}
              />
            </div>
            <div className={styles.cardFooter}>
              <Button
                type="button"
                variant="ghost"
                disabled={panelFilterCount === 0}
                onClick={() =>
                  onChange({
                    genres: EMPTY_MOVIE_FILTERS.genres,
                    person: EMPTY_MOVIE_FILTERS.person,
                    yearFrom: null,
                    yearTo: null,
                    runtimeMin: null,
                    runtimeMax: null,
                  })
                }
              >
                Reset
              </Button>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      </div>

      {chips.length > 0 ? (
        <ul className={styles.chips} aria-label="Active filters">
          {chips.map((chip) => (
            <li key={chip.key} className={styles.chip}>
              <span>{chip.label}</span>
              <button
                type="button"
                className={styles.chipRemove}
                aria-label={`Remove ${chip.label}`}
                disabled={disabled}
                onClick={() => onChange(chip.remove)}
              >
                <X aria-hidden="true" />
              </button>
            </li>
          ))}
          <li>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={() => onChange(EMPTY_MOVIE_FILTERS)}
            >
              Clear all
            </Button>
          </li>
        </ul>
      ) : null}
    </div>
  )
}
