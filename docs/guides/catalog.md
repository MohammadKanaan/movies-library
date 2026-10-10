# Catalog

The catalog is movies, genres, people and the credits that join people to movies by role
(`DIRECTOR`, `WRITER`, `ACTOR`, in billing order), plus a poster per movie stored on R2. It follows
the one-contract rule: Server Components and Server Actions end at the same DAL functions and get
the same DTOs under the same rules. There are no Route Handlers and no pages for it yet; this guide
describes the backend that the pages will sit on.

Two decisions shape everything here (`docs/DECISIONS.md`, "Catalog"): **reads are public** (a
signed-out visitor may list and open anything; `permissions` on a detail says what the viewer may
do), and **writes are admin-only** (`requireAdmin()` on every create, update, delete and poster
change; editors are viewers for the catalog until an ownership rule is added, which is why
`movies.created_by_id` is still recorded).

## DTOs (`lib/dto`)

- `catalog.ts`: `slugSchema` (what `slugify` produces, with room for a `-2` suffix), `catalogIdSchema`
  (`z.uuid()`), `creditRoleSchema` (the `credit_role` enum by value).
- `genres.ts`: `genreSchema` `{ id, name, slug }`, `genreWithCountSchema` (+ `movieCount`, the list
  row), `genreInput` `{ name }`, `updateGenreInput` (+ `id`).
- `people.ts`: `personSummarySchema` `{ id, slug, name }` (what a movie's credits show),
  `personDetailSchema` (+ timestamps, `filmography: { directed, written, acted }` of
  `movieCreditSchema` rows newest first, `permissions`), `listPeopleQuery` (`page`, `perPage`, `q`),
  `peopleUrlQuery` (every field `.catch()`ed for the URL), `personInput`, `updatePersonInput`.
- `movies.ts`: `movieSummarySchema` (the list row, with `genres`), `movieDetailSchema` (+ `synopsis`,
  `createdBy` profile or `null`, timestamps, `credits: { directors, writers, cast }`,
  `permissions`), `listMoviesQuery` (`q`, `genre` and `person` slugs, `sort` of
  `newest | oldest | title`), `moviesUrlQuery`, `movieInput` / `updateMovieInput`,
  `attachPosterInput` `{ id, key }`.

`movieInput` carries `releaseDate` as `YYYY-MM-DD` (`z.iso.date()`, between 1888 and today: the
catalog holds released films only), `genreIds` (UUIDs, no duplicates, at most 10) and `credits` as an
ordered list of `{ personId, role }` (no person twice in one role, at most 100). It has **no
`posterUrl` and no `slug`**: the poster comes from an upload, the slug is derived. Search terms
(`q`) are `searchTermSchema`: empty or at least three characters, because the trigram indexes cannot
serve a shorter `ILIKE`.

## DAL (`lib/data`)

`genres.ts`, `people.ts` and `movies.ts`, every function in the order **signed in / admin (401, 403) → input valid (422) → exists (404) → allowed (403, `authorize(policy.x, viewer, record)`) →
work → `invalidateTags(CATALOG_TAG)` → the DTO read back fresh**. A read by slug treats a malformed
slug as not found; a write reports a malformed id as a validation error.

| Function                        | Rule                                                                                                                                      |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `listGenres()`                  | Public, name order, with `movieCount`; cached.                                                                                            |
| `createGenre` / `updateGenre`   | Slug from the name; a name or slug already taken is a `name` field error ("That genre already exists"). Rename keeps the slug.            |
| `deleteGenre(id)`               | Refused with a message while movies carry it (the FK is `Restrict`).                                                                      |
| `listPeople(query)`             | Public, name order, `q` on the name; the plain list is cached, a search never.                                                            |
| `getPersonBySlug(slug)`         | Public; filmography by role, newest release first; cached record + per-viewer `permissions`.                                              |
| `createPerson` / `updatePerson` | Slug from the name, numbered for namesakes (`john-williams-2`); rename keeps the slug.                                                    |
| `deletePerson(id)`              | Refused with a message while credited.                                                                                                    |
| `listMovies(query)`             | Public; `q` on the title, `genre` and `person` filters by slug, three sorts with `id` as tiebreaker; only the filter-free list is cached. |
| `getMovieBySlug(slug)`          | Public; genres, credits grouped by role in `position` order, `createdBy`; cached record + `permissions`.                                  |
| `createMovie(input)`            | Genres and people must exist (field errors otherwise); slug `slugify(title)-<year>`, numbered on a collision; one transaction.            |
| `updateMovie(input)`            | Replaces the fields, the genre links and the credits (`position` renumbered per role from the given order). The slug never changes.       |
| `deleteMovie(id)`               | Links cascade; the poster's object is queued for deletion.                                                                                |
| `attachPoster({ id, key })`     | See **Posters**.                                                                                                                          |
| `removePoster(id)`              | Clears the poster and queues its object.                                                                                                  |

Record-level rules are in `lib/data/policies/{movie,genre,person}.ts`, pure functions of
`(viewer, record)` tested per viewer in `tests/lib/data/policies/`. Today each is `{ update: isAdmin,
delete: isAdmin }` (`policies/rules.ts`); `MovieRecord` carries `createdById` so an editor-owns rule
can be added there without touching the DAL. DTOs get their `permissions` from
`permissionsFor(policy, ['update', 'delete'], viewer, record)`.

### Slugs

`slugify` (`lib/slug.ts`) is pure: NFKD, diacritics stripped, lowercased, runs of anything but
`a-z0-9` become one hyphen, trimmed, cut at 80. `uniqueSlug(base, taken)` (`lib/data/slugs.ts`)
returns the first free of `base`, `base-2`, `base-3`, …; the DAL passes the slugs that start with the
base (one indexed query) and retries the insert on a unique violation, which is what two concurrent
creates picking the same slug produce. A name with no letters or digits is a validation error.
Movies are `title-year` (`dune-1984`, `dune-2021`); genres are not numbered, because two genres with
one slug are the same genre.

### Caching

Every cached catalog read is tagged `CATALOG_TAG` and every catalog write invalidates it
(`docs/guides/caching.md`). Movies, genres and people reference each other (credits, filmographies,
genre counts), so per-record tags would need a fan-out on each write for data that changes rarely.
Cached: the genre list, the unfiltered people and movie lists (`page`, `perPage`, `sort` in the key),
each person and movie detail by slug (the viewer-independent record; `permissions` is computed after).
Never cached: anything with `q`, `genre` or `person` set.

### Posters

The `poster` upload purpose (`UPLOAD_RULES.poster`: PNG, JPEG or WebP, 5 MB, `adminOnly`) follows
`docs/guides/uploads.md`. `createUpload({ purpose: 'poster', … })` hands a ticket to an admin only
(the check runs after the input is valid); the browser uploads; then `attachPoster({ id, key })`:
admin → input valid → the key is the admin's own and a poster (not even another admin's object) →
the movie exists → allowed → `headObject` re-checks the stored object (an object that broke the rule
is deleted at once) → in one transaction that first locks the movie row, the current `posterUrl` is
read and replaced with `publicUrl(key)` → the replaced object, if it is in the bucket and not the same
key, goes through a delayed `delete-object` job. `removePoster` and `deleteMovie` queue the current
object the same way. A poster URL that is not in the bucket (nothing writes one today) is left alone.

## Server Actions (`actions/`)

`genres.ts` (`createGenreAction`, `updateGenreAction`, `deleteGenreAction`), `people.ts` (`create`,
`update`, `deletePersonAction`) and `movies.ts` (`createMovieAction`, `updateMovieAction`,
`deleteMovieAction`, `attachPosterAction`, `removePosterAction`). Each passes its arguments to the
DAL untouched, calls `refresh()` and returns `ActionResult<T>` through `toActionFailure`; deletes
return `{ ok: true, data: undefined }`.

## Seed

`prisma/catalog.ts` holds the data (12 genres, 16 well-known films with directors, writers and cast,
60 people derived from the credits); `prisma/seed.ts` upserts genres and people by slug, then each
movie by slug and replaces its genre links and credits in a transaction, with the seeded admin as
`createdById` (set on update too, because re-seeding recreates the admin). Running it twice changes
nothing. `db:seed` does not flush Redis: cached catalog reads can lag up to 5 minutes.

## Tests

`tests/lib/dto/{catalog,genres,people,movies}.test.ts`, `tests/lib/slug.test.ts`,
`tests/lib/data/slugs.test.ts`, `tests/lib/data/policies/*.test.ts` (no database),
`tests/lib/data/{genres,people,movies}.test.ts` and `tests/actions/{genres,people,movies}.test.ts`
(against `movies_library_test`, storage mocked as in `tests/lib/data/uploads.test.ts`).
`tests/helpers/catalog.ts` writes fixtures straight through `db` (`seedGenre`, `seedPerson`,
`seedMovie`) for the DAL to read back.

## Not here, on purpose

- An ownership rule for editors (`created_by_id` is kept for it).
- Route Handlers under `app/api/v1` (add them when an HTTP client needs them; `docs/guides/route-handlers.md`).
- Pages, forms and the client upload wrapper for posters.
- A pasted poster URL: a poster is always an object in the bucket.
- Unreleased films (`release_date` is `NOT NULL` and never in the future).
