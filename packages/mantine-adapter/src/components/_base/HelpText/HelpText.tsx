import { forwardRef } from "react";

interface HelpTextProps {
  Text?: React.ReactNode;
  Has_icon?: boolean;
  Icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const HelpText = forwardRef<HTMLSpanElement, HelpTextProps>(
  (props, ref) => {
    const { Text, Has_icon, Icon } = props;
    return <span ref={ref}>{Text || props.children}</span>;
  },
);
