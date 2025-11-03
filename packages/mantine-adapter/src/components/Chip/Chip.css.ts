import { style, globalStyle } from "@vanilla-extract/css";

export const label = style({});

globalStyle(`${label} > span`, {
  display: "inline-flex",
  alignItems: "center",
});
