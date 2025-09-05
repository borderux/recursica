type SvgMetadata = {
  [key: string]: string;
};

/**
 * Checks if a node has visible content that can be exported
 */
function hasVisibleContent(node: BaseNode): boolean {
  // Check if node is visible (only available on SceneNode and its descendants)
  if ('visible' in node && !node.visible) {
    return false;
  }

  // For vector nodes, check if they have any visible fills or strokes
  if (node.type === 'VECTOR') {
    const vectorNode = node as VectorNode;

    // Check fills - assume visible if fills exist and are not empty
    const fills = vectorNode.fills;
    const hasVisibleFill = Array.isArray(fills) && fills.length > 0;

    // Check strokes - assume visible if strokes exist and are not empty
    const strokes = vectorNode.strokes;
    const hasVisibleStroke = Array.isArray(strokes) && strokes.length > 0;

    return hasVisibleFill || hasVisibleStroke;
  }

  // For other node types, check if they have children with visible content
  if ('children' in node) {
    return node.children.some((child) => hasVisibleContent(child));
  }

  return true;
}

/**
 * Safely exports a component to SVG with error handling
 */
async function safeExportComponent(component: ComponentNode): Promise<string | null> {
  try {
    // Check if component has visible content
    if (!hasVisibleContent(component)) {
      console.warn(`Component "${component.name}" has no visible content, skipping export`);
      return null;
    }

    // Attempt to export the component
    const svg = await component.exportAsync({ format: 'SVG' });

    if (!svg || svg.length === 0) {
      console.warn(`Component "${component.name}" exported empty SVG, skipping`);
      return null;
    }

    const svgString = String.fromCharCode
      .apply(null, Array.from(svg))
      .replace(/fill="#[0-9A-Fa-f]{6}"/g, '');

    // Validate that the SVG string contains actual content
    if (!svgString.trim() || svgString.length < 50) {
      console.warn(`Component "${component.name}" produced invalid SVG content, skipping`);
      return null;
    }

    return svgString;
  } catch (error) {
    console.error(
      `Failed to export component "${component.parent?.name}[${component.name}]":`,
      error
    );
    figma.notify(
      `Failed to export component "${component.parent?.name}[${component.name}]":\n ${error}`,
      {
        timeout: Infinity,
      }
    );
    return null;
  }
}

async function collectIconsFromNodes(node: BaseNode, svgIcons: SvgMetadata): Promise<void> {
  if (node.type === 'VECTOR') {
    if (node.parent?.type === 'COMPONENT' && node.parent.parent?.type === 'COMPONENT_SET') {
      const component = node.parent as ComponentNode;
      const svgString = await safeExportComponent(component);

      if (svgString) {
        const svgName = `${node.parent.parent.name}[${node.parent.name}]`;
        if (!svgIcons[svgName]) svgIcons[svgName] = svgString;
      }
    }
  }

  if ('children' in node) {
    await Promise.all(node.children.map((child) => collectIconsFromNodes(child, svgIcons)));
  }
}

async function getSvgIconsFromNodes(nodes: SceneNode[]): Promise<SvgMetadata> {
  const svgIcons: SvgMetadata = {};

  await Promise.all(nodes.map((node) => collectIconsFromNodes(node, svgIcons)));

  return svgIcons;
}

export async function exportIcons() {
  const svgIcons: SvgMetadata = {};

  try {
    console.log('Starting icon export from current page...');
    await collectIconsFromNodes(figma.currentPage, svgIcons);

    const totalIcons = Object.keys(svgIcons).length;
    console.log(`Icon export completed. Found ${totalIcons} valid icons.`);

    const response = {
      type: 'SVG_ICONS',
      payload: svgIcons,
    };

    if (totalIcons > 0) {
      console.log('svgIcons', svgIcons);
      figma.ui.postMessage(response);
      return svgIcons;
    } else {
      console.warn('No valid icons found for export');
      figma.ui.postMessage(response);
      return svgIcons;
    }
  } catch (error) {
    console.error('Error during icon export:', error);
    figma.ui.postMessage({
      type: 'SVG_ICONS',
      payload: svgIcons, // Return whatever we managed to collect
    });
    return svgIcons;
  }
}

export async function exportSelectedIcons(currentSelection: SceneNode[]) {
  try {
    console.log(`Starting export of ${currentSelection.length} selected nodes...`);
    const selectedIcons = await getSvgIconsFromNodes(currentSelection);

    const totalIcons = Object.keys(selectedIcons).length;
    console.log(`Selected icon export completed. Found ${totalIcons} valid icons.`);

    figma.ui.postMessage({ type: 'EXPORT_SELECTED_ICONS', selectedIcons });
  } catch (error) {
    console.error('Error during selected icon export:', error);
    figma.ui.postMessage({
      type: 'EXPORT_SELECTED_ICONS',
      selectedIcons: {}, // Return empty object on error
    });
  }
}
