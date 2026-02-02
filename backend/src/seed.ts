const initialCategories = [
  {
    id: 'cat_body',
    key: 'body',
    name: 'Thân thiện',
    description: 'Hành động cụ thể bằng thân',
    icon_key: 'hand-heart',
    order_index: 1,
  },
  {
    id: 'cat_speech',
    key: 'speech',
    name: 'Khẩu thiện',
    description: 'Lời nói ái ngữ, chân thật',
    icon_key: 'message-circle-heart',
    order_index: 2,
  },
  {
    id: 'cat_mind',
    key: 'mind',
    name: 'Ý thiện',
    description: 'Suy nghĩ lành, buông xả',
    icon_key: 'brain-circuit',
    order_index: 3,
  },
  {
    id: 'cat_patience',
    key: 'patience',
    name: 'Nhẫn nhục',
    description: 'Chấp nhận nghịch cảnh',
    icon_key: 'shield',
    order_index: 4,
  },
  {
    id: 'cat_gratitude',
    key: 'gratitude',
    name: 'Biết ơn',
    description: 'Tri ân người và vật',
    icon_key: 'flower',
    order_index: 5,
  },
]

const initialAchievements = [
  {
    id: 'ach_first_seed',
    code: 'FIRST_DEED',
    title: 'Hạt giống đầu tiên',
    description: 'Thực hiện việc thiện đầu tiên của bạn',
    icon_key: 'sprout',
    condition_json: JSON.stringify({ type: 'count_total', value: 1 }),
    order_index: 1,
  },
  {
    id: 'ach_streak_3',
    code: 'STREAK_3',
    title: 'Khởi động đà thiện',
    description: 'Duy trì chuỗi việc thiện trong 3 ngày liên tiếp',
    icon_key: 'flame',
    condition_json: JSON.stringify({ type: 'streak_days', value: 3 }),
    order_index: 2,
  },
  {
    id: 'ach_count_10',
    code: 'COUNT_10',
    title: 'Người gieo hạt chăm chỉ',
    description: 'Đạt mốc 10 việc thiện',
    icon_key: 'award',
    condition_json: JSON.stringify({ type: 'count_total', value: 10 }),
    order_index: 3,
  },
]

const initialQuotes = [
  {
    id: 'q1',
    content:
      'Hận thù diệt hận thù, đời này không thể có. Từ bi diệt hận thù, là định luật ngàn thu.',
    author: 'Kinh Pháp Cú',
    source: 'Phẩm Song Yếu',
  },
  {
    id: 'q2',
    content: 'Hãy tự mình thắp đuốc lên mà đi.',
    author: 'Đức Phật Thích Ca',
    source: 'Kinh Đại Bát Niết Bàn',
  },
  {
    id: 'q3',
    content: 'Mỉm cười, thở vào. Mỉm cười, thở ra.',
    author: 'Thiền sư Thích Nhất Hạnh',
    source: null,
  },
  {
    id: 'q4',
    content: 'Vạn pháp duy tâm tạo.',
    author: 'Kinh Hoa Nghiêm',
    source: null,
  },
  {
    id: 'q5',
    content: 'Phước đức tại mẫu, nhưng cũng do mình tạo.',
    author: 'Dân gian',
    source: null,
  },
]

const initialRandomActs = [
  { id: 'act_1', content: 'Nhắn tin hỏi thăm một người bạn cũ.' },
  { id: 'act_2', content: 'Cười với một người lạ.' },
  { id: 'act_3', content: 'Nhặt rác nơi công cộng.' },
  { id: 'act_4', content: 'Thầm chúc bình an cho người đang đi trước mặt bạn.' },
  { id: 'act_5', content: 'Uống một ly nước thật chậm và biết ơn.' },
  { id: 'act_6', content: 'Tha thứ cho lỗi lầm nhỏ của ai đó hôm nay.' },
  { id: 'act_7', content: 'Khen ngợi chân thành một đồng nghiệp.' },
  { id: 'act_8', content: 'Dành 5 phút ngồi yên không làm gì cả.' },
  { id: 'act_9', content: 'Gọi điện về cho bố mẹ.' },
  { id: 'act_10', content: 'Lắng nghe ai đó trọn vẹn mà không ngắt lời.' },
]

export async function seed(db: any) {
  console.log('🌱 Seeding Categories...')
  for (const cat of initialCategories) {
    await db
      .prepare(
        `
            INSERT OR REPLACE INTO categories (id, key, name, description, icon_key, order_index, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
        `,
      )
      .bind(
        cat.id,
        cat.key,
        cat.name,
        cat.description,
        cat.icon_key,
        cat.order_index,
        Date.now(),
        Date.now(),
      )
      .run()
  }

  console.log('🏆 Seeding Achievements...')
  for (const ach of initialAchievements) {
    await db
      .prepare(
        `
            INSERT OR REPLACE INTO achievement_definitions (id, code, title, description, icon_key, condition_json, order_index, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
        `,
      )
      .bind(
        ach.id,
        ach.code,
        ach.title,
        ach.description,
        ach.icon_key,
        ach.condition_json,
        ach.order_index,
        Date.now(),
        Date.now(),
      )
      .run()
  }

  console.log('📖 Seeding Dharma Quotes...')
  for (const quote of initialQuotes) {
    await db
      .prepare(
        `
            INSERT OR REPLACE INTO dharma_quotes (id, content, author, source, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `,
      )
      .bind(quote.id, quote.content, quote.author, quote.source, Date.now(), Date.now())
      .run()
  }

  console.log('✨ Seeding Random Acts...')
  for (const act of initialRandomActs) {
    await db
      .prepare(
        `
            INSERT OR REPLACE INTO random_acts (id, content, created_at, updated_at)
            VALUES (?, ?, ?, ?)
        `,
      )
      .bind(act.id, act.content, Date.now(), Date.now())
      .run()
  }

  console.log('✅ Seeding completed.')
}
