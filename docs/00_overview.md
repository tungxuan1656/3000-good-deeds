# 00. OVERVIEW – TỔNG QUAN DỰ ÁN & BẢN ĐỒ TÀI LIỆU

## 1. Mục đích của tài liệu này

Tài liệu **Overview** này đóng vai trò là:

* Cửa ngõ để **hiểu toàn bộ ý tưởng ứng dụng**
* Bản đồ chỉ dẫn giúp bạn **biết cần đọc tài liệu nào, khi làm việc gì**
* Điểm tham chiếu nhanh khi:

  * Tạm nghỉ dự án một thời gian
  * Onboard người mới
  * Tự hỏi: *“Mình đang làm đúng hướng chưa?”*

Nếu chỉ được giữ lại **một tài liệu duy nhất**, thì đây chính là tài liệu đó.

---

## 2. Tổng quan ý tưởng ứng dụng

### 2.1. Ứng dụng này là gì?

**3000 Việc Thiện** là một **web application hướng về tu tập và sống hướng thiện**, giúp người dùng:

* Ghi nhận lại những việc thiện đã làm
* Tự quán chiếu hành vi thân – khẩu – ý
* Duy trì thói quen sống thiện lành một cách bền bỉ

Ứng dụng **không phải**:

* Mạng xã hội
* Công cụ chấm điểm đạo đức
* Ứng dụng game hoá việc thiện

Mà là một **nhật ký hướng thiện có định hướng**.

---

### 2.2. Tinh thần cốt lõi

Toàn bộ ứng dụng được xây dựng trên tinh thần:

* Hướng nội hơn hướng ngoại
* Khiêm cung hơn phô trương
* Bền bỉ hơn rực rỡ

Mọi quyết định sản phẩm đều phải trả lời được câu hỏi:

> “Điều này có giúp người dùng **sống thiện lành và tự do nội tâm hơn** hay không?”

---

## 3. Phạm vi hiện tại của dự án

### 3.1. Giai đoạn

* Giai đoạn hiện tại: **MVP – Web-first**
* Nền tảng: Web application (mobile-first, PWA-ready)

### 3.2. Có trong MVP

* Đăng ký / đăng nhập
* Check-in việc thiện
* Phân loại việc thiện
* Thống kê & quán chiếu
* Mục tiêu
* Achievement (ghi nhận)
* Reminder (nhắc nhở)

### 3.3. Chưa có trong MVP

* Mạng xã hội
* Chia sẻ công khai
* Quyên góp / thanh toán
* Nội dung audio / video

---

## 4. Cấu trúc tổng thể bộ tài liệu

```txt
docs/
├── 00_overview.md
├── project/           # Vision, product, legal
│   ├── 00_overview.md
│   ├── vision/
│   ├── product/
│   └── legal-ethics/
├── frontend/          # UX, UI, FE architecture
│   ├── 00_overview.md
│   ├── ux/
│   └── design/
├── backend/           # Backend docs
│   └── 00_overview.md
└── contract/          # FE ↔ BE contract
  ├── 00_overview.md
  ├── features/
  ├── data/
  ├── api_overview.md
  └── api/
```

Mỗi thư mục lớn đều có `00_overview.md` để hướng dẫn đọc nhanh trong phạm vi thư mục đó.

---

## 5. HƯỚNG DẪN ĐỌC TÀI LIỆU THEO CÔNG VIỆC

Phần này trả lời câu hỏi quan trọng nhất:

> **“Khi tôi đang làm X, tôi cần đọc những tài liệu nào?”**

---

## 6. Khi xác định TƯ TƯỞNG & ĐỊNH HƯỚNG

**Mục tiêu:** Không để sản phẩm đi lệch tinh thần ban đầu.

📘 Nên đọc theo thứ tự:

1. `project/vision/01_vision.md`
2. `project/vision/02_philosophy_ethics.md`
3. `project/vision/03_tone_of_voice.md`

📌 Đọc khi:

* Phân vân có nên thêm tính năng mới
* Viết nội dung UI / notification
* Review quyết định sản phẩm lớn

---

## 7. Khi làm PRODUCT & LẬP KẾ HOẠCH

**Mục tiêu:** Biết rõ làm gì – không làm gì.

📘 Nên đọc:

1. `project/product/01_prd.md`
2. `project/product/02_scope_definition.md`
3. `project/product/03_roadmap_mvp.md`

📌 Đọc khi:

* Lập roadmap
* Chia task
* Tự hỏi “MVP đã xong chưa?”

---

## 8. Khi thiết kế UX (luồng & trải nghiệm)

**Mục tiêu:** Thiết kế đúng người – đúng thời điểm.

📘 Nên đọc:

1. `frontend/ux/01_user_persona.md`
2. `frontend/ux/02_user_journey.md`
3. `frontend/ux/03_user_flow.md`

📌 Đọc khi:

* Vẽ wireframe
* Quyết định màn hình nào quan trọng
* Thiết kế navigation

---

## 9. Khi CODE TÍNH NĂNG (Frontend / Backend)

**Mục tiêu:** Code đúng logic, không phải đoán.

📘 Nên đọc:

* `contract/features/*`

Ví dụ:

- Code check-in → `03_good_deed_checkin.md`
- Code thống kê → `05_statistics.md`
- Code mục tiêu → `06_goals.md`

📌 Đọc khi:

* Viết API
* Viết Zustand store
* Review PR

---

## 10. Khi làm DATA & BACKEND

**Mục tiêu:** Thiết kế dữ liệu nhất quán.

📘 Nên đọc:

* `contract/data/*`
* `backend/04_database.md`
* `contract/database_feature_mapping.md`
* `contract/api_overview.md`
* `contract/api/*` (chi tiết endpoint)

📌 Đọc khi:

* Thiết kế database
* Viết API contract
* Tối ưu logic nghiệp vụ

---

## 10.1. Khi implement Backend/API (hướng dẫn nhanh)

1. Xác định tính năng → đọc `contract/features/*`
2. Đối chiếu data → đọc `contract/database_feature_mapping.md`
3. Xem danh sách endpoint → đọc `contract/api_overview.md`
4. Xem chi tiết request/response → đọc `contract/api/*`

---

## 11. Khi làm UI & DESIGN SYSTEM

**Mục tiêu:** UI nhất quán, không lệch tinh thần.

📘 Nên đọc:

* `frontend/design/*`
* Kết hợp với `project/vision/03_tone_of_voice.md`

📌 Đọc khi:

* Chọn màu sắc
* Viết UI text
* Review giao diện

---

## 12. Khi review ĐẠO ĐỨC & RỦI RO

**Mục tiêu:** Tránh app gây tác động tiêu cực.

📘 Nên đọc:

* `project/vision/02_philosophy_ethics.md`
* `project/legal-ethics/*`

📌 Đọc khi:

* Chuẩn bị public
* Thêm tính năng nhạy cảm
* Viết điều khoản / privacy

---

## 13. Cách sử dụng tài liệu hiệu quả

* Không cần đọc tất cả cùng lúc
* Chỉ đọc **đúng nhóm cho đúng việc**
* Khi phân vân → quay lại **Vision & Ethics**

Tài liệu này được thiết kế để:

* Bạn có thể dừng dự án vài tuần
* Quay lại đọc overview
* Và tiếp tục mà **không mất phương hướng**

---

## 14. Kết luận

Bộ tài liệu của **3000 Việc Thiện** được xây dựng để:

* Giảm suy nghĩ lặp lại
* Giảm quyết định cảm tính
* Giữ vững tinh thần hướng thiện trong suốt vòng đời sản phẩm

Nếu có lúc bạn tự hỏi:

> “Mình đang làm cái này để làm gì?”

Hãy quay lại **tài liệu Overview này** trước tiên.
