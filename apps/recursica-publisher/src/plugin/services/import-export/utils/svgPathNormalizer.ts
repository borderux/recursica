/**
 * Utility to normalize SVG path data for consistent export/import
 *
 * This normalizes path strings to:
 * - Remove scientific notation (convert to decimal)
 * - Round very small numbers to zero
 * - Normalize number formatting
 * - Ensure consistent precision
 * - Ensure proper spacing between commands and numbers
 */

/**
 * Normalizes a number string, converting scientific notation to decimal
 *
 * @param numStr - Number string that may contain scientific notation
 * @returns Normalized number string
 */
function normalizeNumber(numStr: string): string {
  // Check if it's scientific notation
  const sciNotationMatch = numStr.match(/^(\d+\.?\d*)[eE]([+-]?\d+)$/);
  if (sciNotationMatch) {
    const number = parseFloat(sciNotationMatch[1]);
    const exponent = parseInt(sciNotationMatch[2]);
    const result = number * Math.pow(10, exponent);

    // If the result is extremely small (essentially zero), use "0"
    if (Math.abs(result) < 1e-10) {
      return "0";
    }

    // Format with reasonable precision (max 6 decimal places for SVG paths)
    const formatted = result.toFixed(6);
    // Remove trailing zeros and optional decimal point
    return formatted.replace(/\.?0+$/, "") || "0";
  }
  return numStr;
}

/**
 * Normalizes a single SVG path data string
 *
 * This function:
 * 1. Converts scientific notation to decimal
 * 2. Normalizes number formatting
 * 3. Ensures proper spacing (commands separated from numbers)
 * 4. Validates and cleans the path format
 *
 * @param pathData - The raw SVG path data string from Figma
 * @returns Normalized path data string
 */
export function normalizeSvgPath(pathData: string): string {
  if (!pathData || typeof pathData !== "string") {
    return pathData;
  }

  // Step 1: Convert scientific notation to decimal
  let normalized = pathData.replace(/(\d+\.?\d*)[eE]([+-]?\d+)/g, (_match) => {
    return normalizeNumber(_match);
  });

  // Step 2: Normalize number precision (limit to 6 decimal places)
  normalized = normalized.replace(
    /(\d+\.\d{7,})/g, // Match numbers with more than 6 decimal places
    (match) => {
      const num = parseFloat(match);
      if (Math.abs(num) < 1e-10) {
        return "0";
      }
      const formatted = num.toFixed(6);
      return formatted.replace(/\.?0+$/, "") || "0";
    },
  );

  // Step 3: Ensure proper spacing for better compatibility
  // Some parsers prefer commands to be separated from numbers with spaces
  // Insert space between command letters and following numbers if missing
  // But preserve existing spacing to avoid breaking valid paths
  normalized = normalized.replace(
    /([MmLlHhVvCcSsQqTtAaZz])([-\d])/g,
    (_match, command, number) => {
      // Only add space if there isn't already whitespace
      return `${command} ${number}`;
    },
  );

  // Step 4: Normalize multiple spaces to single spaces
  normalized = normalized.replace(/\s+/g, " ").trim();

  return normalized;
}

/**
 * Normalizes fillGeometry or strokeGeometry array
 *
 * @param geometry - Array of geometry objects with `data` and `windRule`/`windingRule` properties
 * @returns Normalized geometry array
 */
export function normalizeVectorGeometry(
  geometry: Array<{ data: string; windRule?: string; windingRule?: string }>,
): Array<{ data: string; windRule: string }> {
  if (!Array.isArray(geometry)) {
    return geometry;
  }

  return geometry.map((path) => {
    const normalized: { data: string; windRule: string } = {
      data: normalizeSvgPath(path.data),
      // Normalize winding rule key (use windRule consistently)
      windRule: path.windRule || path.windingRule || "NONZERO",
    };
    return normalized;
  });
}
