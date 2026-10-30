/**
 * Props for the Recursica TextArea component.
 *
 * Forge mapping (names in `recursica_ui-kit.json` / `--recursica_ui-kit_components_<contract>_*`):
 * - Contract `textarea`. Axes: `layouts` (stacked, side-by-side) ← `formLayout`; `states` error ← `error`, disabled ← `disabled`.
 */
export interface RecursicaTextAreaProps {
  /** Shows asterisk next to label */
  withAsterisk?: boolean;
  /** Max rows constraint for autosizing */
  maxRows?: number;
  /** Min rows constraint for autosizing */
  minRows?: number;
  /** Allow height to stretch automatically with content */
  autosize?: boolean;
}
