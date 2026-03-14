# Backend AGENTS Guide

You are a programming assistant specialized in TypeScript, Cloudflare Workers (Hono), and D1.
Always respond in English for this repository.

## Mission

Deliver backend changes that are correct, secure, testable, and aligned with project contracts.

## Non-Negotiable Rules

- Do not modify documents outside the requested scope.
- Do not change public API contracts without explicit approval.
- Do not use mock data in production backend runtime.
- Do not hardcode secrets, tokens, or credentials.
- Do not finalize code without basic checks (`lint`, `type-check`, or equivalent).

## Required Reading Order

1. `backend/docs/standards/README.md`
2. `backend/docs/technical/api-design.md`
3. `backend/docs/technical/api-reference.md`
4. `backend/docs/technical/database-schema.md`
5. `docs/monorepo/architecture.md`

## Mandatory Standards

- `backend/docs/standards/01-architecture-and-boundaries.md`
- `backend/docs/standards/02-api-contract-and-validation.md`
- `backend/docs/standards/03-database-pattern.md`
- `backend/docs/standards/04-error-handling-pattern.md`
- `backend/docs/standards/05-security-and-auth-pattern.md`
- `backend/docs/standards/06-testing-pattern.md`
- `backend/docs/standards/07-code-review-guide.md`

## Implementation Rules

- Routes handle routing and middleware only.
- Business logic belongs in handlers.
- Validate inputs before executing business logic.
- Return proper status codes for each outcome.
- Bind SQL parameters and avoid `SELECT *` on production endpoints.
- Enforce ownership checks for user-scoped data operations.
- Keep error response format consistent and avoid leaking internal details.

## Security Rules

- Keep access/refresh token lifecycle consistent.
- Store refresh tokens as hashes in DB.
- Never log PII, tokens, or secrets.
- Use environment variables for all secrets.

## Review Rules

Before closing a task, verify:
- API contract compatibility
- coverage of unauthorized/forbidden/not-found/conflict branches
- regression risk in auth/session/data ownership paths
- required technical/product docs updates

## Useful Commands

```bash
pnpm --filter backend lint
pnpm --filter backend type-check
pnpm --filter backend check
pnpm --filter backend migrate:local
pnpm --filter backend migrate:remote
pnpm --filter backend dev
```
