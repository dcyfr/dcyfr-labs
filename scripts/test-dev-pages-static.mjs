#!/usr/bin/env node
import { readFileSync } from 'fs';
import path from 'path';

const root = process.cwd();
const pagePath = path.join(root, 'src', 'app', 'analytics', 'page.tsx');

try {
  const content = readFileSync(pagePath, 'utf8');
  if (content.includes('assertDevOr404')) {
    console.log('OK: analytics page uses assertDevOr404');
    process.exit(0);
  } else {
    console.error('FAIL: analytics page does not use assertDevOr404');
    process.exit(1);
  }
} catch (err) {
  console.error('Error reading analytics page:', err);
  process.exit(2);
}
