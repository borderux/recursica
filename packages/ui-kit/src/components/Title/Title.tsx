import { OmitStyles } from "../../utils";
import { Title as ManTitle, TitleProps as ManTitleProps } from "@mantine/core";

export interface TitleProps extends OmitStyles<ManTitleProps> {
  align?: "left" | "center" | "right";
}

export function Title({ children, align, ...props }: TitleProps) {
  return (
    <ManTitle
      style={{
        textAlign: align,
      }}
      {...props}
    >
      {children}
    </ManTitle>
  );
}
