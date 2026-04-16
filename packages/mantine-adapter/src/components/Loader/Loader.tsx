import { forwardRef } from "react";
import {
  Loader as MantineLoader,
  type LoaderProps as MantineLoaderProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
  type RecursicaSize,
} from "../../utils/filterStylingProps";
import styles from "./Loader.module.css";

export interface RecursicaLoaderProps {
  /** Map to the component styles defined in variables */
  variant?: "oval" | "bars" | "dots";
  /** Map to Recursica sizes */
  size?: "sm" | "md" | "lg" | RecursicaSize;
}

export type LoaderProps = RecursicaOverStyled<
  Omit<MantineLoaderProps, "variant" | "size" | "type"> & RecursicaLoaderProps
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

  const mergedClassNames: Partial<Record<string, string>> = {
    root: styles.root,
  };

  const classNamesProp = (sanitizedProps as Record<string, unknown>).classNames;
  if (
    classNamesProp &&
    typeof classNamesProp === "object" &&
    !Array.isArray(classNamesProp)
  ) {
    const o = classNamesProp as Partial<Record<string, string>>;
    mergedClassNames.root = o.root ? `${styles.root} ${o.root}` : styles.root;
  }

  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  return (
    <MantineLoader
      ref={ref}
      type={variant}
      data-variant={variant}
      data-size={resolvedSize}
      {...sanitizedProps}
      className={finalClass}
      classNames={mergedClassNames}
    />
  );
});

Loader.displayName = "Loader";
