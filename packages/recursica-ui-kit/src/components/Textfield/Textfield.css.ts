import { style } from "@vanilla-extract/css";
import { recursica } from "../../recursica/Recursica";
import { typographies } from "../Typography";

const root = style({
  display: "flex",
  minWidth: recursica["text-field/size/min-width"],
  maxWidth: recursica["text-field/size/max-width"],
  selectors: {
    '&[data-stacked="true"]': {
      gap: recursica["text-field/size/spacing-stacked"],
      flexDirection: "column",
    },
    '&[data-stacked="false"]': {
      gap: recursica["text-field/size/spacing-inline"],
      flexDirection: "row",
      alignItems: "center",
    },
  },
});

const wrapper = style({
  margin: 0,
});

const input = style({
  ...typographies["body-2/normal"],
  overflow: "hidden",
  textOverflow: "ellipsis",
  minHeight: recursica["text-field/size/min-input-height"],
  height: "auto",
  border: "none",
  minWidth: recursica["text-field/size/min-width"],
  maxWidth: recursica["text-field/size/max-width"],
  outline: `1px solid ${recursica["text-field/color/default"]}`,
  borderRadius: recursica["size/border-radius/default"],
  paddingBlock: recursica["text-field/size/vertical-padding"],
  paddingInline: recursica["text-field/size/horizontal-padding"],
  backgroundColor: recursica["text-field/color/background-input"],
  selectors: {
    '&[data-wrap="false"]': {
      height: recursica["text-field/size/min-input-height"],
      whiteSpace: "nowrap",
    },
    "&::placeholder": {
      ...typographies["body-2/normal"],
      color: recursica["form/value+placeholder/color/placeholder-default"],
    },
    "&:disabled::placeholder": {
      color: recursica["form/value+placeholder/color/placeholder-disabled"],
    },
    "&:disabled": {
      color: recursica["form/value+placeholder/color/value-disabled"],
      backgroundColor: recursica["text-field/color/background-input-disabled"],
    },
    "&[readonly]": {
      backgroundColor: recursica["text-field/color/read-only-background"],
      color: recursica["form/value+placeholder/color/value-default"],
    },
    [`${wrapper}[data-with-left-section="true"] &`]: {
      paddingLeft: `calc(${recursica["text-field/size/horizontal-padding"]} + 24px + 8px)`,
    },
    [`${wrapper}[data-with-right-section="true"] &`]: {
      paddingRight: `calc(${recursica["text-field/size/horizontal-padding"]} + 24px + 8px)`,
    },
    [`
      &[readonly]:focus-visible
    `]: {
      outline: `1px solid ${recursica["text-field/color/read-only-stroke"]}`,
    },
    [`
      &[data-valued="true"]:not([disabled]):not([readonly]),
      &[value]:not([value=""]):not([disabled]):not([readonly])
      `]: {
      outline: `1px solid ${recursica["text-field/color/valued"]}`,
    },
    [`
      &:focus-visible:not([readonly]):not([disabled]),
      &[data-valued="true"]:not([disabled]):not([readonly]):focus-visible, 
      &[value]:not([value=""]):not([disabled]):not([readonly]):focus-visible
      `]: {
      outline: `2px solid ${recursica["text-field/color/valued"]}`,
    },
    '&[data-error="true"]': {
      outline: `1px solid ${recursica["text-field/color/error"]}`,
      color: recursica["form/value+placeholder/color/value-default"],
    },
    [`
      &[data-error="true"][data-valued="true"]:not([disabled]):not([readonly]),
      &[data-error="true"][value]:not([value=""]):not([disabled]):not([readonly])
      `]: {
      outline: `1px solid ${recursica["text-field/color/error"]}`,
    },
    [`
      &[data-error="true"]:not([readonly]):not([disabled]):focus-visible, 
      &[data-error="true"][data-expanded="true"],
      &[data-error="true"][data-valued="true"]:not([disabled]):not([readonly]):focus-visible, 
      &[data-error="true"][value]:not([value=""]):not([disabled]):not([readonly]):focus-visible
      `]: {
      outline: `2px solid ${recursica["text-field/color/error"]}`,
    },
  },
});

const section = style({
  width: "auto",
  alignItems: "baseline",
  color: recursica["form/icon/color/trailing-icon"],
  paddingBlock: recursica["text-field/size/vertical-padding"],
  paddingInline: recursica["text-field/size/horizontal-padding"],
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
      paddingLeft: recursica["text-field/size/horizontal-padding"],
    },
    [`${wrapper}[data-disabled="true"]  &`]: {
      color: recursica["form/icon/color/trailing-icon-disabled"],
    },
  },
});

export const description = style({
  ...typographies.caption,
  color: recursica["form/label/color/assistive text"],
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

export const styles = {
  root,
  description,
  wrapper,
  input,
  section,
};
