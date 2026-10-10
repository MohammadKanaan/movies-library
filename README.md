# Movies Library

A movie catalog built with Next.js, Prisma, PostgreSQL and Redis.

Live at https://movies.mohammadkanaan.dev

## Run it

Requires [Bun](https://bun.sh), Docker (for PostgreSQL and Redis) and Node 24.

```bash
cp .env.example .env     # set BETTER_AUTH_SECRET (openssl rand -base64 32)
docker compose up -d     # PostgreSQL and Redis
bun install
bun run db:deploy        # apply migrations
bun run db:seed          # seed an admin, an editor and a viewer
bun run dev              # http://localhost:3000
bun run dev:worker       # second terminal: background jobs (emails, cleanup)
```

Sign in as `admin@example.com` with `password123`.

Every variable is documented in [`.env.example`](.env.example). Only `BETTER_AUTH_SECRET` has to
be filled in; Resend, Google sign-in and R2 uploads are optional.

## Run it with Docker

Runs the whole stack (PostgreSQL, Redis, migrations, web and worker) in containers. Requires only
Docker.

```bash
cp .env.example .env     # set BETTER_AUTH_SECRET (openssl rand -base64 32)
docker compose --profile app up --build
```

Then, once, in a second terminal:

```bash
docker compose --profile app run --rm -e ALLOW_SEED=1 migrate bun run db:seed
```

The app is at http://localhost:3000 and the health check at http://localhost:3000/api/health.
`ALLOW_SEED=1` is needed because the containers run with `NODE_ENV=production`, where the seed
refuses to run by default.

## Tests

```bash
cp .env.test.example .env.test
bun run db:test:prepare
bun run test
```

## Notes

Why the stack looks the way it does, and what I'd add before production:
[`docs/DECISIONS.md`](docs/DECISIONS.md).
