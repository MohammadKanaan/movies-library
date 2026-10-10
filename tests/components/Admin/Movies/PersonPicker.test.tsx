import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPersonAction } from '@/actions/people'
import { PersonPicker } from '@/components/Admin/Movies/PersonPicker'
import { RequestError } from '@/lib/client/errors'
import { searchPeople } from '@/lib/client/people'
import type { Page } from '@/lib/dto/common'
import type { PersonListItem } from '@/lib/dto/people'

vi.mock('@/lib/client/people', () => ({ searchPeople: vi.fn() }))
vi.mock('@/actions/people', () => ({ createPersonAction: vi.fn() }))

const person = (id: string, name: string): PersonListItem => ({
  id,
  slug: name.toLowerCase().replace(/\s+/g, '-'),
  name,
  creditCount: 1,
  createdAt: new Date('2024-01-01T00:00:00Z'),
})

const pageOf = (items: PersonListItem[]): Page<PersonListItem> => ({
  items,
  page: 1,
  perPage: 10,
  totalItems: items.length,
  totalPages: 1,
})

const ada = person('p1', 'Ada Lovelace')
const adam = person('p2', 'Adam Driver')

const setup = (props: { excludeIds?: string[]; disabled?: boolean } = {}) => {
  const onPick = vi.fn()
  render(<PersonPicker label="Add a director" onPick={onPick} {...props} />)
  return { onPick, input: screen.getByRole('combobox', { name: 'Add a director' }) }
}

describe('PersonPicker', () => {
  beforeEach(() => {
    vi.mocked(searchPeople)
      .mockReset()
      .mockResolvedValue(pageOf([ada, adam]))
    vi.mocked(createPersonAction).mockReset()
  })

  it('shows the hint and searches nothing below the minimum length', async () => {
    const { input } = setup()
    await userEvent.type(input, 'ad')
    expect(await screen.findByText('Type at least 3 letters')).toBeInTheDocument()
    await new Promise((resolve) => setTimeout(resolve, 400))
    expect(searchPeople).not.toHaveBeenCalled()
  })

  it('searches once, debounced, from the minimum length and lists the results', async () => {
    const { input } = setup()
    await userEvent.type(input, 'ada')
    expect(await screen.findByRole('option', { name: /Ada Lovelace/ })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Adam Driver/ })).toBeInTheDocument()
    expect(searchPeople).toHaveBeenCalledTimes(1)
    expect(searchPeople).toHaveBeenCalledWith('ada', expect.any(AbortSignal))
  })

  it('shows excluded people as disabled with Already listed', async () => {
    const { input } = setup({ excludeIds: ['p1'] })
    await userEvent.type(input, 'ada')
    const option = await screen.findByRole('option', { name: /Ada Lovelace/ })
    expect(option).toHaveAttribute('aria-disabled', 'true')
    expect(option).toHaveTextContent('Already listed')
    expect(screen.getByRole('option', { name: /Adam Driver/ })).not.toHaveAttribute(
      'aria-disabled',
      'true',
    )
  })

  it('picks a result, reports it and clears the input', async () => {
    const { input, onPick } = setup()
    await userEvent.type(input, 'ada')
    await userEvent.click(await screen.findByRole('option', { name: /Adam Driver/ }))
    expect(onPick).toHaveBeenCalledWith({ id: 'p2', slug: 'adam-driver', name: 'Adam Driver' })
    expect(input).toHaveValue('')
  })

  it('says when no one is found and still offers to add the person', async () => {
    vi.mocked(searchPeople).mockResolvedValue(pageOf([]))
    const { input } = setup()
    await userEvent.type(input, 'zed')
    expect(await screen.findByText('No one found')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Add “zed” as a new person' })).toBeInTheDocument()
  })

  it('creates a new person and reports it', async () => {
    vi.mocked(createPersonAction).mockResolvedValue({
      ok: true,
      data: {
        id: 'p9',
        slug: 'ada',
        name: 'Ada',
      } as never,
    })
    const { input, onPick } = setup()
    await userEvent.type(input, ' Ada ')
    await userEvent.click(await screen.findByRole('option', { name: 'Add “Ada” as a new person' }))
    expect(createPersonAction).toHaveBeenCalledWith({ name: 'Ada' })
    await waitFor(() => expect(onPick).toHaveBeenCalledWith({ id: 'p9', slug: 'ada', name: 'Ada' }))
    expect(input).toHaveValue('')
  })

  it('does not offer to add a person whose name matches a result exactly', async () => {
    const { input } = setup()
    await userEvent.type(input, 'ada lovelace')
    await screen.findByRole('option', { name: /Ada Lovelace/ })
    expect(screen.queryByRole('option', { name: /as a new person/ })).not.toBeInTheDocument()
  })

  it('shows the first field error when creating fails', async () => {
    vi.mocked(createPersonAction).mockResolvedValue({
      ok: false,
      code: 'VALIDATION',
      message: 'Invalid',
      fieldErrors: { name: ['Name is too long'] },
    })
    const { input, onPick } = setup()
    await userEvent.type(input, 'Ada')
    await userEvent.click(await screen.findByRole('option', { name: 'Add “Ada” as a new person' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Name is too long')
    expect(onPick).not.toHaveBeenCalled()
  })

  it('shows the failure message when creating fails without field errors', async () => {
    vi.mocked(createPersonAction).mockResolvedValue({
      ok: false,
      code: 'FORBIDDEN',
      message: 'Not allowed',
    })
    const { input } = setup()
    await userEvent.type(input, 'Ada')
    await userEvent.click(await screen.findByRole('option', { name: 'Add “Ada” as a new person' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Not allowed')
  })

  it('shows the message of a failed search', async () => {
    vi.mocked(searchPeople).mockRejectedValue(
      new RequestError('The search failed. Try again.', 500),
    )
    const { input } = setup()
    await userEvent.type(input, 'ada')
    expect(await screen.findByRole('alert')).toHaveTextContent('The search failed. Try again.')
  })

  it('ignores an aborted search', async () => {
    vi.mocked(searchPeople).mockRejectedValue(new DOMException('Aborted', 'AbortError'))
    const { input } = setup()
    await userEvent.type(input, 'ada')
    await waitFor(() => expect(searchPeople).toHaveBeenCalled())
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('aborts the previous search when the term changes', async () => {
    const signals: AbortSignal[] = []
    vi.mocked(searchPeople).mockImplementation(async (_q, signal) => {
      if (signal) {
        signals.push(signal)
      }
      return new Promise(() => {})
    })
    const { input } = setup()
    await userEvent.type(input, 'ada')
    await waitFor(() => expect(signals).toHaveLength(1))
    await userEvent.type(input, 'm')
    await waitFor(() => expect(signals).toHaveLength(2))
    expect(signals[0].aborted).toBe(true)
    expect(signals[1].aborted).toBe(false)
  })

  it('disables the input when disabled', () => {
    const { input } = setup({ disabled: true })
    expect(input).toBeDisabled()
  })
})
