# 09. TÍNH NĂNG: CÔNG CỤ TU TẬP & NUÔI DƯỠNG NỘI TÂM

## 1. Tổng quan
Bộ công cụ này nhằm hỗ trợ người dùng "quay vào bên trong", nuôi dưỡng tâm trí bình an và tỉnh thức mỗi ngày.

Các công cụ bao gồm:
1.  **Pháp Ngữ Mỗi Ngày (Daily Dharma Quote)**
2.  **Sổ Tay Sám Hối & Biết Ơn (Repentance & Gratitude Journal)**
3.  **Hỗ Trợ Hành Thiền (Meditation Timer)**
4.  **Hơi Thở Tỉnh Thức (Breathing Guide)**
5.  **Gieo Duyên Lành (Random Acts of Kindness)**

---

## 2. Chi tiết từng tính năng

### 2.1. Pháp Ngữ Mỗi Ngày (Daily Dharma Quote)
**Mục đích:** Nhắc nhở tâm trí người dùng bằng những lời dạy ngắn gọn, sâu sắc ngay khi mở app.

**Luồng hoạt động:**
1.  Người dùng mở app.
2.  Tại màn hình Home, một Widget "Lời Phật Dạy" hoặc "Cổ Đức nói" hiển thị đầu tiên.
3.  Nội dung thay đổi mỗi ngày (theo server time 00:00).
4.  Người dùng có thể bấm "Chia sẻ" (copy text/image) hoặc "Lưu lại" (bookmark).

**Dữ liệu:**
-   `content`: Nội dung câu nói.
-   `author`: Tác giả/Nguồn (VD: Kinh Pháp Cú, Thiền sư Thích Nhất Hạnh...).
-   `category`: Chủ đề (vô thường, từ bi, nhẫn nhục...).

---

### 2.2. Sổ Tay Sám Hối & Biết Ơn (Repentance & Gratitude Journal)
**Mục đích:** Giúp người dùng thực hành hai pháp tu quan trọng:
-   **Sám hối:** Nhận diện lỗi lầm để sửa đổi.
-   **Biết ơn:** Nuôi dưỡng tâm tích cực, tri túc.

**Luồng hoạt động:**
1.  Người dùng vào mục "Sổ Tay".
2.  Chọn loại nhật ký: "Sám Hối" hoặc "Biết Ơn".
3.  Nhập nội dung ngắn (text).
4.  (Tuỳ chọn) Chọn cảm xúc hiện tại.
5.  Lưu lại. Nhật ký này **mặc định riêng tư**, chỉ mình người dùng thấy.

**Quy tắc:**
-   Không cho phép sửa/xoá sau 24h (để tôn trọng sự thật lịch sử tâm).
-   Hiển thị lại dưới dạng Timeline.

---

### 2.3. Hỗ Trợ Hành Thiền (Meditation Timer)
**Mục đích:** Công cụ đơn giản giúp người dùng định thời gian ngồi thiền/tĩnh tâm mà không cần app ngoài.

**Luồng hoạt động:**
1.  Người dùng chọn thời gian: 5p, 10p, 15p, 30p hoặc Tùy chỉnh.
2.  Bấm "Bắt đầu".
3.  Màn hình chuyển sang chế độ tối giản (Dim mode).
4.  Âm thanh chuông (Bell) rền nhẹ khi bắt đầu và kết thúc.
5.  Kết thúc: Tự động ghi nhận vào "Thời gian tu tập" của user (nếu có tính năng Stats).

**Yêu cầu UI:**
-   Đơn giản, không quảng cáo, không xao nhãng.
-   Giữ màn hình luôn sáng (Wake lock).

---

### 2.4. Hơi Thở Tỉnh Thức (Breathing Guide)
**Mục đích:** Giúp người dùng bình ổn cảm xúc nhanh khi căng thẳng/giận dữ.

**Luồng hoạt động:**
1.  Người dùng bấm "Thở".
2.  Một vòng tròn hiển thị giữa màn hình.
3.  Vòng tròn Phình ra (Hít vào - 4s) -> Giữ nguyên (Nín - 4s/7s) -> Thu nhỏ (Thở ra - 4s/8s).
4.  Có hướng dẫn chữ/âm thanh nhịp nhàng.

**Kỹ thuật:**
-   Hỗ trợ Box Breathing (4-4-4-4) hoặc 4-7-8.

---

### 2.5. Gieo Duyên Lành (Random Acts of Kindness)
**Mục đích:** Gợi ý hành động thiện khi người dùng muốn làm việc tốt nhưng chưa biết làm gì.

**Luồng hoạt động:**
1.  Người dùng bấm nút "Gợi ý việc thiện".
2.  Hệ thống hiển thị ngẫu nhiên 1 hành động từ database (VD: "Nhắn tin hỏi thăm bố mẹ", "Nhường ghế xe bus", "Cười với người lạ").
3.  Người dùng có thể:
    -   "Chấp nhận": Thêm vào danh sách To-do trong ngày.
    -   "Đổi việc khác": Random lại.

---

## 3. Yêu cầu phi chức năng
-   **Quyền riêng tư:** Tất cả nhật ký là Private by default.
-   **Offline:** Các tính năng Timer, Breathing nên hoạt động offline tốt (PWA). Quotes có thể cache.
-   **Âm thanh:** Âm thanh chuông phải thanh thoát, không chói tai (dùng file .mp3 chất lượng cao).
