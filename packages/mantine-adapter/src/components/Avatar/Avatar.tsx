import React, { forwardRef } from "react";
import {
  Avatar as MantineAvatar,
  type AvatarProps as MantineAvatarProps,
} from "@mantine/core";
import styles from "./Avatar.module.css";

export interface RecursicaAvatarProps {
  size?: "small" | "default" | "large";
  variant?: "solid" | "outline" | "ghost";
  icon?: React.ReactNode;
}

export type AvatarProps = Omit<
  MantineAvatarProps,
  "variant" | "size" | "color" | "radius"
> &
  RecursicaAvatarProps;

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  {
    size = "default",
    variant = "solid",
    icon,
    className,
    classNames,
    children,
    style,
    src,
    ...rest
  },
  ref,
) {
  const mapVariant = {
    solid: "filled",
    outline: "outline",
    ghost: "transparent",
  } as const;

  const mapSize = {
    default: "md",
    small: "sm",
    large: "lg",
  } as const;

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

  if (
    classNames &&
    typeof classNames === "object" &&
    !Array.isArray(classNames)
  ) {
    const o = classNames as Partial<Record<string, string>>;
    mergedClassNames.root = o.root ? `${styles.root} ${o.root}` : styles.root;
    mergedClassNames.image = o.image
      ? `${styles.image} ${o.image}`
      : styles.image;
    mergedClassNames.placeholder = o.placeholder
      ? `${styles.placeholder} ${o.placeholder}`
      : styles.placeholder;
  }

  return (
    <MantineAvatar
      ref={ref}
      className={className}
      classNames={mergedClassNames}
      variant={mapVariant[variant]}
      size={mapSize[size]}
      style={style}
      src={src}
      data-variant={variant}
      data-size={size}
      data-style={computedStyle}
      {...rest}
    >
      {icon != null ? (
        <span className={styles.iconWrapper} aria-hidden>
          {icon}
        </span>
      ) : children != null ? (
        <span className={styles.textWrapper}>{children}</span>
      ) : undefined}
    </MantineAvatar>
  );
});

Avatar.displayName = "Avatar";
