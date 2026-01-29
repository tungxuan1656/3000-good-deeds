# 03. USER FLOW – LUỒNG NGƯỜI DÙNG

## 1. Mục đích của tài liệu

Tài liệu này mô tả **luồng thao tác cụ thể theo từng màn hình** của ứng dụng **3000 Việc Thiện**.

Mục tiêu:
- Làm cầu nối giữa **UX (hành trình)** và **UI / code (routing, component)**
- Giúp dev triển khai **không cần suy đoán**
- Đảm bảo luồng sử dụng đơn giản, nhất quán, đúng tinh thần tu tập

---

## 2. Nguyên tắc thiết kế user flow

- Luồng ngắn, ít nhánh
- Ưu tiên hành động chính (check-in việc thiện)
- Không ép buộc đăng nhập quá sớm
- Luôn có đường quay lại

---

## 3. Tổng quan sơ đồ luồng

### 3.1. Nhóm luồng chính

1. Luồng chưa đăng nhập
2. Luồng đăng ký / đăng nhập
3. Luồng sử dụng hằng ngày (core flow)
4. Luồng xem thống kê
5. Luồng mục tiêu & cài đặt

---

## 4. Luồng 1 – Người dùng chưa đăng nhập

### 4.1. Entry point

- Truy cập website
- Mở app từ bookmark / PWA

### 4.2. Các bước

1. Landing page (giới thiệu ngắn)
2. CTA: “Bắt đầu sử dụng”
3. Chọn:
   - Đăng ký
   - Hoặc dùng thử (nếu cho phép guest)

### 4.3. Nguyên tắc

- Không quá 1–2 màn hình giới thiệu
- Không yêu cầu thông tin cá nhân sớm

---

## 5. Luồng 2 – Đăng ký / Đăng nhập

### 5.1. Đăng ký

1. Nhập email
2. Nhập mật khẩu
3. Tạo tài khoản
4. Chuyển tới màn hình chính

### 5.2. Đăng nhập

1. Nhập email
2. Nhập mật khẩu
3. Đăng nhập thành công

### 5.3. Xử lý lỗi

- Sai mật khẩu → thông báo trung tính
- Quên mật khẩu → luồng reset đơn giản

---

## 6. Luồng 3 – Core Flow: Check-in việc thiện

### 6.1. Màn hình chính (Home)

- Hiển thị:
  - Nút “Ghi nhận việc thiện” (primary CTA)
  - Tóm tắt ngắn (hôm nay / tuần)

### 6.2. Thêm việc thiện

1. Click “Ghi nhận việc thiện”
2. Chọn loại việc thiện
3. (Tuỳ chọn) Nhập ghi chú
4. Lưu

### 6.3. Sau khi lưu

- Hiển thị thông điệp ghi nhận nhẹ nhàng
- Trở về Home hoặc danh sách

---

## 7. Luồng 4 – Xem lại việc thiện

### 7.1. Danh sách việc thiện

- Theo ngày
- Có thể:
  - Xem chi tiết
  - Sửa
  - Xoá

### 7.2. Nguyên tắc

- Không hiển thị quá nhiều thông tin cùng lúc
- Thao tác rõ ràng

---

## 8. Luồng 5 – Thống kê & quán chiếu

### 8.1. Truy cập

- Từ navigation chính

### 8.2. Nội dung

- Tổng số việc thiện
- Theo ngày / tuần / tháng
- Chuỗi ngày liên tục

### 8.3. Nguyên tắc

- Trình bày trung tính
- Không màu sắc gây so sánh

---

## 9. Luồng 6 – Mục tiêu & achievement

### 9.1. Mục tiêu

1. Truy cập màn hình mục tiêu
2. Tạo / chỉnh sửa mục tiêu
3. Xem tiến trình

### 9.2. Achievement

- Hiển thị ghi nhận sự đều đặn
- Không bảng xếp hạng

---

## 10. Luồng 7 – Cài đặt & hồ sơ

### 10.1. Nội dung

- Thông tin người dùng
- Cài đặt reminder
- Quyền riêng tư

### 10.2. Nguyên tắc

- Ít tuỳ chọn
- Dễ hiểu

---

## 11. Điều hướng (Navigation)

### Mobile-first

- Bottom navigation:
  - Home
  - Check-in
  - Thống kê
  - Cài đặt

### Desktop

- Sidebar hoặc top navigation

---

## 12. Các trường hợp đặc biệt

### 12.1. Người dùng gián đoạn

- Không reset dữ liệu
- Không cảnh báo tiêu cực

### 12.2. Mất kết nối

- Hiển thị thông báo nhẹ
- Không chặn toàn bộ app

---

## 13. Kết luận

User flow của **3000 Việc Thiện** được thiết kế để:

- Dễ hiểu ngay lần đầu
- Sử dụng nhanh mỗi ngày
- Không tạo cảm giác bị điều khiển

Nếu một luồng:
- Phức tạp
- Nhiều bước
- Khiến người dùng phải suy nghĩ nhiều

→ Luồng đó **cần được đơn giản hoá**.