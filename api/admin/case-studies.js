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
        const caseStudies = await prisma.caseStudy.findMany({ orderBy: { order: 'asc' } })
        return res.status(200).json({ caseStudies })
      } catch (err) {
        console.error('Failed to load case studies', err)
        return res.status(500).json({ error: 'Something went wrong' })
      }
    }

    if (req.method === 'POST') {
      const { tag, client, headline, desc, url, metrics, featured, accentBg, accentBorder, order } = req.body ?? {}
      if (!tag || !client || !headline || !desc || !url) {
        return res.status(400).json({ error: 'tag, client, headline, desc, and url are required' })
      }
      try {
        const caseStudy = await prisma.caseStudy.create({
          data: {
            tag,
            client,
            headline,
            desc,
            url,
            metrics: Array.isArray(metrics) && metrics.length ? metrics : undefined,
            featured: Boolean(featured),
            accentBg: accentBg || null,
            accentBorder: accentBorder || null,
            order: order ? Number(order) : undefined,
          },
        })
        return res.status(201).json({ caseStudy })
      } catch (err) {
        console.error('Failed to create case study', err)
        return res.status(500).json({ error: 'Something went wrong' })
      }
    }

    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (req.method === 'PUT') {
    const { tag, client, headline, desc, url, metrics, featured, accentBg, accentBorder, order } = req.body ?? {}
    if (!tag || !client || !headline || !desc || !url) {
      return res.status(400).json({ error: 'tag, client, headline, desc, and url are required' })
    }
    try {
      const caseStudy = await prisma.caseStudy.update({
        where: { id },
        data: {
          tag,
          client,
          headline,
          desc,
          url,
          metrics: Array.isArray(metrics) && metrics.length ? metrics : null,
          featured: Boolean(featured),
          accentBg: accentBg || null,
          accentBorder: accentBorder || null,
          order: Number(order),
        },
      })
      return res.status(200).json({ caseStudy })
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ error: 'Case study not found' })
      console.error('Failed to update case study', err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.caseStudy.delete({ where: { id } })
      return res.status(204).end()
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ error: 'Case study not found' })
      console.error('Failed to delete case study', err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
  }

  res.setHeader('Allow', 'PUT, DELETE')
  return res.status(405).json({ error: 'Method not allowed' })
}
