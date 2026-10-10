'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { deleteCommentAction } from '@/actions/reviewComments'
import { ActionButton } from '@/components/ActionButton'
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

type DeleteCommentDialogProps = {
  comment: { id: string }
}

/** Asks before deleting a comment. */
export const DeleteCommentDialog = ({ comment }: DeleteCommentDialogProps) => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const confirm = () => {
    startTransition(async () => {
      const result = await deleteCommentAction(comment.id)
      if (!result.ok) {
        toast.error(result.message)
        return
      }
      setOpen(false)
      toast.success('The comment was deleted')
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<ActionButton action="delete" label="Delete comment" />} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this comment?</DialogTitle>
          <DialogDescription>The comment is removed from the review.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="secondary" />}>Cancel</DialogClose>
          <LoadingButton type="button" variant="destructive" loading={isPending} onClick={confirm}>
            Delete comment
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
