var Ve = Object.defineProperty, Ge = Object.defineProperties;
var Be = Object.getOwnPropertyDescriptors;
var he = Object.getOwnPropertySymbols;
var Fe = Object.prototype.hasOwnProperty, Ue = Object.prototype.propertyIsEnumerable;
var oe = (e, t, a) => t in e ? Ve(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, x = (e, t) => {
  for (var a in t || (t = {}))
    Fe.call(t, a) && oe(e, a, t[a]);
  if (he)
    for (var a of he(t))
      Ue.call(t, a) && oe(e, a, t[a]);
  return e;
}, O = (e, t) => Ge(e, Be(t));
var $ = (e, t, a) => oe(e, typeof t != "symbol" ? t + "" : t, a);
async function je(e) {
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
async function Ke(e) {
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
}, P = O(x({}, k), {
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
}), L = O(x({}, k), {
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
}), j = O(x({}, k), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), Se = O(x({}, k), {
  cornerRadius: 0
}), qe = O(x({}, k), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function De(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return P;
    case "TEXT":
      return L;
    case "VECTOR":
      return j;
    case "LINE":
      return qe;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return Se;
    default:
      return k;
  }
}
function w(e, t) {
  if (Array.isArray(e))
    return Array.isArray(t) ? e.length !== t.length || e.some((a, r) => w(a, t[r])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof t == "object" && t !== null) {
      const a = Object.keys(e), r = Object.keys(t);
      return a.length !== r.length ? !0 : a.some(
        (i) => !(i in t) || w(e[i], t[i])
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
function de(e) {
  const t = B(e);
  if (t === V.LAYER)
    return se.LAYER;
  if (t === V.TOKENS)
    return se.TOKENS;
  if (t === V.THEME)
    return se.THEME;
}
class ee {
  constructor() {
    $(this, "collectionMap");
    // collectionId -> index
    $(this, "collections");
    // index -> collection data
    $(this, "normalizedNameMap");
    // normalized name -> index (for standard collections)
    $(this, "nextIndex");
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
    if (F(t.collectionName)) {
      const o = this.findCollectionByNormalizedName(r);
      if (o !== void 0) {
        const d = this.collections[o];
        return d.modes = this.mergeModes(
          d.modes,
          t.modes
        ), this.collectionMap.set(a, o), o;
      }
    }
    const i = this.nextIndex++;
    this.collectionMap.set(a, i);
    const s = O(x({}, t), {
      collectionName: r
    });
    if (F(t.collectionName)) {
      const o = de(
        t.collectionName
      );
      o && (s.collectionGuid = o), this.normalizedNameMap.set(r, i);
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
    const a = new ee(), r = Object.entries(t).sort(
      (s, o) => parseInt(s[0], 10) - parseInt(o[0], 10)
    );
    for (const [s, o] of r) {
      const d = parseInt(s, 10), g = (i = o.isLocal) != null ? i : !0, p = B(
        o.collectionName || ""
      ), n = o.collectionId || o.collectionGuid || `temp:${d}:${p}`, u = x({
        collectionName: p,
        collectionId: n,
        isLocal: g,
        modes: o.modes || []
      }, o.collectionGuid && {
        collectionGuid: o.collectionGuid
      });
      a.collectionMap.set(n, d), a.collections[d] = u, F(p) && a.normalizedNameMap.set(p, d), a.nextIndex = Math.max(
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
const He = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, Je = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function We(e) {
  var a;
  const t = e.toUpperCase();
  return (a = He[t]) != null ? a : e;
}
function Ye(e) {
  var t;
  return typeof e == "number" ? (t = Je[e]) != null ? t : e.toString() : e;
}
class te {
  constructor() {
    $(this, "variableMap");
    // variableKey -> index
    $(this, "variables");
    // index -> variable data
    $(this, "nextIndex");
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
        variableType: We(r.variableType)
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
    const a = new te(), r = Object.entries(t).sort(
      (i, s) => parseInt(i[0], 10) - parseInt(s[0], 10)
    );
    for (const [i, s] of r) {
      const o = parseInt(i, 10), d = Ye(s.variableType), g = O(x({}, s), {
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
function Xe(e) {
  return {
    _varRef: e
  };
}
function Ce(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let Ze = 0;
const K = /* @__PURE__ */ new Map();
function Qe(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const t = K.get(e.requestId);
  t && (K.delete(e.requestId), e.error || !e.guid ? t.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : t.resolve(e.guid));
}
function ue() {
  return new Promise((e, t) => {
    const a = `guid_${Date.now()}_${++Ze}`;
    K.set(a, { resolve: e, reject: t }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: a
    }), setTimeout(() => {
      K.has(a) && (K.delete(a), t(new Error("Timeout waiting for GUID from UI")));
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
async function J() {
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
    }), await J();
  },
  log: async (e) => {
    console.log(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    }), await J();
  },
  warning: async (e) => {
    console.warn(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    }), await J();
  },
  error: async (e) => {
    console.error(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    }), await J();
  }
};
function et(e, t) {
  const a = t.modes.find((r) => r.modeId === e);
  return a ? a.name : e;
}
async function Ie(e, t, a, r, i = /* @__PURE__ */ new Set()) {
  const s = {};
  for (const [o, d] of Object.entries(e)) {
    const g = et(o, r);
    if (d == null) {
      s[g] = d;
      continue;
    }
    if (typeof d == "string" || typeof d == "number" || typeof d == "boolean") {
      s[g] = d;
      continue;
    }
    if (typeof d == "object" && d !== null && "type" in d && d.type === "VARIABLE_ALIAS" && "id" in d) {
      const p = d.id;
      if (i.has(p)) {
        s[g] = {
          type: "VARIABLE_ALIAS",
          id: p
        };
        continue;
      }
      const n = await figma.variables.getVariableByIdAsync(p);
      if (!n) {
        s[g] = {
          type: "VARIABLE_ALIAS",
          id: p
        };
        continue;
      }
      const u = new Set(i);
      u.add(p);
      const f = await figma.variables.getVariableCollectionByIdAsync(
        n.variableCollectionId
      ), l = n.key;
      if (!l) {
        s[g] = {
          type: "VARIABLE_ALIAS",
          id: p
        };
        continue;
      }
      const h = {
        variableName: n.name,
        variableType: n.resolvedType,
        collectionName: f == null ? void 0 : f.name,
        collectionId: n.variableCollectionId,
        variableKey: l,
        id: p,
        isLocal: !n.remote
      };
      if (f) {
        const m = await Ee(
          f,
          a
        );
        h._colRef = m, n.valuesByMode && (h.valuesByMode = await Ie(
          n.valuesByMode,
          t,
          a,
          f,
          // Pass collection for mode ID to name conversion
          u
        ));
      }
      const b = t.addVariable(h);
      s[g] = {
        type: "VARIABLE_ALIAS",
        id: p,
        _varRef: b
      };
    } else
      s[g] = d;
  }
  return s;
}
const W = "recursica:collectionId";
async function tt(e) {
  if (e.remote === !0) {
    const a = Te[e.id];
    if (!a) {
      const i = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await c.error(i), new Error(i);
    }
    return a.guid;
  } else {
    if (F(e.name)) {
      const i = de(e.name);
      if (i) {
        const s = e.getSharedPluginData(
          "recursica",
          W
        );
        return (!s || s.trim() === "") && e.setSharedPluginData(
          "recursica",
          W,
          i
        ), i;
      }
    }
    const a = e.getSharedPluginData(
      "recursica",
      W
    );
    if (a && a.trim() !== "")
      return a;
    const r = await ue();
    return e.setSharedPluginData("recursica", W, r), r;
  }
}
function at(e, t) {
  if (t)
    return;
  const a = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(a))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Ee(e, t) {
  const a = !e.remote, r = t.getCollectionIndex(e.id);
  if (r !== -1)
    return r;
  at(e.name, a);
  const i = await tt(e), s = e.modes.map((p) => p.name), o = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: a,
    modes: s,
    collectionGuid: i
  }, d = t.addCollection(o), g = a ? "local" : "remote";
  return await c.log(
    `  Added ${g} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), d;
}
async function be(e, t, a) {
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
    const o = await Ee(
      i,
      a
    ), d = {
      variableName: r.name,
      variableType: r.resolvedType,
      _colRef: o,
      // Reference to collection table (v2.4.0+)
      variableKey: s,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    r.valuesByMode && (d.valuesByMode = await Ie(
      r.valuesByMode,
      t,
      a,
      i,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const g = t.addVariable(d);
    return Xe(g);
  } catch (r) {
    const i = r instanceof Error ? r.message : String(r);
    throw console.error("Could not resolve variable alias:", e.id, r), new Error(
      `Failed to resolve variable alias ${e.id}: ${i}`
    );
  }
}
async function Z(e, t, a) {
  if (!e || typeof e != "object") return e;
  const r = {};
  for (const i in e)
    if (Object.prototype.hasOwnProperty.call(e, i)) {
      const s = e[i];
      if (s && typeof s == "object" && !Array.isArray(s))
        if (s.type === "VARIABLE_ALIAS") {
          const o = await be(
            s,
            t,
            a
          );
          o && (r[i] = o);
        } else
          r[i] = await Z(
            s,
            t,
            a
          );
      else Array.isArray(s) ? r[i] = await Promise.all(
        s.map(async (o) => (o == null ? void 0 : o.type) === "VARIABLE_ALIAS" ? await be(
          o,
          t,
          a
        ) || o : o && typeof o == "object" ? await Z(
          o,
          t,
          a
        ) : o)
      ) : r[i] = s;
    }
  return r;
}
async function rt(e, t, a) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (r) => {
      if (!r || typeof r != "object") return r;
      const i = {};
      for (const s in r)
        Object.prototype.hasOwnProperty.call(r, s) && (s === "boundVariables" ? i[s] = await Z(
          r[s],
          t,
          a
        ) : i[s] = r[s]);
      return i;
    })
  );
}
async function it(e, t) {
  const a = {}, r = /* @__PURE__ */ new Set();
  if (e.type && (a.type = e.type, r.add("type")), e.id && (a.id = e.id, r.add("id")), e.name !== void 0 && e.name !== "" && (a.name = e.name, r.add("name")), e.x !== void 0 && e.x !== 0 && (a.x = e.x, r.add("x")), e.y !== void 0 && e.y !== 0 && (a.y = e.y, r.add("y")), e.width !== void 0 && (a.width = e.width, r.add("width")), e.height !== void 0 && (a.height = e.height, r.add("height")), e.visible !== void 0 && w(e.visible, k.visible) && (a.visible = e.visible, r.add("visible")), e.locked !== void 0 && w(e.locked, k.locked) && (a.locked = e.locked, r.add("locked")), e.opacity !== void 0 && w(e.opacity, k.opacity) && (a.opacity = e.opacity, r.add("opacity")), e.rotation !== void 0 && w(e.rotation, k.rotation) && (a.rotation = e.rotation, r.add("rotation")), e.blendMode !== void 0 && w(e.blendMode, k.blendMode) && (a.blendMode = e.blendMode, r.add("blendMode")), e.effects !== void 0 && w(e.effects, k.effects) && (a.effects = e.effects, r.add("effects")), e.fills !== void 0) {
    const i = await rt(
      e.fills,
      t.variableTable,
      t.collectionTable
    );
    w(i, k.fills) && (a.fills = i), r.add("fills");
  }
  if (e.strokes !== void 0 && w(e.strokes, k.strokes) && (a.strokes = e.strokes, r.add("strokes")), e.strokeWeight !== void 0 && w(e.strokeWeight, k.strokeWeight) && (a.strokeWeight = e.strokeWeight, r.add("strokeWeight")), e.strokeAlign !== void 0 && w(e.strokeAlign, k.strokeAlign) && (a.strokeAlign = e.strokeAlign, r.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const i = await Z(
      e.boundVariables,
      t.variableTable,
      t.collectionTable
    );
    Object.keys(i).length > 0 && (a.boundVariables = i), r.add("boundVariables");
  }
  return a;
}
async function we(e, t) {
  const a = {}, r = /* @__PURE__ */ new Set();
  return e.layoutMode !== void 0 && w(e.layoutMode, P.layoutMode) && (a.layoutMode = e.layoutMode, r.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && w(
    e.primaryAxisSizingMode,
    P.primaryAxisSizingMode
  ) && (a.primaryAxisSizingMode = e.primaryAxisSizingMode, r.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && w(
    e.counterAxisSizingMode,
    P.counterAxisSizingMode
  ) && (a.counterAxisSizingMode = e.counterAxisSizingMode, r.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && w(
    e.primaryAxisAlignItems,
    P.primaryAxisAlignItems
  ) && (a.primaryAxisAlignItems = e.primaryAxisAlignItems, r.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && w(
    e.counterAxisAlignItems,
    P.counterAxisAlignItems
  ) && (a.counterAxisAlignItems = e.counterAxisAlignItems, r.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && w(e.paddingLeft, P.paddingLeft) && (a.paddingLeft = e.paddingLeft, r.add("paddingLeft")), e.paddingRight !== void 0 && w(e.paddingRight, P.paddingRight) && (a.paddingRight = e.paddingRight, r.add("paddingRight")), e.paddingTop !== void 0 && w(e.paddingTop, P.paddingTop) && (a.paddingTop = e.paddingTop, r.add("paddingTop")), e.paddingBottom !== void 0 && w(e.paddingBottom, P.paddingBottom) && (a.paddingBottom = e.paddingBottom, r.add("paddingBottom")), e.itemSpacing !== void 0 && w(e.itemSpacing, P.itemSpacing) && (a.itemSpacing = e.itemSpacing, r.add("itemSpacing")), e.cornerRadius !== void 0 && w(e.cornerRadius, P.cornerRadius) && (a.cornerRadius = e.cornerRadius, r.add("cornerRadius")), e.clipsContent !== void 0 && w(e.clipsContent, P.clipsContent) && (a.clipsContent = e.clipsContent, r.add("clipsContent")), e.layoutWrap !== void 0 && w(e.layoutWrap, P.layoutWrap) && (a.layoutWrap = e.layoutWrap, r.add("layoutWrap")), e.layoutGrow !== void 0 && w(e.layoutGrow, P.layoutGrow) && (a.layoutGrow = e.layoutGrow, r.add("layoutGrow")), a;
}
async function nt(e, t) {
  const a = {}, r = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (a.characters = e.characters, r.add("characters")), e.fontName !== void 0 && (a.fontName = e.fontName, r.add("fontName")), e.fontSize !== void 0 && (a.fontSize = e.fontSize, r.add("fontSize")), e.textAlignHorizontal !== void 0 && w(
    e.textAlignHorizontal,
    L.textAlignHorizontal
  ) && (a.textAlignHorizontal = e.textAlignHorizontal, r.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && w(
    e.textAlignVertical,
    L.textAlignVertical
  ) && (a.textAlignVertical = e.textAlignVertical, r.add("textAlignVertical")), e.letterSpacing !== void 0 && w(e.letterSpacing, L.letterSpacing) && (a.letterSpacing = e.letterSpacing, r.add("letterSpacing")), e.lineHeight !== void 0 && w(e.lineHeight, L.lineHeight) && (a.lineHeight = e.lineHeight, r.add("lineHeight")), e.textCase !== void 0 && w(e.textCase, L.textCase) && (a.textCase = e.textCase, r.add("textCase")), e.textDecoration !== void 0 && w(e.textDecoration, L.textDecoration) && (a.textDecoration = e.textDecoration, r.add("textDecoration")), e.textAutoResize !== void 0 && w(e.textAutoResize, L.textAutoResize) && (a.textAutoResize = e.textAutoResize, r.add("textAutoResize")), e.paragraphSpacing !== void 0 && w(
    e.paragraphSpacing,
    L.paragraphSpacing
  ) && (a.paragraphSpacing = e.paragraphSpacing, r.add("paragraphSpacing")), e.paragraphIndent !== void 0 && w(e.paragraphIndent, L.paragraphIndent) && (a.paragraphIndent = e.paragraphIndent, r.add("paragraphIndent")), e.listOptions !== void 0 && w(e.listOptions, L.listOptions) && (a.listOptions = e.listOptions, r.add("listOptions")), a;
}
async function ot(e, t) {
  const a = {}, r = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && w(e.fillGeometry, j.fillGeometry) && (a.fillGeometry = e.fillGeometry, r.add("fillGeometry")), e.strokeGeometry !== void 0 && w(e.strokeGeometry, j.strokeGeometry) && (a.strokeGeometry = e.strokeGeometry, r.add("strokeGeometry")), e.strokeCap !== void 0 && w(e.strokeCap, j.strokeCap) && (a.strokeCap = e.strokeCap, r.add("strokeCap")), e.strokeJoin !== void 0 && w(e.strokeJoin, j.strokeJoin) && (a.strokeJoin = e.strokeJoin, r.add("strokeJoin")), e.dashPattern !== void 0 && w(e.dashPattern, j.dashPattern) && (a.dashPattern = e.dashPattern, r.add("dashPattern")), a;
}
async function st(e, t) {
  const a = {}, r = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && w(e.cornerRadius, Se.cornerRadius) && (a.cornerRadius = e.cornerRadius, r.add("cornerRadius")), e.pointCount !== void 0 && (a.pointCount = e.pointCount, r.add("pointCount")), e.innerRadius !== void 0 && (a.innerRadius = e.innerRadius, r.add("innerRadius")), e.pointCount !== void 0 && (a.pointCount = e.pointCount, r.add("pointCount")), a;
}
const ct = "RecursicaPublishedMetadata";
function Ae(e) {
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
function lt(e) {
  try {
    const t = e.getSharedPluginData(
      "recursica",
      ct
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
async function dt(e, t) {
  const a = {}, r = /* @__PURE__ */ new Set();
  if (a._isInstance = !0, r.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const i = await e.getMainComponentAsync();
    if (!i)
      return a;
    const s = e.name || "(unnamed)", o = i.name || "(unnamed)", d = i.remote === !0, p = Ae(e).page, n = Ae(i), u = n.page;
    let f;
    d ? f = "remote" : u && p && u.id === p.id ? f = "internal" : (u && p && (u.id, p.id), f = "normal");
    let l, h;
    try {
      e.variantProperties && (l = e.variantProperties), e.componentProperties && (h = e.componentProperties);
    } catch (N) {
    }
    let b, m;
    try {
      let N = i.parent;
      const S = [];
      let v = 0;
      const E = 20;
      for (; N && v < E; )
        try {
          const T = N.type, z = N.name;
          if (T === "COMPONENT_SET" && !m && (m = z), T === "PAGE")
            break;
          const U = z || "";
          S.unshift(U), N = N.parent, v++;
        } catch (T) {
          break;
        }
      b = S;
    } catch (N) {
    }
    const y = x(x(x(x({
      instanceType: f,
      componentName: o
    }, m && { componentSetName: m }), l && { variantProperties: l }), h && { componentProperties: h }), f === "normal" ? { path: b || [] } : b && b.length > 0 && {
      path: b
    });
    if (f === "internal")
      y.componentNodeId = i.id, await c.log(
        `  Found INSTANCE: "${s}" -> INTERNAL component "${o}" (ID: ${i.id.substring(0, 8)}...)`
      );
    else if (f === "normal") {
      if (u) {
        y.componentPageName = u.name;
        const S = lt(u);
        S != null && S.id && S.version !== void 0 && (y.componentGuid = S.id, y.componentVersion = S.version);
      } else {
        const S = i.id;
        let v = "", E = "";
        switch (n.reason) {
          case "detached":
            v = "The component is detached (not placed on any page)", E = "Please place the component on a page before exporting.";
            break;
          case "broken_chain":
            v = "The component's parent chain is broken and cannot be traversed to find the page", E = "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            v = "Cannot access the component's parent chain (access error)", E = "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            v = "Cannot determine which page the component is on", E = "Please ensure the component is properly placed on a page.";
        }
        try {
          await figma.viewport.scrollAndZoomIntoView([i]);
        } catch (U) {
          console.warn("Could not scroll to component:", U);
        }
        const T = `Normal instance "${s}" -> component "${o}" (ID: ${S}) has no componentPage. ${v}. ${E} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", T), await c.error(T);
        const z = new Error(T);
        throw console.error("Throwing error:", z), z;
      }
      b === void 0 && console.warn(
        `Failed to build path for normal instance "${s}" -> component "${o}". Path is required for resolution.`
      );
      const N = b && b.length > 0 ? ` at path [${b.join(" → ")}]` : " at page root";
      await c.log(
        `  Found INSTANCE: "${s}" -> NORMAL component "${o}" (ID: ${i.id.substring(0, 8)}...)${N}`
      );
    } else if (f === "remote") {
      let N, S;
      try {
        if (typeof i.getPublishStatusAsync == "function")
          try {
            const v = await i.getPublishStatusAsync();
            v && typeof v == "object" && (v.libraryName && (N = v.libraryName), v.libraryKey && (S = v.libraryKey));
          } catch (v) {
          }
        try {
          const v = figma.teamLibrary;
          if (typeof (v == null ? void 0 : v.getAvailableLibraryComponentSetsAsync) == "function") {
            const E = await v.getAvailableLibraryComponentSetsAsync();
            if (E && Array.isArray(E)) {
              for (const T of E)
                if (T.key === i.key || T.name === i.name) {
                  T.libraryName && (N = T.libraryName), T.libraryKey && (S = T.libraryKey);
                  break;
                }
            }
          }
        } catch (v) {
        }
        try {
          y.structure = await ie(
            i,
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
      N && (y.remoteLibraryName = N), S && (y.remoteLibraryKey = S), await c.log(
        `  Found INSTANCE: "${s}" -> REMOTE component "${o}" (ID: ${i.id.substring(0, 8)}...)`
      );
    }
    const A = t.instanceTable.addInstance(y);
    a._instanceRef = A, r.add("_instanceRef");
  }
  return a;
}
class ae {
  constructor() {
    $(this, "instanceMap");
    // unique key -> index
    $(this, "instances");
    // index -> instance data
    $(this, "nextIndex");
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
    const a = new ae(), r = Object.entries(t).sort(
      (i, s) => parseInt(i[0], 10) - parseInt(s[0], 10)
    );
    for (const [i, s] of r) {
      const o = parseInt(i, 10), d = a.generateKey(s);
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
const Re = {
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
function ut() {
  const e = {};
  for (const [t, a] of Object.entries(Re))
    e[a] = t;
  return e;
}
function ve(e) {
  var t;
  return (t = Re[e]) != null ? t : e;
}
function gt(e) {
  var t;
  return typeof e == "number" ? (t = ut()[e]) != null ? t : e.toString() : e;
}
const Me = {
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
for (const [e, t] of Object.entries(Me))
  ce[t] = e;
class re {
  constructor() {
    $(this, "shortToLong");
    $(this, "longToShort");
    this.shortToLong = x({}, ce), this.longToShort = x({}, Me);
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
        const o = this.getShortName(i);
        if (o !== i && !r.has(o)) {
          let d = this.compressObject(s);
          o === "type" && typeof d == "string" && (d = ve(d)), a[o] = d;
        } else {
          let d = this.compressObject(s);
          i === "type" && typeof d == "string" && (d = ve(d)), a[i] = d;
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
        let o = this.expandObject(i);
        (s === "type" || r === "type") && (typeof o == "number" || typeof o == "string") && (o = gt(o)), a[s] = o;
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
    const a = new re();
    a.shortToLong = x(x({}, ce), t), a.longToShort = {};
    for (const [r, i] of Object.entries(
      a.shortToLong
    ))
      a.longToShort[i] = r;
    return a;
  }
}
function ft(e, t) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const a = {};
  e.metadata && (a.metadata = e.metadata);
  for (const [r, i] of Object.entries(e))
    r !== "metadata" && (a[r] = t.compressObject(i));
  return a;
}
function pt(e, t) {
  return t.expandObject(e);
}
const Y = /* @__PURE__ */ new Map();
let mt = 0;
function yt() {
  return `prompt_${Date.now()}_${++mt}`;
}
const ge = {
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
    const a = typeof t == "number" ? { timeoutMs: t } : t, r = (d = a == null ? void 0 : a.timeoutMs) != null ? d : 3e5, i = a == null ? void 0 : a.okLabel, s = a == null ? void 0 : a.cancelLabel, o = yt();
    return new Promise((g, p) => {
      const n = r === -1 ? null : setTimeout(() => {
        Y.delete(o), p(new Error(`Plugin prompt timeout: ${e}`));
      }, r);
      Y.set(o, {
        resolve: g,
        reject: p,
        timeout: n
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: x(x({
          message: e,
          requestId: o
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
    const { requestId: t, action: a } = e, r = Y.get(t);
    if (!r) {
      console.warn(
        `Received response for unknown prompt request: ${t}`
      );
      return;
    }
    r.timeout && clearTimeout(r.timeout), Y.delete(t), a === "ok" ? r.resolve() : r.reject(new Error("User cancelled"));
  }
};
function Q(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
function fe(e) {
  let t = 1;
  return e.children && e.children.length > 0 && e.children.forEach((a) => {
    t += fe(a);
  }), t;
}
async function ie(e, t = /* @__PURE__ */ new WeakSet(), a = {}) {
  var u, f, l, h, b;
  if (!e || typeof e != "object")
    return e;
  const r = (u = a.maxNodes) != null ? u : 1e4, i = (f = a.nodeCount) != null ? f : 0;
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
    depth: (h = a.depth) != null ? h : 0,
    maxDepth: (b = a.maxDepth) != null ? b : 100,
    nodeCount: i + 1,
    maxNodes: r,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: a.variableTable,
    collectionTable: a.collectionTable,
    instanceTable: a.instanceTable
  };
  if (t.has(e))
    return "[Circular Reference]";
  t.add(e), s.visited = t;
  const o = {}, d = await it(e, s);
  Object.assign(o, d);
  const g = e.type;
  if (g)
    switch (g) {
      case "FRAME":
      case "COMPONENT": {
        const m = await we(e);
        Object.assign(o, m);
        break;
      }
      case "INSTANCE": {
        const m = await dt(
          e,
          s
        );
        Object.assign(o, m);
        const y = await we(
          e
        );
        Object.assign(o, y);
        break;
      }
      case "TEXT": {
        const m = await nt(e);
        Object.assign(o, m);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const m = await ot(e);
        Object.assign(o, m);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const m = await st(e);
        Object.assign(o, m);
        break;
      }
      default:
        s.unhandledKeys.add("_unknownType");
        break;
    }
  const p = Object.getOwnPropertyNames(e), n = /* @__PURE__ */ new Set([
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
  for (const m of p)
    typeof e[m] != "function" && (n.has(m) || s.unhandledKeys.add(m));
  if (s.unhandledKeys.size > 0 && (o._unhandledKeys = Array.from(s.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const m = s.maxDepth;
    if (s.depth >= m)
      o.children = {
        _truncated: !0,
        _reason: `Maximum depth (${m}) reached`,
        _count: e.children.length
      };
    else if (s.nodeCount >= r)
      o.children = {
        _truncated: !0,
        _reason: `Maximum node count (${r}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const y = O(x({}, s), {
        depth: s.depth + 1
      }), A = [];
      let N = !1;
      for (const S of e.children) {
        if (y.nodeCount >= r) {
          o.children = {
            _truncated: !0,
            _reason: `Maximum node count (${r}) reached during children processing`,
            _processed: A.length,
            _total: e.children.length,
            children: A
          }, N = !0;
          break;
        }
        const v = await ie(S, t, y);
        A.push(v), y.nodeCount && (s.nodeCount = y.nodeCount);
      }
      N || (o.children = A);
    }
  }
  return o;
}
async function Pe(e, t = /* @__PURE__ */ new Set(), a = !1) {
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
    const s = i[r], o = s.id;
    if (t.has(o))
      return await c.log(
        `Page "${s.name}" has already been processed, skipping...`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Page already processed",
        data: {}
      };
    t.add(o), await c.log(
      `Selected page: "${s.name}" (index: ${r})`
    ), await c.log(
      "Initializing variable, collection, and instance tables..."
    );
    const d = new te(), g = new ee(), p = new ae();
    await c.log("Fetching team library variable collections...");
    let n = [];
    try {
      if (n = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((M) => ({
        libraryName: M.libraryName,
        key: M.key,
        name: M.name
      })), await c.log(
        `Found ${n.length} library collection(s) in team library`
      ), n.length > 0)
        for (const M of n)
          await c.log(`  - ${M.name} (from ${M.libraryName})`);
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
    const u = await ie(
      s,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: d,
        collectionTable: g,
        instanceTable: p
      }
    );
    await c.log("Node extraction finished");
    const f = fe(u), l = d.getSize(), h = g.getSize(), b = p.getSize();
    if (await c.log("Extraction complete:"), await c.log(`  - Total nodes: ${f}`), await c.log(`  - Unique variables: ${l}`), await c.log(`  - Unique collections: ${h}`), await c.log(`  - Unique instances: ${b}`), h > 0) {
      await c.log("Collections found:");
      const C = g.getTable();
      for (const [M, I] of Object.values(C).entries()) {
        const R = I.collectionGuid ? ` (GUID: ${I.collectionGuid.substring(0, 8)}...)` : "";
        await c.log(
          `  ${M}: ${I.collectionName}${R} - ${I.modes.length} mode(s)`
        );
      }
    }
    await c.log("Checking for referenced component pages...");
    const m = [], y = p.getSerializedTable(), A = Object.values(y).filter(
      (C) => C.instanceType === "normal"
    );
    if (A.length > 0) {
      await c.log(
        `Found ${A.length} normal instance(s) to check`
      );
      const C = /* @__PURE__ */ new Map();
      for (const M of A)
        if (M.componentPageName) {
          const I = i.find((R) => R.name === M.componentPageName);
          if (I && !t.has(I.id))
            C.has(I.id) || C.set(I.id, I);
          else if (!I) {
            const R = `Normal instance references component "${M.componentName || "(unnamed)"}" on page "${M.componentPageName}", but that page was not found. Cannot export.`;
            throw await c.error(R), new Error(R);
          }
        } else {
          const I = `Normal instance references component "${M.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw await c.error(I), new Error(I);
        }
      await c.log(
        `Found ${C.size} unique referenced page(s)`
      );
      for (const [M, I] of C.entries()) {
        const R = I.name;
        if (t.has(M)) {
          await c.log(`Skipping "${R}" - already processed`);
          continue;
        }
        const me = I.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let ye = !1;
        if (me)
          try {
            const G = JSON.parse(me);
            ye = !!(G.id && G.version !== void 0);
          } catch (G) {
          }
        const ze = `Do you want to also publish referenced component "${R}"?`;
        try {
          await ge.prompt(ze, {
            okLabel: "Yes",
            cancelLabel: "No",
            timeoutMs: 3e5
            // 5 minutes
          }), await c.log(`Exporting referenced page: "${R}"`);
          const G = i.findIndex(
            (ne) => ne.id === I.id
          );
          if (G === -1)
            throw await c.error(
              `Could not find page index for "${R}"`
            ), new Error(`Could not find page index for "${R}"`);
          const H = await Pe(
            {
              pageIndex: G
            },
            t,
            // Pass the same set to track all processed pages
            !0
            // Mark as recursive call
          );
          if (H.success && H.data) {
            const ne = H.data;
            m.push(ne), await c.log(
              `Successfully exported referenced page: "${R}"`
            );
          } else
            throw new Error(
              `Failed to export referenced page "${R}": ${H.message}`
            );
        } catch (G) {
          if (G instanceof Error && G.message === "User cancelled")
            if (ye)
              await c.log(
                `User declined to publish "${R}", but page has existing metadata. Continuing with existing metadata.`
              );
            else
              throw await c.error(
                `Export cancelled: Referenced page "${R}" has no metadata and user declined to publish it.`
              ), new Error(
                `Cannot continue export: Referenced component "${R}" has no metadata. Please publish it first or choose to publish it now.`
              );
          else
            throw G;
        }
      }
    }
    await c.log("Creating string table...");
    const N = new re();
    await c.log("Getting page metadata...");
    const S = s.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let v = "", E = 0;
    if (S)
      try {
        const C = JSON.parse(S);
        v = C.id || "", E = C.version || 0;
      } catch (C) {
        await c.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!v) {
      await c.log("Generating new GUID for page..."), v = await ue();
      const C = {
        _ver: 1,
        id: v,
        name: s.name,
        version: E,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      s.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(C)
      );
    }
    await c.log("Creating export data structure...");
    const T = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "2.7.0",
        // Updated version for string table compression
        figmaApiVersion: figma.apiVersion,
        guid: v,
        version: E,
        name: s.name,
        pluginVersion: "1.0.0"
      },
      stringTable: N.getSerializedTable(),
      collections: g.getSerializedTable(),
      variables: d.getSerializedTable(),
      instances: p.getSerializedTable(),
      libraries: n,
      // Libraries might not need compression, but could be added later
      pageData: u
    };
    await c.log("Compressing JSON data...");
    const z = ft(T, N);
    await c.log("Serializing to JSON...");
    const U = JSON.stringify(z, null, 2), _e = (U.length / 1024).toFixed(2), pe = Q(s.name).trim().replace(/\s+/g, "_") + ".rec.json";
    return await c.log(`JSON serialization complete: ${_e} KB`), await c.log(`Export file: ${pe}`), await c.log("=== Export Complete ==="), {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: pe,
        jsonData: U,
        pageName: s.name,
        additionalPages: m
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
async function q(e, t) {
  for (const a of t)
    e.modes.find((i) => i.name === a) || e.addMode(a);
}
const _ = "recursica:collectionId";
async function X(e) {
  if (e.remote === !0) {
    const a = Te[e.id];
    if (!a) {
      const i = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await c.error(i), new Error(i);
    }
    return a.guid;
  } else {
    const a = e.getSharedPluginData(
      "recursica",
      _
    );
    if (a && a.trim() !== "")
      return a;
    const r = await ue();
    return e.setSharedPluginData("recursica", _, r), r;
  }
}
function ht(e, t) {
  const a = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(a))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function bt(e) {
  let t;
  const a = e.collectionName.trim().toLowerCase(), r = ["token", "tokens", "theme", "themes"], i = e.isLocal;
  if (i === !1 || i === void 0 && r.includes(a))
    try {
      const d = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((g) => g.name.trim().toLowerCase() === a);
      if (d) {
        ht(e.collectionName, !1);
        const g = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          d.key
        );
        if (g.length > 0) {
          const p = await figma.variables.importVariableByKeyAsync(g[0].key), n = await figma.variables.getVariableCollectionByIdAsync(
            p.variableCollectionId
          );
          if (n) {
            if (t = n, e.collectionGuid) {
              const u = t.getSharedPluginData(
                "recursica",
                _
              );
              (!u || u.trim() === "") && t.setSharedPluginData(
                "recursica",
                _,
                e.collectionGuid
              );
            } else
              await X(t);
            return await q(t, e.modes), { collection: t };
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
    let d;
    if (e.collectionGuid && (d = o.find((g) => g.getSharedPluginData("recursica", _) === e.collectionGuid)), d || (d = o.find(
      (g) => g.name === e.collectionName
    )), d)
      if (t = d, e.collectionGuid) {
        const g = t.getSharedPluginData(
          "recursica",
          _
        );
        (!g || g.trim() === "") && t.setSharedPluginData(
          "recursica",
          _,
          e.collectionGuid
        );
      } else
        await X(t);
    else
      t = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? t.setSharedPluginData(
        "recursica",
        _,
        e.collectionGuid
      ) : await X(t);
  } else {
    const o = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), d = e.collectionName.trim().toLowerCase(), g = o.find((f) => f.name.trim().toLowerCase() === d);
    if (!g)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const p = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      g.key
    );
    if (p.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const n = await figma.variables.importVariableByKeyAsync(
      p[0].key
    ), u = await figma.variables.getVariableCollectionByIdAsync(
      n.variableCollectionId
    );
    if (!u)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (t = u, e.collectionGuid) {
      const f = t.getSharedPluginData(
        "recursica",
        _
      );
      (!f || f.trim() === "") && t.setSharedPluginData(
        "recursica",
        _,
        e.collectionGuid
      );
    } else
      X(t);
  }
  return await q(t, e.modes), { collection: t };
}
async function ke(e, t) {
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
async function wt(e, t, a, r, i) {
  for (const [s, o] of Object.entries(t)) {
    const d = r.modes.find((p) => p.name === s);
    if (!d) {
      console.warn(
        `Mode "${s}" not found in collection "${r.name}" for variable "${e.name}". Skipping.`
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
        const p = o;
        let n = null;
        const u = a.getVariableByIndex(
          p._varRef
        );
        if (u) {
          let f = null;
          if (i && u._colRef !== void 0) {
            const l = i.getCollectionByIndex(
              u._colRef
            );
            l && (f = (await bt(l)).collection);
          }
          f && (n = await ke(
            f,
            u.variableName
          ));
        }
        if (n) {
          const f = {
            type: "VARIABLE_ALIAS",
            id: n.id
          };
          e.setValueForMode(g, f);
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
async function Ne(e, t, a, r) {
  const i = figma.variables.createVariable(
    e.variableName,
    t,
    e.variableType
  );
  return e.valuesByMode && await wt(
    i,
    e.valuesByMode,
    a,
    t,
    // Pass collection to look up modes by name
    r
  ), i;
}
async function $e(e, t, a, r) {
  if (!(!t || typeof t != "object"))
    try {
      const i = e[a];
      if (!i || !Array.isArray(i))
        return;
      const s = t[a];
      if (Array.isArray(s))
        for (let o = 0; o < s.length && o < i.length; o++) {
          const d = s[o];
          if (d && typeof d == "object") {
            i[o].boundVariables || (i[o].boundVariables = {});
            for (const [g, p] of Object.entries(
              d
            ))
              if (Ce(p)) {
                const n = p._varRef;
                if (n !== void 0) {
                  const u = r.get(String(n));
                  u && (i[o].boundVariables[g] = {
                    type: "VARIABLE_ALIAS",
                    id: u.id
                  });
                }
              }
          }
        }
    } catch (i) {
      console.log(`Error restoring bound variables for ${a}:`, i);
    }
}
function At(e, t) {
  const a = De(t);
  if (e.visible === void 0 && (e.visible = a.visible), e.locked === void 0 && (e.locked = a.locked), e.opacity === void 0 && (e.opacity = a.opacity), e.rotation === void 0 && (e.rotation = a.rotation), e.blendMode === void 0 && (e.blendMode = a.blendMode), t === "FRAME" || t === "COMPONENT" || t === "INSTANCE") {
    const r = P;
    e.layoutMode === void 0 && (e.layoutMode = r.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = r.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = r.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = r.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = r.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = r.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = r.paddingRight), e.paddingTop === void 0 && (e.paddingTop = r.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = r.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = r.itemSpacing);
  }
  if (t === "TEXT") {
    const r = L;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = r.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = r.textAlignVertical), e.textCase === void 0 && (e.textCase = r.textCase), e.textDecoration === void 0 && (e.textDecoration = r.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = r.textAutoResize);
  }
}
async function D(e, t, a = null, r = null, i = null, s = null, o = null, d = !1, g = null) {
  var p;
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
        else if (e._instanceRef !== void 0 && i && o)
          try {
            const u = i.getInstanceByIndex(
              e._instanceRef
            );
            if (u && u.instanceType === "internal")
              if (u.componentNodeId) {
                const f = o.get(
                  u.componentNodeId
                );
                if (f && f.type === "COMPONENT") {
                  if (n = f.createInstance(), await c.log(
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
                    `Component not found for internal instance "${e.name}" (ID: ${u.componentNodeId.substring(0, 8)}...), creating frame fallback`
                  ), n = figma.createFrame();
              } else
                await c.warning(
                  `Internal instance "${e.name}" missing componentNodeId, creating frame fallback`
                ), n = figma.createFrame();
            else if (u && u.instanceType === "remote")
              if (g) {
                const f = g.get(
                  e._instanceRef
                );
                if (f) {
                  if (n = f.createInstance(), await c.log(
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
    if (e.id && o && o.set(e.id, n), At(n, e.type || "FRAME"), e.name !== void 0 && (n.name = e.name || "Unnamed Node"), e.x !== void 0 && (n.x = e.x), e.y !== void 0 && (n.y = e.y), e.width !== void 0 && e.height !== void 0 && n.resize(e.width, e.height), e.visible !== void 0 && (n.visible = e.visible), e.locked !== void 0 && (n.locked = e.locked), e.opacity !== void 0 && (n.opacity = e.opacity), e.rotation !== void 0 && (n.rotation = e.rotation), e.blendMode !== void 0 && (n.blendMode = e.blendMode), e.type !== "INSTANCE" && e.fills !== void 0)
      try {
        let u = e.fills;
        Array.isArray(u) && (u = u.map((f) => {
          if (f && typeof f == "object") {
            const l = x({}, f);
            return delete l.boundVariables, l;
          }
          return f;
        })), n.fills = u, (p = e.boundVariables) != null && p.fills && s && await $e(
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
        } catch (f) {
          console.log("Could not set text characters: " + f);
        }
      }
    if (e.boundVariables) {
      for (const [u, f] of Object.entries(
        e.boundVariables
      ))
        if (u !== "fills" && Ce(f) && a && s) {
          const l = f._varRef;
          if (l !== void 0) {
            const h = s.get(String(l));
            if (h) {
              const b = {
                type: "VARIABLE_ALIAS",
                id: h.id
              };
              n.boundVariables || (n.boundVariables = {}), n.boundVariables[u] || (n.boundVariables[u] = b);
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
        const f = await D(
          u,
          n,
          a,
          r,
          i,
          s,
          o,
          d,
          // Pass the flag down to children
          g
          // Pass the remote component map down to children
        );
        f && n.appendChild(f);
      }
    return t && t.appendChild(n), n;
  } catch (n) {
    return console.log(
      "Error recreating node " + (e.name || e.type) + ":",
      n
    ), null;
  }
}
async function xe(e) {
  await figma.loadAllPagesAsync();
  const t = figma.root.children, a = new Set(t.map((s) => s.name));
  if (!a.has(e))
    return e;
  let r = 1, i = `${e}_${r}`;
  for (; a.has(i); )
    r++, i = `${e}_${r}`;
  return i;
}
async function vt(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), a = new Set(t.map((s) => s.name));
  if (!a.has(e))
    return e;
  let r = 1, i = `${e}_${r}`;
  for (; a.has(i); )
    r++, i = `${e}_${r}`;
  return i;
}
async function Nt(e, t) {
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
  let r = 1, i = `${t}_${r}`;
  for (; a.has(i); )
    r++, i = `${t}_${r}`;
  return i;
}
function xt(e, t) {
  const a = e.resolvedType.toUpperCase(), r = t.toUpperCase();
  return a === r;
}
async function St(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), a = B(e.collectionName);
  if (F(e.collectionName)) {
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
        _
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
function Ct(e) {
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
    t = re.fromTable(e.stringTable);
  } catch (r) {
    return {
      success: !1,
      error: `Failed to load string table: ${r instanceof Error ? r.message : "Unknown error"}`
    };
  }
  const a = pt(e, t);
  return {
    success: !0,
    stringTable: t,
    expandedJsonData: a
  };
}
function It(e) {
  if (!e.collections)
    return {
      success: !1,
      error: "No collections table found in JSON"
    };
  try {
    return {
      success: !0,
      collectionTable: ee.fromTable(
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
async function Et(e) {
  const t = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = e.getTable();
  for (const [s, o] of Object.entries(i)) {
    if (o.isLocal === !1) {
      await c.log(
        `Skipping remote collection: "${o.collectionName}" (index ${s})`
      );
      continue;
    }
    const d = await St(o);
    d.matchType === "recognized" ? (await c.log(
      `✓ Recognized collection by GUID: "${o.collectionName}" (index ${s})`
    ), t.set(s, d.collection)) : d.matchType === "potential" ? (await c.log(
      `? Potential match by name: "${o.collectionName}" (index ${s})`
    ), a.set(s, {
      entry: o,
      collection: d.collection
    })) : (await c.log(
      `✗ No match found for collection: "${o.collectionName}" (index ${s}) - will create new`
    ), r.set(s, o));
  }
  return await c.log(
    `Collection matching complete: ${t.size} recognized, ${a.size} potential matches, ${r.size} to create`
  ), {
    recognizedCollections: t,
    potentialMatches: a,
    collectionsToCreate: r
  };
}
async function Rt(e, t, a) {
  if (e.size !== 0) {
    await c.log(
      `Prompting user for ${e.size} potential match(es)...`
    );
    for (const [r, { entry: i, collection: s }] of e.entries())
      try {
        const o = F(i.collectionName) ? B(i.collectionName) : s.name, d = `Found existing "${o}" variable collection. Should I use it?`;
        await c.log(
          `Prompting user about potential match: "${o}"`
        ), await ge.prompt(d, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await c.log(
          `✓ User confirmed: Using existing collection "${o}" (index ${r})`
        ), t.set(r, s), await q(s, i.modes), await c.log(
          `  ✓ Ensured modes for collection "${o}" (${i.modes.length} mode(s))`
        );
      } catch (o) {
        await c.log(
          `✗ User rejected: Will create new collection for "${i.collectionName}" (index ${r})`
        ), a.set(r, i);
      }
  }
}
async function Mt(e, t, a) {
  if (e.size === 0)
    return;
  await c.log("Ensuring modes exist for recognized collections...");
  const r = t.getTable();
  for (const [i, s] of e.entries()) {
    const o = r[i];
    o && (a.has(i) || (await q(s, o.modes), await c.log(
      `  ✓ Ensured modes for collection "${s.name}" (${o.modes.length} mode(s))`
    )));
  }
}
async function Pt(e, t, a) {
  if (e.size !== 0) {
    await c.log(
      `Creating ${e.size} new collection(s)...`
    );
    for (const [r, i] of e.entries()) {
      const s = B(i.collectionName), o = await vt(s);
      o !== s ? await c.log(
        `Creating collection: "${o}" (normalized: "${s}" - name conflict resolved)`
      ) : await c.log(`Creating collection: "${o}"`);
      const d = figma.variables.createVariableCollection(o);
      a.push(d);
      let g;
      if (F(i.collectionName)) {
        const p = de(i.collectionName);
        p && (g = p);
      } else i.collectionGuid && (g = i.collectionGuid);
      g && (d.setSharedPluginData(
        "recursica",
        _,
        g
      ), await c.log(
        `  Stored GUID: ${g.substring(0, 8)}...`
      )), await q(d, i.modes), await c.log(
        `  ✓ Created collection "${o}" with ${i.modes.length} mode(s)`
      ), t.set(r, d);
    }
    await c.log("Collection creation complete");
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
      variableTable: te.fromTable(e.variables)
    };
  } catch (t) {
    return {
      success: !1,
      error: `Failed to load variables table: ${t instanceof Error ? t.message : "Unknown error"}`
    };
  }
}
async function $t(e, t, a, r) {
  const i = /* @__PURE__ */ new Map(), s = [], o = new Set(
    r.map((p) => p.id)
  );
  await c.log("Matching and creating variables in collections...");
  const d = e.getTable(), g = /* @__PURE__ */ new Map();
  for (const [p, n] of Object.entries(d)) {
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
    const f = g.get(u.id), l = o.has(
      u.id
    );
    let h;
    typeof n.variableType == "number" ? h = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[n.variableType] || String(n.variableType) : h = n.variableType;
    const b = await ke(
      u,
      n.variableName
    );
    if (b)
      if (xt(b, h))
        i.set(p, b), f.existing++;
      else {
        await c.warning(
          `Type mismatch for variable "${n.variableName}" in collection "${u.name}": expected ${h}, found ${b.resolvedType}. Creating new variable with incremented name.`
        );
        const m = await Nt(
          u,
          n.variableName
        ), y = await Ne(
          O(x({}, n), {
            variableName: m,
            variableType: h
          }),
          u,
          e,
          t
        );
        l || s.push(y), i.set(p, y), f.created++;
      }
    else {
      const m = await Ne(
        O(x({}, n), {
          variableType: h
        }),
        u,
        e,
        t
      );
      l || s.push(m), i.set(p, m), f.created++;
    }
  }
  await c.log("Variable processing complete:");
  for (const p of g.values())
    await c.log(
      `  "${p.collectionName}": ${p.existing} existing, ${p.created} created`
    );
  return {
    recognizedVariables: i,
    newlyCreatedVariables: s
  };
}
function Ot(e) {
  if (!e.instances)
    return null;
  try {
    return ae.fromTable(e.instances);
  } catch (t) {
    return null;
  }
}
async function Lt(e, t) {
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
async function _t(e, t, a, r) {
  var u;
  const i = e.getSerializedTable(), s = Object.values(i).filter(
    (f) => f.instanceType === "remote"
  ), o = /* @__PURE__ */ new Map();
  if (s.length === 0)
    return await c.log("No remote instances found"), o;
  await c.log(
    `Processing ${s.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  let g = figma.root.children.find((f) => f.name === "REMOTES");
  if (g ? await c.log("Found existing REMOTES page") : (g = figma.createPage(), g.name = "REMOTES", await c.log("Created REMOTES page")), !g.children.some(
    (f) => f.type === "FRAME" && f.name === "Title"
  )) {
    const f = { family: "Inter", style: "Bold" }, l = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(f), await figma.loadFontAsync(l);
    const h = figma.createFrame();
    h.name = "Title", h.layoutMode = "VERTICAL", h.paddingTop = 20, h.paddingBottom = 20, h.paddingLeft = 20, h.paddingRight = 20, h.fills = [];
    const b = figma.createText();
    b.fontName = f, b.characters = "REMOTE INSTANCES", b.fontSize = 24, b.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], h.appendChild(b);
    const m = figma.createText();
    m.fontName = l, m.characters = "These are remotely connected component instances found in our different component pages.", m.fontSize = 14, m.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], h.appendChild(m), g.appendChild(h), await c.log("Created title and description on REMOTES page");
  }
  const n = /* @__PURE__ */ new Map();
  for (const [f, l] of Object.entries(i)) {
    if (l.instanceType !== "remote")
      continue;
    const h = parseInt(f, 10);
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
    let b = l.componentName;
    if (l.path && l.path.length > 0) {
      const y = l.path.filter((A) => A !== "").join(" / ");
      y && (b = `${y} / ${l.componentName}`);
    }
    const m = await Lt(
      g,
      b
    );
    m !== b && await c.log(
      `Component name conflict: "${b}" -> "${m}"`
    );
    try {
      if (l.structure.type !== "COMPONENT") {
        await c.warning(
          `Remote instance "${l.componentName}" structure is not a COMPONENT (type: ${l.structure.type}), creating frame fallback`
        );
        const A = figma.createFrame();
        A.name = m;
        const N = await D(
          l.structure,
          A,
          t,
          a,
          null,
          r,
          n,
          !0
          // isRemoteStructure: true
        );
        N ? (A.appendChild(N), g.appendChild(A), await c.log(
          `✓ Created remote instance frame fallback: "${m}"`
        )) : A.remove();
        continue;
      }
      const y = figma.createComponent();
      y.name = m, g.appendChild(y), await c.log(
        `  Created component node: "${m}"`
      );
      try {
        if (l.structure.name !== void 0 && (y.name = l.structure.name), l.structure.width !== void 0 && l.structure.height !== void 0 && y.resize(l.structure.width, l.structure.height), l.structure.x !== void 0 && (y.x = l.structure.x), l.structure.y !== void 0 && (y.y = l.structure.y), l.structure.visible !== void 0 && (y.visible = l.structure.visible), l.structure.opacity !== void 0 && (y.opacity = l.structure.opacity), l.structure.rotation !== void 0 && (y.rotation = l.structure.rotation), l.structure.blendMode !== void 0 && (y.blendMode = l.structure.blendMode), l.structure.fills !== void 0)
          try {
            let A = l.structure.fills;
            Array.isArray(A) && (A = A.map((N) => {
              if (N && typeof N == "object") {
                const S = x({}, N);
                return delete S.boundVariables, S;
              }
              return N;
            })), y.fills = A, (u = l.structure.boundVariables) != null && u.fills && r && await $e(
              y,
              l.structure.boundVariables,
              "fills",
              r
            );
          } catch (A) {
            await c.warning(
              `Error setting fills for remote component "${l.componentName}": ${A}`
            );
          }
        if (l.structure.strokes !== void 0)
          try {
            y.strokes = l.structure.strokes;
          } catch (A) {
            await c.warning(
              `Error setting strokes for remote component "${l.componentName}": ${A}`
            );
          }
        if (l.structure.layoutMode !== void 0 && (y.layoutMode = l.structure.layoutMode), l.structure.primaryAxisSizingMode !== void 0 && (y.primaryAxisSizingMode = l.structure.primaryAxisSizingMode), l.structure.counterAxisSizingMode !== void 0 && (y.counterAxisSizingMode = l.structure.counterAxisSizingMode), l.structure.paddingLeft !== void 0 && (y.paddingLeft = l.structure.paddingLeft), l.structure.paddingRight !== void 0 && (y.paddingRight = l.structure.paddingRight), l.structure.paddingTop !== void 0 && (y.paddingTop = l.structure.paddingTop), l.structure.paddingBottom !== void 0 && (y.paddingBottom = l.structure.paddingBottom), l.structure.itemSpacing !== void 0 && (y.itemSpacing = l.structure.itemSpacing), l.structure.cornerRadius !== void 0 && (y.cornerRadius = l.structure.cornerRadius), l.structure.children && Array.isArray(l.structure.children)) {
          await c.log(
            `  Recreating ${l.structure.children.length} child(ren) for component "${l.componentName}"`
          );
          for (const A of l.structure.children) {
            if (A._truncated) {
              await c.log(
                `  Skipping truncated child: ${A._reason || "Unknown"}`
              );
              continue;
            }
            const N = await D(
              A,
              y,
              t,
              a,
              null,
              r,
              n,
              !0
              // isRemoteStructure: true
            );
            N && y.appendChild(N);
          }
        }
        o.set(h, y), await c.log(
          `✓ Created remote component: "${m}" (index ${h})`
        );
      } catch (A) {
        await c.warning(
          `Error populating remote component "${l.componentName}": ${A instanceof Error ? A.message : "Unknown error"}`
        ), y.remove();
      }
    } catch (y) {
      await c.warning(
        `Error recreating remote instance "${l.componentName}": ${y instanceof Error ? y.message : "Unknown error"}`
      );
    }
  }
  return await c.log(
    `Remote instance processing complete: ${o.size} component(s) created`
  ), o;
}
async function zt(e, t, a, r, i, s, o = null) {
  await c.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const d = figma.root.children, g = "RecursicaPublishedMetadata";
  let p = null;
  for (const m of d) {
    const y = m.getPluginData(g);
    if (y)
      try {
        if (JSON.parse(y).id === e.guid) {
          p = m;
          break;
        }
      } catch (A) {
        continue;
      }
  }
  p && await c.log(
    `Found existing page with same GUID: "${p.name}". Will create new page to avoid overwriting.`
  );
  const n = d.find((m) => m.name === e.name);
  n && await c.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let u;
  if (p || n) {
    const m = `__${e.name}`;
    u = await xe(m), await c.log(
      `Creating scratch page: "${u}" (will be renamed to "${e.name}" on success)`
    );
  } else
    u = e.name, await c.log(`Creating page: "${u}"`);
  const f = figma.createPage();
  if (f.name = u, await figma.setCurrentPageAsync(f), await c.log(`Switched to page: "${u}"`), !t.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await c.log("Recreating page structure...");
  const l = t.pageData, h = /* @__PURE__ */ new Map();
  if (l.children && Array.isArray(l.children))
    for (const m of l.children) {
      const y = await D(
        m,
        f,
        a,
        r,
        i,
        s,
        h,
        !1,
        // isRemoteStructure: false - we're creating the main page
        o
        // Pass the remote component map
      );
      y && f.appendChild(y);
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
  if (f.setPluginData(g, JSON.stringify(b)), await c.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), u.startsWith("__")) {
    const m = await xe(e.name);
    f.name = m, await c.log(`Renamed page from "${u}" to "${m}"`);
  }
  return {
    success: !0,
    page: f
  };
}
async function Vt(e) {
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
    const r = Ct(a);
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
    const o = s.expandedJsonData;
    await c.log("JSON expanded successfully"), await c.log("Loading collections table...");
    const d = It(o);
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
    const g = d.collectionTable;
    await c.log(
      `Loaded collections table with ${g.getSize()} collection(s)`
    ), await c.log(
      "Matching collections with existing local collections..."
    );
    const { recognizedCollections: p, potentialMatches: n, collectionsToCreate: u } = await Et(g);
    await Rt(
      n,
      p,
      u
    ), await Mt(
      p,
      g,
      n
    ), await Pt(
      u,
      p,
      t
    ), await c.log("Loading variables table...");
    const f = kt(o);
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
    const { recognizedVariables: h, newlyCreatedVariables: b } = await $t(
      l,
      g,
      p,
      t
    );
    await c.log("Loading instance table...");
    const m = Ot(o);
    if (m) {
      const v = m.getSerializedTable(), E = Object.values(v).filter(
        (z) => z.instanceType === "internal"
      ), T = Object.values(v).filter(
        (z) => z.instanceType === "remote"
      );
      await c.log(
        `Loaded instance table with ${m.getSize()} instance(s) (${E.length} internal, ${T.length} remote)`
      );
    } else
      await c.log("No instance table found in JSON");
    let y = null;
    m && (y = await _t(
      m,
      l,
      g,
      h
    ));
    const A = await zt(
      i,
      o,
      l,
      g,
      m,
      h,
      y
    );
    if (!A.success)
      return await c.error(A.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: A.error,
        data: {}
      };
    const N = A.page, S = h.size + b.length;
    return await c.log("=== Import Complete ==="), await c.log(
      `Successfully processed ${p.size} collection(s), ${S} variable(s), and created page "${N.name}"`
    ), {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: { pageName: N.name }
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
async function Gt(e) {
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
    const i = await ie(
      r,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + r.name + " (index: " + a + ")"
    );
    const s = JSON.stringify(i, null, 2), o = JSON.parse(s), d = "Copy - " + o.name, g = figma.createPage();
    if (g.name = d, figma.root.appendChild(g), o.children && o.children.length > 0) {
      let u = function(l) {
        l.forEach((h) => {
          const b = (h.x || 0) + (h.width || 0);
          b > f && (f = b), h.children && h.children.length > 0 && u(h.children);
        });
      };
      console.log(
        "Recreating " + o.children.length + " top-level children..."
      );
      let f = 0;
      u(o.children), console.log("Original content rightmost edge: " + f);
      for (const l of o.children)
        await D(l, g, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const p = fe(o);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: o.name,
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
async function Bt(e) {
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
async function Ft(e) {
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
async function Ut(e) {
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
async function jt(e) {
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
function Oe(e, t, a = {}) {
  const r = t instanceof Error ? t.message : t;
  return {
    type: e,
    success: !1,
    error: !0,
    message: r,
    data: a
  };
}
const Le = "RecursicaPublishedMetadata";
async function Kt(e) {
  try {
    const t = figma.currentPage;
    await figma.loadAllPagesAsync();
    const r = figma.root.children.findIndex(
      (d) => d.id === t.id
    ), i = t.getPluginData(Le);
    if (!i) {
      const p = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: Q(t.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: r
      };
      return le("getComponentMetadata", p);
    }
    const o = {
      componentMetadata: JSON.parse(i),
      currentPageIndex: r
    };
    return le("getComponentMetadata", o);
  } catch (t) {
    return console.error("Error getting component metadata:", t), Oe(
      "getComponentMetadata",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function qt(e) {
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
      const s = i, o = s.getPluginData(Le);
      if (o)
        try {
          const d = JSON.parse(o);
          a.push(d);
        } catch (d) {
          console.warn(
            `Failed to parse metadata for page "${s.name}":`,
            d
          );
          const p = {
            _ver: 1,
            id: "",
            name: Q(s.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          a.push(p);
        }
      else {
        const g = {
          _ver: 1,
          id: "",
          name: Q(s.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        a.push(g);
      }
    }
    return le("getAllComponents", {
      components: a
    });
  } catch (t) {
    return console.error("Error getting all components:", t), Oe(
      "getAllComponents",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function Dt(e) {
  try {
    const t = e.requestId, a = e.action;
    return !t || !a ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (ge.handleResponse({ requestId: t, action: a }), {
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
const Ht = {
  getCurrentUser: je,
  loadPages: Ke,
  exportPage: Pe,
  importPage: Vt,
  quickCopy: Gt,
  storeAuthData: Bt,
  loadAuthData: Ft,
  clearAuthData: Ut,
  storeSelectedRepo: jt,
  getComponentMetadata: Kt,
  getAllComponents: qt,
  pluginPromptResponse: Dt
}, Jt = Ht;
figma.showUI(__html__, {
  width: 500,
  height: 500
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    Qe(e);
    return;
  }
  const t = e;
  try {
    const a = t.type, r = Jt[a];
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
    figma.ui.postMessage(O(x({}, i), {
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
