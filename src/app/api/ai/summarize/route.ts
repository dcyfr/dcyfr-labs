/**
 * AI Post Summarization Endpoint
 *
 * POST /api/ai/summarize
 *
 * Generates an AI-powered summary of a blog post. Accepts an optional
 * user-provided context string to guide the summary focus (e.g., "focus on
 * the security implications" or "explain for a non-technical audience").
 *
 * Request body:
 * {
 *   slug: string          - Post slug (e.g., "building-a-rag-pipeline")
 *   userContext?: string  - Optional context to guide summary focus (max 500 chars)
 * }
 *
 * Response (200):
 * {
 *   summary: string
 *   keyPoints: string[]
 *   readingTimeMinutes: number
 *   model: string
 * }
 *
 * Security:
 * - Rate limiting: 5 requests per minute per IP
 * - Slug validation (alphanumeric + hyphens only)
 * - Request size limits
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/blog.server';
import {
  research,
  isPerplexityConfigured,
} from '@/lib/perplexity';
import {
  rateLimit,
  getClientIp,
  createRateLimitHeaders,
} from '@/lib/rate-limit';
import { recordApiCall } from '@/lib/api/api-guardrails';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const RATE_LIMIT_CONFIG = {
  limit: 5,
  windowInSeconds: 60,
};

const MAX_CONTENT_CHARS = 8000;  // Truncate long posts to avoid token limits
const MAX_USER_CONTEXT_CHARS = 500;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SummarizeRequest {
  slug?: unknown;
  userContext?: unknown;
}

interface SummarizeResponse {
  summary: string;
  keyPoints: string[];
  readingTimeMinutes: number;
  model: string;
}

interface ErrorResponse {
  error: string;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function isValidSlug(slug: unknown): slug is string {
  if (typeof slug !== 'string' || slug.length === 0 || slug.length > 200) {
    return false;
  }
  // Allow only alphanumeric chars, hyphens, and forward slashes (for nested slugs)
  return /^[a-z0-9-/]+$/.test(slug);
}

function extractUserContext(
  raw: unknown
): { ok: true; value: string } | { ok: false; response: NextResponse<ErrorResponse> } {
  if (raw === undefined || raw === null) {
    return { ok: true, value: '' };
  }
  if (typeof raw !== 'string') {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'userContext must be a string if provided' },
        { status: 400 }
      ),
    };
  }
  return { ok: true, value: raw.slice(0, MAX_USER_CONTEXT_CHARS) };
}

function buildSummarizationPrompt(
  title: string,
  body: string,
  wasTruncated: boolean,
  userContext: string
): string {
  const focusInstruction = userContext
    ? `\n\nAdditional context from the reader: "${userContext}"\nPlease tailor the summary with this context in mind.`
    : '';

  return `You are a technical writing assistant. Summarize the following blog post in 3-5 sentences, then extract 3-5 key bullet points. Return your response as valid JSON in this exact format:
{
  "summary": "...",
  "keyPoints": ["...", "...", "..."]
}

Post title: ${title}
${wasTruncated ? '(Note: content truncated for length)\n' : ''}
Post content:
${body}${focusInstruction}`;
}

function parseAiResponse(content: string): { summary: string; keyPoints: string[] } {
  try {
    const jsonMatch = /\{[\s\S]*\}/.exec(content);
    if (!jsonMatch) throw new Error('No JSON found');
    const parsed = JSON.parse(jsonMatch[0]) as { summary: string; keyPoints: string[] };
    return {
      summary: parsed.summary,
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
    };
  } catch {
    return { summary: content.trim(), keyPoints: [] };
  }
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function POST(
  request: NextRequest
): Promise<NextResponse<SummarizeResponse | ErrorResponse>> {
  const clientIp = getClientIp(request);

  // Rate limiting
  const rateLimitResult = await rateLimit(
    `ai:summarize:${clientIp}`,
    RATE_LIMIT_CONFIG
  );
  const headers = createRateLimitHeaders(rateLimitResult);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded — please try again later' },
      { status: 429, headers }
    );
  }

  // Check AI service availability
  if (!isPerplexityConfigured()) {
    return NextResponse.json(
      { error: 'AI summarization service is not currently available' },
      { status: 503 }
    );
  }

  // Parse body
  let body: SummarizeRequest;
  try {
    body = (await request.json()) as SummarizeRequest;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body — expected JSON' },
      { status: 400 }
    );
  }

  // Validate slug
  if (!isValidSlug(body.slug)) {
    return NextResponse.json(
      { error: 'Invalid slug — must be a non-empty string using only a-z, 0-9, hyphens, and slashes' },
      { status: 400 }
    );
  }

  const slug = body.slug;

  // Validate and extract optional userContext
  const ctxResult = extractUserContext(body.userContext);
  if (!ctxResult.ok) return ctxResult.response;
  const userContext = ctxResult.value;

  // Look up the post
  const post = getPostBySlug(slug);
  if (!post) {
    return NextResponse.json(
      { error: `Post not found: ${slug}` },
      { status: 404 }
    );
  }

  // Truncate post body to avoid exceeding token limits
  const truncatedBody = post.body.slice(0, MAX_CONTENT_CHARS);
  const wasTruncated = post.body.length > MAX_CONTENT_CHARS;

  const prompt = buildSummarizationPrompt(post.title, truncatedBody, wasTruncated, userContext);

  try {
    // Track API usage
    await recordApiCall('perplexity', 'summarize');

    const result = await research([
      { role: 'user', content: prompt }
    ], {
      model: 'llama-3.1-sonar-small-128k-online',
      temperature: 0.3,
      max_tokens: 800,
    });

    const parsed = parseAiResponse(result.content);

    return NextResponse.json(
      {
        summary: parsed.summary,
        keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
        readingTimeMinutes: post.readingTime?.minutes ?? 0,
        model: 'llama-3.1-sonar-small-128k-online',
      },
      { status: 200, headers }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[AI Summarize] Error:', message);
    return NextResponse.json(
      { error: 'Failed to generate summary — please try again' },
      { status: 500, headers }
    );
  }
}
