import * as webpush from 'web-push'

import { getLocalDateStringByTimezone, getZonedTimeParts } from '../utils'

const REMINDER_TITLE = 'Đến giờ ghi nhận việc thiện 🌱'
const REMINDER_BODY = 'Hôm nay bạn muốn ghi lại điều gì để nuôi dưỡng lòng biết ơn?'
const REMINDER_URL = '/'

type ReminderUser = {
  id: string
  reminderTime: string | null
  reminderEnabled: number | boolean
  timezone: string | null
  lastReminderSentAt: number | null
}

type SubscriptionRow = {
  id: string
  endpoint: string
  p256dh: string
  auth: string
}

function toBoolean(value: number | boolean | null | undefined) {
  if (typeof value === 'boolean') return value

  return Boolean(value)
}

function parseReminderTime(reminderTime: string) {
  const [hourRaw, minuteRaw] = reminderTime.split(':')

  return {
    hour: Number(hourRaw),
    minute: Number(minuteRaw),
  }
}

function isTimeMatch(reminderTime: string, timezone: string, timestamp: number) {
  const { hour, minute } = parseReminderTime(reminderTime)
  const localTime = getZonedTimeParts(timezone, timestamp)

  return localTime.hour === hour && localTime.minute === minute
}

async function shouldSkipForToday(db: D1Database, userId: string, localDate: string) {
  const existing = await db
    .prepare('SELECT 1 FROM good_deeds WHERE user_id = ? AND local_date = ? LIMIT 1')
    .bind(userId, localDate)
    .first()

  return Boolean(existing)
}

async function loadSubscriptions(db: D1Database, userId: string): Promise<SubscriptionRow[]> {
  const { results } = await db
    .prepare(
      `SELECT id, endpoint, p256dh, auth
       FROM push_subscriptions
       WHERE user_id = ? AND is_active = 1`,
    )
    .bind(userId)
    .all<SubscriptionRow>()

  return results
}

async function deactivateSubscription(db: D1Database, id: string) {
  await db
    .prepare('UPDATE push_subscriptions SET is_active = 0, updated_at = ? WHERE id = ?')
    .bind(Date.now(), id)
    .run()
}

async function touchUserReminder(db: D1Database, userId: string, timestamp: number) {
  await db
    .prepare('UPDATE users SET last_reminder_sent_at = ?, updated_at = ? WHERE id = ?')
    .bind(timestamp, timestamp, userId)
    .run()
}

function ensureVapidConfigured(env: Env) {
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY || !env.VAPID_SUBJECT) {
    console.warn('VAPID configuration missing. Skipping reminder notifications.')

    return false
  }

  webpush.setVapidDetails(env.VAPID_SUBJECT, env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY)

  return true
}

export async function sendReminderNotifications(env: Env, timestamp: number = Date.now()) {
  if (!ensureVapidConfigured(env)) {
    return
  }

  const { results } = await env.DB.prepare(
    `SELECT id,
            reminder_time as reminderTime,
            reminder_enabled as reminderEnabled,
            timezone,
            last_reminder_sent_at as lastReminderSentAt
     FROM users
     WHERE reminder_enabled = 1
       AND reminder_time IS NOT NULL`,
  ).all<ReminderUser>()

  for (const user of results) {
    if (!toBoolean(user.reminderEnabled)) continue
    if (!user.reminderTime) continue

    const timezone = user.timezone || 'Asia/Ho_Chi_Minh'

    if (!isTimeMatch(user.reminderTime, timezone, timestamp)) {
      continue
    }

    const localDate = getLocalDateStringByTimezone(timezone, timestamp)

    if (user.lastReminderSentAt) {
      const lastDate = getLocalDateStringByTimezone(timezone, user.lastReminderSentAt)
      if (lastDate === localDate) {
        continue
      }
    }

    const alreadyDidToday = await shouldSkipForToday(env.DB, user.id, localDate)
    if (alreadyDidToday) {
      continue
    }

    const subscriptions = await loadSubscriptions(env.DB, user.id)
    if (subscriptions.length === 0) {
      continue
    }

    const payload = JSON.stringify({
      title: REMINDER_TITLE,
      body: REMINDER_BODY,
      url: REMINDER_URL,
    })

    let sentAny = false

    for (const sub of subscriptions) {
      const subscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      }

      try {
        await webpush.sendNotification(subscription, payload, {
          urgency: 'normal',
          TTL: 60 * 60,
        })

        sentAny = true
      } catch (error: any) {
        const statusCode = error?.statusCode ?? error?.status
        if (statusCode === 404 || statusCode === 410) {
          await deactivateSubscription(env.DB, sub.id)
        } else {
          console.error('Failed to send reminder push', error)
        }
      }
    }

    if (sentAny) {
      await touchUserReminder(env.DB, user.id, timestamp)
    }
  }
}
