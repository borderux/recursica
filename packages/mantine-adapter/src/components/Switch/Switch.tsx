import { forwardRef } from "react";
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

    const mergedClassNames: Partial<Record<string, string>> = {
      root: styles.root,
      body: styles.body,
      track: styles.track,
      thumb: styles.thumb,
      trackLabel: styles.trackLabel,
      labelWrapper: styles.labelWrapper,
      label: styles.label,
    };

    const classNamesProp = restRecord.classNames;
    if (
      classNamesProp &&
      typeof classNamesProp === "object" &&
      !Array.isArray(classNamesProp)
    ) {
      const o = classNamesProp as Partial<Record<string, string>>;
      mergedClassNames.root = o.root ? `${styles.root} ${o.root}` : styles.root;
      mergedClassNames.body = o.body ? `${styles.body} ${o.body}` : styles.body;
      mergedClassNames.track = o.track
        ? `${styles.track} ${o.track}`
        : styles.track;
      mergedClassNames.thumb = o.thumb
        ? `${styles.thumb} ${o.thumb}`
        : styles.thumb;
      mergedClassNames.trackLabel = o.trackLabel
        ? `${styles.trackLabel} ${o.trackLabel}`
        : styles.trackLabel;
      mergedClassNames.labelWrapper = o.labelWrapper
        ? `${styles.labelWrapper} ${o.labelWrapper}`
        : styles.labelWrapper;
      mergedClassNames.label = o.label
        ? `${styles.label} ${o.label}`
        : styles.label;
    }

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
        disabled={readOnly || disabled}
        data-disabled={readOnly || disabled || undefined}
        thumbIcon={thumbIcon ?? FinalThumbIcon}
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
