#!/usr/bin/env node

/**
 * Print Stylesheet Test Helper
 * 
 * This script helps verify that print-related CSS is properly configured.
 * Run: npm run test:print
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const PRINT_CSS_PATH = join(process.cwd(), 'src/app/print.css');
const BLOG_PAGE_PATH = join(process.cwd(), 'src/app/blog/[slug]/page.tsx');

console.log('🖨️  Print Stylesheet Test\n');
console.log('═'.repeat(50));

try {
  const printCSS = readFileSync(PRINT_CSS_PATH, 'utf8');
  const blogPage = readFileSync(BLOG_PAGE_PATH, 'utf8');
  
  // Check for key features
  const checks = [
    {
      name: 'Media Query',
      pattern: /@media print/,
      description: 'Main print media query exists',
      file: 'print.css'
    },
    {
      name: 'Page Setup',
      pattern: /@page/,
      description: 'Page margins and size configured',
      file: 'print.css'
    },
    {
      name: 'Hide Navigation',
      pattern: /\.site-header[\s,]/,
      description: 'Site header hidden in print',
      file: 'print.css'
    },
    {
      name: 'Hide Interactive',
      pattern: /\.reading-progress/,
      description: 'Reading progress indicator hidden',
      file: 'print.css'
    },
    {
      name: 'Hide TOC',
      pattern: /\.table-of-contents/,
      description: 'Table of contents hidden',
      file: 'print.css'
    },
    {
      name: 'Hide Comments',
      pattern: /giscus/i,
      description: 'Comment section hidden',
      file: 'print.css'
    },
    {
      name: 'Code Blocks',
      pattern: /pre\s*{[^}]*page-break-inside:\s*avoid/,
      description: 'Code blocks avoid page breaks',
      file: 'print.css'
    },
    {
      name: 'Link URLs',
      pattern: /a\[href\^="http"\]:after/,
      description: 'External link URLs displayed',
      file: 'print.css'
    },
    {
      name: 'Typography',
      pattern: /font-family.*Georgia/i,
      description: 'Serif fonts for print',
      file: 'print.css'
    },
    {
      name: 'Badge Styling',
      pattern: /\.badge[\s,{]/,
      description: 'Badge print styles defined',
      file: 'print.css'
    },
    {
      name: 'Article URL CSS',
      pattern: /article\[data-url\]:after[^}]*attr\(data-url\)/s,
      description: '"Read online" URL in CSS (specific selector)',
      file: 'print.css'
    },
    {
      name: 'Data-URL Attribute',
      pattern: /data-url=\{`\${SITE_URL}\/blog\/\${post\.slug}`\}/,
      description: 'data-url attribute on article element',
      file: 'blog page'
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  checks.forEach(check => {
    const content = check.file === 'print.css' ? printCSS : blogPage;
    const found = check.pattern.test(content);
    if (found) {
      console.log(`✅ ${check.name}: ${check.description}`);
      passed++;
    } else {
      console.log(`❌ ${check.name}: ${check.description}`);
      failed++;
    }
  });
  
  console.log('\n' + '═'.repeat(50));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('\n✨ All print stylesheet checks passed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start dev server: npm run dev');
    console.log('   2. Navigate to a blog post');
    console.log('   3. Open print preview (Cmd+P / Ctrl+P)');
    console.log('   4. Verify "Read online: [URL]" appears at bottom');
    console.log('\n🧪 Test Page:');
    console.log('   Open: http://localhost:3000/test-print-url.html');
    console.log('   Then print preview to see the URL feature in action');
    console.log('\n💡 Tip: Use Chrome DevTools > Rendering > "Emulate CSS media: print"');
    console.log('   to see print styles without opening print dialog');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some checks failed. Review print.css and blog page for missing styles.');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Error reading files:', error.message);
  process.exit(1);
}
