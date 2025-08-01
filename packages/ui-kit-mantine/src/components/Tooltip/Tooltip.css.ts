import { recursica } from "../../recursica/Recursica";
import { style } from "@vanilla-extract/css";

const tooltip = style({
  maxWidth: recursica["tooltip/size/max-width"],
  backgroundColor: recursica["tooltip/color/background"],
  borderRadius: recursica["tooltip/size/radius"],
  paddingBlock: recursica["tooltip/size/vertical-padding"],
  paddingInline: recursica["tooltip/size/horizontal-padding"],
  boxShadow:
    `${recursica["elevations/elevation-1/x-axis"]} ` +
    `${recursica["elevations/elevation-1/y-axis"]} ` +
    `${recursica["elevations/elevation-1/blur"]} ` +
    `${recursica["elevations/elevation-1/spread"]} ` +
    `${recursica["elevations/elevation-1/color"]}`,
});

export const styles = {
  tooltip,
};
