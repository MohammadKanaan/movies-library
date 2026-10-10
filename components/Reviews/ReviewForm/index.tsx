'use client'
// React Hook Form's `register()` must run on every render; the React Compiler would cache it.
'use no memo'

import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Textarea } from '@/components/Form/Textarea'
import { LoadingButton } from '@/components/LoadingButton'
import { StarRatingInput } from '@/components/Reviews/StarRatingInput'
import { Button } from '@/components/SCN/button'
import { Checkbox } from '@/components/SCN/checkbox'
import { Label } from '@/components/SCN/label'
import { reviewFormInput, type ReviewFormInput, type ReviewFormValues } from '@/lib/dto/reviews'
import { applyActionErrors } from '@/lib/formErrors'
import type { ActionResult } from '@/types/api'
import styles from './styles.module.scss'
import { hydrateReviewForm, REVIEW_FORM_FIELDS } from './utils'

export type ReviewFormProps = {
  /** The review being edited; left out when writing a new one. */
  review?: { rating: number; body: string | null; spoiler: boolean }
  onSubmit: (values: ReviewFormValues) => Promise<ActionResult<unknown>>
  submitLabel: string
  /** Offers a Cancel button (editing). */
  onCancel?: () => void
}

export const ReviewForm = ({ review, onSubmit, submitLabel, onCancel }: ReviewFormProps) => {
  const ratingLabelId = useId()
  const spoilerId = useId()
  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormInput, unknown, ReviewFormValues>({
    resolver: zodResolver(reviewFormInput),
    defaultValues: hydrateReviewForm(review),
  })
  const hasText = (useWatch({ control, name: 'body' }) ?? '').trim() !== ''

  const submit = handleSubmit(async (values) => {
    const result = await onSubmit(values)
    if (!result.ok) {
      applyActionErrors(result, REVIEW_FORM_FIELDS, setError)
    }
  })

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.field}>
        <span id={ratingLabelId} className={styles.label}>
          Your rating
          <span className={styles.requiredMarker} aria-hidden="true">
            *
          </span>
        </span>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <StarRatingInput
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              invalid={errors.rating !== undefined}
              aria-labelledby={ratingLabelId}
            />
          )}
        />
        {errors.rating && <p className={styles.error}>{errors.rating.message}</p>}
      </div>

      <Textarea
        label="Review (optional)"
        placeholder="What did you think?"
        rows={5}
        error={errors.body?.message}
        {...register('body', {
          // Spoilers need text: emptying the box takes the flag with it.
          onChange: (event) => {
            if (event.target.value.trim() === '') {
              setValue('spoiler', false)
            }
          },
        })}
      />

      <div className={styles.field}>
        <div className={styles.spoiler}>
          <Controller
            control={control}
            name="spoiler"
            render={({ field }) => (
              <Checkbox
                id={spoilerId}
                checked={hasText && field.value === true}
                disabled={!hasText}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor={spoilerId}>Contains spoilers</Label>
        </div>
        {errors.spoiler && <p className={styles.error}>{errors.spoiler.message}</p>}
      </div>

      {errors.root?.server && (
        <p className={styles.error} role="alert">
          {errors.root.server.message}
        </p>
      )}
      <div className={styles.actions}>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <LoadingButton type="submit" loading={isSubmitting}>
          {submitLabel}
        </LoadingButton>
      </div>
    </form>
  )
}
