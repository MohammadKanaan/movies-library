'use client'

import Link from 'next/link'
import type { FormEvent } from 'react'
import { toast } from 'sonner'
import { createPersonAction, deletePersonAction, updatePersonAction } from '@/actions/people'
import { ActionGroup } from '@/components/ActionGroup'
import { ConfirmDialog } from '@/components/Admin/ConfirmDialog'
import { NameDialog } from '@/components/Admin/NameDialog'
import { Empty } from '@/components/Empty'
import { Input } from '@/components/Form/Input'
import { Pagination } from '@/components/Pagination'
import { Button } from '@/components/SCN/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/SCN/table'
import { useUrlState } from '@/hooks/useUrlState'
import { moviesByPersonPath } from '@/lib/constants-routes'
import type { Page } from '@/lib/dto/common'
import {
  PEOPLE_SEARCH_MAX_LENGTH,
  peopleUrlQuery,
  personInput,
  type PersonListItem,
} from '@/lib/dto/people'
import { formatDate } from '@/lib/formatDate'
import styles from './styles.module.scss'

type PeopleViewProps = {
  people: Page<PersonListItem>
}

/** People by name with their credit count: search in the URL, add, rename and delete through dialogs. */
export const PeopleView = ({ people }: PeopleViewProps) => {
  const { state, setState, isPending } = useUrlState(peopleUrlQuery)

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const q = new FormData(event.currentTarget).get('q')
    setState({ q: typeof q === 'string' ? q.trim() : '', page: 1 })
  }

  return (
    <div className={styles.view}>
      <div className={styles.toolbar}>
        {/* Remounted when the URL's search changes (back/forward), so the field follows it. */}
        <form key={state.q} className={styles.search} onSubmit={handleSearch} role="search">
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
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
        <NameDialog
          trigger="Add person"
          triggerVariant="default"
          triggerSize="default"
          title="Add a person"
          description="A director, writer or cast member. Their slug comes from the name."
          label="Name"
          schema={personInput}
          submitLabel="Add"
          onSubmit={createPersonAction}
          onDone={(person) => toast.success(`${person.name} added`)}
        />
      </div>

      {people.items.length === 0 ? (
        <Empty
          title="No people found"
          description={state.q ? 'No one matches your search.' : 'There is nobody yet.'}
        />
      ) : (
        <div className={styles.tableWrap} aria-busy={isPending || undefined}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className={styles.actionsHead}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {people.items.map((person) => {
                const credited = person.creditCount > 0
                return (
                  <TableRow key={person.id}>
                    <TableCell className={styles.name}>{person.name}</TableCell>
                    <TableCell>
                      <code className={styles.slug}>{person.slug}</code>
                    </TableCell>
                    <TableCell>
                      {credited ? (
                        <Link href={moviesByPersonPath(person.slug)} className={styles.countLink}>
                          {person.creditCount}
                        </Link>
                      ) : (
                        <span className={styles.zero}>0</span>
                      )}
                    </TableCell>
                    <TableCell className={styles.nowrap}>{formatDate(person.createdAt)}</TableCell>
                    <TableCell>
                      <ActionGroup label={`${person.name} actions`}>
                        <NameDialog
                          trigger={`Rename ${person.name}`}
                          triggerAction="edit"
                          title={`Rename ${person.name}`}
                          description="The slug, and so the person's links, stay the same."
                          label="Name"
                          schema={personInput}
                          defaultName={person.name}
                          submitLabel="Save"
                          onSubmit={(values) => updatePersonAction({ id: person.id, ...values })}
                          onDone={() => toast.success('Person renamed')}
                        />
                        <ConfirmDialog
                          trigger={`Delete ${person.name}`}
                          triggerAction="delete"
                          title={`Delete ${person.name}?`}
                          description="They are credited on nothing, so nothing else changes."
                          confirmLabel="Delete person"
                          disabled={credited}
                          triggerTitle={
                            credited ? 'Remove the person from their credits first' : undefined
                          }
                          onConfirm={() => deletePersonAction(person.id)}
                          onDone={() => toast.success(`${person.name} deleted`)}
                        />
                      </ActionGroup>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {people.totalPages > 1 && (
        <Pagination
          page={people.page}
          totalPages={people.totalPages}
          onPageChange={(page) => setState({ page })}
          disabled={isPending}
        />
      )}
    </div>
  )
}
