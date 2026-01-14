import { http, HttpResponse } from 'msw'

/**
 * MSW (Mock Service Worker) handlers for API mocking in tests
 * 
 * These handlers intercept network requests during tests and return mock responses.
 * Useful for integration tests that need to mock external APIs and services.
 * 
 * @see https://mswjs.io/docs/
 * 
 * HANDLER CATEGORIES:
 * 1. Public APIs - GitHub, external services
 * 2. Internal APIs - /api/views, /api/analytics, etc.
 * 3. Database - Redis operations (mocked via API layer)
 * 4. Background Jobs - Inngest webhooks
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

/**
 * PUBLIC API HANDLERS
 * Mocks external services and public endpoints
 */
const publicApiHandlers = [
  // GitHub Contributions API (GraphQL)
  // Note: Actual endpoint removed for security, but handlers ready for integration
  http.post('https://api.github.com/graphql', () => {
    return HttpResponse.json({
      data: {
        user: {
          repositories: { totalCount: 42 },
          pinnedItems: {
            nodes: [
              {
                name: 'dcyfr-labs',
                description: 'Personal development lab',
                url: 'https://github.com/dcyfr/dcyfr-labs',
                stargazerCount: 10,
                forkCount: 2,
                primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
              },
            ],
          },
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: 500,
              weeks: Array.from({ length: 52 }, () => ({
                contributionDays: Array.from({ length: 7 }, (_, i) => ({
                  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  contributionCount: Math.floor(Math.random() * 10),
                })),
              })),
            },
          },
        },
      },
    })
  }),

  // Mock health check API
  http.get(`${BASE_URL}/api/health`, () => {
    return HttpResponse.json({ status: 'ok', timestamp: Date.now() })
  }),
]

/**
 * INTERNAL API HANDLERS - Analytics & Views
 * Mocks the analytics and views tracking endpoints
 */
const internalAnalyticsHandlers = [
  // Views API - Record post views
  http.post(`${BASE_URL}/api/views`, async (req) => {
    const body = await req.request.json().catch(() => ({}))
    return HttpResponse.json({
      success: true,
      viewId: 'view_' + Math.random().toString(36).slice(2),
      timestamp: Date.now(),
      cached: false,
    }, { status: 200 })
  }),

  // Analytics API - Get aggregated metrics
  http.get(`${BASE_URL}/api/analytics`, () => {
    return HttpResponse.json({
      views: { total: 1250, last24h: 45, trend: '+12%' },
      shares: { total: 89, last24h: 3, trend: '+5%' },
      comments: { total: 23, last24h: 1, trend: '-8%' },
      topPosts: [
        { id: 'post-1', views: 450, shares: 25 },
        { id: 'post-2', views: 380, shares: 18 },
      ],
      cached: true,
      cacheDuration: 300,
    }, { status: 200 })
  }),
]

/**
 * INTERNAL API HANDLERS - GitHub Contributions
 * Mocks GitHub contribution tracking (if re-enabled)
 */
const githubContributionsHandlers = [
  http.get(`${BASE_URL}/api/github-contributions`, () => {
    return HttpResponse.json({
      contributions: Array.from({ length: 365 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 10),
        level: Math.floor(Math.random() * 5),
      })),
      cached: true,
      username: 'dcyfr',
    }, { status: 200 })
  }),
]

/**
 * INTERNAL API HANDLERS - Contact & Forms
 * Mocks form submission endpoints
 */
const contactFormHandlers = [
  http.post(`${BASE_URL}/api/contact`, async () => {
    return HttpResponse.json({ 
      success: true,
      messageId: 'msg_' + Math.random().toString(36).slice(2),
      timestamp: Date.now(),
    }, { status: 200 })
  }),
]

/**
 * ERROR SCENARIO HANDLERS
 * Used for testing error handling in integration tests
 */
const errorHandlers = {
  // Rate limit exceeded (429)
  rateLimited: http.get(`${BASE_URL}/api/rate-limited`, () => {
    return HttpResponse.json(
      { error: 'Too Many Requests', retryAfter: 60 },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }),

  // Server error (500)
  serverError: http.get(`${BASE_URL}/api/error`, () => {
    return HttpResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }),

  // Not found (404)
  notFound: http.get(`${BASE_URL}/api/not-found`, () => {
    return HttpResponse.json(
      { error: 'Not Found' },
      { status: 404 }
    )
  }),
}

/**
 * MAIN HANDLERS EXPORT
 * Combine all handler categories
 * 
 * These are used in vitest.setup.ts with:
 * const server = setupServer(...handlers)
 */
export const handlers = [
  ...publicApiHandlers,
  ...internalAnalyticsHandlers,
  ...githubContributionsHandlers,
  ...contactFormHandlers,
]

/**
 * ERROR HANDLERS EXPORT
 * Use in individual tests with:
 * server.use(errorHandlers.rateLimited)
 * 
 * Example in test:
 * import { server } from '@/tests/msw-handlers'
 * import { errorHandlers } from '@/tests/msw-handlers'
 * 
 * test('handles rate limiting', async () => {
 *   server.use(errorHandlers.rateLimited)
 *   // test code that triggers rate limit
 * })
 */
export { errorHandlers }

/**
 * HANDLER ADDITIONS CHECKLIST FOR PHASE 2
 * 
 * Redis Handlers (needed for analytics tests):
 * - [ ] Mock Redis GET operations
 * - [ ] Mock Redis SET operations  
 * - [ ] Mock Redis DEL operations
 * - [ ] Mock cache expiration
 * 
 * Inngest Handlers (needed for background job tests):
 * - [ ] Mock Inngest webhook POST
 * - [ ] Mock job status updates
 * - [ ] Mock retry behavior
 * 
 * Performance Test Handlers:
 * - [ ] Add latency simulation
 * - [ ] Add response time tracking
 * - [ ] Add memory usage tracking
 */
