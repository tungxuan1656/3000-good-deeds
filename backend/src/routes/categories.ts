import { Hono } from 'hono'

import { getCategories } from '../handlers/categories'
import { authMiddleware } from '../middlewares/auth'
import { successResponse } from '../utils'

const categories = new Hono<{ Bindings: Env; Variables: { user: any } }>()

categories.use('/*', authMiddleware)

categories.get('/', async (c) => {
    const result = await getCategories(c.env.DB)
    return c.json(successResponse(result))
})

export default categories

