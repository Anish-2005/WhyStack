import { expect, test } from '@playwright/test'

test('analyzes the example and exposes its rule evidence', async ({ page }) => {
  const externalRequests: string[] = []
  page.on('request', (request) => {
    if (request.url().startsWith('https://cdn.jsdelivr.net/')) externalRequests.push(request.url())
  })

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Awaiting telemetry' })).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'JSON telemetry events' })).toBeVisible()

  await page.getByRole('button', { name: 'Analyze' }).click()

  await expect(page.getByRole('heading', { name: 'Analysis result' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Downstream dependency failure' })).toBeVisible()
  await expect(page.getByText(/gateway-dependency-failure/)).toBeVisible()

  await page.getByRole('button', { name: 'View payload' }).click()
  await expect(page.locator('#trace-payload')).toBeVisible()
  expect(externalRequests).toEqual([])
})

test('mobile navigation opens by keyboard and reaches the rules page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const openMenu = page.getByRole('button', { name: 'Open navigation menu' })
  await openMenu.focus()
  await page.keyboard.press('Enter')

  await expect(page.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true')
  await page.getByRole('link', { name: 'Rules' }).click()
  await expect(page.getByRole('heading', { name: 'Rule engine' })).toBeVisible()
})
