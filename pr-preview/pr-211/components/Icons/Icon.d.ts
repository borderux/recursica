import { RecursicaColors } from '../../recursica/RecursicaColorsType';
import { IconResourceMap } from './icon_resource_map';
export type IconImport = React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
};
export type IconName = keyof typeof IconResourceMap;
export declare const IconNames: string[];
export interface IconProps {
    name: IconName;
    /** Icon size @default 24 */
    size?: 16 | 20 | 24 | 32 | 40 | 48 | "100%";
    /** The title to apply to the icon. */
    title?: string;
    /** The color to apply to the icon. If not set, it inherits from the parent */
    color?: RecursicaColors;
    /** Whether the icon should spin @default false */
    spin?: boolean;
    /** The speed of the spin animation @default "normal" */
    spinSpeed?: "slow" | "normal" | "fast" | string;
    /** The onClick event handler for the icon */
    onClick?: React.MouseEventHandler<SVGSVGElement>;
}
export declare const Icon: (props: IconProps) => import("react/jsx-runtime").JSX.Element;
