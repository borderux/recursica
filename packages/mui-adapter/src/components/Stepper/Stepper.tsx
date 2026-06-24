import React, { forwardRef } from "react";
import {
  Stepper as MuiStepper,
  Step as MuiStep,
  StepLabel as MuiStepLabel,
  StepButton as MuiStepButton,
  StepConnector as MuiStepConnector,
  type StepperProps as MuiStepperProps,
  type StepProps as MuiStepProps,
  type StepLabelProps as MuiStepLabelProps,
  type StepButtonProps as MuiStepButtonProps,
  type StepConnectorProps as MuiStepConnectorProps,
} from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Stepper.module.css";

import { type RecursicaStepperProps } from "@recursica/adapter-common";

export interface RecursicaStepperPropsExtended
  extends Omit<Partial<MuiStepperProps>, "size">,
    RecursicaStepperProps {}

export type StepperProps = RecursicaOverStyled<RecursicaStepperPropsExtended>;

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
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
      <div
        className={`${styles.root} ${orientation === "horizontal" ? styles.horizontal : styles.vertical} ${size === "large" ? styles.large : styles.small} ${className || ""}`}
        style={style as React.CSSProperties}
        data-size={size}
        data-orientation={orientation}
      >
        <MuiStepper
          ref={ref as any}
          orientation={orientation}
          connector={
            <MuiStepConnector
              classes={{
                root:
                  orientation === "horizontal"
                    ? styles.separator
                    : styles.verticalSeparator,
              }}
            />
          }
          classes={{
            root: styles.steps,
          }}
          {...(sanitizedProps as MuiStepperProps)}
        />
      </div>
    );
  },
);

Stepper.displayName = "Stepper";

export type StepProps = RecursicaOverStyled<MuiStepProps>;

export const Step = forwardRef<HTMLDivElement, StepProps>(
  function Step(props, ref) {
    const { overStyled = false, className, ...rest } = props;
    return (
      <MuiStep
        ref={ref}
        classes={{ root: styles.step }}
        className={className || ""}
        {...(filterStylingProps(rest, overStyled) as MuiStepProps)}
      />
    );
  },
);

Step.displayName = "Step";

export type StepButtonProps = RecursicaOverStyled<MuiStepButtonProps>;

export const StepButton = forwardRef<HTMLButtonElement, StepButtonProps>(
  function StepButton(props, ref) {
    const { overStyled = false, className, ...rest } = props;
    return (
      <MuiStepButton
        ref={ref}
        className={className || ""}
        {...(filterStylingProps(rest, overStyled) as MuiStepButtonProps)}
      />
    );
  },
);

StepButton.displayName = "StepButton";

export type StepLabelProps = RecursicaOverStyled<
  MuiStepLabelProps & { description?: React.ReactNode }
>;

export const StepLabel = forwardRef<HTMLDivElement, StepLabelProps>(
  function StepLabel(props, ref) {
    const { overStyled = false, className, description, ...rest } = props;
    return (
      <MuiStepLabel
        ref={ref}
        className={className || ""}
        classes={{
          label: styles.stepLabel,
          iconContainer: styles.stepIcon,
        }}
        optional={
          description ? (
            <div className={styles.stepDescription}>{description}</div>
          ) : (
            rest.optional
          )
        }
        {...(filterStylingProps(rest, overStyled) as MuiStepLabelProps)}
      />
    );
  },
);

StepLabel.displayName = "StepLabel";

export type StepConnectorProps = RecursicaOverStyled<MuiStepConnectorProps>;

export const StepConnector = forwardRef<HTMLDivElement, StepConnectorProps>(
  function StepConnector(props, ref) {
    const { overStyled = false, className, ...rest } = props;
    return (
      <MuiStepConnector
        ref={ref}
        className={className || ""}
        {...(filterStylingProps(rest, overStyled) as MuiStepConnectorProps)}
      />
    );
  },
);

StepConnector.displayName = "StepConnector";
