'use client'

import { Star } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState, type MouseEvent } from 'react'
import { MoviePoster } from '@/components/Movies/MoviePoster'
import { moviePath } from '@/lib/constants-routes'
import type { MovieSummary } from '@/lib/dto/movies'
import styles from './styles.module.scss'

type FanFavoritesGalleryProps = {
  /** Best first; the first is open to begin with. */
  movies: MovieSummary[]
}

/** Where a panel sits against the open one: the side it tilts toward and its image drifts from. */
const sideOf = (index: number, active: number) =>
  index === active ? 'active' : index < active ? 'before' : 'after'

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`

/**
 * The fan favorites as an accordion of posters (after React Bits' Accordion Gallery): one panel
 * open with its title and rating, the rest narrow, tilted and in grayscale. The mouse opens a panel
 * by pointing at it and the keyboard by focusing it, so a click or Enter follows the link at once;
 * a press on a closed panel (a tap: touch has no hover) opens it, and the next one follows it.
 */
export const FanFavoritesGallery = ({ movies }: FanFavoritesGalleryProps) => {
  const [active, setActive] = useState(0)
  // Whether the pressed panel was open when the press began: a tap focuses the link (opening it)
  // before its click, so the click alone cannot tell. Null for a click with no press: a key clears
  // it, since Enter's click follows its keydown. (Not `pointerleave`: a lifted finger leaves
  // before its click.)
  const openAtPress = useRef<boolean | null>(null)

  const followIfOpenAtPress = (index: number, event: MouseEvent<HTMLAnchorElement>) => {
    const wasOpen = openAtPress.current
    openAtPress.current = null
    if (wasOpen === false) {
      event.preventDefault()
      setActive(index)
    }
  }

  return (
    <ul className={styles.gallery}>
      {movies.map((movie, index) => {
        const { average, count } = movie.rating
        return (
          <li
            key={movie.id}
            className={styles.panel}
            data-side={sideOf(index, active)}
            data-far={Math.abs(index - active) > 1 || undefined}
          >
            <Link
              href={moviePath(movie.slug)}
              // Always dark, like a movie card: the text sits on a scrim over the poster.
              className={`dark ${styles.link}`}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') {
                  setActive(index)
                }
              }}
              onPointerDown={() => {
                openAtPress.current = index === active
              }}
              onKeyDown={() => {
                openAtPress.current = null
              }}
              onFocus={() => setActive(index)}
              onClick={(event) => followIfOpenAtPress(index, event)}
            >
              <span className={styles.media}>
                {/* The page leads with the gallery: every panel is in view on arrival. */}
                <MoviePoster movie={movie} priority />
              </span>
              <span className={styles.scrim} aria-hidden="true" />
              <span className={styles.rank} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              {/* In every panel for the link's name; only the open panel shows it. */}
              <span className={styles.label}>
                <span className={styles.bar} aria-hidden="true" />
                <span className={styles.text}>
                  <span className={styles.title}>{movie.title}</span>{' '}
                  <span className={styles.meta}>
                    {movie.releaseDate.getUTCFullYear()}{' '}
                    {average === null ? null : (
                      <span className={styles.rating}>
                        <Star aria-hidden="true" />
                        <span className={styles.srOnly}>Rated</span> {average.toFixed(1)} ·{' '}
                        {plural(count, 'rating', 'ratings')}
                      </span>
                    )}
                  </span>
                </span>
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
