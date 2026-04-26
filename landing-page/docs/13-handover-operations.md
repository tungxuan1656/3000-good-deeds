# 13 - Handover & Operations (LP-12)

Tài liệu này là gói bàn giao để vận hành landing page sau release.

## Trạng thái hiện tại

- LP-10 (Deploy production trên Vercel): Đã hoàn thành (theo xác nhận triển khai).
- Production URL: `https://3000-viec-thien.vercel.app/`.
- LP-11 (Search Console): cần thao tác manual theo tài liệu `12-search-console-execution.md`.

## Danh sách việc manual bắt buộc sau deploy

1. Hoàn thành checklist LP-11 trên Search Console.
2. Thay toàn bộ placeholder bằng ảnh thật theo `05-image-placeholders.md`.
3. Upload OG image chính thức `1200x630`.
4. Kiểm tra lại canonical, robots, sitemap trên production URL cuối cùng.

## Lịch vận hành SEO đề xuất

### Tuần 1 (ngay sau go-live)

- Kiểm tra Search Console mỗi ngày: `Pages`, `Sitemaps`, `Performance`.
- Nếu có lỗi index: ưu tiên xử lý trong 24h.

### Tuần 2-4

- Theo dõi query có impression cao nhưng CTR thấp.
- Tối ưu title/meta description theo query thực tế.
- Bổ sung FAQ theo câu hỏi người dùng thật.

### Hàng tháng

- Rà soát broken links.
- Cập nhật screenshot nếu UI webapp chính thay đổi lớn.
- Kiểm tra lại Lighthouse production (mobile + desktop).

## KPI vận hành

- Impression (Google Search)
- Click organic
- CTR
- Average position
- CTA click sang webapp (qua UTM)

## Tiêu chí đóng LP-12

- Có checklist manual với trạng thái rõ ràng.
- Có lịch vận hành định kỳ.
- Có KPI theo dõi.
- Có tài liệu tham chiếu cho đội vận hành.
