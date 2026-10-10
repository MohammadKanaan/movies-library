'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { deleteMovieAction, updateMovieAction } from '@/actions/movies'
import { ConfirmDialog } from '@/components/Admin/ConfirmDialog'
import { MovieForm } from '@/components/Admin/Movies/MovieForm'
import { PosterCard } from '@/components/Admin/Movies/PosterCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/SCN/card'
import { ROUTE_ADMIN_MOVIES } from '@/lib/constants-routes'
import type { GenreWithCount } from '@/lib/dto/genres'
import type { MovieDetail } from '@/lib/dto/movies'
import { formatDate, formatDateTime } from '@/lib/formatDate'
import styles from './styles.module.scss'

type EditMovieViewProps = {
  movie: MovieDetail
  genres: GenreWithCount[]
  canUpload: boolean
}

export const EditMovieView = ({ movie, genres, canUpload }: EditMovieViewProps) => {
  const router = useRouter()

  return (
    <div className={styles.columns}>
      <MovieForm
        movie={movie}
        genres={genres}
        onSubmit={(values) => updateMovieAction({ id: movie.id, ...values })}
        onSaved={() => toast.success('Movie saved')}
      />

      <aside className={styles.stack}>
        <PosterCard movie={movie} canUpload={canUpload} />

        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Details</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className={styles.facts}>
              <div>
                <dt>Added</dt>
                <dd>
                  {formatDate(movie.createdAt)}
                  {movie.createdBy ? ` by ${movie.createdBy.name}` : ''}
                </dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{formatDateTime(movie.updatedAt)}</dd>
              </div>
              <div>
                <dt>Slug</dt>
                <dd>
                  <code>{movie.slug}</code>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Danger zone</h2>
            </CardTitle>
            <CardDescription>Deleting a movie cannot be undone.</CardDescription>
          </CardHeader>
          <CardContent>
            <ConfirmDialog
              trigger="Delete movie"
              title={`Delete ${movie.title}?`}
              description="Its credits and genre links go with it; its poster is removed from storage. The people and genres stay."
              confirmLabel="Delete movie"
              onConfirm={() => deleteMovieAction(movie.id)}
              onDone={() => {
                toast.success(`${movie.title} was deleted`)
                router.push(ROUTE_ADMIN_MOVIES)
              }}
            />
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}
