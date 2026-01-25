---
applyTo: "**/*.{test,spec}.{ts,tsx}"
---

# Test File Standards for dcyfr-labs

When writing test files, follow these patterns to ensure consistency, maintainability, and comprehensive coverage.

## Test Naming & Organization

### File Naming
```
✅ CORRECT:
- src/components/__tests__/Card.test.tsx
- src/lib/__tests__/utils.test.ts
- tests/e2e/homepage.spec.ts

❌ WRONG:
- CardTest.tsx (wrong extension)
- src/tests/Card.tsx (wrong location)
- card-test.ts (wrong pattern)
```

### Test Suite Organization
```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MyComponent } from "@/components/my";

describe("MyComponent", () => {
  // Setup
  beforeEach(() => {
    // Reset state before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  // Grouped related tests
  describe("Rendering", () => {
    it("renders with correct heading", () => {
      render(<MyComponent title="Test" />);
      expect(screen.getByRole("heading", { name: "Test" })).toBeInTheDocument();
    });

    it("applies correct CSS class", () => {
      const { container } = render(<MyComponent variant="primary" />);
      expect(container.querySelector(".primary")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("calls onClick handler when clicked", () => {
      const handler = vi.fn();
      render(<MyComponent onClick={handler} />);
      screen.getByRole("button").click();
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("handles form submission", async () => {
      render(<MyComponent />);
      screen.getByRole("textbox").setValue("input");
      screen.getByRole("button", { name: "Submit" }).click();
      // Assert results
    });
  });

  describe("Edge Cases", () => {
    it("handles empty data gracefully", () => {
      render(<MyComponent items={[]} />);
      expect(screen.getByText("No items found")).toBeInTheDocument();
    });

    it("handles null props without crashing", () => {
      expect(() => render(<MyComponent data={null} />)).not.toThrow();
    });
  });
});
```

## What to Test

### ✅ Test These
- **Logic**: Calculations, transformations, conditionals
- **User interactions**: Clicks, form submissions, keyboard input
- **State changes**: Component state updates
- **API integration**: Data fetching, error handling
- **Accessibility**: Focus management, keyboard navigation, ARIA
- **Edge cases**: Empty data, null values, errors

### ❌ Don't Test These
- Pure HTML rendering (no logic)
- CSS styling (use visual tests)
- Third-party library behavior
- Trivial wrappers with no logic
- Import statements

### Example Decisions
```typescript
// ✅ TEST - Has logic
function getDiscountedPrice(price: number, discount: number): number {
  return Math.max(0, price - (price * discount / 100));
}

// ❌ DON'T TEST - Pure presentational
function Badge({ label }: { label: string }) {
  return <span className="badge">{label}</span>;
}

// ✅ TEST - Has conditional logic
function Card({ title, isActive }: Props) {
  return (
    <div className={isActive ? "active" : "inactive"}>
      {title}
    </div>
  );
}
```

## Test Patterns

### React Component Tests
```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MyComponent } from "@/components/my";

describe("MyComponent", () => {
  it("displays user input in real-time", async () => {
    render(<MyComponent />);

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "hello world");

    expect(input).toHaveValue("hello world");
  });

  it("displays loading state while fetching", async () => {
    render(<MyComponent />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for data to load
    await screen.findByText("Data loaded");
  });
});
```

### Function/Utility Tests
```typescript
import { describe, it, expect } from "vitest";
import { formatDate, calculateAge } from "@/lib/utils";

describe("formatDate", () => {
  it("formats ISO date to readable string", () => {
    const result = formatDate("2026-01-24");
    expect(result).toBe("January 24, 2026");
  });

  it("handles invalid dates gracefully", () => {
    expect(() => formatDate("invalid")).not.toThrow();
  });
});
```

### API Route Tests
```typescript
import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/posts/route";
import { NextRequest } from "next/server";

describe("POST /api/posts", () => {
  it("validates required fields", async () => {
    const request = new NextRequest("http://localhost:3000/api/posts", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns 202 for valid input", async () => {
    const request = new NextRequest("http://localhost:3000/api/posts", {
      method: "POST",
      body: JSON.stringify({ title: "New Post", slug: "new-post" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(202);
  });
});
```

### Mock Patterns
```typescript
import { vi } from "vitest";

describe("Data Fetching", () => {
  it("fetches and displays data", async () => {
    // Mock fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ id: 1, title: "Post" }),
      })
    );

    render(<PostList />);

    await screen.findByText("Post");
    expect(global.fetch).toHaveBeenCalledWith("/api/posts");
  });

  it("handles fetch errors", async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error("Network error"))
    );

    render(<PostList />);

    await screen.findByText("Error loading posts");
  });
});
```

### Accessibility Testing
```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Accessibility", () => {
  it("supports keyboard navigation", async () => {
    render(<MyComponent />);

    const button = screen.getByRole("button", { name: "Open menu" });

    // Tab to button
    await userEvent.tab();
    expect(button).toHaveFocus();

    // Press Enter
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("menu")).toBeVisible();
  });

  it("has proper ARIA labels", () => {
    render(<MyComponent />);

    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
  });
});
```

## Best Practices

### Use Semantic Queries
```typescript
// ✅ BEST - Semantic role queries
screen.getByRole("button", { name: "Submit" });
screen.getByRole("heading", { level: 1 });
screen.getByLabelText("Email");

// ⚠️ OK - Text queries
screen.getByText("Click me");

// ❌ AVOID - CSS selectors
screen.getByTestId("submit-btn");
screen.querySelector(".btn-submit");
```

### Test User Behavior, Not Implementation
```typescript
// ✅ CORRECT - Tests user behavior
it("submits form when user clicks button", async () => {
  render(<Form />);
  await userEvent.click(screen.getByRole("button", { name: "Submit" }));
  expect(screen.getByText("Thank you!")).toBeInTheDocument();
});

// ❌ WRONG - Tests implementation details
it("calls handleSubmit prop", () => {
  const handleSubmit = vi.fn();
  render(<Form onSubmit={handleSubmit} />);
  fireEvent.click(document.querySelector(".btn"));
  expect(handleSubmit).toHaveBeenCalled();
});
```

### Avoid False Positives
```typescript
// ❌ RISKY - May pass even if logic is broken
it("renders component", () => {
  render(<MyComponent />);
  expect(document.body).toBeInTheDocument(); // Always true
});

// ✅ BETTER - Tests meaningful behavior
it("displays user name", () => {
  render(<MyComponent user={{ name: "John" }} />);
  expect(screen.getByText("John")).toBeInTheDocument();
});
```

## Strategic Test Skips

Only skip tests in these specific scenarios:

### 1. Component Refactors (Temporary)
```typescript
it.skip("renders old component structure", () => {
  // Temporarily skipped during refactor
  // Will be updated when refactor complete
});
```

### 2. CI Timing Issues
```typescript
it.skip("slow integration test", () => {
  // Runs locally but causes CI timeout
  // Use VITEST_SKIP_CI env var
});
```

### 3. Environment-Specific Tests
```typescript
it.skipIf(process.env.CI)("loads local file system", () => {
  // Only runs locally, not in CI
});
```

**Policy:** Skipped tests must be temporary. Create issue to re-enable.

**Reference:** [Testing Guide](../../docs/testing/README.md)

## Coverage Targets

### Minimum Coverage
- **Line coverage**: 80%+
- **Branch coverage**: 75%+
- **Function coverage**: 80%+

### Ideal Coverage
- **Line coverage**: 90%+
- **Branch coverage**: 85%+
- **Function coverage**: 90%+

### Critical Paths (100% target)
- Authentication logic
- Authorization checks
- Data validation
- Error handling
- Security-sensitive code

```bash
# Check coverage
npm run test:coverage

# Expected output: "Coverage reports generated"
```

## Test Data

### Use Fixtures
```typescript
// ❌ AVOID - Hardcoded test data in test file
const user = { id: 1, name: "John", email: "john@example.com" };

// ✅ BETTER - External fixture file
import { mockUser } from "@/__fixtures__/user";

describe("UserCard", () => {
  it("displays user info", () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByText("John")).toBeInTheDocument();
  });
});
```

### Mock External APIs
```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("/api/user", (req, res, ctx) => {
    return res(ctx.json({ id: 1, name: "John" }));
  })
);

beforeEach(() => server.listen());

describe("API calls", () => {
  it("fetches user data", async () => {
    const response = await fetch("/api/user");
    const data = await response.json();
    expect(data.name).toBe("John");
  });
});
```

### Production vs Test Data (MANDATORY)
Never commit production data; use environment checks:

```typescript
// ✅ CORRECT - Environment-aware
const testUsers =
  process.env.NODE_ENV === "test"
    ? [{ id: 1, name: "Test User" }]
    : realUserDatabase;

// ✅ CORRECT - Feature flags
const useMockData = process.env.VITEST_USE_MOCKS === "true";
```

## Validation Checklist

Before committing tests:

- [ ] All test files follow naming convention (`*.test.tsx` or `*.spec.ts`)
- [ ] Organized with `describe()` blocks for related tests
- [ ] Tests are focused (one assertion per test when possible)
- [ ] Uses semantic queries (`getByRole`, `getByLabelText`)
- [ ] Tests user behavior, not implementation
- [ ] Proper setup/teardown in `beforeEach`/`afterEach`
- [ ] Mocks used for external dependencies
- [ ] No skipped tests (unless temporary with issue link)
- [ ] Target ≥80% code coverage (ideally 90%+)
- [ ] All tests pass (`npm run test:run`)

## Related Documentation

- [Testing Guide](../../docs/testing/README.md) - Complete testing strategy
- [Quick Reference](../../docs/ai/quick-reference.md) - Common test imports
- [Playwright Tests](./playwright-tests.instructions.md) - E2E test patterns
- [Templates](../../docs/templates/TEST_SUITE.test.tsx.md) - Test template
