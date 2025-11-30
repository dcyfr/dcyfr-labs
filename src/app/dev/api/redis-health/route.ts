/**
 * Dev Tools - Redis Health Check Endpoint
 * 
 * Tests Redis connectivity and configuration.
 * Only accessible in development mode (protected by proxy.ts).
 */

import { NextResponse } from "next/server";
import { testRedisConnection } from "@/lib/redis-health";

export async function GET() {
  try {
    const status = await testRedisConnection();

    return NextResponse.json(
      {
        ...status,
        timestamp: new Date().toISOString(),
      },
      {
        status: status.connected ? 200 : 503,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        enabled: false,
        configured: false,
        connected: false,
        message: "Failed to check Redis status",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
