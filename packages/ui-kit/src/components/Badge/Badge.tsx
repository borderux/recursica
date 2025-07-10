import { styles } from "./Badge.css";
import { Badge as ManBadge } from "@mantine/core";

/**
 * The variant of the badge.
 */
type BadgeVariant = "default" | "primary" | "alert" | "success";

export interface BadgeProps {
  /**
   * The label to display in the badge.
   */
  label: string | number;
  /**
   * The variant of the badge.
   */
  type: "status" | "counter";
  /**
   * The variant of the badge.
   * @default 'default'
   */
  variant?: BadgeVariant;
}

export function Badge({ type, label, variant = "default" }: BadgeProps) {
  return (
    <ManBadge
      classNames={{ root: styles.root, label: styles.label }}
      data-type={type}
      data-variant={variant}
    >
      {label}
    </ManBadge>
  );
}
