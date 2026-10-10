import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { deletePersonAction } from '@/actions/people'
import { DeletePersonDialog } from '@/components/People/DeletePersonDialog'

const push = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))
vi.mock('@/actions/people', () => ({ deletePersonAction: vi.fn() }))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const PERSON = { id: '0190d1a2-0000-7000-8000-000000000001', name: 'Amy Adams' }

const confirmDelete = async () => {
  await userEvent.click(screen.getByRole('button', { name: 'Delete Amy Adams' }))
  await userEvent.click(await screen.findByRole('button', { name: 'Delete person' }))
}

describe('DeletePersonDialog', () => {
  beforeEach(() => {
    push.mockReset()
    vi.mocked(deletePersonAction).mockReset()
    vi.mocked(toast.success).mockReset()
    vi.mocked(toast.error).mockReset()
  })

  it('asks first, naming the person', async () => {
    render(<DeletePersonDialog person={PERSON} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Delete Amy Adams' }))
    expect(await screen.findByRole('heading', { name: 'Delete Amy Adams?' })).toBeInTheDocument()
    expect(deletePersonAction).not.toHaveBeenCalled()
  })

  it('deletes, confirms with a toast and returns to the list', async () => {
    vi.mocked(deletePersonAction).mockResolvedValue({ ok: true, data: undefined })
    render(<DeletePersonDialog person={PERSON} />)
    await confirmDelete()
    await waitFor(() => expect(push).toHaveBeenCalledWith('/people'))
    expect(deletePersonAction).toHaveBeenCalledWith(PERSON.id)
    expect(toast.success).toHaveBeenCalledWith('Amy Adams was deleted')
  })

  it('stays open and reports a failure', async () => {
    vi.mocked(deletePersonAction).mockResolvedValue({
      ok: false,
      code: 'FORBIDDEN',
      message: 'You are not allowed to do that',
    })
    render(<DeletePersonDialog person={PERSON} />)
    await confirmDelete()
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('You are not allowed to do that'))
    expect(push).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
