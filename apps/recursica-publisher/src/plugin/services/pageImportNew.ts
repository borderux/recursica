import type { ResponseMessage } from "../types/messages";
import {
  getDefaultsForNodeType,
  FRAME_DEFAULTS,
  TEXT_DEFAULTS,
} from "./parsers/nodeDefaults";
import type { BoundVariableInfo } from "./parsers/boundVariableParser";
import {
  VariableTable,
  CollectionTable,
  isVariableReference,
  type VariableReference,
  type VariableTableEntry,
  type VariableAliasSerialized,
  type CollectionTableEntry,
} from "./parsers/variableTable";
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ImportPageData {
  jsonData: any; // The full exported JSON structure
}

export interface ImportPageResponseData {
  pageName: string;
  totalNodes: number;
}

/**
 * Service for page import operations (new implementation with default value handling)
 */

/**
 * Ensures a collection has all required modes by name
 * Creates modes if they don't exist
 */
async function ensureCollectionModes(
  collection: VariableCollection,
  exportedModeNames: string[], // Array of mode names
): Promise<void> {
  // Ensure all exported mode names exist in the collection
  for (const modeName of exportedModeNames) {
    // Check if mode already exists by name
    const existingMode = collection.modes.find((m) => m.name === modeName);

    if (!existingMode) {
      // Mode doesn't exist - create it
      collection.addMode(modeName);
    }
  }
}

/**
 * Creates a mapping from old mode IDs to new mode IDs
 * Matches old modeIds (from valuesByMode keys) to mode names by index
 *
 * Note: This assumes the order of keys in valuesByMode matches the order
 * of mode names in the exported modes array.
 */
function createModeMapping(
  collection: VariableCollection,
  exportedModeNames: string[], // Array of mode names
  exportedValuesByMode: Record<string, any>, // oldModeId -> value
): Map<string, string> {
  // Map: oldModeId -> newModeId
  const modeMapping = new Map<string, string>();

  // Get old mode IDs from valuesByMode keys
  const oldModeIds = Object.keys(exportedValuesByMode);

  // Match mode names to old mode IDs by index
  // This assumes the order is preserved between exportedModeNames and oldModeIds
  for (let i = 0; i < exportedModeNames.length && i < oldModeIds.length; i++) {
    const modeName = exportedModeNames[i];
    const oldModeId = oldModeIds[i];

    // Find the mode by name (should exist after ensureCollectionModes)
    const mode = collection.modes.find((m) => m.name === modeName);

    if (mode) {
      modeMapping.set(oldModeId, mode.modeId);
    } else {
      console.warn(
        `Mode "${modeName}" not found in collection "${collection.name}" after ensuring modes exist.`,
      );
    }
  }

  return modeMapping;
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
function getOrGenerateCollectionGuid(collection: VariableCollection): string {
  // Try to get existing GUID from plugin data
  const existingGuid = collection.getSharedPluginData(
    "recursica",
    COLLECTION_GUID_KEY,
  );

  if (existingGuid && existingGuid.trim() !== "") {
    return existingGuid;
  }

  // Generate new GUID (UUID v4)
  // Using crypto.randomUUID() which is available in modern environments
  const newGuid = crypto.randomUUID();

  // Store GUID in plugin data for future use
  collection.setSharedPluginData("recursica", COLLECTION_GUID_KEY, newGuid);

  return newGuid;
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
 * Finds or creates a variable collection using collection table entry
 * Ensures all modes exist by name before returning
 * For local collections: finds existing or creates new
 * For external collections: validates existence in team library, throws error if not found
 * Validates non-local collection names before processing
 */
async function findOrCreateCollectionFromEntry(
  collectionEntry: CollectionTableEntry,
): Promise<{
  collection: VariableCollection;
}> {
  let collection: VariableCollection;
  const normalizedName = collectionEntry.collectionName.trim().toLowerCase();
  const allowedNonLocalNames = ["token", "tokens", "theme", "themes"];

  // Determine if collection is local or non-local
  // If isLocal is explicitly set, use it; otherwise infer from context
  const isLocal = collectionEntry.isLocal;
  const couldBeNonLocal =
    isLocal === false ||
    (isLocal === undefined && allowedNonLocalNames.includes(normalizedName));

  // If it could be non-local, try to find in team library first
  if (couldBeNonLocal) {
    try {
      const libraryCollections =
        await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
      const libraryCollection = libraryCollections.find((c) => {
        const cName = c.name.trim().toLowerCase();
        return cName === normalizedName;
      });

      if (libraryCollection) {
        // Validate collection name for non-local collections
        validateCollectionName(collectionEntry.collectionName, false);

        // Found in team library - import it
        const variables =
          await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
            libraryCollection.key,
          );

        if (variables.length > 0) {
          const importedVariable =
            await figma.variables.importVariableByKeyAsync(variables[0].key);

          const importedCollection =
            await figma.variables.getVariableCollectionByIdAsync(
              importedVariable.variableCollectionId,
            );

          if (importedCollection) {
            collection = importedCollection;
            // Set GUID on imported collection if available
            if (collectionEntry.collectionGuid) {
              const currentGuid = collection.getSharedPluginData(
                "recursica",
                COLLECTION_GUID_KEY,
              );
              if (!currentGuid || currentGuid.trim() === "") {
                collection.setSharedPluginData(
                  "recursica",
                  COLLECTION_GUID_KEY,
                  collectionEntry.collectionGuid,
                );
              }
            } else {
              getOrGenerateCollectionGuid(collection);
            }

            // Ensure all modes exist
            await ensureCollectionModes(collection, collectionEntry.modes);
            return { collection };
          }
        }
      }
    } catch (error) {
      // If external import fails and isLocal was explicitly false, throw error
      if (isLocal === false) {
        throw new Error(
          `External collection "${collectionEntry.collectionName}" not found in team library. Please ensure the collection is published and available.`,
        );
      }
      // Otherwise, fall through to local collection handling
      console.log("Could not import external collection, trying local:", error);
    }
  }

  // Handle as local collection (either explicitly local, or fallback from non-local attempt)
  if (isLocal !== false) {
    // For local collections, find existing by GUID first, then by name
    const localCollections =
      await figma.variables.getLocalVariableCollectionsAsync();

    let existingCollection: VariableCollection | undefined;

    // First, try to match by GUID if available
    if (collectionEntry.collectionGuid) {
      existingCollection = localCollections.find((c) => {
        const guid = c.getSharedPluginData("recursica", COLLECTION_GUID_KEY);
        return guid === collectionEntry.collectionGuid;
      });
    }

    // If no GUID match, fall back to name matching
    if (!existingCollection) {
      existingCollection = localCollections.find(
        (c) => c.name === collectionEntry.collectionName,
      );
    }

    if (existingCollection) {
      collection = existingCollection;
      // Ensure GUID is set on the collection (in case it was matched by name)
      if (collectionEntry.collectionGuid) {
        const currentGuid = collection.getSharedPluginData(
          "recursica",
          COLLECTION_GUID_KEY,
        );
        if (!currentGuid || currentGuid.trim() === "") {
          collection.setSharedPluginData(
            "recursica",
            COLLECTION_GUID_KEY,
            collectionEntry.collectionGuid,
          );
        }
      } else {
        // Generate GUID if not present in entry (backward compatibility)
        getOrGenerateCollectionGuid(collection);
      }
    } else {
      // Create new local collection
      collection = figma.variables.createVariableCollection(
        collectionEntry.collectionName,
      );
      // Set GUID on newly created collection
      if (collectionEntry.collectionGuid) {
        collection.setSharedPluginData(
          "recursica",
          COLLECTION_GUID_KEY,
          collectionEntry.collectionGuid,
        );
      } else {
        // Generate GUID if not present in entry (backward compatibility)
        getOrGenerateCollectionGuid(collection);
      }
    }
  } else {
    // For external collections, validate existence in team library
    // Match by name case-insensitively for Token/Tokens/Theme/Themes
    const libraryCollections =
      await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    const normalizedTargetName = collectionEntry.collectionName
      .trim()
      .toLowerCase();
    const libraryCollection = libraryCollections.find((c) => {
      const normalizedName = c.name.trim().toLowerCase();
      return normalizedName === normalizedTargetName;
    });

    if (!libraryCollection) {
      throw new Error(
        `External collection "${collectionEntry.collectionName}" not found in team library. Please ensure the collection is published and available.`,
      );
    }

    // Import the collection by importing a variable from it
    // First, get variables from the collection
    const variables =
      await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
        libraryCollection.key,
      );

    if (variables.length === 0) {
      throw new Error(
        `External collection "${collectionEntry.collectionName}" exists but has no variables. Cannot import.`,
      );
    }

    // Import the first variable to get access to the collection
    const importedVariable = await figma.variables.importVariableByKeyAsync(
      variables[0].key,
    );

    // Get the collection using the imported variable's collection ID
    const importedCollection =
      await figma.variables.getVariableCollectionByIdAsync(
        importedVariable.variableCollectionId,
      );

    if (!importedCollection) {
      throw new Error(
        `Failed to import external collection "${collectionEntry.collectionName}"`,
      );
    }

    collection = importedCollection;

    // Set GUID on imported collection if available (for future matching)
    // External collections become local after import, so we can store GUID
    if (collectionEntry.collectionGuid) {
      const currentGuid = collection.getSharedPluginData(
        "recursica",
        COLLECTION_GUID_KEY,
      );
      if (!currentGuid || currentGuid.trim() === "") {
        collection.setSharedPluginData(
          "recursica",
          COLLECTION_GUID_KEY,
          collectionEntry.collectionGuid,
        );
      }
    } else {
      // Generate GUID if not present in entry (backward compatibility)
      getOrGenerateCollectionGuid(collection);
    }
  }

  // Ensure all modes exist
  await ensureCollectionModes(collection, collectionEntry.modes);

  return { collection };
}

/**
 * Legacy function for backward compatibility
 * Finds or creates a variable collection by name
 * Validates non-local collection names before processing
 */
async function findOrCreateCollection(
  collectionName: string,
  isLocal: boolean,
): Promise<VariableCollection> {
  // Validate collection name for non-local collections
  validateCollectionName(collectionName, isLocal);

  if (isLocal) {
    const localCollections =
      await figma.variables.getLocalVariableCollectionsAsync();
    const existingCollection = localCollections.find(
      (c) => c.name === collectionName,
    );

    if (existingCollection) {
      return existingCollection;
    }

    return figma.variables.createVariableCollection(collectionName);
  } else {
    const libraryCollections =
      await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    const collection = libraryCollections.find(
      (c) => c.name === collectionName,
    );

    if (!collection) {
      throw new Error(
        `External collection "${collectionName}" not found in team library. Please ensure the collection is published and available.`,
      );
    }

    const variables =
      await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
        collection.key,
      );

    if (variables.length === 0) {
      throw new Error(
        `External collection "${collectionName}" exists but has no variables. Cannot import.`,
      );
    }

    const importedVariable = await figma.variables.importVariableByKeyAsync(
      variables[0].key,
    );

    const importedCollection =
      await figma.variables.getVariableCollectionByIdAsync(
        importedVariable.variableCollectionId,
      );

    if (!importedCollection) {
      throw new Error(
        `Failed to import external collection "${collectionName}"`,
      );
    }

    return importedCollection;
  }
}

/**
 * Finds a variable by name within a collection
 */
async function findVariableByName(
  collection: VariableCollection,
  variableName: string,
): Promise<Variable | null> {
  for (const varId of collection.variableIds) {
    try {
      const variable = await figma.variables.getVariableByIdAsync(varId);
      if (variable && variable.name === variableName) {
        return variable;
      }
    } catch {
      // Variable might not exist anymore, continue searching
      continue;
    }
  }
  return null;
}

/**
 * Validates that a variable's type matches the expected type
 * Returns true if match, false otherwise
 * Logs warning if mismatch (per requirement 4c)
 */
function validateVariableType(
  variable: Variable,
  expectedType: string,
): boolean {
  const actualType = variable.resolvedType.toUpperCase();
  const expectedTypeUpper = expectedType.toUpperCase();

  if (actualType !== expectedTypeUpper) {
    console.warn(
      `Variable type mismatch: Variable "${variable.name}" has type "${actualType}" but expected "${expectedTypeUpper}". Skipping binding.`,
    );
    return false;
  }

  return true;
}

/**
 * Restores variable mode values when creating a variable
 * Handles both primitive values and VARIABLE_ALIAS references
 * Uses mode mapping to convert old mode IDs to new mode IDs
 */
async function restoreVariableModeValues(
  variable: Variable,
  valuesByMode: Record<
    string,
    string | number | boolean | VariableAliasSerialized
  >,
  variableTable: VariableTable,
  modeMapping: Map<string, string>, // oldModeId -> newModeId
  collectionTable?: CollectionTable, // Optional: for resolving variable aliases by collection
): Promise<void> {
  for (const [oldModeId, value] of Object.entries(valuesByMode)) {
    // Map old mode ID to new mode ID
    const newModeId = modeMapping.get(oldModeId);
    if (!newModeId) {
      console.warn(
        `Mode ID ${oldModeId} not found in mode mapping for variable "${variable.name}". Skipping.`,
      );
      continue;
    }
    try {
      if (value === null || value === undefined) {
        continue;
      }

      // Handle primitive values
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        variable.setValueForMode(newModeId, value);
        continue;
      }

      // Handle VARIABLE_ALIAS
      if (
        typeof value === "object" &&
        value !== null &&
        "type" in value &&
        value.type === "VARIABLE_ALIAS"
      ) {
        const aliasValue = value as VariableAliasSerialized;
        let targetVariable: Variable | null = null;

        // Try to resolve by table reference first
        if (aliasValue._varRef !== undefined) {
          const referencedEntry = variableTable.getVariableByIndex(
            aliasValue._varRef,
          );
          if (referencedEntry) {
            // Get collection from collection table if available
            let refCollection: VariableCollection | null = null;
            if (collectionTable && referencedEntry._colRef !== undefined) {
              const collectionEntry = collectionTable.getCollectionByIndex(
                referencedEntry._colRef,
              );
              if (collectionEntry) {
                const result =
                  await findOrCreateCollectionFromEntry(collectionEntry);
                refCollection = result.collection;
              }
            }
            // Fallback to legacy fields if collection table not available
            if (
              !refCollection &&
              referencedEntry.collectionName &&
              referencedEntry.isLocal !== undefined
            ) {
              refCollection = await findOrCreateCollection(
                referencedEntry.collectionName,
                referencedEntry.isLocal,
              );
            }
            if (refCollection) {
              targetVariable = await findVariableByName(
                refCollection,
                referencedEntry.variableName,
              );
            }
          }
        }

        // Fallback: try to find by original ID
        if (!targetVariable && aliasValue.id) {
          try {
            targetVariable = await figma.variables.getVariableByIdAsync(
              aliasValue.id,
            );
          } catch {
            // Variable doesn't exist by ID, will log warning below
          }
        }

        if (targetVariable) {
          const alias: VariableAlias = {
            type: "VARIABLE_ALIAS",
            id: targetVariable.id,
          };
          variable.setValueForMode(newModeId, alias);
        } else {
          console.warn(
            `Could not resolve variable alias for mode ${oldModeId} (mapped to ${newModeId}) in variable "${variable.name}". Original ID: ${aliasValue.id}`,
          );
        }
      }
    } catch (error) {
      console.warn(
        `Error setting value for mode ${oldModeId} (mapped to ${newModeId}) in variable "${variable.name}":`,
        error,
      );
    }
  }
}

/**
 * Creates a variable from a variable table entry
 */
async function createVariableFromEntry(
  entry: VariableTableEntry,
  collection: VariableCollection,
  variableTable: VariableTable,
  modeMapping: Map<string, string>, // oldModeId -> newModeId
  collectionTable?: CollectionTable, // Optional: for resolving variable aliases
): Promise<Variable> {
  const variable = figma.variables.createVariable(
    entry.variableName,
    collection,
    entry.variableType as VariableResolvedDataType,
  );

  // Restore mode values if they exist
  if (entry.valuesByMode) {
    await restoreVariableModeValues(
      variable,
      entry.valuesByMode,
      variableTable,
      modeMapping,
      collectionTable,
    );
  }

  return variable;
}

/**
 * Main orchestration function for resolving variable references during import
 * Handles finding/creating collections, matching variables by name, type validation,
 * and creating variables if needed
 * Uses collections table for mode mapping
 */
async function resolveVariableReferenceOnImport(
  varRef: VariableReference,
  variableTable: VariableTable,
  collectionTable: CollectionTable,
): Promise<Variable | null> {
  // Get variable entry from table
  const entry = variableTable.getVariableByIndex(varRef._varRef);
  if (!entry) {
    console.warn(`Variable not found in table at index ${varRef._varRef}`);
    return null;
  }

  try {
    // Get collection entry - prefer _colRef (v2.4.0+), fallback to collectionRef (v2.3.0), then legacy fields
    let collectionEntry: CollectionTableEntry | undefined;
    const colRef = entry._colRef ?? entry.collectionRef;
    if (colRef !== undefined) {
      collectionEntry = collectionTable.getCollectionByIndex(colRef);
    }

    // Fallback to legacy fields if _colRef/collectionRef not available
    if (!collectionEntry && entry.collectionId && entry.isLocal !== undefined) {
      // Try to find collection entry by collectionId
      const collectionIndex = collectionTable.getCollectionIndex(
        entry.collectionId,
      );
      if (collectionIndex >= 0) {
        collectionEntry = collectionTable.getCollectionByIndex(collectionIndex);
      }
    }

    if (!collectionEntry) {
      // Legacy format - use legacy findOrCreateCollection
      const collection = await findOrCreateCollection(
        entry.collectionName || "",
        entry.isLocal || false,
      );

      // Find existing variable by name
      let variable = await findVariableByName(collection, entry.variableName);

      if (variable) {
        if (!validateVariableType(variable, entry.variableType)) {
          return null;
        }
        return variable;
      }

      if (!entry.valuesByMode) {
        console.warn(
          `Cannot create variable "${entry.variableName}" without valuesByMode data`,
        );
        return null;
      }

      // Legacy: create without mode mapping (may fail for mode IDs)
      variable = await createVariableFromEntry(
        entry,
        collection,
        variableTable,
        new Map(), // Empty mode mapping for legacy
        collectionTable, // Pass collection table for alias resolution
      );
      return variable;
    }

    // Use collections table entry
    const { collection } =
      await findOrCreateCollectionFromEntry(collectionEntry);

    // Find existing variable by name
    let variable = await findVariableByName(collection, entry.variableName);

    if (variable) {
      // Variable exists - validate type
      if (!validateVariableType(variable, entry.variableType)) {
        // Type mismatch - log warning and return null (per requirement 4c)
        return null;
      }
      // Variable exists and type matches - return it
      return variable;
    } else {
      // Variable doesn't exist - create it
      if (!entry.valuesByMode) {
        console.warn(
          `Cannot create variable "${entry.variableName}" without valuesByMode data`,
        );
        return null;
      }

      // Create mode mapping from exported mode names and valuesByMode
      const modeMapping = createModeMapping(
        collection,
        collectionEntry.modes,
        entry.valuesByMode,
      );

      variable = await createVariableFromEntry(
        entry,
        collection,
        variableTable,
        modeMapping,
        collectionTable, // Pass collection table for alias resolution
      );
      return variable;
    }
  } catch (error) {
    console.error(
      `Error resolving variable reference for "${entry.variableName}":`,
      error,
    );
    // Re-throw if it's an external collection error (per requirement 3a)
    if (
      error instanceof Error &&
      error.message.includes("External collection")
    ) {
      throw error;
    }
    return null;
  }
}

/**
 * Resolves a variable reference from the variable table to a full BoundVariableInfo
 */
function resolveVariableReference(
  varRef: any,
  variableTable: VariableTable | null,
): BoundVariableInfo | null {
  if (!variableTable || !isVariableReference(varRef)) {
    return null;
  }

  const variableEntry = variableTable.getVariableByIndex(varRef._varRef);
  if (!variableEntry) {
    console.log(`Variable not found in table at index ${varRef._varRef}`);
    return null;
  }

  return {
    type: "VARIABLE_ALIAS",
    id: variableEntry.id || "", // Fallback to empty string if id not available (new format)
    variableName: variableEntry.variableName,
    variableType: variableEntry.variableType,
    isLocal: variableEntry.isLocal || false,
    collectionName: variableEntry.collectionName,
    collectionId: variableEntry.collectionId,
    variableKey: variableEntry.variableKey,
  };
}

/**
 * Restores bound variables to a node property
 * Handles both local and team variables, and variable table references
 */
async function restoreBoundVariables(
  node: any,
  boundVariables: any,
  propertyName: string,
  variableTable: VariableTable | null,
  collectionTable: CollectionTable | null,
): Promise<void> {
  if (!boundVariables || typeof boundVariables !== "object") {
    return;
  }

  try {
    // Get the property value (e.g., fills array)
    const propertyValue = node[propertyName];
    if (!propertyValue || !Array.isArray(propertyValue)) {
      return;
    }

    // Process each bound variable
    for (const [key, varInfo] of Object.entries(boundVariables)) {
      if (key === "fills" && Array.isArray(varInfo)) {
        // Handle fills array binding
        for (let i = 0; i < varInfo.length && i < propertyValue.length; i++) {
          let varAlias: BoundVariableInfo | null = null;

          // Check if it's a variable reference or full object
          const varItem = varInfo[i];
          if (
            isVariableReference(varItem) &&
            variableTable &&
            collectionTable
          ) {
            // New format: use intelligent resolution
            const variable = await resolveVariableReferenceOnImport(
              varItem,
              variableTable,
              collectionTable,
            );
            if (variable && propertyValue[i].boundVariables) {
              propertyValue[i].boundVariables[propertyName] = {
                type: "VARIABLE_ALIAS",
                id: variable.id,
              };
            }
          } else if (
            varItem &&
            typeof varItem === "object" &&
            "type" in varItem &&
            varItem.type === "VARIABLE_ALIAS"
          ) {
            // Legacy format: full variable object
            varAlias = varItem as BoundVariableInfo;
            if (varAlias) {
              await bindVariableToProperty(
                propertyValue[i],
                varAlias,
                propertyName,
                variableTable,
              );
            }
          }
        }
      } else {
        // Handle direct property binding
        let varAlias: BoundVariableInfo | null = null;

        // Check if it's a variable reference or full object
        if (isVariableReference(varInfo)) {
          varAlias = resolveVariableReference(varInfo, variableTable);
        } else if (
          varInfo &&
          typeof varInfo === "object" &&
          "type" in varInfo &&
          varInfo.type === "VARIABLE_ALIAS"
        ) {
          // Legacy format: full variable object
          varAlias = varInfo as BoundVariableInfo;
        }

        if (varAlias) {
          await bindVariableToNodeProperty(node, key, varAlias, variableTable);
        }
      }
    }
  } catch (error) {
    console.log(`Error restoring bound variables for ${propertyName}:`, error);
  }
}

/**
 * Binds a variable to a node property
 * Uses the new intelligent variable resolution system
 */
async function bindVariableToNodeProperty(
  node: any,
  propertyName: string,
  varInfo: BoundVariableInfo,
  variableTable: VariableTable | null,
): Promise<void> {
  try {
    let variable: Variable | null = null;

    // First, try to get variable by ID (for legacy format)
    try {
      variable = await figma.variables.getVariableByIdAsync(varInfo.id);
    } catch {
      // Variable doesn't exist by ID - will resolve below
    }

    // If we have a variable table, use the new resolution system
    if (!variable && variableTable) {
      // For now, use the old logic but with new helpers
      if (varInfo.isLocal) {
        const collection = await findOrCreateCollection(
          varInfo.collectionName || "",
          true,
        );
        variable = await findVariableByName(
          collection,
          varInfo.variableName || "",
        );

        if (!variable && varInfo.variableName && varInfo.variableType) {
          // Create variable - but we need valuesByMode which we don't have here
          // This is a limitation - we should use resolveVariableReferenceOnImport instead
          console.warn(
            `Cannot create variable "${varInfo.variableName}" without valuesByMode. Use resolveVariableReferenceOnImport instead.`,
          );
        }
      } else {
        if (varInfo.variableKey) {
          try {
            variable = await figma.variables.importVariableByKeyAsync(
              varInfo.variableKey,
            );
          } catch {
            console.log(
              `Could not import team variable: ${varInfo.variableName}`,
            );
          }
        }
      }
    }

    if (variable) {
      // Bind the variable to the property
      const alias: VariableAlias = {
        type: "VARIABLE_ALIAS",
        id: variable.id,
      };
      if (!node.boundVariables) {
        node.boundVariables = {};
      }
      if (!node.boundVariables[propertyName]) {
        node.boundVariables[propertyName] = alias;
      }
    }
  } catch (error) {
    console.log(`Error binding variable to property ${propertyName}:`, error);
  }
}

/**
 * Binds a variable to a specific fill/stroke object
 */
async function bindVariableToProperty(
  propertyObject: any,
  varInfo: BoundVariableInfo,
  propertyName: string,
  variableTable: VariableTable | null,
): Promise<void> {
  if (!propertyObject || typeof propertyObject !== "object") {
    return;
  }

  try {
    // Similar logic to bindVariableToNodeProperty but for individual fill/stroke objects
    let variable: Variable | null = null;
    try {
      variable = await figma.variables.getVariableByIdAsync(varInfo.id);
    } catch {
      // Try to find or create variable using new resolution system
      if (variableTable) {
        if (varInfo.isLocal) {
          const collection = await findOrCreateCollection(
            varInfo.collectionName || "",
            true,
          );
          variable = await findVariableByName(
            collection,
            varInfo.variableName || "",
          );
        } else {
          if (varInfo.variableKey) {
            try {
              variable = await figma.variables.importVariableByKeyAsync(
                varInfo.variableKey,
              );
            } catch {
              console.log(
                `Could not import team variable: ${varInfo.variableName}`,
              );
            }
          }
        }
      }
    }

    if (variable && propertyObject.boundVariables) {
      propertyObject.boundVariables[propertyName] = {
        type: "VARIABLE_ALIAS",
        id: variable.id,
      };
    }
  } catch (error) {
    console.log(`Error binding variable to property object:`, error);
  }
}

/**
 * Applies default values to a newly created node
 */
function applyDefaultsToNode(node: any, nodeType: string): void {
  const defaults = getDefaultsForNodeType(nodeType);

  // Apply base defaults
  if (node.visible === undefined) {
    node.visible = defaults.visible;
  }
  if (node.locked === undefined) {
    node.locked = defaults.locked;
  }
  if (node.opacity === undefined) {
    node.opacity = defaults.opacity;
  }
  if (node.rotation === undefined) {
    node.rotation = defaults.rotation;
  }
  if (node.blendMode === undefined) {
    node.blendMode = defaults.blendMode;
  }

  // Apply type-specific defaults
  if (
    nodeType === "FRAME" ||
    nodeType === "COMPONENT" ||
    nodeType === "INSTANCE"
  ) {
    const frameDefaults = FRAME_DEFAULTS;
    if (node.layoutMode === undefined) {
      node.layoutMode = frameDefaults.layoutMode;
    }
    if (node.primaryAxisSizingMode === undefined) {
      node.primaryAxisSizingMode = frameDefaults.primaryAxisSizingMode;
    }
    if (node.counterAxisSizingMode === undefined) {
      node.counterAxisSizingMode = frameDefaults.counterAxisSizingMode;
    }
    if (node.primaryAxisAlignItems === undefined) {
      node.primaryAxisAlignItems = frameDefaults.primaryAxisAlignItems;
    }
    if (node.counterAxisAlignItems === undefined) {
      node.counterAxisAlignItems = frameDefaults.counterAxisAlignItems;
    }
    if (node.paddingLeft === undefined) {
      node.paddingLeft = frameDefaults.paddingLeft;
    }
    if (node.paddingRight === undefined) {
      node.paddingRight = frameDefaults.paddingRight;
    }
    if (node.paddingTop === undefined) {
      node.paddingTop = frameDefaults.paddingTop;
    }
    if (node.paddingBottom === undefined) {
      node.paddingBottom = frameDefaults.paddingBottom;
    }
    if (node.itemSpacing === undefined) {
      node.itemSpacing = frameDefaults.itemSpacing;
    }
  }

  if (nodeType === "TEXT") {
    const textDefaults = TEXT_DEFAULTS;
    if (node.textAlignHorizontal === undefined) {
      node.textAlignHorizontal = textDefaults.textAlignHorizontal;
    }
    if (node.textAlignVertical === undefined) {
      node.textAlignVertical = textDefaults.textAlignVertical;
    }
    if (node.textCase === undefined) {
      node.textCase = textDefaults.textCase;
    }
    if (node.textDecoration === undefined) {
      node.textDecoration = textDefaults.textDecoration;
    }
    if (node.textAutoResize === undefined) {
      node.textAutoResize = textDefaults.textAutoResize;
    }
  }
}

/**
 * Recursively recreates nodes from the extracted data
 * Uses defaults when properties are missing
 */
export async function recreateNodeFromData(
  nodeData: any,
  parentNode: any,
  variableTable: VariableTable | null = null,
  collectionTable: CollectionTable | null = null,
): Promise<any> {
  try {
    let newNode: any;

    // Create the appropriate node type
    switch (nodeData.type) {
      case "FRAME":
        newNode = figma.createFrame();
        break;
      case "RECTANGLE":
        newNode = figma.createRectangle();
        break;
      case "ELLIPSE":
        newNode = figma.createEllipse();
        break;
      case "TEXT":
        newNode = figma.createText();
        break;
      case "VECTOR":
        newNode = figma.createVector();
        break;
      case "STAR":
        newNode = figma.createStar();
        break;
      case "LINE":
        newNode = figma.createLine();
        break;
      case "COMPONENT":
        newNode = figma.createComponent();
        break;
      case "INSTANCE":
        // For instances, try to find the main component and create an instance
        console.log("Found instance node: " + nodeData.name);

        if (nodeData.mainComponent && nodeData.mainComponent.key) {
          try {
            // Try to import the main component by key
            const mainComp = await figma.importComponentByKeyAsync(
              nodeData.mainComponent.key,
            );
            if (mainComp && mainComp.type === "COMPONENT") {
              newNode = mainComp.createInstance();
              console.log(
                "Created instance from main component: " +
                  nodeData.mainComponent.name,
              );
            } else {
              console.log("Main component not found, creating frame fallback");
              newNode = figma.createFrame();
            }
          } catch (error) {
            console.log(
              "Error creating instance: " + error + ", creating frame fallback",
            );
            newNode = figma.createFrame();
          }
        } else {
          console.log("No main component info, creating frame fallback");
          newNode = figma.createFrame();
        }
        break;
      case "GROUP":
        newNode = figma.createFrame();
        break;
      case "BOOLEAN_OPERATION":
        console.log(
          "Boolean operation found: " +
            nodeData.name +
            ", creating frame fallback",
        );
        newNode = figma.createFrame();
        break;
      case "POLYGON":
        newNode = figma.createPolygon();
        break;
      default:
        console.log(
          "Unsupported node type: " +
            nodeData.type +
            ", creating frame instead",
        );
        newNode = figma.createFrame();
        break;
    }

    if (!newNode) {
      return null;
    }

    // Apply defaults first
    applyDefaultsToNode(newNode, nodeData.type || "FRAME");

    // Set basic properties (override defaults with serialized values)
    if (nodeData.name !== undefined) {
      newNode.name = nodeData.name || "Unnamed Node";
    }
    if (nodeData.x !== undefined) {
      newNode.x = nodeData.x;
    }
    if (nodeData.y !== undefined) {
      newNode.y = nodeData.y;
    }
    if (nodeData.width !== undefined && nodeData.height !== undefined) {
      newNode.resize(nodeData.width, nodeData.height);
    }

    // Set visual properties if they exist
    if (nodeData.visible !== undefined) {
      newNode.visible = nodeData.visible;
    }
    if (nodeData.locked !== undefined) {
      newNode.locked = nodeData.locked;
    }
    if (nodeData.opacity !== undefined) {
      newNode.opacity = nodeData.opacity;
    }
    if (nodeData.rotation !== undefined) {
      newNode.rotation = nodeData.rotation;
    }
    if (nodeData.blendMode !== undefined) {
      newNode.blendMode = nodeData.blendMode;
    }

    // Set fills if they exist (skip instances, they're handled separately)
    if (nodeData.type !== "INSTANCE" && nodeData.fills !== undefined) {
      try {
        // Process fills array to resolve variable references
        let fills = nodeData.fills;
        if (Array.isArray(fills) && variableTable) {
          fills = fills.map((fill: any) => {
            if (fill && typeof fill === "object" && fill.boundVariables) {
              // Resolve variable references in boundVariables
              const resolvedBoundVars: any = {};
              for (const [key, varInfo] of Object.entries(
                fill.boundVariables,
              )) {
                // Keep references as-is - will be resolved during restoreBoundVariables
                resolvedBoundVars[key] = varInfo;
              }
              return { ...fill, boundVariables: resolvedBoundVars };
            }
            return fill;
          });
        }

        newNode.fills = fills;
        // Restore bound variables for fills
        if (nodeData.boundVariables?.fills) {
          await restoreBoundVariables(
            newNode,
            nodeData.boundVariables,
            "fills",
            variableTable,
            collectionTable,
          );
        }
      } catch (error) {
        console.log("Error setting fills:", error);
      }
    }

    // Set strokes if they exist
    if (nodeData.strokes !== undefined && nodeData.strokes.length > 0) {
      try {
        newNode.strokes = nodeData.strokes;
      } catch (error) {
        console.log("Error setting strokes:", error);
      }
    }

    // Set additional properties for better visual similarity
    if (nodeData.strokeWeight !== undefined) {
      newNode.strokeWeight = nodeData.strokeWeight;
    }
    if (nodeData.strokeAlign !== undefined) {
      newNode.strokeAlign = nodeData.strokeAlign;
    }
    if (nodeData.cornerRadius !== undefined) {
      newNode.cornerRadius = nodeData.cornerRadius;
    }
    if (nodeData.effects !== undefined && nodeData.effects.length > 0) {
      newNode.effects = nodeData.effects;
    }

    // Set layout properties for frames, components, and instances
    if (
      nodeData.type === "FRAME" ||
      nodeData.type === "COMPONENT" ||
      nodeData.type === "INSTANCE"
    ) {
      if (nodeData.layoutMode !== undefined) {
        newNode.layoutMode = nodeData.layoutMode;
      }
      if (nodeData.primaryAxisSizingMode !== undefined) {
        newNode.primaryAxisSizingMode = nodeData.primaryAxisSizingMode;
      }
      if (nodeData.counterAxisSizingMode !== undefined) {
        newNode.counterAxisSizingMode = nodeData.counterAxisSizingMode;
      }
      if (nodeData.primaryAxisAlignItems !== undefined) {
        newNode.primaryAxisAlignItems = nodeData.primaryAxisAlignItems;
      }
      if (nodeData.counterAxisAlignItems !== undefined) {
        newNode.counterAxisAlignItems = nodeData.counterAxisAlignItems;
      }
      if (nodeData.paddingLeft !== undefined) {
        newNode.paddingLeft = nodeData.paddingLeft;
      }
      if (nodeData.paddingRight !== undefined) {
        newNode.paddingRight = nodeData.paddingRight;
      }
      if (nodeData.paddingTop !== undefined) {
        newNode.paddingTop = nodeData.paddingTop;
      }
      if (nodeData.paddingBottom !== undefined) {
        newNode.paddingBottom = nodeData.paddingBottom;
      }
      if (nodeData.itemSpacing !== undefined) {
        newNode.itemSpacing = nodeData.itemSpacing;
      }
    }

    // Set vector and line properties
    if (nodeData.type === "VECTOR" || nodeData.type === "LINE") {
      if (nodeData.strokeCap !== undefined) {
        newNode.strokeCap = nodeData.strokeCap;
      }
      if (nodeData.strokeJoin !== undefined) {
        newNode.strokeJoin = nodeData.strokeJoin;
      }
      if (
        nodeData.dashPattern !== undefined &&
        nodeData.dashPattern.length > 0
      ) {
        newNode.dashPattern = nodeData.dashPattern;
      }
    }

    // Set text properties for text nodes
    if (nodeData.type === "TEXT" && nodeData.characters !== undefined) {
      try {
        // Load font first if available, otherwise use default
        if (nodeData.fontName) {
          try {
            await figma.loadFontAsync(nodeData.fontName);
            newNode.fontName = nodeData.fontName;
          } catch {
            // Load default font as fallback
            await figma.loadFontAsync({
              family: "Roboto",
              style: "Regular",
            });
            newNode.fontName = { family: "Roboto", style: "Regular" };
          }
        } else {
          // Load default font if no font specified
          await figma.loadFontAsync({
            family: "Roboto",
            style: "Regular",
          });
          newNode.fontName = { family: "Roboto", style: "Regular" };
        }

        // Set text content
        newNode.characters = nodeData.characters;

        // Set other text properties if they exist
        if (nodeData.fontSize !== undefined) {
          newNode.fontSize = nodeData.fontSize;
        }
        if (nodeData.textAlignHorizontal !== undefined) {
          newNode.textAlignHorizontal = nodeData.textAlignHorizontal;
        }
        if (nodeData.textAlignVertical !== undefined) {
          newNode.textAlignVertical = nodeData.textAlignVertical;
        }
        if (nodeData.letterSpacing !== undefined) {
          newNode.letterSpacing = nodeData.letterSpacing;
        }
        if (nodeData.lineHeight !== undefined) {
          newNode.lineHeight = nodeData.lineHeight;
        }
        if (nodeData.textCase !== undefined) {
          newNode.textCase = nodeData.textCase;
        }
        if (nodeData.textDecoration !== undefined) {
          newNode.textDecoration = nodeData.textDecoration;
        }
        if (nodeData.textAutoResize !== undefined) {
          newNode.textAutoResize = nodeData.textAutoResize;
        }
      } catch (error) {
        console.log("Error setting text properties: " + error);
        // Final fallback: just set the text with basic properties
        try {
          newNode.characters = nodeData.characters;
        } catch (textError) {
          console.log("Could not set text characters: " + textError);
        }
      }
    }

    // Restore bound variables (if any)
    if (nodeData.boundVariables) {
      for (const [propertyName, varInfo] of Object.entries(
        nodeData.boundVariables,
      )) {
        if (propertyName !== "fills") {
          // Handle non-fills bound variables
          if (
            isVariableReference(varInfo) &&
            variableTable &&
            collectionTable
          ) {
            // New format: use intelligent resolution
            const variable = await resolveVariableReferenceOnImport(
              varInfo as VariableReference,
              variableTable,
              collectionTable,
            );
            if (variable) {
              const alias: VariableAlias = {
                type: "VARIABLE_ALIAS",
                id: variable.id,
              };
              if (!newNode.boundVariables) {
                newNode.boundVariables = {};
              }
              if (!newNode.boundVariables[propertyName]) {
                newNode.boundVariables[propertyName] = alias;
              }
            }
          } else if (
            varInfo &&
            typeof varInfo === "object" &&
            "type" in varInfo &&
            varInfo.type === "VARIABLE_ALIAS"
          ) {
            // Legacy format: full variable object
            const varAlias = varInfo as BoundVariableInfo;
            await bindVariableToNodeProperty(
              newNode,
              propertyName,
              varAlias,
              variableTable,
            );
          }
        }
      }
    }

    // Recursively recreate children
    if (nodeData.children && Array.isArray(nodeData.children)) {
      for (const childData of nodeData.children) {
        // Skip truncated children markers
        if (childData._truncated) {
          console.log(
            `Skipping truncated children: ${childData._reason || "Unknown"}`,
          );
          continue;
        }
        const childNode = await recreateNodeFromData(
          childData,
          newNode,
          variableTable,
          collectionTable,
        );
        if (childNode) {
          newNode.appendChild(childNode);
        }
      }
    }

    // Add the node to the parent
    if (parentNode) {
      parentNode.appendChild(newNode);
    }

    return newNode;
  } catch (error) {
    console.log(
      "Error recreating node " + (nodeData.name || nodeData.type) + ":",
      error,
    );
    return null;
  }
}

export async function importPage(
  data: ImportPageData,
): Promise<ResponseMessage> {
  try {
    const jsonData = data.jsonData;

    if (!jsonData) {
      return {
        type: "importPage",
        success: false,
        error: true,
        message: "JSON data is required",
        data: {},
      };
    }

    console.log("Importing page from JSON");

    // Validate JSON structure
    if (!jsonData.pageData || !jsonData.metadata) {
      return {
        type: "importPage",
        success: false,
        error: true,
        message: "Invalid JSON format. Expected pageData and metadata.",
        data: {},
      };
    }

    const pageData = jsonData.pageData;
    const metadata = jsonData.metadata;

    // Load collections table if present (format 2.3.0+)
    let collectionTable: CollectionTable | null = null;
    if (jsonData.collections) {
      try {
        collectionTable = CollectionTable.fromTable(jsonData.collections);
        console.log(
          `Loaded collections table with ${collectionTable.getSize()} collections`,
        );
      } catch (error) {
        console.warn("Failed to load collections table:", error);
      }
    }

    // Load variable table if present (format 2.1.0+)
    let variableTable: VariableTable | null = null;
    if (jsonData.variables) {
      try {
        variableTable = VariableTable.fromTable(jsonData.variables);
        console.log(
          `Loaded variable table with ${variableTable.getSize()} variables`,
        );
      } catch (error) {
        console.warn("Failed to load variable table:", error);
      }
    }

    // Version validation and compatibility checks
    const currentExportFormatVersion = "2.3.0";
    const exportedVersion = metadata.exportFormatVersion || "1.0.0";

    if (exportedVersion !== currentExportFormatVersion) {
      console.warn(
        `Export format version mismatch: exported with ${exportedVersion}, current version is ${currentExportFormatVersion}. Import may have compatibility issues.`,
      );
    }

    const sanitizedPageName = metadata.originalPageName
      ? metadata.originalPageName
          .replace(/[^\w\s-]/g, "") // Remove emojis and special characters except word chars, spaces, and hyphens
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
          .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
      : "Unknown";

    // Create a new page for the imported content
    const newPageName = "Imported - " + sanitizedPageName;
    const newPage = figma.createPage();
    newPage.name = newPageName;
    figma.root.appendChild(newPage);

    console.log("Created new page: " + newPageName);
    console.log("Importing " + (metadata.totalNodes || "unknown") + " nodes");

    // Recreate the page content
    if (pageData.children && Array.isArray(pageData.children)) {
      for (const childData of pageData.children) {
        if (childData._truncated) {
          console.log(
            `Skipping truncated children: ${childData._reason || "Unknown"}`,
          );
          continue;
        }
        await recreateNodeFromData(
          childData,
          newPage,
          variableTable,
          collectionTable,
        );
      }
      console.log("Successfully imported page content with all children");
    } else {
      console.log("No children to import");
    }

    const responseData: ImportPageResponseData = {
      pageName: metadata.originalPageName,
      totalNodes: metadata.totalNodes || 0,
    };

    return {
      type: "importPage",
      success: true,
      error: false,
      message: "Page imported successfully",
      data: responseData as any,
    };
  } catch (error) {
    console.error("Error importing page:", error);
    return {
      type: "importPage",
      success: false,
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: {},
    };
  }
}
