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

---

## Loader color contrast

**Decision:** When a Button is in a loading state, the `Recursica Loader` component is injected. The `Loader` component strictly defines its own colors and styles per variant, meaning it does not inherit the text color (`currentColor`) from the Button.

**Constraint:** This can lead to contrast issues (e.g., a blue dots loader inside a solid blue button). Design has explicitly decided not to address this at the moment. As such, developers using the `loading` prop must be aware that the loader's color is fixed by its internal tokens, not by the button's context.

---

## Loading state enforces disabled state

**Decision:** When `loading={true}` is passed to the Button, the component explicitly forces `disabled={true}` natively on the underlying element.

**Implementation:** This ensures that loading buttons automatically inherit the brand theme disabled opacities (via the `:disabled` CSS pseudo-class) rather than relying solely on Mantine's native `data-disabled` dataset logic, which may not trigger the strict visual fade required by the Recursica design system.

---

## `className` overwrite bug (Matt Massey, 2026-08-08)

**Bug:** with `overStyled` and a custom `className` (surfaced by Tree embedding a `Button` for its expand chevron — see `Tree/IMPLEMENTATION_NOTES.md`), `finalClass` (`` `${styles.root} ${classNameProp}` ``) was set explicitly on `<MantineButton>`, but `{...sanitizedProps}` was spread _after_ it — and `sanitizedProps` still contained the original, unmodified `className` key, since it had only been _read_, never deleted. The later spread would silently overwrite `finalClass` with just the caller's own class. Same bug class as `Dropdown.tsx`/`BareDropdown.tsx` had.

**Why it wasn't visible here:** `classNames={{root: mergedClassNames.root, ...}}` is a _separate_ Mantine prop from the plain `className` string, unaffected by the overwrite, and `mergedClassNames.root` always includes `styles.root` independently — so the root element kept its Recursica styling regardless of the bug. mui-adapter's equivalent `Button.tsx` has no such secondary path (`@mui/material` only has a plain `className`), so the identical mistake there was fully visible (chevron rendered in MUI's own default color). Fixed in both regardless, since this is a real latent bug independent of whether it happens to be masked today.
