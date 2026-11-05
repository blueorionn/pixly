# Pixly

A personal photo gallery built with Next.js, Neon Postgres, Drizzle ORM, and Tailwind CSS.

> **Status: early development.** Authentication, uploads, collections, search, and signed CDN access are not implemented yet. Do not expose private photos from this app until those pieces are in place.

## Overview

Pixly is a self-hosted-style personal photo gallery. The current app provides a responsive photo feed backed by a paginated API, with images served from a CDN.

The database schema also includes collections and a many-to-many photo/collection join table.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React Compiler, Turbopack)
- **UI:** React 19, Tailwind CSS 4, Base UI, shadcn
- **Language:** TypeScript 5
- **Database:** Neon Postgres
- **ORM:** Drizzle ORM + drizzle-kit
- **Database driver:** `@neondatabase/serverless` (`neon-http`)
- **Images:** `next/image`
- **PWA:** Serwist
- **Icons:** Lucide
- **Package manager:** pnpm

## Current Features

- Responsive masonry photo feed (2 columns on mobile, 3 on desktop)
- Infinite scroll with duplicate filtering
- Paginated public photo API
- Server-built CDN URLs for image storage keys
- Light/dark theme
- Responsive site header and mobile bottom navigation
- PWA manifest and offline fallback page
- Database schema for photos, collections, and photo/collection membership
- Soft deletes, visibility flags, NSFW flag, and basic data constraints
- Database migrations managed with drizzle-kit

## Planned

- WebAuthn / passkey authentication
- AWS S3 uploads
- AWS CloudFront distribution with signed cookies
- Search
- Collections UI and CRUD
- Hidden, deleted, and NSFW gallery views
- Favorites
- EXIF metadata and capture dates
- Upload progress and background processing
- Tests and CI

## Getting Started

### Prerequisites

- Node.js 20.9 or newer
- pnpm 12 (the project declares `pnpm@12.14.0`)
- A Neon Postgres database, or another Postgres database
- A local or remote origin for serving photo files

### Install

```bash
git clone <repository-url>
cd pixly
corepack enable
pnpm install
```

### Environment Variables

Create a `.env` file in the project root:

```dotenv
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

CDN_HOST=https://cdn.example.com
CDN_PHOTO_PREFIX=photos
```

The CDN prefix can also be set with the historical spelling used by this project:

```dotenv
CDN_PHOTO_PERFFIX=photos
```

`utils/cdn.ts` supports both names, preferring `CDN_PHOTO_PREFIX`.

Important:

- `.env` is gitignored. Never commit it.
- `DATABASE_URL`, `CDN_HOST`, and the CDN prefix are **server-only** because they do not start with `NEXT_PUBLIC_`.
- Do not import `cdnUrl` directly into a client component unless you pass explicit values or expose public environment variables.
- The API builds the final `storageURL` on the server and sends it to the browser.

### Database Setup

Generate and apply the initial migration:

```bash
pnpm db:generate
pnpm db:migrate
```

Open Drizzle Studio:

```bash
pnpm db:studio
```

The initial migration lives at:

```txt
db/migrations/0000_dark_diamondback.sql
```

After changing `db/schema.ts`, run `pnpm db:generate` again and commit both the schema change and the generated migration.

> The current runtime uses `neon-http`, which does not support transactions. If you need multi-statement transactions later, switch to `neon-serverless` with a `Pool`, or use `postgres-js`.

### Run the App

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The service worker is disabled in development. To exercise the PWA behavior, use a production build:

```bash
pnpm build
pnpm start
```

## Scripts

| Command             | Description                            |
| ------------------- | -------------------------------------- |
| `pnpm dev`          | Start the Next.js development server   |
| `pnpm build`        | Create a production build              |
| `pnpm start`        | Start the production server            |
| `pnpm lint`         | Run ESLint                             |
| `pnpm format`       | Format the project with Prettier       |
| `pnpm format:check` | Check formatting without writing files |
| `pnpm db:generate`  | Generate a Drizzle migration           |
| `pnpm db:migrate`   | Apply pending Drizzle migrations       |
| `pnpm db:studio`    | Open Drizzle Studio                    |

## Image and CDN Flow

1. A photo row stores a `storageKey`.
2. The API calls `cdnUrl(photo.storageKey)`.
3. `utils/cdn.ts` joins `CDN_HOST`, the configured photo prefix, and the storage key.
4. The API returns a full `storageURL`.
5. `PhotoFeed` passes that URL to `next/image`.

The storage key should be **relative to the CDN photo prefix**. For example, with `CDN_PHOTO_PREFIX=photos`:

```txt
storageKey: photo-123.jpg
result:     https://cdn.example.com/photos/photo-123.jpg
```

If your keys already include the prefix, do not configure the prefix a second time.

### Next Image

`next.config.ts` must allow the CDN host and protocol through `images.remotePatterns`. For example:

```ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.example.com',
      pathname: '/photos/**',
    },
  ],
}
```

For local development with `CDN_HOST=http://localhost`, the pattern must allow `http` and the `localhost` hostname.

### CloudFront and Signed Cookies

CloudFront signed cookies are planned but **not implemented yet**.

When they are added:

- The CDN host will point at the CloudFront distribution.
- Private media will require CloudFront signed cookies rather than public object URLs.
- The app must not expose signed cookies to unauthorized clients.
- Browser image requests must include the signed cookies automatically.

Until then, treat the configured CDN origin as public.

## Authentication and Security

Authentication is **not implemented yet**. There is currently:

- No login or session system
- No ownership checks on photos or collections
- No protection around the `/api/photos` endpoint
- No CloudFront signed-cookie protection

The planned authentication approach is WebAuthn/passkey authentication. Until that exists, do not host personal or private photos on a public deployment.

The `uploadedBy` and `createdBy` fields are placeholders for future user ownership. They are not foreign keys yet because there is no `users` table.

## Known Limitations

- No authentication or authorization
- No upload API or upload UI
- Collections are schema-only; no pages or API
- Search is not implemented
- The gallery view selector (Public/Hidden/Deleted/NSFW) is currently UI-only and is not wired to the API
- `/search`, `/scroll`, `/account`, `/collections`, and `/upload` links are placeholders unless corresponding routes are added
- The homepage feed is fetched client-side, so photos are not present in the initial server-rendered HTML
- The current database client cannot run transactions
- No automated tests yet
- Theme is applied client-side; a dark-theme flash may occur on initial load until a pre-hydration script is added

## Roadmap

- [x] Photo feed schema and initial migration
- [x] Paginated public photos API
- [x] Responsive masonry feed with infinite scroll
- [x] CDN URL builder
- [x] Light/dark theme
- [x] PWA shell and offline fallback
- [ ] WebAuthn/passkey authentication
- [ ] User/ownership tables and foreign keys
- [ ] Upload pipeline to S3
- [ ] CloudFront signed cookies
- [ ] Search
- [ ] Collections UI and CRUD
- [ ] Hidden, deleted, and NSFW views
- [ ] Favorites
- [ ] EXIF and capture-date support
- [ ] Automated tests and CI

## Deployment Notes

Before deploying:

1. Set `DATABASE_URL`, `CDN_HOST`, and the CDN photo prefix in the hosting environment.
2. Run pending database migrations.
3. Configure `images.remotePatterns` for the CDN host and protocol.
4. Build with `pnpm build`.
5. Add authentication and CloudFront signed cookies before exposing private photos.
6. Verify that the CDN origin is serving the expected `/photos/...` paths.

## License

Licensed under the Apache License 2.0. See [LICENSE](./LICENSE).
