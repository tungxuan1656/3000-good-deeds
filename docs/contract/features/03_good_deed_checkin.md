# 03. FEATURE SPEC – CHECK-IN VIỆC THIỆN

## 1. Mục đích tính năng

Tính năng **Check-in việc thiện** là **xương sống của toàn bộ ứng dụng 3000 Việc Thiện**.

Mục tiêu:
- Giúp người dùng **ghi nhận lại hành động thiện lành đã làm**
- Tạo một khoảnh khắc dừng lại để **tự quán chiếu**, không phải báo cáo
- Hình thành thói quen sử dụng app **nhanh – đều – không áp lực**

Tính năng này phải luôn:
- Nhanh hơn 1 phút
- Ít thao tác
- Không gây cảm giác phô trương

---

## 2. Phạm vi tính năng

### 2.1. Trong phạm vi MVP

- Thêm việc thiện
- Sửa việc thiện
- Xoá việc thiện
- Gắn danh mục
- Ghi chú ngắn (tuỳ chọn)
- Ghi nhận theo ngày (mặc định là hôm nay)

---

### 2.2. Ngoài phạm vi MVP

- Đính kèm hình ảnh / bằng chứng
- Chia sẻ công khai
- Chấm điểm giá trị việc thiện
- Đánh giá chất lượng việc thiện

---

## 3. Luồng người dùng (User Flow)

### 3.1. Luồng chính – Thêm việc thiện

1. Người dùng mở app
2. Click nút **“Ghi nhận việc thiện”** (primary CTA)
3. Chọn **loại việc thiện**
4. (Tuỳ chọn) Nhập **ghi chú ngắn**
5. Nhấn **Lưu**
6. Hiển thị thông điệp ghi nhận
7. Quay về Home hoặc danh sách

Tổng thao tác lý tưởng: **≤ 3 bước**

---

### 3.2. Luồng phụ – Sửa / Xoá

- Truy cập danh sách việc thiện
- Chọn một mục
- Thực hiện:
  - Sửa
  - Hoặc xoá (có xác nhận)

---

## 4. Giao diện & trải nghiệm

### 4.1. Thành phần UI chính

- Button primary: “Ghi nhận việc thiện”
- Modal hoặc page thêm mới
- Select danh mục
- Textarea ghi chú
- Button Lưu

### 4.2. Nguyên tắc UI

- Một màn hình = một hành động
- Không hiển thị quá nhiều tuỳ chọn
- Ưu tiên input chạm được dễ dàng trên mobile

---

## 5. Dữ liệu & cấu trúc field

### 5.1. GoodDeed object

| Field       | Type     | Bắt buộc | Mô tả              |
| ----------- | -------- | -------- | ------------------ |
| id          | string   | ✔        | ID duy nhất        |
| userId      | string   | ✔        | Chủ sở hữu         |
| categoryId  | string   | ✔        | Loại việc thiện    |
| description | string   | ✖        | Ghi chú ngắn       |
| performedAt | datetime | ✔        | Ngày/giờ thực hiện |
| createdAt   | datetime | ✔        | Thời điểm tạo      |
| updatedAt   | datetime | ✔        | Thời điểm cập nhật |

---

## 6. Logic nghiệp vụ (Business Logic)

### 6.1. Quy tắc chung

- Người dùng **chỉ thấy và chỉnh sửa** việc thiện của chính mình
- Mặc định ngày = hôm nay
- Cho phép ghi nhận việc thiện trong quá khứ (giới hạn)

### 6.2. Giới hạn đề xuất

- Tối đa **10 việc thiện / ngày** (soft limit)
- Nếu vượt:
  - Hiển thị gợi ý nhẹ
  - Không chặn cứng

---

## 7. Thông điệp & ngôn ngữ

### 7.1. Sau khi lưu thành công

Ví dụ:
- “Một việc lành đã được ghi nhận.”
- “Cảm ơn bạn đã dừng lại để nhìn lại chính mình.”

---

### 7.2. Khi chưa nhập đủ thông tin

- “Bạn có thể chọn một loại việc thiện.”

---

## 8. Edge cases & xử lý đặc biệt

### 8.1. Người dùng ghi nhận nhiều việc trong ngày

- Không cảnh báo tiêu cực
- Không hiển thị đếm số theo thời gian thực

---

### 8.2. Mất kết nối

- Hiển thị thông báo nhẹ
- Cho phép lưu tạm (nếu có)

---

### 8.3. Người dùng bỏ qua ghi chú

- Hoàn toàn hợp lệ
- Không nhắc nhở thêm

---

## 9. Chỉ số liên quan (Metrics)

- Số lượt check-in / ngày
- Tỷ lệ người dùng check-in ≥ 3 ngày / tuần

Lưu ý:
- Không dùng metrics này để thúc ép người dùng

---

## 10. Nguyên tắc không được vi phạm

- Không biến check-in thành nghĩa vụ
- Không tạo cảm giác khoe khoang
- Không phán xét nội dung việc thiện

---

## 11. Kết luận

Check-in việc thiện không phải là hành động ghi công,

mà là **một khoảnh khắc dừng lại để tự nhìn lại mình**.

Nếu tính năng này trở nên:
- Phức tạp
- Nhiều bước
- Khiến người dùng phải suy nghĩ quá nhiều

→ Tính năng đã **đi lệch mục tiêu ban đầu** và cần được giản lược.