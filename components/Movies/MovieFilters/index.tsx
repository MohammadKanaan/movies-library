'use client'

import { SlidersHorizontal, X } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { Input } from '@/components/Form/Input'
import { GenreFilter } from '@/components/Movies/GenreFilter'
import { PersonFilter } from '@/components/Movies/PersonFilter'
import { Button } from '@/components/SCN/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/SCN/select'
import type { Genre } from '@/lib/dto/genres'
import {
  EMPTY_MOVIE_FILTERS,
  hasMovieFilters,
  MOVIE_RUNTIME_MAX_MINUTES,
  MOVIE_SEARCH_MAX_LENGTH,
  MOVIE_YEAR_MIN,
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

type MovieFiltersProps = {
  /** The filters in the URL. */
  filters: Filters
  sort: MovieSort
  /** Every genre, in name order. */
  genres: Genre[]
  /** The person `filters.person` names, for the chip and the field; null when unknown. */
  person: PersonSummary | null
  /** A navigation is in flight. */
  disabled?: boolean
  /** Writes the given filters to the URL, back on page 1. */
  onChange: (patch: Partial<Filters>) => void
  onSortChange: (sort: MovieSort) => void
}

type Chip = { key: string; label: string; remove: Partial<Filters> }

const toSort = (value: string | null): MovieSort => {
  const sort = movieSortSchema.safeParse(value)
  return sort.success ? sort.data : 'newest'
}

/** The filters the panel holds, as opposed to the title search that is always shown. */
const hasPanelFilters = (filters: Filters) => hasMovieFilters({ ...filters, q: '' })

const rangeLabel = (from: number | null, to: number | null, unit = '') =>
  from !== null && to !== null
    ? `${from}–${to}${unit}`
    : from !== null
      ? `From ${from}${unit}`
      : `Until ${to}${unit}`

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

/** A number field's value, or null when it is blank (the URL schema drops anything invalid). */
const numberOf = (data: FormData, name: string) => {
  const value = data.get(name)
  return typeof value === 'string' && value.trim() !== '' ? Number(value) : null
}

type FilterFormProps = Omit<MovieFiltersProps, 'onSortChange' | 'sort'> & {
  sortControl: React.ReactNode
}

/**
 * The form: the title search, the filters panel and its apply button. Remounted by its parent
 * whenever the URL's filters change, so the fields follow the URL (back/forward, a removed chip).
 */
const FilterForm = ({
  filters,
  genres,
  person,
  disabled,
  onChange,
  sortControl,
}: FilterFormProps) => {
  const baseId = useId()
  const panelId = `${baseId}-panel`
  const [open, setOpen] = useState(() => hasPanelFilters(filters))
  const [draftGenres, setDraftGenres] = useState(filters.genres)
  const [draftPerson, setDraftPerson] = useState(person)
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const q = data.get('q')
    const patch: Partial<Filters> = { q: typeof q === 'string' ? q.trim() : '' }
    // A closed panel keeps its filters: a title search alone must not clear them.
    if (open) {
      patch.genres = draftGenres
      patch.person = draftPerson?.slug ?? ''
      patch.yearFrom = numberOf(data, 'yearFrom')
      patch.yearTo = numberOf(data, 'yearTo')
      patch.runtimeMin = numberOf(data, 'runtimeMin')
      patch.runtimeMax = numberOf(data, 'runtimeMax')
    }
    onChange(patch)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} role="search">
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <div className={styles.searchField}>
            <Input
              name="q"
              type="search"
              label="Search movies"
              placeholder="Title"
              defaultValue={filters.q}
              maxLength={MOVIE_SEARCH_MAX_LENGTH}
              autoComplete="off"
            />
          </div>
          <Button type="submit" variant="secondary" disabled={disabled}>
            Search
          </Button>
        </div>
        <div className={styles.controls}>
          <Button
            type="button"
            variant="outline"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            <SlidersHorizontal aria-hidden="true" />
            Filters
          </Button>
          {sortControl}
        </div>
      </div>

      {open ? (
        <div id={panelId} className={styles.panel}>
          <GenreFilter genres={genres} value={draftGenres} onChange={setDraftGenres} />

          <div className={styles.ranges}>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Release year</legend>
              <div className={styles.range}>
                <Input
                  name="yearFrom"
                  type="number"
                  label="From"
                  inputMode="numeric"
                  min={MOVIE_YEAR_MIN}
                  max={new Date().getUTCFullYear()}
                  placeholder={String(MOVIE_YEAR_MIN)}
                  defaultValue={filters.yearFrom ?? ''}
                />
                <Input
                  name="yearTo"
                  type="number"
                  label="To"
                  inputMode="numeric"
                  min={MOVIE_YEAR_MIN}
                  max={new Date().getUTCFullYear()}
                  placeholder={String(new Date().getUTCFullYear())}
                  defaultValue={filters.yearTo ?? ''}
                />
              </div>
            </fieldset>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Runtime (minutes)</legend>
              <div className={styles.range}>
                <Input
                  name="runtimeMin"
                  type="number"
                  label="At least"
                  inputMode="numeric"
                  min={1}
                  max={MOVIE_RUNTIME_MAX_MINUTES}
                  placeholder="60"
                  defaultValue={filters.runtimeMin ?? ''}
                />
                <Input
                  name="runtimeMax"
                  type="number"
                  label="At most"
                  inputMode="numeric"
                  min={1}
                  max={MOVIE_RUNTIME_MAX_MINUTES}
                  placeholder="180"
                  defaultValue={filters.runtimeMax ?? ''}
                />
              </div>
            </fieldset>
            <PersonFilter value={draftPerson} onChange={setDraftPerson} />
          </div>

          <div className={styles.panelActions}>
            <Button type="submit" disabled={disabled}>
              Apply filters
            </Button>
          </div>
        </div>
      ) : null}
    </form>
  )
}

/**
 * The movie list's search and filters, IMDb's advanced search in one bar: the title search and
 * sort always shown, a panel for genres, release year, runtime and person, and a chip per filter in
 * force. Everything lives in the URL through `onChange` / `onSortChange`.
 */
export const MovieFilters = ({ sort, onSortChange, ...props }: MovieFiltersProps) => {
  const { filters, genres, person, disabled, onChange } = props
  const chips = chipsOf(filters, genres, person)
  // The form follows the URL: a new set of filters is a new form with fresh defaults.
  const formKey = JSON.stringify([filters, person?.slug ?? null])

  return (
    <div className={styles.filters}>
      <FilterForm
        key={formKey}
        {...props}
        sortControl={
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
        }
      />
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
