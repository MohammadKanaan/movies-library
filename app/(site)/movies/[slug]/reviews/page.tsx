import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { cache } from 'react'
import { Empty } from '@/components/Empty'
import { PageHeader } from '@/components/PageHeader'
import { ReviewCard } from '@/components/Reviews/ReviewCard'
import { StarRating } from '@/components/Reviews/StarRating'
import { moviePath, movieReviewsPath } from '@/lib/constants-routes'
import { getMovieBySlug } from '@/lib/data/movies'
import { loadPage } from '@/lib/data/page'
import { getReviewSummary, listReviews } from '@/lib/data/reviews'
import { reviewsUrlQuery } from '@/lib/dto/reviews'
import { toScalarParams } from '@/lib/searchParams'
import { ReviewsView } from './view'
import styles from './styles.module.scss'

const PER_PAGE = 10

// `generateMetadata` and the page read the same movie: one DAL call per request.
const loadMovie = cache((slug: string) =>
  loadPage(() => getMovieBySlug(slug), movieReviewsPath(slug)),
)

export const generateMetadata = async ({
  params,
}: PageProps<'/movies/[slug]/reviews'>): Promise<Metadata> => {
  const { slug } = await params
  const movie = await loadMovie(slug)
  return { title: `Reviews of ${movie.title} (${movie.releaseDate.getUTCFullYear()})` }
}

const MovieReviewsPage = async ({ params, searchParams }: PageProps<'/movies/[slug]/reviews'>) => {
  const { slug } = await params
  // A garbled URL falls back to the first page.
  const { page } = reviewsUrlQuery.parse(toScalarParams(await searchParams))
  const path = movieReviewsPath(slug)
  // The reviews are read by the movie's slug, so they load alongside the movie, not after it.
  const [movie, summary, reviews] = await Promise.all([
    loadMovie(slug),
    loadPage(() => getReviewSummary(slug), path),
    loadPage(() => listReviews({ movieSlug: slug, page, perPage: PER_PAGE }), path),
  ])
  const count = `${summary.count} ${summary.count === 1 ? 'rating' : 'ratings'}`

  return (
    <div className={styles.page}>
      <Link href={moviePath(slug)} className={styles.back}>
        <ArrowLeft aria-hidden="true" />
        {movie.title}
      </Link>
      <PageHeader
        title={`Reviews of ${movie.title}`}
        description={
          summary.average === null
            ? 'Nobody has rated this movie yet.'
            : `${summary.average} out of 5 from ${count}.`
        }
        actions={
          summary.average === null ? undefined : (
            <StarRating rating={Math.round(summary.average * 2) / 2} size="lg" />
          )
        }
      />
      <ReviewsView page={reviews.page} totalPages={reviews.totalPages}>
        {reviews.items.length === 0 ? (
          <Empty
            title={page > 1 ? 'No reviews on this page' : 'No reviews yet'}
            description={
              page > 1 ? 'Go back to the first page.' : 'Be the first to review this movie.'
            }
          />
        ) : (
          <ul className={styles.list}>
            {reviews.items.map((review) => (
              <li key={review.id}>
                <ReviewCard review={review} movieSlug={slug} preview />
              </li>
            ))}
          </ul>
        )}
      </ReviewsView>
    </div>
  )
}

export default MovieReviewsPage
