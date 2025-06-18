import { OmitStyles } from "../../utils";
import {
  Loader as ManLoader,
  LoaderProps as ManLoaderProps,
} from "@mantine/core";
import { PropsWithChildren } from "react";

export interface LoaderProps
  extends OmitStyles<ManLoaderProps>,
    PropsWithChildren {}

export function Loader({ children, ...props }: LoaderProps) {
  return <ManLoader {...props}>{children}</ManLoader>;
}
