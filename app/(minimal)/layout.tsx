import type { Metadata } from 'next'
import Link from 'next/link'
import { connection } from 'next/server'
import { PosterWall } from '@/components/Auth/PosterWall'
import { ROUTE_HOME } from '@/lib/constants-routes'
import { listMovies } from '@/lib/data/movies'
import { env } from '@/lib/env'
import { NO_INDEX } from '@/lib/seo'
import styles from './styles.module.scss'

// Sign-in, sign-up and password pages have nothing to find in search results.
export const metadata: Metadata = {
  robots: NO_INDEX,
}

/** Enough posters to fill four columns twice over at any height. */
const WALL_SIZE = 36

/**
 * The auth pages: the form on one half, the catalog drifting past on the other. The layout stays
 * mounted between them, so moving from log in to sign up keeps the wall where it was.
 */
const MinimalLayout = async ({ children }: LayoutProps<'/'>) => {
  // The wall is read per request, never frozen into a page by `next build`.
  await connection()
  const movies = await listMovies({ page: 1, perPage: WALL_SIZE, sort: 'newest' })

  return (
    <div className={styles.page}>
      <section className={styles.formSide}>
        <Link href={ROUTE_HOME} className={styles.brand}>
          {env.appName}
        </Link>
        <main className={styles.content}>{children}</main>
      </section>
      <div className={styles.wall}>
        <PosterWall movies={movies.items} />
      </div>
    </div>
  )
}

export default MinimalLayout
