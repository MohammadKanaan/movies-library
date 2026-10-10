'use client'

import { useEffect, useEffectEvent, useRef, useState, type ReactNode } from 'react'
import { LoadingButton } from '@/components/LoadingButton'
import { MovieCard } from '@/components/Movies/MovieCard'
import { MovieFilters } from '@/components/Movies/MovieFilters'
import { fetchMovies } from '@/lib/client/movies'
import { MAX_PAGE } from '@/lib/dto/common'
import type { Genre } from '@/lib/dto/genres'
import { moviesUrlQuery, type ListMoviesQuery, type MovieSummary } from '@/lib/dto/movies'
import type { PersonSummary } from '@/lib/dto/people'
import { useUrlState } from '@/hooks/useUrlState'
import styles from './styles.module.scss'

type MoviesViewProps = {
  /** The server-rendered page header, with the filter toggle and sort beside it. */
  header: ReactNode
  page: number
  perPage: number
  totalPages: number
  /** The filters and sort the next batch repeats; its own `page` and `perPage` are overridden. */
  query: ListMoviesQuery
  /** Every genre, for the filter. */
  genres: Genre[]
  /** The person the URL filters by, resolved by the page; null when none or unknown. */
  person: PersonSummary | null
  /** The ids of the first batch, so a later batch cannot repeat a movie already on screen. */
  initialIds: string[]
  /** The `<li>`s of the first batch, rendered on the server. */
  children: ReactNode
  /** Shown instead of the list when the first batch is empty. */
  empty: ReactNode
}

const MoviesResults = ({
  page: initialPage,
  perPage,
  totalPages: initialTotalPages,
  query,
  initialIds,
  children,
  empty,
}: MoviesViewProps) => {
  const [batch, setBatch] = useState(() => ({
    items: [] as MovieSummary[],
    page: initialPage,
    totalPages: initialTotalPages,
  }))
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const request = useRef<AbortController | null>(null)
  const sentinel = useRef<HTMLDivElement | null>(null)
  const hasMore = batch.page < Math.min(batch.totalPages, MAX_PAGE)
  const loaded = initialIds.length + batch.items.length

  const loadMore = async () => {
    // The ref locks synchronously, before React renders the loading state.
    if (!hasMore || request.current) {
      return
    }
    const current = new AbortController()
    request.current = current
    setStatus('loading')
    try {
      const next = await fetchMovies({ ...query, page: batch.page + 1, perPage }, current.signal)
      if (current.signal.aborted) {
        return
      }
      setBatch((previous) => {
        const seen = new Set([...initialIds, ...previous.items.map((movie) => movie.id)])
        const added = next.items.filter((movie) => {
          if (seen.has(movie.id)) {
            return false
          }
          seen.add(movie.id)
          return true
        })
        return {
          items: [...previous.items, ...added],
          page: next.page,
          // A catalog edit can empty a page that was available when the reader started.
          totalPages: next.items.length === 0 ? next.page : next.totalPages,
        }
      })
      setStatus('idle')
    } catch {
      if (!current.signal.aborted) {
        setStatus('error')
      }
    } finally {
      if (request.current === current) {
        request.current = null
      }
    }
  }

  useEffect(() => () => request.current?.abort(), [])

  // The observer is wired once per idle stretch; the event reads the latest `loadMore`.
  const onSentinelVisible = useEffectEvent(() => {
    void loadMore()
  })

  useEffect(() => {
    if (!hasMore || status !== 'idle' || !sentinel.current || !window.IntersectionObserver) {
      return
    }
    let active = true
    const observer = new IntersectionObserver(
      (entries) => {
        if (active && entries.some((entry) => entry.isIntersecting)) {
          onSentinelVisible()
        }
      },
      { rootMargin: '400px' },
    )
    observer.observe(sentinel.current)
    return () => {
      active = false
      observer.disconnect()
    }
  }, [hasMore, status])

  return (
    <div className={styles.results}>
      {initialIds.length === 0 ? (
        empty
      ) : (
        <>
          <ul
            className={styles.grid}
            aria-label="Movies"
            aria-busy={status === 'loading' || undefined}
          >
            {children}
            {batch.items.map((movie) => (
              <li key={movie.id}>
                <MovieCard movie={movie} />
              </li>
            ))}
          </ul>
          <div className={styles.loadMore} ref={sentinel}>
            {status === 'error' ? (
              <p className={styles.message} role="alert">
                Could not load more movies. Try again.
              </p>
            ) : (
              <p className={styles.message} role="status">
                {loaded} {loaded === 1 ? 'movie' : 'movies'} loaded.
              </p>
            )}
            {hasMore ? (
              <LoadingButton
                type="button"
                variant="outline"
                loading={status === 'loading'}
                onClick={() => void loadMore()}
              >
                {status === 'error' ? 'Retry loading movies' : 'Load more movies'}
              </LoadingButton>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}

/**
 * The list's interactive parts: the search and filters, the sort and the batches appended as the
 * reader scrolls, all through the URL. The filter card sits under the toolbar and pushes the list
 * down when it opens; a different query or first batch starts a fresh list and aborts the old one.
 */
export const MoviesView = (props: MoviesViewProps) => {
  const { header, page, perPage, totalPages, query, genres, person, initialIds } = props
  const { state, setState, isPending } = useUrlState(moviesUrlQuery, { history: 'push' })
  const key = JSON.stringify([query, page, perPage, totalPages, initialIds])

  return (
    <div className={styles.view}>
      <MovieFilters
        header={header}
        filters={state}
        sort={state.sort}
        genres={genres}
        person={person}
        disabled={isPending}
        onChange={(patch) => setState({ ...patch, page: 1 })}
        onSortChange={(sort) => setState({ sort, page: 1 })}
      />
      <MoviesResults key={key} {...props} />
    </div>
  )
}
