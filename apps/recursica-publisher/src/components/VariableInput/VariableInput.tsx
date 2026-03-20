import { useState, useMemo, useCallback } from "react";
import { Select } from "@mantine/core";
import { isUiKitTypography } from "../../utils/typographyUtils";

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
    // 1. Filter out synthetic typography variables from UI Kit (e.g. components_button_text)
    const paths = variablePaths.filter((path) => !isUiKitTypography(path));

    // 2. Filter by variable type (e.g. COLOR, FLOAT) if provided
    if (!typeFilter || !typeMap) return paths;

    return paths.filter((path) => {
      const pathType = typeMap.get(path);
      // Only filter leaf paths that have a type entry;
      // intermediate paths (folders) are kept so drilling works
      return pathType === undefined || pathType === typeFilter;
    });
  }, [variablePaths, typeMap, typeFilter]);

  const options: DropdownOption[] = useMemo(() => {
    const segments = new Map<string, "leaf" | "folder" | "both">();

    for (const path of filteredPaths) {
      if (!path.startsWith(currentPrefix)) continue;

      const remainder = path.slice(currentPrefix.length);
      if (!remainder) continue;

      const slashIndex = remainder.indexOf("/");
      if (slashIndex === -1) {
        const current = segments.get(remainder);
        if (current === "folder") {
          segments.set(remainder, "both");
        } else if (!current) {
          segments.set(remainder, "leaf");
        }
      } else {
        const segment = remainder.slice(0, slashIndex);
        const current = segments.get(segment);
        if (current === "leaf") {
          segments.set(segment, "both");
        } else if (!current) {
          segments.set(segment, "folder");
        }
      }
    }

    const opts: DropdownOption[] = [];
    for (const [segment, type] of segments.entries()) {
      if (type === "leaf" || type === "both") {
        opts.push({
          value: currentPrefix + segment,
          label: segment,
        });
      }
      if (type === "folder" || type === "both") {
        opts.push({
          value: currentPrefix + segment + "/",
          label: segment + "/",
        });
      }
    }

    return opts.sort((a, b) => {
      const aIsLeaf = !a.label.endsWith("/");
      const bIsLeaf = !b.label.endsWith("/");
      if (aIsLeaf !== bIsLeaf) return aIsLeaf ? 1 : -1;
      return a.label.localeCompare(b.label);
    });
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
        maxDropdownHeight={115}
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
