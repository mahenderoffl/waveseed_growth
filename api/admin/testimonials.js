import { prisma } from '../../lib/prisma.js'
import { requireAdmin } from '../../lib/adminAuth.js'

// Handles list/create (GET/POST) and single-item update/delete (via ?id=)
// in one function — see the comment in api/admin/leads.js for why the id
// is a query param rather than a URL path segment.
export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  const id = typeof req.query.id === 'string' ? req.query.id : undefined

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
      const { name, description, url, initials, color, order } = req.body ?? {}
      if (!name || !description || !url || !initials) {
        return res.status(400).json({ error: 'name, description, url, and initials are required' })
      }
      try {
        const testimonial = await prisma.testimonial.create({
          data: {
            name,
            description,
            url,
            initials,
            color: color || undefined,
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
    const { name, description, url, initials, color, order } = req.body ?? {}
    if (!name || !description || !url || !initials) {
      return res.status(400).json({ error: 'name, description, url, and initials are required' })
    }
    try {
      const testimonial = await prisma.testimonial.update({
        where: { id },
        data: { name, description, url, initials, color, order: Number(order) },
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
