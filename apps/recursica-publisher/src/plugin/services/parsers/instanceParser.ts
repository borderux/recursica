/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ParsedNodeData, ParserContext } from "./baseNodeParser";

/**
 * Builds a file-path-like string by traversing up the parent chain
 * from an instance node. Stops at the top (PAGE node or null parent).
 * @param node - The instance node to start from
 * @returns A path string with parent names joined by "/" (e.g., "Frame1/Frame2/Container")
 */
function buildParentPath(node: any): string {
  const pathParts: string[] = [];
  let current: any = node.parent;

  // Traverse up the parent chain
  // Wrap in try-catch to handle cases where parent access might fail
  // (e.g., with dynamic-page documentAccess, some properties require async access)
  try {
    while (current) {
      // Safely check type and parent
      let nodeType: string | undefined;
      let nodeName: string | undefined;
      let nextParent: any;

      try {
        nodeType = current.type;
        nodeName = current.name;
        nextParent = current.parent;
      } catch (error) {
        // If we can't access properties, stop traversal
        console.log(
          "Error accessing parent node properties in buildParentPath:",
          error,
        );
        break;
      }

      // Stop at PAGE node or if parent is null/undefined
      if (nodeType === "PAGE" || !nextParent) {
        break;
      }

      // Only include non-empty names
      if (nodeName && nodeName.trim() !== "") {
        pathParts.unshift(nodeName); // Add to beginning to build path top-down
      }

      current = nextParent;
    }
  } catch (error) {
    // If traversal fails completely, return what we have so far
    console.log("Error during parent path traversal:", error);
  }

  return pathParts.join("/");
}

/**
 * Parser for INSTANCE node type
 * Handles mainComponent reference serialization
 */
export async function parseInstanceProperties(
  node: any,
  _context: ParserContext,
): Promise<Partial<ParsedNodeData>> {
  const result: Partial<ParsedNodeData> = {};
  const handledKeys = new Set<string>();

  // Mark as instance
  result._isInstance = true;
  handledKeys.add("_isInstance");

  // Handle main component reference
  if (
    node.type === "INSTANCE" &&
    typeof node.getMainComponentAsync === "function"
  ) {
    try {
      const mainComponent = await node.getMainComponentAsync();
      if (mainComponent) {
        // Collect debug information to include in JSON
        const debugInfo: any = {};
        try {
          // Instance node info (for comparison)
          debugInfo.instanceNodeName = node.name;
          debugInfo.instanceNodeId = node.id;
          debugInfo.instanceNodeType = node.type;

          // Basic component info
          debugInfo.componentName = mainComponent.name;
          debugInfo.componentType = mainComponent.type;
          debugInfo.componentId = mainComponent.id;

          // Safely get properties
          try {
            debugInfo.componentKey = (mainComponent as any).key;
          } catch (e) {
            debugInfo.componentKey = "(cannot access)";
          }

          try {
            debugInfo.componentRemote = (mainComponent as any).remote;
          } catch (e) {
            debugInfo.componentRemote = "(cannot access)";
          }

          // Get all property names (this should be safe, just getting names)
          let allProps: string[] = [];
          try {
            allProps = Object.getOwnPropertyNames(mainComponent);
            debugInfo.ownProperties = allProps;
          } catch (e) {
            debugInfo.ownProperties = "(cannot access)";
          }

          // Get all property names from prototype chain
          const protoProps: string[] = [];
          try {
            let proto = Object.getPrototypeOf(mainComponent);
            while (proto && proto !== Object.prototype) {
              protoProps.push(
                ...Object.getOwnPropertyNames(proto).filter(
                  (p) => !protoProps.includes(p),
                ),
              );
              proto = Object.getPrototypeOf(proto);
            }
            debugInfo.prototypeProperties = protoProps;
          } catch (e) {
            debugInfo.prototypeProperties = "(cannot access)";
          }

          // Get all enumerable properties
          let enumerableProps: string[] = [];
          try {
            enumerableProps = Object.keys(mainComponent);
            debugInfo.enumerableProperties = enumerableProps;
          } catch (e) {
            debugInfo.enumerableProperties = "(cannot access)";
          }

          // Try to get all methods (functions) - be careful not to access properties
          const methods: string[] = [];
          try {
            for (const prop of [...allProps, ...protoProps]) {
              // Skip properties that might trigger async access
              if (
                prop === "instances" ||
                prop === "children" ||
                prop === "parent"
              ) {
                continue;
              }
              try {
                if (typeof (mainComponent as any)[prop] === "function") {
                  methods.push(prop);
                }
              } catch (e) {
                // Skip if accessing this property causes an error
              }
            }
            debugInfo.availableMethods = methods;
          } catch (e) {
            debugInfo.availableMethods = "(cannot access)";
          }

          // Check for library-related properties specifically
          const libraryProps: string[] = [];
          try {
            for (const prop of [...allProps, ...protoProps]) {
              if (
                prop.toLowerCase().includes("library") ||
                prop.toLowerCase().includes("remote") ||
                prop.toLowerCase().includes("file")
              ) {
                libraryProps.push(prop);
              }
            }
            debugInfo.libraryRelatedProperties = libraryProps;
          } catch (e) {
            debugInfo.libraryRelatedProperties = "(cannot access)";
          }

          // Try to inspect some specific properties
          try {
            if ((mainComponent as any).remote !== undefined) {
              debugInfo.remoteValue = (mainComponent as any).remote;
            }
          } catch (e) {
            // Skip
          }

          try {
            if ((mainComponent as any).libraryName !== undefined) {
              debugInfo.libraryNameValue = (mainComponent as any).libraryName;
            }
          } catch (e) {
            // Skip
          }

          try {
            if ((mainComponent as any).libraryKey !== undefined) {
              debugInfo.libraryKeyValue = (mainComponent as any).libraryKey;
            }
          } catch (e) {
            // Skip
          }

          // Check if mainComponent has parent access
          try {
            if ((mainComponent as any).parent !== undefined) {
              const parent = (mainComponent as any).parent;
              if (parent) {
                debugInfo.mainComponentHasParent = true;
                try {
                  debugInfo.mainComponentParentType = parent.type;
                  debugInfo.mainComponentParentName = parent.name;
                  debugInfo.mainComponentParentId = parent.id;
                } catch (e) {
                  debugInfo.mainComponentParentAccessError = String(e);
                }
              } else {
                debugInfo.mainComponentHasParent = false;
              }
            } else {
              debugInfo.mainComponentParentUndefined = true;
            }
          } catch (e) {
            debugInfo.mainComponentParentCheckError = String(e);
          }

          // Check variant properties on mainComponent itself
          try {
            if ((mainComponent as any).variantProperties !== undefined) {
              debugInfo.mainComponentVariantProperties = (
                mainComponent as any
              ).variantProperties;
            }
          } catch (e) {
            // Skip
          }

          // Check component property definitions on mainComponent
          try {
            if (
              (mainComponent as any).componentPropertyDefinitions !== undefined
            ) {
              debugInfo.mainComponentPropertyDefinitions = Object.keys(
                (mainComponent as any).componentPropertyDefinitions,
              );
            }
          } catch (e) {
            // Skip
          }
        } catch (debugError) {
          debugInfo.debugError = String(debugError);
        }

        // Extract variant properties and component properties from the instance node
        // Store these temporarily since result.mainComponent doesn't exist yet
        let instanceVariantProperties: any = undefined;
        let instanceComponentProperties: any = undefined;
        try {
          // Variant properties (e.g., { Style: "outline" })
          if ((node as any).variantProperties) {
            instanceVariantProperties = (node as any).variantProperties;
            debugInfo.instanceVariantProperties = instanceVariantProperties;
          }

          // Component properties (instance-specific property values)
          if ((node as any).componentProperties) {
            instanceComponentProperties = (node as any).componentProperties;
            debugInfo.instanceComponentProperties = instanceComponentProperties;
          }
        } catch (propError) {
          debugInfo.propertiesError = String(propError);
        }

        // Build the full parent path from mainComponent (within the library file)
        // This will show the path within the team library where the component lives
        let mainComponentParentPath: string | undefined;
        let componentSetName: string | undefined;
        const mainComponentParentChain: string[] = [];

        try {
          let current: any = mainComponent.parent;
          const pathParts: string[] = [];
          let depth = 0;
          const maxDepth = 20; // Safety limit

          // Debug: Check if mainComponent.parent exists and what it is
          if (current) {
            try {
              debugInfo.mainComponentParentExists = true;
              debugInfo.mainComponentParentType = current.type;
              debugInfo.mainComponentParentName = current.name;
              debugInfo.mainComponentParentId = current.id;

              // Try to check if parent property exists on COMPONENT_SET
              if (current.type === "COMPONENT_SET") {
                try {
                  const parentProp = current.parent;
                  if (parentProp === null) {
                    debugInfo.componentSetParentIsNull = true;
                  } else if (parentProp === undefined) {
                    debugInfo.componentSetParentIsUndefined = true;
                  } else {
                    debugInfo.componentSetParentExists = true;
                    try {
                      debugInfo.componentSetParentType = parentProp.type;
                      debugInfo.componentSetParentName = parentProp.name;
                    } catch (e) {
                      debugInfo.componentSetParentPropertyAccessError =
                        String(e);
                    }
                  }
                } catch (parentCheckError) {
                  debugInfo.componentSetParentCheckError =
                    String(parentCheckError);
                }
              }
            } catch (parentDebugError) {
              debugInfo.mainComponentParentDebugError =
                String(parentDebugError);
            }
          } else {
            debugInfo.mainComponentParentExists = false;
          }

          while (current && depth < maxDepth) {
            try {
              const nodeType = current.type;
              const nodeName = current.name;

              // Record the full chain for debugging
              mainComponentParentChain.push(
                `${nodeType}:${nodeName || "(unnamed)"}`,
              );

              // If we find a COMPONENT_SET, record it but continue traversing
              if (nodeType === "COMPONENT_SET" && !componentSetName) {
                componentSetName = nodeName;
                debugInfo.componentSetName = nodeName;
                debugInfo.componentSetFound = true;
              }

              // Build path by collecting parent names (excluding PAGE)
              // Stop at PAGE, but include everything up to it
              if (nodeType === "PAGE") {
                // Don't include PAGE in the path, but stop here
                break;
              }

              // Only include non-empty names in the path
              if (nodeName && nodeName.trim() !== "") {
                pathParts.unshift(nodeName); // Add to beginning to build path top-down
              }

              // Try to access the next parent level with detailed error checking
              let nextParent: any;
              let parentAccessAttempted = false;
              try {
                // Check if parent property exists on the object
                if ("parent" in current) {
                  parentAccessAttempted = true;
                  debugInfo[`hasParentPropertyAtDepth${depth}`] = true;
                  nextParent = current.parent;

                  // Check what type of value we got
                  if (nextParent === null) {
                    debugInfo[`parentIsNullAtDepth${depth}`] = true;
                  } else if (nextParent === undefined) {
                    debugInfo[`parentIsUndefinedAtDepth${depth}`] = true;
                  } else {
                    debugInfo[`parentExistsAtDepth${depth}`] = true;
                  }
                } else {
                  debugInfo[`noParentPropertyAtDepth${depth}`] = true;
                }
              } catch (parentAccessError) {
                // For remote components, accessing parent might fail
                debugInfo.parentAccessErrorAtDepth = depth;
                debugInfo.parentAccessError = String(parentAccessError);
                debugInfo.parentAccessErrorName =
                  parentAccessError instanceof Error
                    ? parentAccessError.name
                    : "Unknown";
                debugInfo.parentAccessErrorMessage =
                  parentAccessError instanceof Error
                    ? parentAccessError.message
                    : String(parentAccessError);
                break;
              }

              // Stop if no parent (null or undefined)
              if (!nextParent) {
                debugInfo.noParentAtDepth = depth;
                debugInfo.parentAccessAttemptedAtDepth = parentAccessAttempted;
                break;
              }

              // Check if we can access properties of the next parent
              try {
                const nextType = nextParent.type;
                const nextName = nextParent.name;
                debugInfo[`parentAtDepth${depth + 1}Type`] = nextType;
                debugInfo[`parentAtDepth${depth + 1}Name`] = nextName;
              } catch (nextParentAccessError) {
                debugInfo.nextParentAccessErrorAtDepth = depth;
                debugInfo.nextParentAccessError = String(nextParentAccessError);
                // Still try to continue, but log the error
              }

              current = nextParent;
              depth++;
            } catch (traverseError) {
              debugInfo.parentTraverseErrorAtDepth = depth;
              debugInfo.parentTraverseError = String(traverseError);
              debugInfo.parentTraverseErrorName =
                traverseError instanceof Error ? traverseError.name : "Unknown";
              debugInfo.parentTraverseErrorMessage =
                traverseError instanceof Error
                  ? traverseError.message
                  : String(traverseError);
              break;
            }
          }

          // Join the path parts
          mainComponentParentPath = pathParts.join("/");

          debugInfo.mainComponentParentChain = mainComponentParentChain;
          debugInfo.mainComponentParentChainDepth = depth;
          debugInfo.mainComponentParentPath = mainComponentParentPath;
          debugInfo.mainComponentParentPathParts = pathParts;
        } catch (pathError) {
          debugInfo.mainComponentParentPathError = String(pathError);
        }

        // Build parent path for the instance node (within the current file)
        // This is separate from the mainComponent path
        const instanceParentPath = buildParentPath(node);
        debugInfo.instanceParentPath = instanceParentPath;

        // Only store basic identifying information, not the full component
        result.mainComponent = {
          id: mainComponent.id,
          name: mainComponent.name,
          key: (mainComponent as any).key, // Component key for reference
          type: mainComponent.type,
        };

        // Add component set name if found (this is the actual component name)
        if (componentSetName) {
          (result.mainComponent as any).componentSetName = componentSetName;
        }

        // Add variant properties if found
        if (instanceVariantProperties) {
          (result.mainComponent as any).variantProperties =
            instanceVariantProperties;
        }

        // Add component properties if found
        if (instanceComponentProperties) {
          (result.mainComponent as any).componentProperties =
            instanceComponentProperties;
        }

        // Add the mainComponent's parent path (path within the library file)
        // This shows where the component lives in the team library
        if (mainComponentParentPath) {
          (result.mainComponent as any)._path = mainComponentParentPath;
        }

        // Also add the instance's parent path separately for reference
        if (instanceParentPath) {
          (result.mainComponent as any)._instancePath = instanceParentPath;
        }

        // Check if component is from a remote library (different file)
        const isRemote = (mainComponent as any).remote === true;
        if (isRemote) {
          (result.mainComponent as any).remote = true;

          // Try to get library/file name and key information
          try {
            // Method 1: Try getPublishStatusAsync which might contain library info
            if (
              typeof (mainComponent as any).getPublishStatusAsync === "function"
            ) {
              try {
                const publishStatus = await (
                  mainComponent as any
                ).getPublishStatusAsync();
                if (publishStatus) {
                  // Store publish status in debug info
                  debugInfo.publishStatus = publishStatus;

                  // Check if publishStatus has library information
                  if (publishStatus && typeof publishStatus === "object") {
                    // Try to extract library name/key from publishStatus
                    if ((publishStatus as any).libraryName) {
                      (result.mainComponent as any).libraryName = (
                        publishStatus as any
                      ).libraryName;
                    }
                    if ((publishStatus as any).libraryKey) {
                      (result.mainComponent as any).libraryKey = (
                        publishStatus as any
                      ).libraryKey;
                    }
                    if ((publishStatus as any).fileKey) {
                      (result.mainComponent as any).fileKey = (
                        publishStatus as any
                      ).fileKey;
                    }
                    // Collect library-related properties from publishStatus
                    const libraryRelatedFromPublish: Record<string, any> = {};
                    Object.keys(publishStatus).forEach((key) => {
                      if (
                        key.toLowerCase().includes("library") ||
                        key.toLowerCase().includes("file")
                      ) {
                        libraryRelatedFromPublish[key] = (publishStatus as any)[
                          key
                        ];
                      }
                    });
                    if (Object.keys(libraryRelatedFromPublish).length > 0) {
                      debugInfo.libraryRelatedFromPublishStatus =
                        libraryRelatedFromPublish;
                    }
                  }
                }
              } catch (publishError) {
                // getPublishStatusAsync might not be available or might fail
                debugInfo.publishStatusError = String(publishError);
              }
            }

            // Method 2: Try to search team libraries for component sets
            // Note: This API might not exist, but we'll try it
            try {
              // Check if there's a method to get available library component sets
              const teamLibraryApi = figma.teamLibrary as any;
              const availableMethods = Object.getOwnPropertyNames(
                teamLibraryApi,
              ).filter((prop) => typeof teamLibraryApi[prop] === "function");
              debugInfo.teamLibraryAvailableMethods = availableMethods;

              if (
                typeof teamLibraryApi?.getAvailableLibraryComponentSetsAsync ===
                "function"
              ) {
                const componentSets =
                  await teamLibraryApi.getAvailableLibraryComponentSetsAsync();
                debugInfo.availableComponentSetsCount =
                  componentSets?.length || 0;
                if (componentSets && Array.isArray(componentSets)) {
                  const componentSetsInfo: any[] = [];
                  // Try to find which library contains this component
                  for (const componentSet of componentSets) {
                    try {
                      const componentSetInfo: any = {
                        name: componentSet.name,
                        key: componentSet.key,
                        libraryName: componentSet.libraryName,
                        libraryKey: componentSet.libraryKey,
                      };
                      componentSetsInfo.push(componentSetInfo);

                      // Check if this component set's key matches our component's key
                      // or if we can find the component in this set
                      if (
                        componentSet.key === (mainComponent as any).key ||
                        componentSet.name === mainComponent.name
                      ) {
                        debugInfo.matchingComponentSet = componentSetInfo;
                        if (componentSet.libraryName) {
                          (result.mainComponent as any).libraryName =
                            componentSet.libraryName;
                        }
                        if (componentSet.libraryKey) {
                          (result.mainComponent as any).libraryKey =
                            componentSet.libraryKey;
                        }
                        break;
                      }
                    } catch (e) {
                      // Skip if we can't access this component set
                      componentSetsInfo.push({
                        error: String(e),
                      });
                    }
                  }
                  debugInfo.componentSets = componentSetsInfo;
                }
              } else {
                // Try alternative: maybe there's a way to get all library files
                // and search through them
                debugInfo.componentSetsApiNote =
                  "getAvailableLibraryComponentSetsAsync not available";
              }
            } catch (libError) {
              // Library lookup might fail, continue without it
              debugInfo.teamLibrarySearchError = String(libError);
            }

            // Method 3: Try importing the component to see if that reveals library info
            // This is a last resort as it might have side effects
            try {
              // Note: We already have the component, but importing might give us
              // access to library metadata we don't have from getMainComponentAsync
              const importedComponent = await figma.importComponentByKeyAsync(
                (mainComponent as any).key,
              );
              if (importedComponent) {
                debugInfo.importedComponentInfo = {
                  id: importedComponent.id,
                  name: importedComponent.name,
                  type: importedComponent.type,
                  remote: (importedComponent as any).remote,
                };
                // Check if imported component has any additional library info
                if ((importedComponent as any).libraryName) {
                  (result.mainComponent as any).libraryName = (
                    importedComponent as any
                  ).libraryName;
                  debugInfo.importedComponentLibraryName = (
                    importedComponent as any
                  ).libraryName;
                }
                if ((importedComponent as any).libraryKey) {
                  (result.mainComponent as any).libraryKey = (
                    importedComponent as any
                  ).libraryKey;
                  debugInfo.importedComponentLibraryKey = (
                    importedComponent as any
                  ).libraryKey;
                }
              }
            } catch (importError) {
              debugInfo.importComponentError = String(importError);
            }
          } catch (libError) {
            // Library information might not be available, continue without it
            debugInfo.libraryInfoError = String(libError);
          }
        }

        // Add debug info to mainComponent object
        if (Object.keys(debugInfo).length > 0) {
          (result.mainComponent as any)._debug = debugInfo;
        }

        handledKeys.add("mainComponent");
      }
    } catch (error) {
      console.log(
        "Error getting main component for " + (node.name || "unknown") + ":",
        error,
      );
    }
  }

  // Note: Unhandled keys are tracked centrally in extractNodeData

  return result;
}
