import { prisma } from '../lib/prisma.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } })
    return res.status(200).json({ testimonials })
  } catch (err) {
    console.error('Failed to load testimonials, serving empty list', err)
    return res.status(200).json({ testimonials: [] })
  }
}
