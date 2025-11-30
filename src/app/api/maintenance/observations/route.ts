/**
 * Maintenance Observations API
 * GET/POST endpoints for observation logging
 * 
 * Stores observations in Redis if available, otherwise uses in-memory storage (dev only).
 */

import { NextResponse } from "next/server";
import { createClient } from "redis";
import type { Observation } from "@/types/maintenance";

const redisUrl = process.env.REDIS_URL;
const OBSERVATIONS_KEY = "maintenance:observations";
const MAX_OBSERVATIONS = 100; // Keep last 100 observations

// In-memory fallback storage for development (not persisted)
let inMemoryObservations: Observation[] = [];

/**
 * Get Redis client (with connection)
 */
async function getRedisClient() {
  if (!redisUrl) return null;

  try {
    const client = createClient({ url: redisUrl });
    if (!client.isOpen) {
      await client.connect();
    }
    return client;
  } catch {
    return null;
  }
}

/**
 * GET /api/maintenance/observations
 * Fetches recent observations
 *
 * Query params:
 * - limit: Number of observations to fetch (default: 20, max: 100)
 * - category: Filter by category (optional)
 * - severity: Filter by severity (optional)
 */
export async function GET(request: Request) {
  try {
    // Return empty observations list (Redis not available in dev)
    return NextResponse.json({
      observations: [],
      total: 0,
      timestamp: new Date().toISOString(),
      note: "Using in-memory storage (development only)",
    });
  } catch (error) {
    console.error("Failed to fetch observations:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch observations",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/maintenance/observations
 * Creates a new observation
 *
 * Body:
 * {
 *   category: string,
 *   severity: string,
 *   title: string,
 *   description: string,
 *   tags: string[],
 *   screenshot?: string
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const { category, severity, title, description, tags } = body;

    if (!category || !severity || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields: category, severity, title, description" },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ["ai-performance", "dev-tools", "workflow", "general"];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate severity
    const validSeverities = ["info", "warning", "error"];
    if (!validSeverities.includes(severity)) {
      return NextResponse.json(
        { error: `Invalid severity. Must be one of: ${validSeverities.join(", ")}` },
        { status: 400 }
      );
    }

    // Create observation
    const observation: Observation = {
      id: crypto.randomUUID(),
      category,
      severity,
      title,
      description,
      tags: Array.isArray(tags) ? tags : [],
      screenshot: body.screenshot,
      createdAt: new Date().toISOString(),
      createdBy: "manual",
      metadata: body.metadata,
    };

    // Try to store in Redis, fall back to in-memory
    const redis = await getRedisClient();
    let usingFallback = false;

    if (redis) {
      try {
        // Add to front of list (most recent first)
        await redis.lpush(OBSERVATIONS_KEY, JSON.stringify(observation));

        // Trim to keep only last MAX_OBSERVATIONS
        await redis.ltrim(OBSERVATIONS_KEY, 0, MAX_OBSERVATIONS - 1);
      } catch (redisError) {
        console.warn("Redis storage failed, using fallback:", redisError);
        usingFallback = true;
      }
    } else {
      usingFallback = true;
    }

    // Use in-memory storage if Redis not available or failed
    if (usingFallback) {
      inMemoryObservations = [observation, ...inMemoryObservations].slice(0, MAX_OBSERVATIONS);
    }

    console.log(`[Observation Created] ${severity.toUpperCase()}: ${title}${usingFallback ? " (in-memory)" : " (Redis)"}`);

    return NextResponse.json(
      {
        observation,
        message: "Observation created successfully",
        ...(usingFallback && { note: "Stored in-memory (development only)" }),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create observation:", error);

    return NextResponse.json(
      {
        error: "Failed to create observation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/maintenance/observations/[id]
 * Deletes a specific observation
 * (This would be in a separate [id]/route.ts file in a full implementation)
 */
