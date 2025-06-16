import { style } from "@vanilla-extract/css";
import { recursica } from "../../recursica/Recursica";
import { typographies } from "../Typography";

const root = style({
  display: "flex",
  flexDirection: "column",
  minWidth: recursica["dropdown/size/min-width"],
  maxWidth: recursica["dropdown/size/max-width"],
  gap: recursica["dropdown/size/spacing-inline"],
});

const wrapper = style({});

const input = style({
  height: recursica["dropdown/size/input-height"],
  border: "none",
  minWidth: recursica["dropdown/size/min-width"],
  maxWidth: recursica["dropdown/size/max-width"],
  outline: `1px solid ${recursica["dropdown/color/default"]}`,
  borderRadius: recursica["radio/size/border-radius"],
  paddingBlock: recursica["dropdown/size/vertical-padding"],
  paddingInline: recursica["dropdown/size/horizontal-padding"],
  backgroundColor: recursica["dropdown/color/background-input"],
  selectors: {
    "&::placeholder": {
      ...typographies["body-2/normal"],
      color: recursica["form/value+placeholder/color/placeholder-default"],
    },
    "&:disabled::placeholder": {
      color: recursica["form/value+placeholder/color/placeholder-disabled"],
    },
    [`${wrapper}[data-with-left-section="true"] &`]: {
      paddingLeft: `calc(${recursica["dropdown/size/horizontal-padding"]} + 24px + 8px)`,
    },
    [`${wrapper}[data-with-right-section="true"] &`]: {
      paddingRight: `calc(${recursica["dropdown/size/horizontal-padding"]} + 24px + 8px)`,
    },
    "&:focus-visible": {
      outline: `1px solid ${recursica["dropdown/color/default"]}`,
    },
    '&[data-expanded="true"]': {
      outline: `2px solid ${recursica["dropdown/color/focus"]}`,
    },
    '&[value]:not([value=""]):not([disabled])': {
      outline: `1px solid ${recursica["dropdown/color/selected"]}`,
    },
    '&[value]:not([value=""]):not([disabled]):focus-visible': {
      outline: `2px solid ${recursica["dropdown/color/selected"]}`,
    },
    '&[data-error="true"]': {
      outline: `1px solid ${recursica["dropdown/color/error"]}`,
      color: recursica["form/value+placeholder/color/value-default"],
    },
    '&[data-error="true"][value]:not([value=""]):not([disabled])': {
      outline: `1px solid ${recursica["dropdown/color/error"]}`,
    },
    '&[data-error="true"]:focus-visible, &[data-error="true"][data-expanded="true"]':
      {
        outline: `2px solid ${recursica["dropdown/color/error"]}`,
      },
  },
});

const section = style({
  width: "auto",
  color: recursica["form/icon/color/trailing-icon"],
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
    [`${wrapper}[data-disabled="true"]  &`]: {
      color: recursica["form/icon/color/trailing-icon-disabled"],
    },
  },
});

const dropdown = style({
  padding: 0,
  borderRadius: recursica["menu/size/border-radius"],
});

const option = style({
  ...typographies["body-2/normal"],
  gap: recursica["menu-item/size/spacing"],
  color: recursica["menu-item/color/text-default"],
  borderRadius: 0,
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
      color: recursica["menu-item/color/text-disabled"],
      opacity: "unset",
    },
  },
});

export const errorContainer = style({
  alignItems: "center",
  color: recursica["form/label/color/error message"],
  gap: recursica["size/spacer/0-5x"],
});

export const labelContainer = style({
  alignItems: "center",
  gap: recursica["form/label/size/spacing"],
});

export const checkbox = style({
  backgroundColor: recursica["checkbox/color/enabled"],
  color: recursica["checkbox/color/icon-enabled"],
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
  option,
  checkbox,
};
