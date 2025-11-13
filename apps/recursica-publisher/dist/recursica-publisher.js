var Xe = Object.defineProperty, Ze = Object.defineProperties;
var Qe = Object.getOwnPropertyDescriptors;
var Ee = Object.getOwnPropertySymbols;
var De = Object.prototype.hasOwnProperty, et = Object.prototype.propertyIsEnumerable;
var ue = (e, t, n) => t in e ? Xe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, S = (e, t) => {
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
        pages: figma.root.children.map((i, c) => ({
          name: i.name,
          index: c
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
}, _ = V(S({}, z), {
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
}), U = V(S({}, z), {
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
}), H = V(S({}, z), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), Me = V(S({}, z), {
  cornerRadius: 0
}), rt = V(S({}, z), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function at(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return _;
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
      return Me;
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
        (i) => !(i in t) || T(e[i], t[i])
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
    for (const i of n)
      r.add(i);
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
      const o = this.findCollectionByNormalizedName(r);
      if (o !== void 0) {
        const m = this.collections[o];
        return m.modes = this.mergeModes(
          m.modes,
          t.modes
        ), this.collectionMap.set(n, o), o;
      }
    }
    const i = this.nextIndex++;
    this.collectionMap.set(n, i);
    const c = V(S({}, t), {
      collectionName: r
    });
    if (W(t.collectionName)) {
      const o = Ae(
        t.collectionName
      );
      o && (c.collectionGuid = o), this.normalizedNameMap.set(r, i);
    }
    return this.collections[i] = c, i;
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
      const r = this.collections[n], i = S({
        collectionName: r.collectionName,
        modes: r.modes
      }, r.collectionGuid && { collectionGuid: r.collectionGuid });
      t[String(n)] = i;
    }
    return t;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   * Handles both new format (without collectionId/isLocal) and legacy format (with collectionId/isLocal)
   */
  static fromTable(t) {
    var i;
    const n = new ce(), r = Object.entries(t).sort(
      (c, o) => parseInt(c[0], 10) - parseInt(o[0], 10)
    );
    for (const [c, o] of r) {
      const m = parseInt(c, 10), g = (i = o.isLocal) != null ? i : !0, y = K(
        o.collectionName || ""
      ), s = o.collectionId || o.collectionGuid || `temp:${m}:${y}`, $ = S({
        collectionName: y,
        collectionId: s,
        isLocal: g,
        modes: o.modes || []
      }, o.collectionGuid && {
        collectionGuid: o.collectionGuid
      });
      n.collectionMap.set(s, m), n.collections[m] = $, W(y) && n.normalizedNameMap.set(y, m), n.nextIndex = Math.max(
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
const it = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, ot = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function st(e) {
  var n;
  const t = e.toUpperCase();
  return (n = it[t]) != null ? n : e;
}
function ct(e) {
  var t;
  return typeof e == "number" ? (t = ot[e]) != null ? t : e.toString() : e;
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
    for (const [r, i] of Object.entries(t))
      typeof i == "object" && i !== null && "_varRef" in i && typeof i._varRef == "number" ? n[r] = {
        _varRef: i._varRef
      } : n[r] = i;
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
      const r = this.variables[n], i = this.serializeValuesByMode(
        r.valuesByMode
      ), c = S(S({
        variableName: r.variableName,
        variableType: st(r.variableType)
      }, r._colRef !== void 0 && { _colRef: r._colRef }), i && { valuesByMode: i });
      t[String(n)] = c;
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
      (i, c) => parseInt(i[0], 10) - parseInt(c[0], 10)
    );
    for (const [i, c] of r) {
      const o = parseInt(i, 10), m = ct(c.variableType), g = V(S({}, c), {
        variableType: m
        // Always a string after expansion
      });
      n.variables[o] = g, n.nextIndex = Math.max(n.nextIndex, o + 1);
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
function $e() {
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
async function ke(e, t, n, r, i = /* @__PURE__ */ new Set()) {
  const c = {};
  for (const [o, m] of Object.entries(e)) {
    const g = mt(o, r);
    if (m == null) {
      c[g] = m;
      continue;
    }
    if (typeof m == "string" || typeof m == "number" || typeof m == "boolean") {
      c[g] = m;
      continue;
    }
    if (typeof m == "object" && m !== null && "type" in m && m.type === "VARIABLE_ALIAS" && "id" in m) {
      const y = m.id;
      if (i.has(y)) {
        c[g] = {
          type: "VARIABLE_ALIAS",
          id: y
        };
        continue;
      }
      const s = await figma.variables.getVariableByIdAsync(y);
      if (!s) {
        c[g] = {
          type: "VARIABLE_ALIAS",
          id: y
        };
        continue;
      }
      const $ = new Set(i);
      $.add(y);
      const l = await figma.variables.getVariableCollectionByIdAsync(
        s.variableCollectionId
      ), p = s.key;
      if (!p) {
        c[g] = {
          type: "VARIABLE_ALIAS",
          id: y
        };
        continue;
      }
      const d = {
        variableName: s.name,
        variableType: s.resolvedType,
        collectionName: l == null ? void 0 : l.name,
        collectionId: s.variableCollectionId,
        variableKey: p,
        id: y,
        isLocal: !s.remote
      };
      if (l) {
        const b = await Le(
          l,
          n
        );
        d._colRef = b, s.valuesByMode && (d.valuesByMode = await ke(
          s.valuesByMode,
          t,
          n,
          l,
          // Pass collection for mode ID to name conversion
          $
        ));
      }
      const N = t.addVariable(d);
      c[g] = {
        type: "VARIABLE_ALIAS",
        id: y,
        _varRef: N
      };
    } else
      c[g] = m;
  }
  return c;
}
const re = "recursica:collectionId";
async function ft(e) {
  if (e.remote === !0) {
    const n = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(n)) {
      const i = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await a.error(i), new Error(i);
    }
    return e.id;
  } else {
    if (W(e.name)) {
      const i = Ae(e.name);
      if (i) {
        const c = e.getSharedPluginData(
          "recursica",
          re
        );
        return (!c || c.trim() === "") && e.setSharedPluginData(
          "recursica",
          re,
          i
        ), i;
      }
    }
    const n = e.getSharedPluginData(
      "recursica",
      re
    );
    if (n && n.trim() !== "")
      return n;
    const r = await $e();
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
async function Le(e, t) {
  const n = !e.remote, r = t.getCollectionIndex(e.id);
  if (r !== -1)
    return r;
  gt(e.name, n);
  const i = await ft(e), c = e.modes.map((y) => y.name), o = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: n,
    modes: c,
    collectionGuid: i
  }, m = t.addCollection(o), g = n ? "local" : "remote";
  return await a.log(
    `  Added ${g} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), m;
}
async function Te(e, t, n) {
  if (!e || typeof e != "object" || e.type !== "VARIABLE_ALIAS")
    return null;
  try {
    const r = await figma.variables.getVariableByIdAsync(e.id);
    if (!r)
      return console.log("Could not resolve variable alias:", e.id), null;
    const i = await figma.variables.getVariableCollectionByIdAsync(
      r.variableCollectionId
    );
    if (!i)
      return console.log("Could not resolve collection for variable:", e.id), null;
    const c = r.key;
    if (!c)
      return console.log("Variable missing key:", e.id), null;
    const o = await Le(
      i,
      n
    ), m = {
      variableName: r.name,
      variableType: r.resolvedType,
      _colRef: o,
      // Reference to collection table (v2.4.0+)
      variableKey: c,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    r.valuesByMode && (m.valuesByMode = await ke(
      r.valuesByMode,
      t,
      n,
      i,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const g = t.addVariable(m);
    return lt(g);
  } catch (r) {
    const i = r instanceof Error ? r.message : String(r);
    throw console.error("Could not resolve variable alias:", e.id, r), new Error(
      `Failed to resolve variable alias ${e.id}: ${i}`
    );
  }
}
async function oe(e, t, n) {
  if (!e || typeof e != "object") return e;
  const r = {};
  for (const i in e)
    if (Object.prototype.hasOwnProperty.call(e, i)) {
      const c = e[i];
      if (c && typeof c == "object" && !Array.isArray(c))
        if (c.type === "VARIABLE_ALIAS") {
          const o = await Te(
            c,
            t,
            n
          );
          o && (r[i] = o);
        } else
          r[i] = await oe(
            c,
            t,
            n
          );
      else Array.isArray(c) ? r[i] = await Promise.all(
        c.map(async (o) => (o == null ? void 0 : o.type) === "VARIABLE_ALIAS" ? await Te(
          o,
          t,
          n
        ) || o : o && typeof o == "object" ? await oe(
          o,
          t,
          n
        ) : o)
      ) : r[i] = c;
    }
  return r;
}
async function ut(e, t, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (r) => {
      if (!r || typeof r != "object") return r;
      const i = {};
      for (const c in r)
        Object.prototype.hasOwnProperty.call(r, c) && (c === "boundVariables" ? i[c] = await oe(
          r[c],
          t,
          n
        ) : i[c] = r[c]);
      return i;
    })
  );
}
async function _e(e, t) {
  const n = {}, r = /* @__PURE__ */ new Set();
  if (e.type && (n.type = e.type, r.add("type")), e.id && (n.id = e.id, r.add("id")), e.name !== void 0 && e.name !== "" && (n.name = e.name, r.add("name")), e.x !== void 0 && e.x !== 0 && (n.x = e.x, r.add("x")), e.y !== void 0 && e.y !== 0 && (n.y = e.y, r.add("y")), e.width !== void 0 && (n.width = e.width, r.add("width")), e.height !== void 0 && (n.height = e.height, r.add("height")), e.visible !== void 0 && T(e.visible, z.visible) && (n.visible = e.visible, r.add("visible")), e.locked !== void 0 && T(e.locked, z.locked) && (n.locked = e.locked, r.add("locked")), e.opacity !== void 0 && T(e.opacity, z.opacity) && (n.opacity = e.opacity, r.add("opacity")), e.rotation !== void 0 && T(e.rotation, z.rotation) && (n.rotation = e.rotation, r.add("rotation")), e.blendMode !== void 0 && T(e.blendMode, z.blendMode) && (n.blendMode = e.blendMode, r.add("blendMode")), e.effects !== void 0 && T(e.effects, z.effects) && (n.effects = e.effects, r.add("effects")), e.fills !== void 0) {
    const i = await ut(
      e.fills,
      t.variableTable,
      t.collectionTable
    );
    T(i, z.fills) && (n.fills = i), r.add("fills");
  }
  if (e.strokes !== void 0 && T(e.strokes, z.strokes) && (n.strokes = e.strokes, r.add("strokes")), e.strokeWeight !== void 0 && T(e.strokeWeight, z.strokeWeight) && (n.strokeWeight = e.strokeWeight, r.add("strokeWeight")), e.strokeAlign !== void 0 && T(e.strokeAlign, z.strokeAlign) && (n.strokeAlign = e.strokeAlign, r.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const i = await oe(
      e.boundVariables,
      t.variableTable,
      t.collectionTable
    );
    Object.keys(i).length > 0 && (n.boundVariables = i), r.add("boundVariables");
  }
  return e.backgrounds !== void 0 && (n.backgrounds = e.backgrounds, r.add("backgrounds")), n;
}
const ht = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseBaseNodeProperties: _e
}, Symbol.toStringTag, { value: "Module" }));
async function we(e, t) {
  const n = {}, r = /* @__PURE__ */ new Set();
  if (e.type === "COMPONENT")
    try {
      e.componentPropertyDefinitions && (n.componentPropertyDefinitions = e.componentPropertyDefinitions, r.add("componentPropertyDefinitions"));
    } catch (i) {
    }
  return e.layoutMode !== void 0 && T(e.layoutMode, _.layoutMode) && (n.layoutMode = e.layoutMode, r.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && T(
    e.primaryAxisSizingMode,
    _.primaryAxisSizingMode
  ) && (n.primaryAxisSizingMode = e.primaryAxisSizingMode, r.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && T(
    e.counterAxisSizingMode,
    _.counterAxisSizingMode
  ) && (n.counterAxisSizingMode = e.counterAxisSizingMode, r.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && T(
    e.primaryAxisAlignItems,
    _.primaryAxisAlignItems
  ) && (n.primaryAxisAlignItems = e.primaryAxisAlignItems, r.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && T(
    e.counterAxisAlignItems,
    _.counterAxisAlignItems
  ) && (n.counterAxisAlignItems = e.counterAxisAlignItems, r.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && T(e.paddingLeft, _.paddingLeft) && (n.paddingLeft = e.paddingLeft, r.add("paddingLeft")), e.paddingRight !== void 0 && T(e.paddingRight, _.paddingRight) && (n.paddingRight = e.paddingRight, r.add("paddingRight")), e.paddingTop !== void 0 && T(e.paddingTop, _.paddingTop) && (n.paddingTop = e.paddingTop, r.add("paddingTop")), e.paddingBottom !== void 0 && T(e.paddingBottom, _.paddingBottom) && (n.paddingBottom = e.paddingBottom, r.add("paddingBottom")), e.itemSpacing !== void 0 && T(e.itemSpacing, _.itemSpacing) && (n.itemSpacing = e.itemSpacing, r.add("itemSpacing")), e.cornerRadius !== void 0 && T(e.cornerRadius, _.cornerRadius) && (n.cornerRadius = e.cornerRadius, r.add("cornerRadius")), e.clipsContent !== void 0 && T(e.clipsContent, _.clipsContent) && (n.clipsContent = e.clipsContent, r.add("clipsContent")), e.layoutWrap !== void 0 && T(e.layoutWrap, _.layoutWrap) && (n.layoutWrap = e.layoutWrap, r.add("layoutWrap")), e.layoutGrow !== void 0 && T(e.layoutGrow, _.layoutGrow) && (n.layoutGrow = e.layoutGrow, r.add("layoutGrow")), n;
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
function bt(e) {
  const t = e.match(/^(\d+\.?\d*)[eE]([+-]?\d+)$/);
  if (t) {
    const n = parseFloat(t[1]), r = parseInt(t[2]), i = n * Math.pow(10, r);
    return Math.abs(i) < 1e-10 ? "0" : i.toFixed(6).replace(/\.?0+$/, "") || "0";
  }
  return e;
}
function ze(e) {
  if (!e || typeof e != "string")
    return e;
  let t = e.replace(/(\d+\.?\d*)[eE]([+-]?\d+)/g, (n) => bt(n));
  return t = t.replace(
    /(\d+\.\d{7,})/g,
    // Match numbers with more than 6 decimal places
    (n) => {
      const r = parseFloat(n);
      return Math.abs(r) < 1e-10 ? "0" : r.toFixed(6).replace(/\.?0+$/, "") || "0";
    }
  ), t = t.replace(
    /([MmLlHhVvCcSsQqTtAaZz])([-\d])/g,
    (n, r, i) => `${r} ${i}`
  ), t = t.replace(/\s+/g, " ").trim(), t;
}
function be(e) {
  return Array.isArray(e) ? e.map((t) => ({
    data: ze(t.data),
    // Normalize winding rule key (use windRule consistently)
    windRule: t.windRule || t.windingRule || "NONZERO"
  })) : e;
}
const Nt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  normalizeSvgPath: ze,
  normalizeVectorGeometry: be
}, Symbol.toStringTag, { value: "Module" }));
async function vt(e, t) {
  const n = {}, r = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && T(e.fillGeometry, H.fillGeometry) && (n.fillGeometry = be(e.fillGeometry), r.add("fillGeometry")), e.strokeGeometry !== void 0 && T(e.strokeGeometry, H.strokeGeometry) && (n.strokeGeometry = be(e.strokeGeometry), r.add("strokeGeometry")), e.strokeCap !== void 0 && T(e.strokeCap, H.strokeCap) && (n.strokeCap = e.strokeCap, r.add("strokeCap")), e.strokeJoin !== void 0 && T(e.strokeJoin, H.strokeJoin) && (n.strokeJoin = e.strokeJoin, r.add("strokeJoin")), e.dashPattern !== void 0 && T(e.dashPattern, H.dashPattern) && (n.dashPattern = e.dashPattern, r.add("dashPattern")), n;
}
async function At(e, t) {
  const n = {}, r = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && T(e.cornerRadius, Me.cornerRadius) && (n.cornerRadius = e.cornerRadius, r.add("cornerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, r.add("pointCount")), e.innerRadius !== void 0 && (n.innerRadius = e.innerRadius, r.add("innerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, r.add("pointCount")), n;
}
const ae = /* @__PURE__ */ new Map();
let $t = 0;
function Ct() {
  return `prompt_${Date.now()}_${++$t}`;
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
    const n = typeof t == "number" ? { timeoutMs: t } : t, r = (m = n == null ? void 0 : n.timeoutMs) != null ? m : 3e5, i = n == null ? void 0 : n.okLabel, c = n == null ? void 0 : n.cancelLabel, o = Ct();
    return new Promise((g, y) => {
      const s = r === -1 ? null : setTimeout(() => {
        ae.delete(o), y(new Error(`Plugin prompt timeout: ${e}`));
      }, r);
      ae.set(o, {
        resolve: g,
        reject: y,
        timeout: s
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: S(S({
          message: e,
          requestId: o
        }, i && { okLabel: i }), c && { cancelLabel: c })
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
    const i = await e.getMainComponentAsync();
    if (!i) {
      const f = e.name || "(unnamed)", u = e.id;
      if (t.detachedComponentsHandled.has(u))
        await a.log(
          `Treating detached instance "${f}" as internal instance (already prompted)`
        );
      else {
        await a.warning(
          `Found detached instance: "${f}" (main component is missing)`
        );
        const L = `Found detached instance "${f}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await q.prompt(L, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(u), await a.log(
            `Treating detached instance "${f}" as internal instance`
          );
        } catch (G) {
          if (G instanceof Error && G.message === "User cancelled") {
            const O = `Export cancelled: Detached instance "${f}" found. Please fix the instance before exporting.`;
            await a.error(O);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch (M) {
              console.warn("Could not scroll to instance:", M);
            }
            throw new Error(O);
          } else
            throw G;
        }
      }
      if (!ye(e).page) {
        const L = `Detached instance "${f}" is not on any page. Cannot export.`;
        throw await a.error(L), new Error(L);
      }
      let C, E;
      try {
        e.variantProperties && (C = e.variantProperties), e.componentProperties && (E = e.componentProperties);
      } catch (L) {
      }
      const x = S(S({
        instanceType: "internal",
        componentName: f,
        componentNodeId: e.id
      }, C && { variantProperties: C }), E && { componentProperties: E }), R = t.instanceTable.addInstance(x);
      return n._instanceRef = R, r.add("_instanceRef"), await a.log(
        `  Exported detached INSTANCE: "${f}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), n;
    }
    const c = e.name || "(unnamed)", o = i.name || "(unnamed)", m = i.remote === !0, y = ye(e).page, s = ye(i), $ = s.page;
    let l, p = $;
    if (m)
      if ($) {
        const f = Se($);
        f != null && f.id ? (l = "normal", p = $, await a.log(
          `  Component "${o}" is from library but also exists on local page "${$.name}" with metadata. Treating as "normal" instance.`
        )) : (l = "remote", await a.log(
          `  Component "${o}" is from library and exists on local page "${$.name}" but has no metadata. Treating as "remote" instance.`
        ));
      } else
        l = "remote", await a.log(
          `  Component "${o}" is from library and not on a local page. Treating as "remote" instance.`
        );
    else if ($ && y && $.id === y.id)
      l = "internal";
    else if ($ && y && $.id !== y.id)
      l = "normal";
    else if ($ && !y)
      l = "normal";
    else if (!m && s.reason === "detached") {
      const f = i.id;
      if (t.detachedComponentsHandled.has(f))
        l = "remote", await a.log(
          `Treating detached instance "${c}" -> component "${o}" as remote instance (already prompted)`
        );
      else {
        await a.warning(
          `Found detached instance: "${c}" -> component "${o}" (component is not on any page)`
        );
        try {
          await figma.viewport.scrollAndZoomIntoView([i]);
        } catch (A) {
          console.warn("Could not scroll to component:", A);
        }
        const u = `Found detached instance "${c}" attached to component "${o}". This should be fixed. Continue to publish?`;
        try {
          await q.prompt(u, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(f), l = "remote", await a.log(
            `Treating detached instance "${c}" as remote instance (will be created on REMOTES page)`
          );
        } catch (A) {
          if (A instanceof Error && A.message === "User cancelled") {
            const v = `Export cancelled: Detached instance "${c}" found. The component "${o}" is not on any page. Please fix the instance before exporting.`;
            throw await a.error(v), new Error(v);
          } else
            throw A;
        }
      }
    } else
      m || await a.warning(
        `  Instance "${c}" -> component "${o}": componentPage is null but component is not remote. Reason: ${s.reason}. Cannot determine instance type.`
      ), l = "normal";
    let d, N;
    try {
      e.variantProperties && (d = e.variantProperties), e.componentProperties && (N = e.componentProperties);
    } catch (f) {
    }
    let b, P;
    try {
      let f = i.parent;
      const u = [];
      let A = 0;
      const v = 20;
      for (; f && A < v; )
        try {
          const C = f.type, E = f.name;
          if (C === "COMPONENT_SET" && !P && (P = E), C === "PAGE")
            break;
          const x = E || "";
          u.unshift(x), f = f.parent, A++;
        } catch (C) {
          break;
        }
      b = u;
    } catch (f) {
    }
    const h = S(S(S(S({
      instanceType: l,
      componentName: o
    }, P && { componentSetName: P }), d && { variantProperties: d }), N && { componentProperties: N }), l === "normal" ? { path: b || [] } : b && b.length > 0 && {
      path: b
    });
    if (l === "internal")
      h.componentNodeId = i.id, await a.log(
        `  Found INSTANCE: "${c}" -> INTERNAL component "${o}" (ID: ${i.id.substring(0, 8)}...)`
      );
    else if (l === "normal") {
      const f = p || $;
      if (f) {
        h.componentPageName = f.name;
        const A = Se(f);
        A != null && A.id && A.version !== void 0 ? (h.componentGuid = A.id, h.componentVersion = A.version, await a.log(
          `  Found INSTANCE: "${c}" -> NORMAL component "${o}" (ID: ${i.id.substring(0, 8)}...) at path [${(b || []).join(" → ")}]`
        )) : await a.warning(
          `  Instance "${c}" -> component "${o}" is classified as normal but page "${f.name}" has no metadata. This instance will not be importable.`
        );
      } else {
        const A = i.id;
        let v = "", C = "";
        switch (s.reason) {
          case "broken_chain":
            v = "The component's parent chain is broken and cannot be traversed to find the page", C = "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            v = "Cannot access the component's parent chain (access error)", C = "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            v = "Cannot determine which page the component is on", C = "Please ensure the component is properly placed on a page.";
        }
        try {
          await figma.viewport.scrollAndZoomIntoView([i]);
        } catch (R) {
          console.warn("Could not scroll to component:", R);
        }
        const E = `Normal instance "${c}" -> component "${o}" (ID: ${A}) has no componentPage. ${v}. ${C} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", E), await a.error(E);
        const x = new Error(E);
        throw console.error("Throwing error:", x), x;
      }
      b === void 0 && console.warn(
        `Failed to build path for normal instance "${c}" -> component "${o}". Path is required for resolution.`
      );
      const u = b && b.length > 0 ? ` at path [${b.join(" → ")}]` : " at page root";
      await a.log(
        `  Found INSTANCE: "${c}" -> NORMAL component "${o}" (ID: ${i.id.substring(0, 8)}...)${u}`
      );
    } else if (l === "remote") {
      let f, u;
      const A = t.detachedComponentsHandled.has(
        i.id
      );
      if (!A)
        try {
          if (typeof i.getPublishStatusAsync == "function")
            try {
              const v = await i.getPublishStatusAsync();
              v && typeof v == "object" && (v.libraryName && (f = v.libraryName), v.libraryKey && (u = v.libraryKey));
            } catch (v) {
            }
          try {
            const v = figma.teamLibrary;
            if (typeof (v == null ? void 0 : v.getAvailableLibraryComponentSetsAsync) == "function") {
              const C = await v.getAvailableLibraryComponentSetsAsync();
              if (C && Array.isArray(C)) {
                for (const E of C)
                  if (E.key === i.key || E.name === i.name) {
                    E.libraryName && (f = E.libraryName), E.libraryKey && (u = E.libraryKey);
                    break;
                  }
              }
            }
          } catch (v) {
          }
        } catch (v) {
          console.warn(
            `Error getting library info for remote component "${o}":`,
            v
          );
        }
      try {
        const { parseBaseNodeProperties: v } = await Promise.resolve().then(() => ht), C = await v(e, t), { parseFrameProperties: E } = await Promise.resolve().then(() => yt), x = await E(e, t), R = V(S(S({}, C), x), {
          type: "COMPONENT"
          // Convert to COMPONENT type for recreation (must be after baseProps to override)
        });
        if (e.children && Array.isArray(e.children) && e.children.length > 0) {
          const L = V(S({}, t), {
            depth: (t.depth || 0) + 1
          }), { extractNodeData: G } = await Promise.resolve().then(() => Ot), O = [];
          for (const M of e.children)
            try {
              let I;
              if (M.type === "INSTANCE")
                try {
                  const k = await M.getMainComponentAsync();
                  if (k) {
                    const D = await v(
                      M,
                      t
                    ), ee = await E(
                      M,
                      t
                    ), fe = await G(
                      k,
                      /* @__PURE__ */ new WeakSet(),
                      L
                    );
                    I = V(S(S(S({}, fe), D), ee), {
                      type: "COMPONENT"
                      // Convert to COMPONENT
                    });
                  } else
                    I = await G(
                      M,
                      /* @__PURE__ */ new WeakSet(),
                      L
                    ), I.type === "INSTANCE" && (I.type = "COMPONENT"), delete I._instanceRef;
                } catch (k) {
                  I = await G(
                    M,
                    /* @__PURE__ */ new WeakSet(),
                    L
                  ), I.type === "INSTANCE" && (I.type = "COMPONENT"), delete I._instanceRef;
                }
              else
                I = await G(
                  M,
                  /* @__PURE__ */ new WeakSet(),
                  L
                );
              O.push(I);
            } catch (I) {
              console.warn(
                `Failed to extract child "${M.name || "Unnamed"}" for remote component "${o}":`,
                I
              );
            }
          R.children = O;
        }
        if (!R)
          throw new Error("Failed to build structure for remote instance");
        h.structure = R, A ? await a.log(
          `  Extracted structure for detached component "${o}" (ID: ${i.id.substring(0, 8)}...)`
        ) : await a.log(
          `  Extracted structure from instance for remote component "${o}" (preserving size overrides: ${e.width}x${e.height})`
        );
      } catch (v) {
        const C = `Failed to extract structure for remote component "${o}": ${v instanceof Error ? v.message : String(v)}`;
        console.error(C, v), await a.error(C);
      }
      f && (h.remoteLibraryName = f), u && (h.remoteLibraryKey = u), A && (h.componentNodeId = i.id), await a.log(
        `  Found INSTANCE: "${c}" -> REMOTE component "${o}" (ID: ${i.id.substring(0, 8)}...)${A ? " [DETACHED]" : ""}`
      );
    }
    const w = t.instanceTable.addInstance(h);
    n._instanceRef = w, r.add("_instanceRef");
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
      (i, c) => parseInt(i[0], 10) - parseInt(c[0], 10)
    );
    for (const [i, c] of r) {
      const o = parseInt(i, 10), m = n.generateKey(c);
      n.instanceMap.set(m, o), n.instances[o] = c, n.nextIndex = Math.max(n.nextIndex, o + 1);
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
function Ie(e) {
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
}, Ne = {};
for (const [e, t] of Object.entries(Ge))
  Ne[t] = e;
class de {
  constructor() {
    F(this, "shortToLong");
    F(this, "longToShort");
    this.shortToLong = S({}, Ne), this.longToShort = S({}, Ge);
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
      for (const i of Object.keys(t))
        r.add(i);
      for (const [i, c] of Object.entries(t)) {
        const o = this.getShortName(i);
        if (o !== i && !r.has(o)) {
          let m = this.compressObject(c);
          o === "type" && typeof m == "string" && (m = Ie(m)), n[o] = m;
        } else {
          let m = this.compressObject(c);
          i === "type" && typeof m == "string" && (m = Ie(m)), n[i] = m;
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
      for (const [r, i] of Object.entries(t)) {
        const c = this.getLongName(r);
        let o = this.expandObject(i);
        (c === "type" || r === "type") && (typeof o == "number" || typeof o == "string") && (o = St(o)), n[c] = o;
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
    return S({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(t) {
    const n = new de();
    n.shortToLong = S(S({}, Ne), t), n.longToShort = {};
    for (const [r, i] of Object.entries(
      n.shortToLong
    ))
      n.longToShort[i] = r;
    return n;
  }
}
function It(e, t) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const n = {};
  e.metadata && (n.metadata = e.metadata);
  for (const [r, i] of Object.entries(e))
    r !== "metadata" && (n[r] = t.compressObject(i));
  return n;
}
function xt(e, t) {
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
  var p, d, N, b, P, h;
  if (!e || typeof e != "object")
    return e;
  const r = (p = n.maxNodes) != null ? p : 1e4, i = (d = n.nodeCount) != null ? d : 0;
  if (i >= r)
    return await a.warning(
      `Maximum node count (${r}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${r}) reached`,
      _nodeCount: i
    };
  const c = {
    visited: (N = n.visited) != null ? N : /* @__PURE__ */ new WeakSet(),
    depth: (b = n.depth) != null ? b : 0,
    maxDepth: (P = n.maxDepth) != null ? P : 100,
    nodeCount: i + 1,
    maxNodes: r,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: n.variableTable,
    collectionTable: n.collectionTable,
    instanceTable: n.instanceTable,
    detachedComponentsHandled: (h = n.detachedComponentsHandled) != null ? h : /* @__PURE__ */ new Set()
  };
  if (t.has(e))
    return "[Circular Reference]";
  t.add(e), c.visited = t;
  const o = {}, m = await _e(e, c);
  Object.assign(o, m);
  const g = e.type;
  if (g)
    switch (g) {
      case "FRAME":
      case "COMPONENT": {
        const w = await we(e);
        Object.assign(o, w);
        break;
      }
      case "INSTANCE": {
        const w = await Et(
          e,
          c
        );
        Object.assign(o, w);
        const f = await we(
          e
        );
        Object.assign(o, f);
        break;
      }
      case "TEXT": {
        const w = await wt(e);
        Object.assign(o, w);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const w = await vt(e);
        Object.assign(o, w);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const w = await At(e);
        Object.assign(o, w);
        break;
      }
      default:
        c.unhandledKeys.add("_unknownType");
        break;
    }
  const y = Object.getOwnPropertyNames(e), s = /* @__PURE__ */ new Set([
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
  (g === "FRAME" || g === "COMPONENT" || g === "INSTANCE") && (s.add("layoutMode"), s.add("primaryAxisSizingMode"), s.add("counterAxisSizingMode"), s.add("primaryAxisAlignItems"), s.add("counterAxisAlignItems"), s.add("paddingLeft"), s.add("paddingRight"), s.add("paddingTop"), s.add("paddingBottom"), s.add("itemSpacing"), s.add("cornerRadius"), s.add("clipsContent"), s.add("layoutWrap"), s.add("layoutGrow")), g === "TEXT" && (s.add("characters"), s.add("fontName"), s.add("fontSize"), s.add("textAlignHorizontal"), s.add("textAlignVertical"), s.add("letterSpacing"), s.add("lineHeight"), s.add("textCase"), s.add("textDecoration"), s.add("textAutoResize"), s.add("paragraphSpacing"), s.add("paragraphIndent"), s.add("listOptions")), (g === "VECTOR" || g === "LINE") && (s.add("fillGeometry"), s.add("strokeGeometry")), (g === "RECTANGLE" || g === "ELLIPSE" || g === "STAR" || g === "POLYGON") && (s.add("pointCount"), s.add("innerRadius"), s.add("arcData")), g === "INSTANCE" && (s.add("mainComponent"), s.add("componentProperties"));
  for (const w of y)
    typeof e[w] != "function" && (s.has(w) || c.unhandledKeys.add(w));
  c.unhandledKeys.size > 0 && (o._unhandledKeys = Array.from(c.unhandledKeys).sort());
  const $ = o._instanceRef !== void 0 && c.instanceTable && g === "INSTANCE";
  let l = !1;
  if ($) {
    const w = c.instanceTable.getInstanceByIndex(
      o._instanceRef
    );
    w && w.instanceType === "normal" && (l = !0, await a.log(
      `  Skipping children extraction for normal instance "${o.name || "Unnamed"}" - will be resolved from referenced component`
    ));
  }
  if (!l && e.children && Array.isArray(e.children)) {
    const w = c.maxDepth;
    if (c.depth >= w)
      o.children = {
        _truncated: !0,
        _reason: `Maximum depth (${w}) reached`,
        _count: e.children.length
      };
    else if (c.nodeCount >= r)
      o.children = {
        _truncated: !0,
        _reason: `Maximum node count (${r}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const f = V(S({}, c), {
        depth: c.depth + 1
      }), u = [];
      let A = !1;
      for (const v of e.children) {
        if (f.nodeCount >= r) {
          o.children = {
            _truncated: !0,
            _reason: `Maximum node count (${r}) reached during children processing`,
            _processed: u.length,
            _total: e.children.length,
            children: u
          }, A = !0;
          break;
        }
        const C = await me(v, t, f);
        u.push(C), f.nodeCount && (c.nodeCount = f.nodeCount);
      }
      A || (o.children = u);
    }
  }
  return o;
}
async function Ce(e, t = /* @__PURE__ */ new Set(), n = !1) {
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
    const i = figma.root.children;
    if (await a.log(`Loaded ${i.length} page(s)`), r < 0 || r >= i.length)
      return await a.error(
        `Invalid page index: ${r} (valid range: 0-${i.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const c = i[r], o = c.id;
    if (t.has(o))
      return await a.log(
        `Page "${c.name}" has already been processed, skipping...`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Page already processed",
        data: {}
      };
    t.add(o), await a.log(
      `Selected page: "${c.name}" (index: ${r})`
    ), await a.log(
      "Initializing variable, collection, and instance tables..."
    );
    const m = new le(), g = new ce(), y = new Q();
    await a.log("Fetching team library variable collections...");
    let s = [];
    try {
      if (s = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((M) => ({
        libraryName: M.libraryName,
        key: M.key,
        name: M.name
      })), await a.log(
        `Found ${s.length} library collection(s) in team library`
      ), s.length > 0)
        for (const M of s)
          await a.log(`  - ${M.name} (from ${M.libraryName})`);
    } catch (O) {
      await a.warning(
        `Could not get library variable collections: ${O instanceof Error ? O.message : String(O)}`
      );
    }
    await a.log("Extracting node data from page..."), await a.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await a.log(
      "Collections will be discovered as variables are processed:"
    );
    const $ = await me(
      c,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: m,
        collectionTable: g,
        instanceTable: y
      }
    );
    await a.log("Node extraction finished");
    const l = pe($), p = m.getSize(), d = g.getSize(), N = y.getSize();
    if (await a.log("Extraction complete:"), await a.log(`  - Total nodes: ${l}`), await a.log(`  - Unique variables: ${p}`), await a.log(`  - Unique collections: ${d}`), await a.log(`  - Unique instances: ${N}`), d > 0) {
      await a.log("Collections found:");
      const O = g.getTable();
      for (const [M, I] of Object.values(O).entries()) {
        const k = I.collectionGuid ? ` (GUID: ${I.collectionGuid.substring(0, 8)}...)` : "";
        await a.log(
          `  ${M}: ${I.collectionName}${k} - ${I.modes.length} mode(s)`
        );
      }
    }
    await a.log("Checking for referenced component pages...");
    const b = [], P = y.getSerializedTable(), h = Object.values(P).filter(
      (O) => O.instanceType === "normal"
    );
    if (h.length > 0) {
      await a.log(
        `Found ${h.length} normal instance(s) to check`
      );
      const O = /* @__PURE__ */ new Map();
      for (const M of h)
        if (M.componentPageName) {
          const I = i.find((k) => k.name === M.componentPageName);
          if (I && !t.has(I.id))
            O.has(I.id) || O.set(I.id, I);
          else if (!I) {
            const k = `Normal instance references component "${M.componentName || "(unnamed)"}" on page "${M.componentPageName}", but that page was not found. Cannot export.`;
            throw await a.error(k), new Error(k);
          }
        } else {
          const I = `Normal instance references component "${M.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw await a.error(I), new Error(I);
        }
      await a.log(
        `Found ${O.size} unique referenced page(s)`
      );
      for (const [M, I] of O.entries()) {
        const k = I.name;
        if (t.has(M)) {
          await a.log(`Skipping "${k}" - already processed`);
          continue;
        }
        const D = I.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let ee = !1;
        if (D)
          try {
            const J = JSON.parse(D);
            ee = !!(J.id && J.version !== void 0);
          } catch (J) {
          }
        const fe = `Do you want to also publish referenced component "${k}"?`;
        try {
          await q.prompt(fe, {
            okLabel: "Yes",
            cancelLabel: "No",
            timeoutMs: 3e5
            // 5 minutes
          }), await a.log(`Exporting referenced page: "${k}"`);
          const J = i.findIndex(
            (ge) => ge.id === I.id
          );
          if (J === -1)
            throw await a.error(
              `Could not find page index for "${k}"`
            ), new Error(`Could not find page index for "${k}"`);
          const te = await Ce(
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
            b.push(ge), await a.log(
              `Successfully exported referenced page: "${k}"`
            );
          } else
            throw new Error(
              `Failed to export referenced page "${k}": ${te.message}`
            );
        } catch (J) {
          if (J instanceof Error && J.message === "User cancelled")
            if (ee)
              await a.log(
                `User declined to publish "${k}", but page has existing metadata. Continuing with existing metadata.`
              );
            else
              throw await a.error(
                `Export cancelled: Referenced page "${k}" has no metadata and user declined to publish it.`
              ), new Error(
                `Cannot continue export: Referenced component "${k}" has no metadata. Please publish it first or choose to publish it now.`
              );
          else
            throw J;
        }
      }
    }
    await a.log("Creating string table...");
    const w = new de();
    await a.log("Getting page metadata...");
    const f = c.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let u = "", A = 0;
    if (f)
      try {
        const O = JSON.parse(f);
        u = O.id || "", A = O.version || 0;
      } catch (O) {
        await a.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!u) {
      await a.log("Generating new GUID for page..."), u = await $e();
      const O = {
        _ver: 1,
        id: u,
        name: c.name,
        version: A,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      c.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(O)
      );
    }
    await a.log("Creating export data structure...");
    const v = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "2.7.0",
        // Updated version for string table compression
        figmaApiVersion: figma.apiVersion,
        guid: u,
        version: A,
        name: c.name,
        pluginVersion: "1.0.0"
      },
      stringTable: w.getSerializedTable(),
      collections: g.getSerializedTable(),
      variables: m.getSerializedTable(),
      instances: y.getSerializedTable(),
      libraries: s,
      // Libraries might not need compression, but could be added later
      pageData: $
    };
    await a.log("Compressing JSON data...");
    const C = It(v, w);
    await a.log("Serializing to JSON...");
    const E = JSON.stringify(C, null, 2), x = (E.length / 1024).toFixed(2), L = se(c.name).trim().replace(/\s+/g, "_") + ".rec.json";
    return await a.log(`JSON serialization complete: ${x} KB`), await a.log(`Export file: ${L}`), await a.log("=== Export Complete ==="), {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: L,
        jsonData: E,
        pageName: c.name,
        additionalPages: b
        // Populated with referenced component pages
      }
    };
  } catch (r) {
    const i = r instanceof Error ? r.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", r), console.error("Error message:", i), await a.error(`Export failed: ${i}`), r instanceof Error && r.stack && (console.error("Stack trace:", r.stack), await a.error(`Stack trace: ${r.stack}`));
    const c = {
      type: "exportPage",
      success: !1,
      error: !0,
      message: i,
      data: {}
    };
    return console.error("Returning error response:", c), c;
  }
}
const Ot = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  countTotalNodes: pe,
  exportPage: Ce,
  extractNodeData: me
}, Symbol.toStringTag, { value: "Module" }));
async function Z(e, t) {
  for (const n of t)
    e.modes.find((i) => i.name === n) || e.addMode(n);
}
const j = "recursica:collectionId";
async function ie(e) {
  if (e.remote === !0) {
    const n = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(n)) {
      const i = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await a.error(i), new Error(i);
    }
    return e.id;
  } else {
    const n = e.getSharedPluginData(
      "recursica",
      j
    );
    if (n && n.trim() !== "")
      return n;
    const r = await $e();
    return e.setSharedPluginData("recursica", j, r), r;
  }
}
function Mt(e, t) {
  const n = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(n))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Rt(e) {
  let t;
  const n = e.collectionName.trim().toLowerCase(), r = ["token", "tokens", "theme", "themes"], i = e.isLocal;
  if (i === !1 || i === void 0 && r.includes(n))
    try {
      const m = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((g) => g.name.trim().toLowerCase() === n);
      if (m) {
        Mt(e.collectionName, !1);
        const g = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          m.key
        );
        if (g.length > 0) {
          const y = await figma.variables.importVariableByKeyAsync(g[0].key), s = await figma.variables.getVariableCollectionByIdAsync(
            y.variableCollectionId
          );
          if (s) {
            if (t = s, e.collectionGuid) {
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
              await ie(t);
            return await Z(t, e.modes), { collection: t };
          }
        }
      }
    } catch (o) {
      if (i === !1)
        throw new Error(
          `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
        );
      console.log("Could not import external collection, trying local:", o);
    }
  if (i !== !1) {
    const o = await figma.variables.getLocalVariableCollectionsAsync();
    let m;
    if (e.collectionGuid && (m = o.find((g) => g.getSharedPluginData("recursica", j) === e.collectionGuid)), m || (m = o.find(
      (g) => g.name === e.collectionName
    )), m)
      if (t = m, e.collectionGuid) {
        const g = t.getSharedPluginData(
          "recursica",
          j
        );
        (!g || g.trim() === "") && t.setSharedPluginData(
          "recursica",
          j,
          e.collectionGuid
        );
      } else
        await ie(t);
    else
      t = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? t.setSharedPluginData(
        "recursica",
        j,
        e.collectionGuid
      ) : await ie(t);
  } else {
    const o = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), m = e.collectionName.trim().toLowerCase(), g = o.find((l) => l.name.trim().toLowerCase() === m);
    if (!g)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const y = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      g.key
    );
    if (y.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const s = await figma.variables.importVariableByKeyAsync(
      y[0].key
    ), $ = await figma.variables.getVariableCollectionByIdAsync(
      s.variableCollectionId
    );
    if (!$)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (t = $, e.collectionGuid) {
      const l = t.getSharedPluginData(
        "recursica",
        j
      );
      (!l || l.trim() === "") && t.setSharedPluginData(
        "recursica",
        j,
        e.collectionGuid
      );
    } else
      ie(t);
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
async function kt(e, t, n, r, i) {
  for (const [c, o] of Object.entries(t)) {
    const m = r.modes.find((y) => y.name === c);
    if (!m) {
      console.warn(
        `Mode "${c}" not found in collection "${r.name}" for variable "${e.name}". Skipping.`
      );
      continue;
    }
    const g = m.modeId;
    try {
      if (o == null)
        continue;
      if (typeof o == "string" || typeof o == "number" || typeof o == "boolean") {
        e.setValueForMode(g, o);
        continue;
      }
      if (typeof o == "object" && o !== null && "_varRef" in o && typeof o._varRef == "number") {
        const y = o;
        let s = null;
        const $ = n.getVariableByIndex(
          y._varRef
        );
        if ($) {
          let l = null;
          if (i && $._colRef !== void 0) {
            const p = i.getCollectionByIndex(
              $._colRef
            );
            p && (l = (await Rt(p)).collection);
          }
          l && (s = await Fe(
            l,
            $.variableName
          ));
        }
        if (s) {
          const l = {
            type: "VARIABLE_ALIAS",
            id: s.id
          };
          e.setValueForMode(g, l);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${c}" in variable "${e.name}". Variable reference index: ${y._varRef}`
          );
      }
    } catch (y) {
      console.warn(
        `Error setting value for mode "${c}" in variable "${e.name}":`,
        y
      );
    }
  }
}
async function xe(e, t, n, r) {
  const i = figma.variables.createVariable(
    e.variableName,
    t,
    e.variableType
  );
  return e.valuesByMode && await kt(
    i,
    e.valuesByMode,
    n,
    t,
    // Pass collection to look up modes by name
    r
  ), i;
}
async function Ue(e, t, n, r) {
  if (!(!t || typeof t != "object"))
    try {
      const i = e[n];
      if (!i || !Array.isArray(i))
        return;
      const c = t[n];
      if (Array.isArray(c))
        for (let o = 0; o < c.length && o < i.length; o++) {
          const m = c[o];
          if (m && typeof m == "object") {
            i[o].boundVariables || (i[o].boundVariables = {});
            for (const [g, y] of Object.entries(
              m
            ))
              if (Re(y)) {
                const s = y._varRef;
                if (s !== void 0) {
                  const $ = r.get(String(s));
                  $ && (i[o].boundVariables[g] = {
                    type: "VARIABLE_ALIAS",
                    id: $.id
                  });
                }
              }
          }
        }
    } catch (i) {
      console.log(`Error restoring bound variables for ${n}:`, i);
    }
}
function Lt(e, t) {
  const n = at(t);
  if (e.visible === void 0 && (e.visible = n.visible), e.locked === void 0 && (e.locked = n.locked), e.opacity === void 0 && (e.opacity = n.opacity), e.rotation === void 0 && (e.rotation = n.rotation), e.blendMode === void 0 && (e.blendMode = n.blendMode), t === "FRAME" || t === "COMPONENT" || t === "INSTANCE") {
    const r = _;
    e.layoutMode === void 0 && (e.layoutMode = r.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = r.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = r.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = r.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = r.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = r.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = r.paddingRight), e.paddingTop === void 0 && (e.paddingTop = r.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = r.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = r.itemSpacing);
  }
  if (t === "TEXT") {
    const r = U;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = r.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = r.textAlignVertical), e.textCase === void 0 && (e.textCase = r.textCase), e.textDecoration === void 0 && (e.textDecoration = r.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = r.textAutoResize);
  }
}
async function Y(e, t, n = null, r = null, i = null, c = null, o = null, m = !1, g = null, y = null) {
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
      if (e.id && o && o.has(e.id))
        s = o.get(e.id), await a.log(
          `Reusing existing COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id.substring(0, 8)}...)`
        );
      else if (s = figma.createComponent(), await a.log(
        `Created COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id ? e.id.substring(0, 8) + "..." : "no ID"})`
      ), e.componentPropertyDefinitions) {
        const l = e.componentPropertyDefinitions;
        let p = 0, d = 0;
        for (const [N, b] of Object.entries(l))
          try {
            const P = b.type;
            let h = null;
            if (typeof P == "string" ? (P === "TEXT" || P === "BOOLEAN" || P === "INSTANCE_SWAP" || P === "VARIANT") && (h = P) : typeof P == "number" && (h = {
              2: "TEXT",
              // Text property
              25: "BOOLEAN",
              // Boolean property
              27: "INSTANCE_SWAP",
              // Instance swap property
              26: "VARIANT"
              // Variant property
            }[P] || null), !h) {
              await a.warning(
                `  Unknown property type ${P} (${typeof P}) for property "${N}" in component "${e.name || "Unnamed"}"`
              ), d++;
              continue;
            }
            const w = b.defaultValue, f = N.split("#")[0];
            s.addComponentProperty(
              f,
              h,
              w
            ), p++;
          } catch (P) {
            await a.warning(
              `  Failed to add component property "${N}" to "${e.name || "Unnamed"}": ${P}`
            ), d++;
          }
        p > 0 && await a.log(
          `  Added ${p} component property definition(s) to "${e.name || "Unnamed"}"${d > 0 ? ` (${d} failed)` : ""}`
        );
      }
      break;
    case "COMPONENT_SET": {
      const l = e.children ? e.children.filter((N) => N.type === "COMPONENT").length : 0;
      await a.log(
        `Creating COMPONENT_SET "${e.name || "Unnamed"}" by combining ${l} component variant(s)`
      );
      const p = [];
      let d = null;
      if (e.children && Array.isArray(e.children)) {
        d = figma.createFrame(), d.name = `_temp_${e.name || "COMPONENT_SET"}`, d.visible = !1, ((t == null ? void 0 : t.type) === "PAGE" ? t : figma.currentPage).appendChild(d);
        for (const b of e.children)
          if (b.type === "COMPONENT" && !b._truncated)
            try {
              const P = await Y(
                b,
                d,
                // Use temp parent for now
                n,
                r,
                i,
                c,
                o,
                m,
                g,
                null
                // deferredInstances - not needed for component set creation
              );
              P && P.type === "COMPONENT" && (p.push(P), await a.log(
                `  Created component variant: "${P.name || "Unnamed"}"`
              ));
            } catch (P) {
              await a.warning(
                `  Failed to create component variant "${b.name || "Unnamed"}": ${P}`
              );
            }
      }
      if (p.length > 0)
        try {
          const N = t || figma.currentPage, b = figma.combineAsVariants(
            p,
            N
          );
          e.name && (b.name = e.name), e.x !== void 0 && (b.x = e.x), e.y !== void 0 && (b.y = e.y), d && d.parent && d.remove(), await a.log(
            `  ✓ Successfully created COMPONENT_SET "${b.name}" with ${p.length} variant(s)`
          ), s = b;
        } catch (N) {
          if (await a.warning(
            `  Failed to combine components into COMPONENT_SET "${e.name || "Unnamed"}": ${N}. Falling back to frame.`
          ), s = figma.createFrame(), e.name && (s.name = e.name), d && d.children.length > 0) {
            for (const b of d.children)
              s.appendChild(b);
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
      else if (e._instanceRef !== void 0 && i && o) {
        const l = i.getInstanceByIndex(
          e._instanceRef
        );
        if (l && l.instanceType === "internal")
          if (l.componentNodeId)
            if (l.componentNodeId === e.id)
              await a.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), s = figma.createFrame(), e.name && (s.name = e.name);
            else {
              const p = o.get(
                l.componentNodeId
              );
              if (!p) {
                const d = Array.from(o.keys()).slice(
                  0,
                  20
                );
                await a.error(
                  `Component not found for internal instance "${e.name}" (ID: ${l.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), await a.error(
                  `Looking for component ID: ${l.componentNodeId}`
                ), await a.error(
                  `Available IDs in mapping (first 20): ${d.map((w) => w.substring(0, 8) + "...").join(", ")}`
                );
                const N = (w, f) => {
                  if (w.type === "COMPONENT" && w.id === f)
                    return !0;
                  if (w.children && Array.isArray(w.children)) {
                    for (const u of w.children)
                      if (!u._truncated && N(u, f))
                        return !0;
                  }
                  return !1;
                }, b = N(
                  e,
                  l.componentNodeId
                );
                await a.error(
                  `Component ID ${l.componentNodeId.substring(0, 8)}... exists in current node tree: ${b}`
                ), await a.error(
                  `WARNING: Component ID ${l.componentNodeId.substring(0, 8)}... not found in nodeIdMapping. This might indicate:`
                ), await a.error(
                  "  1. The component doesn't exist in the pageData (detached component?)"
                ), await a.error(
                  "  2. The component wasn't collected in the first pass"
                ), await a.error(
                  "  3. The component ID in the instance table doesn't match the actual component ID"
                );
                const P = d.filter(
                  (w) => w.startsWith(l.componentNodeId.substring(0, 8))
                );
                P.length > 0 && await a.error(
                  `Found IDs with matching prefix: ${P.map((w) => w.substring(0, 8) + "...").join(", ")}`
                );
                const h = `Component not found for internal instance "${e.name}" (ID: ${l.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${d.map((w) => w.substring(0, 8) + "...").join(", ")}`;
                throw new Error(h);
              }
              if (p && p.type === "COMPONENT") {
                if (s = p.createInstance(), await a.log(
                  `✓ Created internal instance "${e.name}" from component "${l.componentName}"`
                ), l.variantProperties && Object.keys(l.variantProperties).length > 0)
                  try {
                    const d = await s.getMainComponentAsync();
                    if (d) {
                      const N = d.componentPropertyDefinitions, b = {};
                      for (const [P, h] of Object.entries(
                        l.variantProperties
                      )) {
                        const w = P.split("#")[0];
                        N[w] && (b[w] = h);
                      }
                      Object.keys(b).length > 0 && s.setProperties(b);
                    } else
                      await a.warning(
                        `Cannot set variant properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (d) {
                    const N = `Failed to set variant properties for instance "${e.name}": ${d}`;
                    throw await a.error(N), new Error(N);
                  }
                if (l.componentProperties && Object.keys(l.componentProperties).length > 0)
                  try {
                    const d = await s.getMainComponentAsync();
                    if (d) {
                      const N = d.componentPropertyDefinitions;
                      for (const [b, P] of Object.entries(
                        l.componentProperties
                      )) {
                        const h = b.split("#")[0];
                        if (N[h])
                          try {
                            s.setProperties({
                              [h]: P
                            });
                          } catch (w) {
                            const f = `Failed to set component property "${h}" for internal instance "${e.name}": ${w}`;
                            throw await a.error(f), new Error(f);
                          }
                      }
                    } else
                      await a.warning(
                        `Cannot set component properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (d) {
                    if (d instanceof Error)
                      throw d;
                    const N = `Failed to set component properties for instance "${e.name}": ${d}`;
                    throw await a.error(N), new Error(N);
                  }
              } else if (!s && p) {
                const d = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${l.componentNodeId.substring(0, 8)}...).`;
                throw await a.error(d), new Error(d);
              }
            }
          else {
            const p = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw await a.error(p), new Error(p);
          }
        else if (l && l.instanceType === "remote")
          if (g) {
            const p = g.get(
              e._instanceRef
            );
            if (p) {
              if (s = p.createInstance(), await a.log(
                `✓ Created remote instance "${e.name}" from component "${l.componentName}" on REMOTES page`
              ), l.variantProperties && Object.keys(l.variantProperties).length > 0)
                try {
                  const d = await s.getMainComponentAsync();
                  if (d) {
                    const N = d.componentPropertyDefinitions, b = {};
                    for (const [P, h] of Object.entries(
                      l.variantProperties
                    )) {
                      const w = P.split("#")[0];
                      N[w] && (b[w] = h);
                    }
                    Object.keys(b).length > 0 && s.setProperties(b);
                  } else
                    await a.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (d) {
                  const N = `Failed to set variant properties for remote instance "${e.name}": ${d}`;
                  throw await a.error(N), new Error(N);
                }
              if (l.componentProperties && Object.keys(l.componentProperties).length > 0)
                try {
                  const d = await s.getMainComponentAsync();
                  if (d) {
                    const N = d.componentPropertyDefinitions;
                    for (const [b, P] of Object.entries(
                      l.componentProperties
                    )) {
                      const h = b.split("#")[0];
                      if (N[h])
                        try {
                          s.setProperties({ [h]: P });
                        } catch (w) {
                          const f = `Failed to set component property "${h}" for remote instance "${e.name}": ${w}`;
                          throw await a.error(f), new Error(f);
                        }
                    }
                  } else
                    await a.warning(
                      `Cannot set component properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (d) {
                  if (d instanceof Error)
                    throw d;
                  const N = `Failed to set component properties for remote instance "${e.name}": ${d}`;
                  throw await a.error(N), new Error(N);
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
            const p = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw await a.error(p), new Error(p);
          }
        else if ((l == null ? void 0 : l.instanceType) === "normal") {
          if (!l.componentPageName) {
            const h = `Normal instance "${e.name}" missing componentPageName. Cannot resolve.`;
            throw await a.error(h), new Error(h);
          }
          await figma.loadAllPagesAsync();
          const p = figma.root.children.find(
            (h) => h.name === l.componentPageName
          );
          if (!p) {
            await a.log(
              `  Deferring normal instance "${e.name}" - referenced page "${l.componentPageName}" does not exist yet (may be circular reference or not yet imported)`
            );
            const h = figma.createFrame();
            h.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (h.x = e.x), e.y !== void 0 && (h.y = e.y), e.width !== void 0 && e.height !== void 0 ? h.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && h.resize(e.w, e.h), y && y.push({
              placeholderFrame: h,
              instanceEntry: l,
              nodeData: e,
              parentNode: t,
              instanceIndex: e._instanceRef
            }), s = h;
            break;
          }
          let d = null;
          const N = (h, w, f, u) => {
            if (w.length === 0) {
              let C = null;
              for (const E of h.children || [])
                if (E.type === "COMPONENT") {
                  if (E.name === f)
                    if (C || (C = E), u)
                      try {
                        const x = E.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (x && JSON.parse(x).id === u)
                          return E;
                      } catch (x) {
                      }
                    else
                      return E;
                } else if (E.type === "COMPONENT_SET") {
                  for (const x of E.children || [])
                    if (x.type === "COMPONENT" && x.name === f)
                      if (C || (C = x), u)
                        try {
                          const R = x.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (R && JSON.parse(R).id === u)
                            return x;
                        } catch (R) {
                        }
                      else
                        return x;
                }
              return C;
            }
            const [A, ...v] = w;
            for (const C of h.children || [])
              if (C.name === A) {
                if (v.length === 0 && C.type === "COMPONENT_SET") {
                  for (const E of C.children || [])
                    if (E.type === "COMPONENT" && E.name === f) {
                      if (u)
                        try {
                          const x = E.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (x && JSON.parse(x).id === u)
                            return E;
                        } catch (x) {
                        }
                      return E;
                    }
                  return null;
                }
                return N(
                  C,
                  v,
                  f,
                  u
                );
              }
            return null;
          };
          await a.log(
            `  Looking for component "${l.componentName}" on page "${l.componentPageName}"${l.path && l.path.length > 0 ? ` at path [${l.path.join(" → ")}]` : " at page root"}${l.componentGuid ? ` (GUID: ${l.componentGuid.substring(0, 8)}...)` : ""}`
          );
          const b = [], P = (h, w = 0) => {
            const f = "  ".repeat(w);
            if (h.type === "COMPONENT")
              b.push(`${f}COMPONENT: "${h.name}"`);
            else if (h.type === "COMPONENT_SET") {
              b.push(
                `${f}COMPONENT_SET: "${h.name}"`
              );
              for (const u of h.children || [])
                u.type === "COMPONENT" && b.push(
                  `${f}  └─ COMPONENT: "${u.name}"`
                );
            }
            for (const u of h.children || [])
              P(u, w + 1);
          };
          if (P(p), b.length > 0 ? await a.log(
            `  Available components on page "${l.componentPageName}":
${b.slice(0, 20).join(`
`)}${b.length > 20 ? `
  ... and ${b.length - 20} more` : ""}`
          ) : await a.warning(
            `  No components found on page "${l.componentPageName}"`
          ), d = N(
            p,
            l.path || [],
            l.componentName,
            l.componentGuid
          ), d && l.componentGuid)
            try {
              const h = d.getPluginData(
                "RecursicaPublishedMetadata"
              );
              if (h) {
                const w = JSON.parse(h);
                w.id !== l.componentGuid ? await a.warning(
                  `  Found component "${l.componentName}" by name but GUID verification failed (expected ${l.componentGuid.substring(0, 8)}..., got ${w.id ? w.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`
                ) : await a.log(
                  `  Found component "${l.componentName}" with matching GUID ${l.componentGuid.substring(0, 8)}...`
                );
              } else
                await a.warning(
                  `  Found component "${l.componentName}" by name but no metadata found. Using name match as fallback.`
                );
            } catch (h) {
              await a.warning(
                `  Found component "${l.componentName}" by name but GUID verification failed. Using name match as fallback.`
              );
            }
          if (!d) {
            await a.log(
              `  Deferring normal instance "${e.name}" - component "${l.componentName}" not found on page "${l.componentPageName}" (may not be created yet due to circular reference)`
            );
            const h = figma.createFrame();
            h.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (h.x = e.x), e.y !== void 0 && (h.y = e.y), e.width !== void 0 && e.height !== void 0 ? h.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && h.resize(e.w, e.h), y && y.push({
              placeholderFrame: h,
              instanceEntry: l,
              nodeData: e,
              parentNode: t,
              instanceIndex: e._instanceRef
            }), s = h;
            break;
          }
          if (s = d.createInstance(), await a.log(
            `  Created normal instance "${e.name}" from component "${l.componentName}" on page "${l.componentPageName}"`
          ), l.variantProperties && Object.keys(l.variantProperties).length > 0)
            try {
              const h = await s.getMainComponentAsync();
              if (h) {
                let w;
                h.parent && h.parent.type === "COMPONENT_SET" ? w = h.parent.componentPropertyDefinitions : w = h.componentPropertyDefinitions;
                const f = {};
                for (const [u, A] of Object.entries(
                  l.variantProperties
                )) {
                  const v = u.split("#")[0];
                  w[v] && (f[v] = A);
                }
                Object.keys(f).length > 0 && s.setProperties(f);
              }
            } catch (h) {
              await a.warning(
                `Failed to set variant properties for normal instance "${e.name}": ${h}`
              );
            }
          if (l.componentProperties && Object.keys(l.componentProperties).length > 0)
            try {
              const h = await s.getMainComponentAsync();
              if (h) {
                let w;
                h.parent && h.parent.type === "COMPONENT_SET" ? w = h.parent.componentPropertyDefinitions : w = h.componentPropertyDefinitions;
                const f = {};
                for (const [u, A] of Object.entries(
                  l.componentProperties
                )) {
                  const v = u.split("#")[0];
                  let C;
                  if (w[u] ? C = u : w[v] ? C = v : C = Object.keys(w).find(
                    (E) => E.split("#")[0] === v
                  ), C) {
                    const E = A && typeof A == "object" && "value" in A ? A.value : A;
                    f[C] = E;
                  } else
                    await a.warning(
                      `Component property "${v}" (from "${u}") does not exist on component "${l.componentName}" for normal instance "${e.name}". Available properties: ${Object.keys(w).join(", ") || "none"}`
                    );
                }
                if (Object.keys(f).length > 0)
                  try {
                    await a.log(
                      `  Attempting to set component properties for normal instance "${e.name}": ${Object.keys(f).join(", ")}`
                    ), await a.log(
                      `  Available component properties: ${Object.keys(w).join(", ")}`
                    ), s.setProperties(f), await a.log(
                      `  ✓ Successfully set component properties for normal instance "${e.name}": ${Object.keys(f).join(", ")}`
                    );
                  } catch (u) {
                    await a.warning(
                      `Failed to set component properties for normal instance "${e.name}": ${u}`
                    ), await a.warning(
                      `  Properties attempted: ${JSON.stringify(f)}`
                    ), await a.warning(
                      `  Available properties: ${JSON.stringify(Object.keys(w))}`
                    );
                  }
              }
            } catch (h) {
              await a.warning(
                `Failed to set component properties for normal instance "${e.name}": ${h}`
              );
            }
          if (e.width !== void 0 && e.height !== void 0)
            try {
              s.resize(e.width, e.height);
            } catch (h) {
              await a.log(
                `Note: Could not resize normal instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
              );
            }
        } else {
          const p = `Instance "${e.name}" has unknown or missing instance type: ${(l == null ? void 0 : l.instanceType) || "unknown"}`;
          throw await a.error(p), new Error(p);
        }
      } else {
        const l = `Instance "${e.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        throw await a.error(l), new Error(l);
      }
      break;
    case "GROUP":
      s = figma.createFrame();
      break;
    case "BOOLEAN_OPERATION": {
      const l = `Boolean operation nodes cannot be imported. Found boolean operation: "${e.name}".`;
      throw await a.error(l), new Error(l);
    }
    case "POLYGON":
      s = figma.createPolygon();
      break;
    default: {
      const l = `Unsupported node type: ${e.type}. This node type cannot be imported.`;
      throw await a.error(l), new Error(l);
    }
  }
  if (!s)
    return null;
  if (e.id && o && (o.set(e.id, s), s.type === "COMPONENT" && await a.log(
    `  Stored COMPONENT "${e.name || "Unnamed"}" in nodeIdMapping (ID: ${e.id.substring(0, 8)}...)`
  )), Lt(s, e.type || "FRAME"), e.name !== void 0 && (s.name = e.name || "Unnamed Node"), e.x !== void 0 && (s.x = e.x), e.y !== void 0 && (s.y = e.y), e.type !== "VECTOR" && e.width !== void 0 && e.height !== void 0 && s.resize(e.width, e.height), e.visible !== void 0 && (s.visible = e.visible), e.locked !== void 0 && (s.locked = e.locked), e.opacity !== void 0 && (s.opacity = e.opacity), e.rotation !== void 0 && (s.rotation = e.rotation), e.blendMode !== void 0 && (s.blendMode = e.blendMode), e.type !== "INSTANCE") {
    if (e.fills !== void 0)
      try {
        let l = e.fills;
        Array.isArray(l) && (l = l.map((p) => {
          if (p && typeof p == "object") {
            const d = S({}, p);
            return delete d.boundVariables, d;
          }
          return p;
        })), s.fills = l, ($ = e.boundVariables) != null && $.fills && c && await Ue(
          s,
          e.boundVariables,
          "fills",
          c
        );
      } catch (l) {
        console.log("Error setting fills:", l);
      }
    else if (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "GROUP")
      try {
        s.fills = [];
      } catch (l) {
        console.log("Error clearing fills:", l);
      }
  }
  if (e.strokes !== void 0)
    try {
      e.strokes.length > 0 ? s.strokes = e.strokes : s.strokes = [];
    } catch (l) {
      console.log("Error setting strokes:", l);
    }
  else if (e.type === "VECTOR")
    try {
      s.strokes = [];
    } catch (l) {
    }
  if (e.strokeWeight !== void 0 ? s.strokeWeight = e.strokeWeight : e.type === "VECTOR" && (e.strokes === void 0 || e.strokes.length === 0) && (s.strokeWeight = 0), e.strokeAlign !== void 0 && (s.strokeAlign = e.strokeAlign), e.cornerRadius !== void 0 && (s.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (s.effects = e.effects), (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && (e.layoutMode !== void 0 && (s.layoutMode = e.layoutMode), e.primaryAxisSizingMode !== void 0 && (s.primaryAxisSizingMode = e.primaryAxisSizingMode), e.counterAxisSizingMode !== void 0 && (s.counterAxisSizingMode = e.counterAxisSizingMode), e.primaryAxisAlignItems !== void 0 && (s.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (s.counterAxisAlignItems = e.counterAxisAlignItems), e.paddingLeft !== void 0 && (s.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (s.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (s.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (s.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (s.itemSpacing = e.itemSpacing)), (e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (s.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (s.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (s.dashPattern = e.dashPattern), e.type === "VECTOR")) {
    if (e.fillGeometry !== void 0)
      try {
        const { normalizeSvgPath: l } = await Promise.resolve().then(() => Nt), p = e.fillGeometry.map((d) => {
          const N = d.data;
          return {
            data: l(N),
            windingRule: d.windingRule || d.windRule || "NONZERO"
          };
        });
        for (let d = 0; d < e.fillGeometry.length; d++) {
          const N = e.fillGeometry[d].data, b = p[d].data;
          N !== b && await a.log(
            `  Normalized path ${d + 1} for "${e.name || "Unnamed"}": ${N.substring(0, 50)}... -> ${b.substring(0, 50)}...`
          );
        }
        s.vectorPaths = p, await a.log(
          `  Set vectorPaths for VECTOR "${e.name || "Unnamed"}" (${p.length} path(s))`
        );
      } catch (l) {
        await a.warning(
          `Error setting vectorPaths for VECTOR "${e.name || "Unnamed"}": ${l}`
        );
      }
    if (e.strokeGeometry !== void 0)
      try {
        s.strokeGeometry = e.strokeGeometry;
      } catch (l) {
        await a.warning(
          `Error setting strokeGeometry for VECTOR "${e.name || "Unnamed"}": ${l}`
        );
      }
    if (e.width !== void 0 && e.height !== void 0)
      try {
        s.resize(e.width, e.height), await a.log(
          `  Set size for VECTOR "${e.name || "Unnamed"}" to ${e.width}x${e.height}`
        );
      } catch (l) {
        await a.warning(
          `Error setting size for VECTOR "${e.name || "Unnamed"}": ${l}`
        );
      }
  }
  if (e.type === "TEXT" && e.characters !== void 0)
    try {
      if (e.fontName)
        try {
          await figma.loadFontAsync(e.fontName), s.fontName = e.fontName;
        } catch (l) {
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
    } catch (l) {
      console.log("Error setting text properties: " + l);
      try {
        s.characters = e.characters;
      } catch (p) {
        console.log("Could not set text characters: " + p);
      }
    }
  if (e.boundVariables) {
    for (const [l, p] of Object.entries(
      e.boundVariables
    ))
      if (l !== "fills" && Re(p) && n && c) {
        const d = p._varRef;
        if (d !== void 0) {
          const N = c.get(String(d));
          if (N) {
            const b = {
              type: "VARIABLE_ALIAS",
              id: N.id
            };
            s.boundVariables || (s.boundVariables = {}), s.boundVariables[l] || (s.boundVariables[l] = b);
          }
        }
      }
  }
  if (e.children && Array.isArray(e.children) && s.type !== "INSTANCE") {
    const l = (d) => {
      const N = [];
      for (const b of d)
        b._truncated || (b.type === "COMPONENT" ? (N.push(b), b.children && Array.isArray(b.children) && N.push(...l(b.children))) : b.children && Array.isArray(b.children) && N.push(...l(b.children)));
      return N;
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
    const p = l(e.children);
    await a.log(
      `  First pass: Creating ${p.length} COMPONENT node(s) (without children)...`
    );
    for (const d of p)
      await a.log(
        `  Collected COMPONENT "${d.name || "Unnamed"}" (ID: ${d.id ? d.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const d of p)
      if (d.id && o && !o.has(d.id)) {
        const N = figma.createComponent();
        if (d.name !== void 0 && (N.name = d.name || "Unnamed Node"), d.componentPropertyDefinitions) {
          const b = d.componentPropertyDefinitions;
          let P = 0, h = 0;
          for (const [w, f] of Object.entries(b))
            try {
              const A = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[f.type];
              if (!A) {
                await a.warning(
                  `  Unknown property type ${f.type} for property "${w}" in component "${d.name || "Unnamed"}"`
                ), h++;
                continue;
              }
              const v = f.defaultValue, C = w.split("#")[0];
              N.addComponentProperty(
                C,
                A,
                v
              ), P++;
            } catch (u) {
              await a.warning(
                `  Failed to add component property "${w}" to "${d.name || "Unnamed"}" in first pass: ${u}`
              ), h++;
            }
          P > 0 && await a.log(
            `  Added ${P} component property definition(s) to "${d.name || "Unnamed"}" in first pass${h > 0 ? ` (${h} failed)` : ""}`
          );
        }
        o.set(d.id, N), await a.log(
          `  Created COMPONENT "${d.name || "Unnamed"}" (ID: ${d.id.substring(0, 8)}...) in first pass`
        );
      }
    for (const d of e.children) {
      if (d._truncated)
        continue;
      const N = await Y(
        d,
        s,
        n,
        r,
        i,
        c,
        o,
        m,
        g,
        null
        // deferredInstances - not needed for remote structures
      );
      N && s.appendChild(N);
    }
  }
  return t && t.appendChild(s), s;
}
async function Oe(e) {
  await figma.loadAllPagesAsync();
  const t = figma.root.children, n = new Set(t.map((c) => c.name));
  if (!n.has(e))
    return e;
  let r = 1, i = `${e}_${r}`;
  for (; n.has(i); )
    r++, i = `${e}_${r}`;
  return i;
}
async function _t(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), n = new Set(t.map((c) => c.name));
  if (!n.has(e))
    return e;
  let r = 1, i = `${e}_${r}`;
  for (; n.has(i); )
    r++, i = `${e}_${r}`;
  return i;
}
async function zt(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const c of e.variableIds)
    try {
      const o = await figma.variables.getVariableByIdAsync(c);
      o && n.add(o.name);
    } catch (o) {
      continue;
    }
  if (!n.has(t))
    return t;
  let r = 1, i = `${t}_${r}`;
  for (; n.has(i); )
    r++, i = `${t}_${r}`;
  return i;
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
  const n = xt(e, t);
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
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = e.getTable();
  for (const [c, o] of Object.entries(i)) {
    if (o.isLocal === !1) {
      await a.log(
        `Skipping remote collection: "${o.collectionName}" (index ${c})`
      );
      continue;
    }
    const m = await Gt(o);
    m.matchType === "recognized" ? (await a.log(
      `✓ Recognized collection by GUID: "${o.collectionName}" (index ${c})`
    ), t.set(c, m.collection)) : m.matchType === "potential" ? (await a.log(
      `? Potential match by name: "${o.collectionName}" (index ${c})`
    ), n.set(c, {
      entry: o,
      collection: m.collection
    })) : (await a.log(
      `✗ No match found for collection: "${o.collectionName}" (index ${c}) - will create new`
    ), r.set(c, o));
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
    for (const [r, { entry: i, collection: c }] of e.entries())
      try {
        const o = W(i.collectionName) ? K(i.collectionName) : c.name, m = `Found existing "${o}" variable collection. Should I use it?`;
        await a.log(
          `Prompting user about potential match: "${o}"`
        ), await q.prompt(m, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await a.log(
          `✓ User confirmed: Using existing collection "${o}" (index ${r})`
        ), t.set(r, c), await Z(c, i.modes), await a.log(
          `  ✓ Ensured modes for collection "${o}" (${i.modes.length} mode(s))`
        );
      } catch (o) {
        await a.log(
          `✗ User rejected: Will create new collection for "${i.collectionName}" (index ${r})`
        ), n.set(r, i);
      }
  }
}
async function Jt(e, t, n) {
  if (e.size === 0)
    return;
  await a.log("Ensuring modes exist for recognized collections...");
  const r = t.getTable();
  for (const [i, c] of e.entries()) {
    const o = r[i];
    o && (n.has(i) || (await Z(c, o.modes), await a.log(
      `  ✓ Ensured modes for collection "${c.name}" (${o.modes.length} mode(s))`
    )));
  }
}
async function Kt(e, t, n) {
  if (e.size !== 0) {
    await a.log(
      `Creating ${e.size} new collection(s)...`
    );
    for (const [r, i] of e.entries()) {
      const c = K(i.collectionName), o = await _t(c);
      o !== c ? await a.log(
        `Creating collection: "${o}" (normalized: "${c}" - name conflict resolved)`
      ) : await a.log(`Creating collection: "${o}"`);
      const m = figma.variables.createVariableCollection(o);
      n.push(m);
      let g;
      if (W(i.collectionName)) {
        const y = Ae(i.collectionName);
        y && (g = y);
      } else i.collectionGuid && (g = i.collectionGuid);
      g && (m.setSharedPluginData(
        "recursica",
        j,
        g
      ), await a.log(
        `  Stored GUID: ${g.substring(0, 8)}...`
      )), await Z(m, i.modes), await a.log(
        `  ✓ Created collection "${o}" with ${i.modes.length} mode(s)`
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
  const i = /* @__PURE__ */ new Map(), c = [], o = new Set(
    r.map((y) => y.id)
  );
  await a.log("Matching and creating variables in collections...");
  const m = e.getTable(), g = /* @__PURE__ */ new Map();
  for (const [y, s] of Object.entries(m)) {
    if (s._colRef === void 0)
      continue;
    const $ = n.get(String(s._colRef));
    if (!$)
      continue;
    g.has($.id) || g.set($.id, {
      collectionName: $.name,
      existing: 0,
      created: 0
    });
    const l = g.get($.id), p = o.has(
      $.id
    );
    let d;
    typeof s.variableType == "number" ? d = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[s.variableType] || String(s.variableType) : d = s.variableType;
    const N = await Fe(
      $,
      s.variableName
    );
    if (N)
      if (Vt(N, d))
        i.set(y, N), l.existing++;
      else {
        await a.warning(
          `Type mismatch for variable "${s.variableName}" in collection "${$.name}": expected ${d}, found ${N.resolvedType}. Creating new variable with incremented name.`
        );
        const b = await zt(
          $,
          s.variableName
        ), P = await xe(
          V(S({}, s), {
            variableName: b,
            variableType: d
          }),
          $,
          e,
          t
        );
        p || c.push(P), i.set(y, P), l.created++;
      }
    else {
      const b = await xe(
        V(S({}, s), {
          variableType: d
        }),
        $,
        e,
        t
      );
      p || c.push(b), i.set(y, b), l.created++;
    }
  }
  await a.log("Variable processing complete:");
  for (const y of g.values())
    await a.log(
      `  "${y.collectionName}": ${y.existing} existing, ${y.created} created`
    );
  return {
    recognizedVariables: i,
    newlyCreatedVariables: c
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
  for (const c of e.children)
    (c.type === "FRAME" || c.type === "COMPONENT") && n.add(c.name);
  if (!n.has(t))
    return t;
  let r = 1, i = `${t}_${r}`;
  for (; n.has(i); )
    r++, i = `${t}_${r}`;
  return i;
}
async function Zt(e, t, n, r) {
  var $;
  const i = e.getSerializedTable(), c = Object.values(i).filter(
    (l) => l.instanceType === "remote"
  ), o = /* @__PURE__ */ new Map();
  if (c.length === 0)
    return await a.log("No remote instances found"), o;
  await a.log(
    `Processing ${c.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  let g = figma.root.children.find((l) => l.name === "REMOTES");
  if (g ? await a.log("Found existing REMOTES page") : (g = figma.createPage(), g.name = "REMOTES", await a.log("Created REMOTES page")), !g.children.some(
    (l) => l.type === "FRAME" && l.name === "Title"
  )) {
    const l = { family: "Inter", style: "Bold" }, p = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(l), await figma.loadFontAsync(p);
    const d = figma.createFrame();
    d.name = "Title", d.layoutMode = "VERTICAL", d.paddingTop = 20, d.paddingBottom = 20, d.paddingLeft = 20, d.paddingRight = 20, d.fills = [];
    const N = figma.createText();
    N.fontName = l, N.characters = "REMOTE INSTANCES", N.fontSize = 24, N.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], d.appendChild(N);
    const b = figma.createText();
    b.fontName = p, b.characters = "These are remotely connected component instances found in our different component pages.", b.fontSize = 14, b.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], d.appendChild(b), g.appendChild(d), await a.log("Created title and description on REMOTES page");
  }
  const s = /* @__PURE__ */ new Map();
  for (const [l, p] of Object.entries(i)) {
    if (p.instanceType !== "remote")
      continue;
    const d = parseInt(l, 10);
    if (await a.log(
      `Processing remote instance ${d}: "${p.componentName}"`
    ), !p.structure) {
      await a.warning(
        `Remote instance "${p.componentName}" missing structure data, skipping`
      );
      continue;
    }
    Pe(p.structure);
    const N = p.structure.children !== void 0, b = p.structure.child !== void 0, P = p.structure.children ? p.structure.children.length : p.structure.child ? p.structure.child.length : 0;
    await a.log(
      `  Structure type: ${p.structure.type || "unknown"}, has children: ${P} (children key: ${N}, child key: ${b})`
    );
    let h = p.componentName;
    if (p.path && p.path.length > 0) {
      const f = p.path.filter((u) => u !== "").join(" / ");
      f && (h = `${f} / ${p.componentName}`);
    }
    const w = await Xt(
      g,
      h
    );
    w !== h && await a.log(
      `Component name conflict: "${h}" -> "${w}"`
    );
    try {
      if (p.structure.type !== "COMPONENT") {
        await a.warning(
          `Remote instance "${p.componentName}" structure is not a COMPONENT (type: ${p.structure.type}), creating frame fallback`
        );
        const u = figma.createFrame();
        u.name = w;
        const A = await Y(
          p.structure,
          u,
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
        A ? (u.appendChild(A), g.appendChild(u), await a.log(
          `✓ Created remote instance frame fallback: "${w}"`
        )) : u.remove();
        continue;
      }
      const f = figma.createComponent();
      f.name = w, g.appendChild(f), await a.log(
        `  Created component node: "${w}"`
      );
      try {
        if (p.structure.componentPropertyDefinitions) {
          const A = p.structure.componentPropertyDefinitions;
          let v = 0, C = 0;
          for (const [E, x] of Object.entries(A))
            try {
              const L = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[x.type];
              if (!L) {
                await a.warning(
                  `  Unknown property type ${x.type} for property "${E}" in component "${p.componentName}"`
                ), C++;
                continue;
              }
              const G = x.defaultValue, O = E.split("#")[0];
              f.addComponentProperty(
                O,
                L,
                G
              ), v++;
            } catch (R) {
              await a.warning(
                `  Failed to add component property "${E}" to "${p.componentName}": ${R}`
              ), C++;
            }
          v > 0 && await a.log(
            `  Added ${v} component property definition(s) to "${p.componentName}"${C > 0 ? ` (${C} failed)` : ""}`
          );
        }
        if (p.structure.name !== void 0 && (f.name = p.structure.name), p.structure.width !== void 0 && p.structure.height !== void 0 && f.resize(p.structure.width, p.structure.height), p.structure.x !== void 0 && (f.x = p.structure.x), p.structure.y !== void 0 && (f.y = p.structure.y), p.structure.visible !== void 0 && (f.visible = p.structure.visible), p.structure.opacity !== void 0 && (f.opacity = p.structure.opacity), p.structure.rotation !== void 0 && (f.rotation = p.structure.rotation), p.structure.blendMode !== void 0 && (f.blendMode = p.structure.blendMode), p.structure.fills !== void 0)
          try {
            let A = p.structure.fills;
            Array.isArray(A) && (A = A.map((v) => {
              if (v && typeof v == "object") {
                const C = S({}, v);
                return delete C.boundVariables, C;
              }
              return v;
            })), f.fills = A, ($ = p.structure.boundVariables) != null && $.fills && r && await Ue(
              f,
              p.structure.boundVariables,
              "fills",
              r
            );
          } catch (A) {
            await a.warning(
              `Error setting fills for remote component "${p.componentName}": ${A}`
            );
          }
        if (p.structure.strokes !== void 0)
          try {
            f.strokes = p.structure.strokes;
          } catch (A) {
            await a.warning(
              `Error setting strokes for remote component "${p.componentName}": ${A}`
            );
          }
        p.structure.layoutMode !== void 0 && (f.layoutMode = p.structure.layoutMode), p.structure.primaryAxisSizingMode !== void 0 && (f.primaryAxisSizingMode = p.structure.primaryAxisSizingMode), p.structure.counterAxisSizingMode !== void 0 && (f.counterAxisSizingMode = p.structure.counterAxisSizingMode), p.structure.paddingLeft !== void 0 && (f.paddingLeft = p.structure.paddingLeft), p.structure.paddingRight !== void 0 && (f.paddingRight = p.structure.paddingRight), p.structure.paddingTop !== void 0 && (f.paddingTop = p.structure.paddingTop), p.structure.paddingBottom !== void 0 && (f.paddingBottom = p.structure.paddingBottom), p.structure.itemSpacing !== void 0 && (f.itemSpacing = p.structure.itemSpacing), p.structure.cornerRadius !== void 0 && (f.cornerRadius = p.structure.cornerRadius), await a.log(
          `  DEBUG: Structure keys: ${Object.keys(p.structure).join(", ")}, has children: ${!!p.structure.children}, has child: ${!!p.structure.child}`
        );
        const u = p.structure.children || (p.structure.child ? p.structure.child : null);
        if (await a.log(
          `  DEBUG: childrenArray exists: ${!!u}, isArray: ${Array.isArray(u)}, length: ${u ? u.length : 0}`
        ), u && Array.isArray(u) && u.length > 0) {
          await a.log(
            `  Recreating ${u.length} child(ren) for component "${p.componentName}"`
          );
          for (let A = 0; A < u.length; A++) {
            const v = u[A];
            if (await a.log(
              `  DEBUG: Processing child ${A + 1}/${u.length}: ${JSON.stringify({ name: v == null ? void 0 : v.name, type: v == null ? void 0 : v.type, hasTruncated: !!(v != null && v._truncated) })}`
            ), v._truncated) {
              await a.log(
                `  Skipping truncated child: ${v._reason || "Unknown"}`
              );
              continue;
            }
            await a.log(
              `  Recreating child: "${v.name || "Unnamed"}" (type: ${v.type})`
            );
            const C = await Y(
              v,
              f,
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
            C ? (f.appendChild(C), await a.log(
              `  ✓ Appended child "${v.name || "Unnamed"}" to component "${p.componentName}"`
            )) : await a.warning(
              `  ✗ Failed to create child "${v.name || "Unnamed"}" (type: ${v.type})`
            );
          }
        }
        o.set(d, f), await a.log(
          `✓ Created remote component: "${w}" (index ${d})`
        );
      } catch (u) {
        await a.warning(
          `Error populating remote component "${p.componentName}": ${u instanceof Error ? u.message : "Unknown error"}`
        ), f.remove();
      }
    } catch (f) {
      await a.warning(
        `Error recreating remote instance "${p.componentName}": ${f instanceof Error ? f.message : "Unknown error"}`
      );
    }
  }
  return await a.log(
    `Remote instance processing complete: ${o.size} component(s) created`
  ), o;
}
async function Qt(e, t, n, r, i, c, o = null, m = null, g = !1) {
  await a.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const y = figma.root.children, s = "RecursicaPublishedMetadata";
  let $ = null;
  for (const u of y) {
    const A = u.getPluginData(s);
    if (A)
      try {
        if (JSON.parse(A).id === e.guid) {
          $ = u;
          break;
        }
      } catch (v) {
        continue;
      }
  }
  let l = !1;
  if ($ && !g) {
    let u;
    try {
      const C = $.getPluginData(s);
      C && (u = JSON.parse(C).version);
    } catch (C) {
    }
    const A = u !== void 0 ? ` v${u}` : "", v = `Found existing component "${$.name}${A}". Should I use it or create a copy?`;
    await a.log(
      `Found existing page with same GUID: "${$.name}". Prompting user...`
    );
    try {
      await q.prompt(v, {
        okLabel: "Use",
        cancelLabel: "Copy",
        timeoutMs: 3e5
        // 5 minutes
      }), l = !0, await a.log(
        `User chose to use existing page: "${$.name}"`
      );
    } catch (C) {
      await a.log(
        "User chose to create a copy. Will create new page."
      );
    }
  }
  if (l && $)
    return await figma.setCurrentPageAsync($), await a.log(
      `Using existing page: "${$.name}" (GUID: ${e.guid.substring(0, 8)}...)`
    ), await a.log(
      `  Instances from other pages will resolve to components on this existing page using componentPageName: "${$.name}"`
    ), {
      success: !0,
      page: $,
      // Include pageId so it can be tracked in importedPages
      pageId: $.id
    };
  const p = y.find((u) => u.name === e.name);
  p && await a.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let d;
  if ($ || p) {
    const u = `__${e.name}`;
    d = await Oe(u), await a.log(
      `Creating scratch page: "${d}" (will be renamed to "${e.name}" on success)`
    );
  } else
    d = e.name, await a.log(`Creating page: "${d}"`);
  const N = figma.createPage();
  if (N.name = d, await figma.setCurrentPageAsync(N), await a.log(`Switched to page: "${d}"`), !t.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await a.log("Recreating page structure...");
  const b = t.pageData;
  if (b.backgrounds !== void 0)
    try {
      N.backgrounds = b.backgrounds, await a.log(
        `Set page background: ${JSON.stringify(b.backgrounds)}`
      );
    } catch (u) {
      await a.warning(`Failed to set page background: ${u}`);
    }
  Pe(b);
  const P = /* @__PURE__ */ new Map(), h = (u, A = []) => {
    if (u.type === "COMPONENT" && u.id && A.push(u.id), u.children && Array.isArray(u.children))
      for (const v of u.children)
        v._truncated || h(v, A);
    return A;
  }, w = h(b);
  if (await a.log(
    `Found ${w.length} COMPONENT node(s) in page data`
  ), w.length > 0 && (await a.log(
    `Component IDs in page data (first 20): ${w.slice(0, 20).map((u) => u.substring(0, 8) + "...").join(", ")}`
  ), b._allComponentIds = w), b.children && Array.isArray(b.children))
    for (const u of b.children) {
      const A = await Y(
        u,
        N,
        n,
        r,
        i,
        c,
        P,
        !1,
        // isRemoteStructure: false - we're creating the main page
        o,
        m
      );
      A && N.appendChild(A);
    }
  await a.log("Page structure recreated successfully");
  const f = {
    _ver: 1,
    id: e.guid,
    name: e.name,
    version: e.version || 0,
    publishDate: (/* @__PURE__ */ new Date()).toISOString(),
    history: {}
  };
  if (N.setPluginData(s, JSON.stringify(f)), await a.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), d.startsWith("__")) {
    const u = await Oe(e.name);
    N.name = u, await a.log(`Renamed page from "${d}" to "${u}"`);
  }
  return {
    success: !0,
    page: N
  };
}
async function Be(e) {
  var r;
  e.clearConsole !== !1 && await a.clear(), await a.log("=== Starting Page Import ===");
  const n = [];
  try {
    const i = e.jsonData;
    if (!i)
      return await a.error("JSON data is required"), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "JSON data is required",
        data: {}
      };
    await a.log("Validating metadata...");
    const c = Ft(i);
    if (!c.success)
      return await a.error(c.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: c.error,
        data: {}
      };
    const o = c.metadata;
    await a.log(
      `Metadata validated: guid=${o.guid}, name=${o.name}`
    ), await a.log("Loading string table...");
    const m = je(i);
    if (!m.success)
      return await a.error(m.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: m.error,
        data: {}
      };
    await a.log("String table loaded successfully"), await a.log("Expanding JSON data...");
    const g = m.expandedJsonData;
    await a.log("JSON expanded successfully"), await a.log("Loading collections table...");
    const y = Ut(g);
    if (!y.success)
      return y.error === "No collections table found in JSON" ? (await a.log(y.error), await a.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: o.name }
      }) : (await a.error(y.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: y.error,
        data: {}
      });
    const s = y.collectionTable;
    await a.log(
      `Loaded collections table with ${s.getSize()} collection(s)`
    ), await a.log(
      "Matching collections with existing local collections..."
    );
    const { recognizedCollections: $, potentialMatches: l, collectionsToCreate: p } = await jt(s);
    await Bt(
      l,
      $,
      p
    ), await Jt(
      $,
      s,
      l
    ), await Kt(
      p,
      $,
      n
    ), await a.log("Loading variables table...");
    const d = Wt(g);
    if (!d.success)
      return d.error === "No variables table found in JSON" ? (await a.log(d.error), await a.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no variables to process)",
        data: { pageName: o.name }
      }) : (await a.error(d.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: d.error,
        data: {}
      });
    const N = d.variableTable;
    await a.log(
      `Loaded variables table with ${N.getSize()} variable(s)`
    );
    const { recognizedVariables: b, newlyCreatedVariables: P } = await Ht(
      N,
      s,
      $,
      n
    );
    await a.log("Loading instance table...");
    const h = qt(g);
    if (h) {
      const R = h.getSerializedTable(), L = Object.values(R).filter(
        (O) => O.instanceType === "internal"
      ), G = Object.values(R).filter(
        (O) => O.instanceType === "remote"
      );
      await a.log(
        `Loaded instance table with ${h.getSize()} instance(s) (${L.length} internal, ${G.length} remote)`
      );
    } else
      await a.log("No instance table found in JSON");
    let w = null;
    h && (w = await Zt(
      h,
      N,
      s,
      b
    ));
    const f = [], u = (r = e.isMainPage) != null ? r : !0, A = await Qt(
      o,
      g,
      N,
      s,
      h,
      b,
      w,
      f,
      u
    );
    if (!A.success)
      return await a.error(A.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: A.error,
        data: {}
      };
    const v = A.page, C = b.size + P.length, E = f.length;
    await a.log("=== Import Complete ==="), await a.log(
      `Successfully processed ${$.size} collection(s), ${C} variable(s), and created page "${v.name}"${E > 0 ? ` (${E} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`
    );
    const x = A.pageId || v.id;
    return {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: {
        pageName: v.name,
        pageId: x,
        // Include pageId for tracking (used for both new and reused pages)
        deferredInstances: E > 0 ? f : void 0,
        createdEntities: {
          pageIds: [v.id],
          collectionIds: n.map((R) => R.id),
          variableIds: P.map((R) => R.id)
        }
      }
    };
  } catch (i) {
    const c = i instanceof Error ? i.message : "Unknown error occurred";
    return await a.error(`Import failed: ${c}`), i instanceof Error && i.stack && await a.error(`Stack trace: ${i.stack}`), console.error("Error importing page:", i), {
      type: "importPage",
      success: !1,
      error: !0,
      message: c,
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
  for (const i of e)
    try {
      const { placeholderFrame: c, instanceEntry: o, nodeData: m, parentNode: g } = i, y = figma.root.children.find(
        (d) => d.name === o.componentPageName
      );
      if (!y) {
        const d = `Deferred instance "${m.name}" still cannot find referenced page "${o.componentPageName}"`;
        await a.error(d), r.push(d), n++;
        continue;
      }
      const s = (d, N, b, P) => {
        if (N.length === 0) {
          let f = null;
          for (const u of d.children || [])
            if (u.type === "COMPONENT") {
              if (u.name === b)
                if (f || (f = u), P)
                  try {
                    const A = u.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (A && JSON.parse(A).id === P)
                      return u;
                  } catch (A) {
                  }
                else
                  return u;
            } else if (u.type === "COMPONENT_SET") {
              for (const A of u.children || [])
                if (A.type === "COMPONENT" && A.name === b)
                  if (f || (f = A), P)
                    try {
                      const v = A.getPluginData(
                        "RecursicaPublishedMetadata"
                      );
                      if (v && JSON.parse(v).id === P)
                        return A;
                    } catch (v) {
                    }
                  else
                    return A;
            }
          return f;
        }
        const [h, ...w] = N;
        for (const f of d.children || [])
          if (f.name === h)
            return s(
              f,
              w,
              b,
              P
            );
        return null;
      }, $ = s(
        y,
        o.path || [],
        o.componentName,
        o.componentGuid
      );
      if (!$) {
        const d = o.path && o.path.length > 0 ? ` at path [${o.path.join(" → ")}]` : " at page root", N = `Deferred instance "${m.name}" still cannot find component "${o.componentName}" on page "${o.componentPageName}"${d}`;
        await a.error(N), r.push(N), n++;
        continue;
      }
      const l = $.createInstance();
      if (l.name = m.name || c.name.replace("[Deferred: ", "").replace("]", ""), l.x = c.x, l.y = c.y, c.width !== void 0 && c.height !== void 0 && l.resize(c.width, c.height), o.variantProperties && Object.keys(o.variantProperties).length > 0)
        try {
          const d = await l.getMainComponentAsync();
          if (d) {
            const N = d.componentPropertyDefinitions, b = {};
            for (const [P, h] of Object.entries(
              o.variantProperties
            )) {
              const w = P.split("#")[0];
              N[w] && (b[w] = h);
            }
            Object.keys(b).length > 0 && l.setProperties(b);
          }
        } catch (d) {
          await a.warning(
            `Failed to set variant properties for resolved instance "${m.name}": ${d}`
          );
        }
      if (o.componentProperties && Object.keys(o.componentProperties).length > 0)
        try {
          const d = await l.getMainComponentAsync();
          if (d) {
            const N = d.componentPropertyDefinitions;
            for (const [b, P] of Object.entries(
              o.componentProperties
            )) {
              const h = b.split("#")[0];
              if (N[h])
                try {
                  l.setProperties({
                    [h]: P
                  });
                } catch (w) {
                  await a.warning(
                    `Failed to set component property "${h}" for resolved instance "${m.name}": ${w}`
                  );
                }
            }
          }
        } catch (d) {
          await a.warning(
            `Failed to set component properties for resolved instance "${m.name}": ${d}`
          );
        }
      const p = g.children.indexOf(c);
      g.insertChild(p, l), c.remove(), await a.log(
        `  ✓ Resolved deferred instance "${m.name}" from component "${o.componentName}" on page "${o.componentPageName}"`
      ), t++;
    } catch (c) {
      const o = c instanceof Error ? c.message : String(c), m = `Failed to resolve deferred instance "${i.nodeData.name}": ${o}`;
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
    let i = 0;
    for (const m of r)
      try {
        const g = figma.variables.getVariableById(m);
        if (g) {
          const y = g.variableCollectionId;
          n.includes(y) || (g.remove(), i++);
        }
      } catch (g) {
        await a.warning(
          `Could not delete variable ${m.substring(0, 8)}...: ${g}`
        );
      }
    let c = 0;
    for (const m of n)
      try {
        const g = figma.variables.getVariableCollectionById(m);
        g && (g.remove(), c++);
      } catch (g) {
        await a.warning(
          `Could not delete collection ${m.substring(0, 8)}...: ${g}`
        );
      }
    await figma.loadAllPagesAsync();
    let o = 0;
    for (const m of t)
      try {
        const g = await figma.getNodeByIdAsync(m);
        g && g.type === "PAGE" && (g.remove(), o++);
      } catch (g) {
        await a.warning(
          `Could not delete page ${m.substring(0, 8)}...: ${g}`
        );
      }
    return await a.log(
      `Cleanup complete: Deleted ${o} page(s), ${c} collection(s), ${i} variable(s)`
    ), {
      type: "cleanupCreatedEntities",
      success: !0,
      error: !1,
      message: "Cleanup completed successfully",
      data: {
        deletedPages: o,
        deletedCollections: c,
        deletedVariables: i
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
      const i = je(r);
      if (!i.success || !i.expandedJsonData) {
        await a.warning(
          `Skipping ${n} - failed to expand JSON: ${i.error || "Unknown error"}`
        );
        continue;
      }
      const c = i.expandedJsonData, o = c.metadata;
      if (!o || !o.name || !o.guid) {
        await a.warning(
          `Skipping ${n} - missing or invalid metadata`
        );
        continue;
      }
      const m = [];
      if (c.instances) {
        const y = Q.fromTable(
          c.instances
        ).getSerializedTable();
        for (const s of Object.values(y))
          s.instanceType === "normal" && s.componentPageName && (m.includes(s.componentPageName) || m.push(s.componentPageName));
      }
      t.push({
        fileName: n,
        pageName: o.name,
        pageGuid: o.guid,
        dependencies: m,
        jsonData: r
        // Store original JSON data for import
      }), await a.log(
        `  ${n}: "${o.name}" depends on: ${m.length > 0 ? m.join(", ") : "none"}`
      );
    } catch (i) {
      await a.error(
        `Error processing ${n}: ${i instanceof Error ? i.message : String(i)}`
      );
    }
  return t;
}
function We(e) {
  const t = [], n = [], r = [], i = /* @__PURE__ */ new Map();
  for (const y of e)
    i.set(y.pageName, y);
  const c = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), m = [], g = (y) => {
    if (c.has(y.pageName))
      return !1;
    if (o.has(y.pageName)) {
      const s = m.findIndex(
        ($) => $.pageName === y.pageName
      );
      if (s !== -1) {
        const $ = m.slice(s).concat([y]);
        return n.push($), !0;
      }
      return !1;
    }
    o.add(y.pageName), m.push(y);
    for (const s of y.dependencies) {
      const $ = i.get(s);
      $ && g($);
    }
    return o.delete(y.pageName), m.pop(), c.add(y.pageName), t.push(y), !1;
  };
  for (const y of e)
    c.has(y.pageName) || g(y);
  for (const y of e)
    for (const s of y.dependencies)
      i.has(s) || r.push(
        `Page "${y.pageName}" (${y.fileName}) depends on "${s}" which is not in the import set`
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
      const i = r.map((c) => `"${c.pageName}"`).join(" → ");
      await a.log(`  Cycle: ${i} → (back to start)`);
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
    const i = n.order[r];
    await a.log(`  ${r + 1}. ${i.fileName} ("${i.pageName}")`);
  }
  return n;
}
async function en(e) {
  var d, N, b, P, h;
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
    errors: i
  } = await He(t);
  i.length > 0 && await a.warning(
    `Found ${i.length} dependency warning(s) - some dependencies may be missing`
  ), r.length > 0 && await a.log(
    `Detected ${r.length} circular dependency cycle(s) - will use deferred resolution`
  ), await a.log("=== Importing Pages in Order ===");
  let c = 0, o = 0;
  const m = [...i], g = [], y = {
    pageIds: [],
    collectionIds: [],
    variableIds: []
  }, s = [], $ = e.mainFileName;
  for (let w = 0; w < n.length; w++) {
    const f = n[w], u = $ ? f.fileName === $ : w === n.length - 1;
    await a.log(
      `[${w + 1}/${n.length}] Importing ${f.fileName} ("${f.pageName}")${u ? " [MAIN]" : " [DEPENDENCY]"}...`
    );
    try {
      const A = w === 0, v = await Be({
        jsonData: f.jsonData,
        isMainPage: u,
        clearConsole: A
      });
      if (v.success) {
        if (c++, (d = v.data) != null && d.deferredInstances) {
          const C = v.data.deferredInstances;
          Array.isArray(C) && g.push(...C);
        }
        if ((N = v.data) != null && N.createdEntities) {
          const C = v.data.createdEntities;
          C.pageIds && y.pageIds.push(...C.pageIds), C.collectionIds && y.collectionIds.push(...C.collectionIds), C.variableIds && y.variableIds.push(...C.variableIds);
          const E = ((b = C.pageIds) == null ? void 0 : b[0]) || ((P = v.data) == null ? void 0 : P.pageId);
          (h = v.data) != null && h.pageName && E && s.push({
            name: v.data.pageName,
            pageId: E
          });
        }
      } else
        o++, m.push(
          `Failed to import ${f.fileName}: ${v.message || "Unknown error"}`
        );
    } catch (A) {
      o++;
      const v = A instanceof Error ? A.message : String(A);
      m.push(`Failed to import ${f.fileName}: ${v}`);
    }
  }
  if (g.length > 0) {
    await a.log(
      `=== Resolving ${g.length} Deferred Instance(s) ===`
    );
    try {
      const w = await Je(g);
      await a.log(
        `  Resolved: ${w.resolved}, Failed: ${w.failed}`
      ), w.errors.length > 0 && m.push(...w.errors);
    } catch (w) {
      m.push(
        `Failed to resolve deferred instances: ${w instanceof Error ? w.message : String(w)}`
      );
    }
  }
  await a.log("=== Import Summary ==="), await a.log(
    `  Imported: ${c}, Failed: ${o}, Deferred instances: ${g.length}`
  );
  const l = o === 0, p = l ? `Successfully imported ${c} page(s)${g.length > 0 ? ` (${g.length} deferred instance(s) resolved)` : ""}` : `Import completed with ${o} failure(s). ${m.join("; ")}`;
  return {
    type: "importPagesInOrder",
    success: l,
    error: !l,
    message: p,
    data: {
      imported: c,
      failed: o,
      deferred: g.length,
      errors: m,
      importedPages: s,
      createdEntities: y
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
    const i = await me(
      r,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + r.name + " (index: " + n + ")"
    );
    const c = JSON.stringify(i, null, 2), o = JSON.parse(c), m = "Copy - " + o.name, g = figma.createPage();
    if (g.name = m, figma.root.appendChild(g), o.children && o.children.length > 0) {
      let $ = function(p) {
        p.forEach((d) => {
          const N = (d.x || 0) + (d.width || 0);
          N > l && (l = N), d.children && d.children.length > 0 && $(d.children);
        });
      };
      console.log(
        "Recreating " + o.children.length + " top-level children..."
      );
      let l = 0;
      $(o.children), console.log("Original content rightmost edge: " + l);
      for (const p of o.children)
        await Y(p, g, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const y = pe(o);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: o.name,
        newPageName: m,
        totalNodes: y
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
    ), i = t.getPluginData(Ye);
    if (!i) {
      const y = {
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
      return ve("getComponentMetadata", y);
    }
    const o = {
      componentMetadata: JSON.parse(i),
      currentPageIndex: r
    };
    return ve("getComponentMetadata", o);
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
    for (const i of t) {
      if (i.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${i.name} (type: ${i.type})`
        );
        continue;
      }
      const c = i, o = c.getPluginData(Ye);
      if (o)
        try {
          const m = JSON.parse(o);
          n.push(m);
        } catch (m) {
          console.warn(
            `Failed to parse metadata for page "${c.name}":`,
            m
          );
          const y = {
            _ver: 1,
            id: "",
            name: se(c.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          n.push(y);
        }
      else {
        const g = {
          _ver: 1,
          id: "",
          name: se(c.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        n.push(g);
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
  exportPage: Ce,
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
      const c = {
        type: t.type,
        success: !1,
        error: !0,
        message: "Unknown message type: " + t.type,
        data: {},
        requestId: t.requestId
      };
      figma.ui.postMessage(c);
      return;
    }
    const i = await r(t.data);
    figma.ui.postMessage(V(S({}, i), {
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
