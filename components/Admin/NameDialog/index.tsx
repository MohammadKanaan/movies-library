'use client'
// React Hook Form's `register()` must run on every render; the React Compiler would cache it.
'use no memo'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState, type ComponentProps } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { ActionButton } from '@/components/ActionButton'
import type { RecordAction } from '@/components/ActionButton/actions'
import { Input } from '@/components/Form/Input'
import { LoadingButton } from '@/components/LoadingButton'
import { Button } from '@/components/SCN/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/SCN/dialog'
import { applyActionErrors } from '@/lib/formErrors'
import type { ActionResult } from '@/types/api'
import styles from './styles.module.scss'

type NameValues = { name: string }

type ButtonVariant = ComponentProps<typeof Button>['variant']
type ButtonSize = ComponentProps<typeof Button>['size']

type NameDialogProps<T> = {
  /** The text of the button that opens the dialog; with `triggerAction`, its label. */
  trigger: string
  /** Makes the trigger a record action's icon button (`ActionButton`) labelled `trigger`. */
  triggerAction?: RecordAction
  triggerVariant?: ButtonVariant
  triggerSize?: ButtonSize
  title: string
  description?: string
  label: string
  /** `genreInput` or `personInput`: one `name` field with its own bounds and messages. */
  schema: z.ZodType<NameValues, NameValues>
  /** Renaming: the current name. Creating: left out. */
  defaultName?: string
  submitLabel: string
  disabled?: boolean
  onSubmit: (values: NameValues) => Promise<ActionResult<T>>
  /** After a success, once the dialog has closed (toast, select the new record). */
  onDone?: (data: T) => void
}

/** A one-field dialog that creates or renames a genre or a person. */
export const NameDialog = <T,>({
  trigger,
  triggerAction,
  triggerVariant = 'outline',
  triggerSize = 'sm',
  title,
  description,
  label,
  schema,
  defaultName = '',
  submitLabel,
  disabled = false,
  onSubmit,
  onDone,
}: NameDialogProps<T>) => {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NameValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: defaultName },
  })

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      reset({ name: defaultName })
    }
  }

  const submit = handleSubmit(async (values) => {
    const result = await onSubmit(values)
    if (result.ok) {
      handleOpenChange(false)
      onDone?.(result.data)
      return
    }
    applyActionErrors(result, ['name'], setError)
  })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {triggerAction ? (
        <DialogTrigger
          render={<ActionButton action={triggerAction} label={trigger} disabled={disabled} />}
        />
      ) : (
        <DialogTrigger
          render={
            <Button type="button" variant={triggerVariant} size={triggerSize} disabled={disabled} />
          }
        >
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent>
        <form className={styles.form} onSubmit={submit} noValidate>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <Input
            label={label}
            required
            autoFocus
            error={errors.name?.message}
            {...register('name')}
          />
          {errors.root?.server && (
            <p className={styles.formError} role="alert">
              {errors.root.server.message}
            </p>
          )}
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="secondary" />}>Cancel</DialogClose>
            <LoadingButton type="submit" loading={isSubmitting}>
              {submitLabel}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
