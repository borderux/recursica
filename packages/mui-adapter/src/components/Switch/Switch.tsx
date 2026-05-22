import { forwardRef } from "react";
import {
  Switch as MuiSwitch,
  type SwitchProps as MuiSwitchProps,
} from "@mui/material";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";

import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RequireAccessibleLabel } from "../../utils/RequireAccessibleLabel";
import {
  FormControlLayout,
  type FormControlLayoutProps,
} from "../FormControlLayout/FormControlLayout";
import styles from "./Switch.module.css";

import { SwitchGroup } from "./SwitchGroup";

export type RecursicaSwitchProps = RequireAccessibleLabel<
  Omit<MuiSwitchProps, "size" | "color" | "radius" | "variant"> &
    ReadOnlyControlProps &
    Pick<
      FormControlLayoutProps,
      "formLayout" | "labelSize" | "controlMaxWidth" | "controlMinWidth"
    >
>;

export type SwitchProps = RecursicaOverStyled<RecursicaSwitchProps>;

type SwitchComponent = any;

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
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Actively delete dimension bindings that bypass the abstraction
    delete restRecord["size"];
    delete restRecord["color"];
    delete restRecord["radius"];
    delete restRecord["variant"];

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

    // We omit Mui's sizing/coloring so we rely strictly on variables from Switch.module.css
    const switchNode = (
      <MuiSwitch
        ref={ref}
        className={finalClass}
        classes={mergedClassNames}
        disabled={readOnly || disabled}
        data-disabled={readOnly || disabled || undefined}
        // thumbIcon={thumbIcon ?? FinalThumbIcon}
        {...(sanitizedProps as unknown as MuiSwitchProps)}
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
