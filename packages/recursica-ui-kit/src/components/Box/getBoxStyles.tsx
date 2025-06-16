import { recursica } from "../../recursica/Recursica";
import {
  type BoxSpacers,
  type BoxMargins,
  type BoxPaddings,
  type BoxColors,
  type BoxBorders,
} from "./Box";
import { getBorderStyles } from "./getBorderStyles";

type BoxStyles = BoxSpacers & BoxMargins & BoxPaddings & BoxColors & BoxBorders;

export function getBoxStyles(props: BoxStyles) {
  const propsSpacers = {
    gap: props.gap ? recursica[props.gap] : undefined,
    rowGap: props.rowGap ? recursica[props.rowGap] : undefined,
    columnGap: props.columnGap ? recursica[props.columnGap] : undefined,
    m: props.m ? recursica[props.m] : undefined,
    my: props.my ? recursica[props.my] : undefined,
    mx: props.mx ? recursica[props.mx] : undefined,
    mt: props.mt ? recursica[props.mt] : undefined,
    mb: props.mb ? recursica[props.mb] : undefined,
    ms: props.ms ? recursica[props.ms] : undefined,
    me: props.me ? recursica[props.me] : undefined,
    ml: props.ml ? recursica[props.ml] : undefined,
    mr: props.mr ? recursica[props.mr] : undefined,
    p: props.p ? recursica[props.p] : undefined,
    py: props.py ? recursica[props.py] : undefined,
    px: props.px ? recursica[props.px] : undefined,
    pt: props.pt ? recursica[props.pt] : undefined,
    pb: props.pb ? recursica[props.pb] : undefined,
    ps: props.ps ? recursica[props.ps] : undefined,
    pe: props.pe ? recursica[props.pe] : undefined,
    pl: props.pl ? recursica[props.pl] : undefined,
    pr: props.pr ? recursica[props.pr] : undefined,
  };

  const borderStyles = getBorderStyles(props);

  const propsColors = {
    bg: props.bg ? recursica[props.bg] : undefined,
  };

  return {
    propsStyles: {
      ...propsSpacers,
      ...propsColors,
    },
    inlineStyles: borderStyles,
  };
}
