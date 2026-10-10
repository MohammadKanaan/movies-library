'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createMovieAction } from '@/actions/movies'
import { MovieForm } from '@/components/Admin/Movies/MovieForm'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/SCN/card'
import { adminMovieEditPath } from '@/lib/constants-routes'
import type { GenreWithCount } from '@/lib/dto/genres'
import styles from './styles.module.scss'

type NewMovieViewProps = {
  genres: GenreWithCount[]
}

export const NewMovieView = ({ genres }: NewMovieViewProps) => {
  const router = useRouter()

  return (
    <div className={styles.columns}>
      <MovieForm
        genres={genres}
        onSubmit={createMovieAction}
        onSaved={(movie) => {
          toast.success(`${movie.title} created`, { description: 'Add a poster below.' })
          router.push(adminMovieEditPath(movie.slug))
        }}
      />
      <aside>
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Poster</h2>
            </CardTitle>
            <CardDescription>Save the movie first to add a poster.</CardDescription>
          </CardHeader>
        </Card>
      </aside>
    </div>
  )
}
