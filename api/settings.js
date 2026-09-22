import { prisma } from '../lib/prisma.js'
import { DEFAULT_SETTINGS } from '../lib/constants.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } })
    return res.status(200).json({ settings: settings ?? DEFAULT_SETTINGS })
  } catch (err) {
    console.error('Failed to load settings, serving defaults', err)
    return res.status(200).json({ settings: DEFAULT_SETTINGS })
  }
}
