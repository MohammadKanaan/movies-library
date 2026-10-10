import type { Metadata } from 'next'
import { ButtonLink } from '@/components/ButtonLink'
import { Empty } from '@/components/Empty'
import { MovieCard } from '@/components/Movies/MovieCard'
import { PageHeader } from '@/components/PageHeader'
import { ROUTE_MOVIES } from '@/lib/constants-routes'
import { NotFoundError } from '@/lib/data/errors'
import { listGenres } from '@/lib/data/genres'
import { listMovies } from '@/lib/data/movies'
import { loadPage } from '@/lib/data/page'
import { getPersonSummaryBySlug } from '@/lib/data/people'
import { hasMovieFilters, moviesUrlQuery, toListMoviesQuery } from '@/lib/dto/movies'
import type { PersonSummary } from '@/lib/dto/people'
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

/** The person a `person` filter names, for the header and the chip; an unknown slug is no one. */
const findPerson = async (slug: string): Promise<PersonSummary | null> => {
  try {
    return await getPersonSummaryBySlug(slug)
  } catch (error) {
    if (error instanceof NotFoundError) {
      return null
    }
    throw error
  }
}

const plural = (count: number) => `${count} ${count === 1 ? 'film' : 'films'}`

const MoviesPage = async ({ searchParams }: PageProps<'/movies'>) => {
  // A garbled URL falls back to the defaults; empty filters are left out of the query.
  const url = moviesUrlQuery.parse(toScalarParams(await searchParams))
  const { movies, genres, person } = await loadPage(async () => {
    const [movies, genres, person] = await Promise.all([
      listMovies({ ...toListMoviesQuery(url), perPage: PER_PAGE }),
      listGenres(),
      url.person ? findPerson(url.person) : null,
    ])
    return { movies, genres, person }
  }, ROUTE_MOVIES)

  const filtered = hasMovieFilters(url)
  // A single genre or a single person is the page's subject; anything else is "your filters".
  const onlyGenre =
    url.genres.length === 1 && !hasMovieFilters({ ...url, genres: [] })
      ? genres.find((genre) => genre.slug === url.genres[0])
      : undefined
  const onlyPerson = person && !hasMovieFilters({ ...url, person: '' }) ? person : null
  const description = onlyGenre
    ? `${plural(movies.totalItems)} in this genre.`
    : onlyPerson
      ? `${plural(movies.totalItems)} credited to ${onlyPerson.name}.`
      : filtered
        ? `${plural(movies.totalItems)} match your filters.`
        : 'Every film in the catalog, newest release first.'

  return (
    <div className={styles.page}>
      <PageHeader
        title={onlyGenre?.name ?? 'Movies'}
        description={description}
        actions={
          filtered ? (
            <ButtonLink href={ROUTE_MOVIES} variant="outline">
              All movies
            </ButtonLink>
          ) : null
        }
      />
      <MoviesView page={movies.page} totalPages={movies.totalPages} genres={genres} person={person}>
        {movies.items.length === 0 ? (
          <Empty
            title={filtered ? 'No movies match' : 'No movies yet'}
            description={
              filtered
                ? 'Try fewer filters, or browse the whole catalog.'
                : 'Movies appear here once an admin adds them.'
            }
            action={
              filtered ? (
                <ButtonLink href={ROUTE_MOVIES} variant="outline">
                  All movies
                </ButtonLink>
              ) : undefined
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
