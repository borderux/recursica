import { forwardRef } from "react";
import { Input } from "@mantine/core";
import { styles } from "./ErrorText.css";

export interface ErrorTextProps {
  /** Text to display. It can also be the children prop */
  Text?: React.ReactNode;
  /** Set to true if an icon is specified.  This is redundant with just providing an Icon prop. */
  Has_icon?: boolean;
  /** The icon to show next to the error text */
  Icon?: React.ReactNode;
  /** Set to true if the error text should be used as an input error. */
  useInputError?: boolean;
  /** The content to display. This will override the Text prop. */
  children?: React.ReactNode;
}

export const ErrorText = forwardRef<HTMLDivElement, ErrorTextProps>(
  (props, ref) => {
    const { Text, Has_icon, Icon, useInputError = false, children } = props;

    const content = (
      <>
        {Has_icon && Icon}
        {Text || children}
      </>
    );

    if (useInputError) {
      return (
        <Input.Error ref={ref} className={styles.root}>
          {content}
        </Input.Error>
      );
    }

    return content;
  },
);

ErrorText.displayName = "ErrorText";
