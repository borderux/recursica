/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  VariableTable,
  type VariableTableEntry,
  createVariableReference,
  type VariableReference,
  type VariableAliasSerialized,
  CollectionTable,
  type CollectionTableEntry,
} from "./variableTable";
import { requestGuidFromUI } from "../../utils/requestGuidFromUI";
import { debugConsole } from "../debugConsole";
import {
  isStandardCollection,
  getFixedGuidForCollection,
} from "../../../const/CollectionConstants";

/**
 * Parser for handling bound variables in Figma nodes
 * Uses VariableTable to store unique variables and return index references
 */

export interface BoundVariableInfo {
  type: "VARIABLE_ALIAS";
  id: string;
  variableName?: string;
  variableType?: string;
  isLocal: boolean;
  collectionName?: string;
  collectionId?: string;
  variableKey?: string;
}

/**
 * Converts mode IDs to mode names using the collection's mode information
 */
function convertModeIdToName(
  modeId: string,
  collection: VariableCollection,
): string {
  const mode = collection.modes.find((m) => m.modeId === modeId);
  return mode ? mode.name : modeId; // Fallback to modeId if not found
}

/**
 * Recursively resolves VARIABLE_ALIAS values in valuesByMode
 * Adds all referenced variables to the table and returns serialized valuesByMode
 * Uses mode names instead of mode IDs as keys
 * Prevents infinite loops by tracking visited variable IDs
 */
async function resolveVariableValuesRecursively(
  valuesByMode: Record<string, any>,
  variableTable: VariableTable,
  collectionTable: CollectionTable,
  collection: VariableCollection, // Collection to convert mode IDs to names
  visitedIds: Set<string> = new Set(),
): Promise<
  Record<string, string | number | boolean | VariableAliasSerialized>
> {
  const serialized: Record<
    string,
    string | number | boolean | VariableAliasSerialized
  > = {};

  for (const [modeId, value] of Object.entries(valuesByMode)) {
    // Convert mode ID to mode name
    const modeName = convertModeIdToName(modeId, collection);
    if (value === null || value === undefined) {
      serialized[modeName] = value;
      continue;
    }

    // Check if it's a primitive value
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      serialized[modeName] = value;
      continue;
    }

    // Check if it's a VARIABLE_ALIAS
    if (
      typeof value === "object" &&
      value !== null &&
      "type" in value &&
      value.type === "VARIABLE_ALIAS" &&
      "id" in value
    ) {
      const aliasId = value.id as string;

      // Prevent infinite loops
      if (visitedIds.has(aliasId)) {
        // Reference to already visited variable - store with just ID
        serialized[modeName] = {
          type: "VARIABLE_ALIAS",
          id: aliasId,
        };
        continue;
      }

      // Resolve the referenced variable
      const referencedVariable =
        await figma.variables.getVariableByIdAsync(aliasId);
      if (!referencedVariable) {
        // Cannot resolve - store with just ID (non-critical, continue)
        serialized[modeName] = {
          type: "VARIABLE_ALIAS",
          id: aliasId,
        };
        continue;
      }

      // Add to visited set
      const newVisitedIds = new Set(visitedIds);
      newVisitedIds.add(aliasId);

      // Get collection info for the referenced variable
      const refCollection =
        await figma.variables.getVariableCollectionByIdAsync(
          referencedVariable.variableCollectionId,
        );

      const variableKey = (referencedVariable as any).key;
      if (!variableKey) {
        // Missing key - store with just ID (non-critical, continue)
        serialized[modeName] = {
          type: "VARIABLE_ALIAS",
          id: aliasId,
        };
        continue;
      }

      // Create entry for referenced variable
      const referencedEntry: VariableTableEntry = {
        variableName: referencedVariable.name,
        variableType: referencedVariable.resolvedType,
        collectionName: refCollection?.name,
        collectionId: referencedVariable.variableCollectionId,
        variableKey: variableKey,
        id: aliasId,
        isLocal: !referencedVariable.remote,
      };

      // Add collection to collections table
      // This can throw if collection has invalid name - let it bubble up
      if (refCollection) {
        const refCollectionRef = await addCollectionToTable(
          refCollection,
          collectionTable,
        );
        referencedEntry._colRef = refCollectionRef;

        // Recursively resolve this variable's values if it has any
        if (referencedVariable.valuesByMode) {
          referencedEntry.valuesByMode = await resolveVariableValuesRecursively(
            referencedVariable.valuesByMode,
            variableTable,
            collectionTable,
            refCollection, // Pass collection for mode ID to name conversion
            newVisitedIds,
          );
        }
      }

      // Add to table and get index
      const refIndex = variableTable.addVariable(referencedEntry);

      // Store serialized alias with both ID and table reference
      serialized[modeName] = {
        type: "VARIABLE_ALIAS",
        id: aliasId,
        _varRef: refIndex,
      };
    } else {
      // Unknown value type - store as-is (shouldn't happen normally)
      serialized[modeName] = value;
    }
  }

  return serialized;
}

/**
 * Plugin data key for storing collection GUID
 */
const COLLECTION_GUID_KEY = "recursica:collectionId";

/**
 * Gets or generates a GUID for a collection
 * GUIDs are stored as plugin data on the collection for persistence across files
 * @param collection - The variable collection
 * @returns The GUID for the collection
 */
async function getOrGenerateCollectionGuid(
  collection: VariableCollection,
): Promise<string> {
  // Check if collection is remote - we can't write plugin data to remote collections
  const isRemote = collection.remote === true;

  if (!isRemote) {
    // For standard collections, use fixed GUID
    if (isStandardCollection(collection.name)) {
      const fixedGuid = getFixedGuidForCollection(collection.name);
      if (fixedGuid) {
        // Store fixed GUID on collection if not already set
        const existingGuid = collection.getSharedPluginData(
          "recursica",
          COLLECTION_GUID_KEY,
        );
        if (!existingGuid || existingGuid.trim() === "") {
          collection.setSharedPluginData(
            "recursica",
            COLLECTION_GUID_KEY,
            fixedGuid,
          );
        }
        return fixedGuid;
      }
    }

    // For local collections, try to get existing GUID from plugin data
    const existingGuid = collection.getSharedPluginData(
      "recursica",
      COLLECTION_GUID_KEY,
    );

    if (existingGuid && existingGuid.trim() !== "") {
      return existingGuid;
    }

    // Generate new GUID (UUID v4)
    // Request GUID from UI which has access to crypto.randomUUID()
    const newGuid = await requestGuidFromUI();

    // Store GUID in plugin data for future use (only for local collections)
    collection.setSharedPluginData("recursica", COLLECTION_GUID_KEY, newGuid);

    return newGuid;
  } else {
    // For remote collections, we can't write plugin data
    // Only special collections (Token, Tokens, Theme, Themes) are supported
    const normalizedName = collection.name.trim().toLowerCase();
    const supportedCollectionNames = ["token", "tokens", "theme", "themes"];

    if (!supportedCollectionNames.includes(normalizedName)) {
      const errorMessage = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${collection.name}", Collection ID: ${collection.id}`;
      debugConsole.error(errorMessage);
      throw new Error(errorMessage);
    }

    // For supported remote collections, use the collection ID as a stable identifier
    // The collection ID is already unique and stable across exports
    return collection.id;
  }
}

/**
 * Validates that non-local collections have allowed names
 * Only "Token"/"Tokens" or "Theme"/"Themes" are allowed for non-local collections (case-insensitive)
 * @throws Error if collection is non-local and has an invalid name
 */
function validateCollectionName(
  collectionName: string,
  isLocal: boolean,
): void {
  if (isLocal) {
    // Local collections can have any name
    return;
  }

  // For non-local collections, only allow Token/Tokens or Theme/Themes (case-insensitive)
  const normalizedName = collectionName.trim().toLowerCase();
  const allowedNames = ["token", "tokens", "theme", "themes"];

  if (!allowedNames.includes(normalizedName)) {
    throw new Error(
      `Invalid collection name: "${collectionName}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`,
    );
  }
}

/**
 * Adds a collection to the collections table, extracting mode information
 * Validates non-local collection names before adding
 * Generates or retrieves GUID for the collection
 */
async function addCollectionToTable(
  collection: VariableCollection,
  collectionTable: CollectionTable,
): Promise<number> {
  const isLocal = !collection.remote;

  // Check if collection already exists in table
  const existingIndex = collectionTable.getCollectionIndex(collection.id);
  if (existingIndex !== -1) {
    // Collection already in table, return existing index
    return existingIndex;
  }

  // Validate collection name for non-local collections
  validateCollectionName(collection.name, isLocal);

  // Get or generate GUID for the collection
  const collectionGuid = await getOrGenerateCollectionGuid(collection);

  // Extract mode names as an array
  const modes: string[] = collection.modes.map((mode) => mode.name);

  // Create collection entry
  const collectionEntry: CollectionTableEntry = {
    collectionName: collection.name,
    collectionId: collection.id,
    isLocal,
    modes,
    collectionGuid,
  };

  // Add to table and return index
  const index = collectionTable.addCollection(collectionEntry);

  // Log when a new collection is added
  const collectionType = isLocal ? "local" : "remote";
  debugConsole.log(
    `  Added ${collectionType} collection: "${collection.name}" (ID: ${collection.id.substring(0, 20)}...)`,
  );

  return index;
}

/**
 * Resolves a VARIABLE_ALIAS to get additional metadata about the variable
 * Adds it to the variable table and returns a reference index
 * Also recursively resolves and stores valuesByMode
 * Also adds the variable's collection to the collections table
 */
export async function resolveVariableAliasMetadata(
  alias: any,
  variableTable: VariableTable,
  collectionTable: CollectionTable,
): Promise<VariableReference | null> {
  if (!alias || typeof alias !== "object" || alias.type !== "VARIABLE_ALIAS") {
    return null;
  }

  try {
    const variable = await figma.variables.getVariableByIdAsync(alias.id);
    if (!variable) {
      // Cannot resolve variable, return null
      console.log("Could not resolve variable alias:", alias.id);
      return null;
    }

    const collection = await figma.variables.getVariableCollectionByIdAsync(
      variable.variableCollectionId,
    );

    if (!collection) {
      console.log("Could not resolve collection for variable:", alias.id);
      return null;
    }

    const variableKey = (variable as any).key;
    if (!variableKey) {
      console.log("Variable missing key:", alias.id);
      return null;
    }

    // Add collection to collections table and get reference
    const collectionRef = await addCollectionToTable(
      collection,
      collectionTable,
    );

    // Create variable table entry
    const variableEntry: VariableTableEntry = {
      variableName: variable.name,
      variableType: variable.resolvedType,
      _colRef: collectionRef, // Reference to collection table (v2.4.0+)
      variableKey: variableKey, // Internal-only: used for deduplication during export
      id: alias.id, // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };

    // Recursively resolve and store valuesByMode
    if (variable.valuesByMode) {
      variableEntry.valuesByMode = await resolveVariableValuesRecursively(
        variable.valuesByMode,
        variableTable,
        collectionTable,
        collection, // Pass collection for mode ID to name conversion
        new Set([alias.id]), // Start with current variable ID in visited set
      );
    }

    // Add to table and get index (or existing index if already present)
    const index = variableTable.addVariable(variableEntry);

    // Return reference
    return createVariableReference(index);
  } catch (error) {
    // Log error and rethrow to bubble up to exportPage
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Could not resolve variable alias:", alias.id, error);
    throw new Error(
      `Failed to resolve variable alias ${alias.id}: ${errorMessage}`,
    );
  }
}

/**
 * Extracts bound variables from an object, replacing them with variable table references
 */
export async function extractBoundVariables(
  obj: any,
  variableTable: VariableTable,
  collectionTable: CollectionTable,
): Promise<any> {
  if (!obj || typeof obj !== "object") return obj;

  const result: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value && typeof value === "object" && !Array.isArray(value)) {
        // If it's a VARIABLE_ALIAS, resolve it to get table reference
        if (value.type === "VARIABLE_ALIAS") {
          const resolved = await resolveVariableAliasMetadata(
            value,
            variableTable,
            collectionTable,
          );
          if (resolved) {
            result[key] = resolved;
          }
        } else {
          // Recursively process nested objects
          result[key] = await extractBoundVariables(
            value,
            variableTable,
            collectionTable,
          );
        }
      } else if (Array.isArray(value)) {
        // Handle arrays of variable aliases (like in fills)
        result[key] = await Promise.all(
          value.map(async (item: any) => {
            if (item?.type === "VARIABLE_ALIAS") {
              const resolved = await resolveVariableAliasMetadata(
                item,
                variableTable,
                collectionTable,
              );
              return resolved || item;
            } else if (item && typeof item === "object") {
              // Recursively process objects in arrays (e.g., fills with boundVariables)
              return await extractBoundVariables(
                item,
                variableTable,
                collectionTable,
              );
            }
            return item;
          }),
        );
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

/**
 * Serializes fills, handling bound variables with variable table references
 */
export async function serializeFills(
  fills: any,
  variableTable: VariableTable,
  collectionTable: CollectionTable,
): Promise<any> {
  if (!fills || !Array.isArray(fills)) return [];

  return Promise.all(
    fills.map(async (fill: any) => {
      if (!fill || typeof fill !== "object") return fill;
      const serializedFill: any = {};
      for (const key in fill) {
        if (Object.prototype.hasOwnProperty.call(fill, key)) {
          if (key === "boundVariables") {
            serializedFill[key] = await extractBoundVariables(
              fill[key],
              variableTable,
              collectionTable,
            );
          } else {
            serializedFill[key] = fill[key];
          }
        }
      }
      return serializedFill;
    }),
  );
}

/**
 * Serializes backgrounds, handling bound variables with variable table references
 * Similar to serializeFills, but for backgrounds property
 */
export async function serializeBackgrounds(
  backgrounds: any,
  variableTable: VariableTable,
  collectionTable: CollectionTable,
): Promise<any> {
  if (!backgrounds || !Array.isArray(backgrounds)) return [];

  return Promise.all(
    backgrounds.map(async (background: any) => {
      if (!background || typeof background !== "object") return background;
      const serializedBackground: any = {};
      for (const key in background) {
        if (Object.prototype.hasOwnProperty.call(background, key)) {
          if (key === "boundVariables") {
            serializedBackground[key] = await extractBoundVariables(
              background[key],
              variableTable,
              collectionTable,
            );
          } else {
            serializedBackground[key] = background[key];
          }
        }
      }
      return serializedBackground;
    }),
  );
}
