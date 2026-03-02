<!-- TLP:CLEAR -->

# Visual Regression Testing Guide

## Overview

This project uses **Playwright** for automated visual regression testing across multiple viewport sizes:

- **Desktop**: 1280×720px
- **Tablet**: 768×1024px
- **Mobile**: 375×667px

All visual tests reside in `e2e/visual/` alongside functional E2E tests.

## Test Files

- **`e2e/visual/pages.spec.ts`** — Full-page screenshot comparisons for public pages (homepage, about, contact, work, sponsors)
- **`e2e/visual/components.spec.ts`** — Component-level visual tests (navigation, footer, hero section)
- **`e2e/visual-regression.spec.ts`** — Legacy visual regression tests (maintained for backward compatibility)

## Running Visual Tests

### Compare Against Baseline

Runs visual tests and fails if any screenshot differs more than the configured tolerance:

```bash
npm run test:visual
```

### Generate New Baselines

Creates/updates baseline screenshots. **Use after intentional design changes:**

```bash
npm run test:visual:baseline
# OR
npm run test:visual:update
```

### Generate Baselines for Specific Test

```bash
npx playwright test e2e/visual/pages.spec.ts --update-snapshots
```

### Run with UI Inspector

Opens the Playwright UI for interactive test debugging:

```bash
npx playwright test e2e/visual --ui
```

### View Test Report

After a test run, open the HTML report:

```bash
npx playwright show-report
```

## Baseline Storage

Baseline screenshots are stored in:

```bash
e2e/visual/__snapshots__/
```

All PNG files are tracked via **Git LFS** (configured in `.gitattributes`) to avoid binary bloat.

## Tolerance Levels

Screenshot comparison uses `maxDiffPixelRatio` to allow minor rendering variations:

| Viewport | Tolerance    | Purpose                                    |
| -------- | ------------ | ------------------------------------------ |
| Desktop  | 0.01 (1%)    | Strict — desktop is primary design surface |
| Tablet   | 0.015 (1.5%) | Responsive adjustment tolerance            |
| Mobile   | 0.02 (2%)    | Higher tolerance for layout shifts         |

Adjust tolerance in test code if flakiness occurs (e.g., animation timing variations).

## CI Integration

Playwright runs in CI on every PR:

```bash
npm run test:ci
# Runs: vitest coverage + playwright test (all E2E + visual)
```

Failed visual tests will show a diff report in CI and block PR merge.

## Workflow

### Step 1: Make Design Changes

Update CSS, components, or styling as needed.

### Step 2: Run Visual Tests

```bash
npm run test:visual
```

Tests fail if visual changes exceed tolerance.

### Step 3: Review Diffs

Use the HTML report to review visual changes:

```bash
npx playwright show-report
```

### Step 4: Update Baselines

Once changes are reviewed and approved:

```bash
npm run test:visual:baseline
```

### Step 5: Commit

```bash
git add e2e/visual/__snapshots__/
git commit -m "design: update visual baselines after [component] redesign"
```

## Troubleshooting

### Tests Fail with "Screenshots do not match"

1. **Check if this is an intentional design change:**
   - If yes: update baselines with `npm run test:visual:baseline`
   - If no: revert the offending change

2. **Check for timing issues:**
   - Visual tests include `page.waitForTimeout(500)` to let animations settle
   - For components with longer animations, increase timeout in test

3. **Check for transient content:**
   - Disable dev banners, cookie notices, or other transient UI
   - Current tests close dev banners automatically

### Git LFS Issues

If `git lfs` is not installed:

```bash
# macOS
brew install git-lfs

# After installation, enable globally:
git lfs install
```

## Next Steps

- [ ] Add component storybook tests (Phase 2)
- [ ] Integrate axe-core accessibility testing (Phase 2)
- [ ] Add Lighthouse CI performance monitoring (Phase 3)
- [ ] Implement design debt tracking automation (Phase 4)

## References

- [Playwright Test Documentation](https://playwright.dev/docs/intro)
- [Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Git LFS Documentation](https://git-lfs.github.com/)
