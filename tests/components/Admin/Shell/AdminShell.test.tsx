import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AdminShell } from '@/components/Admin/Shell/AdminShell'
import type { CurrentUser } from '@/lib/dto/users'

vi.mock('next/navigation', () => ({ usePathname: () => '/admin/users' }))
vi.mock('@/hooks/use-mobile', () => ({ useIsMobile: () => false }))
vi.mock('@/components/Auth/SignOutButton', () => ({
  SignOutButton: () => <button>Log out</button>,
}))
vi.mock('@/components/ThemeToggle', () => ({ ThemeToggle: () => <button>Theme</button> }))

const admin: CurrentUser = {
  id: 'u1',
  name: 'Ada Lovelace',
  username: 'ada',
  email: 'ada@example.com',
  emailVerified: true,
  image: null,
  role: 'admin',
}

describe('AdminShell', () => {
  it('renders the page inside the shell with the sidebar, its toggle and a way back to the site', () => {
    render(
      <AdminShell viewer={admin} defaultOpen>
        <h1>Users</h1>
      </AdminShell>,
    )
    expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Users' })).toHaveAttribute('aria-current', 'page')
    // The trigger in the top bar and the rail on the sidebar's edge both toggle it.
    expect(screen.getAllByRole('button', { name: 'Toggle Sidebar' })).toHaveLength(2)
    expect(screen.getByRole('link', { name: 'View site' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('button', { name: 'Theme' })).toBeInTheDocument()
  })
})
