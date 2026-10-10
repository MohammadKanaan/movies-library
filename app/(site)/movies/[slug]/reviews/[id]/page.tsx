import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { ButtonLink } from '@/components/ButtonLink'
import { JsonLd } from '@/components/JsonLd'
import { MoviePoster } from '@/components/Movies/MoviePoster'
import { CommentList } from '@/components/Reviews/CommentList'
import { NewComment } from '@/components/Reviews/NewComment'
import { ReviewCard } from '@/components/Reviews/ReviewCard'
import {
  editReviewPath,
  loginPath,
  moviePath,
  movieReviewsPath,
  reviewPath,
} from '@/lib/constants-routes'
import { loadPage } from '@/lib/data/page'
import { listComments } from '@/lib/data/reviewComments'
import { getReview } from '@/lib/data/reviews'
import { siteUrl } from '@/lib/data/site'
import { getViewer } from '@/lib/data/users'
import { commentsUrlQuery } from '@/lib/dto/reviewComments'
import { toScalarParams } from '@/lib/searchParams'
import { describeReview, pagedPath, SITE_OPEN_GRAPH } from '@/lib/seo'
import { reviewJsonLd } from '@/lib/structuredData'
import { CommentsView } from './view'
import styles from './styles.module.scss'

const COMMENTS_PER_PAGE = 20

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
  searchParams,
}: PageProps<'/movies/[slug]/reviews/[id]'>): Promise<Metadata> => {
  const { slug, id } = await params
  const { page } = commentsUrlQuery.parse(toScalarParams(await searchParams))
  const review = await loadReviewOf(slug, id)
  const { movie } = review
  return {
    title: `${review.author.name}’s review of ${movie.title}`,
    description: describeReview(review),
    alternates: { canonical: pagedPath(reviewPath(slug, id), page) },
    openGraph: {
      ...SITE_OPEN_GRAPH,
      type: 'article',
      url: reviewPath(slug, id),
      publishedTime: review.createdAt.toISOString(),
      modifiedTime: review.updatedAt.toISOString(),
      authors: review.author.name,
      ...(movie.posterUrl ? { images: [{ url: movie.posterUrl, alt: movie.title }] } : {}),
    },
  }
}

const ReviewPage = async ({ params, searchParams }: PageProps<'/movies/[slug]/reviews/[id]'>) => {
  const { slug, id } = await params
  // A garbled URL falls back to the first page.
  const { page } = commentsUrlQuery.parse(toScalarParams(await searchParams))
  const review = await loadReviewOf(slug, id)
  const { movie } = review
  const path = reviewPath(slug, id)
  const [viewer, comments] = await loadPage(
    () =>
      Promise.all([
        getViewer(),
        listComments({ reviewId: review.id, page, perPage: COMMENTS_PER_PAGE }),
      ]),
    path,
  )
  // Comments read oldest first, so a new one closes the list: on the last page, or on a fresh
  // one when the last is full. Counted from this render; a comment posted meanwhile shifts it.
  const landingPage = Math.ceil((comments.totalItems + 1) / COMMENTS_PER_PAGE)

  return (
    <div className={styles.page}>
      <JsonLd data={reviewJsonLd(review, siteUrl())} />
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
        editHref={editReviewPath(slug)}
        deleteRedirect={moviePath(slug)}
      >
        {/* Inside the card, so the comments of a spoiler review are as hidden as its text. */}
        <section id="comments" className={styles.comments} aria-labelledby="comments-heading">
          <h2 id="comments-heading" className={styles.commentsTitle}>
            Comments
            <span className={styles.commentCount}>{comments.totalItems}</span>
          </h2>
          {viewer ? (
            <NewComment reviewId={review.id} landingPage={landingPage} />
          ) : (
            <p className={styles.signIn}>
              <span>Sign in to join the conversation.</span>
              <ButtonLink href={loginPath(path)} variant="outline" size="sm">
                Sign in
              </ButtonLink>
            </p>
          )}
          <CommentsView page={comments.page} totalPages={comments.totalPages}>
            {/* A page past the end (its last comment was deleted) links back to the first. */}
            <CommentList
              comments={comments.items}
              firstPageHref={page > 1 ? `${path}#comments` : undefined}
            />
          </CommentsView>
        </section>
      </ReviewCard>
    </div>
  )
}

export default ReviewPage
