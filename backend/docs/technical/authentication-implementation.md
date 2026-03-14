# Authentication Implementation

## Objective

Use Firebase as identity provider while keeping backend-owned API sessions.

## Components

### Frontend

- signs in users with Firebase
- receives Firebase ID token
- exchanges ID token with backend
- stores backend access/refresh tokens

### Backend

- verifies Firebase ID token
- creates/links internal user records
- issues access and refresh tokens
- rotates refresh tokens

## Login Flow

1. frontend authenticates with Firebase
2. frontend sends ID token to `/auth/provider/exchange`
3. backend verifies and returns internal session tokens

## Refresh Flow

1. frontend sends refresh token to `/auth/refresh`
2. backend validates and rotates tokens
3. frontend replaces stored session values

## Logout Flow

1. frontend sends refresh token to `/auth/logout`
2. backend invalidates refresh token
3. frontend clears local session state
