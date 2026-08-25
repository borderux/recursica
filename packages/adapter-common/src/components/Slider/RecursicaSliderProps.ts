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
  /** Controlled value. Pass a `[number, number]` tuple to render a two-thumb range slider. */
  value?: number | [number, number];
  /** Uncontrolled initial value. Pass a `[number, number]` tuple to render a two-thumb range slider. */
  defaultValue?: number | [number, number];
  /** Callback triggered when slider value changes */
  onChange?: (value: number | [number, number]) => void;
  /** Callback triggered when dragging ends */
  onChangeEnd?: (value: number | [number, number]) => void;
  /** Visual form label above track */
  label?: React.ReactNode;
  /** Custom formatter function or React node for tooltip label */
  tooltipLabel?: React.ReactNode | ((value: number) => React.ReactNode);
  /** Icon shown to the left of the slider track */
  icon?: React.ReactNode;
  /** Icon shown to the right of the slider track */
  trailingIcon?: React.ReactNode;
  /** Render numeric input side-by-side or stacked */
  showInput?: boolean;
  /** Show min and max labels below track */
  showMinMaxLabels?: boolean;
  /** Override the label shown at the minimum end of the track. Defaults to the numeric `min`. */
  minLabel?: React.ReactNode;
  /** Override the label shown at the maximum end of the track. Defaults to the numeric `max`. */
  maxLabel?: React.ReactNode;
}
