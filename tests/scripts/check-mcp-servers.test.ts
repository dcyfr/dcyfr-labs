import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import http from 'http';
import https from 'https';
import type { Server as HttpServer } from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

import { parseEnvFile, readMcpConfig, checkUrlServer, checkCommandServer, run } from '../../scripts/check-mcp-servers.mjs';

// Provide a simple node-based fetch for the tests to avoid CORS/DOM policy used
// by the default test environment. We implement a minimal HEAD/GET support.
  globalThis.fetch = ((url: RequestInfo | URL, opts: any = {}) => {
  const { method = 'GET', headers } = opts;
  const parsed = new URL(String(url));
  const lib = parsed.protocol === 'https:' ? https : http;
  return new Promise((resolve, reject) => {
    const req = lib.request(
      { method, hostname: parsed.hostname, path: parsed.pathname + parsed.search, port: parsed.port },
      (res) => {
        const status = (res.statusCode || 0) as number;
        resolve({ ok: status >= 200 && status < 400, status, statusText: res.statusMessage || '' });
      }
    );
    req.on('error', reject);
    req.end();
  });
  }) as any;

describe('check-mcp-servers', () => {
  let server: HttpServer | null = null;
  let url = '';
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-test-'));
  const envFile = path.join(tmp, '.env.local');
  const mcpFile = path.join(tmp, 'mcp.json');

  beforeAll(() => {
    server = http.createServer((req, res) => {
      if (req.method === 'HEAD' || req.method === 'GET') {
        res.writeHead(200);
        res.end('ok');
      } else {
        res.writeHead(200);
        res.end('ok');
      }
    }).listen(0);
    const address = server.address();
    // address can be a string or AddressInfo
    // @ts-ignore - address is address info for this local server
    const port = (address as { port: number }).port;
    url = `http://127.0.0.1:${port}`;
    fs.writeFileSync(envFile, 'TEST_TOKEN=abc123\n');
    const mcpJson = { servers: {
      "LocalHttp": { url },
      "NodeCommand": { command: "node", args: ["-v"] }
    } };
    fs.writeFileSync(mcpFile, JSON.stringify(mcpJson, null, 2));
  });

  afterAll(() => {
    try { server && server.close(); } catch (err) {}
  });

  it('parseEnvFile reads .env-like files', () => {
    const parsed = parseEnvFile(envFile) as Record<string, string>;
    expect(parsed.TEST_TOKEN).toBe('abc123');
  });

  it('readMcpConfig returns servers when config exists', () => {
    const servers = readMcpConfig(mcpFile);
    expect(servers.LocalHttp.url).toBe(url);
    expect(servers.NodeCommand.command).toBe('node');
  });

  it('checkUrlServer returns ok for running local server', async () => {
    const res = await checkUrlServer('LocalHttp', { url }, { TEST_TOKEN: 'abc123' });
    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
  });

  it('checkCommandServer returns ok for node -v', () => {
    const res = checkCommandServer('NodeCommand', { command: 'node', args: ['-v'] });
    expect(res.ok).toBe(true);
    expect(res.stdout).toMatch(/v\d+\.\d+\.\d+/);
  });

  it('run returns a result list and no failures in non-fail mode', async () => {
    const results = await run({ configPath: mcpFile, envFile, json: false, fail: false });
    const local = results.find(r => r.name === 'LocalHttp');
    const nodeCmd = results.find(r => r.name === 'NodeCommand');
    expect(local && local.ok).toBe(true);
    expect(nodeCmd && nodeCmd.ok).toBe(true);
  });
});
