import { describe, expect, it } from 'vitest'
import {
  adminMovieEditPath,
  adminUserPath,
  editReviewPath,
  isPrivateRoute,
  isPublicRoute,
  loginPath,
  moviesByGenrePath,
  moviesByPersonPath,
  moviesByTitlePath,
  peopleByNamePath,
  personPath,
  ROUTE_ADMIN_GENRES,
  ROUTE_ADMIN_MOVIE_NEW,
  ROUTE_ADMIN_MOVIES,
  ROUTE_ADMIN_PEOPLE,
  ROUTE_ADMIN_USERS,
  ROUTE_SEARCH,
  safeRedirectPath,
  searchPath,
} from '@/lib/constants-routes'

describe('admin routes', () => {
  it('nest under /admin and are all private', () => {
    expect([
      ROUTE_ADMIN_MOVIES,
      ROUTE_ADMIN_MOVIE_NEW,
      ROUTE_ADMIN_PEOPLE,
      ROUTE_ADMIN_GENRES,
      ROUTE_ADMIN_USERS,
    ]).toEqual([
      '/admin/movies',
      '/admin/movies/new',
      '/admin/people',
      '/admin/genres',
      '/admin/users',
    ])
    expect(adminMovieEditPath('dune-2021')).toBe('/admin/movies/dune-2021/edit')
    expect(adminUserPath('0190d1a2-0000-7000-8000-000000000001')).toBe(
      '/admin/users/0190d1a2-0000-7000-8000-000000000001',
    )
    for (const path of [ROUTE_ADMIN_MOVIES, adminMovieEditPath('dune-2021'), ROUTE_ADMIN_USERS]) {
      expect(isPrivateRoute(path)).toBe(true)
    }
  })

  it('builds the public movie list filtered to one person', () => {
    expect(moviesByPersonPath('denis-villeneuve')).toBe('/movies?person=denis-villeneuve')
  })

  it('builds the public movie list filtered to one genre, under the list parameter', () => {
    expect(moviesByGenrePath('science-fiction')).toBe('/movies?genres=science-fiction')
  })

  it('builds the search pages for a term, encoded', () => {
    expect(ROUTE_SEARCH).toBe('/search')
    expect(searchPath('dune: part two')).toBe('/search?q=dune%3A+part+two')
    expect(moviesByTitlePath('dune')).toBe('/movies?q=dune')
    expect(peopleByNamePath('amy adams')).toBe('/people?q=amy+adams')
  })

  it('builds a person page from the slug', () => {
    expect(personPath('denis-villeneuve')).toBe('/people/denis-villeneuve')
  })

  it('builds the movie page with the viewer’s review open for editing', () => {
    expect(editReviewPath('dune-2021')).toBe('/movies/dune-2021?edit=review#your-review')
  })
})

describe('route helpers', () => {
  it('treats the public pages and their subpaths as public', () => {
    for (const path of [
      '/',
      '/login',
      '/signup',
      '/forgot-password',
      '/reset-password',
      '/ui-kit',
      '/ui-kit/anything',
      '/movies',
      '/movies/dune-2021',
      '/people',
      '/people/denis-villeneuve',
      '/search',
    ]) {
      expect(isPublicRoute(path)).toBe(true)
    }
  })

  it('treats every other page as private', () => {
    for (const path of ['/settings', '/admin', '/admin/users', '/anything']) {
      expect(isPrivateRoute(path)).toBe(true)
    }
  })

  it('builds a login path that carries the return target', () => {
    expect(loginPath('/settings?x=1')).toBe('/login?next=%2Fsettings%3Fx%3D1')
  })

  it('rejects backslash and control-character tricks that browsers read as another host', () => {
    for (const value of [
      '/\\evil.example',
      '/\t/evil.example',
      '/\n/evil.example',
      '\\evil.example',
      '/.//evil.example',
      '/..//evil.example',
      '/a/..//evil.example',
      '/./\\evil.example',
    ]) {
      expect(safeRedirectPath(value)).toBe('/')
    }
  })

  it('only accepts same-origin relative redirect targets, landing on the home page otherwise', () => {
    expect(safeRedirectPath('/posts/new')).toBe('/posts/new')
    expect(safeRedirectPath('/posts/new?x=1#h')).toBe('/posts/new?x=1#h')
    expect(safeRedirectPath('//evil.example')).toBe('/')
    expect(safeRedirectPath('https://evil.example')).toBe('/')
    expect(safeRedirectPath(undefined)).toBe('/')
    expect(safeRedirectPath(undefined, '/settings')).toBe('/settings')
  })
})
