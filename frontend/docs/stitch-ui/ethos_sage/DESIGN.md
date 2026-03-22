# Design System Documentation

## 1. Overview & Creative North Star: "The Living Journal"
This design system is built to facilitate a quiet, reflective experience. Unlike modern platforms that rely on high-velocity interactions and gamified dopamine loops, this system is anchored in **The Living Journal** philosophy. It treats the digital interface as a piece of premium, tactile stationery—breathable, intentional, and humane.
The visual language moves away from rigid, "app-like" grids. Instead, it embraces **Editorial Asymmetry**. By utilizing varied white space and staggered content blocks, we signal to the user that this is a space for contemplation, not a task to be rushed. Every pixel is designed to reduce cognitive load and evoke a sense of private serenity.
---
## 2. Colors & The "No-Line" Rule
The palette is rooted in sage greens (`primary`) and warm oats (`surface`), designed to reduce ocular strain and promote a meditative state.
### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning content. Visual boundaries must be defined exclusively through:
* **Background Shifts:** A `surface-container-low` section sitting on a `surface` background.
* **Tonal Transitions:** Using `surface-container-highest` for high-priority interactive zones against a `surface-container` backdrop.
### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, fine papers.
* **Base:** `surface` (#faf9f5) for the main canvas.
* **Secondary Zones:** Use `surface-container-low` (#f4f4ef) for secondary sidebars or background groupings.
* **Floating Elements:** Use `surface-container-lowest` (#ffffff) for the highest visual "lift" in cards or modals.
### The "Glass & Gradient" Rule
To add soul, use a **Frosted Sage Gradient** for primary actions: a linear transition from `primary` (#526347) to `primary_dim` (#46573c) at a 135-degree angle. For floating overlays, apply a `backdrop-blur` of 12px to a semi-transparent `surface_container` (80% opacity) to create a "glass" effect that feels integrated into the environment.
---

## 3. Typography: The Editorial Voice
The typography is a dialogue between the timelessness of a serif and the clarity of a modern sans.

- **Display & Headlines:** `Noto Serif`. This is our "Authoritative" voice. Use high-contrast scale transitions (e.g., `display-lg` vs `headline-sm`) to create a rhythmic, magazine-like layout.
- **Body & Labels:** `Be Vietnam Pro`. This is our "Functional" voice. It provides exceptional legibility at small sizes and maintains a friendly, open character that feels humane and approachable.

**Intentionality Note:** Use `headline-lg` for daily prompts or reflections. The serif’s "hooked" terminals draw the eye in, encouraging the user to slow down and read every word.
---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are often too aggressive for a "Serenity" system. We achieve hierarchy through **Tonal Layering**.

* **Ambient Shadows:** If an element must float (e.g., a mobile FAB), use a shadow tinted with `on-surface`: `0px 10px 30px rgba(47, 52, 46, 0.06)`. This mimics natural light filtered through a window.
- **The "Ghost Border" Fallback:** If a border is required for accessibility in input fields, use the `outline-variant` token at **15% opacity**. It should be a suggestion of a container, not a cage.
---

## 5. Components
### Navigation: Desktop Sidebar & Mobile Tabs
* **Desktop:** An asymmetrical sidebar using `surface-container-low`. Navigation items should have 12px of vertical padding, using `primary` for the active state indicator—a subtle 4px vertical pill, not a full background highlight.
* **Mobile:** A bottom-tab bar using a glassmorphic `surface_container` with 15px backdrop-blur. No top border; use a subtle `surface-dim` shadow at the top edge.
### Primitive Components
* **Buttons:**
* *Primary:* Soft-cornered (`lg`: 0.5rem) filled with `primary`. Text in `on_primary`.
* *Secondary:* `secondary_container` background with `on_secondary_container` text.
* **Input Fields:** Ghost-style inputs. No bottom line. Use `surface-container-high` as the background fill with `md` roundedness. Focus state is a subtle shift to `surface-container-highest`.
* **Chips (Deed Tags):** Use `secondary_fixed_dim` with `on_secondary_fixed`. Roundedness `full`. These should feel like small, smooth river stones.
* **Cards & Lists:** **Strictly forbid divider lines.** Separate "Good Deeds" in a list using `1.4rem` (Spacing 4) of vertical white space or by alternating background tones between `surface` and `surface-container-low`.
---

## 6. Do's and Don'ts

### Do
- **Embrace Asymmetry:** Stagger your card layouts. Let some elements breathe more than others to create a "curated" feel.
- **Use "Human" Language:** UI microcopy should be reflective (e.g., "What good did you witness today?" instead of "Input Entry").
- **Prioritize Negative Space:** If a screen feels crowded, remove elements rather than shrinking them.

### Don't
- **No Gamification:** Avoid progress bars that look like "loading" states. Use soft color fills or growing organic shapes instead. No "level up" stars or aggressive badges.
- **No High-Contrast Borders:** 1px black or dark grey borders will break the serenity of the system.
- **No Rapid Animations:** Transitions should be slightly slower (300ms–500ms) with a "Soft Out" easing to mimic a physical page turn or a deep breath.
---