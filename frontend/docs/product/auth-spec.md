# Frontend Authentication Spec

## Goal

Enable users to sign in, register, and manage their session securely.

## Supported Auth Methods

- Email + Password
- Google Sign-In

## User Flows

### Register

1. User submits email + password to Firebase.
2. Frontend retrieves Firebase `idToken`.
3. Frontend calls backend `/auth/provider/exchange` to obtain session tokens.

### Login

1. User authenticates via Firebase (email/password or Google).
2. Frontend retrieves Firebase `idToken`.
3. Frontend calls backend exchange endpoint to obtain `accessToken` + `refreshToken`.

### Forgot Password

- Frontend delegates to Firebase password-reset flow.

### Token Refresh

- On `401` response, frontend calls `/auth/refresh` with stored `refreshToken`.
- On refresh failure, frontend clears state and redirects to login.

### Logout

- Frontend calls `/auth/logout` with `refreshToken`.
- Frontend clears all stored tokens and user state.

## Rules

- `accessToken` and `refreshToken` are stored in localStorage via `storages/`.
- Firebase session state is not used after initial token exchange.
- Password change is only available for password-based accounts.
- Failed token refresh must force re-login without silent retry.
