# Vercel + Firebase Unified Routing Plan

## Purpose

Define one production-ready routing strategy so users can enter from both:

- `https://3000-viec-thien.vercel.app` (SEO landing + app entry)
- `https://3000-viec-thien.web.app` (direct app entry)

and still have a consistent app experience at `/app`.

## Scope

- `landing-page` (Next.js, deployed on Vercel)
- `frontend` (Vite React app, deployed on Firebase Hosting)
- Routing, SEO, deployment, smoke test, rollback

Out of scope:

- Migrating frontend from Vite to Next.js
- Backend API changes

## Final Architecture (Recommended)

### Public behavior

- Vercel domain:
  - `/` => SEO landing page (Next.js)
  - `/app` and `/app/*` => reverse proxy to Firebase app
- Firebase domain:
  - `/app` and `/app/*` => frontend app
  - `/` => 302 redirect to `/app`

### Why this architecture

- Keep current deployment pipelines (low migration risk).
- Keep SEO pages on Next.js root path.
- Allow users from either domain to reach the same app path.
- Keep future option to migrate app to Next.js later.

## URL Matrix (Must Pass)

| Input URL | Expected Result |
|---|---|
| `https://3000-viec-thien.vercel.app/` | Landing page rendered (indexable) |
| `https://3000-viec-thien.vercel.app/app` | Frontend app home rendered |
| `https://3000-viec-thien.vercel.app/app/login` | Frontend login rendered |
| `https://3000-viec-thien.web.app/` | Redirect 302 -> `https://3000-viec-thien.web.app/app` |
| `https://3000-viec-thien.web.app/app` | Frontend app home rendered |
| `https://3000-viec-thien.web.app/app/timeline` | Frontend timeline rendered |

## Required Implementation Changes

### 1) Frontend (Vite + React Router) must be subpath-aware

Set app base path to `/app` and make all runtime URLs subpath-safe:

- Router:
  - Use `basename="/app"` in `BrowserRouter`.
- Vite config:
  - Set `base: '/app/'`.
  - Ensure build output layout can serve static files under `/app/*`.
- PWA:
  - Manifest `id`, `start_url`, `scope` => `/app/`.
  - Service worker registration URL must resolve under `/app`.
  - Push notification click target default should open `/app/`.
- Static assets:
  - Remove hardcoded root-only assumptions that break under subpath.

### 2) Firebase Hosting serves app at `/app`

Use hosting rules so Firebase domain works as direct app entry:

- Rewrite SPA routes only under `/app/**`.
- Keep static assets under `/app/*` reachable without rewrite loops.
- Redirect root `/` -> `/app` (302).

### 3) Vercel routes `/app/*` to Firebase app

In `landing-page` deployment:

- Keep Next.js pages for SEO at root (`/`, content pages, sitemap, robots).
- Add rewrite/proxy:
  - `/app` -> `https://3000-viec-thien.web.app/app`
  - `/app/:path*` -> `https://3000-viec-thien.web.app/app/:path*`

This keeps user URL on Vercel while app content comes from Firebase.

## SEO and Indexing Rules

- Landing page routes on Vercel remain indexable.
- App routes (`/app`, `/app/*`) should be treated as non-SEO app surface:
  - prefer `noindex` on app shell responses if possible.
- Keep canonical for landing pages to Vercel URLs.
- Keep `sitemap.xml` and `robots.txt` served from Vercel landing app.

## Deployment Order

1. Deploy frontend to Firebase with `/app` support.
2. Validate Firebase URLs (`/app`, `/app/login`, `/app/timeline`).
3. Deploy landing-page to Vercel with `/app` rewrite.
4. Validate Vercel URLs (`/`, `/app`, `/app/login`, hard refresh on deep link).

## Smoke Test Checklist

- Navigation:
  - Open from Vercel `/app` and move across app tabs.
  - Open from Firebase `/app` and move across app tabs.
- Refresh:
  - Hard refresh at `/app/login` and `/app/timeline` on both domains.
- Auth:
  - Login, logout, token refresh flow.
  - Forced 401 redirects user to `/app/login` correctly.
- PWA:
  - Service worker registration success.
  - Install prompt and icon loading.
  - Push notification click opens app route under `/app`.
- Analytics/UTM:
  - Landing CTA to `/app` preserves tracking params where required.

## Rollback Plan

If rewrite/proxy causes regression:

1. Remove Vercel `/app` rewrite.
2. Change landing CTA to direct Firebase app URL:
   - `https://3000-viec-thien.web.app/app`
3. Keep Firebase app serving at `/app` (no user downtime for app).

## Operational Notes

- Keep Firebase domain as technical fallback for incident handling.
- Monitor 404/5xx for:
  - `/app/*`
  - service worker files
  - app static assets under `/app/*`
- Document final config in both:
  - `landing-page/docs/`
  - `frontend/docs/`

