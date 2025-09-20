import { RecursicaColors } from '../../recursica/RecursicaColorsType';
export interface LogoProps {
    /**
     * The color of the logo @default 'color/1-scale/default'
     */
    color?: RecursicaColors;
    /**
     * The size of the logo @default 'medium'
     */
    size?: "small" | "medium" | "large";
    /**
     * The onClick handler
     */
    onClick?: () => void;
}
export declare function Logo({ color, size, onClick, }: LogoProps): import("react/jsx-runtime").JSX.Element;
