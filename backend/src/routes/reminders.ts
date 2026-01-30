import { Hono } from 'hono'

import { getUser, updateUser } from '../handlers/users'
import { authMiddleware } from '../middlewares/auth'
import type { UpdateUserRequest } from '../types'
import { ErrorCodes, errorResponse, successResponse } from '../utils'

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

export default reminders
