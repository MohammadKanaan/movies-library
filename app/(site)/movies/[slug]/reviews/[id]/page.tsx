import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { MoviePoster } from '@/components/Movies/MoviePoster'
import { ReviewCard } from '@/components/Reviews/ReviewCard'
import { moviePath, movieReviewsPath, reviewPath } from '@/lib/constants-routes'
import { loadPage } from '@/lib/data/page'
import { getReview } from '@/lib/data/reviews'
import styles from './styles.module.scss'

// `generateMetadata` and the page read the same review: one DAL call per request.
const loadReview = cache((slug: string, id: string) =>
  loadPage(() => getReview(id), reviewPath(slug, id)),
)

/** The URL's slug must be the review's movie: a review is not reachable under another movie. */
const loadReviewOf = async (slug: string, id: string) => {
  const review = await loadReview(slug, id)
  if (review.movie.slug !== slug) {
    notFound()
  }
  return review
}

export const generateMetadata = async ({
  params,
}: PageProps<'/movies/[slug]/reviews/[id]'>): Promise<Metadata> => {
  const { slug, id } = await params
  const review = await loadReviewOf(slug, id)
  return { title: `${review.author.name}’s review of ${review.movie.title}` }
}

const ReviewPage = async ({ params }: PageProps<'/movies/[slug]/reviews/[id]'>) => {
  const { slug, id } = await params
  const review = await loadReviewOf(slug, id)
  const { movie } = review

  return (
    <div className={styles.page}>
      <Link href={movieReviewsPath(slug)} className={styles.back}>
        <ArrowLeft aria-hidden="true" />
        All reviews
      </Link>

      <Link href={moviePath(slug)} className={styles.movie}>
        <div className={styles.poster}>
          <MoviePoster movie={movie} />
        </div>
        <span className={styles.movieText}>
          <span className={styles.movieTitle}>{movie.title}</span>
          <span className={styles.movieYear}>{movie.releaseDate.getUTCFullYear()}</span>
        </span>
      </Link>

      <ReviewCard
        review={review}
        movieSlug={slug}
        editHref={`${moviePath(slug)}#your-review`}
        deleteRedirect={moviePath(slug)}
      />
    </div>
  )
}

export default ReviewPage
