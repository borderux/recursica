import { style } from "@vanilla-extract/css";
import { recursica } from "../../recursica/Recursica";
import { typographies } from "../Typography";

const root = style({
  boxSizing: "border-box",
  height: recursica["button/size/default-size"],
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: recursica["button/size/border-radius"],
  paddingInline: recursica["button/size/default-horizontal-padding"],
  minWidth: recursica["button/size/default-min-width"],
  ":hover": {
    border: "none",
  },
  ":disabled": {
    cursor: "not-allowed",
    pointerEvents: "none",
    opacity: recursica["button/color/disabled"],
  },
  selectors: {
    // Button sizes
    '&[data-size="small"]': {
      height: recursica["button/size/small-size"],
      paddingInline: recursica["button/size/small-horizontal-padding"],
      minWidth: recursica["button/size/small-min-width"],
    },
    // Button styles
    // Icon
    '&[data-style="icon"]': {
      paddingInline: 0,
      minWidth: 0,
      width: recursica["button/size/default-size"],
      height: recursica["button/size/default-size"],
    },
    '&[data-style="icon"][data-size="small"]': {
      width: recursica["button/size/small-size"],
      height: recursica["button/size/small-size"],
    },
    // Button styles
    // Solid
    '&[data-variant="solid"]': {
      backgroundColor: recursica["button/color/background-solid"],
      color: recursica["button/color/text-solid"],
    },
    '&[data-variant="solid"]:hover': {
      backgroundColor: recursica["button/color/background-solid-hover"],
    },
    '&[data-variant="solid"]:disabled': {
      opacity: recursica["button/color/disabled"],
    },
    // Outline
    '&[data-variant="outline"]': {
      backgroundColor: "transparent",
      border: `1px solid`,
      borderColor: recursica["button/color/border"],
      color: recursica["button/color/border"],
    },
    '&[data-variant="outline"]:hover': {
      borderColor: recursica["button/color/border-hover"],
      color: recursica["button/color/border-hover"],
    },
    '&[data-variant="outline"]:disabled': {
      opacity: recursica["button/color/disabled"],
    },
    // Text
    '&[data-variant="text"]': {
      backgroundColor: "transparent",
      color: recursica["button/color/border"],
    },
    '&[data-variant="text"]:hover': {
      color: recursica["button/color/border-hover"],
    },
    '&[data-variant="text"]:disabled': {
      opacity: recursica["button/color/disabled"],
    },
  },
});

const inner = style({
  height: 24,
  selectors: {
    [`${root}[data-size="default"] &`]: {
      gap: recursica["button/size/default-spacing"],
    },
    [`${root}[data-size="small"] &`]: {
      gap: recursica["button/size/small-spacing"],
    },
  },
});

const label = style({
  ...typographies.button,
  display: "block",
  height: "auto",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  maxWidth: recursica["button/size/content-max-width"],
  selectors: {
    [`${root}[data-isloading="true"] &`]: {
      color: "transparent",
    },
    [`${root}[data-style="icon"] &`]: {
      display: "none",
    },
  },
});

const section = style({
  margin: 0,
});

export const styles = {
  root,
  inner,
  section,
  label,
};
