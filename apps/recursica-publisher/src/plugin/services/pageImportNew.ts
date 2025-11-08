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
import { InstanceTable } from "./parsers/instanceTable";
import { StringTable } from "./parsers/stringTable";
import { requestGuidFromUI } from "../utils/requestGuidFromUI";
import { REGISTERED_REMOTE_COLLECTIONS } from "../../const/RegisteredCollections";
import { debugConsole } from "./debugConsole";
import { expandJsonData } from "../utils/jsonCompression";
import { pluginPrompt } from "../utils/pluginPrompt";
import {
  normalizeCollectionName,
  isStandardCollection,
  getFixedGuidForCollection,
} from "../../const/CollectionConstants";
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ImportPageData {
  jsonData: any; // The full exported JSON structure
  deleteScratchPagesOnFailure?: boolean; // If true, delete scratch pages if import fails (default: false)
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
 * Handles the default mode that Figma creates automatically
 */
async function ensureCollectionModes(
  collection: VariableCollection,
  exportedModeNames: string[], // Array of mode names
): Promise<void> {
  // When a collection is created, Figma automatically adds a default mode (usually "Mode 1")
  // Check if the default mode exists and if it's not in our exported modes, we can rename it
  // or leave it as-is (it won't be used if not in exportedModeNames)

  // Ensure all exported mode names exist in the collection
  for (const modeName of exportedModeNames) {
    // Check if mode already exists by name
    const existingMode = collection.modes.find((m) => m.name === modeName);

    if (!existingMode) {
      // Mode doesn't exist - create it
      collection.addMode(modeName);
    }
  }

  // Note: We don't remove the default mode if it's not in exportedModeNames
  // It will just remain unused, which is fine
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
    // Remote collections must be registered in REGISTERED_REMOTE_COLLECTIONS
    const registeredCollection = REGISTERED_REMOTE_COLLECTIONS[collection.id];

    if (!registeredCollection) {
      const errorMessage = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${collection.name}", Collection ID: ${collection.id}`;
      await debugConsole.error(errorMessage);
      throw new Error(errorMessage);
    }

    const registeredGuid = registeredCollection.guid;

    return registeredGuid;
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
              await getOrGenerateCollectionGuid(collection);
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
        await getOrGenerateCollectionGuid(collection);
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
        await getOrGenerateCollectionGuid(collection);
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
 * Uses mode names directly (valuesByMode keys are now mode names, not IDs)
 */
async function restoreVariableModeValues(
  variable: Variable,
  valuesByMode: Record<
    string,
    string | number | boolean | VariableAliasSerialized
  >,
  variableTable: VariableTable,
  collection: VariableCollection, // Collection to look up mode by name
  collectionTable?: CollectionTable, // Optional: for resolving variable aliases by collection
): Promise<void> {
  for (const [modeName, value] of Object.entries(valuesByMode)) {
    // Find mode by name (valuesByMode now uses mode names as keys)
    const mode = collection.modes.find((m) => m.name === modeName);
    if (!mode) {
      console.warn(
        `Mode "${modeName}" not found in collection "${collection.name}" for variable "${variable.name}". Skipping.`,
      );
      continue;
    }
    const modeId = mode.modeId;
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
        variable.setValueForMode(modeId, value);
        continue;
      }

      // Handle VARIABLE_ALIAS - detect by presence of _varRef
      if (
        typeof value === "object" &&
        value !== null &&
        "_varRef" in value &&
        typeof (value as any)._varRef === "number"
      ) {
        const aliasValue = value as { _varRef: number };
        let targetVariable: Variable | null = null;

        // Resolve by table reference
        const referencedEntry = variableTable.getVariableByIndex(
          aliasValue._varRef,
        );
        if (referencedEntry) {
          // Get collection from collection table
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

          if (refCollection) {
            targetVariable = await findVariableByName(
              refCollection,
              referencedEntry.variableName,
            );
          }
        }

        if (targetVariable) {
          const alias: VariableAlias = {
            type: "VARIABLE_ALIAS",
            id: targetVariable.id,
          };
          variable.setValueForMode(modeId, alias);
        } else {
          console.warn(
            `Could not resolve variable alias for mode "${modeName}" in variable "${variable.name}". Variable reference index: ${aliasValue._varRef}`,
          );
        }
      }
    } catch (error) {
      console.warn(
        `Error setting value for mode "${modeName}" in variable "${variable.name}":`,
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
      collection, // Pass collection to look up modes by name
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
    // Get collection entry from collection table
    const colRef = entry._colRef;
    if (colRef === undefined) {
      console.warn(
        `Variable "${entry.variableName}" missing collection reference (_colRef)`,
      );
      return null;
    }

    const collectionEntry = collectionTable.getCollectionByIndex(colRef);
    if (!collectionEntry) {
      console.warn(
        `Collection not found at index ${colRef} for variable "${entry.variableName}"`,
      );
      return null;
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

      // valuesByMode now uses mode names as keys, so no mapping needed
      variable = await createVariableFromEntry(
        entry,
        collection,
        variableTable,
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
/**
 * Restores bound variables for fills property using recognizedVariables map
 * For fills, boundVariables structure is: { fills: [{ color: { _varRef: ... } }, ...] }
 * Each fill item can have boundVariables with properties like "color"
 */
async function restoreBoundVariablesForFills(
  node: any,
  boundVariables: any,
  propertyName: string,
  recognizedVariables: Map<string, Variable>,
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

    // Handle fills array binding
    // boundVariables.fills is an array where each element is an object with properties like { color: { _varRef: ... } }
    const fillsBinding = boundVariables[propertyName];
    if (Array.isArray(fillsBinding)) {
      for (
        let i = 0;
        i < fillsBinding.length && i < propertyValue.length;
        i++
      ) {
        const fillBinding = fillsBinding[i];
        if (fillBinding && typeof fillBinding === "object") {
          // Each fill binding can have properties like "color", "opacity", etc.
          // Initialize boundVariables on the fill if it doesn't exist
          if (!propertyValue[i].boundVariables) {
            propertyValue[i].boundVariables = {};
          }

          // Iterate over each property in the fill binding (e.g., "color")
          for (const [fillPropertyName, varInfo] of Object.entries(
            fillBinding,
          )) {
            if (isVariableReference(varInfo)) {
              const varRef = (varInfo as VariableReference)._varRef;
              if (varRef !== undefined) {
                const variable = recognizedVariables.get(String(varRef));
                if (variable) {
                  // Set the boundVariable with the correct structure
                  propertyValue[i].boundVariables[fillPropertyName] = {
                    type: "VARIABLE_ALIAS",
                    id: variable.id,
                  };
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(`Error restoring bound variables for ${propertyName}:`, error);
  }
}

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
          // Check if it's a variable reference
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
          }
        }
      } else {
        // Handle direct property binding
        let varAlias: BoundVariableInfo | null = null;

        // Check if it's a variable reference
        if (isVariableReference(varInfo)) {
          varAlias = resolveVariableReference(varInfo, variableTable);
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

    // If we have a variable table, use the new resolution system
    if (variableTable) {
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
  instanceTable: InstanceTable | null = null,
  recognizedVariables: Map<string, Variable> | null = null,
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
        // Process fills array - remove boundVariables that contain _varRef
        // We'll restore them properly after setting the fills
        let fills = nodeData.fills;
        if (Array.isArray(fills)) {
          fills = fills.map((fill: any) => {
            if (fill && typeof fill === "object") {
              // Create a copy without boundVariables (they may contain _varRef which is invalid)
              const { boundVariables, ...fillWithoutBoundVars } = fill;
              return fillWithoutBoundVars;
            }
            return fill;
          });
        }

        // Set fills without boundVariables first
        newNode.fills = fills;

        // Now restore bound variables for fills properly
        if (nodeData.boundVariables?.fills && recognizedVariables) {
          await restoreBoundVariablesForFills(
            newNode,
            nodeData.boundVariables,
            "fills",
            recognizedVariables,
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
            recognizedVariables
          ) {
            // Use recognizedVariables map to resolve variable references
            const varRef = (varInfo as VariableReference)._varRef;
            if (varRef !== undefined) {
              const variable = recognizedVariables.get(String(varRef));
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
            }
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

/**
 * Finds a unique page name by appending a numeric suffix if needed
 * @param baseName - The base name to use
 * @returns A unique page name that doesn't exist in the file
 */
async function findUniquePageName(baseName: string): Promise<string> {
  await figma.loadAllPagesAsync();
  const pages = figma.root.children;
  const existingNames = new Set(pages.map((page) => page.name));

  if (!existingNames.has(baseName)) {
    return baseName;
  }

  // Try with underscore and numeric suffix: <PageName>_1, <PageName>_2, etc.
  let counter = 1;
  let candidateName = `${baseName}_${counter}`;
  while (existingNames.has(candidateName)) {
    counter++;
    candidateName = `${baseName}_${counter}`;
  }

  return candidateName;
}

/**
 * Finds a unique collection name by appending an underscore and numeric suffix if needed
 * Format: <Collection Name>_<incrementing number>
 * @param baseName - The base name to use
 * @returns A unique collection name that doesn't exist in the file
 */
async function findUniqueCollectionName(baseName: string): Promise<string> {
  const localCollections =
    await figma.variables.getLocalVariableCollectionsAsync();
  const existingNames = new Set(localCollections.map((c) => c.name));

  if (!existingNames.has(baseName)) {
    return baseName;
  }

  // Try with underscore and numeric suffix: <Collection Name>_1, <Collection Name>_2, etc.
  let counter = 1;
  let candidateName = `${baseName}_${counter}`;
  while (existingNames.has(candidateName)) {
    counter++;
    candidateName = `${baseName}_${counter}`;
  }

  return candidateName;
}

/**
 * Finds a unique variable name within a collection by appending an underscore and numeric suffix if needed
 * Format: <Variable Name>_<incrementing number>
 * @param collection - The variable collection to check
 * @param baseName - The base variable name to use
 * @returns A unique variable name that doesn't exist in the collection
 */
async function findUniqueVariableName(
  collection: VariableCollection,
  baseName: string,
): Promise<string> {
  // Get all variables in the collection
  const existingVariableNames = new Set<string>();
  for (const varId of collection.variableIds) {
    try {
      const variable = await figma.variables.getVariableByIdAsync(varId);
      if (variable) {
        existingVariableNames.add(variable.name);
      }
    } catch {
      // Variable might not exist anymore, continue
      continue;
    }
  }

  if (!existingVariableNames.has(baseName)) {
    return baseName;
  }

  // Try with underscore and numeric suffix: <Variable Name>_1, <Variable Name>_2, etc.
  let counter = 1;
  let candidateName = `${baseName}_${counter}`;
  while (existingVariableNames.has(candidateName)) {
    counter++;
    candidateName = `${baseName}_${counter}`;
  }

  return candidateName;
}

/**
 * Checks if a variable's type matches the expected type
 * @param variable - The variable to check
 * @param expectedType - The expected variable type (COLOR, FLOAT, STRING, BOOLEAN)
 * @returns true if types match, false otherwise
 */
function variableTypeMatches(
  variable: Variable,
  expectedType: string,
): boolean {
  // Normalize types for comparison (case-insensitive)
  const variableType = variable.resolvedType.toUpperCase();
  const normalizedExpectedType = expectedType.toUpperCase();
  return variableType === normalizedExpectedType;
}

/**
 * Collection matching result
 */
interface CollectionMatchResult {
  collection: VariableCollection | null;
  matchType: "recognized" | "potential" | "none";
}

/**
 * Matches a collection entry to an existing local collection
 * For standard collections (Theme, Tokens, Layer): Check by normalized name first, always prompt
 * For other collections: Check by GUID first (recognized), then by exact name (potential match)
 */
async function matchCollection(
  entry: CollectionTableEntry,
): Promise<CollectionMatchResult> {
  const localCollections =
    await figma.variables.getLocalVariableCollectionsAsync();

  // Normalize the entry's collection name
  const normalizedEntryName = normalizeCollectionName(entry.collectionName);

  // For standard collections (Theme, Tokens, Layer), always check by normalized name first
  // and treat as potential match (will prompt user)
  if (isStandardCollection(entry.collectionName)) {
    for (const collection of localCollections) {
      const normalizedCollectionName = normalizeCollectionName(collection.name);
      if (normalizedCollectionName === normalizedEntryName) {
        // Found by normalized name - always prompt user for standard collections
        return {
          collection,
          matchType: "potential",
        };
      }
    }
    // No match found by normalized name
    return {
      collection: null,
      matchType: "none",
    };
  }

  // For non-standard collections, use GUID first, then exact name
  // First pass: Check by GUID (recognized collections)
  if (entry.collectionGuid) {
    for (const collection of localCollections) {
      const guid = collection.getSharedPluginData(
        "recursica",
        COLLECTION_GUID_KEY,
      );
      if (guid === entry.collectionGuid) {
        return {
          collection,
          matchType: "recognized",
        };
      }
    }
  }

  // Second pass: Check by exact name (potential matches for non-standard collections)
  for (const collection of localCollections) {
    if (collection.name === entry.collectionName) {
      return {
        collection,
        matchType: "potential",
      };
    }
  }

  return {
    collection: null,
    matchType: "none",
  };
}

export async function importPage(
  data: ImportPageData,
): Promise<ResponseMessage> {
  // Clear debug console at the start
  await debugConsole.clear();
  await debugConsole.log("=== Starting Page Import ===");

  // Track newly created collections for potential cleanup on failure
  const newlyCreatedCollections: VariableCollection[] = [];

  try {
    const jsonData = data.jsonData;

    if (!jsonData) {
      await debugConsole.error("JSON data is required");
      return {
        type: "importPage",
        success: false,
        error: true,
        message: "JSON data is required",
        data: {},
      };
    }

    await debugConsole.log("Starting import process");

    // Step 1: Validate metadata (check for guid and name)
    await debugConsole.log("Validating metadata...");
    if (!jsonData.metadata) {
      await debugConsole.error("Invalid JSON format. Expected metadata.");
      return {
        type: "importPage",
        success: false,
        error: true,
        message: "Invalid JSON format. Expected metadata.",
        data: {},
      };
    }

    const metadata = jsonData.metadata;
    if (!metadata.guid || typeof metadata.guid !== "string") {
      await debugConsole.error(
        "Invalid metadata. Missing or invalid 'guid' field.",
      );
      return {
        type: "importPage",
        success: false,
        error: true,
        message: "Invalid metadata. Missing or invalid 'guid' field.",
        data: {},
      };
    }

    if (!metadata.name || typeof metadata.name !== "string") {
      await debugConsole.error(
        "Invalid metadata. Missing or invalid 'name' field.",
      );
      return {
        type: "importPage",
        success: false,
        error: true,
        message: "Invalid metadata. Missing or invalid 'name' field.",
        data: {},
      };
    }

    await debugConsole.log(
      `Metadata validated: guid=${metadata.guid}, name=${metadata.name}`,
    );

    // Step 2: Expand JSON using expandJsonData
    await debugConsole.log("Loading string table...");
    if (!jsonData.stringTable) {
      await debugConsole.error(
        "Invalid JSON format. String table is required.",
      );
      return {
        type: "importPage",
        success: false,
        error: true,
        message: "Invalid JSON format. String table is required.",
        data: {},
      };
    }

    let stringTable: StringTable;
    try {
      stringTable = StringTable.fromTable(jsonData.stringTable);
      await debugConsole.log("String table loaded successfully");
    } catch (error) {
      const errorMessage = `Failed to load string table: ${error instanceof Error ? error.message : "Unknown error"}`;
      await debugConsole.error(errorMessage);
      return {
        type: "importPage",
        success: false,
        error: true,
        message: errorMessage,
        data: {},
      };
    }

    // Expand the entire JSON
    await debugConsole.log("Expanding JSON data...");
    const expandedJsonData = expandJsonData(jsonData, stringTable);
    await debugConsole.log("JSON expanded successfully");

    // Step 3: Load collection table
    await debugConsole.log("Loading collections table...");
    if (!expandedJsonData.collections) {
      await debugConsole.log("No collections table found in JSON");
      await debugConsole.log("=== Import Complete ===");
      return {
        type: "importPage",
        success: true,
        error: false,
        message: "Import complete (no collections to process)",
        data: { pageName: metadata.name },
      };
    }

    let collectionTable: CollectionTable;
    try {
      collectionTable = CollectionTable.fromTable(expandedJsonData.collections);
      await debugConsole.log(
        `Loaded collections table with ${collectionTable.getSize()} collection(s)`,
      );
    } catch (error) {
      const errorMessage = `Failed to load collections table: ${error instanceof Error ? error.message : "Unknown error"}`;
      await debugConsole.error(errorMessage);
      return {
        type: "importPage",
        success: false,
        error: true,
        message: errorMessage,
        data: {},
      };
    }

    // Step 4: Match collections (first pass: by GUID, second pass: by name)
    await debugConsole.log(
      "Matching collections with existing local collections...",
    );
    const collections = collectionTable.getTable();
    const recognizedCollections = new Map<string, VariableCollection>(); // entry index -> collection
    const potentialMatches = new Map<
      string,
      { entry: CollectionTableEntry; collection: VariableCollection }
    >(); // entry index -> {entry, collection}
    const collectionsToCreate = new Map<string, CollectionTableEntry>(); // entry index -> entry

    // Track all newly created collections for potential cleanup
    // (already initialized at function start, but keeping for clarity)

    for (const [index, entry] of Object.entries(collections)) {
      // Skip remote collections (they're handled separately)
      if (entry.isLocal === false) {
        await debugConsole.log(
          `Skipping remote collection: "${entry.collectionName}" (index ${index})`,
        );
        continue;
      }

      const match = await matchCollection(entry);

      if (match.matchType === "recognized") {
        await debugConsole.log(
          `✓ Recognized collection by GUID: "${entry.collectionName}" (index ${index})`,
        );
        recognizedCollections.set(index, match.collection!);
      } else if (match.matchType === "potential") {
        await debugConsole.log(
          `? Potential match by name: "${entry.collectionName}" (index ${index})`,
        );
        potentialMatches.set(index, {
          entry,
          collection: match.collection!,
        });
      } else {
        await debugConsole.log(
          `✗ No match found for collection: "${entry.collectionName}" (index ${index}) - will create new`,
        );
        collectionsToCreate.set(index, entry);
      }
    }

    await debugConsole.log(
      `Collection matching complete: ${recognizedCollections.size} recognized, ${potentialMatches.size} potential matches, ${collectionsToCreate.size} to create`,
    );

    // Step 5: Prompt user for potential matches
    if (potentialMatches.size > 0) {
      await debugConsole.log(
        `Prompting user for ${potentialMatches.size} potential match(es)...`,
      );
    }
    for (const [index, { entry, collection }] of potentialMatches.entries()) {
      try {
        // For standard collections, use normalized name; for others, use actual collection name
        const displayName = isStandardCollection(entry.collectionName)
          ? normalizeCollectionName(entry.collectionName)
          : collection.name;

        const message = `Found existing "${displayName}" variable collection. Should I use it?`;
        await debugConsole.log(
          `Prompting user about potential match: "${displayName}"`,
        );
        await pluginPrompt.prompt(message, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1, // No timeout
        });
        // User said Yes - use the potential match and store the collection reference
        await debugConsole.log(
          `✓ User confirmed: Using existing collection "${displayName}" (index ${index})`,
        );
        recognizedCollections.set(index, collection);

        // Ensure modes exist for this collection
        await ensureCollectionModes(collection, entry.modes);
        await debugConsole.log(
          `  ✓ Ensured modes for collection "${displayName}" (${entry.modes.length} mode(s))`,
        );
      } catch {
        // User said No or cancelled - mark for creation
        await debugConsole.log(
          `✗ User rejected: Will create new collection for "${entry.collectionName}" (index ${index})`,
        );
        collectionsToCreate.set(index, entry);
      }
    }

    // Step 6: Ensure modes exist for recognized collections (matched by GUID)
    // (Collections confirmed by user already had their modes ensured above)
    if (recognizedCollections.size > 0) {
      await debugConsole.log(
        `Ensuring modes exist for recognized collections...`,
      );
      for (const [index, collection] of recognizedCollections.entries()) {
        const entry = collections[index];
        if (entry) {
          // Check if modes were already ensured (for user-confirmed collections)
          // by checking if this collection was in potentialMatches
          const wasUserConfirmed = potentialMatches.has(index);
          if (!wasUserConfirmed) {
            // This was matched by GUID, ensure modes now
            await ensureCollectionModes(collection, entry.modes);
            await debugConsole.log(
              `  ✓ Ensured modes for collection "${collection.name}" (${entry.modes.length} mode(s))`,
            );
          }
        }
      }
    }

    // Step 7: Create collections that need to be created
    if (collectionsToCreate.size > 0) {
      await debugConsole.log(
        `Creating ${collectionsToCreate.size} new collection(s)...`,
      );
    }
    for (const [index, entry] of collectionsToCreate.entries()) {
      // Normalize the collection name for standard collections
      const normalizedName = normalizeCollectionName(entry.collectionName);
      const uniqueName = await findUniqueCollectionName(normalizedName);
      if (uniqueName !== normalizedName) {
        await debugConsole.log(
          `Creating collection: "${uniqueName}" (normalized: "${normalizedName}" - name conflict resolved)`,
        );
      } else {
        await debugConsole.log(`Creating collection: "${uniqueName}"`);
      }

      const newCollection =
        figma.variables.createVariableCollection(uniqueName);

      // Track newly created collection
      newlyCreatedCollections.push(newCollection);

      // Determine GUID to use
      let guidToStore: string | undefined;
      if (isStandardCollection(entry.collectionName)) {
        // For standard collections (Layer, Theme, Tokens), use fixed GUID
        const fixedGuid = getFixedGuidForCollection(entry.collectionName);
        if (fixedGuid) {
          guidToStore = fixedGuid;
        }
      } else if (entry.collectionGuid) {
        // Use GUID from entry for non-standard collections
        guidToStore = entry.collectionGuid;
      }

      // Store GUID if available
      if (guidToStore) {
        newCollection.setSharedPluginData(
          "recursica",
          COLLECTION_GUID_KEY,
          guidToStore,
        );
        await debugConsole.log(
          `  Stored GUID: ${guidToStore.substring(0, 8)}...`,
        );
      }

      // Ensure all modes exist
      await ensureCollectionModes(newCollection, entry.modes);
      await debugConsole.log(
        `  ✓ Created collection "${uniqueName}" with ${entry.modes.length} mode(s)`,
      );

      // Add the newly created collection to recognizedCollections map
      // so variables can find it when processing
      recognizedCollections.set(index, newCollection);
    }

    await debugConsole.log("Collection creation complete");

    // Step 8: Create variables from variable table
    await debugConsole.log("Loading variables table...");
    if (!expandedJsonData.variables) {
      await debugConsole.log("No variables table found in JSON");
      await debugConsole.log("=== Import Complete ===");
      return {
        type: "importPage",
        success: true,
        error: false,
        message: "Import complete (no variables to process)",
        data: { pageName: metadata.name },
      };
    }

    let variableTable: VariableTable;
    try {
      variableTable = VariableTable.fromTable(expandedJsonData.variables);
      await debugConsole.log(
        `Loaded variables table with ${variableTable.getSize()} variable(s)`,
      );
    } catch (error) {
      const errorMessage = `Failed to load variables table: ${error instanceof Error ? error.message : "Unknown error"}`;
      await debugConsole.error(errorMessage);
      return {
        type: "importPage",
        success: false,
        error: true,
        message: errorMessage,
        data: {},
      };
    }

    // Track all newly created variables for potential cleanup
    // Only track variables created in existing collections (not in newly created collections)
    // since deleting a collection automatically deletes all its variables
    const newlyCreatedVariables: Variable[] = [];

    // Map to store variable entry index -> Variable object for later reference
    const recognizedVariables = new Map<string, Variable>(); // entry index -> variable

    // Create a set of newly created collection IDs for quick lookup
    const newlyCreatedCollectionIds = new Set(
      newlyCreatedCollections.map((c) => c.id),
    );

    // Step 9: Match and create variables
    await debugConsole.log("Matching and creating variables in collections...");
    const variables = variableTable.getTable();

    // Track counts per collection
    const collectionStats = new Map<
      string,
      { collectionName: string; existing: number; created: number }
    >();

    for (const [index, entry] of Object.entries(variables)) {
      // Get the collection for this variable using _colRef
      if (entry._colRef === undefined) {
        continue;
      }

      const collection = recognizedCollections.get(String(entry._colRef));
      if (!collection) {
        continue;
      }

      // Initialize collection stats if not present
      if (!collectionStats.has(collection.id)) {
        collectionStats.set(collection.id, {
          collectionName: collection.name,
          existing: 0,
          created: 0,
        });
      }
      const stats = collectionStats.get(collection.id)!;

      // Check if this collection was newly created
      const isNewlyCreatedCollection = newlyCreatedCollectionIds.has(
        collection.id,
      );

      // Expand variable type if it's compressed (number -> string)
      let variableType: string;
      if (typeof entry.variableType === "number") {
        const typeMap: Record<number, string> = {
          1: "COLOR",
          2: "FLOAT",
          3: "STRING",
          4: "BOOLEAN",
        };
        variableType =
          typeMap[entry.variableType] || String(entry.variableType);
      } else {
        variableType = entry.variableType;
      }

      // Check if variable exists by name in the collection
      const existingVariable = await findVariableByName(
        collection,
        entry.variableName,
      );

      if (existingVariable) {
        // Variable exists - check if type matches
        if (variableTypeMatches(existingVariable, variableType)) {
          // Type matches - use existing variable
          recognizedVariables.set(index, existingVariable);
          stats.existing++;
        } else {
          // Type doesn't match - warn and create new variable with incremented name
          await debugConsole.warning(
            `Type mismatch for variable "${entry.variableName}" in collection "${collection.name}": expected ${variableType}, found ${existingVariable.resolvedType}. Creating new variable with incremented name.`,
          );
          const uniqueName = await findUniqueVariableName(
            collection,
            entry.variableName,
          );
          const newVariable = await createVariableFromEntry(
            {
              ...entry,
              variableName: uniqueName,
              variableType,
            },
            collection,
            variableTable,
            collectionTable,
          );
          // Only track if collection was not newly created (deleting collection deletes its variables)
          if (!isNewlyCreatedCollection) {
            newlyCreatedVariables.push(newVariable);
          }
          recognizedVariables.set(index, newVariable);
          stats.created++;
        }
      } else {
        // Variable doesn't exist - create it
        const newVariable = await createVariableFromEntry(
          {
            ...entry,
            variableType,
          },
          collection,
          variableTable,
          collectionTable,
        );
        // Only track if collection was not newly created (deleting collection deletes its variables)
        if (!isNewlyCreatedCollection) {
          newlyCreatedVariables.push(newVariable);
        }
        recognizedVariables.set(index, newVariable);
        stats.created++;
      }
    }

    // Print summary per collection
    await debugConsole.log("Variable processing complete:");
    let totalExisting = 0;
    let totalCreated = 0;
    for (const stats of collectionStats.values()) {
      await debugConsole.log(
        `  "${stats.collectionName}": ${stats.existing} existing, ${stats.created} created`,
      );
      totalExisting += stats.existing;
      totalCreated += stats.created;
    }
    // Step 10: Skip instance creation for now
    await debugConsole.log("Skipping instance creation (not yet implemented)");

    // Step 11: Create the main page
    await debugConsole.log("Creating page from JSON...");

    // Check if a page with the same GUID or name already exists
    await figma.loadAllPagesAsync();
    const allPages = figma.root.children;
    const PAGE_METADATA_KEY = "RecursicaPublishedMetadata";

    // Check for existing page by GUID
    let pageWithSameGuid: PageNode | null = null;
    for (const page of allPages) {
      const pageMetadataStr = page.getPluginData(PAGE_METADATA_KEY);
      if (pageMetadataStr) {
        try {
          const pageMetadata = JSON.parse(pageMetadataStr);
          if (pageMetadata.id === metadata.guid) {
            pageWithSameGuid = page;
            break;
          }
        } catch {
          // Invalid metadata, skip
          continue;
        }
      }
    }

    if (pageWithSameGuid) {
      await debugConsole.log(
        `Found existing page with same GUID: "${pageWithSameGuid.name}". Will create new page to avoid overwriting.`,
      );
    }

    // Check for existing page by name
    const existingPageByName = allPages.find((p) => p.name === metadata.name);
    if (existingPageByName) {
      await debugConsole.log(
        `Found existing page with same name: "${metadata.name}". Will create new page with unique name.`,
      );
    }

    // Determine the page name to use
    let pageName: string;
    if (pageWithSameGuid || existingPageByName) {
      // Use scratch page naming: __<PageName> or __<PageName>_<number>
      const scratchBaseName = `__${metadata.name}`;
      pageName = await findUniquePageName(scratchBaseName);
      await debugConsole.log(
        `Creating scratch page: "${pageName}" (will be renamed to "${metadata.name}" on success)`,
      );
    } else {
      pageName = metadata.name;
      await debugConsole.log(`Creating page: "${pageName}"`);
    }

    // Create the new page
    const newPage = figma.createPage();
    newPage.name = pageName;

    // Switch to the new page so user can watch it being built
    await figma.setCurrentPageAsync(newPage);
    await debugConsole.log(`Switched to page: "${pageName}"`);

    // Track newly created page for potential cleanup
    const newlyCreatedPages: PageNode[] = [newPage];

    // Create the page structure from JSON
    if (!expandedJsonData.pageData) {
      await debugConsole.error("No page data found in JSON");
      return {
        type: "importPage",
        success: false,
        error: true,
        message: "No page data found in JSON",
        data: {},
      };
    }

    // Recreate nodes from the page data
    // We need to pass the recognizedVariables map to resolve variable references
    await debugConsole.log("Recreating page structure...");
    const pageData = expandedJsonData.pageData;

    // Recreate children nodes
    if (pageData.children && Array.isArray(pageData.children)) {
      for (const childData of pageData.children) {
        const childNode = await recreateNodeFromData(
          childData,
          newPage,
          variableTable,
          collectionTable,
          null, // instanceTable - skipping for now
          recognizedVariables,
        );
        if (childNode) {
          newPage.appendChild(childNode);
        }
      }
    }

    await debugConsole.log("Page structure recreated successfully");

    // Store page metadata (GUID and name) on the page
    const pageMetadata = {
      _ver: 1,
      id: metadata.guid,
      name: metadata.name,
      version: metadata.version || 0,
      publishDate: new Date().toISOString(),
      history: {},
    };
    newPage.setPluginData(PAGE_METADATA_KEY, JSON.stringify(pageMetadata));
    await debugConsole.log(
      `Stored page metadata (GUID: ${metadata.guid.substring(0, 8)}...)`,
    );

    // If we used a scratch page name, rename it to the final name (with unique suffix if needed)
    if (pageName.startsWith("__")) {
      const finalName = await findUniquePageName(metadata.name);
      newPage.name = finalName;
      await debugConsole.log(
        `Renamed page from "${pageName}" to "${finalName}"`,
      );
    }

    await debugConsole.log("=== Import Complete ===");
    await debugConsole.log(
      `Successfully processed ${recognizedCollections.size} collection(s), ${totalExisting + totalCreated} variable(s), and created page "${newPage.name}"`,
    );

    return {
      type: "importPage",
      success: true,
      error: false,
      message: "Import completed successfully",
      data: { pageName: newPage.name },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    await debugConsole.error(`Import failed: ${errorMessage}`);
    if (error instanceof Error && error.stack) {
      await debugConsole.error(`Stack trace: ${error.stack}`);
    }
    console.error("Error importing page:", error);
    return {
      type: "importPage",
      success: false,
      error: true,
      message: errorMessage,
      data: {},
    };
  }
}
