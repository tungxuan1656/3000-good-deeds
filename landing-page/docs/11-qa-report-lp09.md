# 11 - QA Report (LP-09)

Ngày thực hiện: 2026-04-25

## Phạm vi

- Landing page Next.js tại `landing-page`
- Kiểm thử quality gate theo LP-09:
  - Lint
  - Format check
  - Build
  - Responsive/A11y smoke
  - Lighthouse score

## Kết quả lệnh kiểm thử

| Hạng mục | Lệnh | Kết quả |
|---|---|---|
| Lint | `pnpm --filter landing-page lint` | Pass |
| Format | `pnpm --filter landing-page format:check` | Pass |
| Build | `pnpm --filter landing-page build` | Pass |

## Lighthouse (production-like)

Thiết lập để đo đúng hành vi production:

```bash
VERCEL_ENV=production NEXT_PUBLIC_SITE_URL=http://localhost:3200 pnpm --filter landing-page build
VERCEL_ENV=production NEXT_PUBLIC_SITE_URL=http://localhost:3200 pnpm --filter landing-page exec next start --port 3200
```

Chạy Lighthouse:

```bash
npx -y lighthouse http://localhost:3200 --only-categories=performance,accessibility,seo,best-practices --output=json --output-path=landing-page/.artifacts/lighthouse-mobile-prodlike.json --chrome-flags='--headless=new --no-sandbox'
npx -y lighthouse http://localhost:3200 --preset=desktop --only-categories=performance,accessibility,seo,best-practices --output=json --output-path=landing-page/.artifacts/lighthouse-desktop-prodlike.json --chrome-flags='--headless=new --no-sandbox'
```

### Kết quả tổng hợp

| Profile | Performance | Accessibility | Best Practices | SEO | FCP | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---|---|---|---|
| Mobile | 95 | 100 | 100 | 100 | 1.2s | 2.9s | 0 | 10ms |
| Desktop | 100 | 100 | 100 | 100 | 0.3s | 0.6s | 0 | 0ms |

## Responsive & Accessibility smoke

- Audit `Optimize viewport for mobile`: pass (Lighthouse).
- Audit `Touch targets have sufficient size and spacing`: pass (Lighthouse).
- Audit contrast ratio, heading order, landmarks: pass (Lighthouse/A11y).
- Không phát hiện layout shift đáng kể (`CLS = 0` cả mobile và desktop).

## Ghi chú môi trường

- Nếu chạy Lighthouse trên `next dev` hoặc môi trường non-production, SEO có thể thấp do `robots` cố ý chặn index preview.
- Kết quả chuẩn để đánh giá go-live là profile production-like như trong báo cáo này.

## Kết luận LP-09

- LP-09 đạt yêu cầu với output rõ ràng: report QA + số liệu Lighthouse + quality gate pass.
- Không có blocker trước khi chuyển sang LP-10 (deploy production trên Vercel).
