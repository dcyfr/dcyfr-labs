import { test, expect } from '@playwright/test';

/**
 * Background Rendering E2E Tests
 *
 * Tests for the fix to background rendering clipping issues on /about and /about/drew/resume pages
 * These tests ensure that backgrounds render fully without being clipped at page boundaries.
 */
test.describe('Background Rendering Fix', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure all background elements have time to render
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('about page backgrounds render without clipping', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'networkidle' });

    // Wait for ScrollReveal animations to complete
    await page.waitForTimeout(2000);

    // Check that the Connect with Us section is visible and properly rendered
    const connectSection = page.locator('section').filter({ hasText: 'Connect with Us' }).first();
    await expect(connectSection).toBeVisible();

    // Verify social links grid is rendered (these have cards with backgrounds)
    const socialLinksGrid = page
      .locator('[data-testid="social-links-grid"], .grid')
      .filter({ hasText: /github|linkedin|twitter/i })
      .first();
    if ((await socialLinksGrid.count()) > 0) {
      await expect(socialLinksGrid).toBeVisible();
    }

    // Check that the page content extends to full height without clipping
    const pageWrapper = page.locator('main').first();
    await expect(pageWrapper).toHaveCSS('overflow', 'visible');
  });

  test('drew resume page backgrounds render without clipping', async ({ page }) => {
    await page.goto('/about/drew/resume', { waitUntil: 'networkidle' });

    // Wait for ScrollReveal animations to complete
    await page.waitForTimeout(2000);

    // Check that timeline section backgrounds are properly rendered
    const timelineSection = page
      .locator('section')
      .filter({ hasText: 'Professional Timeline' })
      .first();
    await expect(timelineSection).toBeVisible();

    // Verify badges section is rendered (these may have background styling)
    const badgesSection = page
      .locator('section')
      .filter({ hasText: /badges|certifications/i })
      .first();
    await expect(badgesSection).toBeVisible();

    // Check that the page content extends to full height without clipping
    const pageWrapper = page.locator('main').first();
    await expect(pageWrapper).toHaveCSS('overflow', 'visible');
  });

  test('page layout wrapper has correct overflow styles', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'networkidle' });

    // Find the PageLayout wrapper div (immediate child of main)
    const pageLayoutWrapper = page.locator('main > div').first();

    // Verify the wrapper has the overflow-visible and min-h-full classes
    await expect(pageLayoutWrapper).toHaveClass(/overflow-visible/);
    await expect(pageLayoutWrapper).toHaveClass(/min-h-full/);
  });

  test('long content pages handle backgrounds correctly', async ({ page }) => {
    await page.goto('/about/drew/resume', { waitUntil: 'networkidle' });

    // Scroll to bottom to ensure full page content is rendered
    await page.keyboard.press('End');
    await page.waitForTimeout(1000);

    // Check that content is still visible at bottom (not clipped)
    const skillsSection = page
      .locator('section')
      .filter({ hasText: /skills|expertise/i })
      .first();
    await expect(skillsSection).toBeVisible();

    // Verify page maintains proper overflow handling
    const main = page.locator('main').first();
    await expect(main).toHaveCSS('overflow', 'visible');
  });
});
