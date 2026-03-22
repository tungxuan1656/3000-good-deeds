# 08. Risk Log & Open Questions

## Mục tiêu
Ghi nhận rủi ro chính trong đợt refactor IA/UI theo Stitch, các điểm rollback, và câu hỏi mở cần theo dõi sau khi merge.

## Risk Log

### R1. Breaking URL do bỏ route cũ
- Mô tả: URL cũ (`/inner*`, `/stats`, `/goals`, `/settings`) không còn hoạt động.
- Tác động: Người dùng bookmark link cũ có thể gặp 404.
- Mức độ: Trung bình.
- Giảm thiểu:
  - Cập nhật tài liệu release note.
  - Cập nhật menu điều hướng nhất quán ở mọi shell desktop/mobile.
  - Theo dõi log truy cập route 404 sau release.
- Rollback point:
  - Khôi phục route alias tạm thời trong `app.tsx` nếu tỷ lệ 404 tăng bất thường.

### R2. Regression i18n do đổi key IA
- Mô tả: Đổi key từ cụm `inner/*` sang `handbook/progress/more` có thể thiếu key ở một số component.
- Tác động: Hiển thị fallback key thô trên UI.
- Mức độ: Trung bình.
- Giảm thiểu:
  - Chạy lint/type-check và QA thủ công các luồng chính.
  - Rà soát toàn bộ key menu, breadcrumbs, page headers.
- Rollback point:
  - Tạm bổ sung alias key i18n nếu thiếu bản dịch ở production.

### R3. Sai lệch thiết kế do migration token lớn
- Mô tả: Đổi typography + palette + no-line rule ảnh hưởng diện rộng.
- Tác động: UI không đồng nhất hoặc contrast chưa tối ưu ở vài block.
- Mức độ: Trung bình.
- Giảm thiểu:
  - QA responsive theo breakpoint 390/768/1024/1280+.
  - So khớp visual với `DESIGN.md` cho 6 màn hình chuẩn.
- Rollback point:
  - Khôi phục một phần token cũ cho component bị ảnh hưởng nặng (hotfix scope nhỏ).

### R4. Regression luồng More (gộp settings)
- Mô tả: Gộp nhiều thao tác nhạy cảm (password, logout, delete account, reminder) về 1 màn hình.
- Tác động: Có thể phát sinh lỗi state hoặc điều hướng sau hành động.
- Mức độ: Cao.
- Giảm thiểu:
  - Test manual end-to-end từng action trong More.
  - Kiểm tra trạng thái loading/error/success của từng card.
- Rollback point:
  - Tách lại một action cụ thể thành route riêng nếu có lỗi nghiêm trọng chưa fix kịp.

### R5. Data mapping mismatch ở Progress/Handbook
- Mô tả: Màn hình gộp có thể map thiếu field API hoặc xử lý fallback chưa đúng.
- Tác động: Dữ liệu hiển thị thiếu/chưa đúng ngữ nghĩa nghiệp vụ.
- Mức độ: Trung bình.
- Giảm thiểu:
  - Bám `04-screen-component-api-mapping.md` khi kiểm thử.
  - Bổ sung test integration cho block stats/goal/journal nếu thiếu.
- Rollback point:
  - Ẩn tạm block lỗi (feature flag UI) trong khi giữ phần còn lại hoạt động.

## Open Questions

1. Có cần thêm redirect mềm (302/SPA navigate) cho một số route cũ có traffic cao trong 1-2 release đầu không?
2. Có cần chuẩn hóa thêm locale `en` song song với `vi` trong cùng đợt để tránh lệch key đa ngôn ngữ?
3. Có cần bổ sung visual regression test snapshot cho 6 màn hình chuẩn sau refactor?
4. Với daily suggestion text-only, có cần ràng buộc độ dài text/cắt dòng tiêu chuẩn để đảm bảo layout ổn định?
5. Có cần log event analytics mới theo IA (`handbook`, `progress`, `more`) để so sánh funnel trước/sau refactor?

## Theo dõi sau release
- Theo dõi 404 route trong 72 giờ đầu.
- Theo dõi lỗi JS runtime liên quan navigation/menu/breadcrumb.
- Theo dõi tỷ lệ hoàn thành các tác vụ chính: quick record, timeline edit/delete, handbook save, goal update, account actions.
