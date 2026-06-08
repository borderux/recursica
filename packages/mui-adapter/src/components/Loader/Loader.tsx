import React, { forwardRef } from "react";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Loader.module.css";

import { type RecursicaLoaderProps } from "@recursica/adapter-common";

export type LoaderProps = RecursicaOverStyled<
  React.HTMLAttributes<HTMLSpanElement> & RecursicaLoaderProps
>;

export const Loader = forwardRef<HTMLSpanElement, LoaderProps>(function Loader(
  { variant = "oval", size = "default", overStyled = false, ...rest },
  ref,
) {
  const mapSize = {
    sm: "small",
    md: "default",
    lg: "large",
    small: "small",
    default: "default",
    large: "large",
  } as const;

  const resolvedSize = mapSize[size] || "default";

  // Strip all visual override injections unless developer has specifically opted into overStyling.
  // External layout props like margins are safely preserved.
  const sanitizedProps = filterStylingProps(rest, overStyled);

  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  const renderChildren = () => {
    if (variant === "bars" || variant === "dots") {
      return (
        <>
          <span />
          <span />
          <span />
        </>
      );
    }
    return null; // Oval is handled purely via CSS ::after
  };

  return (
    <span
      ref={ref}
      data-variant={variant}
      data-size={resolvedSize}
      {...sanitizedProps}
      className={finalClass}
    >
      {renderChildren()}
    </span>
  );
});

Loader.displayName = "Loader";
