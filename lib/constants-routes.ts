export const ROUTE_HOME = '/'
export const ROUTE_LOGIN = '/login'
export const ROUTE_SIGNUP = '/signup'
export const ROUTE_FORGOT_PASSWORD = '/forgot-password'
export const ROUTE_RESET_PASSWORD = '/reset-password'
export const ROUTE_SETTINGS = '/settings'
export const ROUTE_ADMIN = '/admin'
export const ROUTE_UI_KIT = '/ui-kit'
export const ROUTE_MOVIES = '/movies'
export const ROUTE_PEOPLE = '/people'
export const ROUTE_SEARCH = '/search'

export const moviePath = (slug: string) => `${ROUTE_MOVIES}/${slug}`

/** A movie's reviews, newest first. */
export const movieReviewsPath = (slug: string) => `${moviePath(slug)}/reviews`

/** One review; the slug is the movie's, and the page answers 404 for any other movie's. */
export const reviewPath = (slug: string, id: string) => `${movieReviewsPath(slug)}/${id}`

/** The search page for a term: movies and people together. */
export const searchPath = (q: string) => `${ROUTE_SEARCH}?${new URLSearchParams({ q })}`

/** The movie list searched by title. */
export const moviesByTitlePath = (q: string) => `${ROUTE_MOVIES}?${new URLSearchParams({ q })}`

/** The people list searched by name. */
export const peopleByNamePath = (q: string) => `${ROUTE_PEOPLE}?${new URLSearchParams({ q })}`

/** The movie list filtered to one genre (`genres` takes a comma-separated list; this names one). */
export const moviesByGenrePath = (genreSlug: string) =>
  `${ROUTE_MOVIES}?${new URLSearchParams({ genres: genreSlug })}`

/** The movie list filtered to one person's credits. */
export const moviesByPersonPath = (personSlug: string) =>
  `${ROUTE_MOVIES}?${new URLSearchParams({ person: personSlug })}`

/** Person slugs never change, so a person's page link is stable through a rename. */
export const personPath = (slug: string) => `${ROUTE_PEOPLE}/${slug}`

// The admin dashboard (`app/(admin)`): every route under `/admin` is private, see `PUBLIC_ROUTES`.
export const ROUTE_ADMIN_MOVIES = `${ROUTE_ADMIN}/movies`
export const ROUTE_ADMIN_MOVIE_NEW = `${ROUTE_ADMIN_MOVIES}/new`
/** Movie slugs never change, so they are the admin URLs too. */
export const adminMovieEditPath = (slug: string) => `${ROUTE_ADMIN_MOVIES}/${slug}/edit`
export const ROUTE_ADMIN_PEOPLE = `${ROUTE_ADMIN}/people`
export const ROUTE_ADMIN_GENRES = `${ROUTE_ADMIN}/genres`
export const ROUTE_ADMIN_USERS = `${ROUTE_ADMIN}/users`
export const adminUserPath = (id: string) => `${ROUTE_ADMIN_USERS}/${id}`

export const loginPath = (next: string) => `${ROUTE_LOGIN}?next=${encodeURIComponent(next)}`

/** Routes a signed-out visitor may open; everything else redirects to login (see `proxy.ts`). */
export const PUBLIC_ROUTES = [
  ROUTE_HOME,
  ROUTE_LOGIN,
  ROUTE_SIGNUP,
  ROUTE_FORGOT_PASSWORD,
  ROUTE_RESET_PASSWORD,
  ROUTE_UI_KIT,
  ROUTE_MOVIES,
  ROUTE_PEOPLE,
  ROUTE_SEARCH,
] as const

export const isPublicRoute = (path: string): boolean =>
  PUBLIC_ROUTES.some(
    (route) => path === route || (route !== ROUTE_HOME && path.startsWith(`${route}/`)),
  )

export const isPrivateRoute = (path: string): boolean => !isPublicRoute(path)

const REDIRECT_BASE = 'http://localhost'

/**
 * Accepts only same-origin relative targets; the fallback is where sign-in lands by default. The
 * value is resolved the way a browser would, so `/\\evil.example` and `/<TAB>/evil.example` (which
 * browsers read as `//evil.example`) fall back. Dot segments can also normalise to a `//` path
 * (`/.//evil.example`), which a browser would treat as protocol-relative, so the resolved path is
 * checked too.
 */
export const safeRedirectPath = (value: string | null | undefined, fallback = ROUTE_HOME) => {
  if (!value || !value.startsWith('/')) {
    return fallback
  }
  try {
    const url = new URL(value, REDIRECT_BASE)
    if (url.origin !== REDIRECT_BASE || url.pathname.startsWith('//')) {
      return fallback
    }
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}
