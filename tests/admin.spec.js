import { test, expect } from '@playwright/test'

const PASSWORD = process.env.ADMIN_PASSWORD

test('visiting /admin while logged out redirects to login', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin\/login/)
})

test('wrong password shows an error and does not log in', async ({ page }) => {
  await page.goto('/admin/login')
  await page.fill('#password', 'definitely-wrong')
  await page.click('button[type=submit]')
  await expect(page.getByText('Incorrect password.')).toBeVisible()
  await expect(page).toHaveURL(/\/admin\/login/)
})

test('correct password logs in, and the session survives navigation', async ({ page }) => {
  await page.goto('/admin/login')
  await page.fill('#password', PASSWORD)
  await page.click('button[type=submit]')
  await expect(page).toHaveURL(/\/admin$/)
  await expect(page.getByRole('heading', { name: 'Leads' })).toBeVisible()

  // Nav tabs and session persistence across the admin section
  await page.getByRole('link', { name: 'Settings' }).click()
  await expect(page).toHaveURL(/\/admin\/settings/)
  await expect(page.locator('#contactEmail')).toBeVisible()

  await page.getByRole('button', { name: 'Log Out' }).click()
  await expect(page).toHaveURL(/\/admin\/login/)

  // Logged out now — /admin should bounce back to login again
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin\/login/)
})

test('drafted testimonials stay hidden from the public site until approved', async ({ page, request }) => {
  // The four testimonials seeded by the schema migration start unapproved —
  // the public API must never leak them before a human confirms the quote.
  const before = await request.get('/api/testimonials')
  expect((await before.json()).testimonials).toHaveLength(0)

  await page.goto('/#testimonials')
  await expect(page.getByText('Raju Kusa')).toHaveCount(0)
  await expect(page.locator('#testimonials .eyebrow')).toHaveText('Real Projects') // fallback content

  await page.goto('/admin/login')
  await page.fill('#password', PASSWORD)
  await page.click('button[type=submit]')
  await page.waitForURL(/\/admin$/)

  await page.goto('/admin/testimonials')
  const draftRow = page.locator('tr', { hasText: 'Raju Kusa' })
  await expect(draftRow.getByText('Draft — not shown publicly')).toBeVisible()
  await draftRow.getByText('Edit').click()
  await page.check('#approved')
  await page.click('button:has-text("Save")')
  await expect(page.locator('tr', { hasText: 'Raju Kusa' }).getByText('Live')).toBeVisible()

  // Now approved — shows up publicly, but the still-unapproved ones don't
  const after = await request.get('/api/testimonials')
  const testimonials = (await after.json()).testimonials
  expect(testimonials.map((t) => t.name)).toEqual(['Raju Kusa'])

  await page.goto('/#testimonials')
  await expect(page.getByText('Raju Kusa')).toBeVisible()
  await expect(page.getByText('Rakesh')).toHaveCount(0)
})
