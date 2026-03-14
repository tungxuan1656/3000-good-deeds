# Production Deployment Checklist

## Access and Environment

- [ ] Cloudflare and Firebase production access confirmed.
- [ ] Correct environment variables and secrets configured.
- [ ] Correct backend DB and worker targets confirmed.

## Pre-Deploy Validation

- [ ] Lint/type checks pass.
- [ ] Critical user flows validated (auth, core feature paths).
- [ ] API contract changes reviewed and documented.
- [ ] Migration plan verified when schema changes exist.

## Backend Deploy

- [ ] Run remote migrations if needed.
- [ ] Deploy worker.
- [ ] Validate health and critical endpoints.

## Frontend Deploy

- [ ] Build production frontend.
- [ ] Deploy to Firebase Hosting.
- [ ] Validate production env configuration.

## Post-Deploy Smoke Test

- [ ] Login and token refresh.
- [ ] Core CRUD flow for main feature.
- [ ] Notifications/reminders (if impacted).
- [ ] Error handling and fallback behavior.

## Rollback

- [ ] Rollback instructions documented for both frontend and backend.
- [ ] Previous stable version references available.
