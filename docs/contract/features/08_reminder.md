# 08. FEATURE SPEC – REMINDER & NHẮC NHỞ

## 1. Mục đích tính năng

Tính năng **Reminder (Nhắc nhở)** giúp người dùng:
- Nhớ dừng lại trong ngày để **tự quán chiếu**
- Duy trì thói quen ghi nhận việc thiện **một cách tự nhiên**
- Không quên ứng dụng, nhưng **không bị làm phiền**

Reminder **không phải công cụ giữ chân**, mà là **lời nhắc nhẹ nhàng đúng lúc**.

---

## 2. Nguyên tắc cốt lõi

- Nhắc nhở là **tuỳ chọn**, không bắt buộc
- Người dùng **toàn quyền kiểm soát**
- Không dùng ngôn ngữ tạo cảm giác thiếu sót hay tội lỗi
- Không nhắc dồn dập

Nếu reminder khiến người dùng:
- Khó chịu
- Áp lực
- Muốn tắt thông báo ngay lập tức

→ Tính năng này đã **đi lệch mục tiêu**.

---

## 3. Phạm vi tính năng

### 3.1. Trong phạm vi MVP

- In-app reminder
- Cho phép:
  - Bật / tắt
  - Chọn khung giờ nhắc

---

### 3.2. Ngoài phạm vi MVP

- Push notification nâng cao
- Nhắc nhở theo ngữ cảnh
- Nhiều khung giờ / ngày

---

## 4. Loại reminder hỗ trợ

### 4.1. Nhắc nhở hằng ngày

- Mỗi ngày tối đa **1 lần**
- Thời điểm gợi ý:
  - Buổi tối (20:00 – 22:00)

---

### 4.2. Nhắc nhở khi bỏ quên (nhẹ)

- Sau 2–3 ngày không check-in
- Chỉ nhắc **1 lần**

---

## 5. Luồng người dùng (User Flow)

### 5.1. Thiết lập reminder

1. Truy cập Cài đặt
2. Bật / tắt reminder
3. Chọn khung giờ
4. Lưu

---

### 5.2. Khi nhận reminder

- Hiển thị thông điệp ngắn
- Click → mở màn hình Home hoặc Check-in

---

## 6. Giao diện & trải nghiệm

### 6.1. Nguyên tắc UI

- Đơn giản
- Ít tuỳ chọn
- Không ép bật

---

### 6.2. Gợi ý UI

- Toggle bật / tắt
- Time picker đơn giản

---

## 7. Dữ liệu & cấu trúc field

### 7.1. ReminderSetting

| Field | Type | Bắt buộc | Mô tả |
|------|------|----------|------|
| userId | string | ✔ | Người dùng |
| enabled | boolean | ✔ | Bật / tắt |
| time | string | ✔ | HH:mm |
| timezone | string | ✔ | Timezone |
| updatedAt | datetime | ✔ | Thời điểm cập nhật |

---

## 8. Logic nghiệp vụ

### 8.1. Điều kiện gửi reminder

- enabled = true
- Đúng khung giờ người dùng chọn
- Trong ngày **chưa check-in**

---

### 8.2. Quy tắc

- Một ngày chỉ gửi **1 reminder**
- Không gửi bù cho ngày hôm trước

---

## 9. Nội dung & ngôn ngữ reminder

### 9.1. Ví dụ nội dung phù hợp

- “Nếu hôm nay bạn đã làm một điều lành, bạn có thể ghi lại.”
- “Một phút dừng lại cũng là một cách chăm sóc tâm.”

---

### 9.2. Tránh tuyệt đối

- “Bạn đã quên…”
- “Hôm nay bạn chưa làm việc thiện”

---

## 10. Edge cases

### 10.1. Người dùng đổi timezone

- Cập nhật reminder theo timezone mới

---

### 10.2. Người dùng tắt reminder

- Không gửi bất kỳ thông báo nào
- Không gợi ý bật lại liên tục

---

## 11. Nguyên tắc không được vi phạm

- Không dùng reminder để giữ streak
- Không dùng reminder để thúc ép mục tiêu
- Không gửi nhiều hơn 1 lần / ngày

---

## 12. Kết luận

Reminder trong **3000 Việc Thiện** không nhằm nhắc người dùng rằng:

> “Bạn đang thiếu sót”

Mà chỉ nhẹ nhàng nhắc rằng:

> **“Bạn có thể dừng lại một chút, nếu muốn.”**

Nếu reminder khiến người dùng:
- Muốn tắt thông báo
- Hoặc cảm thấy bị kiểm soát

→ Tính năng này cần được **giảm tần suất hoặc loại bỏ**.