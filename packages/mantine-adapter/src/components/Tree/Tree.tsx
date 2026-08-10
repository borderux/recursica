import React, { forwardRef, useEffect } from "react";
import {
  Tree as MantineTree,
  useTree,
  getTreeExpandedState,
  type RenderTreeNodePayload,
} from "@mantine/core";
import { useMergedRef } from "@mantine/hooks";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type RecursicaTreeProps } from "@recursica/adapter-common";
import { Button } from "../Button/Button";
import styles from "./Tree.module.css";

export type TreeProps = RecursicaOverStyled<
  RecursicaTreeProps & Omit<React.ComponentPropsWithoutRef<"ul">, "children">
>;

/** Simple chevron glyph; rotates via the row's `[data-expanded]` in CSS (`.row[data-expanded]
 * .expandGlyph`) — this reaches the glyph regardless of how deeply `Button` nests it internally,
 * since it's a plain descendant-combinator selector, not dependent on Button's own DOM structure.
 * Uses `currentColor` so it always matches Button's own tokened icon color for the "text" variant. */
function ExpandGlyph() {
  return (
    <svg
      className={styles.expandGlyph}
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

/** Curried so the fixed-shape `renderNode` callback (Mantine controls its signature) can still
 * close over `disabled`, which isn't part of `RenderTreeNodePayload`. */
function createRenderTreeNode(disabled: boolean) {
  return function renderTreeNode({
    node,
    hasChildren,
    expanded,
    selected,
    tree,
    elementProps,
  }: RenderTreeNodePayload) {
    return (
      <div
        {...elementProps}
        className={styles.row}
        data-has-children={hasChildren || undefined}
        data-expanded={hasChildren && expanded ? true : undefined}
      >
        {/* The only element that toggles expand/collapse on click — independent of selection,
            which `elementProps.onClick` (spread onto `.row` above) handles for the rest of the
            row. Stops propagation so the click never also reaches `.row`'s own handler and
            selects the node. Never independently focusable/tab-stoppable (tabIndex={-1},
            aria-hidden), so the row stays the only focusable element and this button never
            shows its own focus state. Always rendered, even for leaf nodes, so every row
            reserves the same layout space; CSS hides it (visibility, not display) when there
            are no children to toggle. Guards `disabled` itself (not just via the CSS
            `pointer-events: none` on `.root`) since this handler bypasses Mantine's own
            `expandOnClick`/`selectOnClick` flags entirely by calling `tree.toggleExpanded`
            directly. */}
        <Button
          overStyled
          variant="text"
          size="small"
          icon={<ExpandGlyph />}
          aria-label="Toggle subtree"
          aria-hidden="true"
          tabIndex={-1}
          className={styles.expandButton}
          onClick={(event) => {
            event.stopPropagation();
            if (disabled) return;
            tree.toggleExpanded(node.value);
          }}
        />
        <span className={styles.label} data-selected={selected || undefined}>
          {node.label}
        </span>
      </div>
    );
  };
}

/**
 * Recursively renders hierarchical `data` as an expandable/selectable tree.
 *
 * **Recursica Abstract:**
 * Wraps Mantine's `Tree` with a fully custom node renderer so every visual aspect (row box
 * model, selected/unselected colors and typography, indent, item spacing) comes from
 * Recursica's `tree` design tokens rather than Mantine's defaults.
 *
 * **Interaction pattern (fixed, not prop-configurable):** expand/collapse and select are
 * independent — the chevron button toggles a node's subtree only, clicking the rest of a row
 * (or pressing `Enter`/`Space`) selects it only, and `ArrowLeft`/`ArrowRight` toggle expansion
 * only. See `RecursicaTreeProps` for the full breakdown.
 */
export const Tree = forwardRef<HTMLUListElement, TreeProps>(function Tree(
  {
    overStyled = false,
    data,
    initialExpandedValues,
    initialSelectedValues,
    multiple = false,
    disabled = false,
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

  // `Enter`/`Space` select the focused node. Mantine's own `TreeNode` only wires this for
  // `Space`, and only as an expand toggle (`expandOnSpace`, disabled below) — it has no
  // select-on-key behavior and no `Enter` handling at all, and its key handler lives on the
  // `<li role="treeitem">` itself (not reachable through `renderNode`'s `elementProps`), so this
  // is added as a native listener on the tree root instead. `tree.select` is referentially
  // stable (Mantine wraps it in `useCallback` with no deps), so this effect only re-runs when
  // `disabled` actually changes.
  const rootRef = React.useRef<HTMLUListElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled) return;
      if (event.key !== "Enter" && event.key !== " ") return;
      const treeItem = (event.target as HTMLElement).closest<HTMLElement>(
        '[role="treeitem"]',
      );
      const value = treeItem?.dataset.value;
      if (!value) return;
      event.preventDefault();
      tree.select(value);
    };
    root.addEventListener("keydown", handleKeyDown);
    return () => root.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree.select, disabled]);

  // When disabled, block every keydown at the capture phase — before it can reach either the
  // listener above or Mantine's own internal per-node keydown handling (`ArrowLeft`/`ArrowRight`
  // expand/collapse, baked into `TreeNode` itself with no prop to disable it). A capture-phase
  // `stopPropagation` here keeps the event from ever reaching its target, so neither listener
  // fires — this is the only reachable way to block Mantine's internal handling for a component
  // with no `disabled` concept of its own. Mouse clicks are separately blocked via `pointer-
  // events: none` in CSS (`.root[data-disabled]`); this effect only needs to cover keyboard.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !disabled) return;
    const blockAllKeydown = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };
    root.addEventListener("keydown", blockAllKeydown, { capture: true });
    return () =>
      root.removeEventListener("keydown", blockAllKeydown, { capture: true });
  }, [disabled]);
  const mergedRef = useMergedRef(ref, rootRef);

  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;
  const rootClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  return (
    <MantineTree
      ref={mergedRef}
      data={data}
      tree={tree}
      expandOnClick={false}
      selectOnClick={!disabled}
      expandOnSpace={false}
      renderNode={createRenderTreeNode(disabled)}
      data-disabled={disabled || undefined}
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
