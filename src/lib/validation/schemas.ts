/**
 * @file Centralized validation schemas (Zod)
 *
 * Shared Zod schemas for API request validation across dcyfr-labs routes.
 * Import individual schemas or use the validation middleware in ./middleware.ts.
 *
 * @module lib/validation/schemas
 */

import { z } from 'zod';

// ─── Primitive Schemas ──────────────────────────────────────────────────────

/**
 * Valid email address (RFC 5321, max 254 chars)
 */
export const emailSchema = z.string()
  .email('Invalid email address')
  .max(254, 'Email too long');

/**
 * URL-safe slug: lowercase letters, numbers, hyphens
 */
export const slugSchema = z.string()
  .regex(/^[a-z0-9-]+$/, 'Invalid slug: use lowercase letters, numbers, and hyphens')
  .min(1, 'Slug is required')
  .max(200, 'Slug too long');

/**
 * URL with max length cap
 */
export const urlSchema = z.string()
  .url('Invalid URL')
  .max(2048, 'URL too long');

/**
 * Safe string — rejects common XSS/injection patterns
 */
export const safeStringSchema = z.string()
  .max(1000, 'String too long')
  .refine(
    (val) => !/<script[\s>]|javascript:|onerror=|onload=/i.test(val),
    'Potentially unsafe content detected'
  );

/**
 * Positive integer
 */
export const positiveIntSchema = z.number()
  .int('Must be an integer')
  .positive('Must be positive');

/**
 * UUID v4
 */
export const uuidSchema = z.string()
  .uuid('Must be a valid UUID');

// ─── Domain-Specific Schemas ────────────────────────────────────────────────

/**
 * Contact form fields
 */
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .refine(
      (val) => !/<script[\s>]|javascript:/i.test(val),
      'Potentially unsafe content detected'
    ),
  email: emailSchema,
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message too long'),
  role: z.string().max(200).optional(),
  website: z.string().max(200).optional(), // Honeypot
});

/**
 * Engagement request (like / bookmark)
 */
export const engagementRequestSchema = z.object({
  slug: slugSchema,
  contentType: z.enum(['post', 'project', 'activity']).describe(
    'contentType must be post, project, or activity'
  ),
  action: z.enum(['like', 'unlike', 'bookmark', 'unbookmark']).describe(
    'action must be like, unlike, bookmark, or unbookmark'
  ),
});

/**
 * View-tracking request
 */
export const viewRequestSchema = z.object({
  postId: slugSchema,
  sessionId: uuidSchema,
  timeOnPage: z.number()
    .int('timeOnPage must be an integer')
    .min(0, 'timeOnPage must not be negative'),
  isVisible: z.boolean(),
});

/**
 * Referral analytics request
 */
export const analyticsReferralSchema = z.object({
  postId: z.string().min(1, 'postId is required').max(200, 'postId too long'),
  sessionId: z.string().min(1, 'sessionId is required').max(200, 'sessionId too long'),
  platform: safeStringSchema,
  referrer: z.string().max(2048).optional().default(''),
  utmSource: safeStringSchema.optional(),
  utmMedium: safeStringSchema.optional(),
  utmCampaign: safeStringSchema.optional(),
  utmContent: safeStringSchema.optional(),
});

/**
 * DEV.to social analytics refresh request
 */
export const devToAnalyticsSchema = z.object({
  postId: z.string()
    .min(1, 'postId is required')
    .max(200, 'postId too long')
    .refine(
      (val) => !/<|>|&/.test(val),
      'postId contains invalid characters'
    ),
  devSlug: z.string()
    .min(1, 'devSlug is required')
    .max(200, 'devSlug too long')
    .regex(/^[a-z0-9-]+$/, 'devSlug must be a URL-safe slug'),
  username: z.string()
    .max(50, 'username too long')
    .regex(/^[a-z0-9-]+$/, 'username must be a URL-safe slug')
    .optional()
    .default('dcyfr'),
  forceRefresh: z.boolean().optional().default(false),
});

/**
 * Axiom telemetry event (single event)
 */
export const axiomEventSchema = z.object({
  _time: z.string().optional(),
  level: z.enum(['debug', 'info', 'warn', 'error']).optional(),
}).passthrough(); // Allow additional telemetry fields

/**
 * Axiom batch request body
 */
export const axiomBatchSchema = z.array(axiomEventSchema).max(100, 'Too many events in batch');

/**
 * Memory add request
 */
export const memoryAddSchema = z.object({
  userId: z.string().min(1, 'userId is required').max(200),
  message: z.string()
    .min(1, 'message is required')
    .max(10000, 'message too long'),
  context: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Memory search request
 */
export const memorySearchSchema = z.object({
  userId: z.string().min(1, 'userId is required').max(200),
  query: z.string()
    .min(1, 'query is required')
    .max(1000, 'query too long'),
  limit: z.number()
    .int('limit must be an integer')
    .min(1, 'limit must be at least 1')
    .max(10, 'limit cannot exceed 10')
    .optional()
    .default(3),
});

/**
 * IndexNow bulk submission request
 */
export const indexNowBulkSchema = z.object({
  types: z.array(
    z.enum(['posts', 'projects', 'static'])
  ).min(1, 'At least one type is required').optional(),
});
