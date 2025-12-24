/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * String table for mapping long property names to short abbreviations
 * Reduces JSON size by replacing frequently-used long keys with 5-character or less abbreviations
 *
 * The string table is stored in the JSON so import can restore the original names
 */

/**
 * Unified type enum mapping: maps all Figma type enum values to numbers for compression
 * Covers: node types, fill types, effect types, component property types, etc.
 * Unknown types are stored as strings
 */
const TYPE_ENUM_MAP: Record<string, number> = {
  // Node types
  FRAME: 1,
  TEXT: 2,
  INSTANCE: 3,
  COMPONENT: 4,
  VECTOR: 5,
  RECTANGLE: 6,
  ELLIPSE: 7,
  STAR: 8,
  LINE: 9,
  GROUP: 10,
  BOOLEAN_OPERATION: 11,
  POLYGON: 12,
  PAGE: 13,
  COMPONENT_SET: 14,
  // Fill types
  SOLID: 15,
  GRADIENT_LINEAR: 16,
  GRADIENT_RADIAL: 17,
  GRADIENT_ANGULAR: 18,
  GRADIENT_DIAMOND: 19,
  IMAGE: 20,
  // Effect types
  DROP_SHADOW: 21,
  INNER_SHADOW: 22,
  LAYER_BLUR: 23,
  BACKGROUND_BLUR: 24,
  // Component property types
  BOOLEAN: 25,
  VARIANT: 26,
  INSTANCE_SWAP: 27,
  // Note: TEXT is already mapped as node type (2), component property type uses same value
  // Variable types
  VARIABLE_ALIAS: 29,
  // Blend modes (if used as type)
  NORMAL: 30,
  PASS_THROUGH: 31,
  // Style types
  TEXT_STYLE: 32,
  PAINT_STYLE: 33,
  EFFECT_STYLE: 34,
  GRID_STYLE: 35,
};

/**
 * Generates reverse map from the forward map dynamically
 * This ensures we only maintain one source of truth
 */
function getReverseTypeEnumMap(): Record<number, string> {
  const reverse: Record<number, string> = {};
  for (const [key, value] of Object.entries(TYPE_ENUM_MAP)) {
    reverse[value] = key;
  }
  return reverse;
}

/**
 * Compresses a type enum value to a number if it's a known type, otherwise returns the string
 * Works for any "type" field value (node types, fill types, effect types, etc.)
 */
function compressTypeEnum(type: string): number | string {
  return TYPE_ENUM_MAP[type] ?? type;
}

/**
 * Expands a type enum value from a number or string back to the full type name
 * Works for any "type" field value
 * Dynamically generates the reverse map from the forward map
 */
function expandTypeEnum(type: number | string): string {
  if (typeof type === "number") {
    const reverseMap = getReverseTypeEnumMap();
    return reverseMap[type] ?? type.toString();
  }
  return type;
}

/**
 * Predefined mapping of long names to short abbreviations (5 chars or less)
 * These are human-readable abbreviations that make sense
 */
const STRING_TABLE_MAP: Record<string, string> = {
  // Collection table keys
  collectionName: "colNm",
  collectionId: "colId",
  collectionGuid: "colGu",
  modes: "modes", // Already short, keep as-is

  // Variable table keys
  variableName: "varNm",
  variableType: "varTy",
  valuesByMode: "vByMd",
  _colRef: "_colRef", // Keep as-is (already short)
  _varRef: "_varRef", // Keep as-is (already short)
  _instanceRef: "_insRef", // Keep short but consistent
  _styleRef: "_stlRef", // Style reference

  // Instance table keys
  instanceType: "instT",
  componentName: "compN",
  componentSetName: "cSetN",
  componentNodeId: "cNode",
  componentGuid: "compG",
  componentVersion: "cVers",
  componentPageName: "cPage",
  variantProperties: "varPr",
  componentProperties: "cProp",
  remoteLibraryName: "rLibN",
  remoteLibraryKey: "rLibK",
  path: "path", // Already short
  structure: "struc", // 5 chars

  // Figma node property names (6+ characters)
  boundVariables: "bndVar",
  strokeAlign: "stkAl",
  strokeWeight: "stkWt",
  strokeCap: "stkCp",
  strokeJoin: "stkJn",
  fillGeometry: "fillG",
  strokeGeometry: "strkG",
  windingRule: "windR",
  layoutMode: "layMd",
  paddingLeft: "padL",
  paddingRight: "padR",
  paddingTop: "padT",
  paddingBottom: "padB",
  itemSpacing: "itmSp",
  clipsContent: "clipC",
  cornerRadius: "corR",
  primaryAxisSizingMode: "pAxSz",
  counterAxisSizingMode: "cAxSz",
  primaryAxisAlignItems: "pAxAl",
  counterAxisAlignItems: "cAxAl",
  counterAxisSpacing: "cAxSp",
  textAutoResize: "txtAr",
  letterSpacing: "letSp",
  lineHeight: "linHt",
  textAlignHorizontal: "txtAh",
  textAlignVertical: "txtAv",
  textDecoration: "txtDc",
  fontName: "fontN",
  fontSize: "fontS",
  fontWeight: "fontW",
  fontFamily: "fontF",
  preferredValues: "prefV",
  showShadowBehindNode: "shwSh",
  bottomLeftRadius: "botLR",
  bottomRightRadius: "botRR",
  topLeftRadius: "topLR",
  layoutGrow: "layGr",
  offsetX: "offX",
  offsetY: "offY",
  maxWidth: "maxW",
  minWidth: "minW",
  paragraphSpacing: "parSp",
  paragraphIndent: "parIn",
  listOptions: "lstOp",
  dashPattern: "dashP",
  blendMode: "blnMd",
  characters: "chars",
  children: "child",
  effects: "effct",
  fills: "fills", // Already 5 chars, keep as-is
  strokes: "strks",
  visible: "visbl",
  opacity: "opcty",
  rotation: "rotat",
  height: "h",
  width: "w",
  libraryName: "libNm", // Different from remoteLibraryName (rLibN)
  constraintHorizontal: "cnsHr", // Constraint horizontal (5 chars)
  constraintVertical: "cnsVr", // Constraint vertical (5 chars)
  // Style-related keys
  textStyle: "txtSt",
  paintStyle: "pntSt",
  effectStyle: "effSt",
  gridStyle: "grdSt",
  styleKey: "stlKy",
  // Component property references
  componentPropertyReferences: "cPropR", // Component property references (5 chars)
};

/**
 * Reverse mapping: short -> long (built from STRING_TABLE_MAP)
 */
const REVERSE_MAP: Record<string, string> = {};

// Build reverse map
for (const [longName, shortName] of Object.entries(STRING_TABLE_MAP)) {
  REVERSE_MAP[shortName] = longName;
}

/**
 * StringTable manages the mapping between long and short property names
 */
export class StringTable {
  private shortToLong: Record<string, string>;
  private longToShort: Record<string, string>;

  constructor() {
    // Initialize with predefined mappings
    this.shortToLong = { ...REVERSE_MAP };
    this.longToShort = { ...STRING_TABLE_MAP };
  }

  /**
   * Gets the short name for a long property name
   * Returns the short name if mapped, otherwise returns the original
   */
  getShortName(longName: string): string {
    return this.longToShort[longName] || longName;
  }

  /**
   * Gets the long name for a short property name
   * Returns the long name if mapped, otherwise returns the original
   */
  getLongName(shortName: string): string {
    return this.shortToLong[shortName] || shortName;
  }

  /**
   * Recursively replaces all keys in an object with their short names
   * Handles nested objects and arrays
   * Collision detection: if a short name already exists as a key, keep the original key
   * Also compresses special values: node "type" field values and variable "type" field values
   */
  compressObject(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.compressObject(item));
    }

    if (typeof obj === "object") {
      const compressed: any = {};
      const usedKeys = new Set<string>();

      // First pass: collect all original keys to detect collisions
      for (const key of Object.keys(obj)) {
        usedKeys.add(key);
      }

      // Second pass: compress keys, avoiding collisions
      for (const [key, value] of Object.entries(obj)) {
        const shortKey = this.getShortName(key);

        // If the short key is different from the original AND the short key doesn't already exist as an original key
        // then we can safely compress. Otherwise, keep the original key.
        if (shortKey !== key && !usedKeys.has(shortKey)) {
          let compressedValue = this.compressObject(value);

          // Special handling: compress "type" field values (works for any type enum: node types, fill types, etc.)
          if (shortKey === "type" && typeof compressedValue === "string") {
            compressedValue = compressTypeEnum(compressedValue);
          }

          compressed[shortKey] = compressedValue;
        } else {
          // Keep original key (either it's already short or there's a collision)
          let compressedValue = this.compressObject(value);

          // Special handling: compress "type" field values even if key wasn't compressed
          if (key === "type" && typeof compressedValue === "string") {
            compressedValue = compressTypeEnum(compressedValue);
          }

          compressed[key] = compressedValue;
        }
      }
      return compressed;
    }

    return obj;
  }

  /**
   * Recursively replaces all keys in an object with their long names
   * Handles nested objects and arrays
   * Also expands special values: node "type" field values and variable "type" field values
   */
  expandObject(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.expandObject(item));
    }

    if (typeof obj === "object") {
      const expanded: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const longKey = this.getLongName(key);
        let expandedValue = this.expandObject(value);

        // Special handling: expand node "type" field values
        if (
          (longKey === "type" || key === "type") &&
          (typeof expandedValue === "number" ||
            typeof expandedValue === "string")
        ) {
          expandedValue = expandTypeEnum(expandedValue);
        }

        expanded[longKey] = expandedValue;
      }
      return expanded;
    }

    return obj;
  }

  /**
   * Gets the serialized string table for JSON export
   * Returns the mapping of short -> long names
   */
  getSerializedTable(): Record<string, string> {
    return { ...this.shortToLong };
  }

  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(table: Record<string, string>): StringTable {
    const stringTable = new StringTable();
    // Merge with predefined mappings (predefined take precedence)
    stringTable.shortToLong = { ...REVERSE_MAP, ...table };
    // Build reverse mapping
    stringTable.longToShort = {};
    for (const [shortName, longName] of Object.entries(
      stringTable.shortToLong,
    )) {
      stringTable.longToShort[longName] = shortName;
    }
    return stringTable;
  }
}
