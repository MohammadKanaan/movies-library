import clsx from 'clsx'
import type { ReactNode } from 'react'
import styles from './styles.module.scss'

type ShelfProps = {
  /** The heading's id, which names the section. */
  id: string
  title: string
  description?: string
  /**
   * `rail` scrolls sideways in one row and `grid` wraps like the catalog, both around `<li>`
   * children; `none` renders children that bring their own list.
   */
  layout?: 'rail' | 'grid' | 'none'
  /** `below` captions the content instead of heading it, for a section that leads with an image. */
  headingPosition?: 'above' | 'below'
  children: ReactNode
}

/** A titled section of the home page holding a list of cards. */
export const Shelf = ({
  id,
  title,
  description,
  layout = 'rail',
  headingPosition = 'above',
  children,
}: ShelfProps) => {
  const header = (
    <header className={styles.header}>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {description ? <p className={styles.description}>{description}</p> : null}
    </header>
  )
  return (
    <section
      className={clsx(styles.shelf, headingPosition === 'below' && styles.captioned)}
      aria-labelledby={id}
    >
      {headingPosition === 'above' ? header : null}
      {layout === 'none' ? children : <ul className={styles[layout]}>{children}</ul>}
      {headingPosition === 'below' ? header : null}
    </section>
  )
}
