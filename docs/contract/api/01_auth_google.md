# API – Authentication (Google)

Base URL: `/api/v1`

---

## POST `/auth/google`
Exchange Google authorization code for internal session.

**Request**
```json
{
  "code": "google_authorization_code",
  "redirectUri": "https://app.domain/auth/google/callback"
}
```

**Response (200)**
```json
{
  "accessToken": "jwt_token_string",
  "refreshToken": "refresh_token_string",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "Nguyen Van A",
    "avatarUrl": "..."
  }
}
```

---

## POST `/auth/refresh`
Refresh access token using refresh token.

**Request**
```json
{
  "refreshToken": "refresh_token_string"
}
```

**Response (200)**
```json
{
  "accessToken": "new_jwt_token_string"
}
```

---

## POST `/auth/logout`
Revoke refresh token.

**Request**
```json
{
  "refreshToken": "refresh_token_string"
}
```
