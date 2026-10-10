import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CommentForm } from '@/components/Reviews/CommentForm'

const OK = { ok: true, data: null } as const

describe('CommentForm', () => {
  it('asks for text before it submits', async () => {
    const onSubmit = vi.fn()
    render(<CommentForm onSubmit={onSubmit} submitLabel="Post comment" />)
    await userEvent.click(screen.getByRole('button', { name: 'Post comment' }))
    expect(await screen.findByText('Write a comment')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits the trimmed text and empties the box once it is saved', async () => {
    const onSubmit = vi.fn().mockResolvedValue(OK)
    render(<CommentForm onSubmit={onSubmit} submitLabel="Post comment" />)
    const box = screen.getByRole('textbox', { name: 'Comment' })
    await userEvent.type(box, '  Agreed.  ')
    await userEvent.click(screen.getByRole('button', { name: 'Post comment' }))
    expect(onSubmit).toHaveBeenCalledWith({ body: 'Agreed.' })
    expect(box).toHaveValue('')
  })

  it('keeps the text when saving fails', async () => {
    const onSubmit = vi.fn().mockResolvedValue({
      ok: false,
      code: 'RATE_LIMITED',
      message: 'Too many attempts.',
    })
    render(<CommentForm onSubmit={onSubmit} submitLabel="Post comment" />)
    const box = screen.getByRole('textbox', { name: 'Comment' })
    await userEvent.type(box, 'Agreed.')
    await userEvent.click(screen.getByRole('button', { name: 'Post comment' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Too many attempts.')
    expect(box).toHaveValue('Agreed.')
  })

  it('puts a server field error on its field', async () => {
    const onSubmit = vi.fn().mockResolvedValue({
      ok: false,
      code: 'VALIDATION',
      message: 'Validation failed',
      fieldErrors: { body: ['Comment must be 2000 characters or fewer'] },
    })
    render(<CommentForm onSubmit={onSubmit} submitLabel="Post comment" />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Comment' }), 'Hi')
    await userEvent.click(screen.getByRole('button', { name: 'Post comment' }))
    expect(await screen.findByText('Comment must be 2000 characters or fewer')).toBeInTheDocument()
  })

  it('starts from the comment being edited and can be cancelled', async () => {
    const onCancel = vi.fn()
    render(
      <CommentForm
        comment={{ body: 'Fine.' }}
        onSubmit={vi.fn()}
        submitLabel="Save comment"
        onCancel={onCancel}
      />,
    )
    expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveValue('Fine.')
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
