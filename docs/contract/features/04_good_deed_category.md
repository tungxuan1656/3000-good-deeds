# 04. FEATURE SPEC – PHÂN LOẠI VIỆC THIỆN

## 1. Mục đích tính năng

Tính năng **Phân loại việc thiện** giúp người dùng:
- Nhận diện **bản chất của việc thiện** (thân – khẩu – ý)
- Tự quan sát xu hướng tu tập của bản thân theo thời gian
- Ghi nhận việc thiện **có chiều sâu**, không chỉ về số lượng

Phân loại **không nhằm đánh giá hơn – kém**, mà nhằm **giúp người dùng soi lại mình rõ hơn**.

---

## 2. Nguyên tắc thiết kế phân loại

- Đơn giản
- Dễ hiểu
- Không học thuật
- Không yêu cầu hiểu sâu giáo lý

Phân loại phải:
- Phù hợp với Phật tử tại gia
- Không gây khó khăn cho người mới

---

## 3. Phạm vi tính năng

### 3.1. Trong phạm vi MVP

- Danh mục việc thiện có sẵn (predefined)
- Mỗi việc thiện **bắt buộc thuộc một danh mục**
- Người dùng **chọn**, không tự định nghĩa mới

---

### 3.2. Ngoài phạm vi MVP

- Tạo danh mục tuỳ chỉnh
- Danh mục nhiều cấp
- Gán nhiều danh mục cho một việc thiện

---

## 4. Hệ thống danh mục đề xuất (MVP)

### 4.1. Nhóm cốt lõi

1. **Thân thiện**
   - Hành động cụ thể
   - Ví dụ: giúp đỡ, bố thí, bảo vệ sinh mạng

2. **Khẩu thiện**
   - Lời nói
   - Ví dụ: nói lời hoà ái, không nói lời tổn hại

3. **Ý thiện**
   - Tâm niệm
   - Ví dụ: buông bỏ sân hận, khởi tâm lành

---

### 4.2. Nhóm mở rộng (tuỳ chọn)

4. **Nhẫn nhục**
5. **Tinh tấn**
6. **Biết ơn**

Lưu ý:
- Có thể bắt đầu chỉ với **3 nhóm cốt lõi**
- Nhóm mở rộng bật/tắt bằng cấu hình

---

## 5. Giao diện chọn danh mục

### 5.1. Yêu cầu UI

- Hiển thị danh mục dưới dạng:
  - List
  - Hoặc card
- Icon đơn giản
- Tên dễ hiểu

---

### 5.2. Nguyên tắc UX

- Không quá 5–6 lựa chọn trên một màn hình
- Mô tả ngắn gọn
- Không giải thích dài dòng

---

## 6. Dữ liệu & cấu trúc field

### 6.1. Category object

| Field           | Type    | Bắt buộc | Mô tả             |
| --------------- | ------- | -------- | ----------------- |
| id              | string  | ✔        | ID danh mục       |
| key             | string  | ✔        | Mã cố định        |
| name            | string  | ✔        | Tên hiển thị      |
| description     | string  | ✖        | Mô tả ngắn        |
| iconKey         | string  | ✖        | Icon key (lucide) |
| orderIndex      | number  | ✔        | Thứ tự hiển thị   |
| isActive        | boolean | ✔        | Bật / tắt         |
| isSystemDefault | boolean | ✔        | Mặc định hệ thống |

---

## 7. Logic nghiệp vụ

### 7.1. Khi thêm việc thiện

- Bắt buộc chọn 1 danh mục
- Không cho lưu nếu chưa chọn

---

### 7.2. Khi chỉnh sửa danh mục (admin)

- Thay đổi tên / mô tả
- Không xoá cứng danh mục đã dùng
- Chỉ cho phép **ẩn (isActive = false)**

---

## 8. Ảnh hưởng tới các tính năng khác

### 8.1. Check-in việc thiện

- Category là field bắt buộc

---

### 8.2. Thống kê

- Thống kê theo danh mục
- So sánh **nội tại của chính người dùng**

---

### 8.3. Mục tiêu

- Mục tiêu có thể:
  - Chung
  - Hoặc theo danh mục (nâng cao)

---

## 9. Edge cases

### 9.1. Người dùng không biết chọn danh mục nào

- Hiển thị mô tả ngắn
- Không ép buộc chọn “đúng”

---

### 9.2. Danh mục bị tắt

- Việc thiện cũ vẫn hiển thị bình thường
- Không cho chọn cho việc thiện mới

---

## 10. Nguyên tắc không được vi phạm

- Không gán giá trị hơn – kém cho danh mục
- Không hiển thị thống kê so sánh giữa người dùng
- Không dùng danh mục để phán xét đạo đức

---

## 11. Kết luận

Phân loại việc thiện không nhằm tạo ra sự phức tạp,

mà nhằm giúp người dùng **nhìn lại chiều sâu của việc mình đang làm**.

Nếu hệ thống danh mục khiến người dùng:
- Phải suy nghĩ quá lâu
- Hoặc cảm thấy mình “chọn sai”

→ Hệ thống đó cần được **đơn giản hoá**.