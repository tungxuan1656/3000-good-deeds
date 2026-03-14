import { createRemoteJWKSet, jwtVerify, SignJWT } from 'jose'

import type {
  AuthResponse,
  IdentityProvider,
  ProviderExchangeRequest,
  RefreshTokenRequest,
} from '../types'
import { generateId, getCurrentTimestamp } from '../utils'
import { getUser } from './users'

const ACCESS_TOKEN_EXPIRY = '24h'
const ACCESS_TOKEN_EXPIRES_IN = 24 * 60 * 60
const REFRESH_TOKEN_EXPIRY_DAYS = 30
const FIREBASE_JWKS_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'

const firebaseJwks = createRemoteJWKSet(new URL(FIREBASE_JWKS_URL))

type LoginWithProviderResult = AuthResponse & {
  refreshToken: string
}

type RefreshTokenRecord = {
  user_id: string
  expires_at: number
}

type IdentityAccountRecord = {
  user_id: string
}

type UserLookupRecord = {
  id: string
}

type NormalizedIdentity = {
  provider: IdentityProvider
  providerUserId: string
  email: string
  displayName: string | null
  emailVerified: boolean
}

async function hashToken(rawToken: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(rawToken))

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function requireEnvValue(value: string | undefined, key: string): string {
  if (!value) {
    throw new Error(`Thiếu cấu hình môi trường: ${key}`)
  }

  return value
}

async function generateAccessToken(userId: string, secret: string) {
  const secretKey = new TextEncoder().encode(secret)

  return await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(secretKey)
}

function generateRefreshToken() {
  return crypto.randomUUID()
}

async function issueSessionTokens(
  db: D1Database,
  userId: string,
  jwtSecret: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const now = getCurrentTimestamp()
  const refreshToken = generateRefreshToken()
  const refreshTokenExpiry = now + REFRESH_TOKEN_EXPIRY_DAYS * 86400 * 1000
  const refreshTokenHash = await hashToken(refreshToken)

  await db
    .prepare(
      `
      INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?)
    `,
    )
    .bind(generateId(), userId, refreshTokenHash, refreshTokenExpiry, now)
    .run()

  const accessToken = await generateAccessToken(userId, jwtSecret)

  return { accessToken, refreshToken }
}

async function verifyFirebaseIdentityToken(
  idToken: string,
  projectId: string,
): Promise<NormalizedIdentity> {
  const issuer = `https://securetoken.google.com/${projectId}`
  const { payload } = await jwtVerify(idToken, firebaseJwks, {
    audience: projectId,
    issuer,
  })

  if (!payload.sub || typeof payload.sub !== 'string') {
    throw new Error('Thiếu định danh người dùng trong Firebase token')
  }

  if (!payload.email || typeof payload.email !== 'string') {
    throw new Error('Firebase token không chứa email hợp lệ')
  }

  return {
    provider: 'firebase',
    providerUserId: payload.sub,
    email: payload.email,
    displayName: typeof payload.name === 'string' ? payload.name : null,
    emailVerified: Boolean(payload.email_verified),
  }
}

async function resolveIdentity(
  body: ProviderExchangeRequest,
  projectId: string,
): Promise<NormalizedIdentity> {
  if (body.provider !== 'firebase') {
    throw new Error('Provider chưa được hỗ trợ')
  }

  return await verifyFirebaseIdentityToken(body.idToken, projectId)
}

async function findOrCreateUser(db: D1Database, identity: NormalizedIdentity): Promise<string> {
  const now = getCurrentTimestamp()

  const account = await db
    .prepare(
      `
      SELECT user_id
      FROM identity_accounts
      WHERE provider = ? AND provider_user_id = ?
    `,
    )
    .bind(identity.provider, identity.providerUserId)
    .first<IdentityAccountRecord>()

  let userId = account?.user_id ?? null

  if (!userId) {
    const existingUser = await db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(identity.email)
      .first<UserLookupRecord>()

    if (existingUser) {
      userId = existingUser.id
    } else {
      userId = generateId()

      await db
        .prepare(
          `
          INSERT INTO users (id, email, display_name, email_verified_at, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        )
        .bind(
          userId,
          identity.email,
          identity.displayName ?? identity.email.split('@')[0],
          identity.emailVerified ? now : null,
          now,
          now,
        )
        .run()
    }

    await db
      .prepare(
        `
        INSERT INTO identity_accounts
          (id, user_id, provider, provider_user_id, provider_email, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      )
      .bind(
        generateId(),
        userId,
        identity.provider,
        identity.providerUserId,
        identity.email,
        now,
        now,
      )
      .run()
  }

  await db
    .prepare(
      `
      UPDATE users
      SET
        display_name = COALESCE(?, display_name),
        email_verified_at = CASE
          WHEN ? = 1 THEN COALESCE(email_verified_at, ?)
          ELSE email_verified_at
        END,
        updated_at = ?
      WHERE id = ?
    `,
    )
    .bind(identity.displayName, identity.emailVerified ? 1 : 0, now, now, userId)
    .run()

  return userId
}

async function getValidRefreshToken(
  db: D1Database,
  refreshToken: string,
): Promise<RefreshTokenRecord & { tokenHash: string }> {
  const tokenHash = await hashToken(refreshToken)
  const storedToken = await db
    .prepare(
      `
      SELECT user_id, expires_at
      FROM refresh_tokens
      WHERE token_hash = ? AND revoked_at IS NULL
    `,
    )
    .bind(tokenHash)
    .first<RefreshTokenRecord>()

  if (!storedToken) {
    throw new Error('Refresh token không hợp lệ')
  }

  if (storedToken.expires_at < getCurrentTimestamp()) {
    throw new Error('Refresh token đã hết hạn')
  }

  return { ...storedToken, tokenHash }
}

export async function exchangeProviderToken(
  db: D1Database,
  env: Env,
  body: ProviderExchangeRequest,
): Promise<LoginWithProviderResult> {
  const jwtSecret = requireEnvValue(env.JWT_SECRET, 'JWT_SECRET')
  const firebaseProjectId = requireEnvValue(env.FIREBASE_PROJECT_ID, 'FIREBASE_PROJECT_ID')
  const identity = await resolveIdentity(body, firebaseProjectId)
  const userId = await findOrCreateUser(db, identity)
  const { accessToken, refreshToken } = await issueSessionTokens(db, userId, jwtSecret)
  const user = await getUser(db, userId)

  return {
    accessToken,
    refreshToken,
    user,
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  }
}

export async function refreshAccessToken(
  db: D1Database,
  env: Env,
  refreshToken: RefreshTokenRequest['refreshToken'],
): Promise<{ accessToken: string; refreshToken: string }> {
  const jwtSecret = requireEnvValue(env.JWT_SECRET, 'JWT_SECRET')
  const storedToken = await getValidRefreshToken(db, refreshToken)
  const now = getCurrentTimestamp()
  const nextRefreshToken = generateRefreshToken()
  const nextRefreshTokenHash = await hashToken(nextRefreshToken)
  const refreshTokenExpiry = now + REFRESH_TOKEN_EXPIRY_DAYS * 86400 * 1000

  const result = await db
    .prepare(
      `
      UPDATE refresh_tokens
      SET revoked_at = ?
      WHERE token_hash = ? AND revoked_at IS NULL AND expires_at >= ?
    `,
    )
    .bind(now, storedToken.tokenHash, now)
    .run()

  if (result.meta.changes === 0) {
    throw new Error('Refresh token đã được sử dụng hoặc không hợp lệ')
  }

  await db
    .prepare(
      `
      INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?)
    `,
    )
    .bind(generateId(), storedToken.user_id, nextRefreshTokenHash, refreshTokenExpiry, now)
    .run()

  const accessToken = await generateAccessToken(storedToken.user_id, jwtSecret)

  return {
    accessToken,
    refreshToken: nextRefreshToken,
  }
}

export async function logout(db: D1Database, refreshToken: string) {
  const tokenHash = await hashToken(refreshToken)

  await db
    .prepare('UPDATE refresh_tokens SET revoked_at = ? WHERE token_hash = ?')
    .bind(getCurrentTimestamp(), tokenHash)
    .run()
}
