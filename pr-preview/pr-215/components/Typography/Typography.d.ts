import { RecursicaColors } from '../../recursica/RecursicaColorsType';
import { TypographyVariant } from './const';
export interface TypographyProps {
    /**
     * The variant of the typography @default 'body-1/normal'
     */
    variant?: TypographyVariant;
    /**
     * The children of the typography
     */
    children: React.ReactNode;
    /**
     * The color of the typography
     */
    color?: RecursicaColors;
    /**
     * The element to render the typography as
     */
    as?: React.ElementType;
    /**
     * The text decoration of the typography
     */
    textDecoration?: "strikethrough";
    /**
     * The text align of the typography
     */
    textAlign?: "left" | "center" | "right";
    /**
     * The flex of the typography
     */
    flex?: number;
    /**
     * The opacity of the typography
     */
    opacity?: number;
}
export declare const Typography: ({ variant, children, color, as: asComponent, textDecoration, textAlign, flex, opacity, }: TypographyProps) => import("react/jsx-runtime").JSX.Element;
