#!/usr/bin/env node

/**
 * Development Server with Auto Cache Population
 *
 * Starts the Next.js dev server and automatically populates the cache
 * once the server is ready. This ensures GitHub Activity, Badges, and
 * Skills widgets work immediately in local development.
 *
 * Usage:
 *   npm run dev
 *   # or with custom port:
 *   PORT=3001 npm run dev
 */

import { spawn } from 'child_process';
import chalk from 'chalk';

const PORT = process.env.PORT || 3000;
const POPULATE_DELAY = 3000; // Wait 3s for server to be ready

console.log(chalk.blue('🚀 Starting Next.js dev server with auto cache population...\n'));

// Start the Next.js dev server
const devServer = spawn('next', ['dev', '--turbopack'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: String(PORT) },
});

// Handle server exit
devServer.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(chalk.red(`\n❌ Dev server exited with code ${code}`));
  }
  process.exit(code || 0);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n⏸️  Shutting down dev server...'));
  devServer.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  devServer.kill('SIGTERM');
  process.exit(0);
});

// Wait for server to be ready, then populate cache
setTimeout(async () => {
  console.log(chalk.blue('\n📦 Populating local cache...'));

  try {
    const response = await fetch(`http://localhost:${PORT}/api/dev/populate-cache`);

    if (!response.ok) {
      const text = await response.text();
      console.warn(chalk.yellow(`⚠️  Cache population failed: ${response.status}`));
      console.warn(chalk.yellow(`   ${text}`));
      console.warn(chalk.yellow(`   Run manually: npm run populate:cache`));
      return;
    }

    const data = await response.json();
    console.log(chalk.green('✅ Cache populated successfully!'));
    console.log(
      chalk.dim('   - GitHub contributions: ') + (data.github ? chalk.green('✓') : chalk.red('✗'))
    );
    console.log(
      chalk.dim('   - Credly badges: ') + (data.credly ? chalk.green('✓') : chalk.red('✗'))
    );

    if (data.warning) {
      console.warn(chalk.yellow(`   ⚠️  ${data.warning}`));
    }
  } catch (error) {
    console.warn(chalk.yellow('\n⚠️  Could not populate cache (server may still be starting)'));
    console.warn(chalk.yellow(`   Run manually once server is ready: npm run populate:cache`));
  }
}, POPULATE_DELAY);
