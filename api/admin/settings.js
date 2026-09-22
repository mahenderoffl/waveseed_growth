import { prisma } from '../../lib/prisma.js'
import { requireAdmin } from '../../lib/adminAuth.js'

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', 'PUT')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!requireAdmin(req, res)) return

  const { contactEmail, contactPhone } = req.body ?? {}
  if (!contactEmail || !contactPhone) {
    return res.status(400).json({ error: 'contactEmail and contactPhone are required' })
  }

  try {
    const settings = await prisma.siteSetting.upsert({
      where: { id: 1 },
      create: { id: 1, contactEmail, contactPhone },
      update: { contactEmail, contactPhone },
    })
    return res.status(200).json({ settings })
  } catch (err) {
    console.error('Failed to save settings', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}
