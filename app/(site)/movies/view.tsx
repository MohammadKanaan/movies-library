'use client'

import type { ReactNode } from 'react'
import { Pagination } from '@/components/Pagination'
import { useUrlState } from '@/hooks/useUrlState'
import { moviesUrlQuery } from '@/lib/dto/movies'
import styles from './styles.module.scss'

type MoviesViewProps = {
  page: number
  totalPages: number
  /** The server-rendered grid. */
  children: ReactNode
}

/** The list's only interactive part: paging through the URL, which keeps any genre filter. */
export const MoviesView = ({ page, totalPages, children }: MoviesViewProps) => {
  const { setState, isPending } = useUrlState(moviesUrlQuery, { history: 'push' })

  return (
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
  )
}
