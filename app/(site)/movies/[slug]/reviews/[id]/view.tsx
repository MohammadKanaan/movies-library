'use client'

import type { ReactNode } from 'react'
import { Pagination } from '@/components/Pagination'
import { useUrlState } from '@/hooks/useUrlState'
import { commentsUrlQuery } from '@/lib/dto/reviewComments'
import styles from './styles.module.scss'

type CommentsViewProps = {
  page: number
  totalPages: number
  /** The server-rendered list of comments. */
  children: ReactNode
}

/** The comment list's one interactive part: paging, through the URL. */
export const CommentsView = ({ page, totalPages, children }: CommentsViewProps) => {
  const { setState, isPending } = useUrlState(commentsUrlQuery, { history: 'push' })

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
