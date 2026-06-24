/**
 * Container layout wrapper.
 *
 * NOTE: As a foundational structural boundary, the Container component DOES NOT use
 * the `RecursicaOverStyled` gatekeeper. Furthermore, unlike other primitive layouts
 * (Stack, Group, Flex), Container explicitly ALLOWS the `sx` prop as an escape hatch
 * for advanced layout positioning.
 */
import { forwardRef } from "react";
import {
  Container as MUIContainer,
  type ContainerProps as MUIContainerProps,
} from "@mui/material";

import { type WithRecursicaSpacing } from "../../utils/filterStylingProps";
import { type RecursicaContainerProps } from "@recursica/adapter-common";

export type ContainerProps = WithRecursicaSpacing<
  Omit<MUIContainerProps, "maxWidth"> & RecursicaContainerProps
>;

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ children, size, ...rest }, ref) {
    const mapSize: Record<string, "xs" | "sm" | "md" | "lg" | "xl"> = {
      "rec-sm": "sm",
      "rec-default": "md",
      "rec-md": "md",
      "rec-lg": "lg",
      "rec-xl": "xl",
      "rec-2xl": "xl",
    };

    const resolvedSize =
      typeof size === "string" && mapSize[size] ? mapSize[size] : size;

    return (
      <MUIContainer
        ref={ref}
        maxWidth={resolvedSize as MUIContainerProps["maxWidth"]}
        {...rest}
      >
        {children}
      </MUIContainer>
    );
  },
);

Container.displayName = "Container";
