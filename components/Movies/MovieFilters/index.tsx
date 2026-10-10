'use client'

import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { Input } from '@/components/Form/Input'
import { GenreFilter } from '@/components/Movies/GenreFilter'
import { PersonFilter } from '@/components/Movies/PersonFilter'
import { RangeFilter } from '@/components/Movies/RangeFilter'
import { RatingFilter } from '@/components/Movies/RatingFilter'
import { Button } from '@/components/SCN/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/SCN/select'
import { fromThumbs, toThumbs, type RangeBounds, type Thumbs } from '@/lib/filterRange'
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
  rating: 'Highest rated',
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
  /** A navigation is in flight: Apply, the sort and the chips wait; the fields do not. */
  disabled?: boolean
  /** Writes the given filters to the URL, back on page 1. */
  onChange: (patch: Partial<Filters>) => void
  onSortChange: (sort: MovieSort) => void
}

type Chip = { key: string; label: string; remove: Partial<Filters> }

/**
 * What the panel's fields hold until Apply: the URL's filters, edited. Each range keeps the bounds
 * it started from beside its thumbs, so a bound beyond the track survives until Reset clears it.
 * `ratingMax` has no field (the stars pick a floor) but rides along for the same reason.
 */
type Draft = {
  q: string
  genres: string[]
  person: PersonSummary | null
  year: Thumbs
  yearFrom: RangeBounds
  runtime: Thumbs
  runtimeFrom: RangeBounds
  ratingMin: number | null
  ratingMax: number | null
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

const ratingLabel = (min: number | null, max: number | null) =>
  min !== null && max !== null
    ? `Rated ${min}–${max}`
    : min !== null
      ? `Rated ${min}+`
      : `Rated up to ${max}`

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
  if (filters.ratingMin !== null || filters.ratingMax !== null) {
    chips.push({
      key: 'rating',
      label: ratingLabel(filters.ratingMin, filters.ratingMax),
      remove: { ratingMin: null, ratingMax: null },
    })
  }
  if (filters.person) {
    chips.push({ key: 'person', label: person?.name ?? filters.person, remove: { person: '' } })
  }
  return chips
}

const draftOf = (filters: Filters, person: PersonSummary | null): Draft => {
  const year = { from: filters.yearFrom, to: filters.yearTo }
  const runtime = { from: filters.runtimeMin, to: filters.runtimeMax }
  return {
    q: filters.q,
    genres: filters.genres,
    person: filters.person ? person : null,
    year: toThumbs(year, YEAR_TRACK_MIN, currentYear()),
    yearFrom: year,
    runtime: toThumbs(runtime, RUNTIME_TRACK.min, RUNTIME_TRACK.max),
    runtimeFrom: runtime,
    ratingMin: filters.ratingMin,
    ratingMax: filters.ratingMax,
  }
}

/** The slider's readout: the range in words, "Any …" when neither end is bound. */
const readoutOf = (from: number | null, to: number | null, any: string, unit = '') =>
  from === null && to === null ? any : rangeLabel(from, to, unit)

/**
 * The movie list's search and filters, IMDb's advanced search tucked beside the page header: a
 * Filters toggle and the sort, a panel that slides open below them (title, genres, person, release
 * year, runtime, lowest rating, the title focused) and a chip per filter in force. The panel's
 * fields are a draft: Apply writes them to the URL at once through `onChange` and tucks the panel
 * away, Reset empties them. The sort and the chips apply at once.
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
  const titleRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(() => draftOf(filters, person))

  // The fields follow the URL (back/forward, a removed chip), but only once no navigation is in
  // flight, so one landing never rewrites a field under the visitor's hands.
  const urlKey = JSON.stringify([
    filters.q,
    filters.genres,
    filters.person,
    filters.yearFrom,
    filters.yearTo,
    filters.runtimeMin,
    filters.runtimeMax,
    filters.ratingMin,
    filters.ratingMax,
  ])
  const [syncedKey, setSyncedKey] = useState(urlKey)
  if (syncedKey !== urlKey && !disabled) {
    setSyncedKey(urlKey)
    setDraft(draftOf(filters, person))
  }

  const chips = chipsOf(filters, genres, person)
  const yearMax = currentYear()
  const yearBounds = fromThumbs(draft.year, draft.yearFrom, YEAR_TRACK_MIN, yearMax)
  const runtimeBounds = fromThumbs(
    draft.runtime,
    draft.runtimeFrom,
    RUNTIME_TRACK.min,
    RUNTIME_TRACK.max,
  )
  const emptyDraft = draftOf(EMPTY_MOVIE_FILTERS, null)
  const draftIsEmpty = JSON.stringify(draft) === JSON.stringify(emptyDraft)

  const toggle = () => {
    if (open) {
      setOpen(false)
      return
    }
    // The panel is inert while closed: commit it open before moving focus into it.
    flushSync(() => setOpen(true))
    titleRef.current?.focus()
  }

  const apply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setOpen(false)
    onChange({
      q: draft.q.trim(),
      genres: draft.genres,
      person: draft.person?.slug ?? '',
      yearFrom: yearBounds.from,
      yearTo: yearBounds.to,
      runtimeMin: runtimeBounds.from,
      runtimeMax: runtimeBounds.to,
      ratingMin: draft.ratingMin,
      ratingMax: draft.ratingMax,
    })
  }

  return (
    <div className={styles.filters}>
      <div className={styles.bar}>
        {header}
        <div className={styles.controls}>
          <Button
            type="button"
            variant="outline"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={toggle}
          >
            <SlidersHorizontal data-icon="inline-start" aria-hidden="true" />
            Filters
            {chips.length > 0 ? <span className={styles.badge}>{chips.length}</span> : null}
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

      {/* Closed, the panel is out of the tab order and the accessibility tree, yet stays mounted so it can animate. */}
      <div
        id={panelId}
        className={styles.collapse}
        data-open={open || undefined}
        aria-hidden={!open}
        inert={!open}
      >
        <div className={styles.clip}>
          <form className={styles.card} role="search" aria-label="Movies" onSubmit={apply}>
            <div className={styles.fields}>
              <div className={styles.title}>
                <Input
                  ref={titleRef}
                  name="q"
                  type="search"
                  label="Title"
                  placeholder="Search by title"
                  value={draft.q}
                  onChange={(event) => {
                    const q = event.target.value
                    setDraft((current) => ({ ...current, q }))
                  }}
                  maxLength={MOVIE_SEARCH_MAX_LENGTH}
                  autoComplete="off"
                />
              </div>
              <div className={styles.genres}>
                <GenreFilter
                  genres={genres}
                  value={draft.genres}
                  onChange={(slugs) => setDraft((current) => ({ ...current, genres: slugs }))}
                />
              </div>
              <div className={styles.person}>
                <PersonFilter
                  value={draft.person}
                  onChange={(next) => setDraft((current) => ({ ...current, person: next }))}
                />
              </div>
              <div className={styles.year}>
                <RangeFilter
                  label="Release year"
                  min={YEAR_TRACK_MIN}
                  max={yearMax}
                  step={1}
                  value={draft.year}
                  readout={readoutOf(yearBounds.from, yearBounds.to, 'Any year')}
                  bounds={[String(YEAR_TRACK_MIN), String(yearMax)]}
                  onValueChange={(year) => setDraft((current) => ({ ...current, year }))}
                />
              </div>
              <div className={styles.runtime}>
                <RangeFilter
                  label="Runtime"
                  min={RUNTIME_TRACK.min}
                  max={RUNTIME_TRACK.max}
                  step={RUNTIME_TRACK.step}
                  value={draft.runtime}
                  readout={readoutOf(runtimeBounds.from, runtimeBounds.to, 'Any length', ' min')}
                  bounds={[
                    formatRuntime(RUNTIME_TRACK.min),
                    `${formatRuntime(RUNTIME_TRACK.max)}+`,
                  ]}
                  onValueChange={(runtime) => setDraft((current) => ({ ...current, runtime }))}
                />
              </div>
              <div className={styles.rating}>
                {/* A floor picked on the review form's stars. A `ratingMax` (a hand-written link, the
                    API) still applies and has its chip; Reset or lifting the chip clears it. */}
                <RatingFilter
                  value={draft.ratingMin}
                  onChange={(ratingMin) => setDraft((current) => ({ ...current, ratingMin }))}
                />
              </div>
            </div>
            <div className={styles.cardFooter}>
              <Button
                type="button"
                variant="ghost"
                disabled={draftIsEmpty}
                onClick={() => setDraft(emptyDraft)}
              >
                Reset
              </Button>
              <Button type="submit" disabled={disabled}>
                Apply filters
              </Button>
            </div>
          </form>
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
