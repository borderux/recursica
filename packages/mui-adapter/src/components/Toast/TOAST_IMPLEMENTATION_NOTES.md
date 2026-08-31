# Toast – Implementation Notes

Decisions and design tweaks tailored for the UI Kit's Toast wrapped against `@mui/material`'s `Alert` component.

---

## 1. No default icon (source-of-truth audit, 2026-08-30)

**Decision:** `icon` defaults to suppressed (no icon) when the caller doesn't supply one, matching mantine-adapter's `Notification`-based Toast, which never renders an icon unless explicitly given one (see its own `TOAST_IMPLEMENTATION_NOTES.md` §3).

**Implementation:** MUI's `Alert` falls back to its own built-in severity icon (a checkmark, since MUI's default `severity` is `"success"`) whenever its `icon` prop is left `undefined` — `icon={false}` is the only way to render no icon at all. `Toast` now passes `icon={icon ?? false}` instead of `icon={icon}` so an unset `icon` prop renders nothing, not MUI's own default. Found via the `adapter-tester:source-of-truth` divergence check: mui's `Default` story rendered a leading checkmark icon mantine's golden never had.

---

## 2. Doubled vertical padding (source-of-truth audit, 2026-08-30)

**Symptom:** `ui-kit-toast--default` (and `with-icon`) rendered visibly taller than mantine's —
confirmed via computed styles: mui's `.MuiAlert-root` measured 93.7px tall vs mantine's
`.mantine-Notification-root` at 76.8px, for identical content and an identical
`--recursica_ui-kit_components_toast_properties_vertical-padding`/`horizontal-padding` on
`.root` in both (`8px 16px` either way — the CSS files are otherwise byte-identical).

**Root cause:** MUI's `Alert` renders internal wrapper `<div>`s for its icon/message/action
slots (`.MuiAlert-message`, `.MuiAlert-icon`, `.MuiAlert-action`), and each of those ships its
own non-zero default padding (`8px 0`, `7px 0`, and `4px 0 0 16px` respectively, straight from
MUI's own `Alert.js` source) that stacks on top of `.root`'s own padding token — doubling the
effective vertical padding. Mantine's `Notification` has no equivalent built-in padding on its
`body`/`icon`/`close` slots, so `.root`'s token is already the sole source of padding there;
that's "the correct var mantine uses" — mui just wasn't the only thing applying it.

**Fix:** Added `padding: 0 !important;` to `.body` (→ `.MuiAlert-message`), `.icon` (→
`.MuiAlert-icon`), and `.closeButton` (→ `.MuiAlert-action`) in `Toast.module.css`, so
`.root`'s own `vertical-padding`/`horizontal-padding` tokens are the only padding applied,
matching mantine exactly. `!important` follows the same pattern already used on `.icon`'s other
overrides in this file (MUI's own emotion-generated class can win the cascade depending on
`<style>` injection order otherwise). Verified via computed styles after the fix: mui's root
measured 77.7px vs mantine's 76.8px — the ~1px residual is font-metric noise, not padding.
