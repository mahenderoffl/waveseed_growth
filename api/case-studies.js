import { prisma } from '../lib/prisma.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const caseStudies = await prisma.caseStudy.findMany({ orderBy: { order: 'asc' } })
    return res.status(200).json({ caseStudies })
  } catch (err) {
    console.error('Failed to load case studies, serving empty list', err)
    return res.status(200).json({ caseStudies: [] })
  }
}
