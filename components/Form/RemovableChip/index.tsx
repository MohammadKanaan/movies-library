'use client'

import { Combobox as ComboboxPrimitive } from '@base-ui/react'
import { XIcon } from 'lucide-react'
import { Button } from '@/components/SCN/button'
import { ComboboxChip } from '@/components/SCN/combobox'
import styles from './styles.module.scss'

type RemovableChipProps = {
  /** What the chip stands for; names the chip and its remove button ("Remove Action"). */
  label: string
}

/**
 * A picked item in a multi-select combobox. The stock `ComboboxChip`'s remove button has no
 * accessible name, so this one hides it and renders its own, named after the item. The button stays
 * out of the tab order like the stock one: keyboard users remove a chip with Backspace.
 */
export const RemovableChip = ({ label }: RemovableChipProps) => {
  return (
    <ComboboxChip aria-label={label} showRemove={false}>
      {label}
      <ComboboxPrimitive.ChipRemove
        render={<Button variant="ghost" size="icon-xs" />}
        className={styles.remove}
        aria-label={`Remove ${label}`}
        data-slot="combobox-chip-remove"
      >
        <XIcon aria-hidden="true" />
      </ComboboxPrimitive.ChipRemove>
    </ComboboxChip>
  )
}
