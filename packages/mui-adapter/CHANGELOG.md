# @recursica/mui-adapter

## 0.37.0

### Minor Changes

- 786d870: Version bumped

## 0.36.0

### Minor Changes

- f618b38: Renamed the `Title` component to `Heading` (and `RecursicaTitleProps` to `RecursicaHeadingProps`) to match designers' semantic vocabulary. `Text` is unchanged. Breaking: update imports from `Title`/`TitleProps` to `Heading`/`HeadingProps`.

### Patch Changes

- Updated dependencies [f618b38]
  - @recursica/adapter-common@0.26.0

## 0.35.0

### Minor Changes

- ae939ef: Latest adapters and tester

### Patch Changes

- ae939ef: Fixed descender clipping (e.g. the "g" in a long label) on single-line ellipsis truncation across Accordion, AutoComplete/Autocomplete, Button, Dropdown, Modal, and Panel — switched `overflow: hidden` to `overflow: clip; overflow-clip-margin: 0.35em`.
- ae939ef: Added `text-wrap: balance` to `Text` and `Title` so wrapped multi-line text (headings and paragraphs) gets more even line lengths.

## 0.34.4

### Patch Changes

- d48149c: Chip's selected checkmark now overlays the leading icon instead of sitting to its left, matching MUI's native behavior (mui-adapter already did this; mantine-adapter now matches).

## 0.34.3

### Patch Changes

- d0e6275: Fixed stories to remove layer
- 662c591: Layout components (Flex, Stack, Group, Grid) no longer share a formal Recursica prop contract from `adapter-common` — removed `RecursicaFlexProps`/`RecursicaStackProps`/`RecursicaGroupProps`/`RecursicaGridProps`/`RecursicaGridColProps`. Each adapter's layout components now simply pass through the underlying kit's own props, plus `rec-*` spacing token support.

  - mantine-adapter: Flex/Stack/Group unchanged at the API level (Mantine's own props already matched). **Grid's `gap` prop reverts to Mantine's native `gutter`**; `Grid.Col`'s responsive breakpoint objects use Mantine's own `xs` (not the invented `base`) as the smallest key.
  - mui-adapter: Flex/Group keep their Mantine-shaped props (MUI has no native equivalent). **Stack now passes through MUI's own `spacing`/`alignItems`/`justifyContent` directly** (fixes a bug where passing native `alignItems`/`justifyContent` was silently clobbered). **Grid is rebuilt on MUI's own vocabulary** (`spacing`, `size`, `offset`, `order`, `xs`/`sm`/`md`/`lg`/`xl`) instead of mirroring Mantine's `gap`/`span`/`base`; container-level `grow` is dropped in favor of MUI's native per-column `size="grow"`.

- 4fdd1af: Wired vitest into `npm test` (unit tests for utils). Added a Button/kit CSS-isolation DOM test, run separately via `npm run test:dom` (not part of `npm test`/CI). Added empty test scaffolds per component.
- Updated dependencies [662c591]
  - @recursica/adapter-common@0.25.1

## 0.34.2

### Patch Changes

- df9d189: Fixed Button ignoring a constraining parent width — it now shrinks and truncates the label with an ellipsis instead of overflowing.

## 0.34.1

### Patch Changes

- f34665a: Modal close button now matches the Button component's styling (radius, padding, color tokens, hover/focus states, icon sizing).
- f34665a: Modal title now truncates with an ellipsis instead of wrapping when it's too long, and mantine-adapter's Modal width scales with content again instead of being pinned at 440px. Added an open-by-default `LongTitle` story to both adapters.

## 0.34.0

### Minor Changes

- 2369301: Add optional `maxHeight` prop to Menu, overriding the token-driven dropdown max-height with an explicit pixel value.

### Patch Changes

- Updated dependencies [2369301]
  - @recursica/adapter-common@0.25.0

## 0.33.0

### Minor Changes

- bc70636: Add optional `leadingIcon`/`supportingText` fields to Autocomplete/Dropdown `data` items, rendered inside the option row by default. Add a `wrapItemText` prop (default `false`) to wrap label/supportingText instead of truncating with an ellipsis.

### Patch Changes

- bc70636: Fix Dropdown/Autocomplete selected-option background highlight. mantine-adapter was keying off `data-combobox-selected` (Mantine's transient keyboard-nav highlight) instead of `data-combobox-active` (the real "matches current value" attribute), so the highlight only showed while arrow-key navigating. mui-adapter's Autocomplete had no selected-state rule at all; now keys off MUI's own `aria-selected`.
- Updated dependencies [bc70636]
  - @recursica/adapter-common@0.24.0

## 0.32.1

### Patch Changes

- 5369e5b: Hide the FileInput chip row's native horizontal scrollbar while keeping it scrollable.

## 0.32.0

### Minor Changes

- b7f76d8: Slider: added two-thumb range mode via a `[number, number]` value/onChange, fixed `trailingIcon` rendering after the numeric input instead of before it, and fixed marks (mantine) and mark labels (mantine, mui) rendering off Mantine/MUI internal defaults instead of recursica tokens, leaving marks vertically off-center and label spacing too tight.

### Patch Changes

- d8a0da1: Fix Tree's chevron button stealing DOM focus on click while `aria-hidden`, which browsers flag as an accessibility violation.
- Updated dependencies [b7f76d8]
  - @recursica/adapter-common@0.23.0

## 0.31.0

### Minor Changes

- e4759d1: Slider: fixed the raw numeric value duplicating next to the track when `tooltipLabel` is a formatter (now reuses the same formatter), added `minLabel`/`maxLabel` overrides for the track's end labels, and added a `trailingIcon` prop alongside the existing leading `icon`.

### Patch Changes

- Updated dependencies [e4759d1]
  - @recursica/adapter-common@0.22.0

## 0.30.0

### Minor Changes

- 0bb2dab: **Breaking:** `Chip`'s `onRemove` prop is renamed to `onDelete` in both adapters, matching MUI's own `onDelete` naming and removing the previous internal aliasing between the two. Update any `Chip` usage passing `onRemove` to `onDelete` — the behavior (rendering the remove/X icon and firing on click or Enter/Space) is unchanged. `FileInput` and `FileUpload`'s own public props are unaffected; they only consume `Chip` internally.
- 0bb2dab: Updated props with breaking changes

### Patch Changes

- Updated dependencies [0bb2dab]
- Updated dependencies [0bb2dab]
  - @recursica/adapter-common@0.21.0

## 0.29.0

### Minor Changes

- bcac5c7: Updated to latest css and fixed link
- 40832c5: Updated Table

### Patch Changes

- 8376651: Pin internal `@recursica/*` dependencies to real semver ranges instead of `*`. Published packages previously depended on internal packages (e.g. `@recursica/adapter-common`, `@recursica/official-release`, `@recursica/schemas`, `@recursica/recursica-postcss-vars`) with an unconstrained `*` version range, meaning a fresh install could pull in any future major version, including breaking changes. These now use `^<current-version>` ranges, which Changesets will keep in sync automatically via `updateInternalDependencies: "patch"` on future releases. No effect on local monorepo development — npm workspaces links sibling packages by name regardless of the declared range.
- Updated dependencies [bcac5c7]
- Updated dependencies [bcac5c7]
- Updated dependencies [40832c5]
  - @recursica/official-release@2.8.0
  - @recursica/adapter-common@0.20.0

## 0.28.0

### Minor Changes

- adab23c: Revised Dropwdown, Menu, Breadcrumb

## 0.27.0

### Minor Changes

- d171a96: Update revision to latest

### Patch Changes

- Updated dependencies [d171a96]
  - @recursica/adapter-common@0.19.0

## 0.26.0

### Minor Changes

- 015c809: Implemented DatePicker (was a non-functional placeholder stub). Wraps MUI X's `DatePicker` with the same token mapping as the mantine-adapter's DatePicker: tokenized field border/background/text, a default token-styled calendar popover (hover, today, disabled/outside days, selected-day fill, header nav/month-label as Recursica text buttons), default `MM/DD/YY` format, and a default calendar icon that opens the picker (overridable via `slots.openPickerIcon`). `value`/`defaultValue`/`onChange` use plain `Date`, matching the mantine-adapter's convention.

### Patch Changes

- 56e0d63: Remove all `recursica-ignore` exemption comments so the token analyzer report reflects true unused/unimplemented Figma variables. No runtime behavior change.

## 0.25.0

### Minor Changes

- e0f5643: Implement `TransferList` (dual listbox) in both adapters, replacing the "coming soon" stub. Composes `FormControlWrapper`, `TextField`, `Checkbox`/`CheckboxGroup`, `Badge`, and `Button` — supports controlled/uncontrolled `data`, per-item grouping, per-pane search, and `stacked`/`side-by-side` form layout.
- 2fb7069: Add `Popover` component (click-controlled dropdown with beak/arrow, composable `Popover.Target`/`Popover.Dropdown`), bringing mui-adapter in parity with mantine-adapter's Popover.
- 2fb7069: Fix `Popover`: gap now matches Mantine (Mui's built-in per-placement tooltip margin was stacking on top of our offset), and the beak now has a visible border matching the dropdown body. Fix `Button`: line-height now applies via `labelText` per size (matching Mantine) instead of being dropped from the small-size token.
- 2fb7069: Fix `SegmentedControl` height (MUI's default `ToggleButton` box model was stacking on top of the token-driven label height) and selected-state styling (`Mui-selected` wasn't wrapped in `:global()`, so CSS Modules silently dropped the selector).
  Also default to the first item selected when uncontrolled, matching mantine.
- 2fb7069: Fix `SegmentedControl` labels rendering all-caps in MUI (its `ToggleButton` uppercase default was leaking through an invalid text-transform token). Labels now match Mantine's original casing.
- 2fb7069: Fix `Slider`'s `Disabled` story (was passing `disabled: false` in both adapters). In `mui-adapter`, also fix the disabled track showing red instead of grey, make the thumb focus ring keyboard-only (no glow on click/drag) to match Mantine, render assistive text as a `<span>`, and align mark label color/position with Mantine (which now applies its own mark label color token too).
- 2fb7069: Fix `Stepper`: use MUI's `alternativeLabel` so horizontal labels center under the icon and the connector centers on it, render the completed check mark as our own token-colored glyph instead of MUI's default blue `CheckCircle` SVG, and draw the vertical connecting line as a stretch-aware rail so it reaches the next step's circle regardless of description height.
- 2fb7069: Fix `Tabs` showing a MUI click ripple that Mantine's tabs don't have. `Tab` now passes `disableRipple`.
- 2fb7069: Fix `Tabs`: `outline` variant's selected tab now shows a connected border box (matching Mantine) with no stray bottom border line. `default` variant no longer shifts sibling tabs when selecting one (a stray ripple element was being pulled into flex layout). `vertical` orientation no longer stretches the tablist to the full row width, and its divider now runs the full height with the selection indicator aligned on it instead of offset to the side.
- 2fb7069: Fix `TextArea`: error state border now uses the recursica error color (was never triggering in either adapter). MUI disabled background/border, focus ring color, and default height now match Mantine instead of MUI's own defaults.
- 2fb7069: Fix `Timeline`: rebuild `Timeline.Item` on Mui's `TimelineSeparator`/`TimelineDot`/`TimelineConnector`/`TimelineContent` primitives so the bullet marker, connecting line, active state, and bullet variants render (and left-align) like the Mantine adapter instead of not rendering at all.

### Patch Changes

- 1616144: Fix `FileInput`'s clear-all button: pressing Enter or Space while it was focused opened the native file picker instead of clearing the selection (a regression from switching the control to the shared `Button` component, which dropped the keydown handler the previous bespoke element had).
- 3ff5821: Fix `TransferList` checkboxes not toggling/showing checked state in either adapter (grouping-for-layout was silently overriding item selection). Add `readOnly` support and a `ReadOnly` story.
- Updated dependencies [e0f5643]
- Updated dependencies [1616144]
- Updated dependencies [3ff5821]
  - @recursica/adapter-common@0.18.0

## 0.24.0

### Minor Changes

- 3d75770: Implement the `FileInput` component (single-line, `TextField`-shaped file picker with a native drag-and-drop drop target, single- and multiple-file modes, and a trailing clear icon) in `mantine-adapter` and `mui-adapter`, replacing the "coming soon" stub, with a shared `RecursicaFileInputProps` contract in `adapter-common` reusing `FileUpload`'s `RecursicaFileUploadItem`/validation interface (`accept`/`maxSize`/`maxFiles`/`readOnly`). Also adds `FileInput` to `RECURSICA_COMPONENTS` and moves `mui-adapter`'s export of it into the standard `wrapComponent` set (it was previously exported unwrapped, alongside the polymorphic layout primitives, as a leftover from its stub form).

### Patch Changes

- b86ca2b: `FileInput` now renders every selected file as a removable `Chip` in a horizontally scrollable row, in both single- and multiple-file mode (previously single-file mode showed plain filename text with no remove affordance). The trailing clear-all control is now a real shared `Button` (icon-only, "text" variant) instead of a bespoke `<span role="button">`.
- Updated dependencies [3d75770]
- Updated dependencies [b86ca2b]
  - @recursica/adapter-common@0.17.0

## 0.23.0

### Minor Changes

- 1c317a3: Implement the `FileUpload` component (drag-and-drop dropzone, browse-button fallback, removable file-chip list) in `mantine-adapter` and `mui-adapter`, replacing the "coming soon" stub, with a shared `RecursicaFileUploadProps`/`RecursicaFileUploadItem` contract in `adapter-common`. Also fixes `mui-adapter`'s `Chip` component's public type to allow `children` (a pre-existing type-only gap; the component already accepted them at runtime).

### Patch Changes

- 1c317a3: `FileUpload` now surfaces a built-in error message ("File type not accepted", overridable via the new `invalidFileTypeMessage` prop) when a dropped/picked file doesn't match `accept`, shown through the standard assistive-text error slot instead of requiring the integrator to wire up `onFilesRejected` themselves. Also reverts `FileUpload`'s assistive/error rendering back to `FormControlWrapper` (file list renders above the assistive/error text again, matching every other form control).

  Fixes `Chip` clipping the descender (e.g. the "g" in "image.png") off long labels — `overflow: hidden` was clipping vertically as well as horizontally, cutting off glyph ink whenever the line-height token was tighter than the font's natural ascent+descent.

- 1c317a3: `FileUpload` now supports a `maxFiles` prop (with an overridable `maxFilesMessage`, defaulting to "Maximum of {maxFiles} files allowed") that rejects files past a total-count cap the same way `accept`/`maxSize` already do.

  Fixes `Chip` rendered without a real handler (`onRemove`/`onClick`/`onChange`) — such as `FileUpload`'s `readOnly` file list — still showing a pointer cursor on hover and picking up a phantom, un-styled keyboard Tab stop on its truncated label text. Both were general `Chip` bugs, not specific to `FileUpload`.

- 1c317a3: Fix `Button` showing the native browser focus outline instead of the recursica focus ring, and fix `Chip` losing its remove (X) icon behind an overflowing long label instead of truncating with an ellipsis. Adds optional `removeTabIndex`/`removeIconRef` props to `Chip` for building keyboard-navigable chip groups. Also fixes the remove icon's own focus ring rendering in the chip's neutral border color instead of the recursica focus-ring color, making it barely visible.
- Updated dependencies [1c317a3]
- Updated dependencies [1c317a3]
- Updated dependencies [1c317a3]
- Updated dependencies [1c317a3]
  - @recursica/adapter-common@0.16.0

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
