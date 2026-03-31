import { style, globalStyle } from "@vanilla-extract/css";
import { recursica } from "@recursica/official-release/recursica";

export const labelStyleRule = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "flex-start",
  color: recursica.uiKit["global/form/label/color/default"],
  opacity: recursica.uiKit["global/form/label/color/optional-text-opacity"],
  gap: recursica.uiKit["global/form/label/size/required-indicator-gap"],
  padding: 0,
  paddingBottom:
    recursica.uiKit["global/form/label/size/stacked/bottom-padding"],
  fontFamily: recursica.themes["font/body-small/font-family"],
  fontSize: recursica.themes["font/body-small/size"],
  fontWeight: recursica.themes["font/body-small/weight-strong"],
};

export const label = style(labelStyleRule);

export const labelHidden = style({
  visibility: "hidden",
});

// Simple indicator styles
export const labelOptional = style(labelStyleRule);
export const labelAsterisk = style(labelStyleRule);
export const labelNone = style(labelStyleRule);

// Global styles to target data attributes with full styling
// For optional text - shows below the label in top layout, inline in left layout
globalStyle(`${labelOptional} [data-optional-text]`, {
  color: recursica.uiKit["global/form/label/color/default"],
  display: "block", // Block display to put it below the label
  fontFamily: recursica.themes["font/caption/font-family"],
  fontSize: recursica.themes["font/caption/size"],
  fontWeight: recursica.themes["font/caption/weight"],
  opacity: `${recursica.uiKit["global/form/label/color/optional-text-opacity"]}`,
});

globalStyle(`${labelOptional} [data-asterisk]`, {
  display: "none",
});

globalStyle(`${labelAsterisk} [data-optional-text]`, {
  display: "none",
});

// For asterisk - style Mantine's built-in asterisk with higher specificity
globalStyle(`${labelAsterisk} .mantine-InputWrapper-required`, {
  color: recursica.uiKit["global/form/label/color/required-asterisk"],
  marginLeft: recursica.uiKit["global/form/label/size/required-indicator-gap"],
});

globalStyle(`${labelAsterisk} .mantine-TextInput-required`, {
  color: recursica.uiKit["global/form/label/color/required-asterisk"],
  marginLeft: recursica.uiKit["global/form/label/size/required-indicator-gap"],
});

// Override flexDirection for asterisk labels to keep asterisk inline
globalStyle(`${labelAsterisk}`, {
  flexDirection: "row",
});

globalStyle(`${labelNone} [data-optional-text]`, {
  display: "none",
});

// No need to hide Mantine's asterisk since we control it with the required prop

export const labelLeft = style([
  labelStyleRule,
  {
    alignItems: "flex-end",
    textAlign: "right",
    padding: 0,
    paddingBottom: 0, // Override bottom padding for left layout
    paddingRight:
      recursica.uiKit["global/form/label/size/side-by-side-large/gutter"],
    width:
      recursica.uiKit["global/form/label/size/side-by-side-large/column-width"],
    height: recursica.uiKit["global/form/label/size/side-by-side-large/height"],
  },
]);

// Align-specific styles for left layout
export const labelLeftMiddle = style({
  justifyContent: "center",
});

export const labelLeftTop = style({
  justifyContent: "flex-start",
});

// For left layout with asterisk, ensure fixed width and right justification
globalStyle(`${labelLeft}.${labelAsterisk}`, {
  flexDirection: "row",
  justifyContent: "flex-end",
  width:
    recursica.uiKit["global/form/label/size/side-by-side-large/column-width"],
});

// Align-specific styles for left layout with asterisk
globalStyle(`${labelLeft}.${labelLeftMiddle}.${labelAsterisk}`, {
  alignItems: "center",
});

globalStyle(`${labelLeft}.${labelLeftTop}.${labelAsterisk}`, {
  alignItems: "flex-start",
});

// Truncate style - only applies to left layout with asterisk
export const labelTruncate = style({
  // Base truncate styles - will be overridden by global styles for specific layouts
});

// Global style for truncate behavior - only apply to left layout
globalStyle(`${labelLeft}.${labelTruncate}`, {
  display: "flex",
  flexDirection: "row",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  justifyContent: "flex-end", // Right justify content
  width:
    recursica.uiKit["global/form/label/size/side-by-side-large/column-width"], // Fixed width
  minWidth: 0,
  flexWrap: "nowrap",
});

// Align-specific styles for left layout with truncate
globalStyle(`${labelLeft}.${labelLeftMiddle}.${labelTruncate}`, {
  alignItems: "center",
});

globalStyle(`${labelLeft}.${labelLeftTop}.${labelTruncate}`, {
  alignItems: "flex-start",
});

globalStyle(`${labelLeft}.${labelTruncate} .mantine-InputWrapper-required`, {
  color: recursica.uiKit["global/form/label/color/required-asterisk"],
  flexShrink: 0,
  marginLeft: recursica.uiKit["global/form/label/size/required-indicator-gap"],
});

globalStyle(`${labelLeft}.${labelTruncate} .mantine-TextInput-required`, {
  color: recursica.uiKit["global/form/label/color/required-asterisk"],
  flexShrink: 0,
  marginLeft: recursica.uiKit["global/form/label/size/required-indicator-gap"],
});

// Ensure the label text itself can be truncated
globalStyle(`${labelLeft}.${labelTruncate} [data-label-text]`, {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  minWidth: 0,
  flex: 1,
});

// Override for left layout - optional text should be inline
globalStyle(`${labelLeft}.${labelOptional} [data-optional-text]`, {
  display: "inline",
  fontFamily: recursica.themes["font/caption/font-family"],
  fontSize: recursica.themes["font/caption/size"],
  fontWeight: recursica.themes["font/caption/weight"],
  opacity: `${recursica.uiKit["global/form/label/color/optional-text-opacity"]}`,
});
