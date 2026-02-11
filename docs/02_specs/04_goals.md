# 04. MỤC TIÊU & LỊCH SỬ MỤC TIÊU (GOALS & GOAL HISTORY)

Tính năng Mục tiêu giúp người dùng **định hướng việc tu tập theo chu kỳ dài**, quan sát tiến trình của mình một cách nhẹ nhàng, không áp lực, không phán xét.

---

## 1. Triết lý thiết kế

### 1.1. Mục tiêu không phải để "hoàn thành task"
Mục tiêu trong ứng dụng **3000 Việc Thiện** không nhằm:
- ép buộc hành vi
- tạo áp lực phải đạt
- so sánh giữa các giai đoạn

Mục tiêu chỉ đóng vai trò:
- **định hướng**
- **phản chiếu**
- **nhắc nhở nhẹ nhàng**

> Một tuần trôi qua không trọn vẹn vẫn là một tuần đã sống.

---

### 1.2. Không hình phạt – Không guilt-tripping
- Không có trạng thái "thất bại"
- Không thông báo tiêu cực
- Không reset hay xóa lịch sử vì "không đạt"

Lịch sử mục tiêu là **ghi nhận trung thực**, không phải bảng điểm.

---

## 2. Các loại mục tiêu (Goal Types)

Hệ thống hỗ trợ **3 loại mục tiêu**, bỏ qua mục tiêu hàng ngày để tránh áp lực không cần thiết.

| Type      | Mô tả                                   |
| --------- | --------------------------------------- |
| `weekly`  | Mục tiêu theo tuần (VD: 21 việc/tuần)   |
| `monthly` | Mục tiêu theo tháng (VD: 90 việc/tháng) |
| `yearly`  | Mục tiêu theo năm (VD: 1000 việc/năm)   |

### 2.1. Nguyên tắc
- Mỗi user **chỉ có tối đa 1 mục tiêu cho mỗi loại**
- Mục tiêu có thể bật / tắt bất kỳ lúc nào
- Mục tiêu không bị ép phải liên tục

---

## 3. User Stories

| ID      | Là một...  | Tôi muốn...                        | Để...                                         |
| :------ | :--------- | :--------------------------------- | :-------------------------------------------- |
| **G01** | Người dùng | Đặt mục tiêu theo tuần/tháng/năm   | Có định hướng rõ ràng cho việc tu tập         |
| **G02** | Người dùng | Theo dõi tiến độ mục tiêu hiện tại | Biết mình còn cần nỗ lực thêm bao nhiêu       |
| **G03** | Người dùng | Xem lịch sử các chu kỳ trước       | Phản chiếu hành trình tu tập của mình         |
| **G04** | Người dùng | Thay đổi hoặc tắt mục tiêu         | Linh hoạt khi bận rộn hoặc thay đổi hoàn cảnh |

---

## 4. Cấu trúc dữ liệu

### 4.1. Bảng `goals`
Lưu trạng thái **mục tiêu hiện tại** của người dùng.

| Column       | Type    | Description                       |
| ------------ | ------- | --------------------------------- |
| id           | TEXT PK | UUID                              |
| user_id      | TEXT FK | Người sở hữu                      |
| type         | TEXT    | `weekly` \| `monthly` \| `yearly` |
| target_count | INTEGER | Số việc thiện mục tiêu            |
| is_enabled   | BOOLEAN | Mục tiêu đang bật hay tắt         |
| created_at   | INTEGER | Timestamp                         |
| updated_at   | INTEGER | Timestamp                         |

**Ràng buộc**
- UNIQUE (`user_id`, `type`)

---

### 4.2. Bảng `goal_history`
Lưu **lịch sử theo chu kỳ** của từng mục tiêu.

| Column       | Type    | Description                                |
| ------------ | ------- | ------------------------------------------ |
| id           | TEXT PK | UUID                                       |
| goal_id      | TEXT FK | Reference `goals.id`                       |
| user_id      | TEXT FK | Người sở hữu                               |
| type         | TEXT    | `weekly` \| `monthly` \| `yearly`          |
| period_time  | TEXT    | Chu kỳ (VD: `2026-W05`, `2026-02`, `2026`) |
| target_count | INTEGER | Target tại thời điểm đó                    |
| actual_count | INTEGER | Số việc thiện thực tế                      |
| start_date   | INTEGER | Ngày bắt đầu chu kỳ                        |
| end_date     | INTEGER | Ngày kết thúc chu kỳ                       |
| completed    | BOOLEAN | Đã đạt target hay chưa                     |
| created_at   | INTEGER | Timestamp                                  |
| updated_at   | INTEGER | Timestamp                                  |

**Ràng buộc**
- UNIQUE (`user_id`, `type`, `period_time`)

---

### 4.3. Dữ liệu hỗ trợ trong `good_deeds`

Mỗi bản ghi việc thiện cần lưu thêm thông tin thời gian cục bộ để tối ưu thống kê và mục tiêu.

| Column      | Type | Example      |
| ----------- | ---- | ------------ |
| local_date  | TEXT | `2026-02-03` |
| local_week  | TEXT | `2026-W05`   |
| local_month | TEXT | `2026-02`    |
| local_year  | TEXT | `2026`       |

---

## 5. Luồng nghiệp vụ chính (Business Logic)

### 5.1. Khi user chưa thiết lập mục tiêu
- Không có bản ghi trong `goals`
- Không có bản ghi trong `goal_history`

UI hiển thị trạng thái:
> "Bạn chưa đặt mục tiêu. Bạn có thể bắt đầu bất cứ lúc nào."

---

### 5.2. Khi user thiết lập mục tiêu (Enable Goal)

**Flow**
1. Tạo hoặc cập nhật row trong `goals`
2. Tạo **ngay 1 bản ghi trong `goal_history`** cho chu kỳ hiện tại:
   - `target_count`: theo cấu hình hiện tại
   - `actual_count`: đếm từ `good_deeds`
   - `start_date`, `end_date`: xác định theo loại mục tiêu



---

### 5.3. Khi user thêm / xóa việc thiện (good_deeds)

#### 🔒 QUY TẮC BẤT DI BẤT DỊCH

> **Hệ thống không tạo mới goal_history cho các chu kỳ đã trôi qua.
> Lịch sử mục tiêu chỉ được ghi nhận từ thời điểm người dùng chủ động bật mục tiêu.**

Đây là nguyên tắc cốt lõi để:
- Không "viết lại lịch sử"
- Không tạo thành tích ảo
- Giữ tính trung thực của timeline

#### Logic xử lý

Hệ thống cần:
1. Xác định **chu kỳ (period_time)** của deed dựa trên `local_*`
2. Phân biệt rõ 2 nhóm xử lý:

**Nhóm A: Tạo deed**
- Nếu period của deed = current period:
  - Với mỗi goal đang bật, tạo `goal_history` cho period đó nếu chưa có
- Với mọi type (weekly/monthly/yearly):
  - Nếu `goal_history` của period đó tồn tại → recompute `actual_count` và `completed`
  - Nếu không tồn tại → không làm gì

**Nhóm B: Xóa deed**
- Với mọi type (weekly/monthly/yearly):
  - Nếu `goal_history` của period đó tồn tại → recompute `actual_count` và `completed`
  - Không quan tâm goal đang bật hay không

⚠️ **Phân biệt Create vs Update:**

| Hành động           | Điều kiện                                  |
| ------------------- | ------------------------------------------ |
| Create goal_history | Chỉ khi period hiện tại & goal đang active |
| Update goal_history | Chỉ khi row đã tồn tại trong database      |

#### Ví dụ minh họa

**Ví dụ 1: User bật goal tuần này, thêm deed tuần trước**
- Tuần trước chưa có goal → không có goal_history
- Thêm deed tuần trước → **KHÔNG tạo** goal_history
- Deed được lưu, nhưng không tính vào mục tiêu

**Ví dụ 2: User bật goal từ tuần trước, thêm deed tuần trước**
- Tuần trước đã có goal_history (vì goal đã active)
- Thêm deed tuần trước → **UPDATE** goal_history đã có
- `actual_count` tăng lên, `completed` có thể thay đổi

**Ví dụ 3: User bật goal tuần này, thêm deed tuần này**
- Tuần này là period hiện tại
- Tạo goal_history nếu chưa có
- Update `actual_count`

---

### 5.4. Khi chuyển sang chu kỳ mới (tuần / tháng / năm)

**Không tự động tạo lịch sử hàng loạt**

Chỉ tạo `goal_history` khi:
- user bật mục tiêu
- hoặc user thêm deed thuộc current period và goal đang bật

Mọi logic tạo history đều đi qua **một hàm duy nhất** để tránh trùng lặp.

---

---

### 5.6. Khi user thay đổi `target_count`

- Chỉ ảnh hưởng **chu kỳ hiện tại**
- Không cập nhật lại các bản ghi `goal_history` trong quá khứ
- Đảm bảo không "đổi luật hồi tố"

---

### 5.7. Khi user tắt mục tiêu (Disable Goal)

- `goals.is_enabled = false`
- **XÓA** `goal_history` của current period (theo type)
- Không tạo thêm lịch sử mới cho đến khi bật lại

---

## 6. Hiển thị & UX

### 6.1. Trang Home
- Chỉ hiển thị **tiến độ mục tiêu hiện tại**
- Tối đa 1 progress bar / loại

---

### 6.2. Trang Goals
- Hiển thị:
  - mục tiêu đang bật
  - lịch sử theo tuần / tháng / năm

---

### 6.3. Thông báo nhắc nhở (Reminder)

Nội dung được cá nhân hóa theo tiến độ:
- 0% → gợi mở
- giữa chừng → khích lệ
- đạt mục tiêu → xác nhận & mời nghỉ ngơi

Không dùng ngôn ngữ gây áp lực hoặc trách móc.

---

## 7. Các trường hợp biên (Edge Cases)

- Xóa toàn bộ deed trong 1 chu kỳ → `actual_count = 0`
- Đổi timezone → chỉ ảnh hưởng deed mới
- Chỉnh sửa ngày deed → cập nhật lại history đúng chu kỳ (chỉ khi history đã tồn tại)
- User không đạt mục tiêu → vẫn có history, `completed = false`
- User bật goal rồi thêm deed quá khứ → **deed không tính vào mục tiêu** nếu chu kỳ đó chưa có history
- User import nhiều deed từ app khác → **chỉ tính từ chu kỳ hiện tại** trở đi

---

## 8. Nguyên tắc không thay đổi (Non-negotiables)

- Không leaderboard
- Không chấm điểm đạo đức
- Không phán xét
- Không tạo áp lực vô hình

> Mục tiêu là ngọn đèn soi đường, không phải cây gậy thúc lưng.

---

## 9. UI Flow

### 9.1. Đặt mục tiêu mới
1. Vào màn hình **Mục tiêu (Goals)**
2. Chọn loại: Tuần / Tháng / Năm
3. Nhập số lượng (VD: 21 việc/tuần)
4. Nhấn "Bắt đầu"
5. Thanh tiến độ xuất hiện ở Home & Goals

### 9.2. Xem lịch sử
1. Vào màn Goals
2. Cuộn xuống phần "Lịch sử"
3. Xem danh sách các chu kỳ: completed / not completed
4. Không có màu đỏ hay cảnh báo cho chu kỳ chưa đạt

### 9.3. Tắt/Bật mục tiêu
1. Vào Settings mục tiêu
2. Toggle switch "Bật/Tắt"
3. Lịch sử vẫn được giữ nguyên
