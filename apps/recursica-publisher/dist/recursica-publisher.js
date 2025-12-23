var hn = Object.defineProperty, yn = Object.defineProperties;
var bn = Object.getOwnPropertyDescriptors;
var st = Object.getOwnPropertySymbols;
var Rt = Object.prototype.hasOwnProperty, Mt = Object.prototype.propertyIsEnumerable;
var $t = (e, n, i) => n in e ? hn(e, n, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[n] = i, le = (e, n) => {
  for (var i in n || (n = {}))
    Rt.call(n, i) && $t(e, i, n[i]);
  if (st)
    for (var i of st(n))
      Mt.call(n, i) && $t(e, i, n[i]);
  return e;
}, Ee = (e, n) => yn(e, bn(n));
var kt = (e, n) => {
  var i = {};
  for (var o in e)
    Rt.call(e, o) && n.indexOf(o) < 0 && (i[o] = e[o]);
  if (e != null && st)
    for (var o of st(e))
      n.indexOf(o) < 0 && Mt.call(e, o) && (i[o] = e[o]);
  return i;
};
var Te = (e, n, i) => $t(e, typeof n != "symbol" ? n + "" : n, i);
async function $n(e) {
  var n;
  try {
    return {
      type: "getCurrentUser",
      success: !0,
      error: !1,
      message: "Current user retrieved successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        userId: ((n = figma.currentUser) == null ? void 0 : n.id) || null
      }
    };
  } catch (i) {
    return {
      type: "getCurrentUser",
      success: !1,
      error: !0,
      message: i instanceof Error ? i.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function vn(e) {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "loadPages",
      success: !0,
      error: !1,
      message: "Pages loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        pages: figma.root.children.map((a, l) => ({
          name: a.name,
          index: l
        }))
      }
    };
  } catch (n) {
    return console.error("Error loading pages:", n), {
      type: "loadPages",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
const Ie = {
  visible: !0,
  locked: !1,
  opacity: 1,
  blendMode: "PASS_THROUGH",
  rotation: 0,
  effects: [],
  fills: [],
  strokes: [],
  strokeWeight: 1,
  strokeAlign: "CENTER",
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: [],
  constraintHorizontal: "MIN",
  // Default: Left/Top
  constraintVertical: "MIN"
  // Default: Left/Top
}, Ae = Ee(le({}, Ie), {
  layoutMode: "NONE",
  primaryAxisSizingMode: "AUTO",
  counterAxisSizingMode: "AUTO",
  primaryAxisAlignItems: "MIN",
  counterAxisAlignItems: "MIN",
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  paddingBottom: 0,
  itemSpacing: 0,
  counterAxisSpacing: 0,
  cornerRadius: 0,
  clipsContent: !1,
  layoutWrap: "NO_WRAP",
  layoutGrow: 0
}), ke = Ee(le({}, Ie), {
  textAlignHorizontal: "LEFT",
  textAlignVertical: "TOP",
  letterSpacing: { value: 0, unit: "PIXELS" },
  lineHeight: { unit: "AUTO" },
  textCase: "ORIGINAL",
  textDecoration: "NONE",
  textAutoResize: "WIDTH",
  paragraphSpacing: 0,
  paragraphIndent: 0,
  listOptions: null
}), Ye = Ee(le({}, Ie), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), zt = Ee(le({}, Ie), {
  cornerRadius: 0
}), Sn = Ee(le({}, Ie), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function Nn(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return Ae;
    case "TEXT":
      return ke;
    case "VECTOR":
      return Ye;
    case "LINE":
      return Sn;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return zt;
    default:
      return Ie;
  }
}
function ge(e, n) {
  if (Array.isArray(e))
    return Array.isArray(n) ? e.length !== n.length || e.some((i, o) => ge(i, n[o])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof n == "object" && n !== null) {
      const i = Object.keys(e), o = Object.keys(n);
      return i.length !== o.length ? !0 : i.some(
        (a) => !(a in n) || ge(e[a], n[a])
      );
    }
    return !0;
  }
  return e !== n;
}
const _e = {
  LAYER: "00000000-0000-0000-0000-000000000001",
  TOKENS: "00000000-0000-0000-0000-000000000002",
  THEME: "00000000-0000-0000-0000-000000000003"
}, Le = {
  LAYER: "Layer",
  TOKENS: "Tokens",
  THEME: "Theme"
};
function Oe(e) {
  const n = e.trim(), o = n.replace(/_\d+$/, "").toLowerCase();
  return o === "themes" || o === "theme" ? Le.THEME : o === "token" || o === "tokens" ? Le.TOKENS : o === "layer" || o === "layers" ? Le.LAYER : n;
}
function Ge(e) {
  const n = Oe(e);
  return n === Le.LAYER || n === Le.TOKENS || n === Le.THEME;
}
function ft(e) {
  const n = Oe(e);
  if (n === Le.LAYER)
    return _e.LAYER;
  if (n === Le.TOKENS)
    return _e.TOKENS;
  if (n === Le.THEME)
    return _e.THEME;
}
class ot {
  constructor() {
    Te(this, "collectionMap");
    // collectionId -> index
    Te(this, "collections");
    // index -> collection data
    Te(this, "normalizedNameMap");
    // normalized name -> index (for standard collections)
    Te(this, "nextIndex");
    this.collectionMap = /* @__PURE__ */ new Map(), this.collections = [], this.normalizedNameMap = /* @__PURE__ */ new Map(), this.nextIndex = 0;
  }
  /**
   * Finds a collection by normalized name (for standard collections)
   * Returns the index if found, -1 otherwise
   */
  findCollectionByNormalizedName(n) {
    return this.normalizedNameMap.get(n);
  }
  /**
   * Merges modes from a new collection into an existing collection entry
   * Ensures all unique modes are present
   */
  mergeModes(n, i) {
    const o = new Set(n);
    for (const a of i)
      o.add(a);
    return Array.from(o);
  }
  /**
   * Adds a collection to the table if it doesn't already exist
   * For standard collections (Layer, Tokens, Theme), merges by normalized name
   * Returns the index of the collection (existing or newly added)
   */
  addCollection(n) {
    const i = n.collectionId;
    if (this.collectionMap.has(i))
      return this.collectionMap.get(i);
    const o = Oe(
      n.collectionName
    );
    if (Ge(n.collectionName)) {
      const r = this.findCollectionByNormalizedName(o);
      if (r !== void 0) {
        const c = this.collections[r];
        return c.modes = this.mergeModes(
          c.modes,
          n.modes
        ), this.collectionMap.set(i, r), r;
      }
    }
    const a = this.nextIndex++;
    this.collectionMap.set(i, a);
    const l = Ee(le({}, n), {
      collectionName: o
    });
    if (Ge(n.collectionName)) {
      const r = ft(
        n.collectionName
      );
      r && (l.collectionGuid = r), this.normalizedNameMap.set(o, a);
    }
    return this.collections[a] = l, a;
  }
  /**
   * Gets the index of a collection by its collectionId
   * Returns -1 if not found
   */
  getCollectionIndex(n) {
    var i;
    return (i = this.collectionMap.get(n)) != null ? i : -1;
  }
  /**
   * Gets a collection entry by index
   */
  getCollectionByIndex(n) {
    return this.collections[n];
  }
  /**
   * Gets the complete table as an object with string keys
   * Used for internal operations (includes all fields)
   */
  getTable() {
    const n = {};
    for (let i = 0; i < this.collections.length; i++)
      n[String(i)] = this.collections[i];
    return n;
  }
  /**
   * Gets the table with only serialized fields (excludes internal-only fields)
   * Used for JSON serialization to reduce size
   * Filters out: collectionId, isLocal (internal-only fields)
   * Keeps: collectionName, collectionGuid, modes
   */
  getSerializedTable() {
    const n = {};
    for (let i = 0; i < this.collections.length; i++) {
      const o = this.collections[i], a = le({
        collectionName: o.collectionName,
        modes: o.modes
      }, o.collectionGuid && { collectionGuid: o.collectionGuid });
      n[String(i)] = a;
    }
    return n;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   * Handles both new format (without collectionId/isLocal) and legacy format (with collectionId/isLocal)
   */
  static fromTable(n) {
    var a;
    const i = new ot(), o = Object.entries(n).sort(
      (l, r) => parseInt(l[0], 10) - parseInt(r[0], 10)
    );
    for (const [l, r] of o) {
      const c = parseInt(l, 10), d = (a = r.isLocal) != null ? a : !0, p = Oe(
        r.collectionName || ""
      ), h = r.collectionId || r.collectionGuid || `temp:${c}:${p}`, $ = le({
        collectionName: p,
        collectionId: h,
        isLocal: d,
        modes: r.modes || []
      }, r.collectionGuid && {
        collectionGuid: r.collectionGuid
      });
      i.collectionMap.set(h, c), i.collections[c] = $, Ge(p) && i.normalizedNameMap.set(p, c), i.nextIndex = Math.max(
        i.nextIndex,
        c + 1
      );
    }
    return i;
  }
  /**
   * Gets the total number of collections in the table
   */
  getSize() {
    return this.collections.length;
  }
}
const Cn = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, En = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function In(e) {
  var i;
  const n = e.toUpperCase();
  return (i = Cn[n]) != null ? i : e;
}
function wn(e) {
  var n;
  return typeof e == "number" ? (n = En[e]) != null ? n : e.toString() : e;
}
class rt {
  constructor() {
    Te(this, "variableMap");
    // variableKey -> index
    Te(this, "variables");
    // index -> variable data
    Te(this, "nextIndex");
    this.variableMap = /* @__PURE__ */ new Map(), this.variables = [], this.nextIndex = 0;
  }
  /**
   * Adds a variable to the table if it doesn't already exist
   * Returns the index of the variable (existing or newly added)
   */
  addVariable(n) {
    const i = n.variableKey;
    if (!i)
      return -1;
    if (this.variableMap.has(i))
      return this.variableMap.get(i);
    const o = this.nextIndex++;
    return this.variableMap.set(i, o), this.variables[o] = n, o;
  }
  /**
   * Gets the index of a variable by its variableKey
   * Returns -1 if not found
   */
  getVariableIndex(n) {
    var i;
    return (i = this.variableMap.get(n)) != null ? i : -1;
  }
  /**
   * Gets a variable entry by index
   */
  getVariableByIndex(n) {
    return this.variables[n];
  }
  /**
   * Gets the complete table as an object with string keys
   * Used for JSON serialization
   * Includes all fields (for backward compatibility)
   */
  getTable() {
    const n = {};
    for (let i = 0; i < this.variables.length; i++)
      n[String(i)] = this.variables[i];
    return n;
  }
  /**
   * Serializes valuesByMode, removing type and id from VariableAliasSerialized objects
   * Only keeps _varRef since that's sufficient to identify a variable reference
   */
  serializeValuesByMode(n) {
    if (!n)
      return;
    const i = {};
    for (const [o, a] of Object.entries(n))
      typeof a == "object" && a !== null && "_varRef" in a && typeof a._varRef == "number" ? i[o] = {
        _varRef: a._varRef
      } : i[o] = a;
    return i;
  }
  /**
   * Gets the table with only serialized fields (excludes internal-only fields)
   * Used for JSON serialization to reduce size
   * Filters out: variableKey, id, collectionName, collectionId, isLocal
   * Also removes type and id from VariableAliasSerialized in valuesByMode (only keeps _varRef)
   * Compresses variableType: known types (COLOR, FLOAT, STRING, BOOLEAN) become numbers (1-4), unknown types stay as strings
   * Keeps: variableName, variableType (compressed), _colRef, valuesByMode
   */
  getSerializedTable() {
    const n = {};
    for (let i = 0; i < this.variables.length; i++) {
      const o = this.variables[i], a = this.serializeValuesByMode(
        o.valuesByMode
      ), l = le(le({
        variableName: o.variableName,
        variableType: In(o.variableType)
      }, o._colRef !== void 0 && { _colRef: o._colRef }), a && { valuesByMode: a });
      n[String(i)] = l;
    }
    return n;
  }
  /**
   * Reconstructs a VariableTable from a serialized table object
   * Handles both new format (without variableKey) and legacy format (with variableKey)
   * Expands compressed variable types (numbers) back to strings
   */
  static fromTable(n) {
    const i = new rt(), o = Object.entries(n).sort(
      (a, l) => parseInt(a[0], 10) - parseInt(l[0], 10)
    );
    for (const [a, l] of o) {
      const r = parseInt(a, 10), c = wn(l.variableType), d = Ee(le({}, l), {
        variableType: c
        // Always a string after expansion
      });
      i.variables[r] = d, i.nextIndex = Math.max(i.nextIndex, r + 1);
    }
    return i;
  }
  /**
   * Gets the total number of variables in the table
   */
  getSize() {
    return this.variables.length;
  }
}
function An(e) {
  return {
    _varRef: e
  };
}
function ze(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let Pn = 0;
const it = /* @__PURE__ */ new Map();
function Tn(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const n = it.get(e.requestId);
  n && (it.delete(e.requestId), e.error || !e.guid ? n.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : n.resolve(e.guid));
}
function wt() {
  return new Promise((e, n) => {
    const i = `guid_${Date.now()}_${++Pn}`;
    it.set(i, { resolve: e, reject: n }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: i
    }), setTimeout(() => {
      it.has(i) && (it.delete(i), n(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
const He = [], t = {
  clear: () => {
    console.clear(), He.length = 0;
  },
  log: (e) => {
    console.log(e), He.push({
      type: "log",
      message: e
    });
  },
  warning: (e) => {
    console.warn(e), He.push({
      type: "warning",
      message: e
    });
  },
  error: (e) => {
    console.error(e), He.push({
      type: "error",
      message: e
    });
  },
  /**
   * Get all collected logs without clearing the buffer
   */
  getLogs: () => [...He],
  /**
   * Get all collected logs and clear the buffer
   */
  flush: () => {
    const e = [...He];
    return He.length = 0, e;
  }
};
function On(e, n) {
  const i = n.modes.find((o) => o.modeId === e);
  return i ? i.name : e;
}
async function jt(e, n, i, o, a = /* @__PURE__ */ new Set()) {
  const l = {};
  for (const [r, c] of Object.entries(e)) {
    const d = On(r, o);
    if (c == null) {
      l[d] = c;
      continue;
    }
    if (typeof c == "string" || typeof c == "number" || typeof c == "boolean") {
      l[d] = c;
      continue;
    }
    if (typeof c == "object" && c !== null && "type" in c && c.type === "VARIABLE_ALIAS" && "id" in c) {
      const p = c.id;
      if (a.has(p)) {
        l[d] = {
          type: "VARIABLE_ALIAS",
          id: p
        };
        continue;
      }
      const h = await figma.variables.getVariableByIdAsync(p);
      if (!h) {
        l[d] = {
          type: "VARIABLE_ALIAS",
          id: p
        };
        continue;
      }
      const $ = new Set(a);
      $.add(p);
      const y = await figma.variables.getVariableCollectionByIdAsync(
        h.variableCollectionId
      ), m = h.key;
      if (!m) {
        l[d] = {
          type: "VARIABLE_ALIAS",
          id: p
        };
        continue;
      }
      const b = {
        variableName: h.name,
        variableType: h.resolvedType,
        collectionName: y == null ? void 0 : y.name,
        collectionId: h.variableCollectionId,
        variableKey: m,
        id: p,
        isLocal: !h.remote
      };
      if (y) {
        const v = await Jt(
          y,
          i
        );
        b._colRef = v, h.valuesByMode && (b.valuesByMode = await jt(
          h.valuesByMode,
          n,
          i,
          y,
          // Pass collection for mode ID to name conversion
          $
        ));
      }
      const s = n.addVariable(b);
      l[d] = {
        type: "VARIABLE_ALIAS",
        id: p,
        _varRef: s
      };
    } else
      l[d] = c;
  }
  return l;
}
const lt = "recursica:collectionId";
async function xn(e) {
  if (e.remote === !0) {
    const i = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(i)) {
      const a = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw t.error(a), new Error(a);
    }
    return e.id;
  } else {
    if (Ge(e.name)) {
      const a = ft(e.name);
      if (a) {
        const l = e.getSharedPluginData(
          "recursica",
          lt
        );
        return (!l || l.trim() === "") && e.setSharedPluginData(
          "recursica",
          lt,
          a
        ), a;
      }
    }
    const i = e.getSharedPluginData(
      "recursica",
      lt
    );
    if (i && i.trim() !== "")
      return i;
    const o = await wt();
    return e.setSharedPluginData("recursica", lt, o), o;
  }
}
function Vn(e, n) {
  if (n)
    return;
  const i = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(i))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Jt(e, n) {
  const i = !e.remote, o = n.getCollectionIndex(e.id);
  if (o !== -1)
    return o;
  Vn(e.name, i);
  const a = await xn(e), l = e.modes.map((p) => p.name), r = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: i,
    modes: l,
    collectionGuid: a
  }, c = n.addCollection(r), d = i ? "local" : "remote";
  return t.log(
    `  Added ${d} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), c;
}
async function St(e, n, i) {
  if (!e || typeof e != "object" || e.type !== "VARIABLE_ALIAS")
    return null;
  try {
    const o = await figma.variables.getVariableByIdAsync(e.id);
    if (!o)
      return console.log("Could not resolve variable alias:", e.id), null;
    const a = await figma.variables.getVariableCollectionByIdAsync(
      o.variableCollectionId
    );
    if (!a)
      return console.log("Could not resolve collection for variable:", e.id), null;
    const l = o.key;
    if (!l)
      return console.log("Variable missing key:", e.id), null;
    const r = await Jt(
      a,
      i
    ), c = {
      variableName: o.name,
      variableType: o.resolvedType,
      _colRef: r,
      // Reference to collection table (v2.4.0+)
      variableKey: l,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    o.valuesByMode && (c.valuesByMode = await jt(
      o.valuesByMode,
      n,
      i,
      a,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const d = n.addVariable(c);
    return An(d);
  } catch (o) {
    const a = o instanceof Error ? o.message : String(o);
    throw console.error("Could not resolve variable alias:", e.id, o), new Error(
      `Failed to resolve variable alias ${e.id}: ${a}`
    );
  }
}
async function We(e, n, i) {
  if (!e || typeof e != "object") return e;
  const o = {};
  for (const a in e)
    if (Object.prototype.hasOwnProperty.call(e, a)) {
      const l = e[a];
      if (l && typeof l == "object" && !Array.isArray(l))
        if (l.type === "VARIABLE_ALIAS") {
          const r = await St(
            l,
            n,
            i
          );
          r && (o[a] = r);
        } else
          o[a] = await We(
            l,
            n,
            i
          );
      else Array.isArray(l) ? o[a] = await Promise.all(
        l.map(async (r) => (r == null ? void 0 : r.type) === "VARIABLE_ALIAS" ? await St(
          r,
          n,
          i
        ) || r : r && typeof r == "object" ? await We(
          r,
          n,
          i
        ) : r)
      ) : o[a] = l;
    }
  return o;
}
async function Dt(e, n, i) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (o) => {
      if (!o || typeof o != "object") return o;
      const a = {};
      for (const l in o)
        Object.prototype.hasOwnProperty.call(o, l) && (l === "boundVariables" ? a[l] = await We(
          o[l],
          n,
          i
        ) : a[l] = o[l]);
      return a;
    })
  );
}
async function Ht(e, n, i) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (o) => {
      if (!o || typeof o != "object") return o;
      const a = {};
      for (const l in o)
        Object.prototype.hasOwnProperty.call(o, l) && (l === "boundVariables" ? a[l] = await We(
          o[l],
          n,
          i
        ) : a[l] = o[l]);
      return a;
    })
  );
}
const qe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  extractBoundVariables: We,
  resolveVariableAliasMetadata: St,
  serializeBackgrounds: Ht,
  serializeFills: Dt
}, Symbol.toStringTag, { value: "Module" }));
async function Wt(e, n) {
  var d, p;
  const i = {}, o = /* @__PURE__ */ new Set();
  e.type && (i.type = e.type, o.add("type")), e.id && (i.id = e.id, o.add("id")), e.name !== void 0 && e.name !== "" && (i.name = e.name, o.add("name")), e.x !== void 0 && e.x !== 0 && (i.x = e.x, o.add("x")), e.y !== void 0 && e.y !== 0 && (i.y = e.y, o.add("y")), e.width !== void 0 && (i.width = e.width, o.add("width")), e.height !== void 0 && (i.height = e.height, o.add("height"));
  const a = e.name || "Unnamed";
  e.preserveRatio !== void 0 && t.log(
    `[ISSUE #3 EXPORT DEBUG] "${a}" has preserveRatio: ${e.preserveRatio} (NOT being exported - needs to be added!)`
  );
  const l = e.type;
  if (l === "FRAME" || l === "COMPONENT" || l === "INSTANCE" || l === "GROUP" || l === "BOOLEAN_OPERATION" || l === "VECTOR" || l === "STAR" || l === "LINE" || l === "ELLIPSE" || l === "POLYGON" || l === "RECTANGLE" || l === "TEXT") {
    const h = e.constraintHorizontal !== void 0 ? e.constraintHorizontal : (d = e.constraints) == null ? void 0 : d.horizontal, $ = e.constraintVertical !== void 0 ? e.constraintVertical : (p = e.constraints) == null ? void 0 : p.vertical;
    h !== void 0 && ge(
      h,
      Ie.constraintHorizontal
    ) && (i.constraintHorizontal = h, o.add("constraintHorizontal")), $ !== void 0 && ge(
      $,
      Ie.constraintVertical
    ) && (i.constraintVertical = $, o.add("constraintVertical"));
  }
  if (e.visible !== void 0 && ge(e.visible, Ie.visible) && (i.visible = e.visible, o.add("visible")), e.locked !== void 0 && ge(e.locked, Ie.locked) && (i.locked = e.locked, o.add("locked")), e.opacity !== void 0 && ge(e.opacity, Ie.opacity) && (i.opacity = e.opacity, o.add("opacity")), e.rotation !== void 0 && ge(e.rotation, Ie.rotation) && (i.rotation = e.rotation, o.add("rotation")), e.blendMode !== void 0 && ge(e.blendMode, Ie.blendMode) && (i.blendMode = e.blendMode, o.add("blendMode")), e.effects !== void 0 && ge(e.effects, Ie.effects) && (i.effects = e.effects, o.add("effects")), e.fills !== void 0) {
    const h = await Dt(
      e.fills,
      n.variableTable,
      n.collectionTable
    );
    ge(h, Ie.fills) && (i.fills = h), o.add("fills");
  }
  if (e.strokes !== void 0 && ge(e.strokes, Ie.strokes) && (i.strokes = e.strokes, o.add("strokes")), e.strokeWeight !== void 0 && ge(e.strokeWeight, Ie.strokeWeight) && (i.strokeWeight = e.strokeWeight, o.add("strokeWeight")), e.strokeAlign !== void 0 && ge(e.strokeAlign, Ie.strokeAlign) && (i.strokeAlign = e.strokeAlign, o.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const h = e.name || "Unnamed", $ = Object.keys(e.boundVariables);
    $.length > 0 ? t.log(
      `[ISSUE #2 EXPORT DEBUG] "${h}" (${e.type}) has boundVariables for: ${$.join(", ")}`
    ) : t.log(
      `[ISSUE #2 EXPORT DEBUG] "${h}" (${e.type}) has no boundVariables`
    );
    const y = await We(
      e.boundVariables,
      n.variableTable,
      n.collectionTable
    ), m = Object.keys(y);
    m.length > 0 && t.log(
      `[ISSUE #2 EXPORT DEBUG] "${h}" extracted boundVariables: ${m.join(", ")}`
    ), Object.keys(y).length > 0 && (i.boundVariables = y), o.add("boundVariables");
  }
  if (e.backgrounds !== void 0) {
    const h = await Ht(
      e.backgrounds,
      n.variableTable,
      n.collectionTable
    );
    h && Array.isArray(h) && h.length > 0 && (i.backgrounds = h), o.add("backgrounds");
  }
  const c = e.selectionColor;
  return c !== void 0 && (i.selectionColor = c, o.add("selectionColor")), i;
}
const Rn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseBaseNodeProperties: Wt
}, Symbol.toStringTag, { value: "Module" }));
async function Nt(e, n) {
  const i = {}, o = /* @__PURE__ */ new Set();
  if (e.type === "COMPONENT")
    try {
      e.componentPropertyDefinitions && (i.componentPropertyDefinitions = e.componentPropertyDefinitions, o.add("componentPropertyDefinitions"));
    } catch (a) {
    }
  return e.layoutMode !== void 0 && ge(e.layoutMode, Ae.layoutMode) && (i.layoutMode = e.layoutMode, o.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && ge(
    e.primaryAxisSizingMode,
    Ae.primaryAxisSizingMode
  ) && (i.primaryAxisSizingMode = e.primaryAxisSizingMode, o.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && ge(
    e.counterAxisSizingMode,
    Ae.counterAxisSizingMode
  ) && (i.counterAxisSizingMode = e.counterAxisSizingMode, o.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && ge(
    e.primaryAxisAlignItems,
    Ae.primaryAxisAlignItems
  ) && (i.primaryAxisAlignItems = e.primaryAxisAlignItems, o.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && ge(
    e.counterAxisAlignItems,
    Ae.counterAxisAlignItems
  ) && (i.counterAxisAlignItems = e.counterAxisAlignItems, o.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && ge(e.paddingLeft, Ae.paddingLeft) && (i.paddingLeft = e.paddingLeft, o.add("paddingLeft")), e.paddingRight !== void 0 && ge(e.paddingRight, Ae.paddingRight) && (i.paddingRight = e.paddingRight, o.add("paddingRight")), e.paddingTop !== void 0 && ge(e.paddingTop, Ae.paddingTop) && (i.paddingTop = e.paddingTop, o.add("paddingTop")), e.paddingBottom !== void 0 && ge(e.paddingBottom, Ae.paddingBottom) && (i.paddingBottom = e.paddingBottom, o.add("paddingBottom")), e.itemSpacing !== void 0 && ge(e.itemSpacing, Ae.itemSpacing) && (i.itemSpacing = e.itemSpacing, o.add("itemSpacing")), e.counterAxisSpacing !== void 0 && ge(
    e.counterAxisSpacing,
    Ae.counterAxisSpacing
  ) && (i.counterAxisSpacing = e.counterAxisSpacing, o.add("counterAxisSpacing")), e.cornerRadius !== void 0 && ge(e.cornerRadius, Ae.cornerRadius) && (i.cornerRadius = e.cornerRadius, o.add("cornerRadius")), e.clipsContent !== void 0 && ge(e.clipsContent, Ae.clipsContent) && (i.clipsContent = e.clipsContent, o.add("clipsContent")), e.layoutWrap !== void 0 && ge(e.layoutWrap, Ae.layoutWrap) && (i.layoutWrap = e.layoutWrap, o.add("layoutWrap")), e.layoutGrow !== void 0 && ge(e.layoutGrow, Ae.layoutGrow) && (i.layoutGrow = e.layoutGrow, o.add("layoutGrow")), i;
}
const Mn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseFrameProperties: Nt
}, Symbol.toStringTag, { value: "Module" })), Be = {
  fontSize: 12,
  fontName: { family: "Roboto", style: "Regular" },
  letterSpacing: { value: 0, unit: "PIXELS" },
  lineHeight: { unit: "AUTO" },
  textCase: "ORIGINAL",
  textDecoration: "NONE",
  paragraphSpacing: 0,
  paragraphIndent: 0
};
async function kn(e, n) {
  const i = {};
  if (e.fontSize !== Be.fontSize && (i.fontSize = e.fontSize), (e.fontName.family !== Be.fontName.family || e.fontName.style !== Be.fontName.style) && (i.fontName = e.fontName), JSON.stringify(e.letterSpacing) !== JSON.stringify(Be.letterSpacing) && (i.letterSpacing = e.letterSpacing), JSON.stringify(e.lineHeight) !== JSON.stringify(Be.lineHeight) && (i.lineHeight = e.lineHeight), e.textCase !== Be.textCase && (i.textCase = e.textCase), e.textDecoration !== Be.textDecoration && (i.textDecoration = e.textDecoration), e.paragraphSpacing !== Be.paragraphSpacing && (i.paragraphSpacing = e.paragraphSpacing), e.paragraphIndent !== Be.paragraphIndent && (i.paragraphIndent = e.paragraphIndent), e.boundVariables) {
    const o = await We(
      e.boundVariables,
      n.variableTable,
      n.collectionTable
    );
    Object.keys(o).length > 0 && (i.boundVariables = o);
  }
  return i;
}
async function Un(e, n) {
  const i = {}, o = /* @__PURE__ */ new Set();
  if (e.textStyleId !== void 0 && e.textStyleId !== "")
    try {
      const a = await figma.getStyleByIdAsync(e.textStyleId);
      if (a && a.type === "TEXT") {
        let l = n.styleTable.getStyleIndex(a.key);
        if (l < 0) {
          const r = await kn(a, n);
          l = n.styleTable.addStyle({
            type: "TEXT",
            name: a.name,
            styleKey: a.key,
            textStyle: r,
            boundVariables: r.boundVariables
          }), t.log(
            `  [EXPORT] Added text style "${a.name}" to style table at index ${l} for text node "${e.name || "Unnamed"}"`
          );
        } else
          t.log(
            `  [EXPORT] Reusing existing text style "${a.name}" from style table at index ${l} for text node "${e.name || "Unnamed"}"`
          );
        i._styleRef = l, o.add("_styleRef"), o.add("textStyleId"), t.log(
          `  [EXPORT] ✓ Exported text node "${e.name || "Unnamed"}" with _styleRef=${l} (style: "${a.name}")`
        );
      } else
        t.warning(
          `  [EXPORT] Text node "${e.name || "Unnamed"}" has textStyleId but style lookup returned null or wrong type`
        );
    } catch (a) {
      t.warning(
        `  [EXPORT] Could not look up text style for node "${e.name || "Unnamed"}": ${a}`
      );
    }
  else
    t.log(
      `  [EXPORT] Text node "${e.name || "Unnamed"}" has no textStyleId (textStyleId=${e.textStyleId})`
    );
  return e.characters !== void 0 && e.characters !== "" && (i.characters = e.characters, o.add("characters")), e.fontName !== void 0 && (i.fontName = e.fontName, o.add("fontName")), e.fontSize !== void 0 && (i.fontSize = e.fontSize, o.add("fontSize")), e.textAlignHorizontal !== void 0 && ge(
    e.textAlignHorizontal,
    ke.textAlignHorizontal
  ) && (i.textAlignHorizontal = e.textAlignHorizontal, o.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && ge(
    e.textAlignVertical,
    ke.textAlignVertical
  ) && (i.textAlignVertical = e.textAlignVertical, o.add("textAlignVertical")), e.letterSpacing !== void 0 && ge(e.letterSpacing, ke.letterSpacing) && (i.letterSpacing = e.letterSpacing, o.add("letterSpacing")), e.lineHeight !== void 0 && ge(e.lineHeight, ke.lineHeight) && (i.lineHeight = e.lineHeight, o.add("lineHeight")), e.textCase !== void 0 && ge(e.textCase, ke.textCase) && (i.textCase = e.textCase, o.add("textCase")), e.textDecoration !== void 0 && ge(e.textDecoration, ke.textDecoration) && (i.textDecoration = e.textDecoration, o.add("textDecoration")), e.textAutoResize !== void 0 && ge(e.textAutoResize, ke.textAutoResize) && (i.textAutoResize = e.textAutoResize, o.add("textAutoResize")), e.paragraphSpacing !== void 0 && ge(
    e.paragraphSpacing,
    ke.paragraphSpacing
  ) && (i.paragraphSpacing = e.paragraphSpacing, o.add("paragraphSpacing")), e.paragraphIndent !== void 0 && ge(e.paragraphIndent, ke.paragraphIndent) && (i.paragraphIndent = e.paragraphIndent, o.add("paragraphIndent")), e.listOptions !== void 0 && ge(e.listOptions, ke.listOptions) && (i.listOptions = e.listOptions, o.add("listOptions")), i;
}
function Ln(e) {
  const n = e.match(/^(\d+\.?\d*)[eE]([+-]?\d+)$/);
  if (n) {
    const i = parseFloat(n[1]), o = parseInt(n[2]), a = i * Math.pow(10, o);
    return Math.abs(a) < 1e-10 ? "0" : a.toFixed(6).replace(/\.?0+$/, "") || "0";
  }
  return e;
}
function Kt(e) {
  if (!e || typeof e != "string")
    return e;
  let n = e.replace(/(\d+\.?\d*)[eE]([+-]?\d+)/g, (i) => Ln(i));
  return n = n.replace(
    /(\d+\.\d{7,})/g,
    // Match numbers with more than 6 decimal places
    (i) => {
      const o = parseFloat(i);
      return Math.abs(o) < 1e-10 ? "0" : o.toFixed(6).replace(/\.?0+$/, "") || "0";
    }
  ), n = n.replace(
    /([MmLlHhVvCcSsQqTtAaZz])([-\d])/g,
    (i, o, a) => `${o} ${a}`
  ), n = n.replace(/\s+/g, " ").trim(), n;
}
function Ct(e) {
  return Array.isArray(e) ? e.map((n) => ({
    data: Kt(n.data),
    // Normalize winding rule key (use windRule consistently)
    windRule: n.windRule || n.windingRule || "NONZERO"
  })) : e;
}
const Fn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  normalizeSvgPath: Kt,
  normalizeVectorGeometry: Ct
}, Symbol.toStringTag, { value: "Module" }));
async function Bn(e, n) {
  const i = {}, o = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && ge(e.fillGeometry, Ye.fillGeometry) && (i.fillGeometry = Ct(e.fillGeometry), o.add("fillGeometry")), e.strokeGeometry !== void 0 && ge(e.strokeGeometry, Ye.strokeGeometry) && (i.strokeGeometry = Ct(e.strokeGeometry), o.add("strokeGeometry")), e.strokeCap !== void 0 && ge(e.strokeCap, Ye.strokeCap) && (i.strokeCap = e.strokeCap, o.add("strokeCap")), e.strokeJoin !== void 0 && ge(e.strokeJoin, Ye.strokeJoin) && (i.strokeJoin = e.strokeJoin, o.add("strokeJoin")), e.dashPattern !== void 0 && ge(e.dashPattern, Ye.dashPattern) && (i.dashPattern = e.dashPattern, o.add("dashPattern")), i;
}
async function Gn(e, n) {
  const i = {}, o = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && ge(e.cornerRadius, zt.cornerRadius) && (i.cornerRadius = e.cornerRadius, o.add("cornerRadius")), e.pointCount !== void 0 && (i.pointCount = e.pointCount, o.add("pointCount")), e.innerRadius !== void 0 && (i.innerRadius = e.innerRadius, o.add("innerRadius")), e.pointCount !== void 0 && (i.pointCount = e.pointCount, o.add("pointCount")), i;
}
const ct = /* @__PURE__ */ new Map();
let _n = 0;
function zn() {
  return `prompt_${Date.now()}_${++_n}`;
}
const tt = {
  /**
   * Prompt the user with a message and wait for OK or Cancel response
   * @param message - The message to display to the user
   * @param optionsOrTimeout - Optional configuration object or timeout in milliseconds (for backwards compatibility)
   * @param optionsOrTimeout.timeoutMs - Timeout in milliseconds. Defaults to 300000 (5 minutes). Set to -1 for no timeout.
   * @param optionsOrTimeout.okLabel - Custom label for the OK button. Defaults to "OK".
   * @param optionsOrTimeout.cancelLabel - Custom label for the cancel button. Defaults to "Cancel".
   * @returns Promise that resolves on OK, rejects on Cancel or timeout
   */
  prompt: (e, n) => {
    var c;
    const i = typeof n == "number" ? { timeoutMs: n } : n, o = (c = i == null ? void 0 : i.timeoutMs) != null ? c : 3e5, a = i == null ? void 0 : i.okLabel, l = i == null ? void 0 : i.cancelLabel, r = zn();
    return new Promise((d, p) => {
      const h = o === -1 ? null : setTimeout(() => {
        ct.delete(r), p(new Error(`Plugin prompt timeout: ${e}`));
      }, o);
      ct.set(r, {
        resolve: d,
        reject: p,
        timeout: h
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: le(le({
          message: e,
          requestId: r
        }, a && { okLabel: a }), l && { cancelLabel: l })
      });
    });
  },
  /**
   * Clear the current prompt from the UI
   */
  clear: () => {
    figma.ui.postMessage({
      type: "PluginPromptClear"
    });
  },
  /**
   * Handle a response from the UI
   * This is called by the pluginPromptResponse service
   * @param data - The response data containing requestId and action
   */
  handleResponse: (e) => {
    const { requestId: n, action: i } = e, o = ct.get(n);
    if (!o) {
      console.warn(
        `Received response for unknown prompt request: ${n}`
      );
      return;
    }
    o.timeout && clearTimeout(o.timeout), ct.delete(n), i === "ok" ? o.resolve() : o.reject(new Error("User cancelled"));
  }
}, jn = "RecursicaPublishedMetadata";
function vt(e) {
  let n = e, i = !1;
  try {
    if (i = n.parent !== null && n.parent !== void 0, !i)
      return { page: null, reason: "detached" };
  } catch (o) {
    return { page: null, reason: "detached" };
  }
  for (; n; ) {
    if (n.type === "PAGE")
      return { page: n, reason: "found" };
    try {
      const o = n.parent;
      if (!o)
        return { page: null, reason: "broken_chain" };
      n = o;
    } catch (o) {
      return { page: null, reason: "access_error" };
    }
  }
  return { page: null, reason: "broken_chain" };
}
function Ut(e) {
  try {
    const n = e.getPluginData(jn);
    if (!n || n.trim() === "")
      return null;
    const i = JSON.parse(n);
    return {
      id: i.id,
      version: i.version
    };
  } catch (n) {
    return null;
  }
}
async function Jn(e, n) {
  var a, l;
  const i = {}, o = /* @__PURE__ */ new Set();
  if (i._isInstance = !0, o.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const r = await e.getMainComponentAsync();
    if (!r) {
      const E = e.name || "(unnamed)", O = e.id;
      if (n.detachedComponentsHandled.has(O))
        t.log(
          `Treating detached instance "${E}" as internal instance (already prompted)`
        );
      else {
        t.warning(
          `Found detached instance: "${E}" (main component is missing)`
        );
        const w = `Found detached instance "${E}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await tt.prompt(w, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), n.detachedComponentsHandled.add(O), t.log(
            `Treating detached instance "${E}" as internal instance`
          );
        } catch (V) {
          if (V instanceof Error && V.message === "User cancelled") {
            const z = `Export cancelled: Detached instance "${E}" found. Please fix the instance before exporting.`;
            t.error(z);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch (Z) {
              console.warn("Could not scroll to instance:", Z);
            }
            throw new Error(z);
          } else
            throw V;
        }
      }
      if (!vt(e).page) {
        const w = `Detached instance "${E}" is not on any page. Cannot export.`;
        throw t.error(w), new Error(w);
      }
      let x, S;
      try {
        e.variantProperties && (x = e.variantProperties), e.componentProperties && (S = e.componentProperties);
      } catch (w) {
      }
      const u = le(le({
        instanceType: "internal",
        componentName: E,
        componentNodeId: e.id
      }, x && { variantProperties: x }), S && { componentProperties: S }), P = n.instanceTable.addInstance(u);
      return i._instanceRef = P, o.add("_instanceRef"), t.log(
        `  Exported detached INSTANCE: "${E}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), i;
    }
    const c = e.name || "(unnamed)", d = r.name || "(unnamed)", p = r.remote === !0, $ = vt(e).page, y = vt(r);
    let m = y.page;
    if (!m && p)
      try {
        await figma.loadAllPagesAsync();
        const E = figma.root.children;
        let O = null;
        for (const I of E)
          try {
            if (I.findOne(
              (x) => x.id === r.id
            )) {
              O = I;
              break;
            }
          } catch (B) {
          }
        if (!O) {
          const I = r.id.split(":")[0];
          for (const B of E) {
            const x = B.id.split(":")[0];
            if (I === x) {
              O = B;
              break;
            }
          }
        }
        O && (m = O);
      } catch (E) {
      }
    let b, s = m;
    if (p)
      if (m) {
        const E = Ut(m);
        b = "normal", s = m, E != null && E.id ? t.log(
          `  Component "${d}" is from library but also exists on local page "${m.name}" with metadata. Treating as "normal" instance.`
        ) : t.log(
          `  Component "${d}" is from library and exists on local page "${m.name}" (no metadata). Treating as "normal" instance - page should be published first.`
        );
      } else
        b = "remote", t.log(
          `  Component "${d}" is from library and not on a local page. Treating as "remote" instance.`
        );
    else if (m && $ && m.id === $.id)
      b = "internal";
    else if (m && $ && m.id !== $.id)
      b = "normal";
    else if (m && !$)
      b = "normal";
    else if (!p && y.reason === "detached") {
      const E = r.id;
      if (n.detachedComponentsHandled.has(E))
        b = "remote", t.log(
          `Treating detached instance "${c}" -> component "${d}" as remote instance (already prompted)`
        );
      else {
        t.warning(
          `Found detached instance: "${c}" -> component "${d}" (component is not on any page)`
        );
        try {
          await figma.viewport.scrollAndZoomIntoView([r]);
        } catch (I) {
          console.warn("Could not scroll to component:", I);
        }
        const O = `Found detached instance "${c}" attached to component "${d}". This should be fixed. Continue to publish?`;
        try {
          await tt.prompt(O, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), n.detachedComponentsHandled.add(E), b = "remote", t.log(
            `Treating detached instance "${c}" as remote instance (will be created on REMOTES page)`
          );
        } catch (I) {
          if (I instanceof Error && I.message === "User cancelled") {
            const B = `Export cancelled: Detached instance "${c}" found. The component "${d}" is not on any page. Please fix the instance before exporting.`;
            throw t.error(B), new Error(B);
          } else
            throw I;
        }
      }
    } else
      p || t.warning(
        `  Instance "${c}" -> component "${d}": componentPage is null but component is not remote. Reason: ${y.reason}. Cannot determine instance type.`
      ), b = "normal";
    let v, g;
    try {
      if (e.variantProperties && (v = e.variantProperties, t.log(
        `  Instance "${c}" -> variantProperties from instance: ${JSON.stringify(v)}`
      )), typeof e.getProperties == "function")
        try {
          const E = await e.getProperties();
          E && E.variantProperties && (t.log(
            `  Instance "${c}" -> variantProperties from getProperties(): ${JSON.stringify(E.variantProperties)}`
          ), E.variantProperties && Object.keys(E.variantProperties).length > 0 && (v = E.variantProperties));
        } catch (E) {
          t.log(
            `  Instance "${c}" -> getProperties() not available or failed: ${E}`
          );
        }
      if (e.componentProperties && (g = e.componentProperties), r.parent && r.parent.type === "COMPONENT_SET") {
        const E = r.parent;
        try {
          const O = E.componentPropertyDefinitions;
          O && t.log(
            `  Component set "${E.name}" has property definitions: ${JSON.stringify(Object.keys(O))}`
          );
          const I = {}, B = d.split(",").map((x) => x.trim());
          for (const x of B) {
            const S = x.split("=").map((u) => u.trim());
            if (S.length >= 2) {
              const u = S[0], P = S.slice(1).join("=").trim();
              O && O[u] && (I[u] = P);
            }
          }
          if (Object.keys(I).length > 0 && t.log(
            `  Parsed variant properties from component name "${d}": ${JSON.stringify(I)}`
          ), v && Object.keys(v).length > 0)
            t.log(
              `  Using variant properties from instance (source of truth): ${JSON.stringify(v)}`
            );
          else if (Object.keys(I).length > 0)
            v = I, t.log(
              `  Using variant properties from component name (fallback): ${JSON.stringify(v)}`
            );
          else if (r.variantProperties) {
            const x = r.variantProperties;
            t.log(
              `  Main component "${d}" has variantProperties: ${JSON.stringify(x)}`
            ), v = x;
          }
        } catch (O) {
          t.warning(
            `  Could not get variant properties from component set: ${O}`
          );
        }
      }
    } catch (E) {
    }
    let C, M;
    try {
      let E = r.parent;
      const O = [];
      let I = 0;
      const B = 20;
      for (; E && I < B; )
        try {
          const x = E.type, S = E.name;
          if (x === "COMPONENT_SET" && !M && (M = S), x === "PAGE")
            break;
          const u = S || "";
          O.unshift(u), (M === "arrow-top-right-on-square" || d === "arrow-top-right-on-square") && t.log(
            `  [PATH BUILD] Added segment: "${u}" (type: ${x}) to path for component "${d}"`
          ), E = E.parent, I++;
        } catch (x) {
          (M === "arrow-top-right-on-square" || d === "arrow-top-right-on-square") && t.warning(
            `  [PATH BUILD] Error building path for "${d}": ${x}`
          );
          break;
        }
      C = O, (M === "arrow-top-right-on-square" || d === "arrow-top-right-on-square") && t.log(
        `  [PATH BUILD] Final path for component "${d}": [${O.join(" → ")}]`
      );
    } catch (E) {
    }
    const H = le(le(le(le({
      instanceType: b,
      componentName: d
    }, M && { componentSetName: M }), v && { variantProperties: v }), g && { componentProperties: g }), b === "normal" ? { path: C || [] } : C && C.length > 0 && {
      path: C
    });
    if (b === "internal") {
      H.componentNodeId = r.id, t.log(
        `  Found INSTANCE: "${c}" -> INTERNAL component "${d}" (ID: ${r.id.substring(0, 8)}...)`
      );
      const E = e.boundVariables, O = r.boundVariables;
      if (E && typeof E == "object") {
        const u = Object.keys(E);
        t.log(
          `  DEBUG: Internal instance "${c}" -> boundVariables keys: ${u.length > 0 ? u.join(", ") : "none"}`
        );
        for (const w of u) {
          const V = E[w], z = (V == null ? void 0 : V.type) || typeof V;
          t.log(
            `  DEBUG:   boundVariables.${w}: type=${z}, value=${JSON.stringify(V)}`
          );
        }
        const P = [
          "backgrounds",
          "selectionColor",
          "selectionColors",
          "selection",
          "selectColor"
        ];
        for (const w of P)
          E[w] !== void 0 && t.log(
            `  DEBUG:   Found potential "Selection colors" property: boundVariables.${w} = ${JSON.stringify(E[w])}`
          );
      } else
        t.log(
          `  DEBUG: Internal instance "${c}" -> No boundVariables found on instance node`
        );
      if (O && typeof O == "object") {
        const u = Object.keys(O);
        t.log(
          `  DEBUG: Main component "${d}" -> boundVariables keys: ${u.length > 0 ? u.join(", ") : "none"}`
        );
      }
      const I = e.backgrounds;
      if (I && Array.isArray(I)) {
        t.log(
          `  DEBUG: Internal instance "${c}" -> backgrounds array length: ${I.length}`
        );
        for (let u = 0; u < I.length; u++) {
          const P = I[u];
          if (P && typeof P == "object") {
            if (t.log(
              `  DEBUG:   backgrounds[${u}] structure: ${JSON.stringify(Object.keys(P))}`
            ), P.boundVariables) {
              const w = Object.keys(P.boundVariables);
              t.log(
                `  DEBUG:   backgrounds[${u}].boundVariables keys: ${w.length > 0 ? w.join(", ") : "none"}`
              );
              for (const V of w) {
                const z = P.boundVariables[V];
                t.log(
                  `  DEBUG:     backgrounds[${u}].boundVariables.${V}: ${JSON.stringify(z)}`
                );
              }
            }
            P.color && t.log(
              `  DEBUG:   backgrounds[${u}].color: ${JSON.stringify(P.color)}`
            );
          }
        }
      }
      const B = Object.keys(e).filter(
        (u) => !u.startsWith("_") && u !== "parent" && u !== "removed" && typeof e[u] != "function" && u !== "type" && u !== "id" && u !== "name" && u !== "boundVariables" && u !== "backgrounds" && u !== "fills"
      ), x = Object.keys(r).filter(
        (u) => !u.startsWith("_") && u !== "parent" && u !== "removed" && typeof r[u] != "function" && u !== "type" && u !== "id" && u !== "name" && u !== "boundVariables" && u !== "backgrounds" && u !== "fills"
      ), S = [
        .../* @__PURE__ */ new Set([...B, ...x])
      ].filter(
        (u) => u.toLowerCase().includes("selection") || u.toLowerCase().includes("select") || u.toLowerCase().includes("color") && !u.toLowerCase().includes("fill") && !u.toLowerCase().includes("stroke")
      );
      if (S.length > 0) {
        t.log(
          `  DEBUG: Found selection/color-related properties: ${S.join(", ")}`
        );
        for (const u of S)
          try {
            if (B.includes(u)) {
              const P = e[u];
              t.log(
                `  DEBUG:   Instance.${u}: ${JSON.stringify(P)}`
              );
            }
            if (x.includes(u)) {
              const P = r[u];
              t.log(
                `  DEBUG:   MainComponent.${u}: ${JSON.stringify(P)}`
              );
            }
          } catch (P) {
          }
      } else
        t.log(
          "  DEBUG: No selection/color-related properties found on instance or main component"
        );
    } else if (b === "normal") {
      const E = s || m;
      if (E) {
        H.componentPageName = E.name;
        const I = Ut(E);
        I != null && I.id && I.version !== void 0 ? (H.componentGuid = I.id, H.componentVersion = I.version, t.log(
          `  Found INSTANCE: "${c}" -> NORMAL component "${d}" (ID: ${r.id.substring(0, 8)}...) at path [${(C || []).join(" → ")}]`
        )) : t.warning(
          `  Instance "${c}" -> component "${d}" is classified as normal but page "${E.name}" has no metadata. This instance will not be importable.`
        );
      } else {
        const I = r.id;
        let B = "", x = "";
        switch (y.reason) {
          case "broken_chain":
            B = "The component's parent chain is broken and cannot be traversed to find the page", x = "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            B = "Cannot access the component's parent chain (access error)", x = "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            B = "Cannot determine which page the component is on", x = "Please ensure the component is properly placed on a page.";
        }
        try {
          await figma.viewport.scrollAndZoomIntoView([r]);
        } catch (P) {
          console.warn("Could not scroll to component:", P);
        }
        const S = `Normal instance "${c}" -> component "${d}" (ID: ${I}) has no componentPage. ${B}. ${x} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", S), t.error(S);
        const u = new Error(S);
        throw console.error("Throwing error:", u), u;
      }
      C === void 0 && console.warn(
        `Failed to build path for normal instance "${c}" -> component "${d}". Path is required for resolution.`
      );
      const O = C && C.length > 0 ? ` at path [${C.join(" → ")}]` : " at page root";
      t.log(
        `  Found INSTANCE: "${c}" -> NORMAL component "${d}" (ID: ${r.id.substring(0, 8)}...)${O}`
      );
    } else if (b === "remote") {
      let E, O;
      const I = n.detachedComponentsHandled.has(
        r.id
      );
      if (!I)
        try {
          if (typeof r.getPublishStatusAsync == "function")
            try {
              const x = await r.getPublishStatusAsync();
              x && typeof x == "object" && (x.libraryName && (E = x.libraryName), x.libraryKey && (O = x.libraryKey));
            } catch (x) {
            }
          try {
            const x = figma.teamLibrary;
            if (typeof (x == null ? void 0 : x.getAvailableLibraryComponentSetsAsync) == "function") {
              const S = await x.getAvailableLibraryComponentSetsAsync();
              if (S && Array.isArray(S)) {
                for (const u of S)
                  if (u.key === r.key || u.name === r.name) {
                    u.libraryName && (E = u.libraryName), u.libraryKey && (O = u.libraryKey);
                    break;
                  }
              }
            }
          } catch (x) {
          }
        } catch (x) {
          console.warn(
            `Error getting library info for remote component "${d}":`,
            x
          );
        }
      if (E && (H.remoteLibraryName = E), O && (H.remoteLibraryKey = O), I && (H.componentNodeId = r.id), n.instanceTable.getInstanceIndex(H) !== -1)
        t.log(
          `  Found INSTANCE: "${c}" -> REMOTE component "${d}" (ID: ${r.id.substring(0, 8)}...)${I ? " [DETACHED]" : ""}`
        );
      else
        try {
          const { parseBaseNodeProperties: x } = await Promise.resolve().then(() => Rn), S = await x(e, n), { parseFrameProperties: u } = await Promise.resolve().then(() => Mn), P = await u(e, n), w = Ee(le(le({}, S), P), {
            type: "COMPONENT"
            // Convert to COMPONENT type for recreation (must be after baseProps to override)
          });
          if (e.children && Array.isArray(e.children) && e.children.length > 0) {
            const V = Ee(le({}, n), {
              depth: (n.depth || 0) + 1
            }), { extractNodeData: z } = await Promise.resolve().then(() => qn), Z = [];
            for (const k of e.children)
              try {
                let L;
                if (k.type === "INSTANCE")
                  try {
                    const q = await k.getMainComponentAsync();
                    if (q) {
                      const Q = await x(
                        k,
                        n
                      ), te = await u(
                        k,
                        n
                      ), ne = await z(
                        q,
                        /* @__PURE__ */ new WeakSet(),
                        V
                      );
                      L = Ee(le(le(le({}, ne), Q), te), {
                        type: "COMPONENT"
                        // Convert to COMPONENT
                      });
                    } else
                      L = await z(
                        k,
                        /* @__PURE__ */ new WeakSet(),
                        V
                      ), L.type === "INSTANCE" && (L.type = "COMPONENT"), delete L._instanceRef;
                  } catch (q) {
                    L = await z(
                      k,
                      /* @__PURE__ */ new WeakSet(),
                      V
                    ), L.type === "INSTANCE" && (L.type = "COMPONENT"), delete L._instanceRef;
                  }
                else {
                  L = await z(
                    k,
                    /* @__PURE__ */ new WeakSet(),
                    V
                  );
                  const q = k.boundVariables;
                  if (q && typeof q == "object") {
                    const Q = Object.keys(q);
                    Q.length > 0 && (t.log(
                      `  DEBUG: Child "${k.name || "Unnamed"}" -> boundVariables keys: ${Q.join(", ")}`
                    ), q.backgrounds !== void 0 && t.log(
                      `  DEBUG:   Child "${k.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(q.backgrounds)}`
                    ));
                  }
                  if (r.children && Array.isArray(r.children)) {
                    const Q = r.children.find(
                      (te) => te.name === k.name
                    );
                    if (Q) {
                      const te = Q.boundVariables;
                      if (te && typeof te == "object") {
                        const ne = Object.keys(te);
                        if (ne.length > 0 && (t.log(
                          `  DEBUG: Main component child "${Q.name || "Unnamed"}" -> boundVariables keys: ${ne.join(", ")}`
                        ), te.backgrounds !== void 0 && (t.log(
                          `  DEBUG:   Main component child "${Q.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(te.backgrounds)}`
                        ), !q || !q.backgrounds))) {
                          t.log(
                            "  DEBUG:   Instance child doesn't have boundVariables.backgrounds, but main component child does - preserving from main component"
                          );
                          const { extractBoundVariables: K } = await Promise.resolve().then(() => qe), J = await K(
                            te,
                            n.variableTable,
                            n.collectionTable
                          );
                          L.boundVariables || (L.boundVariables = {}), J.backgrounds && (L.boundVariables.backgrounds = J.backgrounds, t.log(
                            "  DEBUG:   ✓ Added boundVariables.backgrounds to childData from main component child"
                          ));
                        }
                      }
                    }
                  }
                }
                Z.push(L);
              } catch (L) {
                console.warn(
                  `Failed to extract child "${k.name || "Unnamed"}" for remote component "${d}":`,
                  L
                );
              }
            w.children = Z;
          }
          if (!w)
            throw new Error("Failed to build structure for remote instance");
          try {
            const V = e.boundVariables;
            if (V && typeof V == "object") {
              const U = Object.keys(V);
              t.log(
                `  DEBUG: Instance "${c}" -> boundVariables keys: ${U.length > 0 ? U.join(", ") : "none"}`
              );
              for (const Y of U) {
                const re = V[Y], he = (re == null ? void 0 : re.type) || typeof re;
                if (t.log(
                  `  DEBUG:   boundVariables.${Y}: type=${he}, value=${JSON.stringify(re)}`
                ), re && typeof re == "object" && !Array.isArray(re)) {
                  const fe = Object.keys(re);
                  if (fe.length > 0) {
                    t.log(
                      `  DEBUG:     boundVariables.${Y} has nested keys: ${fe.join(", ")}`
                    );
                    for (const ce of fe) {
                      const ae = re[ce];
                      ae && typeof ae == "object" && ae.type === "VARIABLE_ALIAS" && t.log(
                        `  DEBUG:       boundVariables.${Y}.${ce}: VARIABLE_ALIAS id=${ae.id}`
                      );
                    }
                  }
                }
              }
              const j = [
                "backgrounds",
                "selectionColor",
                "selectionColors",
                "selection",
                "selectColor"
              ];
              for (const Y of j)
                V[Y] !== void 0 && t.log(
                  `  DEBUG:   Found potential "Selection colors" property: boundVariables.${Y} = ${JSON.stringify(V[Y])}`
                );
            } else
              t.log(
                `  DEBUG: Instance "${c}" -> No boundVariables found on instance node`
              );
            const z = V && V.fills !== void 0 && V.fills !== null, Z = w.fills !== void 0 && Array.isArray(w.fills) && w.fills.length > 0, k = e.fills !== void 0 && Array.isArray(e.fills) && e.fills.length > 0, L = r.fills !== void 0 && Array.isArray(r.fills) && r.fills.length > 0;
            if (t.log(
              `  DEBUG: Instance "${c}" -> fills check: instanceHasFills=${k}, structureHasFills=${Z}, mainComponentHasFills=${L}, hasInstanceFillsBoundVar=${!!z}`
            ), z && !Z) {
              t.log(
                "  DEBUG: Instance has boundVariables.fills but structure has no fills - attempting to get fills"
              );
              try {
                if (k) {
                  const { serializeFills: U } = await Promise.resolve().then(() => qe), j = await U(
                    e.fills,
                    n.variableTable,
                    n.collectionTable
                  );
                  w.fills = j, t.log(
                    `  DEBUG: Got ${j.length} fill(s) from instance node`
                  );
                } else if (L) {
                  const { serializeFills: U } = await Promise.resolve().then(() => qe), j = await U(
                    r.fills,
                    n.variableTable,
                    n.collectionTable
                  );
                  w.fills = j, t.log(
                    `  DEBUG: Got ${j.length} fill(s) from main component`
                  );
                } else
                  t.warning(
                    "  DEBUG: Instance has boundVariables.fills but neither instance nor main component has fills"
                  );
              } catch (U) {
                t.warning(`  Failed to get fills: ${U}`);
              }
            }
            const q = e.selectionColor, Q = r.selectionColor;
            q !== void 0 && t.log(
              `  DEBUG: Instance "${c}" -> selectionColor: ${JSON.stringify(q)}`
            ), Q !== void 0 && t.log(
              `  DEBUG: Main component "${d}" -> selectionColor: ${JSON.stringify(Q)}`
            );
            const te = Object.keys(e).filter(
              (U) => !U.startsWith("_") && U !== "parent" && U !== "removed" && typeof e[U] != "function" && U !== "type" && U !== "id" && U !== "name"
            ), ne = Object.keys(r).filter(
              (U) => !U.startsWith("_") && U !== "parent" && U !== "removed" && typeof r[U] != "function" && U !== "type" && U !== "id" && U !== "name"
            ), K = [
              .../* @__PURE__ */ new Set([...te, ...ne])
            ].filter(
              (U) => U.toLowerCase().includes("selection") || U.toLowerCase().includes("select") || U.toLowerCase().includes("color") && !U.toLowerCase().includes("fill") && !U.toLowerCase().includes("stroke")
            );
            if (K.length > 0) {
              t.log(
                `  DEBUG: Found selection/color-related properties: ${K.join(", ")}`
              );
              for (const U of K)
                try {
                  if (te.includes(U)) {
                    const j = e[U];
                    t.log(
                      `  DEBUG:   Instance.${U}: ${JSON.stringify(j)}`
                    );
                  }
                  if (ne.includes(U)) {
                    const j = r[U];
                    t.log(
                      `  DEBUG:   MainComponent.${U}: ${JSON.stringify(j)}`
                    );
                  }
                } catch (j) {
                }
            } else
              t.log(
                "  DEBUG: No selection/color-related properties found on instance or main component"
              );
            const J = r.boundVariables;
            if (J && typeof J == "object") {
              const U = Object.keys(J);
              if (U.length > 0) {
                t.log(
                  `  DEBUG: Main component "${d}" -> boundVariables keys: ${U.join(", ")}`
                ), U.includes("selectionColor") ? t.log(
                  `[ISSUE #2 EXPORT] Main component "${d}" HAS selectionColor in boundVariables: ${JSON.stringify(J.selectionColor)}`
                ) : t.log(
                  `[ISSUE #2 EXPORT] Main component "${d}" does NOT have selectionColor in boundVariables (has: ${U.join(", ")})`
                );
                for (const j of U) {
                  const Y = J[j], re = (Y == null ? void 0 : Y.type) || typeof Y;
                  t.log(
                    `  DEBUG:   Main component boundVariables.${j}: type=${re}, value=${JSON.stringify(Y)}`
                  );
                }
              } else
                t.log(
                  `[ISSUE #2 EXPORT] Main component "${d}" has no boundVariables`
                );
            } else
              t.log(
                `[ISSUE #2 EXPORT] Main component "${d}" boundVariables is null/undefined`
              );
            if (V && Object.keys(V).length > 0) {
              t.log(
                `  DEBUG: Preserving instance's boundVariables in structure (${Object.keys(V).length} key(s))`
              );
              const { extractBoundVariables: U } = await Promise.resolve().then(() => qe), j = await U(
                V,
                n.variableTable,
                n.collectionTable
              );
              w.boundVariables || (w.boundVariables = {});
              for (const [Y, re] of Object.entries(
                j
              ))
                re !== void 0 && (w.boundVariables[Y] !== void 0 && t.log(
                  `  DEBUG: Structure already has boundVariables.${Y} from baseProps, but instance also has it - using instance's boundVariables.${Y}`
                ), w.boundVariables[Y] = re, t.log(
                  `  DEBUG: Set boundVariables.${Y} in structure: ${JSON.stringify(re)}`
                ));
              j.fills !== void 0 ? t.log(
                "  DEBUG: ✓ Preserved boundVariables.fills from instance"
              ) : z && t.warning(
                "  DEBUG: Instance has boundVariables.fills but extractBoundVariables didn't extract it"
              ), j.backgrounds !== void 0 ? t.log(
                `  DEBUG: ✓ Preserved boundVariables.backgrounds from instance: ${JSON.stringify(j.backgrounds)}`
              ) : V && V.backgrounds !== void 0 && t.warning(
                "  DEBUG: Instance has boundVariables.backgrounds but extractBoundVariables didn't extract it"
              );
            }
            if (J && Object.keys(J).length > 0) {
              t.log(
                `  DEBUG: Checking main component's boundVariables for properties not in instance (${Object.keys(J).length} key(s))`
              );
              const { extractBoundVariables: U } = await Promise.resolve().then(() => qe), j = await U(
                J,
                n.variableTable,
                n.collectionTable
              );
              w.boundVariables || (w.boundVariables = {});
              for (const [Y, re] of Object.entries(
                j
              ))
                re !== void 0 && (w.boundVariables[Y] === void 0 ? (w.boundVariables[Y] = re, Y === "selectionColor" ? t.log(
                  `[ISSUE #2 EXPORT] Added boundVariables.selectionColor from main component "${d}" to instance "${c}": ${JSON.stringify(re)}`
                ) : t.log(
                  `  DEBUG: Added boundVariables.${Y} from main component (not in instance): ${JSON.stringify(re)}`
                )) : Y === "selectionColor" ? t.log(
                  `[ISSUE #2 EXPORT] Skipped boundVariables.selectionColor from main component "${d}" (instance "${c}" already has it)`
                ) : t.log(
                  `  DEBUG: Skipped boundVariables.${Y} from main component (instance already has it)`
                ));
            }
            t.log(
              `  DEBUG: Final structure for "${d}": hasFills=${!!w.fills}, fillsCount=${((a = w.fills) == null ? void 0 : a.length) || 0}, hasBoundVars=${!!w.boundVariables}, boundVarsKeys=${w.boundVariables ? Object.keys(w.boundVariables).join(", ") : "none"}`
            ), (l = w.boundVariables) != null && l.fills && t.log(
              `  DEBUG: Structure boundVariables.fills: ${JSON.stringify(w.boundVariables.fills)}`
            );
          } catch (V) {
            t.warning(
              `  Failed to handle bound variables for fills: ${V}`
            );
          }
          H.structure = w, I ? t.log(
            `  Extracted structure for detached component "${d}" (ID: ${r.id.substring(0, 8)}...)`
          ) : t.log(
            `  Extracted structure from instance for remote component "${d}" (preserving size overrides: ${e.width}x${e.height})`
          ), t.log(
            `  Found INSTANCE: "${c}" -> REMOTE component "${d}" (ID: ${r.id.substring(0, 8)}...)${I ? " [DETACHED]" : ""}`
          );
        } catch (x) {
          const S = `Failed to extract structure for remote component "${d}": ${x instanceof Error ? x.message : String(x)}`;
          console.error(S, x), t.error(S);
        }
    }
    if (b === "normal" && r) {
      if (e.children && Array.isArray(e.children) && e.children.length > 0) {
        t.log(
          `[DEBUG] Normal instance "${c}" has ${e.children.length} child(ren) (unexpected for normal instance):`
        );
        for (let E = 0; E < Math.min(e.children.length, 5); E++) {
          const O = e.children[E];
          if (O) {
            const I = O.name || `Child ${E}`, B = O.type || "UNKNOWN", x = O.boundVariables, S = O.fills;
            if (t.log(
              `[DEBUG]   Child ${E}: "${I}" (${B}) - hasBoundVars=${!!x}, hasFills=${!!S}`
            ), x) {
              const u = Object.keys(x);
              t.log(
                `[DEBUG]     boundVariables: ${u.join(", ")}`
              );
            }
          }
        }
      }
      if (r.children && Array.isArray(r.children) && r.children.length > 0) {
        t.log(
          `[DEBUG] Main component "${d}" has ${r.children.length} child(ren):`
        );
        for (let E = 0; E < Math.min(r.children.length, 5); E++) {
          const O = r.children[E];
          if (O) {
            const I = O.name || `Child ${E}`, B = O.type || "UNKNOWN", x = O.boundVariables, S = O.fills;
            if (t.log(
              `[DEBUG]   Main component child ${E}: "${I}" (${B}) - hasBoundVars=${!!x}, hasFills=${!!S}`
            ), x) {
              const u = Object.keys(x);
              t.log(
                `[DEBUG]     boundVariables: ${u.join(", ")}`
              ), x.fills && t.log(
                `[DEBUG]     boundVariables.fills: ${JSON.stringify(x.fills)}`
              );
            }
            if (S && Array.isArray(S) && S.length > 0) {
              const u = S[0];
              u && typeof u == "object" && t.log(
                `[DEBUG]     fills[0]: type=${u.type}, color=${JSON.stringify(u.color)}`
              );
            }
            if (e.children && Array.isArray(e.children) && E < e.children.length) {
              const u = e.children[E];
              if (u && u.name === I) {
                const P = u.boundVariables, w = P ? Object.keys(P) : [], V = x ? Object.keys(x) : [], z = w.filter(
                  (Z) => !V.includes(Z)
                );
                if (z.length > 0) {
                  t.log(
                    `[DEBUG] Instance "${c}" child "${I}" has instance override bound variables: ${z.join(", ")} (will be exported with instance children)`
                  );
                  for (const Z of z)
                    t.log(
                      `[DEBUG]   Instance child boundVariables.${Z}: ${JSON.stringify(P[Z])}`
                    );
                }
              }
            }
          }
        }
      }
      try {
        const E = r.boundVariables;
        if (E && typeof E == "object") {
          const O = Object.keys(E);
          if (O.length > 0) {
            t.log(
              `[ISSUE #2 EXPORT] Normal instance "${c}" -> checking main component "${d}" boundVariables (${O.length} key(s))`
            ), O.includes("selectionColor") ? t.log(
              `[ISSUE #2 EXPORT] Main component "${d}" HAS selectionColor in boundVariables: ${JSON.stringify(E.selectionColor)}`
            ) : t.log(
              `[ISSUE #2 EXPORT] Main component "${d}" does NOT have selectionColor in boundVariables (has: ${O.join(", ")})`
            );
            const { extractBoundVariables: I } = await Promise.resolve().then(() => qe), B = await I(
              E,
              n.variableTable,
              n.collectionTable
            );
            i.boundVariables || (i.boundVariables = {});
            for (const [x, S] of Object.entries(
              B
            ))
              S !== void 0 && (i.boundVariables[x] === void 0 ? (i.boundVariables[x] = S, x === "selectionColor" ? t.log(
                `[ISSUE #2 EXPORT] Added boundVariables.selectionColor from main component "${d}" to normal instance "${c}": ${JSON.stringify(S)}`
              ) : t.log(
                `  DEBUG: Added boundVariables.${x} from main component to normal instance: ${JSON.stringify(S)}`
              )) : x === "selectionColor" && t.log(
                `[ISSUE #2 EXPORT] Skipped boundVariables.selectionColor from main component "${d}" (normal instance "${c}" already has it)`
              ));
          } else
            t.log(
              `[ISSUE #2 EXPORT] Main component "${d}" has no boundVariables`
            );
        } else
          t.log(
            `[ISSUE #2 EXPORT] Main component "${d}" boundVariables is null/undefined`
          );
      } catch (E) {
        t.warning(
          `[ISSUE #2 EXPORT] Error checking main component boundVariables for normal instance "${c}": ${E}`
        );
      }
    }
    const W = n.instanceTable.addInstance(H);
    i._instanceRef = W, o.add("_instanceRef");
  }
  return i;
}
class at {
  constructor() {
    Te(this, "instanceMap");
    // unique key -> index
    Te(this, "instances");
    // index -> instance data
    Te(this, "nextIndex");
    this.instanceMap = /* @__PURE__ */ new Map(), this.instances = [], this.nextIndex = 0;
  }
  /**
   * Generates a unique key for an instance based on its type
   */
  generateKey(n) {
    if (n.instanceType === "internal" && n.componentNodeId) {
      const i = n.variantProperties ? `:${JSON.stringify(n.variantProperties)}` : "";
      return `internal:${n.componentNodeId}${i}`;
    } else {
      if (n.instanceType === "normal" && n.componentGuid && n.componentVersion !== void 0)
        return `normal:${n.componentGuid}:${n.componentVersion}`;
      if (n.instanceType === "remote" && n.remoteLibraryKey)
        return `remote:${n.remoteLibraryKey}:${n.componentName}`;
      if (n.instanceType === "remote" && n.componentNodeId)
        return `remote:detached:${n.componentNodeId}`;
    }
    return n.instanceType === "remote" ? `remote:${n.componentName}:COMPONENT` : `${n.instanceType}:${n.componentName}:COMPONENT`;
  }
  /**
   * Adds an instance to the table if it doesn't already exist
   * Returns the index of the instance (existing or newly added)
   */
  addInstance(n) {
    const i = this.generateKey(n);
    if (this.instanceMap.has(i))
      return this.instanceMap.get(i);
    const o = this.nextIndex++;
    return this.instanceMap.set(i, o), this.instances[o] = n, o;
  }
  /**
   * Gets the index of an instance by its unique key
   * Returns -1 if not found
   */
  getInstanceIndex(n) {
    var o;
    const i = this.generateKey(n);
    return (o = this.instanceMap.get(i)) != null ? o : -1;
  }
  /**
   * Gets an instance entry by index
   */
  getInstanceByIndex(n) {
    return this.instances[n];
  }
  /**
   * Gets the complete table as an object with string keys
   * Used for JSON serialization
   */
  getSerializedTable() {
    const n = {};
    for (let i = 0; i < this.instances.length; i++)
      n[String(i)] = this.instances[i];
    return n;
  }
  /**
   * Reconstructs an InstanceTable from a serialized table object
   */
  static fromTable(n) {
    const i = new at(), o = Object.entries(n).sort(
      (a, l) => parseInt(a[0], 10) - parseInt(l[0], 10)
    );
    for (const [a, l] of o) {
      const r = parseInt(a, 10), c = i.generateKey(l);
      i.instanceMap.set(c, r), i.instances[r] = l, i.nextIndex = Math.max(i.nextIndex, r + 1);
    }
    return i;
  }
  /**
   * Gets the total number of instances in the table
   */
  getSize() {
    return this.instances.length;
  }
}
class pt {
  constructor() {
    Te(this, "styles", /* @__PURE__ */ new Map());
    Te(this, "styleKeyToIndex", /* @__PURE__ */ new Map());
    Te(this, "nextIndex", 0);
  }
  /**
   * Add a style to the table and return its index
   * If the style already exists (by styleKey), returns the existing index
   */
  addStyle(n) {
    const i = n.styleKey || `${n.type}:${n.name}:${JSON.stringify(n.textStyle || n.paintStyle || n.effectStyle || n.gridStyle)}`, o = this.styleKeyToIndex.get(i);
    if (o !== void 0)
      return o;
    const a = this.nextIndex++;
    return this.styles.set(a, Ee(le({}, n), { styleKey: i })), this.styleKeyToIndex.set(i, a), a;
  }
  /**
   * Get the index of a style by its styleKey (used during export)
   */
  getStyleIndex(n) {
    var i;
    return (i = this.styleKeyToIndex.get(n)) != null ? i : -1;
  }
  /**
   * Get a style by index
   */
  getStyleByIndex(n) {
    return this.styles.get(n);
  }
  /**
   * Get the number of styles in the table
   */
  getSize() {
    return this.styles.size;
  }
  /**
   * Get the full table (for serialization)
   * Excludes internal styleKey field
   */
  getSerializedTable() {
    const n = {};
    for (const [o, a] of this.styles.entries()) {
      const i = a, { styleKey: l } = i, r = kt(i, ["styleKey"]);
      n[String(o)] = r;
    }
    return n;
  }
  /**
   * Get the full table with styleKey (for internal use)
   */
  getTable() {
    const n = {};
    for (const [i, o] of this.styles.entries())
      n[String(i)] = o;
    return n;
  }
  /**
   * Reconstruct StyleTable from serialized data
   */
  static fromTable(n) {
    const i = new pt();
    for (const [o, a] of Object.entries(n)) {
      const l = parseInt(o, 10), r = a.styleKey || `${a.type}:${a.name}:${JSON.stringify(a.textStyle || a.paintStyle || a.effectStyle || a.gridStyle)}`;
      i.styles.set(l, Ee(le({}, a), { styleKey: r })), i.styleKeyToIndex.set(r, l), l >= i.nextIndex && (i.nextIndex = l + 1);
    }
    return i;
  }
}
const Xt = {
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
  GRID_STYLE: 35
};
function Dn() {
  const e = {};
  for (const [n, i] of Object.entries(Xt))
    e[i] = n;
  return e;
}
function Lt(e) {
  var n;
  return (n = Xt[e]) != null ? n : e;
}
function Hn(e) {
  var n;
  return typeof e == "number" ? (n = Dn()[e]) != null ? n : e.toString() : e;
}
const qt = {
  // Collection table keys
  collectionName: "colNm",
  collectionId: "colId",
  collectionGuid: "colGu",
  modes: "modes",
  // Already short, keep as-is
  // Variable table keys
  variableName: "varNm",
  variableType: "varTy",
  valuesByMode: "vByMd",
  _colRef: "_colRef",
  // Keep as-is (already short)
  _varRef: "_varRef",
  // Keep as-is (already short)
  _instanceRef: "_insRef",
  // Keep short but consistent
  _styleRef: "_stlRef",
  // Style reference
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
  fills: "fills",
  // Already 5 chars, keep as-is
  strokes: "strks",
  visible: "visbl",
  opacity: "opcty",
  rotation: "rotat",
  height: "h",
  width: "w",
  libraryName: "libNm",
  // Different from remoteLibraryName (rLibN)
  constraintHorizontal: "cnsHr",
  // Constraint horizontal (5 chars)
  constraintVertical: "cnsVr",
  // Constraint vertical (5 chars)
  // Style-related keys
  textStyle: "txtSt",
  paintStyle: "pntSt",
  effectStyle: "effSt",
  gridStyle: "grdSt",
  styleKey: "stlKy"
}, Et = {};
for (const [e, n] of Object.entries(qt))
  Et[n] = e;
class mt {
  constructor() {
    Te(this, "shortToLong");
    Te(this, "longToShort");
    this.shortToLong = le({}, Et), this.longToShort = le({}, qt);
  }
  /**
   * Gets the short name for a long property name
   * Returns the short name if mapped, otherwise returns the original
   */
  getShortName(n) {
    return this.longToShort[n] || n;
  }
  /**
   * Gets the long name for a short property name
   * Returns the long name if mapped, otherwise returns the original
   */
  getLongName(n) {
    return this.shortToLong[n] || n;
  }
  /**
   * Recursively replaces all keys in an object with their short names
   * Handles nested objects and arrays
   * Collision detection: if a short name already exists as a key, keep the original key
   * Also compresses special values: node "type" field values and variable "type" field values
   */
  compressObject(n) {
    if (n == null)
      return n;
    if (Array.isArray(n))
      return n.map((i) => this.compressObject(i));
    if (typeof n == "object") {
      const i = {}, o = /* @__PURE__ */ new Set();
      for (const a of Object.keys(n))
        o.add(a);
      for (const [a, l] of Object.entries(n)) {
        const r = this.getShortName(a);
        if (r !== a && !o.has(r)) {
          let c = this.compressObject(l);
          r === "type" && typeof c == "string" && (c = Lt(c)), i[r] = c;
        } else {
          let c = this.compressObject(l);
          a === "type" && typeof c == "string" && (c = Lt(c)), i[a] = c;
        }
      }
      return i;
    }
    return n;
  }
  /**
   * Recursively replaces all keys in an object with their long names
   * Handles nested objects and arrays
   * Also expands special values: node "type" field values and variable "type" field values
   */
  expandObject(n) {
    if (n == null)
      return n;
    if (Array.isArray(n))
      return n.map((i) => this.expandObject(i));
    if (typeof n == "object") {
      const i = {};
      for (const [o, a] of Object.entries(n)) {
        const l = this.getLongName(o);
        let r = this.expandObject(a);
        (l === "type" || o === "type") && (typeof r == "number" || typeof r == "string") && (r = Hn(r)), i[l] = r;
      }
      return i;
    }
    return n;
  }
  /**
   * Gets the serialized string table for JSON export
   * Returns the mapping of short -> long names
   */
  getSerializedTable() {
    return le({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(n) {
    const i = new mt();
    i.shortToLong = le(le({}, Et), n), i.longToShort = {};
    for (const [o, a] of Object.entries(
      i.shortToLong
    ))
      i.longToShort[a] = o;
    return i;
  }
}
class At extends Error {
  constructor(n) {
    super(n), this.name = "OperationCancelledError", Error.captureStackTrace && Error.captureStackTrace(this, At);
  }
}
const Pt = /* @__PURE__ */ new Set();
function Wn(e) {
  Pt.add(e);
}
function we(e) {
  if (e && Pt.has(e))
    throw new At(`Operation cancelled: ${e}`);
}
function Ft(e) {
  Pt.delete(e);
}
function Kn(e, n) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const i = {};
  e.metadata && (i.metadata = e.metadata);
  for (const [o, a] of Object.entries(e))
    o !== "metadata" && (i[o] = n.compressObject(a));
  return i;
}
function Xn(e, n) {
  return n.expandObject(e);
}
function gt(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
function ut(e) {
  let n = 1;
  return e.children && e.children.length > 0 && e.children.forEach((i) => {
    n += ut(i);
  }), n;
}
function Yt(e) {
  let n = 0;
  if ((e.cnsHr !== void 0 || e.cnsVr !== void 0) && (n = 1), (e.constraintHorizontal !== void 0 || e.constraintVertical !== void 0) && n === 0 && (n = 1), e.children && Array.isArray(e.children))
    for (const i of e.children)
      i && typeof i == "object" && (n += Yt(i));
  return n;
}
async function ht(e, n = /* @__PURE__ */ new WeakSet(), i = {}) {
  var $, y, m, b, s, v, g;
  if (!e || typeof e != "object")
    return e;
  const o = ($ = i.maxNodes) != null ? $ : 1e4, a = (y = i.nodeCount) != null ? y : 0;
  if (a >= o)
    return t.warning(
      `Maximum node count (${o}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${o}) reached`,
      _nodeCount: a
    };
  const l = {
    visited: (m = i.visited) != null ? m : /* @__PURE__ */ new WeakSet(),
    depth: (b = i.depth) != null ? b : 0,
    maxDepth: (s = i.maxDepth) != null ? s : 100,
    nodeCount: a + 1,
    maxNodes: o,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: i.variableTable,
    collectionTable: i.collectionTable,
    instanceTable: i.instanceTable,
    styleTable: i.styleTable,
    detachedComponentsHandled: (v = i.detachedComponentsHandled) != null ? v : /* @__PURE__ */ new Set(),
    exportedIds: (g = i.exportedIds) != null ? g : /* @__PURE__ */ new Map()
  };
  if (n.has(e))
    return "[Circular Reference]";
  n.add(e), l.visited = n;
  const r = {}, c = await Wt(e, l);
  if (Object.assign(r, c), r.id && l.exportedIds) {
    const C = l.exportedIds.get(r.id);
    if (C !== void 0) {
      const M = r.name || "Unnamed";
      if (C !== M) {
        const H = `Duplicate ID detected during export: ID "${r.id.substring(0, 8)}..." is used by both "${C}" and "${M}". Each node must have a unique ID.`;
        throw t.error(H), new Error(H);
      }
      t.warning(
        `Node "${M}" (ID: ${r.id.substring(0, 8)}...) was encountered multiple times during export. This may indicate a structural issue.`
      );
    } else
      l.exportedIds.set(r.id, r.name || "Unnamed");
  }
  const d = e.type;
  if (d)
    switch (d) {
      case "FRAME":
      case "COMPONENT": {
        const C = await Nt(e);
        Object.assign(r, C);
        break;
      }
      case "INSTANCE": {
        const C = await Jn(
          e,
          l
        );
        Object.assign(r, C);
        const M = await Nt(
          e
        );
        Object.assign(r, M);
        break;
      }
      case "TEXT": {
        const C = await Un(e, l);
        Object.assign(r, C);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const C = await Bn(e);
        Object.assign(r, C);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const C = await Gn(e);
        Object.assign(r, C);
        break;
      }
      default:
        l.unhandledKeys.add("_unknownType");
        break;
    }
  const p = Object.getOwnPropertyNames(e), h = /* @__PURE__ */ new Set([
    "type",
    "id",
    "name",
    "x",
    "y",
    "width",
    "height",
    "visible",
    "locked",
    "opacity",
    "rotation",
    "blendMode",
    "effects",
    "fills",
    "strokes",
    "strokeWeight",
    "strokeAlign",
    "strokeCap",
    "strokeJoin",
    "dashPattern",
    "boundVariables",
    "children",
    "parent",
    "removed",
    "isAsset",
    "detachedInfo",
    "stuckNodes",
    "attachedConnectors",
    "componentPropertyReferences",
    "componentPropertyDefinitions",
    "variableConsumptionMap",
    "resolvedVariableModes",
    "inferredVariables",
    "constructor",
    "toString",
    "valueOf"
  ]);
  (d === "FRAME" || d === "COMPONENT" || d === "INSTANCE") && (h.add("layoutMode"), h.add("primaryAxisSizingMode"), h.add("counterAxisSizingMode"), h.add("primaryAxisAlignItems"), h.add("counterAxisAlignItems"), h.add("paddingLeft"), h.add("paddingRight"), h.add("paddingTop"), h.add("paddingBottom"), h.add("itemSpacing"), h.add("counterAxisSpacing"), h.add("cornerRadius"), h.add("clipsContent"), h.add("layoutWrap"), h.add("layoutGrow")), d === "TEXT" && (h.add("characters"), h.add("fontName"), h.add("fontSize"), h.add("textAlignHorizontal"), h.add("textAlignVertical"), h.add("letterSpacing"), h.add("lineHeight"), h.add("textCase"), h.add("textDecoration"), h.add("textAutoResize"), h.add("paragraphSpacing"), h.add("paragraphIndent"), h.add("listOptions")), (d === "VECTOR" || d === "LINE") && (h.add("fillGeometry"), h.add("strokeGeometry")), (d === "RECTANGLE" || d === "ELLIPSE" || d === "STAR" || d === "POLYGON") && (h.add("pointCount"), h.add("innerRadius"), h.add("arcData")), d === "INSTANCE" && (h.add("mainComponent"), h.add("componentProperties"));
  for (const C of p)
    typeof e[C] != "function" && (h.has(C) || l.unhandledKeys.add(C));
  if (l.unhandledKeys.size > 0 && (r._unhandledKeys = Array.from(l.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const C = l.maxDepth;
    if (l.depth >= C)
      r.children = {
        _truncated: !0,
        _reason: `Maximum depth (${C}) reached`,
        _count: e.children.length
      };
    else if (l.nodeCount >= o)
      r.children = {
        _truncated: !0,
        _reason: `Maximum node count (${o}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const M = Ee(le({}, l), {
        depth: l.depth + 1
      }), H = [];
      let W = !1;
      for (const E of e.children) {
        if (M.nodeCount >= o) {
          r.children = {
            _truncated: !0,
            _reason: `Maximum node count (${o}) reached during children processing`,
            _processed: H.length,
            _total: e.children.length,
            children: H
          }, W = !0;
          break;
        }
        const O = await ht(E, n, M);
        H.push(O), M.nodeCount && (l.nodeCount = M.nodeCount);
      }
      W || (r.children = H);
    }
  }
  return r;
}
async function Ze(e, n = /* @__PURE__ */ new Set(), i = !1, o = /* @__PURE__ */ new Set(), a) {
  we(a), e.clearConsole !== !1 && !i ? (t.clear(), t.log("=== Starting Page Export ===")) : i || t.log("=== Starting Page Export ===");
  try {
    const r = e.pageIndex;
    if (r === void 0 || typeof r != "number")
      return t.error(
        "Invalid page selection: pageIndex is undefined or not a number"
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    we(a), t.log("Loading all pages..."), await figma.loadAllPagesAsync(), we(a);
    const c = figma.root.children;
    if (t.log(`Loaded ${c.length} page(s)`), r < 0 || r >= c.length)
      return t.error(
        `Invalid page index: ${r} (valid range: 0-${c.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const d = c[r], p = d.id;
    if (e.skipPrompts) {
      if (o.has(p))
        return t.log(
          `Page "${d.name}" already discovered, skipping discovery...`
        ), {
          type: "exportPage",
          success: !0,
          error: !1,
          message: "Page already discovered",
          data: {
            filename: "",
            pageData: {},
            pageName: d.name,
            additionalPages: [],
            discoveredReferencedPages: []
          }
        };
      o.add(p);
    } else {
      if (n.has(p))
        return t.log(
          `Page "${d.name}" has already been processed, skipping...`
        ), {
          type: "exportPage",
          success: !1,
          error: !0,
          message: "Page already processed",
          data: {}
        };
      n.add(p);
    }
    t.log(
      `Selected page: "${d.name}" (index: ${r})`
    ), t.log(
      "Initializing variable, collection, and instance tables..."
    );
    const h = new rt(), $ = new ot(), y = new at(), m = new pt();
    t.log("Extracting node data from page..."), t.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), t.log(
      "Collections will be discovered as variables are processed:"
    );
    const b = await ht(
      d,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: h,
        collectionTable: $,
        instanceTable: y,
        styleTable: m
      }
    );
    we(a), t.log("Node extraction finished");
    const s = ut(b), v = h.getSize(), g = $.getSize(), C = y.getSize(), M = Yt(b);
    t.log("Extraction complete:"), t.log(`  - Total nodes: ${s}`), t.log(`  - Unique variables: ${v}`), t.log(`  - Unique collections: ${g}`), t.log(`  - Unique instances: ${C}`), t.log(
      `  - Nodes with constraints exported: ${M}`
    );
    const H = y.getSerializedTable(), W = /* @__PURE__ */ new Map();
    for (const [K, J] of Object.entries(H))
      if (J.instanceType === "remote") {
        const U = parseInt(K, 10);
        W.set(U, J);
      }
    if (e.validateOnly) {
      t.log("=== Validation Mode ===");
      const K = await figma.variables.getLocalVariableCollectionsAsync(), J = /* @__PURE__ */ new Set(), U = /* @__PURE__ */ new Set();
      for (const ae of K)
        J.add(ae.id), U.add(ae.name);
      U.add("Token"), U.add("Tokens"), U.add("Theme"), U.add("Themes");
      const j = [], Y = [];
      for (const ae of W.values()) {
        const se = ae.componentName || "(unnamed)";
        j.push({
          componentName: se,
          pageName: d.name
        }), Y.push({
          type: "externalReference",
          message: `External reference found: "${se}" references a component from another file`,
          componentName: se,
          pageName: d.name
        });
      }
      const re = [], he = $.getTable();
      for (const ae of Object.values(he))
        ae.isLocal ? J.has(ae.collectionId) || (re.push({
          collectionName: ae.collectionName,
          collectionId: ae.collectionId,
          pageName: d.name
        }), Y.push({
          type: "unknownCollection",
          message: `Unknown local collection: "${ae.collectionName}"`,
          collectionName: ae.collectionName,
          pageName: d.name
        })) : U.has(ae.collectionName) || (re.push({
          collectionName: ae.collectionName,
          collectionId: ae.collectionId,
          pageName: d.name
        }), Y.push({
          type: "unknownCollection",
          message: `Unknown remote collection: "${ae.collectionName}". Remote collections must be named "Token", "Tokens", "Theme", or "Themes"`,
          collectionName: ae.collectionName,
          pageName: d.name
        }));
      const fe = Object.values(he).map(
        (ae) => ae.collectionName
      ), ce = {
        hasErrors: Y.length > 0,
        errors: Y,
        externalReferences: j,
        unknownCollections: re,
        discoveredCollections: fe
      };
      return t.log("Validation complete:"), t.log(`  - External references: ${j.length}`), t.log(`  - Unknown collections: ${re.length}`), t.log(`  - Has errors: ${ce.hasErrors}`), {
        type: "exportPage",
        success: !0,
        error: !1,
        message: "Validation complete",
        data: {
          filename: "",
          pageData: {},
          pageName: d.name,
          additionalPages: [],
          validationResult: ce
        }
      };
    }
    if (W.size > 0) {
      t.error(
        `Found ${W.size} remote instance(s) - remote instances are not supported during publishing`
      );
      const K = (Y, re, he = [], fe = !1) => {
        const ce = [];
        if (!Y || typeof Y != "object")
          return ce;
        if (fe || Y.type === "PAGE") {
          const me = Y.children || Y.child;
          if (Array.isArray(me))
            for (const Se of me)
              Se && typeof Se == "object" && ce.push(
                ...K(
                  Se,
                  re,
                  [],
                  !1
                )
              );
          return ce;
        }
        const ae = Y.name || "";
        if (typeof Y._instanceRef == "number" && Y._instanceRef === re) {
          const me = ae || "(unnamed)", Se = he.length > 0 ? [...he, me] : [me];
          return ce.push({
            path: Se,
            nodeName: me
          }), ce;
        }
        const se = ae ? [...he, ae] : he, de = Y.children || Y.child;
        if (Array.isArray(de))
          for (const me of de)
            me && typeof me == "object" && ce.push(
              ...K(
                me,
                re,
                se,
                !1
              )
            );
        return ce;
      }, J = [];
      let U = 1;
      for (const [Y, re] of W.entries()) {
        const he = re.componentName || "(unnamed)", fe = re.componentSetName, ce = K(
          b,
          Y,
          [],
          !0
        );
        let ae = "";
        ce.length > 0 ? ae = `
   Location(s): ${ce.map((Se) => {
          const Ve = Se.path.length > 0 ? Se.path.join(" → ") : "page root";
          return `"${Se.nodeName}" at ${Ve}`;
        }).join(", ")}` : ae = `
   Location: (unable to determine - instance may be deeply nested)`;
        const se = fe ? `Component: "${he}" (from component set "${fe}")` : `Component: "${he}"`, de = re.remoteLibraryName ? `
   Library: ${re.remoteLibraryName}` : "";
        J.push(
          `${U}. ${se}${de}${ae}`
        ), U++;
      }
      const j = `Cannot publish: Remote instances are not supported. Please remove all remote instances before publishing.

Found ${W.size} remote instance(s):
${J.join(`

`)}

To fix this:
1. Locate each remote instance component listed above using the path(s) shown
2. Replace it with a local component or remove it
3. Try publishing again`;
      throw t.error(j), new Error(j);
    }
    if (g > 0) {
      t.log("Collections found:");
      const K = $.getTable();
      for (const [J, U] of Object.values(K).entries()) {
        const j = U.collectionGuid ? ` (GUID: ${U.collectionGuid.substring(0, 8)}...)` : "";
        t.log(
          `  ${J}: ${U.collectionName}${j} - ${U.modes.length} mode(s)`
        );
      }
    }
    let E;
    if (e.skipPrompts) {
      t.log("Running validation on main page...");
      try {
        we(a);
        const K = await Ze(
          {
            pageIndex: r,
            validateOnly: !0
          },
          n,
          !0,
          // Mark as recursive call
          o,
          a
          // Pass requestId for cancellation
        );
        if (K.success && K.data) {
          const J = K.data;
          J.validationResult && (E = J.validationResult, t.log(
            `Main page validation: ${E.hasErrors ? "FAILED" : "PASSED"}`
          ), E.hasErrors && t.warning(
            `Found ${E.errors.length} validation error(s) in main page`
          ));
        }
      } catch (K) {
        t.warning(
          `Could not validate main page: ${K instanceof Error ? K.message : String(K)}`
        );
      }
    }
    t.log("Checking for referenced component pages...");
    const O = [], I = [], B = Object.values(H).filter(
      (K) => K.instanceType === "normal"
    );
    if (B.length > 0) {
      t.log(
        `Found ${B.length} normal instance(s) to check`
      );
      const K = /* @__PURE__ */ new Map();
      for (const J of B)
        if (J.componentPageName) {
          const U = c.find((j) => j.name === J.componentPageName);
          if (U && !n.has(U.id))
            K.has(U.id) || K.set(U.id, U);
          else if (!U) {
            const j = `Normal instance references component "${J.componentName || "(unnamed)"}" on page "${J.componentPageName}", but that page was not found. Cannot export.`;
            throw t.error(j), new Error(j);
          }
        } else {
          const U = `Normal instance references component "${J.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw t.error(U), new Error(U);
        }
      t.log(
        `Found ${K.size} unique referenced page(s)`
      );
      for (const [J, U] of K.entries()) {
        we(a);
        const j = U.name;
        if (n.has(J)) {
          t.log(`Skipping "${j}" - already processed`);
          continue;
        }
        const Y = U.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let re = !1, he = 0;
        if (Y)
          try {
            const se = JSON.parse(Y);
            re = !!(se.id && se.version !== void 0), he = se.version || 0;
          } catch (se) {
          }
        const fe = c.findIndex(
          (se) => se.id === U.id
        );
        if (fe === -1)
          throw t.error(`Could not find page index for "${j}"`), new Error(`Could not find page index for "${j}"`);
        const ce = Array.from(B).find(
          (se) => se.componentPageName === j
        ), ae = ce == null ? void 0 : ce.componentName;
        if (e.skipPrompts) {
          J === p ? t.log(
            `Skipping "${j}" - this is the original page being published`
          ) : I.find(
            (de) => de.pageId === J
          ) || (I.push({
            pageId: J,
            pageName: j,
            pageIndex: fe,
            hasMetadata: re,
            componentName: ae,
            localVersion: he
          }), t.log(
            `Discovered referenced page: "${j}" (local version: ${he}) (will be handled by wizard)`
          )), t.log(
            `Validating "${j}" for external references and unknown collections...`
          );
          try {
            we(a);
            const se = await Ze(
              {
                pageIndex: fe,
                validateOnly: !0
                // Run validation only
              },
              n,
              !0,
              // Mark as recursive call
              o,
              a
              // Pass requestId for cancellation
            );
            if (se.success && se.data) {
              const de = se.data;
              if (de.validationResult) {
                E || (E = {
                  hasErrors: !1,
                  errors: [],
                  externalReferences: [],
                  unknownCollections: [],
                  discoveredCollections: []
                }), E.errors.push(
                  ...de.validationResult.errors
                ), E.externalReferences.push(
                  ...de.validationResult.externalReferences
                ), E.unknownCollections.push(
                  ...de.validationResult.unknownCollections
                );
                for (const me of de.validationResult.discoveredCollections)
                  E.discoveredCollections.includes(
                    me
                  ) || E.discoveredCollections.push(
                    me
                  );
                E.hasErrors = E.errors.length > 0, t.log(
                  `  Validation for "${j}": ${de.validationResult.hasErrors ? "FAILED" : "PASSED"}`
                ), de.validationResult.hasErrors && t.warning(
                  `  Found ${de.validationResult.errors.length} validation error(s) in "${j}"`
                );
              }
            }
          } catch (se) {
            t.warning(
              `Could not validate "${j}": ${se instanceof Error ? se.message : String(se)}`
            );
          }
          t.log(
            `Checking dependencies of "${j}" for transitive dependencies...`
          );
          try {
            we(a);
            const se = await Ze(
              {
                pageIndex: fe,
                skipPrompts: !0
                // Keep skipPrompts true to just discover, not export
              },
              n,
              // Pass the same set (won't be used during discovery)
              !0,
              // Mark as recursive call
              o,
              // Pass the same discoveredPages set to avoid infinite loops
              a
              // Pass requestId for cancellation
            );
            if (se.success && se.data) {
              const de = se.data;
              if (de.discoveredReferencedPages)
                for (const me of de.discoveredReferencedPages) {
                  if (me.pageId === p) {
                    t.log(
                      `  Skipping "${me.pageName}" - this is the original page being published`
                    );
                    continue;
                  }
                  I.find(
                    (Ve) => Ve.pageId === me.pageId
                  ) || (I.push(me), t.log(
                    `  Discovered transitive dependency: "${me.pageName}" (from ${j})`
                  ));
                }
            }
          } catch (se) {
            t.warning(
              `Could not discover dependencies of "${j}": ${se instanceof Error ? se.message : String(se)}`
            );
          }
        } else {
          const se = `Do you want to also publish referenced component "${j}"?`;
          try {
            await tt.prompt(se, {
              okLabel: "Yes",
              cancelLabel: "No",
              timeoutMs: 3e5
              // 5 minutes
            }), t.log(`Exporting referenced page: "${j}"`);
            const de = c.findIndex(
              (Se) => Se.id === U.id
            );
            if (de === -1)
              throw t.error(`Could not find page index for "${j}"`), new Error(`Could not find page index for "${j}"`);
            we(a);
            const me = await Ze(
              {
                pageIndex: de
              },
              n,
              // Pass the same set to track all processed pages
              !0,
              // Mark as recursive call
              o,
              // Pass discovered pages set (empty during actual export)
              a
              // Pass requestId for cancellation
            );
            if (me.success && me.data) {
              const Se = me.data;
              O.push(Se), t.log(
                `Successfully exported referenced page: "${j}"`
              );
            } else
              throw new Error(
                `Failed to export referenced page "${j}": ${me.message}`
              );
          } catch (de) {
            if (de instanceof Error && de.message === "User cancelled")
              if (re)
                t.log(
                  `User declined to publish "${j}", but page has existing metadata. Continuing with existing metadata.`
                );
              else
                throw t.error(
                  `Export cancelled: Referenced page "${j}" has no metadata and user declined to publish it.`
                ), new Error(
                  `Cannot continue export: Referenced component "${j}" has no metadata. Please publish it first or choose to publish it now.`
                );
            else
              throw de;
          }
        }
      }
    }
    t.log("Creating string table...");
    const x = new mt();
    t.log("Getting page metadata...");
    const S = d.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let u = "", P = 0;
    if (S)
      try {
        const K = JSON.parse(S);
        u = K.id || "", P = K.version || 0;
      } catch (K) {
        t.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!u) {
      t.log("Generating new GUID for page..."), u = await wt();
      const K = {
        _ver: 1,
        id: u,
        name: d.name,
        version: P,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      d.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(K)
      );
    }
    t.log("Creating export data structure...");
    const w = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "1.0.0",
        figmaApiVersion: figma.apiVersion,
        guid: u,
        version: P,
        name: d.name,
        pluginVersion: "1.0.0"
      },
      stringTable: x.getSerializedTable(),
      collections: $.getSerializedTable(),
      variables: h.getSerializedTable(),
      instances: y.getSerializedTable(),
      styles: m.getSerializedTable(),
      pageData: b
    };
    t.log("Compressing JSON data...");
    const V = Kn(w, x);
    t.log("Serializing to JSON...");
    const z = JSON.stringify(V, null, 2), Z = (z.length / 1024).toFixed(2), L = gt(d.name).trim().replace(/\s+/g, "_") + ".figma.json";
    t.log(`JSON serialization complete: ${Z} KB`), t.log(`Export file: ${L}`), t.log("=== Export Complete ===");
    const q = JSON.parse(z), Q = {
      filename: L,
      pageData: q,
      pageName: d.name,
      additionalPages: O,
      // Populated with referenced component pages
      discoveredReferencedPages: I.length > 0 ? (
        // Filter out the original page - it shouldn't be in the discovered list since it's the one being published
        I.filter((K) => K.pageId !== p)
      ) : void 0,
      // Only include if there are discovered pages
      validationResult: E
      // Include aggregated validation results if in discovery mode
    }, te = t.getLogs();
    return {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: le(le({}, Q), te.length > 0 && { debugLogs: te })
    };
  } catch (r) {
    const c = r instanceof Error ? r.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", r), console.error("Error message:", c), t.error(`Export failed: ${c}`), r instanceof Error && r.stack && (console.error("Stack trace:", r.stack), t.error(`Stack trace: ${r.stack}`));
    const d = t.getLogs(), p = {
      type: "exportPage",
      success: !1,
      error: !0,
      message: c,
      data: le({}, d.length > 0 && { debugLogs: d })
    };
    return console.error("Returning error response:", p), p;
  }
}
const qn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  countTotalNodes: ut,
  exportPage: Ze,
  extractNodeData: ht
}, Symbol.toStringTag, { value: "Module" }));
function $e(e) {
  return e.replace(/[^a-zA-Z0-9]/g, "");
}
const Zt = /* @__PURE__ */ new Map();
async function Ke(e, n) {
  if (n.length === 0)
    return;
  const i = e.modes.find(
    (o) => o.name === "Mode 1" || o.name === "Default"
  );
  if (i && !n.includes(i.name)) {
    const o = n[0];
    try {
      const a = i.name;
      e.renameMode(i.modeId, o), Zt.set(`${e.id}:${a}`, o), t.log(
        `  Renamed default mode "${a}" to "${o}"`
      );
    } catch (a) {
      t.warning(
        `  Failed to rename default mode "${i.name}" to "${o}": ${a}`
      );
    }
  }
  for (const o of n)
    e.modes.find((l) => l.name === o) || e.addMode(o);
}
const Ue = "recursica:collectionId";
async function dt(e) {
  if (e.remote === !0) {
    const i = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(i)) {
      const a = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw t.error(a), new Error(a);
    }
    return e.id;
  } else {
    const i = e.getSharedPluginData(
      "recursica",
      Ue
    );
    if (i && i.trim() !== "")
      return i;
    const o = await wt();
    return e.setSharedPluginData("recursica", Ue, o), o;
  }
}
function Yn(e, n) {
  const i = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(i))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Zn(e) {
  let n;
  const i = e.collectionName.trim().toLowerCase(), o = ["token", "tokens", "theme", "themes"], a = e.isLocal;
  if (a === !1 || a === void 0 && o.includes(i))
    try {
      const c = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((d) => d.name.trim().toLowerCase() === i);
      if (c) {
        Yn(e.collectionName, !1);
        const d = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          c.key
        );
        if (d.length > 0) {
          const p = await figma.variables.importVariableByKeyAsync(d[0].key), h = await figma.variables.getVariableCollectionByIdAsync(
            p.variableCollectionId
          );
          if (h) {
            if (n = h, e.collectionGuid) {
              const $ = n.getSharedPluginData(
                "recursica",
                Ue
              );
              (!$ || $.trim() === "") && n.setSharedPluginData(
                "recursica",
                Ue,
                e.collectionGuid
              );
            } else
              await dt(n);
            return await Ke(n, e.modes), { collection: n };
          }
        }
      }
    } catch (r) {
      if (a === !1)
        throw new Error(
          `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
        );
      console.log("Could not import external collection, trying local:", r);
    }
  if (a !== !1) {
    const r = await figma.variables.getLocalVariableCollectionsAsync();
    let c;
    if (e.collectionGuid && (c = r.find((d) => d.getSharedPluginData("recursica", Ue) === e.collectionGuid)), c || (c = r.find(
      (d) => d.name === e.collectionName
    )), c)
      if (n = c, e.collectionGuid) {
        const d = n.getSharedPluginData(
          "recursica",
          Ue
        );
        (!d || d.trim() === "") && n.setSharedPluginData(
          "recursica",
          Ue,
          e.collectionGuid
        );
      } else
        await dt(n);
    else
      n = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? n.setSharedPluginData(
        "recursica",
        Ue,
        e.collectionGuid
      ) : await dt(n);
  } else {
    const r = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), c = e.collectionName.trim().toLowerCase(), d = r.find((y) => y.name.trim().toLowerCase() === c);
    if (!d)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const p = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      d.key
    );
    if (p.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const h = await figma.variables.importVariableByKeyAsync(
      p[0].key
    ), $ = await figma.variables.getVariableCollectionByIdAsync(
      h.variableCollectionId
    );
    if (!$)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (n = $, e.collectionGuid) {
      const y = n.getSharedPluginData(
        "recursica",
        Ue
      );
      (!y || y.trim() === "") && n.setSharedPluginData(
        "recursica",
        Ue,
        e.collectionGuid
      );
    } else
      dt(n);
  }
  return await Ke(n, e.modes), { collection: n };
}
async function Tt(e, n) {
  for (const i of e.variableIds)
    try {
      const o = await figma.variables.getVariableByIdAsync(i);
      if (o && o.name === n)
        return o;
    } catch (o) {
      continue;
    }
  return null;
}
async function Qn(e, n, i, o, a) {
  t.log(
    `Restoring values for variable "${e.name}" (type: ${e.resolvedType}):`
  ), t.log(
    `  valuesByMode keys: ${Object.keys(n).join(", ")}`
  );
  for (const [l, r] of Object.entries(n)) {
    const c = Zt.get(`${o.id}:${l}`) || l;
    let d = o.modes.find((h) => h.name === c);
    if (d || (d = o.modes.find((h) => h.name === l)), !d) {
      t.warning(
        `Mode "${l}" (mapped: "${c}") not found in collection "${o.name}" for variable "${e.name}". Available modes: ${o.modes.map((h) => h.name).join(", ")}. Skipping.`
      );
      continue;
    }
    const p = d.modeId;
    try {
      if (r == null) {
        t.log(
          `  Mode "${l}": value is null/undefined, skipping`
        );
        continue;
      }
      if (t.log(
        `  Mode "${l}": value type=${typeof r}, value=${JSON.stringify(r)}`
      ), typeof r == "string" || typeof r == "number" || typeof r == "boolean") {
        e.setValueForMode(p, r);
        continue;
      }
      if (typeof r == "object" && r !== null && "r" in r && "g" in r && "b" in r && typeof r.r == "number" && typeof r.g == "number" && typeof r.b == "number") {
        const h = r, $ = {
          r: h.r,
          g: h.g,
          b: h.b
        };
        h.a !== void 0 && ($.a = h.a), e.setValueForMode(p, $);
        const y = e.valuesByMode[p];
        if (t.log(
          `  Set color value for "${e.name}" mode "${l}": r=${$.r.toFixed(3)}, g=${$.g.toFixed(3)}, b=${$.b.toFixed(3)}${$.a !== void 0 ? `, a=${$.a.toFixed(3)}` : ""}`
        ), t.log(`  Read back value: ${JSON.stringify(y)}`), typeof y == "object" && y !== null && "r" in y && "g" in y && "b" in y) {
          const m = y, b = Math.abs(m.r - $.r) < 1e-3, s = Math.abs(m.g - $.g) < 1e-3, v = Math.abs(m.b - $.b) < 1e-3;
          !b || !s || !v ? t.warning(
            `  ⚠️ Value mismatch! Set: r=${$.r}, g=${$.g}, b=${$.b}, Read back: r=${m.r}, g=${m.g}, b=${m.b}`
          ) : t.log(
            "  ✓ Value verified: read-back matches what we set"
          );
        } else
          t.warning(
            `  ⚠️ Read-back value is not an RGB object: ${JSON.stringify(y)}`
          );
        continue;
      }
      if (typeof r == "object" && r !== null && "_varRef" in r && typeof r._varRef == "number") {
        const h = r;
        let $ = null;
        const y = i.getVariableByIndex(
          h._varRef
        );
        if (y) {
          let m = null;
          if (a && y._colRef !== void 0) {
            const b = a.getCollectionByIndex(
              y._colRef
            );
            b && (m = (await Zn(b)).collection);
          }
          m && ($ = await Tt(
            m,
            y.variableName
          ));
        }
        if ($) {
          const m = {
            type: "VARIABLE_ALIAS",
            id: $.id
          };
          e.setValueForMode(p, m);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${l}" in variable "${e.name}". Variable reference index: ${h._varRef}`
          );
      }
    } catch (h) {
      typeof r == "object" && r !== null && !("_varRef" in r) && !("r" in r && "g" in r && "b" in r) && t.warning(
        `Unhandled value type for mode "${l}" in variable "${e.name}": ${JSON.stringify(r)}`
      ), console.warn(
        `Error setting value for mode "${l}" in variable "${e.name}":`,
        h
      );
    }
  }
}
async function It(e, n, i, o) {
  if (t.log(
    `Creating variable "${e.variableName}" (type: ${e.variableType})`
  ), e.valuesByMode) {
    t.log(
      `  valuesByMode has ${Object.keys(e.valuesByMode).length} mode(s): ${Object.keys(e.valuesByMode).join(", ")}`
    );
    for (const [l, r] of Object.entries(e.valuesByMode))
      t.log(
        `  Mode "${l}": ${JSON.stringify(r)} (type: ${typeof r})`
      );
  } else
    t.log(
      `  No valuesByMode found for variable "${e.variableName}"`
    );
  const a = figma.variables.createVariable(
    e.variableName,
    n,
    e.variableType
  );
  if (e.valuesByMode && await Qn(
    a,
    e.valuesByMode,
    i,
    n,
    // Pass collection to look up modes by name
    o
  ), e.valuesByMode && a.valuesByMode) {
    t.log(`  Verifying values for "${e.variableName}":`);
    for (const [l, r] of Object.entries(
      e.valuesByMode
    )) {
      const c = n.modes.find((d) => d.name === l);
      if (c) {
        const d = a.valuesByMode[c.modeId];
        t.log(
          `    Mode "${l}": expected=${JSON.stringify(r)}, actual=${JSON.stringify(d)}`
        );
      }
    }
  }
  return a;
}
async function ei(e, n, i, o) {
  const a = n.getVariableByIndex(e);
  if (!a || a._colRef === void 0)
    return null;
  const l = o.get(String(a._colRef));
  if (!l)
    return null;
  const r = await Tt(
    l,
    a.variableName
  );
  if (r) {
    let c;
    if (typeof a.variableType == "number" ? c = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[a.variableType] || String(a.variableType) : c = a.variableType, tn(r, c))
      return r;
  }
  return await It(
    a,
    l,
    n,
    i
  );
}
async function Qt(e, n, i, o) {
  if (!(!n || typeof n != "object"))
    try {
      const a = e[i];
      if (!a || !Array.isArray(a))
        return;
      const l = n[i];
      if (Array.isArray(l))
        for (let r = 0; r < l.length && r < a.length; r++) {
          const c = l[r];
          if (c && typeof c == "object") {
            if (a[r].boundVariables || (a[r].boundVariables = {}), ze(c)) {
              const d = c._varRef;
              if (d !== void 0) {
                const p = o.get(String(d));
                p && (a[r].boundVariables.color = {
                  type: "VARIABLE_ALIAS",
                  id: p.id
                });
              }
            } else
              for (const [d, p] of Object.entries(
                c
              ))
                if (ze(p)) {
                  const h = p._varRef;
                  if (h !== void 0) {
                    const $ = o.get(String(h));
                    $ && (a[r].boundVariables[d] = {
                      type: "VARIABLE_ALIAS",
                      id: $.id
                    });
                  }
                }
          }
        }
    } catch (a) {
      console.log(`Error restoring bound variables for ${i}:`, a);
    }
}
function en(e) {
  if (!e || typeof e != "object")
    return !1;
  if (e._styleRef !== void 0 || e._fillStyleRef !== void 0 || e._effectStyleRef !== void 0 || e._gridStyleRef !== void 0)
    return !0;
  if (Array.isArray(e.fills)) {
    for (const n of e.fills)
      if (n && typeof n == "object" && n._styleRef !== void 0)
        return !0;
  }
  if (Array.isArray(e.backgrounds)) {
    for (const n of e.backgrounds)
      if (n && typeof n == "object" && n._styleRef !== void 0)
        return !0;
  }
  if (Array.isArray(e.children)) {
    for (const n of e.children)
      if (en(n))
        return !0;
  }
  return !1;
}
async function ti(e, n) {
  const i = /* @__PURE__ */ new Map();
  t.log(`Importing ${Object.keys(e).length} styles...`);
  const o = Object.entries(e).sort(
    (a, l) => parseInt(a[0], 10) - parseInt(l[0], 10)
  );
  for (const [a, l] of o) {
    const r = parseInt(a, 10), c = l.name || "Unnamed Style", d = l.type;
    let p = null;
    switch (d) {
      case "TEXT":
        p = (await figma.getLocalTextStylesAsync()).find(
          ($) => $.name === c
        ) || null;
        break;
      case "PAINT":
        p = (await figma.getLocalPaintStylesAsync()).find(
          ($) => $.name === c
        ) || null;
        break;
      case "EFFECT":
        p = (await figma.getLocalEffectStylesAsync()).find(
          ($) => $.name === c
        ) || null;
        break;
      case "GRID":
        p = (await figma.getLocalGridStylesAsync()).find(
          ($) => $.name === c
        ) || null;
        break;
    }
    if (p) {
      t.log(
        `  Skipping creation of style "${c}" (type: ${d}) as it already exists. Reusing existing style.`
      ), i.set(r, p);
      continue;
    }
    let h = null;
    try {
      switch (d) {
        case "TEXT":
          h = await ni(l, n);
          break;
        case "PAINT":
          h = await ii(l, n);
          break;
        case "EFFECT":
          h = await oi(l, n);
          break;
        case "GRID":
          h = await ri(l, n);
          break;
        default:
          t.warning(
            `  Unknown style type "${d}" for style "${c}". Skipping.`
          );
          break;
      }
      h && (i.set(r, h), t.log(
        `  ✓ Created style "${c}" (type: ${d})`
      ));
    } catch ($) {
      t.warning(
        `  Failed to create style "${c}" (type: ${d}): ${$}`
      );
    }
  }
  return i;
}
async function ni(e, n) {
  var o, a, l, r, c, d, p, h;
  const i = figma.createTextStyle();
  if (i.name = e.name, e.textStyle && (e.textStyle.fontName !== void 0 && !((o = e.textStyle.boundVariables) != null && o.fontName) && (await figma.loadFontAsync(e.textStyle.fontName), i.fontName = e.textStyle.fontName), e.textStyle.fontSize !== void 0 && !((a = e.textStyle.boundVariables) != null && a.fontSize) && (i.fontSize = e.textStyle.fontSize), e.textStyle.letterSpacing !== void 0 && !((l = e.textStyle.boundVariables) != null && l.letterSpacing) && (i.letterSpacing = e.textStyle.letterSpacing), e.textStyle.lineHeight !== void 0 && !((r = e.textStyle.boundVariables) != null && r.lineHeight) && (i.lineHeight = e.textStyle.lineHeight), e.textStyle.textCase !== void 0 && !((c = e.textStyle.boundVariables) != null && c.textCase) && (i.textCase = e.textStyle.textCase), e.textStyle.textDecoration !== void 0 && !((d = e.textStyle.boundVariables) != null && d.textDecoration) && (i.textDecoration = e.textStyle.textDecoration), e.textStyle.paragraphSpacing !== void 0 && !((p = e.textStyle.boundVariables) != null && p.paragraphSpacing) && (i.paragraphSpacing = e.textStyle.paragraphSpacing), e.textStyle.paragraphIndent !== void 0 && !((h = e.textStyle.boundVariables) != null && h.paragraphIndent) && (i.paragraphIndent = e.textStyle.paragraphIndent), e.textStyle.boundVariables))
    for (const [$, y] of Object.entries(
      e.textStyle.boundVariables
    )) {
      let m;
      if (typeof y == "object" && y !== null && "_varRef" in y) {
        const b = y._varRef;
        m = n.get(String(b));
      } else {
        const b = typeof y == "string" ? y : String(y);
        m = n.get(b);
      }
      if (m)
        try {
          i.setBoundVariable($, m);
        } catch (b) {
          t.warning(
            `Could not bind variable to text style property "${$}": ${b}`
          );
        }
    }
  return i;
}
async function ii(e, n) {
  const i = figma.createPaintStyle();
  return i.name = e.name, e.paintStyle && e.paintStyle.paints && (i.paints = e.paintStyle.paints), i;
}
async function oi(e, n) {
  const i = figma.createEffectStyle();
  return i.name = e.name, e.effectStyle && e.effectStyle.effects && (i.effects = e.effectStyle.effects), i;
}
async function ri(e, n) {
  const i = figma.createGridStyle();
  return i.name = e.name, e.gridStyle && e.gridStyle.layoutGrids && (i.layoutGrids = e.gridStyle.layoutGrids), i;
}
function ai(e, n, i = !1) {
  const o = Nn(n);
  if (e.visible === void 0 && (e.visible = o.visible), e.locked === void 0 && (e.locked = o.locked), e.opacity === void 0 && (e.opacity = o.opacity), e.rotation === void 0 && (e.rotation = o.rotation), e.blendMode === void 0 && (e.blendMode = o.blendMode), n === "FRAME" || n === "COMPONENT" || n === "INSTANCE") {
    const a = Ae;
    e.layoutMode === void 0 && (e.layoutMode = a.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = a.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = a.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = a.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = a.counterAxisAlignItems), i || (e.paddingLeft === void 0 && (e.paddingLeft = a.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = a.paddingRight), e.paddingTop === void 0 && (e.paddingTop = a.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = a.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = a.itemSpacing), e.counterAxisSpacing === void 0 && (e.counterAxisSpacing = a.counterAxisSpacing));
  }
  if (n === "TEXT") {
    const a = ke;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = a.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = a.textAlignVertical), e.textCase === void 0 && (e.textCase = a.textCase), e.textDecoration === void 0 && (e.textDecoration = a.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = a.textAutoResize);
  }
}
async function Xe(e, n, i = null, o = null, a = null, l = null, r = null, c = !1, d = null, p = null, h = null, $ = null, y = null, m, b = null) {
  var x, S, u, P, w, V, z, Z, k, L, q, Q, te, ne, K, J, U, j, Y, re, he, fe, ce, ae, se, de, me, Se, Ve, je, nt, Je, R, pe, ie;
  let s;
  switch (e.type) {
    case "FRAME":
      s = figma.createFrame();
      break;
    case "RECTANGLE":
      s = figma.createRectangle();
      break;
    case "ELLIPSE":
      s = figma.createEllipse();
      break;
    case "TEXT":
      s = figma.createText();
      break;
    case "VECTOR":
      s = figma.createVector();
      break;
    case "STAR":
      s = figma.createStar();
      break;
    case "LINE":
      s = figma.createLine();
      break;
    case "COMPONENT":
      if (e.id && r && r.has(e.id))
        s = r.get(e.id), t.log(
          `Reusing existing COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id.substring(0, 8)}...)`
        );
      else if (s = figma.createComponent(), t.log(
        `Created COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id ? e.id.substring(0, 8) + "..." : "no ID"})`
      ), e.componentPropertyDefinitions) {
        const N = e.componentPropertyDefinitions;
        let T = 0, f = 0;
        for (const [A, G] of Object.entries(N))
          try {
            const _ = G.type;
            let F = null;
            if (typeof _ == "string" ? (_ === "TEXT" || _ === "BOOLEAN" || _ === "INSTANCE_SWAP" || _ === "VARIANT") && (F = _) : typeof _ == "number" && (F = {
              2: "TEXT",
              // Text property
              25: "BOOLEAN",
              // Boolean property
              27: "INSTANCE_SWAP",
              // Instance swap property
              26: "VARIANT"
              // Variant property
            }[_] || null), !F) {
              t.warning(
                `  Unknown property type ${_} (${typeof _}) for property "${A}" in component "${e.name || "Unnamed"}"`
              ), f++;
              continue;
            }
            const D = G.defaultValue, ee = A.split("#")[0];
            s.addComponentProperty(
              ee,
              F,
              D
            ), T++;
          } catch (_) {
            t.warning(
              `  Failed to add component property "${A}" to "${e.name || "Unnamed"}": ${_}`
            ), f++;
          }
        T > 0 && t.log(
          `  Added ${T} component property definition(s) to "${e.name || "Unnamed"}"${f > 0 ? ` (${f} failed)` : ""}`
        );
      }
      break;
    case "COMPONENT_SET": {
      const N = e.children ? e.children.filter((A) => A.type === "COMPONENT").length : 0;
      t.log(
        `Creating COMPONENT_SET "${e.name || "Unnamed"}" by combining ${N} component variant(s)`
      );
      const T = [];
      let f = null;
      if (e.children && Array.isArray(e.children)) {
        f = figma.createFrame(), f.name = `_temp_${e.name || "COMPONENT_SET"}`, f.visible = !1, ((n == null ? void 0 : n.type) === "PAGE" ? n : figma.currentPage).appendChild(f);
        for (const G of e.children)
          if (G.type === "COMPONENT" && !G._truncated)
            try {
              const _ = await Xe(
                G,
                f,
                // Use temp parent for now
                i,
                o,
                a,
                l,
                r,
                c,
                d,
                p,
                // Pass deferredInstances through for component set creation
                null,
                // parentNodeData - not needed here, will be passed correctly in recursive calls
                $,
                y,
                // Pass placeholderFrameIds through for component set creation
                void 0,
                // currentPlaceholderId - component set creation is not inside a placeholder
                b
                // Pass styleMapping to apply styles
              );
              _ && _.type === "COMPONENT" && (T.push(_), t.log(
                `  Created component variant: "${_.name || "Unnamed"}"`
              ));
            } catch (_) {
              t.warning(
                `  Failed to create component variant "${G.name || "Unnamed"}": ${_}`
              );
            }
      }
      if (T.length > 0)
        try {
          const A = n || figma.currentPage, G = figma.combineAsVariants(
            T,
            A
          );
          e.name && (G.name = e.name), e.x !== void 0 && (G.x = e.x), e.y !== void 0 && (G.y = e.y), f && f.parent && f.remove(), t.log(
            `  ✓ Successfully created COMPONENT_SET "${G.name}" with ${T.length} variant(s)`
          ), s = G;
        } catch (A) {
          if (t.warning(
            `  Failed to combine components into COMPONENT_SET "${e.name || "Unnamed"}": ${A}. Falling back to frame.`
          ), s = figma.createFrame(), e.name && (s.name = e.name), f && f.children.length > 0) {
            for (const G of f.children)
              s.appendChild(G);
            f.remove();
          }
        }
      else
        t.warning(
          `  No valid component variants found for COMPONENT_SET "${e.name || "Unnamed"}". Creating frame instead.`
        ), s = figma.createFrame(), e.name && (s.name = e.name), f && f.remove();
      break;
    }
    case "INSTANCE":
      if (c)
        s = figma.createFrame(), e.name && (s.name = e.name);
      else if (e._instanceRef !== void 0 && a && r) {
        const N = a.getInstanceByIndex(
          e._instanceRef
        );
        if (N && N.instanceType === "internal")
          if (N.componentNodeId)
            if (N.componentNodeId === e.id)
              t.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), s = figma.createFrame(), e.name && (s.name = e.name);
            else {
              const T = r.get(
                N.componentNodeId
              );
              if (!T) {
                const f = Array.from(r.keys()).slice(
                  0,
                  20
                );
                t.error(
                  `Component not found for internal instance "${e.name}" (ID: ${N.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), t.error(
                  `Looking for component ID: ${N.componentNodeId}`
                ), t.error(
                  `Available IDs in mapping (first 20): ${f.map((D) => D.substring(0, 8) + "...").join(", ")}`
                );
                const A = (D, ee) => {
                  if (D.type === "COMPONENT" && D.id === ee)
                    return !0;
                  if (D.children && Array.isArray(D.children)) {
                    for (const X of D.children)
                      if (!X._truncated && A(X, ee))
                        return !0;
                  }
                  return !1;
                }, G = A(
                  e,
                  N.componentNodeId
                );
                t.error(
                  `Component ID ${N.componentNodeId.substring(0, 8)}... exists in current node tree: ${G}`
                ), t.error(
                  `WARNING: Component ID ${N.componentNodeId.substring(0, 8)}... not found in nodeIdMapping. This might indicate:`
                ), t.error(
                  "  1. The component doesn't exist in the pageData (detached component?)"
                ), t.error(
                  "  2. The component wasn't collected in the first pass"
                ), t.error(
                  "  3. The component ID in the instance table doesn't match the actual component ID"
                );
                const _ = f.filter(
                  (D) => D.startsWith(N.componentNodeId.substring(0, 8))
                );
                _.length > 0 && t.error(
                  `Found IDs with matching prefix: ${_.map((D) => D.substring(0, 8) + "...").join(", ")}`
                );
                const F = `Component not found for internal instance "${e.name}" (ID: ${N.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${f.map((D) => D.substring(0, 8) + "...").join(", ")}`;
                throw new Error(F);
              }
              if (T && T.type === "COMPONENT") {
                if (s = T.createInstance(), t.log(
                  `✓ Created internal instance "${e.name}" from component "${N.componentName}"`
                ), N.variantProperties && Object.keys(N.variantProperties).length > 0)
                  try {
                    let f = null;
                    if (T.parent && T.parent.type === "COMPONENT_SET")
                      f = T.parent.componentPropertyDefinitions, t.log(
                        `  DEBUG: Component "${N.componentName}" is inside component set "${T.parent.name}" with ${Object.keys(f || {}).length} property definitions`
                      );
                    else {
                      const A = await s.getMainComponentAsync();
                      if (A) {
                        const G = A.type;
                        t.log(
                          `  DEBUG: Internal instance "${e.name}" - componentNode parent: ${T.parent ? T.parent.type : "N/A"}, mainComponent type: ${G}, mainComponent parent: ${A.parent ? A.parent.type : "N/A"}`
                        ), G === "COMPONENT_SET" ? f = A.componentPropertyDefinitions : G === "COMPONENT" && A.parent && A.parent.type === "COMPONENT_SET" ? (f = A.parent.componentPropertyDefinitions, t.log(
                          `  DEBUG: Found component set parent "${A.parent.name}" with ${Object.keys(f || {}).length} property definitions`
                        )) : t.log(
                          `  Skipping variant properties for internal instance "${e.name}" - component "${N.componentName}" is not yet in a COMPONENT_SET (will be moved later during component set creation)`
                        );
                      }
                    }
                    if (f) {
                      const A = {};
                      for (const [G, _] of Object.entries(
                        N.variantProperties
                      )) {
                        const F = G.split("#")[0];
                        f[F] && (A[F] = _);
                      }
                      Object.keys(A).length > 0 && s.setProperties(A);
                    }
                  } catch (f) {
                    const A = `Failed to set variant properties for instance "${e.name}": ${f}`;
                    throw t.error(A), new Error(A);
                  }
                if (N.componentProperties && Object.keys(N.componentProperties).length > 0)
                  try {
                    const f = await s.getMainComponentAsync();
                    if (f) {
                      let A = null;
                      const G = f.type;
                      if (G === "COMPONENT_SET" ? A = f.componentPropertyDefinitions : G === "COMPONENT" && f.parent && f.parent.type === "COMPONENT_SET" ? A = f.parent.componentPropertyDefinitions : G === "COMPONENT" && (A = f.componentPropertyDefinitions), A)
                        for (const [_, F] of Object.entries(
                          N.componentProperties
                        )) {
                          const D = _.split("#")[0];
                          if (A[D])
                            try {
                              let ee = F;
                              F && typeof F == "object" && "value" in F && (ee = F.value), s.setProperties({
                                [D]: ee
                              });
                            } catch (ee) {
                              const X = `Failed to set component property "${D}" for internal instance "${e.name}": ${ee}`;
                              throw t.error(X), new Error(X);
                            }
                        }
                    } else
                      t.warning(
                        `Cannot set component properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (f) {
                    if (f instanceof Error)
                      throw f;
                    const A = `Failed to set component properties for instance "${e.name}": ${f}`;
                    throw t.error(A), new Error(A);
                  }
              } else if (!s && T) {
                const f = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${N.componentNodeId.substring(0, 8)}...).`;
                throw t.error(f), new Error(f);
              }
            }
          else {
            const T = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw t.error(T), new Error(T);
          }
        else if (N && N.instanceType === "remote")
          if (d) {
            const T = d.get(
              e._instanceRef
            );
            if (T) {
              if (s = T.createInstance(), t.log(
                `✓ Created remote instance "${e.name}" from component "${N.componentName}" on REMOTES page`
              ), N.variantProperties && Object.keys(N.variantProperties).length > 0)
                try {
                  const f = await s.getMainComponentAsync();
                  if (f) {
                    let A = null;
                    const G = f.type;
                    if (G === "COMPONENT_SET" ? A = f.componentPropertyDefinitions : G === "COMPONENT" && f.parent && f.parent.type === "COMPONENT_SET" ? A = f.parent.componentPropertyDefinitions : t.log(
                      `Skipping variant properties for remote instance "${e.name}" - main component is not a COMPONENT_SET or variant (expected for remote components)`
                    ), A) {
                      const _ = {};
                      for (const [F, D] of Object.entries(
                        N.variantProperties
                      )) {
                        const ee = F.split("#")[0];
                        A[ee] && (_[ee] = D);
                      }
                      Object.keys(_).length > 0 && s.setProperties(_);
                    }
                  } else
                    t.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (f) {
                  const A = `Failed to set variant properties for remote instance "${e.name}": ${f}`;
                  throw t.error(A), new Error(A);
                }
              if (N.componentProperties && Object.keys(N.componentProperties).length > 0)
                try {
                  const f = await s.getMainComponentAsync();
                  if (f) {
                    let A = null;
                    const G = f.type;
                    if (G === "COMPONENT_SET" ? A = f.componentPropertyDefinitions : G === "COMPONENT" && f.parent && f.parent.type === "COMPONENT_SET" ? A = f.parent.componentPropertyDefinitions : G === "COMPONENT" && (A = f.componentPropertyDefinitions), A)
                      for (const [_, F] of Object.entries(
                        N.componentProperties
                      )) {
                        const D = _.split("#")[0];
                        if (A[D])
                          try {
                            let ee = F;
                            F && typeof F == "object" && "value" in F && (ee = F.value), s.setProperties({
                              [D]: ee
                            });
                          } catch (ee) {
                            const X = `Failed to set component property "${D}" for remote instance "${e.name}": ${ee}`;
                            throw t.error(X), new Error(X);
                          }
                      }
                  } else
                    t.warning(
                      `Cannot set component properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (f) {
                  if (f instanceof Error)
                    throw f;
                  const A = `Failed to set component properties for remote instance "${e.name}": ${f}`;
                  throw t.error(A), new Error(A);
                }
              if (e.width !== void 0 && e.height !== void 0)
                try {
                  s.resize(e.width, e.height);
                } catch (f) {
                  t.log(
                    `Note: Could not resize remote instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
                  );
                }
            } else {
              const f = `Remote component not found for instance "${e.name}" (index ${e._instanceRef}). The remote component should have been created on the REMOTES page.`;
              throw t.error(f), new Error(f);
            }
          } else {
            const T = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw t.error(T), new Error(T);
          }
        else if ((N == null ? void 0 : N.instanceType) === "normal") {
          if (!N.componentPageName) {
            const F = `Normal instance "${e.name}" missing componentPageName. Cannot resolve.`;
            throw t.error(F), new Error(F);
          }
          await figma.loadAllPagesAsync();
          const T = figma.root.children.find(
            (F) => F.name === N.componentPageName
          );
          if (!T) {
            t.log(
              `  Deferring normal instance "${e.name}" - referenced page "${N.componentPageName}" does not exist yet (may be circular reference or not yet imported)`
            );
            const F = figma.createFrame();
            if (F.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (F.x = e.x), e.y !== void 0 && (F.y = e.y), e.width !== void 0 && e.height !== void 0 ? F.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && F.resize(e.w, e.h), y && y.add(F.id), p) {
              const D = m;
              D ? t.log(
                `[NESTED] Creating child deferred instance "${e.name}" with parent placeholder ID ${D.substring(0, 8)}... (immediate parent: "${n.name}" ${n.id.substring(0, 8)}...)`
              ) : t.log(
                `[NESTED] Creating top-level deferred instance "${e.name}" - parent "${n.name}" (${n.id.substring(0, 8)}...)`
              );
              let ee = n.id;
              if (D)
                try {
                  const oe = await figma.getNodeByIdAsync(D);
                  oe && oe.parent && (ee = oe.parent.id);
                } catch (oe) {
                  ee = n.id;
                }
              const X = {
                placeholderFrameId: F.id,
                instanceEntry: N,
                nodeData: e,
                parentNodeId: ee,
                parentPlaceholderId: D,
                instanceIndex: e._instanceRef
              };
              p.push(X);
            }
            s = F;
            break;
          }
          let f = null;
          const A = (F, D, ee, X, oe) => {
            if (D.length === 0) {
              let ye = null;
              for (const ve of F.children || [])
                if (ve.type === "COMPONENT") {
                  if (ve.name === ee)
                    if (ye || (ye = ve), X)
                      try {
                        const Ne = ve.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (Ne && JSON.parse(Ne).id === X)
                          return ve;
                      } catch (Ne) {
                      }
                    else
                      return ve;
                } else if (ve.type === "COMPONENT_SET") {
                  if (oe && ve.name !== oe)
                    continue;
                  for (const Ne of ve.children || [])
                    if (Ne.type === "COMPONENT" && Ne.name === ee)
                      if (ye || (ye = Ne), X)
                        try {
                          const De = Ne.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (De && JSON.parse(De).id === X)
                            return Ne;
                        } catch (De) {
                        }
                      else
                        return Ne;
                }
              return ye;
            }
            const [be, ...ue] = D;
            for (const ye of F.children || [])
              if (ye.name === be) {
                if (ue.length === 0 && ye.type === "COMPONENT_SET") {
                  if (oe && ye.name !== oe)
                    continue;
                  for (const ve of ye.children || [])
                    if (ve.type === "COMPONENT" && ve.name === ee) {
                      if (X)
                        try {
                          const Ne = ve.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (Ne && JSON.parse(Ne).id === X)
                            return ve;
                        } catch (Ne) {
                        }
                      return ve;
                    }
                  return null;
                }
                return A(
                  ye,
                  ue,
                  ee,
                  X,
                  oe
                );
              }
            return null;
          };
          t.log(
            `  Looking for component "${N.componentName}" on page "${N.componentPageName}"${N.path && N.path.length > 0 ? ` at path [${N.path.join(" → ")}]` : " at page root"}${N.componentGuid ? ` (GUID: ${N.componentGuid.substring(0, 8)}...)` : ""}`
          );
          const G = [], _ = (F, D = 0) => {
            const ee = "  ".repeat(D);
            if (F.type === "COMPONENT")
              G.push(`${ee}COMPONENT: "${F.name}"`);
            else if (F.type === "COMPONENT_SET") {
              G.push(
                `${ee}COMPONENT_SET: "${F.name}"`
              );
              for (const X of F.children || [])
                X.type === "COMPONENT" && G.push(
                  `${ee}  └─ COMPONENT: "${X.name}"`
                );
            }
            for (const X of F.children || [])
              _(X, D + 1);
          };
          if (_(T), G.length > 0 ? t.log(
            `  Available components on page "${N.componentPageName}":
${G.slice(0, 20).join(`
`)}${G.length > 20 ? `
  ... and ${G.length - 20} more` : ""}`
          ) : t.warning(
            `  No components found on page "${N.componentPageName}"`
          ), f = A(
            T,
            N.path || [],
            N.componentName,
            N.componentGuid,
            N.componentSetName
          ), f && N.componentGuid)
            try {
              const F = f.getPluginData(
                "RecursicaPublishedMetadata"
              );
              if (F) {
                const D = JSON.parse(F);
                D.id !== N.componentGuid ? t.warning(
                  `  Found component "${N.componentName}" by name but GUID verification failed (expected ${N.componentGuid.substring(0, 8)}..., got ${D.id ? D.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`
                ) : t.log(
                  `  Found component "${N.componentName}" with matching GUID ${N.componentGuid.substring(0, 8)}...`
                );
              } else
                t.warning(
                  `  Found component "${N.componentName}" by name but no metadata found. Using name match as fallback.`
                );
            } catch (F) {
              t.warning(
                `  Found component "${N.componentName}" by name but GUID verification failed. Using name match as fallback.`
              );
            }
          if (!f) {
            t.log(
              `  Deferring normal instance "${e.name}" - component "${N.componentName}" not found on page "${N.componentPageName}" (may not be created yet due to circular reference)`
            );
            const F = figma.createFrame();
            if (F.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (F.x = e.x), e.y !== void 0 && (F.y = e.y), e.width !== void 0 && e.height !== void 0 ? F.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && F.resize(e.w, e.h), y && y.add(F.id), p) {
              const D = m;
              D ? t.log(
                `[NESTED] Creating child deferred instance "${e.name}" with parent placeholder ID ${D.substring(0, 8)}... (immediate parent: "${n.name}" ${n.id.substring(0, 8)}...)`
              ) : t.log(
                `[NESTED] Creating top-level deferred instance "${e.name}" - parent "${n.name}" (${n.id.substring(0, 8)}...)`
              );
              let ee = n.id;
              if (D)
                try {
                  const oe = await figma.getNodeByIdAsync(D);
                  oe && oe.parent && (ee = oe.parent.id);
                } catch (oe) {
                  ee = n.id;
                }
              const X = {
                placeholderFrameId: F.id,
                instanceEntry: N,
                nodeData: e,
                parentNodeId: ee,
                parentPlaceholderId: D,
                instanceIndex: e._instanceRef
              };
              p.push(X);
            }
            s = F;
            break;
          }
          if (s = f.createInstance(), t.log(
            `  Created normal instance "${e.name}" from component "${N.componentName}" on page "${N.componentPageName}"`
          ), N.variantProperties && Object.keys(N.variantProperties).length > 0)
            try {
              const F = await s.getMainComponentAsync();
              if (F) {
                let D = null;
                const ee = F.type;
                if (ee === "COMPONENT_SET" ? D = F.componentPropertyDefinitions : ee === "COMPONENT" && F.parent && F.parent.type === "COMPONENT_SET" ? D = F.parent.componentPropertyDefinitions : t.warning(
                  `Cannot set variant properties for normal instance "${e.name}" - main component is not a COMPONENT_SET or variant`
                ), D) {
                  const X = {};
                  for (const [oe, be] of Object.entries(
                    N.variantProperties
                  )) {
                    const ue = oe.split("#")[0];
                    D[ue] && (X[ue] = be);
                  }
                  Object.keys(X).length > 0 && s.setProperties(X);
                }
              }
            } catch (F) {
              t.warning(
                `Failed to set variant properties for normal instance "${e.name}": ${F}`
              );
            }
          if (N.componentProperties && Object.keys(N.componentProperties).length > 0)
            try {
              const F = await s.getMainComponentAsync();
              if (F) {
                let D = null;
                const ee = F.type;
                if (ee === "COMPONENT_SET" ? D = F.componentPropertyDefinitions : ee === "COMPONENT" && F.parent && F.parent.type === "COMPONENT_SET" ? D = F.parent.componentPropertyDefinitions : ee === "COMPONENT" && (D = F.componentPropertyDefinitions), D) {
                  const X = {};
                  for (const [oe, be] of Object.entries(
                    N.componentProperties
                  )) {
                    const ue = oe.split("#")[0];
                    let ye;
                    if (D[oe] ? ye = oe : D[ue] ? ye = ue : ye = Object.keys(D).find(
                      (ve) => ve.split("#")[0] === ue
                    ), ye) {
                      const ve = be && typeof be == "object" && "value" in be ? be.value : be;
                      X[ye] = ve;
                    } else
                      t.warning(
                        `Component property "${ue}" (from "${oe}") does not exist on component "${N.componentName}" for normal instance "${e.name}". Available properties: ${Object.keys(D).join(", ") || "none"}`
                      );
                  }
                  if (Object.keys(X).length > 0)
                    try {
                      t.log(
                        `  Attempting to set component properties for normal instance "${e.name}": ${Object.keys(X).join(", ")}`
                      ), t.log(
                        `  Available component properties: ${Object.keys(D).join(", ")}`
                      ), s.setProperties(X), t.log(
                        `  ✓ Successfully set component properties for normal instance "${e.name}": ${Object.keys(X).join(", ")}`
                      );
                    } catch (oe) {
                      t.warning(
                        `Failed to set component properties for normal instance "${e.name}": ${oe}`
                      ), t.warning(
                        `  Properties attempted: ${JSON.stringify(X)}`
                      ), t.warning(
                        `  Available properties: ${JSON.stringify(Object.keys(D))}`
                      );
                    }
                }
              } else
                t.warning(
                  `Cannot set component properties for normal instance "${e.name}" - main component not found`
                );
            } catch (F) {
              t.warning(
                `Failed to set component properties for normal instance "${e.name}": ${F}`
              );
            }
          if (e.width !== void 0 && e.height !== void 0)
            try {
              s.resize(e.width, e.height);
            } catch (F) {
              t.log(
                `Note: Could not resize normal instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
              );
            }
        } else {
          const T = `Instance "${e.name}" has unknown or missing instance type: ${(N == null ? void 0 : N.instanceType) || "unknown"}`;
          throw t.error(T), new Error(T);
        }
      } else {
        const N = `Instance "${e.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        throw t.error(N), new Error(N);
      }
      break;
    case "GROUP":
      s = figma.createFrame();
      break;
    case "BOOLEAN_OPERATION": {
      t.log(
        `Converting BOOLEAN_OPERATION "${e.name}" to VECTOR node (boolean operations cannot be created directly in Figma API)`
      ), s = figma.createVector();
      break;
    }
    case "POLYGON":
      s = figma.createPolygon();
      break;
    default: {
      const N = `Unsupported node type: ${e.type}. This node type cannot be imported.`;
      throw t.error(N), new Error(N);
    }
  }
  if (!s)
    return null;
  e.id && r && (r.set(e.id, s), s.type === "COMPONENT" && t.log(
    `  Stored COMPONENT "${e.name || "Unnamed"}" in nodeIdMapping (ID: ${e.id.substring(0, 8)}...)`
  )), e._instanceRef !== void 0 && s.type === "INSTANCE" ? (r._instanceTableMap || (r._instanceTableMap = /* @__PURE__ */ new Map()), r._instanceTableMap.set(
    s.id,
    e._instanceRef
  ), t.log(
    `  Stored instance table mapping: instance "${s.name}" (ID: ${s.id.substring(0, 8)}...) -> instance table index ${e._instanceRef}`
  )) : s.type === "INSTANCE" && t.log(
    `  WARNING: Instance "${s.name}" (ID: ${s.id.substring(0, 8)}...) has no _instanceRef in nodeData - will use fallback matching in third pass`
  );
  const v = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.paddingLeft || e.boundVariables.paddingRight || e.boundVariables.paddingTop || e.boundVariables.paddingBottom || e.boundVariables.itemSpacing);
  ai(
    s,
    e.type || "FRAME",
    v
  ), e.name !== void 0 && (s.name = e.name || "Unnamed Node");
  const g = h && h.layoutMode !== void 0 && h.layoutMode !== "NONE", C = n && "layoutMode" in n && n.layoutMode !== "NONE";
  g || C || (e.x !== void 0 && (s.x = e.x), e.y !== void 0 && (s.y = e.y));
  const H = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height), W = e.name || "Unnamed";
  if (e.preserveRatio !== void 0 && t.log(
    `  [ISSUE #3 DEBUG] "${W}" has preserveRatio in nodeData: ${e.preserveRatio}`
  ), e.constraints !== void 0 && t.log(
    `  [ISSUE #4 DEBUG] "${W}" has constraints in nodeData: ${JSON.stringify(e.constraints)}`
  ), (e.constraintHorizontal !== void 0 || e.constraintVertical !== void 0) && t.log(
    `  [ISSUE #4 DEBUG] "${W}" has constraintHorizontal: ${e.constraintHorizontal}, constraintVertical: ${e.constraintVertical}`
  ), e.type !== "VECTOR" && e.type !== "BOOLEAN_OPERATION" && e.width !== void 0 && e.height !== void 0 && !H) {
    const N = s.preserveRatio;
    N !== void 0 && t.log(
      `  [ISSUE #3 DEBUG] "${W}" preserveRatio before resize: ${N}`
    ), s.resize(e.width, e.height);
    const T = s.preserveRatio;
    T !== void 0 ? t.log(
      `  [ISSUE #3 DEBUG] "${W}" preserveRatio after resize: ${T}`
    ) : e.preserveRatio !== void 0 && t.warning(
      `  ⚠️ ISSUE #3: "${W}" preserveRatio was in nodeData (${e.preserveRatio}) but not set on node!`
    );
    const f = e.constraintHorizontal || ((x = e.constraints) == null ? void 0 : x.horizontal), A = e.constraintVertical || ((S = e.constraints) == null ? void 0 : S.vertical);
    (f !== void 0 || A !== void 0) && t.log(
      `  [ISSUE #4] "${W}" (${e.type}) - Expected constraints from JSON: H=${f || "undefined"}, V=${A || "undefined"}`
    );
    const G = (u = s.constraints) == null ? void 0 : u.horizontal, _ = (P = s.constraints) == null ? void 0 : P.vertical;
    (f !== void 0 || A !== void 0) && t.log(
      `  [ISSUE #4] "${W}" (${e.type}) - Constraints after resize (before setting): H=${G || "undefined"}, V=${_ || "undefined"}`
    );
    const F = e.constraintHorizontal !== void 0 || ((w = e.constraints) == null ? void 0 : w.horizontal) !== void 0, D = e.constraintVertical !== void 0 || ((V = e.constraints) == null ? void 0 : V.vertical) !== void 0;
    if (F || D) {
      const oe = e.constraintHorizontal || ((z = e.constraints) == null ? void 0 : z.horizontal), be = e.constraintVertical || ((Z = e.constraints) == null ? void 0 : Z.vertical), ue = oe || G || "MIN", ye = be || _ || "MIN";
      try {
        t.log(
          `  [ISSUE #4] Setting constraints for "${W}" (${e.type}): H=${ue} (from ${oe || "default"}), V=${ye} (from ${be || "default"})`
        ), s.constraints = {
          horizontal: ue,
          vertical: ye
        };
        const ve = (k = s.constraints) == null ? void 0 : k.horizontal, Ne = (L = s.constraints) == null ? void 0 : L.vertical;
        ve === ue && Ne === ye ? t.log(
          `  [ISSUE #4] ✓ Constraints set successfully: H=${ve}, V=${Ne} for "${W}"`
        ) : t.warning(
          `  [ISSUE #4] ⚠️ Constraints set but verification failed! Expected H=${ue}, V=${ye}, got H=${ve || "undefined"}, V=${Ne || "undefined"} for "${W}"`
        );
      } catch (ve) {
        t.warning(
          `  [ISSUE #4] ✗ Failed to set constraints for "${W}" (${e.type}): ${ve instanceof Error ? ve.message : String(ve)}`
        );
      }
    }
    const ee = s.constraintHorizontal, X = s.constraintVertical;
    (f !== void 0 || A !== void 0) && (t.log(
      `  [ISSUE #4] "${W}" (${e.type}) - Final constraints: H=${ee || "undefined"}, V=${X || "undefined"}`
    ), f !== void 0 && ee !== f && t.warning(
      `  ⚠️ ISSUE #4: "${W}" constraintHorizontal mismatch! Expected: ${f}, Got: ${ee || "undefined"}`
    ), A !== void 0 && X !== A && t.warning(
      `  ⚠️ ISSUE #4: "${W}" constraintVertical mismatch! Expected: ${A}, Got: ${X || "undefined"}`
    ), f !== void 0 && A !== void 0 && ee === f && X === A && t.log(
      `  ✓ ISSUE #4: "${W}" constraints correctly set: H=${ee}, V=${X}`
    ));
  } else {
    const N = e.constraintHorizontal || ((q = e.constraints) == null ? void 0 : q.horizontal), T = e.constraintVertical || ((Q = e.constraints) == null ? void 0 : Q.vertical);
    if ((N !== void 0 || T !== void 0) && (e.type === "VECTOR" || e.type === "BOOLEAN_OPERATION" ? t.log(
      `  [ISSUE #4] "${W}" (VECTOR) - Constraints already set earlier (skipping "no resize" path)`
    ) : t.log(
      `  [ISSUE #4] "${W}" (${e.type}) - Setting constraints (no resize): Expected H=${N || "undefined"}, V=${T || "undefined"}`
    )), e.type !== "VECTOR") {
      const f = e.constraintHorizontal !== void 0 || ((te = e.constraints) == null ? void 0 : te.horizontal) !== void 0, A = e.constraintVertical !== void 0 || ((ne = e.constraints) == null ? void 0 : ne.vertical) !== void 0;
      if (f || A) {
        const G = e.constraintHorizontal || ((K = e.constraints) == null ? void 0 : K.horizontal), _ = e.constraintVertical || ((J = e.constraints) == null ? void 0 : J.vertical), F = s.constraints || {}, D = F.horizontal || "MIN", ee = F.vertical || "MIN", X = G || D, oe = _ || ee;
        try {
          t.log(
            `  [ISSUE #4] Setting constraints for "${W}" (${e.type}) (no resize): H=${X} (from ${G || "current"}), V=${oe} (from ${_ || "current"})`
          ), s.constraints = {
            horizontal: X,
            vertical: oe
          };
          const be = (U = s.constraints) == null ? void 0 : U.horizontal, ue = (j = s.constraints) == null ? void 0 : j.vertical;
          be === X && ue === oe ? t.log(
            `  [ISSUE #4] ✓ Constraints set successfully (no resize): H=${be}, V=${ue} for "${W}"`
          ) : t.warning(
            `  [ISSUE #4] ⚠️ Constraints set but verification failed (no resize)! Expected H=${X}, V=${oe}, got H=${be || "undefined"}, V=${ue || "undefined"} for "${W}"`
          );
        } catch (be) {
          t.warning(
            `  [ISSUE #4] ✗ Failed to set constraints for "${W}" (${e.type}) (no resize): ${be instanceof Error ? be.message : String(be)}`
          );
        }
      }
    }
    if (e.type !== "VECTOR" && e.type !== "BOOLEAN_OPERATION" && (N !== void 0 || T !== void 0)) {
      const f = (Y = s.constraints) == null ? void 0 : Y.horizontal, A = (re = s.constraints) == null ? void 0 : re.vertical;
      t.log(
        `  [ISSUE #4] "${W}" (${e.type}) - Final constraints (no resize): H=${f || "undefined"}, V=${A || "undefined"}`
      ), N !== void 0 && f !== N && t.warning(
        `  ⚠️ ISSUE #4: "${W}" constraintHorizontal mismatch! Expected: ${N}, Got: ${f || "undefined"}`
      ), T !== void 0 && A !== T && t.warning(
        `  ⚠️ ISSUE #4: "${W}" constraintVertical mismatch! Expected: ${T}, Got: ${A || "undefined"}`
      ), N !== void 0 && T !== void 0 && f === N && A === T && t.log(
        `  ✓ ISSUE #4: "${W}" constraints correctly set (no resize): H=${f}, V=${A}`
      );
    }
  }
  const E = e.boundVariables && typeof e.boundVariables == "object";
  if (e.visible !== void 0 && (s.visible = e.visible), e.locked !== void 0 && (s.locked = e.locked), e.opacity !== void 0 && (!E || !e.boundVariables.opacity) && (s.opacity = e.opacity), e.rotation !== void 0 && (!E || !e.boundVariables.rotation) && (s.rotation = e.rotation), e.blendMode !== void 0 && (!E || !e.boundVariables.blendMode) && (s.blendMode = e.blendMode), e.type !== "INSTANCE") {
    if (e.type === "VECTOR" && e.boundVariables && (t.log(
      `  DEBUG: VECTOR "${e.name || "Unnamed"}" (ID: ${((he = e.id) == null ? void 0 : he.substring(0, 8)) || "unknown"}...) has boundVariables: ${Object.keys(e.boundVariables).join(", ")}`
    ), e.boundVariables.fills && t.log(
      `  DEBUG:   boundVariables.fills: ${JSON.stringify(e.boundVariables.fills)}`
    )), e.fills !== void 0)
      try {
        let N = e.fills;
        const T = e.name || "Unnamed";
        if (Array.isArray(N))
          for (let f = 0; f < N.length; f++) {
            const A = N[f];
            A && typeof A == "object" && A.selectionColor !== void 0 && t.log(
              `  [ISSUE #2 DEBUG] "${T}" fill[${f}] has selectionColor: ${JSON.stringify(A.selectionColor)}`
            );
          }
        if (Array.isArray(N)) {
          const f = e.name || "Unnamed";
          for (let A = 0; A < N.length; A++) {
            const G = N[A];
            G && typeof G == "object" && G.selectionColor !== void 0 && t.warning(
              `  ⚠️ ISSUE #2: "${f}" fill[${A}] has selectionColor that will be preserved: ${JSON.stringify(G.selectionColor)}`
            );
          }
          N = N.map((A) => {
            if (A && typeof A == "object") {
              const G = le({}, A);
              return delete G.boundVariables, G;
            }
            return A;
          });
        }
        if (e.fills && Array.isArray(e.fills) && l) {
          if (e.type === "VECTOR") {
            t.log(
              `  DEBUG: VECTOR "${e.name || "Unnamed"}" has ${e.fills.length} fill(s)`
            );
            for (let _ = 0; _ < e.fills.length; _++) {
              const F = e.fills[_];
              if (F && typeof F == "object") {
                const D = F.boundVariables || F.bndVar;
                D ? t.log(
                  `  DEBUG:   fill[${_}] has boundVariables: ${JSON.stringify(D)}`
                ) : t.log(
                  `  DEBUG:   fill[${_}] has no boundVariables`
                );
              }
            }
          }
          const f = [];
          for (let _ = 0; _ < N.length; _++) {
            const F = N[_], D = e.fills[_];
            if (!D || typeof D != "object") {
              f.push(F);
              continue;
            }
            const ee = D.boundVariables || D.bndVar;
            if (!ee) {
              f.push(F);
              continue;
            }
            const X = le({}, F);
            X.boundVariables = {};
            for (const [oe, be] of Object.entries(ee))
              if (e.type === "VECTOR" && t.log(
                `  DEBUG: Processing fill[${_}].${oe} on VECTOR "${s.name || "Unnamed"}": varInfo=${JSON.stringify(be)}`
              ), ze(be)) {
                const ue = be._varRef;
                if (ue !== void 0) {
                  if (e.type === "VECTOR") {
                    t.log(
                      `  DEBUG: Looking up variable reference ${ue} in recognizedVariables (map has ${l.size} entries)`
                    );
                    const ve = Array.from(
                      l.keys()
                    ).slice(0, 10);
                    t.log(
                      `  DEBUG: Available variable references (first 10): ${ve.join(", ")}`
                    );
                    const Ne = l.has(String(ue));
                    if (t.log(
                      `  DEBUG: Variable reference ${ue} ${Ne ? "found" : "NOT FOUND"} in recognizedVariables`
                    ), !Ne) {
                      const De = Array.from(
                        l.keys()
                      ).sort((Vt, un) => parseInt(Vt) - parseInt(un));
                      t.log(
                        `  DEBUG: All available variable references: ${De.join(", ")}`
                      );
                    }
                  }
                  let ye = l.get(String(ue));
                  ye || (e.type === "VECTOR" && t.log(
                    `  DEBUG: Variable ${ue} not in recognizedVariables. variableTable=${!!i}, collectionTable=${!!o}, recognizedCollections=${!!$}`
                  ), i && o && $ ? (t.log(
                    `  Variable reference ${ue} not in recognizedVariables, attempting to resolve from variable table...`
                  ), ye = await ei(
                    ue,
                    i,
                    o,
                    $
                  ) || void 0, ye ? (l.set(String(ue), ye), t.log(
                    `  ✓ Resolved variable ${ye.name} from variable table and added to recognizedVariables`
                  )) : t.warning(
                    `  Failed to resolve variable ${ue} from variable table`
                  )) : e.type === "VECTOR" && t.warning(
                    `  Cannot resolve variable ${ue} from table - missing required parameters`
                  )), ye ? (X.boundVariables[oe] = {
                    type: "VARIABLE_ALIAS",
                    id: ye.id
                  }, t.log(
                    `  ✓ Restored bound variable for fill[${_}].${oe} on "${s.name || "Unnamed"}" (${e.type}): variable ${ye.name} (ID: ${ye.id.substring(0, 8)}...)`
                  )) : t.warning(
                    `  Variable reference ${ue} not found in recognizedVariables for fill[${_}].${oe} on "${s.name || "Unnamed"}"`
                  );
                } else
                  e.type === "VECTOR" && t.warning(
                    `  DEBUG: Variable reference ${ue} is undefined for fill[${_}].${oe} on VECTOR "${s.name || "Unnamed"}"`
                  );
              } else
                e.type === "VECTOR" && t.warning(
                  `  DEBUG: fill[${_}].${oe} on VECTOR "${s.name || "Unnamed"}" is not a variable reference: ${JSON.stringify(be)}`
                );
            f.push(X);
          }
          s.fills = f, t.log(
            `  ✓ Set fills with boundVariables on "${s.name || "Unnamed"}" (${e.type})`
          );
          const A = s.fills, G = e.name || "Unnamed";
          if (Array.isArray(A))
            for (let _ = 0; _ < A.length; _++) {
              const F = A[_];
              F && typeof F == "object" && F.selectionColor !== void 0 && t.warning(
                `  ⚠️ ISSUE #2: "${G}" fill[${_}] has selectionColor AFTER setting with boundVariables: ${JSON.stringify(F.selectionColor)}`
              );
            }
        } else {
          s.fills = N;
          const f = s.fills, A = e.name || "Unnamed";
          if (Array.isArray(f))
            for (let G = 0; G < f.length; G++) {
              const _ = f[G];
              _ && typeof _ == "object" && _.selectionColor !== void 0 && t.warning(
                `  ⚠️ ISSUE #2: "${A}" fill[${G}] has selectionColor AFTER setting: ${JSON.stringify(_.selectionColor)}`
              );
            }
        }
        e.boundVariables && Object.keys(e.boundVariables).length > 0 && !e.boundVariables.fills && t.log(
          `  Node "${s.name || "Unnamed"}" (${e.type}) has boundVariables but not for fills: ${Object.keys(e.boundVariables).join(", ")}`
        );
      } catch (N) {
        console.log("Error setting fills:", N);
      }
    else if (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "GROUP")
      try {
        s.fills = [];
      } catch (N) {
        console.log("Error clearing fills:", N);
      }
  }
  if (e.strokes !== void 0)
    try {
      e.strokes.length > 0 ? s.strokes = e.strokes : s.strokes = [];
    } catch (N) {
      console.log("Error setting strokes:", N);
    }
  else if (e.type === "VECTOR")
    try {
      s.strokes = [];
    } catch (N) {
    }
  const O = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.strokeWeight || e.boundVariables.strokeAlign);
  e.strokeWeight !== void 0 ? (!O || !e.boundVariables.strokeWeight) && (s.strokeWeight = e.strokeWeight) : e.type === "VECTOR" && (e.strokes === void 0 || e.strokes.length === 0) && (!O || !e.boundVariables.strokeWeight) && (s.strokeWeight = 0), e.strokeAlign !== void 0 && (!O || !e.boundVariables.strokeAlign) && (s.strokeAlign = e.strokeAlign);
  const I = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.cornerRadius || e.boundVariables.topLeftRadius || e.boundVariables.topRightRadius || e.boundVariables.bottomLeftRadius || e.boundVariables.bottomRightRadius);
  if (e.cornerRadius !== void 0 && (!I || !e.boundVariables.cornerRadius) && (s.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (s.effects = e.effects), e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") {
    if (e.layoutMode !== void 0 && (["NONE", "HORIZONTAL", "VERTICAL"].includes(e.layoutMode) ? s.layoutMode = e.layoutMode : t.warning(
      `Invalid layoutMode value "${e.layoutMode}" for node "${e.name || "Unnamed"}", skipping layoutMode setting`
    )), e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.boundVariables && l) {
      const T = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ];
      for (const f of T) {
        const A = e.boundVariables[f];
        if (A && ze(A)) {
          const G = A._varRef;
          if (G !== void 0) {
            const _ = l.get(String(G));
            if (_) {
              const F = {
                type: "VARIABLE_ALIAS",
                id: _.id
              };
              s.boundVariables || (s.boundVariables = {});
              const D = s[f], ee = (fe = s.boundVariables) == null ? void 0 : fe[f];
              t.log(
                `  DEBUG: Attempting to set bound variable for ${f} on "${e.name || "Unnamed"}": current value=${D}, current boundVar=${JSON.stringify(ee)}`
              );
              try {
                s.setBoundVariable(f, null);
              } catch (oe) {
              }
              try {
                s.setBoundVariable(f, _);
                const oe = (ce = s.boundVariables) == null ? void 0 : ce[f];
                t.log(
                  `  DEBUG: Immediately after setting ${f} bound variable: ${JSON.stringify(oe)}`
                );
              } catch (oe) {
                t.warning(
                  `  Error setting bound variable for ${f}: ${oe instanceof Error ? oe.message : String(oe)}`
                );
              }
              const X = (ae = s.boundVariables) == null ? void 0 : ae[f];
              if (f === "itemSpacing") {
                const oe = s[f], be = (se = s.boundVariables) == null ? void 0 : se[f];
                t.log(
                  `  [ISSUE #1 DEBUG] itemSpacing variable binding for "${e.name || "Unnamed"}":`
                ), t.log(`    - Expected variable ref: ${G}`), t.log(
                  `    - Final itemSpacing value: ${oe}`
                ), t.log(
                  `    - Final boundVariable: ${JSON.stringify(be)}`
                ), t.log(
                  `    - Variable found: ${_ ? `Yes (ID: ${_.id})` : "No"}`
                ), !X || !X.id ? t.warning(
                  "    ⚠️ ISSUE #1: itemSpacing variable binding FAILED - boundVariable not set correctly!"
                ) : t.log(
                  "    ✓ itemSpacing variable binding SUCCESS"
                );
              }
              X && typeof X == "object" && X.type === "VARIABLE_ALIAS" && X.id === _.id ? t.log(
                `  ✓ Set bound variable for ${f} on "${e.name || "Unnamed"}" (${e.type}): variable ${_.name} (ID: ${_.id.substring(0, 8)}...)`
              ) : t.warning(
                `  Failed to set bound variable for ${f} on "${e.name || "Unnamed"}" - verification failed. Expected: ${JSON.stringify(F)}, Got: ${JSON.stringify(X)}`
              );
            }
          }
        }
      }
    }
    e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.itemSpacing !== void 0 ? e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.itemSpacing ? t.log(
      `  Skipping itemSpacing (bound to variable) for "${e.name || "Unnamed"}"`
    ) : (t.log(
      `  Setting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (${e.type})`
    ), s.itemSpacing = e.itemSpacing, t.log(
      `  ✓ Set itemSpacing to ${s.itemSpacing} (verified)`
    )) : (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && t.log(
      `  DEBUG: Not setting itemSpacing for "${e.name || "Unnamed"}": layoutMode=${e.layoutMode}, itemSpacing=${e.itemSpacing}`
    ), e.layoutWrap !== void 0 && (s.layoutWrap = e.layoutWrap), e.primaryAxisSizingMode !== void 0 ? s.primaryAxisSizingMode = e.primaryAxisSizingMode : s.primaryAxisSizingMode = "AUTO", e.counterAxisSizingMode !== void 0 ? s.counterAxisSizingMode = e.counterAxisSizingMode : s.counterAxisSizingMode = "AUTO", e.primaryAxisAlignItems !== void 0 && (s.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (s.counterAxisAlignItems = e.counterAxisAlignItems);
    const N = e.boundVariables && typeof e.boundVariables == "object";
    if (N) {
      const T = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ].filter((f) => e.boundVariables[f]);
      T.length > 0 && t.log(
        `  DEBUG: Node "${e.name || "Unnamed"}" (${e.type}) has bound variables for: ${T.join(", ")}`
      );
    }
    if (e.paddingLeft !== void 0 && (!N || !e.boundVariables.paddingLeft) && (s.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (!N || !e.boundVariables.paddingRight) && (s.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (!N || !e.boundVariables.paddingTop) && (s.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (!N || !e.boundVariables.paddingBottom) && (s.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && s.layoutMode !== void 0 && s.layoutMode !== "NONE") {
      const T = ((de = s.boundVariables) == null ? void 0 : de.itemSpacing) !== void 0;
      !T && (!N || !e.boundVariables.itemSpacing) ? s.itemSpacing !== e.itemSpacing && (t.log(
        `  Setting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (late setting)`
      ), s.itemSpacing = e.itemSpacing) : T && t.log(
        `  Skipping late setting of itemSpacing for "${e.name || "Unnamed"}" - already bound to variable`
      );
    }
    e.counterAxisSpacing !== void 0 && (!N || !e.boundVariables.counterAxisSpacing) && s.layoutMode !== void 0 && s.layoutMode !== "NONE" && (s.counterAxisSpacing = e.counterAxisSpacing), e.layoutGrow !== void 0 && (s.layoutGrow = e.layoutGrow);
  }
  if ((e.type === "VECTOR" || e.type === "BOOLEAN_OPERATION" || e.type === "LINE") && (e.strokeCap !== void 0 && (s.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (s.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (s.dashPattern = e.dashPattern), e.type === "VECTOR" || e.type === "BOOLEAN_OPERATION")) {
    if (e.fillGeometry !== void 0)
      try {
        const { normalizeSvgPath: A } = await Promise.resolve().then(() => Fn), G = e.fillGeometry.map((_) => {
          const F = _.data;
          return {
            data: A(F),
            windingRule: _.windingRule || _.windRule || "NONZERO"
          };
        });
        for (let _ = 0; _ < e.fillGeometry.length; _++) {
          const F = e.fillGeometry[_].data, D = G[_].data;
          F !== D && t.log(
            `  Normalized path ${_ + 1} for "${e.name || "Unnamed"}": ${F.substring(0, 50)}... -> ${D.substring(0, 50)}...`
          );
        }
        s.vectorPaths = G, t.log(
          `  Set vectorPaths for VECTOR "${e.name || "Unnamed"}" (${G.length} path(s))`
        );
      } catch (A) {
        t.warning(
          `Error setting vectorPaths for VECTOR "${e.name || "Unnamed"}": ${A}`
        );
      }
    if (e.strokeGeometry !== void 0)
      try {
        s.strokeGeometry = e.strokeGeometry;
      } catch (A) {
        t.warning(
          `Error setting strokeGeometry for VECTOR "${e.name || "Unnamed"}": ${A}`
        );
      }
    const N = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
    if (e.width !== void 0 && e.height !== void 0 && !N)
      try {
        s.resize(e.width, e.height), t.log(
          `  Set size for VECTOR "${e.name || "Unnamed"}" to ${e.width}x${e.height}`
        );
      } catch (A) {
        t.warning(
          `Error setting size for VECTOR "${e.name || "Unnamed"}": ${A}`
        );
      }
    const T = e.constraintHorizontal || ((me = e.constraints) == null ? void 0 : me.horizontal), f = e.constraintVertical || ((Se = e.constraints) == null ? void 0 : Se.vertical);
    if (T !== void 0 || f !== void 0) {
      t.log(
        `  [ISSUE #4] "${e.name || "Unnamed"}" (VECTOR) - Setting constraints immediately after size: Expected H=${T || "undefined"}, V=${f || "undefined"}`
      );
      const A = s.constraints || {}, G = A.horizontal || "MIN", _ = A.vertical || "MIN", F = T || G, D = f || _;
      try {
        s.constraints = {
          horizontal: F,
          vertical: D
        };
        const oe = (Ve = s.constraints) == null ? void 0 : Ve.horizontal, be = (je = s.constraints) == null ? void 0 : je.vertical;
        oe === F && be === D ? t.log(
          `  [ISSUE #4] ✓ Constraints set successfully for "${e.name || "Unnamed"}" (VECTOR): H=${oe}, V=${be}`
        ) : t.warning(
          `  [ISSUE #4] ⚠️ Constraints set but verification failed! Expected H=${F}, V=${D}, got H=${oe || "undefined"}, V=${be || "undefined"} for "${e.name || "Unnamed"}"`
        );
      } catch (oe) {
        t.warning(
          `  [ISSUE #4] ✗ Failed to set constraints for "${e.name || "Unnamed"}" (VECTOR): ${oe instanceof Error ? oe.message : String(oe)}`
        );
      }
      const ee = (nt = s.constraints) == null ? void 0 : nt.horizontal, X = (Je = s.constraints) == null ? void 0 : Je.vertical;
      t.log(
        `  [ISSUE #4] "${e.name || "Unnamed"}" (VECTOR) - Final constraints after immediate setting: H=${ee || "undefined"}, V=${X || "undefined"}`
      ), T !== void 0 && ee !== T && t.warning(
        `  ⚠️ ISSUE #4: "${e.name || "Unnamed"}" constraintHorizontal mismatch! Expected: ${T}, Got: ${ee || "undefined"}`
      ), f !== void 0 && X !== f && t.warning(
        `  ⚠️ ISSUE #4: "${e.name || "Unnamed"}" constraintVertical mismatch! Expected: ${f}, Got: ${X || "undefined"}`
      ), T !== void 0 && f !== void 0 && ee === T && X === f && t.log(
        `  ✓ ISSUE #4: "${e.name || "Unnamed"}" (VECTOR) constraints correctly set: H=${ee}, V=${X}`
      );
    }
  }
  if (e.type === "TEXT" && e.characters !== void 0)
    try {
      let N = !1;
      if (t.log(
        `  Processing TEXT node "${e.name || "Unnamed"}": has _styleRef=${e._styleRef !== void 0}, has styleMapping=${b != null}`
      ), e._styleRef !== void 0)
        if (!b)
          t.warning(
            `Text node "${e.name || "Unnamed"}" has _styleRef but styles table was not imported. Using individual properties instead.`
          );
        else {
          const T = b.get(e._styleRef);
          if (T && T.type === "TEXT")
            try {
              const f = T;
              t.log(
                `  Applying text style "${T.name}" to text node "${e.name || "Unnamed"}" (font: ${f.fontName.family} ${f.fontName.style})`
              );
              try {
                await figma.loadFontAsync(f.fontName), t.log(
                  `  ✓ Loaded font "${f.fontName.family} ${f.fontName.style}" for style "${T.name}"`
                );
              } catch (A) {
                t.warning(
                  `  Could not load font "${f.fontName.family} ${f.fontName.style}" for style "${T.name}": ${A}. Trying fallback font.`
                );
                try {
                  await figma.loadFontAsync({
                    family: "Roboto",
                    style: "Regular"
                  }), t.log('  ✓ Loaded fallback font "Roboto Regular"');
                } catch (G) {
                  t.warning(
                    `  Could not load fallback font for style "${T.name}" on text node "${e.name || "Unnamed"}"`
                  );
                }
              }
              await s.setTextStyleIdAsync(T.id), t.log(
                `  ✓ Set textStyleId to "${T.id}" for style "${T.name}"`
              ), s.characters = e.characters, t.log(
                `  ✓ Set characters: "${e.characters.substring(0, 50)}${e.characters.length > 50 ? "..." : ""}"`
              ), N = !0, e.textAlignHorizontal !== void 0 && (s.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (s.textAlignVertical = e.textAlignVertical), e.textAutoResize !== void 0 && (s.textAutoResize = e.textAutoResize), e.listOptions !== void 0 && (s.listOptions = e.listOptions);
            } catch (f) {
              t.warning(
                `Failed to apply style "${T.name}" on text node "${e.name || "Unnamed"}": ${f}. Falling back to individual properties.`
              );
            }
          else
            t.warning(
              `Text node "${e.name || "Unnamed"}" has invalid _styleRef (${e._styleRef}). Using individual properties instead.`
            );
        }
      if (!N) {
        if (e.fontName)
          try {
            await figma.loadFontAsync(e.fontName), s.fontName = e.fontName;
          } catch (f) {
            await figma.loadFontAsync({
              family: "Roboto",
              style: "Regular"
            }), s.fontName = { family: "Roboto", style: "Regular" };
          }
        else
          await figma.loadFontAsync({
            family: "Roboto",
            style: "Regular"
          }), s.fontName = { family: "Roboto", style: "Regular" };
        s.characters = e.characters;
        const T = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.fontSize || e.boundVariables.letterSpacing || e.boundVariables.lineHeight);
        e.fontSize !== void 0 && (!T || !e.boundVariables.fontSize) && (s.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (s.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (s.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (!T || !e.boundVariables.letterSpacing) && (s.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (!T || !e.boundVariables.lineHeight) && (s.lineHeight = e.lineHeight), e.textCase !== void 0 && (s.textCase = e.textCase), e.textDecoration !== void 0 && (s.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (s.textAutoResize = e.textAutoResize);
      }
    } catch (N) {
      console.log("Error setting text properties: " + N);
      try {
        s.characters = e.characters;
      } catch (T) {
        console.log("Could not set text characters: " + T);
      }
    }
  if (e.selectionColor !== void 0) {
    const N = e.name || "Unnamed";
    if (e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.selectionColor !== void 0)
      t.log(
        `  [ISSUE #2] Skipping direct selectionColor value for "${N}" - will be set via bound variable`
      );
    else
      try {
        s.selectionColor = e.selectionColor, t.log(
          `  [ISSUE #2] Set selectionColor (direct value) on "${N}": ${JSON.stringify(e.selectionColor)}`
        );
      } catch (f) {
        t.warning(
          `  [ISSUE #2] Failed to set selectionColor on "${N}": ${f instanceof Error ? f.message : String(f)}`
        );
      }
  }
  if (e.boundVariables && l) {
    const N = [
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "paddingBottom",
      "itemSpacing"
    ];
    for (const [T, f] of Object.entries(
      e.boundVariables
    ))
      if (T !== "fills" && !N.includes(T)) {
        if (T === "selectionColor") {
          const A = e.name || "Unnamed";
          t.log(
            `  [ISSUE #2] Restoring bound variable for selectionColor on "${A}"`
          );
        }
        if (ze(f) && i && l) {
          const A = f._varRef;
          if (A !== void 0) {
            const G = l.get(String(A));
            if (G)
              try {
                const _ = {
                  type: "VARIABLE_ALIAS",
                  id: G.id
                };
                s.boundVariables || (s.boundVariables = {});
                const F = s[T];
                F !== void 0 && s.boundVariables[T] === void 0 && t.warning(
                  `  Property ${T} has direct value ${F} which may prevent bound variable from being set`
                ), s.boundVariables[T] = _;
                const ee = (R = s.boundVariables) == null ? void 0 : R[T];
                if (ee && typeof ee == "object" && ee.type === "VARIABLE_ALIAS" && ee.id === G.id)
                  t.log(
                    `  ✓ Set bound variable for ${T} on "${e.name || "Unnamed"}" (${e.type}): variable ${G.name} (ID: ${G.id.substring(0, 8)}...)`
                  );
                else {
                  const X = (pe = s.boundVariables) == null ? void 0 : pe[T];
                  t.warning(
                    `  Failed to set bound variable for ${T} on "${e.name || "Unnamed"}" - bound variable not persisted. Property value: ${F}, Expected: ${JSON.stringify(_)}, Got: ${JSON.stringify(X)}`
                  );
                }
              } catch (_) {
                t.warning(
                  `  Error setting bound variable for ${T} on "${e.name || "Unnamed"}": ${_}`
                );
              }
            else
              t.warning(
                `  Variable reference ${A} not found in recognizedVariables for ${T} on "${e.name || "Unnamed"}"`
              );
          }
        }
      }
  }
  if (e.boundVariables && l && (e.boundVariables.width || e.boundVariables.height)) {
    const N = e.boundVariables.width, T = e.boundVariables.height;
    if (N && ze(N)) {
      const f = N._varRef;
      if (f !== void 0) {
        const A = l.get(String(f));
        if (A) {
          const G = {
            type: "VARIABLE_ALIAS",
            id: A.id
          };
          s.boundVariables || (s.boundVariables = {}), s.boundVariables.width = G;
        }
      }
    }
    if (T && ze(T)) {
      const f = T._varRef;
      if (f !== void 0) {
        const A = l.get(String(f));
        if (A) {
          const G = {
            type: "VARIABLE_ALIAS",
            id: A.id
          };
          s.boundVariables || (s.boundVariables = {}), s.boundVariables.height = G;
        }
      }
    }
  }
  const B = e.id && r && r.has(e.id) && s.type === "COMPONENT" && s.children && s.children.length > 0;
  if (e.children && Array.isArray(e.children) && s.type !== "INSTANCE" && !B) {
    const N = (f) => {
      const A = [];
      for (const G of f)
        G._truncated || (G.type === "COMPONENT" ? (A.push(G), G.children && Array.isArray(G.children) && A.push(...N(G.children))) : G.children && Array.isArray(G.children) && A.push(...N(G.children)));
      return A;
    };
    for (const f of e.children) {
      if (f._truncated) {
        console.log(
          `Skipping truncated children: ${f._reason || "Unknown"}`
        );
        continue;
      }
      f.type;
    }
    const T = N(e.children);
    t.log(
      `  First pass: Creating ${T.length} COMPONENT node(s) (without children)...`
    );
    for (const f of T)
      t.log(
        `  Collected COMPONENT "${f.name || "Unnamed"}" (ID: ${f.id ? f.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const f of T)
      if (f.id && r && !r.has(f.id)) {
        const A = figma.createComponent();
        if (f.name !== void 0 && (A.name = f.name || "Unnamed Node"), f.componentPropertyDefinitions) {
          const G = f.componentPropertyDefinitions;
          let _ = 0, F = 0;
          for (const [D, ee] of Object.entries(G))
            try {
              const oe = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[ee.type];
              if (!oe) {
                t.warning(
                  `  Unknown property type ${ee.type} for property "${D}" in component "${f.name || "Unnamed"}"`
                ), F++;
                continue;
              }
              const be = ee.defaultValue, ue = D.split("#")[0];
              A.addComponentProperty(
                ue,
                oe,
                be
              ), _++;
            } catch (X) {
              t.warning(
                `  Failed to add component property "${D}" to "${f.name || "Unnamed"}" in first pass: ${X}`
              ), F++;
            }
          _ > 0 && t.log(
            `  Added ${_} component property definition(s) to "${f.name || "Unnamed"}" in first pass${F > 0 ? ` (${F} failed)` : ""}`
          );
        }
        r.set(f.id, A), t.log(
          `  Created COMPONENT "${f.name || "Unnamed"}" (ID: ${f.id.substring(0, 8)}...) in first pass`
        );
      }
    for (const f of e.children) {
      if (f._truncated)
        continue;
      const A = s && y && y.has(s.id) ? s.id : m, G = await Xe(
        f,
        s,
        i,
        o,
        a,
        l,
        r,
        c,
        d,
        p,
        // Pass deferredInstances through for recursive calls
        e,
        // parentNodeData - pass the parent's nodeData so children can check for auto-layout
        $,
        y,
        // Pass placeholderFrameIds through for recursive calls
        A,
        // Pass currentPlaceholderId down (or placeholder ID if newNode is a placeholder)
        b
        // Pass styleMapping to apply styles
      );
      if (G && G.parent !== s) {
        if (G.parent && typeof G.parent.removeChild == "function")
          try {
            G.parent.removeChild(G);
          } catch (_) {
            t.warning(
              `Failed to remove child "${G.name || "Unnamed"}" from parent "${G.parent.name || "Unnamed"}": ${_}`
            );
          }
        s.appendChild(G);
      }
    }
  }
  if (n && s.parent !== n) {
    if (s.parent && typeof s.parent.removeChild == "function")
      try {
        s.parent.removeChild(s);
      } catch (N) {
        t.warning(
          `Failed to remove node "${s.name || "Unnamed"}" from parent "${s.parent.name || "Unnamed"}": ${N}`
        );
      }
    n.appendChild(s);
  }
  if ((s.type === "FRAME" || s.type === "COMPONENT" || s.type === "INSTANCE") && e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.itemSpacing !== void 0) {
    const N = ((ie = s.boundVariables) == null ? void 0 : ie.itemSpacing) !== void 0, T = e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.itemSpacing;
    if (N)
      t.log(
        `  FINAL CHECK: itemSpacing is bound to variable for "${e.name || "Unnamed"}" - skipping direct value fix`
      );
    else if (T)
      t.warning(
        `  FINAL CHECK: itemSpacing should be bound to variable for "${e.name || "Unnamed"}" but binding is missing!`
      );
    else {
      const f = s.itemSpacing;
      f !== e.itemSpacing ? (t.log(
        `  FINAL FIX: Resetting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (was ${f})`
      ), s.itemSpacing = e.itemSpacing, t.log(
        `  FINAL FIX: Verified itemSpacing is now ${s.itemSpacing}`
      )) : t.log(
        `  FINAL CHECK: itemSpacing is already correct (${f}) for "${e.name || "Unnamed"}"`
      );
    }
  }
  return s;
}
async function si(e, n, i) {
  let o = 0, a = 0, l = 0;
  const r = (d) => {
    const p = [];
    if (d.type === "INSTANCE" && p.push(d), "children" in d && d.children)
      for (const h of d.children)
        p.push(...r(h));
    return p;
  }, c = r(e);
  t.log(
    `  Found ${c.length} instance(s) to process for variant properties`
  );
  for (const d of c)
    try {
      const p = await d.getMainComponentAsync();
      if (!p) {
        a++;
        continue;
      }
      const h = n.getSerializedTable();
      let $ = null, y;
      if (i._instanceTableMap ? (y = i._instanceTableMap.get(
        d.id
      ), y !== void 0 ? ($ = h[y], t.log(
        `  Found instance table index ${y} for instance "${d.name}" (ID: ${d.id.substring(0, 8)}...)`
      )) : t.log(
        `  No instance table index mapping found for instance "${d.name}" (ID: ${d.id.substring(0, 8)}...), using fallback matching`
      )) : t.log(
        `  No instance table map found, using fallback matching for instance "${d.name}"`
      ), !$) {
        for (const [b, s] of Object.entries(h))
          if (s.instanceType === "internal" && s.componentNodeId && i.has(s.componentNodeId)) {
            const v = i.get(s.componentNodeId);
            if (v && v.id === p.id) {
              $ = s, t.log(
                `  Matched instance "${d.name}" to instance table entry ${b} by component (less precise)`
              );
              break;
            }
          }
      }
      if (!$) {
        t.log(
          `  No matching entry found for instance "${d.name}" (main component: ${p.name}, ID: ${p.id.substring(0, 8)}...)`
        ), a++;
        continue;
      }
      if (!$.variantProperties) {
        t.log(
          `  Instance table entry for "${d.name}" has no variant properties`
        ), a++;
        continue;
      }
      t.log(
        `  Instance "${d.name}" matched to entry with variant properties: ${JSON.stringify($.variantProperties)}`
      );
      let m = null;
      if (p.parent && p.parent.type === "COMPONENT_SET" && (m = p.parent.componentPropertyDefinitions), m) {
        const b = {};
        for (const [s, v] of Object.entries(
          $.variantProperties
        )) {
          const g = s.split("#")[0];
          m[g] && (b[g] = v);
        }
        Object.keys(b).length > 0 ? (d.setProperties(b), o++, t.log(
          `  ✓ Set variant properties on instance "${d.name}": ${JSON.stringify(b)}`
        )) : a++;
      } else
        a++;
    } catch (p) {
      l++, t.warning(
        `  Failed to set variant properties on instance "${d.name}": ${p}`
      );
    }
  t.log(
    `  Variant properties set: ${o} processed, ${a} skipped, ${l} errors`
  );
}
async function Bt(e) {
  await figma.loadAllPagesAsync();
  const n = figma.root.children, i = new Set(n.map((l) => l.name));
  if (!i.has(e))
    return e;
  let o = 1, a = `${e}_${o}`;
  for (; i.has(a); )
    o++, a = `${e}_${o}`;
  return a;
}
async function li(e) {
  const n = await figma.variables.getLocalVariableCollectionsAsync(), i = new Set(n.map((l) => l.name));
  if (!i.has(e))
    return e;
  let o = 1, a = `${e}_${o}`;
  for (; i.has(a); )
    o++, a = `${e}_${o}`;
  return a;
}
async function ci(e, n) {
  const i = /* @__PURE__ */ new Set();
  for (const l of e.variableIds)
    try {
      const r = await figma.variables.getVariableByIdAsync(l);
      r && i.add(r.name);
    } catch (r) {
      continue;
    }
  if (!i.has(n))
    return n;
  let o = 1, a = `${n}_${o}`;
  for (; i.has(a); )
    o++, a = `${n}_${o}`;
  return a;
}
function tn(e, n) {
  const i = e.resolvedType.toUpperCase(), o = n.toUpperCase();
  return i === o;
}
async function di(e) {
  const n = await figma.variables.getLocalVariableCollectionsAsync(), i = Oe(e.collectionName);
  if (Ge(e.collectionName)) {
    for (const o of n)
      if (Oe(o.name) === i)
        return {
          collection: o,
          matchType: "potential"
        };
    return {
      collection: null,
      matchType: "none"
    };
  }
  if (e.collectionGuid) {
    for (const o of n)
      if (o.getSharedPluginData(
        "recursica",
        Ue
      ) === e.collectionGuid)
        return {
          collection: o,
          matchType: "recognized"
        };
  }
  for (const o of n)
    if (o.name === e.collectionName)
      return {
        collection: o,
        matchType: "potential"
      };
  return {
    collection: null,
    matchType: "none"
  };
}
function gi(e) {
  if (!e.metadata)
    return {
      success: !1,
      error: "Invalid JSON format. Expected metadata."
    };
  const n = e.metadata;
  return !n.guid || typeof n.guid != "string" ? {
    success: !1,
    error: "Invalid metadata. Missing or invalid 'guid' field."
  } : !n.name || typeof n.name != "string" ? {
    success: !1,
    error: "Invalid metadata. Missing or invalid 'name' field."
  } : {
    success: !0,
    metadata: {
      guid: n.guid,
      name: n.name,
      version: n.version
    }
  };
}
function yt(e) {
  if (!e.stringTable)
    return {
      success: !1,
      error: "Invalid JSON format. String table is required."
    };
  let n;
  try {
    n = mt.fromTable(e.stringTable);
  } catch (o) {
    return {
      success: !1,
      error: `Failed to load string table: ${o instanceof Error ? o.message : "Unknown error"}`
    };
  }
  const i = Xn(e, n);
  return {
    success: !0,
    stringTable: n,
    expandedJsonData: i
  };
}
function nn(e) {
  if (!e.collections)
    return {
      success: !1,
      error: "No collections table found in JSON"
    };
  try {
    return {
      success: !0,
      collectionTable: ot.fromTable(
        e.collections
      )
    };
  } catch (n) {
    return {
      success: !1,
      error: `Failed to load collections table: ${n instanceof Error ? n.message : "Unknown error"}`
    };
  }
}
async function fi(e, n) {
  const i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), l = e.getTable();
  for (const [r, c] of Object.entries(l)) {
    if (c.isLocal === !1) {
      t.log(
        `Skipping remote collection: "${c.collectionName}" (index ${r})`
      );
      continue;
    }
    const d = Oe(c.collectionName), p = n == null ? void 0 : n.get(d);
    if (p) {
      t.log(
        `✓ Using pre-created collection: "${d}" (index ${r})`
      ), i.set(r, p);
      continue;
    }
    const h = await di(c);
    h.matchType === "recognized" ? (t.log(
      `✓ Recognized collection by GUID: "${c.collectionName}" (index ${r})`
    ), i.set(r, h.collection)) : h.matchType === "potential" ? (t.log(
      `? Potential match by name: "${c.collectionName}" (index ${r})`
    ), o.set(r, {
      entry: c,
      collection: h.collection
    })) : (t.log(
      `✗ No match found for collection: "${c.collectionName}" (index ${r}) - will create new`
    ), a.set(r, c));
  }
  return t.log(
    `Collection matching complete: ${i.size} recognized, ${o.size} potential matches, ${a.size} to create`
  ), {
    recognizedCollections: i,
    potentialMatches: o,
    collectionsToCreate: a
  };
}
async function pi(e, n, i, o) {
  if (e.size !== 0) {
    if (o) {
      t.log(
        `Using wizard selections for ${e.size} potential match(es)...`
      );
      for (const [a, { entry: l, collection: r }] of e.entries()) {
        const c = Oe(
          l.collectionName
        ).toLowerCase();
        let d = !1;
        c === "tokens" || c === "token" ? d = o.tokens === "existing" : c === "theme" || c === "themes" ? d = o.theme === "existing" : (c === "layer" || c === "layers") && (d = o.layers === "existing");
        const p = Ge(l.collectionName) ? Oe(l.collectionName) : r.name;
        d ? (t.log(
          `✓ Wizard selection: Using existing collection "${p}" (index ${a})`
        ), n.set(a, r), await Ke(r, l.modes), t.log(
          `  ✓ Ensured modes for collection "${p}" (${l.modes.length} mode(s))`
        )) : (t.log(
          `✗ Wizard selection: Will create new collection for "${l.collectionName}" (index ${a})`
        ), i.set(a, l));
      }
      return;
    }
    t.log(
      `Prompting user for ${e.size} potential match(es)...`
    );
    for (const [a, { entry: l, collection: r }] of e.entries())
      try {
        const c = Ge(l.collectionName) ? Oe(l.collectionName) : r.name, d = `Found existing "${c}" variable collection. Should I use it?`;
        t.log(
          `Prompting user about potential match: "${c}"`
        ), await tt.prompt(d, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), t.log(
          `✓ User confirmed: Using existing collection "${c}" (index ${a})`
        ), n.set(a, r), await Ke(r, l.modes), t.log(
          `  ✓ Ensured modes for collection "${c}" (${l.modes.length} mode(s))`
        );
      } catch (c) {
        t.log(
          `✗ User rejected: Will create new collection for "${l.collectionName}" (index ${a})`
        ), i.set(a, l);
      }
  }
}
async function mi(e, n, i) {
  if (e.size === 0)
    return;
  t.log("Ensuring modes exist for recognized collections...");
  const o = n.getTable();
  for (const [a, l] of e.entries()) {
    const r = o[a];
    r && (i.has(a) || (await Ke(l, r.modes), t.log(
      `  ✓ Ensured modes for collection "${l.name}" (${r.modes.length} mode(s))`
    )));
  }
}
async function ui(e, n, i, o) {
  if (e.size !== 0) {
    t.log(
      `Processing ${e.size} collection(s) to create...`
    );
    for (const [a, l] of e.entries()) {
      const r = Oe(l.collectionName), c = o == null ? void 0 : o.get(r);
      if (c) {
        t.log(
          `Reusing pre-created collection: "${r}" (index ${a}, id: ${c.id.substring(0, 8)}...)`
        ), n.set(a, c), await Ke(c, l.modes), i.push(c);
        continue;
      }
      const d = await li(r);
      d !== r ? t.log(
        `Creating collection: "${d}" (normalized: "${r}" - name conflict resolved)`
      ) : t.log(`Creating collection: "${d}"`);
      const p = figma.variables.createVariableCollection(d);
      i.push(p);
      let h;
      if (Ge(l.collectionName)) {
        const $ = ft(l.collectionName);
        $ && (h = $);
      } else l.collectionGuid && (h = l.collectionGuid);
      h && (p.setSharedPluginData(
        "recursica",
        Ue,
        h
      ), t.log(`  Stored GUID: ${h.substring(0, 8)}...`)), await Ke(p, l.modes), t.log(
        `  ✓ Created collection "${d}" with ${l.modes.length} mode(s)`
      ), n.set(a, p);
    }
    t.log("Collection creation complete");
  }
}
function on(e) {
  if (!e.variables)
    return {
      success: !1,
      error: "No variables table found in JSON"
    };
  try {
    return {
      success: !0,
      variableTable: rt.fromTable(e.variables)
    };
  } catch (n) {
    return {
      success: !1,
      error: `Failed to load variables table: ${n instanceof Error ? n.message : "Unknown error"}`
    };
  }
}
async function rn(e, n, i, o) {
  const a = /* @__PURE__ */ new Map(), l = [], r = new Set(
    o.map(($) => $.id)
  );
  t.log("Matching and creating variables in collections...");
  const c = e.getTable(), d = /* @__PURE__ */ new Map();
  for (const [$, y] of Object.entries(c)) {
    if (y._colRef === void 0)
      continue;
    const m = i.get(String(y._colRef));
    if (!m)
      continue;
    d.has(m.id) || d.set(m.id, {
      collectionName: m.name,
      existing: 0,
      created: 0
    });
    const b = d.get(m.id), s = r.has(
      m.id
    );
    let v;
    typeof y.variableType == "number" ? v = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[y.variableType] || String(y.variableType) : v = y.variableType;
    const g = await Tt(
      m,
      y.variableName
    );
    if (g)
      if (tn(g, v))
        a.set($, g), b.existing++;
      else {
        t.warning(
          `Type mismatch for variable "${y.variableName}" in collection "${m.name}": expected ${v}, found ${g.resolvedType}. Creating new variable with incremented name.`
        );
        const C = await ci(
          m,
          y.variableName
        ), M = await It(
          Ee(le({}, y), {
            variableName: C,
            variableType: v
          }),
          m,
          e,
          n
        );
        s || l.push(M), a.set($, M), b.created++;
      }
    else {
      const C = await It(
        Ee(le({}, y), {
          variableType: v
        }),
        m,
        e,
        n
      );
      s || l.push(C), a.set($, C), b.created++;
    }
  }
  t.log("Variable processing complete:");
  for (const $ of d.values())
    t.log(
      `  "${$.collectionName}": ${$.existing} existing, ${$.created} created`
    );
  t.log("Final verification: Reading back all COLOR variables...");
  let p = 0, h = 0;
  for (const $ of l)
    if ($.resolvedType === "COLOR") {
      const y = await figma.variables.getVariableCollectionByIdAsync(
        $.variableCollectionId
      );
      if (!y) {
        t.warning(
          `  ⚠️ Variable "${$.name}" has no variableCollection (ID: ${$.variableCollectionId})`
        );
        continue;
      }
      const m = y.modes;
      if (!m || m.length === 0) {
        t.warning(
          `  ⚠️ Variable "${$.name}" collection has no modes`
        );
        continue;
      }
      for (const b of m) {
        const s = $.valuesByMode[b.modeId];
        if (s && typeof s == "object" && "r" in s) {
          const v = s;
          Math.abs(v.r - 1) < 0.01 && Math.abs(v.g - 1) < 0.01 && Math.abs(v.b - 1) < 0.01 ? (h++, t.warning(
            `  ⚠️ Variable "${$.name}" mode "${b.name}" is WHITE: r=${v.r.toFixed(3)}, g=${v.g.toFixed(3)}, b=${v.b.toFixed(3)}`
          )) : (p++, t.log(
            `  ✓ Variable "${$.name}" mode "${b.name}" has color: r=${v.r.toFixed(3)}, g=${v.g.toFixed(3)}, b=${v.b.toFixed(3)}`
          ));
        } else s && typeof s == "object" && "type" in s || t.warning(
          `  ⚠️ Variable "${$.name}" mode "${b.name}" has unexpected value type: ${JSON.stringify(s)}`
        );
      }
    }
  return t.log(
    `Final verification complete: ${p} color variables verified, ${h} white variables found`
  ), {
    recognizedVariables: a,
    newlyCreatedVariables: l
  };
}
function hi(e) {
  if (!e.instances)
    return null;
  try {
    return at.fromTable(e.instances);
  } catch (n) {
    return null;
  }
}
function yi(e) {
  return typeof e == "number" ? {
    1: "FRAME",
    2: "TEXT",
    3: "INSTANCE",
    4: "COMPONENT",
    5: "VECTOR",
    6: "RECTANGLE",
    7: "ELLIPSE",
    8: "STAR",
    9: "LINE",
    10: "GROUP",
    11: "BOOLEAN_OPERATION",
    12: "POLYGON",
    13: "PAGE",
    14: "COMPONENT_SET"
  }[e] || String(e) : e;
}
function bt(e) {
  if (!e || typeof e != "object")
    return;
  e.type !== void 0 && (e.type = yi(e.type));
  const n = e.children !== void 0 ? "children" : e.child !== void 0 ? "child" : null;
  if (n && (n === "child" && !e.children && (e.children = e.child, delete e.child), Array.isArray(e.children)))
    for (const i of e.children)
      bt(i);
  e.fillG !== void 0 && e.fillGeometry === void 0 && (e.fillGeometry = e.fillG, delete e.fillG), e.strkG !== void 0 && e.strokeGeometry === void 0 && (e.strokeGeometry = e.strkG, delete e.strkG), e.child && !e.children && (e.children = e.child, delete e.child);
}
async function bi(e, n) {
  const i = /* @__PURE__ */ new Set();
  for (const l of e.children)
    (l.type === "FRAME" || l.type === "COMPONENT") && i.add(l.name);
  if (!i.has(n))
    return n;
  let o = 1, a = `${n}_${o}`;
  for (; i.has(a); )
    o++, a = `${n}_${o}`;
  return a;
}
async function $i(e, n, i, o, a, l = "", r = null) {
  var s;
  const c = e.getSerializedTable(), d = Object.values(c).filter(
    (v) => v.instanceType === "remote"
  ), p = /* @__PURE__ */ new Map();
  if (d.length === 0)
    return t.log("No remote instances found"), p;
  t.log(
    `Processing ${d.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  const h = figma.root.children, $ = l ? `${l} REMOTES` : "REMOTES";
  let y = h.find(
    (v) => v.name === "REMOTES" || v.name === $
  );
  if (y ? (t.log("Found existing REMOTES page"), l && !y.name.startsWith(l) && (y.name = $)) : (y = figma.createPage(), y.name = $, t.log("Created REMOTES page")), d.length > 0 && (y.setPluginData("RecursicaUnderReview", "true"), t.log("Marked REMOTES page as under review")), !y.children.some(
    (v) => v.type === "FRAME" && v.name === "Title"
  )) {
    const v = { family: "Inter", style: "Bold" }, g = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(v), await figma.loadFontAsync(g);
    const C = figma.createFrame();
    C.name = "Title", C.layoutMode = "VERTICAL", C.paddingTop = 20, C.paddingBottom = 20, C.paddingLeft = 20, C.paddingRight = 20, C.fills = [];
    const M = figma.createText();
    M.fontName = v, M.characters = "REMOTE INSTANCES", M.fontSize = 24, M.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], C.appendChild(M);
    const H = figma.createText();
    H.fontName = g, H.characters = "These are remotely connected component instances found in our different component pages.", H.fontSize = 14, H.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], C.appendChild(H), y.appendChild(C), t.log("Created title and description on REMOTES page");
  }
  const b = /* @__PURE__ */ new Map();
  for (const [v, g] of Object.entries(c)) {
    if (g.instanceType !== "remote")
      continue;
    const C = parseInt(v, 10);
    if (t.log(
      `Processing remote instance ${C}: "${g.componentName}"`
    ), !g.structure) {
      t.warning(
        `Remote instance "${g.componentName}" missing structure data, skipping`
      );
      continue;
    }
    bt(g.structure);
    const M = g.structure.children !== void 0, H = g.structure.child !== void 0, W = g.structure.children ? g.structure.children.length : g.structure.child ? g.structure.child.length : 0;
    t.log(
      `  Structure type: ${g.structure.type || "unknown"}, has children: ${W} (children key: ${M}, child key: ${H})`
    );
    let E = g.componentName;
    if (g.path && g.path.length > 0) {
      const I = g.path.filter((B) => B !== "").join(" / ");
      I && (E = `${I} / ${g.componentName}`);
    }
    const O = await bi(
      y,
      E
    );
    O !== E && t.log(
      `Component name conflict: "${E}" -> "${O}"`
    );
    try {
      if (g.structure.type !== "COMPONENT") {
        t.warning(
          `Remote instance "${g.componentName}" structure is not a COMPONENT (type: ${g.structure.type}), creating frame fallback`
        );
        const B = figma.createFrame();
        B.name = O;
        const x = await Xe(
          g.structure,
          B,
          n,
          i,
          null,
          o,
          b,
          !0,
          // isRemoteStructure: true
          null,
          // remoteComponentMap - not needed here
          null,
          // deferredInstances - not needed for remote instances
          null,
          // parentNodeData - not available for remote structures
          a,
          null,
          // placeholderFrameIds - not needed for remote instances
          void 0,
          // currentPlaceholderId - remote instances are not inside placeholders
          r
          // Pass styleMapping to apply styles
        );
        x ? (B.appendChild(x), y.appendChild(B), t.log(
          `✓ Created remote instance frame fallback: "${O}"`
        )) : B.remove();
        continue;
      }
      const I = figma.createComponent();
      I.name = O, y.appendChild(I), t.log(`  Created component node: "${O}"`);
      try {
        if (g.structure.componentPropertyDefinitions) {
          const V = g.structure.componentPropertyDefinitions;
          let z = 0, Z = 0;
          for (const [k, L] of Object.entries(V))
            try {
              const Q = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[L.type];
              if (!Q) {
                t.warning(
                  `  Unknown property type ${L.type} for property "${k}" in component "${g.componentName}"`
                ), Z++;
                continue;
              }
              const te = L.defaultValue, ne = k.split("#")[0];
              I.addComponentProperty(
                ne,
                Q,
                te
              ), z++;
            } catch (q) {
              t.warning(
                `  Failed to add component property "${k}" to "${g.componentName}": ${q}`
              ), Z++;
            }
          z > 0 && t.log(
            `  Added ${z} component property definition(s) to "${g.componentName}"${Z > 0 ? ` (${Z} failed)` : ""}`
          );
        }
        g.structure.name !== void 0 && (I.name = g.structure.name);
        const B = g.structure.boundVariables && typeof g.structure.boundVariables == "object" && (g.structure.boundVariables.width || g.structure.boundVariables.height);
        g.structure.width !== void 0 && g.structure.height !== void 0 && !B && I.resize(g.structure.width, g.structure.height), g.structure.x !== void 0 && (I.x = g.structure.x), g.structure.y !== void 0 && (I.y = g.structure.y);
        const x = g.structure.boundVariables && typeof g.structure.boundVariables == "object";
        if (g.structure.visible !== void 0 && (I.visible = g.structure.visible), g.structure.opacity !== void 0 && (!x || !g.structure.boundVariables.opacity) && (I.opacity = g.structure.opacity), g.structure.rotation !== void 0 && (!x || !g.structure.boundVariables.rotation) && (I.rotation = g.structure.rotation), g.structure.blendMode !== void 0 && (!x || !g.structure.boundVariables.blendMode) && (I.blendMode = g.structure.blendMode), g.structure.fills !== void 0)
          try {
            let V = g.structure.fills;
            Array.isArray(V) && (V = V.map((z) => {
              if (z && typeof z == "object") {
                const Z = le({}, z);
                return delete Z.boundVariables, Z;
              }
              return z;
            })), I.fills = V, (s = g.structure.boundVariables) != null && s.fills && o && await Qt(
              I,
              g.structure.boundVariables,
              "fills",
              o
            );
          } catch (V) {
            t.warning(
              `Error setting fills for remote component "${g.componentName}": ${V}`
            );
          }
        if (g.structure.strokes !== void 0)
          try {
            I.strokes = g.structure.strokes;
          } catch (V) {
            t.warning(
              `Error setting strokes for remote component "${g.componentName}": ${V}`
            );
          }
        const S = g.structure.boundVariables && typeof g.structure.boundVariables == "object" && (g.structure.boundVariables.strokeWeight || g.structure.boundVariables.strokeAlign);
        g.structure.strokeWeight !== void 0 && (!S || !g.structure.boundVariables.strokeWeight) && (I.strokeWeight = g.structure.strokeWeight), g.structure.strokeAlign !== void 0 && (!S || !g.structure.boundVariables.strokeAlign) && (I.strokeAlign = g.structure.strokeAlign), g.structure.layoutMode !== void 0 && (I.layoutMode = g.structure.layoutMode), g.structure.primaryAxisSizingMode !== void 0 && (I.primaryAxisSizingMode = g.structure.primaryAxisSizingMode), g.structure.counterAxisSizingMode !== void 0 && (I.counterAxisSizingMode = g.structure.counterAxisSizingMode);
        const u = g.structure.boundVariables && typeof g.structure.boundVariables == "object";
        g.structure.paddingLeft !== void 0 && (!u || !g.structure.boundVariables.paddingLeft) && (I.paddingLeft = g.structure.paddingLeft), g.structure.paddingRight !== void 0 && (!u || !g.structure.boundVariables.paddingRight) && (I.paddingRight = g.structure.paddingRight), g.structure.paddingTop !== void 0 && (!u || !g.structure.boundVariables.paddingTop) && (I.paddingTop = g.structure.paddingTop), g.structure.paddingBottom !== void 0 && (!u || !g.structure.boundVariables.paddingBottom) && (I.paddingBottom = g.structure.paddingBottom), g.structure.itemSpacing !== void 0 && (!u || !g.structure.boundVariables.itemSpacing) && (I.itemSpacing = g.structure.itemSpacing);
        const P = g.structure.boundVariables && typeof g.structure.boundVariables == "object" && (g.structure.boundVariables.cornerRadius || g.structure.boundVariables.topLeftRadius || g.structure.boundVariables.topRightRadius || g.structure.boundVariables.bottomLeftRadius || g.structure.boundVariables.bottomRightRadius);
        if (g.structure.cornerRadius !== void 0 && (!P || !g.structure.boundVariables.cornerRadius) && (I.cornerRadius = g.structure.cornerRadius), g.structure.boundVariables && o) {
          const V = g.structure.boundVariables, z = [
            "paddingLeft",
            "paddingRight",
            "paddingTop",
            "paddingBottom",
            "itemSpacing",
            "opacity",
            "rotation",
            "blendMode",
            "strokeWeight",
            "strokeAlign",
            "cornerRadius",
            "topLeftRadius",
            "topRightRadius",
            "bottomLeftRadius",
            "bottomRightRadius",
            "width",
            "height"
          ];
          for (const Z of z)
            if (V[Z] && ze(V[Z])) {
              const k = V[Z]._varRef;
              if (k !== void 0) {
                const L = o.get(String(k));
                if (L) {
                  const q = {
                    type: "VARIABLE_ALIAS",
                    id: L.id
                  };
                  I.boundVariables || (I.boundVariables = {}), I.boundVariables[Z] = q;
                }
              }
            }
        }
        t.log(
          `  DEBUG: Structure keys: ${Object.keys(g.structure).join(", ")}, has children: ${!!g.structure.children}, has child: ${!!g.structure.child}`
        );
        const w = g.structure.children || (g.structure.child ? g.structure.child : null);
        if (t.log(
          `  DEBUG: childrenArray exists: ${!!w}, isArray: ${Array.isArray(w)}, length: ${w ? w.length : 0}`
        ), w && Array.isArray(w) && w.length > 0) {
          t.log(
            `  Recreating ${w.length} child(ren) for component "${g.componentName}"`
          );
          for (let V = 0; V < w.length; V++) {
            const z = w[V];
            if (t.log(
              `  DEBUG: Processing child ${V + 1}/${w.length}: ${JSON.stringify({ name: z == null ? void 0 : z.name, type: z == null ? void 0 : z.type, hasTruncated: !!(z != null && z._truncated) })}`
            ), z._truncated) {
              t.log(
                `  Skipping truncated child: ${z._reason || "Unknown"}`
              );
              continue;
            }
            t.log(
              `  Recreating child: "${z.name || "Unnamed"}" (type: ${z.type})`
            );
            const Z = await Xe(
              z,
              I,
              n,
              i,
              null,
              o,
              b,
              !0,
              // isRemoteStructure: true
              null,
              // remoteComponentMap - not needed here
              null,
              // deferredInstances - not needed for remote instances
              g.structure,
              // parentNodeData - pass the component's structure so children can check for auto-layout
              a,
              null,
              // placeholderFrameIds - not needed for remote instances
              void 0,
              // currentPlaceholderId - remote instances are not inside placeholders
              r
              // Pass styleMapping to apply styles
            );
            Z ? (I.appendChild(Z), t.log(
              `  ✓ Appended child "${z.name || "Unnamed"}" to component "${g.componentName}"`
            )) : t.warning(
              `  ✗ Failed to create child "${z.name || "Unnamed"}" (type: ${z.type})`
            );
          }
        }
        p.set(C, I), t.log(
          `✓ Created remote component: "${O}" (index ${C})`
        );
      } catch (B) {
        t.warning(
          `Error populating remote component "${g.componentName}": ${B instanceof Error ? B.message : "Unknown error"}`
        ), I.remove();
      }
    } catch (I) {
      t.warning(
        `Error recreating remote instance "${g.componentName}": ${I instanceof Error ? I.message : "Unknown error"}`
      );
    }
  }
  return t.log(
    `Remote instance processing complete: ${p.size} component(s) created`
  ), p;
}
async function vi(e, n, i, o, a, l, r = null, c = null, d = null, p = !1, h = null, $ = !1, y = !1, m = "", b = null) {
  t.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const s = figma.root.children, v = "RecursicaPublishedMetadata";
  let g = null;
  for (const S of s) {
    const u = S.getPluginData(v);
    if (u)
      try {
        if (JSON.parse(u).id === e.guid) {
          g = S;
          break;
        }
      } catch (P) {
        continue;
      }
  }
  let C = !1;
  if (g && !p && !$) {
    let S;
    try {
      const w = g.getPluginData(v);
      w && (S = JSON.parse(w).version);
    } catch (w) {
    }
    const u = S !== void 0 ? ` v${S}` : "", P = `Found existing component "${g.name}${u}". Should I use it or create a copy?`;
    t.log(
      `Found existing page with same GUID: "${g.name}". Prompting user...`
    );
    try {
      await tt.prompt(P, {
        okLabel: "Use",
        cancelLabel: "Copy",
        timeoutMs: 3e5
        // 5 minutes
      }), C = !0, t.log(
        `User chose to use existing page: "${g.name}"`
      );
    } catch (w) {
      t.log("User chose to create a copy. Will create new page.");
    }
  }
  if (C && g)
    return await figma.setCurrentPageAsync(g), t.log(
      `Using existing page: "${g.name}" (GUID: ${e.guid.substring(0, 8)}...)`
    ), t.log(
      `  Instances from other pages will resolve to components on this existing page using componentPageName: "${g.name}"`
    ), {
      success: !0,
      page: g,
      // Include pageId so it can be tracked in importedPages
      pageId: g.id
    };
  const M = s.find((S) => S.name === e.name);
  M && t.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let H;
  if (g || M) {
    const S = `__${e.name}`;
    H = await Bt(S), t.log(
      `Creating scratch page: "${H}" (will be renamed to "${e.name}" on success)`
    );
  } else
    H = e.name, t.log(`Creating page: "${H}"`);
  const W = figma.createPage();
  if (W.name = H, await figma.setCurrentPageAsync(W), t.log(`Switched to page: "${H}"`), !n.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  t.log("Recreating page structure...");
  const E = n.pageData;
  if (E.backgrounds !== void 0)
    try {
      W.backgrounds = E.backgrounds, t.log(
        `Set page background: ${JSON.stringify(E.backgrounds)}`
      );
    } catch (S) {
      t.warning(`Failed to set page background: ${S}`);
    }
  bt(E);
  const O = /* @__PURE__ */ new Map(), I = (S, u = []) => {
    if (S.type === "COMPONENT" && S.id && u.push(S.id), S.children && Array.isArray(S.children))
      for (const P of S.children)
        P._truncated || I(P, u);
    return u;
  }, B = I(E);
  if (t.log(
    `Found ${B.length} COMPONENT node(s) in page data`
  ), B.length > 0 && (t.log(
    `Component IDs in page data (first 20): ${B.slice(0, 20).map((S) => S.substring(0, 8) + "...").join(", ")}`
  ), E._allComponentIds = B), E.children && Array.isArray(E.children))
    for (const S of E.children) {
      const u = await Xe(
        S,
        W,
        i,
        o,
        a,
        l,
        O,
        !1,
        // isRemoteStructure: false - we're creating the main page
        r,
        c,
        E,
        // parentNodeData - pass the page's nodeData so children can check for auto-layout
        h,
        d,
        void 0,
        // currentPlaceholderId - page root is not inside a placeholder
        b
        // Pass styleMapping to apply styles
      );
      u && W.appendChild(u);
    }
  t.log("Page structure recreated successfully"), a && (t.log("Third pass: Setting variant properties on instances..."), await si(
    W,
    a,
    O
  ));
  const x = {
    _ver: 1,
    id: e.guid,
    name: e.name,
    version: e.version || 0,
    publishDate: (/* @__PURE__ */ new Date()).toISOString(),
    history: {}
  };
  if (W.setPluginData(v, JSON.stringify(x)), t.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), H.startsWith("__")) {
    let S;
    y ? S = m ? `${m} ${e.name}` : e.name : S = await Bt(e.name), W.name = S, t.log(`Renamed page from "${H}" to "${S}"`);
  } else y && m && (W.name.startsWith(m) || (W.name = `${m} ${W.name}`));
  return {
    success: !0,
    page: W,
    deferredInstances: c || void 0
  };
}
async function Ot(e, n) {
  var a, l, r;
  we(n), e.clearConsole !== !1 && t.clear(), t.log("=== Starting Page Import ===");
  const o = [];
  try {
    const c = e.jsonData;
    if (!c)
      return t.error("JSON data is required"), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "JSON data is required",
        data: {}
      };
    t.log("Validating metadata...");
    const d = gi(c);
    if (!d.success)
      return t.error(d.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: d.error,
        data: {}
      };
    const p = d.metadata;
    t.log(
      `Metadata validated: guid=${p.guid}, name=${p.name}`
    ), we(n), t.log("Loading string table...");
    const h = yt(c);
    if (!h.success)
      return t.error(h.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: h.error,
        data: {}
      };
    t.log("String table loaded successfully"), t.log("Expanding JSON data...");
    const $ = h.expandedJsonData;
    t.log("JSON expanded successfully"), we(n), t.log("Loading collections table...");
    const y = nn($);
    if (!y.success)
      return y.error === "No collections table found in JSON" ? (t.log(y.error), t.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: p.name }
      }) : (t.error(y.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: y.error,
        data: {}
      });
    const m = y.collectionTable;
    t.log(
      `Loaded collections table with ${m.getSize()} collection(s)`
    ), we(n), t.log("Matching collections with existing local collections...");
    const { recognizedCollections: b, potentialMatches: s, collectionsToCreate: v } = await fi(m, e.preCreatedCollections);
    await pi(
      s,
      b,
      v,
      e.collectionChoices
    ), await mi(
      b,
      m,
      s
    ), await ui(
      v,
      b,
      o,
      e.preCreatedCollections
    ), we(n), t.log("Loading variables table...");
    const g = on($);
    if (!g.success)
      return g.error === "No variables table found in JSON" ? (t.log(g.error), t.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no variables to process)",
        data: { pageName: p.name }
      }) : (t.error(g.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: g.error,
        data: {}
      });
    const C = g.variableTable;
    t.log(
      `Loaded variables table with ${C.getSize()} variable(s)`
    ), we(n);
    const { recognizedVariables: M, newlyCreatedVariables: H } = await rn(
      C,
      m,
      b,
      o
    );
    t.log("Checking for styles table...");
    const W = $.styles !== void 0 && $.styles !== null;
    if (!W) {
      if (en(
        $.pageData
      )) {
        const K = "Style references found in page data but styles table is missing from JSON. Cannot import styles.";
        return t.error(K), {
          type: "importPage",
          success: !1,
          error: !0,
          message: K,
          data: {}
        };
      }
      t.log(
        "No styles table found in JSON (and no style references detected)"
      );
    }
    let E = null;
    if (W) {
      t.log("Loading styles table...");
      const ne = pt.fromTable($.styles);
      t.log(
        `Loaded styles table with ${ne.getSize()} style(s)`
      ), E = await ti(
        ne.getTable(),
        M
      ), t.log(
        `Imported ${E.size} style(s) (some may have been skipped if they already exist)`
      );
    }
    we(n), t.log("Loading instance table...");
    const O = hi($);
    if (O) {
      const ne = O.getSerializedTable(), K = Object.values(ne).filter(
        (U) => U.instanceType === "internal"
      ), J = Object.values(ne).filter(
        (U) => U.instanceType === "remote"
      );
      t.log(
        `Loaded instance table with ${O.getSize()} instance(s) (${K.length} internal, ${J.length} remote)`
      );
    } else
      t.log("No instance table found in JSON");
    we(n);
    const I = [], B = /* @__PURE__ */ new Set(), x = (a = e.isMainPage) != null ? a : !0, S = (l = e.alwaysCreateCopy) != null ? l : !1, u = (r = e.skipUniqueNaming) != null ? r : !1, P = e.constructionIcon || "";
    let w = null;
    O && (w = await $i(
      O,
      C,
      m,
      M,
      b,
      P,
      E
      // Pass styleMapping to apply styles
    ));
    const V = await vi(
      p,
      $,
      C,
      m,
      O,
      M,
      w,
      I,
      B,
      x,
      b,
      S,
      u,
      P,
      E
      // Pass styleMapping to apply styles
    );
    if (!V.success)
      return t.error(V.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: V.error,
        data: {}
      };
    const z = V.page, Z = M.size + H.length, k = V.deferredInstances || I, L = (k == null ? void 0 : k.length) || 0;
    if (t.log("=== Import Complete ==="), t.log(
      `Successfully processed ${b.size} collection(s), ${Z} variable(s), and created page "${z.name}"${L > 0 ? ` (${L} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`
    ), L > 0)
      for (const ne of k)
        t.log(
          `    - "${ne.nodeData.name}" from page "${ne.instanceEntry.componentPageName}"`
        );
    const q = V.pageId || z.id, Q = t.getLogs();
    return {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: le({
        pageName: z.name,
        pageId: q,
        // Include pageId for tracking (used for both new and reused pages)
        deferredInstances: L > 0 ? k : void 0,
        createdEntities: {
          pageIds: [z.id],
          collectionIds: o.map((ne) => ne.id),
          variableIds: H.map((ne) => ne.id)
        }
      }, Q.length > 0 && { debugLogs: Q })
    };
  } catch (c) {
    const d = c instanceof Error ? c.message : "Unknown error occurred";
    t.error(`Import failed: ${d}`), c instanceof Error && c.stack && t.error(`Stack trace: ${c.stack}`), console.error("Error importing page:", c);
    const p = t.getLogs();
    return {
      type: "importPage",
      success: !1,
      error: !0,
      message: d,
      data: le({}, p.length > 0 && { debugLogs: p })
    };
  }
}
async function Gt(e, n, i) {
  var o, a;
  if (!(!i || !n.children || !Array.isArray(n.children) || !e.children || e.children.length === 0)) {
    t.log(
      `[FILL-BOUND] Applying fill bound variables to instance "${e.name}" children. Instance has ${e.children.length} child(ren), JSON has ${((o = n.children) == null ? void 0 : o.length) || 0} child(ren)`
    );
    for (const l of e.children) {
      if (!("fills" in l) || !Array.isArray(l.fills)) {
        t.log(
          `[FILL-BOUND] Skipping child "${l.name}" - no fills property`
        );
        continue;
      }
      const r = n.children.find(
        (c) => c.name === l.name
      );
      if (!r) {
        t.log(
          `[FILL-BOUND] No JSON data found for child "${l.name}" in instance "${e.name}"`
        );
        continue;
      }
      if (!((a = r.boundVariables) != null && a.fills)) {
        t.log(
          `[FILL-BOUND] Child "${l.name}" in instance "${e.name}" has no fill bound variables in JSON`
        );
        continue;
      }
      t.log(
        `[FILL-BOUND] Found fill bound variables for child "${l.name}" in instance "${e.name}"`
      );
      try {
        if (!i) {
          t.warning(
            "[FILL-BOUND] Cannot apply fill bound variables: recognizedVariables is null"
          );
          continue;
        }
        const c = r.boundVariables.fills;
        if (!Array.isArray(c))
          continue;
        const d = [];
        for (let p = 0; p < l.fills.length && p < c.length; p++) {
          const h = l.fills[p], $ = c[p];
          if ($ && typeof $ == "object") {
            let y = null;
            if ($._varRef !== void 0) {
              const m = $._varRef;
              y = i.get(String(m)) || null;
            } else if ($.color) {
              const m = $.color;
              m._varRef !== void 0 ? y = i.get(String(m._varRef)) || null : m.type === "VARIABLE_ALIAS" && m.id && (y = await figma.variables.getVariableByIdAsync(
                m.id
              ));
            } else $.type === "VARIABLE_ALIAS" && $.id && (y = await figma.variables.getVariableByIdAsync(
              $.id
            ));
            if (y && h.type === "SOLID") {
              const m = h, b = {
                type: "SOLID",
                visible: m.visible,
                opacity: m.opacity,
                blendMode: m.blendMode,
                color: le({}, m.color)
                // This will be overridden by the variable
              }, s = figma.variables.setBoundVariableForPaint(
                b,
                "color",
                y
              );
              d.push(s), t.log(
                `[FILL-BOUND] ✓ Bound variable "${y.name}" (${y.id}) to fill[${p}].color on child "${l.name}"`
              );
            } else y ? (d.push(h), y ? h.type !== "SOLID" && t.log(
              `[FILL-BOUND] Fill[${p}] on child "${l.name}" is type "${h.type}" - variable binding for non-solid fills not yet implemented`
            ) : t.warning(
              `[FILL-BOUND] Could not resolve variable for fill[${p}] on child "${l.name}"`
            )) : d.push(h);
          } else
            d.push(h);
        }
        l.fills = d, t.log(
          `[FILL-BOUND] ✓ Applied fill bound variables to child "${l.name}" in instance "${e.name}" (${d.length} fill(s))`
        );
      } catch (c) {
        t.warning(
          `Error applying fill bound variables to instance child "${l.name}": ${c instanceof Error ? c.message : String(c)}`
        );
      }
    }
    t.log(
      `[FILL-BOUND] Finished applying fill bound variables to instance "${e.name}" children`
    );
  }
}
async function _t(e, n) {
  if (!n.children || !Array.isArray(n.children) || !e.children || e.children.length === 0)
    return;
  const i = (l, r) => {
    if ("children" in l && Array.isArray(l.children))
      for (const c of l.children) {
        if (c.name === r)
          return c;
        const d = i(c, r);
        if (d)
          return d;
      }
    return null;
  };
  for (const l of n.children) {
    if (!l || !l.name)
      continue;
    i(
      e,
      l.name
    ) || t.warning(
      `Child "${l.name}" in JSON does not exist in instance "${e.name}" - skipping (instance override or Figma limitation)`
    );
  }
  const o = new Set(
    (n.children || []).map((l) => l == null ? void 0 : l.name).filter(Boolean)
  ), a = e.children.filter(
    (l) => !o.has(l.name)
  );
  a.length > 0 && t.log(
    `Instance "${e.name}" has ${a.length} child(ren) not in JSON - keeping default children: ${a.map((l) => l.name).join(", ")}`
  );
}
async function xt(e, n = "", i = null, o = null, a = null, l = null) {
  var y;
  if (e.length === 0)
    return { resolved: 0, failed: 0, errors: [] };
  t.log(
    `=== Resolving ${e.length} deferred normal instance(s) ===`
  );
  let r = 0, c = 0;
  const d = [];
  await figma.loadAllPagesAsync();
  const p = (m, b, s = /* @__PURE__ */ new Set()) => {
    if (!m.parentPlaceholderId || s.has(m.placeholderFrameId))
      return 0;
    s.add(m.placeholderFrameId);
    const v = b.find(
      (g) => g.placeholderFrameId === m.parentPlaceholderId
    );
    return v ? 1 + p(v, b, s) : 0;
  }, h = e.map((m) => ({
    deferred: m,
    depth: p(m, e)
  }));
  if (h.sort((m, b) => b.depth - m.depth), t.log(
    `[BOTTOM-UP] Sorted ${e.length} deferred instance(s) by depth (deepest first)`
  ), h.length > 0) {
    const m = Math.max(...h.map((b) => b.depth));
    t.log(
      `[BOTTOM-UP] Depth range: 0 (root) to ${m} (deepest)`
    );
  }
  const $ = /* @__PURE__ */ new Set();
  for (const m of e)
    m.parentPlaceholderId && ($.add(m.placeholderFrameId), t.log(
      `[NESTED] Pre-marked child deferred instance "${m.nodeData.name}" (placeholder: ${m.placeholderFrameId.substring(0, 8)}..., parent placeholder: ${m.parentPlaceholderId.substring(0, 8)}...)`
    ));
  t.log(
    `[NESTED] Pre-marked ${$.size} child deferred instance(s) to skip in main loop`
  );
  for (const { deferred: m } of h) {
    if ($.has(m.placeholderFrameId)) {
      t.log(
        `[NESTED] Skipping child deferred instance "${m.nodeData.name}" (placeholder: ${m.placeholderFrameId.substring(0, 8)}...) - will be resolved when parent is resolved`
      );
      continue;
    }
    try {
      const { placeholderFrameId: b, instanceEntry: s, nodeData: v, parentNodeId: g } = m, C = await figma.getNodeByIdAsync(
        b
      ), M = await figma.getNodeByIdAsync(
        g
      );
      if (!C || !M) {
        const S = m.parentPlaceholderId !== void 0, u = $.has(b), P = `Deferred instance "${v.name}" - could not find placeholder frame (${b.substring(0, 8)}...) or parent node (${g.substring(0, 8)}...). Was child deferred: ${S}, Was marked: ${u}`;
        t.error(P), S && !u && t.error(
          `[NESTED] BUG: Child deferred instance "${v.name}" was not properly marked! parentPlaceholderId: ${(y = m.parentPlaceholderId) == null ? void 0 : y.substring(0, 8)}...`
        ), d.push(P), c++;
        continue;
      }
      let H = figma.root.children.find((S) => {
        const u = S.name === s.componentPageName, P = n && S.name === `${n} ${s.componentPageName}`;
        return u || P;
      });
      if (!H) {
        const S = $e(
          s.componentPageName
        );
        H = figma.root.children.find((u) => $e(u.name) === S);
      }
      if (!H) {
        const S = n ? `"${s.componentPageName}" or "${n} ${s.componentPageName}"` : `"${s.componentPageName}"`, u = `Deferred instance "${v.name}" still cannot find referenced page (tried: ${S}, and clean name matching)`;
        t.error(u), d.push(u), c++;
        continue;
      }
      const W = (S, u, P, w, V) => {
        if (u.length === 0) {
          let L = null;
          const q = $e(P);
          for (const Q of S.children || [])
            if (Q.type === "COMPONENT") {
              const te = Q.name === P, ne = $e(Q.name) === q;
              if (te || ne) {
                if (L || (L = Q), te && w)
                  try {
                    const K = Q.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (K && JSON.parse(K).id === w)
                      return Q;
                  } catch (K) {
                  }
                else if (te)
                  return Q;
              }
            } else if (Q.type === "COMPONENT_SET") {
              if (V) {
                const te = Q.name === V, ne = $e(Q.name) === $e(V);
                if (!te && !ne)
                  continue;
              }
              for (const te of Q.children || [])
                if (te.type === "COMPONENT") {
                  const ne = te.name === P, K = $e(te.name) === q;
                  if (ne || K) {
                    if (L || (L = te), ne && w)
                      try {
                        const J = te.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (J && JSON.parse(J).id === w)
                          return te;
                      } catch (J) {
                      }
                    else if (ne)
                      return te;
                  }
                }
            }
          return L;
        }
        const [z, ...Z] = u, k = $e(z);
        for (const L of S.children || []) {
          const q = L.name === z, Q = $e(L.name) === k;
          if (q || Q) {
            if (Z.length === 0) {
              if (L.type === "COMPONENT_SET") {
                if (V) {
                  const K = L.name === V, J = $e(L.name) === $e(V);
                  if (!K && !J)
                    continue;
                }
                const te = $e(P);
                let ne = null;
                for (const K of L.children || [])
                  if (K.type === "COMPONENT") {
                    const J = K.name === P, U = $e(K.name) === te;
                    if (J || U) {
                      if (ne || (ne = K), w)
                        try {
                          const j = K.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (j && JSON.parse(j).id === w)
                            return K;
                        } catch (j) {
                        }
                      if (J)
                        return K;
                    }
                  }
                return ne || null;
              }
              return null;
            }
            return Z.length > 0 ? W(
              L,
              Z,
              P,
              w,
              V
            ) : null;
          }
        }
        return null;
      };
      let E = W(
        H,
        s.path || [],
        s.componentName,
        s.componentGuid,
        s.componentSetName
      );
      if (!E && s.componentSetName) {
        const S = (u, P = 0) => {
          if (P > 5) return null;
          for (const w of u.children || []) {
            if (w.type === "COMPONENT_SET") {
              const V = w.name === s.componentSetName, z = $e(w.name) === $e(s.componentSetName || "");
              if (V || z) {
                const Z = $e(
                  s.componentName
                );
                for (const k of w.children || [])
                  if (k.type === "COMPONENT") {
                    const L = k.name === s.componentName, q = $e(k.name) === Z;
                    if (L || q) {
                      if (s.componentGuid)
                        try {
                          const Q = k.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (Q && JSON.parse(Q).id === s.componentGuid)
                            return k;
                        } catch (Q) {
                        }
                      return k;
                    }
                  }
              }
            }
            if (w.type === "FRAME" || w.type === "GROUP") {
              const V = S(w, P + 1);
              if (V) return V;
            }
          }
          return null;
        };
        E = S(H);
      }
      if (!E) {
        const S = s.path && s.path.length > 0 ? ` at path [${s.path.join(" → ")}]` : " at page root", u = [], P = (V, z = 0) => {
          if (!(z > 3) && ((V.type === "COMPONENT" || V.type === "COMPONENT_SET") && u.push(
            `${V.type}: "${V.name}"${V.type === "COMPONENT_SET" ? ` (${V.children.length} variants)` : ""}`
          ), V.children && Array.isArray(V.children)))
            for (const Z of V.children.slice(0, 10))
              P(Z, z + 1);
        };
        P(H);
        const w = `Deferred instance "${v.name}" still cannot find component "${s.componentName}" on page "${s.componentPageName}"${S}`;
        t.error(w), d.push(w), c++;
        continue;
      }
      const O = E.createInstance();
      if (O.name = v.name || C.name.replace("[Deferred: ", "").replace("]", ""), O.x = C.x, O.y = C.y, C.width !== void 0 && C.height !== void 0 && O.resize(C.width, C.height), s.variantProperties && Object.keys(s.variantProperties).length > 0)
        try {
          const S = await O.getMainComponentAsync();
          if (S) {
            let u = null;
            const P = S.type;
            if (P === "COMPONENT_SET" ? u = S.componentPropertyDefinitions : P === "COMPONENT" && S.parent && S.parent.type === "COMPONENT_SET" ? u = S.parent.componentPropertyDefinitions : t.warning(
              `Cannot set variant properties for resolved instance "${v.name}" - main component is not a COMPONENT_SET or variant`
            ), u) {
              const w = {};
              for (const [V, z] of Object.entries(
                s.variantProperties
              )) {
                const Z = V.split("#")[0];
                u[Z] && (w[Z] = z);
              }
              Object.keys(w).length > 0 && O.setProperties(w);
            }
          }
        } catch (S) {
          t.warning(
            `Failed to set variant properties for resolved instance "${v.name}": ${S}`
          );
        }
      if (s.componentProperties && Object.keys(s.componentProperties).length > 0)
        try {
          const S = await O.getMainComponentAsync();
          if (S) {
            let u = null;
            const P = S.type;
            if (P === "COMPONENT_SET" ? u = S.componentPropertyDefinitions : P === "COMPONENT" && S.parent && S.parent.type === "COMPONENT_SET" ? u = S.parent.componentPropertyDefinitions : P === "COMPONENT" && (u = S.componentPropertyDefinitions), u)
              for (const [w, V] of Object.entries(
                s.componentProperties
              )) {
                const z = w.split("#")[0];
                if (u[z])
                  try {
                    O.setProperties({
                      [z]: V
                    });
                  } catch (Z) {
                    t.warning(
                      `Failed to set component property "${z}" for resolved instance "${v.name}": ${Z}`
                    );
                  }
              }
          }
        } catch (S) {
          t.warning(
            `Failed to set component properties for resolved instance "${v.name}": ${S}`
          );
        }
      await Gt(
        O,
        v,
        i
      ), await _t(O, v), t.log(
        `[NESTED] Extracting child deferred instances for placeholder "${v.name}" (${b.substring(0, 8)}...). Total deferred instances: ${e.length}`
      );
      const I = async (S) => {
        try {
          const u = await figma.getNodeByIdAsync(S);
          if (!u || !u.parent) return !1;
          let P = u.parent;
          for (; P; ) {
            if (P.id === b)
              return !0;
            if (P.type === "PAGE")
              break;
            P = P.parent;
          }
          return !1;
        } catch (u) {
          return !1;
        }
      }, B = [];
      for (const S of e)
        S.parentPlaceholderId === b ? (B.push(S), t.log(
          `[NESTED]   - Found child by parentPlaceholderId: "${S.nodeData.name}" (placeholder: ${S.placeholderFrameId.substring(0, 8)}...)`
        )) : await I(
          S.placeholderFrameId
        ) && (B.push(S), t.log(
          `[NESTED]   - Found child by structural check: "${S.nodeData.name}" (placeholder: ${S.placeholderFrameId.substring(0, 8)}...) - placeholder is inside current placeholder`
        ));
      t.log(
        `[NESTED] Found ${B.length} child deferred instance(s) for placeholder "${v.name}"`
      );
      for (const S of B)
        $.add(S.placeholderFrameId);
      if ("children" in M && "insertChild" in M) {
        const S = M.children.indexOf(C);
        M.insertChild(S, O), C.remove();
      } else {
        const S = `Parent node does not support children operations for deferred instance "${v.name}"`;
        t.error(S), d.push(S);
        continue;
      }
      const x = (S, u) => {
        const P = [];
        if (S.name === u && P.push(S), "children" in S)
          for (const w of S.children)
            P.push(...x(w, u));
        return P;
      };
      for (const S of B)
        try {
          const u = x(
            O,
            S.nodeData.name
          );
          if (u.length === 0) {
            t.warning(
              `  Could not find matching child "${S.nodeData.name}" in resolved instance "${v.name}" - child may not exist in component`
            );
            continue;
          }
          if (u.length > 1) {
            const J = `Cannot resolve child deferred instance "${S.nodeData.name}": multiple children with same name in instance "${v.name}"`;
            t.error(J), d.push(J), c++;
            continue;
          }
          const P = u[0], w = S.instanceEntry;
          let V = figma.root.children.find((J) => {
            const U = J.name === w.componentPageName, j = n && J.name === `${n} ${w.componentPageName}`;
            return U || j;
          });
          if (!V) {
            const J = $e(
              w.componentPageName
            );
            V = figma.root.children.find((U) => $e(U.name) === J);
          }
          if (!V) {
            t.warning(
              `  Could not find referenced page for child deferred instance "${S.nodeData.name}"`
            );
            continue;
          }
          const z = (J, U, j, Y, re) => {
            if (U.length === 0) {
              let fe = null;
              for (const ce of J.children || [])
                if (ce.type === "COMPONENT") {
                  const ae = $e(ce.name), se = $e(j);
                  if (ae === se)
                    if (fe || (fe = ce), Y)
                      try {
                        const de = ce.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (de && JSON.parse(de).id === Y)
                          return ce;
                      } catch (de) {
                      }
                    else
                      return ce;
                } else if (ce.type === "COMPONENT_SET" && re) {
                  const ae = $e(ce.name), se = $e(re);
                  if (ae === se) {
                    for (const de of ce.children)
                      if (de.type === "COMPONENT") {
                        const me = $e(
                          de.name
                        ), Se = $e(j);
                        if (me === Se)
                          if (fe || (fe = de), Y)
                            try {
                              const Ve = de.getPluginData(
                                "RecursicaPublishedMetadata"
                              );
                              if (Ve && JSON.parse(Ve).id === Y)
                                return de;
                            } catch (Ve) {
                            }
                          else
                            return de;
                      }
                  }
                }
              return fe;
            }
            let he = J;
            for (const fe of U) {
              const ce = $e(fe), ae = (he.children || []).find(
                (se) => $e(se.name) === ce
              );
              if (!ae) return null;
              he = ae;
            }
            if (he.type === "COMPONENT") {
              const fe = $e(he.name), ce = $e(j);
              if (fe === ce)
                if (Y)
                  try {
                    const ae = he.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (ae && JSON.parse(ae).id === Y)
                      return he;
                  } catch (ae) {
                    return null;
                  }
                else
                  return he;
            } else if (he.type === "COMPONENT_SET" && re) {
              for (const fe of he.children)
                if (fe.type === "COMPONENT") {
                  const ce = $e(fe.name), ae = $e(j);
                  if (ce === ae)
                    if (Y)
                      try {
                        const se = fe.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (se && JSON.parse(se).id === Y)
                          return fe;
                      } catch (se) {
                        continue;
                      }
                    else
                      return fe;
                }
            }
            return null;
          };
          let Z = w.componentSetName;
          !Z && S.nodeData.name && (Z = S.nodeData.name, t.log(
            `  [NESTED] componentSetName not provided, using child name "${Z}" as fallback`
          )), t.log(
            `  [NESTED] Looking for component: page="${V.name}", componentSet="${Z}", component="${w.componentName}", path=[${(w.path || []).join(", ")}]`
          );
          const k = (J) => {
            const U = [];
            if (J.type === "COMPONENT_SET" && U.push(J), "children" in J && Array.isArray(J.children))
              for (const j of J.children)
                U.push(...k(j));
            return U;
          }, L = k(V);
          t.log(
            `  [NESTED] Found ${L.length} component set(s) on page "${V.name}" (recursive search): ${L.map((J) => J.name).join(", ")}`
          );
          const q = V.children.map(
            (J) => `${J.type}:${J.name}`
          );
          t.log(
            `  [NESTED] Direct children of page "${V.name}" (${q.length}): ${q.slice(0, 10).join(", ")}${q.length > 10 ? "..." : ""}`
          );
          const Q = z(
            V,
            w.path || [],
            w.componentName,
            w.componentGuid,
            Z
          );
          if (!Q) {
            if (t.warning(
              `  Could not find component "${w.componentName}" (componentSet: "${Z}") for child deferred instance "${S.nodeData.name}" on page "${V.name}"`
            ), Z) {
              const J = $e(Z), U = L.filter((j) => $e(j.name) === J);
              if (U.length > 0) {
                t.log(
                  `  [NESTED] Found ${U.length} component set(s) with matching clean name "${J}": ${U.map((j) => j.name).join(", ")}`
                );
                for (const j of U) {
                  const Y = j.children.filter(
                    (re) => re.type === "COMPONENT"
                  );
                  t.log(
                    `  [NESTED] Component set "${j.name}" has ${Y.length} variant(s): ${Y.map((re) => re.name).join(", ")}`
                  );
                }
              }
            }
            continue;
          }
          const te = Q.createInstance();
          te.name = S.nodeData.name || P.name, te.x = P.x, te.y = P.y, P.width !== void 0 && P.height !== void 0 && te.resize(P.width, P.height), await Gt(
            te,
            S.nodeData,
            i
          ), await _t(
            te,
            S.nodeData
          );
          const ne = P.parent;
          if (!ne || !("children" in ne)) {
            const J = `Cannot replace child "${S.nodeData.name}": parent does not support children`;
            t.error(J), d.push(J), c++;
            continue;
          }
          const K = ne.children.indexOf(P);
          ne.insertChild(K, te), P.remove(), t.log(
            `  ✓ Resolved nested child deferred instance "${S.nodeData.name}" in "${v.name}"`
          );
        } catch (u) {
          t.warning(
            `  Error resolving child deferred instance "${S.nodeData.name}": ${u instanceof Error ? u.message : String(u)}`
          );
        }
      t.log(
        `  ✓ Resolved deferred instance "${v.name}" from component "${s.componentName}" on page "${s.componentPageName}"`
      ), r++;
    } catch (b) {
      const s = b instanceof Error ? b.message : String(b), v = `Failed to resolve deferred instance "${m.nodeData.name}": ${s}`;
      t.error(v), d.push(v), c++;
    }
  }
  return t.log(
    `=== Deferred Resolution Complete: ${r} resolved, ${c} failed ===`
  ), { resolved: r, failed: c, errors: d };
}
async function an(e) {
  t.log("=== Cleaning up created entities ===");
  try {
    const { pageIds: n, collectionIds: i, variableIds: o } = e;
    let a = 0;
    for (const c of o)
      try {
        const d = await figma.variables.getVariableByIdAsync(c);
        if (d) {
          const p = d.variableCollectionId;
          i.includes(p) || (d.remove(), a++);
        }
      } catch (d) {
        t.warning(
          `Could not delete variable ${c.substring(0, 8)}...: ${d}`
        );
      }
    let l = 0;
    for (const c of i)
      try {
        const d = await figma.variables.getVariableCollectionByIdAsync(c);
        d && (d.remove(), l++);
      } catch (d) {
        t.warning(
          `Could not delete collection ${c.substring(0, 8)}...: ${d}`
        );
      }
    await figma.loadAllPagesAsync();
    let r = 0;
    for (const c of n)
      try {
        const d = await figma.getNodeByIdAsync(c);
        d && d.type === "PAGE" && (d.remove(), r++);
      } catch (d) {
        t.warning(
          `Could not delete page ${c.substring(0, 8)}...: ${d}`
        );
      }
    return t.log(
      `Cleanup complete: Deleted ${r} page(s), ${l} collection(s), ${a} variable(s)`
    ), {
      type: "cleanupCreatedEntities",
      success: !0,
      error: !1,
      message: "Cleanup completed successfully",
      data: {
        deletedPages: r,
        deletedCollections: l,
        deletedVariables: a
      }
    };
  } catch (n) {
    const i = n instanceof Error ? n.message : "Unknown error occurred";
    return t.error(`Cleanup failed: ${i}`), {
      type: "cleanupCreatedEntities",
      success: !1,
      error: !0,
      message: i,
      data: {}
    };
  }
}
const Si = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cleanupCreatedEntities: an,
  importPage: Ot,
  loadAndExpandJson: yt,
  loadCollectionTable: nn,
  loadVariableTable: on,
  matchAndCreateVariables: rn,
  normalizeStructureTypes: bt,
  recreateNodeFromData: Xe,
  resolveDeferredNormalInstances: xt,
  restoreBoundVariablesForFills: Qt
}, Symbol.toStringTag, { value: "Module" }));
async function sn(e) {
  const n = [];
  for (const { fileName: i, jsonData: o } of e)
    try {
      const a = yt(o);
      if (!a.success || !a.expandedJsonData) {
        t.warning(
          `Skipping ${i} - failed to expand JSON: ${a.error || "Unknown error"}`
        );
        continue;
      }
      const l = a.expandedJsonData, r = l.metadata;
      if (!r || !r.name || !r.guid) {
        t.warning(
          `Skipping ${i} - missing or invalid metadata`
        );
        continue;
      }
      const c = [];
      if (l.instances) {
        const p = at.fromTable(
          l.instances
        ).getSerializedTable();
        for (const h of Object.values(p))
          h.instanceType === "normal" && h.componentPageName && (c.includes(h.componentPageName) || c.push(h.componentPageName));
      }
      n.push({
        fileName: i,
        pageName: r.name,
        pageGuid: r.guid,
        dependencies: c,
        jsonData: o
        // Store original JSON data for import
      }), t.log(
        `  ${i}: "${r.name}" depends on: ${c.length > 0 ? c.join(", ") : "none"}`
      );
    } catch (a) {
      t.error(
        `Error processing ${i}: ${a instanceof Error ? a.message : String(a)}`
      );
    }
  return n;
}
function ln(e) {
  const n = [], i = [], o = [], a = /* @__PURE__ */ new Map();
  for (const p of e)
    a.set(p.pageName, p);
  const l = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), c = [], d = (p) => {
    if (l.has(p.pageName))
      return !1;
    if (r.has(p.pageName)) {
      const h = c.findIndex(
        ($) => $.pageName === p.pageName
      );
      if (h !== -1) {
        const $ = c.slice(h).concat([p]);
        return i.push($), !0;
      }
      return !1;
    }
    r.add(p.pageName), c.push(p);
    for (const h of p.dependencies) {
      const $ = a.get(h);
      $ && d($);
    }
    return r.delete(p.pageName), c.pop(), l.add(p.pageName), n.push(p), !1;
  };
  for (const p of e)
    l.has(p.pageName) || d(p);
  for (const p of e)
    for (const h of p.dependencies)
      a.has(h) || o.push(
        `Page "${p.pageName}" (${p.fileName}) depends on "${h}" which is not in the import set`
      );
  return { order: n, cycles: i, errors: o };
}
async function cn(e) {
  t.log("=== Building Dependency Graph ===");
  const n = await sn(e);
  t.log("=== Resolving Import Order ===");
  const i = ln(n);
  if (i.cycles.length > 0) {
    t.log(
      `Detected ${i.cycles.length} circular dependency cycle(s):`
    );
    for (const o of i.cycles) {
      const a = o.map((l) => `"${l.pageName}"`).join(" → ");
      t.log(`  Cycle: ${a} → (back to start)`);
    }
    t.log(
      "  Circular dependencies will be handled with deferred instance resolution"
    );
  }
  if (i.errors.length > 0) {
    t.warning(
      `Found ${i.errors.length} missing dependency warning(s):`
    );
    for (const o of i.errors)
      t.warning(`  ${o}`);
  }
  t.log(`Import order determined: ${i.order.length} page(s)`);
  for (let o = 0; o < i.order.length; o++) {
    const a = i.order[o];
    t.log(`  ${o + 1}. ${a.fileName} ("${a.pageName}")`);
  }
  return i;
}
async function dn(e) {
  var M, H, W, E, O, I;
  const { jsonFiles: n } = e;
  if (!n || !Array.isArray(n))
    return {
      type: "importPagesInOrder",
      success: !1,
      error: !0,
      message: "jsonFiles must be an array",
      data: {}
    };
  t.log("=== Determining Import Order ===");
  const {
    order: i,
    cycles: o,
    errors: a
  } = await cn(n);
  a.length > 0 && t.warning(
    `Found ${a.length} dependency warning(s) - some dependencies may be missing`
  ), o.length > 0 && t.log(
    `Detected ${o.length} circular dependency cycle(s) - will use deferred resolution`
  );
  const l = /* @__PURE__ */ new Map();
  if (t.log(
    `Checking collectionChoices: ${e.collectionChoices ? "exists" : "undefined"}`
  ), e.collectionChoices) {
    t.log("=== Pre-creating Collections ==="), t.log(
      `Collection choices: tokens=${e.collectionChoices.tokens}, theme=${e.collectionChoices.theme}, layers=${e.collectionChoices.layers}`
    );
    const B = "recursica:collectionId", x = async (u) => {
      const P = await figma.variables.getLocalVariableCollectionsAsync(), w = new Set(P.map((Z) => Z.name));
      if (!w.has(u))
        return u;
      let V = 1, z = `${u}_${V}`;
      for (; w.has(z); )
        V++, z = `${u}_${V}`;
      return z;
    }, S = [
      { choice: e.collectionChoices.tokens, normalizedName: "Tokens" },
      { choice: e.collectionChoices.theme, normalizedName: "Theme" },
      { choice: e.collectionChoices.layers, normalizedName: "Layer" }
    ];
    for (const { choice: u, normalizedName: P } of S)
      if (u === "new") {
        t.log(
          `Processing collection type: "${P}" (choice: "new") - will create new collection`
        );
        const w = await x(P), V = figma.variables.createVariableCollection(w);
        if (Ge(P)) {
          const z = ft(P);
          z && (V.setSharedPluginData(
            "recursica",
            B,
            z
          ), t.log(
            `  Stored fixed GUID: ${z.substring(0, 8)}...`
          ));
        }
        l.set(P, V), t.log(
          `✓ Pre-created collection: "${w}" (normalized: "${P}", id: ${V.id.substring(0, 8)}...)`
        );
      } else
        t.log(
          `Skipping collection type: "${P}" (choice: "existing")`
        );
    l.size > 0 && t.log(
      `Pre-created ${l.size} collection(s) for reuse across all imports`
    );
  }
  t.log("=== Importing Pages in Order ===");
  let r = 0, c = 0;
  const d = [...a], p = [], h = {
    pageIds: [],
    collectionIds: [],
    variableIds: []
  }, $ = [];
  if (l.size > 0)
    for (const B of l.values())
      h.collectionIds.push(B.id), t.log(
        `Tracking pre-created collection: "${B.name}" (${B.id.substring(0, 8)}...)`
      );
  const y = e.mainFileName;
  for (let B = 0; B < i.length; B++) {
    const x = i[B], S = y ? x.fileName === y : B === i.length - 1;
    t.log(
      `[${B + 1}/${i.length}] Importing ${x.fileName} ("${x.pageName}")${S ? " [MAIN]" : " [DEPENDENCY]"}...`
    );
    try {
      const u = B === 0, P = await Ot({
        jsonData: x.jsonData,
        isMainPage: S,
        clearConsole: u,
        collectionChoices: e.collectionChoices,
        alwaysCreateCopy: !0,
        // Wizard imports always create copies (no prompts)
        skipUniqueNaming: (M = e.skipUniqueNaming) != null ? M : !1,
        constructionIcon: e.constructionIcon || "",
        preCreatedCollections: l
        // Pass pre-created collections for reuse
      });
      if (P.success) {
        if (r++, (H = P.data) != null && H.deferredInstances) {
          const w = P.data.deferredInstances;
          Array.isArray(w) && (t.log(
            `  [DEBUG] Collected ${w.length} deferred instance(s) from ${x.fileName}`
          ), p.push(...w));
        } else
          t.log(
            `  [DEBUG] No deferred instances in response for ${x.fileName}`
          );
        if ((W = P.data) != null && W.createdEntities) {
          const w = P.data.createdEntities;
          w.pageIds && h.pageIds.push(...w.pageIds), w.collectionIds && h.collectionIds.push(...w.collectionIds), w.variableIds && h.variableIds.push(...w.variableIds);
          const V = ((E = w.pageIds) == null ? void 0 : E[0]) || ((O = P.data) == null ? void 0 : O.pageId);
          (I = P.data) != null && I.pageName && V && $.push({
            name: P.data.pageName,
            pageId: V
          });
        }
      } else
        c++, d.push(
          `Failed to import ${x.fileName}: ${P.message || "Unknown error"}`
        );
    } catch (u) {
      c++;
      const P = u instanceof Error ? u.message : String(u);
      d.push(`Failed to import ${x.fileName}: ${P}`);
    }
  }
  let m = 0;
  if (p.length > 0) {
    t.log(
      `=== Resolving ${p.length} Deferred Instance(s) ===`
    );
    try {
      t.log(
        "  Rebuilding variable and collection tables from imported JSON files..."
      );
      const {
        loadAndExpandJson: B,
        loadCollectionTable: x,
        loadVariableTable: S,
        matchAndCreateVariables: u
      } = await Promise.resolve().then(() => Si), P = [], w = [];
      for (const q of i)
        try {
          const Q = B(q.jsonData);
          if (Q.success && Q.expandedJsonData) {
            const te = Q.expandedJsonData, ne = x(te);
            ne.success && ne.collectionTable && w.push(ne.collectionTable);
            const K = S(te);
            K.success && K.variableTable && P.push(K.variableTable);
          }
        } catch (Q) {
          t.warning(
            `  Could not load tables from ${q.fileName}: ${Q}`
          );
        }
      let V = null, z = null;
      P.length > 0 && (V = P[P.length - 1], t.log(
        `  Using variable table with ${V.getSize()} variable(s)`
      )), w.length > 0 && (z = w[w.length - 1], t.log(
        `  Using collection table with ${z.getSize()} collection(s)`
      ));
      const Z = /* @__PURE__ */ new Map();
      if (z) {
        const q = await figma.variables.getLocalVariableCollectionsAsync(), Q = /* @__PURE__ */ new Map();
        for (const ne of q) {
          const K = Oe(ne.name);
          Q.set(K, ne);
        }
        const te = z.getTable();
        for (const [ne, K] of Object.entries(
          te
        )) {
          const J = K, U = Oe(
            J.collectionName
          ), j = Q.get(U);
          j ? (Z.set(ne, j), t.log(
            `  Matched collection table index ${ne} ("${J.collectionName}") to collection "${j.name}"`
          )) : t.warning(
            `  Could not find collection for table index ${ne} ("${J.collectionName}")`
          );
        }
      }
      let k = /* @__PURE__ */ new Map();
      if (V && z) {
        const { recognizedVariables: q } = await u(
          V,
          z,
          Z,
          []
          // newlyCreatedCollections - empty since they're already created
        );
        k = q, t.log(
          `  Built recognizedVariables map with ${k.size} variable(s)`
        );
      } else
        t.warning(
          "  Could not build recognizedVariables map - variable or collection table missing"
        );
      const L = await xt(
        p,
        e.constructionIcon || "",
        k,
        V || null,
        z || null,
        Z
      );
      t.log(
        `  Resolved: ${L.resolved}, Failed: ${L.failed}`
      ), L.errors.length > 0 && (d.push(...L.errors), m = L.failed);
    } catch (B) {
      const x = `Failed to resolve deferred instances: ${B instanceof Error ? B.message : String(B)}`;
      d.push(x), m = p.length;
    }
  }
  const b = Array.from(
    new Set(h.collectionIds)
  ), s = Array.from(
    new Set(h.variableIds)
  ), v = Array.from(new Set(h.pageIds));
  if (t.log("=== Import Summary ==="), t.log(
    `  Imported: ${r}, Failed: ${c}, Deferred instances: ${p.length}, Deferred resolution failed: ${m}`
  ), t.log(
    `  Collections in allCreatedEntityIds: ${h.collectionIds.length}, Unique: ${b.length}`
  ), b.length > 0) {
    t.log(`  Created ${b.length} collection(s)`);
    for (const B of b)
      try {
        const x = await figma.variables.getVariableCollectionByIdAsync(B);
        x && t.log(
          `    - "${x.name}" (${B.substring(0, 8)}...)`
        );
      } catch (x) {
      }
  }
  const g = c === 0 && m === 0, C = g ? `Successfully imported ${r} page(s)${p.length > 0 ? ` (${p.length} deferred instance(s) resolved)` : ""}` : `Import completed with ${c} failure(s). ${d.join("; ")}`;
  return {
    type: "importPagesInOrder",
    success: g,
    error: !g,
    message: C,
    data: {
      imported: r,
      failed: c,
      deferred: p.length,
      errors: d,
      importedPages: $,
      createdEntities: {
        pageIds: v,
        collectionIds: b,
        variableIds: s
      }
    }
  };
}
async function Ni(e) {
  try {
    await figma.loadAllPagesAsync();
    const n = figma.root.children;
    console.log("Found " + n.length + " pages in the document");
    const i = 11, o = n[i];
    if (!o)
      return {
        type: "quickCopy",
        success: !1,
        error: !0,
        message: "No page found at index 11",
        data: {}
      };
    const a = await ht(
      o,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + o.name + " (index: " + i + ")"
    );
    const l = JSON.stringify(a, null, 2), r = JSON.parse(l), c = "Copy - " + r.name, d = figma.createPage();
    if (d.name = c, figma.root.appendChild(d), r.children && r.children.length > 0) {
      let $ = function(m) {
        m.forEach((b) => {
          const s = (b.x || 0) + (b.width || 0);
          s > y && (y = s), b.children && b.children.length > 0 && $(b.children);
        });
      };
      console.log(
        "Recreating " + r.children.length + " top-level children..."
      );
      let y = 0;
      $(r.children), console.log("Original content rightmost edge: " + y);
      for (const m of r.children)
        await Xe(m, d, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const p = ut(r);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: r.name,
        newPageName: c,
        totalNodes: p
      }
    };
  } catch (n) {
    return console.error("Error performing quick copy:", n), {
      type: "quickCopy",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Ci(e) {
  try {
    const n = e.accessToken, i = e.selectedRepo;
    return n ? (await figma.clientStorage.setAsync("accessToken", n), i && await figma.clientStorage.setAsync("selectedRepo", i), e.hasWriteAccess !== void 0 && await figma.clientStorage.setAsync("hasWriteAccess", e.hasWriteAccess), {
      type: "storeAuthData",
      success: !0,
      error: !1,
      message: "Auth data stored successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    }) : {
      type: "storeAuthData",
      success: !1,
      error: !0,
      message: "Access token is required",
      data: {}
    };
  } catch (n) {
    return {
      type: "storeAuthData",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Ei(e) {
  try {
    const n = await figma.clientStorage.getAsync("accessToken"), i = await figma.clientStorage.getAsync("selectedRepo"), o = await figma.clientStorage.getAsync("hasWriteAccess");
    return {
      type: "loadAuthData",
      success: !0,
      error: !1,
      message: "Auth data loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        accessToken: n || void 0,
        selectedRepo: i || void 0,
        hasWriteAccess: o != null ? o : void 0
      }
    };
  } catch (n) {
    return {
      type: "loadAuthData",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Ii(e) {
  try {
    return await figma.clientStorage.deleteAsync("accessToken"), await figma.clientStorage.deleteAsync("selectedRepo"), await figma.clientStorage.deleteAsync("hasWriteAccess"), {
      type: "clearAuthData",
      success: !0,
      error: !1,
      message: "Auth data cleared successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    };
  } catch (n) {
    return {
      type: "clearAuthData",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function wi(e) {
  try {
    return await figma.clientStorage.setAsync("importData", e.importData), {
      type: "storeImportData",
      success: !0,
      error: !1,
      message: "Import data stored successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    };
  } catch (n) {
    return {
      type: "storeImportData",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Ai(e) {
  try {
    return {
      type: "loadImportData",
      success: !0,
      error: !1,
      message: "Import data loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        importData: await figma.clientStorage.getAsync("importData") || void 0
      }
    };
  } catch (n) {
    return {
      type: "loadImportData",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Pi(e) {
  try {
    return await figma.clientStorage.deleteAsync("importData"), {
      type: "clearImportData",
      success: !0,
      error: !1,
      message: "Import data cleared successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    };
  } catch (n) {
    return {
      type: "clearImportData",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Ti(e) {
  try {
    const n = e.selectedRepo;
    return n ? (await figma.clientStorage.setAsync("selectedRepo", n), {
      type: "storeSelectedRepo",
      success: !0,
      error: !1,
      message: "Selected repo stored successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    }) : {
      type: "storeSelectedRepo",
      success: !1,
      error: !0,
      message: "Selected repo is required",
      data: {}
    };
  } catch (n) {
    return {
      type: "storeSelectedRepo",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
function Pe(e, n = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: n
  };
}
function Me(e, n, i = {}) {
  const o = n instanceof Error ? n.message : n;
  return {
    type: e,
    success: !1,
    error: !0,
    message: o,
    data: i
  };
}
const gn = "RecursicaPublishedMetadata";
async function Oi(e) {
  try {
    const n = figma.currentPage;
    await figma.loadAllPagesAsync();
    const o = figma.root.children.findIndex(
      (c) => c.id === n.id
    ), a = n.getPluginData(gn);
    if (!a) {
      const p = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: gt(n.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: o
      };
      return Pe("getComponentMetadata", p);
    }
    const r = {
      componentMetadata: JSON.parse(a),
      currentPageIndex: o
    };
    return Pe("getComponentMetadata", r);
  } catch (n) {
    return console.error("Error getting component metadata:", n), Me(
      "getComponentMetadata",
      n instanceof Error ? n : "Unknown error occurred"
    );
  }
}
async function xi(e) {
  try {
    await figma.loadAllPagesAsync();
    const n = figma.root.children, i = [];
    for (const a of n) {
      if (a.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${a.name} (type: ${a.type})`
        );
        continue;
      }
      const l = a, r = l.getPluginData(gn);
      if (r)
        try {
          const c = JSON.parse(r);
          i.push(c);
        } catch (c) {
          console.warn(
            `Failed to parse metadata for page "${l.name}":`,
            c
          );
          const p = {
            _ver: 1,
            id: "",
            name: gt(l.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          i.push(p);
        }
      else {
        const d = {
          _ver: 1,
          id: "",
          name: gt(l.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        i.push(d);
      }
    }
    return Pe("getAllComponents", {
      components: i
    });
  } catch (n) {
    return console.error("Error getting all components:", n), Me(
      "getAllComponents",
      n instanceof Error ? n : "Unknown error occurred"
    );
  }
}
async function Vi(e) {
  try {
    const n = e.requestId, i = e.action;
    return !n || !i ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (tt.handleResponse({ requestId: n, action: i }), {
      type: "pluginPromptResponse",
      success: !0,
      error: !1,
      message: "Prompt response handled successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    });
  } catch (n) {
    return {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Ri(e) {
  try {
    const { pageId: n } = e;
    await figma.loadAllPagesAsync();
    const i = await figma.getNodeByIdAsync(n);
    return !i || i.type !== "PAGE" ? {
      type: "switchToPage",
      success: !1,
      error: !0,
      message: `Page with ID ${n.substring(0, 8)}... not found`,
      data: {}
    } : (await figma.setCurrentPageAsync(i), {
      type: "switchToPage",
      success: !0,
      error: !1,
      message: `Switched to page "${i.name}"`,
      data: {
        pageName: i.name
      }
    });
  } catch (n) {
    return {
      type: "switchToPage",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
const xe = "RecursicaPrimaryImport", Ce = "RecursicaUnderReview", fn = "---", pn = "---", Re = "RecursicaImportDivider", Qe = "start", et = "end", Fe = "⚠️";
async function Mi(e) {
  try {
    await figma.loadAllPagesAsync();
    const n = figma.root.children;
    for (const o of n) {
      if (o.type !== "PAGE")
        continue;
      const a = o.getPluginData(xe);
      if (a)
        try {
          const r = JSON.parse(a), c = {
            exists: !0,
            pageId: o.id,
            metadata: r
          };
          return Pe(
            "checkForExistingPrimaryImport",
            c
          );
        } catch (r) {
          t.warning(
            `Failed to parse primary import metadata on page "${o.name}": ${r}`
          );
          continue;
        }
      if (o.getPluginData(Ce) === "true") {
        const r = o.getPluginData(xe);
        if (r)
          try {
            const c = JSON.parse(r), d = {
              exists: !0,
              pageId: o.id,
              metadata: c
            };
            return Pe(
              "checkForExistingPrimaryImport",
              d
            );
          } catch (c) {
          }
        else
          t.warning(
            `Found page "${o.name}" marked as under review but missing primary import metadata`
          );
      }
    }
    return Pe("checkForExistingPrimaryImport", {
      exists: !1
    });
  } catch (n) {
    return console.error("Error checking for existing primary import:", n), Me(
      "checkForExistingPrimaryImport",
      n instanceof Error ? n : "Unknown error occurred"
    );
  }
}
async function ki(e) {
  try {
    await figma.loadAllPagesAsync();
    const n = figma.root.children.find(
      (c) => c.type === "PAGE" && c.getPluginData(Re) === Qe
    ), i = figma.root.children.find(
      (c) => c.type === "PAGE" && c.getPluginData(Re) === et
    );
    if (n && i) {
      const c = {
        startDividerId: n.id,
        endDividerId: i.id
      };
      return Pe("createImportDividers", c);
    }
    const o = figma.createPage();
    o.name = fn, o.setPluginData(Re, Qe), o.setPluginData(Ce, "true");
    const a = figma.createPage();
    a.name = pn, a.setPluginData(Re, et), a.setPluginData(Ce, "true");
    const l = figma.root.children.indexOf(o);
    figma.root.insertChild(l + 1, a), t.log("Created import dividers");
    const r = {
      startDividerId: o.id,
      endDividerId: a.id
    };
    return Pe("createImportDividers", r);
  } catch (n) {
    return console.error("Error creating import dividers:", n), Me(
      "createImportDividers",
      n instanceof Error ? n : "Unknown error occurred"
    );
  }
}
async function Ui(e) {
  var n, i, o, a, l, r, c, d, p, h, $, y;
  try {
    t.log("=== Starting Single Component Import ==="), t.log("Creating start divider..."), await figma.loadAllPagesAsync();
    let m = figma.root.children.find(
      (k) => k.type === "PAGE" && k.getPluginData(Re) === Qe
    );
    m || (m = figma.createPage(), m.name = fn, m.setPluginData(Re, Qe), m.setPluginData(Ce, "true"), t.log("Created start divider"));
    const s = [
      ...e.dependencies.filter(
        (k) => !k.useExisting
      ).map((k) => ({
        fileName: `${k.name}.json`,
        jsonData: k.jsonData
      })),
      {
        fileName: `${e.mainComponent.name}.json`,
        jsonData: e.mainComponent.jsonData
      }
    ];
    t.log(
      `Importing ${s.length} file(s) in dependency order...`
    );
    const v = await dn({
      jsonFiles: s,
      mainFileName: `${e.mainComponent.name}.json`,
      collectionChoices: {
        tokens: e.wizardSelections.tokensCollection,
        theme: e.wizardSelections.themeCollection,
        layers: e.wizardSelections.layersCollection
      },
      skipUniqueNaming: !0,
      // Don't add _<number> suffix for wizard imports
      constructionIcon: Fe
      // Add construction icon to page names
    });
    if (!v.success)
      throw new Error(
        v.message || "Failed to import pages in order"
      );
    await figma.loadAllPagesAsync();
    const g = figma.root.children;
    let C = g.find(
      (k) => k.type === "PAGE" && k.getPluginData(Re) === et
    );
    if (!C) {
      C = figma.createPage(), C.name = pn, C.setPluginData(
        Re,
        et
      ), C.setPluginData(Ce, "true");
      let k = g.length;
      for (let L = g.length - 1; L >= 0; L--) {
        const q = g[L];
        if (q.type === "PAGE" && q.getPluginData(Re) !== Qe && q.getPluginData(Re) !== et) {
          k = L + 1;
          break;
        }
      }
      figma.root.insertChild(k, C), t.log("Created end divider");
    }
    t.log(
      `Import result data structure: ${JSON.stringify(Object.keys(v.data || {}))}`
    );
    const M = v.data;
    if (t.log(
      `Import result has createdEntities: ${!!(M != null && M.createdEntities)}`
    ), M != null && M.createdEntities ? (t.log(
      `  Collection IDs: ${((n = M.createdEntities.collectionIds) == null ? void 0 : n.length) || 0}`
    ), (i = M.createdEntities.collectionIds) != null && i.length && t.log(
      `  Collection IDs: ${M.createdEntities.collectionIds.map((k) => k.substring(0, 8) + "...").join(", ")}`
    ), t.log(
      `  Variable IDs: ${((o = M.createdEntities.variableIds) == null ? void 0 : o.length) || 0}`
    ), t.log(
      `  Page IDs: ${((a = M.createdEntities.pageIds) == null ? void 0 : a.length) || 0}`
    )) : t.warning(
      "Import result does not have createdEntities - cleanup may not work correctly"
    ), !(M != null && M.importedPages) || M.importedPages.length === 0)
      throw new Error("No pages were imported");
    const H = "RecursicaPublishedMetadata", W = e.mainComponent.guid;
    t.log(
      `Looking for main page by GUID: ${W.substring(0, 8)}...`
    );
    let E, O = null;
    for (const k of M.importedPages)
      try {
        const L = await figma.getNodeByIdAsync(
          k.pageId
        );
        if (L && L.type === "PAGE") {
          const q = L.getPluginData(H);
          if (q)
            try {
              if (JSON.parse(q).id === W) {
                E = k.pageId, O = L, t.log(
                  `Found main page by GUID: "${L.name}" (ID: ${k.pageId.substring(0, 12)}...)`
                );
                break;
              }
            } catch (Q) {
            }
        }
      } catch (L) {
        t.warning(
          `Error checking page ${k.pageId}: ${L}`
        );
      }
    if (!E) {
      t.log(
        "Main page not found in importedPages list, searching all pages by GUID..."
      ), await figma.loadAllPagesAsync();
      const k = figma.root.children;
      for (const L of k)
        if (L.type === "PAGE") {
          const q = L.getPluginData(H);
          if (q)
            try {
              if (JSON.parse(q).id === W) {
                E = L.id, O = L, t.log(
                  `Found main page by GUID in all pages: "${L.name}" (ID: ${L.id.substring(0, 12)}...)`
                );
                break;
              }
            } catch (Q) {
            }
        }
    }
    if (!E || !O) {
      t.error(
        `Failed to find imported main page by GUID: ${W.substring(0, 8)}...`
      ), t.log("Imported pages were:");
      for (const k of M.importedPages)
        t.log(
          `  - "${k.name}" (ID: ${k.pageId.substring(0, 12)}...)`
        );
      throw new Error("Failed to find imported main page ID");
    }
    if (!O || O.type !== "PAGE")
      throw new Error("Failed to get main page node");
    for (const k of M.importedPages)
      try {
        const L = await figma.getNodeByIdAsync(
          k.pageId
        );
        if (L && L.type === "PAGE") {
          L.setPluginData(Ce, "true");
          const q = L.name.replace(/_\d+$/, "");
          if (!q.startsWith(Fe))
            L.name = `${Fe} ${q}`;
          else {
            const Q = q.replace(Fe, "").trim();
            L.name = `${Fe} ${Q}`;
          }
        }
      } catch (L) {
        t.warning(
          `Failed to mark page ${k.pageId} as under review: ${L}`
        );
      }
    await figma.loadAllPagesAsync();
    const I = figma.root.children, B = I.find(
      (k) => k.type === "PAGE" && (k.name === "REMOTES" || k.name === `${Fe} REMOTES`)
    );
    B && (B.setPluginData(Ce, "true"), B.name.startsWith(Fe) || (B.name = `${Fe} REMOTES`), t.log(
      "Marked REMOTES page as under review and ensured construction icon"
    ));
    const x = I.find(
      (k) => k.type === "PAGE" && k.getPluginData(Re) === Qe
    ), S = I.find(
      (k) => k.type === "PAGE" && k.getPluginData(Re) === et
    );
    if (x && S) {
      const k = I.indexOf(x), L = I.indexOf(S);
      for (let q = k + 1; q < L; q++) {
        const Q = I[q];
        Q.type === "PAGE" && Q.getPluginData(Ce) !== "true" && (Q.setPluginData(Ce, "true"), t.log(
          `Marked page "${Q.name}" as under review (found between dividers)`
        ));
      }
    }
    const u = [], P = [];
    if (t.log(
      `[EXTRACTION] Starting collection extraction. Collection IDs in result: ${((r = (l = M == null ? void 0 : M.createdEntities) == null ? void 0 : l.collectionIds) == null ? void 0 : r.length) || 0}`
    ), (c = M == null ? void 0 : M.createdEntities) != null && c.collectionIds) {
      t.log(
        `[EXTRACTION] Collection IDs to process: ${M.createdEntities.collectionIds.map((k) => k.substring(0, 8) + "...").join(", ")}`
      );
      for (const k of M.createdEntities.collectionIds)
        try {
          const L = await figma.variables.getVariableCollectionByIdAsync(k);
          L ? (u.push({
            collectionId: L.id,
            collectionName: L.name
          }), t.log(
            `[EXTRACTION] ✓ Extracted collection: "${L.name}" (${k.substring(0, 8)}...)`
          )) : (u.push({
            collectionId: k,
            collectionName: `Unknown (${k.substring(0, 8)}...)`
          }), t.warning(
            `[EXTRACTION] Collection ${k.substring(0, 8)}... not found - will still track for cleanup`
          ));
        } catch (L) {
          u.push({
            collectionId: k,
            collectionName: `Unknown (${k.substring(0, 8)}...)`
          }), t.warning(
            `[EXTRACTION] Failed to get collection ${k.substring(0, 8)}...: ${L} - will still track for cleanup`
          );
        }
    } else
      t.warning(
        "[EXTRACTION] No collectionIds found in importResultData.createdEntities"
      );
    if (t.log(
      `[EXTRACTION] Total collections extracted: ${u.length}`
    ), u.length > 0 && t.log(
      `[EXTRACTION] Extracted collections: ${u.map((k) => `"${k.collectionName}" (${k.collectionId.substring(0, 8)}...)`).join(", ")}`
    ), (d = M == null ? void 0 : M.createdEntities) != null && d.variableIds) {
      t.log(
        `[EXTRACTION] Processing ${M.createdEntities.variableIds.length} variable ID(s)...`
      );
      for (const k of M.createdEntities.variableIds)
        try {
          const L = await figma.variables.getVariableByIdAsync(k);
          if (L && L.resolvedType) {
            const q = await figma.variables.getVariableCollectionByIdAsync(
              L.variableCollectionId
            );
            q ? P.push({
              variableId: L.id,
              variableName: L.name,
              collectionId: L.variableCollectionId,
              collectionName: q.name
            }) : P.push({
              variableId: L.id,
              variableName: L.name,
              collectionId: L.variableCollectionId,
              collectionName: `Unknown (${L.variableCollectionId.substring(0, 8)}...)`
            });
          }
        } catch (L) {
          t.warning(
            `Failed to get variable ${k}: ${L}`
          );
        }
      t.log(
        `[EXTRACTION] Total variables extracted: ${P.length}`
      );
    } else
      t.warning(
        "[EXTRACTION] No variableIds found in importResultData.createdEntities"
      );
    if (u.length === 0 && ((h = (p = M == null ? void 0 : M.createdEntities) == null ? void 0 : p.collectionIds) != null && h.length)) {
      t.warning(
        "[EXTRACTION] Collection extraction failed, but IDs are available - creating fallback entries"
      );
      for (const k of M.createdEntities.collectionIds)
        u.push({
          collectionId: k,
          collectionName: `Unknown (${k.substring(0, 8)}...)`
        });
    }
    if (P.length === 0 && ((y = ($ = M == null ? void 0 : M.createdEntities) == null ? void 0 : $.variableIds) != null && y.length)) {
      t.warning(
        "[EXTRACTION] Variable extraction failed, but IDs are available - creating fallback entries"
      );
      for (const k of M.createdEntities.variableIds)
        P.push({
          variableId: k,
          variableName: `Unknown (${k.substring(0, 8)}...)`,
          collectionId: "unknown",
          collectionName: "Unknown"
        });
    }
    const w = {
      componentGuid: e.mainComponent.guid,
      componentVersion: e.mainComponent.version,
      componentName: e.mainComponent.name,
      importDate: (/* @__PURE__ */ new Date()).toISOString(),
      wizardSelections: e.wizardSelections,
      variableSummary: e.variableSummary,
      createdCollections: u,
      createdVariables: P,
      importError: void 0
      // No error yet
    };
    t.log(
      `Storing metadata with ${u.length} collection(s) and ${P.length} variable(s)`
    ), O.setPluginData(
      xe,
      JSON.stringify(w)
    ), O.setPluginData(Ce, "true"), t.log(
      "Stored primary import metadata on main page and marked as under review"
    );
    const V = [];
    M.importedPages && V.push(
      ...M.importedPages.map((k) => k.pageId)
    ), t.log("=== Single Component Import Complete ==="), w.importError = void 0, t.log(
      `[METADATA] About to store metadata with ${u.length} collection(s) and ${P.length} variable(s)`
    ), u.length > 0 && t.log(
      `[METADATA] Collections to store: ${u.map((k) => `"${k.collectionName}" (${k.collectionId.substring(0, 8)}...)`).join(", ")}`
    ), O.setPluginData(
      xe,
      JSON.stringify(w)
    ), t.log(
      `[METADATA] Stored metadata: ${u.length} collection(s), ${P.length} variable(s)`
    );
    const z = O.getPluginData(xe);
    if (z)
      try {
        const k = JSON.parse(z);
        t.log(
          `[METADATA] Verification: Stored metadata has ${k.createdCollections.length} collection(s) and ${k.createdVariables.length} variable(s)`
        );
      } catch (k) {
        t.warning("[METADATA] Failed to verify stored metadata");
      }
    const Z = {
      success: !0,
      mainPageId: O.id,
      importedPageIds: V,
      createdCollections: u,
      createdVariables: P
    };
    return Pe("importSingleComponentWithWizard", Z);
  } catch (m) {
    const b = m instanceof Error ? m.message : "Unknown error occurred";
    t.error(`Import failed: ${b}`);
    try {
      await figma.loadAllPagesAsync();
      const s = figma.root.children;
      let v = null;
      for (const g of s) {
        if (g.type !== "PAGE") continue;
        const C = g.getPluginData(xe);
        if (C)
          try {
            if (JSON.parse(C).componentGuid === e.mainComponent.guid) {
              v = g;
              break;
            }
          } catch (M) {
          }
      }
      if (v) {
        const g = v.getPluginData(xe);
        if (g)
          try {
            const C = JSON.parse(g);
            t.log(
              `[CATCH] Found existing metadata with ${C.createdCollections.length} collection(s) and ${C.createdVariables.length} variable(s)`
            ), C.importError = b, v.setPluginData(
              xe,
              JSON.stringify(C)
            ), t.log(
              `[CATCH] Updated existing metadata with error. Collections: ${C.createdCollections.length}, Variables: ${C.createdVariables.length}`
            );
          } catch (C) {
            t.warning(`[CATCH] Failed to update metadata: ${C}`);
          }
      } else {
        t.log(
          "No existing metadata found, attempting to collect created entities for cleanup..."
        );
        const g = [];
        for (const H of s) {
          if (H.type !== "PAGE") continue;
          H.getPluginData(Ce) === "true" && g.push(H);
        }
        const C = [];
        if (e.wizardSelections) {
          const H = await figma.variables.getLocalVariableCollectionsAsync(), W = [
            {
              choice: e.wizardSelections.tokensCollection,
              normalizedName: "Tokens"
            },
            {
              choice: e.wizardSelections.themeCollection,
              normalizedName: "Theme"
            },
            {
              choice: e.wizardSelections.layersCollection,
              normalizedName: "Layer"
            }
          ];
          for (const { choice: E, normalizedName: O } of W)
            if (E === "new") {
              const I = H.filter((B) => Oe(B.name) === O);
              if (I.length > 0) {
                const B = I[0];
                C.push({
                  collectionId: B.id,
                  collectionName: B.name
                }), t.log(
                  `Found created collection: "${B.name}" (${B.id.substring(0, 8)}...)`
                );
              }
            }
        }
        const M = [];
        if (g.length > 0) {
          const H = g[0], W = {
            componentGuid: e.mainComponent.guid,
            componentVersion: e.mainComponent.version,
            componentName: e.mainComponent.name,
            importDate: (/* @__PURE__ */ new Date()).toISOString(),
            wizardSelections: e.wizardSelections,
            variableSummary: e.variableSummary || {
              tokens: { existing: 0, new: 0 },
              theme: { existing: 0, new: 0 },
              layers: { existing: 0, new: 0 }
            },
            createdCollections: C,
            createdVariables: M,
            importError: b
          };
          H.setPluginData(
            xe,
            JSON.stringify(W)
          ), t.log(
            `Created fallback metadata with ${C.length} collection(s) and error information`
          );
        }
      }
    } catch (s) {
      t.warning(
        `Failed to store error metadata: ${s instanceof Error ? s.message : String(s)}`
      );
    }
    return Me(
      "importSingleComponentWithWizard",
      m instanceof Error ? m : new Error(String(m))
    );
  }
}
async function mn(e) {
  try {
    t.log("=== Starting Import Group Deletion ==="), await figma.loadAllPagesAsync();
    const n = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!n || n.type !== "PAGE")
      throw new Error("Main page not found");
    const i = n.getPluginData(xe);
    if (!i)
      throw new Error("Primary import metadata not found on page");
    const o = JSON.parse(i);
    t.log(
      `Found metadata: ${o.createdCollections.length} collection(s), ${o.createdVariables.length} variable(s) to delete`
    ), await figma.loadAllPagesAsync();
    const a = figma.root.children, l = [];
    for (const y of a) {
      if (y.type !== "PAGE")
        continue;
      y.getPluginData(Ce) === "true" && (l.push(y), t.log(`Found page to delete: "${y.name}" (under review)`));
    }
    t.log(
      `Deleting ${o.createdVariables.length} variable(s) from existing collections...`
    );
    let r = 0;
    for (const y of o.createdVariables)
      try {
        const m = await figma.variables.getVariableByIdAsync(
          y.variableId
        );
        m ? (m.remove(), r++, t.log(
          `Deleted variable: ${y.variableName} from collection ${y.collectionName}`
        )) : t.warning(
          `Variable ${y.variableName} (${y.variableId}) not found - may have already been deleted`
        );
      } catch (m) {
        t.warning(
          `Failed to delete variable ${y.variableName}: ${m instanceof Error ? m.message : String(m)}`
        );
      }
    t.log(
      `Deleting ${o.createdCollections.length} collection(s)...`
    );
    let c = 0;
    for (const y of o.createdCollections)
      try {
        const m = await figma.variables.getVariableCollectionByIdAsync(
          y.collectionId
        );
        m ? (m.remove(), c++, t.log(
          `Deleted collection: ${y.collectionName} (${y.collectionId})`
        )) : t.warning(
          `Collection ${y.collectionName} (${y.collectionId}) not found - may have already been deleted`
        );
      } catch (m) {
        t.warning(
          `Failed to delete collection ${y.collectionName}: ${m instanceof Error ? m.message : String(m)}`
        );
      }
    const d = l.map((y) => ({
      page: y,
      name: y.name,
      id: y.id
    })), p = figma.currentPage;
    if (d.some(
      (y) => y.id === p.id
    )) {
      await figma.loadAllPagesAsync();
      const m = figma.root.children.find(
        (b) => b.type === "PAGE" && !d.some((s) => s.id === b.id)
      );
      m ? (await figma.setCurrentPageAsync(m), t.log(
        `Switched away from page "${p.name}" before deletion`
      )) : t.warning(
        "No safe page to switch to - all pages are being deleted"
      );
    }
    for (const { page: y, name: m } of d)
      try {
        let b = !1;
        try {
          await figma.loadAllPagesAsync(), b = figma.root.children.some((v) => v.id === y.id);
        } catch (s) {
          b = !1;
        }
        if (!b) {
          t.log(`Page "${m}" already deleted, skipping`);
          continue;
        }
        if (figma.currentPage.id === y.id) {
          await figma.loadAllPagesAsync();
          const v = figma.root.children.find(
            (g) => g.type === "PAGE" && g.id !== y.id && !d.some((C) => C.id === g.id)
          );
          v && await figma.setCurrentPageAsync(v);
        }
        y.remove(), t.log(`Deleted page: "${m}"`);
      } catch (b) {
        t.warning(
          `Failed to delete page "${m}": ${b instanceof Error ? b.message : String(b)}`
        );
      }
    t.log("=== Import Group Deletion Complete ===");
    const $ = {
      success: !0,
      deletedPages: l.length,
      deletedCollections: c,
      deletedVariables: r
    };
    return Pe("deleteImportGroup", $);
  } catch (n) {
    const i = n instanceof Error ? n.message : "Unknown error occurred";
    return t.error(`Delete failed: ${i}`), Me(
      "deleteImportGroup",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function Li(e) {
  try {
    t.log("=== Cleaning up failed import ==="), await figma.loadAllPagesAsync();
    const n = figma.root.children, i = "RecursicaPublishedMetadata", o = "RecursicaCreatedEntities";
    let a = !1;
    for (const b of n) {
      if (b.type !== "PAGE")
        continue;
      if (b.getPluginData(o)) {
        a = !0;
        break;
      }
    }
    if (a)
      t.log(
        "Found pages with RecursicaCreatedEntities, using new cleanup logic"
      );
    else {
      let b = null;
      for (const s of n) {
        if (s.type !== "PAGE")
          continue;
        if (s.getPluginData(xe)) {
          b = s;
          break;
        }
      }
      if (b)
        return t.log(
          "Found page with PRIMARY_IMPORT_KEY (old system), using deleteImportGroup"
        ), await mn({ pageId: b.id });
      t.log(
        "No primary metadata found, looking for pages with UNDER_REVIEW_KEY or PAGE_METADATA_KEY"
      );
    }
    const l = [], r = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set();
    t.log(
      `Scanning ${n.length} page(s) for created entities...`
    );
    for (const b of n) {
      if (b.type !== "PAGE")
        continue;
      const s = b.getPluginData(o);
      if (s)
        try {
          const v = JSON.parse(s);
          if (v.collectionIds) {
            for (const g of v.collectionIds)
              r.add(g);
            t.log(
              `  Found ${v.collectionIds.length} collection ID(s) on page "${b.name}"`
            );
          }
          if (v.variableIds) {
            for (const g of v.variableIds)
              c.add(g);
            t.log(
              `  Found ${v.variableIds.length} variable ID(s) on page "${b.name}"`
            );
          }
        } catch (v) {
          t.warning(
            `  Failed to parse created entities from page "${b.name}": ${v}`
          );
        }
    }
    t.log(
      `Scanning ${n.length} page(s) for pages to delete...`
    );
    for (const b of n) {
      if (b.type !== "PAGE")
        continue;
      const s = b.getPluginData(Ce), v = b.getPluginData(i), g = b.getPluginData(o);
      if (t.log(
        `  Checking page "${b.name}": underReview=${s === "true"}, hasMetadata=${!!v}, hasCreatedEntities=${!!g}`
      ), s === "true" || v)
        if (l.push({ id: b.id, name: b.name }), t.log(
          `Found page to delete: "${b.name}" (underReview: ${s === "true"}, hasMetadata: ${!!v})`
        ), g)
          try {
            const C = JSON.parse(g);
            if (C.pageIds) {
              for (const M of C.pageIds)
                if (!l.some((H) => H.id === M)) {
                  const H = await figma.getNodeByIdAsync(
                    M
                  );
                  if (H && H.type === "PAGE") {
                    l.push({
                      id: H.id,
                      name: H.name
                    }), t.log(
                      `  Added additional page from createdEntities.pageIds: "${H.name}"`
                    );
                    const W = H.getPluginData(o);
                    if (W)
                      try {
                        const E = JSON.parse(
                          W
                        );
                        if (E.collectionIds) {
                          for (const O of E.collectionIds)
                            r.add(O);
                          t.log(
                            `  Extracted ${E.collectionIds.length} collection ID(s) from additional page "${H.name}"`
                          );
                        }
                        if (E.variableIds) {
                          for (const O of E.variableIds)
                            c.add(O);
                          t.log(
                            `  Extracted ${E.variableIds.length} variable ID(s) from additional page "${H.name}"`
                          );
                        }
                      } catch (E) {
                        t.warning(
                          `  Failed to parse created entities from additional page "${H.name}": ${E}`
                        );
                      }
                  }
                }
            }
            if (C.collectionIds) {
              for (const M of C.collectionIds)
                r.add(M);
              t.log(
                `  Extracted ${C.collectionIds.length} collection ID(s) from page "${b.name}": ${C.collectionIds.map((M) => M.substring(0, 8) + "...").join(", ")}`
              );
            } else
              t.log(
                `  No collectionIds found in createdEntities for page "${b.name}"`
              );
            if (C.variableIds) {
              for (const M of C.variableIds)
                c.add(M);
              t.log(
                `  Extracted ${C.variableIds.length} variable ID(s) from page "${b.name}": ${C.variableIds.map((M) => M.substring(0, 8) + "...").join(", ")}`
              );
            } else
              t.log(
                `  No variableIds found in createdEntities for page "${b.name}"`
              );
          } catch (C) {
            t.warning(
              `  Failed to parse created entities from page "${b.name}": ${C}`
            ), t.warning(
              `  Created entities string: ${g.substring(0, 200)}...`
            );
          }
        else
          t.log(
            `  No created entities data found on page "${b.name}"`
          );
    }
    t.log(
      `Cleanup summary: Found ${l.length} page(s) to delete, ${r.size} collection(s) to delete, ${c.size} variable(s) to delete`
    );
    const d = figma.currentPage;
    if (l.some(
      (b) => b.id === d.id
    )) {
      await figma.loadAllPagesAsync();
      const s = figma.root.children.find(
        (v) => v.type === "PAGE" && !l.some((g) => g.id === v.id)
      );
      s && (await figma.setCurrentPageAsync(s), t.log(
        `Switched away from page "${d.name}" before deletion`
      ));
    }
    let h = 0;
    for (const b of l)
      try {
        await figma.loadAllPagesAsync();
        const s = await figma.getNodeByIdAsync(
          b.id
        );
        if (!s || s.type !== "PAGE")
          continue;
        if (figma.currentPage.id === s.id) {
          await figma.loadAllPagesAsync();
          const g = figma.root.children.find(
            (C) => C.type === "PAGE" && C.id !== s.id && !l.some((M) => M.id === C.id)
          );
          g && await figma.setCurrentPageAsync(g);
        }
        s.remove(), h++, t.log(`Deleted page: "${b.name}"`);
      } catch (s) {
        t.warning(
          `Failed to delete page "${b.name}" (${b.id.substring(0, 8)}...): ${s instanceof Error ? s.message : String(s)}`
        );
      }
    let $ = 0, y = 0;
    for (const b of c)
      try {
        const s = await figma.variables.getVariableByIdAsync(b);
        if (s) {
          const v = s.variableCollectionId;
          r.has(v) || (s.remove(), y++, t.log(
            `Deleted variable: ${s.name} (${b.substring(0, 8)}...)`
          ));
        }
      } catch (s) {
        t.warning(
          `Could not delete variable ${b.substring(0, 8)}...: ${s instanceof Error ? s.message : String(s)}`
        );
      }
    for (const b of r)
      try {
        const s = await figma.variables.getVariableCollectionByIdAsync(b);
        s && (s.remove(), $++, t.log(
          `Deleted collection: "${s.name}" (${b.substring(0, 8)}...)`
        ));
      } catch (s) {
        t.warning(
          `Could not delete collection ${b.substring(0, 8)}...: ${s instanceof Error ? s.message : String(s)}`
        );
      }
    return t.log("=== Failed Import Cleanup Complete ==="), Pe("cleanupFailedImport", {
      success: !0,
      deletedPages: h,
      deletedCollections: $,
      deletedVariables: y
    });
  } catch (n) {
    const i = n instanceof Error ? n.message : "Unknown error occurred";
    return t.error(`Cleanup failed: ${i}`), Me(
      "cleanupFailedImport",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function Fi(e) {
  try {
    t.log("=== Clearing Import Metadata ==="), await figma.loadAllPagesAsync();
    const n = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!n || n.type !== "PAGE")
      throw new Error("Page not found");
    n.setPluginData(xe, ""), n.setPluginData(Ce, "");
    const i = figma.root.children;
    for (const a of i)
      if (a.type === "PAGE" && a.getPluginData(Ce) === "true") {
        const r = a.getPluginData(xe);
        if (r)
          try {
            JSON.parse(r), a.setPluginData(Ce, "");
          } catch (c) {
            a.setPluginData(Ce, "");
          }
        else
          a.setPluginData(Ce, "");
      }
    return t.log("Cleared import metadata from page and related pages"), Pe("clearImportMetadata", {
      success: !0
    });
  } catch (n) {
    const i = n instanceof Error ? n.message : "Unknown error occurred";
    return t.error(`Clear metadata failed: ${i}`), Me(
      "clearImportMetadata",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function Bi(e) {
  try {
    t.log("=== Summarizing Variables for Wizard ===");
    const n = [];
    for (const { fileName: m, jsonData: b } of e.jsonFiles)
      try {
        const s = yt(b);
        if (!s.success || !s.expandedJsonData) {
          t.warning(
            `Skipping ${m} - failed to expand JSON: ${s.error || "Unknown error"}`
          );
          continue;
        }
        const v = s.expandedJsonData;
        if (!v.collections)
          continue;
        const C = ot.fromTable(
          v.collections
        );
        if (!v.variables)
          continue;
        const H = rt.fromTable(v.variables).getTable();
        for (const W of Object.values(H)) {
          if (W._colRef === void 0)
            continue;
          const E = C.getCollectionByIndex(
            W._colRef
          );
          if (E) {
            const I = Oe(
              E.collectionName
            ).toLowerCase();
            (I === "tokens" || I === "theme" || I === "layer") && n.push({
              name: W.variableName,
              collectionName: I
              // Use lowercase for consistency ("layer" not "layers")
            });
          }
        }
      } catch (s) {
        t.warning(
          `Error processing ${m}: ${s instanceof Error ? s.message : String(s)}`
        );
        continue;
      }
    const i = await figma.variables.getLocalVariableCollectionsAsync();
    let o = null, a = null, l = null;
    for (const m of i) {
      const s = Oe(m.name).toLowerCase();
      (s === "tokens" || s === "token") && !o ? o = m : (s === "theme" || s === "themes") && !a ? a = m : (s === "layer" || s === "layers") && !l && (l = m);
    }
    const r = n.filter(
      (m) => m.collectionName === "tokens"
    ), c = n.filter((m) => m.collectionName === "theme"), d = n.filter((m) => m.collectionName === "layer"), p = {
      existing: 0,
      new: 0
    }, h = {
      existing: 0,
      new: 0
    }, $ = {
      existing: 0,
      new: 0
    };
    if (e.tokensCollection === "existing" && o) {
      const m = /* @__PURE__ */ new Set();
      for (const b of o.variableIds)
        try {
          const s = figma.variables.getVariableById(b);
          s && m.add(s.name);
        } catch (s) {
          continue;
        }
      for (const b of r)
        m.has(b.name) ? p.existing++ : p.new++;
    } else
      p.new = r.length;
    if (e.themeCollection === "existing" && a) {
      const m = /* @__PURE__ */ new Set();
      for (const b of a.variableIds)
        try {
          const s = figma.variables.getVariableById(b);
          s && m.add(s.name);
        } catch (s) {
          continue;
        }
      for (const b of c)
        m.has(b.name) ? h.existing++ : h.new++;
    } else
      h.new = c.length;
    if (e.layersCollection === "existing" && l) {
      const m = /* @__PURE__ */ new Set();
      for (const b of l.variableIds)
        try {
          const s = figma.variables.getVariableById(b);
          s && m.add(s.name);
        } catch (s) {
          continue;
        }
      for (const b of d)
        m.has(b.name) ? $.existing++ : $.new++;
    } else
      $.new = d.length;
    return t.log(
      `Variable summary: Tokens - ${p.existing} existing, ${p.new} new; Theme - ${h.existing} existing, ${h.new} new; Layers - ${$.existing} existing, ${$.new} new`
    ), Pe("summarizeVariablesForWizard", {
      tokens: p,
      theme: h,
      layers: $
    });
  } catch (n) {
    const i = n instanceof Error ? n.message : "Unknown error occurred";
    return t.error(`Summarize failed: ${i}`), Me(
      "summarizeVariablesForWizard",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function Gi(e) {
  try {
    const n = "recursica:collectionId", o = {
      collections: (await figma.variables.getLocalVariableCollectionsAsync()).map((a) => {
        const l = a.getSharedPluginData("recursica", n);
        return {
          id: a.id,
          name: a.name,
          guid: l || void 0
        };
      })
    };
    return Pe(
      "getLocalVariableCollections",
      o
    );
  } catch (n) {
    return Me(
      "getLocalVariableCollections",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function _i(e) {
  try {
    const n = "recursica:collectionId", i = [];
    for (const a of e.collectionIds)
      try {
        const l = await figma.variables.getVariableCollectionByIdAsync(a);
        if (l) {
          const r = l.getSharedPluginData(
            "recursica",
            n
          );
          i.push({
            collectionId: a,
            guid: r || null
          });
        } else
          i.push({
            collectionId: a,
            guid: null
          });
      } catch (l) {
        t.warning(
          `Failed to get GUID for collection ${a}: ${l instanceof Error ? l.message : String(l)}`
        ), i.push({
          collectionId: a,
          guid: null
        });
      }
    return Pe(
      "getCollectionGuids",
      {
        collectionGuids: i
      }
    );
  } catch (n) {
    return Me(
      "getCollectionGuids",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function zi(e) {
  try {
    t.log("=== Starting Import Group Merge ==="), await figma.loadAllPagesAsync();
    const n = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!n || n.type !== "PAGE")
      throw new Error("Main page not found");
    const i = n.getPluginData(xe);
    if (!i)
      throw new Error("Primary import metadata not found on page");
    const o = JSON.parse(i);
    t.log(
      `Found metadata for component: ${o.componentName} (Version: ${o.componentVersion})`
    );
    let a = 0, l = 0;
    const r = "recursica:collectionId";
    for (const v of e.collectionChoices)
      if (v.choice === "merge")
        try {
          const g = await figma.variables.getVariableCollectionByIdAsync(
            v.newCollectionId
          );
          if (!g) {
            t.warning(
              `New collection ${v.newCollectionId} not found, skipping merge`
            );
            continue;
          }
          let C = null;
          if (v.existingCollectionId)
            C = await figma.variables.getVariableCollectionByIdAsync(
              v.existingCollectionId
            );
          else {
            const I = g.getSharedPluginData(
              "recursica",
              r
            );
            if (I) {
              const B = await figma.variables.getLocalVariableCollectionsAsync();
              for (const x of B)
                if (x.getSharedPluginData(
                  "recursica",
                  r
                ) === I && x.id !== v.newCollectionId) {
                  C = x;
                  break;
                }
              if (!C && (I === _e.LAYER || I === _e.TOKENS || I === _e.THEME)) {
                let x;
                I === _e.LAYER ? x = Le.LAYER : I === _e.TOKENS ? x = Le.TOKENS : x = Le.THEME;
                for (const S of B)
                  if (S.getSharedPluginData(
                    "recursica",
                    r
                  ) === I && S.name === x && S.id !== v.newCollectionId) {
                    C = S;
                    break;
                  }
                C || (C = figma.variables.createVariableCollection(x), C.setSharedPluginData(
                  "recursica",
                  r,
                  I
                ), t.log(
                  `Created new standard collection: "${x}"`
                ));
              }
            }
          }
          if (!C) {
            t.warning(
              "Could not find or create existing collection for merge, skipping"
            );
            continue;
          }
          t.log(
            `Merging collection "${g.name}" (${v.newCollectionId.substring(0, 8)}...) into "${C.name}" (${C.id.substring(0, 8)}...)`
          );
          const M = g.variableIds.map(
            (I) => figma.variables.getVariableByIdAsync(I)
          ), H = await Promise.all(M), W = C.variableIds.map(
            (I) => figma.variables.getVariableByIdAsync(I)
          ), E = await Promise.all(W), O = new Set(
            E.filter((I) => I !== null).map((I) => I.name)
          );
          for (const I of H)
            if (I)
              try {
                if (O.has(I.name)) {
                  t.warning(
                    `Variable "${I.name}" already exists in collection "${C.name}", skipping`
                  );
                  continue;
                }
                const B = figma.variables.createVariable(
                  I.name,
                  C,
                  I.resolvedType
                );
                for (const x of C.modes) {
                  const S = x.modeId;
                  let u = I.valuesByMode[S];
                  if (u === void 0 && g.modes.length > 0) {
                    const P = g.modes[0].modeId;
                    u = I.valuesByMode[P];
                  }
                  u !== void 0 && B.setValueForMode(S, u);
                }
                t.log(
                  `  ✓ Copied variable "${I.name}" to collection "${C.name}"`
                );
              } catch (B) {
                t.warning(
                  `Failed to copy variable "${I.name}": ${B instanceof Error ? B.message : String(B)}`
                );
              }
          g.remove(), a++, t.log(
            `✓ Merged and deleted collection: ${g.name}`
          );
        } catch (g) {
          t.warning(
            `Failed to merge collection: ${g instanceof Error ? g.message : String(g)}`
          );
        }
      else
        l++, t.log(`Kept collection: ${v.newCollectionId}`);
    t.log("Removing dividers...");
    const c = figma.root.children, d = [];
    for (const v of c) {
      if (v.type !== "PAGE") continue;
      const g = v.getPluginData(Re);
      (g === "start" || g === "end") && d.push(v);
    }
    const p = figma.currentPage;
    if (d.some((v) => v.id === p.id))
      if (n && n.id !== p.id)
        figma.currentPage = n;
      else {
        const v = c.find(
          (g) => g.type === "PAGE" && !d.some((C) => C.id === g.id)
        );
        v && (figma.currentPage = v);
      }
    const h = d.map((v) => v.name);
    for (const v of d)
      try {
        v.remove();
      } catch (g) {
        t.warning(
          `Failed to delete divider: ${g instanceof Error ? g.message : String(g)}`
        );
      }
    for (const v of h)
      t.log(`Deleted divider: ${v}`);
    t.log("Removing construction icons and renaming pages..."), await figma.loadAllPagesAsync();
    const $ = figma.root.children;
    let y = 0;
    const m = "RecursicaPublishedMetadata", b = [];
    for (const v of $)
      if (v.type === "PAGE")
        try {
          if (v.getPluginData(Ce) === "true") {
            const C = v.getPluginData(m);
            let M = {};
            if (C)
              try {
                M = JSON.parse(C);
              } catch (H) {
              }
            b.push({
              pageId: v.id,
              pageName: v.name,
              pageMetadata: M
            });
          }
        } catch (g) {
          t.warning(
            `Failed to process page: ${g instanceof Error ? g.message : String(g)}`
          );
        }
    for (const v of b)
      try {
        const g = await figma.getNodeByIdAsync(
          v.pageId
        );
        if (!g || g.type !== "PAGE") {
          t.warning(
            `Page ${v.pageId} not found, skipping rename`
          );
          continue;
        }
        let C = g.name;
        if (C.startsWith(Fe) && (C = C.substring(Fe.length).trim()), C === "REMOTES" || C.includes("REMOTES")) {
          g.name = "REMOTES", y++, t.log(`Renamed page: "${g.name}" -> "REMOTES"`);
          continue;
        }
        const H = v.pageMetadata.name && v.pageMetadata.name.length > 0 && !v.pageMetadata.name.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        ) ? v.pageMetadata.name : o.componentName || C, W = v.pageMetadata.version !== void 0 ? v.pageMetadata.version : o.componentVersion, E = `${H} (VERSION: ${W})`;
        g.name = E, y++, t.log(`Renamed page: "${C}" -> "${E}"`);
      } catch (g) {
        t.warning(
          `Failed to rename page ${v.pageId}: ${g instanceof Error ? g.message : String(g)}`
        );
      }
    if (t.log("Clearing import metadata..."), n)
      try {
        n.setPluginData(xe, "");
      } catch (v) {
        t.warning(
          `Failed to clear primary import metadata: ${v instanceof Error ? v.message : String(v)}`
        );
      }
    for (const v of b)
      try {
        const g = await figma.getNodeByIdAsync(
          v.pageId
        );
        g && g.type === "PAGE" && g.setPluginData(Ce, "");
      } catch (g) {
        t.warning(
          `Failed to clear under review metadata for page ${v.pageId}: ${g instanceof Error ? g.message : String(g)}`
        );
      }
    const s = {
      mergedCollections: a,
      keptCollections: l,
      pagesRenamed: y
    };
    return t.log(
      `=== Merge Complete ===
  Merged: ${a} collection(s)
  Kept: ${l} collection(s)
  Renamed: ${y} page(s)`
    ), Pe(
      "mergeImportGroup",
      s
    );
  } catch (n) {
    return t.error(
      `Merge failed: ${n instanceof Error ? n.message : String(n)}`
    ), Me(
      "mergeImportGroup",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function ji(e) {
  var n, i;
  try {
    t.log("=== Test: Instance Children and Overrides Behavior ===");
    const o = await figma.getNodeByIdAsync(e);
    if (!o || o.type !== "PAGE")
      throw new Error("Test page not found");
    const a = o.children.find(
      (R) => R.type === "FRAME" && R.name === "Test"
    );
    if (!a)
      throw new Error("Test frame container not found on page");
    const l = [];
    t.log(
      `
--- Test 1: Component with children → Create instance ---`
    );
    const r = figma.createComponent();
    r.name = "Test Component - With Children", r.resize(200, 200), a.appendChild(r);
    const c = figma.createFrame();
    c.name = "Child 1", c.resize(50, 50), c.x = 10, c.y = 10, r.appendChild(c);
    const d = figma.createFrame();
    d.name = "Child 2", d.resize(50, 50), d.x = 70, d.y = 10, r.appendChild(d), t.log(
      `  Created component "${r.name}" with ${r.children.length} children`
    ), t.log(
      `  Component children: ${r.children.map((R) => R.name).join(", ")}`
    );
    const p = r.createInstance();
    p.name = "Instance 1 - From Component", a.appendChild(p), t.log(`  Created instance "${p.name}" from component`);
    const h = p.children.length;
    if (t.log(
      `  Instance children count immediately after creation: ${h}`
    ), h > 0) {
      t.log(
        `  Instance children: ${p.children.map((ie) => ie.name).join(", ")}`
      ), t.log(
        `  Instance child types: ${p.children.map((ie) => ie.type).join(", ")}`
      );
      const R = p.children[0];
      if (t.log(
        `  First child: name="${R.name}", type="${R.type}", id="${R.id}"`
      ), t.log(
        `  First child parent: ${(n = R.parent) == null ? void 0 : n.name} (id: ${(i = R.parent) == null ? void 0 : i.id})`
      ), "mainComponent" in R) {
        const ie = await R.getMainComponentAsync();
        t.log(
          `  First child mainComponent: ${(ie == null ? void 0 : ie.name) || "none"}`
        );
      }
      t.log(
        `  Component children IDs: ${r.children.map((ie) => ie.id).join(", ")}`
      ), t.log(
        `  Instance children IDs: ${p.children.map((ie) => ie.id).join(", ")}`
      );
      const pe = p.children[0].id !== r.children[0].id;
      t.log(
        `  Are instance children different nodes from component children? ${pe}`
      );
    } else
      t.log(
        "  ⚠️ Instance has NO children immediately after creation"
      );
    if (l.push({
      test: "Instance has children immediately",
      success: h > 0,
      details: {
        instanceChildrenCount: h,
        componentChildrenCount: r.children.length,
        instanceChildren: p.children.map((R) => ({
          name: R.name,
          type: R.type,
          id: R.id
        }))
      }
    }), t.log(
      `
--- Test 2: Create instance override by replacing child ---`
    ), h > 0) {
      const R = p.children[0];
      t.log(
        `  Original child to replace: "${R.name}" (id: ${R.id})`
      );
      const pe = figma.createFrame();
      pe.name = "Override Child", pe.resize(60, 60), pe.x = R.x, pe.y = R.y, a.appendChild(pe), t.log(
        `  Created override child "${pe.name}" as child of Test frame`
      );
      let ie = !1, N;
      try {
        const T = p.children.indexOf(R);
        p.insertChild(T, pe), R.remove(), ie = !0, t.log(
          `  ✓ Successfully replaced child at index ${T}`
        );
      } catch (T) {
        N = T instanceof Error ? T.message : String(T), t.log(
          `  ✗ Cannot move node into instance: ${N}`
        ), t.log(
          "  → This means we cannot directly move placeholder children into instances"
        ), t.log(
          "  → We must create NEW nodes and copy properties instead"
        ), pe.remove();
      }
      if (ie) {
        t.log(
          `  Instance children after override: ${p.children.map((f) => f.name).join(", ")}`
        ), t.log(
          `  Instance children count after override: ${p.children.length}`
        ), t.log(
          `  Component children after override: ${r.children.map((f) => f.name).join(", ")}`
        ), t.log(
          `  Component children count after override: ${r.children.length}`
        );
        const T = r.children.length === 2 && r.children[0].name === "Child 1" && r.children[1].name === "Child 2";
        l.push({
          test: "Instance override doesn't affect component",
          success: T,
          details: {
            instanceChildrenAfterOverride: p.children.map((f) => ({
              name: f.name,
              type: f.type,
              id: f.id
            })),
            componentChildrenAfterOverride: r.children.map((f) => ({
              name: f.name,
              type: f.type,
              id: f.id
            }))
          }
        });
      } else
        t.log(
          "  → Cannot move nodes into instances - must create new nodes instead"
        ), l.push({
          test: "Instance override doesn't affect component",
          success: !0,
          // This is expected behavior
          details: {
            overrideAttempted: !0,
            overrideError: N,
            note: "Cannot move nodes into instances - must create new nodes and copy properties"
          }
        });
    } else
      t.log(
        "  ⚠️ Skipping override test - instance has no children"
      ), l.push({
        test: "Instance override doesn't affect component",
        success: !1,
        details: { reason: "Instance has no children to override" }
      });
    t.log(
      `
--- Test 3: Merge placeholder children into instance ---`
    );
    const $ = r.createInstance();
    $.name = "Instance 2 - For Placeholder Merge", $.x = 250, a.appendChild($), t.log(
      `  Created instance "${$.name}" with ${$.children.length} children`
    );
    const y = figma.createFrame();
    y.name = "[Deferred: Placeholder]", y.resize(200, 200), a.appendChild(y);
    const m = figma.createFrame();
    m.name = "Child 1", m.resize(60, 60), m.x = 10, m.y = 10, y.appendChild(m);
    const b = figma.createFrame();
    b.name = "Placeholder Only Child", b.resize(50, 50), b.x = 80, b.y = 10, y.appendChild(b), t.log(
      `  Created placeholder with ${y.children.length} children: ${y.children.map((R) => R.name).join(", ")}`
    ), t.log(
      `  Instance has ${$.children.length} children: ${$.children.map((R) => R.name).join(", ")}`
    );
    let s = !1, v = {}, g;
    if ($.children.length > 0 && y.children.length > 0) {
      t.log("  Attempting to merge placeholder children..."), t.log(
        "  → Since we cannot move nodes into instances, we'll test creating new nodes"
      );
      const R = [];
      for (const ie of y.children) {
        const N = $.children.find(
          (T) => T.name === ie.name
        );
        if (N) {
          t.log(
            `  Found matching child "${ie.name}" in instance - attempting to replace`
          );
          try {
            const T = $.children.indexOf(N);
            $.insertChild(T, ie), N.remove(), R.push({
              name: ie.name,
              source: "replaced existing"
            }), t.log(
              `    ✓ Successfully replaced "${ie.name}"`
            );
          } catch (T) {
            const f = T instanceof Error ? T.message : String(T);
            t.log(
              `    ✗ Cannot move "${ie.name}" into instance: ${f}`
            ), t.log(
              "    → Must create new node and copy properties instead"
            ), R.push({
              name: ie.name,
              source: "replaced existing (failed)",
              error: f
            }), g = f;
          }
        } else {
          t.log(
            `  No matching child for "${ie.name}" - attempting to append`
          );
          try {
            $.appendChild(ie), R.push({
              name: ie.name,
              source: "appended new"
            }), t.log(
              `    ✓ Successfully appended "${ie.name}"`
            );
          } catch (T) {
            const f = T instanceof Error ? T.message : String(T);
            t.log(
              `    ✗ Cannot append "${ie.name}" to instance: ${f}`
            ), t.log(
              "    → Must create new node and copy properties instead"
            ), R.push({
              name: ie.name,
              source: "appended new (failed)",
              error: f
            }), g = f;
          }
        }
      }
      t.log(
        `  After merge attempt, instance has ${$.children.length} children: ${$.children.map((ie) => ie.name).join(", ")}`
      );
      const pe = R.filter(
        (ie) => !ie.error && ie.source !== "replaced existing (failed)" && ie.source !== "appended new (failed)"
      );
      g ? (t.log(
        "  → Merge failed: Cannot move nodes into instances (expected behavior)"
      ), t.log(
        "  → Solution: Must create NEW nodes and copy properties from placeholder children"
      ), s = !0) : s = pe.length > 0, v = {
        mergedChildren: R,
        successfulMerges: pe.length,
        failedMerges: R.length - pe.length,
        mergeError: g,
        finalInstanceChildren: $.children.map((ie) => ({
          name: ie.name,
          type: ie.type,
          id: ie.id
        })),
        finalInstanceChildrenCount: $.children.length,
        note: g ? "Cannot move nodes into instances - must create new nodes and copy properties" : "Merge succeeded"
      };
    } else
      t.log(
        "  ⚠️ Cannot merge - instance or placeholder has no children"
      ), v = {
        instanceChildrenCount: $.children.length,
        placeholderChildrenCount: y.children.length
      };
    l.push({
      test: "Merge placeholder children into instance",
      success: s,
      details: v
    }), t.log(`
--- Test 4: getMainComponent behavior ---`);
    const C = await p.getMainComponentAsync();
    if (t.log(
      `  Instance mainComponent: ${(C == null ? void 0 : C.name) || "none"} (id: ${(C == null ? void 0 : C.id) || "none"})`
    ), t.log(`  MainComponent type: ${(C == null ? void 0 : C.type) || "none"}`), C) {
      t.log(
        `  MainComponent children: ${C.children.map((pe) => pe.name).join(", ")}`
      ), t.log(
        `  MainComponent children count: ${C.children.length}`
      ), t.log(
        `  Instance children count: ${p.children.length}`
      );
      const R = p.children.length === C.children.length && p.children.every(
        (pe, ie) => pe.name === C.children[ie].name
      );
      t.log(
        `  Do instance children match mainComponent children? ${R}`
      ), l.push({
        test: "getMainComponent returns component",
        success: C.id === r.id,
        details: {
          mainComponentId: C.id,
          componentId: r.id,
          childrenMatch: R,
          instanceChildrenCount: p.children.length,
          mainComponentChildrenCount: C.children.length
        }
      });
    } else
      l.push({
        test: "getMainComponent returns component",
        success: !1,
        details: { reason: "getMainComponentAsync returned null" }
      });
    t.log(
      `
--- Test 5: Recreate children from JSON (simulating deferred resolution) ---`
    );
    const M = figma.createComponent();
    M.name = "Test Component - For JSON Recreation", M.resize(300, 300), a.appendChild(M);
    const H = figma.createFrame();
    H.name = "Default Child 1", H.resize(50, 50), H.fills = [{ type: "SOLID", color: { r: 1, g: 0, b: 0 } }], M.appendChild(H);
    const W = figma.createFrame();
    W.name = "Default Child 2", W.resize(50, 50), W.fills = [{ type: "SOLID", color: { r: 0, g: 1, b: 0 } }], M.appendChild(W);
    const E = figma.createFrame();
    E.name = "Default Child 3", E.resize(50, 50), E.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 1 } }], M.appendChild(E), t.log(
      `  Created component "${M.name}" with ${M.children.length} default children`
    ), t.log(
      `  Default children: ${M.children.map((R) => R.name).join(", ")}`
    );
    const O = M.createInstance();
    O.name = "Instance 3 - For JSON Recreation", O.x = 350, a.appendChild(O), t.log(
      `  Created instance "${O.name}" with ${O.children.length} default children`
    ), t.log(
      `  Instance default children: ${O.children.map((R) => R.name).join(", ")}`
    );
    const I = [
      {
        name: "Default Child 1",
        type: "FRAME",
        fills: [{ type: "SOLID", color: { r: 1, g: 1, b: 0 } }]
        // Yellow (different from default red)
      },
      {
        name: "JSON Only Child",
        type: "FRAME",
        fills: [{ type: "SOLID", color: { r: 1, g: 0, b: 1 } }]
        // Magenta
      }
    ];
    t.log(
      `  JSON children to recreate: ${I.map((R) => R.name).join(", ")}`
    ), t.log(
      "  Strategy: Match by name, update matches in place, cannot add new ones (Figma limitation), keep defaults not in JSON"
    );
    let B = !0;
    const x = {
      defaultChildrenBefore: O.children.map((R) => ({
        name: R.name,
        type: R.type,
        fills: "fills" in R ? R.fills : void 0
      })),
      jsonChildren: I.map((R) => ({ name: R.name, type: R.type }))
    }, S = [], u = [];
    for (const R of I) {
      const pe = O.children.find(
        (ie) => ie.name === R.name
      );
      if (pe) {
        t.log(
          `  Found matching child "${R.name}" - attempting to update in place`
        );
        try {
          if ("fills" in pe && R.fills) {
            const ie = pe.fills;
            t.log(
              `    Current fills before update: ${JSON.stringify(ie)}`
            ), pe.fills = R.fills;
            const N = pe.fills;
            t.log(
              `    Fills after update: ${JSON.stringify(N)}`
            ), Array.isArray(N) && N.length > 0 && N[0].type === "SOLID" && N[0].color.r === R.fills[0].color.r && N[0].color.g === R.fills[0].color.g && N[0].color.b === R.fills[0].color.b ? (t.log(
              `    ✓ Successfully updated "${R.name}" fills in place`
            ), S.push(R.name)) : (t.log(
              "    ✗ Update assignment succeeded but fills didn't change (read-only?)"
            ), B = !1);
          } else
            t.log(
              `    ⚠ Cannot update "${R.name}" - node type doesn't support fills`
            );
        } catch (ie) {
          const N = ie instanceof Error ? ie.message : String(ie);
          t.log(
            `    ✗ Cannot update "${R.name}": ${N}`
          ), B = !1;
        }
      } else
        t.log(
          `  No matching child for "${R.name}" - cannot add to instance (Figma limitation)`
        ), t.log(
          "    → Children that exist only in JSON cannot be added to instances"
        ), u.push(R.name);
    }
    t.log(
      "  Testing: Can we modify other properties (like name, size) of instance children?"
    );
    let P = !1;
    if (O.children.length > 0) {
      const R = O.children[0], pe = R.name, ie = "width" in R ? R.width : void 0;
      try {
        R.name = "Modified Name", "resize" in R && ie && R.resize(ie + 10, R.height), P = !0, t.log(
          "    ✓ Can modify properties (name, size) of instance children"
        ), R.name = pe, "resize" in R && ie && R.resize(ie, R.height);
      } catch (N) {
        const T = N instanceof Error ? N.message : String(N);
        t.log(
          `    ✗ Cannot modify properties of instance children: ${T}`
        );
      }
    }
    const w = O.children.filter(
      (R) => !I.some((pe) => pe.name === R.name)
    );
    t.log(
      `  Kept default children (not in JSON): ${w.map((R) => R.name).join(", ")}`
    ), t.log(
      `  Final instance children: ${O.children.map((R) => R.name).join(", ")}`
    ), t.log(
      `  Final instance children count: ${O.children.length}`
    ), x.finalChildren = O.children.map((R) => ({
      name: R.name,
      type: R.type
    })), x.keptDefaultChildren = w.map((R) => ({
      name: R.name,
      type: R.type
    })), x.finalChildrenCount = O.children.length, x.updatedChildren = S, x.skippedChildren = u, x.canModifyProperties = P;
    const V = O.children.some(
      (R) => R.name === "Default Child 1"
    ), z = O.children.some(
      (R) => R.name === "JSON Only Child"
    ), Z = O.children.some(
      (R) => R.name === "Default Child 2"
    ), k = O.children.some(
      (R) => R.name === "Default Child 3"
    ), L = O.children.find(
      (R) => R.name === "Default Child 1"
    );
    let q = !1;
    if (L && "fills" in L) {
      const R = L.fills;
      Array.isArray(R) && R.length > 0 && R[0].type === "SOLID" && (q = R[0].color.r === 1 && R[0].color.g === 1 && R[0].color.b === 0);
    }
    const Q = V && q && !z && // Should NOT exist (Figma limitation)
    Z && k && O.children.length === 3;
    t.log(`  Meets expectations: ${Q}`), t.log(`    - "Default Child 1" updated: ${q}`), t.log(
      `    - "JSON Only Child" added: ${z} (expected: false - cannot add new children)`
    ), t.log(
      `    - Default children kept: ${Z && k}`
    ), l.push({
      test: "Recreate children from JSON",
      success: B && Q,
      details: Ee(le({}, x), {
        meetsExpectations: Q,
        hasJsonChild1: V,
        child1Updated: q,
        hasJsonOnlyChild: z,
        hasDefaultChild2: Z,
        hasDefaultChild3: k,
        note: B && Q ? "Successfully updated existing children in place, kept defaults not in JSON. Cannot add new children to instances (Figma limitation)." : "Failed to update children or expectations not met"
      })
    }), t.log(
      `
--- Test 6: Bottom-up resolution order (nested deferred instances) ---`
    );
    const te = figma.createFrame();
    te.name = "[Deferred: Parent]", te.resize(200, 200), a.appendChild(te);
    const ne = figma.createFrame();
    ne.name = "[Deferred: Child]", ne.resize(100, 100), ne.x = 10, ne.y = 10, te.appendChild(ne);
    const K = figma.createFrame();
    K.name = "[Deferred: Grandchild]", K.resize(50, 50), K.x = 10, K.y = 10, ne.appendChild(K), t.log(
      "  Created nested structure: Parent -> Child -> Grandchild"
    ), t.log(
      `  Parent placeholder has ${te.children.length} child(ren)`
    ), t.log(
      `  Child placeholder has ${ne.children.length} child(ren)`
    );
    let J = !0;
    const U = {};
    t.log("  Step 1: Resolving grandchild (leaf node)...");
    const j = figma.createComponent();
    j.name = "Grandchild Component", j.resize(50, 50), a.appendChild(j);
    const Y = j.createInstance();
    Y.name = "Grandchild Instance", a.appendChild(Y);
    const re = K.parent;
    if (re && "children" in re) {
      const R = re.children.indexOf(
        K
      );
      re.insertChild(R, Y), K.remove(), t.log(
        "    ✓ Resolved grandchild - replaced placeholder with instance"
      ), U.grandchildResolved = !0;
    } else
      t.log("    ✗ Could not resolve grandchild"), J = !1;
    t.log(
      "  Step 2: Resolving child (has resolved grandchild inside)..."
    );
    const he = figma.createComponent();
    he.name = "Child Component", he.resize(100, 100), a.appendChild(he);
    const fe = he.createInstance();
    fe.name = "Child Instance", a.appendChild(fe);
    const ce = te.children.find(
      (R) => R.name === "[Deferred: Child]"
    );
    if (!ce)
      t.log(
        "    ✗ Child placeholder lost after resolving grandchild"
      ), J = !1;
    else if (!("children" in ce))
      t.log("    ✗ Child placeholder does not support children"), J = !1;
    else {
      ce.children.find(
        (N) => N.name === "Grandchild Instance"
      ) ? (t.log(
        "    ✓ Grandchild still accessible inside child placeholder"
      ), U.grandchildStillAccessible = !0) : t.log(
        "    ⚠ Grandchild not found inside child placeholder (may have been moved)"
      );
      const pe = ce.children.find(
        (N) => N.name === "Grandchild Instance"
      ), ie = ce.parent;
      if (ie && "children" in ie) {
        const N = ie.children.indexOf(
          ce
        );
        ie.insertChild(N, fe), ce.remove(), t.log(
          "    ✓ Resolved child - replaced placeholder with instance"
        ), U.childResolved = !0, pe && (t.log(
          "    ⚠ Grandchild instance was in child placeholder and is now lost"
        ), t.log(
          "    → This demonstrates the need to extract children before replacing placeholders"
        ), U.grandchildLost = !0);
      } else
        t.log("    ✗ Could not resolve child"), J = !1;
    }
    t.log(
      "  Step 3: Resolving parent (has resolved child inside)..."
    );
    const ae = figma.createComponent();
    ae.name = "Parent Component", ae.resize(200, 200), a.appendChild(ae);
    const se = ae.createInstance();
    se.name = "Parent Instance", a.appendChild(se);
    const de = te.children.find(
      (R) => R.name === "Child Instance"
    );
    de ? (t.log(
      "    ✓ Child still accessible inside parent placeholder"
    ), U.childStillAccessible = !0, a.appendChild(de), t.log(
      "    ✓ Extracted child instance from parent placeholder"
    ), U.childExtracted = !0) : (t.log(
      "    ✗ Child not found inside parent placeholder - cannot extract"
    ), J = !1);
    const me = te.parent;
    if (me && "children" in me) {
      const R = me.children.indexOf(te);
      if (me.insertChild(R, se), te.remove(), t.log(
        "    ✓ Resolved parent - replaced placeholder with instance"
      ), U.parentResolved = !0, de)
        try {
          se.appendChild(de), t.log("    ✓ Added child instance to parent instance"), U.childAddedToParent = !0;
        } catch (pe) {
          const ie = pe instanceof Error ? pe.message : String(pe);
          t.log(
            `    ✗ Cannot add child to parent instance: ${ie}`
          ), t.log(
            "    → This is the Figma limitation - cannot add children to instances"
          ), t.log(
            "    → Child instance remains in testFrame (not in final structure)"
          ), U.childAddedToParent = !1, U.childAddError = ie;
        }
    } else
      t.log("    ✗ Could not resolve parent"), J = !1;
    t.log("  Verifying bottom-up resolution worked...");
    const Se = a.children.find(
      (R) => R.name === "Parent Instance"
    ), Ve = a.children.find(
      (R) => R.name === "Child Instance"
    );
    let je = !1;
    Se && Ve ? (je = !0, t.log(
      "    ✓ Bottom-up resolution worked: Parent resolved, child extracted"
    ), t.log(
      "    ⚠ Child cannot be added to parent instance (Figma limitation)"
    )) : Se ? t.log(
      "    ⚠ Parent resolved but child not found (may have been lost)"
    ) : t.log("    ✗ Parent not resolved"), U.bottomUpWorked = je, U.finalParentExists = !!Se, U.childExtractedExists = !!Ve, U.note = "Bottom-up resolution works, but Figma limitation prevents adding children to instances. This demonstrates the need for a different approach (e.g., matching by name and replacing at parent level).", U.note = "Bottom-up resolution (leaf to root) ensures nested placeholders are resolved before their parents are replaced", l.push({
      test: "Bottom-up resolution order",
      success: J && je,
      details: U
    }), t.log(`
--- Test Summary ---`);
    const nt = l.every((R) => R.success), Je = l.filter((R) => R.success).length;
    t.log(`  Tests passed: ${Je}/${l.length}`);
    for (const R of l)
      t.log(
        `  ${R.success ? "✓" : "✗"} ${R.test}: ${R.success ? "PASS" : "FAIL"}`
      );
    return {
      success: nt,
      message: nt ? "All instance children and override tests passed" : `${Je}/${l.length} tests passed - see details`,
      details: {
        testResults: l,
        summary: {
          total: l.length,
          passed: Je,
          failed: l.length - Je
        }
      }
    };
  } catch (o) {
    const a = o instanceof Error ? o.message : "Unknown error occurred";
    return t.error(`Test failed: ${a}`), {
      success: !1,
      message: `Test error: ${a}`
    };
  }
}
async function Ji(e) {
  try {
    t.log("=== Starting Test ==="), t.log('Cleaning up "Test" variable collection...');
    const n = await figma.variables.getLocalVariableCollectionsAsync();
    for (const y of n)
      if (y.name === "Test") {
        t.log(
          `  Found existing "Test" collection (ID: ${y.id.substring(0, 8)}...), deleting...`
        );
        const m = await figma.variables.getLocalVariablesAsync();
        for (const b of m)
          b.variableCollectionId === y.id && b.remove();
        y.remove(), t.log('  Deleted "Test" collection');
      }
    await figma.loadAllPagesAsync();
    let o = figma.root.children.find(
      (y) => y.type === "PAGE" && y.name === "Test"
    );
    o ? t.log('Found existing "Test" page') : (o = figma.createPage(), o.name = "Test", t.log('Created "Test" page')), await figma.setCurrentPageAsync(o);
    const a = o.children.find(
      (y) => y.type === "FRAME" && y.name === "Test"
    );
    a && (t.log(
      'Found existing "Test" frame, deleting it and all children...'
    ), a.remove(), t.log('Deleted existing "Test" frame'));
    const l = figma.createFrame();
    l.name = "Test", o.appendChild(l), t.log('Created new "Test" frame container');
    const r = [];
    t.log(`
` + "=".repeat(60)), t.log("TEST 9: Instance Children and Overrides Behavior"), t.log("=".repeat(60));
    const c = await ji(o.id);
    r.push({
      name: "Instance Children and Overrides",
      success: c.success,
      message: c.message,
      details: c.details
    }), t.log(`
` + "=".repeat(60)), t.log("=== ALL TESTS COMPLETE ==="), t.log("=".repeat(60));
    const d = r.filter((y) => y.success), p = r.filter((y) => !y.success);
    t.log(
      `Total: ${r.length} | Passed: ${d.length} | Failed: ${p.length}`
    );
    for (const y of r)
      t.log(
        `  ${y.success ? "✓" : "✗"} ${y.name}: ${y.message}`
      );
    const $ = {
      testResults: {
        success: c.success,
        message: `All tests completed: ${d.length}/${r.length} passed`,
        details: {
          summary: {
            total: r.length,
            passed: d.length,
            failed: p.length
          },
          tests: r
        }
      },
      allTests: r
    };
    return Pe("runTest", $);
  } catch (n) {
    const i = n instanceof Error ? n.message : "Unknown error occurred";
    return t.error(`Test failed: ${i}`), Me("runTest", i);
  }
}
const Di = {
  getCurrentUser: $n,
  loadPages: vn,
  exportPage: Ze,
  importPage: Ot,
  cleanupCreatedEntities: an,
  resolveDeferredNormalInstances: xt,
  determineImportOrder: cn,
  buildDependencyGraph: sn,
  resolveImportOrder: ln,
  importPagesInOrder: dn,
  quickCopy: Ni,
  storeAuthData: Ci,
  loadAuthData: Ei,
  clearAuthData: Ii,
  storeImportData: wi,
  loadImportData: Ai,
  clearImportData: Pi,
  storeSelectedRepo: Ti,
  getComponentMetadata: Oi,
  getAllComponents: xi,
  pluginPromptResponse: Vi,
  switchToPage: Ri,
  checkForExistingPrimaryImport: Mi,
  createImportDividers: ki,
  importSingleComponentWithWizard: Ui,
  deleteImportGroup: mn,
  clearImportMetadata: Fi,
  cleanupFailedImport: Li,
  summarizeVariablesForWizard: Bi,
  getLocalVariableCollections: Gi,
  getCollectionGuids: _i,
  mergeImportGroup: zi,
  runTest: Ji
}, Hi = Di;
figma.showUI(__html__, {
  width: 500,
  height: 500
});
figma.ui.onmessage = async (e) => {
  var i;
  if (console.log("Received message:", e), e.type === "cancelRequest") {
    const o = (i = e.data) == null ? void 0 : i.requestId;
    o && (Wn(o), console.log(`Request cancelled: ${o}`));
    return;
  }
  if (e.type === "GenerateGuidResponse") {
    Tn(e);
    return;
  }
  const n = e;
  try {
    const o = n.type, a = Hi[o];
    if (!a) {
      console.warn("Unknown message type:", n.type);
      const c = {
        type: n.type,
        success: !1,
        error: !0,
        message: "Unknown message type: " + n.type,
        data: {},
        requestId: n.requestId
      };
      figma.ui.postMessage(c);
      return;
    }
    n.requestId && we(n.requestId);
    let l;
    o === "exportPage" && n.requestId ? l = await a(
      n.data,
      /* @__PURE__ */ new Set(),
      !1,
      /* @__PURE__ */ new Set(),
      n.requestId
    ) : o === "importPage" && n.requestId ? l = await a(
      n.data,
      n.requestId
    ) : l = await a(n.data);
    const r = t.getLogs();
    r.length > 0 && (l.data = Ee(le({}, l.data), {
      debugLogs: r
    })), figma.ui.postMessage(Ee(le({}, l), {
      requestId: n.requestId
    })), n.requestId && Ft(n.requestId);
  } catch (o) {
    console.error("Error handling message:", o);
    const a = {
      type: n.type,
      success: !1,
      error: !0,
      message: o instanceof Error ? o.message : "Unknown error occurred",
      data: {},
      requestId: n.requestId
    }, l = t.getLogs();
    l.length > 0 && (a.data.debugLogs = l), figma.ui.postMessage(a), n.requestId && Ft(n.requestId);
  }
};
