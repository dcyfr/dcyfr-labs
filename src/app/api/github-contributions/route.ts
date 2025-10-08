import { NextRequest, NextResponse } from 'next/server';
import { SITE_DOMAIN } from '@/lib/site-config';

interface ContributionDay {
  date: string;
  count: number;
}

interface ContributionResponse {
  contributions: ContributionDay[];
  source: string;
  totalContributions: number;
  warning?: string;
}

// Security: Only allow fetching data for the hardcoded portfolio owner
const ALLOWED_USERNAME = 'dcyfr';

// Rate limiting configuration (in-memory, suitable for serverless)
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// Server-side cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes server-side cache
let cachedData: { data: ContributionResponse; timestamp: number } | null = null;

/**
 * Check if the request is rate limited
 */
function checkRateLimit(identifier: string): { allowed: boolean; resetAt?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // Clean up expired entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetAt < now) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record || record.resetAt < now) {
    // New window
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, resetAt: record.resetAt };
  }

  record.count++;
  return { allowed: true };
}

/**
 * Get client identifier for rate limiting
 */
function getClientIdentifier(request: NextRequest): string {
  // Try multiple headers for IP (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  const ip = cfConnectingIp || realIp || forwarded?.split(',')[0] || 'unknown';
  return ip;
}

/**
 * Validate username to prevent injection attacks
 */
function isValidUsername(username: string): boolean {
  // GitHub usernames can only contain alphanumeric characters and hyphens
  // Maximum length is 39 characters
  return /^[a-zA-Z0-9-]{1,39}$/.test(username);
}

/**
 * API route to fetch GitHub contribution data.
 * 
 * Security features:
 * - Rate limiting (10 requests/minute per IP)
 * - Username restricted to portfolio owner
 * - Input validation and sanitization
 * - Server-side caching (5 minutes)
 * - Graceful error handling
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');

  // Validate username parameter
  if (!username) {
    return NextResponse.json(
      { error: 'Username parameter is required' },
      { status: 400 }
    );
  }

  // Input validation: Check for valid GitHub username format
  if (!isValidUsername(username)) {
    return NextResponse.json(
      { error: 'Invalid username format' },
      { status: 400 }
    );
  }

  // Security: Only allow the hardcoded username
  if (username !== ALLOWED_USERNAME) {
    return NextResponse.json(
      { error: 'Unauthorized: This endpoint only serves data for the portfolio owner' },
      { status: 403 }
    );
  }

  // Rate limiting check
  const clientId = getClientIdentifier(request);
  const rateLimitResult = checkRateLimit(clientId);

  if (!rateLimitResult.allowed) {
    const retryAfter = rateLimitResult.resetAt 
      ? Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)
      : 60;

    return NextResponse.json(
      { 
        error: 'Rate limit exceeded. Please try again later.',
        retryAfter,
      },
      { 
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetAt?.toString() || '',
        },
      }
    );
  }

  // Check server-side cache first
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return NextResponse.json({
      ...cachedData.data,
      source: 'server-cache',
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Cache-Status': 'HIT',
      },
    });
  }

  try {
    // Try fetching from GitHub's GraphQL API
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.GITHUB_TOKEN 
          ? `Bearer ${process.env.GITHUB_TOKEN}` 
          : '',
  'User-Agent': `${SITE_DOMAIN}-portfolio`,
      },
      body: JSON.stringify({
        query: `
          query($username: String!) {
            user(login: $username) {
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { username },
      }),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    // Check for GraphQL errors
    if (data.errors) {
      console.error('GitHub GraphQL errors:', data.errors);
      throw new Error('GitHub GraphQL query failed');
    }

    if (!data.data?.user?.contributionsCollection?.contributionCalendar) {
      throw new Error('Invalid GitHub API response structure');
    }

    const calendar = data.data.user.contributionsCollection.contributionCalendar;
    
    // Transform the data
    const contributions: ContributionDay[] = calendar.weeks.flatMap(
      (week: { contributionDays: Array<{ date: string; contributionCount: number }> }) =>
        week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
        }))
    );

    const result: ContributionResponse = {
      contributions,
      source: 'github-api',
      totalContributions: calendar.totalContributions,
    };

    // Add warning if no token is used (rate limits apply)
    if (!process.env.GITHUB_TOKEN) {
      result.warning = 'Using unauthenticated GitHub API (subject to rate limits)';
    }

    // Cache the successful response
    cachedData = {
      data: result,
      timestamp: Date.now(),
    };

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Cache-Status': 'MISS',
        'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);

    // Return fallback data instead of an error
    const fallbackData = generateFallbackData();
    
    const fallbackResponse: ContributionResponse = {
      contributions: fallbackData,
      source: 'fallback',
      totalContributions: fallbackData.reduce((sum, day) => sum + day.count, 0),
      warning: 'Unable to fetch live data from GitHub. Displaying sample data.',
    };

    // Cache fallback data for a shorter duration
    cachedData = {
      data: fallbackResponse,
      timestamp: Date.now() - (CACHE_DURATION - 60000), // Cache for only 1 minute
    };

    return NextResponse.json(fallbackResponse, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'X-Cache-Status': 'FALLBACK',
      },
    });
  }
}

/**
 * Generate fallback contribution data for the past year
 * Creates a realistic-looking pattern with varying activity levels
 */
function generateFallbackData(): ContributionDay[] {
  const contributions: ContributionDay[] = [];
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setFullYear(startDate.getFullYear() - 1);

  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayOfWeek = currentDate.getDay();
    
    // Create a realistic pattern:
    // - Less activity on weekends
    // - Random variation throughout the week
    // - Some periods with no activity
    let count = 0;
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Weekend: 30% chance of activity
      count = Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0;
    } else {
      // Weekday: 70% chance of activity
      count = Math.random() > 0.3 ? Math.floor(Math.random() * 12) : 0;
    }

    contributions.push({
      date: dateStr,
      count,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return contributions;
}
