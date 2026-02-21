#!/usr/bin/env node
/**
 * Voice Compliance Validation Script
 *
 * Scans all .claude/agents/*.agent.md files for brand voice consistency.
 * Checks:
 * - Presence of "## Voice & Identity" section
 * - Absence of anti-pattern language from brand_voice.anti_patterns
 * - Reports per-agent pass/warn/fail and overall compliance %
 *
 * Usage:
 *   node scripts/validate-voice-compliance.mjs
 *   node scripts/validate-voice-compliance.mjs --threshold 90
 *   node scripts/validate-voice-compliance.mjs --mode warn
 *
 * Exit codes:
 *   0 - All checks passed (or warnings only in warn mode)
 *   1 - Compliance below threshold (in error mode)
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Script lives in dcyfr-labs/scripts/ — workspace root is two levels up
const WORKSPACE_ROOT = join(__dirname, '..', '..');
const AGENTS_DIR = join(WORKSPACE_ROOT, '.claude', 'agents');
const CONTEXT_FILE = join(WORKSPACE_ROOT, '.github', 'context', 'DCYFR_CONTEXT.json');

// Parse CLI arguments
const args = process.argv.slice(2);
const thresholdArg = args.indexOf('--threshold');
const modeArg = args.indexOf('--mode');
const THRESHOLD = thresholdArg !== -1 ? parseInt(args[thresholdArg + 1], 10) : 90;
const GATE_MODE = modeArg !== -1 ? args[modeArg + 1] : 'error'; // 'warn' or 'error'

/**
 * Load brand_voice anti-patterns from DCYFR_CONTEXT.json
 * @returns {string[]}
 */
function loadAntiPatterns() {
  try {
    const context = JSON.parse(readFileSync(CONTEXT_FILE, 'utf8'));
    return context?.brand_voice?.anti_patterns ?? [];
  } catch {
    console.warn('⚠️  Could not load DCYFR_CONTEXT.json — anti-pattern checks disabled');
    return [];
  }
}

/**
 * Rules that check for violating content in agent bodies.
 * Each rule has a pattern (regex) and severity.
 */
const ANTI_PATTERN_VIOLATIONS = [
  // Never use condescending language
  {
    pattern: /\b(obviously|clearly|just|simply|easily)\b/gi,
    message:
      'Potentially condescending language detected — avoid "obviously", "just", "simply", "clearly", "easily"',
    severity: 'warn',
  },
  // Never gatekeep
  {
    pattern: /\b(you should know|as everyone knows|obviously|goes without saying)\b/gi,
    message: 'Potential gatekeeping language detected',
    severity: 'warn',
  },
  // Check for sarcasm indicators
  {
    pattern: /\b(lol|smh|facepalm|seriously though)\b/gi,
    message: 'Potentially sarcastic language detected — maintain professional empathy',
    severity: 'warn',
  },
];

/**
 * @typedef {{ file: string, hasVoiceSection: boolean, violations: Array<{line: number, message: string, severity: string}>, status: 'pass' | 'warn' | 'fail' }} AgentResult
 */

/**
 * Analyze a single agent file
 * @param {string} filepath
 * @param {string} filename
 * @returns {AgentResult}
 */
function analyzeAgent(filepath, filename) {
  const content = readFileSync(filepath, 'utf8');

  const hasVoiceSection =
    /^## Voice & Identity/m.test(content) || /^## Voice and Identity/m.test(content);

  const violations = [];

  // Only check instruction body (after frontmatter)
  const bodyStart = content.indexOf('\n---\n', content.indexOf('---\n') + 4) + 4;
  const body = bodyStart > 4 ? content.slice(bodyStart) : content;
  const bodyLines = body.split('\n');

  for (const rule of ANTI_PATTERN_VIOLATIONS) {
    bodyLines.forEach((line, idx) => {
      if (rule.pattern.test(line)) {
        violations.push({
          line: idx + 1,
          message: rule.message,
          severity: rule.severity,
          match: line.trim().slice(0, 80),
        });
      }
    });
  }

  const hasErrors = violations.some((v) => v.severity === 'error');
  const hasWarnings = violations.some((v) => v.severity === 'warn');
  const status = !hasVoiceSection ? 'fail' : hasErrors ? 'fail' : hasWarnings ? 'warn' : 'pass';

  return {
    file: filename,
    hasVoiceSection,
    violations,
    status,
  };
}

/**
 * Discover .agent.md files or exit on failure
 */
function discoverAgentFiles() {
  try {
    const files = readdirSync(AGENTS_DIR)
      .filter((f) => f.endsWith('.agent.md'))
      .sort();
    return files;
  } catch {
    console.error(`❌ Could not read agents directory: ${AGENTS_DIR}`);
    process.exit(1);
  }
}

/**
 * Print individual agent results
 */
function printAgentResults(results) {
  for (const result of results) {
    const icon = result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️ ' : '❌';
    const voiceIcon = result.hasVoiceSection ? '🗣️' : '  ';
    console.log(`${icon} ${voiceIcon} ${result.file}`);

    if (!result.hasVoiceSection) {
      console.log(`     ↳ Missing "## Voice & Identity" section`);
    }

    for (const v of result.violations) {
      const sevIcon = v.severity === 'error' ? '🔴' : '🟡';
      console.log(`     ${sevIcon} Line ${v.line}: ${v.message}`);
      if (v.match) console.log(`        "${v.match}"`);
    }
  }
}

/**
 * List agents missing voice sections via the given log function
 */
function listMissingVoiceSections(results, logFn) {
  logFn('   Agents missing voice sections:');
  results
    .filter((r) => !r.hasVoiceSection)
    .forEach((r) => {
      logFn(`   - ${r.file}`);
    });
}

/**
 * Run the compliance check
 */
function run() {
  const antiPatterns = loadAntiPatterns();
  const agentFiles = discoverAgentFiles();

  if (agentFiles.length === 0) {
    console.warn('⚠️  No agent files found in .claude/agents/');
    process.exit(0);
  }

  console.log(`\n🔍 DCYFR Voice Compliance Check`);
  console.log(`${'─'.repeat(60)}`);
  console.log(`Scanning ${agentFiles.length} agents in ${AGENTS_DIR}`);
  console.log(`Threshold: ${THRESHOLD}%  |  Mode: ${GATE_MODE}`);
  console.log(`Brand anti-patterns loaded: ${antiPatterns.length}`);
  console.log(`${'─'.repeat(60)}\n`);

  const results = agentFiles.map((filename) => {
    const filepath = join(AGENTS_DIR, filename);
    return analyzeAgent(filepath, filename);
  });

  printAgentResults(results);

  const passing = results.filter((r) => r.status === 'pass' || r.status === 'warn').length;
  const failing = results.filter((r) => r.status === 'fail').length;
  const withVoice = results.filter((r) => r.hasVoiceSection).length;
  const compliancePercent = Math.round((withVoice / agentFiles.length) * 100);

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`📊 Results:`);
  console.log(`   Total agents:     ${agentFiles.length}`);
  console.log(`   With voice section: ${withVoice} / ${agentFiles.length}`);
  console.log(`   Passing:          ${passing}`);
  console.log(`   Failing:          ${failing}`);
  console.log(`   Compliance:       ${compliancePercent}%  (threshold: ${THRESHOLD}%)`);

  if (compliancePercent >= THRESHOLD) {
    console.log(`\n✅ Voice compliance gate PASSED (${compliancePercent}% ≥ ${THRESHOLD}%)\n`);
    process.exit(0);
  }

  const msg = `❌ Voice compliance gate FAILED — ${compliancePercent}% < ${THRESHOLD}% threshold`;
  if (GATE_MODE === 'warn') {
    console.warn(`\n⚠️  ${msg} (warning mode — not blocking)\n`);
    listMissingVoiceSections(results, console.warn);
    process.exit(0);
  }

  console.error(`\n${msg}\n`);
  listMissingVoiceSections(results, console.error);
  console.error('\n   Add "## Voice & Identity" sections to fix compliance.\n');
  process.exit(1);
}

run();
