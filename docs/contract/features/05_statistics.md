# 05. FEATURE SPEC – THỐNG KÊ & QUAN SÁT VIỆC THIỆN

## 1. Mục đích tính năng

Tính năng **Thống kê** giúp người dùng:
- **Nhìn lại tiến trình tu tập của chính mình**
- Quan sát thói quen hành thiện theo thời gian
- Tự quán chiếu, không tự đánh giá hay so sánh

Thống kê **không nhằm tạo động lực bằng áp lực**, mà nhằm tạo **sự hiểu biết về bản thân**.

---

## 2. Nguyên tắc cốt lõi

- Chỉ hiển thị **dữ liệu cá nhân**
- Không so sánh với người khác
- Không dùng màu sắc hoặc biểu đồ gây cạnh tranh
- Số liệu mang tính **mô tả**, không phán xét

Nếu một biểu đồ hoặc con số khiến người dùng:
- Cảm thấy thua kém
- Cảm thấy phải cố gắng hơn người khác

→ Thiết kế đó **không phù hợp**.

---

## 3. Phạm vi tính năng

### 3.1. Trong phạm vi MVP

- Thống kê theo thời gian:
  - Ngày
  - Tuần
  - Tháng
- Tổng số việc thiện
- Chuỗi ngày liên tục (streak)
- Thống kê theo danh mục

---

### 3.2. Ngoài phạm vi MVP

- So sánh giữa người dùng
- Phân tích nâng cao
- Xuất dữ liệu
- Dự đoán hành vi

---

## 4. Các màn hình thống kê

### 4.1. Tổng quan (Overview)

**Nội dung:**
- Tổng số việc thiện đã ghi nhận
- Số ngày có check-in
- Chuỗi ngày liên tục hiện tại

**Nguyên tắc trình bày:**
- Văn bản trung tính
- Không nhấn mạnh con số lớn

---

### 4.2. Thống kê theo thời gian

**Lựa chọn thời gian:**
- 7 ngày gần nhất
- 30 ngày gần nhất
- Tháng hiện tại

**Dữ liệu hiển thị:**
- Số việc thiện mỗi ngày

**Gợi ý UI:**
- Bar chart đơn giản
- Trục y không cần quá chi tiết

---

### 4.3. Thống kê theo danh mục

**Dữ liệu:**
- Số việc thiện theo từng danh mục

**Nguyên tắc:**
- Không hiển thị phần trăm so sánh
- Không dùng biểu đồ tròn gây cạnh tranh

---

## 5. Chuỗi ngày liên tục (Streak)

### 5.1. Mục đích

- Gợi nhắc sự đều đặn
- Không tạo cảm giác bị ràng buộc

---

### 5.2. Quy tắc tính streak

- Một ngày được tính nếu:
  - Có ít nhất 1 việc thiện

- Streak **bị gián đoạn** nếu:
  - Một ngày không có check-in

---

### 5.3. Cách hiển thị

- Văn bản nhẹ nhàng
- Không dùng từ "mất streak"

Ví dụ:
- “Bạn đã duy trì 5 ngày liên tiếp”
- “Nếu hôm nay bạn muốn, có thể bắt đầu lại”

---

## 6. Dữ liệu & cấu trúc sử dụng

### 6.1. Dữ liệu đầu vào

- GoodDeed
- Category

---

### 6.2. Dữ liệu tổng hợp (derived)

- totalGoodDeeds
- activeDaysCount
- currentStreak

---

## 7. Logic nghiệp vụ

### 7.1. Nguyên tắc chung

- Chỉ tính trên dữ liệu người dùng hiện tại
- Thời gian tính theo timezone người dùng

---

### 7.2. Trường hợp không có dữ liệu

- Hiển thị thông điệp trung tính

Ví dụ:
- “Chưa có dữ liệu để hiển thị”

---

## 8. Edge cases

### 8.1. Người dùng mới

- Không hiển thị biểu đồ rỗng gây áp lực
- Gợi ý quay lại màn hình check-in

---

### 8.2. Người dùng gián đoạn lâu ngày

- Không hiển thị so sánh quá khứ – hiện tại
- Không nhấn mạnh việc bỏ lỡ

---

## 9. Chỉ số liên quan (Metrics)

- Tần suất xem thống kê
- Tỷ lệ người dùng quay lại sau khi xem thống kê

Lưu ý:
- Không dùng thống kê để thúc ép hành vi

---

## 10. Nguyên tắc không được vi phạm

- Không biến thống kê thành bảng thành tích
- Không dùng màu sắc hoặc icon gây phấn khích
- Không hiển thị ranking

---

## 11. Kết luận

Thống kê trong **3000 Việc Thiện** không nhằm trả lời câu hỏi:

> “Tôi làm được bao nhiêu?”

Mà nhằm trả lời câu hỏi:

> **“Tôi đang sống như thế nào?”**

Nếu thống kê khiến người dùng:
- Căng thẳng
- Áp lực
- So sánh bản thân với người khác

→ Tính năng này cần được **thiết kế lại**.