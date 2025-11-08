var Ve = Object.defineProperty, Ge = Object.defineProperties;
var Be = Object.getOwnPropertyDescriptors;
var Y = Object.getOwnPropertySymbols;
var he = Object.prototype.hasOwnProperty, be = Object.prototype.propertyIsEnumerable;
var ne = (e, t, a) => t in e ? Ve(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, v = (e, t) => {
  for (var a in t || (t = {}))
    he.call(t, a) && ne(e, a, t[a]);
  if (Y)
    for (var a of Y(t))
      be.call(t, a) && ne(e, a, t[a]);
  return e;
}, $ = (e, t) => Ge(e, Be(t));
var Ae = (e, t) => {
  var a = {};
  for (var i in e)
    he.call(e, i) && t.indexOf(i) < 0 && (a[i] = e[i]);
  if (e != null && Y)
    for (var i of Y(e))
      t.indexOf(i) < 0 && be.call(e, i) && (a[i] = e[i]);
  return a;
};
var P = (e, t, a) => ne(e, typeof t != "symbol" ? t + "" : t, a);
async function Ue(e) {
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
async function Fe(e) {
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
}, M = $(v({}, k), {
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
}), _ = $(v({}, k), {
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
}), K = $(v({}, k), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), Ce = $(v({}, k), {
  cornerRadius: 0
}), De = $(v({}, k), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function Ke(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return M;
    case "TEXT":
      return _;
    case "VECTOR":
      return K;
    case "LINE":
      return De;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return Ce;
    default:
      return k;
  }
}
function m(e, t) {
  if (Array.isArray(e))
    return Array.isArray(t) ? e.length !== t.length || e.some((a, i) => m(a, t[i])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof t == "object" && t !== null) {
      const a = Object.keys(e), i = Object.keys(t);
      return a.length !== i.length ? !0 : a.some(
        (r) => !(r in t) || m(e[r], t[r])
      );
    }
    return !0;
  }
  return e !== t;
}
const se = {
  LAYER: "00000000-0000-0000-0000-000000000001",
  TOKENS: "00000000-0000-0000-0000-000000000002",
  THEME: "00000000-0000-0000-0000-000000000003"
}, V = {
  LAYER: "Layer",
  TOKENS: "Tokens",
  THEME: "Theme"
};
function B(e) {
  const t = e.trim(), a = t.toLowerCase();
  return a === "themes" ? V.THEME : a === "token" ? V.TOKENS : a === "layer" ? V.LAYER : a === "tokens" ? V.TOKENS : a === "theme" ? V.THEME : t;
}
function F(e) {
  const t = B(e);
  return t === V.LAYER || t === V.TOKENS || t === V.THEME;
}
function ge(e) {
  const t = B(e);
  if (t === V.LAYER)
    return se.LAYER;
  if (t === V.TOKENS)
    return se.TOKENS;
  if (t === V.THEME)
    return se.THEME;
}
class ae {
  constructor() {
    P(this, "collectionMap");
    // collectionId -> index
    P(this, "collections");
    // index -> collection data
    P(this, "normalizedNameMap");
    // normalized name -> index (for standard collections)
    P(this, "nextIndex");
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
    const i = B(
      t.collectionName
    );
    if (F(t.collectionName)) {
      const n = this.findCollectionByNormalizedName(i);
      if (n !== void 0) {
        const o = this.collections[n];
        return o.modes = this.mergeModes(
          o.modes,
          t.modes
        ), this.collectionMap.set(a, n), n;
      }
    }
    const r = this.nextIndex++;
    this.collectionMap.set(a, r);
    const s = $(v({}, t), {
      collectionName: i
    });
    if (F(t.collectionName)) {
      const n = ge(
        t.collectionName
      );
      n && (s.collectionGuid = n), this.normalizedNameMap.set(i, r);
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
      const i = this.collections[a], r = v({
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
    const a = new ae(), i = Object.entries(t).sort(
      (s, n) => parseInt(s[0], 10) - parseInt(n[0], 10)
    );
    for (const [s, n] of i) {
      const o = parseInt(s, 10), l = (r = n.isLocal) != null ? r : !0, g = B(
        n.collectionName || ""
      ), d = n.collectionId || n.collectionGuid || `temp:${o}:${g}`, p = v({
        collectionName: g,
        collectionId: d,
        isLocal: l,
        modes: n.modes || []
      }, n.collectionGuid && {
        collectionGuid: n.collectionGuid
      });
      a.collectionMap.set(d, o), a.collections[o] = p, F(g) && a.normalizedNameMap.set(g, o), a.nextIndex = Math.max(
        a.nextIndex,
        o + 1
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
const qe = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, je = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function Je(e) {
  var a;
  const t = e.toUpperCase();
  return (a = qe[t]) != null ? a : e;
}
function We(e) {
  var t;
  return typeof e == "number" ? (t = je[e]) != null ? t : e.toString() : e;
}
class ie {
  constructor() {
    P(this, "variableMap");
    // variableKey -> index
    P(this, "variables");
    // index -> variable data
    P(this, "nextIndex");
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
      ), s = v(v({
        variableName: i.variableName,
        variableType: Je(i.variableType)
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
    const a = new ie(), i = Object.entries(t).sort(
      (r, s) => parseInt(r[0], 10) - parseInt(s[0], 10)
    );
    for (const [r, s] of i) {
      const n = parseInt(r, 10), o = We(s.variableType), l = $(v({}, s), {
        variableType: o
        // Always a string after expansion
      });
      a.variables[n] = l, a.nextIndex = Math.max(a.nextIndex, n + 1);
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
function He(e) {
  return {
    _varRef: e
  };
}
function Ee(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let Ye = 0;
const W = /* @__PURE__ */ new Map();
function Xe(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const t = W.get(e.requestId);
  t && (W.delete(e.requestId), e.error || !e.guid ? t.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : t.resolve(e.guid));
}
function ue() {
  return new Promise((e, t) => {
    const a = `guid_${Date.now()}_${++Ye}`;
    W.set(a, { resolve: e, reject: t }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: a
    }), setTimeout(() => {
      W.has(a) && (W.delete(a), t(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
const Te = {
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
async function X() {
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
    }), await X();
  },
  log: async (e) => {
    console.log(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    }), await X();
  },
  warning: async (e) => {
    console.warn(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    }), await X();
  },
  error: async (e) => {
    console.error(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    }), await X();
  }
};
function Qe(e, t) {
  const a = t.modes.find((i) => i.modeId === e);
  return a ? a.name : e;
}
async function Re(e, t, a, i, r = /* @__PURE__ */ new Set()) {
  const s = {};
  for (const [n, o] of Object.entries(e)) {
    const l = Qe(n, i);
    if (o == null) {
      s[l] = o;
      continue;
    }
    if (typeof o == "string" || typeof o == "number" || typeof o == "boolean") {
      s[l] = o;
      continue;
    }
    if (typeof o == "object" && o !== null && "type" in o && o.type === "VARIABLE_ALIAS" && "id" in o) {
      const g = o.id;
      if (r.has(g)) {
        s[l] = {
          type: "VARIABLE_ALIAS",
          id: g
        };
        continue;
      }
      const d = await figma.variables.getVariableByIdAsync(g);
      if (!d) {
        s[l] = {
          type: "VARIABLE_ALIAS",
          id: g
        };
        continue;
      }
      const p = new Set(r);
      p.add(g);
      const y = await figma.variables.getVariableCollectionByIdAsync(
        d.variableCollectionId
      ), h = d.key;
      if (!h) {
        s[l] = {
          type: "VARIABLE_ALIAS",
          id: g
        };
        continue;
      }
      const I = {
        variableName: d.name,
        variableType: d.resolvedType,
        collectionName: y == null ? void 0 : y.name,
        collectionId: d.variableCollectionId,
        variableKey: h,
        id: g,
        isLocal: !d.remote
      };
      if (y) {
        const A = await Me(
          y,
          a
        );
        I._colRef = A, d.valuesByMode && (I.valuesByMode = await Re(
          d.valuesByMode,
          t,
          a,
          y,
          // Pass collection for mode ID to name conversion
          p
        ));
      }
      const x = t.addVariable(I);
      s[l] = {
        type: "VARIABLE_ALIAS",
        id: g,
        _varRef: x
      };
    } else
      s[l] = o;
  }
  return s;
}
const Q = "recursica:collectionId";
async function Ze(e) {
  if (e.remote === !0) {
    const a = Te[e.id];
    if (!a) {
      const r = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await c.error(r), new Error(r);
    }
    return a.guid;
  } else {
    if (F(e.name)) {
      const r = ge(e.name);
      if (r) {
        const s = e.getSharedPluginData(
          "recursica",
          Q
        );
        return (!s || s.trim() === "") && e.setSharedPluginData(
          "recursica",
          Q,
          r
        ), r;
      }
    }
    const a = e.getSharedPluginData(
      "recursica",
      Q
    );
    if (a && a.trim() !== "")
      return a;
    const i = await ue();
    return e.setSharedPluginData("recursica", Q, i), i;
  }
}
function et(e, t) {
  if (t)
    return;
  const a = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(a))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Me(e, t) {
  const a = !e.remote, i = t.getCollectionIndex(e.id);
  if (i !== -1)
    return i;
  et(e.name, a);
  const r = await Ze(e), s = e.modes.map((g) => g.name), n = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: a,
    modes: s,
    collectionGuid: r
  }, o = t.addCollection(n), l = a ? "local" : "remote";
  return await c.log(
    `  Added ${l} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), o;
}
async function we(e, t, a) {
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
    const n = await Me(
      r,
      a
    ), o = {
      variableName: i.name,
      variableType: i.resolvedType,
      _colRef: n,
      // Reference to collection table (v2.4.0+)
      variableKey: s,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    i.valuesByMode && (o.valuesByMode = await Re(
      i.valuesByMode,
      t,
      a,
      r,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const l = t.addVariable(o);
    return He(l);
  } catch (i) {
    const r = i instanceof Error ? i.message : String(i);
    throw console.error("Could not resolve variable alias:", e.id, i), new Error(
      `Failed to resolve variable alias ${e.id}: ${r}`
    );
  }
}
async function te(e, t, a) {
  if (!e || typeof e != "object") return e;
  const i = {};
  for (const r in e)
    if (Object.prototype.hasOwnProperty.call(e, r)) {
      const s = e[r];
      if (s && typeof s == "object" && !Array.isArray(s))
        if (s.type === "VARIABLE_ALIAS") {
          const n = await we(
            s,
            t,
            a
          );
          n && (i[r] = n);
        } else
          i[r] = await te(
            s,
            t,
            a
          );
      else Array.isArray(s) ? i[r] = await Promise.all(
        s.map(async (n) => (n == null ? void 0 : n.type) === "VARIABLE_ALIAS" ? await we(
          n,
          t,
          a
        ) || n : n && typeof n == "object" ? await te(
          n,
          t,
          a
        ) : n)
      ) : i[r] = s;
    }
  return i;
}
async function tt(e, t, a) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const r = {};
      for (const s in i)
        Object.prototype.hasOwnProperty.call(i, s) && (s === "boundVariables" ? r[s] = await te(
          i[s],
          t,
          a
        ) : r[s] = i[s]);
      return r;
    })
  );
}
async function at(e, t) {
  const a = {}, i = /* @__PURE__ */ new Set();
  if (e.type && (a.type = e.type, i.add("type")), e.id && (a.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (a.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (a.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (a.y = e.y, i.add("y")), e.width !== void 0 && (a.width = e.width, i.add("width")), e.height !== void 0 && (a.height = e.height, i.add("height")), e.visible !== void 0 && m(e.visible, k.visible) && (a.visible = e.visible, i.add("visible")), e.locked !== void 0 && m(e.locked, k.locked) && (a.locked = e.locked, i.add("locked")), e.opacity !== void 0 && m(e.opacity, k.opacity) && (a.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && m(e.rotation, k.rotation) && (a.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && m(e.blendMode, k.blendMode) && (a.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && m(e.effects, k.effects) && (a.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const r = await tt(
      e.fills,
      t.variableTable,
      t.collectionTable
    );
    m(r, k.fills) && (a.fills = r), i.add("fills");
  }
  if (e.strokes !== void 0 && m(e.strokes, k.strokes) && (a.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && m(e.strokeWeight, k.strokeWeight) && (a.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && m(e.strokeAlign, k.strokeAlign) && (a.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const r = await te(
      e.boundVariables,
      t.variableTable,
      t.collectionTable
    );
    Object.keys(r).length > 0 && (a.boundVariables = r), i.add("boundVariables");
  }
  return a;
}
async function ve(e, t) {
  const a = {}, i = /* @__PURE__ */ new Set();
  return e.layoutMode !== void 0 && m(e.layoutMode, M.layoutMode) && (a.layoutMode = e.layoutMode, i.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && m(
    e.primaryAxisSizingMode,
    M.primaryAxisSizingMode
  ) && (a.primaryAxisSizingMode = e.primaryAxisSizingMode, i.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && m(
    e.counterAxisSizingMode,
    M.counterAxisSizingMode
  ) && (a.counterAxisSizingMode = e.counterAxisSizingMode, i.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && m(
    e.primaryAxisAlignItems,
    M.primaryAxisAlignItems
  ) && (a.primaryAxisAlignItems = e.primaryAxisAlignItems, i.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && m(
    e.counterAxisAlignItems,
    M.counterAxisAlignItems
  ) && (a.counterAxisAlignItems = e.counterAxisAlignItems, i.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && m(e.paddingLeft, M.paddingLeft) && (a.paddingLeft = e.paddingLeft, i.add("paddingLeft")), e.paddingRight !== void 0 && m(e.paddingRight, M.paddingRight) && (a.paddingRight = e.paddingRight, i.add("paddingRight")), e.paddingTop !== void 0 && m(e.paddingTop, M.paddingTop) && (a.paddingTop = e.paddingTop, i.add("paddingTop")), e.paddingBottom !== void 0 && m(e.paddingBottom, M.paddingBottom) && (a.paddingBottom = e.paddingBottom, i.add("paddingBottom")), e.itemSpacing !== void 0 && m(e.itemSpacing, M.itemSpacing) && (a.itemSpacing = e.itemSpacing, i.add("itemSpacing")), e.cornerRadius !== void 0 && m(e.cornerRadius, M.cornerRadius) && (a.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.clipsContent !== void 0 && m(e.clipsContent, M.clipsContent) && (a.clipsContent = e.clipsContent, i.add("clipsContent")), e.layoutWrap !== void 0 && m(e.layoutWrap, M.layoutWrap) && (a.layoutWrap = e.layoutWrap, i.add("layoutWrap")), e.layoutGrow !== void 0 && m(e.layoutGrow, M.layoutGrow) && (a.layoutGrow = e.layoutGrow, i.add("layoutGrow")), a;
}
async function it(e, t) {
  const a = {}, i = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (a.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (a.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (a.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && m(
    e.textAlignHorizontal,
    _.textAlignHorizontal
  ) && (a.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && m(
    e.textAlignVertical,
    _.textAlignVertical
  ) && (a.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && m(e.letterSpacing, _.letterSpacing) && (a.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && m(e.lineHeight, _.lineHeight) && (a.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && m(e.textCase, _.textCase) && (a.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && m(e.textDecoration, _.textDecoration) && (a.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && m(e.textAutoResize, _.textAutoResize) && (a.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && m(
    e.paragraphSpacing,
    _.paragraphSpacing
  ) && (a.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && m(e.paragraphIndent, _.paragraphIndent) && (a.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && m(e.listOptions, _.listOptions) && (a.listOptions = e.listOptions, i.add("listOptions")), a;
}
async function rt(e, t) {
  const a = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && m(e.fillGeometry, K.fillGeometry) && (a.fillGeometry = e.fillGeometry, i.add("fillGeometry")), e.strokeGeometry !== void 0 && m(e.strokeGeometry, K.strokeGeometry) && (a.strokeGeometry = e.strokeGeometry, i.add("strokeGeometry")), e.strokeCap !== void 0 && m(e.strokeCap, K.strokeCap) && (a.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && m(e.strokeJoin, K.strokeJoin) && (a.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && m(e.dashPattern, K.dashPattern) && (a.dashPattern = e.dashPattern, i.add("dashPattern")), a;
}
async function ot(e, t) {
  const a = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && m(e.cornerRadius, Ce.cornerRadius) && (a.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (a.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (a.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (a.pointCount = e.pointCount, i.add("pointCount")), a;
}
const nt = "RecursicaPublishedMetadata";
function Ne(e) {
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
function st(e) {
  try {
    const t = e.getSharedPluginData(
      "recursica",
      nt
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
async function ct(e, t) {
  const a = {}, i = /* @__PURE__ */ new Set();
  if (a._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function")
    try {
      const r = await e.getMainComponentAsync();
      if (!r)
        return a;
      const s = e.name || "(unnamed)", n = r.name || "(unnamed)", o = r.remote === !0, l = Ne(e), g = Ne(r);
      let d;
      o ? d = "remote" : g && l && g.id === l.id ? d = "internal" : (g && l && (g.id, l.id), d = "normal");
      let p, y;
      try {
        e.variantProperties && (p = e.variantProperties), e.componentProperties && (y = e.componentProperties);
      } catch (N) {
      }
      let h, I;
      try {
        let N = r.parent;
        const S = [];
        let w = 0;
        const O = 20;
        for (; N && w < O; )
          try {
            const E = N.type, D = N.name;
            if (E === "COMPONENT_SET" && !I && (I = D), E === "PAGE")
              break;
            const C = D || "";
            S.unshift(C), N = N.parent, w++;
          } catch (E) {
            break;
          }
        h = S;
      } catch (N) {
      }
      const x = v(v(v(v({
        instanceType: d,
        componentName: n
      }, I && { componentSetName: I }), p && { variantProperties: p }), y && { componentProperties: y }), d === "normal" ? { path: h || [] } : h && h.length > 0 && {
        path: h
      });
      if (d === "internal")
        x.componentNodeId = r.id, await c.log(
          `  Found INSTANCE: "${s}" -> INTERNAL component "${n}" (ID: ${r.id.substring(0, 8)}...)`
        );
      else if (d === "normal") {
        if (g) {
          x.componentPageName = g.name;
          const S = st(g);
          S != null && S.id && S.version !== void 0 && (x.componentGuid = S.id, x.componentVersion = S.version);
        }
        h === void 0 && console.warn(
          `Failed to build path for normal instance "${s}" -> component "${n}". Path is required for resolution.`
        );
        const N = h && h.length > 0 ? ` at path [${h.join(" → ")}]` : " at page root";
        await c.log(
          `  Found INSTANCE: "${s}" -> NORMAL component "${n}" (ID: ${r.id.substring(0, 8)}...)${N}`
        );
      } else if (d === "remote") {
        let N, S;
        try {
          if (typeof r.getPublishStatusAsync == "function")
            try {
              const w = await r.getPublishStatusAsync();
              w && typeof w == "object" && (w.libraryName && (N = w.libraryName), w.libraryKey && (S = w.libraryKey));
            } catch (w) {
            }
          try {
            const w = figma.teamLibrary;
            if (typeof (w == null ? void 0 : w.getAvailableLibraryComponentSetsAsync) == "function") {
              const O = await w.getAvailableLibraryComponentSetsAsync();
              if (O && Array.isArray(O)) {
                for (const E of O)
                  if (E.key === r.key || E.name === r.name) {
                    E.libraryName && (N = E.libraryName), E.libraryKey && (S = E.libraryKey);
                    break;
                  }
              }
            }
          } catch (w) {
          }
          try {
            x.structure = await oe(
              r,
              /* @__PURE__ */ new WeakSet(),
              t
            );
          } catch (w) {
            console.warn(
              `Failed to extract structure for remote component "${n}":`,
              w
            );
          }
        } catch (w) {
          console.warn(
            `Error getting library info for remote component "${n}":`,
            w
          );
        }
        N && (x.remoteLibraryName = N), S && (x.remoteLibraryKey = S), await c.log(
          `  Found INSTANCE: "${s}" -> REMOTE component "${n}" (ID: ${r.id.substring(0, 8)}...)`
        );
      }
      const A = t.instanceTable.addInstance(x);
      a._instanceRef = A, i.add("_instanceRef");
    } catch (r) {
      console.log(
        "Error getting main component for " + (e.name || "unknown") + ":",
        r
      );
    }
  return a;
}
class fe {
  constructor() {
    P(this, "instanceMap");
    // unique key -> index
    P(this, "instances");
    // index -> instance data
    P(this, "nextIndex");
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
    const a = new fe(), i = Object.entries(t).sort(
      (r, s) => parseInt(r[0], 10) - parseInt(s[0], 10)
    );
    for (const [r, s] of i) {
      const n = parseInt(r, 10), o = a.generateKey(s);
      a.instanceMap.set(o, n), a.instances[n] = s, a.nextIndex = Math.max(a.nextIndex, n + 1);
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
const ke = {
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
function lt() {
  const e = {};
  for (const [t, a] of Object.entries(ke))
    e[a] = t;
  return e;
}
function xe(e) {
  var t;
  return (t = ke[e]) != null ? t : e;
}
function dt(e) {
  var t;
  return typeof e == "number" ? (t = lt()[e]) != null ? t : e.toString() : e;
}
const Pe = {
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
}, ce = {};
for (const [e, t] of Object.entries(Pe))
  ce[t] = e;
class re {
  constructor() {
    P(this, "shortToLong");
    P(this, "longToShort");
    this.shortToLong = v({}, ce), this.longToShort = v({}, Pe);
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
        const n = this.getShortName(r);
        if (n !== r && !i.has(n)) {
          let o = this.compressObject(s);
          n === "type" && typeof o == "string" && (o = xe(o)), a[n] = o;
        } else {
          let o = this.compressObject(s);
          r === "type" && typeof o == "string" && (o = xe(o)), a[r] = o;
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
        let n = this.expandObject(r);
        (s === "type" || i === "type") && (typeof n == "number" || typeof n == "string") && (n = dt(n)), a[s] = n;
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
    return v({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(t) {
    const a = new re();
    a.shortToLong = v(v({}, ce), t), a.longToShort = {};
    for (const [i, r] of Object.entries(
      a.shortToLong
    ))
      a.longToShort[r] = i;
    return a;
  }
}
function gt(e, t) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const a = {};
  e.metadata && (a.metadata = e.metadata);
  for (const [i, r] of Object.entries(e))
    i !== "metadata" && (a[i] = t.compressObject(r));
  return a;
}
function ut(e, t) {
  return t.expandObject(e);
}
function pe(e) {
  let t = 1;
  return e.children && e.children.length > 0 && e.children.forEach((a) => {
    t += pe(a);
  }), t;
}
async function oe(e, t = /* @__PURE__ */ new WeakSet(), a = {}) {
  var p, y, h, I, x;
  if (!e || typeof e != "object")
    return e;
  const i = (p = a.maxNodes) != null ? p : 1e4, r = (y = a.nodeCount) != null ? y : 0;
  if (r >= i)
    return await c.warning(
      `Maximum node count (${i}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: r
    };
  const s = {
    visited: (h = a.visited) != null ? h : /* @__PURE__ */ new WeakSet(),
    depth: (I = a.depth) != null ? I : 0,
    maxDepth: (x = a.maxDepth) != null ? x : 100,
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
  const n = {}, o = await at(e, s);
  Object.assign(n, o);
  const l = e.type;
  if (l)
    switch (l) {
      case "FRAME":
      case "COMPONENT": {
        const A = await ve(e);
        Object.assign(n, A);
        break;
      }
      case "INSTANCE": {
        const A = await ct(
          e,
          s
        );
        Object.assign(n, A);
        const N = await ve(
          e
        );
        Object.assign(n, N);
        break;
      }
      case "TEXT": {
        const A = await it(e);
        Object.assign(n, A);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const A = await rt(e);
        Object.assign(n, A);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const A = await ot(e);
        Object.assign(n, A);
        break;
      }
      default:
        s.unhandledKeys.add("_unknownType");
        break;
    }
  const g = Object.getOwnPropertyNames(e), d = /* @__PURE__ */ new Set([
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
  (l === "FRAME" || l === "COMPONENT" || l === "INSTANCE") && (d.add("layoutMode"), d.add("primaryAxisSizingMode"), d.add("counterAxisSizingMode"), d.add("primaryAxisAlignItems"), d.add("counterAxisAlignItems"), d.add("paddingLeft"), d.add("paddingRight"), d.add("paddingTop"), d.add("paddingBottom"), d.add("itemSpacing"), d.add("cornerRadius"), d.add("clipsContent"), d.add("layoutWrap"), d.add("layoutGrow")), l === "TEXT" && (d.add("characters"), d.add("fontName"), d.add("fontSize"), d.add("textAlignHorizontal"), d.add("textAlignVertical"), d.add("letterSpacing"), d.add("lineHeight"), d.add("textCase"), d.add("textDecoration"), d.add("textAutoResize"), d.add("paragraphSpacing"), d.add("paragraphIndent"), d.add("listOptions")), (l === "VECTOR" || l === "LINE") && (d.add("fillGeometry"), d.add("strokeGeometry")), (l === "RECTANGLE" || l === "ELLIPSE" || l === "STAR" || l === "POLYGON") && (d.add("pointCount"), d.add("innerRadius"), d.add("arcData")), l === "INSTANCE" && (d.add("mainComponent"), d.add("componentProperties"));
  for (const A of g)
    typeof e[A] != "function" && (d.has(A) || s.unhandledKeys.add(A));
  if (s.unhandledKeys.size > 0 && (n._unhandledKeys = Array.from(s.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const A = s.maxDepth;
    if (s.depth >= A)
      n.children = {
        _truncated: !0,
        _reason: `Maximum depth (${A}) reached`,
        _count: e.children.length
      };
    else if (s.nodeCount >= i)
      n.children = {
        _truncated: !0,
        _reason: `Maximum node count (${i}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const N = $(v({}, s), {
        depth: s.depth + 1
      }), S = [];
      let w = !1;
      for (const O of e.children) {
        if (N.nodeCount >= i) {
          n.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: S.length,
            _total: e.children.length,
            children: S
          }, w = !0;
          break;
        }
        const E = await oe(O, t, N);
        S.push(E), N.nodeCount && (s.nodeCount = N.nodeCount);
      }
      w || (n.children = S);
    }
  }
  return n;
}
async function ft(e) {
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
    const r = new ie(), s = new ae(), n = new fe();
    await c.log("Fetching team library variable collections...");
    let o = [];
    try {
      if (o = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((T) => ({
        libraryName: T.libraryName,
        key: T.key,
        name: T.name
      })), await c.log(
        `Found ${o.length} library collection(s) in team library`
      ), o.length > 0)
        for (const T of o)
          await c.log(`  - ${T.name} (from ${T.libraryName})`);
    } catch (C) {
      await c.warning(
        `Could not get library variable collections: ${C instanceof Error ? C.message : String(C)}`
      );
    }
    await c.log("Extracting node data from page..."), await c.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await c.log(
      "Collections will be discovered as variables are processed:"
    );
    const l = await oe(
      i,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: r,
        collectionTable: s,
        instanceTable: n
      }
    );
    await c.log("Node extraction finished");
    const g = pe(l), d = r.getSize(), p = s.getSize(), y = n.getSize();
    if (await c.log("Extraction complete:"), await c.log(`  - Total nodes: ${g}`), await c.log(`  - Unique variables: ${d}`), await c.log(`  - Unique collections: ${p}`), await c.log(`  - Unique instances: ${y}`), p > 0) {
      await c.log("Collections found:");
      const C = s.getTable();
      for (const [T, q] of Object.values(C).entries()) {
        const j = q.collectionGuid ? ` (GUID: ${q.collectionGuid.substring(0, 8)}...)` : "";
        await c.log(
          `  ${T}: ${q.collectionName}${j} - ${q.modes.length} mode(s)`
        );
      }
    }
    await c.log("Creating string table...");
    const h = new re();
    await c.log("Getting page metadata...");
    const I = i.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let x = "", A = 0;
    if (I)
      try {
        const C = JSON.parse(I);
        x = C.id || "", A = C.version || 0;
      } catch (C) {
        await c.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!x) {
      await c.log("Generating new GUID for page..."), x = await ue();
      const C = {
        _ver: 1,
        id: x,
        name: i.name,
        version: A,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      i.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(C)
      );
    }
    await c.log("Creating export data structure...");
    const N = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "2.7.0",
        // Updated version for string table compression
        figmaApiVersion: figma.apiVersion,
        guid: x,
        version: A,
        name: i.name,
        pluginVersion: "1.0.0"
      },
      stringTable: h.getSerializedTable(),
      collections: s.getSerializedTable(),
      variables: r.getSerializedTable(),
      instances: n.getSerializedTable(),
      libraries: o,
      // Libraries might not need compression, but could be added later
      pageData: l
    };
    await c.log("Compressing JSON data...");
    const S = gt(N, h);
    await c.log("Serializing to JSON...");
    const w = JSON.stringify(S, null, 2), O = (w.length / 1024).toFixed(2), E = i.name.replace(/[^a-z0-9]/gi, "_") + "_export.json";
    return await c.log(`JSON serialization complete: ${O} KB`), await c.log(`Export file: ${E}`), await c.log("=== Export Complete ==="), {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: E,
        jsonData: w,
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
const Z = /* @__PURE__ */ new Map();
let pt = 0;
function mt() {
  return `prompt_${Date.now()}_${++pt}`;
}
const Oe = {
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
    var o;
    const a = typeof t == "number" ? { timeoutMs: t } : t, i = (o = a == null ? void 0 : a.timeoutMs) != null ? o : 3e5, r = a == null ? void 0 : a.okLabel, s = a == null ? void 0 : a.cancelLabel, n = mt();
    return new Promise((l, g) => {
      const d = i === -1 ? null : setTimeout(() => {
        Z.delete(n), g(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      Z.set(n, {
        resolve: l,
        reject: g,
        timeout: d
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: v(v({
          message: e,
          requestId: n
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
    const { requestId: t, action: a } = e, i = Z.get(t);
    if (!i) {
      console.warn(
        `Received response for unknown prompt request: ${t}`
      );
      return;
    }
    i.timeout && clearTimeout(i.timeout), Z.delete(t), a === "ok" ? i.resolve() : i.reject(new Error("User cancelled"));
  }
};
async function H(e, t) {
  for (const a of t)
    e.modes.find((r) => r.name === a) || e.addMode(a);
}
const z = "recursica:collectionId";
async function ee(e) {
  if (e.remote === !0) {
    const a = Te[e.id];
    if (!a) {
      const r = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await c.error(r), new Error(r);
    }
    return a.guid;
  } else {
    const a = e.getSharedPluginData(
      "recursica",
      z
    );
    if (a && a.trim() !== "")
      return a;
    const i = await ue();
    return e.setSharedPluginData("recursica", z, i), i;
  }
}
function yt(e, t) {
  const a = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(a))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function ht(e) {
  let t;
  const a = e.collectionName.trim().toLowerCase(), i = ["token", "tokens", "theme", "themes"], r = e.isLocal;
  if (r === !1 || r === void 0 && i.includes(a))
    try {
      const o = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((l) => l.name.trim().toLowerCase() === a);
      if (o) {
        yt(e.collectionName, !1);
        const l = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          o.key
        );
        if (l.length > 0) {
          const g = await figma.variables.importVariableByKeyAsync(l[0].key), d = await figma.variables.getVariableCollectionByIdAsync(
            g.variableCollectionId
          );
          if (d) {
            if (t = d, e.collectionGuid) {
              const p = t.getSharedPluginData(
                "recursica",
                z
              );
              (!p || p.trim() === "") && t.setSharedPluginData(
                "recursica",
                z,
                e.collectionGuid
              );
            } else
              await ee(t);
            return await H(t, e.modes), { collection: t };
          }
        }
      }
    } catch (n) {
      if (r === !1)
        throw new Error(
          `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
        );
      console.log("Could not import external collection, trying local:", n);
    }
  if (r !== !1) {
    const n = await figma.variables.getLocalVariableCollectionsAsync();
    let o;
    if (e.collectionGuid && (o = n.find((l) => l.getSharedPluginData("recursica", z) === e.collectionGuid)), o || (o = n.find(
      (l) => l.name === e.collectionName
    )), o)
      if (t = o, e.collectionGuid) {
        const l = t.getSharedPluginData(
          "recursica",
          z
        );
        (!l || l.trim() === "") && t.setSharedPluginData(
          "recursica",
          z,
          e.collectionGuid
        );
      } else
        await ee(t);
    else
      t = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? t.setSharedPluginData(
        "recursica",
        z,
        e.collectionGuid
      ) : await ee(t);
  } else {
    const n = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), o = e.collectionName.trim().toLowerCase(), l = n.find((y) => y.name.trim().toLowerCase() === o);
    if (!l)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const g = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      l.key
    );
    if (g.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const d = await figma.variables.importVariableByKeyAsync(
      g[0].key
    ), p = await figma.variables.getVariableCollectionByIdAsync(
      d.variableCollectionId
    );
    if (!p)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (t = p, e.collectionGuid) {
      const y = t.getSharedPluginData(
        "recursica",
        z
      );
      (!y || y.trim() === "") && t.setSharedPluginData(
        "recursica",
        z,
        e.collectionGuid
      );
    } else
      ee(t);
  }
  return await H(t, e.modes), { collection: t };
}
async function Le(e, t) {
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
async function bt(e, t, a, i, r) {
  for (const [s, n] of Object.entries(t)) {
    const o = i.modes.find((g) => g.name === s);
    if (!o) {
      console.warn(
        `Mode "${s}" not found in collection "${i.name}" for variable "${e.name}". Skipping.`
      );
      continue;
    }
    const l = o.modeId;
    try {
      if (n == null)
        continue;
      if (typeof n == "string" || typeof n == "number" || typeof n == "boolean") {
        e.setValueForMode(l, n);
        continue;
      }
      if (typeof n == "object" && n !== null && "_varRef" in n && typeof n._varRef == "number") {
        const g = n;
        let d = null;
        const p = a.getVariableByIndex(
          g._varRef
        );
        if (p) {
          let y = null;
          if (r && p._colRef !== void 0) {
            const h = r.getCollectionByIndex(
              p._colRef
            );
            h && (y = (await ht(h)).collection);
          }
          y && (d = await Le(
            y,
            p.variableName
          ));
        }
        if (d) {
          const y = {
            type: "VARIABLE_ALIAS",
            id: d.id
          };
          e.setValueForMode(l, y);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${s}" in variable "${e.name}". Variable reference index: ${g._varRef}`
          );
      }
    } catch (g) {
      console.warn(
        `Error setting value for mode "${s}" in variable "${e.name}":`,
        g
      );
    }
  }
}
async function Se(e, t, a, i) {
  const r = figma.variables.createVariable(
    e.variableName,
    t,
    e.variableType
  );
  return e.valuesByMode && await bt(
    r,
    e.valuesByMode,
    a,
    t,
    // Pass collection to look up modes by name
    i
  ), r;
}
async function At(e, t, a, i) {
  if (!(!t || typeof t != "object"))
    try {
      const r = e[a];
      if (!r || !Array.isArray(r))
        return;
      const s = t[a];
      if (Array.isArray(s))
        for (let n = 0; n < s.length && n < r.length; n++) {
          const o = s[n];
          if (o && typeof o == "object") {
            r[n].boundVariables || (r[n].boundVariables = {});
            for (const [l, g] of Object.entries(
              o
            ))
              if (Ee(g)) {
                const d = g._varRef;
                if (d !== void 0) {
                  const p = i.get(String(d));
                  p && (r[n].boundVariables[l] = {
                    type: "VARIABLE_ALIAS",
                    id: p.id
                  });
                }
              }
          }
        }
    } catch (r) {
      console.log(`Error restoring bound variables for ${a}:`, r);
    }
}
function wt(e, t) {
  const a = Ke(t);
  if (e.visible === void 0 && (e.visible = a.visible), e.locked === void 0 && (e.locked = a.locked), e.opacity === void 0 && (e.opacity = a.opacity), e.rotation === void 0 && (e.rotation = a.rotation), e.blendMode === void 0 && (e.blendMode = a.blendMode), t === "FRAME" || t === "COMPONENT" || t === "INSTANCE") {
    const i = M;
    e.layoutMode === void 0 && (e.layoutMode = i.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = i.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = i.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = i.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = i.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = i.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = i.paddingRight), e.paddingTop === void 0 && (e.paddingTop = i.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = i.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = i.itemSpacing);
  }
  if (t === "TEXT") {
    const i = _;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = i.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = i.textAlignVertical), e.textCase === void 0 && (e.textCase = i.textCase), e.textDecoration === void 0 && (e.textDecoration = i.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = i.textAutoResize);
  }
}
async function me(e, t, a = null, i = null, r = null, s = null) {
  var n;
  try {
    let o;
    switch (e.type) {
      case "FRAME":
        o = figma.createFrame();
        break;
      case "RECTANGLE":
        o = figma.createRectangle();
        break;
      case "ELLIPSE":
        o = figma.createEllipse();
        break;
      case "TEXT":
        o = figma.createText();
        break;
      case "VECTOR":
        o = figma.createVector();
        break;
      case "STAR":
        o = figma.createStar();
        break;
      case "LINE":
        o = figma.createLine();
        break;
      case "COMPONENT":
        o = figma.createComponent();
        break;
      case "INSTANCE":
        if (console.log("Found instance node: " + e.name), e.mainComponent && e.mainComponent.key)
          try {
            const l = await figma.importComponentByKeyAsync(
              e.mainComponent.key
            );
            l && l.type === "COMPONENT" ? (o = l.createInstance(), console.log(
              "Created instance from main component: " + e.mainComponent.name
            )) : (console.log("Main component not found, creating frame fallback"), o = figma.createFrame());
          } catch (l) {
            console.log(
              "Error creating instance: " + l + ", creating frame fallback"
            ), o = figma.createFrame();
          }
        else
          console.log("No main component info, creating frame fallback"), o = figma.createFrame();
        break;
      case "GROUP":
        o = figma.createFrame();
        break;
      case "BOOLEAN_OPERATION":
        console.log(
          "Boolean operation found: " + e.name + ", creating frame fallback"
        ), o = figma.createFrame();
        break;
      case "POLYGON":
        o = figma.createPolygon();
        break;
      default:
        console.log(
          "Unsupported node type: " + e.type + ", creating frame instead"
        ), o = figma.createFrame();
        break;
    }
    if (!o)
      return null;
    if (wt(o, e.type || "FRAME"), e.name !== void 0 && (o.name = e.name || "Unnamed Node"), e.x !== void 0 && (o.x = e.x), e.y !== void 0 && (o.y = e.y), e.width !== void 0 && e.height !== void 0 && o.resize(e.width, e.height), e.visible !== void 0 && (o.visible = e.visible), e.locked !== void 0 && (o.locked = e.locked), e.opacity !== void 0 && (o.opacity = e.opacity), e.rotation !== void 0 && (o.rotation = e.rotation), e.blendMode !== void 0 && (o.blendMode = e.blendMode), e.type !== "INSTANCE" && e.fills !== void 0)
      try {
        let l = e.fills;
        Array.isArray(l) && (l = l.map((g) => {
          if (g && typeof g == "object") {
            const d = g, { boundVariables: p } = d;
            return Ae(d, ["boundVariables"]);
          }
          return g;
        })), o.fills = l, (n = e.boundVariables) != null && n.fills && s && await At(
          o,
          e.boundVariables,
          "fills",
          s
        );
      } catch (l) {
        console.log("Error setting fills:", l);
      }
    if (e.strokes !== void 0 && e.strokes.length > 0)
      try {
        o.strokes = e.strokes;
      } catch (l) {
        console.log("Error setting strokes:", l);
      }
    if (e.strokeWeight !== void 0 && (o.strokeWeight = e.strokeWeight), e.strokeAlign !== void 0 && (o.strokeAlign = e.strokeAlign), e.cornerRadius !== void 0 && (o.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (o.effects = e.effects), (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && (e.layoutMode !== void 0 && (o.layoutMode = e.layoutMode), e.primaryAxisSizingMode !== void 0 && (o.primaryAxisSizingMode = e.primaryAxisSizingMode), e.counterAxisSizingMode !== void 0 && (o.counterAxisSizingMode = e.counterAxisSizingMode), e.primaryAxisAlignItems !== void 0 && (o.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (o.counterAxisAlignItems = e.counterAxisAlignItems), e.paddingLeft !== void 0 && (o.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (o.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (o.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (o.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (o.itemSpacing = e.itemSpacing)), (e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (o.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (o.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (o.dashPattern = e.dashPattern)), e.type === "TEXT" && e.characters !== void 0)
      try {
        if (e.fontName)
          try {
            await figma.loadFontAsync(e.fontName), o.fontName = e.fontName;
          } catch (l) {
            await figma.loadFontAsync({
              family: "Roboto",
              style: "Regular"
            }), o.fontName = { family: "Roboto", style: "Regular" };
          }
        else
          await figma.loadFontAsync({
            family: "Roboto",
            style: "Regular"
          }), o.fontName = { family: "Roboto", style: "Regular" };
        o.characters = e.characters, e.fontSize !== void 0 && (o.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (o.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (o.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (o.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (o.lineHeight = e.lineHeight), e.textCase !== void 0 && (o.textCase = e.textCase), e.textDecoration !== void 0 && (o.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (o.textAutoResize = e.textAutoResize);
      } catch (l) {
        console.log("Error setting text properties: " + l);
        try {
          o.characters = e.characters;
        } catch (g) {
          console.log("Could not set text characters: " + g);
        }
      }
    if (e.boundVariables) {
      for (const [l, g] of Object.entries(
        e.boundVariables
      ))
        if (l !== "fills" && Ee(g) && a && s) {
          const d = g._varRef;
          if (d !== void 0) {
            const p = s.get(String(d));
            if (p) {
              const y = {
                type: "VARIABLE_ALIAS",
                id: p.id
              };
              o.boundVariables || (o.boundVariables = {}), o.boundVariables[l] || (o.boundVariables[l] = y);
            }
          }
        }
    }
    if (e.children && Array.isArray(e.children))
      for (const l of e.children) {
        if (l._truncated) {
          console.log(
            `Skipping truncated children: ${l._reason || "Unknown"}`
          );
          continue;
        }
        const g = await me(
          l,
          o,
          a,
          i
        );
        g && o.appendChild(g);
      }
    return t && t.appendChild(o), o;
  } catch (o) {
    return console.log(
      "Error recreating node " + (e.name || e.type) + ":",
      o
    ), null;
  }
}
async function Ie(e) {
  await figma.loadAllPagesAsync();
  const t = figma.root.children, a = new Set(t.map((s) => s.name));
  if (!a.has(e))
    return e;
  let i = 1, r = `${e}_${i}`;
  for (; a.has(r); )
    i++, r = `${e}_${i}`;
  return r;
}
async function vt(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), a = new Set(t.map((s) => s.name));
  if (!a.has(e))
    return e;
  let i = 1, r = `${e}_${i}`;
  for (; a.has(r); )
    i++, r = `${e}_${i}`;
  return r;
}
async function Nt(e, t) {
  const a = /* @__PURE__ */ new Set();
  for (const s of e.variableIds)
    try {
      const n = await figma.variables.getVariableByIdAsync(s);
      n && a.add(n.name);
    } catch (n) {
      continue;
    }
  if (!a.has(t))
    return t;
  let i = 1, r = `${t}_${i}`;
  for (; a.has(r); )
    i++, r = `${t}_${i}`;
  return r;
}
function xt(e, t) {
  const a = e.resolvedType.toUpperCase(), i = t.toUpperCase();
  return a === i;
}
async function St(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), a = B(e.collectionName);
  if (F(e.collectionName)) {
    for (const i of t)
      if (B(i.name) === a)
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
        z
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
async function It(e) {
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
    if (await c.log("Starting import process"), await c.log("Validating metadata..."), !a.metadata)
      return await c.error("Invalid JSON format. Expected metadata."), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "Invalid JSON format. Expected metadata.",
        data: {}
      };
    const i = a.metadata;
    if (!i.guid || typeof i.guid != "string")
      return await c.error(
        "Invalid metadata. Missing or invalid 'guid' field."
      ), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "Invalid metadata. Missing or invalid 'guid' field.",
        data: {}
      };
    if (!i.name || typeof i.name != "string")
      return await c.error(
        "Invalid metadata. Missing or invalid 'name' field."
      ), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "Invalid metadata. Missing or invalid 'name' field.",
        data: {}
      };
    if (await c.log(
      `Metadata validated: guid=${i.guid}, name=${i.name}`
    ), await c.log("Loading string table..."), !a.stringTable)
      return await c.error(
        "Invalid JSON format. String table is required."
      ), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "Invalid JSON format. String table is required.",
        data: {}
      };
    let r;
    try {
      r = re.fromTable(a.stringTable), await c.log("String table loaded successfully");
    } catch (f) {
      const u = `Failed to load string table: ${f instanceof Error ? f.message : "Unknown error"}`;
      return await c.error(u), {
        type: "importPage",
        success: !1,
        error: !0,
        message: u,
        data: {}
      };
    }
    await c.log("Expanding JSON data...");
    const s = ut(a, r);
    if (await c.log("JSON expanded successfully"), await c.log("Loading collections table..."), !s.collections)
      return await c.log("No collections table found in JSON"), await c.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: i.name }
      };
    let n;
    try {
      n = ae.fromTable(s.collections), await c.log(
        `Loaded collections table with ${n.getSize()} collection(s)`
      );
    } catch (f) {
      const u = `Failed to load collections table: ${f instanceof Error ? f.message : "Unknown error"}`;
      return await c.error(u), {
        type: "importPage",
        success: !1,
        error: !0,
        message: u,
        data: {}
      };
    }
    await c.log(
      "Matching collections with existing local collections..."
    );
    const o = n.getTable(), l = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map();
    for (const [f, u] of Object.entries(o)) {
      if (u.isLocal === !1) {
        await c.log(
          `Skipping remote collection: "${u.collectionName}" (index ${f})`
        );
        continue;
      }
      const b = await St(u);
      b.matchType === "recognized" ? (await c.log(
        `✓ Recognized collection by GUID: "${u.collectionName}" (index ${f})`
      ), l.set(f, b.collection)) : b.matchType === "potential" ? (await c.log(
        `? Potential match by name: "${u.collectionName}" (index ${f})`
      ), g.set(f, {
        entry: u,
        collection: b.collection
      })) : (await c.log(
        `✗ No match found for collection: "${u.collectionName}" (index ${f}) - will create new`
      ), d.set(f, u));
    }
    await c.log(
      `Collection matching complete: ${l.size} recognized, ${g.size} potential matches, ${d.size} to create`
    ), g.size > 0 && await c.log(
      `Prompting user for ${g.size} potential match(es)...`
    );
    for (const [f, { entry: u, collection: b }] of g.entries())
      try {
        const R = F(u.collectionName) ? B(u.collectionName) : b.name, G = `Found existing "${R}" variable collection. Should I use it?`;
        await c.log(
          `Prompting user about potential match: "${R}"`
        ), await Oe.prompt(G, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
          // No timeout
        }), await c.log(
          `✓ User confirmed: Using existing collection "${R}" (index ${f})`
        ), l.set(f, b), await H(b, u.modes), await c.log(
          `  ✓ Ensured modes for collection "${R}" (${u.modes.length} mode(s))`
        );
      } catch (R) {
        await c.log(
          `✗ User rejected: Will create new collection for "${u.collectionName}" (index ${f})`
        ), d.set(f, u);
      }
    if (l.size > 0) {
      await c.log(
        "Ensuring modes exist for recognized collections..."
      );
      for (const [f, u] of l.entries()) {
        const b = o[f];
        b && (g.has(f) || (await H(u, b.modes), await c.log(
          `  ✓ Ensured modes for collection "${u.name}" (${b.modes.length} mode(s))`
        )));
      }
    }
    d.size > 0 && await c.log(
      `Creating ${d.size} new collection(s)...`
    );
    for (const [f, u] of d.entries()) {
      const b = B(u.collectionName), R = await vt(b);
      R !== b ? await c.log(
        `Creating collection: "${R}" (normalized: "${b}" - name conflict resolved)`
      ) : await c.log(`Creating collection: "${R}"`);
      const G = figma.variables.createVariableCollection(R);
      t.push(G);
      let L;
      if (F(u.collectionName)) {
        const U = ge(u.collectionName);
        U && (L = U);
      } else u.collectionGuid && (L = u.collectionGuid);
      L && (G.setSharedPluginData(
        "recursica",
        z,
        L
      ), await c.log(
        `  Stored GUID: ${L.substring(0, 8)}...`
      )), await H(G, u.modes), await c.log(
        `  ✓ Created collection "${R}" with ${u.modes.length} mode(s)`
      ), l.set(f, G);
    }
    if (await c.log("Collection creation complete"), await c.log("Loading variables table..."), !s.variables)
      return await c.log("No variables table found in JSON"), await c.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no variables to process)",
        data: { pageName: i.name }
      };
    let p;
    try {
      p = ie.fromTable(s.variables), await c.log(
        `Loaded variables table with ${p.getSize()} variable(s)`
      );
    } catch (f) {
      const u = `Failed to load variables table: ${f instanceof Error ? f.message : "Unknown error"}`;
      return await c.error(u), {
        type: "importPage",
        success: !1,
        error: !0,
        message: u,
        data: {}
      };
    }
    const y = [], h = /* @__PURE__ */ new Map(), I = new Set(
      t.map((f) => f.id)
    );
    await c.log("Matching and creating variables in collections...");
    const x = p.getTable(), A = /* @__PURE__ */ new Map();
    for (const [f, u] of Object.entries(x)) {
      if (u._colRef === void 0)
        continue;
      const b = l.get(String(u._colRef));
      if (!b)
        continue;
      A.has(b.id) || A.set(b.id, {
        collectionName: b.name,
        existing: 0,
        created: 0
      });
      const R = A.get(b.id), G = I.has(
        b.id
      );
      let L;
      typeof u.variableType == "number" ? L = {
        1: "COLOR",
        2: "FLOAT",
        3: "STRING",
        4: "BOOLEAN"
      }[u.variableType] || String(u.variableType) : L = u.variableType;
      const U = await Le(
        b,
        u.variableName
      );
      if (U)
        if (xt(U, L))
          h.set(f, U), R.existing++;
        else {
          await c.warning(
            `Type mismatch for variable "${u.variableName}" in collection "${b.name}": expected ${L}, found ${U.resolvedType}. Creating new variable with incremented name.`
          );
          const J = await Nt(
            b,
            u.variableName
          ), ye = await Se(
            $(v({}, u), {
              variableName: J,
              variableType: L
            }),
            b,
            p,
            n
          );
          G || y.push(ye), h.set(f, ye), R.created++;
        }
      else {
        const J = await Se(
          $(v({}, u), {
            variableType: L
          }),
          b,
          p,
          n
        );
        G || y.push(J), h.set(f, J), R.created++;
      }
    }
    await c.log("Variable processing complete:");
    let N = 0, S = 0;
    for (const f of A.values())
      await c.log(
        `  "${f.collectionName}": ${f.existing} existing, ${f.created} created`
      ), N += f.existing, S += f.created;
    await c.log("Skipping instance creation (not yet implemented)"), await c.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
    const w = figma.root.children, O = "RecursicaPublishedMetadata";
    let E = null;
    for (const f of w) {
      const u = f.getPluginData(O);
      if (u)
        try {
          if (JSON.parse(u).id === i.guid) {
            E = f;
            break;
          }
        } catch (b) {
          continue;
        }
    }
    E && await c.log(
      `Found existing page with same GUID: "${E.name}". Will create new page to avoid overwriting.`
    );
    const D = w.find((f) => f.name === i.name);
    D && await c.log(
      `Found existing page with same name: "${i.name}". Will create new page with unique name.`
    );
    let C;
    if (E || D) {
      const f = `__${i.name}`;
      C = await Ie(f), await c.log(
        `Creating scratch page: "${C}" (will be renamed to "${i.name}" on success)`
      );
    } else
      C = i.name, await c.log(`Creating page: "${C}"`);
    const T = figma.createPage();
    T.name = C, await figma.setCurrentPageAsync(T), await c.log(`Switched to page: "${C}"`);
    const q = [T];
    if (!s.pageData)
      return await c.error("No page data found in JSON"), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "No page data found in JSON",
        data: {}
      };
    await c.log("Recreating page structure...");
    const j = s.pageData;
    if (j.children && Array.isArray(j.children))
      for (const f of j.children) {
        const u = await me(
          f,
          T,
          p,
          n,
          null,
          // instanceTable - skipping for now
          h
        );
        u && T.appendChild(u);
      }
    await c.log("Page structure recreated successfully");
    const ze = {
      _ver: 1,
      id: i.guid,
      name: i.name,
      version: i.version || 0,
      publishDate: (/* @__PURE__ */ new Date()).toISOString(),
      history: {}
    };
    if (T.setPluginData(O, JSON.stringify(ze)), await c.log(
      `Stored page metadata (GUID: ${i.guid.substring(0, 8)}...)`
    ), C.startsWith("__")) {
      const f = await Ie(i.name);
      T.name = f, await c.log(
        `Renamed page from "${C}" to "${f}"`
      );
    }
    return await c.log("=== Import Complete ==="), await c.log(
      `Successfully processed ${l.size} collection(s), ${N + S} variable(s), and created page "${T.name}"`
    ), {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: { pageName: T.name }
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
async function Ct(e) {
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
    const r = await oe(
      i,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + i.name + " (index: " + a + ")"
    );
    const s = JSON.stringify(r, null, 2), n = JSON.parse(s), o = "Copy - " + n.name, l = figma.createPage();
    if (l.name = o, figma.root.appendChild(l), n.children && n.children.length > 0) {
      let p = function(h) {
        h.forEach((I) => {
          const x = (I.x || 0) + (I.width || 0);
          x > y && (y = x), I.children && I.children.length > 0 && p(I.children);
        });
      };
      console.log(
        "Recreating " + n.children.length + " top-level children..."
      );
      let y = 0;
      p(n.children), console.log("Original content rightmost edge: " + y);
      for (const h of n.children)
        await me(h, l, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const g = pe(n);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: n.name,
        newPageName: o,
        totalNodes: g
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
async function Et(e) {
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
async function Tt(e) {
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
async function Rt(e) {
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
async function Mt(e) {
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
function le(e, t = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: t
  };
}
function $e(e, t, a = {}) {
  const i = t instanceof Error ? t.message : t;
  return {
    type: e,
    success: !1,
    error: !0,
    message: i,
    data: a
  };
}
function de(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
const _e = "RecursicaPublishedMetadata";
async function kt(e) {
  try {
    const t = figma.currentPage;
    await figma.loadAllPagesAsync();
    const i = figma.root.children.findIndex(
      (o) => o.id === t.id
    ), r = t.getPluginData(_e);
    if (!r) {
      const g = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: de(t.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: i
      };
      return le("getComponentMetadata", g);
    }
    const n = {
      componentMetadata: JSON.parse(r),
      currentPageIndex: i
    };
    return le("getComponentMetadata", n);
  } catch (t) {
    return console.error("Error getting component metadata:", t), $e(
      "getComponentMetadata",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function Pt(e) {
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
      const s = r, n = s.getPluginData(_e);
      if (n)
        try {
          const o = JSON.parse(n);
          a.push(o);
        } catch (o) {
          console.warn(
            `Failed to parse metadata for page "${s.name}":`,
            o
          );
          const g = {
            _ver: 1,
            id: "",
            name: de(s.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          a.push(g);
        }
      else {
        const l = {
          _ver: 1,
          id: "",
          name: de(s.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        a.push(l);
      }
    }
    return le("getAllComponents", {
      components: a
    });
  } catch (t) {
    return console.error("Error getting all components:", t), $e(
      "getAllComponents",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function Ot(e) {
  try {
    const t = e.requestId, a = e.action;
    return !t || !a ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (Oe.handleResponse({ requestId: t, action: a }), {
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
const Lt = {
  getCurrentUser: Ue,
  loadPages: Fe,
  exportPage: ft,
  importPage: It,
  quickCopy: Ct,
  storeAuthData: Et,
  loadAuthData: Tt,
  clearAuthData: Rt,
  storeSelectedRepo: Mt,
  getComponentMetadata: kt,
  getAllComponents: Pt,
  pluginPromptResponse: Ot
}, $t = Lt;
figma.showUI(__html__, {
  width: 500,
  height: 650
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    Xe(e);
    return;
  }
  const t = e;
  try {
    const a = t.type, i = $t[a];
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
    figma.ui.postMessage($(v({}, r), {
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
