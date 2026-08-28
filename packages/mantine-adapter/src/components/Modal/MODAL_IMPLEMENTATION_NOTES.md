# Modal Implementation Notes

## Architecture

The `Modal` component strictly wraps Mantine's `<Modal>` primitive. We strip Mantine's abstract native styling props (`size`, `radius`, `shadow`) via the `overStyled` interface and strictly inject CSS variable definitions onto the internal node abstractions (`.content`, `.header`, `.body`, `.title`).

## Limitations & Structural Decisions

### 1. Stripped `size` Prop

Mantine natively exposes an abstract `size` prop (`"sm" | "md" | "lg" | "xl"`) that scales the Modal geometry. The Recursica UI Kit explicitly dictates strict geometric bounding boxes: `max-width: 960px` and `min-width: 304px`. To enforce absolute parity with the design system, the `size` prop has been intentionally omitted from the component's interface. The width of the Modal will scale fluidly strictly between these Figma-driven pixel limits.

### 2. Scroll Dividers behavior

Mantine internally handles scroll state natively, dynamically showing/hiding a divider line when content overflows in `.body`. This logic is tightly coupled to React DOM measurements internally. Our component inherits this dynamic behavior rather than statically rendering a permanent divider, matching Mantine's robust overflow UX. However, we aggressively override the generated `border-bottom` via CSS modules to ensure that when it _does_ appear, it correctly utilizes the `--recursica_ui-kit_components_modal_colors_scroll-divider` variable and `--recursica_ui-kit_components_modal_properties_scroll-divider-thickness` token.

### 3. Title truncation

`.title` truncates with an ellipsis (`overflow: clip; overflow-clip-margin: 0.35em`, `white-space: nowrap`, `text-overflow: ellipsis`) rather than wrapping. It also needs `flex: 1 1 auto; min-width: 0;` since it's a flex child of `.header` alongside the close button — without `min-width: 0`, a flex item won't shrink below its content's intrinsic width, so ellipsis never engages. `.header`'s `display: flex` is likewise explicit rather than relied upon from Mantine's own header class, so the mui-adapter's plain-`<div>` header gets identical layout.

`.title` used plain `overflow: hidden` until 2026-08-28 (Matt Massey) — it clipped descenders
(e.g. "g" in a long title) whenever `text_line-height` is tighter than the font's natural
ascent+descent. `overflow-clip-margin` gives ink a small bleed allowance while still clipping
genuinely overflowing text, same project-wide fix as Chip's `CHIP_IMPLEMENTATION_NOTES.md`.

### 4. Width was pinned to Mantine's `md` size, not content-driven

Despite §1 above, `.content` never actually scaled fluidly: Mantine's own CSS sets `flex: 0 0 var(--modal-size)` (defaulting to 440px) on the Content element, and our module only added `min-width`/`max-width` without touching `flex`. A fixed flex-basis with `flex-shrink: 0` pins the box at exactly 440px regardless of those bounds, so they were unreachable dead code — e.g. "Authentication Required" (the `Default` story's title) didn't fit at 440px and silently wrapped to two lines. Overriding to `flex: 0 1 auto` makes the width shrink-to-fit the content within `min-width`/`max-width`, which is what makes title truncation (§3) only kick in once a title would exceed `max-width` rather than truncating titles that would otherwise fit. `.content[data-full-screen]` restores Mantine's own `flex: 0 0 100%` since the shrink-to-fit override would otherwise stop `fullScreen` from filling the viewport.

### 5. Close button restyled to match Button

`.close` reuses Button's text-variant/icon-only/small tokens (radius, padding, background/icon color, hover overlay, focus ring) instead of Mantine's native CloseButton look. Two overrides need `!important`/an explicit reset to win: Mantine's `CloseIcon` sizes itself via an inline `style` (`--cb-icon-size`, default `70%`), which beats any plain class rule — same category as Tree's `--level-offset` override; and Mantine's own subtle-variant `:hover` background (from `CloseButton.css`) is pinned back to the Button background token so only our `::after` overlay renders hover feedback.
