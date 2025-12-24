import { test, expect } from '@playwright/test'
import openMobileNav from './utils/nav'

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
    await expect(page).toHaveTitle(/DCYFR Labs/)

    // Verify main logo link is visible (logo text may be hidden on mobile)
    await expect(page.locator('header a[href="/"]')).toBeVisible()
  })

  test('should have working navigation', async ({ page, browserName }) => {
    await page.goto('/')

    // On mobile viewports, header nav is hidden and bottom nav is used
    // On desktop, header nav is visible
    const viewport = page.viewportSize()
    const isMobile = viewport && viewport.width < 768 // md breakpoint is 768px

    if (isMobile) {
      // Skip mobile nav on WebKit - hydration issues in production builds
      // See webkit-mobile-nav.spec.ts for dedicated WebKit testing
      if (browserName === 'webkit') return

      // On mobile, open the sheet menu then check navigation items
      const bottomNav = await openMobileNav(page)
      if (!bottomNav) return
      const homeLink = bottomNav.getByRole('link', { name: /home/i })
      const blogLink = bottomNav.getByRole('link', { name: /blog/i })
      const workLink = bottomNav.getByRole('link', { name: /our work/i })
      const contactLink = bottomNav.getByRole('link', { name: /contact/i })

      await expect(homeLink).toBeVisible()
      await expect(blogLink).toBeVisible()
      await expect(workLink).toBeVisible()
      await expect(contactLink).toBeVisible()
    } else {
      // Check main header navigation on desktop (About, Blog dropdown, Our Work dropdown)
      const blogButton = page.locator('header nav').getByRole('button', { name: /blog/i })
      const workButton = page.locator('header nav').getByRole('button', { name: /our work/i })
      const aboutLink = page.locator('header nav').getByRole('link', { name: /about/i })

      await expect(blogButton).toBeVisible()
      await expect(workButton).toBeVisible()
      await expect(aboutLink).toBeVisible()
    }
  })

  test('should navigate to blog page', async ({ page, browserName }) => {
    // Skip WebKit entirely - navigation timing issues in production builds
    test.skip(browserName === 'webkit', 'WebKit has navigation timing issues with production builds')

    await page.goto('/')

    // On mobile viewports, use bottom nav; on desktop, use header nav
    const viewport = page.viewportSize()
    const isMobile = viewport && viewport.width < 768

    if (isMobile) {
      // Click on blog link in bottom nav
      // Ensure menu is open (mobile) before clicking blog link
      const bottomNav = await openMobileNav(page)
      if (!bottomNav) return
      await bottomNav.getByRole('link', { name: /blog/i }).click()
      await page.waitForURL('/blog')
    } else {
      // Click on blog dropdown button then "All Posts" in main header nav
      await page.locator('header nav').getByRole('button', { name: /blog/i }).click()
      // Use first() to select the header nav link specifically (avoid conflict with hero/footer links)
      await page.locator('header nav').getByRole('link', { name: /all posts/i }).first().click()
    }

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
    
    // Page should still load and be usable - check site title is visible
    await expect(page.locator('header a[href="/"]')).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator('header a[href="/"]')).toBeVisible()
  })

  test('should display all homepage sections', async ({ page }) => {
    await page.goto('/')

    // 1. Hero section with avatar and actions
    await expect(page.locator('#hero')).toBeVisible()
    await expect(page.locator('#hero [role="img"][aria-label*="Avatar"]').first()).toBeVisible()

    // 2. Activity heatmap
    await expect(page.locator('#activity-heatmap')).toBeVisible()

    // 3. Featured post section
    await expect(page.locator('#featured-post')).toBeVisible()

    // 4. Trending posts
    await expect(page.locator('#trending')).toBeVisible()

    // 5. Activity timeline
    await expect(page.locator('#recent-activity')).toBeVisible()

    // 6. Explore cards
    await expect(page.locator('#explore')).toBeVisible()

    // 7. Stats dashboard
    await expect(page.locator('#stats')).toBeVisible()
  })

  test('should have working hero CTAs', async ({ page }) => {
    await page.goto('/')

    // Verify hero action buttons are visible and clickable
    const heroSection = page.locator('#hero')
    
    // Primary CTA - View our work
    const workButton = heroSection.getByRole('link', { name: /view our work/i })
    await expect(workButton).toBeVisible()

    // Secondary CTA - Read blog
    const blogButton = heroSection.getByRole('link', { name: /read blog/i })
    await expect(blogButton).toBeVisible()

    // Tertiary CTA - Learn more (about)
    const aboutButton = heroSection.getByRole('link', { name: /learn more/i })
    await expect(aboutButton).toBeVisible()
  })

  test('should display responsive spacing on mobile', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Verify key sections are visible and properly spaced on mobile
    await expect(page.locator('#hero')).toBeVisible()
    await expect(page.locator('#activity-heatmap')).toBeVisible()
    await expect(page.locator('#featured-post')).toBeVisible()

    // Check that sections don't overlap (basic layout check)
    const hero = page.locator('#hero')
    const heatmap = page.locator('#activity-heatmap')
    
    const heroBox = await hero.boundingBox()
    const heatmapBox = await heatmap.boundingBox()
    
    // Heatmap should be below hero (y position greater)
    expect(heatmapBox?.y).toBeGreaterThan(heroBox?.y ?? 0)
  })

  test('should have accessible hero section', async ({ page }) => {
    await page.goto('/')

    // Check avatar has proper ARIA label
    const avatar = page.locator('[role="img"][aria-label*="Avatar"]')
    await expect(avatar).toBeVisible()

    // Check site logo/title is accessible
    const logo = page.locator('header a[href="/"]')
    await expect(logo).toBeVisible()

    // Verify hero description is present
    const description = page.locator('#hero').getByText(/exploring cyber architecture/i)
    await expect(description).toBeVisible()
  })
})
