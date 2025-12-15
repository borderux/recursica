var Nt = Object.defineProperty, vt = Object.defineProperties;
var Et = Object.getOwnPropertyDescriptors;
var qe = Object.getOwnPropertySymbols;
var At = Object.prototype.hasOwnProperty, Pt = Object.prototype.propertyIsEnumerable;
var Ge = (e, t, n) => t in e ? Nt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, J = (e, t) => {
  for (var n in t || (t = {}))
    At.call(t, n) && Ge(e, n, t[n]);
  if (qe)
    for (var n of qe(t))
      Pt.call(t, n) && Ge(e, n, t[n]);
  return e;
}, ee = (e, t) => vt(e, Et(t));
var ne = (e, t, n) => Ge(e, typeof t != "symbol" ? t + "" : t, n);
async function Ct(e) {
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
async function St(e) {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "loadPages",
      success: !0,
      error: !1,
      message: "Pages loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        pages: figma.root.children.map((o, d) => ({
          name: o.name,
          index: d
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
const Z = {
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
}, X = ee(J({}, Z), {
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
}), oe = ee(J({}, Z), {
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
}), fe = ee(J({}, Z), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), Qe = ee(J({}, Z), {
  cornerRadius: 0
}), It = ee(J({}, Z), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function Tt(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return X;
    case "TEXT":
      return oe;
    case "VECTOR":
      return fe;
    case "LINE":
      return It;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return Qe;
    default:
      return Z;
  }
}
function z(e, t) {
  if (Array.isArray(e))
    return Array.isArray(t) ? e.length !== t.length || e.some((n, i) => z(n, t[i])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof t == "object" && t !== null) {
      const n = Object.keys(e), i = Object.keys(t);
      return n.length !== i.length ? !0 : n.some(
        (o) => !(o in t) || z(e[o], t[o])
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
}, se = {
  LAYER: "Layer",
  TOKENS: "Tokens",
  THEME: "Theme"
};
function ae(e) {
  const t = e.trim(), i = t.replace(/_\d+$/, "").toLowerCase();
  return i === "themes" || i === "theme" ? se.THEME : i === "token" || i === "tokens" ? se.TOKENS : i === "layer" || i === "layers" ? se.LAYER : t;
}
function de(e) {
  const t = ae(e);
  return t === se.LAYER || t === se.TOKENS || t === se.THEME;
}
function Me(e) {
  const t = ae(e);
  if (t === se.LAYER)
    return ge.LAYER;
  if (t === se.TOKENS)
    return ge.TOKENS;
  if (t === se.THEME)
    return ge.THEME;
}
class ve {
  constructor() {
    ne(this, "collectionMap");
    // collectionId -> index
    ne(this, "collections");
    // index -> collection data
    ne(this, "normalizedNameMap");
    // normalized name -> index (for standard collections)
    ne(this, "nextIndex");
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
    const i = new Set(t);
    for (const o of n)
      i.add(o);
    return Array.from(i);
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
    const i = ae(
      t.collectionName
    );
    if (de(t.collectionName)) {
      const r = this.findCollectionByNormalizedName(i);
      if (r !== void 0) {
        const g = this.collections[r];
        return g.modes = this.mergeModes(
          g.modes,
          t.modes
        ), this.collectionMap.set(n, r), r;
      }
    }
    const o = this.nextIndex++;
    this.collectionMap.set(n, o);
    const d = ee(J({}, t), {
      collectionName: i
    });
    if (de(t.collectionName)) {
      const r = Me(
        t.collectionName
      );
      r && (d.collectionGuid = r), this.normalizedNameMap.set(i, o);
    }
    return this.collections[o] = d, o;
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
      const i = this.collections[n], o = J({
        collectionName: i.collectionName,
        modes: i.modes
      }, i.collectionGuid && { collectionGuid: i.collectionGuid });
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
    const n = new ve(), i = Object.entries(t).sort(
      (d, r) => parseInt(d[0], 10) - parseInt(r[0], 10)
    );
    for (const [d, r] of i) {
      const g = parseInt(d, 10), f = (o = r.isLocal) != null ? o : !0, h = ae(
        r.collectionName || ""
      ), u = r.collectionId || r.collectionGuid || `temp:${g}:${h}`, N = J({
        collectionName: h,
        collectionId: u,
        isLocal: f,
        modes: r.modes || []
      }, r.collectionGuid && {
        collectionGuid: r.collectionGuid
      });
      n.collectionMap.set(u, g), n.collections[g] = N, de(h) && n.normalizedNameMap.set(h, g), n.nextIndex = Math.max(
        n.nextIndex,
        g + 1
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
const Ot = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, Mt = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function Vt(e) {
  var n;
  const t = e.toUpperCase();
  return (n = Ot[t]) != null ? n : e;
}
function xt(e) {
  var t;
  return typeof e == "number" ? (t = Mt[e]) != null ? t : e.toString() : e;
}
class Ee {
  constructor() {
    ne(this, "variableMap");
    // variableKey -> index
    ne(this, "variables");
    // index -> variable data
    ne(this, "nextIndex");
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
    const i = this.nextIndex++;
    return this.variableMap.set(n, i), this.variables[i] = t, i;
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
    for (const [i, o] of Object.entries(t))
      typeof o == "object" && o !== null && "_varRef" in o && typeof o._varRef == "number" ? n[i] = {
        _varRef: o._varRef
      } : n[i] = o;
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
      const i = this.variables[n], o = this.serializeValuesByMode(
        i.valuesByMode
      ), d = J(J({
        variableName: i.variableName,
        variableType: Vt(i.variableType)
      }, i._colRef !== void 0 && { _colRef: i._colRef }), o && { valuesByMode: o });
      t[String(n)] = d;
    }
    return t;
  }
  /**
   * Reconstructs a VariableTable from a serialized table object
   * Handles both new format (without variableKey) and legacy format (with variableKey)
   * Expands compressed variable types (numbers) back to strings
   */
  static fromTable(t) {
    const n = new Ee(), i = Object.entries(t).sort(
      (o, d) => parseInt(o[0], 10) - parseInt(d[0], 10)
    );
    for (const [o, d] of i) {
      const r = parseInt(o, 10), g = xt(d.variableType), f = ee(J({}, d), {
        variableType: g
        // Always a string after expansion
      });
      n.variables[r] = f, n.nextIndex = Math.max(n.nextIndex, r + 1);
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
function Rt(e) {
  return {
    _varRef: e
  };
}
function pe(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let kt = 0;
const Ne = /* @__PURE__ */ new Map();
function Gt(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const t = Ne.get(e.requestId);
  t && (Ne.delete(e.requestId), e.error || !e.guid ? t.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : t.resolve(e.guid));
}
function je() {
  return new Promise((e, t) => {
    const n = `guid_${Date.now()}_${++kt}`;
    Ne.set(n, { resolve: e, reject: t }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: n
    }), setTimeout(() => {
      Ne.has(n) && (Ne.delete(n), t(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
async function Ce() {
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
    }), await Ce();
  },
  log: async (e) => {
    console.log(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    }), await Ce();
  },
  warning: async (e) => {
    console.warn(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    }), await Ce();
  },
  error: async (e) => {
    console.error(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    }), await Ce();
  }
};
function Lt(e, t) {
  const n = t.modes.find((i) => i.modeId === e);
  return n ? n.name : e;
}
async function et(e, t, n, i, o = /* @__PURE__ */ new Set()) {
  const d = {};
  for (const [r, g] of Object.entries(e)) {
    const f = Lt(r, i);
    if (g == null) {
      d[f] = g;
      continue;
    }
    if (typeof g == "string" || typeof g == "number" || typeof g == "boolean") {
      d[f] = g;
      continue;
    }
    if (typeof g == "object" && g !== null && "type" in g && g.type === "VARIABLE_ALIAS" && "id" in g) {
      const h = g.id;
      if (o.has(h)) {
        d[f] = {
          type: "VARIABLE_ALIAS",
          id: h
        };
        continue;
      }
      const u = await figma.variables.getVariableByIdAsync(h);
      if (!u) {
        d[f] = {
          type: "VARIABLE_ALIAS",
          id: h
        };
        continue;
      }
      const N = new Set(o);
      N.add(h);
      const s = await figma.variables.getVariableCollectionByIdAsync(
        u.variableCollectionId
      ), w = u.key;
      if (!w) {
        d[f] = {
          type: "VARIABLE_ALIAS",
          id: h
        };
        continue;
      }
      const A = {
        variableName: u.name,
        variableType: u.resolvedType,
        collectionName: s == null ? void 0 : s.name,
        collectionId: u.variableCollectionId,
        variableKey: w,
        id: h,
        isLocal: !u.remote
      };
      if (s) {
        const m = await tt(
          s,
          n
        );
        A._colRef = m, u.valuesByMode && (A.valuesByMode = await et(
          u.valuesByMode,
          t,
          n,
          s,
          // Pass collection for mode ID to name conversion
          N
        ));
      }
      const S = t.addVariable(A);
      d[f] = {
        type: "VARIABLE_ALIAS",
        id: h,
        _varRef: S
      };
    } else
      d[f] = g;
  }
  return d;
}
const Se = "recursica:collectionId";
async function _t(e) {
  if (e.remote === !0) {
    const n = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(n)) {
      const o = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await a.error(o), new Error(o);
    }
    return e.id;
  } else {
    if (de(e.name)) {
      const o = Me(e.name);
      if (o) {
        const d = e.getSharedPluginData(
          "recursica",
          Se
        );
        return (!d || d.trim() === "") && e.setSharedPluginData(
          "recursica",
          Se,
          o
        ), o;
      }
    }
    const n = e.getSharedPluginData(
      "recursica",
      Se
    );
    if (n && n.trim() !== "")
      return n;
    const i = await je();
    return e.setSharedPluginData("recursica", Se, i), i;
  }
}
function Bt(e, t) {
  if (t)
    return;
  const n = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(n))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function tt(e, t) {
  const n = !e.remote, i = t.getCollectionIndex(e.id);
  if (i !== -1)
    return i;
  Bt(e.name, n);
  const o = await _t(e), d = e.modes.map((h) => h.name), r = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: n,
    modes: d,
    collectionGuid: o
  }, g = t.addCollection(r), f = n ? "local" : "remote";
  return await a.log(
    `  Added ${f} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), g;
}
async function _e(e, t, n) {
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
    const d = i.key;
    if (!d)
      return console.log("Variable missing key:", e.id), null;
    const r = await tt(
      o,
      n
    ), g = {
      variableName: i.name,
      variableType: i.resolvedType,
      _colRef: r,
      // Reference to collection table (v2.4.0+)
      variableKey: d,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    i.valuesByMode && (g.valuesByMode = await et(
      i.valuesByMode,
      t,
      n,
      o,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const f = t.addVariable(g);
    return Rt(f);
  } catch (i) {
    const o = i instanceof Error ? i.message : String(i);
    throw console.error("Could not resolve variable alias:", e.id, i), new Error(
      `Failed to resolve variable alias ${e.id}: ${o}`
    );
  }
}
async function ye(e, t, n) {
  if (!e || typeof e != "object") return e;
  const i = {};
  for (const o in e)
    if (Object.prototype.hasOwnProperty.call(e, o)) {
      const d = e[o];
      if (d && typeof d == "object" && !Array.isArray(d))
        if (d.type === "VARIABLE_ALIAS") {
          const r = await _e(
            d,
            t,
            n
          );
          r && (i[o] = r);
        } else
          i[o] = await ye(
            d,
            t,
            n
          );
      else Array.isArray(d) ? i[o] = await Promise.all(
        d.map(async (r) => (r == null ? void 0 : r.type) === "VARIABLE_ALIAS" ? await _e(
          r,
          t,
          n
        ) || r : r && typeof r == "object" ? await ye(
          r,
          t,
          n
        ) : r)
      ) : i[o] = d;
    }
  return i;
}
async function at(e, t, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const o = {};
      for (const d in i)
        Object.prototype.hasOwnProperty.call(i, d) && (d === "boundVariables" ? o[d] = await ye(
          i[d],
          t,
          n
        ) : o[d] = i[d]);
      return o;
    })
  );
}
async function nt(e, t, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const o = {};
      for (const d in i)
        Object.prototype.hasOwnProperty.call(i, d) && (d === "boundVariables" ? o[d] = await ye(
          i[d],
          t,
          n
        ) : o[d] = i[d]);
      return o;
    })
  );
}
const $e = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  extractBoundVariables: ye,
  resolveVariableAliasMetadata: _e,
  serializeBackgrounds: nt,
  serializeFills: at
}, Symbol.toStringTag, { value: "Module" }));
async function it(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  if (e.type && (n.type = e.type, i.add("type")), e.id && (n.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (n.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (n.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (n.y = e.y, i.add("y")), e.width !== void 0 && (n.width = e.width, i.add("width")), e.height !== void 0 && (n.height = e.height, i.add("height")), e.visible !== void 0 && z(e.visible, Z.visible) && (n.visible = e.visible, i.add("visible")), e.locked !== void 0 && z(e.locked, Z.locked) && (n.locked = e.locked, i.add("locked")), e.opacity !== void 0 && z(e.opacity, Z.opacity) && (n.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && z(e.rotation, Z.rotation) && (n.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && z(e.blendMode, Z.blendMode) && (n.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && z(e.effects, Z.effects) && (n.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const o = await at(
      e.fills,
      t.variableTable,
      t.collectionTable
    );
    z(o, Z.fills) && (n.fills = o), i.add("fills");
  }
  if (e.strokes !== void 0 && z(e.strokes, Z.strokes) && (n.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && z(e.strokeWeight, Z.strokeWeight) && (n.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && z(e.strokeAlign, Z.strokeAlign) && (n.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const o = await ye(
      e.boundVariables,
      t.variableTable,
      t.collectionTable
    );
    Object.keys(o).length > 0 && (n.boundVariables = o), i.add("boundVariables");
  }
  if (e.backgrounds !== void 0) {
    const o = await nt(
      e.backgrounds,
      t.variableTable,
      t.collectionTable
    );
    o && Array.isArray(o) && o.length > 0 && (n.backgrounds = o), i.add("backgrounds");
  }
  return n;
}
const Ut = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseBaseNodeProperties: it
}, Symbol.toStringTag, { value: "Module" }));
async function Be(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  if (e.type === "COMPONENT")
    try {
      e.componentPropertyDefinitions && (n.componentPropertyDefinitions = e.componentPropertyDefinitions, i.add("componentPropertyDefinitions"));
    } catch (o) {
    }
  return e.layoutMode !== void 0 && z(e.layoutMode, X.layoutMode) && (n.layoutMode = e.layoutMode, i.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && z(
    e.primaryAxisSizingMode,
    X.primaryAxisSizingMode
  ) && (n.primaryAxisSizingMode = e.primaryAxisSizingMode, i.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && z(
    e.counterAxisSizingMode,
    X.counterAxisSizingMode
  ) && (n.counterAxisSizingMode = e.counterAxisSizingMode, i.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && z(
    e.primaryAxisAlignItems,
    X.primaryAxisAlignItems
  ) && (n.primaryAxisAlignItems = e.primaryAxisAlignItems, i.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && z(
    e.counterAxisAlignItems,
    X.counterAxisAlignItems
  ) && (n.counterAxisAlignItems = e.counterAxisAlignItems, i.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && z(e.paddingLeft, X.paddingLeft) && (n.paddingLeft = e.paddingLeft, i.add("paddingLeft")), e.paddingRight !== void 0 && z(e.paddingRight, X.paddingRight) && (n.paddingRight = e.paddingRight, i.add("paddingRight")), e.paddingTop !== void 0 && z(e.paddingTop, X.paddingTop) && (n.paddingTop = e.paddingTop, i.add("paddingTop")), e.paddingBottom !== void 0 && z(e.paddingBottom, X.paddingBottom) && (n.paddingBottom = e.paddingBottom, i.add("paddingBottom")), e.itemSpacing !== void 0 && z(e.itemSpacing, X.itemSpacing) && (n.itemSpacing = e.itemSpacing, i.add("itemSpacing")), e.counterAxisSpacing !== void 0 && z(
    e.counterAxisSpacing,
    X.counterAxisSpacing
  ) && (n.counterAxisSpacing = e.counterAxisSpacing, i.add("counterAxisSpacing")), e.cornerRadius !== void 0 && z(e.cornerRadius, X.cornerRadius) && (n.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.clipsContent !== void 0 && z(e.clipsContent, X.clipsContent) && (n.clipsContent = e.clipsContent, i.add("clipsContent")), e.layoutWrap !== void 0 && z(e.layoutWrap, X.layoutWrap) && (n.layoutWrap = e.layoutWrap, i.add("layoutWrap")), e.layoutGrow !== void 0 && z(e.layoutGrow, X.layoutGrow) && (n.layoutGrow = e.layoutGrow, i.add("layoutGrow")), n;
}
const Ft = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseFrameProperties: Be
}, Symbol.toStringTag, { value: "Module" }));
async function zt(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (n.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (n.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (n.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && z(
    e.textAlignHorizontal,
    oe.textAlignHorizontal
  ) && (n.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && z(
    e.textAlignVertical,
    oe.textAlignVertical
  ) && (n.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && z(e.letterSpacing, oe.letterSpacing) && (n.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && z(e.lineHeight, oe.lineHeight) && (n.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && z(e.textCase, oe.textCase) && (n.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && z(e.textDecoration, oe.textDecoration) && (n.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && z(e.textAutoResize, oe.textAutoResize) && (n.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && z(
    e.paragraphSpacing,
    oe.paragraphSpacing
  ) && (n.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && z(e.paragraphIndent, oe.paragraphIndent) && (n.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && z(e.listOptions, oe.listOptions) && (n.listOptions = e.listOptions, i.add("listOptions")), n;
}
function jt(e) {
  const t = e.match(/^(\d+\.?\d*)[eE]([+-]?\d+)$/);
  if (t) {
    const n = parseFloat(t[1]), i = parseInt(t[2]), o = n * Math.pow(10, i);
    return Math.abs(o) < 1e-10 ? "0" : o.toFixed(6).replace(/\.?0+$/, "") || "0";
  }
  return e;
}
function ot(e) {
  if (!e || typeof e != "string")
    return e;
  let t = e.replace(/(\d+\.?\d*)[eE]([+-]?\d+)/g, (n) => jt(n));
  return t = t.replace(
    /(\d+\.\d{7,})/g,
    // Match numbers with more than 6 decimal places
    (n) => {
      const i = parseFloat(n);
      return Math.abs(i) < 1e-10 ? "0" : i.toFixed(6).replace(/\.?0+$/, "") || "0";
    }
  ), t = t.replace(
    /([MmLlHhVvCcSsQqTtAaZz])([-\d])/g,
    (n, i, o) => `${i} ${o}`
  ), t = t.replace(/\s+/g, " ").trim(), t;
}
function Ue(e) {
  return Array.isArray(e) ? e.map((t) => ({
    data: ot(t.data),
    // Normalize winding rule key (use windRule consistently)
    windRule: t.windRule || t.windingRule || "NONZERO"
  })) : e;
}
const Dt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  normalizeSvgPath: ot,
  normalizeVectorGeometry: Ue
}, Symbol.toStringTag, { value: "Module" }));
async function Jt(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && z(e.fillGeometry, fe.fillGeometry) && (n.fillGeometry = Ue(e.fillGeometry), i.add("fillGeometry")), e.strokeGeometry !== void 0 && z(e.strokeGeometry, fe.strokeGeometry) && (n.strokeGeometry = Ue(e.strokeGeometry), i.add("strokeGeometry")), e.strokeCap !== void 0 && z(e.strokeCap, fe.strokeCap) && (n.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && z(e.strokeJoin, fe.strokeJoin) && (n.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && z(e.dashPattern, fe.dashPattern) && (n.dashPattern = e.dashPattern, i.add("dashPattern")), n;
}
async function Wt(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && z(e.cornerRadius, Qe.cornerRadius) && (n.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (n.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, i.add("pointCount")), n;
}
const Ie = /* @__PURE__ */ new Map();
let Kt = 0;
function Ht() {
  return `prompt_${Date.now()}_${++Kt}`;
}
const be = {
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
    var g;
    const n = typeof t == "number" ? { timeoutMs: t } : t, i = (g = n == null ? void 0 : n.timeoutMs) != null ? g : 3e5, o = n == null ? void 0 : n.okLabel, d = n == null ? void 0 : n.cancelLabel, r = Ht();
    return new Promise((f, h) => {
      const u = i === -1 ? null : setTimeout(() => {
        Ie.delete(r), h(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      Ie.set(r, {
        resolve: f,
        reject: h,
        timeout: u
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: J(J({
          message: e,
          requestId: r
        }, o && { okLabel: o }), d && { cancelLabel: d })
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
    const { requestId: t, action: n } = e, i = Ie.get(t);
    if (!i) {
      console.warn(
        `Received response for unknown prompt request: ${t}`
      );
      return;
    }
    i.timeout && clearTimeout(i.timeout), Ie.delete(t), n === "ok" ? i.resolve() : i.reject(new Error("User cancelled"));
  }
}, qt = "RecursicaPublishedMetadata";
function Le(e) {
  let t = e, n = !1;
  try {
    if (n = t.parent !== null && t.parent !== void 0, !n)
      return { page: null, reason: "detached" };
  } catch (i) {
    return { page: null, reason: "detached" };
  }
  for (; t; ) {
    if (t.type === "PAGE")
      return { page: t, reason: "found" };
    try {
      const i = t.parent;
      if (!i)
        return { page: null, reason: "broken_chain" };
      t = i;
    } catch (i) {
      return { page: null, reason: "access_error" };
    }
  }
  return { page: null, reason: "broken_chain" };
}
function Ye(e) {
  try {
    const t = e.getPluginData(qt);
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
async function Yt(e, t) {
  var o, d;
  const n = {}, i = /* @__PURE__ */ new Set();
  if (n._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const r = await e.getMainComponentAsync();
    if (!r) {
      const P = e.name || "(unnamed)", I = e.id;
      if (t.detachedComponentsHandled.has(I))
        await a.log(
          `Treating detached instance "${P}" as internal instance (already prompted)`
        );
      else {
        await a.warning(
          `Found detached instance: "${P}" (main component is missing)`
        );
        const c = `Found detached instance "${P}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await be.prompt(c, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(I), await a.log(
            `Treating detached instance "${P}" as internal instance`
          );
        } catch (l) {
          if (l instanceof Error && l.message === "User cancelled") {
            const b = `Export cancelled: Detached instance "${P}" found. Please fix the instance before exporting.`;
            await a.error(b);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch (C) {
              console.warn("Could not scroll to instance:", C);
            }
            throw new Error(b);
          } else
            throw l;
        }
      }
      if (!Le(e).page) {
        const c = `Detached instance "${P}" is not on any page. Cannot export.`;
        throw await a.error(c), new Error(c);
      }
      let T, G;
      try {
        e.variantProperties && (T = e.variantProperties), e.componentProperties && (G = e.componentProperties);
      } catch (c) {
      }
      const p = J(J({
        instanceType: "internal",
        componentName: P,
        componentNodeId: e.id
      }, T && { variantProperties: T }), G && { componentProperties: G }), y = t.instanceTable.addInstance(p);
      return n._instanceRef = y, i.add("_instanceRef"), await a.log(
        `  Exported detached INSTANCE: "${P}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), n;
    }
    const g = e.name || "(unnamed)", f = r.name || "(unnamed)", h = r.remote === !0, N = Le(e).page, s = Le(r);
    let w = s.page;
    if (!w && h)
      try {
        await figma.loadAllPagesAsync();
        const P = figma.root.children;
        let I = null;
        for (const v of P)
          try {
            if (v.findOne(
              (T) => T.id === r.id
            )) {
              I = v;
              break;
            }
          } catch (x) {
          }
        if (!I) {
          const v = r.id.split(":")[0];
          for (const x of P) {
            const T = x.id.split(":")[0];
            if (v === T) {
              I = x;
              break;
            }
          }
        }
        I && (w = I);
      } catch (P) {
      }
    let A, S = w;
    if (h)
      if (w) {
        const P = Ye(w);
        A = "normal", S = w, P != null && P.id ? await a.log(
          `  Component "${f}" is from library but also exists on local page "${w.name}" with metadata. Treating as "normal" instance.`
        ) : await a.log(
          `  Component "${f}" is from library and exists on local page "${w.name}" (no metadata). Treating as "normal" instance - page should be published first.`
        );
      } else
        A = "remote", await a.log(
          `  Component "${f}" is from library and not on a local page. Treating as "remote" instance.`
        );
    else if (w && N && w.id === N.id)
      A = "internal";
    else if (w && N && w.id !== N.id)
      A = "normal";
    else if (w && !N)
      A = "normal";
    else if (!h && s.reason === "detached") {
      const P = r.id;
      if (t.detachedComponentsHandled.has(P))
        A = "remote", await a.log(
          `Treating detached instance "${g}" -> component "${f}" as remote instance (already prompted)`
        );
      else {
        await a.warning(
          `Found detached instance: "${g}" -> component "${f}" (component is not on any page)`
        );
        try {
          await figma.viewport.scrollAndZoomIntoView([r]);
        } catch (v) {
          console.warn("Could not scroll to component:", v);
        }
        const I = `Found detached instance "${g}" attached to component "${f}". This should be fixed. Continue to publish?`;
        try {
          await be.prompt(I, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(P), A = "remote", await a.log(
            `Treating detached instance "${g}" as remote instance (will be created on REMOTES page)`
          );
        } catch (v) {
          if (v instanceof Error && v.message === "User cancelled") {
            const x = `Export cancelled: Detached instance "${g}" found. The component "${f}" is not on any page. Please fix the instance before exporting.`;
            throw await a.error(x), new Error(x);
          } else
            throw v;
        }
      }
    } else
      h || await a.warning(
        `  Instance "${g}" -> component "${f}": componentPage is null but component is not remote. Reason: ${s.reason}. Cannot determine instance type.`
      ), A = "normal";
    let m, M;
    try {
      if (e.variantProperties && (m = e.variantProperties, await a.log(
        `  Instance "${g}" -> variantProperties from instance: ${JSON.stringify(m)}`
      )), typeof e.getProperties == "function")
        try {
          const P = await e.getProperties();
          P && P.variantProperties && (await a.log(
            `  Instance "${g}" -> variantProperties from getProperties(): ${JSON.stringify(P.variantProperties)}`
          ), P.variantProperties && Object.keys(P.variantProperties).length > 0 && (m = P.variantProperties));
        } catch (P) {
          await a.log(
            `  Instance "${g}" -> getProperties() not available or failed: ${P}`
          );
        }
      if (e.componentProperties && (M = e.componentProperties), r.parent && r.parent.type === "COMPONENT_SET") {
        const P = r.parent;
        try {
          const I = P.componentPropertyDefinitions;
          I && await a.log(
            `  Component set "${P.name}" has property definitions: ${JSON.stringify(Object.keys(I))}`
          );
          const v = {}, x = f.split(",").map((T) => T.trim());
          for (const T of x) {
            const G = T.split("=").map((p) => p.trim());
            if (G.length >= 2) {
              const p = G[0], y = G.slice(1).join("=").trim();
              I && I[p] && (v[p] = y);
            }
          }
          if (Object.keys(v).length > 0 && await a.log(
            `  Parsed variant properties from component name "${f}": ${JSON.stringify(v)}`
          ), m && Object.keys(m).length > 0)
            await a.log(
              `  Using variant properties from instance (source of truth): ${JSON.stringify(m)}`
            );
          else if (Object.keys(v).length > 0)
            m = v, await a.log(
              `  Using variant properties from component name (fallback): ${JSON.stringify(m)}`
            );
          else if (r.variantProperties) {
            const T = r.variantProperties;
            await a.log(
              `  Main component "${f}" has variantProperties: ${JSON.stringify(T)}`
            ), m = T;
          }
        } catch (I) {
          await a.warning(
            `  Could not get variant properties from component set: ${I}`
          );
        }
      }
    } catch (P) {
    }
    let E, R;
    try {
      let P = r.parent;
      const I = [];
      let v = 0;
      const x = 20;
      for (; P && v < x; )
        try {
          const T = P.type, G = P.name;
          if (T === "COMPONENT_SET" && !R && (R = G), T === "PAGE")
            break;
          const p = G || "";
          I.unshift(p), (R === "arrow-top-right-on-square" || f === "arrow-top-right-on-square") && await a.log(
            `  [PATH BUILD] Added segment: "${p}" (type: ${T}) to path for component "${f}"`
          ), P = P.parent, v++;
        } catch (T) {
          (R === "arrow-top-right-on-square" || f === "arrow-top-right-on-square") && await a.warning(
            `  [PATH BUILD] Error building path for "${f}": ${T}`
          );
          break;
        }
      E = I, (R === "arrow-top-right-on-square" || f === "arrow-top-right-on-square") && await a.log(
        `  [PATH BUILD] Final path for component "${f}": [${I.join(" → ")}]`
      );
    } catch (P) {
    }
    const V = J(J(J(J({
      instanceType: A,
      componentName: f
    }, R && { componentSetName: R }), m && { variantProperties: m }), M && { componentProperties: M }), A === "normal" ? { path: E || [] } : E && E.length > 0 && {
      path: E
    });
    if (A === "internal") {
      V.componentNodeId = r.id, await a.log(
        `  Found INSTANCE: "${g}" -> INTERNAL component "${f}" (ID: ${r.id.substring(0, 8)}...)`
      );
      const P = e.boundVariables, I = r.boundVariables;
      if (P && typeof P == "object") {
        const p = Object.keys(P);
        await a.log(
          `  DEBUG: Internal instance "${g}" -> boundVariables keys: ${p.length > 0 ? p.join(", ") : "none"}`
        );
        for (const c of p) {
          const l = P[c], b = (l == null ? void 0 : l.type) || typeof l;
          await a.log(
            `  DEBUG:   boundVariables.${c}: type=${b}, value=${JSON.stringify(l)}`
          );
        }
        const y = [
          "backgrounds",
          "selectionColor",
          "selectionColors",
          "selection",
          "selectColor"
        ];
        for (const c of y)
          P[c] !== void 0 && await a.log(
            `  DEBUG:   Found potential "Selection colors" property: boundVariables.${c} = ${JSON.stringify(P[c])}`
          );
      } else
        await a.log(
          `  DEBUG: Internal instance "${g}" -> No boundVariables found on instance node`
        );
      if (I && typeof I == "object") {
        const p = Object.keys(I);
        await a.log(
          `  DEBUG: Main component "${f}" -> boundVariables keys: ${p.length > 0 ? p.join(", ") : "none"}`
        );
      }
      const v = e.backgrounds;
      if (v && Array.isArray(v)) {
        await a.log(
          `  DEBUG: Internal instance "${g}" -> backgrounds array length: ${v.length}`
        );
        for (let p = 0; p < v.length; p++) {
          const y = v[p];
          if (y && typeof y == "object") {
            if (await a.log(
              `  DEBUG:   backgrounds[${p}] structure: ${JSON.stringify(Object.keys(y))}`
            ), y.boundVariables) {
              const c = Object.keys(y.boundVariables);
              await a.log(
                `  DEBUG:   backgrounds[${p}].boundVariables keys: ${c.length > 0 ? c.join(", ") : "none"}`
              );
              for (const l of c) {
                const b = y.boundVariables[l];
                await a.log(
                  `  DEBUG:     backgrounds[${p}].boundVariables.${l}: ${JSON.stringify(b)}`
                );
              }
            }
            y.color && await a.log(
              `  DEBUG:   backgrounds[${p}].color: ${JSON.stringify(y.color)}`
            );
          }
        }
      }
      const x = Object.keys(e).filter(
        (p) => !p.startsWith("_") && p !== "parent" && p !== "removed" && typeof e[p] != "function" && p !== "type" && p !== "id" && p !== "name" && p !== "boundVariables" && p !== "backgrounds" && p !== "fills"
      ), T = Object.keys(r).filter(
        (p) => !p.startsWith("_") && p !== "parent" && p !== "removed" && typeof r[p] != "function" && p !== "type" && p !== "id" && p !== "name" && p !== "boundVariables" && p !== "backgrounds" && p !== "fills"
      ), G = [
        .../* @__PURE__ */ new Set([...x, ...T])
      ].filter(
        (p) => p.toLowerCase().includes("selection") || p.toLowerCase().includes("select") || p.toLowerCase().includes("color") && !p.toLowerCase().includes("fill") && !p.toLowerCase().includes("stroke")
      );
      if (G.length > 0) {
        await a.log(
          `  DEBUG: Found selection/color-related properties: ${G.join(", ")}`
        );
        for (const p of G)
          try {
            if (x.includes(p)) {
              const y = e[p];
              await a.log(
                `  DEBUG:   Instance.${p}: ${JSON.stringify(y)}`
              );
            }
            if (T.includes(p)) {
              const y = r[p];
              await a.log(
                `  DEBUG:   MainComponent.${p}: ${JSON.stringify(y)}`
              );
            }
          } catch (y) {
          }
      } else
        await a.log(
          "  DEBUG: No selection/color-related properties found on instance or main component"
        );
    } else if (A === "normal") {
      const P = S || w;
      if (P) {
        V.componentPageName = P.name;
        const v = Ye(P);
        v != null && v.id && v.version !== void 0 ? (V.componentGuid = v.id, V.componentVersion = v.version, await a.log(
          `  Found INSTANCE: "${g}" -> NORMAL component "${f}" (ID: ${r.id.substring(0, 8)}...) at path [${(E || []).join(" → ")}]`
        )) : await a.warning(
          `  Instance "${g}" -> component "${f}" is classified as normal but page "${P.name}" has no metadata. This instance will not be importable.`
        );
      } else {
        const v = r.id;
        let x = "", T = "";
        switch (s.reason) {
          case "broken_chain":
            x = "The component's parent chain is broken and cannot be traversed to find the page", T = "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            x = "Cannot access the component's parent chain (access error)", T = "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            x = "Cannot determine which page the component is on", T = "Please ensure the component is properly placed on a page.";
        }
        try {
          await figma.viewport.scrollAndZoomIntoView([r]);
        } catch (y) {
          console.warn("Could not scroll to component:", y);
        }
        const G = `Normal instance "${g}" -> component "${f}" (ID: ${v}) has no componentPage. ${x}. ${T} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", G), await a.error(G);
        const p = new Error(G);
        throw console.error("Throwing error:", p), p;
      }
      E === void 0 && console.warn(
        `Failed to build path for normal instance "${g}" -> component "${f}". Path is required for resolution.`
      );
      const I = E && E.length > 0 ? ` at path [${E.join(" → ")}]` : " at page root";
      await a.log(
        `  Found INSTANCE: "${g}" -> NORMAL component "${f}" (ID: ${r.id.substring(0, 8)}...)${I}`
      );
    } else if (A === "remote") {
      let P, I;
      const v = t.detachedComponentsHandled.has(
        r.id
      );
      if (!v)
        try {
          if (typeof r.getPublishStatusAsync == "function")
            try {
              const T = await r.getPublishStatusAsync();
              T && typeof T == "object" && (T.libraryName && (P = T.libraryName), T.libraryKey && (I = T.libraryKey));
            } catch (T) {
            }
          try {
            const T = figma.teamLibrary;
            if (typeof (T == null ? void 0 : T.getAvailableLibraryComponentSetsAsync) == "function") {
              const G = await T.getAvailableLibraryComponentSetsAsync();
              if (G && Array.isArray(G)) {
                for (const p of G)
                  if (p.key === r.key || p.name === r.name) {
                    p.libraryName && (P = p.libraryName), p.libraryKey && (I = p.libraryKey);
                    break;
                  }
              }
            }
          } catch (T) {
          }
        } catch (T) {
          console.warn(
            `Error getting library info for remote component "${f}":`,
            T
          );
        }
      if (P && (V.remoteLibraryName = P), I && (V.remoteLibraryKey = I), v && (V.componentNodeId = r.id), t.instanceTable.getInstanceIndex(V) !== -1)
        await a.log(
          `  Found INSTANCE: "${g}" -> REMOTE component "${f}" (ID: ${r.id.substring(0, 8)}...)${v ? " [DETACHED]" : ""}`
        );
      else
        try {
          const { parseBaseNodeProperties: T } = await Promise.resolve().then(() => Ut), G = await T(e, t), { parseFrameProperties: p } = await Promise.resolve().then(() => Ft), y = await p(e, t), c = ee(J(J({}, G), y), {
            type: "COMPONENT"
            // Convert to COMPONENT type for recreation (must be after baseProps to override)
          });
          if (e.children && Array.isArray(e.children) && e.children.length > 0) {
            const l = ee(J({}, t), {
              depth: (t.depth || 0) + 1
            }), { extractNodeData: b } = await Promise.resolve().then(() => ta), C = [];
            for (const $ of e.children)
              try {
                let O;
                if ($.type === "INSTANCE")
                  try {
                    const L = await $.getMainComponentAsync();
                    if (L) {
                      const k = await T(
                        $,
                        t
                      ), U = await p(
                        $,
                        t
                      ), D = await b(
                        L,
                        /* @__PURE__ */ new WeakSet(),
                        l
                      );
                      O = ee(J(J(J({}, D), k), U), {
                        type: "COMPONENT"
                        // Convert to COMPONENT
                      });
                    } else
                      O = await b(
                        $,
                        /* @__PURE__ */ new WeakSet(),
                        l
                      ), O.type === "INSTANCE" && (O.type = "COMPONENT"), delete O._instanceRef;
                  } catch (L) {
                    O = await b(
                      $,
                      /* @__PURE__ */ new WeakSet(),
                      l
                    ), O.type === "INSTANCE" && (O.type = "COMPONENT"), delete O._instanceRef;
                  }
                else {
                  O = await b(
                    $,
                    /* @__PURE__ */ new WeakSet(),
                    l
                  );
                  const L = $.boundVariables;
                  if (L && typeof L == "object") {
                    const k = Object.keys(L);
                    k.length > 0 && (await a.log(
                      `  DEBUG: Child "${$.name || "Unnamed"}" -> boundVariables keys: ${k.join(", ")}`
                    ), L.backgrounds !== void 0 && await a.log(
                      `  DEBUG:   Child "${$.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(L.backgrounds)}`
                    ));
                  }
                  if (r.children && Array.isArray(r.children)) {
                    const k = r.children.find(
                      (U) => U.name === $.name
                    );
                    if (k) {
                      const U = k.boundVariables;
                      if (U && typeof U == "object") {
                        const D = Object.keys(U);
                        if (D.length > 0 && (await a.log(
                          `  DEBUG: Main component child "${k.name || "Unnamed"}" -> boundVariables keys: ${D.join(", ")}`
                        ), U.backgrounds !== void 0 && (await a.log(
                          `  DEBUG:   Main component child "${k.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(U.backgrounds)}`
                        ), !L || !L.backgrounds))) {
                          await a.log(
                            "  DEBUG:   Instance child doesn't have boundVariables.backgrounds, but main component child does - preserving from main component"
                          );
                          const { extractBoundVariables: K } = await Promise.resolve().then(() => $e), W = await K(
                            U,
                            t.variableTable,
                            t.collectionTable
                          );
                          O.boundVariables || (O.boundVariables = {}), W.backgrounds && (O.boundVariables.backgrounds = W.backgrounds, await a.log(
                            "  DEBUG:   ✓ Added boundVariables.backgrounds to childData from main component child"
                          ));
                        }
                      }
                    }
                  }
                }
                C.push(O);
              } catch (O) {
                console.warn(
                  `Failed to extract child "${$.name || "Unnamed"}" for remote component "${f}":`,
                  O
                );
              }
            c.children = C;
          }
          if (!c)
            throw new Error("Failed to build structure for remote instance");
          try {
            const l = e.boundVariables;
            if (l && typeof l == "object") {
              const B = Object.keys(l);
              await a.log(
                `  DEBUG: Instance "${g}" -> boundVariables keys: ${B.length > 0 ? B.join(", ") : "none"}`
              );
              for (const j of B) {
                const H = l[j], $t = (H == null ? void 0 : H.type) || typeof H;
                if (await a.log(
                  `  DEBUG:   boundVariables.${j}: type=${$t}, value=${JSON.stringify(H)}`
                ), H && typeof H == "object" && !Array.isArray(H)) {
                  const ke = Object.keys(H);
                  if (ke.length > 0) {
                    await a.log(
                      `  DEBUG:     boundVariables.${j} has nested keys: ${ke.join(", ")}`
                    );
                    for (const He of ke) {
                      const Pe = H[He];
                      Pe && typeof Pe == "object" && Pe.type === "VARIABLE_ALIAS" && await a.log(
                        `  DEBUG:       boundVariables.${j}.${He}: VARIABLE_ALIAS id=${Pe.id}`
                      );
                    }
                  }
                }
              }
              const F = [
                "backgrounds",
                "selectionColor",
                "selectionColors",
                "selection",
                "selectColor"
              ];
              for (const j of F)
                l[j] !== void 0 && await a.log(
                  `  DEBUG:   Found potential "Selection colors" property: boundVariables.${j} = ${JSON.stringify(l[j])}`
                );
            } else
              await a.log(
                `  DEBUG: Instance "${g}" -> No boundVariables found on instance node`
              );
            const b = l && l.fills !== void 0 && l.fills !== null, C = c.fills !== void 0 && Array.isArray(c.fills) && c.fills.length > 0, $ = e.fills !== void 0 && Array.isArray(e.fills) && e.fills.length > 0, O = r.fills !== void 0 && Array.isArray(r.fills) && r.fills.length > 0;
            if (await a.log(
              `  DEBUG: Instance "${g}" -> fills check: instanceHasFills=${$}, structureHasFills=${C}, mainComponentHasFills=${O}, hasInstanceFillsBoundVar=${!!b}`
            ), b && !C) {
              await a.log(
                "  DEBUG: Instance has boundVariables.fills but structure has no fills - attempting to get fills"
              );
              try {
                if ($) {
                  const { serializeFills: B } = await Promise.resolve().then(() => $e), F = await B(
                    e.fills,
                    t.variableTable,
                    t.collectionTable
                  );
                  c.fills = F, await a.log(
                    `  DEBUG: Got ${F.length} fill(s) from instance node`
                  );
                } else if (O) {
                  const { serializeFills: B } = await Promise.resolve().then(() => $e), F = await B(
                    r.fills,
                    t.variableTable,
                    t.collectionTable
                  );
                  c.fills = F, await a.log(
                    `  DEBUG: Got ${F.length} fill(s) from main component`
                  );
                } else
                  await a.warning(
                    "  DEBUG: Instance has boundVariables.fills but neither instance nor main component has fills"
                  );
              } catch (B) {
                await a.warning(
                  `  Failed to get fills: ${B}`
                );
              }
            }
            const L = e.selectionColor, k = r.selectionColor;
            L !== void 0 && await a.log(
              `  DEBUG: Instance "${g}" -> selectionColor: ${JSON.stringify(L)}`
            ), k !== void 0 && await a.log(
              `  DEBUG: Main component "${f}" -> selectionColor: ${JSON.stringify(k)}`
            );
            const U = Object.keys(e).filter(
              (B) => !B.startsWith("_") && B !== "parent" && B !== "removed" && typeof e[B] != "function" && B !== "type" && B !== "id" && B !== "name"
            ), D = Object.keys(r).filter(
              (B) => !B.startsWith("_") && B !== "parent" && B !== "removed" && typeof r[B] != "function" && B !== "type" && B !== "id" && B !== "name"
            ), K = [
              .../* @__PURE__ */ new Set([...U, ...D])
            ].filter(
              (B) => B.toLowerCase().includes("selection") || B.toLowerCase().includes("select") || B.toLowerCase().includes("color") && !B.toLowerCase().includes("fill") && !B.toLowerCase().includes("stroke")
            );
            if (K.length > 0) {
              await a.log(
                `  DEBUG: Found selection/color-related properties: ${K.join(", ")}`
              );
              for (const B of K)
                try {
                  if (U.includes(B)) {
                    const F = e[B];
                    await a.log(
                      `  DEBUG:   Instance.${B}: ${JSON.stringify(F)}`
                    );
                  }
                  if (D.includes(B)) {
                    const F = r[B];
                    await a.log(
                      `  DEBUG:   MainComponent.${B}: ${JSON.stringify(F)}`
                    );
                  }
                } catch (F) {
                }
            } else
              await a.log(
                "  DEBUG: No selection/color-related properties found on instance or main component"
              );
            const W = r.boundVariables;
            if (W && typeof W == "object") {
              const B = Object.keys(W);
              if (B.length > 0) {
                await a.log(
                  `  DEBUG: Main component "${f}" -> boundVariables keys: ${B.join(", ")}`
                );
                for (const F of B) {
                  const j = W[F], H = (j == null ? void 0 : j.type) || typeof j;
                  await a.log(
                    `  DEBUG:   Main component boundVariables.${F}: type=${H}, value=${JSON.stringify(j)}`
                  );
                }
              }
            }
            if (l && Object.keys(l).length > 0) {
              await a.log(
                `  DEBUG: Preserving instance's boundVariables in structure (${Object.keys(l).length} key(s))`
              );
              const { extractBoundVariables: B } = await Promise.resolve().then(() => $e), F = await B(
                l,
                t.variableTable,
                t.collectionTable
              );
              c.boundVariables || (c.boundVariables = {});
              for (const [j, H] of Object.entries(
                F
              ))
                H !== void 0 && (c.boundVariables[j] !== void 0 && await a.log(
                  `  DEBUG: Structure already has boundVariables.${j} from baseProps, but instance also has it - using instance's boundVariables.${j}`
                ), c.boundVariables[j] = H, await a.log(
                  `  DEBUG: Set boundVariables.${j} in structure: ${JSON.stringify(H)}`
                ));
              F.fills !== void 0 ? await a.log(
                "  DEBUG: ✓ Preserved boundVariables.fills from instance"
              ) : b && await a.warning(
                "  DEBUG: Instance has boundVariables.fills but extractBoundVariables didn't extract it"
              ), F.backgrounds !== void 0 ? await a.log(
                `  DEBUG: ✓ Preserved boundVariables.backgrounds from instance: ${JSON.stringify(F.backgrounds)}`
              ) : l && l.backgrounds !== void 0 && await a.warning(
                "  DEBUG: Instance has boundVariables.backgrounds but extractBoundVariables didn't extract it"
              );
            }
            if (W && Object.keys(W).length > 0) {
              await a.log(
                `  DEBUG: Checking main component's boundVariables for properties not in instance (${Object.keys(W).length} key(s))`
              );
              const { extractBoundVariables: B } = await Promise.resolve().then(() => $e), F = await B(
                W,
                t.variableTable,
                t.collectionTable
              );
              c.boundVariables || (c.boundVariables = {});
              for (const [j, H] of Object.entries(
                F
              ))
                H !== void 0 && (c.boundVariables[j] === void 0 ? (c.boundVariables[j] = H, await a.log(
                  `  DEBUG: Added boundVariables.${j} from main component (not in instance): ${JSON.stringify(H)}`
                )) : await a.log(
                  `  DEBUG: Skipped boundVariables.${j} from main component (instance already has it)`
                ));
            }
            await a.log(
              `  DEBUG: Final structure for "${f}": hasFills=${!!c.fills}, fillsCount=${((o = c.fills) == null ? void 0 : o.length) || 0}, hasBoundVars=${!!c.boundVariables}, boundVarsKeys=${c.boundVariables ? Object.keys(c.boundVariables).join(", ") : "none"}`
            ), (d = c.boundVariables) != null && d.fills && await a.log(
              `  DEBUG: Structure boundVariables.fills: ${JSON.stringify(c.boundVariables.fills)}`
            );
          } catch (l) {
            await a.warning(
              `  Failed to handle bound variables for fills: ${l}`
            );
          }
          V.structure = c, v ? await a.log(
            `  Extracted structure for detached component "${f}" (ID: ${r.id.substring(0, 8)}...)`
          ) : await a.log(
            `  Extracted structure from instance for remote component "${f}" (preserving size overrides: ${e.width}x${e.height})`
          ), await a.log(
            `  Found INSTANCE: "${g}" -> REMOTE component "${f}" (ID: ${r.id.substring(0, 8)}...)${v ? " [DETACHED]" : ""}`
          );
        } catch (T) {
          const G = `Failed to extract structure for remote component "${f}": ${T instanceof Error ? T.message : String(T)}`;
          console.error(G, T), await a.error(G);
        }
    }
    const _ = t.instanceTable.addInstance(V);
    n._instanceRef = _, i.add("_instanceRef");
  }
  return n;
}
class Ae {
  constructor() {
    ne(this, "instanceMap");
    // unique key -> index
    ne(this, "instances");
    // index -> instance data
    ne(this, "nextIndex");
    this.instanceMap = /* @__PURE__ */ new Map(), this.instances = [], this.nextIndex = 0;
  }
  /**
   * Generates a unique key for an instance based on its type
   */
  generateKey(t) {
    if (t.instanceType === "internal" && t.componentNodeId) {
      const n = t.variantProperties ? `:${JSON.stringify(t.variantProperties)}` : "";
      return `internal:${t.componentNodeId}${n}`;
    } else {
      if (t.instanceType === "normal" && t.componentGuid && t.componentVersion !== void 0)
        return `normal:${t.componentGuid}:${t.componentVersion}`;
      if (t.instanceType === "remote" && t.remoteLibraryKey)
        return `remote:${t.remoteLibraryKey}:${t.componentName}`;
      if (t.instanceType === "remote" && t.componentNodeId)
        return `remote:detached:${t.componentNodeId}`;
    }
    return t.instanceType === "remote" ? `remote:${t.componentName}:COMPONENT` : `${t.instanceType}:${t.componentName}:COMPONENT`;
  }
  /**
   * Adds an instance to the table if it doesn't already exist
   * Returns the index of the instance (existing or newly added)
   */
  addInstance(t) {
    const n = this.generateKey(t);
    if (this.instanceMap.has(n))
      return this.instanceMap.get(n);
    const i = this.nextIndex++;
    return this.instanceMap.set(n, i), this.instances[i] = t, i;
  }
  /**
   * Gets the index of an instance by its unique key
   * Returns -1 if not found
   */
  getInstanceIndex(t) {
    var i;
    const n = this.generateKey(t);
    return (i = this.instanceMap.get(n)) != null ? i : -1;
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
    const n = new Ae(), i = Object.entries(t).sort(
      (o, d) => parseInt(o[0], 10) - parseInt(d[0], 10)
    );
    for (const [o, d] of i) {
      const r = parseInt(o, 10), g = n.generateKey(d);
      n.instanceMap.set(g, r), n.instances[r] = d, n.nextIndex = Math.max(n.nextIndex, r + 1);
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
const rt = {
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
function Xt() {
  const e = {};
  for (const [t, n] of Object.entries(rt))
    e[n] = t;
  return e;
}
function Xe(e) {
  var t;
  return (t = rt[e]) != null ? t : e;
}
function Zt(e) {
  var t;
  return typeof e == "number" ? (t = Xt()[e]) != null ? t : e.toString() : e;
}
const st = {
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
  libraryName: "libNm"
  // Different from remoteLibraryName (rLibN)
}, Fe = {};
for (const [e, t] of Object.entries(st))
  Fe[t] = e;
class Ve {
  constructor() {
    ne(this, "shortToLong");
    ne(this, "longToShort");
    this.shortToLong = J({}, Fe), this.longToShort = J({}, st);
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
      const n = {}, i = /* @__PURE__ */ new Set();
      for (const o of Object.keys(t))
        i.add(o);
      for (const [o, d] of Object.entries(t)) {
        const r = this.getShortName(o);
        if (r !== o && !i.has(r)) {
          let g = this.compressObject(d);
          r === "type" && typeof g == "string" && (g = Xe(g)), n[r] = g;
        } else {
          let g = this.compressObject(d);
          o === "type" && typeof g == "string" && (g = Xe(g)), n[o] = g;
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
      for (const [i, o] of Object.entries(t)) {
        const d = this.getLongName(i);
        let r = this.expandObject(o);
        (d === "type" || i === "type") && (typeof r == "number" || typeof r == "string") && (r = Zt(r)), n[d] = r;
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
    return J({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(t) {
    const n = new Ve();
    n.shortToLong = J(J({}, Fe), t), n.longToShort = {};
    for (const [i, o] of Object.entries(
      n.shortToLong
    ))
      n.longToShort[o] = i;
    return n;
  }
}
function Qt(e, t) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const n = {};
  e.metadata && (n.metadata = e.metadata);
  for (const [i, o] of Object.entries(e))
    i !== "metadata" && (n[i] = t.compressObject(o));
  return n;
}
function ea(e, t) {
  return t.expandObject(e);
}
function Oe(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
function xe(e) {
  let t = 1;
  return e.children && e.children.length > 0 && e.children.forEach((n) => {
    t += xe(n);
  }), t;
}
async function Re(e, t = /* @__PURE__ */ new WeakSet(), n = {}) {
  var w, A, S, m, M, E, R;
  if (!e || typeof e != "object")
    return e;
  const i = (w = n.maxNodes) != null ? w : 1e4, o = (A = n.nodeCount) != null ? A : 0;
  if (o >= i)
    return await a.warning(
      `Maximum node count (${i}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: o
    };
  const d = {
    visited: (S = n.visited) != null ? S : /* @__PURE__ */ new WeakSet(),
    depth: (m = n.depth) != null ? m : 0,
    maxDepth: (M = n.maxDepth) != null ? M : 100,
    nodeCount: o + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: n.variableTable,
    collectionTable: n.collectionTable,
    instanceTable: n.instanceTable,
    detachedComponentsHandled: (E = n.detachedComponentsHandled) != null ? E : /* @__PURE__ */ new Set(),
    exportedIds: (R = n.exportedIds) != null ? R : /* @__PURE__ */ new Map()
  };
  if (t.has(e))
    return "[Circular Reference]";
  t.add(e), d.visited = t;
  const r = {}, g = await it(e, d);
  if (Object.assign(r, g), r.id && d.exportedIds) {
    const V = d.exportedIds.get(r.id);
    if (V !== void 0) {
      const _ = r.name || "Unnamed";
      if (V !== _) {
        const P = `Duplicate ID detected during export: ID "${r.id.substring(0, 8)}..." is used by both "${V}" and "${_}". Each node must have a unique ID.`;
        throw await a.error(P), new Error(P);
      }
      await a.warning(
        `Node "${_}" (ID: ${r.id.substring(0, 8)}...) was encountered multiple times during export. This may indicate a structural issue.`
      );
    } else
      d.exportedIds.set(r.id, r.name || "Unnamed");
  }
  const f = e.type;
  if (f)
    switch (f) {
      case "FRAME":
      case "COMPONENT": {
        const V = await Be(e);
        Object.assign(r, V);
        break;
      }
      case "INSTANCE": {
        const V = await Yt(
          e,
          d
        );
        Object.assign(r, V);
        const _ = await Be(
          e
        );
        Object.assign(r, _);
        break;
      }
      case "TEXT": {
        const V = await zt(e);
        Object.assign(r, V);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const V = await Jt(e);
        Object.assign(r, V);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const V = await Wt(e);
        Object.assign(r, V);
        break;
      }
      default:
        d.unhandledKeys.add("_unknownType");
        break;
    }
  const h = Object.getOwnPropertyNames(e), u = /* @__PURE__ */ new Set([
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
  (f === "FRAME" || f === "COMPONENT" || f === "INSTANCE") && (u.add("layoutMode"), u.add("primaryAxisSizingMode"), u.add("counterAxisSizingMode"), u.add("primaryAxisAlignItems"), u.add("counterAxisAlignItems"), u.add("paddingLeft"), u.add("paddingRight"), u.add("paddingTop"), u.add("paddingBottom"), u.add("itemSpacing"), u.add("counterAxisSpacing"), u.add("cornerRadius"), u.add("clipsContent"), u.add("layoutWrap"), u.add("layoutGrow")), f === "TEXT" && (u.add("characters"), u.add("fontName"), u.add("fontSize"), u.add("textAlignHorizontal"), u.add("textAlignVertical"), u.add("letterSpacing"), u.add("lineHeight"), u.add("textCase"), u.add("textDecoration"), u.add("textAutoResize"), u.add("paragraphSpacing"), u.add("paragraphIndent"), u.add("listOptions")), (f === "VECTOR" || f === "LINE") && (u.add("fillGeometry"), u.add("strokeGeometry")), (f === "RECTANGLE" || f === "ELLIPSE" || f === "STAR" || f === "POLYGON") && (u.add("pointCount"), u.add("innerRadius"), u.add("arcData")), f === "INSTANCE" && (u.add("mainComponent"), u.add("componentProperties"));
  for (const V of h)
    typeof e[V] != "function" && (u.has(V) || d.unhandledKeys.add(V));
  d.unhandledKeys.size > 0 && (r._unhandledKeys = Array.from(d.unhandledKeys).sort());
  const N = r._instanceRef !== void 0 && d.instanceTable && f === "INSTANCE";
  let s = !1;
  if (N) {
    const V = d.instanceTable.getInstanceByIndex(
      r._instanceRef
    );
    V && V.instanceType === "normal" && (s = !0, await a.log(
      `  Skipping children extraction for normal instance "${r.name || "Unnamed"}" - will be resolved from referenced component`
    ));
  }
  if (!s && e.children && Array.isArray(e.children)) {
    const V = d.maxDepth;
    if (d.depth >= V)
      r.children = {
        _truncated: !0,
        _reason: `Maximum depth (${V}) reached`,
        _count: e.children.length
      };
    else if (d.nodeCount >= i)
      r.children = {
        _truncated: !0,
        _reason: `Maximum node count (${i}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const _ = ee(J({}, d), {
        depth: d.depth + 1
      }), P = [];
      let I = !1;
      for (const v of e.children) {
        if (_.nodeCount >= i) {
          r.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: P.length,
            _total: e.children.length,
            children: P
          }, I = !0;
          break;
        }
        const x = await Re(v, t, _);
        P.push(x), _.nodeCount && (d.nodeCount = _.nodeCount);
      }
      I || (r.children = P);
    }
  }
  return r;
}
async function De(e, t = /* @__PURE__ */ new Set(), n = !1) {
  n || (await a.clear(), await a.log("=== Starting Page Export ==="));
  try {
    const i = e.pageIndex;
    if (i === void 0 || typeof i != "number")
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
    if (await a.log(`Loaded ${o.length} page(s)`), i < 0 || i >= o.length)
      return await a.error(
        `Invalid page index: ${i} (valid range: 0-${o.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const d = o[i], r = d.id;
    if (t.has(r))
      return await a.log(
        `Page "${d.name}" has already been processed, skipping...`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Page already processed",
        data: {}
      };
    t.add(r), await a.log(
      `Selected page: "${d.name}" (index: ${i})`
    ), await a.log(
      "Initializing variable, collection, and instance tables..."
    );
    const g = new Ee(), f = new ve(), h = new Ae();
    await a.log("Extracting node data from page..."), await a.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await a.log(
      "Collections will be discovered as variables are processed:"
    );
    const u = await Re(
      d,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: g,
        collectionTable: f,
        instanceTable: h
      }
    );
    await a.log("Node extraction finished");
    const N = xe(u), s = g.getSize(), w = f.getSize(), A = h.getSize();
    await a.log("Extraction complete:"), await a.log(`  - Total nodes: ${N}`), await a.log(`  - Unique variables: ${s}`), await a.log(`  - Unique collections: ${w}`), await a.log(`  - Unique instances: ${A}`);
    const S = h.getSerializedTable(), m = /* @__PURE__ */ new Map();
    for (const [l, b] of Object.entries(S))
      if (b.instanceType === "remote") {
        const C = parseInt(l, 10);
        m.set(C, b);
      }
    if (m.size > 0) {
      await a.error(
        `Found ${m.size} remote instance(s) - remote instances are not supported during publishing`
      );
      const l = (O, L, k = [], U = !1) => {
        const D = [];
        if (!O || typeof O != "object")
          return D;
        if (U || O.type === "PAGE") {
          const F = O.children || O.child;
          if (Array.isArray(F))
            for (const j of F)
              j && typeof j == "object" && D.push(
                ...l(
                  j,
                  L,
                  [],
                  !1
                )
              );
          return D;
        }
        const K = O.name || "";
        if (typeof O._instanceRef == "number" && O._instanceRef === L) {
          const F = K || "(unnamed)", j = k.length > 0 ? [...k, F] : [F];
          return D.push({
            path: j,
            nodeName: F
          }), D;
        }
        const W = K ? [...k, K] : k, B = O.children || O.child;
        if (Array.isArray(B))
          for (const F of B)
            F && typeof F == "object" && D.push(
              ...l(
                F,
                L,
                W,
                !1
              )
            );
        return D;
      }, b = [];
      let C = 1;
      for (const [O, L] of m.entries()) {
        const k = L.componentName || "(unnamed)", U = L.componentSetName, D = l(
          u,
          O,
          [],
          !0
        );
        let K = "";
        D.length > 0 ? K = `
   Location(s): ${D.map((j) => {
          const H = j.path.length > 0 ? j.path.join(" → ") : "page root";
          return `"${j.nodeName}" at ${H}`;
        }).join(", ")}` : K = `
   Location: (unable to determine - instance may be deeply nested)`;
        const W = U ? `Component: "${k}" (from component set "${U}")` : `Component: "${k}"`, B = L.remoteLibraryName ? `
   Library: ${L.remoteLibraryName}` : "";
        b.push(
          `${C}. ${W}${B}${K}`
        ), C++;
      }
      const $ = `Cannot publish: Remote instances are not supported. Please remove all remote instances before publishing.

Found ${m.size} remote instance(s):
${b.join(`

`)}

To fix this:
1. Locate each remote instance component listed above using the path(s) shown
2. Replace it with a local component or remove it
3. Try publishing again`;
      throw await a.error($), new Error($);
    }
    if (w > 0) {
      await a.log("Collections found:");
      const l = f.getTable();
      for (const [b, C] of Object.values(l).entries()) {
        const $ = C.collectionGuid ? ` (GUID: ${C.collectionGuid.substring(0, 8)}...)` : "";
        await a.log(
          `  ${b}: ${C.collectionName}${$} - ${C.modes.length} mode(s)`
        );
      }
    }
    await a.log("Checking for referenced component pages...");
    const M = [], E = Object.values(S).filter(
      (l) => l.instanceType === "normal"
    );
    if (E.length > 0) {
      await a.log(
        `Found ${E.length} normal instance(s) to check`
      );
      const l = /* @__PURE__ */ new Map();
      for (const b of E)
        if (b.componentPageName) {
          const C = o.find(($) => $.name === b.componentPageName);
          if (C && !t.has(C.id))
            l.has(C.id) || l.set(C.id, C);
          else if (!C) {
            const $ = `Normal instance references component "${b.componentName || "(unnamed)"}" on page "${b.componentPageName}", but that page was not found. Cannot export.`;
            throw await a.error($), new Error($);
          }
        } else {
          const C = `Normal instance references component "${b.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw await a.error(C), new Error(C);
        }
      await a.log(
        `Found ${l.size} unique referenced page(s)`
      );
      for (const [b, C] of l.entries()) {
        const $ = C.name;
        if (t.has(b)) {
          await a.log(`Skipping "${$}" - already processed`);
          continue;
        }
        const O = C.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let L = !1;
        if (O)
          try {
            const U = JSON.parse(O);
            L = !!(U.id && U.version !== void 0);
          } catch (U) {
          }
        const k = `Do you want to also publish referenced component "${$}"?`;
        try {
          await be.prompt(k, {
            okLabel: "Yes",
            cancelLabel: "No",
            timeoutMs: 3e5
            // 5 minutes
          }), await a.log(`Exporting referenced page: "${$}"`);
          const U = o.findIndex(
            (K) => K.id === C.id
          );
          if (U === -1)
            throw await a.error(
              `Could not find page index for "${$}"`
            ), new Error(`Could not find page index for "${$}"`);
          const D = await De(
            {
              pageIndex: U
            },
            t,
            // Pass the same set to track all processed pages
            !0
            // Mark as recursive call
          );
          if (D.success && D.data) {
            const K = D.data;
            M.push(K), await a.log(
              `Successfully exported referenced page: "${$}"`
            );
          } else
            throw new Error(
              `Failed to export referenced page "${$}": ${D.message}`
            );
        } catch (U) {
          if (U instanceof Error && U.message === "User cancelled")
            if (L)
              await a.log(
                `User declined to publish "${$}", but page has existing metadata. Continuing with existing metadata.`
              );
            else
              throw await a.error(
                `Export cancelled: Referenced page "${$}" has no metadata and user declined to publish it.`
              ), new Error(
                `Cannot continue export: Referenced component "${$}" has no metadata. Please publish it first or choose to publish it now.`
              );
          else
            throw U;
        }
      }
    }
    await a.log("Creating string table...");
    const R = new Ve();
    await a.log("Getting page metadata...");
    const V = d.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let _ = "", P = 0;
    if (V)
      try {
        const l = JSON.parse(V);
        _ = l.id || "", P = l.version || 0;
      } catch (l) {
        await a.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!_) {
      await a.log("Generating new GUID for page..."), _ = await je();
      const l = {
        _ver: 1,
        id: _,
        name: d.name,
        version: P,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      d.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(l)
      );
    }
    await a.log("Creating export data structure...");
    const I = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "1.0.0",
        figmaApiVersion: figma.apiVersion,
        guid: _,
        version: P,
        name: d.name,
        pluginVersion: "1.0.0"
      },
      stringTable: R.getSerializedTable(),
      collections: f.getSerializedTable(),
      variables: g.getSerializedTable(),
      instances: h.getSerializedTable(),
      pageData: u
    };
    await a.log("Compressing JSON data...");
    const v = Qt(I, R);
    await a.log("Serializing to JSON...");
    const x = JSON.stringify(v, null, 2), T = (x.length / 1024).toFixed(2), p = Oe(d.name).trim().replace(/\s+/g, "_") + ".figma.json";
    await a.log(`JSON serialization complete: ${T} KB`), await a.log(`Export file: ${p}`), await a.log("=== Export Complete ===");
    const y = JSON.parse(x);
    return {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: p,
        pageData: y,
        pageName: d.name,
        additionalPages: M
        // Populated with referenced component pages
      }
    };
  } catch (i) {
    const o = i instanceof Error ? i.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", i), console.error("Error message:", o), await a.error(`Export failed: ${o}`), i instanceof Error && i.stack && (console.error("Stack trace:", i.stack), await a.error(`Stack trace: ${i.stack}`));
    const d = {
      type: "exportPage",
      success: !1,
      error: !0,
      message: o,
      data: {}
    };
    return console.error("Returning error response:", d), d;
  }
}
const ta = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  countTotalNodes: xe,
  exportPage: De,
  extractNodeData: Re
}, Symbol.toStringTag, { value: "Module" }));
function Y(e) {
  return e.replace(/[^a-zA-Z0-9]/g, "");
}
const ct = /* @__PURE__ */ new Map();
async function me(e, t) {
  if (t.length === 0)
    return;
  const n = e.modes.find(
    (i) => i.name === "Mode 1" || i.name === "Default"
  );
  if (n && !t.includes(n.name)) {
    const i = t[0];
    try {
      const o = n.name;
      e.renameMode(n.modeId, i), ct.set(`${e.id}:${o}`, i), await a.log(
        `  Renamed default mode "${o}" to "${i}"`
      );
    } catch (o) {
      await a.warning(
        `  Failed to rename default mode "${n.name}" to "${i}": ${o}`
      );
    }
  }
  for (const i of t)
    e.modes.find((d) => d.name === i) || e.addMode(i);
}
const re = "recursica:collectionId";
async function Te(e) {
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
      re
    );
    if (n && n.trim() !== "")
      return n;
    const i = await je();
    return e.setSharedPluginData("recursica", re, i), i;
  }
}
function aa(e, t) {
  const n = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(n))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function na(e) {
  let t;
  const n = e.collectionName.trim().toLowerCase(), i = ["token", "tokens", "theme", "themes"], o = e.isLocal;
  if (o === !1 || o === void 0 && i.includes(n))
    try {
      const g = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((f) => f.name.trim().toLowerCase() === n);
      if (g) {
        aa(e.collectionName, !1);
        const f = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          g.key
        );
        if (f.length > 0) {
          const h = await figma.variables.importVariableByKeyAsync(f[0].key), u = await figma.variables.getVariableCollectionByIdAsync(
            h.variableCollectionId
          );
          if (u) {
            if (t = u, e.collectionGuid) {
              const N = t.getSharedPluginData(
                "recursica",
                re
              );
              (!N || N.trim() === "") && t.setSharedPluginData(
                "recursica",
                re,
                e.collectionGuid
              );
            } else
              await Te(t);
            return await me(t, e.modes), { collection: t };
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
    let g;
    if (e.collectionGuid && (g = r.find((f) => f.getSharedPluginData("recursica", re) === e.collectionGuid)), g || (g = r.find(
      (f) => f.name === e.collectionName
    )), g)
      if (t = g, e.collectionGuid) {
        const f = t.getSharedPluginData(
          "recursica",
          re
        );
        (!f || f.trim() === "") && t.setSharedPluginData(
          "recursica",
          re,
          e.collectionGuid
        );
      } else
        await Te(t);
    else
      t = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? t.setSharedPluginData(
        "recursica",
        re,
        e.collectionGuid
      ) : await Te(t);
  } else {
    const r = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), g = e.collectionName.trim().toLowerCase(), f = r.find((s) => s.name.trim().toLowerCase() === g);
    if (!f)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const h = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      f.key
    );
    if (h.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const u = await figma.variables.importVariableByKeyAsync(
      h[0].key
    ), N = await figma.variables.getVariableCollectionByIdAsync(
      u.variableCollectionId
    );
    if (!N)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (t = N, e.collectionGuid) {
      const s = t.getSharedPluginData(
        "recursica",
        re
      );
      (!s || s.trim() === "") && t.setSharedPluginData(
        "recursica",
        re,
        e.collectionGuid
      );
    } else
      Te(t);
  }
  return await me(t, e.modes), { collection: t };
}
async function Je(e, t) {
  for (const n of e.variableIds)
    try {
      const i = await figma.variables.getVariableByIdAsync(n);
      if (i && i.name === t)
        return i;
    } catch (i) {
      continue;
    }
  return null;
}
async function ia(e, t, n, i, o) {
  await a.log(
    `Restoring values for variable "${e.name}" (type: ${e.resolvedType}):`
  ), await a.log(
    `  valuesByMode keys: ${Object.keys(t).join(", ")}`
  );
  for (const [d, r] of Object.entries(t)) {
    const g = ct.get(`${i.id}:${d}`) || d;
    let f = i.modes.find((u) => u.name === g);
    if (f || (f = i.modes.find((u) => u.name === d)), !f) {
      await a.warning(
        `Mode "${d}" (mapped: "${g}") not found in collection "${i.name}" for variable "${e.name}". Available modes: ${i.modes.map((u) => u.name).join(", ")}. Skipping.`
      );
      continue;
    }
    const h = f.modeId;
    try {
      if (r == null) {
        await a.log(
          `  Mode "${d}": value is null/undefined, skipping`
        );
        continue;
      }
      if (await a.log(
        `  Mode "${d}": value type=${typeof r}, value=${JSON.stringify(r)}`
      ), typeof r == "string" || typeof r == "number" || typeof r == "boolean") {
        e.setValueForMode(h, r);
        continue;
      }
      if (typeof r == "object" && r !== null && "r" in r && "g" in r && "b" in r && typeof r.r == "number" && typeof r.g == "number" && typeof r.b == "number") {
        const u = r, N = {
          r: u.r,
          g: u.g,
          b: u.b
        };
        u.a !== void 0 && (N.a = u.a), e.setValueForMode(h, N);
        const s = e.valuesByMode[h];
        if (await a.log(
          `  Set color value for "${e.name}" mode "${d}": r=${N.r.toFixed(3)}, g=${N.g.toFixed(3)}, b=${N.b.toFixed(3)}${N.a !== void 0 ? `, a=${N.a.toFixed(3)}` : ""}`
        ), await a.log(
          `  Read back value: ${JSON.stringify(s)}`
        ), typeof s == "object" && s !== null && "r" in s && "g" in s && "b" in s) {
          const w = s, A = Math.abs(w.r - N.r) < 1e-3, S = Math.abs(w.g - N.g) < 1e-3, m = Math.abs(w.b - N.b) < 1e-3;
          !A || !S || !m ? await a.warning(
            `  ⚠️ Value mismatch! Set: r=${N.r}, g=${N.g}, b=${N.b}, Read back: r=${w.r}, g=${w.g}, b=${w.b}`
          ) : await a.log(
            "  ✓ Value verified: read-back matches what we set"
          );
        } else
          await a.warning(
            `  ⚠️ Read-back value is not an RGB object: ${JSON.stringify(s)}`
          );
        continue;
      }
      if (typeof r == "object" && r !== null && "_varRef" in r && typeof r._varRef == "number") {
        const u = r;
        let N = null;
        const s = n.getVariableByIndex(
          u._varRef
        );
        if (s) {
          let w = null;
          if (o && s._colRef !== void 0) {
            const A = o.getCollectionByIndex(
              s._colRef
            );
            A && (w = (await na(A)).collection);
          }
          w && (N = await Je(
            w,
            s.variableName
          ));
        }
        if (N) {
          const w = {
            type: "VARIABLE_ALIAS",
            id: N.id
          };
          e.setValueForMode(h, w);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${d}" in variable "${e.name}". Variable reference index: ${u._varRef}`
          );
      }
    } catch (u) {
      typeof r == "object" && r !== null && !("_varRef" in r) && !("r" in r && "g" in r && "b" in r) && await a.warning(
        `Unhandled value type for mode "${d}" in variable "${e.name}": ${JSON.stringify(r)}`
      ), console.warn(
        `Error setting value for mode "${d}" in variable "${e.name}":`,
        u
      );
    }
  }
}
async function ze(e, t, n, i) {
  if (await a.log(
    `Creating variable "${e.variableName}" (type: ${e.variableType})`
  ), e.valuesByMode) {
    await a.log(
      `  valuesByMode has ${Object.keys(e.valuesByMode).length} mode(s): ${Object.keys(e.valuesByMode).join(", ")}`
    );
    for (const [d, r] of Object.entries(e.valuesByMode))
      await a.log(
        `  Mode "${d}": ${JSON.stringify(r)} (type: ${typeof r})`
      );
  } else
    await a.log(
      `  No valuesByMode found for variable "${e.variableName}"`
    );
  const o = figma.variables.createVariable(
    e.variableName,
    t,
    e.variableType
  );
  if (e.valuesByMode && await ia(
    o,
    e.valuesByMode,
    n,
    t,
    // Pass collection to look up modes by name
    i
  ), e.valuesByMode && o.valuesByMode) {
    await a.log(`  Verifying values for "${e.variableName}":`);
    for (const [d, r] of Object.entries(
      e.valuesByMode
    )) {
      const g = t.modes.find((f) => f.name === d);
      if (g) {
        const f = o.valuesByMode[g.modeId];
        await a.log(
          `    Mode "${d}": expected=${JSON.stringify(r)}, actual=${JSON.stringify(f)}`
        );
      }
    }
  }
  return o;
}
async function oa(e, t, n, i) {
  const o = t.getVariableByIndex(e);
  if (!o || o._colRef === void 0)
    return null;
  const d = i.get(String(o._colRef));
  if (!d)
    return null;
  const r = await Je(
    d,
    o.variableName
  );
  if (r) {
    let g;
    if (typeof o.variableType == "number" ? g = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[o.variableType] || String(o.variableType) : g = o.variableType, lt(r, g))
      return r;
  }
  return await ze(
    o,
    d,
    t,
    n
  );
}
async function ra(e, t, n, i) {
  if (!(!t || typeof t != "object"))
    try {
      const o = e[n];
      if (!o || !Array.isArray(o))
        return;
      const d = t[n];
      if (Array.isArray(d))
        for (let r = 0; r < d.length && r < o.length; r++) {
          const g = d[r];
          if (g && typeof g == "object") {
            if (o[r].boundVariables || (o[r].boundVariables = {}), pe(g)) {
              const f = g._varRef;
              if (f !== void 0) {
                const h = i.get(String(f));
                h && (o[r].boundVariables.color = {
                  type: "VARIABLE_ALIAS",
                  id: h.id
                });
              }
            } else
              for (const [f, h] of Object.entries(
                g
              ))
                if (pe(h)) {
                  const u = h._varRef;
                  if (u !== void 0) {
                    const N = i.get(String(u));
                    N && (o[r].boundVariables[f] = {
                      type: "VARIABLE_ALIAS",
                      id: N.id
                    });
                  }
                }
          }
        }
    } catch (o) {
      console.log(`Error restoring bound variables for ${n}:`, o);
    }
}
function sa(e, t, n = !1) {
  const i = Tt(t);
  if (e.visible === void 0 && (e.visible = i.visible), e.locked === void 0 && (e.locked = i.locked), e.opacity === void 0 && (e.opacity = i.opacity), e.rotation === void 0 && (e.rotation = i.rotation), e.blendMode === void 0 && (e.blendMode = i.blendMode), t === "FRAME" || t === "COMPONENT" || t === "INSTANCE") {
    const o = X;
    e.layoutMode === void 0 && (e.layoutMode = o.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = o.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = o.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = o.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = o.counterAxisAlignItems), n || (e.paddingLeft === void 0 && (e.paddingLeft = o.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = o.paddingRight), e.paddingTop === void 0 && (e.paddingTop = o.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = o.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = o.itemSpacing), e.counterAxisSpacing === void 0 && (e.counterAxisSpacing = o.counterAxisSpacing));
  }
  if (t === "TEXT") {
    const o = oe;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = o.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = o.textAlignVertical), e.textCase === void 0 && (e.textCase = o.textCase), e.textDecoration === void 0 && (e.textDecoration = o.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = o.textAutoResize);
  }
}
async function we(e, t, n = null, i = null, o = null, d = null, r = null, g = !1, f = null, h = null, u = null, N = null) {
  var P, I, v, x, T, G;
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
        s = r.get(e.id), await a.log(
          `Reusing existing COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id.substring(0, 8)}...)`
        );
      else if (s = figma.createComponent(), await a.log(
        `Created COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id ? e.id.substring(0, 8) + "..." : "no ID"})`
      ), e.componentPropertyDefinitions) {
        const p = e.componentPropertyDefinitions;
        let y = 0, c = 0;
        for (const [l, b] of Object.entries(p))
          try {
            const C = b.type;
            let $ = null;
            if (typeof C == "string" ? (C === "TEXT" || C === "BOOLEAN" || C === "INSTANCE_SWAP" || C === "VARIANT") && ($ = C) : typeof C == "number" && ($ = {
              2: "TEXT",
              // Text property
              25: "BOOLEAN",
              // Boolean property
              27: "INSTANCE_SWAP",
              // Instance swap property
              26: "VARIANT"
              // Variant property
            }[C] || null), !$) {
              await a.warning(
                `  Unknown property type ${C} (${typeof C}) for property "${l}" in component "${e.name || "Unnamed"}"`
              ), c++;
              continue;
            }
            const O = b.defaultValue, L = l.split("#")[0];
            s.addComponentProperty(
              L,
              $,
              O
            ), y++;
          } catch (C) {
            await a.warning(
              `  Failed to add component property "${l}" to "${e.name || "Unnamed"}": ${C}`
            ), c++;
          }
        y > 0 && await a.log(
          `  Added ${y} component property definition(s) to "${e.name || "Unnamed"}"${c > 0 ? ` (${c} failed)` : ""}`
        );
      }
      break;
    case "COMPONENT_SET": {
      const p = e.children ? e.children.filter((l) => l.type === "COMPONENT").length : 0;
      await a.log(
        `Creating COMPONENT_SET "${e.name || "Unnamed"}" by combining ${p} component variant(s)`
      );
      const y = [];
      let c = null;
      if (e.children && Array.isArray(e.children)) {
        c = figma.createFrame(), c.name = `_temp_${e.name || "COMPONENT_SET"}`, c.visible = !1, ((t == null ? void 0 : t.type) === "PAGE" ? t : figma.currentPage).appendChild(c);
        for (const b of e.children)
          if (b.type === "COMPONENT" && !b._truncated)
            try {
              const C = await we(
                b,
                c,
                // Use temp parent for now
                n,
                i,
                o,
                d,
                r,
                g,
                f,
                h,
                // Pass deferredInstances through for component set creation
                null,
                // parentNodeData - not needed here, will be passed correctly in recursive calls
                N
              );
              C && C.type === "COMPONENT" && (y.push(C), await a.log(
                `  Created component variant: "${C.name || "Unnamed"}"`
              ));
            } catch (C) {
              await a.warning(
                `  Failed to create component variant "${b.name || "Unnamed"}": ${C}`
              );
            }
      }
      if (y.length > 0)
        try {
          const l = t || figma.currentPage, b = figma.combineAsVariants(
            y,
            l
          );
          e.name && (b.name = e.name), e.x !== void 0 && (b.x = e.x), e.y !== void 0 && (b.y = e.y), c && c.parent && c.remove(), await a.log(
            `  ✓ Successfully created COMPONENT_SET "${b.name}" with ${y.length} variant(s)`
          ), s = b;
        } catch (l) {
          if (await a.warning(
            `  Failed to combine components into COMPONENT_SET "${e.name || "Unnamed"}": ${l}. Falling back to frame.`
          ), s = figma.createFrame(), e.name && (s.name = e.name), c && c.children.length > 0) {
            for (const b of c.children)
              s.appendChild(b);
            c.remove();
          }
        }
      else
        await a.warning(
          `  No valid component variants found for COMPONENT_SET "${e.name || "Unnamed"}". Creating frame instead.`
        ), s = figma.createFrame(), e.name && (s.name = e.name), c && c.remove();
      break;
    }
    case "INSTANCE":
      if (g)
        s = figma.createFrame(), e.name && (s.name = e.name);
      else if (e._instanceRef !== void 0 && o && r) {
        const p = o.getInstanceByIndex(
          e._instanceRef
        );
        if (p && p.instanceType === "internal")
          if (p.componentNodeId)
            if (p.componentNodeId === e.id)
              await a.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), s = figma.createFrame(), e.name && (s.name = e.name);
            else {
              const y = r.get(
                p.componentNodeId
              );
              if (!y) {
                const c = Array.from(r.keys()).slice(
                  0,
                  20
                );
                await a.error(
                  `Component not found for internal instance "${e.name}" (ID: ${p.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), await a.error(
                  `Looking for component ID: ${p.componentNodeId}`
                ), await a.error(
                  `Available IDs in mapping (first 20): ${c.map((O) => O.substring(0, 8) + "...").join(", ")}`
                );
                const l = (O, L) => {
                  if (O.type === "COMPONENT" && O.id === L)
                    return !0;
                  if (O.children && Array.isArray(O.children)) {
                    for (const k of O.children)
                      if (!k._truncated && l(k, L))
                        return !0;
                  }
                  return !1;
                }, b = l(
                  e,
                  p.componentNodeId
                );
                await a.error(
                  `Component ID ${p.componentNodeId.substring(0, 8)}... exists in current node tree: ${b}`
                ), await a.error(
                  `WARNING: Component ID ${p.componentNodeId.substring(0, 8)}... not found in nodeIdMapping. This might indicate:`
                ), await a.error(
                  "  1. The component doesn't exist in the pageData (detached component?)"
                ), await a.error(
                  "  2. The component wasn't collected in the first pass"
                ), await a.error(
                  "  3. The component ID in the instance table doesn't match the actual component ID"
                );
                const C = c.filter(
                  (O) => O.startsWith(p.componentNodeId.substring(0, 8))
                );
                C.length > 0 && await a.error(
                  `Found IDs with matching prefix: ${C.map((O) => O.substring(0, 8) + "...").join(", ")}`
                );
                const $ = `Component not found for internal instance "${e.name}" (ID: ${p.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${c.map((O) => O.substring(0, 8) + "...").join(", ")}`;
                throw new Error($);
              }
              if (y && y.type === "COMPONENT") {
                if (s = y.createInstance(), await a.log(
                  `✓ Created internal instance "${e.name}" from component "${p.componentName}"`
                ), p.variantProperties && Object.keys(p.variantProperties).length > 0)
                  try {
                    let c = null;
                    if (y.parent && y.parent.type === "COMPONENT_SET")
                      c = y.parent.componentPropertyDefinitions, await a.log(
                        `  DEBUG: Component "${p.componentName}" is inside component set "${y.parent.name}" with ${Object.keys(c || {}).length} property definitions`
                      );
                    else {
                      const l = await s.getMainComponentAsync();
                      if (l) {
                        const b = l.type;
                        await a.log(
                          `  DEBUG: Internal instance "${e.name}" - componentNode parent: ${y.parent ? y.parent.type : "N/A"}, mainComponent type: ${b}, mainComponent parent: ${l.parent ? l.parent.type : "N/A"}`
                        ), b === "COMPONENT_SET" ? c = l.componentPropertyDefinitions : b === "COMPONENT" && l.parent && l.parent.type === "COMPONENT_SET" ? (c = l.parent.componentPropertyDefinitions, await a.log(
                          `  DEBUG: Found component set parent "${l.parent.name}" with ${Object.keys(c || {}).length} property definitions`
                        )) : await a.log(
                          `  Skipping variant properties for internal instance "${e.name}" - component "${p.componentName}" is not yet in a COMPONENT_SET (will be moved later during component set creation)`
                        );
                      }
                    }
                    if (c) {
                      const l = {};
                      for (const [b, C] of Object.entries(
                        p.variantProperties
                      )) {
                        const $ = b.split("#")[0];
                        c[$] && (l[$] = C);
                      }
                      Object.keys(l).length > 0 && s.setProperties(l);
                    }
                  } catch (c) {
                    const l = `Failed to set variant properties for instance "${e.name}": ${c}`;
                    throw await a.error(l), new Error(l);
                  }
                if (p.componentProperties && Object.keys(p.componentProperties).length > 0)
                  try {
                    const c = await s.getMainComponentAsync();
                    if (c) {
                      let l = null;
                      const b = c.type;
                      if (b === "COMPONENT_SET" ? l = c.componentPropertyDefinitions : b === "COMPONENT" && c.parent && c.parent.type === "COMPONENT_SET" ? l = c.parent.componentPropertyDefinitions : b === "COMPONENT" && (l = c.componentPropertyDefinitions), l)
                        for (const [C, $] of Object.entries(
                          p.componentProperties
                        )) {
                          const O = C.split("#")[0];
                          if (l[O])
                            try {
                              let L = $;
                              $ && typeof $ == "object" && "value" in $ && (L = $.value), s.setProperties({
                                [O]: L
                              });
                            } catch (L) {
                              const k = `Failed to set component property "${O}" for internal instance "${e.name}": ${L}`;
                              throw await a.error(k), new Error(k);
                            }
                        }
                    } else
                      await a.warning(
                        `Cannot set component properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (c) {
                    if (c instanceof Error)
                      throw c;
                    const l = `Failed to set component properties for instance "${e.name}": ${c}`;
                    throw await a.error(l), new Error(l);
                  }
              } else if (!s && y) {
                const c = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${p.componentNodeId.substring(0, 8)}...).`;
                throw await a.error(c), new Error(c);
              }
            }
          else {
            const y = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw await a.error(y), new Error(y);
          }
        else if (p && p.instanceType === "remote")
          if (f) {
            const y = f.get(
              e._instanceRef
            );
            if (y) {
              if (s = y.createInstance(), await a.log(
                `✓ Created remote instance "${e.name}" from component "${p.componentName}" on REMOTES page`
              ), p.variantProperties && Object.keys(p.variantProperties).length > 0)
                try {
                  const c = await s.getMainComponentAsync();
                  if (c) {
                    let l = null;
                    const b = c.type;
                    if (b === "COMPONENT_SET" ? l = c.componentPropertyDefinitions : b === "COMPONENT" && c.parent && c.parent.type === "COMPONENT_SET" ? l = c.parent.componentPropertyDefinitions : await a.log(
                      `Skipping variant properties for remote instance "${e.name}" - main component is not a COMPONENT_SET or variant (expected for remote components)`
                    ), l) {
                      const C = {};
                      for (const [$, O] of Object.entries(
                        p.variantProperties
                      )) {
                        const L = $.split("#")[0];
                        l[L] && (C[L] = O);
                      }
                      Object.keys(C).length > 0 && s.setProperties(C);
                    }
                  } else
                    await a.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (c) {
                  const l = `Failed to set variant properties for remote instance "${e.name}": ${c}`;
                  throw await a.error(l), new Error(l);
                }
              if (p.componentProperties && Object.keys(p.componentProperties).length > 0)
                try {
                  const c = await s.getMainComponentAsync();
                  if (c) {
                    let l = null;
                    const b = c.type;
                    if (b === "COMPONENT_SET" ? l = c.componentPropertyDefinitions : b === "COMPONENT" && c.parent && c.parent.type === "COMPONENT_SET" ? l = c.parent.componentPropertyDefinitions : b === "COMPONENT" && (l = c.componentPropertyDefinitions), l)
                      for (const [C, $] of Object.entries(
                        p.componentProperties
                      )) {
                        const O = C.split("#")[0];
                        if (l[O])
                          try {
                            let L = $;
                            $ && typeof $ == "object" && "value" in $ && (L = $.value), s.setProperties({
                              [O]: L
                            });
                          } catch (L) {
                            const k = `Failed to set component property "${O}" for remote instance "${e.name}": ${L}`;
                            throw await a.error(k), new Error(k);
                          }
                      }
                  } else
                    await a.warning(
                      `Cannot set component properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (c) {
                  if (c instanceof Error)
                    throw c;
                  const l = `Failed to set component properties for remote instance "${e.name}": ${c}`;
                  throw await a.error(l), new Error(l);
                }
              if (e.width !== void 0 && e.height !== void 0)
                try {
                  s.resize(e.width, e.height);
                } catch (c) {
                  await a.log(
                    `Note: Could not resize remote instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
                  );
                }
            } else {
              const c = `Remote component not found for instance "${e.name}" (index ${e._instanceRef}). The remote component should have been created on the REMOTES page.`;
              throw await a.error(c), new Error(c);
            }
          } else {
            const y = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw await a.error(y), new Error(y);
          }
        else if ((p == null ? void 0 : p.instanceType) === "normal") {
          if (!p.componentPageName) {
            const $ = `Normal instance "${e.name}" missing componentPageName. Cannot resolve.`;
            throw await a.error($), new Error($);
          }
          await figma.loadAllPagesAsync();
          const y = figma.root.children.find(
            ($) => $.name === p.componentPageName
          );
          if (!y) {
            await a.log(
              `  Deferring normal instance "${e.name}" - referenced page "${p.componentPageName}" does not exist yet (may be circular reference or not yet imported)`
            );
            const $ = figma.createFrame();
            if ($.name = `[Deferred: ${e.name}]`, e.x !== void 0 && ($.x = e.x), e.y !== void 0 && ($.y = e.y), e.width !== void 0 && e.height !== void 0 ? $.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && $.resize(e.w, e.h), h) {
              const O = {
                placeholderFrameId: $.id,
                instanceEntry: p,
                nodeData: e,
                parentNodeId: t.id,
                instanceIndex: e._instanceRef
              };
              h.push(O), await a.log(
                `  [DEBUG] Added deferred instance "${e.name}" to array (array length: ${h.length})`
              );
            } else
              await a.log(
                `  [DEBUG] deferredInstances array is null/undefined - cannot store deferred instance "${e.name}"`
              );
            s = $;
            break;
          }
          let c = null;
          const l = ($, O, L, k, U) => {
            if (O.length === 0) {
              let W = null;
              for (const B of $.children || [])
                if (B.type === "COMPONENT") {
                  if (B.name === L)
                    if (W || (W = B), k)
                      try {
                        const F = B.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (F && JSON.parse(F).id === k)
                          return B;
                      } catch (F) {
                      }
                    else
                      return B;
                } else if (B.type === "COMPONENT_SET") {
                  if (U && B.name !== U)
                    continue;
                  for (const F of B.children || [])
                    if (F.type === "COMPONENT" && F.name === L)
                      if (W || (W = F), k)
                        try {
                          const j = F.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (j && JSON.parse(j).id === k)
                            return F;
                        } catch (j) {
                        }
                      else
                        return F;
                }
              return W;
            }
            const [D, ...K] = O;
            for (const W of $.children || [])
              if (W.name === D) {
                if (K.length === 0 && W.type === "COMPONENT_SET") {
                  if (U && W.name !== U)
                    continue;
                  for (const B of W.children || [])
                    if (B.type === "COMPONENT" && B.name === L) {
                      if (k)
                        try {
                          const F = B.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (F && JSON.parse(F).id === k)
                            return B;
                        } catch (F) {
                        }
                      return B;
                    }
                  return null;
                }
                return l(
                  W,
                  K,
                  L,
                  k,
                  U
                );
              }
            return null;
          };
          await a.log(
            `  Looking for component "${p.componentName}" on page "${p.componentPageName}"${p.path && p.path.length > 0 ? ` at path [${p.path.join(" → ")}]` : " at page root"}${p.componentGuid ? ` (GUID: ${p.componentGuid.substring(0, 8)}...)` : ""}`
          );
          const b = [], C = ($, O = 0) => {
            const L = "  ".repeat(O);
            if ($.type === "COMPONENT")
              b.push(`${L}COMPONENT: "${$.name}"`);
            else if ($.type === "COMPONENT_SET") {
              b.push(
                `${L}COMPONENT_SET: "${$.name}"`
              );
              for (const k of $.children || [])
                k.type === "COMPONENT" && b.push(
                  `${L}  └─ COMPONENT: "${k.name}"`
                );
            }
            for (const k of $.children || [])
              C(k, O + 1);
          };
          if (C(y), b.length > 0 ? await a.log(
            `  Available components on page "${p.componentPageName}":
${b.slice(0, 20).join(`
`)}${b.length > 20 ? `
  ... and ${b.length - 20} more` : ""}`
          ) : await a.warning(
            `  No components found on page "${p.componentPageName}"`
          ), c = l(
            y,
            p.path || [],
            p.componentName,
            p.componentGuid,
            p.componentSetName
          ), c && p.componentGuid)
            try {
              const $ = c.getPluginData(
                "RecursicaPublishedMetadata"
              );
              if ($) {
                const O = JSON.parse($);
                O.id !== p.componentGuid ? await a.warning(
                  `  Found component "${p.componentName}" by name but GUID verification failed (expected ${p.componentGuid.substring(0, 8)}..., got ${O.id ? O.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`
                ) : await a.log(
                  `  Found component "${p.componentName}" with matching GUID ${p.componentGuid.substring(0, 8)}...`
                );
              } else
                await a.warning(
                  `  Found component "${p.componentName}" by name but no metadata found. Using name match as fallback.`
                );
            } catch ($) {
              await a.warning(
                `  Found component "${p.componentName}" by name but GUID verification failed. Using name match as fallback.`
              );
            }
          if (!c) {
            await a.log(
              `  Deferring normal instance "${e.name}" - component "${p.componentName}" not found on page "${p.componentPageName}" (may not be created yet due to circular reference)`
            );
            const $ = figma.createFrame();
            if ($.name = `[Deferred: ${e.name}]`, e.x !== void 0 && ($.x = e.x), e.y !== void 0 && ($.y = e.y), e.width !== void 0 && e.height !== void 0 ? $.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && $.resize(e.w, e.h), h) {
              const O = {
                placeholderFrameId: $.id,
                instanceEntry: p,
                nodeData: e,
                parentNodeId: t.id,
                instanceIndex: e._instanceRef
              };
              h.push(O), await a.log(
                `  [DEBUG] Added deferred instance "${e.name}" to array (array length: ${h.length})`
              );
            } else
              await a.log(
                `  [DEBUG] deferredInstances array is null/undefined - cannot store deferred instance "${e.name}"`
              );
            s = $;
            break;
          }
          if (s = c.createInstance(), await a.log(
            `  Created normal instance "${e.name}" from component "${p.componentName}" on page "${p.componentPageName}"`
          ), p.variantProperties && Object.keys(p.variantProperties).length > 0)
            try {
              const $ = await s.getMainComponentAsync();
              if ($) {
                let O = null;
                const L = $.type;
                if (L === "COMPONENT_SET" ? O = $.componentPropertyDefinitions : L === "COMPONENT" && $.parent && $.parent.type === "COMPONENT_SET" ? O = $.parent.componentPropertyDefinitions : await a.warning(
                  `Cannot set variant properties for normal instance "${e.name}" - main component is not a COMPONENT_SET or variant`
                ), O) {
                  const k = {};
                  for (const [U, D] of Object.entries(
                    p.variantProperties
                  )) {
                    const K = U.split("#")[0];
                    O[K] && (k[K] = D);
                  }
                  Object.keys(k).length > 0 && s.setProperties(k);
                }
              }
            } catch ($) {
              await a.warning(
                `Failed to set variant properties for normal instance "${e.name}": ${$}`
              );
            }
          if (p.componentProperties && Object.keys(p.componentProperties).length > 0)
            try {
              const $ = await s.getMainComponentAsync();
              if ($) {
                let O = null;
                const L = $.type;
                if (L === "COMPONENT_SET" ? O = $.componentPropertyDefinitions : L === "COMPONENT" && $.parent && $.parent.type === "COMPONENT_SET" ? O = $.parent.componentPropertyDefinitions : L === "COMPONENT" && (O = $.componentPropertyDefinitions), O) {
                  const k = {};
                  for (const [U, D] of Object.entries(
                    p.componentProperties
                  )) {
                    const K = U.split("#")[0];
                    let W;
                    if (O[U] ? W = U : O[K] ? W = K : W = Object.keys(O).find(
                      (B) => B.split("#")[0] === K
                    ), W) {
                      const B = D && typeof D == "object" && "value" in D ? D.value : D;
                      k[W] = B;
                    } else
                      await a.warning(
                        `Component property "${K}" (from "${U}") does not exist on component "${p.componentName}" for normal instance "${e.name}". Available properties: ${Object.keys(O).join(", ") || "none"}`
                      );
                  }
                  if (Object.keys(k).length > 0)
                    try {
                      await a.log(
                        `  Attempting to set component properties for normal instance "${e.name}": ${Object.keys(k).join(", ")}`
                      ), await a.log(
                        `  Available component properties: ${Object.keys(O).join(", ")}`
                      ), s.setProperties(k), await a.log(
                        `  ✓ Successfully set component properties for normal instance "${e.name}": ${Object.keys(k).join(", ")}`
                      );
                    } catch (U) {
                      await a.warning(
                        `Failed to set component properties for normal instance "${e.name}": ${U}`
                      ), await a.warning(
                        `  Properties attempted: ${JSON.stringify(k)}`
                      ), await a.warning(
                        `  Available properties: ${JSON.stringify(Object.keys(O))}`
                      );
                    }
                }
              } else
                await a.warning(
                  `Cannot set component properties for normal instance "${e.name}" - main component not found`
                );
            } catch ($) {
              await a.warning(
                `Failed to set component properties for normal instance "${e.name}": ${$}`
              );
            }
          if (e.width !== void 0 && e.height !== void 0)
            try {
              s.resize(e.width, e.height);
            } catch ($) {
              await a.log(
                `Note: Could not resize normal instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
              );
            }
        } else {
          const y = `Instance "${e.name}" has unknown or missing instance type: ${(p == null ? void 0 : p.instanceType) || "unknown"}`;
          throw await a.error(y), new Error(y);
        }
      } else {
        const p = `Instance "${e.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        throw await a.error(p), new Error(p);
      }
      break;
    case "GROUP":
      s = figma.createFrame();
      break;
    case "BOOLEAN_OPERATION": {
      const p = `Boolean operation nodes cannot be imported. Found boolean operation: "${e.name}".`;
      throw await a.error(p), new Error(p);
    }
    case "POLYGON":
      s = figma.createPolygon();
      break;
    default: {
      const p = `Unsupported node type: ${e.type}. This node type cannot be imported.`;
      throw await a.error(p), new Error(p);
    }
  }
  if (!s)
    return null;
  e.id && r && (r.set(e.id, s), s.type === "COMPONENT" && await a.log(
    `  Stored COMPONENT "${e.name || "Unnamed"}" in nodeIdMapping (ID: ${e.id.substring(0, 8)}...)`
  )), e._instanceRef !== void 0 && s.type === "INSTANCE" ? (r._instanceTableMap || (r._instanceTableMap = /* @__PURE__ */ new Map()), r._instanceTableMap.set(
    s.id,
    e._instanceRef
  ), await a.log(
    `  Stored instance table mapping: instance "${s.name}" (ID: ${s.id.substring(0, 8)}...) -> instance table index ${e._instanceRef}`
  )) : s.type === "INSTANCE" && await a.log(
    `  WARNING: Instance "${s.name}" (ID: ${s.id.substring(0, 8)}...) has no _instanceRef in nodeData - will use fallback matching in third pass`
  );
  const w = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.paddingLeft || e.boundVariables.paddingRight || e.boundVariables.paddingTop || e.boundVariables.paddingBottom || e.boundVariables.itemSpacing);
  sa(
    s,
    e.type || "FRAME",
    w
  ), e.name !== void 0 && (s.name = e.name || "Unnamed Node");
  const A = u && u.layoutMode !== void 0 && u.layoutMode !== "NONE", S = t && "layoutMode" in t && t.layoutMode !== "NONE";
  A || S || (e.x !== void 0 && (s.x = e.x), e.y !== void 0 && (s.y = e.y));
  const M = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
  e.type !== "VECTOR" && e.width !== void 0 && e.height !== void 0 && !M && s.resize(e.width, e.height);
  const E = e.boundVariables && typeof e.boundVariables == "object";
  if (e.visible !== void 0 && (s.visible = e.visible), e.locked !== void 0 && (s.locked = e.locked), e.opacity !== void 0 && (!E || !e.boundVariables.opacity) && (s.opacity = e.opacity), e.rotation !== void 0 && (!E || !e.boundVariables.rotation) && (s.rotation = e.rotation), e.blendMode !== void 0 && (!E || !e.boundVariables.blendMode) && (s.blendMode = e.blendMode), e.type !== "INSTANCE") {
    if (e.type === "VECTOR" && e.boundVariables && (await a.log(
      `  DEBUG: VECTOR "${e.name || "Unnamed"}" (ID: ${((P = e.id) == null ? void 0 : P.substring(0, 8)) || "unknown"}...) has boundVariables: ${Object.keys(e.boundVariables).join(", ")}`
    ), e.boundVariables.fills && await a.log(
      `  DEBUG:   boundVariables.fills: ${JSON.stringify(e.boundVariables.fills)}`
    )), e.fills !== void 0)
      try {
        let p = e.fills;
        if (Array.isArray(p) && (p = p.map((y) => {
          if (y && typeof y == "object") {
            const c = J({}, y);
            return delete c.boundVariables, c;
          }
          return y;
        })), e.fills && Array.isArray(e.fills) && d) {
          if (e.type === "VECTOR") {
            await a.log(
              `  DEBUG: VECTOR "${e.name || "Unnamed"}" has ${e.fills.length} fill(s)`
            );
            for (let c = 0; c < e.fills.length; c++) {
              const l = e.fills[c];
              if (l && typeof l == "object") {
                const b = l.boundVariables || l.bndVar;
                b ? await a.log(
                  `  DEBUG:   fill[${c}] has boundVariables: ${JSON.stringify(b)}`
                ) : await a.log(
                  `  DEBUG:   fill[${c}] has no boundVariables`
                );
              }
            }
          }
          const y = [];
          for (let c = 0; c < p.length; c++) {
            const l = p[c], b = e.fills[c];
            if (!b || typeof b != "object") {
              y.push(l);
              continue;
            }
            const C = b.boundVariables || b.bndVar;
            if (!C) {
              y.push(l);
              continue;
            }
            const $ = J({}, l);
            $.boundVariables = {};
            for (const [O, L] of Object.entries(C))
              if (e.type === "VECTOR" && await a.log(
                `  DEBUG: Processing fill[${c}].${O} on VECTOR "${s.name || "Unnamed"}": varInfo=${JSON.stringify(L)}`
              ), pe(L)) {
                const k = L._varRef;
                if (k !== void 0) {
                  if (e.type === "VECTOR") {
                    await a.log(
                      `  DEBUG: Looking up variable reference ${k} in recognizedVariables (map has ${d.size} entries)`
                    );
                    const D = Array.from(
                      d.keys()
                    ).slice(0, 10);
                    await a.log(
                      `  DEBUG: Available variable references (first 10): ${D.join(", ")}`
                    );
                    const K = d.has(String(k));
                    if (await a.log(
                      `  DEBUG: Variable reference ${k} ${K ? "found" : "NOT FOUND"} in recognizedVariables`
                    ), !K) {
                      const W = Array.from(
                        d.keys()
                      ).sort((B, F) => parseInt(B) - parseInt(F));
                      await a.log(
                        `  DEBUG: All available variable references: ${W.join(", ")}`
                      );
                    }
                  }
                  let U = d.get(String(k));
                  U || (e.type === "VECTOR" && await a.log(
                    `  DEBUG: Variable ${k} not in recognizedVariables. variableTable=${!!n}, collectionTable=${!!i}, recognizedCollections=${!!N}`
                  ), n && i && N ? (await a.log(
                    `  Variable reference ${k} not in recognizedVariables, attempting to resolve from variable table...`
                  ), U = await oa(
                    k,
                    n,
                    i,
                    N
                  ) || void 0, U ? (d.set(String(k), U), await a.log(
                    `  ✓ Resolved variable ${U.name} from variable table and added to recognizedVariables`
                  )) : await a.warning(
                    `  Failed to resolve variable ${k} from variable table`
                  )) : e.type === "VECTOR" && await a.warning(
                    `  Cannot resolve variable ${k} from table - missing required parameters`
                  )), U ? ($.boundVariables[O] = {
                    type: "VARIABLE_ALIAS",
                    id: U.id
                  }, await a.log(
                    `  ✓ Restored bound variable for fill[${c}].${O} on "${s.name || "Unnamed"}" (${e.type}): variable ${U.name} (ID: ${U.id.substring(0, 8)}...)`
                  )) : await a.warning(
                    `  Variable reference ${k} not found in recognizedVariables for fill[${c}].${O} on "${s.name || "Unnamed"}"`
                  );
                } else
                  e.type === "VECTOR" && await a.warning(
                    `  DEBUG: Variable reference ${k} is undefined for fill[${c}].${O} on VECTOR "${s.name || "Unnamed"}"`
                  );
              } else
                e.type === "VECTOR" && await a.warning(
                  `  DEBUG: fill[${c}].${O} on VECTOR "${s.name || "Unnamed"}" is not a variable reference: ${JSON.stringify(L)}`
                );
            y.push($);
          }
          s.fills = y, await a.log(
            `  ✓ Set fills with boundVariables on "${s.name || "Unnamed"}" (${e.type})`
          );
        } else
          s.fills = p;
        e.boundVariables && Object.keys(e.boundVariables).length > 0 && !e.boundVariables.fills && await a.log(
          `  Node "${s.name || "Unnamed"}" (${e.type}) has boundVariables but not for fills: ${Object.keys(e.boundVariables).join(", ")}`
        );
      } catch (p) {
        console.log("Error setting fills:", p);
      }
    else if (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "GROUP")
      try {
        s.fills = [];
      } catch (p) {
        console.log("Error clearing fills:", p);
      }
  }
  if (e.strokes !== void 0)
    try {
      e.strokes.length > 0 ? s.strokes = e.strokes : s.strokes = [];
    } catch (p) {
      console.log("Error setting strokes:", p);
    }
  else if (e.type === "VECTOR")
    try {
      s.strokes = [];
    } catch (p) {
    }
  const R = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.strokeWeight || e.boundVariables.strokeAlign);
  e.strokeWeight !== void 0 ? (!R || !e.boundVariables.strokeWeight) && (s.strokeWeight = e.strokeWeight) : e.type === "VECTOR" && (e.strokes === void 0 || e.strokes.length === 0) && (!R || !e.boundVariables.strokeWeight) && (s.strokeWeight = 0), e.strokeAlign !== void 0 && (!R || !e.boundVariables.strokeAlign) && (s.strokeAlign = e.strokeAlign);
  const V = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.cornerRadius || e.boundVariables.topLeftRadius || e.boundVariables.topRightRadius || e.boundVariables.bottomLeftRadius || e.boundVariables.bottomRightRadius);
  if (e.cornerRadius !== void 0 && (!V || !e.boundVariables.cornerRadius) && (s.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (s.effects = e.effects), e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") {
    if (e.layoutMode !== void 0 && (["NONE", "HORIZONTAL", "VERTICAL"].includes(e.layoutMode) ? s.layoutMode = e.layoutMode : await a.warning(
      `Invalid layoutMode value "${e.layoutMode}" for node "${e.name || "Unnamed"}", skipping layoutMode setting`
    )), e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.boundVariables && d) {
      const y = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ];
      for (const c of y) {
        const l = e.boundVariables[c];
        if (l && pe(l)) {
          const b = l._varRef;
          if (b !== void 0) {
            const C = d.get(String(b));
            if (C) {
              const $ = {
                type: "VARIABLE_ALIAS",
                id: C.id
              };
              s.boundVariables || (s.boundVariables = {});
              const O = s[c], L = (I = s.boundVariables) == null ? void 0 : I[c];
              await a.log(
                `  DEBUG: Attempting to set bound variable for ${c} on "${e.name || "Unnamed"}": current value=${O}, current boundVar=${JSON.stringify(L)}`
              );
              try {
                delete s.boundVariables[c];
              } catch (U) {
              }
              try {
                s.boundVariables[c] = $;
                const U = (v = s.boundVariables) == null ? void 0 : v[c];
                await a.log(
                  `  DEBUG: Immediately after setting ${c} bound variable: ${JSON.stringify(U)}`
                );
              } catch (U) {
                await a.warning(
                  `  Error setting bound variable for ${c}: ${U}`
                );
              }
              const k = (x = s.boundVariables) == null ? void 0 : x[c];
              k && typeof k == "object" && k.type === "VARIABLE_ALIAS" && k.id === C.id ? await a.log(
                `  ✓ Set bound variable for ${c} on "${e.name || "Unnamed"}" (${e.type}): variable ${C.name} (ID: ${C.id.substring(0, 8)}...)`
              ) : await a.warning(
                `  Failed to set bound variable for ${c} on "${e.name || "Unnamed"}" - verification failed. Expected: ${JSON.stringify($)}, Got: ${JSON.stringify(k)}`
              );
            }
          }
        }
      }
    }
    e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.itemSpacing !== void 0 ? e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.itemSpacing ? await a.log(
      `  Skipping itemSpacing (bound to variable) for "${e.name || "Unnamed"}"`
    ) : (await a.log(
      `  Setting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (${e.type})`
    ), s.itemSpacing = e.itemSpacing, await a.log(
      `  ✓ Set itemSpacing to ${s.itemSpacing} (verified)`
    )) : (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && await a.log(
      `  DEBUG: Not setting itemSpacing for "${e.name || "Unnamed"}": layoutMode=${e.layoutMode}, itemSpacing=${e.itemSpacing}`
    ), e.layoutWrap !== void 0 && (s.layoutWrap = e.layoutWrap), e.primaryAxisSizingMode !== void 0 ? s.primaryAxisSizingMode = e.primaryAxisSizingMode : s.primaryAxisSizingMode = "AUTO", e.counterAxisSizingMode !== void 0 ? s.counterAxisSizingMode = e.counterAxisSizingMode : s.counterAxisSizingMode = "AUTO", e.primaryAxisAlignItems !== void 0 && (s.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (s.counterAxisAlignItems = e.counterAxisAlignItems);
    const p = e.boundVariables && typeof e.boundVariables == "object";
    if (p) {
      const y = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ].filter((c) => e.boundVariables[c]);
      y.length > 0 && await a.log(
        `  DEBUG: Node "${e.name || "Unnamed"}" (${e.type}) has bound variables for: ${y.join(", ")}`
      );
    }
    e.paddingLeft !== void 0 && (!p || !e.boundVariables.paddingLeft) && (s.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (!p || !e.boundVariables.paddingRight) && (s.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (!p || !e.boundVariables.paddingTop) && (s.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (!p || !e.boundVariables.paddingBottom) && (s.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (!p || !e.boundVariables.itemSpacing) && s.layoutMode !== void 0 && s.layoutMode !== "NONE" && s.itemSpacing !== e.itemSpacing && (await a.log(
      `  Setting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (late setting)`
    ), s.itemSpacing = e.itemSpacing), e.counterAxisSpacing !== void 0 && (!p || !e.boundVariables.counterAxisSpacing) && s.layoutMode !== void 0 && s.layoutMode !== "NONE" && (s.counterAxisSpacing = e.counterAxisSpacing), e.layoutGrow !== void 0 && (s.layoutGrow = e.layoutGrow);
  }
  if ((e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (s.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (s.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (s.dashPattern = e.dashPattern), e.type === "VECTOR")) {
    if (e.fillGeometry !== void 0)
      try {
        const { normalizeSvgPath: y } = await Promise.resolve().then(() => Dt), c = e.fillGeometry.map((l) => {
          const b = l.data;
          return {
            data: y(b),
            windingRule: l.windingRule || l.windRule || "NONZERO"
          };
        });
        for (let l = 0; l < e.fillGeometry.length; l++) {
          const b = e.fillGeometry[l].data, C = c[l].data;
          b !== C && await a.log(
            `  Normalized path ${l + 1} for "${e.name || "Unnamed"}": ${b.substring(0, 50)}... -> ${C.substring(0, 50)}...`
          );
        }
        s.vectorPaths = c, await a.log(
          `  Set vectorPaths for VECTOR "${e.name || "Unnamed"}" (${c.length} path(s))`
        );
      } catch (y) {
        await a.warning(
          `Error setting vectorPaths for VECTOR "${e.name || "Unnamed"}": ${y}`
        );
      }
    if (e.strokeGeometry !== void 0)
      try {
        s.strokeGeometry = e.strokeGeometry;
      } catch (y) {
        await a.warning(
          `Error setting strokeGeometry for VECTOR "${e.name || "Unnamed"}": ${y}`
        );
      }
    const p = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
    if (e.width !== void 0 && e.height !== void 0 && !p)
      try {
        s.resize(e.width, e.height), await a.log(
          `  Set size for VECTOR "${e.name || "Unnamed"}" to ${e.width}x${e.height}`
        );
      } catch (y) {
        await a.warning(
          `Error setting size for VECTOR "${e.name || "Unnamed"}": ${y}`
        );
      }
  }
  if (e.type === "TEXT" && e.characters !== void 0)
    try {
      if (e.fontName)
        try {
          await figma.loadFontAsync(e.fontName), s.fontName = e.fontName;
        } catch (y) {
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
      const p = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.fontSize || e.boundVariables.letterSpacing || e.boundVariables.lineHeight);
      e.fontSize !== void 0 && (!p || !e.boundVariables.fontSize) && (s.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (s.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (s.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (!p || !e.boundVariables.letterSpacing) && (s.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (!p || !e.boundVariables.lineHeight) && (s.lineHeight = e.lineHeight), e.textCase !== void 0 && (s.textCase = e.textCase), e.textDecoration !== void 0 && (s.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (s.textAutoResize = e.textAutoResize);
    } catch (p) {
      console.log("Error setting text properties: " + p);
      try {
        s.characters = e.characters;
      } catch (y) {
        console.log("Could not set text characters: " + y);
      }
    }
  if (e.boundVariables && d) {
    const p = [
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "paddingBottom",
      "itemSpacing"
    ];
    for (const [y, c] of Object.entries(
      e.boundVariables
    ))
      if (y !== "fills" && !p.includes(y) && pe(c) && n && d) {
        const l = c._varRef;
        if (l !== void 0) {
          const b = d.get(String(l));
          if (b)
            try {
              const C = {
                type: "VARIABLE_ALIAS",
                id: b.id
              };
              s.boundVariables || (s.boundVariables = {});
              const $ = s[y];
              $ !== void 0 && s.boundVariables[y] === void 0 && await a.warning(
                `  Property ${y} has direct value ${$} which may prevent bound variable from being set`
              ), s.boundVariables[y] = C;
              const L = (T = s.boundVariables) == null ? void 0 : T[y];
              if (L && typeof L == "object" && L.type === "VARIABLE_ALIAS" && L.id === b.id)
                await a.log(
                  `  ✓ Set bound variable for ${y} on "${e.name || "Unnamed"}" (${e.type}): variable ${b.name} (ID: ${b.id.substring(0, 8)}...)`
                );
              else {
                const k = (G = s.boundVariables) == null ? void 0 : G[y];
                await a.warning(
                  `  Failed to set bound variable for ${y} on "${e.name || "Unnamed"}" - bound variable not persisted. Property value: ${$}, Expected: ${JSON.stringify(C)}, Got: ${JSON.stringify(k)}`
                );
              }
            } catch (C) {
              await a.warning(
                `  Error setting bound variable for ${y} on "${e.name || "Unnamed"}": ${C}`
              );
            }
          else
            await a.warning(
              `  Variable reference ${l} not found in recognizedVariables for ${y} on "${e.name || "Unnamed"}"`
            );
        }
      }
  }
  if (e.boundVariables && d && (e.boundVariables.width || e.boundVariables.height)) {
    const p = e.boundVariables.width, y = e.boundVariables.height;
    if (p && pe(p)) {
      const c = p._varRef;
      if (c !== void 0) {
        const l = d.get(String(c));
        if (l) {
          const b = {
            type: "VARIABLE_ALIAS",
            id: l.id
          };
          s.boundVariables || (s.boundVariables = {}), s.boundVariables.width = b;
        }
      }
    }
    if (y && pe(y)) {
      const c = y._varRef;
      if (c !== void 0) {
        const l = d.get(String(c));
        if (l) {
          const b = {
            type: "VARIABLE_ALIAS",
            id: l.id
          };
          s.boundVariables || (s.boundVariables = {}), s.boundVariables.height = b;
        }
      }
    }
  }
  const _ = e.id && r && r.has(e.id) && s.type === "COMPONENT" && s.children && s.children.length > 0;
  if (e.children && Array.isArray(e.children) && s.type !== "INSTANCE" && !_) {
    const p = (c) => {
      const l = [];
      for (const b of c)
        b._truncated || (b.type === "COMPONENT" ? (l.push(b), b.children && Array.isArray(b.children) && l.push(...p(b.children))) : b.children && Array.isArray(b.children) && l.push(...p(b.children)));
      return l;
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
    const y = p(e.children);
    await a.log(
      `  First pass: Creating ${y.length} COMPONENT node(s) (without children)...`
    );
    for (const c of y)
      await a.log(
        `  Collected COMPONENT "${c.name || "Unnamed"}" (ID: ${c.id ? c.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const c of y)
      if (c.id && r && !r.has(c.id)) {
        const l = figma.createComponent();
        if (c.name !== void 0 && (l.name = c.name || "Unnamed Node"), c.componentPropertyDefinitions) {
          const b = c.componentPropertyDefinitions;
          let C = 0, $ = 0;
          for (const [O, L] of Object.entries(b))
            try {
              const U = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[L.type];
              if (!U) {
                await a.warning(
                  `  Unknown property type ${L.type} for property "${O}" in component "${c.name || "Unnamed"}"`
                ), $++;
                continue;
              }
              const D = L.defaultValue, K = O.split("#")[0];
              l.addComponentProperty(
                K,
                U,
                D
              ), C++;
            } catch (k) {
              await a.warning(
                `  Failed to add component property "${O}" to "${c.name || "Unnamed"}" in first pass: ${k}`
              ), $++;
            }
          C > 0 && await a.log(
            `  Added ${C} component property definition(s) to "${c.name || "Unnamed"}" in first pass${$ > 0 ? ` (${$} failed)` : ""}`
          );
        }
        r.set(c.id, l), await a.log(
          `  Created COMPONENT "${c.name || "Unnamed"}" (ID: ${c.id.substring(0, 8)}...) in first pass`
        );
      }
    for (const c of e.children) {
      if (c._truncated)
        continue;
      const l = await we(
        c,
        s,
        n,
        i,
        o,
        d,
        r,
        g,
        f,
        h,
        // Pass deferredInstances through for recursive calls
        e,
        // parentNodeData - pass the parent's nodeData so children can check for auto-layout
        N
      );
      if (l && l.parent !== s) {
        if (l.parent && typeof l.parent.removeChild == "function")
          try {
            l.parent.removeChild(l);
          } catch (b) {
            await a.warning(
              `Failed to remove child "${l.name || "Unnamed"}" from parent "${l.parent.name || "Unnamed"}": ${b}`
            );
          }
        s.appendChild(l);
      }
    }
  }
  if (t && s.parent !== t) {
    if (s.parent && typeof s.parent.removeChild == "function")
      try {
        s.parent.removeChild(s);
      } catch (p) {
        await a.warning(
          `Failed to remove node "${s.name || "Unnamed"}" from parent "${s.parent.name || "Unnamed"}": ${p}`
        );
      }
    t.appendChild(s);
  }
  if ((s.type === "FRAME" || s.type === "COMPONENT" || s.type === "INSTANCE") && e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.itemSpacing !== void 0 && !(e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.itemSpacing)) {
    const y = s.itemSpacing;
    y !== e.itemSpacing ? (await a.log(
      `  FINAL FIX: Resetting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (was ${y})`
    ), s.itemSpacing = e.itemSpacing, await a.log(
      `  FINAL FIX: Verified itemSpacing is now ${s.itemSpacing}`
    )) : await a.log(
      `  FINAL CHECK: itemSpacing is already correct (${y}) for "${e.name || "Unnamed"}"`
    );
  }
  return s;
}
async function ca(e, t, n) {
  let i = 0, o = 0, d = 0;
  const r = (f) => {
    const h = [];
    if (f.type === "INSTANCE" && h.push(f), "children" in f && f.children)
      for (const u of f.children)
        h.push(...r(u));
    return h;
  }, g = r(e);
  await a.log(
    `  Found ${g.length} instance(s) to process for variant properties`
  );
  for (const f of g)
    try {
      const h = await f.getMainComponentAsync();
      if (!h) {
        o++;
        continue;
      }
      const u = t.getSerializedTable();
      let N = null, s;
      if (n._instanceTableMap ? (s = n._instanceTableMap.get(
        f.id
      ), s !== void 0 ? (N = u[s], await a.log(
        `  Found instance table index ${s} for instance "${f.name}" (ID: ${f.id.substring(0, 8)}...)`
      )) : await a.log(
        `  No instance table index mapping found for instance "${f.name}" (ID: ${f.id.substring(0, 8)}...), using fallback matching`
      )) : await a.log(
        `  No instance table map found, using fallback matching for instance "${f.name}"`
      ), !N) {
        for (const [A, S] of Object.entries(u))
          if (S.instanceType === "internal" && S.componentNodeId && n.has(S.componentNodeId)) {
            const m = n.get(S.componentNodeId);
            if (m && m.id === h.id) {
              N = S, await a.log(
                `  Matched instance "${f.name}" to instance table entry ${A} by component (less precise)`
              );
              break;
            }
          }
      }
      if (!N) {
        await a.log(
          `  No matching entry found for instance "${f.name}" (main component: ${h.name}, ID: ${h.id.substring(0, 8)}...)`
        ), o++;
        continue;
      }
      if (!N.variantProperties) {
        await a.log(
          `  Instance table entry for "${f.name}" has no variant properties`
        ), o++;
        continue;
      }
      await a.log(
        `  Instance "${f.name}" matched to entry with variant properties: ${JSON.stringify(N.variantProperties)}`
      );
      let w = null;
      if (h.parent && h.parent.type === "COMPONENT_SET" && (w = h.parent.componentPropertyDefinitions), w) {
        const A = {};
        for (const [S, m] of Object.entries(
          N.variantProperties
        )) {
          const M = S.split("#")[0];
          w[M] && (A[M] = m);
        }
        Object.keys(A).length > 0 ? (f.setProperties(A), i++, await a.log(
          `  ✓ Set variant properties on instance "${f.name}": ${JSON.stringify(A)}`
        )) : o++;
      } else
        o++;
    } catch (h) {
      d++, await a.warning(
        `  Failed to set variant properties on instance "${f.name}": ${h}`
      );
    }
  await a.log(
    `  Variant properties set: ${i} processed, ${o} skipped, ${d} errors`
  );
}
async function Ze(e) {
  await figma.loadAllPagesAsync();
  const t = figma.root.children, n = new Set(t.map((d) => d.name));
  if (!n.has(e))
    return e;
  let i = 1, o = `${e}_${i}`;
  for (; n.has(o); )
    i++, o = `${e}_${i}`;
  return o;
}
async function la(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), n = new Set(t.map((d) => d.name));
  if (!n.has(e))
    return e;
  let i = 1, o = `${e}_${i}`;
  for (; n.has(o); )
    i++, o = `${e}_${i}`;
  return o;
}
async function da(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const d of e.variableIds)
    try {
      const r = await figma.variables.getVariableByIdAsync(d);
      r && n.add(r.name);
    } catch (r) {
      continue;
    }
  if (!n.has(t))
    return t;
  let i = 1, o = `${t}_${i}`;
  for (; n.has(o); )
    i++, o = `${t}_${i}`;
  return o;
}
function lt(e, t) {
  const n = e.resolvedType.toUpperCase(), i = t.toUpperCase();
  return n === i;
}
async function ga(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), n = ae(e.collectionName);
  if (de(e.collectionName)) {
    for (const i of t)
      if (ae(i.name) === n)
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
        re
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
function pa(e) {
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
function We(e) {
  if (!e.stringTable)
    return {
      success: !1,
      error: "Invalid JSON format. String table is required."
    };
  let t;
  try {
    t = Ve.fromTable(e.stringTable);
  } catch (i) {
    return {
      success: !1,
      error: `Failed to load string table: ${i instanceof Error ? i.message : "Unknown error"}`
    };
  }
  const n = ea(e, t);
  return {
    success: !0,
    stringTable: t,
    expandedJsonData: n
  };
}
function ma(e) {
  if (!e.collections)
    return {
      success: !1,
      error: "No collections table found in JSON"
    };
  try {
    return {
      success: !0,
      collectionTable: ve.fromTable(
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
async function fa(e, t) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), d = e.getTable();
  for (const [r, g] of Object.entries(d)) {
    if (g.isLocal === !1) {
      await a.log(
        `Skipping remote collection: "${g.collectionName}" (index ${r})`
      );
      continue;
    }
    const f = ae(g.collectionName), h = t == null ? void 0 : t.get(f);
    if (h) {
      await a.log(
        `✓ Using pre-created collection: "${f}" (index ${r})`
      ), n.set(r, h);
      continue;
    }
    const u = await ga(g);
    u.matchType === "recognized" ? (await a.log(
      `✓ Recognized collection by GUID: "${g.collectionName}" (index ${r})`
    ), n.set(r, u.collection)) : u.matchType === "potential" ? (await a.log(
      `? Potential match by name: "${g.collectionName}" (index ${r})`
    ), i.set(r, {
      entry: g,
      collection: u.collection
    })) : (await a.log(
      `✗ No match found for collection: "${g.collectionName}" (index ${r}) - will create new`
    ), o.set(r, g));
  }
  return await a.log(
    `Collection matching complete: ${n.size} recognized, ${i.size} potential matches, ${o.size} to create`
  ), {
    recognizedCollections: n,
    potentialMatches: i,
    collectionsToCreate: o
  };
}
async function ua(e, t, n, i) {
  if (e.size !== 0) {
    if (i) {
      await a.log(
        `Using wizard selections for ${e.size} potential match(es)...`
      );
      for (const [o, { entry: d, collection: r }] of e.entries()) {
        const g = ae(
          d.collectionName
        ).toLowerCase();
        let f = !1;
        g === "tokens" || g === "token" ? f = i.tokens === "existing" : g === "theme" || g === "themes" ? f = i.theme === "existing" : (g === "layer" || g === "layers") && (f = i.layers === "existing");
        const h = de(d.collectionName) ? ae(d.collectionName) : r.name;
        f ? (await a.log(
          `✓ Wizard selection: Using existing collection "${h}" (index ${o})`
        ), t.set(o, r), await me(r, d.modes), await a.log(
          `  ✓ Ensured modes for collection "${h}" (${d.modes.length} mode(s))`
        )) : (await a.log(
          `✗ Wizard selection: Will create new collection for "${d.collectionName}" (index ${o})`
        ), n.set(o, d));
      }
      return;
    }
    await a.log(
      `Prompting user for ${e.size} potential match(es)...`
    );
    for (const [o, { entry: d, collection: r }] of e.entries())
      try {
        const g = de(d.collectionName) ? ae(d.collectionName) : r.name, f = `Found existing "${g}" variable collection. Should I use it?`;
        await a.log(
          `Prompting user about potential match: "${g}"`
        ), await be.prompt(f, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await a.log(
          `✓ User confirmed: Using existing collection "${g}" (index ${o})`
        ), t.set(o, r), await me(r, d.modes), await a.log(
          `  ✓ Ensured modes for collection "${g}" (${d.modes.length} mode(s))`
        );
      } catch (g) {
        await a.log(
          `✗ User rejected: Will create new collection for "${d.collectionName}" (index ${o})`
        ), n.set(o, d);
      }
  }
}
async function ha(e, t, n) {
  if (e.size === 0)
    return;
  await a.log("Ensuring modes exist for recognized collections...");
  const i = t.getTable();
  for (const [o, d] of e.entries()) {
    const r = i[o];
    r && (n.has(o) || (await me(d, r.modes), await a.log(
      `  ✓ Ensured modes for collection "${d.name}" (${r.modes.length} mode(s))`
    )));
  }
}
async function ya(e, t, n, i) {
  if (e.size !== 0) {
    await a.log(
      `Processing ${e.size} collection(s) to create...`
    );
    for (const [o, d] of e.entries()) {
      const r = ae(d.collectionName), g = i == null ? void 0 : i.get(r);
      if (g) {
        await a.log(
          `Reusing pre-created collection: "${r}" (index ${o}, id: ${g.id.substring(0, 8)}...)`
        ), t.set(o, g), await me(g, d.modes), n.push(g);
        continue;
      }
      const f = await la(r);
      f !== r ? await a.log(
        `Creating collection: "${f}" (normalized: "${r}" - name conflict resolved)`
      ) : await a.log(`Creating collection: "${f}"`);
      const h = figma.variables.createVariableCollection(f);
      n.push(h);
      let u;
      if (de(d.collectionName)) {
        const N = Me(d.collectionName);
        N && (u = N);
      } else d.collectionGuid && (u = d.collectionGuid);
      u && (h.setSharedPluginData(
        "recursica",
        re,
        u
      ), await a.log(
        `  Stored GUID: ${u.substring(0, 8)}...`
      )), await me(h, d.modes), await a.log(
        `  ✓ Created collection "${f}" with ${d.modes.length} mode(s)`
      ), t.set(o, h);
    }
    await a.log("Collection creation complete");
  }
}
function ba(e) {
  if (!e.variables)
    return {
      success: !1,
      error: "No variables table found in JSON"
    };
  try {
    return {
      success: !0,
      variableTable: Ee.fromTable(e.variables)
    };
  } catch (t) {
    return {
      success: !1,
      error: `Failed to load variables table: ${t instanceof Error ? t.message : "Unknown error"}`
    };
  }
}
async function wa(e, t, n, i) {
  const o = /* @__PURE__ */ new Map(), d = [], r = new Set(
    i.map((N) => N.id)
  );
  await a.log("Matching and creating variables in collections...");
  const g = e.getTable(), f = /* @__PURE__ */ new Map();
  for (const [N, s] of Object.entries(g)) {
    if (s._colRef === void 0)
      continue;
    const w = n.get(String(s._colRef));
    if (!w)
      continue;
    f.has(w.id) || f.set(w.id, {
      collectionName: w.name,
      existing: 0,
      created: 0
    });
    const A = f.get(w.id), S = r.has(
      w.id
    );
    let m;
    typeof s.variableType == "number" ? m = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[s.variableType] || String(s.variableType) : m = s.variableType;
    const M = await Je(
      w,
      s.variableName
    );
    if (M)
      if (lt(M, m))
        o.set(N, M), A.existing++;
      else {
        await a.warning(
          `Type mismatch for variable "${s.variableName}" in collection "${w.name}": expected ${m}, found ${M.resolvedType}. Creating new variable with incremented name.`
        );
        const E = await da(
          w,
          s.variableName
        ), R = await ze(
          ee(J({}, s), {
            variableName: E,
            variableType: m
          }),
          w,
          e,
          t
        );
        S || d.push(R), o.set(N, R), A.created++;
      }
    else {
      const E = await ze(
        ee(J({}, s), {
          variableType: m
        }),
        w,
        e,
        t
      );
      S || d.push(E), o.set(N, E), A.created++;
    }
  }
  await a.log("Variable processing complete:");
  for (const N of f.values())
    await a.log(
      `  "${N.collectionName}": ${N.existing} existing, ${N.created} created`
    );
  await a.log(
    "Final verification: Reading back all COLOR variables..."
  );
  let h = 0, u = 0;
  for (const N of d)
    if (N.resolvedType === "COLOR") {
      const s = await figma.variables.getVariableCollectionByIdAsync(
        N.variableCollectionId
      );
      if (!s) {
        await a.warning(
          `  ⚠️ Variable "${N.name}" has no variableCollection (ID: ${N.variableCollectionId})`
        );
        continue;
      }
      const w = s.modes;
      if (!w || w.length === 0) {
        await a.warning(
          `  ⚠️ Variable "${N.name}" collection has no modes`
        );
        continue;
      }
      for (const A of w) {
        const S = N.valuesByMode[A.modeId];
        if (S && typeof S == "object" && "r" in S) {
          const m = S;
          Math.abs(m.r - 1) < 0.01 && Math.abs(m.g - 1) < 0.01 && Math.abs(m.b - 1) < 0.01 ? (u++, await a.warning(
            `  ⚠️ Variable "${N.name}" mode "${A.name}" is WHITE: r=${m.r.toFixed(3)}, g=${m.g.toFixed(3)}, b=${m.b.toFixed(3)}`
          )) : (h++, await a.log(
            `  ✓ Variable "${N.name}" mode "${A.name}" has color: r=${m.r.toFixed(3)}, g=${m.g.toFixed(3)}, b=${m.b.toFixed(3)}`
          ));
        } else S && typeof S == "object" && "type" in S || await a.warning(
          `  ⚠️ Variable "${N.name}" mode "${A.name}" has unexpected value type: ${JSON.stringify(S)}`
        );
      }
    }
  return await a.log(
    `Final verification complete: ${h} color variables verified, ${u} white variables found`
  ), {
    recognizedVariables: o,
    newlyCreatedVariables: d
  };
}
function $a(e) {
  if (!e.instances)
    return null;
  try {
    return Ae.fromTable(e.instances);
  } catch (t) {
    return null;
  }
}
function Na(e) {
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
function Ke(e) {
  if (!e || typeof e != "object")
    return;
  e.type !== void 0 && (e.type = Na(e.type));
  const t = e.children !== void 0 ? "children" : e.child !== void 0 ? "child" : null;
  if (t && (t === "child" && !e.children && (e.children = e.child, delete e.child), Array.isArray(e.children)))
    for (const n of e.children)
      Ke(n);
  e.fillG !== void 0 && e.fillGeometry === void 0 && (e.fillGeometry = e.fillG, delete e.fillG), e.strkG !== void 0 && e.strokeGeometry === void 0 && (e.strokeGeometry = e.strkG, delete e.strkG), e.child && !e.children && (e.children = e.child, delete e.child);
}
async function va(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const d of e.children)
    (d.type === "FRAME" || d.type === "COMPONENT") && n.add(d.name);
  if (!n.has(t))
    return t;
  let i = 1, o = `${t}_${i}`;
  for (; n.has(o); )
    i++, o = `${t}_${i}`;
  return o;
}
async function Ea(e, t, n, i, o, d = "") {
  var A;
  const r = e.getSerializedTable(), g = Object.values(r).filter(
    (S) => S.instanceType === "remote"
  ), f = /* @__PURE__ */ new Map();
  if (g.length === 0)
    return await a.log("No remote instances found"), f;
  await a.log(
    `Processing ${g.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  const h = figma.root.children, u = d ? `${d} REMOTES` : "REMOTES";
  let N = h.find(
    (S) => S.name === "REMOTES" || S.name === u
  );
  if (N ? (await a.log("Found existing REMOTES page"), d && !N.name.startsWith(d) && (N.name = u)) : (N = figma.createPage(), N.name = u, await a.log("Created REMOTES page")), g.length > 0 && (N.setPluginData("RecursicaUnderReview", "true"), await a.log("Marked REMOTES page as under review")), !N.children.some(
    (S) => S.type === "FRAME" && S.name === "Title"
  )) {
    const S = { family: "Inter", style: "Bold" }, m = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(S), await figma.loadFontAsync(m);
    const M = figma.createFrame();
    M.name = "Title", M.layoutMode = "VERTICAL", M.paddingTop = 20, M.paddingBottom = 20, M.paddingLeft = 20, M.paddingRight = 20, M.fills = [];
    const E = figma.createText();
    E.fontName = S, E.characters = "REMOTE INSTANCES", E.fontSize = 24, E.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], M.appendChild(E);
    const R = figma.createText();
    R.fontName = m, R.characters = "These are remotely connected component instances found in our different component pages.", R.fontSize = 14, R.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], M.appendChild(R), N.appendChild(M), await a.log("Created title and description on REMOTES page");
  }
  const w = /* @__PURE__ */ new Map();
  for (const [S, m] of Object.entries(r)) {
    if (m.instanceType !== "remote")
      continue;
    const M = parseInt(S, 10);
    if (await a.log(
      `Processing remote instance ${M}: "${m.componentName}"`
    ), !m.structure) {
      await a.warning(
        `Remote instance "${m.componentName}" missing structure data, skipping`
      );
      continue;
    }
    Ke(m.structure);
    const E = m.structure.children !== void 0, R = m.structure.child !== void 0, V = m.structure.children ? m.structure.children.length : m.structure.child ? m.structure.child.length : 0;
    await a.log(
      `  Structure type: ${m.structure.type || "unknown"}, has children: ${V} (children key: ${E}, child key: ${R})`
    );
    let _ = m.componentName;
    if (m.path && m.path.length > 0) {
      const I = m.path.filter((v) => v !== "").join(" / ");
      I && (_ = `${I} / ${m.componentName}`);
    }
    const P = await va(
      N,
      _
    );
    P !== _ && await a.log(
      `Component name conflict: "${_}" -> "${P}"`
    );
    try {
      if (m.structure.type !== "COMPONENT") {
        await a.warning(
          `Remote instance "${m.componentName}" structure is not a COMPONENT (type: ${m.structure.type}), creating frame fallback`
        );
        const v = figma.createFrame();
        v.name = P;
        const x = await we(
          m.structure,
          v,
          t,
          n,
          null,
          i,
          w,
          !0,
          // isRemoteStructure: true
          null,
          // remoteComponentMap - not needed here
          null,
          // deferredInstances - not needed for remote instances
          null,
          // parentNodeData - not available for remote structures
          o
        );
        x ? (v.appendChild(x), N.appendChild(v), await a.log(
          `✓ Created remote instance frame fallback: "${P}"`
        )) : v.remove();
        continue;
      }
      const I = figma.createComponent();
      I.name = P, N.appendChild(I), await a.log(
        `  Created component node: "${P}"`
      );
      try {
        if (m.structure.componentPropertyDefinitions) {
          const c = m.structure.componentPropertyDefinitions;
          let l = 0, b = 0;
          for (const [C, $] of Object.entries(c))
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
              }[$.type];
              if (!L) {
                await a.warning(
                  `  Unknown property type ${$.type} for property "${C}" in component "${m.componentName}"`
                ), b++;
                continue;
              }
              const k = $.defaultValue, U = C.split("#")[0];
              I.addComponentProperty(
                U,
                L,
                k
              ), l++;
            } catch (O) {
              await a.warning(
                `  Failed to add component property "${C}" to "${m.componentName}": ${O}`
              ), b++;
            }
          l > 0 && await a.log(
            `  Added ${l} component property definition(s) to "${m.componentName}"${b > 0 ? ` (${b} failed)` : ""}`
          );
        }
        m.structure.name !== void 0 && (I.name = m.structure.name);
        const v = m.structure.boundVariables && typeof m.structure.boundVariables == "object" && (m.structure.boundVariables.width || m.structure.boundVariables.height);
        m.structure.width !== void 0 && m.structure.height !== void 0 && !v && I.resize(m.structure.width, m.structure.height), m.structure.x !== void 0 && (I.x = m.structure.x), m.structure.y !== void 0 && (I.y = m.structure.y);
        const x = m.structure.boundVariables && typeof m.structure.boundVariables == "object";
        if (m.structure.visible !== void 0 && (I.visible = m.structure.visible), m.structure.opacity !== void 0 && (!x || !m.structure.boundVariables.opacity) && (I.opacity = m.structure.opacity), m.structure.rotation !== void 0 && (!x || !m.structure.boundVariables.rotation) && (I.rotation = m.structure.rotation), m.structure.blendMode !== void 0 && (!x || !m.structure.boundVariables.blendMode) && (I.blendMode = m.structure.blendMode), m.structure.fills !== void 0)
          try {
            let c = m.structure.fills;
            Array.isArray(c) && (c = c.map((l) => {
              if (l && typeof l == "object") {
                const b = J({}, l);
                return delete b.boundVariables, b;
              }
              return l;
            })), I.fills = c, (A = m.structure.boundVariables) != null && A.fills && i && await ra(
              I,
              m.structure.boundVariables,
              "fills",
              i
            );
          } catch (c) {
            await a.warning(
              `Error setting fills for remote component "${m.componentName}": ${c}`
            );
          }
        if (m.structure.strokes !== void 0)
          try {
            I.strokes = m.structure.strokes;
          } catch (c) {
            await a.warning(
              `Error setting strokes for remote component "${m.componentName}": ${c}`
            );
          }
        const T = m.structure.boundVariables && typeof m.structure.boundVariables == "object" && (m.structure.boundVariables.strokeWeight || m.structure.boundVariables.strokeAlign);
        m.structure.strokeWeight !== void 0 && (!T || !m.structure.boundVariables.strokeWeight) && (I.strokeWeight = m.structure.strokeWeight), m.structure.strokeAlign !== void 0 && (!T || !m.structure.boundVariables.strokeAlign) && (I.strokeAlign = m.structure.strokeAlign), m.structure.layoutMode !== void 0 && (I.layoutMode = m.structure.layoutMode), m.structure.primaryAxisSizingMode !== void 0 && (I.primaryAxisSizingMode = m.structure.primaryAxisSizingMode), m.structure.counterAxisSizingMode !== void 0 && (I.counterAxisSizingMode = m.structure.counterAxisSizingMode);
        const G = m.structure.boundVariables && typeof m.structure.boundVariables == "object";
        m.structure.paddingLeft !== void 0 && (!G || !m.structure.boundVariables.paddingLeft) && (I.paddingLeft = m.structure.paddingLeft), m.structure.paddingRight !== void 0 && (!G || !m.structure.boundVariables.paddingRight) && (I.paddingRight = m.structure.paddingRight), m.structure.paddingTop !== void 0 && (!G || !m.structure.boundVariables.paddingTop) && (I.paddingTop = m.structure.paddingTop), m.structure.paddingBottom !== void 0 && (!G || !m.structure.boundVariables.paddingBottom) && (I.paddingBottom = m.structure.paddingBottom), m.structure.itemSpacing !== void 0 && (!G || !m.structure.boundVariables.itemSpacing) && (I.itemSpacing = m.structure.itemSpacing);
        const p = m.structure.boundVariables && typeof m.structure.boundVariables == "object" && (m.structure.boundVariables.cornerRadius || m.structure.boundVariables.topLeftRadius || m.structure.boundVariables.topRightRadius || m.structure.boundVariables.bottomLeftRadius || m.structure.boundVariables.bottomRightRadius);
        if (m.structure.cornerRadius !== void 0 && (!p || !m.structure.boundVariables.cornerRadius) && (I.cornerRadius = m.structure.cornerRadius), m.structure.boundVariables && i) {
          const c = m.structure.boundVariables, l = [
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
          for (const b of l)
            if (c[b] && pe(c[b])) {
              const C = c[b]._varRef;
              if (C !== void 0) {
                const $ = i.get(String(C));
                if ($) {
                  const O = {
                    type: "VARIABLE_ALIAS",
                    id: $.id
                  };
                  I.boundVariables || (I.boundVariables = {}), I.boundVariables[b] = O;
                }
              }
            }
        }
        await a.log(
          `  DEBUG: Structure keys: ${Object.keys(m.structure).join(", ")}, has children: ${!!m.structure.children}, has child: ${!!m.structure.child}`
        );
        const y = m.structure.children || (m.structure.child ? m.structure.child : null);
        if (await a.log(
          `  DEBUG: childrenArray exists: ${!!y}, isArray: ${Array.isArray(y)}, length: ${y ? y.length : 0}`
        ), y && Array.isArray(y) && y.length > 0) {
          await a.log(
            `  Recreating ${y.length} child(ren) for component "${m.componentName}"`
          );
          for (let c = 0; c < y.length; c++) {
            const l = y[c];
            if (await a.log(
              `  DEBUG: Processing child ${c + 1}/${y.length}: ${JSON.stringify({ name: l == null ? void 0 : l.name, type: l == null ? void 0 : l.type, hasTruncated: !!(l != null && l._truncated) })}`
            ), l._truncated) {
              await a.log(
                `  Skipping truncated child: ${l._reason || "Unknown"}`
              );
              continue;
            }
            await a.log(
              `  Recreating child: "${l.name || "Unnamed"}" (type: ${l.type})`
            );
            const b = await we(
              l,
              I,
              t,
              n,
              null,
              i,
              w,
              !0,
              // isRemoteStructure: true
              null,
              // remoteComponentMap - not needed here
              null,
              // deferredInstances - not needed for remote instances
              m.structure,
              // parentNodeData - pass the component's structure so children can check for auto-layout
              o
            );
            b ? (I.appendChild(b), await a.log(
              `  ✓ Appended child "${l.name || "Unnamed"}" to component "${m.componentName}"`
            )) : await a.warning(
              `  ✗ Failed to create child "${l.name || "Unnamed"}" (type: ${l.type})`
            );
          }
        }
        f.set(M, I), await a.log(
          `✓ Created remote component: "${P}" (index ${M})`
        );
      } catch (v) {
        await a.warning(
          `Error populating remote component "${m.componentName}": ${v instanceof Error ? v.message : "Unknown error"}`
        ), I.remove();
      }
    } catch (I) {
      await a.warning(
        `Error recreating remote instance "${m.componentName}": ${I instanceof Error ? I.message : "Unknown error"}`
      );
    }
  }
  return await a.log(
    `Remote instance processing complete: ${f.size} component(s) created`
  ), f;
}
async function Aa(e, t, n, i, o, d, r = null, g = null, f = !1, h = null, u = !1, N = !1, s = "") {
  await a.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const w = figma.root.children, A = "RecursicaPublishedMetadata";
  let S = null;
  for (const x of w) {
    const T = x.getPluginData(A);
    if (T)
      try {
        if (JSON.parse(T).id === e.guid) {
          S = x;
          break;
        }
      } catch (G) {
        continue;
      }
  }
  let m = !1;
  if (S && !f && !u) {
    let x;
    try {
      const p = S.getPluginData(A);
      p && (x = JSON.parse(p).version);
    } catch (p) {
    }
    const T = x !== void 0 ? ` v${x}` : "", G = `Found existing component "${S.name}${T}". Should I use it or create a copy?`;
    await a.log(
      `Found existing page with same GUID: "${S.name}". Prompting user...`
    );
    try {
      await be.prompt(G, {
        okLabel: "Use",
        cancelLabel: "Copy",
        timeoutMs: 3e5
        // 5 minutes
      }), m = !0, await a.log(
        `User chose to use existing page: "${S.name}"`
      );
    } catch (p) {
      await a.log(
        "User chose to create a copy. Will create new page."
      );
    }
  }
  if (m && S)
    return await figma.setCurrentPageAsync(S), await a.log(
      `Using existing page: "${S.name}" (GUID: ${e.guid.substring(0, 8)}...)`
    ), await a.log(
      `  Instances from other pages will resolve to components on this existing page using componentPageName: "${S.name}"`
    ), {
      success: !0,
      page: S,
      // Include pageId so it can be tracked in importedPages
      pageId: S.id
    };
  const M = w.find((x) => x.name === e.name);
  M && await a.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let E;
  if (S || M) {
    const x = `__${e.name}`;
    E = await Ze(x), await a.log(
      `Creating scratch page: "${E}" (will be renamed to "${e.name}" on success)`
    );
  } else
    E = e.name, await a.log(`Creating page: "${E}"`);
  const R = figma.createPage();
  if (R.name = E, await figma.setCurrentPageAsync(R), await a.log(`Switched to page: "${E}"`), !t.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await a.log("Recreating page structure...");
  const V = t.pageData;
  if (V.backgrounds !== void 0)
    try {
      R.backgrounds = V.backgrounds, await a.log(
        `Set page background: ${JSON.stringify(V.backgrounds)}`
      );
    } catch (x) {
      await a.warning(`Failed to set page background: ${x}`);
    }
  Ke(V);
  const _ = /* @__PURE__ */ new Map(), P = (x, T = []) => {
    if (x.type === "COMPONENT" && x.id && T.push(x.id), x.children && Array.isArray(x.children))
      for (const G of x.children)
        G._truncated || P(G, T);
    return T;
  }, I = P(V);
  if (await a.log(
    `Found ${I.length} COMPONENT node(s) in page data`
  ), I.length > 0 && (await a.log(
    `Component IDs in page data (first 20): ${I.slice(0, 20).map((x) => x.substring(0, 8) + "...").join(", ")}`
  ), V._allComponentIds = I), V.children && Array.isArray(V.children))
    for (const x of V.children) {
      const T = await we(
        x,
        R,
        n,
        i,
        o,
        d,
        _,
        !1,
        // isRemoteStructure: false - we're creating the main page
        r,
        g,
        V,
        // parentNodeData - pass the page's nodeData so children can check for auto-layout
        h
      );
      T && R.appendChild(T);
    }
  await a.log("Page structure recreated successfully"), o && (await a.log(
    "Third pass: Setting variant properties on instances..."
  ), await ca(
    R,
    o,
    _
  ));
  const v = {
    _ver: 1,
    id: e.guid,
    name: e.name,
    version: e.version || 0,
    publishDate: (/* @__PURE__ */ new Date()).toISOString(),
    history: {}
  };
  if (R.setPluginData(A, JSON.stringify(v)), await a.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), E.startsWith("__")) {
    let x;
    N ? x = s ? `${s} ${e.name}` : e.name : x = await Ze(e.name), R.name = x, await a.log(`Renamed page from "${E}" to "${x}"`);
  } else N && s && (R.name.startsWith(s) || (R.name = `${s} ${R.name}`));
  return {
    success: !0,
    page: R,
    deferredInstances: g || void 0
  };
}
async function dt(e) {
  var i, o, d;
  e.clearConsole !== !1 && await a.clear(), await a.log("=== Starting Page Import ===");
  const n = [];
  try {
    const r = e.jsonData;
    if (!r)
      return await a.error("JSON data is required"), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "JSON data is required",
        data: {}
      };
    await a.log("Validating metadata...");
    const g = pa(r);
    if (!g.success)
      return await a.error(g.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: g.error,
        data: {}
      };
    const f = g.metadata;
    await a.log(
      `Metadata validated: guid=${f.guid}, name=${f.name}`
    ), await a.log("Loading string table...");
    const h = We(r);
    if (!h.success)
      return await a.error(h.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: h.error,
        data: {}
      };
    await a.log("String table loaded successfully"), await a.log("Expanding JSON data...");
    const u = h.expandedJsonData;
    await a.log("JSON expanded successfully"), await a.log("Loading collections table...");
    const N = ma(u);
    if (!N.success)
      return N.error === "No collections table found in JSON" ? (await a.log(N.error), await a.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: f.name }
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
    const { recognizedCollections: w, potentialMatches: A, collectionsToCreate: S } = await fa(s, e.preCreatedCollections);
    await ua(
      A,
      w,
      S,
      e.collectionChoices
    ), await ha(
      w,
      s,
      A
    ), await ya(
      S,
      w,
      n,
      e.preCreatedCollections
    ), await a.log("Loading variables table...");
    const m = ba(u);
    if (!m.success)
      return m.error === "No variables table found in JSON" ? (await a.log(m.error), await a.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no variables to process)",
        data: { pageName: f.name }
      }) : (await a.error(m.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: m.error,
        data: {}
      });
    const M = m.variableTable;
    await a.log(
      `Loaded variables table with ${M.getSize()} variable(s)`
    );
    const { recognizedVariables: E, newlyCreatedVariables: R } = await wa(
      M,
      s,
      w,
      n
    );
    await a.log("Loading instance table...");
    const V = $a(u);
    if (V) {
      const C = V.getSerializedTable(), $ = Object.values(C).filter(
        (L) => L.instanceType === "internal"
      ), O = Object.values(C).filter(
        (L) => L.instanceType === "remote"
      );
      await a.log(
        `Loaded instance table with ${V.getSize()} instance(s) (${$.length} internal, ${O.length} remote)`
      );
    } else
      await a.log("No instance table found in JSON");
    const _ = [], P = (i = e.isMainPage) != null ? i : !0, I = (o = e.alwaysCreateCopy) != null ? o : !1, v = (d = e.skipUniqueNaming) != null ? d : !1, x = e.constructionIcon || "";
    let T = null;
    V && (T = await Ea(
      V,
      M,
      s,
      E,
      w,
      x
    ));
    const G = await Aa(
      f,
      u,
      M,
      s,
      V,
      E,
      T,
      _,
      P,
      w,
      I,
      v,
      x
    );
    if (!G.success)
      return await a.error(G.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: G.error,
        data: {}
      };
    const p = G.page, y = E.size + R.length, c = G.deferredInstances || _, l = (c == null ? void 0 : c.length) || 0;
    if (await a.log("=== Import Complete ==="), await a.log(
      `Successfully processed ${w.size} collection(s), ${y} variable(s), and created page "${p.name}"${l > 0 ? ` (${l} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`
    ), l > 0) {
      await a.log(
        `  [DEBUG] Returning ${l} deferred instance(s) in response`
      );
      for (const C of c)
        await a.log(
          `    - "${C.nodeData.name}" from page "${C.instanceEntry.componentPageName}"`
        );
    }
    const b = G.pageId || p.id;
    return {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: {
        pageName: p.name,
        pageId: b,
        // Include pageId for tracking (used for both new and reused pages)
        deferredInstances: l > 0 ? c : void 0,
        createdEntities: {
          pageIds: [p.id],
          collectionIds: n.map((C) => C.id),
          variableIds: R.map((C) => C.id)
        }
      }
    };
  } catch (r) {
    const g = r instanceof Error ? r.message : "Unknown error occurred";
    return await a.error(`Import failed: ${g}`), r instanceof Error && r.stack && await a.error(`Stack trace: ${r.stack}`), console.error("Error importing page:", r), {
      type: "importPage",
      success: !1,
      error: !0,
      message: g,
      data: {}
    };
  }
}
async function gt(e, t = "") {
  if (e.length === 0)
    return { resolved: 0, failed: 0, errors: [] };
  await a.log(
    `=== Resolving ${e.length} deferred normal instance(s) ===`
  );
  let n = 0, i = 0;
  const o = [];
  await figma.loadAllPagesAsync();
  for (const d of e)
    try {
      const { placeholderFrameId: r, instanceEntry: g, nodeData: f, parentNodeId: h } = d, u = await figma.getNodeByIdAsync(
        r
      ), N = await figma.getNodeByIdAsync(
        h
      );
      if (!u || !N) {
        const E = `Deferred instance "${f.name}" - could not find placeholder frame (${r}) or parent node (${h})`;
        await a.error(E), o.push(E), i++;
        continue;
      }
      let s = figma.root.children.find((E) => {
        const R = E.name === g.componentPageName, V = t && E.name === `${t} ${g.componentPageName}`;
        return R || V;
      });
      if (!s) {
        const E = Y(
          g.componentPageName
        );
        s = figma.root.children.find((R) => Y(R.name) === E);
      }
      if (!s && t) {
        const E = figma.root.children.map((R) => R.name).slice(0, 10);
        await a.log(
          `  [DEBUG] Looking for page "${g.componentPageName}" (or "${t} ${g.componentPageName}"). Available pages (first 10): ${E.join(", ")}`
        );
      }
      if (!s) {
        const E = t ? `"${g.componentPageName}" or "${t} ${g.componentPageName}"` : `"${g.componentPageName}"`, R = `Deferred instance "${f.name}" still cannot find referenced page (tried: ${E}, and clean name matching)`;
        await a.error(R), o.push(R), i++;
        continue;
      }
      const w = (E, R, V, _, P) => {
        if (R.length === 0) {
          let T = null;
          const G = Y(V);
          for (const p of E.children || [])
            if (p.type === "COMPONENT") {
              const y = p.name === V, c = Y(p.name) === G;
              if (y || c) {
                if (T || (T = p), y && _)
                  try {
                    const l = p.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (l && JSON.parse(l).id === _)
                      return p;
                  } catch (l) {
                  }
                else if (y)
                  return p;
              }
            } else if (p.type === "COMPONENT_SET") {
              if (P) {
                const y = p.name === P, c = Y(p.name) === Y(P);
                if (!y && !c)
                  continue;
              }
              for (const y of p.children || [])
                if (y.type === "COMPONENT") {
                  const c = y.name === V, l = Y(y.name) === G;
                  if (c || l) {
                    if (T || (T = y), c && _)
                      try {
                        const b = y.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (b && JSON.parse(b).id === _)
                          return y;
                      } catch (b) {
                      }
                    else if (c)
                      return y;
                  }
                }
            }
          return T;
        }
        const [I, ...v] = R, x = Y(I);
        for (const T of E.children || []) {
          const G = T.name === I, p = Y(T.name) === x;
          if (G || p) {
            if (v.length === 0) {
              if (T.type === "COMPONENT_SET") {
                if (P) {
                  const l = T.name === P, b = Y(T.name) === Y(P);
                  if (!l && !b)
                    continue;
                }
                const y = Y(V);
                let c = null;
                for (const l of T.children || [])
                  if (l.type === "COMPONENT") {
                    const b = l.name === V, C = Y(l.name) === y;
                    if (b || C) {
                      if (c || (c = l), _)
                        try {
                          const $ = l.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if ($ && JSON.parse($).id === _)
                            return l;
                        } catch ($) {
                        }
                      if (b)
                        return l;
                    }
                  }
                return c || null;
              }
              return null;
            }
            return v.length > 0 ? w(
              T,
              v,
              V,
              _,
              P
            ) : null;
          }
        }
        return null;
      };
      await a.log(
        `  [DEBUG] Searching for component "${g.componentName}" on page "${s.name}"`
      ), g.path && g.path.length > 0 ? await a.log(
        `  [DEBUG] Component path: [${g.path.join(" → ")}]`
      ) : await a.log("  [DEBUG] Component is at page root"), g.componentSetName && await a.log(
        `  [DEBUG] Component set name: "${g.componentSetName}"`
      ), g.componentGuid && await a.log(
        `  [DEBUG] Component GUID: ${g.componentGuid.substring(0, 8)}...`
      );
      const A = s.children.slice(0, 10).map((E) => `${E.type}: "${E.name}"${E.type === "COMPONENT_SET" ? ` (${E.children.length} variants)` : ""}`);
      await a.log(
        `  [DEBUG] Top-level nodes on page "${s.name}" (first 10): ${A.join(", ")}`
      );
      let S = w(
        s,
        g.path || [],
        g.componentName,
        g.componentGuid,
        g.componentSetName
      );
      if (!S && g.componentSetName) {
        await a.log(
          `  [DEBUG] Path-based search failed, trying recursive search for COMPONENT_SET "${g.componentSetName}"`
        );
        const E = (R, V = 0) => {
          if (V > 5) return null;
          for (const _ of R.children || []) {
            if (_.type === "COMPONENT_SET") {
              const P = _.name === g.componentSetName, I = Y(_.name) === Y(g.componentSetName || "");
              if (P || I) {
                const v = Y(
                  g.componentName
                );
                for (const x of _.children || [])
                  if (x.type === "COMPONENT") {
                    const T = x.name === g.componentName, G = Y(x.name) === v;
                    if (T || G) {
                      if (g.componentGuid)
                        try {
                          const p = x.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (p && JSON.parse(p).id === g.componentGuid)
                            return x;
                        } catch (p) {
                        }
                      return x;
                    }
                  }
              }
            }
            if (_.type === "FRAME" || _.type === "GROUP") {
              const P = E(_, V + 1);
              if (P) return P;
            }
          }
          return null;
        };
        S = E(s), S && await a.log(
          `  [DEBUG] Found component via recursive search: "${S.name}"`
        );
      }
      if (!S) {
        const E = g.path && g.path.length > 0 ? ` at path [${g.path.join(" → ")}]` : " at page root", R = [], V = (P, I = 0) => {
          if (!(I > 3) && ((P.type === "COMPONENT" || P.type === "COMPONENT_SET") && R.push(
            `${P.type}: "${P.name}"${P.type === "COMPONENT_SET" ? ` (${P.children.length} variants)` : ""}`
          ), P.children && Array.isArray(P.children)))
            for (const v of P.children.slice(0, 10))
              V(v, I + 1);
        };
        V(s), await a.log(
          `  [DEBUG] Available components on page "${s.name}" (first 20): ${R.slice(0, 20).join(", ")}`
        );
        const _ = `Deferred instance "${f.name}" still cannot find component "${g.componentName}" on page "${g.componentPageName}"${E}`;
        await a.error(_), o.push(_), i++;
        continue;
      }
      const m = S.createInstance();
      if (m.name = f.name || u.name.replace("[Deferred: ", "").replace("]", ""), m.x = u.x, m.y = u.y, u.width !== void 0 && u.height !== void 0 && m.resize(u.width, u.height), g.variantProperties && Object.keys(g.variantProperties).length > 0)
        try {
          const E = await m.getMainComponentAsync();
          if (E) {
            let R = null;
            const V = E.type;
            if (V === "COMPONENT_SET" ? R = E.componentPropertyDefinitions : V === "COMPONENT" && E.parent && E.parent.type === "COMPONENT_SET" ? R = E.parent.componentPropertyDefinitions : await a.warning(
              `Cannot set variant properties for resolved instance "${f.name}" - main component is not a COMPONENT_SET or variant`
            ), R) {
              const _ = {};
              for (const [P, I] of Object.entries(
                g.variantProperties
              )) {
                const v = P.split("#")[0];
                R[v] && (_[v] = I);
              }
              Object.keys(_).length > 0 && m.setProperties(_);
            }
          }
        } catch (E) {
          await a.warning(
            `Failed to set variant properties for resolved instance "${f.name}": ${E}`
          );
        }
      if (g.componentProperties && Object.keys(g.componentProperties).length > 0)
        try {
          const E = await m.getMainComponentAsync();
          if (E) {
            let R = null;
            const V = E.type;
            if (V === "COMPONENT_SET" ? R = E.componentPropertyDefinitions : V === "COMPONENT" && E.parent && E.parent.type === "COMPONENT_SET" ? R = E.parent.componentPropertyDefinitions : V === "COMPONENT" && (R = E.componentPropertyDefinitions), R)
              for (const [_, P] of Object.entries(
                g.componentProperties
              )) {
                const I = _.split("#")[0];
                if (R[I])
                  try {
                    m.setProperties({
                      [I]: P
                    });
                  } catch (v) {
                    await a.warning(
                      `Failed to set component property "${I}" for resolved instance "${f.name}": ${v}`
                    );
                  }
              }
          }
        } catch (E) {
          await a.warning(
            `Failed to set component properties for resolved instance "${f.name}": ${E}`
          );
        }
      const M = N.children.indexOf(u);
      N.insertChild(M, m), u.remove(), await a.log(
        `  ✓ Resolved deferred instance "${f.name}" from component "${g.componentName}" on page "${g.componentPageName}"`
      ), n++;
    } catch (r) {
      const g = r instanceof Error ? r.message : String(r), f = `Failed to resolve deferred instance "${d.nodeData.name}": ${g}`;
      await a.error(f), o.push(f), i++;
    }
  return await a.log(
    `=== Deferred Resolution Complete: ${n} resolved, ${i} failed ===`
  ), { resolved: n, failed: i, errors: o };
}
async function Pa(e) {
  await a.log("=== Cleaning up created entities ===");
  try {
    const { pageIds: t, collectionIds: n, variableIds: i } = e;
    let o = 0;
    for (const g of i)
      try {
        const f = await figma.variables.getVariableByIdAsync(g);
        if (f) {
          const h = f.variableCollectionId;
          n.includes(h) || (f.remove(), o++);
        }
      } catch (f) {
        await a.warning(
          `Could not delete variable ${g.substring(0, 8)}...: ${f}`
        );
      }
    let d = 0;
    for (const g of n)
      try {
        const f = await figma.variables.getVariableCollectionByIdAsync(g);
        f && (f.remove(), d++);
      } catch (f) {
        await a.warning(
          `Could not delete collection ${g.substring(0, 8)}...: ${f}`
        );
      }
    await figma.loadAllPagesAsync();
    let r = 0;
    for (const g of t)
      try {
        const f = await figma.getNodeByIdAsync(g);
        f && f.type === "PAGE" && (f.remove(), r++);
      } catch (f) {
        await a.warning(
          `Could not delete page ${g.substring(0, 8)}...: ${f}`
        );
      }
    return await a.log(
      `Cleanup complete: Deleted ${r} page(s), ${d} collection(s), ${o} variable(s)`
    ), {
      type: "cleanupCreatedEntities",
      success: !0,
      error: !1,
      message: "Cleanup completed successfully",
      data: {
        deletedPages: r,
        deletedCollections: d,
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
async function pt(e) {
  const t = [];
  for (const { fileName: n, jsonData: i } of e)
    try {
      const o = We(i);
      if (!o.success || !o.expandedJsonData) {
        await a.warning(
          `Skipping ${n} - failed to expand JSON: ${o.error || "Unknown error"}`
        );
        continue;
      }
      const d = o.expandedJsonData, r = d.metadata;
      if (!r || !r.name || !r.guid) {
        await a.warning(
          `Skipping ${n} - missing or invalid metadata`
        );
        continue;
      }
      const g = [];
      if (d.instances) {
        const h = Ae.fromTable(
          d.instances
        ).getSerializedTable();
        for (const u of Object.values(h))
          u.instanceType === "normal" && u.componentPageName && (g.includes(u.componentPageName) || g.push(u.componentPageName));
      }
      t.push({
        fileName: n,
        pageName: r.name,
        pageGuid: r.guid,
        dependencies: g,
        jsonData: i
        // Store original JSON data for import
      }), await a.log(
        `  ${n}: "${r.name}" depends on: ${g.length > 0 ? g.join(", ") : "none"}`
      );
    } catch (o) {
      await a.error(
        `Error processing ${n}: ${o instanceof Error ? o.message : String(o)}`
      );
    }
  return t;
}
function mt(e) {
  const t = [], n = [], i = [], o = /* @__PURE__ */ new Map();
  for (const h of e)
    o.set(h.pageName, h);
  const d = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), g = [], f = (h) => {
    if (d.has(h.pageName))
      return !1;
    if (r.has(h.pageName)) {
      const u = g.findIndex(
        (N) => N.pageName === h.pageName
      );
      if (u !== -1) {
        const N = g.slice(u).concat([h]);
        return n.push(N), !0;
      }
      return !1;
    }
    r.add(h.pageName), g.push(h);
    for (const u of h.dependencies) {
      const N = o.get(u);
      N && f(N);
    }
    return r.delete(h.pageName), g.pop(), d.add(h.pageName), t.push(h), !1;
  };
  for (const h of e)
    d.has(h.pageName) || f(h);
  for (const h of e)
    for (const u of h.dependencies)
      o.has(u) || i.push(
        `Page "${h.pageName}" (${h.fileName}) depends on "${u}" which is not in the import set`
      );
  return { order: t, cycles: n, errors: i };
}
async function ft(e) {
  await a.log("=== Building Dependency Graph ===");
  const t = await pt(e);
  await a.log("=== Resolving Import Order ===");
  const n = mt(t);
  if (n.cycles.length > 0) {
    await a.log(
      `Detected ${n.cycles.length} circular dependency cycle(s):`
    );
    for (const i of n.cycles) {
      const o = i.map((d) => `"${d.pageName}"`).join(" → ");
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
    for (const i of n.errors)
      await a.warning(`  ${i}`);
  }
  await a.log(
    `Import order determined: ${n.order.length} page(s)`
  );
  for (let i = 0; i < n.order.length; i++) {
    const o = n.order[i];
    await a.log(`  ${i + 1}. ${o.fileName} ("${o.pageName}")`);
  }
  return n;
}
async function ut(e) {
  var E, R, V, _, P, I;
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
    cycles: i,
    errors: o
  } = await ft(t);
  o.length > 0 && await a.warning(
    `Found ${o.length} dependency warning(s) - some dependencies may be missing`
  ), i.length > 0 && await a.log(
    `Detected ${i.length} circular dependency cycle(s) - will use deferred resolution`
  );
  const d = /* @__PURE__ */ new Map();
  if (await a.log(
    `Checking collectionChoices: ${e.collectionChoices ? "exists" : "undefined"}`
  ), e.collectionChoices) {
    await a.log("=== Pre-creating Collections ==="), await a.log(
      `Collection choices: tokens=${e.collectionChoices.tokens}, theme=${e.collectionChoices.theme}, layers=${e.collectionChoices.layers}`
    );
    const v = "recursica:collectionId", x = async (G) => {
      const p = await figma.variables.getLocalVariableCollectionsAsync(), y = new Set(p.map((b) => b.name));
      if (!y.has(G))
        return G;
      let c = 1, l = `${G}_${c}`;
      for (; y.has(l); )
        c++, l = `${G}_${c}`;
      return l;
    }, T = [
      { choice: e.collectionChoices.tokens, normalizedName: "Tokens" },
      { choice: e.collectionChoices.theme, normalizedName: "Theme" },
      { choice: e.collectionChoices.layers, normalizedName: "Layer" }
    ];
    for (const { choice: G, normalizedName: p } of T)
      if (G === "new") {
        await a.log(
          `Processing collection type: "${p}" (choice: "new") - will create new collection`
        );
        const y = await x(p), c = figma.variables.createVariableCollection(y);
        if (de(p)) {
          const l = Me(p);
          l && (c.setSharedPluginData(
            "recursica",
            v,
            l
          ), await a.log(
            `  Stored fixed GUID: ${l.substring(0, 8)}...`
          ));
        }
        d.set(p, c), await a.log(
          `✓ Pre-created collection: "${y}" (normalized: "${p}", id: ${c.id.substring(0, 8)}...)`
        );
      } else
        await a.log(
          `Skipping collection type: "${p}" (choice: "existing")`
        );
    d.size > 0 && await a.log(
      `Pre-created ${d.size} collection(s) for reuse across all imports`
    );
  }
  await a.log("=== Importing Pages in Order ===");
  let r = 0, g = 0;
  const f = [...o], h = [], u = {
    pageIds: [],
    collectionIds: [],
    variableIds: []
  }, N = [];
  if (d.size > 0)
    for (const v of d.values())
      u.collectionIds.push(v.id), await a.log(
        `Tracking pre-created collection: "${v.name}" (${v.id.substring(0, 8)}...)`
      );
  const s = e.mainFileName;
  for (let v = 0; v < n.length; v++) {
    const x = n[v], T = s ? x.fileName === s : v === n.length - 1;
    await a.log(
      `[${v + 1}/${n.length}] Importing ${x.fileName} ("${x.pageName}")${T ? " [MAIN]" : " [DEPENDENCY]"}...`
    );
    try {
      const G = v === 0, p = await dt({
        jsonData: x.jsonData,
        isMainPage: T,
        clearConsole: G,
        collectionChoices: e.collectionChoices,
        alwaysCreateCopy: !0,
        // Wizard imports always create copies (no prompts)
        skipUniqueNaming: (E = e.skipUniqueNaming) != null ? E : !1,
        constructionIcon: e.constructionIcon || "",
        preCreatedCollections: d
        // Pass pre-created collections for reuse
      });
      if (p.success) {
        if (r++, (R = p.data) != null && R.deferredInstances) {
          const y = p.data.deferredInstances;
          Array.isArray(y) && (await a.log(
            `  [DEBUG] Collected ${y.length} deferred instance(s) from ${x.fileName}`
          ), h.push(...y));
        } else
          await a.log(
            `  [DEBUG] No deferred instances in response for ${x.fileName}`
          );
        if ((V = p.data) != null && V.createdEntities) {
          const y = p.data.createdEntities;
          y.pageIds && u.pageIds.push(...y.pageIds), y.collectionIds && u.collectionIds.push(...y.collectionIds), y.variableIds && u.variableIds.push(...y.variableIds);
          const c = ((_ = y.pageIds) == null ? void 0 : _[0]) || ((P = p.data) == null ? void 0 : P.pageId);
          (I = p.data) != null && I.pageName && c && N.push({
            name: p.data.pageName,
            pageId: c
          });
        }
      } else
        g++, f.push(
          `Failed to import ${x.fileName}: ${p.message || "Unknown error"}`
        );
    } catch (G) {
      g++;
      const p = G instanceof Error ? G.message : String(G);
      f.push(`Failed to import ${x.fileName}: ${p}`);
    }
  }
  if (h.length > 0) {
    await a.log(
      `=== Resolving ${h.length} Deferred Instance(s) ===`
    );
    try {
      const v = await gt(
        h,
        e.constructionIcon || ""
      );
      await a.log(
        `  Resolved: ${v.resolved}, Failed: ${v.failed}`
      ), v.errors.length > 0 && f.push(...v.errors);
    } catch (v) {
      f.push(
        `Failed to resolve deferred instances: ${v instanceof Error ? v.message : String(v)}`
      );
    }
  }
  const w = Array.from(
    new Set(u.collectionIds)
  ), A = Array.from(
    new Set(u.variableIds)
  ), S = Array.from(new Set(u.pageIds));
  if (await a.log("=== Import Summary ==="), await a.log(
    `  Imported: ${r}, Failed: ${g}, Deferred instances: ${h.length}`
  ), await a.log(
    `  Collections in allCreatedEntityIds: ${u.collectionIds.length}, Unique: ${w.length}`
  ), w.length > 0) {
    await a.log(
      `  Created ${w.length} collection(s)`
    );
    for (const v of w)
      try {
        const x = await figma.variables.getVariableCollectionByIdAsync(v);
        x && await a.log(
          `    - "${x.name}" (${v.substring(0, 8)}...)`
        );
      } catch (x) {
      }
  }
  const m = g === 0, M = m ? `Successfully imported ${r} page(s)${h.length > 0 ? ` (${h.length} deferred instance(s) resolved)` : ""}` : `Import completed with ${g} failure(s). ${f.join("; ")}`;
  return {
    type: "importPagesInOrder",
    success: m,
    error: !m,
    message: M,
    data: {
      imported: r,
      failed: g,
      deferred: h.length,
      errors: f,
      importedPages: N,
      createdEntities: {
        pageIds: S,
        collectionIds: w,
        variableIds: A
      }
    }
  };
}
async function Ca(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children;
    console.log("Found " + t.length + " pages in the document");
    const n = 11, i = t[n];
    if (!i)
      return {
        type: "quickCopy",
        success: !1,
        error: !0,
        message: "No page found at index 11",
        data: {}
      };
    const o = await Re(
      i,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + i.name + " (index: " + n + ")"
    );
    const d = JSON.stringify(o, null, 2), r = JSON.parse(d), g = "Copy - " + r.name, f = figma.createPage();
    if (f.name = g, figma.root.appendChild(f), r.children && r.children.length > 0) {
      let N = function(w) {
        w.forEach((A) => {
          const S = (A.x || 0) + (A.width || 0);
          S > s && (s = S), A.children && A.children.length > 0 && N(A.children);
        });
      };
      console.log(
        "Recreating " + r.children.length + " top-level children..."
      );
      let s = 0;
      N(r.children), console.log("Original content rightmost edge: " + s);
      for (const w of r.children)
        await we(w, f, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const h = xe(r);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: r.name,
        newPageName: g,
        totalNodes: h
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
async function Sa(e) {
  try {
    const t = e.accessToken, n = e.selectedRepo;
    return t ? (await figma.clientStorage.setAsync("accessToken", t), n && await figma.clientStorage.setAsync("selectedRepo", n), e.hasWriteAccess !== void 0 && await figma.clientStorage.setAsync("hasWriteAccess", e.hasWriteAccess), {
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
async function Ia(e) {
  try {
    const t = await figma.clientStorage.getAsync("accessToken"), n = await figma.clientStorage.getAsync("selectedRepo"), i = await figma.clientStorage.getAsync("hasWriteAccess");
    return {
      type: "loadAuthData",
      success: !0,
      error: !1,
      message: "Auth data loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        accessToken: t || void 0,
        selectedRepo: n || void 0,
        hasWriteAccess: i != null ? i : void 0
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
async function Ta(e) {
  try {
    return await figma.clientStorage.deleteAsync("accessToken"), await figma.clientStorage.deleteAsync("selectedRepo"), await figma.clientStorage.deleteAsync("hasWriteAccess"), {
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
async function Oa(e) {
  try {
    return await figma.clientStorage.setAsync("importData", e.importData), {
      type: "storeImportData",
      success: !0,
      error: !1,
      message: "Import data stored successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    };
  } catch (t) {
    return {
      type: "storeImportData",
      success: !1,
      error: !0,
      message: t instanceof Error ? t.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Ma(e) {
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
  } catch (t) {
    return {
      type: "loadImportData",
      success: !1,
      error: !0,
      message: t instanceof Error ? t.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Va(e) {
  try {
    return await figma.clientStorage.deleteAsync("importData"), {
      type: "clearImportData",
      success: !0,
      error: !1,
      message: "Import data cleared successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    };
  } catch (t) {
    return {
      type: "clearImportData",
      success: !1,
      error: !0,
      message: t instanceof Error ? t.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function xa(e) {
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
function Q(e, t = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: t
  };
}
function ce(e, t, n = {}) {
  const i = t instanceof Error ? t.message : t;
  return {
    type: e,
    success: !1,
    error: !0,
    message: i,
    data: n
  };
}
const ht = "RecursicaPublishedMetadata";
async function Ra(e) {
  try {
    const t = figma.currentPage;
    await figma.loadAllPagesAsync();
    const i = figma.root.children.findIndex(
      (g) => g.id === t.id
    ), o = t.getPluginData(ht);
    if (!o) {
      const h = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: Oe(t.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: i
      };
      return Q("getComponentMetadata", h);
    }
    const r = {
      componentMetadata: JSON.parse(o),
      currentPageIndex: i
    };
    return Q("getComponentMetadata", r);
  } catch (t) {
    return console.error("Error getting component metadata:", t), ce(
      "getComponentMetadata",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function ka(e) {
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
      const d = o, r = d.getPluginData(ht);
      if (r)
        try {
          const g = JSON.parse(r);
          n.push(g);
        } catch (g) {
          console.warn(
            `Failed to parse metadata for page "${d.name}":`,
            g
          );
          const h = {
            _ver: 1,
            id: "",
            name: Oe(d.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          n.push(h);
        }
      else {
        const f = {
          _ver: 1,
          id: "",
          name: Oe(d.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        n.push(f);
      }
    }
    return Q("getAllComponents", {
      components: n
    });
  } catch (t) {
    return console.error("Error getting all components:", t), ce(
      "getAllComponents",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function Ga(e) {
  try {
    const t = e.requestId, n = e.action;
    return !t || !n ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (be.handleResponse({ requestId: t, action: n }), {
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
async function La(e) {
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
const te = "RecursicaPrimaryImport", q = "RecursicaUnderReview", yt = "---", bt = "---", ie = "RecursicaImportDivider", ue = "start", he = "end", le = "⚠️";
async function _a(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children;
    for (const i of t) {
      if (i.type !== "PAGE")
        continue;
      const o = i.getPluginData(te);
      if (o)
        try {
          const r = JSON.parse(o), g = {
            exists: !0,
            pageId: i.id,
            metadata: r
          };
          return Q(
            "checkForExistingPrimaryImport",
            g
          );
        } catch (r) {
          await a.warning(
            `Failed to parse primary import metadata on page "${i.name}": ${r}`
          );
          continue;
        }
      if (i.getPluginData(q) === "true") {
        const r = i.getPluginData(te);
        if (r)
          try {
            const g = JSON.parse(r), f = {
              exists: !0,
              pageId: i.id,
              metadata: g
            };
            return Q(
              "checkForExistingPrimaryImport",
              f
            );
          } catch (g) {
          }
        else
          await a.warning(
            `Found page "${i.name}" marked as under review but missing primary import metadata`
          );
      }
    }
    return Q("checkForExistingPrimaryImport", {
      exists: !1
    });
  } catch (t) {
    return console.error("Error checking for existing primary import:", t), ce(
      "checkForExistingPrimaryImport",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function Ba(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children.find(
      (g) => g.type === "PAGE" && g.getPluginData(ie) === ue
    ), n = figma.root.children.find(
      (g) => g.type === "PAGE" && g.getPluginData(ie) === he
    );
    if (t && n) {
      const g = {
        startDividerId: t.id,
        endDividerId: n.id
      };
      return Q("createImportDividers", g);
    }
    const i = figma.createPage();
    i.name = yt, i.setPluginData(ie, ue), i.setPluginData(q, "true");
    const o = figma.createPage();
    o.name = bt, o.setPluginData(ie, he), o.setPluginData(q, "true");
    const d = figma.root.children.indexOf(i);
    figma.root.insertChild(d + 1, o), await a.log("Created import dividers");
    const r = {
      startDividerId: i.id,
      endDividerId: o.id
    };
    return Q("createImportDividers", r);
  } catch (t) {
    return console.error("Error creating import dividers:", t), ce(
      "createImportDividers",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function Ua(e) {
  var t, n, i, o, d, r, g;
  try {
    await a.log("=== Starting Single Component Import ==="), await a.log("Creating start divider..."), await figma.loadAllPagesAsync();
    let f = figma.root.children.find(
      (c) => c.type === "PAGE" && c.getPluginData(ie) === ue
    );
    f || (f = figma.createPage(), f.name = yt, f.setPluginData(ie, ue), f.setPluginData(q, "true"), await a.log("Created start divider"));
    const u = [
      ...e.dependencies.filter(
        (c) => !c.useExisting
      ).map((c) => ({
        fileName: `${c.name}.json`,
        jsonData: c.jsonData
      })),
      {
        fileName: `${e.mainComponent.name}.json`,
        jsonData: e.mainComponent.jsonData
      }
    ];
    await a.log(
      `Importing ${u.length} file(s) in dependency order...`
    );
    const N = await ut({
      jsonFiles: u,
      mainFileName: `${e.mainComponent.name}.json`,
      collectionChoices: {
        tokens: e.wizardSelections.tokensCollection,
        theme: e.wizardSelections.themeCollection,
        layers: e.wizardSelections.layersCollection
      },
      skipUniqueNaming: !0,
      // Don't add _<number> suffix for wizard imports
      constructionIcon: le
      // Add construction icon to page names
    });
    if (!N.success)
      throw new Error(
        N.message || "Failed to import pages in order"
      );
    await figma.loadAllPagesAsync();
    const s = figma.root.children;
    let w = s.find(
      (c) => c.type === "PAGE" && c.getPluginData(ie) === he
    );
    if (!w) {
      w = figma.createPage(), w.name = bt, w.setPluginData(
        ie,
        he
      ), w.setPluginData(q, "true");
      let c = s.length;
      for (let l = s.length - 1; l >= 0; l--) {
        const b = s[l];
        if (b.type === "PAGE" && b.getPluginData(ie) !== ue && b.getPluginData(ie) !== he) {
          c = l + 1;
          break;
        }
      }
      figma.root.insertChild(c, w), await a.log("Created end divider");
    }
    await a.log(
      `Import result data structure: ${JSON.stringify(Object.keys(N.data || {}))}`
    );
    const A = N.data;
    if (await a.log(
      `Import result has createdEntities: ${!!(A != null && A.createdEntities)}`
    ), A != null && A.createdEntities && (await a.log(
      `  Collection IDs: ${((t = A.createdEntities.collectionIds) == null ? void 0 : t.length) || 0}`
    ), await a.log(
      `  Variable IDs: ${((n = A.createdEntities.variableIds) == null ? void 0 : n.length) || 0}`
    ), await a.log(
      `  Page IDs: ${((i = A.createdEntities.pageIds) == null ? void 0 : i.length) || 0}`
    )), !(A != null && A.importedPages) || A.importedPages.length === 0)
      throw new Error("No pages were imported");
    const S = "RecursicaPublishedMetadata", m = e.mainComponent.guid;
    await a.log(
      `Looking for main page by GUID: ${m.substring(0, 8)}...`
    );
    let M, E = null;
    for (const c of A.importedPages)
      try {
        const l = await figma.getNodeByIdAsync(
          c.pageId
        );
        if (l && l.type === "PAGE") {
          const b = l.getPluginData(S);
          if (b)
            try {
              if (JSON.parse(b).id === m) {
                M = c.pageId, E = l, await a.log(
                  `Found main page by GUID: "${l.name}" (ID: ${c.pageId.substring(0, 12)}...)`
                );
                break;
              }
            } catch (C) {
            }
        }
      } catch (l) {
        await a.warning(
          `Error checking page ${c.pageId}: ${l}`
        );
      }
    if (!M) {
      await a.log(
        "Main page not found in importedPages list, searching all pages by GUID..."
      ), await figma.loadAllPagesAsync();
      const c = figma.root.children;
      for (const l of c)
        if (l.type === "PAGE") {
          const b = l.getPluginData(S);
          if (b)
            try {
              if (JSON.parse(b).id === m) {
                M = l.id, E = l, await a.log(
                  `Found main page by GUID in all pages: "${l.name}" (ID: ${l.id.substring(0, 12)}...)`
                );
                break;
              }
            } catch (C) {
            }
        }
    }
    if (!M || !E) {
      await a.error(
        `Failed to find imported main page by GUID: ${m.substring(0, 8)}...`
      ), await a.log("Imported pages were:");
      for (const c of A.importedPages)
        await a.log(
          `  - "${c.name}" (ID: ${c.pageId.substring(0, 12)}...)`
        );
      throw new Error("Failed to find imported main page ID");
    }
    if (!E || E.type !== "PAGE")
      throw new Error("Failed to get main page node");
    for (const c of A.importedPages)
      try {
        const l = await figma.getNodeByIdAsync(
          c.pageId
        );
        if (l && l.type === "PAGE") {
          l.setPluginData(q, "true");
          const b = l.name.replace(/_\d+$/, "");
          if (!b.startsWith(le))
            l.name = `${le} ${b}`;
          else {
            const C = b.replace(le, "").trim();
            l.name = `${le} ${C}`;
          }
        }
      } catch (l) {
        await a.warning(
          `Failed to mark page ${c.pageId} as under review: ${l}`
        );
      }
    await figma.loadAllPagesAsync();
    const R = figma.root.children, V = R.find(
      (c) => c.type === "PAGE" && (c.name === "REMOTES" || c.name === `${le} REMOTES`)
    );
    V && (V.setPluginData(q, "true"), V.name.startsWith(le) || (V.name = `${le} REMOTES`), await a.log(
      "Marked REMOTES page as under review and ensured construction icon"
    ));
    const _ = R.find(
      (c) => c.type === "PAGE" && c.getPluginData(ie) === ue
    ), P = R.find(
      (c) => c.type === "PAGE" && c.getPluginData(ie) === he
    );
    if (_ && P) {
      const c = R.indexOf(_), l = R.indexOf(P);
      for (let b = c + 1; b < l; b++) {
        const C = R[b];
        C.type === "PAGE" && C.getPluginData(q) !== "true" && (C.setPluginData(q, "true"), await a.log(
          `Marked page "${C.name}" as under review (found between dividers)`
        ));
      }
    }
    const I = [], v = [];
    if (await a.log(
      `[EXTRACTION] Starting collection extraction. Collection IDs in result: ${((d = (o = A == null ? void 0 : A.createdEntities) == null ? void 0 : o.collectionIds) == null ? void 0 : d.length) || 0}`
    ), (r = A == null ? void 0 : A.createdEntities) != null && r.collectionIds) {
      await a.log(
        `[EXTRACTION] Collection IDs to process: ${A.createdEntities.collectionIds.map((c) => c.substring(0, 8) + "...").join(", ")}`
      );
      for (const c of A.createdEntities.collectionIds)
        try {
          const l = await figma.variables.getVariableCollectionByIdAsync(c);
          l ? (I.push({
            collectionId: l.id,
            collectionName: l.name
          }), await a.log(
            `[EXTRACTION] ✓ Extracted collection: "${l.name}" (${c.substring(0, 8)}...)`
          )) : await a.warning(
            `[EXTRACTION] Collection ${c.substring(0, 8)}... not found`
          );
        } catch (l) {
          await a.warning(
            `[EXTRACTION] Failed to get collection ${c.substring(0, 8)}...: ${l}`
          );
        }
    } else
      await a.warning(
        "[EXTRACTION] No collectionIds found in importResultData.createdEntities"
      );
    await a.log(
      `[EXTRACTION] Total collections extracted: ${I.length}`
    ), I.length > 0 && await a.log(
      `[EXTRACTION] Extracted collections: ${I.map((c) => `"${c.collectionName}" (${c.collectionId.substring(0, 8)}...)`).join(", ")}`
    );
    const x = new Set(
      I.map((c) => c.collectionId)
    );
    if ((g = A == null ? void 0 : A.createdEntities) != null && g.variableIds)
      for (const c of A.createdEntities.variableIds)
        try {
          const l = await figma.variables.getVariableByIdAsync(c);
          if (l && l.resolvedType && !x.has(l.variableCollectionId)) {
            const b = await figma.variables.getVariableCollectionByIdAsync(
              l.variableCollectionId
            );
            b && v.push({
              variableId: l.id,
              variableName: l.name,
              collectionId: l.variableCollectionId,
              collectionName: b.name
            });
          }
        } catch (l) {
          await a.warning(
            `Failed to get variable ${c}: ${l}`
          );
        }
    const T = {
      componentGuid: e.mainComponent.guid,
      componentVersion: e.mainComponent.version,
      componentName: e.mainComponent.name,
      importDate: (/* @__PURE__ */ new Date()).toISOString(),
      wizardSelections: e.wizardSelections,
      variableSummary: e.variableSummary,
      createdCollections: I,
      createdVariables: v,
      importError: void 0
      // No error yet
    };
    await a.log(
      `Storing metadata with ${I.length} collection(s) and ${v.length} variable(s)`
    ), E.setPluginData(
      te,
      JSON.stringify(T)
    ), E.setPluginData(q, "true"), await a.log(
      "Stored primary import metadata on main page and marked as under review"
    );
    const G = [];
    A.importedPages && G.push(
      ...A.importedPages.map((c) => c.pageId)
    ), await a.log("=== Single Component Import Complete ==="), T.importError = void 0, await a.log(
      `[METADATA] About to store metadata with ${I.length} collection(s) and ${v.length} variable(s)`
    ), I.length > 0 && await a.log(
      `[METADATA] Collections to store: ${I.map((c) => `"${c.collectionName}" (${c.collectionId.substring(0, 8)}...)`).join(", ")}`
    ), E.setPluginData(
      te,
      JSON.stringify(T)
    ), await a.log(
      `[METADATA] Stored metadata: ${I.length} collection(s), ${v.length} variable(s)`
    );
    const p = E.getPluginData(te);
    if (p)
      try {
        const c = JSON.parse(p);
        await a.log(
          `[METADATA] Verification: Stored metadata has ${c.createdCollections.length} collection(s) and ${c.createdVariables.length} variable(s)`
        );
      } catch (c) {
        await a.warning(
          "[METADATA] Failed to verify stored metadata"
        );
      }
    const y = {
      success: !0,
      mainPageId: E.id,
      importedPageIds: G,
      createdCollections: I,
      createdVariables: v
    };
    return Q("importSingleComponentWithWizard", y);
  } catch (f) {
    const h = f instanceof Error ? f.message : "Unknown error occurred";
    await a.error(`Import failed: ${h}`);
    try {
      await figma.loadAllPagesAsync();
      const u = figma.root.children;
      let N = null;
      for (const s of u) {
        if (s.type !== "PAGE") continue;
        const w = s.getPluginData(te);
        if (w)
          try {
            if (JSON.parse(w).componentGuid === e.mainComponent.guid) {
              N = s;
              break;
            }
          } catch (A) {
          }
      }
      if (N) {
        const s = N.getPluginData(te);
        if (s)
          try {
            const w = JSON.parse(s);
            await a.log(
              `[CATCH] Found existing metadata with ${w.createdCollections.length} collection(s) and ${w.createdVariables.length} variable(s)`
            ), w.importError = h, N.setPluginData(
              te,
              JSON.stringify(w)
            ), await a.log(
              `[CATCH] Updated existing metadata with error. Collections: ${w.createdCollections.length}, Variables: ${w.createdVariables.length}`
            );
          } catch (w) {
            await a.warning(
              `[CATCH] Failed to update metadata: ${w}`
            );
          }
      } else {
        await a.log(
          "No existing metadata found, attempting to collect created entities for cleanup..."
        );
        const s = [];
        for (const S of u) {
          if (S.type !== "PAGE") continue;
          S.getPluginData(q) === "true" && s.push(S);
        }
        const w = [];
        if (e.wizardSelections) {
          const S = await figma.variables.getLocalVariableCollectionsAsync(), m = [
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
          for (const { choice: M, normalizedName: E } of m)
            if (M === "new") {
              const R = S.filter((V) => ae(V.name) === E);
              if (R.length > 0) {
                const V = R[0];
                w.push({
                  collectionId: V.id,
                  collectionName: V.name
                }), await a.log(
                  `Found created collection: "${V.name}" (${V.id.substring(0, 8)}...)`
                );
              }
            }
        }
        const A = [];
        if (s.length > 0) {
          const S = s[0], m = {
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
            createdCollections: w,
            createdVariables: A,
            importError: h
          };
          S.setPluginData(
            te,
            JSON.stringify(m)
          ), await a.log(
            `Created fallback metadata with ${w.length} collection(s) and error information`
          );
        }
      }
    } catch (u) {
      await a.warning(
        `Failed to store error metadata: ${u instanceof Error ? u.message : String(u)}`
      );
    }
    return ce(
      "importSingleComponentWithWizard",
      f instanceof Error ? f : new Error(String(f))
    );
  }
}
async function wt(e) {
  try {
    await a.log("=== Starting Import Group Deletion ==="), await figma.loadAllPagesAsync();
    const t = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!t || t.type !== "PAGE")
      throw new Error("Main page not found");
    const n = t.getPluginData(te);
    if (!n)
      throw new Error("Primary import metadata not found on page");
    const i = JSON.parse(n);
    await a.log(
      `Found metadata: ${i.createdCollections.length} collection(s), ${i.createdVariables.length} variable(s) to delete`
    ), await figma.loadAllPagesAsync();
    const o = figma.root.children, d = [];
    for (const s of o) {
      if (s.type !== "PAGE")
        continue;
      s.getPluginData(q) === "true" && (d.push(s), await a.log(
        `Found page to delete: "${s.name}" (under review)`
      ));
    }
    await a.log(
      `Deleting ${i.createdVariables.length} variable(s) from existing collections...`
    );
    let r = 0;
    for (const s of i.createdVariables)
      try {
        const w = await figma.variables.getVariableByIdAsync(
          s.variableId
        );
        w ? (w.remove(), r++, await a.log(
          `Deleted variable: ${s.variableName} from collection ${s.collectionName}`
        )) : await a.warning(
          `Variable ${s.variableName} (${s.variableId}) not found - may have already been deleted`
        );
      } catch (w) {
        await a.warning(
          `Failed to delete variable ${s.variableName}: ${w instanceof Error ? w.message : String(w)}`
        );
      }
    await a.log(
      `Deleting ${i.createdCollections.length} collection(s)...`
    );
    let g = 0;
    for (const s of i.createdCollections)
      try {
        const w = await figma.variables.getVariableCollectionByIdAsync(
          s.collectionId
        );
        w ? (w.remove(), g++, await a.log(
          `Deleted collection: ${s.collectionName} (${s.collectionId})`
        )) : await a.warning(
          `Collection ${s.collectionName} (${s.collectionId}) not found - may have already been deleted`
        );
      } catch (w) {
        await a.warning(
          `Failed to delete collection ${s.collectionName}: ${w instanceof Error ? w.message : String(w)}`
        );
      }
    const f = d.map((s) => ({
      page: s,
      name: s.name,
      id: s.id
    })), h = figma.currentPage;
    if (f.some(
      (s) => s.id === h.id
    )) {
      await figma.loadAllPagesAsync();
      const w = figma.root.children.find(
        (A) => A.type === "PAGE" && !f.some((S) => S.id === A.id)
      );
      w ? (await figma.setCurrentPageAsync(w), await a.log(
        `Switched away from page "${h.name}" before deletion`
      )) : await a.warning(
        "No safe page to switch to - all pages are being deleted"
      );
    }
    for (const { page: s, name: w } of f)
      try {
        let A = !1;
        try {
          await figma.loadAllPagesAsync(), A = figma.root.children.some((m) => m.id === s.id);
        } catch (S) {
          A = !1;
        }
        if (!A) {
          await a.log(`Page "${w}" already deleted, skipping`);
          continue;
        }
        if (figma.currentPage.id === s.id) {
          await figma.loadAllPagesAsync();
          const m = figma.root.children.find(
            (M) => M.type === "PAGE" && M.id !== s.id && !f.some((E) => E.id === M.id)
          );
          m && await figma.setCurrentPageAsync(m);
        }
        s.remove(), await a.log(`Deleted page: "${w}"`);
      } catch (A) {
        await a.warning(
          `Failed to delete page "${w}": ${A instanceof Error ? A.message : String(A)}`
        );
      }
    await a.log("=== Import Group Deletion Complete ===");
    const N = {
      success: !0,
      deletedPages: d.length,
      deletedCollections: g,
      deletedVariables: r
    };
    return Q("deleteImportGroup", N);
  } catch (t) {
    const n = t instanceof Error ? t.message : "Unknown error occurred";
    return await a.error(`Delete failed: ${n}`), ce(
      "deleteImportGroup",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
async function Fa(e) {
  try {
    await a.log("=== Cleaning up failed import ==="), await figma.loadAllPagesAsync();
    const t = figma.root.children;
    let n = null;
    for (const f of t) {
      if (f.type !== "PAGE")
        continue;
      if (f.getPluginData(te)) {
        n = f;
        break;
      }
    }
    if (n)
      return await a.log(
        "Found page with metadata, using deleteImportGroup"
      ), await wt({ pageId: n.id });
    await a.log(
      "No metadata found, deleting pages with UNDER_REVIEW_KEY"
    );
    const i = [];
    for (const f of t) {
      if (f.type !== "PAGE")
        continue;
      f.getPluginData(q) === "true" && i.push({ id: f.id, name: f.name });
    }
    const o = figma.currentPage;
    if (i.some(
      (f) => f.id === o.id
    )) {
      await figma.loadAllPagesAsync();
      const h = figma.root.children.find(
        (u) => u.type === "PAGE" && !i.some((N) => N.id === u.id)
      );
      h && (await figma.setCurrentPageAsync(h), await a.log(
        `Switched away from page "${o.name}" before deletion`
      ));
    }
    let r = 0;
    for (const f of i)
      try {
        await figma.loadAllPagesAsync();
        const h = await figma.getNodeByIdAsync(
          f.id
        );
        if (!h || h.type !== "PAGE")
          continue;
        if (figma.currentPage.id === h.id) {
          await figma.loadAllPagesAsync();
          const N = figma.root.children.find(
            (s) => s.type === "PAGE" && s.id !== h.id && !i.some((w) => w.id === s.id)
          );
          N && await figma.setCurrentPageAsync(N);
        }
        h.remove(), r++, await a.log(`Deleted page: "${f.name}"`);
      } catch (h) {
        await a.warning(
          `Failed to delete page "${f.name}" (${f.id.substring(0, 8)}...): ${h instanceof Error ? h.message : String(h)}`
        );
      }
    return await a.log("=== Failed Import Cleanup Complete ==="), Q("cleanupFailedImport", {
      success: !0,
      deletedPages: r,
      deletedCollections: 0,
      // Can't clean up without metadata
      deletedVariables: 0
      // Can't clean up without metadata
    });
  } catch (t) {
    const n = t instanceof Error ? t.message : "Unknown error occurred";
    return await a.error(`Cleanup failed: ${n}`), ce(
      "cleanupFailedImport",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
async function za(e) {
  try {
    await a.log("=== Clearing Import Metadata ==="), await figma.loadAllPagesAsync();
    const t = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!t || t.type !== "PAGE")
      throw new Error("Page not found");
    t.setPluginData(te, ""), t.setPluginData(q, "");
    const n = figma.root.children;
    for (const o of n)
      if (o.type === "PAGE" && o.getPluginData(q) === "true") {
        const r = o.getPluginData(te);
        if (r)
          try {
            JSON.parse(r), o.setPluginData(q, "");
          } catch (g) {
            o.setPluginData(q, "");
          }
        else
          o.setPluginData(q, "");
      }
    return await a.log(
      "Cleared import metadata from page and related pages"
    ), Q("clearImportMetadata", {
      success: !0
    });
  } catch (t) {
    const n = t instanceof Error ? t.message : "Unknown error occurred";
    return await a.error(`Clear metadata failed: ${n}`), ce(
      "clearImportMetadata",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
async function ja(e) {
  try {
    await a.log("=== Summarizing Variables for Wizard ===");
    const t = [];
    for (const { fileName: w, jsonData: A } of e.jsonFiles)
      try {
        const S = We(A);
        if (!S.success || !S.expandedJsonData) {
          await a.warning(
            `Skipping ${w} - failed to expand JSON: ${S.error || "Unknown error"}`
          );
          continue;
        }
        const m = S.expandedJsonData;
        if (!m.collections)
          continue;
        const E = ve.fromTable(
          m.collections
        );
        if (!m.variables)
          continue;
        const V = Ee.fromTable(m.variables).getTable();
        for (const _ of Object.values(V)) {
          if (_._colRef === void 0)
            continue;
          const P = E.getCollectionByIndex(
            _._colRef
          );
          if (P) {
            const v = ae(
              P.collectionName
            ).toLowerCase();
            (v === "tokens" || v === "theme" || v === "layer") && t.push({
              name: _.variableName,
              collectionName: v
              // Use lowercase for consistency ("layer" not "layers")
            });
          }
        }
      } catch (S) {
        await a.warning(
          `Error processing ${w}: ${S instanceof Error ? S.message : String(S)}`
        );
        continue;
      }
    const n = await figma.variables.getLocalVariableCollectionsAsync();
    let i = null, o = null, d = null;
    for (const w of n) {
      const S = ae(w.name).toLowerCase();
      (S === "tokens" || S === "token") && !i ? i = w : (S === "theme" || S === "themes") && !o ? o = w : (S === "layer" || S === "layers") && !d && (d = w);
    }
    const r = t.filter(
      (w) => w.collectionName === "tokens"
    ), g = t.filter((w) => w.collectionName === "theme"), f = t.filter((w) => w.collectionName === "layer"), h = {
      existing: 0,
      new: 0
    }, u = {
      existing: 0,
      new: 0
    }, N = {
      existing: 0,
      new: 0
    };
    if (e.tokensCollection === "existing" && i) {
      const w = /* @__PURE__ */ new Set();
      for (const A of i.variableIds)
        try {
          const S = figma.variables.getVariableById(A);
          S && w.add(S.name);
        } catch (S) {
          continue;
        }
      for (const A of r)
        w.has(A.name) ? h.existing++ : h.new++;
    } else
      h.new = r.length;
    if (e.themeCollection === "existing" && o) {
      const w = /* @__PURE__ */ new Set();
      for (const A of o.variableIds)
        try {
          const S = figma.variables.getVariableById(A);
          S && w.add(S.name);
        } catch (S) {
          continue;
        }
      for (const A of g)
        w.has(A.name) ? u.existing++ : u.new++;
    } else
      u.new = g.length;
    if (e.layersCollection === "existing" && d) {
      const w = /* @__PURE__ */ new Set();
      for (const A of d.variableIds)
        try {
          const S = figma.variables.getVariableById(A);
          S && w.add(S.name);
        } catch (S) {
          continue;
        }
      for (const A of f)
        w.has(A.name) ? N.existing++ : N.new++;
    } else
      N.new = f.length;
    return await a.log(
      `Variable summary: Tokens - ${h.existing} existing, ${h.new} new; Theme - ${u.existing} existing, ${u.new} new; Layers - ${N.existing} existing, ${N.new} new`
    ), Q("summarizeVariablesForWizard", {
      tokens: h,
      theme: u,
      layers: N
    });
  } catch (t) {
    const n = t instanceof Error ? t.message : "Unknown error occurred";
    return await a.error(`Summarize failed: ${n}`), ce(
      "summarizeVariablesForWizard",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
async function Da(e) {
  try {
    const t = "recursica:collectionId", i = {
      collections: (await figma.variables.getLocalVariableCollectionsAsync()).map((o) => {
        const d = o.getSharedPluginData("recursica", t);
        return {
          id: o.id,
          name: o.name,
          guid: d || void 0
        };
      })
    };
    return Q(
      "getLocalVariableCollections",
      i
    );
  } catch (t) {
    return ce(
      "getLocalVariableCollections",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
async function Ja(e) {
  try {
    const t = "recursica:collectionId", n = [];
    for (const o of e.collectionIds)
      try {
        const d = await figma.variables.getVariableCollectionByIdAsync(o);
        if (d) {
          const r = d.getSharedPluginData(
            "recursica",
            t
          );
          n.push({
            collectionId: o,
            guid: r || null
          });
        } else
          n.push({
            collectionId: o,
            guid: null
          });
      } catch (d) {
        await a.warning(
          `Failed to get GUID for collection ${o}: ${d instanceof Error ? d.message : String(d)}`
        ), n.push({
          collectionId: o,
          guid: null
        });
      }
    return Q(
      "getCollectionGuids",
      {
        collectionGuids: n
      }
    );
  } catch (t) {
    return ce(
      "getCollectionGuids",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
async function Wa(e) {
  try {
    await a.log("=== Starting Import Group Merge ==="), await figma.loadAllPagesAsync();
    const t = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!t || t.type !== "PAGE")
      throw new Error("Main page not found");
    const n = t.getPluginData(te);
    if (!n)
      throw new Error("Primary import metadata not found on page");
    const i = JSON.parse(n);
    await a.log(
      `Found metadata for component: ${i.componentName} (Version: ${i.componentVersion})`
    );
    let o = 0, d = 0;
    const r = "recursica:collectionId";
    for (const m of e.collectionChoices)
      if (m.choice === "merge")
        try {
          const M = await figma.variables.getVariableCollectionByIdAsync(
            m.newCollectionId
          );
          if (!M) {
            await a.warning(
              `New collection ${m.newCollectionId} not found, skipping merge`
            );
            continue;
          }
          let E = null;
          if (m.existingCollectionId)
            E = await figma.variables.getVariableCollectionByIdAsync(
              m.existingCollectionId
            );
          else {
            const v = M.getSharedPluginData(
              "recursica",
              r
            );
            if (v) {
              const x = await figma.variables.getLocalVariableCollectionsAsync();
              for (const T of x)
                if (T.getSharedPluginData(
                  "recursica",
                  r
                ) === v && T.id !== m.newCollectionId) {
                  E = T;
                  break;
                }
              if (!E && (v === ge.LAYER || v === ge.TOKENS || v === ge.THEME)) {
                let T;
                v === ge.LAYER ? T = se.LAYER : v === ge.TOKENS ? T = se.TOKENS : T = se.THEME;
                for (const G of x)
                  if (G.getSharedPluginData(
                    "recursica",
                    r
                  ) === v && G.name === T && G.id !== m.newCollectionId) {
                    E = G;
                    break;
                  }
                E || (E = figma.variables.createVariableCollection(T), E.setSharedPluginData(
                  "recursica",
                  r,
                  v
                ), await a.log(
                  `Created new standard collection: "${T}"`
                ));
              }
            }
          }
          if (!E) {
            await a.warning(
              "Could not find or create existing collection for merge, skipping"
            );
            continue;
          }
          await a.log(
            `Merging collection "${M.name}" (${m.newCollectionId.substring(0, 8)}...) into "${E.name}" (${E.id.substring(0, 8)}...)`
          );
          const R = M.variableIds.map(
            (v) => figma.variables.getVariableByIdAsync(v)
          ), V = await Promise.all(R), _ = E.variableIds.map(
            (v) => figma.variables.getVariableByIdAsync(v)
          ), P = await Promise.all(_), I = new Set(
            P.filter((v) => v !== null).map((v) => v.name)
          );
          for (const v of V)
            if (v)
              try {
                if (I.has(v.name)) {
                  await a.warning(
                    `Variable "${v.name}" already exists in collection "${E.name}", skipping`
                  );
                  continue;
                }
                const x = figma.variables.createVariable(
                  v.name,
                  E,
                  v.resolvedType
                );
                for (const T of E.modes) {
                  const G = T.modeId;
                  let p = v.valuesByMode[G];
                  if (p === void 0 && M.modes.length > 0) {
                    const y = M.modes[0].modeId;
                    p = v.valuesByMode[y];
                  }
                  p !== void 0 && x.setValueForMode(G, p);
                }
                await a.log(
                  `  ✓ Copied variable "${v.name}" to collection "${E.name}"`
                );
              } catch (x) {
                await a.warning(
                  `Failed to copy variable "${v.name}": ${x instanceof Error ? x.message : String(x)}`
                );
              }
          M.remove(), o++, await a.log(
            `✓ Merged and deleted collection: ${M.name}`
          );
        } catch (M) {
          await a.warning(
            `Failed to merge collection: ${M instanceof Error ? M.message : String(M)}`
          );
        }
      else
        d++, await a.log(`Kept collection: ${m.newCollectionId}`);
    await a.log("Removing dividers...");
    const g = figma.root.children, f = [];
    for (const m of g) {
      if (m.type !== "PAGE") continue;
      const M = m.getPluginData(ie);
      (M === "start" || M === "end") && f.push(m);
    }
    const h = figma.currentPage;
    if (f.some((m) => m.id === h.id))
      if (t && t.id !== h.id)
        figma.currentPage = t;
      else {
        const m = g.find(
          (M) => M.type === "PAGE" && !f.some((E) => E.id === M.id)
        );
        m && (figma.currentPage = m);
      }
    const u = f.map((m) => m.name);
    for (const m of f)
      try {
        m.remove();
      } catch (M) {
        await a.warning(
          `Failed to delete divider: ${M instanceof Error ? M.message : String(M)}`
        );
      }
    for (const m of u)
      await a.log(`Deleted divider: ${m}`);
    await a.log("Removing construction icons and renaming pages..."), await figma.loadAllPagesAsync();
    const N = figma.root.children;
    let s = 0;
    const w = "RecursicaPublishedMetadata", A = [];
    for (const m of N)
      if (m.type === "PAGE")
        try {
          if (m.getPluginData(q) === "true") {
            const E = m.getPluginData(w);
            let R = {};
            if (E)
              try {
                R = JSON.parse(E);
              } catch (V) {
              }
            A.push({
              pageId: m.id,
              pageName: m.name,
              pageMetadata: R
            });
          }
        } catch (M) {
          await a.warning(
            `Failed to process page: ${M instanceof Error ? M.message : String(M)}`
          );
        }
    for (const m of A)
      try {
        const M = await figma.getNodeByIdAsync(
          m.pageId
        );
        if (!M || M.type !== "PAGE") {
          await a.warning(
            `Page ${m.pageId} not found, skipping rename`
          );
          continue;
        }
        let E = M.name;
        if (E.startsWith(le) && (E = E.substring(le.length).trim()), E === "REMOTES" || E.includes("REMOTES")) {
          M.name = "REMOTES", s++, await a.log(`Renamed page: "${M.name}" -> "REMOTES"`);
          continue;
        }
        const V = m.pageMetadata.name && m.pageMetadata.name.length > 0 && !m.pageMetadata.name.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        ) ? m.pageMetadata.name : i.componentName || E, _ = m.pageMetadata.version !== void 0 ? m.pageMetadata.version : i.componentVersion, P = `${V} (VERSION: ${_})`;
        M.name = P, s++, await a.log(`Renamed page: "${E}" -> "${P}"`);
      } catch (M) {
        await a.warning(
          `Failed to rename page ${m.pageId}: ${M instanceof Error ? M.message : String(M)}`
        );
      }
    if (await a.log("Clearing import metadata..."), t)
      try {
        t.setPluginData(te, "");
      } catch (m) {
        await a.warning(
          `Failed to clear primary import metadata: ${m instanceof Error ? m.message : String(m)}`
        );
      }
    for (const m of A)
      try {
        const M = await figma.getNodeByIdAsync(
          m.pageId
        );
        M && M.type === "PAGE" && M.setPluginData(q, "");
      } catch (M) {
        await a.warning(
          `Failed to clear under review metadata for page ${m.pageId}: ${M instanceof Error ? M.message : String(M)}`
        );
      }
    const S = {
      mergedCollections: o,
      keptCollections: d,
      pagesRenamed: s
    };
    return await a.log(
      `=== Merge Complete ===
  Merged: ${o} collection(s)
  Kept: ${d} collection(s)
  Renamed: ${s} page(s)`
    ), Q(
      "mergeImportGroup",
      S
    );
  } catch (t) {
    return await a.error(
      `Merge failed: ${t instanceof Error ? t.message : String(t)}`
    ), ce(
      "mergeImportGroup",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
const Ka = {
  getCurrentUser: Ct,
  loadPages: St,
  exportPage: De,
  importPage: dt,
  cleanupCreatedEntities: Pa,
  resolveDeferredNormalInstances: gt,
  determineImportOrder: ft,
  buildDependencyGraph: pt,
  resolveImportOrder: mt,
  importPagesInOrder: ut,
  quickCopy: Ca,
  storeAuthData: Sa,
  loadAuthData: Ia,
  clearAuthData: Ta,
  storeImportData: Oa,
  loadImportData: Ma,
  clearImportData: Va,
  storeSelectedRepo: xa,
  getComponentMetadata: Ra,
  getAllComponents: ka,
  pluginPromptResponse: Ga,
  switchToPage: La,
  checkForExistingPrimaryImport: _a,
  createImportDividers: Ba,
  importSingleComponentWithWizard: Ua,
  deleteImportGroup: wt,
  clearImportMetadata: za,
  cleanupFailedImport: Fa,
  summarizeVariablesForWizard: ja,
  getLocalVariableCollections: Da,
  getCollectionGuids: Ja,
  mergeImportGroup: Wa
}, Ha = Ka;
figma.showUI(__html__, {
  width: 500,
  height: 500
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    Gt(e);
    return;
  }
  const t = e;
  try {
    const n = t.type, i = Ha[n];
    if (!i) {
      console.warn("Unknown message type:", t.type);
      const d = {
        type: t.type,
        success: !1,
        error: !0,
        message: "Unknown message type: " + t.type,
        data: {},
        requestId: t.requestId
      };
      figma.ui.postMessage(d);
      return;
    }
    const o = await i(t.data);
    figma.ui.postMessage(ee(J({}, o), {
      requestId: t.requestId
    }));
  } catch (n) {
    console.error("Error handling message:", n);
    const i = {
      type: t.type,
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {},
      requestId: t.requestId
    };
    figma.ui.postMessage(i);
  }
};
