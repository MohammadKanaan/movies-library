import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { attachHeadshotAction, removeHeadshotAction } from '@/actions/people'
import { createUploadAction } from '@/actions/uploads'
import { HeadshotDialog } from '@/components/Admin/People/HeadshotDialog'
import { RequestError } from '@/lib/client/errors'
import { uploadFile } from '@/lib/client/uploads'

vi.mock('@/actions/uploads', () => ({ createUploadAction: vi.fn() }))
vi.mock('@/actions/people', () => ({
  attachHeadshotAction: vi.fn(),
  removeHeadshotAction: vi.fn(),
}))
vi.mock('@/lib/client/uploads', () => ({ uploadFile: vi.fn() }))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const PERSON_ID = '0190d1a2-0000-7000-8000-000000000001'
const ticket = {
  key: 'headshots/u/1',
  url: 'https://acct.r2.cloudflarestorage.com/bucket/k?X-Amz-Signature=s',
  headers: { 'Content-Type': 'image/png' },
}
const detail = { id: PERSON_ID } as never

const person = { id: PERSON_ID, slug: 'amy-adams', name: 'Amy Adams', headshotUrl: null }
const withPhoto = { ...person, headshotUrl: 'http://storage.test/bucket/headshots/u/x' }

const png = (size = 3) => new File([new Uint8Array(size)], 'amy.png', { type: 'image/png' })
const choose = (file: File) => userEvent.upload(screen.getByLabelText('Headshot image'), file)
const open = async () => {
  await userEvent.click(screen.getByRole('button', { name: 'Photo' }))
  return screen.findByRole('dialog', { name: 'Photo of Amy Adams' })
}

describe('HeadshotDialog', () => {
  beforeEach(() => {
    vi.mocked(createUploadAction).mockReset().mockResolvedValue({ ok: true, data: ticket })
    vi.mocked(uploadFile).mockReset().mockResolvedValue()
    vi.mocked(attachHeadshotAction).mockReset().mockResolvedValue({ ok: true, data: detail })
    vi.mocked(removeHeadshotAction).mockReset().mockResolvedValue({ ok: true, data: detail })
    vi.mocked(toast.success).mockReset()
  })

  it('explains the rules and offers an upload when there is no photo', async () => {
    render(<HeadshotDialog person={person} canUpload />)
    await open()
    expect(screen.getByText(/PNG, JPEG or WebP, up to 2 MB/)).toBeInTheDocument()
    expect(screen.getByText('AA')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Upload photo' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Remove photo' })).not.toBeInTheDocument()
  })

  it('shows a note and no controls when uploads are not configured', async () => {
    render(<HeadshotDialog person={withPhoto} canUpload={false} />)
    await open()
    expect(
      screen.getByText('Uploads are not configured on this server (set the R2 variables).'),
    ).toBeInTheDocument()
    expect(screen.queryByLabelText('Headshot image')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Replace photo' })).not.toBeInTheDocument()
  })

  it('asks for a ticket, uploads to storage, attaches and reports success', async () => {
    render(<HeadshotDialog person={person} canUpload />)
    await open()
    const file = png(1234)
    await choose(file)

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Photo updated'))
    expect(createUploadAction).toHaveBeenCalledWith({
      purpose: 'headshot',
      contentType: 'image/png',
      size: 1234,
    })
    expect(uploadFile).toHaveBeenCalledWith(ticket, file)
    expect(attachHeadshotAction).toHaveBeenCalledWith({ id: PERSON_ID, key: 'headshots/u/1' })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('refuses a file over 2 MB without calling the server', async () => {
    render(<HeadshotDialog person={person} canUpload />)
    await open()
    const file = png(1)
    Object.defineProperty(file, 'size', { value: 3 * 1024 * 1024 })
    await choose(file)

    expect(await screen.findByRole('alert')).toHaveTextContent('2 MB or smaller')
    expect(createUploadAction).not.toHaveBeenCalled()
  })

  it('shows the storage failure and does not attach', async () => {
    vi.mocked(uploadFile).mockRejectedValue(new RequestError('The upload was rejected', 403))
    render(<HeadshotDialog person={person} canUpload />)
    await open()
    await choose(png())

    expect(await screen.findByRole('alert')).toHaveTextContent('The upload was rejected')
    expect(attachHeadshotAction).not.toHaveBeenCalled()
    expect(toast.success).not.toHaveBeenCalled()
  })

  it('removes the photo', async () => {
    render(<HeadshotDialog person={withPhoto} canUpload />)
    await open()
    expect(screen.getByRole('button', { name: 'Replace photo' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Remove photo' }))

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Photo removed'))
    expect(removeHeadshotAction).toHaveBeenCalledWith(PERSON_ID)
  })

  it('shows the server message when removing fails', async () => {
    vi.mocked(removeHeadshotAction).mockResolvedValue({
      ok: false,
      code: 'NOT_FOUND',
      message: 'Person not found',
    })
    render(<HeadshotDialog person={withPhoto} canUpload />)
    await open()
    await userEvent.click(screen.getByRole('button', { name: 'Remove photo' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Person not found')
    expect(toast.success).not.toHaveBeenCalled()
  })

  it('disables the controls while the upload is in flight', async () => {
    let release: (value: never) => void = () => {}
    vi.mocked(createUploadAction).mockReturnValue(new Promise((resolve) => (release = resolve)))
    render(<HeadshotDialog person={withPhoto} canUpload />)
    await open()
    await choose(png())

    const button = screen.getByRole('button', { name: 'Replace photo' })
    expect(button).toBeDisabled()
    expect(screen.getByLabelText('Headshot image')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Remove photo' })).toBeDisabled()

    release({ ok: false, code: 'FORBIDDEN', message: 'Admins only' } as never)
    await waitFor(() => expect(button).toBeEnabled())
  })
})
