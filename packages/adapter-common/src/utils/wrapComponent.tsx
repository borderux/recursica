import React from "react";
import { IS_DEV, useGlobalOverStyled } from "./overStyledControl";

export function wrapComponent<T>(Component: T): T {
  // If we are in production, immediately return the original component to skip all runtime overhead
  if (!IS_DEV) {
    return Component;
  }

  // If not a component, return as is
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (
    typeof Component !== "function" &&
    !(Component && (Component as any).$$typeof)
  ) {
    return Component;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Wrapped = React.forwardRef<any, any>((props, ref) => {
    const { overStyled } = props;
    const isGlobalActive = useGlobalOverStyled();

    // Use React.createElement to avoid TypeScript ref assignment mismatch in HOC
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = React.createElement(
      Component as any,
      { ...props, ref } as any,
    );

    // Only render the wrapping div if overStyled prop is active and global highlight is turned on
    if (overStyled && isGlobalActive) {
      return <div className="recursica-over-styled">{element}</div>;
    }

    return element;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Wrapped.displayName =
    (Component as any).displayName || (Component as any).name || "Component";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Wrapped as any;
}
