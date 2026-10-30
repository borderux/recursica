import React from "react";
import { RecursicaSpacing } from "../../types";

/**
 * Props for the Recursica Container layout component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Not a Forge component: intentionally outside the UI kit, so it has no `ui-kit_components_*` contract.
 */
export interface RecursicaContainerProps {
  /** Content inside the container */
  children?: React.ReactNode;
  /** Maximum width constraint */
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | RecursicaSpacing
    | (string & {})
    | number;
  /** Fluid container takes 100% of max-width */
  fluid?: boolean;
}
