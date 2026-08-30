/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { IS_DEV, useGlobalOverStyled } from "./overStyledControl";

const REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
const REACT_MEMO_TYPE = Symbol.for("react.memo");

/**
 * Whether `Component` is capable of receiving a `ref` at all — a class component, or a
 * `forwardRef` (optionally wrapped in `memo`). Plain function components can't, and forcing a
 * real ref onto one via `React.createElement` triggers React's generic "function components
 * cannot be given refs" dev warning with no pointer back to which wrapped component caused it.
 */
function canAcceptRef(Component: any): boolean {
  if (!Component) return false;
  if (Component.prototype && Component.prototype.isReactComponent) return true;
  if (Component.$$typeof === REACT_FORWARD_REF_TYPE) return true;
  if (Component.$$typeof === REACT_MEMO_TYPE)
    return canAcceptRef(Component.type);
  return false;
}

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

  const acceptsRef = canAcceptRef(Component);
  const wrappedDisplayName =
    (Component as any).displayName || (Component as any).name || "Component";

  const Wrapped = React.forwardRef<any, any>((props, ref) => {
    const { overStyled } = props;
    const isGlobalActive = useGlobalOverStyled();

    // Only forward `ref` into the wrapped component's own props if it can actually accept one —
    // otherwise drop it silently (a real ref attached to a component that never renders it is a
    // no-op either way) and, in dev, log a clearer message pointing at the real cause instead of
    // letting React's generic warning fire with no context.
    if (IS_DEV && ref && !acceptsRef) {
      console.warn(
        `[wrapComponent] "${wrappedDisplayName}" does not support refs (not a class component or ` +
          `forwardRef) — the ref passed to it was dropped instead of forcing React's "function ` +
          `components cannot be given refs" warning.`,
      );
    }
    const elementProps = acceptsRef ? { ...props, ref } : props;

    // Use React.createElement to avoid TypeScript ref assignment mismatch in HOC
    const element = React.createElement(Component as any, elementProps as any);

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
