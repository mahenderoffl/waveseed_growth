import { prisma } from '../../../lib/prisma.js'
import { requireAdmin } from '../../../lib/adminAuth.js'
import { LEAD_STATUSES } from '../../../lib/constants.js'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  const { id } = req.query

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
