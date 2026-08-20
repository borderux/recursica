import { forwardRef } from "react";
import {
  Avatar as MuiAvatar,
  type AvatarProps as MuiAvatarProps,
} from "@mui/material";
import {
  filterStylingProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Avatar.module.css";

import { type RecursicaAvatarProps } from "@recursica/adapter-common";

// MUI's native `variant` is Avatar's *shape* ('circular'|'rounded'|'square'), not a color
// treatment like every other MUI component's `variant` — unlike Mantine's, where `variant`
// really is the same color-treatment concept ours is. Omitted so Recursica's own `variant`
// (a completely different concept) can't be confused with it; see AVATAR_IMPLEMENTATION_NOTES.md.
export type AvatarProps = RecursicaOverStyled<
  Omit<MuiAvatarProps, "variant"> & RecursicaAvatarProps
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
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const restRecord = sanitizedProps as Record<string, unknown>;

  // Determine semantic style based on provided props
  let computedStyle = "text";
  if (src) {
    computedStyle = "image";
  } else if (icon) {
    computedStyle = "icon";
  }

  // Note MUI's actual prop is "classes", not "classNames" (that's Mantine's naming) — this
  // used to read the wrong key, silently no-op-ing any caller-supplied classes.
  const mergedClassNames = mergeClassNames(
    {
      root: styles.root,
      image: styles.image,
      placeholder: styles.placeholder,
    },
    restRecord.classes as Partial<Record<string, string>> | undefined,
  );

  const classNameProp = restRecord.className as string | undefined;

  return (
    <MuiAvatar
      ref={ref}
      className={classNameProp}
      classes={mergedClassNames}
      variant="circular"
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
export const Avatar = _Avatar;
