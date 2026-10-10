'use client'

import type { ReactNode } from 'react'
import { MovieFilters } from '@/components/Movies/MovieFilters'
import { Pagination } from '@/components/Pagination'
import { useUrlState } from '@/hooks/useUrlState'
import type { Genre } from '@/lib/dto/genres'
import { moviesUrlQuery } from '@/lib/dto/movies'
import type { PersonSummary } from '@/lib/dto/people'
import styles from './styles.module.scss'

type MoviesViewProps = {
  page: number
  totalPages: number
  /** Every genre, for the filter. */
  genres: Genre[]
  /** The person the URL filters by, resolved by the page; null when none or unknown. */
  person: PersonSummary | null
  /** The server-rendered grid. */
  children: ReactNode
}

/** The list's interactive parts: the search and filters, the sort and paging, all through the URL. */
export const MoviesView = ({ page, totalPages, genres, person, children }: MoviesViewProps) => {
  const { state, setState, isPending } = useUrlState(moviesUrlQuery, { history: 'push' })

  return (
    <div className={styles.view}>
      <MovieFilters
        filters={state}
        sort={state.sort}
        genres={genres}
        person={person}
        disabled={isPending}
        onChange={(patch) => setState({ ...patch, page: 1 })}
        onSortChange={(sort) => setState({ sort, page: 1 })}
      />
      <div className={styles.results} aria-busy={isPending || undefined}>
        {children}
        {totalPages > 1 ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            disabled={isPending}
            onPageChange={(next) => setState({ page: next })}
          />
        ) : null}
      </div>
    </div>
  )
}
