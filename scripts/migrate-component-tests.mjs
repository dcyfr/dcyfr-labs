#!/usr/bin/env node
/**
 * Test Migration Script
 *
 * Migrates component-level __tests__ directories to centralized src/__tests__/
 * Maintains directory structure for organization while centralizing location
 *
 * Before: src/components/blog/__tests__/BlogCard.test.tsx
 * After:  src/__tests__/components/blog/BlogCard.test.tsx
 */

import { readdir, mkdir, rename, rmdir } from 'fs/promises';
import { join, dirname, relative } from 'path';
import { existsSync } from 'fs';

// Component __tests__ directories to migrate
const componentTestDirs = [
  'src/components/about/__tests__',
  'src/components/blog/__tests__',
  'src/components/blog/rivet/navigation/__tests__',
  'src/components/blog/rivet/engagement/__tests__',
  'src/components/blog/rivet/visual/__tests__',
  'src/components/blog/rivet/interactive/__tests__',
  'src/components/common/__tests__',
];

let totalMoved = 0;
let totalDirsRemoved = 0;

async function migrateTests() {
  console.log('🔄 Starting test migration...\n');

  for (const dir of componentTestDirs) {
    if (!existsSync(dir)) {
      console.log(`⏭️  Skipping ${dir} (not found)`);
      continue;
    }

    // Calculate target directory
    // src/components/blog/__tests__ → src/__tests__/components/blog/
    const relativePath = dir.replace('/__tests__', '').replace('src/', '');
    const targetBase = join('src/__tests__', relativePath);

    console.log(`\n📁 Processing: ${dir}`);
    console.log(`   Target: ${targetBase}`);

    // Create target directory
    await mkdir(targetBase, { recursive: true });

    // Get all files in source directory
    const files = await readdir(dir);

    for (const file of files) {
      const sourcePath = join(dir, file);
      const targetPath = join(targetBase, file);

      console.log(`   ✓ Moving: ${file}`);
      await rename(sourcePath, targetPath);
      totalMoved++;
    }

    // Remove empty __tests__ directory
    try {
      await rmdir(dir);
      console.log(`   ✓ Removed empty: ${dir}`);
      totalDirsRemoved++;
    } catch (err) {
      console.warn(`   ⚠️  Could not remove ${dir}: ${err.message}`);
    }
  }

  console.log('\n✅ Migration complete!');
  console.log(`   Files moved: ${totalMoved}`);
  console.log(`   Directories removed: ${totalDirsRemoved}`);
  console.log('\n📊 Next steps:');
  console.log('   1. Run: npm run test:run');
  console.log('   2. Verify: npm run test:coverage');
  console.log('   3. Check: npm run typecheck');
}

// Run migration
migrateTests().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
