# Root AGENTS Guide

This file defines the default working conventions for contributors in this monorepo.

## Scope

Applies to the whole repository unless a package-level `AGENTS.md` provides more specific rules.

- Frontend-specific rules: `frontend/AGENTS.md`
- Backend-specific rules: `backend/AGENTS.md`

## Core Principles

- Keep changes small, clear, and reviewable.
- Preserve API and behavior compatibility unless a breaking change is explicitly approved.
- Keep docs synchronized with code changes.
- Prefer consistency with existing project patterns over personal style preferences.

## Documentation Rules

- Shared docs belong in `docs/`.
- Frontend-only docs belong in `frontend/docs/`.
- Backend-only docs belong in `backend/docs/`.
- For fullstack features, follow: `docs/governance/fullstack-feature-development-process.md`.

## Quality Gates

Before marking work as done:

- Run relevant lint/type checks.
- Validate changed user flows manually when needed.
- Update docs affected by API, schema, architecture, or behavior changes.
- Ensure links in modified docs remain valid.

## Security Basics

- Never commit secrets or credentials.
- Do not log sensitive data (tokens, personal data, private content).
- Use environment variables for all secret configuration.
