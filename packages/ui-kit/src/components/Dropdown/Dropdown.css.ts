import { style } from "@vanilla-extract/css";
import { recursica } from "../../recursica/Recursica";
import { typographies } from "../Typography";

const root = style({
  display: "flex",
  width: "100%",
  flexDirection: "column",
  minWidth: recursica["dropdown/size/min-width"],
  maxWidth: recursica["dropdown/size/max-width"],
  gap: recursica["dropdown/size/spacing-inline"],
});

const wrapper = style({});

const input = style({
  ...typographies["body-2/normal"],
  height: recursica["dropdown/size/input-height"],
  border: "none",
  minWidth: recursica["dropdown/size/min-width"],
  maxWidth: recursica["dropdown/size/max-width"],
  outline: `1px solid ${recursica["dropdown/color/border"]}`,
  borderRadius: recursica["size/border-radius/default"],
  paddingBlock: recursica["dropdown/size/vertical-padding"],
  paddingInline: recursica["dropdown/size/horizontal-padding"],
  backgroundColor: recursica["dropdown/color/background-input"],
  selectors: {
    "&::placeholder": {
      ...typographies["body-2/normal"],
      color: recursica["form/value+placeholder/color/input-value"],
    },
    "&:disabled::placeholder": {
      opacity: recursica["dropdown/color/disabled"],
    },
    [`${wrapper}[data-with-left-section="true"] &`]: {
      paddingLeft: `calc(${recursica["dropdown/size/horizontal-padding"]} + 24px + 8px)`,
    },
    [`${wrapper}[data-with-right-section="true"] &`]: {
      paddingRight: `calc(${recursica["dropdown/size/horizontal-padding"]} + 24px + 8px)`,
    },
    "&:focus-visible": {
      outline: `1px solid ${recursica["dropdown/color/border"]}`,
    },
    '&[data-expanded="true"]': {
      outline: `2px solid ${recursica["dropdown/color/border-selected"]}`,
    },
    '&[value]:not([value=""]):not([disabled])': {
      outline: `1px solid ${recursica["dropdown/color/border-selected"]}`,
    },
    '&[value]:not([value=""]):not([disabled]):focus-visible': {
      outline: `2px solid ${recursica["dropdown/color/border-selected"]}`,
    },
    '&[data-error="true"]': {
      outline: `1px solid ${recursica["dropdown/color/border-error"]}`,
      color: recursica["form/value+placeholder/color/input-value"],
    },
    '&[data-error="true"][value]:not([value=""]):not([disabled])': {
      outline: `1px solid ${recursica["dropdown/color/border-error"]}`,
    },
    '&[data-error="true"]:focus-visible, &[data-error="true"][data-expanded="true"]':
      {
        outline: `2px solid ${recursica["dropdown/color/border-error"]}`,
      },
  },
});

const section = style({
  width: "auto",
  color: "currentcolor",
  paddingBlock: recursica["dropdown/size/vertical-padding"],
  paddingInline: recursica["dropdown/size/horizontal-padding"],
  selectors: {
    '&[data-position="left"]': {
      paddingRight: 0,
    },
    '&[data-position="right"]': {
      paddingLeft: 0,
    },
    [`${input}[data-expanded="true"] ~ &`]: {
      rotate: "180deg",
      paddingRight: 0,
      paddingLeft: recursica["dropdown/size/horizontal-padding"],
    },
  },
});

const dropdown = style({
  padding: 0,
  borderRadius: recursica["menu/size/border-radius"],
  maxHeight: 250,
  overflowY: "auto",
});

export const optionStyle = style({
  ...typographies["body-2/normal"],
  gap: recursica["menu-item/size/spacing"],
  color: recursica["form/value+placeholder/color/input-value"],
  borderRadius: 0,
  width: "100%",
  paddingBlock: recursica["menu-item/size/item-vertical-padding"],
  paddingInline: recursica["menu-item/size/item-horizontal-padding"],
  backgroundColor: recursica["menu-item/color/default"],
  ":hover": {
    backgroundColor: recursica["menu-item/color/focused"],
  },
  selectors: {
    '&[aria-selected="true"]': {
      backgroundColor: recursica["menu-item/color/selected"],
    },
    '&[data-combobox-disabled="true"]': {
      backgroundColor: recursica["menu-item/color/default"],
      opacity: recursica["dropdown/color/disabled"],
    },
  },
});

const option = style({
  padding: 0,
  ":hover": {
    backgroundColor: "transparent",
  },
});

export const errorContainer = style({
  alignItems: "center",
  color: recursica["form/label/color/error-message"],
  gap: recursica["size/spacer/0-5x"],
});

export const labelContainer = style({
  alignItems: "center",
  gap: recursica["form/label/size/spacing"],
});

const checkbox = style({
  backgroundColor: recursica["dropdown/color/background-input"],
  color: recursica["checkbox/color/icon"],
  width: 20,
  height: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const styles = {
  root,
  wrapper,
  input,
  section,
  dropdown,
  checkbox,
  option,
};
