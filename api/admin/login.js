import { checkAdminPassword, setSessionCookie } from '../../lib/adminAuth.js'

export default async function handler(req, res) {
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
