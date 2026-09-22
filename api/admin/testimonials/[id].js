import { prisma } from '../../../lib/prisma.js'
import { requireAdmin } from '../../../lib/adminAuth.js'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  const { id } = req.query

  if (req.method === 'PUT') {
    const { quote, name, role, initials, color, rating, order } = req.body ?? {}
    if (!quote || !name || !role || !initials) {
      return res.status(400).json({ error: 'quote, name, role, and initials are required' })
    }
    try {
      const testimonial = await prisma.testimonial.update({
        where: { id },
        data: { quote, name, role, initials, color, rating: Number(rating), order: Number(order) },
      })
      return res.status(200).json({ testimonial })
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ error: 'Testimonial not found' })
      console.error('Failed to update testimonial', err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.testimonial.delete({ where: { id } })
      return res.status(204).end()
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ error: 'Testimonial not found' })
      console.error('Failed to delete testimonial', err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
  }

  res.setHeader('Allow', 'PUT, DELETE')
  return res.status(405).json({ error: 'Method not allowed' })
}
