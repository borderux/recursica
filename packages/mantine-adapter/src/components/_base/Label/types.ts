import { InputLabelProps } from "@mantine/core";

export type LabelIndicatorType =
  | "none"
  | "optional"
  | "asterisk / truncate overflow"
  | "asterisk / full label text";

interface FigmaProps {
  /** Defines the required indicator and behavior.  Default is none */
  Indicator?: LabelIndicatorType;
  /** Boolean to show/hide the label */
  Show_label?: boolean;
  /** Label text.  You can also just use the children prop */
  Label?: React.ReactNode;
  /** Optional text to display after the label.  Default is (optional) */
  Optional_text?: string;
  /** The placement of the label relative to the form input component */
  Label_placement?: "top" | "left";
  /** Label alignment.  Used only for Label_placement="left".  Default is middle */
  Align?: "middle" | "top";
  /** You can use the Label prop or children prop for the label text */
  children?: React.ReactNode;
  /** If true, forces Indicator to be asterisk type with truncate overflow as default */
  required?: boolean;
  /** If true, renders Input.Label wrapper. If false, renders React fragment (assumes Input.Label already wraps it) */
  useLabelComponent?: boolean;
}

export type LabelProps = FigmaProps & InputLabelProps;

