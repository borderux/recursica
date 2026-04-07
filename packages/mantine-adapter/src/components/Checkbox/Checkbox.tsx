import { forwardRef } from "react";
import {
  Checkbox as MantineCheckbox,
  type CheckboxProps as MantineCheckboxProps,
} from "@mantine/core";
import { CheckboxGroup } from "./CheckboxGroup";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Checkbox.module.css";

export type RecursicaCheckboxProps = Omit<
  MantineCheckboxProps,
  "size" | "color" | "radius" | "iconColor" | "variant"
>;

export type CheckboxProps = RecursicaOverStyled<RecursicaCheckboxProps>;

type CheckboxComponent = React.ForwardRefExoticComponent<
  CheckboxProps & React.RefAttributes<HTMLInputElement>
> & {
  Group: typeof CheckboxGroup;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Actively delete dimension bindings that bypass the abstraction
    delete restRecord["size"];
    delete restRecord["color"];
    delete restRecord["radius"];
    delete restRecord["variant"];
    delete restRecord["iconColor"];

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

    // We omit Mantine's sizing/coloring so we rely strictly on variables from Checkbox.module.css
    return (
      <MantineCheckbox
        ref={ref}
        className={finalClass}
        classNames={mergedClassNames}
        {...(sanitizedProps as unknown as MantineCheckboxProps)}
      />
    );
  },
) as CheckboxComponent;

Checkbox.displayName = "Checkbox";
Checkbox.Group = CheckboxGroup;
