// Lấy calendar data cho Activities screen
export async function getCalendar(
  db: D1Database,
  userId: number,
  fromMonth: string,
  toMonth: string,
): Promise<any> {
  // Parse from/to month (format: YYYY-MM)
  const [fromYear, fromMonthNum] = fromMonth.split('-').map(Number)
  const [toYear, toMonthNum] = toMonth.split('-').map(Number)

  const fromTimestamp = new Date(fromYear, fromMonthNum - 1, 1).getTime()
  const toTimestamp = new Date(toYear, toMonthNum, 1).getTime()

  // Query tối ưu: lấy tất cả thông tin trong 1 câu query duy nhất
  // Sử dụng window function để lấy post cuối cùng của mỗi ngày
  const dailyPosts = await db
    .prepare(
      `WITH ranked_posts AS (
        SELECT 
          date(created_at / 1000, 'unixepoch') as date,
          id,
          media_url,
          created_at,
          ROW_NUMBER() OVER (
            PARTITION BY date(created_at / 1000, 'unixepoch')
            ORDER BY created_at DESC
          ) as rn
        FROM posts
        WHERE user_id = ? 
          AND created_at >= ? 
          AND created_at < ? 
          AND deleted_at IS NULL
      )
      SELECT 
        rp.date,
        rp.id as postId,
        rp.media_url as mediaUrl,
        COUNT(*) OVER (PARTITION BY rp.date) as count
      FROM ranked_posts rp
      WHERE rp.rn = 1
      ORDER BY rp.date DESC`,
    )
    .bind(userId, fromTimestamp, toTimestamp)
    .all<{ date: string; postId: number; mediaUrl: string; count: number }>()

  // Group theo tháng
  const monthsMap: Map<
    string,
    { date: string; postId: number; mediaUrl: string; count: number }[]
  > = new Map()

  for (const day of dailyPosts.results) {
    const [year, month] = day.date.split('-')
    const monthKey = `${year}-${month}`
    if (!monthsMap.has(monthKey)) monthsMap.set(monthKey, [])
    monthsMap.get(monthKey)!.push({
      date: day.date,
      postId: day.postId,
      mediaUrl: day.mediaUrl,
      count: day.count,
    })
  }

  // Format output
  const months = []
  for (const [monthKey, daysArr] of monthsMap.entries()) {
    months.push({
      month: monthKey,
      days: daysArr,
    })
  }

  return { months }
}

// Tính streak (chuỗi ngày đăng liên tục)
export async function getStreak(
  db: D1Database,
  userId: number,
): Promise<{ currentStreak: number; totalPosts: number }> {
  // Lấy tất cả ngày có post
  const posts = await db
    .prepare(
      `SELECT DISTINCT date(created_at / 1000, 'unixepoch') as date
       FROM posts
       WHERE user_id = ? AND deleted_at IS NULL
       ORDER BY date DESC`,
    )
    .bind(userId)
    .all<{ date: string }>()

  const dates = posts.results.map((r) => r.date)

  // Tính current streak
  let currentStreak = 0
  if (dates.length > 0) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let checkDate = new Date(today)
    for (let i = 0; i < dates.length; i++) {
      const postDate = new Date(dates[i])
      const checkDateStr = checkDate.toISOString().split('T')[0]
      const postDateStr = postDate.toISOString().split('T')[0]

      if (checkDateStr === postDateStr) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else if (postDate < checkDate) {
        // Nếu postDate nhỏ hơn checkDate (tức là bị ngắt quãng), dừng lại
        // Tuy nhiên, cần xử lý trường hợp hôm nay chưa đăng nhưng hôm qua đã đăng
        // Logic hiện tại: checkDate bắt đầu từ hôm nay.
        // Nếu hôm nay không có post, checkDateStr != postDateStr.
        // Nếu postDateStr là hôm qua, thì vẫn tính streak nếu ta cho phép miss hôm nay?
        // Nhưng yêu cầu streak thường là liên tục.
        // Nếu hôm nay chưa đăng, streak tính đến hôm qua?
        // Thường thì streak tính đến ngày gần nhất liên tục.
        // Nếu hôm nay chưa đăng, streak vẫn giữ nguyên nếu hôm qua có đăng?
        // Hay reset về 0?
        // Với Locket, nếu hôm nay chưa đăng, streak vẫn hiển thị số của hôm qua (nếu chưa hết ngày).
        // Nhưng để đơn giản, ta cứ đếm liên tục lùi dần.
        // Nếu hôm nay không có, thử check hôm qua.
        if (i === 0 && currentStreak === 0) {
          // First iteration, today has no post.
          // Check if this post is yesterday.
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().split('T')[0]
          if (postDateStr === yesterdayStr) {
            currentStreak++
            checkDate = new Date(yesterday)
            checkDate.setDate(checkDate.getDate() - 1)
            continue
          }
        }
        break
      }
    }
  }

  // Tính tổng số bài post
  const totalPostsResult = await db
    .prepare(
      `SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND deleted_at IS NULL`,
    )
    .bind(userId)
    .first<{ count: number }>()

  const totalPosts = totalPostsResult?.count || 0

  return {
    currentStreak,
    totalPosts,
  }
}
