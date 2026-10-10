'use client'

import Link from 'next/link'
import type { FormEvent } from 'react'
import { toast } from 'sonner'
import { deleteMovieAction } from '@/actions/movies'
import { ConfirmDialog } from '@/components/Admin/ConfirmDialog'
import { ButtonLink } from '@/components/ButtonLink'
import { Empty } from '@/components/Empty'
import { Input } from '@/components/Form/Input'
import { Pagination } from '@/components/Pagination'
import { Button } from '@/components/SCN/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/SCN/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/SCN/table'
import { useUrlState } from '@/hooks/useUrlState'
import { adminMovieEditPath, moviePath, ROUTE_ADMIN_MOVIE_NEW } from '@/lib/constants-routes'
import type { Page } from '@/lib/dto/common'
import type { GenreWithCount } from '@/lib/dto/genres'
import {
  EMPTY_MOVIE_FILTERS,
  hasMovieFilters,
  MOVIE_SEARCH_MAX_LENGTH,
  moviesUrlQuery,
  movieSortSchema,
  type MovieSort,
  type MovieSummary,
} from '@/lib/dto/movies'
import { formatDate } from '@/lib/formatDate'
import { formatRuntime } from '@/lib/formatRuntime'
import styles from './styles.module.scss'

type MoviesViewProps = {
  movies: Page<MovieSummary>
  /** Every genre, for the filter. */
  genres: GenreWithCount[]
}

const SORT_LABELS: Record<MovieSort, string> = {
  added: 'Recently added',
  newest: 'Newest release',
  oldest: 'Oldest release',
  title: 'Title A–Z',
}

const toSort = (value: string | null): MovieSort => {
  const sort = movieSortSchema.safeParse(value)
  return sort.success ? sort.data : 'newest'
}

/** The movie list: search, genre filter and sort in the URL, edit / view / delete per row. */
export const MoviesView = ({ movies, genres }: MoviesViewProps) => {
  const { state, setState, isPending } = useUrlState(moviesUrlQuery)
  const isFiltered = hasMovieFilters(state)
  // The admin list filters by one genre at a time; the public list's URL can name several.
  const genre = state.genres[0] ?? ''
  const genreItems: Record<string, string> = {
    '': 'All genres',
    ...Object.fromEntries(genres.map((genre) => [genre.slug, genre.name])),
  }

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
              label="Search movies"
              placeholder="Title"
              defaultValue={state.q}
              maxLength={MOVIE_SEARCH_MAX_LENGTH}
            />
          </div>
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
        <div className={styles.filters}>
          <Select
            items={genreItems}
            value={genre}
            onValueChange={(value) => setState({ genres: value ? [value] : [], page: 1 })}
          >
            <SelectTrigger aria-label="Genre">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(genreItems).map(([slug, name]) => (
                <SelectItem key={slug} value={slug}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            items={SORT_LABELS}
            value={state.sort}
            onValueChange={(value) => setState({ sort: toSort(value), page: 1 })}
          >
            <SelectTrigger aria-label="Sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SORT_LABELS) as MovieSort[]).map((sort) => (
                <SelectItem key={sort} value={sort}>
                  {SORT_LABELS[sort]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isFiltered && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setState({ ...EMPTY_MOVIE_FILTERS, page: 1 })}
            >
              Clear filters
            </Button>
          )}
        </div>
        <ButtonLink href={ROUTE_ADMIN_MOVIE_NEW}>Add movie</ButtonLink>
      </div>

      {movies.items.length === 0 ? (
        <Empty
          title="No movies found"
          description={isFiltered ? 'No movie matches your filters.' : 'Add the first movie.'}
          action={
            isFiltered ? undefined : <ButtonLink href={ROUTE_ADMIN_MOVIE_NEW}>Add movie</ButtonLink>
          }
        />
      ) : (
        <div className={styles.tableWrap} aria-busy={isPending || undefined}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Poster</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Genres</TableHead>
                <TableHead>Runtime</TableHead>
                <TableHead>Released</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movies.items.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell>
                    <span className={styles.thumb}>
                      {movie.posterUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- a public bucket URL
                        <img src={movie.posterUrl} alt="" loading="lazy" decoding="async" />
                      ) : null}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className={styles.titleCell}>
                      <Link href={adminMovieEditPath(movie.slug)} className={styles.titleLink}>
                        {movie.title}
                      </Link>
                      <span className={styles.muted}>{movie.releaseDate.getUTCFullYear()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {movie.genres.length > 0 ? (
                      movie.genres.map((genre) => genre.name).join(', ')
                    ) : (
                      <span className={styles.muted}>None</span>
                    )}
                  </TableCell>
                  <TableCell className={styles.nowrap}>
                    {movie.runtimeMinutes === null ? (
                      <span className={styles.muted}>—</span>
                    ) : (
                      formatRuntime(movie.runtimeMinutes)
                    )}
                  </TableCell>
                  <TableCell className={styles.nowrap}>{formatDate(movie.releaseDate)}</TableCell>
                  <TableCell>
                    <div className={styles.actions}>
                      <ButtonLink href={adminMovieEditPath(movie.slug)} variant="outline" size="sm">
                        Edit
                      </ButtonLink>
                      <ButtonLink href={moviePath(movie.slug)} variant="ghost" size="sm">
                        View
                      </ButtonLink>
                      <ConfirmDialog
                        trigger="Delete"
                        title={`Delete ${movie.title}?`}
                        description="Its credits and genre links go with it. The people and genres stay in the catalog."
                        confirmLabel="Delete movie"
                        onConfirm={() => deleteMovieAction(movie.id)}
                        onDone={() => toast.success(`${movie.title} was deleted`)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {movies.totalPages > 1 && (
        <Pagination
          page={movies.page}
          totalPages={movies.totalPages}
          onPageChange={(page) => setState({ page })}
          disabled={isPending}
        />
      )}
    </div>
  )
}
