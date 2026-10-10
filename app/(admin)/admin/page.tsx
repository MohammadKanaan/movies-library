import type { Metadata } from 'next'
import Link from 'next/link'
import { StatCard } from '@/components/Admin/StatCard'
import { ButtonLink } from '@/components/ButtonLink'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/SCN/badge'
import { UserAvatar } from '@/components/UserAvatar'
import {
  adminMovieEditPath,
  adminUserPath,
  ROUTE_ADMIN,
  ROUTE_ADMIN_GENRES,
  ROUTE_ADMIN_MOVIE_NEW,
  ROUTE_ADMIN_MOVIES,
  ROUTE_ADMIN_PEOPLE,
  ROUTE_ADMIN_USERS,
} from '@/lib/constants-routes'
import { getAdminOverview } from '@/lib/data/admin'
import { loadPage } from '@/lib/data/page'
import { formatDate } from '@/lib/formatDate'
import styles from './styles.module.scss'

export const metadata: Metadata = {
  title: 'Admin',
}

const plural = (count: number, one: string, many: string) => (count === 1 ? one : many)

const AdminOverviewPage = async () => {
  const { counts, recentMovies, recentUsers } = await loadPage(getAdminOverview, ROUTE_ADMIN)

  return (
    <div className={styles.page}>
      <PageHeader
        title="Overview"
        description="The catalog and its users at a glance."
        actions={
          <>
            <ButtonLink href={ROUTE_ADMIN_MOVIE_NEW}>Add movie</ButtonLink>
            <ButtonLink href={ROUTE_ADMIN_PEOPLE} variant="outline">
              Add person
            </ButtonLink>
            <ButtonLink href={ROUTE_ADMIN_GENRES} variant="outline">
              Add genre
            </ButtonLink>
          </>
        }
      />

      <section className={styles.stats} aria-label="Counts">
        <StatCard
          label="Movies"
          value={counts.movies}
          href={ROUTE_ADMIN_MOVIES}
          hint={
            counts.moviesWithoutPoster === 0
              ? 'Every movie has a poster'
              : `${counts.moviesWithoutPoster} without a poster`
          }
        />
        <StatCard label="People" value={counts.people} href={ROUTE_ADMIN_PEOPLE} />
        <StatCard label="Genres" value={counts.genres} href={ROUTE_ADMIN_GENRES} />
        <StatCard
          label="Users"
          value={counts.users}
          href={ROUTE_ADMIN_USERS}
          hint={`${counts.admins} ${plural(counts.admins, 'admin', 'admins')} · ${counts.banned} banned`}
        />
      </section>

      <div className={styles.columns}>
        <section className={styles.panel} aria-labelledby="recent-movies">
          <header className={styles.panelHeader}>
            <h2 id="recent-movies" className={styles.panelTitle}>
              Recently added movies
            </h2>
            <Link href={ROUTE_ADMIN_MOVIES} className={styles.panelLink}>
              All movies
            </Link>
          </header>
          {recentMovies.length === 0 ? (
            <p className={styles.empty}>No movies yet.</p>
          ) : (
            <ul className={styles.list}>
              {recentMovies.map((movie) => (
                <li key={movie.id}>
                  <Link href={adminMovieEditPath(movie.slug)} className={styles.row}>
                    <span className={styles.thumb} aria-hidden="true">
                      {movie.posterUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- a public bucket URL
                        <img src={movie.posterUrl} alt="" loading="lazy" decoding="async" />
                      ) : null}
                    </span>
                    <span className={styles.rowText}>
                      <span className={styles.rowTitle}>{movie.title}</span>
                      <span className={styles.rowMeta}>
                        {movie.releaseDate.getUTCFullYear()}
                        {movie.genres.length > 0
                          ? ` · ${movie.genres.map((genre) => genre.name).join(', ')}`
                          : ''}
                      </span>
                    </span>
                    {!movie.posterUrl && <Badge variant="outline">No poster</Badge>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.panel} aria-labelledby="recent-users">
          <header className={styles.panelHeader}>
            <h2 id="recent-users" className={styles.panelTitle}>
              Newest users
            </h2>
            <Link href={ROUTE_ADMIN_USERS} className={styles.panelLink}>
              All users
            </Link>
          </header>
          <ul className={styles.list}>
            {recentUsers.map((user) => (
              <li key={user.id}>
                <Link href={adminUserPath(user.id)} className={styles.row}>
                  <UserAvatar name={user.name} image={null} size="sm" />
                  <span className={styles.rowText}>
                    <span className={styles.rowTitle}>{user.name}</span>
                    <span className={styles.rowMeta}>
                      @{user.username} · joined {formatDate(user.createdAt)}
                    </span>
                  </span>
                  {user.banned ? (
                    <Badge variant="destructive">Banned</Badge>
                  ) : (
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default AdminOverviewPage
