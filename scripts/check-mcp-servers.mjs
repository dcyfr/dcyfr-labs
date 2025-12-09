#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = process.cwd();

function parseEnvFile(filePath) {
  try {
    const text = fs.readFileSync(filePath, 'utf8');
    const lines = text.split(/\r?\n/);
    const out = {};
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      // Remove surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      out[key] = val;
    }
    return out;
  } catch (err) {
    return {};
  }
}

function readMcpConfig(configPath = path.join(ROOT, '.vscode', 'mcp.json')) {
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    const cfg = JSON.parse(raw);
    return cfg.servers || {};
  } catch (err) {
    return {};
  }
}

async function checkUrlServer(name, server, env = {}, timeoutMs = 5000) {
  const url = server.url;
  if (!url) return { name, ok: false, error: 'no-url' };
  const headers = {};
  // Try to guess an auth token from env
  const tokensToTry = [
    `${name.toUpperCase()}_API_KEY`,
    `${name.toUpperCase()}_TOKEN`,
    `${name.toUpperCase()}_KEY`,
    `${name.toUpperCase()}_AUTH_TOKEN`,
  ];
  for (const t of tokensToTry) {
    if (env[t]) {
      headers['Authorization'] = `Bearer ${env[t]}`;
      break;
    }
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { method: 'HEAD', headers, signal: controller.signal });
    clearTimeout(timer);
    return { name, ok: res.ok || res.status === 401 || res.status === 403, status: res.status, statusText: res.statusText };
  } catch (err) {
    return { name, ok: false, error: String(err) };
  }
}

function checkCommandServer(name, server) {
  const command = server.command;
  const args = server.args || [];
  if (!command) return { name, ok: false, error: 'no-command' };
  // Append a version check flag if not already present
  const cmdArgs = Array.from(args);
  // Some packages want --version, some -v; try both
  cmdArgs.push('--version');
  try {
    const res = spawnSync(command, cmdArgs, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 10_000 });
    if (res.error) return { name, ok: false, error: String(res.error) };
    if (res.status === 0) return { name, ok: true, stdout: res.stdout.trim() };
    // Try running with --help if version failed
    const res2 = spawnSync(command, [...args, '--help'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 10_000 });
    if (res2.status === 0) return { name, ok: true, stdout: (res2.stdout || res2.stderr).trim() };
    return { name, ok: false, status: res.status, stderr: res.stderr.trim() };
  } catch (err) {
    return { name, ok: false, error: String(err) };
  }
}

async function run(opts = {}) {
  const servers = readMcpConfig(opts.configPath);
  // If an envFile is set at root mcp.json use it; fallback to .env.local
  let env = process.env;
  const envFile = (opts.envFile || '.env.local');
  const envPath = path.isAbsolute(envFile) ? envFile : path.join(ROOT, envFile);
  if (fs.existsSync(envPath)) {
    const parsed = parseEnvFile(envPath);
    env = { ...process.env, ...parsed };
  }
  const results = [];
  for (const [name, server] of Object.entries(servers)) {
    if (server.url) {
      const r = await checkUrlServer(name, server, env, opts.timeoutMs);
      results.push({ name, type: 'url', ...r });
    } else if (server.command) {
      const r = checkCommandServer(name, server);
      results.push({ name, type: 'command', ...r });
    } else {
      results.push({ name, ok: false, error: 'unknown-server-type' });
    }
  }
  const failures = results.filter(r => !r.ok);
  if (opts.json) {
    console.log(JSON.stringify({ results, failures }, null, 2));
  } else {
    for (const r of results) {
      if (r.ok) {
        console.log(`✓ ${r.name} (${r.type}) - OK${r.status ? ` [${r.status}]` : ''}`);
      } else {
        console.error(`✖ ${r.name} (${r.type}) - FAILED ${r.error ? `(${r.error})` : r.status ? `[${r.status}]` : ''}`);
      }
    }
  }
  if (failures.length > 0 && opts.fail) {
    process.exit(1);
  }
  return results;
}

// CLI
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const opts = { json: false, fail: false, timeoutMs: 5000, envFile: '.env.local', configPath: path.join(ROOT, '.vscode', 'mcp.json') };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--json') opts.json = true;
    if (a === '--fail') opts.fail = true;
    if (a === '--no-auth') opts.noAuth = true;
    if ((a === '--timeout' || a === '-t') && args[i + 1]) { opts.timeoutMs = parseInt(args[i + 1], 10); i++; }
    if ((a === '--envFile' || a === '-e') && args[i + 1]) { opts.envFile = args[i + 1]; i++; }
    if ((a === '--config' || a === '-c') && args[i + 1]) { opts.configPath = args[i + 1]; i++; }
  }
  run(opts).catch(err => { console.error(err); process.exit(1); });
}

export { parseEnvFile, readMcpConfig, checkUrlServer, checkCommandServer, run };
