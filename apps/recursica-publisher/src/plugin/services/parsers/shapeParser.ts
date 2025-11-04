/* eslint-disable @typescript-eslint/no-explicit-any */
import { SHAPE_DEFAULTS, isDifferentFromDefault } from "./nodeDefaults";
import type { ParsedNodeData, ParserContext } from "./baseNodeParser";

/**
 * Parser for shape node types: RECTANGLE, ELLIPSE, STAR, POLYGON
 */
export async function parseShapeProperties(
  node: any,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: ParserContext,
): Promise<Partial<ParsedNodeData>> {
  const result: Partial<ParsedNodeData> = {};
  const handledKeys = new Set<string>();

  // Corner radius (for rectangles)
  if (
    node.cornerRadius !== undefined &&
    isDifferentFromDefault(node.cornerRadius, SHAPE_DEFAULTS.cornerRadius)
  ) {
    result.cornerRadius = node.cornerRadius;
    handledKeys.add("cornerRadius");
  }

  // Star-specific properties
  if (node.pointCount !== undefined) {
    result.pointCount = node.pointCount;
    handledKeys.add("pointCount");
  }
  if (node.innerRadius !== undefined) {
    result.innerRadius = node.innerRadius;
    handledKeys.add("innerRadius");
  }

  // Polygon-specific properties
  if (node.pointCount !== undefined) {
    result.pointCount = node.pointCount;
    handledKeys.add("pointCount");
  }

  // Note: Unhandled keys are tracked centrally in extractNodeData

  return result;
}
