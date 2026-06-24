import React, { forwardRef } from "react";
import {
  Stepper as MantineStepper,
  type StepperProps as MantineStepperProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Stepper.module.css";

import { type RecursicaStepperProps } from "@recursica/adapter-common";

export interface RecursicaStepperPropsExtended
  extends Omit<MantineStepperProps, "size">,
    RecursicaStepperProps {}

export type StepperProps = RecursicaOverStyled<RecursicaStepperPropsExtended>;

const _Stepper = forwardRef<HTMLDivElement, StepperProps>(
  function Stepper(props, ref) {
    const {
      overStyled = false,
      size = "large",
      orientation = "horizontal",
      className,
      style,
      ...rest
    } = props;

    const sanitizedProps = filterStylingProps(rest, overStyled);

    return (
      <MantineStepper
        ref={ref}
        orientation={orientation}
        className={`${styles.root} ${orientation === "horizontal" ? styles.horizontal : styles.vertical} ${size === "large" ? styles.large : styles.small} ${className || ""}`}
        style={style as React.CSSProperties}
        data-size={size}
        data-orientation={orientation}
        classNames={{
          steps: styles.steps,
          step: styles.step,
          stepIcon: styles.stepIcon,
          stepCompletedIcon: styles.stepCompletedIcon,
          stepBody: styles.stepBody,
          stepLabel: styles.stepLabel,
          stepDescription: styles.stepDescription,
          separator: styles.separator,
          verticalSeparator: styles.verticalSeparator,
          content: styles.content,
        }}
        {...(sanitizedProps as MantineStepperProps)}
      />
    );
  },
);

// We need to re-export the static components Step and Completed
export const Stepper: typeof _Stepper & {
  Step: typeof MantineStepper.Step;
  Completed: typeof MantineStepper.Completed;
} = Object.assign(_Stepper, {
  Step: MantineStepper.Step,
  Completed: MantineStepper.Completed,
});

_Stepper.displayName = "Stepper";
