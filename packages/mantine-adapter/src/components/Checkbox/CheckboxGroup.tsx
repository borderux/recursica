import { forwardRef } from "react";
import {
  Checkbox as MantineCheckbox,
  type CheckboxGroupProps as MantineCheckboxGroupProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Checkbox.module.css";

export interface RecursicaCheckboxGroupProps
  // Omit generic sizing boundaries entirely
  extends Omit<MantineCheckboxGroupProps, "size"> {
  /**
   * Defines explicit structure layout configurations mapped locally to the design tokens array.
   */
  layout?: "stacked" | "side-by-side";
}

export type CheckboxGroupProps =
  RecursicaOverStyled<RecursicaCheckboxGroupProps>;

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  function CheckboxGroup(
    { overStyled = false, layout = "stacked", ...rest },
    ref,
  ) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Delete prohibited sizing hooks from bypassing the variables
    delete restRecord["size"];

    const classNameProp = restRecord.className as string | undefined;

    // We only need to map the parent container grouping class directly because Mantine
    // implicitly wraps its Checkbox.Group elements inside a general flex mapping, but we
    // attach our native custom layout variants there!

    // We attach the data-layout attribute safely.
    const customGroupClass = styles.groupRoot;
    const finalClass = classNameProp
      ? `${customGroupClass} ${classNameProp}`
      : customGroupClass;

    return (
      <MantineCheckbox.Group
        ref={ref}
        className={finalClass}
        data-layout={layout}
        {...(sanitizedProps as unknown as MantineCheckboxGroupProps)}
      />
    );
  },
);

CheckboxGroup.displayName = "CheckboxGroup";
