# Frontend AI Redesign Brief

## 1) Document Purpose

This document is a complete input package for AI (or design teams) to redesign the **3000 Good Deeds** frontend.

Scope:

- Redesign for **two versions**: Web (desktop/tablet) and Mobile responsive.
- Preserve product essence: private, reflective, calm, non-gamified.
- Visual direction: **modern, warm, minimal, flat design** (avoid heavy shadows).

---

## 2) Product Spirit the UI Must Reflect

Sources: `docs/product/*`, `frontend/docs/product/*`, `frontend/docs/design/*`.

### Product identity

- A personal kindness journal with inward focus.
- A daily tool to record and reflect on kind actions.
- Not a social network, not a leaderboard, not a moral scoring app.

### Required design tone

- Calm, warm, humane.
- Privacy-first cues must be visible.
- No pressure-driven interaction patterns.
- Encourage small, consistent progress.

### Anti-patterns to avoid

- Gamified visuals (badges, flashy streaks, confetti).
- Aggressive colors and distracting motion.
- Layered heavy shadows that feel noisy.
- Judgmental or guilt-triggering copy.

---

## 3) Current Frontend Context (for AI grounding)

### Tech and structure

- Next.js App Router + React 19 + Tailwind v4 + shadcn UI + Lucide.
- Current mobile breakpoint: `< 768px`.
- Existing layout:
  - Desktop: sidebar + content.
  - Mobile: bottom tab navigation.

### Existing primary screens

- Login
- Home
- Timeline
- Goals
- Stats
- Inner
- Inner Random Acts
- Inner Journal / Journal History
- Inner Meditation
- More
- Settings

### Required state coverage for every screen

- Loading
- Empty
- Success/content
- Error
- Permission-required (when relevant, e.g., push notifications)

### What should remain stable

- Fast, low-friction deed logging flow.
- All user-facing text through i18n.
- Consistent semantic token usage.

---

## 4) New Visual System Direction (Modern + Warm + Minimal + Flat)

## Aesthetic direction

- **Warm Minimal Serenity**
- Keywords: paper-like, breathable spacing, gentle contrast, restrained ornament.

## Proposed color system

- Main background: `#F7F3EC`
- Surface/card: `#FFFDF9`
- Primary text: `#2C2A28`
- Secondary text: `#6F6A63`
- Primary (sage): `#6F8F79`
- Secondary (soft green): `#C8D8CC`
- Warm accent (amber): `#D8B167`
- Destructive: `#D66A64`
- Border: `#E8E1D8`

Flat design rules:

- Use borders + tonal contrast for hierarchy.
- Use only very light shadow for selective emphasis (single level only).

## Proposed typography

- Display/headings: `Source Serif 4` (reflective, warm tone).
- Body/UI: `Be Vietnam Pro` (clear modern UI reading, strong Vietnamese support).
- Hierarchy:
  - H1: 32/38 desktop, 26/32 mobile
  - H2: 24/30 desktop, 20/26 mobile
  - Body: 16/24
  - Caption: 13/18

## Spacing, shape, border

- 8pt spacing system.
- Card radius: 20–24px.
- Button radius: pill or 14px depending on context.
- Border mostly 1px; active/emphasis up to 2px.

## Motion

- Purposeful, calm motion only:
  - 150–220ms for hover/press.
  - 220–320ms for panel/sheet transitions.
- No looping decorative animation in journaling flows.

---

## 5) Information Architecture (IA) for Redesign

### Global navigation

- Primary:
  - Home
  - Timeline
  - Inner
  - Stats
  - More
- Secondary (under More):
  - Goals
  - Settings
  - Random Acts

### Screen-group goals

- Login: safe, warm, easy start.
- Home: daily action hub (check-in + today entries).
- Timeline: reflective review by day.
- Inner: deep reflection tools (journal, suggestions, meditation).
- Stats: self-reflection metrics without comparison.
- Settings: account control and privacy control.

---

## 6) Version 1: Web (Desktop/Tablet)

### Layout blueprint

- 12-column grid, content max width 1200–1280.
- Persistent left sidebar on desktop.
- Main area split into:
  - Main content (8 cols)
  - Reflection rail (4 cols) for quote/weekly rhythm/mini check-in.

### Header

- Lightweight breadcrumb.
- Reflective page title + concise description.
- Info action on the right.

### Screen structure pattern

- Header section
- Primary action card
- Supporting cards (insights, helper content, history)

### Card behavior (desktop)

- No heavy shadows.
- Prefer gentle borders and subtle surface contrast.
- Hover should be subtle (border/tint), no strong lift effect.

### Web-specific optimization

- Timeline grouped clearly by date.
- Stats with readable monthly overview and calendar.
- Goals/Settings segmented into clear functional blocks.

---

## 7) Version 2: Mobile Responsive

### Layout blueprint

- Mobile-first single-column layout.
- Bottom tab as primary navigation.
- Compact header to prioritize core content.

### Interaction pattern

- Primary actions in thumb-friendly zones.
- Use sheets/drawers for secondary actions.
- Primary CTA as full-width or near full-width.

### Mobile spacing

- Horizontal padding: 16px.
- Vertical rhythm: 12/16/20px by hierarchy.
- Keep card radius around 20px for consistency.

### Mobile-specific optimization

- Home: make check-in prominent above the first fold.
- Timeline: short, scan-friendly cards.
- Inner Journal: prioritize writing area over decorative elements.
- Stats: prioritize today/this week summaries first.

---

## 8) Component Map for AI Design Output

AI should design around this component system:

- App shell
  - Desktop sidebar
  - Mobile bottom tab
  - Header/breadcrumb block
- Content primitives
  - PageHeaderCard
  - ContentCard (default/soft/muted)
  - InlineCardRow
  - EmptyState
  - Skeleton
- Action components
  - PrimaryButton / SecondaryButton / GhostButton / DestructiveButton
  - TagButton (emotion/context labels)
  - Segmented control (journal mode)
- Feature modules
  - CheckIn composer
  - GoodDeed item row
  - Weekly rhythm mini chart
  - Calendar heat-lite view
  - Goal setting rows
  - Journal editor/history cards
- Overlay
  - Sheet
  - Confirm dialog
  - Info dialog

Component principles:

- Reuse first, screen-specific second.
- Explicit states: default, hover, active, disabled, loading, error.

---

## 9) State Matrix Required in Design Handoff

For every screen, include:

- Loading state
- Empty state
- Content state
- Error state
- Permission state (if applicable)

Mandatory examples:

- Home empty: gentle message + “suggest a small start” CTA.
- Timeline empty: neutral/supportive tone (no failure framing).
- Reminder permission denied: clear guidance, no coercion.

---

## 10) Content & Microcopy Rules for AI

- Tone: short, calm, supportive.
- Avoid terms such as: rank, score, fail, punishment.
- Preferred CTA style: “Save”, “Record”, “Maybe later”.
- Sensitive actions must be explicit: “Delete this entry”, “Delete account”.

---

## 11) Accessibility & UX Quality Gates

- WCAG AA contrast.
- Clear keyboard focus states.
- Minimum touch target 44x44 on mobile.
- Do not rely on color alone for meaning.
- Avoid distracting animation in reflective writing flows.

---

## 12) What AI Needs to Design a Full Website

## Minimum required package

1. Product brief (vision, users, anti-goals).
2. IA + sitemap + navigation logic.
3. Screen inventory + required states.
4. Design principles (tone, do/don’t, accessibility).
5. Design system foundation (color, typography, spacing, radius, icons).
6. Component inventory + state behavior.
7. Responsive rules (breakpoints, adaptation rules).
8. Microcopy guideline (voice, CTA, sensitive actions).
9. Technical constraints (stack, i18n, token system, existing routes).
10. Acceptance criteria (UX + visual + implementation).

## Recommended additions

- Lightweight personas + key jobs-to-be-done.
- Journey maps for core flows (login, check-in, timeline review, journal).
- Example data + edge-case content.
- Prompt kit per screen.

---

## 13) Prompt Kit for AI Design

## Master prompt

"Redesign a private kindness journal product UI with a calm, warm, minimal, flat design direction. Avoid gamification. Deliver a complete design system and all key screens for desktop and mobile responsive, including loading/empty/error/content states."

## Web prompt

"Design a desktop layout with a left sidebar, main content area, and a reflection side rail. Prioritize whitespace, soft borders, and minimal shadows. Optimize for quick deed logging and readable reflection history."

## Mobile prompt

"Design a single-column mobile layout with fixed bottom tabs, one-hand-friendly interactions, and clear primary CTA placement in thumb-friendly zones. Keep the experience private, calm, and non-pressuring."

## Visual-style prompt

"Use a warm neutral palette with sage primary and soft amber accent. Use reflective heading typography and highly readable body typography. Avoid heavy shadows and flashy visual effects."

---

## 14) Redesign Acceptance Criteria

A redesign is considered successful when:

- The interface feels warm, calm, and modern within first impression.
- A new user can complete first check-in in <= 30 seconds.
- No competitive/leaderboard visual language appears.
- Web and mobile share one coherent design language.
- All core flows include complete state coverage and proper copy tone.
- Output can be implemented directly in React + Tailwind + shadcn without architecture rewrite.

---

## 15) Final Handoff Checklist for AI/Design Team

- [ ] Desktop wireframes for all core screens
- [ ] Mobile wireframes for corresponding screens
- [ ] Token file (color/type/spacing/radius)
- [ ] Component specs + state specs
- [ ] Interaction notes (motion/feedback)
- [ ] Empty/loading/error/permission mockups
- [ ] Applied copy guideline per screen
- [ ] Dev handoff note (mapping current components to redesigned components)
