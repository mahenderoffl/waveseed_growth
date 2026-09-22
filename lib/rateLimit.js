import { prisma } from './prisma.js'

// Returns the caller's IP from Vercel's forwarded-for header, falling back
// to the raw socket address for local/non-proxied environments.
export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket?.remoteAddress ?? 'unknown'
}

// Fixed-window rate limiter backed by Postgres (no extra infra needed).
// Returns true if the request is allowed (and records it), false if the
// caller is over the limit for this window. Prunes its own old rows.
export async function checkRateLimit(key, { windowMs, max }) {
  const since = new Date(Date.now() - windowMs)

  await prisma.rateLimitHit.deleteMany({ where: { key, createdAt: { lt: since } } })
  const count = await prisma.rateLimitHit.count({ where: { key, createdAt: { gte: since } } })

  if (count >= max) return false

  await prisma.rateLimitHit.create({ data: { key } })
  return true
}
