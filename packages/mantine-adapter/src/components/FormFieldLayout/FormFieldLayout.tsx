import { forwardRef, ReactElement, cloneElement, isValidElement } from "react";
import { styles } from "./FormFieldLayout.css";
import { Label as LabelComponent } from "../_base/Label";
import { LabelProps } from "../_base/Label/types";
import { mapInputLabelProps } from "../_base/Label/mapInputLabelProps";
import {
  DataAttributes,
  InputDescriptionProps,
  InputLabelProps,
} from "@mantine/core";
import { LabelIndicatorType } from "../_base/Label/types";
import { HelpText } from "../_base/HelpText/HelpText";
import { ErrorText, ErrorTextProps } from "../_base/ErrorText/ErrorText";

// Define HelpTextProps locally since it's not exported
interface HelpTextProps {
  Text?: React.ReactNode;
  Has_icon?: boolean;
  Icon?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * 1. For the label, we want to use our own label component and pass its props that it expects to layout.
 */

interface MantineComponentProps {
  classNames?: {
    root?: string;
    label?: string;
    wrapper?: string;
    description?: string;
    error?: string;
    [key: string]: string | undefined;
  };
  [key: string]: unknown;
}

export interface FormFieldLayoutProps {
  /** Layout orientation - stacked (top) or side-by-side (left).  Default is stacked */
  Layout?: "Stacked" | "Side-by-side";
  /** The label component.  This is typically just a string, but if you want to use your own label component, you can */
  Label?: React.ReactNode;
  /** Props to be passed to the label component if its a custom component */
  LabelProps?: LabelProps & DataAttributes;
  /** Sets if the field is required.  Passed down to the underlying component */
  required?: boolean;
  /** Optional.  Set to true if field is optional */
  Indicator?: LabelIndicatorType;
  /** Help text to be shown.  Maps to the mantine description prop */
  Help_text?: React.ReactNode;
  /** Custom help text component.  If provided, the Help_text prop will be ignored */
  Help_textProps?: HelpTextProps & DataAttributes;
  /** Error text to be shown.  Maps to the mantine error prop */
  Error_text?: React.ReactNode;
  /** Custom error text component.  If provided, the Error_text prop will be ignored */
  Error_textProps?: ErrorTextProps & DataAttributes;
  /** Shows/hides the label */
  Show_label?: boolean;
  /** The Mantine form component to wrap (e.g., TextInput, Select, etc.) */
  children: ReactElement<MantineComponentProps>;
}

interface LabelReturnProps {
  label?: React.ReactNode;
  labelProps?: InputLabelProps & DataAttributes;
}

const renderLabelProps = (
  Layout?: "Stacked" | "Side-by-side",
  Label?: React.ReactNode,
  LabelProps?: LabelProps & DataAttributes,
  Indicator?: LabelIndicatorType,
  required?: boolean,
  Show_label?: boolean,
) => {
  const returnProps: LabelReturnProps = {
    label: undefined,
    labelProps: undefined,
  };
  if (!Label && !LabelProps) {
    return returnProps;
  }

  // Create the label props with proper mapping
  const newLabelProps: LabelProps = {
    Indicator,
    required,
    Show_label,
    Label_placement:
      Layout === "Side-by-side" ? ("left" as const) : ("top" as const),
    ...LabelProps,
  };

  // Return the mapped props with label content and the Label component
  returnProps.labelProps = mapInputLabelProps(newLabelProps);
  returnProps.label = (
    <LabelComponent useLabelComponent={false}>{Label}</LabelComponent>
  );
  return returnProps;
};

interface DescriptionReturnProps {
  description?: React.ReactNode;
  descriptionProps?: InputDescriptionProps & DataAttributes;
}

const renderDescriptionProps = (
  Help_text?: React.ReactNode,
  Help_textProps?: HelpTextProps,
) => {
  const returnProps: DescriptionReturnProps = {
    description: undefined,
    descriptionProps: undefined,
  };
  if (!Help_text && !Help_textProps) {
    return returnProps;
  }
  returnProps.description = (
    <HelpText {...Help_textProps}>{Help_text}</HelpText>
  );
  return returnProps;
};

interface ErrorReturnProps {
  error?: React.ReactNode;
  errorProps?: DataAttributes;
}

const renderErrorProps = (
  Error_text?: React.ReactNode,
  Error_textProps?: ErrorTextProps,
) => {
  const returnProps: ErrorReturnProps = {
    error: undefined,
    errorProps: undefined,
  };
  if (!Error_text && !Error_textProps) {
    return returnProps;
  }
  returnProps.error = <ErrorText {...Error_textProps}>{Error_text}</ErrorText>;
  return returnProps;
};

export const FormFieldLayout = forwardRef<HTMLElement, FormFieldLayoutProps>(
  (
    {
      children,
      Layout = "Stacked",
      Label,
      LabelProps,
      Help_text,
      Help_textProps,
      Error_text,
      Error_textProps,
      Show_label = true,
      Indicator = "none",
      required = false,
    },
    ref,
  ) => {
    const rootClass =
      Layout === "Side-by-side" ? styles.rootHorizontal : styles.root;

    if (!isValidElement(children)) {
      return children;
    }

    const label = renderLabelProps(
      Layout,
      Label,
      LabelProps,
      Indicator,
      required,
      Show_label,
    );

    const fieldElement = cloneElement(children, {
      ref,
      // Pass the label content and label props separately
      label: label.label,
      labelProps: label.labelProps,
      ...renderDescriptionProps(Help_text, Help_textProps),
      ...renderErrorProps(Error_text, Error_textProps),
      classNames: {
        root: `${rootClass} ${children.props.classNames?.root || ""}`,
        // For stacked layout, position description and error below wrapper
        label:
          (typeof label.labelProps?.classNames === "object" &&
            label.labelProps?.classNames?.label) ||
          "",
        ...(Layout === "Stacked" && {
          wrapper: `${styles.wrapperStacked} ${children.props.classNames?.wrapper || ""}`,
          description: `${styles.descriptionStacked} ${Error_text || Error_textProps ? styles.descriptionStackedWithError : ""} ${children.props.classNames?.description || ""}`,
          error: `${styles.errorStacked} ${children.props.classNames?.error || ""}`,
        }),
        // For side-by-side layout, apply column-specific styles
        ...(Layout === "Side-by-side" && {
          wrapper: `${styles.wrapperHorizontal} ${children.props.classNames?.wrapper || ""}`,
          description: `${styles.descriptionHorizontal} ${Error_text || Error_textProps ? styles.descriptionHorizontalWithError : ""} ${children.props.classNames?.description || ""}`,
          error: `${styles.errorHorizontal} ${children.props.classNames?.error || ""}`,
        }),
        ...children.props.classNames,
      },
    } as MantineComponentProps);

    return fieldElement;
  },
);

FormFieldLayout.displayName = "FormFieldLayout";
