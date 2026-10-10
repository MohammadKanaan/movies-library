import type { Metadata } from 'next'
import { MoviesView } from '@/components/Admin/Movies/MoviesView'
import { PageHeader } from '@/components/PageHeader'
import { ROUTE_ADMIN_MOVIES } from '@/lib/constants-routes'
import { requireAdmin } from '@/lib/data/auth'
import { listGenres } from '@/lib/data/genres'
import { listMovies } from '@/lib/data/movies'
import { loadPage } from '@/lib/data/page'
import { moviesUrlQuery } from '@/lib/dto/movies'
import { toScalarParams } from '@/lib/searchParams'
import styles from './styles.module.scss'

const PER_PAGE = 20

export const metadata: Metadata = {
  title: 'Movies · Admin',
}

const AdminMoviesPage = async ({ searchParams }: PageProps<'/admin/movies'>) => {
  // A garbled URL falls back to the defaults; empty filters are left out of the query.
  const { page, q, genre, person, sort } = moviesUrlQuery.parse(toScalarParams(await searchParams))
  const { movies, genres } = await loadPage(async () => {
    // The movie and genre lists are public reads; the page is not, so the admin check comes first.
    await requireAdmin()
    const [movies, genres] = await Promise.all([
      listMovies({
        page,
        perPage: PER_PAGE,
        q: q || undefined,
        genre: genre || undefined,
        person: person || undefined,
        sort,
      }),
      listGenres(),
    ])
    return { movies, genres }
  }, ROUTE_ADMIN_MOVIES)

  return (
    <div className={styles.page}>
      <PageHeader
        title="Movies"
        description={`${movies.totalItems} ${movies.totalItems === 1 ? 'film' : 'films'} in the catalog.`}
      />
      <MoviesView movies={movies} genres={genres} />
    </div>
  )
}

export default AdminMoviesPage
