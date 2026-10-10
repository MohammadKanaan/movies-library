import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NavBar } from '@/components/Layout/NavBar'
import type { CurrentUser } from '@/lib/dto/users'

vi.mock('next/navigation', () => ({ usePathname: () => '/ui-kit' }))
vi.mock('@/components/Auth/SignOutButton', () => ({
  SignOutButton: () => <button>Log out</button>,
}))
vi.mock('@/components/ThemeToggle', () => ({ ThemeToggle: () => null }))
vi.mock('@/components/Layout/SiteSearch', () => ({
  SiteSearch: ({ autoFocus }: { autoFocus?: boolean }) => (
    <input type="search" aria-label="Search movies and people" autoFocus={autoFocus} />
  ),
}))

const user: CurrentUser = {
  id: 'u1',
  name: 'Ada Lovelace',
  username: 'ada',
  email: 'ada@example.com',
  emailVerified: true,
  image: null,
  role: 'viewer',
}

/** The desktop and the mobile menu both render the links. */
const linksNamed = (name: string) => screen.queryAllByRole('link', { name, hidden: true })

describe('NavBar', () => {
  it('shows the Admin link to admins, in both menus', () => {
    render(<NavBar user={{ ...user, role: 'admin' }} />)
    const links = linksNamed('Admin')
    expect(links).toHaveLength(2)
    for (const link of links) {
      expect(link).toHaveAttribute('href', '/admin')
    }
  })

  it('hides the Admin link from regular users and signed-out visitors', () => {
    const { rerender } = render(<NavBar user={user} />)
    expect(linksNamed('Admin')).toHaveLength(0)
    rerender(<NavBar user={null} />)
    expect(linksNamed('Admin')).toHaveLength(0)
  })

  it('offers account settings and sign-out to a signed-in user, and log in otherwise', () => {
    const { rerender } = render(<NavBar user={user} />)
    for (const link of linksNamed('Account settings')) {
      expect(link).toHaveAttribute('href', '/settings')
    }
    expect(linksNamed('Account settings')).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: 'Log out', hidden: true })).toHaveLength(2)
    expect(linksNamed('Log in')).toHaveLength(0)

    rerender(<NavBar user={null} />)
    expect(linksNamed('Account settings')).toHaveLength(0)
    expect(screen.queryAllByRole('button', { name: 'Log out', hidden: true })).toHaveLength(0)
    for (const link of linksNamed('Log in')) {
      expect(link).toHaveAttribute('href', '/login')
    }
    expect(linksNamed('Log in')).toHaveLength(2)
  })
})

describe('NavBar search', () => {
  it('shows the search box in the desktop bar and opens a second one on small screens', async () => {
    render(<NavBar user={null} />)
    expect(screen.getAllByRole('searchbox', { name: 'Search movies and people' })).toHaveLength(1)
    const toggle = screen.getByRole('button', { name: 'Toggle search' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByRole('searchbox', { name: 'Search movies and people' })).toHaveLength(2)
    await userEvent.click(toggle)
    expect(screen.getAllByRole('searchbox', { name: 'Search movies and people' })).toHaveLength(1)
  })

  it('closes the search bar when the menu opens', async () => {
    render(<NavBar user={null} />)
    await userEvent.click(screen.getByRole('button', { name: 'Toggle search' }))
    await userEvent.click(screen.getByRole('button', { name: 'Toggle navigation menu' }))
    expect(screen.getByRole('button', { name: 'Toggle search' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(screen.getByRole('button', { name: 'Toggle navigation menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })
})
