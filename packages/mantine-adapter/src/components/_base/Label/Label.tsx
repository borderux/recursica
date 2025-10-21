/**
 * 1. Show_label prop controls visibility via CSS (display: none) but keeps the label in the DOM
 * 2. I added the Label_placement prop, even though its not on the base component because there is a align-left and align-right problem
 * 3. The Figma Label placement uses the terms Left and Top, but referred to as Stacked and Side-by-side in other places
 */
import { Input } from "@mantine/core";
import { forwardRef } from "react";
import { mapInputLabelProps } from "./mapInputLabelProps";
import { LabelProps, LabelIndicatorType } from "./types";

// Re-export types for backward compatibility
export type { LabelProps, LabelIndicatorType };

export const Label = forwardRef<HTMLLabelElement, LabelProps>((props, ref) => {
  const mappedProps = mapInputLabelProps(props);
  const children = (
    <>
      <span data-label-text>{props.Label || props.children}</span>
      <span data-optional-text aria-hidden="true">
        {props.Optional_text || "(optional)"}
      </span>
    </>
  );

  if (props.useLabelComponent) {
    return (
      <Input.Label {...mappedProps} ref={ref}>
        {children}
      </Input.Label>
    );
  }
  // Return just the children as a React fragment when useLabelComponent is false
  return children;
});
