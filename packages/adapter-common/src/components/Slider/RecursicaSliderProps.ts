import React from "react";

/**
 * Props for the Recursica Slider component.
 */
export interface RecursicaSliderProps {
  /** Active error state indicator or text label */
  error?: boolean | React.ReactNode;
  /** Required field validator */
  required?: boolean;
  /** Render visual asterisk */
  withAsterisk?: boolean;
  /** Callback triggered when slider value changes */
  onChange?: (value: number) => void;
  /** Callback triggered when dragging ends */
  onChangeEnd?: (value: number) => void;
  /** Visual form label above track */
  label?: React.ReactNode;
  /** Custom formatter function or React node for tooltip label */
  tooltipLabel?: React.ReactNode | ((value: number) => React.ReactNode);
  /** Icon shown to the left of the slider track */
  icon?: React.ReactNode;
  /** Render numeric input side-by-side or stacked */
  showInput?: boolean;
  /** Show min and max labels below track */
  showMinMaxLabels?: boolean;
}
