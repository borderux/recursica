import { Flex as ManFlex, FlexProps as ManFlexProps } from "@mantine/core";
import { OmitStyles } from "../../utils";
import { RecursicaColors } from "../../recursica/RecursicaColorsType";
import { recursica } from "../../recursica/Recursica";

type Border<T> = {
  top?: T;
  right?: T;
  bottom?: T;
  left?: T;
};

export interface FlexProps extends OmitStyles<ManFlexProps> {
  overFlowY?: "auto" | "hidden" | "scroll" | "visible";
  overFlowX?: "auto" | "hidden" | "scroll" | "visible";
  overFlow?: "auto" | "hidden" | "scroll" | "visible";
  border?: Border<string> | string;
  borderColor?: RecursicaColors | Border<string>;
}

export function Flex({
  children,
  overFlow,
  overFlowX,
  overFlowY,
  border,
  borderColor,
  ...props
}: FlexProps) {
  const borderStyle =
    typeof border === "string"
      ? {
          borderTop: border,
          borderRight: border,
          borderBottom: border,
          borderLeft: border,
        }
      : typeof border === "object"
        ? {
            borderTop: border.top,
            borderRight: border.right,
            borderBottom: border.bottom,
            borderLeft: border.left,
          }
        : {};
  const borderColorStyle =
    typeof borderColor === "string"
      ? { borderColor: recursica[borderColor] }
      : typeof borderColor === "object"
        ? {
            borderTopColor: recursica[borderColor.top as RecursicaColors],
            borderRightColor: recursica[borderColor.right as RecursicaColors],
            borderBottomColor: recursica[borderColor.bottom as RecursicaColors],
            borderLeftColor: recursica[borderColor.left as RecursicaColors],
          }
        : {};
  return (
    <ManFlex
      style={{
        overflow: overFlow,
        overflowX: overFlowX,
        overflowY: overFlowY,
        ...borderStyle,
        ...borderColorStyle,
      }}
      {...props}
    >
      {children}
    </ManFlex>
  );
}
