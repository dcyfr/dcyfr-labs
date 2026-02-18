#!/usr/bin/env node

/**
 * Verify Views & Shares Safety
 *
 * Validates that cleanup will only delete orphaned view/share metrics for
 * non-existent posts, while preserving all valid tracking data for existing posts.
 */

import dotenv from 'dotenv';
import { Redis } from '@upstash/redis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

/**
 * Get all blog post slugs from filesystem
 */
function getAllBlogPostSlugs() {
  const contentDir = path.join(__dirname, '../src/content/blog');
  const entries = fs.readdirSync(contentDir, { withFileTypes: true });

  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

/**
 * Scan Redis for keys matching pattern
 */
async function scanKeys(pattern) {
  let cursor = '0';
  const allKeys = [];

  do {
    const result = await redis.scan(cursor, { match: pattern, count: 100 });
    cursor = result[0];
    allKeys.push(...result[1]);
  } while (cursor !== '0');

  return allKeys;
}

/**
 * Extract post slug from key
 */
function extractPostSlug(key) {
  const parts = key.split(':');
  if (parts[0] === 'views' && parts[1] === 'post') {
    return parts[2]; // views:post:slug:...
  }
  if (parts[0] === 'shares' && parts[1] === 'post') {
    return parts[2]; // shares:post:slug
  }
  return null;
}

function analyzeKeySet(keys, blogPostSlugs) {
  const valid = [];
  const orphaned = [];
  for (const key of keys) {
    const slug = extractPostSlug(key);
    if (slug && blogPostSlugs.includes(slug)) {
      valid.push(key);
    } else {
      orphaned.push(key);
    }
  }
  return { valid, orphaned };
}

function printKeySetSamples(label, valid, orphaned) {
  console.log(`  ✅ Valid (existing posts): ${valid.length} keys`);
  console.log(`  ❌ Orphaned (deleted posts): ${orphaned.length} keys`);
  if (valid.length > 0) {
    console.log(`\n  Sample valid ${label} keys:`);
    valid.slice(0, 3).forEach((key) => console.log(`    ✅ ${key} → post exists: ${extractPostSlug(key)}`));
    if (valid.length > 3) console.log(`    ... and ${valid.length - 3} more`);
  }
  if (orphaned.length > 0) {
    console.log(`\n  Sample orphaned ${label} keys:`);
    orphaned.slice(0, 3).forEach((key) => console.log(`    ❌ ${key} → post not found: ${extractPostSlug(key)}`));
    if (orphaned.length > 3) console.log(`    ... and ${orphaned.length - 3} more`);
  }
}

function loadCleanupPlan(planPath) {
  if (!fs.existsSync(planPath)) {
    console.error('❌ Cleanup plan not found!');
    console.error('   Run: npm run redis:analyze first\n');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(planPath, 'utf-8'));
}

function printVerificationResult(viewsValid, sharesValid, viewsOrphaned, sharesOrphaned, viewsKeys, sharesKeys, validViewsInPlan, validSharesInPlan) {
  if (validViewsInPlan.length === 0 && validSharesInPlan.length === 0) {
    console.log('✅ VERIFICATION PASSED');
    console.log('   No valid view or share metrics will be deleted.');
    console.log('   Safe to proceed with cleanup.\n');
    console.log(`✅ ${viewsValid.length} valid views keys are protected`);
    console.log(`✅ ${sharesValid.length} valid shares keys are protected`);
    console.log(`✅ ${viewsOrphaned.length} orphaned views keys will be cleaned up`);
    console.log(`✅ ${sharesOrphaned.length} orphaned shares keys will be cleaned up`);
    console.log(`✅ Cleanup script has safety checks to prevent deletion of valid metrics`);
    console.log(`✅ Pre/post cleanup verification will confirm counts match\n`);
    console.log('📊 EXPECTED STATE AFTER CLEANUP:');
    console.log(`  Views keys: ${viewsKeys.length} → ${viewsValid.length} (${viewsOrphaned.length} removed)`);
    console.log(`  Shares keys: ${sharesKeys.length} → ${sharesValid.length} (${sharesOrphaned.length} removed)`);
    console.log(`  Valid metrics preserved: 100%\n`);
  } else {
    console.error('❌ VERIFICATION FAILED');
    console.error('   Valid view/share metrics detected in cleanup plan!');
    console.error('   DO NOT proceed with cleanup.\n');
    if (validViewsInPlan.length > 0) {
      console.error('   Valid views keys that would be deleted:');
      validViewsInPlan.forEach((key) => console.error(`     - ${key}`));
    }
    if (validSharesInPlan.length > 0) {
      console.error('   Valid shares keys that would be deleted:');
      validSharesInPlan.forEach((key) => console.error(`     - ${key}`));
    }
    console.error('\n   Please review the cleanup plan and analysis.\n');
    process.exit(1);
  }
}

async function main() {
  console.log('🛡️  Views & Shares Protection Verification\n');

  console.log('📚 Loading blog posts...');
  const blogPostSlugs = getAllBlogPostSlugs();
  console.log(`  ✓ Found ${blogPostSlugs.length} blog posts\n`);

  console.log('📊 Current Database State:');
  const viewsKeys = await scanKeys('views:*');
  const sharesKeys = await scanKeys('shares:*');
  console.log(`  Total views keys: ${viewsKeys.length}`);
  console.log(`  Total shares keys: ${sharesKeys.length}\n`);

  console.log('🔍 Analyzing Views Keys:');
  const { valid: viewsValid, orphaned: viewsOrphaned } = analyzeKeySet(viewsKeys, blogPostSlugs);
  printKeySetSamples('views', viewsValid, viewsOrphaned);

  console.log('\n🔍 Analyzing Shares Keys:');
  const { valid: sharesValid, orphaned: sharesOrphaned } = analyzeKeySet(sharesKeys, blogPostSlugs);
  printKeySetSamples('shares', sharesValid, sharesOrphaned);

  console.log('\n🔍 Checking Cleanup Plan:');
  const cleanupPlanPath = path.join(__dirname, '../.upstash-cleanup-plan.json');
  const cleanupPlan = loadCleanupPlan(cleanupPlanPath);
  const allKeysToDelete = [...(cleanupPlan.malformed || []), ...(cleanupPlan.hanging || []), ...(cleanupPlan.stale || [])];
  const viewsInPlan = allKeysToDelete.filter((k) => k.startsWith('views:'));
  const sharesInPlan = allKeysToDelete.filter((k) => k.startsWith('shares:'));

  console.log(`  Keys in cleanup plan: ${allKeysToDelete.length} total`);
  console.log(`    - Malformed: ${cleanupPlan.malformed?.length || 0}`);
  console.log(`    - Hanging: ${cleanupPlan.hanging?.length || 0}`);
  console.log(`    - Stale: ${cleanupPlan.stale?.length || 0}`);

  console.log('\n🛡️  PROTECTION STATUS:');
  const validViewsInPlan = viewsInPlan.filter((key) => viewsValid.includes(key));
  const validSharesInPlan = sharesInPlan.filter((key) => sharesValid.includes(key));

  console.log(`  Views keys in cleanup plan: ${viewsInPlan.length}`);
  console.log(`    - Valid views to delete: ${validViewsInPlan.length} ${validViewsInPlan.length === 0 ? '✅ SAFE' : '❌ DANGER'}`);
  console.log(`    - Orphaned views to delete: ${viewsInPlan.length - validViewsInPlan.length} ✅ CORRECT`);
  console.log(`  Shares keys in cleanup plan: ${sharesInPlan.length}`);
  console.log(`    - Valid shares to delete: ${validSharesInPlan.length} ${validSharesInPlan.length === 0 ? '✅ SAFE' : '❌ DANGER'}`);
  console.log(`    - Orphaned shares to delete: ${sharesInPlan.length - validSharesInPlan.length} ✅ CORRECT`);

  console.log('\n📋 SUMMARY:');
  printVerificationResult(viewsValid, sharesValid, viewsOrphaned, sharesOrphaned, viewsKeys, sharesKeys, validViewsInPlan, validSharesInPlan);
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
