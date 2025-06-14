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
} from "../Box/Box";
import { getBoxStyles } from "../Box/getBoxStyles";

export interface FlexProps
  extends BoxColors,
    BoxSpacers,
    BoxMargins,
    BoxPaddings,
    BoxBorders,
    PositionProps {
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
  const { propsStyles, inlineStyles } = getBoxStyles(props);
  const styles = props.style ?? {};
  const combinedStyles = {
    ...inlineStyles,
    ...styles,
  };
  return (
    <MantineFlex style={combinedStyles} ref={ref} {...props} {...propsStyles} />
  );
});

Flex.displayName = "Flex";
