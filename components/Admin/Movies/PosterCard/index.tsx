'use client'

import { ImageUp } from 'lucide-react'
import { toast } from 'sonner'
import { attachPosterAction, removePosterAction } from '@/actions/movies'
import { createUploadAction } from '@/actions/uploads'
import { ConfirmDialog } from '@/components/Admin/ConfirmDialog'
import { LoadingButton } from '@/components/LoadingButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/SCN/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/SCN/tooltip'
import { useImageUpload } from '@/hooks/useImageUpload'
import { POSTER_CONTENT_TYPES, UPLOAD_RULES } from '@/lib/dto/uploads'
import { formatBytes } from '@/lib/formatBytes'
import styles from './styles.module.scss'

export type PosterCardProps = {
  movie: { id: string; title: string; posterUrl: string | null }
  /** Whether storage is configured (`canUpload()` on the server). */
  canUpload: boolean
}

/** Uploads, replaces and removes a movie's poster. The page refreshes itself after each action. */
export const PosterCard = ({ movie, canUpload }: PosterCardProps) => {
  const { inputId, errorId, inputRef, error, uploading, handleChange, openPicker } = useImageUpload(
    {
      purpose: 'poster',
      createUpload: createUploadAction,
      attach: (key) => attachPosterAction({ id: movie.id, key }),
      onAttached: () => toast.success('Poster updated'),
    },
  )

  const pickerLabel = movie.posterUrl ? 'Replace poster' : 'Upload poster'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Poster</CardTitle>
        <CardDescription>
          Shown on the movie&apos;s card and page. PNG, JPEG or WebP, up to{' '}
          {formatBytes(UPLOAD_RULES.poster.maxSize)}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={styles.content}>
          <div className={styles.preview}>
            {movie.posterUrl ? (
              // A public bucket URL, like every other poster: no `next/image` loader.
              // eslint-disable-next-line @next/next/no-img-element
              <img className={styles.image} src={movie.posterUrl} alt="" decoding="async" />
            ) : (
              <span className={styles.placeholder} aria-hidden="true">
                {movie.title}
              </span>
            )}
          </div>
          {canUpload ? (
            <div className={styles.controls}>
              <input
                ref={inputRef}
                id={inputId}
                className={styles.fileInput}
                type="file"
                accept={POSTER_CONTENT_TYPES.join(',')}
                aria-label="Poster image"
                aria-describedby={error ? errorId : undefined}
                disabled={uploading}
                onChange={handleChange}
              />
              <div className={styles.actions}>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <LoadingButton
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        icon={ImageUp}
                        aria-label={pickerLabel}
                        loading={uploading}
                        onClick={openPicker}
                      />
                    }
                  />
                  <TooltipContent>{pickerLabel}</TooltipContent>
                </Tooltip>
                {movie.posterUrl && (
                  <ConfirmDialog
                    trigger="Remove poster"
                    triggerAction="delete"
                    title="Remove the poster?"
                    description="The movie keeps everything else; the image is deleted from storage."
                    confirmLabel="Remove poster"
                    disabled={uploading}
                    onConfirm={() => removePosterAction(movie.id)}
                    onDone={() => toast.success('Poster removed')}
                  />
                )}
              </div>
              {error && (
                <p id={errorId} className={styles.error} role="alert">
                  {error}
                </p>
              )}
            </div>
          ) : (
            <p className={styles.note}>
              Uploads are not configured on this server (set the R2 variables).
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
