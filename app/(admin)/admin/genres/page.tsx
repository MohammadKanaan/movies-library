import type { Metadata } from 'next'
import { GenresView } from '@/components/Admin/Genres/GenresView'
import { PageHeader } from '@/components/PageHeader'
import { ROUTE_ADMIN_GENRES } from '@/lib/constants-routes'
import { requireAdmin } from '@/lib/data/auth'
import { listGenres } from '@/lib/data/genres'
import { loadPage } from '@/lib/data/page'
import styles from './styles.module.scss'

export const metadata: Metadata = {
  title: 'Genres · Admin',
}

const AdminGenresPage = async () => {
  // The genre list is public; the page is not, so the admin check comes first.
  const genres = await loadPage(async () => {
    await requireAdmin()
    return listGenres()
  }, ROUTE_ADMIN_GENRES)

  return (
    <div className={styles.page}>
      <PageHeader
        title="Genres"
        description="Every genre a movie can carry. A genre in use cannot be deleted."
      />
      <GenresView genres={genres} />
    </div>
  )
}

export default AdminGenresPage
