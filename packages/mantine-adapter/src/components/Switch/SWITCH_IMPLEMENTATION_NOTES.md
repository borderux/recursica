# Switch Implementation Notes

This document acts as a living record tracking the layout decisions, architectural tradeoffs, and structural hacks explicitly applied to the `Switch` component wrapper to bridge Mantine's defaults with the Recursica UI Kit's rigid requirements.

## 1. Stripping Mantine's Size Engine

Mantine uses properties like `size`, `color`, and `radius` to dynamically map CSS layout values across its `.track` and `.thumb` nodes. We proactively strip and delete these properties using `filterStylingProps` to entirely neutralize this native behavior.

## 2. Hardcoded Values & Transitions

Mantine injects dynamic width/height attributes into its switch through inline CSS variables (e.g. `--switch-height`). To strictly enforce the UI Kit tokens without breaking Mantine's internal math, our `Switch.module.css` structurally remaps Mantine's internal variables explicitly:

```css
--switch-width: var(--switch-track-width);
--switch-height: calc(
  var(--switch-thumb-height) + (var(--switch-track-padding) * 2)
);
```

We also hardcode `border: none` since the UI kit designs rely purely on box-shadow elevations and background color tracking. Mantine’s default border logic is entirely disabled.

## 3. ReadOnly Behavior

Similar to `Checkbox`, the `Switch` component handles `readOnly` presentation by dropping the entire underlying node tree and falling back structurally onto `<FormControlWrapper>` when `readOnly: true`. This strictly preserves exact baseline alignment across all primitives without trying to hack disabled CSS to look like read-only text.

## 4. Hover State Reset

Mantine forcefully triggers track hover color states globally. Since Recursica currently does not map specific hover states to switch backgrounds across themes (falling back to standard unselected tokens or simply providing a cursor), we structurally wipe out Mantine's `.track:hover` class block inside `Switch.module.css`.

## 5. `RecursicaSwitchGroupProps.value`/`onChange` shape

Tightened to `string[]`/`(value: string[]) => void` to match Mantine's real `Switch.Group` value
type exactly (previously `unknown[]`, which was accurate but forced `as any` casts everywhere
this component's `value`/`defaultValue` were handed to `<MantineSwitch.Group>`). Now a genuine
"Shared" prop — same name and shape as native, no reshaping needed.

## 6. `onChange` shape mismatch (Forge's report) doesn't apply

Neither `Switch` nor `SwitchGroup` reshapes native `onChange` — it flows straight through as
Mantine's real event-based signature (`(event: ChangeEvent<HTMLInputElement>) => void` for
`Switch`, `(value: string[]) => void` for `SwitchGroup`). Forge's report flagged an
event-vs-boolean mismatch, but that's Forge's own dispatcher typing against the old deleted
local components — our contract never claimed a boolean shape to begin with.

## 7. Focus ring was Mantine's own default blue, not a Recursica color

**Found 2026-08-14:** the hidden `<input>` was left with Mantine's own default focus outline
(no override existed despite this file previously claiming "focus rings handled internally by
Mantine" as an intentional decision — verified live, it renders Mantine's theme blue, not a
Recursica token). Fixed: `.root input:focus-visible { outline: none }` suppresses the native
outline on the input, and `.root input:focus-visible + .track { ... }` draws the real ring
(same `--recursica_brand_states_focus_*` tokens used elsewhere) on the visible track instead —
matching the fix made to `mui-adapter`'s Switch for parity.

## `SwitchGroup` side-by-side layout always rendered as if stacked

**Found 2026-08-14, reported by Matt (against mui-adapter, reproduced here too):** `SwitchGroup`
passed the switch-item's own inline label max-width token (200px) as the group's
`controlMaxWidth` — but the mandatory side-by-side label column is a fixed 224px, wider than
that cap, so the label always overflowed onto its own line regardless of layout mode. Not a
mui-only bug: same code pattern, same result, here. Fixed by not capping the group's control
width at all — each switch's own label already wraps at 200px via `.labelWrapper`, so no
group-level cap is needed. Verified live in both adapters: side-by-side now shows the label
column at left with the switches beside it; stacked layout unaffected.
