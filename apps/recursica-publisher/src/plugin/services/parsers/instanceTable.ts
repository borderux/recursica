/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Instance table for storing unique component instances and referencing them by index
 * Reduces JSON size by storing each component reference once instead of repeating it
 */

/**
 * Instance table entry stores component metadata needed to recreate instances
 * Based on instance type (internal, normal, remote), different fields are used
 */
export interface InstanceTableEntry {
  // Instance type classification
  instanceType: "internal" | "normal" | "remote";

  // For internal instances (same page)
  componentNodeId?: string; // Node ID of the component on the same page (used during import with ID mapping)

  // For normal instances (different page, same file)
  componentGuid?: string; // GUID from component metadata (RecursicaPublishedMetadata.id)
  componentVersion?: number; // Version number from component metadata (RecursicaPublishedMetadata.version)
  componentPageName?: string; // Name of the page that contains the component

  // For remote instances (different file)
  structure?: any; // Full visual structure (recursively exported using extractNodeData())
  remoteLibraryName?: string; // Library name if available
  remoteLibraryKey?: string; // Library key if available

  // Common fields (used for all types)
  componentName: string; // Component name (may be variant property string)
  componentSetName?: string; // Actual component set name (if variant)
  // Note: componentType is not stored - instances always reference COMPONENT nodes (never COMPONENT_SET directly)
  path?: string[]; // Path within library/file - REQUIRED for normal instances to locate the specific component on the referenced page. Array of node names from page root to component. Empty array means component is at page root. Empty names are represented as empty strings in the array. Duplicate names are allowed but may require validation during import to resolve ambiguity. For internal instances, componentNodeId is used instead (simpler since everything is on the same page).
  variantProperties?: Record<string, string>; // Variant property values
  componentProperties?: Record<string, any>; // Component property values
}

/**
 * InstanceTable manages unique component instances and provides index-based access
 * Similar to VariableTable and CollectionTable, stores instances once and references them by index
 */
export class InstanceTable {
  private instanceMap: Map<string, number>; // unique key -> index
  private instances: InstanceTableEntry[]; // index -> instance data
  private nextIndex: number;

  constructor() {
    this.instanceMap = new Map();
    this.instances = [];
    this.nextIndex = 0;
  }

  /**
   * Generates a unique key for an instance based on its type
   */
  private generateKey(entry: InstanceTableEntry): string {
    if (entry.instanceType === "internal" && entry.componentNodeId) {
      // For internal instances, use node ID (simpler since everything is on the same page)
      // During import, we maintain a mapping of old ID -> new node
      return `internal:${entry.componentNodeId}`;
    } else if (
      entry.instanceType === "normal" &&
      entry.componentGuid &&
      entry.componentVersion !== undefined
    ) {
      return `normal:${entry.componentGuid}:${entry.componentVersion}`;
    } else if (entry.instanceType === "remote" && entry.remoteLibraryKey) {
      return `remote:${entry.remoteLibraryKey}:${entry.componentName}`;
    }
    // Fallback: use component name (componentType is always COMPONENT for instances)
    return `${entry.instanceType}:${entry.componentName}:COMPONENT`;
  }

  /**
   * Adds an instance to the table if it doesn't already exist
   * Returns the index of the instance (existing or newly added)
   */
  addInstance(instanceInfo: InstanceTableEntry): number {
    const key = this.generateKey(instanceInfo);

    // Check if instance already exists
    if (this.instanceMap.has(key)) {
      return this.instanceMap.get(key)!;
    }

    // Add new instance
    const index = this.nextIndex++;
    this.instanceMap.set(key, index);
    this.instances[index] = instanceInfo;
    return index;
  }

  /**
   * Gets the index of an instance by its unique key
   * Returns -1 if not found
   */
  getInstanceIndex(entry: InstanceTableEntry): number {
    const key = this.generateKey(entry);
    return this.instanceMap.get(key) ?? -1;
  }

  /**
   * Gets an instance entry by index
   */
  getInstanceByIndex(index: number): InstanceTableEntry | undefined {
    return this.instances[index];
  }

  /**
   * Gets the complete table as an object with string keys
   * Used for JSON serialization
   */
  getSerializedTable(): Record<string, InstanceTableEntry> {
    const table: Record<string, InstanceTableEntry> = {};
    for (let i = 0; i < this.instances.length; i++) {
      table[String(i)] = this.instances[i];
    }
    return table;
  }

  /**
   * Reconstructs an InstanceTable from a serialized table object
   */
  static fromTable(table: Record<string, InstanceTableEntry>): InstanceTable {
    const instanceTable = new InstanceTable();
    const entries = Object.entries(table).sort(
      (a, b) => parseInt(a[0], 10) - parseInt(b[0], 10),
    );

    for (const [indexStr, instance] of entries) {
      const index = parseInt(indexStr, 10);
      const key = instanceTable.generateKey(instance);
      instanceTable.instanceMap.set(key, index);
      instanceTable.instances[index] = instance;
      instanceTable.nextIndex = Math.max(instanceTable.nextIndex, index + 1);
    }

    return instanceTable;
  }

  /**
   * Gets the total number of instances in the table
   */
  getSize(): number {
    return this.instances.length;
  }
}

/**
 * Instance reference format used in serialized JSON
 * The presence of _instanceRef indicates this is an instance reference
 */
export interface InstanceReference {
  _instanceRef: number;
}

/**
 * Creates an instance reference object for serialization
 */
export function createInstanceReference(index: number): InstanceReference {
  return {
    _instanceRef: index,
  };
}

/**
 * Checks if an object is an instance reference
 */
export function isInstanceReference(obj: any): boolean {
  return obj && typeof obj === "object" && typeof obj._instanceRef === "number";
}
