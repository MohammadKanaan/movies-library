// @vitest-environment node
import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { proxy } from '@/proxy'

const request = (path: string, cookie?: string) =>
  new NextRequest(`http://localhost${path}`, cookie ? { headers: { cookie } } : undefined)

const SESSION_COOKIE = 'better-auth.session_token=abc.def'

describe('proxy', () => {
  it('sends signed-out visitors from private pages to login with a return path', () => {
    const response = proxy(request('/settings'))
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost/login?next=%2Fsettings')
  })

  it('sends signed-out visitors from the admin page to login', () => {
    const response = proxy(request('/admin?q=ada'))
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost/login?next=%2Fadmin%3Fq%3Dada')
  })

  it('lets a visitor with a session cookie through to private pages', () => {
    expect(proxy(request('/settings', SESSION_COOKIE)).headers.get('x-middleware-next')).toBe('1')
  })

  it('does not redirect guest-only pages: a stale cookie must not lock anyone out', () => {
    for (const path of ['/login', '/signup']) {
      const response = proxy(request(path, SESSION_COOKIE))
      expect(response.headers.get('x-middleware-next')).toBe('1')
      expect(response.headers.get('location')).toBeNull()
    }
  })

  it('lets signed-out visitors reach the password reset pages', () => {
    for (const path of ['/forgot-password', '/reset-password']) {
      expect(proxy(request(`${path}?token=abc`)).headers.get('x-middleware-next')).toBe('1')
    }
  })

  it('lets anyone through to public pages', () => {
    for (const path of ['/', '/movies', '/movies/dune-2021']) {
      expect(proxy(request(path)).headers.get('x-middleware-next')).toBe('1')
    }
  })

  it('gives every page a Content-Security-Policy with a nonce of its own', () => {
    const first = proxy(request('/movies'))
    const policy = first.headers.get('content-security-policy')
    const nonce = policy?.match(/'nonce-([^']+)'/)?.[1]
    expect(nonce).toBeDefined()
    // Next reads the nonce from the request's copy of the header when it renders the page.
    expect(first.headers.get('x-middleware-request-content-security-policy')).toBe(policy)
    expect(first.headers.get('x-middleware-request-x-nonce')).toBe(nonce)

    const second = proxy(request('/movies')).headers.get('content-security-policy')
    expect(second).not.toBe(policy)
  })

  it('sends no policy with a redirect to login', () => {
    expect(proxy(request('/settings')).headers.get('content-security-policy')).toBeNull()
  })
})
