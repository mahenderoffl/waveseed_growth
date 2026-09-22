import { prisma } from '../../lib/prisma.js'
import { requireAdmin } from '../../lib/adminAuth.js'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'GET') {
    try {
      const testimonials = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } })
      return res.status(200).json({ testimonials })
    } catch (err) {
      console.error('Failed to load testimonials', err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
  }

  if (req.method === 'POST') {
    const { quote, name, role, initials, color, rating, order } = req.body ?? {}
    if (!quote || !name || !role || !initials) {
      return res.status(400).json({ error: 'quote, name, role, and initials are required' })
    }
    try {
      const testimonial = await prisma.testimonial.create({
        data: {
          quote,
          name,
          role,
          initials,
          color: color || undefined,
          rating: rating ? Number(rating) : undefined,
          order: order ? Number(order) : undefined,
        },
      })
      return res.status(201).json({ testimonial })
    } catch (err) {
      console.error('Failed to create testimonial', err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
