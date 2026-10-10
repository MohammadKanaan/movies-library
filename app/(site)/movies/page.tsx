import type { Metadata } from 'next'
import { ButtonLink } from '@/components/ButtonLink'
import { Empty } from '@/components/Empty'
import { MovieCard } from '@/components/Movies/MovieCard'
import { PageHeader } from '@/components/PageHeader'
import { ROUTE_MOVIES } from '@/lib/constants-routes'
import { listMovies } from '@/lib/data/movies'
import { loadPage } from '@/lib/data/page'
import { moviesUrlQuery } from '@/lib/dto/movies'
import { toScalarParams } from '@/lib/searchParams'
import { MoviesView } from './view'
import styles from './styles.module.scss'

/** Divides evenly into rows of 2, 3, 4 and 6. */
const PER_PAGE = 24
/** Roughly the first two rows on a wide screen: their posters load eagerly. */
const EAGER_POSTERS = 8

export const metadata: Metadata = {
  title: 'Movies',
}

const MoviesPage = async ({ searchParams }: PageProps<'/movies'>) => {
  // A garbled URL falls back to the defaults; empty filters are left out of the query.
  const { q, genre, person, ...query } = moviesUrlQuery.parse(toScalarParams(await searchParams))
  const movies = await loadPage(
    () =>
      listMovies({
        ...query,
        perPage: PER_PAGE,
        q: q || undefined,
        genre: genre || undefined,
        person: person || undefined,
      }),
    ROUTE_MOVIES,
  )

  // The filter's display name comes from the movies it matched; an empty result shows the slug.
  const genreName = genre
    ? (movies.items.flatMap((movie) => movie.genres).find((item) => item.slug === genre)?.name ??
      genre)
    : null

  return (
    <div className={styles.page}>
      <PageHeader
        title={genreName ?? 'Movies'}
        description={
          genreName
            ? `${movies.totalItems} ${movies.totalItems === 1 ? 'film' : 'films'} in this genre.`
            : 'Every film in the catalog, newest release first.'
        }
        actions={
          genreName ? (
            <ButtonLink href={ROUTE_MOVIES} variant="outline">
              All movies
            </ButtonLink>
          ) : null
        }
      />
      <MoviesView page={movies.page} totalPages={movies.totalPages}>
        {movies.items.length === 0 ? (
          <Empty
            title={genreName ? 'No movies in this genre' : 'No movies yet'}
            description={
              genreName
                ? 'Try another genre, or browse the whole catalog.'
                : 'Movies appear here once an admin adds them.'
            }
          />
        ) : (
          <ul className={styles.grid}>
            {movies.items.map((movie, index) => (
              <li key={movie.id}>
                <MovieCard movie={movie} priority={index < EAGER_POSTERS} />
              </li>
            ))}
          </ul>
        )}
      </MoviesView>
    </div>
  )
}

export default MoviesPage
