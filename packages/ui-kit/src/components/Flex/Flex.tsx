/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  type FlexProps as MantineFlexProps,
  Flex as MantineFlex,
  type StyleProp,
} from "@mantine/core";
import { forwardRef } from "react";
import {
  type BoxSpacers,
  type BoxMargins,
  type BoxPaddings,
  type BoxBorders,
  type BoxColors,
  type PositionProps,
  type BoxSizes,
} from "../Box/Box";
import { getBoxStyles } from "../Box/getBoxStyles";

export interface FlexProps
  extends BoxColors,
    BoxSpacers,
    BoxMargins,
    BoxPaddings,
    BoxBorders,
    PositionProps,
    BoxSizes {
  /** Children */
  children?: React.ReactNode;
  style?: React.CSSProperties;
  hiddenFrom?: MantineFlexProps["hiddenFrom"];
  visibleFrom?: MantineFlexProps["visibleFrom"];
  className?: string;
  /** `align-items` CSS property */
  align?: StyleProp<React.CSSProperties["alignItems"]>;
  /** `justify-content` CSS property */
  justify?: StyleProp<React.CSSProperties["justifyContent"]>;
  /** `flex-wrap` CSS property */
  wrap?: StyleProp<React.CSSProperties["flexWrap"]>;
  /** `flex-direction` CSS property */
  direction?: StyleProp<React.CSSProperties["flexDirection"]>;
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>((props, ref) => {
  const {
    gap: _gap,
    rowGap: _rowGap,
    columnGap: _columnGap,
    m: _m,
    my: _my,
    mx: _mx,
    mt: _mt,
    mb: _mb,
    ms: _ms,
    me: _me,
    ml: _ml,
    mr: _mr,
    p: _p,
    py: _py,
    px: _px,
    pt: _pt,
    pb: _pb,
    ps: _ps,
    pe: _pe,
    pl: _pl,
    pr: _pr,
    br: _br,
    bw: _bw,
    bc: _bc,
    bs: _bs,
    btw: _btw,
    btc: _btc,
    bts: _bts,
    bbw: _bbw,
    bbc: _bbc,
    bbs: _bbs,
    blw: _blw,
    blc: _blc,
    bls: _bls,
    brw: _brw,
    brc: _brc,
    brs: _brs,
    ...restProps
  } = props;
  const { propsStyles, inlineStyles } = getBoxStyles(props);
  const styles = props.style ?? {};
  const combinedStyles = {
    ...inlineStyles,
    ...styles,
  };
  return (
    <MantineFlex
      style={combinedStyles}
      ref={ref}
      {...restProps}
      {...propsStyles}
    />
  );
});

Flex.displayName = "Flex";
