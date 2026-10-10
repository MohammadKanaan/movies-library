'use client'

import { ChevronLeft, SlidersHorizontal, X } from 'lucide-react'
import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Input } from '@/components/Form/Input'
import { GenreFilter } from '@/components/Movies/GenreFilter'
import { PersonFilter } from '@/components/Movies/PersonFilter'
import { RangeFilter, type Range } from '@/components/Movies/RangeFilter'
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

/** The runtime slider's top end, in minutes; at it the filter has no upper bound ("240+ min"). */
const RUNTIME_SLIDER_MAX = 240

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
  /** The results, laid out beside the filter panel. */
  children: ReactNode
}

type Chip = { key: string; label: string; remove: Partial<Filters> }

const toSort = (value: string | null): MovieSort => {
  const sort = movieSortSchema.safeParse(value)
  return sort.success ? sort.data : 'newest'
}

/** How many of the panel's filters are in force (each genre counts), for the panel's badge. */
const countPanelFilters = (filters: Filters) =>
  filters.genres.length +
  (filters.yearFrom !== null || filters.yearTo !== null ? 1 : 0) +
  (filters.runtimeMin !== null || filters.runtimeMax !== null ? 1 : 0) +
  (filters.person ? 1 : 0)

/** The filters the panel holds, as opposed to the title search in the toolbar. */
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

type TitleSearchProps = Pick<MovieFiltersProps, 'filters' | 'disabled' | 'onChange'>

/** The title search, always shown. Remounted by its parent when the URL's `q` changes. */
const TitleSearch = ({ filters, disabled, onChange }: TitleSearchProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const q = new FormData(event.currentTarget).get('q')
    onChange({ q: typeof q === 'string' ? q.trim() : '' })
  }

  return (
    <form className={styles.search} onSubmit={handleSubmit} role="search">
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
    </form>
  )
}

type PanelFormProps = Pick<
  MovieFiltersProps,
  'filters' | 'genres' | 'person' | 'disabled' | 'onChange'
> & {
  /** After the filters are applied: the panel tucks itself away to show the results. */
  onApplied: () => void
}

/**
 * The panel's fields and their apply button. Remounted by its parent whenever the URL's filters
 * change, so the drafts follow the URL (back/forward, a removed chip).
 */
const PanelForm = ({ filters, genres, person, disabled, onChange, onApplied }: PanelFormProps) => {
  const currentYear = new Date().getUTCFullYear()
  const [draftGenres, setDraftGenres] = useState(filters.genres)
  const [draftPerson, setDraftPerson] = useState(person)
  const [years, setYears] = useState<Range>({ from: filters.yearFrom, to: filters.yearTo })
  const [runtime, setRuntime] = useState<Range>({
    from: filters.runtimeMin,
    to: filters.runtimeMax,
  })
  const isEmpty =
    draftGenres.length === 0 &&
    draftPerson === null &&
    years.from === null &&
    years.to === null &&
    runtime.from === null &&
    runtime.to === null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onChange({
      genres: draftGenres,
      person: draftPerson?.slug ?? '',
      yearFrom: years.from,
      yearTo: years.to,
      runtimeMin: runtime.from,
      runtimeMax: runtime.to,
    })
    onApplied()
  }

  const reset = () => {
    setDraftGenres([])
    setDraftPerson(null)
    setYears({ from: null, to: null })
    setRuntime({ from: null, to: null })
  }

  return (
    <form className={styles.panelForm} onSubmit={handleSubmit} aria-label="Filters">
      <GenreFilter genres={genres} value={draftGenres} onChange={setDraftGenres} />
      <RangeFilter
        label="Release year"
        min={MOVIE_YEAR_MIN}
        max={currentYear}
        step={1}
        largeStep={10}
        value={years}
        onChange={setYears}
        readout={
          years.from === null && years.to === null ? 'Any year' : rangeLabel(years.from, years.to)
        }
        minLabel={String(MOVIE_YEAR_MIN)}
        maxLabel={String(currentYear)}
      />
      <RangeFilter
        label="Runtime"
        min={0}
        max={RUNTIME_SLIDER_MAX}
        step={5}
        largeStep={30}
        value={runtime}
        onChange={setRuntime}
        readout={
          runtime.from === null && runtime.to === null
            ? 'Any length'
            : rangeLabel(runtime.from, runtime.to, ' min')
        }
        minLabel="0 min"
        maxLabel={`${RUNTIME_SLIDER_MAX}+ min`}
      />
      <PersonFilter value={draftPerson} onChange={setDraftPerson} />
      <div className={styles.panelActions}>
        <Button type="submit" disabled={disabled}>
          Apply filters
        </Button>
        <Button type="button" variant="ghost" disabled={isEmpty} onClick={reset}>
          Reset
        </Button>
      </div>
    </form>
  )
}

/**
 * The movie list's search and filters, IMDb's advanced search beside the results: the title search
 * and sort in a toolbar, a chip per filter in force, and a filter panel for genres, release year,
 * runtime and person. The panel waits tucked into a rail at the side of the results and, opened,
 * wipes out of the rail over them: the results keep their layout, so nothing reflows while it moves.
 * Everything lives in the URL through `onChange` / `onSortChange`.
 */
export const MovieFilters = ({
  filters,
  sort,
  genres,
  person,
  disabled,
  onChange,
  onSortChange,
  children,
}: MovieFiltersProps) => {
  const panelId = useId()
  const [open, setOpen] = useState(() => hasPanelFilters(filters))
  const toggleRef = useRef<HTMLButtonElement>(null)
  const chips = chipsOf(filters, genres, person)
  // Tucking the panel away makes its contents inert, so focus goes back to the rail.
  const close = () => {
    setOpen(false)
    toggleRef.current?.focus()
  }
  const panelCount = countPanelFilters(filters)
  // The forms follow the URL: a new set of filters is a new form with fresh defaults.
  const panelKey = JSON.stringify([filters, person?.slug ?? null])

  return (
    <div className={styles.filters}>
      <div className={styles.toolbar}>
        <TitleSearch key={filters.q} filters={filters} disabled={disabled} onChange={onChange} />
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

      <div className={styles.layout} data-open={open || undefined}>
        <aside className={styles.panel}>
          <button
            ref={toggleRef}
            type="button"
            className={styles.rail}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen(true)}
          >
            <SlidersHorizontal aria-hidden="true" />
            <span className={styles.railLabel}>Filters</span>{' '}
            {panelCount > 0 ? (
              <span className={styles.count}>
                {panelCount} <span className={styles.srOnly}>active</span>
              </span>
            ) : null}
          </button>
          {/* Always mounted, so it can wipe out of the rail and back; `inert` while tucked away. */}
          <div id={panelId} className={styles.sheet} inert={!open}>
            <div className={styles.sheetHeader}>
              <SlidersHorizontal aria-hidden="true" />
              <span>Filters</span>
              {panelCount > 0 ? <span className={styles.count}>{panelCount}</span> : null}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Hide filters"
                onClick={close}
              >
                <ChevronLeft className={styles.collapseIcon} aria-hidden="true" />
              </Button>
            </div>
            <PanelForm
              key={panelKey}
              filters={filters}
              genres={genres}
              person={person}
              disabled={disabled}
              onChange={onChange}
              onApplied={close}
            />
          </div>
        </aside>
        <div className={styles.results}>{children}</div>
      </div>
    </div>
  )
}
