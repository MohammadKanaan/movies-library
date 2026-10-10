'use client'

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/SCN/combobox'
import { Label } from '@/components/SCN/label'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import { searchPeople } from '@/lib/client/people'
import { SEARCH_MIN_LENGTH } from '@/lib/dto/common'
import type { PersonSummary } from '@/lib/dto/people'
import { useId } from 'react'
import styles from './styles.module.scss'

type PersonFilterProps = {
  /** The person the list is filtered to, or null. */
  value: PersonSummary | null
  onChange: (person: PersonSummary | null) => void
  disabled?: boolean
}

const toSummary = ({ id, slug, name, headshotUrl }: PersonSummary): PersonSummary => ({
  id,
  slug,
  name,
  headshotUrl,
})

/**
 * The advanced search's person field: a typeahead over `GET /api/v1/people` that keeps one
 * person selected; clearing the field (its button, or emptying the text) selects no one.
 */
export const PersonFilter = ({ value, onChange, disabled }: PersonFilterProps) => {
  const inputId = useId()
  const search = useDebouncedSearch(searchPeople)
  const options = (search.result?.items ?? []).map(toSummary)

  return (
    <div className={styles.field}>
      <Label htmlFor={inputId}>Person</Label>
      <Combobox
        items={options}
        filter={null}
        value={value}
        onValueChange={(person) => {
          search.reset()
          onChange(person)
        }}
        onInputValueChange={(text, details) => {
          if (details.reason === 'item-press') {
            return
          }
          search.setTerm(text)
          if (text.trim() === '' && value) {
            onChange(null)
          }
        }}
        itemToStringLabel={(person) => person.name}
        isItemEqualToValue={(a, b) => a.id === b.id}
        disabled={disabled}
      >
        <ComboboxInput
          id={inputId}
          placeholder="Anyone credited"
          autoComplete="off"
          showTrigger={false}
          showClear
          disabled={disabled}
        />
        <ComboboxContent>
          <ComboboxEmpty>Type at least {SEARCH_MIN_LENGTH} letters of a name</ComboboxEmpty>
          {search.status === 'loading' && !search.result && (
            <p className={styles.status}>Searching…</p>
          )}
          {search.error && (
            <p className={styles.status} role="alert">
              {search.error}
            </p>
          )}
          {search.status === 'done' && options.length === 0 && !search.error && (
            <p className={styles.status}>No one found</p>
          )}
          <ComboboxList>
            {(person: PersonSummary) => (
              <ComboboxItem key={person.id} value={person}>
                {person.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
