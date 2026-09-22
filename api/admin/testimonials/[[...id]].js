import { prisma } from '../../../lib/prisma.js'
import { requireAdmin } from '../../../lib/adminAuth.js'

// Combines list/create (GET/POST) and single-item update/delete (PUT/DELETE)
// into one function via an optional catch-all segment — Vercel's Hobby plan
// caps a deployment at 12 Serverless Functions. /api/admin/testimonials and
// /api/admin/testimonials/:id both route here unchanged.
export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  const idParam = req.query.id
  const id = Array.isArray(idParam) ? idParam[0] : idParam

  if (!id) {
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
