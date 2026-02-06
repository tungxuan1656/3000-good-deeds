import { Hono } from 'hono'

import { getUser, updateUser } from '../handlers/users'
import { authMiddleware } from '../middlewares/auth'
import type { PushSubscriptionPayload, UpdateUserRequest } from '../types'
import {
  ErrorCodes,
  errorResponse,
  generateId,
  getCurrentTimestamp,
  successResponse,
} from '../utils'

const reminders = new Hono<{ Bindings: Env; Variables: { user: any } }>()

reminders.use('/*', authMiddleware)

reminders.get('/settings', async (c) => {
  const currentUser = c.get('user')
  // Return just the reminder settings from user profile
  const user = await getUser(c.env.DB, currentUser.id)

  return c.json(
    successResponse({
      reminderEnabled: user.reminderEnabled,
      reminderTime: user.reminderTime,
    }),
  )
})

reminders.put('/settings', async (c) => {
  const currentUser = c.get('user')
  const body = await c.req.json<{ reminderEnabled?: boolean; reminderTime?: string }>()

  if (body.reminderEnabled === undefined && body.reminderTime === undefined) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Không có cấu hình nào được cung cấp'), 400)
  }

  const updateBody: UpdateUserRequest = {
    reminderEnabled: body.reminderEnabled,
    reminderTime: body.reminderTime,
  }

  await updateUser(c.env.DB, currentUser.id, updateBody)

  return c.json(successResponse({ success: true }))
})

reminders.get('/push-key', async (c) => {
  if (!c.env.VAPID_PUBLIC_KEY) {
    return c.json(errorResponse(ErrorCodes.INTERNAL_ERROR, 'Missing VAPID public key'), 500)
  }

  return c.json(successResponse({ publicKey: c.env.VAPID_PUBLIC_KEY }))
})

reminders.post('/subscriptions', async (c) => {
  const currentUser = c.get('user')
  const body = await c.req.json<PushSubscriptionPayload>()

  if (!body?.endpoint || !body?.keys?.p256dh || !body?.keys?.auth) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Subscription payload không hợp lệ'), 400)
  }

  const now = getCurrentTimestamp()

  const existing = await c.env.DB.prepare(
    'SELECT id FROM push_subscriptions WHERE user_id = ? AND endpoint = ?',
  )
    .bind(currentUser.id, body.endpoint)
    .first<{ id: string }>()

  if (existing?.id) {
    await c.env.DB.prepare(
      `UPDATE push_subscriptions
       SET p256dh = ?, auth = ?, expiration_time = ?, user_agent = ?, platform = ?, is_active = 1, updated_at = ?
       WHERE id = ?`,
    )
      .bind(
        body.keys.p256dh,
        body.keys.auth,
        body.expirationTime ?? null,
        body.userAgent ?? null,
        body.platform ?? null,
        now,
        existing.id,
      )
      .run()
  } else {
    await c.env.DB.prepare(
      `INSERT INTO push_subscriptions
        (id, user_id, endpoint, p256dh, auth, expiration_time, user_agent, platform, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
    )
      .bind(
        generateId(),
        currentUser.id,
        body.endpoint,
        body.keys.p256dh,
        body.keys.auth,
        body.expirationTime ?? null,
        body.userAgent ?? null,
        body.platform ?? null,
        now,
        now,
      )
      .run()
  }

  return c.json(successResponse({ success: true }))
})

reminders.delete('/subscriptions', async (c) => {
  const currentUser = c.get('user')
  const body = await c.req.json<{ endpoint?: string }>()

  if (!body?.endpoint) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Thiếu endpoint subscription'), 400)
  }

  await c.env.DB.prepare('DELETE FROM push_subscriptions WHERE user_id = ? AND endpoint = ?')
    .bind(currentUser.id, body.endpoint)
    .run()

  return c.json(successResponse({ success: true }))
})

export default reminders
