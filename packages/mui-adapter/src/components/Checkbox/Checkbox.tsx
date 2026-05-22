import React, { forwardRef } from "react";
import {
  Checkbox as MuiCheckbox,
  type CheckboxProps as MuiCheckboxProps,
  FormControlLabel,
} from "@mui/material";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import { CheckboxGroup } from "./CheckboxGroup";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RequireAccessibleLabel } from "../../utils/RequireAccessibleLabel";
import {
  FormControlLayout,
  type FormControlLayoutProps,
} from "../FormControlLayout/FormControlLayout";

import styles from "./Checkbox.module.css";

export type RecursicaCheckboxProps = RequireAccessibleLabel<
  Omit<MuiCheckboxProps, "size" | "color"> & {
    label?: React.ReactNode;
  } & ReadOnlyControlProps &
    Pick<
      FormControlLayoutProps,
      "formLayout" | "labelSize" | "controlMaxWidth" | "controlMinWidth"
    >
>;

export type CheckboxProps = RecursicaOverStyled<RecursicaCheckboxProps>;

type CheckboxComponent = React.ForwardRefExoticComponent<
  CheckboxProps & React.RefAttributes<HTMLButtonElement>
> & {
  Group: typeof CheckboxGroup;
};

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
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
      label,
      ...rest
    } = props;

    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    delete restRecord["size"];
    delete restRecord["color"];

    const mergedClassNames: Partial<Record<string, string>> = {
      root: styles.root,
      checked: styles.checked,
      disabled: styles.disabled,
    };

    const classesProp = restRecord.classes;
    if (
      classesProp &&
      typeof classesProp === "object" &&
      !Array.isArray(classesProp)
    ) {
      const o = classesProp as Partial<Record<string, string>>;
      mergedClassNames.root = o.root ? `${styles.root} ${o.root}` : styles.root;
      mergedClassNames.checked = o.checked
        ? `${styles.checked} ${o.checked}`
        : styles.checked;
      mergedClassNames.disabled = o.disabled
        ? `${styles.disabled} ${o.disabled}`
        : styles.disabled;
    }

    const classNameProp = restRecord.className as string | undefined;
    const finalClass = classNameProp
      ? `${styles.root} ${classNameProp}`
      : styles.root;

    if (readOnly && !!readOnlyComponent) {
      const isChecked = !!(restRecord.checked ?? restRecord.defaultChecked);
      const ReadOnlyComp = readOnlyComponent;
      const roNode = (
        <ReadOnlyComp {...props} checked={isChecked} label={label} />
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

    const checkboxNode = (
      <MuiCheckbox
        ref={ref}
        className={finalClass}
        classes={mergedClassNames}
        disabled={readOnly || disabled}
        {...(sanitizedProps as unknown as MuiCheckboxProps)}
      />
    );

    const finalNode = label ? (
      <FormControlLabel
        control={checkboxNode}
        label={label}
        className={styles.labelWrapper}
        classes={{ label: styles.label }}
      />
    ) : (
      checkboxNode
    );

    if (formLayout) {
      return (
        <FormControlLayout
          formLayout={formLayout}
          labelSize={labelSize}
          controlMaxWidth={controlMaxWidth}
          controlMinWidth={controlMinWidth}
        >
          {finalNode}
        </FormControlLayout>
      );
    }

    return finalNode;
  },
) as CheckboxComponent;

Checkbox.displayName = "Checkbox";
Checkbox.Group = CheckboxGroup;
