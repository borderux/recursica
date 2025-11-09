var Te = Object.defineProperty, Ce = Object.defineProperties;
var Ee = Object.getOwnPropertyDescriptors;
var oe = Object.getOwnPropertySymbols;
var Re = Object.prototype.hasOwnProperty, Me = Object.prototype.propertyIsEnumerable;
var Q = (e, t, a) => t in e ? Te(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, N = (e, t) => {
  for (var a in t || (t = {}))
    Re.call(t, a) && Q(e, a, t[a]);
  if (oe)
    for (var a of oe(t))
      Me.call(t, a) && Q(e, a, t[a]);
  return e;
}, M = (e, t) => Ce(e, Ee(t));
var E = (e, t, a) => Q(e, typeof t != "symbol" ? t + "" : t, a);
async function ke(e) {
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
  } catch (a) {
    return {
      type: "getCurrentUser",
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Pe(e) {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "loadPages",
      success: !0,
      error: !1,
      message: "Pages loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        pages: figma.root.children.map((r, s) => ({
          name: r.name,
          index: s
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
const T = {
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
}, I = M(N({}, T), {
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
}), k = M(N({}, T), {
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
}), _ = M(N({}, T), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), fe = M(N({}, T), {
  cornerRadius: 0
}), $e = M(N({}, T), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function Oe(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return I;
    case "TEXT":
      return k;
    case "VECTOR":
      return _;
    case "LINE":
      return $e;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return fe;
    default:
      return T;
  }
}
function A(e, t) {
  if (Array.isArray(e))
    return Array.isArray(t) ? e.length !== t.length || e.some((a, i) => A(a, t[i])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof t == "object" && t !== null) {
      const a = Object.keys(e), i = Object.keys(t);
      return a.length !== i.length ? !0 : a.some(
        (r) => !(r in t) || A(e[r], t[r])
      );
    }
    return !0;
  }
  return e !== t;
}
const Z = {
  LAYER: "00000000-0000-0000-0000-000000000001",
  TOKENS: "00000000-0000-0000-0000-000000000002",
  THEME: "00000000-0000-0000-0000-000000000003"
}, $ = {
  LAYER: "Layer",
  TOKENS: "Tokens",
  THEME: "Theme"
};
function O(e) {
  const t = e.trim(), a = t.toLowerCase();
  return a === "themes" ? $.THEME : a === "token" ? $.TOKENS : a === "layer" ? $.LAYER : a === "tokens" ? $.TOKENS : a === "theme" ? $.THEME : t;
}
function L(e) {
  const t = O(e);
  return t === $.LAYER || t === $.TOKENS || t === $.THEME;
}
function ie(e) {
  const t = O(e);
  if (t === $.LAYER)
    return Z.LAYER;
  if (t === $.TOKENS)
    return Z.TOKENS;
  if (t === $.THEME)
    return Z.THEME;
}
class H {
  constructor() {
    E(this, "collectionMap");
    // collectionId -> index
    E(this, "collections");
    // index -> collection data
    E(this, "normalizedNameMap");
    // normalized name -> index (for standard collections)
    E(this, "nextIndex");
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
  mergeModes(t, a) {
    const i = new Set(t);
    for (const r of a)
      i.add(r);
    return Array.from(i);
  }
  /**
   * Adds a collection to the table if it doesn't already exist
   * For standard collections (Layer, Tokens, Theme), merges by normalized name
   * Returns the index of the collection (existing or newly added)
   */
  addCollection(t) {
    const a = t.collectionId;
    if (this.collectionMap.has(a))
      return this.collectionMap.get(a);
    const i = O(
      t.collectionName
    );
    if (L(t.collectionName)) {
      const o = this.findCollectionByNormalizedName(i);
      if (o !== void 0) {
        const d = this.collections[o];
        return d.modes = this.mergeModes(
          d.modes,
          t.modes
        ), this.collectionMap.set(a, o), o;
      }
    }
    const r = this.nextIndex++;
    this.collectionMap.set(a, r);
    const s = M(N({}, t), {
      collectionName: i
    });
    if (L(t.collectionName)) {
      const o = ie(
        t.collectionName
      );
      o && (s.collectionGuid = o), this.normalizedNameMap.set(i, r);
    }
    return this.collections[r] = s, r;
  }
  /**
   * Gets the index of a collection by its collectionId
   * Returns -1 if not found
   */
  getCollectionIndex(t) {
    var a;
    return (a = this.collectionMap.get(t)) != null ? a : -1;
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
    for (let a = 0; a < this.collections.length; a++)
      t[String(a)] = this.collections[a];
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
    for (let a = 0; a < this.collections.length; a++) {
      const i = this.collections[a], r = N({
        collectionName: i.collectionName,
        modes: i.modes
      }, i.collectionGuid && { collectionGuid: i.collectionGuid });
      t[String(a)] = r;
    }
    return t;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   * Handles both new format (without collectionId/isLocal) and legacy format (with collectionId/isLocal)
   */
  static fromTable(t) {
    var r;
    const a = new H(), i = Object.entries(t).sort(
      (s, o) => parseInt(s[0], 10) - parseInt(o[0], 10)
    );
    for (const [s, o] of i) {
      const d = parseInt(s, 10), g = (r = o.isLocal) != null ? r : !0, f = O(
        o.collectionName || ""
      ), n = o.collectionId || o.collectionGuid || `temp:${d}:${f}`, u = N({
        collectionName: f,
        collectionId: n,
        isLocal: g,
        modes: o.modes || []
      }, o.collectionGuid && {
        collectionGuid: o.collectionGuid
      });
      a.collectionMap.set(n, d), a.collections[d] = u, L(f) && a.normalizedNameMap.set(f, d), a.nextIndex = Math.max(
        a.nextIndex,
        d + 1
      );
    }
    return a;
  }
  /**
   * Gets the total number of collections in the table
   */
  getSize() {
    return this.collections.length;
  }
}
const Le = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, _e = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function ze(e) {
  var a;
  const t = e.toUpperCase();
  return (a = Le[t]) != null ? a : e;
}
function Ve(e) {
  var t;
  return typeof e == "number" ? (t = _e[e]) != null ? t : e.toString() : e;
}
class J {
  constructor() {
    E(this, "variableMap");
    // variableKey -> index
    E(this, "variables");
    // index -> variable data
    E(this, "nextIndex");
    this.variableMap = /* @__PURE__ */ new Map(), this.variables = [], this.nextIndex = 0;
  }
  /**
   * Adds a variable to the table if it doesn't already exist
   * Returns the index of the variable (existing or newly added)
   */
  addVariable(t) {
    const a = t.variableKey;
    if (!a)
      return -1;
    if (this.variableMap.has(a))
      return this.variableMap.get(a);
    const i = this.nextIndex++;
    return this.variableMap.set(a, i), this.variables[i] = t, i;
  }
  /**
   * Gets the index of a variable by its variableKey
   * Returns -1 if not found
   */
  getVariableIndex(t) {
    var a;
    return (a = this.variableMap.get(t)) != null ? a : -1;
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
    for (let a = 0; a < this.variables.length; a++)
      t[String(a)] = this.variables[a];
    return t;
  }
  /**
   * Serializes valuesByMode, removing type and id from VariableAliasSerialized objects
   * Only keeps _varRef since that's sufficient to identify a variable reference
   */
  serializeValuesByMode(t) {
    if (!t)
      return;
    const a = {};
    for (const [i, r] of Object.entries(t))
      typeof r == "object" && r !== null && "_varRef" in r && typeof r._varRef == "number" ? a[i] = {
        _varRef: r._varRef
      } : a[i] = r;
    return a;
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
    for (let a = 0; a < this.variables.length; a++) {
      const i = this.variables[a], r = this.serializeValuesByMode(
        i.valuesByMode
      ), s = N(N({
        variableName: i.variableName,
        variableType: ze(i.variableType)
      }, i._colRef !== void 0 && { _colRef: i._colRef }), r && { valuesByMode: r });
      t[String(a)] = s;
    }
    return t;
  }
  /**
   * Reconstructs a VariableTable from a serialized table object
   * Handles both new format (without variableKey) and legacy format (with variableKey)
   * Expands compressed variable types (numbers) back to strings
   */
  static fromTable(t) {
    const a = new J(), i = Object.entries(t).sort(
      (r, s) => parseInt(r[0], 10) - parseInt(s[0], 10)
    );
    for (const [r, s] of i) {
      const o = parseInt(r, 10), d = Ve(s.variableType), g = M(N({}, s), {
        variableType: d
        // Always a string after expansion
      });
      a.variables[o] = g, a.nextIndex = Math.max(a.nextIndex, o + 1);
    }
    return a;
  }
  /**
   * Gets the total number of variables in the table
   */
  getSize() {
    return this.variables.length;
  }
}
function Ge(e) {
  return {
    _varRef: e
  };
}
function pe(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let Be = 0;
const V = /* @__PURE__ */ new Map();
function Fe(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const t = V.get(e.requestId);
  t && (V.delete(e.requestId), e.error || !e.guid ? t.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : t.resolve(e.guid));
}
function re() {
  return new Promise((e, t) => {
    const a = `guid_${Date.now()}_${++Be}`;
    V.set(a, { resolve: e, reject: t }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: a
    }), setTimeout(() => {
      V.has(a) && (V.delete(a), t(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
const me = {
  "VariableCollectionId:31c5f6bbb52cef5990baeb9894f2c1a6ce32ad8e/2977:6": {
    guid: "1d35ec3e-03d3-4236-a823-62008be5f8bb",
    name: "Tokens"
  },
  "VariableCollectionId:eac91903ad8b04eed20f4bf2f0444ac6069c6da3/2151:0": {
    guid: "f56276ba-eae3-49a0-81c0-b28a17cba12b",
    name: "Theme"
  },
  "VariableCollectionId:eac91903ad8b04eed20f4bf2f0444ac6069c6da3/1908:0": {
    guid: "e3a98c30-3985-4e3c-9aaf-c7d61f50f380",
    name: "Theme"
  },
  "VariableCollectionId:eac91903ad8b04eed20f4bf2f0444ac6069c6da3/2069:864": {
    guid: "bbf8e196-850c-4ebd-ab84-97ae61f308d8",
    name: "Theme"
  },
  "VariableCollectionId:eac91903ad8b04eed20f4bf2f0444ac6069c6da3/1884:373": {
    guid: "a7c3d9f2-4b1e-4a8c-9d5f-3e8a2b7c4d1e",
    name: "Themes"
  },
  "VariableCollectionId:31c5f6bbb52cef5990baeb9894f2c1a6ce32ad8e/2849:188": {
    guid: "b8d4e0a3-5c2f-4b9d-ae6f-4f9b3c8d5e2f",
    name: "Tokens"
  },
  "VariableCollectionId:eac91903ad8b04eed20f4bf2f0444ac6069c6da3/1761:753": {
    guid: "c9e5f1b4-6d3a-4c0e-bf7a-5a0c4d9e6f3a",
    name: "Themes"
  },
  "VariableCollectionId:31c5f6bbb52cef5990baeb9894f2c1a6ce32ad8e/2762:6": {
    guid: "d0f6a2c5-7e4b-4d1f-c08b-6b1d5e0a7f4b",
    name: "Tokens"
  }
};
async function U() {
  return new Promise((e) => setTimeout(e, 0));
}
const c = {
  clear: async () => {
    console.clear(), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: "__CLEAR__"
      }
    }), await U();
  },
  log: async (e) => {
    console.log(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    }), await U();
  },
  warning: async (e) => {
    console.warn(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    }), await U();
  },
  error: async (e) => {
    console.error(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    }), await U();
  }
};
function Ue(e, t) {
  const a = t.modes.find((i) => i.modeId === e);
  return a ? a.name : e;
}
async function ye(e, t, a, i, r = /* @__PURE__ */ new Set()) {
  const s = {};
  for (const [o, d] of Object.entries(e)) {
    const g = Ue(o, i);
    if (d == null) {
      s[g] = d;
      continue;
    }
    if (typeof d == "string" || typeof d == "number" || typeof d == "boolean") {
      s[g] = d;
      continue;
    }
    if (typeof d == "object" && d !== null && "type" in d && d.type === "VARIABLE_ALIAS" && "id" in d) {
      const f = d.id;
      if (r.has(f)) {
        s[g] = {
          type: "VARIABLE_ALIAS",
          id: f
        };
        continue;
      }
      const n = await figma.variables.getVariableByIdAsync(f);
      if (!n) {
        s[g] = {
          type: "VARIABLE_ALIAS",
          id: f
        };
        continue;
      }
      const u = new Set(r);
      u.add(f);
      const p = await figma.variables.getVariableCollectionByIdAsync(
        n.variableCollectionId
      ), l = n.key;
      if (!l) {
        s[g] = {
          type: "VARIABLE_ALIAS",
          id: f
        };
        continue;
      }
      const h = {
        variableName: n.name,
        variableType: n.resolvedType,
        collectionName: p == null ? void 0 : p.name,
        collectionId: n.variableCollectionId,
        variableKey: l,
        id: f,
        isLocal: !n.remote
      };
      if (p) {
        const y = await he(
          p,
          a
        );
        h._colRef = y, n.valuesByMode && (h.valuesByMode = await ye(
          n.valuesByMode,
          t,
          a,
          p,
          // Pass collection for mode ID to name conversion
          u
        ));
      }
      const w = t.addVariable(h);
      s[g] = {
        type: "VARIABLE_ALIAS",
        id: f,
        _varRef: w
      };
    } else
      s[g] = d;
  }
  return s;
}
const j = "recursica:collectionId";
async function je(e) {
  if (e.remote === !0) {
    const a = me[e.id];
    if (!a) {
      const r = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await c.error(r), new Error(r);
    }
    return a.guid;
  } else {
    if (L(e.name)) {
      const r = ie(e.name);
      if (r) {
        const s = e.getSharedPluginData(
          "recursica",
          j
        );
        return (!s || s.trim() === "") && e.setSharedPluginData(
          "recursica",
          j,
          r
        ), r;
      }
    }
    const a = e.getSharedPluginData(
      "recursica",
      j
    );
    if (a && a.trim() !== "")
      return a;
    const i = await re();
    return e.setSharedPluginData("recursica", j, i), i;
  }
}
function Ke(e, t) {
  if (t)
    return;
  const a = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(a))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function he(e, t) {
  const a = !e.remote, i = t.getCollectionIndex(e.id);
  if (i !== -1)
    return i;
  Ke(e.name, a);
  const r = await je(e), s = e.modes.map((f) => f.name), o = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: a,
    modes: s,
    collectionGuid: r
  }, d = t.addCollection(o), g = a ? "local" : "remote";
  return await c.log(
    `  Added ${g} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), d;
}
async function se(e, t, a) {
  if (!e || typeof e != "object" || e.type !== "VARIABLE_ALIAS")
    return null;
  try {
    const i = await figma.variables.getVariableByIdAsync(e.id);
    if (!i)
      return console.log("Could not resolve variable alias:", e.id), null;
    const r = await figma.variables.getVariableCollectionByIdAsync(
      i.variableCollectionId
    );
    if (!r)
      return console.log("Could not resolve collection for variable:", e.id), null;
    const s = i.key;
    if (!s)
      return console.log("Variable missing key:", e.id), null;
    const o = await he(
      r,
      a
    ), d = {
      variableName: i.name,
      variableType: i.resolvedType,
      _colRef: o,
      // Reference to collection table (v2.4.0+)
      variableKey: s,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    i.valuesByMode && (d.valuesByMode = await ye(
      i.valuesByMode,
      t,
      a,
      r,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const g = t.addVariable(d);
    return Ge(g);
  } catch (i) {
    const r = i instanceof Error ? i.message : String(i);
    throw console.error("Could not resolve variable alias:", e.id, i), new Error(
      `Failed to resolve variable alias ${e.id}: ${r}`
    );
  }
}
async function W(e, t, a) {
  if (!e || typeof e != "object") return e;
  const i = {};
  for (const r in e)
    if (Object.prototype.hasOwnProperty.call(e, r)) {
      const s = e[r];
      if (s && typeof s == "object" && !Array.isArray(s))
        if (s.type === "VARIABLE_ALIAS") {
          const o = await se(
            s,
            t,
            a
          );
          o && (i[r] = o);
        } else
          i[r] = await W(
            s,
            t,
            a
          );
      else Array.isArray(s) ? i[r] = await Promise.all(
        s.map(async (o) => (o == null ? void 0 : o.type) === "VARIABLE_ALIAS" ? await se(
          o,
          t,
          a
        ) || o : o && typeof o == "object" ? await W(
          o,
          t,
          a
        ) : o)
      ) : i[r] = s;
    }
  return i;
}
async function qe(e, t, a) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const r = {};
      for (const s in i)
        Object.prototype.hasOwnProperty.call(i, s) && (s === "boundVariables" ? r[s] = await W(
          i[s],
          t,
          a
        ) : r[s] = i[s]);
      return r;
    })
  );
}
async function We(e, t) {
  const a = {}, i = /* @__PURE__ */ new Set();
  if (e.type && (a.type = e.type, i.add("type")), e.id && (a.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (a.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (a.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (a.y = e.y, i.add("y")), e.width !== void 0 && (a.width = e.width, i.add("width")), e.height !== void 0 && (a.height = e.height, i.add("height")), e.visible !== void 0 && A(e.visible, T.visible) && (a.visible = e.visible, i.add("visible")), e.locked !== void 0 && A(e.locked, T.locked) && (a.locked = e.locked, i.add("locked")), e.opacity !== void 0 && A(e.opacity, T.opacity) && (a.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && A(e.rotation, T.rotation) && (a.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && A(e.blendMode, T.blendMode) && (a.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && A(e.effects, T.effects) && (a.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const r = await qe(
      e.fills,
      t.variableTable,
      t.collectionTable
    );
    A(r, T.fills) && (a.fills = r), i.add("fills");
  }
  if (e.strokes !== void 0 && A(e.strokes, T.strokes) && (a.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && A(e.strokeWeight, T.strokeWeight) && (a.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && A(e.strokeAlign, T.strokeAlign) && (a.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const r = await W(
      e.boundVariables,
      t.variableTable,
      t.collectionTable
    );
    Object.keys(r).length > 0 && (a.boundVariables = r), i.add("boundVariables");
  }
  return a;
}
async function ce(e, t) {
  const a = {}, i = /* @__PURE__ */ new Set();
  return e.layoutMode !== void 0 && A(e.layoutMode, I.layoutMode) && (a.layoutMode = e.layoutMode, i.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && A(
    e.primaryAxisSizingMode,
    I.primaryAxisSizingMode
  ) && (a.primaryAxisSizingMode = e.primaryAxisSizingMode, i.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && A(
    e.counterAxisSizingMode,
    I.counterAxisSizingMode
  ) && (a.counterAxisSizingMode = e.counterAxisSizingMode, i.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && A(
    e.primaryAxisAlignItems,
    I.primaryAxisAlignItems
  ) && (a.primaryAxisAlignItems = e.primaryAxisAlignItems, i.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && A(
    e.counterAxisAlignItems,
    I.counterAxisAlignItems
  ) && (a.counterAxisAlignItems = e.counterAxisAlignItems, i.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && A(e.paddingLeft, I.paddingLeft) && (a.paddingLeft = e.paddingLeft, i.add("paddingLeft")), e.paddingRight !== void 0 && A(e.paddingRight, I.paddingRight) && (a.paddingRight = e.paddingRight, i.add("paddingRight")), e.paddingTop !== void 0 && A(e.paddingTop, I.paddingTop) && (a.paddingTop = e.paddingTop, i.add("paddingTop")), e.paddingBottom !== void 0 && A(e.paddingBottom, I.paddingBottom) && (a.paddingBottom = e.paddingBottom, i.add("paddingBottom")), e.itemSpacing !== void 0 && A(e.itemSpacing, I.itemSpacing) && (a.itemSpacing = e.itemSpacing, i.add("itemSpacing")), e.cornerRadius !== void 0 && A(e.cornerRadius, I.cornerRadius) && (a.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.clipsContent !== void 0 && A(e.clipsContent, I.clipsContent) && (a.clipsContent = e.clipsContent, i.add("clipsContent")), e.layoutWrap !== void 0 && A(e.layoutWrap, I.layoutWrap) && (a.layoutWrap = e.layoutWrap, i.add("layoutWrap")), e.layoutGrow !== void 0 && A(e.layoutGrow, I.layoutGrow) && (a.layoutGrow = e.layoutGrow, i.add("layoutGrow")), a;
}
async function He(e, t) {
  const a = {}, i = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (a.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (a.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (a.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && A(
    e.textAlignHorizontal,
    k.textAlignHorizontal
  ) && (a.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && A(
    e.textAlignVertical,
    k.textAlignVertical
  ) && (a.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && A(e.letterSpacing, k.letterSpacing) && (a.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && A(e.lineHeight, k.lineHeight) && (a.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && A(e.textCase, k.textCase) && (a.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && A(e.textDecoration, k.textDecoration) && (a.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && A(e.textAutoResize, k.textAutoResize) && (a.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && A(
    e.paragraphSpacing,
    k.paragraphSpacing
  ) && (a.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && A(e.paragraphIndent, k.paragraphIndent) && (a.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && A(e.listOptions, k.listOptions) && (a.listOptions = e.listOptions, i.add("listOptions")), a;
}
async function Je(e, t) {
  const a = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && A(e.fillGeometry, _.fillGeometry) && (a.fillGeometry = e.fillGeometry, i.add("fillGeometry")), e.strokeGeometry !== void 0 && A(e.strokeGeometry, _.strokeGeometry) && (a.strokeGeometry = e.strokeGeometry, i.add("strokeGeometry")), e.strokeCap !== void 0 && A(e.strokeCap, _.strokeCap) && (a.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && A(e.strokeJoin, _.strokeJoin) && (a.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && A(e.dashPattern, _.dashPattern) && (a.dashPattern = e.dashPattern, i.add("dashPattern")), a;
}
async function De(e, t) {
  const a = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && A(e.cornerRadius, fe.cornerRadius) && (a.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (a.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (a.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (a.pointCount = e.pointCount, i.add("pointCount")), a;
}
const Ye = "RecursicaPublishedMetadata";
function le(e) {
  let t = e;
  for (; t; ) {
    if (t.type === "PAGE")
      return t;
    try {
      t = t.parent;
    } catch (a) {
      return null;
    }
  }
  return null;
}
function Xe(e) {
  try {
    const t = e.getSharedPluginData(
      "recursica",
      Ye
    );
    if (!t || t.trim() === "")
      return null;
    const a = JSON.parse(t);
    return {
      id: a.id,
      version: a.version
    };
  } catch (t) {
    return null;
  }
}
async function Qe(e, t) {
  const a = {}, i = /* @__PURE__ */ new Set();
  if (a._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function")
    try {
      const r = await e.getMainComponentAsync();
      if (!r)
        return a;
      const s = e.name || "(unnamed)", o = r.name || "(unnamed)", d = r.remote === !0, g = le(e), f = le(r);
      let n;
      d ? n = "remote" : f && g && f.id === g.id ? n = "internal" : (f && g && (f.id, g.id), n = "normal");
      let u, p;
      try {
        e.variantProperties && (u = e.variantProperties), e.componentProperties && (p = e.componentProperties);
      } catch (m) {
      }
      let l, h;
      try {
        let m = r.parent;
        const b = [];
        let v = 0;
        const C = 20;
        for (; m && v < C; )
          try {
            const S = m.type, z = m.name;
            if (S === "COMPONENT_SET" && !h && (h = z), S === "PAGE")
              break;
            const x = z || "";
            b.unshift(x), m = m.parent, v++;
          } catch (S) {
            break;
          }
        l = b;
      } catch (m) {
      }
      const w = N(N(N(N({
        instanceType: n,
        componentName: o
      }, h && { componentSetName: h }), u && { variantProperties: u }), p && { componentProperties: p }), n === "normal" ? { path: l || [] } : l && l.length > 0 && {
        path: l
      });
      if (n === "internal")
        w.componentNodeId = r.id, await c.log(
          `  Found INSTANCE: "${s}" -> INTERNAL component "${o}" (ID: ${r.id.substring(0, 8)}...)`
        );
      else if (n === "normal") {
        if (f) {
          w.componentPageName = f.name;
          const b = Xe(f);
          b != null && b.id && b.version !== void 0 && (w.componentGuid = b.id, w.componentVersion = b.version);
        }
        l === void 0 && console.warn(
          `Failed to build path for normal instance "${s}" -> component "${o}". Path is required for resolution.`
        );
        const m = l && l.length > 0 ? ` at path [${l.join(" → ")}]` : " at page root";
        await c.log(
          `  Found INSTANCE: "${s}" -> NORMAL component "${o}" (ID: ${r.id.substring(0, 8)}...)${m}`
        );
      } else if (n === "remote") {
        let m, b;
        try {
          if (typeof r.getPublishStatusAsync == "function")
            try {
              const v = await r.getPublishStatusAsync();
              v && typeof v == "object" && (v.libraryName && (m = v.libraryName), v.libraryKey && (b = v.libraryKey));
            } catch (v) {
            }
          try {
            const v = figma.teamLibrary;
            if (typeof (v == null ? void 0 : v.getAvailableLibraryComponentSetsAsync) == "function") {
              const C = await v.getAvailableLibraryComponentSetsAsync();
              if (C && Array.isArray(C)) {
                for (const S of C)
                  if (S.key === r.key || S.name === r.name) {
                    S.libraryName && (m = S.libraryName), S.libraryKey && (b = S.libraryKey);
                    break;
                  }
              }
            }
          } catch (v) {
          }
          try {
            w.structure = await X(
              r,
              /* @__PURE__ */ new WeakSet(),
              t
            );
          } catch (v) {
            console.warn(
              `Failed to extract structure for remote component "${o}":`,
              v
            );
          }
        } catch (v) {
          console.warn(
            `Error getting library info for remote component "${o}":`,
            v
          );
        }
        m && (w.remoteLibraryName = m), b && (w.remoteLibraryKey = b), await c.log(
          `  Found INSTANCE: "${s}" -> REMOTE component "${o}" (ID: ${r.id.substring(0, 8)}...)`
        );
      }
      const y = t.instanceTable.addInstance(w);
      a._instanceRef = y, i.add("_instanceRef");
    } catch (r) {
      console.log(
        "Error getting main component for " + (e.name || "unknown") + ":",
        r
      );
    }
  return a;
}
class D {
  constructor() {
    E(this, "instanceMap");
    // unique key -> index
    E(this, "instances");
    // index -> instance data
    E(this, "nextIndex");
    this.instanceMap = /* @__PURE__ */ new Map(), this.instances = [], this.nextIndex = 0;
  }
  /**
   * Generates a unique key for an instance based on its type
   */
  generateKey(t) {
    return t.instanceType === "internal" && t.componentNodeId ? `internal:${t.componentNodeId}` : t.instanceType === "normal" && t.componentGuid && t.componentVersion !== void 0 ? `normal:${t.componentGuid}:${t.componentVersion}` : t.instanceType === "remote" && t.remoteLibraryKey ? `remote:${t.remoteLibraryKey}:${t.componentName}` : `${t.instanceType}:${t.componentName}:COMPONENT`;
  }
  /**
   * Adds an instance to the table if it doesn't already exist
   * Returns the index of the instance (existing or newly added)
   */
  addInstance(t) {
    const a = this.generateKey(t);
    if (this.instanceMap.has(a))
      return this.instanceMap.get(a);
    const i = this.nextIndex++;
    return this.instanceMap.set(a, i), this.instances[i] = t, i;
  }
  /**
   * Gets the index of an instance by its unique key
   * Returns -1 if not found
   */
  getInstanceIndex(t) {
    var i;
    const a = this.generateKey(t);
    return (i = this.instanceMap.get(a)) != null ? i : -1;
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
    for (let a = 0; a < this.instances.length; a++)
      t[String(a)] = this.instances[a];
    return t;
  }
  /**
   * Reconstructs an InstanceTable from a serialized table object
   */
  static fromTable(t) {
    const a = new D(), i = Object.entries(t).sort(
      (r, s) => parseInt(r[0], 10) - parseInt(s[0], 10)
    );
    for (const [r, s] of i) {
      const o = parseInt(r, 10), d = a.generateKey(s);
      a.instanceMap.set(d, o), a.instances[o] = s, a.nextIndex = Math.max(a.nextIndex, o + 1);
    }
    return a;
  }
  /**
   * Gets the total number of instances in the table
   */
  getSize() {
    return this.instances.length;
  }
}
const be = {
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
function Ze() {
  const e = {};
  for (const [t, a] of Object.entries(be))
    e[a] = t;
  return e;
}
function de(e) {
  var t;
  return (t = be[e]) != null ? t : e;
}
function et(e) {
  var t;
  return typeof e == "number" ? (t = Ze()[e]) != null ? t : e.toString() : e;
}
const we = {
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
}, ee = {};
for (const [e, t] of Object.entries(we))
  ee[t] = e;
class Y {
  constructor() {
    E(this, "shortToLong");
    E(this, "longToShort");
    this.shortToLong = N({}, ee), this.longToShort = N({}, we);
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
      return t.map((a) => this.compressObject(a));
    if (typeof t == "object") {
      const a = {}, i = /* @__PURE__ */ new Set();
      for (const r of Object.keys(t))
        i.add(r);
      for (const [r, s] of Object.entries(t)) {
        const o = this.getShortName(r);
        if (o !== r && !i.has(o)) {
          let d = this.compressObject(s);
          o === "type" && typeof d == "string" && (d = de(d)), a[o] = d;
        } else {
          let d = this.compressObject(s);
          r === "type" && typeof d == "string" && (d = de(d)), a[r] = d;
        }
      }
      return a;
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
      return t.map((a) => this.expandObject(a));
    if (typeof t == "object") {
      const a = {};
      for (const [i, r] of Object.entries(t)) {
        const s = this.getLongName(i);
        let o = this.expandObject(r);
        (s === "type" || i === "type") && (typeof o == "number" || typeof o == "string") && (o = et(o)), a[s] = o;
      }
      return a;
    }
    return t;
  }
  /**
   * Gets the serialized string table for JSON export
   * Returns the mapping of short -> long names
   */
  getSerializedTable() {
    return N({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(t) {
    const a = new Y();
    a.shortToLong = N(N({}, ee), t), a.longToShort = {};
    for (const [i, r] of Object.entries(
      a.shortToLong
    ))
      a.longToShort[r] = i;
    return a;
  }
}
function tt(e, t) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const a = {};
  e.metadata && (a.metadata = e.metadata);
  for (const [i, r] of Object.entries(e))
    i !== "metadata" && (a[i] = t.compressObject(r));
  return a;
}
function at(e, t) {
  return t.expandObject(e);
}
function ne(e) {
  let t = 1;
  return e.children && e.children.length > 0 && e.children.forEach((a) => {
    t += ne(a);
  }), t;
}
async function X(e, t = /* @__PURE__ */ new WeakSet(), a = {}) {
  var u, p, l, h, w;
  if (!e || typeof e != "object")
    return e;
  const i = (u = a.maxNodes) != null ? u : 1e4, r = (p = a.nodeCount) != null ? p : 0;
  if (r >= i)
    return await c.warning(
      `Maximum node count (${i}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: r
    };
  const s = {
    visited: (l = a.visited) != null ? l : /* @__PURE__ */ new WeakSet(),
    depth: (h = a.depth) != null ? h : 0,
    maxDepth: (w = a.maxDepth) != null ? w : 100,
    nodeCount: r + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: a.variableTable,
    collectionTable: a.collectionTable,
    instanceTable: a.instanceTable
  };
  if (t.has(e))
    return "[Circular Reference]";
  t.add(e), s.visited = t;
  const o = {}, d = await We(e, s);
  Object.assign(o, d);
  const g = e.type;
  if (g)
    switch (g) {
      case "FRAME":
      case "COMPONENT": {
        const y = await ce(e);
        Object.assign(o, y);
        break;
      }
      case "INSTANCE": {
        const y = await Qe(
          e,
          s
        );
        Object.assign(o, y);
        const m = await ce(
          e
        );
        Object.assign(o, m);
        break;
      }
      case "TEXT": {
        const y = await He(e);
        Object.assign(o, y);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const y = await Je(e);
        Object.assign(o, y);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const y = await De(e);
        Object.assign(o, y);
        break;
      }
      default:
        s.unhandledKeys.add("_unknownType");
        break;
    }
  const f = Object.getOwnPropertyNames(e), n = /* @__PURE__ */ new Set([
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
    "variableConsumptionMap",
    "resolvedVariableModes",
    "inferredVariables",
    "constructor",
    "toString",
    "valueOf"
  ]);
  (g === "FRAME" || g === "COMPONENT" || g === "INSTANCE") && (n.add("layoutMode"), n.add("primaryAxisSizingMode"), n.add("counterAxisSizingMode"), n.add("primaryAxisAlignItems"), n.add("counterAxisAlignItems"), n.add("paddingLeft"), n.add("paddingRight"), n.add("paddingTop"), n.add("paddingBottom"), n.add("itemSpacing"), n.add("cornerRadius"), n.add("clipsContent"), n.add("layoutWrap"), n.add("layoutGrow")), g === "TEXT" && (n.add("characters"), n.add("fontName"), n.add("fontSize"), n.add("textAlignHorizontal"), n.add("textAlignVertical"), n.add("letterSpacing"), n.add("lineHeight"), n.add("textCase"), n.add("textDecoration"), n.add("textAutoResize"), n.add("paragraphSpacing"), n.add("paragraphIndent"), n.add("listOptions")), (g === "VECTOR" || g === "LINE") && (n.add("fillGeometry"), n.add("strokeGeometry")), (g === "RECTANGLE" || g === "ELLIPSE" || g === "STAR" || g === "POLYGON") && (n.add("pointCount"), n.add("innerRadius"), n.add("arcData")), g === "INSTANCE" && (n.add("mainComponent"), n.add("componentProperties"));
  for (const y of f)
    typeof e[y] != "function" && (n.has(y) || s.unhandledKeys.add(y));
  if (s.unhandledKeys.size > 0 && (o._unhandledKeys = Array.from(s.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const y = s.maxDepth;
    if (s.depth >= y)
      o.children = {
        _truncated: !0,
        _reason: `Maximum depth (${y}) reached`,
        _count: e.children.length
      };
    else if (s.nodeCount >= i)
      o.children = {
        _truncated: !0,
        _reason: `Maximum node count (${i}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const m = M(N({}, s), {
        depth: s.depth + 1
      }), b = [];
      let v = !1;
      for (const C of e.children) {
        if (m.nodeCount >= i) {
          o.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: b.length,
            _total: e.children.length,
            children: b
          }, v = !0;
          break;
        }
        const S = await X(C, t, m);
        b.push(S), m.nodeCount && (s.nodeCount = m.nodeCount);
      }
      v || (o.children = b);
    }
  }
  return o;
}
async function it(e) {
  await c.clear(), await c.log("=== Starting Page Export ===");
  try {
    const t = e.pageIndex;
    if (t === void 0 || typeof t != "number")
      return await c.error(
        "Invalid page selection: pageIndex is undefined or not a number"
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    await c.log("Loading all pages..."), await figma.loadAllPagesAsync();
    const a = figma.root.children;
    if (await c.log(`Loaded ${a.length} page(s)`), t < 0 || t >= a.length)
      return await c.error(
        `Invalid page index: ${t} (valid range: 0-${a.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const i = a[t];
    await c.log(
      `Selected page: "${i.name}" (index: ${t})`
    ), await c.log(
      "Initializing variable, collection, and instance tables..."
    );
    const r = new J(), s = new H(), o = new D();
    await c.log("Fetching team library variable collections...");
    let d = [];
    try {
      if (d = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((R) => ({
        libraryName: R.libraryName,
        key: R.key,
        name: R.name
      })), await c.log(
        `Found ${d.length} library collection(s) in team library`
      ), d.length > 0)
        for (const R of d)
          await c.log(`  - ${R.name} (from ${R.libraryName})`);
    } catch (x) {
      await c.warning(
        `Could not get library variable collections: ${x instanceof Error ? x.message : String(x)}`
      );
    }
    await c.log("Extracting node data from page..."), await c.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await c.log(
      "Collections will be discovered as variables are processed:"
    );
    const g = await X(
      i,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: r,
        collectionTable: s,
        instanceTable: o
      }
    );
    await c.log("Node extraction finished");
    const f = ne(g), n = r.getSize(), u = s.getSize(), p = o.getSize();
    if (await c.log("Extraction complete:"), await c.log(`  - Total nodes: ${f}`), await c.log(`  - Unique variables: ${n}`), await c.log(`  - Unique collections: ${u}`), await c.log(`  - Unique instances: ${p}`), u > 0) {
      await c.log("Collections found:");
      const x = s.getTable();
      for (const [R, F] of Object.values(x).entries()) {
        const Ie = F.collectionGuid ? ` (GUID: ${F.collectionGuid.substring(0, 8)}...)` : "";
        await c.log(
          `  ${R}: ${F.collectionName}${Ie} - ${F.modes.length} mode(s)`
        );
      }
    }
    await c.log("Creating string table...");
    const l = new Y();
    await c.log("Getting page metadata...");
    const h = i.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let w = "", y = 0;
    if (h)
      try {
        const x = JSON.parse(h);
        w = x.id || "", y = x.version || 0;
      } catch (x) {
        await c.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!w) {
      await c.log("Generating new GUID for page..."), w = await re();
      const x = {
        _ver: 1,
        id: w,
        name: i.name,
        version: y,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      i.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(x)
      );
    }
    await c.log("Creating export data structure...");
    const m = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "2.7.0",
        // Updated version for string table compression
        figmaApiVersion: figma.apiVersion,
        guid: w,
        version: y,
        name: i.name,
        pluginVersion: "1.0.0"
      },
      stringTable: l.getSerializedTable(),
      collections: s.getSerializedTable(),
      variables: r.getSerializedTable(),
      instances: o.getSerializedTable(),
      libraries: d,
      // Libraries might not need compression, but could be added later
      pageData: g
    };
    await c.log("Compressing JSON data...");
    const b = tt(m, l);
    await c.log("Serializing to JSON...");
    const v = JSON.stringify(b, null, 2), C = (v.length / 1024).toFixed(2), S = i.name.replace(/[^a-z0-9]/gi, "_") + "_export.json";
    return await c.log(`JSON serialization complete: ${C} KB`), await c.log(`Export file: ${S}`), await c.log("=== Export Complete ==="), {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: S,
        jsonData: v,
        pageName: i.name,
        additionalPages: []
        // Will be populated when publishing referenced component pages
      }
    };
  } catch (t) {
    return await c.error(
      `Export failed: ${t instanceof Error ? t.message : "Unknown error occurred"}`
    ), t instanceof Error && t.stack && await c.error(`Stack trace: ${t.stack}`), console.error("Error exporting page:", t), {
      type: "exportPage",
      success: !1,
      error: !0,
      message: t instanceof Error ? t.message : "Unknown error occurred",
      data: {}
    };
  }
}
const K = /* @__PURE__ */ new Map();
let rt = 0;
function nt() {
  return `prompt_${Date.now()}_${++rt}`;
}
const Ae = {
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
    var d;
    const a = typeof t == "number" ? { timeoutMs: t } : t, i = (d = a == null ? void 0 : a.timeoutMs) != null ? d : 3e5, r = a == null ? void 0 : a.okLabel, s = a == null ? void 0 : a.cancelLabel, o = nt();
    return new Promise((g, f) => {
      const n = i === -1 ? null : setTimeout(() => {
        K.delete(o), f(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      K.set(o, {
        resolve: g,
        reject: f,
        timeout: n
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: N(N({
          message: e,
          requestId: o
        }, r && { okLabel: r }), s && { cancelLabel: s })
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
    const { requestId: t, action: a } = e, i = K.get(t);
    if (!i) {
      console.warn(
        `Received response for unknown prompt request: ${t}`
      );
      return;
    }
    i.timeout && clearTimeout(i.timeout), K.delete(t), a === "ok" ? i.resolve() : i.reject(new Error("User cancelled"));
  }
};
async function G(e, t) {
  for (const a of t)
    e.modes.find((r) => r.name === a) || e.addMode(a);
}
const P = "recursica:collectionId";
async function q(e) {
  if (e.remote === !0) {
    const a = me[e.id];
    if (!a) {
      const r = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await c.error(r), new Error(r);
    }
    return a.guid;
  } else {
    const a = e.getSharedPluginData(
      "recursica",
      P
    );
    if (a && a.trim() !== "")
      return a;
    const i = await re();
    return e.setSharedPluginData("recursica", P, i), i;
  }
}
function ot(e, t) {
  const a = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(a))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function st(e) {
  let t;
  const a = e.collectionName.trim().toLowerCase(), i = ["token", "tokens", "theme", "themes"], r = e.isLocal;
  if (r === !1 || r === void 0 && i.includes(a))
    try {
      const d = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((g) => g.name.trim().toLowerCase() === a);
      if (d) {
        ot(e.collectionName, !1);
        const g = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          d.key
        );
        if (g.length > 0) {
          const f = await figma.variables.importVariableByKeyAsync(g[0].key), n = await figma.variables.getVariableCollectionByIdAsync(
            f.variableCollectionId
          );
          if (n) {
            if (t = n, e.collectionGuid) {
              const u = t.getSharedPluginData(
                "recursica",
                P
              );
              (!u || u.trim() === "") && t.setSharedPluginData(
                "recursica",
                P,
                e.collectionGuid
              );
            } else
              await q(t);
            return await G(t, e.modes), { collection: t };
          }
        }
      }
    } catch (o) {
      if (r === !1)
        throw new Error(
          `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
        );
      console.log("Could not import external collection, trying local:", o);
    }
  if (r !== !1) {
    const o = await figma.variables.getLocalVariableCollectionsAsync();
    let d;
    if (e.collectionGuid && (d = o.find((g) => g.getSharedPluginData("recursica", P) === e.collectionGuid)), d || (d = o.find(
      (g) => g.name === e.collectionName
    )), d)
      if (t = d, e.collectionGuid) {
        const g = t.getSharedPluginData(
          "recursica",
          P
        );
        (!g || g.trim() === "") && t.setSharedPluginData(
          "recursica",
          P,
          e.collectionGuid
        );
      } else
        await q(t);
    else
      t = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? t.setSharedPluginData(
        "recursica",
        P,
        e.collectionGuid
      ) : await q(t);
  } else {
    const o = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), d = e.collectionName.trim().toLowerCase(), g = o.find((p) => p.name.trim().toLowerCase() === d);
    if (!g)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const f = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      g.key
    );
    if (f.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const n = await figma.variables.importVariableByKeyAsync(
      f[0].key
    ), u = await figma.variables.getVariableCollectionByIdAsync(
      n.variableCollectionId
    );
    if (!u)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (t = u, e.collectionGuid) {
      const p = t.getSharedPluginData(
        "recursica",
        P
      );
      (!p || p.trim() === "") && t.setSharedPluginData(
        "recursica",
        P,
        e.collectionGuid
      );
    } else
      q(t);
  }
  return await G(t, e.modes), { collection: t };
}
async function ve(e, t) {
  for (const a of e.variableIds)
    try {
      const i = await figma.variables.getVariableByIdAsync(a);
      if (i && i.name === t)
        return i;
    } catch (i) {
      continue;
    }
  return null;
}
async function ct(e, t, a, i, r) {
  for (const [s, o] of Object.entries(t)) {
    const d = i.modes.find((f) => f.name === s);
    if (!d) {
      console.warn(
        `Mode "${s}" not found in collection "${i.name}" for variable "${e.name}". Skipping.`
      );
      continue;
    }
    const g = d.modeId;
    try {
      if (o == null)
        continue;
      if (typeof o == "string" || typeof o == "number" || typeof o == "boolean") {
        e.setValueForMode(g, o);
        continue;
      }
      if (typeof o == "object" && o !== null && "_varRef" in o && typeof o._varRef == "number") {
        const f = o;
        let n = null;
        const u = a.getVariableByIndex(
          f._varRef
        );
        if (u) {
          let p = null;
          if (r && u._colRef !== void 0) {
            const l = r.getCollectionByIndex(
              u._colRef
            );
            l && (p = (await st(l)).collection);
          }
          p && (n = await ve(
            p,
            u.variableName
          ));
        }
        if (n) {
          const p = {
            type: "VARIABLE_ALIAS",
            id: n.id
          };
          e.setValueForMode(g, p);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${s}" in variable "${e.name}". Variable reference index: ${f._varRef}`
          );
      }
    } catch (f) {
      console.warn(
        `Error setting value for mode "${s}" in variable "${e.name}":`,
        f
      );
    }
  }
}
async function ue(e, t, a, i) {
  const r = figma.variables.createVariable(
    e.variableName,
    t,
    e.variableType
  );
  return e.valuesByMode && await ct(
    r,
    e.valuesByMode,
    a,
    t,
    // Pass collection to look up modes by name
    i
  ), r;
}
async function Ne(e, t, a, i) {
  if (!(!t || typeof t != "object"))
    try {
      const r = e[a];
      if (!r || !Array.isArray(r))
        return;
      const s = t[a];
      if (Array.isArray(s))
        for (let o = 0; o < s.length && o < r.length; o++) {
          const d = s[o];
          if (d && typeof d == "object") {
            r[o].boundVariables || (r[o].boundVariables = {});
            for (const [g, f] of Object.entries(
              d
            ))
              if (pe(f)) {
                const n = f._varRef;
                if (n !== void 0) {
                  const u = i.get(String(n));
                  u && (r[o].boundVariables[g] = {
                    type: "VARIABLE_ALIAS",
                    id: u.id
                  });
                }
              }
          }
        }
    } catch (r) {
      console.log(`Error restoring bound variables for ${a}:`, r);
    }
}
function lt(e, t) {
  const a = Oe(t);
  if (e.visible === void 0 && (e.visible = a.visible), e.locked === void 0 && (e.locked = a.locked), e.opacity === void 0 && (e.opacity = a.opacity), e.rotation === void 0 && (e.rotation = a.rotation), e.blendMode === void 0 && (e.blendMode = a.blendMode), t === "FRAME" || t === "COMPONENT" || t === "INSTANCE") {
    const i = I;
    e.layoutMode === void 0 && (e.layoutMode = i.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = i.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = i.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = i.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = i.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = i.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = i.paddingRight), e.paddingTop === void 0 && (e.paddingTop = i.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = i.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = i.itemSpacing);
  }
  if (t === "TEXT") {
    const i = k;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = i.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = i.textAlignVertical), e.textCase === void 0 && (e.textCase = i.textCase), e.textDecoration === void 0 && (e.textDecoration = i.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = i.textAutoResize);
  }
}
async function B(e, t, a = null, i = null, r = null, s = null, o = null, d = !1, g = null) {
  var f;
  try {
    let n;
    switch (e.type) {
      case "FRAME":
        n = figma.createFrame();
        break;
      case "RECTANGLE":
        n = figma.createRectangle();
        break;
      case "ELLIPSE":
        n = figma.createEllipse();
        break;
      case "TEXT":
        n = figma.createText();
        break;
      case "VECTOR":
        n = figma.createVector();
        break;
      case "STAR":
        n = figma.createStar();
        break;
      case "LINE":
        n = figma.createLine();
        break;
      case "COMPONENT":
        n = figma.createComponent();
        break;
      case "INSTANCE":
        if (d)
          n = figma.createFrame(), e.name && (n.name = e.name);
        else if (e._instanceRef !== void 0 && r && o)
          try {
            const u = r.getInstanceByIndex(
              e._instanceRef
            );
            if (u && u.instanceType === "internal")
              if (u.componentNodeId) {
                const p = o.get(
                  u.componentNodeId
                );
                if (p && p.type === "COMPONENT") {
                  if (n = p.createInstance(), await c.log(
                    `✓ Created internal instance "${e.name}" from component "${u.componentName}"`
                  ), u.variantProperties && Object.keys(u.variantProperties).length > 0)
                    try {
                      n.setProperties(u.variantProperties);
                    } catch (l) {
                      await c.warning(
                        `Error setting variant properties for instance "${e.name}": ${l}`
                      );
                    }
                  if (u.componentProperties && Object.keys(u.componentProperties).length > 0)
                    try {
                      for (const [l, h] of Object.entries(
                        u.componentProperties
                      ))
                        try {
                          n.setProperties({ [l]: h });
                        } catch (w) {
                          await c.warning(
                            `Error setting component property "${l}" for instance "${e.name}": ${w}`
                          );
                        }
                    } catch (l) {
                      await c.warning(
                        `Error setting component properties for instance "${e.name}": ${l}`
                      );
                    }
                } else
                  await c.warning(
                    `Component not found for internal instance "${e.name}" (ID: ${u.componentNodeId.substring(0, 8)}...), creating frame fallback`
                  ), n = figma.createFrame();
              } else
                await c.warning(
                  `Internal instance "${e.name}" missing componentNodeId, creating frame fallback`
                ), n = figma.createFrame();
            else if (u && u.instanceType === "remote")
              if (g) {
                const p = g.get(
                  e._instanceRef
                );
                if (p) {
                  if (n = p.createInstance(), await c.log(
                    `✓ Created remote instance "${e.name}" from component "${u.componentName}" on REMOTES page`
                  ), u.variantProperties && Object.keys(u.variantProperties).length > 0)
                    try {
                      n.setProperties(u.variantProperties);
                    } catch (l) {
                      await c.warning(
                        `Error setting variant properties for remote instance "${e.name}": ${l}`
                      );
                    }
                  if (u.componentProperties && Object.keys(u.componentProperties).length > 0)
                    try {
                      for (const [l, h] of Object.entries(
                        u.componentProperties
                      ))
                        try {
                          n.setProperties({ [l]: h });
                        } catch (w) {
                          await c.warning(
                            `Error setting component property "${l}" for remote instance "${e.name}": ${w}`
                          );
                        }
                    } catch (l) {
                      await c.warning(
                        `Error setting component properties for remote instance "${e.name}": ${l}`
                      );
                    }
                } else
                  await c.warning(
                    `Remote component not found for instance "${e.name}" (index ${e._instanceRef}), creating frame fallback`
                  ), n = figma.createFrame();
              } else
                await c.warning(
                  `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap), creating frame fallback`
                ), n = figma.createFrame();
            else
              await c.log(
                `Instance "${e.name}" is not internal (type: ${(u == null ? void 0 : u.instanceType) || "unknown"}), creating frame fallback`
              ), n = figma.createFrame();
          } catch (u) {
            await c.warning(
              `Error resolving instance "${e.name}": ${u}, creating frame fallback`
            ), n = figma.createFrame();
          }
        else
          await c.log(
            `Instance "${e.name}" missing _instanceRef or instance table, creating frame fallback`
          ), n = figma.createFrame();
        break;
      case "GROUP":
        n = figma.createFrame();
        break;
      case "BOOLEAN_OPERATION":
        console.log(
          "Boolean operation found: " + e.name + ", creating frame fallback"
        ), n = figma.createFrame();
        break;
      case "POLYGON":
        n = figma.createPolygon();
        break;
      default:
        console.log(
          "Unsupported node type: " + e.type + ", creating frame instead"
        ), n = figma.createFrame();
        break;
    }
    if (!n)
      return null;
    if (e.id && o && o.set(e.id, n), lt(n, e.type || "FRAME"), e.name !== void 0 && (n.name = e.name || "Unnamed Node"), e.x !== void 0 && (n.x = e.x), e.y !== void 0 && (n.y = e.y), e.width !== void 0 && e.height !== void 0 && n.resize(e.width, e.height), e.visible !== void 0 && (n.visible = e.visible), e.locked !== void 0 && (n.locked = e.locked), e.opacity !== void 0 && (n.opacity = e.opacity), e.rotation !== void 0 && (n.rotation = e.rotation), e.blendMode !== void 0 && (n.blendMode = e.blendMode), e.type !== "INSTANCE" && e.fills !== void 0)
      try {
        let u = e.fills;
        Array.isArray(u) && (u = u.map((p) => {
          if (p && typeof p == "object") {
            const l = N({}, p);
            return delete l.boundVariables, l;
          }
          return p;
        })), n.fills = u, (f = e.boundVariables) != null && f.fills && s && await Ne(
          n,
          e.boundVariables,
          "fills",
          s
        );
      } catch (u) {
        console.log("Error setting fills:", u);
      }
    if (e.strokes !== void 0 && e.strokes.length > 0)
      try {
        n.strokes = e.strokes;
      } catch (u) {
        console.log("Error setting strokes:", u);
      }
    if (e.strokeWeight !== void 0 && (n.strokeWeight = e.strokeWeight), e.strokeAlign !== void 0 && (n.strokeAlign = e.strokeAlign), e.cornerRadius !== void 0 && (n.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (n.effects = e.effects), (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && (e.layoutMode !== void 0 && (n.layoutMode = e.layoutMode), e.primaryAxisSizingMode !== void 0 && (n.primaryAxisSizingMode = e.primaryAxisSizingMode), e.counterAxisSizingMode !== void 0 && (n.counterAxisSizingMode = e.counterAxisSizingMode), e.primaryAxisAlignItems !== void 0 && (n.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (n.counterAxisAlignItems = e.counterAxisAlignItems), e.paddingLeft !== void 0 && (n.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (n.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (n.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (n.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (n.itemSpacing = e.itemSpacing)), (e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (n.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (n.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (n.dashPattern = e.dashPattern)), e.type === "TEXT" && e.characters !== void 0)
      try {
        if (e.fontName)
          try {
            await figma.loadFontAsync(e.fontName), n.fontName = e.fontName;
          } catch (u) {
            await figma.loadFontAsync({
              family: "Roboto",
              style: "Regular"
            }), n.fontName = { family: "Roboto", style: "Regular" };
          }
        else
          await figma.loadFontAsync({
            family: "Roboto",
            style: "Regular"
          }), n.fontName = { family: "Roboto", style: "Regular" };
        n.characters = e.characters, e.fontSize !== void 0 && (n.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (n.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (n.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (n.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (n.lineHeight = e.lineHeight), e.textCase !== void 0 && (n.textCase = e.textCase), e.textDecoration !== void 0 && (n.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (n.textAutoResize = e.textAutoResize);
      } catch (u) {
        console.log("Error setting text properties: " + u);
        try {
          n.characters = e.characters;
        } catch (p) {
          console.log("Could not set text characters: " + p);
        }
      }
    if (e.boundVariables) {
      for (const [u, p] of Object.entries(
        e.boundVariables
      ))
        if (u !== "fills" && pe(p) && a && s) {
          const l = p._varRef;
          if (l !== void 0) {
            const h = s.get(String(l));
            if (h) {
              const w = {
                type: "VARIABLE_ALIAS",
                id: h.id
              };
              n.boundVariables || (n.boundVariables = {}), n.boundVariables[u] || (n.boundVariables[u] = w);
            }
          }
        }
    }
    if (e.children && Array.isArray(e.children))
      for (const u of e.children) {
        if (u._truncated) {
          console.log(
            `Skipping truncated children: ${u._reason || "Unknown"}`
          );
          continue;
        }
        const p = await B(
          u,
          n,
          a,
          i,
          r,
          s,
          o,
          d,
          // Pass the flag down to children
          g
          // Pass the remote component map down to children
        );
        p && n.appendChild(p);
      }
    return t && t.appendChild(n), n;
  } catch (n) {
    return console.log(
      "Error recreating node " + (e.name || e.type) + ":",
      n
    ), null;
  }
}
async function ge(e) {
  await figma.loadAllPagesAsync();
  const t = figma.root.children, a = new Set(t.map((s) => s.name));
  if (!a.has(e))
    return e;
  let i = 1, r = `${e}_${i}`;
  for (; a.has(r); )
    i++, r = `${e}_${i}`;
  return r;
}
async function dt(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), a = new Set(t.map((s) => s.name));
  if (!a.has(e))
    return e;
  let i = 1, r = `${e}_${i}`;
  for (; a.has(r); )
    i++, r = `${e}_${i}`;
  return r;
}
async function ut(e, t) {
  const a = /* @__PURE__ */ new Set();
  for (const s of e.variableIds)
    try {
      const o = await figma.variables.getVariableByIdAsync(s);
      o && a.add(o.name);
    } catch (o) {
      continue;
    }
  if (!a.has(t))
    return t;
  let i = 1, r = `${t}_${i}`;
  for (; a.has(r); )
    i++, r = `${t}_${i}`;
  return r;
}
function gt(e, t) {
  const a = e.resolvedType.toUpperCase(), i = t.toUpperCase();
  return a === i;
}
async function ft(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), a = O(e.collectionName);
  if (L(e.collectionName)) {
    for (const i of t)
      if (O(i.name) === a)
        return {
          collection: i,
          matchType: "potential"
        };
    return {
      collection: null,
      matchType: "none"
    };
  }
  if (e.collectionGuid) {
    for (const i of t)
      if (i.getSharedPluginData(
        "recursica",
        P
      ) === e.collectionGuid)
        return {
          collection: i,
          matchType: "recognized"
        };
  }
  for (const i of t)
    if (i.name === e.collectionName)
      return {
        collection: i,
        matchType: "potential"
      };
  return {
    collection: null,
    matchType: "none"
  };
}
function pt(e) {
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
function mt(e) {
  if (!e.stringTable)
    return {
      success: !1,
      error: "Invalid JSON format. String table is required."
    };
  let t;
  try {
    t = Y.fromTable(e.stringTable);
  } catch (i) {
    return {
      success: !1,
      error: `Failed to load string table: ${i instanceof Error ? i.message : "Unknown error"}`
    };
  }
  const a = at(e, t);
  return {
    success: !0,
    stringTable: t,
    expandedJsonData: a
  };
}
function yt(e) {
  if (!e.collections)
    return {
      success: !1,
      error: "No collections table found in JSON"
    };
  try {
    return {
      success: !0,
      collectionTable: H.fromTable(
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
async function ht(e) {
  const t = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), r = e.getTable();
  for (const [s, o] of Object.entries(r)) {
    if (o.isLocal === !1) {
      await c.log(
        `Skipping remote collection: "${o.collectionName}" (index ${s})`
      );
      continue;
    }
    const d = await ft(o);
    d.matchType === "recognized" ? (await c.log(
      `✓ Recognized collection by GUID: "${o.collectionName}" (index ${s})`
    ), t.set(s, d.collection)) : d.matchType === "potential" ? (await c.log(
      `? Potential match by name: "${o.collectionName}" (index ${s})`
    ), a.set(s, {
      entry: o,
      collection: d.collection
    })) : (await c.log(
      `✗ No match found for collection: "${o.collectionName}" (index ${s}) - will create new`
    ), i.set(s, o));
  }
  return await c.log(
    `Collection matching complete: ${t.size} recognized, ${a.size} potential matches, ${i.size} to create`
  ), {
    recognizedCollections: t,
    potentialMatches: a,
    collectionsToCreate: i
  };
}
async function bt(e, t, a) {
  if (e.size !== 0) {
    await c.log(
      `Prompting user for ${e.size} potential match(es)...`
    );
    for (const [i, { entry: r, collection: s }] of e.entries())
      try {
        const o = L(r.collectionName) ? O(r.collectionName) : s.name, d = `Found existing "${o}" variable collection. Should I use it?`;
        await c.log(
          `Prompting user about potential match: "${o}"`
        ), await Ae.prompt(d, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await c.log(
          `✓ User confirmed: Using existing collection "${o}" (index ${i})`
        ), t.set(i, s), await G(s, r.modes), await c.log(
          `  ✓ Ensured modes for collection "${o}" (${r.modes.length} mode(s))`
        );
      } catch (o) {
        await c.log(
          `✗ User rejected: Will create new collection for "${r.collectionName}" (index ${i})`
        ), a.set(i, r);
      }
  }
}
async function wt(e, t, a) {
  if (e.size === 0)
    return;
  await c.log("Ensuring modes exist for recognized collections...");
  const i = t.getTable();
  for (const [r, s] of e.entries()) {
    const o = i[r];
    o && (a.has(r) || (await G(s, o.modes), await c.log(
      `  ✓ Ensured modes for collection "${s.name}" (${o.modes.length} mode(s))`
    )));
  }
}
async function At(e, t, a) {
  if (e.size !== 0) {
    await c.log(
      `Creating ${e.size} new collection(s)...`
    );
    for (const [i, r] of e.entries()) {
      const s = O(r.collectionName), o = await dt(s);
      o !== s ? await c.log(
        `Creating collection: "${o}" (normalized: "${s}" - name conflict resolved)`
      ) : await c.log(`Creating collection: "${o}"`);
      const d = figma.variables.createVariableCollection(o);
      a.push(d);
      let g;
      if (L(r.collectionName)) {
        const f = ie(r.collectionName);
        f && (g = f);
      } else r.collectionGuid && (g = r.collectionGuid);
      g && (d.setSharedPluginData(
        "recursica",
        P,
        g
      ), await c.log(
        `  Stored GUID: ${g.substring(0, 8)}...`
      )), await G(d, r.modes), await c.log(
        `  ✓ Created collection "${o}" with ${r.modes.length} mode(s)`
      ), t.set(i, d);
    }
    await c.log("Collection creation complete");
  }
}
function vt(e) {
  if (!e.variables)
    return {
      success: !1,
      error: "No variables table found in JSON"
    };
  try {
    return {
      success: !0,
      variableTable: J.fromTable(e.variables)
    };
  } catch (t) {
    return {
      success: !1,
      error: `Failed to load variables table: ${t instanceof Error ? t.message : "Unknown error"}`
    };
  }
}
async function Nt(e, t, a, i) {
  const r = /* @__PURE__ */ new Map(), s = [], o = new Set(
    i.map((f) => f.id)
  );
  await c.log("Matching and creating variables in collections...");
  const d = e.getTable(), g = /* @__PURE__ */ new Map();
  for (const [f, n] of Object.entries(d)) {
    if (n._colRef === void 0)
      continue;
    const u = a.get(String(n._colRef));
    if (!u)
      continue;
    g.has(u.id) || g.set(u.id, {
      collectionName: u.name,
      existing: 0,
      created: 0
    });
    const p = g.get(u.id), l = o.has(
      u.id
    );
    let h;
    typeof n.variableType == "number" ? h = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[n.variableType] || String(n.variableType) : h = n.variableType;
    const w = await ve(
      u,
      n.variableName
    );
    if (w)
      if (gt(w, h))
        r.set(f, w), p.existing++;
      else {
        await c.warning(
          `Type mismatch for variable "${n.variableName}" in collection "${u.name}": expected ${h}, found ${w.resolvedType}. Creating new variable with incremented name.`
        );
        const y = await ut(
          u,
          n.variableName
        ), m = await ue(
          M(N({}, n), {
            variableName: y,
            variableType: h
          }),
          u,
          e,
          t
        );
        l || s.push(m), r.set(f, m), p.created++;
      }
    else {
      const y = await ue(
        M(N({}, n), {
          variableType: h
        }),
        u,
        e,
        t
      );
      l || s.push(y), r.set(f, y), p.created++;
    }
  }
  await c.log("Variable processing complete:");
  for (const f of g.values())
    await c.log(
      `  "${f.collectionName}": ${f.existing} existing, ${f.created} created`
    );
  return {
    recognizedVariables: r,
    newlyCreatedVariables: s
  };
}
function St(e) {
  if (!e.instances)
    return null;
  try {
    return D.fromTable(e.instances);
  } catch (t) {
    return null;
  }
}
async function xt(e, t) {
  const a = /* @__PURE__ */ new Set();
  for (const s of e.children)
    (s.type === "FRAME" || s.type === "COMPONENT") && a.add(s.name);
  if (!a.has(t))
    return t;
  let i = 1, r = `${t}_${i}`;
  for (; a.has(r); )
    i++, r = `${t}_${i}`;
  return r;
}
async function It(e, t, a, i) {
  var u;
  const r = e.getSerializedTable(), s = Object.values(r).filter(
    (p) => p.instanceType === "remote"
  ), o = /* @__PURE__ */ new Map();
  if (s.length === 0)
    return await c.log("No remote instances found"), o;
  await c.log(
    `Processing ${s.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  let g = figma.root.children.find((p) => p.name === "REMOTES");
  if (g ? await c.log("Found existing REMOTES page") : (g = figma.createPage(), g.name = "REMOTES", await c.log("Created REMOTES page")), !g.children.some(
    (p) => p.type === "FRAME" && p.name === "Title"
  )) {
    const p = { family: "Inter", style: "Bold" }, l = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(p), await figma.loadFontAsync(l);
    const h = figma.createFrame();
    h.name = "Title", h.layoutMode = "VERTICAL", h.paddingTop = 20, h.paddingBottom = 20, h.paddingLeft = 20, h.paddingRight = 20, h.fills = [];
    const w = figma.createText();
    w.fontName = p, w.characters = "REMOTE INSTANCES", w.fontSize = 24, w.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], h.appendChild(w);
    const y = figma.createText();
    y.fontName = l, y.characters = "These are remotely connected component instances found in our different component pages.", y.fontSize = 14, y.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], h.appendChild(y), g.appendChild(h), await c.log("Created title and description on REMOTES page");
  }
  const n = /* @__PURE__ */ new Map();
  for (const [p, l] of Object.entries(r)) {
    if (l.instanceType !== "remote")
      continue;
    const h = parseInt(p, 10);
    if (await c.log(
      `Processing remote instance ${h}: "${l.componentName}"`
    ), !l.structure) {
      await c.warning(
        `Remote instance "${l.componentName}" missing structure data, skipping`
      );
      continue;
    }
    await c.log(
      `  Structure type: ${l.structure.type || "unknown"}, has children: ${l.structure.children ? l.structure.children.length : 0}`
    );
    let w = l.componentName;
    if (l.path && l.path.length > 0) {
      const m = l.path.filter((b) => b !== "").join(" / ");
      m && (w = `${m} / ${l.componentName}`);
    }
    const y = await xt(
      g,
      w
    );
    y !== w && await c.log(
      `Component name conflict: "${w}" -> "${y}"`
    );
    try {
      if (l.structure.type !== "COMPONENT") {
        await c.warning(
          `Remote instance "${l.componentName}" structure is not a COMPONENT (type: ${l.structure.type}), creating frame fallback`
        );
        const b = figma.createFrame();
        b.name = y;
        const v = await B(
          l.structure,
          b,
          t,
          a,
          null,
          i,
          n,
          !0
          // isRemoteStructure: true
        );
        v ? (b.appendChild(v), g.appendChild(b), await c.log(
          `✓ Created remote instance frame fallback: "${y}"`
        )) : b.remove();
        continue;
      }
      const m = figma.createComponent();
      m.name = y, g.appendChild(m), await c.log(
        `  Created component node: "${y}"`
      );
      try {
        if (l.structure.name !== void 0 && (m.name = l.structure.name), l.structure.width !== void 0 && l.structure.height !== void 0 && m.resize(l.structure.width, l.structure.height), l.structure.x !== void 0 && (m.x = l.structure.x), l.structure.y !== void 0 && (m.y = l.structure.y), l.structure.visible !== void 0 && (m.visible = l.structure.visible), l.structure.opacity !== void 0 && (m.opacity = l.structure.opacity), l.structure.rotation !== void 0 && (m.rotation = l.structure.rotation), l.structure.blendMode !== void 0 && (m.blendMode = l.structure.blendMode), l.structure.fills !== void 0)
          try {
            let b = l.structure.fills;
            Array.isArray(b) && (b = b.map((v) => {
              if (v && typeof v == "object") {
                const C = N({}, v);
                return delete C.boundVariables, C;
              }
              return v;
            })), m.fills = b, (u = l.structure.boundVariables) != null && u.fills && i && await Ne(
              m,
              l.structure.boundVariables,
              "fills",
              i
            );
          } catch (b) {
            await c.warning(
              `Error setting fills for remote component "${l.componentName}": ${b}`
            );
          }
        if (l.structure.strokes !== void 0)
          try {
            m.strokes = l.structure.strokes;
          } catch (b) {
            await c.warning(
              `Error setting strokes for remote component "${l.componentName}": ${b}`
            );
          }
        if (l.structure.layoutMode !== void 0 && (m.layoutMode = l.structure.layoutMode), l.structure.primaryAxisSizingMode !== void 0 && (m.primaryAxisSizingMode = l.structure.primaryAxisSizingMode), l.structure.counterAxisSizingMode !== void 0 && (m.counterAxisSizingMode = l.structure.counterAxisSizingMode), l.structure.paddingLeft !== void 0 && (m.paddingLeft = l.structure.paddingLeft), l.structure.paddingRight !== void 0 && (m.paddingRight = l.structure.paddingRight), l.structure.paddingTop !== void 0 && (m.paddingTop = l.structure.paddingTop), l.structure.paddingBottom !== void 0 && (m.paddingBottom = l.structure.paddingBottom), l.structure.itemSpacing !== void 0 && (m.itemSpacing = l.structure.itemSpacing), l.structure.cornerRadius !== void 0 && (m.cornerRadius = l.structure.cornerRadius), l.structure.children && Array.isArray(l.structure.children)) {
          await c.log(
            `  Recreating ${l.structure.children.length} child(ren) for component "${l.componentName}"`
          );
          for (const b of l.structure.children) {
            if (b._truncated) {
              await c.log(
                `  Skipping truncated child: ${b._reason || "Unknown"}`
              );
              continue;
            }
            const v = await B(
              b,
              m,
              t,
              a,
              null,
              i,
              n,
              !0
              // isRemoteStructure: true
            );
            v && m.appendChild(v);
          }
        }
        o.set(h, m), await c.log(
          `✓ Created remote component: "${y}" (index ${h})`
        );
      } catch (b) {
        await c.warning(
          `Error populating remote component "${l.componentName}": ${b instanceof Error ? b.message : "Unknown error"}`
        ), m.remove();
      }
    } catch (m) {
      await c.warning(
        `Error recreating remote instance "${l.componentName}": ${m instanceof Error ? m.message : "Unknown error"}`
      );
    }
  }
  return await c.log(
    `Remote instance processing complete: ${o.size} component(s) created`
  ), o;
}
async function Tt(e, t, a, i, r, s, o = null) {
  await c.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const d = figma.root.children, g = "RecursicaPublishedMetadata";
  let f = null;
  for (const y of d) {
    const m = y.getPluginData(g);
    if (m)
      try {
        if (JSON.parse(m).id === e.guid) {
          f = y;
          break;
        }
      } catch (b) {
        continue;
      }
  }
  f && await c.log(
    `Found existing page with same GUID: "${f.name}". Will create new page to avoid overwriting.`
  );
  const n = d.find((y) => y.name === e.name);
  n && await c.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let u;
  if (f || n) {
    const y = `__${e.name}`;
    u = await ge(y), await c.log(
      `Creating scratch page: "${u}" (will be renamed to "${e.name}" on success)`
    );
  } else
    u = e.name, await c.log(`Creating page: "${u}"`);
  const p = figma.createPage();
  if (p.name = u, await figma.setCurrentPageAsync(p), await c.log(`Switched to page: "${u}"`), !t.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await c.log("Recreating page structure...");
  const l = t.pageData, h = /* @__PURE__ */ new Map();
  if (l.children && Array.isArray(l.children))
    for (const y of l.children) {
      const m = await B(
        y,
        p,
        a,
        i,
        r,
        s,
        h,
        !1,
        // isRemoteStructure: false - we're creating the main page
        o
        // Pass the remote component map
      );
      m && p.appendChild(m);
    }
  await c.log("Page structure recreated successfully");
  const w = {
    _ver: 1,
    id: e.guid,
    name: e.name,
    version: e.version || 0,
    publishDate: (/* @__PURE__ */ new Date()).toISOString(),
    history: {}
  };
  if (p.setPluginData(g, JSON.stringify(w)), await c.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), u.startsWith("__")) {
    const y = await ge(e.name);
    p.name = y, await c.log(`Renamed page from "${u}" to "${y}"`);
  }
  return {
    success: !0,
    page: p
  };
}
async function Ct(e) {
  await c.clear(), await c.log("=== Starting Page Import ===");
  const t = [];
  try {
    const a = e.jsonData;
    if (!a)
      return await c.error("JSON data is required"), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "JSON data is required",
        data: {}
      };
    await c.log("Validating metadata...");
    const i = pt(a);
    if (!i.success)
      return await c.error(i.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: i.error,
        data: {}
      };
    const r = i.metadata;
    await c.log(
      `Metadata validated: guid=${r.guid}, name=${r.name}`
    ), await c.log("Loading string table...");
    const s = mt(a);
    if (!s.success)
      return await c.error(s.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: s.error,
        data: {}
      };
    await c.log("String table loaded successfully"), await c.log("Expanding JSON data...");
    const o = s.expandedJsonData;
    await c.log("JSON expanded successfully"), await c.log("Loading collections table...");
    const d = yt(o);
    if (!d.success)
      return d.error === "No collections table found in JSON" ? (await c.log(d.error), await c.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: r.name }
      }) : (await c.error(d.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: d.error,
        data: {}
      });
    const g = d.collectionTable;
    await c.log(
      `Loaded collections table with ${g.getSize()} collection(s)`
    ), await c.log(
      "Matching collections with existing local collections..."
    );
    const { recognizedCollections: f, potentialMatches: n, collectionsToCreate: u } = await ht(g);
    await bt(
      n,
      f,
      u
    ), await wt(
      f,
      g,
      n
    ), await At(
      u,
      f,
      t
    ), await c.log("Loading variables table...");
    const p = vt(o);
    if (!p.success)
      return p.error === "No variables table found in JSON" ? (await c.log(p.error), await c.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no variables to process)",
        data: { pageName: r.name }
      }) : (await c.error(p.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: p.error,
        data: {}
      });
    const l = p.variableTable;
    await c.log(
      `Loaded variables table with ${l.getSize()} variable(s)`
    );
    const { recognizedVariables: h, newlyCreatedVariables: w } = await Nt(
      l,
      g,
      f,
      t
    );
    await c.log("Loading instance table...");
    const y = St(o);
    if (y) {
      const S = y.getSerializedTable(), z = Object.values(S).filter(
        (R) => R.instanceType === "internal"
      ), x = Object.values(S).filter(
        (R) => R.instanceType === "remote"
      );
      await c.log(
        `Loaded instance table with ${y.getSize()} instance(s) (${z.length} internal, ${x.length} remote)`
      );
    } else
      await c.log("No instance table found in JSON");
    let m = null;
    y && (m = await It(
      y,
      l,
      g,
      h
    ));
    const b = await Tt(
      r,
      o,
      l,
      g,
      y,
      h,
      m
    );
    if (!b.success)
      return await c.error(b.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: b.error,
        data: {}
      };
    const v = b.page, C = h.size + w.length;
    return await c.log("=== Import Complete ==="), await c.log(
      `Successfully processed ${f.size} collection(s), ${C} variable(s), and created page "${v.name}"`
    ), {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: { pageName: v.name }
    };
  } catch (a) {
    const i = a instanceof Error ? a.message : "Unknown error occurred";
    return await c.error(`Import failed: ${i}`), a instanceof Error && a.stack && await c.error(`Stack trace: ${a.stack}`), console.error("Error importing page:", a), {
      type: "importPage",
      success: !1,
      error: !0,
      message: i,
      data: {}
    };
  }
}
async function Et(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children;
    console.log("Found " + t.length + " pages in the document");
    const a = 11, i = t[a];
    if (!i)
      return {
        type: "quickCopy",
        success: !1,
        error: !0,
        message: "No page found at index 11",
        data: {}
      };
    const r = await X(
      i,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + i.name + " (index: " + a + ")"
    );
    const s = JSON.stringify(r, null, 2), o = JSON.parse(s), d = "Copy - " + o.name, g = figma.createPage();
    if (g.name = d, figma.root.appendChild(g), o.children && o.children.length > 0) {
      let u = function(l) {
        l.forEach((h) => {
          const w = (h.x || 0) + (h.width || 0);
          w > p && (p = w), h.children && h.children.length > 0 && u(h.children);
        });
      };
      console.log(
        "Recreating " + o.children.length + " top-level children..."
      );
      let p = 0;
      u(o.children), console.log("Original content rightmost edge: " + p);
      for (const l of o.children)
        await B(l, g, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const f = ne(o);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: o.name,
        newPageName: d,
        totalNodes: f
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
async function Rt(e) {
  try {
    const t = e.accessToken, a = e.selectedRepo;
    return t ? (await figma.clientStorage.setAsync("accessToken", t), a && await figma.clientStorage.setAsync("selectedRepo", a), {
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
async function Mt(e) {
  try {
    const t = await figma.clientStorage.getAsync("accessToken"), a = await figma.clientStorage.getAsync("selectedRepo");
    return {
      type: "loadAuthData",
      success: !0,
      error: !1,
      message: "Auth data loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        accessToken: t || void 0,
        selectedRepo: a || void 0
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
async function kt(e) {
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
async function Pt(e) {
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
function te(e, t = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: t
  };
}
function Se(e, t, a = {}) {
  const i = t instanceof Error ? t.message : t;
  return {
    type: e,
    success: !1,
    error: !0,
    message: i,
    data: a
  };
}
function ae(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
const xe = "RecursicaPublishedMetadata";
async function $t(e) {
  try {
    const t = figma.currentPage;
    await figma.loadAllPagesAsync();
    const i = figma.root.children.findIndex(
      (d) => d.id === t.id
    ), r = t.getPluginData(xe);
    if (!r) {
      const f = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: ae(t.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: i
      };
      return te("getComponentMetadata", f);
    }
    const o = {
      componentMetadata: JSON.parse(r),
      currentPageIndex: i
    };
    return te("getComponentMetadata", o);
  } catch (t) {
    return console.error("Error getting component metadata:", t), Se(
      "getComponentMetadata",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function Ot(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children, a = [];
    for (const r of t) {
      if (r.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${r.name} (type: ${r.type})`
        );
        continue;
      }
      const s = r, o = s.getPluginData(xe);
      if (o)
        try {
          const d = JSON.parse(o);
          a.push(d);
        } catch (d) {
          console.warn(
            `Failed to parse metadata for page "${s.name}":`,
            d
          );
          const f = {
            _ver: 1,
            id: "",
            name: ae(s.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          a.push(f);
        }
      else {
        const g = {
          _ver: 1,
          id: "",
          name: ae(s.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        a.push(g);
      }
    }
    return te("getAllComponents", {
      components: a
    });
  } catch (t) {
    return console.error("Error getting all components:", t), Se(
      "getAllComponents",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function Lt(e) {
  try {
    const t = e.requestId, a = e.action;
    return !t || !a ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (Ae.handleResponse({ requestId: t, action: a }), {
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
const _t = {
  getCurrentUser: ke,
  loadPages: Pe,
  exportPage: it,
  importPage: Ct,
  quickCopy: Et,
  storeAuthData: Rt,
  loadAuthData: Mt,
  clearAuthData: kt,
  storeSelectedRepo: Pt,
  getComponentMetadata: $t,
  getAllComponents: Ot,
  pluginPromptResponse: Lt
}, zt = _t;
figma.showUI(__html__, {
  width: 500,
  height: 650
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    Fe(e);
    return;
  }
  const t = e;
  try {
    const a = t.type, i = zt[a];
    if (!i) {
      console.warn("Unknown message type:", t.type);
      const s = {
        type: t.type,
        success: !1,
        error: !0,
        message: "Unknown message type: " + t.type,
        data: {},
        requestId: t.requestId
      };
      figma.ui.postMessage(s);
      return;
    }
    const r = await i(t.data);
    figma.ui.postMessage(M(N({}, r), {
      requestId: t.requestId
    }));
  } catch (a) {
    console.error("Error handling message:", a);
    const i = {
      type: t.type,
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {},
      requestId: t.requestId
    };
    figma.ui.postMessage(i);
  }
};
