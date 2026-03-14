# Fullstack Feature Development Process

## Purpose

Standardize delivery for features that involve both frontend and backend.

## Required Flow (F0 -> F8)

### F0. Intake and Scope
- Define in-scope and out-of-scope clearly.
- Identify risks (auth, data migration, UX, backward compatibility).

### F1. Product Spec
- Create/update `frontend/docs/product/<feature>-spec.md`.
- If backend has backend-only rules, add/update `backend/docs/product/<feature>-spec.md`.

### F2. API Contract
- Update `backend/docs/technical/api-reference.md`.
- Update `backend/docs/technical/api-design.md` when introducing new design rules.

Each endpoint must define:
- Method + path
- Request schema
- Response schema
- Error cases + status codes
- Auth requirement

### F3. Data Model and Migration
When DB changes are involved:
- Add migration in `backend/migrations/`.
- Update `backend/docs/technical/database-schema.md`.
- Document compatibility and rollback considerations.

### F4. Design and UX
When UX changes significantly:
- Update `frontend/docs/design/screens.md`.
- Update `frontend/docs/design/design-guide.md` if introducing new UI patterns.

### F5. Implementation
- Backend follows `backend/docs/standards/*` and `backend/AGENTS.md`.
- Frontend follows `frontend/docs/standards/*` and `frontend/AGENTS.md`.

### F6. Testing
- Add appropriate tests for new logic and regressions.
- Cover critical error branches.

### F7. Review
- Backend review: `backend/docs/standards/code-review-guide.md`
- Frontend review: `frontend/docs/standards/code-review-guide.md`

### F8. Release Readiness
- Validate against `docs/monorepo/production-deploy-checklist.md`.
- Ensure documentation is synced and links are valid.

## Minimum Required Documents for a Fullstack Feature

- `frontend/docs/product/<feature>-spec.md`
- Updated `backend/docs/technical/api-reference.md`
- Updated `backend/docs/technical/database-schema.md` (if DB changes)
- Relevant design docs in `frontend/docs/design/` (if UX changes)
- Documentation checklist completed in PR
