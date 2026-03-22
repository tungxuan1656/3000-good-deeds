# 06. Test & QA Checklist

## 1) Technical checks
- [ ] `pnpm --filter frontend lint`
- [ ] `pnpm --filter frontend type-check`
- [ ] `pnpm --filter frontend test`

## 2) Functional checklist
### Navigation
- [ ] Route chính hoạt động: `/login`, `/`, `/timeline`, `/handbook`, `/progress`, `/more`.
- [ ] Không còn điều hướng đến route cũ `inner/*`, `stats`, `goals`, `settings`.

### Home
- [ ] Quick record deed lưu đúng `description`, `labels`, `performedAt`.
- [ ] Danh sách deed hôm nay hiển thị đúng.
- [ ] Quote embedded hoạt động refresh.
- [ ] Kindness suggestion embedded (text-only) hoạt động refresh.
- [ ] Reminder prompt điều hướng đúng sang `/more`.

### Timeline
- [ ] Group theo ngày đúng.
- [ ] Edit deed thành công.
- [ ] Delete deed + confirm dialog thành công.
- [ ] Load more hoạt động với cursor.

### Handbook
- [ ] Lưu entry gratitude/repentance thành công.
- [ ] Validation nội dung trống hoạt động.
- [ ] History list hiển thị đúng.
- [ ] Delete journal entry hoạt động.
- [ ] Embedded quote + kindness suggestion hiển thị đúng.

### Progress
- [ ] Stats hiển thị total deeds + streak.
- [ ] Goal setting save thành công (weekly/monthly/yearly).
- [ ] Calendar tháng hiển thị activity count đúng.
- [ ] Goal history hiển thị đúng.

### More
- [ ] Update display name thành công.
- [ ] Toggle reminder + chỉnh giờ reminder thành công.
- [ ] Change password flow hoạt động với account password.
- [ ] Logout thành công.
- [ ] Delete account flow hoạt động đúng policy.

## 3) Responsive matrix
- [ ] 390px (mobile)
- [ ] 768px (tablet)
- [ ] 1024px (desktop nhỏ)
- [ ] 1280px+ (desktop)

## 4) Visual checklist
- [ ] Font đúng: `Noto Serif` (headline), `Be Vietnam Pro` (body/label).
- [ ] Palette đúng token mới.
- [ ] Tonal layering đúng no-line rule.
- [ ] Loading/empty/error xuất hiện đủ ở các block chính.
