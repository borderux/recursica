import type { RecursicaColors } from "../../recursica/RecursicaColorsType";
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
}

export const Icon = (props: IconProps) => {
  const SvgComponent = IconResourceMap[props.name];
  const colorStyles = {
    fill: props.color ? recursica[props.color] : "currentColor",
    color: props.color ? recursica[props.color] : "currentColor",
  };
  return (
    <SvgComponent
      width={props.size ?? DEFAULT_SIZE}
      height={props.size ?? DEFAULT_SIZE}
      title={props.title}
      style={colorStyles}
    />
  );
};
