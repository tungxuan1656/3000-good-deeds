# 11. GOOGLE OAUTH SETUP & IMPLEMENTATION GUIDE

## 1. Mục đích

Tài liệu này hướng dẫn chi tiết cách:
- Setup Google OAuth 2.0 credentials
- Implement OAuth flow trong Cloudflare Workers
- Handle các edge cases và errors
- Test authentication flow

---

## 2. Tổng quan Google OAuth Flow

```
┌─────────┐                                  ┌──────────┐                    ┌─────────┐
│ Browser │                                  │  Worker  │                    │ Google  │
└────┬────┘                                  └─────┬────┘                    └────┬────┘
     │                                             │                              │
     │  1. Click "Login with Google"              │                              │
     ├────────────────────────────────────────────>                              │
     │                                             │                              │
     │  2. Redirect to Google OAuth               │                              │
     ├────────────────────────────────────────────┼─────────────────────────────>│
     │                                             │                              │
     │  3. User grants permission                 │                              │
     │                                             │                              │
     │  4. Redirect back with code                │                              │
     <────────────────────────────────────────────┼──────────────────────────────┤
     │                                             │                              │
     │  5. POST /auth/google with code            │                              │
     ├────────────────────────────────────────────>                              │
     │                                             │                              │
     │                                             │  6. Exchange code for token  │
     │                                             ├─────────────────────────────>│
     │                                             │                              │
     │                                             │  7. Return access_token      │
     │                                             <─────────────────────────────┤
     │                                             │                              │
     │                                             │  8. Get user profile         │
     │                                             ├─────────────────────────────>│
     │                                             │                              │
     │                                             │  9. Return user info         │
     │                                             <─────────────────────────────┤
     │                                             │                              │
     │  10. Return JWT + refresh token            │                              │
     <────────────────────────────────────────────┤                              │
```

---

## 3. Setup Google Cloud Console

### 3.1. Tạo Project

1. Truy cập: https://console.cloud.google.com/
2. Tạo project mới: "3000-good-deeds"
3. Bật **Google+ API** (Legacy, for userinfo endpoint)

### 3.2. Tạo OAuth 2.0 Credentials

1. Vào **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Chọn **Application type**: Web application
4. Điền thông tin:
   - **Name**: 3000 Good Deeds Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (dev)
     - `https://your-domain.com` (prod)
   - **Authorized redirect URIs**:
     - `http://localhost:5173/auth/google/callback` (dev)
     - `https://your-domain.com/auth/google/callback` (prod)
5. Lưu lại:
   - **Client ID**: `xxx.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-xxx`

### 3.3. Cấu hình OAuth Consent Screen

1. Vào **OAuth consent screen**
2. Chọn **External** (vì app public)
3. Điền:
   - **App name**: 3000 Việc Thiện
   - **User support email**: your-email@example.com
   - **Developer contact**: your-email@example.com
4. **Scopes**: Chỉ cần:
   - `email`
   - `profile`
   - `openid`
5. **Test users** (trong dev mode): Thêm email test của bạn

---

## 4. Environment Variables

### 4.1. Cloudflare Workers Secrets

```bash
# Dev
wrangler secret put GOOGLE_CLIENT_ID --env dev
wrangler secret put GOOGLE_CLIENT_SECRET --env dev
wrangler secret put JWT_SECRET --env dev

# Production
wrangler secret put GOOGLE_CLIENT_ID --env production
wrangler secret put GOOGLE_CLIENT_SECRET --env production
wrangler secret put JWT_SECRET --env production
```

### 4.2. wrangler.toml

```toml
name = "good-deeds-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[env.dev]
vars = { ENVIRONMENT = "dev" }

[env.production]
vars = { ENVIRONMENT = "production" }
```

---

## 5. Implementation Backend

### 5.1. POST /auth/google

**Request:**
```json
{
  "code": "4/0AY0e-g7...",
  "redirectUri": "http://localhost:5173/auth/google/callback"
}
```

**Logic:**

1. **Validate input**
   ```typescript
   if (!code || !redirectUri) {
     return c.json({ error: 'Missing required fields' }, 400)
   }
   ```

2. **Exchange code for token**
   ```typescript
   const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
     method: 'POST',
     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
     body: new URLSearchParams({
       code,
       client_id: env.GOOGLE_CLIENT_ID,
       client_secret: env.GOOGLE_CLIENT_SECRET,
       redirect_uri: redirectUri,
       grant_type: 'authorization_code'
     })
   })
   ```

3. **Get user profile**
   ```typescript
   const profileResponse = await fetch(
     'https://www.googleapis.com/oauth2/v2/userinfo',
     {
       headers: { Authorization: `Bearer ${accessToken}` }
     }
   )
   ```

4. **Find or create user**
   ```typescript
   // Check oauth_accounts table
   let user = await db.getUserByGoogleId(googleProfile.id)
   
   if (!user) {
     // Check if email exists
     user = await db.getUserByEmail(googleProfile.email)
     
     if (user) {
       // Link existing account
       await db.linkOAuthAccount(user.id, 'google', googleProfile.id, googleProfile.email)
     } else {
       // Create new user
       user = await db.createUser({
         email: googleProfile.email,
         displayName: googleProfile.name,
         avatarUrl: googleProfile.picture,
         emailVerifiedAt: Date.now() // Google verified
       })
       
       await db.linkOAuthAccount(user.id, 'google', googleProfile.id, googleProfile.email)
     }
   }
   ```

5. **Generate tokens**
   ```typescript
   const accessToken = await generateJWT(user.id, user.email)
   const refreshToken = await generateRefreshToken(user.id)
   ```

6. **Response**
   ```json
   {
     "accessToken": "eyJhbGc...",
     "refreshToken": "rt_xxx",
     "user": {
       "id": "uuid",
       "email": "user@example.com",
       "displayName": "Nguyen Van A",
       "avatarUrl": "..."
     }
   }
   ```

---

## 6. Error Handling

### 6.1. Exchange Code Errors

| Error                   | Reason                    | Action                           |
| ----------------------- | ------------------------- | -------------------------------- |
| `invalid_grant`         | Code đã dùng hoặc expired | Return 400, ask user retry login |
| `redirect_uri_mismatch` | Redirect URI không khớp   | Fix config, return 500           |
| `invalid_client`        | Client ID/Secret sai      | Fix env vars, return 500         |

**Response:**
```json
{
  "error": {
    "code": "AUTH_FAILED",
    "message": "Không thể đăng nhập. Vui lòng thử lại.",
    "details": "invalid_grant"
  }
}
```

### 6.2. Network Errors

- Timeout khi call Google API: **Retry 1 lần**, sau đó fail
- Return 503 Service Unavailable

### 6.3. Database Errors

- Nếu không tạo được user/oauth_account: **Rollback transaction**
- Return 500

---

## 7. Security Considerations

### 7.1. State Parameter (Recommended)

Frontend nên generate `state` (random string) để prevent CSRF:

```typescript
// Frontend
const state = generateRandomString(32)
sessionStorage.setItem('oauth_state', state)

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  response_type: 'code',
  scope: 'email profile openid',
  state: state
})}`

// Callback
const urlParams = new URLSearchParams(window.location.search)
const returnedState = urlParams.get('state')
const savedState = sessionStorage.getItem('oauth_state')

if (returnedState !== savedState) {
  throw new Error('State mismatch - possible CSRF attack')
}
```

### 7.2. HTTPS Only (Production)

- Chỉ accept redirect_uri với `https://` trong production
- Reject `http://` (trừ localhost)

### 7.3. Rate Limiting

- Giới hạn `/auth/google`: **5 requests / minute / IP**
- Prevent brute force

---

## 8. Testing

### 8.1. Manual Test Flow

1. Frontend redirect đến Google OAuth URL
2. Login với test account
3. Grant permissions
4. Verify redirect về callback URL với `code`
5. Frontend gọi `POST /auth/google`
6. Verify response có `accessToken`, `refreshToken`, `user`
7. Lưu token vào localStorage
8. Gọi `GET /users/me` với Bearer token
9. Verify trả về user profile

### 8.2. Test Cases

| Case                       | Expected                            |
| -------------------------- | ----------------------------------- |
| First-time login           | Create new user + oauth_account     |
| Existing user (same email) | Link oauth_account to existing user |
| Existing oauth_account     | Return existing user                |
| Invalid code               | 400 error                           |
| Expired code               | 400 error                           |
| Missing redirectUri        | 400 error                           |

---

## 9. Frontend Integration (React)

### 9.1. Install Google OAuth Library

```bash
pnpm add @react-oauth/google
```

### 9.2. Setup GoogleOAuthProvider

```tsx
// main.tsx
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
)
```

### 9.3. Login Component

```tsx
// features/auth/LoginPage.tsx
import { useGoogleLogin } from '@react-oauth/google'

export function LoginPage() {
  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        const response = await axios.post('/api/v1/auth/google', {
          code: codeResponse.code,
          redirectUri: window.location.origin + '/auth/google/callback'
        })
        
        const { accessToken, refreshToken, user } = response.data
        
        // Save to Zustand store
        useAuthStore.getState().login(accessToken, refreshToken, user)
        
        // Redirect to home
        navigate('/app')
      } catch (error) {
        toast.error('Đăng nhập thất bại')
      }
    },
    onError: () => {
      toast.error('Đăng nhập thất bại')
    }
  })

  return (
    <button onClick={() => login()}>
      Đăng nhập với Google
    </button>
  )
}
```

---

## 10. Monitoring & Logging

### 10.1. Metrics to Track

- OAuth success rate
- OAuth failure reasons (by error code)
- Time to complete OAuth flow
- New user signups vs returning users

### 10.2. Logs

Log mọi bước trong OAuth flow (nhưng **không log sensitive data**):

```typescript
console.log('OAuth: Exchange code started', { userId: 'pending' })
console.log('OAuth: User profile fetched', { email: user.email })
console.log('OAuth: User created', { userId: user.id })
```

**KHÔNG log:**
- `code` (authorization code)
- `access_token` (Google access token)
- `refresh_token`
- `client_secret`

---

## 11. Troubleshooting

### Common Issues

| Issue                     | Solution                                   |
| ------------------------- | ------------------------------------------ |
| "redirect_uri_mismatch"   | Check Google Console và code có khớp không |
| "invalid_client"          | Check GOOGLE_CLIENT_ID/SECRET env vars     |
| "access_denied"           | User refused permission - normal behavior  |
| CORS error                | Check Worker CORS middleware               |
| Token expired immediately | Check JWT_SECRET và expiry time            |

---

## 12. Appendix: Complete Code Example

**Backend Handler:**
```typescript
// src/routes/auth.ts
import { Hono } from 'hono'
import { z } from 'zod'
import { generateJWT, generateRefreshToken } from '../auth'

const authSchema = z.object({
  code: z.string().min(1),
  redirectUri: z.string().url()
})

export default new Hono<{ Bindings: Env }>()
  .post('/google', async (c) => {
    try {
      const body = authSchema.parse(await c.req.json())
      
      // Exchange code for token
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: body.code,
          client_id: c.env.GOOGLE_CLIENT_ID,
          client_secret: c.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: body.redirectUri,
          grant_type: 'authorization_code'
        })
      })
      
      if (!tokenRes.ok) {
        const error = await tokenRes.json()
        return c.json({ error: 'AUTH_FAILED', details: error }, 400)
      }
      
      const { access_token } = await tokenRes.json()
      
      // Get profile
      const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` }
      })
      
      const profile = await profileRes.json()
      
      // Find or create user
      const db = c.env.DB
      let user = await getUserByGoogleId(db, profile.id)
      
      if (!user) {
        user = await createUserFromGoogle(db, profile)
      }
      
      // Generate tokens
      const jwt = await generateJWT(user.id, user.email, c.env.JWT_SECRET)
      const refresh = await generateRefreshToken(db, user.id)
      
      return c.json({
        accessToken: jwt,
        refreshToken: refresh,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.display_name,
          avatarUrl: user.avatar_url
        }
      })
      
    } catch (error) {
      console.error('OAuth error:', error)
      return c.json({ error: 'INTERNAL_ERROR' }, 500)
    }
  })
```

---

## 13. Kết luận

OAuth flow là phần quan trọng nhất của authentication. Cần:
- Setup cẩn thận Google Console
- Handle errors đầy đủ
- Test kỹ các edge cases
- Monitor trong production

Sau khi OAuth hoàn tất, các API khác sử dụng JWT đơn giản hơn nhiều.
