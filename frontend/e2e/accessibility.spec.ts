import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

async function expectWcagCompliant(page: Page, label: string) {
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze()
  const violations = results.violations.map(({ id, impact, help, nodes }) => ({
    id,
    impact,
    help,
    elements: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
  }))

  expect(violations, `${label} accessibility violations`).toEqual([])
}

test('the analysis page meets WCAG 2.2 AA checks in dark and light themes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => window.localStorage.setItem('theme', 'dark'))
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Analyze' })).toBeVisible()

  for (const theme of ['dark', 'light'] as const) {
    if (theme === 'light') await page.getByRole('button', { name: 'Switch to light theme' }).click()
    await expectWcagCompliant(page, `${theme} theme`)
  }
})

for (const path of ['/docs', '/rules', '/about']) {
  test(`${path} meets WCAG 2.2 AA checks`, async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('theme', 'dark'))
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
    if (path === '/rules') await expect(page.getByRole('region', { name: 'Active analysis rules' })).toBeVisible()

    await expectWcagCompliant(page, path)
  })
}
