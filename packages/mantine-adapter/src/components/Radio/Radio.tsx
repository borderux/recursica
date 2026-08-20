import { forwardRef } from "react";
import {
  Radio as MantineRadio,
  type RadioProps as MantineRadioProps,
} from "@mantine/core";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import { RadioGroup } from "./RadioGroup";
import {
  filterStylingProps,
  omitUnsupportedProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import {
  type RequireAccessibleLabel,
  type RecursicaRadioProps,
} from "@recursica/adapter-common";
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

export type RadioWrapperProps = Omit<
  MantineRadioProps,
  "size" | "color" | "radius" | "iconColor" | "variant"
> &
  RecursicaRadioProps &
  ReadOnlyControlProps &
  Pick<
    FormControlLayoutProps,
    "formLayout" | "labelSize" | "controlMaxWidth" | "controlMinWidth"
  >;

export type RecursicaRadioPropsAlias =
  RequireAccessibleLabel<RadioWrapperProps>;

export type RadioProps = RecursicaOverStyled<RecursicaRadioPropsAlias>;

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
      ...rest
    } = props;
    // Props this component intentionally doesn't support — deleted at runtime so they can't leak
    // through even if a caller forces them via plain JavaScript, bypassing the `Omit<>` above.
    const UNSUPPORTED_PROPS = [
      "size", // Recursica controls sizing via Radio.module.css variables, not Mantine's native size scale.
      "color", // Colors are token-driven via Radio.module.css; Mantine's native palette isn't exposed.
      "radius", // Corner radius is fixed by Recursica tokens in Radio.module.css, not caller-configurable.
      "variant", // Radio has a single Recursica-defined visual treatment; Mantine's variant isn't exposed.
      "iconColor", // Icon color is token-driven via Radio.module.css, not a native Mantine override.
    ] as const satisfies readonly (keyof MantineRadioProps)[];

    const sanitizedProps = omitUnsupportedProps(
      filterStylingProps(rest, overStyled) as Record<string, unknown>,
      UNSUPPORTED_PROPS,
    ) as Partial<typeof rest>;
    const restRecord = sanitizedProps as Record<string, unknown>;

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

    // We omit Mantine's sizing/coloring so we rely strictly on variables from Radio.module.css
    const radioNode = (
      <MantineRadio
        ref={ref}
        {...(sanitizedProps as unknown as MantineRadioProps)}
        icon={RadioIcon}
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
          {radioNode}
        </FormControlLayout>
      );
    }

    return radioNode;
  },
) as RadioComponent;

Radio.displayName = "Radio";
Radio.Group = RadioGroup;
