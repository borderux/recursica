import { style } from "@vanilla-extract/css";
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
});

export const descriptionStacked = style({
  gridRow: "3", // After label (row 1) and wrapper (row 2)
  marginTop: recursica.uiKit["global/form/layout/stacked/label-field-gap"],
});

export const errorStacked = style({
  gridRow: "3", // Same row as description - error will overlay it
  marginTop: recursica.uiKit["global/form/layout/stacked/label-field-gap"],
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
});

export const descriptionHorizontal = style({
  gridColumn: "2",
  gridRow: "2",
  marginTop: recursica.uiKit["global/form/layout/stacked/label-field-gap"],
});

export const errorHorizontal = style({
  gridColumn: "2",
  gridRow: "2", // Same row as description - error will overlay it
  marginTop: recursica.uiKit["global/form/layout/stacked/label-field-gap"],
});

// Hide description when error is present in the same row for horizontal layout
export const descriptionHorizontalWithError = style({
  display: "none",
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
};
