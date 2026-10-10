'use client'

import { createContext, use } from 'react'
import { ActionButton } from '@/components/ActionButton'
import { ActionLink } from '@/components/ActionLink'

/** Set by `ViewerReview`: opens the viewer's review for editing in place. */
export const ReviewEditingContext = createContext<(() => void) | null>(null)

type EditReviewActionProps = {
  /** Where the review is edited, for a card outside `ViewerReview` (the review's own page). */
  href: string
}

/**
 * The review card's Edit action. Inside `ViewerReview` it opens the form in place; anywhere else
 * it links to where the form is.
 */
export const EditReviewAction = ({ href }: EditReviewActionProps) => {
  const startEditing = use(ReviewEditingContext)

  if (startEditing) {
    return <ActionButton action="edit" label="Edit review" onClick={startEditing} />
  }
  return <ActionLink action="edit" label="Edit review" href={href} />
}
