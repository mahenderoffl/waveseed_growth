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
