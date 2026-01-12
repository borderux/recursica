// Plugin data keys for storing metadata on nodes
const ORIGINAL_NODE_ID_KEY = "RecursicaOriginalNodeId";

import type { ResponseMessage } from "../types/messages";
import {
  getDefaultsForNodeType,
  FRAME_DEFAULTS,
  TEXT_DEFAULTS,
} from "./parsers/nodeDefaults";
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
import { StyleTable } from "./parsers/styleTable";
import { ImageTable, isImageReference } from "./parsers/imageTable";
import { StringTable } from "./parsers/stringTable";
import { requestGuidFromUI } from "../utils/requestGuidFromUI";
import { debugConsole, type DebugConsoleMessage } from "./debugConsole";
import { checkCancellation } from "../utils/cancellation";
import { expandJsonData } from "../utils/jsonCompression";
import { pluginPrompt } from "../utils/pluginPrompt";
import { getComponentCleanName } from "../utils/getComponentCleanName";
import {
  normalizeCollectionName,
  isStandardCollection,
  getFixedGuidForCollection,
} from "../../const/CollectionConstants";
/* eslint-disable @typescript-eslint/no-explicit-any */

// Map to store component property binding data during import
// Key: component node ID, Value: { propertyIdMapping, nodeData }
const componentBindingData = new Map<
  string,
  {
    propertyIdMapping: Map<string, string>;
    nodeData: any;
  }
>();

export interface ImportPageData {
  jsonData: any; // The full exported JSON structure
  deleteScratchPagesOnFailure?: boolean; // If true, delete scratch pages if import fails (default: false)
  isMainPage?: boolean; // If true, always create a copy (no prompt). If false, prompt for existing pages.
  clearConsole?: boolean; // If true, clear the debug console before import (default: true for single page, false for multi-page)
  collectionChoices?: {
    tokens: "new" | "existing";
    theme: "new" | "existing";
    layers: "new" | "existing";
  }; // Wizard selections for collection matching (if provided, skips prompts)
  alwaysCreateCopy?: boolean; // If true, always create a copy (no prompt) even if page exists. Used for wizard imports.
  skipUniqueNaming?: boolean; // If true, skip adding _<number> suffix to page names. Used for wizard imports.
  constructionIcon?: string; // If provided, prepend this icon to page name. Used for wizard imports.
  preCreatedCollections?: Map<string, VariableCollection>; // Pre-created collections by normalized name (e.g., "Tokens", "Theme", "Layer")
  branch?: string; // Branch name if available (optional since imports can come from local files)
}

export interface DeferredNormalInstance {
  placeholderFrameId: string; // ID of placeholder frame created during import (for serialization)
  instanceEntry: any; // Instance table entry
  nodeData: any; // Original node data
  parentNodeId: string; // ID of parent node where placeholder was created (for serialization)
  parentPlaceholderId?: string; // ID of parent placeholder if parent is also a deferred instance
  instanceIndex: number; // Instance table index
  deferredInstanceIndex?: number; // Instance table index for deferred instance structure
}

export interface ImportPageResponseData {
  pageName: string;
  deferredInstances?: DeferredNormalInstance[]; // Normal instances that couldn't be resolved yet
  totalNodes: number;
}

export interface PageImportResult {
  componentGuid: string; // GUID from metadata
  componentPage: string; // Page name from metadata
  branch?: string; // Branch name if available
  importedAt: string; // ISO timestamp of when import occurred
  error?: string; // Error message if import failed
  logs: DebugConsoleMessage[]; // All logs from DebugConsole
  createdPageIds: string[]; // IDs of pages created during import
  createdCollectionIds: string[]; // IDs of collections created (only newly created)
  createdVariableIds: string[]; // IDs of variables created (only newly created)
  createdStyleIds: string[]; // IDs of styles created (only newly created)
  dependentComponents: Array<{
    guid: string;
    version: number | undefined;
    pageId: string;
  }>; // Dependent components (remote instances) with their versions and page IDs
}

/**
 * Sanitized version of PageImportResult for storage in plugin metadata
 * Excludes logs and other large fields to stay within plugin metadata size limits
 */
export type SanitizedPageImportResult = Omit<PageImportResult, "logs">;

/**
 * Creates a sanitized version of PageImportResult suitable for storage in plugin metadata
 * Removes logs and other large fields that could exceed size limits
 */
export function sanitizeImportResult(
  importResult: PageImportResult,
): SanitizedPageImportResult {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { logs, ...sanitized } = importResult;
  return sanitized;
}

/**
 * Service for page import operations (new implementation with default value handling)
 */

/**
 * Ensures a collection has all required modes by name
 * Creates modes if they don't exist
 * Handles the default mode that Figma creates automatically
 */
/**
 * Maps old mode names to new mode names after renaming
 * Used to handle cases where "Mode 1" was renamed to match exported mode names
 */
const modeNameMapping = new Map<string, string>();

async function ensureCollectionModes(
  collection: VariableCollection,
  exportedModeNames: string[], // Array of mode names
): Promise<void> {
  // When a collection is created, Figma automatically adds a default mode (usually "Mode 1")
  // If the default mode name is not in our exported modes, we should rename it to the first exported mode
  // This prevents having an extra "Mode 1" mode that shouldn't exist

  if (exportedModeNames.length === 0) {
    return; // No modes to ensure
  }

  // Check if there's a default mode that doesn't match any exported mode
  const defaultMode = collection.modes.find(
    (m) => m.name === "Mode 1" || m.name === "Default",
  );
  if (defaultMode && !exportedModeNames.includes(defaultMode.name)) {
    // Rename the default mode to the first exported mode name
    const firstExportedMode = exportedModeNames[0];
    try {
      const oldName = defaultMode.name;
      collection.renameMode(defaultMode.modeId, firstExportedMode);
      // Track the rename mapping so we can map "Mode 1" -> firstExportedMode when looking up modes
      modeNameMapping.set(`${collection.id}:${oldName}`, firstExportedMode);
      debugConsole.log(
        `  Renamed default mode "${oldName}" to "${firstExportedMode}"`,
      );
    } catch (error) {
      debugConsole.warning(
        `  Failed to rename default mode "${defaultMode.name}" to "${firstExportedMode}": ${error}`,
      );
    }
  }

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

// Removed unused function: findOrCreateCollection

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

// Removed unused function: validateVariableType

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
  debugConsole.log(
    `Restoring values for variable "${variable.name}" (type: ${variable.resolvedType}):`,
  );
  debugConsole.log(
    `  valuesByMode keys: ${Object.keys(valuesByMode).join(", ")}`,
  );
  for (const [modeName, value] of Object.entries(valuesByMode)) {
    // Find mode by name (valuesByMode now uses mode names as keys)
    // Check if we renamed this mode (e.g., "Mode 1" -> "0" or "Light")
    const mappedModeName =
      modeNameMapping.get(`${collection.id}:${modeName}`) || modeName;
    let mode = collection.modes.find((m) => m.name === mappedModeName);

    // If still not found, try the original modeName (in case it wasn't renamed)
    if (!mode) {
      mode = collection.modes.find((m) => m.name === modeName);
    }

    if (!mode) {
      debugConsole.warning(
        `Mode "${modeName}" (mapped: "${mappedModeName}") not found in collection "${collection.name}" for variable "${variable.name}". Available modes: ${collection.modes.map((m) => m.name).join(", ")}. Skipping.`,
      );
      continue;
    }
    const modeId = mode.modeId;
    try {
      if (value === null || value === undefined) {
        debugConsole.log(
          `  Mode "${modeName}": value is null/undefined, skipping`,
        );
        continue;
      }

      // Debug: Log the value type and content
      debugConsole.log(
        `  Mode "${modeName}": value type=${typeof value}, value=${JSON.stringify(value)}`,
      );

      // Handle primitive values
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        variable.setValueForMode(modeId, value);
        continue;
      }

      // Handle RGB color objects (for COLOR variable type)
      // Color values are objects with r, g, b properties (and optionally a for alpha)
      if (
        typeof value === "object" &&
        value !== null &&
        "r" in value &&
        "g" in value &&
        "b" in value &&
        typeof (value as any).r === "number" &&
        typeof (value as any).g === "number" &&
        typeof (value as any).b === "number"
      ) {
        // This is an RGB color object - set it directly
        // Figma expects RGB objects with r, g, b (0-1 range) and optional a (0-1 range)
        const colorValue = value as {
          r: number;
          g: number;
          b: number;
          a?: number;
        };

        // Ensure we have a valid RGB object (Figma requires r, g, b to be numbers between 0-1)
        const rgbValue: { r: number; g: number; b: number; a?: number } = {
          r: colorValue.r,
          g: colorValue.g,
          b: colorValue.b,
        };
        if (colorValue.a !== undefined) {
          rgbValue.a = colorValue.a;
        }

        variable.setValueForMode(modeId, rgbValue);

        // Immediately read back to verify it was set correctly
        const readBackValue = variable.valuesByMode[modeId];
        debugConsole.log(
          `  Set color value for "${variable.name}" mode "${modeName}": r=${rgbValue.r.toFixed(3)}, g=${rgbValue.g.toFixed(3)}, b=${rgbValue.b.toFixed(3)}${rgbValue.a !== undefined ? `, a=${rgbValue.a.toFixed(3)}` : ""}`,
        );
        debugConsole.log(`  Read back value: ${JSON.stringify(readBackValue)}`);

        // Verify the read-back value matches what we set
        if (
          typeof readBackValue === "object" &&
          readBackValue !== null &&
          "r" in readBackValue &&
          "g" in readBackValue &&
          "b" in readBackValue
        ) {
          const readBackRgb = readBackValue as {
            r: number;
            g: number;
            b: number;
          };
          const rMatch = Math.abs(readBackRgb.r - rgbValue.r) < 0.001;
          const gMatch = Math.abs(readBackRgb.g - rgbValue.g) < 0.001;
          const bMatch = Math.abs(readBackRgb.b - rgbValue.b) < 0.001;
          if (!rMatch || !gMatch || !bMatch) {
            debugConsole.warning(
              `  ⚠️ Value mismatch! Set: r=${rgbValue.r}, g=${rgbValue.g}, b=${rgbValue.b}, Read back: r=${readBackRgb.r}, g=${readBackRgb.g}, b=${readBackRgb.b}`,
            );
          } else {
            debugConsole.log(
              `  ✓ Value verified: read-back matches what we set`,
            );
          }
        } else {
          debugConsole.warning(
            `  ⚠️ Read-back value is not an RGB object: ${JSON.stringify(readBackValue)}`,
          );
        }
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
      // Log warning for any unhandled value types
      if (
        typeof value === "object" &&
        value !== null &&
        !("_varRef" in value) &&
        !("r" in value && "g" in value && "b" in value)
      ) {
        debugConsole.warning(
          `Unhandled value type for mode "${modeName}" in variable "${variable.name}": ${JSON.stringify(value)}`,
        );
      }
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
  debugConsole.log(
    `Creating variable "${entry.variableName}" (type: ${entry.variableType})`,
  );
  if (entry.valuesByMode) {
    debugConsole.log(
      `  valuesByMode has ${Object.keys(entry.valuesByMode).length} mode(s): ${Object.keys(entry.valuesByMode).join(", ")}`,
    );
    // Log the actual values for debugging
    for (const [modeName, value] of Object.entries(entry.valuesByMode)) {
      debugConsole.log(
        `  Mode "${modeName}": ${JSON.stringify(value)} (type: ${typeof value})`,
      );
    }
  } else {
    debugConsole.log(
      `  No valuesByMode found for variable "${entry.variableName}"`,
    );
  }

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

  // Verify the values were set correctly
  if (entry.valuesByMode && variable.valuesByMode) {
    debugConsole.log(`  Verifying values for "${entry.variableName}":`);
    for (const [modeName, expectedValue] of Object.entries(
      entry.valuesByMode,
    )) {
      const mode = collection.modes.find((m) => m.name === modeName);
      if (mode) {
        const actualValue = variable.valuesByMode[mode.modeId];
        debugConsole.log(
          `    Mode "${modeName}": expected=${JSON.stringify(expectedValue)}, actual=${JSON.stringify(actualValue)}`,
        );
      }
    }
  }

  return variable;
}

/**
 * Resolves a variable reference from the variable table, even if it's not in recognizedVariables
 * This is used as a fallback when a variable reference exists in the table but wasn't matched/created
 * during the initial variable matching phase
 */
async function resolveVariableFromTable(
  varRef: number,
  variableTable: VariableTable,
  collectionTable: CollectionTable,
  recognizedCollections: Map<string, VariableCollection>,
): Promise<Variable | null> {
  const entry = variableTable.getVariableByIndex(varRef);
  if (!entry) {
    return null;
  }
  // Get the collection
  if (entry._colRef === undefined) {
    return null;
  }

  const collection = recognizedCollections.get(String(entry._colRef));
  if (!collection) {
    return null;
  }

  // Try to find existing variable by name
  const existingVariable = await findVariableByName(
    collection,
    entry.variableName,
  );

  if (existingVariable) {
    // Check if type matches
    let variableType: string;
    if (typeof entry.variableType === "number") {
      const typeMap: Record<number, string> = {
        1: "COLOR",
        2: "FLOAT",
        3: "STRING",
        4: "BOOLEAN",
      };
      variableType = typeMap[entry.variableType] || String(entry.variableType);
    } else {
      variableType = entry.variableType;
    }

    if (variableTypeMatches(existingVariable, variableType)) {
      return existingVariable;
    }
  }

  // Variable doesn't exist or type doesn't match - create it
  return await createVariableFromEntry(
    entry,
    collection,
    variableTable,
    collectionTable,
  );
}

/**
 * Main orchestration function for resolving variable references during import
 * Handles finding/creating collections, matching variables by name, type validation,
 * and creating variables if needed
 * Uses collections table for mode mapping
 */
// Removed unused functions: resolveVariableReferenceOnImport, resolveVariableReference

/**
 * Restores bound variables to a node property
 * Handles both local and team variables, and variable table references
 */
/**
 * Restores bound variables for fills property using recognizedVariables map
 * For fills, boundVariables structure is: { fills: [{ color: { _varRef: ... } }, ...] }
 * Each fill item can have boundVariables with properties like "color"
 */
export async function restoreBoundVariablesForFills(
  node: any,
  boundVariables: any,
  propertyName: string,
  recognizedVariables: Map<string, Variable>,
  variableTable: VariableTable | null = null,
  collectionTable: CollectionTable | null = null,
  recognizedCollections: Map<string, VariableCollection> | null = null,
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
    // boundVariables.fills can be:
    // 1. An array where each element is an object with properties like { color: { _varRef: ... } }
    // 2. An array where each element is a direct variable reference like { _varRef: 57 }
    const fillsBinding = boundVariables[propertyName];
    if (Array.isArray(fillsBinding)) {
      for (
        let i = 0;
        i < fillsBinding.length && i < propertyValue.length;
        i++
      ) {
        const fillBinding = fillsBinding[i];
        if (fillBinding && typeof fillBinding === "object") {
          // Initialize boundVariables on the fill if it doesn't exist
          if (!propertyValue[i].boundVariables) {
            propertyValue[i].boundVariables = {};
          }

          // Check if this is a direct variable reference (e.g., { _varRef: 57 })
          // In Figma, binding an entire fill typically means binding the color property
          if (isVariableReference(fillBinding)) {
            const varRef = (fillBinding as VariableReference)._varRef;
            if (varRef !== undefined) {
              let variable = recognizedVariables.get(String(varRef));

              // Verify that the variable found in recognizedVariables matches the variable table entry
              if (variable && variableTable) {
                const varEntry = variableTable.getVariableByIndex(varRef);
                if (varEntry && variable.name !== varEntry.variableName) {
                  // Variable name doesn't match - the index points to a different variable
                  // Fall back to resolving from table by name
                  variable = undefined; // Clear so we resolve from table
                }
              }

              // If not found or name mismatch, try to resolve from variable table
              if (
                !variable &&
                variableTable &&
                collectionTable &&
                recognizedCollections
              ) {
                const resolvedVariable = await resolveVariableFromTable(
                  varRef,
                  variableTable,
                  collectionTable,
                  recognizedCollections,
                );
                variable = resolvedVariable || undefined;
                if (variable) {
                  // Add to recognizedVariables for future lookups
                  recognizedVariables.set(String(varRef), variable);
                }
              }

              if (variable) {
                // For direct variable references in fills array, bind to the color property
                // This is the most common case when a fill is bound to a variable
                propertyValue[i].boundVariables.color = {
                  type: "VARIABLE_ALIAS",
                  id: variable.id,
                };
              }
            }
          } else {
            // Each fill binding can have properties like "color", "opacity", etc.
            // Iterate over each property in the fill binding (e.g., "color")
            for (const [fillPropertyName, varInfo] of Object.entries(
              fillBinding,
            )) {
              if (isVariableReference(varInfo)) {
                const varRef = (varInfo as VariableReference)._varRef;
                if (varRef !== undefined) {
                  let variable = recognizedVariables.get(String(varRef));

                  // Verify that the variable found in recognizedVariables matches the variable table entry
                  if (variable && variableTable) {
                    const varEntry = variableTable.getVariableByIndex(varRef);
                    if (varEntry && variable.name !== varEntry.variableName) {
                      // Variable name doesn't match - the index points to a different variable
                      // Fall back to resolving from table by name
                      variable = undefined; // Clear so we resolve from table
                    }
                  }

                  // If not found or name mismatch, try to resolve from variable table
                  if (
                    !variable &&
                    variableTable &&
                    collectionTable &&
                    recognizedCollections
                  ) {
                    const resolvedVariable = await resolveVariableFromTable(
                      varRef,
                      variableTable,
                      collectionTable,
                      recognizedCollections,
                    );
                    variable = resolvedVariable || undefined;
                    if (variable) {
                      // Add to recognizedVariables for future lookups
                      recognizedVariables.set(String(varRef), variable);
                    }
                  }

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
    }
  } catch (error) {
    console.log(`Error restoring bound variables for ${propertyName}:`, error);
  }
}

// Removed unused function: bindVariableToNodeProperty

/**
 * Recursively checks if any node in the data has a style reference
 * Returns true if any _styleRef, _fillStyleRef, _effectStyleRef, or _gridStyleRef is found
 */
function checkForStyleReferences(nodeData: any): boolean {
  if (!nodeData || typeof nodeData !== "object") {
    return false;
  }

  // Check this node for style references
  if (
    nodeData._styleRef !== undefined ||
    nodeData._fillStyleRef !== undefined ||
    nodeData._effectStyleRef !== undefined ||
    nodeData._gridStyleRef !== undefined
  ) {
    return true;
  }

  // Check fills for style references
  if (Array.isArray(nodeData.fills)) {
    for (const fill of nodeData.fills) {
      if (fill && typeof fill === "object" && fill._styleRef !== undefined) {
        return true;
      }
    }
  }

  // Check backgrounds for style references
  if (Array.isArray(nodeData.backgrounds)) {
    for (const bg of nodeData.backgrounds) {
      if (bg && typeof bg === "object" && bg._styleRef !== undefined) {
        return true;
      }
    }
  }

  // Recursively check children
  if (Array.isArray(nodeData.children)) {
    for (const child of nodeData.children) {
      if (checkForStyleReferences(child)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Import styles from the style table
 */
async function importStyles(
  stylesData: Record<string, any>,
  recognizedVariables: Map<string, Variable>,
): Promise<{
  styleMapping: Map<number, BaseStyle>;
  newlyCreatedStyles: BaseStyle[];
}> {
  const styleMapping = new Map<number, BaseStyle>();
  const newlyCreatedStyles: BaseStyle[] = [];
  debugConsole.log(`Importing ${Object.keys(stylesData).length} styles...`);

  const sortedEntries = Object.entries(stylesData).sort(
    (a, b) => parseInt(a[0], 10) - parseInt(b[0], 10),
  );

  for (const [indexStr, styleData] of sortedEntries) {
    const index = parseInt(indexStr, 10);
    const styleName = styleData.name || "Unnamed Style";
    const styleType = styleData.type;

    // Check if a style with the same name and type already exists
    let existingStyle: BaseStyle | null = null;
    switch (styleType) {
      case "TEXT":
        existingStyle =
          (await figma.getLocalTextStylesAsync()).find(
            (s) => s.name === styleName,
          ) || null;
        break;
      case "PAINT":
        existingStyle =
          (await figma.getLocalPaintStylesAsync()).find(
            (s) => s.name === styleName,
          ) || null;
        break;
      case "EFFECT":
        existingStyle =
          (await figma.getLocalEffectStylesAsync()).find(
            (s) => s.name === styleName,
          ) || null;
        break;
      case "GRID":
        existingStyle =
          (await figma.getLocalGridStylesAsync()).find(
            (s) => s.name === styleName,
          ) || null;
        break;
    }

    if (existingStyle) {
      debugConsole.log(
        `  Skipping creation of style "${styleName}" (type: ${styleType}) as it already exists. Reusing existing style.`,
      );
      styleMapping.set(index, existingStyle);
      continue;
    }

    let newStyle: BaseStyle | null = null;
    try {
      switch (styleType) {
        case "TEXT":
          newStyle = await createTextStyle(styleData, recognizedVariables);
          break;
        case "PAINT":
          newStyle = await createPaintStyle(styleData, recognizedVariables);
          break;
        case "EFFECT":
          newStyle = await createEffectStyle(styleData, recognizedVariables);
          break;
        case "GRID":
          newStyle = await createGridStyle(styleData, recognizedVariables);
          break;
        default:
          debugConsole.warning(
            `  Unknown style type "${styleType}" for style "${styleName}". Skipping.`,
          );
          break;
      }
      if (newStyle) {
        styleMapping.set(index, newStyle);
        newlyCreatedStyles.push(newStyle);
        debugConsole.log(
          `  ✓ Created style "${styleName}" (type: ${styleType})`,
        );
      }
    } catch (error) {
      debugConsole.warning(
        `  Failed to create style "${styleName}" (type: ${styleType}): ${error}`,
      );
    }
  }
  return { styleMapping, newlyCreatedStyles };
}

/**
 * Create a text style from serialized data
 */
async function createTextStyle(
  styleData: any,
  recognizedVariables: Map<string, Variable>,
): Promise<TextStyle> {
  const style = figma.createTextStyle();
  style.name = styleData.name;

  if (styleData.textStyle) {
    // Apply properties (only non-defaults should be in styleData)
    // IMPORTANT: Load font FIRST before setting fontSize or other font-dependent properties
    if (
      styleData.textStyle.fontName !== undefined &&
      !styleData.textStyle.boundVariables?.fontName
    ) {
      await figma.loadFontAsync(styleData.textStyle.fontName);
      style.fontName = styleData.textStyle.fontName;
    }
    // Now we can set fontSize after font is loaded
    if (
      styleData.textStyle.fontSize !== undefined &&
      !styleData.textStyle.boundVariables?.fontSize
    ) {
      style.fontSize = styleData.textStyle.fontSize;
    }
    if (
      styleData.textStyle.letterSpacing !== undefined &&
      !styleData.textStyle.boundVariables?.letterSpacing
    ) {
      style.letterSpacing = styleData.textStyle.letterSpacing;
    }
    if (
      styleData.textStyle.lineHeight !== undefined &&
      !styleData.textStyle.boundVariables?.lineHeight
    ) {
      style.lineHeight = styleData.textStyle.lineHeight;
    }
    if (
      styleData.textStyle.textCase !== undefined &&
      !styleData.textStyle.boundVariables?.textCase
    ) {
      style.textCase = styleData.textStyle.textCase;
    }
    if (
      styleData.textStyle.textDecoration !== undefined &&
      !styleData.textStyle.boundVariables?.textDecoration
    ) {
      style.textDecoration = styleData.textStyle.textDecoration;
    }
    if (
      styleData.textStyle.paragraphSpacing !== undefined &&
      !styleData.textStyle.boundVariables?.paragraphSpacing
    ) {
      style.paragraphSpacing = styleData.textStyle.paragraphSpacing;
    }
    if (
      styleData.textStyle.paragraphIndent !== undefined &&
      !styleData.textStyle.boundVariables?.paragraphIndent
    ) {
      style.paragraphIndent = styleData.textStyle.paragraphIndent;
    }

    // Handle bound variables
    if (styleData.textStyle.boundVariables) {
      for (const [property, varRef] of Object.entries(
        styleData.textStyle.boundVariables,
      )) {
        // varRef might be a variable table index (_varRef format) or variable ID
        // Resolve from recognizedVariables
        let variable: Variable | undefined;
        if (
          typeof varRef === "object" &&
          varRef !== null &&
          "_varRef" in varRef
        ) {
          // Variable table reference format
          const varRefIndex = (varRef as any)._varRef;
          variable = recognizedVariables.get(String(varRefIndex));
        } else {
          // Direct variable ID or string reference
          const varKey = typeof varRef === "string" ? varRef : String(varRef);
          variable = recognizedVariables.get(varKey);
        }
        if (variable) {
          try {
            // setBoundVariable expects a Variable object, not an ID
            style.setBoundVariable(property as any, variable);
          } catch (error) {
            debugConsole.warning(
              `Could not bind variable to text style property "${property}": ${error}`,
            );
          }
        }
      }
    }
  }

  return style;
}

/**
 * Create a paint style from serialized data
 */
async function createPaintStyle(
  styleData: any,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _recognizedVariables: Map<string, Variable>,
): Promise<PaintStyle> {
  const style = figma.createPaintStyle();
  style.name = styleData.name;

  if (styleData.paintStyle && styleData.paintStyle.paints) {
    style.paints = styleData.paintStyle.paints;
  }

  // Handle bound variables (would be in paints themselves)
  // This is handled at the fill level during export/import

  return style;
}

/**
 * Create an effect style from serialized data
 */
async function createEffectStyle(
  styleData: any,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _recognizedVariables: Map<string, Variable>,
): Promise<EffectStyle> {
  const style = figma.createEffectStyle();
  style.name = styleData.name;

  if (styleData.effectStyle && styleData.effectStyle.effects) {
    style.effects = styleData.effectStyle.effects;
  }

  return style;
}

/**
 * Create a grid style from serialized data
 */
async function createGridStyle(
  styleData: any,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _recognizedVariables: Map<string, Variable>,
): Promise<GridStyle> {
  const style = figma.createGridStyle();
  style.name = styleData.name;

  if (styleData.gridStyle && styleData.gridStyle.layoutGrids) {
    style.layoutGrids = styleData.gridStyle.layoutGrids;
  }

  return style;
}

/**
 * Applies default values to a newly created node
 * @param skipPaddingDefaults - If true, skip setting default padding/itemSpacing values
 *                              (used when bound variables will be set for these properties)
 */
function applyDefaultsToNode(
  node: any,
  nodeType: string,
  skipPaddingDefaults: boolean = false,
): void {
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
    nodeType === "COMPONENT_SET" ||
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
    // Skip padding defaults if bound variables will be set (prevents interference)
    if (!skipPaddingDefaults) {
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
      if (node.counterAxisSpacing === undefined) {
        node.counterAxisSpacing = frameDefaults.counterAxisSpacing;
      }
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
/**
 * Note: The Figma Plugin API uses the same constraint values as we export:
 * MIN, CENTER, MAX, STRETCH, SCALE
 * No mapping is needed - we can use the exported values directly.
 */

/**
 * Base64 decode function for Figma plugin environment
 * (atob() is not available in Figma plugins)
 */
function base64Decode(base64: string): Uint8Array {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const result: number[] = [];
  let i = 0;
  base64 = base64.replace(/[^A-Za-z0-9+/]/g, "");

  while (i < base64.length) {
    const encoded1 = chars.indexOf(base64.charAt(i++));
    const encoded2 = chars.indexOf(base64.charAt(i++));
    const encoded3 = chars.indexOf(base64.charAt(i++));
    const encoded4 = chars.indexOf(base64.charAt(i++));

    const bitmap =
      (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;

    result.push((bitmap >> 16) & 255);
    if (encoded3 !== 64) result.push((bitmap >> 8) & 255);
    if (encoded4 !== 64) result.push(bitmap & 255);
  }

  return new Uint8Array(result);
}

/**
 * Converts Base64 image data to Uint8Array and creates a Figma image
 * Returns the image hash that can be used in fills/backgrounds
 * Handles both raw base64 strings and data URL format (data:image/png;base64,...)
 */
async function restoreImageFromBase64(
  base64Data: string,
): Promise<string | null> {
  try {
    // Strip data URL prefix if present (e.g., "data:image/png;base64,")
    let base64String = base64Data;
    if (base64Data.startsWith("data:")) {
      const commaIndex = base64Data.indexOf(",");
      if (commaIndex !== -1) {
        base64String = base64Data.substring(commaIndex + 1);
      }
    }

    // Convert Base64 to Uint8Array using manual decoder
    const bytes = base64Decode(base64String);

    // Create image in Figma and get hash
    const imageHash = await figma.createImage(bytes).hash;
    debugConsole.log(
      `  DEBUG: Successfully restored image with hash: ${imageHash}`,
    );
    return imageHash;
  } catch (error) {
    debugConsole.warning(`Failed to restore image from Base64: ${error}`);
    return null;
  }
}

/**
 * Restores image references in fills or backgrounds array
 * Replaces _imgRef with actual imageHash from image table
 */
async function restoreImageReferences(
  fillsOrBackgrounds: any[],
  imageTable: ImageTable | null,
): Promise<any[]> {
  if (!imageTable || !Array.isArray(fillsOrBackgrounds)) {
    return fillsOrBackgrounds;
  }

  return Promise.all(
    fillsOrBackgrounds.map(async (item: any) => {
      if (!item || typeof item !== "object") {
        return item;
      }

      // Check if this item has an image reference
      if (isImageReference(item)) {
        const imageIndex = item._imgRef;
        const imageEntry = imageTable.getImageByIndex(imageIndex);

        if (imageEntry) {
          try {
            // Restore image from Base64
            const imageHash = await restoreImageFromBase64(
              imageEntry.imageData,
            );

            if (imageHash) {
              // Create new fill/background object with imageHash
              // Preserve all original properties (type, visible, opacity, blendMode, etc.)
              const restored: any = {
                ...item,
                type: "IMAGE",
                imageHash: imageHash,
              };
              // Remove _imgRef since we've restored the imageHash
              delete restored._imgRef;
              debugConsole.log(
                `✓ Restored image from index ${imageIndex} (hash: ${imageHash.substring(0, 20)}...)`,
              );
              return restored;
            } else {
              debugConsole.warning(
                `Failed to restore image at index ${imageIndex}, keeping _imgRef`,
              );
              return item;
            }
          } catch (error) {
            debugConsole.warning(
              `Error restoring image at index ${imageIndex}: ${error}`,
            );
            return item;
          }
        } else {
          debugConsole.warning(
            `Image at index ${imageIndex} not found in image table`,
          );
          return item;
        }
      }

      return item;
    }),
  );
}

export async function recreateNodeFromData(
  nodeData: any,
  parentNode: any,
  variableTable: VariableTable | null = null,
  collectionTable: CollectionTable | null = null,
  instanceTable: InstanceTable | null = null,
  recognizedVariables: Map<string, Variable> | null = null,
  nodeIdMapping: Map<string, any> | null = null, // old node ID -> new node
  isRemoteStructure: boolean = false, // If true, don't resolve instance references, just recreate as frames
  remoteComponentMap: Map<number, ComponentNode> | null = null, // instance table index -> component node on REMOTES page
  deferredInstances: DeferredNormalInstance[] | null = null, // Array to collect deferred normal instances
  parentNodeData: any = null, // Parent's nodeData - used to check if parent has auto-layout
  recognizedCollections: Map<string, VariableCollection> | null = null, // For resolving variables from table
  placeholderFrameIds: Set<string> | null = null, // Track placeholder frame IDs as we create them
  currentPlaceholderId?: string, // ID of placeholder we're currently inside (for nested deferred instances)
  styleMapping: Map<number, BaseStyle> | null = null, // Map of old style table index -> new style instance
  imageTable: ImageTable | null = null, // Image table for restoring images from Base64
): Promise<any> {
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
      // Check if component already exists in mapping (might have been created in first pass)
      if (nodeData.id && nodeIdMapping && nodeIdMapping.has(nodeData.id)) {
        newNode = nodeIdMapping.get(nodeData.id);
        debugConsole.log(
          `Reusing existing COMPONENT "${nodeData.name || "Unnamed"}" (ID: ${nodeData.id.substring(0, 8)}...)`,
        );
        // If component already has children, it was fully created in a previous second-pass iteration
        // We'll skip children processing below - just use the existing component as-is
        // If component has no children yet, it was created in first pass and needs children processing
      } else {
        newNode = figma.createComponent();
        debugConsole.log(
          `Created COMPONENT "${nodeData.name || "Unnamed"}" (ID: ${nodeData.id ? nodeData.id.substring(0, 8) + "..." : "no ID"})`,
        );

        // Add component property definitions using addComponentProperty() method
        // CRITICAL: Capture the return value (unique property ID) for binding restoration
        const propertyIdMapping = new Map<string, string>(); // old property ID -> new property ID
        if (nodeData.componentPropertyDefinitions) {
          const propDefs = nodeData.componentPropertyDefinitions;
          let addedCount = 0;
          let failedCount = 0;

          for (const [propName, propDef] of Object.entries(propDefs)) {
            try {
              // propDef format: { type: number | string, defaultValue?: any }
              // Map type numbers or strings to Figma API type strings
              const typeValue = (propDef as any).type;
              let propType:
                | "TEXT"
                | "BOOLEAN"
                | "INSTANCE_SWAP"
                | "VARIANT"
                | null = null;

              // Handle both numeric and string types (string table might expand numbers to strings)
              if (typeof typeValue === "string") {
                // Already a string - validate it's a valid type
                if (
                  typeValue === "TEXT" ||
                  typeValue === "BOOLEAN" ||
                  typeValue === "INSTANCE_SWAP" ||
                  typeValue === "VARIANT"
                ) {
                  propType = typeValue;
                }
              } else if (typeof typeValue === "number") {
                // Numeric type - map to string
                const typeMap: Record<
                  number,
                  "TEXT" | "BOOLEAN" | "INSTANCE_SWAP" | "VARIANT"
                > = {
                  2: "TEXT", // Text property
                  25: "BOOLEAN", // Boolean property
                  27: "INSTANCE_SWAP", // Instance swap property
                  26: "VARIANT", // Variant property
                };
                propType = typeMap[typeValue] || null;
              }

              if (!propType) {
                debugConsole.warning(
                  `  Unknown property type ${typeValue} (${typeof typeValue}) for property "${propName}" in component "${nodeData.name || "Unnamed"}"`,
                );
                failedCount++;
                continue;
              }

              const defaultValue = (propDef as any).defaultValue;
              // Property names in JSON may include IDs (e.g., "Show trailing icon#318:0")
              // Extract just the property name part (before the #)
              const cleanPropName = propName.split("#")[0];

              // CRITICAL: Capture the return value - this is the unique property ID (e.g., "Component name#12:34")
              // We need this ID (not just the name) to set componentPropertyReferences
              const newPropertyId = newNode.addComponentProperty(
                cleanPropName,
                propType,
                defaultValue,
              );

              // Store mapping: old property ID (from JSON) -> new property ID (from addComponentProperty)
              propertyIdMapping.set(propName, newPropertyId);
              debugConsole.log(
                `  [BINDING] Added component property "${cleanPropName}" with ID "${newPropertyId}" (was "${propName}" in JSON)`,
              );
              addedCount++;
            } catch (error) {
              debugConsole.warning(
                `  Failed to add component property "${propName}" to "${nodeData.name || "Unnamed"}": ${error}`,
              );
              failedCount++;
            }
          }

          if (addedCount > 0) {
            debugConsole.log(
              `  Added ${addedCount} component property definition(s) to "${nodeData.name || "Unnamed"}"${failedCount > 0 ? ` (${failedCount} failed)` : ""}`,
            );
          }
        }

        // Store property ID mapping in external Map for later use in post-processing
        // This allows us to restore componentPropertyReferences after children are added
        // We can't attach properties directly to Figma nodes (they're not extensible)
        if (propertyIdMapping.size > 0) {
          componentBindingData.set(newNode.id, {
            propertyIdMapping,
            nodeData,
          });
        }
      }
      break;
    case "COMPONENT_SET": {
      // COMPONENT_SET cannot be created directly, but we can create individual components
      // and then combine them using figma.combineAsVariants()
      const componentChildren = nodeData.children
        ? nodeData.children.filter((c: any) => c.type === "COMPONENT").length
        : 0;
      debugConsole.log(
        `Creating COMPONENT_SET "${nodeData.name || "Unnamed"}" by combining ${componentChildren} component variant(s)`,
      );

      // First, create all component children as temporary nodes
      // We'll combine them into a component set after they're all created
      const componentVariants: ComponentNode[] = [];
      let tempParent: FrameNode | null = null;

      if (nodeData.children && Array.isArray(nodeData.children)) {
        // Create a temporary parent frame to hold components while we create them
        tempParent = figma.createFrame();
        tempParent.name = `_temp_${nodeData.name || "COMPONENT_SET"}`;
        tempParent.visible = false; // Hide the temporary frame

        // Add tempParent to a page so components can be created inside it
        // Use parentNode if it's a page, otherwise use current page
        const pageParent =
          parentNode?.type === "PAGE" ? parentNode : figma.currentPage;
        pageParent.appendChild(tempParent);

        // Create each component variant
        for (const childData of nodeData.children) {
          if (childData.type === "COMPONENT" && !childData._truncated) {
            try {
              const componentNode = await recreateNodeFromData(
                childData,
                tempParent, // Use temp parent for now
                variableTable,
                collectionTable,
                instanceTable,
                recognizedVariables,
                nodeIdMapping,
                isRemoteStructure,
                remoteComponentMap,
                deferredInstances, // Pass deferredInstances through for component set creation
                null, // parentNodeData - not needed here, will be passed correctly in recursive calls
                recognizedCollections,
                placeholderFrameIds, // Pass placeholderFrameIds through for component set creation
                undefined, // currentPlaceholderId - component set creation is not inside a placeholder
                styleMapping, // Pass styleMapping to apply styles
                imageTable, // Pass imageTable to restore images
              );
              if (componentNode && componentNode.type === "COMPONENT") {
                componentVariants.push(componentNode);
                debugConsole.log(
                  `  Created component variant: "${componentNode.name || "Unnamed"}"`,
                );
              }
            } catch (error) {
              debugConsole.warning(
                `  Failed to create component variant "${childData.name || "Unnamed"}": ${error}`,
              );
            }
          }
        }
      }

      // Now combine the components into a component set
      if (componentVariants.length > 0) {
        try {
          // combineAsVariants requires a parent node
          // We'll use the parentNode if available, otherwise create a temporary page
          const combineParent = parentNode || figma.currentPage;
          const componentSet = figma.combineAsVariants(
            componentVariants,
            combineParent,
          );

          // Set the name on the component set
          if (nodeData.name) {
            componentSet.name = nodeData.name;
          }

          // Apply position properties from nodeData to the component set
          if (nodeData.x !== undefined) {
            componentSet.x = nodeData.x;
          }
          if (nodeData.y !== undefined) {
            componentSet.y = nodeData.y;
          }

          // Apply auto-layout properties to the component set
          // COMPONENT_SET nodes support auto-layout properties just like FRAME/COMPONENT nodes
          if (nodeData.layoutMode !== undefined) {
            componentSet.layoutMode = nodeData.layoutMode;
          }

          // Set itemSpacing immediately after layoutMode (if not bound to a variable)
          if (
            nodeData.layoutMode !== undefined &&
            nodeData.layoutMode !== "NONE" &&
            nodeData.itemSpacing !== undefined
          ) {
            const hasBoundVariableForItemSpacing =
              nodeData.boundVariables &&
              typeof nodeData.boundVariables === "object" &&
              nodeData.boundVariables.itemSpacing;

            if (!hasBoundVariableForItemSpacing) {
              componentSet.itemSpacing = nodeData.itemSpacing;
            }
          }

          // Set wrap (must be set after layoutMode)
          if (nodeData.layoutWrap !== undefined) {
            componentSet.layoutWrap = nodeData.layoutWrap;
          }

          // Set sizing modes
          if (nodeData.primaryAxisSizingMode !== undefined) {
            componentSet.primaryAxisSizingMode = nodeData.primaryAxisSizingMode;
          }
          if (nodeData.counterAxisSizingMode !== undefined) {
            componentSet.counterAxisSizingMode = nodeData.counterAxisSizingMode;
          }

          // Set alignment
          if (nodeData.primaryAxisAlignItems !== undefined) {
            componentSet.primaryAxisAlignItems = nodeData.primaryAxisAlignItems;
          }
          if (nodeData.counterAxisAlignItems !== undefined) {
            componentSet.counterAxisAlignItems = nodeData.counterAxisAlignItems;
          }

          // Set padding (check for bound variables first)
          const hasBoundVariables =
            nodeData.boundVariables &&
            typeof nodeData.boundVariables === "object";
          if (
            nodeData.paddingLeft !== undefined &&
            (!hasBoundVariables || !nodeData.boundVariables.paddingLeft)
          ) {
            componentSet.paddingLeft = nodeData.paddingLeft;
          }
          if (
            nodeData.paddingRight !== undefined &&
            (!hasBoundVariables || !nodeData.boundVariables.paddingRight)
          ) {
            componentSet.paddingRight = nodeData.paddingRight;
          }
          if (
            nodeData.paddingTop !== undefined &&
            (!hasBoundVariables || !nodeData.boundVariables.paddingTop)
          ) {
            componentSet.paddingTop = nodeData.paddingTop;
          }
          if (
            nodeData.paddingBottom !== undefined &&
            (!hasBoundVariables || !nodeData.boundVariables.paddingBottom)
          ) {
            componentSet.paddingBottom = nodeData.paddingBottom;
          }

          // Set counterAxisSpacing if present
          if (nodeData.counterAxisSpacing !== undefined) {
            componentSet.counterAxisSpacing = nodeData.counterAxisSpacing;
          }

          // Apply bound variables for auto-layout properties if present
          if (
            nodeData.boundVariables &&
            typeof nodeData.boundVariables === "object" &&
            (variableTable || recognizedVariables)
          ) {
            const layoutBoundVars = [
              "paddingLeft",
              "paddingRight",
              "paddingTop",
              "paddingBottom",
              "itemSpacing",
            ];
            for (const propName of layoutBoundVars) {
              if (nodeData.boundVariables[propName]) {
                const varRef = nodeData.boundVariables[propName];
                let variable: Variable | null = null;

                if (
                  varRef._varRef !== undefined &&
                  variableTable &&
                  recognizedVariables
                ) {
                  const varIndex = varRef._varRef;
                  const varEntry = variableTable.getVariableByIndex(varIndex);
                  if (varEntry) {
                    // VariableTableEntry has variableName - search recognizedVariables by name
                    const varName = varEntry.variableName;
                    for (const varObj of recognizedVariables.values()) {
                      if (varObj.name === varName) {
                        variable = varObj;
                        break;
                      }
                    }
                  }
                }

                if (variable) {
                  const alias: VariableAlias = {
                    type: "VARIABLE_ALIAS",
                    id: variable.id,
                  };
                  try {
                    (componentSet as any).setBoundVariable(propName, alias);
                  } catch (error) {
                    debugConsole.warning(
                      `  Error setting bound variable for ${propName} on COMPONENT_SET "${nodeData.name || "Unnamed"}": ${error instanceof Error ? error.message : String(error)}`,
                    );
                  }
                }
              }
            }
          }

          // Remove the temporary parent frame (components are now in the component set)
          if (tempParent && tempParent.parent) {
            tempParent.remove();
          }

          // IMPORTANT: After combining into COMPONENT_SET, variants are now children of the auto-layout COMPONENT_SET
          // At this point, we can set layoutSizingHorizontal/layoutSizingVertical on each variant if needed
          // Check each variant's childData to see if it has minWidth/maxWidth or minHeight/maxHeight bound to variables
          if (
            componentSet.layoutMode !== undefined &&
            componentSet.layoutMode !== "NONE"
          ) {
            const isHorizontal = componentSet.layoutMode === "HORIZONTAL";
            for (
              let i = 0;
              i < componentSet.children.length && i < nodeData.children.length;
              i++
            ) {
              const variant = componentSet.children[i];
              const variantData = nodeData.children[i];

              if (
                variant.type === "COMPONENT" &&
                variantData &&
                variantData.type === "COMPONENT"
              ) {
                const boundVars = variantData.boundVariables;
                const hasBoundVars = boundVars && typeof boundVars === "object";

                // For HORIZONTAL layout: layoutSizingHorizontal controls width, layoutSizingVertical controls height
                // For VERTICAL layout: layoutSizingHorizontal controls height, layoutSizingVertical controls width

                // Check for width constraints (minWidth/maxWidth)
                // For horizontal layout, width is controlled by layoutSizingHorizontal
                // For vertical layout, width is controlled by layoutSizingVertical
                const hasWidthConstraints =
                  hasBoundVars && (boundVars.minWidth || boundVars.maxWidth);

                if (hasWidthConstraints) {
                  try {
                    if (isHorizontal) {
                      (variant as any).layoutSizingHorizontal = "FILL";
                      debugConsole.log(
                        `  ✓ Set layoutSizingHorizontal to "FILL" for variant "${variant.name}" (minWidth/maxWidth are bound, horizontal layout)`,
                      );
                    } else {
                      (variant as any).layoutSizingVertical = "FILL";
                      debugConsole.log(
                        `  ✓ Set layoutSizingVertical to "FILL" for variant "${variant.name}" (minWidth/maxWidth are bound, vertical layout)`,
                      );
                    }
                  } catch (error) {
                    debugConsole.warning(
                      `  ⚠️ Failed to set layout sizing for variant "${variant.name}" (width constraints): ${error}`,
                    );
                  }
                }

                // Check for height constraints (minHeight/maxHeight)
                // For horizontal layout, height is controlled by layoutSizingVertical
                // For vertical layout, height is controlled by layoutSizingHorizontal
                const hasHeightConstraints =
                  hasBoundVars && (boundVars.minHeight || boundVars.maxHeight);

                if (hasHeightConstraints) {
                  try {
                    if (isHorizontal) {
                      (variant as any).layoutSizingVertical = "FILL";
                      debugConsole.log(
                        `  ✓ Set layoutSizingVertical to "FILL" for variant "${variant.name}" (minHeight/maxHeight are bound, horizontal layout)`,
                      );
                    } else {
                      (variant as any).layoutSizingHorizontal = "FILL";
                      debugConsole.log(
                        `  ✓ Set layoutSizingHorizontal to "FILL" for variant "${variant.name}" (minHeight/maxHeight are bound, vertical layout)`,
                      );
                    }
                  } catch (error) {
                    debugConsole.warning(
                      `  ⚠️ Failed to set layout sizing for variant "${variant.name}" (height constraints): ${error}`,
                    );
                  }
                }

                // Also set layoutSizingHorizontal/layoutSizingVertical if explicitly in the variant data
                if ((variantData as any).layoutSizingHorizontal !== undefined) {
                  try {
                    (variant as any).layoutSizingHorizontal = (
                      variantData as any
                    ).layoutSizingHorizontal;
                    debugConsole.log(
                      `  ✓ Set layoutSizingHorizontal to "${(variantData as any).layoutSizingHorizontal}" for variant "${variant.name}"`,
                    );
                  } catch (error) {
                    debugConsole.warning(
                      `  ⚠️ Failed to set layoutSizingHorizontal for variant "${variant.name}": ${error}`,
                    );
                  }
                }

                if ((variantData as any).layoutSizingVertical !== undefined) {
                  try {
                    (variant as any).layoutSizingVertical = (
                      variantData as any
                    ).layoutSizingVertical;
                    debugConsole.log(
                      `  ✓ Set layoutSizingVertical to "${(variantData as any).layoutSizingVertical}" for variant "${variant.name}"`,
                    );
                  } catch (error) {
                    debugConsole.warning(
                      `  ⚠️ Failed to set layoutSizingVertical for variant "${variant.name}": ${error}`,
                    );
                  }
                }

                // After setting layout sizing, explicitly resize variant to correct dimensions
                // This is necessary because combineAsVariants() may have resized variants based on component set's auto-layout
                // Restore original dimensions from variantData if they exist
                if (
                  variantData.width !== undefined &&
                  variantData.height !== undefined
                ) {
                  try {
                    variant.resize(variantData.width, variantData.height);
                    debugConsole.log(
                      `  ✓ Resized variant "${variant.name}" to ${variantData.width}x${variantData.height}px (restored from JSON)`,
                    );
                  } catch (error) {
                    debugConsole.warning(
                      `  ⚠️ Failed to resize variant "${variant.name}" to ${variantData.width}x${variantData.height}: ${error}`,
                    );
                  }
                } else if (variantData.height !== undefined) {
                  // Only height is specified, preserve width
                  try {
                    variant.resize(variant.width, variantData.height);
                    debugConsole.log(
                      `  ✓ Resized variant "${variant.name}" height to ${variantData.height}px (preserved width: ${variant.width}px)`,
                    );
                  } catch (error) {
                    debugConsole.warning(
                      `  ⚠️ Failed to resize variant "${variant.name}" height to ${variantData.height}: ${error}`,
                    );
                  }
                } else if (variantData.width !== undefined) {
                  // Only width is specified, preserve height
                  try {
                    variant.resize(variantData.width, variant.height);
                    debugConsole.log(
                      `  ✓ Resized variant "${variant.name}" width to ${variantData.width}px (preserved height: ${variant.height}px)`,
                    );
                  } catch (error) {
                    debugConsole.warning(
                      `  ⚠️ Failed to resize variant "${variant.name}" width to ${variantData.width}: ${error}`,
                    );
                  }
                }
              }
            }
          }

          debugConsole.log(
            `  ✓ Successfully created COMPONENT_SET "${componentSet.name}" with ${componentVariants.length} variant(s)`,
          );
          newNode = componentSet;
        } catch (error) {
          debugConsole.warning(
            `  Failed to combine components into COMPONENT_SET "${nodeData.name || "Unnamed"}": ${error}. Falling back to frame.`,
          );
          // Fallback: create a frame and keep the components as children
          newNode = figma.createFrame();
          if (nodeData.name) {
            newNode.name = nodeData.name;
          }
          // Components are already in tempParent, so we can move them
          if (tempParent && tempParent.children.length > 0) {
            for (const child of tempParent.children) {
              newNode.appendChild(child);
            }
            tempParent.remove();
          }
        }
      } else {
        // No valid component children, just create a frame
        debugConsole.warning(
          `  No valid component variants found for COMPONENT_SET "${nodeData.name || "Unnamed"}". Creating frame instead.`,
        );
        newNode = figma.createFrame();
        if (nodeData.name) {
          newNode.name = nodeData.name;
        }
        if (tempParent) {
          tempParent.remove();
        }
      }
      break;
    }
    case "INSTANCE":
      // For remote structures, always create a frame instead of trying to resolve instances
      if (isRemoteStructure) {
        newNode = figma.createFrame();
        // Copy the name from the instance data
        if (nodeData.name) {
          newNode.name = nodeData.name;
        }
      } else if (
        nodeData._instanceRef !== undefined &&
        instanceTable &&
        nodeIdMapping
      ) {
        const instanceEntry = instanceTable.getInstanceByIndex(
          nodeData._instanceRef,
        );
        if (instanceEntry && instanceEntry.instanceType === "internal") {
          // Internal instance - use componentNodeId to find the component
          if (instanceEntry.componentNodeId) {
            // Special case: If componentNodeId matches the instance's own ID,
            // this is a detached instance that was exported as an internal instance.
            // The component doesn't actually exist, so we need to create a frame fallback.
            if (instanceEntry.componentNodeId === nodeData.id) {
              debugConsole.warning(
                `Instance "${nodeData.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`,
              );
              newNode = figma.createFrame();
              // Copy basic properties from the instance data
              if (nodeData.name) {
                newNode.name = nodeData.name;
              }
              // Skip the rest of the instance handling and continue with normal node property application
            } else {
              // Normal internal instance - look up the component
              const componentNode = nodeIdMapping.get(
                instanceEntry.componentNodeId,
              );
              if (!componentNode) {
                // Component not found in mapping - log available IDs for debugging
                const availableIds = Array.from(nodeIdMapping.keys()).slice(
                  0,
                  20,
                );
                // Also check if the component exists in the pageData but wasn't created
                debugConsole.error(
                  `Component not found for internal instance "${nodeData.name}" (ID: ${instanceEntry.componentNodeId.substring(0, 8)}...). The component should have been created during import.`,
                );
                debugConsole.error(
                  `Looking for component ID: ${instanceEntry.componentNodeId}`,
                );
                debugConsole.error(
                  `Available IDs in mapping (first 20): ${availableIds.map((id) => id.substring(0, 8) + "...").join(", ")}`,
                );

                // Check if the component ID exists in the pageData at all
                // We'll check if we can find it in the current node's children
                const checkForComponentInNode = (
                  node: any,
                  targetId: string,
                ): boolean => {
                  if (node.type === "COMPONENT" && node.id === targetId) {
                    return true;
                  }
                  if (node.children && Array.isArray(node.children)) {
                    for (const child of node.children) {
                      if (
                        !child._truncated &&
                        checkForComponentInNode(child, targetId)
                      ) {
                        return true;
                      }
                    }
                  }
                  return false;
                };

                // Check in the current node's children (if we can access it)
                // This is a best-effort check
                const componentExistsInPageData = checkForComponentInNode(
                  nodeData,
                  instanceEntry.componentNodeId,
                );

                debugConsole.error(
                  `Component ID ${instanceEntry.componentNodeId.substring(0, 8)}... exists in current node tree: ${componentExistsInPageData}`,
                );

                // Log possible reasons why the component wasn't found
                debugConsole.error(
                  `WARNING: Component ID ${instanceEntry.componentNodeId.substring(0, 8)}... not found in nodeIdMapping. This might indicate:`,
                );
                debugConsole.error(
                  `  1. The component doesn't exist in the pageData (detached component?)`,
                );
                debugConsole.error(
                  `  2. The component wasn't collected in the first pass`,
                );
                debugConsole.error(
                  `  3. The component ID in the instance table doesn't match the actual component ID`,
                );

                // Check if any available ID starts with the same prefix
                const matchingPrefix = availableIds.filter((id) =>
                  id.startsWith(instanceEntry.componentNodeId!.substring(0, 8)),
                );
                if (matchingPrefix.length > 0) {
                  debugConsole.error(
                    `Found IDs with matching prefix: ${matchingPrefix.map((id) => id.substring(0, 8) + "...").join(", ")}`,
                  );
                }

                // Component should exist but doesn't - this is a real error
                // Note: Detached instances are now treated as remote, so they won't reach this code
                const errorMessage = `Component not found for internal instance "${nodeData.name}" (ID: ${instanceEntry.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${availableIds.map((id) => id.substring(0, 8) + "...").join(", ")}`;
                throw new Error(errorMessage);
              }
              if (componentNode && componentNode.type === "COMPONENT") {
                // Create instance from the component
                newNode = componentNode.createInstance();
                debugConsole.log(
                  `✓ Created internal instance "${nodeData.name}" from component "${instanceEntry.componentName}"`,
                );

                // Apply variant properties if they exist
                // Note: We can only set properties that exist on the component
                // Recreated components may not have all the same properties as the original
                if (
                  instanceEntry.variantProperties &&
                  Object.keys(instanceEntry.variantProperties).length > 0
                ) {
                  try {
                    // Check if the component we looked up is inside a component set
                    // (This is more reliable than checking the instance's main component's parent)
                    let componentProperties: ComponentPropertyDefinitions | null =
                      null;

                    // First, check if the componentNode itself is inside a component set
                    if (
                      componentNode.parent &&
                      componentNode.parent.type === "COMPONENT_SET"
                    ) {
                      // Component is inside a component set - get properties from the component set
                      componentProperties =
                        componentNode.parent.componentPropertyDefinitions;
                      debugConsole.log(
                        `  DEBUG: Component "${instanceEntry.componentName}" is inside component set "${componentNode.parent.name}" with ${Object.keys(componentProperties || {}).length} property definitions`,
                      );
                    } else {
                      // Component is not yet in a component set (may be moved later during component set creation)
                      // Check the instance's main component as a fallback
                      const mainComponent =
                        await newNode.getMainComponentAsync();
                      if (mainComponent) {
                        const mainComponentType = (mainComponent as any).type;
                        debugConsole.log(
                          `  DEBUG: Internal instance "${nodeData.name}" - componentNode parent: ${componentNode.parent ? (componentNode.parent as any).type : "N/A"}, mainComponent type: ${mainComponentType}, mainComponent parent: ${mainComponent.parent ? (mainComponent.parent as any).type : "N/A"}`,
                        );
                        if (mainComponentType === "COMPONENT_SET") {
                          // Instance was created from a COMPONENT_SET directly
                          const componentSet =
                            mainComponent as unknown as ComponentSetNode;
                          componentProperties =
                            componentSet.componentPropertyDefinitions;
                        } else if (
                          mainComponentType === "COMPONENT" &&
                          mainComponent.parent &&
                          mainComponent.parent.type === "COMPONENT_SET"
                        ) {
                          // Instance was created from a variant component - get properties from parent COMPONENT_SET
                          componentProperties =
                            mainComponent.parent.componentPropertyDefinitions;
                          debugConsole.log(
                            `  DEBUG: Found component set parent "${(mainComponent.parent as any).name}" with ${Object.keys(componentProperties || {}).length} property definitions`,
                          );
                        } else {
                          // Component is not yet in a component set - this is expected during import
                          // The component will be moved into a component set later, but variant properties
                          // can only be set after the component is in the set
                          // We'll skip setting variant properties for now - they'll be set correctly
                          // when the component is moved into the component set
                          debugConsole.log(
                            `  Skipping variant properties for internal instance "${nodeData.name}" - component "${instanceEntry.componentName}" is not yet in a COMPONENT_SET (will be moved later during component set creation)`,
                          );
                        }
                      }
                    }

                    if (componentProperties) {
                      const validProperties: Record<string, string> = {};

                      // Only include properties that exist on the component
                      for (const [propName, propValue] of Object.entries(
                        instanceEntry.variantProperties,
                      )) {
                        // Property names in JSON may include IDs - extract clean name
                        const cleanPropName = propName.split("#")[0];
                        if (componentProperties[cleanPropName]) {
                          validProperties[cleanPropName] = propValue as string;
                        } else {
                          // Expected: Component property definitions cannot be recreated via Figma API
                          // This is a known limitation - properties are skipped silently
                          // debugConsole.warning(
                          //   `Skipping variant property "${propName}" for internal instance "${nodeData.name}" - property does not exist on recreated component`,
                          // );
                        }
                      }

                      // Only set properties if we have valid ones
                      if (Object.keys(validProperties).length > 0) {
                        newNode.setProperties(validProperties);
                      }
                    }
                  } catch (error) {
                    const errorMessage = `Failed to set variant properties for instance "${nodeData.name}": ${error}`;
                    debugConsole.error(errorMessage);
                    throw new Error(errorMessage);
                  }
                }

                // Apply component properties if they exist
                // Note: We can only set properties that exist on the component
                // Recreated components may not have all the same properties as the original
                if (
                  instanceEntry.componentProperties &&
                  Object.keys(instanceEntry.componentProperties).length > 0
                ) {
                  try {
                    // Get the component's property definitions (async method required)
                    const mainComponent = await newNode.getMainComponentAsync();
                    if (mainComponent) {
                      // Variant components don't have componentPropertyDefinitions - only COMPONENT_SETs and non-variant components do
                      let componentProperties: ComponentPropertyDefinitions | null =
                        null;
                      const mainComponentType = (mainComponent as any).type;
                      if (mainComponentType === "COMPONENT_SET") {
                        const componentSet =
                          mainComponent as unknown as ComponentSetNode;
                        componentProperties =
                          componentSet.componentPropertyDefinitions;
                      } else if (
                        mainComponentType === "COMPONENT" &&
                        mainComponent.parent &&
                        mainComponent.parent.type === "COMPONENT_SET"
                      ) {
                        // Instance was created from a variant - get properties from parent COMPONENT_SET
                        componentProperties =
                          mainComponent.parent.componentPropertyDefinitions;
                      } else if (mainComponentType === "COMPONENT") {
                        // Non-variant component - can access componentPropertyDefinitions directly
                        componentProperties =
                          mainComponent.componentPropertyDefinitions;
                      }

                      // Only set properties that exist on the component
                      if (componentProperties) {
                        debugConsole.log(
                          `[IMPORT] Internal instance "${nodeData.name}" -> Processing ${Object.keys(instanceEntry.componentProperties || {}).length} component property/properties from entry`,
                        );
                        debugConsole.log(
                          `[IMPORT]   Properties in entry: ${JSON.stringify(Object.keys(instanceEntry.componentProperties || {}))}`,
                        );
                        debugConsole.log(
                          `[IMPORT]   Available properties on component: ${JSON.stringify(Object.keys(componentProperties))}`,
                        );
                        const propertiesToSet: Record<string, any> = {};
                        for (const [propName, propValue] of Object.entries(
                          instanceEntry.componentProperties,
                        )) {
                          debugConsole.log(
                            `[IMPORT]   Processing entry property "${propName}" with value: ${JSON.stringify(propValue)}`,
                          );
                          // Property names in JSON may include IDs - extract clean name
                          const cleanPropName = propName.split("#")[0];
                          debugConsole.log(
                            `[IMPORT]     Clean property name: "${cleanPropName}"`,
                          );

                          // Check if property exists - Figma may return property keys with or without ID suffixes
                          // Try exact match first, then try matching by base name
                          let matchingPropKey: string | undefined = undefined;
                          if (componentProperties[propName]) {
                            // Exact match (with ID suffix)
                            matchingPropKey = propName;
                            debugConsole.log(
                              `[IMPORT]     ✓ Exact match found: "${propName}"`,
                            );
                          } else if (componentProperties[cleanPropName]) {
                            // Match by clean name (without ID suffix)
                            matchingPropKey = cleanPropName;
                            debugConsole.log(
                              `[IMPORT]     ✓ Clean name match found: "${cleanPropName}"`,
                            );
                          } else {
                            // Try to find a property that starts with the clean name (in case ID format differs)
                            matchingPropKey = Object.keys(
                              componentProperties,
                            ).find(
                              (key) => key.split("#")[0] === cleanPropName,
                            );
                            if (matchingPropKey) {
                              debugConsole.log(
                                `[IMPORT]     ✓ Base name match found: "${matchingPropKey}" (from "${cleanPropName}")`,
                              );
                            } else {
                              debugConsole.warning(
                                `[IMPORT]     ✗ No match found for "${propName}" (clean: "${cleanPropName}")`,
                              );
                            }
                          }

                          if (matchingPropKey) {
                            // Extract the actual value from the property object
                            // Component properties from getProperties() might be stored as primitive values
                            // or as objects with 'value' and other keys
                            const actualValue =
                              propValue &&
                              typeof propValue === "object" &&
                              "value" in propValue
                                ? propValue.value
                                : propValue;
                            debugConsole.log(
                              `[IMPORT]     Extracted value: ${JSON.stringify(actualValue)} (from ${typeof propValue === "object" && "value" in propValue ? "object.value" : "direct"})`,
                            );
                            // Use the matching property key (which may have ID suffix) for setProperties
                            // Figma API requires the exact property key as it exists on the component
                            propertiesToSet[matchingPropKey] = actualValue;
                            debugConsole.log(
                              `[IMPORT]     Added to propertiesToSet: "${matchingPropKey}" = ${JSON.stringify(actualValue)}`,
                            );
                          } else {
                            debugConsole.warning(
                              `[IMPORT]     Component property "${cleanPropName}" (from "${propName}") does not exist on component "${instanceEntry.componentName}" for internal instance "${nodeData.name}". Available properties: ${Object.keys(componentProperties).join(", ") || "none"}`,
                            );
                          }
                        }

                        // Set all properties at once (more efficient and reliable)
                        if (Object.keys(propertiesToSet).length > 0) {
                          debugConsole.log(
                            `[IMPORT]   Ready to set ${Object.keys(propertiesToSet).length} property/properties: ${JSON.stringify(Object.keys(propertiesToSet))}`,
                          );
                          debugConsole.log(
                            `[IMPORT]   Properties to set (with values): ${JSON.stringify(propertiesToSet)}`,
                          );
                          try {
                            newNode.setProperties(propertiesToSet);
                            debugConsole.log(
                              `[IMPORT]   ✓ Successfully set component properties for internal instance "${nodeData.name}": ${Object.keys(propertiesToSet).join(", ")}`,
                            );
                          } catch (error) {
                            const errorMessage = `Failed to set component properties for internal instance "${nodeData.name}": ${error}`;
                            debugConsole.error(`[IMPORT]   ✗ ${errorMessage}`);
                            debugConsole.error(
                              `[IMPORT]     Properties attempted: ${JSON.stringify(propertiesToSet)}`,
                            );
                            debugConsole.error(
                              `[IMPORT]     Available properties: ${JSON.stringify(Object.keys(componentProperties))}`,
                            );
                            throw new Error(errorMessage);
                          }
                        } else {
                          debugConsole.warning(
                            `[IMPORT]   No properties to set for internal instance "${nodeData.name}" (all properties failed to match)`,
                          );
                        }
                      } else {
                        debugConsole.warning(
                          `[IMPORT]   No component properties found on component for internal instance "${nodeData.name}"`,
                        );
                      }
                    } else {
                      debugConsole.warning(
                        `Cannot set component properties for internal instance "${nodeData.name}" - main component not found`,
                      );
                    }
                  } catch (error) {
                    // Re-throw if it's already our error, otherwise wrap it
                    if (error instanceof Error) {
                      throw error;
                    }
                    const errorMessage = `Failed to set component properties for instance "${nodeData.name}": ${error}`;
                    debugConsole.error(errorMessage);
                    throw new Error(errorMessage);
                  }
                }
              } else if (!newNode && componentNode) {
                // componentNode exists but is not a COMPONENT type
                const errorMessage = `Component node found but is not a COMPONENT type for internal instance "${nodeData.name}" (ID: ${instanceEntry.componentNodeId.substring(0, 8)}...).`;
                debugConsole.error(errorMessage);
                throw new Error(errorMessage);
              }
              // If newNode is already set (from frame fallback), continue to process children and properties
            }
          } else {
            const errorMessage = `Internal instance "${nodeData.name}" missing componentNodeId. This is required for internal instances.`;
            debugConsole.error(errorMessage);
            throw new Error(errorMessage);
          }
        } else if (instanceEntry && instanceEntry.instanceType === "remote") {
          // Remote instance - resolve from remoteComponentMap
          if (remoteComponentMap) {
            const remoteComponent = remoteComponentMap.get(
              nodeData._instanceRef,
            );
            if (remoteComponent) {
              newNode = remoteComponent.createInstance();
              debugConsole.log(
                `✓ Created remote instance "${nodeData.name}" from component "${instanceEntry.componentName}" on REMOTES page`,
              );

              // Apply variant properties if they exist
              // Note: We can only set properties that exist on the component
              // Remote components recreated from structure may not have all the same properties
              if (
                instanceEntry.variantProperties &&
                Object.keys(instanceEntry.variantProperties).length > 0
              ) {
                try {
                  // Get the component's property definitions (async method required)
                  const mainComponent = await newNode.getMainComponentAsync();
                  if (mainComponent) {
                    // Variant components don't have componentPropertyDefinitions - only COMPONENT_SETs do
                    let componentProperties: ComponentPropertyDefinitions | null =
                      null;
                    const mainComponentType = (mainComponent as any).type;
                    if (mainComponentType === "COMPONENT_SET") {
                      const componentSet =
                        mainComponent as unknown as ComponentSetNode;
                      componentProperties =
                        componentSet.componentPropertyDefinitions;
                    } else if (
                      mainComponentType === "COMPONENT" &&
                      mainComponent.parent &&
                      mainComponent.parent.type === "COMPONENT_SET"
                    ) {
                      // Instance was created from a variant - get properties from parent COMPONENT_SET
                      componentProperties =
                        mainComponent.parent.componentPropertyDefinitions;
                    } else {
                      // Expected: Remote components are recreated as standalone COMPONENT nodes,
                      // not as part of a COMPONENT_SET, so variant properties cannot be set.
                      // Component properties (if any) will be set separately below.
                      debugConsole.log(
                        `Skipping variant properties for remote instance "${nodeData.name}" - main component is not a COMPONENT_SET or variant (expected for remote components)`,
                      );
                    }

                    if (componentProperties) {
                      const validProperties: Record<string, string> = {};

                      // Only include properties that exist on the component
                      for (const [propName, propValue] of Object.entries(
                        instanceEntry.variantProperties,
                      )) {
                        // Property names in JSON may include IDs - extract clean name
                        const cleanPropName = propName.split("#")[0];
                        if (componentProperties[cleanPropName]) {
                          validProperties[cleanPropName] = propValue as string;
                        } else {
                          // Expected: Component property definitions cannot be recreated via Figma API
                          // This is a known limitation - properties are skipped silently
                          // debugConsole.warning(
                          //   `Skipping variant property "${propName}" for remote instance "${nodeData.name}" - property does not exist on recreated component`,
                          // );
                        }
                      }

                      // Only set properties if we have valid ones
                      if (Object.keys(validProperties).length > 0) {
                        newNode.setProperties(validProperties);
                      }
                    }
                  } else {
                    debugConsole.warning(
                      `Cannot set variant properties for remote instance "${nodeData.name}" - main component not found`,
                    );
                  }
                } catch (error) {
                  const errorMessage = `Failed to set variant properties for remote instance "${nodeData.name}": ${error}`;
                  debugConsole.error(errorMessage);
                  throw new Error(errorMessage);
                }
              }

              // Apply component properties if they exist
              // Note: We can only set properties that exist on the component
              // Remote components recreated from structure may not have all the same properties
              if (
                instanceEntry.componentProperties &&
                Object.keys(instanceEntry.componentProperties).length > 0
              ) {
                try {
                  // Get the component's property definitions (async method required)
                  const mainComponent = await newNode.getMainComponentAsync();
                  if (mainComponent) {
                    // Variant components don't have componentPropertyDefinitions - only COMPONENT_SETs and non-variant components do
                    let componentProperties: ComponentPropertyDefinitions | null =
                      null;
                    const mainComponentType = (mainComponent as any).type;
                    if (mainComponentType === "COMPONENT_SET") {
                      const componentSet =
                        mainComponent as unknown as ComponentSetNode;
                      componentProperties =
                        componentSet.componentPropertyDefinitions;
                    } else if (
                      mainComponentType === "COMPONENT" &&
                      mainComponent.parent &&
                      mainComponent.parent.type === "COMPONENT_SET"
                    ) {
                      // Instance was created from a variant - get properties from parent COMPONENT_SET
                      componentProperties =
                        mainComponent.parent.componentPropertyDefinitions;
                    } else if (mainComponentType === "COMPONENT") {
                      // Non-variant component - can access componentPropertyDefinitions directly
                      componentProperties =
                        mainComponent.componentPropertyDefinitions;
                    }

                    // Only set properties that exist on the component
                    if (componentProperties) {
                      for (const [propName, propValue] of Object.entries(
                        instanceEntry.componentProperties,
                      )) {
                        // Property names in JSON may include IDs (e.g., "Show trailing icon#318:0")
                        // Extract just the property name part (before the #) to match component property definitions
                        const cleanPropName = propName.split("#")[0];
                        if (componentProperties[cleanPropName]) {
                          try {
                            // Extract the actual value from propValue
                            // propValue might be an object with 'value' and 'boundVariables' keys
                            // or it might be a primitive value directly
                            let actualValue: any = propValue;
                            if (
                              propValue &&
                              typeof propValue === "object" &&
                              "value" in propValue
                            ) {
                              actualValue = (propValue as any).value;
                            }

                            newNode.setProperties({
                              [cleanPropName]: actualValue,
                            });
                          } catch (error) {
                            const errorMessage = `Failed to set component property "${cleanPropName}" for remote instance "${nodeData.name}": ${error}`;
                            debugConsole.error(errorMessage);
                            throw new Error(errorMessage);
                          }
                        } else {
                          // Expected: Component property definitions cannot be recreated via Figma API
                          // This is a known limitation - properties are skipped silently
                          // debugConsole.warning(
                          //   `Skipping component property "${propName}" for remote instance "${nodeData.name}" - property does not exist on recreated component`,
                          // );
                        }
                      }
                    }
                  } else {
                    debugConsole.warning(
                      `Cannot set component properties for remote instance "${nodeData.name}" - main component not found`,
                    );
                  }
                } catch (error) {
                  // Re-throw if it's already our error, otherwise wrap it
                  if (error instanceof Error) {
                    throw error;
                  }
                  const errorMessage = `Failed to set component properties for remote instance "${nodeData.name}": ${error}`;
                  debugConsole.error(errorMessage);
                  throw new Error(errorMessage);
                }
              }

              // Set instance size after properties are applied (properties might affect size)
              if (
                nodeData.width !== undefined &&
                nodeData.height !== undefined
              ) {
                try {
                  newNode.resize(nodeData.width, nodeData.height);
                } catch {
                  // Size might be constrained by component - this is okay
                  debugConsole.log(
                    `Note: Could not resize remote instance "${nodeData.name}" to ${nodeData.width}x${nodeData.height} (may be constrained by component)`,
                  );
                }
              }
            } else {
              const errorMessage = `Remote component not found for instance "${nodeData.name}" (index ${nodeData._instanceRef}). The remote component should have been created on the REMOTES page.`;
              debugConsole.error(errorMessage);
              throw new Error(errorMessage);
            }
          } else {
            const errorMessage = `Remote instance "${nodeData.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            debugConsole.error(errorMessage);
            throw new Error(errorMessage);
          }
        } else if (instanceEntry?.instanceType === "normal") {
          // Normal instance - resolve from component on referenced page
          if (!instanceEntry.componentPageName) {
            const errorMessage = `Normal instance "${nodeData.name}" missing componentPageName. Cannot resolve.`;
            debugConsole.error(errorMessage);
            throw new Error(errorMessage);
          }

          // Find the referenced page
          // Try multiple matching strategies to find existing pages
          await figma.loadAllPagesAsync();
          let referencedPage = figma.root.children.find(
            (page) => page.name === instanceEntry.componentPageName,
          );

          // If exact match failed, try clean name matching
          if (!referencedPage) {
            const cleanTargetName = getComponentCleanName(
              instanceEntry.componentPageName,
            );
            referencedPage = figma.root.children.find((page) => {
              const cleanPageName = getComponentCleanName(page.name);
              return cleanPageName === cleanTargetName;
            });
          }

          // If still not found, try matching against pages with version suffixes removed
          if (!referencedPage) {
            const cleanTargetName = getComponentCleanName(
              instanceEntry.componentPageName,
            );
            const targetNameWithoutVersion = cleanTargetName.replace(
              /\s*\(VERSION\s*:\s*\d+\)\s*$/i,
              "",
            );

            referencedPage = figma.root.children.find((page) => {
              const cleanPageName = getComponentCleanName(page.name);
              const pageNameWithoutVersion = cleanPageName.replace(
                /\s*\(VERSION\s*:\s*\d+\)\s*$/i,
                "",
              );
              return pageNameWithoutVersion === targetNameWithoutVersion;
            });
          }

          // If still not found, try case-insensitive matching
          if (!referencedPage) {
            const targetNameLower = instanceEntry.componentPageName
              .toLowerCase()
              .trim();
            referencedPage = figma.root.children.find((page) => {
              const pageNameLower = page.name.toLowerCase().trim();
              return pageNameLower === targetNameLower;
            });
          }

          if (!referencedPage) {
            // Page doesn't exist yet - defer resolution (circular reference or not yet imported)
            debugConsole.log(
              `  Deferring normal instance "${nodeData.name}" - referenced page "${instanceEntry.componentPageName}" does not exist yet (may be circular reference or not yet imported)`,
            );

            // Create a placeholder frame that will be replaced later
            const placeholderFrame = figma.createFrame();
            placeholderFrame.name = `[Deferred: ${nodeData.name}]`;
            if (nodeData.x !== undefined) {
              placeholderFrame.x = nodeData.x;
            }
            if (nodeData.y !== undefined) {
              placeholderFrame.y = nodeData.y;
            }
            if (nodeData.width !== undefined && nodeData.height !== undefined) {
              placeholderFrame.resize(nodeData.width, nodeData.height);
            } else if (nodeData.w !== undefined && nodeData.h !== undefined) {
              placeholderFrame.resize(nodeData.w, nodeData.h);
            }

            // Add placeholder frame ID to Set immediately so we can check if parent is a placeholder
            if (placeholderFrameIds) {
              placeholderFrameIds.add(placeholderFrame.id);
            }

            // Store deferred instance info (using IDs for serialization)
            if (deferredInstances) {
              // Use currentPlaceholderId if we're inside a placeholder (nested deferred instance)
              // This is passed down through recursive calls, so we know if we're inside a placeholder
              const parentPlaceholderId = currentPlaceholderId;

              if (parentPlaceholderId) {
                debugConsole.log(
                  `[NESTED] Creating child deferred instance "${nodeData.name}" with parent placeholder ID ${parentPlaceholderId.substring(0, 8)}... (immediate parent: "${parentNode.name}" ${parentNode.id.substring(0, 8)}...)`,
                );
              } else {
                debugConsole.log(
                  `[NESTED] Creating top-level deferred instance "${nodeData.name}" - parent "${parentNode.name}" (${parentNode.id.substring(0, 8)}...)`,
                );
              }

              // If we're inside a placeholder, use the placeholder's parent as parentNodeId
              // This ensures we can find the actual parent node even after the placeholder is removed
              let actualParentNodeId = parentNode.id;
              if (parentPlaceholderId) {
                try {
                  const placeholderNode =
                    await figma.getNodeByIdAsync(parentPlaceholderId);
                  if (placeholderNode && placeholderNode.parent) {
                    actualParentNodeId = placeholderNode.parent.id;
                  }
                } catch {
                  // Placeholder might not exist yet, fall back to parentNode.id
                  actualParentNodeId = parentNode.id;
                }
              }

              const deferred = {
                placeholderFrameId: placeholderFrame.id,
                instanceEntry,
                nodeData,
                parentNodeId: actualParentNodeId,
                parentPlaceholderId,
                instanceIndex: nodeData._instanceRef,
              };
              deferredInstances.push(deferred);
            }

            newNode = placeholderFrame;
            break;
          }

          // Find the component on the referenced page using path and component name
          let targetComponent: ComponentNode | null = null;

          // Helper function to find component by path, component set name, and component name
          const findComponentByPath = (
            parent: any,
            path: string[],
            componentName: string,
            componentGuid?: string,
            componentSetName?: string,
          ): ComponentNode | null => {
            // If path is empty, search direct children of parent
            if (path.length === 0) {
              let nameMatch: ComponentNode | null = null; // Store first name match as fallback

              for (const child of parent.children || []) {
                if (child.type === "COMPONENT") {
                  // Check if name matches (may be variant property string like "Style=Primary")
                  if (child.name === componentName) {
                    // Store as name match (fallback if GUID check fails)
                    if (!nameMatch) {
                      nameMatch = child;
                    }

                    // If componentGuid is provided, verify it matches
                    if (componentGuid) {
                      try {
                        const metadataStr = child.getPluginData(
                          "RecursicaPublishedMetadata",
                        );
                        if (metadataStr) {
                          const metadata = JSON.parse(metadataStr);
                          if (metadata.id === componentGuid) {
                            return child;
                          }
                        }
                      } catch {
                        // Metadata check failed, continue searching
                      }
                    } else {
                      // No GUID to verify, use name match
                      return child;
                    }
                  }
                } else if (child.type === "COMPONENT_SET") {
                  // Only search in this component set if componentSetName matches (if provided)
                  // This ensures we find the correct variant when multiple component sets have variants with the same name
                  if (componentSetName && child.name !== componentSetName) {
                    continue; // Skip this component set if name doesn't match
                  }

                  // Check if component name matches a variant in the component set
                  for (const variant of child.children || []) {
                    if (
                      variant.type === "COMPONENT" &&
                      variant.name === componentName
                    ) {
                      // Store as name match (fallback if GUID check fails)
                      if (!nameMatch) {
                        nameMatch = variant;
                      }

                      if (componentGuid) {
                        try {
                          const metadataStr = variant.getPluginData(
                            "RecursicaPublishedMetadata",
                          );
                          if (metadataStr) {
                            const metadata = JSON.parse(metadataStr);
                            if (metadata.id === componentGuid) {
                              return variant;
                            }
                          }
                        } catch {
                          // Metadata check failed, continue searching
                        }
                      } else {
                        // If componentSetName was provided and matched, return immediately
                        // (we've already filtered to the correct component set)
                        if (componentSetName) {
                          return variant;
                        }
                        // Otherwise, continue searching to find the best match
                        return variant;
                      }
                    }
                  }
                }
              }

              // If we found a name match but GUID didn't match (or GUID check failed), use name match as fallback
              if (nameMatch && componentGuid) {
                // Will log warning after function returns
                return nameMatch;
              }

              return nameMatch;
            }

            // Navigate through path segments
            const [firstSegment, ...remainingPath] = path;
            for (const child of parent.children || []) {
              if (child.name === firstSegment) {
                // If we've reached the end of the path and this is a COMPONENT_SET,
                // search for the component inside it
                if (
                  remainingPath.length === 0 &&
                  child.type === "COMPONENT_SET"
                ) {
                  // Verify component set name matches if provided
                  if (componentSetName && child.name !== componentSetName) {
                    continue; // Skip this component set if name doesn't match
                  }

                  // Search for the component variant in this COMPONENT_SET
                  for (const variant of child.children || []) {
                    if (
                      variant.type === "COMPONENT" &&
                      variant.name === componentName
                    ) {
                      // Found the variant - check GUID if provided
                      if (componentGuid) {
                        try {
                          const metadataStr = variant.getPluginData(
                            "RecursicaPublishedMetadata",
                          );
                          if (metadataStr) {
                            const metadata = JSON.parse(metadataStr);
                            if (metadata.id === componentGuid) {
                              return variant;
                            }
                          }
                        } catch {
                          // GUID check failed, continue
                        }
                      }
                      // Return variant (GUID check passed or no GUID provided)
                      return variant;
                    }
                  }
                  // Component not found in COMPONENT_SET
                  return null;
                }
                // Continue navigating through path
                return findComponentByPath(
                  child,
                  remainingPath,
                  componentName,
                  componentGuid,
                  componentSetName,
                );
              }
            }
            return null;
          };

          const isPageHeaderInitial =
            nodeData.name === ".UI kit / Page header" ||
            instanceEntry.componentName === ".UI kit / Page header";
          if (isPageHeaderInitial) {
            debugConsole.log(
              `[DEBUG .UI kit / Page header] === INITIAL PROCESSING ===`,
            );
            debugConsole.log(
              `[DEBUG .UI kit / Page header] Node data name: "${nodeData.name}"`,
            );
            debugConsole.log(
              `[DEBUG .UI kit / Page header] Instance entry componentName: "${instanceEntry.componentName}"`,
            );
            debugConsole.log(
              `[DEBUG .UI kit / Page header] Instance entry componentProperties: ${JSON.stringify(instanceEntry.componentProperties, null, 2)}`,
            );
            debugConsole.log(
              `[DEBUG .UI kit / Page header] Instance entry (full): ${JSON.stringify(instanceEntry, null, 2)}`,
            );
          }
          debugConsole.log(
            `  Looking for component "${instanceEntry.componentName}" on page "${instanceEntry.componentPageName}"${instanceEntry.path && instanceEntry.path.length > 0 ? ` at path [${instanceEntry.path.join(" → ")}]` : " at page root"}${instanceEntry.componentGuid ? ` (GUID: ${instanceEntry.componentGuid.substring(0, 8)}...)` : ""}`,
          );

          // List available components on the page for debugging
          const availableComponents: string[] = [];
          const listComponents = (node: any, depth: number = 0): void => {
            const indent = "  ".repeat(depth);
            if (node.type === "COMPONENT") {
              availableComponents.push(`${indent}COMPONENT: "${node.name}"`);
            } else if (node.type === "COMPONENT_SET") {
              availableComponents.push(
                `${indent}COMPONENT_SET: "${node.name}"`,
              );
              for (const variant of node.children || []) {
                if (variant.type === "COMPONENT") {
                  availableComponents.push(
                    `${indent}  └─ COMPONENT: "${variant.name}"`,
                  );
                }
              }
            }
            for (const child of node.children || []) {
              listComponents(child, depth + 1);
            }
          };
          listComponents(referencedPage);
          if (availableComponents.length > 0) {
            debugConsole.log(
              `  Available components on page "${instanceEntry.componentPageName}":\n${availableComponents.slice(0, 20).join("\n")}${availableComponents.length > 20 ? `\n  ... and ${availableComponents.length - 20} more` : ""}`,
            );
          } else {
            debugConsole.warning(
              `  No components found on page "${instanceEntry.componentPageName}"`,
            );
          }

          targetComponent = findComponentByPath(
            referencedPage,
            instanceEntry.path || [],
            instanceEntry.componentName,
            instanceEntry.componentGuid,
            instanceEntry.componentSetName,
          );

          // Log if we used name match fallback (GUID verification failed)
          if (targetComponent && instanceEntry.componentGuid) {
            try {
              const metadataStr = targetComponent.getPluginData(
                "RecursicaPublishedMetadata",
              );
              if (metadataStr) {
                const metadata = JSON.parse(metadataStr);
                if (metadata.id !== instanceEntry.componentGuid) {
                  debugConsole.warning(
                    `  Found component "${instanceEntry.componentName}" by name but GUID verification failed (expected ${instanceEntry.componentGuid.substring(0, 8)}..., got ${metadata.id ? metadata.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`,
                  );
                } else {
                  debugConsole.log(
                    `  Found component "${instanceEntry.componentName}" with matching GUID ${instanceEntry.componentGuid.substring(0, 8)}...`,
                  );
                }
              } else {
                debugConsole.warning(
                  `  Found component "${instanceEntry.componentName}" by name but no metadata found. Using name match as fallback.`,
                );
              }
            } catch {
              debugConsole.warning(
                `  Found component "${instanceEntry.componentName}" by name but GUID verification failed. Using name match as fallback.`,
              );
            }
          }

          if (!targetComponent) {
            // Component not found - defer resolution (may not be created yet due to circular reference)
            const isPageHeader =
              nodeData.name === ".UI kit / Page header" ||
              instanceEntry.componentName === ".UI kit / Page header";
            if (isPageHeader) {
              debugConsole.log(
                `[DEBUG .UI kit / Page header] Deferring instance "${nodeData.name}" - component "${instanceEntry.componentName}" not found on page "${instanceEntry.componentPageName}"`,
              );
              debugConsole.log(
                `[DEBUG .UI kit / Page header] Instance entry has componentProperties: ${JSON.stringify(instanceEntry.componentProperties)}`,
              );
            }
            debugConsole.log(
              `  Deferring normal instance "${nodeData.name}" - component "${instanceEntry.componentName}" not found on page "${instanceEntry.componentPageName}" (may not be created yet due to circular reference)`,
            );

            // Create a placeholder frame that will be replaced later
            const placeholderFrame = figma.createFrame();
            placeholderFrame.name = `[Deferred: ${nodeData.name}]`;
            if (nodeData.x !== undefined) {
              placeholderFrame.x = nodeData.x;
            }
            if (nodeData.y !== undefined) {
              placeholderFrame.y = nodeData.y;
            }
            if (nodeData.width !== undefined && nodeData.height !== undefined) {
              placeholderFrame.resize(nodeData.width, nodeData.height);
            } else if (nodeData.w !== undefined && nodeData.h !== undefined) {
              placeholderFrame.resize(nodeData.w, nodeData.h);
            }

            // Add placeholder frame ID to Set immediately so we can check if parent is a placeholder
            if (placeholderFrameIds) {
              placeholderFrameIds.add(placeholderFrame.id);
            }

            // Store deferred instance info (using IDs for serialization)
            if (deferredInstances) {
              // Use currentPlaceholderId if we're inside a placeholder (nested deferred instance)
              // This is passed down through recursive calls, so we know if we're inside a placeholder
              const parentPlaceholderId = currentPlaceholderId;

              if (parentPlaceholderId) {
                debugConsole.log(
                  `[NESTED] Creating child deferred instance "${nodeData.name}" with parent placeholder ID ${parentPlaceholderId.substring(0, 8)}... (immediate parent: "${parentNode.name}" ${parentNode.id.substring(0, 8)}...)`,
                );
              } else {
                debugConsole.log(
                  `[NESTED] Creating top-level deferred instance "${nodeData.name}" - parent "${parentNode.name}" (${parentNode.id.substring(0, 8)}...)`,
                );
              }

              // If we're inside a placeholder, use the placeholder's parent as parentNodeId
              // This ensures we can find the actual parent node even after the placeholder is removed
              let actualParentNodeId = parentNode.id;
              if (parentPlaceholderId) {
                try {
                  const placeholderNode =
                    await figma.getNodeByIdAsync(parentPlaceholderId);
                  if (placeholderNode && placeholderNode.parent) {
                    actualParentNodeId = placeholderNode.parent.id;
                  }
                } catch {
                  // Placeholder might not exist yet, fall back to parentNode.id
                  actualParentNodeId = parentNode.id;
                }
              }

              const deferred = {
                placeholderFrameId: placeholderFrame.id,
                instanceEntry,
                nodeData,
                parentNodeId: actualParentNodeId,
                parentPlaceholderId,
                instanceIndex: nodeData._instanceRef,
              };
              deferredInstances.push(deferred);
            }

            newNode = placeholderFrame;
            break;
          }

          // Create instance of the component
          newNode = targetComponent.createInstance();
          debugConsole.log(
            `  Created normal instance "${nodeData.name}" from component "${instanceEntry.componentName}" on page "${instanceEntry.componentPageName}"`,
          );

          // Set variant properties if they exist
          if (
            instanceEntry.variantProperties &&
            Object.keys(instanceEntry.variantProperties).length > 0
          ) {
            try {
              const mainComponent = await newNode.getMainComponentAsync();
              if (mainComponent) {
                // If the main component is a variant (inside a COMPONENT_SET),
                // get property definitions from the parent COMPONENT_SET instead
                // Variant components don't have componentPropertyDefinitions - only COMPONENT_SETs do
                let componentProperties: ComponentPropertyDefinitions | null =
                  null;
                const mainComponentType = (mainComponent as any).type;
                if (mainComponentType === "COMPONENT_SET") {
                  const componentSet =
                    mainComponent as unknown as ComponentSetNode;
                  componentProperties =
                    componentSet.componentPropertyDefinitions;
                } else if (
                  mainComponentType === "COMPONENT" &&
                  mainComponent.parent &&
                  mainComponent.parent.type === "COMPONENT_SET"
                ) {
                  // Instance was created from a variant - get properties from parent COMPONENT_SET
                  componentProperties =
                    mainComponent.parent.componentPropertyDefinitions;
                } else {
                  // Instance was created from a non-variant component - no variant properties to set
                  debugConsole.warning(
                    `Cannot set variant properties for normal instance "${nodeData.name}" - main component is not a COMPONENT_SET or variant`,
                  );
                }

                if (componentProperties) {
                  const validProperties: Record<string, string> = {};

                  // Only include properties that exist on the component
                  for (const [propName, propValue] of Object.entries(
                    instanceEntry.variantProperties,
                  )) {
                    // Property names in JSON may include IDs - extract clean name
                    const cleanPropName = propName.split("#")[0];
                    if (componentProperties[cleanPropName]) {
                      validProperties[cleanPropName] = propValue as string;
                    }
                  }

                  // Only set properties if we have valid ones
                  if (Object.keys(validProperties).length > 0) {
                    newNode.setProperties(validProperties);
                  }
                }
              }
            } catch (error) {
              debugConsole.warning(
                `Failed to set variant properties for normal instance "${nodeData.name}": ${error}`,
              );
            }
          }

          // Set component properties if they exist
          if (
            instanceEntry.componentProperties &&
            Object.keys(instanceEntry.componentProperties).length > 0
          ) {
            debugConsole.log(
              `[IMPORT] Normal instance "${nodeData.name}" -> Processing ${Object.keys(instanceEntry.componentProperties).length} component property/properties from entry`,
            );
            debugConsole.log(
              `[IMPORT]   Properties in entry: ${JSON.stringify(Object.keys(instanceEntry.componentProperties))}`,
            );
            for (const [propName, propValue] of Object.entries(
              instanceEntry.componentProperties,
            )) {
              debugConsole.log(
                `[IMPORT]   Entry property "${propName}": ${JSON.stringify(propValue)}`,
              );
            }
            try {
              const mainComponent = await newNode.getMainComponentAsync();
              if (mainComponent) {
                debugConsole.log(
                  `[IMPORT]   Main component found: "${mainComponent.name}" (type: ${(mainComponent as any).type})`,
                );
                // If the main component is a variant (inside a COMPONENT_SET),
                // get property definitions from the parent COMPONENT_SET instead
                // Variant components don't have componentPropertyDefinitions - only COMPONENT_SETs and non-variant components do
                let componentProperties: ComponentPropertyDefinitions | null =
                  null;
                const mainComponentType = (mainComponent as any).type;
                if (mainComponentType === "COMPONENT_SET") {
                  const componentSet =
                    mainComponent as unknown as ComponentSetNode;
                  componentProperties =
                    componentSet.componentPropertyDefinitions;
                  debugConsole.log(
                    `[IMPORT]   Got properties from COMPONENT_SET: ${componentProperties ? Object.keys(componentProperties).length : 0} property/properties`,
                  );
                } else if (
                  mainComponentType === "COMPONENT" &&
                  mainComponent.parent &&
                  mainComponent.parent.type === "COMPONENT_SET"
                ) {
                  // Instance was created from a variant - get properties from parent COMPONENT_SET
                  componentProperties =
                    mainComponent.parent.componentPropertyDefinitions;
                  debugConsole.log(
                    `[IMPORT]   Got properties from parent COMPONENT_SET: ${componentProperties ? Object.keys(componentProperties).length : 0} property/properties`,
                  );
                } else if (mainComponentType === "COMPONENT") {
                  // Non-variant component - can access componentPropertyDefinitions directly
                  componentProperties =
                    mainComponent.componentPropertyDefinitions;
                  debugConsole.log(
                    `[IMPORT]   Got properties from COMPONENT: ${componentProperties ? Object.keys(componentProperties).length : 0} property/properties`,
                  );
                }

                // Only set properties that exist on the component
                if (componentProperties) {
                  debugConsole.log(
                    `[IMPORT]   Available properties on component: ${JSON.stringify(Object.keys(componentProperties))}`,
                  );
                  const propertiesToSet: Record<string, any> = {};
                  for (const [propName, propValue] of Object.entries(
                    instanceEntry.componentProperties,
                  )) {
                    debugConsole.log(
                      `[IMPORT]   Processing entry property "${propName}" with value: ${JSON.stringify(propValue)}`,
                    );
                    // Property names in JSON may include IDs - extract clean name
                    const cleanPropName = propName.split("#")[0];
                    debugConsole.log(
                      `[IMPORT]     Clean property name: "${cleanPropName}"`,
                    );

                    // Check if property exists - Figma may return property keys with or without ID suffixes
                    // Try exact match first, then try matching by base name
                    let matchingPropKey: string | undefined = undefined;
                    if (componentProperties[propName]) {
                      // Exact match (with ID suffix)
                      matchingPropKey = propName;
                      debugConsole.log(
                        `[IMPORT]     ✓ Exact match found: "${propName}"`,
                      );
                    } else if (componentProperties[cleanPropName]) {
                      // Match by clean name (without ID suffix)
                      matchingPropKey = cleanPropName;
                      debugConsole.log(
                        `[IMPORT]     ✓ Clean name match found: "${cleanPropName}"`,
                      );
                    } else {
                      // Try to find a property that starts with the clean name (in case ID format differs)
                      matchingPropKey = Object.keys(componentProperties).find(
                        (key) => key.split("#")[0] === cleanPropName,
                      );
                      if (matchingPropKey) {
                        debugConsole.log(
                          `[IMPORT]     ✓ Base name match found: "${matchingPropKey}" (from "${cleanPropName}")`,
                        );
                      } else {
                        debugConsole.warning(
                          `[IMPORT]     ✗ No match found for "${propName}" (clean: "${cleanPropName}")`,
                        );
                      }
                    }

                    if (matchingPropKey) {
                      // Extract the actual value from the property object
                      // Component properties in JSON are stored as { value: ..., type: ..., bndVar: ... }
                      // but setProperties expects just the value
                      const actualValue =
                        propValue &&
                        typeof propValue === "object" &&
                        "value" in propValue
                          ? propValue.value
                          : propValue;
                      debugConsole.log(
                        `[IMPORT]     Extracted value: ${JSON.stringify(actualValue)} (from ${typeof propValue === "object" && "value" in propValue ? "object.value" : "direct"})`,
                      );
                      // Use the matching property key (which may have ID suffix) for setProperties
                      // Figma API requires the exact property key as it exists on the component
                      propertiesToSet[matchingPropKey] = actualValue;
                      debugConsole.log(
                        `[IMPORT]     Added to propertiesToSet: "${matchingPropKey}" = ${JSON.stringify(actualValue)}`,
                      );
                    } else {
                      debugConsole.warning(
                        `[IMPORT]     Component property "${cleanPropName}" (from "${propName}") does not exist on component "${instanceEntry.componentName}" for normal instance "${nodeData.name}". Available properties: ${Object.keys(componentProperties).join(", ") || "none"}`,
                      );
                    }
                  }

                  // Set all properties at once
                  if (Object.keys(propertiesToSet).length > 0) {
                    debugConsole.log(
                      `[IMPORT]   Ready to set ${Object.keys(propertiesToSet).length} property/properties: ${JSON.stringify(Object.keys(propertiesToSet))}`,
                    );
                    debugConsole.log(
                      `[IMPORT]   Properties to set (with values): ${JSON.stringify(propertiesToSet)}`,
                    );
                    try {
                      newNode.setProperties(propertiesToSet);
                      debugConsole.log(
                        `[IMPORT]   ✓ Successfully set component properties for normal instance "${nodeData.name}": ${Object.keys(propertiesToSet).join(", ")}`,
                      );
                      // Verify properties were actually set by reading them back
                      try {
                        if (
                          typeof (newNode as any).getProperties === "function"
                        ) {
                          const verifyProps = await (
                            newNode as any
                          ).getProperties();
                          if (verifyProps && verifyProps.componentProperties) {
                            const verifiedValues: Record<string, any> = {};
                            for (const [key, value] of Object.entries(
                              propertiesToSet,
                            )) {
                              const verifyValue =
                                verifyProps.componentProperties[key];
                              verifiedValues[key] = verifyValue;
                              if (
                                JSON.stringify(verifyValue) !==
                                JSON.stringify(value)
                              ) {
                                debugConsole.warning(
                                  `[IMPORT]   ⚠ Property "${key}" verification mismatch: expected ${JSON.stringify(value)}, got ${JSON.stringify(verifyValue)}`,
                                );
                              } else {
                                debugConsole.log(
                                  `[IMPORT]   ✓ Verified property "${key}" = ${JSON.stringify(verifyValue)}`,
                                );
                              }
                            }
                            debugConsole.log(
                              `[IMPORT]   Verification complete. All properties: ${JSON.stringify(verifiedValues)}`,
                            );
                          }
                        } else {
                          // Fallback: try direct access to componentProperties
                          const directProps = (newNode as any)
                            .componentProperties;
                          if (directProps) {
                            const verifiedValues: Record<string, any> = {};
                            for (const [key, expectedValue] of Object.entries(
                              propertiesToSet,
                            )) {
                              const actualProperty = directProps[key];
                              // Extract the actual value from the property object
                              // componentProperties returns objects like {type: "TEXT", value: "Logo"}
                              // but we set just the value, so we need to compare actualProperty.value with expectedValue
                              const actualValue =
                                actualProperty &&
                                typeof actualProperty === "object" &&
                                "value" in actualProperty
                                  ? actualProperty.value
                                  : actualProperty;
                              verifiedValues[key] = actualValue;
                              if (actualProperty === undefined) {
                                debugConsole.warning(
                                  `[IMPORT]   ⚠ Property "${key}" not found in componentProperties after setting`,
                                );
                              } else if (
                                JSON.stringify(actualValue) !==
                                JSON.stringify(expectedValue)
                              ) {
                                debugConsole.warning(
                                  `[IMPORT]   ⚠ Property "${key}" verification mismatch: expected ${JSON.stringify(expectedValue)}, got ${JSON.stringify(actualValue)} (from property object: ${JSON.stringify(actualProperty)})`,
                                );
                              } else {
                                debugConsole.log(
                                  `[IMPORT]   ✓ Verified property "${key}" = ${JSON.stringify(actualValue)}`,
                                );
                              }
                            }
                            debugConsole.log(
                              `[IMPORT]   Verification complete. All properties: ${JSON.stringify(verifiedValues)}`,
                            );
                          } else {
                            debugConsole.warning(
                              `[IMPORT]   Could not access componentProperties for verification`,
                            );
                          }
                        }
                      } catch (verifyError) {
                        debugConsole.warning(
                          `[IMPORT]   Could not verify properties after setting: ${verifyError}`,
                        );
                      }
                    } catch (error) {
                      debugConsole.error(
                        `[IMPORT]   ✗ Failed to set component properties for normal instance "${nodeData.name}": ${error}`,
                      );
                      debugConsole.error(
                        `[IMPORT]     Properties attempted: ${JSON.stringify(propertiesToSet)}`,
                      );
                      debugConsole.error(
                        `[IMPORT]     Available properties: ${JSON.stringify(Object.keys(componentProperties))}`,
                      );
                    }
                  } else {
                    debugConsole.warning(
                      `[IMPORT]   No properties to set for normal instance "${nodeData.name}" (all properties failed to match)`,
                    );
                  }
                } else {
                  debugConsole.warning(
                    `[IMPORT]   No component properties found on main component "${mainComponent.name}" for normal instance "${nodeData.name}"`,
                  );
                }
              } else {
                debugConsole.warning(
                  `[IMPORT]   Cannot set component properties for normal instance "${nodeData.name}" - main component not found`,
                );
              }
            } catch (error) {
              debugConsole.error(
                `[IMPORT]   Error setting component properties for normal instance "${nodeData.name}": ${error}`,
              );
            }
          } else {
            debugConsole.log(
              `[IMPORT] Normal instance "${nodeData.name}" -> No component properties in entry`,
            );
          }

          // Set instance size after properties are applied (properties might affect size)
          if (nodeData.width !== undefined && nodeData.height !== undefined) {
            try {
              newNode.resize(nodeData.width, nodeData.height);
            } catch {
              // Size might be constrained by component - this is okay
              debugConsole.log(
                `Note: Could not resize normal instance "${nodeData.name}" to ${nodeData.width}x${nodeData.height} (may be constrained by component)`,
              );
            }
          }
        } else {
          // Unknown instance type or missing entry - this is an error
          const errorMessage = `Instance "${nodeData.name}" has unknown or missing instance type: ${instanceEntry?.instanceType || "unknown"}`;
          debugConsole.error(errorMessage);
          throw new Error(errorMessage);
        }
      } else {
        // No _instanceRef or missing instance table - this is an error
        const errorMessage = `Instance "${nodeData.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        debugConsole.error(errorMessage);
        throw new Error(errorMessage);
      }
      break;
    case "GROUP":
      newNode = figma.createFrame();
      break;
    case "BOOLEAN_OPERATION": {
      // Boolean operations cannot be created directly in Figma API
      // They are typically represented as VECTOR nodes with specific paths
      // Import as VECTOR node to preserve the visual appearance
      debugConsole.log(
        `Converting BOOLEAN_OPERATION "${nodeData.name}" to VECTOR node (boolean operations cannot be created directly in Figma API)`,
      );
      newNode = figma.createVector();
      // Note: vectorPaths will be set later if they exist in nodeData
      break;
    }
    case "POLYGON":
      newNode = figma.createPolygon();
      break;
    default: {
      const errorMessage = `Unsupported node type: ${nodeData.type}. This node type cannot be imported.`;
      debugConsole.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  if (!newNode) {
    return null;
  }

  // ISSUE #4: Note: For VECTOR nodes, constraints are set using the constraints object API
  // AFTER vectorPaths and size are set. The constraints object API works even after
  // appending to COMPONENTs (as proven by tests), so no special timing is required.
  // This is handled later in the code (after vectorPaths and size are set).

  // Store node ID mapping for internal instance resolution
  if (nodeData.id && nodeIdMapping) {
    nodeIdMapping.set(nodeData.id, newNode);
    if (newNode.type === "COMPONENT") {
      debugConsole.log(
        `  Stored COMPONENT "${nodeData.name || "Unnamed"}" in nodeIdMapping (ID: ${nodeData.id.substring(0, 8)}...)`,
      );
    }
  }

  // Store original node ID as plugin data for deferred instance resolution
  // This allows us to uniquely identify children even when multiple have the same name
  if (nodeData.id) {
    newNode.setPluginData(ORIGINAL_NODE_ID_KEY, nodeData.id);
  }

  // Store instance table index mapping for variant property setting in third pass
  // This allows us to match instances to their specific instance table entries
  // even when multiple instances reference the same component
  if (nodeData._instanceRef !== undefined && newNode.type === "INSTANCE") {
    // Store mapping: new instance node ID -> instance table index
    if (!(nodeIdMapping as any)._instanceTableMap) {
      (nodeIdMapping as any)._instanceTableMap = new Map<string, number>();
    }
    (nodeIdMapping as any)._instanceTableMap.set(
      newNode.id,
      nodeData._instanceRef,
    );
    debugConsole.log(
      `  Stored instance table mapping: instance "${newNode.name}" (ID: ${newNode.id.substring(0, 8)}...) -> instance table index ${nodeData._instanceRef}`,
    );
  } else if (newNode.type === "INSTANCE") {
    debugConsole.log(
      `  WARNING: Instance "${newNode.name}" (ID: ${newNode.id.substring(0, 8)}...) has no _instanceRef in nodeData - will use fallback matching in third pass`,
    );
  }

  // Note: Bound variables for padding/itemSpacing must be set AFTER layoutMode is set,
  // because padding properties don't exist until layoutMode is enabled.
  // This will be done later in the code, right after layoutMode is set.

  // Apply defaults first, but skip padding/itemSpacing if they have bound variables
  // This prevents defaults from interfering with bound variable restoration
  const hasBoundVariablesForPadding =
    nodeData.boundVariables &&
    typeof nodeData.boundVariables === "object" &&
    (nodeData.boundVariables.paddingLeft ||
      nodeData.boundVariables.paddingRight ||
      nodeData.boundVariables.paddingTop ||
      nodeData.boundVariables.paddingBottom ||
      nodeData.boundVariables.itemSpacing);
  applyDefaultsToNode(
    newNode,
    nodeData.type || "FRAME",
    hasBoundVariablesForPadding,
  );

  // Set basic properties (override defaults with serialized values)
  if (nodeData.name !== undefined) {
    newNode.name = nodeData.name || "Unnamed Node";
  }

  // Only set x/y positions if:
  // 1. The node is not a child of an auto-layout parent, OR
  // 2. The node itself doesn't have auto-layout enabled
  // When auto-layout is enabled, children should be positioned automatically
  // Check both parentNode.layoutMode (if already set) and parentNodeData.layoutMode (from nodeData)
  const parentHasAutoLayoutFromNode =
    parentNodeData &&
    parentNodeData.layoutMode !== undefined &&
    parentNodeData.layoutMode !== "NONE";
  const parentHasAutoLayoutFromProperty =
    parentNode &&
    "layoutMode" in parentNode &&
    parentNode.layoutMode !== "NONE";
  const parentHasAutoLayout =
    parentHasAutoLayoutFromNode || parentHasAutoLayoutFromProperty;

  // Only set x/y if parent doesn't have auto-layout (or if this is a top-level node)
  if (!parentHasAutoLayout) {
    if (nodeData.x !== undefined) {
      newNode.x = nodeData.x;
    }
    if (nodeData.y !== undefined) {
      newNode.y = nodeData.y;
    }
  }
  // If parent has auto-layout, don't set x/y - auto-layout will position children automatically
  // For VECTOR nodes, we need to set size AFTER vectorPaths are set,
  // because setting vectorPaths can auto-resize the vector to fit the path bounds.
  // For other node types, set size now.
  // Check for bound variables before setting width/height
  // Note: minWidth and maxWidth are constraints, not the actual size, but we include them
  // in the check to ensure we handle them correctly
  const hasBoundVariablesForSize =
    nodeData.boundVariables &&
    typeof nodeData.boundVariables === "object" &&
    (nodeData.boundVariables.width ||
      nodeData.boundVariables.height ||
      nodeData.boundVariables.minWidth ||
      nodeData.boundVariables.maxWidth);

  // ISSUE #3 & #4 DEBUG: Check for preserveRatio and constraints before resize
  const nodeName = nodeData.name || "Unnamed";
  if (nodeData.preserveRatio !== undefined) {
    debugConsole.log(
      `  [ISSUE #3 DEBUG] "${nodeName}" has preserveRatio in nodeData: ${nodeData.preserveRatio}`,
    );
  }
  if (nodeData.constraints !== undefined) {
    debugConsole.log(
      `  [ISSUE #4 DEBUG] "${nodeName}" has constraints in nodeData: ${JSON.stringify(nodeData.constraints)}`,
    );
  }
  if (
    nodeData.constraintHorizontal !== undefined ||
    nodeData.constraintVertical !== undefined
  ) {
    debugConsole.log(
      `  [ISSUE #4 DEBUG] "${nodeName}" has constraintHorizontal: ${nodeData.constraintHorizontal}, constraintVertical: ${nodeData.constraintVertical}`,
    );
  }

  // CRITICAL: Set layoutMode and sizing modes BEFORE resize
  // This ensures that FILL mode is set before we try to resize, preventing fixed dimensions
  // from being set when they should be FILL
  if (
    nodeData.type === "FRAME" ||
    nodeData.type === "COMPONENT" ||
    nodeData.type === "COMPONENT_SET" ||
    nodeData.type === "INSTANCE"
  ) {
    // Set layoutMode first (required before sizing modes)
    if (nodeData.layoutMode !== undefined) {
      newNode.layoutMode = nodeData.layoutMode;
    }

    // Set sizing modes (must be after layoutMode)
    if (nodeData.primaryAxisSizingMode !== undefined) {
      newNode.primaryAxisSizingMode = nodeData.primaryAxisSizingMode;
    }
    if (nodeData.counterAxisSizingMode !== undefined) {
      newNode.counterAxisSizingMode = nodeData.counterAxisSizingMode;
    }

    // Set layoutSizingHorizontal and layoutSizingVertical (these control "Fill Container" behavior)
    // These are shorthands that set multiple layout properties
    // Valid values: "FIXED", "HUG", "FILL"
    // IMPORTANT: layoutSizingHorizontal/layoutSizingVertical can only be set on children of auto-layout frames
    // Check if parent has auto-layout before setting these properties
    const parentHasAutoLayout =
      parentNode &&
      "layoutMode" in parentNode &&
      parentNode.layoutMode !== undefined &&
      parentNode.layoutMode !== "NONE";

    if (parentHasAutoLayout) {
      if ((nodeData as any).layoutSizingHorizontal !== undefined) {
        try {
          (newNode as any).layoutSizingHorizontal = (
            nodeData as any
          ).layoutSizingHorizontal;
        } catch (error) {
          debugConsole.warning(
            `  ⚠️ Failed to set layoutSizingHorizontal for "${nodeData.name || "Unnamed"}": ${error}`,
          );
        }
      }
      if ((nodeData as any).layoutSizingVertical !== undefined) {
        try {
          (newNode as any).layoutSizingVertical = (
            nodeData as any
          ).layoutSizingVertical;
        } catch (error) {
          debugConsole.warning(
            `  ⚠️ Failed to set layoutSizingVertical for "${nodeData.name || "Unnamed"}": ${error}`,
          );
        }
      }
    }
  }

  // Check sizing modes and bound variables - if width should be Fill, don't set fixed dimensions
  // primaryAxisSizingMode controls width (for HORIZONTAL layout) or height (for VERTICAL layout)
  // counterAxisSizingMode controls height (for HORIZONTAL layout) or width (for VERTICAL layout)
  // Only check sizing modes if layoutMode is set (sizing modes only apply with auto-layout)
  // Note: "FILL" is not a valid value for primaryAxisSizingMode (only "FIXED" and "AUTO" are valid)
  // When maxWidth or minWidth are bound to variables, the width should be treated as "Fill"
  const layoutMode = nodeData.layoutMode;
  const hasAutoLayout = layoutMode !== undefined && layoutMode !== "NONE";
  const isHorizontal = layoutMode === "HORIZONTAL";

  // Check if width/minWidth/maxWidth are bound to variables (indicates "Fill Container" behavior)
  const hasWidthConstraints =
    hasAutoLayout &&
    nodeData.boundVariables &&
    typeof nodeData.boundVariables === "object" &&
    (nodeData.boundVariables.width ||
      (isHorizontal && nodeData.boundVariables.minWidth) ||
      (isHorizontal && nodeData.boundVariables.maxWidth));

  // Check if height/minHeight/maxHeight are bound to variables
  const hasHeightConstraints =
    hasAutoLayout &&
    nodeData.boundVariables &&
    typeof nodeData.boundVariables === "object" &&
    (nodeData.boundVariables.height ||
      (!isHorizontal && nodeData.boundVariables.minWidth) ||
      (!isHorizontal && nodeData.boundVariables.maxWidth));

  // For HORIZONTAL layout: primaryAxis = width, counterAxis = height
  // For VERTICAL layout: primaryAxis = height, counterAxis = width
  // If constraints are bound, treat that dimension as "Fill"
  const widthIsFill = hasWidthConstraints;
  const heightIsFill = hasHeightConstraints;

  if (
    nodeData.type !== "VECTOR" &&
    nodeData.type !== "BOOLEAN_OPERATION" &&
    !hasBoundVariablesForSize &&
    !widthIsFill &&
    !heightIsFill &&
    nodeData.width !== undefined &&
    nodeData.height !== undefined
  ) {
    // ISSUE #3 DEBUG: Check preserveRatio before resize
    const preserveRatioBefore = (newNode as any).preserveRatio;
    if (preserveRatioBefore !== undefined) {
      debugConsole.log(
        `  [ISSUE #3 DEBUG] "${nodeName}" preserveRatio before resize: ${preserveRatioBefore}`,
      );
    }

    newNode.resize(nodeData.width, nodeData.height);
  } else if (
    nodeData.type !== "VECTOR" &&
    nodeData.type !== "BOOLEAN_OPERATION" &&
    !hasBoundVariablesForSize &&
    (widthIsFill || heightIsFill)
  ) {
    // Handle partial sizing: set only the dimension that's not FILL
    if (widthIsFill && !heightIsFill && nodeData.height !== undefined) {
      // Width is FILL, only set height
      newNode.resize(newNode.width, nodeData.height);
      debugConsole.log(
        `  Set height to ${nodeData.height} for "${nodeName}" (width is FILL)`,
      );
    } else if (heightIsFill && !widthIsFill && nodeData.width !== undefined) {
      // Height is FILL, only set width
      newNode.resize(nodeData.width, newNode.height);
      debugConsole.log(
        `  Set width to ${nodeData.width} for "${nodeName}" (height is FILL)`,
      );
    } else if (widthIsFill && heightIsFill) {
      // Both are FILL, don't set dimensions
      debugConsole.log(
        `  Skipping resize for "${nodeName}" (both width and height are FILL)`,
      );
    }

    // ISSUE #3 DEBUG: Check preserveRatio after resize
    const preserveRatioAfter = (newNode as any).preserveRatio;
    if (preserveRatioAfter !== undefined) {
      debugConsole.log(
        `  [ISSUE #3 DEBUG] "${nodeName}" preserveRatio after resize: ${preserveRatioAfter}`,
      );
    } else if (nodeData.preserveRatio !== undefined) {
      debugConsole.warning(
        `  ⚠️ ISSUE #3: "${nodeName}" preserveRatio was in nodeData (${nodeData.preserveRatio}) but not set on node!`,
      );
    }

    // ISSUE #4: Log constraints from nodeData (what we're trying to import)
    const expectedConstraintH =
      nodeData.constraintHorizontal || nodeData.constraints?.horizontal;
    const expectedConstraintV =
      nodeData.constraintVertical || nodeData.constraints?.vertical;
    if (
      expectedConstraintH !== undefined ||
      expectedConstraintV !== undefined
    ) {
      debugConsole.log(
        `  [ISSUE #4] "${nodeName}" (${nodeData.type}) - Expected constraints from JSON: H=${expectedConstraintH || "undefined"}, V=${expectedConstraintV || "undefined"}`,
      );
    }

    // ISSUE #4 DEBUG: Check constraints after resize (before we set them)
    const constraintHorizontalAfter = (newNode as any).constraints?.horizontal;
    const constraintVerticalAfter = (newNode as any).constraints?.vertical;
    if (
      expectedConstraintH !== undefined ||
      expectedConstraintV !== undefined
    ) {
      debugConsole.log(
        `  [ISSUE #4] "${nodeName}" (${nodeData.type}) - Constraints after resize (before setting): H=${constraintHorizontalAfter || "undefined"}, V=${constraintVerticalAfter || "undefined"}`,
      );
    }

    // ISSUE #4: Set constraints if they exist in nodeData
    // Use the constraints object API: node.constraints = { horizontal: 'SCALE', vertical: 'SCALE' }
    // Note: Figma API uses the same values we export: MIN, CENTER, MAX, STRETCH, SCALE
    const hasConstraintH =
      nodeData.constraintHorizontal !== undefined ||
      nodeData.constraints?.horizontal !== undefined;
    const hasConstraintV =
      nodeData.constraintVertical !== undefined ||
      nodeData.constraints?.vertical !== undefined;

    if (hasConstraintH || hasConstraintV) {
      const exportedH =
        nodeData.constraintHorizontal || nodeData.constraints?.horizontal;
      const exportedV =
        nodeData.constraintVertical || nodeData.constraints?.vertical;

      // Use exported values directly (no mapping needed - Figma API uses same values)
      const apiH = exportedH || constraintHorizontalAfter || "MIN";
      const apiV = exportedV || constraintVerticalAfter || "MIN";

      try {
        debugConsole.log(
          `  [ISSUE #4] Setting constraints for "${nodeName}" (${nodeData.type}): H=${apiH} (from ${exportedH || "default"}), V=${apiV} (from ${exportedV || "default"})`,
        );

        // Use the constraints object API
        (newNode as any).constraints = {
          horizontal: apiH,
          vertical: apiV,
        };

        // Verify immediately after setting
        const verifyH = (newNode as any).constraints?.horizontal;
        const verifyV = (newNode as any).constraints?.vertical;
        if (verifyH === apiH && verifyV === apiV) {
          debugConsole.log(
            `  [ISSUE #4] ✓ Constraints set successfully: H=${verifyH}, V=${verifyV} for "${nodeName}"`,
          );
        } else {
          debugConsole.warning(
            `  [ISSUE #4] ⚠️ Constraints set but verification failed! Expected H=${apiH}, V=${apiV}, got H=${verifyH || "undefined"}, V=${verifyV || "undefined"} for "${nodeName}"`,
          );
        }
      } catch (error) {
        debugConsole.warning(
          `  [ISSUE #4] ✗ Failed to set constraints for "${nodeName}" (${nodeData.type}): ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    // Final verification of constraints
    const finalConstraintH = (newNode as any).constraintHorizontal;
    const finalConstraintV = (newNode as any).constraintVertical;
    if (
      expectedConstraintH !== undefined ||
      expectedConstraintV !== undefined
    ) {
      debugConsole.log(
        `  [ISSUE #4] "${nodeName}" (${nodeData.type}) - Final constraints: H=${finalConstraintH || "undefined"}, V=${finalConstraintV || "undefined"}`,
      );
      if (
        expectedConstraintH !== undefined &&
        finalConstraintH !== expectedConstraintH
      ) {
        debugConsole.warning(
          `  ⚠️ ISSUE #4: "${nodeName}" constraintHorizontal mismatch! Expected: ${expectedConstraintH}, Got: ${finalConstraintH || "undefined"}`,
        );
      }
      if (
        expectedConstraintV !== undefined &&
        finalConstraintV !== expectedConstraintV
      ) {
        debugConsole.warning(
          `  ⚠️ ISSUE #4: "${nodeName}" constraintVertical mismatch! Expected: ${expectedConstraintV}, Got: ${finalConstraintV || "undefined"}`,
        );
      }
      if (
        expectedConstraintH !== undefined &&
        expectedConstraintV !== undefined &&
        finalConstraintH === expectedConstraintH &&
        finalConstraintV === expectedConstraintV
      ) {
        debugConsole.log(
          `  ✓ ISSUE #4: "${nodeName}" constraints correctly set: H=${finalConstraintH}, V=${finalConstraintV}`,
        );
      }
    }
  } else {
    // No resize happened, but we still need to set constraints if they exist
    // ISSUE #4: Set constraints even if no resize
    // Note: VECTOR nodes have constraints set earlier (right after size is set) to avoid "not extensible" errors
    // Note: Some nodes (e.g., inside components) may be "not extensible" - wrap in try-catch
    const expectedConstraintH =
      nodeData.constraintHorizontal || nodeData.constraints?.horizontal;
    const expectedConstraintV =
      nodeData.constraintVertical || nodeData.constraints?.vertical;
    if (
      expectedConstraintH !== undefined ||
      expectedConstraintV !== undefined
    ) {
      // Skip VECTOR and BOOLEAN_OPERATION nodes - constraints are set earlier to avoid "not extensible" errors
      if (nodeData.type === "VECTOR" || nodeData.type === "BOOLEAN_OPERATION") {
        debugConsole.log(
          `  [ISSUE #4] "${nodeName}" (VECTOR) - Constraints already set earlier (skipping "no resize" path)`,
        );
      } else {
        debugConsole.log(
          `  [ISSUE #4] "${nodeName}" (${nodeData.type}) - Setting constraints (no resize): Expected H=${expectedConstraintH || "undefined"}, V=${expectedConstraintV || "undefined"}`,
        );
      }
    }

    // Skip VECTOR nodes - constraints are set earlier
    // Use the same constraints object API for the "no resize" path
    if (nodeData.type !== "VECTOR") {
      const hasConstraintHNoResize =
        nodeData.constraintHorizontal !== undefined ||
        nodeData.constraints?.horizontal !== undefined;
      const hasConstraintVNoResize =
        nodeData.constraintVertical !== undefined ||
        nodeData.constraints?.vertical !== undefined;

      if (hasConstraintHNoResize || hasConstraintVNoResize) {
        const exportedHNoResize =
          nodeData.constraintHorizontal || nodeData.constraints?.horizontal;
        const exportedVNoResize =
          nodeData.constraintVertical || nodeData.constraints?.vertical;

        // Get current constraints to preserve one if only setting the other
        const currentConstraints = (newNode as any).constraints || {};
        const currentH = currentConstraints.horizontal || "MIN";
        const currentV = currentConstraints.vertical || "MIN";

        // Use exported values directly (no mapping needed - Figma API uses same values)
        const apiHNoResize = exportedHNoResize || currentH;
        const apiVNoResize = exportedVNoResize || currentV;

        try {
          debugConsole.log(
            `  [ISSUE #4] Setting constraints for "${nodeName}" (${nodeData.type}) (no resize): H=${apiHNoResize} (from ${exportedHNoResize || "current"}), V=${apiVNoResize} (from ${exportedVNoResize || "current"})`,
          );

          // Use the constraints object API
          (newNode as any).constraints = {
            horizontal: apiHNoResize,
            vertical: apiVNoResize,
          };

          // Verify immediately after setting
          const verifyHNoResize = (newNode as any).constraints?.horizontal;
          const verifyVNoResize = (newNode as any).constraints?.vertical;
          if (
            verifyHNoResize === apiHNoResize &&
            verifyVNoResize === apiVNoResize
          ) {
            debugConsole.log(
              `  [ISSUE #4] ✓ Constraints set successfully (no resize): H=${verifyHNoResize}, V=${verifyVNoResize} for "${nodeName}"`,
            );
          } else {
            debugConsole.warning(
              `  [ISSUE #4] ⚠️ Constraints set but verification failed (no resize)! Expected H=${apiHNoResize}, V=${apiVNoResize}, got H=${verifyHNoResize || "undefined"}, V=${verifyVNoResize || "undefined"} for "${nodeName}"`,
            );
          }
        } catch (error) {
          debugConsole.warning(
            `  [ISSUE #4] ✗ Failed to set constraints for "${nodeName}" (${nodeData.type}) (no resize): ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    }

    // Final verification for no-resize case (skip VECTOR and BOOLEAN_OPERATION nodes - already verified earlier)
    if (
      nodeData.type !== "VECTOR" &&
      nodeData.type !== "BOOLEAN_OPERATION" &&
      (expectedConstraintH !== undefined || expectedConstraintV !== undefined)
    ) {
      const finalConstraintH = (newNode as any).constraints?.horizontal;
      const finalConstraintV = (newNode as any).constraints?.vertical;
      debugConsole.log(
        `  [ISSUE #4] "${nodeName}" (${nodeData.type}) - Final constraints (no resize): H=${finalConstraintH || "undefined"}, V=${finalConstraintV || "undefined"}`,
      );
      if (
        expectedConstraintH !== undefined &&
        finalConstraintH !== expectedConstraintH
      ) {
        debugConsole.warning(
          `  ⚠️ ISSUE #4: "${nodeName}" constraintHorizontal mismatch! Expected: ${expectedConstraintH}, Got: ${finalConstraintH || "undefined"}`,
        );
      }
      if (
        expectedConstraintV !== undefined &&
        finalConstraintV !== expectedConstraintV
      ) {
        debugConsole.warning(
          `  ⚠️ ISSUE #4: "${nodeName}" constraintVertical mismatch! Expected: ${expectedConstraintV}, Got: ${finalConstraintV || "undefined"}`,
        );
      }
      // Compare directly (no mapping needed - Figma API uses same values)
      if (
        expectedConstraintH !== undefined &&
        expectedConstraintV !== undefined &&
        finalConstraintH === expectedConstraintH &&
        finalConstraintV === expectedConstraintV
      ) {
        debugConsole.log(
          `  ✓ ISSUE #4: "${nodeName}" constraints correctly set (no resize): H=${finalConstraintH}, V=${finalConstraintV}`,
        );
      }
    }
  }

  // Set visual properties if they exist
  // Check for bound variables before setting direct values
  const hasBoundVariables =
    nodeData.boundVariables && typeof nodeData.boundVariables === "object";
  if (nodeData.visible !== undefined) {
    newNode.visible = nodeData.visible;
  }
  if (nodeData.locked !== undefined) {
    newNode.locked = nodeData.locked;
  }
  if (
    nodeData.opacity !== undefined &&
    (!hasBoundVariables || !nodeData.boundVariables.opacity)
  ) {
    newNode.opacity = nodeData.opacity;
  }
  if (
    nodeData.rotation !== undefined &&
    (!hasBoundVariables || !nodeData.boundVariables.rotation)
  ) {
    newNode.rotation = nodeData.rotation;
  }
  if (
    nodeData.blendMode !== undefined &&
    (!hasBoundVariables || !nodeData.boundVariables.blendMode)
  ) {
    newNode.blendMode = nodeData.blendMode;
  }

  // Set fills (skip instances, they're handled separately)
  // For FRAME and COMPONENT nodes, if fills are undefined, explicitly clear them
  // to prevent default white fills from appearing
  if (nodeData.type !== "INSTANCE") {
    // DEBUG: Log bound variables for VECTOR nodes (for "Selection colors" issue)
    if (nodeData.type === "VECTOR" && nodeData.boundVariables) {
      debugConsole.log(
        `  DEBUG: VECTOR "${nodeData.name || "Unnamed"}" (ID: ${nodeData.id?.substring(0, 8) || "unknown"}...) has boundVariables: ${Object.keys(nodeData.boundVariables).join(", ")}`,
      );
      if (nodeData.boundVariables.fills) {
        debugConsole.log(
          `  DEBUG:   boundVariables.fills: ${JSON.stringify(nodeData.boundVariables.fills)}`,
        );
      }
    }
    if (nodeData.fills !== undefined) {
      try {
        // Process fills array - restore images first, then remove boundVariables that contain _varRef
        // We'll restore boundVariables properly after setting the fills
        let fills = nodeData.fills;

        // Restore image references from image table
        if (Array.isArray(fills) && imageTable) {
          fills = await restoreImageReferences(fills, imageTable);
        }

        // ISSUE #2 DEBUG: Check for selectionColor in fills before processing
        const nodeName = nodeData.name || "Unnamed";
        if (Array.isArray(fills)) {
          for (let i = 0; i < fills.length; i++) {
            const fill = fills[i];
            if (fill && typeof fill === "object") {
              if ((fill as any).selectionColor !== undefined) {
                debugConsole.log(
                  `  [ISSUE #2 DEBUG] "${nodeName}" fill[${i}] has selectionColor: ${JSON.stringify((fill as any).selectionColor)}`,
                );
              }
            }
          }
        }

        if (Array.isArray(fills)) {
          const nodeName = nodeData.name || "Unnamed";
          // ISSUE #2 DEBUG: Check for selectionColor before processing
          for (let i = 0; i < fills.length; i++) {
            const fill = fills[i];
            if (
              fill &&
              typeof fill === "object" &&
              fill.selectionColor !== undefined
            ) {
              debugConsole.warning(
                `  ⚠️ ISSUE #2: "${nodeName}" fill[${i}] has selectionColor that will be preserved: ${JSON.stringify(fill.selectionColor)}`,
              );
            }
          }
          fills = fills.map((fill: any) => {
            if (fill && typeof fill === "object") {
              // Create a copy without boundVariables (they may contain _varRef which is invalid)
              const fillWithoutBoundVars = { ...fill };
              delete fillWithoutBoundVars.boundVariables;
              // ISSUE #2: Don't delete selectionColor - we need to preserve it
              // delete fillWithoutBoundVars.selectionColor; // REMOVED - preserve selectionColor
              return fillWithoutBoundVars;
            }
            return fill;
          });
        }

        // Restore bound variables from fill items themselves (e.g., fills[0].bndVar.color)
        // This handles cases where bound variables are stored directly in fill items
        // We need to create new fill objects with boundVariables included, not modify existing ones
        if (
          nodeData.fills &&
          Array.isArray(nodeData.fills) &&
          recognizedVariables
        ) {
          // DEBUG: Log fill items for VECTOR nodes
          if (nodeData.type === "VECTOR") {
            debugConsole.log(
              `  DEBUG: VECTOR "${nodeData.name || "Unnamed"}" has ${nodeData.fills.length} fill(s)`,
            );
            for (let i = 0; i < nodeData.fills.length; i++) {
              const fillData = nodeData.fills[i];
              if (fillData && typeof fillData === "object") {
                const fillBoundVars =
                  fillData.boundVariables || fillData.bndVar;
                if (fillBoundVars) {
                  debugConsole.log(
                    `  DEBUG:   fill[${i}] has boundVariables: ${JSON.stringify(fillBoundVars)}`,
                  );
                } else {
                  debugConsole.log(
                    `  DEBUG:   fill[${i}] has no boundVariables`,
                  );
                }
              }
            }
          }

          // Create new fill objects with boundVariables
          // Priority: node-level boundVariables.fills (instance overrides) > fill-level boundVariables
          const fillsWithBoundVars: any[] = [];
          const nodeLevelFillsBoundVars = nodeData.boundVariables?.fills;
          const hasNodeLevelFillsOverrides = Array.isArray(
            nodeLevelFillsBoundVars,
          );

          for (let i = 0; i < fills.length; i++) {
            const fill = fills[i];
            const fillData = nodeData.fills[i];

            if (!fillData || typeof fillData !== "object") {
              fillsWithBoundVars.push(fill);
              continue;
            }

            // Create a new fill object with boundVariables
            const newFill = { ...fill };
            newFill.boundVariables = {};

            // Check for node-level boundVariables.fills first (instance child overrides take precedence)
            let boundVarsToProcess: any = null;
            if (hasNodeLevelFillsOverrides && nodeLevelFillsBoundVars[i]) {
              // Node-level override exists for this fill index
              boundVarsToProcess = nodeLevelFillsBoundVars[i];
              debugConsole.log(
                `  [INSTANCE OVERRIDE] Using node-level boundVariables.fills[${i}] for "${newNode.name || "Unnamed"}" (${nodeData.type})`,
              );
            } else {
              // Fall back to fill-level boundVariables
              boundVarsToProcess = fillData.boundVariables || fillData.bndVar;
            }

            if (!boundVarsToProcess) {
              fillsWithBoundVars.push(newFill);
              continue;
            }

            // Handle both direct variable reference format ({ _varRef: ... }) and object format ({ color: { _varRef: ... } })
            if (isVariableReference(boundVarsToProcess)) {
              // Direct variable reference - bind to color property
              const varRef = (boundVarsToProcess as VariableReference)._varRef;
              if (varRef !== undefined && recognizedVariables) {
                let variable = recognizedVariables.get(String(varRef));

                // Verify that the variable found in recognizedVariables matches the variable table entry
                if (variable && variableTable) {
                  const varEntry = variableTable.getVariableByIndex(varRef);
                  if (varEntry && variable.name !== varEntry.variableName) {
                    variable = undefined; // Clear so we resolve from table
                  }
                }

                // If not found or name mismatch, try to resolve from variable table
                if (!variable) {
                  if (
                    variableTable &&
                    collectionTable &&
                    recognizedCollections
                  ) {
                    const resolvedVariable = await resolveVariableFromTable(
                      varRef,
                      variableTable,
                      collectionTable,
                      recognizedCollections,
                    );
                    variable = resolvedVariable || undefined;
                    if (variable) {
                      recognizedVariables.set(String(varRef), variable);
                    }
                  }
                }

                if (variable) {
                  newFill.boundVariables.color = {
                    type: "VARIABLE_ALIAS",
                    id: variable.id,
                  };
                  const isBadgeLabelVar =
                    variable.name.includes("badge/color/label");
                  if (isBadgeLabelVar) {
                    debugConsole.log(
                      `  [IMPORT DEBUG] [INSTANCE OVERRIDE] Restored bound variable for fill[${i}].color on "${newNode.name || "Unnamed"}" (${nodeData.type}): variable "${variable.name}" (ID: ${variable.id.substring(0, 8)}...) from table index ${varRef}`,
                    );
                  }
                }
              }
            } else {
              // Object format - process each property (e.g., color, opacity)
              // Restore bound variables from boundVariables/bndVar (e.g., boundVariables.color)
              for (const [propName, varInfo] of Object.entries(
                boundVarsToProcess,
              )) {
                // DEBUG: Log what we're processing
                const isBadgeLabelVar =
                  nodeData.type === "TEXT" &&
                  (newNode.name || "").toLowerCase().includes("text");
                if (nodeData.type === "VECTOR" || isBadgeLabelVar) {
                  debugConsole.log(
                    `  DEBUG: Processing fill[${i}].${propName} on ${nodeData.type} "${newNode.name || "Unnamed"}": varInfo=${JSON.stringify(varInfo)}`,
                  );
                }
                if (isVariableReference(varInfo)) {
                  const varRef = (varInfo as VariableReference)._varRef;
                  if (varRef !== undefined && recognizedVariables) {
                    // DEBUG: Log variable lookup
                    if (nodeData.type === "VECTOR" || isBadgeLabelVar) {
                      debugConsole.log(
                        `  DEBUG: Looking up variable reference ${varRef} in recognizedVariables (map has ${recognizedVariables.size} entries)`,
                      );
                      // DEBUG: List available variable references
                      const availableRefs = Array.from(
                        recognizedVariables.keys(),
                      ).slice(0, 10);
                      debugConsole.log(
                        `  DEBUG: Available variable references (first 10): ${availableRefs.join(", ")}`,
                      );
                      // Check if the specific variable reference exists
                      const hasVarRef = recognizedVariables.has(String(varRef));
                      debugConsole.log(
                        `  DEBUG: Variable reference ${varRef} ${hasVarRef ? "found" : "NOT FOUND"} in recognizedVariables`,
                      );
                      if (!hasVarRef) {
                        // List all available references to help debug
                        const allRefs = Array.from(
                          recognizedVariables.keys(),
                        ).sort((a, b) => parseInt(a) - parseInt(b));
                        debugConsole.log(
                          `  DEBUG: All available variable references: ${allRefs.join(", ")}`,
                        );
                      }
                      // For badge/color/label variables, also check what's in the variable table
                      if (variableTable) {
                        const varEntry =
                          variableTable.getVariableByIndex(varRef);
                        if (
                          varEntry &&
                          varEntry.variableName.includes("badge/color/label")
                        ) {
                          debugConsole.log(
                            `  [IMPORT DEBUG] Variable table index ${varRef} contains: "${varEntry.variableName}"`,
                          );
                        }
                      }
                    }
                    let variable = recognizedVariables.get(String(varRef));

                    // Verify that the variable found in recognizedVariables matches the variable table entry
                    // This ensures we're using the correct variable even if indices don't match
                    if (variable && variableTable) {
                      const varEntry = variableTable.getVariableByIndex(varRef);
                      if (varEntry && variable.name !== varEntry.variableName) {
                        // Variable name doesn't match - the index points to a different variable
                        // Fall back to resolving from table by name
                        debugConsole.log(
                          `  Variable reference ${varRef} found in recognizedVariables but name mismatch: expected "${varEntry.variableName}", found "${variable.name}". Resolving from table...`,
                        );
                        variable = undefined; // Clear so we resolve from table
                      }
                    }

                    // If not found in recognizedVariables or name mismatch, try to resolve from variable table
                    if (!variable) {
                      if (nodeData.type === "VECTOR") {
                        debugConsole.log(
                          `  DEBUG: Variable ${varRef} not in recognizedVariables or name mismatch. variableTable=${!!variableTable}, collectionTable=${!!collectionTable}, recognizedCollections=${!!recognizedCollections}`,
                        );
                      }
                      if (
                        variableTable &&
                        collectionTable &&
                        recognizedCollections
                      ) {
                        debugConsole.log(
                          `  Variable reference ${varRef} not in recognizedVariables or name mismatch, attempting to resolve from variable table...`,
                        );
                        const resolvedVariable = await resolveVariableFromTable(
                          varRef,
                          variableTable,
                          collectionTable,
                          recognizedCollections,
                        );
                        variable = resolvedVariable || undefined;
                        if (variable) {
                          // Add to recognizedVariables for future lookups
                          recognizedVariables.set(String(varRef), variable);
                          debugConsole.log(
                            `  ✓ Resolved variable ${variable.name} from variable table and added to recognizedVariables`,
                          );
                        } else {
                          debugConsole.warning(
                            `  Failed to resolve variable ${varRef} from variable table`,
                          );
                        }
                      } else {
                        if (nodeData.type === "VECTOR") {
                          debugConsole.warning(
                            `  Cannot resolve variable ${varRef} from table - missing required parameters`,
                          );
                        }
                      }
                    }
                    if (variable) {
                      newFill.boundVariables[propName] = {
                        type: "VARIABLE_ALIAS",
                        id: variable.id,
                      };
                      // Debug logging for badge/color/label variables
                      const isBadgeLabelVar =
                        variable.name.includes("badge/color/label");
                      if (isBadgeLabelVar) {
                        debugConsole.log(
                          `  [IMPORT DEBUG] Restored bound variable for fill[${i}].${propName} on "${newNode.name || "Unnamed"}" (${nodeData.type}): variable "${variable.name}" (ID: ${variable.id.substring(0, 8)}...) from table index ${varRef}`,
                        );
                        if (variableTable) {
                          const varEntry =
                            variableTable.getVariableByIndex(varRef);
                          if (varEntry) {
                            debugConsole.log(
                              `  [IMPORT DEBUG] Variable table entry at index ${varRef}: "${varEntry.variableName}"`,
                            );
                          }
                        }
                      }
                      debugConsole.log(
                        `  ✓ Restored bound variable for fill[${i}].${propName} on "${newNode.name || "Unnamed"}" (${nodeData.type}): variable ${variable.name} (ID: ${variable.id.substring(0, 8)}...)`,
                      );
                    } else {
                      debugConsole.warning(
                        `  Variable reference ${varRef} not found in recognizedVariables for fill[${i}].${propName} on "${newNode.name || "Unnamed"}"`,
                      );
                    }
                  } else {
                    if (nodeData.type === "VECTOR") {
                      debugConsole.warning(
                        `  DEBUG: Variable reference ${varRef} is undefined for fill[${i}].${propName} on VECTOR "${newNode.name || "Unnamed"}"`,
                      );
                    }
                  }
                } else {
                  if (nodeData.type === "VECTOR") {
                    debugConsole.warning(
                      `  DEBUG: fill[${i}].${propName} on VECTOR "${newNode.name || "Unnamed"}" is not a variable reference: ${JSON.stringify(varInfo)}`,
                    );
                  }
                }
              }
            }

            fillsWithBoundVars.push(newFill);
          }

          // Set fills with boundVariables
          newNode.fills = fillsWithBoundVars;
          debugConsole.log(
            `  ✓ Set fills with boundVariables on "${newNode.name || "Unnamed"}" (${nodeData.type})`,
          );

          // ISSUE #2 DEBUG: Check for selectionColor after setting fills with boundVariables
          const fillsAfter = newNode.fills;
          const nodeName = nodeData.name || "Unnamed";
          if (Array.isArray(fillsAfter)) {
            for (let i = 0; i < fillsAfter.length; i++) {
              const fill = fillsAfter[i];
              if (fill && typeof fill === "object") {
                if ((fill as any).selectionColor !== undefined) {
                  debugConsole.warning(
                    `  ⚠️ ISSUE #2: "${nodeName}" fill[${i}] has selectionColor AFTER setting with boundVariables: ${JSON.stringify((fill as any).selectionColor)}`,
                  );
                }
              }
            }
          }
        } else {
          // Set fills without boundVariables if we can't restore them
          newNode.fills = fills;

          // ISSUE #2 DEBUG: Check for selectionColor after setting fills
          const fillsAfter = newNode.fills;
          const nodeName = nodeData.name || "Unnamed";
          if (Array.isArray(fillsAfter)) {
            for (let i = 0; i < fillsAfter.length; i++) {
              const fill = fillsAfter[i];
              if (fill && typeof fill === "object") {
                if ((fill as any).selectionColor !== undefined) {
                  debugConsole.warning(
                    `  ⚠️ ISSUE #2: "${nodeName}" fill[${i}] has selectionColor AFTER setting: ${JSON.stringify((fill as any).selectionColor)}`,
                  );
                }
              }
            }
          }
        }

        // Note: Bound variables for fills are restored with priority:
        // 1. nodeData.boundVariables.fills (instance child overrides) - handled first in the fill loop
        // 2. fillData.boundVariables (main component values) - fallback in the fill loop
        // We only need to check for other boundVariables (not fills) at the node level
        if (
          nodeData.boundVariables &&
          Object.keys(nodeData.boundVariables).length > 0 &&
          !nodeData.boundVariables.fills
        ) {
          debugConsole.log(
            `  Node "${newNode.name || "Unnamed"}" (${nodeData.type}) has boundVariables but not for fills: ${Object.keys(nodeData.boundVariables).join(", ")}`,
          );
        }
      } catch (error) {
        console.log("Error setting fills:", error);
      }
    } else if (
      nodeData.type === "FRAME" ||
      nodeData.type === "COMPONENT" ||
      nodeData.type === "COMPONENT_SET" ||
      nodeData.type === "GROUP"
    ) {
      // For FRAME, COMPONENT, and GROUP nodes, if fills are not specified,
      // explicitly clear them to prevent default white fills
      try {
        newNode.fills = [];
      } catch (error) {
        console.log("Error clearing fills:", error);
      }
    }
  }

  // Set backgrounds (skip instances, they're handled separately)
  // Backgrounds work similarly to fills and are supported on FRAME, COMPONENT, and COMPONENT_SET nodes
  if (nodeData.type !== "INSTANCE") {
    if (nodeData.backgrounds !== undefined) {
      try {
        // Process backgrounds array - restore images first, then remove boundVariables that contain _varRef
        // We'll restore boundVariables properly after setting the backgrounds
        let backgrounds = nodeData.backgrounds;

        // Restore image references from image table
        if (Array.isArray(backgrounds) && imageTable) {
          backgrounds = await restoreImageReferences(backgrounds, imageTable);
        }

        if (Array.isArray(backgrounds)) {
          backgrounds = backgrounds.map((background: any) => {
            if (background && typeof background === "object") {
              // Create a copy without boundVariables (they may contain _varRef which is invalid)
              const backgroundWithoutBoundVars = { ...background };
              delete backgroundWithoutBoundVars.boundVariables;
              return backgroundWithoutBoundVars;
            }
            return background;
          });
        }

        // Set backgrounds
        if (Array.isArray(backgrounds) && backgrounds.length > 0) {
          newNode.backgrounds = backgrounds;
        } else {
          // Explicitly clear backgrounds if empty array
          newNode.backgrounds = [];
        }

        // Restore bound variables for backgrounds
        if (
          nodeData.boundVariables?.backgrounds &&
          recognizedVariables &&
          Array.isArray(newNode.backgrounds) &&
          newNode.backgrounds.length > 0
        ) {
          await restoreBoundVariablesForFills(
            newNode,
            nodeData.boundVariables,
            "backgrounds",
            recognizedVariables,
            variableTable,
            collectionTable,
            recognizedCollections,
          );
        }
      } catch (error) {
        debugConsole.warning(`Error setting backgrounds: ${error}`);
      }
    }
  }

  // Set strokes - explicitly handle empty arrays to clear default strokes
  if (nodeData.strokes !== undefined) {
    try {
      if (nodeData.strokes.length > 0) {
        newNode.strokes = nodeData.strokes;
      } else {
        // Explicitly clear strokes if empty array (vectors might have default strokes)
        newNode.strokes = [];
      }
    } catch (error) {
      console.log("Error setting strokes:", error);
    }
  } else if (nodeData.type === "VECTOR") {
    // For vectors, if strokes are not specified, clear any default strokes
    // Vectors created with figma.createVector() might have default strokes
    try {
      newNode.strokes = [];
    } catch {
      // Ignore errors if strokes can't be set
    }
  }

  // Set additional properties for better visual similarity
  // Check for bound variables before setting direct values
  const hasBoundVariablesForStroke =
    nodeData.boundVariables &&
    typeof nodeData.boundVariables === "object" &&
    (nodeData.boundVariables.strokeWeight ||
      nodeData.boundVariables.strokeAlign);
  if (nodeData.strokeWeight !== undefined) {
    if (!hasBoundVariablesForStroke || !nodeData.boundVariables.strokeWeight) {
      newNode.strokeWeight = nodeData.strokeWeight;
    }
  } else if (
    nodeData.type === "VECTOR" &&
    (nodeData.strokes === undefined || nodeData.strokes.length === 0) &&
    (!hasBoundVariablesForStroke || !nodeData.boundVariables.strokeWeight)
  ) {
    // If no strokes, ensure strokeWeight is 0 (vectors might have default strokeWeight)
    newNode.strokeWeight = 0;
  }
  if (
    nodeData.strokeAlign !== undefined &&
    (!hasBoundVariablesForStroke || !nodeData.boundVariables.strokeAlign)
  ) {
    newNode.strokeAlign = nodeData.strokeAlign;
  }
  // Check for bound variables for corner radius properties
  const hasBoundVariablesForCornerRadius =
    nodeData.boundVariables &&
    typeof nodeData.boundVariables === "object" &&
    (nodeData.boundVariables.cornerRadius ||
      nodeData.boundVariables.topLeftRadius ||
      nodeData.boundVariables.topRightRadius ||
      nodeData.boundVariables.bottomLeftRadius ||
      nodeData.boundVariables.bottomRightRadius);
  if (
    nodeData.cornerRadius !== undefined &&
    (!hasBoundVariablesForCornerRadius || !nodeData.boundVariables.cornerRadius)
  ) {
    newNode.cornerRadius = nodeData.cornerRadius;
  }
  if (nodeData.effects !== undefined && nodeData.effects.length > 0) {
    newNode.effects = nodeData.effects;
  }

  // Set layout properties for frames, components, and instances
  // Order matters: fixed dimensions first (already set above), then auto-layout, then wrap
  if (
    nodeData.type === "FRAME" ||
    nodeData.type === "COMPONENT" ||
    nodeData.type === "COMPONENT_SET" ||
    nodeData.type === "INSTANCE"
  ) {
    // Step 1: Set auto-layout mode (must be set before wrap)
    if (nodeData.layoutMode !== undefined) {
      // Ensure layoutMode is a valid value
      const validLayoutModes = ["NONE", "HORIZONTAL", "VERTICAL"];
      if (validLayoutModes.includes(nodeData.layoutMode)) {
        newNode.layoutMode = nodeData.layoutMode;
      } else {
        debugConsole.warning(
          `Invalid layoutMode value "${nodeData.layoutMode}" for node "${nodeData.name || "Unnamed"}", skipping layoutMode setting`,
        );
      }
    }

    // CRITICAL: Set bound variables for padding/itemSpacing IMMEDIATELY after layoutMode
    // Padding properties only exist after layoutMode is set, so we must set them here
    // This must happen BEFORE any direct values are set, as direct values prevent bound variables
    if (
      nodeData.layoutMode !== undefined &&
      nodeData.layoutMode !== "NONE" &&
      nodeData.boundVariables &&
      recognizedVariables
    ) {
      const paddingProps: Array<
        | "paddingLeft"
        | "paddingRight"
        | "paddingTop"
        | "paddingBottom"
        | "itemSpacing"
      > = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing",
      ];
      for (const propName of paddingProps) {
        const varInfo = nodeData.boundVariables[propName];
        if (varInfo && isVariableReference(varInfo)) {
          const varRef = (varInfo as VariableReference)._varRef;
          if (varRef !== undefined) {
            const variable = recognizedVariables.get(String(varRef));
            if (variable) {
              const alias: VariableAlias = {
                type: "VARIABLE_ALIAS",
                id: variable.id,
              };
              if (!(newNode as any).boundVariables) {
                (newNode as any).boundVariables = {};
              }

              // CRITICAL: In Figma, you cannot set a bound variable if the property has a direct value
              // The property must not have a direct value before we can bind it to a variable
              // Since we can't set padding to undefined, we need to ensure the property doesn't have
              // a direct value by checking and handling it appropriately
              // However, we cannot clear padding properties (they require a value)
              // The issue is that Figma sets default padding (0) when creating components,
              // so properties already have direct values when we try to bind variables

              // Log the current state before attempting to set bound variable
              const currentValue = (newNode as any)[propName];
              const currentBoundVar = (newNode as any).boundVariables?.[
                propName
              ];

              debugConsole.log(
                `  DEBUG: Attempting to set bound variable for ${propName} on "${nodeData.name || "Unnamed"}": current value=${currentValue}, current boundVar=${JSON.stringify(currentBoundVar)}`,
              );

              // Use Figma's setBoundVariable API method (not direct assignment)
              // Based on test results, all approaches work, but using the API method is the correct way
              // First, try to remove any existing binding by setting to null
              try {
                (newNode as any).setBoundVariable(propName, null);
              } catch {
                // Ignore errors when removing (might not exist)
              }

              // Set the bound variable using Figma's API
              // This is the correct way to bind variables - direct assignment to boundVariables doesn't work
              try {
                (newNode as any).setBoundVariable(propName, variable);

                // Immediately check if it was set
                const immediatelyAfter = (newNode as any).boundVariables?.[
                  propName
                ];
                debugConsole.log(
                  `  DEBUG: Immediately after setting ${propName} bound variable: ${JSON.stringify(immediatelyAfter)}`,
                );
              } catch (error) {
                debugConsole.warning(
                  `  Error setting bound variable for ${propName}: ${error instanceof Error ? error.message : String(error)}`,
                );
              }

              // Verify the bound variable was actually set and persisted
              const setBoundVar = (newNode as any).boundVariables?.[propName];

              // ISSUE #1 DEBUG: Enhanced logging for itemSpacing variable binding
              if (propName === "itemSpacing") {
                const finalValue = (newNode as any)[propName];
                const finalBoundVar = (newNode as any).boundVariables?.[
                  propName
                ];
                debugConsole.log(
                  `  [ISSUE #1 DEBUG] itemSpacing variable binding for "${nodeData.name || "Unnamed"}":`,
                );
                debugConsole.log(`    - Expected variable ref: ${varRef}`);
                debugConsole.log(
                  `    - Final itemSpacing value: ${finalValue}`,
                );
                debugConsole.log(
                  `    - Final boundVariable: ${JSON.stringify(finalBoundVar)}`,
                );
                debugConsole.log(
                  `    - Variable found: ${variable ? `Yes (ID: ${variable.id})` : "No"}`,
                );
                if (!setBoundVar || !setBoundVar.id) {
                  debugConsole.warning(
                    `    ⚠️ ISSUE #1: itemSpacing variable binding FAILED - boundVariable not set correctly!`,
                  );
                } else {
                  debugConsole.log(
                    `    ✓ itemSpacing variable binding SUCCESS`,
                  );
                }
              }

              if (
                setBoundVar &&
                typeof setBoundVar === "object" &&
                setBoundVar.type === "VARIABLE_ALIAS" &&
                setBoundVar.id === variable.id
              ) {
                debugConsole.log(
                  `  ✓ Set bound variable for ${propName} on "${nodeData.name || "Unnamed"}" (${nodeData.type}): variable ${variable.name} (ID: ${variable.id.substring(0, 8)}...)`,
                );
              } else {
                debugConsole.warning(
                  `  Failed to set bound variable for ${propName} on "${nodeData.name || "Unnamed"}" - verification failed. Expected: ${JSON.stringify(alias)}, Got: ${JSON.stringify(setBoundVar)}`,
                );
              }
            }
          }
        }
      }
    }

    // CRITICAL: Set itemSpacing IMMEDIATELY after layoutMode (if not bound to a variable)
    // itemSpacing property only exists after layoutMode is set
    // This must happen before other layout properties to ensure it's set correctly
    if (
      nodeData.layoutMode !== undefined &&
      nodeData.layoutMode !== "NONE" &&
      nodeData.itemSpacing !== undefined
    ) {
      const hasBoundVariableForItemSpacing =
        nodeData.boundVariables &&
        typeof nodeData.boundVariables === "object" &&
        nodeData.boundVariables.itemSpacing;

      if (!hasBoundVariableForItemSpacing) {
        debugConsole.log(
          `  Setting itemSpacing to ${nodeData.itemSpacing} for "${nodeData.name || "Unnamed"}" (${nodeData.type})`,
        );
        newNode.itemSpacing = nodeData.itemSpacing;
        debugConsole.log(
          `  ✓ Set itemSpacing to ${newNode.itemSpacing} (verified)`,
        );
      } else {
        debugConsole.log(
          `  Skipping itemSpacing (bound to variable) for "${nodeData.name || "Unnamed"}"`,
        );
      }
    } else {
      if (
        nodeData.type === "FRAME" ||
        nodeData.type === "COMPONENT" ||
        nodeData.type === "COMPONENT_SET" ||
        nodeData.type === "INSTANCE"
      ) {
        debugConsole.log(
          `  DEBUG: Not setting itemSpacing for "${nodeData.name || "Unnamed"}": layoutMode=${nodeData.layoutMode}, itemSpacing=${nodeData.itemSpacing}`,
        );
      }
    }

    // Step 2: Set wrap (must be set after layoutMode)
    if (nodeData.layoutWrap !== undefined) {
      newNode.layoutWrap = nodeData.layoutWrap;
    }
    // Step 3: Set other layout properties
    // Note: layoutMode and sizing modes are already set earlier (before resize)
    // Only set defaults here if they weren't set earlier
    if (
      (nodeData.type === "FRAME" ||
        nodeData.type === "COMPONENT" ||
        nodeData.type === "COMPONENT_SET" ||
        nodeData.type === "INSTANCE") &&
      nodeData.primaryAxisSizingMode === undefined &&
      newNode.primaryAxisSizingMode === undefined
    ) {
      // Default to AUTO (Hug) if not specified
      newNode.primaryAxisSizingMode = "AUTO";
    }
    if (
      (nodeData.type === "FRAME" ||
        nodeData.type === "COMPONENT" ||
        nodeData.type === "COMPONENT_SET" ||
        nodeData.type === "INSTANCE") &&
      nodeData.counterAxisSizingMode === undefined &&
      newNode.counterAxisSizingMode === undefined
    ) {
      // Default to AUTO (Hug) if not specified
      newNode.counterAxisSizingMode = "AUTO";
    }
    if (nodeData.primaryAxisAlignItems !== undefined) {
      newNode.primaryAxisAlignItems = nodeData.primaryAxisAlignItems;
    }
    if (nodeData.counterAxisAlignItems !== undefined) {
      newNode.counterAxisAlignItems = nodeData.counterAxisAlignItems;
    }

    // Note: Bound variables for padding/itemSpacing are already set above (right after layoutMode)
    // to ensure they're set before any direct values that might block them

    // Check for bound variables before setting direct values
    // Setting a property directly overwrites variable bindings, so we need to check first
    const hasBoundVariables =
      nodeData.boundVariables && typeof nodeData.boundVariables === "object";
    // Debug: Log padding bound variables if they exist
    if (hasBoundVariables) {
      const paddingBoundVars = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing",
      ].filter((prop) => nodeData.boundVariables[prop]);
      if (paddingBoundVars.length > 0) {
        debugConsole.log(
          `  DEBUG: Node "${nodeData.name || "Unnamed"}" (${nodeData.type}) has bound variables for: ${paddingBoundVars.join(", ")}`,
        );
      }
    }
    // Set direct values only if bound variables don't exist
    if (
      nodeData.paddingLeft !== undefined &&
      (!hasBoundVariables || !nodeData.boundVariables.paddingLeft)
    ) {
      newNode.paddingLeft = nodeData.paddingLeft;
    }
    if (
      nodeData.paddingRight !== undefined &&
      (!hasBoundVariables || !nodeData.boundVariables.paddingRight)
    ) {
      newNode.paddingRight = nodeData.paddingRight;
    }
    if (
      nodeData.paddingTop !== undefined &&
      (!hasBoundVariables || !nodeData.boundVariables.paddingTop)
    ) {
      newNode.paddingTop = nodeData.paddingTop;
    }
    if (
      nodeData.paddingBottom !== undefined &&
      (!hasBoundVariables || !nodeData.boundVariables.paddingBottom)
    ) {
      newNode.paddingBottom = nodeData.paddingBottom;
    }
    // Set itemSpacing (only if not already set earlier and not bound to a variable)
    // Note: We already set itemSpacing right after layoutMode, but this ensures it's set
    // if the earlier code didn't run (e.g., if layoutMode was already set)
    // CRITICAL: Check if itemSpacing is actually bound to a variable on the node itself,
    // not just in nodeData, to avoid overriding a successfully set binding
    if (
      nodeData.itemSpacing !== undefined &&
      newNode.layoutMode !== undefined &&
      newNode.layoutMode !== "NONE"
    ) {
      // Check if itemSpacing is actually bound to a variable on the node
      const isActuallyBound =
        (newNode as any).boundVariables?.itemSpacing !== undefined;

      if (
        !isActuallyBound &&
        (!hasBoundVariables || !nodeData.boundVariables.itemSpacing)
      ) {
        // Only set if it's different from what we already set, or if it wasn't set earlier
        // This prevents overriding a value we already set correctly
        if (newNode.itemSpacing !== nodeData.itemSpacing) {
          debugConsole.log(
            `  Setting itemSpacing to ${nodeData.itemSpacing} for "${nodeData.name || "Unnamed"}" (late setting)`,
          );
          newNode.itemSpacing = nodeData.itemSpacing;
        }
      } else if (isActuallyBound) {
        debugConsole.log(
          `  Skipping late setting of itemSpacing for "${nodeData.name || "Unnamed"}" - already bound to variable`,
        );
      }
    }
    // Set counterAxisSpacing (vertical gap for horizontal layouts, horizontal gap for vertical layouts)
    if (
      nodeData.counterAxisSpacing !== undefined &&
      (!hasBoundVariables || !nodeData.boundVariables.counterAxisSpacing) &&
      newNode.layoutMode !== undefined &&
      newNode.layoutMode !== "NONE"
    ) {
      newNode.counterAxisSpacing = nodeData.counterAxisSpacing;
    }
    if (nodeData.layoutGrow !== undefined) {
      newNode.layoutGrow = nodeData.layoutGrow;
    }
  }

  // Set vector and line properties
  if (
    nodeData.type === "VECTOR" ||
    nodeData.type === "BOOLEAN_OPERATION" ||
    nodeData.type === "LINE"
  ) {
    if (nodeData.strokeCap !== undefined) {
      newNode.strokeCap = nodeData.strokeCap;
    }
    if (nodeData.strokeJoin !== undefined) {
      newNode.strokeJoin = nodeData.strokeJoin;
    }
    if (nodeData.dashPattern !== undefined && nodeData.dashPattern.length > 0) {
      newNode.dashPattern = nodeData.dashPattern;
    }
    // Set vector paths for VECTOR and BOOLEAN_OPERATION nodes (critical for displaying paths)
    // fillGeometry is read-only, so we need to use vectorPaths instead
    if (nodeData.type === "VECTOR" || nodeData.type === "BOOLEAN_OPERATION") {
      if (nodeData.fillGeometry !== undefined) {
        try {
          // fillGeometry is read-only, but vectorPaths is writable
          // fillGeometry format: [{ data: string, windRule: string }]
          // vectorPaths format: [{ data: string, windingRule: string }]
          // Import the normalization utility (paths should already be normalized during export,
          // but we normalize again as a safety measure for backwards compatibility)
          const { normalizeSvgPath } = await import(
            "./utils/svgPathNormalizer"
          );

          const vectorPaths = nodeData.fillGeometry.map((path: any) => {
            const originalData = path.data;
            // Normalize path data (should already be normalized from export, but normalize again for safety)
            const normalizedData = normalizeSvgPath(originalData);
            return {
              data: normalizedData,
              windingRule: path.windingRule || path.windRule || "NONZERO",
            };
          });
          // Debug: log if normalization changed anything (should be rare if export normalization works)
          for (let i = 0; i < nodeData.fillGeometry.length; i++) {
            const originalData = nodeData.fillGeometry[i].data;
            const normalizedData = vectorPaths[i].data;
            if (originalData !== normalizedData) {
              debugConsole.log(
                `  Normalized path ${i + 1} for "${nodeData.name || "Unnamed"}": ${originalData.substring(0, 50)}... -> ${normalizedData.substring(0, 50)}...`,
              );
            }
          }
          (newNode as any).vectorPaths = vectorPaths;
          debugConsole.log(
            `  Set vectorPaths for VECTOR "${nodeData.name || "Unnamed"}" (${vectorPaths.length} path(s))`,
          );
        } catch (error) {
          debugConsole.warning(
            `Error setting vectorPaths for VECTOR "${nodeData.name || "Unnamed"}": ${error}`,
          );
        }
      }
      // Note: strokeGeometry might also need similar handling, but it's less common
      if (nodeData.strokeGeometry !== undefined) {
        try {
          // strokeGeometry might also be read-only, but let's try setting it
          // If it fails, we'll log a warning
          (newNode as any).strokeGeometry = nodeData.strokeGeometry;
        } catch (error) {
          debugConsole.warning(
            `Error setting strokeGeometry for VECTOR "${nodeData.name || "Unnamed"}": ${error}`,
          );
        }
      }
      // Set size AFTER vectorPaths are set, because setting vectorPaths can auto-resize the vector
      // Setting size after ensures the vector has the correct dimensions
      // Check for bound variables before setting width/height
      const hasBoundVariablesForVectorSize =
        nodeData.boundVariables &&
        typeof nodeData.boundVariables === "object" &&
        (nodeData.boundVariables.width || nodeData.boundVariables.height);
      if (
        nodeData.width !== undefined &&
        nodeData.height !== undefined &&
        !hasBoundVariablesForVectorSize
      ) {
        try {
          newNode.resize(nodeData.width, nodeData.height);
          debugConsole.log(
            `  Set size for VECTOR "${nodeData.name || "Unnamed"}" to ${nodeData.width}x${nodeData.height}`,
          );
        } catch (error) {
          debugConsole.warning(
            `Error setting size for VECTOR "${nodeData.name || "Unnamed"}": ${error}`,
          );
        }
      }

      // ISSUE #4: Set constraints for VECTOR nodes IMMEDIATELY after size is set
      // Use the constraints object API: node.constraints = { horizontal: 'SCALE', vertical: 'SCALE' }
      // Note: Figma API uses the same values we export: MIN, CENTER, MAX, STRETCH, SCALE
      // The constraints object API works even after appending to COMPONENTs (as proven by tests)
      const expectedConstraintH =
        nodeData.constraintHorizontal || nodeData.constraints?.horizontal;
      const expectedConstraintV =
        nodeData.constraintVertical || nodeData.constraints?.vertical;
      if (
        expectedConstraintH !== undefined ||
        expectedConstraintV !== undefined
      ) {
        debugConsole.log(
          `  [ISSUE #4] "${nodeData.name || "Unnamed"}" (VECTOR) - Setting constraints immediately after size: Expected H=${expectedConstraintH || "undefined"}, V=${expectedConstraintV || "undefined"}`,
        );

        // Get current constraints to preserve one if only setting the other
        const currentConstraints = (newNode as any).constraints || {};
        const currentH = currentConstraints.horizontal || "MIN";
        const currentV = currentConstraints.vertical || "MIN";

        // Use exported values directly (no mapping needed - Figma API uses same values)
        const apiH = expectedConstraintH || currentH;
        const apiV = expectedConstraintV || currentV;

        try {
          // Use the constraints object API
          (newNode as any).constraints = {
            horizontal: apiH,
            vertical: apiV,
          };

          // Verify immediately after setting
          const verifyH = (newNode as any).constraints?.horizontal;
          const verifyV = (newNode as any).constraints?.vertical;
          if (verifyH === apiH && verifyV === apiV) {
            debugConsole.log(
              `  [ISSUE #4] ✓ Constraints set successfully for "${nodeData.name || "Unnamed"}" (VECTOR): H=${verifyH}, V=${verifyV}`,
            );
          } else {
            debugConsole.warning(
              `  [ISSUE #4] ⚠️ Constraints set but verification failed! Expected H=${apiH}, V=${apiV}, got H=${verifyH || "undefined"}, V=${verifyV || "undefined"} for "${nodeData.name || "Unnamed"}"`,
            );
          }
        } catch (error) {
          debugConsole.warning(
            `  [ISSUE #4] ✗ Failed to set constraints for "${nodeData.name || "Unnamed"}" (VECTOR): ${error instanceof Error ? error.message : String(error)}`,
          );
        }

        // Final verification for VECTOR constraints
        const finalConstraintH = (newNode as any).constraints?.horizontal;
        const finalConstraintV = (newNode as any).constraints?.vertical;
        debugConsole.log(
          `  [ISSUE #4] "${nodeData.name || "Unnamed"}" (VECTOR) - Final constraints after immediate setting: H=${finalConstraintH || "undefined"}, V=${finalConstraintV || "undefined"}`,
        );
        if (
          expectedConstraintH !== undefined &&
          finalConstraintH !== expectedConstraintH
        ) {
          debugConsole.warning(
            `  ⚠️ ISSUE #4: "${nodeData.name || "Unnamed"}" constraintHorizontal mismatch! Expected: ${expectedConstraintH}, Got: ${finalConstraintH || "undefined"}`,
          );
        }
        if (
          expectedConstraintV !== undefined &&
          finalConstraintV !== expectedConstraintV
        ) {
          debugConsole.warning(
            `  ⚠️ ISSUE #4: "${nodeData.name || "Unnamed"}" constraintVertical mismatch! Expected: ${expectedConstraintV}, Got: ${finalConstraintV || "undefined"}`,
          );
        }
        if (
          expectedConstraintH !== undefined &&
          expectedConstraintV !== undefined &&
          finalConstraintH === expectedConstraintH &&
          finalConstraintV === expectedConstraintV
        ) {
          debugConsole.log(
            `  ✓ ISSUE #4: "${nodeData.name || "Unnamed"}" (VECTOR) constraints correctly set: H=${finalConstraintH}, V=${finalConstraintV}`,
          );
        }
      }
    }
  }

  // Set text properties for text nodes
  if (nodeData.type === "TEXT" && nodeData.characters !== undefined) {
    try {
      // Check for _styleRef first (new format with style table)
      let styleApplied = false;
      debugConsole.log(
        `  Processing TEXT node "${nodeData.name || "Unnamed"}": has _styleRef=${nodeData._styleRef !== undefined}, has styleMapping=${styleMapping !== null && styleMapping !== undefined}`,
      );
      if (nodeData._styleRef !== undefined) {
        if (!styleMapping) {
          // Style reference found but no style mapping - this should have been caught earlier
          // but handle gracefully by falling through to individual properties
          debugConsole.warning(
            `Text node "${nodeData.name || "Unnamed"}" has _styleRef but styles table was not imported. Using individual properties instead.`,
          );
        } else {
          const style = styleMapping.get(nodeData._styleRef);
          if (style && style.type === "TEXT") {
            // Load font from style before setting textStyleId or characters
            // This is required even though the font is in the style
            try {
              const textStyle = style as TextStyle;
              debugConsole.log(
                `  Applying text style "${style.name}" to text node "${nodeData.name || "Unnamed"}" (font: ${textStyle.fontName.family} ${textStyle.fontName.style})`,
              );
              // Try to load the font from the style
              // Even if fontName is bound to a variable, we can still try to load the current resolved font
              try {
                await figma.loadFontAsync(textStyle.fontName);
                debugConsole.log(
                  `  ✓ Loaded font "${textStyle.fontName.family} ${textStyle.fontName.style}" for style "${style.name}"`,
                );
              } catch (fontLoadError) {
                // If font loading fails (e.g., font not available or bound to variable),
                // try to load a default font as fallback
                debugConsole.warning(
                  `  Could not load font "${textStyle.fontName.family} ${textStyle.fontName.style}" for style "${style.name}": ${fontLoadError}. Trying fallback font.`,
                );
                try {
                  await figma.loadFontAsync({
                    family: "Roboto",
                    style: "Regular",
                  });
                  debugConsole.log(`  ✓ Loaded fallback font "Roboto Regular"`);
                } catch {
                  // If even default font fails, log warning but continue
                  debugConsole.warning(
                    `  Could not load fallback font for style "${style.name}" on text node "${nodeData.name || "Unnamed"}"`,
                  );
                }
              }

              // Set style first - this applies all style properties including font
              // Use setTextStyleIdAsync when document access is "dynamic-page"
              await newNode.setTextStyleIdAsync(style.id);
              debugConsole.log(
                `  ✓ Set textStyleId to "${style.id}" for style "${style.name}"`,
              );
              // Now we can safely set characters after font is loaded (or attempted)
              newNode.characters = nodeData.characters;
              debugConsole.log(
                `  ✓ Set characters: "${nodeData.characters.substring(0, 50)}${nodeData.characters.length > 50 ? "..." : ""}"`,
              );
              // Mark style as successfully applied
              styleApplied = true;

              // Even when a style is applied, we still need to set node-level properties
              // that are NOT part of the style (alignment, auto-resize, list options, etc.)
              // These properties are on the TextNode itself, not in the TextStyle
              if (nodeData.textAlignHorizontal !== undefined) {
                newNode.textAlignHorizontal = nodeData.textAlignHorizontal;
              }
              if (nodeData.textAlignVertical !== undefined) {
                newNode.textAlignVertical = nodeData.textAlignVertical;
              }
              if (nodeData.textAutoResize !== undefined) {
                newNode.textAutoResize = nodeData.textAutoResize;
              }
              if (nodeData.listOptions !== undefined) {
                newNode.listOptions = nodeData.listOptions;
              }
            } catch (styleError) {
              // If style application fails, try to fall back to individual properties
              debugConsole.warning(
                `Failed to apply style "${style.name}" on text node "${nodeData.name || "Unnamed"}": ${styleError}. Falling back to individual properties.`,
              );
              // Fall through to individual properties (styleApplied remains false)
            }
          } else {
            // Style reference invalid, fall through to individual properties
            debugConsole.warning(
              `Text node "${nodeData.name || "Unnamed"}" has invalid _styleRef (${nodeData._styleRef}). Using individual properties instead.`,
            );
          }
        }
      }

      // Only set individual properties if no valid style was applied
      if (!styleApplied) {
        // No style reference, use individual properties
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
        // Check for bound variables before setting direct values
        const hasBoundVariablesForText =
          nodeData.boundVariables &&
          typeof nodeData.boundVariables === "object" &&
          (nodeData.boundVariables.fontSize ||
            nodeData.boundVariables.letterSpacing ||
            nodeData.boundVariables.lineHeight);
        if (
          nodeData.fontSize !== undefined &&
          (!hasBoundVariablesForText || !nodeData.boundVariables.fontSize)
        ) {
          newNode.fontSize = nodeData.fontSize;
        }
        if (nodeData.textAlignHorizontal !== undefined) {
          newNode.textAlignHorizontal = nodeData.textAlignHorizontal;
        }
        if (nodeData.textAlignVertical !== undefined) {
          newNode.textAlignVertical = nodeData.textAlignVertical;
        }
        if (
          nodeData.letterSpacing !== undefined &&
          (!hasBoundVariablesForText || !nodeData.boundVariables.letterSpacing)
        ) {
          newNode.letterSpacing = nodeData.letterSpacing;
        }
        if (
          nodeData.lineHeight !== undefined &&
          (!hasBoundVariablesForText || !nodeData.boundVariables.lineHeight)
        ) {
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

    // Restore componentPropertyReferences if this node is inside a component
    // componentPropertyReferences binds node properties to component properties
    // Examples:
    //   - TEXT nodes: { characters: "Component name#3041:0" } binds text content
    //   - Any node: { visible: "Show element#3042:1" } binds visibility (BOOLEAN property)
    //   - INSTANCE nodes: binds instance swap properties
    if (
      nodeData.componentPropertyReferences &&
      typeof nodeData.componentPropertyReferences === "object"
    ) {
      debugConsole.log(
        `  [BINDING] ${nodeData.type} node "${nodeData.name || "Unnamed"}" has componentPropertyReferences: ${JSON.stringify(nodeData.componentPropertyReferences)}`,
      );
      try {
        // componentPropertyReferences maps node property names to component property names
        // e.g., { characters: "Component name#3041:0" } for TEXT nodes
        // e.g., { visible: "Show element#3042:1" } for any node with BOOLEAN property
        // We need to map the old property name to the new property name (which may have a different ID suffix)
        const componentPropertyRefs: Record<string, string> = {};
        const parentComponent =
          parentNode?.type === "COMPONENT" ? parentNode : null;

        if (parentComponent) {
          debugConsole.log(
            `  [BINDING] Parent is a COMPONENT: "${parentComponent.name}"`,
          );
          // Get the component's property definitions to map old property names to new ones
          const componentProps = parentComponent.componentPropertyDefinitions;

          for (const [nodeProperty, oldPropName] of Object.entries(
            nodeData.componentPropertyReferences,
          )) {
            if (typeof oldPropName === "string") {
              // Extract clean property name (without ID suffix)
              const cleanPropName = oldPropName.split("#")[0];

              // Find matching property in the component (may have different ID suffix)
              let matchingPropKey: string | undefined = undefined;
              if (componentProps[oldPropName]) {
                // Exact match
                matchingPropKey = oldPropName;
              } else if (componentProps[cleanPropName]) {
                // Clean name match
                matchingPropKey = cleanPropName;
              } else {
                // Base name match
                matchingPropKey = Object.keys(componentProps).find(
                  (key) => key.split("#")[0] === cleanPropName,
                );
              }

              if (matchingPropKey) {
                componentPropertyRefs[nodeProperty] = matchingPropKey;
                debugConsole.log(
                  `  [BINDING] Restored componentPropertyReferences for ${nodeData.type} node "${nodeData.name || "Unnamed"}": ${nodeProperty} -> ${matchingPropKey}`,
                );
              } else {
                debugConsole.warning(
                  `  [BINDING] Could not find matching component property for "${oldPropName}" in component "${parentComponent.name}"`,
                );
              }
            }
          }

          if (Object.keys(componentPropertyRefs).length > 0) {
            // NOTE: componentPropertyReferences will be restored in post-processing
            // after all children are added to the component. This ensures nodes are
            // "symbol sublayers" (children of a Component) before we try to set bindings.
            debugConsole.log(
              `  [BINDING] Will restore componentPropertyReferences in post-processing: ${JSON.stringify(componentPropertyRefs)}`,
            );
          }
        } else {
          debugConsole.warning(
            `  [BINDING] Parent is not a COMPONENT (type: ${parentNode?.type || "unknown"}) for ${nodeData.type} node "${nodeData.name || "Unnamed"}" - cannot restore componentPropertyReferences`,
          );
        }
      } catch (refError) {
        debugConsole.warning(
          `  [BINDING] Could not restore componentPropertyReferences for ${nodeData.type} node "${nodeData.name || "Unnamed"}": ${refError}`,
        );
      }
    }
  }

  // ISSUE #2: Set selectionColor property (node-level property, not on fills)
  // selectionColor can be:
  // 1. A direct color value (RGB object) - set it directly
  // 2. Bound to a variable (via boundVariables.selectionColor - handled below)
  if (nodeData.selectionColor !== undefined) {
    const nodeName = nodeData.name || "Unnamed";
    // Check if selectionColor is bound to a variable
    const isBoundToVariable =
      nodeData.boundVariables &&
      typeof nodeData.boundVariables === "object" &&
      nodeData.boundVariables.selectionColor !== undefined;

    if (!isBoundToVariable) {
      // Set direct value only if not bound to a variable
      try {
        (newNode as any).selectionColor = nodeData.selectionColor;
        debugConsole.log(
          `  [ISSUE #2] Set selectionColor (direct value) on "${nodeName}": ${JSON.stringify(nodeData.selectionColor)}`,
        );
      } catch (error) {
        debugConsole.warning(
          `  [ISSUE #2] Failed to set selectionColor on "${nodeName}": ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    } else {
      debugConsole.log(
        `  [ISSUE #2] Skipping direct selectionColor value for "${nodeName}" - will be set via bound variable`,
      );
    }
  }

  // CRITICAL: Restore bound variables as the FINAL step, after all properties are set
  // This ensures nothing can clear the bound variables after they're set
  // IMPORTANT: Padding/itemSpacing bound variables are already set earlier (right after layoutMode)
  // to ensure they're set before any direct values that might clear them
  // IMPORTANT: width/height/minWidth/maxWidth bound variables are handled in special section after resize
  if (nodeData.boundVariables && recognizedVariables) {
    const paddingProps = [
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "paddingBottom",
      "itemSpacing",
    ];
    const sizeProps = ["width", "height", "minWidth", "maxWidth"];
    for (const [propertyName, varInfo] of Object.entries(
      nodeData.boundVariables,
    )) {
      // Skip fills (handled separately earlier), padding properties (set earlier),
      // and size properties (handled in special section after resize)
      if (
        propertyName !== "fills" &&
        !paddingProps.includes(propertyName) &&
        !sizeProps.includes(propertyName)
      ) {
        // ISSUE #2: Log when we're restoring selectionColor bound variable
        if (propertyName === "selectionColor") {
          const nodeName = nodeData.name || "Unnamed";
          debugConsole.log(
            `  [ISSUE #2] Restoring bound variable for selectionColor on "${nodeName}"`,
          );
        }
        // Handle all bound variables (including padding/itemSpacing)
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
              // CRITICAL: In Figma, you cannot set a bound variable if the property has a direct value
              // We need to ensure the property doesn't have a direct value before setting the bound variable
              // The key is to set the bound variable directly without setting a direct value first
              try {
                const alias: VariableAlias = {
                  type: "VARIABLE_ALIAS",
                  id: variable.id,
                };
                if (!newNode.boundVariables) {
                  newNode.boundVariables = {};
                }

                // Check if property currently has a direct value that might block the binding
                const currentValue = (newNode as any)[propertyName];
                const hasDirectValue =
                  currentValue !== undefined &&
                  newNode.boundVariables[propertyName] === undefined;

                if (hasDirectValue) {
                  debugConsole.warning(
                    `  Property ${propertyName} has direct value ${currentValue} which may prevent bound variable from being set`,
                  );
                }

                // Set the bound variable - this should work if no direct value conflicts
                // If there's a direct value, Figma will reject this, but we've already skipped setting
                // direct values when bound variables exist, so this should work
                (newNode as any).boundVariables[propertyName] = alias;

                // Verify the bound variable was set by checking if it exists and matches
                // Re-read boundVariables to ensure we get the actual state from Figma
                const setBoundVar = (newNode as any).boundVariables?.[
                  propertyName
                ];
                if (
                  setBoundVar &&
                  typeof setBoundVar === "object" &&
                  setBoundVar.type === "VARIABLE_ALIAS" &&
                  setBoundVar.id === variable.id
                ) {
                  debugConsole.log(
                    `  ✓ Set bound variable for ${propertyName} on "${nodeData.name || "Unnamed"}" (${nodeData.type}): variable ${variable.name} (ID: ${variable.id.substring(0, 8)}...)`,
                  );
                } else {
                  // Check what we actually got back
                  const actualBoundVar = (newNode as any).boundVariables?.[
                    propertyName
                  ];
                  debugConsole.warning(
                    `  Failed to set bound variable for ${propertyName} on "${nodeData.name || "Unnamed"}" - bound variable not persisted. Property value: ${currentValue}, Expected: ${JSON.stringify(alias)}, Got: ${JSON.stringify(actualBoundVar)}`,
                  );
                }
              } catch (error) {
                debugConsole.warning(
                  `  Error setting bound variable for ${propertyName} on "${nodeData.name || "Unnamed"}": ${error}`,
                );
              }
            } else {
              debugConsole.warning(
                `  Variable reference ${varRef} not found in recognizedVariables for ${propertyName} on "${nodeData.name || "Unnamed"}"`,
              );
            }
          }
        }
      }
    }
  }

  // Special handling for width/height/minWidth/maxWidth bound variables (need to set after resize)
  // If width, height, minWidth, or maxWidth are bound to variables, we need to set them after any resize calls
  // CRITICAL: Use setBoundVariable API method (not direct assignment) to properly bind variables
  // Direct assignment to boundVariables doesn't work if the property already has a direct value
  if (
    nodeData.boundVariables &&
    recognizedVariables &&
    (nodeData.boundVariables.width ||
      nodeData.boundVariables.height ||
      nodeData.boundVariables.minWidth ||
      nodeData.boundVariables.maxWidth)
  ) {
    const widthVar = nodeData.boundVariables.width;
    const heightVar = nodeData.boundVariables.height;
    const minWidthVar = nodeData.boundVariables.minWidth;
    const maxWidthVar = nodeData.boundVariables.maxWidth;

    if (widthVar && isVariableReference(widthVar)) {
      const varRef = (widthVar as VariableReference)._varRef;
      if (varRef !== undefined) {
        const variable = recognizedVariables.get(String(varRef));
        if (variable) {
          // First, try to remove any existing binding by setting to null
          try {
            (newNode as any).setBoundVariable("width", null);
          } catch {
            // Ignore errors when removing (might not exist)
          }
          // Set the bound variable using Figma's API
          try {
            (newNode as any).setBoundVariable("width", variable);
            debugConsole.log(
              `  ✓ Set bound variable for width on "${nodeData.name || "Unnamed"}" (${nodeData.type}): variable ${variable.name} (ID: ${variable.id.substring(0, 8)}...)`,
            );
          } catch (error) {
            debugConsole.warning(
              `  Failed to set bound variable for width on "${nodeData.name || "Unnamed"}": ${error}`,
            );
          }
        }
      }
    }
    if (heightVar && isVariableReference(heightVar)) {
      const varRef = (heightVar as VariableReference)._varRef;
      if (varRef !== undefined) {
        const variable = recognizedVariables.get(String(varRef));
        if (variable) {
          // First, try to remove any existing binding by setting to null
          try {
            (newNode as any).setBoundVariable("height", null);
          } catch {
            // Ignore errors when removing (might not exist)
          }
          // Set the bound variable using Figma's API
          try {
            (newNode as any).setBoundVariable("height", variable);
            debugConsole.log(
              `  ✓ Set bound variable for height on "${nodeData.name || "Unnamed"}" (${nodeData.type}): variable ${variable.name} (ID: ${variable.id.substring(0, 8)}...)`,
            );
          } catch (error) {
            debugConsole.warning(
              `  Failed to set bound variable for height on "${nodeData.name || "Unnamed"}": ${error}`,
            );
          }
        }
      }
    }
    if (minWidthVar && isVariableReference(minWidthVar)) {
      const varRef = (minWidthVar as VariableReference)._varRef;
      if (varRef !== undefined) {
        const variable = recognizedVariables.get(String(varRef));
        if (variable) {
          // First, try to remove any existing binding by setting to null
          try {
            (newNode as any).setBoundVariable("minWidth", null);
          } catch {
            // Ignore errors when removing (might not exist)
          }
          // Set the bound variable using Figma's API
          try {
            (newNode as any).setBoundVariable("minWidth", variable);
            debugConsole.log(
              `  ✓ Set bound variable for minWidth on "${nodeData.name || "Unnamed"}" (${nodeData.type}): variable ${variable.name} (ID: ${variable.id.substring(0, 8)}...)`,
            );
          } catch (error) {
            debugConsole.warning(
              `  Failed to set bound variable for minWidth on "${nodeData.name || "Unnamed"}": ${error}`,
            );
          }
        }
      }
    }
    if (maxWidthVar && isVariableReference(maxWidthVar)) {
      const varRef = (maxWidthVar as VariableReference)._varRef;
      if (varRef !== undefined) {
        const variable = recognizedVariables.get(String(varRef));
        if (variable) {
          // First, try to remove any existing binding by setting to null
          try {
            (newNode as any).setBoundVariable("maxWidth", null);
          } catch {
            // Ignore errors when removing (might not exist)
          }
          // Set the bound variable using Figma's API
          try {
            (newNode as any).setBoundVariable("maxWidth", variable);
            debugConsole.log(
              `  ✓ Set bound variable for maxWidth on "${nodeData.name || "Unnamed"}" (${nodeData.type}): variable ${variable.name} (ID: ${variable.id.substring(0, 8)}...)`,
            );
          } catch (error) {
            debugConsole.warning(
              `  Failed to set bound variable for maxWidth on "${nodeData.name || "Unnamed"}": ${error}`,
            );
          }
        }
      }
    }

    // IMPORTANT: When minWidth or maxWidth are bound to variables, the component should behave as "Fill Container"
    // However, layoutSizingHorizontal can only be set on children of auto-layout frames, not on components themselves
    // So we don't set it here - it will be set when the component is used as a child in an auto-layout container
    // The minWidth/maxWidth bound variables are already set above, which is sufficient for the component definition
  }

  // Recursively recreate children
  // Note: INSTANCE nodes cannot have children appended - they are read-only representations
  // of their main component, so we skip children for INSTANCE nodes
  // Also skip if this is a reused component that already has children (fully created in previous iteration)
  const isReusedComponentWithChildren =
    nodeData.id &&
    nodeIdMapping &&
    nodeIdMapping.has(nodeData.id) &&
    newNode.type === "COMPONENT" &&
    newNode.children &&
    newNode.children.length > 0;

  if (
    nodeData.children &&
    Array.isArray(nodeData.children) &&
    newNode.type !== "INSTANCE" &&
    !isReusedComponentWithChildren // Skip if component already fully created
  ) {
    // Two-pass approach: First create all COMPONENT nodes recursively (so they're in nodeIdMapping),
    // then create all other nodes (including INSTANCE nodes that reference the components)
    const componentChildren: any[] = [];
    const otherChildren: any[] = [];

    // Helper function to recursively collect all COMPONENT nodes
    // Note: This function cannot be async, so we log after collection
    const collectComponents = (children: any[]): any[] => {
      const components: any[] = [];
      for (const child of children) {
        if (child._truncated) {
          continue;
        }
        if (child.type === "COMPONENT") {
          components.push(child);
          // Also collect components from this component's children
          if (child.children && Array.isArray(child.children)) {
            components.push(...collectComponents(child.children));
          }
        } else if (child.children && Array.isArray(child.children)) {
          // Recursively collect components from nested structures
          components.push(...collectComponents(child.children));
        }
      }
      return components;
    };

    for (const childData of nodeData.children) {
      // Skip truncated children markers
      if (childData._truncated) {
        console.log(
          `Skipping truncated children: ${childData._reason || "Unknown"}`,
        );
        continue;
      }
      // Separate COMPONENT children from others
      if (childData.type === "COMPONENT") {
        componentChildren.push(childData);
      } else {
        otherChildren.push(childData);
      }
    }

    // First pass: Recursively create all COMPONENT nodes (including nested ones)
    // This ensures all components are in nodeIdMapping before any instances reference them
    // We only create the component nodes themselves, not their children (that happens in second pass)
    const allComponents = collectComponents(nodeData.children);
    debugConsole.log(
      `  First pass: Creating ${allComponents.length} COMPONENT node(s) (without children)...`,
    );
    // Log all collected components for debugging
    for (const comp of allComponents) {
      debugConsole.log(
        `  Collected COMPONENT "${comp.name || "Unnamed"}" (ID: ${comp.id ? comp.id.substring(0, 8) + "..." : "no ID"}) for first pass`,
      );
    }
    for (const componentData of allComponents) {
      // Only create if not already created (check nodeIdMapping)
      if (
        componentData.id &&
        nodeIdMapping &&
        !nodeIdMapping.has(componentData.id)
      ) {
        // Validate component data before creation
        if (!componentData.name && componentData.name !== "") {
          debugConsole.warning(
            `  Component data missing name for ID ${componentData.id?.substring(0, 8)}..., skipping creation`,
          );
          continue;
        }

        // Check for reasonable name length to catch corrupted data
        if (componentData.name && componentData.name.length > 1000) {
          debugConsole.warning(
            `  Component name suspiciously long (${componentData.name.length} chars) for "${componentData.name?.substring(0, 50)}...", this may indicate corrupted data`,
          );
        }
        // Create just the component node itself (no children processing yet)
        let componentNode: ComponentNode;
        try {
          componentNode = figma.createComponent();
          if (componentData.name !== undefined) {
            componentNode.name = componentData.name || "Unnamed Node";
          }
        } catch (createError) {
          debugConsole.error(
            `  Failed to create component "${componentData.name || "Unnamed"}" (ID: ${componentData.id?.substring(0, 8)}...): ${createError instanceof Error ? createError.message : String(createError)}`,
          );
          throw createError; // Re-throw to trigger main error handler
        }

        // Add component property definitions using addComponentProperty() method
        if (componentData.componentPropertyDefinitions) {
          const propDefs = componentData.componentPropertyDefinitions;
          let addedCount = 0;
          let failedCount = 0;

          debugConsole.log(
            `  Processing ${Object.keys(propDefs).length} component property definition(s) for "${componentData.name || "Unnamed"}"`,
          );

          for (const [propName, propDef] of Object.entries(propDefs)) {
            try {
              // propDef format: { type: number, defaultValue?: any }
              // Map type numbers to Figma API type strings
              const typeMap: Record<
                number,
                "TEXT" | "BOOLEAN" | "INSTANCE_SWAP" | "VARIANT"
              > = {
                2: "TEXT", // Text property
                25: "BOOLEAN", // Boolean property
                27: "INSTANCE_SWAP", // Instance swap property
                26: "VARIANT", // Variant property
              };

              const propType = typeMap[(propDef as any).type];
              if (!propType) {
                debugConsole.warning(
                  `  Unknown property type ${(propDef as any).type} for property "${propName}" in component "${componentData.name || "Unnamed"}" - available types: ${Object.keys(typeMap).join(", ")}`,
                );
                failedCount++;
                continue;
              }

              const defaultValue = (propDef as any).defaultValue;
              // Property names in JSON may include IDs (e.g., "Show trailing icon#318:0")
              // Extract just the property name part (before the #)
              const cleanPropName = propName.split("#")[0];

              debugConsole.log(
                `    Adding property "${cleanPropName}" (${propType}) with default value: ${JSON.stringify(defaultValue)}`,
              );

              componentNode.addComponentProperty(
                cleanPropName,
                propType,
                defaultValue,
              );
              addedCount++;
            } catch (error) {
              debugConsole.warning(
                `  Failed to add component property "${propName}" to "${componentData.name || "Unnamed"}" in first pass: ${error instanceof Error ? error.message : String(error)}`,
              );
              failedCount++;
            }
          }

          if (addedCount > 0) {
            debugConsole.log(
              `  Added ${addedCount} component property definition(s) to "${componentData.name || "Unnamed"}" in first pass${failedCount > 0 ? ` (${failedCount} failed)` : ""}`,
            );
          } else if (failedCount > 0) {
            debugConsole.warning(
              `  No component properties were successfully added to "${componentData.name || "Unnamed"}" (${failedCount} failed)`,
            );
          }
        }

        // Store in mapping immediately so instances can find it
        nodeIdMapping.set(componentData.id, componentNode);
        debugConsole.log(
          `  Created COMPONENT "${componentData.name || "Unnamed"}" (ID: ${componentData.id.substring(0, 8)}...) in first pass`,
        );
        // Don't append to parent yet - that happens in second pass
        // Don't process children yet - that also happens in second pass
      }
    }

    // Second pass: Process all children normally (components will be skipped if already created,
    // but their children will be processed, and instances can now find the components)
    for (const childData of nodeData.children) {
      if (childData._truncated) {
        continue;
      }
      // Determine currentPlaceholderId for children:
      // - If newNode is a placeholder, use its ID
      // - Otherwise, pass down the currentPlaceholderId we received
      const childPlaceholderId =
        newNode && placeholderFrameIds && placeholderFrameIds.has(newNode.id)
          ? newNode.id
          : currentPlaceholderId;
      const childNode = await recreateNodeFromData(
        childData,
        newNode,
        variableTable,
        collectionTable,
        instanceTable,
        recognizedVariables,
        nodeIdMapping,
        isRemoteStructure,
        remoteComponentMap,
        deferredInstances, // Pass deferredInstances through for recursive calls
        nodeData, // parentNodeData - pass the parent's nodeData so children can check for auto-layout
        recognizedCollections,
        placeholderFrameIds, // Pass placeholderFrameIds through for recursive calls
        childPlaceholderId, // Pass currentPlaceholderId down (or placeholder ID if newNode is a placeholder)
        styleMapping, // Pass styleMapping to apply styles
        imageTable, // Pass imageTable to restore images
      );
      if (childNode) {
        // Only append if the child doesn't already have this node as its parent
        // This prevents duplicates but allows moving children to the correct parent
        if (childNode.parent !== newNode) {
          // If child has a different parent, remove it first (this moves it, not duplicates it)
          // Only remove if the parent supports removeChild (PageNode, FrameNode, GroupNode, ComponentNode, ComponentSetNode)
          if (
            childNode.parent &&
            typeof (childNode.parent as any).removeChild === "function"
          ) {
            try {
              (childNode.parent as any).removeChild(childNode);
            } catch (error) {
              // If removeChild fails, log a warning but continue
              debugConsole.warning(
                `Failed to remove child "${childNode.name || "Unnamed"}" from parent "${childNode.parent.name || "Unnamed"}": ${error}`,
              );
            }
          }
          newNode.appendChild(childNode);
        }
        // If childNode.parent === newNode, it's already correctly parented, so do nothing
      }
    }
  }

  // Post-processing: Restore componentPropertyReferences for COMPONENT nodes
  // This must happen AFTER all children are added, when nodes are "symbol sublayers"
  if (newNode.type === "COMPONENT") {
    const bindingData = componentBindingData.get(newNode.id);
    if (!bindingData) {
      // No binding data for this component, skip post-processing
      // (This is normal for components without properties or that were reused from first pass)
    } else {
      const { propertyIdMapping, nodeData: componentNodeData } = bindingData;

      // Recursively restore bindings for all children
      const restoreBindings = (node: SceneNode, nodeData: any): void => {
        // Check if this node has componentPropertyReferences in the original data
        if (
          nodeData.componentPropertyReferences &&
          typeof nodeData.componentPropertyReferences === "object"
        ) {
          const componentPropertyRefs: Record<string, string> = {};

          for (const [nodeProperty, oldPropId] of Object.entries(
            nodeData.componentPropertyReferences,
          )) {
            if (typeof oldPropId === "string") {
              // Look up the new property ID using the old property ID
              const newPropId = propertyIdMapping.get(oldPropId);
              if (newPropId) {
                componentPropertyRefs[nodeProperty] = newPropId;
                debugConsole.log(
                  `  [BINDING] Restoring binding for ${node.type} node "${node.name || "Unnamed"}": ${nodeProperty} -> ${newPropId} (was ${oldPropId})`,
                );
              } else {
                // Try matching by clean name (without ID suffix)
                const cleanPropName = oldPropId.split("#")[0];
                for (const [oldId, newId] of propertyIdMapping.entries()) {
                  if (oldId.split("#")[0] === cleanPropName) {
                    componentPropertyRefs[nodeProperty] = newId;
                    debugConsole.log(
                      `  [BINDING] Restoring binding for ${node.type} node "${node.name || "Unnamed"}": ${nodeProperty} -> ${newId} (matched by clean name "${cleanPropName}")`,
                    );
                    break;
                  }
                }
              }
            }
          }

          // Set the binding now that the node is a child of a Component (symbol sublayer)
          if (Object.keys(componentPropertyRefs).length > 0) {
            try {
              (node as any).componentPropertyReferences = componentPropertyRefs;
              debugConsole.log(
                `  [BINDING] ✓ Successfully restored componentPropertyReferences for ${node.type} node "${node.name || "Unnamed"}": ${JSON.stringify(componentPropertyRefs)}`,
              );
            } catch (error) {
              debugConsole.warning(
                `  [BINDING] ✗ Failed to restore componentPropertyReferences for ${node.type} node "${node.name || "Unnamed"}": ${error}`,
              );
            }
          }
        }

        // Recursively process children
        if (
          "children" in node &&
          nodeData.children &&
          Array.isArray(nodeData.children)
        ) {
          // Match children by index (assuming order is preserved)
          for (
            let i = 0;
            i < node.children.length && i < nodeData.children.length;
            i++
          ) {
            const child = node.children[i];
            const childData = nodeData.children[i];
            restoreBindings(child, childData);
          }
        }
      };

      // Start restoration from the component's children
      if (
        "children" in newNode &&
        componentNodeData.children &&
        Array.isArray(componentNodeData.children)
      ) {
        for (
          let i = 0;
          i < newNode.children.length && i < componentNodeData.children.length;
          i++
        ) {
          restoreBindings(newNode.children[i], componentNodeData.children[i]);
        }
      }

      // Clean up binding data from Map after use
      componentBindingData.delete(newNode.id);
    }
  }

  // Add the node to the parent
  // Only append if the node doesn't already have this node as its parent
  // This prevents duplicates but allows moving nodes to the correct parent
  if (parentNode && newNode.parent !== parentNode) {
    // If node has a different parent, remove it first (this moves it, not duplicates it)
    // Only remove if the parent supports removeChild (PageNode, FrameNode, GroupNode, ComponentNode, ComponentSetNode)
    if (
      newNode.parent &&
      typeof (newNode.parent as any).removeChild === "function"
    ) {
      try {
        (newNode.parent as any).removeChild(newNode);
      } catch (error) {
        // If removeChild fails, log a warning but continue
        debugConsole.warning(
          `Failed to remove node "${newNode.name || "Unnamed"}" from parent "${newNode.parent.name || "Unnamed"}": ${error}`,
        );
      }
    }
    parentNode.appendChild(newNode);
  }
  // If newNode.parent === parentNode, it's already correctly parented, so do nothing

  // FINAL CHECK: Ensure itemSpacing is set correctly after all operations
  // Sometimes Figma resets itemSpacing when children are appended or other operations occur
  // CRITICAL: Only fix if itemSpacing is NOT bound to a variable - never override a binding!
  if (
    (newNode.type === "FRAME" ||
      newNode.type === "COMPONENT" ||
      newNode.type === "INSTANCE") &&
    nodeData.layoutMode !== undefined &&
    nodeData.layoutMode !== "NONE" &&
    nodeData.itemSpacing !== undefined
  ) {
    // Check if itemSpacing is actually bound to a variable on the node itself
    // This is the definitive check - if it's bound, we must NOT override it
    const isActuallyBound =
      (newNode as any).boundVariables?.itemSpacing !== undefined;

    // Also check if it should be bound according to nodeData
    const shouldBeBound =
      nodeData.boundVariables &&
      typeof nodeData.boundVariables === "object" &&
      nodeData.boundVariables.itemSpacing;

    if (isActuallyBound) {
      debugConsole.log(
        `  FINAL CHECK: itemSpacing is bound to variable for "${nodeData.name || "Unnamed"}" - skipping direct value fix`,
      );
    } else if (!shouldBeBound) {
      // Only fix if it's not bound and shouldn't be bound
      const currentValue = newNode.itemSpacing;
      if (currentValue !== nodeData.itemSpacing) {
        debugConsole.log(
          `  FINAL FIX: Resetting itemSpacing to ${nodeData.itemSpacing} for "${nodeData.name || "Unnamed"}" (was ${currentValue})`,
        );
        newNode.itemSpacing = nodeData.itemSpacing;
        debugConsole.log(
          `  FINAL FIX: Verified itemSpacing is now ${newNode.itemSpacing}`,
        );
      } else {
        debugConsole.log(
          `  FINAL CHECK: itemSpacing is already correct (${currentValue}) for "${nodeData.name || "Unnamed"}"`,
        );
      }
    } else {
      // Should be bound but isn't - this is the bug we're trying to fix
      debugConsole.warning(
        `  FINAL CHECK: itemSpacing should be bound to variable for "${nodeData.name || "Unnamed"}" but binding is missing!`,
      );
    }
  }

  return newNode;
}

/**
 * Third pass: Set variant properties on all instances after component sets are created
 * This is needed because instances are created before component sets are combined,
 * so variant properties can't be set until after component sets exist
 */
async function setVariantPropertiesOnInstances(
  page: PageNode,
  instanceTable: InstanceTable,
  nodeIdMapping: Map<string, any>,
): Promise<void> {
  let processedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  // Recursively find all instances on the page
  const findInstances = (node: PageNode | SceneNode): InstanceNode[] => {
    const instances: InstanceNode[] = [];
    if (node.type === "INSTANCE") {
      instances.push(node);
    }
    if ("children" in node && node.children) {
      for (const child of node.children) {
        instances.push(...findInstances(child));
      }
    }
    return instances;
  };

  const allInstances = findInstances(page);
  debugConsole.log(
    `  Found ${allInstances.length} instance(s) to process for variant properties`,
  );

  for (const instanceNode of allInstances) {
    try {
      // Get the instance's main component
      const mainComponent = await instanceNode.getMainComponentAsync();
      if (!mainComponent) {
        skippedCount++;
        continue;
      }

      // Find the instance entry that matches this instance
      // First, try to use the instance table index mapping stored during creation
      const allInstancesData = instanceTable.getSerializedTable();
      let matchingEntry: any = null;
      let instanceTableIndex: number | undefined = undefined;

      // Check if we have a mapping from instance node ID to instance table index
      if ((nodeIdMapping as any)._instanceTableMap) {
        instanceTableIndex = (nodeIdMapping as any)._instanceTableMap.get(
          instanceNode.id,
        );
        if (instanceTableIndex !== undefined) {
          matchingEntry = allInstancesData[instanceTableIndex];
          debugConsole.log(
            `  Found instance table index ${instanceTableIndex} for instance "${instanceNode.name}" (ID: ${instanceNode.id.substring(0, 8)}...)`,
          );
        } else {
          debugConsole.log(
            `  No instance table index mapping found for instance "${instanceNode.name}" (ID: ${instanceNode.id.substring(0, 8)}...), using fallback matching`,
          );
        }
      } else {
        debugConsole.log(
          `  No instance table map found, using fallback matching for instance "${instanceNode.name}"`,
        );
      }

      // Fallback: If no mapping found, try to match by component (less precise)
      if (!matchingEntry) {
        for (const [indexStr, entry] of Object.entries(allInstancesData)) {
          if (entry.instanceType === "internal") {
            // For internal instances, check if the componentNodeId matches
            if (
              entry.componentNodeId &&
              nodeIdMapping.has(entry.componentNodeId)
            ) {
              const componentNode = nodeIdMapping.get(entry.componentNodeId);
              if (componentNode && componentNode.id === mainComponent.id) {
                matchingEntry = entry;
                debugConsole.log(
                  `  Matched instance "${instanceNode.name}" to instance table entry ${indexStr} by component (less precise)`,
                );
                break;
              }
            }
          }
        }
      }

      if (!matchingEntry) {
        debugConsole.log(
          `  No matching entry found for instance "${instanceNode.name}" (main component: ${mainComponent.name}, ID: ${mainComponent.id.substring(0, 8)}...)`,
        );
        skippedCount++;
        continue;
      }

      if (!matchingEntry.variantProperties) {
        debugConsole.log(
          `  Instance table entry for "${instanceNode.name}" has no variant properties`,
        );
        skippedCount++;
        continue;
      }

      debugConsole.log(
        `  Instance "${instanceNode.name}" matched to entry with variant properties: ${JSON.stringify(matchingEntry.variantProperties)}`,
      );

      // Now set variant properties
      let componentProperties: ComponentPropertyDefinitions | null = null;

      // Check if the main component is inside a component set
      if (
        mainComponent.parent &&
        mainComponent.parent.type === "COMPONENT_SET"
      ) {
        componentProperties = mainComponent.parent.componentPropertyDefinitions;
      }

      if (componentProperties) {
        const validProperties: Record<string, string> = {};

        // Only include properties that exist on the component
        for (const [propName, propValue] of Object.entries(
          matchingEntry.variantProperties,
        )) {
          // Property names in JSON may include IDs - extract clean name
          const cleanPropName = propName.split("#")[0];
          if (componentProperties[cleanPropName]) {
            validProperties[cleanPropName] = propValue as string;
          }
        }

        // Only set properties if we have valid ones
        if (Object.keys(validProperties).length > 0) {
          instanceNode.setProperties(validProperties);
          processedCount++;
          debugConsole.log(
            `  ✓ Set variant properties on instance "${instanceNode.name}": ${JSON.stringify(validProperties)}`,
          );
        } else {
          skippedCount++;
        }
      } else {
        skippedCount++;
      }
    } catch (error) {
      errorCount++;
      debugConsole.warning(
        `  Failed to set variant properties on instance "${instanceNode.name}": ${error}`,
      );
    }
  }

  debugConsole.log(
    `  Variant properties set: ${processedCount} processed, ${skippedCount} skipped, ${errorCount} errors`,
  );
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

/**
 * Stage 1: Validate metadata
 */
function validateMetadata(jsonData: any): {
  success: boolean;
  metadata?: {
    guid: string;
    name: string;
    version?: number;
    description?: string;
    url?: string;
  };
  error?: string;
} {
  if (!jsonData.metadata) {
    return {
      success: false,
      error: "Invalid JSON format. Expected metadata.",
    };
  }

  const metadata = jsonData.metadata;
  if (!metadata.guid || typeof metadata.guid !== "string") {
    return {
      success: false,
      error: "Invalid metadata. Missing or invalid 'guid' field.",
    };
  }

  if (!metadata.name || typeof metadata.name !== "string") {
    return {
      success: false,
      error: "Invalid metadata. Missing or invalid 'name' field.",
    };
  }

  return {
    success: true,
    metadata: {
      guid: metadata.guid,
      name: metadata.name,
      version: metadata.version,
      description: metadata.description,
      url: metadata.url,
    },
  };
}

/**
 * Stage 2: Load string table and expand JSON
 */
export function loadAndExpandJson(jsonData: any): {
  success: boolean;
  stringTable?: StringTable;
  expandedJsonData?: any;
  error?: string;
} {
  if (!jsonData.stringTable) {
    return {
      success: false,
      error: "Invalid JSON format. String table is required.",
    };
  }

  let stringTable: StringTable;
  try {
    stringTable = StringTable.fromTable(jsonData.stringTable);
  } catch (error) {
    return {
      success: false,
      error: `Failed to load string table: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }

  const expandedJsonData = expandJsonData(jsonData, stringTable);

  return {
    success: true,
    stringTable,
    expandedJsonData,
  };
}

/**
 * Stage 3: Load collection table
 */
export function loadCollectionTable(expandedJsonData: any): {
  success: boolean;
  collectionTable?: CollectionTable;
  error?: string;
} {
  if (!expandedJsonData.collections) {
    return {
      success: false,
      error: "No collections table found in JSON",
    };
  }

  try {
    const collectionTable = CollectionTable.fromTable(
      expandedJsonData.collections,
    );
    return {
      success: true,
      collectionTable,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to load collections table: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Stage 4: Match collections with existing local collections
 */
async function matchCollections(
  collectionTable: CollectionTable,
  preCreatedCollections?: Map<string, VariableCollection>,
): Promise<{
  recognizedCollections: Map<string, VariableCollection>;
  potentialMatches: Map<
    string,
    { entry: CollectionTableEntry; collection: VariableCollection }
  >;
  collectionsToCreate: Map<string, CollectionTableEntry>;
}> {
  const recognizedCollections = new Map<string, VariableCollection>();
  const potentialMatches = new Map<
    string,
    { entry: CollectionTableEntry; collection: VariableCollection }
  >();
  const collectionsToCreate = new Map<string, CollectionTableEntry>();

  const collections = collectionTable.getTable();

  for (const [index, entry] of Object.entries(collections)) {
    // Skip remote collections (they're handled separately)
    if (entry.isLocal === false) {
      debugConsole.log(
        `Skipping remote collection: "${entry.collectionName}" (index ${index})`,
      );
      continue;
    }

    // First check if we have a pre-created collection for this normalized name
    const normalizedName = normalizeCollectionName(entry.collectionName);
    const preCreated = preCreatedCollections?.get(normalizedName);

    if (preCreated) {
      debugConsole.log(
        `✓ Using pre-created collection: "${normalizedName}" (index ${index})`,
      );
      recognizedCollections.set(index, preCreated);
      continue;
    }

    const match = await matchCollection(entry);

    if (match.matchType === "recognized") {
      debugConsole.log(
        `✓ Recognized collection by GUID: "${entry.collectionName}" (index ${index})`,
      );
      recognizedCollections.set(index, match.collection!);
    } else if (match.matchType === "potential") {
      debugConsole.log(
        `? Potential match by name: "${entry.collectionName}" (index ${index})`,
      );
      potentialMatches.set(index, {
        entry,
        collection: match.collection!,
      });
    } else {
      debugConsole.log(
        `✗ No match found for collection: "${entry.collectionName}" (index ${index}) - will create new`,
      );
      collectionsToCreate.set(index, entry);
    }
  }

  debugConsole.log(
    `Collection matching complete: ${recognizedCollections.size} recognized, ${potentialMatches.size} potential matches, ${collectionsToCreate.size} to create`,
  );

  return {
    recognizedCollections,
    potentialMatches,
    collectionsToCreate,
  };
}

/**
 * Stage 5: Prompt user for potential collection matches (or use wizard selections)
 */
async function promptForPotentialMatches(
  potentialMatches: Map<
    string,
    { entry: CollectionTableEntry; collection: VariableCollection }
  >,
  recognizedCollections: Map<string, VariableCollection>,
  collectionsToCreate: Map<string, CollectionTableEntry>,
  collectionChoices?: {
    tokens: "new" | "existing";
    theme: "new" | "existing";
    layers: "new" | "existing";
  },
): Promise<void> {
  if (potentialMatches.size === 0) {
    return;
  }

  // If collection choices are provided (from wizard), use them instead of prompting
  if (collectionChoices) {
    debugConsole.log(
      `Using wizard selections for ${potentialMatches.size} potential match(es)...`,
    );

    for (const [index, { entry, collection }] of potentialMatches.entries()) {
      const normalizedName = normalizeCollectionName(
        entry.collectionName,
      ).toLowerCase();
      let shouldUseExisting = false;

      if (normalizedName === "tokens" || normalizedName === "token") {
        shouldUseExisting = collectionChoices.tokens === "existing";
      } else if (normalizedName === "theme" || normalizedName === "themes") {
        shouldUseExisting = collectionChoices.theme === "existing";
      } else if (normalizedName === "layer" || normalizedName === "layers") {
        shouldUseExisting = collectionChoices.layers === "existing";
      }

      const displayName = isStandardCollection(entry.collectionName)
        ? normalizeCollectionName(entry.collectionName)
        : collection.name;

      if (shouldUseExisting) {
        debugConsole.log(
          `✓ Wizard selection: Using existing collection "${displayName}" (index ${index})`,
        );
        recognizedCollections.set(index, collection);

        await ensureCollectionModes(collection, entry.modes);
        debugConsole.log(
          `  ✓ Ensured modes for collection "${displayName}" (${entry.modes.length} mode(s))`,
        );
      } else {
        debugConsole.log(
          `✗ Wizard selection: Will create new collection for "${entry.collectionName}" (index ${index})`,
        );
        collectionsToCreate.set(index, entry);
      }
    }
    return;
  }

  // Otherwise, prompt the user (legacy behavior)
  debugConsole.log(
    `Prompting user for ${potentialMatches.size} potential match(es)...`,
  );

  for (const [index, { entry, collection }] of potentialMatches.entries()) {
    try {
      const displayName = isStandardCollection(entry.collectionName)
        ? normalizeCollectionName(entry.collectionName)
        : collection.name;

      const message = `Found existing "${displayName}" variable collection. Should I use it?`;
      debugConsole.log(
        `Prompting user about potential match: "${displayName}"`,
      );
      await pluginPrompt.prompt(message, {
        okLabel: "Yes",
        cancelLabel: "No",
        timeoutMs: -1,
      });

      debugConsole.log(
        `✓ User confirmed: Using existing collection "${displayName}" (index ${index})`,
      );
      recognizedCollections.set(index, collection);

      await ensureCollectionModes(collection, entry.modes);
      debugConsole.log(
        `  ✓ Ensured modes for collection "${displayName}" (${entry.modes.length} mode(s))`,
      );
    } catch {
      debugConsole.log(
        `✗ User rejected: Will create new collection for "${entry.collectionName}" (index ${index})`,
      );
      collectionsToCreate.set(index, entry);
    }
  }
}

/**
 * Stage 6: Ensure modes exist for recognized collections
 */
async function ensureModesForRecognizedCollections(
  recognizedCollections: Map<string, VariableCollection>,
  collectionTable: CollectionTable,
  potentialMatches: Map<
    string,
    { entry: CollectionTableEntry; collection: VariableCollection }
  >,
): Promise<void> {
  if (recognizedCollections.size === 0) {
    return;
  }

  debugConsole.log(`Ensuring modes exist for recognized collections...`);

  const collections = collectionTable.getTable();
  for (const [index, collection] of recognizedCollections.entries()) {
    const entry = collections[index];
    if (entry) {
      const wasUserConfirmed = potentialMatches.has(index);
      if (!wasUserConfirmed) {
        await ensureCollectionModes(collection, entry.modes);
        debugConsole.log(
          `  ✓ Ensured modes for collection "${collection.name}" (${entry.modes.length} mode(s))`,
        );
      }
    }
  }
}

/**
 * Stage 7: Create new collections (or reuse pre-created ones)
 */
async function createNewCollections(
  collectionsToCreate: Map<string, CollectionTableEntry>,
  recognizedCollections: Map<string, VariableCollection>,
  newlyCreatedCollections: VariableCollection[],
  preCreatedCollections?: Map<string, VariableCollection>,
): Promise<void> {
  if (collectionsToCreate.size === 0) {
    return;
  }

  debugConsole.log(
    `Processing ${collectionsToCreate.size} collection(s) to create...`,
  );

  for (const [index, entry] of collectionsToCreate.entries()) {
    const normalizedName = normalizeCollectionName(entry.collectionName);

    // Check if we have a pre-created collection for this normalized name
    const preCreated = preCreatedCollections?.get(normalizedName);
    if (preCreated) {
      debugConsole.log(
        `Reusing pre-created collection: "${normalizedName}" (index ${index}, id: ${preCreated.id.substring(0, 8)}...)`,
      );
      recognizedCollections.set(index, preCreated);
      // Ensure modes match
      await ensureCollectionModes(preCreated, entry.modes);
      // IMPORTANT: Add pre-created collection to newlyCreatedCollections so it's tracked
      newlyCreatedCollections.push(preCreated);
      continue;
    }

    // No pre-created collection, create a new one
    const uniqueName = await findUniqueCollectionName(normalizedName);
    if (uniqueName !== normalizedName) {
      debugConsole.log(
        `Creating collection: "${uniqueName}" (normalized: "${normalizedName}" - name conflict resolved)`,
      );
    } else {
      debugConsole.log(`Creating collection: "${uniqueName}"`);
    }

    const newCollection = figma.variables.createVariableCollection(uniqueName);
    newlyCreatedCollections.push(newCollection);

    let guidToStore: string | undefined;
    if (isStandardCollection(entry.collectionName)) {
      const fixedGuid = getFixedGuidForCollection(entry.collectionName);
      if (fixedGuid) {
        guidToStore = fixedGuid;
      }
    } else if (entry.collectionGuid) {
      guidToStore = entry.collectionGuid;
    }

    if (guidToStore) {
      newCollection.setSharedPluginData(
        "recursica",
        COLLECTION_GUID_KEY,
        guidToStore,
      );
      debugConsole.log(`  Stored GUID: ${guidToStore.substring(0, 8)}...`);
    }

    await ensureCollectionModes(newCollection, entry.modes);
    debugConsole.log(
      `  ✓ Created collection "${uniqueName}" with ${entry.modes.length} mode(s)`,
    );

    recognizedCollections.set(index, newCollection);
  }

  debugConsole.log("Collection creation complete");
}

/**
 * Stage 8: Load variable table
 */
export function loadVariableTable(expandedJsonData: any): {
  success: boolean;
  variableTable?: VariableTable;
  error?: string;
} {
  if (!expandedJsonData.variables) {
    return {
      success: false,
      error: "No variables table found in JSON",
    };
  }

  try {
    const variableTable = VariableTable.fromTable(expandedJsonData.variables);
    return {
      success: true,
      variableTable,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to load variables table: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Stage 9: Match and create variables
 */
export async function matchAndCreateVariables(
  variableTable: VariableTable,
  collectionTable: CollectionTable,
  recognizedCollections: Map<string, VariableCollection>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _newlyCreatedCollections: VariableCollection[], // Unused - kept for API compatibility
): Promise<{
  recognizedVariables: Map<string, Variable>;
  newlyCreatedVariables: Variable[];
}> {
  const recognizedVariables = new Map<string, Variable>();
  const newlyCreatedVariables: Variable[] = [];

  debugConsole.log("Matching and creating variables in collections...");

  const variables = variableTable.getTable();
  const collectionStats = new Map<
    string,
    { collectionName: string; existing: number; created: number }
  >();

  for (const [index, entry] of Object.entries(variables)) {
    if (entry._colRef === undefined) {
      continue;
    }

    const collection = recognizedCollections.get(String(entry._colRef));
    if (!collection) {
      continue;
    }

    if (!collectionStats.has(collection.id)) {
      collectionStats.set(collection.id, {
        collectionName: collection.name,
        existing: 0,
        created: 0,
      });
    }
    const stats = collectionStats.get(collection.id)!;

    let variableType: string;
    if (typeof entry.variableType === "number") {
      const typeMap: Record<number, string> = {
        1: "COLOR",
        2: "FLOAT",
        3: "STRING",
        4: "BOOLEAN",
      };
      variableType = typeMap[entry.variableType] || String(entry.variableType);
    } else {
      variableType = entry.variableType;
    }

    const existingVariable = await findVariableByName(
      collection,
      entry.variableName,
    );

    if (existingVariable) {
      if (variableTypeMatches(existingVariable, variableType)) {
        recognizedVariables.set(index, existingVariable);
        stats.existing++;
      } else {
        debugConsole.warning(
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
        // Track ALL variables we create, regardless of collection type
        // We'll delete them individually during cleanup (never delete collections)
        newlyCreatedVariables.push(newVariable);
        recognizedVariables.set(index, newVariable);
        stats.created++;
      }
    } else {
      const newVariable = await createVariableFromEntry(
        {
          ...entry,
          variableType,
        },
        collection,
        variableTable,
        collectionTable,
      );
      // Track ALL variables we create, regardless of collection type
      // We'll delete them individually during cleanup (never delete collections)
      newlyCreatedVariables.push(newVariable);
      recognizedVariables.set(index, newVariable);
      stats.created++;
    }
  }

  debugConsole.log("Variable processing complete:");
  for (const stats of collectionStats.values()) {
    debugConsole.log(
      `  "${stats.collectionName}": ${stats.existing} existing, ${stats.created} created`,
    );
  }

  // Final verification: Read back all COLOR variables to ensure values persisted
  debugConsole.log("Final verification: Reading back all COLOR variables...");
  let verifiedCount = 0;
  let whiteCount = 0;
  for (const variable of newlyCreatedVariables) {
    if (variable.resolvedType === "COLOR") {
      // Get the collection using the variable's collection ID
      const collection = await figma.variables.getVariableCollectionByIdAsync(
        variable.variableCollectionId,
      );
      if (!collection) {
        debugConsole.warning(
          `  ⚠️ Variable "${variable.name}" has no variableCollection (ID: ${variable.variableCollectionId})`,
        );
        continue;
      }
      const allModes = collection.modes;
      if (!allModes || allModes.length === 0) {
        debugConsole.warning(
          `  ⚠️ Variable "${variable.name}" collection has no modes`,
        );
        continue;
      }
      for (const mode of allModes) {
        const value = variable.valuesByMode[mode.modeId];
        if (value && typeof value === "object" && "r" in value) {
          const rgb = value as { r: number; g: number; b: number };
          // Check if it's white (r=1, g=1, b=1) or near-white
          const isWhite =
            Math.abs(rgb.r - 1) < 0.01 &&
            Math.abs(rgb.g - 1) < 0.01 &&
            Math.abs(rgb.b - 1) < 0.01;
          if (isWhite) {
            whiteCount++;
            debugConsole.warning(
              `  ⚠️ Variable "${variable.name}" mode "${mode.name}" is WHITE: r=${rgb.r.toFixed(3)}, g=${rgb.g.toFixed(3)}, b=${rgb.b.toFixed(3)}`,
            );
          } else {
            verifiedCount++;
            debugConsole.log(
              `  ✓ Variable "${variable.name}" mode "${mode.name}" has color: r=${rgb.r.toFixed(3)}, g=${rgb.g.toFixed(3)}, b=${rgb.b.toFixed(3)}`,
            );
          }
        } else if (value && typeof value === "object" && "type" in value) {
          // Variable alias - skip
        } else {
          debugConsole.warning(
            `  ⚠️ Variable "${variable.name}" mode "${mode.name}" has unexpected value type: ${JSON.stringify(value)}`,
          );
        }
      }
    }
  }
  debugConsole.log(
    `Final verification complete: ${verifiedCount} color variables verified, ${whiteCount} white variables found`,
  );

  return {
    recognizedVariables,
    newlyCreatedVariables,
  };
}

/**
 * Stage 10: Load instance table
 */
function loadInstanceTable(expandedJsonData: any): InstanceTable | null {
  if (!expandedJsonData.instances) {
    return null;
  }

  try {
    const instanceTable = InstanceTable.fromTable(expandedJsonData.instances);
    return instanceTable;
  } catch {
    return null;
  }
}

/**
 * Loads the image table from expanded JSON data
 */
function loadImageTable(expandedJsonData: any): ImageTable | null {
  if (!expandedJsonData.images) {
    return null;
  }

  try {
    const imageTable = ImageTable.fromTable(expandedJsonData.images);
    return imageTable;
  } catch {
    return null;
  }
}

/**
 * Normalizes node type from numeric enum to string
 * Handles cases where type enums weren't expanded during JSON expansion
 */
function normalizeNodeType(type: number | string): string {
  if (typeof type === "number") {
    const typeMap: Record<number, string> = {
      1: "FRAME",
      2: "TEXT",
      3: "INSTANCE",
      4: "COMPONENT",
      5: "VECTOR",
      6: "RECTANGLE",
      7: "ELLIPSE",
      8: "STAR",
      9: "LINE",
      10: "GROUP",
      11: "BOOLEAN_OPERATION",
      12: "POLYGON",
      13: "PAGE",
      14: "COMPONENT_SET",
    };
    return typeMap[type] || String(type);
  }
  return type;
}

/**
 * Recursively normalizes types in a node structure
 */
export function normalizeStructureTypes(nodeData: any): void {
  if (!nodeData || typeof nodeData !== "object") {
    return;
  }

  // Normalize this node's type
  if (nodeData.type !== undefined) {
    nodeData.type = normalizeNodeType(nodeData.type);
  }

  // Handle both "child" (compressed) and "children" (expanded) keys
  const childrenKey =
    nodeData.children !== undefined
      ? "children"
      : nodeData.child !== undefined
        ? "child"
        : null;
  if (childrenKey) {
    // Normalize the key to "children" if it's "child"
    if (childrenKey === "child" && !nodeData.children) {
      nodeData.children = nodeData.child;
      delete nodeData.child;
    }

    // Recursively normalize children
    if (Array.isArray(nodeData.children)) {
      for (const child of nodeData.children) {
        normalizeStructureTypes(child);
      }
    }
  }

  // Normalize compressed keys that might not have been expanded
  // Handle fillG -> fillGeometry and strkG -> strokeGeometry
  if (nodeData.fillG !== undefined && nodeData.fillGeometry === undefined) {
    nodeData.fillGeometry = nodeData.fillG;
    delete nodeData.fillG;
  }
  if (nodeData.strkG !== undefined && nodeData.strokeGeometry === undefined) {
    nodeData.strokeGeometry = nodeData.strkG;
    delete nodeData.strkG;
  }

  // Ensure children array exists after normalization
  // If we still have "child" key after normalization, convert it
  if (nodeData.child && !nodeData.children) {
    nodeData.children = nodeData.child;
    delete nodeData.child;
  }
}

/**
 * Finds or creates a unique frame name on a page
 * If a frame with the same name exists, appends an incrementing number
 */
async function findUniqueFrameName(
  page: PageNode,
  baseName: string,
): Promise<string> {
  const existingNames = new Set<string>();
  for (const child of page.children) {
    if (child.type === "FRAME" || child.type === "COMPONENT") {
      existingNames.add(child.name);
    }
  }

  if (!existingNames.has(baseName)) {
    return baseName;
  }

  let counter = 1;
  let candidateName = `${baseName}_${counter}`;
  while (existingNames.has(candidateName)) {
    counter++;
    candidateName = `${baseName}_${counter}`;
  }

  return candidateName;
}

/**
 * Stage 10.5: Create remote instances on REMOTES page
 * Returns a map of instance table index -> created component node
 */
async function createRemoteInstances(
  instanceTable: InstanceTable,
  variableTable: VariableTable,
  collectionTable: CollectionTable,
  recognizedVariables: Map<string, Variable>,
  recognizedCollections: Map<string, VariableCollection>,
  constructionIcon: string = "", // If provided, prepend this icon to REMOTES page name. Used for wizard imports.
  styleMapping: Map<number, BaseStyle> | null = null, // Map of old style table index -> new style instance
  imageTable: ImageTable | null = null, // Image table for restoring images from Base64
): Promise<{
  remoteComponentMap: Map<number, ComponentNode>;
  dependentComponents: Array<{
    guid: string;
    version: number | undefined;
    pageId: string;
  }>;
}> {
  const allInstances = instanceTable.getSerializedTable();
  const remoteInstances = Object.values(allInstances).filter(
    (entry: any) => entry.instanceType === "remote",
  );

  // Map of instance table index -> created component node
  const remoteComponentMap = new Map<number, ComponentNode>();
  const dependentComponents: Array<{
    guid: string;
    version: number | undefined;
    pageId: string;
  }> = [];

  if (remoteInstances.length === 0) {
    debugConsole.log("No remote instances found");
    return { remoteComponentMap, dependentComponents };
  }

  debugConsole.log(
    `Processing ${remoteInstances.length} remote instance(s)...`,
  );

  // Find or create REMOTES page
  await figma.loadAllPagesAsync();
  const allPages = figma.root.children;
  const remotesPageName = constructionIcon
    ? `${constructionIcon} REMOTES`
    : "REMOTES";
  let remotesPage = allPages.find(
    (p) => p.name === "REMOTES" || p.name === remotesPageName,
  );

  if (!remotesPage) {
    remotesPage = figma.createPage();
    remotesPage.name = remotesPageName;
    debugConsole.log("Created REMOTES page");
  } else {
    debugConsole.log("Found existing REMOTES page");
    // Update name if it doesn't have the construction icon but we're in a wizard import
    if (constructionIcon && !remotesPage.name.startsWith(constructionIcon)) {
      remotesPage.name = remotesPageName;
    }
  }

  // Mark REMOTES page as "under review" if remote instances are being created
  // (This indicates it's being used as part of a wizard import)
  if (remoteInstances.length > 0) {
    // REMOTES page is identified by importResult.createdPageIds if it was created, no need for UNDER_REVIEW_KEY
    debugConsole.log("Marked REMOTES page as under review");
  }

  // Check if title/description already exist
  const hasTitle = remotesPage.children.some(
    (child) => child.type === "FRAME" && child.name === "Title",
  );

  if (!hasTitle) {
    // Load fonts first
    const boldFont = { family: "Inter", style: "Bold" };
    const regularFont = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(boldFont);
    await figma.loadFontAsync(regularFont);

    // Create title text frame
    const titleFrame = figma.createFrame();
    titleFrame.name = "Title";
    titleFrame.layoutMode = "VERTICAL";
    titleFrame.paddingTop = 20;
    titleFrame.paddingBottom = 20;
    titleFrame.paddingLeft = 20;
    titleFrame.paddingRight = 20;
    titleFrame.fills = [];

    const titleText = figma.createText();
    titleText.fontName = boldFont;
    titleText.characters = "REMOTE INSTANCES";
    titleText.fontSize = 24;
    titleText.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
    titleFrame.appendChild(titleText);

    const descriptionText = figma.createText();
    descriptionText.fontName = regularFont;
    descriptionText.characters =
      "These are remotely connected component instances found in our different component pages.";
    descriptionText.fontSize = 14;
    descriptionText.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } },
    ];
    titleFrame.appendChild(descriptionText);

    remotesPage.appendChild(titleFrame);
    debugConsole.log("Created title and description on REMOTES page");
  }

  // Process each remote instance
  const nodeIdMapping = new Map<string, any>(); // For remote instances, we don't need ID mapping

  for (const [indexStr, entry] of Object.entries(allInstances)) {
    if (entry.instanceType !== "remote") {
      continue;
    }

    const instanceIndex = parseInt(indexStr, 10);
    debugConsole.log(
      `Processing remote instance ${instanceIndex}: "${entry.componentName}"`,
    );

    if (!entry.structure) {
      debugConsole.warning(
        `Remote instance "${entry.componentName}" missing structure data, skipping`,
      );
      continue;
    }

    // Normalize structure types: expand numeric types to strings recursively
    // This handles cases where the type enum wasn't expanded during JSON expansion
    normalizeStructureTypes(entry.structure);

    // Debug: Check what keys exist after normalization
    const hasChildren = entry.structure.children !== undefined;
    const hasChild = entry.structure.child !== undefined;
    const childrenCount = entry.structure.children
      ? entry.structure.children.length
      : entry.structure.child
        ? entry.structure.child.length
        : 0;
    debugConsole.log(
      `  Structure type: ${entry.structure.type || "unknown"}, has children: ${childrenCount} (children key: ${hasChildren}, child key: ${hasChild})`,
    );

    // Generate frame name from path and component name
    let frameName = entry.componentName;
    if (entry.path && entry.path.length > 0) {
      const pathString = entry.path
        .filter((segment) => segment !== "")
        .join(" / ");
      if (pathString) {
        frameName = `${pathString} / ${entry.componentName}`;
      }
    }

    // Find unique name for the component
    const uniqueComponentName = await findUniqueFrameName(
      remotesPage,
      frameName,
    );
    if (uniqueComponentName !== frameName) {
      debugConsole.log(
        `Component name conflict: "${frameName}" -> "${uniqueComponentName}"`,
      );
    }

    // Create a component from the structure
    // The structure should be a COMPONENT node, so we'll recreate it as a component
    try {
      // Check if the structure type is COMPONENT
      // Type should already be normalized above, but double-check
      if (entry.structure.type !== "COMPONENT") {
        debugConsole.warning(
          `Remote instance "${entry.componentName}" structure is not a COMPONENT (type: ${entry.structure.type}), creating frame fallback`,
        );
        // Create a frame container as fallback
        const containerFrame = figma.createFrame();
        containerFrame.name = uniqueComponentName;
        const recreatedNode = await recreateNodeFromData(
          entry.structure,
          containerFrame,
          variableTable,
          collectionTable,
          null,
          recognizedVariables,
          nodeIdMapping,
          true, // isRemoteStructure: true
          null, // remoteComponentMap - not needed here
          null, // deferredInstances - not needed for remote instances
          null, // parentNodeData - not available for remote structures
          recognizedCollections,
          null, // placeholderFrameIds - not needed for remote instances
          undefined, // currentPlaceholderId - not needed for remote instances
          styleMapping, // Pass styleMapping to apply styles
          imageTable, // Pass imageTable to restore images
        );
        if (recreatedNode) {
          containerFrame.appendChild(recreatedNode);
          remotesPage.appendChild(containerFrame);
          debugConsole.log(
            `✓ Created remote instance frame fallback: "${uniqueComponentName}"`,
          );
        } else {
          containerFrame.remove();
        }
        continue;
      }

      // Create the component node first and add it to the page
      // Components must be on a page before we can add children to them
      const componentNode = figma.createComponent();
      componentNode.name = uniqueComponentName;
      remotesPage.appendChild(componentNode);
      debugConsole.log(`  Created component node: "${uniqueComponentName}"`);

      // Now recreate the structure's children and properties into the component
      // We need to apply all properties from the structure to the component
      // and recreate its children
      try {
        // Apply component property definitions FIRST (must be set before children are added)
        // Use addComponentProperty() method to add each property individually
        if (entry.structure.componentPropertyDefinitions) {
          const propDefs = entry.structure.componentPropertyDefinitions;
          let addedCount = 0;
          let failedCount = 0;

          for (const [propName, propDef] of Object.entries(propDefs)) {
            try {
              // propDef format: { type: number, defaultValue?: any }
              // Map type numbers to Figma API type strings
              const typeMap: Record<
                number,
                "TEXT" | "BOOLEAN" | "INSTANCE_SWAP" | "VARIANT"
              > = {
                2: "TEXT", // Text property
                25: "BOOLEAN", // Boolean property
                27: "INSTANCE_SWAP", // Instance swap property
                26: "VARIANT", // Variant property
              };

              const propType = typeMap[(propDef as any).type];
              if (!propType) {
                debugConsole.warning(
                  `  Unknown property type ${(propDef as any).type} for property "${propName}" in component "${entry.componentName}"`,
                );
                failedCount++;
                continue;
              }

              const defaultValue = (propDef as any).defaultValue;
              // Property names in JSON may include IDs (e.g., "Show trailing icon#318:0")
              // Extract just the property name part (before the #)
              const cleanPropName = propName.split("#")[0];
              componentNode.addComponentProperty(
                cleanPropName,
                propType,
                defaultValue,
              );
              addedCount++;
            } catch (error) {
              debugConsole.warning(
                `  Failed to add component property "${propName}" to "${entry.componentName}": ${error}`,
              );
              failedCount++;
            }
          }

          if (addedCount > 0) {
            debugConsole.log(
              `  Added ${addedCount} component property definition(s) to "${entry.componentName}"${failedCount > 0 ? ` (${failedCount} failed)` : ""}`,
            );
          }
        }

        // Apply basic properties
        if (entry.structure.name !== undefined) {
          componentNode.name = entry.structure.name;
        }
        // Check for bound variables before setting width/height
        // Note: minWidth and maxWidth are constraints, not the actual size, but we include them
        // in the check to ensure we handle them correctly
        const hasBoundVariablesForSize =
          entry.structure.boundVariables &&
          typeof entry.structure.boundVariables === "object" &&
          (entry.structure.boundVariables.width ||
            entry.structure.boundVariables.height ||
            entry.structure.boundVariables.minWidth ||
            entry.structure.boundVariables.maxWidth);
        if (
          entry.structure.width !== undefined &&
          entry.structure.height !== undefined &&
          !hasBoundVariablesForSize
        ) {
          componentNode.resize(entry.structure.width, entry.structure.height);
        }
        if (entry.structure.x !== undefined) {
          componentNode.x = entry.structure.x;
        }
        if (entry.structure.y !== undefined) {
          componentNode.y = entry.structure.y;
        }

        // Apply visual properties
        // Check for bound variables before setting direct values
        const hasBoundVariablesForVisual =
          entry.structure.boundVariables &&
          typeof entry.structure.boundVariables === "object";
        if (entry.structure.visible !== undefined) {
          componentNode.visible = entry.structure.visible;
        }
        if (
          entry.structure.opacity !== undefined &&
          (!hasBoundVariablesForVisual ||
            !entry.structure.boundVariables.opacity)
        ) {
          componentNode.opacity = entry.structure.opacity;
        }
        if (
          entry.structure.rotation !== undefined &&
          (!hasBoundVariablesForVisual ||
            !entry.structure.boundVariables.rotation)
        ) {
          componentNode.rotation = entry.structure.rotation;
        }
        if (
          entry.structure.blendMode !== undefined &&
          (!hasBoundVariablesForVisual ||
            !entry.structure.boundVariables.blendMode)
        ) {
          componentNode.blendMode = entry.structure.blendMode;
        }

        // Apply fills
        if (entry.structure.fills !== undefined) {
          try {
            let fills = entry.structure.fills;
            if (Array.isArray(fills)) {
              fills = fills.map((fill: any) => {
                if (fill && typeof fill === "object") {
                  // Create a copy without boundVariables (they may contain _varRef which is invalid)
                  const fillWithoutBoundVars = { ...fill };
                  delete fillWithoutBoundVars.boundVariables;
                  return fillWithoutBoundVars;
                }
                return fill;
              });
            }
            componentNode.fills = fills;

            // Restore bound variables for fills
            if (entry.structure.boundVariables?.fills && recognizedVariables) {
              await restoreBoundVariablesForFills(
                componentNode,
                entry.structure.boundVariables,
                "fills",
                recognizedVariables,
                variableTable,
                collectionTable,
                recognizedCollections,
              );
            }
          } catch (error) {
            debugConsole.warning(
              `Error setting fills for remote component "${entry.componentName}": ${error}`,
            );
          }
        }

        // Apply strokes
        if (entry.structure.strokes !== undefined) {
          try {
            componentNode.strokes = entry.structure.strokes;
          } catch (error) {
            debugConsole.warning(
              `Error setting strokes for remote component "${entry.componentName}": ${error}`,
            );
          }
        }

        // Apply stroke properties (check for bound variables)
        const hasBoundVariablesForStroke =
          entry.structure.boundVariables &&
          typeof entry.structure.boundVariables === "object" &&
          (entry.structure.boundVariables.strokeWeight ||
            entry.structure.boundVariables.strokeAlign);
        if (
          entry.structure.strokeWeight !== undefined &&
          (!hasBoundVariablesForStroke ||
            !entry.structure.boundVariables.strokeWeight)
        ) {
          componentNode.strokeWeight = entry.structure.strokeWeight;
        }
        if (
          entry.structure.strokeAlign !== undefined &&
          (!hasBoundVariablesForStroke ||
            !entry.structure.boundVariables.strokeAlign)
        ) {
          componentNode.strokeAlign = entry.structure.strokeAlign;
        }

        // Apply layout properties
        if (entry.structure.layoutMode !== undefined) {
          componentNode.layoutMode = entry.structure.layoutMode;
        }
        if (entry.structure.primaryAxisSizingMode !== undefined) {
          componentNode.primaryAxisSizingMode =
            entry.structure.primaryAxisSizingMode;
        }
        if (entry.structure.counterAxisSizingMode !== undefined) {
          componentNode.counterAxisSizingMode =
            entry.structure.counterAxisSizingMode;
        }
        // Check for bound variables before setting direct values
        // Setting a property directly overwrites variable bindings, so we need to check first
        const hasBoundVariables =
          entry.structure.boundVariables &&
          typeof entry.structure.boundVariables === "object";
        if (
          entry.structure.paddingLeft !== undefined &&
          (!hasBoundVariables || !entry.structure.boundVariables.paddingLeft)
        ) {
          componentNode.paddingLeft = entry.structure.paddingLeft;
        }
        if (
          entry.structure.paddingRight !== undefined &&
          (!hasBoundVariables || !entry.structure.boundVariables.paddingRight)
        ) {
          componentNode.paddingRight = entry.structure.paddingRight;
        }
        if (
          entry.structure.paddingTop !== undefined &&
          (!hasBoundVariables || !entry.structure.boundVariables.paddingTop)
        ) {
          componentNode.paddingTop = entry.structure.paddingTop;
        }
        if (
          entry.structure.paddingBottom !== undefined &&
          (!hasBoundVariables || !entry.structure.boundVariables.paddingBottom)
        ) {
          componentNode.paddingBottom = entry.structure.paddingBottom;
        }
        if (
          entry.structure.itemSpacing !== undefined &&
          (!hasBoundVariables || !entry.structure.boundVariables.itemSpacing)
        ) {
          componentNode.itemSpacing = entry.structure.itemSpacing;
        }
        // Check for bound variables for corner radius properties
        const hasBoundVariablesForCornerRadius =
          entry.structure.boundVariables &&
          typeof entry.structure.boundVariables === "object" &&
          (entry.structure.boundVariables.cornerRadius ||
            entry.structure.boundVariables.topLeftRadius ||
            entry.structure.boundVariables.topRightRadius ||
            entry.structure.boundVariables.bottomLeftRadius ||
            entry.structure.boundVariables.bottomRightRadius);
        if (
          entry.structure.cornerRadius !== undefined &&
          (!hasBoundVariablesForCornerRadius ||
            !entry.structure.boundVariables.cornerRadius)
        ) {
          componentNode.cornerRadius = entry.structure.cornerRadius;
        }

        // Restore bound variables for all properties (if any)
        if (entry.structure.boundVariables && recognizedVariables) {
          const boundVars = entry.structure.boundVariables;
          const allBindableProps: Array<
            | "paddingLeft"
            | "paddingRight"
            | "paddingTop"
            | "paddingBottom"
            | "itemSpacing"
            | "opacity"
            | "rotation"
            | "blendMode"
            | "strokeWeight"
            | "strokeAlign"
            | "cornerRadius"
            | "topLeftRadius"
            | "topRightRadius"
            | "bottomLeftRadius"
            | "bottomRightRadius"
            | "width"
            | "height"
            | "minWidth"
            | "maxWidth"
          > = [
            "paddingLeft",
            "paddingRight",
            "paddingTop",
            "paddingBottom",
            "itemSpacing",
            "opacity",
            "rotation",
            "blendMode",
            "strokeWeight",
            "strokeAlign",
            "cornerRadius",
            "topLeftRadius",
            "topRightRadius",
            "bottomLeftRadius",
            "bottomRightRadius",
            "width",
            "height",
            "minWidth",
            "maxWidth",
          ];
          for (const propName of allBindableProps) {
            if (
              boundVars[propName] &&
              isVariableReference(boundVars[propName])
            ) {
              const varRef = (boundVars[propName] as VariableReference)._varRef;
              if (varRef !== undefined) {
                const variable = recognizedVariables.get(String(varRef));
                if (variable) {
                  const alias = {
                    type: "VARIABLE_ALIAS" as const,
                    id: variable.id,
                  };
                  if (!(componentNode as any).boundVariables) {
                    (componentNode as any).boundVariables = {};
                  }
                  (componentNode as any).boundVariables[propName] = alias;
                }
              }
            }
          }
        }

        // Recreate children
        // Handle both "child" (compressed) and "children" (expanded) keys
        // Debug: Log structure keys before accessing children
        debugConsole.log(
          `  DEBUG: Structure keys: ${Object.keys(entry.structure).join(", ")}, has children: ${!!entry.structure.children}, has child: ${!!entry.structure.child}`,
        );
        const childrenArray =
          entry.structure.children ||
          (entry.structure.child ? entry.structure.child : null);
        debugConsole.log(
          `  DEBUG: childrenArray exists: ${!!childrenArray}, isArray: ${Array.isArray(childrenArray)}, length: ${childrenArray ? childrenArray.length : 0}`,
        );
        if (
          childrenArray &&
          Array.isArray(childrenArray) &&
          childrenArray.length > 0
        ) {
          debugConsole.log(
            `  Recreating ${childrenArray.length} child(ren) for component "${entry.componentName}"`,
          );
          for (let i = 0; i < childrenArray.length; i++) {
            const childData = childrenArray[i];
            debugConsole.log(
              `  DEBUG: Processing child ${i + 1}/${childrenArray.length}: ${JSON.stringify({ name: childData?.name, type: childData?.type, hasTruncated: !!childData?._truncated })}`,
            );
            if (childData._truncated) {
              debugConsole.log(
                `  Skipping truncated child: ${childData._reason || "Unknown"}`,
              );
              continue;
            }
            debugConsole.log(
              `  Recreating child: "${childData.name || "Unnamed"}" (type: ${childData.type})`,
            );
            const childNode = await recreateNodeFromData(
              childData,
              componentNode,
              variableTable,
              collectionTable,
              null,
              recognizedVariables,
              nodeIdMapping,
              true, // isRemoteStructure: true
              null, // remoteComponentMap - not needed here
              null, // deferredInstances - not needed for remote instances
              entry.structure, // parentNodeData - pass the component's structure so children can check for auto-layout
              recognizedCollections,
              null, // placeholderFrameIds - not needed for remote instances
              undefined, // currentPlaceholderId - not needed for remote instances
              styleMapping, // Pass styleMapping to apply styles
              imageTable, // Pass imageTable to restore images
            );
            if (childNode) {
              componentNode.appendChild(childNode);
              debugConsole.log(
                `  ✓ Appended child "${childData.name || "Unnamed"}" to component "${entry.componentName}"`,
              );
            } else {
              debugConsole.warning(
                `  ✗ Failed to create child "${childData.name || "Unnamed"}" (type: ${childData.type})`,
              );
            }
          }
        }

        remoteComponentMap.set(instanceIndex, componentNode);

        // Collect dependent component information
        const componentGuid = entry.componentGuid || "";
        const componentVersion = entry.componentVersion;
        if (componentGuid) {
          dependentComponents.push({
            guid: componentGuid,
            version: componentVersion,
            pageId: remotesPage.id,
          });
        }

        debugConsole.log(
          `✓ Created remote component: "${uniqueComponentName}" (index ${instanceIndex})`,
        );
      } catch (error) {
        debugConsole.warning(
          `Error populating remote component "${entry.componentName}": ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        componentNode.remove();
      }
    } catch (error) {
      debugConsole.warning(
        `Error recreating remote instance "${entry.componentName}": ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  debugConsole.log(
    `Remote instance processing complete: ${remoteComponentMap.size} component(s) created`,
  );

  return { remoteComponentMap, dependentComponents };
}

/**
 * Stage 11: Create page and recreate structure
 */
async function createPageAndRecreateStructure(
  metadata: {
    guid: string;
    name: string;
    version?: number;
    description?: string;
    url?: string;
  },
  expandedJsonData: any,
  variableTable: VariableTable,
  collectionTable: CollectionTable,
  instanceTable: InstanceTable | null,
  recognizedVariables: Map<string, Variable>,
  remoteComponentMap: Map<number, ComponentNode> | null = null,
  deferredInstances: DeferredNormalInstance[] | null = null,
  placeholderFrameIds: Set<string> | null = null, // Track placeholder frame IDs as we create them
  isMainPage: boolean = false, // If true, always create a copy (no prompt). If false, prompt for existing pages.
  recognizedCollections: Map<string, VariableCollection> | null = null,
  alwaysCreateCopy: boolean = false, // If true, always create a copy (no prompt) even if page exists. Used for wizard imports.
  skipUniqueNaming: boolean = false, // If true, skip adding _<number> suffix to page names. Used for wizard imports.
  constructionIcon: string = "", // If provided, prepend this icon to page name. Used for wizard imports.
  styleMapping: Map<number, BaseStyle> | null = null, // Map of old style table index -> new style instance
  imageTable: ImageTable | null = null, // Image table for restoring images from Base64
): Promise<{
  success: boolean;
  page?: PageNode;
  pageId?: string; // Page ID for tracking (used when reusing existing page)
  error?: string;
  deferredInstances?: DeferredNormalInstance[];
}> {
  debugConsole.log("Creating page from JSON...");

  await figma.loadAllPagesAsync();
  const allPages = figma.root.children;
  const PAGE_METADATA_KEY = "RecursicaPublishedMetadata";

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
        continue;
      }
    }
  }

  // Check if we should use existing page or create a copy
  // Main page always creates a copy (no prompt). Only referenced/dependency pages prompt.
  // If alwaysCreateCopy is true (from wizard), always create a copy without prompting.
  let useExistingPage = false;
  if (pageWithSameGuid && !isMainPage && !alwaysCreateCopy) {
    // Get version from existing page metadata
    let existingVersion: number | undefined;
    try {
      const existingMetadataStr =
        pageWithSameGuid.getPluginData(PAGE_METADATA_KEY);
      if (existingMetadataStr) {
        const existingMetadata = JSON.parse(existingMetadataStr);
        existingVersion = existingMetadata.version;
      }
    } catch {
      // Version not available, continue
    }

    const versionText =
      existingVersion !== undefined ? ` v${existingVersion}` : "";
    const message = `Found existing component "${pageWithSameGuid.name}${versionText}". Should I use it or create a copy?`;

    debugConsole.log(
      `Found existing page with same GUID: "${pageWithSameGuid.name}". Prompting user...`,
    );

    try {
      // Prompt user: OK = "Use", Cancel = "Copy"
      await pluginPrompt.prompt(message, {
        okLabel: "Use",
        cancelLabel: "Copy",
        timeoutMs: 300000, // 5 minutes
      });

      // User chose "Use" - return existing page
      useExistingPage = true;
      debugConsole.log(
        `User chose to use existing page: "${pageWithSameGuid.name}"`,
      );
    } catch {
      // User chose "Copy" or cancelled - proceed with creating new page
      debugConsole.log(`User chose to create a copy. Will create new page.`);
    }
  }

  // If user chose to use existing page, return it immediately
  // Note: We skip recreating the page structure. Instances from other pages
  // that reference this page will resolve correctly by finding the page by name
  // (componentPageName) during their import process.
  if (useExistingPage && pageWithSameGuid) {
    await figma.setCurrentPageAsync(pageWithSameGuid);
    debugConsole.log(
      `Using existing page: "${pageWithSameGuid.name}" (GUID: ${metadata.guid.substring(0, 8)}...)`,
    );
    debugConsole.log(
      `  Instances from other pages will resolve to components on this existing page using componentPageName: "${pageWithSameGuid.name}"`,
    );
    return {
      success: true,
      page: pageWithSameGuid,
      // Include pageId so it can be tracked in importedPages
      pageId: pageWithSameGuid.id,
    };
  }

  // Otherwise, proceed with creating a new page
  const existingPageByName = allPages.find((p) => p.name === metadata.name);
  if (existingPageByName) {
    debugConsole.log(
      `Found existing page with same name: "${metadata.name}". Will create new page with unique name.`,
    );
  }

  let pageName: string;
  if (pageWithSameGuid || existingPageByName) {
    const scratchBaseName = `__${metadata.name}`;
    pageName = await findUniquePageName(scratchBaseName);
    debugConsole.log(
      `Creating scratch page: "${pageName}" (will be renamed to "${metadata.name}" on success)`,
    );
  } else {
    pageName = metadata.name;
    debugConsole.log(`Creating page: "${pageName}"`);
  }

  const newPage = figma.createPage();
  newPage.name = pageName;

  await figma.setCurrentPageAsync(newPage);
  debugConsole.log(`Switched to page: "${pageName}"`);

  if (!expandedJsonData.pageData) {
    return {
      success: false,
      error: "No page data found in JSON",
    };
  }

  debugConsole.log("Recreating page structure...");
  const pageData = expandedJsonData.pageData;

  // Wrap structure recreation in try-catch so we always return the page
  // even if an error occurs during structure recreation
  let structureError: string | undefined = undefined;
  try {
    // Apply page-level properties (like backgrounds) if they exist
    // Pages have backgrounds property for background color
    if (pageData.backgrounds !== undefined) {
      try {
        newPage.backgrounds = pageData.backgrounds;
        debugConsole.log(
          `Set page background: ${JSON.stringify(pageData.backgrounds)}`,
        );
      } catch (error) {
        debugConsole.warning(`Failed to set page background: ${error}`);
      }
    }

    // Normalize structure types: expand numeric types to strings recursively
    // This handles cases where the type enum wasn't expanded during JSON expansion
    normalizeStructureTypes(pageData);

    const nodeIdMapping = new Map<string, any>();

    // Helper function to recursively find all component IDs in the page data
    const findAllComponentIds = (node: any, ids: string[] = []): string[] => {
      if (node.type === "COMPONENT" && node.id) {
        ids.push(node.id);
      }
      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
          if (!child._truncated) {
            findAllComponentIds(child, ids);
          }
        }
      }
      return ids;
    };

    // Log all component IDs found in the page data for debugging
    const allComponentIds = findAllComponentIds(pageData);
    debugConsole.log(
      `Found ${allComponentIds.length} COMPONENT node(s) in page data`,
    );
    if (allComponentIds.length > 0) {
      debugConsole.log(
        `Component IDs in page data (first 20): ${allComponentIds
          .slice(0, 20)
          .map((id) => id.substring(0, 8) + "...")
          .join(", ")}`,
      );
      // Also check if we can find the specific ID we're looking for later
      // Store this for later reference
      (pageData as any)._allComponentIds = allComponentIds;
    }

    if (pageData.children && Array.isArray(pageData.children)) {
      for (const childData of pageData.children) {
        const childNode = await recreateNodeFromData(
          childData,
          newPage,
          variableTable,
          collectionTable,
          instanceTable,
          recognizedVariables,
          nodeIdMapping,
          false, // isRemoteStructure: false - we're creating the main page
          remoteComponentMap,
          deferredInstances,
          pageData, // parentNodeData - pass the page's nodeData so children can check for auto-layout
          recognizedCollections,
          placeholderFrameIds,
          undefined, // currentPlaceholderId - page root is not inside a placeholder
          styleMapping, // Pass styleMapping to apply styles
          imageTable, // Pass imageTable to restore images
        );
        if (childNode) {
          newPage.appendChild(childNode);
        }
      }
    }

    debugConsole.log("Page structure recreated successfully");

    // Third pass: Set variant properties on all instances now that component sets are created
    // This is needed because instances are created before component sets are combined,
    // so variant properties can't be set until after component sets exist
    if (instanceTable) {
      debugConsole.log(
        "Third pass: Setting variant properties on instances...",
      );
      await setVariantPropertiesOnInstances(
        newPage,
        instanceTable,
        nodeIdMapping,
      );
    }
  } catch (error) {
    // Error occurred during structure recreation, but page was already created
    // Log the error and continue to return the page so it can be tracked
    structureError = error instanceof Error ? error.message : String(error);
    debugConsole.error(
      `Error during page structure recreation (page was created): ${structureError}`,
    );
    if (error instanceof Error && error.stack) {
      debugConsole.error(`Stack trace: ${error.stack}`);
    }
  }

  // Always set page metadata and apply construction icon, even if structure recreation failed
  const pageMetadata = {
    _ver: 1,
    id: metadata.guid,
    name: metadata.name,
    version: metadata.version || 0,
    publishDate: new Date().toISOString(),
    history: {},
    ...(metadata.description !== undefined && {
      description: metadata.description,
    }),
    ...(metadata.url !== undefined && { url: metadata.url }),
  };
  newPage.setPluginData(PAGE_METADATA_KEY, JSON.stringify(pageMetadata));
  debugConsole.log(
    `Stored page metadata (GUID: ${metadata.guid.substring(0, 8)}...)`,
  );

  if (pageName.startsWith("__")) {
    let finalName: string;
    if (skipUniqueNaming) {
      // For wizard imports, use base name with construction icon, no _<number> suffix
      finalName = constructionIcon
        ? `${constructionIcon} ${metadata.name}`
        : metadata.name;
    } else {
      finalName = await findUniquePageName(metadata.name);
    }
    newPage.name = finalName;
    debugConsole.log(`Renamed page from "${pageName}" to "${finalName}"`);
  } else if (skipUniqueNaming && constructionIcon) {
    // For wizard imports, ensure construction icon is present
    if (!newPage.name.startsWith(constructionIcon)) {
      newPage.name = `${constructionIcon} ${newPage.name}`;
    }
  }

  // Always return the page, even if structure recreation failed
  // This ensures the page is tracked even if an error occurred
  return {
    success: !structureError, // success is false if there was an error
    page: newPage,
    pageId: newPage.id, // Always include pageId for tracking
    error: structureError, // Include error if structure recreation failed
    deferredInstances: deferredInstances || undefined,
  };
}

export async function importPage(
  data: ImportPageData,
  requestId?: string, // Optional request ID for cancellation support
): Promise<ResponseMessage> {
  // Capture import timestamp at the start
  const importedAt = new Date().toISOString();

  // Check for cancellation at the start
  checkCancellation(requestId);
  // Only clear console if explicitly requested (default: true for single page imports)
  const shouldClearConsole = data.clearConsole !== false;
  if (shouldClearConsole) {
    debugConsole.clear();
  }
  // Clear component binding data Map at the start of each import
  componentBindingData.clear();
  debugConsole.log("=== Starting Page Import ===");

  const newlyCreatedCollections: VariableCollection[] = [];
  let newlyCreatedVariables: Variable[] = [];
  let newlyCreatedStyles: BaseStyle[] = [];
  let dependentComponents: Array<{
    guid: string;
    version: number | undefined;
    pageId: string;
  }> = [];
  // Track created page ID immediately after creation so it's included even if error occurs later
  let createdPageId: string | null = null;

  try {
    const jsonData = data.jsonData;

    if (!jsonData) {
      debugConsole.error("JSON data is required");
      return {
        type: "importPage",
        success: false,
        error: true,
        message: "JSON data is required",
        data: {},
      };
    }

    // Stage 1: Validate metadata
    debugConsole.log("Validating metadata...");
    const metadataResult = validateMetadata(jsonData);
    if (!metadataResult.success) {
      debugConsole.error(metadataResult.error!);
      return {
        type: "importPage",
        success: false,
        error: true,
        message: metadataResult.error!,
        data: {},
      };
    }
    const metadata = metadataResult.metadata!;
    debugConsole.log(
      `Metadata validated: guid=${metadata.guid}, name=${metadata.name}`,
    );
    checkCancellation(requestId);

    // Stage 2: Load and expand JSON
    debugConsole.log("Loading string table...");
    const jsonResult = loadAndExpandJson(jsonData);
    if (!jsonResult.success) {
      debugConsole.error(jsonResult.error!);
      return {
        type: "importPage",
        success: false,
        error: true,
        message: jsonResult.error!,
        data: {},
      };
    }
    debugConsole.log("String table loaded successfully");
    debugConsole.log("Expanding JSON data...");
    const expandedJsonData = jsonResult.expandedJsonData!;
    debugConsole.log("JSON expanded successfully");
    checkCancellation(requestId);

    // Stage 3: Load collection table
    debugConsole.log("Loading collections table...");
    const collectionTableResult = loadCollectionTable(expandedJsonData);
    if (!collectionTableResult.success) {
      if (
        collectionTableResult.error === "No collections table found in JSON"
      ) {
        debugConsole.log(collectionTableResult.error);
        debugConsole.log("=== Import Complete ===");
        return {
          type: "importPage",
          success: true,
          error: false,
          message: "Import complete (no collections to process)",
          data: { pageName: metadata.name },
        };
      }
      debugConsole.error(collectionTableResult.error!);
      return {
        type: "importPage",
        success: false,
        error: true,
        message: collectionTableResult.error!,
        data: {},
      };
    }
    const collectionTable = collectionTableResult.collectionTable!;
    debugConsole.log(
      `Loaded collections table with ${collectionTable.getSize()} collection(s)`,
    );
    checkCancellation(requestId);

    // Stage 4: Match collections
    debugConsole.log("Matching collections with existing local collections...");
    const { recognizedCollections, potentialMatches, collectionsToCreate } =
      await matchCollections(collectionTable, data.preCreatedCollections);

    // Stage 5: Prompt for potential matches (or use wizard selections)
    await promptForPotentialMatches(
      potentialMatches,
      recognizedCollections,
      collectionsToCreate,
      data.collectionChoices,
    );

    // Stage 6: Ensure modes for recognized collections
    await ensureModesForRecognizedCollections(
      recognizedCollections,
      collectionTable,
      potentialMatches,
    );

    // Stage 7: Create new collections (or reuse pre-created ones)
    await createNewCollections(
      collectionsToCreate,
      recognizedCollections,
      newlyCreatedCollections,
      data.preCreatedCollections,
    );
    checkCancellation(requestId);

    // Stage 8: Load variable table
    debugConsole.log("Loading variables table...");
    const variableTableResult = loadVariableTable(expandedJsonData);
    if (!variableTableResult.success) {
      if (variableTableResult.error === "No variables table found in JSON") {
        debugConsole.log(variableTableResult.error);
        debugConsole.log("=== Import Complete ===");
        return {
          type: "importPage",
          success: true,
          error: false,
          message: "Import complete (no variables to process)",
          data: { pageName: metadata.name },
        };
      }
      debugConsole.error(variableTableResult.error!);
      return {
        type: "importPage",
        success: false,
        error: true,
        message: variableTableResult.error!,
        data: {},
      };
    }
    const variableTable = variableTableResult.variableTable!;
    debugConsole.log(
      `Loaded variables table with ${variableTable.getSize()} variable(s)`,
    );

    checkCancellation(requestId);
    // Stage 9: Match and create variables
    const matchVariablesResult = await matchAndCreateVariables(
      variableTable,
      collectionTable,
      recognizedCollections,
      newlyCreatedCollections,
    );
    const recognizedVariables = matchVariablesResult.recognizedVariables;
    newlyCreatedVariables = matchVariablesResult.newlyCreatedVariables;

    // Stage 9.5: Import styles (after variables so styles can bind to variables)
    debugConsole.log("Checking for styles table...");
    const hasStylesTable =
      expandedJsonData.styles !== undefined && expandedJsonData.styles !== null;

    // Check if style references exist in pageData but styles table is missing
    if (!hasStylesTable) {
      const hasStyleReferences = checkForStyleReferences(
        expandedJsonData.pageData,
      );
      if (hasStyleReferences) {
        const errorMessage =
          "Style references found in page data but styles table is missing from JSON. Cannot import styles.";
        debugConsole.error(errorMessage);
        return {
          type: "importPage",
          success: false,
          error: true,
          message: errorMessage,
          data: {},
        };
      }
      debugConsole.log(
        "No styles table found in JSON (and no style references detected)",
      );
    }

    let styleMapping: Map<number, BaseStyle> | null = null;
    if (hasStylesTable) {
      debugConsole.log("Loading styles table...");
      const styleTable = StyleTable.fromTable(expandedJsonData.styles);
      debugConsole.log(
        `Loaded styles table with ${styleTable.getSize()} style(s)`,
      );
      const stylesResult = await importStyles(
        styleTable.getTable(),
        recognizedVariables,
      );
      styleMapping = stylesResult.styleMapping;
      newlyCreatedStyles = stylesResult.newlyCreatedStyles;
      debugConsole.log(
        `Imported ${styleMapping.size} style(s) (some may have been skipped if they already exist)`,
      );
    }

    checkCancellation(requestId);
    // Stage 10: Load instance table
    debugConsole.log("Loading instance table...");
    const instanceTable = loadInstanceTable(expandedJsonData);
    if (instanceTable) {
      const allInstances = instanceTable.getSerializedTable();
      const internalInstances = Object.values(allInstances).filter(
        (entry: any) => entry.instanceType === "internal",
      );
      const remoteInstances = Object.values(allInstances).filter(
        (entry: any) => entry.instanceType === "remote",
      );
      debugConsole.log(
        `Loaded instance table with ${instanceTable.getSize()} instance(s) (${internalInstances.length} internal, ${remoteInstances.length} remote)`,
      );
    } else {
      debugConsole.log("No instance table found in JSON");
    }

    // Stage 10.5: Load image table
    debugConsole.log("Loading images table...");
    const imageTable = loadImageTable(expandedJsonData);
    if (imageTable) {
      debugConsole.log(
        `Loaded images table with ${imageTable.getSize()} image(s)`,
      );
    } else {
      debugConsole.log("No images table found in JSON");
    }

    checkCancellation(requestId);
    // Stage 11: Create page and recreate structure
    const deferredInstances: DeferredNormalInstance[] = [];
    // Track placeholder frame IDs as we create them, so we can check if parent is a placeholder
    // even before the deferred instance is added to the array
    const placeholderFrameIds = new Set<string>();
    const isMainPage = data.isMainPage ?? true; // Default to true for single page imports
    const alwaysCreateCopy = data.alwaysCreateCopy ?? false;
    const skipUniqueNaming = data.skipUniqueNaming ?? false;
    const constructionIcon = data.constructionIcon || "";

    // Stage 10.5: Create remote instances on REMOTES page
    let remoteComponentMap: Map<number, ComponentNode> | null = null;
    if (instanceTable) {
      const remoteInstancesResult = await createRemoteInstances(
        instanceTable,
        variableTable,
        collectionTable,
        recognizedVariables,
        recognizedCollections,
        constructionIcon,
        styleMapping, // Pass styleMapping to apply styles
        imageTable, // Pass imageTable to restore images
      );
      remoteComponentMap = remoteInstancesResult.remoteComponentMap;
      dependentComponents = remoteInstancesResult.dependentComponents;
    }
    const pageResult = await createPageAndRecreateStructure(
      metadata,
      expandedJsonData,
      variableTable,
      collectionTable,
      instanceTable,
      recognizedVariables,
      remoteComponentMap,
      deferredInstances,
      placeholderFrameIds,
      isMainPage,
      recognizedCollections,
      alwaysCreateCopy,
      skipUniqueNaming,
      constructionIcon,
      styleMapping, // Pass styleMapping to apply styles
      imageTable, // Pass imageTable to restore images
    );

    if (!pageResult.success) {
      debugConsole.error(pageResult.error!);
      // If page was created but error occurred later, track it
      if (pageResult.pageId) {
        createdPageId = pageResult.pageId;
      } else if (pageResult.page) {
        createdPageId = pageResult.page.id;
      }
      return {
        type: "importPage",
        success: false,
        error: true,
        message: pageResult.error!,
        data: {},
      };
    }

    const newPage = pageResult.page!;
    // Track page ID immediately after creation so it's included even if error occurs later
    createdPageId = pageResult.pageId || newPage.id;
    const totalVariables =
      recognizedVariables.size + newlyCreatedVariables.length;

    // Get deferred instances from pageResult (they were populated during page creation)
    const deferredInstancesFromResult =
      pageResult.deferredInstances || deferredInstances;
    const deferredCount = deferredInstancesFromResult?.length || 0;
    debugConsole.log("=== Import Complete ===");
    debugConsole.log(
      `Successfully processed ${recognizedCollections.size} collection(s), ${totalVariables} variable(s), and created page "${newPage.name}"${deferredCount > 0 ? ` (${deferredCount} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`,
    );

    if (deferredCount > 0) {
      for (const deferred of deferredInstancesFromResult) {
        debugConsole.log(
          `    - "${deferred.nodeData.name}" from page "${deferred.instanceEntry.componentPageName}"`,
        );
      }
    }

    // Include pageId in response (either from pageResult.pageId for reused pages, or newPage.id for new pages)
    const pageId = pageResult.pageId || newPage.id;

    // Include debug logs in response
    const debugLogs = debugConsole.getLogs();

    // Build comprehensive import result
    const importResult: PageImportResult = {
      componentGuid: metadata.guid,
      componentPage: metadata.name,
      branch: data.branch,
      importedAt,
      logs: debugLogs,
      createdPageIds: [newPage.id],
      createdCollectionIds: newlyCreatedCollections.map((c) => c.id),
      createdVariableIds: newlyCreatedVariables.map((v) => v.id),
      createdStyleIds: newlyCreatedStyles.map((s) => s.id),
      dependentComponents,
    };

    // additionalPages feature has been removed
    // Referenced pages should be imported separately

    const responseData = {
      pageName: newPage.name,
      pageId: pageId, // Include pageId for tracking (used for both new and reused pages)
      deferredInstances:
        deferredCount > 0 ? deferredInstancesFromResult : undefined,
      importResult,
      ...(debugLogs.length > 0 && { debugLogs }),
    };

    return {
      type: "importPage",
      success: true,
      error: false,
      message: "Import completed successfully",
      data: responseData,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    debugConsole.error(`Import failed: ${errorMessage}`);
    if (error instanceof Error && error.stack) {
      debugConsole.error(`Stack trace: ${error.stack}`);
    }
    console.error("Error importing page:", error);
    // Include debug logs in error response
    const debugLogs = debugConsole.getLogs();

    // Build partial import result for error case
    // Try to get metadata if it was validated before the error occurred
    let componentGuid = "";
    let componentPage = "";
    try {
      const jsonData = data.jsonData;
      if (jsonData) {
        const metadataResult = validateMetadata(jsonData);
        if (metadataResult.success && metadataResult.metadata) {
          componentGuid = metadataResult.metadata.guid;
          componentPage = metadataResult.metadata.name;
        }
      }
    } catch {
      // Metadata validation failed, use empty strings
    }

    const importResult: PageImportResult = {
      componentGuid,
      componentPage,
      branch: data.branch,
      importedAt,
      error: errorMessage,
      logs: debugLogs,
      // Include page ID if it was created before the error occurred
      createdPageIds: createdPageId ? [createdPageId] : [],
      createdCollectionIds: newlyCreatedCollections.map((c) => c.id),
      createdVariableIds: newlyCreatedVariables.map((v) => v.id),
      createdStyleIds: newlyCreatedStyles.map((s) => s.id),
      dependentComponents,
    };

    return {
      type: "importPage",
      success: false,
      error: true,
      message: errorMessage,
      data: {
        importResult,
        ...(debugLogs.length > 0 && { debugLogs }),
      },
    };
  }
}

/**
 * Helper function to apply fill bound variables to instance children
 * This handles the case where instance children have fill bound variables that need to be applied
 * during deferred instance resolution (instance override scenario)
 */
async function applyFillBoundVariablesToInstanceChildren(
  instanceNode: InstanceNode,
  nodeData: any,
  recognizedVariables: Map<string, Variable> | null,
): Promise<void> {
  if (
    !recognizedVariables ||
    !nodeData.children ||
    !Array.isArray(nodeData.children) ||
    !instanceNode.children ||
    instanceNode.children.length === 0
  ) {
    return;
  }

  // Iterate through instance children and apply fill bound variables
  debugConsole.log(
    `[FILL-BOUND] Applying fill bound variables to instance "${instanceNode.name}" children. Instance has ${instanceNode.children.length} child(ren), JSON has ${nodeData.children?.length || 0} child(ren)`,
  );

  for (const instanceChild of instanceNode.children) {
    // Only process nodes that have fills (VectorNode, TextNode, etc.)
    if (!("fills" in instanceChild) || !Array.isArray(instanceChild.fills)) {
      debugConsole.log(
        `[FILL-BOUND] Skipping child "${instanceChild.name}" - no fills property`,
      );
      continue;
    }

    // Find matching child data by name
    const childData = nodeData.children.find(
      (cd: any) => cd.name === instanceChild.name,
    );

    if (!childData) {
      debugConsole.log(
        `[FILL-BOUND] No JSON data found for child "${instanceChild.name}" in instance "${instanceNode.name}"`,
      );
      continue;
    }

    if (!childData.boundVariables?.fills) {
      debugConsole.log(
        `[FILL-BOUND] Child "${instanceChild.name}" in instance "${instanceNode.name}" has no fill bound variables in JSON`,
      );
      continue;
    }

    debugConsole.log(
      `[FILL-BOUND] Found fill bound variables for child "${instanceChild.name}" in instance "${instanceNode.name}"`,
    );

    // Apply fill bound variables using setBoundVariableForPaint
    // This is the correct Figma API approach: create new Paint objects and bind variables
    try {
      if (!recognizedVariables) {
        debugConsole.warning(
          `[FILL-BOUND] Cannot apply fill bound variables: recognizedVariables is null`,
        );
        continue;
      }

      const fillsBoundVariables = childData.boundVariables.fills;
      if (!Array.isArray(fillsBoundVariables)) {
        continue;
      }

      // Create new fills array with bound variables
      const boundFills: Paint[] = [];
      for (
        let i = 0;
        i < instanceChild.fills.length && i < fillsBoundVariables.length;
        i++
      ) {
        const instanceFill = instanceChild.fills[i];
        const fillBoundVars = fillsBoundVariables[i];

        if (fillBoundVars && typeof fillBoundVars === "object") {
          // Check if this is a direct variable reference (e.g., { _varRef: 55 })
          // In Figma, binding an entire fill typically means binding the color property
          let variable: Variable | null = null;

          if ((fillBoundVars as any)._varRef !== undefined) {
            // Direct variable reference
            const varRef = (fillBoundVars as any)._varRef;
            variable = recognizedVariables.get(String(varRef)) || null;
          } else if ((fillBoundVars as any).color) {
            // Nested color property
            const colorVarInfo = (fillBoundVars as any).color;
            if (colorVarInfo._varRef !== undefined) {
              variable =
                recognizedVariables.get(String(colorVarInfo._varRef)) || null;
            } else if (
              colorVarInfo.type === "VARIABLE_ALIAS" &&
              colorVarInfo.id
            ) {
              variable = await figma.variables.getVariableByIdAsync(
                colorVarInfo.id,
              );
            }
          } else if (
            (fillBoundVars as any).type === "VARIABLE_ALIAS" &&
            (fillBoundVars as any).id
          ) {
            // VARIABLE_ALIAS format
            variable = await figma.variables.getVariableByIdAsync(
              (fillBoundVars as any).id,
            );
          }

          if (variable && instanceFill.type === "SOLID") {
            // Create a new SolidPaint based on the existing fill
            const solidFill = instanceFill as SolidPaint;
            const newSolidPaint: SolidPaint = {
              type: "SOLID",
              visible: solidFill.visible,
              opacity: solidFill.opacity,
              blendMode: solidFill.blendMode,
              color: { ...solidFill.color }, // This will be overridden by the variable
            };

            // Use setBoundVariableForPaint to bind the variable to the color property
            const boundPaint = figma.variables.setBoundVariableForPaint(
              newSolidPaint,
              "color",
              variable,
            ) as SolidPaint;

            boundFills.push(boundPaint);
            debugConsole.log(
              `[FILL-BOUND] ✓ Bound variable "${variable.name}" (${variable.id}) to fill[${i}].color on child "${instanceChild.name}"`,
            );
          } else if (variable) {
            // For non-solid fills or if variable not found, use fill as-is
            // TODO: Handle gradient fills with bound variables on gradient stops
            boundFills.push(instanceFill);
            if (!variable) {
              debugConsole.warning(
                `[FILL-BOUND] Could not resolve variable for fill[${i}] on child "${instanceChild.name}"`,
              );
            } else if (instanceFill.type !== "SOLID") {
              debugConsole.log(
                `[FILL-BOUND] Fill[${i}] on child "${instanceChild.name}" is type "${instanceFill.type}" - variable binding for non-solid fills not yet implemented`,
              );
            }
          } else {
            // No variable to bind, use fill as-is
            boundFills.push(instanceFill);
          }
        } else {
          // No bound variables for this fill, use as-is
          boundFills.push(instanceFill);
        }
      }

      // Assign the new fills array with bound variables
      instanceChild.fills = boundFills;

      debugConsole.log(
        `[FILL-BOUND] ✓ Applied fill bound variables to child "${instanceChild.name}" in instance "${instanceNode.name}" (${boundFills.length} fill(s))`,
      );
    } catch (error) {
      debugConsole.warning(
        `Error applying fill bound variables to instance child "${instanceChild.name}": ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  debugConsole.log(
    `[FILL-BOUND] Finished applying fill bound variables to instance "${instanceNode.name}" children`,
  );
}

/**
 * Updates instance children from JSON data to preserve bound variables and other properties
 * CRITICAL: We can only modify existing children in place - cannot add/replace children in instances
 *
 * This function:
 * - Matches children by name (recursive search) and updates properties (fills, bound variables, etc.)
 * - Warns (not errors) if JSON child doesn't match instance tree - continues processing
 * - Keeps default children that aren't in JSON (don't delete them - they're part of component)
 * - Cannot add children that exist only in JSON (Figma limitation)
 */
async function updateInstanceChildrenFromJson(
  instanceNode: InstanceNode,
  nodeData: any,
): Promise<void> {
  if (
    !nodeData.children ||
    !Array.isArray(nodeData.children) ||
    !instanceNode.children ||
    instanceNode.children.length === 0
  ) {
    return;
  }

  // Helper to recursively find a child by name
  const findChildRecursively = (
    node: SceneNode | ChildrenMixin,
    targetName: string,
  ): SceneNode | null => {
    if ("children" in node && Array.isArray(node.children)) {
      for (const child of node.children) {
        if (child.name === targetName) {
          return child;
        }
        const found = findChildRecursively(child, targetName);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  // Process each child in JSON
  for (const jsonChild of nodeData.children) {
    if (!jsonChild || !jsonChild.name) {
      continue;
    }

    // Find matching child in instance by name (recursive search)
    const matchingInstanceChild = findChildRecursively(
      instanceNode,
      jsonChild.name,
    );

    if (matchingInstanceChild) {
      // Match found - update properties in place
      // Note: We already apply fill bound variables in applyFillBoundVariablesToInstanceChildren
      // This function can be extended to update other properties if needed
      // For now, we rely on applyFillBoundVariablesToInstanceChildren for fills
      // and this function serves as a placeholder for future property updates
    } else {
      // No match - JSON child doesn't exist in instance tree
      // This is expected (instance overrides, Figma limitations) - warn and continue
      debugConsole.warning(
        `Child "${jsonChild.name}" in JSON does not exist in instance "${instanceNode.name}" - skipping (instance override or Figma limitation)`,
      );
    }
  }

  // Check for instance children not in JSON (we keep these - they're part of component)
  const jsonChildNames = new Set(
    (nodeData.children || []).map((c: any) => c?.name).filter(Boolean),
  );
  const instanceChildrenNotInJson = instanceNode.children.filter(
    (child) => !jsonChildNames.has(child.name),
  );

  if (instanceChildrenNotInJson.length > 0) {
    debugConsole.log(
      `Instance "${instanceNode.name}" has ${instanceChildrenNotInJson.length} child(ren) not in JSON - keeping default children: ${instanceChildrenNotInJson.map((c) => c.name).join(", ")}`,
    );
  }
}

/**
 * Resolves deferred normal instances after all pages have been imported
 * This handles circular references by resolving instances once all components are available
 */
export async function resolveDeferredNormalInstances(
  deferredInstances: DeferredNormalInstance[],
  constructionIcon: string = "",
  recognizedVariables: Map<string, Variable> | null = null,
  _variableTable: VariableTable | null = null,
  _collectionTable: CollectionTable | null = null,
  _recognizedCollections: Map<string, VariableCollection> | null = null,
): Promise<{
  resolved: number;
  failed: number;
  errors: string[];
}> {
  // Mark unused parameters as intentionally unused (kept for API consistency)
  void _variableTable;
  void _collectionTable;
  void _recognizedCollections;

  if (deferredInstances.length === 0) {
    return { resolved: 0, failed: 0, errors: [] };
  }

  debugConsole.log(
    `=== Resolving ${deferredInstances.length} deferred normal instance(s) ===`,
  );

  let resolved = 0;
  let failed = 0;
  const errors: string[] = [];

  await figma.loadAllPagesAsync();

  // Sort deferred instances bottom-up (deepest first, shallowest last)
  // This ensures children are resolved before parents, preventing loss of nested placeholders
  const calculateDepth = (
    deferred: DeferredNormalInstance,
    allDeferred: DeferredNormalInstance[],
    visited: Set<string> = new Set(),
  ): number => {
    if (!deferred.parentPlaceholderId) {
      return 0; // Root level
    }

    // Prevent infinite loops
    if (visited.has(deferred.placeholderFrameId)) {
      return 0;
    }
    visited.add(deferred.placeholderFrameId);

    // Find parent deferred instance
    const parentDeferred = allDeferred.find(
      (d) => d.placeholderFrameId === deferred.parentPlaceholderId,
    );

    if (!parentDeferred) {
      return 0; // Parent not found (shouldn't happen, but handle gracefully)
    }

    return 1 + calculateDepth(parentDeferred, allDeferred, visited);
  };

  // Calculate depth for each deferred instance
  const deferredWithDepth = deferredInstances.map((deferred) => ({
    deferred,
    depth: calculateDepth(deferred, deferredInstances),
  }));

  // Sort by depth (deepest first = bottom-up)
  deferredWithDepth.sort((a, b) => b.depth - a.depth);

  debugConsole.log(
    `[BOTTOM-UP] Sorted ${deferredInstances.length} deferred instance(s) by depth (deepest first)`,
  );
  if (deferredWithDepth.length > 0) {
    const maxDepth = Math.max(...deferredWithDepth.map((d) => d.depth));
    debugConsole.log(
      `[BOTTOM-UP] Depth range: 0 (root) to ${maxDepth} (deepest)`,
    );
  }

  // Track which deferred instances have been processed as children to avoid double-processing
  const processedAsChildren = new Set<string>();

  // Pre-mark all child deferred instances (those with parentPlaceholderId) so they don't get processed
  // in the main loop. They will be resolved when their parent is resolved.
  for (const deferred of deferredInstances) {
    if (deferred.parentPlaceholderId) {
      processedAsChildren.add(deferred.placeholderFrameId);
      debugConsole.log(
        `[NESTED] Pre-marked child deferred instance "${deferred.nodeData.name}" (placeholder: ${deferred.placeholderFrameId.substring(0, 8)}..., parent placeholder: ${deferred.parentPlaceholderId.substring(0, 8)}...)`,
      );
    }
  }
  debugConsole.log(
    `[NESTED] Pre-marked ${processedAsChildren.size} child deferred instance(s) to skip in main loop`,
  );

  // Process deferred instances in bottom-up order
  for (const { deferred } of deferredWithDepth) {
    // Skip if this deferred instance was already processed as a child of another deferred instance
    if (processedAsChildren.has(deferred.placeholderFrameId)) {
      debugConsole.log(
        `[NESTED] Skipping child deferred instance "${deferred.nodeData.name}" (placeholder: ${deferred.placeholderFrameId.substring(0, 8)}...) - will be resolved when parent is resolved`,
      );
      continue;
    }

    try {
      const { placeholderFrameId, instanceEntry, nodeData, parentNodeId } =
        deferred;

      // Look up nodes by ID (they were serialized as IDs)
      const placeholderFrame = (await figma.getNodeByIdAsync(
        placeholderFrameId,
      )) as FrameNode | null;
      const parentNode = (await figma.getNodeByIdAsync(
        parentNodeId,
      )) as SceneNode | null;

      if (!placeholderFrame || !parentNode) {
        // Check if this was a child deferred instance that should have been skipped
        const wasChildDeferred = deferred.parentPlaceholderId !== undefined;
        const wasMarked = processedAsChildren.has(placeholderFrameId);
        const error = `Deferred instance "${nodeData.name}" - could not find placeholder frame (${placeholderFrameId.substring(0, 8)}...) or parent node (${parentNodeId.substring(0, 8)}...). Was child deferred: ${wasChildDeferred}, Was marked: ${wasMarked}`;
        debugConsole.error(error);
        if (wasChildDeferred && !wasMarked) {
          debugConsole.error(
            `[NESTED] BUG: Child deferred instance "${nodeData.name}" was not properly marked! parentPlaceholderId: ${deferred.parentPlaceholderId?.substring(0, 8)}...`,
          );
        }
        errors.push(error);
        failed++;
        continue;
      }

      // Find the referenced page
      // PRIMARY STRATEGY: Match by GUID from page metadata (most reliable)
      // This is the correct way to find pages - by their unique identifier, not by name
      let referencedPage: PageNode | null = null;

      if (instanceEntry.componentGuid) {
        debugConsole.log(
          `  Looking for page by GUID: ${instanceEntry.componentGuid.substring(0, 8)}...`,
        );
        for (const page of figma.root.children) {
          if (page.type !== "PAGE") continue;
          try {
            const pageMetadataStr = page.getPluginData(
              "RecursicaPublishedMetadata",
            );
            if (pageMetadataStr) {
              const pageMetadata = JSON.parse(pageMetadataStr);
              if (pageMetadata.id === instanceEntry.componentGuid) {
                referencedPage = page;
                debugConsole.log(`  ✓ Found page "${page.name}" by GUID match`);
                break;
              }
            }
          } catch {
            // Continue searching
          }
        }
      }

      // FALLBACK STRATEGIES: If GUID match failed, try name matching
      // Try multiple matching strategies:
      // 1. Exact name match
      // 2. Name with construction icon prefix
      if (!referencedPage) {
        referencedPage = figma.root.children.find((page) => {
          const exactMatch = page.name === instanceEntry.componentPageName;
          const iconMatch =
            constructionIcon &&
            page.name ===
              `${constructionIcon} ${instanceEntry.componentPageName}`;
          return exactMatch || iconMatch;
        }) as PageNode | null;
      }

      // If exact match failed, try clean name matching
      if (!referencedPage) {
        const cleanTargetName = getComponentCleanName(
          instanceEntry.componentPageName,
        );
        referencedPage = figma.root.children.find((page) => {
          const cleanPageName = getComponentCleanName(page.name);
          return cleanPageName === cleanTargetName;
        });
      }

      // If still not found, try matching against pages with version suffixes removed
      // (e.g., "UI kit components (VERSION: 1)" should match "UI kit components")
      if (!referencedPage) {
        const cleanTargetName = getComponentCleanName(
          instanceEntry.componentPageName,
        );
        // Remove version suffix pattern: " (VERSION: X)" or " (VERSION:X)"
        const targetNameWithoutVersion = cleanTargetName.replace(
          /\s*\(VERSION\s*:\s*\d+\)\s*$/i,
          "",
        );

        referencedPage = figma.root.children.find((page) => {
          const cleanPageName = getComponentCleanName(page.name);
          const pageNameWithoutVersion = cleanPageName.replace(
            /\s*\(VERSION\s*:\s*\d+\)\s*$/i,
            "",
          );
          return pageNameWithoutVersion === targetNameWithoutVersion;
        });
      }

      // If still not found, try case-insensitive matching
      if (!referencedPage) {
        const targetNameLower = instanceEntry.componentPageName
          .toLowerCase()
          .trim();
        referencedPage = figma.root.children.find((page) => {
          const pageNameLower = page.name.toLowerCase().trim();
          return pageNameLower === targetNameLower;
        });
      }

      // If still not found, try case-insensitive clean name matching
      if (!referencedPage) {
        const cleanTargetName = getComponentCleanName(
          instanceEntry.componentPageName,
        ).toLowerCase();
        referencedPage = figma.root.children.find((page) => {
          const cleanPageName = getComponentCleanName(page.name).toLowerCase();
          return cleanPageName === cleanTargetName;
        });
      }

      if (!referencedPage && constructionIcon) {
        // Debug: log available page names to help diagnose
        const allPageNames = figma.root.children
          .filter((p) => p.type === "PAGE")
          .map((p) => p.name);
        debugConsole.log(`Available pages: ${allPageNames.join(", ")}`);
        debugConsole.log(
          `Looking for page: "${instanceEntry.componentPageName}"`,
        );
      }

      if (!referencedPage) {
        const expectedNames = constructionIcon
          ? `"${instanceEntry.componentPageName}" or "${constructionIcon} ${instanceEntry.componentPageName}"`
          : `"${instanceEntry.componentPageName}"`;
        const guidInfo = instanceEntry.componentGuid
          ? ` (GUID: ${instanceEntry.componentGuid.substring(0, 8)}...)`
          : "";
        const error = `Deferred instance "${nodeData.name}" still cannot find referenced page${guidInfo} (tried: GUID matching, ${expectedNames}, clean name matching, version suffix removal, and case-insensitive matching)`;
        debugConsole.error(error);
        errors.push(error);
        failed++;
        continue;
      }

      // Helper function to find component by node ID path (more reliable than name paths)
      const findComponentByNodePath = (
        parent: any,
        nodePath: string[],
        componentName: string,
        componentGuid?: string,
        componentSetName?: string,
      ): ComponentNode | null => {
        if (nodePath.length === 0) {
          // At the end of the path - find the component by name/GUID
          let nameMatch: ComponentNode | null = null;
          const cleanTargetName = getComponentCleanName(componentName);

          for (const child of parent.children || []) {
            if (child.type === "COMPONENT") {
              const exactMatch = child.name === componentName;
              const cleanMatch =
                getComponentCleanName(child.name) === cleanTargetName;

              if (exactMatch || cleanMatch) {
                if (!nameMatch) {
                  nameMatch = child;
                }
                // Prefer exact match, especially with GUID
                if (exactMatch && componentGuid) {
                  try {
                    const metadataStr = child.getPluginData(
                      "RecursicaPublishedMetadata",
                    );
                    if (metadataStr) {
                      const metadata = JSON.parse(metadataStr);
                      if (metadata.id === componentGuid) {
                        return child;
                      }
                    }
                  } catch {
                    // Continue searching
                  }
                } else if (exactMatch) {
                  return child;
                }
              }
            }
          }

          // Return best match found
          if (nameMatch && componentGuid) {
            return nameMatch;
          }
          return nameMatch;
        }

        const [firstNodeId, ...remainingNodePath] = nodePath;

        // Find child with matching node ID
        for (const child of parent.children || []) {
          if (child.id === firstNodeId) {
            // Found the correct child, continue with remaining path
            return findComponentByNodePath(
              child,
              remainingNodePath,
              componentName,
              componentGuid,
              componentSetName,
            );
          }
        }

        // Node with specified ID not found
        return null;
      };

      // Helper function to find component by path, component set name, and component name
      const findComponentByPath = (
        parent: any,
        path: string[],
        componentName: string,
        componentGuid?: string,
        componentSetName?: string,
        nodePath?: string[],
      ): ComponentNode | null => {
        // If we have nodePath (ID-based), use it for precise navigation
        if (nodePath && nodePath.length > 0) {
          return findComponentByNodePath(
            parent,
            nodePath,
            componentName,
            componentGuid,
            componentSetName,
          );
        }

        if (path.length === 0) {
          let nameMatch: ComponentNode | null = null;
          const cleanTargetName = getComponentCleanName(componentName);

          for (const child of parent.children || []) {
            if (child.type === "COMPONENT") {
              const exactMatch = child.name === componentName;
              const cleanMatch =
                getComponentCleanName(child.name) === cleanTargetName;

              if (exactMatch || cleanMatch) {
                if (!nameMatch) {
                  nameMatch = child;
                }
                // Prefer exact match if available
                if (exactMatch && componentGuid) {
                  try {
                    const metadataStr = child.getPluginData(
                      "RecursicaPublishedMetadata",
                    );
                    if (metadataStr) {
                      const metadata = JSON.parse(metadataStr);
                      if (metadata.id === componentGuid) {
                        return child;
                      }
                    }
                  } catch {
                    // Continue searching
                  }
                } else if (exactMatch) {
                  return child;
                }
              }
            } else if (child.type === "COMPONENT_SET") {
              // Only search in this component set if componentSetName matches (if provided)
              // Try both exact and clean name matching for component set name
              if (componentSetName) {
                const setExactMatch = child.name === componentSetName;
                const setCleanMatch =
                  getComponentCleanName(child.name) ===
                  getComponentCleanName(componentSetName);
                if (!setExactMatch && !setCleanMatch) {
                  continue; // Skip this component set if name doesn't match
                }
              }

              for (const variant of child.children || []) {
                if (variant.type === "COMPONENT") {
                  const exactMatch = variant.name === componentName;
                  const cleanMatch =
                    getComponentCleanName(variant.name) === cleanTargetName;

                  if (exactMatch || cleanMatch) {
                    if (!nameMatch) {
                      nameMatch = variant;
                    }
                    // Prefer exact match if available
                    if (exactMatch && componentGuid) {
                      try {
                        const metadataStr = variant.getPluginData(
                          "RecursicaPublishedMetadata",
                        );
                        if (metadataStr) {
                          const metadata = JSON.parse(metadataStr);
                          if (metadata.id === componentGuid) {
                            return variant;
                          }
                        }
                      } catch {
                        // Continue searching
                      }
                    } else if (exactMatch) {
                      // If componentSetName was provided and matched, return immediately
                      if (componentSetName) {
                        return variant;
                      }
                      return variant;
                    }
                  }
                }
              }
            }
          }

          if (nameMatch && componentGuid) {
            return nameMatch;
          }
          return nameMatch;
        }

        const [firstSegment, ...remainingPath] = path;
        const cleanFirstSegment = getComponentCleanName(firstSegment);
        for (const child of parent.children || []) {
          const exactMatch = child.name === firstSegment;
          const cleanMatch =
            getComponentCleanName(child.name) === cleanFirstSegment;

          if (exactMatch || cleanMatch) {
            // If we've reached the end of the path and this is a COMPONENT_SET,
            // search for the component inside it
            if (remainingPath.length === 0) {
              // Debug: log what we found
              // Note: Can't use await here since this function isn't async, but we'll log via the caller
              if (child.type === "COMPONENT_SET") {
                // Verify component set name matches if provided (try both exact and clean)
                if (componentSetName) {
                  const setExactMatch = child.name === componentSetName;
                  const setCleanMatch =
                    getComponentCleanName(child.name) ===
                    getComponentCleanName(componentSetName);
                  if (!setExactMatch && !setCleanMatch) {
                    continue; // Skip this component set if name doesn't match
                  }
                }

                // Search for the component variant in this COMPONENT_SET
                const cleanTargetName = getComponentCleanName(componentName);
                let nameMatch: ComponentNode | null = null; // Store first name match as fallback
                for (const variant of child.children || []) {
                  if (variant.type === "COMPONENT") {
                    const variantExactMatch = variant.name === componentName;
                    const variantCleanMatch =
                      getComponentCleanName(variant.name) === cleanTargetName;

                    if (variantExactMatch || variantCleanMatch) {
                      // Store as name match (fallback if GUID check fails)
                      if (!nameMatch) {
                        nameMatch = variant;
                      }
                      // Found the variant - check GUID if provided
                      if (componentGuid) {
                        try {
                          const metadataStr = variant.getPluginData(
                            "RecursicaPublishedMetadata",
                          );
                          if (metadataStr) {
                            const metadata = JSON.parse(metadataStr);
                            if (metadata.id === componentGuid) {
                              return variant;
                            }
                          }
                        } catch {
                          // Continue searching
                        }
                      }
                      // Return variant (GUID check passed or no GUID provided)
                      // Prefer exact match
                      if (variantExactMatch) {
                        return variant;
                      }
                    }
                  }
                }
                // Return name match if found (clean match fallback)
                if (nameMatch) {
                  return nameMatch;
                }
                // Component not found in COMPONENT_SET
                return null;
              }
              // If we're at the end of the path but it's not a COMPONENT_SET, this is an error
              // (we expected to find a COMPONENT_SET to search within)
              return null;
            }
            // Continue searching recursively if there are more path segments
            if (remainingPath.length > 0) {
              return findComponentByPath(
                child,
                remainingPath,
                componentName,
                componentGuid,
                componentSetName,
              );
            }
            // If we matched the path segment but have no remaining path and it's not a COMPONENT_SET,
            // we can't proceed (should have been handled above)
            return null;
          }
        }
        return null;
      };

      let targetComponent = findComponentByPath(
        referencedPage,
        instanceEntry.path || [],
        instanceEntry.componentName,
        instanceEntry.componentGuid,
        instanceEntry.componentSetName,
        instanceEntry.nodePath,
      );

      // If path-based search failed, try searching recursively through all FRAMEs
      // This handles cases where the path doesn't match the actual structure
      // (e.g., component is inside an "Icons" FRAME but path doesn't include it)
      if (!targetComponent) {
        debugConsole.log(
          `  Path-based search failed, trying recursive search for component "${instanceEntry.componentName}"`,
        );
        const recursiveSearch = (
          node: any,
          depth = 0,
          ignoreComponentSetName = false,
        ): ComponentNode | null => {
          if (depth > 5) return null; // Limit depth
          for (const child of node.children || []) {
            // Search for standalone COMPONENT nodes
            if (child.type === "COMPONENT") {
              const exactMatch = child.name === instanceEntry.componentName;
              const cleanMatch =
                getComponentCleanName(child.name) ===
                getComponentCleanName(instanceEntry.componentName);
              if (exactMatch || cleanMatch) {
                // Check GUID if provided
                if (instanceEntry.componentGuid) {
                  try {
                    const metadataStr = child.getPluginData(
                      "RecursicaPublishedMetadata",
                    );
                    if (metadataStr) {
                      const metadata = JSON.parse(metadataStr);
                      if (metadata.id === instanceEntry.componentGuid) {
                        debugConsole.log(
                          `  ✓ Found component "${child.name}" via recursive search (GUID match)`,
                        );
                        return child;
                      }
                    }
                  } catch {
                    // Continue
                  }
                }
                // Return component (prefer exact match)
                debugConsole.log(
                  `  ✓ Found component "${child.name}" via recursive search (name match)`,
                );
                if (exactMatch) {
                  return child;
                }
                // Return clean match as fallback
                return child;
              }
            }
            // Search for COMPONENT_SET nodes (variants)
            // ALWAYS search all COMPONENT_SET nodes for variants, even if componentSetName is not set
            // This handles cases where component name matches a variant name but componentSetName wasn't provided
            if (child.type === "COMPONENT_SET") {
              // If componentSetName is provided and we're not ignoring it, only search in matching sets
              let shouldSearchSet = true;
              if (!ignoreComponentSetName && instanceEntry.componentSetName) {
                const setExactMatch =
                  child.name === instanceEntry.componentSetName;
                const setCleanMatch =
                  getComponentCleanName(child.name) ===
                  getComponentCleanName(instanceEntry.componentSetName || "");
                shouldSearchSet = setExactMatch || setCleanMatch;
                if (!shouldSearchSet) {
                  debugConsole.log(
                    `  [RECURSIVE] Skipping COMPONENT_SET "${child.name}" (doesn't match componentSetName "${instanceEntry.componentSetName}")`,
                  );
                }
              }

              if (shouldSearchSet) {
                debugConsole.log(
                  `  [RECURSIVE] Searching COMPONENT_SET "${child.name}" for variant "${instanceEntry.componentName}"${ignoreComponentSetName ? " (ignoring componentSetName)" : ""}`,
                );
                // Found a matching component set (or searching all sets), now search for the variant
                const cleanTargetName = getComponentCleanName(
                  instanceEntry.componentName,
                );
                for (const variant of child.children || []) {
                  if (variant.type === "COMPONENT") {
                    const variantExactMatch =
                      variant.name === instanceEntry.componentName;
                    const variantCleanMatch =
                      getComponentCleanName(variant.name) === cleanTargetName;
                    debugConsole.log(
                      `  [RECURSIVE] Checking variant "${variant.name}" (exact: ${variantExactMatch}, clean: ${variantCleanMatch})`,
                    );
                    if (variantExactMatch || variantCleanMatch) {
                      // Check GUID if provided
                      if (instanceEntry.componentGuid) {
                        try {
                          const metadataStr = variant.getPluginData(
                            "RecursicaPublishedMetadata",
                          );
                          if (metadataStr) {
                            const metadata = JSON.parse(metadataStr);
                            if (metadata.id === instanceEntry.componentGuid) {
                              debugConsole.log(
                                `  ✓ Found variant "${variant.name}" in COMPONENT_SET "${child.name}" via recursive search (GUID match)`,
                              );
                              return variant;
                            }
                          }
                        } catch {
                          // Continue
                        }
                      }
                      // Return variant (prefer exact match)
                      debugConsole.log(
                        `  ✓ Found variant "${variant.name}" in COMPONENT_SET "${child.name}" via recursive search (name match)`,
                      );
                      if (variantExactMatch) {
                        return variant;
                      }
                      // Return clean match as fallback
                      return variant;
                    }
                  }
                }
              }
            }
            // Recurse into FRAMEs and GROUPs (COMPONENT_SET nodes only contain variants, no nested structures)
            if (child.type === "FRAME" || child.type === "GROUP") {
              const found = recursiveSearch(
                child,
                depth + 1,
                ignoreComponentSetName,
              );
              if (found) return found;
            }
          }
          return null;
        };
        // First pass: try with componentSetName filtering (if provided)
        targetComponent = recursiveSearch(referencedPage, 0, false);
        // Second pass: if first pass failed and componentSetName was provided, try again ignoring it
        // This handles cases where componentSetName is incorrectly set (e.g., to a path segment)
        if (!targetComponent && instanceEntry.componentSetName) {
          debugConsole.log(
            `  First recursive search pass failed, trying again while ignoring componentSetName "${instanceEntry.componentSetName}"`,
          );
          targetComponent = recursiveSearch(referencedPage, 0, true);
        }
        if (!targetComponent) {
          debugConsole.log(
            `  ✗ Recursive search also failed to find component "${instanceEntry.componentName}"`,
          );
        }
      }

      if (!targetComponent) {
        const pathDisplay =
          instanceEntry.path && instanceEntry.path.length > 0
            ? ` at path [${instanceEntry.path.join(" → ")}]`
            : " at page root";
        // Debug: log available components on the page
        const availableComponents: string[] = [];
        const collectComponentNames = (node: any, depth = 0): void => {
          if (depth > 3) return; // Limit depth to avoid too much output
          if (node.type === "COMPONENT" || node.type === "COMPONENT_SET") {
            availableComponents.push(
              `${node.type}: "${node.name}"${node.type === "COMPONENT_SET" ? ` (${node.children.length} variants)` : ""}`,
            );
          }
          if (node.children && Array.isArray(node.children)) {
            for (const child of node.children.slice(0, 10)) {
              collectComponentNames(child, depth + 1);
            }
          }
        };
        collectComponentNames(referencedPage);
        const error = `Deferred instance "${nodeData.name}" still cannot find component "${instanceEntry.componentName}" on page "${instanceEntry.componentPageName}"${pathDisplay}`;
        debugConsole.error(error);
        errors.push(error);
        failed++;
        continue;
      }

      // Create the actual instance
      const instanceNode = targetComponent.createInstance();
      instanceNode.name =
        nodeData.name ||
        placeholderFrame.name.replace("[Deferred: ", "").replace("]", "");

      // Copy plugin data from component children to instance children for proper ID matching
      // This ensures deferred child resolution can match by original IDs
      if ("children" in targetComponent && "children" in instanceNode) {
        const componentChildren = targetComponent.children;
        const instanceChildren = instanceNode.children;

        // Copy plugin data by position (component children should correspond to instance children)
        const maxChildren = Math.min(
          componentChildren.length,
          instanceChildren.length,
        );
        for (let i = 0; i < maxChildren; i++) {
          const componentChild = componentChildren[i];
          const instanceChild = instanceChildren[i];

          // Copy the original node ID from component child to instance child
          const originalId = componentChild.getPluginData(ORIGINAL_NODE_ID_KEY);
          if (originalId) {
            instanceChild.setPluginData(ORIGINAL_NODE_ID_KEY, originalId);
            console.log(
              `[IMPORT] Set ORIGINAL_NODE_ID_KEY on instance child "${instanceChild.name}": "${originalId}" (from component "${targetComponent.name}")`,
            );
            debugConsole.log(
              `  [DEBUG] Copied plugin data from component child "${componentChild.name}" to instance child "${instanceChild.name}": "${originalId}"`,
            );
          }
        }
      }

      // Copy position and size from placeholder
      instanceNode.x = placeholderFrame.x;
      instanceNode.y = placeholderFrame.y;
      if (
        placeholderFrame.width !== undefined &&
        placeholderFrame.height !== undefined
      ) {
        instanceNode.resize(placeholderFrame.width, placeholderFrame.height);
      }

      // Set variant properties if they exist
      if (
        instanceEntry.variantProperties &&
        Object.keys(instanceEntry.variantProperties).length > 0
      ) {
        try {
          const mainComponent = await instanceNode.getMainComponentAsync();
          if (mainComponent) {
            // If the main component is a variant (inside a COMPONENT_SET),
            // get property definitions from the parent COMPONENT_SET instead
            // Variant components don't have componentPropertyDefinitions - only COMPONENT_SETs do
            let componentProperties: ComponentPropertyDefinitions | null = null;
            const mainComponentType = (mainComponent as any).type;
            if (mainComponentType === "COMPONENT_SET") {
              // Instance was created from a COMPONENT_SET directly
              const componentSet = mainComponent as unknown as ComponentSetNode;
              componentProperties = componentSet.componentPropertyDefinitions;
            } else if (
              mainComponentType === "COMPONENT" &&
              mainComponent.parent &&
              mainComponent.parent.type === "COMPONENT_SET"
            ) {
              // Instance was created from a variant component - get properties from parent COMPONENT_SET
              componentProperties =
                mainComponent.parent.componentPropertyDefinitions;
            } else {
              // Instance was created from a non-variant component - no variant properties to set
              debugConsole.warning(
                `Cannot set variant properties for resolved instance "${nodeData.name}" - main component is not a COMPONENT_SET or variant`,
              );
            }

            if (componentProperties) {
              const validProperties: Record<string, string> = {};

              for (const [propName, propValue] of Object.entries(
                instanceEntry.variantProperties,
              )) {
                const cleanPropName = propName.split("#")[0];
                if (componentProperties[cleanPropName]) {
                  validProperties[cleanPropName] = propValue as string;
                }
              }

              if (Object.keys(validProperties).length > 0) {
                instanceNode.setProperties(validProperties);
              }
            }
          }
        } catch (error) {
          debugConsole.warning(
            `Failed to set variant properties for resolved instance "${nodeData.name}": ${error}`,
          );
        }
      }

      // Set component properties if they exist
      if (
        instanceEntry.componentProperties &&
        Object.keys(instanceEntry.componentProperties).length > 0
      ) {
        try {
          const mainComponent = await instanceNode.getMainComponentAsync();
          if (mainComponent) {
            // Variant components don't have componentPropertyDefinitions - only COMPONENT_SETs and non-variant components do
            let componentProperties: ComponentPropertyDefinitions | null = null;
            const mainComponentType = (mainComponent as any).type;
            if (mainComponentType === "COMPONENT_SET") {
              const componentSet = mainComponent as unknown as ComponentSetNode;
              componentProperties = componentSet.componentPropertyDefinitions;
            } else if (
              mainComponentType === "COMPONENT" &&
              mainComponent.parent &&
              mainComponent.parent.type === "COMPONENT_SET"
            ) {
              // Instance was created from a variant - get properties from parent COMPONENT_SET
              componentProperties =
                mainComponent.parent.componentPropertyDefinitions;
            } else if (mainComponentType === "COMPONENT") {
              // Non-variant component - can access componentPropertyDefinitions directly
              componentProperties = mainComponent.componentPropertyDefinitions;
            }

            if (componentProperties) {
              // Check if this is the ".UI kit / Page header" instance we're debugging
              const isPageHeader =
                nodeData.name === ".UI kit / Page header" ||
                instanceEntry.componentName === ".UI kit / Page header";
              if (isPageHeader) {
                debugConsole.log(
                  `[DEBUG .UI kit / Page header] === RESOLVING DEFERRED INSTANCE ===`,
                );
                debugConsole.log(
                  `[DEBUG .UI kit / Page header] Instance name: "${nodeData.name}"`,
                );
                debugConsole.log(
                  `[DEBUG .UI kit / Page header] Component name: "${instanceEntry.componentName}"`,
                );
                debugConsole.log(
                  `[DEBUG .UI kit / Page header] Instance entry componentProperties (full): ${JSON.stringify(instanceEntry.componentProperties, null, 2)}`,
                );
                debugConsole.log(
                  `[DEBUG .UI kit / Page header] Main component: ${mainComponent.name} (type: ${mainComponentType})`,
                );
                debugConsole.log(
                  `[DEBUG .UI kit / Page header] Component property definitions (full): ${JSON.stringify(componentProperties, null, 2)}`,
                );
              }
              debugConsole.log(
                `[IMPORT] Deferred instance "${nodeData.name}" -> Processing ${Object.keys(instanceEntry.componentProperties || {}).length} component property/properties from entry`,
              );
              debugConsole.log(
                `[IMPORT]   Properties in entry: ${JSON.stringify(Object.keys(instanceEntry.componentProperties || {}))}`,
              );
              debugConsole.log(
                `[IMPORT]   Available properties on component: ${JSON.stringify(Object.keys(componentProperties))}`,
              );
              const propertiesToSet: Record<string, any> = {};
              for (const [propName, propValue] of Object.entries(
                instanceEntry.componentProperties,
              )) {
                debugConsole.log(
                  `[IMPORT]   Processing entry property "${propName}" with value: ${JSON.stringify(propValue)}`,
                );
                // Property names in JSON may include IDs - extract clean name
                const cleanPropName = propName.split("#")[0];
                debugConsole.log(
                  `[IMPORT]     Clean property name: "${cleanPropName}"`,
                );

                // Check if property exists - Figma may return property keys with or without ID suffixes
                // Try exact match first, then try matching by base name
                let matchingPropKey: string | undefined = undefined;
                if (componentProperties[propName]) {
                  // Exact match (with ID suffix)
                  matchingPropKey = propName;
                  debugConsole.log(
                    `[IMPORT]     ✓ Exact match found: "${propName}"`,
                  );
                } else if (componentProperties[cleanPropName]) {
                  // Match by clean name (without ID suffix)
                  matchingPropKey = cleanPropName;
                  debugConsole.log(
                    `[IMPORT]     ✓ Clean name match found: "${cleanPropName}"`,
                  );
                } else {
                  // Try to find a property that starts with the clean name (in case ID format differs)
                  matchingPropKey = Object.keys(componentProperties).find(
                    (key) => key.split("#")[0] === cleanPropName,
                  );
                  if (matchingPropKey) {
                    debugConsole.log(
                      `[IMPORT]     ✓ Base name match found: "${matchingPropKey}" (from "${cleanPropName}")`,
                    );
                  } else {
                    debugConsole.warning(
                      `[IMPORT]     ✗ No match found for "${propName}" (clean: "${cleanPropName}")`,
                    );
                  }
                }

                if (matchingPropKey) {
                  // Extract the actual value from the property object
                  // Component properties from getProperties() might be stored as primitive values
                  // or as objects with 'value' and other keys
                  const actualValue =
                    propValue !== null &&
                    propValue !== undefined &&
                    typeof propValue === "object" &&
                    "value" in propValue
                      ? (propValue as any).value
                      : propValue;
                  debugConsole.log(
                    `[IMPORT]     Extracted value: ${JSON.stringify(actualValue)} (from ${propValue !== null && propValue !== undefined && typeof propValue === "object" && "value" in propValue ? "object.value" : "direct"})`,
                  );
                  // Use the matching property key (which may have ID suffix) for setProperties
                  // Figma API requires the exact property key as it exists on the component
                  propertiesToSet[matchingPropKey] = actualValue;
                  debugConsole.log(
                    `[IMPORT]     Added to propertiesToSet: "${matchingPropKey}" = ${JSON.stringify(actualValue)}`,
                  );
                } else {
                  debugConsole.warning(
                    `[IMPORT]     Component property "${cleanPropName}" (from "${propName}") does not exist on component "${instanceEntry.componentName}" for resolved deferred instance "${nodeData.name}". Available properties: ${Object.keys(componentProperties).join(", ") || "none"}`,
                  );
                }
              }

              // Set all properties at once
              // IMPORTANT: Set properties BEFORE updating children to ensure TEXT properties
              // are properly bound to text nodes when children are updated
              if (Object.keys(propertiesToSet).length > 0) {
                if (isPageHeader) {
                  debugConsole.log(
                    `[DEBUG .UI kit / Page header] === ABOUT TO SET PROPERTIES ===`,
                  );
                  debugConsole.log(
                    `[DEBUG .UI kit / Page header] Instance node ID: ${instanceNode.id}`,
                  );
                  debugConsole.log(
                    `[DEBUG .UI kit / Page header] Instance node name: "${instanceNode.name}"`,
                  );
                  debugConsole.log(
                    `[DEBUG .UI kit / Page header] Properties to set (full): ${JSON.stringify(propertiesToSet, null, 2)}`,
                  );
                  debugConsole.log(
                    `[DEBUG .UI kit / Page header] Instance node type: ${instanceNode.type}`,
                  );
                  // Don't access mainComponent directly in dynamic-page context - use getMainComponentAsync instead
                  try {
                    const mainComp = await instanceNode.getMainComponentAsync();
                    debugConsole.log(
                      `[DEBUG .UI kit / Page header] Main component: ${mainComp?.name || "null"}`,
                    );
                  } catch {
                    debugConsole.log(
                      `[DEBUG .UI kit / Page header] Main component: (could not access)`,
                    );
                  }
                }
                debugConsole.log(
                  `[IMPORT]   Ready to set ${Object.keys(propertiesToSet).length} property/properties: ${JSON.stringify(Object.keys(propertiesToSet))}`,
                );
                debugConsole.log(
                  `[IMPORT]   Properties to set (with values): ${JSON.stringify(propertiesToSet)}`,
                );
                try {
                  // Set properties first, before updating children
                  // This ensures TEXT properties are available when text nodes are processed
                  if (isPageHeader) {
                    debugConsole.log(
                      `[DEBUG .UI kit / Page header] Calling instanceNode.setProperties()...`,
                    );
                  }
                  instanceNode.setProperties(propertiesToSet);
                  if (isPageHeader) {
                    debugConsole.log(
                      `[DEBUG .UI kit / Page header] ✓ setProperties() call completed`,
                    );
                  }
                  debugConsole.log(
                    `[IMPORT]   ✓ Successfully set component properties for resolved deferred instance "${nodeData.name}": ${Object.keys(propertiesToSet).join(", ")}`,
                  );
                  // Verify properties were actually set by reading them back
                  try {
                    if (isPageHeader) {
                      debugConsole.log(
                        `[DEBUG .UI kit / Page header] === VERIFYING PROPERTIES AFTER SET ===`,
                      );
                    }
                    if (
                      typeof (instanceNode as any).getProperties === "function"
                    ) {
                      if (isPageHeader) {
                        debugConsole.log(
                          `[DEBUG .UI kit / Page header] Using getProperties() to verify...`,
                        );
                      }
                      const verifyProps = await (
                        instanceNode as any
                      ).getProperties();
                      if (isPageHeader) {
                        debugConsole.log(
                          `[DEBUG .UI kit / Page header] getProperties() returned: ${JSON.stringify(verifyProps, null, 2)}`,
                        );
                      }
                      if (verifyProps && verifyProps.componentProperties) {
                        const verifiedValues: Record<string, any> = {};
                        for (const [key, value] of Object.entries(
                          propertiesToSet,
                        )) {
                          const verifyValue =
                            verifyProps.componentProperties[key];
                          verifiedValues[key] = verifyValue;
                          if (isPageHeader) {
                            debugConsole.log(
                              `[DEBUG .UI kit / Page header] Property "${key}": expected ${JSON.stringify(value)}, got ${JSON.stringify(verifyValue)}`,
                            );
                          }
                          if (
                            JSON.stringify(verifyValue) !==
                            JSON.stringify(value)
                          ) {
                            debugConsole.warning(
                              `[IMPORT]   ⚠ Property "${key}" verification mismatch: expected ${JSON.stringify(value)}, got ${JSON.stringify(verifyValue)}`,
                            );
                            if (isPageHeader) {
                              debugConsole.warning(
                                `[DEBUG .UI kit / Page header] ⚠ MISMATCH for "${key}"`,
                              );
                            }
                          } else {
                            debugConsole.log(
                              `[IMPORT]   ✓ Verified property "${key}" = ${JSON.stringify(verifyValue)}`,
                            );
                            if (isPageHeader) {
                              debugConsole.log(
                                `[DEBUG .UI kit / Page header] ✓ MATCH for "${key}"`,
                              );
                            }
                          }
                        }
                        debugConsole.log(
                          `[IMPORT]   Verification complete. All properties: ${JSON.stringify(verifiedValues)}`,
                        );
                        if (isPageHeader) {
                          debugConsole.log(
                            `[DEBUG .UI kit / Page header] All verified properties: ${JSON.stringify(verifiedValues, null, 2)}`,
                          );
                        }
                      }
                    } else {
                      // Fallback: try direct access to componentProperties
                      if (isPageHeader) {
                        debugConsole.log(
                          `[DEBUG .UI kit / Page header] Using direct componentProperties access to verify...`,
                        );
                      }
                      const directProps = (instanceNode as any)
                        .componentProperties;
                      if (isPageHeader) {
                        debugConsole.log(
                          `[DEBUG .UI kit / Page header] Direct componentProperties: ${JSON.stringify(directProps, null, 2)}`,
                        );
                      }
                      if (directProps) {
                        const verifiedValues: Record<string, any> = {};
                        for (const [key, expectedValue] of Object.entries(
                          propertiesToSet,
                        )) {
                          const actualProperty = directProps[key];
                          // Extract the actual value from the property object
                          // componentProperties returns objects like {type: "TEXT", value: "Logo"}
                          // but we set just the value, so we need to compare actualProperty.value with expectedValue
                          const actualValue =
                            actualProperty &&
                            typeof actualProperty === "object" &&
                            "value" in actualProperty
                              ? actualProperty.value
                              : actualProperty;
                          verifiedValues[key] = actualValue;
                          if (isPageHeader) {
                            debugConsole.log(
                              `[DEBUG .UI kit / Page header] Property "${key}": expected ${JSON.stringify(expectedValue)}, actualProperty=${JSON.stringify(actualProperty)}, actualValue=${JSON.stringify(actualValue)}`,
                            );
                          }
                          if (actualProperty === undefined) {
                            debugConsole.warning(
                              `[IMPORT]   ⚠ Property "${key}" not found in componentProperties after setting`,
                            );
                            if (isPageHeader) {
                              debugConsole.warning(
                                `[DEBUG .UI kit / Page header] ⚠ Property "${key}" NOT FOUND in componentProperties`,
                              );
                            }
                          } else if (
                            JSON.stringify(actualValue) !==
                            JSON.stringify(expectedValue)
                          ) {
                            debugConsole.warning(
                              `[IMPORT]   ⚠ Property "${key}" verification mismatch: expected ${JSON.stringify(expectedValue)}, got ${JSON.stringify(actualValue)} (from property object: ${JSON.stringify(actualProperty)})`,
                            );
                            if (isPageHeader) {
                              debugConsole.warning(
                                `[DEBUG .UI kit / Page header] ⚠ MISMATCH for "${key}"`,
                              );
                            }
                          } else {
                            debugConsole.log(
                              `[IMPORT]   ✓ Verified property "${key}" = ${JSON.stringify(actualValue)}`,
                            );
                            if (isPageHeader) {
                              debugConsole.log(
                                `[DEBUG .UI kit / Page header] ✓ MATCH for "${key}"`,
                              );
                            }
                          }
                        }
                        debugConsole.log(
                          `[IMPORT]   Verification complete. All properties: ${JSON.stringify(verifiedValues)}`,
                        );
                        if (isPageHeader) {
                          debugConsole.log(
                            `[DEBUG .UI kit / Page header] All verified properties: ${JSON.stringify(verifiedValues, null, 2)}`,
                          );
                        }
                      } else {
                        debugConsole.warning(
                          `[IMPORT]   Could not access componentProperties for verification`,
                        );
                        if (isPageHeader) {
                          debugConsole.warning(
                            `[DEBUG .UI kit / Page header] ⚠ Could not access componentProperties`,
                          );
                        }
                      }
                    }
                  } catch (verifyError) {
                    debugConsole.warning(
                      `[IMPORT]   Could not verify properties after setting: ${verifyError}`,
                    );
                  }
                } catch (error) {
                  debugConsole.error(
                    `[IMPORT]   ✗ Failed to set component properties for resolved deferred instance "${nodeData.name}": ${error}`,
                  );
                  debugConsole.error(
                    `[IMPORT]     Properties attempted: ${JSON.stringify(propertiesToSet)}`,
                  );
                  debugConsole.error(
                    `[IMPORT]     Available properties: ${JSON.stringify(Object.keys(componentProperties))}`,
                  );
                }
              } else {
                debugConsole.warning(
                  `[IMPORT]   No properties to set for deferred instance "${nodeData.name}" (all properties failed to match)`,
                );
              }

              // Apply fill bound variables to instance children
              await applyFillBoundVariablesToInstanceChildren(
                instanceNode,
                nodeData,
                recognizedVariables,
              );

              // Update children from JSON to preserve bound variables and other properties
              // This handles mismatches between JSON tree and instance tree with warnings (not errors)
              await updateInstanceChildrenFromJson(instanceNode, nodeData);

              // For TEXT component properties, verify that the bound text nodes reflect the property values
              // Figma automatically binds TEXT properties to text nodes, but we should verify
              if (Object.keys(propertiesToSet).length > 0) {
                try {
                  // Use getMainComponentAsync() instead of direct access to avoid dynamic-page errors
                  const mainComponent =
                    await instanceNode.getMainComponentAsync();
                  if (mainComponent) {
                    // Variant components don't have componentPropertyDefinitions - only COMPONENT_SETs and non-variant components do
                    let componentProps: ComponentPropertyDefinitions | null =
                      null;
                    const mainComponentType = (mainComponent as any).type;
                    if (mainComponentType === "COMPONENT_SET") {
                      const componentSet =
                        mainComponent as unknown as ComponentSetNode;
                      componentProps =
                        componentSet.componentPropertyDefinitions;
                    } else if (
                      mainComponentType === "COMPONENT" &&
                      mainComponent.parent &&
                      mainComponent.parent.type === "COMPONENT_SET"
                    ) {
                      // Instance was created from a variant - get properties from parent COMPONENT_SET
                      componentProps =
                        mainComponent.parent.componentPropertyDefinitions;
                    } else if (mainComponentType === "COMPONENT") {
                      // Non-variant component - can access componentPropertyDefinitions directly
                      componentProps =
                        mainComponent.componentPropertyDefinitions;
                    }

                    if (componentProps) {
                      for (const propKey of Object.keys(propertiesToSet)) {
                        const propDef = componentProps[propKey];
                        if (propDef && propDef.type === "TEXT") {
                          // Find text nodes that might be bound to this property
                          // TEXT properties are typically bound to text nodes with matching content
                          const findTextNodes = (
                            node: SceneNode,
                          ): TextNode[] => {
                            const results: TextNode[] = [];
                            if (node.type === "TEXT") {
                              results.push(node);
                            }
                            if ("children" in node) {
                              for (const child of node.children) {
                                results.push(...findTextNodes(child));
                              }
                            }
                            return results;
                          };
                          const textNodes = findTextNodes(instanceNode);
                          const propValue = propertiesToSet[propKey];
                          debugConsole.log(
                            `[IMPORT]   Found ${textNodes.length} text node(s) in instance "${instanceNode.name}" for TEXT property "${propKey}" = ${JSON.stringify(propValue)}`,
                          );
                          // Note: Text nodes should be bound to component properties via componentPropertyReferences
                          // This binding is restored when the component is created, not when properties are set on instances
                        }
                      }
                    }
                  }
                } catch (textCheckError) {
                  debugConsole.warning(
                    `[IMPORT]   Could not check text node bindings: ${textCheckError}`,
                  );
                }
              }

              // Final verification: Re-check component properties after all updates to ensure they persisted
              if (Object.keys(propertiesToSet).length > 0) {
                if (isPageHeader) {
                  debugConsole.log(
                    `[DEBUG .UI kit / Page header] === FINAL VERIFICATION (after all updates) ===`,
                  );
                }
                try {
                  // Use getProperties() for more reliable reading
                  let finalProps: any = null;
                  if (
                    typeof (instanceNode as any).getProperties === "function"
                  ) {
                    if (isPageHeader) {
                      debugConsole.log(
                        `[DEBUG .UI kit / Page header] Using getProperties() for final verification...`,
                      );
                    }
                    const propsResult = await (
                      instanceNode as any
                    ).getProperties();
                    if (propsResult && propsResult.componentProperties) {
                      finalProps = propsResult.componentProperties;
                      if (isPageHeader) {
                        debugConsole.log(
                          `[DEBUG .UI kit / Page header] Final componentProperties from getProperties(): ${JSON.stringify(finalProps, null, 2)}`,
                        );
                      }
                    }
                  }
                  // Fallback to direct access
                  if (!finalProps) {
                    if (isPageHeader) {
                      debugConsole.log(
                        `[DEBUG .UI kit / Page header] Using direct componentProperties access for final verification...`,
                      );
                    }
                    finalProps = (instanceNode as any).componentProperties;
                    if (isPageHeader) {
                      debugConsole.log(
                        `[DEBUG .UI kit / Page header] Final componentProperties (direct): ${JSON.stringify(finalProps, null, 2)}`,
                      );
                    }
                  }

                  if (finalProps) {
                    const finalValues: Record<string, any> = {};
                    for (const [key, expectedValue] of Object.entries(
                      propertiesToSet,
                    )) {
                      const finalProperty = finalProps[key];
                      const finalValue =
                        finalProperty &&
                        typeof finalProperty === "object" &&
                        "value" in finalProperty
                          ? finalProperty.value
                          : finalProperty;
                      finalValues[key] = finalValue;
                      if (isPageHeader) {
                        debugConsole.log(
                          `[DEBUG .UI kit / Page header] Final check for "${key}": expected ${JSON.stringify(expectedValue)}, finalProperty=${JSON.stringify(finalProperty)}, finalValue=${JSON.stringify(finalValue)}`,
                        );
                      }
                      if (
                        finalProperty === undefined ||
                        JSON.stringify(finalValue) !==
                          JSON.stringify(expectedValue)
                      ) {
                        debugConsole.warning(
                          `[IMPORT]   ⚠ Final check: Property "${key}" = ${JSON.stringify(finalValue)} (expected ${JSON.stringify(expectedValue)}) after all updates`,
                        );
                        if (isPageHeader) {
                          debugConsole.warning(
                            `[DEBUG .UI kit / Page header] ⚠ FINAL MISMATCH for "${key}"`,
                          );
                        }
                      } else {
                        debugConsole.log(
                          `[IMPORT]   ✓ Final check: Property "${key}" = ${JSON.stringify(finalValue)} (persisted correctly)`,
                        );
                        if (isPageHeader) {
                          debugConsole.log(
                            `[DEBUG .UI kit / Page header] ✓ FINAL MATCH for "${key}"`,
                          );
                        }
                      }
                    }
                    if (isPageHeader) {
                      debugConsole.log(
                        `[DEBUG .UI kit / Page header] Final verification complete. All properties: ${JSON.stringify(finalValues, null, 2)}`,
                      );
                    }
                  } else {
                    if (isPageHeader) {
                      debugConsole.warning(
                        `[DEBUG .UI kit / Page header] ⚠ Could not access componentProperties for final verification`,
                      );
                    }
                  }
                } catch (finalCheckError) {
                  debugConsole.warning(
                    `[IMPORT]   Could not perform final property check: ${finalCheckError}`,
                  );
                  if (isPageHeader) {
                    debugConsole.warning(
                      `[DEBUG .UI kit / Page header] ⚠ Error during final verification: ${finalCheckError}`,
                    );
                  }
                }
              }
            } else {
              debugConsole.warning(
                `[IMPORT]   No component properties found on component for deferred instance "${nodeData.name}"`,
              );
            }
          }
        } catch (error) {
          debugConsole.warning(
            `Failed to set component properties for resolved instance "${nodeData.name}": ${error}`,
          );
        }
      }

      // Extract child deferred instances before replacing parent placeholder
      // This handles nested deferred instances (child deferred inside parent deferred)
      // We check both:
      // 1. If parentPlaceholderId matches (explicit parent relationship)
      // 2. If the placeholder is actually inside the current placeholder (structural relationship)
      debugConsole.log(
        `[NESTED] Extracting child deferred instances for placeholder "${nodeData.name}" (${placeholderFrameId.substring(0, 8)}...). Total deferred instances: ${deferredInstances.length}`,
      );

      // Helper to check if a node is a descendant of the placeholder
      const isDescendantOfPlaceholder = async (
        nodeId: string,
      ): Promise<boolean> => {
        try {
          const node = await figma.getNodeByIdAsync(nodeId);
          if (!node || !node.parent) return false;

          let current: any = node.parent;
          while (current) {
            if (current.id === placeholderFrameId) {
              return true;
            }
            if (current.type === "PAGE") {
              break;
            }
            current = current.parent;
          }
          return false;
        } catch {
          return false;
        }
      };

      const childDeferredInstances: DeferredNormalInstance[] = [];
      for (const childDeferred of deferredInstances) {
        // Check explicit parent relationship
        if (childDeferred.parentPlaceholderId === placeholderFrameId) {
          childDeferredInstances.push(childDeferred);
          debugConsole.log(
            `[NESTED]   - Found child by parentPlaceholderId: "${childDeferred.nodeData.name}" (placeholder: ${childDeferred.placeholderFrameId.substring(0, 8)}...)`,
          );
        } else {
          // Check structural relationship (placeholder is inside current placeholder)
          const isInside = await isDescendantOfPlaceholder(
            childDeferred.placeholderFrameId,
          );
          if (isInside) {
            childDeferredInstances.push(childDeferred);
            debugConsole.log(
              `[NESTED]   - Found child by structural check: "${childDeferred.nodeData.name}" (placeholder: ${childDeferred.placeholderFrameId.substring(0, 8)}...) - placeholder is inside current placeholder`,
            );
          }
        }
      }

      debugConsole.log(
        `[NESTED] Found ${childDeferredInstances.length} child deferred instance(s) for placeholder "${nodeData.name}"`,
      );

      // Mark child deferred instances as processed so they don't get processed again in the main loop
      for (const childDeferred of childDeferredInstances) {
        processedAsChildren.add(childDeferred.placeholderFrameId);
      }

      // Replace placeholder with actual instance
      // Check if parentNode supports children (ChildrenMixin)
      if ("children" in parentNode && "insertChild" in parentNode) {
        const placeholderIndex = parentNode.children.indexOf(placeholderFrame);
        parentNode.insertChild(placeholderIndex, instanceNode);
        placeholderFrame.remove();
      } else {
        const error = `Parent node does not support children operations for deferred instance "${nodeData.name}"`;
        debugConsole.error(error);
        errors.push(error);
        continue;
      }

      // Resolve child deferred instances after parent is replaced
      // Match children by name only (exact match) - this is an instance override scenario
      // Helper function to recursively find a child by original ID or name
      const findChildRecursively = async (
        node: SceneNode,
        targetOriginalId: string | undefined,
        targetName: string,
      ): Promise<SceneNode[]> => {
        const matches: SceneNode[] = [];

        // For INSTANCE nodes, use plugin data (copied from component children during creation)
        if (targetOriginalId && node.type === "INSTANCE") {
          const nodeOriginalId = node.getPluginData(ORIGINAL_NODE_ID_KEY);
          if (nodeOriginalId === targetOriginalId) {
            matches.push(node);
          }
        }

        // Standard plugin data matching for non-instance nodes
        if (targetOriginalId && node.type !== "INSTANCE") {
          const nodeOriginalId = node.getPluginData(ORIGINAL_NODE_ID_KEY);
          if (nodeOriginalId === targetOriginalId) {
            matches.push(node);
          }
        }

        // Name matching fallback
        if (!targetOriginalId && node.name === targetName) {
          matches.push(node);
        }

        // Recurse into children
        if ("children" in node) {
          for (const child of node.children) {
            matches.push(
              ...(await findChildRecursively(
                child,
                targetOriginalId,
                targetName,
              )),
            );
          }
        }
        return matches;
      };

      for (const childDeferred of childDeferredInstances) {
        try {
          // Find matching children in actual instance by ID first, then fallback to name (recursive search)
          // This handles nested children (e.g., "arrow-top-right-on-square" inside "Link")
          const childId = childDeferred.nodeData.id;
          const childName = childDeferred.nodeData.name;

          console.log(
            `[DEFERRED] Looking for child "${childName}" with ID "${childId}" in instance "${nodeData.name}"`,
          );

          // Name-first approach: Try name-based matching first, then use ID as tiebreaker
          let matchingChildren: SceneNode[] = [];

          // First try name-based matching (within component hierarchy)
          const nameMatches = await findChildRecursively(
            instanceNode,
            undefined, // No ID filter - search by name only
            childName,
          );

          if (nameMatches.length === 1) {
            // Perfect match - single child with this name
            matchingChildren = nameMatches;
            debugConsole.log(
              `  ✓ Found single child by name "${childName}" in resolved instance "${nodeData.name}"`,
            );
          } else if (nameMatches.length > 1) {
            // Multiple children with same name - use ID as tiebreaker
            if (childId) {
              const idMatches = nameMatches.filter((child) => {
                const childOriginalId =
                  child.getPluginData(ORIGINAL_NODE_ID_KEY);
                return childOriginalId === childId;
              });

              if (idMatches.length === 1) {
                // Found exact match using ID tiebreaker
                matchingChildren = idMatches;
                debugConsole.log(
                  `  ✓ Found child by name "${childName}" with ID tiebreaker "${childId.substring(0, 8)}..." in resolved instance "${nodeData.name}"`,
                );
              } else if (idMatches.length > 1) {
                // Multiple matches even with ID - this shouldn't happen
                debugConsole.warning(
                  `  Multiple children with name "${childName}" and ID "${childId.substring(0, 8)}..." found in resolved instance "${nodeData.name}" - using first match`,
                );
                matchingChildren = [idMatches[0]];
              } else {
                // No ID matches among name matches - use first name match as fallback
                debugConsole.warning(
                  `  No child with name "${childName}" and ID "${childId.substring(0, 8)}..." found - using first name match as fallback in resolved instance "${nodeData.name}"`,
                );
                matchingChildren = [nameMatches[0]];
              }
            } else {
              // No ID available for tiebreaking - use first match
              debugConsole.warning(
                `  Multiple children with name "${childName}" found (${nameMatches.length} total) but no ID available for tiebreaking - using first match in resolved instance "${nodeData.name}"`,
              );
              matchingChildren = [nameMatches[0]];
            }
          } else if (nameMatches.length === 0) {
            // No name matches found - try fallback ID search (legacy behavior)
            if (childId) {
              const idMatches = await findChildRecursively(
                instanceNode,
                childId,
                childName, // Still pass name for fallback name matching
              );
              if (idMatches.length >= 1) {
                debugConsole.warning(
                  `  No name matches for "${childName}" - found ${idMatches.length} ID match(es) "${childId.substring(0, 8)}..." as fallback in resolved instance "${nodeData.name}"`,
                );
                matchingChildren = [idMatches[0]]; // Use first ID match
              } else {
                debugConsole.warning(
                  `  No matches found for child "${childName}" (ID: ${childId?.substring(0, 8) || "none"}) in resolved instance "${nodeData.name}" - child may not exist in component`,
                );
              }
            } else {
              debugConsole.warning(
                `  No matches found for child "${childName}" in resolved instance "${nodeData.name}" - child may not exist in component`,
              );
            }
          }

          if (matchingChildren.length === 0) {
            debugConsole.warning(
              `  Could not find matching child "${childName}"${childId ? ` (ID: ${childId.substring(0, 8)}...)` : ""} in resolved instance "${nodeData.name}" - child may not exist in component`,
            );
            continue;
          }

          // Note: With name-first matching above, matchingChildren should always be length 0 or 1

          // Single match - proceed with resolution
          const matchingChild = matchingChildren[0];

          // Find the component for the child deferred instance
          const childInstanceEntry = childDeferred.instanceEntry;
          let childReferencedPage = figma.root.children.find((page) => {
            const exactMatch =
              page.name === childInstanceEntry.componentPageName;
            const iconMatch =
              constructionIcon &&
              page.name ===
                `${constructionIcon} ${childInstanceEntry.componentPageName}`;
            return exactMatch || iconMatch;
          });

          if (!childReferencedPage) {
            const cleanTargetName = getComponentCleanName(
              childInstanceEntry.componentPageName,
            );
            childReferencedPage = figma.root.children.find((page) => {
              const cleanPageName = getComponentCleanName(page.name);
              return cleanPageName === cleanTargetName;
            });
          }

          if (!childReferencedPage) {
            debugConsole.warning(
              `  Could not find referenced page for child deferred instance "${childDeferred.nodeData.name}"`,
            );
            continue;
          }

          // Find the component (same logic as parent resolution)
          const findChildComponent = (
            parent: any,
            path: string[],
            componentName: string,
            componentGuid?: string,
            componentSetName?: string,
          ): ComponentNode | null => {
            if (path.length === 0) {
              let nameMatch: ComponentNode | null = null;
              for (const child of parent.children || []) {
                if (child.type === "COMPONENT") {
                  const cleanChildName = getComponentCleanName(child.name);
                  const cleanTargetName = getComponentCleanName(componentName);
                  if (cleanChildName === cleanTargetName) {
                    if (!nameMatch) {
                      nameMatch = child as ComponentNode;
                    }
                    // If componentGuid is provided, verify it matches
                    if (componentGuid) {
                      try {
                        const metadataStr = child.getPluginData(
                          "RecursicaPublishedMetadata",
                        );
                        if (metadataStr) {
                          const metadata = JSON.parse(metadataStr);
                          if (metadata.id === componentGuid) {
                            return child as ComponentNode;
                          }
                        }
                      } catch {
                        // Metadata check failed, continue searching
                      }
                    } else {
                      // No GUID check needed, return first match
                      return child as ComponentNode;
                    }
                  }
                } else if (child.type === "COMPONENT_SET" && componentSetName) {
                  const cleanSetName = getComponentCleanName(child.name);
                  const cleanTargetSetName =
                    getComponentCleanName(componentSetName);
                  if (cleanSetName === cleanTargetSetName) {
                    // Find variant by component name
                    for (const variant of child.children) {
                      if (variant.type === "COMPONENT") {
                        const cleanVariantName = getComponentCleanName(
                          variant.name,
                        );
                        const cleanTargetName =
                          getComponentCleanName(componentName);
                        if (cleanVariantName === cleanTargetName) {
                          if (!nameMatch) {
                            nameMatch = variant as ComponentNode;
                          }
                          // If componentGuid is provided, verify it matches
                          if (componentGuid) {
                            try {
                              const metadataStr = variant.getPluginData(
                                "RecursicaPublishedMetadata",
                              );
                              if (metadataStr) {
                                const metadata = JSON.parse(metadataStr);
                                if (metadata.id === componentGuid) {
                                  return variant as ComponentNode;
                                }
                              }
                            } catch {
                              // Metadata check failed, continue searching
                            }
                          } else {
                            // No GUID check needed, return first match
                            return variant as ComponentNode;
                          }
                        }
                      }
                    }
                  }
                }
              }
              // Return name match if GUID check failed or no GUID provided
              return nameMatch;
            }

            let current = parent;
            for (const pathSegment of path) {
              const cleanSegment = getComponentCleanName(pathSegment);
              const found = (current.children || []).find(
                (child: any) =>
                  getComponentCleanName(child.name) === cleanSegment,
              );
              if (!found) return null;
              current = found;
            }

            if (current.type === "COMPONENT") {
              const cleanCurrentName = getComponentCleanName(current.name);
              const cleanTargetName = getComponentCleanName(componentName);
              if (cleanCurrentName === cleanTargetName) {
                // If componentGuid is provided, verify it matches
                if (componentGuid) {
                  try {
                    const metadataStr = current.getPluginData(
                      "RecursicaPublishedMetadata",
                    );
                    if (metadataStr) {
                      const metadata = JSON.parse(metadataStr);
                      if (metadata.id === componentGuid) {
                        return current as ComponentNode;
                      }
                    }
                  } catch {
                    // Metadata check failed, return null
                    return null;
                  }
                } else {
                  return current as ComponentNode;
                }
              }
            } else if (current.type === "COMPONENT_SET" && componentSetName) {
              for (const variant of current.children) {
                if (variant.type === "COMPONENT") {
                  const cleanVariantName = getComponentCleanName(variant.name);
                  const cleanTargetName = getComponentCleanName(componentName);
                  if (cleanVariantName === cleanTargetName) {
                    // If componentGuid is provided, verify it matches
                    if (componentGuid) {
                      try {
                        const metadataStr = variant.getPluginData(
                          "RecursicaPublishedMetadata",
                        );
                        if (metadataStr) {
                          const metadata = JSON.parse(metadataStr);
                          if (metadata.id === componentGuid) {
                            return variant as ComponentNode;
                          }
                        }
                      } catch {
                        // Metadata check failed, continue searching
                        continue;
                      }
                    } else {
                      return variant as ComponentNode;
                    }
                  }
                }
              }
            }
            return null;
          };

          // If componentSetName is not provided, try using the child's name as the component set name
          // This handles cases where the instance entry doesn't have the component set name set
          let componentSetName = childInstanceEntry.componentSetName;
          if (!componentSetName && childDeferred.nodeData.name) {
            componentSetName = childDeferred.nodeData.name;
            debugConsole.log(
              `  [NESTED] componentSetName not provided, using child name "${componentSetName}" as fallback`,
            );
          }

          debugConsole.log(
            `  [NESTED] Looking for component: page="${childReferencedPage.name}", componentSet="${componentSetName}", component="${childInstanceEntry.componentName}", path=[${(childInstanceEntry.path || []).join(", ")}]`,
          );

          // Debug: List all component sets on the page (recursively search)
          const findAllComponentSets = (node: any): any[] => {
            const sets: any[] = [];
            if (node.type === "COMPONENT_SET") {
              sets.push(node);
            }
            if ("children" in node && Array.isArray(node.children)) {
              for (const child of node.children) {
                sets.push(...findAllComponentSets(child));
              }
            }
            return sets;
          };
          const allComponentSets = findAllComponentSets(childReferencedPage);
          debugConsole.log(
            `  [NESTED] Found ${allComponentSets.length} component set(s) on page "${childReferencedPage.name}" (recursive search): ${allComponentSets.map((cs) => cs.name).join(", ")}`,
          );

          // Debug: List all direct children of the page to see structure
          const directChildren = childReferencedPage.children.map(
            (child) => `${child.type}:${child.name}`,
          );
          debugConsole.log(
            `  [NESTED] Direct children of page "${childReferencedPage.name}" (${directChildren.length}): ${directChildren.slice(0, 10).join(", ")}${directChildren.length > 10 ? "..." : ""}`,
          );

          const childTargetComponent = findChildComponent(
            childReferencedPage,
            childInstanceEntry.path || [],
            childInstanceEntry.componentName,
            childInstanceEntry.componentGuid,
            componentSetName,
          );

          if (!childTargetComponent) {
            debugConsole.warning(
              `  Could not find component "${childInstanceEntry.componentName}" (componentSet: "${componentSetName}") for child deferred instance "${childDeferred.nodeData.name}" on page "${childReferencedPage.name}"`,
            );
            // Debug: Try to find what component sets exist that might match
            if (componentSetName) {
              const cleanTargetSetName =
                getComponentCleanName(componentSetName);
              const matchingSets = allComponentSets.filter((cs) => {
                const cleanSetName = getComponentCleanName(cs.name);
                return cleanSetName === cleanTargetSetName;
              });
              if (matchingSets.length > 0) {
                debugConsole.log(
                  `  [NESTED] Found ${matchingSets.length} component set(s) with matching clean name "${cleanTargetSetName}": ${matchingSets.map((cs) => cs.name).join(", ")}`,
                );
                // List variants in the matching set
                for (const set of matchingSets) {
                  const variants = (set as ComponentSetNode).children.filter(
                    (c) => c.type === "COMPONENT",
                  );
                  debugConsole.log(
                    `  [NESTED] Component set "${set.name}" has ${variants.length} variant(s): ${variants.map((v) => v.name).join(", ")}`,
                  );
                }
              }
            }
            continue;
          }

          // Create child instance
          const childInstanceNode = childTargetComponent.createInstance();
          childInstanceNode.name =
            childDeferred.nodeData.name || matchingChild.name;

          // Copy position and size from matching child
          childInstanceNode.x = matchingChild.x;
          childInstanceNode.y = matchingChild.y;
          if (
            matchingChild.width !== undefined &&
            matchingChild.height !== undefined
          ) {
            childInstanceNode.resize(matchingChild.width, matchingChild.height);
          }

          // Apply fill bound variables to child instance children (recursive)
          await applyFillBoundVariablesToInstanceChildren(
            childInstanceNode,
            childDeferred.nodeData,
            recognizedVariables,
          );

          // Update children from JSON to preserve bound variables and other properties
          await updateInstanceChildrenFromJson(
            childInstanceNode,
            childDeferred.nodeData,
          );

          // Replace matching child with actual child instance
          // Handle nested children - get the actual parent of the matching child
          const actualParent = matchingChild.parent;
          if (!actualParent || !("children" in actualParent)) {
            const error = `Cannot replace child "${childDeferred.nodeData.name}": parent does not support children`;
            debugConsole.error(error);
            errors.push(error);
            failed++;
            continue;
          }
          const childIndex = actualParent.children.indexOf(matchingChild);
          actualParent.insertChild(childIndex, childInstanceNode);
          matchingChild.remove();

          debugConsole.log(
            `  ✓ Resolved nested child deferred instance "${childDeferred.nodeData.name}" in "${nodeData.name}"`,
          );
        } catch (error) {
          debugConsole.warning(
            `  Error resolving child deferred instance "${childDeferred.nodeData.name}": ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }

      debugConsole.log(
        `  ✓ Resolved deferred instance "${nodeData.name}" from component "${instanceEntry.componentName}" on page "${instanceEntry.componentPageName}"`,
      );
      resolved++;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const fullError = `Failed to resolve deferred instance "${deferred.nodeData.name}": ${errorMessage}`;
      debugConsole.error(fullError);
      errors.push(fullError);
      failed++;
    }
  }

  debugConsole.log(
    `=== Deferred Resolution Complete: ${resolved} resolved, ${failed} failed ===`,
  );

  return { resolved, failed, errors };
}

export interface CleanupCreatedEntitiesData {
  pageIds: string[];
  collectionIds: string[];
  variableIds: string[];
}

/**
 * Cleans up created entities (pages, variables) by their IDs
 * Used when import fails to remove partially created entities
 * Collections are never deleted - only the variables we created are removed
 */
export async function cleanupCreatedEntities(
  data: CleanupCreatedEntitiesData,
): Promise<ResponseMessage> {
  debugConsole.log("=== Cleaning up created entities ===");

  try {
    const { pageIds, collectionIds, variableIds } = data;

    // Delete all variables we created (from both new and existing collections)
    // We never delete collections - only the variables we created
    let deletedVariables = 0;
    for (const variableId of variableIds) {
      try {
        const variable = await figma.variables.getVariableByIdAsync(variableId);
        if (variable) {
          variable.remove();
          deletedVariables++;
        }
      } catch (error) {
        debugConsole.warning(
          `Could not delete variable ${variableId.substring(0, 8)}...: ${error}`,
        );
      }
    }

    // Never delete collections - we only delete variables we created
    debugConsole.log(
      `Skipping deletion of ${collectionIds.length} collection(s) - collections are never deleted`,
    );

    // Delete pages
    await figma.loadAllPagesAsync();
    let deletedPages = 0;
    for (const pageId of pageIds) {
      try {
        const page = (await figma.getNodeByIdAsync(pageId)) as PageNode | null;
        if (page && page.type === "PAGE") {
          page.remove();
          deletedPages++;
        }
      } catch (error) {
        debugConsole.warning(
          `Could not delete page ${pageId.substring(0, 8)}...: ${error}`,
        );
      }
    }

    debugConsole.log(
      `Cleanup complete: Deleted ${deletedPages} page(s), ${deletedVariables} variable(s) (collections are never deleted)`,
    );

    return {
      type: "cleanupCreatedEntities",
      success: true,
      error: false,
      message: "Cleanup completed successfully",
      data: {
        deletedPages,
        deletedCollections: 0, // Never delete collections
        deletedVariables,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    debugConsole.error(`Cleanup failed: ${errorMessage}`);
    return {
      type: "cleanupCreatedEntities",
      success: false,
      error: true,
      message: errorMessage,
      data: {},
    };
  }
}
