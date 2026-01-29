# 07. FEATURE SPEC – ACHIEVEMENTS (GHI NHẬN)

## 1. Mục đích tính năng

Tính năng **Achievements (Ghi nhận)** tồn tại để:
- Ghi nhận **sự đều đặn và tinh tấn** của người dùng
- Tạo cảm giác được **nhìn thấy nỗ lực của chính mình**
- Khuyến khích tiếp tục tu tập **một cách nhẹ nhàng**

Achievements **không phải** là phần thưởng, không phải danh hiệu, và **không phản ánh giá trị đạo đức của con người**.

---

## 2. Nguyên tắc cốt lõi

- Ghi nhận **quá trình**, không ghi nhận thành tích vượt trội
- Không xếp hạng
- Không so sánh giữa người dùng
- Không dùng ngôn ngữ tôn vinh cá nhân

Nếu một achievement khiến người dùng:
- Tự hào quá mức
- So sánh bản thân với người khác

→ Achievement đó **không phù hợp**.

---

## 3. Phạm vi tính năng

### 3.1. Trong phạm vi MVP

- Achievements tự động
- Ghi nhận sự đều đặn theo thời gian
- Hiển thị trong phạm vi cá nhân

---

### 3.2. Ngoài phạm vi MVP

- Achievement cộng đồng
- Badge hiếm
- Achievement có thưởng
- Chia sẻ achievement

---

## 4. Các loại Achievement (MVP)

### 4.1. Achievement theo chuỗi ngày

- 3 ngày liên tiếp
- 7 ngày liên tiếp
- 14 ngày liên tiếp
- 30 ngày liên tiếp

Ghi nhận **sự duy trì**, không phải số lượng.

---

### 4.2. Achievement theo cột mốc

- Việc thiện đầu tiên
- 10 việc thiện
- 50 việc thiện
- 100 việc thiện

---

### 4.3. Achievement theo sự quay lại

- Quay lại sau gián đoạn

Lưu ý:
- Không gọi đây là “phục hồi streak”
- Chỉ ghi nhận việc **tiếp tục**

---

## 5. Luồng người dùng (User Flow)

### 5.1. Khi đạt achievement

- Achievement được kích hoạt tự động
- Hiển thị thông điệp ghi nhận ngắn

---

### 5.2. Màn hình Achievements

- Danh sách achievement đã đạt
- Có thể ẩn những achievement chưa đạt

---

## 6. Giao diện & trải nghiệm

### 6.1. Nguyên tắc UI

- Tối giản
- Không hiệu ứng mạnh
- Không màu sắc quá nổi bật

---

### 6.2. Nội dung hiển thị

- Tên achievement
- Mô tả ngắn
- Ngày đạt (tuỳ chọn)

---

## 7. Dữ liệu & cấu trúc field

### 7.1. Achievement definition

| Field       | Type    | Bắt buộc | Mô tả           |
| ----------- | ------- | -------- | --------------- |
| id          | string  | ✔        | ID achievement  |
| code        | string  | ✔        | Mã cố định      |
| title       | string  | ✔        | Tên hiển thị    |
| description | string  | ✔        | Mô tả ngắn      |
| condition   | object  | ✔        | Điều kiện đạt   |
| iconKey     | string  | ✖        | Icon key        |
| orderIndex  | number  | ✔        | Thứ tự hiển thị |
| isActive    | boolean | ✔        | Bật / tắt       |

---

### 7.2. UserAchievement

| Field         | Type     | Bắt buộc | Mô tả         |
| ------------- | -------- | -------- | ------------- |
| id            | string   | ✔        | ID            |
| userId        | string   | ✔        | Người dùng    |
| achievementId | string   | ✔        | Achievement   |
| achievedAt    | datetime | ✔        | Thời điểm đạt |

---

## 8. Logic nghiệp vụ

### 8.1. Kích hoạt achievement

- Kiểm tra sau mỗi lần:
  - Check-in
  - Kết thúc ngày

---

### 8.2. Quy tắc

- Mỗi achievement chỉ đạt **1 lần**
- Không cho người dùng chủ động tạo achievement

---

## 9. Thông điệp & ngôn ngữ

### 9.1. Khi đạt achievement

Ví dụ:
- “Bạn đã duy trì việc ghi nhận trong 7 ngày. Sự đều đặn thật đáng quý.”
- “Một cột mốc nhỏ, nhưng rất có ý nghĩa.”

---

### 9.2. Tránh dùng

- “Chúc mừng!” (quá mạnh)
- “Bạn giỏi quá!”

---

## 10. Edge cases

### 10.1. Người dùng đạt nhiều achievement cùng lúc

- Hiển thị từng cái một
- Không popup liên tiếp

---

### 10.2. Người dùng gián đoạn

- Không xoá achievement đã đạt
- Không hiển thị thông báo mất achievement

---

## 11. Nguyên tắc không được vi phạm

- Không biến achievement thành game
- Không tạo áp lực phải đạt đủ
- Không dùng achievement để giữ chân bằng cảm giác thiếu sót

---

## 12. Kết luận

Achievement trong **3000 Việc Thiện** không nhằm tạo ra cảm giác chiến thắng,

mà nhằm **ghi nhận một đoạn đường đã đi qua**.

Nếu achievement khiến người dùng:
- Muốn chạy theo cột mốc
- Hoặc cảm thấy thua kém khi chưa đạt

→ Tính năng này cần được **giảm nhẹ hoặc loại bỏ**.

