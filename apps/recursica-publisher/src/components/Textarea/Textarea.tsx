import {
  Textarea as MantineTextarea,
  type TextareaProps as MantineTextareaProps,
} from "@mantine/core";
import { forwardRef } from "react";
import classes from "./Textarea.module.css";

export interface TextareaProps extends MantineTextareaProps {
  readonly?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ readonly, className, classNames, disabled, ...props }, ref) => {
    return (
      <MantineTextarea
        ref={ref}
        readOnly={readonly}
        disabled={readonly ? false : disabled}
        className={className}
        classNames={{
          ...(typeof classNames === "object" && classNames !== null
            ? {
                input: [
                  readonly ? classes.readonly : undefined,
                  readonly && !props.value
                    ? classes.readonlyDisabled
                    : undefined,
                  classNames.input,
                ]
                  .filter(Boolean)
                  .join(" "),
              }
            : {
                input: [
                  readonly ? classes.readonly : undefined,
                  readonly && !props.value
                    ? classes.readonlyDisabled
                    : undefined,
                ]
                  .filter(Boolean)
                  .join(" "),
              }),
        }}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
