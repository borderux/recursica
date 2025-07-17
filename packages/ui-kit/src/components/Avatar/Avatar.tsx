import { createPolymorphicComponent, Avatar as ManAvatar } from "@mantine/core";
import { forwardRef, type HTMLAttributes } from "react";
import { styles } from "./Avatar.css";
import { Icon } from "../Icons/Icon";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  /** The initials to display (mandatory) */
  initials: string;
  /** The variant of the avatar */
  variant?: "primary" | "ghost" | "image";
  /** The size of the avatar */
  size?: "small" | "default" | "large";
  /** The image source for image variant */
  src?: string;
  /** The alt text for image variant */
  alt?: string;
  /** Whether to show border style */
  border?: boolean;
}

/** Avatar component for displaying user avatars with different variants */
export const ForwardedAvatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      initials,
      variant = "primary",
      size = "default",
      src,
      alt,
      border = false,
      ...props
    },
    ref,
  ) => {
    const ariaLabel =
      variant !== "primary" && variant !== "ghost" ? initials : undefined;

    return (
      <ManAvatar
        ref={ref}
        size={size}
        src={variant === "image" ? src : undefined}
        alt={variant === "image" ? alt : undefined}
        data-variant={variant}
        data-border={border}
        aria-label={ariaLabel}
        classNames={styles}
        {...props}
      >
        {variant === "primary" || variant === "ghost" ? (
          <Icon
            size={size === "small" ? 16 : size === "large" ? 24 : 20}
            color={
              variant === "primary"
                ? "avatar/color/label-primary"
                : "avatar/color/label-ghost"
            }
            name={"user_outline"}
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
