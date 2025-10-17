import { style } from "@vanilla-extract/css";
import { recursica } from "@recursica/official-release/recursica";

export const control = style({
  minWidth: recursica.uiKit["accordion/size/min-width"],
  maxWidth: recursica.uiKit["accordion/size/max-width"],
  padding: recursica.uiKit["accordion/size/padding"],
  paddingBottom: recursica.uiKit["accordion/size/header-content-gap"],
  alignItems: "center",
  // gap: recursica.uiKit["accordion/size/header-content-gap"],
  // borderColor: recursica.uiKit["accordion/color/border"],
  // border: "1px solid",
});

export const label = style({
  // Typography styles from design tokens
  fontFamily: "var(--typography-subtitle-1-normal-font-family)",
  fontSize: "var(--typography-subtitle-1-normal-font-size)",
  fontWeight: "var(--typography-subtitle-1-normal-font-weight)",
  lineHeight: "var(--typography-subtitle-1-normal-line-height)",
  letterSpacing: "var(--typography-subtitle-1-normal-letter-spacing)",
  padding: 0,
  // color: "var(--accordion-color-label)",
});

export const item = style({
  minWidth: recursica.uiKit["accordion/size/min-width"],
  maxWidth: recursica.uiKit["accordion/size/max-width"],
  borderColor: recursica.uiKit["accordion/color/divider"],
  border: "1px solid",
  padding: "0",
  //flexDirection: "column",
  // alignItems: "flex-start",
  // gap: "var(--accordion-size-spacing)",
  // borderColor: "var(--accordion-color-border)",
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
