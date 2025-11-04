/* eslint-disable @typescript-eslint/no-explicit-any */
import { VECTOR_DEFAULTS, isDifferentFromDefault } from "./nodeDefaults";
import type { ParsedNodeData, ParserContext } from "./baseNodeParser";

/**
 * Parser for VECTOR and LINE node types
 */
export async function parseVectorProperties(
  node: any,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: ParserContext,
): Promise<Partial<ParsedNodeData>> {
  const result: Partial<ParsedNodeData> = {};
  const handledKeys = new Set<string>();

  // Vector-specific properties
  if (
    node.fillGeometry !== undefined &&
    isDifferentFromDefault(node.fillGeometry, VECTOR_DEFAULTS.fillGeometry)
  ) {
    result.fillGeometry = node.fillGeometry;
    handledKeys.add("fillGeometry");
  }
  if (
    node.strokeGeometry !== undefined &&
    isDifferentFromDefault(node.strokeGeometry, VECTOR_DEFAULTS.strokeGeometry)
  ) {
    result.strokeGeometry = node.strokeGeometry;
    handledKeys.add("strokeGeometry");
  }

  // Stroke cap (may differ from base defaults)
  if (
    node.strokeCap !== undefined &&
    isDifferentFromDefault(node.strokeCap, VECTOR_DEFAULTS.strokeCap)
  ) {
    result.strokeCap = node.strokeCap;
    handledKeys.add("strokeCap");
  }
  if (
    node.strokeJoin !== undefined &&
    isDifferentFromDefault(node.strokeJoin, VECTOR_DEFAULTS.strokeJoin)
  ) {
    result.strokeJoin = node.strokeJoin;
    handledKeys.add("strokeJoin");
  }
  if (
    node.dashPattern !== undefined &&
    isDifferentFromDefault(node.dashPattern, VECTOR_DEFAULTS.dashPattern)
  ) {
    result.dashPattern = node.dashPattern;
    handledKeys.add("dashPattern");
  }

  // Note: Unhandled keys are tracked centrally in extractNodeData

  return result;
}
