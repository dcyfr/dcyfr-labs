# Testing Quick Reference

## Running Tests

| Command | Description |
|---------|-------------|
| `npm test` | Run all unit tests in watch mode |
| `npm run test:unit` | Run unit tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Open Vitest UI |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Open Playwright UI |
| `npm run test:e2e:debug` | Debug E2E tests |
| `npm run test:ci` | Run all tests (CI mode) |

## Test File Naming

| Pattern | Location | Purpose |
|---------|----------|---------|
| `*.test.ts` | `src/__tests__/lib/` | Unit tests for utilities |
| `*.test.tsx` | `src/__tests__/components/` | Component tests |
| `*.test.ts` | `tests/integration/` | Integration tests |
| `*.spec.ts` | `e2e/` | E2E tests |

## Common Patterns

### Unit Test Template

```typescript
import { describe, it, expect } from 'vitest'
import { myFunction } from '@/lib/my-file'

describe('myFunction', () => {
  it('should do something', () => {
    expect(myFunction('input')).toBe('output')
  })
})
```

### Component Test Template

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyComponent } from '@/components/my-component'

describe('MyComponent', () => {
  it('should render', () => {
    render(<MyComponent />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

### E2E Test Template

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should work correctly', async ({ page }) => {
    await page.goto('/page')
    await expect(page.locator('h1')).toBeVisible()
  })
})
```

## Useful Queries (Testing Library)

```typescript
// Preferred (accessibility-friendly)
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Email')
screen.getByText(/welcome/i)

// Fallback
screen.getByTestId('my-element')

// Assertions
expect(element).toBeInTheDocument()
expect(element).toBeVisible()
expect(element).toHaveTextContent('Hello')
expect(element).toHaveAttribute('href', '/link')
```

## Playwright Selectors

```typescript
// Preferred
page.getByRole('button', { name: /submit/i })
page.getByLabel('Email')
page.getByText('Welcome')

// CSS selectors
page.locator('[data-testid="my-element"]')
page.locator('.my-class')

// Actions
await page.click('button')
await page.fill('input', 'text')
await page.selectOption('select', 'value')
await page.check('checkbox')

// Assertions
await expect(page).toHaveURL('/expected-url')
await expect(page.locator('h1')).toBeVisible()
await expect(page.locator('h1')).toContainText('Hello')
```

## Mocking with Vitest

```typescript
import { vi } from 'vitest'

// Mock a module
vi.mock('@/lib/api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'mock' }))
}))

// Mock a function
const mockFn = vi.fn()
mockFn.mockReturnValue('result')
mockFn.mockResolvedValue('async result')

// Check calls
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith('arg')
expect(mockFn).toHaveBeenCalledTimes(1)
```

## MSW (Mock Service Worker)

```typescript
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const server = setupServer(
  http.get('/api/data', () => {
    return HttpResponse.json({ data: 'mock' })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## Coverage Commands

```bash
# Generate coverage
npm run test:coverage

# View HTML report
open coverage/index.html

# Check specific file
npm run test:coverage -- src/lib/blog.ts
```

## Debugging

### VS Code Debugger

1. Set breakpoint in test file
2. Click "Debug" icon next to test
3. Inspect variables in debug panel

### Console Logging

```typescript
import { screen } from '@testing-library/react'

// Debug DOM
screen.debug()

// Log specific element
console.log(screen.getByRole('button').outerHTML)
```

### Playwright Debug Mode

```bash
# Run with debug UI
npm run test:e2e:debug

# Run specific test
npx playwright test e2e/homepage.spec.ts --debug
```

## Common Issues

### "Cannot find module '@/...'"

**Fix:** Check `vitest.config.ts` has path alias configured:

```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### "TypeError: Cannot read properties of undefined"

**Fix:** Ensure mocks are set up before test runs:

```typescript
beforeEach(() => {
  vi.clearAllMocks()
  // Set up mocks here
})
```

### E2E Test Timeout

**Fix:** Increase timeout or mark as slow:

```typescript
test('slow test', async ({ page }) => {
  test.slow() // 3x timeout
  // or
  test.setTimeout(60000) // 60 seconds
})
```

## VS Code Extensions

Install these for the best testing experience:

1. **Vitest** (`vitest.explorer`) - Inline test runner
2. **Playwright Test** (`ms-playwright.playwright`) - E2E test UI
3. **Error Lens** (`usernamehw.errorlens`) - Inline errors

## Next Steps

- See `/docs/testing/README.md` for full documentation
- Check `/tests/setup/` for test utilities
- Browse `/e2e/` for E2E test examples
