import Link from 'next/link'
import { moviesByGenrePath } from '@/lib/constants-routes'
import type { Genre } from '@/lib/dto/genres'
import styles from './styles.module.scss'

type GenreTagsProps = {
  genres: Genre[]
}

/** A movie's genres as underlined tags, each opening the movie list filtered to that genre. */
export const GenreTags = ({ genres }: GenreTagsProps) => {
  if (genres.length === 0) {
    return null
  }
  return (
    <ul className={styles.tags} aria-label="Genres">
      {genres.map((genre) => (
        <li key={genre.id}>
          <Link href={moviesByGenrePath(genre.slug)} className={styles.tag}>
            {genre.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}
