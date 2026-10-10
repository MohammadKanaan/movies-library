'use client'
// React Hook Form's `register()` must run on every render; the React Compiler would cache it.
'use no memo'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createGenreAction, deleteGenreAction, updateGenreAction } from '@/actions/genres'
import { ActionGroup } from '@/components/ActionGroup'
import { ConfirmDialog } from '@/components/Admin/ConfirmDialog'
import { NameDialog } from '@/components/Admin/NameDialog'
import { SortableTableHead } from '@/components/Admin/SortableTableHead'
import { Empty } from '@/components/Empty'
import { Input } from '@/components/Form/Input'
import { LoadingButton } from '@/components/LoadingButton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/SCN/table'
import { moviesByGenrePath } from '@/lib/constants-routes'
import type { SortDirection } from '@/lib/dto/common'
import { genreInput, type GenreInput, type GenreWithCount } from '@/lib/dto/genres'
import { applyActionErrors } from '@/lib/formErrors'
import styles from './styles.module.scss'

type GenresViewProps = {
  genres: GenreWithCount[]
}

/** Every genre with how many movies carry it; add inline, rename and delete through dialogs. */
export const GenresView = ({ genres }: GenresViewProps) => {
  const [sort, setSort] = useState<{
    by: keyof Pick<GenreWithCount, 'name' | 'slug' | 'movieCount'>
    direction: SortDirection
  }>({ by: 'name', direction: 'asc' })
  // This list contains every genre, so sorting locally covers the complete result set.
  const sortedGenres = genres.toSorted((a, b) => {
    const left = a[sort.by]
    const right = b[sort.by]
    const comparison =
      typeof left === 'number' && typeof right === 'number'
        ? left - right
        : String(left).localeCompare(String(right))
    return (sort.direction === 'asc' ? comparison : -comparison) || a.id.localeCompare(b.id)
  })
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GenreInput>({ resolver: zodResolver(genreInput), defaultValues: { name: '' } })

  const add = handleSubmit(async (values) => {
    const result = await createGenreAction(values)
    if (result.ok) {
      toast.success(`${result.data.name} added`)
      reset()
      return
    }
    applyActionErrors(result, ['name'], setError)
  })

  return (
    <div className={styles.view}>
      <form className={styles.addForm} onSubmit={add} noValidate>
        <div className={styles.addField}>
          <Input
            label="New genre"
            placeholder="Western"
            error={errors.name?.message}
            {...register('name')}
          />
        </div>
        <LoadingButton type="submit" icon={Plus} loading={isSubmitting}>
          Add genre
        </LoadingButton>
        {errors.root?.server && (
          <p className={styles.formError} role="alert">
            {errors.root.server.message}
          </p>
        )}
      </form>

      {genres.length === 0 ? (
        <Empty title="No genres yet" description="Add the first one above." />
      ) : (
        <div className={styles.tableWrap}>
          <Table>
            <TableHeader>
              <TableRow>
                <SortableTableHead
                  direction={sort.by === 'name' ? sort.direction : undefined}
                  onSort={(direction) => setSort({ by: 'name', direction })}
                >
                  Name
                </SortableTableHead>
                <SortableTableHead
                  className={styles.secondary}
                  direction={sort.by === 'slug' ? sort.direction : undefined}
                  onSort={(direction) => setSort({ by: 'slug', direction })}
                >
                  Slug
                </SortableTableHead>
                <SortableTableHead
                  direction={sort.by === 'movieCount' ? sort.direction : undefined}
                  onSort={(direction) => setSort({ by: 'movieCount', direction })}
                >
                  Movies
                </SortableTableHead>
                <TableHead className={styles.actionsHead}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedGenres.map((genre) => {
                const inUse = genre.movieCount > 0
                return (
                  <TableRow key={genre.id}>
                    <TableCell className={styles.name}>{genre.name}</TableCell>
                    <TableCell className={styles.secondary}>
                      <code className={styles.slug}>{genre.slug}</code>
                    </TableCell>
                    <TableCell>
                      {inUse ? (
                        <Link href={moviesByGenrePath(genre.slug)} className={styles.countLink}>
                          {genre.movieCount}
                        </Link>
                      ) : (
                        <span className={styles.zero}>0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <ActionGroup label={`${genre.name} actions`}>
                        <NameDialog
                          trigger={`Rename ${genre.name}`}
                          triggerAction="edit"
                          title={`Rename ${genre.name}`}
                          description="The slug, and so the genre's links, stay the same."
                          label="Name"
                          schema={genreInput}
                          defaultName={genre.name}
                          submitLabel="Save"
                          onSubmit={(values) => updateGenreAction({ id: genre.id, ...values })}
                          onDone={() => toast.success('Genre renamed')}
                        />
                        <ConfirmDialog
                          trigger={`Delete ${genre.name}`}
                          triggerAction="delete"
                          title={`Delete ${genre.name}?`}
                          description="Nothing carries this genre, so nothing else changes."
                          confirmLabel="Delete genre"
                          disabled={inUse}
                          triggerTitle={
                            inUse ? 'Remove the genre from its movies first' : undefined
                          }
                          onConfirm={() => deleteGenreAction(genre.id)}
                          onDone={() => toast.success(`${genre.name} deleted`)}
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
    </div>
  )
}
