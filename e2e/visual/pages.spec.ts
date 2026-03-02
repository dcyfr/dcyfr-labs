import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for Public Pages
 *
 * Tests capture full-page screenshots across 3 viewport breakpoints:
 * - Desktop: 1280x720
 * - Tablet: 768x1024
 * - Mobile: 375x667
 *
 * Run visual tests:
 *   npm run test:visual              # Compare against baseline
 *   npm run test:visual:baseline     # Generate new baselines
 *   npm run test:visual:update       # Update existing baselines
 */

const TEST_PAGES = [
  { name: 'homepage', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'contact', path: '/contact' },
  { name: 'work', path: '/work' },
  { name: 'sponsors', path: '/sponsors' },
];

// Desktop (1280x720) visual regression tests
for (const page of TEST_PAGES) {
  test(`visual: ${page.name} - desktop`, async ({ page: p }) => {
    await p.setViewportSize({ width: 1280, height: 720 });
    await p.goto(page.path);
    await p.waitForLoadState('networkidle');

    // Close any dev banners that could affect layout
    const devBannerClose = p.locator('button[data-testid="dev-banner-close"]');
    try {
      await devBannerClose.waitFor({ state: 'visible', timeout: 1000 });
      await devBannerClose.click();
      await p.waitForTimeout(300);
    } catch {
      // Dev banner not present, continue
    }

    // Wait for animations to settle
    await p.waitForTimeout(500);

    await expect(p).toHaveScreenshot(`${page.name}-desktop.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
      timeout: 15000,
    });
  });
}

// Tablet (768x1024) visual regression tests
for (const page of TEST_PAGES) {
  test(`visual: ${page.name} - tablet`, async ({ page: p }) => {
    await p.setViewportSize({ width: 768, height: 1024 });
    await p.goto(page.path);
    await p.waitForLoadState('networkidle');

    // Close dev banners
    const devBannerClose = p.locator('button[data-testid="dev-banner-close"]');
    try {
      await devBannerClose.waitFor({ state: 'visible', timeout: 1000 });
      await devBannerClose.click();
      await p.waitForTimeout(300);
    } catch {
      // Continue if not present
    }

    await p.waitForTimeout(500);

    await expect(p).toHaveScreenshot(`${page.name}-tablet.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.015, // Slightly higher tolerance for tablet layout shifts
      timeout: 15000,
    });
  });
}

// Mobile (375x667) visual regression tests
for (const page of TEST_PAGES) {
  test(`visual: ${page.name} - mobile`, async ({ page: p }) => {
    await p.setViewportSize({ width: 375, height: 667 });
    await p.goto(page.path);
    await p.waitForLoadState('networkidle');

    // Close dev banners
    const devBannerClose = p.locator('button[data-testid="dev-banner-close"]');
    try {
      await devBannerClose.waitFor({ state: 'visible', timeout: 1000 });
      await devBannerClose.click();
      await p.waitForTimeout(300);
    } catch {
      // Continue if not present
    }

    await p.waitForTimeout(500);

    await expect(p).toHaveScreenshot(`${page.name}-mobile.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.02, // Higher tolerance for mobile responsive adjustments
      timeout: 15000,
    });
  });
}
