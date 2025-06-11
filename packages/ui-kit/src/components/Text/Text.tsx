import { OmitStyles } from "../../utils";
import { Text as ManText, TextProps as ManTextProps } from "@mantine/core";
import { PropsWithChildren } from "react";

export interface TextProps
  extends OmitStyles<ManTextProps>,
    PropsWithChildren {}

export function Text({ children, ...props }: TextProps) {
  return <ManText {...props}>{children}</ManText>;
}
