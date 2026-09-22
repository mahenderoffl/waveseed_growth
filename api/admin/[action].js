import { checkAdminPassword, setSessionCookie, clearSessionCookie, isAdminRequest } from '../../lib/adminAuth.js'

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
