#!/usr/bin/env node
/**
 * Fast Upstash Data Analysis (Optimized Version)
 *
 * Quickly analyzes all keys in Upstash to identify issues.
 * Uses batch processing and minimal Redis calls for speed.
 */

// Load environment variables
import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, '../.env.local') });

import { redis } from '../src/mcp/shared/redis-client.ts';

// Get blog post slugs
async function getAllBlogPostSlugs() {
  const contentDir = resolve(__dirname, '../src/content/blog');
  try {
    const entries = await readdir(contentDir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

// Parse key and check for issues
function analyzeKey(key, blogPostSlugs) {
  const parts = key.split(':');
  const prefix = parts[0];
  const issues = [];

  // Check for malformed keys
  if (key.includes('undefined') || key.includes('null')) {
    issues.push({ type: 'malformed', reason: 'Contains undefined/null' });
  }

  if (parts.some((part) => part === '')) {
    issues.push({ type: 'malformed', reason: 'Empty part in key' });
  }

  // Check for stale dates (>90 days)
  const dateMatch = key.match(/(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    const date = new Date(dateMatch[1]);
    const daysOld = (new Date() - date) / (1000 * 60 * 60 * 24);
    if (daysOld > 90) {
      issues.push({ type: 'stale', reason: `${Math.floor(daysOld)} days old` });
    }
  }

  // Check for hanging post references
  if (prefix in { views: 1, likes: 1, bookmarks: 1, shares: 1 }) {
    if (parts[1] === 'post') {
      const slug = parts[2];
      if (slug && slug !== 'undefined' && slug !== 'null' && blogPostSlugs.length > 0) {
        if (!blogPostSlugs.includes(slug)) {
          issues.push({ type: 'hanging', reason: `Post not found: ${slug}` });
        }
      }
    }
  }

  return { prefix, issues };
}

async function scanAllKeys() {
  const allKeys = [];
  let scanCursor = '0';
  do {
    const result = await redis.scan(scanCursor, { count: 100 });
    scanCursor = result[0].toString();
    allKeys.push(...result[1]);
  } while (scanCursor !== '0');
  return allKeys;
}

function categorizeKeys(allKeys, blogPostSlugs) {
  const results = { total: allKeys.length, byPrefix: {}, malformed: [], stale: [], hanging: [] };
  for (const key of allKeys) {
    const { prefix, issues } = analyzeKey(key, blogPostSlugs);
    if (!results.byPrefix[prefix]) results.byPrefix[prefix] = { count: 0, issues: 0 };
    results.byPrefix[prefix].count++;
    for (const issue of issues) {
      results.byPrefix[prefix].issues++;
      results[issue.type]?.push({ key, reason: issue.reason });
    }
  }
  return results;
}

function printIssueSection(title, items) {
  if (items.length === 0) return;
  console.log(title);
  console.log('-'.repeat(80));
  for (const item of items.slice(0, 10)) {
    console.log(`❌ ${item.key}`);
    console.log(`   Reason: ${item.reason}\n`);
  }
  if (items.length > 10) console.log(`... and ${items.length - 10} more\n`);
}

function printStaleKeys(stale) {
  if (stale.length === 0) return;
  console.log('⏳ STALE KEYS (LOW PRIORITY - REVIEW)');
  console.log('-'.repeat(80));
  const staleByMonth = {};
  for (const item of stale) {
    const match = item.key.match(/(\d{4}-\d{2})-\d{2}/);
    if (match) {
      const month = match[1];
      if (!staleByMonth[month]) staleByMonth[month] = [];
      staleByMonth[month].push(item.key);
    }
  }
  for (const month of Object.keys(staleByMonth).sort().slice(0, 3)) {
    console.log(`📅 ${month}: ${staleByMonth[month].length} keys`);
    for (const key of staleByMonth[month].slice(0, 3)) console.log(`   ${key}`);
    if (staleByMonth[month].length > 3) console.log(`   ... and ${staleByMonth[month].length - 3} more`);
  }
  console.log('');
}

function printCleanupPlan(results) {
  const immediateCleanup = results.malformed.length + results.hanging.length;
  const reviewCleanup = results.stale.length;
  console.log('🧹 CLEANUP PLAN');
  console.log('-'.repeat(80));
  console.log('IMMEDIATE ACTION (Safe to Delete):');
  console.log(`  1. Malformed keys: ${results.malformed.length} keys`);
  console.log(`     → DELETE all (contain undefined/null/empty parts)`);
  console.log(`  2. Hanging references: ${results.hanging.length} keys`);
  console.log(`     → DELETE all (reference non-existent posts)`);
  console.log(`  Total immediate cleanup: ${immediateCleanup} keys (${((immediateCleanup / results.total) * 100).toFixed(1)}%)\n`);
  if (reviewCleanup > 0) {
    console.log('REVIEW & DECIDE:');
    console.log(`  3. Stale keys: ${reviewCleanup} keys`);
    console.log(`     → REVIEW retention policy before deleting`);
    console.log(`     → Consider archiving vs deleting\n`);
  }
  console.log('💡 RECOMMENDATIONS');
  console.log('-'.repeat(80));
  console.log('✅ Create backup before cleanup');
  console.log('✅ Start with malformed keys (safest)');
  console.log('✅ Then remove hanging references');
  console.log('✅ Review stale keys policy (keep 90 days? 180 days?)');
  console.log('✅ Add input validation to prevent future malformed keys\n');
  return immediateCleanup;
}

async function saveCleanupPlan(results, dirName) {
  const cleanupData = {
    malformed: results.malformed.map((r) => r.key),
    hanging: results.hanging.map((r) => r.key),
    stale: results.stale.map((r) => r.key),
  };
  const fs = await import('fs/promises');
  await fs.writeFile(resolve(dirName, '../.upstash-cleanup-plan.json'), JSON.stringify(cleanupData, null, 2));
}

async function main() {
  console.log('🔍 Fast Upstash Data Analysis\n');

  console.log('📚 Loading blog posts...');
  const blogPostSlugs = await getAllBlogPostSlugs();
  console.log(`  ✓ Found ${blogPostSlugs.length} blog posts\n`);

  console.log('🔍 Scanning keys...');
  const allKeys = await scanAllKeys();
  console.log(`  ✓ Found ${allKeys.length} keys\n`);

  console.log('🔬 Analyzing patterns...');
  const results = categorizeKeys(allKeys, blogPostSlugs);
  console.log(`  ✓ Analysis complete\n`);

  console.log('='.repeat(80));
  console.log('📊 ANALYSIS REPORT');
  console.log('='.repeat(80) + '\n');

  console.log('📈 SUMMARY');
  console.log('-'.repeat(80));
  console.log(`Total Keys: ${results.total}`);
  console.log(`Malformed: ${results.malformed.length} (${((results.malformed.length / results.total) * 100).toFixed(1)}%)`);
  console.log(`Stale (>90 days): ${results.stale.length} (${((results.stale.length / results.total) * 100).toFixed(1)}%)`);
  console.log(`Hanging References: ${results.hanging.length} (${((results.hanging.length / results.total) * 100).toFixed(1)}%)\n`);

  console.log('📋 KEYS BY PREFIX');
  console.log('-'.repeat(80));
  for (const [prefix, data] of Object.entries(results.byPrefix).sort(([, a], [, b]) => b.count - a.count)) {
    const issueStr = data.issues > 0 ? ` (⚠️  ${data.issues} issues)` : '';
    console.log(`${prefix}:* - ${data.count} keys${issueStr}`);
  }
  console.log('');

  printIssueSection('⚠️  MALFORMED KEYS (HIGH PRIORITY - DELETE)', results.malformed);
  printIssueSection('🔗 HANGING REFERENCES (MEDIUM PRIORITY - DELETE)', results.hanging);
  printStaleKeys(results.stale);

  const immediateCleanup = printCleanupPlan(results);
  await saveCleanupPlan(results, __dirname);

  console.log('📝 Cleanup plan saved to: .upstash-cleanup-plan.json');
  console.log('   Keys to cleanup: malformed + hanging = ' + immediateCleanup + ' keys\n');
}

main().catch(console.error);
