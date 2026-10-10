'use client'
// React Hook Form's `register()` must run on every render; the React Compiler would cache it.
'use no memo'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { CreditsEditor } from '@/components/Admin/Movies/CreditsEditor'
import { GenrePicker } from '@/components/Admin/Movies/GenrePicker'
import { Input } from '@/components/Form/Input'
import { Textarea } from '@/components/Form/Textarea'
import { LoadingButton } from '@/components/LoadingButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/SCN/card'
import type { GenreWithCount } from '@/lib/dto/genres'
import {
  MOVIE_RELEASE_MIN,
  MOVIE_RUNTIME_MAX_MINUTES,
  MOVIE_SYNOPSIS_MAX_LENGTH,
  MOVIE_TITLE_MAX_LENGTH,
  movieInput,
  type MovieDetail,
  type MovieInput,
} from '@/lib/dto/movies'
import type { PersonSummary } from '@/lib/dto/people'
import { applyActionErrors } from '@/lib/formErrors'
import type { ActionResult } from '@/types/api'
import styles from './styles.module.scss'

export type MovieFormProps = {
  /** Every genre, for the genre picker. */
  genres: GenreWithCount[]
  /** Edit mode: the form starts from this movie. Left out, the form creates one. */
  movie?: MovieDetail
  onSubmit: (values: MovieInput) => Promise<ActionResult<MovieDetail>>
  /** After a success (toast, navigate). */
  onSaved?: (movie: MovieDetail) => void
  /** Defaults to "Create movie" or "Save changes" by mode. */
  submitLabel?: string
}

const EMPTY_VALUES: MovieInput = {
  title: '',
  synopsis: '',
  releaseDate: '',
  runtimeMinutes: null,
  genreIds: [],
  credits: [],
}

/** The form's values for a saved movie: directors, then writers, then cast, each in order. */
const valuesFrom = (movie: MovieDetail): MovieInput => ({
  title: movie.title,
  synopsis: movie.synopsis ?? '',
  releaseDate: movie.releaseDate.toISOString().slice(0, 10),
  runtimeMinutes: movie.runtimeMinutes ?? null,
  genreIds: movie.genres.map((genre) => genre.id),
  credits: [
    ...movie.credits.directors.map((person) => ({
      personId: person.id,
      role: 'DIRECTOR' as const,
    })),
    ...movie.credits.writers.map((person) => ({ personId: person.id, role: 'WRITER' as const })),
    ...movie.credits.cast.map((member) => ({
      personId: member.id,
      role: 'ACTOR' as const,
      star: member.star,
    })),
  ],
})

const peopleFrom = (movie?: MovieDetail) => {
  const people: Record<string, PersonSummary> = {}
  if (movie) {
    const { directors, writers, cast } = movie.credits
    for (const person of [...directors, ...writers, ...cast]) {
      people[person.id] = person
    }
  }
  return people
}

/** Creates a movie or edits one: its details, genres and credits. The poster is not part of it. */
export const MovieForm = ({ genres, movie, onSubmit, onSaved, submitLabel }: MovieFormProps) => {
  const mode = movie ? 'edit' : 'create'
  const [people, setPeople] = useState(() => peopleFrom(movie))
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<MovieInput>({
    resolver: zodResolver(movieInput),
    defaultValues: movie ? valuesFrom(movie) : EMPTY_VALUES,
  })

  const genreIds = useWatch({ control, name: 'genreIds' })
  const credits = useWatch({ control, name: 'credits' })
  const today = new Date().toISOString().slice(0, 10)

  const submit = handleSubmit(async (values) => {
    const result = await onSubmit(values)
    if (result.ok) {
      if (mode === 'edit') {
        reset(valuesFrom(result.data))
      }
      onSaved?.(result.data)
      return
    }
    applyActionErrors(
      result,
      ['title', 'releaseDate', 'runtimeMinutes', 'synopsis', 'genreIds', 'credits'],
      setError,
    )
  })

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={styles.fields}>
            <Input
              label="Title"
              required
              maxLength={MOVIE_TITLE_MAX_LENGTH}
              error={errors.title?.message}
              {...register('title')}
            />
            <div className={styles.row}>
              <Input
                label="Release date"
                type="date"
                required
                min={MOVIE_RELEASE_MIN}
                max={today}
                error={errors.releaseDate?.message}
                {...register('releaseDate')}
              />
              <div className={styles.runtime}>
                <Input
                  label="Runtime"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={MOVIE_RUNTIME_MAX_MINUTES}
                  step={1}
                  error={errors.runtimeMinutes?.message}
                  {...register('runtimeMinutes', {
                    setValueAs: (value) =>
                      value === '' || value === null || value === undefined ? null : Number(value),
                  })}
                />
                <p className={styles.hint}>Minutes</p>
              </div>
            </div>
            <Textarea
              label="Synopsis"
              rows={6}
              maxLength={MOVIE_SYNOPSIS_MAX_LENGTH}
              error={errors.synopsis?.message}
              {...register('synopsis')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Genres</CardTitle>
          <CardDescription>What the movie is, for browsing and filtering.</CardDescription>
        </CardHeader>
        <CardContent>
          <GenrePicker
            genres={genres}
            value={genreIds}
            onChange={(ids) =>
              setValue('genreIds', ids, { shouldDirty: true, shouldValidate: !!errors.genreIds })
            }
            error={errors.genreIds?.message}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credits</CardTitle>
          <CardDescription>Directors, writers and cast, in billing order.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreditsEditor
            value={credits}
            people={people}
            onChange={(credits, nextPeople) => {
              setValue('credits', credits, { shouldDirty: true })
              setPeople(nextPeople)
            }}
            error={errors.credits?.message}
          />
        </CardContent>
      </Card>

      {errors.root?.server && (
        <p className={styles.formError} role="alert">
          {errors.root.server.message}
        </p>
      )}
      <div className={styles.actions}>
        <LoadingButton type="submit" loading={isSubmitting} disabled={mode === 'edit' && !isDirty}>
          {submitLabel ?? (mode === 'edit' ? 'Save changes' : 'Create movie')}
        </LoadingButton>
      </div>
    </form>
  )
}
