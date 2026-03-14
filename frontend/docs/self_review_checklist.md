# Self-Review Checklist — Execution Worksheet

> This document is for **self-review before push / before opening PR**.
>
> It is intentionally lightweight and execution-focused.
> **All rules live in** [`code_review_guide.md`](code_review_guide.md) (single source of truth).

---

## Why This Exists

`code_review_guide.md` defines the full standards.
This file defines **how to execute self-review consistently** with evidence, so review quality is repeatable and not based on feeling.

---

## Exit Criteria (Must Pass)

A PR is ready for review only when all are true:

- [ ] `pnpm run lint` passes.
- [ ] Every applicable gate below is marked `PASS` or explicitly `N/A` with reason.
- [ ] `FAIL` items are fixed or documented with owner + follow-up task.
- [ ] No unresolved `Critical` items.

---

## Phase 0 — Scope & Risk Setup (2 minutes)

- [ ] List changed files: `git diff --name-only main...HEAD`
- [ ] Mark high-risk change types:
  - [ ] UI flow or form behavior
  - [ ] API/hook/query/store changes
  - [ ] Auth/permission/security
  - [ ] Polling/performance/large list rendering
  - [ ] i18n or locale changes

---

## Phase 1 — Fast Objective Scans (10 minutes)

Run scans and capture evidence for each applicable result.

```bash
# 1) Interactive elements (manual follow-up required)
rg -n "<Button|onClick=" src

# 2) Potential heavy derivations in render
rg -n "\.filter\(|\.map\(|\.find\(|new Map\(|new Set\(" src --glob "*.tsx"

# 3) Mock leakage to UI/hooks
rg -n "MOCK_|\.mock" src --glob "*.tsx" --glob "*.ts"

# 4) Hardcoded UI text candidates
rg -n "<[A-Za-z].*>[^<{]*[A-Za-z][^<{]*<" src --glob "*.tsx"

# 5) Identity select in React Query
rg -n "select:\s*\((res|data)\)\s*=>\s*\1" src

# 6) Query safety checks
rg -n "useQuery|useInfiniteQuery|enabled:|limit:" src --glob "*.ts" --glob "*.tsx"

# 7) Non-English comments (manual confirmation)
rg -n "//|/\*|\*" src --glob "*.ts" --glob "*.tsx"
```

Notes:

- Scan output is a candidate list, not final verdict.
- Manual confirmation is still required before marking `FAIL`.

---

## Phase 2 — Manual Gates by Risk

Use the canonical sections from [`code_review_guide.md`](code_review_guide.md).

### Gate A — Data Flow Integrity (Critical)

Reference: Section **B** + **C**.

- [ ] Every user input field is included in submit payload (or TODO with backend dependency).
- [ ] Button label matches actual handler behavior.
- [ ] Optimistic updates have persistence plan.
- [ ] Pagination and list queries use safe contract (`totalCount`, `limit`, `enabled`).

### Gate B — UX Flow Completeness (Critical/Major)

Reference: Section **B**.

- [ ] Happy path verified end-to-end.
- [ ] Failure path verified (timeout/4xx/5xx/empty/permission/network).
- [ ] Error state gives user recovery path (retry/back/close/support).

### Gate C — Performance & Re-render (Major)

Reference: Section **E**.

- [ ] Expensive derived values are memoized when needed.
- [ ] No obvious O(n×m) patterns in list rendering.
- [ ] Timer-driven state isolated to smallest component.

### Gate D — i18n & Text Safety (Major)

Reference: Section **H**.

- [ ] No hardcoded UI text.
- [ ] New keys synced across all locales.
- [ ] `t()` lifecycle usage is safe.

### Gate E — Tests & Regression Safety (Critical/Major)

Reference: Section **G**.

- [ ] New/changed logic has tests.
- [ ] New code paths are covered.
- [ ] Bugfix includes regression test.

### Gate F — Hygiene & Security (Major)

Reference: Section **I**, **K**, **L**.

- [ ] No unused/dead code left behind.
- [ ] Comments are English and up to date.
- [ ] No sensitive data leakage or missing permission checks.

---

## Phase 3 — Evidence Log (Required)

Fill this table before push.

| Gate   | Status (`PASS/FAIL/N/A`) | Evidence (file:line or command) | Severity if fail | Notes/owner |
| ------ | ------------------------ | ------------------------------- | ---------------- | ----------- |
| Gate A |                          |                                 | Critical         |             |
| Gate B |                          |                                 | Critical/Major   |             |
| Gate C |                          |                                 | Major            |             |
| Gate D |                          |                                 | Major            |             |
| Gate E |                          |                                 | Critical/Major   |             |
| Gate F |                          |                                 | Major            |             |

Rules:

- `N/A` must include reason.
- If `FAIL`, create a follow-up ticket/PR note before merge.
- Any unresolved `Critical` means do not request merge.

---

## Phase 4 — PR Description Snippet

Paste this into PR description:

```md
## Self-Review Result

- PR mode: Full (mandatory)
- High-risk areas checked: <list>
- Gates: A=<PASS/FAIL/N/A>, B=<...>, C=<...>, D=<...>, E=<...>, F=<...>
- Critical issues: <count>
- Major issues: <count>
- Remaining risks + mitigation: <details or none>
```

---

## Runbook (Mandatory)

1. `git diff --name-only main...HEAD`
2. Run Phase 1 scans.
3. Complete all gates A→F.
4. Run `pnpm run lint`.
5. Fill evidence table and PR snippet.

If any gate fails with unresolved `Critical`, stop and fix before push.

