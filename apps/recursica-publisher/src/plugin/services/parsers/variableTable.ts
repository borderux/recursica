/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Variable table for storing unique variables and referencing them by index
 * Reduces JSON size by storing each variable once instead of repeating it
 */

/**
 * Collection table entry stores collection metadata including modes
 * Modes are stored as an array of mode names
 */
export interface CollectionTableEntry {
  collectionName: string;
  collectionId: string; // Original collection ID
  isLocal: boolean;
  modes: string[]; // Array of mode names
  collectionGuid?: string; // Globally unique identifier for cross-file matching (v2.5.0+)
}

/**
 * CollectionTable manages unique collections and provides index-based access
 * Similar to VariableTable, stores collections once and references them by index
 */
export class CollectionTable {
  private collectionMap: Map<string, number>; // collectionId -> index
  private collections: CollectionTableEntry[]; // index -> collection data
  private nextIndex: number;

  constructor() {
    this.collectionMap = new Map();
    this.collections = [];
    this.nextIndex = 0;
  }

  /**
   * Adds a collection to the table if it doesn't already exist
   * Returns the index of the collection (existing or newly added)
   */
  addCollection(collectionInfo: CollectionTableEntry): number {
    const key = collectionInfo.collectionId;

    // Check if collection already exists
    if (this.collectionMap.has(key)) {
      return this.collectionMap.get(key)!;
    }

    // Add new collection
    const index = this.nextIndex++;
    this.collectionMap.set(key, index);
    this.collections[index] = collectionInfo;
    return index;
  }

  /**
   * Gets the index of a collection by its collectionId
   * Returns -1 if not found
   */
  getCollectionIndex(collectionId: string): number {
    return this.collectionMap.get(collectionId) ?? -1;
  }

  /**
   * Gets a collection entry by index
   */
  getCollectionByIndex(index: number): CollectionTableEntry | undefined {
    return this.collections[index];
  }

  /**
   * Gets the complete table as an object with string keys
   * Used for internal operations (includes all fields)
   */
  getTable(): Record<string, CollectionTableEntry> {
    const table: Record<string, CollectionTableEntry> = {};
    for (let i = 0; i < this.collections.length; i++) {
      table[String(i)] = this.collections[i];
    }
    return table;
  }

  /**
   * Gets the table with only serialized fields (excludes internal-only fields)
   * Used for JSON serialization to reduce size
   * Filters out: collectionId, isLocal (internal-only fields)
   * Keeps: collectionName, collectionGuid, modes
   */
  getSerializedTable(): Record<
    string,
    Omit<CollectionTableEntry, "collectionId" | "isLocal">
  > {
    const table: Record<
      string,
      Omit<CollectionTableEntry, "collectionId" | "isLocal">
    > = {};
    for (let i = 0; i < this.collections.length; i++) {
      const entry = this.collections[i];
      // Create a new object without internal-only fields
      const serialized: Omit<CollectionTableEntry, "collectionId" | "isLocal"> =
        {
          collectionName: entry.collectionName,
          modes: entry.modes,
          ...(entry.collectionGuid && { collectionGuid: entry.collectionGuid }),
        };
      table[String(i)] = serialized;
    }
    return table;
  }

  /**
   * Reconstructs a CollectionTable from a serialized table object
   * Handles both new format (without collectionId/isLocal) and legacy format (with collectionId/isLocal)
   */
  static fromTable(
    table: Record<string, Partial<CollectionTableEntry>>,
  ): CollectionTable {
    const collectionTable = new CollectionTable();
    const entries = Object.entries(table).sort(
      (a, b) => parseInt(a[0], 10) - parseInt(b[0], 10),
    );

    for (const [indexStr, collection] of entries) {
      const index = parseInt(indexStr, 10);

      // Infer isLocal from collection name if not present (new format)
      // Default to true (local), and let the import logic determine if it's actually non-local
      // based on whether it can be found in the team library
      const isLocal = collection.isLocal ?? true;

      // Generate a temporary collectionId if not present (for internal map)
      // Use GUID if available, otherwise generate a temporary ID
      const collectionId =
        collection.collectionId ||
        collection.collectionGuid ||
        `temp:${index}:${collection.collectionName || "unknown"}`;

      const fullEntry: CollectionTableEntry = {
        collectionName: collection.collectionName || "",
        collectionId,
        isLocal,
        modes: collection.modes || [],
        ...(collection.collectionGuid && {
          collectionGuid: collection.collectionGuid,
        }),
      };

      collectionTable.collectionMap.set(collectionId, index);
      collectionTable.collections[index] = fullEntry;
      collectionTable.nextIndex = Math.max(
        collectionTable.nextIndex,
        index + 1,
      );
    }

    return collectionTable;
  }

  /**
   * Gets the total number of collections in the table
   */
  getSize(): number {
    return this.collections.length;
  }
}

/**
 * Serialized format for VARIABLE_ALIAS values in valuesByMode
 * Stores both the original variable ID and a reference to the variable table entry
 */
export interface VariableAliasSerialized {
  type: "VARIABLE_ALIAS";
  id: string; // Original variable ID
  _varRef?: number; // Reference to variable table entry (if resolved)
}

export interface VariableTableEntry {
  variableName: string;
  variableType: string;
  _colRef?: number; // Reference to collection table index (v2.4.0+)
  valuesByMode?: Record<
    string,
    string | number | boolean | VariableAliasSerialized
  >;
  // Internal-only fields (not serialized to JSON):
  // Used during export for deduplication and import for legacy compatibility
  variableKey?: string; // Only used during export for deduplication
  id?: string; // Only used for fallback in legacy scenarios
  // Legacy fields (kept for backward compatibility only):
  collectionName?: string;
  collectionId?: string;
  isLocal?: boolean;
  collectionRef?: number; // Legacy alias for _colRef (v2.3.0)
}

/**
 * Determines if a variable is local or team-based from its collectionId format
 * - Team collections: VariableCollectionId:{longHash}/{localId} (e.g., VariableCollectionId:eac91903ad8b04eed20f4bf2f0444ac6069c6da3/2151:0)
 * - Local collections: VariableCollectionId:{shortId}:{localId} or just {shortId}:{localId} (e.g., VariableCollectionId:4:163 or 4:163)
 */
export function isLocalVariable(collectionId: string): boolean {
  if (!collectionId) return false;

  // Team collections have a long hash (40+ hex characters) before the slash
  // Local collections have shorter numeric IDs
  const teamCollectionPattern = /^VariableCollectionId:[a-f0-9]{40,}\//;
  return !teamCollectionPattern.test(collectionId);
}

/**
 * Variable type mapping: maps Figma variable types to numbers for compression
 * COLOR=1, FLOAT=2, STRING=3, BOOLEAN=4
 * Unknown types are stored as strings
 */
const VARIABLE_TYPE_MAP: Record<string, number> = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4,
};

const VARIABLE_TYPE_REVERSE_MAP: Record<number, string> = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN",
};

/**
 * Compresses a variable type to a number if it's a known type, otherwise returns the string
 */
function compressVariableType(type: string): number | string {
  const upperType = type.toUpperCase();
  return VARIABLE_TYPE_MAP[upperType] ?? type;
}

/**
 * Expands a variable type from a number or string back to the full type name
 */
function expandVariableType(type: number | string): string {
  if (typeof type === "number") {
    return VARIABLE_TYPE_REVERSE_MAP[type] ?? type.toString();
  }
  return type;
}

/**
 * VariableTable manages a collection of unique variables and provides index-based access
 */
export class VariableTable {
  private variableMap: Map<string, number>; // variableKey -> index
  private variables: VariableTableEntry[]; // index -> variable data
  private nextIndex: number;

  constructor() {
    this.variableMap = new Map();
    this.variables = [];
    this.nextIndex = 0;
  }

  /**
   * Adds a variable to the table if it doesn't already exist
   * Returns the index of the variable (existing or newly added)
   */
  addVariable(variableInfo: VariableTableEntry): number {
    const key = variableInfo.variableKey;
    if (!key) {
      return -1;
    }

    // Check if variable already exists
    if (this.variableMap.has(key)) {
      return this.variableMap.get(key)!;
    }

    // Add new variable
    const index = this.nextIndex++;
    this.variableMap.set(key, index);
    this.variables[index] = variableInfo;
    return index;
  }

  /**
   * Gets the index of a variable by its variableKey
   * Returns -1 if not found
   */
  getVariableIndex(variableKey: string): number {
    return this.variableMap.get(variableKey) ?? -1;
  }

  /**
   * Gets a variable entry by index
   */
  getVariableByIndex(index: number): VariableTableEntry | undefined {
    return this.variables[index];
  }

  /**
   * Gets the complete table as an object with string keys
   * Used for JSON serialization
   * Includes all fields (for backward compatibility)
   */
  getTable(): Record<string, VariableTableEntry> {
    const table: Record<string, VariableTableEntry> = {};
    for (let i = 0; i < this.variables.length; i++) {
      table[String(i)] = this.variables[i];
    }
    return table;
  }

  /**
   * Serializes valuesByMode, removing type and id from VariableAliasSerialized objects
   * Only keeps _varRef since that's sufficient to identify a variable reference
   */
  private serializeValuesByMode(
    valuesByMode?: Record<
      string,
      string | number | boolean | VariableAliasSerialized
    >,
  ):
    | Record<string, string | number | boolean | { _varRef: number }>
    | undefined {
    if (!valuesByMode) {
      return undefined;
    }

    const serialized: Record<
      string,
      string | number | boolean | { _varRef: number }
    > = {};

    for (const [modeName, value] of Object.entries(valuesByMode)) {
      // Check if it's a VariableAliasSerialized (has _varRef)
      if (
        typeof value === "object" &&
        value !== null &&
        "_varRef" in value &&
        typeof (value as any)._varRef === "number"
      ) {
        // Only include _varRef, exclude type and id
        serialized[modeName] = {
          _varRef: (value as VariableAliasSerialized)._varRef!,
        };
      } else {
        // Primitive value, keep as-is
        serialized[modeName] = value as string | number | boolean;
      }
    }

    return serialized;
  }

  /**
   * Gets the table with only serialized fields (excludes internal-only fields)
   * Used for JSON serialization to reduce size
   * Filters out: variableKey, id, collectionName, collectionId, isLocal
   * Also removes type and id from VariableAliasSerialized in valuesByMode (only keeps _varRef)
   * Compresses variableType: known types (COLOR, FLOAT, STRING, BOOLEAN) become numbers (1-4), unknown types stay as strings
   * Keeps: variableName, variableType (compressed), _colRef, valuesByMode
   */
  getSerializedTable(): Record<
    string,
    Omit<
      VariableTableEntry,
      "variableKey" | "id" | "valuesByMode" | "variableType"
    > & {
      variableType: number | string; // Compressed: number for known types, string for unknown
      valuesByMode?: Record<
        string,
        string | number | boolean | { _varRef: number }
      >;
    }
  > {
    const table: Record<
      string,
      Omit<
        VariableTableEntry,
        "variableKey" | "id" | "valuesByMode" | "variableType"
      > & {
        variableType: number | string; // Compressed: number for known types, string for unknown
        valuesByMode?: Record<
          string,
          string | number | boolean | { _varRef: number }
        >;
      }
    > = {};
    for (let i = 0; i < this.variables.length; i++) {
      const entry = this.variables[i];
      // Create a new object without internal-only fields
      const serializedValuesByMode = this.serializeValuesByMode(
        entry.valuesByMode,
      );

      // Build serialized entry with correct types
      // Compress variableType to number if it's a known type
      const serialized: Omit<
        VariableTableEntry,
        "variableKey" | "id" | "valuesByMode" | "variableType"
      > & {
        variableType: number | string; // Compressed: number for known types, string for unknown
        valuesByMode?: Record<
          string,
          string | number | boolean | { _varRef: number }
        >;
      } = {
        variableName: entry.variableName,
        variableType: compressVariableType(entry.variableType),
        ...(entry._colRef !== undefined && { _colRef: entry._colRef }),
        ...(serializedValuesByMode && { valuesByMode: serializedValuesByMode }),
      };
      table[String(i)] = serialized;
    }
    return table;
  }

  /**
   * Reconstructs a VariableTable from a serialized table object
   * Handles both new format (without variableKey) and legacy format (with variableKey)
   * Expands compressed variable types (numbers) back to strings
   */
  static fromTable(
    table: Record<
      string,
      Omit<VariableTableEntry, "variableKey" | "id" | "variableType"> & {
        variableType: number | string; // Can be compressed (number) or string
      }
    >,
  ): VariableTable {
    const variableTable = new VariableTable();
    const entries = Object.entries(table).sort(
      (a, b) => parseInt(a[0], 10) - parseInt(b[0], 10),
    );

    for (const [indexStr, variable] of entries) {
      const index = parseInt(indexStr, 10);
      // Expand variableType from number to string if compressed
      const expandedType = expandVariableType(variable.variableType);
      const entry: VariableTableEntry = {
        ...variable,
        variableType: expandedType, // Always a string after expansion
      };
      variableTable.variables[index] = entry;
      variableTable.nextIndex = Math.max(variableTable.nextIndex, index + 1);
    }

    return variableTable;
  }

  /**
   * Gets the total number of variables in the table
   */
  getSize(): number {
    return this.variables.length;
  }
}

/**
 * Variable reference format used in serialized JSON
 * The presence of _varRef indicates this is a variable reference
 */
export interface VariableReference {
  _varRef: number;
}

/**
 * Creates a variable reference object for serialization
 */
export function createVariableReference(index: number): VariableReference {
  return {
    _varRef: index,
  };
}

/**
 * Checks if an object is a variable reference
 */
export function isVariableReference(obj: any): boolean {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj._varRef === "number" &&
    !("type" in obj) // Legacy format has type, new format doesn't
  );
}
