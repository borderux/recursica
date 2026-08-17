# @recursica/mui-adapter

## 0.22.0

### Minor Changes

- 106bc34: Accordion: closed silent prop-contract conflicts where native `expanded`/`onChange`/`expandIcon`/`icon` could override Recursica's own computed state, made `variant` a real predefined union instead of a bare string, and formally supported a per-item `disabled` prop in both adapters.
  Also documented `children` across all Accordion sub-components in `RecursicaAccordionProps.ts`, including a new `RecursicaAccordionPanelProps` interface for the Panel.
- 106bc34: AssistiveElement: `assistiveVariant="error"` now defaults `role="alert"` in both adapters so
  error text is announced by assistive tech as it appears or changes (an explicit `role` still
  wins). Also (MUI only) closed a prop-contract conflict where native `error`/`component` could
  silently override Recursica's own computed values, added the missing `RecursicaOverStyled`
  wrapper, and hardened a CSS specificity tie against MUI's own `.Mui-error` color. Documented
  `children` in `RecursicaAssistiveElementProps.ts` and added implementation notes to both adapters.

### Patch Changes

- 106bc34: Autocomplete (MUI): fixed four bugs, all traced to `renderInput` discarding MUI's `InputProps` (dropping the `classes.inputRoot` className, the anchor ref, and adornment slots). Restored `InputProps` so the design-system border/padding actually applies instead of MUI's default underline chrome; wired `leftSection`/`rightSection` into `startAdornment`/`endAdornment` (previously destructured but never rendered, so icons never showed); and stopped coercing `error` to a boolean before the wrapper, which was discarding the error message string (ErrorState story showed no assistive text).
- 106bc34: Avatar (MUI): fixed `variant` being fed into MUI's native shape prop instead of a color treatment, making it a silent no-op. Also documented `children` in the shared prop types and added missing mui-adapter implementation notes.
- 106bc34: Checkbox (MUI): fixed the checkmark never appearing on click — `checked` was always
  forced onto MUI's native input even for plain uncontrolled usage (no `checked`/only
  `defaultChecked`), pinning it to a value that never updates after the initial render.
  Now only forced when grouped (CheckboxGroup owns state) or the caller explicitly passes
  `checked`, matching the existing `Switch` pattern. Also fixed the label rendering
  vertically offset from the checkbox (`.labelWrapper` needed `display: flex` to blockify
  the native inline `<label>`, mirroring Mantine's own wrapper) and the checkmark icon
  rendering off-center inside the box in both standalone Checkbox and CheckboxGroup
  (`.input` now centers its icon child directly).
- 106bc34: Disabled Checkbox/Switch's MUI-default click ripple (not present in Mantine) and made their description/error text mutually exclusive (error wins), matching the same fixes just made to Radio.
- 106bc34: Chip (MUI): fixed three visual bugs vs `mantine-adapter` — extra right padding on short-text chips (duplicate `min-width`/`max-width` applied on both `.root` and `.label`, now only on `.root`), delete/leading icon color and spacing leaking MUI's own default styles (fixed via CSS specificity match on `.leadingIcon`/`.removeIconWrapper`), and a missing icon-text gap on the leading icon (accidental blanket `margin: 0` collapsed it — restored `margin-right` for the gap, matching the selected-state check icon).
- 106bc34: FormControlWrapper (MUI): fixed ARIA wiring to match the Mantine adapter — a self-generated
  `id` fallback (via `useId`) now fires by default instead of only when a caller supplies their
  own `id`, and help/error text each get their own id (`aria-describedby`/`aria-errormessage`)
  instead of sharing one. Neither attribute is set if the child already has its own explicit
  value.
- 106bc34: Label (MUI): fixed focused descendant controls (e.g. a grouped Switch/Checkbox) bleeding MUI's default blue into the label text, mirroring the existing `.Mui-error` override with a matching `.Mui-focused` one.
- 106bc34: Label (MUI): fixed optional text rendering inline next to the label instead of on its own line — `innerLayout` now wraps and `optionalText` is forced onto a full-width row, matching `mantine-adapter`.
- 106bc34: Audited every component for the "spread after computed props" ordering bug (caller props silently overriding internal className/classes/icon/sx/onChange) and reordered spread-first in ~25 components. See COMPONENT_DEV_GUIDE.md §3.2 (adapter-common) for the rule.
- 106bc34: Removed leftover literal Mantine references from mui-adapter CSS/types (dead `:global(.mantine-*)` selectors, unused classes wiring, a stray `@mantine/core` type augmentation) and swapped a hardcoded Mantine red for the real error-text token in Radio/Checkbox/Switch.
- 106bc34: Radio/Checkbox/Switch description and error text now render through the shared `AssistiveElement` component instead of locally styled divs, removing the last hardcoded hex values (Mantine's default dimmed gray) from mui-adapter CSS.
- 106bc34: Fixed Radio rendering no visible circle (only the label) — `classes` was being read as `classNames` with Mantine-shaped slot names MUI doesn't support, so the circle's styling was silently dropped. Also fixed the label rendering vertically offset from the circle, disabled MUI's default click ripple, made description/error mutually exclusive (error wins), and reordered the props spread so it can no longer silently override the render-critical props placed after it.
- 106bc34: Fixed RadioGroup selection not updating in mui-adapter — its onChange was typed and wired as MUI's native `(event, value)`, but Mantine's RadioGroup (the cross-adapter source of truth) only ever calls back with `(value)`. Normalized the shared contract and mui-adapter's wiring to single-argument.
- 106bc34: Switch: attached `SwitchGroup` as the `Switch.Group` compound export (it existed standalone but was never attached), and tightened `RecursicaSwitchGroupProps` value types from `unknown[]` to `string[]`.
- 106bc34: Switch (MUI): `SwitchGroup` now actually controls its children via a `SwitchGroupContext` (same pattern as `Checkbox`/`CheckboxGroup`) — previously `value`/`defaultValue`/`onChange` were destructured and discarded, so grouped switches never checked or updated.
- 106bc34: SwitchGroup: fixed `side-by-side` layout always rendering as if stacked — the group was capped to the switch-item label's own 200px max-width, narrower than the mandatory 224px label column, guaranteeing a wrap.
- 106bc34: Switch (MUI): fixed track/thumb geometry, checked-state color and opacity, thumb icon, disabled-state opacity, the focus ring target/color, and a `classes`/`classNames` prop bug — bringing it to visual parity with `mantine-adapter`.
- 106bc34: Tabs (MUI): fixed missing `value` on `Tabs` (never read `TabContext`, so no tab was ever selected), the panel rendering beside instead of below the tab list, and dead `.Mui-selected`/`.panel` CSS selectors.
- Updated dependencies [106bc34]
- Updated dependencies [106bc34]
- Updated dependencies [106bc34]
- Updated dependencies [106bc34]
- Updated dependencies [106bc34]
  - @recursica/adapter-common@0.15.0

## 0.21.1

### Patch Changes

- 778151b: Bundle `@recursica/adapter-common`'s types into each adapter's published `.d.ts` (via `vite-plugin-dts`'s `rollupTypes` + `bundledPackages`). Previously the generated declaration files re-exported and referenced `@recursica/adapter-common` by bare package specifier, which meant consumers' TypeScript needed `@recursica/adapter-common` resolvable even though the runtime JS and CSS were already fully self-contained. No public API changes — type names and shapes are unchanged, they're just inlined now instead of imported from the dependency.

## 0.21.0

### Minor Changes

- 8322c0a: Updated Tree component

### Patch Changes

- Updated dependencies [8322c0a]
  - @recursica/adapter-common@0.14.0

## 0.20.0

### Minor Changes

- a4a45ff: Implement `TimePicker` (previously a stub) in both adapters, using `@mantine/dates`'s own `TimePicker` and `@mui/x-date-pickers`'s `TimePicker` respectively. Defaults to 12-hour format with a dedicated AM/PM selector (Recursica-specific); pass the new `hideAmPm` prop for a plain 24-hour input.

### Patch Changes

- Updated dependencies [a4a45ff]
  - @recursica/adapter-common@0.13.1

## 0.19.1

### Patch Changes

- 5c10166: Split shared contributor docs (`COMPONENT_DEV_GUIDE.md`, `COMPONENT_STORYBOOK_GUIDE.md`) into a canonical version in `adapter-common` plus thin per-adapter deltas, and publish `docs/PHILOSOPHY.md` to npm.

## 0.19.0

### Minor Changes

- 6e99afc: Versioned all for refresh
- dc583f5: Add the `Tree` component (mantine-adapter wraps `@mantine/core`'s `Tree`; mui-adapter wraps the new `@mui/x-tree-view` peer dependency). Adds shared `RecursicaTreeProps`/`RecursicaTreeNode` to adapter-common.

### Patch Changes

- c8b21dd: Fix broken/renamed CSS token references and wire up previously-unused tokens across ~30 components, using `@recursica/mantine-adapter` as the reference.
- Updated dependencies [560874f]
- Updated dependencies [6e99afc]
- Updated dependencies [560874f]
- Updated dependencies [dc583f5]
  - @recursica/official-release@2.7.0
  - @recursica/adapter-common@0.13.0

## 0.18.1

### Patch Changes

- 70ad4df: `RecursicaThemeProvider` now automatically wraps its children in a base `<Layer layer={0}>` by default (new `initLayer0` prop, defaults to `true`), so page-level surface/border/elevation CSS variables resolve out of the box instead of requiring an undocumented manual `<Layer layer={0}>` wrapper. Opt out with `initLayer0={false}` to place the base layer yourself. Also documented `Layer` and `RecursicaThemeProvider` (previously referenced by nearly every other component's USAGE.md but undocumented themselves) with dedicated USAGE.md pages and llms.txt entries in both adapters, and updated the shared Storybook theme decorator to opt out of the new default (each adapter's preview already places its own configurable per-story Layer).
- Updated dependencies [70ad4df]
  - @recursica/adapter-common@0.12.0

## 0.18.0

### Minor Changes

- c49adb9: Added a Grid component (Grid, Grid.Col) to both the mantine-adapter and mui-adapter, sharing RecursicaGridProps/RecursicaGridColProps from adapter-common so both adapters expose the exact same prop API. mantine-adapter wraps Mantine's native Grid/Grid.Col directly; mui-adapter hand-composes the same API from MUI's single merged Grid component, since MUI has no separate container/item split.

### Patch Changes

- Updated dependencies [c49adb9]
  - @recursica/adapter-common@0.11.0

## 0.17.0

### Minor Changes

- f52662b: Updated docs and layout. Added Table

## 0.16.0

### Minor Changes

- db7701f: Updated layout of docs and mcp

## 0.15.0

### Minor Changes

- e0f2fc5: Update to latest official version

### Patch Changes

- Updated dependencies [e0f2fc5]
  - @recursica/official-release@2.6.0

## 0.14.0

### Minor Changes

- 584208e: Updated official release

## 0.13.0

### Minor Changes

- c7051d2: Fixed official release and rev'd all package

### Patch Changes

- Updated dependencies [c7051d2]
  - @recursica/adapter-common@0.10.0
  - @recursica/official-release@2.3.0

## 0.12.0

### Minor Changes

- f4036cf: Updated official release and added Tree component

### Patch Changes

- f45006a: Fixed linting and typescript errors
- Updated dependencies [f4036cf]
- Updated dependencies [f4036cf]
- Updated dependencies [f45006a]
  - @recursica/official-release@2.2.0
  - @recursica/adapter-common@0.9.1

## 0.11.0

### Minor Changes

- 8a1ecc5: Updated overStyled and fixed exports

### Patch Changes

- Updated dependencies [8a1ecc5]
  - @recursica/adapter-common@0.9.0

## 0.10.0

### Minor Changes

- 2f237f7: Revised component props with integration issues

### Patch Changes

- Updated dependencies [2f237f7]
  - @recursica/adapter-common@0.8.0

## 0.9.1

### Patch Changes

- 8151cb1: Fixed export of adapter-common from adapters

## 0.9.0

### Minor Changes

- ccf7d19: Updated to cause a new version release

### Patch Changes

- Updated dependencies [ccf7d19]
  - @recursica/official-release@0.3.0

## 0.8.0

### Minor Changes

- 4329756: Added official release and update mcp

### Patch Changes

- 8897f92: Updated agent instructions for MCP
- 4329756: Initialize `@recursica/official-release` package to version and distribute design tokens, configure automatic postinstall copying logic, and integrate fallback setup checks.
- Updated dependencies [4329756]
- Updated dependencies [4329756]
  - @recursica/official-release@0.2.0

## 0.7.0

### Minor Changes

- 4031b12: Updated docs and finalized MCP

## 0.6.0

### Minor Changes

- a407c6f: More complete mui components
- 93df8e2: Added form components
- fe9d24a: Added adapter tester and updated adapters
- 93df8e2: Added form controls

## 0.5.0

### Minor Changes

- 0ead0d7: Updated with mui-adapter changes

## 0.4.0

### Minor Changes

- cdd7b9d: Added Loader and Button and uploaded Button loading state

## 0.3.0

### Minor Changes

- 3756d7b: Cleaned up stories and added layout stories to mui-adapter

## 0.2.0

### Minor Changes

- 72174fc: Add MUI adapter, reworked storybook for adapter switching

### Patch Changes

- 72174fc: Updated docs and README.md links

## 0.2.0

### Minor Changes

- 0f7ca8b: Scaffolding and Box component

## 0.0.1

### Patch Changes

- c6973c2: first publish
