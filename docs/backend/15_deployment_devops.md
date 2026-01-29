# 15. DEPLOYMENT & DEVOPS

## 1. Mục đích

Tài liệu này hướng dẫn:
- Cách deploy application lên production
- CI/CD pipeline setup
- Environment management
- Rollback procedures
- Monitoring & alerting

---

## 2. Architecture Overview

```
┌─────────────────┐
│   Cloudflare    │
│     Pages       │  ← Frontend (React)
│  (Static Host)  │
└────────┬────────┘
         │
         │ HTTPS
         ▼
┌─────────────────┐
│   Cloudflare    │
│    Workers      │  ← Backend API (Hono)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Cloudflare D1  │  ← Database (SQLite)
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  Cloudflare KV  │  ← Rate limiting, cache
└─────────────────┘
```

**Benefits:**
- Global edge deployment (low latency)
- Auto-scaling
- DDoS protection
- Free tier generous

---

## 3. Environment Strategy

### 3.1. Environments

| Environment    | Purpose          | URL                       |
| -------------- | ---------------- | ------------------------- |
| **Local**      | Development      | http://localhost:5173     |
| **Dev**        | Testing, staging | https://dev.3000deeds.com |
| **Production** | Live users       | https://3000deeds.com     |

### 3.2. Environment Variables

**Backend (Cloudflare Workers):**

| Variable               | Local                 | Dev                       | Production            |
| ---------------------- | --------------------- | ------------------------- | --------------------- |
| `ENVIRONMENT`          | local                 | dev                       | production            |
| `GOOGLE_CLIENT_ID`     | (test)                | (test)                    | (prod)                |
| `GOOGLE_CLIENT_SECRET` | 🔒 secret              | 🔒 secret                  | 🔒 secret              |
| `JWT_SECRET`           | 🔒 secret              | 🔒 secret                  | 🔒 secret              |
| `CORS_ORIGIN`          | http://localhost:5173 | https://dev.3000deeds.com | https://3000deeds.com |

**Frontend (React):**

| Variable                | Local                        | Dev                                  | Production                       |
| ----------------------- | ---------------------------- | ------------------------------------ | -------------------------------- |
| `VITE_API_BASE_URL`     | http://localhost:8787/api/v1 | https://api-dev.3000deeds.com/api/v1 | https://api.3000deeds.com/api/v1 |
| `VITE_GOOGLE_CLIENT_ID` | (test)                       | (test)                               | (prod)                           |
| `VITE_ENVIRONMENT`      | local                        | dev                                  | production                       |

---

## 4. Backend Deployment (Cloudflare Workers)

### 4.1. Prerequisites

```bash
# Install Wrangler CLI
pnpm install -g wrangler

# Login to Cloudflare
wrangler login
```

### 4.2. Setup wrangler.toml

```toml
name = "good-deeds-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"
node_compat = true

# D1 Database
[[d1_databases]]
binding = "DB"
database_name = "good-deeds-db"
database_id = "your-db-id"

# KV Namespace (for rate limiting)
[[kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "your-kv-id"

# Dev environment
[env.dev]
name = "good-deeds-api-dev"
vars = { ENVIRONMENT = "dev" }

[[env.dev.d1_databases]]
binding = "DB"
database_name = "good-deeds-db-dev"
database_id = "your-dev-db-id"

[[env.dev.kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "your-dev-kv-id"

# Production environment
[env.production]
name = "good-deeds-api"
vars = { ENVIRONMENT = "production" }

[[env.production.d1_databases]]
binding = "DB"
database_name = "good-deeds-db"
database_id = "your-prod-db-id"

[[env.production.kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "your-prod-kv-id"
```

### 4.3. Create D1 Databases

```bash
# Dev database
wrangler d1 create good-deeds-db-dev

# Production database
wrangler d1 create good-deeds-db
```

Copy the `database_id` to wrangler.toml.

### 4.4. Create KV Namespaces

```bash
# Dev KV
wrangler kv:namespace create "RATE_LIMIT_KV" --env dev

# Production KV
wrangler kv:namespace create "RATE_LIMIT_KV" --env production
```

### 4.5. Setup Secrets

```bash
# Dev environment
wrangler secret put GOOGLE_CLIENT_SECRET --env dev
wrangler secret put JWT_SECRET --env dev

# Production environment
wrangler secret put GOOGLE_CLIENT_SECRET --env production
wrangler secret put JWT_SECRET --env production
```

### 4.6. Run Migrations

```bash
# Dev
wrangler d1 migrations apply good-deeds-db-dev --env dev

# Production
wrangler d1 migrations apply good-deeds-db --env production
```

### 4.7. Deploy

```bash
# Deploy to dev
pnpm run deploy:dev
# or
wrangler deploy --env dev

# Deploy to production
pnpm run deploy:prod
# or
wrangler deploy --env production
```

### 4.8. Verify Deployment

```bash
# Test dev
curl https://api-dev.3000deeds.com/health

# Test production
curl https://api.3000deeds.com/health
```

---

## 5. Frontend Deployment (Cloudflare Pages)

### 5.1. Build Configuration

**Create `.env.development`:**
```env
VITE_API_BASE_URL=https://api-dev.3000deeds.com/api/v1
VITE_GOOGLE_CLIENT_ID=your-dev-client-id.apps.googleusercontent.com
VITE_ENVIRONMENT=dev
```

**Create `.env.production`:**
```env
VITE_API_BASE_URL=https://api.3000deeds.com/api/v1
VITE_GOOGLE_CLIENT_ID=your-prod-client-id.apps.googleusercontent.com
VITE_ENVIRONMENT=production
```

### 5.2. Deploy via Cloudflare Pages

**Option 1: GitHub Integration (Recommended)**

1. Push code to GitHub
2. Go to Cloudflare Dashboard → Pages
3. Create new project
4. Connect GitHub repository
5. Configure build:
   - **Build command:** `pnpm build`
   - **Build output directory:** `dist`
   - **Root directory:** `frontend`
6. Set environment variables (from `.env.production`)
7. Deploy

**Auto-deploy on:**
- Push to `main` branch → production
- Push to `dev` branch → preview (dev environment)

**Option 2: Wrangler CLI**

```bash
cd frontend

# Build
pnpm build

# Deploy to dev
wrangler pages deploy dist --project-name=good-deeds-dev

# Deploy to production
wrangler pages deploy dist --project-name=good-deeds
```

### 5.3. Custom Domain Setup

1. Go to Pages project → Custom domains
2. Add domain: `3000deeds.com`
3. Add CNAME record in DNS:
   ```
   CNAME 3000deeds.com → your-pages-project.pages.dev
   ```
4. Wait for SSL certificate (automatic)

---

## 6. CI/CD Pipeline (GitHub Actions)

### 6.1. Setup GitHub Secrets

Add to GitHub repository secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `GOOGLE_CLIENT_SECRET_DEV`
- `GOOGLE_CLIENT_SECRET_PROD`
- `JWT_SECRET_DEV`
- `JWT_SECRET_PROD`

### 6.2. Backend CI/CD

**`.github/workflows/backend-deploy.yml`:**

```yaml
name: Deploy Backend

on:
  push:
    branches:
      - main
      - dev
    paths:
      - 'backend/**'
      - '.github/workflows/backend-deploy.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        working-directory: ./backend
        run: pnpm install
      
      - name: Type check
        working-directory: ./backend
        run: pnpm run check
      
      - name: Run tests
        working-directory: ./backend
        run: pnpm test
      
      - name: Deploy to Dev
        if: github.ref == 'refs/heads/dev'
        working-directory: ./backend
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: |
          pnpm wrangler secret put GOOGLE_CLIENT_SECRET --env dev <<< "${{ secrets.GOOGLE_CLIENT_SECRET_DEV }}"
          pnpm wrangler secret put JWT_SECRET --env dev <<< "${{ secrets.JWT_SECRET_DEV }}"
          pnpm wrangler deploy --env dev
      
      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        working-directory: ./backend
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: |
          pnpm wrangler secret put GOOGLE_CLIENT_SECRET --env production <<< "${{ secrets.GOOGLE_CLIENT_SECRET_PROD }}"
          pnpm wrangler secret put JWT_SECRET --env production <<< "${{ secrets.JWT_SECRET_PROD }}"
          pnpm wrangler deploy --env production
      
      - name: Run Smoke Tests
        if: github.ref == 'refs/heads/main'
        run: |
          curl --fail https://api.3000deeds.com/health || exit 1
```

### 6.3. Frontend CI/CD

**`.github/workflows/frontend-deploy.yml`:**

```yaml
name: Deploy Frontend

on:
  push:
    branches:
      - main
      - dev
    paths:
      - 'frontend/**'
      - '.github/workflows/frontend-deploy.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        working-directory: ./frontend
        run: pnpm install
      
      - name: Lint
        working-directory: ./frontend
        run: pnpm lint
      
      - name: Type check
        working-directory: ./frontend
        run: pnpm type-check
      
      - name: Build for Dev
        if: github.ref == 'refs/heads/dev'
        working-directory: ./frontend
        env:
          VITE_API_BASE_URL: https://api-dev.3000deeds.com/api/v1
          VITE_GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID_DEV }}
          VITE_ENVIRONMENT: dev
        run: pnpm build
      
      - name: Build for Production
        if: github.ref == 'refs/heads/main'
        working-directory: ./frontend
        env:
          VITE_API_BASE_URL: https://api.3000deeds.com/api/v1
          VITE_GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID_PROD }}
          VITE_ENVIRONMENT: production
        run: pnpm build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: ${{ github.ref == 'refs/heads/main' && 'good-deeds' || 'good-deeds-dev' }}
          directory: frontend/dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

---

## 7. Database Migrations

### 7.1. Creating Migrations

```bash
cd backend

# Create new migration file
wrangler d1 migrations create good-deeds-db "add_column_to_users"
```

**Edit migration file:**
```sql
-- Migration number: 0002
-- Description: Add notification_on column to users

ALTER TABLE users ADD COLUMN notification_on BOOLEAN DEFAULT 1;
```

### 7.2. Applying Migrations

```bash
# Test locally
wrangler d1 migrations apply DB --local

# Apply to dev
wrangler d1 migrations apply good-deeds-db-dev --env dev

# Apply to production (with backup first!)
wrangler d1 execute good-deeds-db --env production --command "VACUUM INTO '/tmp/backup.db'"
wrangler d1 migrations apply good-deeds-db --env production
```

### 7.3. Rollback Strategy

D1 doesn't support automatic rollback. Manual process:

1. **Before migration:** Export backup
   ```bash
   wrangler d1 execute good-deeds-db --env production --command ".backup backup.db"
   ```

2. **If migration fails:** Restore from backup
   ```bash
   # Restore from backup (manual process)
   # Contact Cloudflare support for critical failures
   ```

3. **Better approach:** Write migrations that are reversible
   ```sql
   -- Forward
   ALTER TABLE users ADD COLUMN new_column TEXT;
   
   -- Backward (if needed, run manually)
   -- ALTER TABLE users DROP COLUMN new_column;
   ```

---

## 8. Monitoring & Alerting

### 8.1. Cloudflare Analytics

**Built-in metrics:**
- Request count
- Error rate (4xx, 5xx)
- Response time (p50, p95, p99)
- Worker execution time
- Geographic distribution

**Access:**
1. Cloudflare Dashboard → Workers → good-deeds-api
2. View Metrics

### 8.2. Custom Logging

**Structured logging:**
```typescript
// src/utils/logger.ts
export function logInfo(message: string, data?: any) {
  console.log(JSON.stringify({
    level: 'info',
    message,
    data,
    timestamp: new Date().toISOString()
  }))
}

export function logError(message: string, error: any, data?: any) {
  console.error(JSON.stringify({
    level: 'error',
    message,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    data,
    timestamp: new Date().toISOString()
  }))
}
```

**View logs:**
```bash
# Tail production logs
wrangler tail --env production

# Filter errors only
wrangler tail --env production --format json | jq 'select(.level == "error")'
```

### 8.3. Error Tracking (Optional: Sentry)

```bash
pnpm add @sentry/node
```

```typescript
// src/index.ts
import * as Sentry from '@sentry/node'

if (c.env.ENVIRONMENT === 'production') {
  Sentry.init({
    dsn: c.env.SENTRY_DSN,
    environment: 'production',
    tracesSampleRate: 0.1
  })
}

// In error handler
Sentry.captureException(error)
```

### 8.4. Uptime Monitoring

**Use external service:**
- UptimeRobot (free)
- Pingdom
- Better Uptime

**Monitor endpoints:**
- `GET https://api.3000deeds.com/health` (every 5 min)
- `GET https://3000deeds.com` (every 5 min)

**Alerts:**
- Email when down
- Slack/Discord webhook

---

## 9. Rollback Procedures

### 9.1. Backend Rollback

**Cloudflare Workers keeps previous versions:**

```bash
# List deployments
wrangler deployments list --env production

# Rollback to previous version
wrangler rollback --message "Rollback due to critical bug" --env production
```

**Or deploy specific version from Git:**
```bash
git checkout <previous-commit-hash>
cd backend
wrangler deploy --env production
git checkout main
```

### 9.2. Frontend Rollback

**Cloudflare Pages keeps deployment history:**

1. Go to Pages project → Deployments
2. Find previous successful deployment
3. Click "Rollback to this deployment"

**Or deploy from Git:**
```bash
git checkout <previous-commit-hash>
cd frontend
pnpm build
wrangler pages deploy dist --project-name=good-deeds
git checkout main
```

### 9.3. Database Rollback

**No automatic rollback.** Prevention is key:

1. Always test migrations in dev first
2. Backup before production migration
3. Write reversible migrations when possible
4. Have manual rollback SQL ready

---

## 10. Disaster Recovery

### 10.1. Database Backup Strategy

**Automated daily backups (via GitHub Actions):**

**`.github/workflows/db-backup.yml`:**
```yaml
name: Database Backup

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:  # Manual trigger

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Backup Production DB
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: |
          # Export database to SQL dump
          wrangler d1 export good-deeds-db --env production --output backup-$(date +%Y%m%d).sql
      
      - name: Upload to S3/Cloud Storage
        # Upload backup file to S3 or Google Cloud Storage
        # Keep last 30 days of backups
```

### 10.2. Recovery Procedure

**If D1 database is lost/corrupted:**

1. **Stop all writes:** Deploy maintenance mode
2. **Restore from backup:**
   ```bash
   wrangler d1 execute good-deeds-db --env production --file backup-YYYYMMDD.sql
   ```
3. **Verify data integrity**
4. **Resume normal operation**

### 10.3. Communication Plan

**If major outage (>30 min):**

1. **Status page:** Update (use Statuspage.io or similar)
2. **Social media:** Post update
3. **Email:** Notify registered users (if applicable)

---

## 11. Performance Optimization

### 11.1. Caching Strategy

**Static assets (Frontend):**
- Cloudflare Pages auto-caches with CDN
- Cache-Control headers configured

**API responses:**
```typescript
// Cache categories (rarely change)
app.get('/categories', async (c) => {
  c.header('Cache-Control', 'public, max-age=3600') // 1 hour
  // ...
})

// Don't cache user-specific data
app.get('/deeds', authMiddleware, async (c) => {
  c.header('Cache-Control', 'private, no-cache')
  // ...
})
```

### 11.2. Database Query Optimization

**Use EXPLAIN QUERY PLAN:**
```sql
EXPLAIN QUERY PLAN
SELECT * FROM good_deeds 
WHERE user_id = ? AND performed_at BETWEEN ? AND ?
ORDER BY performed_at DESC
LIMIT 20;
```

**Ensure indexes are used.**

### 11.3. Bundle Size Optimization (Frontend)

```bash
# Analyze bundle
pnpm build
pnpm vite-bundle-visualizer

# Target: < 200KB initial bundle
```

**Code splitting:**
```tsx
// Lazy load pages
const StatsPage = lazy(() => import('./pages/StatsPage'))
```

---

## 12. Pre-launch Checklist

**Backend:**
- [ ] Secrets configured in production
- [ ] Database migrations applied
- [ ] Seed data loaded (categories)
- [ ] Rate limiting tested
- [ ] CORS configured correctly
- [ ] Error handling tested
- [ ] Monitoring setup
- [ ] Backup strategy in place

**Frontend:**
- [ ] Environment variables correct
- [ ] Google OAuth credentials (production)
- [ ] Error boundaries implemented
- [ ] Loading states for all async operations
- [ ] Offline detection
- [ ] PWA manifest configured

**Infrastructure:**
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] DNS records correct
- [ ] Uptime monitoring active
- [ ] CI/CD pipelines tested

**Documentation:**
- [ ] API documentation published
- [ ] User guide written
- [ ] Privacy policy published
- [ ] Terms of service published

---

## 13. Kết luận

Deployment strategy này đảm bảo:
- ✅ Zero-downtime deployments
- ✅ Easy rollback if issues occur
- ✅ Automated CI/CD
- ✅ Monitoring & alerting
- ✅ Disaster recovery plan

Follow tài liệu này để deploy safely và maintain app lâu dài.
