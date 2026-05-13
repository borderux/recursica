# Toast – Implementation Notes

Decisions and design tweaks tailored for the UI Kit's Toast wrapped against `@mantine/core`'s `Notification` component.

---

## 1. Standalone Visual Wrapper

**Decision:** We wrap `@mantine/core`'s standalone `Notification` component instead of wrapping the `@mantine/notifications` provider.

**Implementation:** The UI Kit provides variables for the `Toast` component itself (e.g., `--recursica_ui-kit_components_toast_*`). We use these variables to style the standard Mantine `Notification` element. This allows developers to use `<Toast>` manually if they want a static or inline message.

If dynamic popups are required, developers can configure `@mantine/notifications` to utilize this component or use its classes.

---

## 2. Variant Mapping via `data-variant`

**Decision:** `variant` props (`"default" | "error" | "success"`) are mapped directly to `data-variant` on the Mantine root `Box`.

**Implementation:** Mantine's `Notification` doesn't inherently support our custom variants out of the box in the way we want them styled. By passing `data-variant` directly to the `Box`, we can explicitly target the root element in our `Toast.module.css` (e.g., `.root[data-variant="success"]`) and pipe in the corresponding UI Kit layer colors.

---

## 3. Minimal CSS Override Philosophy

**Decision:** The CSS module only overrides visual design tokens (colors, typography, padding, borders, shadows).

**Implementation:** We defer layout structure, icon rendering, loader transitions, and close button mechanics to Mantine. The `border-style: none;` is hardcoded to reset any underlying styles from Mantine's defaults, ensuring a clean mapping of elevation and shadows.

---

## 4. Unsupported `loading` State

**Decision:** The native `loading` state is explicitly stripped and bypassed from the `<Toast />` component wrapper.

**Implementation:** Mantine's `Notification` inherently supports a `loading={true}` state that natively spins up a loader instead of an icon. However, Recursica's UI Kit strictly does not define structural tokens for loader states inside toasts.
Instead of attempting to tightly couple the internal `Loader` abstraction or mapping variables incorrectly, the `loading` property is explicitly omitted and `false`-enforced from the public API.
If consumers explicitly require a loading toast, they must manually inject a `<Loader />` component into the `icon` slot.
