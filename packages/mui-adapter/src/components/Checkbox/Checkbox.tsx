import React, { forwardRef } from "react";
import {
  Checkbox as MuiCheckbox,
  type CheckboxProps as MuiCheckboxProps,
} from "@mui/material";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import { CheckboxGroup, CheckboxGroupContext } from "./CheckboxGroup";
import {
  filterStylingProps,
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

export type CheckboxWrapperProps = Omit<MuiCheckboxProps, "size" | "color"> &
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
      description,
      error,
      style,
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

    const groupContext = React.useContext(CheckboxGroupContext);
    const isGrouped = groupContext !== null;
    const isGroupReadOnly = isGrouped ? groupContext.readOnly : false;
    const isChecked = isGrouped
      ? (groupContext.value || []).includes(restRecord.value)
      : !!(restRecord.checked ?? restRecord.defaultChecked);

    if (readOnly && !!readOnlyComponent) {
      const ReadOnlyComp = readOnlyComponent;
      const roNode = (
        <ReadOnlyComp
          {...props}
          checked={isChecked}
          label={label as React.ReactNode}
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isGrouped) {
        const newValue = e.target.checked
          ? [...(groupContext.value || []), restRecord.value]
          : (groupContext.value || []).filter((v) => v !== restRecord.value);
        if (groupContext.onChange) {
          groupContext.onChange(e, newValue);
        }
      } else {
        if (restRecord.onChange) {
          (restRecord.onChange as any)(e, e.target.checked);
        }
      }
    };

    const CheckIcon = (props: React.ComponentProps<"svg">) => (
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

    const checkboxNode = (
      <MuiCheckbox
        ref={ref}
        className={!label ? `${finalClass} ${styles.inner}` : styles.inner}
        classes={mergedClassNames}
        disabled={readOnly || disabled || isGroupReadOnly}
        {...(sanitizedProps as unknown as MuiCheckboxProps)}
        checked={isChecked as boolean}
        onChange={handleChange}
        sx={label ? { padding: 0 } : undefined}
        icon={<div className={styles.input} />}
        checkedIcon={
          <div className={`${styles.input} ${styles.inputChecked}`}>
            <CheckIcon className={styles.icon} />
          </div>
        }
        indeterminateIcon={
          <div className={`${styles.input} ${styles.inputIndeterminate}`}>
            <svg
              className={styles.icon}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 32 32"
            >
              <rect x="6" y="14" width="20" height="4" fill="currentColor" />
            </svg>
          </div>
        }
      />
    );

    const finalNode = label ? (
      <div className={finalClass} style={style as React.CSSProperties}>
        <div className={styles.body}>
          {checkboxNode}
          <div className={styles.labelWrapper}>
            <label
              className={styles.label}
              htmlFor={restRecord.id as string}
              data-disabled={
                readOnly || disabled || isGroupReadOnly ? true : undefined
              }
            >
              {label as React.ReactNode}
            </label>
            {description && (
              <div
                className={styles.description}
                data-disabled={
                  readOnly || disabled || isGroupReadOnly ? true : undefined
                }
              >
                {description}
              </div>
            )}
            {error && (
              <div
                className={styles.error}
                data-disabled={
                  readOnly || disabled || isGroupReadOnly ? true : undefined
                }
              >
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    ) : (
      <div className={finalClass} style={style as React.CSSProperties}>
        {checkboxNode}
      </div>
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
