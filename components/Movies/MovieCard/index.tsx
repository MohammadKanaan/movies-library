import { Star } from 'lucide-react'
import Link from 'next/link'
import { MoviePoster } from '@/components/Movies/MoviePoster'
import { moviePath } from '@/lib/constants-routes'
import type { MovieSummary } from '@/lib/dto/movies'
import { formatRuntime } from '@/lib/formatRuntime'
import styles from './styles.module.scss'

type MovieCardProps = {
  movie: MovieSummary
  /** Above the fold: load the poster now instead of lazily. */
  priority?: boolean
  /** Replaces the runtime and genres line (a filmography shows the person's roles there). */
  details?: string[]
}

/**
 * A poster card with the title over it, the year and average rating above; runtime and genres fade
 * in on hover (always shown on touch).
 */
export const MovieCard = ({ movie, priority, details: detailsOverride }: MovieCardProps) => {
  const { average } = movie.rating
  const details =
    detailsOverride ??
    [
      movie.runtimeMinutes === null ? null : formatRuntime(movie.runtimeMinutes),
      ...movie.genres.slice(0, 2).map((genre) => genre.name),
    ].filter((detail) => detail !== null)

  return (
    // The card is always dark: its text sits on a scrim over the poster, in either theme.
    <Link href={moviePath(movie.slug)} className={`dark ${styles.card}`}>
      <MoviePoster movie={movie} priority={priority} />
      <span className={styles.scrim} aria-hidden="true" />
      {/* The spaces keep the link's accessible name from running "Arrival2016" together; the
          flex layout ignores them. */}
      <span className={styles.info}>
        <span className={styles.title}>{movie.title}</span>{' '}
        <span className={styles.eyebrow}>
          <span className={styles.year}>{movie.releaseDate.getUTCFullYear()}</span>
          {average === null ? null : (
            <>
              {' '}
              <span className={styles.rating}>
                <Star aria-hidden="true" />
                <span className={styles.srOnly}>Rated</span> {average.toFixed(1)}
              </span>
            </>
          )}
        </span>{' '}
        {details.length > 0 ? <span className={styles.details}>{details.join(' · ')}</span> : null}
      </span>
    </Link>
  )
}
