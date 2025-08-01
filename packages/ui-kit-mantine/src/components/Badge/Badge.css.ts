import { style } from "@vanilla-extract/css";
import { recursica } from "../../recursica/Recursica";
import { typographies } from "../Typography";

const root = style({
  height: recursica["badge/size/default-height"],
  minWidth: recursica["badge/size/default-min-width"],
  padding: `0px ${recursica["badge/size/padding"]}`,
  borderRadius: recursica["size/border-radius/2x"],
  border: "none",
  selectors: {
    // Size variants
    '&[data-size="large"]': {
      height: recursica["badge/size/large-height"],
      minWidth: recursica["badge/size/large-min-width"],
      padding: `0px ${recursica["badge/size/padding"]}`,
    },
    // Style variants
    '&[data-style="primary"]': {
      backgroundColor: recursica["badge/color/background-primary"],
      color: recursica["badge/color/label-primary"],
    },
    '&[data-style="ghost"]': {
      backgroundColor: recursica["badge/color/background-default"],
      color: recursica["badge/color/label-default"],
    },
    '&[data-style="alert"]': {
      backgroundColor: recursica["badge/color/background-alert"],
      color: recursica["badge/color/label-alert"],
    },
    '&[data-style="success"]': {
      backgroundColor: recursica["badge/color/background-success"],
      color: recursica["badge/color/label-success"],
    },
  },
});

const label = style({
  ...typographies.caption,
  textTransform: "none",
});

export const styles = {
  root,
  label,
};
