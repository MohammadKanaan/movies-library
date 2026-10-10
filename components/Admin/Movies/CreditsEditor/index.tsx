'use client'

import { ArrowDown, ArrowUp, X } from 'lucide-react'
import { useId } from 'react'
import { PersonPicker } from '@/components/Admin/Movies/PersonPicker'
import { Button } from '@/components/SCN/button'
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

/** Directors, writers and cast as three ordered lists, each with a typeahead to add people. */
export const CreditsEditor = ({ value, people, onChange, error, disabled }: CreditsEditorProps) => {
  const baseId = useId()
  const errorId = `${baseId}-error`
  const atCap = value.length >= MOVIE_CREDITS_MAX

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
    const run = [...runOf(role)]
    ;[run[from], run[to]] = [run[to], run[from]]
    replaceRun(role, run)
  }

  const remove = (role: CreditRole, index: number) => {
    replaceRun(
      role,
      runOf(role).filter((_, position) => position !== index),
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
              <ol className={styles.list}>
                {run.map((credit, index) => {
                  const name = people[credit.personId]?.name ?? UNKNOWN_PERSON
                  return (
                    <li key={credit.personId} className={styles.row}>
                      <span className={styles.position}>{index + 1}</span>
                      <span className={styles.name}>{name}</span>
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
                    </li>
                  )
                })}
              </ol>
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
