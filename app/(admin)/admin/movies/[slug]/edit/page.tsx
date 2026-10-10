import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { cache } from 'react'
import { ActionLink } from '@/components/ActionLink'
import { PageHeader } from '@/components/PageHeader'
import { adminMovieEditPath, moviePath, ROUTE_ADMIN_MOVIES } from '@/lib/constants-routes'
import { requireAdmin } from '@/lib/data/auth'
import { listGenres } from '@/lib/data/genres'
import { getMovieBySlug } from '@/lib/data/movies'
import { loadPage } from '@/lib/data/page'
import { canUpload } from '@/lib/data/uploads'
import { EditMovieView } from './view'
import styles from './styles.module.scss'

// `generateMetadata` and the page read the same movie: one DAL call per request. The movie read is
// public, so the admin check comes first.
const loadMovie = cache((slug: string) =>
  loadPage(async () => {
    await requireAdmin()
    return Promise.all([getMovieBySlug(slug), listGenres()])
  }, adminMovieEditPath(slug)),
)

export const generateMetadata = async ({
  params,
}: PageProps<'/admin/movies/[slug]/edit'>): Promise<Metadata> => {
  const { slug } = await params
  const [movie] = await loadMovie(slug)
  return { title: `Edit ${movie.title} · Admin` }
}

const AdminEditMoviePage = async ({ params }: PageProps<'/admin/movies/[slug]/edit'>) => {
  const { slug } = await params
  const [movie, genres] = await loadMovie(slug)

  return (
    <div className={styles.page}>
      <Link href={ROUTE_ADMIN_MOVIES} className={styles.back}>
        <ArrowLeft aria-hidden="true" />
        All movies
      </Link>
      <PageHeader
        title={movie.title}
        description={`${movie.releaseDate.getUTCFullYear()} · slug ${movie.slug}`}
        actions={<ActionLink action="view" label="View on site" href={moviePath(movie.slug)} />}
      />
      <EditMovieView movie={movie} genres={genres} canUpload={canUpload()} />
    </div>
  )
}

export default AdminEditMoviePage
