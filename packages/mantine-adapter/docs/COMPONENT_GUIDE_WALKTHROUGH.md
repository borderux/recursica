# Component Development Guide

This guide defines how to build design-system components that wrap UI libraries (e.g. Mantine) and style them with Recursica (design tokens and UI Kit CSS variables). Use it when creating a new component or when reviewing existing wrappers.

> [!NOTE]
> For the core architectural philosophy, goals, and expectations for modifying these adapter components (including the usage of `overStyled`), please read the [Mantine Adapter Philosophy](./PHILOSOPHY.md).

## Core principles

1. **Single way to style** – Use **CSS modules only** (e.g. `Button.module.css`). No inline styles for design tokens, no mix of plain `.css` and `.css.ts`.
2. **Recursica props** – Define a clear Recursica (design-system) API. Public props merge Recursica props with the underlying library’s props; Recursica is preferred when both define the same concern. Map Recursica → library in the component before calling the library.
3. **Component-scoped CSS** – Do not add global CSS. All overrides apply only to the component instance by attaching your module’s root class to the **library’s root element** (via `classNames.root` or `className`). No wrapper divs. Stock library components elsewhere in the app are unchanged.

---

## 1. Styling

- **One file per library implementation:** `{ComponentName}.module.css`. All styling (overrides of the library) lives in this file.
- **Order in the CSS module:** Put **baseline/reset first**, then **style overrides**. Start with a `.root` block (or equivalent) that sets preset or hard-coded values for layout and box model (e.g. `position`, `margin`, `border-style`, `box-sizing`). That makes it explicit what we are setting as the baseline. Follow with rules that use Recursica/theme CSS variables for typography, colors, sizes, etc. This keeps “what we assume” separate from “what comes from tokens.”
- **Hardcoded values:** Hardcoded values (e.g. `border: none`, `margin: 0`, `width: 100%`) are a potential source of error—there may be or should be a CSS variable. In the module: (1) **List them at the top of the file** in a "HARDCODED VALUES" section in the file comment: what is hardcoded, where, why, and that it may need a token later. (2) **At each hardcoded declaration**, add an inline comment (e.g. `/* HARDCODE: reason; consider token if … */`) so it's clear on scan and easy to revisit.
- **No inline design tokens in TSX** – The component does not set `style={{ ... }}` for colors, sizes, typography, or other design tokens. All such values come from the CSS module.
- **No custom properties set from TSX for styling** – The CSS module should reference Recursica/UIKit variables directly (e.g. `var(--recursica-ui-kit-components-button-...)`). If a “bridge” custom property is ever needed, document it as an exception.
- **Design tokens only in CSS** – In the module, use only Recursica/UIKit CSS variables. No hex colors, magic pixel values, or raw shadows.
- **Selectors keyed off library `data-*`** – Use `[data-size]`, `[data-variant]`, etc. so one stylesheet handles all variants and sizes.
- **Hover states** – Many libraries (e.g. Mantine) apply their own `:hover` styles. **Disable or override the library's hover** in your CSS module so only Recursica controls hover. Use hover state variables only when Recursica CSS (e.g. `recursica_variables_scoped.css`) defines hover variables for the component (e.g. `*_text-hover`). In the module, re-apply the default values for any property the library changes on hover (e.g. `background-color`, `border-color`) so the library's hover is fully overridden; then set only the Recursica hover variables (e.g. `color: var(--recursica_..._text-hover)`). If Recursica does not define hover variables for the component, do not add hover styles—leave the default (no hover) or document the exception.
- **Attach styles via `classNames` or `className`** – Prefer **`classNames`** when the library supports overriding its internal parts (e.g. `root`, `section`, `label`); pass your module’s root class (e.g. `classNames={{ root: styles.root }}`) so the library root element gets your scoped class. Optionally pass part classes (e.g. `section: styles.section`) to target inner parts without `:global()`. Otherwise use **`className`** on the root. Do not mix both for the same root element. Do not use inline style objects for design.

Do not use plain `.css` for component overrides, and do not use `.css.ts` with `globalStyle` or other global selectors.

---

## 2. Component-scoped CSS (no global, no wrapper divs)

- Overrides must not affect the rest of the app. They apply only to instances of your component. **Do not use wrapper divs.** Stock library components used elsewhere must keep their default look.
- **Attach your module class to the library root** – Pass the module’s root class to the library so the **library’s root element** receives it (e.g. `classNames={{ root: styles.root }}` or `className={styles.root}`). That element then has both the library’s classes and your hashed module class; only your component instances get that class, so only they receive your overrides.
- **Recursica-only attributes on the library root** – Do **not** pass layer to the component root. Layer is never a component prop (see **Layers** below). Other Recursica state (e.g. `data-variant`, `data-size`) may be passed through from the library or set by the component when the library supports it. In the module, target with `.root[data-variant='filled']`, etc.
- **Layers** – **Layer is not a component prop.** The only way to set layer is to wrap the component in `<Layer layer={0|1|2|3}>`. Components do not accept `layer` or set `data-recursica-layer` on themselves. **IMPORTANT:** Do NOT explicitly write layer-by-layer variants in your component CSS (e.g. `[data-recursica-layer='1'] .root`). Simply map your variant to the generic UI Kit variable (`--recursica_ui-kit_components...`) and the global `RecursicaThemeProvider` will natively handle cascading the correct layer values into those variables.
- **Target the root in the module** – Your `.root` class is on the same element as the library root (e.g. the button). Write root-level rules as `.root { ... }`, `.root[data-size='xs'] { ... }`, `.root[data-variant='filled'] { ... }`. For layer, use cascade only: `[data-recursica-layer='0'] .root[data-variant='filled']`, etc. No need for `:global()` on the root itself.
- **Target inner parts** – For the library’s internal parts (e.g. section, label), either (a) pass part classes via `classNames` (e.g. `section: styles.section`) and target `.root .section` in the module, or (b) keep targeting the library’s part classes under your root with `.root :global(.mantine-Button-leftSection) { ... }`. Both are scoped because the selector only matches when that part is inside the element with your `.root` class (your component’s root).
- Do not emit standalone global selectors (e.g. no `globalStyle` or top-level `.mantine-Button-root`).

---

## 3. Props: Recursica and library

### 3.1 Recursica prop layer (unified API)

- **Start with Recursica props** – The Recursica props interface is the **generic prop layer** that applies to all UI-kit adapters (Mantine, Material, Carbon, native HTML, etc.). Define it first; it is the design-system API only (e.g. `variant`, `size`, `elevation`, `icon`). **Do not add `layer` as a prop;** layer is set only by wrapping in `<Layer>`.
- **Always Document Props with JSDoc** - Every exported Prop interface (especially Recursica specific props) MUST be fully documented using JSDoc (`/** ... */`) on every field. This ensures developers have exact Intellisense definitions locally and guarantees that autocompletion reliably maps our structural definitions without requiring them to parse the component natively.
- **Global `overStyled` prop** – Every Recursica component **must** accept an `overStyled` boolean prop (defaulting to `false`) and wrap their component properties in the `RecursicaOverStyled<T>` typescript union. This strict compile-time check prevents developers from accidentally autocompleting forbidden internal styling injections (like `className` or Mantine system `bg` maps). At runtime, components also pipe their properties through `filterStylingProps` to omit injection attempts if a developer forces an override through Javascript directly. The presence of `overStyled={true}` serves as an explicit bypass for both Typescript and the runtime filter.
- **Goal: one API, any kit** – The goal is a **unified prop layer** for Recursica components that works with any underlying UI-kit or HTML element. Each adapter is responsible for **mapping** Recursica props to the underlying kit’s API. Creating a component therefore requires **understanding each target kit’s prop API** so you can define a single Recursica API that maps cleanly in every adapter.
- **Use standard HTML props when possible** – Do not change or redefine default HTML attribute types. Use native props (e.g. `type`, `title`, `disabled`, `onClick`) as-is and pass them through to the root element. They are part of the public props but not part of the “Recursica-only” design-system interface.
- **Preserve Underlying Composability** – When the target UI library utilizes a highly composable dot-notation or multi-part hierarchical API (e.g., `<Accordion>`, `<Accordion.Item>`, `<Accordion.Control>`), **do not flatten or aggregate their functionality** into a single rigid property bucket (e.g., forcing integrators to pass `{ title, content }` objects instead of using nested JSX). Instead, establish a 1:1 React component mapping of the library's sub-components. This strictly preserves the underlying library's dynamic ARIA tracking, semantic HTML behaviors, focus accessibility, and expected Developer Experience (DX) while securely enforcing Recursica styling rules.
- **Unifying kit-specific concepts** – Kits often differ (e.g. one has `leftSection`/`rightSection`, another has `startIcon`/`endIcon`). When defining the Recursica API, unify where it makes sense: e.g. `icon` can be synonymous for “left/leading icon” if that’s the common case; a separate prop or `...rest` can cover the other side. Document the convention (e.g. “icon = leading icon”) in the component or guide.

### 3.2 Public props and mapping

- **Public props** – Export `ComponentNameProps = RecursicaProps & LibraryComponentNameProps` (and standard HTML/React props as appropriate). Do not duplicate library props in the Recursica interface.
- **Recursica preferred** – When Recursica and the library both define the same concern (e.g. size), Recursica wins. In each adapter, map Recursica values to library values and pass the result to the library. Callers can still pass library-specific props via `...rest` or library prop bags for escape hatches.
- **Mapping** – In each library implementation, destructure Recursica props, apply defaults, then compute library props (e.g. `mantineVariant`, `mantineSize`) using mapping constants when the APIs differ, e.g. `MAP_VARIANT = { solid: 'filled', outline: 'outline', text: 'subtle' }`. Render the library component with these mapped props plus `...rest`.
- **No design tokens via props** – Do not accept props that override design tokens (e.g. `backgroundColor`, `sizePx`, `height`, `minWidth`, `maxWidth`). Look is controlled by variant/size and by tokens in the CSS module. The forge UI shows **design token properties** (e.g. height, min-width, max-width) from the component’s token structure (e.g. UIKit.json); those are edited in the toolbar and applied as CSS variable values. They are not part of the Recursica component props API — the component only exposes a small set of props (variant, size, elevation, icon, etc.); layer is not a prop—wrap in `<Layer>` to set layer. Dimensions and other token-driven values come from the CSS module that references those variables.
- **Caller `className` / `style`** – You may allow optional `className` and `style` to be passed through to the library root so callers can add overrides. Document that Recursica styling comes from the module and caller values are additive.
- **Multi-library** – If the adapter supports multiple libraries, use library-specific prop bags (e.g. `mantine?: { ... }`) so callers can pass library-specific options. The implementation for each library reads its bag and merges into the props passed to that library.

---

## 4. Structure and behavior

- **No wrapper divs** – Do not add any wrapper element around the root for styling. The library component is the only root; attach your module class (and any `data-*` attributes) to that root via `classNames` or `className`.
- **Strict DOM Wrappers for Internal Children** – While the root should remain wrapper-free, internal composition (like `icon` nodes or string `children`) often _must_ be wrapped in utility `<span>` tags (e.g., `<span className={styles.iconWrapper}>` or `<span className={styles.labelText}>`). Mantine's internal flex layouts will often break generic CSS properties like `text-overflow: ellipsis` or allow injected SVGs to ignore UI Kit max bounds. Utilizing internal wrappers guarantees that you can deploy strict `object-fit: contain` or layout truncation decoupled from Mantine's assumptions.
- **Conditional Attribute Hooks for Layout Gaps** – Mantine components apply generic internal padding or gaps which work normally but actively break specific layout constraints (like icon-only buttons hitting perfect 48x48 min-widths). Compute these layout exceptions in your component (`const isIconOnly = ...`) and attach custom DOM attributes (e.g. `data-icon-only`) directly to the Mantine root. Have your CSS module use that attribute to zero-out or override the underlying library's hardcoded structural margins.
- **Do not modify component structure** – Do not alter the library’s expected overarching DOM output. Use the wrapping logic mentioned above strictly inline with how properties are passed (like wrapping exactly what goes into `leftSection`).
- **Forward ref** – Forward ref to the library’s root element so focus and refs work correctly.
- **Accessibility** – Rely on the library for focus, keyboard, and ARIA. Do not strip or override the library’s accessibility attributes unless documented. For icon-only or otherwise unlabeled usage, require or encourage an accessible name (e.g. `aria-label`) and pass it through. **We strongly encourage logging a console warning in development mode (`process.env.NODE_ENV !== 'production'`) if an expected `aria-label` is missing to enforce strict developer compliance.**
- **Display name and JSDoc** – Set `Component.displayName` and add a brief JSDoc on the component for devtools and docs.
- **Stable classNames** – Pass module classes (e.g. `styles.root`) into `classNames`/`className`. Avoid building new objects every render when not necessary.

---

## 5. Folder structure

- **Adapter** – Because this package (`@recursica/mantine-adapter`) is explicitly built for Mantine, we do not need a generic adapter abstraction. The component itself serves as both the public API and the Mantine implementation.
- **Folder structure** – Place each component directly under `src/components/{ComponentName}/` (e.g., `src/components/Button/Button.tsx` and `src/components/Button/Button.module.css`).
- **Reactive token logic** – Prefer no React state or `useEffect` for design token updates. With styling in the CSS module and `var(...)` references, the browser updates when document CSS variables change. If one exception is required (e.g. elevation computed to box-shadow), keep it in the adapter or a small helper and document it.

---

## 6. Design tokens and variable naming

- **Single source of truth** – All design values come from Recursica/UIKit CSS variables. No hardcoded design values in TSX or in the CSS module (beyond `var(...)` references).
- **Reference tokens only in the CSS module** – In `{ComponentName}.module.css`, use the project’s variable naming (e.g. `--recursica_ui-kit_components_{component}_...`). The component TSX does not set design token values on the root.
- **Integration rules** – Follow the integration steps in the header of `recursica_variables_scoped.css` (theme on root, layer on ancestor, generic names only, no theme/layer in selectors). The same header documents the **disabled state** rule: use `opacity: var(--recursica_brand_states_disabled)` when the component has no explicit disabled state variables; when it has its own disabled tokens (e.g. form fields), use those and do not apply the global opacity.
- Document or link to the project’s CSS variable naming convention so the module uses the correct names.

---

## 7. Reactive updates

- Do not use `useEffect`, `useState`, or custom events to react to design token changes for styling. Use `var(...)` in the CSS module so the browser applies updates when variables change.
- If a single exception is needed (e.g. elevation token → box-shadow computed in JS), implement it in one place (adapter or helper), document it, and keep it minimal.

---

## 8. Files per library implementation

- **Required:** `{ComponentName}.tsx` and `{ComponentName}.module.css`. No `.css.ts`, no separate plain `.css` for overrides.
- **Optional:** `index.ts` to re-export the component and props type; an audit or doc file (e.g. `Button.mantine.audit.md`) for documentation only.
- **Implementation notes (Living Document):** You MUST systematically create an `{COMPONENT}_IMPLEMENTATION_NOTES.md` file in the component folder (e.g. `BUTTON_IMPLEMENTATION_NOTES.md`) when you build _any_ new component that requires custom logical layouts or CSS workarounds. Crucially, **keep this file updated as a living document**. As we discover edge cases (e.g. accessibility tweaks, truncation hacks, flex-gap resets) and deploy bug fixes, this document must act as the ultimate source of truth tracking exactly _why_ those fixes exist so future maintainers don't accidentally erase them while refactoring.

---

## 9. Testing and workflow

- **Toolbar integration tests** – Required for components that participate in the toolbar (e.g. `{ComponentName}.toolbar.test.tsx`).
- **Unit tests** – Cover the adapter and library implementation; follow existing test patterns in the repo.
- **Toolbar config and sidebar** – Add toolbar configuration and sidebar entry as required by the project workflow for new components.
- Components do not require changes to global CSS; they use only their module.

---

## 10. Checklist for a new component

- [ ] Recursica/UIKit variables exist for this component (or are planned).
- [ ] Recursica props interface is defined first (unified prop layer for all adapters); use standard HTML props as-is; public props = Recursica & library/HTML props.
- [ ] Defaults set for Recursica props; mapping constants used when Recursica and library APIs differ.
- [ ] Library implementation: destructure Recursica props, map to library props, render library component with mapped props and `...rest`; ref forwarded.
- [ ] One CSS module: `{ComponentName}.module.css`. Baseline/reset first (preset or hard-coded layout/box model on `.root`), then style overrides using Recursica/UIKit `var(...)`. All overrides scoped under `.root`; use `:global()` only for library inner-part classes (e.g. `.root :global(.mantine-Button-section)`); no global selectors. Hardcoded values: list at top of file in "HARDCODED VALUES" section and add inline `/* HARDCODE: … */` at each.
- [ ] No wrapper div. Library root receives module class via `classNames.root` or `className`. Do not pass `data-recursica-layer` from the component (layer is set only by wrapping in `<Layer>`); no inline styles for design tokens.
- [ ] No design tokens via props; no `useEffect`/state for token-driven styling (except one documented exception if needed).
- [ ] displayName and JSDoc set; icon-only / unlabeled usage documented (e.g. aria-label).
- [ ] Toolbar integration test and any required toolbar/sidebar config added.
- [ ] Component-specific decisions, edge-cases, and ongoing design-system layout fixes are meticulously documented in a living `{COMPONENT}_IMPLEMENTATION_NOTES.md` file (e.g. `BUTTON_IMPLEMENTATION_NOTES.md`) to structurally track _why_ the component logic diverges from standard library behavior.
