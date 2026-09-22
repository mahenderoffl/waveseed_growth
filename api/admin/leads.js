import { prisma } from '../../lib/prisma.js'
import { requireAdmin } from '../../lib/adminAuth.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!requireAdmin(req, res)) return

  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''

  try {
    const leads = await prisma.contactSubmission.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { email: { contains: q, mode: 'insensitive' } },
              { phone: { contains: q, mode: 'insensitive' } },
              { company: { contains: q, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
      take: 500,
    })
    return res.status(200).json({ leads })
  } catch (err) {
    console.error('Failed to load leads', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}
