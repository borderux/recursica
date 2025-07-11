import { style } from "@vanilla-extract/css";
import { recursica } from "../../recursica/Recursica";
import { typographies } from "../Typography";

const root = style({
  width: recursica["avatar/size/default"],
  height: recursica["avatar/size/default"],
  background: recursica["avatar/color/background-primary"],
  borderRadius: "100%",
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
    // Outline variant for icon and text
    '&[data-outline="true"][data-variant="icon"]': {
      border: `1px solid ${recursica["avatar/color/border-ghost"]}`,
      background: recursica["avatar/color/background-ghost"],
    },
    '&[data-outline="true"][data-variant="text"]': {
      border: `1px solid ${recursica["avatar/color/border-ghost"]}`,
      background: recursica["avatar/color/background-ghost"],
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
  color: recursica["avatar/color/label-primary"],
  fontWeight: 600,
  selectors: {
    // Outline variant for text
    [`${root}[data-outline="true"][data-variant="text"] &`]: {
      color: recursica["avatar/color/label-ghost"],
    },
  },
});

const icon = style({
  color: recursica["avatar/color/label-primary"],
  selectors: {
    // Outline variant for icon
    [`${root}[data-outline="true"][data-variant="icon"] &`]: {
      color: recursica["avatar/color/label-ghost"],
    },
  },
});

export const styles = {
  root,
  image,
  placeholder,
  icon,
};
