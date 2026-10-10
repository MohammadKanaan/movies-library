import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { cache } from 'react'
import { ActionGroup } from '@/components/ActionGroup'
import { ButtonLink } from '@/components/ButtonLink'
import { Empty } from '@/components/Empty'
import { JsonLd } from '@/components/JsonLd'
import { MovieCard } from '@/components/Movies/MovieCard'
import { DeletePersonDialog } from '@/components/People/DeletePersonDialog'
import { Headshot } from '@/components/People/Headshot'
import { PEOPLE_LIST_HIDDEN, personPath, ROUTE_PEOPLE_BACK } from '@/lib/constants-routes'
import { creditRoleLabel, summarizeFilmography } from '@/lib/creditRoles'
import { loadPage } from '@/lib/data/page'
import { getPersonBySlug, listFilmography } from '@/lib/data/people'
import { siteUrl } from '@/lib/data/site'
import { filmographyUrlQuery } from '@/lib/dto/people'
import { formatDate } from '@/lib/formatDate'
import { toScalarParams } from '@/lib/searchParams'
import { describePerson, pagedPath, pagedTitle, SITE_OPEN_GRAPH } from '@/lib/seo'
import { personJsonLd } from '@/lib/structuredData'
import { FilmographyView } from './view'
import styles from './styles.module.scss'

/** Roughly the first two rows on a wide screen: their posters load eagerly. */
const EAGER_POSTERS = 8
/** Four rows of the grid on a wide screen. */
const FILMS_PER_PAGE = 24

// `generateMetadata` and the page read the same person and the same page of films: one DAL call
// each per request.
const loadPerson = cache((slug: string) => loadPage(() => getPersonBySlug(slug), personPath(slug)))
const loadFilmography = cache((slug: string, page: number) =>
  loadPage(
    () => listFilmography({ personSlug: slug, page, perPage: FILMS_PER_PAGE }),
    pagedPath(personPath(slug), page),
  ),
)

export const generateMetadata = async ({
  params,
  searchParams,
}: PageProps<'/people/[slug]'>): Promise<Metadata> => {
  const { slug } = await params
  const { page } = filmographyUrlQuery.parse(toScalarParams(await searchParams))
  const [person, films] = await Promise.all([loadPerson(slug), loadFilmography(slug, page)])
  const path = personPath(slug)
  return {
    title: pagedTitle(person.name, page),
    description: describePerson(person, films.items),
    alternates: { canonical: pagedPath(path, page) },
    openGraph: {
      ...SITE_OPEN_GRAPH,
      type: 'profile',
      url: path,
      ...(person.headshotUrl ? { images: [{ url: person.headshotUrl, alt: person.name }] } : {}),
    },
  }
}

const PersonPage = async ({ params, searchParams }: PageProps<'/people/[slug]'>) => {
  const { slug } = await params
  // A garbled URL falls back to the first page.
  const { page } = filmographyUrlQuery.parse(toScalarParams(await searchParams))
  const [person, films] = await Promise.all([loadPerson(slug), loadFilmography(slug, page)])
  const summary = summarizeFilmography(person.roleCounts)
  // The DAL refuses to delete someone with credits, so the action is only offered without any.
  const canDelete = person.permissions.delete && films.totalItems === 0

  return (
    <article className={styles.page}>
      <JsonLd data={personJsonLd(person, siteUrl())} />
      <Link href={ROUTE_PEOPLE_BACK} className={styles.back}>
        <ArrowLeft aria-hidden="true" />
        {PEOPLE_LIST_HIDDEN ? 'All movies' : 'All people'}
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
        <FilmographyView page={films.page} totalPages={films.totalPages}>
          {films.items.length === 0 ? (
            <Empty
              title={page > 1 ? 'No films on this page' : 'No credits yet'}
              description={
                page > 1
                  ? 'The filmography has fewer pages than it did.'
                  : 'Films appear here once this person is credited on one.'
              }
              action={
                page > 1 ? (
                  <ButtonLink href={personPath(slug)} variant="outline">
                    First page
                  </ButtonLink>
                ) : undefined
              }
            />
          ) : (
            <ul className={styles.grid}>
              {films.items.map((movie, index) => (
                <li key={movie.id}>
                  <MovieCard
                    movie={movie}
                    priority={page === 1 && index < EAGER_POSTERS}
                    details={movie.roles.map(creditRoleLabel)}
                  />
                </li>
              ))}
            </ul>
          )}
        </FilmographyView>
      </section>
    </article>
  )
}

export default PersonPage
