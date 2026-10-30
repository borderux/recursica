/**
 * Props for the Recursica Popover component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `hover-card-popover`, shared with HoverCard: Forge has one contract for both, Recursica keeps HoverCard and Popover as two components.
 */
export interface RecursicaPopoverProps {
  /** Whether to display a beak (arrow) pointing from the popover to the target */
  withBeak?: boolean;
}
