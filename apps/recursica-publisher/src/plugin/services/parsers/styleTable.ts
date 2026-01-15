/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Style table for storing unique styles and referencing them by index
 * Reduces JSON size by storing each style once instead of repeating it
 */

export interface StyleTableEntry {
  type: "TEXT" | "PAINT" | "EFFECT" | "GRID";
  name: string;
  textStyle?: any; // SerializedTextStyle
  paintStyle?: any; // SerializedPaintStyle
  effectStyle?: any; // SerializedEffectStyle
  gridStyle?: any; // SerializedGridStyle
  boundVariables?: Record<string, any>; // Bound variables for style properties
  styleKey?: string; // Internal-only: used for deduplication during export
}

/**
 * StyleTable manages unique styles and provides index-based access
 * Similar to VariableTable and InstanceTable, stores styles once and references them by index
 */
export class StyleTable {
  private styles: Map<number, StyleTableEntry> = new Map();
  private styleKeyToIndex: Map<string, number> = new Map();
  private nextIndex = 0;

  /**
   * Add a style to the table and return its index
   * If the style already exists (by styleKey), returns the existing index
   */
  addStyle(style: StyleTableEntry): number {
    // Generate a styleKey if not provided (for deduplication)
    const styleKey =
      style.styleKey ||
      `${style.type}:${style.name}:${JSON.stringify(style.textStyle || style.paintStyle || style.effectStyle || style.gridStyle)}`;

    // Check if style already exists
    const existingIndex = this.styleKeyToIndex.get(styleKey);
    if (existingIndex !== undefined) {
      return existingIndex;
    }

    // Add new style
    const index = this.nextIndex++;
    this.styles.set(index, { ...style, styleKey });
    this.styleKeyToIndex.set(styleKey, index);
    return index;
  }

  /**
   * Get the index of a style by its styleKey (used during export)
   */
  getStyleIndex(styleKey: string): number {
    return this.styleKeyToIndex.get(styleKey) ?? -1;
  }

  /**
   * Get a style by index
   */
  getStyleByIndex(index: number): StyleTableEntry | undefined {
    return this.styles.get(index);
  }

  /**
   * Get the number of styles in the table
   */
  getSize(): number {
    return this.styles.size;
  }

  /**
   * Get the full table (for serialization)
   * Excludes internal styleKey field
   */
  getSerializedTable(): Record<string, Omit<StyleTableEntry, "styleKey">> {
    const result: Record<string, Omit<StyleTableEntry, "styleKey">> = {};
    for (const [index, entry] of this.styles.entries()) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { styleKey, ...serializedEntry } = entry;
      result[String(index)] = serializedEntry;
    }
    return result;
  }

  /**
   * Get the full table with styleKey (for internal use)
   */
  getTable(): Record<string, StyleTableEntry> {
    const result: Record<string, StyleTableEntry> = {};
    for (const [index, entry] of this.styles.entries()) {
      result[String(index)] = entry;
    }
    return result;
  }

  /**
   * Reconstruct StyleTable from serialized data
   */
  static fromTable(
    table: Record<string, Partial<StyleTableEntry>>,
  ): StyleTable {
    const styleTable = new StyleTable();
    for (const [indexStr, entry] of Object.entries(table)) {
      const index = parseInt(indexStr, 10);
      // Generate temporary styleKey if not present (for compatibility)
      const styleKey =
        entry.styleKey ||
        `${entry.type}:${entry.name}:${JSON.stringify(entry.textStyle || entry.paintStyle || entry.effectStyle || entry.gridStyle)}`;
      styleTable.styles.set(index, { ...entry, styleKey } as StyleTableEntry);
      styleTable.styleKeyToIndex.set(styleKey, index);
      if (index >= styleTable.nextIndex) {
        styleTable.nextIndex = index + 1;
      }
    }
    return styleTable;
  }
}
