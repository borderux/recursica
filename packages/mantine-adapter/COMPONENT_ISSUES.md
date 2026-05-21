# Component Implementation Issues

This document tracks known token omissions, mapping errors, or design system export discrepancies found during the `mantine-adapter` implementation. These issues typically require upstream fixes in Figma or the UI Kit generator.

## DatePicker

### Missing Calendar Popover Tokens

**Issue:** The Recursica UI Kit exports specific `date-picker` CSS variables for the input bounding box (border radius, padding, colors), but fails to provide explicit tokens for the calendar popup container itself (elevation, background color) or the calendar day items (e.g., selected day primary color).
**Impact:** Mantine defaults to standard un-elevated popovers and default Mantine blue for the selected date.
**Current Workaround:** We manually inject generic tokens into `DatePicker.module.css` via Mantine `classNames`. We use `--recursica_ui-kit_components_hover-card-popover_*` tokens for the popover surface properties and `--recursica_ui-kit_components_button_variants_styles_solid_*` tokens for the selected active day.
**Resolution Needed:** Add proper nested calendar popover layer properties inside the `date-picker` component definition in Figma.
