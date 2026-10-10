import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NameDialog } from '@/components/Admin/NameDialog'
import { genreInput } from '@/lib/dto/genres'

describe('NameDialog', () => {
  it('opens from its trigger with the current name and submits the trimmed, validated name', async () => {
    const onSubmit = vi.fn(async () => ({ ok: true as const, data: undefined }))
    const onDone = vi.fn()
    render(
      <NameDialog
        trigger="Rename"
        title="Rename Drama"
        label="Name"
        schema={genreInput}
        defaultName="Drama"
        submitLabel="Save"
        onSubmit={onSubmit}
        onDone={onDone}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Rename' }))
    const field = await screen.findByLabelText(/Name/)
    expect(field).toHaveValue('Drama')
    await userEvent.clear(field)
    await userEvent.type(field, '  Dramedy ')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ name: 'Dramedy' }))
    await vi.waitFor(() => expect(onDone).toHaveBeenCalledTimes(1))
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('refuses an empty name before calling the action', async () => {
    const onSubmit = vi.fn()
    render(
      <NameDialog
        trigger="Add genre"
        title="Add a genre"
        label="Name"
        schema={genreInput}
        submitLabel="Add"
        onSubmit={onSubmit}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Add genre' }))
    await userEvent.click(await screen.findByRole('button', { name: 'Add' }))
    expect(await screen.findByText('Name is required')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('puts a server field error on the field and keeps the dialog open', async () => {
    const onSubmit = vi.fn(async () => ({
      ok: false as const,
      code: 'VALIDATION' as const,
      message: 'Check the form',
      fieldErrors: { name: ['That genre already exists'] },
    }))
    render(
      <NameDialog
        trigger="Add genre"
        title="Add a genre"
        label="Name"
        schema={genreInput}
        submitLabel="Add"
        onSubmit={onSubmit}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Add genre' }))
    await userEvent.type(await screen.findByLabelText(/Name/), 'Drama')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(await screen.findByText('That genre already exists')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('resets the field when reopened after a cancel', async () => {
    render(
      <NameDialog
        trigger="Add person"
        title="Add a person"
        label="Name"
        schema={genreInput}
        submitLabel="Add"
        onSubmit={vi.fn()}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Add person' }))
    await userEvent.type(await screen.findByLabelText(/Name/), 'Greta')
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await userEvent.click(screen.getByRole('button', { name: 'Add person' }))
    expect(await screen.findByLabelText(/Name/)).toHaveValue('')
  })
})
