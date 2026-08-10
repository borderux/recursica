import React, { forwardRef } from "react";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import {
  useTreeItem,
  type UseTreeItemParameters,
} from "@mui/x-tree-view/useTreeItem";
import { useTreeItemModel, useTreeItemUtils } from "@mui/x-tree-view/hooks";
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
import { Button } from "../Button/Button";
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

/** Chevron glyph; rendered inside a `Button` below. MUI renders a different component for
 * expanded vs collapsed rather than one rotating icon (unlike Mantine's `[data-expanded]`
 * approach), so `rotated` picks the CSS class that applies the rotation. Uses `currentColor` so
 * it matches Button's own tokened icon color for the "text" variant. */
function ChevronGlyph({ rotated }: { rotated?: boolean }) {
  return (
    <svg
      className={
        rotated ? `${styles.chevron} ${styles.chevronExpanded}` : styles.chevron
      }
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

/** Never independently focusable/tab-stoppable (tabIndex={-1}, aria-hidden) — expand/collapse is
 * driven by the surrounding `TreeItemIconContainer`'s own click handling (see `CustomTreeItem`),
 * not by this Button itself, so the row stays the only focusable element and the button never
 * shows its own focus state. Rendered for every row, including leaf items, so row alignment
 * stays consistent; `hidden` (visibility, not display) is used for leaf rows instead of omitting
 * the button, so the layout space is reserved without duplicating Button's own size tokens. */
function ExpandToggleButton({
  rotated,
  hidden,
}: {
  rotated?: boolean;
  hidden?: boolean;
}) {
  return (
    <Button
      overStyled
      variant="text"
      size="small"
      icon={<ChevronGlyph rotated={rotated} />}
      aria-label="Toggle subtree"
      aria-hidden="true"
      tabIndex={-1}
      className={
        hidden
          ? `${styles.expandButton} ${styles.expandButtonHidden}`
          : styles.expandButton
      }
    />
  );
}
function ExpandGlyph() {
  return <ExpandToggleButton />;
}
function CollapseGlyph() {
  return <ExpandToggleButton rotated />;
}
/** Rendered for leaf items so the icon-container box (and therefore row alignment) stays
 * consistent whether or not a row has an expand chevron. */
function EndGlyph() {
  return <ExpandToggleButton hidden />;
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

    // Exposes the same select/expand actions `useTreeItem`'s internal keyboard-navigation plugin
    // uses, so we can override just the `Enter` key below without reimplementing selection.
    const { interactions } = useTreeItemUtils({ itemId, children });

    const item = useTreeItemModel<RecursicaTreeNode>(itemId);

    const iconContainerProps = getIconContainerProps({
      className: styles.iconContainer,
    });

    // `Enter` selects the focused node, full stop — never expands it, unlike
    // `@mui/x-tree-view`'s own default (which expands an expandable node on `Enter` and only
    // falls back to selecting leaf nodes). Setting `defaultMuiPrevented` is the documented
    // extension point `createRootHandleKeyDown` checks before running its own handling, so this
    // fully replaces rather than races the built-in behavior. `Space` already selects-only by
    // default, so it needs no override.
    const handleRootKeyDown = (
      event: React.KeyboardEvent<HTMLLIElement> & {
        defaultMuiPrevented?: boolean;
      },
    ) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      event.defaultMuiPrevented = true;
      // `handleSelection` only reads modifier keys (shiftKey/ctrlKey/metaKey) off the event and
      // forwards it on for focus bookkeeping — its `React.MouseEvent` type is narrower than
      // necessary for what it actually uses, so a KeyboardEvent works fine at runtime here.
      interactions.handleSelection(event as unknown as React.MouseEvent);
    };

    return (
      <TreeItemProvider {...getContextProviderProps()}>
        <TreeItemRoot
          {...getRootProps({
            ...rest,
            className: `${styles.node} ${className ?? ""}`,
            onKeyDown: handleRootKeyDown,
          })}
        >
          <TreeItemContent
            {...getContentProps({ className: styles.row })}
            status={status}
          >
            <TreeItemIconContainer
              {...iconContainerProps}
              // Stops the click from also reaching `TreeItemContent`'s own click handler, which
              // otherwise selects on *any* click inside it (including the icon container) once
              // `expansionTrigger` is `"iconContainer"` — the button must expand/collapse
              // without ever selecting.
              onClick={(event) => {
                event.stopPropagation();
                iconContainerProps.onClick(event);
              }}
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
      // Whole-tree `disabled` reuses `@mui/x-tree-view`'s own per-item `isItemDisabled` — marking
      // every item disabled at once — rather than a bespoke mechanism, since MUI already handles
      // blocking click/keyboard select/expand and dimming (`.row[data-disabled]` in
      // Tree.module.css) for disabled items internally.
      isItemDisabled={disabled ? () => true : undefined}
      // Fixed, not prop-driven: only the icon container (the chevron button) expands/collapses
      // on click; clicking anywhere else on the row selects instead. `CustomTreeItem` additionally
      // stops the icon container's click from also bubbling into the content's own selection
      // handler — see IMPLEMENTATION_NOTES.md.
      expansionTrigger="iconContainer"
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
