import { readFileSync } from 'node:fs'
import path from 'node:path'

import type { NextConfig } from 'next'

const packageJson = JSON.parse(
  readFileSync(path.resolve('./package.json'), 'utf8'),
) as { version?: string }

const getPublicEnv = (key: string) =>
  process.env[`NEXT_PUBLIC_${key}`] || process.env[`VITE_${key}`] || ''

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version ?? '0.0.0',
    NEXT_PUBLIC_API_URL: getPublicEnv('API_URL'),
    NEXT_PUBLIC_SUPPORT_EMAIL: getPublicEnv('SUPPORT_EMAIL'),
    NEXT_PUBLIC_SITE_URL: getPublicEnv('SITE_URL'),
    NEXT_PUBLIC_FIREBASE_API_KEY: getPublicEnv('FIREBASE_API_KEY'),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: getPublicEnv('FIREBASE_AUTH_DOMAIN'),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: getPublicEnv('FIREBASE_PROJECT_ID'),
    NEXT_PUBLIC_FIREBASE_APP_ID: getPublicEnv('FIREBASE_APP_ID'),
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ]
  },
}

export default nextConfig
