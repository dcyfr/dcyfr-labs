#!/usr/bin/env node

/**
 * Sitemap Validation Script
 *
 * Validates that sitemap.xml includes all expected public pages.
 * Run this in CI/CD to catch missing pages automatically.
 *
 * Usage:
 *   node scripts/validate-sitemap.mjs
 *   npm run sitemap:validate
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

/**
 * Check if a directory should be excluded from sitemap scanning
 */
function isExcludedDir(name) {
  return (
    name.startsWith('.') ||
    name.startsWith('(') ||
    name === 'api' ||
    name === 'dev' ||
    name === 'private' ||
    name === '__tests__'
  );
}

/**
 * Build a route path from current route and directory item
 */
function buildRoute(route, item) {
  return route ? `${route}/${item}` : `/${item}`;
}

/**
 * Try to detect a page.tsx inside a directory and register it
 */
function tryRegisterPage(fullPath, item, route, pages) {
  const pagePath = join(fullPath, 'page.tsx');
  try {
    statSync(pagePath);
    pages.push({
      path: buildRoute(route, item),
      file: pagePath.replace(rootDir + '/', ''),
      hasDynamicSegment: item.startsWith('['),
    });
  } catch {
    // No page.tsx
  }
}

/**
 * Recursively scan app directory for page.tsx files
 */
function scanAppDir(dir, route, pages) {
  try {
    const items = readdirSync(dir);

    for (const item of items) {
      const fullPath = join(dir, item);
      if (!statSync(fullPath).isDirectory()) continue;
      if (isExcludedDir(item)) continue;

      tryRegisterPage(fullPath, item, route, pages);
      scanAppDir(fullPath, buildRoute(route, item), pages);
    }
  } catch {
    // Ignore errors
  }
}

/**
 * Find all page.tsx files in src/app
 * Excludes: dev/, private/, (route-groups), __tests__
 */
function findAllPageFiles() {
  const appDir = join(rootDir, 'src/app');
  const pages = [];

  // Add home page
  pages.push({
    path: '/',
    file: 'src/app/page.tsx',
    hasDynamicSegment: false,
  });

  scanAppDir(appDir, '', pages);
  return pages;
}

/**
 * Extract URLs from sitemap.xml
 */
function extractSitemapUrls() {
  // For development, read from built sitemap
  try {
    // Try to read from .next build output
    const buildSitemapPath = join(rootDir, '.next/server/app/sitemap.xml.body');
    const content = readFileSync(buildSitemapPath, 'utf-8');
    const urls = [];
    const locMatches = content.matchAll(/<loc>([^<]+)<\/loc>/g);
    for (const match of locMatches) {
      const url = new URL(match[1]);
      urls.push(url.pathname);
    }
    return urls;
  } catch {
    log(colors.yellow, '⚠️  Could not read built sitemap. Run `npm run build` first.');
    return [];
  }
}

/**
 * Check if a page should be in sitemap
 */
function shouldBeInSitemap(page) {
  // Dynamic routes need to be generated from data sources
  // They won't be in sitemap as bare patterns like /blog/[slug]
  if (page.hasDynamicSegment) {
    return false;
  }

  // All static pages should be in sitemap
  return true;
}

/**
 * Main validation
 */
function validateSitemap() {
  log(colors.cyan, '\n🔍 Sitemap Validation\n');

  const pages = findAllPageFiles();
  const sitemapUrls = extractSitemapUrls();

  if (sitemapUrls.length === 0) {
    log(colors.red, '❌ No sitemap URLs found. Build the project first.');
    process.exit(1);
  }

  log(colors.blue, `Found ${pages.length} page files`);
  log(colors.blue, `Found ${sitemapUrls.length} URLs in sitemap\n`);

  // Check for missing pages
  const staticPages = pages.filter(shouldBeInSitemap);
  const missing = [];

  for (const page of staticPages) {
    if (!sitemapUrls.includes(page.path)) {
      missing.push(page);
    }
  }

  // Check for extra URLs (should be data-driven)
  const expectedStatic = new Set(staticPages.map((p) => p.path));
  const dataUrls = sitemapUrls.filter((url) => !expectedStatic.has(url));

  // Report results
  if (missing.length > 0) {
    log(colors.red, `\n❌ Missing ${missing.length} page(s) from sitemap:\n`);
    for (const page of missing) {
      console.log(`  - ${page.path}`);
      console.log(`    File: ${colors.yellow}${page.file}${colors.reset}`);
    }
  } else {
    log(colors.green, '\n✅ All static pages included in sitemap');
  }

  log(colors.cyan, `\n📊 Data-driven URLs: ${dataUrls.length}`);
  log(colors.cyan, '   (Blog posts, work projects, series, team profiles)\n');

  // Summary
  const total = sitemapUrls.length;
  const staticCount = staticPages.length;
  const dynamicCount = dataUrls.length;

  console.log('Summary:');
  console.log(`  Static pages:        ${staticCount}`);
  console.log(`  Data-driven URLs:    ${dynamicCount}`);
  console.log(`  Total in sitemap:    ${total}`);

  if (missing.length > 0) {
    log(colors.red, '\n❌ Sitemap validation failed\n');
    process.exit(1);
  } else {
    log(colors.green, '\n✅ Sitemap validation passed\n');
  }
}

// Run validation
validateSitemap();
