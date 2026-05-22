import React, { forwardRef, isValidElement } from "react";
import {
  Stepper as MuiStepper,
  Step as MuiStep,
  StepLabel as MuiStepLabel,
  StepButton as MuiStepButton,
  StepConnector as MuiStepConnector,
  type StepperProps as MuiStepperProps,
} from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Stepper.module.css";

export interface RecursicaStepperProps
  extends Omit<
    MuiStepperProps,
    "size" | "color" | "radius" | "iconSize" | "contentPadding" | "activeStep"
  > {
  size?: "small" | "large";
  active?: number;
  onStepClick?: (stepIndex: number) => void;
  orientation?: "horizontal" | "vertical";
}

export type StepperProps = RecursicaOverStyled<RecursicaStepperProps>;

export const StepperStep: React.FC<any> = () => null;
export const StepperCompleted: React.FC<any> = () => null;

const _Stepper = forwardRef<HTMLDivElement, StepperProps>(
  function Stepper(props, ref) {
    const {
      overStyled = false,
      size = "large",
      orientation = "horizontal",
      className,
      style,
      active = 0,
      onStepClick,
      children,
      ...rest
    } = props;

    const sanitizedProps = filterStylingProps(rest, overStyled);

    const steps = React.Children.toArray(children).filter(
      (child: any) =>
        isValidElement(child) &&
        (child.type === StepperStep ||
          (child.type as any).displayName === "StepperStep"),
    );
    const completed = React.Children.toArray(children).find(
      (child: any) =>
        isValidElement(child) &&
        (child.type === StepperCompleted ||
          (child.type as any).displayName === "StepperCompleted"),
    );

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
          activeStep={active}
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
        >
          {steps.map((step: any, index: number) => {
            const stepProps = step.props;
            const label = stepProps.label;
            const description = stepProps.description;

            return (
              <MuiStep
                key={index}
                classes={{ root: styles.step }}
                completed={active > index}
              >
                <MuiStepButton onClick={() => onStepClick?.(index)}>
                  <MuiStepLabel
                    optional={
                      description ? (
                        <div className={styles.stepDescription}>
                          {description}
                        </div>
                      ) : null
                    }
                    classes={{
                      label: styles.stepLabel,
                      iconContainer: styles.stepIcon,
                    }}
                  >
                    {label}
                  </MuiStepLabel>
                </MuiStepButton>
              </MuiStep>
            );
          })}
        </MuiStepper>
        {active >= steps.length && completed && (
          <div className={styles.content}>
            {(completed as React.ReactElement).props.children}
          </div>
        )}
        {active < steps.length &&
          steps[active] &&
          (steps[active] as React.ReactElement).props.children && (
            <div className={styles.content}>
              {(steps[active] as React.ReactElement).props.children}
            </div>
          )}
      </div>
    );
  },
);

StepperStep.displayName = "StepperStep";
StepperCompleted.displayName = "StepperCompleted";

export const Stepper: typeof _Stepper & {
  Step: typeof StepperStep;
  Completed: typeof StepperCompleted;
} = Object.assign(_Stepper, {
  Step: StepperStep,
  Completed: StepperCompleted,
});

_Stepper.displayName = "Stepper";
