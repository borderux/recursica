import {
  Checkbox as ManCheckbox,
  Box,
  Group,
  CheckboxGroup as ManCheckboxGroup,
  type CheckboxProps as ManCheckboxProps,
  type CheckboxGroupProps as ManCheckboxGroupProps,
} from "@mantine/core";
import { forwardRef } from "react";
import { styles } from "./Checkbox.css";
import { Typography } from "../Typography";
import { Icon } from "../Icons/Icon";

export interface CheckboxLabelProps {
  label: string;
  optional?: boolean;
}

export interface CheckboxGroupProps
  extends Pick<
    ManCheckboxGroupProps,
    "children" | "onChange" | "defaultValue" | "value"
  > {
  label: string;
  optional?: boolean;
  labelPlacement?: "top" | "left";
}

export interface CheckboxProps
  extends Pick<
    ManCheckboxProps,
    | "value"
    | "checked"
    | "indeterminate"
    | "onChange"
    | "disabled"
    | "name"
    | "defaultChecked"
    | "aria-label"
  > {
  label: string;
  /**
   * Whether to show the label text next to the checkbox.
   * If false, the label will be hidden and only the checkbox will be visible.
   * This is useful for cases where the checkbox is used as a toggle without a label.
   * @default true
   */
  showLabel?: boolean;
}

interface CheckboxComponentType
  extends React.ForwardRefExoticComponent<
    CheckboxProps & React.RefAttributes<HTMLInputElement>
  > {
  Group: React.ForwardRefExoticComponent<
    CheckboxGroupProps & React.RefAttributes<HTMLDivElement>
  >;
}

const CheckboxIcon: ManCheckboxProps["icon"] = ({
  indeterminate,
  ...others
}) =>
  indeterminate ? (
    <Box {...others} w={16}>
      <Icon name={"minus_outline"} size={16} />
    </Box>
  ) : (
    <Box {...others} w={16}>
      <Icon name={"check_outline"} size={16} />
    </Box>
  );

const CheckboxGroupComponent = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({ labelPlacement = "top", ...props }, ref) => {
    return (
      <ManCheckboxGroup
        {...props}
        ref={ref}
        data-label-placement={labelPlacement}
        label={
          <CheckboxGroupLabel label={props.label} optional={props.optional} />
        }
        classNames={{
          root: styles.group,
        }}
      />
    );
  },
);

const CheckboxGroupLabel = forwardRef<HTMLDivElement, CheckboxLabelProps>(
  (props, ref) => {
    return (
      <Group ref={ref} {...props} className={styles.groupLabel}>
        <Typography
          variant="body-2/normal"
          color="form/label/color/default-color"
        >
          {props.label}
        </Typography>
        {props.optional && (
          <Typography
            variant="caption"
            color="form/label/color/default-color"
            as="span"
            opacity={0.84}
          >
            (optional)
          </Typography>
        )}
      </Group>
    );
  },
);

const CheckboxItem = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ showLabel = true, ...props }, ref) => {
    return (
      <ManCheckbox
        {...props}
        ref={ref}
        label={showLabel ? props.label : undefined}
        aria-label={showLabel ? undefined : props.label}
        icon={CheckboxIcon}
        classNames={{
          root: styles.root,
          label: styles.label,
          labelWrapper: `${styles.labelWrapper} ${showLabel ? "" : styles.hideLabel}`,
          body: styles.body,
          input: styles.input,
          inner: styles.inner,
          icon: styles.icon,
        }}
      />
    );
  },
) as CheckboxComponentType;

CheckboxItem.Group = CheckboxGroupComponent;

export const Checkbox = CheckboxItem;
