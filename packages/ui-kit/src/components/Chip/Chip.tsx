import {
  Chip as ManChip,
  ChipGroup as ManChipGroup,
  type ChipProps as ManChipProps,
  type ChipGroupProps as ManChipGroupProps,
} from "@mantine/core";
import { forwardRef } from "react";
import { Icon, type IconName } from "../Icons/Icon";
import { Flex } from "../Flex";
import { styles } from "./Chip.css";

// Extend the props without modifying the children requirement
export interface ChipProps
  extends Pick<
    ManChipProps,
    "checked" | "defaultChecked" | "onChange" | "value"
  > {
  error?: boolean;
  label: string;
  icon?: {
    /**
     * The icon to display when the chip is checked. Typically a solid icon.
     */
    selected: IconName;
    /**
     * The icon to display when the chip is not checked. Typically an outline icon.
     */
    unselected: IconName;
  };
}

// Create a type that can handle both single and multiple selection
export type ChipGroupProps<T extends boolean = false> = ManChipGroupProps<T>;

const ChipComponent = forwardRef<HTMLInputElement, ChipProps>(
  ({ icon, error, label, ...props }, ref) => {
    return (
      <ManChip
        ref={ref}
        {...props}
        classNames={{
          root: styles.root,
          label: styles.label,
          input: styles.input,
          iconWrapper: styles.iconWrapper,
        }}
        data-error={error}
      >
        <Flex align="center" className={styles.labelWrapper}>
          {icon && (
            <>
              <Flex
                className={styles.additionalIconCheckedWrapper}
                data-icon={"selected"}
              >
                <Icon name={icon.selected} size={16} />
              </Flex>
              <Flex
                data-icon={"unselected"}
                className={styles.iconCenterWrapper}
              >
                <Icon name={icon.unselected} size={16} />
              </Flex>
            </>
          )}
          <Flex data-icon={"checked"} className={styles.iconCenterWrapper}>
            <Icon name="check_Outlined" size={16} />
          </Flex>
          {label}
        </Flex>
      </ManChip>
    );
  },
);

ChipComponent.displayName = "Chip";

// Group component doesn't need ref forwarding since Mantine's ChipGroup doesn't support it
const GroupComponent = <T extends boolean = false>(
  props: ChipGroupProps<T>,
) => {
  return <ManChipGroup<T> {...props} />;
};

GroupComponent.displayName = "Chip.Group";

// Create a type that includes the Group property
type ChipWithGroup = typeof ChipComponent & {
  Group: typeof GroupComponent;
};

// Create the final component with the Group property
export const Chip = ChipComponent as ChipWithGroup;
Chip.Group = GroupComponent;
