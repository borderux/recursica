var Ue = Object.defineProperty, Be = Object.defineProperties;
var je = Object.getOwnPropertyDescriptors;
var ve = Object.getOwnPropertySymbols;
var De = Object.prototype.hasOwnProperty, He = Object.prototype.propertyIsEnumerable;
var pe = (e, t, a) => t in e ? Ue(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, x = (e, t) => {
  for (var a in t || (t = {}))
    De.call(t, a) && pe(e, a, t[a]);
  if (ve)
    for (var a of ve(t))
      He.call(t, a) && pe(e, a, t[a]);
  return e;
}, _ = (e, t) => Be(e, je(t));
var L = (e, t, a) => pe(e, typeof t != "symbol" ? t + "" : t, a);
async function Ke(e) {
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
async function qe(e) {
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
const k = {
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
}, O = _(x({}, k), {
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
}), z = _(x({}, k), {
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
}), H = _(x({}, k), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), Ee = _(x({}, k), {
  cornerRadius: 0
}), Je = _(x({}, k), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function We(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return O;
    case "TEXT":
      return z;
    case "VECTOR":
      return H;
    case "LINE":
      return Je;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return Ee;
    default:
      return k;
  }
}
function v(e, t) {
  if (Array.isArray(e))
    return Array.isArray(t) ? e.length !== t.length || e.some((a, n) => v(a, t[n])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof t == "object" && t !== null) {
      const a = Object.keys(e), n = Object.keys(t);
      return a.length !== n.length ? !0 : a.some(
        (r) => !(r in t) || v(e[r], t[r])
      );
    }
    return !0;
  }
  return e !== t;
}
const ue = {
  LAYER: "00000000-0000-0000-0000-000000000001",
  TOKENS: "00000000-0000-0000-0000-000000000002",
  THEME: "00000000-0000-0000-0000-000000000003"
}, G = {
  LAYER: "Layer",
  TOKENS: "Tokens",
  THEME: "Theme"
};
function j(e) {
  const t = e.trim(), a = t.toLowerCase();
  return a === "themes" ? G.THEME : a === "token" ? G.TOKENS : a === "layer" ? G.LAYER : a === "tokens" ? G.TOKENS : a === "theme" ? G.THEME : t;
}
function D(e) {
  const t = j(e);
  return t === G.LAYER || t === G.TOKENS || t === G.THEME;
}
function he(e) {
  const t = j(e);
  if (t === G.LAYER)
    return ue.LAYER;
  if (t === G.TOKENS)
    return ue.TOKENS;
  if (t === G.THEME)
    return ue.THEME;
}
class ie {
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
    const n = new Set(t);
    for (const r of a)
      n.add(r);
    return Array.from(n);
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
    const n = j(
      t.collectionName
    );
    if (D(t.collectionName)) {
      const o = this.findCollectionByNormalizedName(n);
      if (o !== void 0) {
        const p = this.collections[o];
        return p.modes = this.mergeModes(
          p.modes,
          t.modes
        ), this.collectionMap.set(a, o), o;
      }
    }
    const r = this.nextIndex++;
    this.collectionMap.set(a, r);
    const s = _(x({}, t), {
      collectionName: n
    });
    if (D(t.collectionName)) {
      const o = he(
        t.collectionName
      );
      o && (s.collectionGuid = o), this.normalizedNameMap.set(n, r);
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
      const n = this.collections[a], r = x({
        collectionName: n.collectionName,
        modes: n.modes
      }, n.collectionGuid && { collectionGuid: n.collectionGuid });
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
    const a = new ie(), n = Object.entries(t).sort(
      (s, o) => parseInt(s[0], 10) - parseInt(o[0], 10)
    );
    for (const [s, o] of n) {
      const p = parseInt(s, 10), u = (r = o.isLocal) != null ? r : !0, l = j(
        o.collectionName || ""
      ), m = o.collectionId || o.collectionGuid || `temp:${p}:${l}`, d = x({
        collectionName: l,
        collectionId: m,
        isLocal: u,
        modes: o.modes || []
      }, o.collectionGuid && {
        collectionGuid: o.collectionGuid
      });
      a.collectionMap.set(m, p), a.collections[p] = d, D(l) && a.normalizedNameMap.set(l, p), a.nextIndex = Math.max(
        a.nextIndex,
        p + 1
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
const Ye = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, Xe = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function Ze(e) {
  var a;
  const t = e.toUpperCase();
  return (a = Ye[t]) != null ? a : e;
}
function Qe(e) {
  var t;
  return typeof e == "number" ? (t = Xe[e]) != null ? t : e.toString() : e;
}
class oe {
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
    const n = this.nextIndex++;
    return this.variableMap.set(a, n), this.variables[n] = t, n;
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
    for (const [n, r] of Object.entries(t))
      typeof r == "object" && r !== null && "_varRef" in r && typeof r._varRef == "number" ? a[n] = {
        _varRef: r._varRef
      } : a[n] = r;
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
      const n = this.variables[a], r = this.serializeValuesByMode(
        n.valuesByMode
      ), s = x(x({
        variableName: n.variableName,
        variableType: Ze(n.variableType)
      }, n._colRef !== void 0 && { _colRef: n._colRef }), r && { valuesByMode: r });
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
    const a = new oe(), n = Object.entries(t).sort(
      (r, s) => parseInt(r[0], 10) - parseInt(s[0], 10)
    );
    for (const [r, s] of n) {
      const o = parseInt(r, 10), p = Qe(s.variableType), u = _(x({}, s), {
        variableType: p
        // Always a string after expansion
      });
      a.variables[o] = u, a.nextIndex = Math.max(a.nextIndex, o + 1);
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
function et(e) {
  return {
    _varRef: e
  };
}
function $e(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let tt = 0;
const K = /* @__PURE__ */ new Map();
function at(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const t = K.get(e.requestId);
  t && (K.delete(e.requestId), e.error || !e.guid ? t.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : t.resolve(e.guid));
}
function ye() {
  return new Promise((e, t) => {
    const a = `guid_${Date.now()}_${++tt}`;
    K.set(a, { resolve: e, reject: t }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: a
    }), setTimeout(() => {
      K.has(a) && (K.delete(a), t(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
const Pe = {
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
async function Q() {
  return new Promise((e) => setTimeout(e, 0));
}
const i = {
  clear: async () => {
    console.clear(), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: "__CLEAR__"
      }
    }), await Q();
  },
  log: async (e) => {
    console.log(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    }), await Q();
  },
  warning: async (e) => {
    console.warn(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    }), await Q();
  },
  error: async (e) => {
    console.error(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    }), await Q();
  }
};
function nt(e, t) {
  const a = t.modes.find((n) => n.modeId === e);
  return a ? a.name : e;
}
async function Me(e, t, a, n, r = /* @__PURE__ */ new Set()) {
  const s = {};
  for (const [o, p] of Object.entries(e)) {
    const u = nt(o, n);
    if (p == null) {
      s[u] = p;
      continue;
    }
    if (typeof p == "string" || typeof p == "number" || typeof p == "boolean") {
      s[u] = p;
      continue;
    }
    if (typeof p == "object" && p !== null && "type" in p && p.type === "VARIABLE_ALIAS" && "id" in p) {
      const l = p.id;
      if (r.has(l)) {
        s[u] = {
          type: "VARIABLE_ALIAS",
          id: l
        };
        continue;
      }
      const m = await figma.variables.getVariableByIdAsync(l);
      if (!m) {
        s[u] = {
          type: "VARIABLE_ALIAS",
          id: l
        };
        continue;
      }
      const d = new Set(r);
      d.add(l);
      const g = await figma.variables.getVariableCollectionByIdAsync(
        m.variableCollectionId
      ), c = m.key;
      if (!c) {
        s[u] = {
          type: "VARIABLE_ALIAS",
          id: l
        };
        continue;
      }
      const h = {
        variableName: m.name,
        variableType: m.resolvedType,
        collectionName: g == null ? void 0 : g.name,
        collectionId: m.variableCollectionId,
        variableKey: c,
        id: l,
        isLocal: !m.remote
      };
      if (g) {
        const b = await Re(
          g,
          a
        );
        h._colRef = b, m.valuesByMode && (h.valuesByMode = await Me(
          m.valuesByMode,
          t,
          a,
          g,
          // Pass collection for mode ID to name conversion
          d
        ));
      }
      const w = t.addVariable(h);
      s[u] = {
        type: "VARIABLE_ALIAS",
        id: l,
        _varRef: w
      };
    } else
      s[u] = p;
  }
  return s;
}
const ee = "recursica:collectionId";
async function rt(e) {
  if (e.remote === !0) {
    const a = Pe[e.id];
    if (!a) {
      const r = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await i.error(r), new Error(r);
    }
    return a.guid;
  } else {
    if (D(e.name)) {
      const r = he(e.name);
      if (r) {
        const s = e.getSharedPluginData(
          "recursica",
          ee
        );
        return (!s || s.trim() === "") && e.setSharedPluginData(
          "recursica",
          ee,
          r
        ), r;
      }
    }
    const a = e.getSharedPluginData(
      "recursica",
      ee
    );
    if (a && a.trim() !== "")
      return a;
    const n = await ye();
    return e.setSharedPluginData("recursica", ee, n), n;
  }
}
function it(e, t) {
  if (t)
    return;
  const a = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(a))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Re(e, t) {
  const a = !e.remote, n = t.getCollectionIndex(e.id);
  if (n !== -1)
    return n;
  it(e.name, a);
  const r = await rt(e), s = e.modes.map((l) => l.name), o = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: a,
    modes: s,
    collectionGuid: r
  }, p = t.addCollection(o), u = a ? "local" : "remote";
  return await i.log(
    `  Added ${u} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), p;
}
async function Ne(e, t, a) {
  if (!e || typeof e != "object" || e.type !== "VARIABLE_ALIAS")
    return null;
  try {
    const n = await figma.variables.getVariableByIdAsync(e.id);
    if (!n)
      return console.log("Could not resolve variable alias:", e.id), null;
    const r = await figma.variables.getVariableCollectionByIdAsync(
      n.variableCollectionId
    );
    if (!r)
      return console.log("Could not resolve collection for variable:", e.id), null;
    const s = n.key;
    if (!s)
      return console.log("Variable missing key:", e.id), null;
    const o = await Re(
      r,
      a
    ), p = {
      variableName: n.name,
      variableType: n.resolvedType,
      _colRef: o,
      // Reference to collection table (v2.4.0+)
      variableKey: s,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    n.valuesByMode && (p.valuesByMode = await Me(
      n.valuesByMode,
      t,
      a,
      r,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const u = t.addVariable(p);
    return et(u);
  } catch (n) {
    const r = n instanceof Error ? n.message : String(n);
    throw console.error("Could not resolve variable alias:", e.id, n), new Error(
      `Failed to resolve variable alias ${e.id}: ${r}`
    );
  }
}
async function ne(e, t, a) {
  if (!e || typeof e != "object") return e;
  const n = {};
  for (const r in e)
    if (Object.prototype.hasOwnProperty.call(e, r)) {
      const s = e[r];
      if (s && typeof s == "object" && !Array.isArray(s))
        if (s.type === "VARIABLE_ALIAS") {
          const o = await Ne(
            s,
            t,
            a
          );
          o && (n[r] = o);
        } else
          n[r] = await ne(
            s,
            t,
            a
          );
      else Array.isArray(s) ? n[r] = await Promise.all(
        s.map(async (o) => (o == null ? void 0 : o.type) === "VARIABLE_ALIAS" ? await Ne(
          o,
          t,
          a
        ) || o : o && typeof o == "object" ? await ne(
          o,
          t,
          a
        ) : o)
      ) : n[r] = s;
    }
  return n;
}
async function ot(e, t, a) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (n) => {
      if (!n || typeof n != "object") return n;
      const r = {};
      for (const s in n)
        Object.prototype.hasOwnProperty.call(n, s) && (s === "boundVariables" ? r[s] = await ne(
          n[s],
          t,
          a
        ) : r[s] = n[s]);
      return r;
    })
  );
}
async function st(e, t) {
  const a = {}, n = /* @__PURE__ */ new Set();
  if (e.type && (a.type = e.type, n.add("type")), e.id && (a.id = e.id, n.add("id")), e.name !== void 0 && e.name !== "" && (a.name = e.name, n.add("name")), e.x !== void 0 && e.x !== 0 && (a.x = e.x, n.add("x")), e.y !== void 0 && e.y !== 0 && (a.y = e.y, n.add("y")), e.width !== void 0 && (a.width = e.width, n.add("width")), e.height !== void 0 && (a.height = e.height, n.add("height")), e.visible !== void 0 && v(e.visible, k.visible) && (a.visible = e.visible, n.add("visible")), e.locked !== void 0 && v(e.locked, k.locked) && (a.locked = e.locked, n.add("locked")), e.opacity !== void 0 && v(e.opacity, k.opacity) && (a.opacity = e.opacity, n.add("opacity")), e.rotation !== void 0 && v(e.rotation, k.rotation) && (a.rotation = e.rotation, n.add("rotation")), e.blendMode !== void 0 && v(e.blendMode, k.blendMode) && (a.blendMode = e.blendMode, n.add("blendMode")), e.effects !== void 0 && v(e.effects, k.effects) && (a.effects = e.effects, n.add("effects")), e.fills !== void 0) {
    const r = await ot(
      e.fills,
      t.variableTable,
      t.collectionTable
    );
    v(r, k.fills) && (a.fills = r), n.add("fills");
  }
  if (e.strokes !== void 0 && v(e.strokes, k.strokes) && (a.strokes = e.strokes, n.add("strokes")), e.strokeWeight !== void 0 && v(e.strokeWeight, k.strokeWeight) && (a.strokeWeight = e.strokeWeight, n.add("strokeWeight")), e.strokeAlign !== void 0 && v(e.strokeAlign, k.strokeAlign) && (a.strokeAlign = e.strokeAlign, n.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const r = await ne(
      e.boundVariables,
      t.variableTable,
      t.collectionTable
    );
    Object.keys(r).length > 0 && (a.boundVariables = r), n.add("boundVariables");
  }
  return a;
}
async function Ce(e, t) {
  const a = {}, n = /* @__PURE__ */ new Set();
  if (e.type === "COMPONENT")
    try {
      e.componentPropertyDefinitions && (a.componentPropertyDefinitions = e.componentPropertyDefinitions, n.add("componentPropertyDefinitions"));
    } catch (r) {
    }
  return e.layoutMode !== void 0 && v(e.layoutMode, O.layoutMode) && (a.layoutMode = e.layoutMode, n.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && v(
    e.primaryAxisSizingMode,
    O.primaryAxisSizingMode
  ) && (a.primaryAxisSizingMode = e.primaryAxisSizingMode, n.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && v(
    e.counterAxisSizingMode,
    O.counterAxisSizingMode
  ) && (a.counterAxisSizingMode = e.counterAxisSizingMode, n.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && v(
    e.primaryAxisAlignItems,
    O.primaryAxisAlignItems
  ) && (a.primaryAxisAlignItems = e.primaryAxisAlignItems, n.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && v(
    e.counterAxisAlignItems,
    O.counterAxisAlignItems
  ) && (a.counterAxisAlignItems = e.counterAxisAlignItems, n.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && v(e.paddingLeft, O.paddingLeft) && (a.paddingLeft = e.paddingLeft, n.add("paddingLeft")), e.paddingRight !== void 0 && v(e.paddingRight, O.paddingRight) && (a.paddingRight = e.paddingRight, n.add("paddingRight")), e.paddingTop !== void 0 && v(e.paddingTop, O.paddingTop) && (a.paddingTop = e.paddingTop, n.add("paddingTop")), e.paddingBottom !== void 0 && v(e.paddingBottom, O.paddingBottom) && (a.paddingBottom = e.paddingBottom, n.add("paddingBottom")), e.itemSpacing !== void 0 && v(e.itemSpacing, O.itemSpacing) && (a.itemSpacing = e.itemSpacing, n.add("itemSpacing")), e.cornerRadius !== void 0 && v(e.cornerRadius, O.cornerRadius) && (a.cornerRadius = e.cornerRadius, n.add("cornerRadius")), e.clipsContent !== void 0 && v(e.clipsContent, O.clipsContent) && (a.clipsContent = e.clipsContent, n.add("clipsContent")), e.layoutWrap !== void 0 && v(e.layoutWrap, O.layoutWrap) && (a.layoutWrap = e.layoutWrap, n.add("layoutWrap")), e.layoutGrow !== void 0 && v(e.layoutGrow, O.layoutGrow) && (a.layoutGrow = e.layoutGrow, n.add("layoutGrow")), a;
}
async function ct(e, t) {
  const a = {}, n = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (a.characters = e.characters, n.add("characters")), e.fontName !== void 0 && (a.fontName = e.fontName, n.add("fontName")), e.fontSize !== void 0 && (a.fontSize = e.fontSize, n.add("fontSize")), e.textAlignHorizontal !== void 0 && v(
    e.textAlignHorizontal,
    z.textAlignHorizontal
  ) && (a.textAlignHorizontal = e.textAlignHorizontal, n.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && v(
    e.textAlignVertical,
    z.textAlignVertical
  ) && (a.textAlignVertical = e.textAlignVertical, n.add("textAlignVertical")), e.letterSpacing !== void 0 && v(e.letterSpacing, z.letterSpacing) && (a.letterSpacing = e.letterSpacing, n.add("letterSpacing")), e.lineHeight !== void 0 && v(e.lineHeight, z.lineHeight) && (a.lineHeight = e.lineHeight, n.add("lineHeight")), e.textCase !== void 0 && v(e.textCase, z.textCase) && (a.textCase = e.textCase, n.add("textCase")), e.textDecoration !== void 0 && v(e.textDecoration, z.textDecoration) && (a.textDecoration = e.textDecoration, n.add("textDecoration")), e.textAutoResize !== void 0 && v(e.textAutoResize, z.textAutoResize) && (a.textAutoResize = e.textAutoResize, n.add("textAutoResize")), e.paragraphSpacing !== void 0 && v(
    e.paragraphSpacing,
    z.paragraphSpacing
  ) && (a.paragraphSpacing = e.paragraphSpacing, n.add("paragraphSpacing")), e.paragraphIndent !== void 0 && v(e.paragraphIndent, z.paragraphIndent) && (a.paragraphIndent = e.paragraphIndent, n.add("paragraphIndent")), e.listOptions !== void 0 && v(e.listOptions, z.listOptions) && (a.listOptions = e.listOptions, n.add("listOptions")), a;
}
async function lt(e, t) {
  const a = {}, n = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && v(e.fillGeometry, H.fillGeometry) && (a.fillGeometry = e.fillGeometry, n.add("fillGeometry")), e.strokeGeometry !== void 0 && v(e.strokeGeometry, H.strokeGeometry) && (a.strokeGeometry = e.strokeGeometry, n.add("strokeGeometry")), e.strokeCap !== void 0 && v(e.strokeCap, H.strokeCap) && (a.strokeCap = e.strokeCap, n.add("strokeCap")), e.strokeJoin !== void 0 && v(e.strokeJoin, H.strokeJoin) && (a.strokeJoin = e.strokeJoin, n.add("strokeJoin")), e.dashPattern !== void 0 && v(e.dashPattern, H.dashPattern) && (a.dashPattern = e.dashPattern, n.add("dashPattern")), a;
}
async function dt(e, t) {
  const a = {}, n = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && v(e.cornerRadius, Ee.cornerRadius) && (a.cornerRadius = e.cornerRadius, n.add("cornerRadius")), e.pointCount !== void 0 && (a.pointCount = e.pointCount, n.add("pointCount")), e.innerRadius !== void 0 && (a.innerRadius = e.innerRadius, n.add("innerRadius")), e.pointCount !== void 0 && (a.pointCount = e.pointCount, n.add("pointCount")), a;
}
const te = /* @__PURE__ */ new Map();
let pt = 0;
function ut() {
  return `prompt_${Date.now()}_${++pt}`;
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
    var p;
    const a = typeof t == "number" ? { timeoutMs: t } : t, n = (p = a == null ? void 0 : a.timeoutMs) != null ? p : 3e5, r = a == null ? void 0 : a.okLabel, s = a == null ? void 0 : a.cancelLabel, o = ut();
    return new Promise((u, l) => {
      const m = n === -1 ? null : setTimeout(() => {
        te.delete(o), l(new Error(`Plugin prompt timeout: ${e}`));
      }, n);
      te.set(o, {
        resolve: u,
        reject: l,
        timeout: m
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: x(x({
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
    const { requestId: t, action: a } = e, n = te.get(t);
    if (!n) {
      console.warn(
        `Received response for unknown prompt request: ${t}`
      );
      return;
    }
    n.timeout && clearTimeout(n.timeout), te.delete(t), a === "ok" ? n.resolve() : n.reject(new Error("User cancelled"));
  }
}, gt = "RecursicaPublishedMetadata";
function ge(e) {
  let t = e, a = !1;
  try {
    if (a = t.parent !== null && t.parent !== void 0, !a)
      return { page: null, reason: "detached" };
  } catch (n) {
    return { page: null, reason: "detached" };
  }
  for (; t; ) {
    if (t.type === "PAGE")
      return { page: t, reason: "found" };
    try {
      const n = t.parent;
      if (!n)
        return { page: null, reason: "broken_chain" };
      t = n;
    } catch (n) {
      return { page: null, reason: "access_error" };
    }
  }
  return { page: null, reason: "broken_chain" };
}
function Ie(e) {
  try {
    const t = e.getPluginData(gt);
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
async function mt(e, t) {
  const a = {}, n = /* @__PURE__ */ new Set();
  if (a._isInstance = !0, n.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const r = await e.getMainComponentAsync();
    if (!r) {
      const A = e.name || "(unnamed)", T = e.id;
      if (t.detachedComponentsHandled.has(T))
        await i.log(
          `Treating detached instance "${A}" as internal instance (already prompted)`
        );
      else {
        await i.warning(
          `Found detached instance: "${A}" (main component is missing)`
        );
        const B = `Found detached instance "${A}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await q.prompt(B, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(T), await i.log(
            `Treating detached instance "${A}" as internal instance`
          );
        } catch (X) {
          if (X instanceof Error && X.message === "User cancelled") {
            const E = `Export cancelled: Detached instance "${A}" found. Please fix the instance before exporting.`;
            await i.error(E);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch (P) {
              console.warn("Could not scroll to instance:", P);
            }
            throw new Error(E);
          } else
            throw X;
        }
      }
      if (!ge(e).page) {
        const B = `Detached instance "${A}" is not on any page. Cannot export.`;
        throw await i.error(B), new Error(B);
      }
      let S, $;
      try {
        e.variantProperties && (S = e.variantProperties), e.componentProperties && ($ = e.componentProperties);
      } catch (B) {
      }
      const U = x(x({
        instanceType: "internal",
        componentName: A,
        componentNodeId: e.id
      }, S && { variantProperties: S }), $ && { componentProperties: $ }), Y = t.instanceTable.addInstance(U);
      return a._instanceRef = Y, n.add("_instanceRef"), await i.log(
        `  Exported detached INSTANCE: "${A}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), a;
    }
    const s = e.name || "(unnamed)", o = r.name || "(unnamed)", p = r.remote === !0, l = ge(e).page, m = ge(r), d = m.page;
    let g, c = d;
    if (p)
      if (d) {
        const A = Ie(d);
        A != null && A.id ? (g = "normal", c = d, await i.log(
          `  Component "${o}" is from library but also exists on local page "${d.name}" with metadata. Treating as "normal" instance.`
        )) : (g = "remote", await i.log(
          `  Component "${o}" is from library and exists on local page "${d.name}" but has no metadata. Treating as "remote" instance.`
        ));
      } else
        g = "remote", await i.log(
          `  Component "${o}" is from library and not on a local page. Treating as "remote" instance.`
        );
    else if (d && l && d.id === l.id)
      g = "internal";
    else if (d && l && d.id !== l.id)
      g = "normal";
    else if (d && !l)
      g = "normal";
    else if (!p && m.reason === "detached") {
      const A = r.id;
      if (t.detachedComponentsHandled.has(A))
        g = "remote", await i.log(
          `Treating detached instance "${s}" -> component "${o}" as remote instance (already prompted)`
        );
      else {
        await i.warning(
          `Found detached instance: "${s}" -> component "${o}" (component is not on any page)`
        );
        try {
          await figma.viewport.scrollAndZoomIntoView([r]);
        } catch (I) {
          console.warn("Could not scroll to component:", I);
        }
        const T = `Found detached instance "${s}" attached to component "${o}". This should be fixed. Continue to publish?`;
        try {
          await q.prompt(T, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(A), g = "remote", await i.log(
            `Treating detached instance "${s}" as remote instance (will be created on REMOTES page)`
          );
        } catch (I) {
          if (I instanceof Error && I.message === "User cancelled") {
            const C = `Export cancelled: Detached instance "${s}" found. The component "${o}" is not on any page. Please fix the instance before exporting.`;
            throw await i.error(C), new Error(C);
          } else
            throw I;
        }
      }
    } else
      p || await i.warning(
        `  Instance "${s}" -> component "${o}": componentPage is null but component is not remote. Reason: ${m.reason}. Cannot determine instance type.`
      ), g = "normal";
    let h, w;
    try {
      e.variantProperties && (h = e.variantProperties), e.componentProperties && (w = e.componentProperties);
    } catch (A) {
    }
    let b, y;
    try {
      let A = r.parent;
      const T = [];
      let I = 0;
      const C = 20;
      for (; A && I < C; )
        try {
          const S = A.type, $ = A.name;
          if (S === "COMPONENT_SET" && !y && (y = $), S === "PAGE")
            break;
          const U = $ || "";
          T.unshift(U), A = A.parent, I++;
        } catch (S) {
          break;
        }
      b = T;
    } catch (A) {
    }
    const f = x(x(x(x({
      instanceType: g,
      componentName: o
    }, y && { componentSetName: y }), h && { variantProperties: h }), w && { componentProperties: w }), g === "normal" ? { path: b || [] } : b && b.length > 0 && {
      path: b
    });
    if (g === "internal")
      f.componentNodeId = r.id, await i.log(
        `  Found INSTANCE: "${s}" -> INTERNAL component "${o}" (ID: ${r.id.substring(0, 8)}...)`
      );
    else if (g === "normal") {
      const A = c || d;
      if (A) {
        f.componentPageName = A.name;
        const I = Ie(A);
        I != null && I.id && I.version !== void 0 ? (f.componentGuid = I.id, f.componentVersion = I.version, await i.log(
          `  Found INSTANCE: "${s}" -> NORMAL component "${o}" (ID: ${r.id.substring(0, 8)}...) at path [${(b || []).join(" → ")}]`
        )) : await i.warning(
          `  Instance "${s}" -> component "${o}" is classified as normal but page "${A.name}" has no metadata. This instance will not be importable.`
        );
      } else {
        const I = r.id;
        let C = "", S = "";
        switch (m.reason) {
          case "broken_chain":
            C = "The component's parent chain is broken and cannot be traversed to find the page", S = "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            C = "Cannot access the component's parent chain (access error)", S = "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            C = "Cannot determine which page the component is on", S = "Please ensure the component is properly placed on a page.";
        }
        try {
          await figma.viewport.scrollAndZoomIntoView([r]);
        } catch (Y) {
          console.warn("Could not scroll to component:", Y);
        }
        const $ = `Normal instance "${s}" -> component "${o}" (ID: ${I}) has no componentPage. ${C}. ${S} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", $), await i.error($);
        const U = new Error($);
        throw console.error("Throwing error:", U), U;
      }
      b === void 0 && console.warn(
        `Failed to build path for normal instance "${s}" -> component "${o}". Path is required for resolution.`
      );
      const T = b && b.length > 0 ? ` at path [${b.join(" → ")}]` : " at page root";
      await i.log(
        `  Found INSTANCE: "${s}" -> NORMAL component "${o}" (ID: ${r.id.substring(0, 8)}...)${T}`
      );
    } else if (g === "remote") {
      let A, T;
      const I = t.detachedComponentsHandled.has(
        r.id
      );
      if (!I)
        try {
          if (typeof r.getPublishStatusAsync == "function")
            try {
              const C = await r.getPublishStatusAsync();
              C && typeof C == "object" && (C.libraryName && (A = C.libraryName), C.libraryKey && (T = C.libraryKey));
            } catch (C) {
            }
          try {
            const C = figma.teamLibrary;
            if (typeof (C == null ? void 0 : C.getAvailableLibraryComponentSetsAsync) == "function") {
              const S = await C.getAvailableLibraryComponentSetsAsync();
              if (S && Array.isArray(S)) {
                for (const $ of S)
                  if ($.key === r.key || $.name === r.name) {
                    $.libraryName && (A = $.libraryName), $.libraryKey && (T = $.libraryKey);
                    break;
                  }
              }
            }
          } catch (C) {
          }
        } catch (C) {
          console.warn(
            `Error getting library info for remote component "${o}":`,
            C
          );
        }
      try {
        f.structure = await le(
          r,
          /* @__PURE__ */ new WeakSet(),
          t
        ), I && await i.log(
          `  Extracted structure for detached component "${o}" (ID: ${r.id.substring(0, 8)}...)`
        );
      } catch (C) {
        console.warn(
          `Failed to extract structure for remote component "${o}":`,
          C
        );
      }
      A && (f.remoteLibraryName = A), T && (f.remoteLibraryKey = T), I && (f.componentNodeId = r.id), await i.log(
        `  Found INSTANCE: "${s}" -> REMOTE component "${o}" (ID: ${r.id.substring(0, 8)}...)${I ? " [DETACHED]" : ""}`
      );
    }
    const N = t.instanceTable.addInstance(f);
    a._instanceRef = N, n.add("_instanceRef");
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
    return t.instanceType === "internal" && t.componentNodeId ? `internal:${t.componentNodeId}` : t.instanceType === "normal" && t.componentGuid && t.componentVersion !== void 0 ? `normal:${t.componentGuid}:${t.componentVersion}` : t.instanceType === "remote" && t.remoteLibraryKey ? `remote:${t.remoteLibraryKey}:${t.componentName}` : t.instanceType === "remote" && t.componentNodeId ? `remote:detached:${t.componentNodeId}` : `${t.instanceType}:${t.componentName}:COMPONENT`;
  }
  /**
   * Adds an instance to the table if it doesn't already exist
   * Returns the index of the instance (existing or newly added)
   */
  addInstance(t) {
    const a = this.generateKey(t);
    if (this.instanceMap.has(a))
      return this.instanceMap.get(a);
    const n = this.nextIndex++;
    return this.instanceMap.set(a, n), this.instances[n] = t, n;
  }
  /**
   * Gets the index of an instance by its unique key
   * Returns -1 if not found
   */
  getInstanceIndex(t) {
    var n;
    const a = this.generateKey(t);
    return (n = this.instanceMap.get(a)) != null ? n : -1;
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
    const a = new se(), n = Object.entries(t).sort(
      (r, s) => parseInt(r[0], 10) - parseInt(s[0], 10)
    );
    for (const [r, s] of n) {
      const o = parseInt(r, 10), p = a.generateKey(s);
      a.instanceMap.set(p, o), a.instances[o] = s, a.nextIndex = Math.max(a.nextIndex, o + 1);
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
const Oe = {
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
function ft() {
  const e = {};
  for (const [t, a] of Object.entries(Oe))
    e[a] = t;
  return e;
}
function xe(e) {
  var t;
  return (t = Oe[e]) != null ? t : e;
}
function ht(e) {
  var t;
  return typeof e == "number" ? (t = ft()[e]) != null ? t : e.toString() : e;
}
const ke = {
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
}, me = {};
for (const [e, t] of Object.entries(ke))
  me[t] = e;
class ce {
  constructor() {
    L(this, "shortToLong");
    L(this, "longToShort");
    this.shortToLong = x({}, me), this.longToShort = x({}, ke);
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
      const a = {}, n = /* @__PURE__ */ new Set();
      for (const r of Object.keys(t))
        n.add(r);
      for (const [r, s] of Object.entries(t)) {
        const o = this.getShortName(r);
        if (o !== r && !n.has(o)) {
          let p = this.compressObject(s);
          o === "type" && typeof p == "string" && (p = xe(p)), a[o] = p;
        } else {
          let p = this.compressObject(s);
          r === "type" && typeof p == "string" && (p = xe(p)), a[r] = p;
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
      for (const [n, r] of Object.entries(t)) {
        const s = this.getLongName(n);
        let o = this.expandObject(r);
        (s === "type" || n === "type") && (typeof o == "number" || typeof o == "string") && (o = ht(o)), a[s] = o;
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
    return x({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(t) {
    const a = new ce();
    a.shortToLong = x(x({}, me), t), a.longToShort = {};
    for (const [n, r] of Object.entries(
      a.shortToLong
    ))
      a.longToShort[r] = n;
    return a;
  }
}
function yt(e, t) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const a = {};
  e.metadata && (a.metadata = e.metadata);
  for (const [n, r] of Object.entries(e))
    n !== "metadata" && (a[n] = t.compressObject(r));
  return a;
}
function wt(e, t) {
  return t.expandObject(e);
}
function re(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
function we(e) {
  let t = 1;
  return e.children && e.children.length > 0 && e.children.forEach((a) => {
    t += we(a);
  }), t;
}
async function le(e, t = /* @__PURE__ */ new WeakSet(), a = {}) {
  var d, g, c, h, w, b;
  if (!e || typeof e != "object")
    return e;
  const n = (d = a.maxNodes) != null ? d : 1e4, r = (g = a.nodeCount) != null ? g : 0;
  if (r >= n)
    return await i.warning(
      `Maximum node count (${n}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${n}) reached`,
      _nodeCount: r
    };
  const s = {
    visited: (c = a.visited) != null ? c : /* @__PURE__ */ new WeakSet(),
    depth: (h = a.depth) != null ? h : 0,
    maxDepth: (w = a.maxDepth) != null ? w : 100,
    nodeCount: r + 1,
    maxNodes: n,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: a.variableTable,
    collectionTable: a.collectionTable,
    instanceTable: a.instanceTable,
    detachedComponentsHandled: (b = a.detachedComponentsHandled) != null ? b : /* @__PURE__ */ new Set()
  };
  if (t.has(e))
    return "[Circular Reference]";
  t.add(e), s.visited = t;
  const o = {}, p = await st(e, s);
  Object.assign(o, p);
  const u = e.type;
  if (u)
    switch (u) {
      case "FRAME":
      case "COMPONENT": {
        const y = await Ce(e);
        Object.assign(o, y);
        break;
      }
      case "INSTANCE": {
        const y = await mt(
          e,
          s
        );
        Object.assign(o, y);
        const f = await Ce(
          e
        );
        Object.assign(o, f);
        break;
      }
      case "TEXT": {
        const y = await ct(e);
        Object.assign(o, y);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const y = await lt(e);
        Object.assign(o, y);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const y = await dt(e);
        Object.assign(o, y);
        break;
      }
      default:
        s.unhandledKeys.add("_unknownType");
        break;
    }
  const l = Object.getOwnPropertyNames(e), m = /* @__PURE__ */ new Set([
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
  (u === "FRAME" || u === "COMPONENT" || u === "INSTANCE") && (m.add("layoutMode"), m.add("primaryAxisSizingMode"), m.add("counterAxisSizingMode"), m.add("primaryAxisAlignItems"), m.add("counterAxisAlignItems"), m.add("paddingLeft"), m.add("paddingRight"), m.add("paddingTop"), m.add("paddingBottom"), m.add("itemSpacing"), m.add("cornerRadius"), m.add("clipsContent"), m.add("layoutWrap"), m.add("layoutGrow")), u === "TEXT" && (m.add("characters"), m.add("fontName"), m.add("fontSize"), m.add("textAlignHorizontal"), m.add("textAlignVertical"), m.add("letterSpacing"), m.add("lineHeight"), m.add("textCase"), m.add("textDecoration"), m.add("textAutoResize"), m.add("paragraphSpacing"), m.add("paragraphIndent"), m.add("listOptions")), (u === "VECTOR" || u === "LINE") && (m.add("fillGeometry"), m.add("strokeGeometry")), (u === "RECTANGLE" || u === "ELLIPSE" || u === "STAR" || u === "POLYGON") && (m.add("pointCount"), m.add("innerRadius"), m.add("arcData")), u === "INSTANCE" && (m.add("mainComponent"), m.add("componentProperties"));
  for (const y of l)
    typeof e[y] != "function" && (m.has(y) || s.unhandledKeys.add(y));
  if (s.unhandledKeys.size > 0 && (o._unhandledKeys = Array.from(s.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const y = s.maxDepth;
    if (s.depth >= y)
      o.children = {
        _truncated: !0,
        _reason: `Maximum depth (${y}) reached`,
        _count: e.children.length
      };
    else if (s.nodeCount >= n)
      o.children = {
        _truncated: !0,
        _reason: `Maximum node count (${n}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const f = _(x({}, s), {
        depth: s.depth + 1
      }), N = [];
      let A = !1;
      for (const T of e.children) {
        if (f.nodeCount >= n) {
          o.children = {
            _truncated: !0,
            _reason: `Maximum node count (${n}) reached during children processing`,
            _processed: N.length,
            _total: e.children.length,
            children: N
          }, A = !0;
          break;
        }
        const I = await le(T, t, f);
        N.push(I), f.nodeCount && (s.nodeCount = f.nodeCount);
      }
      A || (o.children = N);
    }
  }
  return o;
}
async function Le(e, t = /* @__PURE__ */ new Set(), a = !1) {
  a || (await i.clear(), await i.log("=== Starting Page Export ==="));
  try {
    const n = e.pageIndex;
    if (n === void 0 || typeof n != "number")
      return await i.error(
        "Invalid page selection: pageIndex is undefined or not a number"
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    await i.log("Loading all pages..."), await figma.loadAllPagesAsync();
    const r = figma.root.children;
    if (await i.log(`Loaded ${r.length} page(s)`), n < 0 || n >= r.length)
      return await i.error(
        `Invalid page index: ${n} (valid range: 0-${r.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const s = r[n], o = s.id;
    if (t.has(o))
      return await i.log(
        `Page "${s.name}" has already been processed, skipping...`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Page already processed",
        data: {}
      };
    t.add(o), await i.log(
      `Selected page: "${s.name}" (index: ${n})`
    ), await i.log(
      "Initializing variable, collection, and instance tables..."
    );
    const p = new oe(), u = new ie(), l = new se();
    await i.log("Fetching team library variable collections...");
    let m = [];
    try {
      if (m = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((P) => ({
        libraryName: P.libraryName,
        key: P.key,
        name: P.name
      })), await i.log(
        `Found ${m.length} library collection(s) in team library`
      ), m.length > 0)
        for (const P of m)
          await i.log(`  - ${P.name} (from ${P.libraryName})`);
    } catch (E) {
      await i.warning(
        `Could not get library variable collections: ${E instanceof Error ? E.message : String(E)}`
      );
    }
    await i.log("Extracting node data from page..."), await i.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await i.log(
      "Collections will be discovered as variables are processed:"
    );
    const d = await le(
      s,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: p,
        collectionTable: u,
        instanceTable: l
      }
    );
    await i.log("Node extraction finished");
    const g = we(d), c = p.getSize(), h = u.getSize(), w = l.getSize();
    if (await i.log("Extraction complete:"), await i.log(`  - Total nodes: ${g}`), await i.log(`  - Unique variables: ${c}`), await i.log(`  - Unique collections: ${h}`), await i.log(`  - Unique instances: ${w}`), h > 0) {
      await i.log("Collections found:");
      const E = u.getTable();
      for (const [P, M] of Object.values(E).entries()) {
        const R = M.collectionGuid ? ` (GUID: ${M.collectionGuid.substring(0, 8)}...)` : "";
        await i.log(
          `  ${P}: ${M.collectionName}${R} - ${M.modes.length} mode(s)`
        );
      }
    }
    await i.log("Checking for referenced component pages...");
    const b = [], y = l.getSerializedTable(), f = Object.values(y).filter(
      (E) => E.instanceType === "normal"
    );
    if (f.length > 0) {
      await i.log(
        `Found ${f.length} normal instance(s) to check`
      );
      const E = /* @__PURE__ */ new Map();
      for (const P of f)
        if (P.componentPageName) {
          const M = r.find((R) => R.name === P.componentPageName);
          if (M && !t.has(M.id))
            E.has(M.id) || E.set(M.id, M);
          else if (!M) {
            const R = `Normal instance references component "${P.componentName || "(unnamed)"}" on page "${P.componentPageName}", but that page was not found. Cannot export.`;
            throw await i.error(R), new Error(R);
          }
        } else {
          const M = `Normal instance references component "${P.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw await i.error(M), new Error(M);
        }
      await i.log(
        `Found ${E.size} unique referenced page(s)`
      );
      for (const [P, M] of E.entries()) {
        const R = M.name;
        if (t.has(P)) {
          await i.log(`Skipping "${R}" - already processed`);
          continue;
        }
        const be = M.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let Ae = !1;
        if (be)
          try {
            const F = JSON.parse(be);
            Ae = !!(F.id && F.version !== void 0);
          } catch (F) {
          }
        const Fe = `Do you want to also publish referenced component "${R}"?`;
        try {
          await q.prompt(Fe, {
            okLabel: "Yes",
            cancelLabel: "No",
            timeoutMs: 3e5
            // 5 minutes
          }), await i.log(`Exporting referenced page: "${R}"`);
          const F = r.findIndex(
            (de) => de.id === M.id
          );
          if (F === -1)
            throw await i.error(
              `Could not find page index for "${R}"`
            ), new Error(`Could not find page index for "${R}"`);
          const Z = await Le(
            {
              pageIndex: F
            },
            t,
            // Pass the same set to track all processed pages
            !0
            // Mark as recursive call
          );
          if (Z.success && Z.data) {
            const de = Z.data;
            b.push(de), await i.log(
              `Successfully exported referenced page: "${R}"`
            );
          } else
            throw new Error(
              `Failed to export referenced page "${R}": ${Z.message}`
            );
        } catch (F) {
          if (F instanceof Error && F.message === "User cancelled")
            if (Ae)
              await i.log(
                `User declined to publish "${R}", but page has existing metadata. Continuing with existing metadata.`
              );
            else
              throw await i.error(
                `Export cancelled: Referenced page "${R}" has no metadata and user declined to publish it.`
              ), new Error(
                `Cannot continue export: Referenced component "${R}" has no metadata. Please publish it first or choose to publish it now.`
              );
          else
            throw F;
        }
      }
    }
    await i.log("Creating string table...");
    const N = new ce();
    await i.log("Getting page metadata...");
    const A = s.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let T = "", I = 0;
    if (A)
      try {
        const E = JSON.parse(A);
        T = E.id || "", I = E.version || 0;
      } catch (E) {
        await i.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!T) {
      await i.log("Generating new GUID for page..."), T = await ye();
      const E = {
        _ver: 1,
        id: T,
        name: s.name,
        version: I,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      s.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(E)
      );
    }
    await i.log("Creating export data structure...");
    const C = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "2.7.0",
        // Updated version for string table compression
        figmaApiVersion: figma.apiVersion,
        guid: T,
        version: I,
        name: s.name,
        pluginVersion: "1.0.0"
      },
      stringTable: N.getSerializedTable(),
      collections: u.getSerializedTable(),
      variables: p.getSerializedTable(),
      instances: l.getSerializedTable(),
      libraries: m,
      // Libraries might not need compression, but could be added later
      pageData: d
    };
    await i.log("Compressing JSON data...");
    const S = yt(C, N);
    await i.log("Serializing to JSON...");
    const $ = JSON.stringify(S, null, 2), U = ($.length / 1024).toFixed(2), B = re(s.name).trim().replace(/\s+/g, "_") + ".rec.json";
    return await i.log(`JSON serialization complete: ${U} KB`), await i.log(`Export file: ${B}`), await i.log("=== Export Complete ==="), {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: B,
        jsonData: $,
        pageName: s.name,
        additionalPages: b
        // Populated with referenced component pages
      }
    };
  } catch (n) {
    const r = n instanceof Error ? n.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", n), console.error("Error message:", r), await i.error(`Export failed: ${r}`), n instanceof Error && n.stack && (console.error("Stack trace:", n.stack), await i.error(`Stack trace: ${n.stack}`));
    const s = {
      type: "exportPage",
      success: !1,
      error: !0,
      message: r,
      data: {}
    };
    return console.error("Returning error response:", s), s;
  }
}
async function J(e, t) {
  for (const a of t)
    e.modes.find((r) => r.name === a) || e.addMode(a);
}
const V = "recursica:collectionId";
async function ae(e) {
  if (e.remote === !0) {
    const a = Pe[e.id];
    if (!a) {
      const r = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await i.error(r), new Error(r);
    }
    return a.guid;
  } else {
    const a = e.getSharedPluginData(
      "recursica",
      V
    );
    if (a && a.trim() !== "")
      return a;
    const n = await ye();
    return e.setSharedPluginData("recursica", V, n), n;
  }
}
function bt(e, t) {
  const a = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(a))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function At(e) {
  let t;
  const a = e.collectionName.trim().toLowerCase(), n = ["token", "tokens", "theme", "themes"], r = e.isLocal;
  if (r === !1 || r === void 0 && n.includes(a))
    try {
      const p = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((u) => u.name.trim().toLowerCase() === a);
      if (p) {
        bt(e.collectionName, !1);
        const u = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          p.key
        );
        if (u.length > 0) {
          const l = await figma.variables.importVariableByKeyAsync(u[0].key), m = await figma.variables.getVariableCollectionByIdAsync(
            l.variableCollectionId
          );
          if (m) {
            if (t = m, e.collectionGuid) {
              const d = t.getSharedPluginData(
                "recursica",
                V
              );
              (!d || d.trim() === "") && t.setSharedPluginData(
                "recursica",
                V,
                e.collectionGuid
              );
            } else
              await ae(t);
            return await J(t, e.modes), { collection: t };
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
    let p;
    if (e.collectionGuid && (p = o.find((u) => u.getSharedPluginData("recursica", V) === e.collectionGuid)), p || (p = o.find(
      (u) => u.name === e.collectionName
    )), p)
      if (t = p, e.collectionGuid) {
        const u = t.getSharedPluginData(
          "recursica",
          V
        );
        (!u || u.trim() === "") && t.setSharedPluginData(
          "recursica",
          V,
          e.collectionGuid
        );
      } else
        await ae(t);
    else
      t = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? t.setSharedPluginData(
        "recursica",
        V,
        e.collectionGuid
      ) : await ae(t);
  } else {
    const o = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), p = e.collectionName.trim().toLowerCase(), u = o.find((g) => g.name.trim().toLowerCase() === p);
    if (!u)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const l = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      u.key
    );
    if (l.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const m = await figma.variables.importVariableByKeyAsync(
      l[0].key
    ), d = await figma.variables.getVariableCollectionByIdAsync(
      m.variableCollectionId
    );
    if (!d)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (t = d, e.collectionGuid) {
      const g = t.getSharedPluginData(
        "recursica",
        V
      );
      (!g || g.trim() === "") && t.setSharedPluginData(
        "recursica",
        V,
        e.collectionGuid
      );
    } else
      ae(t);
  }
  return await J(t, e.modes), { collection: t };
}
async function _e(e, t) {
  for (const a of e.variableIds)
    try {
      const n = await figma.variables.getVariableByIdAsync(a);
      if (n && n.name === t)
        return n;
    } catch (n) {
      continue;
    }
  return null;
}
async function vt(e, t, a, n, r) {
  for (const [s, o] of Object.entries(t)) {
    const p = n.modes.find((l) => l.name === s);
    if (!p) {
      console.warn(
        `Mode "${s}" not found in collection "${n.name}" for variable "${e.name}". Skipping.`
      );
      continue;
    }
    const u = p.modeId;
    try {
      if (o == null)
        continue;
      if (typeof o == "string" || typeof o == "number" || typeof o == "boolean") {
        e.setValueForMode(u, o);
        continue;
      }
      if (typeof o == "object" && o !== null && "_varRef" in o && typeof o._varRef == "number") {
        const l = o;
        let m = null;
        const d = a.getVariableByIndex(
          l._varRef
        );
        if (d) {
          let g = null;
          if (r && d._colRef !== void 0) {
            const c = r.getCollectionByIndex(
              d._colRef
            );
            c && (g = (await At(c)).collection);
          }
          g && (m = await _e(
            g,
            d.variableName
          ));
        }
        if (m) {
          const g = {
            type: "VARIABLE_ALIAS",
            id: m.id
          };
          e.setValueForMode(u, g);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${s}" in variable "${e.name}". Variable reference index: ${l._varRef}`
          );
      }
    } catch (l) {
      console.warn(
        `Error setting value for mode "${s}" in variable "${e.name}":`,
        l
      );
    }
  }
}
async function Te(e, t, a, n) {
  const r = figma.variables.createVariable(
    e.variableName,
    t,
    e.variableType
  );
  return e.valuesByMode && await vt(
    r,
    e.valuesByMode,
    a,
    t,
    // Pass collection to look up modes by name
    n
  ), r;
}
async function ze(e, t, a, n) {
  if (!(!t || typeof t != "object"))
    try {
      const r = e[a];
      if (!r || !Array.isArray(r))
        return;
      const s = t[a];
      if (Array.isArray(s))
        for (let o = 0; o < s.length && o < r.length; o++) {
          const p = s[o];
          if (p && typeof p == "object") {
            r[o].boundVariables || (r[o].boundVariables = {});
            for (const [u, l] of Object.entries(
              p
            ))
              if ($e(l)) {
                const m = l._varRef;
                if (m !== void 0) {
                  const d = n.get(String(m));
                  d && (r[o].boundVariables[u] = {
                    type: "VARIABLE_ALIAS",
                    id: d.id
                  });
                }
              }
          }
        }
    } catch (r) {
      console.log(`Error restoring bound variables for ${a}:`, r);
    }
}
function Nt(e, t) {
  const a = We(t);
  if (e.visible === void 0 && (e.visible = a.visible), e.locked === void 0 && (e.locked = a.locked), e.opacity === void 0 && (e.opacity = a.opacity), e.rotation === void 0 && (e.rotation = a.rotation), e.blendMode === void 0 && (e.blendMode = a.blendMode), t === "FRAME" || t === "COMPONENT" || t === "INSTANCE") {
    const n = O;
    e.layoutMode === void 0 && (e.layoutMode = n.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = n.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = n.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = n.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = n.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = n.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = n.paddingRight), e.paddingTop === void 0 && (e.paddingTop = n.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = n.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = n.itemSpacing);
  }
  if (t === "TEXT") {
    const n = z;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = n.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = n.textAlignVertical), e.textCase === void 0 && (e.textCase = n.textCase), e.textDecoration === void 0 && (e.textDecoration = n.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = n.textAutoResize);
  }
}
async function W(e, t, a = null, n = null, r = null, s = null, o = null, p = !1, u = null) {
  var m;
  let l;
  switch (e.type) {
    case "FRAME":
      l = figma.createFrame();
      break;
    case "RECTANGLE":
      l = figma.createRectangle();
      break;
    case "ELLIPSE":
      l = figma.createEllipse();
      break;
    case "TEXT":
      l = figma.createText();
      break;
    case "VECTOR":
      l = figma.createVector();
      break;
    case "STAR":
      l = figma.createStar();
      break;
    case "LINE":
      l = figma.createLine();
      break;
    case "COMPONENT":
      if (e.id && o && o.has(e.id))
        l = o.get(e.id), await i.log(
          `Reusing existing COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id.substring(0, 8)}...)`
        );
      else if (l = figma.createComponent(), await i.log(
        `Created COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id ? e.id.substring(0, 8) + "..." : "no ID"})`
      ), e.componentPropertyDefinitions)
        try {
          l.componentPropertyDefinitions = e.componentPropertyDefinitions, await i.log(
            `  Set component property definitions for "${e.name || "Unnamed"}" via direct assignment`
          );
        } catch (d) {
          try {
            l.setProperties(
              e.componentPropertyDefinitions
            ), await i.log(
              `  Set component property definitions for "${e.name || "Unnamed"}" via setProperties`
            );
          } catch (g) {
            await i.warning(
              `  Component "${e.name || "Unnamed"}" has property definitions in JSON, but they cannot be recreated via API. Instances may not be able to set variant properties.`
            );
          }
        }
      break;
    case "COMPONENT_SET": {
      const d = e.children ? e.children.length : 0, g = e.children ? e.children.filter((c) => c.type === "COMPONENT").length : 0;
      if (await i.log(
        `Converting COMPONENT_SET "${e.name || "Unnamed"}" to frame (COMPONENT_SET cannot be created via API). Has ${d} children (${g} COMPONENT children)`
      ), e.children && Array.isArray(e.children))
        for (const c of e.children)
          c.type === "COMPONENT" && c.id && await i.log(
            `  COMPONENT child: "${c.name || "Unnamed"}" (ID: ${c.id.substring(0, 8)}...)`
          );
      l = figma.createFrame();
      break;
    }
    case "INSTANCE":
      if (p)
        l = figma.createFrame(), e.name && (l.name = e.name);
      else if (e._instanceRef !== void 0 && r && o) {
        const d = r.getInstanceByIndex(
          e._instanceRef
        );
        if (d && d.instanceType === "internal")
          if (d.componentNodeId)
            if (d.componentNodeId === e.id)
              await i.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), l = figma.createFrame(), e.name && (l.name = e.name);
            else {
              const g = o.get(
                d.componentNodeId
              );
              if (!g) {
                const c = Array.from(o.keys()).slice(
                  0,
                  20
                );
                await i.error(
                  `Component not found for internal instance "${e.name}" (ID: ${d.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), await i.error(
                  `Looking for component ID: ${d.componentNodeId}`
                ), await i.error(
                  `Available IDs in mapping (first 20): ${c.map((f) => f.substring(0, 8) + "...").join(", ")}`
                );
                const h = (f, N) => {
                  if (f.type === "COMPONENT" && f.id === N)
                    return !0;
                  if (f.children && Array.isArray(f.children)) {
                    for (const A of f.children)
                      if (!A._truncated && h(A, N))
                        return !0;
                  }
                  return !1;
                }, w = h(
                  e,
                  d.componentNodeId
                );
                await i.error(
                  `Component ID ${d.componentNodeId.substring(0, 8)}... exists in current node tree: ${w}`
                ), await i.error(
                  `WARNING: Component ID ${d.componentNodeId.substring(0, 8)}... not found in nodeIdMapping. This might indicate:`
                ), await i.error(
                  "  1. The component doesn't exist in the pageData (detached component?)"
                ), await i.error(
                  "  2. The component wasn't collected in the first pass"
                ), await i.error(
                  "  3. The component ID in the instance table doesn't match the actual component ID"
                );
                const b = c.filter(
                  (f) => f.startsWith(d.componentNodeId.substring(0, 8))
                );
                b.length > 0 && await i.error(
                  `Found IDs with matching prefix: ${b.map((f) => f.substring(0, 8) + "...").join(", ")}`
                );
                const y = `Component not found for internal instance "${e.name}" (ID: ${d.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${c.map((f) => f.substring(0, 8) + "...").join(", ")}`;
                throw new Error(y);
              }
              if (g && g.type === "COMPONENT") {
                if (l = g.createInstance(), await i.log(
                  `✓ Created internal instance "${e.name}" from component "${d.componentName}"`
                ), d.variantProperties && Object.keys(d.variantProperties).length > 0)
                  try {
                    const c = await l.getMainComponentAsync();
                    if (c) {
                      const h = c.componentPropertyDefinitions, w = {};
                      for (const [b, y] of Object.entries(
                        d.variantProperties
                      ))
                        h[b] ? w[b] = y : await i.warning(
                          `Skipping variant property "${b}" for internal instance "${e.name}" - property does not exist on recreated component`
                        );
                      Object.keys(w).length > 0 && l.setProperties(w);
                    } else
                      await i.warning(
                        `Cannot set variant properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (c) {
                    const h = `Failed to set variant properties for instance "${e.name}": ${c}`;
                    throw await i.error(h), new Error(h);
                  }
                if (d.componentProperties && Object.keys(d.componentProperties).length > 0)
                  try {
                    const c = await l.getMainComponentAsync();
                    if (c) {
                      const h = c.componentPropertyDefinitions;
                      for (const [w, b] of Object.entries(
                        d.componentProperties
                      ))
                        if (h[w])
                          try {
                            l.setProperties({ [w]: b });
                          } catch (y) {
                            const f = `Failed to set component property "${w}" for internal instance "${e.name}": ${y}`;
                            throw await i.error(f), new Error(f);
                          }
                        else
                          await i.warning(
                            `Skipping component property "${w}" for internal instance "${e.name}" - property does not exist on recreated component`
                          );
                    } else
                      await i.warning(
                        `Cannot set component properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (c) {
                    if (c instanceof Error)
                      throw c;
                    const h = `Failed to set component properties for instance "${e.name}": ${c}`;
                    throw await i.error(h), new Error(h);
                  }
              } else if (!l && g) {
                const c = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${d.componentNodeId.substring(0, 8)}...).`;
                throw await i.error(c), new Error(c);
              }
            }
          else {
            const g = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw await i.error(g), new Error(g);
          }
        else if (d && d.instanceType === "remote")
          if (u) {
            const g = u.get(
              e._instanceRef
            );
            if (g) {
              if (l = g.createInstance(), await i.log(
                `✓ Created remote instance "${e.name}" from component "${d.componentName}" on REMOTES page`
              ), d.variantProperties && Object.keys(d.variantProperties).length > 0)
                try {
                  const c = await l.getMainComponentAsync();
                  if (c) {
                    const h = c.componentPropertyDefinitions, w = {};
                    for (const [b, y] of Object.entries(
                      d.variantProperties
                    ))
                      h[b] ? w[b] = y : await i.warning(
                        `Skipping variant property "${b}" for remote instance "${e.name}" - property does not exist on recreated component`
                      );
                    Object.keys(w).length > 0 && l.setProperties(w);
                  } else
                    await i.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (c) {
                  const h = `Failed to set variant properties for remote instance "${e.name}": ${c}`;
                  throw await i.error(h), new Error(h);
                }
              if (d.componentProperties && Object.keys(d.componentProperties).length > 0)
                try {
                  const c = await l.getMainComponentAsync();
                  if (c) {
                    const h = c.componentPropertyDefinitions;
                    for (const [w, b] of Object.entries(
                      d.componentProperties
                    ))
                      if (h[w])
                        try {
                          l.setProperties({ [w]: b });
                        } catch (y) {
                          const f = `Failed to set component property "${w}" for remote instance "${e.name}": ${y}`;
                          throw await i.error(f), new Error(f);
                        }
                      else
                        await i.warning(
                          `Skipping component property "${w}" for remote instance "${e.name}" - property does not exist on recreated component`
                        );
                  } else
                    await i.warning(
                      `Cannot set component properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (c) {
                  if (c instanceof Error)
                    throw c;
                  const h = `Failed to set component properties for remote instance "${e.name}": ${c}`;
                  throw await i.error(h), new Error(h);
                }
            } else {
              const c = `Remote component not found for instance "${e.name}" (index ${e._instanceRef}). The remote component should have been created on the REMOTES page.`;
              throw await i.error(c), new Error(c);
            }
          } else {
            const g = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw await i.error(g), new Error(g);
          }
        else if ((d == null ? void 0 : d.instanceType) === "normal")
          await i.log(
            `Instance "${e.name}" is a normal instance (not yet implemented), creating frame fallback`
          ), l = figma.createFrame();
        else {
          const g = `Instance "${e.name}" has unknown or missing instance type: ${(d == null ? void 0 : d.instanceType) || "unknown"}`;
          throw await i.error(g), new Error(g);
        }
      } else {
        const d = `Instance "${e.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        throw await i.error(d), new Error(d);
      }
      break;
    case "GROUP":
      l = figma.createFrame();
      break;
    case "BOOLEAN_OPERATION": {
      const d = `Boolean operation nodes cannot be imported. Found boolean operation: "${e.name}".`;
      throw await i.error(d), new Error(d);
    }
    case "POLYGON":
      l = figma.createPolygon();
      break;
    default: {
      const d = `Unsupported node type: ${e.type}. This node type cannot be imported.`;
      throw await i.error(d), new Error(d);
    }
  }
  if (!l)
    return null;
  if (e.id && o && (o.set(e.id, l), l.type === "COMPONENT" && await i.log(
    `  Stored COMPONENT "${e.name || "Unnamed"}" in nodeIdMapping (ID: ${e.id.substring(0, 8)}...)`
  )), Nt(l, e.type || "FRAME"), e.name !== void 0 && (l.name = e.name || "Unnamed Node"), e.x !== void 0 && (l.x = e.x), e.y !== void 0 && (l.y = e.y), e.width !== void 0 && e.height !== void 0 && l.resize(e.width, e.height), e.visible !== void 0 && (l.visible = e.visible), e.locked !== void 0 && (l.locked = e.locked), e.opacity !== void 0 && (l.opacity = e.opacity), e.rotation !== void 0 && (l.rotation = e.rotation), e.blendMode !== void 0 && (l.blendMode = e.blendMode), e.type !== "INSTANCE" && e.fills !== void 0)
    try {
      let d = e.fills;
      Array.isArray(d) && (d = d.map((g) => {
        if (g && typeof g == "object") {
          const c = x({}, g);
          return delete c.boundVariables, c;
        }
        return g;
      })), l.fills = d, (m = e.boundVariables) != null && m.fills && s && await ze(
        l,
        e.boundVariables,
        "fills",
        s
      );
    } catch (d) {
      console.log("Error setting fills:", d);
    }
  if (e.strokes !== void 0 && e.strokes.length > 0)
    try {
      l.strokes = e.strokes;
    } catch (d) {
      console.log("Error setting strokes:", d);
    }
  if (e.strokeWeight !== void 0 && (l.strokeWeight = e.strokeWeight), e.strokeAlign !== void 0 && (l.strokeAlign = e.strokeAlign), e.cornerRadius !== void 0 && (l.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (l.effects = e.effects), (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && (e.layoutMode !== void 0 && (l.layoutMode = e.layoutMode), e.primaryAxisSizingMode !== void 0 && (l.primaryAxisSizingMode = e.primaryAxisSizingMode), e.counterAxisSizingMode !== void 0 && (l.counterAxisSizingMode = e.counterAxisSizingMode), e.primaryAxisAlignItems !== void 0 && (l.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (l.counterAxisAlignItems = e.counterAxisAlignItems), e.paddingLeft !== void 0 && (l.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (l.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (l.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (l.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (l.itemSpacing = e.itemSpacing)), (e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (l.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (l.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (l.dashPattern = e.dashPattern)), e.type === "TEXT" && e.characters !== void 0)
    try {
      if (e.fontName)
        try {
          await figma.loadFontAsync(e.fontName), l.fontName = e.fontName;
        } catch (d) {
          await figma.loadFontAsync({
            family: "Roboto",
            style: "Regular"
          }), l.fontName = { family: "Roboto", style: "Regular" };
        }
      else
        await figma.loadFontAsync({
          family: "Roboto",
          style: "Regular"
        }), l.fontName = { family: "Roboto", style: "Regular" };
      l.characters = e.characters, e.fontSize !== void 0 && (l.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (l.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (l.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (l.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (l.lineHeight = e.lineHeight), e.textCase !== void 0 && (l.textCase = e.textCase), e.textDecoration !== void 0 && (l.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (l.textAutoResize = e.textAutoResize);
    } catch (d) {
      console.log("Error setting text properties: " + d);
      try {
        l.characters = e.characters;
      } catch (g) {
        console.log("Could not set text characters: " + g);
      }
    }
  if (e.boundVariables) {
    for (const [d, g] of Object.entries(
      e.boundVariables
    ))
      if (d !== "fills" && $e(g) && a && s) {
        const c = g._varRef;
        if (c !== void 0) {
          const h = s.get(String(c));
          if (h) {
            const w = {
              type: "VARIABLE_ALIAS",
              id: h.id
            };
            l.boundVariables || (l.boundVariables = {}), l.boundVariables[d] || (l.boundVariables[d] = w);
          }
        }
      }
  }
  if (e.children && Array.isArray(e.children) && l.type !== "INSTANCE") {
    const d = (c) => {
      const h = [];
      for (const w of c)
        w._truncated || (w.type === "COMPONENT" ? (h.push(w), w.children && Array.isArray(w.children) && h.push(...d(w.children))) : w.children && Array.isArray(w.children) && h.push(...d(w.children)));
      return h;
    };
    for (const c of e.children) {
      if (c._truncated) {
        console.log(
          `Skipping truncated children: ${c._reason || "Unknown"}`
        );
        continue;
      }
      c.type;
    }
    const g = d(e.children);
    await i.log(
      `  First pass: Creating ${g.length} COMPONENT node(s) (without children)...`
    );
    for (const c of g)
      await i.log(
        `  Collected COMPONENT "${c.name || "Unnamed"}" (ID: ${c.id ? c.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const c of g)
      if (c.id && o && !o.has(c.id)) {
        const h = figma.createComponent();
        if (c.name !== void 0 && (h.name = c.name || "Unnamed Node"), c.componentPropertyDefinitions)
          try {
            h.componentPropertyDefinitions = c.componentPropertyDefinitions, await i.log(
              `  Set component property definitions for "${c.name || "Unnamed"}" via direct assignment in first pass`
            );
          } catch (w) {
            try {
              h.setProperties(
                c.componentPropertyDefinitions
              ), await i.log(
                `  Set component property definitions for "${c.name || "Unnamed"}" via setProperties in first pass`
              );
            } catch (b) {
              await i.warning(
                `  Component "${c.name || "Unnamed"}" has property definitions in JSON, but they cannot be recreated via API. Instances may not be able to set variant properties.`
              );
            }
          }
        o.set(c.id, h), await i.log(
          `  Created COMPONENT "${c.name || "Unnamed"}" (ID: ${c.id.substring(0, 8)}...) in first pass`
        );
      }
    for (const c of e.children) {
      if (c._truncated)
        continue;
      const h = await W(
        c,
        l,
        a,
        n,
        r,
        s,
        o,
        p,
        u
      );
      h && l.appendChild(h);
    }
  }
  return t && t.appendChild(l), l;
}
async function Se(e) {
  await figma.loadAllPagesAsync();
  const t = figma.root.children, a = new Set(t.map((s) => s.name));
  if (!a.has(e))
    return e;
  let n = 1, r = `${e}_${n}`;
  for (; a.has(r); )
    n++, r = `${e}_${n}`;
  return r;
}
async function Ct(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), a = new Set(t.map((s) => s.name));
  if (!a.has(e))
    return e;
  let n = 1, r = `${e}_${n}`;
  for (; a.has(r); )
    n++, r = `${e}_${n}`;
  return r;
}
async function It(e, t) {
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
  let n = 1, r = `${t}_${n}`;
  for (; a.has(r); )
    n++, r = `${t}_${n}`;
  return r;
}
function xt(e, t) {
  const a = e.resolvedType.toUpperCase(), n = t.toUpperCase();
  return a === n;
}
async function Tt(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), a = j(e.collectionName);
  if (D(e.collectionName)) {
    for (const n of t)
      if (j(n.name) === a)
        return {
          collection: n,
          matchType: "potential"
        };
    return {
      collection: null,
      matchType: "none"
    };
  }
  if (e.collectionGuid) {
    for (const n of t)
      if (n.getSharedPluginData(
        "recursica",
        V
      ) === e.collectionGuid)
        return {
          collection: n,
          matchType: "recognized"
        };
  }
  for (const n of t)
    if (n.name === e.collectionName)
      return {
        collection: n,
        matchType: "potential"
      };
  return {
    collection: null,
    matchType: "none"
  };
}
function St(e) {
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
function Et(e) {
  if (!e.stringTable)
    return {
      success: !1,
      error: "Invalid JSON format. String table is required."
    };
  let t;
  try {
    t = ce.fromTable(e.stringTable);
  } catch (n) {
    return {
      success: !1,
      error: `Failed to load string table: ${n instanceof Error ? n.message : "Unknown error"}`
    };
  }
  const a = wt(e, t);
  return {
    success: !0,
    stringTable: t,
    expandedJsonData: a
  };
}
function $t(e) {
  if (!e.collections)
    return {
      success: !1,
      error: "No collections table found in JSON"
    };
  try {
    return {
      success: !0,
      collectionTable: ie.fromTable(
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
async function Pt(e) {
  const t = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = e.getTable();
  for (const [s, o] of Object.entries(r)) {
    if (o.isLocal === !1) {
      await i.log(
        `Skipping remote collection: "${o.collectionName}" (index ${s})`
      );
      continue;
    }
    const p = await Tt(o);
    p.matchType === "recognized" ? (await i.log(
      `✓ Recognized collection by GUID: "${o.collectionName}" (index ${s})`
    ), t.set(s, p.collection)) : p.matchType === "potential" ? (await i.log(
      `? Potential match by name: "${o.collectionName}" (index ${s})`
    ), a.set(s, {
      entry: o,
      collection: p.collection
    })) : (await i.log(
      `✗ No match found for collection: "${o.collectionName}" (index ${s}) - will create new`
    ), n.set(s, o));
  }
  return await i.log(
    `Collection matching complete: ${t.size} recognized, ${a.size} potential matches, ${n.size} to create`
  ), {
    recognizedCollections: t,
    potentialMatches: a,
    collectionsToCreate: n
  };
}
async function Mt(e, t, a) {
  if (e.size !== 0) {
    await i.log(
      `Prompting user for ${e.size} potential match(es)...`
    );
    for (const [n, { entry: r, collection: s }] of e.entries())
      try {
        const o = D(r.collectionName) ? j(r.collectionName) : s.name, p = `Found existing "${o}" variable collection. Should I use it?`;
        await i.log(
          `Prompting user about potential match: "${o}"`
        ), await q.prompt(p, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await i.log(
          `✓ User confirmed: Using existing collection "${o}" (index ${n})`
        ), t.set(n, s), await J(s, r.modes), await i.log(
          `  ✓ Ensured modes for collection "${o}" (${r.modes.length} mode(s))`
        );
      } catch (o) {
        await i.log(
          `✗ User rejected: Will create new collection for "${r.collectionName}" (index ${n})`
        ), a.set(n, r);
      }
  }
}
async function Rt(e, t, a) {
  if (e.size === 0)
    return;
  await i.log("Ensuring modes exist for recognized collections...");
  const n = t.getTable();
  for (const [r, s] of e.entries()) {
    const o = n[r];
    o && (a.has(r) || (await J(s, o.modes), await i.log(
      `  ✓ Ensured modes for collection "${s.name}" (${o.modes.length} mode(s))`
    )));
  }
}
async function Ot(e, t, a) {
  if (e.size !== 0) {
    await i.log(
      `Creating ${e.size} new collection(s)...`
    );
    for (const [n, r] of e.entries()) {
      const s = j(r.collectionName), o = await Ct(s);
      o !== s ? await i.log(
        `Creating collection: "${o}" (normalized: "${s}" - name conflict resolved)`
      ) : await i.log(`Creating collection: "${o}"`);
      const p = figma.variables.createVariableCollection(o);
      a.push(p);
      let u;
      if (D(r.collectionName)) {
        const l = he(r.collectionName);
        l && (u = l);
      } else r.collectionGuid && (u = r.collectionGuid);
      u && (p.setSharedPluginData(
        "recursica",
        V,
        u
      ), await i.log(
        `  Stored GUID: ${u.substring(0, 8)}...`
      )), await J(p, r.modes), await i.log(
        `  ✓ Created collection "${o}" with ${r.modes.length} mode(s)`
      ), t.set(n, p);
    }
    await i.log("Collection creation complete");
  }
}
function kt(e) {
  if (!e.variables)
    return {
      success: !1,
      error: "No variables table found in JSON"
    };
  try {
    return {
      success: !0,
      variableTable: oe.fromTable(e.variables)
    };
  } catch (t) {
    return {
      success: !1,
      error: `Failed to load variables table: ${t instanceof Error ? t.message : "Unknown error"}`
    };
  }
}
async function Lt(e, t, a, n) {
  const r = /* @__PURE__ */ new Map(), s = [], o = new Set(
    n.map((l) => l.id)
  );
  await i.log("Matching and creating variables in collections...");
  const p = e.getTable(), u = /* @__PURE__ */ new Map();
  for (const [l, m] of Object.entries(p)) {
    if (m._colRef === void 0)
      continue;
    const d = a.get(String(m._colRef));
    if (!d)
      continue;
    u.has(d.id) || u.set(d.id, {
      collectionName: d.name,
      existing: 0,
      created: 0
    });
    const g = u.get(d.id), c = o.has(
      d.id
    );
    let h;
    typeof m.variableType == "number" ? h = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[m.variableType] || String(m.variableType) : h = m.variableType;
    const w = await _e(
      d,
      m.variableName
    );
    if (w)
      if (xt(w, h))
        r.set(l, w), g.existing++;
      else {
        await i.warning(
          `Type mismatch for variable "${m.variableName}" in collection "${d.name}": expected ${h}, found ${w.resolvedType}. Creating new variable with incremented name.`
        );
        const b = await It(
          d,
          m.variableName
        ), y = await Te(
          _(x({}, m), {
            variableName: b,
            variableType: h
          }),
          d,
          e,
          t
        );
        c || s.push(y), r.set(l, y), g.created++;
      }
    else {
      const b = await Te(
        _(x({}, m), {
          variableType: h
        }),
        d,
        e,
        t
      );
      c || s.push(b), r.set(l, b), g.created++;
    }
  }
  await i.log("Variable processing complete:");
  for (const l of u.values())
    await i.log(
      `  "${l.collectionName}": ${l.existing} existing, ${l.created} created`
    );
  return {
    recognizedVariables: r,
    newlyCreatedVariables: s
  };
}
function _t(e) {
  if (!e.instances)
    return null;
  try {
    return se.fromTable(e.instances);
  } catch (t) {
    return null;
  }
}
async function zt(e, t) {
  const a = /* @__PURE__ */ new Set();
  for (const s of e.children)
    (s.type === "FRAME" || s.type === "COMPONENT") && a.add(s.name);
  if (!a.has(t))
    return t;
  let n = 1, r = `${t}_${n}`;
  for (; a.has(r); )
    n++, r = `${t}_${n}`;
  return r;
}
async function Vt(e, t, a, n) {
  var d;
  const r = e.getSerializedTable(), s = Object.values(r).filter(
    (g) => g.instanceType === "remote"
  ), o = /* @__PURE__ */ new Map();
  if (s.length === 0)
    return await i.log("No remote instances found"), o;
  await i.log(
    `Processing ${s.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  let u = figma.root.children.find((g) => g.name === "REMOTES");
  if (u ? await i.log("Found existing REMOTES page") : (u = figma.createPage(), u.name = "REMOTES", await i.log("Created REMOTES page")), !u.children.some(
    (g) => g.type === "FRAME" && g.name === "Title"
  )) {
    const g = { family: "Inter", style: "Bold" }, c = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(g), await figma.loadFontAsync(c);
    const h = figma.createFrame();
    h.name = "Title", h.layoutMode = "VERTICAL", h.paddingTop = 20, h.paddingBottom = 20, h.paddingLeft = 20, h.paddingRight = 20, h.fills = [];
    const w = figma.createText();
    w.fontName = g, w.characters = "REMOTE INSTANCES", w.fontSize = 24, w.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], h.appendChild(w);
    const b = figma.createText();
    b.fontName = c, b.characters = "These are remotely connected component instances found in our different component pages.", b.fontSize = 14, b.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], h.appendChild(b), u.appendChild(h), await i.log("Created title and description on REMOTES page");
  }
  const m = /* @__PURE__ */ new Map();
  for (const [g, c] of Object.entries(r)) {
    if (c.instanceType !== "remote")
      continue;
    const h = parseInt(g, 10);
    if (await i.log(
      `Processing remote instance ${h}: "${c.componentName}"`
    ), !c.structure) {
      await i.warning(
        `Remote instance "${c.componentName}" missing structure data, skipping`
      );
      continue;
    }
    await i.log(
      `  Structure type: ${c.structure.type || "unknown"}, has children: ${c.structure.children ? c.structure.children.length : 0}`
    );
    let w = c.componentName;
    if (c.path && c.path.length > 0) {
      const y = c.path.filter((f) => f !== "").join(" / ");
      y && (w = `${y} / ${c.componentName}`);
    }
    const b = await zt(
      u,
      w
    );
    b !== w && await i.log(
      `Component name conflict: "${w}" -> "${b}"`
    );
    try {
      if (c.structure.type !== "COMPONENT") {
        await i.warning(
          `Remote instance "${c.componentName}" structure is not a COMPONENT (type: ${c.structure.type}), creating frame fallback`
        );
        const f = figma.createFrame();
        f.name = b;
        const N = await W(
          c.structure,
          f,
          t,
          a,
          null,
          n,
          m,
          !0
          // isRemoteStructure: true
        );
        N ? (f.appendChild(N), u.appendChild(f), await i.log(
          `✓ Created remote instance frame fallback: "${b}"`
        )) : f.remove();
        continue;
      }
      const y = figma.createComponent();
      y.name = b, u.appendChild(y), await i.log(
        `  Created component node: "${b}"`
      );
      try {
        if (c.structure.name !== void 0 && (y.name = c.structure.name), c.structure.width !== void 0 && c.structure.height !== void 0 && y.resize(c.structure.width, c.structure.height), c.structure.x !== void 0 && (y.x = c.structure.x), c.structure.y !== void 0 && (y.y = c.structure.y), c.structure.visible !== void 0 && (y.visible = c.structure.visible), c.structure.opacity !== void 0 && (y.opacity = c.structure.opacity), c.structure.rotation !== void 0 && (y.rotation = c.structure.rotation), c.structure.blendMode !== void 0 && (y.blendMode = c.structure.blendMode), c.structure.fills !== void 0)
          try {
            let f = c.structure.fills;
            Array.isArray(f) && (f = f.map((N) => {
              if (N && typeof N == "object") {
                const A = x({}, N);
                return delete A.boundVariables, A;
              }
              return N;
            })), y.fills = f, (d = c.structure.boundVariables) != null && d.fills && n && await ze(
              y,
              c.structure.boundVariables,
              "fills",
              n
            );
          } catch (f) {
            await i.warning(
              `Error setting fills for remote component "${c.componentName}": ${f}`
            );
          }
        if (c.structure.strokes !== void 0)
          try {
            y.strokes = c.structure.strokes;
          } catch (f) {
            await i.warning(
              `Error setting strokes for remote component "${c.componentName}": ${f}`
            );
          }
        if (c.structure.layoutMode !== void 0 && (y.layoutMode = c.structure.layoutMode), c.structure.primaryAxisSizingMode !== void 0 && (y.primaryAxisSizingMode = c.structure.primaryAxisSizingMode), c.structure.counterAxisSizingMode !== void 0 && (y.counterAxisSizingMode = c.structure.counterAxisSizingMode), c.structure.paddingLeft !== void 0 && (y.paddingLeft = c.structure.paddingLeft), c.structure.paddingRight !== void 0 && (y.paddingRight = c.structure.paddingRight), c.structure.paddingTop !== void 0 && (y.paddingTop = c.structure.paddingTop), c.structure.paddingBottom !== void 0 && (y.paddingBottom = c.structure.paddingBottom), c.structure.itemSpacing !== void 0 && (y.itemSpacing = c.structure.itemSpacing), c.structure.cornerRadius !== void 0 && (y.cornerRadius = c.structure.cornerRadius), c.structure.children && Array.isArray(c.structure.children)) {
          await i.log(
            `  Recreating ${c.structure.children.length} child(ren) for component "${c.componentName}"`
          );
          for (const f of c.structure.children) {
            if (f._truncated) {
              await i.log(
                `  Skipping truncated child: ${f._reason || "Unknown"}`
              );
              continue;
            }
            const N = await W(
              f,
              y,
              t,
              a,
              null,
              n,
              m,
              !0
              // isRemoteStructure: true
            );
            N && y.appendChild(N);
          }
        }
        o.set(h, y), await i.log(
          `✓ Created remote component: "${b}" (index ${h})`
        );
      } catch (f) {
        await i.warning(
          `Error populating remote component "${c.componentName}": ${f instanceof Error ? f.message : "Unknown error"}`
        ), y.remove();
      }
    } catch (y) {
      await i.warning(
        `Error recreating remote instance "${c.componentName}": ${y instanceof Error ? y.message : "Unknown error"}`
      );
    }
  }
  return await i.log(
    `Remote instance processing complete: ${o.size} component(s) created`
  ), o;
}
async function Gt(e, t, a, n, r, s, o = null) {
  await i.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const p = figma.root.children, u = "RecursicaPublishedMetadata";
  let l = null;
  for (const f of p) {
    const N = f.getPluginData(u);
    if (N)
      try {
        if (JSON.parse(N).id === e.guid) {
          l = f;
          break;
        }
      } catch (A) {
        continue;
      }
  }
  l && await i.log(
    `Found existing page with same GUID: "${l.name}". Will create new page to avoid overwriting.`
  );
  const m = p.find((f) => f.name === e.name);
  m && await i.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let d;
  if (l || m) {
    const f = `__${e.name}`;
    d = await Se(f), await i.log(
      `Creating scratch page: "${d}" (will be renamed to "${e.name}" on success)`
    );
  } else
    d = e.name, await i.log(`Creating page: "${d}"`);
  const g = figma.createPage();
  if (g.name = d, await figma.setCurrentPageAsync(g), await i.log(`Switched to page: "${d}"`), !t.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await i.log("Recreating page structure...");
  const c = t.pageData, h = /* @__PURE__ */ new Map(), w = (f, N = []) => {
    if (f.type === "COMPONENT" && f.id && N.push(f.id), f.children && Array.isArray(f.children))
      for (const A of f.children)
        A._truncated || w(A, N);
    return N;
  }, b = w(c);
  if (await i.log(
    `Found ${b.length} COMPONENT node(s) in page data`
  ), b.length > 0 && (await i.log(
    `Component IDs in page data (first 20): ${b.slice(0, 20).map((f) => f.substring(0, 8) + "...").join(", ")}`
  ), c._allComponentIds = b), c.children && Array.isArray(c.children))
    for (const f of c.children) {
      const N = await W(
        f,
        g,
        a,
        n,
        r,
        s,
        h,
        !1,
        // isRemoteStructure: false - we're creating the main page
        o
        // Pass the remote component map
      );
      N && g.appendChild(N);
    }
  await i.log("Page structure recreated successfully");
  const y = {
    _ver: 1,
    id: e.guid,
    name: e.name,
    version: e.version || 0,
    publishDate: (/* @__PURE__ */ new Date()).toISOString(),
    history: {}
  };
  if (g.setPluginData(u, JSON.stringify(y)), await i.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), d.startsWith("__")) {
    const f = await Se(e.name);
    g.name = f, await i.log(`Renamed page from "${d}" to "${f}"`);
  }
  return {
    success: !0,
    page: g
  };
}
async function Ft(e) {
  await i.clear(), await i.log("=== Starting Page Import ===");
  const t = [];
  try {
    const a = e.jsonData;
    if (!a)
      return await i.error("JSON data is required"), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "JSON data is required",
        data: {}
      };
    await i.log("Validating metadata...");
    const n = St(a);
    if (!n.success)
      return await i.error(n.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: n.error,
        data: {}
      };
    const r = n.metadata;
    await i.log(
      `Metadata validated: guid=${r.guid}, name=${r.name}`
    ), await i.log("Loading string table...");
    const s = Et(a);
    if (!s.success)
      return await i.error(s.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: s.error,
        data: {}
      };
    await i.log("String table loaded successfully"), await i.log("Expanding JSON data...");
    const o = s.expandedJsonData;
    await i.log("JSON expanded successfully"), await i.log("Loading collections table...");
    const p = $t(o);
    if (!p.success)
      return p.error === "No collections table found in JSON" ? (await i.log(p.error), await i.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: r.name }
      }) : (await i.error(p.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: p.error,
        data: {}
      });
    const u = p.collectionTable;
    await i.log(
      `Loaded collections table with ${u.getSize()} collection(s)`
    ), await i.log(
      "Matching collections with existing local collections..."
    );
    const { recognizedCollections: l, potentialMatches: m, collectionsToCreate: d } = await Pt(u);
    await Mt(
      m,
      l,
      d
    ), await Rt(
      l,
      u,
      m
    ), await Ot(
      d,
      l,
      t
    ), await i.log("Loading variables table...");
    const g = kt(o);
    if (!g.success)
      return g.error === "No variables table found in JSON" ? (await i.log(g.error), await i.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no variables to process)",
        data: { pageName: r.name }
      }) : (await i.error(g.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: g.error,
        data: {}
      });
    const c = g.variableTable;
    await i.log(
      `Loaded variables table with ${c.getSize()} variable(s)`
    );
    const { recognizedVariables: h, newlyCreatedVariables: w } = await Lt(
      c,
      u,
      l,
      t
    );
    await i.log("Loading instance table...");
    const b = _t(o);
    if (b) {
      const T = b.getSerializedTable(), I = Object.values(T).filter(
        (S) => S.instanceType === "internal"
      ), C = Object.values(T).filter(
        (S) => S.instanceType === "remote"
      );
      await i.log(
        `Loaded instance table with ${b.getSize()} instance(s) (${I.length} internal, ${C.length} remote)`
      );
    } else
      await i.log("No instance table found in JSON");
    let y = null;
    b && (y = await Vt(
      b,
      c,
      u,
      h
    ));
    const f = await Gt(
      r,
      o,
      c,
      u,
      b,
      h,
      y
    );
    if (!f.success)
      return await i.error(f.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: f.error,
        data: {}
      };
    const N = f.page, A = h.size + w.length;
    return await i.log("=== Import Complete ==="), await i.log(
      `Successfully processed ${l.size} collection(s), ${A} variable(s), and created page "${N.name}"`
    ), {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: {
        pageName: N.name,
        createdEntities: {
          pageIds: [N.id],
          collectionIds: t.map((T) => T.id),
          variableIds: w.map((T) => T.id)
        }
      }
    };
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await i.error(`Import failed: ${n}`), a instanceof Error && a.stack && await i.error(`Stack trace: ${a.stack}`), console.error("Error importing page:", a), {
      type: "importPage",
      success: !1,
      error: !0,
      message: n,
      data: {}
    };
  }
}
async function Ut(e) {
  await i.log("=== Cleaning up created entities ===");
  try {
    const { pageIds: t, collectionIds: a, variableIds: n } = e;
    let r = 0;
    for (const p of n)
      try {
        const u = figma.variables.getVariableById(p);
        if (u) {
          const l = u.variableCollectionId;
          a.includes(l) || (u.remove(), r++);
        }
      } catch (u) {
        await i.warning(
          `Could not delete variable ${p.substring(0, 8)}...: ${u}`
        );
      }
    let s = 0;
    for (const p of a)
      try {
        const u = figma.variables.getVariableCollectionById(p);
        u && (u.remove(), s++);
      } catch (u) {
        await i.warning(
          `Could not delete collection ${p.substring(0, 8)}...: ${u}`
        );
      }
    await figma.loadAllPagesAsync();
    let o = 0;
    for (const p of t)
      try {
        const u = await figma.getNodeByIdAsync(p);
        u && u.type === "PAGE" && (u.remove(), o++);
      } catch (u) {
        await i.warning(
          `Could not delete page ${p.substring(0, 8)}...: ${u}`
        );
      }
    return await i.log(
      `Cleanup complete: Deleted ${o} page(s), ${s} collection(s), ${r} variable(s)`
    ), {
      type: "cleanupCreatedEntities",
      success: !0,
      error: !1,
      message: "Cleanup completed successfully",
      data: {
        deletedPages: o,
        deletedCollections: s,
        deletedVariables: r
      }
    };
  } catch (t) {
    const a = t instanceof Error ? t.message : "Unknown error occurred";
    return await i.error(`Cleanup failed: ${a}`), {
      type: "cleanupCreatedEntities",
      success: !1,
      error: !0,
      message: a,
      data: {}
    };
  }
}
async function Bt(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children;
    console.log("Found " + t.length + " pages in the document");
    const a = 11, n = t[a];
    if (!n)
      return {
        type: "quickCopy",
        success: !1,
        error: !0,
        message: "No page found at index 11",
        data: {}
      };
    const r = await le(
      n,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + n.name + " (index: " + a + ")"
    );
    const s = JSON.stringify(r, null, 2), o = JSON.parse(s), p = "Copy - " + o.name, u = figma.createPage();
    if (u.name = p, figma.root.appendChild(u), o.children && o.children.length > 0) {
      let d = function(c) {
        c.forEach((h) => {
          const w = (h.x || 0) + (h.width || 0);
          w > g && (g = w), h.children && h.children.length > 0 && d(h.children);
        });
      };
      console.log(
        "Recreating " + o.children.length + " top-level children..."
      );
      let g = 0;
      d(o.children), console.log("Original content rightmost edge: " + g);
      for (const c of o.children)
        await W(c, u, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const l = we(o);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: o.name,
        newPageName: p,
        totalNodes: l
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
async function jt(e) {
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
async function Dt(e) {
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
async function Ht(e) {
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
async function Kt(e) {
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
function fe(e, t = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: t
  };
}
function Ve(e, t, a = {}) {
  const n = t instanceof Error ? t.message : t;
  return {
    type: e,
    success: !1,
    error: !0,
    message: n,
    data: a
  };
}
const Ge = "RecursicaPublishedMetadata";
async function qt(e) {
  try {
    const t = figma.currentPage;
    await figma.loadAllPagesAsync();
    const n = figma.root.children.findIndex(
      (p) => p.id === t.id
    ), r = t.getPluginData(Ge);
    if (!r) {
      const l = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: re(t.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: n
      };
      return fe("getComponentMetadata", l);
    }
    const o = {
      componentMetadata: JSON.parse(r),
      currentPageIndex: n
    };
    return fe("getComponentMetadata", o);
  } catch (t) {
    return console.error("Error getting component metadata:", t), Ve(
      "getComponentMetadata",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function Jt(e) {
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
      const s = r, o = s.getPluginData(Ge);
      if (o)
        try {
          const p = JSON.parse(o);
          a.push(p);
        } catch (p) {
          console.warn(
            `Failed to parse metadata for page "${s.name}":`,
            p
          );
          const l = {
            _ver: 1,
            id: "",
            name: re(s.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          a.push(l);
        }
      else {
        const u = {
          _ver: 1,
          id: "",
          name: re(s.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        a.push(u);
      }
    }
    return fe("getAllComponents", {
      components: a
    });
  } catch (t) {
    return console.error("Error getting all components:", t), Ve(
      "getAllComponents",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function Wt(e) {
  try {
    const t = e.requestId, a = e.action;
    return !t || !a ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (q.handleResponse({ requestId: t, action: a }), {
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
async function Yt(e) {
  try {
    const { pageId: t } = e;
    await figma.loadAllPagesAsync();
    const a = await figma.getNodeByIdAsync(t);
    return !a || a.type !== "PAGE" ? {
      type: "switchToPage",
      success: !1,
      error: !0,
      message: `Page with ID ${t.substring(0, 8)}... not found`,
      data: {}
    } : (await figma.setCurrentPageAsync(a), {
      type: "switchToPage",
      success: !0,
      error: !1,
      message: `Switched to page "${a.name}"`,
      data: {
        pageName: a.name
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
const Xt = {
  getCurrentUser: Ke,
  loadPages: qe,
  exportPage: Le,
  importPage: Ft,
  cleanupCreatedEntities: Ut,
  quickCopy: Bt,
  storeAuthData: jt,
  loadAuthData: Dt,
  clearAuthData: Ht,
  storeSelectedRepo: Kt,
  getComponentMetadata: qt,
  getAllComponents: Jt,
  pluginPromptResponse: Wt,
  switchToPage: Yt
}, Zt = Xt;
figma.showUI(__html__, {
  width: 500,
  height: 500
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    at(e);
    return;
  }
  const t = e;
  try {
    const a = t.type, n = Zt[a];
    if (!n) {
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
    const r = await n(t.data);
    figma.ui.postMessage(_(x({}, r), {
      requestId: t.requestId
    }));
  } catch (a) {
    console.error("Error handling message:", a);
    const n = {
      type: t.type,
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {},
      requestId: t.requestId
    };
    figma.ui.postMessage(n);
  }
};
