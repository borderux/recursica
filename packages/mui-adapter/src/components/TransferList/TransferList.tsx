import { forwardRef, useCallback, useId, useMemo, useState } from "react";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { type FormControlWrapperProps } from "../FormControlWrapper/FormControlWrapper";
import { WithReadOnlyWrapper } from "../ReadOnlyField/WithReadOnlyWrapper";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { TextField } from "../TextField/TextField";
import { Checkbox } from "../Checkbox/Checkbox";
import { CheckboxGroup } from "../Checkbox/CheckboxGroup";
import styles from "./TransferList.module.css";

import {
  type ReadOnlyControlProps,
  type RecursicaTransferListProps as BaseRecursicaTransferListProps,
  type RecursicaTransferListItem,
  type RecursicaTransferListData,
} from "@recursica/adapter-common";

export type { RecursicaTransferListItem, RecursicaTransferListData };

export interface RecursicaTransferListProps
  extends Omit<
      FormControlWrapperProps,
      | "children"
      | "overStyled"
      | "controlMaxWidth"
      | "controlMinWidth"
      | "onChange"
    >,
    ReadOnlyControlProps,
    BaseRecursicaTransferListProps {
  /** Disables the whole control */
  disabled?: boolean;
}

export type TransferListProps = RecursicaOverStyled<RecursicaTransferListProps>;

/** Single/double chevron glyphs for the transfer buttons; flipped via CSS for the "left" direction
 * so only one path needs to be maintained, same approach as Tree's `ExpandGlyph`. */
function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      className={styles.chevron}
      data-direction={direction}
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
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}

function ChevronsIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      className={styles.chevron}
      data-direction={direction}
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
      <path d="M3 3l5 5-5 5M9 3l5 5-5 5" />
    </svg>
  );
}

/** Splits items into grouped/ungrouped buckets, same shape Forge's reference groups by `group`. */
function groupItems(items: RecursicaTransferListItem[]) {
  const groups: Record<string, RecursicaTransferListItem[]> = {};
  const ungrouped: RecursicaTransferListItem[] = [];
  items.forEach((item) => {
    if (item.group) {
      (groups[item.group] ??= []).push(item);
    } else {
      ungrouped.push(item);
    }
  });
  return { groups, ungrouped };
}

export const TransferList = forwardRef<HTMLDivElement, TransferListProps>(
  function TransferList(props, ref) {
    const {
      overStyled = false,
      formLayout = "stacked",

      // Label & Wrapper Maps
      labelSize,
      labelAlignment,
      labelOptionalText,
      labelWithEditIcon,
      labelActionArea,
      onLabelEditClick,

      label,
      assistiveText,
      description,
      helperText,
      assistiveWithIcon,
      error,
      required,
      id: userProvidedId,
      readOnly,
      readOnlyComponent,
      emptyValueComponent,

      data: controlledData,
      defaultData,
      onChange,
      sourceLabel = "Available",
      targetLabel = "Selected",
      searchable = true,
      searchPlaceholder = "Filter items...",
      disabled = false,

      className,
      style,
      ...rest
    } = props;
    const sanitizedProps = filterStylingProps(rest, overStyled);

    const generatedId = useId();
    const id = userProvidedId || `recursica-transfer-list-${generatedId}`;

    // Manage internal state for uncontrolled mode
    const [internalData, setInternalData] = useState<RecursicaTransferListData>(
      () => defaultData ?? controlledData ?? [[], []],
    );
    const effectiveData =
      controlledData !== undefined ? controlledData : internalData;

    const handleChange = useCallback(
      (newData: RecursicaTransferListData) => {
        if (controlledData === undefined) {
          setInternalData(newData);
        }
        onChange?.(newData);
      },
      [controlledData, onChange],
    );

    const [sourceSearch, setSourceSearch] = useState("");
    const [targetSearch, setTargetSearch] = useState("");
    const [sourceSelected, setSourceSelected] = useState<Set<string>>(
      () => new Set(),
    );
    const [targetSelected, setTargetSelected] = useState<Set<string>>(
      () => new Set(),
    );

    const filteredSource = useMemo(() => {
      if (!sourceSearch) return effectiveData[0];
      const query = sourceSearch.toLowerCase();
      return effectiveData[0].filter((item) =>
        item.label.toLowerCase().includes(query),
      );
    }, [effectiveData, sourceSearch]);

    const filteredTarget = useMemo(() => {
      if (!targetSearch) return effectiveData[1];
      const query = targetSearch.toLowerCase();
      return effectiveData[1].filter((item) =>
        item.label.toLowerCase().includes(query),
      );
    }, [effectiveData, targetSearch]);

    const transferToTarget = useCallback(() => {
      if (sourceSelected.size === 0) return;
      const newSource = effectiveData[0].filter(
        (item) => !sourceSelected.has(item.value),
      );
      const moved = effectiveData[0].filter((item) =>
        sourceSelected.has(item.value),
      );
      setSourceSelected(new Set());
      handleChange([newSource, [...effectiveData[1], ...moved]]);
    }, [effectiveData, sourceSelected, handleChange]);

    const transferToSource = useCallback(() => {
      if (targetSelected.size === 0) return;
      const newTarget = effectiveData[1].filter(
        (item) => !targetSelected.has(item.value),
      );
      const moved = effectiveData[1].filter((item) =>
        targetSelected.has(item.value),
      );
      setTargetSelected(new Set());
      handleChange([[...effectiveData[0], ...moved], newTarget]);
    }, [effectiveData, targetSelected, handleChange]);

    const transferAllToTarget = useCallback(() => {
      if (effectiveData[0].length === 0) return;
      setSourceSelected(new Set());
      handleChange([[], [...effectiveData[1], ...effectiveData[0]]]);
    }, [effectiveData, handleChange]);

    const transferAllToSource = useCallback(() => {
      if (effectiveData[1].length === 0) return;
      setTargetSelected(new Set());
      handleChange([[...effectiveData[0], ...effectiveData[1]], []]);
    }, [effectiveData, handleChange]);

    const toggleSourceItem = useCallback((value: string) => {
      setSourceSelected((prev) => {
        const next = new Set(prev);
        if (next.has(value)) next.delete(value);
        else next.add(value);
        return next;
      });
    }, []);

    const toggleTargetItem = useCallback((value: string) => {
      setTargetSelected((prev) => {
        const next = new Set(prev);
        if (next.has(value)) next.delete(value);
        else next.add(value);
        return next;
      });
    }, []);

    const renderPane = (
      paneId: string,
      paneLabel: string,
      items: RecursicaTransferListItem[],
      allItems: RecursicaTransferListItem[],
      selected: Set<string>,
      onToggle: (value: string) => void,
      search: string,
      onSearchChange: (value: string) => void,
    ) => {
      const { groups, ungrouped } = groupItems(items);
      const groupNames = Object.keys(groups).sort();
      const countText =
        selected.size > 0
          ? `${selected.size} / ${allItems.length}`
          : `${allItems.length}`;

      return (
        <div className={styles.pane} data-pane={paneId}>
          <div className={styles.paneHeader}>
            <span>{paneLabel}</span>
            <Badge>{countText}</Badge>
          </div>

          {searchable && (
            <div className={styles.paneSearch}>
              <TextField
                value={search}
                onChange={(e) => onSearchChange(e.currentTarget.value)}
                placeholder={searchPlaceholder}
                disabled={disabled}
                aria-label={`Filter ${paneLabel.toLowerCase()}`}
              />
            </div>
          )}

          <div className={styles.paneList}>
            {items.length === 0 && (
              <div className={styles.emptyState}>No items</div>
            )}

            {ungrouped.length > 0 && (
              <CheckboxGroup>
                {ungrouped.map((item) => (
                  <Checkbox
                    key={item.value}
                    id={`${id}-${paneId}-${item.value}`}
                    label={item.label}
                    checked={selected.has(item.value)}
                    onChange={() => onToggle(item.value)}
                    disabled={disabled}
                  />
                ))}
              </CheckboxGroup>
            )}

            {groupNames.map((groupName) => (
              <CheckboxGroup
                key={groupName}
                label={groupName}
                labelSize="small"
              >
                {groups[groupName].map((item) => (
                  <Checkbox
                    key={item.value}
                    id={`${id}-${paneId}-${item.value}`}
                    label={item.label}
                    checked={selected.has(item.value)}
                    onChange={() => onToggle(item.value)}
                    disabled={disabled}
                  />
                ))}
              </CheckboxGroup>
            ))}
          </div>
        </div>
      );
    };

    const wrapperClass = className
      ? `${styles.layoutOverride} ${className}`
      : styles.layoutOverride;

    return (
      <WithReadOnlyWrapper
        ref={ref}
        formLayout={formLayout}
        labelSize={labelSize}
        labelAlignment={labelAlignment}
        labelOptionalText={labelOptionalText}
        labelWithEditIcon={labelWithEditIcon}
        labelActionArea={labelActionArea}
        onLabelEditClick={onLabelEditClick}
        label={label}
        assistiveText={assistiveText}
        description={description}
        helperText={helperText}
        assistiveWithIcon={assistiveWithIcon}
        error={error}
        required={required}
        disabled={disabled}
        id={id}
        className={wrapperClass}
        style={style}
        readOnly={readOnly}
        readOnlyComponent={readOnlyComponent}
        emptyValueComponent={emptyValueComponent}
        readOnlyType="text"
        readOnlyValue={effectiveData[1].map((item) => item.label)}
        readOnlyNativeProps={props}
        activeComponent={
          <div
            className={styles.root}
            data-disabled={disabled ? "true" : undefined}
            data-error={error ? "true" : undefined}
            {...(sanitizedProps as Record<string, unknown>)}
          >
            <div className={styles.panes}>
              {renderPane(
                "source",
                sourceLabel,
                filteredSource,
                effectiveData[0],
                sourceSelected,
                toggleSourceItem,
                sourceSearch,
                setSourceSearch,
              )}

              <div className={styles.transferColumn}>
                <Button
                  variant="outline"
                  size="small"
                  icon={<ChevronsIcon direction="right" />}
                  aria-label={`Move all to ${targetLabel}`}
                  disabled={disabled || effectiveData[0].length === 0}
                  onClick={transferAllToTarget}
                />
                <Button
                  variant="outline"
                  size="small"
                  icon={<ChevronIcon direction="right" />}
                  aria-label={`Move selected to ${targetLabel}`}
                  disabled={disabled || sourceSelected.size === 0}
                  onClick={transferToTarget}
                />
                <Button
                  variant="outline"
                  size="small"
                  icon={<ChevronIcon direction="left" />}
                  aria-label={`Move selected to ${sourceLabel}`}
                  disabled={disabled || targetSelected.size === 0}
                  onClick={transferToSource}
                />
                <Button
                  variant="outline"
                  size="small"
                  icon={<ChevronsIcon direction="left" />}
                  aria-label={`Move all to ${sourceLabel}`}
                  disabled={disabled || effectiveData[1].length === 0}
                  onClick={transferAllToSource}
                />
              </div>

              {renderPane(
                "target",
                targetLabel,
                filteredTarget,
                effectiveData[1],
                targetSelected,
                toggleTargetItem,
                targetSearch,
                setTargetSearch,
              )}
            </div>
          </div>
        }
      />
    );
  },
);

TransferList.displayName = "TransferList";
