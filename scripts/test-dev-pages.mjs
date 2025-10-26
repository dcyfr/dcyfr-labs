#!/usr/bin/env node
import { spawn, execSync } from 'child_process';

// Small helper to wait
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

async function main() {
  try {
    console.log('Building project (production) with a clean env...');
    // Ensure build runs with NODE_ENV=production and VERCEL_ENV=production so
    // dev-only pages are not prerendered as development content.
  const buildEnv = { ...process.env, NODE_ENV: 'production', VERCEL_ENV: 'production', CYBERDREW_DISABLE_DEV_PAGES: '1' };
    // Remove any NEXT_PUBLIC_VERCEL_ENV which could indicate a preview environment
    delete buildEnv.NEXT_PUBLIC_VERCEL_ENV;

    execSync('npm run build', { stdio: 'inherit', env: buildEnv });

    // Ensure nothing is already listening on :3000 (avoid conflicting servers)
    try {
      const raw = execSync("lsof -ti :3000 || true").toString().trim();
      const pids = raw ? raw.split(/\s+/).filter(Boolean) : [];
      if (pids.length) {
        console.log('Found existing process(es) on :3000, killing them:', pids.join(' '));
        try {
          execSync(`kill -9 ${pids.join(' ')}`);
        } catch {
          // ignore kill errors
        }
      }
    } catch {
      // ignore
    }

    console.log('Starting production server (clean env)...');
  const startEnv = { ...process.env, NODE_ENV: 'production', VERCEL_ENV: 'production', CYBERDREW_DISABLE_DEV_PAGES: '1' };
    delete startEnv.NEXT_PUBLIC_VERCEL_ENV;

    const child = spawn('npm', ['run', 'start'], {
      env: startEnv,
      stdio: ['ignore', 'inherit', 'inherit'],
    });

    // Wait for server to become available
    const url = 'http://localhost:3000/analytics';
    const maxAttempts = 30;

    let ok = false;
    for (let i = 0; i < maxAttempts; i++) {
      try {
        await fetch(url, { redirect: 'manual' });
        // We just need a response; server is ready
        ok = true;
        break;
      } catch {
        // Not ready yet
        await wait(1000);
      }
    }

    if (!ok) {
      child.kill('SIGKILL');
      console.error('Server did not start in time');
      process.exit(2);
    }

    // Now check the analytics route — in production it should 404
    console.log('Checking /analytics returns 404 in production...');
    const res = await fetch(url, { redirect: 'manual' });
    console.log('Status:', res.status);

    child.kill('SIGTERM');

    if (res.status === 404) {
      console.log('OK: /analytics returned 404 in production');
      process.exit(0);
    } else {
      console.error('FAIL: /analytics did not return 404 in production');
      process.exit(1);
    }
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
