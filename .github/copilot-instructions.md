# 3000 Good Deeds — Copilot Instructions

AI coding agents should use this guide to become productive in this monorepo immediately.

## Project Overview

**3000 Good Deeds** is a fullstack kindness-tracking web application with:

- **Frontend**: React 19 + Vite + Firebase Auth + Tailwind CSS v4
- **Backend**: Cloudflare Workers (Hono) + D1 (SQLite)
- **Hosting**: Firebase Hosting (frontend) + Cloudflare Workers (backend)

## Architecture Essentials

### Data Flow & Auth Boundary

1. User authenticates with Firebase (identity provider)
2. Frontend exchanges Firebase token for backend-issued access + refresh tokens
3. Frontend calls protected APIs using backend bearer token
4. Backend owns session lifecycle, authorization, and data ownership validation

**Key insight**: Firebase is auth provider only; backend controls API sessions and business logic.

### Monorepo Structure

```
frontend/    → UI, client-side logic, API hooks, state management
backend/     → API routes, handlers, database queries, domain logic
docs/        → Shared product/architecture/governance documentation
```

## Frontend Development

### Stack & Conventions

- **UI Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 with design system classes (no arbitrary values)
- **Components**: shadcn-ui + Lucide Icons (format: `{Name}Icon`)
- **State**: Zustand (global) + TanStack Query (server state)
- **Forms**: React Hook Form + Zod validation
- **i18n**: All UI strings through `t()` function (no hardcoded strings)

### Critical Patterns

**API Layer** (must follow `frontend/docs/standards/api-react-query-pattern.md`):

```
src/api/
  client.ts              → HTTP client config
  endpoints.ts           → Centralized route definitions
  <domain>.ts            → API functions (fully typed)
  <domain>.mock.ts       → Mock fixtures (NOT embedded in components)
src/hooks/api/
  use-<domain>.ts        → React Query hooks with cache management
```

- All mutations must `invalidateQueries()` after success
- Remove identity selectors (`select: (d) => d`)
- Check existing stores/queries before adding parallel API calls
- Mock data isolated in separate files with clear TODO comments

**Component Structure** (see `frontend/docs/standards/component-structure-pattern.md`):

- Pages in `src/pages/` with corresponding directories
- Child components in `src/components/`
- Barrel exports with clear public vs internal separation
- File size limits enforced

**Naming Conventions** (see `frontend/docs/standards/naming-and-conventions-pattern.md`):

- Files: `kebab-case` (e.g., `user-profile.tsx`)
- Types: `Domain` + suffix (`UserDTO`, `CreateUserRequest`, `UserResponse`)
- Comments: English only
- Imports: Organized (React → external → internal)

### Commands

```bash
pnpm install              # Install dependencies
pnpm dev:frontend         # Start dev server (http://localhost:5173)
pnpm lint                 # Format and lint check
pnpm type-check           # TypeScript validation
pnpm build:frontend       # Production build
pnpm deploy               # Deploy to Firebase Hosting
```

---

## Backend Development

### Stack & Conventions

- **Framework**: Hono (lightweight TypeScript router)
- **Database**: Cloudflare D1 (SQLite with migrations)
- **Validation**: Explicit input/query/body validation
- **Testing**: Vitest (see `backend/docs/standards/testing-pattern.md`)

### Required Reading Order

1. `backend/AGENTS.md` (non-negotiable rules)
2. `backend/docs/standards/README.md`
3. `backend/docs/technical/api-design.md`
4. `backend/docs/technical/database-schema.md`

### Architecture Pattern

**Route → Handler → Database**:

- **Routes** (`src/routes/*.ts`): Routing + middleware only, no business logic
- **Handlers** (`src/handlers/*.ts`): Business logic + validation
- **Database**: D1 queries with parameter binding, no `SELECT *`

Example:

```typescript
// src/routes/deeds.ts
router.post('/deeds', authenticateUser, createDeedHandler)

// src/handlers/deeds.ts
export async function createDeedHandler(c: Context) {
    const { title } = await validateInput(c)
    const userId = c.get('userId')
    const deed = await db.createDeed(userId, title)
    return c.json(deed, 201)
}
```

### API Contracts

**Rules**:

- Base path: `/api/v1`
- JSON-only, `camelCase` fields in responses
- Snake_case in database, map to camelCase in responses
- Consistent error envelope with error codes

**Status Codes**:

- `200` success
- `201` created
- `400` bad input
- `401` unauthenticated
- `403` forbidden/no access
- `404` not found
- `409` conflict
- `429` rate limited
- `500` internal error

### Database Pattern

**Key Rules**:

- Never use `SELECT *` on production endpoints—list columns explicitly
- Bind all dynamic parameters (no string interpolation)
- Enforce ownership checks for user-scoped updates/deletes
- Keep column naming `snake_case`, map to `camelCase` in API
- Pagination required on list endpoints

Example:

```typescript
// ✅ Correct
const deed = await db
    .prepare('SELECT id, title, created_at FROM deeds WHERE id = ? AND user_id = ?')
    .bind(deedId, userId)
    .first()

// ❌ Wrong
const deed = await db.prepare(`SELECT * FROM deeds WHERE id = ${deedId}`).first()
```

### Security & Auth

**Rules**:

- Access tokens: short-lived (in-memory)
- Refresh tokens: long-lived, stored as hashes in DB
- Always verify user ownership for private data operations
- Never log tokens, secrets, or PII
- All secrets via environment variables (no hardcoding)

### Error Handling

**Rules**:

- Use explicit error codes (see `ErrorCodes` in `src/utils`)
- Log sufficient context but never log sensitive data
- Return appropriate 4xx/5xx status codes
- Keep error response format consistent

### Commands

```bash
pnpm install              # Install dependencies
pnpm dev:backend          # Start dev server (http://localhost:8787)
pnpm lint                 # Format and lint check
pnpm type-check           # TypeScript validation
pnpm check                # Run lint + type-check
pnpm test                 # Run Vitest suite
pnpm migrate:local        # Apply migrations to local DB
pnpm migrate:remote       # Apply migrations to production
pnpm build:backend        # Build for production
pnpm deploy:backend       # Deploy to Cloudflare Workers
```

---

## Shared Conventions

### Quality Gates (Before Marking Work Done)

- Run `pnpm lint` and `pnpm type-check` (or package equivalent)
- Validate changed user flows manually when relevant
- Update documentation if API, schema, architecture, or behavior changes
- Ensure all links in updated docs remain valid

### Code Review Checklist

See `backend/docs/standards/code-review-guide.md`, `frontend/docs/standards/code-review-guide.md` and `.github/review.instructions.md` for comprehensive review dimensions covering UI/UX, API contracts, logic, performance, security, architecture, testing, i18n, naming, and docs.

### Documentation Rules

- **Shared docs**: `docs/` directory
- **Frontend docs**: `frontend/docs/`
- **Backend docs**: `backend/docs/`
- **Fullstack features**: Follow `docs/governance/fullstack-feature-development-process.md`

### Monorepo Commands

```bash
pnpm install              # Install all workspace dependencies
pnpm dev:backend          # Start backend
pnpm dev:frontend         # Start frontend
pnpm build:frontend       # Build frontend
pnpm deploy:backend       # Deploy backend
```

---

## Non-Negotiable Rules

1. **Do not modify documents outside requested scope**
2. **Do not change public API contracts without explicit approval**
3. **Do not use mock data in production backend runtime**
4. **Do not hardcode secrets, tokens, or credentials**
5. **Do not log sensitive data** (tokens, PII, private content)
6. **Always finalize code with lint/type checks** before commit
7. **Never trust client input**—validate everything server-side
8. **Preserve API compatibility**—introduce new versions for breaking changes

---

## Key Files to Read

| Goal                     | File                                                  |
| ------------------------ | ----------------------------------------------------- |
| Understand system design | `docs/monorepo/architecture.md`                       |
| Backend API details      | `backend/docs/technical/api-reference.md`             |
| Database schema          | `backend/docs/technical/database-schema.md`           |
| Frontend patterns        | `frontend/docs/standards/api-react-query-pattern.md`  |
| Security rules           | `backend/docs/standards/security-and-auth-pattern.md` |
| Error handling           | `backend/docs/standards/error-handling-pattern.md`    |
| Production readiness     | `docs/monorepo/production-deploy-checklist.md`        |

---

## AI Skills Available

Invoke skills using `@skill-name` syntax in prompts:

**Planning & Debugging**: `@concise-planning`, `@systematic-debugging`

**Backend**: `@backend-dev-guidelines`, `@api-patterns`, `@database-design`, `@nodejs-best-practices`, `@typescript-expert`

**Frontend**: `@react-best-practices`, `@react-patterns`, `@tailwind-patterns`, `@frontend-design`

See `README.md` for full skill descriptions.

---

## Quick Decisions

**When adding an API endpoint**:

1. Update `backend/docs/technical/api-reference.md` with contract
2. Implement route in `src/routes/`, handler in `src/handlers/`
3. Validate inputs explicitly, return correct status codes
4. Add tests in `src/__tests__/handlers/`

**When adding a component**:

1. Create in `src/components/` with kebab-case filename
2. Export from barrel if part of public API
3. Use Tailwind design system classes (no arbitrary values)
4. Use Lucide icons in `{Name}Icon` format

**When styling**:

1. Use semantic Tailwind classes from design system
2. Check `frontend/docs/standards/color-guide.md` for color palette
3. Use `text-xss` through `text-base` for typography
4. Never use arbitrary values like `text-[10px]`

---

## Asking for Help

If unclear about:

- **API design**: Reference `backend/docs/technical/api-design.md`
- **Component patterns**: Check `frontend/docs/standards/component-structure-pattern.md`
- **Database queries**: See `backend/docs/standards/database-pattern.md`
- **Type naming**: Review `frontend/docs/standards/type-naming-pattern.md`
- **Form implementation**: Check `frontend/docs/standards/form-pattern.md`
- **i18n workflow**: See `frontend/docs/standards/i18n-label-pattern.md`

