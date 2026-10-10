import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { ROUTE_ADMIN_MOVIE_NEW, ROUTE_ADMIN_MOVIES } from '@/lib/constants-routes'
import { requireAdmin } from '@/lib/data/auth'
import { listGenres } from '@/lib/data/genres'
import { loadPage } from '@/lib/data/page'
import { NewMovieView } from './view'
import styles from './styles.module.scss'

export const metadata: Metadata = {
  title: 'New movie · Admin',
}

const AdminNewMoviePage = async () => {
  // The genre list is public; the page is not, so the admin check comes first.
  const genres = await loadPage(async () => {
    await requireAdmin()
    return listGenres()
  }, ROUTE_ADMIN_MOVIE_NEW)

  return (
    <div className={styles.page}>
      <Link href={ROUTE_ADMIN_MOVIES} className={styles.back}>
        <ArrowLeft aria-hidden="true" />
        All movies
      </Link>
      <PageHeader
        title="New movie"
        description="Save the movie first; its poster is added on the edit page."
      />
      <NewMovieView genres={genres} />
    </div>
  )
}

export default AdminNewMoviePage
