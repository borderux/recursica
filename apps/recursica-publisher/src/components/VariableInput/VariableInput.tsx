import { useState, useMemo, useCallback } from "react";
import { Select } from "@mantine/core";

export interface VariableInputProps {
  /** Flat list of all variable paths, e.g. ["Tokens/palettes/core-colors/black/color/tone", ...] */
  variablePaths: string[];
  /** Map from full variable path to its type (e.g. "COLOR", "FLOAT", "STRING") */
  typeMap?: Map<string, string>;
  /** If set, only show variables of this type */
  typeFilter?: string;
  /** Controlled value — the fully-selected variable path */
  value?: string;
  /** Called when a leaf variable is selected (or cleared) */
  onChange?: (value: string | null) => void;
  /** Input placeholder */
  placeholder?: string;
}

interface DropdownOption {
  value: string;
  label: string;
}

/**
 * VariableInput — path-segment autocomplete for selecting Figma variables.
 *
 * Shows the current path progress below the input as the user drills down.
 * When a leaf variable is selected, the input becomes disabled.
 * An X button allows the user to clear and reset at any time.
 */
export function VariableInput({
  variablePaths,
  typeMap,
  typeFilter,
  value,
  onChange,
  placeholder = "Search variables…",
}: VariableInputProps) {
  const [currentPrefix, setCurrentPrefix] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const isComplete = !!value;

  // The display path: either the committed value or the current drilling prefix
  const displayPath = value || currentPrefix;

  // Filter paths by type if typeFilter is set
  const filteredPaths = useMemo(() => {
    if (!typeFilter || !typeMap) return variablePaths;
    return variablePaths.filter((path) => {
      const pathType = typeMap.get(path);
      // Only filter leaf paths that have a type entry;
      // intermediate paths (folders) are kept so drilling works
      return pathType === undefined || pathType === typeFilter;
    });
  }, [variablePaths, typeMap, typeFilter]);

  const options: DropdownOption[] = useMemo(() => {
    const segments = new Map<string, boolean>();

    for (const path of filteredPaths) {
      if (!path.startsWith(currentPrefix)) continue;

      const remainder = path.slice(currentPrefix.length);
      if (!remainder) continue;

      const slashIndex = remainder.indexOf("/");
      if (slashIndex === -1) {
        segments.set(remainder, true);
      } else {
        const segment = remainder.slice(0, slashIndex);
        if (!segments.has(segment)) {
          segments.set(segment, false);
        }
      }
    }

    return Array.from(segments.entries())
      .sort(([a, aIsLeaf], [b, bIsLeaf]) => {
        if (aIsLeaf !== bIsLeaf) return aIsLeaf ? 1 : -1;
        return a.localeCompare(b);
      })
      .map(([segment, isLeaf]) => ({
        value: isLeaf ? currentPrefix + segment : currentPrefix + segment + "/",
        label: isLeaf ? segment : segment + "/",
      }));
  }, [filteredPaths, currentPrefix]);

  const handleChange = useCallback(
    (selectedValue: string | null) => {
      if (!selectedValue) {
        setCurrentPrefix("");
        setSearchValue("");
        onChange?.(null);
        return;
      }

      if (selectedValue.endsWith("/")) {
        setCurrentPrefix(selectedValue);
        setSearchValue("");
      } else {
        onChange?.(selectedValue);
        setSearchValue("");
      }
    },
    [onChange],
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchValue(query);
  }, []);

  const handleReset = useCallback(() => {
    setCurrentPrefix("");
    setSearchValue("");
    onChange?.(null);
  }, [onChange]);

  return (
    <div>
      <Select
        placeholder={
          currentPrefix ? `Filter in ${currentPrefix}…` : placeholder
        }
        data={options}
        value={null}
        onChange={handleChange}
        searchable
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        clearable
        onClear={() => {
          if (currentPrefix) {
            const parts = currentPrefix.slice(0, -1).split("/");
            parts.pop();
            const newPrefix = parts.length > 0 ? parts.join("/") + "/" : "";
            setCurrentPrefix(newPrefix);
            setSearchValue("");
          }
        }}
        nothingFoundMessage="No matching variables"
        disabled={isComplete}
        maxDropdownHeight={250}
      />

      {displayPath && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 6,
            padding: "4px 8px",
            backgroundColor: isComplete ? "#e8f5e9" : "#f5f5f5",
            borderRadius: 4,
            fontSize: 12,
          }}
        >
          <code
            style={{
              flex: 1,
              color: isComplete ? "#1b5e20" : "#333",
              wordBreak: "break-all",
            }}
          >
            {displayPath}
          </code>
          <button
            type="button"
            onClick={handleReset}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 4px",
              fontSize: 14,
              color: "#666",
              lineHeight: 1,
              borderRadius: 3,
              flexShrink: 0,
            }}
            title="Clear selection"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

VariableInput.displayName = "VariableInput";
