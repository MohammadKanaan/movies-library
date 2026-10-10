'use client'

import type { FormEvent, ReactNode } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/Form/Input'
import { Pagination } from '@/components/Pagination'
import { Button } from '@/components/SCN/button'
import { useUrlState } from '@/hooks/useUrlState'
import { PEOPLE_SEARCH_MAX_LENGTH, peopleUrlQuery } from '@/lib/dto/people'
import styles from './styles.module.scss'

type PeopleViewProps = {
  page: number
  totalPages: number
  /** The server-rendered grid. */
  children: ReactNode
}

/** The list's interactive parts: the name search and paging, both through the URL. */
export const PeopleView = ({ page, totalPages, children }: PeopleViewProps) => {
  const { state, setState, isPending } = useUrlState(peopleUrlQuery, { history: 'push' })

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const q = new FormData(event.currentTarget).get('q')
    setState({ q: typeof q === 'string' ? q.trim() : '', page: 1 })
  }

  return (
    <div className={styles.view}>
      {/* Remounted when the URL's search changes (back/forward), so the field follows it. */}
      <form
        key={state.q}
        className={styles.search}
        onSubmit={handleSearch}
        role="search"
        aria-label="People"
      >
        <div className={styles.searchField}>
          <Input
            name="q"
            type="search"
            label="Search people"
            placeholder="At least three letters of a name"
            defaultValue={state.q}
            maxLength={PEOPLE_SEARCH_MAX_LENGTH}
          />
        </div>
        <Button type="submit" variant="secondary" size="icon" aria-label="Search">
          <Search aria-hidden="true" />
        </Button>
      </form>
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
