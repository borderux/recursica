import { forwardRef } from "react";
import {
  Loader as MantineLoader,
  type LoaderProps as MantineLoaderProps,
} from "@mantine/core";
import {
  filterStylingProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Loader.module.css";

import { type RecursicaLoaderProps } from "@recursica/adapter-common";

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
  const restRecord = sanitizedProps as Record<string, unknown>;

  const mergedClassNames = mergeClassNames(
    { root: styles.root },
    restRecord.classNames as Partial<Record<string, string>> | undefined,
  );

  const classNameProp = restRecord.className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  return (
    <MantineLoader
      ref={ref}
      {...sanitizedProps}
      type={variant}
      data-variant={variant}
      data-size={resolvedSize}
      className={finalClass}
      classNames={mergedClassNames}
    />
  );
});

Loader.displayName = "Loader";
