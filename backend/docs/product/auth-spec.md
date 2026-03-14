# Authentication Spec

## Overview

The system uses Firebase Authentication as the identity provider.
Supported sign-in methods:
- Email + Password
- Google Sign-In

The backend does not rely on Firebase session state.
After successful identity verification, the backend issues and manages its own session:
- `accessToken` (short-lived JWT)
- `refreshToken` (long-lived token)

## Principles

- Provider-agnostic design for future provider expansion.
- Application database must never store user passwords.
- Backend fully controls API session lifecycle.

## User Flows

### Register (Email + Password)
1. Frontend creates user in Firebase.
2. Frontend retrieves Firebase `idToken`.
3. Frontend calls `POST /api/v1/auth/provider/exchange`.
4. Backend verifies token, creates/links internal user, returns session tokens.

### Login (Email + Password / Google)
1. Frontend authenticates with Firebase.
2. Frontend retrieves `idToken`.
3. Frontend calls exchange endpoint.
4. Backend returns internal session tokens.

### Forgot Password
- Frontend calls Firebase password-reset flow.

### Change Password
- Available for password-based accounts.
- Requires re-auth with current password before update.

## Technical Flow

1. Firebase authenticates and issues `idToken`.
2. Frontend sends `{ provider: "firebase", idToken }`.
3. Backend verifies JWT claims (`iss`, `aud`, `exp`, `sub`).
4. Backend upserts user and identity linkage.
5. Backend issues `accessToken` + `refreshToken`.
6. Frontend uses backend bearer token for protected APIs.

## Session Management

- Access token TTL: 24 hours
- Refresh token TTL: 30 days (stored as hash)
- Expired access token -> call `/auth/refresh`
- Invalid/expired refresh token -> force re-login

## Future Extensions

- Add providers via provider adapters.
- Swap Firebase identity provider without changing backend session contract.
