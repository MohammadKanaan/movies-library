'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { deleteReviewAction } from '@/actions/reviews'
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

type DeleteReviewDialogProps = {
  review: { id: string }
  /** Where to go once it is deleted (the review's own page has nothing left to show). */
  redirectTo?: string
}

/** Asks before deleting a review; its rating stops counting toward the movie's average. */
export const DeleteReviewDialog = ({ review, redirectTo }: DeleteReviewDialogProps) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const confirm = () => {
    startTransition(async () => {
      const result = await deleteReviewAction(review.id)
      if (!result.ok) {
        toast.error(result.message)
        return
      }
      setOpen(false)
      toast.success('The review was deleted')
      if (redirectTo) {
        router.push(redirectTo)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="destructive" size="sm" />}>
        Delete
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this review?</DialogTitle>
          <DialogDescription>
            The rating and the text are removed, and the rating no longer counts toward the
            movie&apos;s average.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="secondary" />}>Cancel</DialogClose>
          <LoadingButton type="button" variant="destructive" loading={isPending} onClick={confirm}>
            Delete review
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
