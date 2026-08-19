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
  type StepIconProps as MuiStepIconProps,
} from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Stepper.module.css";

import { type RecursicaStepperProps } from "@recursica/adapter-common";

// Same inline check glyph used by Checkbox.tsx (fill="currentColor" so the CSS
// module drives color via `.stepCompletedIcon`).
function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 10 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

// MUI's default StepIcon draws its own self-contained circle+check SVG
// (Material's `check_circle` glyph, colored via `theme.palette.primary.main`)
// whenever `icon` is the auto-injected step number — it never defers to our
// `.stepIcon` background/border tokens. We render the indicator ourselves so
// the recursica-token circle (`.stepIconCircle`) is the only circle, and the
// completed check mark is our own token-colored glyph.
function RecursicaStepIcon(props: MuiStepIconProps) {
  const { icon, active, completed, error } = props;
  if (typeof icon !== "number" && typeof icon !== "string") {
    return <>{icon}</>;
  }
  return (
    <span
      className={styles.stepIconCircle}
      data-active={active || undefined}
      data-completed={completed || undefined}
      data-error={error || undefined}
    >
      {completed ? <CheckIcon className={styles.stepCompletedIcon} /> : icon}
    </span>
  );
}

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
    const isHorizontal = orientation === "horizontal";

    return (
      <div
        className={`${styles.root} ${isHorizontal ? styles.horizontal : styles.vertical} ${size === "large" ? styles.large : styles.small} ${className || ""}`}
        style={style as React.CSSProperties}
        data-size={size}
        data-orientation={orientation}
      >
        <MuiStepper
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={ref as any}
          {...(sanitizedProps as MuiStepperProps)}
          orientation={orientation}
          // `alternativeLabel` is MUI's real primitive for "label centered under
          // the icon" (see its own prop doc) — required for the icon/label
          // layout and for the connector's centered absolute positioning.
          alternativeLabel={isHorizontal}
          connector={
            isHorizontal ? (
              <MuiStepConnector
                classes={{
                  root: styles.separator,
                  line: styles.separatorLine,
                }}
              />
            ) : (
              // Vertical connecting line is drawn as a `.stepIcon::after` rail
              // (see module CSS) so its length tracks each step's actual
              // rendered height (multi-line descriptions included) the same
              // way mantine's absolutely-positioned separator does — MUI's
              // own vertical `StepConnector` is a fixed-height sibling that
              // can't do that without `StepContent`, which recursica hides.
              <></>
            )
          }
          classes={{
            root: styles.steps,
          }}
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
        {...(filterStylingProps(rest, overStyled) as MuiStepProps)}
        classes={{ root: styles.step }}
        className={className || ""}
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
    const {
      overStyled = false,
      className,
      description,
      StepIconComponent,
      ...rest
    } = props;
    return (
      <MuiStepLabel
        ref={ref}
        {...(filterStylingProps(rest, overStyled) as MuiStepLabelProps)}
        className={className || ""}
        classes={{
          root: styles.stepLabelRoot,
          label: styles.stepLabel,
          iconContainer: styles.stepIcon,
          labelContainer: styles.stepBody,
        }}
        StepIconComponent={StepIconComponent ?? RecursicaStepIcon}
        optional={
          description ? (
            <div className={styles.stepDescription}>{description}</div>
          ) : (
            rest.optional
          )
        }
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
