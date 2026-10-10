import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { cache } from 'react'
import { ActionGroup } from '@/components/ActionGroup'
import { Empty } from '@/components/Empty'
import { MovieCard } from '@/components/Movies/MovieCard'
import { DeletePersonDialog } from '@/components/People/DeletePersonDialog'
import { Headshot } from '@/components/People/Headshot'
import { personPath, ROUTE_PEOPLE } from '@/lib/constants-routes'
import { creditRoleLabel, summarizeFilmography } from '@/lib/creditRoles'
import { loadPage } from '@/lib/data/page'
import { getPersonBySlug } from '@/lib/data/people'
import { formatDate } from '@/lib/formatDate'
import styles from './styles.module.scss'

/** Roughly the first two rows on a wide screen: their posters load eagerly. */
const EAGER_POSTERS = 8

// `generateMetadata` and the page read the same person: one DAL call per request.
const loadPerson = cache((slug: string) => loadPage(() => getPersonBySlug(slug), personPath(slug)))

export const generateMetadata = async ({
  params,
}: PageProps<'/people/[slug]'>): Promise<Metadata> => {
  const { slug } = await params
  const person = await loadPerson(slug)
  return { title: person.name }
}

const PersonPage = async ({ params }: PageProps<'/people/[slug]'>) => {
  const { slug } = await params
  const person = await loadPerson(slug)
  const summary = summarizeFilmography(person.filmography)
  // The DAL refuses to delete someone with credits, so the action is only offered without any.
  const canDelete = person.permissions.delete && person.filmography.length === 0

  return (
    <article className={styles.page}>
      <Link href={ROUTE_PEOPLE} className={styles.back}>
        <ArrowLeft aria-hidden="true" />
        All people
      </Link>

      <header className={styles.header}>
        <Headshot person={person} size="lg" />
        <div className={styles.headerText}>
          <div className={styles.topline}>
            {summary ? <p className={styles.eyebrow}>{summary}</p> : null}
            {canDelete ? (
              <ActionGroup label="Person actions">
                <DeletePersonDialog person={{ id: person.id, name: person.name }} />
              </ActionGroup>
            ) : null}
          </div>
          <h1 className={styles.name}>{person.name}</h1>
          {person.birthDate ? (
            <p className={styles.born}>
              Born{' '}
              <time dateTime={person.birthDate.toISOString().slice(0, 10)}>
                {formatDate(person.birthDate)}
              </time>
            </p>
          ) : null}
          {person.bio ? (
            <p className={styles.bio}>{person.bio}</p>
          ) : (
            <p className={styles.empty}>No biography yet.</p>
          )}
        </div>
      </header>

      <section className={styles.section} aria-labelledby="filmography-heading">
        <h2 id="filmography-heading" className={styles.sectionTitle}>
          Filmography
        </h2>
        {person.filmography.length === 0 ? (
          <Empty
            title="No credits yet"
            description="Films appear here once this person is credited on one."
          />
        ) : (
          <ul className={styles.grid}>
            {person.filmography.map((movie, index) => (
              <li key={movie.id}>
                <MovieCard
                  movie={movie}
                  priority={index < EAGER_POSTERS}
                  details={movie.roles.map(creditRoleLabel)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  )
}

export default PersonPage
