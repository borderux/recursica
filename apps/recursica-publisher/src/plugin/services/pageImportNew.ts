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
}

export interface ImportPageResponseData {
  pageName: string;
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

        // Try to set component property definitions immediately after creation
        // The API documentation says they're read-only, but let's try anyway
        if (nodeData.componentPropertyDefinitions) {
          try {
            // Try direct assignment first (might work immediately after creation)
            (newNode as any).componentPropertyDefinitions =
              nodeData.componentPropertyDefinitions;
            await debugConsole.log(
              `  Set component property definitions for "${nodeData.name || "Unnamed"}" via direct assignment`,
            );
          } catch {
            try {
              // Try using setProperties (might work for component definitions)
              (newNode as any).setProperties(
                nodeData.componentPropertyDefinitions,
              );
              await debugConsole.log(
                `  Set component property definitions for "${nodeData.name || "Unnamed"}" via setProperties`,
              );
            } catch {
              // Both methods failed - property definitions cannot be set
              await debugConsole.warning(
                `  Component "${nodeData.name || "Unnamed"}" has property definitions in JSON, but they cannot be recreated via API. Instances may not be able to set variant properties.`,
              );
            }
          }
        }
      }
      break;
    case "COMPONENT_SET": {
      // COMPONENT_SET cannot be created via API, so we convert it to a frame
      // and import its children (the component variants) as components
      const childCount = nodeData.children ? nodeData.children.length : 0;
      const componentChildren = nodeData.children
        ? nodeData.children.filter((c: any) => c.type === "COMPONENT").length
        : 0;
      await debugConsole.log(
        `Converting COMPONENT_SET "${nodeData.name || "Unnamed"}" to frame (COMPONENT_SET cannot be created via API). Has ${childCount} children (${componentChildren} COMPONENT children)`,
      );
      if (nodeData.children && Array.isArray(nodeData.children)) {
        for (const child of nodeData.children) {
          if (child.type === "COMPONENT" && child.id) {
            await debugConsole.log(
              `  COMPONENT child: "${child.name || "Unnamed"}" (ID: ${child.id.substring(0, 8)}...)`,
            );
          }
        }
      }
      newNode = figma.createFrame();
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
                        if (componentProperties[propName]) {
                          validProperties[propName] = propValue as string;
                        } else {
                          await debugConsole.warning(
                            `Skipping variant property "${propName}" for internal instance "${nodeData.name}" - property does not exist on recreated component`,
                          );
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
                        if (componentProperties[propName]) {
                          try {
                            newNode.setProperties({ [propName]: propValue });
                          } catch (error) {
                            const errorMessage = `Failed to set component property "${propName}" for internal instance "${nodeData.name}": ${error}`;
                            await debugConsole.error(errorMessage);
                            throw new Error(errorMessage);
                          }
                        } else {
                          await debugConsole.warning(
                            `Skipping component property "${propName}" for internal instance "${nodeData.name}" - property does not exist on recreated component`,
                          );
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
                      if (componentProperties[propName]) {
                        validProperties[propName] = propValue as string;
                      } else {
                        await debugConsole.warning(
                          `Skipping variant property "${propName}" for remote instance "${nodeData.name}" - property does not exist on recreated component`,
                        );
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
                      if (componentProperties[propName]) {
                        try {
                          newNode.setProperties({ [propName]: propValue });
                        } catch (error) {
                          const errorMessage = `Failed to set component property "${propName}" for remote instance "${nodeData.name}": ${error}`;
                          await debugConsole.error(errorMessage);
                          throw new Error(errorMessage);
                        }
                      } else {
                        await debugConsole.warning(
                          `Skipping component property "${propName}" for remote instance "${nodeData.name}" - property does not exist on recreated component`,
                        );
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
        } else {
          // Normal instances are not yet implemented - this is expected for now
          if (instanceEntry?.instanceType === "normal") {
            await debugConsole.log(
              `Instance "${nodeData.name}" is a normal instance (not yet implemented), creating frame fallback`,
            );
            newNode = figma.createFrame();
          } else {
            // Unknown instance type or missing entry - this is an error
            const errorMessage = `Instance "${nodeData.name}" has unknown or missing instance type: ${instanceEntry?.instanceType || "unknown"}`;
            await debugConsole.error(errorMessage);
            throw new Error(errorMessage);
          }
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
    if (nodeData.dashPattern !== undefined && nodeData.dashPattern.length > 0) {
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

        // Try to set component property definitions immediately after creation
        // The API documentation says they're read-only, but let's try anyway
        if (componentData.componentPropertyDefinitions) {
          try {
            // Try direct assignment first (might work immediately after creation)
            (componentNode as any).componentPropertyDefinitions =
              componentData.componentPropertyDefinitions;
            await debugConsole.log(
              `  Set component property definitions for "${componentData.name || "Unnamed"}" via direct assignment in first pass`,
            );
          } catch {
            try {
              // Try using setProperties (might work for component definitions)
              (componentNode as any).setProperties(
                componentData.componentPropertyDefinitions,
              );
              await debugConsole.log(
                `  Set component property definitions for "${componentData.name || "Unnamed"}" via setProperties in first pass`,
              );
            } catch {
              // Both methods failed - property definitions cannot be set
              await debugConsole.warning(
                `  Component "${componentData.name || "Unnamed"}" has property definitions in JSON, but they cannot be recreated via API. Instances may not be able to set variant properties.`,
              );
            }
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
function loadAndExpandJson(jsonData: any): {
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

    await debugConsole.log(
      `  Structure type: ${entry.structure.type || "unknown"}, has children: ${entry.structure.children ? entry.structure.children.length : 0}`,
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
        if (
          entry.structure.children &&
          Array.isArray(entry.structure.children)
        ) {
          await debugConsole.log(
            `  Recreating ${entry.structure.children.length} child(ren) for component "${entry.componentName}"`,
          );
          for (const childData of entry.structure.children) {
            if (childData._truncated) {
              await debugConsole.log(
                `  Skipping truncated child: ${childData._reason || "Unknown"}`,
              );
              continue;
            }
            const childNode = await recreateNodeFromData(
              childData,
              componentNode,
              variableTable,
              collectionTable,
              null,
              recognizedVariables,
              nodeIdMapping,
              true, // isRemoteStructure: true
            );
            if (childNode) {
              componentNode.appendChild(childNode);
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
): Promise<{
  success: boolean;
  page?: PageNode;
  error?: string;
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

  if (pageWithSameGuid) {
    await debugConsole.log(
      `Found existing page with same GUID: "${pageWithSameGuid.name}". Will create new page to avoid overwriting.`,
    );
  }

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
        remoteComponentMap, // Pass the remote component map
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
  await debugConsole.clear();
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
    const pageResult = await createPageAndRecreateStructure(
      metadata,
      expandedJsonData,
      variableTable,
      collectionTable,
      instanceTable,
      recognizedVariables,
      remoteComponentMap,
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

    await debugConsole.log("=== Import Complete ===");
    await debugConsole.log(
      `Successfully processed ${recognizedCollections.size} collection(s), ${totalVariables} variable(s), and created page "${newPage.name}"`,
    );

    return {
      type: "importPage",
      success: true,
      error: false,
      message: "Import completed successfully",
      data: {
        pageName: newPage.name,
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
