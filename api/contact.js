import { prisma } from '../lib/prisma.js'
import { checkRateLimit, getClientIp } from '../lib/rateLimit.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WINDOW_MS = 10 * 60 * 1000
const MAX_SUBMISSIONS = 5

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, phone, company, service, message, website } = req.body ?? {}

  // Honeypot: a real visitor never fills this hidden field. Bots that
  // auto-fill every input do. Pretend success without writing anything,
  // so the bot has no signal to adapt on.
  if (website) {
    return res.status(201).json({ id: 'ok' })
  }

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required' })
  }

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' })
  }

  try {
    const allowed = await checkRateLimit(`contact:${getClientIp(req)}`, {
      windowMs: WINDOW_MS,
      max: MAX_SUBMISSIONS,
    })
    if (!allowed) {
      return res.status(429).json({ error: 'Too many submissions. Please try again later.' })
    }
  } catch (err) {
    // Fail open — don't let a rate-limiter hiccup block a genuine lead.
    console.error('Rate limit check failed, allowing submission', err)
  }

  try {
    const submission = await prisma.contactSubmission.create({
      data: { name, email, phone, company, service, message },
    })
    return res.status(201).json({ id: submission.id })
  } catch (err) {
    console.error('Failed to save contact submission', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}
