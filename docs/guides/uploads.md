# Cloudflare R2 setup

Uploads (profile photos, movie posters, people's headshots) go straight from the browser to an R2
bucket through a presigned PUT; the code in `lib/server/storage.ts`, `lib/data/uploads.ts`,
`lib/data/movies.ts` and `lib/data/people.ts` documents the flow. This page covers the one part the code cannot: the bucket and its variables.

The five `R2_*` variables are **optional as a group** (`lib/server/env.ts` refuses a partial set).
Without them `isStorageConfigured()` is false, the DAL refuses tickets, `/settings` hides the profile
photo card and the admin poster card and people photo dialog show a note instead of their controls
(`canUpload()`), and the app runs without an R2 account. With them:

| Variable               | Value                                                                                               |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| `R2_ACCOUNT_ID`        | Your Cloudflare account id; the S3 endpoint is `https://<account>.r2.cloudflarestorage.com`.        |
| `R2_ACCESS_KEY_ID`     | From an R2 API token with **Object Read & Write** on the bucket (R2 → Manage R2 API Tokens).        |
| `R2_SECRET_ACCESS_KEY` | Its secret.                                                                                         |
| `R2_BUCKET`            | The bucket name.                                                                                    |
| `R2_PUBLIC_URL`        | The bucket's public origin, no path: its `https://pub-….r2.dev` subdomain or a custom domain on it. |

Setting up the bucket in the Cloudflare dashboard:

1. **Create the bucket.** Location hint as you like; `region` in the client is `auto`.
2. **Public access.** Settings → Public access: enable the `r2.dev` subdomain (fine for development;
   rate limited and not for production traffic) or connect a custom domain (recommended in production:
   Cloudflare's cache and WAF sit in front). Either origin is `R2_PUBLIC_URL`. This makes **every
   object in the bucket** readable by URL, drafts included: private documents need short-lived signed
   GET URLs from the DAL instead of `publicUrl`, and a separate bucket.
3. **CORS.** Settings → CORS policy. The browser's presigned PUT is a cross-origin request with a
   `Content-Type` header, so it preflights; allow your app origins:
   ```json
   [
     {
       "AllowedOrigins": ["http://localhost:3000", "https://your-app.example"],
       "AllowedMethods": ["PUT"],
       "AllowedHeaders": ["Content-Type", "Content-Length"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```
   Reads through `R2_PUBLIC_URL` are plain `<img>` loads and need no CORS.
4. **API token.** Manage R2 API Tokens → Create: Object Read & Write, scoped to this bucket. The
   token's Access Key ID and Secret Access Key are the two credential variables.

The client uses path-style URLs (`forcePathStyle: true`): tickets look like
`https://<account>.r2.cloudflarestorage.com/<bucket>/avatars/<userId>/<uuid>?X-Amz-…`, so one host
covers CORS and any CSP `connect-src`, and a bucket name with dots still gets a valid certificate.

Compose passes the five variables from `.env` to `web` and `worker` (empty by default). Tests mock
`@/lib/server/storage` and never need an account; `tests/lib/server/storage.test.ts` checks the
signature against a stubbed environment.
