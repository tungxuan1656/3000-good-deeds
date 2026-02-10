---
title: Checklist hoàn thiện dự án
updated: 2026-02-10
---

# ✅ CHECKLIST HOÀN THIỆN DỰ ÁN 3000 VIỆC THIỆN

Mục tiêu của checklist này là chốt “phần hồn” (triết lý + ngôn từ), “phần trải nghiệm” (onboarding + hướng dẫn), và “phần nội dung” (quotes + random-acts) để dự án đi tới trạng thái phát hành ổn định.

## 0) Tiêu chí Done (áp dụng cho mọi hạng mục)

- [ ] Ngôn từ **ái ngữ – không phán xét – không tạo tội lỗi** (theo `docs/01_general/03_ethics.md`).
- [ ] Không gamification/không thao túng: tránh “đua top”, “điểm nghiệp”, “thua kém”, “mất streak là thất bại”.
- [ ] Privacy-first: mặc định an toàn; mọi công khai/chia sẻ phải **opt-in rõ ràng**.
- [ ] Có nút **Bỏ qua/Để sau** cho onboarding; có nơi mở lại onboarding trong Settings.
- [ ] Mọi màn hình quan trọng có: empty state, error state, loading state, và microcopy phù hợp.
- [ ] Mọi thông báo (reminder/push) có nội dung nhẹ nhàng + tuỳ chọn tắt dễ tìm.

---

## 1) Chuẩn hoá Microcopy (Title / Subtitle / Description / CTA)

### 1.1) Bộ quy chuẩn ngôn từ (toàn app)

- [ ] Định nghĩa “tone of voice” 1 trang: ngắn – ấm – tôn trọng – không hứa hẹn siêu hình.
- [ ] Quy ước thuật ngữ thống nhất:
	- [ ] “Việc thiện” / “Gieo duyên” / “Tu tập” / “Quán chiếu” / “Sổ tay tâm hồn”
	- [ ] Tránh từ gây áp lực: “phải”, “bắt buộc”, “thất bại”, “mất chuỗi”.
- [ ] Quy ước CTA:
	- [ ] Ưu tiên động từ nhẹ: “Ghi nhận”, “Thử”, “Nhắc nhẹ”, “Lưu lại”, “Để sau”.
	- [ ] Xác nhận thao tác nhạy cảm: “Xóa tài khoản”, “Xóa dữ liệu”, “Tắt nhắc nhở”.
- [ ] Microcopy cho lỗi và permission:
	- [ ] Xin quyền thông báo: nêu lợi ích + tôn trọng + có “Không, cảm ơn”.
	- [ ] Khi lỗi mạng: “Không sao, mình thử lại nhé” + nút thử lại.
- [ ] Soạn “bộ câu chuẩn” cho: empty states, success states, confirm dialogs.

### 1.2) Template microcopy cho từng feature (điền đầy đủ)

Áp dụng cho mỗi feature:
- Header title
- Subtitle / helper text
- Section title
- Button labels (primary/secondary)
- Empty state
- Confirmation dialogs
- Success toast
- Error messages
- Push notification copy (nếu có)

#### A) Home (trang chính)
- [ ] Title + subtitle phản ánh triết lý: “làm việc thiện – quay vào bên trong – không áp lực”.
- [ ] Section “Hôm nay” (quote, nhắc nhở nhẹ, lối vào ghi nhận nhanh) có hướng dẫn 1–2 câu.

#### B) Auth / Welcome
- [ ] Title/description không thổi phồng; nhấn mạnh privacy-first.
- [ ] Copy nút đăng nhập: rõ ràng (Google), có “Xem thêm về quyền riêng tư”.

#### C) Ghi nhận việc thiện (Deeds)
- [ ] Check-in: title/subtitle hướng về **ý hướng** (intention) + chánh niệm.
- [ ] 3 nhóm Thân/Khẩu/Ý: mô tả 1 câu cho mỗi nhóm, tránh “chấm điểm”.
- [ ] Lịch sử việc thiện: copy khuyến khích “nhìn lại” thay vì “thành tích”.
- [ ] Sửa/Xóa: dialog xác nhận dùng ái ngữ, không dọa nạt.

#### D) Hành trình (Journey)
- [ ] Định nghĩa rõ “Hành trình 3000” là tiến trình dài hạn, không phải cuộc đua.
- [ ] Copy cho tiến độ: tránh “còn thiếu X”, thay bằng “mỗi bước nhỏ đều quý”.
- [ ] Khi gián đoạn: có “chào mừng quay lại” (không guilt-tripping).

#### E) Mục tiêu (Goals)
- [ ] Title/subtitle nêu triết lý: mục tiêu để “hướng tâm”, không để tự ép.
- [ ] Copy thiết lập mục tiêu: gợi ý chọn mức dễ bắt đầu.
- [ ] Copy khi không đạt: “không sao, mình điều chỉnh cho phù hợp”.

#### F) Nhắc nhở (Reminders)
- [ ] Title/subtitle: nhắc nhẹ, có thể tắt bất kỳ lúc nào.
- [ ] Copy khi xin quyền notification: rõ mục đích, không gây sợ hãi.
- [ ] Copy “quiet hours”: tôn trọng sinh hoạt.

#### G) Thống kê (Stats)
- [ ] Title/subtitle nhấn mạnh: thống kê để soi chiếu, **không phải điểm công đức**.
- [ ] Streak: copy trung tính; có tuỳ chọn ẩn.
- [ ] Biểu đồ: mô tả ý nghĩa và cách đọc.

#### H) Tu tập (Cultivation)
- [ ] Pháp ngữ: title/subtitle nêu “đọc chậm – thở nhẹ – mang vào đời sống”.
- [ ] Gieo duyên (random-acts): copy khuyến khích thử điều nhỏ, không ép.
- [ ] Thiền/Thở: hướng dẫn 1 màn hình, không thuật ngữ khó.

#### I) Sổ tay tâm hồn (Soul Journal)
- [ ] Title/subtitle nhấn mạnh “riêng tư, an toàn, không phán xét”.
- [ ] Mô tả rõ nguyên tắc “Write & Let Go” (không sửa/xóa sau khi lưu — nếu vẫn giữ).
- [ ] Copy an toàn: “Ứng dụng không thay thế chuyên gia” (tùy bạn quyết).

#### J) Profile / Settings
- [ ] Copy quyền riêng tư: xuất dữ liệu, xóa tài khoản, tắt thông báo.
- [ ] “Xóa tài khoản”: mô tả rõ dữ liệu bị xóa, thời gian hiệu lực.

### 1.3) Microcopy inventory theo từng màn hình (theo `docs/04_design/02_screens.md`)

Mục tiêu: mỗi màn hình có đầy đủ Title/Subtitle/Section/CTA + hướng dẫn sử dụng ngắn.

- [ ] 1️⃣ Login / Onboarding: slogan, mô tả ngắn, quyền riêng tư, CTA.
- [ ] 2️⃣ Home: lời chào, “hôm nay”, quote, FAB/quick action, empty state.
- [ ] 3️⃣–6️⃣ Check-in Wizard:
	- [ ] Step 1 Loại (Thân/Khẩu/Ý): mô tả 1 câu mỗi loại.
	- [ ] Step 2 Chi tiết: placeholder + helper + privacy note.
	- [ ] Step 3 Ảnh (optional): giải thích “vì sao/để làm gì” + skip copy.
	- [ ] Step 4 Cảm xúc: nhấn mạnh “tự nhận diện” (không đánh giá).
	- [ ] Confirm cancel + success state.
- [ ] 7️⃣ Timeline: empty/loading + nhóm theo ngày + gợi ý quay lại Home.
- [ ] 8️⃣ Deed Detail: xem/sửa/xoá + dialog ngôn từ ái ngữ.
- [ ] 9️⃣ Stats: mô tả ý nghĩa số liệu + empty data encouragement.
- [ ] 🔟 Goals Overview + Setup New Goal + Goal Completed.
- [ ] 1️⃣1️⃣ Inner Hub: mô tả “kho tàng tu tập”, dẫn dắt nhẹ.
- [ ] 1️⃣2️⃣ Full Quote View: mô tả đọc chậm + (nếu có) share copy trung tính.
- [ ] 1️⃣3️⃣ Random Acts: copy cho Next/Accept + “ẩn gợi ý này”.
- [ ] 1️⃣4️⃣ Journal List + 1️⃣5️⃣ Editor: hướng dẫn 2 chế độ + lưu trữ.
- [ ] 1️⃣6️⃣ Meditation/Breath: hướng dẫn nhịp thở + trạng thái chạy/tạm dừng.
- [ ] 1️⃣7️⃣ Profile/Settings + Danger Zone: logout/delete confirm.

---

## 2) Onboarding Screens (theo từng mảng)

### 2.1) Khung onboarding chung (global)

- [ ] Có 2 lớp onboarding:
	- [ ] First-run onboarding (3–6 màn) cho triết lý + setup.
	- [ ] Contextual onboarding (1–2 màn) khi user mở feature lần đầu.
- [ ] Có “Bỏ qua”, “Xem lại sau”, và “Xem lại onboarding” trong Settings.
- [ ] Mỗi onboarding có mục tiêu rõ: 1 thông điệp chính / 1 hành động tiếp theo.

### 2.2) Onboarding: General (triết lý + an toàn)

- [ ] Màn 1: “Đây không phải mạng xã hội” + privacy-first.
- [ ] Màn 2: “Không chấm điểm công đức / không thao túng” (no dark patterns).
- [ ] Màn 3: “Mỗi việc nhỏ đều quý” + cách dùng nhanh (ghi nhận / tu tập).
- [ ] Màn 4: Quyền dữ liệu: xem/xuất/xóa tài khoản (dễ rời đi).

### 2.3) Onboarding: Ghi nhận việc thiện

- [ ] Màn 1: “Ghi nhận để nhớ và nuôi dưỡng tâm thiện”.
- [ ] Màn 2: 3 loại Thân/Khẩu/Ý + ví dụ nhỏ.
- [ ] Màn 3: Gợi ý “ý hướng” (tùy chọn) + riêng tư.
- [ ] Màn 4: Sau khi lưu: hướng dẫn xem lịch sử / mục tiêu (không ép).

### 2.4) Onboarding: Tu tập (Cultivation)

- [ ] Màn 1: Pháp ngữ theo phiên (mỗi lần mở app): “đọc chậm 10 giây”.
- [ ] Màn 2: Gieo duyên: “gợi ý việc thiện khi bạn chưa biết bắt đầu”.
- [ ] Màn 3: Thiền/Thở: timer + hướng dẫn nhịp thở.
- [ ] Màn 4: Offline-first: dùng được khi không có mạng.

### 2.5) Onboarding: Hành trình

- [ ] Màn 1: “Hành trình là đường dài – không cần vội”.
- [ ] Màn 2: Cách xem tiến độ 3000 + cách đặt mục tiêu phù hợp.
- [ ] Màn 3: Khi gián đoạn: “chào mừng quay lại” + cách tiếp tục.

### 2.6) Onboarding: Thống kê

- [ ] Màn 1: “Thống kê để soi chiếu, không phải để phán xét”.
- [ ] Màn 2: Giải thích streak (nếu có) + tuỳ chọn ẩn.
- [ ] Màn 3: Cách đọc biểu đồ + gợi ý rút ra 1 điều nhỏ.

### 2.7) Onboarding: Sổ tay tâm hồn

- [ ] Màn 1: “Không gian riêng tư để quán chiếu”.
- [ ] Màn 2: 2 chế độ Sám hối / Biết ơn + khi nào dùng.
- [ ] Màn 3: Nguyên tắc lưu trữ (không sửa/xóa? có xóa? chốt 1 hướng).
- [ ] Màn 4: Gợi ý an toàn + nút “Thoát nhanh” (tùy chọn).

### 2.8) Onboarding: Cài đặt PWA + Thông báo (push)

- [ ] Màn 1: Vì sao nên cài PWA (nhanh, như app, dùng offline tốt hơn).
- [ ] Màn 2: Hướng dẫn cài PWA theo nền tảng:
	- [ ] iOS Safari: Share → Add to Home Screen.
	- [ ] Android Chrome: Install app / Add to Home screen.
	- [ ] Desktop Chrome/Edge: Install icon trên thanh địa chỉ.
- [ ] Màn 3: Xin quyền thông báo: mô tả lợi ích + tôn trọng + có từ chối.
- [ ] Màn 4: Test notification: “Gửi thử một thông báo” (chỉ khi user bấm).
- [ ] Màn 5: Troubleshooting: nếu không nhận thông báo (tắt focus/do not disturb, quyền browser, pin tiết kiệm, v.v.).

---

## 3) Xây dựng nguồn dữ liệu dồi dào (Quotes & Random-acts)

### 3.1) Khung dữ liệu + tiêu chuẩn nội dung

- [ ] Chốt “tiêu chuẩn nguồn” (Truthfulness): chỉ dùng nguồn được phép (public domain/CC-BY/được cho phép rõ ràng/tự viết).
- [ ] Checklist pháp lý/nội dung:
	- [ ] Mỗi quote có attribution tối thiểu: tác phẩm/nguồn, tác giả/truyền thống, bản dịch (nếu có), license/ghi chú quyền.
	- [ ] Không dùng câu sai nguồn / gán nhầm tác giả.
	- [ ] Tránh nội dung mê tín – hứa hẹn siêu hình.
- [ ] Chốt schema dữ liệu (tối thiểu):
	- [ ] `text`, `source_title`, `source_author_or_tradition`, `translator` (optional), `language`, `tags`, `license_note`, `review_status`.
- [ ] Quy ước độ dài + formatting: tối ưu đọc trên mobile, không xuống dòng rối.

### 3.2) Quotes (Pháp ngữ)

- [ ] Mục tiêu số lượng:
	- [ ] MVP: ≥ 200 quotes sạch (đủ dùng ~6 tháng nếu 1/ngày + random).
	- [ ] V1: ≥ 1000 quotes (đa nguồn, có tag).
- [ ] Rà soát quyền sử dụng dữ liệu quotes hiện có (nếu đang dùng file seed):
	- [ ] Xác minh license/nguồn cho từng tập dữ liệu (public domain/CC/được phép/tự biên soạn).
	- [ ] Nếu không chắc quyền: chỉ dùng trích đoạn do bạn tự viết/paraphrase + ghi rõ “phỏng dịch/diễn ý”, hoặc thay bằng nguồn hợp lệ.
- [ ] Tag taxonomy:
	- [ ] Từ bi, Chánh niệm, Nhẫn nhục, Buông xả, Biết ơn, Tỉnh thức, Ái ngữ, Vô thường...
- [ ] Quy trình biên tập:
	- [ ] Thu thập → chuẩn hóa → gắn tag → kiểm nguồn → duyệt.
	- [ ] Loại trùng/na ná bằng quy tắc similarity.
- [ ] Logic phân phối:
	- [ ] “Quote of the session”: chọn 1 câu khi bắt đầu phiên, hiển thị ổn định trong phiên.
	- [ ] Client cache: lưu quote hiện tại (session cache) + danh sách dự phòng (ví dụ 30 câu) để dùng offline.

### 3.3) Random-acts (Gieo duyên)

- [ ] Mục tiêu số lượng:
	- [ ] MVP: ≥ 150 gợi ý.
	- [ ] V1: ≥ 500 gợi ý.
- [ ] Cấu trúc mỗi gợi ý:
	- [ ] `title` (ngắn), `description` (1–2 câu), `category` (Thân/Khẩu/Ý), `duration`, `difficulty`, `context` (ở nhà/ngoài đường/công sở), `cost` (0/nhỏ).
- [ ] Bộ lọc phù hợp cá nhân:
	- [ ] Người hướng nội/hướng ngoại, ít thời gian, không muốn tương tác, hạn chế di chuyển.
- [ ] Safety checklist:
	- [ ] Không gợi ý hành động nguy hiểm/vi phạm pháp luật/nhạy cảm.
	- [ ] Tránh “cứu rỗi/ban ơn”; dùng ngôn từ tôn trọng.

### 3.4) Pipeline nhập dữ liệu (seed/import)

- [ ] Chuẩn hoá format file nguồn (CSV/JSON) + versioning.
- [ ] Có script seed idempotent (chạy nhiều lần không nhân bản).
- [ ] Có bước validate:
	- [ ] Thiếu trường bắt buộc.
	- [ ] Trùng nội dung.
	- [ ] Ký tự lỗi/encoding.
- [ ] Có “review_status”: draft/approved/rejected.

### 3.5) Chất lượng trải nghiệm nội dung

- [ ] Có cơ chế “Báo lỗi nội dung” (sai nguồn, khó hiểu, không phù hợp).
- [ ] Có cơ chế “Ẩn gợi ý này” cho random-acts.
- [ ] Có log thay đổi nội dung (ai sửa, sửa gì) trong quy trình biên tập (tối thiểu ở level tài liệu).

---

## 4) Checklist chốt mâu thuẫn tài liệu (khuyến nghị làm trước khi polish UI)

- [x] Navigation (responsive hybrid): Web dùng sidebar; Mobile dùng bottom-navigation.
- [x] Goals: chỉ có weekly, monthly, yearly.
- [x] Privacy: luôn private; không có toggle trong các tính năng.
- [x] Token: access token 24h; refresh token 6 tháng.
- [x] Quote: theo session; cache tại client.

---

## 5) Tài liệu bàn giao (để phát hành)

- [ ] 1 trang “User Guide”: cách dùng 5 phút (ghi nhận, tu tập, nhắc nhở, xem hành trình).
- [ ] 1 trang “Privacy & Data”: dữ liệu nào lưu, lưu ở đâu, cách xóa, cách xuất.
- [ ] 1 trang “PWA + Notifications”: hướng dẫn cài, cấp quyền, xử lý sự cố.

