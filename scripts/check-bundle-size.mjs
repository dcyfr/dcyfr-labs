#!/usr/bin/env node

/**
 * Bundle Size Monitor
 *
 * Checks Next.js bundle sizes against defined budgets and alerts on violations.
 * Run after build to validate bundle sizes before deployment.
 *
 * Usage:
 *   npm run build && node scripts/check-bundle-size.mjs
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// Load performance budgets
const budgetsPath = join(rootDir, "performance-budgets.json");
if (!existsSync(budgetsPath)) {
  console.error("❌ performance-budgets.json not found");
  process.exit(1);
}

const budgets = JSON.parse(readFileSync(budgetsPath, "utf8"));

// Load Next.js build manifest
const buildManifestPath = join(
  rootDir,
  ".next/build-manifest.json"
);

if (!existsSync(buildManifestPath)) {
  console.error("❌ Build manifest not found. Run 'npm run build' first.");
  process.exit(1);
}

const buildManifest = JSON.parse(readFileSync(buildManifestPath, "utf8"));

/**
 * Get file size in KB
 */
function getFileSizeKB(filePath) {
  const fullPath = join(rootDir, ".next", filePath);
  if (!existsSync(fullPath)) {
    return 0;
  }
  const stats = readFileSync(fullPath);
  return Math.round((stats.length / 1024) * 100) / 100;
}

/**
 * Calculate total bundle size
 */
function calculateBundleSize() {
  let totalSize = 0;
  const bundles = [];

  // Get all page bundles
  for (const [page, files] of Object.entries(buildManifest.pages)) {
    let pageSize = 0;

    for (const file of files) {
      if (file.endsWith(".js")) {
        const size = getFileSizeKB(file);
        pageSize += size;
        totalSize += size;
      }
    }

    bundles.push({
      page,
      size: Math.round(pageSize * 100) / 100,
    });
  }

  return {
    total: Math.round(totalSize * 100) / 100,
    bundles: bundles.sort((a, b) => b.size - a.size),
  };
}

/**
 * Check if size exceeds budget
 */
function checkBudget(size, budget) {
  if (size <= budget.target) {
    return { status: "pass", emoji: "✅", level: "target" };
  } else if (size <= budget.warning) {
    return { status: "warning", emoji: "⚠️", level: "warning" };
  } else if (size <= budget.error) {
    return { status: "error", emoji: "❌", level: "error" };
  } else {
    return { status: "critical", emoji: "🚨", level: "critical" };
  }
}

/**
 * Main monitoring function
 */
function main() {
  console.log("\n📦 Bundle Size Monitor\n");
  console.log("=" .repeat(60));

  const result = calculateBundleSize();
  let hasErrors = false;
  let hasWarnings = false;

  // Check total first load JS
  const firstLoadBudget = budgets.budgets.bundles.firstLoadJS;
  const firstLoadCheck = checkBudget(result.total, firstLoadBudget);

  console.log("\n📊 Total First Load JS");
  console.log(`${firstLoadCheck.emoji} ${result.total} kB / ${firstLoadBudget.target} kB (${firstLoadCheck.level})`);
  console.log(`   Target: ${firstLoadBudget.target} kB | Warning: ${firstLoadBudget.warning} kB | Error: ${firstLoadBudget.error} kB`);

  if (firstLoadCheck.status === "error" || firstLoadCheck.status === "critical") {
    hasErrors = true;
  } else if (firstLoadCheck.status === "warning") {
    hasWarnings = true;
  }

  // Check individual page bundles
  console.log("\n📄 Page Bundles (Top 10)");
  console.log("-".repeat(60));

  const pageBudget = budgets.budgets.bundles.pageBundle;
  const top10 = result.bundles.slice(0, 10);

  for (const bundle of top10) {
    const check = checkBudget(bundle.size, pageBudget);
    console.log(`${check.emoji} ${bundle.page.padEnd(30)} ${bundle.size.toString().padStart(8)} kB`);

    if (check.status === "error" || check.status === "critical") {
      hasErrors = true;
    } else if (check.status === "warning") {
      hasWarnings = true;
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  
  if (hasErrors) {
    console.log("\n❌ Bundle size check FAILED");
    console.log("   Some bundles exceed error thresholds");
    console.log("   Review bundle sizes and optimize large bundles");
    process.exit(1);
  } else if (hasWarnings) {
    console.log("\n⚠️  Bundle size check PASSED with warnings");
    console.log("   Some bundles exceed target thresholds");
    console.log("   Consider optimization to stay within targets");
    process.exit(0);
  } else {
    console.log("\n✅ Bundle size check PASSED");
    console.log("   All bundles within target thresholds");
    process.exit(0);
  }
}

main();
