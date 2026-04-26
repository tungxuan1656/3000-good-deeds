# 07 - Hướng Dẫn Kiểm Tra Kết Quả SEO

## A. Kiểm tra kỹ thuật ngay sau deploy

1. Mở source page và xác nhận có `title`, `description`, canonical.
2. Truy cập trực tiếp:
- `/robots.txt`
- `/sitemap.xml`
3. Dùng Lighthouse (Chrome DevTools) kiểm tra:
- SEO >= 90
- Accessibility >= 90
- Performance >= 85

## B. Kiểm tra với Google Search Console

1. Thêm property domain hoặc URL prefix của landing page.
2. Xác minh quyền sở hữu domain.
3. Submit `sitemap.xml`.
4. Dùng `URL Inspection` cho homepage, bấm `Request Indexing`.
5. Theo dõi mục `Pages` để phát hiện lỗi crawl/index.

## C. Theo dõi hiệu quả hiển thị

Sau khi index (thường vài ngày đến vài tuần):

- Vào Search Console > Performance:
  - Impression
  - Click
  - CTR
  - Average Position
- Lọc theo query tiếng Việt mục tiêu để tối ưu copy.

## D. Quy trình tối ưu lặp

1. Mỗi 2 tuần rà soát query có impression cao nhưng CTR thấp.
2. Tối ưu lại `title/meta description` cho nhóm query đó.
3. Bổ sung FAQ hoặc section mới theo intent tìm kiếm thực tế.
4. Re-submit URL trong Search Console khi thay đổi lớn.

## E. Công cụ nên dùng thêm

- PageSpeed Insights
- Rich Results Test (kiểm tra structured data)
- Ahrefs Webmaster Tools hoặc tương đương (tuỳ chọn)
