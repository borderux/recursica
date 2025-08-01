import { globalStyle, style } from "@vanilla-extract/css";
import { recursica } from "../../recursica/Recursica";
import { typographies } from "../Typography";

const root = style({});

const body = style({
  gap: recursica["checkbox/size/spacing-individual"],
  alignItems: "center",
});

const radio = style({
  borderWidth: "2px",
  borderColor: recursica["radio/color/default"],
  ":checked": {
    borderColor: recursica["radio/color/default"],
    backgroundColor: "transparent",
  },
  ":disabled": {
    backgroundColor: "transparent",
    opacity: recursica["radio/color/disabled"],
    borderColor: recursica["radio/color/default"],
  },
});

const inner = style({});

const label = style({
  ...typographies["body-2/normal"],
  color: recursica["form/value+placeholder/color/input-value"],
  padding: 0,
  selectors: {
    '&[data-disabled="true"]': {
      opacity: recursica["radio/color/disabled"],
    },
  },
});

const labelWrapper = style({});

const group = style({
  display: "flex",
  flexDirection: "column",
  gap: recursica["radio/size/spacing-stacked"],
});

const groupLabel = style({
  gap: recursica["form/label/size/spacing"],
  alignItems: "center",
});

const icon = style({
  width: recursica["radio/size/dot"],
  height: recursica["radio/size/dot"],
  color: recursica["radio/color/default"],
});

globalStyle(`${group} > [role="radiogroup"]`, {
  display: "flex",
  flexDirection: "column",
  gap: recursica["radio/size/spacing-stacked"],
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
  radio,
  inner,
  icon,
};
