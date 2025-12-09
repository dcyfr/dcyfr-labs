import { test, expect } from '@playwright/test'

test.describe('Dev Banner E2E', () => {
  test('should display dev banner and dismiss in development', async ({ page }) => {
    // Skip this test in production runs - it's intended for dev mode
    if (process.env.PLAYWRIGHT_USE_PROD === '1') test.skip()

    await page.goto('/')

    const banner = page.locator('[aria-label="Dev Banner"]')
    await expect(banner).toBeVisible()

    const closeButton = page.getByRole('button', { name: /Close Dev Banner/i })
    await expect(closeButton).toBeVisible()
    await closeButton.click()

    // After closing, the banner should be hidden and remain hidden after reload
    await expect(banner).toBeHidden()
    await page.reload()
    await expect(banner).toBeHidden()
  })
})
