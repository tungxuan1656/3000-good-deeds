# 06 - Next.js + Vercel Plan

## Stack đề xuất

- Next.js (App Router, TypeScript)
- Tailwind CSS
- `next/image` cho ảnh
- Vercel deployment

## Cấu trúc dự án gợi ý

```text
landing-page/
  app/
    layout.tsx
    page.tsx
    sitemap.ts
    robots.ts
  components/
  public/
    images/
  styles/
  next.config.ts
  package.json
```

## Thiết lập SEO ngay từ đầu

- Khai báo metadata cấp site trong `layout.tsx`.
- Khai báo metadata riêng cho homepage trong `page.tsx`.
- Tạo `sitemap.ts` và `robots.ts` theo domain production.
- Thêm JSON-LD cho `WebSite`, `Organization`, `FAQPage`.

## CTA mapping

- URL đích: `https://3000-viec-thien.web.app/`
- CTA gắn UTM (khuyến nghị):
  - `?utm_source=landing&utm_medium=cta&utm_campaign=seo_launch`

## Deploy chuẩn Vercel

1. Tạo project trên Vercel, import repository.
2. Root Directory trỏ tới `landing-page`.
3. Framework preset: Next.js.
4. Thiết lập Production Domain (ví dụ: `3000viecthien.vn` hoặc `landing.3000viecthien.vn`).
5. Bật HTTPS và redirect www/non-www nhất quán.
6. Kiểm tra lại `robots.txt`, `sitemap.xml`, metadata sau khi deploy.

## Kiểm thử trước release

- `pnpm lint`
- `pnpm build`
- Lighthouse (Performance, SEO, Accessibility)
- Kiểm tra mobile responsive ở 375px và 768px
