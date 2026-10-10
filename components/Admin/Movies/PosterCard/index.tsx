'use client'

import { useId, useRef, useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import { attachPosterAction, removePosterAction } from '@/actions/movies'
import { createUploadAction } from '@/actions/uploads'
import { ConfirmDialog } from '@/components/Admin/ConfirmDialog'
import { LoadingButton } from '@/components/LoadingButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/SCN/card'
import { uploadFile } from '@/lib/client/uploads'
import { POSTER_CONTENT_TYPES, UPLOAD_RULES, createUploadInput } from '@/lib/dto/uploads'
import { formatBytes } from '@/lib/formatBytes'
import styles from './styles.module.scss'

export type PosterCardProps = {
  movie: { id: string; title: string; posterUrl: string | null }
  /** Whether storage is configured (`canUpload()` on the server). */
  canUpload: boolean
}

/** Uploads, replaces and removes a movie's poster. The page refreshes itself after each action. */
export const PosterCard = ({ movie, canUpload }: PosterCardProps) => {
  const inputId = useId()
  const errorId = `${inputId}-error`
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const upload = async (file: File) => {
    const input = createUploadInput.safeParse({
      purpose: 'poster',
      contentType: file.type,
      size: file.size,
    })
    if (!input.success) {
      setError(input.error.issues[0].message)
      return
    }
    setError(null)
    setUploading(true)
    try {
      const ticket = await createUploadAction(input.data)
      if (!ticket.ok) {
        setError(ticket.message)
        return
      }
      await uploadFile(ticket.data, file)
      const attached = await attachPosterAction({ id: movie.id, key: ticket.data.key })
      if (!attached.ok) {
        setError(attached.message)
        return
      }
      toast.success('Poster updated')
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'The upload failed. Try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    // Clearing the value lets the same file be picked again after a failure.
    event.target.value = ''
    if (file) {
      void upload(file)
    }
  }

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
                <LoadingButton
                  type="button"
                  variant="outline"
                  loading={uploading}
                  onClick={() => inputRef.current?.click()}
                >
                  {movie.posterUrl ? 'Replace poster' : 'Upload poster'}
                </LoadingButton>
                {movie.posterUrl && (
                  <ConfirmDialog
                    trigger="Remove poster"
                    triggerVariant="ghost"
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
