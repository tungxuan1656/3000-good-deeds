# 3000 Good Deeds - Product Feature Overview

## 1) Giới thiệu về dự án

3000 Good Deeds là một sản phẩm nhật ký hướng thiện, giúp người dùng ghi lại những việc tốt hằng ngày, nhìn lại hành trình của mình và duy trì động lực sống tử tế theo cách nhẹ nhàng, riêng tư.

Trọng tâm của sản phẩm:
- Ghi nhận việc tốt nhanh, dễ làm mỗi ngày.
- Quán chiếu bản thân mà không so sánh với người khác.
- Duy trì thói quen bằng mục tiêu và nhắc nhở phù hợp.

---

## 2) Định hướng triển khai giao diện

Sản phẩm được triển khai theo 2 trải nghiệm chính:

1. Phiên bản web (desktop/tablet)
- Điều hướng chính bằng sidebar.
- Phù hợp cho người dùng xem tổng quan và theo dõi lịch sử dài.

2. Phiên bản web responsive cho mobile
- Điều hướng chính bằng bottom-tab.
- Tối ưu thao tác nhanh, dùng một tay, ưu tiên ghi nhận việc tốt ngay.

---

## 3) Các khái niệm dữ liệu trong dự án

Phần này mô tả dữ liệu theo góc nhìn nghiệp vụ, không theo định dạng kỹ thuật.

### 3.1 Người dùng
Mỗi người dùng có các thông tin:
- Email
- Tên hiển thị
- Không sử dụng avatar
- Trạng thái phương thức đăng nhập (email/mật khẩu hoặc Google)

### 3.2 Việc tốt
Mỗi việc tốt người dùng ghi lại gồm:
- Ngày/giờ thực hiện
- Mô tả ngắn về việc tốt
- Các nhãn cảm xúc do người dùng tự gán (ví dụ: an vui, biết ơn, nhẹ lòng, ấm áp, bình an, hy vọng)

### 3.3 Mục tiêu theo kỳ
Người dùng có thể đặt mục tiêu cho:
- Tuần
- Tháng
- Năm

Mỗi mục tiêu có ý nghĩa:
- Mốc phấn đấu cho kỳ hiện tại
- Trạng thái bật/tắt
- Số lượng mục tiêu mong muốn đạt

### 3.4 Lịch sử hoàn thành mục tiêu
Mỗi bản ghi lịch sử mục tiêu thể hiện:
- Loại mục tiêu (tuần/tháng/năm)
- Khoảng thời gian áp dụng (ngày bắt đầu - ngày kết thúc)
- Mức mục tiêu đã đặt
- Kết quả thực tế đã làm
- Trạng thái hoàn thành (đã hoàn thành / đang thực hiện / chưa hoàn thành)

### 3.5 Dữ liệu thống kê
Phần thống kê hiển thị:
- Tổng số việc tốt đã ghi nhận
- Tình hình theo kỳ tuần/tháng
- Lịch tháng thể hiện mức độ hoạt động theo từng ngày

### 3.6 Câu quote ngẫu nhiên
Một câu quote gồm:
- Nội dung câu quote
- Tác giả (nếu có)

### 3.7 Gợi ý việc tốt ngẫu nhiên
Một gợi ý việc tốt gồm:
- Tên gợi ý
- Mô tả ngắn
- Ghi chú đi kèm (nếu có)

### 3.8 Cài đặt nhắc nhở
Dữ liệu nhắc nhở gồm:
- Bật/tắt nhắc nhở
- Giờ nhắc nhở hằng ngày

---

## 4) Danh sách màn hình

Hệ thống hiện sử dụng các màn hình sau:

1. Màn hình đăng nhập
2. Màn hình trang chủ
3. Màn hình lịch sử việc tốt (timeline)
4. Màn hình sổ tay quán chiếu (Reflection Handbook)
5. Màn hình tiến trình và mục tiêu (gộp Goals + Stats)
6. Màn hình More (thông tin tài khoản và cài đặt cá nhân)

---

## 5) Các thành phần dùng chung ở nhiều màn hình

Các thành phần dưới đây xuất hiện lặp lại ở nhiều màn hình để giúp hệ thống dễ bảo trì và tái sử dụng.

### 5.1 Khối tiêu đề màn hình
- Hiển thị tiêu đề, mô tả ngắn và ngữ cảnh của màn hình.

### 5.2 Khối thẻ nội dung
- Dùng để nhóm nội dung theo từng cụm rõ ràng (ví dụ: một phần thống kê, một phần lịch sử, một phần thao tác).

### 5.3 Khối trạng thái dữ liệu
- Trạng thái đang tải dữ liệu.
- Trạng thái chưa có dữ liệu.
- Trạng thái có lỗi.

### 5.4 Khối xác nhận hành động quan trọng
- Dùng khi người dùng thực hiện hành động nhạy cảm như xóa dữ liệu, xóa tài khoản.

### 5.5 Thành phần quote ngẫu nhiên
- Hiển thị một câu quote ngẫu nhiên.
- Có nút làm mới để hiển thị câu quote khác.
- Mỗi quote gồm nội dung và tác giả.

### 5.6 Thành phần gợi ý việc tốt ngẫu nhiên
- Hiển thị một hoặc nhiều gợi ý việc tốt.
- Có thao tác đổi gợi ý khác.

### 5.7 Thành phần ghi nhận nhanh việc tốt
- Cho phép mở luồng ghi nhận việc tốt ngay tại chỗ.
- Tối ưu cho thao tác nhanh, ít bước.

### 5.8 Thành phần danh sách lịch sử
- Dùng cho danh sách việc tốt hoặc danh sách lịch sử mục tiêu.
- Hỗ trợ tải thêm dữ liệu khi cần.

---

## 6) Giới thiệu chi tiết từng màn hình

## 6.1 Màn hình đăng nhập

### Người dùng làm gì
- Đăng nhập bằng email/mật khẩu.
- Đăng ký tài khoản mới.
- Yêu cầu quên mật khẩu.
- Đăng nhập bằng Google.

### Thành phần chính trong màn hình
- Khu vực chuyển đổi giữa đăng nhập/đăng ký/quên mật khẩu.
- Biểu mẫu nhập thông tin tài khoản.
- Nút đăng nhập Google.
- Vùng hiển thị thông báo lỗi hoặc thông báo thành công.

---

## 6.2 Màn hình trang chủ

### Người dùng làm gì
- Xem tổng quan trong ngày.
- Ghi nhận nhanh một việc tốt mới.
- Xem các việc tốt đã ghi trong ngày hôm nay.
- Nhận nội dung hỗ trợ như quote ngẫu nhiên và gợi ý việc tốt.

### Thành phần chính trong màn hình
- Khối tiêu đề trang.
- Khối ghi nhận nhanh việc tốt.
- Khối danh sách việc tốt hôm nay.
- Khối quote ngẫu nhiên.
- Khối gợi ý việc tốt ngẫu nhiên.
- Khối gợi ý bật nhắc nhở (khi người dùng đang tắt nhắc nhở).

---

## 6.3 Màn hình lịch sử việc tốt (Timeline)

### Người dùng làm gì
- Xem lại toàn bộ việc tốt đã ghi theo thứ tự mới nhất.
- Xem dữ liệu theo từng nhóm ngày.
- Chỉnh sửa thông tin một việc tốt đã ghi.
- Xóa một việc tốt đã ghi.

### Thành phần chính trong màn hình
- Khối tiêu đề trang.
- Khối nhóm dữ liệu theo ngày.
- Mỗi mục việc tốt có vùng thao tác chỉnh sửa/xóa.
- Hộp xác nhận khi xóa.
- Khối tải thêm dữ liệu.

---

## 6.4 Màn hình sổ tay quán chiếu (Reflection Handbook)

### Người dùng làm gì
- Viết nhật ký quán chiếu theo 2 chế độ: biết ơn hoặc sám hối.
- Lưu bài quán chiếu.
- Xem lại lịch sử các bài đã viết.
- Xóa bài viết theo quy tắc sản phẩm.

### Thành phần chính trong màn hình
- Khối tiêu đề trang.
- Khu vực chọn loại quán chiếu.
- Khu vực nhập nội dung quán chiếu.
- Ghi chú định hướng giúp người dùng viết đúng mục đích.
- Danh sách lịch sử bài quán chiếu.
- Hộp xác nhận khi xóa.
- Khối quote ngẫu nhiên và gợi ý việc tốt ngẫu nhiên (dạng nhúng).

---

## 6.5 Màn hình tiến trình và mục tiêu (gộp Goals + Stats)

### Ý nghĩa màn hình
Người dùng có thể xem thống kê việc tốt của mình và cài đặt mục tiêu để tăng động lực phấn đấu.

### Thứ tự hiển thị nội dung từ trên xuống dưới
1. Tổng số việc tốt đã thực hiện.
2. Mục tiêu tuần/tháng/năm hiện tại.
3. Lịch tháng.
4. Danh sách các kỳ tuần/tháng/năm đã hoàn thành mục tiêu.

### Người dùng làm gì
- Xem tổng quan mức độ thực hành của bản thân.
- Cài đặt hoặc cập nhật mục tiêu theo tuần/tháng/năm.
- Theo dõi hoạt động theo lịch tháng.
- Xem lịch sử các kỳ đã hoàn thành mục tiêu để tự tạo động lực.

### Thành phần chính trong màn hình
- Khối tổng số việc tốt.
- Khối cài đặt mục tiêu hiện tại.
- Khối lịch tháng.
- Khối danh sách lịch sử hoàn thành mục tiêu.

---

## 6.6 Màn hình More

### Người dùng làm gì
- Xem thông tin tài khoản.
- Cập nhật tên hiển thị (không có avatar).
- Quản lý thông báo nhắc nhở.
- Thay đổi mật khẩu.
- Đăng xuất.
- Xóa tài khoản.

### Thành phần chính trong màn hình
- Khối thông tin tài khoản cơ bản.
- Khối cập nhật tên hiển thị.
- Khối cài đặt nhắc nhở.
- Khối thay đổi mật khẩu.
- Hành động đăng xuất.
- Hành động xóa tài khoản và xác nhận xóa.

---

## 7) Ghi chú thêm (Product-Level Decisions Applied)

1. Loại bỏ hoàn toàn phân loại việc tốt theo thân/khẩu/ý.
2. Loại bỏ hoàn toàn tính năng thiền (meditation).
3. Sử dụng màn hình Reflection Handbook thay cho màn hình Inner reflection cũ.
4. Random quotes và kindness suggestions được dùng dưới dạng thành phần nhúng, không có màn hình riêng.
5. Tạm thời loại bỏ Terms of Use và Privacy Policy khỏi phạm vi triển khai hiện tại.
6. Tài liệu này là nguồn mô tả nghiệp vụ chính để frontend hiện thực thành website.
