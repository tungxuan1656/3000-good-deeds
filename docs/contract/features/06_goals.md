# 06. FEATURE SPEC – MỤC TIÊU VIỆC THIỆN (GOALS)

## 1. Mục đích tính năng

Tính năng **Mục tiêu việc thiện** giúp người dùng:
- Có một **điểm tựa nhẹ nhàng** để duy trì thói quen
- Định hướng việc tu tập theo nhịp cá nhân
- Quan sát tiến trình **mà không tự gây áp lực**

Mục tiêu **không phải cam kết đạo đức**, mà là **lời nhắc dịu dàng với chính mình**.

---

## 2. Nguyên tắc cốt lõi

- Mục tiêu là **tự nguyện**
- Không có hình phạt khi không đạt
- Không so sánh mục tiêu giữa người dùng
- Có thể thay đổi hoặc huỷ bất cứ lúc nào

Nếu mục tiêu khiến người dùng:
- Căng thẳng
- Áy náy
- Cảm thấy thất bại

→ Thiết kế đó **không phù hợp**.

---

## 3. Phạm vi tính năng

### 3.1. Trong phạm vi MVP

- Tạo mục tiêu cá nhân
- Mục tiêu theo số lượng việc thiện
- Theo dõi tiến trình mục tiêu
- Nhắc nhở nhẹ (in-app)

---

### 3.2. Ngoài phạm vi MVP

- Mục tiêu theo danh mục chi tiết
- Thử thách cộng đồng
- Mục tiêu có thưởng

---

## 4. Loại mục tiêu hỗ trợ (MVP)

### 4.1. Mục tiêu theo thời gian

- Theo ngày
- Theo tuần
- Theo tháng

---

### 4.2. Hình thức mục tiêu

- Số lượng việc thiện (ví dụ: 1 việc/ngày, 20 việc/tháng)

Lưu ý:
- Không phân biệt việc thiện lớn/nhỏ

---

## 5. Luồng người dùng (User Flow)

### 5.1. Tạo mục tiêu

1. Truy cập màn hình Mục tiêu
2. Chọn loại mục tiêu (ngày / tuần / tháng)
3. Chọn số lượng mong muốn
4. Lưu mục tiêu

---

### 5.2. Theo dõi mục tiêu

- Hiển thị tiến trình dạng:
  - Văn bản
  - Thanh tiến trình đơn giản

---

### 5.3. Chỉnh sửa / huỷ mục tiêu

- Cho phép chỉnh sửa bất cứ lúc nào
- Không hiển thị thông báo tiêu cực khi huỷ

---

## 6. Giao diện & trải nghiệm

### 6.1. Nguyên tắc UI

- Đơn giản
- Không tạo cảm giác cam kết nặng nề
- Không dùng màu sắc cảnh báo

---

### 6.2. Gợi ý UI

- Slider hoặc input số
- Gợi ý mặc định nhẹ:
  - 1 việc/ngày
  - 5 việc/tuần

---

## 7. Dữ liệu & cấu trúc field

### 7.1. Goal object

| Field       | Type     | Bắt buộc | Mô tả                    |
| ----------- | -------- | -------- | ------------------------ |
| id          | string   | ✔        | ID mục tiêu              |
| userId      | string   | ✔        | Chủ sở hữu               |
| title       | string   | ✖        | Tên mục tiêu (tuỳ chọn)  |
| type        | enum     | ✔        | daily / weekly / monthly |
| targetCount | number   | ✔        | Số lượng việc thiện      |
| startDate   | date     | ✔        | Ngày bắt đầu             |
| endDate     | date     | ✖        | Ngày kết thúc            |
| isActive    | boolean  | ✔        | Trạng thái               |
| createdAt   | datetime | ✔        | Thời điểm tạo            |

---

## 8. Logic nghiệp vụ

### 8.1. Quy tắc chung

- Mỗi người dùng **chỉ có 1 mục tiêu active / loại**
- Khi tạo mục tiêu mới:
  - Mục tiêu cũ cùng loại tự động inactive

---

### 8.2. Tính tiến trình

- Dựa trên số việc thiện trong khoảng thời gian mục tiêu
- Không làm tròn gây hiểu lầm

---

## 9. Thông điệp & ngôn ngữ

### 9.1. Khi đạt mục tiêu

Ví dụ:
- “Bạn đã hoàn thành mục tiêu của mình. Sự đều đặn thật đáng quý.”

---

### 9.2. Khi chưa đạt

Ví dụ:
- “Nếu bạn muốn, bạn vẫn có thể tiếp tục vào ngày mai.”

---

## 10. Edge cases

### 10.1. Người dùng không tạo mục tiêu

- App vẫn hoạt động bình thường
- Không nhắc nhở thêm

---

### 10.2. Người dùng đặt mục tiêu quá cao

- Gợi ý nhẹ nhàng giảm xuống
- Không chặn

---

## 11. Nguyên tắc không được vi phạm

- Không biến mục tiêu thành KPI
- Không tạo áp lực hoàn thành
- Không dùng mục tiêu để đánh giá con người

---

## 12. Kết luận

Mục tiêu trong **3000 Việc Thiện** không phải là:

> “Tôi phải làm được bao nhiêu?”

Mà là:

> **“Tôi muốn sống như thế nào trong giai đoạn này?”**

Nếu mục tiêu khiến người dùng:
- Cảm thấy bị trói buộc
- Hoặc mất đi sự tự do nội tâm

→ Tính năng này cần được **đơn giản hoá hoặc loại bỏ**.