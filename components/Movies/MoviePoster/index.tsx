import styles from './styles.module.scss'

type MoviePosterProps = {
  movie: { title: string; posterUrl: string | null }
  /** Above the fold: load it now, ahead of other images, instead of lazily. */
  priority?: boolean
}

/** A movie's 2:3 poster, or its title on a tinted panel when it has none. It fills its parent. */
export const MoviePoster = ({ movie, priority = false }: MoviePosterProps) => {
  return (
    <div className={styles.poster}>
      {movie.posterUrl ? (
        // R2 posters are plain public URLs, like avatars: no `next/image` loader or remote patterns.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.image}
          src={movie.posterUrl}
          alt=""
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
        />
      ) : (
        <span className={styles.fallback} aria-hidden="true">
          {movie.title}
        </span>
      )}
    </div>
  )
}
