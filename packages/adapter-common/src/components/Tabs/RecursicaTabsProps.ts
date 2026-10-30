/**
 * Props for the Recursica Tabs component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `tabs`. Axes: `styles` ← `variant` (default, pills, outline); `orientation` ← `orientation` (horizontal, vertical).
 * - Forge's `tabs-item` contract is each Tab inside the Tabs list (child of the parent). It adds `selection-states` (inactive, active, derived from the selected value) and `states` disabled.
 * - `inverted` is not a Forge axis; it is a non-themed layout option.
 */
export interface RecursicaTabsProps {
  /**
   * Tab layout variant styles
   *
   * Forge axis `styles`.
   */
  variant?: "default" | "outline" | "pills" | (string & {});
  /**
   * Whether the tabs are inverted (tabs list at the bottom/right instead of top/left)
   *
   * Not a Forge axis; layout option only.
   */
  inverted?: boolean;
  /**
   * Direction the tabs list is laid out in
   *
   * Forge axis `orientation` (horizontal, vertical).
   */
  orientation?: "horizontal" | "vertical";
}
