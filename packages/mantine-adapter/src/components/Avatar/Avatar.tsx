import { forwardRef } from "react";
import {
  Avatar as MantineAvatar,
  type AvatarProps as MantineAvatarProps,
  createPolymorphicComponent,
} from "@mantine/core";
import {
  filterStylingProps,
  omitUnsupportedProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Avatar.module.css";

import { type RecursicaAvatarProps } from "@recursica/adapter-common";

export type AvatarProps = RecursicaOverStyled<
  Omit<MantineAvatarProps, "variant" | "size" | "color" | "radius"> &
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

  const mapSize = {
    default: "md",
    small: "sm",
    large: "lg",
  } as const;

  // Props this component intentionally doesn't support — deleted at runtime so they can't leak
  // through even if a caller forces them via plain JavaScript, bypassing the `Omit<>` above.
  const UNSUPPORTED_PROPS = [
    "color", // Colors are token-driven via `data-variant`; Mantine's native palette isn't exposed.
    "radius", // Avatar corner radius is controlled by design tokens, not a raw radius prop.
  ] as const satisfies readonly (keyof MantineAvatarProps)[];

  const sanitizedProps = omitUnsupportedProps(
    filterStylingProps(rest, overStyled),
    UNSUPPORTED_PROPS,
  );
  const restRecord = sanitizedProps as Record<string, unknown>;

  // Determine semantic style based on provided props
  let computedStyle = "text";
  if (src) {
    computedStyle = "image";
  } else if (icon) {
    computedStyle = "icon";
  }

  const mergedClassNames = mergeClassNames(
    {
      root: styles.root,
      image: styles.image,
      placeholder: styles.placeholder,
    },
    restRecord.classNames as Partial<Record<string, string>> | undefined,
  );

  const classNameProp = restRecord.className as string | undefined;

  return (
    <MantineAvatar
      ref={ref}
      {...sanitizedProps}
      className={classNameProp}
      classNames={mergedClassNames}
      variant={mapVariant[variant]}
      size={mapSize[size]}
      src={src}
      data-variant={variant}
      data-size={size}
      data-style={computedStyle}
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
_Avatar.displayName = "Avatar";

/**
 * Recursica Avatar component wrapping Mantine's Avatar.
 *
 * Supports polymorphism via the `component` prop or `renderRoot` for custom element rendering.
 */
export const Avatar = createPolymorphicComponent<"div", AvatarProps>(_Avatar);
