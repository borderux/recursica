# Button – implementation notes

Decisions and design tweaks for the Recursica Button that go beyond the Component Development Guide. Use this when maintaining the Button or when adding similar behavior to other components.

---

## Icon size: Recursica defines it

**Decision:** Icon size is **not** left to the developer. Recursica defines it via the design tokens; the Button enforces it so callers cannot pass an arbitrarily sized icon.

**Implementation:**

- When `icon` is provided, the Button wraps it in a single element with class `iconWrapper` before passing it to Mantine’s `leftSection`.
- In `Button.module.css`, `.iconWrapper` has explicit `width` and `height` from the Recursica tokens mapping natively based on `data-size`.
- The rule `.iconWrapper > *` sets `width: 100%`, `height: 100%`, and `object-fit: contain` so whatever the caller passes scales cleanly with the token constraints.

---

## Icon-only buttons: accessibility and width

**Decision:** When the button has an icon and no visible label (icon-only), callers must provide an accessible name, and the button must not show extra space to the right of the icon.

**Accessibility:** We document that icon-only buttons must pass `aria-label` (e.g. `aria-label="Submit"`). In development we log a console warning if `icon` is set, `children` is empty, and `aria-label` is missing.

**Width:** Mantine’s layout natively applies structural section gaps. We detect icon-only and set a `data-icon-only` hook so that `Button.module.css` zeros out the sections spacing allowing the button to precisely hit `min-width` perfectly centered.

---

## Label truncation at max-width

**Decision:** When the button hits its Recursica max-width (500px), the label truncates with an ellipsis instead of wrapping.

**Implementation:**
Mantine's `.mantine-Button-label` flex centering breaks primitive truncation logic. To combat this:

- **`.root`** has `overflow: hidden`.
- **`.root > *`** forces `min-width: 0`.
- The structural children wrap into `<span className={styles.labelText}>`.
- **`.labelText`** binds `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` creating flawless string cutoffs strictly at exact UI constraints.

---

## Disabled state: brand theme opacity (implicit)

**Decision:** The UI kit enforces global brand theme disabled opacities. The `.root:disabled` logic implicitly overrides visibility locally via `var(--recursica_brand_states_disabled)`.
