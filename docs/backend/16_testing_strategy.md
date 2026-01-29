# 16. TESTING STRATEGY

## 1. Mục đích

Tài liệu này định nghĩa:
- Testing strategy cho toàn bộ dự án
- Test types và coverage targets
- Testing tools và frameworks
- Best practices

---

## 2. Testing Philosophy

### 2.1. Testing Pyramid

```
        /\
       /  \      E2E Tests (10%)
      /----\     - Critical user flows
     /      \    - Slow, expensive
    /--------\   
   /   Inte-  \  Integration Tests (30%)
  /   gration  \ - API endpoints
 /     Tests    \- Database interactions
/----------------\
/  Unit Tests     \ Unit Tests (60%)
/   (Functions,    \- Business logic
/    Utilities)     \- Pure functions
/____________________\
```

### 2.2. Coverage Targets

| Layer                  | Target | Priority |
| ---------------------- | ------ | -------- |
| Backend business logic | 80%    | High     |
| Backend API routes     | 70%    | High     |
| Frontend components    | 60%    | Medium   |
| E2E critical flows     | 100%   | High     |

---

## 3. Backend Testing

### 3.1. Setup Testing Environment

**Install dependencies:**
```bash
cd backend
pnpm add -D vitest @vitest/ui @cloudflare/vitest-pool-workers
```

**vitest.config.ts:**
```typescript
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config'

export default defineWorkersConfig({
  test: {
    globals: true,
    environment: 'miniflare',
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.toml' }
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.test.ts', '**/types.ts', '**/index.ts']
    }
  }
})
```

**package.json scripts:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:ci": "vitest run"
  }
}
```

### 3.2. Unit Tests (Business Logic)

**Example: Statistics calculation**

**`src/utils/statistics.test.ts`:**
```typescript
import { describe, it, expect } from 'vitest'
import { calculateStreak, aggregateByCategory } from './statistics'

describe('calculateStreak', () => {
  it('should return 0 for empty deeds', () => {
    expect(calculateStreak([])).toBe(0)
  })
  
  it('should calculate consecutive days correctly', () => {
    const deeds = [
      { performedAt: Date.parse('2024-01-03') },
      { performedAt: Date.parse('2024-01-02') },
      { performedAt: Date.parse('2024-01-01') }
    ]
    expect(calculateStreak(deeds)).toBe(3)
  })
  
  it('should stop at gap', () => {
    const deeds = [
      { performedAt: Date.parse('2024-01-05') },
      { performedAt: Date.parse('2024-01-04') },
      // Gap: 2024-01-03 missing
      { performedAt: Date.parse('2024-01-02') },
      { performedAt: Date.parse('2024-01-01') }
    ]
    expect(calculateStreak(deeds)).toBe(2) // Only 04 and 05
  })
  
  it('should handle timezone correctly', () => {
    // Test with different timezones
  })
})

describe('aggregateByCategory', () => {
  it('should group deeds by category', () => {
    const deeds = [
      { categoryId: 'cat_body' },
      { categoryId: 'cat_body' },
      { categoryId: 'cat_mind' }
    ]
    
    const result = aggregateByCategory(deeds)
    expect(result).toEqual({
      cat_body: 2,
      cat_mind: 1
    })
  })
})
```

### 3.3. Integration Tests (API Endpoints)

**`src/routes/deeds.test.ts`:**
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test'
import app from '../index'

describe('POST /deeds', () => {
  let authToken: string
  let testUserId: string
  
  beforeAll(async () => {
    // Setup: Create test user and get token
    const user = await createTestUser(env.DB)
    testUserId = user.id
    authToken = await generateTestJWT(user.id, user.email, env.JWT_SECRET)
  })
  
  afterAll(async () => {
    // Cleanup: Delete test user
    await cleanupTestUser(env.DB, testUserId)
  })
  
  it('should create deed successfully', async () => {
    const response = await app.request('/api/v1/deeds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        categoryId: 'cat_body',
        description: 'Test deed',
        performedAt: Date.now(),
        isPrivate: true
      })
    }, env, createExecutionContext())
    
    expect(response.status).toBe(201)
    const body = await response.json()
    expect(body.id).toBeDefined()
  })
  
  it('should return 400 when categoryId is missing', async () => {
    const response = await app.request('/api/v1/deeds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        description: 'Test deed',
        performedAt: Date.now()
      })
    }, env, createExecutionContext())
    
    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.error.code).toBe('VALIDATION_ERROR')
  })
  
  it('should return 401 when no token provided', async () => {
    const response = await app.request('/api/v1/deeds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        categoryId: 'cat_body',
        performedAt: Date.now()
      })
    }, env, createExecutionContext())
    
    expect(response.status).toBe(401)
  })
  
  it('should return 403 when trying to update another user deed', async () => {
    // Create deed by another user
    const otherUser = await createTestUser(env.DB)
    const otherDeed = await createTestDeed(env.DB, otherUser.id)
    
    const response = await app.request(`/api/v1/deeds/${otherDeed.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` // current user token
      },
      body: JSON.stringify({
        description: 'Trying to update other user deed'
      })
    }, env, createExecutionContext())
    
    expect(response.status).toBe(403)
    
    // Cleanup
    await cleanupTestUser(env.DB, otherUser.id)
  })
})

describe('GET /deeds', () => {
  let authToken: string
  let testUserId: string
  
  beforeAll(async () => {
    const user = await createTestUser(env.DB)
    testUserId = user.id
    authToken = await generateTestJWT(user.id, user.email, env.JWT_SECRET)
    
    // Create sample deeds
    await createTestDeed(env.DB, testUserId, { categoryId: 'cat_body' })
    await createTestDeed(env.DB, testUserId, { categoryId: 'cat_mind' })
  })
  
  afterAll(async () => {
    await cleanupTestUser(env.DB, testUserId)
  })
  
  it('should return user deeds', async () => {
    const response = await app.request('/api/v1/deeds', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }, env, createExecutionContext())
    
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.data).toHaveLength(2)
    expect(body.pagination).toBeDefined()
  })
  
  it('should filter by category', async () => {
    const response = await app.request('/api/v1/deeds?categoryId=cat_body', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }, env, createExecutionContext())
    
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.data).toHaveLength(1)
    expect(body.data[0].categoryId).toBe('cat_body')
  })
  
  it('should paginate correctly', async () => {
    // Create many deeds
    for (let i = 0; i < 25; i++) {
      await createTestDeed(env.DB, testUserId)
    }
    
    const response = await app.request('/api/v1/deeds?limit=10', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }, env, createExecutionContext())
    
    const body = await response.json()
    expect(body.data).toHaveLength(10)
    expect(body.pagination.hasMore).toBe(true)
    expect(body.pagination.nextCursor).toBeDefined()
  })
})
```

**Test utilities:**

**`src/test-utils/index.ts`:**
```typescript
import { D1Database } from '@cloudflare/workers-types'
import { v4 as uuid } from 'uuid'
import { SignJWT } from 'jose'

export async function createTestUser(db: D1Database, overrides?: any) {
  const id = uuid()
  const email = overrides?.email || `test-${id}@example.com`
  const displayName = overrides?.displayName || 'Test User'
  
  await db.prepare(`
    INSERT INTO users (id, email, display_name, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `).bind(id, email, displayName, Date.now(), Date.now()).run()
  
  return { id, email, displayName }
}

export async function cleanupTestUser(db: D1Database, userId: string) {
  // Foreign keys will cascade delete
  await db.prepare('DELETE FROM users WHERE id = ?').bind(userId).run()
}

export async function createTestDeed(db: D1Database, userId: string, overrides?: any) {
  const id = uuid()
  const categoryId = overrides?.categoryId || 'cat_body'
  const performedAt = overrides?.performedAt || Date.now()
  
  await db.prepare(`
    INSERT INTO good_deeds (id, user_id, category_id, performed_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(id, userId, categoryId, performedAt, Date.now(), Date.now()).run()
  
  return { id, userId, categoryId, performedAt }
}

export async function generateTestJWT(userId: string, email: string, secret: string) {
  const encoder = new TextEncoder()
  const jwt = await new SignJWT({ sub: userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(encoder.encode(secret))
  
  return jwt
}
```

---

## 4. Frontend Testing

### 4.1. Setup Testing Environment

**Install dependencies:**
```bash
cd frontend
pnpm add -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

**`src/test/setup.ts`:**
```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})
```

### 4.2. Component Tests

**`src/features/deeds/components/DeedCard.test.tsx`:**
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DeedCard } from './DeedCard'

describe('DeedCard', () => {
  const mockDeed = {
    id: 'deed_1',
    categoryId: 'cat_body',
    description: 'Helped neighbor',
    performedAt: Date.parse('2024-01-15'),
    category: {
      name: 'Thân thiện',
      iconKey: 'hand-heart'
    }
  }
  
  it('should render deed information', () => {
    render(<DeedCard deed={mockDeed} />)
    
    expect(screen.getByText('Thân thiện')).toBeInTheDocument()
    expect(screen.getByText('Helped neighbor')).toBeInTheDocument()
  })
  
  it('should format date correctly', () => {
    render(<DeedCard deed={mockDeed} />)
    
    // Assuming you display date
    expect(screen.getByText(/15.*01.*2024/)).toBeInTheDocument()
  })
  
  it('should hide description when not provided', () => {
    const deedWithoutDesc = { ...mockDeed, description: undefined }
    render(<DeedCard deed={deedWithoutDesc} />)
    
    expect(screen.queryByText('Helped neighbor')).not.toBeInTheDocument()
  })
})
```

**`src/features/deeds/components/AddDeedForm.test.tsx`:**
```tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AddDeedForm } from './AddDeedForm'

describe('AddDeedForm', () => {
  const mockOnSubmit = vi.fn()
  const mockCategories = [
    { id: 'cat_body', name: 'Thân thiện' },
    { id: 'cat_mind', name: 'Ý thiện' }
  ]
  
  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    
    render(
      <AddDeedForm 
        categories={mockCategories}
        onSubmit={mockOnSubmit}
      />
    )
    
    // Select category
    await user.click(screen.getByLabelText('Loại việc thiện'))
    await user.click(screen.getByText('Thân thiện'))
    
    // Enter description
    await user.type(
      screen.getByLabelText('Ghi chú'),
      'Helped neighbor carry groceries'
    )
    
    // Submit
    await user.click(screen.getByRole('button', { name: /lưu/i }))
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        categoryId: 'cat_body',
        description: 'Helped neighbor carry groceries',
        performedAt: expect.any(Number),
        isPrivate: true
      })
    })
  })
  
  it('should show error when category not selected', async () => {
    const user = userEvent.setup()
    
    render(
      <AddDeedForm 
        categories={mockCategories}
        onSubmit={mockOnSubmit}
      />
    )
    
    // Submit without selecting category
    await user.click(screen.getByRole('button', { name: /lưu/i }))
    
    expect(await screen.findByText(/vui lòng chọn loại/i)).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })
})
```

### 4.3. Hook Tests

**`src/hooks/useDeedsQuery.test.ts`:**
```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useDeedsQuery } from './useDeedsQuery'
import api from '@/lib/api'

vi.mock('@/lib/api')

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useDeedsQuery', () => {
  it('should fetch deeds successfully', async () => {
    const mockDeeds = {
      data: [
        { id: 'deed_1', categoryId: 'cat_body', description: 'Test' }
      ],
      pagination: { hasMore: false, nextCursor: null }
    }
    
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockDeeds })
    
    const { result } = renderHook(() => useDeedsQuery(), {
      wrapper: createWrapper()
    })
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    
    expect(result.current.data).toEqual(mockDeeds)
  })
  
  it('should handle error', async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'))
    
    const { result } = renderHook(() => useDeedsQuery(), {
      wrapper: createWrapper()
    })
    
    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    
    expect(result.current.error).toBeDefined()
  })
})
```

---

## 5. E2E Testing

### 5.1. Setup Playwright

```bash
pnpm create playwright
```

**playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] }
    }
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI
  }
})
```

### 5.2. Critical User Flows

**`e2e/auth-flow.spec.ts`:**
```typescript
import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should login with Google', async ({ page }) => {
    await page.goto('/')
    
    // Click login button
    await page.click('text=Đăng nhập với Google')
    
    // Should redirect to Google OAuth (or mock page in test)
    await expect(page).toHaveURL(/accounts\.google\.com/)
    
    // In real test, you'd use a test Google account
    // For now, mock the callback
    await page.goto('/auth/google/callback?code=test_code')
    
    // Should redirect to app after successful login
    await expect(page).toHaveURL('/app')
    
    // Should see user name in header
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
  })
})
```

**`e2e/deed-checkin-flow.spec.ts`:**
```typescript
import { test, expect } from '@playwright/test'

test.describe('Deed Check-in Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await loginAsTestUser(page)
  })
  
  test('should create a new deed', async ({ page }) => {
    await page.goto('/app')
    
    // Click "Ghi nhận việc thiện" button
    await page.click('[data-testid="add-deed-button"]')
    
    // Modal should open
    await expect(page.locator('[data-testid="deed-form"]')).toBeVisible()
    
    // Select category
    await page.click('[data-testid="category-select"]')
    await page.click('text=Thân thiện')
    
    // Enter description
    await page.fill('[data-testid="description-input"]', 'Helped a friend')
    
    // Submit
    await page.click('[data-testid="submit-deed"]')
    
    // Should show success message
    await expect(page.locator('text=Đã ghi nhận')).toBeVisible()
    
    // Should close modal
    await expect(page.locator('[data-testid="deed-form"]')).not.toBeVisible()
    
    // Should see deed in list
    await expect(page.locator('text=Helped a friend')).toBeVisible()
  })
  
  test('should validate required fields', async ({ page }) => {
    await page.goto('/app')
    await page.click('[data-testid="add-deed-button"]')
    
    // Try to submit without category
    await page.click('[data-testid="submit-deed"]')
    
    // Should show error
    await expect(page.locator('text=/vui lòng chọn/i')).toBeVisible()
  })
})
```

---

## 6. Test Data Management

### 6.1. Test Fixtures

**`src/test/fixtures.ts`:**
```typescript
export const mockUser = {
  id: 'user_test_1',
  email: 'test@example.com',
  displayName: 'Test User',
  avatarUrl: null
}

export const mockCategories = [
  { id: 'cat_body', name: 'Thân thiện', iconKey: 'hand-heart' },
  { id: 'cat_speech', name: 'Khẩu thiện', iconKey: 'message-circle-heart' },
  { id: 'cat_mind', name: 'Ý thiện', iconKey: 'brain-circuit' }
]

export const mockDeed = {
  id: 'deed_test_1',
  userId: mockUser.id,
  categoryId: 'cat_body',
  description: 'Test deed',
  performedAt: Date.now(),
  isPrivate: true,
  category: mockCategories[0]
}
```

### 6.2. Database Seeding for Tests

**`backend/scripts/seed-test-db.ts`:**
```typescript
import { D1Database } from '@cloudflare/workers-types'

export async function seedTestDatabase(db: D1Database) {
  // Insert test categories (same as production seed)
  await db.batch([
    db.prepare(`
      INSERT INTO categories (id, key, name, icon_key, order_index, is_active, is_system_default, created_at, updated_at)
      VALUES ('cat_body', 'body', 'Thân thiện', 'hand-heart', 1, 1, 1, ?, ?)
    `).bind(Date.now(), Date.now()),
    // ... other categories
  ])
}

export async function cleanTestDatabase(db: D1Database) {
  await db.batch([
    db.prepare('DELETE FROM user_achievements'),
    db.prepare('DELETE FROM goals'),
    db.prepare('DELETE FROM good_deeds'),
    db.prepare('DELETE FROM oauth_accounts'),
    db.prepare('DELETE FROM refresh_tokens'),
    db.prepare('DELETE FROM users WHERE email LIKE \'test-%@example.com\'')
  ])
}
```

---

## 7. CI Integration

### 7.1. GitHub Actions Workflow

**`.github/workflows/test.yml`:**
```yaml
name: Tests

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        working-directory: ./backend
        run: pnpm install
      
      - name: Run tests
        working-directory: ./backend
        run: pnpm test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/coverage-final.json

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        working-directory: ./frontend
        run: pnpm install
      
      - name: Run tests
        working-directory: ./frontend
        run: pnpm test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/coverage-final.json

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Install Playwright
        run: pnpm exec playwright install --with-deps
      
      - name: Run E2E tests
        run: pnpm test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 8. Test Coverage Reports

### 8.1. Generate Reports Locally

```bash
# Backend
cd backend
pnpm test:coverage
open coverage/index.html

# Frontend
cd frontend
pnpm test:coverage
open coverage/index.html
```

### 8.2. Coverage Badges

Add to README:
```markdown
[![Backend Coverage](https://codecov.io/gh/username/3000-good-deeds/branch/main/graph/badge.svg?flag=backend)](https://codecov.io/gh/username/3000-good-deeds)
[![Frontend Coverage](https://codecov.io/gh/username/3000-good-deeds/branch/main/graph/badge.svg?flag=frontend)](https://codecov.io/gh/username/3000-good-deeds)
```

---

## 9. Best Practices

### 9.1. Test Naming Convention

```typescript
// Good ✅
describe('calculateStreak', () => {
  it('should return 0 for empty deeds', () => {})
  it('should calculate consecutive days correctly', () => {})
  it('should stop at first gap', () => {})
})

// Bad ❌
describe('streak', () => {
  it('test1', () => {})
  it('works', () => {})
})
```

### 9.2. Arrange-Act-Assert Pattern

```typescript
it('should create deed', async () => {
  // Arrange: Setup
  const user = await createTestUser()
  const deedData = { categoryId: 'cat_body', performedAt: Date.now() }
  
  // Act: Execute
  const deed = await createDeed(db, user.id, deedData)
  
  // Assert: Verify
  expect(deed.id).toBeDefined()
  expect(deed.userId).toBe(user.id)
})
```

### 9.3. Avoid Test Interdependence

```typescript
// Bad ❌ - tests depend on each other
describe('deeds', () => {
  let deedId: string
  
  it('should create', async () => {
    const deed = await createDeed()
    deedId = deed.id // side effect
  })
  
  it('should update', async () => {
    await updateDeed(deedId) // depends on previous test
  })
})

// Good ✅ - each test is independent
describe('deeds', () => {
  it('should create', async () => {
    const deed = await createDeed()
    expect(deed.id).toBeDefined()
  })
  
  it('should update', async () => {
    const deed = await createDeed() // create fresh
    const updated = await updateDeed(deed.id)
    expect(updated).toBeDefined()
  })
})
```

---

## 10. Kết luận

Testing strategy này đảm bảo:
- ✅ High confidence in code quality
- ✅ Fast feedback on regressions
- ✅ Documentation through tests
- ✅ Safe refactoring

**Priority:**
1. Unit tests cho business logic (high ROI)
2. Integration tests cho API endpoints
3. E2E tests cho critical flows
4. Component tests cho complex UI

Target: **>75% overall coverage** before launch.
