import { style, globalStyle } from "@vanilla-extract/css";
import { recursica } from "@recursica/official-release/recursica";

export const root = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gridTemplateRows: "auto auto auto",
  width: "100%",
});

// For stacked layout, position description below the wrapper
export const labelStacked = style({
  gridRow: "1",
  marginBottom: recursica.uiKit["global/form/layout/stacked/label-field-gap"],
});

export const wrapperStacked = style({
  gridRow: "2",
  margin: 0,
});

export const descriptionStacked = style({
  gridRow: "3", // After label (row 1) and wrapper (row 2)
  margin: 0,
});

export const errorStacked = style({
  gridRow: "3", // Same row as description - error will overlay it
  margin: 0,
});

// Hide description when error is present in the same row
export const descriptionStackedWithError = style({
  display: "none",
});

export const rootHorizontal = style({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  width: "100%",
  alignItems: "start",
});

// For side-by-side layout, we need to restructure the internal elements
export const labelHorizontal = style({
  gridColumn: "1",
  gridRow: "1",
  textAlign: "right",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "flex-start",
  paddingRight: recursica.uiKit["global/form/layout/side-by-side/gutter"],
});

export const wrapperHorizontal = style({
  gridColumn: "2",
  gridRow: "1",
  margin: 0,
});

export const descriptionHorizontal = style({
  gridColumn: "2",
  gridRow: "2",
  margin: 0,
});

export const errorHorizontal = style({
  gridColumn: "2",
  gridRow: "2", // Same row as description - error will overlay it
  margin: 0,
});

// Hide description when error is present in the same row for horizontal layout
export const descriptionHorizontalWithError = style({
  display: "none",
});

// Common error text styling
export const errorText = style({
  fontFamily: recursica.themes["font/caption/font-family"],
  fontSize: recursica.themes["font/caption/size"],
  fontWeight: recursica.themes["font/caption/weight"],
  color: recursica.uiKit["global/form/assistive-element/error/text-color"],
  gap: recursica.uiKit["global/form/assistive-element/size/icon-text-gap"],
  padding: 0,
  paddingTop: recursica.uiKit["global/form/field/size/vertical-gutter"],
});

// Common description text styling
export const descriptionText = style({
  fontFamily: recursica.themes["font/caption/font-family"],
  fontSize: recursica.themes["font/caption/size"],
  fontWeight: recursica.themes["font/caption/weight"],
  color: recursica.uiKit["global/form/assistive-element/help/text-color"],
  gap: recursica.uiKit["global/form/assistive-element/size/icon-text-gap"],
  padding: 0,
  paddingTop: recursica.uiKit["global/form/field/size/vertical-gutter"],
});

// Completely remove Mantine's focus styles for all input controls
globalStyle(`[data-mantine-color-scheme='light'] [data-variant='default']`, {
  vars: {
    "--input-bd": "unset !important",
    "--input-bg": "unset !important",
    "--input-bd-focus": "unset !important",
  },
});

globalStyle(`[data-mantine-color-scheme='dark'] [data-variant='default']`, {
  vars: {
    "--input-bd": "unset !important",
    "--input-bg": "unset !important",
    "--input-bd-focus": "unset !important",
  },
});

export const styles = {
  root,
  rootHorizontal,
  labelStacked,
  wrapperStacked,
  descriptionStacked,
  descriptionStackedWithError,
  errorStacked,
  labelHorizontal,
  wrapperHorizontal,
  descriptionHorizontal,
  descriptionHorizontalWithError,
  errorHorizontal,
  errorText,
  descriptionText,
};
