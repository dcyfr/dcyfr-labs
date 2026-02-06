#!/usr/bin/env node
/**
 * Regenerate src/lib/index.ts barrel export file
 * Fixes duplicate exports and type export issues
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const libIndexPath = join(projectRoot, 'src/lib/index.ts');

// Read current file
const currentContent = readFileSync(libIndexPath, 'utf-8');
const lines = currentContent.split('\n');

// Extract unique export lines (remove duplicates)
const seenExports = new Set();
const uniqueLines = [];
let inComment = false;

for (const line of lines) {
  // Keep comments and blank lines
  if (line.trim().startsWith('/**') || line.trim().startsWith('/*')) {
    inComment = true;
    uniqueLines.push(line);
    continue;
  }
  if (inComment) {
    uniqueLines.push(line);
    if (line.trim().includes('*/')) {
      inComment = false;
    }
    continue;
  }
  if (line.trim().startsWith('//') || line.trim() === '') {
    uniqueLines.push(line);
    continue;
  }

  // Skip export lines we've already seen
  if (line.trim().startsWith('export ')) {
    // Normalize the line for duplicate detection
    const normalized = line.trim().replace(/\s+/g, ' ');
    if (seenExports.has(normalized)) {
      console.log(`Skipping duplicate: ${line.substring(0, 80)}...`);
      continue;
    }
    seenExports.add(normalized);
  }

  uniqueLines.push(line);
}

// Now fix type exports - add 'type' keyword where needed
const fixedLines = uniqueLines.map(line => {
  if (!line.trim().startsWith('export {')) {
    return line;
  }

  // Check if line exports things that should be types
  const typeKeywords = [
    'Config', 'Options', 'Result', 'Response', 'Request', 'Data', 'Item',
    'Entry', 'Meta', 'Metadata', 'Schema', 'Context', 'Event', 'Stats',
    'Type', 'Category', 'Filter', 'Variant', 'Theme', 'Format', 'Level',
    'Status', 'Error', 'Manager', 'Client', 'Service', 'Adapter', 'Handler'
  ];

  // Simple heuristic: if the export contains mostly types, make it export type
  const hasTypeKeywords = typeKeywords.some(keyword => line.includes(keyword));
  
  // But don't change it if it already has 'export type'
  if (hasTypeKeywords && !line.includes('export type')) {
    // Check if ALL exports seem type-like (name starts with capital or contains type keyword)
    const exportsMatch = line.match(/export\s*\{([^}]+)\}/);
    if (exportsMatch) {
      const exports = exportsMatch[1].split(',').map(e => e.trim().split(/\s+/)[0]);
      const allTypeLike = exports.every(name => {
        // Capital letter or has type keyword
        return /^[A-Z]/.test(name) || typeKeywords.some(kw => name.includes(kw));
      });
      
      // Don't convert if it has mixed case exports (likely values + types)
      if (!allTypeLike) {
        return line;
      }
      
      // Convert to export type
      return line.replace(/^export\s*\{/, 'export type {');
    }
  }

  return line;
});

// Write back
const newContent = fixedLines.join('\n');
writeFileSync(libIndexPath, newContent, 'utf-8');

console.log('✅ Fixed src/lib/index.ts');
console.log(`   Removed ${lines.length - fixedLines.length} duplicate lines`);
console.log(`   Generated ${fixedLines.length} lines`);
