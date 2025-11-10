var Fe = Object.defineProperty, Be = Object.defineProperties;
var Ue = Object.getOwnPropertyDescriptors;
var ve = Object.getOwnPropertySymbols;
var je = Object.prototype.hasOwnProperty, Ke = Object.prototype.propertyIsEnumerable;
var ue = (e, t, a) => t in e ? Fe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, x = (e, t) => {
  for (var a in t || (t = {}))
    je.call(t, a) && ue(e, a, t[a]);
  if (ve)
    for (var a of ve(t))
      Ke.call(t, a) && ue(e, a, t[a]);
  return e;
}, L = (e, t) => Be(e, Ue(t));
var O = (e, t, a) => ue(e, typeof t != "symbol" ? t + "" : t, a);
async function De(e) {
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
async function He(e) {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "loadPages",
      success: !0,
      error: !1,
      message: "Pages loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        pages: figma.root.children.map((i, s) => ({
          name: i.name,
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
}, $ = L(x({}, k), {
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
}), _ = L(x({}, k), {
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
}), D = L(x({}, k), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), Ee = L(x({}, k), {
  cornerRadius: 0
}), qe = L(x({}, k), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function Je(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return $;
    case "TEXT":
      return _;
    case "VECTOR":
      return D;
    case "LINE":
      return qe;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return Ee;
    default:
      return k;
  }
}
function N(e, t) {
  if (Array.isArray(e))
    return Array.isArray(t) ? e.length !== t.length || e.some((a, r) => N(a, t[r])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof t == "object" && t !== null) {
      const a = Object.keys(e), r = Object.keys(t);
      return a.length !== r.length ? !0 : a.some(
        (i) => !(i in t) || N(e[i], t[i])
      );
    }
    return !0;
  }
  return e !== t;
}
const ge = {
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
function U(e) {
  const t = B(e);
  return t === V.LAYER || t === V.TOKENS || t === V.THEME;
}
function ye(e) {
  const t = B(e);
  if (t === V.LAYER)
    return ge.LAYER;
  if (t === V.TOKENS)
    return ge.TOKENS;
  if (t === V.THEME)
    return ge.THEME;
}
class re {
  constructor() {
    O(this, "collectionMap");
    // collectionId -> index
    O(this, "collections");
    // index -> collection data
    O(this, "normalizedNameMap");
    // normalized name -> index (for standard collections)
    O(this, "nextIndex");
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
    const r = new Set(t);
    for (const i of a)
      r.add(i);
    return Array.from(r);
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
    const r = B(
      t.collectionName
    );
    if (U(t.collectionName)) {
      const n = this.findCollectionByNormalizedName(r);
      if (n !== void 0) {
        const d = this.collections[n];
        return d.modes = this.mergeModes(
          d.modes,
          t.modes
        ), this.collectionMap.set(a, n), n;
      }
    }
    const i = this.nextIndex++;
    this.collectionMap.set(a, i);
    const s = L(x({}, t), {
      collectionName: r
    });
    if (U(t.collectionName)) {
      const n = ye(
        t.collectionName
      );
      n && (s.collectionGuid = n), this.normalizedNameMap.set(r, i);
    }
    return this.collections[i] = s, i;
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
      const r = this.collections[a], i = x({
        collectionName: r.collectionName,
        modes: r.modes
      }, r.collectionGuid && { collectionGuid: r.collectionGuid });
      t[String(a)] = i;
    }
    return t;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   * Handles both new format (without collectionId/isLocal) and legacy format (with collectionId/isLocal)
   */
  static fromTable(t) {
    var i;
    const a = new re(), r = Object.entries(t).sort(
      (s, n) => parseInt(s[0], 10) - parseInt(n[0], 10)
    );
    for (const [s, n] of r) {
      const d = parseInt(s, 10), u = (i = n.isLocal) != null ? i : !0, p = B(
        n.collectionName || ""
      ), o = n.collectionId || n.collectionGuid || `temp:${d}:${p}`, g = x({
        collectionName: p,
        collectionId: o,
        isLocal: u,
        modes: n.modes || []
      }, n.collectionGuid && {
        collectionGuid: n.collectionGuid
      });
      a.collectionMap.set(o, d), a.collections[d] = g, U(p) && a.normalizedNameMap.set(p, d), a.nextIndex = Math.max(
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
const We = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, Ye = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function Xe(e) {
  var a;
  const t = e.toUpperCase();
  return (a = We[t]) != null ? a : e;
}
function Ze(e) {
  var t;
  return typeof e == "number" ? (t = Ye[e]) != null ? t : e.toString() : e;
}
class ie {
  constructor() {
    O(this, "variableMap");
    // variableKey -> index
    O(this, "variables");
    // index -> variable data
    O(this, "nextIndex");
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
    const r = this.nextIndex++;
    return this.variableMap.set(a, r), this.variables[r] = t, r;
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
    for (const [r, i] of Object.entries(t))
      typeof i == "object" && i !== null && "_varRef" in i && typeof i._varRef == "number" ? a[r] = {
        _varRef: i._varRef
      } : a[r] = i;
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
      const r = this.variables[a], i = this.serializeValuesByMode(
        r.valuesByMode
      ), s = x(x({
        variableName: r.variableName,
        variableType: Xe(r.variableType)
      }, r._colRef !== void 0 && { _colRef: r._colRef }), i && { valuesByMode: i });
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
    const a = new ie(), r = Object.entries(t).sort(
      (i, s) => parseInt(i[0], 10) - parseInt(s[0], 10)
    );
    for (const [i, s] of r) {
      const n = parseInt(i, 10), d = Ze(s.variableType), u = L(x({}, s), {
        variableType: d
        // Always a string after expansion
      });
      a.variables[n] = u, a.nextIndex = Math.max(a.nextIndex, n + 1);
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
function Qe(e) {
  return {
    _varRef: e
  };
}
function Te(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let et = 0;
const H = /* @__PURE__ */ new Map();
function tt(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const t = H.get(e.requestId);
  t && (H.delete(e.requestId), e.error || !e.guid ? t.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : t.resolve(e.guid));
}
function he() {
  return new Promise((e, t) => {
    const a = `guid_${Date.now()}_${++et}`;
    H.set(a, { resolve: e, reject: t }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: a
    }), setTimeout(() => {
      H.has(a) && (H.delete(a), t(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
const Re = {
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
function at(e, t) {
  const a = t.modes.find((r) => r.modeId === e);
  return a ? a.name : e;
}
async function Me(e, t, a, r, i = /* @__PURE__ */ new Set()) {
  const s = {};
  for (const [n, d] of Object.entries(e)) {
    const u = at(n, r);
    if (d == null) {
      s[u] = d;
      continue;
    }
    if (typeof d == "string" || typeof d == "number" || typeof d == "boolean") {
      s[u] = d;
      continue;
    }
    if (typeof d == "object" && d !== null && "type" in d && d.type === "VARIABLE_ALIAS" && "id" in d) {
      const p = d.id;
      if (i.has(p)) {
        s[u] = {
          type: "VARIABLE_ALIAS",
          id: p
        };
        continue;
      }
      const o = await figma.variables.getVariableByIdAsync(p);
      if (!o) {
        s[u] = {
          type: "VARIABLE_ALIAS",
          id: p
        };
        continue;
      }
      const g = new Set(i);
      g.add(p);
      const f = await figma.variables.getVariableCollectionByIdAsync(
        o.variableCollectionId
      ), l = o.key;
      if (!l) {
        s[u] = {
          type: "VARIABLE_ALIAS",
          id: p
        };
        continue;
      }
      const y = {
        variableName: o.name,
        variableType: o.resolvedType,
        collectionName: f == null ? void 0 : f.name,
        collectionId: o.variableCollectionId,
        variableKey: l,
        id: p,
        isLocal: !o.remote
      };
      if (f) {
        const h = await Pe(
          f,
          a
        );
        y._colRef = h, o.valuesByMode && (y.valuesByMode = await Me(
          o.valuesByMode,
          t,
          a,
          f,
          // Pass collection for mode ID to name conversion
          g
        ));
      }
      const b = t.addVariable(y);
      s[u] = {
        type: "VARIABLE_ALIAS",
        id: p,
        _varRef: b
      };
    } else
      s[u] = d;
  }
  return s;
}
const Z = "recursica:collectionId";
async function rt(e) {
  if (e.remote === !0) {
    const a = Re[e.id];
    if (!a) {
      const i = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await c.error(i), new Error(i);
    }
    return a.guid;
  } else {
    if (U(e.name)) {
      const i = ye(e.name);
      if (i) {
        const s = e.getSharedPluginData(
          "recursica",
          Z
        );
        return (!s || s.trim() === "") && e.setSharedPluginData(
          "recursica",
          Z,
          i
        ), i;
      }
    }
    const a = e.getSharedPluginData(
      "recursica",
      Z
    );
    if (a && a.trim() !== "")
      return a;
    const r = await he();
    return e.setSharedPluginData("recursica", Z, r), r;
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
async function Pe(e, t) {
  const a = !e.remote, r = t.getCollectionIndex(e.id);
  if (r !== -1)
    return r;
  it(e.name, a);
  const i = await rt(e), s = e.modes.map((p) => p.name), n = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: a,
    modes: s,
    collectionGuid: i
  }, d = t.addCollection(n), u = a ? "local" : "remote";
  return await c.log(
    `  Added ${u} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), d;
}
async function Ne(e, t, a) {
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
    const s = r.key;
    if (!s)
      return console.log("Variable missing key:", e.id), null;
    const n = await Pe(
      i,
      a
    ), d = {
      variableName: r.name,
      variableType: r.resolvedType,
      _colRef: n,
      // Reference to collection table (v2.4.0+)
      variableKey: s,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    r.valuesByMode && (d.valuesByMode = await Me(
      r.valuesByMode,
      t,
      a,
      i,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const u = t.addVariable(d);
    return Qe(u);
  } catch (r) {
    const i = r instanceof Error ? r.message : String(r);
    throw console.error("Could not resolve variable alias:", e.id, r), new Error(
      `Failed to resolve variable alias ${e.id}: ${i}`
    );
  }
}
async function te(e, t, a) {
  if (!e || typeof e != "object") return e;
  const r = {};
  for (const i in e)
    if (Object.prototype.hasOwnProperty.call(e, i)) {
      const s = e[i];
      if (s && typeof s == "object" && !Array.isArray(s))
        if (s.type === "VARIABLE_ALIAS") {
          const n = await Ne(
            s,
            t,
            a
          );
          n && (r[i] = n);
        } else
          r[i] = await te(
            s,
            t,
            a
          );
      else Array.isArray(s) ? r[i] = await Promise.all(
        s.map(async (n) => (n == null ? void 0 : n.type) === "VARIABLE_ALIAS" ? await Ne(
          n,
          t,
          a
        ) || n : n && typeof n == "object" ? await te(
          n,
          t,
          a
        ) : n)
      ) : r[i] = s;
    }
  return r;
}
async function nt(e, t, a) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (r) => {
      if (!r || typeof r != "object") return r;
      const i = {};
      for (const s in r)
        Object.prototype.hasOwnProperty.call(r, s) && (s === "boundVariables" ? i[s] = await te(
          r[s],
          t,
          a
        ) : i[s] = r[s]);
      return i;
    })
  );
}
async function ot(e, t) {
  const a = {}, r = /* @__PURE__ */ new Set();
  if (e.type && (a.type = e.type, r.add("type")), e.id && (a.id = e.id, r.add("id")), e.name !== void 0 && e.name !== "" && (a.name = e.name, r.add("name")), e.x !== void 0 && e.x !== 0 && (a.x = e.x, r.add("x")), e.y !== void 0 && e.y !== 0 && (a.y = e.y, r.add("y")), e.width !== void 0 && (a.width = e.width, r.add("width")), e.height !== void 0 && (a.height = e.height, r.add("height")), e.visible !== void 0 && N(e.visible, k.visible) && (a.visible = e.visible, r.add("visible")), e.locked !== void 0 && N(e.locked, k.locked) && (a.locked = e.locked, r.add("locked")), e.opacity !== void 0 && N(e.opacity, k.opacity) && (a.opacity = e.opacity, r.add("opacity")), e.rotation !== void 0 && N(e.rotation, k.rotation) && (a.rotation = e.rotation, r.add("rotation")), e.blendMode !== void 0 && N(e.blendMode, k.blendMode) && (a.blendMode = e.blendMode, r.add("blendMode")), e.effects !== void 0 && N(e.effects, k.effects) && (a.effects = e.effects, r.add("effects")), e.fills !== void 0) {
    const i = await nt(
      e.fills,
      t.variableTable,
      t.collectionTable
    );
    N(i, k.fills) && (a.fills = i), r.add("fills");
  }
  if (e.strokes !== void 0 && N(e.strokes, k.strokes) && (a.strokes = e.strokes, r.add("strokes")), e.strokeWeight !== void 0 && N(e.strokeWeight, k.strokeWeight) && (a.strokeWeight = e.strokeWeight, r.add("strokeWeight")), e.strokeAlign !== void 0 && N(e.strokeAlign, k.strokeAlign) && (a.strokeAlign = e.strokeAlign, r.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const i = await te(
      e.boundVariables,
      t.variableTable,
      t.collectionTable
    );
    Object.keys(i).length > 0 && (a.boundVariables = i), r.add("boundVariables");
  }
  return a;
}
async function xe(e, t) {
  const a = {}, r = /* @__PURE__ */ new Set();
  return e.layoutMode !== void 0 && N(e.layoutMode, $.layoutMode) && (a.layoutMode = e.layoutMode, r.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && N(
    e.primaryAxisSizingMode,
    $.primaryAxisSizingMode
  ) && (a.primaryAxisSizingMode = e.primaryAxisSizingMode, r.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && N(
    e.counterAxisSizingMode,
    $.counterAxisSizingMode
  ) && (a.counterAxisSizingMode = e.counterAxisSizingMode, r.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && N(
    e.primaryAxisAlignItems,
    $.primaryAxisAlignItems
  ) && (a.primaryAxisAlignItems = e.primaryAxisAlignItems, r.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && N(
    e.counterAxisAlignItems,
    $.counterAxisAlignItems
  ) && (a.counterAxisAlignItems = e.counterAxisAlignItems, r.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && N(e.paddingLeft, $.paddingLeft) && (a.paddingLeft = e.paddingLeft, r.add("paddingLeft")), e.paddingRight !== void 0 && N(e.paddingRight, $.paddingRight) && (a.paddingRight = e.paddingRight, r.add("paddingRight")), e.paddingTop !== void 0 && N(e.paddingTop, $.paddingTop) && (a.paddingTop = e.paddingTop, r.add("paddingTop")), e.paddingBottom !== void 0 && N(e.paddingBottom, $.paddingBottom) && (a.paddingBottom = e.paddingBottom, r.add("paddingBottom")), e.itemSpacing !== void 0 && N(e.itemSpacing, $.itemSpacing) && (a.itemSpacing = e.itemSpacing, r.add("itemSpacing")), e.cornerRadius !== void 0 && N(e.cornerRadius, $.cornerRadius) && (a.cornerRadius = e.cornerRadius, r.add("cornerRadius")), e.clipsContent !== void 0 && N(e.clipsContent, $.clipsContent) && (a.clipsContent = e.clipsContent, r.add("clipsContent")), e.layoutWrap !== void 0 && N(e.layoutWrap, $.layoutWrap) && (a.layoutWrap = e.layoutWrap, r.add("layoutWrap")), e.layoutGrow !== void 0 && N(e.layoutGrow, $.layoutGrow) && (a.layoutGrow = e.layoutGrow, r.add("layoutGrow")), a;
}
async function st(e, t) {
  const a = {}, r = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (a.characters = e.characters, r.add("characters")), e.fontName !== void 0 && (a.fontName = e.fontName, r.add("fontName")), e.fontSize !== void 0 && (a.fontSize = e.fontSize, r.add("fontSize")), e.textAlignHorizontal !== void 0 && N(
    e.textAlignHorizontal,
    _.textAlignHorizontal
  ) && (a.textAlignHorizontal = e.textAlignHorizontal, r.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && N(
    e.textAlignVertical,
    _.textAlignVertical
  ) && (a.textAlignVertical = e.textAlignVertical, r.add("textAlignVertical")), e.letterSpacing !== void 0 && N(e.letterSpacing, _.letterSpacing) && (a.letterSpacing = e.letterSpacing, r.add("letterSpacing")), e.lineHeight !== void 0 && N(e.lineHeight, _.lineHeight) && (a.lineHeight = e.lineHeight, r.add("lineHeight")), e.textCase !== void 0 && N(e.textCase, _.textCase) && (a.textCase = e.textCase, r.add("textCase")), e.textDecoration !== void 0 && N(e.textDecoration, _.textDecoration) && (a.textDecoration = e.textDecoration, r.add("textDecoration")), e.textAutoResize !== void 0 && N(e.textAutoResize, _.textAutoResize) && (a.textAutoResize = e.textAutoResize, r.add("textAutoResize")), e.paragraphSpacing !== void 0 && N(
    e.paragraphSpacing,
    _.paragraphSpacing
  ) && (a.paragraphSpacing = e.paragraphSpacing, r.add("paragraphSpacing")), e.paragraphIndent !== void 0 && N(e.paragraphIndent, _.paragraphIndent) && (a.paragraphIndent = e.paragraphIndent, r.add("paragraphIndent")), e.listOptions !== void 0 && N(e.listOptions, _.listOptions) && (a.listOptions = e.listOptions, r.add("listOptions")), a;
}
async function ct(e, t) {
  const a = {}, r = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && N(e.fillGeometry, D.fillGeometry) && (a.fillGeometry = e.fillGeometry, r.add("fillGeometry")), e.strokeGeometry !== void 0 && N(e.strokeGeometry, D.strokeGeometry) && (a.strokeGeometry = e.strokeGeometry, r.add("strokeGeometry")), e.strokeCap !== void 0 && N(e.strokeCap, D.strokeCap) && (a.strokeCap = e.strokeCap, r.add("strokeCap")), e.strokeJoin !== void 0 && N(e.strokeJoin, D.strokeJoin) && (a.strokeJoin = e.strokeJoin, r.add("strokeJoin")), e.dashPattern !== void 0 && N(e.dashPattern, D.dashPattern) && (a.dashPattern = e.dashPattern, r.add("dashPattern")), a;
}
async function lt(e, t) {
  const a = {}, r = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && N(e.cornerRadius, Ee.cornerRadius) && (a.cornerRadius = e.cornerRadius, r.add("cornerRadius")), e.pointCount !== void 0 && (a.pointCount = e.pointCount, r.add("pointCount")), e.innerRadius !== void 0 && (a.innerRadius = e.innerRadius, r.add("innerRadius")), e.pointCount !== void 0 && (a.pointCount = e.pointCount, r.add("pointCount")), a;
}
const Q = /* @__PURE__ */ new Map();
let dt = 0;
function ut() {
  return `prompt_${Date.now()}_${++dt}`;
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
    var d;
    const a = typeof t == "number" ? { timeoutMs: t } : t, r = (d = a == null ? void 0 : a.timeoutMs) != null ? d : 3e5, i = a == null ? void 0 : a.okLabel, s = a == null ? void 0 : a.cancelLabel, n = ut();
    return new Promise((u, p) => {
      const o = r === -1 ? null : setTimeout(() => {
        Q.delete(n), p(new Error(`Plugin prompt timeout: ${e}`));
      }, r);
      Q.set(n, {
        resolve: u,
        reject: p,
        timeout: o
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: x(x({
          message: e,
          requestId: n
        }, i && { okLabel: i }), s && { cancelLabel: s })
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
    const { requestId: t, action: a } = e, r = Q.get(t);
    if (!r) {
      console.warn(
        `Received response for unknown prompt request: ${t}`
      );
      return;
    }
    r.timeout && clearTimeout(r.timeout), Q.delete(t), a === "ok" ? r.resolve() : r.reject(new Error("User cancelled"));
  }
}, gt = "RecursicaPublishedMetadata";
function fe(e) {
  let t = e, a = !1;
  try {
    if (a = t.parent !== null && t.parent !== void 0, !a)
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
function ft(e) {
  try {
    const t = e.getSharedPluginData(
      "recursica",
      gt
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
async function pt(e, t) {
  const a = {}, r = /* @__PURE__ */ new Set();
  if (a._isInstance = !0, r.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const i = await e.getMainComponentAsync();
    if (!i) {
      const w = e.name || "(unnamed)", S = e.id;
      if (t.detachedComponentsHandled.has(S))
        await c.log(
          `Treating detached instance "${w}" as internal instance (already prompted)`
        );
      else {
        await c.warning(
          `Found detached instance: "${w}" (main component is missing)`
        );
        const j = `Found detached instance "${w}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await q.prompt(j, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(S), await c.log(
            `Treating detached instance "${w}" as internal instance`
          );
        } catch (K) {
          if (K instanceof Error && K.message === "User cancelled") {
            const le = `Export cancelled: Detached instance "${w}" found. Please fix the instance before exporting.`;
            await c.error(le);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch (E) {
              console.warn("Could not scroll to instance:", E);
            }
            throw new Error(le);
          } else
            throw K;
        }
      }
      if (!fe(e).page) {
        const j = `Detached instance "${w}" is not on any page. Cannot export.`;
        throw await c.error(j), new Error(j);
      }
      let C, T;
      try {
        e.variantProperties && (C = e.variantProperties), e.componentProperties && (T = e.componentProperties);
      } catch (j) {
      }
      const F = x(x({
        instanceType: "internal",
        componentName: w,
        componentNodeId: e.id
      }, C && { variantProperties: C }), T && { componentProperties: T }), ce = t.instanceTable.addInstance(F);
      return a._instanceRef = ce, r.add("_instanceRef"), await c.log(
        `  Exported detached INSTANCE: "${w}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), a;
    }
    const s = e.name || "(unnamed)", n = i.name || "(unnamed)", d = i.remote === !0, p = fe(e).page, o = fe(i), g = o.page;
    let f;
    d ? f = "remote" : g && p && g.id === p.id ? f = "internal" : (g && p && (g.id, p.id), f = "normal");
    let l, y;
    try {
      e.variantProperties && (l = e.variantProperties), e.componentProperties && (y = e.componentProperties);
    } catch (w) {
    }
    let b, h;
    try {
      let w = i.parent;
      const S = [];
      let A = 0;
      const I = 20;
      for (; w && A < I; )
        try {
          const C = w.type, T = w.name;
          if (C === "COMPONENT_SET" && !h && (h = T), C === "PAGE")
            break;
          const F = T || "";
          S.unshift(F), w = w.parent, A++;
        } catch (C) {
          break;
        }
      b = S;
    } catch (w) {
    }
    const m = x(x(x(x({
      instanceType: f,
      componentName: n
    }, h && { componentSetName: h }), l && { variantProperties: l }), y && { componentProperties: y }), f === "normal" ? { path: b || [] } : b && b.length > 0 && {
      path: b
    });
    if (f === "internal")
      m.componentNodeId = i.id, await c.log(
        `  Found INSTANCE: "${s}" -> INTERNAL component "${n}" (ID: ${i.id.substring(0, 8)}...)`
      );
    else if (f === "normal") {
      if (g) {
        m.componentPageName = g.name;
        const S = ft(g);
        S != null && S.id && S.version !== void 0 && (m.componentGuid = S.id, m.componentVersion = S.version);
      } else {
        const S = i.id;
        if (o.reason === "detached") {
          const A = i.id;
          if (t.detachedComponentsHandled.has(A))
            await c.log(
              `Treating detached instance "${s}" -> component "${n}" as internal instance (already prompted)`
            );
          else {
            await c.warning(
              `Found detached instance: "${s}" -> component "${n}" (component is not on any page)`
            );
            try {
              await figma.viewport.scrollAndZoomIntoView([i]);
            } catch (C) {
              console.warn("Could not scroll to component:", C);
            }
            const I = `Found detached instance "${s}" attached to component "${n}". This should be fixed. Continue to publish?`;
            try {
              await q.prompt(I, {
                okLabel: "Ok",
                cancelLabel: "Cancel",
                timeoutMs: 3e5
                // 5 minutes
              }), t.detachedComponentsHandled.add(A), await c.log(
                `Treating detached instance "${s}" as internal instance`
              );
            } catch (C) {
              if (C instanceof Error && C.message === "User cancelled") {
                const T = `Export cancelled: Detached instance "${s}" found. The component "${n}" is not on any page. Please fix the instance before exporting.`;
                throw await c.error(T), new Error(T);
              } else
                throw C;
            }
          }
          m.instanceType = "internal", m.componentNodeId = i.id, delete m.path, await c.log(
            `  Exported detached INSTANCE: "${s}" -> component "${n}" as internal instance (ID: ${i.id.substring(0, 8)}...)`
          );
        } else {
          let A = "", I = "";
          switch (o.reason) {
            case "broken_chain":
              A = "The component's parent chain is broken and cannot be traversed to find the page", I = "Please ensure the component is properly nested within the document structure.";
              break;
            case "access_error":
              A = "Cannot access the component's parent chain (access error)", I = "The component may be in an invalid state. Please check the component structure.";
              break;
            default:
              A = "Cannot determine which page the component is on", I = "Please ensure the component is properly placed on a page.";
          }
          try {
            await figma.viewport.scrollAndZoomIntoView([i]);
          } catch (F) {
            console.warn("Could not scroll to component:", F);
          }
          const C = `Normal instance "${s}" -> component "${n}" (ID: ${S}) has no componentPage. ${A}. ${I} Component has been focused in the viewport.`;
          console.error("FATAL EXPORT ERROR:", C), await c.error(C);
          const T = new Error(C);
          throw console.error("Throwing error:", T), T;
        }
      }
      b === void 0 && console.warn(
        `Failed to build path for normal instance "${s}" -> component "${n}". Path is required for resolution.`
      );
      const w = b && b.length > 0 ? ` at path [${b.join(" → ")}]` : " at page root";
      await c.log(
        `  Found INSTANCE: "${s}" -> NORMAL component "${n}" (ID: ${i.id.substring(0, 8)}...)${w}`
      );
    } else if (f === "remote") {
      let w, S;
      try {
        if (typeof i.getPublishStatusAsync == "function")
          try {
            const A = await i.getPublishStatusAsync();
            A && typeof A == "object" && (A.libraryName && (w = A.libraryName), A.libraryKey && (S = A.libraryKey));
          } catch (A) {
          }
        try {
          const A = figma.teamLibrary;
          if (typeof (A == null ? void 0 : A.getAvailableLibraryComponentSetsAsync) == "function") {
            const I = await A.getAvailableLibraryComponentSetsAsync();
            if (I && Array.isArray(I)) {
              for (const C of I)
                if (C.key === i.key || C.name === i.name) {
                  C.libraryName && (w = C.libraryName), C.libraryKey && (S = C.libraryKey);
                  break;
                }
            }
          }
        } catch (A) {
        }
        try {
          m.structure = await se(
            i,
            /* @__PURE__ */ new WeakSet(),
            t
          );
        } catch (A) {
          console.warn(
            `Failed to extract structure for remote component "${n}":`,
            A
          );
        }
      } catch (A) {
        console.warn(
          `Error getting library info for remote component "${n}":`,
          A
        );
      }
      w && (m.remoteLibraryName = w), S && (m.remoteLibraryKey = S), await c.log(
        `  Found INSTANCE: "${s}" -> REMOTE component "${n}" (ID: ${i.id.substring(0, 8)}...)`
      );
    }
    const v = t.instanceTable.addInstance(m);
    a._instanceRef = v, r.add("_instanceRef");
  }
  return a;
}
class ne {
  constructor() {
    O(this, "instanceMap");
    // unique key -> index
    O(this, "instances");
    // index -> instance data
    O(this, "nextIndex");
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
    const r = this.nextIndex++;
    return this.instanceMap.set(a, r), this.instances[r] = t, r;
  }
  /**
   * Gets the index of an instance by its unique key
   * Returns -1 if not found
   */
  getInstanceIndex(t) {
    var r;
    const a = this.generateKey(t);
    return (r = this.instanceMap.get(a)) != null ? r : -1;
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
    const a = new ne(), r = Object.entries(t).sort(
      (i, s) => parseInt(i[0], 10) - parseInt(s[0], 10)
    );
    for (const [i, s] of r) {
      const n = parseInt(i, 10), d = a.generateKey(s);
      a.instanceMap.set(d, n), a.instances[n] = s, a.nextIndex = Math.max(a.nextIndex, n + 1);
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
const $e = {
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
function mt() {
  const e = {};
  for (const [t, a] of Object.entries($e))
    e[a] = t;
  return e;
}
function Se(e) {
  var t;
  return (t = $e[e]) != null ? t : e;
}
function yt(e) {
  var t;
  return typeof e == "number" ? (t = mt()[e]) != null ? t : e.toString() : e;
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
}, pe = {};
for (const [e, t] of Object.entries(ke))
  pe[t] = e;
class oe {
  constructor() {
    O(this, "shortToLong");
    O(this, "longToShort");
    this.shortToLong = x({}, pe), this.longToShort = x({}, ke);
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
      const a = {}, r = /* @__PURE__ */ new Set();
      for (const i of Object.keys(t))
        r.add(i);
      for (const [i, s] of Object.entries(t)) {
        const n = this.getShortName(i);
        if (n !== i && !r.has(n)) {
          let d = this.compressObject(s);
          n === "type" && typeof d == "string" && (d = Se(d)), a[n] = d;
        } else {
          let d = this.compressObject(s);
          i === "type" && typeof d == "string" && (d = Se(d)), a[i] = d;
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
      for (const [r, i] of Object.entries(t)) {
        const s = this.getLongName(r);
        let n = this.expandObject(i);
        (s === "type" || r === "type") && (typeof n == "number" || typeof n == "string") && (n = yt(n)), a[s] = n;
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
    const a = new oe();
    a.shortToLong = x(x({}, pe), t), a.longToShort = {};
    for (const [r, i] of Object.entries(
      a.shortToLong
    ))
      a.longToShort[i] = r;
    return a;
  }
}
function ht(e, t) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const a = {};
  e.metadata && (a.metadata = e.metadata);
  for (const [r, i] of Object.entries(e))
    r !== "metadata" && (a[r] = t.compressObject(i));
  return a;
}
function bt(e, t) {
  return t.expandObject(e);
}
function ae(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
function be(e) {
  let t = 1;
  return e.children && e.children.length > 0 && e.children.forEach((a) => {
    t += be(a);
  }), t;
}
async function se(e, t = /* @__PURE__ */ new WeakSet(), a = {}) {
  var g, f, l, y, b, h;
  if (!e || typeof e != "object")
    return e;
  const r = (g = a.maxNodes) != null ? g : 1e4, i = (f = a.nodeCount) != null ? f : 0;
  if (i >= r)
    return await c.warning(
      `Maximum node count (${r}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${r}) reached`,
      _nodeCount: i
    };
  const s = {
    visited: (l = a.visited) != null ? l : /* @__PURE__ */ new WeakSet(),
    depth: (y = a.depth) != null ? y : 0,
    maxDepth: (b = a.maxDepth) != null ? b : 100,
    nodeCount: i + 1,
    maxNodes: r,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: a.variableTable,
    collectionTable: a.collectionTable,
    instanceTable: a.instanceTable,
    detachedComponentsHandled: (h = a.detachedComponentsHandled) != null ? h : /* @__PURE__ */ new Set()
  };
  if (t.has(e))
    return "[Circular Reference]";
  t.add(e), s.visited = t;
  const n = {}, d = await ot(e, s);
  Object.assign(n, d);
  const u = e.type;
  if (u)
    switch (u) {
      case "FRAME":
      case "COMPONENT": {
        const m = await xe(e);
        Object.assign(n, m);
        break;
      }
      case "INSTANCE": {
        const m = await pt(
          e,
          s
        );
        Object.assign(n, m);
        const v = await xe(
          e
        );
        Object.assign(n, v);
        break;
      }
      case "TEXT": {
        const m = await st(e);
        Object.assign(n, m);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const m = await ct(e);
        Object.assign(n, m);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const m = await lt(e);
        Object.assign(n, m);
        break;
      }
      default:
        s.unhandledKeys.add("_unknownType");
        break;
    }
  const p = Object.getOwnPropertyNames(e), o = /* @__PURE__ */ new Set([
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
  (u === "FRAME" || u === "COMPONENT" || u === "INSTANCE") && (o.add("layoutMode"), o.add("primaryAxisSizingMode"), o.add("counterAxisSizingMode"), o.add("primaryAxisAlignItems"), o.add("counterAxisAlignItems"), o.add("paddingLeft"), o.add("paddingRight"), o.add("paddingTop"), o.add("paddingBottom"), o.add("itemSpacing"), o.add("cornerRadius"), o.add("clipsContent"), o.add("layoutWrap"), o.add("layoutGrow")), u === "TEXT" && (o.add("characters"), o.add("fontName"), o.add("fontSize"), o.add("textAlignHorizontal"), o.add("textAlignVertical"), o.add("letterSpacing"), o.add("lineHeight"), o.add("textCase"), o.add("textDecoration"), o.add("textAutoResize"), o.add("paragraphSpacing"), o.add("paragraphIndent"), o.add("listOptions")), (u === "VECTOR" || u === "LINE") && (o.add("fillGeometry"), o.add("strokeGeometry")), (u === "RECTANGLE" || u === "ELLIPSE" || u === "STAR" || u === "POLYGON") && (o.add("pointCount"), o.add("innerRadius"), o.add("arcData")), u === "INSTANCE" && (o.add("mainComponent"), o.add("componentProperties"));
  for (const m of p)
    typeof e[m] != "function" && (o.has(m) || s.unhandledKeys.add(m));
  if (s.unhandledKeys.size > 0 && (n._unhandledKeys = Array.from(s.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const m = s.maxDepth;
    if (s.depth >= m)
      n.children = {
        _truncated: !0,
        _reason: `Maximum depth (${m}) reached`,
        _count: e.children.length
      };
    else if (s.nodeCount >= r)
      n.children = {
        _truncated: !0,
        _reason: `Maximum node count (${r}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const v = L(x({}, s), {
        depth: s.depth + 1
      }), w = [];
      let S = !1;
      for (const A of e.children) {
        if (v.nodeCount >= r) {
          n.children = {
            _truncated: !0,
            _reason: `Maximum node count (${r}) reached during children processing`,
            _processed: w.length,
            _total: e.children.length,
            children: w
          }, S = !0;
          break;
        }
        const I = await se(A, t, v);
        w.push(I), v.nodeCount && (s.nodeCount = v.nodeCount);
      }
      S || (n.children = w);
    }
  }
  return n;
}
async function Oe(e, t = /* @__PURE__ */ new Set(), a = !1) {
  a || (await c.clear(), await c.log("=== Starting Page Export ==="));
  try {
    const r = e.pageIndex;
    if (r === void 0 || typeof r != "number")
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
    const i = figma.root.children;
    if (await c.log(`Loaded ${i.length} page(s)`), r < 0 || r >= i.length)
      return await c.error(
        `Invalid page index: ${r} (valid range: 0-${i.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const s = i[r], n = s.id;
    if (t.has(n))
      return await c.log(
        `Page "${s.name}" has already been processed, skipping...`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Page already processed",
        data: {}
      };
    t.add(n), await c.log(
      `Selected page: "${s.name}" (index: ${r})`
    ), await c.log(
      "Initializing variable, collection, and instance tables..."
    );
    const d = new ie(), u = new re(), p = new ne();
    await c.log("Fetching team library variable collections...");
    let o = [];
    try {
      if (o = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((P) => ({
        libraryName: P.libraryName,
        key: P.key,
        name: P.name
      })), await c.log(
        `Found ${o.length} library collection(s) in team library`
      ), o.length > 0)
        for (const P of o)
          await c.log(`  - ${P.name} (from ${P.libraryName})`);
    } catch (E) {
      await c.warning(
        `Could not get library variable collections: ${E instanceof Error ? E.message : String(E)}`
      );
    }
    await c.log("Extracting node data from page..."), await c.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await c.log(
      "Collections will be discovered as variables are processed:"
    );
    const g = await se(
      s,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: d,
        collectionTable: u,
        instanceTable: p
      }
    );
    await c.log("Node extraction finished");
    const f = be(g), l = d.getSize(), y = u.getSize(), b = p.getSize();
    if (await c.log("Extraction complete:"), await c.log(`  - Total nodes: ${f}`), await c.log(`  - Unique variables: ${l}`), await c.log(`  - Unique collections: ${y}`), await c.log(`  - Unique instances: ${b}`), y > 0) {
      await c.log("Collections found:");
      const E = u.getTable();
      for (const [P, R] of Object.values(E).entries()) {
        const M = R.collectionGuid ? ` (GUID: ${R.collectionGuid.substring(0, 8)}...)` : "";
        await c.log(
          `  ${P}: ${R.collectionName}${M} - ${R.modes.length} mode(s)`
        );
      }
    }
    await c.log("Checking for referenced component pages...");
    const h = [], m = p.getSerializedTable(), v = Object.values(m).filter(
      (E) => E.instanceType === "normal"
    );
    if (v.length > 0) {
      await c.log(
        `Found ${v.length} normal instance(s) to check`
      );
      const E = /* @__PURE__ */ new Map();
      for (const P of v)
        if (P.componentPageName) {
          const R = i.find((M) => M.name === P.componentPageName);
          if (R && !t.has(R.id))
            E.has(R.id) || E.set(R.id, R);
          else if (!R) {
            const M = `Normal instance references component "${P.componentName || "(unnamed)"}" on page "${P.componentPageName}", but that page was not found. Cannot export.`;
            throw await c.error(M), new Error(M);
          }
        } else {
          const R = `Normal instance references component "${P.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw await c.error(R), new Error(R);
        }
      await c.log(
        `Found ${E.size} unique referenced page(s)`
      );
      for (const [P, R] of E.entries()) {
        const M = R.name;
        if (t.has(P)) {
          await c.log(`Skipping "${M}" - already processed`);
          continue;
        }
        const we = R.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let Ae = !1;
        if (we)
          try {
            const G = JSON.parse(we);
            Ae = !!(G.id && G.version !== void 0);
          } catch (G) {
          }
        const Ge = `Do you want to also publish referenced component "${M}"?`;
        try {
          await q.prompt(Ge, {
            okLabel: "Yes",
            cancelLabel: "No",
            timeoutMs: 3e5
            // 5 minutes
          }), await c.log(`Exporting referenced page: "${M}"`);
          const G = i.findIndex(
            (de) => de.id === R.id
          );
          if (G === -1)
            throw await c.error(
              `Could not find page index for "${M}"`
            ), new Error(`Could not find page index for "${M}"`);
          const Y = await Oe(
            {
              pageIndex: G
            },
            t,
            // Pass the same set to track all processed pages
            !0
            // Mark as recursive call
          );
          if (Y.success && Y.data) {
            const de = Y.data;
            h.push(de), await c.log(
              `Successfully exported referenced page: "${M}"`
            );
          } else
            throw new Error(
              `Failed to export referenced page "${M}": ${Y.message}`
            );
        } catch (G) {
          if (G instanceof Error && G.message === "User cancelled")
            if (Ae)
              await c.log(
                `User declined to publish "${M}", but page has existing metadata. Continuing with existing metadata.`
              );
            else
              throw await c.error(
                `Export cancelled: Referenced page "${M}" has no metadata and user declined to publish it.`
              ), new Error(
                `Cannot continue export: Referenced component "${M}" has no metadata. Please publish it first or choose to publish it now.`
              );
          else
            throw G;
        }
      }
    }
    await c.log("Creating string table...");
    const w = new oe();
    await c.log("Getting page metadata...");
    const S = s.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let A = "", I = 0;
    if (S)
      try {
        const E = JSON.parse(S);
        A = E.id || "", I = E.version || 0;
      } catch (E) {
        await c.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!A) {
      await c.log("Generating new GUID for page..."), A = await he();
      const E = {
        _ver: 1,
        id: A,
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
    await c.log("Creating export data structure...");
    const C = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "2.7.0",
        // Updated version for string table compression
        figmaApiVersion: figma.apiVersion,
        guid: A,
        version: I,
        name: s.name,
        pluginVersion: "1.0.0"
      },
      stringTable: w.getSerializedTable(),
      collections: u.getSerializedTable(),
      variables: d.getSerializedTable(),
      instances: p.getSerializedTable(),
      libraries: o,
      // Libraries might not need compression, but could be added later
      pageData: g
    };
    await c.log("Compressing JSON data...");
    const T = ht(C, w);
    await c.log("Serializing to JSON...");
    const F = JSON.stringify(T, null, 2), ce = (F.length / 1024).toFixed(2), K = ae(s.name).trim().replace(/\s+/g, "_") + ".rec.json";
    return await c.log(`JSON serialization complete: ${ce} KB`), await c.log(`Export file: ${K}`), await c.log("=== Export Complete ==="), {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: K,
        jsonData: F,
        pageName: s.name,
        additionalPages: h
        // Populated with referenced component pages
      }
    };
  } catch (r) {
    const i = r instanceof Error ? r.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", r), console.error("Error message:", i), await c.error(`Export failed: ${i}`), r instanceof Error && r.stack && (console.error("Stack trace:", r.stack), await c.error(`Stack trace: ${r.stack}`));
    const s = {
      type: "exportPage",
      success: !1,
      error: !0,
      message: i,
      data: {}
    };
    return console.error("Returning error response:", s), s;
  }
}
async function J(e, t) {
  for (const a of t)
    e.modes.find((i) => i.name === a) || e.addMode(a);
}
const z = "recursica:collectionId";
async function ee(e) {
  if (e.remote === !0) {
    const a = Re[e.id];
    if (!a) {
      const i = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await c.error(i), new Error(i);
    }
    return a.guid;
  } else {
    const a = e.getSharedPluginData(
      "recursica",
      z
    );
    if (a && a.trim() !== "")
      return a;
    const r = await he();
    return e.setSharedPluginData("recursica", z, r), r;
  }
}
function wt(e, t) {
  const a = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(a))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function At(e) {
  let t;
  const a = e.collectionName.trim().toLowerCase(), r = ["token", "tokens", "theme", "themes"], i = e.isLocal;
  if (i === !1 || i === void 0 && r.includes(a))
    try {
      const d = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((u) => u.name.trim().toLowerCase() === a);
      if (d) {
        wt(e.collectionName, !1);
        const u = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          d.key
        );
        if (u.length > 0) {
          const p = await figma.variables.importVariableByKeyAsync(u[0].key), o = await figma.variables.getVariableCollectionByIdAsync(
            p.variableCollectionId
          );
          if (o) {
            if (t = o, e.collectionGuid) {
              const g = t.getSharedPluginData(
                "recursica",
                z
              );
              (!g || g.trim() === "") && t.setSharedPluginData(
                "recursica",
                z,
                e.collectionGuid
              );
            } else
              await ee(t);
            return await J(t, e.modes), { collection: t };
          }
        }
      }
    } catch (n) {
      if (i === !1)
        throw new Error(
          `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
        );
      console.log("Could not import external collection, trying local:", n);
    }
  if (i !== !1) {
    const n = await figma.variables.getLocalVariableCollectionsAsync();
    let d;
    if (e.collectionGuid && (d = n.find((u) => u.getSharedPluginData("recursica", z) === e.collectionGuid)), d || (d = n.find(
      (u) => u.name === e.collectionName
    )), d)
      if (t = d, e.collectionGuid) {
        const u = t.getSharedPluginData(
          "recursica",
          z
        );
        (!u || u.trim() === "") && t.setSharedPluginData(
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
    const n = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), d = e.collectionName.trim().toLowerCase(), u = n.find((f) => f.name.trim().toLowerCase() === d);
    if (!u)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const p = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      u.key
    );
    if (p.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const o = await figma.variables.importVariableByKeyAsync(
      p[0].key
    ), g = await figma.variables.getVariableCollectionByIdAsync(
      o.variableCollectionId
    );
    if (!g)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (t = g, e.collectionGuid) {
      const f = t.getSharedPluginData(
        "recursica",
        z
      );
      (!f || f.trim() === "") && t.setSharedPluginData(
        "recursica",
        z,
        e.collectionGuid
      );
    } else
      ee(t);
  }
  return await J(t, e.modes), { collection: t };
}
async function Le(e, t) {
  for (const a of e.variableIds)
    try {
      const r = await figma.variables.getVariableByIdAsync(a);
      if (r && r.name === t)
        return r;
    } catch (r) {
      continue;
    }
  return null;
}
async function vt(e, t, a, r, i) {
  for (const [s, n] of Object.entries(t)) {
    const d = r.modes.find((p) => p.name === s);
    if (!d) {
      console.warn(
        `Mode "${s}" not found in collection "${r.name}" for variable "${e.name}". Skipping.`
      );
      continue;
    }
    const u = d.modeId;
    try {
      if (n == null)
        continue;
      if (typeof n == "string" || typeof n == "number" || typeof n == "boolean") {
        e.setValueForMode(u, n);
        continue;
      }
      if (typeof n == "object" && n !== null && "_varRef" in n && typeof n._varRef == "number") {
        const p = n;
        let o = null;
        const g = a.getVariableByIndex(
          p._varRef
        );
        if (g) {
          let f = null;
          if (i && g._colRef !== void 0) {
            const l = i.getCollectionByIndex(
              g._colRef
            );
            l && (f = (await At(l)).collection);
          }
          f && (o = await Le(
            f,
            g.variableName
          ));
        }
        if (o) {
          const f = {
            type: "VARIABLE_ALIAS",
            id: o.id
          };
          e.setValueForMode(u, f);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${s}" in variable "${e.name}". Variable reference index: ${p._varRef}`
          );
      }
    } catch (p) {
      console.warn(
        `Error setting value for mode "${s}" in variable "${e.name}":`,
        p
      );
    }
  }
}
async function Ce(e, t, a, r) {
  const i = figma.variables.createVariable(
    e.variableName,
    t,
    e.variableType
  );
  return e.valuesByMode && await vt(
    i,
    e.valuesByMode,
    a,
    t,
    // Pass collection to look up modes by name
    r
  ), i;
}
async function _e(e, t, a, r) {
  if (!(!t || typeof t != "object"))
    try {
      const i = e[a];
      if (!i || !Array.isArray(i))
        return;
      const s = t[a];
      if (Array.isArray(s))
        for (let n = 0; n < s.length && n < i.length; n++) {
          const d = s[n];
          if (d && typeof d == "object") {
            i[n].boundVariables || (i[n].boundVariables = {});
            for (const [u, p] of Object.entries(
              d
            ))
              if (Te(p)) {
                const o = p._varRef;
                if (o !== void 0) {
                  const g = r.get(String(o));
                  g && (i[n].boundVariables[u] = {
                    type: "VARIABLE_ALIAS",
                    id: g.id
                  });
                }
              }
          }
        }
    } catch (i) {
      console.log(`Error restoring bound variables for ${a}:`, i);
    }
}
function Nt(e, t) {
  const a = Je(t);
  if (e.visible === void 0 && (e.visible = a.visible), e.locked === void 0 && (e.locked = a.locked), e.opacity === void 0 && (e.opacity = a.opacity), e.rotation === void 0 && (e.rotation = a.rotation), e.blendMode === void 0 && (e.blendMode = a.blendMode), t === "FRAME" || t === "COMPONENT" || t === "INSTANCE") {
    const r = $;
    e.layoutMode === void 0 && (e.layoutMode = r.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = r.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = r.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = r.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = r.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = r.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = r.paddingRight), e.paddingTop === void 0 && (e.paddingTop = r.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = r.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = r.itemSpacing);
  }
  if (t === "TEXT") {
    const r = _;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = r.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = r.textAlignVertical), e.textCase === void 0 && (e.textCase = r.textCase), e.textDecoration === void 0 && (e.textDecoration = r.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = r.textAutoResize);
  }
}
async function W(e, t, a = null, r = null, i = null, s = null, n = null, d = !1, u = null) {
  var p;
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
        if (d)
          o = figma.createFrame(), e.name && (o.name = e.name);
        else if (e._instanceRef !== void 0 && i && n)
          try {
            const g = i.getInstanceByIndex(
              e._instanceRef
            );
            if (g && g.instanceType === "internal")
              if (g.componentNodeId) {
                const f = n.get(
                  g.componentNodeId
                );
                if (f && f.type === "COMPONENT") {
                  if (o = f.createInstance(), await c.log(
                    `✓ Created internal instance "${e.name}" from component "${g.componentName}"`
                  ), g.variantProperties && Object.keys(g.variantProperties).length > 0)
                    try {
                      o.setProperties(g.variantProperties);
                    } catch (l) {
                      await c.warning(
                        `Error setting variant properties for instance "${e.name}": ${l}`
                      );
                    }
                  if (g.componentProperties && Object.keys(g.componentProperties).length > 0)
                    try {
                      for (const [l, y] of Object.entries(
                        g.componentProperties
                      ))
                        try {
                          o.setProperties({ [l]: y });
                        } catch (b) {
                          await c.warning(
                            `Error setting component property "${l}" for instance "${e.name}": ${b}`
                          );
                        }
                    } catch (l) {
                      await c.warning(
                        `Error setting component properties for instance "${e.name}": ${l}`
                      );
                    }
                } else
                  await c.warning(
                    `Component not found for internal instance "${e.name}" (ID: ${g.componentNodeId.substring(0, 8)}...), creating frame fallback`
                  ), o = figma.createFrame();
              } else
                await c.warning(
                  `Internal instance "${e.name}" missing componentNodeId, creating frame fallback`
                ), o = figma.createFrame();
            else if (g && g.instanceType === "remote")
              if (u) {
                const f = u.get(
                  e._instanceRef
                );
                if (f) {
                  if (o = f.createInstance(), await c.log(
                    `✓ Created remote instance "${e.name}" from component "${g.componentName}" on REMOTES page`
                  ), g.variantProperties && Object.keys(g.variantProperties).length > 0)
                    try {
                      o.setProperties(g.variantProperties);
                    } catch (l) {
                      await c.warning(
                        `Error setting variant properties for remote instance "${e.name}": ${l}`
                      );
                    }
                  if (g.componentProperties && Object.keys(g.componentProperties).length > 0)
                    try {
                      for (const [l, y] of Object.entries(
                        g.componentProperties
                      ))
                        try {
                          o.setProperties({ [l]: y });
                        } catch (b) {
                          await c.warning(
                            `Error setting component property "${l}" for remote instance "${e.name}": ${b}`
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
                  ), o = figma.createFrame();
              } else
                await c.warning(
                  `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap), creating frame fallback`
                ), o = figma.createFrame();
            else
              await c.log(
                `Instance "${e.name}" is not internal (type: ${(g == null ? void 0 : g.instanceType) || "unknown"}), creating frame fallback`
              ), o = figma.createFrame();
          } catch (g) {
            await c.warning(
              `Error resolving instance "${e.name}": ${g}, creating frame fallback`
            ), o = figma.createFrame();
          }
        else
          await c.log(
            `Instance "${e.name}" missing _instanceRef or instance table, creating frame fallback`
          ), o = figma.createFrame();
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
    if (e.id && n && n.set(e.id, o), Nt(o, e.type || "FRAME"), e.name !== void 0 && (o.name = e.name || "Unnamed Node"), e.x !== void 0 && (o.x = e.x), e.y !== void 0 && (o.y = e.y), e.width !== void 0 && e.height !== void 0 && o.resize(e.width, e.height), e.visible !== void 0 && (o.visible = e.visible), e.locked !== void 0 && (o.locked = e.locked), e.opacity !== void 0 && (o.opacity = e.opacity), e.rotation !== void 0 && (o.rotation = e.rotation), e.blendMode !== void 0 && (o.blendMode = e.blendMode), e.type !== "INSTANCE" && e.fills !== void 0)
      try {
        let g = e.fills;
        Array.isArray(g) && (g = g.map((f) => {
          if (f && typeof f == "object") {
            const l = x({}, f);
            return delete l.boundVariables, l;
          }
          return f;
        })), o.fills = g, (p = e.boundVariables) != null && p.fills && s && await _e(
          o,
          e.boundVariables,
          "fills",
          s
        );
      } catch (g) {
        console.log("Error setting fills:", g);
      }
    if (e.strokes !== void 0 && e.strokes.length > 0)
      try {
        o.strokes = e.strokes;
      } catch (g) {
        console.log("Error setting strokes:", g);
      }
    if (e.strokeWeight !== void 0 && (o.strokeWeight = e.strokeWeight), e.strokeAlign !== void 0 && (o.strokeAlign = e.strokeAlign), e.cornerRadius !== void 0 && (o.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (o.effects = e.effects), (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && (e.layoutMode !== void 0 && (o.layoutMode = e.layoutMode), e.primaryAxisSizingMode !== void 0 && (o.primaryAxisSizingMode = e.primaryAxisSizingMode), e.counterAxisSizingMode !== void 0 && (o.counterAxisSizingMode = e.counterAxisSizingMode), e.primaryAxisAlignItems !== void 0 && (o.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (o.counterAxisAlignItems = e.counterAxisAlignItems), e.paddingLeft !== void 0 && (o.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (o.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (o.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (o.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (o.itemSpacing = e.itemSpacing)), (e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (o.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (o.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (o.dashPattern = e.dashPattern)), e.type === "TEXT" && e.characters !== void 0)
      try {
        if (e.fontName)
          try {
            await figma.loadFontAsync(e.fontName), o.fontName = e.fontName;
          } catch (g) {
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
      } catch (g) {
        console.log("Error setting text properties: " + g);
        try {
          o.characters = e.characters;
        } catch (f) {
          console.log("Could not set text characters: " + f);
        }
      }
    if (e.boundVariables) {
      for (const [g, f] of Object.entries(
        e.boundVariables
      ))
        if (g !== "fills" && Te(f) && a && s) {
          const l = f._varRef;
          if (l !== void 0) {
            const y = s.get(String(l));
            if (y) {
              const b = {
                type: "VARIABLE_ALIAS",
                id: y.id
              };
              o.boundVariables || (o.boundVariables = {}), o.boundVariables[g] || (o.boundVariables[g] = b);
            }
          }
        }
    }
    if (e.children && Array.isArray(e.children))
      for (const g of e.children) {
        if (g._truncated) {
          console.log(
            `Skipping truncated children: ${g._reason || "Unknown"}`
          );
          continue;
        }
        const f = await W(
          g,
          o,
          a,
          r,
          i,
          s,
          n,
          d,
          // Pass the flag down to children
          u
          // Pass the remote component map down to children
        );
        f && o.appendChild(f);
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
  let r = 1, i = `${e}_${r}`;
  for (; a.has(i); )
    r++, i = `${e}_${r}`;
  return i;
}
async function xt(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), a = new Set(t.map((s) => s.name));
  if (!a.has(e))
    return e;
  let r = 1, i = `${e}_${r}`;
  for (; a.has(i); )
    r++, i = `${e}_${r}`;
  return i;
}
async function St(e, t) {
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
  let r = 1, i = `${t}_${r}`;
  for (; a.has(i); )
    r++, i = `${t}_${r}`;
  return i;
}
function Ct(e, t) {
  const a = e.resolvedType.toUpperCase(), r = t.toUpperCase();
  return a === r;
}
async function It(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), a = B(e.collectionName);
  if (U(e.collectionName)) {
    for (const r of t)
      if (B(r.name) === a)
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
        z
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
function Et(e) {
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
function Tt(e) {
  if (!e.stringTable)
    return {
      success: !1,
      error: "Invalid JSON format. String table is required."
    };
  let t;
  try {
    t = oe.fromTable(e.stringTable);
  } catch (r) {
    return {
      success: !1,
      error: `Failed to load string table: ${r instanceof Error ? r.message : "Unknown error"}`
    };
  }
  const a = bt(e, t);
  return {
    success: !0,
    stringTable: t,
    expandedJsonData: a
  };
}
function Rt(e) {
  if (!e.collections)
    return {
      success: !1,
      error: "No collections table found in JSON"
    };
  try {
    return {
      success: !0,
      collectionTable: re.fromTable(
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
async function Mt(e) {
  const t = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = e.getTable();
  for (const [s, n] of Object.entries(i)) {
    if (n.isLocal === !1) {
      await c.log(
        `Skipping remote collection: "${n.collectionName}" (index ${s})`
      );
      continue;
    }
    const d = await It(n);
    d.matchType === "recognized" ? (await c.log(
      `✓ Recognized collection by GUID: "${n.collectionName}" (index ${s})`
    ), t.set(s, d.collection)) : d.matchType === "potential" ? (await c.log(
      `? Potential match by name: "${n.collectionName}" (index ${s})`
    ), a.set(s, {
      entry: n,
      collection: d.collection
    })) : (await c.log(
      `✗ No match found for collection: "${n.collectionName}" (index ${s}) - will create new`
    ), r.set(s, n));
  }
  return await c.log(
    `Collection matching complete: ${t.size} recognized, ${a.size} potential matches, ${r.size} to create`
  ), {
    recognizedCollections: t,
    potentialMatches: a,
    collectionsToCreate: r
  };
}
async function Pt(e, t, a) {
  if (e.size !== 0) {
    await c.log(
      `Prompting user for ${e.size} potential match(es)...`
    );
    for (const [r, { entry: i, collection: s }] of e.entries())
      try {
        const n = U(i.collectionName) ? B(i.collectionName) : s.name, d = `Found existing "${n}" variable collection. Should I use it?`;
        await c.log(
          `Prompting user about potential match: "${n}"`
        ), await q.prompt(d, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await c.log(
          `✓ User confirmed: Using existing collection "${n}" (index ${r})`
        ), t.set(r, s), await J(s, i.modes), await c.log(
          `  ✓ Ensured modes for collection "${n}" (${i.modes.length} mode(s))`
        );
      } catch (n) {
        await c.log(
          `✗ User rejected: Will create new collection for "${i.collectionName}" (index ${r})`
        ), a.set(r, i);
      }
  }
}
async function $t(e, t, a) {
  if (e.size === 0)
    return;
  await c.log("Ensuring modes exist for recognized collections...");
  const r = t.getTable();
  for (const [i, s] of e.entries()) {
    const n = r[i];
    n && (a.has(i) || (await J(s, n.modes), await c.log(
      `  ✓ Ensured modes for collection "${s.name}" (${n.modes.length} mode(s))`
    )));
  }
}
async function kt(e, t, a) {
  if (e.size !== 0) {
    await c.log(
      `Creating ${e.size} new collection(s)...`
    );
    for (const [r, i] of e.entries()) {
      const s = B(i.collectionName), n = await xt(s);
      n !== s ? await c.log(
        `Creating collection: "${n}" (normalized: "${s}" - name conflict resolved)`
      ) : await c.log(`Creating collection: "${n}"`);
      const d = figma.variables.createVariableCollection(n);
      a.push(d);
      let u;
      if (U(i.collectionName)) {
        const p = ye(i.collectionName);
        p && (u = p);
      } else i.collectionGuid && (u = i.collectionGuid);
      u && (d.setSharedPluginData(
        "recursica",
        z,
        u
      ), await c.log(
        `  Stored GUID: ${u.substring(0, 8)}...`
      )), await J(d, i.modes), await c.log(
        `  ✓ Created collection "${n}" with ${i.modes.length} mode(s)`
      ), t.set(r, d);
    }
    await c.log("Collection creation complete");
  }
}
function Ot(e) {
  if (!e.variables)
    return {
      success: !1,
      error: "No variables table found in JSON"
    };
  try {
    return {
      success: !0,
      variableTable: ie.fromTable(e.variables)
    };
  } catch (t) {
    return {
      success: !1,
      error: `Failed to load variables table: ${t instanceof Error ? t.message : "Unknown error"}`
    };
  }
}
async function Lt(e, t, a, r) {
  const i = /* @__PURE__ */ new Map(), s = [], n = new Set(
    r.map((p) => p.id)
  );
  await c.log("Matching and creating variables in collections...");
  const d = e.getTable(), u = /* @__PURE__ */ new Map();
  for (const [p, o] of Object.entries(d)) {
    if (o._colRef === void 0)
      continue;
    const g = a.get(String(o._colRef));
    if (!g)
      continue;
    u.has(g.id) || u.set(g.id, {
      collectionName: g.name,
      existing: 0,
      created: 0
    });
    const f = u.get(g.id), l = n.has(
      g.id
    );
    let y;
    typeof o.variableType == "number" ? y = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[o.variableType] || String(o.variableType) : y = o.variableType;
    const b = await Le(
      g,
      o.variableName
    );
    if (b)
      if (Ct(b, y))
        i.set(p, b), f.existing++;
      else {
        await c.warning(
          `Type mismatch for variable "${o.variableName}" in collection "${g.name}": expected ${y}, found ${b.resolvedType}. Creating new variable with incremented name.`
        );
        const h = await St(
          g,
          o.variableName
        ), m = await Ce(
          L(x({}, o), {
            variableName: h,
            variableType: y
          }),
          g,
          e,
          t
        );
        l || s.push(m), i.set(p, m), f.created++;
      }
    else {
      const h = await Ce(
        L(x({}, o), {
          variableType: y
        }),
        g,
        e,
        t
      );
      l || s.push(h), i.set(p, h), f.created++;
    }
  }
  await c.log("Variable processing complete:");
  for (const p of u.values())
    await c.log(
      `  "${p.collectionName}": ${p.existing} existing, ${p.created} created`
    );
  return {
    recognizedVariables: i,
    newlyCreatedVariables: s
  };
}
function _t(e) {
  if (!e.instances)
    return null;
  try {
    return ne.fromTable(e.instances);
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
  let r = 1, i = `${t}_${r}`;
  for (; a.has(i); )
    r++, i = `${t}_${r}`;
  return i;
}
async function Vt(e, t, a, r) {
  var g;
  const i = e.getSerializedTable(), s = Object.values(i).filter(
    (f) => f.instanceType === "remote"
  ), n = /* @__PURE__ */ new Map();
  if (s.length === 0)
    return await c.log("No remote instances found"), n;
  await c.log(
    `Processing ${s.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  let u = figma.root.children.find((f) => f.name === "REMOTES");
  if (u ? await c.log("Found existing REMOTES page") : (u = figma.createPage(), u.name = "REMOTES", await c.log("Created REMOTES page")), !u.children.some(
    (f) => f.type === "FRAME" && f.name === "Title"
  )) {
    const f = { family: "Inter", style: "Bold" }, l = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(f), await figma.loadFontAsync(l);
    const y = figma.createFrame();
    y.name = "Title", y.layoutMode = "VERTICAL", y.paddingTop = 20, y.paddingBottom = 20, y.paddingLeft = 20, y.paddingRight = 20, y.fills = [];
    const b = figma.createText();
    b.fontName = f, b.characters = "REMOTE INSTANCES", b.fontSize = 24, b.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], y.appendChild(b);
    const h = figma.createText();
    h.fontName = l, h.characters = "These are remotely connected component instances found in our different component pages.", h.fontSize = 14, h.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], y.appendChild(h), u.appendChild(y), await c.log("Created title and description on REMOTES page");
  }
  const o = /* @__PURE__ */ new Map();
  for (const [f, l] of Object.entries(i)) {
    if (l.instanceType !== "remote")
      continue;
    const y = parseInt(f, 10);
    if (await c.log(
      `Processing remote instance ${y}: "${l.componentName}"`
    ), !l.structure) {
      await c.warning(
        `Remote instance "${l.componentName}" missing structure data, skipping`
      );
      continue;
    }
    await c.log(
      `  Structure type: ${l.structure.type || "unknown"}, has children: ${l.structure.children ? l.structure.children.length : 0}`
    );
    let b = l.componentName;
    if (l.path && l.path.length > 0) {
      const m = l.path.filter((v) => v !== "").join(" / ");
      m && (b = `${m} / ${l.componentName}`);
    }
    const h = await zt(
      u,
      b
    );
    h !== b && await c.log(
      `Component name conflict: "${b}" -> "${h}"`
    );
    try {
      if (l.structure.type !== "COMPONENT") {
        await c.warning(
          `Remote instance "${l.componentName}" structure is not a COMPONENT (type: ${l.structure.type}), creating frame fallback`
        );
        const v = figma.createFrame();
        v.name = h;
        const w = await W(
          l.structure,
          v,
          t,
          a,
          null,
          r,
          o,
          !0
          // isRemoteStructure: true
        );
        w ? (v.appendChild(w), u.appendChild(v), await c.log(
          `✓ Created remote instance frame fallback: "${h}"`
        )) : v.remove();
        continue;
      }
      const m = figma.createComponent();
      m.name = h, u.appendChild(m), await c.log(
        `  Created component node: "${h}"`
      );
      try {
        if (l.structure.name !== void 0 && (m.name = l.structure.name), l.structure.width !== void 0 && l.structure.height !== void 0 && m.resize(l.structure.width, l.structure.height), l.structure.x !== void 0 && (m.x = l.structure.x), l.structure.y !== void 0 && (m.y = l.structure.y), l.structure.visible !== void 0 && (m.visible = l.structure.visible), l.structure.opacity !== void 0 && (m.opacity = l.structure.opacity), l.structure.rotation !== void 0 && (m.rotation = l.structure.rotation), l.structure.blendMode !== void 0 && (m.blendMode = l.structure.blendMode), l.structure.fills !== void 0)
          try {
            let v = l.structure.fills;
            Array.isArray(v) && (v = v.map((w) => {
              if (w && typeof w == "object") {
                const S = x({}, w);
                return delete S.boundVariables, S;
              }
              return w;
            })), m.fills = v, (g = l.structure.boundVariables) != null && g.fills && r && await _e(
              m,
              l.structure.boundVariables,
              "fills",
              r
            );
          } catch (v) {
            await c.warning(
              `Error setting fills for remote component "${l.componentName}": ${v}`
            );
          }
        if (l.structure.strokes !== void 0)
          try {
            m.strokes = l.structure.strokes;
          } catch (v) {
            await c.warning(
              `Error setting strokes for remote component "${l.componentName}": ${v}`
            );
          }
        if (l.structure.layoutMode !== void 0 && (m.layoutMode = l.structure.layoutMode), l.structure.primaryAxisSizingMode !== void 0 && (m.primaryAxisSizingMode = l.structure.primaryAxisSizingMode), l.structure.counterAxisSizingMode !== void 0 && (m.counterAxisSizingMode = l.structure.counterAxisSizingMode), l.structure.paddingLeft !== void 0 && (m.paddingLeft = l.structure.paddingLeft), l.structure.paddingRight !== void 0 && (m.paddingRight = l.structure.paddingRight), l.structure.paddingTop !== void 0 && (m.paddingTop = l.structure.paddingTop), l.structure.paddingBottom !== void 0 && (m.paddingBottom = l.structure.paddingBottom), l.structure.itemSpacing !== void 0 && (m.itemSpacing = l.structure.itemSpacing), l.structure.cornerRadius !== void 0 && (m.cornerRadius = l.structure.cornerRadius), l.structure.children && Array.isArray(l.structure.children)) {
          await c.log(
            `  Recreating ${l.structure.children.length} child(ren) for component "${l.componentName}"`
          );
          for (const v of l.structure.children) {
            if (v._truncated) {
              await c.log(
                `  Skipping truncated child: ${v._reason || "Unknown"}`
              );
              continue;
            }
            const w = await W(
              v,
              m,
              t,
              a,
              null,
              r,
              o,
              !0
              // isRemoteStructure: true
            );
            w && m.appendChild(w);
          }
        }
        n.set(y, m), await c.log(
          `✓ Created remote component: "${h}" (index ${y})`
        );
      } catch (v) {
        await c.warning(
          `Error populating remote component "${l.componentName}": ${v instanceof Error ? v.message : "Unknown error"}`
        ), m.remove();
      }
    } catch (m) {
      await c.warning(
        `Error recreating remote instance "${l.componentName}": ${m instanceof Error ? m.message : "Unknown error"}`
      );
    }
  }
  return await c.log(
    `Remote instance processing complete: ${n.size} component(s) created`
  ), n;
}
async function Gt(e, t, a, r, i, s, n = null) {
  await c.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const d = figma.root.children, u = "RecursicaPublishedMetadata";
  let p = null;
  for (const h of d) {
    const m = h.getPluginData(u);
    if (m)
      try {
        if (JSON.parse(m).id === e.guid) {
          p = h;
          break;
        }
      } catch (v) {
        continue;
      }
  }
  p && await c.log(
    `Found existing page with same GUID: "${p.name}". Will create new page to avoid overwriting.`
  );
  const o = d.find((h) => h.name === e.name);
  o && await c.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let g;
  if (p || o) {
    const h = `__${e.name}`;
    g = await Ie(h), await c.log(
      `Creating scratch page: "${g}" (will be renamed to "${e.name}" on success)`
    );
  } else
    g = e.name, await c.log(`Creating page: "${g}"`);
  const f = figma.createPage();
  if (f.name = g, await figma.setCurrentPageAsync(f), await c.log(`Switched to page: "${g}"`), !t.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await c.log("Recreating page structure...");
  const l = t.pageData, y = /* @__PURE__ */ new Map();
  if (l.children && Array.isArray(l.children))
    for (const h of l.children) {
      const m = await W(
        h,
        f,
        a,
        r,
        i,
        s,
        y,
        !1,
        // isRemoteStructure: false - we're creating the main page
        n
        // Pass the remote component map
      );
      m && f.appendChild(m);
    }
  await c.log("Page structure recreated successfully");
  const b = {
    _ver: 1,
    id: e.guid,
    name: e.name,
    version: e.version || 0,
    publishDate: (/* @__PURE__ */ new Date()).toISOString(),
    history: {}
  };
  if (f.setPluginData(u, JSON.stringify(b)), await c.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), g.startsWith("__")) {
    const h = await Ie(e.name);
    f.name = h, await c.log(`Renamed page from "${g}" to "${h}"`);
  }
  return {
    success: !0,
    page: f
  };
}
async function Ft(e) {
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
    const r = Et(a);
    if (!r.success)
      return await c.error(r.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: r.error,
        data: {}
      };
    const i = r.metadata;
    await c.log(
      `Metadata validated: guid=${i.guid}, name=${i.name}`
    ), await c.log("Loading string table...");
    const s = Tt(a);
    if (!s.success)
      return await c.error(s.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: s.error,
        data: {}
      };
    await c.log("String table loaded successfully"), await c.log("Expanding JSON data...");
    const n = s.expandedJsonData;
    await c.log("JSON expanded successfully"), await c.log("Loading collections table...");
    const d = Rt(n);
    if (!d.success)
      return d.error === "No collections table found in JSON" ? (await c.log(d.error), await c.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: i.name }
      }) : (await c.error(d.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: d.error,
        data: {}
      });
    const u = d.collectionTable;
    await c.log(
      `Loaded collections table with ${u.getSize()} collection(s)`
    ), await c.log(
      "Matching collections with existing local collections..."
    );
    const { recognizedCollections: p, potentialMatches: o, collectionsToCreate: g } = await Mt(u);
    await Pt(
      o,
      p,
      g
    ), await $t(
      p,
      u,
      o
    ), await kt(
      g,
      p,
      t
    ), await c.log("Loading variables table...");
    const f = Ot(n);
    if (!f.success)
      return f.error === "No variables table found in JSON" ? (await c.log(f.error), await c.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no variables to process)",
        data: { pageName: i.name }
      }) : (await c.error(f.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: f.error,
        data: {}
      });
    const l = f.variableTable;
    await c.log(
      `Loaded variables table with ${l.getSize()} variable(s)`
    );
    const { recognizedVariables: y, newlyCreatedVariables: b } = await Lt(
      l,
      u,
      p,
      t
    );
    await c.log("Loading instance table...");
    const h = _t(n);
    if (h) {
      const A = h.getSerializedTable(), I = Object.values(A).filter(
        (T) => T.instanceType === "internal"
      ), C = Object.values(A).filter(
        (T) => T.instanceType === "remote"
      );
      await c.log(
        `Loaded instance table with ${h.getSize()} instance(s) (${I.length} internal, ${C.length} remote)`
      );
    } else
      await c.log("No instance table found in JSON");
    let m = null;
    h && (m = await Vt(
      h,
      l,
      u,
      y
    ));
    const v = await Gt(
      i,
      n,
      l,
      u,
      h,
      y,
      m
    );
    if (!v.success)
      return await c.error(v.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: v.error,
        data: {}
      };
    const w = v.page, S = y.size + b.length;
    return await c.log("=== Import Complete ==="), await c.log(
      `Successfully processed ${p.size} collection(s), ${S} variable(s), and created page "${w.name}"`
    ), {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: {
        pageName: w.name,
        createdEntities: {
          pageIds: [w.id],
          collectionIds: t.map((A) => A.id),
          variableIds: b.map((A) => A.id)
        }
      }
    };
  } catch (a) {
    const r = a instanceof Error ? a.message : "Unknown error occurred";
    return await c.error(`Import failed: ${r}`), a instanceof Error && a.stack && await c.error(`Stack trace: ${a.stack}`), console.error("Error importing page:", a), {
      type: "importPage",
      success: !1,
      error: !0,
      message: r,
      data: {}
    };
  }
}
async function Bt(e) {
  await c.log("=== Cleaning up created entities ===");
  try {
    const { pageIds: t, collectionIds: a, variableIds: r } = e;
    let i = 0;
    for (const d of r)
      try {
        const u = figma.variables.getVariableById(d);
        if (u) {
          const p = u.variableCollectionId;
          a.includes(p) || (u.remove(), i++);
        }
      } catch (u) {
        await c.warning(
          `Could not delete variable ${d.substring(0, 8)}...: ${u}`
        );
      }
    let s = 0;
    for (const d of a)
      try {
        const u = figma.variables.getVariableCollectionById(d);
        u && (u.remove(), s++);
      } catch (u) {
        await c.warning(
          `Could not delete collection ${d.substring(0, 8)}...: ${u}`
        );
      }
    await figma.loadAllPagesAsync();
    let n = 0;
    for (const d of t)
      try {
        const u = figma.getNodeById(d);
        u && u.type === "PAGE" && (u.remove(), n++);
      } catch (u) {
        await c.warning(
          `Could not delete page ${d.substring(0, 8)}...: ${u}`
        );
      }
    return await c.log(
      `Cleanup complete: Deleted ${n} page(s), ${s} collection(s), ${i} variable(s)`
    ), {
      type: "cleanupCreatedEntities",
      success: !0,
      error: !1,
      message: "Cleanup completed successfully",
      data: {
        deletedPages: n,
        deletedCollections: s,
        deletedVariables: i
      }
    };
  } catch (t) {
    const a = t instanceof Error ? t.message : "Unknown error occurred";
    return await c.error(`Cleanup failed: ${a}`), {
      type: "cleanupCreatedEntities",
      success: !1,
      error: !0,
      message: a,
      data: {}
    };
  }
}
async function Ut(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children;
    console.log("Found " + t.length + " pages in the document");
    const a = 11, r = t[a];
    if (!r)
      return {
        type: "quickCopy",
        success: !1,
        error: !0,
        message: "No page found at index 11",
        data: {}
      };
    const i = await se(
      r,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + r.name + " (index: " + a + ")"
    );
    const s = JSON.stringify(i, null, 2), n = JSON.parse(s), d = "Copy - " + n.name, u = figma.createPage();
    if (u.name = d, figma.root.appendChild(u), n.children && n.children.length > 0) {
      let g = function(l) {
        l.forEach((y) => {
          const b = (y.x || 0) + (y.width || 0);
          b > f && (f = b), y.children && y.children.length > 0 && g(y.children);
        });
      };
      console.log(
        "Recreating " + n.children.length + " top-level children..."
      );
      let f = 0;
      g(n.children), console.log("Original content rightmost edge: " + f);
      for (const l of n.children)
        await W(l, u, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const p = be(n);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: n.name,
        newPageName: d,
        totalNodes: p
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
async function Kt(e) {
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
async function Dt(e) {
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
async function Ht(e) {
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
function me(e, t = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: t
  };
}
function ze(e, t, a = {}) {
  const r = t instanceof Error ? t.message : t;
  return {
    type: e,
    success: !1,
    error: !0,
    message: r,
    data: a
  };
}
const Ve = "RecursicaPublishedMetadata";
async function qt(e) {
  try {
    const t = figma.currentPage;
    await figma.loadAllPagesAsync();
    const r = figma.root.children.findIndex(
      (d) => d.id === t.id
    ), i = t.getPluginData(Ve);
    if (!i) {
      const p = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: ae(t.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: r
      };
      return me("getComponentMetadata", p);
    }
    const n = {
      componentMetadata: JSON.parse(i),
      currentPageIndex: r
    };
    return me("getComponentMetadata", n);
  } catch (t) {
    return console.error("Error getting component metadata:", t), ze(
      "getComponentMetadata",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function Jt(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children, a = [];
    for (const i of t) {
      if (i.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${i.name} (type: ${i.type})`
        );
        continue;
      }
      const s = i, n = s.getPluginData(Ve);
      if (n)
        try {
          const d = JSON.parse(n);
          a.push(d);
        } catch (d) {
          console.warn(
            `Failed to parse metadata for page "${s.name}":`,
            d
          );
          const p = {
            _ver: 1,
            id: "",
            name: ae(s.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          a.push(p);
        }
      else {
        const u = {
          _ver: 1,
          id: "",
          name: ae(s.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        a.push(u);
      }
    }
    return me("getAllComponents", {
      components: a
    });
  } catch (t) {
    return console.error("Error getting all components:", t), ze(
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
const Yt = {
  getCurrentUser: De,
  loadPages: He,
  exportPage: Oe,
  importPage: Ft,
  cleanupCreatedEntities: Bt,
  quickCopy: Ut,
  storeAuthData: jt,
  loadAuthData: Kt,
  clearAuthData: Dt,
  storeSelectedRepo: Ht,
  getComponentMetadata: qt,
  getAllComponents: Jt,
  pluginPromptResponse: Wt
}, Xt = Yt;
figma.showUI(__html__, {
  width: 500,
  height: 500
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    tt(e);
    return;
  }
  const t = e;
  try {
    const a = t.type, r = Xt[a];
    if (!r) {
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
    const i = await r(t.data);
    figma.ui.postMessage(L(x({}, i), {
      requestId: t.requestId
    }));
  } catch (a) {
    console.error("Error handling message:", a);
    const r = {
      type: t.type,
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {},
      requestId: t.requestId
    };
    figma.ui.postMessage(r);
  }
};
