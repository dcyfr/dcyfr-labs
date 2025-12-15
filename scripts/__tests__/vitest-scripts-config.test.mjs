import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';

describe('vitest.scripts.config', () => {
  it('uses thread pool and maxThreads setting', async () => {
    const file = path.resolve(process.cwd(), 'vitest.scripts.config.ts');
    const content = await fs.promises.readFile(file, 'utf8');
    expect(content).toMatch(/pool:\s*'threads'/);
    expect(content).toMatch(/maxThreads:\s*'75%'/);
    expect(content).toMatch(/node_modules\/\.vitest-scripts/);
  });
});
