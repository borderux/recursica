import React, { forwardRef } from "react";
import {
  Avatar as MuiAvatar,
  type AvatarProps as MuiAvatarProps,
} from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Avatar.module.css";

import { type RecursicaAvatarProps } from "@recursica/adapter-common";

export type AvatarProps = RecursicaOverStyled<
  Omit<MuiAvatarProps, "variant" | "size" | "color" | "radius"> &
    RecursicaAvatarProps
>;

const _Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  {
    size = "default",
    variant = "solid",
    icon,
    children,
    src,
    overStyled = false,
    ...rest
  },
  ref,
) {
  const mapVariant = {
    solid: "filled",
    outline: "outline",
    ghost: "transparent",
  } as const;

  const sanitizedProps = filterStylingProps(rest, overStyled);
  const restRecord = sanitizedProps as Record<string, unknown>;

  // Determine semantic style based on provided props
  let computedStyle = "text";
  if (src) {
    computedStyle = "image";
  } else if (icon) {
    computedStyle = "icon";
  }

  const mergedClassNames: Partial<Record<string, string>> = {
    root: styles.root,
    image: styles.image,
    placeholder: styles.placeholder,
  };

  const classNamesProp = restRecord.classNames;
  if (
    classNamesProp &&
    typeof classNamesProp === "object" &&
    !Array.isArray(classNamesProp)
  ) {
    const o = classNamesProp as Partial<Record<string, string>>;
    mergedClassNames.root = o.root ? `${styles.root} ${o.root}` : styles.root;
    mergedClassNames.image = o.image
      ? `${styles.image} ${o.image}`
      : styles.image;
    mergedClassNames.placeholder = o.placeholder
      ? `${styles.placeholder} ${o.placeholder}`
      : styles.placeholder;
  }

  const classNameProp = restRecord.className as string | undefined;

  return (
    <MuiAvatar
      ref={ref}
      className={classNameProp}
      classes={mergedClassNames}
      variant={mapVariant[variant] as any}
      src={src}
      data-variant={variant}
      data-size={size}
      data-style={computedStyle}
      {...sanitizedProps}
    >
      {icon != null ? (
        <span className={styles.iconWrapper} aria-hidden>
          {icon}
        </span>
      ) : children != null ? (
        <span className={styles.textWrapper}>{children}</span>
      ) : undefined}
    </MuiAvatar>
  );
});
_Avatar.displayName = "Avatar";

/**
 * Recursica Avatar component wrapping Mui's Avatar.
 *
 * Supports polymorphism via the `component` prop or `renderRoot` for custom element rendering.
 */
export const Avatar = _Avatar as any;
