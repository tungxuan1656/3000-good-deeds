export const seedCategories = [
  {
    code: 'body',
    name: 'Thân thiện',
    description: 'Hành động cụ thể bằng thân',
    icon: '/icons/icon_than.png',
    style: 'bg-body/20 hover:bg-body/40',
    order_index: 1,
  },
  {
    code: 'speech',
    name: 'Khẩu thiện',
    description: 'Lời nói ái ngữ, chân thật',
    icon: '/icons/icon_khau.png',
    style: 'bg-speech/20 hover:bg-speech/40',
    order_index: 2,
  },
  {
    code: 'mind',
    name: 'Ý thiện',
    description: 'Suy nghĩ lành, buông xả',
    icon: '/icons/icon_y.png',
    style: 'bg-mind/20 hover:bg-mind/40',
    order_index: 3,
  },
]

export const seedAchievements = [
  {
    id: '01KGH777EHT5J81GAABTPMHPFR',
    code: 'FIRST_DEED',
    title: 'Hạt giống đầu tiên',
    description: 'Thực hiện việc thiện đầu tiên của bạn',
    icon_key: 'sprout',
    condition_json: JSON.stringify({ type: 'count_total', value: 1 }),
    order_index: 1,
  },
  {
    id: '01KGH777EHVXYAM7Z5BTX2M51F',
    code: 'STREAK_3',
    title: 'Khởi động đà thiện',
    description: 'Duy trì chuỗi việc thiện trong 3 ngày liên tiếp',
    icon_key: 'flame',
    condition_json: JSON.stringify({ type: 'streak_days', value: 3 }),
    order_index: 2,
  },
  {
    id: '01KGH777EH93MXVHZP19H9F6RV',
    code: 'COUNT_10',
    title: 'Người gieo hạt chăm chỉ',
    description: 'Đạt mốc 10 việc thiện',
    icon_key: 'award',
    condition_json: JSON.stringify({ type: 'count_total', value: 10 }),
    order_index: 3,
  },
]

export const seedQuotes = [
  {
    id: '01KGH777EHEHHDHSY3CPTJ5XQE',
    content:
      'Hận thù diệt hận thù, đời này không thể có. Từ bi diệt hận thù, là định luật ngàn thu.',
    author: 'Kinh Pháp Cú',
    source: 'Phẩm Song Yếu',
  },
  {
    id: '01KGH777EHNDKKDP0Y56NYEC4S',
    content: 'Hãy tự mình thắp đuốc lên mà đi.',
    author: 'Đức Phật Thích Ca',
    source: 'Kinh Đại Bát Niết Bàn',
  },
  {
    id: '01KGH777EJYSGTVG4604G1JN81',
    content: 'Mỉm cười, thở vào. Mỉm cười, thở ra.',
    author: 'Thiền sư Thích Nhất Hạnh',
    source: null,
  },
  {
    id: '01KGH777EJHJDWMP5TJM6EZBQZ',
    content: 'Vạn pháp duy tâm tạo.',
    author: 'Kinh Hoa Nghiêm',
    source: null,
  },
  {
    id: '01KGH777EJ545TPW71AZEA3FEK',
    content: 'Phước đức tại mẫu, nhưng cũng do mình tạo.',
    author: 'Dân gian',
    source: null,
  },
]

export const seedRandomActs = [
  { id: '01KGH777EJ18EXJ5WFEBGA04DW', content: 'Nhắn tin hỏi thăm một người bạn cũ.' },
  { id: '01KGH777EJ6JJ5A5CMJXTBF4C6', content: 'Cười với một người lạ.' },
  { id: '01KGH777EJEMRJKC9NK3G2BZ0S', content: 'Nhặt rác nơi công cộng.' },
  {
    id: '01KGH777EJ2ZM81EWDE6BRG8AX',
    content: 'Thầm chúc bình an cho người đang đi trước mặt bạn.',
  },
  { id: '01KGH777EJCKJQ9N6SS2B6B1TZ', content: 'Uống một ly nước thật chậm và biết ơn.' },
  { id: '01KGH777EJY6WW625X2KG8HRT1', content: 'Tha thứ cho lỗi lầm nhỏ của ai đó hôm nay.' },
  { id: '01KGH777EJQ77NPZ0GK2WXC0AG', content: 'Khen ngợi chân thành một đồng nghiệp.' },
  { id: '01KGH777EJCT5N69ZCPAJJNPHP', content: 'Dành 5 phút ngồi yên không làm gì cả.' },
  { id: '01KGH777EJ2NNM2Y0ZPGEG30MD', content: 'Gọi điện về cho bố mẹ.' },
  { id: '01KGH777EJRAZ4EK22FX4D9VRC', content: 'Lắng nghe ai đó trọn vẹn mà không ngắt lời.' },
]

export async function seed(db: any) {
  console.log('🌱 Seeding Categories...')
  for (const cat of seedCategories) {
    await db
      .prepare(
        `
            INSERT OR REPLACE INTO categories (code, name, description, icon, style, order_index, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
        `,
      )
      .bind(
        cat.code,
        cat.name,
        cat.description,
        cat.icon,
        cat.style,
        cat.order_index,
        Date.now(),
        Date.now(),
      )
      .run()
  }

  console.log('🏆 Seeding Achievements...')
  for (const ach of seedAchievements) {
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
  for (const quote of seedQuotes) {
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
  for (const act of seedRandomActs) {
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
