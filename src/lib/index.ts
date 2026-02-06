/**
 * Barrel exports for src/lib
 *
 * Minimal version - import directly from modules for full API
 * This file only exports commonly used functions and types
 */

// Design Tokens (most commonly used)
export type { SeriesColorTheme, ContainerWidth, HeadingVariant } from './design-tokens.js';
export { SPACING, TYPOGRAPHY, SEMANTIC_COLORS, CONTAINER_WIDTHS } from './design-tokens.js';

// Metadata
export { createPageMetadata, createArticlePageMetadata, createArchivePageMetadata } from './metadata.js';

// Utils
export { cn, ensureAbsoluteUrl, formatNumber } from './utils.js';

// Site Config
export type { SiteConfig } from './site-config.js';
export { SITE_URL, SITE_TITLE, AUTHOR_NAME } from './site-config.js';

// Storage
export type { StorageAdapter } from './storage-adapter.js';
export { LocalStorageAdapter, ApiStorageAdapter, createStorageAdapter } from './storage-adapter.js';

// Navigation
export { PRIMARY_NAV_LINKS, SECONDARY_NAV_LINKS } from './nav-links.js';

/**
 * NOTE: For all other exports, import directly from the module:
 * 
 * import { specificFunction } from '@/lib/module-name';
 * 
 * This avoids barrel export complexity and improves tree-shaking.
 */
