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

### 3. Create the database schema

```bash
npm run prisma:migrate
```

This applies `prisma/schema.prisma` (currently a single `ContactSubmission`
model) to your database and regenerates the Prisma Client.

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
