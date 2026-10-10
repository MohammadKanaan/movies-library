import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ReviewForm } from '@/components/Reviews/ReviewForm'

const OK = { ok: true, data: null } as const

// Base UI's checkbox is a `span role="checkbox"`, so it reports disabled through ARIA.
const SPOILERS = { name: 'Contains spoilers' }

describe('ReviewForm', () => {
  it('asks for a rating before it submits', async () => {
    const onSubmit = vi.fn()
    render(<ReviewForm onSubmit={onSubmit} submitLabel="Post review" />)
    await userEvent.click(screen.getByRole('button', { name: 'Post review' }))
    expect(await screen.findByText('Pick a rating from ½ to 5 stars')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits a rating alone', async () => {
    const onSubmit = vi.fn().mockResolvedValue(OK)
    render(<ReviewForm onSubmit={onSubmit} submitLabel="Post review" />)
    await userEvent.click(screen.getByRole('radio', { name: '3.5 stars' }))
    await userEvent.click(screen.getByRole('button', { name: 'Post review' }))
    expect(onSubmit).toHaveBeenCalledWith({ rating: 3.5, body: null, spoiler: false })
  })

  it('keeps the spoiler checkbox off until there is text', async () => {
    render(<ReviewForm onSubmit={vi.fn()} submitLabel="Post review" />)
    const spoiler = screen.getByRole('checkbox', SPOILERS)
    expect(spoiler).toHaveAttribute('aria-disabled', 'true')
    await userEvent.type(screen.getByLabelText(/Review/), 'Great ending')
    expect(spoiler).not.toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(spoiler)
    expect(spoiler).toBeChecked()
  })

  it('takes the spoiler flag back when the text is cleared', async () => {
    render(<ReviewForm onSubmit={vi.fn()} submitLabel="Post review" />)
    const text = screen.getByLabelText(/Review/)
    await userEvent.type(text, 'Great ending')
    await userEvent.click(screen.getByRole('checkbox', SPOILERS))
    await userEvent.clear(text)
    const spoiler = screen.getByRole('checkbox', SPOILERS)
    expect(spoiler).toHaveAttribute('aria-disabled', 'true')
    expect(spoiler).not.toBeChecked()
  })

  it('submits the trimmed text with its spoiler flag', async () => {
    const onSubmit = vi.fn().mockResolvedValue(OK)
    render(<ReviewForm onSubmit={onSubmit} submitLabel="Post review" />)
    await userEvent.click(screen.getByRole('radio', { name: '5 stars' }))
    await userEvent.type(screen.getByLabelText(/Review/), '  Vader is his father  ')
    await userEvent.click(screen.getByRole('checkbox', SPOILERS))
    await userEvent.click(screen.getByRole('button', { name: 'Post review' }))
    expect(onSubmit).toHaveBeenCalledWith({
      rating: 5,
      body: 'Vader is his father',
      spoiler: true,
    })
  })

  it('starts from the review being edited', () => {
    render(
      <ReviewForm
        review={{ rating: 2.5, body: 'Fine.', spoiler: true }}
        onSubmit={vi.fn()}
        submitLabel="Save review"
        onCancel={vi.fn()}
      />,
    )
    expect(screen.getByRole('radio', { name: '2.5 stars' })).toBeChecked()
    expect(screen.getByLabelText(/Review/)).toHaveValue('Fine.')
    expect(screen.getByRole('checkbox', SPOILERS)).toBeChecked()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('puts a server field error on its field', async () => {
    const onSubmit = vi.fn().mockResolvedValue({
      ok: false,
      code: 'VALIDATION',
      message: 'Validation failed',
      fieldErrors: { rating: ['Pick a rating from ½ to 5 stars'] },
    })
    render(<ReviewForm onSubmit={onSubmit} submitLabel="Post review" />)
    await userEvent.click(screen.getByRole('radio', { name: '4 stars' }))
    await userEvent.click(screen.getByRole('button', { name: 'Post review' }))
    expect(await screen.findByText('Pick a rating from ½ to 5 stars')).toBeInTheDocument()
  })

  it('shows a form-level failure as an alert', async () => {
    const onSubmit = vi.fn().mockResolvedValue({
      ok: false,
      code: 'VALIDATION',
      message: 'You have already reviewed this movie',
      fieldErrors: { base: ['You have already reviewed this movie'] },
    })
    render(<ReviewForm onSubmit={onSubmit} submitLabel="Post review" />)
    await userEvent.click(screen.getByRole('radio', { name: '4 stars' }))
    await userEvent.click(screen.getByRole('button', { name: 'Post review' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'You have already reviewed this movie',
    )
  })
})
