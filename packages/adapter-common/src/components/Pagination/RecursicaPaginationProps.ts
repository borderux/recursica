/**
 * Props for the Recursica Pagination component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `pagination` (no variants).
 */
export interface RecursicaPaginationProps {
  /** If set to true, displays text labels alongside the icons for next/previous/first/last edges. */
  withLabels?: boolean;
  /** Total number of pages */
  total?: number;
  /** If set to true, first and last page buttons are visible */
  withEdges?: boolean;
  /** If set to true, next and prev page buttons are visible */
  withControls?: boolean;
}
