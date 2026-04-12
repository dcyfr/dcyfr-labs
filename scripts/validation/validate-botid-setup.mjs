#!/usr/bin/env node

/**
 * BotID Setup Validation Script
 *
 * Validates that BotID is properly configured across the application:
 * 1. BotID is imported in contact API route
 * 2. Client-side initialization is present
 * 3. Config wrapping is in place
 *
 * Usage: node scripts/validate-botid-setup.mjs
 */

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const requireFromRoot = createRequire(path.join(rootDir, 'package.json'));

const checks = [];

// Check 1: BotID import in contact API
const contactRoutePath = path.join(rootDir, 'src/app/api/contact/route.ts');
const contactRouteContent = fs.readFileSync(contactRoutePath, 'utf-8');

const hasBotIDImport = contactRouteContent.includes('import { checkBotId } from "botid/server"');
checks.push({
  name: 'BotID import in contact API',
  passed: hasBotIDImport,
  file: 'src/app/api/contact/route.ts',
  details: hasBotIDImport
    ? 'checkBotId is properly imported from botid/server'
    : 'checkBotId import is missing or incorrectly commented out',
});

// Check for BotID logic - can be either enabled via ENABLE_BOTID flag or with shouldUseBotId variable
const hasBotIDLogic =
  contactRouteContent.includes("if (process.env.ENABLE_BOTID === '1')") ||
  contactRouteContent.includes('shouldUseBotId');
checks.push({
  name: 'BotID check logic in contact API',
  passed: hasBotIDLogic,
  file: 'src/app/api/contact/route.ts',
  details: hasBotIDLogic
    ? 'BotID check is present (may be disabled via shouldUseBotId flag)'
    : 'BotID check logic is missing',
});

// Check 2: Client-side initialization
const instrumentationPath = path.join(rootDir, 'src/instrumentation-client.ts');
const instrumentationContent = fs.readFileSync(instrumentationPath, 'utf-8');

const hasInitBotId = instrumentationContent.includes('initBotId');
checks.push({
  name: 'Client-side BotID initialization',
  passed: hasInitBotId,
  file: 'src/instrumentation-client.ts',
  details: hasInitBotId
    ? 'initBotId is called to protect /api/contact'
    : 'initBotId initialization is missing',
});

const hasContactProtection = instrumentationContent.includes('"/api/contact"');
checks.push({
  name: 'Contact endpoint in protected routes',
  passed: hasContactProtection,
  file: 'src/instrumentation-client.ts',
  details: hasContactProtection
    ? '/api/contact is configured for BotID protection'
    : '/api/contact is not in the protected routes list',
});

// Check 3: Next.js config wrapping
const nextConfigPath = path.join(rootDir, 'next.config.ts');
const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf-8');

const hasWithBotId = nextConfigContent.includes('withBotId');
checks.push({
  name: 'Next.js config wrapped with withBotId',
  passed: hasWithBotId,
  file: 'next.config.ts',
  details: hasWithBotId
    ? 'next.config.ts is properly wrapped with withBotId'
    : 'withBotId wrapper is missing from next.config.ts',
});

// Check 3b: the withBotId import subpath actually resolves against botid's
// exports map. This prevents a repeat of PR #398 → prod break (2026-04-11),
// where `from 'botid/next'` passed the substring match above but blew up at
// next.config.ts load time because botid's exports map only publishes
// './next/config', not './next'. Substring matching the identifier isn't
// enough — the subpath has to be resolvable.
const importMatch = nextConfigContent.match(
  /import\s*\{[^}]*withBotId[^}]*\}\s*from\s*['"]([^'"]+)['"]/
);
const importedSubpath = importMatch?.[1] ?? null;
let subpathResolves = false;
let subpathResolveError = null;
if (importedSubpath) {
  try {
    requireFromRoot.resolve(importedSubpath);
    subpathResolves = true;
  } catch (err) {
    subpathResolveError = err.message;
  }
}
checks.push({
  name: 'withBotId import subpath resolves against botid exports map',
  passed: subpathResolves,
  file: 'next.config.ts',
  details: !importedSubpath
    ? 'Could not find the withBotId import line in next.config.ts'
    : subpathResolves
      ? `${importedSubpath} resolves against node_modules/botid/package.json exports`
      : `${importedSubpath} does not resolve: ${subpathResolveError}. ` +
        `Check node_modules/botid/package.json 'exports' for a valid subpath (likely './next/config').`,
});

// Check 4: BotID dependency
const packageJsonPath = path.join(rootDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const hasBotIDDep = packageJson.dependencies?.botid || packageJson.devDependencies?.botid;
checks.push({
  name: 'BotID dependency installed',
  passed: !!hasBotIDDep,
  file: 'package.json',
  details: hasBotIDDep
    ? `BotID v${hasBotIDDep} is installed`
    : 'BotID dependency is missing from package.json',
});

// Check 5: BotID tests exist
const testPath = path.join(rootDir, 'src/__tests__/api/contact-botid.test.ts');
const testExists = fs.existsSync(testPath);
checks.push({
  name: 'BotID integration tests',
  passed: testExists,
  file: 'src/__tests__/api/contact-botid.test.ts',
  details: testExists
    ? 'BotID tests are present and can validate enabled/disabled states'
    : 'BotID test file is missing',
});

// Print results
console.log('\n🔒 BotID Setup Validation Report\n');
console.log('═'.repeat(70));

let allPassed = true;
checks.forEach((check, index) => {
  const status = check.passed ? '✅' : '❌';
  console.log(`\n${index + 1}. ${status} ${check.name}`);
  console.log(`   File: ${check.file}`);
  console.log(`   ${check.details}`);

  if (!check.passed) {
    allPassed = false;
  }
});

console.log('\n' + '═'.repeat(70));

const summary = checks.filter((c) => c.passed).length;
console.log(`\n📊 Results: ${summary}/${checks.length} checks passed\n`);

if (allPassed) {
  console.log('✅ BotID is properly configured and ready to be enabled!\n');
  console.log('To enable BotID in production, set: ENABLE_BOTID=1\n');
  process.exit(0);
} else {
  console.log('❌ BotID configuration issues detected. Please fix before re-enabling.\n');
  process.exit(1);
}
