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
  isMainPage?: boolean; // If true, always create a copy (no prompt). If false, prompt for existing pages.
  clearConsole?: boolean; // If true, clear the debug console before import (default: true for single page, false for multi-page)
}

export interface DeferredNormalInstance {
  placeholderFrame: FrameNode; // Placeholder frame created during import
  instanceEntry: any; // Instance table entry
  nodeData: any; // Original node data
  parentNode: any; // Parent node where placeholder was created
  instanceIndex: number; // Instance table index
}

export interface ImportPageResponseData {
  pageName: string;
  deferredInstances?: DeferredNormalInstance[]; // Normal instances that couldn't be resolved yet
  totalNodes: number;
  createdEntities?: {
    pageIds: string[];
    collectionIds: string[];
    variableIds: string[];
  };
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

// Removed unused function: bindVariableToNodeProperty

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
  nodeIdMapping: Map<string, any> | null = null, // old node ID -> new node
  isRemoteStructure: boolean = false, // If true, don't resolve instance references, just recreate as frames
  remoteComponentMap: Map<number, ComponentNode> | null = null, // instance table index -> component node on REMOTES page
  deferredInstances: DeferredNormalInstance[] | null = null, // Array to collect deferred normal instances
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
        await debugConsole.log(
          `Reusing existing COMPONENT "${nodeData.name || "Unnamed"}" (ID: ${nodeData.id.substring(0, 8)}...)`,
        );
        // Don't return early - we still need to process children and append to parent
        // But skip the node creation since it already exists
      } else {
        newNode = figma.createComponent();
        await debugConsole.log(
          `Created COMPONENT "${nodeData.name || "Unnamed"}" (ID: ${nodeData.id ? nodeData.id.substring(0, 8) + "..." : "no ID"})`,
        );

        // Add component property definitions using addComponentProperty() method
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
                await debugConsole.warning(
                  `  Unknown property type ${typeValue} (${typeof typeValue}) for property "${propName}" in component "${nodeData.name || "Unnamed"}"`,
                );
                failedCount++;
                continue;
              }

              const defaultValue = (propDef as any).defaultValue;
              // Property names in JSON may include IDs (e.g., "Show trailing icon#318:0")
              // Extract just the property name part (before the #)
              const cleanPropName = propName.split("#")[0];
              newNode.addComponentProperty(
                cleanPropName,
                propType,
                defaultValue,
              );
              addedCount++;
            } catch (error) {
              await debugConsole.warning(
                `  Failed to add component property "${propName}" to "${nodeData.name || "Unnamed"}": ${error}`,
              );
              failedCount++;
            }
          }

          if (addedCount > 0) {
            await debugConsole.log(
              `  Added ${addedCount} component property definition(s) to "${nodeData.name || "Unnamed"}"${failedCount > 0 ? ` (${failedCount} failed)` : ""}`,
            );
          }
        }
      }
      break;
    case "COMPONENT_SET": {
      // COMPONENT_SET cannot be created directly, but we can create individual components
      // and then combine them using figma.combineAsVariants()
      const componentChildren = nodeData.children
        ? nodeData.children.filter((c: any) => c.type === "COMPONENT").length
        : 0;
      await debugConsole.log(
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
                null, // deferredInstances - not needed for component set creation
              );
              if (componentNode && componentNode.type === "COMPONENT") {
                componentVariants.push(componentNode);
                await debugConsole.log(
                  `  Created component variant: "${componentNode.name || "Unnamed"}"`,
                );
              }
            } catch (error) {
              await debugConsole.warning(
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

          // Apply other properties from nodeData to the component set
          if (nodeData.x !== undefined) {
            componentSet.x = nodeData.x;
          }
          if (nodeData.y !== undefined) {
            componentSet.y = nodeData.y;
          }

          // Remove the temporary parent frame (components are now in the component set)
          if (tempParent && tempParent.parent) {
            tempParent.remove();
          }

          await debugConsole.log(
            `  ✓ Successfully created COMPONENT_SET "${componentSet.name}" with ${componentVariants.length} variant(s)`,
          );
          newNode = componentSet;
        } catch (error) {
          await debugConsole.warning(
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
        await debugConsole.warning(
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
              await debugConsole.warning(
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
                await debugConsole.error(
                  `Component not found for internal instance "${nodeData.name}" (ID: ${instanceEntry.componentNodeId.substring(0, 8)}...). The component should have been created during import.`,
                );
                await debugConsole.error(
                  `Looking for component ID: ${instanceEntry.componentNodeId}`,
                );
                await debugConsole.error(
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

                await debugConsole.error(
                  `Component ID ${instanceEntry.componentNodeId.substring(0, 8)}... exists in current node tree: ${componentExistsInPageData}`,
                );

                // Log possible reasons why the component wasn't found
                await debugConsole.error(
                  `WARNING: Component ID ${instanceEntry.componentNodeId.substring(0, 8)}... not found in nodeIdMapping. This might indicate:`,
                );
                await debugConsole.error(
                  `  1. The component doesn't exist in the pageData (detached component?)`,
                );
                await debugConsole.error(
                  `  2. The component wasn't collected in the first pass`,
                );
                await debugConsole.error(
                  `  3. The component ID in the instance table doesn't match the actual component ID`,
                );

                // Check if any available ID starts with the same prefix
                const matchingPrefix = availableIds.filter((id) =>
                  id.startsWith(instanceEntry.componentNodeId!.substring(0, 8)),
                );
                if (matchingPrefix.length > 0) {
                  await debugConsole.error(
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
                await debugConsole.log(
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
                    // Get the component's property definitions (async method required)
                    const mainComponent = await newNode.getMainComponentAsync();
                    if (mainComponent) {
                      const componentProperties =
                        mainComponent.componentPropertyDefinitions;
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
                          // await debugConsole.warning(
                          //   `Skipping variant property "${propName}" for internal instance "${nodeData.name}" - property does not exist on recreated component`,
                          // );
                        }
                      }

                      // Only set properties if we have valid ones
                      if (Object.keys(validProperties).length > 0) {
                        newNode.setProperties(validProperties);
                      }
                    } else {
                      await debugConsole.warning(
                        `Cannot set variant properties for internal instance "${nodeData.name}" - main component not found`,
                      );
                    }
                  } catch (error) {
                    const errorMessage = `Failed to set variant properties for instance "${nodeData.name}": ${error}`;
                    await debugConsole.error(errorMessage);
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
                      const componentProperties =
                        mainComponent.componentPropertyDefinitions;

                      // Only set properties that exist on the component
                      for (const [propName, propValue] of Object.entries(
                        instanceEntry.componentProperties,
                      )) {
                        // Property names in JSON may include IDs (e.g., "Show trailing icon#318:0")
                        // Extract just the property name part (before the #) to match component property definitions
                        const cleanPropName = propName.split("#")[0];
                        if (componentProperties[cleanPropName]) {
                          try {
                            newNode.setProperties({
                              [cleanPropName]: propValue,
                            });
                          } catch (error) {
                            const errorMessage = `Failed to set component property "${cleanPropName}" for internal instance "${nodeData.name}": ${error}`;
                            await debugConsole.error(errorMessage);
                            throw new Error(errorMessage);
                          }
                        } else {
                          // Expected: Component property definitions cannot be recreated via Figma API
                          // This is a known limitation - properties are skipped silently
                          // await debugConsole.warning(
                          //   `Skipping component property "${propName}" for internal instance "${nodeData.name}" - property does not exist on recreated component`,
                          // );
                        }
                      }
                    } else {
                      await debugConsole.warning(
                        `Cannot set component properties for internal instance "${nodeData.name}" - main component not found`,
                      );
                    }
                  } catch (error) {
                    // Re-throw if it's already our error, otherwise wrap it
                    if (error instanceof Error) {
                      throw error;
                    }
                    const errorMessage = `Failed to set component properties for instance "${nodeData.name}": ${error}`;
                    await debugConsole.error(errorMessage);
                    throw new Error(errorMessage);
                  }
                }
              } else if (!newNode && componentNode) {
                // componentNode exists but is not a COMPONENT type
                const errorMessage = `Component node found but is not a COMPONENT type for internal instance "${nodeData.name}" (ID: ${instanceEntry.componentNodeId.substring(0, 8)}...).`;
                await debugConsole.error(errorMessage);
                throw new Error(errorMessage);
              }
              // If newNode is already set (from frame fallback), continue to process children and properties
            }
          } else {
            const errorMessage = `Internal instance "${nodeData.name}" missing componentNodeId. This is required for internal instances.`;
            await debugConsole.error(errorMessage);
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
              await debugConsole.log(
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
                    const componentProperties =
                      mainComponent.componentPropertyDefinitions;
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
                        // await debugConsole.warning(
                        //   `Skipping variant property "${propName}" for remote instance "${nodeData.name}" - property does not exist on recreated component`,
                        // );
                      }
                    }

                    // Only set properties if we have valid ones
                    if (Object.keys(validProperties).length > 0) {
                      newNode.setProperties(validProperties);
                    }
                  } else {
                    await debugConsole.warning(
                      `Cannot set variant properties for remote instance "${nodeData.name}" - main component not found`,
                    );
                  }
                } catch (error) {
                  const errorMessage = `Failed to set variant properties for remote instance "${nodeData.name}": ${error}`;
                  await debugConsole.error(errorMessage);
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
                    const componentProperties =
                      mainComponent.componentPropertyDefinitions;

                    // Only set properties that exist on the component
                    for (const [propName, propValue] of Object.entries(
                      instanceEntry.componentProperties,
                    )) {
                      // Property names in JSON may include IDs (e.g., "Show trailing icon#318:0")
                      // Extract just the property name part (before the #) to match component property definitions
                      const cleanPropName = propName.split("#")[0];
                      if (componentProperties[cleanPropName]) {
                        try {
                          newNode.setProperties({ [cleanPropName]: propValue });
                        } catch (error) {
                          const errorMessage = `Failed to set component property "${cleanPropName}" for remote instance "${nodeData.name}": ${error}`;
                          await debugConsole.error(errorMessage);
                          throw new Error(errorMessage);
                        }
                      } else {
                        // Expected: Component property definitions cannot be recreated via Figma API
                        // This is a known limitation - properties are skipped silently
                        // await debugConsole.warning(
                        //   `Skipping component property "${propName}" for remote instance "${nodeData.name}" - property does not exist on recreated component`,
                        // );
                      }
                    }
                  } else {
                    await debugConsole.warning(
                      `Cannot set component properties for remote instance "${nodeData.name}" - main component not found`,
                    );
                  }
                } catch (error) {
                  // Re-throw if it's already our error, otherwise wrap it
                  if (error instanceof Error) {
                    throw error;
                  }
                  const errorMessage = `Failed to set component properties for remote instance "${nodeData.name}": ${error}`;
                  await debugConsole.error(errorMessage);
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
                  await debugConsole.log(
                    `Note: Could not resize remote instance "${nodeData.name}" to ${nodeData.width}x${nodeData.height} (may be constrained by component)`,
                  );
                }
              }
            } else {
              const errorMessage = `Remote component not found for instance "${nodeData.name}" (index ${nodeData._instanceRef}). The remote component should have been created on the REMOTES page.`;
              await debugConsole.error(errorMessage);
              throw new Error(errorMessage);
            }
          } else {
            const errorMessage = `Remote instance "${nodeData.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            await debugConsole.error(errorMessage);
            throw new Error(errorMessage);
          }
        } else if (instanceEntry?.instanceType === "normal") {
          // Normal instance - resolve from component on referenced page
          if (!instanceEntry.componentPageName) {
            const errorMessage = `Normal instance "${nodeData.name}" missing componentPageName. Cannot resolve.`;
            await debugConsole.error(errorMessage);
            throw new Error(errorMessage);
          }

          // Find the referenced page
          await figma.loadAllPagesAsync();
          const referencedPage = figma.root.children.find(
            (page) => page.name === instanceEntry.componentPageName,
          );

          if (!referencedPage) {
            // Page doesn't exist yet - defer resolution (circular reference or not yet imported)
            await debugConsole.log(
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

            // Store deferred instance info
            if (deferredInstances) {
              deferredInstances.push({
                placeholderFrame,
                instanceEntry,
                nodeData,
                parentNode,
                instanceIndex: nodeData._instanceRef,
              });
            }

            newNode = placeholderFrame;
            break;
          }

          // Find the component on the referenced page using path and component name
          let targetComponent: ComponentNode | null = null;

          // Helper function to find component by path and name
          const findComponentByPath = (
            parent: any,
            path: string[],
            componentName: string,
            componentGuid?: string,
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
                );
              }
            }
            return null;
          };

          await debugConsole.log(
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
            await debugConsole.log(
              `  Available components on page "${instanceEntry.componentPageName}":\n${availableComponents.slice(0, 20).join("\n")}${availableComponents.length > 20 ? `\n  ... and ${availableComponents.length - 20} more` : ""}`,
            );
          } else {
            await debugConsole.warning(
              `  No components found on page "${instanceEntry.componentPageName}"`,
            );
          }

          targetComponent = findComponentByPath(
            referencedPage,
            instanceEntry.path || [],
            instanceEntry.componentName,
            instanceEntry.componentGuid,
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
                  await debugConsole.warning(
                    `  Found component "${instanceEntry.componentName}" by name but GUID verification failed (expected ${instanceEntry.componentGuid.substring(0, 8)}..., got ${metadata.id ? metadata.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`,
                  );
                } else {
                  await debugConsole.log(
                    `  Found component "${instanceEntry.componentName}" with matching GUID ${instanceEntry.componentGuid.substring(0, 8)}...`,
                  );
                }
              } else {
                await debugConsole.warning(
                  `  Found component "${instanceEntry.componentName}" by name but no metadata found. Using name match as fallback.`,
                );
              }
            } catch {
              await debugConsole.warning(
                `  Found component "${instanceEntry.componentName}" by name but GUID verification failed. Using name match as fallback.`,
              );
            }
          }

          if (!targetComponent) {
            // Component not found - defer resolution (may not be created yet due to circular reference)
            await debugConsole.log(
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

            // Store deferred instance info
            if (deferredInstances) {
              deferredInstances.push({
                placeholderFrame,
                instanceEntry,
                nodeData,
                parentNode,
                instanceIndex: nodeData._instanceRef,
              });
            }

            newNode = placeholderFrame;
            break;
          }

          // Create instance of the component
          newNode = targetComponent.createInstance();
          await debugConsole.log(
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
                let componentProperties: ComponentPropertyDefinitions;
                if (
                  mainComponent.parent &&
                  mainComponent.parent.type === "COMPONENT_SET"
                ) {
                  componentProperties =
                    mainComponent.parent.componentPropertyDefinitions;
                } else {
                  componentProperties =
                    mainComponent.componentPropertyDefinitions;
                }

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
            } catch (error) {
              await debugConsole.warning(
                `Failed to set variant properties for normal instance "${nodeData.name}": ${error}`,
              );
            }
          }

          // Set component properties if they exist
          if (
            instanceEntry.componentProperties &&
            Object.keys(instanceEntry.componentProperties).length > 0
          ) {
            try {
              const mainComponent = await newNode.getMainComponentAsync();
              if (mainComponent) {
                // If the main component is a variant (inside a COMPONENT_SET),
                // get property definitions from the parent COMPONENT_SET instead
                let componentProperties: ComponentPropertyDefinitions;
                if (
                  mainComponent.parent &&
                  mainComponent.parent.type === "COMPONENT_SET"
                ) {
                  componentProperties =
                    mainComponent.parent.componentPropertyDefinitions;
                } else {
                  componentProperties =
                    mainComponent.componentPropertyDefinitions;
                }

                // Only set properties that exist on the component
                const propertiesToSet: Record<string, any> = {};
                for (const [propName, propValue] of Object.entries(
                  instanceEntry.componentProperties,
                )) {
                  // Property names in JSON may include IDs - extract clean name
                  const cleanPropName = propName.split("#")[0];

                  // Check if property exists - Figma may return property keys with or without ID suffixes
                  // Try exact match first, then try matching by base name
                  let matchingPropKey: string | undefined = undefined;
                  if (componentProperties[propName]) {
                    // Exact match (with ID suffix)
                    matchingPropKey = propName;
                  } else if (componentProperties[cleanPropName]) {
                    // Match by clean name (without ID suffix)
                    matchingPropKey = cleanPropName;
                  } else {
                    // Try to find a property that starts with the clean name (in case ID format differs)
                    matchingPropKey = Object.keys(componentProperties).find(
                      (key) => key.split("#")[0] === cleanPropName,
                    );
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
                    // Use the matching property key (which may have ID suffix) for setProperties
                    // Figma API requires the exact property key as it exists on the component
                    propertiesToSet[matchingPropKey] = actualValue;
                  } else {
                    await debugConsole.warning(
                      `Component property "${cleanPropName}" (from "${propName}") does not exist on component "${instanceEntry.componentName}" for normal instance "${nodeData.name}". Available properties: ${Object.keys(componentProperties).join(", ") || "none"}`,
                    );
                  }
                }

                // Set all properties at once
                if (Object.keys(propertiesToSet).length > 0) {
                  try {
                    // Log what we're trying to set and what's available
                    await debugConsole.log(
                      `  Attempting to set component properties for normal instance "${nodeData.name}": ${Object.keys(propertiesToSet).join(", ")}`,
                    );
                    await debugConsole.log(
                      `  Available component properties: ${Object.keys(componentProperties).join(", ")}`,
                    );
                    newNode.setProperties(propertiesToSet);
                    await debugConsole.log(
                      `  ✓ Successfully set component properties for normal instance "${nodeData.name}": ${Object.keys(propertiesToSet).join(", ")}`,
                    );
                  } catch (error) {
                    await debugConsole.warning(
                      `Failed to set component properties for normal instance "${nodeData.name}": ${error}`,
                    );
                    await debugConsole.warning(
                      `  Properties attempted: ${JSON.stringify(propertiesToSet)}`,
                    );
                    await debugConsole.warning(
                      `  Available properties: ${JSON.stringify(Object.keys(componentProperties))}`,
                    );
                  }
                }
              }
            } catch (error) {
              await debugConsole.warning(
                `Failed to set component properties for normal instance "${nodeData.name}": ${error}`,
              );
            }
          }

          // Set instance size after properties are applied (properties might affect size)
          if (nodeData.width !== undefined && nodeData.height !== undefined) {
            try {
              newNode.resize(nodeData.width, nodeData.height);
            } catch {
              // Size might be constrained by component - this is okay
              await debugConsole.log(
                `Note: Could not resize normal instance "${nodeData.name}" to ${nodeData.width}x${nodeData.height} (may be constrained by component)`,
              );
            }
          }
        } else {
          // Unknown instance type or missing entry - this is an error
          const errorMessage = `Instance "${nodeData.name}" has unknown or missing instance type: ${instanceEntry?.instanceType || "unknown"}`;
          await debugConsole.error(errorMessage);
          throw new Error(errorMessage);
        }
      } else {
        // No _instanceRef or missing instance table - this is an error
        const errorMessage = `Instance "${nodeData.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        await debugConsole.error(errorMessage);
        throw new Error(errorMessage);
      }
      break;
    case "GROUP":
      newNode = figma.createFrame();
      break;
    case "BOOLEAN_OPERATION": {
      const booleanError = `Boolean operation nodes cannot be imported. Found boolean operation: "${nodeData.name}".`;
      await debugConsole.error(booleanError);
      throw new Error(booleanError);
    }
    case "POLYGON":
      newNode = figma.createPolygon();
      break;
    default: {
      const errorMessage = `Unsupported node type: ${nodeData.type}. This node type cannot be imported.`;
      await debugConsole.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  if (!newNode) {
    return null;
  }

  // Store node ID mapping for internal instance resolution
  if (nodeData.id && nodeIdMapping) {
    nodeIdMapping.set(nodeData.id, newNode);
    if (newNode.type === "COMPONENT") {
      await debugConsole.log(
        `  Stored COMPONENT "${nodeData.name || "Unnamed"}" in nodeIdMapping (ID: ${nodeData.id.substring(0, 8)}...)`,
      );
    }
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
  // For VECTOR nodes, we need to set size AFTER vectorPaths are set,
  // because setting vectorPaths can auto-resize the vector to fit the path bounds.
  // For other node types, set size now.
  if (
    nodeData.type !== "VECTOR" &&
    nodeData.width !== undefined &&
    nodeData.height !== undefined
  ) {
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

  // Set fills (skip instances, they're handled separately)
  // For FRAME and COMPONENT nodes, if fills are undefined, explicitly clear them
  // to prevent default white fills from appearing
  if (nodeData.type !== "INSTANCE") {
    if (nodeData.fills !== undefined) {
      try {
        // Process fills array - remove boundVariables that contain _varRef
        // We'll restore them properly after setting the fills
        let fills = nodeData.fills;
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
    } else if (
      nodeData.type === "FRAME" ||
      nodeData.type === "COMPONENT" ||
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
  if (nodeData.strokeWeight !== undefined) {
    newNode.strokeWeight = nodeData.strokeWeight;
  } else if (
    nodeData.type === "VECTOR" &&
    (nodeData.strokes === undefined || nodeData.strokes.length === 0)
  ) {
    // If no strokes, ensure strokeWeight is 0 (vectors might have default strokeWeight)
    newNode.strokeWeight = 0;
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
    if (nodeData.dashPattern !== undefined && nodeData.dashPattern.length > 0) {
      newNode.dashPattern = nodeData.dashPattern;
    }
    // Set vector paths for VECTOR nodes (critical for displaying paths)
    // fillGeometry is read-only, so we need to use vectorPaths instead
    if (nodeData.type === "VECTOR") {
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
              await debugConsole.log(
                `  Normalized path ${i + 1} for "${nodeData.name || "Unnamed"}": ${originalData.substring(0, 50)}... -> ${normalizedData.substring(0, 50)}...`,
              );
            }
          }
          (newNode as any).vectorPaths = vectorPaths;
          await debugConsole.log(
            `  Set vectorPaths for VECTOR "${nodeData.name || "Unnamed"}" (${vectorPaths.length} path(s))`,
          );
        } catch (error) {
          await debugConsole.warning(
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
          await debugConsole.warning(
            `Error setting strokeGeometry for VECTOR "${nodeData.name || "Unnamed"}": ${error}`,
          );
        }
      }
      // Set size AFTER vectorPaths are set, because setting vectorPaths can auto-resize the vector
      // Setting size after ensures the vector has the correct dimensions
      if (nodeData.width !== undefined && nodeData.height !== undefined) {
        try {
          newNode.resize(nodeData.width, nodeData.height);
          await debugConsole.log(
            `  Set size for VECTOR "${nodeData.name || "Unnamed"}" to ${nodeData.width}x${nodeData.height}`,
          );
        } catch (error) {
          await debugConsole.warning(
            `Error setting size for VECTOR "${nodeData.name || "Unnamed"}": ${error}`,
          );
        }
      }
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
  // Note: INSTANCE nodes cannot have children appended - they are read-only representations
  // of their main component, so we skip children for INSTANCE nodes
  if (
    nodeData.children &&
    Array.isArray(nodeData.children) &&
    newNode.type !== "INSTANCE"
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
    await debugConsole.log(
      `  First pass: Creating ${allComponents.length} COMPONENT node(s) (without children)...`,
    );
    // Log all collected components for debugging
    for (const comp of allComponents) {
      await debugConsole.log(
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
        // Create just the component node itself (no children processing yet)
        const componentNode = figma.createComponent();
        if (componentData.name !== undefined) {
          componentNode.name = componentData.name || "Unnamed Node";
        }

        // Add component property definitions using addComponentProperty() method
        if (componentData.componentPropertyDefinitions) {
          const propDefs = componentData.componentPropertyDefinitions;
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
                await debugConsole.warning(
                  `  Unknown property type ${(propDef as any).type} for property "${propName}" in component "${componentData.name || "Unnamed"}"`,
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
              await debugConsole.warning(
                `  Failed to add component property "${propName}" to "${componentData.name || "Unnamed"}" in first pass: ${error}`,
              );
              failedCount++;
            }
          }

          if (addedCount > 0) {
            await debugConsole.log(
              `  Added ${addedCount} component property definition(s) to "${componentData.name || "Unnamed"}" in first pass${failedCount > 0 ? ` (${failedCount} failed)` : ""}`,
            );
          }
        }

        // Store in mapping immediately so instances can find it
        nodeIdMapping.set(componentData.id, componentNode);
        await debugConsole.log(
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
        null, // deferredInstances - not needed for remote structures
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
  metadata?: { guid: string; name: string; version?: number };
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
function loadCollectionTable(expandedJsonData: any): {
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
async function matchCollections(collectionTable: CollectionTable): Promise<{
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

  return {
    recognizedCollections,
    potentialMatches,
    collectionsToCreate,
  };
}

/**
 * Stage 5: Prompt user for potential collection matches
 */
async function promptForPotentialMatches(
  potentialMatches: Map<
    string,
    { entry: CollectionTableEntry; collection: VariableCollection }
  >,
  recognizedCollections: Map<string, VariableCollection>,
  collectionsToCreate: Map<string, CollectionTableEntry>,
): Promise<void> {
  if (potentialMatches.size === 0) {
    return;
  }

  await debugConsole.log(
    `Prompting user for ${potentialMatches.size} potential match(es)...`,
  );

  for (const [index, { entry, collection }] of potentialMatches.entries()) {
    try {
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
        timeoutMs: -1,
      });

      await debugConsole.log(
        `✓ User confirmed: Using existing collection "${displayName}" (index ${index})`,
      );
      recognizedCollections.set(index, collection);

      await ensureCollectionModes(collection, entry.modes);
      await debugConsole.log(
        `  ✓ Ensured modes for collection "${displayName}" (${entry.modes.length} mode(s))`,
      );
    } catch {
      await debugConsole.log(
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

  await debugConsole.log(`Ensuring modes exist for recognized collections...`);

  const collections = collectionTable.getTable();
  for (const [index, collection] of recognizedCollections.entries()) {
    const entry = collections[index];
    if (entry) {
      const wasUserConfirmed = potentialMatches.has(index);
      if (!wasUserConfirmed) {
        await ensureCollectionModes(collection, entry.modes);
        await debugConsole.log(
          `  ✓ Ensured modes for collection "${collection.name}" (${entry.modes.length} mode(s))`,
        );
      }
    }
  }
}

/**
 * Stage 7: Create new collections
 */
async function createNewCollections(
  collectionsToCreate: Map<string, CollectionTableEntry>,
  recognizedCollections: Map<string, VariableCollection>,
  newlyCreatedCollections: VariableCollection[],
): Promise<void> {
  if (collectionsToCreate.size === 0) {
    return;
  }

  await debugConsole.log(
    `Creating ${collectionsToCreate.size} new collection(s)...`,
  );

  for (const [index, entry] of collectionsToCreate.entries()) {
    const normalizedName = normalizeCollectionName(entry.collectionName);
    const uniqueName = await findUniqueCollectionName(normalizedName);
    if (uniqueName !== normalizedName) {
      await debugConsole.log(
        `Creating collection: "${uniqueName}" (normalized: "${normalizedName}" - name conflict resolved)`,
      );
    } else {
      await debugConsole.log(`Creating collection: "${uniqueName}"`);
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
      await debugConsole.log(
        `  Stored GUID: ${guidToStore.substring(0, 8)}...`,
      );
    }

    await ensureCollectionModes(newCollection, entry.modes);
    await debugConsole.log(
      `  ✓ Created collection "${uniqueName}" with ${entry.modes.length} mode(s)`,
    );

    recognizedCollections.set(index, newCollection);
  }

  await debugConsole.log("Collection creation complete");
}

/**
 * Stage 8: Load variable table
 */
function loadVariableTable(expandedJsonData: any): {
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
async function matchAndCreateVariables(
  variableTable: VariableTable,
  collectionTable: CollectionTable,
  recognizedCollections: Map<string, VariableCollection>,
  newlyCreatedCollections: VariableCollection[],
): Promise<{
  recognizedVariables: Map<string, Variable>;
  newlyCreatedVariables: Variable[];
}> {
  const recognizedVariables = new Map<string, Variable>();
  const newlyCreatedVariables: Variable[] = [];
  const newlyCreatedCollectionIds = new Set(
    newlyCreatedCollections.map((c) => c.id),
  );

  await debugConsole.log("Matching and creating variables in collections...");

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

    const isNewlyCreatedCollection = newlyCreatedCollectionIds.has(
      collection.id,
    );

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
        if (!isNewlyCreatedCollection) {
          newlyCreatedVariables.push(newVariable);
        }
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
      if (!isNewlyCreatedCollection) {
        newlyCreatedVariables.push(newVariable);
      }
      recognizedVariables.set(index, newVariable);
      stats.created++;
    }
  }

  await debugConsole.log("Variable processing complete:");
  for (const stats of collectionStats.values()) {
    await debugConsole.log(
      `  "${stats.collectionName}": ${stats.existing} existing, ${stats.created} created`,
    );
  }

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
function normalizeStructureTypes(nodeData: any): void {
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
): Promise<Map<number, ComponentNode>> {
  const allInstances = instanceTable.getSerializedTable();
  const remoteInstances = Object.values(allInstances).filter(
    (entry: any) => entry.instanceType === "remote",
  );

  // Map of instance table index -> created component node
  const remoteComponentMap = new Map<number, ComponentNode>();

  if (remoteInstances.length === 0) {
    await debugConsole.log("No remote instances found");
    return remoteComponentMap;
  }

  await debugConsole.log(
    `Processing ${remoteInstances.length} remote instance(s)...`,
  );

  // Find or create REMOTES page
  await figma.loadAllPagesAsync();
  const allPages = figma.root.children;
  let remotesPage = allPages.find((p) => p.name === "REMOTES");

  if (!remotesPage) {
    remotesPage = figma.createPage();
    remotesPage.name = "REMOTES";
    await debugConsole.log("Created REMOTES page");
  } else {
    await debugConsole.log("Found existing REMOTES page");
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
    await debugConsole.log("Created title and description on REMOTES page");
  }

  // Process each remote instance
  const nodeIdMapping = new Map<string, any>(); // For remote instances, we don't need ID mapping

  for (const [indexStr, entry] of Object.entries(allInstances)) {
    if (entry.instanceType !== "remote") {
      continue;
    }

    const instanceIndex = parseInt(indexStr, 10);
    await debugConsole.log(
      `Processing remote instance ${instanceIndex}: "${entry.componentName}"`,
    );

    if (!entry.structure) {
      await debugConsole.warning(
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
    await debugConsole.log(
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
      await debugConsole.log(
        `Component name conflict: "${frameName}" -> "${uniqueComponentName}"`,
      );
    }

    // Create a component from the structure
    // The structure should be a COMPONENT node, so we'll recreate it as a component
    try {
      // Check if the structure type is COMPONENT
      // Type should already be normalized above, but double-check
      if (entry.structure.type !== "COMPONENT") {
        await debugConsole.warning(
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
        );
        if (recreatedNode) {
          containerFrame.appendChild(recreatedNode);
          remotesPage.appendChild(containerFrame);
          await debugConsole.log(
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
      await debugConsole.log(
        `  Created component node: "${uniqueComponentName}"`,
      );

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
                await debugConsole.warning(
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
              await debugConsole.warning(
                `  Failed to add component property "${propName}" to "${entry.componentName}": ${error}`,
              );
              failedCount++;
            }
          }

          if (addedCount > 0) {
            await debugConsole.log(
              `  Added ${addedCount} component property definition(s) to "${entry.componentName}"${failedCount > 0 ? ` (${failedCount} failed)` : ""}`,
            );
          }
        }

        // Apply basic properties
        if (entry.structure.name !== undefined) {
          componentNode.name = entry.structure.name;
        }
        if (
          entry.structure.width !== undefined &&
          entry.structure.height !== undefined
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
        if (entry.structure.visible !== undefined) {
          componentNode.visible = entry.structure.visible;
        }
        if (entry.structure.opacity !== undefined) {
          componentNode.opacity = entry.structure.opacity;
        }
        if (entry.structure.rotation !== undefined) {
          componentNode.rotation = entry.structure.rotation;
        }
        if (entry.structure.blendMode !== undefined) {
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
              );
            }
          } catch (error) {
            await debugConsole.warning(
              `Error setting fills for remote component "${entry.componentName}": ${error}`,
            );
          }
        }

        // Apply strokes
        if (entry.structure.strokes !== undefined) {
          try {
            componentNode.strokes = entry.structure.strokes;
          } catch (error) {
            await debugConsole.warning(
              `Error setting strokes for remote component "${entry.componentName}": ${error}`,
            );
          }
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
        if (entry.structure.paddingLeft !== undefined) {
          componentNode.paddingLeft = entry.structure.paddingLeft;
        }
        if (entry.structure.paddingRight !== undefined) {
          componentNode.paddingRight = entry.structure.paddingRight;
        }
        if (entry.structure.paddingTop !== undefined) {
          componentNode.paddingTop = entry.structure.paddingTop;
        }
        if (entry.structure.paddingBottom !== undefined) {
          componentNode.paddingBottom = entry.structure.paddingBottom;
        }
        if (entry.structure.itemSpacing !== undefined) {
          componentNode.itemSpacing = entry.structure.itemSpacing;
        }
        if (entry.structure.cornerRadius !== undefined) {
          componentNode.cornerRadius = entry.structure.cornerRadius;
        }

        // Recreate children
        // Handle both "child" (compressed) and "children" (expanded) keys
        // Debug: Log structure keys before accessing children
        await debugConsole.log(
          `  DEBUG: Structure keys: ${Object.keys(entry.structure).join(", ")}, has children: ${!!entry.structure.children}, has child: ${!!entry.structure.child}`,
        );
        const childrenArray =
          entry.structure.children ||
          (entry.structure.child ? entry.structure.child : null);
        await debugConsole.log(
          `  DEBUG: childrenArray exists: ${!!childrenArray}, isArray: ${Array.isArray(childrenArray)}, length: ${childrenArray ? childrenArray.length : 0}`,
        );
        if (
          childrenArray &&
          Array.isArray(childrenArray) &&
          childrenArray.length > 0
        ) {
          await debugConsole.log(
            `  Recreating ${childrenArray.length} child(ren) for component "${entry.componentName}"`,
          );
          for (let i = 0; i < childrenArray.length; i++) {
            const childData = childrenArray[i];
            await debugConsole.log(
              `  DEBUG: Processing child ${i + 1}/${childrenArray.length}: ${JSON.stringify({ name: childData?.name, type: childData?.type, hasTruncated: !!childData?._truncated })}`,
            );
            if (childData._truncated) {
              await debugConsole.log(
                `  Skipping truncated child: ${childData._reason || "Unknown"}`,
              );
              continue;
            }
            await debugConsole.log(
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
            );
            if (childNode) {
              componentNode.appendChild(childNode);
              await debugConsole.log(
                `  ✓ Appended child "${childData.name || "Unnamed"}" to component "${entry.componentName}"`,
              );
            } else {
              await debugConsole.warning(
                `  ✗ Failed to create child "${childData.name || "Unnamed"}" (type: ${childData.type})`,
              );
            }
          }
        }

        remoteComponentMap.set(instanceIndex, componentNode);
        await debugConsole.log(
          `✓ Created remote component: "${uniqueComponentName}" (index ${instanceIndex})`,
        );
      } catch (error) {
        await debugConsole.warning(
          `Error populating remote component "${entry.componentName}": ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        componentNode.remove();
      }
    } catch (error) {
      await debugConsole.warning(
        `Error recreating remote instance "${entry.componentName}": ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  await debugConsole.log(
    `Remote instance processing complete: ${remoteComponentMap.size} component(s) created`,
  );

  return remoteComponentMap;
}

/**
 * Stage 11: Create page and recreate structure
 */
async function createPageAndRecreateStructure(
  metadata: { guid: string; name: string; version?: number },
  expandedJsonData: any,
  variableTable: VariableTable,
  collectionTable: CollectionTable,
  instanceTable: InstanceTable | null,
  recognizedVariables: Map<string, Variable>,
  remoteComponentMap: Map<number, ComponentNode> | null = null,
  deferredInstances: DeferredNormalInstance[] | null = null,
  isMainPage: boolean = false, // If true, always create a copy (no prompt). If false, prompt for existing pages.
): Promise<{
  success: boolean;
  page?: PageNode;
  pageId?: string; // Page ID for tracking (used when reusing existing page)
  error?: string;
  deferredInstances?: DeferredNormalInstance[];
}> {
  await debugConsole.log("Creating page from JSON...");

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
  let useExistingPage = false;
  if (pageWithSameGuid && !isMainPage) {
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

    await debugConsole.log(
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
      await debugConsole.log(
        `User chose to use existing page: "${pageWithSameGuid.name}"`,
      );
    } catch {
      // User chose "Copy" or cancelled - proceed with creating new page
      await debugConsole.log(
        `User chose to create a copy. Will create new page.`,
      );
    }
  }

  // If user chose to use existing page, return it immediately
  // Note: We skip recreating the page structure. Instances from other pages
  // that reference this page will resolve correctly by finding the page by name
  // (componentPageName) during their import process.
  if (useExistingPage && pageWithSameGuid) {
    await figma.setCurrentPageAsync(pageWithSameGuid);
    await debugConsole.log(
      `Using existing page: "${pageWithSameGuid.name}" (GUID: ${metadata.guid.substring(0, 8)}...)`,
    );
    await debugConsole.log(
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
    await debugConsole.log(
      `Found existing page with same name: "${metadata.name}". Will create new page with unique name.`,
    );
  }

  let pageName: string;
  if (pageWithSameGuid || existingPageByName) {
    const scratchBaseName = `__${metadata.name}`;
    pageName = await findUniquePageName(scratchBaseName);
    await debugConsole.log(
      `Creating scratch page: "${pageName}" (will be renamed to "${metadata.name}" on success)`,
    );
  } else {
    pageName = metadata.name;
    await debugConsole.log(`Creating page: "${pageName}"`);
  }

  const newPage = figma.createPage();
  newPage.name = pageName;

  await figma.setCurrentPageAsync(newPage);
  await debugConsole.log(`Switched to page: "${pageName}"`);

  if (!expandedJsonData.pageData) {
    return {
      success: false,
      error: "No page data found in JSON",
    };
  }

  await debugConsole.log("Recreating page structure...");
  const pageData = expandedJsonData.pageData;

  // Apply page-level properties (like backgrounds) if they exist
  // Pages have backgrounds property for background color
  if (pageData.backgrounds !== undefined) {
    try {
      newPage.backgrounds = pageData.backgrounds;
      await debugConsole.log(
        `Set page background: ${JSON.stringify(pageData.backgrounds)}`,
      );
    } catch (error) {
      await debugConsole.warning(`Failed to set page background: ${error}`);
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
  await debugConsole.log(
    `Found ${allComponentIds.length} COMPONENT node(s) in page data`,
  );
  if (allComponentIds.length > 0) {
    await debugConsole.log(
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
      );
      if (childNode) {
        newPage.appendChild(childNode);
      }
    }
  }

  await debugConsole.log("Page structure recreated successfully");

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

  if (pageName.startsWith("__")) {
    const finalName = await findUniquePageName(metadata.name);
    newPage.name = finalName;
    await debugConsole.log(`Renamed page from "${pageName}" to "${finalName}"`);
  }

  return {
    success: true,
    page: newPage,
  };
}

export async function importPage(
  data: ImportPageData,
): Promise<ResponseMessage> {
  // Only clear console if explicitly requested (default: true for single page imports)
  const shouldClearConsole = data.clearConsole !== false;
  if (shouldClearConsole) {
    await debugConsole.clear();
  }
  await debugConsole.log("=== Starting Page Import ===");

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

    // Stage 1: Validate metadata
    await debugConsole.log("Validating metadata...");
    const metadataResult = validateMetadata(jsonData);
    if (!metadataResult.success) {
      await debugConsole.error(metadataResult.error!);
      return {
        type: "importPage",
        success: false,
        error: true,
        message: metadataResult.error!,
        data: {},
      };
    }
    const metadata = metadataResult.metadata!;
    await debugConsole.log(
      `Metadata validated: guid=${metadata.guid}, name=${metadata.name}`,
    );

    // Stage 2: Load and expand JSON
    await debugConsole.log("Loading string table...");
    const jsonResult = loadAndExpandJson(jsonData);
    if (!jsonResult.success) {
      await debugConsole.error(jsonResult.error!);
      return {
        type: "importPage",
        success: false,
        error: true,
        message: jsonResult.error!,
        data: {},
      };
    }
    await debugConsole.log("String table loaded successfully");
    await debugConsole.log("Expanding JSON data...");
    const expandedJsonData = jsonResult.expandedJsonData!;
    await debugConsole.log("JSON expanded successfully");

    // Stage 3: Load collection table
    await debugConsole.log("Loading collections table...");
    const collectionTableResult = loadCollectionTable(expandedJsonData);
    if (!collectionTableResult.success) {
      if (
        collectionTableResult.error === "No collections table found in JSON"
      ) {
        await debugConsole.log(collectionTableResult.error);
        await debugConsole.log("=== Import Complete ===");
        return {
          type: "importPage",
          success: true,
          error: false,
          message: "Import complete (no collections to process)",
          data: { pageName: metadata.name },
        };
      }
      await debugConsole.error(collectionTableResult.error!);
      return {
        type: "importPage",
        success: false,
        error: true,
        message: collectionTableResult.error!,
        data: {},
      };
    }
    const collectionTable = collectionTableResult.collectionTable!;
    await debugConsole.log(
      `Loaded collections table with ${collectionTable.getSize()} collection(s)`,
    );

    // Stage 4: Match collections
    await debugConsole.log(
      "Matching collections with existing local collections...",
    );
    const { recognizedCollections, potentialMatches, collectionsToCreate } =
      await matchCollections(collectionTable);

    // Stage 5: Prompt for potential matches
    await promptForPotentialMatches(
      potentialMatches,
      recognizedCollections,
      collectionsToCreate,
    );

    // Stage 6: Ensure modes for recognized collections
    await ensureModesForRecognizedCollections(
      recognizedCollections,
      collectionTable,
      potentialMatches,
    );

    // Stage 7: Create new collections
    await createNewCollections(
      collectionsToCreate,
      recognizedCollections,
      newlyCreatedCollections,
    );

    // Stage 8: Load variable table
    await debugConsole.log("Loading variables table...");
    const variableTableResult = loadVariableTable(expandedJsonData);
    if (!variableTableResult.success) {
      if (variableTableResult.error === "No variables table found in JSON") {
        await debugConsole.log(variableTableResult.error);
        await debugConsole.log("=== Import Complete ===");
        return {
          type: "importPage",
          success: true,
          error: false,
          message: "Import complete (no variables to process)",
          data: { pageName: metadata.name },
        };
      }
      await debugConsole.error(variableTableResult.error!);
      return {
        type: "importPage",
        success: false,
        error: true,
        message: variableTableResult.error!,
        data: {},
      };
    }
    const variableTable = variableTableResult.variableTable!;
    await debugConsole.log(
      `Loaded variables table with ${variableTable.getSize()} variable(s)`,
    );

    // Stage 9: Match and create variables
    const { recognizedVariables, newlyCreatedVariables } =
      await matchAndCreateVariables(
        variableTable,
        collectionTable,
        recognizedCollections,
        newlyCreatedCollections,
      );

    // Stage 10: Load instance table
    await debugConsole.log("Loading instance table...");
    const instanceTable = loadInstanceTable(expandedJsonData);
    if (instanceTable) {
      const allInstances = instanceTable.getSerializedTable();
      const internalInstances = Object.values(allInstances).filter(
        (entry: any) => entry.instanceType === "internal",
      );
      const remoteInstances = Object.values(allInstances).filter(
        (entry: any) => entry.instanceType === "remote",
      );
      await debugConsole.log(
        `Loaded instance table with ${instanceTable.getSize()} instance(s) (${internalInstances.length} internal, ${remoteInstances.length} remote)`,
      );
    } else {
      await debugConsole.log("No instance table found in JSON");
    }

    // Stage 10.5: Create remote instances on REMOTES page
    let remoteComponentMap: Map<number, ComponentNode> | null = null;
    if (instanceTable) {
      remoteComponentMap = await createRemoteInstances(
        instanceTable,
        variableTable,
        collectionTable,
        recognizedVariables,
      );
    }

    // Stage 11: Create page and recreate structure
    const deferredInstances: DeferredNormalInstance[] = [];
    const isMainPage = data.isMainPage ?? true; // Default to true for single page imports
    const pageResult = await createPageAndRecreateStructure(
      metadata,
      expandedJsonData,
      variableTable,
      collectionTable,
      instanceTable,
      recognizedVariables,
      remoteComponentMap,
      deferredInstances,
      isMainPage,
    );

    if (!pageResult.success) {
      await debugConsole.error(pageResult.error!);
      return {
        type: "importPage",
        success: false,
        error: true,
        message: pageResult.error!,
        data: {},
      };
    }

    const newPage = pageResult.page!;
    const totalVariables =
      recognizedVariables.size + newlyCreatedVariables.length;

    const deferredCount = deferredInstances.length;
    await debugConsole.log("=== Import Complete ===");
    await debugConsole.log(
      `Successfully processed ${recognizedCollections.size} collection(s), ${totalVariables} variable(s), and created page "${newPage.name}"${deferredCount > 0 ? ` (${deferredCount} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`,
    );

    // Include pageId in response (either from pageResult.pageId for reused pages, or newPage.id for new pages)
    const pageId = pageResult.pageId || newPage.id;

    return {
      type: "importPage",
      success: true,
      error: false,
      message: "Import completed successfully",
      data: {
        pageName: newPage.name,
        pageId: pageId, // Include pageId for tracking (used for both new and reused pages)
        deferredInstances: deferredCount > 0 ? deferredInstances : undefined,
        createdEntities: {
          pageIds: [newPage.id],
          collectionIds: newlyCreatedCollections.map((c) => c.id),
          variableIds: newlyCreatedVariables.map((v) => v.id),
        },
      },
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

/**
 * Resolves deferred normal instances after all pages have been imported
 * This handles circular references by resolving instances once all components are available
 */
export async function resolveDeferredNormalInstances(
  deferredInstances: DeferredNormalInstance[],
): Promise<{
  resolved: number;
  failed: number;
  errors: string[];
}> {
  if (deferredInstances.length === 0) {
    return { resolved: 0, failed: 0, errors: [] };
  }

  await debugConsole.log(
    `=== Resolving ${deferredInstances.length} deferred normal instance(s) ===`,
  );

  let resolved = 0;
  let failed = 0;
  const errors: string[] = [];

  await figma.loadAllPagesAsync();

  for (const deferred of deferredInstances) {
    try {
      const { placeholderFrame, instanceEntry, nodeData, parentNode } =
        deferred;

      // Find the referenced page
      const referencedPage = figma.root.children.find(
        (page) => page.name === instanceEntry.componentPageName,
      );

      if (!referencedPage) {
        const error = `Deferred instance "${nodeData.name}" still cannot find referenced page "${instanceEntry.componentPageName}"`;
        await debugConsole.error(error);
        errors.push(error);
        failed++;
        continue;
      }

      // Helper function to find component by path and name (reuse from recreateNodeFromData)
      const findComponentByPath = (
        parent: any,
        path: string[],
        componentName: string,
        componentGuid?: string,
      ): ComponentNode | null => {
        if (path.length === 0) {
          let nameMatch: ComponentNode | null = null;

          for (const child of parent.children || []) {
            if (child.type === "COMPONENT") {
              if (child.name === componentName) {
                if (!nameMatch) {
                  nameMatch = child;
                }
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
                    // Continue searching
                  }
                } else {
                  return child;
                }
              }
            } else if (child.type === "COMPONENT_SET") {
              for (const variant of child.children || []) {
                if (
                  variant.type === "COMPONENT" &&
                  variant.name === componentName
                ) {
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
                      // Continue searching
                    }
                  } else {
                    return variant;
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
        for (const child of parent.children || []) {
          if (child.name === firstSegment) {
            return findComponentByPath(
              child,
              remainingPath,
              componentName,
              componentGuid,
            );
          }
        }
        return null;
      };

      const targetComponent = findComponentByPath(
        referencedPage,
        instanceEntry.path || [],
        instanceEntry.componentName,
        instanceEntry.componentGuid,
      );

      if (!targetComponent) {
        const pathDisplay =
          instanceEntry.path && instanceEntry.path.length > 0
            ? ` at path [${instanceEntry.path.join(" → ")}]`
            : " at page root";
        const error = `Deferred instance "${nodeData.name}" still cannot find component "${instanceEntry.componentName}" on page "${instanceEntry.componentPageName}"${pathDisplay}`;
        await debugConsole.error(error);
        errors.push(error);
        failed++;
        continue;
      }

      // Create the actual instance
      const instanceNode = targetComponent.createInstance();
      instanceNode.name =
        nodeData.name ||
        placeholderFrame.name.replace("[Deferred: ", "").replace("]", "");

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
            const componentProperties =
              mainComponent.componentPropertyDefinitions;
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
        } catch (error) {
          await debugConsole.warning(
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
            const componentProperties =
              mainComponent.componentPropertyDefinitions;

            for (const [propName, propValue] of Object.entries(
              instanceEntry.componentProperties,
            )) {
              const cleanPropName = propName.split("#")[0];
              if (componentProperties[cleanPropName]) {
                try {
                  instanceNode.setProperties({
                    [cleanPropName]: propValue as string | boolean,
                  });
                } catch (error) {
                  await debugConsole.warning(
                    `Failed to set component property "${cleanPropName}" for resolved instance "${nodeData.name}": ${error}`,
                  );
                }
              }
            }
          }
        } catch (error) {
          await debugConsole.warning(
            `Failed to set component properties for resolved instance "${nodeData.name}": ${error}`,
          );
        }
      }

      // Replace placeholder with actual instance
      const placeholderIndex = parentNode.children.indexOf(placeholderFrame);
      parentNode.insertChild(placeholderIndex, instanceNode);
      placeholderFrame.remove();

      await debugConsole.log(
        `  ✓ Resolved deferred instance "${nodeData.name}" from component "${instanceEntry.componentName}" on page "${instanceEntry.componentPageName}"`,
      );
      resolved++;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const fullError = `Failed to resolve deferred instance "${deferred.nodeData.name}": ${errorMessage}`;
      await debugConsole.error(fullError);
      errors.push(fullError);
      failed++;
    }
  }

  await debugConsole.log(
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
 * Cleans up created entities (pages, collections, variables) by their IDs
 * Used when import fails to remove partially created entities
 */
export async function cleanupCreatedEntities(
  data: CleanupCreatedEntitiesData,
): Promise<ResponseMessage> {
  await debugConsole.log("=== Cleaning up created entities ===");

  try {
    const { pageIds, collectionIds, variableIds } = data;

    // Delete variables first (before collections)
    let deletedVariables = 0;
    for (const variableId of variableIds) {
      try {
        const variable = figma.variables.getVariableById(variableId);
        if (variable) {
          // Check if variable's collection is in our list to be deleted
          // If so, we don't need to delete it explicitly (it will be deleted with the collection)
          const collectionId = variable.variableCollectionId;
          if (!collectionIds.includes(collectionId)) {
            variable.remove();
            deletedVariables++;
          }
        }
      } catch (error) {
        await debugConsole.warning(
          `Could not delete variable ${variableId.substring(0, 8)}...: ${error}`,
        );
      }
    }

    // Delete collections (this will also delete variables in those collections)
    let deletedCollections = 0;
    for (const collectionId of collectionIds) {
      try {
        const collection =
          figma.variables.getVariableCollectionById(collectionId);
        if (collection) {
          collection.remove();
          deletedCollections++;
        }
      } catch (error) {
        await debugConsole.warning(
          `Could not delete collection ${collectionId.substring(0, 8)}...: ${error}`,
        );
      }
    }

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
        await debugConsole.warning(
          `Could not delete page ${pageId.substring(0, 8)}...: ${error}`,
        );
      }
    }

    await debugConsole.log(
      `Cleanup complete: Deleted ${deletedPages} page(s), ${deletedCollections} collection(s), ${deletedVariables} variable(s)`,
    );

    return {
      type: "cleanupCreatedEntities",
      success: true,
      error: false,
      message: "Cleanup completed successfully",
      data: {
        deletedPages,
        deletedCollections,
        deletedVariables,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    await debugConsole.error(`Cleanup failed: ${errorMessage}`);
    return {
      type: "cleanupCreatedEntities",
      success: false,
      error: true,
      message: errorMessage,
      data: {},
    };
  }
}
