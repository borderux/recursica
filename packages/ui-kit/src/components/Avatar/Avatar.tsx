import { createPolymorphicComponent, Avatar as ManAvatar } from "@mantine/core";
import { forwardRef, type HTMLAttributes } from "react";
import { styles } from "./Avatar.css";
import { type IconName, Icon } from "../Icons/Icon";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  /** The initials to display (mandatory) */
  initials: string;
  /** The variant of the avatar */
  variant?: "icon" | "text" | "image";
  /** The size of the avatar */
  size?: "small" | "default" | "large";
  /** The icon name for icon variant */
  icon?: IconName;
  /** The image source for image variant */
  src?: string;
  /** The alt text for image variant */
  alt?: string;
  /** Whether to show outline style (only for icon and text variants) */
  outline?: boolean;
}

/** Avatar component for displaying user avatars with different variants */
const ForwardedAvatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      initials,
      variant = "text",
      size = "default",
      icon,
      src,
      alt,
      outline = false,
      ...props
    },
    ref,
  ) => {
    const ariaLabel = variant !== "text" ? initials : undefined;

    return (
      <ManAvatar
        ref={ref}
        size={size}
        src={variant === "image" ? src : undefined}
        alt={variant === "image" ? alt : undefined}
        data-variant={variant}
        data-outline={outline}
        aria-label={ariaLabel}
        classNames={styles}
        {...props}
      >
        {variant === "icon" && icon ? (
          <Icon
            size={20}
            color={
              outline
                ? "avatar/color/background-outline"
                : "avatar/color/background-solid"
            }
            name={icon}
          />
        ) : (
          initials
        )}
      </ManAvatar>
    );
  },
);

ForwardedAvatar.displayName = "Avatar";

export const Avatar = createPolymorphicComponent<"div", AvatarProps>(
  ForwardedAvatar,
);
