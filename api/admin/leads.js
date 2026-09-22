import { prisma } from '../../lib/prisma.js'
import { requireAdmin } from '../../lib/adminAuth.js'
import { LEAD_STATUSES } from '../../lib/constants.js'

// Handles the leads list (GET, with q/status filters) and single-lead
// PATCH/DELETE (via ?id=) in one function. Vercel's Hobby plan caps a
// deployment at 12 Serverless Functions, and — unlike Next.js — its
// generic (non-Next.js) file router does not support optional catch-all
// routes ([[...id]].js), so the id travels as a query param instead of a
// path segment: that's the only way to keep list and item operations on
// one static route file without relying on an unsupported convention.
export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  const id = typeof req.query.id === 'string' ? req.query.id : undefined

  if (!id) {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
    const status = typeof req.query.status === 'string' && LEAD_STATUSES.includes(req.query.status)
      ? req.query.status
      : undefined

    try {
      const leads = await prisma.contactSubmission.findMany({
        where: {
          status,
          ...(q
            ? {
                OR: [
                  { name: { contains: q, mode: 'insensitive' } },
                  { email: { contains: q, mode: 'insensitive' } },
                  { phone: { contains: q, mode: 'insensitive' } },
                  { company: { contains: q, mode: 'insensitive' } },
                ],
              }
            : {}),
        },
        orderBy: { createdAt: 'desc' },
        take: 500,
      })
      return res.status(200).json({ leads })
    } catch (err) {
      console.error('Failed to load leads', err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
  }

  if (req.method === 'PATCH') {
    const { status } = req.body ?? {}
    if (!LEAD_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of ${LEAD_STATUSES.join(', ')}` })
    }
    try {
      const lead = await prisma.contactSubmission.update({ where: { id }, data: { status } })
      return res.status(200).json({ lead })
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ error: 'Lead not found' })
      console.error('Failed to update lead status', err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.contactSubmission.delete({ where: { id } })
      return res.status(204).end()
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ error: 'Lead not found' })
      console.error('Failed to delete lead', err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
  }

  res.setHeader('Allow', 'PATCH, DELETE')
  return res.status(405).json({ error: 'Method not allowed' })
}
