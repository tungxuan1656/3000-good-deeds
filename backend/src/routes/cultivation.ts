import { Hono } from 'hono'

import type { DharmaQuote } from '../types'

const app = new Hono<{ Bindings: Env }>()

// Hardcoded quotes for MVP
const MOCK_QUOTES: Omit<DharmaQuote, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'q1',
    content:
      'Hận thù diệt hận thù, đời này không thể có. Từ bi diệt hận thù, là định luật ngàn thu.',
    author: 'Kinh Pháp Cú',
    source: 'Phẩm Song Yếu',
    tagsJson: '["từ bi", "hận thù"]',
  },
  {
    id: 'q2',
    content: 'Hãy tự mình thắp đuốc lên mà đi.',
    author: 'Đức Phật Thích Ca',
    source: 'Kinh Đại Bát Niết Bàn',
    tagsJson: '["tự lực", "tinh tấn"]',
  },
  {
    id: 'q3',
    content: 'Mỉm cười, thở vào. Mỉm cười, thở ra.',
    author: 'Thiền sư Thích Nhất Hạnh',
    source: null,
    tagsJson: '["chánh niệm", "hơi thở"]',
  },
  {
    id: 'q4',
    content: 'Vạn pháp duy tâm tạo.',
    author: 'Kinh Hoa Nghiêm',
    source: null,
    tagsJson: '["tâm", "vạn pháp"]',
  },
  {
    id: 'q5',
    content: 'Phước đức tại mẫu, nhưng cũng do mình tạo.',
    author: 'Dân gian',
    source: null,
    tagsJson: '["phước đức", "nhân quả"]',
  },
]

// Hardcoded random acts
const MOCK_ACTS = [
  'Nhắn tin hỏi thăm một người bạn cũ.',
  'Cười với một người lạ.',
  'Nhặt rác nơi công cộng.',
  'Thầm chúc bình an cho người đang đi trước mặt bạn.',
  'Uống một ly nước thật chậm và biết ơn.',
  'Tha thứ cho lỗi lầm nhỏ của ai đó hôm nay.',
  'Khen ngợi chân thành một đồng nghiệp.',
  'Dành 5 phút ngồi yên không làm gì cả.',
  'Gọi điện về cho bố mẹ.',
  'Lắng nghe ai đó trọn vẹn mà không ngắt lời.',
]

// GET /api/v1/cultivation/quotes/daily
app.get('/quotes/daily', async (c) => {
  // Simple daily rotation based on day of year
  const today = new Date()
  const start = new Date(today.getFullYear(), 0, 0)
  const diff = today.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)

  const quoteIndex = dayOfYear % MOCK_QUOTES.length
  const quote = MOCK_QUOTES[quoteIndex]

  return c.json({
    success: true,
    data: {
      ...quote,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    error: null,
  })
})

// GET /api/v1/cultivation/acts/random
app.get('/acts/random', async (c) => {
  const randomIndex = Math.floor(Math.random() * MOCK_ACTS.length)
  const act = MOCK_ACTS[randomIndex]

  return c.json({
    success: true,
    data: {
      content: act,
    },
    error: null,
  })
})

export default app
