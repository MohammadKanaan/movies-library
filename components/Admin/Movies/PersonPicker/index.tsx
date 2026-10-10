'use client'

import { useEffect, useRef, useState } from 'react'
import { createPersonAction } from '@/actions/people'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/SCN/combobox'
import { RequestError } from '@/lib/client/errors'
import { searchPeople } from '@/lib/client/people'
import { SEARCH_MIN_LENGTH } from '@/lib/dto/common'
import type { PersonListItem, PersonSummary } from '@/lib/dto/people'
import styles from './styles.module.scss'

const SEARCH_DEBOUNCE_MS = 250

export type PersonPickerProps = {
  /** The accessible name of the input, e.g. "Add a director". */
  label: string
  /** People already listed: shown disabled with "Already listed". */
  excludeIds?: string[]
  disabled?: boolean
  /** Called once a person is chosen or created; the picker then clears itself. */
  onPick: (person: PersonSummary) => void
}

type Option = { kind: 'person'; person: PersonListItem } | { kind: 'create'; name: string }

type Search = { status: 'idle' | 'loading' | 'done'; results: PersonListItem[] }

const IDLE: Search = { status: 'idle', results: [] }

// A DOMException is not always an `Error` (jsdom), so go by its name.
const isAbort = (error: unknown) =>
  typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError'

const optionLabel = (option: Option) =>
  option.kind === 'person' ? option.person.name : option.name

const optionKey = (option: Option) =>
  option.kind === 'person' ? option.person.id : `create:${option.name}`

/**
 * A typeahead over `GET /api/v1/people` (debounced, previous request aborted) that also offers to
 * create the person when the name is not listed yet.
 */
export const PersonPicker = ({ label, excludeIds = [], disabled, onPick }: PersonPickerProps) => {
  const [inputValue, setInputValue] = useState('')
  const [search, setSearch] = useState<Search>(IDLE)
  const [message, setMessage] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const controller = useRef<AbortController | null>(null)

  const cancelSearch = () => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
    controller.current?.abort()
    controller.current = null
  }

  useEffect(() => cancelSearch, [])

  const runSearch = async (term: string) => {
    const current = new AbortController()
    controller.current = current
    try {
      const page = await searchPeople(term, current.signal)
      if (controller.current === current) {
        setSearch({ status: 'done', results: page.items })
      }
    } catch (error) {
      if (current.signal.aborted || isAbort(error) || controller.current !== current) {
        return
      }
      setSearch({ status: 'done', results: [] })
      setMessage(error instanceof RequestError ? error.message : 'The search failed. Try again.')
    }
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    setMessage(null)
    cancelSearch()
    const term = value.trim()
    if (term.length < SEARCH_MIN_LENGTH) {
      setSearch(IDLE)
      return
    }
    setSearch((previous) => ({ ...previous, status: 'loading' }))
    timer.current = setTimeout(() => {
      timer.current = null
      void runSearch(term)
    }, SEARCH_DEBOUNCE_MS)
  }

  const finish = (person: PersonSummary) => {
    cancelSearch()
    setInputValue('')
    setSearch(IDLE)
    setMessage(null)
    onPick(person)
  }

  const create = async (name: string) => {
    setCreating(true)
    setMessage(null)
    const result = await createPersonAction({ name })
    setCreating(false)
    if (result.ok) {
      const { id, slug, name, headshotUrl } = result.data
      finish({ id, slug, name, headshotUrl })
      return
    }
    setMessage(result.fieldErrors?.name?.[0] ?? result.message)
  }

  const handleValueChange = (option: Option | null) => {
    if (!option) {
      return
    }
    if (option.kind === 'person') {
      const { id, slug, name, headshotUrl } = option.person
      finish({ id, slug, name, headshotUrl })
      return
    }
    void create(option.name)
  }

  const locked = disabled || creating
  const term = inputValue.trim()
  const searching = term.length >= SEARCH_MIN_LENGTH
  const hasExactMatch = search.results.some(
    (person) => person.name.toLowerCase() === term.toLowerCase(),
  )
  const options: Option[] = searching
    ? [
        ...search.results.map((person): Option => ({ kind: 'person', person })),
        ...(hasExactMatch ? [] : [{ kind: 'create', name: term } satisfies Option]),
      ]
    : []

  return (
    <div className={styles.picker}>
      <Combobox
        items={options}
        filter={null}
        value={null}
        onValueChange={handleValueChange}
        inputValue={inputValue}
        onInputValueChange={(value, details) => {
          // Picking an item would write its label into the input; the picker clears itself instead.
          if (details.reason !== 'item-press') {
            handleInputChange(value)
          }
        }}
        itemToStringLabel={optionLabel}
        disabled={locked}
      >
        <ComboboxInput
          aria-label={label}
          placeholder={label}
          showTrigger={false}
          disabled={locked}
        />
        <ComboboxContent>
          <ComboboxEmpty>Type at least {SEARCH_MIN_LENGTH} letters</ComboboxEmpty>
          {searching && search.status === 'loading' && <p className={styles.status}>Searching…</p>}
          {searching && search.status === 'done' && search.results.length === 0 && (
            <p className={styles.status}>No one found</p>
          )}
          <ComboboxList>
            {(option: Option) => (
              <ComboboxItem
                key={optionKey(option)}
                value={option}
                disabled={option.kind === 'person' && excludeIds.includes(option.person.id)}
              >
                {option.kind === 'person' ? (
                  <span className={styles.person}>
                    <span>{option.person.name}</span>
                    <span className={styles.slug}>{option.person.slug}</span>
                    {excludeIds.includes(option.person.id) && (
                      <span className={styles.slug}>Already listed</span>
                    )}
                  </span>
                ) : (
                  <span>Add “{option.name}” as a new person</span>
                )}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {message && (
        <p className={styles.error} role="alert">
          {message}
        </p>
      )}
    </div>
  )
}
