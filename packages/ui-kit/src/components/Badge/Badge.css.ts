import { style } from "@vanilla-extract/css";
import { recursica } from "../../recursica/Recursica";
import { typographies } from "../Typography";

const root = style({
  paddingLeft: recursica["badge/size/message-horizontal-padding"],
  paddingRight: recursica["badge/size/message-horizontal-padding"],
  minWidth: recursica["badge/size/large-min-width"],
  height: recursica["badge/size/large-height"],
  borderRadius: 0,
  border: "none",
  selectors: {
    '&[data-type="counter"]': {
      borderRadius: recursica["size/border-radius/2x"],
    },
    '&[data-variant="default"]': {
      backgroundColor: recursica["badge/color/background-default"],
      color: recursica["badge/color/label-default"],
    },
    '&[data-variant="primary"]': {
      backgroundColor: recursica["badge/color/background-primary"],
      color: recursica["badge/color/label-primary"],
    },
    '&[data-variant="alert"]': {
      backgroundColor: recursica["badge/color/background-alert"],
      color: recursica["badge/color/label-alert"],
    },
    '&[data-variant="success"]': {
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
