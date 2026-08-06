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
  /** Expand/collapse a node with children when its row is clicked @default true */
  expandOnClick?: boolean;
  /** Select a node when its row is clicked @default true */
  selectOnClick?: boolean;
  /** Called with the node value whenever a node expands */
  onNodeExpand?: (value: string) => void;
  /** Called with the node value whenever a node collapses */
  onNodeCollapse?: (value: string) => void;
  /** Called with the full list of selected values whenever selection changes */
  onSelectedChange?: (values: string[]) => void;
}
