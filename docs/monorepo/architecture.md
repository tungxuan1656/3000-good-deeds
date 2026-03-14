# System Architecture

## Stack

- Frontend: React 19 + Vite + Firebase Auth provider
- Backend: Cloudflare Workers (Hono)
- Database: Cloudflare D1 (SQLite)
- Hosting: Firebase Hosting (frontend), Cloudflare Workers (backend)

## Data Flow

1. User authenticates with Firebase.
2. Frontend exchanges Firebase identity token with backend.
3. Backend issues internal access and refresh tokens.
4. Frontend calls protected APIs using backend-issued bearer token.

## Auth Boundary

- Firebase is used as identity provider.
- Backend owns API session lifecycle and authorization logic.

## Monorepo Layout

- `frontend/` application UI and client-side logic
- `backend/` API and data logic
- `docs/` shared project documentation
- `scripts/` root-level utilities
