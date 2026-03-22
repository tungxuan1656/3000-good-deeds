# 02. Design Token Migration

## 1) Nguồn chuẩn
- `frontend/docs/stitch-ui/ethos_sage/DESIGN.md`

## 2) Token màu mới (đang dùng)
- `primary`: `#526347`
- `secondary`: `#c9d1c7`
- `tertiary`: `#755715`
- `neutral/base`: `#faf9f5`

## 3) Font system
- Headline: `Noto Serif`
- Body: `Be Vietnam Pro`
- Label: `Be Vietnam Pro`

Áp dụng tại:
- `frontend/index.html` (Google Fonts)
- `frontend/src/index.css` (`--font-headline`, `--font-body`, `--font-label`)

## 4) Quy tắc tonal layering (No-Line Rule)
- Không dùng border đậm để chia section.
- Ưu tiên phân tầng bằng surface:
  - `surface-container-lowest`
  - `surface-container-low`
  - `surface-container`
  - `surface-container-high`
  - `surface-container-highest`

## 5) Mapping token cũ -> mới
- Bỏ hoàn toàn semantic cũ: `body`, `speech`, `mind`.
- Các component tag/card/button chuyển qua semantic mới (`primary`, `secondary`, `surface-*`).

## 6) File thay đổi chính
- `frontend/src/index.css`
- `frontend/index.html`

## 7) Ghi chú kỹ thuật
- Vẫn duy trì dark-mode token để không phá behavior hiện hữu, nhưng palette chính theo tone sage.
- `ring`, `input`, `border` đều giảm tương phản để đúng tinh thần “The Living Journal”.
