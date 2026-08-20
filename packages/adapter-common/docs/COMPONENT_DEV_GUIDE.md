<critical_agent_directive>
STOP AND READ THIS FIRST.
If you are an AI agent building components:

1. You are forbidden from modifying the underlying UI library's source code or injecting system styles directly (no `style={{}}` for design tokens).
2. All style overrides must be done via `{ComponentName}.module.css` scoped to `.root`.
3. You must use native CSS variables derived from `recursica_variables_scoped.css`.
4. You must document integration and usage details in a `USAGE.md` file, and internal technical layout hooks in a `{COMPONENT}_IMPLEMENTATION_NOTES.md` file.
5. You are strictly FORBIDDEN from using CSS variable fallbacks (e.g. `var(--variable-name, fallback-value)`) in `module.css` files.
   </critical_agent_directive>

# Component Development Guide (Canonical)

This is the **canonical, shared** rulebook for building any Recursica adapter component, regardless of which UI library it wraps (Mantine, MUI, or a future adapter). Use it when creating a new component or reviewing an existing wrapper in **any** adapter.

> Each adapter has its own `docs/COMPONENT_DEV_GUIDE.md` that links back here and adds only the concrete delta for that library (e.g. how polymorphism is implemented, or a CSS-specificity note tied to that library's styling engine). Read this document first, then your adapter's delta. See [PIPELINE.md](./PIPELINE.md) for the full adapter-common → adapter → storybook-template → recursica-storybook flow, and [`CONTRIBUTING.md`](../CONTRIBUTING.md) in this package for how to keep this canonical doc and each adapter's delta in sync.
>
> For the core architectural philosophy, goals, and expectations for modifying adapter components (including the usage of `overStyled`), read [PHILOSOPHY.md](./PHILOSOPHY.md).

## Core principles

1. **Single way to style** – Use **CSS modules only** (e.g. `Button.module.css`). No inline styles for design tokens, no mix of plain `.css` and `.css.ts`.
2. **Recursica props** – Define a clear Recursica (design-system) API. Public props merge Recursica props with the underlying library's props; Recursica is preferred when both define the same concern. Map Recursica → library in the component before calling the library.
3. **Component-scoped CSS** – Do not add global CSS. All overrides apply only to the component instance by attaching your module's root class to the **library's root element** (via `classNames.root` or `className`). No wrapper divs. Stock library components elsewhere in the app are unchanged.

---

## 1. Styling

- **One file per library implementation:** `{ComponentName}.module.css`. All styling (overrides of the library) lives in this file.
- **Order in the CSS module:** Put **baseline/reset first**, then **style overrides**. Start with a `.root` block (or equivalent) that sets preset or hard-coded values for layout and box model (e.g. `position`, `margin`, `border-style`, `box-sizing`). That makes it explicit what we are setting as the baseline. Follow with rules that use Recursica/theme CSS variables for typography, colors, sizes, etc. This keeps "what we assume" separate from "what comes from tokens."
- **Hardcoded values:** Hardcoded values (e.g. `border: none`, `margin: 0`, `width: 100%`) are a potential source of error — there may be or should be a CSS variable. In the module: (1) **List them at the top of the file** in a "HARDCODED VALUES" section in the file comment: what is hardcoded, where, why, and that it may need a token later. (2) **At each hardcoded declaration**, add an inline comment (e.g. `/* HARDCODE: reason; consider token if … */`) so it's clear on scan and easy to revisit.
- **No inline design tokens in TSX** – The component does not set `style={{ ... }}` for colors, sizes, typography, or other design tokens. All such values come from the CSS module.
- **No custom properties set from TSX for styling** – The CSS module should reference Recursica/UIKit variables directly (e.g. `var(--recursica-ui-kit-components-button-...)`). If a "bridge" custom property is ever needed, document it as an exception.
- **Design tokens only in CSS** – In the module, use only Recursica/UIKit CSS variables. No hex colors, magic pixel values, or raw shadows. **Never use CSS variable fallbacks** (e.g., `var(--token, #fff)` or a fallback to a library-native variable). Rely entirely on the design tokens as the definitive source of truth.

  > [!CAUTION] > **NEVER USE CSS VARIABLE FALLBACKS**
  > Using fallback values inside `var(...)` statements (e.g. `var(--token-name, 8px)`) is strictly forbidden. Fallbacks mask missing or broken theme variables, bypass token verification checks, and cause design drift. All variable declarations must rely exclusively on the design token context: `var(--token-name)`.

- **Selectors keyed off library `data-*`** – Use `[data-size]`, `[data-variant]`, etc. so one stylesheet handles all variants and sizes.
- **Hover states** – Many UI libraries apply their own `:hover` styles. **Disable or override the library's hover** in your CSS module so only Recursica controls hover. Use hover state variables only when Recursica CSS (e.g. `recursica_variables_scoped.css`) defines hover variables for the component (e.g. `*_text-hover`). In the module, re-apply the default values for any property the library changes on hover (e.g. `background-color`, `border-color`) so the library's hover is fully overridden; then set only the Recursica hover variables (e.g. `color: var(--recursica_..._text-hover)`). If Recursica does not define hover variables for the component, do not add hover styles — leave the default (no hover) or document the exception.
- **Attach styles via `classNames` or `className`** – Prefer **`classNames`** when the library supports overriding its internal parts (e.g. `root`, `section`, `label`); pass your module's root class (e.g. `classNames={{ root: styles.root }}`) so the library root element gets your scoped class. Optionally pass part classes (e.g. `section: styles.section`) to target inner parts without `:global()`. Otherwise use **`className`** on the root. Do not mix both for the same root element. Do not use inline style objects for design.
- **`!important` / specificity** – Whether you need `!important` or chained selectors (`.root.root`) to beat the underlying library's own baseline styles depends on how that library's CSS is loaded relative to your CSS modules in this adapter's build. Check your adapter's own delta doc for the specifics of its styling engine.

Do not use plain `.css` for component overrides, and do not use `.css.ts` with `globalStyle` or other global selectors.

---

## 2. Component-scoped CSS (no global, no wrapper divs)

- Overrides must not affect the rest of the app. They apply only to instances of your component. **Do not use wrapper divs.** Stock library components used elsewhere must keep their default look.
- **Attach your module class to the library root** – Pass the module's root class to the library so the **library's root element** receives it (e.g. `classNames={{ root: styles.root }}` or `className={styles.root}`). That element then has both the library's classes and your hashed module class; only your component instances get that class, so only they receive your overrides.
- **Recursica-only attributes on the library root** – Do **not** pass layer to the component root. Layer is never a component prop (see **Layers** below). Other Recursica state (e.g. `data-variant`, `data-size`) may be passed through from the library or set by the component when the library supports it. In the module, target with `.root[data-variant='filled']`, etc.
- **Layers** – **Layer is not a component prop.** The only way to set layer is to wrap the component in `<Layer layer={0|1|2|3}>`. Components do not accept `layer` or set `data-recursica-layer` on themselves. **IMPORTANT:** Do NOT explicitly write layer-by-layer variants in your component CSS (e.g. `[data-recursica-layer='1'] .root`). Simply map your variant to the generic UI Kit variable (`--recursica_ui-kit_components...`) and the global `RecursicaThemeProvider` will natively handle cascading the correct layer values into those variables.
- **Target the root in the module** – Your `.root` class is on the same element as the library root (e.g. the button). Write root-level rules as `.root { ... }`, `.root[data-size='xs'] { ... }`, `.root[data-variant='filled'] { ... }`. For layer, use cascade only: `[data-recursica-layer='0'] .root[data-variant='filled']`, etc. No need for `:global()` on the root itself.
- **Target inner parts** – For the library's internal parts (e.g. section, label), either (a) pass part classes via `classNames` (e.g. `section: styles.section`) and target `.root .section` in the module, or (b) keep targeting the library's part classes under your root with `:global()` (e.g. `.root :global(.some-library-leftSection) { ... }`). Both are scoped because the selector only matches when that part is inside the element with your `.root` class (your component's root).
- Do not emit standalone global selectors.

---

## 3. Props: Recursica and library

### 3.1 Recursica prop layer (unified API)

- **Start with Recursica props** – The Recursica props interface is the **generic prop layer** that applies to all UI-kit adapters (Mantine, Material, Carbon, native HTML, etc.). Define it first; it is the design-system API only (e.g. `variant`, `size`, `elevation`, `icon`). **Do not add `layer` as a prop;** layer is set only by wrapping in `<Layer>`.
- **Always Document Props with JSDoc** – Every exported Prop interface (especially Recursica-specific props) MUST be fully documented using JSDoc (`/** ... */`) on every field. This ensures developers have exact Intellisense definitions locally and guarantees that autocompletion reliably maps our structural definitions without requiring them to parse the component natively.
- **Global `overStyled` prop** – Every Recursica component **must** accept an `overStyled` boolean prop (defaulting to `false`) and wrap their component properties in the `RecursicaOverStyled<T>` typescript union. This strict compile-time check prevents developers from accidentally autocompleting forbidden internal styling injections. At runtime, components also pipe their properties through `filterStylingProps` to omit injection attempts if a developer forces an override through JavaScript directly. The presence of `overStyled={true}` serves as an explicit bypass for both TypeScript and the runtime filter.
- **Goal: one API, any kit** – The goal is a **unified prop layer** for Recursica components that works with any underlying UI-kit or HTML element. Each adapter is responsible for **mapping** Recursica props to the underlying kit's API. Creating a component therefore requires **understanding each target kit's prop API** so you can define a single Recursica API that maps cleanly in every adapter.
- **Use standard HTML props when possible** – Do not change or redefine default HTML attribute types. Use native props (e.g. `type`, `title`, `disabled`, `onClick`) as-is and pass them through to the root element. They are part of the public props but not part of the "Recursica-only" design-system interface.
- **Preserve Underlying Composability** – When the target UI library utilizes a highly composable dot-notation or multi-part hierarchical API (e.g., `<Accordion>`, `<Accordion.Item>`, `<Accordion.Control>`), **do not flatten or aggregate their functionality** into a single rigid property bucket (e.g., forcing integrators to pass `{ title, content }` objects instead of using nested JSX). Instead, establish a 1:1 React component mapping of the library's sub-components. This strictly preserves the underlying library's dynamic ARIA tracking, semantic HTML behaviors, focus accessibility, and expected Developer Experience (DX) while securely enforcing Recursica styling rules.
- **Unifying kit-specific concepts** – Kits often differ (e.g. one has `leftSection`/`rightSection`, another has `startIcon`/`endIcon`). When defining the Recursica API, unify where it makes sense: e.g. `icon` can be synonymous for "left/leading icon" if that's the common case; a separate prop or `...rest` can cover the other side. Document the convention (e.g. "icon = leading icon") in the component or guide.

### 3.2 Unsupported props — explicit removal via `omitUnsupportedProps`

`filterStylingProps` blocks a fixed set of styling escape hatches. Separately, most components also have their own set of props the underlying library exposes but Recursica doesn't support at all (e.g. the library's native `size`/`color`/`radius`/`variant`, superseded by Recursica's own version of that concern). `Omit<LibraryProps, "size">` on the public props type stops a well-typed caller from passing it — but does nothing against a caller forcing the prop through plain JavaScript (or `as any`), which then leaks straight through `...rest`/`sanitizedProps` into the wrapped component, unprotected.

`omitUnsupportedProps` (from `@recursica/adapter-common`, re-exported alongside `filterStylingProps` in each adapter's own `filterStylingProps.ts`) is the runtime backstop for that. Call it immediately after `filterStylingProps`, passing a component-local `UNSUPPORTED_PROPS` const — declared at the top of the component function, one entry per prop, each with a comment explaining why it isn't supported:

```tsx
// Props this component intentionally doesn't support — deleted at runtime so they can't leak
// through even if a caller forces them via plain JavaScript, bypassing the `Omit<>` above.
const UNSUPPORTED_PROPS = [
  "size", // Recursica controls sizing via the `size` variant + design tokens, not raw dimensions.
  "color", // Colors are token-driven; the library's native palette isn't exposed.
] as const satisfies readonly (keyof MantineButtonProps)[];

const sanitizedProps = omitUnsupportedProps(
  filterStylingProps(rest, overStyled),
  UNSUPPORTED_PROPS,
);
```

- Apply this to **every** component, including sub-components merged onto a parent via dot-notation or `Object.assign` (e.g. `Table.Th`, `Accordion.Control`, `Menu.Item`) — each sub-component declares its own `UNSUPPORTED_PROPS` for its own prop surface.
- This replaces one-off `delete restRecord["propName"]` calls scattered through a component body — consolidate them into the single `UNSUPPORTED_PROPS` const instead, keeping each prop's rationale comment.
- Layout primitives (`Flex`, `Stack`, `Group`, `Container`, `Grid`) are the documented exception: they intentionally skip both `filterStylingProps` and `omitUnsupportedProps` so callers can freely pass width/height/padding/margin/flex props. Don't add `UNSUPPORTED_PROPS` there.

### 3.3 Prop merging — always `{...sanitizedProps, ...overrides}`, intent lives in named helpers

**Rule: when rendering the library component, always spread `sanitizedProps` (or `rest`) first, then list every computed/forced prop after it — no exceptions, not even for props where the caller "should" win.** In JSX, when the same prop name appears twice, the one written later wins, so this is what makes our computed values win by default. But that rule alone is ambiguous: it can't tell you whether a given attribute after the spread means "our value always wins" or "the caller may override our default" — those are opposite intents that look identical in JSX. Resolve that ambiguity by name, not by where you place the attribute:

| Intent                                                                                                                          | Mechanism                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Our value must always win, no exceptions                                                                                        | Put it directly in the JSX after the spread — plain value, no helper.                                                                                                                                                                              |
| A plain literal default the caller may override                                                                                 | Destructure it with a JS default before `...rest` even exists: `const { variant = "solid", ...rest } = props`. Never use spread order for this — it's the same syntax as "always wins," which is exactly the ambiguity this rule exists to remove. |
| A computed default (depends on other props/state, not known until inside the component body) that the caller may still override | `withCallerOverride(ourComputedDefault, callerValue)`                                                                                                                                                                                              |
| A `classNames`-shaped prop (per-slot library class strings) that the caller should extend, never fully replace                  | `mergeClassNames(ourSlotClasses, callerValue)`                                                                                                                                                                                                     |
| A `styles`-shaped prop (per-slot `CSSProperties`) that the caller should extend, never fully replace                            | `mergeStyles(ourSlotStyles, callerValue)`                                                                                                                                                                                                          |

All four helpers live in `@recursica/adapter-common`, re-exported from each adapter's `filterStylingProps.ts` alongside `filterStylingProps`/`omitUnsupportedProps`.

```tsx
// WRONG — placement alone doesn't say whether the caller may override this
<MuiRadio
  icon={<div className={styles.radio} />}
  classes={mergedClassNames}
  {...sanitizedProps}
/>

// WRONG — spread-first, but the intent (can the caller override `icon`?) is still implicit
<MuiRadio
  {...sanitizedProps}
  icon={<div className={styles.radio} />}
/>

// RIGHT — spread first; each override's intent is explicit in the code, not the ordering
<MuiRadio
  {...sanitizedProps}
  icon={withCallerOverride(<div className={styles.radio} />, icon)}
  classes={mergeClassNames({ root: styles.radio }, restRecord.classes)}
  onChange={handleChange}
/>
```

Why `mergeClassNames`/`mergeStyles` and not a bare override for slot props: the underlying library's `classNames`/`styles` slots are singular values per slot (a string, or a `CSSProperties` object) — if a caller-supplied slot value fully replaced ours via `withCallerOverride`, the component's own module styling for that slot would vanish, not just extend. These helpers merge per slot instead (string concat for `classNames`, object merge for `styles`) so the caller's value layers on top without dropping ours, across the union of slots either side names — a slot the caller targets that Recursica has no default for still passes through.

This isn't theoretical: a real mui-adapter Radio regression shipped from a spread-order mistake — `classes` was computed correctly but placed _before_ the spread, so it was always a no-op, and the radio circle never rendered. Mantine Switch's `thumbIcon` and Pagination's arrow icons had the opposite bug: placed after the spread with no helper, so a caller-passed value could silently clobber ours when the intent was actually "ours must always win." Naming the mechanism instead of relying on ordering is what prevents both.

Two acceptable ways to make a specific prop fully un-settable by a caller (stronger than any of the above — use for props that must never be settable at all, like an internally-computed `expanded`/`onChange` on a controlled item):

- **Omit it from the public props type** (e.g. `Omit<MuiAccordionProps, "expanded" | "onChange">`) so a well-typed caller can't pass it at all.
- **Destructure it out of `props` before `...rest`** (e.g. `const { className, ...rest } = props`) so it's never present in `sanitizedProps` to begin with.

### 3.4 Public props and mapping

- **Public props** – Export `ComponentNameProps = RecursicaProps & LibraryComponentNameProps` (and standard HTML/React props as appropriate). Do not duplicate library props in the Recursica interface.
- **Recursica preferred** – When Recursica and the library both define the same concern (e.g. size), Recursica wins. In each adapter, map Recursica values to library values and pass the result to the library. Callers can still pass library-specific props via `...rest` or library prop bags for escape hatches.
- **Mapping** – In each library implementation, destructure Recursica props, apply defaults, then compute library props (e.g. mapped variant, mapped size) using mapping constants when the APIs differ, e.g. `MAP_VARIANT = { solid: 'filled', outline: 'outline', text: 'subtle' }`. Render the library component with these mapped props plus `...rest`.
- **No design tokens via props** – Do not accept props that override design tokens (e.g. `backgroundColor`, `sizePx`, `height`, `minWidth`, `maxWidth`). Look is controlled by variant/size and by tokens in the CSS module. The Forge UI shows **design token properties** (e.g. height, min-width, max-width) from the component's token structure (e.g. UIKit.json); those are edited in the toolbar and applied as CSS variable values. They are not part of the Recursica component props API — the component only exposes a small set of props (variant, size, elevation, icon, etc.); layer is not a prop — wrap in `<Layer>` to set layer. Dimensions and other token-driven values come from the CSS module that references those variables.
- **Caller `className` / `style`** – You may allow optional `className` and `style` to be passed through to the library root so callers can add overrides. Document that Recursica styling comes from the module and caller values are additive.
- **Multi-library** – If the adapter supports multiple libraries, use library-specific prop bags (e.g. `mantine?: { ... }`) so callers can pass library-specific options. The implementation for each library reads its bag and merges into the props passed to that library.

---

## 4. Structure and behavior

- **No wrapper divs** – Do not add any wrapper element around the root for styling. The library component is the only root; attach your module class (and any `data-*` attributes) to that root via `classNames` or `className`.
- **Strict DOM Wrappers for Internal Children** – While the root should remain wrapper-free, internal composition (like `icon` nodes or string `children`) often _must_ be wrapped in utility `<span>` tags (e.g., `<span className={styles.iconWrapper}>` or `<span className={styles.labelText}>`). Many UI libraries' internal flex layouts will break generic CSS properties like `text-overflow: ellipsis` or allow injected SVGs to ignore UI Kit max bounds. Utilizing internal wrappers guarantees that you can deploy strict `object-fit: contain` or layout truncation decoupled from the library's assumptions.
- **Conditional Attribute Hooks for Layout Gaps** – UI libraries commonly apply generic internal padding or gaps which work normally but actively break specific layout constraints (like icon-only buttons hitting perfect 48x48 min-widths). Compute these layout exceptions in your component (`const isIconOnly = ...`) and attach custom DOM attributes (e.g. `data-icon-only`) directly to the library root. Have your CSS module use that attribute to zero-out or override the underlying library's hardcoded structural margins.
- **Do not modify component structure** – Do not alter the library's expected overarching DOM output. Use the wrapping logic mentioned above strictly inline with how properties are passed (like wrapping exactly what goes into `leftSection`).
- **Forward ref** – Forward ref to the library's root element so focus and refs work correctly.
- **Accessibility** – Rely on the library for focus, keyboard, and ARIA. Do not strip or override the library's accessibility attributes unless documented. For icon-only or otherwise unlabeled usage, require or encourage an accessible name (e.g. `aria-label`) and pass it through. **We strongly encourage logging a console warning in development mode (`process.env.NODE_ENV !== 'production'`) if an expected `aria-label` is missing to enforce strict developer compliance.**
- **Display name and JSDoc** – Set `Component.displayName` and add a brief JSDoc on the component for devtools and docs.
- **Stable classNames** – Pass module classes (e.g. `styles.root`) into `classNames`/`className`. Avoid building new objects every render when not necessary.

---

## 5. Folder structure

- **Adapter** – Because each adapter package is built for exactly one UI library, there's no need for a generic runtime adapter abstraction within it. The component itself serves as both the public API and that library's implementation.
- **Folder structure** – Place each component directly under `src/components/{ComponentName}/` (e.g., `src/components/Button/Button.tsx` and `src/components/Button/Button.module.css`).
- **Reactive token logic** – Prefer no React state or `useEffect` for design token updates. With styling in the CSS module and `var(...)` references, the browser updates when document CSS variables change. If one exception is required (e.g. elevation computed to box-shadow), keep it in the adapter or a small helper and document it.

---

## 6. Design tokens and variable naming

- **Single source of truth** – All design values come from Recursica/UIKit CSS variables. No hardcoded design values in TSX or in the CSS module (beyond `var(...)` references). **Do not use CSS variable fallbacks.** The underlying library handles its own core fallbacks natively, and Recursica tokens must act as the definitive, single-source override. Fallbacks in component CSS clutter the codebase and mask missing tokens.
- **Reference tokens only in the CSS module** – In `{ComponentName}.module.css`, use the project's variable naming (e.g. `--recursica_ui-kit_components_{component}_...`). The component TSX does not set design token values on the root.
- **Component Specificity** – Component CSS must ONLY use variables originating from the UI Kit that explicitly match its own exact component namespace (e.g. `--recursica_ui-kit_components_dropdown_...` for the Dropdown component). You should **never** bind to or inherit variables from other components (such as using `text-field` variables inside `dropdown`) even if they appear visually or geometrically identical. This strict separation guarantees that every component can be configured and themed completely independently without unintended cascading side-effects.
- **Integration rules** – Follow the integration steps in the header of `recursica_variables_scoped.css` (theme on root, layer on ancestor, generic names only, no theme/layer in selectors). The same header documents the **disabled state** rule: use `opacity: var(--recursica_brand_states_disabled)` when the component has no explicit disabled state variables; when it has its own disabled tokens (e.g. form fields), use those and do not apply the global opacity.
- Document or link to the project's CSS variable naming convention so the module uses the correct names.

---

## 7. Reactive updates

- Do not use `useEffect`, `useState`, or custom events to react to design token changes for styling. Use `var(...)` in the CSS module so the browser applies updates when variables change.
- If a single exception is needed (e.g. elevation token → box-shadow computed in JS), implement it in one place (adapter or helper), document it, and keep it minimal.

---

## 8. Files per library implementation

- **Required:**
  - `{ComponentName}.tsx` and `{ComponentName}.module.css` (No `.css.ts`, no separate plain `.css` for overrides).
  - `USAGE.md` (Documents how to integrate the component into project code, standard usage examples, and adapter-specific integration details. This is publicly consumable documentation for developers integrating the component).
    - **Scope strictly to the consumer's perspective**: props, their behavior, and integration steps. Do not explain _why_ the component is built the way it is, its internal DOM structure, which internal helper components it composes, or any implementation rationale — that belongs exclusively in `{COMPONENT}_IMPLEMENTATION_NOTES.md`. A prop's _effect_ is in scope ("`withSeconds` adds a seconds segment"); the _mechanism behind_ a fixed, non-configurable behavior is not ("this is fixed because the underlying library bundles X unconditionally with Y").
    - **Never reference `{COMPONENT}_IMPLEMENTATION_NOTES.md`** — by name, by link, or by any other pointer. It's an internal-only doc, never added to a package's `"files"` array (see `docs/DOCUMENTATION_STRATEGY.md` §3, root of the monorepo), so a link to it from `USAGE.md` is a dead link for every real consumer reading it from `node_modules` or npmjs.com — the same class of publish-boundary bug documented there for `README.md` → `PHILOSOPHY.md`, just one file over.
- **Optional:**
  - `index.ts` to re-export the component and props type.
  - An audit or doc file for documentation only.
- **Implementation notes (Living Document - Internal Only):**
  - You MUST systematically create an `{COMPONENT}_IMPLEMENTATION_NOTES.md` file (or `IMPLEMENTATION_NOTES.md`) in the component folder (e.g., `BUTTON_IMPLEMENTATION_NOTES.md`) when you build _any_ new component that requires custom logical layouts or CSS workarounds. This document is intended as internal notes on the implementation details (why specific layout hacks, accessibility tweaks, truncation hacks, or logic decisions were made) to structurally track why component logic diverges from standard library behavior. This is NOT publicly consumable or user-facing documentation. Keep this file updated as a living document.

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
- [ ] One CSS module: `{ComponentName}.module.css`. Baseline/reset first (preset or hard-coded layout/box model on `.root`), then style overrides using Recursica/UIKit `var(...)`. All overrides scoped under `.root`; use `:global()` only for library inner-part classes; no global selectors. Hardcoded values: list at top of file in "HARDCODED VALUES" section and add inline `/* HARDCODE: … */` at each.
- [ ] No wrapper div. Library root receives module class via `classNames.root` or `className`. Do not pass `data-recursica-layer` from the component (layer is set only by wrapping in `<Layer>`); no inline styles for design tokens.
- [ ] No design tokens via props; no `useEffect`/state for token-driven styling (except one documented exception if needed).
- [ ] displayName and JSDoc set; icon-only / unlabeled usage documented (e.g. aria-label).
- [ ] Toolbar integration test and any required toolbar/sidebar config added.
- [ ] Component usage, integration details, and standard import and React usage examples are documented in a public-facing `USAGE.md` file — consumer-facing prop behavior only, no internal architecture/rationale, and no reference to `{COMPONENT}_IMPLEMENTATION_NOTES.md`.
- [ ] Component-specific decisions, edge-cases, and ongoing design-system layout fixes are meticulously documented in an internal living `{COMPONENT}_IMPLEMENTATION_NOTES.md` file (e.g. `BUTTON_IMPLEMENTATION_NOTES.md`) to structurally track _why_ the component logic diverges from standard library behavior.
- [ ] Read your adapter's own `docs/COMPONENT_DEV_GUIDE.md` delta for anything library-specific (e.g. polymorphism mechanism, CSS specificity notes) not covered here.

---

## 11. Form Controls & Wrappers

When building input primitives (e.g., Text Fields, Selects, Checkboxes), UI libraries universally try to inject their own highly-opinionated macro wrappers (such as `Input.Wrapper` in Mantine or `FormControl` in MUI) to manage labels, error strings, and layout.

**Rule: Never use the underlying UI-kit's macro form wrapper.**

To strictly ensure that every single form input matches the exact Recursica semantic spacing, accessibility links, and optical layouts, we map every single form element inside our own native `<FormControlWrapper>`.

### Implementation Constraints

1. **Target the Naked Primitive**: Only render the absolute bare-metal input element from the UI system (e.g., a raw text input instead of a fully-wrapped input component, or rendering it with `label={null} description={null}` if standard properties cannot be bypassed). This guarantees we don't accidentally render two sets of labels or deeply nested hidden validation boxes.
2. **Propagate via FormControlWrapper**: Inject the naked primitive safely within `<FormControlWrapper>`. This centralizes our entire form layout parameter map (`formLayout`, `assistiveText`, `required`, etc.).
3. **Form Layout Unification**: Expose a generic `formLayout` parameter on your component (defaulting to `"stacked"`) and explicitly hand it down to `FormControlWrapper`. Do NOT maintain separate structural layout hooks specific to the singular input. Let the `FormControlWrapper` orchestrate whether the component renders stacked or side-by-side natively.
4. **ARIA Bridging**: Expose the base validation states (`error`, `required`, `id`) from your wrapper props and feed them blindly into `<FormControlWrapper>`. The wrapper calculates `aria-errormessage` and `aria-describedby` logic natively and directly `<cloneElement>` maps them straight down onto your naked input primitive for screen-reader viability safely!
5. **Component-Specific Spacing Overrides**:
   Figma generates precise component-specific layout variables (e.g., `--recursica_ui-kit_components_text-field_variants_layouts_stacked_properties_top-bottom-margin`) that dictate layout bottom margins. Rather than ignoring these variables as redundant, we leverage a CSS Custom Property hook system:

   - **The Spacing Hook**: The root form control container (`FormControlLayout`) consumes the `--form-control-margin-bottom` spacing hook, falling back natively to the global layout gap token.
   - **The Component Style Override**: Inside `{Component}.module.css`, declare a `.layoutOverride` class targeting layout states:

     ```css
     /* Stacked Layout Spacing Override */
     .layoutOverride {
       --form-control-margin-bottom: var(
         --recursica_ui-kit_components_text-field_variants_layouts_stacked_properties_top-bottom-margin
       );
     }

     /* Side-by-Side Layout Spacing Override */
     .layoutOverride[data-form-layout="side-by-side"] {
       --form-control-margin-bottom: var(
         --recursica_ui-kit_components_text-field_variants_layouts_side-by-side_properties_top-bottom-margin
       );
     }
     ```

   - **Class Forwarding**: Forward the resolved style class down to the wrapping element (e.g., `WithReadOnlyWrapper` or `FormControlWrapper`) using a merged className configuration:
     ```tsx
     const wrapperClass = className
       ? `${styles.layoutOverride} ${className}`
       : styles.layoutOverride;
     ```
   - **Zero Token Warnings**: By actively referencing these layout tokens inside the component's `.module.css` override class, you **must remove all recursica-ignore comments** for them. This keeps the token analyzer 100% clean and tracks proper variable usage.

---

## 12. Polymorphic Components (library-specific)

Preserving the ability to render a component as a different DOM element (e.g. a `Button` rendered as an `<a>`) is a shared **goal** across adapters, but the **mechanism** for it is entirely dependent on the underlying library's own API and does not belong in this canonical document. See your adapter's own `docs/COMPONENT_DEV_GUIDE.md` delta for the concrete pattern used in that library (e.g. Mantine's `createPolymorphicComponent`, or a library's native `component` prop support).
