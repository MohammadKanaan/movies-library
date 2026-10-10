# Movies Library

A movie catalog on Next.js: App Router, a server-only Data Access Layer on Prisma and PostgreSQL,
Better Auth with its admin plugin and three roles (viewer, editor, admin), Server Actions for
writes, shared Zod DTOs, schema-first forms, and shadcn/ui with SCSS everywhere else.

It started from a template, so the infrastructure is in place (auth, accounts, admin, cache, rate
limits, background jobs, email, uploads to R2, logging, tooling) and the catalog schema is migrated
(`movies`, `genres`, `people`, `credits`; see `prisma/schema.prisma`). The catalog features
themselves are not built yet: follow **Adding a resource** below.

## Stack

- Next.js 16 (App Router, Turbopack), React 19 with the React Compiler, TypeScript 5.9
- Bun as the package manager (scripts run on Node 24)
- SCSS CSS Modules for all styling; shadcn/ui (Base UI) + Tailwind CSS 4 only inside `components/SCN`
- lucide-react icons, sonner toasts
- Prisma ORM 7.10 (`prisma-client` generator, `@prisma/adapter-pg`) + PostgreSQL 18
- Better Auth 1.7 (email + password, optional Google sign-in, admin plugin, official Prisma adapter)
- Redis (data cache, rate limiter), pg-boss jobs, Resend for email, Cloudflare R2 for uploads (optional)
- Server Actions + Zod 4 DTOs; React Hook Form 7 + `@hookform/resolvers`
- Vitest + Testing Library + jsdom

## Setup

```bash
cp .env.example .env              # then set BETTER_AUTH_SECRET (openssl rand -base64 32)
cp .env.test.example .env.test    # same for the test database
docker compose up -d              # PostgreSQL and Redis; or run them yourself
bun install                       # also generates the Prisma client (postinstall)
bun run db:deploy                 # apply migrations
bun run db:seed                   # an admin, an editor and a viewer
bun run dev                       # web process, http://localhost:3000
bun run dev:worker                # in a second terminal: background jobs (emails, cleanup)
```

Log in as `admin@example.com`, `leanne@example.com` (editor) or `ervin@example.com` (viewer), all
with `password123`, or create an account at `/signup` (new accounts are viewers).

The app needs two services: **PostgreSQL >= 15** (18 in `docker-compose.yml`) and **Redis >= 7**.
If you run them yourself, create the `movies_library_dev` and `movies_library_test` databases, point
`REDIS_URL` in `.env` at your Redis, and put the matching values in `.env.test` (Redis
**database 15**: the tests flush it). Redis 7 is a hard minimum: the rate limiter uses
`PEXPIRE ... NX`. The compose Redis sets `maxmemory` with the `volatile-lru` policy; use the same on
a shared instance so only expiring keys can be evicted.

The **worker** is a second process (`bun run worker`, or `dev:worker` to restart on changes). Without
it, jobs pile up in the queue: no verification or reset email is sent and the hourly cleanup does
not run. Without `RESEND_API_KEY`, the worker logs emails instead of sending them, so the
verification and reset links are right there in its output. That fallback is for development only:
with `NODE_ENV=production` the send job fails (and is retried) until the key is set, and nothing is
logged.

**Uploads (optional).** The profile photo on `/settings` is stored on Cloudflare R2. Set the five
`R2_*` variables in `.env` (all or none; `docs/guides/uploads.md` walks through the bucket, its
public domain, the CORS rule and the API token). Without them the card is hidden and everything else
works.

`db:seed` and `db:reset` write straight to PostgreSQL and do not flush the Redis cache, so cached
reads can show pre-reset data for up to 5 minutes (`redis-cli -n 0 flushdb` clears it).

## Run everything with Docker

```bash
cp .env.example .env              # required: BETTER_AUTH_SECRET; optional: RESEND_API_KEY, EMAIL_FROM
docker compose --profile app up --build
docker compose --profile app run --rm -e ALLOW_SEED=1 migrate bun run db:seed   # once, in a second terminal
```

Then open http://localhost:3000 and check `curl localhost:3000/api/health`. `ALLOW_SEED=1` is needed
because the containers run with `NODE_ENV=production`, where the seed refuses to run by default (it
creates `admin@example.com` with the public password `password123`).

`docker compose up -d` without the profile still starts only PostgreSQL and Redis, which is what
`bun run dev` expects. The `app` profile adds three services built from one `Dockerfile`
(`node:24-slim` plus bun 1.4.2):

| Service   | Command                                       | Notes                                                                     |
| --------- | --------------------------------------------- | ------------------------------------------------------------------------- |
| `migrate` | `bun run db:deploy`, then `worker/migrate.ts` | One-shot: Prisma migrations, then the `pgboss` schema. Builds the image.  |
| `web`     | `bun run start`                               | Port 3000 on loopback; healthcheck on `/api/health`; waits for `migrate`. |
| `worker`  | `bun run worker`                              | Background jobs; waits for `migrate`.                                     |

Compose reads `.env` for `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `RESEND_API_KEY`, `EMAIL_FROM`,
`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, the five `R2_*` variables and the `NEXT_PUBLIC_*` build args; every other container
variable is fixed in `docker-compose.yml`. `BETTER_AUTH_SECRET` is required: compose refuses to start
without it. Production boot (`instrumentation.ts`) also refuses a missing, short or placeholder
secret and a missing `BETTER_AUTH_URL`. `NEXT_PUBLIC_*` values are baked into the bundle at build
time; everything else is read at runtime.

**Deploying behind a proxy.** Every per-IP rate limit (`getClientIp` in `lib/data/rateLimit.ts`)
reads the client address from `x-forwarded-for`, so the app must sit behind at least one proxy that
appends the client address. Set `TRUSTED_PROXY_HOPS` (default `1`) to the number of such proxies
(a CDN plus a load balancer is `2`). The compose `web` service has no proxy, so its port is bound to
`127.0.0.1`.

> The image build and the compose `app` profile have not been run end to end on the machine this was
> written on (no Docker daemon there); `docker compose config` passes. Treat the first
> `docker compose --profile app up --build` as the test.

## Scripts

| Script                    | What it does                                                            |
| ------------------------- | ----------------------------------------------------------------------- |
| `bun run dev`             | Next dev server (Turbopack).                                            |
| `bun run build`           | Production build.                                                       |
| `bun run start`           | Serve the production build.                                             |
| `bun run worker`          | Background worker (pg-boss jobs and cron).                              |
| `bun run dev:worker`      | The worker with `tsx watch`.                                            |
| `bun run lint`            | ESLint.                                                                 |
| `bun run format`          | Prettier, write.                                                        |
| `bun run format:check`    | Prettier, check only.                                                   |
| `bun run typecheck`       | `prisma generate`, `next typegen`, then `tsc --noEmit`.                 |
| `bun run test`            | Vitest, single run.                                                     |
| `bun run test:watch`      | Vitest in watch mode.                                                   |
| `bun run db:generate`     | Regenerate the Prisma client into `generated/` (also runs on install).  |
| `bun run db:migrate`      | Create and apply a migration to the dev DB, then regenerate.            |
| `bun run db:deploy`       | Apply pending migrations only (CI / production).                        |
| `bun run db:seed`         | Seed the dev DB (`prisma/seed.ts`, replaces the seeded users).          |
| `bun run db:reset`        | Drop, re-migrate, and re-seed the dev DB.                               |
| `bun run db:studio`       | Prisma Studio.                                                          |
| `bun run db:test:prepare` | Reset and migrate the database in `.env.test`, install `pgboss` schema. |

## Testing

Copy `.env.test.example` to `.env.test`, run `bun run db:test:prepare` once per schema change (and
whenever the test DB may be dirty), then `bun run test`. Server tests call the DAL, Server Actions,
and Route Handlers directly against `movies_library_test` and Redis database 15 (flushed between
tests) and never touch the dev database. The job queue is mocked, so no email is ever sent.
Component, presenter, and DTO tests need no database.

## Architecture

```
prisma/schema.prisma ──prisma generate──▶ generated/prisma (git-ignored)

lib/dto/*  Zod schemas: inputs and outputs, types via z.infer (client- and server-safe)
lib/data/* server-only DAL: the only code that touches Prisma; enforces auth; validates inputs; returns DTOs

Server Component ─────────────────▶ lib/data ──▶ PostgreSQL
                                           └──▶ Redis, job queue (lib/server) ──▶ worker/ ──▶ Resend
Server Action (actions/*) ────────▶ lib/data
Route Handler (app/api/v1) ───────▶ lib/data   (decodes with lib/dto, answers JSON)
```

Every data path ends at the same DAL function and returns the same DTO under the same auth rules;
the DAL enforces auth and validates its inputs itself. The conventions (DTOs, DAL, Server Actions,
errors, caching, styling) are in [`AGENTS.md`](AGENTS.md); the reasons behind them in
[`docs/DECISIONS.md`](docs/DECISIONS.md); each area's narrative (auth and the admin plugin, jobs,
email, uploads, caching) in [`docs/guides/`](docs/guides/).

## Pattern index

Where to look to see each pattern done once, properly.

| Pattern                               | Where it is shown                                                                                                                                                                        |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Server-rendered list with URL filters | `app/(site)/admin/page.tsx` + `view.tsx`; `hooks/useUrlState.ts`; `usersUrlQuery` in `lib/dto/users.ts`                                                                                  |
| Form with field errors                | `components/Settings/ProfileForm/index.tsx` (+ `utils.ts`); `lib/formErrors.ts` (`applyActionErrors`); `actions/users.ts`                                                                |
| Record-level authorization policies   | `lib/data/policy.ts` (`authorize`, `permissionsFor`); no resource policy yet                                                                                                             |
| Redis caching and invalidation        | `remember` / `invalidateTags` in `lib/server/cache.ts`; tags in `lib/data/cacheTags.ts`; `getViewer` in `lib/data/users.ts`                                                              |
| Rate limiting                         | `consumeRateLimit` / `getClientIp` in `lib/data/rateLimit.ts`; per IP and per account in `actions/auth.ts`, per user in `createUpload`                                                   |
| Wrapping a Better Auth plugin         | `lib/data/admin.ts` (`setUserRole`, `banUser`, `impersonateUser` over `auth.api.*`); `actions/admin.ts`; page `app/(site)/admin`                                                         |
| Admin-only page                       | `app/(site)/admin/page.tsx` + `view.tsx`; `listUsers` with `requireAdmin()` in `lib/data/admin.ts`; `loadPage` turns 403 into the not-found page                                         |
| Account settings on Better Auth       | `actions/auth.ts` (`changePasswordAction`, `changeEmailAction`, `deleteAccountAction`); `lib/data/sessions.ts`; `app/(site)/settings`                                                    |
| Background job and email              | `jobs/definitions.ts`, `jobs/sendEmail.ts`, `jobs/cleanup.ts`; `lib/server/queue.ts`; `worker/index.ts`; `lib/server/mailer.ts`; `emails/`                                               |
| OAuth (Google)                        | `lib/data/auth.ts` (`socialProviders`, `isGoogleAuthEnabled`); `signInWithGoogleAction` in `actions/auth.ts`; `lib/username.ts`; `components/Auth/GoogleButton`                          |
| Direct-to-storage upload (R2)         | `lib/server/storage.ts` (presigned PUT); `createUpload` / `attachAvatar` in `lib/data/uploads.ts`; `lib/client/uploads.ts`; `components/Settings/AvatarUploader`; `jobs/deleteObject.ts` |
| Health check                          | `lib/data/health.ts`; `app/api/health/route.ts`                                                                                                                                          |

## Adding a resource

The movie catalog is the first resource to build this way. In this order:

1. **Schema.** Add the model to `prisma/schema.prisma` (camelCase fields with snake_case `@map`s,
   an index on every foreign key you filter by, `onDelete: Cascade` where the child cannot outlive
   its parent), then `bun run db:migrate` and `bun run db:test:prepare`. A new table that does not
   hang off `users` goes into `resetDatabase()`'s TRUNCATE list in `tests/helpers/server.ts`.
2. **DTOs** in `lib/dto/<name>.ts`: one input schema per write, one output schema per read shape
   (`...Summary` for lists, `...Detail` for one record), output dates with `z.coerce.date()`, list
   query schemas with every field bounded. A URL-facing twin (`xxxUrlQuery`) with `.catch()` on
   every field if the list keeps its filters in the query string.
3. **DAL** in `lib/data/<name>.ts`: `import 'server-only'`; per function: `requireUser()` /
   `requireAdmin()`, then `parseInput`, then existence, then permission; select exactly the DTO
   columns and map rows to DTOs; typed errors only. Use `db.$transaction` when one write touches
   several tables. Cache with `remember()` only the viewer-independent, bounded reads, and invalidate
   inside the write functions (new tags go in `lib/data/cacheTags.ts`). Put the record-level rules
   (who may view, edit, delete) in `lib/data/policies/<name>.ts` as pure functions of `(viewer,
record)`, call them with `authorize()` after the exists check, and build the DTO's `permissions`
   with `permissionsFor()` (`lib/data/policy.ts`). Test it first, in `tests/lib/data/<name>.test.ts`,
   per viewer (signed out, owner, other user, admin).
4. **Server Actions** in `actions/<name>.ts`: pass the arguments to the DAL untouched, then
   `revalidatePath` / `refresh`, return `ActionResult<T>` through `toActionFailure`. Add a Route
   Handler under `app/api/v1/<name>/` (thin: decode with the DTO schema, call the DAL, return JSON
   or `toErrorResponse`) only for an HTTP API or a client component that must fetch.
5. **Pages and forms.** `page.tsx` is an async Server Component: await `params` / `searchParams`,
   load through `loadPage`, render. Add a `'use client'` `view.tsx` beside it only for what is
   interactive. Forms use React Hook Form with the DTO schema, start with the `'use client'` /
   `'use no memo'` header (copy `components/Settings/ProfileForm`) and map failures with `applyActionErrors`.
   Styles are an SCSS module with shadcn tokens.
6. **Routes and navigation.** Add the route constants to `lib/constants-routes.ts` and decide
   whether each route is public (`PUBLIC_ROUTES`) or private (the default); add the NavBar link.
7. **Only if a view needs reshaped fields**, add `presentX` in `presenters/<Name>Presenter.ts`.
8. **Seed and tests.** Extend `prisma/seed.ts`; add `tests/actions/<name>.test.ts`, component tests
   under `tests/components/`, and handler tests under `tests/app/api/v1/` when there is a handler.

## More

- [`AGENTS.md`](AGENTS.md): project conventions and rules for contributors and agents.
- [`docs/DECISIONS.md`](docs/DECISIONS.md): what was chosen and why, and what was removed and where it went.
- Area guides in [`docs/guides/`](docs/guides/): authentication, route-handlers, caching,
  jobs, email, uploads, infrastructure, environment.
- Recipes in [`docs/recipes/`](docs/recipes/) for what the template leaves out: concurrency and
  optimistic locking, and the other removed patterns.
