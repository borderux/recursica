/**
 * 1. No letter spacing for subtitle
 * 2. In Figma, font subtitle/normal, but in recursica.d.ts its just subtitle (no normal)
 * 3. Does the last item in the accordion have a border bottom?
 * 4. What is the focus color?  Right now its using Mantine default
 * 5. What happens when the accordion title gets too long?
 */

import { style } from "@vanilla-extract/css";
import { recursica } from "@recursica/official-release/recursica";

/*
  | "accordion/color/label"
  | "accordion/color/icon"
  | "accordion/color/divider"
  | "accordion/size/padding"
  | "accordion/size/text-icon-gap"
  | "accordion/size/header-content-gap"
  | "accordion/size/collapsed-height"
  | "accordion/size/icon"
  | "accordion/size/min-width"
  | "accordion/size/max-width"
*/

export const control = style({
  minWidth: recursica.uiKit["accordion/size/min-width"],
  maxWidth: recursica.uiKit["accordion/size/max-width"],
  padding: recursica.uiKit["accordion/size/padding"],
  paddingBottom: recursica.uiKit["accordion/size/header-content-gap"],
  height: recursica.uiKit["accordion/size/collapsed-height"],
  gap: recursica.uiKit["accordion/size/text-icon-gap"],
  alignItems: "center",
  overflow: "hidden",
  selectors: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
});

export const label = style({
  fontFamily: recursica.themes["font/subtitle/font-family"],
  fontSize: recursica.themes["font/subtitle/size"],
  fontWeight: recursica.themes["font/subtitle/weight-normal"],
  letterSpacing: recursica.themes["font/subtitle/letter-spacing"],
  color: recursica.uiKit["accordion/color/label"],
  padding: 0,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
});

export const item = style({
  minWidth: recursica.uiKit["accordion/size/min-width"],
  maxWidth: recursica.uiKit["accordion/size/max-width"],
  border: "none",
  borderBottom: "1px solid",
  borderColor: recursica.uiKit["accordion/color/divider"],
  selectors: {
    "&:last-child": {
      borderBottom: "none",
    },
  },
});

export const itemNoDivider = style({
  minWidth: recursica.uiKit["accordion/size/min-width"],
  maxWidth: recursica.uiKit["accordion/size/max-width"],
  border: "none",
});

export const content = style({
  padding: recursica.uiKit["accordion/size/padding"],
  paddingTop: 0,
});
