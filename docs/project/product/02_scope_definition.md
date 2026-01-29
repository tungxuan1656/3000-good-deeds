# 02. SCOPE DEFINITION – PHẠM VI SẢN PHẨM (MVP)

## 1. Mục đích của tài liệu

Tài liệu này xác định **ranh giới triển khai rõ ràng cho MVP** của ứng dụng **3000 Việc Thiện**.

Mục tiêu:
- Ngăn việc mở rộng tính năng không cần thiết
- Giảm over-engineering
- Giữ sản phẩm gọn, đúng tinh thần tu tập

Tài liệu này được dùng để **ra quyết định có/không** khi phát sinh yêu cầu mới.

---

## 2. Nguyên tắc xác định phạm vi

Mọi tính năng trong MVP phải thỏa **ít nhất 2/3 tiêu chí** sau:

1. Trực tiếp hỗ trợ người dùng **hành thiện hoặc quán chiếu**
2. Có thể sử dụng **hằng ngày trong thời gian rất ngắn**
3. Không làm tăng áp lực, so sánh, hay phô trương

Nếu không đạt → **ngoài phạm vi MVP**.

---

## 3. Phân loại phạm vi

### 3.1. Must-have (Bắt buộc có)

Những tính năng **không có thì MVP không còn ý nghĩa**.

- Authentication cơ bản
- Hồ sơ người dùng
- Check-in việc thiện
- Phân loại việc thiện
- Thống kê cá nhân (đơn giản)
- Nhắc nhở hằng ngày (in-app)

---

### 3.2. Nice-to-have (Có thể có nếu còn nguồn lực)

Những tính năng **có thì tốt**, nhưng có thể trì hoãn.

- Web notification (push)
- Achievement (ghi nhận sự đều đặn)
- Tuỳ chỉnh danh mục việc thiện
- Ghi chú chi tiết cho mỗi việc thiện

Nếu thiếu các tính năng này, MVP **vẫn hoàn chỉnh**.

---

### 3.3. Out-of-scope (Không thuộc MVP)

Những tính năng **chủ động không làm trong giai đoạn MVP**.

- News-feed / mạng xã hội
- Chia sẻ công khai
- Bảng xếp hạng
- Chat / tương tác người dùng
- Quyên góp / thanh toán
- Nội dung audio / video
- Gamification nâng cao

---

## 4. Phạm vi chi tiết theo nhóm tính năng

### 4.1. Authentication

**Trong phạm vi:**
- Email + mật khẩu
- Quên mật khẩu

**Ngoài phạm vi:**
- Social login
- SSO

---

### 4.2. Hồ sơ người dùng

**Trong phạm vi:**
- Tên hiển thị
- Cài đặt reminder
- Tuỳ chọn riêng tư

**Ngoài phạm vi:**
- Avatar nâng cao
- Trang cá nhân công khai

---

### 4.3. Check-in việc thiện

**Trong phạm vi:**
- Thêm / sửa / xoá
- Chọn danh mục
- Ghi chú ngắn

**Ngoài phạm vi:**
- Đính kèm hình ảnh
- Đính kèm minh chứng

---

### 4.4. Thống kê

**Trong phạm vi:**
- Tổng số việc thiện
- Theo ngày / tuần / tháng
- Chuỗi ngày liên tục

**Ngoài phạm vi:**
- So sánh với người khác
- Phân tích nâng cao

---

### 4.5. Mục tiêu

**Trong phạm vi:**
- Mục tiêu cá nhân
- Theo dõi tiến trình

**Ngoài phạm vi:**
- Thử thách cộng đồng

---

## 5. Những quyết định cố ý đơn giản hoá

Để giữ MVP gọn, các quyết định sau được **chủ động chấp nhận**:

- Không xác minh việc thiện
- Không đánh giá chất lượng việc thiện
- Không phân biệt việc thiện lớn / nhỏ
- Không yêu cầu sử dụng hằng ngày

---

## 6. Tiêu chí kết thúc MVP

MVP được coi là **hoàn thành** khi:

- Người dùng có thể:
  - Đăng ký
  - Ghi nhận việc thiện
  - Xem lại tiến trình

- Hệ thống:
  - Ổn định
  - Dễ sử dụng
  - Không gây hiểu lầm

---

## 7. Nguyên tắc xử lý yêu cầu mới

Khi có đề xuất tính năng mới:

1. Đối chiếu với tài liệu Vision & Ethics
2. Kiểm tra phạm vi trong tài liệu này
3. Nếu không rõ → **hoãn lại sau MVP**

---

## 8. Kết luận

Phạm vi MVP được thiết kế để:
- Đủ dùng
- Dễ triển khai
- Dễ mở rộng về sau

Việc **không làm** đúng lúc là điều cần thiết để sản phẩm giữ được **chiều sâu và sự bền vững**.

