import type { UsedLibrariesResponse, LibraryUsage } from "../types/messages";

/**
 * Service for detecting which team libraries are actually used in the current file
 * by scanning all nodes for library references
 */
export async function detectUsedLibraries(): Promise<UsedLibrariesResponse> {
  try {
    // Note: Figma internally maintains library references, but the Plugin API
    // doesn't expose a direct method to get them. We have to scan nodes.
    // Figma's "Managed Libraries" view uses internal APIs we don't have access to.

    // Get all available library variable collections
    const availableLibraries =
      await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();

    // Create a map of library file names
    const libraryFileNames = new Set<string>();
    const libraryNameToCollections = new Map<string, string[]>();

    for (const library of availableLibraries) {
      libraryFileNames.add(library.libraryName);
      if (!libraryNameToCollections.has(library.libraryName)) {
        libraryNameToCollections.set(library.libraryName, []);
      }
      libraryNameToCollections.get(library.libraryName)?.push(library.key);
    }

    // Initialize usage tracking
    const libraryUsage: Record<string, LibraryUsage> = {};
    for (const libraryName of libraryFileNames) {
      libraryUsage[libraryName] = {
        libraryName,
        usedIn: {
          components: 0,
          styles: 0,
          variables: 0,
        },
      };
    }

    // Load all pages first
    await figma.loadAllPagesAsync();

    // Get all pages
    const pages = figma.root.children.filter(
      (node) => node.type === "PAGE",
    ) as PageNode[];

    // Track remote components and styles with their details and node IDs
    const remoteComponents: Array<{
      key: string;
      name: string;
      nodeIds: string[];
    }> = [];
    const remoteStyles: Array<{
      key: string;
      name: string;
      type: "PAINT" | "TEXT" | "EFFECT" | "GRID";
      nodeIds: string[];
    }> = [];
    const usedVariableKeys = new Set<string>();

    // Scan all nodes in all pages
    for (const page of pages) {
      // Scan children of the page (PageNode itself is not a SceneNode)
      for (const child of page.children) {
        await scanNodeForLibraryUsage(
          child,
          remoteComponents,
          remoteStyles,
          usedVariableKeys,
        );
      }
    }

    // Remove duplicates from remote components and styles, merging node IDs
    const componentMap = new Map<
      string,
      { key: string; name: string; nodeIds: string[] }
    >();
    for (const comp of remoteComponents) {
      if (componentMap.has(comp.key)) {
        const existing = componentMap.get(comp.key)!;
        existing.nodeIds.push(...comp.nodeIds);
      } else {
        componentMap.set(comp.key, { ...comp, nodeIds: [...comp.nodeIds] });
      }
    }
    const uniqueComponents = Array.from(componentMap.values());

    const styleMap = new Map<
      string,
      {
        key: string;
        name: string;
        type: "PAINT" | "TEXT" | "EFFECT" | "GRID";
        nodeIds: string[];
      }
    >();
    for (const style of remoteStyles) {
      if (styleMap.has(style.key)) {
        const existing = styleMap.get(style.key)!;
        existing.nodeIds.push(...style.nodeIds);
      } else {
        styleMap.set(style.key, { ...style, nodeIds: [...style.nodeIds] });
      }
    }
    const uniqueStyles = Array.from(styleMap.values());

    // Note: The Figma API doesn't provide getAvailableLibraryComponentsAsync(),
    // so we can't directly query which library a component belongs to.
    // The component/style keys exist, but we can't determine which library they're from
    // without an API method to query library components/styles.

    // Match variables to libraries
    for (const variableKey of usedVariableKeys) {
      try {
        const variable =
          await figma.variables.getVariableByIdAsync(variableKey);
        if (variable) {
          // Check if this variable matches any library collection
          for (const library of availableLibraries) {
            try {
              const libVariables =
                await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
                  library.key,
                );
              const matchingVar = libVariables.find(
                (v) => v.name === variable.name,
              );
              if (matchingVar) {
                // This variable is from this library
                const libraryName = library.libraryName;
                if (libraryUsage[libraryName]) {
                  libraryUsage[libraryName].usedIn.variables++;
                }
                break;
              }
            } catch {
              // Continue checking other libraries
            }
          }
        }
      } catch {
        // Variable might not be accessible
      }
    }

    // Convert to array and filter to only libraries that are actually used
    const usedLibraries = Object.values(libraryUsage).filter(
      (lib) => lib.usedIn.variables > 0,
    );

    // Build message
    let message = `Found ${usedLibraries.length} library file(s) with variables in use`;
    if (uniqueComponents.length > 0 || uniqueStyles.length > 0) {
      message += `. Also detected ${uniqueComponents.length} remote component(s) and ${uniqueStyles.length} remote style(s) (library names not available due to API limitations).`;
    }

    return {
      type: "used-libraries-response",
      success: true,
      libraries: usedLibraries,
      remoteComponents:
        uniqueComponents.length > 0 ? uniqueComponents : undefined,
      remoteStyles: uniqueStyles.length > 0 ? uniqueStyles : undefined,
      message,
    };
  } catch (error) {
    console.error("Error detecting used libraries:", error);

    return {
      type: "used-libraries-response",
      success: false,
      libraries: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Recursively scans a node and its children for library usage
 */
async function scanNodeForLibraryUsage(
  node: SceneNode,
  remoteComponents: Array<{
    key: string;
    name: string;
    nodeIds: string[];
  }>,
  remoteStyles: Array<{
    key: string;
    name: string;
    type: string;
    nodeIds: string[];
  }>,
  usedVariableKeys: Set<string>,
): Promise<void> {
  // Check if node is a component instance from a library
  if (node.type === "INSTANCE") {
    try {
      const mainComponent = await node.getMainComponentAsync();
      if (mainComponent && mainComponent.remote) {
        // Component is from a library
        remoteComponents.push({
          key: mainComponent.key,
          name: mainComponent.name,
          nodeIds: [node.id],
        });
      }
    } catch (error) {
      // Component might not be accessible or doesn't have a main component
      console.warn("Could not get main component:", error);
    }
  }

  // Check for library styles
  if (
    "fillStyleId" in node &&
    node.fillStyleId &&
    typeof node.fillStyleId === "string"
  ) {
    try {
      const style = await figma.getStyleByIdAsync(node.fillStyleId);
      if (
        style &&
        style.remote &&
        (style.type === "PAINT" ||
          style.type === "TEXT" ||
          style.type === "EFFECT" ||
          style.type === "GRID")
      ) {
        remoteStyles.push({
          key: style.key,
          name: style.name,
          type: style.type,
          nodeIds: [node.id],
        });
      }
    } catch {
      // Style might not exist or be accessible
    }
  }

  if (
    "textStyleId" in node &&
    node.textStyleId &&
    typeof node.textStyleId === "string"
  ) {
    try {
      const style = await figma.getStyleByIdAsync(node.textStyleId);
      if (
        style &&
        style.remote &&
        (style.type === "PAINT" ||
          style.type === "TEXT" ||
          style.type === "EFFECT" ||
          style.type === "GRID")
      ) {
        remoteStyles.push({
          key: style.key,
          name: style.name,
          type: style.type,
          nodeIds: [node.id],
        });
      }
    } catch {
      // Style might not exist or be accessible
    }
  }

  if (
    "effectStyleId" in node &&
    node.effectStyleId &&
    typeof node.effectStyleId === "string"
  ) {
    try {
      const style = await figma.getStyleByIdAsync(node.effectStyleId);
      if (
        style &&
        style.remote &&
        (style.type === "PAINT" ||
          style.type === "TEXT" ||
          style.type === "EFFECT" ||
          style.type === "GRID")
      ) {
        remoteStyles.push({
          key: style.key,
          name: style.name,
          type: style.type,
          nodeIds: [node.id],
        });
      }
    } catch {
      // Style might not exist or be accessible
    }
  }

  // Check for library variables
  if ("fills" in node && Array.isArray(node.fills)) {
    for (const fill of node.fills) {
      if (fill.type === "SOLID" && "boundVariables" in fill) {
        extractVariableIds(fill.boundVariables, usedVariableKeys);
      }
    }
  }

  if ("strokes" in node && Array.isArray(node.strokes)) {
    for (const stroke of node.strokes) {
      if ("boundVariables" in stroke) {
        extractVariableIds(stroke.boundVariables, usedVariableKeys);
      }
    }
  }

  if ("effects" in node && Array.isArray(node.effects)) {
    for (const effect of node.effects) {
      if ("boundVariables" in effect) {
        extractVariableIds(effect.boundVariables, usedVariableKeys);
      }
    }
  }

  // Check text node variables
  if (node.type === "TEXT") {
    if ("boundVariables" in node) {
      extractVariableIds(node.boundVariables, usedVariableKeys);
    }
  }

  // Recursively check children
  if ("children" in node) {
    // Load children if needed (for nodes that support lazy loading)
    if ("loadAsync" in node && typeof node.loadAsync === "function") {
      try {
        await node.loadAsync();
      } catch (error) {
        // Node might already be loaded or doesn't support loading
        console.warn("Could not load node:", error);
      }
    }

    for (const child of node.children) {
      await scanNodeForLibraryUsage(
        child,
        remoteComponents,
        remoteStyles,
        usedVariableKeys,
      );
    }
  }
}

/**
 * Extracts variable IDs from bound variables
 */
function extractVariableIds(
  boundVariables: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  usedVariableKeys: Set<string>,
): void {
  if (!boundVariables || typeof boundVariables !== "object") {
    return;
  }

  for (const variableBinding of Object.values(boundVariables)) {
    if (
      variableBinding &&
      typeof variableBinding === "object" &&
      "type" in variableBinding &&
      variableBinding.type === "VARIABLE_ALIAS" &&
      "id" in variableBinding
    ) {
      usedVariableKeys.add(variableBinding.id as string);
    }
  }
}
