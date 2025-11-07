/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * String table for mapping long property names to short abbreviations
 * Reduces JSON size by replacing frequently-used long keys with 5-character or less abbreviations
 *
 * The string table is stored in the JSON so import can restore the original names
 */

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
          compressed[shortKey] = this.compressObject(value);
        } else {
          // Keep original key (either it's already short or there's a collision)
          compressed[key] = this.compressObject(value);
        }
      }
      return compressed;
    }

    return obj;
  }

  /**
   * Recursively replaces all keys in an object with their long names
   * Handles nested objects and arrays
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
        expanded[longKey] = this.expandObject(value);
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
