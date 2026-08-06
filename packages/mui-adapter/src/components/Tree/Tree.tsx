import React, { forwardRef } from "react";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import {
  useTreeItem,
  type UseTreeItemParameters,
} from "@mui/x-tree-view/useTreeItem";
import { useTreeItemModel } from "@mui/x-tree-view/hooks";
import { TreeItemProvider } from "@mui/x-tree-view/TreeItemProvider";
import {
  TreeItemRoot,
  TreeItemContent,
  TreeItemIconContainer,
  TreeItemGroupTransition,
  TreeItemLabel,
} from "@mui/x-tree-view/TreeItem";
import { TreeItemIcon } from "@mui/x-tree-view/TreeItemIcon";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import {
  type RecursicaTreeProps,
  type RecursicaTreeNode,
} from "@recursica/adapter-common";
import styles from "./Tree.module.css";

export type TreeProps = RecursicaOverStyled<
  RecursicaTreeProps & Omit<React.ComponentPropsWithoutRef<"ul">, "children">
>;

function collectAllValues(nodes: RecursicaTreeNode[]): string[] {
  const values: string[] = [];
  const walk = (list: RecursicaTreeNode[]) => {
    list.forEach((node) => {
      values.push(node.value);
      if (node.children) walk(node.children);
    });
  };
  walk(nodes);
  return values;
}

/** Simple chevron glyph; MUI renders a different component for expanded vs collapsed rather
 * than one rotating icon (unlike Mantine's `[data-expanded]` approach), so collapseIcon carries
 * its own rotated variant. Both use `currentColor` — no dedicated icon-color token exists. */
function ExpandGlyph() {
  return (
    <svg
      className={styles.chevron}
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
function CollapseGlyph() {
  return (
    <svg
      className={`${styles.chevron} ${styles.chevronExpanded}`}
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
/** Rendered for leaf items so the icon-container box (and therefore row alignment) stays
 * consistent whether or not a row has an expand chevron, matching the mantine-adapter
 * implementation's always-present `.expandIcon` span. */
function EndGlyph() {
  return <span aria-hidden="true" />;
}

interface CustomTreeItemProps extends UseTreeItemParameters {
  className?: string;
}

/** Custom `slots.item` renderer. Mirrors the mantine-adapter's `renderNode`: every visual
 * property comes from Tree.module.css rather than @mui/x-tree-view's own default TreeItem
 * styles. `useTreeItemModel` retrieves the *original* `RecursicaTreeNode` (with its real
 * `React.ReactNode` label) — `getItemLabel` on `RichTreeView` only ever sees a coerced string
 * (required for its internal a11y/typeahead search), so this is the only way to render rich
 * (non-string) labels. See IMPLEMENTATION_NOTES.md. */
const CustomTreeItem = forwardRef<HTMLLIElement, CustomTreeItemProps>(
  function CustomTreeItem(
    { id, itemId, label, disabled, children, className, ...rest },
    ref,
  ) {
    const {
      getContextProviderProps,
      getRootProps,
      getContentProps,
      getIconContainerProps,
      getLabelProps,
      getGroupTransitionProps,
      status,
    } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

    const item = useTreeItemModel<RecursicaTreeNode>(itemId);

    return (
      <TreeItemProvider {...getContextProviderProps()}>
        <TreeItemRoot
          {...getRootProps({
            ...rest,
            className: `${styles.node} ${className ?? ""}`,
          })}
        >
          <TreeItemContent
            {...getContentProps({ className: styles.row })}
            status={status}
          >
            <TreeItemIconContainer
              {...getIconContainerProps({ className: styles.iconContainer })}
            >
              <TreeItemIcon status={status} />
            </TreeItemIconContainer>
            <TreeItemLabel {...getLabelProps({ className: styles.label })}>
              {item?.label ?? label}
            </TreeItemLabel>
          </TreeItemContent>
          {children && (
            <TreeItemGroupTransition
              {...getGroupTransitionProps({ className: styles.subtree })}
            />
          )}
        </TreeItemRoot>
      </TreeItemProvider>
    );
  },
);

/**
 * Recursively renders hierarchical `data` as an expandable/selectable tree.
 *
 * **Recursica Abstract:**
 * Wraps `@mui/x-tree-view`'s `RichTreeView` with a fully custom item renderer so every visual
 * aspect (row box model, selected/unselected colors and typography, indent, item spacing)
 * comes from Recursica's `tree` design tokens rather than MUI's defaults.
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

  const defaultExpandedItems =
    initialExpandedValues === "*"
      ? collectAllValues(data)
      : initialExpandedValues;

  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;
  const rootClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  return (
    <RichTreeView
      ref={ref}
      items={data}
      getItemId={(item: RecursicaTreeNode) => item.value}
      getItemLabel={(item: RecursicaTreeNode) =>
        typeof item.label === "string" ? item.label : item.value
      }
      defaultExpandedItems={defaultExpandedItems}
      defaultSelectedItems={
        multiple ? (initialSelectedValues ?? []) : initialSelectedValues?.[0]
      }
      multiSelect={multiple}
      // MUI has no separate expandOnClick/selectOnClick toggles; `expansionTrigger` controls
      // whether clicking the row content (vs only the icon container) also expands/collapses.
      // `selectOnClick={false}` has no exact MUI equivalent (selection always follows content
      // clicks unless disabled entirely) — see IMPLEMENTATION_NOTES.md.
      expansionTrigger={expandOnClick ? "content" : "iconContainer"}
      disableSelection={!selectOnClick}
      onItemExpansionToggle={(_event, itemId, isExpanded) => {
        if (isExpanded) onNodeExpand?.(itemId);
        else onNodeCollapse?.(itemId);
      }}
      onSelectedItemsChange={(_event, itemIds) => {
        onSelectedChange?.(
          Array.isArray(itemIds) ? itemIds : itemIds ? [itemIds] : [],
        );
      }}
      slots={{
        expandIcon: ExpandGlyph,
        collapseIcon: CollapseGlyph,
        endIcon: EndGlyph,
        item: CustomTreeItem,
      }}
      classes={{ root: rootClass }}
      {...(sanitizedProps as unknown as Record<string, unknown>)}
    />
  );
});

Tree.displayName = "Tree";
