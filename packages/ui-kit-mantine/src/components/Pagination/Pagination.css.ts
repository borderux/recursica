import { recursica } from "../../recursica/Recursica";
import { globalStyle, style } from "@vanilla-extract/css";
import { typographies } from "../Typography/const";

const root = style({
  display: "flex",
});

const dots = style({
  color: recursica["pagination/color/page-number-default"],
});

const control = style({
  ...typographies.caption,
  borderRadius: recursica["elevation/y-axis/4x"],
  width: recursica["button/size/small-size"],
  height: recursica["button/size/small-size"],
  padding: 0,
  border: 0,
  color: recursica["pagination/color/page-number-default"],
  selectors: {
    "&:hover": {
      backgroundColor:
        recursica["pagination/color/background-hover-unselected"],
    },
    '&[data-active="true"]': {
      color: recursica["pagination/color/page-number-selected"],
      backgroundColor: recursica["pagination/color/background-selected"],
    },
    '&[data-active="true"]:hover': {
      backgroundColor: recursica["pagination/color/background-hover-selected"],
    },
  },
});

globalStyle(`${root} > .mantine-Group-root`, {
  gap: recursica["pagination/size/number-spacing"],
});
globalStyle(`${dots} > svg`, {
  width: "16px !important",
  height: "16px !important",
});

export const styles = { root, control, dots };
