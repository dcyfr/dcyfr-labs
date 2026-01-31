/**
 * Check Redis for analytics keys
 */
import dotenv from 'dotenv';
import { Redis } from '@upstash/redis';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const prodRedis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

console.log('🔍 Checking production Redis for engagement metrics...\n');

try {
  // Check for engagement keys
  const engagementKeys = await prodRedis.keys('engagement:*');
  console.log(`Found ${engagementKeys?.length || 0} engagement keys:`, engagementKeys);

  // Check for pageview keys
  const pageviewKeys = await prodRedis.keys('pageviews:*');
  console.log(`\nFound ${pageviewKeys?.length || 0} pageview keys:`, pageviewKeys);

  // Check for specific engagement patterns
  const patterns = ['*:likes:*', '*:bookmarks:*', '*:shares:*'];
  for (const pattern of patterns) {
    const keys = await prodRedis.keys(pattern);
    if (keys && keys.length > 0) {
      console.log(`\nPattern '${pattern}':`, keys.slice(0, 10));
      // Sample first key
      if (keys[0]) {
        const value = await prodRedis.get(keys[0]);
        console.log(`  Sample value (${keys[0]}):`, value);
      }
    } else {
      console.log(`\nPattern '${pattern}': No keys found`);
    }
  }

  // Check all keys to see what exists
  console.log('\n📋 All keys in production:');
  const allKeys = await prodRedis.keys('*');
  console.log(`Total keys: ${allKeys?.length || 0}`);
  if (allKeys && allKeys.length > 0) {
    console.log('Sample keys:', allKeys.slice(0, 20));
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
