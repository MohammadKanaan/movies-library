import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createCommentAction } from '@/actions/reviewComments'
import { NewComment } from '@/components/Reviews/NewComment'

const reviewId = '0190d1a2-0000-7000-8000-000000000002'
const path = `/movies/dune-2021/reviews/${reviewId}`

const navigation = vi.hoisted(() => ({ search: '', push: vi.fn() }))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: navigation.push }),
  usePathname: () => path,
  useSearchParams: () => new URLSearchParams(navigation.search),
}))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock('@/actions/reviewComments', () => ({ createCommentAction: vi.fn() }))

const post = async (text = 'Agreed.') => {
  await userEvent.type(screen.getByRole('textbox', { name: 'Comment' }), text)
  await userEvent.click(screen.getByRole('button', { name: 'Post comment' }))
}

describe('NewComment', () => {
  beforeEach(() => {
    navigation.search = ''
    navigation.push.mockReset()
    vi.mocked(createCommentAction).mockReset()
  })

  it('posts the comment and stays put when it lands on the page in view', async () => {
    vi.mocked(createCommentAction).mockResolvedValue({ ok: true, data: null as never })
    render(<NewComment reviewId={reviewId} landingPage={1} />)
    await post()
    expect(createCommentAction).toHaveBeenCalledWith({ reviewId, body: 'Agreed.' })
    expect(navigation.push).not.toHaveBeenCalled()
  })

  it('moves to the page the comment lands on when it is not the one in view', async () => {
    vi.mocked(createCommentAction).mockResolvedValue({ ok: true, data: null as never })
    render(<NewComment reviewId={reviewId} landingPage={2} />)
    await post()
    expect(navigation.push).toHaveBeenCalledWith(`${path}?page=2`, { scroll: false })
  })

  it('stays put when the comment is not posted', async () => {
    vi.mocked(createCommentAction).mockResolvedValue({
      ok: false,
      code: 'RATE_LIMITED',
      message: 'Too many attempts.',
    })
    render(<NewComment reviewId={reviewId} landingPage={2} />)
    await post()
    expect(await screen.findByRole('alert')).toHaveTextContent('Too many attempts.')
    expect(navigation.push).not.toHaveBeenCalled()
  })
})
