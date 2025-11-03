import { style } from "@vanilla-extract/css";
import { recursica } from "@recursica/official-release/recursica";

export const control = style({
  minWidth: recursica.uiKit["accordion/size/min-width"],
  maxWidth: recursica.uiKit["accordion/size/max-width"],
  padding: recursica.uiKit["accordion/size/padding"],
  paddingBottom: recursica.uiKit["accordion/size/header-content-gap"],
  height: recursica.uiKit["accordion/size/collapsed-height"],
  gap: recursica.uiKit["accordion/size/text-icon-gap"],
  alignItems: "center", // Ensures vertical centering
  overflow: "hidden", // Prevents content overflow
  backgroundColor: "transparent", // Ensures override of background color
  selectors: {
    "&:hover": {
      backgroundColor: "transparent", // Overrides mantine hover states
    },
  },
});

export const label = style({
  fontFamily: recursica.themes["font/subtitle/font-family"],
  fontSize: recursica.themes["font/subtitle/size"],
  fontWeight: recursica.themes["font/subtitle/weight-normal"],
  letterSpacing: recursica.themes["font/subtitle/letter-spacing"],
  color: recursica.uiKit["accordion/color/label"],
  padding: 0, // Removes default padding from mantine
  textOverflow: "ellipsis", // Truncates text if it overflows
  whiteSpace: "nowrap", // Prevents text from wrapping to the next line
  overflow: "hidden", // Prevents text from wrapping to the next line
});

export const item = style({
  minWidth: recursica.uiKit["accordion/size/min-width"],
  maxWidth: recursica.uiKit["accordion/size/max-width"],
  border: "none", // Removes default border from mantine to allow for divider
  borderBottom: "1px solid", // Adds a divider between items but hard-coded to 1px.  Should be a variable
  borderColor: recursica.uiKit["accordion/color/divider"],
  selectors: {
    "&:last-child": {
      borderBottom: "none", // Removes the divider from the last item
    },
  },
});

export const itemNoDivider = style({
  minWidth: recursica.uiKit["accordion/size/min-width"],
  maxWidth: recursica.uiKit["accordion/size/max-width"],
  border: "none", // Turns off the divider for the item
});

export const content = style({
  padding: recursica.uiKit["accordion/size/padding"],
  paddingTop: 0, // Removes the default padding from the content so we can use our header-content-gap variable
});
