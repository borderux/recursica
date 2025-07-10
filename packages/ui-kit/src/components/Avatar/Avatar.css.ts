import { style } from "@vanilla-extract/css";
import { recursica } from "../../recursica/Recursica";
import { typographies } from "../Typography";

const root = style({
  width: recursica["avatar/size/default"],
  height: recursica["avatar/size/default"],
  background: recursica["avatar/color/background-contained"],
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
      border: `1px solid ${recursica["avatar/color/stroke-outline"]}`,
      background: recursica["avatar/color/background-outline"],
    },
    '&[data-outline="true"][data-variant="text"]': {
      border: `1px solid ${recursica["avatar/color/stroke-outline"]}`,
      background: recursica["avatar/color/background-outline"],
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
  color: recursica["avatar/color/label-contained"],
  fontWeight: 600,
  selectors: {
    // Outline variant for text
    [`${root}[data-outline="true"][data-variant="text"] &`]: {
      color: recursica["avatar/color/label-outline"],
    },
  },
});

const icon = style({
  width: recursica["avatar/size/icon-size"],
  height: recursica["avatar/size/icon-size"],
  color: recursica["avatar/color/label-contained"],
  selectors: {
    // Outline variant for icon
    [`${root}[data-outline="true"][data-variant="icon"] &`]: {
      color: recursica["avatar/color/label-outline"],
    },
  },
});

export const styles = {
  root,
  image,
  placeholder,
  icon,
};
