# 14. RATE LIMITING & SECURITY

## 1. Mục đích

Tài liệu này định nghĩa:
- Rate limiting strategy cho các endpoints
- Security best practices
- Cách protect khỏi abuse và attacks

---

## 2. Rate Limiting Strategy

### 2.1. Tại sao cần Rate Limiting?

**Bảo vệ khỏi:**
- Brute force attacks (đặc biệt auth endpoints)
- API abuse
- DDoS attacks
- Scrapers

**Đảm bảo:**
- Fair usage cho tất cả users
- System stability
- Cost control (Cloudflare Workers có limits)

---

## 3. Rate Limiting Rules

### 3.1. Authentication Endpoints (Strict)

| Endpoint             | Limit  | Window | Reason                          |
| -------------------- | ------ | ------ | ------------------------------- |
| `POST /auth/google`  | 5 req  | 1 min  | Prevent OAuth abuse             |
| `POST /auth/refresh` | 10 req | 1 min  | Prevent token farming           |
| `POST /auth/logout`  | 5 req  | 1 min  | Normal usage unlikely to exceed |

**Identify by:** IP address

### 3.2. Write Endpoints (Moderate)

| Endpoint            | Limit  | Window | Reason                              |
| ------------------- | ------ | ------ | ----------------------------------- |
| `POST /deeds`       | 30 req | 1 min  | Normal: ~10 deeds/day, allow bursts |
| `PUT /deeds/:id`    | 20 req | 1 min  | Less frequent than create           |
| `DELETE /deeds/:id` | 10 req | 1 min  | Rare operation                      |
| `POST /goals`       | 5 req  | 5 min  | Create goal is infrequent           |
| `PUT /users/me`     | 10 req | 5 min  | Settings change                     |

**Identify by:** User ID (from JWT)

### 3.3. Read Endpoints (Relaxed)

| Endpoint             | Limit   | Window | Reason                     |
| -------------------- | ------- | ------ | -------------------------- |
| `GET /deeds`         | 60 req  | 1 min  | Pagination, frequent reads |
| `GET /stats/summary` | 30 req  | 1 min  | Dashboard page             |
| `GET /categories`    | 100 req | 1 min  | Static data, can be cached |
| `GET /users/me`      | 60 req  | 1 min  | Profile page               |

**Identify by:** User ID (from JWT)

### 3.4. Global Limit (Catch-all)

- **Any endpoint:** 120 requests / minute / user
- Để catch abuse không predicted

---

## 4. Implementation với Cloudflare Workers

### 4.1. Using Cloudflare KV for Rate Limiting

**Rationale:**
- D1 không phù hợp cho high-frequency writes
- KV có TTL tự động, phù hợp với rate limiting

**Setup:**
```toml
# wrangler.toml
[[kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "your_kv_namespace_id"
```

### 4.2. Rate Limiter Middleware

```typescript
// src/middlewares/rateLimit.ts
import { Context, Next } from 'hono'

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  keyPrefix: string
  identifyBy: 'ip' | 'userId'
}

export function rateLimit(config: RateLimitConfig) {
  return async (c: Context, next: Next) => {
    const identifier = config.identifyBy === 'ip' 
      ? c.req.header('cf-connecting-ip') || 'unknown'
      : c.get('userId') || 'anonymous'
    
    const key = `${config.keyPrefix}:${identifier}`
    const now = Date.now()
    const windowStart = now - config.windowMs
    
    // Get current count from KV
    const data = await c.env.RATE_LIMIT_KV.get(key, 'json')
    
    let requests: number[] = data?.requests || []
    
    // Filter out expired timestamps
    requests = requests.filter(ts => ts > windowStart)
    
    // Check if limit exceeded
    if (requests.length >= config.maxRequests) {
      const oldestRequest = Math.min(...requests)
      const retryAfter = Math.ceil((oldestRequest + config.windowMs - now) / 1000)
      
      return c.json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Quá nhiều yêu cầu. Vui lòng thử lại sau ${retryAfter} giây.`,
          details: { retryAfter }
        }
      }, 429, {
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Limit': config.maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': Math.ceil((oldestRequest + config.windowMs) / 1000).toString()
      })
    }
    
    // Add current request
    requests.push(now)
    
    // Save to KV with TTL
    await c.env.RATE_LIMIT_KV.put(
      key, 
      JSON.stringify({ requests }), 
      { expirationTtl: Math.ceil(config.windowMs / 1000) }
    )
    
    // Set response headers
    c.header('X-RateLimit-Limit', config.maxRequests.toString())
    c.header('X-RateLimit-Remaining', (config.maxRequests - requests.length).toString())
    c.header('X-RateLimit-Reset', Math.ceil((now + config.windowMs) / 1000).toString())
    
    await next()
  }
}
```

### 4.3. Usage in Routes

```typescript
// src/routes/auth.ts
import { rateLimit } from '../middlewares/rateLimit'

const authRouter = new Hono()

authRouter.post(
  '/google',
  rateLimit({
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
    keyPrefix: 'auth:google',
    identifyBy: 'ip'
  }),
  async (c) => {
    // Handle OAuth
  }
)
```

```typescript
// src/routes/deeds.ts
deedsRouter.post(
  '/',
  authMiddleware, // Must come before rate limiter to get userId
  rateLimit({
    maxRequests: 30,
    windowMs: 60 * 1000,
    keyPrefix: 'deeds:create',
    identifyBy: 'userId'
  }),
  async (c) => {
    // Create deed
  }
)
```

---

## 5. Security Headers

### 5.1. Required Security Headers

```typescript
// src/middlewares/securityHeaders.ts
export function securityHeaders() {
  return async (c: Context, next: Next) => {
    await next()
    
    // Prevent clickjacking
    c.header('X-Frame-Options', 'DENY')
    
    // Prevent MIME type sniffing
    c.header('X-Content-Type-Options', 'nosniff')
    
    // XSS Protection (legacy, but doesn't hurt)
    c.header('X-XSS-Protection', '1; mode=block')
    
    // Referrer Policy
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    // Content Security Policy (adjust for your needs)
    c.header('Content-Security-Policy', "default-src 'self'")
    
    // HSTS (only in production with HTTPS)
    if (c.env.ENVIRONMENT === 'production') {
      c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    }
  }
}
```

### 5.2. CORS Configuration

```typescript
// src/index.ts
import { cors } from 'hono/cors'

app.use('/*', cors({
  origin: (origin) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://your-domain.com'
    ]
    return allowedOrigins.includes(origin) ? origin : allowedOrigins[0]
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 86400,
  credentials: true
}))
```

---

## 6. Input Validation & Sanitization

### 6.1. Validation Best Practices

**Use Zod for all input validation:**

```typescript
import { z } from 'zod'

const createDeedSchema = z.object({
  categoryId: z.string()
    .min(1, 'Category ID required')
    .regex(/^cat_[a-z_]+$/, 'Invalid category ID format'),
  description: z.string()
    .max(500, 'Description too long')
    .optional(),
  performedAt: z.number()
    .int()
    .min(0)
    .max(Date.now() + 86400000, 'Cannot be in the future'), // Allow 1 day ahead for timezone
  isPrivate: z.boolean().default(true)
})
```

### 6.2. Sanitization

**HTML/XSS Prevention:**
- Store data as-is (don't sanitize on input)
- Escape on output (frontend responsibility)
- D1 prepared statements prevent SQL injection automatically

**No eval() or dangerous operations:**
```typescript
// NEVER do this:
eval(userInput)
new Function(userInput)()
```

---

## 7. Authentication Security

### 7.1. JWT Best Practices

**Configuration:**
```typescript
const JWT_CONFIG = {
  algorithm: 'HS256',
  expiresIn: '15m', // Short-lived access token
  issuer: 'good-deeds-api',
  audience: 'good-deeds-app'
}
```

**Payload (minimal):**
```typescript
interface JWTPayload {
  sub: string       // user_id
  email: string
  iat: number
  exp: number
  iss: string
  aud: string
}
```

**Do NOT include in JWT:**
- Sensitive data (password, phone, address)
- User preferences (store in DB)
- Large objects (keep payload small)

### 7.2. Refresh Token Security

```typescript
// Hash refresh token before storing
import { createHash } from 'crypto'

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

// When storing
const refreshToken = generateSecureToken(32) // random 32 bytes
const tokenHash = hashToken(refreshToken)
await db.storeRefreshToken(userId, tokenHash, expiresAt)

// When validating
const receivedHash = hashToken(receivedToken)
const stored = await db.getRefreshToken(receivedHash)
```

### 7.3. Token Rotation

**On refresh:**
1. Validate old refresh token
2. Revoke old refresh token
3. Generate new refresh token
4. Return new access + refresh tokens

**Prevent replay attacks.**

---

## 8. Database Security

### 8.1. Prepared Statements (SQL Injection Prevention)

**Always use:**
```typescript
// GOOD ✅
const user = await db
  .prepare('SELECT * FROM users WHERE id = ?')
  .bind(userId)
  .first()

// BAD ❌ (SQL injection risk)
const user = await db
  .prepare(`SELECT * FROM users WHERE id = '${userId}'`)
  .first()
```

### 8.2. Row-Level Security (Application Layer)

**Always filter by user_id:**
```typescript
// Get deeds - MUST filter by current user
async function getUserDeeds(db: D1Database, userId: string) {
  return await db
    .prepare('SELECT * FROM good_deeds WHERE user_id = ?')
    .bind(userId)
    .all()
}

// Update deed - MUST verify ownership
async function updateDeed(db: D1Database, deedId: string, userId: string, data: any) {
  const deed = await db
    .prepare('SELECT user_id FROM good_deeds WHERE id = ?')
    .bind(deedId)
    .first()
  
  if (!deed || deed.user_id !== userId) {
    throw new AppError('FORBIDDEN', 'Not your deed', 403)
  }
  
  // Now safe to update
  await db
    .prepare('UPDATE good_deeds SET ... WHERE id = ?')
    .bind(...values, deedId)
    .run()
}
```

---

## 9. Secrets Management

### 9.1. Environment Variables

**Never commit secrets to Git:**

```bash
# .gitignore
.env
.dev.vars
wrangler.toml  # if contains secrets (use wrangler secret instead)
```

**Use Cloudflare Secrets:**
```bash
# Production
wrangler secret put JWT_SECRET
wrangler secret put GOOGLE_CLIENT_SECRET

# Dev (local)
# Create .dev.vars file:
JWT_SECRET=your-dev-secret
GOOGLE_CLIENT_SECRET=your-dev-client-secret
```

### 9.2. Secret Rotation

**Regular rotation schedule:**
- JWT_SECRET: Every 90 days (invalidates all tokens)
- OAuth credentials: Yearly or if compromised
- Database credentials: Yearly

**Rotation procedure:**
1. Generate new secret
2. Update in Cloudflare
3. Deploy new code
4. Monitor for errors
5. Update documentation

---

## 10. Logging & Monitoring Security

### 10.1. What to Log

**DO log:**
- Failed login attempts (IP, timestamp)
- Rate limit violations
- Permission denied (403) attempts
- 500 errors
- Suspicious patterns

**DON'T log:**
- Passwords
- Tokens (access, refresh, OAuth)
- Credit card numbers (N/A for this app)
- Full request bodies (may contain sensitive data)

### 10.2. Log Example

```typescript
// Good ✅
console.log('Failed login attempt', {
  ip: clientIp,
  timestamp: Date.now(),
  reason: 'invalid_credentials'
})

// Bad ❌
console.log('Failed login', {
  password: receivedPassword, // NEVER
  token: refreshToken         // NEVER
})
```

---

## 11. Incident Response Plan

### 11.1. If JWT_SECRET is Compromised

1. **Immediate:**
   - Rotate JWT_SECRET via `wrangler secret put JWT_SECRET`
   - Deploy immediately
   - All users will be logged out (acceptable)

2. **Communication:**
   - Notify users if breach is confirmed
   - Request re-login

3. **Investigation:**
   - Review logs for suspicious activity
   - Identify how secret was leaked

### 11.2. If Database is Compromised

1. **Immediate:**
   - Revoke all access credentials
   - Isolate affected systems
   - Create backup of current state

2. **Assessment:**
   - Identify what data was accessed
   - Determine scope of breach

3. **Notification:**
   - Notify affected users within 72 hours (GDPR)
   - Provide guidance on actions to take

### 11.3. If User Account is Compromised

1. **User reports:** "I didn't do this action"
2. **Action:**
   - Revoke all refresh tokens for that user
   - Force re-login
   - Review recent activity
   - Ask user to change password (if applicable)

---

## 12. Security Checklist (Pre-launch)

- [ ] Rate limiting enabled on all endpoints
- [ ] Security headers configured
- [ ] CORS properly configured (whitelist only)
- [ ] All inputs validated with Zod
- [ ] SQL injection prevented (prepared statements)
- [ ] JWT short-lived (15-30 min)
- [ ] Refresh tokens hashed in DB
- [ ] HTTPS only in production
- [ ] Secrets not in Git
- [ ] Error messages don't leak sensitive info
- [ ] Logging doesn't include secrets
- [ ] GDPR compliance (data export, deletion)
- [ ] Incident response plan documented

---

## 13. Testing Security

### 13.1. Manual Tests

**Rate Limiting:**
```bash
# Test auth endpoint rate limit
for i in {1..10}; do
  curl -X POST https://api.example.com/auth/google \
    -H "Content-Type: application/json" \
    -d '{"code":"test","redirectUri":"http://localhost:5173/callback"}'
  sleep 0.5
done
# Should get 429 after 5 requests
```

**SQL Injection:**
```bash
# Try to inject
curl -X GET 'https://api.example.com/deeds?categoryId=cat_body%27%20OR%201=1--'
# Should be safely escaped
```

**JWT Validation:**
```bash
# Try expired token
curl -H "Authorization: Bearer expired_token" \
  https://api.example.com/deeds
# Should get 401 TOKEN_EXPIRED

# Try invalid token
curl -H "Authorization: Bearer random_string" \
  https://api.example.com/deeds
# Should get 401 INVALID_TOKEN
```

### 13.2. Automated Security Testing

**Tools:**
- OWASP ZAP (automated vulnerability scanning)
- Burp Suite (manual security testing)
- npm audit (dependency vulnerabilities)

```bash
# Run npm audit regularly
pnpm audit

# Fix vulnerabilities
pnpm audit fix
```

---

## 14. Kết luận

Security là ongoing process, không phải one-time setup.

**Key principles:**
- ✅ Defense in depth (multiple layers)
- ✅ Least privilege (minimal permissions)
- ✅ Fail securely (errors don't expose data)
- ✅ Regular updates (dependencies, secrets)
- ✅ Monitoring & alerting

Follow tài liệu này để đảm bảo app an toàn cho users.
