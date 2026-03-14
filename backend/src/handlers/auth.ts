import { SignJWT } from 'jose'

import type { AuthResponse, GoogleAuthRequest, GoogleTokenResponse, GoogleUserInfo } from '../types'
import { generateId, getCurrentTimestamp } from '../utils'
import { getUser } from './users'

const JWT_SECRET = 'your-secret-key-change-me' // TODO: Move to Env
const TOKEN_EXPIRY = '1m'
const REFRESH_TOKEN_EXPIRY_DAYS = 30

type LoginWithGoogleResult = AuthResponse & {
  refreshToken: string
}

// Helper: Generate JWT
async function generateAccessToken(userId: string, secret: string) {
  const secretKey = new TextEncoder().encode(secret)

  return await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(secretKey)
}

// Helper: Generate Refresh Token (opaque or JWT) -> We use opaque random string
function generateRefreshToken() {
  return crypto.randomUUID()
}

type RefreshTokenRecord = {
  user_id: string
  expires_at: number
}

async function getValidRefreshToken(
  db: D1Database,
  refreshToken: string,
): Promise<RefreshTokenRecord> {
  const storedToken = await db
    .prepare(
      'SELECT user_id, expires_at FROM refresh_tokens WHERE token_hash = ? AND revoked_at IS NULL',
    )
    .bind(refreshToken)
    .first<RefreshTokenRecord>()

  if (!storedToken) {
    throw new Error('Refresh token không hợp lệ')
  }

  if (storedToken.expires_at < getCurrentTimestamp()) {
    throw new Error('Refresh token đã hết hạn')
  }

  return storedToken
}

// Google Login Handler
export async function loginWithGoogle(
  db: D1Database,
  env: Env, // We expect GOOGLE_CLIENT_ID/SECRET here
  body: GoogleAuthRequest,
): Promise<LoginWithGoogleResult> {
  const { code, redirectUri } = body

  // 1. Exchange code for Google Token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri || '', // Must match frontend
      grant_type: 'authorization_code',
    }),
  })

  const tokenData: GoogleTokenResponse = await tokenResponse.json()

  if (!tokenResponse.ok) {
    throw new Error('Thất bại khi trao đổi mã Google: ' + JSON.stringify(tokenData))
  }

  // 2. Get User Info
  const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })

  const googleUser: GoogleUserInfo = await userResponse.json()

  if (!userResponse.ok) {
    throw new Error('Không thể lấy thông tin người dùng từ Google')
  }

  // 3. Find or Create User
  // Check oauth_accounts first potentially, or just by email + provider?
  // Our schema has oauth_accounts.

  let userId: string | null = null

  const oauthAccount = await db
    .prepare('SELECT user_id FROM oauth_accounts WHERE provider = ? AND provider_user_id = ?')
    .bind('google', googleUser.id)
    .first<{ user_id: string }>()

  const now = getCurrentTimestamp()

  if (oauthAccount) {
    userId = oauthAccount.user_id
  } else {
    // Check if user exists by email (link account)
    const existingUser = await db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(googleUser.email)
      .first<{ id: string }>()

    if (existingUser) {
      userId = existingUser.id
    } else {
      // Create new user
      userId = generateId()

      await db
        .prepare(
          `
            INSERT INTO users (id, email, display_name, avatar_url, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `,
        )
        .bind(userId, googleUser.email, googleUser.name, googleUser.picture, now, now)
        .run()
    }

    // Create OAuth Account Link
    await db
      .prepare(
        `
        INSERT INTO oauth_accounts (id, user_id, provider, provider_user_id, provider_email, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    `,
      )
      .bind(generateId(), userId, 'google', googleUser.id, googleUser.email, now)
      .run()
  }

  // 4. Issue Tokens
  // Revoke old refresh tokens? Or allow multiple devices? MVP: Allow multiple.
  const accessToken = await generateAccessToken(userId!, env.JWT_SECRET || JWT_SECRET)
  const refreshToken = generateRefreshToken()
  const refreshTokenExpiry = now + REFRESH_TOKEN_EXPIRY_DAYS * 86400 * 1000

  // Hash refresh token before storing? Good practice. MVP: Store plain.
  await db
    .prepare(
      `
    INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?)
  `,
    )
    .bind(generateId(), userId, refreshToken, refreshTokenExpiry, now)
    .run()

  const user = await getUser(db, userId!)

  return {
    accessToken,
    refreshToken,
    user,
    expiresIn: 3600, // approximate for frontend
  }
}

export async function refreshAccessToken(
  db: D1Database,
  env: Env,
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const storedToken = await getValidRefreshToken(db, refreshToken)
  const now = getCurrentTimestamp()
  const nextRefreshToken = generateRefreshToken()
  const refreshTokenExpiry = now + REFRESH_TOKEN_EXPIRY_DAYS * 86400 * 1000

  const result = await db
    .prepare(
      'UPDATE refresh_tokens SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL AND expires_at >= ?',
    )
    .bind(now, refreshToken, now)
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
    .bind(generateId(), storedToken.user_id, nextRefreshToken, refreshTokenExpiry, now)
    .run()

  const accessToken = await generateAccessToken(storedToken.user_id, env.JWT_SECRET || JWT_SECRET)

  return {
    accessToken,
    refreshToken: nextRefreshToken,
  }
}

export async function logout(db: D1Database, refreshToken: string) {
  await db
    .prepare('UPDATE refresh_tokens SET revoked_at = ? WHERE token_hash = ?')
    .bind(getCurrentTimestamp(), refreshToken)
    .run()
}
