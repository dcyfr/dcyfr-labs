import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';

describe('CI workflow cache', () => {
  it('cache section in test.yml includes .next and .next/cache', async () => {
    const file = path.resolve(process.cwd(), '.github/workflows/test.yml');
    const content = await fs.promises.readFile(file, 'utf8');
    expect(content).toMatch(/\.next\/cache/);
    expect(content).toMatch(/\.next\s*$/m);
    expect(content).toMatch(/-build-v1/);
  });
});
