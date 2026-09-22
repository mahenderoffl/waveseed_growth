import { prisma } from '../../../lib/prisma.js'
import { requireAdmin } from '../../../lib/adminAuth.js'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', 'DELETE')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!requireAdmin(req, res)) return

  const { id } = req.query

  try {
    await prisma.contactSubmission.delete({ where: { id } })
    return res.status(204).end()
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Lead not found' })
    }
    console.error('Failed to delete lead', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}
