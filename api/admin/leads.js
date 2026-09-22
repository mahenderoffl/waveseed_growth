import { prisma } from '../../lib/prisma.js'
import { requireAdmin } from '../../lib/adminAuth.js'
import { LEAD_STATUSES } from '../../lib/constants.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!requireAdmin(req, res)) return

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
