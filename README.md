# 3000 Good Deeds

Monorepo for a kindness-tracking web application.

## Packages

- `frontend`: React 19 + Vite + Firebase Hosting
- `backend`: Cloudflare Workers + D1
- `docs`: shared documentation for product, architecture, and governance

## Quick Start

### 1) Install dependencies

```bash
pnpm install
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
- Frontend: `http://localhost:5173`

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
