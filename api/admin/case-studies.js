import { prisma } from '../../lib/prisma.js'
import { requireAdmin } from '../../lib/adminAuth.js'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

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
    const { tag, client, headline, desc, metrics, featured, accentBg, accentBorder, order } = req.body ?? {}
    if (!tag || !client || !headline || !desc) {
      return res.status(400).json({ error: 'tag, client, headline, and desc are required' })
    }
    try {
      const caseStudy = await prisma.caseStudy.create({
        data: {
          tag,
          client,
          headline,
          desc,
          metrics: Array.isArray(metrics) ? metrics : [],
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
