import {
  TextInput as MantineTextInput,
  type TextInputProps as MantineTextInputProps,
} from "@mantine/core";
import { forwardRef } from "react";

export type TextInputProps = MantineTextInputProps;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ size = "md", className, ...props }, ref) => {
    return (
      <MantineTextInput
        ref={ref}
        size={size}
        className={className}
        {...props}
      />
    );
  },
);

TextInput.displayName = "TextInput";
