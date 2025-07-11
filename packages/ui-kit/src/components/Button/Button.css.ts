import { createVar, style } from "@vanilla-extract/css";
import { recursica } from "../../recursica/Recursica";
import { typographies } from "../Typography";

const innerGap = createVar();

const root = style({
  boxSizing: "border-box",
  height: "auto",
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: recursica["button/size/border-radius"],
  ":hover": {
    border: "none",
  },
  ":disabled": {
    cursor: "not-allowed",
    pointerEvents: "none",
    opacity: recursica["button/color/disabled"],
  },
  selectors: {
    '&[data-notext="true"]': {
      minWidth: "auto",
      vars: {
        [innerGap]: "0px",
      },
    },
    // Button sizes
    '&[data-size="default"]': {
      height: recursica["button/size/default-size"],
      paddingInline: recursica["button/size/default-horizontal-padding"],
      minWidth: recursica["button/size/default-min-width"],
      vars: {
        [innerGap]: recursica["button/size/default-spacing"],
      },
    },
    '&[data-size="default"][data-notext="true"]': {
      height: recursica["button/size/default-size"],
      width: recursica["button/size/default-size"],
      minWidth: "auto",
      vars: {
        [innerGap]: "0px",
      },
    },
    '&[data-size="small"]': {
      height: recursica["button/size/small-size"],
      paddingInline: recursica["button/size/small-horizontal-padding"],
      minWidth: recursica["button/size/small-min-width"],
      vars: {
        [innerGap]: recursica["button/size/small-spacing"],
      },
    },
    '&[data-size="small"][data-notext="true"]': {
      paddingBlock: recursica["button/size/small-icon-padding"],
      paddingInline: recursica["button/size/small-icon-padding"],
      minWidth: "auto",
      vars: {
        [innerGap]: "0px",
      },
    },
    // Button variants
    // Contained
    '&[data-variant="contained"]': {
      backgroundColor: recursica["button/color/background-solid"],
      color: recursica["button/color/text-solid"],
    },
    '&[data-variant="contained"]:hover': {
      backgroundColor: recursica["button/color/background-solid-hover"],
    },
    '&[data-variant="contained"]:disabled': {
      opacity: recursica["button/color/disabled"],
    },
    // Outlined
    '&[data-variant="outline"]': {
      backgroundColor: "transparent",
      border: `1px solid`,
      borderColor: recursica["button/color/outline"],
      color: recursica["button/color/outline"],
    },
    '&[data-variant="outline"]:disabled': {
      opacity: recursica["button/color/disabled"],
    },
    // Text
    '&[data-variant="text"]': {
      backgroundColor: "transparent",
      color: recursica["button/color/outline"],
    },
    '&[data-variant="text"]:disabled': {
      opacity: recursica["button/color/disabled"],
    },
  },
});

const inner = style({
  height: 24,
  gap: innerGap,
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
