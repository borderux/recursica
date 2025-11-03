/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Component comments
 * 1. The Help_text shows a heart icon.  Are you allowing a slot (or component) for the help text, or simply text?
 * 2.
 */

import { FileInput as MantineFileInput } from "@mantine/core";
import { FileInputProps as MantineFileInputProps } from "@mantine/core";
import { forwardRef } from "react";
import {
  FormFieldLayout,
  FormFieldLayoutProps,
} from "../FormFieldLayout/FormFieldLayout";
import { MultiFileValueComponent } from "./MultiFileValueComponent";
import * as styles from "./FileInput.css";
import { Icon } from "../Icon/Icon";
import { recursica } from "@recursica/official-release";
import { getLayerClassname } from "../Layer";

interface FigmaProps {
  /** Visual state for visual testing purposes.  Not used for actual logic*/
  State: "Enabled" | "Disabled" | "Error" | "Error focused" | "Focused";
  /** Show/hide the upload icon.  Default is true */
  Upload_icon: boolean;
  /** Show/hide the clear icon (optional) */
  Clear_icon: boolean;
}

export type FileInputProps = FigmaProps &
  FormFieldLayoutProps &
  MantineFileInputProps;

export const FileInput = forwardRef<HTMLButtonElement, FileInputProps>(
  (props, ref) => {
    const {
      State,
      Upload_icon = true,
      Clear_icon = true,
      disabled,
      error,
      value,
      onChange,
      Layer,
      ...rest
    } = props;

    // Handle file removal for custom chips
    const handleRemoveFile = (indexToRemove: number) => {
      if (Array.isArray(value) && onChange) {
        const newValue = value.filter((_, index) => index !== indexToRemove);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange(newValue as any);
      }
    };

    // Determine the actual state based on props
    const getActualState = () => {
      // For testing purposes, use State prop if provided
      if (State && State !== "Enabled") {
        return State;
      }

      // Disabled takes precedence
      if (props.disabled) {
        return "Disabled";
      }
      // Check for error states
      if (props.error || props.Error_text) {
        return "Error";
      }
      // Default to Enabled
      return "Enabled";
    };

    // Get the appropriate state style
    const getStateStyle = (state: string) => {
      switch (state) {
        case "Enabled":
          return styles.stateEnabled;
        case "Disabled":
          return styles.stateDisabled;
        case "Error":
          return styles.stateError;
        case "Error focused":
          return styles.stateErrorFocused;
        case "Focused":
          return styles.stateFocused;
        default:
          return styles.stateEnabled;
      }
    };

    // Get focus styles for dynamic focus behavior
    const getFocusStyle = () => {
      if (props.disabled) {
        return ""; // No focus styles for disabled
      }
      if (props.error || props.Error_text) {
        return styles.wrapperWithErrorFocus;
      }
      return styles.wrapperWithFocus;
    };

    const actualState = getActualState();
    const focusStyle = getFocusStyle();

    return (
      <FormFieldLayout {...props} Layer={Layer}>
        <MantineFileInput
          {...rest}
          className={`${getLayerClassname(Layer)} ${rest.classNames}`}
          ref={ref}
          disabled={disabled}
          error={error}
          value={value}
          onChange={onChange}
          leftSection={
            Upload_icon ? (
              <Icon
                name="arrow_up_tray_solid"
                size={recursica.uiKit["file-input/size/icon"]}
                color={recursica.uiKit["file-input/color/upload-icon"]}
              />
            ) : (
              props.leftSection
            )
          }
          leftSectionPointerEvents={
            Upload_icon ? "none" : props.leftSectionPointerEvents
          }
          rightSection={
            Clear_icon && !props.multiple ? (
              <Icon
                name="x_mark_solid"
                size={recursica.uiKit["file-input/size/icon"]}
                color={recursica.uiKit["file-input/color/clear-icon"]}
                onClick={() => {
                  if (onChange) {
                    onChange(null);
                  }
                }}
              />
            ) : (
              props.rightSection
            )
          }
          valueComponent={
            props.multiple
              ? (valueProps: { value: File | File[] | null }) => {
                  const files = Array.isArray(valueProps.value)
                    ? valueProps.value
                    : null;
                  return (
                    <MultiFileValueComponent
                      value={files}
                      onRemove={handleRemoveFile}
                    />
                  );
                }
              : undefined
          }
          classNames={{
            ...(typeof rest.classNames === "object" ? rest.classNames : {}),
            wrapper: `${styles.wrapper} ${getStateStyle(actualState)} ${focusStyle} ${typeof rest.classNames === "object" ? rest.classNames?.wrapper || "" : ""}`,
            input: `${styles.input} ${Upload_icon ? styles.inputWithUploadIcon : ""} ${Clear_icon ? styles.inputWithClearIcon : ""} ${typeof rest.classNames === "object" ? rest.classNames?.input || "" : ""}`,
            section: `${styles.sectionOverride} ${Upload_icon ? styles.sectionWithUploadIcon : ""} ${Clear_icon ? styles.sectionWithClearIcon : ""}`,
          }}
        />
      </FormFieldLayout>
    );
  },
);

FileInput.displayName = "FileInput";
