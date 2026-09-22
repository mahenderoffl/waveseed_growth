// Vercel's native Postgres/Prisma Postgres integration prefixes its
// auto-injected env vars with the project name (e.g. WaveSeed_Growth_...)
// instead of exposing a plain DATABASE_URL. Fall back to those so the app
// works without a separately maintained DATABASE_URL variable.
//
// WaveSeed_Growth_PRISMA_DATABASE_URL is intentionally not used here — it's
// a prisma+postgres:// Accelerate proxy URL, not a plain Postgres
// connection string, and isn't compatible with the pg driver adapter.
export function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.WaveSeed_Growth_POSTGRES_URL ||
    process.env.WaveSeed_Growth_DATABASE_URL
  )
}
