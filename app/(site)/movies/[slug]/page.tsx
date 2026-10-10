import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { cache, Fragment } from 'react'
import { ButtonLink } from '@/components/ButtonLink'
import { DeleteMovieDialog } from '@/components/Movies/DeleteMovieDialog'
import { GenreTags } from '@/components/Movies/GenreTags'
import { MoviePoster } from '@/components/Movies/MoviePoster'
import { Headshot } from '@/components/People/Headshot'
import { ReviewCard } from '@/components/Reviews/ReviewCard'
import { StarRating } from '@/components/Reviews/StarRating'
import { ViewerReview } from '@/components/Reviews/ViewerReview'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/SCN/tooltip'
import {
  loginPath,
  moviePath,
  movieReviewsPath,
  personPath,
  ROUTE_MOVIES,
} from '@/lib/constants-routes'
import { getMovieBySlug } from '@/lib/data/movies'
import { loadPage } from '@/lib/data/page'
import { getReviewSummary, getViewerReview, listReviews } from '@/lib/data/reviews'
import { getViewer } from '@/lib/data/users'
import type { PersonSummary } from '@/lib/dto/people'
import { viewerReviewUrlQuery, type RatingSummary } from '@/lib/dto/reviews'
import { formatDate } from '@/lib/formatDate'
import { formatRuntime } from '@/lib/formatRuntime'
import { toScalarParams } from '@/lib/searchParams'
import { presentMovieDetail, type SupportingCredit } from '@/presenters/movieDetail'
import styles from './styles.module.scss'

// `generateMetadata` and the page read the same movie: one DAL call per request.
const loadMovie = cache((slug: string) => loadPage(() => getMovieBySlug(slug), moviePath(slug)))

/**
 * Names as links to each person's page, separated by dots. Each dot travels with the name before
 * it, so a line break falls between names and never opens a line with a dot.
 */
const NameList = ({ people }: { people: PersonSummary[] }) =>
  people.map((person, index) => (
    <Fragment key={person.id}>
      {index > 0 ? ' ' : null}
      <span className={styles.nameItem}>
        <Link href={personPath(person.slug)} className={styles.name}>
          {person.name}
        </Link>
        {index < people.length - 1 ? (
          <span className={styles.dot} aria-hidden="true">
            {' ·'}
          </span>
        ) : null}
      </span>
    </Fragment>
  ))

/** How many of the newest reviews the page shows; the rest are on the reviews page. */
const LATEST_REVIEWS = 3

const ratingText = ({ average, count }: RatingSummary) =>
  average === null
    ? 'No ratings yet'
    : `${average} · ${count} ${count === 1 ? 'rating' : 'ratings'}`

const supportingTitle = (supporting: SupportingCredit[]) => {
  const hasCast = supporting.some((credit) => credit.role === 'cast')
  const hasWriters = supporting.some((credit) => credit.role === 'writer')
  if (hasCast && hasWriters) {
    return 'More cast & crew'
  }
  return hasCast ? 'More cast' : 'More writers'
}

export const generateMetadata = async ({
  params,
}: PageProps<'/movies/[slug]'>): Promise<Metadata> => {
  const { slug } = await params
  const movie = await loadMovie(slug)
  return { title: `${movie.title} (${movie.releaseDate.getUTCFullYear()})` }
}

const MoviePage = async ({ params, searchParams }: PageProps<'/movies/[slug]'>) => {
  const { slug } = await params
  // `editReviewPath` asks for the viewer's review on its form; a garbled query shows it as it is.
  const { edit } = viewerReviewUrlQuery.parse(toScalarParams(await searchParams))
  // The reviews are read by the movie's slug, so they load alongside the movie, not after it.
  const [detail, [viewer, summary, latest, viewerReview]] = await Promise.all([
    loadMovie(slug),
    loadPage(
      () =>
        Promise.all([
          getViewer(),
          getReviewSummary(slug),
          listReviews({ movieSlug: slug, perPage: LATEST_REVIEWS }),
          getViewerReview(slug),
        ]),
      moviePath(slug),
    ),
  ])
  const movie = presentMovieDetail(detail)
  const { directors, writers, cast } = movie.credits
  const releaseDay = movie.releaseDate.toISOString().slice(0, 10)
  const hasCredits = directors.length + writers.length + cast.length > 0
  // The viewer's own review has its box above the list.
  const otherReviews = latest.items.filter((review) => review.id !== viewerReview?.id)

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
              <p className={styles.eyebrow}>
                {/* Focusable so the full date shows on keyboard focus too, not only on hover. */}
                <Tooltip>
                  <TooltipTrigger
                    render={<time className={styles.year} dateTime={releaseDay} tabIndex={0} />}
                  >
                    {movie.year}
                  </TooltipTrigger>
                  <TooltipContent>Released {formatDate(movie.releaseDate)}</TooltipContent>
                </Tooltip>
                {movie.runtimeMinutes === null ? null : ` · ${formatRuntime(movie.runtimeMinutes)}`}
              </p>
              <h1 className={styles.title}>{movie.title}</h1>
              <p className={styles.rating}>
                <StarRating rating={Math.round((summary.average ?? 0) * 2) / 2} decorative />
                <span>{ratingText(summary)}</span>
              </p>
              {movie.synopsis ? (
                <p className={styles.synopsis}>{movie.synopsis}</p>
              ) : (
                <p className={styles.empty}>No synopsis yet.</p>
              )}
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
        {/* The leads, set like a one-sheet's billing block. */}
        <section className={styles.billing} aria-label="Credits">
          {hasCredits ? (
            <>
              {movie.starring.length > 0 ? (
                <div className={styles.credit}>
                  <h2 className={styles.role}>Starring</h2>
                  <p className={styles.starring}>
                    <NameList people={movie.starring} />
                  </p>
                </div>
              ) : null}

              {directors.length + movie.writtenBy.length > 0 ? (
                <div className={styles.crew}>
                  {directors.length > 0 ? (
                    <div className={styles.credit}>
                      <h2 className={styles.role}>Directed by</h2>
                      <p className={styles.crewNames}>
                        <NameList people={directors} />
                      </p>
                    </div>
                  ) : null}
                  {movie.writtenBy.length > 0 ? (
                    <div className={styles.credit}>
                      <h2 className={styles.role}>Written by</h2>
                      <p className={styles.crewNames}>
                        <NameList people={movie.writtenBy} />
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : (
            <p className={styles.empty}>No credits yet.</p>
          )}
        </section>

        {movie.supporting.length > 0 ? (
          <section className={styles.section} aria-labelledby="supporting-heading">
            <h2 id="supporting-heading" className={styles.sectionTitle}>
              {supportingTitle(movie.supporting)}
            </h2>
            <ol className={styles.rail}>
              {movie.supporting.map(({ person, role, label }) => (
                <li key={`${role}:${person.id}`} className={styles.railItem}>
                  <Link href={personPath(person.slug)} className={styles.card}>
                    <span className={styles.avatar}>
                      <Headshot person={person} size="sm" />
                    </span>
                    <span className={styles.cardName}>{person.name}</span>
                    <span className={styles.cardRole}>{label}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <section className={styles.section} aria-labelledby="reviews-heading">
          <div className={styles.sectionHead}>
            <h2 id="reviews-heading" className={styles.sectionTitle}>
              Reviews
            </h2>
            {latest.totalItems > 0 ? (
              <Link href={movieReviewsPath(slug)} className={styles.more}>
                All {latest.totalItems} {latest.totalItems === 1 ? 'review' : 'reviews'}
              </Link>
            ) : null}
          </div>

          <div id="your-review" className={styles.yourReview}>
            {viewer ? (
              <ViewerReview
                movieId={movie.id}
                review={viewerReview}
                startEditing={edit === 'review'}
              >
                {viewerReview ? <ReviewCard review={viewerReview} movieSlug={slug} /> : null}
              </ViewerReview>
            ) : (
              <div className={styles.signIn}>
                <p className={styles.signInText}>Sign in to rate and review this movie.</p>
                <ButtonLink href={loginPath(moviePath(slug))}>Sign in to review</ButtonLink>
              </div>
            )}
          </div>

          {otherReviews.length > 0 ? (
            <ul className={styles.reviews}>
              {otherReviews.map((review) => (
                <li key={review.id}>
                  <ReviewCard review={review} movieSlug={slug} preview />
                </li>
              ))}
            </ul>
          ) : latest.totalItems === 0 ? (
            <p className={styles.empty}>No reviews yet.</p>
          ) : null}
        </section>

        {/* The small print: release, runtime and provenance. */}
        <p className={styles.colophon}>
          <span>
            Released <time dateTime={releaseDay}>{formatDate(movie.releaseDate)}</time>
          </span>
          {movie.runtimeMinutes !== null ? (
            <span>{formatRuntime(movie.runtimeMinutes)}</span>
          ) : null}
          {movie.createdBy ? (
            <span>
              Added {formatDate(movie.createdAt)} by {movie.createdBy.name}
            </span>
          ) : null}
        </p>
      </div>
    </article>
  )
}

export default MoviePage
