var u = Object.defineProperty;
var m = Object.getOwnPropertySymbols;
var g = Object.prototype.hasOwnProperty, f = Object.prototype.propertyIsEnumerable;
var a = (o, e, t) => e in o ? u(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t, r = (o, e) => {
  for (var t in e || (e = {}))
    g.call(e, t) && a(o, t, e[t]);
  if (m)
    for (var t of m(e))
      f.call(e, t) && a(o, t, e[t]);
  return o;
};
var i = (o, e, t) => a(o, typeof e != "symbol" ? e + "" : e, t);
const p = {
  // Collection table keys
  collectionName: "colNm",
  collectionId: "colId",
  collectionGuid: "colGu",
  isLocal: "isLoc",
  modes: "modes",
  // Already short, keep as-is
  // Variable table keys
  variableName: "varNm",
  variableType: "varTy",
  valuesByMode: "vByMd",
  _colRef: "_colR",
  // Keep underscore prefix for references
  _varRef: "_varR",
  _instanceRef: "_inst",
  // 5 chars
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
  path: "path",
  // Already short
  structure: "struc",
  // 5 chars
  // Legacy variable table keys (for backward compatibility)
  collectionRef: "colRf"
}, l = {};
for (const [o, e] of Object.entries(p))
  l[e] = o;
class h {
  constructor() {
    i(this, "shortToLong");
    i(this, "longToShort");
    this.shortToLong = r({}, l), this.longToShort = r({}, p);
  }
  /**
   * Gets the short name for a long property name
   * Returns the short name if mapped, otherwise returns the original
   */
  getShortName(e) {
    return this.longToShort[e] || e;
  }
  /**
   * Gets the long name for a short property name
   * Returns the long name if mapped, otherwise returns the original
   */
  getLongName(e) {
    return this.shortToLong[e] || e;
  }
  /**
   * Recursively replaces all keys in an object with their short names
   * Handles nested objects and arrays
   */
  compressObject(e) {
    if (e == null)
      return e;
    if (Array.isArray(e))
      return e.map((t) => this.compressObject(t));
    if (typeof e == "object") {
      const t = {};
      for (const [n, c] of Object.entries(e)) {
        const s = this.getShortName(n);
        t[s] = this.compressObject(c);
      }
      return t;
    }
    return e;
  }
  /**
   * Recursively replaces all keys in an object with their long names
   * Handles nested objects and arrays
   */
  expandObject(e) {
    if (e == null)
      return e;
    if (Array.isArray(e))
      return e.map((t) => this.expandObject(t));
    if (typeof e == "object") {
      const t = {};
      for (const [n, c] of Object.entries(e)) {
        const s = this.getLongName(n);
        t[s] = this.expandObject(c);
      }
      return t;
    }
    return e;
  }
  /**
   * Gets the serialized string table for JSON export
   * Returns the mapping of short -> long names
   */
  getSerializedTable() {
    return r({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(e) {
    const t = new h();
    t.shortToLong = r(r({}, l), e), t.longToShort = {};
    for (const [n, c] of Object.entries(
      t.shortToLong
    ))
      t.longToShort[c] = n;
    return t;
  }
}
export {
  h as StringTable
};
