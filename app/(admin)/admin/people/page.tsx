import type { Metadata } from 'next'
import { PeopleView } from '@/components/Admin/People/PeopleView'
import { PageHeader } from '@/components/PageHeader'
import { ROUTE_ADMIN_PEOPLE } from '@/lib/constants-routes'
import { requireAdmin } from '@/lib/data/auth'
import { loadPage } from '@/lib/data/page'
import { listPeople } from '@/lib/data/people'
import { canUpload } from '@/lib/data/uploads'
import { peopleUrlQuery } from '@/lib/dto/people'
import { toScalarParams } from '@/lib/searchParams'
import styles from './styles.module.scss'

const PER_PAGE = 20

export const metadata: Metadata = {
  title: 'People · Admin',
}

const AdminPeoplePage = async ({ searchParams }: PageProps<'/admin/people'>) => {
  // A garbled URL falls back to the defaults; an empty search is left out of the query.
  const { q, page } = peopleUrlQuery.parse(toScalarParams(await searchParams))
  // The people list is public; the page is not, so the admin check comes first.
  const people = await loadPage(async () => {
    await requireAdmin()
    return listPeople({ page, perPage: PER_PAGE, q: q || undefined })
  }, ROUTE_ADMIN_PEOPLE)

  return (
    <div className={styles.page}>
      <PageHeader
        title="People"
        description={`${people.totalItems} ${people.totalItems === 1 ? 'person' : 'people'} in the catalog. Someone with credits cannot be deleted.`}
      />
      <PeopleView people={people} canUpload={canUpload()} />
    </div>
  )
}

export default AdminPeoplePage
