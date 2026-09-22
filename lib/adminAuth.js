import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { stringifySetCookie, parseCookie } from 'cookie'

const COOKIE_NAME = 'admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days, in seconds

function getJwtSecret() {
  const secret = process.env.ADMIN_JWT_SECRET
  if (!secret) throw new Error('ADMIN_JWT_SECRET is not set')
  return secret
}

export function checkAdminPassword(candidate) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || typeof candidate !== 'string') return false

  const a = Buffer.from(candidate)
  const b = Buffer.from(expected)
  // timingSafeEqual requires equal-length buffers; pad so length itself
  // doesn't leak via timing.
  if (a.length !== b.length) {
    crypto.timingSafeEqual(a, a)
    return false
  }
  return crypto.timingSafeEqual(a, b)
}

export function setSessionCookie(res) {
  const token = jwt.sign({ role: 'admin' }, getJwtSecret(), { expiresIn: SESSION_MAX_AGE })
  res.setHeader('Set-Cookie', stringifySetCookie({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  }))
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', stringifySetCookie({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  }))
}

export function isAdminRequest(req) {
  const cookies = req.cookies ?? parseCookie(req.headers.cookie ?? '')
  const token = cookies[COOKIE_NAME]
  if (!token) return false

  try {
    const payload = jwt.verify(token, getJwtSecret())
    return payload.role === 'admin'
  } catch {
    return false
  }
}

export function requireAdmin(req, res) {
  if (!isAdminRequest(req)) {
    res.status(401).json({ error: 'Unauthorized' })
    return false
  }
  return true
}
