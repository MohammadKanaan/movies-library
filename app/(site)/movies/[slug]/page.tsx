import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { cache } from 'react'
import { DeleteMovieDialog } from '@/components/Movies/DeleteMovieDialog'
import { GenreTags } from '@/components/Movies/GenreTags'
import { MoviePoster } from '@/components/Movies/MoviePoster'
import { moviePath, ROUTE_MOVIES } from '@/lib/constants-routes'
import { getMovieBySlug } from '@/lib/data/movies'
import { loadPage } from '@/lib/data/page'
import type { PersonSummary } from '@/lib/dto/people'
import { formatDate } from '@/lib/formatDate'
import { formatRuntime } from '@/lib/formatRuntime'
import { getInitials } from '@/lib/getInitials'
import styles from './styles.module.scss'

// `generateMetadata` and the page read the same movie: one DAL call per request.
const loadMovie = cache((slug: string) => loadPage(() => getMovieBySlug(slug), moviePath(slug)))

const joinNames = (people: PersonSummary[]) => people.map((person) => person.name).join(', ')

export const generateMetadata = async ({
  params,
}: PageProps<'/movies/[slug]'>): Promise<Metadata> => {
  const { slug } = await params
  const movie = await loadMovie(slug)
  return { title: `${movie.title} (${movie.releaseDate.getUTCFullYear()})` }
}

const MoviePage = async ({ params }: PageProps<'/movies/[slug]'>) => {
  const { slug } = await params
  const movie = await loadMovie(slug)
  const { directors, writers, cast } = movie.credits
  const meta = [
    String(movie.releaseDate.getUTCFullYear()),
    movie.runtimeMinutes === null ? null : formatRuntime(movie.runtimeMinutes),
  ].filter((part) => part !== null)

  return (
    <article className={styles.page}>
      {/* Always dark: the hero sits on the poster's blurred colours, in either theme. */}
      <section className={`dark ${styles.hero}`}>
        {movie.posterUrl ? (
          <div className={styles.backdrop} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element -- the poster's own URL, already loading */}
            <img src={movie.posterUrl} alt="" />
          </div>
        ) : null}

        <div className={styles.heroInner}>
          <Link href={ROUTE_MOVIES} className={styles.back}>
            <ArrowLeft aria-hidden="true" />
            All movies
          </Link>

          <div className={styles.heroGrid}>
            <div className={styles.heroPoster}>
              <MoviePoster movie={movie} priority />
            </div>

            <div className={styles.heroText}>
              <p className={styles.eyebrow}>{meta.join(' · ')}</p>
              <h1 className={styles.title}>{movie.title}</h1>
              {directors.length > 0 ? (
                <p className={styles.byline}>
                  Directed by <strong>{joinNames(directors)}</strong>
                </p>
              ) : null}
              <GenreTags genres={movie.genres} />
              {movie.permissions.delete ? (
                <div className={styles.actions}>
                  <DeleteMovieDialog movie={{ id: movie.id, title: movie.title }} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className={styles.body}>
        {movie.synopsis ? (
          <p className={styles.synopsis}>{movie.synopsis}</p>
        ) : (
          <p className={styles.synopsisEmpty}>No synopsis yet.</p>
        )}

        {cast.length > 0 ? (
          <section className={styles.section} aria-labelledby="cast-heading">
            <h2 id="cast-heading" className={styles.sectionTitle}>
              Cast
            </h2>
            <ol className={styles.rail}>
              {cast.map((person, index) => (
                <li key={person.id} className={styles.railItem}>
                  <span className={styles.avatar} aria-hidden="true">
                    {getInitials(person.name)}
                  </span>
                  <span className={styles.railName}>{person.name}</span>
                  <span className={styles.railBilling}>
                    {index === 0 ? 'Top billed' : `#${index + 1}`}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <section className={styles.section} aria-labelledby="details-heading">
          <h2 id="details-heading" className={styles.sectionTitle}>
            Details
          </h2>
          <dl className={styles.facts}>
            <div>
              <dt>Released</dt>
              <dd>
                <time dateTime={movie.releaseDate.toISOString().slice(0, 10)}>
                  {formatDate(movie.releaseDate)}
                </time>
              </dd>
            </div>
            {directors.length > 0 ? (
              <div>
                <dt>{directors.length > 1 ? 'Directors' : 'Director'}</dt>
                <dd>{joinNames(directors)}</dd>
              </div>
            ) : null}
            {writers.length > 0 ? (
              <div>
                <dt>{writers.length > 1 ? 'Writers' : 'Writer'}</dt>
                <dd>{joinNames(writers)}</dd>
              </div>
            ) : null}
            {movie.createdBy ? (
              <div>
                <dt>Added</dt>
                <dd>
                  {formatDate(movie.createdAt)} by {movie.createdBy.name}
                </dd>
              </div>
            ) : null}
          </dl>
        </section>
      </div>
    </article>
  )
}

export default MoviePage
