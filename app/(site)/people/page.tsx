import type { Metadata } from 'next'
import { Empty } from '@/components/Empty'
import { PageHeader } from '@/components/PageHeader'
import { PersonCard } from '@/components/People/PersonCard'
import { ROUTE_PEOPLE } from '@/lib/constants-routes'
import { loadPage } from '@/lib/data/page'
import { listPeople } from '@/lib/data/people'
import { peopleUrlQuery } from '@/lib/dto/people'
import { toScalarParams } from '@/lib/searchParams'
import { PeopleView } from './view'
import styles from './styles.module.scss'

/** Divides evenly into rows of 2, 3, 4 and 6. */
const PER_PAGE = 36

export const metadata: Metadata = {
  title: 'People',
}

const PeoplePage = async ({ searchParams }: PageProps<'/people'>) => {
  // A garbled URL falls back to the defaults; an empty search is left out of the query.
  const { q, page } = peopleUrlQuery.parse(toScalarParams(await searchParams))
  const people = await loadPage(
    () => listPeople({ page, perPage: PER_PAGE, q: q || undefined }),
    ROUTE_PEOPLE,
  )
  const count = `${people.totalItems} ${people.totalItems === 1 ? 'person' : 'people'}`

  return (
    <div className={styles.page}>
      <PageHeader
        title="People"
        description={
          q
            ? `${count} matching “${q}”.`
            : 'Everyone credited in the catalog: directors, writers and cast.'
        }
      />
      <PeopleView page={people.page} totalPages={people.totalPages}>
        {people.items.length === 0 ? (
          <Empty
            title={q ? 'No one matches your search' : 'No people yet'}
            description={
              q
                ? 'Try part of a first or last name.'
                : 'People appear here once an admin adds them.'
            }
          />
        ) : (
          <ul className={styles.grid}>
            {people.items.map((person) => (
              <li key={person.id}>
                <PersonCard person={person} />
              </li>
            ))}
          </ul>
        )}
      </PeopleView>
    </div>
  )
}

export default PeoplePage
