# Recursica vs. MUI Component Map

_Last updated: 2026-09-02_

<!-- recursica:meta adapter="mui" -->

## What this document is

This is the **adapter status document** for `@recursica/mui-adapter` — the source of truth for
how this adapter's Recursica components relate to the underlying MUI UI kit (`@mui/material`,
plus its `@mui/lab`/`@mui/x-date-pickers`/`@mui/x-tree-view` peers) it wraps. It exists so
engineers and [Recursica.com](https://recursica.com)'s automated pipeline share one structured
answer to four questions:

1. Which Recursica components map directly onto an MUI component, and what that mapping is.
2. Which Recursica components have no usable MUI equivalent and are hand-built instead.
3. Which MUI components/exports this adapter styles internally with Recursica design tokens
   without exposing them as a first-class Recursica component.
4. Which MUI components have no Recursica equivalent at all, and why.

[Recursica.com](https://recursica.com) parses this file directly to render this adapter's
component-coverage page — it should be kept current whenever this adapter's component set changes.

## Format, for parsers

This file is both human-readable Markdown and machine-parsable. Everything a parser needs is
delimited by HTML comments, which render invisibly wherever this file is viewed as Markdown
(GitHub, Storybook docs, recursica.com, etc.):

- **Document metadata**: a single `<!-- recursica:meta adapter="..." -->` comment right below the
  title, carrying `adapter` (this adapter's short name). Which kit(s) it wraps and their exact
  versions aren't repeated here — that's already in this repo's own `package.json` dependencies,
  and the kit name is in the title and prose below; duplicating it in the meta comment would just
  be another place for it to drift out of sync.
- **Structured tables**: each of the 4 categories above is wrapped in a matched pair of markers —

  ```
  <!-- recursica:table id="..." -->
  | Column A | Column B |
  |---|---|
  | ... | ... |
  <!-- /recursica:table -->
  ```

  `id` is always exactly one of 4 fixed values, each present exactly once, in any order:
  `direct-mappings`, `hand-built`, `internal-only`, `unsupported`. Every table is exactly 2
  columns — a component name, then a description — standard GFM table syntax (header row, `---`
  separator row, one data row per line). Extract a table by matching its marker pair and feeding
  the content between them to any GFM table parser.

- **Everything else** — prose, headings, footnotes, "near-miss"/"not in this category" callouts —
  is human context only, not structured data. A parser should ignore anything outside the marker
  pairs.

This shape is enforced automatically: `npm run validate-adapter-status` (wired into both this
repo's pre-commit hook and CI) fails if the meta comment, table ids, or table shape don't match
this spec.

## Methodology

Source: `@recursica/mui-adapter` (`src/components/*`) cross-checked against the actual
`@mui/material@7.3.11` package contents (the hoisted version resolving the adapter's
`"@mui/material": "^7.3.0"` peer dependency), plus the adapter's three optional MUI peer
packages where individual components pull from them: `@mui/lab@7.0.1-beta.25` (Tabs, Timeline),
`@mui/x-date-pickers@9.11.0` (DatePicker, TimePicker), and `@mui/x-tree-view@9.11.0` (Tree).
`@mui/icons-material` is **not** a dependency at all — every icon in this adapter is a
hand-drawn inline SVG, not an MUI icon import.

Every mapping below was confirmed by reading each component's actual `.tsx` source and import
statements (not single-line grep — files were read in full, since several components compose
MUI pieces deep in the JSX body, not just in the top import block), cross-checked against
`@mui/material`'s real `index.js` export list. `Layer` and `RecursicaThemeProvider` are excluded
below — both are defined once in `@recursica/adapter-common` and merely re-exported here with no
MUI-specific implementation of their own.

---

## 1. Recursica components that map directly to a MUI component

<!-- recursica:table id="direct-mappings" -->

| Recursica component | MUI equivalent                                                                                                                                                                                                                                                                                                                                                 |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accordion           | `Accordion` + `AccordionSummary` + `AccordionDetails` (the outer multi-panel group/context is hand-built — MUI's own `Accordion` is a single controlled item with no group concept)                                                                                                                                                                            |
| AssistiveElement    | `FormHelperText`                                                                                                                                                                                                                                                                                                                                               |
| AutoComplete        | `Autocomplete` (+ `TextField` used internally as the `renderInput` render-prop)                                                                                                                                                                                                                                                                                |
| Avatar              | `Avatar`                                                                                                                                                                                                                                                                                                                                                       |
| Badge               | `Badge`                                                                                                                                                                                                                                                                                                                                                        |
| Breadcrumb          | `Breadcrumbs`                                                                                                                                                                                                                                                                                                                                                  |
| Button              | `Button`                                                                                                                                                                                                                                                                                                                                                       |
| Card                | `Card` (MUI's `Paper`-based component) — but `Card.Section`/`Header`/`Footer`/`Content` sub-parts are hand-built `<div>`s, not MUI Card sub-components                                                                                                                                                                                                         |
| Checkbox            | `Checkbox` (+ `FormGroup` for `Checkbox.Group`)                                                                                                                                                                                                                                                                                                                |
| Chip                | `Chip`                                                                                                                                                                                                                                                                                                                                                         |
| Container           | `Container`                                                                                                                                                                                                                                                                                                                                                    |
| DatePicker          | `@mui/x-date-pickers`' `DatePicker`, required to run inside its `LocalizationProvider`/`AdapterDayjs`                                                                                                                                                                                                                                                          |
| Dropdown            | `Select` (+ `MenuItem` for the option list)                                                                                                                                                                                                                                                                                                                    |
| Flex                | `Box` (rendered with `display="flex"`; MUI has no dedicated Flex component, so Mantine's `Flex` prop shape — `gap`/`direction`/`align`/`justify`/`wrap` — is recreated on top of `Box`)                                                                                                                                                                        |
| FormControlWrapper  | `FormControl` (composes Recursica's own `Label`/`AssistiveElement`/`FormControlLayout` inside it)                                                                                                                                                                                                                                                              |
| Grid (+ GridCol)    | `Grid` (MUI's unified flexbox-based Grid; split into a `Grid` wrapper that always renders `container` and a `GridCol` wrapper for items)                                                                                                                                                                                                                       |
| Group               | `Stack` (forced to `direction="row"`; MUI has no native `Group`, so this recreates Mantine's `Group` shape on top of `Stack`)                                                                                                                                                                                                                                  |
| Heading             | wraps Recursica's own `Typography` wrapper (which itself wraps MUI `Typography`), rendered as `h1`–`h6` per `order`                                                                                                                                                                                                                                            |
| HoverCard           | `Tooltip`, repurposed with `openOnHover` semantics — see note below                                                                                                                                                                                                                                                                                            |
| Label               | `InputLabel` (forced `shrink={true}`)                                                                                                                                                                                                                                                                                                                          |
| Link                | `Link`                                                                                                                                                                                                                                                                                                                                                         |
| Menu                | `Menu` + `MenuItem` + `Divider` (exposed as `Menu`, `MenuItem`, `MenuDivider`)                                                                                                                                                                                                                                                                                 |
| Modal               | `Dialog` + `DialogTitle` + `DialogContent` + `DialogActions` + `IconButton` (close button) — note MUI's real low-level `Modal` primitive is _not_ what Recursica's `Modal` wraps                                                                                                                                                                               |
| NumberInput         | `InputBase` (MUI has no dedicated numeric-input component; numeric keystroke filtering is hand-rolled on top of the generic input primitive)                                                                                                                                                                                                                   |
| Pagination          | `Pagination` + `PaginationItem` (custom `renderItem` swaps in Recursica's own nav icons)                                                                                                                                                                                                                                                                       |
| Panel               | `Drawer` + `IconButton` (close button); `Panel.Footer` is hand-built, MUI Drawer has no footer slot                                                                                                                                                                                                                                                            |
| Popover             | `Tooltip`, repurposed in click-controlled mode — **not** MUI's real `Popover` component (see note below)                                                                                                                                                                                                                                                       |
| Radio               | `Radio` (+ `RadioGroup` for `Radio.Group`)                                                                                                                                                                                                                                                                                                                     |
| SegmentedControl    | `ToggleButtonGroup` + `ToggleButton` (forced `exclusive`)                                                                                                                                                                                                                                                                                                      |
| Slider              | `Slider`                                                                                                                                                                                                                                                                                                                                                       |
| Stack               | `Stack` (thin, near-passthrough wrapper)                                                                                                                                                                                                                                                                                                                       |
| Stepper             | `Stepper` + `Step` + `StepLabel` + `StepButton` + `StepConnector`                                                                                                                                                                                                                                                                                              |
| Switch              | `Switch` (+ `FormGroup` for `Switch.Group`)                                                                                                                                                                                                                                                                                                                    |
| Table               | `Table` + `TableBody` + `TableCell` + `TableContainer` + `TableHead` + `TableRow` + `TableFooter` + `TableSortLabel` — a genuine `@mui/material` Table composition, not hand-built HTML                                                                                                                                                                        |
| Tabs                | `Tabs` + `Tab` (+ `@mui/lab`'s `TabPanel` — a notable deep dependency on `@mui/lab` rather than `@mui/material`)                                                                                                                                                                                                                                               |
| Text                | wraps Recursica's own `Typography` wrapper, which wraps MUI `Typography` directly                                                                                                                                                                                                                                                                              |
| TextArea            | `TextField` (forced `multiline` + `variant="standard"`) — despite the name, this is MUI's real `TextField`, not a native `<textarea>`                                                                                                                                                                                                                          |
| TextField           | `InputBase` — despite the name, this does **not** wrap MUI's real `TextField` (see note below)                                                                                                                                                                                                                                                                 |
| TimePicker          | `@mui/x-date-pickers`' `TimePicker` (in `LocalizationProvider`/`AdapterDayjs`) + Recursica's internal `BareDropdown` for the AM/PM segment; MUI's native popup picker button is suppressed entirely (`slots={{ openPickerButton: () => null }}`)                                                                                                               |
| Timeline            | `@mui/lab`'s `Timeline` + `TimelineItem` + `TimelineSeparator` + `TimelineDot` + `TimelineConnector` + `TimelineContent` — all from `@mui/lab`, not `@mui/material`                                                                                                                                                                                            |
| Toast               | `Alert` + `AlertTitle` + `IconButton` — **not** MUI's `Snackbar`/`SnackbarContent` (see note below)                                                                                                                                                                                                                                                            |
| Tooltip             | `Tooltip`                                                                                                                                                                                                                                                                                                                                                      |
| Tree                | `@mui/x-tree-view`'s `RichTreeView`, with a fully custom `slots.item` renderer built from MUI X's headless primitives (`useTreeItem`, `TreeItemProvider`, `TreeItemRoot`, `TreeItemContent`, `TreeItemIconContainer`, `TreeItemIcon`, `TreeItemLabel`, `TreeItemGroupTransition`) — genuine composition on real MUI X building blocks, not a from-scratch tree |
| Typography          | `Typography`                                                                                                                                                                                                                                                                                                                                                   |

<!-- /recursica:table -->

**Naming-mismatch notes worth flagging explicitly** (confirmed by reading source, not guessable from names):

- **Recursica's `TextField` does not wrap MUI's `TextField`.** It wraps the lower-level
  `InputBase` directly. Meanwhile MUI's real `TextField` component _is_ used elsewhere in the
  adapter — internally, inside `AutoComplete`'s `renderInput` (see §3).
- **Recursica's `Popover` and `HoverCard` both wrap MUI's `Tooltip`**, just in two different
  interaction modes (click-controlled vs. hover-controlled). Neither wraps MUI's real `Popover`
  component, which goes entirely unused by this adapter (see §4).
- **Recursica's `Toast` wraps MUI's `Alert`**, not MUI's `Snackbar`/`SnackbarContent` (the
  components MUI itself designates for toast-style notifications). `Snackbar` is unused (§4).
- **Recursica's `Modal` wraps MUI's `Dialog`**, not MUI's lower-level `Modal` primitive that
  `Dialog` itself is built on. The low-level `Modal` export is unused directly (§4).

---

## 2. Recursica components with no usable MUI equivalent (hand-built)

These have no MUI component to wrap at all (verified: no `@mui/material`/`@mui/lab`/`@mui/x-*`
import of any kind in the file), or only use an MUI primitive (`Box`) purely for generic layout
styling rather than as a functional widget:

<!-- recursica:table id="hand-built" -->

| Recursica component | Why                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FileInput           | No MUI file-upload/dropzone component with an externally-controlled `files` contract; hand-built from a plain `<div role="button">` with native drag/drop handlers and a hidden native `<input type="file">`, composed from Recursica's own `Button`/`Chip`/`FormControlWrapper`. Zero `@mui/material` imports.                                                                                                                 |
| FileUpload          | Same hand-built dropzone pattern and same rationale as FileInput — no MUI file-upload component to lean on.                                                                                                                                                                                                                                                                                                                     |
| FormControlLayout   | Recursica-specific label/field/assistive-text two-column composition primitive; purely `<div>`s + CSS Modules, no MUI concept matches this.                                                                                                                                                                                                                                                                                     |
| Loader              | No MUI spinner is used at all (not even `CircularProgress`) — entirely hand-built from a `<span>` driven by `data-variant`/`data-size` CSS attributes; "bars"/"dots" variants render plain `<span>` children for CSS-driven animation.                                                                                                                                                                                          |
| ReadOnlyField       | No MUI read-only-value/read-only-branching primitive exists. Root renders a plain `<p>`; sibling files (`ReadOnlyBooleanField`, `ReadOnlySwitchField`, `ReadOnlyTextField`) only import MUI's `Box` for generic flex layout (`component="span"`/`"p"`), not as a functional control. `WithReadOnlyWrapper` (the active/read-only dispatcher used by NumberInput, Radio.Group, Slider, Switch.Group, etc.) is likewise MUI-free. |
| TransferList        | No MUI dual-list-box component. Hand-built from raw `<div>`s, composed entirely from Recursica's own `Badge`/`Button`/`TextField`/`Checkbox`/`Checkbox.Group` (any MUI usage is inherited indirectly through those). Zero direct `@mui/material` imports — the clearest "no MUI at all" case in the adapter.                                                                                                                    |

<!-- /recursica:table -->

---

## 3. Additional MUI components/exports that this adapter styles/themes with Recursica tokens but does NOT expose as a first-class Recursica component

Used as internal implementation details of another Recursica component — never exposed as a
standalone Recursica component in their own right:

<!-- recursica:table id="internal-only" -->

| MUI component                                                                                                                                                                                                                              | Notes                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `IconButton`                                                                                                                                                                                                                               | Powers the close button inside `Modal`, `Panel`, and `Toast`; no standalone Recursica `IconButton`.                                                                                                                                 |
| `MenuItem`                                                                                                                                                                                                                                 | Beyond its role in `Menu`'s own composition (§1), reused a second, independent time inside `Dropdown`/`BareDropdown` to render `Select`'s option list.                                                                              |
| `TextField` (the real MUI component)                                                                                                                                                                                                       | Used only as the `renderInput` render-prop inside `AutoComplete`. Ironically, the Recursica component literally named `TextField` doesn't use it (see naming-mismatch note in §1).                                                  |
| `Box`                                                                                                                                                                                                                                      | Beyond being the direct basis of `Flex` (§1), also used purely as a generic layout `<span>`/`<p>` substitute inside `ReadOnlyBooleanField`/`ReadOnlySwitchField`/`ReadOnlyTextField`.                                               |
| `Popper` (via `slotProps.popper`)                                                                                                                                                                                                          | `HoverCard`, `Popover`, `AutoComplete`, and `Dropdown` all configure Popper-level positioning (margins, modifiers) through `slotProps.popper` on their host component; `Popper` itself is never imported as a standalone component. |
| `@mui/x-date-pickers`' `LocalizationProvider` + `AdapterDayjs`                                                                                                                                                                             | Required low-level infrastructure wrapping `DatePicker` and `TimePicker`; not exposed as a Recursica component.                                                                                                                     |
| `@mui/x-tree-view` headless primitives (`useTreeItem`, `useTreeItemModel`, `useTreeItemUtils`, `TreeItemProvider`, `TreeItemRoot`, `TreeItemContent`, `TreeItemIconContainer`, `TreeItemGroupTransition`, `TreeItemLabel`, `TreeItemIcon`) | Power `Tree`'s custom `slots.item` renderer internally; only `RichTreeView` itself is the "top-level" mapped export in §1.                                                                                                          |

<!-- /recursica:table -->

---

## 4. MUI components with no Recursica equivalent

Widget-level, user-facing exports in `@mui/material@7.3.11`'s public surface
(`index.js`'s `_exportNames`) that nothing in Recursica's component set maps to at all — either
because no Recursica component covers that use case, or because the closest-sounding Recursica
component was confirmed (by reading its source) to wrap something else entirely. Pure
utility/hook exports (`colors`, `useMediaQuery`, `usePagination`, `useScrollTrigger`,
`useAutocomplete`, `GlobalStyles`, `unstable_composeClasses`, `generateUtilityClass(es)`,
`Unstable_TrapFocus`, `InitColorSchemeScript`, `darkScrollbar`) are excluded as non-components.

<!-- recursica:table id="unsupported" -->

| MUI component                                                                                                             | Why                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AccordionActions                                                                                                          | No Recursica accordion action-row sub-component.                                                                                                                                                                             |
| AppBar                                                                                                                    | No top-app-bar/navbar component.                                                                                                                                                                                             |
| AvatarGroup                                                                                                               | No avatar-stacking group component.                                                                                                                                                                                          |
| Backdrop                                                                                                                  | No standalone backdrop; `Dialog`/`Drawer`/`Tooltip`-as-popover each roll their own overlay handling internally.                                                                                                              |
| BottomNavigation / BottomNavigationAction                                                                                 | No mobile bottom-nav component.                                                                                                                                                                                              |
| ButtonBase                                                                                                                | No generic "unstyled clickable" primitive exposed; `Button` only covers the fully-styled case.                                                                                                                               |
| ButtonGroup                                                                                                               | No button-group/toolbar-row component distinct from `SegmentedControl`.                                                                                                                                                      |
| CardActionArea / CardHeader / CardMedia                                                                                   | `Card`'s own sub-parts are hand-built `<div>`s (§1); these real MUI Card sub-components are unused.                                                                                                                          |
| CircularProgress                                                                                                          | Unused; `Loader` is entirely hand-built CSS with no MUI component underneath despite the conceptual overlap.                                                                                                                 |
| ClickAwayListener                                                                                                         | `Popover`/`HoverCard` implement their own manual `mousedown` listeners instead of using this MUI utility component.                                                                                                          |
| Collapse                                                                                                                  | Not imported/exposed as a standalone animation primitive.                                                                                                                                                                    |
| CssBaseline / ScopedCssBaseline                                                                                           | Global CSS-reset components; explicitly the integrating application's responsibility (see `SETUP.md`), not wrapped by this adapter.                                                                                          |
| Divider (standalone)                                                                                                      | Only reachable indirectly as `MenuDivider` inside `Menu`; no general-purpose Recursica `Divider` for page content.                                                                                                           |
| Fab                                                                                                                       | No floating action button component.                                                                                                                                                                                         |
| Fade / Grow / Slide / Zoom                                                                                                | MUI's transition-wrapper components; not imported or exposed as reusable animation primitives anywhere in the adapter.                                                                                                       |
| FilledInput / Input / OutlinedInput                                                                                       | MUI's other `TextField`-variant input shells; the adapter standardized on the lowest-level `InputBase` only (used by `TextField` and `NumberInput`).                                                                         |
| FormControlLabel                                                                                                          | Unused; `Checkbox`/`Radio`/`Switch` build their own label/description markup by hand instead of using this MUI wrapper.                                                                                                      |
| FormLabel                                                                                                                 | Unused; `Label` wraps `InputLabel`, not `FormLabel`.                                                                                                                                                                         |
| GridLegacy                                                                                                                | MUI's legacy pre-CSS-Grid `Grid` implementation; superseded by `Grid`, not used.                                                                                                                                             |
| Icon (ligature-font icon component)                                                                                       | Unused; combined with the fact `@mui/icons-material` isn't even a dependency, every icon in this adapter is a hand-drawn inline SVG.                                                                                         |
| ImageList / ImageListItem / ImageListItemBar                                                                              | No image-gallery/grid component.                                                                                                                                                                                             |
| InputAdornment                                                                                                            | Unused; components with leading/trailing icon slots (`AutoComplete`, `TextArea`) build their own adornment markup rather than importing this MUI helper.                                                                     |
| List / ListItem / ListItemAvatar / ListItemButton / ListItemIcon / ListItemSecondaryAction / ListItemText / ListSubheader | No Recursica List component family at all.                                                                                                                                                                                   |
| MenuList                                                                                                                  | `Menu`'s item list relies on MUI `Menu`'s own default list behavior, not a separately-imported `MenuList`.                                                                                                                   |
| MobileStepper                                                                                                             | No equivalent; `Stepper` only covers the linear/alternative-label desktop pattern.                                                                                                                                           |
| Modal (the low-level primitive)                                                                                           | Unused directly; Recursica's own component named `Modal` actually wraps `Dialog` (see naming-mismatch note in §1).                                                                                                           |
| NativeSelect                                                                                                              | Unused; `Dropdown`/`BareDropdown` always use the full `Select`, never the native-`<select>` fallback.                                                                                                                        |
| Paper                                                                                                                     | Unused directly; `Card`'s underlying MUI `Card` is Paper-based internally, but `Paper` itself is never imported as a standalone elevated-surface primitive — Recursica handles elevation/surface tokens via `Layer` instead. |
| Popover (the real component)                                                                                              | Unused; Recursica's own component named `Popover` is actually built on `Tooltip` (see naming-mismatch note in §1).                                                                                                           |
| Portal                                                                                                                    | Unused.                                                                                                                                                                                                                      |
| Rating                                                                                                                    | No star-rating component.                                                                                                                                                                                                    |
| Skeleton                                                                                                                  | No loading-skeleton/placeholder component (`Loader` only covers spinners, not content placeholders).                                                                                                                         |
| Snackbar / SnackbarContent                                                                                                | Unused; Recursica's `Toast` is built from `Alert`, not `Snackbar` (see naming-mismatch note in §1).                                                                                                                          |
| SpeedDial / SpeedDialAction / SpeedDialIcon                                                                               | No equivalent.                                                                                                                                                                                                               |
| StepContent                                                                                                               | Deliberately avoided by `Stepper`'s vertical orientation (its fixed-height sibling model can't track variable step content height the way Recursica needs; a CSS `::after` rail is used instead).                            |
| StepIcon (the real default component)                                                                                     | Unused; `Stepper` supplies a custom `RecursicaStepIcon` (hand-drawn SVG) via `StepIconComponent` instead, only importing MUI's `StepIconProps` type.                                                                         |
| SvgIcon                                                                                                                   | Unused; with no `@mui/icons-material` dependency, there's nothing to wrap it around.                                                                                                                                         |
| SwipeableDrawer                                                                                                           | Unused; `Panel` only wraps the plain `Drawer`.                                                                                                                                                                               |
| TablePagination / TablePaginationActions                                                                                  | Unused; `Table` and `Pagination` remain separate, uncombined Recursica components.                                                                                                                                           |
| TabScrollButton                                                                                                           | Unused; MUI's automatic scrollable-tabs affordance isn't separately exposed.                                                                                                                                                 |
| TextareaAutosize                                                                                                          | Unused; `TextArea` wraps `TextField` (multiline), not this lower-level auto-sizing textarea primitive.                                                                                                                       |
| Toolbar                                                                                                                   | No equivalent.                                                                                                                                                                                                               |

<!-- /recursica:table -->
