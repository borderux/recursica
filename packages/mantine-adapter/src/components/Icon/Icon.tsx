import React from "react";
import { IconResourceMap } from "./IconResourceMap";

const DEFAULT_SIZE = 24;

export type IconImport = React.SVGProps<SVGSVGElement> & {
  title?: string | undefined;
};

export type IconName = keyof typeof IconResourceMap;
export const IconNames = Object.keys(IconResourceMap);

export interface IconProps {
  /** The icon name from the icon resource map */
  name?: IconName;
  /** Icon size in pixels as a number or string */
  size?: number | string;
  /** The title to apply to the icon. */
  title?: string;
  /** The color to apply to the icon. If not set, it inherits from the parent */
  color?: string;
  /** The onClick event handler for the icon */
  onClick?: React.MouseEventHandler<SVGSVGElement>;
}

export const Icon = (props: IconProps) => {
  // const SvgComponent = props.name ? IconResourceMap[props.name] : props.svg;
  const SvgComponent = IconResourceMap[props.name as IconName];
  const inlineStyles = {
    fill: props.color || "currentColor",
    color: props.color || "currentColor",
    cursor: props.onClick ? "pointer" : "inherit",
    width: props.size ?? DEFAULT_SIZE,
    height: props.size ?? DEFAULT_SIZE,
  };
  if (!SvgComponent) {
    return null;
  }
  return (
    <SvgComponent
      title={props.title}
      style={inlineStyles}
      onClick={props.onClick}
    />
  );
};
