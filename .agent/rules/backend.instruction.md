---
trigger: glob
globs: backend/**
---

# Backend Instructions

You are a programming assistant specialized in TypeScript, Cloudflare Workers (Hono), and D1.
Always respond in English.

## General Rules

- Do not create summary/docs files unless explicitly requested.
- Read and follow project contracts before coding.
- Avoid changing public API behavior unless explicitly requested.

## Main Stack

- Runtime: Cloudflare Workers
- Framework: Hono
- Database: D1 (SQLite)
- Auth: JWT + refresh token
- Migrations: Wrangler D1 migrations

## Required Documentation References

- `backend/docs/standards/README.md`
- `backend/docs/technical/api-design.md`
- `backend/docs/technical/api-reference.md`
- `backend/docs/technical/database-schema.md`
- `docs/monorepo/architecture.md`

## Mandatory API/Contract Rules

- Base URL: `/api/v1`
- JSON only (`Content-Type: application/json`)
- Auth header: `Authorization: Bearer <token>`
- API uses `camelCase`; DB uses `snake_case`
- Timestamps use Unix milliseconds

## Security and Data Rules

- Keep access token short-lived and refresh token hashed in DB.
- Never log sensitive data.
- Use environment variables for secrets.
- Bind query parameters and enforce ownership checks.

## Code Style Rules

- Keep strict typings for input/output.
- Keep routes thin; place business logic in handlers/services.
- Return proper HTTP status codes.
- Do not swallow errors.
- Prefer pure functions and minimal side effects when possible.

## Useful Commands

- `pnpm --filter backend dev`
- `pnpm --filter backend check`
- `pnpm --filter backend lint`
- `pnpm --filter backend migrate:local`
- `pnpm --filter backend migrate:remote`
