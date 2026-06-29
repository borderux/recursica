/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { IS_DEV, useGlobalOverStyled } from "./overStyledControl";

export function wrapComponent<T>(Component: T): T {
  // If we are in production, immediately return the original component to skip all runtime overhead
  if (!IS_DEV) {
    return Component;
  }

  // If not a component, return as is
  if (
    typeof Component !== "function" &&
    !(Component && (Component as any).$$typeof)
  ) {
    return Component;
  }

  const Wrapped = React.forwardRef<any, any>((props, ref) => {
    const { overStyled } = props;
    const isGlobalActive = useGlobalOverStyled();

    // Use React.createElement to avoid TypeScript ref assignment mismatch in HOC
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

  Wrapped.displayName =
    (Component as any).displayName || (Component as any).name || "Component";

  // Preserve compound component static properties (namespaces)
  // and wrap any component/sub-component properties recursively
  const keys = Object.keys(Component as any);
  for (const key of keys) {
    if (key === "render" || key === "$$typeof") {
      continue;
    }
    const value = (Component as any)[key];
    if (
      (typeof value === "function" || (value && (value as any).$$typeof)) &&
      key[0] === key[0].toUpperCase()
    ) {
      (Wrapped as any)[key] = wrapComponent(value);
    } else {
      (Wrapped as any)[key] = value;
    }
  }

  return Wrapped as any;
}
