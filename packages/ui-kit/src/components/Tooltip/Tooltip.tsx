import {
  Tooltip as ManTooltip,
  type TooltipProps as ManTooltipProps,
} from "@mantine/core";
import { styles } from "./Tooltip.css";

export interface TooltipProps
  extends Pick<
    ManTooltipProps,
    "position" | "children" | "opened" | "defaultOpened"
  > {
  label: string;
}

export const Tooltip = ({
  label,
  position,
  children,
  opened,
}: TooltipProps) => {
  return (
    <ManTooltip
      arrowSize={6}
      arrowRadius={2}
      multiline
      opened={opened}
      classNames={styles}
      label={label}
      position={position}
      withArrow
    >
      {children}
    </ManTooltip>
  );
};
