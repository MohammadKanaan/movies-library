'use client'

import { Search } from 'lucide-react'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { MoviePoster } from '@/components/Movies/MoviePoster'
import { Headshot } from '@/components/People/Headshot'
import { Button } from '@/components/SCN/button'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/SCN/combobox'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import { searchCatalog } from '@/lib/client/search'
import { moviePath, personPath, ROUTE_SEARCH, searchPath } from '@/lib/constants-routes'
import { SEARCH_MIN_LENGTH } from '@/lib/dto/common'
import type { MovieSummary } from '@/lib/dto/movies'
import type { PersonListItem } from '@/lib/dto/people'
import { SEARCH_MAX_LENGTH } from '@/lib/dto/search'
import styles from './styles.module.scss'

type Suggestion =
  | { kind: 'movie'; movie: MovieSummary }
  | { kind: 'person'; person: PersonListItem }
  | { kind: 'all'; q: string }

type SiteSearchProps = {
  /** Called when a search leaves the page: the mobile menus close themselves. */
  onNavigate?: () => void
  autoFocus?: boolean
}

const suggestionKey = (suggestion: Suggestion) =>
  suggestion.kind === 'movie'
    ? `movie:${suggestion.movie.id}`
    : suggestion.kind === 'person'
      ? `person:${suggestion.person.id}`
      : 'all'

const suggestionLabel = (suggestion: Suggestion) =>
  suggestion.kind === 'movie'
    ? suggestion.movie.title
    : suggestion.kind === 'person'
      ? suggestion.person.name
      : `See all results for “${suggestion.q}”`

const suggestionHref = (suggestion: Suggestion) =>
  suggestion.kind === 'movie'
    ? moviePath(suggestion.movie.slug)
    : suggestion.kind === 'person'
      ? personPath(suggestion.person.slug)
      : searchPath(suggestion.q)

/**
 * The site-wide search box: suggestions from `GET /api/v1/search` as the visitor types (the best
 * movies and people, then "See all results"), a picked suggestion opens its page, and Enter with
 * nothing picked submits the form to the search page, as a plain `GET /search?q=` would.
 */
export const SiteSearch = ({ onNavigate, autoFocus }: SiteSearchProps) => {
  const router = useRouter()
  const [inputValue, setInputValue] = useState('')
  const search = useDebouncedSearch(searchCatalog)

  const term = inputValue.trim()
  const searching = term.length >= SEARCH_MIN_LENGTH
  const results = searching ? search.result : null
  const found = results ? results.movies.totalItems + results.people.totalItems : 0
  const suggestions: Suggestion[] = results
    ? [
        ...results.movies.items.map((movie): Suggestion => ({ kind: 'movie', movie })),
        ...results.people.items.map((person): Suggestion => ({ kind: 'person', person })),
        ...(found > 0 ? [{ kind: 'all', q: results.q } satisfies Suggestion] : []),
      ]
    : []

  const handlePick = (suggestion: Suggestion | null) => {
    if (!suggestion) {
      return
    }
    search.reset()
    setInputValue('')
    onNavigate?.()
    router.push(suggestionHref(suggestion))
  }

  return (
    <Form
      action={ROUTE_SEARCH}
      role="search"
      className={styles.form}
      onSubmit={() => {
        search.reset()
        onNavigate?.()
      }}
    >
      <Combobox
        items={suggestions}
        filter={null}
        value={null}
        onValueChange={handlePick}
        inputValue={inputValue}
        onInputValueChange={(value, details) => {
          // Picking a suggestion would write its label into the box; the box clears instead.
          if (details.reason !== 'item-press') {
            setInputValue(value)
            search.setTerm(value)
          }
        }}
        itemToStringLabel={suggestionLabel}
      >
        <ComboboxInput
          name="q"
          type="search"
          aria-label="Search movies and people"
          placeholder="Search movies and people"
          autoComplete="off"
          autoFocus={autoFocus}
          maxLength={SEARCH_MAX_LENGTH}
          showTrigger={false}
        />
        <ComboboxContent>
          <ComboboxEmpty>Type at least {SEARCH_MIN_LENGTH} characters</ComboboxEmpty>
          {searching && search.status === 'loading' && !results && (
            <p className={styles.status}>Searching…</p>
          )}
          {searching && search.error && (
            <p className={styles.status} role="alert">
              {search.error}
            </p>
          )}
          {results && found === 0 && (
            <p className={styles.status}>Nothing found for “{results.q}”</p>
          )}
          <ComboboxList>
            {(suggestion: Suggestion) => (
              <ComboboxItem key={suggestionKey(suggestion)} value={suggestion}>
                {suggestion.kind === 'movie' ? (
                  <span className={styles.suggestion}>
                    <span className={styles.poster}>
                      <MoviePoster movie={suggestion.movie} />
                    </span>
                    <span className={styles.text}>
                      <span className={styles.title}>{suggestion.movie.title}</span>
                      <span className={styles.meta}>
                        {suggestion.movie.releaseDate.getUTCFullYear()} · Movie
                      </span>
                    </span>
                  </span>
                ) : suggestion.kind === 'person' ? (
                  <span className={styles.suggestion}>
                    <span className={styles.headshot}>
                      <Headshot person={suggestion.person} size="sm" />
                    </span>
                    <span className={styles.text}>
                      <span className={styles.title}>{suggestion.person.name}</span>
                      <span className={styles.meta}>
                        {suggestion.person.creditCount}{' '}
                        {suggestion.person.creditCount === 1 ? 'credit' : 'credits'}
                      </span>
                    </span>
                  </span>
                ) : (
                  <span className={styles.all}>
                    <Search aria-hidden="true" />
                    {suggestionLabel(suggestion)}
                  </span>
                )}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <Button type="submit" variant="ghost" size="icon" aria-label="Search">
        <Search aria-hidden="true" />
      </Button>
    </Form>
  )
}
