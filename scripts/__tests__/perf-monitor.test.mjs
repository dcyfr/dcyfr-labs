import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';

describe('perf-monitor workflow', () => {
  it('includes cache restore and uploads perf metrics', async () => {
    const file = path.resolve(process.cwd(), '.github/workflows/perf-monitor.yml');
    const content = await fs.promises.readFile(file, 'utf8');
    expect(content).toMatch(/Restore Next\.js build cache/);
    expect(content).toMatch(/steps.next-cache.outputs.cache-hit/);
    expect(content).toMatch(/upload-artifact@v5/);
    expect(content).toMatch(/perf\/metrics.json/);
  });
});
