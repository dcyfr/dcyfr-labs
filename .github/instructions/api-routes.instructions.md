---
applyTo: "src/app/api/**/*.ts"
---

# API Route Standards for dcyfr-labs

When creating API routes in this repository, follow the Validate → Queue → Respond pattern and enforce strict input validation.

## API Pattern: Validate → Queue → Respond

All API routes must follow this three-step pattern:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/lib/inngest";

export async function POST(request: NextRequest) {
  try {
    // STEP 1: VALIDATE
    const data = await request.json();

    // Validate input schema
    if (!data.title || typeof data.title !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid title" },
        { status: 400 }
      );
    }

    if (data.title.length < 3 || data.title.length > 200) {
      return NextResponse.json(
        { error: "Title must be 3-200 characters" },
        { status: 400 }
      );
    }

    // STEP 2: QUEUE (send to Inngest for async processing)
    await inngest.send({
      name: "domain/event.created",
      data: {
        id: crypto.randomUUID(),
        title: data.title,
        timestamp: new Date().toISOString(),
      },
    });

    // STEP 3: RESPOND (return immediately)
    return NextResponse.json(
      { success: true, message: "Processing started" },
      { status: 202 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

**Key Benefits:**
- ✅ Responds to client immediately (better UX)
- ✅ Heavy processing happens in background (Inngest)
- ✅ Validation prevents invalid data from entering queue
- ✅ Separates concerns (validation, processing, response)

**Reference:** [API Patterns](../../docs/ai/best-practices.md)

## Input Validation (MANDATORY)

### Allowlist Validation (Security)
Always validate inputs with explicit allowlists:

```typescript
// ✅ CORRECT - Allowlist pattern for commands/identifiers
const validCommands = /^[a-z0-9._-]+$/i;
if (!validCommands.test(command)) {
  return NextResponse.json(
    { error: "Invalid command format" },
    { status: 400 }
  );
}

// ✅ CORRECT - Specific enum check
const validStatuses = ["draft", "published", "archived"];
if (!validStatuses.includes(status)) {
  return NextResponse.json(
    { error: "Invalid status" },
    { status: 400 }
  );
}
```

### String Sanitization
Remove control characters and normalize input:

```typescript
// ✅ CORRECT - Multi-pass sanitization
function sanitizeInput(text: string): string {
  return text
    .replace(/[\x00-\x1F\x7F-\x9F]/g, "")  // Remove control chars
    .replace(/[\r\n\t]/g, " ")              // Normalize whitespace
    .replace(/\s+/g, " ")                   // Collapse spaces
    .trim()
    .substring(0, 1000);                    // Limit length
}
```

### Schema Validation
Validate request structure:

```typescript
// ✅ CORRECT - Schema validation with Zod
import { z } from "zod";

const createPostSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  content: z.string().min(10),
  tags: z.array(z.string()).max(10),
});

const validatedData = createPostSchema.parse(data);
```

## Inngest Integration

### When to Use Inngest
- ✅ Send emails / notifications
- ✅ Process large files
- ✅ Database migrations
- ✅ External API calls
- ✅ Analytics collection
- ✅ Any operation >100ms

### Inngest Function Pattern
```typescript
import { inngest } from "@/lib/inngest";

export const onPostCreated = inngest.createFunction(
  { id: "on-post-created" },
  { event: "blog/post.created" },
  async ({ event }) => {
    const { postId, title } = event.data;

    // Do async work here
    await db.post.update({
      where: { id: postId },
      data: { status: "processing" },
    });

    // Send notification
    await sendNotification({
      type: "post_published",
      postId,
    });

    return { success: true };
  }
);
```

**Reference:** [Inngest Patterns](../../docs/ai/dcyfr-inngest-patterns.md)

## Error Handling

### Status Codes
Use appropriate HTTP status codes:

```typescript
// ✅ Input validation failed
return NextResponse.json(
  { error: "Invalid request" },
  { status: 400 }
);

// ✅ Unauthorized
return NextResponse.json(
  { error: "Authentication required" },
  { status: 401 }
);

// ✅ Forbidden
return NextResponse.json(
  { error: "Access denied" },
  { status: 403 }
);

// ✅ Resource not found
return NextResponse.json(
  { error: "Post not found" },
  { status: 404 }
);

// ✅ Accepted (async processing)
return NextResponse.json(
  { success: true },
  { status: 202 }
);

// ✅ Server error
return NextResponse.json(
  { error: "Internal server error" },
  { status: 500 }
);
```

### Error Logging
Always log errors with context:

```typescript
try {
  // ... route logic
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";

  console.error("API error in POST /api/posts:", {
    message: errorMessage,
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
```

## Rate Limiting

### Basic Rate Limiting
Implement per-user rate limits:

```typescript
import { RateLimiter } from "@/lib/rate-limiter";

const limiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60000, // 1 minute
});

export async function POST(request: NextRequest) {
  const userId = request.headers.get("x-user-id");

  if (!limiter.isAllowed(userId)) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  // ... rest of logic
}
```

## Environment Variables

### Access Environment Variables
```typescript
// ✅ CORRECT - Read from process.env
const apiKey = process.env.EXTERNAL_API_KEY;
const env = process.env.NODE_ENV;

if (!apiKey) {
  throw new Error("EXTERNAL_API_KEY environment variable not set");
}
```

### Test Data Prevention (MANDATORY)
Never commit test/demo data to production:

```typescript
// ✅ CORRECT - Environment-aware with explicit warning
const isProduction =
  process.env.NODE_ENV === "production" ||
  process.env.VERCEL_ENV === "production";

const demoData = [/* ... */];

if (isProduction && !hasRealData) {
  console.error("❌ CRITICAL: Using demo data in production!");
  return NextResponse.json(
    { error: "Service temporarily unavailable" },
    { status: 503 }
  );
}

// Safe to use demoData in development/preview
```

**Reference:** [Test Data Prevention](../../docs/ai/enforcement/TEST_DATA_PREVENTION.md)

## CORS & Security Headers

### CORS Configuration
```typescript
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Allow specific origins
  const origin = request.headers.get("origin");
  if (origin === "https://example.com" || origin === "http://localhost:3000") {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}
```

### Security Headers
```typescript
// Always set security headers
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}
```

## Testing API Routes

### Test Pattern
```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "@/app/api/posts/route";
import { NextRequest } from "next/server";

describe("POST /api/posts", () => {
  it("rejects invalid input", async () => {
    const request = new NextRequest("http://localhost:3000/api/posts", {
      method: "POST",
      body: JSON.stringify({ title: "" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("queues valid input to Inngest", async () => {
    const request = new NextRequest("http://localhost:3000/api/posts", {
      method: "POST",
      body: JSON.stringify({ title: "New Post", slug: "new-post" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(202);
  });
});
```

## Response Format

### Success Response
```typescript
return NextResponse.json(
  {
    success: true,
    data: {
      id: "post-123",
      title: "My Post",
    },
    message: "Post created successfully",
  },
  { status: 201 }
);
```

### Error Response
```typescript
return NextResponse.json(
  {
    success: false,
    error: "Invalid input",
    details: {
      field: "title",
      message: "Title is required",
    },
  },
  { status: 400 }
);
```

## Validation Checklist

Before committing API routes:

- [ ] Follows Validate → Queue → Respond pattern
- [ ] Input validation uses allowlist patterns
- [ ] String inputs sanitized (no control characters)
- [ ] Schema validation implemented (Zod or similar)
- [ ] Appropriate HTTP status codes used
- [ ] Errors logged with full context
- [ ] Rate limiting implemented if needed
- [ ] Test data behind environment checks
- [ ] Tests written (input validation, success path)
- [ ] TypeScript compiles (0 errors)
- [ ] ESLint passes (0 errors)

## Related Documentation

- [API Patterns](../../docs/ai/best-practices.md) - Full API guide
- [Inngest Patterns](../../docs/ai/dcyfr-inngest-patterns.md) - Background job patterns
- [Test Data Prevention](../../docs/ai/enforcement/TEST_DATA_PREVENTION.md) - Safety guardrails
- [Testing Guide](../../docs/testing/README.md) - Test best practices
- [Quick Reference](../../docs/ai/quick-reference.md) - Common imports
