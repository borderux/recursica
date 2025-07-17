import { style } from "@vanilla-extract/css";
import { recursica } from "../../recursica/Recursica";
import { typographies } from "../Typography";

const control = style({
  height: recursica["accordion/size/height"],
  minWidth: recursica["accordion/size/min-width"],
  padding: recursica["accordion/size/padding"],
  alignItems: "center",
  gap: recursica["accordion/size/spacing"],
});

const label = style({
  ...typographies["subtitle-1/normal"],
  padding: 0,
  color: recursica["accordion/color/label"],
});

const item = style({
  minWidth: recursica["accordion/size/min-width"],
  flexDirection: "column",
  alignItems: "flex-start",
  gap: recursica["accordion/size/spacing"],
  borderColor: recursica["accordion/color/border"],
});

const content = style({
  ...typographies["body-1/normal"],
  padding: recursica["accordion/size/padding"],
  paddingTop: 0,
});

export const styles = {
  control,
  label,
  item,
  content,
};
