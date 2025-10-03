import { globalStyle, style } from "@vanilla-extract/css";
import { recursica } from "../../recursica/Recursica";
import { typographies } from "../Typography";

const root = style({});

const body = style({
  gap: recursica["checkbox/size/spacing-individual"],
  alignItems: "center",
});

const label = style({
  ...typographies["body-2/normal"],
  color: recursica["form/value+placeholder/color/input-value"],
  padding: 0,
  selectors: {
    '&[data-disabled="true"]': {
      opacity: recursica["checkbox/color/disabled"],
    },
  },
});

const labelWrapper = style({});

const input = style({
  borderWidth: "2px",
  borderRadius: recursica["size/border-radius/0-5x"],
  borderColor: recursica["checkbox/color/checkbox"],
  selectors: {
    '&[data-indeterminate="true"]': {
      borderColor: recursica["checkbox/color/checkbox"],
      backgroundColor: recursica["checkbox/color/checkbox"],
    },
    "&:checked": {
      borderColor: recursica["checkbox/color/checkbox"],
      backgroundColor: recursica["checkbox/color/checkbox"],
    },
    "&:disabled": {
      opacity: recursica["checkbox/color/disabled"],
      backgroundColor: "transparent",
    },
    "&:disabled:checked": {
      backgroundColor: recursica["checkbox/color/disabled"],
    },
    '&[data-indeterminate="true"]:disabled': {
      borderColor: recursica["checkbox/color/disabled"],
      backgroundColor: recursica["checkbox/color/disabled"],
    },
  },
});

const icon = style({});

const inner = style({});

const group = style({
  display: "flex",
  selectors: {
    "&[data-label-placement='left']": {
      flexDirection: "row",
      gap: recursica["checkbox/size/spacing-inline"],
    },
    "&[data-label-placement='top']": {
      flexDirection: "column",
      gap: recursica["checkbox/size/spacing-stacked"],
    },
  },
});

const groupLabel = style({
  gap: recursica["form/label/size/spacing"],
  alignItems: "center",
});

const hideLabel = style({
  display: "none",
});

globalStyle(`${group} > [role="group"]`, {
  display: "flex",
  flexDirection: "column",
  gap: recursica["checkbox/size/spacing-group"],
});

globalStyle(`${group}[data-stacked="false"] > ${groupLabel}`, {
  width: recursica["form/label/size/inline-width"],
  paddingTop: recursica["form/label/size/label-vertical-padding"],
  paddingBottom: recursica["form/label/size/label-vertical-padding"],
  textAlign: "end",
});

export const styles = {
  group,
  groupLabel,
  label,
  root,
  labelWrapper,
  body,
  hideLabel,
  input,
  inner,
  icon,
};
