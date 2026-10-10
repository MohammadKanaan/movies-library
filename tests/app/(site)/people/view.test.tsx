import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PeopleView } from '@/app/(site)/people/view'

const navigation = vi.hoisted(() => ({ search: '', push: vi.fn() }))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: navigation.push }),
  usePathname: () => '/people',
  useSearchParams: () => new URLSearchParams(navigation.search),
}))

describe('PeopleView', () => {
  beforeEach(() => {
    navigation.search = ''
    navigation.push.mockReset()
  })

  it('renders the grid it is given and no pagination for a single page', () => {
    render(
      <PeopleView page={1} totalPages={1}>
        <p>the grid</p>
      </PeopleView>,
    )
    expect(screen.getByText('the grid')).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument()
  })

  it('searches through the URL from the first page', async () => {
    navigation.search = 'page=3'
    render(
      <PeopleView page={3} totalPages={3}>
        <p>the grid</p>
      </PeopleView>,
    )
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search people' }), ' nolan ')
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(navigation.push).toHaveBeenCalledWith('/people?q=nolan', { scroll: false })
  })

  it('pages through the URL with a history entry, keeping the search', async () => {
    navigation.search = 'q=nolan'
    render(
      <PeopleView page={1} totalPages={2}>
        <p>the grid</p>
      </PeopleView>,
    )
    expect(screen.getByRole('searchbox', { name: 'Search people' })).toHaveValue('nolan')
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(navigation.push).toHaveBeenCalledWith('/people?q=nolan&page=2', { scroll: false })
  })
})
