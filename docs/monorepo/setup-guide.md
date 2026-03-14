# Local Setup Guide

## Prerequisites

- Node.js 20+
- pnpm 10+
- Firebase CLI (for frontend deploy only)

## Install dependencies

```bash
pnpm install
```

## Environment setup

### Backend

```bash
cp backend/.dev.vars.example backend/.dev.vars
```

Required variables include:
- `FIREBASE_PROJECT_ID`
- `JWT_SECRET`

### Frontend

```bash
cp frontend/.env.example frontend/.env
```

Required variables include:
- `VITE_API_URL`
- Firebase web config keys

## Database setup

```bash
pnpm --filter backend migrate:local
```

Optional seed:

```bash
pnpm --filter backend seed:data
```

## Run apps

```bash
# terminal 1
pnpm dev:backend

# terminal 2
pnpm dev:frontend
```

## Useful commands

```bash
pnpm --filter backend lint
pnpm --filter backend type-check
pnpm --filter frontend lint
pnpm --filter frontend build
```
