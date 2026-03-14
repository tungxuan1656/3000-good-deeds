# Documentation Hub (Monorepo)

Root `docs/` contains only documentation shared across the monorepo.

## Structure

- `docs/product/`: shared product vision, roadmap, and principles.
- `docs/monorepo/`: architecture, setup, and deployment guides.
- `docs/governance/`: documentation standards, process, templates, and audits.
- `docs/archive/`: historical documents kept for reference.

## What should not live in root `docs/`

- Frontend coding standards -> `frontend/docs/standards/`
- Backend coding standards -> `backend/docs/standards/`
- Frontend feature specs -> `frontend/docs/product/`
- Backend feature rules/specs -> `backend/docs/product/`
- Frontend design docs -> `frontend/docs/design/`

## Suggested reading order

1. `docs/monorepo/setup-guide.md`
2. `docs/monorepo/architecture.md`
3. `frontend/docs/README.md`
4. `backend/docs/README.md`
5. `docs/monorepo/production-deploy-checklist.md`
