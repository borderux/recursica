# @recursica/adapter-common

## 0.28.2

### Patch Changes

- 46b123a: Breadcrumb now marks its last child `aria-current="page"` and, if it looks interactive (has `href`/`onClick`), strips both and drops it from the tab order — best-effort, not a guarantee for custom Link components with their own internal navigation. Backed by a CSS reset (no color/underline/pointer-events) and the current item now picks up Link's font-family. New shared `markCurrentPageItem` util in adapter-common. mui-adapter's story also gets parity with mantine-adapter's: the last crumb renders as plain text, not a `Link`.

## 0.28.1

### Patch Changes

- a104e8a: Removed the never-real `"md"` `labelSize` option (`RecursicaLabelProps`, `RecursicaFormControlLayoutProps`) and made `Accordion.Item`'s `value` required — both were already true in practice, now enforced by the type. `wrapComponent` also now guards ref-forwarding to only components that can accept one (class/forwardRef/memo), warning in dev instead of letting React's generic "function components cannot be given refs" warning fire blind.
- a104e8a: Removed `searchable` from `Dropdown`'s shared contract — not a supported feature (that's `AutoComplete`'s job). mantine-adapter now strips it at runtime like its other unsupported native props; mui-adapter never wired it up.

## 0.28.0

### Minor Changes

- cb3796a: Added an `animate` prop to `Loader` (default `true`) — set `false` to freeze its CSS animation for a deterministic render, e.g. a visual-regression snapshot. The `Static*` Loader stories now use it, and the animated `Default`/`LayerTwoOval` stories are excluded from adapter-tester's visual regression.

### Patch Changes

- cb3796a: Fixed `Table` currency columns so header and footer cells right-align to match value cells. `Table.Th`/`Table.Cell` header context now supports `variant="currency"`.
- cb3796a: Added `leftSection` support to `TimePicker` for an optional leading icon, matching `TextField`'s convention.

## 0.27.0

### Minor Changes

- c31d5ae: Added an `animate` prop to `Loader` (default `true`) — set `false` to freeze its CSS animation for a deterministic render, e.g. a visual-regression snapshot. The `Static*` Loader stories now use it, and the animated `Default`/`LayerTwoOval` stories are excluded from adapter-tester's visual regression.

### Patch Changes

- c31d5ae: Fixed `Table` currency columns so header and footer cells right-align to match value cells. `Table.Th`/`Table.Cell` header context now supports `variant="currency"`.
- c31d5ae: Added `leftSection` support to `TimePicker` for an optional leading icon, matching `TextField`'s convention.

## 0.26.0

### Minor Changes

- f618b38: Renamed the `Title` component to `Heading` (and `RecursicaTitleProps` to `RecursicaHeadingProps`) to match designers' semantic vocabulary. `Text` is unchanged. Breaking: update imports from `Title`/`TitleProps` to `Heading`/`HeadingProps`.

## 0.25.1

### Patch Changes

- 662c591: Layout components (Flex, Stack, Group, Grid) no longer share a formal Recursica prop contract from `adapter-common` — removed `RecursicaFlexProps`/`RecursicaStackProps`/`RecursicaGroupProps`/`RecursicaGridProps`/`RecursicaGridColProps`. Each adapter's layout components now simply pass through the underlying kit's own props, plus `rec-*` spacing token support.

  - mantine-adapter: Flex/Stack/Group unchanged at the API level (Mantine's own props already matched). **Grid's `gap` prop reverts to Mantine's native `gutter`**; `Grid.Col`'s responsive breakpoint objects use Mantine's own `xs` (not the invented `base`) as the smallest key.
  - mui-adapter: Flex/Group keep their Mantine-shaped props (MUI has no native equivalent). **Stack now passes through MUI's own `spacing`/`alignItems`/`justifyContent` directly** (fixes a bug where passing native `alignItems`/`justifyContent` was silently clobbered). **Grid is rebuilt on MUI's own vocabulary** (`spacing`, `size`, `offset`, `order`, `xs`/`sm`/`md`/`lg`/`xl`) instead of mirroring Mantine's `gap`/`span`/`base`; container-level `grow` is dropped in favor of MUI's native per-column `size="grow"`.

## 0.25.0

### Minor Changes

- 2369301: Add optional `maxHeight` prop to Menu, overriding the token-driven dropdown max-height with an explicit pixel value.

## 0.24.0

### Minor Changes

- bc70636: Add optional `leadingIcon`/`supportingText` fields to Autocomplete/Dropdown `data` items, rendered inside the option row by default. Add a `wrapItemText` prop (default `false`) to wrap label/supportingText instead of truncating with an ellipsis.

## 0.23.0

### Minor Changes

- b7f76d8: Slider: added two-thumb range mode via a `[number, number]` value/onChange, fixed `trailingIcon` rendering after the numeric input instead of before it, and fixed marks (mantine) and mark labels (mantine, mui) rendering off Mantine/MUI internal defaults instead of recursica tokens, leaving marks vertically off-center and label spacing too tight.

## 0.22.0

### Minor Changes

- e4759d1: Slider: fixed the raw numeric value duplicating next to the track when `tooltipLabel` is a formatter (now reuses the same formatter), added `minLabel`/`maxLabel` overrides for the track's end labels, and added a `trailingIcon` prop alongside the existing leading `icon`.

## 0.21.0

### Minor Changes

- 0bb2dab: **Breaking:** `Chip`'s `onRemove` prop is renamed to `onDelete` in both adapters, matching MUI's own `onDelete` naming and removing the previous internal aliasing between the two. Update any `Chip` usage passing `onRemove` to `onDelete` — the behavior (rendering the remove/X icon and firing on click or Enter/Space) is unchanged. `FileInput` and `FileUpload`'s own public props are unaffected; they only consume `Chip` internally.
- 0bb2dab: Updated props with breaking changes

## 0.20.0

### Minor Changes

- 40832c5: Updated Table

## 0.19.0

### Minor Changes

- d171a96: Update revision to latest

## 0.18.0

### Minor Changes

- e0f5643: Implement `TransferList` (dual listbox) in both adapters, replacing the "coming soon" stub. Composes `FormControlWrapper`, `TextField`, `Checkbox`/`CheckboxGroup`, `Badge`, and `Button` — supports controlled/uncontrolled `data`, per-item grouping, per-pane search, and `stacked`/`side-by-side` form layout.

### Patch Changes

- 1616144: Add `FileUpload`, `Tree`, `CheckboxGroup`, `Box`, and `Typography` to `RECURSICA_COMPONENTS` — all are real, shipped components that were missing from the registry.
- 3ff5821: Fix `TransferList` checkboxes not toggling/showing checked state in either adapter (grouping-for-layout was silently overriding item selection). Add `readOnly` support and a `ReadOnly` story.

## 0.17.0

### Minor Changes

- 3d75770: Implement the `FileInput` component (single-line, `TextField`-shaped file picker with a native drag-and-drop drop target, single- and multiple-file modes, and a trailing clear icon) in `mantine-adapter` and `mui-adapter`, replacing the "coming soon" stub, with a shared `RecursicaFileInputProps` contract in `adapter-common` reusing `FileUpload`'s `RecursicaFileUploadItem`/validation interface (`accept`/`maxSize`/`maxFiles`/`readOnly`). Also adds `FileInput` to `RECURSICA_COMPONENTS` and moves `mui-adapter`'s export of it into the standard `wrapComponent` set (it was previously exported unwrapped, alongside the polymorphic layout primitives, as a leftover from its stub form).

### Patch Changes

- b86ca2b: `FileInput` now renders every selected file as a removable `Chip` in a horizontally scrollable row, in both single- and multiple-file mode (previously single-file mode showed plain filename text with no remove affordance). The trailing clear-all control is now a real shared `Button` (icon-only, "text" variant) instead of a bespoke `<span role="button">`.

## 0.16.0

### Minor Changes

- 1c317a3: Implement the `FileUpload` component (drag-and-drop dropzone, browse-button fallback, removable file-chip list) in `mantine-adapter` and `mui-adapter`, replacing the "coming soon" stub, with a shared `RecursicaFileUploadProps`/`RecursicaFileUploadItem` contract in `adapter-common`. Also fixes `mui-adapter`'s `Chip` component's public type to allow `children` (a pre-existing type-only gap; the component already accepted them at runtime).
- 1c317a3: `FileUpload` now surfaces a built-in error message ("File type not accepted", overridable via the new `invalidFileTypeMessage` prop) when a dropped/picked file doesn't match `accept`, shown through the standard assistive-text error slot instead of requiring the integrator to wire up `onFilesRejected` themselves. Also reverts `FileUpload`'s assistive/error rendering back to `FormControlWrapper` (file list renders above the assistive/error text again, matching every other form control).

  Fixes `Chip` clipping the descender (e.g. the "g" in "image.png") off long labels — `overflow: hidden` was clipping vertically as well as horizontally, cutting off glyph ink whenever the line-height token was tighter than the font's natural ascent+descent.

- 1c317a3: `FileUpload` now supports a `maxFiles` prop (with an overridable `maxFilesMessage`, defaulting to "Maximum of {maxFiles} files allowed") that rejects files past a total-count cap the same way `accept`/`maxSize` already do.

  Fixes `Chip` rendered without a real handler (`onRemove`/`onClick`/`onChange`) — such as `FileUpload`'s `readOnly` file list — still showing a pointer cursor on hover and picking up a phantom, un-styled keyboard Tab stop on its truncated label text. Both were general `Chip` bugs, not specific to `FileUpload`.

- 1c317a3: Fix `Button` showing the native browser focus outline instead of the recursica focus ring, and fix `Chip` losing its remove (X) icon behind an overflowing long label instead of truncating with an ellipsis. Adds optional `removeTabIndex`/`removeIconRef` props to `Chip` for building keyboard-navigable chip groups. Also fixes the remove icon's own focus ring rendering in the chip's neutral border color instead of the recursica focus-ring color, making it barely visible.

## 0.15.0

### Minor Changes

- 106bc34: Accordion: closed silent prop-contract conflicts where native `expanded`/`onChange`/`expandIcon`/`icon` could override Recursica's own computed state, made `variant` a real predefined union instead of a bare string, and formally supported a per-item `disabled` prop in both adapters.
  Also documented `children` across all Accordion sub-components in `RecursicaAccordionProps.ts`, including a new `RecursicaAccordionPanelProps` interface for the Panel.

### Patch Changes

- 106bc34: AssistiveElement: `assistiveVariant="error"` now defaults `role="alert"` in both adapters so
  error text is announced by assistive tech as it appears or changes (an explicit `role` still
  wins). Also (MUI only) closed a prop-contract conflict where native `error`/`component` could
  silently override Recursica's own computed values, added the missing `RecursicaOverStyled`
  wrapper, and hardened a CSS specificity tie against MUI's own `.Mui-error` color. Documented
  `children` in `RecursicaAssistiveElementProps.ts` and added implementation notes to both adapters.
- 106bc34: Avatar (MUI): fixed `variant` being fed into MUI's native shape prop instead of a color treatment, making it a silent no-op. Also documented `children` in the shared prop types and added missing mui-adapter implementation notes.
- 106bc34: Fixed RadioGroup selection not updating in mui-adapter — its onChange was typed and wired as MUI's native `(event, value)`, but Mantine's RadioGroup (the cross-adapter source of truth) only ever calls back with `(value)`. Normalized the shared contract and mui-adapter's wiring to single-argument.
- 106bc34: Switch: attached `SwitchGroup` as the `Switch.Group` compound export (it existed standalone but was never attached), and tightened `RecursicaSwitchGroupProps` value types from `unknown[]` to `string[]`.

## 0.14.0

### Minor Changes

- 8322c0a: Updated Tree component

## 0.13.1

### Patch Changes

- a4a45ff: Implement `TimePicker` (previously a stub) in both adapters, using `@mantine/dates`'s own `TimePicker` and `@mui/x-date-pickers`'s `TimePicker` respectively. Defaults to 12-hour format with a dedicated AM/PM selector (Recursica-specific); pass the new `hideAmPm` prop for a plain 24-hour input.

## 0.13.0

### Minor Changes

- dc583f5: Add the `Tree` component (mantine-adapter wraps `@mantine/core`'s `Tree`; mui-adapter wraps the new `@mui/x-tree-view` peer dependency). Adds shared `RecursicaTreeProps`/`RecursicaTreeNode` to adapter-common.

## 0.12.0

### Minor Changes

- 70ad4df: `RecursicaThemeProvider` now automatically wraps its children in a base `<Layer layer={0}>` by default (new `initLayer0` prop, defaults to `true`), so page-level surface/border/elevation CSS variables resolve out of the box instead of requiring an undocumented manual `<Layer layer={0}>` wrapper. Opt out with `initLayer0={false}` to place the base layer yourself. Also documented `Layer` and `RecursicaThemeProvider` (previously referenced by nearly every other component's USAGE.md but undocumented themselves) with dedicated USAGE.md pages and llms.txt entries in both adapters, and updated the shared Storybook theme decorator to opt out of the new default (each adapter's preview already places its own configurable per-story Layer).

## 0.11.0

### Minor Changes

- c49adb9: Added a Grid component (Grid, Grid.Col) to both the mantine-adapter and mui-adapter, sharing RecursicaGridProps/RecursicaGridColProps from adapter-common so both adapters expose the exact same prop API. mantine-adapter wraps Mantine's native Grid/Grid.Col directly; mui-adapter hand-composes the same API from MUI's single merged Grid component, since MUI has no separate container/item split.

## 0.10.0

### Minor Changes

- c7051d2: Fixed official release and rev'd all package

## 0.9.1

### Patch Changes

- f45006a: Fixed linting and typescript errors

## 0.9.0

### Minor Changes

- 8a1ecc5: Updated overStyled and fixed exports

## 0.8.0

### Minor Changes

- 2f237f7: Revised component props with integration issues

## 0.7.0

### Minor Changes

- 4031b12: Updated docs and finalized MCP

## 0.6.0

### Minor Changes

- 72174fc: Add MUI adapter, reworked storybook for adapter switching

## 0.5.1

### Patch Changes

- 13b567a: Updated all documentation for better README and AGENT.md

## 0.5.0

### Minor Changes

- 7898170: Updated read-only states for all components

## 0.4.0

### Minor Changes

- a4cf78b: Updates storybook controls and added chip

## 0.3.0

### Minor Changes

- 9e31278: Added more mantine adapter components

## 0.2.0

### Minor Changes

- [#347](https://github.com/borderux/recursica/pull/347) [`eb5561b`](https://github.com/borderux/recursica/commit/eb5561bb27947938d60e5f4ce00b70e06a6264e5) Thanks [@mlmassey](https://github.com/mlmassey)! - Restructured and moved new adapter-common package
