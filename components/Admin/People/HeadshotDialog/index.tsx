'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { attachHeadshotAction, removeHeadshotAction } from '@/actions/people'
import { createUploadAction } from '@/actions/uploads'
import { ActionButton } from '@/components/ActionButton'
import { LoadingButton } from '@/components/LoadingButton'
import { Headshot } from '@/components/People/Headshot'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/SCN/dialog'
import { useImageUpload } from '@/hooks/useImageUpload'
import type { PersonSummary } from '@/lib/dto/people'
import { HEADSHOT_CONTENT_TYPES, UPLOAD_RULES } from '@/lib/dto/uploads'
import { formatBytes } from '@/lib/formatBytes'
import styles from './styles.module.scss'

export type HeadshotDialogProps = {
  person: PersonSummary
  /** Whether storage is configured (`canUpload()` on the server). */
  canUpload: boolean
}

/**
 * Uploads, replaces and removes a person's photo from their row of the people list. The dialog
 * stays open after each action; the action refreshes the list, so the preview follows.
 */
export const HeadshotDialog = ({ person, canUpload }: HeadshotDialogProps) => {
  const [removing, setRemoving] = useState(false)
  const { inputId, errorId, inputRef, error, setError, uploading, handleChange, openPicker } =
    useImageUpload({
      purpose: 'headshot',
      createUpload: createUploadAction,
      attach: (key) => attachHeadshotAction({ id: person.id, key }),
      onAttached: () => toast.success('Photo updated'),
    })

  const remove = async () => {
    setError(null)
    setRemoving(true)
    try {
      const result = await removeHeadshotAction(person.id)
      if (!result.ok) {
        setError(result.message)
        return
      }
      toast.success('Photo removed')
    } finally {
      setRemoving(false)
    }
  }

  const busy = uploading || removing

  return (
    <Dialog>
      <DialogTrigger render={<ActionButton action="edit" label="Photo" />} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Photo of ${person.name}`}</DialogTitle>
          <DialogDescription>
            Shown on their page and beside their credits. PNG, JPEG or WebP, up to{' '}
            {formatBytes(UPLOAD_RULES.headshot.maxSize)}.
          </DialogDescription>
        </DialogHeader>
        <div className={styles.content}>
          <Headshot person={person} size="lg" />
          {canUpload ? (
            <div className={styles.controls}>
              <input
                ref={inputRef}
                id={inputId}
                className={styles.fileInput}
                type="file"
                accept={HEADSHOT_CONTENT_TYPES.join(',')}
                aria-label="Headshot image"
                aria-describedby={error ? errorId : undefined}
                disabled={busy}
                onChange={handleChange}
              />
              <div className={styles.actions}>
                <LoadingButton
                  type="button"
                  variant="outline"
                  loading={uploading}
                  disabled={removing}
                  onClick={openPicker}
                >
                  {person.headshotUrl ? 'Replace photo' : 'Upload photo'}
                </LoadingButton>
                {person.headshotUrl && (
                  <LoadingButton
                    type="button"
                    variant="ghost"
                    loading={removing}
                    disabled={uploading}
                    onClick={remove}
                  >
                    Remove photo
                  </LoadingButton>
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
      </DialogContent>
    </Dialog>
  )
}
