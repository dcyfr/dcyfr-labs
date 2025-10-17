import { createClient } from "redis";

const VIEW_KEY_PREFIX = "views:post:";
const redisUrl = process.env.REDIS_URL;

type RedisClient = ReturnType<typeof createClient>;

declare global {
  var __redisClient: RedisClient | undefined;
}

const formatKey = (slug: string) => `${VIEW_KEY_PREFIX}${slug}`;

async function getClient(): Promise<RedisClient | null> {
  if (!redisUrl) return null;

  if (!globalThis.__redisClient) {
    const client = createClient({ url: redisUrl });
    client.on("error", (error) => {
      if (process.env.NODE_ENV !== "production") {
        console.error("Redis error", error);
      }
    });
    globalThis.__redisClient = client;
  }

  const client = globalThis.__redisClient;
  if (!client) return null;

  if (!client.isOpen) {
    await client.connect();
  }

  return client;
}

export async function incrementPostViews(slug: string): Promise<number | null> {
  const client = await getClient();
  if (!client) return null;
  try {
    return await client.incr(formatKey(slug));
  } catch {
    return null;
  }
}

export async function getPostViews(slug: string): Promise<number | null> {
  const client = await getClient();
  if (!client) return null;
  try {
    const value = await client.get(formatKey(slug));
    const parsed = value === null ? null : Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
