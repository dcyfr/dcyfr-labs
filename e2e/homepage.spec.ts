import { test, expect } from '@playwright/test'

/**
 * E2E tests for the homepage
 * 
 * These tests run against a real browser and verify the entire application
 * works correctly from a user's perspective.
 */

test.describe('Homepage', () => {
  test('should load and display site title', async ({ page }) => {
    await page.goto('/')
    
    // Check that the page loaded successfully
    await expect(page).toHaveTitle(/Drew McConnell/)
    
    // Verify main heading is visible
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/')
    
    // Check for navigation links
    const blogLink = page.locator('nav').getByRole('link', { name: /blog/i })
    const projectsLink = page.locator('nav').getByRole('link', { name: /projects/i })
    const aboutLink = page.locator('nav').getByRole('link', { name: /about/i })
    
    await expect(blogLink).toBeVisible()
    await expect(projectsLink).toBeVisible()
    await expect(aboutLink).toBeVisible()
  })

  test('should navigate to blog page', async ({ page }) => {
    await page.goto('/')
    
    // Click on blog link
    await page.click('nav a[href="/blog"]')
    
    // Wait for navigation
    await page.waitForURL('/blog')
    
    // Verify we're on the blog page
    await expect(page).toHaveURL('/blog')
    await expect(page.locator('h1')).toContainText(/blog/i)
  })

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Page should still load and be usable
    await expect(page.locator('h1')).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator('h1')).toBeVisible()
  })
})
