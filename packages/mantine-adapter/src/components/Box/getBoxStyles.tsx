import { recursica } from "@recursica/official-release";
import { RecursicaSpacersType } from "@recursica/official-release";
import {
  type BoxSpacers,
  type BoxMargins,
  type BoxPaddings,
  type BoxColors,
  type BoxBorders,
} from "./Box";
import { getBorderStyles } from "./getBorderStyles";
import { getRecursicaColor } from "../../utils";

type BoxStyles = BoxSpacers & BoxMargins & BoxPaddings & BoxColors & BoxBorders;

function getSpacer(spacer: RecursicaSpacersType | number) {
  return typeof spacer === "number" ? spacer : recursica.tokens[spacer];
}

export function getBoxStyles(props: BoxStyles) {
  const propsSpacers = {
    gap: props.gap ? getSpacer(props.gap) : undefined,
    rowGap: props.rowGap ? getSpacer(props.rowGap) : undefined,
    columnGap: props.columnGap ? getSpacer(props.columnGap) : undefined,
    m: props.m ? getSpacer(props.m) : undefined,
    my: props.my ? getSpacer(props.my) : undefined,
    mx: props.mx ? getSpacer(props.mx) : undefined,
    mt: props.mt ? getSpacer(props.mt) : undefined,
    mb: props.mb ? getSpacer(props.mb) : undefined,
    ms: props.ms ? getSpacer(props.ms) : undefined,
    me: props.me ? getSpacer(props.me) : undefined,
    ml: props.ml ? getSpacer(props.ml) : undefined,
    mr: props.mr ? getSpacer(props.mr) : undefined,
    p: props.p ? getSpacer(props.p) : undefined,
    py: props.py ? getSpacer(props.py) : undefined,
    px: props.px ? getSpacer(props.px) : undefined,
    pt: props.pt ? getSpacer(props.pt) : undefined,
    pb: props.pb ? getSpacer(props.pb) : undefined,
    ps: props.ps ? getSpacer(props.ps) : undefined,
    pe: props.pe ? getSpacer(props.pe) : undefined,
    pl: props.pl ? getSpacer(props.pl) : undefined,
    pr: props.pr ? getSpacer(props.pr) : undefined,
  };

  const borderStyles = getBorderStyles(props);

  const propsColors = {
    bg: props.bg ? getRecursicaColor(props.bg) : undefined,
  };

  return {
    propsStyles: {
      ...propsSpacers,
      ...propsColors,
    },
    inlineStyles: borderStyles,
  };
}
