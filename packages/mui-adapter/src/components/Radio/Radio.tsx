import { forwardRef } from "react";
import {
  Radio as MuiRadio,
  type RadioProps as MuiRadioProps,
} from "@mui/material";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import { RadioGroup } from "./RadioGroup";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RequireAccessibleLabel } from "../../utils/RequireAccessibleLabel";
import {
  FormControlLayout,
  type FormControlLayoutProps,
} from "../FormControlLayout/FormControlLayout";

import styles from "./Radio.module.css";

const RadioIcon: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    style={style}
  >
    <circle cx="8" cy="8" r="5" />
  </svg>
);

export type RecursicaRadioProps = RequireAccessibleLabel<
  Omit<MuiRadioProps, "size" | "color"> & {
    label?: React.ReactNode;
    description?: React.ReactNode;
    error?: React.ReactNode;
  } & ReadOnlyControlProps &
    Pick<
      FormControlLayoutProps,
      "formLayout" | "labelSize" | "controlMaxWidth" | "controlMinWidth"
    >
>;

export type RadioProps = RecursicaOverStyled<RecursicaRadioProps>;

type RadioComponent = React.ForwardRefExoticComponent<
  RadioProps & React.RefAttributes<HTMLInputElement>
> & {
  Group: typeof RadioGroup;
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  function Radio(props, ref) {
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

    // Actively delete dimension bindings that bypass the abstraction
    delete restRecord["size"];
    delete restRecord["color"];

    const mergedClassNames: Partial<Record<string, string>> = {
      root: styles.root,
      body: styles.body,
      inner: styles.inner,
      radio: styles.radio,
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
      mergedClassNames.radio = o.radio
        ? `${styles.radio} ${o.radio}`
        : styles.radio;
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

    // We omit Mui's sizing/coloring so we rely strictly on variables from Radio.module.css
    const radioNode = (
      <MuiRadio
        ref={ref as any}
        icon={<RadioIcon />}
        checkedIcon={<RadioIcon className={styles.checked} />}
        className={finalClass}
        classes={mergedClassNames}
        disabled={readOnly || disabled}
        {...(sanitizedProps as unknown as MuiRadioProps)}
      />
    );

    const finalNode = label ? (
      <div className={finalClass} style={style as React.CSSProperties}>
        <div className={styles.body}>
          {radioNode}
          <div className={styles.labelWrapper}>
            <label
              className={styles.label}
              htmlFor={restRecord.id as string}
              data-disabled={readOnly || disabled ? true : undefined}
            >
              {label as React.ReactNode}
            </label>
            {description && (
              <div
                className={styles.description}
                data-disabled={readOnly || disabled ? true : undefined}
              >
                {description}
              </div>
            )}
            {error && (
              <div
                className={styles.error}
                data-disabled={readOnly || disabled ? true : undefined}
              >
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    ) : (
      radioNode
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
) as RadioComponent;

Radio.displayName = "Radio";
Radio.Group = RadioGroup;
