# Button Component Implementation Notes

**Implementation Philosophy:**
The Button component serves as a foundational building block in Recursica. This implementation wraps the `@mui/material/Button` component but **disables its native visual heuristics entirely.**

We explicitly pass `disableRipple` and `disableElevation` to block MUI's dynamic behaviors. Furthermore, we intentionally **do not** map our `variant` or `size` properties to MUI's native `variant` or `size` props because doing so would trigger MUI's internal CSS engines to inject styles that clash with our strict design tokens.

**Styling Strategy:**

- We utilize `filterStylingProps` to prevent rogue injections of `sx`, `style`, or `className` properties that would violate the design system.
- All styling is controlled directly via CSS Modules, mapping DOM attributes like `data-variant` and `data-size` to pure CSS selectors.
- Hover states are managed with a standard `::after` pseudo-element overlay hack rather than relying on native hover psuedo-selectors modifying background-color directly. This allows a clean `opacity` overlay based on the provided design tokens, which guarantees identical visual feedback behavior across all underlying themes without overriding background hues manually.
- The polymorphic `component` prop natively supported by MUI is safely forwarded to allow correct semantics (e.g. rendering as an `<a>` tag or using a router `Link`).

**Accessibility:**

- We inject a development-time warning explicitly requiring `aria-label` when the component detects an icon-only configuration.

---

## Loader color contrast — fixed (source-of-truth audit, 2026-08-30)

**Superseded:** the entry below originally documented an explicit decision _not_ to fix this.
Re-verified during the mantine-vs-mui source-of-truth audit: mantine's own loader ring was
measured (via computed styles) rendering `#c21b43` (the Loader's standalone `indicator-color`
token) against a label text color of `rgb(249, 249, 249)` — a real, confirmed contrast mismatch,
not a false report. Fixed in both adapters; see mantine-adapter's own `IMPLEMENTATION_NOTES.md`
for the equivalent fix there.

**Original problem:** `Loader.module.css`'s `.root` unconditionally sets
`--loader-color: var(--recursica_..._loader_properties_indicator-color)` on its own root
element, regardless of context — so nesting a `<Loader>` inside a Button's loading state always
used the Loader's own standalone token, never the button's actual per-variant text color.

**Fix:** `Button.module.css` now exposes `--button-color` per variant (solid/outline/text),
set to that variant's own `colors_text-color` token. The Button-owned `<Loader>` instance passed
to MUI's `loadingIndicator` prop is now given `overStyled` + `style={{ "--loader-color":
"var(--button-color)" }}` — an inline style on the Loader's own root, which (being inline) beats
the stylesheet default and inherits whatever `--button-color` resolves to at that point in the
DOM. `overStyled` is required to let `style` through `filterStylingProps`; this is a fully
internal composition (no prop threading to callers), so it doesn't widen Loader's public API.

**Also fixed alongside this:** the loading state previously rendered the label text at full
opacity _and_ injected a second, redundant Loader into `startIcon` (on top of MUI's own native
`loadingIndicator`/`loadingWrapper` slot) — so loading buttons showed both the label and two
overlapping loaders instead of just one centered loader. Removed the `startIcon` loader override
(startIcon now only ever shows the real `icon` prop, exactly as in the non-loading case) and
added `.root[data-loading="true"] .labelText, .root[data-loading="true"] .iconWrapper { opacity:
0; }` so the label/icon stay in the DOM/layout (matching mantine's own `opacity: 0` approach,
not `display: none`) while only MUI's native centered `loadingIndicator` is visible. Verified
live against mantine's `ui-kit-button--loading` story — now pixel-equivalent.

---

## Loader color contrast (original entry, see "fixed" above)

**Decision:** When a Button is in a loading state, the `Recursica Loader` component is injected via the `loadingIndicator` prop. The `Loader` component strictly defines its own colors and styles per variant, meaning it does not automatically inherit the text color (`currentColor`) from the Button.

**Constraint:** This can lead to contrast issues (e.g., a blue dots loader inside a solid blue button). Design has explicitly decided not to address this at the moment. As such, developers using the `loading` prop must be aware that the loader's color is fixed by its internal tokens, not by the button's context.

---

## Loading state enforces disabled state

**Decision:** When `loading={true}` is passed to the Button, the component explicitly forces `disabled={true}` natively on the underlying element.

**Implementation:** This ensures that loading buttons automatically inherit the brand theme disabled opacities (via the `:disabled` CSS pseudo-class) rather than relying solely on MUI's internal loading opacity adjustments.

---

## `className` overwrite bug (Matt Massey, 2026-08-08)

**Bug:** with `overStyled` and a custom `className` (e.g. Tree embedding a `Button` for its expand chevron), the component's own `styles.root` class silently disappeared from the rendered `<button>` — every `[data-variant]`/`[data-size]` CSS rule stopped applying, and MUI's own default styling (including its default blue "primary" color) showed through instead.

**Root cause:** `className={finalClass}` (`` `${styles.root} ${classNameProp}` ``) was set explicitly on `<MuiButton>`, but `{...sanitizedProps}` was spread _after_ it — and `sanitizedProps` still contained the original, unmodified `className` key, since it had only been _read_ to compute `finalClass`, never deleted. The later spread silently overwrote the merged class with just the caller's own class. Same bug class as `Dropdown.tsx`/`BareDropdown.tsx` had.

**Fix:** delete `className` from the sanitized props record right after reading it, before it reaches the JSX spread. mantine-adapter's `Button.tsx` had the identical mistake — masked there by a separate `classNames={{root: ...}}` object prop unaffected by the bug, but fixed there too for correctness.

---

## `.MuiButton-startIcon`/`.MuiButton-endIcon` selectors never matched anything (Matt Massey, 2026-08-10)

**Bug:** icon-only buttons rendered with the icon visibly off-center — shifted left, with extra empty space on the right. Not a regression from any recent change; `Button.module.css` itself was untouched, and the same unwrapped selectors already existed at `HEAD`. It had just gone unnoticed until the Tree work put an icon-only Button (the chevron) under closer visual scrutiny next to Mantine's (correctly centered) version.

**Root cause:** `.MuiButton-startIcon`/`.MuiButton-endIcon` are real global class names MUI's `Button` applies directly in the DOM — not local CSS Modules classes generated from this file. Referencing them as plain `.MuiButton-startIcon` (rather than `:global(.MuiButton-startIcon)`, the pattern already used correctly for `.Mui-disabled` elsewhere in this same file) meant Vite's CSS Modules silently hashed them into scoped names — `.Button-module__MuiButton-startIcon___<hash>` — that never matched anything real in the DOM. Every rule targeting them (the icon↔label gap margin, and the icon-only margin reset) was a total no-op; icon-only buttons were left with MUI's own unreset default `margin-right` on the icon, which is what visibly pushed the icon off-center.

**Fix:** wrapped every `.MuiButton-startIcon`/`.MuiButton-endIcon` reference in `:global(...)`.

**Not otherwise fixed, flagged separately:** the same unwrapped-global-class pattern shows up in at least `Stepper.module.css` (`.Mui-active`/`.Mui-completed`/`.MuiStepLabel-root`, fully unwrapped) and `SegmentedControl.module.css`, and partially in `Label.module.css`/`Accordion.module.css` — meaning some of those components' MUI-state-driven styling may also be silently no-op'ing. Out of scope for this fix (Button only, per what was asked); worth a dedicated sweep.

---

## `line-height` wiring gap vs Mantine (Matt Massey, 2026-08-19)

**Reported symptom:** descenders on letters like "p"/"g" clipped in the Default story.

**Investigation:** live-verified both adapters in Storybook (Playwright) at the `Default` and `OutlineSmall` stories, including a direct canvas `measureText` check of the `gpqjy` glyph set in Lexend at 14px (`--recursica_tokens_font_line-heights_default: 1.05em` → 14.7px line box vs ~14.0px actual glyph ink) — no visible clipping reproduced in Chromium; both adapters rendered pixel-identical crops. The line-height token itself is objectively tight (near-zero headroom), but that's shared by both adapters and isn't itself mui-specific.

**Real discrepancy found:** `.root`'s "Shared Defaults" set `line-height` once, unconditionally, from the _default_-size token, and `.labelText` merely did `line-height: inherit` — so the small-size line-height token was never actually referenced (it was `recursica-ignore`d as "redundant"). Mantine's `Button.module.css`, by contrast, sets `line-height` directly on `.labelText` per size, from each size's own token. They currently resolve to the same literal value, so this wasn't visually observable, but it's a latent divergence from the source of truth — a future token change to the small-size line-height would silently not apply in mui-adapter.

**Fix:** moved `line-height` off `.root` and onto `.labelText` (default token), added `.root[data-size="small"] .labelText { line-height: ... }` (small token), and removed the now-inaccurate `recursica-ignore` for that token — matching Mantine's structure exactly.

---

## Button doesn't shrink inside a constraining container (Genesis, 2026-08-27)

**Bug:** in the `TruncatedLabel` story (`<div style={{ maxWidth: 250 }}><Button>...long label.../Button></div>`), the button ignored the 250px wrapper entirely and rendered at its full 534px intrinsic width, overflowing the wrapper instead of shrinking and showing the ellipsis.

**Root cause:** `.root` has `width: fit-content` (to hug its own content instead of stretching in flex columns) but no `max-width`. Verified via Playwright: the wrapper measured exactly 250px, but `fit-content` on `.root` still resolved to its 534px `max-content` size — it doesn't reliably clamp against a narrower containing block on its own. Same root cause and identical fix in mantine-adapter.

**Fix:** added `max-width: 100%` to `.root`. It's a no-op when the parent is wide enough (confirmed no change to `Default`/`IconOnly`/`TextWithIcon` story widths), and clamps the button to the parent's resolved width when the parent is narrower — at which point the existing `overflow: hidden` (`.root`) + `text-overflow: ellipsis`/`white-space: nowrap` (`.labelText`) take over, exactly as already documented above.

---

## `.labelText` descender clipping (Matt Massey, 2026-08-28)

`.labelText` used plain `overflow: hidden` to make `text-overflow: ellipsis` work, which also
clips descenders (e.g. the "g" in a long label) whenever `text_line-height` is tighter than the
font's natural ascent+descent. Switched to `overflow: clip; overflow-clip-margin: 0.35em;` — same
truncation, but ink can bleed slightly past the line box before it's actually clipped. `.root`'s
own `overflow: hidden` (the max-width truncation bounding box, above) is untouched — it has
padding around the label so it isn't tight against the glyphs the way `.labelText` is.
Project-wide fix; see Chip's `CHIP_IMPLEMENTATION_NOTES.md` for the original discovery.
