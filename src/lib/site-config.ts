// Centralized site configuration used across the app.
// Keep values here for easy updates across environments and build-time usage.

export const DOMAIN_DEV = "dcyfr.net";
export const DOMAIN_PREVIEW = "cyberdrew.vercel.app";
export const DOMAIN_PRODUCTION = "cyberdrew.dev";

export const AUTHOR_NAME = "Drew ✦";
export const AUTHOR_EMAIL = "drew@cyberdrew.dev";

export const SITE_TITLE = "Drew's Lab";
export const SITE_SHORT_TITLE = "Drew";
export const SITE_DESCRIPTION = "Hi, I'm Drew, a security architect and tinkerer with over five years of experience in information security, risk management, and incident response.";

// Choose the active domain/URL based on environment variables.
// Priority for SITE_URL:
// 1. NEXT_PUBLIC_SITE_URL (explicit full URL override)
// 2. NEXT_PUBLIC_SITE_DOMAIN (explicit domain override)
// 3. Vercel preview: DOMAIN_PREVIEW
// 4. NODE_ENV === 'development' => DOMAIN_DEV
// 5. default: DOMAIN_PRODUCTION
const envSiteUrl = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SITE_URL;
const envSiteDomain = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SITE_DOMAIN;
const vercelEnv = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_VERCEL_ENV;
const nodeEnv = typeof process !== 'undefined' && process.env?.NODE_ENV;

export const SITE_DOMAIN = ((): string => {
  if (envSiteDomain) return envSiteDomain;
  if (vercelEnv === 'preview') return DOMAIN_PREVIEW;
  if (nodeEnv === 'development') return DOMAIN_DEV;
  return DOMAIN_PRODUCTION;
})();

export const SITE_URL = ((): string => {
  if (envSiteUrl) return envSiteUrl;
  return `https://${SITE_DOMAIN}`;
})();

export const getOgImageUrl = (title?: string, description?: string): string => {
  const url = new URL("/opengraph-image", SITE_URL);
  if (title) url.searchParams.set("title", title);
  if (description) url.searchParams.set("description", description);
  return url.toString();
};

export const getTwitterImageUrl = (title?: string, description?: string): string => {
  const url = new URL("/twitter-image", SITE_URL);
  if (title) url.searchParams.set("title", title);
  if (description) url.searchParams.set("description", description);
  return url.toString();
};

// Explicit FROM_EMAIL constant to avoid split/join logic in other modules.
// Can be overridden with NEXT_PUBLIC_FROM_EMAIL at build/runtime if needed.
export const FROM_EMAIL =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_FROM_EMAIL) ||
  "contact@cyberdrew.dev";

const siteConfig = {
  DOMAIN_DEV,
  DOMAIN_PREVIEW,
  DOMAIN_PRODUCTION,
  SITE_DOMAIN,
  SITE_URL,
  AUTHOR_NAME,
  AUTHOR_EMAIL,
  FROM_EMAIL,
  SITE_TITLE,
  SITE_SHORT_TITLE,
  SITE_DESCRIPTION,
  getOgImageUrl,
  getTwitterImageUrl,
};

export default siteConfig;
