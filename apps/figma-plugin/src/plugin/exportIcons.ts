type SvgMetadata = {
  [key: string]: string;
};

async function collectIconsFromNodes(node: BaseNode, svgIcons: SvgMetadata): Promise<void> {
  if (node.type === 'VECTOR') {
    if (node.parent?.type === 'COMPONENT' && node.parent.parent?.type === 'COMPONENT_SET') {
      const svg = await node.parent.exportAsync({ format: 'SVG' });
      const svgString = String.fromCharCode
        .apply(null, Array.from(svg))
        .replace(/fill="#[0-9A-Fa-f]{6}"/g, '');

      const svgName = `${node.parent.parent.name}[${node.parent.name}]`;
      if (!svgIcons[svgName]) svgIcons[svgName] = svgString;
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
  await collectIconsFromNodes(figma.currentPage, svgIcons);

  const response = {
    type: 'SVG_ICONS',
    payload: svgIcons,
  };
  if (Object.keys(svgIcons).length > 0) {
    figma.ui.postMessage(response);
    return svgIcons;
  }
}

export async function exportSelectedIcons(currentSelection: SceneNode[]) {
  const selectedIcons = await getSvgIconsFromNodes(currentSelection);

  figma.ui.postMessage({ type: 'EXPORT_SELECTED_ICONS', selectedIcons });
}
