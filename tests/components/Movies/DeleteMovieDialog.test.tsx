import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { deleteMovieAction } from '@/actions/movies'
import { DeleteMovieDialog } from '@/components/Movies/DeleteMovieDialog'

const push = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))
vi.mock('@/actions/movies', () => ({ deleteMovieAction: vi.fn() }))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const MOVIE = { id: '0190d1a2-0000-7000-8000-000000000001', title: 'Arrival' }

const confirmDelete = async () => {
  await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
  await userEvent.click(await screen.findByRole('button', { name: 'Delete movie' }))
}

describe('DeleteMovieDialog', () => {
  beforeEach(() => {
    push.mockReset()
    vi.mocked(deleteMovieAction).mockReset()
    vi.mocked(toast.success).mockReset()
    vi.mocked(toast.error).mockReset()
  })

  it('asks first, naming the movie', async () => {
    render(<DeleteMovieDialog movie={MOVIE} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(await screen.findByRole('heading', { name: 'Delete Arrival?' })).toBeInTheDocument()
    expect(deleteMovieAction).not.toHaveBeenCalled()
  })

  it('deletes, confirms with a toast and returns to the list', async () => {
    vi.mocked(deleteMovieAction).mockResolvedValue({ ok: true, data: undefined })
    render(<DeleteMovieDialog movie={MOVIE} />)
    await confirmDelete()
    await waitFor(() => expect(push).toHaveBeenCalledWith('/movies'))
    expect(deleteMovieAction).toHaveBeenCalledWith(MOVIE.id)
    expect(toast.success).toHaveBeenCalledWith('Arrival was deleted')
  })

  it('stays open and reports a failure', async () => {
    vi.mocked(deleteMovieAction).mockResolvedValue({
      ok: false,
      code: 'FORBIDDEN',
      message: 'You are not allowed to do that',
    })
    render(<DeleteMovieDialog movie={MOVIE} />)
    await confirmDelete()
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('You are not allowed to do that'))
    expect(push).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
