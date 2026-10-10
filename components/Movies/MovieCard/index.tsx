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
}

/** A poster card with the title over it; runtime and genres fade in on hover (always shown on touch). */
export const MovieCard = ({ movie, priority }: MovieCardProps) => {
  const details = [
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
        <span className={styles.year}>{movie.releaseDate.getUTCFullYear()}</span>{' '}
        {details.length > 0 ? <span className={styles.details}>{details.join(' · ')}</span> : null}
      </span>
    </Link>
  )
}
