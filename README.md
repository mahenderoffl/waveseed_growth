# waveseed_growth

A React + Vite marketing site, using [Oxlint](https://oxc.rs) for linting.

## Development

```bash
npm install
npm run dev
```

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
  searchable, sortable table of leads.
- Sessions last 7 days (an httpOnly cookie) or until you click **Log Out**.
- The route isn't linked from the site's nav — treat the URL as
  semi-private, and rotate `ADMIN_PASSWORD`/`ADMIN_JWT_SECRET` if you
  suspect either has leaked.
- Like the contact form's `/api` route, this needs `npx vercel dev` (not
  `npm run dev`) to test locally, since it's backed by serverless
  functions.
