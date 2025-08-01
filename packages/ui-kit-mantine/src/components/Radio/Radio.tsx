import { forwardRef } from "react";
import {
  Radio as ManRadio,
  RadioGroup as ManRadioGroup,
  type RadioProps as ManRadioProps,
  type RadioGroupProps as ManRadioGroupProps,
  Group,
} from "@mantine/core";
import { Typography } from "../Typography";
import { styles } from "./Radio.css";
import { recursica } from "../../recursica/Recursica";

export interface RadioLabelProps {
  label: string;
  optional?: boolean;
}

export interface RadioGroupProps
  extends Pick<
    ManRadioGroupProps,
    "name" | "children" | "onChange" | "defaultValue" | "value"
  > {
  label: string;
  optional?: boolean;
}

export interface RadioProps
  extends Pick<
    ManRadioProps,
    | "value"
    | "checked"
    | "onChange"
    | "disabled"
    | "name"
    | "defaultChecked"
    | "aria-label"
  > {
  /**
   * If true, the label will be hidden and the radio will be shown as a standalone item.
   * @default true
   */
  showLabel?: boolean;
  /**
   * The label for the radio.
   */
  label: string;
}

interface RadioComponentType
  extends React.ForwardRefExoticComponent<
    RadioProps & React.RefAttributes<HTMLInputElement>
  > {
  Group: React.ForwardRefExoticComponent<
    RadioGroupProps & React.RefAttributes<HTMLDivElement>
  >;
}

const RadioGroupLabel = forwardRef<HTMLDivElement, RadioLabelProps>(
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

const RadioGroupComponent = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ ...props }, ref) => {
    return (
      <ManRadioGroup
        {...props}
        ref={ref}
        label={
          <RadioGroupLabel label={props.label} optional={props.optional} />
        }
        classNames={{
          root: styles.group,
        }}
      />
    );
  },
);

const RadioItem = forwardRef<HTMLInputElement, RadioProps>(
  ({ showLabel = true, ...props }, ref) => {
    return (
      <ManRadio
        {...props}
        ref={ref}
        label={showLabel ? props.label : undefined}
        aria-label={props.label}
        style={{
          "--radio-icon-size": recursica["radio/size/dot"],
          "--radio-size": recursica["radio/size/width"],
        }}
        classNames={{
          label: styles.label,
          labelWrapper: styles.labelWrapper,
          body: styles.body,
          radio: styles.radio,
          inner: styles.inner,
          icon: styles.icon,
        }}
      />
    );
  },
) as RadioComponentType;

RadioItem.Group = RadioGroupComponent;

export const Radio = RadioItem;
