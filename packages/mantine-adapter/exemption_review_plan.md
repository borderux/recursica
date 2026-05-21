# Recursica Design Token Exemption Review Plan

This document provides a comprehensive review of all **406** active token exemptions across `@recursica/mantine-adapter`.

Our goal is to **minimize exemptions** to the absolute bare minimum, and use this compiled record to collaborate with the **Forge Development Team** to resolve why these variables are generated but unused in the UI adapters.

---

## Part 1: Global & Layout Exemptions

These are global tokens (colors, sizes, alignments) defined in the design tokens file (`recursica_variables_scoped.css`) but not consumed by individual component adapters. They have been isolated in [GlobalExemptions.modules.css](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/GlobalExemptions.modules.css).

### 🌐 Category: GLOBAL ICON STYLE ====

> **Forge Generation Issue / Justification:**  
> Global layout option specifying the overall SVG rendering style (solid/outline). Note to Forge Devs: style is not a CSS property or variable type and cannot be applied in standard CSS stylesheets. This variable is ignored in the UI adapters and should be reviewed by the Forge team.

#### Exempted Variables (1)

- `--recursica_ui-kit_globals_icon_style`<!-- comment-here -->

---

## Part 2: Component-Specific Exemptions

These are component-level variables generated in the design tokens file but marked as ignored inside the CSS module files of specific component adapters.

### 📦 Component: [AutoComplete](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/AutoComplete/AutoComplete.module.css)

_File: `src/components/AutoComplete/AutoComplete.module.css`_

#### Rationale Documented:

```text
* layout_side-by-side and layout_stacked margin variables are ignored because label/field positioning is handled
structurally by outer Mantine form layout components rather than direct styles inside AutoComplete.
* state-specific border-size variables are ignored because the input box uses a uniform static boundary to prevent
unexpected layout shifts or flickering when switching between active, focused, or error states.
```

#### Exempted Variables (6)

- `--recursica_ui-kit_components_autocomplete_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_default_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_disabled_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_error_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_focus_properties_border-size`<!-- comment-here -->

---

### 📦 Component: [Avatar](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/Avatar/Avatar.module.css)

_File: `src/components/Avatar/Avatar.module.css`_

#### Rationale Documented:

```text
The generic size variables below are defined in Figma but unused.
We explicitly style the avatar's dimensions using the dedicated width and height tokens
(e.g., small_properties_width and small_properties_height) for precise component layout.
```

#### Exempted Variables (3)

- `--recursica_ui-kit_components_avatar_variants_sizes_default_properties_size`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_large_properties_size`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_small_properties_size`<!-- comment-here -->

---

### 📦 Component: [Chip](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/Chip/Chip.module.css)

_File: `src/components/Chip/Chip.module.css`_

#### Rationale Documented:

```text
* close-icon-color, leading-icon-color, and select-specific state icon variables are ignored because
Chip uses explicit state color definitions (e.g. unselected, selected, error, error-selected variant colors)
to drive pixel-perfect hover and click transitions, rather than generic single-color overrides.
* text-size is ignored since actual chip sizing is dynamically driven by precise vertical padding and line-heights.
```

#### Exempted Variables (9)

- `--recursica_ui-kit_components_chip_properties_close-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_leading-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_text-size`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_error_properties_colors_leading-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_error_properties_colors_selected-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_error-selected_properties_colors_icon`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_error-selected_properties_colors_leading-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_selected_properties_colors_leading-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_unselected_properties_colors_selected-icon-color`<!-- comment-here -->

---

### 📦 Component: [DatePicker](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/DatePicker/DatePicker.module.css)

_File: `src/components/DatePicker/DatePicker.module.css`_

#### Rationale Documented:

```text
No specific rationale documented.
```

#### Exempted Variables (38)

- `--recursica_ui-kit_components_date-picker_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_properties_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_properties_icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_properties_icon-text-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_properties_min-height`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_properties_placeholder-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_properties_vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_properties_width`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_default_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_disabled_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_error_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_focus_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_default_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_default_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_default_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_default_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_disabled_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_disabled_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_disabled_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_disabled_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_error_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_error_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_error_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_error_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_focus_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_focus_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_focus_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_focus_properties_colors_text`<!-- comment-here -->

---

### 📦 Component: [Dropdown](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/Dropdown/Dropdown.module.css)

_File: `src/components/Dropdown/Dropdown.module.css`_

#### Rationale Documented:

```text
* side-by-side and stacked layout top-bottom-margin variables are ignored because field spacing is handled
by external form grid/layout wrappers rather than direct margin declarations inside the Dropdown component.
* state-specific border-size variables are ignored because a uniform 1px border is applied globally to prevent
unexpected layout shift or flickering during focus, disabled, or error state transitions.
```

#### Exempted Variables (6)

- `--recursica_ui-kit_components_dropdown_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_default_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_disabled_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_error_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_focus_properties_border-size`<!-- comment-here -->

---

### 📦 Component: [FileInput](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/FileInput/FileInput.module.css)

_File: `src/components/FileInput/FileInput.module.css`_

#### Rationale Documented:

```text
No specific rationale documented.
```

#### Exempted Variables (43)

- `--recursica_ui-kit_components_file-input_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_properties_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_properties_icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_properties_icon-text-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_properties_max-width`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_properties_min-height`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_properties_min-width`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_properties_placeholder-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_properties_vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_default_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_disabled_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_error_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_focus_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_default_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_default_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_default_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_default_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_default_properties_colors_trailing-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_disabled_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_disabled_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_disabled_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_disabled_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_disabled_properties_colors_trailing-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_error_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_error_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_error_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_error_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_error_properties_colors_trailing-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_focus_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_focus_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_focus_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_focus_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_focus_properties_colors_trailing-icon`<!-- comment-here -->

---

### 📦 Component: [FileUpload](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/FileUpload/FileUpload.module.css)

_File: `src/components/FileUpload/FileUpload.module.css`_

#### Rationale Documented:

```text
No specific rationale documented.
```

#### Exempted Variables (36)

- `--recursica_ui-kit_components_file-upload_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_properties_border-style`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_properties_item-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_properties_list-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_properties_padding`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_properties_vertical-element-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_default_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_disabled_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_error_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_focus_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_default_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_default_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_default_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_default_properties_colors_upload-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_disabled_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_disabled_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_disabled_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_disabled_properties_colors_upload-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_error_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_error_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_error_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_error_properties_colors_upload-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_focus_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_focus_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_focus_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_focus_properties_colors_upload-icon`<!-- comment-here -->

---

### 📦 Component: [HoverCard](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/HoverCard/HoverCard.module.css)

_File: `src/components/HoverCard/HoverCard.module.css`_

#### Rationale Documented:

```text
* beak-size is ignored here because Mantine's popover arrows compute their sizing and positional offsets
dynamically within the React rendering engine (requires inline pixel number rather than standard CSS variables).
The beak size is checked in JS against a fixed value of 16px. If this variable changes, the TSX components
need to be reviewed/re-compiled.
```

#### Exempted Variables (1)

- `--recursica_ui-kit_components_hover-card-popover_properties_beak-size`<!-- comment-here -->

---

### 📦 Component: [Label](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/Label/Label.module.css)

_File: `src/components/Label/Label.module.css`_

#### Rationale Documented:

```text
* layouts_stacked sizes width variables are ignored because stacked labels naturally occupy 100% width block-level
real estate in HTML rendering, making explicit width properties redundant.
```

#### Exempted Variables (2)

- `--recursica_ui-kit_components_label_variants_layouts_stacked_variants_sizes_default_properties_width`<!-- comment-here -->
- `--recursica_ui-kit_components_label_variants_layouts_stacked_variants_sizes_small_properties_width`<!-- comment-here -->

---

### 📦 Component: [Link](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/Link/Link.module.css)

_File: `src/components/Link/Link.module.css`_

#### Rationale Documented:

```text
* text_text-transform across multiple link states (default, hover, visited, visited-hover) is ignored
because links naturally inherit casing directly from text children rather than requiring custom CSS transforms.
```

#### Exempted Variables (4)

- `--recursica_ui-kit_components_link_variants_states_default_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_link_variants_states_hover_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_link_variants_states_visited_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_link_variants_states_visited-hover_properties_text_text-transform`<!-- comment-here -->

---

### 📦 Component: [Menu](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/Menu/Menu.module.css)

_File: `src/components/Menu/Menu.module.css`_

#### Rationale Documented:

```text
* colors_selected-item_supporting-text-color is ignored because selected menu items do not render
supporting secondary text, making selected state overrides for supporting text colors obsolete.
```

#### Exempted Variables (1)

- `--recursica_ui-kit_components_menu-item_properties_colors_selected-item_supporting-text-color`<!-- comment-here -->

---

### 📦 Component: [Modal](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/Modal/Modal.module.css)

_File: `src/components/Modal/Modal.module.css`_

#### Rationale Documented:

```text
* content-style and header-style parent variables represent raw JSON styling objects rather than
direct CSS variables and cannot be applied directly in standard CSS files.
Sub-properties are fully and individually mapped to elements natively.
```

#### Exempted Variables (2)

- `--recursica_ui-kit_components_modal_properties_content-style`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_header-style`<!-- comment-here -->

---

### 📦 Component: [NumberInput](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/NumberInput/NumberInput.module.css)

_File: `src/components/NumberInput/NumberInput.module.css`_

#### Rationale Documented:

```text
* layout_side-by-side and layout_stacked margin variables are ignored because label/field positioning is handled
structurally by outer Mantine form layout components rather than direct styles inside NumberInput.
* state-specific border-size variables are ignored because the input box uses a uniform static boundary to prevent
unexpected layout shifts or flickering when switching between active, focused, or error states.
```

#### Exempted Variables (6)

- `--recursica_ui-kit_components_number-input_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_default_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_disabled_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_error_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_focus_properties_border-size`<!-- comment-here -->

---

### 📦 Component: [Pagination](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/Pagination/Pagination.module.css)

_File: `src/components/Pagination/Pagination.module.css`_

#### Rationale Documented:

```text
* All pagination subcomponent properties (active-pages, inactive-pages, navigation-controls) are ignored
because we are not implementing custom subcomponent styling for pagination. Instead, pagination items
directly inherit the unified, standard brand button components for complete UI/UX consistency, rendering
these generated subcomponent tokens redundant.
```

#### Exempted Variables (75)

- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_disabled-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_height`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_hover-color`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_hover-elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_hover-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_icon`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_icon-text-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_max-label-width`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_min-width`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_colors_text-hover`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_disabled-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_height`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_hover-color`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_hover-elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_hover-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_icon`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_icon-text-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_max-label-width`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_min-width`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_colors_text-hover`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_disabled-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_height`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_hover-color`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_hover-elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_hover-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_icon`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_icon-text-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_max-label-width`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_min-width`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_colors_text-hover`<!-- comment-here -->

---

### 📦 Component: [ReadOnlyField](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/ReadOnlyField/ReadOnlyField.module.css)

_File: `src/components/ReadOnlyField/ReadOnlyField.module.css`_

#### Rationale Documented:

```text
* side-by-side and stacked layout top-bottom-margin variables are ignored because ReadOnlyField spacing
is governed structurally by external parent form/grid layout wrappers rather than internal module margins.
```

#### Exempted Variables (2)

- `--recursica_ui-kit_components_read-only-field_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_read-only-field_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->

---

### 📦 Component: [Slider](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/Slider/Slider.module.css)

_File: `src/components/Slider/Slider.module.css`_

#### Rationale Documented:

```text
No specific rationale documented.
```

#### Exempted Variables (82)

- `--recursica_ui-kit_components_slider_properties_icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_input-border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_input-border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_input-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_input-height`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_input-padding-left`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_input-padding-right`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_input-padding-vertical`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_input-text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_input-text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_input-text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_input-text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_input-text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_input-text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_input-text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_input-text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_input-width`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_min-max-label_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_min-max-label_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_min-max-label_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_min-max-label_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_min-max-label_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_min-max-label_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_min-max-label_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_min-max-label_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_read-only-value_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_read-only-value_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_read-only-value_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_read-only-value_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_read-only-value_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_read-only-value_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_read-only-value_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_read-only-value_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_step-indicator-border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_step-indicator-width`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_thumb-border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_thumb-elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_thumb-size`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_track-border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_properties_track-height`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_default_properties_input-border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_disabled_properties_input-border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_error_properties_input-border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_focus_properties_input-border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_default_properties_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_default_properties_colors_input-background`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_default_properties_colors_input-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_default_properties_colors_input-text`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_default_properties_colors_step-indicator-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_default_properties_colors_step-indicator-color-active`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_default_properties_colors_thumb`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_default_properties_colors_track`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_default_properties_colors_track-active`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_disabled_properties_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_disabled_properties_colors_input-background`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_disabled_properties_colors_input-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_disabled_properties_colors_input-text`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_disabled_properties_colors_step-indicator-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_disabled_properties_colors_step-indicator-color-active`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_disabled_properties_colors_thumb`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_disabled_properties_colors_track`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_disabled_properties_colors_track-active`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_error_properties_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_error_properties_colors_input-background`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_error_properties_colors_input-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_error_properties_colors_input-text`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_error_properties_colors_step-indicator-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_error_properties_colors_step-indicator-color-active`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_error_properties_colors_thumb`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_error_properties_colors_track`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_error_properties_colors_track-active`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_focus_properties_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_focus_properties_colors_input-background`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_focus_properties_colors_input-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_focus_properties_colors_input-text`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_focus_properties_colors_step-indicator-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_focus_properties_colors_step-indicator-color-active`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_focus_properties_colors_thumb`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_focus_properties_colors_track`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_focus_properties_colors_track-active`<!-- comment-here -->

---

### 📦 Component: [TextArea](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/TextArea/TextArea.module.css)

_File: `src/components/TextArea/TextArea.module.css`_

#### Rationale Documented:

```text
* side-by-side and stacked layout top-bottom-margin variables are ignored because field spacing is handled
by external form grid/layout wrappers rather than direct margin declarations inside the TextArea component.
* state-specific border-size variables are ignored because a uniform 1px border is applied globally to prevent
unexpected layout shift or flickering during focus, disabled, or error state transitions.
```

#### Exempted Variables (6)

- `--recursica_ui-kit_components_textarea_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_states_default_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_states_disabled_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_states_error_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_states_focus_properties_border-size`<!-- comment-here -->

---

### 📦 Component: [TextField](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/TextField/TextField.module.css)

_File: `src/components/TextField/TextField.module.css`_

#### Rationale Documented:

```text
* side-by-side and stacked layout top-bottom-margin variables are ignored because field spacing is handled
by external form grid/layout wrappers rather than direct margin declarations inside the TextField component.
* state-specific border-size variables are ignored because a uniform 1px border is applied globally to prevent
unexpected layout shift or flickering during focus, disabled, or error state transitions.
```

#### Exempted Variables (6)

- `--recursica_ui-kit_components_text-field_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_default_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_disabled_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_error_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_focus_properties_border-size`<!-- comment-here -->

---

### 📦 Component: [TimePicker](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/TimePicker/TimePicker.module.css)

_File: `src/components/TimePicker/TimePicker.module.css`_

#### Rationale Documented:

```text
No specific rationale documented.
```

#### Exempted Variables (37)

- `--recursica_ui-kit_components_time-picker_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_properties_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_properties_icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_properties_icon-text-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_properties_placeholder-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_properties_vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_properties_width`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_default_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_disabled_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_error_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_focus_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_default_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_default_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_default_properties_colors_icon`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_default_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_disabled_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_disabled_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_disabled_properties_colors_icon`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_disabled_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_error_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_error_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_error_properties_colors_icon`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_error_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_focus_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_focus_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_focus_properties_colors_icon`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_focus_properties_colors_text`<!-- comment-here -->

---

### 📦 Component: [Timeline](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/Timeline/Timeline.module.css)

_File: `src/components/Timeline/Timeline.module.css`_

#### Rationale Documented:

```text
* timeline-bullet_variants_types_avatar_properties_avatar-size is ignored because under the avatar timeline variant,
the bullet container size uses fallback bullet-size configurations to maintain vertical alignment with the
inactive/active connector line, while the nested Avatar subcomponent handles its own sizing natively.
```

#### Exempted Variables (1)

- `--recursica_ui-kit_components_timeline-bullet_variants_types_avatar_properties_avatar-size`<!-- comment-here -->

---

### 📦 Component: [Toast](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/Toast/Toast.module.css)

_File: `src/components/Toast/Toast.module.css`_

#### Rationale Documented:

```text
* elevation levels layer-1, layer-2, and layer-3 are ignored because all toasts explicitly use the standard
layer-0 elevation shadow for styling consistency.
```

#### Exempted Variables (3)

- `--recursica_ui-kit_components_toast_properties_elevation_layer-1`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_properties_elevation_layer-2`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_properties_elevation_layer-3`<!-- comment-here -->

---

### 📦 Component: [Tooltip](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/Tooltip/Tooltip.module.css)

_File: `src/components/Tooltip/Tooltip.module.css`_

#### Rationale Documented:

```text
* beak-inset is ignored because Tooltip positioning calculations are handled dynamically by Mantine/Floating UI at the React runtime.
* beak-size is ignored because Mantine's tooltip arrows compute their sizing and positional offsets
dynamically within the React rendering engine (requires inline pixel number rather than standard CSS variables).
The beak size is checked in JS against a fixed value of 16px. If this variable changes, the TSX components
need to be reviewed/re-compiled.
```

#### Exempted Variables (2)

- `--recursica_ui-kit_components_tooltip_properties_beak-inset`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_beak-size`<!-- comment-here -->

---

### 📦 Component: [TransferList](file:///Users/mattmassey/work/recursica/packages/mantine-adapter/src/components/TransferList/TransferList.module.css)

_File: `src/components/TransferList/TransferList.module.css`_

#### Rationale Documented:

```text
No specific rationale documented.
```

#### Exempted Variables (34)

- `--recursica_ui-kit_components_transfer-list_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_properties_filter-items-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_properties_gap`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_properties_header-style_fontFamily`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_properties_header-style_fontSize`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_properties_header-style_fontStyle`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_properties_header-style_fontWeight`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_properties_header-style_letterSpacing`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_properties_header-style_lineHeight`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_properties_header-style_textCase`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_properties_header-style_textDecoration`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_properties_height`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_properties_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_properties_title-filter-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_properties_vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_properties_width`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_default_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_disabled_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_error_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_focus_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_default_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_default_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_default_properties_colors_header-color`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_disabled_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_disabled_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_disabled_properties_colors_header-color`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_error_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_error_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_error_properties_colors_header-color`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_focus_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_focus_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_focus_properties_colors_header-color`<!-- comment-here -->

---

## Part 3: Action Plan for Forge Dev Team

Based on our comprehensive review and alignment with the Forge team, here are the outstanding coordination items:

1. **State Border Consistency (Coordination Item):** Input fields (TextField, Dropdown, NumberInput) are styled with a uniform 1px solid border to prevent unexpected layout shifts and flickering during focus/error state transitions. Can the Forge team explore a feature to output a single, static border-width rule for input wrappers rather than multiplying separate border-size parameters across every individual state?
2. **SVG & Beak Sizing (Resolved):** Tooltip and HoverCard arrow elements compute offset alignments dynamically within the React rendering layer (requiring integer values rather than native CSS variables). To secure parity without ignoring these tokens, a new **Value-Asserting Ignore** mechanism (`recursica-ignore: --variable-name = expected_value`) has been successfully integrated into the Recursica Token Analyzer. If these tokens change in Figma, the build fails immediately, prompting developers to update the default props in the React components.
