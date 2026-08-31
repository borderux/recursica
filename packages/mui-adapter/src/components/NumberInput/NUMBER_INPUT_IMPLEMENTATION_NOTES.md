# NumberInput – implementation notes

Decisions and design tweaks specific to the UI Kit's NumberInput wrapped against `@mui/material`.

---

## 1. `InputBase` instead of `TextField` (source-of-truth audit, 2026-08-30)

**Decision:** Render the naked field with MUI's `InputBase`, not `TextField`.

**Root cause:** The component previously rendered `<TextField>` and passed the CSS-module class
map (`root`/`input`/`section`/`controls`/`control`) through TextField's own `classes` prop.
`TextField`'s `classes` type only exposes a single `root` key
(`@mui/material/TextField/textFieldClasses.d.ts`), and that `root` maps to the outer
`FormControl` wrapper `TextField` renders around everything — not to the actual `<input>`
element or its border/background. Every rule in `NumberInput.module.css` scoped to `.input`
(padding, border-radius, colors, focus box-shadow) or to `.root` (min-height, border, background)
was therefore never attached to any real DOM node. `TextField`'s default `variant="outlined"`
also draws its own border via an internal `<fieldset>` (`notchedOutline`) with MUI's own
default focus/hover treatment, independent of any of our CSS — which is why the focus ring came
through as MUI's stock primary-color ring instead of the Recursica focus tokens, and why
border-radius/height/icon-gutter tokens had no visible effect.

**Implementation:** Switched to `InputBase`, which supports real `classes.root`/`classes.input`
slots (`root` = the bordered/backgrounded box InputBase renders around the input + adornments;
`input` = the actual `<input>` element) — the exact same fix already used by the sibling
`TextField` (Recursica) component (`src/components/TextField/TextField.tsx`), which this
implementation now mirrors structurally: border/background/color/font/border-radius moved onto
`.root`, box geometry (padding) on `.input`, and `.section` (icon/adornment slots) made
`position: absolute` inset to the root's edges instead of an inline flex sibling, matching how
Mantine's own `Input.Wrapper` reserves icon-gutter space via `.input`'s dynamic
`padding-left`/`padding-right` (`--input-left-section-size` / `--input-right-section-size`).
`data-disabled`/`data-error`/`data-with-left-section`/`data-with-right-section` are now set
explicitly on `<InputBase>` (previously never set at all, so the `[data-error]`/`[data-disabled]`
state selectors in the CSS module were dead code too).

This one root-cause fix resolves several source-of-truth-audit findings at once:

- Focus ring now uses the Recursica focus tokens (was MUI's default blue).
- `.root`'s border-radius token now actually renders (was invisible; `states` story).
- `.root`'s min-height token now actually renders, matching Mantine's height exactly instead of
  being taller (`hidden-controls` story) — MUI's own default `TextField` padding/line-height was
  filling the gap our own (unattached) `min-height` was supposed to constrain.
- Icon-gutter padding (`--input-left-section-size`/`--input-right-section-size`) now actually
  reserves space on `.input`, fixing both the crowded left icon (`with-left-icon`) and the right
  icon sitting further from the edge than Mantine's (`with-right-icon`).

**Border-width also switched from a hardcoded `1px` to the existing
`--recursica_ui-kit_components_number-input_properties_border-size` token** (previously unused
by this component, in violation of the "no hardcoded sizing" rule — Mantine's own module already
used it). The per-state `border-size` exemption comments were ported from `mantine-adapter`'s
`NumberInput.module.css` since disabled/error only ever recolor the border, never resize it.

## 2. Icon/adornment section color applies to the whole slot, not just `<svg>` (2026-08-30)

**Decision:** `.section[data-position="left"|"right"]` now sets `color` directly, in addition to
keeping the icon-sizing rule scoped to `:global(svg)`.

**Context:** The `with-left-icon`/`with-right-icon` stories pass a plain `<span>$</span>` /
`<span>%</span>` as the section content, not a real icon component. Mantine's own
`mantine-Input-section` ships a library-default `color: var(--mantine-color-placeholder)` (a
generic gray, independent of any Recursica token) that free-rides under any content dropped into
that slot; our own CSS only ever recolored `:global(svg)` descendants, so plain text fell back to
inheriting `.root`'s text-color token (near-black) instead. Applying the leading/trailing-icon
token to the section itself (not just its `<svg>` children) makes any section content —
icon or plain text — consistently use the Recursica icon-color token.

**Caveat (documented, not a further attempt):** The Recursica
`--recursica_ui-kit_components_number-input_properties_colors_trailing-icon` /
`_leading-icon` tokens both resolve to `#131313` (near-black) in this token set. Mantine's demo
stories render a lighter gray only because of the unrelated `--mantine-color-placeholder`
library default described above — that gray is not backed by any Recursica variable. Since
hardcoding a copy of Mantine's incidental placeholder-gray would violate the "no hardcoded
colors" rule, this component now applies the actual token value everywhere a section renders,
which is the token-correct behavior even though it no longer color-matches Mantine's demo-only
`<span>` stand-in pixel-for-pixel. If the intent is for real icon color to look lighter than
`#131313`, that's a token value question for the design system, not an adapter bug.

## 3. Numeric-only keystroke filtering (source-of-truth audit, 2026-08-30)

**Decision:** Restrict typed/pasted characters to digits, a single decimal point, and (only when
negative values aren't excluded by `min`) a single leading minus sign.

**Root cause:** MUI's `InputBase` has no numeric-parsing behavior built in — unlike Mantine's
`NumberInput`, which validates/rejects non-numeric characters internally, this component
previously behaved like a plain text field, silently accepting any input.

**Implementation:** `onKeyDown` calls `isAllowedNumericKeystroke` (rejecting anything that isn't
a digit, a first `-` when `min === undefined || min < 0`, a single `.`, a navigation/editing key,
or a modifier-held shortcut) before forwarding the event to any caller-supplied `onKeyDown`.
`onPaste` runs the same allowance against the full pasted string. This is deliberately a
keystroke gate, not a value-transforming `onChange` wrapper — it never rewrites a caller's
controlled `value`, only prevents the illegal keystroke from landing in the first place.
