# SEO audit

Recorded 2026-10-10 against `main` at `150c858`. A source review only: no Lighthouse run, no live
deployment, no Search Console data. Score: about 8/10. The foundation is strong; the main problem
is how `/` is handled.

## What is already good

- **Per-page metadata is complete.** Records get a title with year, a description (synopsis, with a
  generated fallback, cut at 160 characters on a word boundary), a canonical URL, and OG types
  `video.movie`, `profile` and `article` with poster images and alt text.
- **Faceted navigation is handled.** Only the full catalog and single-genre views are indexable,
  page by page (`lib/seo.ts: moviesCanonicalPath`). Search, filters, sorts and `?q=` views are
  `noindex,follow`.
- **robots.txt and the sitemap agree.** Noindex pages stay crawlable so the tag can be read. The
  sitemap is built per request with `lastmod`, image entries, and only genres that have films.
- **JSON-LD is correct.** `Movie` (release date in `dateCreated`), `Person` and `Review`; spoiler
  text is left out; `<` is escaped in the script tag.
- **Basics hold up.** Real 404 status codes, one `<h1>` per page, `lang="en"`, self-hosted fonts,
  the hero poster loads eagerly with `fetchPriority="high"`, auth and admin areas are noindex.

## Issues, most important first

### 1. `/` is a 307 redirect to `/movies`, and the site is inconsistent about it

- `next.config.ts` redirects `/` temporarily, yet `app/sitemap.ts:28` lists `/`. Search Console
  will flag it as "page with redirect".
- The NavBar brand (`components/Layout/NavBar`), the auth layout brand (`app/(minimal)/layout.tsx`)
  and the not-found "Go home" button all link to `/`, so every internal link takes a redirect hop.
- `websiteJsonLd` (`lib/structuredData.ts`) is written and unit-tested but rendered nowhere, so
  there is no site-name structured data, and the root `title.default` is never shown.
- A 307 tells Google the target is temporary, so it may keep `/` in the index.

**Fix:** either serve a real home page at `/` with its own canonical and `websiteJsonLd`, or point
links and the sitemap at `/movies` and drop `/` from the sitemap.

### 2. Every image has `alt=""`

Fine for accessibility (a title is always beside the image), but it forfeits Google Images traffic
for posters and headshots.

**Fix:** give the hero poster on `/movies/[slug]` and the headshot on `/people/[slug]` real alt
text, e.g. `"{title} poster"`. `Headshot` is `aria-hidden` by design, so it needs an opt-in prop.

### 3. No CDN or ISR caching for public pages

Every `(site)` route is dynamic: the layout reads the session and `loadPage` awaits
`connection()`. Public catalog pages are never edge-cached, so TTFB depends on app plus Redis on
every crawl. This is a deliberate trade-off in `AGENTS.md`, not a bug, but it is the main Core Web
Vitals risk. Posters are also unresized R2 originals in a plain `<img>` with no `srcset`.

### 4. Review pages are indexable but not in the sitemap

`/movies/[slug]/reviews/[id]` has a canonical and `Review` JSON-LD but is not listed. Either add
them to the sitemap or mark them `noindex` (thin user-generated pages).

### 5. Sitemap `lastmod` understates freshness

It uses the movie row's `updatedAt`, which new reviews and rating changes do not bump. List pages
have no `lastmod`.

## Minor

- `app/robots.ts` disallows `/settings` while that page relies on `noindex`, which a crawler cannot
  read on a page it may not fetch (the file's own comment states that principle). Harmless: the
  page redirects to login.
- No `BreadcrumbList` JSON-LD (Movies › Title).
- No default OG image for list pages, so link previews are text-only.
- Only `favicon.ico`: no apple-touch icon or manifest.

## Not verified

- That `BETTER_AUTH_URL` is set correctly in production. Every canonical, sitemap and JSON-LD URL
  derives from it (`lib/data/site.ts`), and it falls back to `http://localhost:3000`.
- Real Core Web Vitals and index coverage in Search Console.
- Content volume and quality.
