import { MoviePoster } from '@/components/Movies/MoviePoster'
import type { MovieSummary } from '@/lib/dto/movies'
import styles from './styles.module.scss'

const COLUMNS = 4

type PosterWallProps = {
  movies: MovieSummary[]
}

/** The auth pages' backdrop: the catalog's posters in tilted columns, drifting past. Decorative. */
export const PosterWall = ({ movies }: PosterWallProps) => {
  const columns = Array.from({ length: COLUMNS }, (_, column) =>
    movies.filter((_, i) => i % COLUMNS === column),
  )

  return (
    <aside className={styles.wall} aria-hidden="true">
      <div className={styles.columns}>
        {columns.map((column, c) => (
          <div key={c} className={styles.column}>
            {/* Rendered twice so the loop, at half its height, lands exactly where it began. */}
            <div className={styles.track}>
              {[...column, ...column].map((movie, i) => (
                <div key={`${movie.id}-${i}`} className={styles.poster}>
                  <MoviePoster movie={movie} priority={i < 3} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
