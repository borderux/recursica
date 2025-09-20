import { FlexProps as MantineFlexProps, StyleProp } from '@mantine/core';
import { BoxSpacers, BoxMargins, BoxPaddings, BoxBorders, BoxColors, PositionProps, BoxSizes } from '../Box/Box';
export interface FlexProps extends BoxColors, BoxSpacers, BoxMargins, BoxPaddings, BoxBorders, PositionProps, BoxSizes {
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
    /** `onClick` CSS property */
    onClick?: () => void;
}
export declare const Flex: import('../../../../../node_modules/react').ForwardRefExoticComponent<FlexProps & import('../../../../../node_modules/react').RefAttributes<HTMLDivElement>>;
