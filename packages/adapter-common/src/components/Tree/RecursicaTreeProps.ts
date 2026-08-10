import React from "react";

/**
 * A single node in a Recursica Tree's `data` array. Structurally compatible
 * with the underlying libraries' own node shapes (e.g. Mantine's
 * `TreeNodeData`), so adapters can pass it straight through without mapping.
 */
export interface RecursicaTreeNode {
  /** Unique identifier for this node, used for selection/expansion state */
  value: string;
  /** Label content rendered for this node */
  label: React.ReactNode;
  /** Nested child nodes; presence of this array (even empty) makes the node expandable */
  children?: RecursicaTreeNode[];
}

/**
 * Props for the Recursica Tree component.
 *
 * **Fixed interaction pattern (not configurable):** expanding/collapsing and selecting are
 * separate, independent actions, so a user can toggle a subtree without changing selection.
 * - Clicking the expand/collapse button (chevron) toggles that node's subtree only; it never
 *   selects.
 * - Clicking anywhere else on a node's row selects it; it never toggles expansion.
 * - `Enter`/`Space` while a node is focused selects it (never toggles expansion, even when the
 *   node has children).
 * - `ArrowLeft`/`ArrowRight` expand/collapse the focused node only; they never change selection.
 * - `ArrowUp`/`ArrowDown` move focus between rows (standard roving-tabindex navigation).
 *
 * There used to be `expandOnClick`/`selectOnClick` toggles for the old combined click behavior;
 * they're gone now that expand and select are always independent.
 */
export interface RecursicaTreeProps {
  /** Hierarchical data used to render the tree */
  data: RecursicaTreeNode[];
  /** Node values expanded by default, or `"*"` to expand every node (uncontrolled) */
  initialExpandedValues?: string[] | "*";
  /** Node values selected by default (uncontrolled) */
  initialSelectedValues?: string[];
  /** Allow more than one node to be selected at a time @default false */
  multiple?: boolean;
  /** Disable the whole tree — no expand/collapse or select via click or keyboard, dimmed to the
   * standard disabled opacity. Per-node disabling isn't exposed (no design token or data field
   * backs it); a selected node stays visibly selected, just dimmed along with everything else.
   * @default false */
  disabled?: boolean;
  /** Called with the node value whenever a node expands */
  onNodeExpand?: (value: string) => void;
  /** Called with the node value whenever a node collapses */
  onNodeCollapse?: (value: string) => void;
  /** Called with the full list of selected values whenever selection changes */
  onSelectedChange?: (values: string[]) => void;
}
