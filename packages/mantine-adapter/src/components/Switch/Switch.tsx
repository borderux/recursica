import { forwardRef, type CSSProperties } from "react";
import {
  Switch as MantineSwitch,
  type SwitchProps as MantineSwitchProps,
  CheckIcon,
  CloseIcon,
} from "@mantine/core";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";

import {
  filterStylingProps,
  omitUnsupportedProps,
  withCallerOverride,
  mergeClassNames,
  mergeStyles,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import {
  type RequireAccessibleLabel,
  type RecursicaSwitchProps,
} from "@recursica/adapter-common";
import {
  FormControlLayout,
  type FormControlLayoutProps,
} from "../FormControlLayout/FormControlLayout";
import styles from "./Switch.module.css";

import { SwitchGroup } from "./SwitchGroup";

export type SwitchWrapperProps = Omit<
  MantineSwitchProps,
  "size" | "color" | "radius" | "variant"
> &
  RecursicaSwitchProps &
  ReadOnlyControlProps &
  Pick<
    FormControlLayoutProps,
    "formLayout" | "labelSize" | "controlMaxWidth" | "controlMinWidth"
  >;

export type RecursicaSwitchPropsAlias =
  RequireAccessibleLabel<SwitchWrapperProps>;

export type SwitchProps = RecursicaOverStyled<RecursicaSwitchPropsAlias>;

type SwitchComponent = React.ForwardRefExoticComponent<
  SwitchProps & React.RefAttributes<HTMLInputElement>
> & {
  Group: typeof SwitchGroup;
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  function Switch(props, ref) {
    const {
      overStyled = false,
      readOnly,
      readOnlyComponent,
      disabled,
      thumbIcon,
      formLayout,
      labelSize,
      controlMaxWidth,
      controlMinWidth,
      ...rest
    } = props;
    // Props this component intentionally doesn't support — deleted at runtime so they can't leak
    // through even if a caller forces them via plain JavaScript, bypassing the `Omit<>` above.
    const UNSUPPORTED_PROPS = [
      "size", // Recursica controls sizing via Switch.module.css variables, not Mantine's native size scale.
      "color", // Colors are token-driven via Switch.module.css; Mantine's native palette isn't exposed.
      "radius", // Corner radius is fixed by Recursica tokens in Switch.module.css, not caller-configurable.
      "variant", // Switch has a single Recursica-defined visual treatment; Mantine's variant isn't exposed.
    ] as const satisfies readonly (keyof MantineSwitchProps)[];

    const sanitizedProps = omitUnsupportedProps(
      filterStylingProps(rest, overStyled) as Record<string, unknown>,
      UNSUPPORTED_PROPS,
    ) as Partial<typeof rest>;
    const restRecord = sanitizedProps as Record<string, unknown>;

    const mergedClassNames = mergeClassNames(
      {
        root: styles.root,
        body: styles.body,
        track: styles.track,
        thumb: styles.thumb,
        trackLabel: styles.trackLabel,
        labelWrapper: styles.labelWrapper,
        label: styles.label,
      },
      restRecord.classNames as Partial<Record<string, string>> | undefined,
    );

    // Recursica has no default per-slot inline styles here (all default styling comes from
    // Switch.module.css above) — this only exists so a caller-supplied `styles` prop (permitted
    // once overStyled=true clears filterStylingProps) merges in per-slot instead of needing its
    // own passthrough path.
    const mergedStyles = mergeStyles(
      {} as Record<string, CSSProperties | undefined>,
      restRecord.styles as Partial<Record<string, CSSProperties>> | undefined,
    );

    const classNameProp = restRecord.className as string | undefined;
    const finalClass = classNameProp
      ? `${styles.root} ${classNameProp}`
      : styles.root;

    if (readOnly && !!readOnlyComponent) {
      const isChecked = !!(restRecord.checked ?? restRecord.defaultChecked);
      const ReadOnlyComp = readOnlyComponent;
      const roNode = (
        <ReadOnlyComp
          {...props}
          checked={isChecked}
          label={restRecord.label as React.ReactNode}
        />
      );

      if (formLayout) {
        return (
          <FormControlLayout
            formLayout={formLayout}
            labelSize={labelSize}
            controlMaxWidth={controlMaxWidth}
            controlMinWidth={controlMinWidth}
          >
            {roNode}
          </FormControlLayout>
        );
      }

      return <>{roNode}</>;
    }

    const FinalThumbIcon = (
      <div className={styles.thumbIconWrapper}>
        <CheckIcon className={styles.checkIcon} />
        <CloseIcon className={styles.closeIcon} />
      </div>
    );

    // We omit Mantine's sizing/coloring so we rely strictly on variables from Switch.module.css
    const switchNode = (
      <MantineSwitch
        ref={ref}
        {...(sanitizedProps as unknown as MantineSwitchProps)}
        className={finalClass}
        classNames={mergedClassNames}
        styles={mergedStyles}
        disabled={readOnly || disabled}
        data-disabled={readOnly || disabled || undefined}
        thumbIcon={withCallerOverride<React.ReactNode>(
          FinalThumbIcon,
          thumbIcon,
        )}
      />
    );

    if (formLayout) {
      return (
        <FormControlLayout
          formLayout={formLayout}
          labelSize={labelSize}
          controlMaxWidth={controlMaxWidth}
          controlMinWidth={controlMinWidth}
        >
          {switchNode}
        </FormControlLayout>
      );
    }

    return switchNode;
  },
) as SwitchComponent;

Switch.displayName = "Switch";
Switch.Group = SwitchGroup;
