# 3000 Good Deeds

Monorepo for a kindness-tracking web application.

## Packages

- `frontend`: Next.js App Router + React 19 + Vercel
- `backend`: Cloudflare Workers + D1
- `docs`: shared documentation for product, architecture, and governance

## Quick Start

### 1) Install dependencies

```bash
pnpm install
npx gitnexus analyze
```

### 2) Configure environment files

- Frontend: create `frontend/.env` from `frontend/.env.example`
- Backend: create `backend/.dev.vars` from `backend/.dev.vars.example`

### 3) Run locally

```bash
# Terminal 1
pnpm dev:backend

# Terminal 2
pnpm dev:frontend
```

- Backend: `http://localhost:8787`
- Frontend: `http://localhost:3000`

## Documentation Index

- Shared docs: `docs/README.md`
- Frontend docs: `frontend/docs/README.md`
- Backend docs: `backend/docs/README.md`
- Monorepo setup: `docs/monorepo/setup-guide.md`
- Monorepo architecture: `docs/monorepo/architecture.md`
- Production checklist: `docs/monorepo/production-deploy-checklist.md`

## Root Scripts

```bash
pnpm dev:backend
pnpm dev:frontend
pnpm build:frontend
pnpm deploy:backend
```

## 🤖 AI Skills Used in This Project

Install skills on project:  
`./scripts/install-skills.sh`

This project includes a curated set of **Antigravity AI Skills** to help AI coding assistants
generate code that follows our architecture and best practices.

You can invoke a skill directly in prompts using the `@skill-name` syntax.

Example:
`Use @api-patterns to design a REST API for managing orders.`

---

## Planning

| Skill                   | Purpose                                                                |
| ----------------------- | ---------------------------------------------------------------------- |
| `@concise-planning`     | Creates a short implementation plan before coding.                     |
| `@systematic-debugging` | Guides structured debugging and root-cause analysis when issues occur. |

---

## Backend

| Skill                     | Purpose                                                                      |
| ------------------------- | ---------------------------------------------------------------------------- |
| `@backend-dev-guidelines` | Node.js backend architecture patterns (controllers, services, domain logic). |
| `@api-patterns`           | Best practices for designing REST APIs and endpoints.                        |
| `@database-design`        | Database schema design and data modeling guidance.                           |
| `@nodejs-best-practices`  | Performance and maintainability patterns for Node.js services.               |
| `@typescript-expert`      | Advanced TypeScript typing and type safety.                                  |

---

## Frontend

| Skill                   | Purpose                                                     |
| ----------------------- | ----------------------------------------------------------- |
| `@react-best-practices` | React performance optimization and architecture guidelines. |
| `@react-patterns`       | Reusable component and hook patterns.                       |
| `@tailwind-patterns`    | Tailwind CSS layout and styling best practices.             |
| `@frontend-design`      | UI structure, layout consistency, and design guidance.      |

---

## Testing

| Skill                      | Purpose                                             |
| -------------------------- | --------------------------------------------------- |
| `@test-driven-development` | Encourages writing tests before implementing logic. |
| `@e2e-testing-patterns`    | Patterns for reliable end-to-end tests.             |

---

## Review & Validation

| Skill                    | Purpose                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `@lint-and-validate`     | Ensures generated code follows standards and avoids common issues. |
| `@code-review-checklist` | Checklist for reviewing code quality before merging.               |

---

These skills help AI assistants produce **consistent, maintainable, and production-ready code**
aligned with this project's architecture.
