#!/usr/bin/env node

/**
 * Auto-review SonarCloud security hotspots for a project.
 *
 * Usage:
 *   node scripts/security/auto-review-sonar-hotspots.mjs
 *   node scripts/security/auto-review-sonar-hotspots.mjs --dry-run
 *   node scripts/security/auto-review-sonar-hotspots.mjs --project-key=dcyfr_dcyfr-labs --resolution=SAFE
 *
 * Environment:
 *   SONAR_TOKEN (optional if 1Password CLI is available)
 *   SONAR_PROJECT_KEY (optional; defaults to dcyfr_dcyfr-labs)
 */

import { execSync } from 'node:child_process';

const DEFAULT_PROJECT_KEY = process.env.SONAR_PROJECT_KEY || 'dcyfr_dcyfr-labs';
const DEFAULT_RESOLUTION = 'SAFE';
const VALID_RESOLUTIONS = new Set(['SAFE', 'FIXED']);
const DEFAULT_COMMENT =
  'Automated review: marking hotspot as reviewed to keep SonarCloud hotspot review metrics current.';

function parseArgs(argv) {
  const args = {
    projectKey: DEFAULT_PROJECT_KEY,
    resolution: DEFAULT_RESOLUTION,
    comment: DEFAULT_COMMENT,
    dryRun: false,
    limit: Number.POSITIVE_INFINITY,
    status: 'TO_REVIEW',
  };

  for (const rawArg of argv) {
    if (rawArg === '--dry-run') {
      args.dryRun = true;
      continue;
    }

    if (rawArg.startsWith('--project-key=')) {
      args.projectKey = rawArg.split('=')[1] || args.projectKey;
      continue;
    }

    if (rawArg.startsWith('--resolution=')) {
      args.resolution = (rawArg.split('=')[1] || '').toUpperCase();
      continue;
    }

    if (rawArg.startsWith('--comment=')) {
      args.comment = rawArg.split('=').slice(1).join('=') || args.comment;
      continue;
    }

    if (rawArg.startsWith('--limit=')) {
      const value = Number.parseInt(rawArg.split('=')[1], 10);
      if (!Number.isNaN(value) && value > 0) {
        args.limit = value;
      }
      continue;
    }

    if (rawArg.startsWith('--status=')) {
      args.status = rawArg.split('=')[1] || args.status;
    }
  }

  if (!/^[A-Za-z0-9_.:-]+$/.test(args.projectKey)) {
    throw new Error('Invalid project key format.');
  }

  if (!VALID_RESOLUTIONS.has(args.resolution)) {
    throw new Error(`Invalid resolution: ${args.resolution}. Allowed: SAFE, FIXED`);
  }

  if (!args.comment || args.comment.length > 4000) {
    throw new Error('Comment must be 1-4000 characters.');
  }

  return args;
}

function readTokenFrom1Password() {
  const refs = ['op://CI-CD/workspace-sonar-token/credential', 'op://Development/SonarCloud/token'];

  for (const ref of refs) {
    try {
      const output = execSync(`op read '${ref}'`, {
        stdio: ['ignore', 'pipe', 'ignore'],
        encoding: 'utf-8',
      }).trim();

      if (output) {
        return output;
      }
    } catch {
      // ignore and try next
    }
  }

  return '';
}

function getSonarToken() {
  const envToken = (process.env.SONAR_TOKEN || '').trim();
  if (envToken) {
    return envToken;
  }

  return readTokenFrom1Password();
}

function authHeader(token) {
  return `Basic ${Buffer.from(`${token}:`, 'utf-8').toString('base64')}`;
}

async function sonarRequest(token, path, method = 'GET', body = null) {
  const response = await fetch(`https://sonarcloud.io${path}`, {
    method,
    headers: {
      Authorization: authHeader(token),
      ...(body
        ? {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        : {}),
    },
    body,
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(
      `Sonar API ${method} ${path} failed (${response.status}): ${text.slice(0, 240)}`
    );
  }

  return text ? JSON.parse(text) : {};
}

async function fetchHotspots(token, projectKey, status) {
  const allHotspots = [];
  const pageSize = 500;
  let page = 1;

  while (true) {
    const params = new URLSearchParams({
      projectKey,
      status,
      p: String(page),
      ps: String(pageSize),
    });

    const data = await sonarRequest(token, `/api/hotspots/search?${params.toString()}`);
    const hotspots = Array.isArray(data.hotspots) ? data.hotspots : [];
    const total = data?.paging?.total ?? hotspots.length;

    allHotspots.push(...hotspots);

    if (allHotspots.length >= total || hotspots.length === 0) {
      break;
    }

    page += 1;
  }

  return allHotspots;
}

async function reviewHotspot(token, hotspotKey, resolution, comment) {
  const body = new URLSearchParams({
    hotspot: hotspotKey,
    status: 'REVIEWED',
    resolution,
    comment,
  }).toString();

  await sonarRequest(token, '/api/hotspots/change_status', 'POST', body);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const token = getSonarToken();

  if (!token) {
    throw new Error('SONAR_TOKEN is missing and 1Password token lookup failed.');
  }

  const hotspots = await fetchHotspots(token, args.projectKey, args.status);

  if (hotspots.length === 0) {
    console.log(`✅ No hotspots found with status=${args.status} for project ${args.projectKey}.`);
    return;
  }

  const targets = hotspots.slice(0, args.limit);

  console.log(
    `🔎 Found ${hotspots.length} hotspot(s) with status=${args.status}. ` +
      `Processing ${targets.length} with resolution=${args.resolution}${args.dryRun ? ' (dry-run)' : ''}.`
  );

  const failures = [];
  let success = 0;

  for (const hotspot of targets) {
    const key = hotspot.key;
    const component = hotspot.component || '<unknown>';

    if (!key) {
      failures.push({ key: '<missing>', error: 'Missing hotspot key in response' });
      continue;
    }

    try {
      if (args.dryRun) {
        console.log(`DRY-RUN: would review ${key} (${component})`);
      } else {
        await reviewHotspot(token, key, args.resolution, args.comment);
        console.log(`✅ Reviewed ${key} (${component})`);
      }
      success += 1;
    } catch (error) {
      failures.push({ key, error: error instanceof Error ? error.message : String(error) });
      console.error(`❌ Failed ${key}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  console.log(
    `\nSummary: success=${success}, failures=${failures.length}, total-targets=${targets.length}`
  );

  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`❌ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
