import { kv } from "@vercel/kv";

const VIEW_KEY_PREFIX = "views:post:";

const kvConfigured = Boolean(
  process.env.KV_REST_API_URL &&
  process.env.KV_REST_API_TOKEN &&
  process.env.KV_REST_API_READ_ONLY_TOKEN
);

const formatKey = (slug: string) => `${VIEW_KEY_PREFIX}${slug}`;

export async function incrementPostViews(slug: string): Promise<number | null> {
  if (!kvConfigured) return null;
  try {
    return await kv.incr(formatKey(slug));
  } catch {
    return null;
  }
}

export async function getPostViews(slug: string): Promise<number | null> {
  if (!kvConfigured) return null;
  try {
    const value = await kv.get<number>(formatKey(slug));
    return typeof value === "number" ? value : null;
  } catch {
    return null;
  }
}
