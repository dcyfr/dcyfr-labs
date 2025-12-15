import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';

describe('next.config.ts', () => {
  it('exports experimental.cpus setting', async () => {
    const file = path.resolve(process.cwd(), 'next.config.ts');
    const content = await fs.promises.readFile(file, 'utf8');
    // Ensure cpus is configured via Math.max and os.cpus
    expect(content).toMatch(/cpus:\s*Math\.max\(/);
    expect(content).toMatch(/require\('os'\)\.cpus\(\)/);
  });
});
