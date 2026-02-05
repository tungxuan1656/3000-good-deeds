# 07. GOALS IMPLEMENTATION GUIDE

Hướng dẫn kỹ thuật triển khai tính năng Goals & Goal History.

> **Tham khảo:** [Feature Spec](../../02_specs/features/04_goals.md) cho business logic và quy tắc chi tiết đầy đủ.

---

## 🔒 QUY TẮC QUAN TRỌNG

**Hệ thống KHÔNG BAO GIỜ tạo goal_history cho period đã qua.**

Chi tiết về business logic, decision flow, và ví dụ xem tại [04_goals.md](../../02_specs/features/04_goals.md#53-khi-user-thêm--xóa-việc-thiện-good_deeds).

---

## 1. Core Functions

### 1.1. `computeLocalPeriods(timestamp, timezone)`
- Input: timestamp (ms), timezone (IANA string)
- Output: `{ local_week, local_month, local_year }`
- Dùng `Intl.DateTimeFormat` cho timezone conversion
- ISO 8601 week calculation

### 1.2. `ensureGoalHistory()`
- ⚠️ CHỈ gọi cho current period
- Check tồn tại → return nếu có
- Tạo mới với `actual_count` = COUNT từ good_deeds
- Set `completed = (actual >= target)`

### 1.3. `updateGoalHistory()`
- Recount deed cho period
- Update `actual_count`, `completed`

### 1.4. `getCurrentPeriod(type, timezone)`
- Return period string hiện tại theo type
- Weekly: `2026-W06`
- Monthly: `2026-02`
- Yearly: `2026`

### 1.5. `handleDeedCreate()` / `handleDeedDelete()` - Integration Point
- `handleDeedCreate`: nếu deed thuộc current period và goal đang bật → tạo history nếu thiếu; sau đó recompute nếu history tồn tại
- `handleDeedDelete`: recompute nếu history tồn tại (không quan tâm goal đang bật)

---

## 2. API Endpoints

### 2.1. `GET /goals`
- Lấy tất cả goals

### 2.2. `POST /goals`
- Validate type, target_count
- Create/Update trong `goals` table
- Enable goal → TẠO goal_history cho current period ngay lập tức
- Disable goal → XÓA goal_history của current period
- Update target_count → recompute current period

### 2.3. `GET /goals/:id/history`
- Lấy lịch sử theo period_time DESC
- Cursor-based pagination (query: `limit`, `cursor`)
- Return: `{ data, pagination: { hasMore, nextCursor, limit } }`

---

## 3. Database Implementation

### 3.1. Schema Details
Xem chi tiết schema tại [01_database_schema.md](01_database_schema.md).

**Key constraints:**
- `goals`: UNIQUE `(user_id, type)`
- `goal_history`: UNIQUE `(user_id, type, period_time)`
- `good_deeds`: Index on `(user_id, local_date)`

### 3.2. Migration Steps

1. Thêm `local_week`, `local_month`, `local_year` vào `good_deeds`
2. Backfill data hiện có
3. Tạo bảng `goals` với constraint
4. Tạo bảng `goal_history` với constraint + indexes

File: `backend/migrations/0004_add_goals_and_goal_history.sql`

---

## 4. Quick Reference

### 4.1. Decision Table

| Scenario    | Period  | History? | Action           |
| ----------- | ------- | -------- | ---------------- |
| Add deed    | Current | No       | CREATE + UPDATE  |
| Add deed    | Current | Yes      | UPDATE           |
| Add deed    | Past    | No       | **KHÔNG LÀM GÌ** |
| Add deed    | Past    | Yes      | UPDATE           |
| Delete deed | Current | No       | **KHÔNG LÀM GÌ** |
| Delete deed | Current | Yes      | UPDATE           |
| Delete deed | Past    | No       | **KHÔNG LÀM GÌ** |
| Delete deed | Past    | Yes      | UPDATE           |

### 4.2. Function Responsibility

| Function                       | CREATE history?                 | UPDATE history?           |
| ------------------------------ | ------------------------------- | ------------------------- |
| `ensureGoalHistory()`          | ✅ (chỉ current period)          | ❌                         |
| `updateGoalHistory()`          | ❌                               | ✅ (bất kỳ period đã có)   |
| `upsertGoal()` (enable)        | ✅ (current period ngay lập tức) | ❌                         |
| `upsertGoal()` (disable)       | ❌ (xóa current period history)  | ❌                         |
| `upsertGoal()` (target change) | ❌                               | ✅ (current period)        |
| `handleDeedCreate()`           | Via `ensureGoalHistory()`       | Via `updateGoalHistory()` |
| `handleDeedDelete()`           | ❌                               | Via `updateGoalHistory()` |

---

## 5. Testing Checklist

### 5.1. Core Functionality
- [ ] Migration chạy thành công
- [ ] Tạo goal với type hợp lệ
- [ ] Reject goal với type không hợp lệ
- [ ] UNIQUE constraint `(user_id, type)` hoạt động
- [ ] Goal history được tạo khi enable goal
- [ ] Thay đổi target chỉ ảnh hưởng current period
- [ ] Disable goal ngừng tạo history mới

### 5.2. Critical: Retroactive History Prevention

**Test Case 1: Thêm deed quá khứ KHÔNG có history**
- Enable goal tuần này
- Thêm deed tuần trước
- ✅ Deed lưu thành công
- ✅ KHÔNG tạo history cho tuần trước
- ✅ Chỉ tuần hiện tại có history

**Test Case 2: Thêm deed quá khứ CÓ history**
- Goal active từ tuần trước
- Thêm deed tuần trước
- ✅ History tuần trước được update
- ✅ `actual_count` tăng đúng

**Test Case 3: Import 100 deed cũ**
- Enable goal tuần này
- Import 100 deed từ 3 tháng trước
- ✅ Tất cả deed được lưu
- ✅ CHỈ tuần hiện tại có history
- ✅ Các tuần cũ KHÔNG có history

**Test Case 4: Goal bật/tắt không liên tục**
- Goal active W04, W05
- Goal disabled W06
- Goal re-enabled W07
- Thêm deed W05 → UPDATE history
- Thêm deed W06 → KHÔNG tạo history
- Thêm deed W07 → CREATE/UPDATE history

---

---

## 7. Deployment

```bash
# 1. Local migration
cd backend
pnpm wrangler d1 execute 3000-good-deeds --local --file=./migrations/0004_add_goals_and_goal_history.sql

# 2. Test
pnpm dev

# 3. Production migration
pnpm wrangler d1 execute 3000-good-deeds --remote --file=./migrations/0004_add_goals_and_goal_history.sql

# 4. Deploy
pnpm deploy
```

---

## 8. Review Checklist

- [ ] `ensureGoalHistory()` KHÔNG BAO GIỜ gọi cho past period
- [ ] Logic so sánh current vs past period chính xác
- [ ] Bulk import không tạo retroactive history
- [ ] Edit deed cũ chỉ update nếu history tồn tại
- [ ] Test 4 test cases chính đều pass
- [ ] Không có SQL query nào tạo history với `period_time < current_period`

---

## 9. Key Question

**"Goal có tồn tại khi period đó đang diễn ra không?"**

- **CÓ** → Update history ✅
- **KHÔNG** → Không làm gì ❌

Không bao giờ tạo history cho period khi goal chưa tồn tại.

---

**Last updated:** 2026-02-05  
**Tham khảo thêm:** [Feature Spec: 04_goals.md](../../02_specs/features/04_goals.md)