import { test, expect } from '@playwright/test'

test('homepage renders the hero and key sections', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('We Turn Ambition')
  await expect(page.locator('#work')).toBeVisible()
  await expect(page.locator('#contact')).toBeVisible()
})

test('unknown route shows the 404 page', async ({ page }) => {
  await page.goto('/this-page-does-not-exist')
  await expect(page.getByText('404')).toBeVisible()
  await expect(page.getByText('Page not found')).toBeVisible()
  await page.getByRole('link', { name: 'Back to Home' }).click()
  await expect(page).toHaveURL('/')
})

test('robots.txt and sitemap.xml are served', async ({ request }) => {
  const robots = await request.get('/robots.txt')
  expect(robots.ok()).toBeTruthy()
  expect(await robots.text()).toContain('Disallow: /admin')

  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.ok()).toBeTruthy()
})

test('privacy policy and terms pages render and are linked from the footer', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Privacy Policy' }).click()
  await expect(page).toHaveURL('/privacy')
  await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible()

  await page.getByRole('link', { name: '← Back to Home' }).click()
  await expect(page).toHaveURL('/')

  await page.getByRole('link', { name: 'Terms of Service' }).click()
  await expect(page).toHaveURL('/terms')
  await expect(page.getByRole('heading', { name: 'Terms of Service' })).toBeVisible()
})

test('contact form rejects submission with missing required fields', async ({ page }) => {
  await page.goto('/#contact')
  await page.fill('#cn', 'Missing Phone')
  await page.fill('#ce', 'missingphone@example.com')
  // phone intentionally left blank
  await page.click('button[type=submit]')
  await expect(page.getByRole('alert')).toBeVisible()
})

test('contact form succeeds with valid data', async ({ page }) => {
  await page.goto('/#contact')
  await page.fill('#cn', 'Playwright Suite')
  await page.fill('#ce', 'playwright-suite@example.com')
  await page.fill('#cp', '+1 555 010 0100')
  await page.click('button[type=submit]')
  await expect(page.getByText("You're all set!")).toBeVisible({ timeout: 10000 })
})

test('contact form honeypot silently blocks bot-like submissions', async ({ page, request }) => {
  await page.goto('/#contact')
  await page.fill('#cn', 'Honeypot Bot Submission')
  await page.fill('#ce', 'honeypot-bot@example.com')
  await page.fill('#cp', '+1 555 010 0101')
  // A real visitor never sees or fills this hidden field.
  await page.fill('#cw', 'http://spam.example')
  await page.click('button[type=submit]')
  // The UI still shows success — the point of a honeypot is not tipping the bot off.
  await expect(page.getByText("You're all set!")).toBeVisible({ timeout: 10000 })

  // But it must never actually reach the leads table.
  await request.post('/api/admin/login', { data: { password: process.env.ADMIN_PASSWORD } })
  const res = await request.get('/api/admin/leads?q=Honeypot')
  const { leads } = await res.json()
  expect(leads).toHaveLength(0)
})
