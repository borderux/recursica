import { type MultiSelectProps, Box, MultiSelect } from "@mantine/core";
import { Flex } from "../Flex/Flex";
import {
  styles,
  errorContainer,
  labelContainer,
  optionStyle,
} from "./Dropdown.css";
import { Icon, type IconName } from "../Icons/Icon";
import { Typography } from "../Typography";
import { forwardRef } from "react";
import { ComboboxItem } from "../../types";

export type MultiselectProps = Pick<
  MultiSelectProps,
  "onChange" | "placeholder" | "disabled" | "error" | "defaultValue" | "value"
> & {
  /**
   * The data to display in the Multiselect.
   */
  data: ComboboxItem[];
  /**
   * The label of the Multiselect.
   */
  label: string;
  /**
   * Whether to show the label @default true
   */
  showLabel?: boolean;
  /**
   * The icon to display in the left section of the Multiselect. @default undefined
   */
  leadingIcon?: IconName;
  /**
   * Whether the label is optional. @default false
   */
  isOptional?: boolean;
  /**
   * The placement of the label relative to the multiselect. @default 'top'
   */
  labelPlacement?: "top" | "left";
};

const renderSelectOption: MultiSelectProps["renderOption"] = ({
  option,
  checked,
}) => (
  <Flex className={optionStyle} align="center" onClick={option.onClick}>
    {checked ? (
      <Box className={styles.checkbox}>
        <Icon
          name="check_outline"
          size={16}
          color="form/value+placeholder/color/input-value"
        />
      </Box>
    ) : option.icon ? (
      <Icon name={option.icon} />
    ) : undefined}
    {option.label}
  </Flex>
);

export const Multiselect = forwardRef<HTMLInputElement, MultiselectProps>(
  (
    {
      label,
      error,
      leadingIcon,
      isOptional = false,
      showLabel = true,
      labelPlacement = "top",
      ...props
    },
    ref,
  ) => {
    return (
      <MultiSelect
        comboboxProps={{
          offset: 2,
        }}
        ref={ref}
        withCheckIcon={false}
        withScrollArea={false}
        classNames={styles}
        wrapperProps={{
          "data-label-placement": labelPlacement,
        }}
        renderOption={renderSelectOption}
        label={
          showLabel ? (
            isOptional ? (
              <Flex className={labelContainer}>
                <Typography variant="body-2/normal">{label}</Typography>
                <Typography
                  variant="caption"
                  color="form/value+placeholder/color/input-value"
                >
                  (optional)
                </Typography>
              </Flex>
            ) : (
              <Typography variant="body-2/normal">{label}</Typography>
            )
          ) : undefined
        }
        aria-label={label}
        error={
          error ? (
            <Flex className={errorContainer}>
              <Icon name="exclamation_circle_outline" size={16} />
              <Typography variant="caption">{error}</Typography>
            </Flex>
          ) : undefined
        }
        leftSectionPointerEvents="none"
        leftSection={leadingIcon ? <Icon name={leadingIcon} /> : undefined}
        rightSection={<Icon name="chevron_down_outline" />}
        {...props}
      />
    );
  },
);

Multiselect.displayName = "Multiselect";
