## Decisions

- Using Shadcn as it's very flexible and has almost everything I need. The underlying Base UI has accessibility best practices baked in.
- Using React Hook Form with zod validations, I like the way it handles forms and validations.
- Decided against a service layer as in this full stack project it would add complications, either force everything through HTTP requests (which is additional overhead for server components) or create an abstraction that would remove the HTTP overhead but introduce complexity.
- I chose to follow NextJs's convention with have a DAL (data access layer). Validations, authentication, and authorization are enforced at the DAL level, so every server action or HTTP route has a common ground and is less likely to miss a step.
- I chose prisma and postgres both because they're industry standard and because I'm very comfortable with them.
- Using Better Auth with its admin plugin for roles, bans and impersonation instead of building them myself. Most of its HTTP routes are disabled so they can't bypass the DAL's validations and rate limits.
- Using UUIDv7 for better indexing (they're lexicographically sortable) and to prevent enumeration. Tradeoff, it's easy to guess when the record was created, but we already offer createdAt
- The website will only have a Dark theme as movie posters look better with a black background.
- Everything is accessed by their slugs to prevent enumerations. In the same vein auth attempts don't disclose any info on whether the user exists or not
- Using scss instead of tailwind for the main bulk of the app, tailwind stays scoped within Shadcn components. Scss is easier to maintain and more readable.
- Redis is the only cache, turned off nextjs's cache for simplification
- One cache tag for the whole catalog, not one per record. Movies, genres and people reference each other, so per record tags would need an invalidation very often.
- Ratings are stored on the movie row and kept up to date by a database trigger. A trigger, not app code, because cascade deletes remove reviews without going through the DAL.
- Search is ILIKE with trigram indexes, not full-text search, and needs at least 3 characters.
- When Redis is unreachable we don't retry, we hit the DB directly because that's almost always less costly in terms of speed.
- pg-boss for queues and jobs, managing them in postgres allows for one less service to manage.
- Using @map in prisma schema to use snake_case to avoid confusion.

## Steps where I stopped the AI

- I asked it to implement the search and filters feature, and it did so, it implemented it correctly, but then I reviewed its queries for any performance issues, and found a few, and had it fix them.

## What I would've added before this goes to Prod

- I would've added functionality to editors, I decided against developing it to prevent feature creep and add polish to other more important aspects of the app. I implemented the authorization system in anticipation of this role having more nuance in terms of actions they're allowed to perform.
- Obviously the seeded data (including admin user shown at the auth page) would go away.
- Built on top of the social features.
