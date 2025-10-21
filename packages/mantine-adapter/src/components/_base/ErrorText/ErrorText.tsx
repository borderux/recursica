import { forwardRef } from "react";
import { Input } from "@mantine/core";
import { styles } from "./ErrorText.css";

export interface ErrorTextProps {
  Text?: React.ReactNode;
  Has_icon?: boolean;
  Icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const ErrorText = forwardRef<HTMLDivElement, ErrorTextProps>(
  (props, ref) => {
    const { Text, Has_icon, Icon, children } = props;
    return (
      <Input.Error ref={ref} className={styles.root}>
        {Has_icon && Icon && Icon}
        {Text || children}
      </Input.Error>
    );
  },
);

ErrorText.displayName = "ErrorText";
