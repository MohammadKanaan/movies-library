import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MoviesView } from '@/app/(site)/movies/view'

const navigation = vi.hoisted(() => ({ search: '', push: vi.fn() }))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: navigation.push }),
  usePathname: () => '/movies',
  useSearchParams: () => new URLSearchParams(navigation.search),
}))

describe('MoviesView', () => {
  beforeEach(() => {
    navigation.search = ''
    navigation.push.mockReset()
  })

  it('renders the grid it is given and no pagination for a single page', () => {
    render(
      <MoviesView page={1} totalPages={1}>
        <p>the grid</p>
      </MoviesView>,
    )
    expect(screen.getByText('the grid')).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument()
  })

  it('pages through the URL with a history entry, keeping the genre filter', async () => {
    navigation.search = 'genre=drama'
    render(
      <MoviesView page={1} totalPages={3}>
        <p>the grid</p>
      </MoviesView>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(navigation.push).toHaveBeenCalledWith('/movies?genre=drama&page=2', { scroll: false })
  })
})
