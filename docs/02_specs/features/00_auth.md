# 00. XÁC THỰC (AUTHENTICATION)

## 1. Tổng quan
Hệ thống sử dụng **Google Sign-In** làm phương thức đăng nhập duy nhất để đơn giản hóa MVP.

**Nguyên tắc:** Không lưu password - Bảo mật token.

---

## 2. User Flow
1.  **Welcome Screen:** User thấy nút "Tiếp tục với Google".
2.  **Google Popup:** Chọn tài khoản Google.
3.  **Redirect:** Trở về App -> Loading...
4.  **Success:** Vào màn hình Home. Dữ liệu (Avatar, Tên) được đồng bộ từ Google.

## 3. Technical Flow
1.  Frontend gửi yêu cầu login tới Google -> Nhận `authorization_code`.
2.  Frontend gửi `code` tới Backend (`POST /api/v1/auth/google`).
3.  Backend trao đổi `code` lấy `google_access_token` & `user_info` từ Google Server.
4.  Backend tạo/update user trong Database.
5.  Backend cấp phát JWT `accessToken` & `refreshToken` trả về cho Frontend.
6.  Frontend lưu token vào `localStorage` (hoặc Cookie httpOnly).

## 4. Session Management
*   **Access Token:** Hết hạn sau 24 giờ.
*   **Refresh Token:** Hết hạn sau 6 tháng.
*   Khi Access Token hết hạn -> Frontend dùng Refresh Token để xin cấp mới (Silent Refresh).
