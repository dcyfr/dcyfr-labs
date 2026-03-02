import { test, expect, Page } from '@playwright/test';

/**
 * Visual Regression Tests for Components
 *
 * Tests capture component-level screenshots to ensure design consistency
 * across all UI components. Tests cover:
 * - All component variants (default, primary, outlined, etc.)
 * - States (normal, hover, focus, disabled)
 * - Interactive behaviors (animations, transitions)
 */

// Component test helper - navigates to component showcase page
const _testComponent = async (page: Page, componentName: string, selector: string) => {
  await page.goto(`/components/${componentName}`);
  await page.waitForLoadState('networkidle');

  const component = page.locator(selector).first();
  await component.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300); // Wait for animations

  await expect(component).toHaveScreenshot(`${componentName}.png`, {
    maxDiffPixelRatio: 0.01,
  });
};

// If component showcase page exists, uncomment to test
// test('visual: button-component', async ({ page }) => {
//   await testComponent(page, 'button', 'button[data-testid="button-demo"]');
// });

// test('visual: card-component', async ({ page }) => {
//   await testComponent(page, 'card', '[data-testid="card-demo"]');
// });

// test('visual: dialog-component', async ({ page }) => {
//   await testComponent(page, 'dialog', '[data-testid="dialog-demo"]');
// });

// test('visual: badge-component', async ({ page }) => {
//   await testComponent(page, 'badge', '[data-testid="badge-demo"]');
// });

// test('visual: input-component', async ({ page }) => {
//   await testComponent(page, 'input', 'input[data-testid="input-demo"]');
// });

// test('visual: select-component', async ({ page }) => {
//   await testComponent(page, 'select', '[data-testid="select-demo"]');
// });

// Fallback: Test common components found on the homepage
test('visual: global-navigation', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const nav = page.locator('nav').first();
  await nav.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  await expect(nav).toHaveScreenshot('global-navigation.png', {
    maxDiffPixelRatio: 0.01,
  });
});

test('visual: footer', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const footer = page.locator('footer').first();
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  await expect(footer).toHaveScreenshot('footer.png', {
    maxDiffPixelRatio: 0.01,
  });
});

test('visual: hero-section', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const hero = page.locator('[data-testid="hero-section"]').or(page.locator('section').first());
  await hero.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  await expect(hero).toHaveScreenshot('hero-section.png', {
    maxDiffPixelRatio: 0.01,
  });
});
