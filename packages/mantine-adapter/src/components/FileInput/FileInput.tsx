/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Component comments
 * 1. The Help_text shows a heart icon.  Are you allowing a slot (or component) for the help text, or simply text?
 * 2.
 */

import { FileInput as MantineFileInput } from "@mantine/core";
import { FileInputProps as MantineFileInputProps } from "@mantine/core";
import { forwardRef } from "react";
import { styles } from "./FileInput.css";
import { label } from "../_base/Label/Label.css";

interface FigmaProps {
  /** The layout of the file input.  Default is stacked*/
  Layout: "Stacked" | "Side-by-side";
  /** Visual state for visual testing purposes.  Not used for actual logic*/
  State: "Enabled" | "Disabled" | "Error" | "Error focused" | "Focused";
  /** Show/hide the upload icon.  Default is true */
  Upload_icon: boolean;
  /** Show/hide the clear icon (optional) */
  Clear_icon: boolean;
  /** The text to display below the component for help text */
  Help_text: string;
}

export type FileInputProps = FigmaProps & MantineFileInputProps;

export const FileInput = forwardRef<HTMLButtonElement, FileInputProps>(
  (props, ref) => {
    const { Layout, State, Upload_icon, Clear_icon, Help_text, ...rest } =
      props;
    return <MantineFileInput {...rest} ref={ref} />;
  },
);

FileInput.displayName = "FileInput";
