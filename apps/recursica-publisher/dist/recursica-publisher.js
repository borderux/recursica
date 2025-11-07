var Ee = Object.defineProperty, Te = Object.defineProperties;
var Re = Object.getOwnPropertyDescriptors;
var le = Object.getOwnPropertySymbols;
var Me = Object.prototype.hasOwnProperty, ke = Object.prototype.propertyIsEnumerable;
var Z = (e, t, a) => t in e ? Ee(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, w = (e, t) => {
  for (var a in t || (t = {}))
    Me.call(t, a) && Z(e, a, t[a]);
  if (le)
    for (var a of le(t))
      ke.call(t, a) && Z(e, a, t[a]);
  return e;
}, k = (e, t) => Te(e, Re(t));
var L = (e, t, a) => Z(e, typeof t != "symbol" ? t + "" : t, a);
async function Le(e) {
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
        pages: figma.root.children.map((o, n) => ({
          name: o.name,
          index: n
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
const R = {
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
}, T = k(w({}, R), {
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
}), P = k(w({}, R), {
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
}), _ = k(w({}, R), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), pe = k(w({}, R), {
  cornerRadius: 0
}), Oe = k(w({}, R), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function $e(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return T;
    case "TEXT":
      return P;
    case "VECTOR":
      return _;
    case "LINE":
      return Oe;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return pe;
    default:
      return R;
  }
}
function p(e, t) {
  if (Array.isArray(e))
    return Array.isArray(t) ? e.length !== t.length || e.some((a, i) => p(a, t[i])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof t == "object" && t !== null) {
      const a = Object.keys(e), i = Object.keys(t);
      return a.length !== i.length ? !0 : a.some(
        (o) => !(o in t) || p(e[o], t[o])
      );
    }
    return !0;
  }
  return e !== t;
}
const ee = {
  LAYER: "00000000-0000-0000-0000-000000000001",
  TOKENS: "00000000-0000-0000-0000-000000000002",
  THEME: "00000000-0000-0000-0000-000000000003"
}, $ = {
  LAYER: "Layer",
  TOKENS: "Tokens",
  THEME: "Theme"
};
function V(e) {
  const t = e.trim(), a = t.toLowerCase();
  return a === "themes" ? $.THEME : a === "token" ? $.TOKENS : a === "layer" ? $.LAYER : a === "tokens" ? $.TOKENS : a === "theme" ? $.THEME : t;
}
function z(e) {
  const t = V(e);
  return t === $.LAYER || t === $.TOKENS || t === $.THEME;
}
function oe(e) {
  const t = V(e);
  if (t === $.LAYER)
    return ee.LAYER;
  if (t === $.TOKENS)
    return ee.TOKENS;
  if (t === $.THEME)
    return ee.THEME;
}
class J {
  constructor() {
    L(this, "collectionMap");
    // collectionId -> index
    L(this, "collections");
    // index -> collection data
    L(this, "normalizedNameMap");
    // normalized name -> index (for standard collections)
    L(this, "nextIndex");
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
    for (const o of a)
      i.add(o);
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
    const i = V(
      t.collectionName
    );
    if (z(t.collectionName)) {
      const r = this.findCollectionByNormalizedName(i);
      if (r !== void 0) {
        const s = this.collections[r];
        return s.modes = this.mergeModes(
          s.modes,
          t.modes
        ), this.collectionMap.set(a, r), r;
      }
    }
    const o = this.nextIndex++;
    this.collectionMap.set(a, o);
    const n = k(w({}, t), {
      collectionName: i
    });
    if (z(t.collectionName)) {
      const r = oe(
        t.collectionName
      );
      r && (n.collectionGuid = r), this.normalizedNameMap.set(i, o);
    }
    return this.collections[o] = n, o;
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
      const i = this.collections[a], o = w({
        collectionName: i.collectionName,
        modes: i.modes
      }, i.collectionGuid && { collectionGuid: i.collectionGuid });
      t[String(a)] = o;
    }
    return t;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   * Handles both new format (without collectionId/isLocal) and legacy format (with collectionId/isLocal)
   */
  static fromTable(t) {
    var o;
    const a = new J(), i = Object.entries(t).sort(
      (n, r) => parseInt(n[0], 10) - parseInt(r[0], 10)
    );
    for (const [n, r] of i) {
      const s = parseInt(n, 10), c = (o = r.isLocal) != null ? o : !0, u = V(
        r.collectionName || ""
      ), d = r.collectionId || r.collectionGuid || `temp:${s}:${u}`, y = w({
        collectionName: u,
        collectionId: d,
        isLocal: c,
        modes: r.modes || []
      }, r.collectionGuid && {
        collectionGuid: r.collectionGuid
      });
      a.collectionMap.set(d, s), a.collections[s] = y, z(u) && a.normalizedNameMap.set(u, s), a.nextIndex = Math.max(
        a.nextIndex,
        s + 1
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
const Ve = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, ze = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function _e(e) {
  var a;
  const t = e.toUpperCase();
  return (a = Ve[t]) != null ? a : e;
}
function Ge(e) {
  var t;
  return typeof e == "number" ? (t = ze[e]) != null ? t : e.toString() : e;
}
class W {
  constructor() {
    L(this, "variableMap");
    // variableKey -> index
    L(this, "variables");
    // index -> variable data
    L(this, "nextIndex");
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
    for (const [i, o] of Object.entries(t))
      typeof o == "object" && o !== null && "_varRef" in o && typeof o._varRef == "number" ? a[i] = {
        _varRef: o._varRef
      } : a[i] = o;
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
      const i = this.variables[a], o = this.serializeValuesByMode(
        i.valuesByMode
      ), n = w(w({
        variableName: i.variableName,
        variableType: _e(i.variableType)
      }, i._colRef !== void 0 && { _colRef: i._colRef }), o && { valuesByMode: o });
      t[String(a)] = n;
    }
    return t;
  }
  /**
   * Reconstructs a VariableTable from a serialized table object
   * Handles both new format (without variableKey) and legacy format (with variableKey)
   * Expands compressed variable types (numbers) back to strings
   */
  static fromTable(t) {
    const a = new W(), i = Object.entries(t).sort(
      (o, n) => parseInt(o[0], 10) - parseInt(n[0], 10)
    );
    for (const [o, n] of i) {
      const r = parseInt(o, 10), s = Ge(n.variableType), c = k(w({}, n), {
        variableType: s
        // Always a string after expansion
      });
      a.variables[r] = c, a.nextIndex = Math.max(a.nextIndex, r + 1);
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
function Be(e) {
  return {
    _varRef: e
  };
}
function q(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let Ue = 0;
const G = /* @__PURE__ */ new Map();
function Fe(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const t = G.get(e.requestId);
  t && (G.delete(e.requestId), e.error || !e.guid ? t.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : t.resolve(e.guid));
}
function ne() {
  return new Promise((e, t) => {
    const a = `guid_${Date.now()}_${++Ue}`;
    G.set(a, { resolve: e, reject: t }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: a
    }), setTimeout(() => {
      G.has(a) && (G.delete(a), t(new Error("Timeout waiting for GUID from UI")));
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
async function F() {
  return new Promise((e) => setTimeout(e, 0));
}
const l = {
  clear: async () => {
    console.clear(), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: "__CLEAR__"
      }
    }), await F();
  },
  log: async (e) => {
    console.log(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    }), await F();
  },
  warning: async (e) => {
    console.warn(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    }), await F();
  },
  error: async (e) => {
    console.error(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    }), await F();
  }
};
function Ke(e, t) {
  const a = t.modes.find((i) => i.modeId === e);
  return a ? a.name : e;
}
async function ye(e, t, a, i, o = /* @__PURE__ */ new Set()) {
  const n = {};
  for (const [r, s] of Object.entries(e)) {
    const c = Ke(r, i);
    if (s == null) {
      n[c] = s;
      continue;
    }
    if (typeof s == "string" || typeof s == "number" || typeof s == "boolean") {
      n[c] = s;
      continue;
    }
    if (typeof s == "object" && s !== null && "type" in s && s.type === "VARIABLE_ALIAS" && "id" in s) {
      const u = s.id;
      if (o.has(u)) {
        n[c] = {
          type: "VARIABLE_ALIAS",
          id: u
        };
        continue;
      }
      const d = await figma.variables.getVariableByIdAsync(u);
      if (!d) {
        n[c] = {
          type: "VARIABLE_ALIAS",
          id: u
        };
        continue;
      }
      const y = new Set(o);
      y.add(u);
      const b = await figma.variables.getVariableCollectionByIdAsync(
        d.variableCollectionId
      ), h = d.key;
      if (!h) {
        n[c] = {
          type: "VARIABLE_ALIAS",
          id: u
        };
        continue;
      }
      const C = {
        variableName: d.name,
        variableType: d.resolvedType,
        collectionName: b == null ? void 0 : b.name,
        collectionId: d.variableCollectionId,
        variableKey: h,
        id: u,
        isLocal: !d.remote
      };
      if (b) {
        const v = await be(
          b,
          a
        );
        C._colRef = v, d.valuesByMode && (C.valuesByMode = await ye(
          d.valuesByMode,
          t,
          a,
          b,
          // Pass collection for mode ID to name conversion
          y
        ));
      }
      const S = t.addVariable(C);
      n[c] = {
        type: "VARIABLE_ALIAS",
        id: u,
        _varRef: S
      };
    } else
      n[c] = s;
  }
  return n;
}
const K = "recursica:collectionId";
async function De(e) {
  if (e.remote === !0) {
    const a = me[e.id];
    if (!a) {
      const o = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await l.error(o), new Error(o);
    }
    return a.guid;
  } else {
    if (z(e.name)) {
      const o = oe(e.name);
      if (o) {
        const n = e.getSharedPluginData(
          "recursica",
          K
        );
        return (!n || n.trim() === "") && e.setSharedPluginData(
          "recursica",
          K,
          o
        ), o;
      }
    }
    const a = e.getSharedPluginData(
      "recursica",
      K
    );
    if (a && a.trim() !== "")
      return a;
    const i = await ne();
    return e.setSharedPluginData("recursica", K, i), i;
  }
}
function je(e, t) {
  if (t)
    return;
  const a = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(a))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function be(e, t) {
  const a = !e.remote, i = t.getCollectionIndex(e.id);
  if (i !== -1)
    return i;
  je(e.name, a);
  const o = await De(e), n = e.modes.map((u) => u.name), r = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: a,
    modes: n,
    collectionGuid: o
  }, s = t.addCollection(r), c = a ? "local" : "remote";
  return await l.log(
    `  Added ${c} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), s;
}
async function de(e, t, a) {
  if (!e || typeof e != "object" || e.type !== "VARIABLE_ALIAS")
    return null;
  try {
    const i = await figma.variables.getVariableByIdAsync(e.id);
    if (!i)
      return console.log("Could not resolve variable alias:", e.id), null;
    const o = await figma.variables.getVariableCollectionByIdAsync(
      i.variableCollectionId
    );
    if (!o)
      return console.log("Could not resolve collection for variable:", e.id), null;
    const n = i.key;
    if (!n)
      return console.log("Variable missing key:", e.id), null;
    const r = await be(
      o,
      a
    ), s = {
      variableName: i.name,
      variableType: i.resolvedType,
      _colRef: r,
      // Reference to collection table (v2.4.0+)
      variableKey: n,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    i.valuesByMode && (s.valuesByMode = await ye(
      i.valuesByMode,
      t,
      a,
      o,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const c = t.addVariable(s);
    return Be(c);
  } catch (i) {
    const o = i instanceof Error ? i.message : String(i);
    throw console.error("Could not resolve variable alias:", e.id, i), new Error(
      `Failed to resolve variable alias ${e.id}: ${o}`
    );
  }
}
async function H(e, t, a) {
  if (!e || typeof e != "object") return e;
  const i = {};
  for (const o in e)
    if (Object.prototype.hasOwnProperty.call(e, o)) {
      const n = e[o];
      if (n && typeof n == "object" && !Array.isArray(n))
        if (n.type === "VARIABLE_ALIAS") {
          const r = await de(
            n,
            t,
            a
          );
          r && (i[o] = r);
        } else
          i[o] = await H(
            n,
            t,
            a
          );
      else Array.isArray(n) ? i[o] = await Promise.all(
        n.map(async (r) => (r == null ? void 0 : r.type) === "VARIABLE_ALIAS" ? await de(
          r,
          t,
          a
        ) || r : r && typeof r == "object" ? await H(
          r,
          t,
          a
        ) : r)
      ) : i[o] = n;
    }
  return i;
}
async function qe(e, t, a) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const o = {};
      for (const n in i)
        Object.prototype.hasOwnProperty.call(i, n) && (n === "boundVariables" ? o[n] = await H(
          i[n],
          t,
          a
        ) : o[n] = i[n]);
      return o;
    })
  );
}
async function He(e, t) {
  const a = {}, i = /* @__PURE__ */ new Set();
  if (e.type && (a.type = e.type, i.add("type")), e.id && (a.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (a.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (a.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (a.y = e.y, i.add("y")), e.width !== void 0 && (a.width = e.width, i.add("width")), e.height !== void 0 && (a.height = e.height, i.add("height")), e.visible !== void 0 && p(e.visible, R.visible) && (a.visible = e.visible, i.add("visible")), e.locked !== void 0 && p(e.locked, R.locked) && (a.locked = e.locked, i.add("locked")), e.opacity !== void 0 && p(e.opacity, R.opacity) && (a.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && p(e.rotation, R.rotation) && (a.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && p(e.blendMode, R.blendMode) && (a.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && p(e.effects, R.effects) && (a.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const o = await qe(
      e.fills,
      t.variableTable,
      t.collectionTable
    );
    p(o, R.fills) && (a.fills = o), i.add("fills");
  }
  if (e.strokes !== void 0 && p(e.strokes, R.strokes) && (a.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && p(e.strokeWeight, R.strokeWeight) && (a.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && p(e.strokeAlign, R.strokeAlign) && (a.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const o = await H(
      e.boundVariables,
      t.variableTable,
      t.collectionTable
    );
    Object.keys(o).length > 0 && (a.boundVariables = o), i.add("boundVariables");
  }
  return a;
}
async function ue(e, t) {
  const a = {}, i = /* @__PURE__ */ new Set();
  return e.layoutMode !== void 0 && p(e.layoutMode, T.layoutMode) && (a.layoutMode = e.layoutMode, i.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && p(
    e.primaryAxisSizingMode,
    T.primaryAxisSizingMode
  ) && (a.primaryAxisSizingMode = e.primaryAxisSizingMode, i.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && p(
    e.counterAxisSizingMode,
    T.counterAxisSizingMode
  ) && (a.counterAxisSizingMode = e.counterAxisSizingMode, i.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && p(
    e.primaryAxisAlignItems,
    T.primaryAxisAlignItems
  ) && (a.primaryAxisAlignItems = e.primaryAxisAlignItems, i.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && p(
    e.counterAxisAlignItems,
    T.counterAxisAlignItems
  ) && (a.counterAxisAlignItems = e.counterAxisAlignItems, i.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && p(e.paddingLeft, T.paddingLeft) && (a.paddingLeft = e.paddingLeft, i.add("paddingLeft")), e.paddingRight !== void 0 && p(e.paddingRight, T.paddingRight) && (a.paddingRight = e.paddingRight, i.add("paddingRight")), e.paddingTop !== void 0 && p(e.paddingTop, T.paddingTop) && (a.paddingTop = e.paddingTop, i.add("paddingTop")), e.paddingBottom !== void 0 && p(e.paddingBottom, T.paddingBottom) && (a.paddingBottom = e.paddingBottom, i.add("paddingBottom")), e.itemSpacing !== void 0 && p(e.itemSpacing, T.itemSpacing) && (a.itemSpacing = e.itemSpacing, i.add("itemSpacing")), e.cornerRadius !== void 0 && p(e.cornerRadius, T.cornerRadius) && (a.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.clipsContent !== void 0 && p(e.clipsContent, T.clipsContent) && (a.clipsContent = e.clipsContent, i.add("clipsContent")), e.layoutWrap !== void 0 && p(e.layoutWrap, T.layoutWrap) && (a.layoutWrap = e.layoutWrap, i.add("layoutWrap")), e.layoutGrow !== void 0 && p(e.layoutGrow, T.layoutGrow) && (a.layoutGrow = e.layoutGrow, i.add("layoutGrow")), a;
}
async function Je(e, t) {
  const a = {}, i = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (a.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (a.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (a.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && p(
    e.textAlignHorizontal,
    P.textAlignHorizontal
  ) && (a.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && p(
    e.textAlignVertical,
    P.textAlignVertical
  ) && (a.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && p(e.letterSpacing, P.letterSpacing) && (a.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && p(e.lineHeight, P.lineHeight) && (a.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && p(e.textCase, P.textCase) && (a.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && p(e.textDecoration, P.textDecoration) && (a.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && p(e.textAutoResize, P.textAutoResize) && (a.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && p(
    e.paragraphSpacing,
    P.paragraphSpacing
  ) && (a.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && p(e.paragraphIndent, P.paragraphIndent) && (a.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && p(e.listOptions, P.listOptions) && (a.listOptions = e.listOptions, i.add("listOptions")), a;
}
async function We(e, t) {
  const a = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && p(e.fillGeometry, _.fillGeometry) && (a.fillGeometry = e.fillGeometry, i.add("fillGeometry")), e.strokeGeometry !== void 0 && p(e.strokeGeometry, _.strokeGeometry) && (a.strokeGeometry = e.strokeGeometry, i.add("strokeGeometry")), e.strokeCap !== void 0 && p(e.strokeCap, _.strokeCap) && (a.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && p(e.strokeJoin, _.strokeJoin) && (a.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && p(e.dashPattern, _.dashPattern) && (a.dashPattern = e.dashPattern, i.add("dashPattern")), a;
}
async function Ye(e, t) {
  const a = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && p(e.cornerRadius, pe.cornerRadius) && (a.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (a.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (a.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (a.pointCount = e.pointCount, i.add("pointCount")), a;
}
const Xe = "RecursicaPublishedMetadata";
function ge(e) {
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
function Qe(e) {
  try {
    const t = e.getSharedPluginData(
      "recursica",
      Xe
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
async function Ze(e, t) {
  const a = {}, i = /* @__PURE__ */ new Set();
  if (a._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function")
    try {
      const o = await e.getMainComponentAsync();
      if (!o)
        return a;
      const n = e.name || "(unnamed)", r = o.name || "(unnamed)", s = o.remote === !0, c = ge(e), u = ge(o);
      let d;
      s ? d = "remote" : u && c && u.id === c.id ? d = "internal" : (u && c && (u.id, c.id), d = "normal");
      let y, b;
      try {
        e.variantProperties && (y = e.variantProperties), e.componentProperties && (b = e.componentProperties);
      } catch (N) {
      }
      let h, C;
      try {
        let N = o.parent;
        const x = [];
        let f = 0;
        const g = 20;
        for (; N && f < g; )
          try {
            const m = N.type, I = N.name;
            if (m === "COMPONENT_SET" && !C && (C = I), m === "PAGE")
              break;
            const A = I || "";
            x.unshift(A), N = N.parent, f++;
          } catch (m) {
            break;
          }
        h = x;
      } catch (N) {
      }
      const S = w(w(w(w({
        instanceType: d,
        componentName: r
      }, C && { componentSetName: C }), y && { variantProperties: y }), b && { componentProperties: b }), d === "normal" ? { path: h || [] } : h && h.length > 0 && {
        path: h
      });
      if (d === "internal")
        S.componentNodeId = o.id, await l.log(
          `  Found INSTANCE: "${n}" -> INTERNAL component "${r}" (ID: ${o.id.substring(0, 8)}...)`
        );
      else if (d === "normal") {
        if (u) {
          S.componentPageName = u.name;
          const x = Qe(u);
          x != null && x.id && x.version !== void 0 && (S.componentGuid = x.id, S.componentVersion = x.version);
        }
        h === void 0 && console.warn(
          `Failed to build path for normal instance "${n}" -> component "${r}". Path is required for resolution.`
        );
        const N = h && h.length > 0 ? ` at path [${h.join(" → ")}]` : " at page root";
        await l.log(
          `  Found INSTANCE: "${n}" -> NORMAL component "${r}" (ID: ${o.id.substring(0, 8)}...)${N}`
        );
      } else if (d === "remote") {
        let N, x;
        try {
          if (typeof o.getPublishStatusAsync == "function")
            try {
              const f = await o.getPublishStatusAsync();
              f && typeof f == "object" && (f.libraryName && (N = f.libraryName), f.libraryKey && (x = f.libraryKey));
            } catch (f) {
            }
          try {
            const f = figma.teamLibrary;
            if (typeof (f == null ? void 0 : f.getAvailableLibraryComponentSetsAsync) == "function") {
              const g = await f.getAvailableLibraryComponentSetsAsync();
              if (g && Array.isArray(g)) {
                for (const m of g)
                  if (m.key === o.key || m.name === o.name) {
                    m.libraryName && (N = m.libraryName), m.libraryKey && (x = m.libraryKey);
                    break;
                  }
              }
            }
          } catch (f) {
          }
          try {
            S.structure = await X(
              o,
              /* @__PURE__ */ new WeakSet(),
              t
            );
          } catch (f) {
            console.warn(
              `Failed to extract structure for remote component "${r}":`,
              f
            );
          }
        } catch (f) {
          console.warn(
            `Error getting library info for remote component "${r}":`,
            f
          );
        }
        N && (S.remoteLibraryName = N), x && (S.remoteLibraryKey = x), await l.log(
          `  Found INSTANCE: "${n}" -> REMOTE component "${r}" (ID: ${o.id.substring(0, 8)}...)`
        );
      }
      const v = t.instanceTable.addInstance(S);
      a._instanceRef = v, i.add("_instanceRef");
    } catch (o) {
      console.log(
        "Error getting main component for " + (e.name || "unknown") + ":",
        o
      );
    }
  return a;
}
class se {
  constructor() {
    L(this, "instanceMap");
    // unique key -> index
    L(this, "instances");
    // index -> instance data
    L(this, "nextIndex");
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
    const a = new se(), i = Object.entries(t).sort(
      (o, n) => parseInt(o[0], 10) - parseInt(n[0], 10)
    );
    for (const [o, n] of i) {
      const r = parseInt(o, 10), s = a.generateKey(n);
      a.instanceMap.set(s, r), a.instances[r] = n, a.nextIndex = Math.max(a.nextIndex, r + 1);
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
const he = {
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
function et() {
  const e = {};
  for (const [t, a] of Object.entries(he))
    e[a] = t;
  return e;
}
function fe(e) {
  var t;
  return (t = he[e]) != null ? t : e;
}
function tt(e) {
  var t;
  return typeof e == "number" ? (t = et()[e]) != null ? t : e.toString() : e;
}
const Ae = {
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
}, te = {};
for (const [e, t] of Object.entries(Ae))
  te[t] = e;
class Y {
  constructor() {
    L(this, "shortToLong");
    L(this, "longToShort");
    this.shortToLong = w({}, te), this.longToShort = w({}, Ae);
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
      for (const o of Object.keys(t))
        i.add(o);
      for (const [o, n] of Object.entries(t)) {
        const r = this.getShortName(o);
        if (r !== o && !i.has(r)) {
          let s = this.compressObject(n);
          r === "type" && typeof s == "string" && (s = fe(s)), a[r] = s;
        } else {
          let s = this.compressObject(n);
          o === "type" && typeof s == "string" && (s = fe(s)), a[o] = s;
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
      for (const [i, o] of Object.entries(t)) {
        const n = this.getLongName(i);
        let r = this.expandObject(o);
        (n === "type" || i === "type") && (typeof r == "number" || typeof r == "string") && (r = tt(r)), a[n] = r;
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
    return w({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(t) {
    const a = new Y();
    a.shortToLong = w(w({}, te), t), a.longToShort = {};
    for (const [i, o] of Object.entries(
      a.shortToLong
    ))
      a.longToShort[o] = i;
    return a;
  }
}
function at(e, t) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const a = {};
  e.metadata && (a.metadata = e.metadata);
  for (const [i, o] of Object.entries(e))
    i !== "metadata" && (a[i] = t.compressObject(o));
  return a;
}
function it(e, t) {
  return t.expandObject(e);
}
function ce(e) {
  let t = 1;
  return e.children && e.children.length > 0 && e.children.forEach((a) => {
    t += ce(a);
  }), t;
}
async function X(e, t = /* @__PURE__ */ new WeakSet(), a = {}) {
  var y, b, h, C, S;
  if (!e || typeof e != "object")
    return e;
  const i = (y = a.maxNodes) != null ? y : 1e4, o = (b = a.nodeCount) != null ? b : 0;
  if (o >= i)
    return await l.warning(
      `Maximum node count (${i}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: o
    };
  const n = {
    visited: (h = a.visited) != null ? h : /* @__PURE__ */ new WeakSet(),
    depth: (C = a.depth) != null ? C : 0,
    maxDepth: (S = a.maxDepth) != null ? S : 100,
    nodeCount: o + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: a.variableTable,
    collectionTable: a.collectionTable,
    instanceTable: a.instanceTable
  };
  if (t.has(e))
    return "[Circular Reference]";
  t.add(e), n.visited = t;
  const r = {}, s = await He(e, n);
  Object.assign(r, s);
  const c = e.type;
  if (c)
    switch (c) {
      case "FRAME":
      case "COMPONENT": {
        const v = await ue(e);
        Object.assign(r, v);
        break;
      }
      case "INSTANCE": {
        const v = await Ze(
          e,
          n
        );
        Object.assign(r, v);
        const N = await ue(
          e
        );
        Object.assign(r, N);
        break;
      }
      case "TEXT": {
        const v = await Je(e);
        Object.assign(r, v);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const v = await We(e);
        Object.assign(r, v);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const v = await Ye(e);
        Object.assign(r, v);
        break;
      }
      default:
        n.unhandledKeys.add("_unknownType");
        break;
    }
  const u = Object.getOwnPropertyNames(e), d = /* @__PURE__ */ new Set([
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
  (c === "FRAME" || c === "COMPONENT" || c === "INSTANCE") && (d.add("layoutMode"), d.add("primaryAxisSizingMode"), d.add("counterAxisSizingMode"), d.add("primaryAxisAlignItems"), d.add("counterAxisAlignItems"), d.add("paddingLeft"), d.add("paddingRight"), d.add("paddingTop"), d.add("paddingBottom"), d.add("itemSpacing"), d.add("cornerRadius"), d.add("clipsContent"), d.add("layoutWrap"), d.add("layoutGrow")), c === "TEXT" && (d.add("characters"), d.add("fontName"), d.add("fontSize"), d.add("textAlignHorizontal"), d.add("textAlignVertical"), d.add("letterSpacing"), d.add("lineHeight"), d.add("textCase"), d.add("textDecoration"), d.add("textAutoResize"), d.add("paragraphSpacing"), d.add("paragraphIndent"), d.add("listOptions")), (c === "VECTOR" || c === "LINE") && (d.add("fillGeometry"), d.add("strokeGeometry")), (c === "RECTANGLE" || c === "ELLIPSE" || c === "STAR" || c === "POLYGON") && (d.add("pointCount"), d.add("innerRadius"), d.add("arcData")), c === "INSTANCE" && (d.add("mainComponent"), d.add("componentProperties"));
  for (const v of u)
    typeof e[v] != "function" && (d.has(v) || n.unhandledKeys.add(v));
  if (n.unhandledKeys.size > 0 && (r._unhandledKeys = Array.from(n.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const v = n.maxDepth;
    if (n.depth >= v)
      r.children = {
        _truncated: !0,
        _reason: `Maximum depth (${v}) reached`,
        _count: e.children.length
      };
    else if (n.nodeCount >= i)
      r.children = {
        _truncated: !0,
        _reason: `Maximum node count (${i}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const N = k(w({}, n), {
        depth: n.depth + 1
      }), x = [];
      let f = !1;
      for (const g of e.children) {
        if (N.nodeCount >= i) {
          r.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: x.length,
            _total: e.children.length,
            children: x
          }, f = !0;
          break;
        }
        const m = await X(g, t, N);
        x.push(m), N.nodeCount && (n.nodeCount = N.nodeCount);
      }
      f || (r.children = x);
    }
  }
  return r;
}
async function rt(e) {
  await l.clear(), await l.log("=== Starting Page Export ===");
  try {
    const t = e.pageIndex;
    if (t === void 0 || typeof t != "number")
      return await l.error(
        "Invalid page selection: pageIndex is undefined or not a number"
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    await l.log("Loading all pages..."), await figma.loadAllPagesAsync();
    const a = figma.root.children;
    if (await l.log(`Loaded ${a.length} page(s)`), t < 0 || t >= a.length)
      return await l.error(
        `Invalid page index: ${t} (valid range: 0-${a.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const i = a[t];
    await l.log(
      `Selected page: "${i.name}" (index: ${t})`
    ), await l.log(
      "Initializing variable, collection, and instance tables..."
    );
    const o = new W(), n = new J(), r = new se();
    await l.log("Fetching team library variable collections...");
    let s = [];
    try {
      if (s = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((E) => ({
        libraryName: E.libraryName,
        key: E.key,
        name: E.name
      })), await l.log(
        `Found ${s.length} library collection(s) in team library`
      ), s.length > 0)
        for (const E of s)
          await l.log(`  - ${E.name} (from ${E.libraryName})`);
    } catch (A) {
      await l.warning(
        `Could not get library variable collections: ${A instanceof Error ? A.message : String(A)}`
      );
    }
    await l.log("Extracting node data from page..."), await l.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await l.log(
      "Collections will be discovered as variables are processed:"
    );
    const c = await X(
      i,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: o,
        collectionTable: n,
        instanceTable: r
      }
    );
    await l.log("Node extraction finished");
    const u = ce(c), d = o.getSize(), y = n.getSize(), b = r.getSize();
    if (await l.log("Extraction complete:"), await l.log(`  - Total nodes: ${u}`), await l.log(`  - Unique variables: ${d}`), await l.log(`  - Unique collections: ${y}`), await l.log(`  - Unique instances: ${b}`), y > 0) {
      await l.log("Collections found:");
      const A = n.getTable();
      for (const [E, M] of Object.values(A).entries()) {
        const U = M.collectionGuid ? ` (GUID: ${M.collectionGuid.substring(0, 8)}...)` : "";
        await l.log(
          `  ${E}: ${M.collectionName}${U} - ${M.modes.length} mode(s)`
        );
      }
    }
    await l.log("Creating string table...");
    const h = new Y();
    await l.log("Getting page metadata...");
    const C = i.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let S = "", v = 0;
    if (C)
      try {
        const A = JSON.parse(C);
        S = A.id || "", v = A.version || 0;
      } catch (A) {
        await l.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!S) {
      await l.log("Generating new GUID for page..."), S = await ne();
      const A = {
        _ver: 1,
        id: S,
        name: i.name,
        version: v,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      i.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(A)
      );
    }
    await l.log("Creating export data structure...");
    const N = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "2.7.0",
        // Updated version for string table compression
        figmaApiVersion: figma.apiVersion,
        guid: S,
        version: v,
        name: i.name,
        pluginVersion: "1.0.0"
      },
      stringTable: h.getSerializedTable(),
      collections: n.getSerializedTable(),
      variables: o.getSerializedTable(),
      instances: r.getSerializedTable(),
      libraries: s,
      // Libraries might not need compression, but could be added later
      pageData: c
    };
    await l.log("Compressing JSON data...");
    const x = at(N, h);
    await l.log("Serializing to JSON...");
    const f = JSON.stringify(x, null, 2), g = (f.length / 1024).toFixed(2), m = i.name.replace(/[^a-z0-9]/gi, "_") + "_export.json";
    return await l.log(`JSON serialization complete: ${g} KB`), await l.log(`Export file: ${m}`), await l.log("=== Export Complete ==="), {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: m,
        jsonData: f,
        pageName: i.name,
        additionalPages: []
        // Will be populated when publishing referenced component pages
      }
    };
  } catch (t) {
    return await l.error(
      `Export failed: ${t instanceof Error ? t.message : "Unknown error occurred"}`
    ), t instanceof Error && t.stack && await l.error(`Stack trace: ${t.stack}`), console.error("Error exporting page:", t), {
      type: "exportPage",
      success: !1,
      error: !0,
      message: t instanceof Error ? t.message : "Unknown error occurred",
      data: {}
    };
  }
}
const D = /* @__PURE__ */ new Map();
let ot = 0;
function nt() {
  return `prompt_${Date.now()}_${++ot}`;
}
const ve = {
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
    var s;
    const a = typeof t == "number" ? { timeoutMs: t } : t, i = (s = a == null ? void 0 : a.timeoutMs) != null ? s : 3e5, o = a == null ? void 0 : a.okLabel, n = a == null ? void 0 : a.cancelLabel, r = nt();
    return new Promise((c, u) => {
      const d = i === -1 ? null : setTimeout(() => {
        D.delete(r), u(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      D.set(r, {
        resolve: c,
        reject: u,
        timeout: d
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: w(w({
          message: e,
          requestId: r
        }, o && { okLabel: o }), n && { cancelLabel: n })
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
    const { requestId: t, action: a } = e, i = D.get(t);
    if (!i) {
      console.warn(
        `Received response for unknown prompt request: ${t}`
      );
      return;
    }
    i.timeout && clearTimeout(i.timeout), D.delete(t), a === "ok" ? i.resolve() : i.reject(new Error("User cancelled"));
  }
};
async function B(e, t) {
  for (const a of t)
    e.modes.find((o) => o.name === a) || e.addMode(a);
}
const O = "recursica:collectionId";
async function j(e) {
  if (e.remote === !0) {
    const a = me[e.id];
    if (!a) {
      const o = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await l.error(o), new Error(o);
    }
    return a.guid;
  } else {
    const a = e.getSharedPluginData(
      "recursica",
      O
    );
    if (a && a.trim() !== "")
      return a;
    const i = await ne();
    return e.setSharedPluginData("recursica", O, i), i;
  }
}
function we(e, t) {
  if (t)
    return;
  const a = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(a))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Ne(e) {
  let t;
  const a = e.collectionName.trim().toLowerCase(), i = ["token", "tokens", "theme", "themes"], o = e.isLocal;
  if (o === !1 || o === void 0 && i.includes(a))
    try {
      const s = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((c) => c.name.trim().toLowerCase() === a);
      if (s) {
        we(e.collectionName, !1);
        const c = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          s.key
        );
        if (c.length > 0) {
          const u = await figma.variables.importVariableByKeyAsync(c[0].key), d = await figma.variables.getVariableCollectionByIdAsync(
            u.variableCollectionId
          );
          if (d) {
            if (t = d, e.collectionGuid) {
              const y = t.getSharedPluginData(
                "recursica",
                O
              );
              (!y || y.trim() === "") && t.setSharedPluginData(
                "recursica",
                O,
                e.collectionGuid
              );
            } else
              await j(t);
            return await B(t, e.modes), { collection: t };
          }
        }
      }
    } catch (r) {
      if (o === !1)
        throw new Error(
          `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
        );
      console.log("Could not import external collection, trying local:", r);
    }
  if (o !== !1) {
    const r = await figma.variables.getLocalVariableCollectionsAsync();
    let s;
    if (e.collectionGuid && (s = r.find((c) => c.getSharedPluginData("recursica", O) === e.collectionGuid)), s || (s = r.find(
      (c) => c.name === e.collectionName
    )), s)
      if (t = s, e.collectionGuid) {
        const c = t.getSharedPluginData(
          "recursica",
          O
        );
        (!c || c.trim() === "") && t.setSharedPluginData(
          "recursica",
          O,
          e.collectionGuid
        );
      } else
        await j(t);
    else
      t = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? t.setSharedPluginData(
        "recursica",
        O,
        e.collectionGuid
      ) : await j(t);
  } else {
    const r = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), s = e.collectionName.trim().toLowerCase(), c = r.find((b) => b.name.trim().toLowerCase() === s);
    if (!c)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const u = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      c.key
    );
    if (u.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const d = await figma.variables.importVariableByKeyAsync(
      u[0].key
    ), y = await figma.variables.getVariableCollectionByIdAsync(
      d.variableCollectionId
    );
    if (!y)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (t = y, e.collectionGuid) {
      const b = t.getSharedPluginData(
        "recursica",
        O
      );
      (!b || b.trim() === "") && t.setSharedPluginData(
        "recursica",
        O,
        e.collectionGuid
      );
    } else
      j(t);
  }
  return await B(t, e.modes), { collection: t };
}
async function st(e, t) {
  we(e, t);
  {
    const i = (await figma.variables.getLocalVariableCollectionsAsync()).find(
      (o) => o.name === e
    );
    return i || figma.variables.createVariableCollection(e);
  }
}
async function Q(e, t) {
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
function ct(e, t) {
  const a = e.resolvedType.toUpperCase(), i = t.toUpperCase();
  return a !== i ? (console.warn(
    `Variable type mismatch: Variable "${e.name}" has type "${a}" but expected "${i}". Skipping binding.`
  ), !1) : !0;
}
async function lt(e, t, a, i, o) {
  for (const [n, r] of Object.entries(t)) {
    const s = i.modes.find((u) => u.name === n);
    if (!s) {
      console.warn(
        `Mode "${n}" not found in collection "${i.name}" for variable "${e.name}". Skipping.`
      );
      continue;
    }
    const c = s.modeId;
    try {
      if (r == null)
        continue;
      if (typeof r == "string" || typeof r == "number" || typeof r == "boolean") {
        e.setValueForMode(c, r);
        continue;
      }
      if (typeof r == "object" && r !== null && "_varRef" in r && typeof r._varRef == "number") {
        const u = r;
        let d = null;
        const y = a.getVariableByIndex(
          u._varRef
        );
        if (y) {
          let b = null;
          if (o && y._colRef !== void 0) {
            const h = o.getCollectionByIndex(
              y._colRef
            );
            h && (b = (await Ne(h)).collection);
          }
          b && (d = await Q(
            b,
            y.variableName
          ));
        }
        if (d) {
          const b = {
            type: "VARIABLE_ALIAS",
            id: d.id
          };
          e.setValueForMode(c, b);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${n}" in variable "${e.name}". Variable reference index: ${u._varRef}`
          );
      }
    } catch (u) {
      console.warn(
        `Error setting value for mode "${n}" in variable "${e.name}":`,
        u
      );
    }
  }
}
async function ae(e, t, a, i) {
  const o = figma.variables.createVariable(
    e.variableName,
    t,
    e.variableType
  );
  return e.valuesByMode && await lt(
    o,
    e.valuesByMode,
    a,
    t,
    // Pass collection to look up modes by name
    i
  ), o;
}
async function xe(e, t, a) {
  const i = t.getVariableByIndex(e._varRef);
  if (!i)
    return console.warn(`Variable not found in table at index ${e._varRef}`), null;
  try {
    const o = i._colRef;
    if (o === void 0)
      return console.warn(
        `Variable "${i.variableName}" missing collection reference (_colRef)`
      ), null;
    const n = a.getCollectionByIndex(o);
    if (!n)
      return console.warn(
        `Collection not found at index ${o} for variable "${i.variableName}"`
      ), null;
    const { collection: r } = await Ne(n);
    let s = await Q(r, i.variableName);
    return s ? ct(s, i.variableType) ? s : null : i.valuesByMode ? (s = await ae(
      i,
      r,
      t,
      a
      // Pass collection table for alias resolution
    ), s) : (console.warn(
      `Cannot create variable "${i.variableName}" without valuesByMode data`
    ), null);
  } catch (o) {
    if (console.error(
      `Error resolving variable reference for "${i.variableName}":`,
      o
    ), o instanceof Error && o.message.includes("External collection"))
      throw o;
    return null;
  }
}
function dt(e, t) {
  if (!t || !q(e))
    return null;
  const a = t.getVariableByIndex(e._varRef);
  return a ? {
    type: "VARIABLE_ALIAS",
    id: a.id || "",
    // Fallback to empty string if id not available (new format)
    variableName: a.variableName,
    variableType: a.variableType,
    isLocal: a.isLocal || !1,
    collectionName: a.collectionName,
    collectionId: a.collectionId,
    variableKey: a.variableKey
  } : (console.log(`Variable not found in table at index ${e._varRef}`), null);
}
async function ut(e, t, a, i, o) {
  if (!(!t || typeof t != "object"))
    try {
      const n = e[a];
      if (!n || !Array.isArray(n))
        return;
      for (const [r, s] of Object.entries(t))
        if (r === "fills" && Array.isArray(s))
          for (let c = 0; c < s.length && c < n.length; c++) {
            const u = s[c];
            if (q(u) && i && o) {
              const d = await xe(
                u,
                i,
                o
              );
              d && n[c].boundVariables && (n[c].boundVariables[a] = {
                type: "VARIABLE_ALIAS",
                id: d.id
              });
            }
          }
        else {
          let c = null;
          q(s) && (c = dt(s, i)), c && await gt(e, r, c, i);
        }
    } catch (n) {
      console.log(`Error restoring bound variables for ${a}:`, n);
    }
}
async function gt(e, t, a, i) {
  try {
    let o = null;
    if (i) {
      if (a.isLocal) {
        const n = await st(
          a.collectionName || "",
          !0
        );
        o = await Q(
          n,
          a.variableName || ""
        ), !o && a.variableName && a.variableType && console.warn(
          `Cannot create variable "${a.variableName}" without valuesByMode. Use resolveVariableReferenceOnImport instead.`
        );
      } else if (a.variableKey)
        try {
          o = await figma.variables.importVariableByKeyAsync(
            a.variableKey
          );
        } catch (n) {
          console.log(
            `Could not import team variable: ${a.variableName}`
          );
        }
    }
    if (o) {
      const n = {
        type: "VARIABLE_ALIAS",
        id: o.id
      };
      e.boundVariables || (e.boundVariables = {}), e.boundVariables[t] || (e.boundVariables[t] = n);
    }
  } catch (o) {
    console.log(`Error binding variable to property ${t}:`, o);
  }
}
function ft(e, t) {
  const a = $e(t);
  if (e.visible === void 0 && (e.visible = a.visible), e.locked === void 0 && (e.locked = a.locked), e.opacity === void 0 && (e.opacity = a.opacity), e.rotation === void 0 && (e.rotation = a.rotation), e.blendMode === void 0 && (e.blendMode = a.blendMode), t === "FRAME" || t === "COMPONENT" || t === "INSTANCE") {
    const i = T;
    e.layoutMode === void 0 && (e.layoutMode = i.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = i.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = i.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = i.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = i.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = i.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = i.paddingRight), e.paddingTop === void 0 && (e.paddingTop = i.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = i.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = i.itemSpacing);
  }
  if (t === "TEXT") {
    const i = P;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = i.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = i.textAlignVertical), e.textCase === void 0 && (e.textCase = i.textCase), e.textDecoration === void 0 && (e.textDecoration = i.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = i.textAutoResize);
  }
}
async function Se(e, t, a = null, i = null, o = null) {
  var n;
  try {
    let r;
    switch (e.type) {
      case "FRAME":
        r = figma.createFrame();
        break;
      case "RECTANGLE":
        r = figma.createRectangle();
        break;
      case "ELLIPSE":
        r = figma.createEllipse();
        break;
      case "TEXT":
        r = figma.createText();
        break;
      case "VECTOR":
        r = figma.createVector();
        break;
      case "STAR":
        r = figma.createStar();
        break;
      case "LINE":
        r = figma.createLine();
        break;
      case "COMPONENT":
        r = figma.createComponent();
        break;
      case "INSTANCE":
        if (console.log("Found instance node: " + e.name), e.mainComponent && e.mainComponent.key)
          try {
            const s = await figma.importComponentByKeyAsync(
              e.mainComponent.key
            );
            s && s.type === "COMPONENT" ? (r = s.createInstance(), console.log(
              "Created instance from main component: " + e.mainComponent.name
            )) : (console.log("Main component not found, creating frame fallback"), r = figma.createFrame());
          } catch (s) {
            console.log(
              "Error creating instance: " + s + ", creating frame fallback"
            ), r = figma.createFrame();
          }
        else
          console.log("No main component info, creating frame fallback"), r = figma.createFrame();
        break;
      case "GROUP":
        r = figma.createFrame();
        break;
      case "BOOLEAN_OPERATION":
        console.log(
          "Boolean operation found: " + e.name + ", creating frame fallback"
        ), r = figma.createFrame();
        break;
      case "POLYGON":
        r = figma.createPolygon();
        break;
      default:
        console.log(
          "Unsupported node type: " + e.type + ", creating frame instead"
        ), r = figma.createFrame();
        break;
    }
    if (!r)
      return null;
    if (ft(r, e.type || "FRAME"), e.name !== void 0 && (r.name = e.name || "Unnamed Node"), e.x !== void 0 && (r.x = e.x), e.y !== void 0 && (r.y = e.y), e.width !== void 0 && e.height !== void 0 && r.resize(e.width, e.height), e.visible !== void 0 && (r.visible = e.visible), e.locked !== void 0 && (r.locked = e.locked), e.opacity !== void 0 && (r.opacity = e.opacity), e.rotation !== void 0 && (r.rotation = e.rotation), e.blendMode !== void 0 && (r.blendMode = e.blendMode), e.type !== "INSTANCE" && e.fills !== void 0)
      try {
        let s = e.fills;
        Array.isArray(s) && a && (s = s.map((c) => {
          if (c && typeof c == "object" && c.boundVariables) {
            const u = {};
            for (const [d, y] of Object.entries(
              c.boundVariables
            ))
              u[d] = y;
            return k(w({}, c), { boundVariables: u });
          }
          return c;
        })), r.fills = s, (n = e.boundVariables) != null && n.fills && await ut(
          r,
          e.boundVariables,
          "fills",
          a,
          i
        );
      } catch (s) {
        console.log("Error setting fills:", s);
      }
    if (e.strokes !== void 0 && e.strokes.length > 0)
      try {
        r.strokes = e.strokes;
      } catch (s) {
        console.log("Error setting strokes:", s);
      }
    if (e.strokeWeight !== void 0 && (r.strokeWeight = e.strokeWeight), e.strokeAlign !== void 0 && (r.strokeAlign = e.strokeAlign), e.cornerRadius !== void 0 && (r.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (r.effects = e.effects), (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && (e.layoutMode !== void 0 && (r.layoutMode = e.layoutMode), e.primaryAxisSizingMode !== void 0 && (r.primaryAxisSizingMode = e.primaryAxisSizingMode), e.counterAxisSizingMode !== void 0 && (r.counterAxisSizingMode = e.counterAxisSizingMode), e.primaryAxisAlignItems !== void 0 && (r.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (r.counterAxisAlignItems = e.counterAxisAlignItems), e.paddingLeft !== void 0 && (r.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (r.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (r.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (r.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (r.itemSpacing = e.itemSpacing)), (e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (r.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (r.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (r.dashPattern = e.dashPattern)), e.type === "TEXT" && e.characters !== void 0)
      try {
        if (e.fontName)
          try {
            await figma.loadFontAsync(e.fontName), r.fontName = e.fontName;
          } catch (s) {
            await figma.loadFontAsync({
              family: "Roboto",
              style: "Regular"
            }), r.fontName = { family: "Roboto", style: "Regular" };
          }
        else
          await figma.loadFontAsync({
            family: "Roboto",
            style: "Regular"
          }), r.fontName = { family: "Roboto", style: "Regular" };
        r.characters = e.characters, e.fontSize !== void 0 && (r.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (r.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (r.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (r.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (r.lineHeight = e.lineHeight), e.textCase !== void 0 && (r.textCase = e.textCase), e.textDecoration !== void 0 && (r.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (r.textAutoResize = e.textAutoResize);
      } catch (s) {
        console.log("Error setting text properties: " + s);
        try {
          r.characters = e.characters;
        } catch (c) {
          console.log("Could not set text characters: " + c);
        }
      }
    if (e.boundVariables) {
      for (const [s, c] of Object.entries(
        e.boundVariables
      ))
        if (s !== "fills" && q(c) && a && i) {
          const u = await xe(
            c,
            a,
            i
          );
          if (u) {
            const d = {
              type: "VARIABLE_ALIAS",
              id: u.id
            };
            r.boundVariables || (r.boundVariables = {}), r.boundVariables[s] || (r.boundVariables[s] = d);
          }
        }
    }
    if (e.children && Array.isArray(e.children))
      for (const s of e.children) {
        if (s._truncated) {
          console.log(
            `Skipping truncated children: ${s._reason || "Unknown"}`
          );
          continue;
        }
        const c = await Se(
          s,
          r,
          a,
          i
        );
        c && r.appendChild(c);
      }
    return t && t.appendChild(r), r;
  } catch (r) {
    return console.log(
      "Error recreating node " + (e.name || e.type) + ":",
      r
    ), null;
  }
}
async function pt(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), a = new Set(t.map((n) => n.name));
  if (!a.has(e))
    return e;
  let i = 1, o = `${e}_${i}`;
  for (; a.has(o); )
    i++, o = `${e}_${i}`;
  return o;
}
async function mt(e, t) {
  const a = /* @__PURE__ */ new Set();
  for (const n of e.variableIds)
    try {
      const r = await figma.variables.getVariableByIdAsync(n);
      r && a.add(r.name);
    } catch (r) {
      continue;
    }
  if (!a.has(t))
    return t;
  let i = 1, o = `${t}_${i}`;
  for (; a.has(o); )
    i++, o = `${t}_${i}`;
  return o;
}
function yt(e, t) {
  const a = e.resolvedType.toUpperCase(), i = t.toUpperCase();
  return a === i;
}
async function bt(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), a = V(e.collectionName);
  if (z(e.collectionName)) {
    for (const i of t)
      if (V(i.name) === a)
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
        O
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
async function ht(e) {
  await l.clear(), await l.log("=== Starting Page Import ===");
  const t = [];
  try {
    const a = e.jsonData;
    if (!a)
      return await l.error("JSON data is required"), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "JSON data is required",
        data: {}
      };
    if (await l.log("Starting import process"), await l.log("Validating metadata..."), !a.metadata)
      return await l.error("Invalid JSON format. Expected metadata."), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "Invalid JSON format. Expected metadata.",
        data: {}
      };
    const i = a.metadata;
    if (!i.guid || typeof i.guid != "string")
      return await l.error(
        "Invalid metadata. Missing or invalid 'guid' field."
      ), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "Invalid metadata. Missing or invalid 'guid' field.",
        data: {}
      };
    if (!i.name || typeof i.name != "string")
      return await l.error(
        "Invalid metadata. Missing or invalid 'name' field."
      ), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "Invalid metadata. Missing or invalid 'name' field.",
        data: {}
      };
    if (await l.log(
      `Metadata validated: guid=${i.guid}, name=${i.name}`
    ), await l.log("Loading string table..."), !a.stringTable)
      return await l.error(
        "Invalid JSON format. String table is required."
      ), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "Invalid JSON format. String table is required.",
        data: {}
      };
    let o;
    try {
      o = Y.fromTable(a.stringTable), await l.log("String table loaded successfully");
    } catch (f) {
      const g = `Failed to load string table: ${f instanceof Error ? f.message : "Unknown error"}`;
      return await l.error(g), {
        type: "importPage",
        success: !1,
        error: !0,
        message: g,
        data: {}
      };
    }
    await l.log("Expanding JSON data...");
    const n = it(a, o);
    if (await l.log("JSON expanded successfully"), await l.log("Loading collections table..."), !n.collections)
      return await l.log("No collections table found in JSON"), await l.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: i.name }
      };
    let r;
    try {
      r = J.fromTable(n.collections), await l.log(
        `Loaded collections table with ${r.getSize()} collection(s)`
      );
    } catch (f) {
      const g = `Failed to load collections table: ${f instanceof Error ? f.message : "Unknown error"}`;
      return await l.error(g), {
        type: "importPage",
        success: !1,
        error: !0,
        message: g,
        data: {}
      };
    }
    await l.log(
      "Matching collections with existing local collections..."
    );
    const s = r.getTable(), c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map();
    for (const [f, g] of Object.entries(s)) {
      if (g.isLocal === !1) {
        await l.log(
          `Skipping remote collection: "${g.collectionName}" (index ${f})`
        );
        continue;
      }
      const m = await bt(g);
      m.matchType === "recognized" ? (await l.log(
        `✓ Recognized collection by GUID: "${g.collectionName}" (index ${f})`
      ), c.set(f, m.collection)) : m.matchType === "potential" ? (await l.log(
        `? Potential match by name: "${g.collectionName}" (index ${f})`
      ), u.set(f, {
        entry: g,
        collection: m.collection
      })) : (await l.log(
        `✗ No match found for collection: "${g.collectionName}" (index ${f}) - will create new`
      ), d.set(f, g));
    }
    await l.log(
      `Collection matching complete: ${c.size} recognized, ${u.size} potential matches, ${d.size} to create`
    ), u.size > 0 && await l.log(
      `Prompting user for ${u.size} potential match(es)...`
    );
    for (const [f, { entry: g, collection: m }] of u.entries())
      try {
        const I = z(g.collectionName) ? V(g.collectionName) : m.name, A = `Found existing "${I}" variable collection. Should I use it?`;
        await l.log(
          `Prompting user about potential match: "${I}"`
        ), await ve.prompt(A, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
          // No timeout
        }), await l.log(
          `✓ User confirmed: Using existing collection "${I}" (index ${f})`
        ), c.set(f, m), await B(m, g.modes), await l.log(
          `  ✓ Ensured modes for collection "${I}" (${g.modes.length} mode(s))`
        );
      } catch (I) {
        await l.log(
          `✗ User rejected: Will create new collection for "${g.collectionName}" (index ${f})`
        ), d.set(f, g);
      }
    if (c.size > 0) {
      await l.log(
        "Ensuring modes exist for recognized collections..."
      );
      for (const [f, g] of c.entries()) {
        const m = s[f];
        m && (u.has(f) || (await B(g, m.modes), await l.log(
          `  ✓ Ensured modes for collection "${g.name}" (${m.modes.length} mode(s))`
        )));
      }
    }
    d.size > 0 && await l.log(
      `Creating ${d.size} new collection(s)...`
    );
    for (const [f, g] of d.entries()) {
      const m = V(g.collectionName), I = await pt(m);
      I !== m ? await l.log(
        `Creating collection: "${I}" (normalized: "${m}" - name conflict resolved)`
      ) : await l.log(`Creating collection: "${I}"`);
      const A = figma.variables.createVariableCollection(I);
      t.push(A);
      let E;
      if (z(g.collectionName)) {
        const M = oe(g.collectionName);
        M && (E = M);
      } else g.collectionGuid && (E = g.collectionGuid);
      E && (A.setSharedPluginData(
        "recursica",
        O,
        E
      ), await l.log(
        `  Stored GUID: ${E.substring(0, 8)}...`
      )), await B(A, g.modes), await l.log(
        `  ✓ Created collection "${I}" with ${g.modes.length} mode(s)`
      ), c.set(f, A);
    }
    if (await l.log("Collection creation complete"), await l.log("Loading variables table..."), !n.variables)
      return await l.log("No variables table found in JSON"), await l.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no variables to process)",
        data: { pageName: i.name }
      };
    let y;
    try {
      y = W.fromTable(n.variables), await l.log(
        `Loaded variables table with ${y.getSize()} variable(s)`
      );
    } catch (f) {
      const g = `Failed to load variables table: ${f instanceof Error ? f.message : "Unknown error"}`;
      return await l.error(g), {
        type: "importPage",
        success: !1,
        error: !0,
        message: g,
        data: {}
      };
    }
    const b = [], h = /* @__PURE__ */ new Map(), C = new Set(
      t.map((f) => f.id)
    );
    await l.log("Matching and creating variables in collections...");
    const S = y.getTable();
    let v = 0, N = 0, x = 0;
    for (const [f, g] of Object.entries(S)) {
      if (v++, g._colRef === void 0) {
        await l.log(
          `⚠ Skipping variable "${g.variableName}" (index ${f}): No collection reference`
        );
        continue;
      }
      const m = c.get(String(g._colRef));
      if (!m) {
        await l.log(
          `⚠ Skipping variable "${g.variableName}" (index ${f}): Collection not found (index ${g._colRef})`
        );
        continue;
      }
      const I = C.has(
        m.id
      );
      let A;
      typeof g.variableType == "number" ? A = {
        1: "COLOR",
        2: "FLOAT",
        3: "STRING",
        4: "BOOLEAN"
      }[g.variableType] || String(g.variableType) : A = g.variableType;
      const E = await Q(
        m,
        g.variableName
      );
      if (E)
        if (yt(E, A))
          h.set(f, E), N++, await l.log(
            `✓ Matched existing variable: "${g.variableName}" (type: ${A}) in collection "${m.name}"`
          );
        else {
          const M = await mt(
            m,
            g.variableName
          ), U = await ae(
            k(w({}, g), {
              variableName: M,
              variableType: A
            }),
            m,
            y,
            r
          );
          I || b.push(U), h.set(f, U), x++, await l.log(
            `✗ Type mismatch for "${g.variableName}" (expected: ${A}, found: ${E.resolvedType}) - created "${M}"`
          );
        }
      else {
        const M = await ae(
          k(w({}, g), {
            variableType: A
          }),
          m,
          y,
          r
        );
        I || b.push(M), h.set(f, M), x++, await l.log(
          `✓ Created variable: "${g.variableName}" (type: ${A}) in collection "${m.name}"`
        );
      }
    }
    return await l.log(
      `Variable processing complete: ${v} processed, ${N} matched, ${x} created`
    ), await l.log("=== Import Complete ==="), await l.log(
      `Successfully processed ${c.size} collection(s) and ${v} variable(s)`
    ), {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Collections and variables imported successfully",
      data: { pageName: i.name }
    };
  } catch (a) {
    const i = a instanceof Error ? a.message : "Unknown error occurred";
    return await l.error(`Import failed: ${i}`), a instanceof Error && a.stack && await l.error(`Stack trace: ${a.stack}`), console.error("Error importing page:", a), {
      type: "importPage",
      success: !1,
      error: !0,
      message: i,
      data: {}
    };
  }
}
async function At(e) {
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
    const o = await X(
      i,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + i.name + " (index: " + a + ")"
    );
    const n = JSON.stringify(o, null, 2), r = JSON.parse(n), s = "Copy - " + r.name, c = figma.createPage();
    if (c.name = s, figma.root.appendChild(c), r.children && r.children.length > 0) {
      let y = function(h) {
        h.forEach((C) => {
          const S = (C.x || 0) + (C.width || 0);
          S > b && (b = S), C.children && C.children.length > 0 && y(C.children);
        });
      };
      console.log(
        "Recreating " + r.children.length + " top-level children..."
      );
      let b = 0;
      y(r.children), console.log("Original content rightmost edge: " + b);
      for (const h of r.children)
        await Se(h, c, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const u = ce(r);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: r.name,
        newPageName: s,
        totalNodes: u
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
async function vt(e) {
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
async function wt(e) {
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
async function Nt(e) {
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
async function xt(e) {
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
function ie(e, t = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: t
  };
}
function Ce(e, t, a = {}) {
  const i = t instanceof Error ? t.message : t;
  return {
    type: e,
    success: !1,
    error: !0,
    message: i,
    data: a
  };
}
function re(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
const Ie = "RecursicaPublishedMetadata";
async function St(e) {
  try {
    const t = figma.currentPage;
    await figma.loadAllPagesAsync();
    const i = figma.root.children.findIndex(
      (s) => s.id === t.id
    ), o = t.getPluginData(Ie);
    if (!o) {
      const u = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: re(t.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: i
      };
      return ie("getComponentMetadata", u);
    }
    const r = {
      componentMetadata: JSON.parse(o),
      currentPageIndex: i
    };
    return ie("getComponentMetadata", r);
  } catch (t) {
    return console.error("Error getting component metadata:", t), Ce(
      "getComponentMetadata",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function Ct(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children, a = [];
    for (const o of t) {
      if (o.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${o.name} (type: ${o.type})`
        );
        continue;
      }
      const n = o, r = n.getPluginData(Ie);
      if (r)
        try {
          const s = JSON.parse(r);
          a.push(s);
        } catch (s) {
          console.warn(
            `Failed to parse metadata for page "${n.name}":`,
            s
          );
          const u = {
            _ver: 1,
            id: "",
            name: re(n.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          a.push(u);
        }
      else {
        const c = {
          _ver: 1,
          id: "",
          name: re(n.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        a.push(c);
      }
    }
    return ie("getAllComponents", {
      components: a
    });
  } catch (t) {
    return console.error("Error getting all components:", t), Ce(
      "getAllComponents",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function It(e) {
  try {
    const t = e.requestId, a = e.action;
    return !t || !a ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (ve.handleResponse({ requestId: t, action: a }), {
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
const Et = {
  getCurrentUser: Le,
  loadPages: Pe,
  exportPage: rt,
  importPage: ht,
  quickCopy: At,
  storeAuthData: vt,
  loadAuthData: wt,
  clearAuthData: Nt,
  storeSelectedRepo: xt,
  getComponentMetadata: St,
  getAllComponents: Ct,
  pluginPromptResponse: It
}, Tt = Et;
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
    const a = t.type, i = Tt[a];
    if (!i) {
      console.warn("Unknown message type:", t.type);
      const n = {
        type: t.type,
        success: !1,
        error: !0,
        message: "Unknown message type: " + t.type,
        data: {},
        requestId: t.requestId
      };
      figma.ui.postMessage(n);
      return;
    }
    const o = await i(t.data);
    figma.ui.postMessage(k(w({}, o), {
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
