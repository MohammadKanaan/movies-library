'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { deletePersonAction } from '@/actions/people'
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
import { ROUTE_PEOPLE } from '@/lib/constants-routes'

type DeletePersonDialogProps = {
  person: { id: string; name: string }
}

/** Asks before deleting an uncredited person, then returns to the people list. */
export const DeletePersonDialog = ({ person }: DeletePersonDialogProps) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const confirm = () => {
    startTransition(async () => {
      const result = await deletePersonAction(person.id)
      if (!result.ok) {
        toast.error(result.message)
        return
      }
      setOpen(false)
      toast.success(`${person.name} was deleted`)
      router.push(ROUTE_PEOPLE)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<ActionButton action="delete" label={`Delete ${person.name}`} />} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {person.name}?</DialogTitle>
          <DialogDescription>They are credited on nothing, so no movie changes.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="secondary" />}>Cancel</DialogClose>
          <LoadingButton type="button" variant="destructive" loading={isPending} onClick={confirm}>
            Delete person
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
