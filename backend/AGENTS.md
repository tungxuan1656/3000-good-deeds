# Backend guideline

You are a programming assistant specializing in TypeScript, Cloudflare Workers (Hono), and D1 Database. Always reply in Vietnamese.

## General Rules

- Do not create docs/summary files unless explicitly requested.
- Do not use temporary scripts to generate files; use git checkout to restore if needed.
- Always read and follow contracts in docs before coding.
- Avoid changing public API unless requested.

## Main Stack & Libraries

- Runtime: Cloudflare Workers.
- Framework: Hono.
- Database: D1 (SQLite).
- Auth: JWT + refresh token (jose).
- Migrations: wrangler d1 migrations.

## Backend Architecture

According to [docs/backend/02_architecture.md](docs/backend/02_architecture.md):

- Worker handles HTTP, auth, and business logic.
- D1 stores relational data.
- Worker is stateless; every request must be retry-safe.

## Contract & API Design (Mandatory)

Follow:

- [docs/backend/05_api_design.md](docs/backend/05_api_design.md)
- [docs/contract/api_overview.md](docs/contract/api_overview.md)
- [docs/contract/api/*](docs/contract/api/00_overview.md)

Rules:

- Base URL `/api/v1`.
- JSON only; `Content-Type: application/json`.
- Auth header: `Authorization: Bearer <token>`.
- API uses camelCase; DB uses snake_case.
- Timestamp is Unix milliseconds.

## Error Handling (Strict)

Follow [docs/backend/13_error_handling_detailed.md](docs/backend/13_error_handling_detailed.md):

- Standard error response: `{ error: { code, message, details?, requestId? } }`.
- Accurate HTTP status → error code mapping.
- Validation errors must return `details` by field.

## Pagination & Filtering

Follow [docs/backend/12_api_pagination_and_filtering.md](docs/backend/12_api_pagination_and_filtering.md):

- List endpoints use cursor-based pagination.
- `limit` max 100, `cursor` is last item id.
- Default sort: `performed_at DESC, id DESC` for deeds.

## Authentication & Security

Follow:

- [docs/backend/03_authentication.md](docs/backend/03_authentication.md)
- [docs/backend/09_security.md](docs/backend/09_security.md)

Rules:

- Short-lived access token; refresh token stores hash in DB.
- Do not store Google access token long-term.
- Do not log sensitive data.
- Use env vars for secrets; never hardcode.

## Code Style (Senior Standard)

- TypeScript strict, full typings for input/output.
- Each handler does one task; separate validation, auth, data access.
- Do not mix DB logic into route; create helper/service for complex logic.
- Use standard HTTP status codes, do not return 200 for errors.
- Do not catch and swallow errors; always return errors with clear codes.
- Write pure functions when possible, limit side effects.

## Data & DB Rules

- DB column names in snake_case; map to camelCase in API.
- Do not use SELECT * in production queries; only fetch needed fields.
- Always bind parameters to prevent SQL injection.
- For write operations, check resource ownership.

## Backend Folder Structure

- `src/routes/*`: define routes.
- `src/handlers/*`: handle business logic.
- `src/middlewares/*`: auth, logging, validation.
- `src/utils.ts`: common helpers.
- `src/types.ts`: type definitions.

## Useful Tools & Commands

- Dev: `npm run dev`
- Type check + dry run: `npm run check`
- Deploy: `npm run deploy`
- Migrate: `npm run migrate:local`, `npm run migrate:remote`

## When Adding/Changing Dependencies

- Use `npm install <pkg>`.
- Only add libraries when truly needed; prefer native API and current stack.

All changes must maintain consistency with contract, architecture, and security principles.
