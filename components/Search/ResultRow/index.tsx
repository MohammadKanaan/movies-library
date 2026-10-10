import Link from 'next/link'
import type { ReactNode } from 'react'
import styles from './styles.module.scss'

type ResultRowProps = {
  href: string
  /** The row's picture: a poster or a headshot, sized by the row. */
  media: ReactNode
  title: string
  /** Short facts under the title, joined by dots: a year and genres, a credit count. */
  details?: string[]
}

/** One search result: a picture, the title and a line of details, the whole row a link. */
export const ResultRow = ({ href, media, title, details = [] }: ResultRowProps) => {
  return (
    <Link href={href} className={styles.row}>
      <span className={styles.media} aria-hidden="true">
        {media}
      </span>
      {/* The space keeps the link's accessible name from running "Dune2021" together. */}
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>{' '}
        {details.length > 0 ? <span className={styles.details}>{details.join(' · ')}</span> : null}
      </span>
    </Link>
  )
}
