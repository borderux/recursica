import { forwardRef } from "react";
import {
  Radio as MantineRadio,
  type RadioProps as MantineRadioProps,
} from "@mantine/core";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import { RadioGroup } from "./RadioGroup";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
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

export type RecursicaRadioProps = Omit<
  MantineRadioProps,
  "size" | "color" | "radius" | "iconColor" | "variant"
> &
  ReadOnlyControlProps;

export type RadioProps = RecursicaOverStyled<RecursicaRadioProps>;

type RadioComponent = React.ForwardRefExoticComponent<
  RadioProps & React.RefAttributes<HTMLInputElement>
> & {
  Group: typeof RadioGroup;
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { overStyled = false, readOnly, readOnlyComponent, disabled, ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const restRecord = sanitizedProps as Record<string, unknown>;

  // Actively delete dimension bindings that bypass the abstraction
  delete restRecord["size"];
  delete restRecord["color"];
  delete restRecord["radius"];
  delete restRecord["variant"];
  delete restRecord["iconColor"];

  if (readOnly && readOnlyComponent) {
    // Safely fallback explicitly returning mapped elements natively without macro wrappers
    return <>{readOnlyComponent}</>;
  }

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

  // We omit Mantine's sizing/coloring so we rely strictly on variables from Radio.module.css
  return (
    <MantineRadio
      ref={ref}
      icon={RadioIcon}
      className={finalClass}
      classNames={mergedClassNames}
      disabled={readOnly || disabled}
      {...(sanitizedProps as unknown as MantineRadioProps)}
    />
  );
}) as RadioComponent;

Radio.displayName = "Radio";
Radio.Group = RadioGroup;
