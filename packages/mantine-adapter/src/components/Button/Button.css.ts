import { style } from "@vanilla-extract/css";
import { recursica } from "@recursica/official-release";

const root = style({
  boxSizing: "border-box",
  height: recursica.uiKit["button/size/default/height"],
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: recursica.uiKit["button/size/border-radius"],
  paddingInline: recursica.uiKit["button/size/default/horizontal-padding"],
  minWidth: recursica.uiKit["button/size/default/min-width"],
  ":hover": {
    border: "none",
  },
  ":disabled": {
    cursor: "not-allowed",
    pointerEvents: "none",
    opacity: recursica.uiKit["button/color/disabled"],
  },
  selectors: {
    // Button sizes
    '&[data-size="small"]': {
      height: recursica.uiKit["button/size/small/height"],
      paddingInline: recursica.uiKit["button/size/small/horizontal-padding"],
      minWidth: recursica.uiKit["button/size/small/min-width"],
    },
    // Button styles
    // Icon
    '&[data-style="icon"]': {
      paddingInline: 0,
      minWidth: 0,
      width: recursica.uiKit["button/size/default/height"],
      height: recursica.uiKit["button/size/default/height"],
    },
    '&[data-style="icon"][data-size="small"]': {
      width: recursica.uiKit["button/size/small/height"],
      height: recursica.uiKit["button/size/small/height"],
    },
    // Button styles
    // Solid
    '&[data-variant="solid"]': {
      backgroundColor: recursica.uiKit["button/color/background-solid"],
      color: recursica.uiKit["button/color/text-solid"],
    },
    '&[data-variant="solid"]:hover': {
      backgroundColor: recursica.uiKit["button/color/background-solid-hover"],
    },
    '&[data-variant="solid"]:disabled': {
      opacity: recursica.uiKit["button/color/disabled"],
    },
    // Outline
    '&[data-variant="outline"]': {
      backgroundColor: "transparent",
      border: `1px solid`,
      borderColor: recursica.uiKit["button/color/outline"],
      color: recursica.uiKit["button/color/outline"],
    },
    '&[data-variant="outline"]:hover': {
      borderColor: recursica.uiKit["button/color/outline-hover"],
      color: recursica.uiKit["button/color/outline-hover"],
    },
    '&[data-variant="outline"]:disabled': {
      opacity: recursica.uiKit["button/color/disabled"],
    },
    // Text
    '&[data-variant="text"]': {
      backgroundColor: "transparent",
      color: recursica.uiKit["button/color/outline"],
    },
    '&[data-variant="text"]:hover': {
      color: recursica.uiKit["button/color/outline-hover"],
    },
    '&[data-variant="text"]:disabled': {
      opacity: recursica.uiKit["button/color/disabled"],
    },
  },
});

const inner = style({
  height: 24,
  selectors: {
    [`${root}[data-size="default"] &`]: {
      gap: recursica.uiKit["button/size/default/icon"],
    },
    [`${root}[data-size="small"] &`]: {
      gap: recursica.uiKit["button/size/small/icon"],
    },
  },
});

const label = style({
  display: "block",
  height: "auto",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  maxWidth: recursica.uiKit["button/size/content-max-width"],
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
