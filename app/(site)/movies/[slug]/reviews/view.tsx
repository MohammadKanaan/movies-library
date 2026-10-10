'use client'

import type { ReactNode } from 'react'
import { Pagination } from '@/components/Pagination'
import { useUrlState } from '@/hooks/useUrlState'
import { reviewsUrlQuery } from '@/lib/dto/reviews'
import styles from './styles.module.scss'

type ReviewsViewProps = {
  page: number
  totalPages: number
  /** The server-rendered list of reviews. */
  children: ReactNode
}

/** The list's one interactive part: paging, through the URL. */
export const ReviewsView = ({ page, totalPages, children }: ReviewsViewProps) => {
  const { setState, isPending } = useUrlState(reviewsUrlQuery, { history: 'push' })

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
