#!/usr/bin/env node

/**
 * Lightweight Sentry enrichment adapter used by weekly-test-health.
 *
 * This module intentionally degrades to no-op behavior when Sentry auth
 * or API access is unavailable, so test-health analysis can still complete.
 */

/**
 * Enrich a list of failures with Sentry context.
 * Currently returns a safe no-op payload to avoid hard failures in CI.
 *
 * @param {Array<{testName: string, errorMessage?: string, errorType?: string}>} failures
 * @returns {Promise<Array<{testName: string, matches: Array<unknown>, note?: string}>>}
 */
export async function batchEnrich(failures = []) {
  return failures.map((failure) => ({
    testName: failure?.testName || 'Unknown test',
    matches: [],
    note: 'Sentry enrichment unavailable in this environment',
  }));
}

/**
 * Format enrichment output for markdown issue body.
 *
 * @param {Array<{testName: string, matches?: Array<unknown>, note?: string}>} enrichments
 * @returns {string}
 */
export function formatEnrichmentSection(enrichments = []) {
  if (!Array.isArray(enrichments) || enrichments.length === 0) {
    return '_No related Sentry events found._';
  }

  const lines = ['_Sentry enrichment currently running in no-op mode for CI stability._'];
  for (const item of enrichments.slice(0, 10)) {
    const count = Array.isArray(item.matches) ? item.matches.length : 0;
    lines.push(`- **${item.testName}**: ${count} related Sentry matches`);
  }

  return lines.join('\n');
}
