import type { Metadata } from 'next'
import Link from 'next/link'
import { ButtonLink } from '@/components/ButtonLink'
import { Empty } from '@/components/Empty'
import { MoviePoster } from '@/components/Movies/MoviePoster'
import { PageHeader } from '@/components/PageHeader'
import { Headshot } from '@/components/People/Headshot'
import { ResultRow } from '@/components/Search/ResultRow'
import { SearchForm } from '@/components/Search/SearchForm'
import {
  moviePath,
  moviesByTitlePath,
  peopleByNamePath,
  personPath,
  searchPath,
} from '@/lib/constants-routes'
import { loadPage } from '@/lib/data/page'
import { searchCatalog } from '@/lib/data/search'
import { SEARCH_MIN_LENGTH } from '@/lib/dto/common'
import { isSearchable, searchUrlQuery } from '@/lib/dto/search'
import { toScalarParams } from '@/lib/searchParams'
import styles from './styles.module.scss'

/** How many movies and how many people the page shows; the lists have the rest. */
const RESULTS_PER_KIND = 10

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`

export const generateMetadata = async ({
  searchParams,
}: PageProps<'/search'>): Promise<Metadata> => {
  const { q } = searchUrlQuery.parse(toScalarParams(await searchParams))
  return { title: q ? `“${q}” · Search` : 'Search' }
}

/**
 * The "search all" page: the best movies and people for a term, each kind in its own section
 * with a link to the full filtered list, and scope links to search one kind only.
 */
const SearchPage = async ({ searchParams }: PageProps<'/search'>) => {
  const { q } = searchUrlQuery.parse(toScalarParams(await searchParams))
  const results = isSearchable(q)
    ? await loadPage(() => searchCatalog({ q, limit: RESULTS_PER_KIND }), searchPath(q))
    : null
  const found = results ? results.movies.totalItems + results.people.totalItems : 0

  return (
    <div className={styles.page}>
      <PageHeader
        title={results ? `Results for “${q}”` : 'Search'}
        description={
          results
            ? `${plural(found, 'match', 'matches')} across movies and people.`
            : 'Find a film by its title or a person by their name.'
        }
      />
      <SearchForm q={q} />

      {!results ? (
        q ? (
          <p className={styles.hint}>Type at least {SEARCH_MIN_LENGTH} characters to search.</p>
        ) : null
      ) : (
        <>
          <nav className={styles.scopes} aria-label="Search in">
            <span className={styles.scopeCurrent} aria-current="page">
              All <span className={styles.count}>{found}</span>
            </span>
            <Link href={moviesByTitlePath(q)} className={styles.scope}>
              Movies <span className={styles.count}>{results.movies.totalItems}</span>
            </Link>
            <Link href={peopleByNamePath(q)} className={styles.scope}>
              People <span className={styles.count}>{results.people.totalItems}</span>
            </Link>
          </nav>

          {found === 0 ? (
            <Empty
              title={`Nothing found for “${q}”`}
              description="Check the spelling, or try a shorter part of the title or name."
            />
          ) : null}

          {results.movies.totalItems > 0 ? (
            <section className={styles.section} aria-labelledby="movies-heading">
              <h2 id="movies-heading" className={styles.sectionTitle}>
                Movies
              </h2>
              <ul className={styles.list}>
                {results.movies.items.map((movie) => (
                  <li key={movie.id}>
                    <ResultRow
                      href={moviePath(movie.slug)}
                      media={<MoviePoster movie={movie} />}
                      title={movie.title}
                      details={[
                        String(movie.releaseDate.getUTCFullYear()),
                        ...movie.genres.slice(0, 3).map((genre) => genre.name),
                      ]}
                    />
                  </li>
                ))}
              </ul>
              {results.movies.totalItems > results.movies.items.length ? (
                <ButtonLink href={moviesByTitlePath(q)} variant="outline">
                  See all {plural(results.movies.totalItems, 'movie', 'movies')}
                </ButtonLink>
              ) : null}
            </section>
          ) : null}

          {results.people.totalItems > 0 ? (
            <section className={styles.section} aria-labelledby="people-heading">
              <h2 id="people-heading" className={styles.sectionTitle}>
                People
              </h2>
              <ul className={styles.list}>
                {results.people.items.map((person) => (
                  <li key={person.id}>
                    <ResultRow
                      href={personPath(person.slug)}
                      media={<Headshot person={person} size="sm" />}
                      title={person.name}
                      details={[plural(person.creditCount, 'credit', 'credits')]}
                    />
                  </li>
                ))}
              </ul>
              {results.people.totalItems > results.people.items.length ? (
                <ButtonLink href={peopleByNamePath(q)} variant="outline">
                  See all {plural(results.people.totalItems, 'person', 'people')}
                </ButtonLink>
              ) : null}
            </section>
          ) : null}
        </>
      )}
    </div>
  )
}

export default SearchPage
