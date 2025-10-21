/**
 * 1. No letter spacing for subtitle
 * 2. In Figma, font subtitle/normal, but in recursica.d.ts its just subtitle (no normal)
 * 3. Does the last item in the accordion have a border bottom?
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

  alignItems: "center",
  // gap: recursica.uiKit["accordion/size/header-content-gap"],
  // borderColor: recursica.uiKit["accordion/color/border"],
  // border: "1px solid",
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
});

export const item = style({
  minWidth: recursica.uiKit["accordion/size/min-width"],
  maxWidth: recursica.uiKit["accordion/size/max-width"],
  border: "none",
  borderBottom: "1px solid",
  borderColor: recursica.uiKit["accordion/color/divider"],
});

export const itemNoDivider = style({
  minWidth: recursica.uiKit["accordion/size/min-width"],
  maxWidth: recursica.uiKit["accordion/size/max-width"],
  border: "none",
});

export const content = style({
  // Typography styles from design tokens
  fontFamily: "var(--typography-body-1-normal-font-family)",
  fontSize: "var(--typography-body-1-normal-font-size)",
  fontWeight: "var(--typography-body-1-normal-font-weight)",
  lineHeight: "var(--typography-body-1-normal-line-height)",
  letterSpacing: "var(--typography-body-1-normal-letter-spacing)",
  padding: recursica.uiKit["accordion/size/padding"],
  paddingTop: 0,
});
