# Recursica Design Token Exemption Review Plan

This document provides a comprehensive review of all **1400** active token exemptions across `@recursica/mui-adapter`.

Our goal is to **minimize exemptions** to the absolute bare minimum, and use this compiled record to collaborate with the **Forge Development Team** to resolve why these variables are generated but unused in the UI adapters.

---

## Part 1: Global & Layout Exemptions

These are global tokens (colors, sizes, alignments) defined in the design tokens file (`recursica_variables_scoped.css`) but not consumed by individual component adapters. They have been isolated in [GlobalExemptions.modules.css](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/GlobalExemptions.modules.css).

### 🌐 Category: GLOBAL ICON STYLE ====

> **Forge Generation Issue / Justification:**  
> Global layout option specifying the overall SVG rendering style (solid/outline). Note to Forge Devs: style is not a CSS property or variable type and cannot be applied in standard CSS stylesheets. This variable is ignored in the UI adapters and should be reviewed by the Forge team.

#### Exempted Variables (1)

- `--recursica_ui-kit_globals_icon_style`<!-- comment-here -->

---

## Part 2: Component-Specific Exemptions

These are component-level variables generated in the design tokens file but marked as ignored inside the CSS module files of specific component adapters.

### 📦 Component: [Accordion](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Accordion/Accordion.module.css)

_File: `src/components/Accordion/Accordion.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (52)

- `--recursica_ui-kit_components_accordion-item_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_colors_background-collapsed`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_colors_background-expanded`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_colors_content-background`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_colors_content-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_colors_content-text`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_colors_icon`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_colors_item-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_content-border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_content-border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_content-bottom-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_content-horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_content-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_content-text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_content-text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_content-text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_content-text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_content-text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_content-text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_content-text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_content-text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_content-top-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_elevation-content`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_elevation-item`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_header-horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_header-text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_header-text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_header-text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_header-text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_header-text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_header-text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_header-text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_header-text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_header-vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_hover-color`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_hover-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_icon-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_icon-left-size`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_icon-right-size`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion-item_properties_item-border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion_properties_colors_divider`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion_properties_divider-size`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion_properties_elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion_properties_item-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion_properties_max-width`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion_properties_min-width`<!-- comment-here -->
- `--recursica_ui-kit_components_accordion_properties_padding`<!-- comment-here -->

---

### 📦 Component: [AssistiveElement](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/AssistiveElement/AssistiveElement.module.css)

_File: `src/components/AssistiveElement/AssistiveElement.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (16)

- `--recursica_ui-kit_components_assistive-element_properties_icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_assistive-element_properties_icon-text-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_assistive-element_properties_max-width`<!-- comment-here -->
- `--recursica_ui-kit_components_assistive-element_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_assistive-element_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_assistive-element_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_assistive-element_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_assistive-element_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_assistive-element_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_assistive-element_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_assistive-element_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_assistive-element_properties_top-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_assistive-element_variants_types_error_properties_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_assistive-element_variants_types_error_properties_colors_text-color`<!-- comment-here -->
- `--recursica_ui-kit_components_assistive-element_variants_types_help_properties_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_assistive-element_variants_types_help_properties_colors_text-color`<!-- comment-here -->

---

### 📦 Component: [Autocomplete](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Autocomplete/Autocomplete.module.css)

_File: `src/components/Autocomplete/Autocomplete.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (43)

- `--recursica_ui-kit_components_autocomplete_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_properties_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_properties_icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_properties_icon-text-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_properties_max-width`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_properties_min-height`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_properties_min-width`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_properties_placeholder-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_properties_vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_default_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_default_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_default_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_default_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_default_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_default_properties_colors_trailing-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_disabled_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_disabled_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_disabled_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_disabled_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_disabled_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_disabled_properties_colors_trailing-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_error_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_error_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_error_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_error_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_error_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_error_properties_colors_trailing-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_focus_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_focus_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_focus_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_focus_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_focus_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_autocomplete_variants_states_focus_properties_colors_trailing-icon`<!-- comment-here -->

---

### 📦 Component: [Avatar](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Avatar/Avatar.module.css)

_File: `src/components/Avatar/Avatar.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (70)

- `--recursica_ui-kit_components_avatar_properties_elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_default_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_default_properties_height`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_default_properties_icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_default_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_default_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_default_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_default_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_default_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_default_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_default_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_default_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_default_properties_width`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_large_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_large_properties_height`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_large_properties_icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_large_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_large_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_large_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_large_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_large_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_large_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_large_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_large_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_large_properties_width`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_small_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_small_properties_height`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_small_properties_icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_small_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_small_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_small_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_small_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_small_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_small_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_small_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_small_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_sizes_small_properties_width`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_icon_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_icon_properties_padding`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_icon_variants_types_ghost_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_icon_variants_types_ghost_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_icon_variants_types_ghost_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_icon_variants_types_ghost_properties_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_icon_variants_types_outline_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_icon_variants_types_outline_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_icon_variants_types_outline_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_icon_variants_types_outline_properties_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_icon_variants_types_solid_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_icon_variants_types_solid_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_icon_variants_types_solid_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_icon_variants_types_solid_properties_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_image_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_image_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_image_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_image_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_image_properties_padding`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_text_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_text_properties_padding`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_text_variants_types_ghost_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_text_variants_types_ghost_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_text_variants_types_ghost_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_text_variants_types_ghost_properties_colors_text-color`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_text_variants_types_outline_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_text_variants_types_outline_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_text_variants_types_outline_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_text_variants_types_outline_properties_colors_text-color`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_text_variants_types_solid_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_text_variants_types_solid_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_text_variants_types_solid_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_avatar_variants_styles_text_variants_types_solid_properties_colors_text-color`<!-- comment-here -->

---

### 📦 Component: [Badge](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Badge/Badge.module.css)

_File: `src/components/Badge/Badge.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (25)

- `--recursica_ui-kit_components_badge_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_properties_elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_properties_padding-horizontal`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_properties_padding-vertical`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_variants_styles_alert_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_variants_styles_alert_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_variants_styles_alert_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_variants_styles_primary-color_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_variants_styles_primary-color_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_variants_styles_primary-color_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_variants_styles_success_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_variants_styles_success_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_variants_styles_success_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_variants_styles_warning_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_variants_styles_warning_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_badge_variants_styles_warning_properties_colors_text`<!-- comment-here -->

---

### 📦 Component: [Breadcrumb](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Breadcrumb/Breadcrumb.module.css)

_File: `src/components/Breadcrumb/Breadcrumb.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (2)

- `--recursica_ui-kit_components_breadcrumb_properties_item-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_breadcrumb_properties_padding`<!-- comment-here -->

---

### 📦 Component: [Button](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Button/Button.module.css)

_File: `src/components/Button/Button.module.css`_

#### Rationale Documented:

```text
These general button properties are redundant because visual mapping has been refactored
to content-specific variables (_content_label_sizes_... etc.) or are handled by design defaults.
```

#### Exempted Variables (10)

- `--recursica_ui-kit_components_button_variants_sizes_default_properties_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_button_variants_sizes_default_properties_min-width`<!-- comment-here -->
- `--recursica_ui-kit_components_button_variants_sizes_small_properties_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_button_variants_sizes_small_properties_hover-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_button_variants_sizes_small_properties_min-width`<!-- comment-here -->
- `--recursica_ui-kit_components_button_variants_sizes_small_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_button_variants_sizes_small_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_button_variants_sizes_small_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_button_variants_sizes_small_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_button_variants_sizes_small_properties_text_text-transform`<!-- comment-here -->

---

### 📦 Component: [Card](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Card/Card.module.css)

_File: `src/components/Card/Card.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (34)

- `--recursica_ui-kit_components_card_properties_borders_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_borders_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_colors_content`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_colors_divider-color`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_colors_footer-background`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_colors_header-background`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_colors_title`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_content-style_fontFamily`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_content-style_fontSize`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_content-style_fontStyle`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_content-style_fontWeight`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_content-style_letterSpacing`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_content-style_lineHeight`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_content-style_textCase`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_content-style_textDecoration`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_divider-size`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_elevations_elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_footer-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_header-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_header-style_fontFamily`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_header-style_fontSize`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_header-style_fontStyle`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_header-style_fontWeight`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_header-style_letterSpacing`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_header-style_lineHeight`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_header-style_textCase`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_header-style_textDecoration`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_max-width`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_min-width`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_padding`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_section-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_card_properties_vertical-gutter`<!-- comment-here -->

---

### 📦 Component: [Checkbox](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Checkbox/Checkbox.module.css)

_File: `src/components/Checkbox/Checkbox.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (35)

- `--recursica_ui-kit_components_checkbox-group_properties_item-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox-group_properties_padding`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox-group_variants_layouts_side-by-side_properties_gutter`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox-group_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox-group_variants_layouts_side-by-side_properties_vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox-group_variants_layouts_stacked_properties_label-field-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox-group_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox-item_properties_colors_disabled-text`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox-item_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox-item_properties_disabled-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox-item_properties_label-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox-item_properties_max-width`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox-item_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox-item_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox-item_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox-item_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox-item_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox-item_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox-item_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox-item_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox_properties_colors_background-checked`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox_properties_colors_background-indeterminate`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox_properties_colors_background-unchecked`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox_properties_colors_border-checked`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox_properties_colors_border-indeterminate`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox_properties_colors_border-unchecked`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox_properties_colors_disabled-background`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox_properties_colors_disabled-border`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox_properties_colors_disabled-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox_properties_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox_properties_disabled-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox_properties_icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_checkbox_properties_size`<!-- comment-here -->

---

### 📦 Component: [Chip](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Chip/Chip.module.css)

_File: `src/components/Chip/Chip.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (47)

- `--recursica_ui-kit_components_chip_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_close-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_close-icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_icon-text-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_leading-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_max-width`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_min-width`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_text-size`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_properties_vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_error-selected_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_error-selected_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_error-selected_properties_colors_close-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_error-selected_properties_colors_icon`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_error-selected_properties_colors_leading-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_error-selected_properties_colors_selected-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_error-selected_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_error_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_error_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_error_properties_colors_close-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_error_properties_colors_icon`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_error_properties_colors_leading-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_error_properties_colors_selected-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_error_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_selected_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_selected_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_selected_properties_colors_close-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_selected_properties_colors_leading-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_selected_properties_colors_selected-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_selected_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_unselected_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_unselected_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_unselected_properties_colors_close-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_unselected_properties_colors_leading-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_unselected_properties_colors_selected-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_chip_variants_styles_unselected_properties_colors_text`<!-- comment-here -->

---

### 📦 Component: [DatePicker](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/DatePicker/DatePicker.module.css)

_File: `src/components/DatePicker/DatePicker.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
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
- `--recursica_ui-kit_components_date-picker_variants_states_default_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_default_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_default_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_default_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_disabled_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_disabled_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_disabled_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_disabled_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_disabled_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_error_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_error_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_error_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_error_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_error_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_focus_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_focus_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_focus_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_focus_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_date-picker_variants_states_focus_properties_colors_text`<!-- comment-here -->

---

### 📦 Component: [Dropdown](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Dropdown/Dropdown.module.css)

_File: `src/components/Dropdown/Dropdown.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (42)

- `--recursica_ui-kit_components_dropdown_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_properties_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_properties_icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_properties_icon-text-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_properties_max-width`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_properties_min-height`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_properties_min-width`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_properties_vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_default_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_default_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_default_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_default_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_default_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_default_properties_colors_trailing-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_disabled_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_disabled_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_disabled_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_disabled_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_disabled_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_disabled_properties_colors_trailing-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_error_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_error_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_error_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_error_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_error_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_error_properties_colors_trailing-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_focus_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_focus_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_focus_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_focus_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_focus_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_dropdown_variants_states_focus_properties_colors_trailing-icon`<!-- comment-here -->

---

### 📦 Component: [FileInput](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/FileInput/FileInput.module.css)

_File: `src/components/FileInput/FileInput.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
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
- `--recursica_ui-kit_components_file-input_variants_states_default_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_default_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_default_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_default_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_default_properties_colors_trailing-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_disabled_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_disabled_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_disabled_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_disabled_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_disabled_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_disabled_properties_colors_trailing-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_error_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_error_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_error_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_error_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_error_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_error_properties_colors_trailing-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_focus_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_focus_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_focus_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_focus_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_focus_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_file-input_variants_states_focus_properties_colors_trailing-icon`<!-- comment-here -->

---

### 📦 Component: [FileUpload](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/FileUpload/FileUpload.module.css)

_File: `src/components/FileUpload/FileUpload.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
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
- `--recursica_ui-kit_components_file-upload_variants_states_default_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_default_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_default_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_default_properties_colors_upload-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_disabled_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_disabled_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_disabled_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_disabled_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_disabled_properties_colors_upload-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_error_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_error_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_error_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_error_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_error_properties_colors_upload-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_focus_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_focus_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_focus_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_focus_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_file-upload_variants_states_focus_properties_colors_upload-icon`<!-- comment-here -->

---

### 📦 Component: [HoverCard](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/HoverCard/HoverCard.module.css)

_File: `src/components/HoverCard/HoverCard.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (19)

- `--recursica_ui-kit_components_hover-card-popover_properties_beak-size`<!-- comment-here -->
- `--recursica_ui-kit_components_hover-card-popover_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_hover-card-popover_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_hover-card-popover_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_hover-card-popover_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_hover-card-popover_properties_colors_content`<!-- comment-here -->
- `--recursica_ui-kit_components_hover-card-popover_properties_content-text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_hover-card-popover_properties_content-text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_hover-card-popover_properties_content-text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_hover-card-popover_properties_content-text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_hover-card-popover_properties_content-text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_hover-card-popover_properties_content-text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_hover-card-popover_properties_content-text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_hover-card-popover_properties_content-text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_hover-card-popover_properties_elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_hover-card-popover_properties_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_hover-card-popover_properties_max-width`<!-- comment-here -->
- `--recursica_ui-kit_components_hover-card-popover_properties_min-width`<!-- comment-here -->
- `--recursica_ui-kit_components_hover-card-popover_properties_vertical-padding`<!-- comment-here -->

---

### 📦 Component: [Label](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Label/Label.module.css)

_File: `src/components/Label/Label.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (31)

- `--recursica_ui-kit_components_label_properties_colors_asterisk`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_edit-icon-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_label-optional-text-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_label-text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_label-text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_label-text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_label-text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_label-text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_label-text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_label-text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_label-text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_optional-text-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_optional-text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_optional-text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_optional-text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_optional-text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_optional-text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_optional-text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_optional-text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_optional-text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_label_properties_required-indicator-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_label_variants_layouts_side-by-side_properties_gutter`<!-- comment-here -->
- `--recursica_ui-kit_components_label_variants_layouts_side-by-side_properties_min-height`<!-- comment-here -->
- `--recursica_ui-kit_components_label_variants_layouts_side-by-side_properties_vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_label_variants_layouts_side-by-side_variants_sizes_default_properties_width`<!-- comment-here -->
- `--recursica_ui-kit_components_label_variants_layouts_side-by-side_variants_sizes_small_properties_width`<!-- comment-here -->
- `--recursica_ui-kit_components_label_variants_layouts_stacked_properties_bottom-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_label_variants_layouts_stacked_properties_min-height`<!-- comment-here -->
- `--recursica_ui-kit_components_label_variants_layouts_stacked_variants_sizes_default_properties_width`<!-- comment-here -->
- `--recursica_ui-kit_components_label_variants_layouts_stacked_variants_sizes_small_properties_width`<!-- comment-here -->

---

### 📦 Component: [Link](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Link/Link.module.css)

_File: `src/components/Link/Link.module.css`_

#### Rationale Documented:

```text
text_text-transform across multiple link states (default, hover, visited, visited-hover) is ignored
because links naturally inherit casing directly from text children rather than requiring custom CSS transforms.
```

#### Exempted Variables (4)

- `--recursica_ui-kit_components_link_variants_states_default_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_link_variants_states_hover_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_link_variants_states_visited_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_link_variants_states_visited-hover_properties_text_text-transform`<!-- comment-here -->

---

### 📦 Component: [Menu](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Menu/Menu.module.css)

_File: `src/components/Menu/Menu.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (49)

- `--recursica_ui-kit_components_menu-item_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_colors_selected-item_background`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_colors_selected-item_hover-color`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_colors_selected-item_hover-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_colors_selected-item_leading-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_colors_selected-item_supporting-text-color`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_colors_selected-item_text`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_colors_selected-item_trailing-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_colors_unselected-item_background`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_colors_unselected-item_hover-color`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_colors_unselected-item_hover-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_colors_unselected-item_leading-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_colors_unselected-item_supporting-text-color`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_colors_unselected-item_text`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_colors_unselected-item_trailing-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_disabled-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_icon-leading-size`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_icon-text-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_icon-trailing-size`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_supporting-text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_supporting-text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_supporting-text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_supporting-text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_supporting-text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_supporting-text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_supporting-text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_supporting-text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_text-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_menu-item_properties_vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_menu_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_menu_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_menu_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_menu_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_menu_properties_colors_divider-color`<!-- comment-here -->
- `--recursica_ui-kit_components_menu_properties_divider-height`<!-- comment-here -->
- `--recursica_ui-kit_components_menu_properties_divider-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_menu_properties_elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_menu_properties_max-height`<!-- comment-here -->
- `--recursica_ui-kit_components_menu_properties_max-width`<!-- comment-here -->
- `--recursica_ui-kit_components_menu_properties_min-width`<!-- comment-here -->

---

### 📦 Component: [Modal](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Modal/Modal.module.css)

_File: `src/components/Modal/Modal.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (32)

- `--recursica_ui-kit_components_modal_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_button-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_colors_content`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_colors_scroll-divider`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_colors_title`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_content-style_fontFamily`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_content-style_fontSize`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_content-style_fontStyle`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_content-style_fontWeight`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_content-style_letterSpacing`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_content-style_lineHeight`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_content-style_textCase`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_content-style_textDecoration`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_header-style_fontFamily`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_header-style_fontSize`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_header-style_fontStyle`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_header-style_fontWeight`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_header-style_letterSpacing`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_header-style_lineHeight`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_header-style_textCase`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_header-style_textDecoration`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_max-height`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_max-width`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_min-height`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_min-width`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_scroll-divider-thickness`<!-- comment-here -->
- `--recursica_ui-kit_components_modal_properties_vertical-padding`<!-- comment-here -->

---

### 📦 Component: [NumberInput](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/NumberInput/NumberInput.module.css)

_File: `src/components/NumberInput/NumberInput.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (43)

- `--recursica_ui-kit_components_number-input_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_properties_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_properties_icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_properties_icon-text-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_properties_max-width`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_properties_min-height`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_properties_min-width`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_properties_placeholder-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_properties_vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_default_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_default_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_default_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_default_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_default_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_default_properties_colors_trailing-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_disabled_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_disabled_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_disabled_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_disabled_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_disabled_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_disabled_properties_colors_trailing-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_error_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_error_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_error_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_error_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_error_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_error_properties_colors_trailing-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_focus_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_focus_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_focus_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_focus_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_focus_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_number-input_variants_states_focus_properties_colors_trailing-icon`<!-- comment-here -->

---

### 📦 Component: [Pagination](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Pagination/Pagination.module.css)

_File: `src/components/Pagination/Pagination.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (77)

- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_active-pages_subcomponent_colors_text-hover`<!-- comment-here -->
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
- `--recursica_ui-kit_components_pagination_properties_colors_dots-color`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_inactive-pages_subcomponent_colors_text-hover`<!-- comment-here -->
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
- `--recursica_ui-kit_components_pagination_properties_item-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_pagination_properties_navigation-controls_subcomponent_colors_text-hover`<!-- comment-here -->
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

---

### 📦 Component: [Panel](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Panel/Panel.module.css)

_File: `src/components/Panel/Panel.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (34)

- `--recursica_ui-kit_components_panel_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_colors_content`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_colors_divider-color`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_colors_header-footer-background`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_colors_title`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_content-horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_content-style_fontFamily`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_content-style_fontSize`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_content-style_fontStyle`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_content-style_fontWeight`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_content-style_letterSpacing`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_content-style_lineHeight`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_content-style_textCase`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_content-style_textDecoration`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_content-vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_divider-size`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_footer-button-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_header-close-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_header-footer-horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_header-footer-vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_header-style_fontFamily`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_header-style_fontSize`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_header-style_fontStyle`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_header-style_fontWeight`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_header-style_letterSpacing`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_header-style_lineHeight`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_header-style_textCase`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_header-style_textDecoration`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_max-width`<!-- comment-here -->
- `--recursica_ui-kit_components_panel_properties_min-width`<!-- comment-here -->

---

### 📦 Component: [Radio](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Radio/Radio.module.css)

_File: `src/components/Radio/Radio.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (33)

- `--recursica_ui-kit_components_radio-button-group_properties_item-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button-group_properties_padding`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button-group_variants_layouts_side-by-side_properties_gutter`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button-group_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button-group_variants_layouts_side-by-side_properties_vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button-group_variants_layouts_stacked_properties_label-field-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button-group_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button-item_properties_colors_disabled-text`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button-item_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button-item_properties_disabled-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button-item_properties_label-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button-item_properties_max-width`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button-item_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button-item_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button-item_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button-item_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button-item_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button-item_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button-item_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button-item_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button_properties_colors_background-selected`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button_properties_colors_background-unselected`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button_properties_colors_border-selected`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button_properties_colors_border-unselected`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button_properties_colors_disabled-background`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button_properties_colors_disabled-border`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button_properties_colors_disabled-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button_properties_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button_properties_disabled-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button_properties_icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_radio-button_properties_size`<!-- comment-here -->

---

### 📦 Component: [ReadOnlyField](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/ReadOnlyField/ReadOnlyField.module.css)

_File: `src/components/ReadOnlyField/ReadOnlyField.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (12)

- `--recursica_ui-kit_components_read-only-field_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_read-only-field_properties_min-height`<!-- comment-here -->
- `--recursica_ui-kit_components_read-only-field_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_read-only-field_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_read-only-field_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_read-only-field_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_read-only-field_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_read-only-field_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_read-only-field_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_read-only-field_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_read-only-field_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_read-only-field_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->

---

### 📦 Component: [SegmentedControl](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/SegmentedControl/SegmentedControl.module.css)

_File: `src/components/SegmentedControl/SegmentedControl.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (43)

- `--recursica_ui-kit_components_segmented-control-item_properties_item_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_item_height`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_item_icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_item_icon-text-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_item_padding-horizontal`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_selected-text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_selected-text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_selected-text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_selected-text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_selected-text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_selected-text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_selected-text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_selected-text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_selected_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_selected_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_selected_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_selected_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_selected_colors_text-color`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_selected_elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_unselected-text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_unselected-text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_unselected-text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_unselected-text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_unselected-text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_unselected-text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_unselected-text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_unselected-text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_unselected_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_unselected_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_unselected_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_unselected_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_unselected_colors_text-color`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control-item_properties_unselected_elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control_properties_colors_divider-color`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control_properties_divider-size`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control_properties_elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control_properties_item-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control_properties_padding-horizontal`<!-- comment-here -->
- `--recursica_ui-kit_components_segmented-control_properties_padding-vertical`<!-- comment-here -->

---

### 📦 Component: [Slider](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Slider/Slider.module.css)

_File: `src/components/Slider/Slider.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
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
- `--recursica_ui-kit_components_slider_variants_states_default_properties_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_default_properties_colors_input-background`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_default_properties_colors_input-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_default_properties_colors_input-text`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_default_properties_colors_step-indicator-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_default_properties_colors_step-indicator-color-active`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_default_properties_colors_thumb`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_default_properties_colors_track`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_default_properties_colors_track-active`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_default_properties_input-border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_disabled_properties_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_disabled_properties_colors_input-background`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_disabled_properties_colors_input-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_disabled_properties_colors_input-text`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_disabled_properties_colors_step-indicator-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_disabled_properties_colors_step-indicator-color-active`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_disabled_properties_colors_thumb`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_disabled_properties_colors_track`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_disabled_properties_colors_track-active`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_disabled_properties_input-border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_error_properties_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_error_properties_colors_input-background`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_error_properties_colors_input-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_error_properties_colors_input-text`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_error_properties_colors_step-indicator-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_error_properties_colors_step-indicator-color-active`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_error_properties_colors_thumb`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_error_properties_colors_track`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_error_properties_colors_track-active`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_error_properties_input-border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_focus_properties_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_focus_properties_colors_input-background`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_focus_properties_colors_input-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_focus_properties_colors_input-text`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_focus_properties_colors_step-indicator-color`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_focus_properties_colors_step-indicator-color-active`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_focus_properties_colors_thumb`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_focus_properties_colors_track`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_focus_properties_colors_track-active`<!-- comment-here -->
- `--recursica_ui-kit_components_slider_variants_states_focus_properties_input-border-size`<!-- comment-here -->

---

### 📦 Component: [Stepper](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Stepper/Stepper.module.css)

_File: `src/components/Stepper/Stepper.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (67)

- `--recursica_ui-kit_components_stepper_properties_colors_completed-connector-color`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_colors_completed-description-color`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_colors_completed-indicator-background`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_colors_completed-indicator-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_colors_completed-indicator-text`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_colors_completed-label-color`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_colors_current-description-color`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_colors_current-indicator-background`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_colors_current-indicator-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_colors_current-indicator-text`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_colors_current-label-color`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_colors_upcoming-connector-color`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_colors_upcoming-description-color`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_colors_upcoming-indicator-background`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_colors_upcoming-indicator-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_colors_upcoming-indicator-text`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_colors_upcoming-label-color`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_completed-connector-size`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_description-text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_description-text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_description-text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_description-text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_description-text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_description-text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_description-text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_description-text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_label-text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_label-text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_label-text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_label-text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_label-text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_label-text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_label-text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_label-text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_properties_upcoming-connector-size`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_orientation_horizontal_properties_indicator-label-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_orientation_horizontal_properties_label-description-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_orientation_horizontal_properties_max-text-width`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_orientation_horizontal_properties_step-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_orientation_vertical_properties_indicator-label-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_orientation_vertical_properties_label-description-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_orientation_vertical_properties_max-text-width`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_orientation_vertical_properties_step-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_large_properties_completed-icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_large_properties_indicator-border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_large_properties_indicator-border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_large_properties_indicator-size`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_large_properties_step-number-text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_large_properties_step-number-text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_large_properties_step-number-text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_large_properties_step-number-text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_large_properties_step-number-text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_large_properties_step-number-text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_large_properties_step-number-text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_large_properties_step-number-text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_small_properties_completed-icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_small_properties_indicator-border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_small_properties_indicator-border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_small_properties_indicator-size`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_small_properties_step-number-text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_small_properties_step-number-text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_small_properties_step-number-text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_small_properties_step-number-text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_small_properties_step-number-text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_small_properties_step-number-text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_small_properties_step-number-text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_stepper_variants_sizes_small_properties_step-number-text_text-transform`<!-- comment-here -->

---

### 📦 Component: [Switch](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Switch/Switch.module.css)

_File: `src/components/Switch/Switch.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (35)

- `--recursica_ui-kit_components_switch-group_properties_item-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_switch-group_properties_padding`<!-- comment-here -->
- `--recursica_ui-kit_components_switch-group_variants_layouts_side-by-side_properties_gutter`<!-- comment-here -->
- `--recursica_ui-kit_components_switch-group_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_switch-group_variants_layouts_side-by-side_properties_vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_switch-group_variants_layouts_stacked_properties_label-field-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_switch-group_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_switch-item_properties_colors_disabled-text`<!-- comment-here -->
- `--recursica_ui-kit_components_switch-item_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_switch-item_properties_disabled-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_switch-item_properties_label-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_switch-item_properties_label-max-width`<!-- comment-here -->
- `--recursica_ui-kit_components_switch-item_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_switch-item_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_switch-item_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_switch-item_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_switch-item_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_switch-item_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_switch-item_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_switch-item_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_switch_properties_colors_icon-selected`<!-- comment-here -->
- `--recursica_ui-kit_components_switch_properties_colors_icon-unselected`<!-- comment-here -->
- `--recursica_ui-kit_components_switch_properties_colors_thumb-selected`<!-- comment-here -->
- `--recursica_ui-kit_components_switch_properties_colors_thumb-unselected`<!-- comment-here -->
- `--recursica_ui-kit_components_switch_properties_colors_track-selected`<!-- comment-here -->
- `--recursica_ui-kit_components_switch_properties_colors_track-unselected`<!-- comment-here -->
- `--recursica_ui-kit_components_switch_properties_thumb-border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_switch_properties_thumb-elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_switch_properties_thumb-height`<!-- comment-here -->
- `--recursica_ui-kit_components_switch_properties_thumb-icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_switch_properties_thumb-width`<!-- comment-here -->
- `--recursica_ui-kit_components_switch_properties_track-border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_switch_properties_track-elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_switch_properties_track-inner-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_switch_properties_track-width`<!-- comment-here -->

---

### 📦 Component: [Tabs](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Tabs/Tabs.module.css)

_File: `src/components/Tabs/Tabs.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (75)

- `--recursica_ui-kit_components_tabs_properties_active-text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_properties_active-text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_properties_active-text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_properties_active-text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_properties_active-text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_properties_active-text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_properties_active-text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_properties_active-text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_properties_inactive-text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_properties_inactive-text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_properties_inactive-text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_properties_inactive-text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_properties_inactive-text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_properties_inactive-text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_properties_inactive-text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_properties_inactive-text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_properties_max-width`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_properties_min-width`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_orientation_horizontal_properties_element-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_orientation_horizontal_properties_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_orientation_horizontal_properties_icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_orientation_horizontal_properties_space-between-tabs`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_orientation_horizontal_properties_tab-content-alignment`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_orientation_horizontal_properties_vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_orientation_vertical_properties_element-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_orientation_vertical_properties_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_orientation_vertical_properties_icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_orientation_vertical_properties_space-between-tabs`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_orientation_vertical_properties_tab-content-alignment`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_orientation_vertical_properties_vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_default_properties_active_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_default_properties_active_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_default_properties_active_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_default_properties_active_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_default_properties_active_colors_text-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_default_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_default_properties_hover-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_default_properties_hover-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_default_properties_inactive_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_default_properties_inactive_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_default_properties_inactive_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_default_properties_inactive_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_default_properties_inactive_colors_text-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_default_variants_orientation_horizontal_properties_tabs-content-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_default_variants_orientation_vertical_properties_tabs-content-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_outline_properties_active_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_outline_properties_active_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_outline_properties_active_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_outline_properties_active_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_outline_properties_active_colors_text-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_outline_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_outline_properties_hover-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_outline_properties_hover-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_outline_properties_inactive_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_outline_properties_inactive_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_outline_properties_inactive_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_outline_properties_inactive_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_outline_properties_inactive_colors_text-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_outline_variants_orientation_horizontal_properties_tabs-content-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_outline_variants_orientation_vertical_properties_tabs-content-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_pills_properties_active_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_pills_properties_active_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_pills_properties_active_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_pills_properties_active_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_pills_properties_active_colors_text-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_pills_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_pills_properties_hover-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_pills_properties_hover-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_pills_properties_inactive_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_pills_properties_inactive_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_pills_properties_inactive_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_pills_properties_inactive_colors_icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_pills_properties_inactive_colors_text-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_pills_variants_orientation_horizontal_properties_tabs-content-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_tabs_variants_styles_pills_variants_orientation_vertical_properties_tabs-content-gap`<!-- comment-here -->

---

### 📦 Component: [TextArea](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/TextArea/TextArea.module.css)

_File: `src/components/TextArea/TextArea.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (33)

- `--recursica_ui-kit_components_textarea_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_properties_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_properties_max-width`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_properties_min-width`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_properties_placeholder-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_properties_rows`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_properties_vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_states_default_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_states_default_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_states_default_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_states_default_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_states_disabled_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_states_disabled_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_states_disabled_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_states_disabled_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_states_error_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_states_error_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_states_error_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_states_error_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_states_focus_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_states_focus_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_states_focus_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_textarea_variants_states_focus_properties_colors_text`<!-- comment-here -->

---

### 📦 Component: [TextField](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/TextField/TextField.module.css)

_File: `src/components/TextField/TextField.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (43)

- `--recursica_ui-kit_components_text-field_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_properties_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_properties_icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_properties_icon-text-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_properties_max-width`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_properties_min-height`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_properties_min-width`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_properties_placeholder-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_properties_vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_layouts_side-by-side_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_layouts_stacked_properties_top-bottom-margin`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_default_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_default_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_default_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_default_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_default_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_default_properties_colors_trailing-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_disabled_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_disabled_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_disabled_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_disabled_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_disabled_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_disabled_properties_colors_trailing-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_error_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_error_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_error_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_error_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_error_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_error_properties_colors_trailing-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_focus_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_focus_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_focus_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_focus_properties_colors_leading-icon`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_focus_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_text-field_variants_states_focus_properties_colors_trailing-icon`<!-- comment-here -->

---

### 📦 Component: [TimePicker](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/TimePicker/TimePicker.module.css)

_File: `src/components/TimePicker/TimePicker.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
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
- `--recursica_ui-kit_components_time-picker_variants_states_default_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_default_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_default_properties_colors_icon`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_default_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_disabled_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_disabled_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_disabled_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_disabled_properties_colors_icon`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_disabled_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_error_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_error_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_error_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_error_properties_colors_icon`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_error_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_focus_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_focus_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_focus_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_focus_properties_colors_icon`<!-- comment-here -->
- `--recursica_ui-kit_components_time-picker_variants_states_focus_properties_colors_text`<!-- comment-here -->

---

### 📦 Component: [Timeline](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Timeline/Timeline.module.css)

_File: `src/components/Timeline/Timeline.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (74)

- `--recursica_ui-kit_components_timeline-bullet_variants_types_avatar_properties_active-avatar-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_avatar_properties_avatar-size`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_avatar_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_avatar_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_avatar_properties_colors_active-background`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_avatar_properties_colors_active-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_avatar_properties_colors_inactive-background`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_avatar_properties_colors_inactive-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_avatar_properties_inactive-avatar-opacity`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_default_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_default_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_default_properties_bullet-size`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_default_properties_colors_active-background`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_default_properties_colors_active-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_default_properties_colors_inactive-background`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_default_properties_colors_inactive-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_icon-alternative_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_icon-alternative_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_icon-alternative_properties_bullet-size`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_icon-alternative_properties_colors_active-background`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_icon-alternative_properties_colors_active-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_icon-alternative_properties_colors_active-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_icon-alternative_properties_colors_inactive-background`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_icon-alternative_properties_colors_inactive-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_icon-alternative_properties_colors_inactive-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_icon-alternative_properties_icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_icon_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_icon_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_icon_properties_bullet-size`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_icon_properties_colors_active-background`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_icon_properties_colors_active-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_icon_properties_colors_active-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_icon_properties_colors_inactive-background`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_icon_properties_colors_inactive-border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_icon_properties_colors_inactive-icon-color`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline-bullet_variants_types_icon_properties_icon-size`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_active-connector-size`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_bullet-content-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_colors_active-connector-color`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_colors_active-description-color`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_colors_active-timestamp-color`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_colors_active-title-color`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_colors_inactive-connector-color`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_colors_inactive-description-color`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_colors_inactive-timestamp-color`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_colors_inactive-title-color`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_description-text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_description-text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_description-text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_description-text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_description-text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_description-text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_description-text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_description-text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_description-timestamp-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_inactive-connector-size`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_max-text-width`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_timestamp-text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_timestamp-text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_timestamp-text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_timestamp-text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_timestamp-text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_timestamp-text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_timestamp-text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_timestamp-text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_title-description-gap`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_title-text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_title-text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_title-text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_title-text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_title-text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_title-text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_title-text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_timeline_properties_title-text_text-transform`<!-- comment-here -->

---

### 📦 Component: [Toast](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Toast/Toast.module.css)

_File: `src/components/Toast/Toast.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (28)

- `--recursica_ui-kit_components_toast_properties_elevation_layer-0`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_properties_elevation_layer-1`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_properties_elevation_layer-2`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_properties_elevation_layer-3`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_properties_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_properties_icon`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_properties_max-width`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_properties_min-height`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_properties_min-width`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_properties_spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_properties_vertical-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_variants_styles_default_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_variants_styles_default_properties_colors_button`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_variants_styles_default_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_variants_styles_error_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_variants_styles_error_properties_colors_button`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_variants_styles_error_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_variants_styles_success_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_variants_styles_success_properties_colors_button`<!-- comment-here -->
- `--recursica_ui-kit_components_toast_variants_styles_success_properties_colors_text`<!-- comment-here -->

---

### 📦 Component: [Tooltip](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/Tooltip/Tooltip.module.css)

_File: `src/components/Tooltip/Tooltip.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
```

#### Exempted Variables (21)

- `--recursica_ui-kit_components_tooltip_properties_beak-inset`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_beak-size`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_border-radius`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_colors_text`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_elevation`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_horizontal-padding`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_max-width`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_min-height`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_min-width`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_text_font-family`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_text_font-size`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_text_font-style`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_text_font-weight`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_text_letter-spacing`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_text_line-height`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_text_text-decoration`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_text_text-transform`<!-- comment-here -->
- `--recursica_ui-kit_components_tooltip_properties_vertical-padding`<!-- comment-here -->

---

### 📦 Component: [TransferList](file:///Users/mattmassey/work/recursica/packages/mui-adapter/src/components/TransferList/TransferList.module.css)

_File: `src/components/TransferList/TransferList.module.css`_

#### Rationale Documented:

```text
This component is a placeholder stub. Once fully implemented, its specific
tokens will be fully wired up to direct styles.
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
- `--recursica_ui-kit_components_transfer-list_variants_states_default_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_default_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_default_properties_colors_header-color`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_disabled_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_disabled_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_disabled_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_disabled_properties_colors_header-color`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_error_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_error_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_error_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_error_properties_colors_header-color`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_focus_properties_border-size`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_focus_properties_colors_background`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_focus_properties_colors_border-color`<!-- comment-here -->
- `--recursica_ui-kit_components_transfer-list_variants_states_focus_properties_colors_header-color`<!-- comment-here -->

---

## Part 3: Action Plan for Forge Dev Team

Based on our comprehensive review and alignment with the Forge team, here are the outstanding coordination items:

1. **State Border Consistency (Coordination Item):** Input fields (TextField, Dropdown, NumberInput) are styled with a uniform 1px solid border to prevent unexpected layout shifts and flickering during focus/error state transitions. Can the Forge team explore a feature to output a single, static border-width rule for input wrappers rather than multiplying separate border-size parameters across every individual state?
2. **SVG & Beak Sizing (Resolved):** Tooltip and HoverCard arrow elements compute offset alignments dynamically within the React rendering layer (requiring integer values rather than native CSS variables). To secure parity without ignoring these tokens, a new **Value-Asserting Ignore** mechanism (`recursica-ignore: --variable-name = expected_value`) has been successfully integrated into the Recursica Token Analyzer. If these tokens change in Figma, the build fails immediately, prompting developers to update the default props in the React components.
