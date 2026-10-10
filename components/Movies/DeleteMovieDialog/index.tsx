'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { deleteMovieAction } from '@/actions/movies'
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
import { ROUTE_MOVIES } from '@/lib/constants-routes'

type DeleteMovieDialogProps = {
  movie: { id: string; title: string }
}

/** Asks before deleting a movie, then returns to the movie list. */
export const DeleteMovieDialog = ({ movie }: DeleteMovieDialogProps) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const confirm = () => {
    startTransition(async () => {
      const result = await deleteMovieAction(movie.id)
      if (!result.ok) {
        toast.error(result.message)
        return
      }
      setOpen(false)
      toast.success(`${movie.title} was deleted`)
      router.push(ROUTE_MOVIES)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<ActionButton action="delete" label={`Delete ${movie.title}`} />} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {movie.title}?</DialogTitle>
          <DialogDescription>
            Its credits and genre links go with it. The people and genres stay in the catalog.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="secondary" />}>Cancel</DialogClose>
          <LoadingButton type="button" variant="destructive" loading={isPending} onClick={confirm}>
            Delete movie
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
