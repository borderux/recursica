/* eslint-disable @typescript-eslint/no-explicit-any */
import { LayerType, getLayerClassname } from "./getLayerClassname";

export interface LayerProps<T extends React.ElementType = "div"> {
  layer?: LayerType;
  children?: React.ReactNode;
  as?: T;
}

type LayerComponentProps<T extends React.ElementType = "div"> = LayerProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof LayerProps<T>>;

/**
 * Layer component to apply the different Recursica layer values to the children.
 * @param layer - The layer to apply
 * @param children - The children to render
 * @param as - The HTML element type to render (defaults to "div")
 * @param className - The className to apply
 * @returns The Layer component
 */
export function Layer<T extends React.ElementType = "div">({
  layer,
  children,
  as,
  className,
  ...props
}: LayerComponentProps<T>) {
  const Component = as || "div";
  if (!layer) {
    return children;
  }
  return (
    <Component
      className={getLayerClassname(layer) + " " + (className || "")}
      {...(props as any)}
    >
      {children}
    </Component>
  );
}
