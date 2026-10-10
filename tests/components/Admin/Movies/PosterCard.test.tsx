import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { attachPosterAction, removePosterAction } from '@/actions/movies'
import { createUploadAction } from '@/actions/uploads'
import { PosterCard } from '@/components/Admin/Movies/PosterCard'
import { RequestError } from '@/lib/client/errors'
import { uploadFile } from '@/lib/client/uploads'

vi.mock('@/actions/uploads', () => ({ createUploadAction: vi.fn() }))
vi.mock('@/actions/movies', () => ({ attachPosterAction: vi.fn(), removePosterAction: vi.fn() }))
vi.mock('@/lib/client/uploads', () => ({ uploadFile: vi.fn() }))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const ticket = {
  key: 'posters/u/1',
  url: 'https://acct.r2.cloudflarestorage.com/bucket/k?X-Amz-Signature=s',
  headers: { 'Content-Type': 'image/png' },
}
const detail = { id: 'm1' } as never

const movie = { id: 'm1', title: 'Dune', posterUrl: null }
const withPoster = { ...movie, posterUrl: 'http://storage.test/bucket/posters/u/x' }

const png = (size = 3) => new File([new Uint8Array(size)], 'poster.png', { type: 'image/png' })
const choose = (file: File) => userEvent.upload(screen.getByLabelText('Poster image'), file)

describe('PosterCard', () => {
  beforeEach(() => {
    vi.mocked(createUploadAction).mockReset().mockResolvedValue({ ok: true, data: ticket })
    vi.mocked(uploadFile).mockReset().mockResolvedValue()
    vi.mocked(attachPosterAction).mockReset().mockResolvedValue({ ok: true, data: detail })
    vi.mocked(removePosterAction).mockReset().mockResolvedValue({ ok: true, data: detail })
    vi.mocked(toast.success).mockReset()
  })

  it('shows a note and no controls when uploads are not configured', () => {
    render(<PosterCard movie={withPoster} canUpload={false} />)
    expect(
      screen.getByText('Uploads are not configured on this server (set the R2 variables).'),
    ).toBeInTheDocument()
    expect(screen.queryByLabelText('Poster image')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows the title on a placeholder and offers an upload when there is no poster', () => {
    const { container } = render(<PosterCard movie={movie} canUpload />)
    expect(screen.getByText('Dune')).toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByRole('button', { name: 'Upload poster' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Remove poster' })).not.toBeInTheDocument()
  })

  it('shows the poster and offers to replace or remove it', async () => {
    const { container } = render(<PosterCard movie={withPoster} canUpload />)
    expect(container.querySelector('img')).toHaveAttribute('src', withPoster.posterUrl)
    expect(screen.getByRole('button', { name: 'Replace poster' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Remove poster' }))
    expect(removePosterAction).not.toHaveBeenCalled()
    await userEvent.click(await screen.findByRole('button', { name: 'Remove poster' }))
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Poster removed'))
    expect(removePosterAction).toHaveBeenCalledWith('m1')
  })

  it('asks for a ticket, uploads to storage, attaches and reports success', async () => {
    render(<PosterCard movie={movie} canUpload />)
    const file = png(1234)
    await choose(file)

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Poster updated'))
    expect(createUploadAction).toHaveBeenCalledWith({
      purpose: 'poster',
      contentType: 'image/png',
      size: 1234,
    })
    expect(uploadFile).toHaveBeenCalledWith(ticket, file)
    expect(attachPosterAction).toHaveBeenCalledWith({ id: 'm1', key: 'posters/u/1' })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('refuses an unsupported type without calling the server', async () => {
    render(<PosterCard movie={movie} canUpload />)
    // `userEvent.upload` honours `accept`, so bypass it to prove the check is ours.
    await userEvent
      .setup({ applyAccept: false })
      .upload(
        screen.getByLabelText('Poster image'),
        new File(['x'], 'a.gif', { type: 'image/gif' }),
      )

    expect(await screen.findByRole('alert')).toHaveTextContent('Use a PNG, JPEG, or WebP image')
    expect(createUploadAction).not.toHaveBeenCalled()
  })

  it('refuses a file over 5 MB without calling the server', async () => {
    render(<PosterCard movie={movie} canUpload />)
    const file = png(1)
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 })
    await choose(file)

    expect(await screen.findByRole('alert')).toHaveTextContent('5 MB or smaller')
    expect(createUploadAction).not.toHaveBeenCalled()
    expect(toast.success).not.toHaveBeenCalled()
  })

  it('shows the server message when the ticket is refused', async () => {
    vi.mocked(createUploadAction).mockResolvedValue({
      ok: false,
      code: 'FORBIDDEN',
      message: 'Admins only',
    })
    render(<PosterCard movie={movie} canUpload />)
    await choose(png())

    expect(await screen.findByRole('alert')).toHaveTextContent('Admins only')
    expect(uploadFile).not.toHaveBeenCalled()
    expect(attachPosterAction).not.toHaveBeenCalled()
  })

  it('shows the storage failure and does not attach', async () => {
    vi.mocked(uploadFile).mockRejectedValue(new RequestError('The upload was rejected', 403))
    render(<PosterCard movie={movie} canUpload />)
    await choose(png())

    expect(await screen.findByRole('alert')).toHaveTextContent('The upload was rejected')
    expect(attachPosterAction).not.toHaveBeenCalled()
    expect(toast.success).not.toHaveBeenCalled()
  })

  it('shows the server message when attaching fails', async () => {
    vi.mocked(attachPosterAction).mockResolvedValue({
      ok: false,
      code: 'VALIDATION',
      message: 'Invalid upload',
    })
    render(<PosterCard movie={movie} canUpload />)
    await choose(png())

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid upload')
    expect(toast.success).not.toHaveBeenCalled()
  })

  it('disables the controls while the upload is in flight', async () => {
    let release: (value: never) => void = () => {}
    vi.mocked(createUploadAction).mockReturnValue(new Promise((resolve) => (release = resolve)))
    render(<PosterCard movie={withPoster} canUpload />)
    await choose(png())

    const button = screen.getByRole('button', { name: 'Replace poster' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByLabelText('Poster image')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Remove poster' })).toBeDisabled()

    release({ ok: false, code: 'FORBIDDEN', message: 'Admins only' } as never)
    await waitFor(() => expect(button).toBeEnabled())
  })
})
