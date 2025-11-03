/* eslint-disable @typescript-eslint/no-explicit-any */
import { styles } from "./Layer.css";
import { LayerType, getLayerClassname } from "./getLayerClassname";

export interface LayerTypeProps {
  /** The theme layer that this applies to */
  Layer?: LayerType;
}
interface LayerComponentProps<T extends React.ElementType = "div"> {
  children?: React.ReactNode;
  as?: T;
  /** If set to true, it does not apply default layer styles. This is used in case if the component sets them */
  noLayerStyles?: boolean;
}

export type LayerProps<T extends React.ElementType = "div"> =
  LayerComponentProps<T> &
    Omit<React.ComponentPropsWithoutRef<T>, keyof LayerComponentProps<T>> &
    LayerTypeProps;

/**
 * Layer component to apply the different Recursica layer values to the children.
 * @param layer - The layer to apply
 * @param children - The children to render
 * @param as - The HTML element type to render (defaults to "div")
 * @param className - The className to apply
 * @param noLayerStyles - If set to true, it does not apply default layer styles. This is used in case if the component sets them
 * @returns The Layer component
 */
export function Layer<T extends React.ElementType = "div">({
  Layer,
  children,
  as,
  className,
  noLayerStyles,
  ...props
}: LayerProps<T>) {
  const Component = as || "div";
  if (!Layer) {
    return children;
  }
  const layerClassName = getLayerClassname(Layer);
  const styleClassName = noLayerStyles ? "" : styles;
  const finalClassName = [layerClassName, styleClassName, className || ""]
    .filter(Boolean)
    .join(" ");
  return (
    <Component
      {...(props as any)}
      className={finalClassName}
      data-layer={"true"}
    >
      {children}
    </Component>
  );
}
