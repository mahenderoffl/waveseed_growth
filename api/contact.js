import { prisma } from '../lib/prisma.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, company, service, message } = req.body ?? {}

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' })
  }

  try {
    const submission = await prisma.contactSubmission.create({
      data: { name, email, company, service, message },
    })
    return res.status(201).json({ id: submission.id })
  } catch (err) {
    console.error('Failed to save contact submission', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}
