import { styles } from "./Badge.css";
import { Badge as ManBadge } from "@mantine/core";

/**
 * The style of the badge.
 */
type BadgeStyle = "primary" | "ghost" | "alert" | "success";

export interface BadgeProps {
  /**
   * The label to display in the badge.
   */
  label: string | number;
  /**
   * The size of the badge.
   * @default 'default'
   */
  size?: "default" | "large";
  /**
   * The style of the badge.
   * @default 'primary'
   */
  style?: BadgeStyle;
}

export function Badge({
  label,
  size = "default",
  style = "primary",
}: BadgeProps) {
  return (
    <ManBadge classNames={styles} data-size={size} data-style={style}>
      {label}
    </ManBadge>
  );
}
