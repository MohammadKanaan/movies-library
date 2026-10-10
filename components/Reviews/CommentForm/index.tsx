'use client'
// React Hook Form's `register()` must run on every render; the React Compiler would cache it.
'use no memo'

import { zodResolver } from '@hookform/resolvers/zod'
import type { KeyboardEvent } from 'react'
import { useForm } from 'react-hook-form'
import { Textarea } from '@/components/Form/Textarea'
import { LoadingButton } from '@/components/LoadingButton'
import { Button } from '@/components/SCN/button'
import { ShortcutHint } from '@/components/ShortcutHint'
import {
  commentFormInput,
  type CommentFormInput,
  type CommentFormValues,
} from '@/lib/dto/reviewComments'
import { applyActionErrors } from '@/lib/formErrors'
import { SUBMIT_KEYSHORTCUTS, submitOnShortcut } from '@/lib/keyboard'
import type { ActionResult } from '@/types/api'
import styles from './styles.module.scss'
import { COMMENT_FORM_FIELDS, hydrateCommentForm } from './utils'

export type CommentFormProps = {
  /** The comment being edited; left out when writing a new one. */
  comment?: { body: string }
  onSubmit: (values: CommentFormValues) => Promise<ActionResult<unknown>>
  submitLabel: string
  /** Offers a Cancel button (editing), which Escape presses too. */
  onCancel?: () => void
}

/**
 * The text box for a comment. It empties itself once the comment is saved; ⌘/Ctrl + Enter submits
 * it from the box.
 */
export const CommentForm = ({ comment, onSubmit, submitLabel, onCancel }: CommentFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormInput, unknown, CommentFormValues>({
    resolver: zodResolver(commentFormInput),
    defaultValues: hydrateCommentForm(comment),
  })

  const submit = handleSubmit(async (values) => {
    const result = await onSubmit(values)
    if (result.ok) {
      reset(hydrateCommentForm())
    } else {
      applyActionErrors(result, COMMENT_FORM_FIELDS, setError)
    }
  })

  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape' && onCancel && !isSubmitting) {
      event.preventDefault()
      onCancel()
      return
    }
    submitOnShortcut(event)
  }

  return (
    <form className={styles.form} onSubmit={submit} onKeyDown={handleKeyDown} noValidate>
      <Textarea
        aria-label="Comment"
        placeholder="Add a comment"
        rows={3}
        error={errors.body?.message}
        {...register('body')}
      />
      {errors.root?.server && (
        <p className={styles.error} role="alert">
          {errors.root.server.message}
        </p>
      )}
      <div className={styles.actions}>
        <ShortcutHint action={`to ${submitLabel.toLowerCase()}`} />
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <LoadingButton type="submit" loading={isSubmitting} aria-keyshortcuts={SUBMIT_KEYSHORTCUTS}>
          {submitLabel}
        </LoadingButton>
      </div>
    </form>
  )
}
