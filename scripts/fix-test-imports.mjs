#!/usr/bin/env node
/**
 * Fix Test Imports After Migration
 * 
 * Updates relative imports in migrated tests to use absolute @/ imports
 */

import { readFile, writeFile } from 'fs/promises';
import { readdir } from 'fs/promises';
import { join } from 'path';

async function getAllTestFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getAllTestFiles(path));
    } else if (entry.name.endsWith('.test.tsx') || entry.name.endsWith('.test.ts')) {
      files.push(path);
    }
  }
  
  return files;
}

async function fixImports() {
  console.log('🔧 Fixing test imports...\n');
  
  const testFiles = await getAllTestFiles('src/__tests__/components');
  let fixed = 0;
  
  for (const file of testFiles) {
    const content = await readFile(file, 'utf-8');
    
    // Extract component path from file path
    // src/__tests__/components/blog/rivet/engagement/role-based-cta.test.tsx
    // → @/components/blog/rivet/engagement/role-based-cta
    const match = file.match(/src\/__tests__\/components\/(.+)\.test\.(tsx?)/);
    if (!match) continue;
    
    const componentPath = match[1];
    const dir = componentPath.split('/').slice(0, -1).join('/');
    const componentName = componentPath.split('/').pop();
    
    // Replace relative imports like '../component-name' with absolute imports
    const newContent = content.replace(
      /from ['"]\.\.\/([^'"]+)['"]/g,
      (match, importPath) => {
        // If importing the component being tested
        if (importPath === componentName || importPath.endsWith(`/${componentName}`)) {
          return `from '@/components/${componentPath}'`;
        }
        // If importing from parent directory
        return `from '@/components/${dir}/${importPath}'`;
      }
    );
    
    if (content !== newContent) {
      await writeFile(file, newContent);
      console.log(`✓ Fixed: ${file}`);
      fixed++;
    }
  }
  
  console.log(`\n✅ Fixed ${fixed} test files`);
}

fixImports().catch(console.error);
