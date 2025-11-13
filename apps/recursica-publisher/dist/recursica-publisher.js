var Xe = Object.defineProperty, Ze = Object.defineProperties;
var Qe = Object.getOwnPropertyDescriptors;
var Ee = Object.getOwnPropertySymbols;
var De = Object.prototype.hasOwnProperty, et = Object.prototype.propertyIsEnumerable;
var ue = (e, t, n) => t in e ? Xe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, I = (e, t) => {
  for (var n in t || (t = {}))
    De.call(t, n) && ue(e, n, t[n]);
  if (Ee)
    for (var n of Ee(t))
      et.call(t, n) && ue(e, n, t[n]);
  return e;
}, V = (e, t) => Ze(e, Qe(t));
var F = (e, t, n) => ue(e, typeof t != "symbol" ? t + "" : t, n);
async function tt(e) {
  var t;
  try {
    return {
      type: "getCurrentUser",
      success: !0,
      error: !1,
      message: "Current user retrieved successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        userId: ((t = figma.currentUser) == null ? void 0 : t.id) || null
      }
    };
  } catch (n) {
    return {
      type: "getCurrentUser",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function nt(e) {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "loadPages",
      success: !0,
      error: !1,
      message: "Pages loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        pages: figma.root.children.map((o, l) => ({
          name: o.name,
          index: l
        }))
      }
    };
  } catch (t) {
    return console.error("Error loading pages:", t), {
      type: "loadPages",
      success: !1,
      error: !0,
      message: t instanceof Error ? t.message : "Unknown error occurred",
      data: {}
    };
  }
}
const z = {
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
  dashPattern: []
}, L = V(I({}, z), {
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
  cornerRadius: 0,
  clipsContent: !1,
  layoutWrap: "NO_WRAP",
  layoutGrow: 0
}), U = V(I({}, z), {
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
}), H = V(I({}, z), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), xe = V(I({}, z), {
  cornerRadius: 0
}), rt = V(I({}, z), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function at(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return L;
    case "TEXT":
      return U;
    case "VECTOR":
      return H;
    case "LINE":
      return rt;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return xe;
    default:
      return z;
  }
}
function T(e, t) {
  if (Array.isArray(e))
    return Array.isArray(t) ? e.length !== t.length || e.some((n, r) => T(n, t[r])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof t == "object" && t !== null) {
      const n = Object.keys(e), r = Object.keys(t);
      return n.length !== r.length ? !0 : n.some(
        (o) => !(o in t) || T(e[o], t[o])
      );
    }
    return !0;
  }
  return e !== t;
}
const he = {
  LAYER: "00000000-0000-0000-0000-000000000001",
  TOKENS: "00000000-0000-0000-0000-000000000002",
  THEME: "00000000-0000-0000-0000-000000000003"
}, B = {
  LAYER: "Layer",
  TOKENS: "Tokens",
  THEME: "Theme"
};
function K(e) {
  const t = e.trim(), n = t.toLowerCase();
  return n === "themes" ? B.THEME : n === "token" ? B.TOKENS : n === "layer" ? B.LAYER : n === "tokens" ? B.TOKENS : n === "theme" ? B.THEME : t;
}
function W(e) {
  const t = K(e);
  return t === B.LAYER || t === B.TOKENS || t === B.THEME;
}
function Ae(e) {
  const t = K(e);
  if (t === B.LAYER)
    return he.LAYER;
  if (t === B.TOKENS)
    return he.TOKENS;
  if (t === B.THEME)
    return he.THEME;
}
class ce {
  constructor() {
    F(this, "collectionMap");
    // collectionId -> index
    F(this, "collections");
    // index -> collection data
    F(this, "normalizedNameMap");
    // normalized name -> index (for standard collections)
    F(this, "nextIndex");
    this.collectionMap = /* @__PURE__ */ new Map(), this.collections = [], this.normalizedNameMap = /* @__PURE__ */ new Map(), this.nextIndex = 0;
  }
  /**
   * Finds a collection by normalized name (for standard collections)
   * Returns the index if found, -1 otherwise
   */
  findCollectionByNormalizedName(t) {
    return this.normalizedNameMap.get(t);
  }
  /**
   * Merges modes from a new collection into an existing collection entry
   * Ensures all unique modes are present
   */
  mergeModes(t, n) {
    const r = new Set(t);
    for (const o of n)
      r.add(o);
    return Array.from(r);
  }
  /**
   * Adds a collection to the table if it doesn't already exist
   * For standard collections (Layer, Tokens, Theme), merges by normalized name
   * Returns the index of the collection (existing or newly added)
   */
  addCollection(t) {
    const n = t.collectionId;
    if (this.collectionMap.has(n))
      return this.collectionMap.get(n);
    const r = K(
      t.collectionName
    );
    if (W(t.collectionName)) {
      const i = this.findCollectionByNormalizedName(r);
      if (i !== void 0) {
        const m = this.collections[i];
        return m.modes = this.mergeModes(
          m.modes,
          t.modes
        ), this.collectionMap.set(n, i), i;
      }
    }
    const o = this.nextIndex++;
    this.collectionMap.set(n, o);
    const l = V(I({}, t), {
      collectionName: r
    });
    if (W(t.collectionName)) {
      const i = Ae(
        t.collectionName
      );
      i && (l.collectionGuid = i), this.normalizedNameMap.set(r, o);
    }
    return this.collections[o] = l, o;
  }
  /**
   * Gets the index of a collection by its collectionId
   * Returns -1 if not found
   */
  getCollectionIndex(t) {
    var n;
    return (n = this.collectionMap.get(t)) != null ? n : -1;
  }
  /**
   * Gets a collection entry by index
   */
  getCollectionByIndex(t) {
    return this.collections[t];
  }
  /**
   * Gets the complete table as an object with string keys
   * Used for internal operations (includes all fields)
   */
  getTable() {
    const t = {};
    for (let n = 0; n < this.collections.length; n++)
      t[String(n)] = this.collections[n];
    return t;
  }
  /**
   * Gets the table with only serialized fields (excludes internal-only fields)
   * Used for JSON serialization to reduce size
   * Filters out: collectionId, isLocal (internal-only fields)
   * Keeps: collectionName, collectionGuid, modes
   */
  getSerializedTable() {
    const t = {};
    for (let n = 0; n < this.collections.length; n++) {
      const r = this.collections[n], o = I({
        collectionName: r.collectionName,
        modes: r.modes
      }, r.collectionGuid && { collectionGuid: r.collectionGuid });
      t[String(n)] = o;
    }
    return t;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   * Handles both new format (without collectionId/isLocal) and legacy format (with collectionId/isLocal)
   */
  static fromTable(t) {
    var o;
    const n = new ce(), r = Object.entries(t).sort(
      (l, i) => parseInt(l[0], 10) - parseInt(i[0], 10)
    );
    for (const [l, i] of r) {
      const m = parseInt(l, 10), h = (o = i.isLocal) != null ? o : !0, N = K(
        i.collectionName || ""
      ), s = i.collectionId || i.collectionGuid || `temp:${m}:${N}`, A = I({
        collectionName: N,
        collectionId: s,
        isLocal: h,
        modes: i.modes || []
      }, i.collectionGuid && {
        collectionGuid: i.collectionGuid
      });
      n.collectionMap.set(s, m), n.collections[m] = A, W(N) && n.normalizedNameMap.set(N, m), n.nextIndex = Math.max(
        n.nextIndex,
        m + 1
      );
    }
    return n;
  }
  /**
   * Gets the total number of collections in the table
   */
  getSize() {
    return this.collections.length;
  }
}
const ot = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, it = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function st(e) {
  var n;
  const t = e.toUpperCase();
  return (n = ot[t]) != null ? n : e;
}
function ct(e) {
  var t;
  return typeof e == "number" ? (t = it[e]) != null ? t : e.toString() : e;
}
class le {
  constructor() {
    F(this, "variableMap");
    // variableKey -> index
    F(this, "variables");
    // index -> variable data
    F(this, "nextIndex");
    this.variableMap = /* @__PURE__ */ new Map(), this.variables = [], this.nextIndex = 0;
  }
  /**
   * Adds a variable to the table if it doesn't already exist
   * Returns the index of the variable (existing or newly added)
   */
  addVariable(t) {
    const n = t.variableKey;
    if (!n)
      return -1;
    if (this.variableMap.has(n))
      return this.variableMap.get(n);
    const r = this.nextIndex++;
    return this.variableMap.set(n, r), this.variables[r] = t, r;
  }
  /**
   * Gets the index of a variable by its variableKey
   * Returns -1 if not found
   */
  getVariableIndex(t) {
    var n;
    return (n = this.variableMap.get(t)) != null ? n : -1;
  }
  /**
   * Gets a variable entry by index
   */
  getVariableByIndex(t) {
    return this.variables[t];
  }
  /**
   * Gets the complete table as an object with string keys
   * Used for JSON serialization
   * Includes all fields (for backward compatibility)
   */
  getTable() {
    const t = {};
    for (let n = 0; n < this.variables.length; n++)
      t[String(n)] = this.variables[n];
    return t;
  }
  /**
   * Serializes valuesByMode, removing type and id from VariableAliasSerialized objects
   * Only keeps _varRef since that's sufficient to identify a variable reference
   */
  serializeValuesByMode(t) {
    if (!t)
      return;
    const n = {};
    for (const [r, o] of Object.entries(t))
      typeof o == "object" && o !== null && "_varRef" in o && typeof o._varRef == "number" ? n[r] = {
        _varRef: o._varRef
      } : n[r] = o;
    return n;
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
    const t = {};
    for (let n = 0; n < this.variables.length; n++) {
      const r = this.variables[n], o = this.serializeValuesByMode(
        r.valuesByMode
      ), l = I(I({
        variableName: r.variableName,
        variableType: st(r.variableType)
      }, r._colRef !== void 0 && { _colRef: r._colRef }), o && { valuesByMode: o });
      t[String(n)] = l;
    }
    return t;
  }
  /**
   * Reconstructs a VariableTable from a serialized table object
   * Handles both new format (without variableKey) and legacy format (with variableKey)
   * Expands compressed variable types (numbers) back to strings
   */
  static fromTable(t) {
    const n = new le(), r = Object.entries(t).sort(
      (o, l) => parseInt(o[0], 10) - parseInt(l[0], 10)
    );
    for (const [o, l] of r) {
      const i = parseInt(o, 10), m = ct(l.variableType), h = V(I({}, l), {
        variableType: m
        // Always a string after expansion
      });
      n.variables[i] = h, n.nextIndex = Math.max(n.nextIndex, i + 1);
    }
    return n;
  }
  /**
   * Gets the total number of variables in the table
   */
  getSize() {
    return this.variables.length;
  }
}
function lt(e) {
  return {
    _varRef: e
  };
}
function Re(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let dt = 0;
const X = /* @__PURE__ */ new Map();
function pt(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const t = X.get(e.requestId);
  t && (X.delete(e.requestId), e.error || !e.guid ? t.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : t.resolve(e.guid));
}
function Ce() {
  return new Promise((e, t) => {
    const n = `guid_${Date.now()}_${++dt}`;
    X.set(n, { resolve: e, reject: t }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: n
    }), setTimeout(() => {
      X.has(n) && (X.delete(n), t(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
async function ne() {
  return new Promise((e) => setTimeout(e, 0));
}
const a = {
  clear: async () => {
    console.clear(), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: "__CLEAR__"
      }
    }), await ne();
  },
  log: async (e) => {
    console.log(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    }), await ne();
  },
  warning: async (e) => {
    console.warn(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    }), await ne();
  },
  error: async (e) => {
    console.error(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    }), await ne();
  }
};
function mt(e, t) {
  const n = t.modes.find((r) => r.modeId === e);
  return n ? n.name : e;
}
async function ke(e, t, n, r, o = /* @__PURE__ */ new Set()) {
  const l = {};
  for (const [i, m] of Object.entries(e)) {
    const h = mt(i, r);
    if (m == null) {
      l[h] = m;
      continue;
    }
    if (typeof m == "string" || typeof m == "number" || typeof m == "boolean") {
      l[h] = m;
      continue;
    }
    if (typeof m == "object" && m !== null && "type" in m && m.type === "VARIABLE_ALIAS" && "id" in m) {
      const N = m.id;
      if (o.has(N)) {
        l[h] = {
          type: "VARIABLE_ALIAS",
          id: N
        };
        continue;
      }
      const s = await figma.variables.getVariableByIdAsync(N);
      if (!s) {
        l[h] = {
          type: "VARIABLE_ALIAS",
          id: N
        };
        continue;
      }
      const A = new Set(o);
      A.add(N);
      const $ = await figma.variables.getVariableCollectionByIdAsync(
        s.variableCollectionId
      ), c = s.key;
      if (!c) {
        l[h] = {
          type: "VARIABLE_ALIAS",
          id: N
        };
        continue;
      }
      const g = {
        variableName: s.name,
        variableType: s.resolvedType,
        collectionName: $ == null ? void 0 : $.name,
        collectionId: s.variableCollectionId,
        variableKey: c,
        id: N,
        isLocal: !s.remote
      };
      if ($) {
        const u = await _e(
          $,
          n
        );
        g._colRef = u, s.valuesByMode && (g.valuesByMode = await ke(
          s.valuesByMode,
          t,
          n,
          $,
          // Pass collection for mode ID to name conversion
          A
        ));
      }
      const d = t.addVariable(g);
      l[h] = {
        type: "VARIABLE_ALIAS",
        id: N,
        _varRef: d
      };
    } else
      l[h] = m;
  }
  return l;
}
const re = "recursica:collectionId";
async function ft(e) {
  if (e.remote === !0) {
    const n = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(n)) {
      const o = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await a.error(o), new Error(o);
    }
    return e.id;
  } else {
    if (W(e.name)) {
      const o = Ae(e.name);
      if (o) {
        const l = e.getSharedPluginData(
          "recursica",
          re
        );
        return (!l || l.trim() === "") && e.setSharedPluginData(
          "recursica",
          re,
          o
        ), o;
      }
    }
    const n = e.getSharedPluginData(
      "recursica",
      re
    );
    if (n && n.trim() !== "")
      return n;
    const r = await Ce();
    return e.setSharedPluginData("recursica", re, r), r;
  }
}
function gt(e, t) {
  if (t)
    return;
  const n = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(n))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function _e(e, t) {
  const n = !e.remote, r = t.getCollectionIndex(e.id);
  if (r !== -1)
    return r;
  gt(e.name, n);
  const o = await ft(e), l = e.modes.map((N) => N.name), i = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: n,
    modes: l,
    collectionGuid: o
  }, m = t.addCollection(i), h = n ? "local" : "remote";
  return await a.log(
    `  Added ${h} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), m;
}
async function Te(e, t, n) {
  if (!e || typeof e != "object" || e.type !== "VARIABLE_ALIAS")
    return null;
  try {
    const r = await figma.variables.getVariableByIdAsync(e.id);
    if (!r)
      return console.log("Could not resolve variable alias:", e.id), null;
    const o = await figma.variables.getVariableCollectionByIdAsync(
      r.variableCollectionId
    );
    if (!o)
      return console.log("Could not resolve collection for variable:", e.id), null;
    const l = r.key;
    if (!l)
      return console.log("Variable missing key:", e.id), null;
    const i = await _e(
      o,
      n
    ), m = {
      variableName: r.name,
      variableType: r.resolvedType,
      _colRef: i,
      // Reference to collection table (v2.4.0+)
      variableKey: l,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    r.valuesByMode && (m.valuesByMode = await ke(
      r.valuesByMode,
      t,
      n,
      o,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const h = t.addVariable(m);
    return lt(h);
  } catch (r) {
    const o = r instanceof Error ? r.message : String(r);
    throw console.error("Could not resolve variable alias:", e.id, r), new Error(
      `Failed to resolve variable alias ${e.id}: ${o}`
    );
  }
}
async function ie(e, t, n) {
  if (!e || typeof e != "object") return e;
  const r = {};
  for (const o in e)
    if (Object.prototype.hasOwnProperty.call(e, o)) {
      const l = e[o];
      if (l && typeof l == "object" && !Array.isArray(l))
        if (l.type === "VARIABLE_ALIAS") {
          const i = await Te(
            l,
            t,
            n
          );
          i && (r[o] = i);
        } else
          r[o] = await ie(
            l,
            t,
            n
          );
      else Array.isArray(l) ? r[o] = await Promise.all(
        l.map(async (i) => (i == null ? void 0 : i.type) === "VARIABLE_ALIAS" ? await Te(
          i,
          t,
          n
        ) || i : i && typeof i == "object" ? await ie(
          i,
          t,
          n
        ) : i)
      ) : r[o] = l;
    }
  return r;
}
async function ut(e, t, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (r) => {
      if (!r || typeof r != "object") return r;
      const o = {};
      for (const l in r)
        Object.prototype.hasOwnProperty.call(r, l) && (l === "boundVariables" ? o[l] = await ie(
          r[l],
          t,
          n
        ) : o[l] = r[l]);
      return o;
    })
  );
}
async function Le(e, t) {
  const n = {}, r = /* @__PURE__ */ new Set();
  if (e.type && (n.type = e.type, r.add("type")), e.id && (n.id = e.id, r.add("id")), e.name !== void 0 && e.name !== "" && (n.name = e.name, r.add("name")), e.x !== void 0 && e.x !== 0 && (n.x = e.x, r.add("x")), e.y !== void 0 && e.y !== 0 && (n.y = e.y, r.add("y")), e.width !== void 0 && (n.width = e.width, r.add("width")), e.height !== void 0 && (n.height = e.height, r.add("height")), e.visible !== void 0 && T(e.visible, z.visible) && (n.visible = e.visible, r.add("visible")), e.locked !== void 0 && T(e.locked, z.locked) && (n.locked = e.locked, r.add("locked")), e.opacity !== void 0 && T(e.opacity, z.opacity) && (n.opacity = e.opacity, r.add("opacity")), e.rotation !== void 0 && T(e.rotation, z.rotation) && (n.rotation = e.rotation, r.add("rotation")), e.blendMode !== void 0 && T(e.blendMode, z.blendMode) && (n.blendMode = e.blendMode, r.add("blendMode")), e.effects !== void 0 && T(e.effects, z.effects) && (n.effects = e.effects, r.add("effects")), e.fills !== void 0) {
    const o = await ut(
      e.fills,
      t.variableTable,
      t.collectionTable
    );
    T(o, z.fills) && (n.fills = o), r.add("fills");
  }
  if (e.strokes !== void 0 && T(e.strokes, z.strokes) && (n.strokes = e.strokes, r.add("strokes")), e.strokeWeight !== void 0 && T(e.strokeWeight, z.strokeWeight) && (n.strokeWeight = e.strokeWeight, r.add("strokeWeight")), e.strokeAlign !== void 0 && T(e.strokeAlign, z.strokeAlign) && (n.strokeAlign = e.strokeAlign, r.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const o = await ie(
      e.boundVariables,
      t.variableTable,
      t.collectionTable
    );
    Object.keys(o).length > 0 && (n.boundVariables = o), r.add("boundVariables");
  }
  return e.backgrounds !== void 0 && (n.backgrounds = e.backgrounds, r.add("backgrounds")), n;
}
const ht = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseBaseNodeProperties: Le
}, Symbol.toStringTag, { value: "Module" }));
async function we(e, t) {
  const n = {}, r = /* @__PURE__ */ new Set();
  if (e.type === "COMPONENT")
    try {
      e.componentPropertyDefinitions && (n.componentPropertyDefinitions = e.componentPropertyDefinitions, r.add("componentPropertyDefinitions"));
    } catch (o) {
    }
  return e.layoutMode !== void 0 && T(e.layoutMode, L.layoutMode) && (n.layoutMode = e.layoutMode, r.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && T(
    e.primaryAxisSizingMode,
    L.primaryAxisSizingMode
  ) && (n.primaryAxisSizingMode = e.primaryAxisSizingMode, r.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && T(
    e.counterAxisSizingMode,
    L.counterAxisSizingMode
  ) && (n.counterAxisSizingMode = e.counterAxisSizingMode, r.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && T(
    e.primaryAxisAlignItems,
    L.primaryAxisAlignItems
  ) && (n.primaryAxisAlignItems = e.primaryAxisAlignItems, r.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && T(
    e.counterAxisAlignItems,
    L.counterAxisAlignItems
  ) && (n.counterAxisAlignItems = e.counterAxisAlignItems, r.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && T(e.paddingLeft, L.paddingLeft) && (n.paddingLeft = e.paddingLeft, r.add("paddingLeft")), e.paddingRight !== void 0 && T(e.paddingRight, L.paddingRight) && (n.paddingRight = e.paddingRight, r.add("paddingRight")), e.paddingTop !== void 0 && T(e.paddingTop, L.paddingTop) && (n.paddingTop = e.paddingTop, r.add("paddingTop")), e.paddingBottom !== void 0 && T(e.paddingBottom, L.paddingBottom) && (n.paddingBottom = e.paddingBottom, r.add("paddingBottom")), e.itemSpacing !== void 0 && T(e.itemSpacing, L.itemSpacing) && (n.itemSpacing = e.itemSpacing, r.add("itemSpacing")), e.cornerRadius !== void 0 && T(e.cornerRadius, L.cornerRadius) && (n.cornerRadius = e.cornerRadius, r.add("cornerRadius")), e.clipsContent !== void 0 && T(e.clipsContent, L.clipsContent) && (n.clipsContent = e.clipsContent, r.add("clipsContent")), e.layoutWrap !== void 0 && T(e.layoutWrap, L.layoutWrap) && (n.layoutWrap = e.layoutWrap, r.add("layoutWrap")), e.layoutGrow !== void 0 && T(e.layoutGrow, L.layoutGrow) && (n.layoutGrow = e.layoutGrow, r.add("layoutGrow")), n;
}
const yt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseFrameProperties: we
}, Symbol.toStringTag, { value: "Module" }));
async function wt(e, t) {
  const n = {}, r = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (n.characters = e.characters, r.add("characters")), e.fontName !== void 0 && (n.fontName = e.fontName, r.add("fontName")), e.fontSize !== void 0 && (n.fontSize = e.fontSize, r.add("fontSize")), e.textAlignHorizontal !== void 0 && T(
    e.textAlignHorizontal,
    U.textAlignHorizontal
  ) && (n.textAlignHorizontal = e.textAlignHorizontal, r.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && T(
    e.textAlignVertical,
    U.textAlignVertical
  ) && (n.textAlignVertical = e.textAlignVertical, r.add("textAlignVertical")), e.letterSpacing !== void 0 && T(e.letterSpacing, U.letterSpacing) && (n.letterSpacing = e.letterSpacing, r.add("letterSpacing")), e.lineHeight !== void 0 && T(e.lineHeight, U.lineHeight) && (n.lineHeight = e.lineHeight, r.add("lineHeight")), e.textCase !== void 0 && T(e.textCase, U.textCase) && (n.textCase = e.textCase, r.add("textCase")), e.textDecoration !== void 0 && T(e.textDecoration, U.textDecoration) && (n.textDecoration = e.textDecoration, r.add("textDecoration")), e.textAutoResize !== void 0 && T(e.textAutoResize, U.textAutoResize) && (n.textAutoResize = e.textAutoResize, r.add("textAutoResize")), e.paragraphSpacing !== void 0 && T(
    e.paragraphSpacing,
    U.paragraphSpacing
  ) && (n.paragraphSpacing = e.paragraphSpacing, r.add("paragraphSpacing")), e.paragraphIndent !== void 0 && T(e.paragraphIndent, U.paragraphIndent) && (n.paragraphIndent = e.paragraphIndent, r.add("paragraphIndent")), e.listOptions !== void 0 && T(e.listOptions, U.listOptions) && (n.listOptions = e.listOptions, r.add("listOptions")), n;
}
function Nt(e) {
  const t = e.match(/^(\d+\.?\d*)[eE]([+-]?\d+)$/);
  if (t) {
    const n = parseFloat(t[1]), r = parseInt(t[2]), o = n * Math.pow(10, r);
    return Math.abs(o) < 1e-10 ? "0" : o.toFixed(6).replace(/\.?0+$/, "") || "0";
  }
  return e;
}
function ze(e) {
  if (!e || typeof e != "string")
    return e;
  let t = e.replace(/(\d+\.?\d*)[eE]([+-]?\d+)/g, (n) => Nt(n));
  return t = t.replace(
    /(\d+\.\d{7,})/g,
    // Match numbers with more than 6 decimal places
    (n) => {
      const r = parseFloat(n);
      return Math.abs(r) < 1e-10 ? "0" : r.toFixed(6).replace(/\.?0+$/, "") || "0";
    }
  ), t = t.replace(
    /([MmLlHhVvCcSsQqTtAaZz])([-\d])/g,
    (n, r, o) => `${r} ${o}`
  ), t = t.replace(/\s+/g, " ").trim(), t;
}
function Ne(e) {
  return Array.isArray(e) ? e.map((t) => ({
    data: ze(t.data),
    // Normalize winding rule key (use windRule consistently)
    windRule: t.windRule || t.windingRule || "NONZERO"
  })) : e;
}
const bt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  normalizeSvgPath: ze,
  normalizeVectorGeometry: Ne
}, Symbol.toStringTag, { value: "Module" }));
async function vt(e, t) {
  const n = {}, r = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && T(e.fillGeometry, H.fillGeometry) && (n.fillGeometry = Ne(e.fillGeometry), r.add("fillGeometry")), e.strokeGeometry !== void 0 && T(e.strokeGeometry, H.strokeGeometry) && (n.strokeGeometry = Ne(e.strokeGeometry), r.add("strokeGeometry")), e.strokeCap !== void 0 && T(e.strokeCap, H.strokeCap) && (n.strokeCap = e.strokeCap, r.add("strokeCap")), e.strokeJoin !== void 0 && T(e.strokeJoin, H.strokeJoin) && (n.strokeJoin = e.strokeJoin, r.add("strokeJoin")), e.dashPattern !== void 0 && T(e.dashPattern, H.dashPattern) && (n.dashPattern = e.dashPattern, r.add("dashPattern")), n;
}
async function At(e, t) {
  const n = {}, r = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && T(e.cornerRadius, xe.cornerRadius) && (n.cornerRadius = e.cornerRadius, r.add("cornerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, r.add("pointCount")), e.innerRadius !== void 0 && (n.innerRadius = e.innerRadius, r.add("innerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, r.add("pointCount")), n;
}
const ae = /* @__PURE__ */ new Map();
let Ct = 0;
function $t() {
  return `prompt_${Date.now()}_${++Ct}`;
}
const q = {
  /**
   * Prompt the user with a message and wait for OK or Cancel response
   * @param message - The message to display to the user
   * @param optionsOrTimeout - Optional configuration object or timeout in milliseconds (for backwards compatibility)
   * @param optionsOrTimeout.timeoutMs - Timeout in milliseconds. Defaults to 300000 (5 minutes). Set to -1 for no timeout.
   * @param optionsOrTimeout.okLabel - Custom label for the OK button. Defaults to "OK".
   * @param optionsOrTimeout.cancelLabel - Custom label for the cancel button. Defaults to "Cancel".
   * @returns Promise that resolves on OK, rejects on Cancel or timeout
   */
  prompt: (e, t) => {
    var m;
    const n = typeof t == "number" ? { timeoutMs: t } : t, r = (m = n == null ? void 0 : n.timeoutMs) != null ? m : 3e5, o = n == null ? void 0 : n.okLabel, l = n == null ? void 0 : n.cancelLabel, i = $t();
    return new Promise((h, N) => {
      const s = r === -1 ? null : setTimeout(() => {
        ae.delete(i), N(new Error(`Plugin prompt timeout: ${e}`));
      }, r);
      ae.set(i, {
        resolve: h,
        reject: N,
        timeout: s
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: I(I({
          message: e,
          requestId: i
        }, o && { okLabel: o }), l && { cancelLabel: l })
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
    const { requestId: t, action: n } = e, r = ae.get(t);
    if (!r) {
      console.warn(
        `Received response for unknown prompt request: ${t}`
      );
      return;
    }
    r.timeout && clearTimeout(r.timeout), ae.delete(t), n === "ok" ? r.resolve() : r.reject(new Error("User cancelled"));
  }
}, Pt = "RecursicaPublishedMetadata";
function ye(e) {
  let t = e, n = !1;
  try {
    if (n = t.parent !== null && t.parent !== void 0, !n)
      return { page: null, reason: "detached" };
  } catch (r) {
    return { page: null, reason: "detached" };
  }
  for (; t; ) {
    if (t.type === "PAGE")
      return { page: t, reason: "found" };
    try {
      const r = t.parent;
      if (!r)
        return { page: null, reason: "broken_chain" };
      t = r;
    } catch (r) {
      return { page: null, reason: "access_error" };
    }
  }
  return { page: null, reason: "broken_chain" };
}
function Se(e) {
  try {
    const t = e.getPluginData(Pt);
    if (!t || t.trim() === "")
      return null;
    const n = JSON.parse(t);
    return {
      id: n.id,
      version: n.version
    };
  } catch (t) {
    return null;
  }
}
async function Et(e, t) {
  const n = {}, r = /* @__PURE__ */ new Set();
  if (n._isInstance = !0, r.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const o = await e.getMainComponentAsync();
    if (!o) {
      const p = e.name || "(unnamed)", y = e.id;
      if (t.detachedComponentsHandled.has(y))
        await a.log(
          `Treating detached instance "${p}" as internal instance (already prompted)`
        );
      else {
        await a.warning(
          `Found detached instance: "${p}" (main component is missing)`
        );
        const k = `Found detached instance "${p}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await q.prompt(k, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(y), await a.log(
            `Treating detached instance "${p}" as internal instance`
          );
        } catch (G) {
          if (G instanceof Error && G.message === "User cancelled") {
            const x = `Export cancelled: Detached instance "${p}" found. Please fix the instance before exporting.`;
            await a.error(x);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch (R) {
              console.warn("Could not scroll to instance:", R);
            }
            throw new Error(x);
          } else
            throw G;
        }
      }
      if (!ye(e).page) {
        const k = `Detached instance "${p}" is not on any page. Cannot export.`;
        throw await a.error(k), new Error(k);
      }
      let P, E;
      try {
        e.variantProperties && (P = e.variantProperties), e.componentProperties && (E = e.componentProperties);
      } catch (k) {
      }
      const S = I(I({
        instanceType: "internal",
        componentName: p,
        componentNodeId: e.id
      }, P && { variantProperties: P }), E && { componentProperties: E }), O = t.instanceTable.addInstance(S);
      return n._instanceRef = O, r.add("_instanceRef"), await a.log(
        `  Exported detached INSTANCE: "${p}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), n;
    }
    const l = e.name || "(unnamed)", i = o.name || "(unnamed)", m = o.remote === !0, N = ye(e).page, s = ye(o), A = s.page;
    let $, c = A;
    if (m)
      if (A) {
        const p = Se(A);
        p != null && p.id ? ($ = "normal", c = A, await a.log(
          `  Component "${i}" is from library but also exists on local page "${A.name}" with metadata. Treating as "normal" instance.`
        )) : ($ = "remote", await a.log(
          `  Component "${i}" is from library and exists on local page "${A.name}" but has no metadata. Treating as "remote" instance.`
        ));
      } else
        $ = "remote", await a.log(
          `  Component "${i}" is from library and not on a local page. Treating as "remote" instance.`
        );
    else if (A && N && A.id === N.id)
      $ = "internal";
    else if (A && N && A.id !== N.id)
      $ = "normal";
    else if (A && !N)
      $ = "normal";
    else if (!m && s.reason === "detached") {
      const p = o.id;
      if (t.detachedComponentsHandled.has(p))
        $ = "remote", await a.log(
          `Treating detached instance "${l}" -> component "${i}" as remote instance (already prompted)`
        );
      else {
        await a.warning(
          `Found detached instance: "${l}" -> component "${i}" (component is not on any page)`
        );
        try {
          await figma.viewport.scrollAndZoomIntoView([o]);
        } catch (w) {
          console.warn("Could not scroll to component:", w);
        }
        const y = `Found detached instance "${l}" attached to component "${i}". This should be fixed. Continue to publish?`;
        try {
          await q.prompt(y, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(p), $ = "remote", await a.log(
            `Treating detached instance "${l}" as remote instance (will be created on REMOTES page)`
          );
        } catch (w) {
          if (w instanceof Error && w.message === "User cancelled") {
            const b = `Export cancelled: Detached instance "${l}" found. The component "${i}" is not on any page. Please fix the instance before exporting.`;
            throw await a.error(b), new Error(b);
          } else
            throw w;
        }
      }
    } else
      m || await a.warning(
        `  Instance "${l}" -> component "${i}": componentPage is null but component is not remote. Reason: ${s.reason}. Cannot determine instance type.`
      ), $ = "normal";
    let g, d;
    try {
      e.variantProperties && (g = e.variantProperties), e.componentProperties && (d = e.componentProperties);
    } catch (p) {
    }
    let u, v;
    try {
      let p = o.parent;
      const y = [];
      let w = 0;
      const b = 20;
      for (; p && w < b; )
        try {
          const P = p.type, E = p.name;
          if (P === "COMPONENT_SET" && !v && (v = E), P === "PAGE")
            break;
          const S = E || "";
          y.unshift(S), p = p.parent, w++;
        } catch (P) {
          break;
        }
      u = y;
    } catch (p) {
    }
    const C = I(I(I(I({
      instanceType: $,
      componentName: i
    }, v && { componentSetName: v }), g && { variantProperties: g }), d && { componentProperties: d }), $ === "normal" ? { path: u || [] } : u && u.length > 0 && {
      path: u
    });
    if ($ === "internal")
      C.componentNodeId = o.id, await a.log(
        `  Found INSTANCE: "${l}" -> INTERNAL component "${i}" (ID: ${o.id.substring(0, 8)}...)`
      );
    else if ($ === "normal") {
      const p = c || A;
      if (p) {
        C.componentPageName = p.name;
        const w = Se(p);
        w != null && w.id && w.version !== void 0 ? (C.componentGuid = w.id, C.componentVersion = w.version, await a.log(
          `  Found INSTANCE: "${l}" -> NORMAL component "${i}" (ID: ${o.id.substring(0, 8)}...) at path [${(u || []).join(" → ")}]`
        )) : await a.warning(
          `  Instance "${l}" -> component "${i}" is classified as normal but page "${p.name}" has no metadata. This instance will not be importable.`
        );
      } else {
        const w = o.id;
        let b = "", P = "";
        switch (s.reason) {
          case "broken_chain":
            b = "The component's parent chain is broken and cannot be traversed to find the page", P = "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            b = "Cannot access the component's parent chain (access error)", P = "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            b = "Cannot determine which page the component is on", P = "Please ensure the component is properly placed on a page.";
        }
        try {
          await figma.viewport.scrollAndZoomIntoView([o]);
        } catch (O) {
          console.warn("Could not scroll to component:", O);
        }
        const E = `Normal instance "${l}" -> component "${i}" (ID: ${w}) has no componentPage. ${b}. ${P} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", E), await a.error(E);
        const S = new Error(E);
        throw console.error("Throwing error:", S), S;
      }
      u === void 0 && console.warn(
        `Failed to build path for normal instance "${l}" -> component "${i}". Path is required for resolution.`
      );
      const y = u && u.length > 0 ? ` at path [${u.join(" → ")}]` : " at page root";
      await a.log(
        `  Found INSTANCE: "${l}" -> NORMAL component "${i}" (ID: ${o.id.substring(0, 8)}...)${y}`
      );
    } else if ($ === "remote") {
      let p, y;
      const w = t.detachedComponentsHandled.has(
        o.id
      );
      if (!w)
        try {
          if (typeof o.getPublishStatusAsync == "function")
            try {
              const b = await o.getPublishStatusAsync();
              b && typeof b == "object" && (b.libraryName && (p = b.libraryName), b.libraryKey && (y = b.libraryKey));
            } catch (b) {
            }
          try {
            const b = figma.teamLibrary;
            if (typeof (b == null ? void 0 : b.getAvailableLibraryComponentSetsAsync) == "function") {
              const P = await b.getAvailableLibraryComponentSetsAsync();
              if (P && Array.isArray(P)) {
                for (const E of P)
                  if (E.key === o.key || E.name === o.name) {
                    E.libraryName && (p = E.libraryName), E.libraryKey && (y = E.libraryKey);
                    break;
                  }
              }
            }
          } catch (b) {
          }
        } catch (b) {
          console.warn(
            `Error getting library info for remote component "${i}":`,
            b
          );
        }
      try {
        const { parseBaseNodeProperties: b } = await Promise.resolve().then(() => ht), P = await b(e, t), { parseFrameProperties: E } = await Promise.resolve().then(() => yt), S = await E(e, t), O = V(I(I({}, P), S), {
          type: "COMPONENT"
          // Convert to COMPONENT type for recreation (must be after baseProps to override)
        });
        if (e.children && Array.isArray(e.children) && e.children.length > 0) {
          const k = V(I({}, t), {
            depth: (t.depth || 0) + 1
          }), { extractNodeData: G } = await Promise.resolve().then(() => Mt), x = [];
          for (const R of e.children)
            try {
              let M;
              if (R.type === "INSTANCE")
                try {
                  const _ = await R.getMainComponentAsync();
                  if (_) {
                    const D = await b(
                      R,
                      t
                    ), ee = await E(
                      R,
                      t
                    ), fe = await G(
                      _,
                      /* @__PURE__ */ new WeakSet(),
                      k
                    );
                    M = V(I(I(I({}, fe), D), ee), {
                      type: "COMPONENT"
                      // Convert to COMPONENT
                    });
                  } else
                    M = await G(
                      R,
                      /* @__PURE__ */ new WeakSet(),
                      k
                    ), M.type === "INSTANCE" && (M.type = "COMPONENT"), delete M._instanceRef;
                } catch (_) {
                  M = await G(
                    R,
                    /* @__PURE__ */ new WeakSet(),
                    k
                  ), M.type === "INSTANCE" && (M.type = "COMPONENT"), delete M._instanceRef;
                }
              else
                M = await G(
                  R,
                  /* @__PURE__ */ new WeakSet(),
                  k
                );
              x.push(M);
            } catch (M) {
              console.warn(
                `Failed to extract child "${R.name || "Unnamed"}" for remote component "${i}":`,
                M
              );
            }
          O.children = x;
        }
        if (!O)
          throw new Error("Failed to build structure for remote instance");
        C.structure = O, w ? await a.log(
          `  Extracted structure for detached component "${i}" (ID: ${o.id.substring(0, 8)}...)`
        ) : await a.log(
          `  Extracted structure from instance for remote component "${i}" (preserving size overrides: ${e.width}x${e.height})`
        );
      } catch (b) {
        const P = `Failed to extract structure for remote component "${i}": ${b instanceof Error ? b.message : String(b)}`;
        console.error(P, b), await a.error(P);
      }
      p && (C.remoteLibraryName = p), y && (C.remoteLibraryKey = y), w && (C.componentNodeId = o.id), await a.log(
        `  Found INSTANCE: "${l}" -> REMOTE component "${i}" (ID: ${o.id.substring(0, 8)}...)${w ? " [DETACHED]" : ""}`
      );
    }
    const f = t.instanceTable.addInstance(C);
    n._instanceRef = f, r.add("_instanceRef");
  }
  return n;
}
class Q {
  constructor() {
    F(this, "instanceMap");
    // unique key -> index
    F(this, "instances");
    // index -> instance data
    F(this, "nextIndex");
    this.instanceMap = /* @__PURE__ */ new Map(), this.instances = [], this.nextIndex = 0;
  }
  /**
   * Generates a unique key for an instance based on its type
   */
  generateKey(t) {
    return t.instanceType === "internal" && t.componentNodeId ? `internal:${t.componentNodeId}` : t.instanceType === "normal" && t.componentGuid && t.componentVersion !== void 0 ? `normal:${t.componentGuid}:${t.componentVersion}` : t.instanceType === "remote" && t.remoteLibraryKey ? `remote:${t.remoteLibraryKey}:${t.componentName}` : t.instanceType === "remote" && t.componentNodeId ? `remote:detached:${t.componentNodeId}` : `${t.instanceType}:${t.componentName}:COMPONENT`;
  }
  /**
   * Adds an instance to the table if it doesn't already exist
   * Returns the index of the instance (existing or newly added)
   */
  addInstance(t) {
    const n = this.generateKey(t);
    if (this.instanceMap.has(n))
      return this.instanceMap.get(n);
    const r = this.nextIndex++;
    return this.instanceMap.set(n, r), this.instances[r] = t, r;
  }
  /**
   * Gets the index of an instance by its unique key
   * Returns -1 if not found
   */
  getInstanceIndex(t) {
    var r;
    const n = this.generateKey(t);
    return (r = this.instanceMap.get(n)) != null ? r : -1;
  }
  /**
   * Gets an instance entry by index
   */
  getInstanceByIndex(t) {
    return this.instances[t];
  }
  /**
   * Gets the complete table as an object with string keys
   * Used for JSON serialization
   */
  getSerializedTable() {
    const t = {};
    for (let n = 0; n < this.instances.length; n++)
      t[String(n)] = this.instances[n];
    return t;
  }
  /**
   * Reconstructs an InstanceTable from a serialized table object
   */
  static fromTable(t) {
    const n = new Q(), r = Object.entries(t).sort(
      (o, l) => parseInt(o[0], 10) - parseInt(l[0], 10)
    );
    for (const [o, l] of r) {
      const i = parseInt(o, 10), m = n.generateKey(l);
      n.instanceMap.set(m, i), n.instances[i] = l, n.nextIndex = Math.max(n.nextIndex, i + 1);
    }
    return n;
  }
  /**
   * Gets the total number of instances in the table
   */
  getSize() {
    return this.instances.length;
  }
}
const Ve = {
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
  PASS_THROUGH: 31
};
function Tt() {
  const e = {};
  for (const [t, n] of Object.entries(Ve))
    e[n] = t;
  return e;
}
function Oe(e) {
  var t;
  return (t = Ve[e]) != null ? t : e;
}
function St(e) {
  var t;
  return typeof e == "number" ? (t = Tt()[e]) != null ? t : e.toString() : e;
}
const Ge = {
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
  libraryName: "libNm"
  // Different from remoteLibraryName (rLibN)
}, be = {};
for (const [e, t] of Object.entries(Ge))
  be[t] = e;
class de {
  constructor() {
    F(this, "shortToLong");
    F(this, "longToShort");
    this.shortToLong = I({}, be), this.longToShort = I({}, Ge);
  }
  /**
   * Gets the short name for a long property name
   * Returns the short name if mapped, otherwise returns the original
   */
  getShortName(t) {
    return this.longToShort[t] || t;
  }
  /**
   * Gets the long name for a short property name
   * Returns the long name if mapped, otherwise returns the original
   */
  getLongName(t) {
    return this.shortToLong[t] || t;
  }
  /**
   * Recursively replaces all keys in an object with their short names
   * Handles nested objects and arrays
   * Collision detection: if a short name already exists as a key, keep the original key
   * Also compresses special values: node "type" field values and variable "type" field values
   */
  compressObject(t) {
    if (t == null)
      return t;
    if (Array.isArray(t))
      return t.map((n) => this.compressObject(n));
    if (typeof t == "object") {
      const n = {}, r = /* @__PURE__ */ new Set();
      for (const o of Object.keys(t))
        r.add(o);
      for (const [o, l] of Object.entries(t)) {
        const i = this.getShortName(o);
        if (i !== o && !r.has(i)) {
          let m = this.compressObject(l);
          i === "type" && typeof m == "string" && (m = Oe(m)), n[i] = m;
        } else {
          let m = this.compressObject(l);
          o === "type" && typeof m == "string" && (m = Oe(m)), n[o] = m;
        }
      }
      return n;
    }
    return t;
  }
  /**
   * Recursively replaces all keys in an object with their long names
   * Handles nested objects and arrays
   * Also expands special values: node "type" field values and variable "type" field values
   */
  expandObject(t) {
    if (t == null)
      return t;
    if (Array.isArray(t))
      return t.map((n) => this.expandObject(n));
    if (typeof t == "object") {
      const n = {};
      for (const [r, o] of Object.entries(t)) {
        const l = this.getLongName(r);
        let i = this.expandObject(o);
        (l === "type" || r === "type") && (typeof i == "number" || typeof i == "string") && (i = St(i)), n[l] = i;
      }
      return n;
    }
    return t;
  }
  /**
   * Gets the serialized string table for JSON export
   * Returns the mapping of short -> long names
   */
  getSerializedTable() {
    return I({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(t) {
    const n = new de();
    n.shortToLong = I(I({}, be), t), n.longToShort = {};
    for (const [r, o] of Object.entries(
      n.shortToLong
    ))
      n.longToShort[o] = r;
    return n;
  }
}
function Ot(e, t) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const n = {};
  e.metadata && (n.metadata = e.metadata);
  for (const [r, o] of Object.entries(e))
    r !== "metadata" && (n[r] = t.compressObject(o));
  return n;
}
function It(e, t) {
  return t.expandObject(e);
}
function se(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
function pe(e) {
  let t = 1;
  return e.children && e.children.length > 0 && e.children.forEach((n) => {
    t += pe(n);
  }), t;
}
async function me(e, t = /* @__PURE__ */ new WeakSet(), n = {}) {
  var c, g, d, u, v, C;
  if (!e || typeof e != "object")
    return e;
  const r = (c = n.maxNodes) != null ? c : 1e4, o = (g = n.nodeCount) != null ? g : 0;
  if (o >= r)
    return await a.warning(
      `Maximum node count (${r}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${r}) reached`,
      _nodeCount: o
    };
  const l = {
    visited: (d = n.visited) != null ? d : /* @__PURE__ */ new WeakSet(),
    depth: (u = n.depth) != null ? u : 0,
    maxDepth: (v = n.maxDepth) != null ? v : 100,
    nodeCount: o + 1,
    maxNodes: r,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: n.variableTable,
    collectionTable: n.collectionTable,
    instanceTable: n.instanceTable,
    detachedComponentsHandled: (C = n.detachedComponentsHandled) != null ? C : /* @__PURE__ */ new Set()
  };
  if (t.has(e))
    return "[Circular Reference]";
  t.add(e), l.visited = t;
  const i = {}, m = await Le(e, l);
  Object.assign(i, m);
  const h = e.type;
  if (h)
    switch (h) {
      case "FRAME":
      case "COMPONENT": {
        const f = await we(e);
        Object.assign(i, f);
        break;
      }
      case "INSTANCE": {
        const f = await Et(
          e,
          l
        );
        Object.assign(i, f);
        const p = await we(
          e
        );
        Object.assign(i, p);
        break;
      }
      case "TEXT": {
        const f = await wt(e);
        Object.assign(i, f);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const f = await vt(e);
        Object.assign(i, f);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const f = await At(e);
        Object.assign(i, f);
        break;
      }
      default:
        l.unhandledKeys.add("_unknownType");
        break;
    }
  const N = Object.getOwnPropertyNames(e), s = /* @__PURE__ */ new Set([
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
  (h === "FRAME" || h === "COMPONENT" || h === "INSTANCE") && (s.add("layoutMode"), s.add("primaryAxisSizingMode"), s.add("counterAxisSizingMode"), s.add("primaryAxisAlignItems"), s.add("counterAxisAlignItems"), s.add("paddingLeft"), s.add("paddingRight"), s.add("paddingTop"), s.add("paddingBottom"), s.add("itemSpacing"), s.add("cornerRadius"), s.add("clipsContent"), s.add("layoutWrap"), s.add("layoutGrow")), h === "TEXT" && (s.add("characters"), s.add("fontName"), s.add("fontSize"), s.add("textAlignHorizontal"), s.add("textAlignVertical"), s.add("letterSpacing"), s.add("lineHeight"), s.add("textCase"), s.add("textDecoration"), s.add("textAutoResize"), s.add("paragraphSpacing"), s.add("paragraphIndent"), s.add("listOptions")), (h === "VECTOR" || h === "LINE") && (s.add("fillGeometry"), s.add("strokeGeometry")), (h === "RECTANGLE" || h === "ELLIPSE" || h === "STAR" || h === "POLYGON") && (s.add("pointCount"), s.add("innerRadius"), s.add("arcData")), h === "INSTANCE" && (s.add("mainComponent"), s.add("componentProperties"));
  for (const f of N)
    typeof e[f] != "function" && (s.has(f) || l.unhandledKeys.add(f));
  l.unhandledKeys.size > 0 && (i._unhandledKeys = Array.from(l.unhandledKeys).sort());
  const A = i._instanceRef !== void 0 && l.instanceTable && h === "INSTANCE";
  let $ = !1;
  if (A) {
    const f = l.instanceTable.getInstanceByIndex(
      i._instanceRef
    );
    f && f.instanceType === "normal" && ($ = !0, await a.log(
      `  Skipping children extraction for normal instance "${i.name || "Unnamed"}" - will be resolved from referenced component`
    ));
  }
  if (!$ && e.children && Array.isArray(e.children)) {
    const f = l.maxDepth;
    if (l.depth >= f)
      i.children = {
        _truncated: !0,
        _reason: `Maximum depth (${f}) reached`,
        _count: e.children.length
      };
    else if (l.nodeCount >= r)
      i.children = {
        _truncated: !0,
        _reason: `Maximum node count (${r}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const p = V(I({}, l), {
        depth: l.depth + 1
      }), y = [];
      let w = !1;
      for (const b of e.children) {
        if (p.nodeCount >= r) {
          i.children = {
            _truncated: !0,
            _reason: `Maximum node count (${r}) reached during children processing`,
            _processed: y.length,
            _total: e.children.length,
            children: y
          }, w = !0;
          break;
        }
        const P = await me(b, t, p);
        y.push(P), p.nodeCount && (l.nodeCount = p.nodeCount);
      }
      w || (i.children = y);
    }
  }
  return i;
}
async function $e(e, t = /* @__PURE__ */ new Set(), n = !1) {
  n || (await a.clear(), await a.log("=== Starting Page Export ==="));
  try {
    const r = e.pageIndex;
    if (r === void 0 || typeof r != "number")
      return await a.error(
        "Invalid page selection: pageIndex is undefined or not a number"
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    await a.log("Loading all pages..."), await figma.loadAllPagesAsync();
    const o = figma.root.children;
    if (await a.log(`Loaded ${o.length} page(s)`), r < 0 || r >= o.length)
      return await a.error(
        `Invalid page index: ${r} (valid range: 0-${o.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const l = o[r], i = l.id;
    if (t.has(i))
      return await a.log(
        `Page "${l.name}" has already been processed, skipping...`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Page already processed",
        data: {}
      };
    t.add(i), await a.log(
      `Selected page: "${l.name}" (index: ${r})`
    ), await a.log(
      "Initializing variable, collection, and instance tables..."
    );
    const m = new le(), h = new ce(), N = new Q();
    await a.log("Fetching team library variable collections...");
    let s = [];
    try {
      if (s = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((R) => ({
        libraryName: R.libraryName,
        key: R.key,
        name: R.name
      })), await a.log(
        `Found ${s.length} library collection(s) in team library`
      ), s.length > 0)
        for (const R of s)
          await a.log(`  - ${R.name} (from ${R.libraryName})`);
    } catch (x) {
      await a.warning(
        `Could not get library variable collections: ${x instanceof Error ? x.message : String(x)}`
      );
    }
    await a.log("Extracting node data from page..."), await a.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await a.log(
      "Collections will be discovered as variables are processed:"
    );
    const A = await me(
      l,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: m,
        collectionTable: h,
        instanceTable: N
      }
    );
    await a.log("Node extraction finished");
    const $ = pe(A), c = m.getSize(), g = h.getSize(), d = N.getSize();
    if (await a.log("Extraction complete:"), await a.log(`  - Total nodes: ${$}`), await a.log(`  - Unique variables: ${c}`), await a.log(`  - Unique collections: ${g}`), await a.log(`  - Unique instances: ${d}`), g > 0) {
      await a.log("Collections found:");
      const x = h.getTable();
      for (const [R, M] of Object.values(x).entries()) {
        const _ = M.collectionGuid ? ` (GUID: ${M.collectionGuid.substring(0, 8)}...)` : "";
        await a.log(
          `  ${R}: ${M.collectionName}${_} - ${M.modes.length} mode(s)`
        );
      }
    }
    await a.log("Checking for referenced component pages...");
    const u = [], v = N.getSerializedTable(), C = Object.values(v).filter(
      (x) => x.instanceType === "normal"
    );
    if (C.length > 0) {
      await a.log(
        `Found ${C.length} normal instance(s) to check`
      );
      const x = /* @__PURE__ */ new Map();
      for (const R of C)
        if (R.componentPageName) {
          const M = o.find((_) => _.name === R.componentPageName);
          if (M && !t.has(M.id))
            x.has(M.id) || x.set(M.id, M);
          else if (!M) {
            const _ = `Normal instance references component "${R.componentName || "(unnamed)"}" on page "${R.componentPageName}", but that page was not found. Cannot export.`;
            throw await a.error(_), new Error(_);
          }
        } else {
          const M = `Normal instance references component "${R.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw await a.error(M), new Error(M);
        }
      await a.log(
        `Found ${x.size} unique referenced page(s)`
      );
      for (const [R, M] of x.entries()) {
        const _ = M.name;
        if (t.has(R)) {
          await a.log(`Skipping "${_}" - already processed`);
          continue;
        }
        const D = M.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let ee = !1;
        if (D)
          try {
            const J = JSON.parse(D);
            ee = !!(J.id && J.version !== void 0);
          } catch (J) {
          }
        const fe = `Do you want to also publish referenced component "${_}"?`;
        try {
          await q.prompt(fe, {
            okLabel: "Yes",
            cancelLabel: "No",
            timeoutMs: 3e5
            // 5 minutes
          }), await a.log(`Exporting referenced page: "${_}"`);
          const J = o.findIndex(
            (ge) => ge.id === M.id
          );
          if (J === -1)
            throw await a.error(
              `Could not find page index for "${_}"`
            ), new Error(`Could not find page index for "${_}"`);
          const te = await $e(
            {
              pageIndex: J
            },
            t,
            // Pass the same set to track all processed pages
            !0
            // Mark as recursive call
          );
          if (te.success && te.data) {
            const ge = te.data;
            u.push(ge), await a.log(
              `Successfully exported referenced page: "${_}"`
            );
          } else
            throw new Error(
              `Failed to export referenced page "${_}": ${te.message}`
            );
        } catch (J) {
          if (J instanceof Error && J.message === "User cancelled")
            if (ee)
              await a.log(
                `User declined to publish "${_}", but page has existing metadata. Continuing with existing metadata.`
              );
            else
              throw await a.error(
                `Export cancelled: Referenced page "${_}" has no metadata and user declined to publish it.`
              ), new Error(
                `Cannot continue export: Referenced component "${_}" has no metadata. Please publish it first or choose to publish it now.`
              );
          else
            throw J;
        }
      }
    }
    await a.log("Creating string table...");
    const f = new de();
    await a.log("Getting page metadata...");
    const p = l.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let y = "", w = 0;
    if (p)
      try {
        const x = JSON.parse(p);
        y = x.id || "", w = x.version || 0;
      } catch (x) {
        await a.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!y) {
      await a.log("Generating new GUID for page..."), y = await Ce();
      const x = {
        _ver: 1,
        id: y,
        name: l.name,
        version: w,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      l.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(x)
      );
    }
    await a.log("Creating export data structure...");
    const b = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "2.7.0",
        // Updated version for string table compression
        figmaApiVersion: figma.apiVersion,
        guid: y,
        version: w,
        name: l.name,
        pluginVersion: "1.0.0"
      },
      stringTable: f.getSerializedTable(),
      collections: h.getSerializedTable(),
      variables: m.getSerializedTable(),
      instances: N.getSerializedTable(),
      libraries: s,
      // Libraries might not need compression, but could be added later
      pageData: A
    };
    await a.log("Compressing JSON data...");
    const P = Ot(b, f);
    await a.log("Serializing to JSON...");
    const E = JSON.stringify(P, null, 2), S = (E.length / 1024).toFixed(2), k = se(l.name).trim().replace(/\s+/g, "_") + ".rec.json";
    return await a.log(`JSON serialization complete: ${S} KB`), await a.log(`Export file: ${k}`), await a.log("=== Export Complete ==="), {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: k,
        jsonData: E,
        pageName: l.name,
        additionalPages: u
        // Populated with referenced component pages
      }
    };
  } catch (r) {
    const o = r instanceof Error ? r.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", r), console.error("Error message:", o), await a.error(`Export failed: ${o}`), r instanceof Error && r.stack && (console.error("Stack trace:", r.stack), await a.error(`Stack trace: ${r.stack}`));
    const l = {
      type: "exportPage",
      success: !1,
      error: !0,
      message: o,
      data: {}
    };
    return console.error("Returning error response:", l), l;
  }
}
const Mt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  countTotalNodes: pe,
  exportPage: $e,
  extractNodeData: me
}, Symbol.toStringTag, { value: "Module" }));
async function Z(e, t) {
  for (const n of t)
    e.modes.find((o) => o.name === n) || e.addMode(n);
}
const j = "recursica:collectionId";
async function oe(e) {
  if (e.remote === !0) {
    const n = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(n)) {
      const o = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await a.error(o), new Error(o);
    }
    return e.id;
  } else {
    const n = e.getSharedPluginData(
      "recursica",
      j
    );
    if (n && n.trim() !== "")
      return n;
    const r = await Ce();
    return e.setSharedPluginData("recursica", j, r), r;
  }
}
function xt(e, t) {
  const n = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(n))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Rt(e) {
  let t;
  const n = e.collectionName.trim().toLowerCase(), r = ["token", "tokens", "theme", "themes"], o = e.isLocal;
  if (o === !1 || o === void 0 && r.includes(n))
    try {
      const m = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((h) => h.name.trim().toLowerCase() === n);
      if (m) {
        xt(e.collectionName, !1);
        const h = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          m.key
        );
        if (h.length > 0) {
          const N = await figma.variables.importVariableByKeyAsync(h[0].key), s = await figma.variables.getVariableCollectionByIdAsync(
            N.variableCollectionId
          );
          if (s) {
            if (t = s, e.collectionGuid) {
              const A = t.getSharedPluginData(
                "recursica",
                j
              );
              (!A || A.trim() === "") && t.setSharedPluginData(
                "recursica",
                j,
                e.collectionGuid
              );
            } else
              await oe(t);
            return await Z(t, e.modes), { collection: t };
          }
        }
      }
    } catch (i) {
      if (o === !1)
        throw new Error(
          `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
        );
      console.log("Could not import external collection, trying local:", i);
    }
  if (o !== !1) {
    const i = await figma.variables.getLocalVariableCollectionsAsync();
    let m;
    if (e.collectionGuid && (m = i.find((h) => h.getSharedPluginData("recursica", j) === e.collectionGuid)), m || (m = i.find(
      (h) => h.name === e.collectionName
    )), m)
      if (t = m, e.collectionGuid) {
        const h = t.getSharedPluginData(
          "recursica",
          j
        );
        (!h || h.trim() === "") && t.setSharedPluginData(
          "recursica",
          j,
          e.collectionGuid
        );
      } else
        await oe(t);
    else
      t = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? t.setSharedPluginData(
        "recursica",
        j,
        e.collectionGuid
      ) : await oe(t);
  } else {
    const i = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), m = e.collectionName.trim().toLowerCase(), h = i.find(($) => $.name.trim().toLowerCase() === m);
    if (!h)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const N = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      h.key
    );
    if (N.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const s = await figma.variables.importVariableByKeyAsync(
      N[0].key
    ), A = await figma.variables.getVariableCollectionByIdAsync(
      s.variableCollectionId
    );
    if (!A)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (t = A, e.collectionGuid) {
      const $ = t.getSharedPluginData(
        "recursica",
        j
      );
      (!$ || $.trim() === "") && t.setSharedPluginData(
        "recursica",
        j,
        e.collectionGuid
      );
    } else
      oe(t);
  }
  return await Z(t, e.modes), { collection: t };
}
async function Fe(e, t) {
  for (const n of e.variableIds)
    try {
      const r = await figma.variables.getVariableByIdAsync(n);
      if (r && r.name === t)
        return r;
    } catch (r) {
      continue;
    }
  return null;
}
async function kt(e, t, n, r, o) {
  for (const [l, i] of Object.entries(t)) {
    const m = r.modes.find((N) => N.name === l);
    if (!m) {
      console.warn(
        `Mode "${l}" not found in collection "${r.name}" for variable "${e.name}". Skipping.`
      );
      continue;
    }
    const h = m.modeId;
    try {
      if (i == null)
        continue;
      if (typeof i == "string" || typeof i == "number" || typeof i == "boolean") {
        e.setValueForMode(h, i);
        continue;
      }
      if (typeof i == "object" && i !== null && "_varRef" in i && typeof i._varRef == "number") {
        const N = i;
        let s = null;
        const A = n.getVariableByIndex(
          N._varRef
        );
        if (A) {
          let $ = null;
          if (o && A._colRef !== void 0) {
            const c = o.getCollectionByIndex(
              A._colRef
            );
            c && ($ = (await Rt(c)).collection);
          }
          $ && (s = await Fe(
            $,
            A.variableName
          ));
        }
        if (s) {
          const $ = {
            type: "VARIABLE_ALIAS",
            id: s.id
          };
          e.setValueForMode(h, $);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${l}" in variable "${e.name}". Variable reference index: ${N._varRef}`
          );
      }
    } catch (N) {
      console.warn(
        `Error setting value for mode "${l}" in variable "${e.name}":`,
        N
      );
    }
  }
}
async function Ie(e, t, n, r) {
  const o = figma.variables.createVariable(
    e.variableName,
    t,
    e.variableType
  );
  return e.valuesByMode && await kt(
    o,
    e.valuesByMode,
    n,
    t,
    // Pass collection to look up modes by name
    r
  ), o;
}
async function Ue(e, t, n, r) {
  if (!(!t || typeof t != "object"))
    try {
      const o = e[n];
      if (!o || !Array.isArray(o))
        return;
      const l = t[n];
      if (Array.isArray(l))
        for (let i = 0; i < l.length && i < o.length; i++) {
          const m = l[i];
          if (m && typeof m == "object") {
            o[i].boundVariables || (o[i].boundVariables = {});
            for (const [h, N] of Object.entries(
              m
            ))
              if (Re(N)) {
                const s = N._varRef;
                if (s !== void 0) {
                  const A = r.get(String(s));
                  A && (o[i].boundVariables[h] = {
                    type: "VARIABLE_ALIAS",
                    id: A.id
                  });
                }
              }
          }
        }
    } catch (o) {
      console.log(`Error restoring bound variables for ${n}:`, o);
    }
}
function _t(e, t) {
  const n = at(t);
  if (e.visible === void 0 && (e.visible = n.visible), e.locked === void 0 && (e.locked = n.locked), e.opacity === void 0 && (e.opacity = n.opacity), e.rotation === void 0 && (e.rotation = n.rotation), e.blendMode === void 0 && (e.blendMode = n.blendMode), t === "FRAME" || t === "COMPONENT" || t === "INSTANCE") {
    const r = L;
    e.layoutMode === void 0 && (e.layoutMode = r.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = r.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = r.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = r.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = r.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = r.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = r.paddingRight), e.paddingTop === void 0 && (e.paddingTop = r.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = r.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = r.itemSpacing);
  }
  if (t === "TEXT") {
    const r = U;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = r.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = r.textAlignVertical), e.textCase === void 0 && (e.textCase = r.textCase), e.textDecoration === void 0 && (e.textDecoration = r.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = r.textAutoResize);
  }
}
async function Y(e, t, n = null, r = null, o = null, l = null, i = null, m = !1, h = null, N = null) {
  var $;
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
      if (e.id && i && i.has(e.id))
        s = i.get(e.id), await a.log(
          `Reusing existing COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id.substring(0, 8)}...)`
        );
      else if (s = figma.createComponent(), await a.log(
        `Created COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id ? e.id.substring(0, 8) + "..." : "no ID"})`
      ), e.componentPropertyDefinitions) {
        const c = e.componentPropertyDefinitions;
        let g = 0, d = 0;
        for (const [u, v] of Object.entries(c))
          try {
            const C = v.type;
            let f = null;
            if (typeof C == "string" ? (C === "TEXT" || C === "BOOLEAN" || C === "INSTANCE_SWAP" || C === "VARIANT") && (f = C) : typeof C == "number" && (f = {
              2: "TEXT",
              // Text property
              25: "BOOLEAN",
              // Boolean property
              27: "INSTANCE_SWAP",
              // Instance swap property
              26: "VARIANT"
              // Variant property
            }[C] || null), !f) {
              await a.warning(
                `  Unknown property type ${C} (${typeof C}) for property "${u}" in component "${e.name || "Unnamed"}"`
              ), d++;
              continue;
            }
            const p = v.defaultValue, y = u.split("#")[0];
            s.addComponentProperty(
              y,
              f,
              p
            ), g++;
          } catch (C) {
            await a.warning(
              `  Failed to add component property "${u}" to "${e.name || "Unnamed"}": ${C}`
            ), d++;
          }
        g > 0 && await a.log(
          `  Added ${g} component property definition(s) to "${e.name || "Unnamed"}"${d > 0 ? ` (${d} failed)` : ""}`
        );
      }
      break;
    case "COMPONENT_SET": {
      const c = e.children ? e.children.filter((u) => u.type === "COMPONENT").length : 0;
      await a.log(
        `Creating COMPONENT_SET "${e.name || "Unnamed"}" by combining ${c} component variant(s)`
      );
      const g = [];
      let d = null;
      if (e.children && Array.isArray(e.children)) {
        d = figma.createFrame(), d.name = `_temp_${e.name || "COMPONENT_SET"}`, d.visible = !1, ((t == null ? void 0 : t.type) === "PAGE" ? t : figma.currentPage).appendChild(d);
        for (const v of e.children)
          if (v.type === "COMPONENT" && !v._truncated)
            try {
              const C = await Y(
                v,
                d,
                // Use temp parent for now
                n,
                r,
                o,
                l,
                i,
                m,
                h,
                null
                // deferredInstances - not needed for component set creation
              );
              C && C.type === "COMPONENT" && (g.push(C), await a.log(
                `  Created component variant: "${C.name || "Unnamed"}"`
              ));
            } catch (C) {
              await a.warning(
                `  Failed to create component variant "${v.name || "Unnamed"}": ${C}`
              );
            }
      }
      if (g.length > 0)
        try {
          const u = t || figma.currentPage, v = figma.combineAsVariants(
            g,
            u
          );
          e.name && (v.name = e.name), e.x !== void 0 && (v.x = e.x), e.y !== void 0 && (v.y = e.y), d && d.parent && d.remove(), await a.log(
            `  ✓ Successfully created COMPONENT_SET "${v.name}" with ${g.length} variant(s)`
          ), s = v;
        } catch (u) {
          if (await a.warning(
            `  Failed to combine components into COMPONENT_SET "${e.name || "Unnamed"}": ${u}. Falling back to frame.`
          ), s = figma.createFrame(), e.name && (s.name = e.name), d && d.children.length > 0) {
            for (const v of d.children)
              s.appendChild(v);
            d.remove();
          }
        }
      else
        await a.warning(
          `  No valid component variants found for COMPONENT_SET "${e.name || "Unnamed"}". Creating frame instead.`
        ), s = figma.createFrame(), e.name && (s.name = e.name), d && d.remove();
      break;
    }
    case "INSTANCE":
      if (m)
        s = figma.createFrame(), e.name && (s.name = e.name);
      else if (e._instanceRef !== void 0 && o && i) {
        const c = o.getInstanceByIndex(
          e._instanceRef
        );
        if (c && c.instanceType === "internal")
          if (c.componentNodeId)
            if (c.componentNodeId === e.id)
              await a.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), s = figma.createFrame(), e.name && (s.name = e.name);
            else {
              const g = i.get(
                c.componentNodeId
              );
              if (!g) {
                const d = Array.from(i.keys()).slice(
                  0,
                  20
                );
                await a.error(
                  `Component not found for internal instance "${e.name}" (ID: ${c.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), await a.error(
                  `Looking for component ID: ${c.componentNodeId}`
                ), await a.error(
                  `Available IDs in mapping (first 20): ${d.map((p) => p.substring(0, 8) + "...").join(", ")}`
                );
                const u = (p, y) => {
                  if (p.type === "COMPONENT" && p.id === y)
                    return !0;
                  if (p.children && Array.isArray(p.children)) {
                    for (const w of p.children)
                      if (!w._truncated && u(w, y))
                        return !0;
                  }
                  return !1;
                }, v = u(
                  e,
                  c.componentNodeId
                );
                await a.error(
                  `Component ID ${c.componentNodeId.substring(0, 8)}... exists in current node tree: ${v}`
                ), await a.error(
                  `WARNING: Component ID ${c.componentNodeId.substring(0, 8)}... not found in nodeIdMapping. This might indicate:`
                ), await a.error(
                  "  1. The component doesn't exist in the pageData (detached component?)"
                ), await a.error(
                  "  2. The component wasn't collected in the first pass"
                ), await a.error(
                  "  3. The component ID in the instance table doesn't match the actual component ID"
                );
                const C = d.filter(
                  (p) => p.startsWith(c.componentNodeId.substring(0, 8))
                );
                C.length > 0 && await a.error(
                  `Found IDs with matching prefix: ${C.map((p) => p.substring(0, 8) + "...").join(", ")}`
                );
                const f = `Component not found for internal instance "${e.name}" (ID: ${c.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${d.map((p) => p.substring(0, 8) + "...").join(", ")}`;
                throw new Error(f);
              }
              if (g && g.type === "COMPONENT") {
                if (s = g.createInstance(), await a.log(
                  `✓ Created internal instance "${e.name}" from component "${c.componentName}"`
                ), c.variantProperties && Object.keys(c.variantProperties).length > 0)
                  try {
                    const d = await s.getMainComponentAsync();
                    if (d) {
                      let u = null;
                      const v = d.type;
                      if (v === "COMPONENT_SET" ? u = d.componentPropertyDefinitions : v === "COMPONENT" && d.parent && d.parent.type === "COMPONENT_SET" ? u = d.parent.componentPropertyDefinitions : await a.warning(
                        `Cannot set variant properties for internal instance "${e.name}" - main component is not a COMPONENT_SET or variant`
                      ), u) {
                        const C = {};
                        for (const [f, p] of Object.entries(
                          c.variantProperties
                        )) {
                          const y = f.split("#")[0];
                          u[y] && (C[y] = p);
                        }
                        Object.keys(C).length > 0 && s.setProperties(C);
                      }
                    } else
                      await a.warning(
                        `Cannot set variant properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (d) {
                    const u = `Failed to set variant properties for instance "${e.name}": ${d}`;
                    throw await a.error(u), new Error(u);
                  }
                if (c.componentProperties && Object.keys(c.componentProperties).length > 0)
                  try {
                    const d = await s.getMainComponentAsync();
                    if (d) {
                      let u = null;
                      const v = d.type;
                      if (v === "COMPONENT_SET" ? u = d.componentPropertyDefinitions : v === "COMPONENT" && d.parent && d.parent.type === "COMPONENT_SET" ? u = d.parent.componentPropertyDefinitions : v === "COMPONENT" && (u = d.componentPropertyDefinitions), u)
                        for (const [C, f] of Object.entries(
                          c.componentProperties
                        )) {
                          const p = C.split("#")[0];
                          if (u[p])
                            try {
                              let y = f;
                              f && typeof f == "object" && "value" in f && (y = f.value), s.setProperties({
                                [p]: y
                              });
                            } catch (y) {
                              const w = `Failed to set component property "${p}" for internal instance "${e.name}": ${y}`;
                              throw await a.error(w), new Error(w);
                            }
                        }
                    } else
                      await a.warning(
                        `Cannot set component properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (d) {
                    if (d instanceof Error)
                      throw d;
                    const u = `Failed to set component properties for instance "${e.name}": ${d}`;
                    throw await a.error(u), new Error(u);
                  }
              } else if (!s && g) {
                const d = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${c.componentNodeId.substring(0, 8)}...).`;
                throw await a.error(d), new Error(d);
              }
            }
          else {
            const g = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw await a.error(g), new Error(g);
          }
        else if (c && c.instanceType === "remote")
          if (h) {
            const g = h.get(
              e._instanceRef
            );
            if (g) {
              if (s = g.createInstance(), await a.log(
                `✓ Created remote instance "${e.name}" from component "${c.componentName}" on REMOTES page`
              ), c.variantProperties && Object.keys(c.variantProperties).length > 0)
                try {
                  const d = await s.getMainComponentAsync();
                  if (d) {
                    let u = null;
                    const v = d.type;
                    if (v === "COMPONENT_SET" ? u = d.componentPropertyDefinitions : v === "COMPONENT" && d.parent && d.parent.type === "COMPONENT_SET" ? u = d.parent.componentPropertyDefinitions : await a.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component is not a COMPONENT_SET or variant`
                    ), u) {
                      const C = {};
                      for (const [f, p] of Object.entries(
                        c.variantProperties
                      )) {
                        const y = f.split("#")[0];
                        u[y] && (C[y] = p);
                      }
                      Object.keys(C).length > 0 && s.setProperties(C);
                    }
                  } else
                    await a.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (d) {
                  const u = `Failed to set variant properties for remote instance "${e.name}": ${d}`;
                  throw await a.error(u), new Error(u);
                }
              if (c.componentProperties && Object.keys(c.componentProperties).length > 0)
                try {
                  const d = await s.getMainComponentAsync();
                  if (d) {
                    let u = null;
                    const v = d.type;
                    if (v === "COMPONENT_SET" ? u = d.componentPropertyDefinitions : v === "COMPONENT" && d.parent && d.parent.type === "COMPONENT_SET" ? u = d.parent.componentPropertyDefinitions : v === "COMPONENT" && (u = d.componentPropertyDefinitions), u)
                      for (const [C, f] of Object.entries(
                        c.componentProperties
                      )) {
                        const p = C.split("#")[0];
                        if (u[p])
                          try {
                            let y = f;
                            f && typeof f == "object" && "value" in f && (y = f.value), s.setProperties({
                              [p]: y
                            });
                          } catch (y) {
                            const w = `Failed to set component property "${p}" for remote instance "${e.name}": ${y}`;
                            throw await a.error(w), new Error(w);
                          }
                      }
                  } else
                    await a.warning(
                      `Cannot set component properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (d) {
                  if (d instanceof Error)
                    throw d;
                  const u = `Failed to set component properties for remote instance "${e.name}": ${d}`;
                  throw await a.error(u), new Error(u);
                }
              if (e.width !== void 0 && e.height !== void 0)
                try {
                  s.resize(e.width, e.height);
                } catch (d) {
                  await a.log(
                    `Note: Could not resize remote instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
                  );
                }
            } else {
              const d = `Remote component not found for instance "${e.name}" (index ${e._instanceRef}). The remote component should have been created on the REMOTES page.`;
              throw await a.error(d), new Error(d);
            }
          } else {
            const g = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw await a.error(g), new Error(g);
          }
        else if ((c == null ? void 0 : c.instanceType) === "normal") {
          if (!c.componentPageName) {
            const f = `Normal instance "${e.name}" missing componentPageName. Cannot resolve.`;
            throw await a.error(f), new Error(f);
          }
          await figma.loadAllPagesAsync();
          const g = figma.root.children.find(
            (f) => f.name === c.componentPageName
          );
          if (!g) {
            await a.log(
              `  Deferring normal instance "${e.name}" - referenced page "${c.componentPageName}" does not exist yet (may be circular reference or not yet imported)`
            );
            const f = figma.createFrame();
            f.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (f.x = e.x), e.y !== void 0 && (f.y = e.y), e.width !== void 0 && e.height !== void 0 ? f.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && f.resize(e.w, e.h), N && N.push({
              placeholderFrame: f,
              instanceEntry: c,
              nodeData: e,
              parentNode: t,
              instanceIndex: e._instanceRef
            }), s = f;
            break;
          }
          let d = null;
          const u = (f, p, y, w) => {
            if (p.length === 0) {
              let E = null;
              for (const S of f.children || [])
                if (S.type === "COMPONENT") {
                  if (S.name === y)
                    if (E || (E = S), w)
                      try {
                        const O = S.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (O && JSON.parse(O).id === w)
                          return S;
                      } catch (O) {
                      }
                    else
                      return S;
                } else if (S.type === "COMPONENT_SET") {
                  for (const O of S.children || [])
                    if (O.type === "COMPONENT" && O.name === y)
                      if (E || (E = O), w)
                        try {
                          const k = O.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (k && JSON.parse(k).id === w)
                            return O;
                        } catch (k) {
                        }
                      else
                        return O;
                }
              return E;
            }
            const [b, ...P] = p;
            for (const E of f.children || [])
              if (E.name === b) {
                if (P.length === 0 && E.type === "COMPONENT_SET") {
                  for (const S of E.children || [])
                    if (S.type === "COMPONENT" && S.name === y) {
                      if (w)
                        try {
                          const O = S.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (O && JSON.parse(O).id === w)
                            return S;
                        } catch (O) {
                        }
                      return S;
                    }
                  return null;
                }
                return u(
                  E,
                  P,
                  y,
                  w
                );
              }
            return null;
          };
          await a.log(
            `  Looking for component "${c.componentName}" on page "${c.componentPageName}"${c.path && c.path.length > 0 ? ` at path [${c.path.join(" → ")}]` : " at page root"}${c.componentGuid ? ` (GUID: ${c.componentGuid.substring(0, 8)}...)` : ""}`
          );
          const v = [], C = (f, p = 0) => {
            const y = "  ".repeat(p);
            if (f.type === "COMPONENT")
              v.push(`${y}COMPONENT: "${f.name}"`);
            else if (f.type === "COMPONENT_SET") {
              v.push(
                `${y}COMPONENT_SET: "${f.name}"`
              );
              for (const w of f.children || [])
                w.type === "COMPONENT" && v.push(
                  `${y}  └─ COMPONENT: "${w.name}"`
                );
            }
            for (const w of f.children || [])
              C(w, p + 1);
          };
          if (C(g), v.length > 0 ? await a.log(
            `  Available components on page "${c.componentPageName}":
${v.slice(0, 20).join(`
`)}${v.length > 20 ? `
  ... and ${v.length - 20} more` : ""}`
          ) : await a.warning(
            `  No components found on page "${c.componentPageName}"`
          ), d = u(
            g,
            c.path || [],
            c.componentName,
            c.componentGuid
          ), d && c.componentGuid)
            try {
              const f = d.getPluginData(
                "RecursicaPublishedMetadata"
              );
              if (f) {
                const p = JSON.parse(f);
                p.id !== c.componentGuid ? await a.warning(
                  `  Found component "${c.componentName}" by name but GUID verification failed (expected ${c.componentGuid.substring(0, 8)}..., got ${p.id ? p.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`
                ) : await a.log(
                  `  Found component "${c.componentName}" with matching GUID ${c.componentGuid.substring(0, 8)}...`
                );
              } else
                await a.warning(
                  `  Found component "${c.componentName}" by name but no metadata found. Using name match as fallback.`
                );
            } catch (f) {
              await a.warning(
                `  Found component "${c.componentName}" by name but GUID verification failed. Using name match as fallback.`
              );
            }
          if (!d) {
            await a.log(
              `  Deferring normal instance "${e.name}" - component "${c.componentName}" not found on page "${c.componentPageName}" (may not be created yet due to circular reference)`
            );
            const f = figma.createFrame();
            f.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (f.x = e.x), e.y !== void 0 && (f.y = e.y), e.width !== void 0 && e.height !== void 0 ? f.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && f.resize(e.w, e.h), N && N.push({
              placeholderFrame: f,
              instanceEntry: c,
              nodeData: e,
              parentNode: t,
              instanceIndex: e._instanceRef
            }), s = f;
            break;
          }
          if (s = d.createInstance(), await a.log(
            `  Created normal instance "${e.name}" from component "${c.componentName}" on page "${c.componentPageName}"`
          ), c.variantProperties && Object.keys(c.variantProperties).length > 0)
            try {
              const f = await s.getMainComponentAsync();
              if (f) {
                let p = null;
                const y = f.type;
                if (y === "COMPONENT_SET" ? p = f.componentPropertyDefinitions : y === "COMPONENT" && f.parent && f.parent.type === "COMPONENT_SET" ? p = f.parent.componentPropertyDefinitions : await a.warning(
                  `Cannot set variant properties for normal instance "${e.name}" - main component is not a COMPONENT_SET or variant`
                ), p) {
                  const w = {};
                  for (const [b, P] of Object.entries(
                    c.variantProperties
                  )) {
                    const E = b.split("#")[0];
                    p[E] && (w[E] = P);
                  }
                  Object.keys(w).length > 0 && s.setProperties(w);
                }
              }
            } catch (f) {
              await a.warning(
                `Failed to set variant properties for normal instance "${e.name}": ${f}`
              );
            }
          if (c.componentProperties && Object.keys(c.componentProperties).length > 0)
            try {
              const f = await s.getMainComponentAsync();
              if (f) {
                let p = null;
                const y = f.type;
                if (y === "COMPONENT_SET" ? p = f.componentPropertyDefinitions : y === "COMPONENT" && f.parent && f.parent.type === "COMPONENT_SET" ? p = f.parent.componentPropertyDefinitions : y === "COMPONENT" && (p = f.componentPropertyDefinitions), p) {
                  const w = {};
                  for (const [b, P] of Object.entries(
                    c.componentProperties
                  )) {
                    const E = b.split("#")[0];
                    let S;
                    if (p[b] ? S = b : p[E] ? S = E : S = Object.keys(p).find(
                      (O) => O.split("#")[0] === E
                    ), S) {
                      const O = P && typeof P == "object" && "value" in P ? P.value : P;
                      w[S] = O;
                    } else
                      await a.warning(
                        `Component property "${E}" (from "${b}") does not exist on component "${c.componentName}" for normal instance "${e.name}". Available properties: ${Object.keys(p).join(", ") || "none"}`
                      );
                  }
                  if (Object.keys(w).length > 0)
                    try {
                      await a.log(
                        `  Attempting to set component properties for normal instance "${e.name}": ${Object.keys(w).join(", ")}`
                      ), await a.log(
                        `  Available component properties: ${Object.keys(p).join(", ")}`
                      ), s.setProperties(w), await a.log(
                        `  ✓ Successfully set component properties for normal instance "${e.name}": ${Object.keys(w).join(", ")}`
                      );
                    } catch (b) {
                      await a.warning(
                        `Failed to set component properties for normal instance "${e.name}": ${b}`
                      ), await a.warning(
                        `  Properties attempted: ${JSON.stringify(w)}`
                      ), await a.warning(
                        `  Available properties: ${JSON.stringify(Object.keys(p))}`
                      );
                    }
                }
              } else
                await a.warning(
                  `Cannot set component properties for normal instance "${e.name}" - main component not found`
                );
            } catch (f) {
              await a.warning(
                `Failed to set component properties for normal instance "${e.name}": ${f}`
              );
            }
          if (e.width !== void 0 && e.height !== void 0)
            try {
              s.resize(e.width, e.height);
            } catch (f) {
              await a.log(
                `Note: Could not resize normal instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
              );
            }
        } else {
          const g = `Instance "${e.name}" has unknown or missing instance type: ${(c == null ? void 0 : c.instanceType) || "unknown"}`;
          throw await a.error(g), new Error(g);
        }
      } else {
        const c = `Instance "${e.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        throw await a.error(c), new Error(c);
      }
      break;
    case "GROUP":
      s = figma.createFrame();
      break;
    case "BOOLEAN_OPERATION": {
      const c = `Boolean operation nodes cannot be imported. Found boolean operation: "${e.name}".`;
      throw await a.error(c), new Error(c);
    }
    case "POLYGON":
      s = figma.createPolygon();
      break;
    default: {
      const c = `Unsupported node type: ${e.type}. This node type cannot be imported.`;
      throw await a.error(c), new Error(c);
    }
  }
  if (!s)
    return null;
  if (e.id && i && (i.set(e.id, s), s.type === "COMPONENT" && await a.log(
    `  Stored COMPONENT "${e.name || "Unnamed"}" in nodeIdMapping (ID: ${e.id.substring(0, 8)}...)`
  )), _t(s, e.type || "FRAME"), e.name !== void 0 && (s.name = e.name || "Unnamed Node"), e.x !== void 0 && (s.x = e.x), e.y !== void 0 && (s.y = e.y), e.type !== "VECTOR" && e.width !== void 0 && e.height !== void 0 && s.resize(e.width, e.height), e.visible !== void 0 && (s.visible = e.visible), e.locked !== void 0 && (s.locked = e.locked), e.opacity !== void 0 && (s.opacity = e.opacity), e.rotation !== void 0 && (s.rotation = e.rotation), e.blendMode !== void 0 && (s.blendMode = e.blendMode), e.type !== "INSTANCE") {
    if (e.fills !== void 0)
      try {
        let c = e.fills;
        Array.isArray(c) && (c = c.map((g) => {
          if (g && typeof g == "object") {
            const d = I({}, g);
            return delete d.boundVariables, d;
          }
          return g;
        })), s.fills = c, ($ = e.boundVariables) != null && $.fills && l && await Ue(
          s,
          e.boundVariables,
          "fills",
          l
        );
      } catch (c) {
        console.log("Error setting fills:", c);
      }
    else if (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "GROUP")
      try {
        s.fills = [];
      } catch (c) {
        console.log("Error clearing fills:", c);
      }
  }
  if (e.strokes !== void 0)
    try {
      e.strokes.length > 0 ? s.strokes = e.strokes : s.strokes = [];
    } catch (c) {
      console.log("Error setting strokes:", c);
    }
  else if (e.type === "VECTOR")
    try {
      s.strokes = [];
    } catch (c) {
    }
  if (e.strokeWeight !== void 0 ? s.strokeWeight = e.strokeWeight : e.type === "VECTOR" && (e.strokes === void 0 || e.strokes.length === 0) && (s.strokeWeight = 0), e.strokeAlign !== void 0 && (s.strokeAlign = e.strokeAlign), e.cornerRadius !== void 0 && (s.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (s.effects = e.effects), (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && (e.layoutMode !== void 0 && (s.layoutMode = e.layoutMode), e.primaryAxisSizingMode !== void 0 && (s.primaryAxisSizingMode = e.primaryAxisSizingMode), e.counterAxisSizingMode !== void 0 && (s.counterAxisSizingMode = e.counterAxisSizingMode), e.primaryAxisAlignItems !== void 0 && (s.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (s.counterAxisAlignItems = e.counterAxisAlignItems), e.paddingLeft !== void 0 && (s.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (s.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (s.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (s.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (s.itemSpacing = e.itemSpacing)), (e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (s.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (s.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (s.dashPattern = e.dashPattern), e.type === "VECTOR")) {
    if (e.fillGeometry !== void 0)
      try {
        const { normalizeSvgPath: c } = await Promise.resolve().then(() => bt), g = e.fillGeometry.map((d) => {
          const u = d.data;
          return {
            data: c(u),
            windingRule: d.windingRule || d.windRule || "NONZERO"
          };
        });
        for (let d = 0; d < e.fillGeometry.length; d++) {
          const u = e.fillGeometry[d].data, v = g[d].data;
          u !== v && await a.log(
            `  Normalized path ${d + 1} for "${e.name || "Unnamed"}": ${u.substring(0, 50)}... -> ${v.substring(0, 50)}...`
          );
        }
        s.vectorPaths = g, await a.log(
          `  Set vectorPaths for VECTOR "${e.name || "Unnamed"}" (${g.length} path(s))`
        );
      } catch (c) {
        await a.warning(
          `Error setting vectorPaths for VECTOR "${e.name || "Unnamed"}": ${c}`
        );
      }
    if (e.strokeGeometry !== void 0)
      try {
        s.strokeGeometry = e.strokeGeometry;
      } catch (c) {
        await a.warning(
          `Error setting strokeGeometry for VECTOR "${e.name || "Unnamed"}": ${c}`
        );
      }
    if (e.width !== void 0 && e.height !== void 0)
      try {
        s.resize(e.width, e.height), await a.log(
          `  Set size for VECTOR "${e.name || "Unnamed"}" to ${e.width}x${e.height}`
        );
      } catch (c) {
        await a.warning(
          `Error setting size for VECTOR "${e.name || "Unnamed"}": ${c}`
        );
      }
  }
  if (e.type === "TEXT" && e.characters !== void 0)
    try {
      if (e.fontName)
        try {
          await figma.loadFontAsync(e.fontName), s.fontName = e.fontName;
        } catch (c) {
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
      s.characters = e.characters, e.fontSize !== void 0 && (s.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (s.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (s.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (s.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (s.lineHeight = e.lineHeight), e.textCase !== void 0 && (s.textCase = e.textCase), e.textDecoration !== void 0 && (s.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (s.textAutoResize = e.textAutoResize);
    } catch (c) {
      console.log("Error setting text properties: " + c);
      try {
        s.characters = e.characters;
      } catch (g) {
        console.log("Could not set text characters: " + g);
      }
    }
  if (e.boundVariables) {
    for (const [c, g] of Object.entries(
      e.boundVariables
    ))
      if (c !== "fills" && Re(g) && n && l) {
        const d = g._varRef;
        if (d !== void 0) {
          const u = l.get(String(d));
          if (u) {
            const v = {
              type: "VARIABLE_ALIAS",
              id: u.id
            };
            s.boundVariables || (s.boundVariables = {}), s.boundVariables[c] || (s.boundVariables[c] = v);
          }
        }
      }
  }
  const A = e.id && i && i.has(e.id) && s.type === "COMPONENT" && s.children && s.children.length > 0;
  if (e.children && Array.isArray(e.children) && s.type !== "INSTANCE" && !A) {
    const c = (d) => {
      const u = [];
      for (const v of d)
        v._truncated || (v.type === "COMPONENT" ? (u.push(v), v.children && Array.isArray(v.children) && u.push(...c(v.children))) : v.children && Array.isArray(v.children) && u.push(...c(v.children)));
      return u;
    };
    for (const d of e.children) {
      if (d._truncated) {
        console.log(
          `Skipping truncated children: ${d._reason || "Unknown"}`
        );
        continue;
      }
      d.type;
    }
    const g = c(e.children);
    await a.log(
      `  First pass: Creating ${g.length} COMPONENT node(s) (without children)...`
    );
    for (const d of g)
      await a.log(
        `  Collected COMPONENT "${d.name || "Unnamed"}" (ID: ${d.id ? d.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const d of g)
      if (d.id && i && !i.has(d.id)) {
        const u = figma.createComponent();
        if (d.name !== void 0 && (u.name = d.name || "Unnamed Node"), d.componentPropertyDefinitions) {
          const v = d.componentPropertyDefinitions;
          let C = 0, f = 0;
          for (const [p, y] of Object.entries(v))
            try {
              const b = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[y.type];
              if (!b) {
                await a.warning(
                  `  Unknown property type ${y.type} for property "${p}" in component "${d.name || "Unnamed"}"`
                ), f++;
                continue;
              }
              const P = y.defaultValue, E = p.split("#")[0];
              u.addComponentProperty(
                E,
                b,
                P
              ), C++;
            } catch (w) {
              await a.warning(
                `  Failed to add component property "${p}" to "${d.name || "Unnamed"}" in first pass: ${w}`
              ), f++;
            }
          C > 0 && await a.log(
            `  Added ${C} component property definition(s) to "${d.name || "Unnamed"}" in first pass${f > 0 ? ` (${f} failed)` : ""}`
          );
        }
        i.set(d.id, u), await a.log(
          `  Created COMPONENT "${d.name || "Unnamed"}" (ID: ${d.id.substring(0, 8)}...) in first pass`
        );
      }
    for (const d of e.children) {
      if (d._truncated)
        continue;
      const u = await Y(
        d,
        s,
        n,
        r,
        o,
        l,
        i,
        m,
        h,
        null
        // deferredInstances - not needed for remote structures
      );
      if (u && u.parent !== s) {
        if (u.parent && typeof u.parent.removeChild == "function")
          try {
            u.parent.removeChild(u);
          } catch (v) {
            await a.warning(
              `Failed to remove child "${u.name || "Unnamed"}" from parent "${u.parent.name || "Unnamed"}": ${v}`
            );
          }
        s.appendChild(u);
      }
    }
  }
  if (t && s.parent !== t) {
    if (s.parent && typeof s.parent.removeChild == "function")
      try {
        s.parent.removeChild(s);
      } catch (c) {
        await a.warning(
          `Failed to remove node "${s.name || "Unnamed"}" from parent "${s.parent.name || "Unnamed"}": ${c}`
        );
      }
    t.appendChild(s);
  }
  return s;
}
async function Me(e) {
  await figma.loadAllPagesAsync();
  const t = figma.root.children, n = new Set(t.map((l) => l.name));
  if (!n.has(e))
    return e;
  let r = 1, o = `${e}_${r}`;
  for (; n.has(o); )
    r++, o = `${e}_${r}`;
  return o;
}
async function Lt(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), n = new Set(t.map((l) => l.name));
  if (!n.has(e))
    return e;
  let r = 1, o = `${e}_${r}`;
  for (; n.has(o); )
    r++, o = `${e}_${r}`;
  return o;
}
async function zt(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const l of e.variableIds)
    try {
      const i = await figma.variables.getVariableByIdAsync(l);
      i && n.add(i.name);
    } catch (i) {
      continue;
    }
  if (!n.has(t))
    return t;
  let r = 1, o = `${t}_${r}`;
  for (; n.has(o); )
    r++, o = `${t}_${r}`;
  return o;
}
function Vt(e, t) {
  const n = e.resolvedType.toUpperCase(), r = t.toUpperCase();
  return n === r;
}
async function Gt(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), n = K(e.collectionName);
  if (W(e.collectionName)) {
    for (const r of t)
      if (K(r.name) === n)
        return {
          collection: r,
          matchType: "potential"
        };
    return {
      collection: null,
      matchType: "none"
    };
  }
  if (e.collectionGuid) {
    for (const r of t)
      if (r.getSharedPluginData(
        "recursica",
        j
      ) === e.collectionGuid)
        return {
          collection: r,
          matchType: "recognized"
        };
  }
  for (const r of t)
    if (r.name === e.collectionName)
      return {
        collection: r,
        matchType: "potential"
      };
  return {
    collection: null,
    matchType: "none"
  };
}
function Ft(e) {
  if (!e.metadata)
    return {
      success: !1,
      error: "Invalid JSON format. Expected metadata."
    };
  const t = e.metadata;
  return !t.guid || typeof t.guid != "string" ? {
    success: !1,
    error: "Invalid metadata. Missing or invalid 'guid' field."
  } : !t.name || typeof t.name != "string" ? {
    success: !1,
    error: "Invalid metadata. Missing or invalid 'name' field."
  } : {
    success: !0,
    metadata: {
      guid: t.guid,
      name: t.name,
      version: t.version
    }
  };
}
function je(e) {
  if (!e.stringTable)
    return {
      success: !1,
      error: "Invalid JSON format. String table is required."
    };
  let t;
  try {
    t = de.fromTable(e.stringTable);
  } catch (r) {
    return {
      success: !1,
      error: `Failed to load string table: ${r instanceof Error ? r.message : "Unknown error"}`
    };
  }
  const n = It(e, t);
  return {
    success: !0,
    stringTable: t,
    expandedJsonData: n
  };
}
function Ut(e) {
  if (!e.collections)
    return {
      success: !1,
      error: "No collections table found in JSON"
    };
  try {
    return {
      success: !0,
      collectionTable: ce.fromTable(
        e.collections
      )
    };
  } catch (t) {
    return {
      success: !1,
      error: `Failed to load collections table: ${t instanceof Error ? t.message : "Unknown error"}`
    };
  }
}
async function jt(e) {
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), o = e.getTable();
  for (const [l, i] of Object.entries(o)) {
    if (i.isLocal === !1) {
      await a.log(
        `Skipping remote collection: "${i.collectionName}" (index ${l})`
      );
      continue;
    }
    const m = await Gt(i);
    m.matchType === "recognized" ? (await a.log(
      `✓ Recognized collection by GUID: "${i.collectionName}" (index ${l})`
    ), t.set(l, m.collection)) : m.matchType === "potential" ? (await a.log(
      `? Potential match by name: "${i.collectionName}" (index ${l})`
    ), n.set(l, {
      entry: i,
      collection: m.collection
    })) : (await a.log(
      `✗ No match found for collection: "${i.collectionName}" (index ${l}) - will create new`
    ), r.set(l, i));
  }
  return await a.log(
    `Collection matching complete: ${t.size} recognized, ${n.size} potential matches, ${r.size} to create`
  ), {
    recognizedCollections: t,
    potentialMatches: n,
    collectionsToCreate: r
  };
}
async function Bt(e, t, n) {
  if (e.size !== 0) {
    await a.log(
      `Prompting user for ${e.size} potential match(es)...`
    );
    for (const [r, { entry: o, collection: l }] of e.entries())
      try {
        const i = W(o.collectionName) ? K(o.collectionName) : l.name, m = `Found existing "${i}" variable collection. Should I use it?`;
        await a.log(
          `Prompting user about potential match: "${i}"`
        ), await q.prompt(m, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await a.log(
          `✓ User confirmed: Using existing collection "${i}" (index ${r})`
        ), t.set(r, l), await Z(l, o.modes), await a.log(
          `  ✓ Ensured modes for collection "${i}" (${o.modes.length} mode(s))`
        );
      } catch (i) {
        await a.log(
          `✗ User rejected: Will create new collection for "${o.collectionName}" (index ${r})`
        ), n.set(r, o);
      }
  }
}
async function Jt(e, t, n) {
  if (e.size === 0)
    return;
  await a.log("Ensuring modes exist for recognized collections...");
  const r = t.getTable();
  for (const [o, l] of e.entries()) {
    const i = r[o];
    i && (n.has(o) || (await Z(l, i.modes), await a.log(
      `  ✓ Ensured modes for collection "${l.name}" (${i.modes.length} mode(s))`
    )));
  }
}
async function Kt(e, t, n) {
  if (e.size !== 0) {
    await a.log(
      `Creating ${e.size} new collection(s)...`
    );
    for (const [r, o] of e.entries()) {
      const l = K(o.collectionName), i = await Lt(l);
      i !== l ? await a.log(
        `Creating collection: "${i}" (normalized: "${l}" - name conflict resolved)`
      ) : await a.log(`Creating collection: "${i}"`);
      const m = figma.variables.createVariableCollection(i);
      n.push(m);
      let h;
      if (W(o.collectionName)) {
        const N = Ae(o.collectionName);
        N && (h = N);
      } else o.collectionGuid && (h = o.collectionGuid);
      h && (m.setSharedPluginData(
        "recursica",
        j,
        h
      ), await a.log(
        `  Stored GUID: ${h.substring(0, 8)}...`
      )), await Z(m, o.modes), await a.log(
        `  ✓ Created collection "${i}" with ${o.modes.length} mode(s)`
      ), t.set(r, m);
    }
    await a.log("Collection creation complete");
  }
}
function Wt(e) {
  if (!e.variables)
    return {
      success: !1,
      error: "No variables table found in JSON"
    };
  try {
    return {
      success: !0,
      variableTable: le.fromTable(e.variables)
    };
  } catch (t) {
    return {
      success: !1,
      error: `Failed to load variables table: ${t instanceof Error ? t.message : "Unknown error"}`
    };
  }
}
async function Ht(e, t, n, r) {
  const o = /* @__PURE__ */ new Map(), l = [], i = new Set(
    r.map((N) => N.id)
  );
  await a.log("Matching and creating variables in collections...");
  const m = e.getTable(), h = /* @__PURE__ */ new Map();
  for (const [N, s] of Object.entries(m)) {
    if (s._colRef === void 0)
      continue;
    const A = n.get(String(s._colRef));
    if (!A)
      continue;
    h.has(A.id) || h.set(A.id, {
      collectionName: A.name,
      existing: 0,
      created: 0
    });
    const $ = h.get(A.id), c = i.has(
      A.id
    );
    let g;
    typeof s.variableType == "number" ? g = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[s.variableType] || String(s.variableType) : g = s.variableType;
    const d = await Fe(
      A,
      s.variableName
    );
    if (d)
      if (Vt(d, g))
        o.set(N, d), $.existing++;
      else {
        await a.warning(
          `Type mismatch for variable "${s.variableName}" in collection "${A.name}": expected ${g}, found ${d.resolvedType}. Creating new variable with incremented name.`
        );
        const u = await zt(
          A,
          s.variableName
        ), v = await Ie(
          V(I({}, s), {
            variableName: u,
            variableType: g
          }),
          A,
          e,
          t
        );
        c || l.push(v), o.set(N, v), $.created++;
      }
    else {
      const u = await Ie(
        V(I({}, s), {
          variableType: g
        }),
        A,
        e,
        t
      );
      c || l.push(u), o.set(N, u), $.created++;
    }
  }
  await a.log("Variable processing complete:");
  for (const N of h.values())
    await a.log(
      `  "${N.collectionName}": ${N.existing} existing, ${N.created} created`
    );
  return {
    recognizedVariables: o,
    newlyCreatedVariables: l
  };
}
function qt(e) {
  if (!e.instances)
    return null;
  try {
    return Q.fromTable(e.instances);
  } catch (t) {
    return null;
  }
}
function Yt(e) {
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
function Pe(e) {
  if (!e || typeof e != "object")
    return;
  e.type !== void 0 && (e.type = Yt(e.type));
  const t = e.children !== void 0 ? "children" : e.child !== void 0 ? "child" : null;
  if (t && (t === "child" && !e.children && (e.children = e.child, delete e.child), Array.isArray(e.children)))
    for (const n of e.children)
      Pe(n);
  e.fillG !== void 0 && e.fillGeometry === void 0 && (e.fillGeometry = e.fillG, delete e.fillG), e.strkG !== void 0 && e.strokeGeometry === void 0 && (e.strokeGeometry = e.strkG, delete e.strkG), e.child && !e.children && (e.children = e.child, delete e.child);
}
async function Xt(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const l of e.children)
    (l.type === "FRAME" || l.type === "COMPONENT") && n.add(l.name);
  if (!n.has(t))
    return t;
  let r = 1, o = `${t}_${r}`;
  for (; n.has(o); )
    r++, o = `${t}_${r}`;
  return o;
}
async function Zt(e, t, n, r) {
  var A;
  const o = e.getSerializedTable(), l = Object.values(o).filter(
    ($) => $.instanceType === "remote"
  ), i = /* @__PURE__ */ new Map();
  if (l.length === 0)
    return await a.log("No remote instances found"), i;
  await a.log(
    `Processing ${l.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  let h = figma.root.children.find(($) => $.name === "REMOTES");
  if (h ? await a.log("Found existing REMOTES page") : (h = figma.createPage(), h.name = "REMOTES", await a.log("Created REMOTES page")), !h.children.some(
    ($) => $.type === "FRAME" && $.name === "Title"
  )) {
    const $ = { family: "Inter", style: "Bold" }, c = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync($), await figma.loadFontAsync(c);
    const g = figma.createFrame();
    g.name = "Title", g.layoutMode = "VERTICAL", g.paddingTop = 20, g.paddingBottom = 20, g.paddingLeft = 20, g.paddingRight = 20, g.fills = [];
    const d = figma.createText();
    d.fontName = $, d.characters = "REMOTE INSTANCES", d.fontSize = 24, d.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], g.appendChild(d);
    const u = figma.createText();
    u.fontName = c, u.characters = "These are remotely connected component instances found in our different component pages.", u.fontSize = 14, u.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], g.appendChild(u), h.appendChild(g), await a.log("Created title and description on REMOTES page");
  }
  const s = /* @__PURE__ */ new Map();
  for (const [$, c] of Object.entries(o)) {
    if (c.instanceType !== "remote")
      continue;
    const g = parseInt($, 10);
    if (await a.log(
      `Processing remote instance ${g}: "${c.componentName}"`
    ), !c.structure) {
      await a.warning(
        `Remote instance "${c.componentName}" missing structure data, skipping`
      );
      continue;
    }
    Pe(c.structure);
    const d = c.structure.children !== void 0, u = c.structure.child !== void 0, v = c.structure.children ? c.structure.children.length : c.structure.child ? c.structure.child.length : 0;
    await a.log(
      `  Structure type: ${c.structure.type || "unknown"}, has children: ${v} (children key: ${d}, child key: ${u})`
    );
    let C = c.componentName;
    if (c.path && c.path.length > 0) {
      const p = c.path.filter((y) => y !== "").join(" / ");
      p && (C = `${p} / ${c.componentName}`);
    }
    const f = await Xt(
      h,
      C
    );
    f !== C && await a.log(
      `Component name conflict: "${C}" -> "${f}"`
    );
    try {
      if (c.structure.type !== "COMPONENT") {
        await a.warning(
          `Remote instance "${c.componentName}" structure is not a COMPONENT (type: ${c.structure.type}), creating frame fallback`
        );
        const y = figma.createFrame();
        y.name = f;
        const w = await Y(
          c.structure,
          y,
          t,
          n,
          null,
          r,
          s,
          !0,
          // isRemoteStructure: true
          null,
          // remoteComponentMap - not needed here
          null
          // deferredInstances - not needed for remote instances
        );
        w ? (y.appendChild(w), h.appendChild(y), await a.log(
          `✓ Created remote instance frame fallback: "${f}"`
        )) : y.remove();
        continue;
      }
      const p = figma.createComponent();
      p.name = f, h.appendChild(p), await a.log(
        `  Created component node: "${f}"`
      );
      try {
        if (c.structure.componentPropertyDefinitions) {
          const w = c.structure.componentPropertyDefinitions;
          let b = 0, P = 0;
          for (const [E, S] of Object.entries(w))
            try {
              const k = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[S.type];
              if (!k) {
                await a.warning(
                  `  Unknown property type ${S.type} for property "${E}" in component "${c.componentName}"`
                ), P++;
                continue;
              }
              const G = S.defaultValue, x = E.split("#")[0];
              p.addComponentProperty(
                x,
                k,
                G
              ), b++;
            } catch (O) {
              await a.warning(
                `  Failed to add component property "${E}" to "${c.componentName}": ${O}`
              ), P++;
            }
          b > 0 && await a.log(
            `  Added ${b} component property definition(s) to "${c.componentName}"${P > 0 ? ` (${P} failed)` : ""}`
          );
        }
        if (c.structure.name !== void 0 && (p.name = c.structure.name), c.structure.width !== void 0 && c.structure.height !== void 0 && p.resize(c.structure.width, c.structure.height), c.structure.x !== void 0 && (p.x = c.structure.x), c.structure.y !== void 0 && (p.y = c.structure.y), c.structure.visible !== void 0 && (p.visible = c.structure.visible), c.structure.opacity !== void 0 && (p.opacity = c.structure.opacity), c.structure.rotation !== void 0 && (p.rotation = c.structure.rotation), c.structure.blendMode !== void 0 && (p.blendMode = c.structure.blendMode), c.structure.fills !== void 0)
          try {
            let w = c.structure.fills;
            Array.isArray(w) && (w = w.map((b) => {
              if (b && typeof b == "object") {
                const P = I({}, b);
                return delete P.boundVariables, P;
              }
              return b;
            })), p.fills = w, (A = c.structure.boundVariables) != null && A.fills && r && await Ue(
              p,
              c.structure.boundVariables,
              "fills",
              r
            );
          } catch (w) {
            await a.warning(
              `Error setting fills for remote component "${c.componentName}": ${w}`
            );
          }
        if (c.structure.strokes !== void 0)
          try {
            p.strokes = c.structure.strokes;
          } catch (w) {
            await a.warning(
              `Error setting strokes for remote component "${c.componentName}": ${w}`
            );
          }
        c.structure.layoutMode !== void 0 && (p.layoutMode = c.structure.layoutMode), c.structure.primaryAxisSizingMode !== void 0 && (p.primaryAxisSizingMode = c.structure.primaryAxisSizingMode), c.structure.counterAxisSizingMode !== void 0 && (p.counterAxisSizingMode = c.structure.counterAxisSizingMode), c.structure.paddingLeft !== void 0 && (p.paddingLeft = c.structure.paddingLeft), c.structure.paddingRight !== void 0 && (p.paddingRight = c.structure.paddingRight), c.structure.paddingTop !== void 0 && (p.paddingTop = c.structure.paddingTop), c.structure.paddingBottom !== void 0 && (p.paddingBottom = c.structure.paddingBottom), c.structure.itemSpacing !== void 0 && (p.itemSpacing = c.structure.itemSpacing), c.structure.cornerRadius !== void 0 && (p.cornerRadius = c.structure.cornerRadius), await a.log(
          `  DEBUG: Structure keys: ${Object.keys(c.structure).join(", ")}, has children: ${!!c.structure.children}, has child: ${!!c.structure.child}`
        );
        const y = c.structure.children || (c.structure.child ? c.structure.child : null);
        if (await a.log(
          `  DEBUG: childrenArray exists: ${!!y}, isArray: ${Array.isArray(y)}, length: ${y ? y.length : 0}`
        ), y && Array.isArray(y) && y.length > 0) {
          await a.log(
            `  Recreating ${y.length} child(ren) for component "${c.componentName}"`
          );
          for (let w = 0; w < y.length; w++) {
            const b = y[w];
            if (await a.log(
              `  DEBUG: Processing child ${w + 1}/${y.length}: ${JSON.stringify({ name: b == null ? void 0 : b.name, type: b == null ? void 0 : b.type, hasTruncated: !!(b != null && b._truncated) })}`
            ), b._truncated) {
              await a.log(
                `  Skipping truncated child: ${b._reason || "Unknown"}`
              );
              continue;
            }
            await a.log(
              `  Recreating child: "${b.name || "Unnamed"}" (type: ${b.type})`
            );
            const P = await Y(
              b,
              p,
              t,
              n,
              null,
              r,
              s,
              !0,
              // isRemoteStructure: true
              null,
              // remoteComponentMap - not needed here
              null
              // deferredInstances - not needed for remote instances
            );
            P ? (p.appendChild(P), await a.log(
              `  ✓ Appended child "${b.name || "Unnamed"}" to component "${c.componentName}"`
            )) : await a.warning(
              `  ✗ Failed to create child "${b.name || "Unnamed"}" (type: ${b.type})`
            );
          }
        }
        i.set(g, p), await a.log(
          `✓ Created remote component: "${f}" (index ${g})`
        );
      } catch (y) {
        await a.warning(
          `Error populating remote component "${c.componentName}": ${y instanceof Error ? y.message : "Unknown error"}`
        ), p.remove();
      }
    } catch (p) {
      await a.warning(
        `Error recreating remote instance "${c.componentName}": ${p instanceof Error ? p.message : "Unknown error"}`
      );
    }
  }
  return await a.log(
    `Remote instance processing complete: ${i.size} component(s) created`
  ), i;
}
async function Qt(e, t, n, r, o, l, i = null, m = null, h = !1) {
  await a.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const N = figma.root.children, s = "RecursicaPublishedMetadata";
  let A = null;
  for (const y of N) {
    const w = y.getPluginData(s);
    if (w)
      try {
        if (JSON.parse(w).id === e.guid) {
          A = y;
          break;
        }
      } catch (b) {
        continue;
      }
  }
  let $ = !1;
  if (A && !h) {
    let y;
    try {
      const P = A.getPluginData(s);
      P && (y = JSON.parse(P).version);
    } catch (P) {
    }
    const w = y !== void 0 ? ` v${y}` : "", b = `Found existing component "${A.name}${w}". Should I use it or create a copy?`;
    await a.log(
      `Found existing page with same GUID: "${A.name}". Prompting user...`
    );
    try {
      await q.prompt(b, {
        okLabel: "Use",
        cancelLabel: "Copy",
        timeoutMs: 3e5
        // 5 minutes
      }), $ = !0, await a.log(
        `User chose to use existing page: "${A.name}"`
      );
    } catch (P) {
      await a.log(
        "User chose to create a copy. Will create new page."
      );
    }
  }
  if ($ && A)
    return await figma.setCurrentPageAsync(A), await a.log(
      `Using existing page: "${A.name}" (GUID: ${e.guid.substring(0, 8)}...)`
    ), await a.log(
      `  Instances from other pages will resolve to components on this existing page using componentPageName: "${A.name}"`
    ), {
      success: !0,
      page: A,
      // Include pageId so it can be tracked in importedPages
      pageId: A.id
    };
  const c = N.find((y) => y.name === e.name);
  c && await a.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let g;
  if (A || c) {
    const y = `__${e.name}`;
    g = await Me(y), await a.log(
      `Creating scratch page: "${g}" (will be renamed to "${e.name}" on success)`
    );
  } else
    g = e.name, await a.log(`Creating page: "${g}"`);
  const d = figma.createPage();
  if (d.name = g, await figma.setCurrentPageAsync(d), await a.log(`Switched to page: "${g}"`), !t.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await a.log("Recreating page structure...");
  const u = t.pageData;
  if (u.backgrounds !== void 0)
    try {
      d.backgrounds = u.backgrounds, await a.log(
        `Set page background: ${JSON.stringify(u.backgrounds)}`
      );
    } catch (y) {
      await a.warning(`Failed to set page background: ${y}`);
    }
  Pe(u);
  const v = /* @__PURE__ */ new Map(), C = (y, w = []) => {
    if (y.type === "COMPONENT" && y.id && w.push(y.id), y.children && Array.isArray(y.children))
      for (const b of y.children)
        b._truncated || C(b, w);
    return w;
  }, f = C(u);
  if (await a.log(
    `Found ${f.length} COMPONENT node(s) in page data`
  ), f.length > 0 && (await a.log(
    `Component IDs in page data (first 20): ${f.slice(0, 20).map((y) => y.substring(0, 8) + "...").join(", ")}`
  ), u._allComponentIds = f), u.children && Array.isArray(u.children))
    for (const y of u.children) {
      const w = await Y(
        y,
        d,
        n,
        r,
        o,
        l,
        v,
        !1,
        // isRemoteStructure: false - we're creating the main page
        i,
        m
      );
      w && d.appendChild(w);
    }
  await a.log("Page structure recreated successfully");
  const p = {
    _ver: 1,
    id: e.guid,
    name: e.name,
    version: e.version || 0,
    publishDate: (/* @__PURE__ */ new Date()).toISOString(),
    history: {}
  };
  if (d.setPluginData(s, JSON.stringify(p)), await a.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), g.startsWith("__")) {
    const y = await Me(e.name);
    d.name = y, await a.log(`Renamed page from "${g}" to "${y}"`);
  }
  return {
    success: !0,
    page: d
  };
}
async function Be(e) {
  var r;
  e.clearConsole !== !1 && await a.clear(), await a.log("=== Starting Page Import ===");
  const n = [];
  try {
    const o = e.jsonData;
    if (!o)
      return await a.error("JSON data is required"), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "JSON data is required",
        data: {}
      };
    await a.log("Validating metadata...");
    const l = Ft(o);
    if (!l.success)
      return await a.error(l.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: l.error,
        data: {}
      };
    const i = l.metadata;
    await a.log(
      `Metadata validated: guid=${i.guid}, name=${i.name}`
    ), await a.log("Loading string table...");
    const m = je(o);
    if (!m.success)
      return await a.error(m.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: m.error,
        data: {}
      };
    await a.log("String table loaded successfully"), await a.log("Expanding JSON data...");
    const h = m.expandedJsonData;
    await a.log("JSON expanded successfully"), await a.log("Loading collections table...");
    const N = Ut(h);
    if (!N.success)
      return N.error === "No collections table found in JSON" ? (await a.log(N.error), await a.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: i.name }
      }) : (await a.error(N.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: N.error,
        data: {}
      });
    const s = N.collectionTable;
    await a.log(
      `Loaded collections table with ${s.getSize()} collection(s)`
    ), await a.log(
      "Matching collections with existing local collections..."
    );
    const { recognizedCollections: A, potentialMatches: $, collectionsToCreate: c } = await jt(s);
    await Bt(
      $,
      A,
      c
    ), await Jt(
      A,
      s,
      $
    ), await Kt(
      c,
      A,
      n
    ), await a.log("Loading variables table...");
    const g = Wt(h);
    if (!g.success)
      return g.error === "No variables table found in JSON" ? (await a.log(g.error), await a.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no variables to process)",
        data: { pageName: i.name }
      }) : (await a.error(g.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: g.error,
        data: {}
      });
    const d = g.variableTable;
    await a.log(
      `Loaded variables table with ${d.getSize()} variable(s)`
    );
    const { recognizedVariables: u, newlyCreatedVariables: v } = await Ht(
      d,
      s,
      A,
      n
    );
    await a.log("Loading instance table...");
    const C = qt(h);
    if (C) {
      const O = C.getSerializedTable(), k = Object.values(O).filter(
        (x) => x.instanceType === "internal"
      ), G = Object.values(O).filter(
        (x) => x.instanceType === "remote"
      );
      await a.log(
        `Loaded instance table with ${C.getSize()} instance(s) (${k.length} internal, ${G.length} remote)`
      );
    } else
      await a.log("No instance table found in JSON");
    let f = null;
    C && (f = await Zt(
      C,
      d,
      s,
      u
    ));
    const p = [], y = (r = e.isMainPage) != null ? r : !0, w = await Qt(
      i,
      h,
      d,
      s,
      C,
      u,
      f,
      p,
      y
    );
    if (!w.success)
      return await a.error(w.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: w.error,
        data: {}
      };
    const b = w.page, P = u.size + v.length, E = p.length;
    await a.log("=== Import Complete ==="), await a.log(
      `Successfully processed ${A.size} collection(s), ${P} variable(s), and created page "${b.name}"${E > 0 ? ` (${E} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`
    );
    const S = w.pageId || b.id;
    return {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: {
        pageName: b.name,
        pageId: S,
        // Include pageId for tracking (used for both new and reused pages)
        deferredInstances: E > 0 ? p : void 0,
        createdEntities: {
          pageIds: [b.id],
          collectionIds: n.map((O) => O.id),
          variableIds: v.map((O) => O.id)
        }
      }
    };
  } catch (o) {
    const l = o instanceof Error ? o.message : "Unknown error occurred";
    return await a.error(`Import failed: ${l}`), o instanceof Error && o.stack && await a.error(`Stack trace: ${o.stack}`), console.error("Error importing page:", o), {
      type: "importPage",
      success: !1,
      error: !0,
      message: l,
      data: {}
    };
  }
}
async function Je(e) {
  if (e.length === 0)
    return { resolved: 0, failed: 0, errors: [] };
  await a.log(
    `=== Resolving ${e.length} deferred normal instance(s) ===`
  );
  let t = 0, n = 0;
  const r = [];
  await figma.loadAllPagesAsync();
  for (const o of e)
    try {
      const { placeholderFrame: l, instanceEntry: i, nodeData: m, parentNode: h } = o, N = figma.root.children.find(
        (g) => g.name === i.componentPageName
      );
      if (!N) {
        const g = `Deferred instance "${m.name}" still cannot find referenced page "${i.componentPageName}"`;
        await a.error(g), r.push(g), n++;
        continue;
      }
      const s = (g, d, u, v) => {
        if (d.length === 0) {
          let p = null;
          for (const y of g.children || [])
            if (y.type === "COMPONENT") {
              if (y.name === u)
                if (p || (p = y), v)
                  try {
                    const w = y.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (w && JSON.parse(w).id === v)
                      return y;
                  } catch (w) {
                  }
                else
                  return y;
            } else if (y.type === "COMPONENT_SET") {
              for (const w of y.children || [])
                if (w.type === "COMPONENT" && w.name === u)
                  if (p || (p = w), v)
                    try {
                      const b = w.getPluginData(
                        "RecursicaPublishedMetadata"
                      );
                      if (b && JSON.parse(b).id === v)
                        return w;
                    } catch (b) {
                    }
                  else
                    return w;
            }
          return p;
        }
        const [C, ...f] = d;
        for (const p of g.children || [])
          if (p.name === C)
            return s(
              p,
              f,
              u,
              v
            );
        return null;
      }, A = s(
        N,
        i.path || [],
        i.componentName,
        i.componentGuid
      );
      if (!A) {
        const g = i.path && i.path.length > 0 ? ` at path [${i.path.join(" → ")}]` : " at page root", d = `Deferred instance "${m.name}" still cannot find component "${i.componentName}" on page "${i.componentPageName}"${g}`;
        await a.error(d), r.push(d), n++;
        continue;
      }
      const $ = A.createInstance();
      if ($.name = m.name || l.name.replace("[Deferred: ", "").replace("]", ""), $.x = l.x, $.y = l.y, l.width !== void 0 && l.height !== void 0 && $.resize(l.width, l.height), i.variantProperties && Object.keys(i.variantProperties).length > 0)
        try {
          const g = await $.getMainComponentAsync();
          if (g) {
            let d = null;
            const u = g.type;
            if (u === "COMPONENT_SET" ? d = g.componentPropertyDefinitions : u === "COMPONENT" && g.parent && g.parent.type === "COMPONENT_SET" ? d = g.parent.componentPropertyDefinitions : await a.warning(
              `Cannot set variant properties for resolved instance "${m.name}" - main component is not a COMPONENT_SET or variant`
            ), d) {
              const v = {};
              for (const [C, f] of Object.entries(
                i.variantProperties
              )) {
                const p = C.split("#")[0];
                d[p] && (v[p] = f);
              }
              Object.keys(v).length > 0 && $.setProperties(v);
            }
          }
        } catch (g) {
          await a.warning(
            `Failed to set variant properties for resolved instance "${m.name}": ${g}`
          );
        }
      if (i.componentProperties && Object.keys(i.componentProperties).length > 0)
        try {
          const g = await $.getMainComponentAsync();
          if (g) {
            let d = null;
            const u = g.type;
            if (u === "COMPONENT_SET" ? d = g.componentPropertyDefinitions : u === "COMPONENT" && g.parent && g.parent.type === "COMPONENT_SET" ? d = g.parent.componentPropertyDefinitions : u === "COMPONENT" && (d = g.componentPropertyDefinitions), d)
              for (const [v, C] of Object.entries(
                i.componentProperties
              )) {
                const f = v.split("#")[0];
                if (d[f])
                  try {
                    $.setProperties({
                      [f]: C
                    });
                  } catch (p) {
                    await a.warning(
                      `Failed to set component property "${f}" for resolved instance "${m.name}": ${p}`
                    );
                  }
              }
          }
        } catch (g) {
          await a.warning(
            `Failed to set component properties for resolved instance "${m.name}": ${g}`
          );
        }
      const c = h.children.indexOf(l);
      h.insertChild(c, $), l.remove(), await a.log(
        `  ✓ Resolved deferred instance "${m.name}" from component "${i.componentName}" on page "${i.componentPageName}"`
      ), t++;
    } catch (l) {
      const i = l instanceof Error ? l.message : String(l), m = `Failed to resolve deferred instance "${o.nodeData.name}": ${i}`;
      await a.error(m), r.push(m), n++;
    }
  return await a.log(
    `=== Deferred Resolution Complete: ${t} resolved, ${n} failed ===`
  ), { resolved: t, failed: n, errors: r };
}
async function Dt(e) {
  await a.log("=== Cleaning up created entities ===");
  try {
    const { pageIds: t, collectionIds: n, variableIds: r } = e;
    let o = 0;
    for (const m of r)
      try {
        const h = figma.variables.getVariableById(m);
        if (h) {
          const N = h.variableCollectionId;
          n.includes(N) || (h.remove(), o++);
        }
      } catch (h) {
        await a.warning(
          `Could not delete variable ${m.substring(0, 8)}...: ${h}`
        );
      }
    let l = 0;
    for (const m of n)
      try {
        const h = figma.variables.getVariableCollectionById(m);
        h && (h.remove(), l++);
      } catch (h) {
        await a.warning(
          `Could not delete collection ${m.substring(0, 8)}...: ${h}`
        );
      }
    await figma.loadAllPagesAsync();
    let i = 0;
    for (const m of t)
      try {
        const h = await figma.getNodeByIdAsync(m);
        h && h.type === "PAGE" && (h.remove(), i++);
      } catch (h) {
        await a.warning(
          `Could not delete page ${m.substring(0, 8)}...: ${h}`
        );
      }
    return await a.log(
      `Cleanup complete: Deleted ${i} page(s), ${l} collection(s), ${o} variable(s)`
    ), {
      type: "cleanupCreatedEntities",
      success: !0,
      error: !1,
      message: "Cleanup completed successfully",
      data: {
        deletedPages: i,
        deletedCollections: l,
        deletedVariables: o
      }
    };
  } catch (t) {
    const n = t instanceof Error ? t.message : "Unknown error occurred";
    return await a.error(`Cleanup failed: ${n}`), {
      type: "cleanupCreatedEntities",
      success: !1,
      error: !0,
      message: n,
      data: {}
    };
  }
}
async function Ke(e) {
  const t = [];
  for (const { fileName: n, jsonData: r } of e)
    try {
      const o = je(r);
      if (!o.success || !o.expandedJsonData) {
        await a.warning(
          `Skipping ${n} - failed to expand JSON: ${o.error || "Unknown error"}`
        );
        continue;
      }
      const l = o.expandedJsonData, i = l.metadata;
      if (!i || !i.name || !i.guid) {
        await a.warning(
          `Skipping ${n} - missing or invalid metadata`
        );
        continue;
      }
      const m = [];
      if (l.instances) {
        const N = Q.fromTable(
          l.instances
        ).getSerializedTable();
        for (const s of Object.values(N))
          s.instanceType === "normal" && s.componentPageName && (m.includes(s.componentPageName) || m.push(s.componentPageName));
      }
      t.push({
        fileName: n,
        pageName: i.name,
        pageGuid: i.guid,
        dependencies: m,
        jsonData: r
        // Store original JSON data for import
      }), await a.log(
        `  ${n}: "${i.name}" depends on: ${m.length > 0 ? m.join(", ") : "none"}`
      );
    } catch (o) {
      await a.error(
        `Error processing ${n}: ${o instanceof Error ? o.message : String(o)}`
      );
    }
  return t;
}
function We(e) {
  const t = [], n = [], r = [], o = /* @__PURE__ */ new Map();
  for (const N of e)
    o.set(N.pageName, N);
  const l = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), m = [], h = (N) => {
    if (l.has(N.pageName))
      return !1;
    if (i.has(N.pageName)) {
      const s = m.findIndex(
        (A) => A.pageName === N.pageName
      );
      if (s !== -1) {
        const A = m.slice(s).concat([N]);
        return n.push(A), !0;
      }
      return !1;
    }
    i.add(N.pageName), m.push(N);
    for (const s of N.dependencies) {
      const A = o.get(s);
      A && h(A);
    }
    return i.delete(N.pageName), m.pop(), l.add(N.pageName), t.push(N), !1;
  };
  for (const N of e)
    l.has(N.pageName) || h(N);
  for (const N of e)
    for (const s of N.dependencies)
      o.has(s) || r.push(
        `Page "${N.pageName}" (${N.fileName}) depends on "${s}" which is not in the import set`
      );
  return { order: t, cycles: n, errors: r };
}
async function He(e) {
  await a.log("=== Building Dependency Graph ===");
  const t = await Ke(e);
  await a.log("=== Resolving Import Order ===");
  const n = We(t);
  if (n.cycles.length > 0) {
    await a.log(
      `Detected ${n.cycles.length} circular dependency cycle(s):`
    );
    for (const r of n.cycles) {
      const o = r.map((l) => `"${l.pageName}"`).join(" → ");
      await a.log(`  Cycle: ${o} → (back to start)`);
    }
    await a.log(
      "  Circular dependencies will be handled with deferred instance resolution"
    );
  }
  if (n.errors.length > 0) {
    await a.warning(
      `Found ${n.errors.length} missing dependency warning(s):`
    );
    for (const r of n.errors)
      await a.warning(`  ${r}`);
  }
  await a.log(
    `Import order determined: ${n.order.length} page(s)`
  );
  for (let r = 0; r < n.order.length; r++) {
    const o = n.order[r];
    await a.log(`  ${r + 1}. ${o.fileName} ("${o.pageName}")`);
  }
  return n;
}
async function en(e) {
  var g, d, u, v, C;
  const { jsonFiles: t } = e;
  if (!t || !Array.isArray(t))
    return {
      type: "importPagesInOrder",
      success: !1,
      error: !0,
      message: "jsonFiles must be an array",
      data: {}
    };
  await a.log("=== Determining Import Order ===");
  const {
    order: n,
    cycles: r,
    errors: o
  } = await He(t);
  o.length > 0 && await a.warning(
    `Found ${o.length} dependency warning(s) - some dependencies may be missing`
  ), r.length > 0 && await a.log(
    `Detected ${r.length} circular dependency cycle(s) - will use deferred resolution`
  ), await a.log("=== Importing Pages in Order ===");
  let l = 0, i = 0;
  const m = [...o], h = [], N = {
    pageIds: [],
    collectionIds: [],
    variableIds: []
  }, s = [], A = e.mainFileName;
  for (let f = 0; f < n.length; f++) {
    const p = n[f], y = A ? p.fileName === A : f === n.length - 1;
    await a.log(
      `[${f + 1}/${n.length}] Importing ${p.fileName} ("${p.pageName}")${y ? " [MAIN]" : " [DEPENDENCY]"}...`
    );
    try {
      const w = f === 0, b = await Be({
        jsonData: p.jsonData,
        isMainPage: y,
        clearConsole: w
      });
      if (b.success) {
        if (l++, (g = b.data) != null && g.deferredInstances) {
          const P = b.data.deferredInstances;
          Array.isArray(P) && h.push(...P);
        }
        if ((d = b.data) != null && d.createdEntities) {
          const P = b.data.createdEntities;
          P.pageIds && N.pageIds.push(...P.pageIds), P.collectionIds && N.collectionIds.push(...P.collectionIds), P.variableIds && N.variableIds.push(...P.variableIds);
          const E = ((u = P.pageIds) == null ? void 0 : u[0]) || ((v = b.data) == null ? void 0 : v.pageId);
          (C = b.data) != null && C.pageName && E && s.push({
            name: b.data.pageName,
            pageId: E
          });
        }
      } else
        i++, m.push(
          `Failed to import ${p.fileName}: ${b.message || "Unknown error"}`
        );
    } catch (w) {
      i++;
      const b = w instanceof Error ? w.message : String(w);
      m.push(`Failed to import ${p.fileName}: ${b}`);
    }
  }
  if (h.length > 0) {
    await a.log(
      `=== Resolving ${h.length} Deferred Instance(s) ===`
    );
    try {
      const f = await Je(h);
      await a.log(
        `  Resolved: ${f.resolved}, Failed: ${f.failed}`
      ), f.errors.length > 0 && m.push(...f.errors);
    } catch (f) {
      m.push(
        `Failed to resolve deferred instances: ${f instanceof Error ? f.message : String(f)}`
      );
    }
  }
  await a.log("=== Import Summary ==="), await a.log(
    `  Imported: ${l}, Failed: ${i}, Deferred instances: ${h.length}`
  );
  const $ = i === 0, c = $ ? `Successfully imported ${l} page(s)${h.length > 0 ? ` (${h.length} deferred instance(s) resolved)` : ""}` : `Import completed with ${i} failure(s). ${m.join("; ")}`;
  return {
    type: "importPagesInOrder",
    success: $,
    error: !$,
    message: c,
    data: {
      imported: l,
      failed: i,
      deferred: h.length,
      errors: m,
      importedPages: s,
      createdEntities: N
    }
  };
}
async function tn(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children;
    console.log("Found " + t.length + " pages in the document");
    const n = 11, r = t[n];
    if (!r)
      return {
        type: "quickCopy",
        success: !1,
        error: !0,
        message: "No page found at index 11",
        data: {}
      };
    const o = await me(
      r,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + r.name + " (index: " + n + ")"
    );
    const l = JSON.stringify(o, null, 2), i = JSON.parse(l), m = "Copy - " + i.name, h = figma.createPage();
    if (h.name = m, figma.root.appendChild(h), i.children && i.children.length > 0) {
      let A = function(c) {
        c.forEach((g) => {
          const d = (g.x || 0) + (g.width || 0);
          d > $ && ($ = d), g.children && g.children.length > 0 && A(g.children);
        });
      };
      console.log(
        "Recreating " + i.children.length + " top-level children..."
      );
      let $ = 0;
      A(i.children), console.log("Original content rightmost edge: " + $);
      for (const c of i.children)
        await Y(c, h, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const N = pe(i);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: i.name,
        newPageName: m,
        totalNodes: N
      }
    };
  } catch (t) {
    return console.error("Error performing quick copy:", t), {
      type: "quickCopy",
      success: !1,
      error: !0,
      message: t instanceof Error ? t.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function nn(e) {
  try {
    const t = e.accessToken, n = e.selectedRepo;
    return t ? (await figma.clientStorage.setAsync("accessToken", t), n && await figma.clientStorage.setAsync("selectedRepo", n), {
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
  } catch (t) {
    return {
      type: "storeAuthData",
      success: !1,
      error: !0,
      message: t instanceof Error ? t.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function rn(e) {
  try {
    const t = await figma.clientStorage.getAsync("accessToken"), n = await figma.clientStorage.getAsync("selectedRepo");
    return {
      type: "loadAuthData",
      success: !0,
      error: !1,
      message: "Auth data loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        accessToken: t || void 0,
        selectedRepo: n || void 0
      }
    };
  } catch (t) {
    return {
      type: "loadAuthData",
      success: !1,
      error: !0,
      message: t instanceof Error ? t.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function an(e) {
  try {
    return await figma.clientStorage.deleteAsync("accessToken"), await figma.clientStorage.deleteAsync("selectedRepo"), {
      type: "clearAuthData",
      success: !0,
      error: !1,
      message: "Auth data cleared successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    };
  } catch (t) {
    return {
      type: "clearAuthData",
      success: !1,
      error: !0,
      message: t instanceof Error ? t.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function on(e) {
  try {
    const t = e.selectedRepo;
    return t ? (await figma.clientStorage.setAsync("selectedRepo", t), {
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
  } catch (t) {
    return {
      type: "storeSelectedRepo",
      success: !1,
      error: !0,
      message: t instanceof Error ? t.message : "Unknown error occurred",
      data: {}
    };
  }
}
function ve(e, t = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: t
  };
}
function qe(e, t, n = {}) {
  const r = t instanceof Error ? t.message : t;
  return {
    type: e,
    success: !1,
    error: !0,
    message: r,
    data: n
  };
}
const Ye = "RecursicaPublishedMetadata";
async function sn(e) {
  try {
    const t = figma.currentPage;
    await figma.loadAllPagesAsync();
    const r = figma.root.children.findIndex(
      (m) => m.id === t.id
    ), o = t.getPluginData(Ye);
    if (!o) {
      const N = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: se(t.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: r
      };
      return ve("getComponentMetadata", N);
    }
    const i = {
      componentMetadata: JSON.parse(o),
      currentPageIndex: r
    };
    return ve("getComponentMetadata", i);
  } catch (t) {
    return console.error("Error getting component metadata:", t), qe(
      "getComponentMetadata",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function cn(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children, n = [];
    for (const o of t) {
      if (o.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${o.name} (type: ${o.type})`
        );
        continue;
      }
      const l = o, i = l.getPluginData(Ye);
      if (i)
        try {
          const m = JSON.parse(i);
          n.push(m);
        } catch (m) {
          console.warn(
            `Failed to parse metadata for page "${l.name}":`,
            m
          );
          const N = {
            _ver: 1,
            id: "",
            name: se(l.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          n.push(N);
        }
      else {
        const h = {
          _ver: 1,
          id: "",
          name: se(l.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        n.push(h);
      }
    }
    return ve("getAllComponents", {
      components: n
    });
  } catch (t) {
    return console.error("Error getting all components:", t), qe(
      "getAllComponents",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function ln(e) {
  try {
    const t = e.requestId, n = e.action;
    return !t || !n ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (q.handleResponse({ requestId: t, action: n }), {
      type: "pluginPromptResponse",
      success: !0,
      error: !1,
      message: "Prompt response handled successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    });
  } catch (t) {
    return {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: t instanceof Error ? t.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function dn(e) {
  try {
    const { pageId: t } = e;
    await figma.loadAllPagesAsync();
    const n = await figma.getNodeByIdAsync(t);
    return !n || n.type !== "PAGE" ? {
      type: "switchToPage",
      success: !1,
      error: !0,
      message: `Page with ID ${t.substring(0, 8)}... not found`,
      data: {}
    } : (await figma.setCurrentPageAsync(n), {
      type: "switchToPage",
      success: !0,
      error: !1,
      message: `Switched to page "${n.name}"`,
      data: {
        pageName: n.name
      }
    });
  } catch (t) {
    return {
      type: "switchToPage",
      success: !1,
      error: !0,
      message: t instanceof Error ? t.message : "Unknown error occurred",
      data: {}
    };
  }
}
const pn = {
  getCurrentUser: tt,
  loadPages: nt,
  exportPage: $e,
  importPage: Be,
  cleanupCreatedEntities: Dt,
  resolveDeferredNormalInstances: Je,
  determineImportOrder: He,
  buildDependencyGraph: Ke,
  resolveImportOrder: We,
  importPagesInOrder: en,
  quickCopy: tn,
  storeAuthData: nn,
  loadAuthData: rn,
  clearAuthData: an,
  storeSelectedRepo: on,
  getComponentMetadata: sn,
  getAllComponents: cn,
  pluginPromptResponse: ln,
  switchToPage: dn
}, mn = pn;
figma.showUI(__html__, {
  width: 500,
  height: 500
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    pt(e);
    return;
  }
  const t = e;
  try {
    const n = t.type, r = mn[n];
    if (!r) {
      console.warn("Unknown message type:", t.type);
      const l = {
        type: t.type,
        success: !1,
        error: !0,
        message: "Unknown message type: " + t.type,
        data: {},
        requestId: t.requestId
      };
      figma.ui.postMessage(l);
      return;
    }
    const o = await r(t.data);
    figma.ui.postMessage(V(I({}, o), {
      requestId: t.requestId
    }));
  } catch (n) {
    console.error("Error handling message:", n);
    const r = {
      type: t.type,
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {},
      requestId: t.requestId
    };
    figma.ui.postMessage(r);
  }
};
