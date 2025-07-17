import { recursica } from "../../recursica/Recursica";
import { globalStyle, style } from "@vanilla-extract/css";
import { typographies } from "../Typography";

const input = style({});

const label = style({
  ...typographies.caption,
  height: 24,
  paddingLeft: recursica["chip/size/vertical-padding"],
  paddingRight: recursica["chip/size/vertical-padding"],
  borderRadius: recursica["chip/size/border-radius"],
  selectors: {
    '&:not([data-disabled])[data-checked="true"]': {
      paddingTop: 0,
      paddingBottom: 0,
      borderColor: recursica["chip/color/border-selected"],
      backgroundColor: recursica["chip/color/background-selected"],
      color: recursica["chip/color/text-selected"],
    },
    "&:not([data-disabled])": {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: recursica["chip/color/border-unselected"],
      color: recursica["chip/color/text-unselected"],
    },
    "&:not([data-disabled]):hover": {
      backgroundColor: recursica["chip/color/background-unselected"],
    },
    '&:not([data-disabled])[data-checked="true"]:hover': {
      backgroundColor: recursica["chip/color/background-selected"],
    },
    // Error state styles
    '&[data-error="true"]': {
      border: `1px solid ${recursica["chip/color/error"]}`,
      background: recursica["chip/color/background-unselected"],
    },
    // Unselected state styles
    '&:not([data-checked="true"])': {
      borderRadius: recursica["chip/size/border-radius"],
      border: `1px solid ${recursica["chip/color/border-unselected"]}`,
      background: recursica["chip/color/background-unselected"],
    },
  },
});
const root = style({
  display: "flex",
  height: 32,
});

const iconWrapper = style({
  display: "none",
});

globalStyle(`${label} [data-icon="checked"]`, {
  display: "none",
});

globalStyle(`${label} [data-icon="selected"]`, {
  display: "none",
});

globalStyle(`${label} [data-icon="unselected"]`, {
  display: "block",
});

globalStyle(`${label}[data-checked="true"] [data-icon="checked"]`, {
  display: "block",
});

globalStyle(`${label}[data-checked="true"] [data-icon="selected"]`, {
  display: "block",
});

globalStyle(`${label}[data-checked="true"] [data-icon="unselected"]`, {
  display: "none",
});

const labelWrapper = style({
  display: "flex",
  alignItems: "center",
  gap: recursica["chip/size/spacing"],
  position: "relative",
});

const additionalIconCheckedWrapper = style({
  position: "absolute",
  opacity: "30%",
  height: 16,
});

const iconCenterWrapper = style({
  alignItems: "center",
  height: 16,
});

export const styles = {
  root,
  iconWrapper,
  label,
  input,
  labelWrapper,
  additionalIconCheckedWrapper,
  iconCenterWrapper,
};
