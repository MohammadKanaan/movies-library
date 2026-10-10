import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CreditsEditor } from '@/components/Admin/Movies/CreditsEditor'
import type { PersonPickerProps } from '@/components/Admin/Movies/PersonPicker'
import { MOVIE_CREDITS_MAX, type CreditInput } from '@/lib/dto/movies'
import type { PersonSummary } from '@/lib/dto/people'

const picked: PersonSummary = {
  id: 'new',
  slug: 'new-person',
  name: 'New Person',
  headshotUrl: null,
}

vi.mock('@/components/Admin/Movies/PersonPicker', () => ({
  PersonPicker: ({ label, excludeIds, disabled, onPick }: PersonPickerProps) => (
    <button
      type="button"
      disabled={disabled}
      data-exclude={(excludeIds ?? []).join(',')}
      onClick={() => onPick(picked)}
    >
      {label}
    </button>
  ),
}))

const person = (id: string, name: string): PersonSummary => ({
  id,
  slug: id,
  name,
  headshotUrl: null,
})
const people = {
  d1: person('d1', 'Dana Director'),
  d2: person('d2', 'Dev Director'),
  w1: person('w1', 'Wren Writer'),
  a1: person('a1', 'Alex Actor'),
  a2: person('a2', 'Avery Actor'),
}
const credits: CreditInput[] = [
  { personId: 'd1', role: 'DIRECTOR' },
  { personId: 'd2', role: 'DIRECTOR' },
  { personId: 'w1', role: 'WRITER' },
  { personId: 'a1', role: 'ACTOR' },
  { personId: 'a2', role: 'ACTOR' },
]

const setup = (props: Partial<Parameters<typeof CreditsEditor>[0]> = {}) => {
  const onChange = vi.fn()
  render(<CreditsEditor value={credits} people={people} onChange={onChange} {...props} />)
  return { onChange }
}

const section = (name: string) =>
  within(screen.getByRole('heading', { name }).closest('section') as HTMLElement)

describe('CreditsEditor', () => {
  it('lists each role under its heading in order', () => {
    setup()
    const headings = screen.getAllByRole('heading').map((heading) => heading.textContent)
    expect(headings).toEqual(['Directors', 'Writers', 'Cast'])
    const directors = section('Directors').getAllByRole('listitem')
    expect(directors).toHaveLength(2)
    expect(directors[0]).toHaveTextContent('1')
    expect(directors[0]).toHaveTextContent('Dana Director')
    expect(directors[1]).toHaveTextContent('Dev Director')
    expect(section('Writers').getAllByRole('listitem')).toHaveLength(1)
    expect(section('Cast').getAllByRole('listitem')[1]).toHaveTextContent('Avery Actor')
  })

  it('disables Move up on the first row and Move down on the last of a role', () => {
    setup()
    expect(screen.getByRole('button', { name: 'Move Dana Director up' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Move Dev Director down' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Move Dana Director down' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Move Wren Writer up' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Move Wren Writer down' })).toBeDisabled()
  })

  it('moves a credit down within its role and returns the whole flat list', async () => {
    const { onChange } = setup()
    await userEvent.click(screen.getByRole('button', { name: 'Move Dana Director down' }))
    expect(onChange).toHaveBeenCalledWith(
      [
        { personId: 'd2', role: 'DIRECTOR' },
        { personId: 'd1', role: 'DIRECTOR' },
        { personId: 'w1', role: 'WRITER' },
        { personId: 'a1', role: 'ACTOR' },
        { personId: 'a2', role: 'ACTOR' },
      ],
      people,
    )
  })

  it('moves a credit up within its role', async () => {
    const { onChange } = setup()
    await userEvent.click(screen.getByRole('button', { name: 'Move Avery Actor up' }))
    expect(onChange).toHaveBeenCalledWith(
      [
        { personId: 'd1', role: 'DIRECTOR' },
        { personId: 'd2', role: 'DIRECTOR' },
        { personId: 'w1', role: 'WRITER' },
        { personId: 'a2', role: 'ACTOR' },
        { personId: 'a1', role: 'ACTOR' },
      ],
      people,
    )
  })

  describe('dragging', () => {
    const ROW_HEIGHT = 40

    /** jsdom has no layout: give every row a 40px slot in list order so the drag can measure them. */
    const layOutRows = () => {
      vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
        this: Element,
      ) {
        const row = this.closest('li')
        const index = row ? Array.from(row.parentElement?.children ?? []).indexOf(row) : 0
        const top = this.tagName === 'OL' ? 0 : index * ROW_HEIGHT
        const height = this.tagName === 'OL' ? ROW_HEIGHT * 10 : ROW_HEIGHT
        return DOMRect.fromRect({ x: 0, y: top, width: 400, height })
      })
    }

    /** dnd-kit swallows clicks on the document for 50ms after a drag (the drop's own click). */
    const CLICK_GUARD_MS = 50

    afterEach(async () => {
      vi.restoreAllMocks()
      await new Promise((resolve) => setTimeout(resolve, CLICK_GUARD_MS + 10))
    })

    const dragRow = (name: string, rows: number) => {
      const row = screen.getByText(name).closest('li') as HTMLElement
      const handle = row.querySelector('[aria-hidden="true"]') as HTMLElement
      fireEvent.pointerDown(handle, { button: 0, isPrimary: true, clientX: 10, clientY: 20 })
      fireEvent.pointerMove(document, { clientX: 10, clientY: 30 })
      fireEvent.pointerMove(document, { clientX: 10, clientY: 20 + rows * ROW_HEIGHT })
      fireEvent.pointerUp(document, { clientX: 10, clientY: 20 + rows * ROW_HEIGHT })
    }

    it('moves a credit to where it is dropped within its role', () => {
      layOutRows()
      const { onChange } = setup({
        value: [
          { personId: 'a1', role: 'ACTOR' },
          { personId: 'a2', role: 'ACTOR' },
          { personId: 'd1', role: 'ACTOR' },
        ],
      })
      dragRow('Alex Actor', 2)
      expect(onChange).toHaveBeenCalledWith(
        [
          { personId: 'a2', role: 'ACTOR' },
          { personId: 'd1', role: 'ACTOR' },
          { personId: 'a1', role: 'ACTOR' },
        ],
        people,
      )
    })

    it('does not drag while the editor is disabled', () => {
      layOutRows()
      const { onChange } = setup({ disabled: true })
      dragRow('Dana Director', 1)
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  it('offers a star checkbox on cast rows only', () => {
    setup({
      value: credits.map((credit) =>
        credit.personId === 'a2' ? { ...credit, star: true } : credit,
      ),
    })
    expect(screen.getAllByRole('checkbox')).toHaveLength(2)
    expect(section('Directors').queryByRole('checkbox')).toBeNull()
    expect(section('Writers').queryByRole('checkbox')).toBeNull()
    expect(screen.getByRole('checkbox', { name: 'Star Alex Actor' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Star Avery Actor' })).toBeChecked()
  })

  it('stars and unstars a cast member, keeping their place', async () => {
    const { onChange } = setup()
    await userEvent.click(screen.getByRole('checkbox', { name: 'Star Avery Actor' }))
    expect(onChange).toHaveBeenLastCalledWith(
      [...credits.slice(0, 4), { personId: 'a2', role: 'ACTOR', star: true }],
      people,
    )
  })

  it('carries the star with a cast member who moves', async () => {
    const { onChange } = setup({
      value: credits.map((credit) =>
        credit.personId === 'a2' ? { ...credit, star: true } : credit,
      ),
    })
    await userEvent.click(screen.getByRole('button', { name: 'Move Avery Actor up' }))
    expect(onChange).toHaveBeenCalledWith(
      [
        ...credits.slice(0, 3),
        { personId: 'a2', role: 'ACTOR', star: true },
        { personId: 'a1', role: 'ACTOR' },
      ],
      people,
    )
  })

  it('removes a credit', async () => {
    const { onChange } = setup()
    await userEvent.click(screen.getByRole('button', { name: 'Remove Wren Writer' }))
    expect(onChange).toHaveBeenCalledWith(
      credits.filter((credit) => credit.personId !== 'w1'),
      people,
    )
  })

  it('appends a picked person to the end of that role and adds them to people', async () => {
    const { onChange } = setup()
    await userEvent.click(screen.getByRole('button', { name: 'Add a director' }))
    expect(onChange).toHaveBeenCalledWith(
      [
        { personId: 'd1', role: 'DIRECTOR' },
        { personId: 'd2', role: 'DIRECTOR' },
        { personId: 'new', role: 'DIRECTOR' },
        { personId: 'w1', role: 'WRITER' },
        { personId: 'a1', role: 'ACTOR' },
        { personId: 'a2', role: 'ACTOR' },
      ],
      { ...people, new: picked },
    )
  })

  it('keeps the flat list grouped by role when it arrives out of order', async () => {
    const { onChange } = setup({
      value: [
        { personId: 'a1', role: 'ACTOR' },
        { personId: 'd1', role: 'DIRECTOR' },
      ],
    })
    await userEvent.click(screen.getByRole('button', { name: 'Add a writer' }))
    expect(onChange).toHaveBeenCalledWith(
      [
        { personId: 'd1', role: 'DIRECTOR' },
        { personId: 'new', role: 'WRITER' },
        { personId: 'a1', role: 'ACTOR' },
      ],
      { ...people, new: picked },
    )
  })

  it('excludes only the people already in that role from its picker', () => {
    setup({ value: [...credits, { personId: 'a1', role: 'DIRECTOR' }] })
    expect(screen.getByRole('button', { name: 'Add a director' })).toHaveAttribute(
      'data-exclude',
      'd1,d2,a1',
    )
    expect(screen.getByRole('button', { name: 'Add a writer' })).toHaveAttribute(
      'data-exclude',
      'w1',
    )
    expect(screen.getByRole('button', { name: 'Add a cast member' })).toHaveAttribute(
      'data-exclude',
      'a1,a2',
    )
  })

  it('lets the same person appear in two roles', async () => {
    const { onChange } = setup({
      value: [{ personId: 'new', role: 'ACTOR' }],
      people: { new: picked },
    })
    await userEvent.click(screen.getByRole('button', { name: 'Add a director' }))
    expect(onChange).toHaveBeenCalledWith(
      [
        { personId: 'new', role: 'DIRECTOR' },
        { personId: 'new', role: 'ACTOR' },
      ],
      { new: picked },
    )
  })

  it('ignores a pick of someone already in that role', async () => {
    const { onChange } = setup({
      value: [{ personId: 'new', role: 'ACTOR' }],
      people: { new: picked },
    })
    await userEvent.click(screen.getByRole('button', { name: 'Add a cast member' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('disables the pickers and says why at the credit limit', () => {
    const many: CreditInput[] = Array.from({ length: MOVIE_CREDITS_MAX }, (_, index) => ({
      personId: `p${index}`,
      role: 'ACTOR',
    }))
    setup({ value: many, people: {} })
    expect(screen.getByRole('button', { name: 'Add a director' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Add a cast member' })).toBeDisabled()
    expect(screen.getByText(/Credit limit reached/)).toHaveTextContent(
      `up to ${MOVIE_CREDITS_MAX} credits`,
    )
  })
})
