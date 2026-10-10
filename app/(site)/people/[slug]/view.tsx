'use client'

import type { ReactNode } from 'react'
import { Pagination } from '@/components/Pagination'
import { useUrlState } from '@/hooks/useUrlState'
import { filmographyUrlQuery } from '@/lib/dto/people'
import styles from './styles.module.scss'

type FilmographyViewProps = {
  page: number
  totalPages: number
  /** The server-rendered grid of films. */
  children: ReactNode
}

/** The filmography's one interactive part: paging, through the URL. */
export const FilmographyView = ({ page, totalPages, children }: FilmographyViewProps) => {
  const { setState, isPending } = useUrlState(filmographyUrlQuery, { history: 'push' })

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
