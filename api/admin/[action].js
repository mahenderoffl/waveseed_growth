import { checkAdminPassword, setSessionCookie, clearSessionCookie, isAdminRequest } from '../../lib/adminAuth.js'
import { checkRateLimit, getClientIp } from '../../lib/rateLimit.js'

const LOGIN_WINDOW_MS = 10 * 60 * 1000
const LOGIN_MAX_ATTEMPTS = 8

// Combines login/logout/session into one function — Vercel's Hobby plan
// caps a deployment at 12 Serverless Functions, and each /api file counts
// as one. This keeps the exact same URLs (/api/admin/login, etc.) via the
// [action] dynamic segment, so no frontend changes are needed.
export default async function handler(req, res) {
  const { action } = req.query

  if (action === 'login') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
      const allowed = await checkRateLimit(`login:${getClientIp(req)}`, {
        windowMs: LOGIN_WINDOW_MS,
        max: LOGIN_MAX_ATTEMPTS,
      })
      if (!allowed) {
        return res.status(429).json({ error: 'Too many attempts. Try again in a few minutes.' })
      }
    } catch (err) {
      // Fail open on the rate limiter itself — a DB hiccup shouldn't lock
      // out the one legitimate admin, and login doesn't otherwise need DB.
      console.error('Rate limit check failed, allowing login attempt', err)
    }

    const { password } = req.body ?? {}
    if (!checkAdminPassword(password)) {
      return res.status(401).json({ error: 'Invalid password' })
    }
    setSessionCookie(res)
    return res.status(200).json({ ok: true })
  }

  if (action === 'logout') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return res.status(405).json({ error: 'Method not allowed' })
    }
    clearSessionCookie(res)
    return res.status(200).json({ ok: true })
  }

  if (action === 'session') {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      return res.status(405).json({ error: 'Method not allowed' })
    }
    return res.status(200).json({ authenticated: isAdminRequest(req) })
  }

  return res.status(404).json({ error: 'Not found' })
}
