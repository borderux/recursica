import type { RecursicaColors } from "../../recursica/RecursicaColorsType";
import { spinning, spinningFast, spinningSlow } from "./Icon.css";
import { IconResourceMap } from "./icon_resource_map";
import { recursica } from "../../recursica/Recursica";
const DEFAULT_SIZE = 24;

export type IconImport = React.SVGProps<SVGSVGElement> & {
  title?: string | undefined;
};

export type IconName = keyof typeof IconResourceMap;
export const IconNames = Object.keys(IconResourceMap);

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
}

export const Icon = (props: IconProps) => {
  const SvgComponent = IconResourceMap[props.name];
  const colorStyles = {
    fill: props.color ? recursica[props.color] : "currentColor",
    color: props.color ? recursica[props.color] : "currentColor",
  };

  const getSpinClass = () => {
    if (!props.spin) return undefined;

    switch (props.spinSpeed) {
      case "normal":
        return spinning;
      case "fast":
        return spinningFast;
      case "slow":
      default:
        return spinningSlow;
    }
  };

  return (
    <SvgComponent
      width={props.size ?? DEFAULT_SIZE}
      height={props.size ?? DEFAULT_SIZE}
      title={props.title}
      style={colorStyles}
      className={getSpinClass()}
    />
  );
};
