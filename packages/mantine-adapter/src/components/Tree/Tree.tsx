import React, { forwardRef, useEffect } from "react";
import {
  Tree as MantineTree,
  useTree,
  getTreeExpandedState,
  type RenderTreeNodePayload,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaTreeProps } from "@recursica/adapter-common";
import styles from "./Tree.module.css";

export type TreeProps = RecursicaOverStyled<
  RecursicaTreeProps & Omit<React.ComponentPropsWithoutRef<"ul">, "children">
>;

/** Simple chevron glyph; rotates via `[data-expanded]` in CSS. Uses `currentColor` so it
 * always matches the row's tokened text color — Tree has no dedicated icon-color token. */
function ExpandGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 3l5 5-5 5" />
    </svg>
  );
}

function renderTreeNode({
  node,
  hasChildren,
  expanded,
  elementProps,
}: RenderTreeNodePayload) {
  return (
    <div
      {...elementProps}
      className={styles.row}
      data-has-children={hasChildren || undefined}
      data-expanded={hasChildren && expanded ? true : undefined}
    >
      <span className={styles.expandIcon} aria-hidden="true">
        {hasChildren && <ExpandGlyph />}
      </span>
      <span className={styles.label}>{node.label}</span>
    </div>
  );
}

/**
 * Recursively renders hierarchical `data` as an expandable/selectable tree.
 *
 * **Recursica Abstract:**
 * Wraps Mantine's `Tree` with a fully custom node renderer so every visual aspect (row box
 * model, selected/unselected colors and typography, indent, item spacing) comes from
 * Recursica's `tree` design tokens rather than Mantine's defaults.
 */
export const Tree = forwardRef<HTMLUListElement, TreeProps>(function Tree(
  {
    overStyled = false,
    data,
    initialExpandedValues,
    initialSelectedValues,
    multiple = false,
    expandOnClick = true,
    selectOnClick = true,
    onNodeExpand,
    onNodeCollapse,
    onSelectedChange,
    ...rest
  },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);

  const tree = useTree({
    initialExpandedState: initialExpandedValues
      ? getTreeExpandedState(data, initialExpandedValues)
      : undefined,
    initialSelectedState: initialSelectedValues,
    multiple,
    onNodeExpand,
    onNodeCollapse,
  });

  // Mantine's `useTree` tracks selection internally but has no `onSelectedChange` callback of
  // its own; surface one at the Recursica layer by watching the controller's selectedState.
  useEffect(() => {
    onSelectedChange?.(tree.selectedState);
  }, [tree.selectedState, onSelectedChange]);

  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;
  const rootClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  return (
    <MantineTree
      ref={ref}
      data={data}
      tree={tree}
      expandOnClick={expandOnClick}
      selectOnClick={selectOnClick}
      renderNode={renderTreeNode}
      classNames={{
        root: rootClass,
        node: styles.node,
        subtree: styles.subtree,
      }}
      {...(sanitizedProps as unknown as Record<string, unknown>)}
    />
  );
});

Tree.displayName = "Tree";
