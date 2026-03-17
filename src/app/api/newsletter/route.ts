import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp, createRateLimitHeaders } from '@/lib/rate-limit';
import { RATE_LIMITS } from '@/lib/api/api-guardrails';
import { inngest } from '@/inngest/client';

const RATE_LIMIT_CONFIG = {
  limit: RATE_LIMITS.newsletter.requestsPerMinute,
  windowInSeconds: 60,
  failClosed: true,
};

function validateEmail(email: string): boolean {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) return false;

  const parts = email.split('@');
  if (parts.length !== 2) return false;

  const tld = parts[1].split('.').pop();
  if (!tld || tld.length < 2) return false;
  if (email.length > 254) return false;

  return true;
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await rateLimit(clientIp, RATE_LIMIT_CONFIG);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          ...createRateLimitHeaders(rateLimitResult),
          'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || !('email' in body)) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const email = (body as Record<string, unknown>).email;
  if (typeof email !== 'string' || !email.trim()) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const trimmedEmail = email.trim().slice(0, 254);
  if (!validateEmail(trimmedEmail)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  try {
    await inngest.send({
      name: 'newsletter/subscribe.submitted',
      data: {
        email: trimmedEmail,
        subscribedAt: new Date().toISOString(),
        ip: clientIp,
      },
    });

    console.warn('[Newsletter API] Subscription queued:', {
      emailDomain: trimmedEmail.split('@')[1] || 'unknown',
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: 'Thanks for subscribing! Check your email to confirm.' },
      { status: 200, headers: createRateLimitHeaders(rateLimitResult) }
    );
  } catch (inngestError) {
    console.error(
      '[Newsletter API] Failed to queue subscription:',
      inngestError instanceof Error ? inngestError.message : String(inngestError)
    );
    return NextResponse.json(
      { error: 'Failed to process your subscription. Please try again later.' },
      { status: 500 }
    );
  }
}
