import { recursica } from "../../recursica/Recursica";
import { style } from "@vanilla-extract/css";

const tooltip = style({
  maxWidth: recursica["tooltip/size/max-width"],
  backgroundColor: recursica["tooltip/color/background"],
  borderRadius: recursica["tooltip/size/radius"],
  paddingBlock: recursica["tooltip/size/vertical-padding"],
  paddingInline: recursica["tooltip/size/horizontal-padding"],
  boxShadow: recursica["effect/elevation/elevation-01"],
});

export const styles = {
  tooltip,
};
