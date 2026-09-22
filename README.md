# waveseed_growth

A React + Vite marketing site, using [Oxlint](https://oxc.rs) for linting.

## Development

```bash
npm install
npm run dev
```

## Testing

```bash
npm test
```

Runs a production build, then the Playwright suite (`tests/`) against
`scripts/test-server.mjs` — a small local stand-in for Vercel that serves
the built site and auto-discovers every `api/*.js` route, so it needs no
per-endpoint wiring as routes are added or removed. Needs `DATABASE_URL`,
`ADMIN_PASSWORD`, and `ADMIN_JWT_SECRET` set (see the sections below) —
CI provisions these against an ephemeral Postgres container on every push
and PR (`.github/workflows/ci.yml`).

## Database (Prisma)

The contact form (`src/components/Contact.jsx`) posts to `/api/contact`, a
Vercel serverless function (`api/contact.js`) that saves submissions to a
Postgres database via [Prisma](https://www.prisma.io).

### 1. Get a database

The easiest option is Vercel's free hosted Postgres:

- **From the Vercel dashboard**: open your project → **Storage** tab →
  **Create Database** → **Prisma Postgres** (free tier available), then
  copy the generated `DATABASE_URL`.
- **From the CLI**: `npx create-db` generates a free Prisma Postgres
  database and prints a connection string.
- Any other Postgres works too (Neon, Supabase, local Postgres, etc.) — just
  provide its connection string.

### 2. Configure the connection string

Copy `.env.example` to `.env` and set `DATABASE_URL` to the connection
string from step 1:

```bash
cp .env.example .env
```

If you created the database from the Vercel dashboard, you can instead pull
it directly:

```bash
vercel env pull .env
```

**On Vercel itself, you don't need to set `DATABASE_URL` at all** if you
connected the database via the Storage tab — Vercel auto-injects
project-prefixed variables (e.g. `<project>_POSTGRES_URL`,
`<project>_DATABASE_URL`, `<project>_PRISMA_DATABASE_URL`). `lib/dbUrl.js`
falls back to `<project>_POSTGRES_URL` / `<project>_DATABASE_URL`
automatically (never `..._PRISMA_DATABASE_URL` — that one's a
`prisma+postgres://` Accelerate proxy URL, not a plain Postgres connection,
and isn't compatible with the driver adapter this project uses). If your
project isn't named `WaveSeed_Growth`, update the variable names in
`lib/dbUrl.js` to match yours.

**Prisma Postgres note:** on Vercel, `vercel-build` runs
`prisma migrate deploy` with `PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=1`. Prisma
Postgres's connection can be slow to wake from idle, and Prisma's migration
advisory lock has a fixed, non-configurable 10-second timeout — long enough
to fail on a cold start (`P1002`). This is an
[officially supported escape hatch](https://pris.ly/d/migrate-advisory-locking)
for that exact scenario, and is safe here because Vercel only ever runs one
production build at a time (the lock exists to stop *concurrent* migrations
from racing, which can't happen in this setup).

### 3. Create the database schema

```bash
npm run prisma:migrate
```

This applies `prisma/schema.prisma` (currently a single `ContactSubmission`
model) to your database and regenerates the Prisma Client.

**On Vercel, this step happens automatically.** The build runs
`prisma migrate deploy` (via the `vercel-build` script in `package.json`)
against whatever `DATABASE_URL` is set in the project's environment
variables, before every deploy — so a schema change just needs a push, not
a manual command. If `DATABASE_URL` is missing or unreachable, the build
itself fails with the real error in **Vercel → Deployments → (the
deployment) → Build Logs**, which is the fastest way to see what's wrong.

### 4. Run locally

Vite's dev server (`npm run dev`) does not execute the `/api` serverless
function. To test the contact form end-to-end locally, run the project
through the Vercel CLI instead:

```bash
npx vercel dev
```

### Inspecting data

```bash
npm run prisma:studio
```

Opens Prisma Studio, a GUI for browsing/editing the database.

## Admin Dashboard

Leads (contact form submissions) can be viewed, searched, and deleted at
`/admin` — a password-protected page backed by the same database.

### Setup

Set two more variables in `.env` (and in your Vercel project's environment
variables for production):

```bash
ADMIN_PASSWORD="pick-a-strong-password"
ADMIN_JWT_SECRET="$(openssl rand -hex 32)"
```

- `ADMIN_PASSWORD` is what you type in at `/admin/login`.
- `ADMIN_JWT_SECRET` signs the login session cookie — use a long random
  value, and never commit it.

### Using it

- Visit `/admin/login`, sign in, and you'll land on `/admin` with a
  searchable table of leads.
- Sessions last 7 days (an httpOnly cookie) or until you click **Log Out**.
- The route isn't linked from the site's nav — treat the URL as
  semi-private, and rotate `ADMIN_PASSWORD`/`ADMIN_JWT_SECRET` if you
  suspect either has leaked.
- Like the contact form's `/api` route, this needs `npx vercel dev` (not
  `npm run dev`) to test locally, since it's backed by serverless
  functions.

### Sections

- **Leads** (`/admin`) — search, filter by status (New / Contacted /
  Qualified / Converted — click a lead's status badge to change it),
  export the current view as CSV, or delete a lead.
- **Testimonials** (`/admin/testimonials`) — add/edit/delete the
  testimonials shown on the site.
- **Case Studies** (`/admin/case-studies`) — add/edit/delete the case
  study cards, including their metrics and featured-card accent colors.
- **Settings** (`/admin/settings`) — edit the contact email/phone shown
  in the Contact section.

For Testimonials, Case Studies, and Settings: the site's original
hardcoded content is a fallback, not a seed. It keeps showing until you
add at least one entry (Testimonials/Case Studies) or save a change
(Settings) — after that, whatever's in the database is what the public
site renders. If the database is empty or briefly unreachable, the
public site falls back to that hardcoded content rather than breaking.
