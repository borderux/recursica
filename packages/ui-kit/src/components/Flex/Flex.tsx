import { Flex as ManFlex, FlexProps as ManFlexProps } from "@mantine/core";
import { OmitStyles } from "../../utils";

export interface FlexProps extends OmitStyles<ManFlexProps> {
  overFlowY?: "auto" | "hidden" | "scroll" | "visible";
  overFlowX?: "auto" | "hidden" | "scroll" | "visible";
  overFlow?: "auto" | "hidden" | "scroll" | "visible";
}

export function Flex({
  children,
  overFlow,
  overFlowX,
  overFlowY,
  ...props
}: FlexProps) {
  return (
    <ManFlex
      style={{
        overflow: overFlow,
        overflowX: overFlowX,
        overflowY: overFlowY,
      }}
      {...props}
    >
      {children}
    </ManFlex>
  );
}
