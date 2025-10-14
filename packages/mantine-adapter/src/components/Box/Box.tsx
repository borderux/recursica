import type {
  RecursicaSpacersType,
  RecursicaColors,
} from "@recursica/official-release";
import {
  type BoxProps as MantineBoxProps,
  Box as MantineBox,
  type StyleProp,
} from "@mantine/core";
import { forwardRef } from "react";
import { getBoxStyles } from "../../utils/getBoxStyles";

export interface BoxColors {
  /** Background color, theme key: RecursicaColors */
  bg?: RecursicaColors;
}

export interface BoxSpacers {
  /** Gap */
  gap?: RecursicaSpacersType | number;
  /** Row gap */
  rowGap?: RecursicaSpacersType | number;
  /** Column gap */
  columnGap?: RecursicaSpacersType | number;
}

export interface BoxSizes {
  /** Width */
  w?: number | string;
  /** Height */
  h?: number | string;
}

export interface BoxMargins {
  /** Margin, theme key: RecursicaSpacersType */
  m?: RecursicaSpacersType;
  /** MarginBlock, theme key: RecursicaSpacersType */
  my?: RecursicaSpacersType;
  /** MarginInline, theme key: RecursicaSpacersType */
  mx?: RecursicaSpacersType;
  /** MarginTop, theme key: RecursicaSpacersType */
  mt?: RecursicaSpacersType;
  /** MarginBottom, theme key: RecursicaSpacersType */
  mb?: RecursicaSpacersType;
  /** MarginInlineStart, theme key: RecursicaSpacersType */
  ms?: RecursicaSpacersType;
  /** MarginInlineEnd, theme key: RecursicaSpacersType */
  me?: RecursicaSpacersType;
  /** MarginLeft, theme key: RecursicaSpacersType */
  ml?: RecursicaSpacersType;
  /** MarginRight, theme key: RecursicaSpacersType */
  mr?: RecursicaSpacersType;
}

export interface BoxPaddings {
  /** Padding, theme key: RecursicaSpacersType */
  p?: RecursicaSpacersType | number;
  /** PaddingBlock, theme key: RecursicaSpacersType */
  py?: RecursicaSpacersType | number;
  /** PaddingInline, theme key: RecursicaSpacersType */
  px?: RecursicaSpacersType | number;
  /** PaddingTop, theme key: RecursicaSpacersType */
  pt?: RecursicaSpacersType | number;
  /** PaddingBottom, theme key: RecursicaSpacersType */
  pb?: RecursicaSpacersType | number;
  /** PaddingInlineStart, theme key: RecursicaSpacersType */
  ps?: RecursicaSpacersType | number;
  /** PaddingInlineEnd, theme key: RecursicaSpacersType */
  pe?: RecursicaSpacersType | number;
  /** PaddingLeft, theme key: RecursicaSpacersType */
  pl?: RecursicaSpacersType | number;
  /** PaddingRight, theme key: RecursicaSpacersType */
  pr?: RecursicaSpacersType | number;
}

export type BorderStyle =
  | "dotted"
  | "dashed"
  | "solid"
  | "double"
  | "groove"
  | "ridge"
  | "inset"
  | "outset"
  | "none"
  | "hidden";

export type BorderWidth = number | "thin" | "medium" | "thick" | `${number}px`;

export interface BoxBorders {
  /** BorderRadius, theme key: RecursicaBorderRadiusType */
  br?: RecursicaSpacersType;
  /** BorderWidth, string value, e.g. '1px' */
  bw?: BorderWidth;
  /** BorderColor, theme key: RecursicaColors */
  bc?: RecursicaColors;
  /** BorderStyle, theme key: BorderStyle */
  bs?: BorderStyle;
  /** BorderTopWidth, string value, e.g. '1px' */
  btw?: string;
  /** BorderTopColor, theme key: RecursicaColors */
  btc?: RecursicaColors;
  /** BorderTopStyle, theme key: BorderStyle */
  bts?: BorderStyle;
  /** BorderBottomWidth, string value, e.g. '1px' */
  bbw?: BorderWidth;
  /** BorderBottomColor, theme key: RecursicaColors */
  bbc?: RecursicaColors;
  /** BorderBottomStyle, theme key: BorderStyle */
  bbs?: BorderStyle;
  /** BorderLeftWidth, string value, e.g. '1px' */
  blw?: BorderWidth;
  /** BorderLeftColor, theme key: RecursicaColors */
  blc?: RecursicaColors;
  /** BorderLeftStyle, theme key: BorderStyle */
  bls?: BorderStyle;
  /** BorderRightWidth, string value, e.g. '1px' */
  brw?: BorderWidth;
  /** BorderRightColor, theme key: RecursicaColors */
  brc?: RecursicaColors;
  /** BorderRightStyle, theme key: BorderStyle */
  brs?: BorderStyle;
}

export interface PositionProps {
  /** Position */
  pos?: StyleProp<React.CSSProperties["position"]>;
  top?: StyleProp<React.CSSProperties["top"]>;
  left?: StyleProp<React.CSSProperties["left"]>;
  bottom?: StyleProp<React.CSSProperties["bottom"]>;
  right?: StyleProp<React.CSSProperties["right"]>;
  inset?: StyleProp<React.CSSProperties["inset"]>;
  display?: StyleProp<React.CSSProperties["display"]>;
  flex?: StyleProp<React.CSSProperties["flex"]>;
}

export interface BoxProps
  extends BoxColors,
    BoxMargins,
    BoxPaddings,
    BoxBorders,
    PositionProps,
    BoxSizes {
  /** Children */
  children?: React.ReactNode;
  style?: React.CSSProperties;
  hiddenFrom?: MantineBoxProps["hiddenFrom"];
  visibleFrom?: MantineBoxProps["visibleFrom"];
  className?: string;
  /**
   * The opacity of the box
   */
  opacity?: number;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const { propsStyles, inlineStyles } = getBoxStyles(props);
  const styles = props.style ?? {};
  const combinedStyles = { ...inlineStyles, ...styles };

  return (
    <MantineBox
      ref={ref}
      {...props}
      {...propsStyles}
      opacity={props.opacity}
      style={combinedStyles}
    />
  );
});

Box.displayName = "Box";
