# Documentation Standards

## Goal

Keep documentation clear, non-duplicated, easy to onboard with, and synchronized with code changes.

## Ownership Rules

- Root `docs/`: shared information for the whole repository.
- `frontend/docs/`: frontend-owned documentation.
- `backend/docs/`: backend-owned documentation.

For topics spanning frontend and backend:
- Put shared principles in root `docs/`.
- Put implementation details in package-specific docs.

## File Naming Rules

- Use `kebab-case`.
- File names must describe purpose clearly (example: `api-reference.md`, `code-review-guide.md`).
- Avoid numeric prefixes to reduce rename churn.

## Content Rules

Each document should include:
- Purpose
- Scope
- Mandatory rules (if any)
- Practical examples or checklists
- Links to related documents

## Update Rules

Documentation must be updated when changes affect:
- API contracts
- Folder structure or architecture
- Business flow
- Security/auth/deployment behavior

## Definition of Done for PRs

A PR is documentation-complete when:
- Relevant docs are updated for the code change.
- No broken links were introduced.
- Information is not duplicated across multiple conflicting sources.
