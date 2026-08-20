import { forwardRef } from "react";
import {
  Checkbox as MantineCheckbox,
  type CheckboxProps as MantineCheckboxProps,
} from "@mantine/core";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import { CheckboxGroup } from "./CheckboxGroup";
import {
  filterStylingProps,
  omitUnsupportedProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import {
  type RequireAccessibleLabel,
  type RecursicaCheckboxProps,
} from "@recursica/adapter-common";
import {
  FormControlLayout,
  type FormControlLayoutProps,
} from "../FormControlLayout/FormControlLayout";

import styles from "./Checkbox.module.css";

export type CheckboxWrapperProps = Omit<
  MantineCheckboxProps,
  "size" | "color" | "radius" | "iconColor" | "variant"
> &
  RecursicaCheckboxProps &
  ReadOnlyControlProps &
  Pick<
    FormControlLayoutProps,
    "formLayout" | "labelSize" | "controlMaxWidth" | "controlMinWidth"
  >;

export type RecursicaCheckboxPropsAlias =
  RequireAccessibleLabel<CheckboxWrapperProps>;

export type CheckboxProps = RecursicaOverStyled<RecursicaCheckboxPropsAlias>;

type CheckboxComponent = React.ForwardRefExoticComponent<
  CheckboxProps & React.RefAttributes<HTMLInputElement>
> & {
  Group: typeof CheckboxGroup;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(props, ref) {
    const {
      overStyled = false,
      readOnly,
      readOnlyComponent,
      disabled,
      formLayout,
      labelSize,
      controlMaxWidth,
      controlMinWidth,
      ...rest
    } = props;
    // Checkbox doesn't use Label onLabelEditClick natively since it isn't mapped inside FormControlWrapper intrinsically.
    // Props this component intentionally doesn't support — deleted at runtime so they can't leak
    // through even if a caller forces them via plain JavaScript, bypassing the `Omit<>` above.
    const UNSUPPORTED_PROPS = [
      "size", // Recursica controls sizing via Checkbox.module.css variables, not Mantine's native size scale.
      "color", // Colors are token-driven via Checkbox.module.css; Mantine's native palette isn't exposed.
      "radius", // Corner radius is fixed by Recursica tokens in Checkbox.module.css, not caller-configurable.
      "variant", // Checkbox has a single Recursica-defined visual treatment; Mantine's variant isn't exposed.
      "iconColor", // Icon color is token-driven via Checkbox.module.css, not a native Mantine override.
    ] as const satisfies readonly (keyof MantineCheckboxProps)[];

    const sanitizedProps = omitUnsupportedProps(
      filterStylingProps(rest, overStyled) as Record<string, unknown>,
      UNSUPPORTED_PROPS,
    ) as Partial<typeof rest>;
    const restRecord = sanitizedProps as Record<string, unknown>;

    const mergedClassNames: Partial<Record<string, string>> = {
      root: styles.root,
      body: styles.body,
      inner: styles.inner,
      input: styles.input,
      icon: styles.icon,
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
      mergedClassNames.inner = o.inner
        ? `${styles.inner} ${o.inner}`
        : styles.inner;
      mergedClassNames.input = o.input
        ? `${styles.input} ${o.input}`
        : styles.input;
      mergedClassNames.icon = o.icon ? `${styles.icon} ${o.icon}` : styles.icon;
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

    // We omit Mantine's sizing/coloring so we rely strictly on variables from Checkbox.module.css
    const checkboxNode = (
      <MantineCheckbox
        ref={ref}
        {...(sanitizedProps as unknown as MantineCheckboxProps)}
        className={finalClass}
        classNames={mergedClassNames}
        disabled={readOnly || disabled}
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
          {checkboxNode}
        </FormControlLayout>
      );
    }

    return checkboxNode;
  },
) as CheckboxComponent;

Checkbox.displayName = "Checkbox";
Checkbox.Group = CheckboxGroup;
