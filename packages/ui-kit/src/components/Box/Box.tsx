import { OmitStyles } from "../../utils";
import { Box as ManBox, BoxProps as ManBoxProps } from "@mantine/core";
import { PropsWithChildren } from "react";

export interface BoxProps extends OmitStyles<ManBoxProps>, PropsWithChildren {}

export function Box({ children, ...props }: BoxProps) {
  return <ManBox {...props}>{children}</ManBox>;
}
