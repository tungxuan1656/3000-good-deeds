# Code Review Guide

> This document is the **single source of truth** for review rules.
>
> - **Part I**: Process (how to review consistently)
> - **Part II**: Checklist (what to check)
> - **Part III**: Output format (how to record evidence and decision)

---

## Review Levels & Merge Principles

> Goal: consistent review quality across reviewers, lower subjective decisions, and block user-facing regressions before merge.

### Review Standard

- All PRs follow the same strict standard.
- Required: complete Steps 1→5 and all applicable checklist sections.

### Severity Model (issue classification)

- **Critical**: data loss, incorrect user behavior, mandatory pattern violation, security/permission issues, crash, clear regression.
  - Includes non-English code comments (must be fixed before merge).
- **Major**: significant UX, maintainability, performance, or test coverage impact.
- **Minor**: style/readability/small optimization.

### Merge Rules by Severity

- Has **Critical** → **do not merge**.
- Only **Major/Minor** remaining → merge only with a clear resolution plan (issue link or specific TODO).
- Review comments follow: **Issue / Why / Suggested fix / Severity**.

---

## Objective Evidence Protocol (Anti-"Review by Feeling")

For each applicable checklist item, reviewer must record:

- **Status**: `PASS` | `FAIL` | `N/A`
- **Evidence**: file path + line or exact command output used to verify
- **Decision**: severity if failed (`Critical/Major/Minor`)

Rules:

- No evidence = item is not considered reviewed.
- `N/A` must include one short reason.
- If the same issue appears in multiple files, cite at least one representative location and count occurrences.

---

## Part I: Review Process

> **All 5 steps must be completed in order.** Each step is a gate.

### Step 1: Read the Overall Diff — Get the Big Picture

```bash
git diff main...HEAD -- '*.ts' '*.tsx' '*.md'
```

1. List changed files and summarize each change.
2. Mark behavioral changes (interval/threshold/data shape/API contract/computation logic).

**Required sub-step — New source-of-truth in PR**

For each new/changed source-of-truth artifact:

| Source type          | Example                                                      |
| -------------------- | ------------------------------------------------------------ |
| Docs / pattern guide | `docs/dialog_and_form_pattern.md`, `docs/api_conventions.md` |
| New type / interface | `ShiftDetailDTO`, `VehicleAssignModalRef`                    |
| Hook return shape    | `useDriverSearch`: `DriverDTO[]` → `DriverListResponse`      |
| Config / constant    | `PAGE_SIZE`, `API_ENDPOINTS` changes                         |

- Action 1: extract explicit rules/patterns from that artifact.
- Action 2: scan all impacted files in the PR for compliance.

### Step 2: Read Each File in Full — Not Only Diff Hunks

For every file in the PR, read the full file to validate surrounding context and stale comments.

**Required scans for each `.tsx` file**

- **Scan A — Interactive elements**: every clickable element has real handler and label-behavior match.
- **Scan B — Derived values outside `useMemo`**: expensive derived values used in JSX/props must be memoized.
- **Scan C — `MOCK_` import leakage**: components/hooks must not import `.mock.ts` directly.
- **Scan D — `new Date()` real-time usage**: real-time UI requires timer updates, not frozen mount values.
- **Scan E — Repeated JSX**: 3+ similar blocks should become data + `.map()`.
- **Scan F — Form completeness**: every user input state must be represented in submit payload, or have TODO with backend dependency.

### Step 3: Feature Walkthrough — User Perspective

For each changed flow:

1. Describe user journey step-by-step.
2. Validate each action outcome.
3. Confirm every input is persisted.
4. Validate label/action consistency.
5. Confirm post-submit UI updates.
6. Verify error rendering and recovery path.
7. Verify failure scenarios (timeout/4xx/5xx/empty/permission/network).

### Step 4: Check Test Coverage

- List new/changed hooks, selectors, pure functions, store actions.
- Verify each has tests in the same PR.
- Verify each new code path has at least one test.
- Bug fix PRs must include regression test.

### Step 5: Apply Checklist Sections (Part II)

Apply all relevant sections A–L below and record results using Part III template.

---

## Part II: Checklist

### A. UI & Visual

> Ref: [`color_guide.md`](color_guide.md)

- [ ] Semantic CSS variables (no hardcoded hex/rgb).
- [ ] Correct status tokens and background layers.
- [ ] Design-system font sizes only.
- [ ] Lucide icon consistency.
- [ ] Charts/visual labels and colors are data-accurate and semantically consistent.
- [ ] Dynamic SVG IDs are unique/stable.

### B. UX & User Interaction

> Ref: [`dialog_and_form_pattern.md`](dialog_and_form_pattern.md), [`form-pattern.md`](form-pattern.md)

- [ ] Every interactive element has meaningful behavior and matching label.
- [ ] Dialog/Drawer/Sheet follows required ref pattern.
- [ ] Cancel behavior uses proper `DialogClose` pattern.
- [ ] No premature `return null` that breaks close animation.
- [ ] Every user-input field is represented in submit payload (or TODO with backend dependency).
- [ ] Optimistic update has persistence plan.
- [ ] Form reset uses explicit defaults.
- [ ] Validation covers business edge cases.
- [ ] Pagination `hasMore` uses `totalCount`.
- [ ] Success/failure feedback is complete and actionable.
- [ ] Same dataset rendered in multiple views uses same filtered source.

### C. API & Data Integrity

> Ref: [`api_react_query_pattern.md`](api_react_query_pattern.md), [`type_naming_pattern.md`](type_naming_pattern.md)

- [ ] Endpoint declaration and hook/query-key conventions are followed.
- [ ] Keyword queries have `enabled` guard.
- [ ] No identity `select`.
- [ ] No direct `.mock.ts` usage in UI/hooks.
- [ ] DTO/Request/Response naming and contract mapping are consistent.
- [ ] List queries have explicit `limit`.

### D. Code Logic & Edge Cases

- [ ] Branches/fallbacks are complete and non-duplicated.
- [ ] No dead branches, always-true/false checks, or unreachable defaults.
- [ ] No repeated expensive lookups on same dataset.
- [ ] State lifecycle/retry/concurrency paths are coherent and cleaned up.

### E. Re-render & Performance

> Ref: [`zustand_store_pattern.md`](zustand_store_pattern.md)

- [ ] Expensive derivations are memoized.
- [ ] `Date` objects in deps are memoized correctly.
- [ ] Timer state is isolated to smallest subtree.
- [ ] O(n×m) loops replaced with precomputed maps/sets.
- [ ] Polling/frequency changes include impact check.

### F. Architecture & Directory Structure

> Ref: [`project_folder_structure.md`](project_folder_structure.md), [`component_structure_pattern.md`](component_structure_pattern.md)

- [ ] File/component structure follows documented conventions.
- [ ] Public exports are controlled via `index.ts`.
- [ ] Store conventions (`initialState`, `actions`, `reset`, selectors) are respected.
- [ ] Repeated JSX/enum mapping logic is consolidated.

### G. Testing

- [ ] Every new/changed pure logic unit has tests in the same PR.
- [ ] New paths and edge cases are covered.
- [ ] Concurrency/retry flows have race-condition coverage.
- [ ] Bug fixes include regression tests.

### H. Internationalization (i18n)

> Ref: [`i18n_label_pattern.md`](i18n_label_pattern.md)

- [ ] No hardcoded UI text.
- [ ] Validation errors use i18n keys.
- [ ] Module-scope `t()` usage is justified by comment.
- [ ] New keys are synced across all locales.
- [ ] Interpolation used for quantities/units/time.
- [ ] Key typing safety is preserved.

### I. Naming & Code Hygiene

> Ref: [`naming_and_conventions_pattern.md`](naming_and_conventions_pattern.md)

- [ ] No unused declarations/imports/exports.
- [ ] Placeholder/future code has clear planned/TODO comments.
- [ ] Comments are in English and up to date.
- [ ] Import grouping/order is clean.
- [ ] No identity wrappers or no-op remnants.

### J. Documentation Compliance

> Ref: [`copilot-instructions.md`](../.github/copilot-instructions.md) and all relevant docs in `docs/`

- [ ] Changed code complies with every applicable pattern document.
- [ ] UI controls that appear in the feature have real effect.
- [ ] Repeated enum/state mapping is centralized.

### K. Accessibility (A11y)

- [ ] Keyboard behavior and focus management are valid.
- [ ] Non-text controls have accessible labels.
- [ ] Disabled/loading/error states include semantic signals.
- [ ] Contrast is acceptable for all states.

### L. Security, Privacy & Observability

- [ ] No sensitive data leakage in logs/toasts/analytics.
- [ ] Sensitive actions have permission guards.
- [ ] User input is validated/sanitized.
- [ ] User-facing errors hide internal details.
- [ ] Notification host survives app-level error fallback.
- [ ] Critical flows have minimum tracing events.

---

## Part III: Minimum Review Output (Definition of Done)

Every review must end with:

1. **Issue list by severity**: Critical / Major / Minor.
2. **Accepted risks** (if any) with explicit rationale.
3. **Scope confirmation**: reviewed flows + checklist sections.
4. **Evidence table** for sampled high-risk checks.

### Review Summary Template

```md
## Review Summary

### Scope
- PR mode: Full (mandatory)
- Flows reviewed: <list>
- Checklist sections reviewed: <A-L list>

### Findings
- Critical: <count>
- Major: <count>
- Minor: <count>

### Evidence (sample)
| Item                         | Status | Evidence                              | Severity if fail |
| ---------------------------- | ------ | ------------------------------------- | ---------------- |
| B-Form payload completeness  | PASS   | src/.../create-modal.tsx:120-170      | Critical         |
| H-No hardcoded UI text       | FAIL   | rg "<hardcoded text>" src/feature/... | Major            |
| G-Regression test for bugfix | PASS   | src/.../foo.test.ts:42-88             | Critical         |

### Merge Decision
- Decision: Merge | Block
- Remaining risks: <none / details>
```

