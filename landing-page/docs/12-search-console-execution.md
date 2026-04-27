# 12 - Search Console Execution (LP-11)

Mục tiêu: hoàn tất các thao tác bắt buộc để Google bắt đầu crawl/index landing page sau khi đã deploy production thành công.

## Input cần có

- Production URL (Vercel): `https://3000-viec-thien.vercel.app/`
- Sitemap URL: `https://3000-viec-thien.vercel.app/sitemap.xml`
- Robots URL: `https://3000-viec-thien.vercel.app/robots.txt`

## Checklist thực thi

| Bước | Hành động | Kết quả mong đợi | Trạng thái |
|---|---|---|---|
| 1 | Tạo property `URL prefix` trong Google Search Console bằng `https://3000-viec-thien.vercel.app/` | Property tạo thành công | ☐ |
| 2 | Verify quyền sở hữu bằng một trong các phương án GSC hỗ trợ | Property ở trạng thái verified | ☐ |
| 3 | Vào `Sitemaps` và submit `https://3000-viec-thien.vercel.app/sitemap.xml` | Trạng thái `Success` | ☐ |
| 4 | Dùng `URL Inspection` với `https://3000-viec-thien.vercel.app/` và bấm `Request Indexing` | URL vào hàng chờ index | ☐ |
| 5 | Kiểm tra `Pages` để đảm bảo không có lỗi chặn index | Không có lỗi nghiêm trọng | ☐ |

## Bằng chứng nên lưu (để audit)

- Screenshot property đã verify.
- Screenshot sitemap trạng thái `Success`.
- Screenshot `URL Inspection` sau khi request indexing.
- Screenshot mục `Pages` không có lỗi blocker.

## Tiêu chí Done LP-11

- Property verified.
- Sitemap submitted thành công.
- Homepage đã `Request Indexing`.
- Không có lỗi nghiêm trọng trong `Pages`.

## Theo dõi 7-14 ngày sau submit

- Theo dõi impression/click/CTR tại `Performance`.
- Nếu chưa index, request lại URL sau khi xác nhận không lỗi crawl.
- Nếu có lỗi coverage, xử lý theo ưu tiên: robots/noindex/canonical/sitemap.
