import { createVar, style } from "@vanilla-extract/css";
import { recursica } from "../../recursica/Recursica";
import { typographies } from "../Typography";

const innerGap = createVar();

const root = style({
  boxSizing: "border-box",
  height: "auto",
  border: "none",
  borderRadius: recursica["button/size/border-radius"],
  ":hover": {
    border: "none",
  },
  ":disabled": {
    cursor: "not-allowed",
    pointerEvents: "none",
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
      paddingBlock: recursica["button/size/default-vertical-padding"],
      paddingInline: recursica["button/size/default-horizontal-padding"],
      minWidth: recursica["button/size/default-min-width"],
      vars: {
        [innerGap]: recursica["button/size/default-spacing"],
      },
    },
    '&[data-size="default"][data-notext="true"]': {
      paddingBlock: recursica["button/size/default-icon-padding"],
      paddingInline: recursica["button/size/default-icon-padding"],
      vars: {
        [innerGap]: "0px",
      },
    },
    '&[data-size="small"]': {
      paddingBlock: recursica["button/size/small-vertical-padding"],
      paddingInline: recursica["button/size/small-horizontal-padding"],
      minWidth: recursica["button/size/small-min-width"],
      vars: {
        [innerGap]: recursica["button/size/small-spacing"],
      },
    },
    '&[data-size="small"][data-notext="true"]': {
      paddingBlock: recursica["button/size/small-icon-padding"],
      paddingInline: recursica["button/size/small-icon-padding"],
      vars: {
        [innerGap]: "0px",
      },
    },
    // Button variants
    // Contained
    '&[data-variant="contained"]': {
      backgroundColor: recursica["button/color/background-contained"],
      color: recursica["button/color/text-contained-enabled"],
    },
    '&[data-variant="contained"]:hover': {
      backgroundColor: recursica["button/color/background-contained-hover"],
    },
    '&[data-variant="contained"]:disabled': {
      backgroundColor: recursica["button/color/background-contained-disabled"],
      color: recursica["button/color/text-contained-disabled"],
    },
    // Outlined
    '&[data-variant="outline"]': {
      backgroundColor: "transparent",
      border: `1px solid`,
      borderColor: recursica["button/color/text-enabled-default"],
      color: recursica["button/color/text-enabled-default"],
    },
    '&[data-variant="outline"]:disabled': {
      borderColor: recursica["button/color/text-disabled-default"],
      color: recursica["button/color/text-disabled-default"],
    },
    // Text
    '&[data-variant="text"]': {
      backgroundColor: "transparent",
      color: recursica["button/color/text-enabled-default"],
    },
    '&[data-variant="text"]:disabled': {
      color: recursica["button/color/text-disabled-default"],
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
