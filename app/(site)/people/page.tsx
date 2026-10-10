import type { Metadata } from 'next'
import { Empty } from '@/components/Empty'
import { PageHeader } from '@/components/PageHeader'
import { PersonCard } from '@/components/People/PersonCard'
import { ROUTE_PEOPLE } from '@/lib/constants-routes'
import { loadPage } from '@/lib/data/page'
import { listPeople } from '@/lib/data/people'
import { peopleUrlQuery } from '@/lib/dto/people'
import { toScalarParams } from '@/lib/searchParams'
import { NO_INDEX, pagedPath, pagedTitle } from '@/lib/seo'
import { PeopleView } from './view'
import styles from './styles.module.scss'

/** Divides evenly into rows of 2, 3, 4 and 6. */
const PER_PAGE = 36

const DESCRIPTION = 'Everyone credited in the catalog: directors, writers and cast.'

/** The list is indexed page by page; a name search is a slice of it and is not. */
export const generateMetadata = async ({
  searchParams,
}: PageProps<'/people'>): Promise<Metadata> => {
  const { q, page } = peopleUrlQuery.parse(toScalarParams(await searchParams))
  return {
    title: pagedTitle('People', page),
    description: DESCRIPTION,
    ...(q ? { robots: NO_INDEX } : { alternates: { canonical: pagedPath(ROUTE_PEOPLE, page) } }),
  }
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
      <PageHeader title="People" description={q ? `${count} matching “${q}”.` : DESCRIPTION} />
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
