#!/usr/bin/env node
/**
 * Retroactive IndexNow bulk reindex script.
 *
 * Submits all blog posts, projects, and static pages to IndexNow via the
 * admin bulk endpoint. Useful when deploying for the first time, after a
 * domain migration, or to recover from a period of missed submissions.
 *
 * Usage:
 *   ADMIN_API_KEY=<token> node scripts/reindex-all.mjs [--types posts,projects,static]
 *
 * Environment variables:
 *   ADMIN_API_KEY      — required: bearer token (matches ADMIN_API_KEY on server)
 *   SITE_URL           — optional: override site base URL (default: https://www.dcyfr.ai)
 *
 * Flags:
 *   --types <csv>      — comma-separated content types to reindex (default: posts,projects,static)
 *   --dry-run          — print the request without sending it
 *   --help / -h        — print usage
 */

const DEFAULT_SITE_URL = 'https://www.dcyfr.ai';
const DEFAULT_TYPES = ['posts', 'projects', 'static'];

// ---------------------------------------------------------------------------
// Parse CLI arguments
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: ADMIN_API_KEY=<token> node scripts/reindex-all.mjs [options]

Options:
  --types <csv>   Comma-separated content types: posts, projects, static
                  Default: ${DEFAULT_TYPES.join(',')}
  --dry-run       Print request payload without sending
  --help, -h      Show this help

Environment variables:
  ADMIN_API_KEY   Required. Bearer token that matches ADMIN_API_KEY on the server.
  SITE_URL        Optional. Override the target site URL.
                  Default: ${DEFAULT_SITE_URL}

Examples:
  # Reindex everything
  ADMIN_API_KEY=my-token node scripts/reindex-all.mjs

  # Reindex only blog posts
  ADMIN_API_KEY=my-token node scripts/reindex-all.mjs --types posts

  # Dry-run to verify the request before sending
  ADMIN_API_KEY=my-token node scripts/reindex-all.mjs --dry-run
`);
  process.exit(0);
}

const isDryRun = args.includes('--dry-run');

const typesArgIndex = args.indexOf('--types');
const typesArg =
  typesArgIndex !== -1 && args[typesArgIndex + 1]
    ? args[typesArgIndex + 1].split(',').map((t) => t.trim())
    : DEFAULT_TYPES;

const VALID_TYPES = new Set(['posts', 'projects', 'static']);
const invalidTypes = typesArg.filter((t) => !VALID_TYPES.has(t));
if (invalidTypes.length > 0) {
  console.error(`Error: invalid content types: ${invalidTypes.join(', ')}`);
  console.error(`Valid values: ${[...VALID_TYPES].join(', ')}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Validate environment
// ---------------------------------------------------------------------------

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
if (!ADMIN_API_KEY && !isDryRun) {
  console.error('Error: ADMIN_API_KEY environment variable is not set.');
  console.error('Set it before running:');
  console.error('  ADMIN_API_KEY=<token> node scripts/reindex-all.mjs');
  process.exit(1);
}

const SITE_URL = (process.env.SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, '');
const endpoint = `${SITE_URL}/api/admin/indexnow/bulk`;

// ---------------------------------------------------------------------------
// Build and send request
// ---------------------------------------------------------------------------

const payload = { types: typesArg };

console.log(`IndexNow bulk reindex`);
console.log(`  Endpoint : ${endpoint}`);
console.log(`  Types    : ${typesArg.join(', ')}`);
console.log(`  Dry-run  : ${isDryRun}`);
console.log('');

if (isDryRun) {
  console.log('Dry-run payload:');
  console.log(JSON.stringify(payload, null, 2));
  console.log('');
  console.log('No request sent. Remove --dry-run to execute.');
  process.exit(0);
}

console.log('Sending request...');

let response;
try {
  response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ADMIN_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
} catch (err) {
  console.error(`Network error: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}

let body;
try {
  body = await response.json();
} catch {
  body = await response.text();
}

if (response.ok) {
  console.log(`✅ Success (HTTP ${response.status})`);
  console.log(`   URLs queued : ${body.queued ?? 'unknown'}`);
  console.log(`   Types       : ${(body.types ?? typesArg).join(', ')}`);
  console.log('');
  console.log('URLs have been queued in Inngest and will be submitted to IndexNow shortly.');
  console.log('Monitor progress at: https://app.inngest.com or /api/inngest in dev.');
} else {
  console.error(`❌ Failed (HTTP ${response.status})`);
  console.error(typeof body === 'object' ? JSON.stringify(body, null, 2) : body);
  process.exit(1);
}
