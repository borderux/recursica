import { style } from "@vanilla-extract/css";
import { recursica } from "../../recursica/Recursica";
import { typographies } from "../Typography";

const root = style({
  width: recursica["avatar/size/default"],
  height: recursica["avatar/size/default"],
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  selectors: {
    // Size variants
    '&[data-size="small"]': {
      width: recursica["avatar/size/small"],
      height: recursica["avatar/size/small"],
    },
    '&[data-size="large"]': {
      width: recursica["avatar/size/large"],
      height: recursica["avatar/size/large"],
    },
    // Primary variant
    '&[data-variant="primary"]': {
      background: recursica["avatar/color/background-primary"],
    },
    '&[data-variant="primary"][data-border="true"]': {
      border: `1px solid ${recursica["avatar/color/border-primary"]}`,
    },
    // Ghost variant
    '&[data-variant="ghost"]': {
      background: recursica["avatar/color/background-ghost"],
    },
    '&[data-variant="ghost"][data-border="true"]': {
      border: `1px solid ${recursica["avatar/color/border-ghost"]}`,
    },
    // Image variant
    '&[data-variant="image"][data-border="true"]': {
      border: `1px solid ${recursica["avatar/color/border-image"]}`,
    },
  },
});

const image = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const placeholder = style({
  ...typographies.overline,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "unset",
  fontWeight: 600,
  selectors: {
    // Primary variant
    [`${root}[data-variant="primary"] &`]: {
      color: recursica["avatar/color/label-primary"],
    },
    // Ghost variant
    [`${root}[data-variant="ghost"] &`]: {
      color: recursica["avatar/color/label-ghost"],
    },
    // Image variant - no color set
    [`${root}[data-variant="image"] &`]: {
      color: "unset",
    },
  },
});

const icon = style({
  selectors: {
    // Primary variant
    [`${root}[data-variant="primary"] &`]: {
      color: recursica["avatar/color/label-primary"],
    },
    // Ghost variant
    [`${root}[data-variant="ghost"] &`]: {
      color: recursica["avatar/color/label-ghost"],
    },
    // Image variant - no color set
    [`${root}[data-variant="image"] &`]: {
      color: "unset",
    },
  },
});

export const styles = {
  root,
  image,
  placeholder,
  icon,
};
