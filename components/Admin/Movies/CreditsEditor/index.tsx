'use client'

import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import clsx from 'clsx'
import { ArrowDown, ArrowUp, GripVertical, X } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { PersonPicker } from '@/components/Admin/Movies/PersonPicker'
import { Button } from '@/components/SCN/button'
import { Checkbox } from '@/components/SCN/checkbox'
import { Label } from '@/components/SCN/label'
import type { CreditRole } from '@/lib/dto/catalog'
import { MOVIE_CREDITS_MAX, type CreditInput } from '@/lib/dto/movies'
import type { PersonSummary } from '@/lib/dto/people'
import styles from './styles.module.scss'

export type CreditsEditorProps = {
  /** The ordered flat list of credits, as the DTO wants it. */
  value: CreditInput[]
  /** Names for every `personId` in `value` (and any picked later). */
  people: Record<string, PersonSummary>
  onChange: (credits: CreditInput[], people: Record<string, PersonSummary>) => void
  error?: string
  disabled?: boolean
}

type Section = { role: CreditRole; heading: string; pickerLabel: string }

/** The flat list stays grouped in this order; the DAL numbers positions per role from it. */
const SECTIONS: Section[] = [
  { role: 'DIRECTOR', heading: 'Directors', pickerLabel: 'Add a director' },
  { role: 'WRITER', heading: 'Writers', pickerLabel: 'Add a writer' },
  { role: 'ACTOR', heading: 'Cast', pickerLabel: 'Add a cast member' },
]

const UNKNOWN_PERSON = 'Unknown person'

/** A press on the handle only becomes a drag once the pointer has moved this far (px). */
const DRAG_THRESHOLD = 4

const DRAG_MODIFIERS = [restrictToVerticalAxis, restrictToParentElement]

type CreditRowProps = {
  personId: string
  disabled?: boolean
  children: ReactNode
}

/**
 * One credit that can be dragged by its handle. The row follows the pointer through a transform
 * (no re-layout), its neighbours make room with a transition. The handle is pointer-only: keyboard
 * and screen-reader users reorder with the row's Move up / Move down buttons.
 */
const CreditRow = ({ personId, disabled, children }: CreditRowProps) => {
  const { setNodeRef, setActivatorNodeRef, listeners, transform, transition, isDragging } =
    useSortable({ id: personId, disabled })

  return (
    <li
      ref={setNodeRef}
      className={clsx(styles.row, isDragging && styles.dragging)}
      style={{ transform: CSS.Translate.toString(transform), transition }}
    >
      <span
        ref={setActivatorNodeRef}
        className={styles.handle}
        aria-hidden="true"
        data-disabled={disabled || undefined}
        {...listeners}
      >
        <GripVertical />
      </span>
      {children}
    </li>
  )
}

/**
 * Directors, writers and cast as three ordered lists, each with a typeahead to add people. A credit
 * is reordered by dragging its handle or with its Move up / Move down buttons, within its own role.
 * Each cast member can be marked a star, a lead the movie's pages highlight.
 */
export const CreditsEditor = ({ value, people, onChange, error, disabled }: CreditsEditorProps) => {
  const baseId = useId()
  const errorId = `${baseId}-error`
  const atCap = value.length >= MOVIE_CREDITS_MAX
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: DRAG_THRESHOLD } }),
  )

  const runOf = (role: CreditRole) => value.filter((credit) => credit.role === role)

  const replaceRun = (
    role: CreditRole,
    run: CreditInput[],
    nextPeople: Record<string, PersonSummary> = people,
  ) => {
    onChange(
      SECTIONS.flatMap((section) => (section.role === role ? run : runOf(section.role))),
      nextPeople,
    )
  }

  const move = (role: CreditRole, from: number, to: number) => {
    replaceRun(role, arrayMove(runOf(role), from, to))
  }

  const drop = (role: CreditRole, { active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return
    }
    const ids = runOf(role).map((credit) => credit.personId)
    move(role, ids.indexOf(String(active.id)), ids.indexOf(String(over.id)))
  }

  const remove = (role: CreditRole, index: number) => {
    replaceRun(
      role,
      runOf(role).filter((_, position) => position !== index),
    )
  }

  const setStar = (index: number, star: boolean) => {
    replaceRun(
      'ACTOR',
      runOf('ACTOR').map((credit, position) => (position === index ? { ...credit, star } : credit)),
    )
  }

  const add = (role: CreditRole, person: PersonSummary) => {
    const run = runOf(role)
    if (run.some((credit) => credit.personId === person.id)) {
      return
    }
    replaceRun(role, [...run, { personId: person.id, role }], { ...people, [person.id]: person })
  }

  return (
    <div className={styles.editor} aria-describedby={error ? errorId : undefined}>
      {SECTIONS.map(({ role, heading, pickerLabel }) => {
        const run = runOf(role)
        return (
          <section key={role} className={styles.section} aria-labelledby={`${baseId}-${role}`}>
            <h3 id={`${baseId}-${role}`} className={styles.heading}>
              {heading}
            </h3>
            {run.length > 0 && (
              <DndContext
                id={`${baseId}-${role}-dnd`}
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={DRAG_MODIFIERS}
                onDragEnd={(event) => drop(role, event)}
              >
                <SortableContext
                  items={run.map((credit) => credit.personId)}
                  strategy={verticalListSortingStrategy}
                >
                  <ol className={styles.list}>
                    {run.map((credit, index) => {
                      const name = people[credit.personId]?.name ?? UNKNOWN_PERSON
                      const starId = `${baseId}-star-${credit.personId}`
                      return (
                        <CreditRow
                          key={credit.personId}
                          personId={credit.personId}
                          disabled={disabled}
                        >
                          <span className={styles.position}>{index + 1}</span>
                          <span className={styles.name}>{name}</span>
                          {role === 'ACTOR' && (
                            <span className={styles.star}>
                              <Checkbox
                                id={starId}
                                aria-label={`Star ${name}`}
                                checked={credit.star ?? false}
                                disabled={disabled}
                                onCheckedChange={(checked) => setStar(index, checked)}
                              />
                              <Label htmlFor={starId}>Star</Label>
                            </span>
                          )}
                          <span className={styles.actions}>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Move ${name} up`}
                              disabled={disabled || index === 0}
                              onClick={() => move(role, index, index - 1)}
                            >
                              <ArrowUp />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Move ${name} down`}
                              disabled={disabled || index === run.length - 1}
                              onClick={() => move(role, index, index + 1)}
                            >
                              <ArrowDown />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Remove ${name}`}
                              disabled={disabled}
                              onClick={() => remove(role, index)}
                            >
                              <X />
                            </Button>
                          </span>
                        </CreditRow>
                      )
                    })}
                  </ol>
                </SortableContext>
              </DndContext>
            )}
            <PersonPicker
              label={pickerLabel}
              excludeIds={run.map((credit) => credit.personId)}
              disabled={disabled || atCap}
              onPick={(person) => add(role, person)}
            />
          </section>
        )
      })}
      {atCap && (
        <p className={styles.hint}>Credit limit reached (up to {MOVIE_CREDITS_MAX} credits)</p>
      )}
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
