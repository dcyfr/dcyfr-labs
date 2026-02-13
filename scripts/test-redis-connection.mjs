#!/usr/bin/env node
/**
 * Redis Connection Test Script
 * Tests current Redis configuration and suggests fixes
 */

import { redis, getRedisEnvironment } from '../src/mcp/shared/redis-client.mjs';

async function testRedisConnection() {
  console.log('🔍 Testing Redis Connection...\n');

  // Environment diagnostics
  console.log('Environment:', getRedisEnvironment());
  console.log('Node Environment:', process.env.NODE_ENV);
  console.log('Vercel Environment:', process.env.VERCEL_ENV || 'not set');
  console.log('');

  // Configuration check
  console.log('📋 Configuration Check:');
  console.log('✅ UPSTASH_REDIS_REST_URL:', process.env.UPSTASH_REDIS_REST_URL ? 'SET' : 'MISSING');
  console.log('✅ UPSTASH_REDIS_REST_TOKEN:', process.env.UPSTASH_REDIS_REST_TOKEN ? 'SET' : 'MISSING');
  console.log('✅ UPSTASH_REDIS_REST_URL_PREVIEW:', process.env.UPSTASH_REDIS_REST_URL_PREVIEW ? 'SET' : 'MISSING');
  console.log('✅ UPSTASH_REDIS_REST_TOKEN_PREVIEW:', process.env.UPSTASH_REDIS_REST_TOKEN_PREVIEW ? 'SET' : 'MISSING');
  
  // Check for problematic legacy variables
  if (process.env.REDIS_URL) {
    console.log('🚨 REDIS_URL:', 'DETECTED (REMOVE THIS - causes ENOTFOUND errors)');
  }
  if (process.env.PREVIEW_REDIS_URL) {
    console.log('🚨 PREVIEW_REDIS_URL:', 'DETECTED (REMOVE THIS - causes ENOTFOUND errors)');
  }
  console.log('');

  if (!redis) {
    console.log('❌ Redis client not initialized');
    console.log('   This usually means credentials are not configured for this environment');
    process.exit(1);
  }

  try {
    console.log('🧪 Testing Redis operations...');
    
    // Test ping
    console.log('   Testing ping...');
    const pingResult = await redis.ping();
    console.log('   ✅ Ping successful:', pingResult);

    // Test set/get/del
    console.log('   Testing set/get/del operations...');
    const testKey = `test:${Date.now()}`;
    await redis.set(testKey, 'hello-redis', { ex: 60 });
    const value = await redis.get(testKey);
    await redis.del(testKey);
    
    if (value === 'hello-redis') {
      console.log('   ✅ Set/Get/Del operations successful');
    } else {
      console.log('   ❌ Set/Get/Del test failed - got:', value);
    }

    // Test keys operation (used by trending calculation)
    console.log('   Testing keys operation...');
    const keys = await redis.keys('test:*');
    console.log('   ✅ Keys operation successful, found', keys.length, 'test keys');

    console.log('\n🎉 All Redis tests passed! Connection is working properly.');
    
  } catch (error) {
    console.error('\n❌ Redis test failed:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n🔧 LIKELY CAUSE: Legacy Redis Cloud environment variables');
      console.log('   Remove these variables from your environment:');
      console.log('   - REDIS_URL (points to old Redis Cloud)');
      console.log('   - PREVIEW_REDIS_URL (points to old Redis Cloud)');
      console.log('');
      console.log('   Keep only these variables:');
      console.log('   - UPSTASH_REDIS_REST_URL (production)'); 
      console.log('   - UPSTASH_REDIS_REST_TOKEN (production)');
      console.log('   - UPSTASH_REDIS_REST_URL_PREVIEW (preview/dev)');
      console.log('   - UPSTASH_REDIS_REST_TOKEN_PREVIEW (preview/dev)');
    } else if (error.message.includes('timeout')) {
      console.log('\n🔧 LIKELY CAUSE: Network connectivity or Redis server issues');
      console.log('   - Check Upstash Redis dashboard for service status');
      console.log('   - Verify credentials are correct and active');
    }
    
    process.exit(1);
  }
}

// Run the test
testRedisConnection().catch(console.error);