import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { ButtonLink } from '@/components/ButtonLink'
import { Empty } from '@/components/Empty'
import { FanFavoritesGallery } from '@/components/Home/FanFavoritesGallery'
import { Shelf } from '@/components/Home/Shelf'
import { JsonLd } from '@/components/JsonLd'
import { MovieCard } from '@/components/Movies/MovieCard'
import { PersonCard } from '@/components/People/PersonCard'
import { ROUTE_HOME, ROUTE_MOVIES } from '@/lib/constants-routes'
import { getFanFavorites, getTrendingMovies, getTrendingPeople } from '@/lib/data/discover'
import { listMovies } from '@/lib/data/movies'
import { loadPage } from '@/lib/data/page'
import { siteUrl } from '@/lib/data/site'
import { FAN_FAVORITE_MIN_RATINGS } from '@/lib/dto/discover'
import { env } from '@/lib/env'
import { SITE_DESCRIPTION } from '@/lib/seo'
import { websiteJsonLd } from '@/lib/structuredData'
import styles from './styles.module.scss'

/** The first rows of the catalog: whole rows of 2, 3 or 4 (at 5 columns the shelf shows 10). */
const LATEST_MOVIES = 12

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  alternates: { canonical: ROUTE_HOME },
}

const HomePage = async () => {
  const { trendingMovies, fanFavorites, trendingPeople, latest } = await loadPage(async () => {
    const [trendingMovies, fanFavorites, trendingPeople, latest] = await Promise.all([
      getTrendingMovies(),
      getFanFavorites(),
      getTrendingPeople(),
      listMovies({ page: 1, perPage: LATEST_MOVIES, sort: 'newest' }),
    ])
    return { trendingMovies, fanFavorites, trendingPeople, latest }
  }, ROUTE_HOME)

  return (
    <div className={styles.page}>
      <JsonLd data={websiteJsonLd(siteUrl())} />
      {/* The NavBar already names the site; the heading is for assistive tech and search engines. */}
      <h1 className={styles.srOnly}>{env.appName}</h1>

      {/* A shelf with nothing on it (a new site, no reviews yet) is left out. */}
      {fanFavorites.length > 0 ? (
        <Shelf
          id="fan-favorites-heading"
          title="Fan favorites"
          description={`The best rated by viewers, among films with at least ${FAN_FAVORITE_MIN_RATINGS} ratings.`}
          layout="none"
          headingPosition="below"
        >
          <FanFavoritesGallery movies={fanFavorites} />
        </Shelf>
      ) : null}

      {trendingMovies.length > 0 ? (
        <Shelf
          id="trending-movies-heading"
          title="Trending movies"
          description="The films drawing the most reviews and comments this week."
        >
          {trendingMovies.map((movie) => (
            <li key={movie.id}>
              <MovieCard movie={movie} />
            </li>
          ))}
        </Shelf>
      ) : null}

      {trendingPeople.length > 0 ? (
        <Shelf
          id="trending-people-heading"
          title="Trending people"
          description="The directors and stars behind this week’s most talked-about films."
        >
          {trendingPeople.map((person) => (
            <li key={person.id}>
              <PersonCard person={person} />
            </li>
          ))}
        </Shelf>
      ) : null}

      {latest.items.length > 0 ? (
        <>
          <Shelf
            id="latest-movies-heading"
            title="Latest releases"
            description="The newest films in the catalog."
            layout="grid"
          >
            {latest.items.map((movie) => (
              <li key={movie.id}>
                <MovieCard movie={movie} />
              </li>
            ))}
          </Shelf>
          <div className={styles.more}>
            <ButtonLink href={ROUTE_MOVIES} size="lg">
              Browse all {plural(latest.totalItems, 'movie', 'movies')}
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </ButtonLink>
          </div>
        </>
      ) : (
        <Empty title="No movies yet" description="Movies appear here once an admin adds them." />
      )}
    </div>
  )
}

export default HomePage
