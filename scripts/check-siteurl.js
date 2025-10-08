import fs from 'fs';
import path from 'path';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://cyberdrew.dev';

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Consider either the literal SITE_URL value or the identifier SITE_URL being used/imported
  return content.includes(SITE_URL) || content.includes('SITE_URL');
}

const files = [
  path.join(process.cwd(), 'src', 'app', 'rss.xml', 'route.ts'),
  path.join(process.cwd(), 'src', 'app', 'atom.xml', 'route.ts'),
  path.join(process.cwd(), 'src', 'app', 'sitemap.ts'),
];

let allGood = true;
for (const f of files) {
  if (!fs.existsSync(f)) {
    console.error('Missing file:', f);
    allGood = false;
    continue;
  }
  const ok = checkFile(f);
  console.log(`${path.basename(f)}: ${ok ? 'OK' : 'MISSING SITE_URL'}`);
  if (!ok) allGood = false;
}

process.exit(allGood ? 0 : 2);
