import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { createGenreAction, deleteGenreAction, updateGenreAction } from '@/actions/genres'
import { GenresView } from '@/components/Admin/Genres/GenresView'
import type { GenreWithCount } from '@/lib/dto/genres'

vi.mock('@/actions/genres', () => ({
  createGenreAction: vi.fn(),
  updateGenreAction: vi.fn(),
  deleteGenreAction: vi.fn(),
}))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const DRAMA_ID = '0190d1a2-0000-7000-8000-000000000001'
const NOIR_ID = '0190d1a2-0000-7000-8000-000000000002'

const drama: GenreWithCount = { id: DRAMA_ID, name: 'Drama', slug: 'drama', movieCount: 3 }
const noir: GenreWithCount = { id: NOIR_ID, name: 'Noir', slug: 'noir', movieCount: 0 }

const rows = () => screen.getAllByRole('row').slice(1)
const rowOf = (name: string) => {
  const row = rows().find((candidate) => within(candidate).queryByText(name))
  if (!row) {
    throw new Error(`No row for ${name}`)
  }
  return row
}

describe('GenresView', () => {
  beforeEach(() => {
    vi.mocked(createGenreAction).mockReset()
    vi.mocked(updateGenreAction).mockReset()
    vi.mocked(deleteGenreAction).mockReset()
    vi.mocked(toast.success).mockReset()
  })

  it('lists genres with their slug and a link to their movies', () => {
    render(<GenresView genres={[drama, noir]} />)
    expect(screen.getAllByRole('columnheader').map((cell) => cell.textContent)).toEqual([
      'Name',
      'Slug',
      'Movies',
      'Actions',
    ])
    const row = rowOf('Drama')
    expect(within(row).getByText('drama')).toBeInTheDocument()
    expect(within(row).getByRole('link', { name: '3' })).toHaveAttribute(
      'href',
      '/movies?genres=drama',
    )
    expect(within(rowOf('Noir')).getByText('0')).toBeInTheDocument()
  })

  it('adds a genre from the inline form and confirms', async () => {
    vi.mocked(createGenreAction).mockResolvedValue({
      ok: true,
      data: { id: 'g3', name: 'Western', slug: 'western', movieCount: 0 },
    })
    render(<GenresView genres={[drama]} />)
    await userEvent.type(screen.getByLabelText(/New genre/), '  Western ')
    await userEvent.click(screen.getByRole('button', { name: 'Add genre' }))
    await vi.waitFor(() => expect(createGenreAction).toHaveBeenCalledWith({ name: 'Western' }))
    expect(toast.success).toHaveBeenCalledWith('Western added')
    expect(screen.getByLabelText(/New genre/)).toHaveValue('')
  })

  it('shows a duplicate as a field error on the inline form', async () => {
    vi.mocked(createGenreAction).mockResolvedValue({
      ok: false,
      code: 'VALIDATION',
      message: 'Check the form',
      fieldErrors: { name: ['That genre already exists'] },
    })
    render(<GenresView genres={[drama]} />)
    await userEvent.type(screen.getByLabelText(/New genre/), 'Drama')
    await userEvent.click(screen.getByRole('button', { name: 'Add genre' }))
    expect(await screen.findByText('That genre already exists')).toBeInTheDocument()
    expect(toast.success).not.toHaveBeenCalled()
  })

  it('renames a genre through a dialog', async () => {
    vi.mocked(updateGenreAction).mockResolvedValue({
      ok: true,
      data: { ...noir, name: 'Film noir' },
    })
    render(<GenresView genres={[noir]} />)
    await userEvent.click(within(rowOf('Noir')).getByRole('button', { name: 'Rename Noir' }))
    const field = await screen.findByLabelText(/Name/)
    await userEvent.clear(field)
    await userEvent.type(field, 'Film noir')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    await vi.waitFor(() =>
      expect(updateGenreAction).toHaveBeenCalledWith({ id: NOIR_ID, name: 'Film noir' }),
    )
    expect(toast.success).toHaveBeenCalledWith('Genre renamed')
  })

  it('deletes an unused genre after confirmation, and refuses to offer it for one in use', async () => {
    vi.mocked(deleteGenreAction).mockResolvedValue({ ok: true, data: undefined })
    render(<GenresView genres={[drama, noir]} />)
    const inUse = within(rowOf('Drama')).getByRole('button', { name: 'Delete Drama' })
    expect(inUse).toBeDisabled()
    expect(inUse).toHaveAccessibleDescription('Remove the genre from its movies first')

    await userEvent.click(within(rowOf('Noir')).getByRole('button', { name: 'Delete Noir' }))
    await userEvent.click(await screen.findByRole('button', { name: 'Delete genre' }))
    await vi.waitFor(() => expect(deleteGenreAction).toHaveBeenCalledWith(NOIR_ID))
    expect(toast.success).toHaveBeenCalledWith('Noir deleted')
  })

  it('says so when there are no genres', () => {
    render(<GenresView genres={[]} />)
    expect(screen.getByText('No genres yet')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
