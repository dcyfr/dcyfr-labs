/**
 * Bot Detection Utilities
 *
 * Provides utilities for accessing Vercel BotD detection results
 * that are set by the proxy middleware.
 *
 * BotD detects automated traffic including:
 * - Search engine crawlers (Google, Bing, etc.)
 * - Social media bots (Facebook, Twitter, etc.)
 * - Monitoring services (UptimeRobot, Pingdom, etc.)
 * - Malicious bots and scrapers
 *
 * @see https://vercel.com/docs/botid/get-started
 */

import { headers } from "next/headers";

/**
 * Bot detection result from BotD library
 */
export interface BotDetectionResult {
  /** Whether the request is identified as a bot */
  isBot: boolean;
  /** Bot type if detected (e.g., 'good-bot', 'bad-bot', 'search-engine') */
  type?: string;
  /** Bot name if identified (e.g., 'Googlebot', 'Bingbot') */
  name?: string;
  /** Additional metadata about the detection */
  metadata?: Record<string, unknown>;
}

/**
 * Get bot detection results for the current request (Server Component)
 *
 * Returns bot detection information set by the proxy middleware.
 * Use this in Server Components to check if the current request is from a bot.
 *
 * @returns Bot detection result or null if not available
 *
 * @example
 * ```tsx
 * import { getBotDetection } from '@/lib/bot-detection';
 *
 * export default async function Page() {
 *   const botInfo = await getBotDetection();
 *
 *   if (botInfo?.isBot) {
 *     console.log('Bot detected:', botInfo.name);
 *     // Serve simplified content for bots
 *   }
 *
 *   return <div>Content</div>;
 * }
 * ```
 */
export async function getBotDetection(): Promise<BotDetectionResult | null> {
  try {
    const headersList = await headers();
    const botdHeader = headersList.get("x-botd");

    if (!botdHeader) {
      return null;
    }

    return JSON.parse(botdHeader) as BotDetectionResult;
  } catch (error) {
    console.warn("[BotD] Failed to parse bot detection header:", error);
    return null;
  }
}

/**
 * Check if the current request is from a bot (Server Component)
 *
 * Simplified helper that returns a boolean indicating bot status.
 *
 * @returns True if request is from a bot, false otherwise
 *
 * @example
 * ```tsx
 * import { isBot } from '@/lib/bot-detection';
 *
 * export default async function Page() {
 *   const botRequest = await isBot();
 *
 *   if (botRequest) {
 *     // Skip analytics tracking
 *     // Serve cached content
 *     // Simplify dynamic features
 *   }
 *
 *   return <div>Content</div>;
 * }
 * ```
 */
export async function isBot(): Promise<boolean> {
  const detection = await getBotDetection();
  return detection?.isBot ?? false;
}

/**
 * Check if the current request is from a good bot (search engines, etc.)
 *
 * Good bots are legitimate crawlers from search engines, social media
 * platforms, and monitoring services that respect robots.txt.
 *
 * @returns True if request is from a verified good bot
 *
 * @example
 * ```tsx
 * import { isGoodBot } from '@/lib/bot-detection';
 *
 * export default async function Page() {
 *   const goodBot = await isGoodBot();
 *
 *   if (goodBot) {
 *     // Allow full access
 *     // Include structured data
 *     // Don't rate limit
 *   }
 *
 *   return <div>Content</div>;
 * }
 * ```
 */
export async function isGoodBot(): Promise<boolean> {
  const detection = await getBotDetection();
  return detection?.isBot === true && detection?.type === "good-bot";
}

/**
 * Check if the current request is from a search engine crawler
 *
 * Specifically identifies major search engine bots (Google, Bing, etc.)
 * for SEO-specific handling.
 *
 * @returns True if request is from a search engine crawler
 *
 * @example
 * ```tsx
 * import { isSearchEngine } from '@/lib/bot-detection';
 *
 * export default async function Page() {
 *   const searchBot = await isSearchEngine();
 *
 *   if (searchBot) {
 *     // Ensure full SSR content
 *     // Include comprehensive metadata
 *     // Optimize for SEO
 *   }
 *
 *   return <div>Content</div>;
 * }
 * ```
 */
export async function isSearchEngine(): Promise<boolean> {
  const detection = await getBotDetection();
  return (
    detection?.isBot === true && detection?.type === "search-engine"
  );
}

/**
 * Get the name of the detected bot
 *
 * Returns the specific bot name if identified (e.g., 'Googlebot', 'Bingbot').
 *
 * @returns Bot name or null if not a bot or name not available
 *
 * @example
 * ```tsx
 * import { getBotName } from '@/lib/bot-detection';
 *
 * export default async function Page() {
 *   const botName = await getBotName();
 *
 *   if (botName) {
 *     console.log('Request from:', botName);
 *   }
 *
 *   return <div>Content</div>;
 * }
 * ```
 */
export async function getBotName(): Promise<string | null> {
  const detection = await getBotDetection();
  return detection?.name ?? null;
}

/**
 * Common bot types detected by BotD
 */
export const BOT_TYPES = {
  GOOD: "good-bot",
  BAD: "bad-bot",
  SEARCH_ENGINE: "search-engine",
  SOCIAL_MEDIA: "social-media",
  MONITORING: "monitoring",
  UNKNOWN: "unknown",
} as const;

/**
 * Common search engine bots
 */
export const SEARCH_ENGINE_BOTS = [
  "Googlebot",
  "Bingbot",
  "Slurp", // Yahoo
  "DuckDuckBot",
  "Baiduspider",
  "YandexBot",
  "Sogou",
] as const;

/**
 * Common good bots (social media, monitoring, etc.)
 */
export const GOOD_BOTS = [
  "facebookexternalhit", // Facebook
  "Twitterbot", // Twitter
  "LinkedInBot", // LinkedIn
  "Slackbot", // Slack
  "WhatsApp", // WhatsApp
  "TelegramBot", // Telegram
  "Discordbot", // Discord
  "uptimerobot", // UptimeRobot
  "pingdom", // Pingdom
  ...SEARCH_ENGINE_BOTS,
] as const;
