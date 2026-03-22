# 07. Deprecation Cleanup List

## 1) Routes deprecated
- `/inner`
- `/inner/random-acts`
- `/inner/journal`
- `/inner/journal/history`
- `/inner/meditation`
- `/stats`
- `/goals`
- `/settings`

## 2) Files đã xóa
- `frontend/src/pages/inner-page.tsx`
- `frontend/src/pages/inner-random-acts-page.tsx`
- `frontend/src/pages/inner-journal-page.tsx`
- `frontend/src/pages/inner-journal-history-page.tsx`
- `frontend/src/pages/inner-meditation-page.tsx`
- `frontend/src/pages/stats-page.tsx`
- `frontend/src/pages/goals-page.tsx`
- `frontend/src/pages/settings-page.tsx`
- `frontend/src/pages/privacy-policy-page.tsx`
- `frontend/src/pages/terms-of-use-page.tsx`

## 3) Files thay thế/chuyển trách nhiệm
- `handbook-page.tsx` thay cho luồng inner + journal history/editor.
- `progress-page.tsx` thay cho stats + goals tách rời.
- `more-page.tsx` thay cho settings page.

## 4) Cleanup còn lại (khuyến nghị)
- [ ] Rà soát i18n keys cũ:
  - `pages.inner*`, `pages.stats`, `pages.goals`, `pages.randomActs`, `pages.innerMeditation`
  - `layout.menu.inner/stats/goals/settings/suggestedDeeds`
  - `breadcrumbs.inner/stats/goals/settings/randomActs`
- [ ] Rà soát `INFO_COPY` key không còn dùng (`cultivation`, `breathing`, ...).
- [ ] Rà soát dead components không còn được import bởi route chính.
