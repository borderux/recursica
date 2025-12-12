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
}, Q = (e, t) => vt(e, Et(t));
var ae = (e, t, n) => Ge(e, typeof t != "symbol" ? t + "" : t, n);
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
async function It(e) {
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
const X = {
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
}, Y = Q(J({}, X), {
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
}), oe = Q(J({}, X), {
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
}), fe = Q(J({}, X), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), Qe = Q(J({}, X), {
  cornerRadius: 0
}), St = Q(J({}, X), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function Tt(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return Y;
    case "TEXT":
      return oe;
    case "VECTOR":
      return fe;
    case "LINE":
      return St;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return Qe;
    default:
      return X;
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
function te(e) {
  const t = e.trim(), i = t.replace(/_\d+$/, "").toLowerCase();
  return i === "themes" || i === "theme" ? se.THEME : i === "token" || i === "tokens" ? se.TOKENS : i === "layer" || i === "layers" ? se.LAYER : t;
}
function de(e) {
  const t = te(e);
  return t === se.LAYER || t === se.TOKENS || t === se.THEME;
}
function Me(e) {
  const t = te(e);
  if (t === se.LAYER)
    return ge.LAYER;
  if (t === se.TOKENS)
    return ge.TOKENS;
  if (t === se.THEME)
    return ge.THEME;
}
class ve {
  constructor() {
    ae(this, "collectionMap");
    // collectionId -> index
    ae(this, "collections");
    // index -> collection data
    ae(this, "normalizedNameMap");
    // normalized name -> index (for standard collections)
    ae(this, "nextIndex");
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
    const i = te(
      t.collectionName
    );
    if (de(t.collectionName)) {
      const r = this.findCollectionByNormalizedName(i);
      if (r !== void 0) {
        const m = this.collections[r];
        return m.modes = this.mergeModes(
          m.modes,
          t.modes
        ), this.collectionMap.set(n, r), r;
      }
    }
    const o = this.nextIndex++;
    this.collectionMap.set(n, o);
    const l = Q(J({}, t), {
      collectionName: i
    });
    if (de(t.collectionName)) {
      const r = Me(
        t.collectionName
      );
      r && (l.collectionGuid = r), this.normalizedNameMap.set(i, o);
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
      (l, r) => parseInt(l[0], 10) - parseInt(r[0], 10)
    );
    for (const [l, r] of i) {
      const m = parseInt(l, 10), f = (o = r.isLocal) != null ? o : !0, h = te(
        r.collectionName || ""
      ), u = r.collectionId || r.collectionGuid || `temp:${m}:${h}`, $ = J({
        collectionName: h,
        collectionId: u,
        isLocal: f,
        modes: r.modes || []
      }, r.collectionGuid && {
        collectionGuid: r.collectionGuid
      });
      n.collectionMap.set(u, m), n.collections[m] = $, de(h) && n.normalizedNameMap.set(h, m), n.nextIndex = Math.max(
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
    ae(this, "variableMap");
    // variableKey -> index
    ae(this, "variables");
    // index -> variable data
    ae(this, "nextIndex");
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
      ), l = J(J({
        variableName: i.variableName,
        variableType: Vt(i.variableType)
      }, i._colRef !== void 0 && { _colRef: i._colRef }), o && { valuesByMode: o });
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
    const n = new Ee(), i = Object.entries(t).sort(
      (o, l) => parseInt(o[0], 10) - parseInt(l[0], 10)
    );
    for (const [o, l] of i) {
      const r = parseInt(o, 10), m = xt(l.variableType), f = Q(J({}, l), {
        variableType: m
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
  const l = {};
  for (const [r, m] of Object.entries(e)) {
    const f = Lt(r, i);
    if (m == null) {
      l[f] = m;
      continue;
    }
    if (typeof m == "string" || typeof m == "number" || typeof m == "boolean") {
      l[f] = m;
      continue;
    }
    if (typeof m == "object" && m !== null && "type" in m && m.type === "VARIABLE_ALIAS" && "id" in m) {
      const h = m.id;
      if (o.has(h)) {
        l[f] = {
          type: "VARIABLE_ALIAS",
          id: h
        };
        continue;
      }
      const u = await figma.variables.getVariableByIdAsync(h);
      if (!u) {
        l[f] = {
          type: "VARIABLE_ALIAS",
          id: h
        };
        continue;
      }
      const $ = new Set(o);
      $.add(h);
      const c = await figma.variables.getVariableCollectionByIdAsync(
        u.variableCollectionId
      ), w = u.key;
      if (!w) {
        l[f] = {
          type: "VARIABLE_ALIAS",
          id: h
        };
        continue;
      }
      const A = {
        variableName: u.name,
        variableType: u.resolvedType,
        collectionName: c == null ? void 0 : c.name,
        collectionId: u.variableCollectionId,
        variableKey: w,
        id: h,
        isLocal: !u.remote
      };
      if (c) {
        const p = await tt(
          c,
          n
        );
        A._colRef = p, u.valuesByMode && (A.valuesByMode = await et(
          u.valuesByMode,
          t,
          n,
          c,
          // Pass collection for mode ID to name conversion
          $
        ));
      }
      const P = t.addVariable(A);
      l[f] = {
        type: "VARIABLE_ALIAS",
        id: h,
        _varRef: P
      };
    } else
      l[f] = m;
  }
  return l;
}
const Ie = "recursica:collectionId";
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
        const l = e.getSharedPluginData(
          "recursica",
          Ie
        );
        return (!l || l.trim() === "") && e.setSharedPluginData(
          "recursica",
          Ie,
          o
        ), o;
      }
    }
    const n = e.getSharedPluginData(
      "recursica",
      Ie
    );
    if (n && n.trim() !== "")
      return n;
    const i = await je();
    return e.setSharedPluginData("recursica", Ie, i), i;
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
  const o = await _t(e), l = e.modes.map((h) => h.name), r = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: n,
    modes: l,
    collectionGuid: o
  }, m = t.addCollection(r), f = n ? "local" : "remote";
  return await a.log(
    `  Added ${f} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), m;
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
    const l = i.key;
    if (!l)
      return console.log("Variable missing key:", e.id), null;
    const r = await tt(
      o,
      n
    ), m = {
      variableName: i.name,
      variableType: i.resolvedType,
      _colRef: r,
      // Reference to collection table (v2.4.0+)
      variableKey: l,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    i.valuesByMode && (m.valuesByMode = await et(
      i.valuesByMode,
      t,
      n,
      o,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const f = t.addVariable(m);
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
      const l = e[o];
      if (l && typeof l == "object" && !Array.isArray(l))
        if (l.type === "VARIABLE_ALIAS") {
          const r = await _e(
            l,
            t,
            n
          );
          r && (i[o] = r);
        } else
          i[o] = await ye(
            l,
            t,
            n
          );
      else Array.isArray(l) ? i[o] = await Promise.all(
        l.map(async (r) => (r == null ? void 0 : r.type) === "VARIABLE_ALIAS" ? await _e(
          r,
          t,
          n
        ) || r : r && typeof r == "object" ? await ye(
          r,
          t,
          n
        ) : r)
      ) : i[o] = l;
    }
  return i;
}
async function at(e, t, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const o = {};
      for (const l in i)
        Object.prototype.hasOwnProperty.call(i, l) && (l === "boundVariables" ? o[l] = await ye(
          i[l],
          t,
          n
        ) : o[l] = i[l]);
      return o;
    })
  );
}
async function nt(e, t, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const o = {};
      for (const l in i)
        Object.prototype.hasOwnProperty.call(i, l) && (l === "boundVariables" ? o[l] = await ye(
          i[l],
          t,
          n
        ) : o[l] = i[l]);
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
  if (e.type && (n.type = e.type, i.add("type")), e.id && (n.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (n.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (n.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (n.y = e.y, i.add("y")), e.width !== void 0 && (n.width = e.width, i.add("width")), e.height !== void 0 && (n.height = e.height, i.add("height")), e.visible !== void 0 && z(e.visible, X.visible) && (n.visible = e.visible, i.add("visible")), e.locked !== void 0 && z(e.locked, X.locked) && (n.locked = e.locked, i.add("locked")), e.opacity !== void 0 && z(e.opacity, X.opacity) && (n.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && z(e.rotation, X.rotation) && (n.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && z(e.blendMode, X.blendMode) && (n.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && z(e.effects, X.effects) && (n.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const o = await at(
      e.fills,
      t.variableTable,
      t.collectionTable
    );
    z(o, X.fills) && (n.fills = o), i.add("fills");
  }
  if (e.strokes !== void 0 && z(e.strokes, X.strokes) && (n.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && z(e.strokeWeight, X.strokeWeight) && (n.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && z(e.strokeAlign, X.strokeAlign) && (n.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
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
  return e.layoutMode !== void 0 && z(e.layoutMode, Y.layoutMode) && (n.layoutMode = e.layoutMode, i.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && z(
    e.primaryAxisSizingMode,
    Y.primaryAxisSizingMode
  ) && (n.primaryAxisSizingMode = e.primaryAxisSizingMode, i.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && z(
    e.counterAxisSizingMode,
    Y.counterAxisSizingMode
  ) && (n.counterAxisSizingMode = e.counterAxisSizingMode, i.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && z(
    e.primaryAxisAlignItems,
    Y.primaryAxisAlignItems
  ) && (n.primaryAxisAlignItems = e.primaryAxisAlignItems, i.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && z(
    e.counterAxisAlignItems,
    Y.counterAxisAlignItems
  ) && (n.counterAxisAlignItems = e.counterAxisAlignItems, i.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && z(e.paddingLeft, Y.paddingLeft) && (n.paddingLeft = e.paddingLeft, i.add("paddingLeft")), e.paddingRight !== void 0 && z(e.paddingRight, Y.paddingRight) && (n.paddingRight = e.paddingRight, i.add("paddingRight")), e.paddingTop !== void 0 && z(e.paddingTop, Y.paddingTop) && (n.paddingTop = e.paddingTop, i.add("paddingTop")), e.paddingBottom !== void 0 && z(e.paddingBottom, Y.paddingBottom) && (n.paddingBottom = e.paddingBottom, i.add("paddingBottom")), e.itemSpacing !== void 0 && z(e.itemSpacing, Y.itemSpacing) && (n.itemSpacing = e.itemSpacing, i.add("itemSpacing")), e.counterAxisSpacing !== void 0 && z(
    e.counterAxisSpacing,
    Y.counterAxisSpacing
  ) && (n.counterAxisSpacing = e.counterAxisSpacing, i.add("counterAxisSpacing")), e.cornerRadius !== void 0 && z(e.cornerRadius, Y.cornerRadius) && (n.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.clipsContent !== void 0 && z(e.clipsContent, Y.clipsContent) && (n.clipsContent = e.clipsContent, i.add("clipsContent")), e.layoutWrap !== void 0 && z(e.layoutWrap, Y.layoutWrap) && (n.layoutWrap = e.layoutWrap, i.add("layoutWrap")), e.layoutGrow !== void 0 && z(e.layoutGrow, Y.layoutGrow) && (n.layoutGrow = e.layoutGrow, i.add("layoutGrow")), n;
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
const Se = /* @__PURE__ */ new Map();
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
    var m;
    const n = typeof t == "number" ? { timeoutMs: t } : t, i = (m = n == null ? void 0 : n.timeoutMs) != null ? m : 3e5, o = n == null ? void 0 : n.okLabel, l = n == null ? void 0 : n.cancelLabel, r = Ht();
    return new Promise((f, h) => {
      const u = i === -1 ? null : setTimeout(() => {
        Se.delete(r), h(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      Se.set(r, {
        resolve: f,
        reject: h,
        timeout: u
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: J(J({
          message: e,
          requestId: r
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
    const { requestId: t, action: n } = e, i = Se.get(t);
    if (!i) {
      console.warn(
        `Received response for unknown prompt request: ${t}`
      );
      return;
    }
    i.timeout && clearTimeout(i.timeout), Se.delete(t), n === "ok" ? i.resolve() : i.reject(new Error("User cancelled"));
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
  var o, l;
  const n = {}, i = /* @__PURE__ */ new Set();
  if (n._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const r = await e.getMainComponentAsync();
    if (!r) {
      const M = e.name || "(unnamed)", S = e.id;
      if (t.detachedComponentsHandled.has(S))
        await a.log(
          `Treating detached instance "${M}" as internal instance (already prompted)`
        );
      else {
        await a.warning(
          `Found detached instance: "${M}" (main component is missing)`
        );
        const s = `Found detached instance "${M}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await be.prompt(s, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(S), await a.log(
            `Treating detached instance "${M}" as internal instance`
          );
        } catch (d) {
          if (d instanceof Error && d.message === "User cancelled") {
            const b = `Export cancelled: Detached instance "${M}" found. Please fix the instance before exporting.`;
            await a.error(b);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch (I) {
              console.warn("Could not scroll to instance:", I);
            }
            throw new Error(b);
          } else
            throw d;
        }
      }
      if (!Le(e).page) {
        const s = `Detached instance "${M}" is not on any page. Cannot export.`;
        throw await a.error(s), new Error(s);
      }
      let V, R;
      try {
        e.variantProperties && (V = e.variantProperties), e.componentProperties && (R = e.componentProperties);
      } catch (s) {
      }
      const g = J(J({
        instanceType: "internal",
        componentName: M,
        componentNodeId: e.id
      }, V && { variantProperties: V }), R && { componentProperties: R }), y = t.instanceTable.addInstance(g);
      return n._instanceRef = y, i.add("_instanceRef"), await a.log(
        `  Exported detached INSTANCE: "${M}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), n;
    }
    const m = e.name || "(unnamed)", f = r.name || "(unnamed)", h = r.remote === !0, $ = Le(e).page, c = Le(r);
    let w = c.page;
    if (!w && h)
      try {
        await figma.loadAllPagesAsync();
        const M = figma.root.children;
        let S = null;
        for (const E of M)
          try {
            if (E.findOne(
              (V) => V.id === r.id
            )) {
              S = E;
              break;
            }
          } catch (O) {
          }
        if (!S) {
          const E = r.id.split(":")[0];
          for (const O of M) {
            const V = O.id.split(":")[0];
            if (E === V) {
              S = O;
              break;
            }
          }
        }
        S && (w = S);
      } catch (M) {
      }
    let A, P = w;
    if (h)
      if (w) {
        const M = Ye(w);
        A = "normal", P = w, M != null && M.id ? await a.log(
          `  Component "${f}" is from library but also exists on local page "${w.name}" with metadata. Treating as "normal" instance.`
        ) : await a.log(
          `  Component "${f}" is from library and exists on local page "${w.name}" (no metadata). Treating as "normal" instance - page should be published first.`
        );
      } else
        A = "remote", await a.log(
          `  Component "${f}" is from library and not on a local page. Treating as "remote" instance.`
        );
    else if (w && $ && w.id === $.id)
      A = "internal";
    else if (w && $ && w.id !== $.id)
      A = "normal";
    else if (w && !$)
      A = "normal";
    else if (!h && c.reason === "detached") {
      const M = r.id;
      if (t.detachedComponentsHandled.has(M))
        A = "remote", await a.log(
          `Treating detached instance "${m}" -> component "${f}" as remote instance (already prompted)`
        );
      else {
        await a.warning(
          `Found detached instance: "${m}" -> component "${f}" (component is not on any page)`
        );
        try {
          await figma.viewport.scrollAndZoomIntoView([r]);
        } catch (E) {
          console.warn("Could not scroll to component:", E);
        }
        const S = `Found detached instance "${m}" attached to component "${f}". This should be fixed. Continue to publish?`;
        try {
          await be.prompt(S, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(M), A = "remote", await a.log(
            `Treating detached instance "${m}" as remote instance (will be created on REMOTES page)`
          );
        } catch (E) {
          if (E instanceof Error && E.message === "User cancelled") {
            const O = `Export cancelled: Detached instance "${m}" found. The component "${f}" is not on any page. Please fix the instance before exporting.`;
            throw await a.error(O), new Error(O);
          } else
            throw E;
        }
      }
    } else
      h || await a.warning(
        `  Instance "${m}" -> component "${f}": componentPage is null but component is not remote. Reason: ${c.reason}. Cannot determine instance type.`
      ), A = "normal";
    let p, v;
    try {
      if (e.variantProperties && (p = e.variantProperties, await a.log(
        `  Instance "${m}" -> variantProperties from instance: ${JSON.stringify(p)}`
      )), typeof e.getProperties == "function")
        try {
          const M = await e.getProperties();
          M && M.variantProperties && (await a.log(
            `  Instance "${m}" -> variantProperties from getProperties(): ${JSON.stringify(M.variantProperties)}`
          ), M.variantProperties && Object.keys(M.variantProperties).length > 0 && (p = M.variantProperties));
        } catch (M) {
          await a.log(
            `  Instance "${m}" -> getProperties() not available or failed: ${M}`
          );
        }
      if (e.componentProperties && (v = e.componentProperties), r.parent && r.parent.type === "COMPONENT_SET") {
        const M = r.parent;
        try {
          const S = M.componentPropertyDefinitions;
          S && await a.log(
            `  Component set "${M.name}" has property definitions: ${JSON.stringify(Object.keys(S))}`
          );
          const E = {}, O = f.split(",").map((V) => V.trim());
          for (const V of O) {
            const R = V.split("=").map((g) => g.trim());
            if (R.length >= 2) {
              const g = R[0], y = R.slice(1).join("=").trim();
              S && S[g] && (E[g] = y);
            }
          }
          if (Object.keys(E).length > 0 && await a.log(
            `  Parsed variant properties from component name "${f}": ${JSON.stringify(E)}`
          ), p && Object.keys(p).length > 0)
            await a.log(
              `  Using variant properties from instance (source of truth): ${JSON.stringify(p)}`
            );
          else if (Object.keys(E).length > 0)
            p = E, await a.log(
              `  Using variant properties from component name (fallback): ${JSON.stringify(p)}`
            );
          else if (r.variantProperties) {
            const V = r.variantProperties;
            await a.log(
              `  Main component "${f}" has variantProperties: ${JSON.stringify(V)}`
            ), p = V;
          }
        } catch (S) {
          await a.warning(
            `  Could not get variant properties from component set: ${S}`
          );
        }
      }
    } catch (M) {
    }
    let C, L;
    try {
      let M = r.parent;
      const S = [];
      let E = 0;
      const O = 20;
      for (; M && E < O; )
        try {
          const V = M.type, R = M.name;
          if (V === "COMPONENT_SET" && !L && (L = R), V === "PAGE")
            break;
          const g = R || "";
          S.unshift(g), M = M.parent, E++;
        } catch (V) {
          break;
        }
      C = S;
    } catch (M) {
    }
    const x = J(J(J(J({
      instanceType: A,
      componentName: f
    }, L && { componentSetName: L }), p && { variantProperties: p }), v && { componentProperties: v }), A === "normal" ? { path: C || [] } : C && C.length > 0 && {
      path: C
    });
    if (A === "internal") {
      x.componentNodeId = r.id, await a.log(
        `  Found INSTANCE: "${m}" -> INTERNAL component "${f}" (ID: ${r.id.substring(0, 8)}...)`
      );
      const M = e.boundVariables, S = r.boundVariables;
      if (M && typeof M == "object") {
        const g = Object.keys(M);
        await a.log(
          `  DEBUG: Internal instance "${m}" -> boundVariables keys: ${g.length > 0 ? g.join(", ") : "none"}`
        );
        for (const s of g) {
          const d = M[s], b = (d == null ? void 0 : d.type) || typeof d;
          await a.log(
            `  DEBUG:   boundVariables.${s}: type=${b}, value=${JSON.stringify(d)}`
          );
        }
        const y = [
          "backgrounds",
          "selectionColor",
          "selectionColors",
          "selection",
          "selectColor"
        ];
        for (const s of y)
          M[s] !== void 0 && await a.log(
            `  DEBUG:   Found potential "Selection colors" property: boundVariables.${s} = ${JSON.stringify(M[s])}`
          );
      } else
        await a.log(
          `  DEBUG: Internal instance "${m}" -> No boundVariables found on instance node`
        );
      if (S && typeof S == "object") {
        const g = Object.keys(S);
        await a.log(
          `  DEBUG: Main component "${f}" -> boundVariables keys: ${g.length > 0 ? g.join(", ") : "none"}`
        );
      }
      const E = e.backgrounds;
      if (E && Array.isArray(E)) {
        await a.log(
          `  DEBUG: Internal instance "${m}" -> backgrounds array length: ${E.length}`
        );
        for (let g = 0; g < E.length; g++) {
          const y = E[g];
          if (y && typeof y == "object") {
            if (await a.log(
              `  DEBUG:   backgrounds[${g}] structure: ${JSON.stringify(Object.keys(y))}`
            ), y.boundVariables) {
              const s = Object.keys(y.boundVariables);
              await a.log(
                `  DEBUG:   backgrounds[${g}].boundVariables keys: ${s.length > 0 ? s.join(", ") : "none"}`
              );
              for (const d of s) {
                const b = y.boundVariables[d];
                await a.log(
                  `  DEBUG:     backgrounds[${g}].boundVariables.${d}: ${JSON.stringify(b)}`
                );
              }
            }
            y.color && await a.log(
              `  DEBUG:   backgrounds[${g}].color: ${JSON.stringify(y.color)}`
            );
          }
        }
      }
      const O = Object.keys(e).filter(
        (g) => !g.startsWith("_") && g !== "parent" && g !== "removed" && typeof e[g] != "function" && g !== "type" && g !== "id" && g !== "name" && g !== "boundVariables" && g !== "backgrounds" && g !== "fills"
      ), V = Object.keys(r).filter(
        (g) => !g.startsWith("_") && g !== "parent" && g !== "removed" && typeof r[g] != "function" && g !== "type" && g !== "id" && g !== "name" && g !== "boundVariables" && g !== "backgrounds" && g !== "fills"
      ), R = [
        .../* @__PURE__ */ new Set([...O, ...V])
      ].filter(
        (g) => g.toLowerCase().includes("selection") || g.toLowerCase().includes("select") || g.toLowerCase().includes("color") && !g.toLowerCase().includes("fill") && !g.toLowerCase().includes("stroke")
      );
      if (R.length > 0) {
        await a.log(
          `  DEBUG: Found selection/color-related properties: ${R.join(", ")}`
        );
        for (const g of R)
          try {
            if (O.includes(g)) {
              const y = e[g];
              await a.log(
                `  DEBUG:   Instance.${g}: ${JSON.stringify(y)}`
              );
            }
            if (V.includes(g)) {
              const y = r[g];
              await a.log(
                `  DEBUG:   MainComponent.${g}: ${JSON.stringify(y)}`
              );
            }
          } catch (y) {
          }
      } else
        await a.log(
          "  DEBUG: No selection/color-related properties found on instance or main component"
        );
    } else if (A === "normal") {
      const M = P || w;
      if (M) {
        x.componentPageName = M.name;
        const E = Ye(M);
        E != null && E.id && E.version !== void 0 ? (x.componentGuid = E.id, x.componentVersion = E.version, await a.log(
          `  Found INSTANCE: "${m}" -> NORMAL component "${f}" (ID: ${r.id.substring(0, 8)}...) at path [${(C || []).join(" → ")}]`
        )) : await a.warning(
          `  Instance "${m}" -> component "${f}" is classified as normal but page "${M.name}" has no metadata. This instance will not be importable.`
        );
      } else {
        const E = r.id;
        let O = "", V = "";
        switch (c.reason) {
          case "broken_chain":
            O = "The component's parent chain is broken and cannot be traversed to find the page", V = "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            O = "Cannot access the component's parent chain (access error)", V = "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            O = "Cannot determine which page the component is on", V = "Please ensure the component is properly placed on a page.";
        }
        try {
          await figma.viewport.scrollAndZoomIntoView([r]);
        } catch (y) {
          console.warn("Could not scroll to component:", y);
        }
        const R = `Normal instance "${m}" -> component "${f}" (ID: ${E}) has no componentPage. ${O}. ${V} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", R), await a.error(R);
        const g = new Error(R);
        throw console.error("Throwing error:", g), g;
      }
      C === void 0 && console.warn(
        `Failed to build path for normal instance "${m}" -> component "${f}". Path is required for resolution.`
      );
      const S = C && C.length > 0 ? ` at path [${C.join(" → ")}]` : " at page root";
      await a.log(
        `  Found INSTANCE: "${m}" -> NORMAL component "${f}" (ID: ${r.id.substring(0, 8)}...)${S}`
      );
    } else if (A === "remote") {
      let M, S;
      const E = t.detachedComponentsHandled.has(
        r.id
      );
      if (!E)
        try {
          if (typeof r.getPublishStatusAsync == "function")
            try {
              const V = await r.getPublishStatusAsync();
              V && typeof V == "object" && (V.libraryName && (M = V.libraryName), V.libraryKey && (S = V.libraryKey));
            } catch (V) {
            }
          try {
            const V = figma.teamLibrary;
            if (typeof (V == null ? void 0 : V.getAvailableLibraryComponentSetsAsync) == "function") {
              const R = await V.getAvailableLibraryComponentSetsAsync();
              if (R && Array.isArray(R)) {
                for (const g of R)
                  if (g.key === r.key || g.name === r.name) {
                    g.libraryName && (M = g.libraryName), g.libraryKey && (S = g.libraryKey);
                    break;
                  }
              }
            }
          } catch (V) {
          }
        } catch (V) {
          console.warn(
            `Error getting library info for remote component "${f}":`,
            V
          );
        }
      if (M && (x.remoteLibraryName = M), S && (x.remoteLibraryKey = S), E && (x.componentNodeId = r.id), t.instanceTable.getInstanceIndex(x) !== -1)
        await a.log(
          `  Found INSTANCE: "${m}" -> REMOTE component "${f}" (ID: ${r.id.substring(0, 8)}...)${E ? " [DETACHED]" : ""}`
        );
      else
        try {
          const { parseBaseNodeProperties: V } = await Promise.resolve().then(() => Ut), R = await V(e, t), { parseFrameProperties: g } = await Promise.resolve().then(() => Ft), y = await g(e, t), s = Q(J(J({}, R), y), {
            type: "COMPONENT"
            // Convert to COMPONENT type for recreation (must be after baseProps to override)
          });
          if (e.children && Array.isArray(e.children) && e.children.length > 0) {
            const d = Q(J({}, t), {
              depth: (t.depth || 0) + 1
            }), { extractNodeData: b } = await Promise.resolve().then(() => ta), I = [];
            for (const N of e.children)
              try {
                let T;
                if (N.type === "INSTANCE")
                  try {
                    const G = await N.getMainComponentAsync();
                    if (G) {
                      const k = await V(
                        N,
                        t
                      ), B = await g(
                        N,
                        t
                      ), D = await b(
                        G,
                        /* @__PURE__ */ new WeakSet(),
                        d
                      );
                      T = Q(J(J(J({}, D), k), B), {
                        type: "COMPONENT"
                        // Convert to COMPONENT
                      });
                    } else
                      T = await b(
                        N,
                        /* @__PURE__ */ new WeakSet(),
                        d
                      ), T.type === "INSTANCE" && (T.type = "COMPONENT"), delete T._instanceRef;
                  } catch (G) {
                    T = await b(
                      N,
                      /* @__PURE__ */ new WeakSet(),
                      d
                    ), T.type === "INSTANCE" && (T.type = "COMPONENT"), delete T._instanceRef;
                  }
                else {
                  T = await b(
                    N,
                    /* @__PURE__ */ new WeakSet(),
                    d
                  );
                  const G = N.boundVariables;
                  if (G && typeof G == "object") {
                    const k = Object.keys(G);
                    k.length > 0 && (await a.log(
                      `  DEBUG: Child "${N.name || "Unnamed"}" -> boundVariables keys: ${k.join(", ")}`
                    ), G.backgrounds !== void 0 && await a.log(
                      `  DEBUG:   Child "${N.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(G.backgrounds)}`
                    ));
                  }
                  if (r.children && Array.isArray(r.children)) {
                    const k = r.children.find(
                      (B) => B.name === N.name
                    );
                    if (k) {
                      const B = k.boundVariables;
                      if (B && typeof B == "object") {
                        const D = Object.keys(B);
                        if (D.length > 0 && (await a.log(
                          `  DEBUG: Main component child "${k.name || "Unnamed"}" -> boundVariables keys: ${D.join(", ")}`
                        ), B.backgrounds !== void 0 && (await a.log(
                          `  DEBUG:   Main component child "${k.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(B.backgrounds)}`
                        ), !G || !G.backgrounds))) {
                          await a.log(
                            "  DEBUG:   Instance child doesn't have boundVariables.backgrounds, but main component child does - preserving from main component"
                          );
                          const { extractBoundVariables: K } = await Promise.resolve().then(() => $e), W = await K(
                            B,
                            t.variableTable,
                            t.collectionTable
                          );
                          T.boundVariables || (T.boundVariables = {}), W.backgrounds && (T.boundVariables.backgrounds = W.backgrounds, await a.log(
                            "  DEBUG:   ✓ Added boundVariables.backgrounds to childData from main component child"
                          ));
                        }
                      }
                    }
                  }
                }
                I.push(T);
              } catch (T) {
                console.warn(
                  `Failed to extract child "${N.name || "Unnamed"}" for remote component "${f}":`,
                  T
                );
              }
            s.children = I;
          }
          if (!s)
            throw new Error("Failed to build structure for remote instance");
          try {
            const d = e.boundVariables;
            if (d && typeof d == "object") {
              const _ = Object.keys(d);
              await a.log(
                `  DEBUG: Instance "${m}" -> boundVariables keys: ${_.length > 0 ? _.join(", ") : "none"}`
              );
              for (const j of _) {
                const H = d[j], $t = (H == null ? void 0 : H.type) || typeof H;
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
                d[j] !== void 0 && await a.log(
                  `  DEBUG:   Found potential "Selection colors" property: boundVariables.${j} = ${JSON.stringify(d[j])}`
                );
            } else
              await a.log(
                `  DEBUG: Instance "${m}" -> No boundVariables found on instance node`
              );
            const b = d && d.fills !== void 0 && d.fills !== null, I = s.fills !== void 0 && Array.isArray(s.fills) && s.fills.length > 0, N = e.fills !== void 0 && Array.isArray(e.fills) && e.fills.length > 0, T = r.fills !== void 0 && Array.isArray(r.fills) && r.fills.length > 0;
            if (await a.log(
              `  DEBUG: Instance "${m}" -> fills check: instanceHasFills=${N}, structureHasFills=${I}, mainComponentHasFills=${T}, hasInstanceFillsBoundVar=${!!b}`
            ), b && !I) {
              await a.log(
                "  DEBUG: Instance has boundVariables.fills but structure has no fills - attempting to get fills"
              );
              try {
                if (N) {
                  const { serializeFills: _ } = await Promise.resolve().then(() => $e), F = await _(
                    e.fills,
                    t.variableTable,
                    t.collectionTable
                  );
                  s.fills = F, await a.log(
                    `  DEBUG: Got ${F.length} fill(s) from instance node`
                  );
                } else if (T) {
                  const { serializeFills: _ } = await Promise.resolve().then(() => $e), F = await _(
                    r.fills,
                    t.variableTable,
                    t.collectionTable
                  );
                  s.fills = F, await a.log(
                    `  DEBUG: Got ${F.length} fill(s) from main component`
                  );
                } else
                  await a.warning(
                    "  DEBUG: Instance has boundVariables.fills but neither instance nor main component has fills"
                  );
              } catch (_) {
                await a.warning(
                  `  Failed to get fills: ${_}`
                );
              }
            }
            const G = e.selectionColor, k = r.selectionColor;
            G !== void 0 && await a.log(
              `  DEBUG: Instance "${m}" -> selectionColor: ${JSON.stringify(G)}`
            ), k !== void 0 && await a.log(
              `  DEBUG: Main component "${f}" -> selectionColor: ${JSON.stringify(k)}`
            );
            const B = Object.keys(e).filter(
              (_) => !_.startsWith("_") && _ !== "parent" && _ !== "removed" && typeof e[_] != "function" && _ !== "type" && _ !== "id" && _ !== "name"
            ), D = Object.keys(r).filter(
              (_) => !_.startsWith("_") && _ !== "parent" && _ !== "removed" && typeof r[_] != "function" && _ !== "type" && _ !== "id" && _ !== "name"
            ), K = [
              .../* @__PURE__ */ new Set([...B, ...D])
            ].filter(
              (_) => _.toLowerCase().includes("selection") || _.toLowerCase().includes("select") || _.toLowerCase().includes("color") && !_.toLowerCase().includes("fill") && !_.toLowerCase().includes("stroke")
            );
            if (K.length > 0) {
              await a.log(
                `  DEBUG: Found selection/color-related properties: ${K.join(", ")}`
              );
              for (const _ of K)
                try {
                  if (B.includes(_)) {
                    const F = e[_];
                    await a.log(
                      `  DEBUG:   Instance.${_}: ${JSON.stringify(F)}`
                    );
                  }
                  if (D.includes(_)) {
                    const F = r[_];
                    await a.log(
                      `  DEBUG:   MainComponent.${_}: ${JSON.stringify(F)}`
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
              const _ = Object.keys(W);
              if (_.length > 0) {
                await a.log(
                  `  DEBUG: Main component "${f}" -> boundVariables keys: ${_.join(", ")}`
                );
                for (const F of _) {
                  const j = W[F], H = (j == null ? void 0 : j.type) || typeof j;
                  await a.log(
                    `  DEBUG:   Main component boundVariables.${F}: type=${H}, value=${JSON.stringify(j)}`
                  );
                }
              }
            }
            if (d && Object.keys(d).length > 0) {
              await a.log(
                `  DEBUG: Preserving instance's boundVariables in structure (${Object.keys(d).length} key(s))`
              );
              const { extractBoundVariables: _ } = await Promise.resolve().then(() => $e), F = await _(
                d,
                t.variableTable,
                t.collectionTable
              );
              s.boundVariables || (s.boundVariables = {});
              for (const [j, H] of Object.entries(
                F
              ))
                H !== void 0 && (s.boundVariables[j] !== void 0 && await a.log(
                  `  DEBUG: Structure already has boundVariables.${j} from baseProps, but instance also has it - using instance's boundVariables.${j}`
                ), s.boundVariables[j] = H, await a.log(
                  `  DEBUG: Set boundVariables.${j} in structure: ${JSON.stringify(H)}`
                ));
              F.fills !== void 0 ? await a.log(
                "  DEBUG: ✓ Preserved boundVariables.fills from instance"
              ) : b && await a.warning(
                "  DEBUG: Instance has boundVariables.fills but extractBoundVariables didn't extract it"
              ), F.backgrounds !== void 0 ? await a.log(
                `  DEBUG: ✓ Preserved boundVariables.backgrounds from instance: ${JSON.stringify(F.backgrounds)}`
              ) : d && d.backgrounds !== void 0 && await a.warning(
                "  DEBUG: Instance has boundVariables.backgrounds but extractBoundVariables didn't extract it"
              );
            }
            if (W && Object.keys(W).length > 0) {
              await a.log(
                `  DEBUG: Checking main component's boundVariables for properties not in instance (${Object.keys(W).length} key(s))`
              );
              const { extractBoundVariables: _ } = await Promise.resolve().then(() => $e), F = await _(
                W,
                t.variableTable,
                t.collectionTable
              );
              s.boundVariables || (s.boundVariables = {});
              for (const [j, H] of Object.entries(
                F
              ))
                H !== void 0 && (s.boundVariables[j] === void 0 ? (s.boundVariables[j] = H, await a.log(
                  `  DEBUG: Added boundVariables.${j} from main component (not in instance): ${JSON.stringify(H)}`
                )) : await a.log(
                  `  DEBUG: Skipped boundVariables.${j} from main component (instance already has it)`
                ));
            }
            await a.log(
              `  DEBUG: Final structure for "${f}": hasFills=${!!s.fills}, fillsCount=${((o = s.fills) == null ? void 0 : o.length) || 0}, hasBoundVars=${!!s.boundVariables}, boundVarsKeys=${s.boundVariables ? Object.keys(s.boundVariables).join(", ") : "none"}`
            ), (l = s.boundVariables) != null && l.fills && await a.log(
              `  DEBUG: Structure boundVariables.fills: ${JSON.stringify(s.boundVariables.fills)}`
            );
          } catch (d) {
            await a.warning(
              `  Failed to handle bound variables for fills: ${d}`
            );
          }
          x.structure = s, E ? await a.log(
            `  Extracted structure for detached component "${f}" (ID: ${r.id.substring(0, 8)}...)`
          ) : await a.log(
            `  Extracted structure from instance for remote component "${f}" (preserving size overrides: ${e.width}x${e.height})`
          ), await a.log(
            `  Found INSTANCE: "${m}" -> REMOTE component "${f}" (ID: ${r.id.substring(0, 8)}...)${E ? " [DETACHED]" : ""}`
          );
        } catch (V) {
          const R = `Failed to extract structure for remote component "${f}": ${V instanceof Error ? V.message : String(V)}`;
          console.error(R, V), await a.error(R);
        }
    }
    const U = t.instanceTable.addInstance(x);
    n._instanceRef = U, i.add("_instanceRef");
  }
  return n;
}
class Ae {
  constructor() {
    ae(this, "instanceMap");
    // unique key -> index
    ae(this, "instances");
    // index -> instance data
    ae(this, "nextIndex");
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
      (o, l) => parseInt(o[0], 10) - parseInt(l[0], 10)
    );
    for (const [o, l] of i) {
      const r = parseInt(o, 10), m = n.generateKey(l);
      n.instanceMap.set(m, r), n.instances[r] = l, n.nextIndex = Math.max(n.nextIndex, r + 1);
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
    ae(this, "shortToLong");
    ae(this, "longToShort");
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
      for (const [o, l] of Object.entries(t)) {
        const r = this.getShortName(o);
        if (r !== o && !i.has(r)) {
          let m = this.compressObject(l);
          r === "type" && typeof m == "string" && (m = Xe(m)), n[r] = m;
        } else {
          let m = this.compressObject(l);
          o === "type" && typeof m == "string" && (m = Xe(m)), n[o] = m;
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
        const l = this.getLongName(i);
        let r = this.expandObject(o);
        (l === "type" || i === "type") && (typeof r == "number" || typeof r == "string") && (r = Zt(r)), n[l] = r;
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
  var w, A, P, p, v, C, L;
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
  const l = {
    visited: (P = n.visited) != null ? P : /* @__PURE__ */ new WeakSet(),
    depth: (p = n.depth) != null ? p : 0,
    maxDepth: (v = n.maxDepth) != null ? v : 100,
    nodeCount: o + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: n.variableTable,
    collectionTable: n.collectionTable,
    instanceTable: n.instanceTable,
    detachedComponentsHandled: (C = n.detachedComponentsHandled) != null ? C : /* @__PURE__ */ new Set(),
    exportedIds: (L = n.exportedIds) != null ? L : /* @__PURE__ */ new Map()
  };
  if (t.has(e))
    return "[Circular Reference]";
  t.add(e), l.visited = t;
  const r = {}, m = await it(e, l);
  if (Object.assign(r, m), r.id && l.exportedIds) {
    const x = l.exportedIds.get(r.id);
    if (x !== void 0) {
      const U = r.name || "Unnamed";
      if (x !== U) {
        const M = `Duplicate ID detected during export: ID "${r.id.substring(0, 8)}..." is used by both "${x}" and "${U}". Each node must have a unique ID.`;
        throw await a.error(M), new Error(M);
      }
      await a.warning(
        `Node "${U}" (ID: ${r.id.substring(0, 8)}...) was encountered multiple times during export. This may indicate a structural issue.`
      );
    } else
      l.exportedIds.set(r.id, r.name || "Unnamed");
  }
  const f = e.type;
  if (f)
    switch (f) {
      case "FRAME":
      case "COMPONENT": {
        const x = await Be(e);
        Object.assign(r, x);
        break;
      }
      case "INSTANCE": {
        const x = await Yt(
          e,
          l
        );
        Object.assign(r, x);
        const U = await Be(
          e
        );
        Object.assign(r, U);
        break;
      }
      case "TEXT": {
        const x = await zt(e);
        Object.assign(r, x);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const x = await Jt(e);
        Object.assign(r, x);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const x = await Wt(e);
        Object.assign(r, x);
        break;
      }
      default:
        l.unhandledKeys.add("_unknownType");
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
  for (const x of h)
    typeof e[x] != "function" && (u.has(x) || l.unhandledKeys.add(x));
  l.unhandledKeys.size > 0 && (r._unhandledKeys = Array.from(l.unhandledKeys).sort());
  const $ = r._instanceRef !== void 0 && l.instanceTable && f === "INSTANCE";
  let c = !1;
  if ($) {
    const x = l.instanceTable.getInstanceByIndex(
      r._instanceRef
    );
    x && x.instanceType === "normal" && (c = !0, await a.log(
      `  Skipping children extraction for normal instance "${r.name || "Unnamed"}" - will be resolved from referenced component`
    ));
  }
  if (!c && e.children && Array.isArray(e.children)) {
    const x = l.maxDepth;
    if (l.depth >= x)
      r.children = {
        _truncated: !0,
        _reason: `Maximum depth (${x}) reached`,
        _count: e.children.length
      };
    else if (l.nodeCount >= i)
      r.children = {
        _truncated: !0,
        _reason: `Maximum node count (${i}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const U = Q(J({}, l), {
        depth: l.depth + 1
      }), M = [];
      let S = !1;
      for (const E of e.children) {
        if (U.nodeCount >= i) {
          r.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: M.length,
            _total: e.children.length,
            children: M
          }, S = !0;
          break;
        }
        const O = await Re(E, t, U);
        M.push(O), U.nodeCount && (l.nodeCount = U.nodeCount);
      }
      S || (r.children = M);
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
    const l = o[i], r = l.id;
    if (t.has(r))
      return await a.log(
        `Page "${l.name}" has already been processed, skipping...`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Page already processed",
        data: {}
      };
    t.add(r), await a.log(
      `Selected page: "${l.name}" (index: ${i})`
    ), await a.log(
      "Initializing variable, collection, and instance tables..."
    );
    const m = new Ee(), f = new ve(), h = new Ae();
    await a.log("Extracting node data from page..."), await a.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await a.log(
      "Collections will be discovered as variables are processed:"
    );
    const u = await Re(
      l,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: m,
        collectionTable: f,
        instanceTable: h
      }
    );
    await a.log("Node extraction finished");
    const $ = xe(u), c = m.getSize(), w = f.getSize(), A = h.getSize();
    await a.log("Extraction complete:"), await a.log(`  - Total nodes: ${$}`), await a.log(`  - Unique variables: ${c}`), await a.log(`  - Unique collections: ${w}`), await a.log(`  - Unique instances: ${A}`);
    const P = h.getSerializedTable(), p = /* @__PURE__ */ new Map();
    for (const [d, b] of Object.entries(P))
      if (b.instanceType === "remote") {
        const I = parseInt(d, 10);
        p.set(I, b);
      }
    if (p.size > 0) {
      await a.error(
        `Found ${p.size} remote instance(s) - remote instances are not supported during publishing`
      );
      const d = (T, G, k = [], B = !1) => {
        const D = [];
        if (!T || typeof T != "object")
          return D;
        if (B || T.type === "PAGE") {
          const F = T.children || T.child;
          if (Array.isArray(F))
            for (const j of F)
              j && typeof j == "object" && D.push(
                ...d(
                  j,
                  G,
                  [],
                  !1
                )
              );
          return D;
        }
        const K = T.name || "";
        if (typeof T._instanceRef == "number" && T._instanceRef === G) {
          const F = K || "(unnamed)", j = k.length > 0 ? [...k, F] : [F];
          return D.push({
            path: j,
            nodeName: F
          }), D;
        }
        const W = K ? [...k, K] : k, _ = T.children || T.child;
        if (Array.isArray(_))
          for (const F of _)
            F && typeof F == "object" && D.push(
              ...d(
                F,
                G,
                W,
                !1
              )
            );
        return D;
      }, b = [];
      let I = 1;
      for (const [T, G] of p.entries()) {
        const k = G.componentName || "(unnamed)", B = G.componentSetName, D = d(
          u,
          T,
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
        const W = B ? `Component: "${k}" (from component set "${B}")` : `Component: "${k}"`, _ = G.remoteLibraryName ? `
   Library: ${G.remoteLibraryName}` : "";
        b.push(
          `${I}. ${W}${_}${K}`
        ), I++;
      }
      const N = `Cannot publish: Remote instances are not supported. Please remove all remote instances before publishing.

Found ${p.size} remote instance(s):
${b.join(`

`)}

To fix this:
1. Locate each remote instance component listed above using the path(s) shown
2. Replace it with a local component or remove it
3. Try publishing again`;
      throw await a.error(N), new Error(N);
    }
    if (w > 0) {
      await a.log("Collections found:");
      const d = f.getTable();
      for (const [b, I] of Object.values(d).entries()) {
        const N = I.collectionGuid ? ` (GUID: ${I.collectionGuid.substring(0, 8)}...)` : "";
        await a.log(
          `  ${b}: ${I.collectionName}${N} - ${I.modes.length} mode(s)`
        );
      }
    }
    await a.log("Checking for referenced component pages...");
    const v = [], C = Object.values(P).filter(
      (d) => d.instanceType === "normal"
    );
    if (C.length > 0) {
      await a.log(
        `Found ${C.length} normal instance(s) to check`
      );
      const d = /* @__PURE__ */ new Map();
      for (const b of C)
        if (b.componentPageName) {
          const I = o.find((N) => N.name === b.componentPageName);
          if (I && !t.has(I.id))
            d.has(I.id) || d.set(I.id, I);
          else if (!I) {
            const N = `Normal instance references component "${b.componentName || "(unnamed)"}" on page "${b.componentPageName}", but that page was not found. Cannot export.`;
            throw await a.error(N), new Error(N);
          }
        } else {
          const I = `Normal instance references component "${b.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw await a.error(I), new Error(I);
        }
      await a.log(
        `Found ${d.size} unique referenced page(s)`
      );
      for (const [b, I] of d.entries()) {
        const N = I.name;
        if (t.has(b)) {
          await a.log(`Skipping "${N}" - already processed`);
          continue;
        }
        const T = I.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let G = !1;
        if (T)
          try {
            const B = JSON.parse(T);
            G = !!(B.id && B.version !== void 0);
          } catch (B) {
          }
        const k = `Do you want to also publish referenced component "${N}"?`;
        try {
          await be.prompt(k, {
            okLabel: "Yes",
            cancelLabel: "No",
            timeoutMs: 3e5
            // 5 minutes
          }), await a.log(`Exporting referenced page: "${N}"`);
          const B = o.findIndex(
            (K) => K.id === I.id
          );
          if (B === -1)
            throw await a.error(
              `Could not find page index for "${N}"`
            ), new Error(`Could not find page index for "${N}"`);
          const D = await De(
            {
              pageIndex: B
            },
            t,
            // Pass the same set to track all processed pages
            !0
            // Mark as recursive call
          );
          if (D.success && D.data) {
            const K = D.data;
            v.push(K), await a.log(
              `Successfully exported referenced page: "${N}"`
            );
          } else
            throw new Error(
              `Failed to export referenced page "${N}": ${D.message}`
            );
        } catch (B) {
          if (B instanceof Error && B.message === "User cancelled")
            if (G)
              await a.log(
                `User declined to publish "${N}", but page has existing metadata. Continuing with existing metadata.`
              );
            else
              throw await a.error(
                `Export cancelled: Referenced page "${N}" has no metadata and user declined to publish it.`
              ), new Error(
                `Cannot continue export: Referenced component "${N}" has no metadata. Please publish it first or choose to publish it now.`
              );
          else
            throw B;
        }
      }
    }
    await a.log("Creating string table...");
    const L = new Ve();
    await a.log("Getting page metadata...");
    const x = l.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let U = "", M = 0;
    if (x)
      try {
        const d = JSON.parse(x);
        U = d.id || "", M = d.version || 0;
      } catch (d) {
        await a.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!U) {
      await a.log("Generating new GUID for page..."), U = await je();
      const d = {
        _ver: 1,
        id: U,
        name: l.name,
        version: M,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      l.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(d)
      );
    }
    await a.log("Creating export data structure...");
    const S = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "1.0.0",
        figmaApiVersion: figma.apiVersion,
        guid: U,
        version: M,
        name: l.name,
        pluginVersion: "1.0.0"
      },
      stringTable: L.getSerializedTable(),
      collections: f.getSerializedTable(),
      variables: m.getSerializedTable(),
      instances: h.getSerializedTable(),
      pageData: u
    };
    await a.log("Compressing JSON data...");
    const E = Qt(S, L);
    await a.log("Serializing to JSON...");
    const O = JSON.stringify(E, null, 2), V = (O.length / 1024).toFixed(2), g = Oe(l.name).trim().replace(/\s+/g, "_") + ".figma.json";
    await a.log(`JSON serialization complete: ${V} KB`), await a.log(`Export file: ${g}`), await a.log("=== Export Complete ===");
    const y = JSON.parse(O);
    return {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: g,
        pageData: y,
        pageName: l.name,
        additionalPages: v
        // Populated with referenced component pages
      }
    };
  } catch (i) {
    const o = i instanceof Error ? i.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", i), console.error("Error message:", o), await a.error(`Export failed: ${o}`), i instanceof Error && i.stack && (console.error("Stack trace:", i.stack), await a.error(`Stack trace: ${i.stack}`));
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
const ta = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  countTotalNodes: xe,
  exportPage: De,
  extractNodeData: Re
}, Symbol.toStringTag, { value: "Module" }));
function ne(e) {
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
    e.modes.find((l) => l.name === i) || e.addMode(i);
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
      const m = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((f) => f.name.trim().toLowerCase() === n);
      if (m) {
        aa(e.collectionName, !1);
        const f = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          m.key
        );
        if (f.length > 0) {
          const h = await figma.variables.importVariableByKeyAsync(f[0].key), u = await figma.variables.getVariableCollectionByIdAsync(
            h.variableCollectionId
          );
          if (u) {
            if (t = u, e.collectionGuid) {
              const $ = t.getSharedPluginData(
                "recursica",
                re
              );
              (!$ || $.trim() === "") && t.setSharedPluginData(
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
    let m;
    if (e.collectionGuid && (m = r.find((f) => f.getSharedPluginData("recursica", re) === e.collectionGuid)), m || (m = r.find(
      (f) => f.name === e.collectionName
    )), m)
      if (t = m, e.collectionGuid) {
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
    const r = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), m = e.collectionName.trim().toLowerCase(), f = r.find((c) => c.name.trim().toLowerCase() === m);
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
    ), $ = await figma.variables.getVariableCollectionByIdAsync(
      u.variableCollectionId
    );
    if (!$)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (t = $, e.collectionGuid) {
      const c = t.getSharedPluginData(
        "recursica",
        re
      );
      (!c || c.trim() === "") && t.setSharedPluginData(
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
  for (const [l, r] of Object.entries(t)) {
    const m = ct.get(`${i.id}:${l}`) || l;
    let f = i.modes.find((u) => u.name === m);
    if (f || (f = i.modes.find((u) => u.name === l)), !f) {
      await a.warning(
        `Mode "${l}" (mapped: "${m}") not found in collection "${i.name}" for variable "${e.name}". Available modes: ${i.modes.map((u) => u.name).join(", ")}. Skipping.`
      );
      continue;
    }
    const h = f.modeId;
    try {
      if (r == null) {
        await a.log(
          `  Mode "${l}": value is null/undefined, skipping`
        );
        continue;
      }
      if (await a.log(
        `  Mode "${l}": value type=${typeof r}, value=${JSON.stringify(r)}`
      ), typeof r == "string" || typeof r == "number" || typeof r == "boolean") {
        e.setValueForMode(h, r);
        continue;
      }
      if (typeof r == "object" && r !== null && "r" in r && "g" in r && "b" in r && typeof r.r == "number" && typeof r.g == "number" && typeof r.b == "number") {
        const u = r, $ = {
          r: u.r,
          g: u.g,
          b: u.b
        };
        u.a !== void 0 && ($.a = u.a), e.setValueForMode(h, $);
        const c = e.valuesByMode[h];
        if (await a.log(
          `  Set color value for "${e.name}" mode "${l}": r=${$.r.toFixed(3)}, g=${$.g.toFixed(3)}, b=${$.b.toFixed(3)}${$.a !== void 0 ? `, a=${$.a.toFixed(3)}` : ""}`
        ), await a.log(
          `  Read back value: ${JSON.stringify(c)}`
        ), typeof c == "object" && c !== null && "r" in c && "g" in c && "b" in c) {
          const w = c, A = Math.abs(w.r - $.r) < 1e-3, P = Math.abs(w.g - $.g) < 1e-3, p = Math.abs(w.b - $.b) < 1e-3;
          !A || !P || !p ? await a.warning(
            `  ⚠️ Value mismatch! Set: r=${$.r}, g=${$.g}, b=${$.b}, Read back: r=${w.r}, g=${w.g}, b=${w.b}`
          ) : await a.log(
            "  ✓ Value verified: read-back matches what we set"
          );
        } else
          await a.warning(
            `  ⚠️ Read-back value is not an RGB object: ${JSON.stringify(c)}`
          );
        continue;
      }
      if (typeof r == "object" && r !== null && "_varRef" in r && typeof r._varRef == "number") {
        const u = r;
        let $ = null;
        const c = n.getVariableByIndex(
          u._varRef
        );
        if (c) {
          let w = null;
          if (o && c._colRef !== void 0) {
            const A = o.getCollectionByIndex(
              c._colRef
            );
            A && (w = (await na(A)).collection);
          }
          w && ($ = await Je(
            w,
            c.variableName
          ));
        }
        if ($) {
          const w = {
            type: "VARIABLE_ALIAS",
            id: $.id
          };
          e.setValueForMode(h, w);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${l}" in variable "${e.name}". Variable reference index: ${u._varRef}`
          );
      }
    } catch (u) {
      typeof r == "object" && r !== null && !("_varRef" in r) && !("r" in r && "g" in r && "b" in r) && await a.warning(
        `Unhandled value type for mode "${l}" in variable "${e.name}": ${JSON.stringify(r)}`
      ), console.warn(
        `Error setting value for mode "${l}" in variable "${e.name}":`,
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
    for (const [l, r] of Object.entries(e.valuesByMode))
      await a.log(
        `  Mode "${l}": ${JSON.stringify(r)} (type: ${typeof r})`
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
    for (const [l, r] of Object.entries(
      e.valuesByMode
    )) {
      const m = t.modes.find((f) => f.name === l);
      if (m) {
        const f = o.valuesByMode[m.modeId];
        await a.log(
          `    Mode "${l}": expected=${JSON.stringify(r)}, actual=${JSON.stringify(f)}`
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
  const l = i.get(String(o._colRef));
  if (!l)
    return null;
  const r = await Je(
    l,
    o.variableName
  );
  if (r) {
    let m;
    if (typeof o.variableType == "number" ? m = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[o.variableType] || String(o.variableType) : m = o.variableType, lt(r, m))
      return r;
  }
  return await ze(
    o,
    l,
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
      const l = t[n];
      if (Array.isArray(l))
        for (let r = 0; r < l.length && r < o.length; r++) {
          const m = l[r];
          if (m && typeof m == "object") {
            if (o[r].boundVariables || (o[r].boundVariables = {}), pe(m)) {
              const f = m._varRef;
              if (f !== void 0) {
                const h = i.get(String(f));
                h && (o[r].boundVariables.color = {
                  type: "VARIABLE_ALIAS",
                  id: h.id
                });
              }
            } else
              for (const [f, h] of Object.entries(
                m
              ))
                if (pe(h)) {
                  const u = h._varRef;
                  if (u !== void 0) {
                    const $ = i.get(String(u));
                    $ && (o[r].boundVariables[f] = {
                      type: "VARIABLE_ALIAS",
                      id: $.id
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
    const o = Y;
    e.layoutMode === void 0 && (e.layoutMode = o.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = o.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = o.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = o.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = o.counterAxisAlignItems), n || (e.paddingLeft === void 0 && (e.paddingLeft = o.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = o.paddingRight), e.paddingTop === void 0 && (e.paddingTop = o.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = o.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = o.itemSpacing), e.counterAxisSpacing === void 0 && (e.counterAxisSpacing = o.counterAxisSpacing));
  }
  if (t === "TEXT") {
    const o = oe;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = o.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = o.textAlignVertical), e.textCase === void 0 && (e.textCase = o.textCase), e.textDecoration === void 0 && (e.textDecoration = o.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = o.textAutoResize);
  }
}
async function we(e, t, n = null, i = null, o = null, l = null, r = null, m = !1, f = null, h = null, u = null, $ = null) {
  var M, S, E, O, V, R;
  let c;
  switch (e.type) {
    case "FRAME":
      c = figma.createFrame();
      break;
    case "RECTANGLE":
      c = figma.createRectangle();
      break;
    case "ELLIPSE":
      c = figma.createEllipse();
      break;
    case "TEXT":
      c = figma.createText();
      break;
    case "VECTOR":
      c = figma.createVector();
      break;
    case "STAR":
      c = figma.createStar();
      break;
    case "LINE":
      c = figma.createLine();
      break;
    case "COMPONENT":
      if (e.id && r && r.has(e.id))
        c = r.get(e.id), await a.log(
          `Reusing existing COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id.substring(0, 8)}...)`
        );
      else if (c = figma.createComponent(), await a.log(
        `Created COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id ? e.id.substring(0, 8) + "..." : "no ID"})`
      ), e.componentPropertyDefinitions) {
        const g = e.componentPropertyDefinitions;
        let y = 0, s = 0;
        for (const [d, b] of Object.entries(g))
          try {
            const I = b.type;
            let N = null;
            if (typeof I == "string" ? (I === "TEXT" || I === "BOOLEAN" || I === "INSTANCE_SWAP" || I === "VARIANT") && (N = I) : typeof I == "number" && (N = {
              2: "TEXT",
              // Text property
              25: "BOOLEAN",
              // Boolean property
              27: "INSTANCE_SWAP",
              // Instance swap property
              26: "VARIANT"
              // Variant property
            }[I] || null), !N) {
              await a.warning(
                `  Unknown property type ${I} (${typeof I}) for property "${d}" in component "${e.name || "Unnamed"}"`
              ), s++;
              continue;
            }
            const T = b.defaultValue, G = d.split("#")[0];
            c.addComponentProperty(
              G,
              N,
              T
            ), y++;
          } catch (I) {
            await a.warning(
              `  Failed to add component property "${d}" to "${e.name || "Unnamed"}": ${I}`
            ), s++;
          }
        y > 0 && await a.log(
          `  Added ${y} component property definition(s) to "${e.name || "Unnamed"}"${s > 0 ? ` (${s} failed)` : ""}`
        );
      }
      break;
    case "COMPONENT_SET": {
      const g = e.children ? e.children.filter((d) => d.type === "COMPONENT").length : 0;
      await a.log(
        `Creating COMPONENT_SET "${e.name || "Unnamed"}" by combining ${g} component variant(s)`
      );
      const y = [];
      let s = null;
      if (e.children && Array.isArray(e.children)) {
        s = figma.createFrame(), s.name = `_temp_${e.name || "COMPONENT_SET"}`, s.visible = !1, ((t == null ? void 0 : t.type) === "PAGE" ? t : figma.currentPage).appendChild(s);
        for (const b of e.children)
          if (b.type === "COMPONENT" && !b._truncated)
            try {
              const I = await we(
                b,
                s,
                // Use temp parent for now
                n,
                i,
                o,
                l,
                r,
                m,
                f,
                h,
                // Pass deferredInstances through for component set creation
                null,
                // parentNodeData - not needed here, will be passed correctly in recursive calls
                $
              );
              I && I.type === "COMPONENT" && (y.push(I), await a.log(
                `  Created component variant: "${I.name || "Unnamed"}"`
              ));
            } catch (I) {
              await a.warning(
                `  Failed to create component variant "${b.name || "Unnamed"}": ${I}`
              );
            }
      }
      if (y.length > 0)
        try {
          const d = t || figma.currentPage, b = figma.combineAsVariants(
            y,
            d
          );
          e.name && (b.name = e.name), e.x !== void 0 && (b.x = e.x), e.y !== void 0 && (b.y = e.y), s && s.parent && s.remove(), await a.log(
            `  ✓ Successfully created COMPONENT_SET "${b.name}" with ${y.length} variant(s)`
          ), c = b;
        } catch (d) {
          if (await a.warning(
            `  Failed to combine components into COMPONENT_SET "${e.name || "Unnamed"}": ${d}. Falling back to frame.`
          ), c = figma.createFrame(), e.name && (c.name = e.name), s && s.children.length > 0) {
            for (const b of s.children)
              c.appendChild(b);
            s.remove();
          }
        }
      else
        await a.warning(
          `  No valid component variants found for COMPONENT_SET "${e.name || "Unnamed"}". Creating frame instead.`
        ), c = figma.createFrame(), e.name && (c.name = e.name), s && s.remove();
      break;
    }
    case "INSTANCE":
      if (m)
        c = figma.createFrame(), e.name && (c.name = e.name);
      else if (e._instanceRef !== void 0 && o && r) {
        const g = o.getInstanceByIndex(
          e._instanceRef
        );
        if (g && g.instanceType === "internal")
          if (g.componentNodeId)
            if (g.componentNodeId === e.id)
              await a.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), c = figma.createFrame(), e.name && (c.name = e.name);
            else {
              const y = r.get(
                g.componentNodeId
              );
              if (!y) {
                const s = Array.from(r.keys()).slice(
                  0,
                  20
                );
                await a.error(
                  `Component not found for internal instance "${e.name}" (ID: ${g.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), await a.error(
                  `Looking for component ID: ${g.componentNodeId}`
                ), await a.error(
                  `Available IDs in mapping (first 20): ${s.map((T) => T.substring(0, 8) + "...").join(", ")}`
                );
                const d = (T, G) => {
                  if (T.type === "COMPONENT" && T.id === G)
                    return !0;
                  if (T.children && Array.isArray(T.children)) {
                    for (const k of T.children)
                      if (!k._truncated && d(k, G))
                        return !0;
                  }
                  return !1;
                }, b = d(
                  e,
                  g.componentNodeId
                );
                await a.error(
                  `Component ID ${g.componentNodeId.substring(0, 8)}... exists in current node tree: ${b}`
                ), await a.error(
                  `WARNING: Component ID ${g.componentNodeId.substring(0, 8)}... not found in nodeIdMapping. This might indicate:`
                ), await a.error(
                  "  1. The component doesn't exist in the pageData (detached component?)"
                ), await a.error(
                  "  2. The component wasn't collected in the first pass"
                ), await a.error(
                  "  3. The component ID in the instance table doesn't match the actual component ID"
                );
                const I = s.filter(
                  (T) => T.startsWith(g.componentNodeId.substring(0, 8))
                );
                I.length > 0 && await a.error(
                  `Found IDs with matching prefix: ${I.map((T) => T.substring(0, 8) + "...").join(", ")}`
                );
                const N = `Component not found for internal instance "${e.name}" (ID: ${g.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${s.map((T) => T.substring(0, 8) + "...").join(", ")}`;
                throw new Error(N);
              }
              if (y && y.type === "COMPONENT") {
                if (c = y.createInstance(), await a.log(
                  `✓ Created internal instance "${e.name}" from component "${g.componentName}"`
                ), g.variantProperties && Object.keys(g.variantProperties).length > 0)
                  try {
                    let s = null;
                    if (y.parent && y.parent.type === "COMPONENT_SET")
                      s = y.parent.componentPropertyDefinitions, await a.log(
                        `  DEBUG: Component "${g.componentName}" is inside component set "${y.parent.name}" with ${Object.keys(s || {}).length} property definitions`
                      );
                    else {
                      const d = await c.getMainComponentAsync();
                      if (d) {
                        const b = d.type;
                        await a.log(
                          `  DEBUG: Internal instance "${e.name}" - componentNode parent: ${y.parent ? y.parent.type : "N/A"}, mainComponent type: ${b}, mainComponent parent: ${d.parent ? d.parent.type : "N/A"}`
                        ), b === "COMPONENT_SET" ? s = d.componentPropertyDefinitions : b === "COMPONENT" && d.parent && d.parent.type === "COMPONENT_SET" ? (s = d.parent.componentPropertyDefinitions, await a.log(
                          `  DEBUG: Found component set parent "${d.parent.name}" with ${Object.keys(s || {}).length} property definitions`
                        )) : await a.log(
                          `  Skipping variant properties for internal instance "${e.name}" - component "${g.componentName}" is not yet in a COMPONENT_SET (will be moved later during component set creation)`
                        );
                      }
                    }
                    if (s) {
                      const d = {};
                      for (const [b, I] of Object.entries(
                        g.variantProperties
                      )) {
                        const N = b.split("#")[0];
                        s[N] && (d[N] = I);
                      }
                      Object.keys(d).length > 0 && c.setProperties(d);
                    }
                  } catch (s) {
                    const d = `Failed to set variant properties for instance "${e.name}": ${s}`;
                    throw await a.error(d), new Error(d);
                  }
                if (g.componentProperties && Object.keys(g.componentProperties).length > 0)
                  try {
                    const s = await c.getMainComponentAsync();
                    if (s) {
                      let d = null;
                      const b = s.type;
                      if (b === "COMPONENT_SET" ? d = s.componentPropertyDefinitions : b === "COMPONENT" && s.parent && s.parent.type === "COMPONENT_SET" ? d = s.parent.componentPropertyDefinitions : b === "COMPONENT" && (d = s.componentPropertyDefinitions), d)
                        for (const [I, N] of Object.entries(
                          g.componentProperties
                        )) {
                          const T = I.split("#")[0];
                          if (d[T])
                            try {
                              let G = N;
                              N && typeof N == "object" && "value" in N && (G = N.value), c.setProperties({
                                [T]: G
                              });
                            } catch (G) {
                              const k = `Failed to set component property "${T}" for internal instance "${e.name}": ${G}`;
                              throw await a.error(k), new Error(k);
                            }
                        }
                    } else
                      await a.warning(
                        `Cannot set component properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (s) {
                    if (s instanceof Error)
                      throw s;
                    const d = `Failed to set component properties for instance "${e.name}": ${s}`;
                    throw await a.error(d), new Error(d);
                  }
              } else if (!c && y) {
                const s = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${g.componentNodeId.substring(0, 8)}...).`;
                throw await a.error(s), new Error(s);
              }
            }
          else {
            const y = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw await a.error(y), new Error(y);
          }
        else if (g && g.instanceType === "remote")
          if (f) {
            const y = f.get(
              e._instanceRef
            );
            if (y) {
              if (c = y.createInstance(), await a.log(
                `✓ Created remote instance "${e.name}" from component "${g.componentName}" on REMOTES page`
              ), g.variantProperties && Object.keys(g.variantProperties).length > 0)
                try {
                  const s = await c.getMainComponentAsync();
                  if (s) {
                    let d = null;
                    const b = s.type;
                    if (b === "COMPONENT_SET" ? d = s.componentPropertyDefinitions : b === "COMPONENT" && s.parent && s.parent.type === "COMPONENT_SET" ? d = s.parent.componentPropertyDefinitions : await a.log(
                      `Skipping variant properties for remote instance "${e.name}" - main component is not a COMPONENT_SET or variant (expected for remote components)`
                    ), d) {
                      const I = {};
                      for (const [N, T] of Object.entries(
                        g.variantProperties
                      )) {
                        const G = N.split("#")[0];
                        d[G] && (I[G] = T);
                      }
                      Object.keys(I).length > 0 && c.setProperties(I);
                    }
                  } else
                    await a.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (s) {
                  const d = `Failed to set variant properties for remote instance "${e.name}": ${s}`;
                  throw await a.error(d), new Error(d);
                }
              if (g.componentProperties && Object.keys(g.componentProperties).length > 0)
                try {
                  const s = await c.getMainComponentAsync();
                  if (s) {
                    let d = null;
                    const b = s.type;
                    if (b === "COMPONENT_SET" ? d = s.componentPropertyDefinitions : b === "COMPONENT" && s.parent && s.parent.type === "COMPONENT_SET" ? d = s.parent.componentPropertyDefinitions : b === "COMPONENT" && (d = s.componentPropertyDefinitions), d)
                      for (const [I, N] of Object.entries(
                        g.componentProperties
                      )) {
                        const T = I.split("#")[0];
                        if (d[T])
                          try {
                            let G = N;
                            N && typeof N == "object" && "value" in N && (G = N.value), c.setProperties({
                              [T]: G
                            });
                          } catch (G) {
                            const k = `Failed to set component property "${T}" for remote instance "${e.name}": ${G}`;
                            throw await a.error(k), new Error(k);
                          }
                      }
                  } else
                    await a.warning(
                      `Cannot set component properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (s) {
                  if (s instanceof Error)
                    throw s;
                  const d = `Failed to set component properties for remote instance "${e.name}": ${s}`;
                  throw await a.error(d), new Error(d);
                }
              if (e.width !== void 0 && e.height !== void 0)
                try {
                  c.resize(e.width, e.height);
                } catch (s) {
                  await a.log(
                    `Note: Could not resize remote instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
                  );
                }
            } else {
              const s = `Remote component not found for instance "${e.name}" (index ${e._instanceRef}). The remote component should have been created on the REMOTES page.`;
              throw await a.error(s), new Error(s);
            }
          } else {
            const y = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw await a.error(y), new Error(y);
          }
        else if ((g == null ? void 0 : g.instanceType) === "normal") {
          if (!g.componentPageName) {
            const N = `Normal instance "${e.name}" missing componentPageName. Cannot resolve.`;
            throw await a.error(N), new Error(N);
          }
          await figma.loadAllPagesAsync();
          const y = figma.root.children.find(
            (N) => N.name === g.componentPageName
          );
          if (!y) {
            await a.log(
              `  Deferring normal instance "${e.name}" - referenced page "${g.componentPageName}" does not exist yet (may be circular reference or not yet imported)`
            );
            const N = figma.createFrame();
            if (N.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (N.x = e.x), e.y !== void 0 && (N.y = e.y), e.width !== void 0 && e.height !== void 0 ? N.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && N.resize(e.w, e.h), h) {
              const T = {
                placeholderFrameId: N.id,
                instanceEntry: g,
                nodeData: e,
                parentNodeId: t.id,
                instanceIndex: e._instanceRef
              };
              h.push(T), await a.log(
                `  [DEBUG] Added deferred instance "${e.name}" to array (array length: ${h.length})`
              );
            } else
              await a.log(
                `  [DEBUG] deferredInstances array is null/undefined - cannot store deferred instance "${e.name}"`
              );
            c = N;
            break;
          }
          let s = null;
          const d = (N, T, G, k, B) => {
            if (T.length === 0) {
              let W = null;
              for (const _ of N.children || [])
                if (_.type === "COMPONENT") {
                  if (_.name === G)
                    if (W || (W = _), k)
                      try {
                        const F = _.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (F && JSON.parse(F).id === k)
                          return _;
                      } catch (F) {
                      }
                    else
                      return _;
                } else if (_.type === "COMPONENT_SET") {
                  if (B && _.name !== B)
                    continue;
                  for (const F of _.children || [])
                    if (F.type === "COMPONENT" && F.name === G)
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
            const [D, ...K] = T;
            for (const W of N.children || [])
              if (W.name === D) {
                if (K.length === 0 && W.type === "COMPONENT_SET") {
                  if (B && W.name !== B)
                    continue;
                  for (const _ of W.children || [])
                    if (_.type === "COMPONENT" && _.name === G) {
                      if (k)
                        try {
                          const F = _.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (F && JSON.parse(F).id === k)
                            return _;
                        } catch (F) {
                        }
                      return _;
                    }
                  return null;
                }
                return d(
                  W,
                  K,
                  G,
                  k,
                  B
                );
              }
            return null;
          };
          await a.log(
            `  Looking for component "${g.componentName}" on page "${g.componentPageName}"${g.path && g.path.length > 0 ? ` at path [${g.path.join(" → ")}]` : " at page root"}${g.componentGuid ? ` (GUID: ${g.componentGuid.substring(0, 8)}...)` : ""}`
          );
          const b = [], I = (N, T = 0) => {
            const G = "  ".repeat(T);
            if (N.type === "COMPONENT")
              b.push(`${G}COMPONENT: "${N.name}"`);
            else if (N.type === "COMPONENT_SET") {
              b.push(
                `${G}COMPONENT_SET: "${N.name}"`
              );
              for (const k of N.children || [])
                k.type === "COMPONENT" && b.push(
                  `${G}  └─ COMPONENT: "${k.name}"`
                );
            }
            for (const k of N.children || [])
              I(k, T + 1);
          };
          if (I(y), b.length > 0 ? await a.log(
            `  Available components on page "${g.componentPageName}":
${b.slice(0, 20).join(`
`)}${b.length > 20 ? `
  ... and ${b.length - 20} more` : ""}`
          ) : await a.warning(
            `  No components found on page "${g.componentPageName}"`
          ), s = d(
            y,
            g.path || [],
            g.componentName,
            g.componentGuid,
            g.componentSetName
          ), s && g.componentGuid)
            try {
              const N = s.getPluginData(
                "RecursicaPublishedMetadata"
              );
              if (N) {
                const T = JSON.parse(N);
                T.id !== g.componentGuid ? await a.warning(
                  `  Found component "${g.componentName}" by name but GUID verification failed (expected ${g.componentGuid.substring(0, 8)}..., got ${T.id ? T.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`
                ) : await a.log(
                  `  Found component "${g.componentName}" with matching GUID ${g.componentGuid.substring(0, 8)}...`
                );
              } else
                await a.warning(
                  `  Found component "${g.componentName}" by name but no metadata found. Using name match as fallback.`
                );
            } catch (N) {
              await a.warning(
                `  Found component "${g.componentName}" by name but GUID verification failed. Using name match as fallback.`
              );
            }
          if (!s) {
            await a.log(
              `  Deferring normal instance "${e.name}" - component "${g.componentName}" not found on page "${g.componentPageName}" (may not be created yet due to circular reference)`
            );
            const N = figma.createFrame();
            if (N.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (N.x = e.x), e.y !== void 0 && (N.y = e.y), e.width !== void 0 && e.height !== void 0 ? N.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && N.resize(e.w, e.h), h) {
              const T = {
                placeholderFrameId: N.id,
                instanceEntry: g,
                nodeData: e,
                parentNodeId: t.id,
                instanceIndex: e._instanceRef
              };
              h.push(T), await a.log(
                `  [DEBUG] Added deferred instance "${e.name}" to array (array length: ${h.length})`
              );
            } else
              await a.log(
                `  [DEBUG] deferredInstances array is null/undefined - cannot store deferred instance "${e.name}"`
              );
            c = N;
            break;
          }
          if (c = s.createInstance(), await a.log(
            `  Created normal instance "${e.name}" from component "${g.componentName}" on page "${g.componentPageName}"`
          ), g.variantProperties && Object.keys(g.variantProperties).length > 0)
            try {
              const N = await c.getMainComponentAsync();
              if (N) {
                let T = null;
                const G = N.type;
                if (G === "COMPONENT_SET" ? T = N.componentPropertyDefinitions : G === "COMPONENT" && N.parent && N.parent.type === "COMPONENT_SET" ? T = N.parent.componentPropertyDefinitions : await a.warning(
                  `Cannot set variant properties for normal instance "${e.name}" - main component is not a COMPONENT_SET or variant`
                ), T) {
                  const k = {};
                  for (const [B, D] of Object.entries(
                    g.variantProperties
                  )) {
                    const K = B.split("#")[0];
                    T[K] && (k[K] = D);
                  }
                  Object.keys(k).length > 0 && c.setProperties(k);
                }
              }
            } catch (N) {
              await a.warning(
                `Failed to set variant properties for normal instance "${e.name}": ${N}`
              );
            }
          if (g.componentProperties && Object.keys(g.componentProperties).length > 0)
            try {
              const N = await c.getMainComponentAsync();
              if (N) {
                let T = null;
                const G = N.type;
                if (G === "COMPONENT_SET" ? T = N.componentPropertyDefinitions : G === "COMPONENT" && N.parent && N.parent.type === "COMPONENT_SET" ? T = N.parent.componentPropertyDefinitions : G === "COMPONENT" && (T = N.componentPropertyDefinitions), T) {
                  const k = {};
                  for (const [B, D] of Object.entries(
                    g.componentProperties
                  )) {
                    const K = B.split("#")[0];
                    let W;
                    if (T[B] ? W = B : T[K] ? W = K : W = Object.keys(T).find(
                      (_) => _.split("#")[0] === K
                    ), W) {
                      const _ = D && typeof D == "object" && "value" in D ? D.value : D;
                      k[W] = _;
                    } else
                      await a.warning(
                        `Component property "${K}" (from "${B}") does not exist on component "${g.componentName}" for normal instance "${e.name}". Available properties: ${Object.keys(T).join(", ") || "none"}`
                      );
                  }
                  if (Object.keys(k).length > 0)
                    try {
                      await a.log(
                        `  Attempting to set component properties for normal instance "${e.name}": ${Object.keys(k).join(", ")}`
                      ), await a.log(
                        `  Available component properties: ${Object.keys(T).join(", ")}`
                      ), c.setProperties(k), await a.log(
                        `  ✓ Successfully set component properties for normal instance "${e.name}": ${Object.keys(k).join(", ")}`
                      );
                    } catch (B) {
                      await a.warning(
                        `Failed to set component properties for normal instance "${e.name}": ${B}`
                      ), await a.warning(
                        `  Properties attempted: ${JSON.stringify(k)}`
                      ), await a.warning(
                        `  Available properties: ${JSON.stringify(Object.keys(T))}`
                      );
                    }
                }
              } else
                await a.warning(
                  `Cannot set component properties for normal instance "${e.name}" - main component not found`
                );
            } catch (N) {
              await a.warning(
                `Failed to set component properties for normal instance "${e.name}": ${N}`
              );
            }
          if (e.width !== void 0 && e.height !== void 0)
            try {
              c.resize(e.width, e.height);
            } catch (N) {
              await a.log(
                `Note: Could not resize normal instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
              );
            }
        } else {
          const y = `Instance "${e.name}" has unknown or missing instance type: ${(g == null ? void 0 : g.instanceType) || "unknown"}`;
          throw await a.error(y), new Error(y);
        }
      } else {
        const g = `Instance "${e.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        throw await a.error(g), new Error(g);
      }
      break;
    case "GROUP":
      c = figma.createFrame();
      break;
    case "BOOLEAN_OPERATION": {
      const g = `Boolean operation nodes cannot be imported. Found boolean operation: "${e.name}".`;
      throw await a.error(g), new Error(g);
    }
    case "POLYGON":
      c = figma.createPolygon();
      break;
    default: {
      const g = `Unsupported node type: ${e.type}. This node type cannot be imported.`;
      throw await a.error(g), new Error(g);
    }
  }
  if (!c)
    return null;
  e.id && r && (r.set(e.id, c), c.type === "COMPONENT" && await a.log(
    `  Stored COMPONENT "${e.name || "Unnamed"}" in nodeIdMapping (ID: ${e.id.substring(0, 8)}...)`
  )), e._instanceRef !== void 0 && c.type === "INSTANCE" ? (r._instanceTableMap || (r._instanceTableMap = /* @__PURE__ */ new Map()), r._instanceTableMap.set(
    c.id,
    e._instanceRef
  ), await a.log(
    `  Stored instance table mapping: instance "${c.name}" (ID: ${c.id.substring(0, 8)}...) -> instance table index ${e._instanceRef}`
  )) : c.type === "INSTANCE" && await a.log(
    `  WARNING: Instance "${c.name}" (ID: ${c.id.substring(0, 8)}...) has no _instanceRef in nodeData - will use fallback matching in third pass`
  );
  const w = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.paddingLeft || e.boundVariables.paddingRight || e.boundVariables.paddingTop || e.boundVariables.paddingBottom || e.boundVariables.itemSpacing);
  sa(
    c,
    e.type || "FRAME",
    w
  ), e.name !== void 0 && (c.name = e.name || "Unnamed Node");
  const A = u && u.layoutMode !== void 0 && u.layoutMode !== "NONE", P = t && "layoutMode" in t && t.layoutMode !== "NONE";
  A || P || (e.x !== void 0 && (c.x = e.x), e.y !== void 0 && (c.y = e.y));
  const v = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
  e.type !== "VECTOR" && e.width !== void 0 && e.height !== void 0 && !v && c.resize(e.width, e.height);
  const C = e.boundVariables && typeof e.boundVariables == "object";
  if (e.visible !== void 0 && (c.visible = e.visible), e.locked !== void 0 && (c.locked = e.locked), e.opacity !== void 0 && (!C || !e.boundVariables.opacity) && (c.opacity = e.opacity), e.rotation !== void 0 && (!C || !e.boundVariables.rotation) && (c.rotation = e.rotation), e.blendMode !== void 0 && (!C || !e.boundVariables.blendMode) && (c.blendMode = e.blendMode), e.type !== "INSTANCE") {
    if (e.type === "VECTOR" && e.boundVariables && (await a.log(
      `  DEBUG: VECTOR "${e.name || "Unnamed"}" (ID: ${((M = e.id) == null ? void 0 : M.substring(0, 8)) || "unknown"}...) has boundVariables: ${Object.keys(e.boundVariables).join(", ")}`
    ), e.boundVariables.fills && await a.log(
      `  DEBUG:   boundVariables.fills: ${JSON.stringify(e.boundVariables.fills)}`
    )), e.fills !== void 0)
      try {
        let g = e.fills;
        if (Array.isArray(g) && (g = g.map((y) => {
          if (y && typeof y == "object") {
            const s = J({}, y);
            return delete s.boundVariables, s;
          }
          return y;
        })), e.fills && Array.isArray(e.fills) && l) {
          if (e.type === "VECTOR") {
            await a.log(
              `  DEBUG: VECTOR "${e.name || "Unnamed"}" has ${e.fills.length} fill(s)`
            );
            for (let s = 0; s < e.fills.length; s++) {
              const d = e.fills[s];
              if (d && typeof d == "object") {
                const b = d.boundVariables || d.bndVar;
                b ? await a.log(
                  `  DEBUG:   fill[${s}] has boundVariables: ${JSON.stringify(b)}`
                ) : await a.log(
                  `  DEBUG:   fill[${s}] has no boundVariables`
                );
              }
            }
          }
          const y = [];
          for (let s = 0; s < g.length; s++) {
            const d = g[s], b = e.fills[s];
            if (!b || typeof b != "object") {
              y.push(d);
              continue;
            }
            const I = b.boundVariables || b.bndVar;
            if (!I) {
              y.push(d);
              continue;
            }
            const N = J({}, d);
            N.boundVariables = {};
            for (const [T, G] of Object.entries(I))
              if (e.type === "VECTOR" && await a.log(
                `  DEBUG: Processing fill[${s}].${T} on VECTOR "${c.name || "Unnamed"}": varInfo=${JSON.stringify(G)}`
              ), pe(G)) {
                const k = G._varRef;
                if (k !== void 0) {
                  if (e.type === "VECTOR") {
                    await a.log(
                      `  DEBUG: Looking up variable reference ${k} in recognizedVariables (map has ${l.size} entries)`
                    );
                    const D = Array.from(
                      l.keys()
                    ).slice(0, 10);
                    await a.log(
                      `  DEBUG: Available variable references (first 10): ${D.join(", ")}`
                    );
                    const K = l.has(String(k));
                    if (await a.log(
                      `  DEBUG: Variable reference ${k} ${K ? "found" : "NOT FOUND"} in recognizedVariables`
                    ), !K) {
                      const W = Array.from(
                        l.keys()
                      ).sort((_, F) => parseInt(_) - parseInt(F));
                      await a.log(
                        `  DEBUG: All available variable references: ${W.join(", ")}`
                      );
                    }
                  }
                  let B = l.get(String(k));
                  B || (e.type === "VECTOR" && await a.log(
                    `  DEBUG: Variable ${k} not in recognizedVariables. variableTable=${!!n}, collectionTable=${!!i}, recognizedCollections=${!!$}`
                  ), n && i && $ ? (await a.log(
                    `  Variable reference ${k} not in recognizedVariables, attempting to resolve from variable table...`
                  ), B = await oa(
                    k,
                    n,
                    i,
                    $
                  ) || void 0, B ? (l.set(String(k), B), await a.log(
                    `  ✓ Resolved variable ${B.name} from variable table and added to recognizedVariables`
                  )) : await a.warning(
                    `  Failed to resolve variable ${k} from variable table`
                  )) : e.type === "VECTOR" && await a.warning(
                    `  Cannot resolve variable ${k} from table - missing required parameters`
                  )), B ? (N.boundVariables[T] = {
                    type: "VARIABLE_ALIAS",
                    id: B.id
                  }, await a.log(
                    `  ✓ Restored bound variable for fill[${s}].${T} on "${c.name || "Unnamed"}" (${e.type}): variable ${B.name} (ID: ${B.id.substring(0, 8)}...)`
                  )) : await a.warning(
                    `  Variable reference ${k} not found in recognizedVariables for fill[${s}].${T} on "${c.name || "Unnamed"}"`
                  );
                } else
                  e.type === "VECTOR" && await a.warning(
                    `  DEBUG: Variable reference ${k} is undefined for fill[${s}].${T} on VECTOR "${c.name || "Unnamed"}"`
                  );
              } else
                e.type === "VECTOR" && await a.warning(
                  `  DEBUG: fill[${s}].${T} on VECTOR "${c.name || "Unnamed"}" is not a variable reference: ${JSON.stringify(G)}`
                );
            y.push(N);
          }
          c.fills = y, await a.log(
            `  ✓ Set fills with boundVariables on "${c.name || "Unnamed"}" (${e.type})`
          );
        } else
          c.fills = g;
        e.boundVariables && Object.keys(e.boundVariables).length > 0 && !e.boundVariables.fills && await a.log(
          `  Node "${c.name || "Unnamed"}" (${e.type}) has boundVariables but not for fills: ${Object.keys(e.boundVariables).join(", ")}`
        );
      } catch (g) {
        console.log("Error setting fills:", g);
      }
    else if (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "GROUP")
      try {
        c.fills = [];
      } catch (g) {
        console.log("Error clearing fills:", g);
      }
  }
  if (e.strokes !== void 0)
    try {
      e.strokes.length > 0 ? c.strokes = e.strokes : c.strokes = [];
    } catch (g) {
      console.log("Error setting strokes:", g);
    }
  else if (e.type === "VECTOR")
    try {
      c.strokes = [];
    } catch (g) {
    }
  const L = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.strokeWeight || e.boundVariables.strokeAlign);
  e.strokeWeight !== void 0 ? (!L || !e.boundVariables.strokeWeight) && (c.strokeWeight = e.strokeWeight) : e.type === "VECTOR" && (e.strokes === void 0 || e.strokes.length === 0) && (!L || !e.boundVariables.strokeWeight) && (c.strokeWeight = 0), e.strokeAlign !== void 0 && (!L || !e.boundVariables.strokeAlign) && (c.strokeAlign = e.strokeAlign);
  const x = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.cornerRadius || e.boundVariables.topLeftRadius || e.boundVariables.topRightRadius || e.boundVariables.bottomLeftRadius || e.boundVariables.bottomRightRadius);
  if (e.cornerRadius !== void 0 && (!x || !e.boundVariables.cornerRadius) && (c.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (c.effects = e.effects), e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") {
    if (e.layoutMode !== void 0 && (["NONE", "HORIZONTAL", "VERTICAL"].includes(e.layoutMode) ? c.layoutMode = e.layoutMode : await a.warning(
      `Invalid layoutMode value "${e.layoutMode}" for node "${e.name || "Unnamed"}", skipping layoutMode setting`
    )), e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.boundVariables && l) {
      const y = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ];
      for (const s of y) {
        const d = e.boundVariables[s];
        if (d && pe(d)) {
          const b = d._varRef;
          if (b !== void 0) {
            const I = l.get(String(b));
            if (I) {
              const N = {
                type: "VARIABLE_ALIAS",
                id: I.id
              };
              c.boundVariables || (c.boundVariables = {});
              const T = c[s], G = (S = c.boundVariables) == null ? void 0 : S[s];
              await a.log(
                `  DEBUG: Attempting to set bound variable for ${s} on "${e.name || "Unnamed"}": current value=${T}, current boundVar=${JSON.stringify(G)}`
              );
              try {
                delete c.boundVariables[s];
              } catch (B) {
              }
              try {
                c.boundVariables[s] = N;
                const B = (E = c.boundVariables) == null ? void 0 : E[s];
                await a.log(
                  `  DEBUG: Immediately after setting ${s} bound variable: ${JSON.stringify(B)}`
                );
              } catch (B) {
                await a.warning(
                  `  Error setting bound variable for ${s}: ${B}`
                );
              }
              const k = (O = c.boundVariables) == null ? void 0 : O[s];
              k && typeof k == "object" && k.type === "VARIABLE_ALIAS" && k.id === I.id ? await a.log(
                `  ✓ Set bound variable for ${s} on "${e.name || "Unnamed"}" (${e.type}): variable ${I.name} (ID: ${I.id.substring(0, 8)}...)`
              ) : await a.warning(
                `  Failed to set bound variable for ${s} on "${e.name || "Unnamed"}" - verification failed. Expected: ${JSON.stringify(N)}, Got: ${JSON.stringify(k)}`
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
    ), c.itemSpacing = e.itemSpacing, await a.log(
      `  ✓ Set itemSpacing to ${c.itemSpacing} (verified)`
    )) : (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && await a.log(
      `  DEBUG: Not setting itemSpacing for "${e.name || "Unnamed"}": layoutMode=${e.layoutMode}, itemSpacing=${e.itemSpacing}`
    ), e.layoutWrap !== void 0 && (c.layoutWrap = e.layoutWrap), e.primaryAxisSizingMode !== void 0 ? c.primaryAxisSizingMode = e.primaryAxisSizingMode : c.primaryAxisSizingMode = "AUTO", e.counterAxisSizingMode !== void 0 ? c.counterAxisSizingMode = e.counterAxisSizingMode : c.counterAxisSizingMode = "AUTO", e.primaryAxisAlignItems !== void 0 && (c.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (c.counterAxisAlignItems = e.counterAxisAlignItems);
    const g = e.boundVariables && typeof e.boundVariables == "object";
    if (g) {
      const y = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ].filter((s) => e.boundVariables[s]);
      y.length > 0 && await a.log(
        `  DEBUG: Node "${e.name || "Unnamed"}" (${e.type}) has bound variables for: ${y.join(", ")}`
      );
    }
    e.paddingLeft !== void 0 && (!g || !e.boundVariables.paddingLeft) && (c.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (!g || !e.boundVariables.paddingRight) && (c.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (!g || !e.boundVariables.paddingTop) && (c.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (!g || !e.boundVariables.paddingBottom) && (c.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (!g || !e.boundVariables.itemSpacing) && c.layoutMode !== void 0 && c.layoutMode !== "NONE" && c.itemSpacing !== e.itemSpacing && (await a.log(
      `  Setting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (late setting)`
    ), c.itemSpacing = e.itemSpacing), e.counterAxisSpacing !== void 0 && (!g || !e.boundVariables.counterAxisSpacing) && c.layoutMode !== void 0 && c.layoutMode !== "NONE" && (c.counterAxisSpacing = e.counterAxisSpacing), e.layoutGrow !== void 0 && (c.layoutGrow = e.layoutGrow);
  }
  if ((e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (c.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (c.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (c.dashPattern = e.dashPattern), e.type === "VECTOR")) {
    if (e.fillGeometry !== void 0)
      try {
        const { normalizeSvgPath: y } = await Promise.resolve().then(() => Dt), s = e.fillGeometry.map((d) => {
          const b = d.data;
          return {
            data: y(b),
            windingRule: d.windingRule || d.windRule || "NONZERO"
          };
        });
        for (let d = 0; d < e.fillGeometry.length; d++) {
          const b = e.fillGeometry[d].data, I = s[d].data;
          b !== I && await a.log(
            `  Normalized path ${d + 1} for "${e.name || "Unnamed"}": ${b.substring(0, 50)}... -> ${I.substring(0, 50)}...`
          );
        }
        c.vectorPaths = s, await a.log(
          `  Set vectorPaths for VECTOR "${e.name || "Unnamed"}" (${s.length} path(s))`
        );
      } catch (y) {
        await a.warning(
          `Error setting vectorPaths for VECTOR "${e.name || "Unnamed"}": ${y}`
        );
      }
    if (e.strokeGeometry !== void 0)
      try {
        c.strokeGeometry = e.strokeGeometry;
      } catch (y) {
        await a.warning(
          `Error setting strokeGeometry for VECTOR "${e.name || "Unnamed"}": ${y}`
        );
      }
    const g = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
    if (e.width !== void 0 && e.height !== void 0 && !g)
      try {
        c.resize(e.width, e.height), await a.log(
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
          await figma.loadFontAsync(e.fontName), c.fontName = e.fontName;
        } catch (y) {
          await figma.loadFontAsync({
            family: "Roboto",
            style: "Regular"
          }), c.fontName = { family: "Roboto", style: "Regular" };
        }
      else
        await figma.loadFontAsync({
          family: "Roboto",
          style: "Regular"
        }), c.fontName = { family: "Roboto", style: "Regular" };
      c.characters = e.characters;
      const g = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.fontSize || e.boundVariables.letterSpacing || e.boundVariables.lineHeight);
      e.fontSize !== void 0 && (!g || !e.boundVariables.fontSize) && (c.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (c.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (c.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (!g || !e.boundVariables.letterSpacing) && (c.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (!g || !e.boundVariables.lineHeight) && (c.lineHeight = e.lineHeight), e.textCase !== void 0 && (c.textCase = e.textCase), e.textDecoration !== void 0 && (c.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (c.textAutoResize = e.textAutoResize);
    } catch (g) {
      console.log("Error setting text properties: " + g);
      try {
        c.characters = e.characters;
      } catch (y) {
        console.log("Could not set text characters: " + y);
      }
    }
  if (e.boundVariables && l) {
    const g = [
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "paddingBottom",
      "itemSpacing"
    ];
    for (const [y, s] of Object.entries(
      e.boundVariables
    ))
      if (y !== "fills" && !g.includes(y) && pe(s) && n && l) {
        const d = s._varRef;
        if (d !== void 0) {
          const b = l.get(String(d));
          if (b)
            try {
              const I = {
                type: "VARIABLE_ALIAS",
                id: b.id
              };
              c.boundVariables || (c.boundVariables = {});
              const N = c[y];
              N !== void 0 && c.boundVariables[y] === void 0 && await a.warning(
                `  Property ${y} has direct value ${N} which may prevent bound variable from being set`
              ), c.boundVariables[y] = I;
              const G = (V = c.boundVariables) == null ? void 0 : V[y];
              if (G && typeof G == "object" && G.type === "VARIABLE_ALIAS" && G.id === b.id)
                await a.log(
                  `  ✓ Set bound variable for ${y} on "${e.name || "Unnamed"}" (${e.type}): variable ${b.name} (ID: ${b.id.substring(0, 8)}...)`
                );
              else {
                const k = (R = c.boundVariables) == null ? void 0 : R[y];
                await a.warning(
                  `  Failed to set bound variable for ${y} on "${e.name || "Unnamed"}" - bound variable not persisted. Property value: ${N}, Expected: ${JSON.stringify(I)}, Got: ${JSON.stringify(k)}`
                );
              }
            } catch (I) {
              await a.warning(
                `  Error setting bound variable for ${y} on "${e.name || "Unnamed"}": ${I}`
              );
            }
          else
            await a.warning(
              `  Variable reference ${d} not found in recognizedVariables for ${y} on "${e.name || "Unnamed"}"`
            );
        }
      }
  }
  if (e.boundVariables && l && (e.boundVariables.width || e.boundVariables.height)) {
    const g = e.boundVariables.width, y = e.boundVariables.height;
    if (g && pe(g)) {
      const s = g._varRef;
      if (s !== void 0) {
        const d = l.get(String(s));
        if (d) {
          const b = {
            type: "VARIABLE_ALIAS",
            id: d.id
          };
          c.boundVariables || (c.boundVariables = {}), c.boundVariables.width = b;
        }
      }
    }
    if (y && pe(y)) {
      const s = y._varRef;
      if (s !== void 0) {
        const d = l.get(String(s));
        if (d) {
          const b = {
            type: "VARIABLE_ALIAS",
            id: d.id
          };
          c.boundVariables || (c.boundVariables = {}), c.boundVariables.height = b;
        }
      }
    }
  }
  const U = e.id && r && r.has(e.id) && c.type === "COMPONENT" && c.children && c.children.length > 0;
  if (e.children && Array.isArray(e.children) && c.type !== "INSTANCE" && !U) {
    const g = (s) => {
      const d = [];
      for (const b of s)
        b._truncated || (b.type === "COMPONENT" ? (d.push(b), b.children && Array.isArray(b.children) && d.push(...g(b.children))) : b.children && Array.isArray(b.children) && d.push(...g(b.children)));
      return d;
    };
    for (const s of e.children) {
      if (s._truncated) {
        console.log(
          `Skipping truncated children: ${s._reason || "Unknown"}`
        );
        continue;
      }
      s.type;
    }
    const y = g(e.children);
    await a.log(
      `  First pass: Creating ${y.length} COMPONENT node(s) (without children)...`
    );
    for (const s of y)
      await a.log(
        `  Collected COMPONENT "${s.name || "Unnamed"}" (ID: ${s.id ? s.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const s of y)
      if (s.id && r && !r.has(s.id)) {
        const d = figma.createComponent();
        if (s.name !== void 0 && (d.name = s.name || "Unnamed Node"), s.componentPropertyDefinitions) {
          const b = s.componentPropertyDefinitions;
          let I = 0, N = 0;
          for (const [T, G] of Object.entries(b))
            try {
              const B = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[G.type];
              if (!B) {
                await a.warning(
                  `  Unknown property type ${G.type} for property "${T}" in component "${s.name || "Unnamed"}"`
                ), N++;
                continue;
              }
              const D = G.defaultValue, K = T.split("#")[0];
              d.addComponentProperty(
                K,
                B,
                D
              ), I++;
            } catch (k) {
              await a.warning(
                `  Failed to add component property "${T}" to "${s.name || "Unnamed"}" in first pass: ${k}`
              ), N++;
            }
          I > 0 && await a.log(
            `  Added ${I} component property definition(s) to "${s.name || "Unnamed"}" in first pass${N > 0 ? ` (${N} failed)` : ""}`
          );
        }
        r.set(s.id, d), await a.log(
          `  Created COMPONENT "${s.name || "Unnamed"}" (ID: ${s.id.substring(0, 8)}...) in first pass`
        );
      }
    for (const s of e.children) {
      if (s._truncated)
        continue;
      const d = await we(
        s,
        c,
        n,
        i,
        o,
        l,
        r,
        m,
        f,
        h,
        // Pass deferredInstances through for recursive calls
        e,
        // parentNodeData - pass the parent's nodeData so children can check for auto-layout
        $
      );
      if (d && d.parent !== c) {
        if (d.parent && typeof d.parent.removeChild == "function")
          try {
            d.parent.removeChild(d);
          } catch (b) {
            await a.warning(
              `Failed to remove child "${d.name || "Unnamed"}" from parent "${d.parent.name || "Unnamed"}": ${b}`
            );
          }
        c.appendChild(d);
      }
    }
  }
  if (t && c.parent !== t) {
    if (c.parent && typeof c.parent.removeChild == "function")
      try {
        c.parent.removeChild(c);
      } catch (g) {
        await a.warning(
          `Failed to remove node "${c.name || "Unnamed"}" from parent "${c.parent.name || "Unnamed"}": ${g}`
        );
      }
    t.appendChild(c);
  }
  if ((c.type === "FRAME" || c.type === "COMPONENT" || c.type === "INSTANCE") && e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.itemSpacing !== void 0 && !(e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.itemSpacing)) {
    const y = c.itemSpacing;
    y !== e.itemSpacing ? (await a.log(
      `  FINAL FIX: Resetting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (was ${y})`
    ), c.itemSpacing = e.itemSpacing, await a.log(
      `  FINAL FIX: Verified itemSpacing is now ${c.itemSpacing}`
    )) : await a.log(
      `  FINAL CHECK: itemSpacing is already correct (${y}) for "${e.name || "Unnamed"}"`
    );
  }
  return c;
}
async function ca(e, t, n) {
  let i = 0, o = 0, l = 0;
  const r = (f) => {
    const h = [];
    if (f.type === "INSTANCE" && h.push(f), "children" in f && f.children)
      for (const u of f.children)
        h.push(...r(u));
    return h;
  }, m = r(e);
  await a.log(
    `  Found ${m.length} instance(s) to process for variant properties`
  );
  for (const f of m)
    try {
      const h = await f.getMainComponentAsync();
      if (!h) {
        o++;
        continue;
      }
      const u = t.getSerializedTable();
      let $ = null, c;
      if (n._instanceTableMap ? (c = n._instanceTableMap.get(
        f.id
      ), c !== void 0 ? ($ = u[c], await a.log(
        `  Found instance table index ${c} for instance "${f.name}" (ID: ${f.id.substring(0, 8)}...)`
      )) : await a.log(
        `  No instance table index mapping found for instance "${f.name}" (ID: ${f.id.substring(0, 8)}...), using fallback matching`
      )) : await a.log(
        `  No instance table map found, using fallback matching for instance "${f.name}"`
      ), !$) {
        for (const [A, P] of Object.entries(u))
          if (P.instanceType === "internal" && P.componentNodeId && n.has(P.componentNodeId)) {
            const p = n.get(P.componentNodeId);
            if (p && p.id === h.id) {
              $ = P, await a.log(
                `  Matched instance "${f.name}" to instance table entry ${A} by component (less precise)`
              );
              break;
            }
          }
      }
      if (!$) {
        await a.log(
          `  No matching entry found for instance "${f.name}" (main component: ${h.name}, ID: ${h.id.substring(0, 8)}...)`
        ), o++;
        continue;
      }
      if (!$.variantProperties) {
        await a.log(
          `  Instance table entry for "${f.name}" has no variant properties`
        ), o++;
        continue;
      }
      await a.log(
        `  Instance "${f.name}" matched to entry with variant properties: ${JSON.stringify($.variantProperties)}`
      );
      let w = null;
      if (h.parent && h.parent.type === "COMPONENT_SET" && (w = h.parent.componentPropertyDefinitions), w) {
        const A = {};
        for (const [P, p] of Object.entries(
          $.variantProperties
        )) {
          const v = P.split("#")[0];
          w[v] && (A[v] = p);
        }
        Object.keys(A).length > 0 ? (f.setProperties(A), i++, await a.log(
          `  ✓ Set variant properties on instance "${f.name}": ${JSON.stringify(A)}`
        )) : o++;
      } else
        o++;
    } catch (h) {
      l++, await a.warning(
        `  Failed to set variant properties on instance "${f.name}": ${h}`
      );
    }
  await a.log(
    `  Variant properties set: ${i} processed, ${o} skipped, ${l} errors`
  );
}
async function Ze(e) {
  await figma.loadAllPagesAsync();
  const t = figma.root.children, n = new Set(t.map((l) => l.name));
  if (!n.has(e))
    return e;
  let i = 1, o = `${e}_${i}`;
  for (; n.has(o); )
    i++, o = `${e}_${i}`;
  return o;
}
async function la(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), n = new Set(t.map((l) => l.name));
  if (!n.has(e))
    return e;
  let i = 1, o = `${e}_${i}`;
  for (; n.has(o); )
    i++, o = `${e}_${i}`;
  return o;
}
async function da(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const l of e.variableIds)
    try {
      const r = await figma.variables.getVariableByIdAsync(l);
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
  const t = await figma.variables.getLocalVariableCollectionsAsync(), n = te(e.collectionName);
  if (de(e.collectionName)) {
    for (const i of t)
      if (te(i.name) === n)
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
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), l = e.getTable();
  for (const [r, m] of Object.entries(l)) {
    if (m.isLocal === !1) {
      await a.log(
        `Skipping remote collection: "${m.collectionName}" (index ${r})`
      );
      continue;
    }
    const f = te(m.collectionName), h = t == null ? void 0 : t.get(f);
    if (h) {
      await a.log(
        `✓ Using pre-created collection: "${f}" (index ${r})`
      ), n.set(r, h);
      continue;
    }
    const u = await ga(m);
    u.matchType === "recognized" ? (await a.log(
      `✓ Recognized collection by GUID: "${m.collectionName}" (index ${r})`
    ), n.set(r, u.collection)) : u.matchType === "potential" ? (await a.log(
      `? Potential match by name: "${m.collectionName}" (index ${r})`
    ), i.set(r, {
      entry: m,
      collection: u.collection
    })) : (await a.log(
      `✗ No match found for collection: "${m.collectionName}" (index ${r}) - will create new`
    ), o.set(r, m));
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
      for (const [o, { entry: l, collection: r }] of e.entries()) {
        const m = te(
          l.collectionName
        ).toLowerCase();
        let f = !1;
        m === "tokens" || m === "token" ? f = i.tokens === "existing" : m === "theme" || m === "themes" ? f = i.theme === "existing" : (m === "layer" || m === "layers") && (f = i.layers === "existing");
        const h = de(l.collectionName) ? te(l.collectionName) : r.name;
        f ? (await a.log(
          `✓ Wizard selection: Using existing collection "${h}" (index ${o})`
        ), t.set(o, r), await me(r, l.modes), await a.log(
          `  ✓ Ensured modes for collection "${h}" (${l.modes.length} mode(s))`
        )) : (await a.log(
          `✗ Wizard selection: Will create new collection for "${l.collectionName}" (index ${o})`
        ), n.set(o, l));
      }
      return;
    }
    await a.log(
      `Prompting user for ${e.size} potential match(es)...`
    );
    for (const [o, { entry: l, collection: r }] of e.entries())
      try {
        const m = de(l.collectionName) ? te(l.collectionName) : r.name, f = `Found existing "${m}" variable collection. Should I use it?`;
        await a.log(
          `Prompting user about potential match: "${m}"`
        ), await be.prompt(f, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await a.log(
          `✓ User confirmed: Using existing collection "${m}" (index ${o})`
        ), t.set(o, r), await me(r, l.modes), await a.log(
          `  ✓ Ensured modes for collection "${m}" (${l.modes.length} mode(s))`
        );
      } catch (m) {
        await a.log(
          `✗ User rejected: Will create new collection for "${l.collectionName}" (index ${o})`
        ), n.set(o, l);
      }
  }
}
async function ha(e, t, n) {
  if (e.size === 0)
    return;
  await a.log("Ensuring modes exist for recognized collections...");
  const i = t.getTable();
  for (const [o, l] of e.entries()) {
    const r = i[o];
    r && (n.has(o) || (await me(l, r.modes), await a.log(
      `  ✓ Ensured modes for collection "${l.name}" (${r.modes.length} mode(s))`
    )));
  }
}
async function ya(e, t, n, i) {
  if (e.size !== 0) {
    await a.log(
      `Processing ${e.size} collection(s) to create...`
    );
    for (const [o, l] of e.entries()) {
      const r = te(l.collectionName), m = i == null ? void 0 : i.get(r);
      if (m) {
        await a.log(
          `Reusing pre-created collection: "${r}" (index ${o}, id: ${m.id.substring(0, 8)}...)`
        ), t.set(o, m), await me(m, l.modes), n.push(m);
        continue;
      }
      const f = await la(r);
      f !== r ? await a.log(
        `Creating collection: "${f}" (normalized: "${r}" - name conflict resolved)`
      ) : await a.log(`Creating collection: "${f}"`);
      const h = figma.variables.createVariableCollection(f);
      n.push(h);
      let u;
      if (de(l.collectionName)) {
        const $ = Me(l.collectionName);
        $ && (u = $);
      } else l.collectionGuid && (u = l.collectionGuid);
      u && (h.setSharedPluginData(
        "recursica",
        re,
        u
      ), await a.log(
        `  Stored GUID: ${u.substring(0, 8)}...`
      )), await me(h, l.modes), await a.log(
        `  ✓ Created collection "${f}" with ${l.modes.length} mode(s)`
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
  const o = /* @__PURE__ */ new Map(), l = [], r = new Set(
    i.map(($) => $.id)
  );
  await a.log("Matching and creating variables in collections...");
  const m = e.getTable(), f = /* @__PURE__ */ new Map();
  for (const [$, c] of Object.entries(m)) {
    if (c._colRef === void 0)
      continue;
    const w = n.get(String(c._colRef));
    if (!w)
      continue;
    f.has(w.id) || f.set(w.id, {
      collectionName: w.name,
      existing: 0,
      created: 0
    });
    const A = f.get(w.id), P = r.has(
      w.id
    );
    let p;
    typeof c.variableType == "number" ? p = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[c.variableType] || String(c.variableType) : p = c.variableType;
    const v = await Je(
      w,
      c.variableName
    );
    if (v)
      if (lt(v, p))
        o.set($, v), A.existing++;
      else {
        await a.warning(
          `Type mismatch for variable "${c.variableName}" in collection "${w.name}": expected ${p}, found ${v.resolvedType}. Creating new variable with incremented name.`
        );
        const C = await da(
          w,
          c.variableName
        ), L = await ze(
          Q(J({}, c), {
            variableName: C,
            variableType: p
          }),
          w,
          e,
          t
        );
        P || l.push(L), o.set($, L), A.created++;
      }
    else {
      const C = await ze(
        Q(J({}, c), {
          variableType: p
        }),
        w,
        e,
        t
      );
      P || l.push(C), o.set($, C), A.created++;
    }
  }
  await a.log("Variable processing complete:");
  for (const $ of f.values())
    await a.log(
      `  "${$.collectionName}": ${$.existing} existing, ${$.created} created`
    );
  await a.log(
    "Final verification: Reading back all COLOR variables..."
  );
  let h = 0, u = 0;
  for (const $ of l)
    if ($.resolvedType === "COLOR") {
      const c = await figma.variables.getVariableCollectionByIdAsync(
        $.variableCollectionId
      );
      if (!c) {
        await a.warning(
          `  ⚠️ Variable "${$.name}" has no variableCollection (ID: ${$.variableCollectionId})`
        );
        continue;
      }
      const w = c.modes;
      if (!w || w.length === 0) {
        await a.warning(
          `  ⚠️ Variable "${$.name}" collection has no modes`
        );
        continue;
      }
      for (const A of w) {
        const P = $.valuesByMode[A.modeId];
        if (P && typeof P == "object" && "r" in P) {
          const p = P;
          Math.abs(p.r - 1) < 0.01 && Math.abs(p.g - 1) < 0.01 && Math.abs(p.b - 1) < 0.01 ? (u++, await a.warning(
            `  ⚠️ Variable "${$.name}" mode "${A.name}" is WHITE: r=${p.r.toFixed(3)}, g=${p.g.toFixed(3)}, b=${p.b.toFixed(3)}`
          )) : (h++, await a.log(
            `  ✓ Variable "${$.name}" mode "${A.name}" has color: r=${p.r.toFixed(3)}, g=${p.g.toFixed(3)}, b=${p.b.toFixed(3)}`
          ));
        } else P && typeof P == "object" && "type" in P || await a.warning(
          `  ⚠️ Variable "${$.name}" mode "${A.name}" has unexpected value type: ${JSON.stringify(P)}`
        );
      }
    }
  return await a.log(
    `Final verification complete: ${h} color variables verified, ${u} white variables found`
  ), {
    recognizedVariables: o,
    newlyCreatedVariables: l
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
  for (const l of e.children)
    (l.type === "FRAME" || l.type === "COMPONENT") && n.add(l.name);
  if (!n.has(t))
    return t;
  let i = 1, o = `${t}_${i}`;
  for (; n.has(o); )
    i++, o = `${t}_${i}`;
  return o;
}
async function Ea(e, t, n, i, o, l = "") {
  var A;
  const r = e.getSerializedTable(), m = Object.values(r).filter(
    (P) => P.instanceType === "remote"
  ), f = /* @__PURE__ */ new Map();
  if (m.length === 0)
    return await a.log("No remote instances found"), f;
  await a.log(
    `Processing ${m.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  const h = figma.root.children, u = l ? `${l} REMOTES` : "REMOTES";
  let $ = h.find(
    (P) => P.name === "REMOTES" || P.name === u
  );
  if ($ ? (await a.log("Found existing REMOTES page"), l && !$.name.startsWith(l) && ($.name = u)) : ($ = figma.createPage(), $.name = u, await a.log("Created REMOTES page")), m.length > 0 && ($.setPluginData("RecursicaUnderReview", "true"), await a.log("Marked REMOTES page as under review")), !$.children.some(
    (P) => P.type === "FRAME" && P.name === "Title"
  )) {
    const P = { family: "Inter", style: "Bold" }, p = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(P), await figma.loadFontAsync(p);
    const v = figma.createFrame();
    v.name = "Title", v.layoutMode = "VERTICAL", v.paddingTop = 20, v.paddingBottom = 20, v.paddingLeft = 20, v.paddingRight = 20, v.fills = [];
    const C = figma.createText();
    C.fontName = P, C.characters = "REMOTE INSTANCES", C.fontSize = 24, C.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], v.appendChild(C);
    const L = figma.createText();
    L.fontName = p, L.characters = "These are remotely connected component instances found in our different component pages.", L.fontSize = 14, L.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], v.appendChild(L), $.appendChild(v), await a.log("Created title and description on REMOTES page");
  }
  const w = /* @__PURE__ */ new Map();
  for (const [P, p] of Object.entries(r)) {
    if (p.instanceType !== "remote")
      continue;
    const v = parseInt(P, 10);
    if (await a.log(
      `Processing remote instance ${v}: "${p.componentName}"`
    ), !p.structure) {
      await a.warning(
        `Remote instance "${p.componentName}" missing structure data, skipping`
      );
      continue;
    }
    Ke(p.structure);
    const C = p.structure.children !== void 0, L = p.structure.child !== void 0, x = p.structure.children ? p.structure.children.length : p.structure.child ? p.structure.child.length : 0;
    await a.log(
      `  Structure type: ${p.structure.type || "unknown"}, has children: ${x} (children key: ${C}, child key: ${L})`
    );
    let U = p.componentName;
    if (p.path && p.path.length > 0) {
      const S = p.path.filter((E) => E !== "").join(" / ");
      S && (U = `${S} / ${p.componentName}`);
    }
    const M = await va(
      $,
      U
    );
    M !== U && await a.log(
      `Component name conflict: "${U}" -> "${M}"`
    );
    try {
      if (p.structure.type !== "COMPONENT") {
        await a.warning(
          `Remote instance "${p.componentName}" structure is not a COMPONENT (type: ${p.structure.type}), creating frame fallback`
        );
        const E = figma.createFrame();
        E.name = M;
        const O = await we(
          p.structure,
          E,
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
        O ? (E.appendChild(O), $.appendChild(E), await a.log(
          `✓ Created remote instance frame fallback: "${M}"`
        )) : E.remove();
        continue;
      }
      const S = figma.createComponent();
      S.name = M, $.appendChild(S), await a.log(
        `  Created component node: "${M}"`
      );
      try {
        if (p.structure.componentPropertyDefinitions) {
          const s = p.structure.componentPropertyDefinitions;
          let d = 0, b = 0;
          for (const [I, N] of Object.entries(s))
            try {
              const G = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[N.type];
              if (!G) {
                await a.warning(
                  `  Unknown property type ${N.type} for property "${I}" in component "${p.componentName}"`
                ), b++;
                continue;
              }
              const k = N.defaultValue, B = I.split("#")[0];
              S.addComponentProperty(
                B,
                G,
                k
              ), d++;
            } catch (T) {
              await a.warning(
                `  Failed to add component property "${I}" to "${p.componentName}": ${T}`
              ), b++;
            }
          d > 0 && await a.log(
            `  Added ${d} component property definition(s) to "${p.componentName}"${b > 0 ? ` (${b} failed)` : ""}`
          );
        }
        p.structure.name !== void 0 && (S.name = p.structure.name);
        const E = p.structure.boundVariables && typeof p.structure.boundVariables == "object" && (p.structure.boundVariables.width || p.structure.boundVariables.height);
        p.structure.width !== void 0 && p.structure.height !== void 0 && !E && S.resize(p.structure.width, p.structure.height), p.structure.x !== void 0 && (S.x = p.structure.x), p.structure.y !== void 0 && (S.y = p.structure.y);
        const O = p.structure.boundVariables && typeof p.structure.boundVariables == "object";
        if (p.structure.visible !== void 0 && (S.visible = p.structure.visible), p.structure.opacity !== void 0 && (!O || !p.structure.boundVariables.opacity) && (S.opacity = p.structure.opacity), p.structure.rotation !== void 0 && (!O || !p.structure.boundVariables.rotation) && (S.rotation = p.structure.rotation), p.structure.blendMode !== void 0 && (!O || !p.structure.boundVariables.blendMode) && (S.blendMode = p.structure.blendMode), p.structure.fills !== void 0)
          try {
            let s = p.structure.fills;
            Array.isArray(s) && (s = s.map((d) => {
              if (d && typeof d == "object") {
                const b = J({}, d);
                return delete b.boundVariables, b;
              }
              return d;
            })), S.fills = s, (A = p.structure.boundVariables) != null && A.fills && i && await ra(
              S,
              p.structure.boundVariables,
              "fills",
              i
            );
          } catch (s) {
            await a.warning(
              `Error setting fills for remote component "${p.componentName}": ${s}`
            );
          }
        if (p.structure.strokes !== void 0)
          try {
            S.strokes = p.structure.strokes;
          } catch (s) {
            await a.warning(
              `Error setting strokes for remote component "${p.componentName}": ${s}`
            );
          }
        const V = p.structure.boundVariables && typeof p.structure.boundVariables == "object" && (p.structure.boundVariables.strokeWeight || p.structure.boundVariables.strokeAlign);
        p.structure.strokeWeight !== void 0 && (!V || !p.structure.boundVariables.strokeWeight) && (S.strokeWeight = p.structure.strokeWeight), p.structure.strokeAlign !== void 0 && (!V || !p.structure.boundVariables.strokeAlign) && (S.strokeAlign = p.structure.strokeAlign), p.structure.layoutMode !== void 0 && (S.layoutMode = p.structure.layoutMode), p.structure.primaryAxisSizingMode !== void 0 && (S.primaryAxisSizingMode = p.structure.primaryAxisSizingMode), p.structure.counterAxisSizingMode !== void 0 && (S.counterAxisSizingMode = p.structure.counterAxisSizingMode);
        const R = p.structure.boundVariables && typeof p.structure.boundVariables == "object";
        p.structure.paddingLeft !== void 0 && (!R || !p.structure.boundVariables.paddingLeft) && (S.paddingLeft = p.structure.paddingLeft), p.structure.paddingRight !== void 0 && (!R || !p.structure.boundVariables.paddingRight) && (S.paddingRight = p.structure.paddingRight), p.structure.paddingTop !== void 0 && (!R || !p.structure.boundVariables.paddingTop) && (S.paddingTop = p.structure.paddingTop), p.structure.paddingBottom !== void 0 && (!R || !p.structure.boundVariables.paddingBottom) && (S.paddingBottom = p.structure.paddingBottom), p.structure.itemSpacing !== void 0 && (!R || !p.structure.boundVariables.itemSpacing) && (S.itemSpacing = p.structure.itemSpacing);
        const g = p.structure.boundVariables && typeof p.structure.boundVariables == "object" && (p.structure.boundVariables.cornerRadius || p.structure.boundVariables.topLeftRadius || p.structure.boundVariables.topRightRadius || p.structure.boundVariables.bottomLeftRadius || p.structure.boundVariables.bottomRightRadius);
        if (p.structure.cornerRadius !== void 0 && (!g || !p.structure.boundVariables.cornerRadius) && (S.cornerRadius = p.structure.cornerRadius), p.structure.boundVariables && i) {
          const s = p.structure.boundVariables, d = [
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
          for (const b of d)
            if (s[b] && pe(s[b])) {
              const I = s[b]._varRef;
              if (I !== void 0) {
                const N = i.get(String(I));
                if (N) {
                  const T = {
                    type: "VARIABLE_ALIAS",
                    id: N.id
                  };
                  S.boundVariables || (S.boundVariables = {}), S.boundVariables[b] = T;
                }
              }
            }
        }
        await a.log(
          `  DEBUG: Structure keys: ${Object.keys(p.structure).join(", ")}, has children: ${!!p.structure.children}, has child: ${!!p.structure.child}`
        );
        const y = p.structure.children || (p.structure.child ? p.structure.child : null);
        if (await a.log(
          `  DEBUG: childrenArray exists: ${!!y}, isArray: ${Array.isArray(y)}, length: ${y ? y.length : 0}`
        ), y && Array.isArray(y) && y.length > 0) {
          await a.log(
            `  Recreating ${y.length} child(ren) for component "${p.componentName}"`
          );
          for (let s = 0; s < y.length; s++) {
            const d = y[s];
            if (await a.log(
              `  DEBUG: Processing child ${s + 1}/${y.length}: ${JSON.stringify({ name: d == null ? void 0 : d.name, type: d == null ? void 0 : d.type, hasTruncated: !!(d != null && d._truncated) })}`
            ), d._truncated) {
              await a.log(
                `  Skipping truncated child: ${d._reason || "Unknown"}`
              );
              continue;
            }
            await a.log(
              `  Recreating child: "${d.name || "Unnamed"}" (type: ${d.type})`
            );
            const b = await we(
              d,
              S,
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
              p.structure,
              // parentNodeData - pass the component's structure so children can check for auto-layout
              o
            );
            b ? (S.appendChild(b), await a.log(
              `  ✓ Appended child "${d.name || "Unnamed"}" to component "${p.componentName}"`
            )) : await a.warning(
              `  ✗ Failed to create child "${d.name || "Unnamed"}" (type: ${d.type})`
            );
          }
        }
        f.set(v, S), await a.log(
          `✓ Created remote component: "${M}" (index ${v})`
        );
      } catch (E) {
        await a.warning(
          `Error populating remote component "${p.componentName}": ${E instanceof Error ? E.message : "Unknown error"}`
        ), S.remove();
      }
    } catch (S) {
      await a.warning(
        `Error recreating remote instance "${p.componentName}": ${S instanceof Error ? S.message : "Unknown error"}`
      );
    }
  }
  return await a.log(
    `Remote instance processing complete: ${f.size} component(s) created`
  ), f;
}
async function Aa(e, t, n, i, o, l, r = null, m = null, f = !1, h = null, u = !1, $ = !1, c = "") {
  await a.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const w = figma.root.children, A = "RecursicaPublishedMetadata";
  let P = null;
  for (const O of w) {
    const V = O.getPluginData(A);
    if (V)
      try {
        if (JSON.parse(V).id === e.guid) {
          P = O;
          break;
        }
      } catch (R) {
        continue;
      }
  }
  let p = !1;
  if (P && !f && !u) {
    let O;
    try {
      const g = P.getPluginData(A);
      g && (O = JSON.parse(g).version);
    } catch (g) {
    }
    const V = O !== void 0 ? ` v${O}` : "", R = `Found existing component "${P.name}${V}". Should I use it or create a copy?`;
    await a.log(
      `Found existing page with same GUID: "${P.name}". Prompting user...`
    );
    try {
      await be.prompt(R, {
        okLabel: "Use",
        cancelLabel: "Copy",
        timeoutMs: 3e5
        // 5 minutes
      }), p = !0, await a.log(
        `User chose to use existing page: "${P.name}"`
      );
    } catch (g) {
      await a.log(
        "User chose to create a copy. Will create new page."
      );
    }
  }
  if (p && P)
    return await figma.setCurrentPageAsync(P), await a.log(
      `Using existing page: "${P.name}" (GUID: ${e.guid.substring(0, 8)}...)`
    ), await a.log(
      `  Instances from other pages will resolve to components on this existing page using componentPageName: "${P.name}"`
    ), {
      success: !0,
      page: P,
      // Include pageId so it can be tracked in importedPages
      pageId: P.id
    };
  const v = w.find((O) => O.name === e.name);
  v && await a.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let C;
  if (P || v) {
    const O = `__${e.name}`;
    C = await Ze(O), await a.log(
      `Creating scratch page: "${C}" (will be renamed to "${e.name}" on success)`
    );
  } else
    C = e.name, await a.log(`Creating page: "${C}"`);
  const L = figma.createPage();
  if (L.name = C, await figma.setCurrentPageAsync(L), await a.log(`Switched to page: "${C}"`), !t.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await a.log("Recreating page structure...");
  const x = t.pageData;
  if (x.backgrounds !== void 0)
    try {
      L.backgrounds = x.backgrounds, await a.log(
        `Set page background: ${JSON.stringify(x.backgrounds)}`
      );
    } catch (O) {
      await a.warning(`Failed to set page background: ${O}`);
    }
  Ke(x);
  const U = /* @__PURE__ */ new Map(), M = (O, V = []) => {
    if (O.type === "COMPONENT" && O.id && V.push(O.id), O.children && Array.isArray(O.children))
      for (const R of O.children)
        R._truncated || M(R, V);
    return V;
  }, S = M(x);
  if (await a.log(
    `Found ${S.length} COMPONENT node(s) in page data`
  ), S.length > 0 && (await a.log(
    `Component IDs in page data (first 20): ${S.slice(0, 20).map((O) => O.substring(0, 8) + "...").join(", ")}`
  ), x._allComponentIds = S), x.children && Array.isArray(x.children))
    for (const O of x.children) {
      const V = await we(
        O,
        L,
        n,
        i,
        o,
        l,
        U,
        !1,
        // isRemoteStructure: false - we're creating the main page
        r,
        m,
        x,
        // parentNodeData - pass the page's nodeData so children can check for auto-layout
        h
      );
      V && L.appendChild(V);
    }
  await a.log("Page structure recreated successfully"), o && (await a.log(
    "Third pass: Setting variant properties on instances..."
  ), await ca(
    L,
    o,
    U
  ));
  const E = {
    _ver: 1,
    id: e.guid,
    name: e.name,
    version: e.version || 0,
    publishDate: (/* @__PURE__ */ new Date()).toISOString(),
    history: {}
  };
  if (L.setPluginData(A, JSON.stringify(E)), await a.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), C.startsWith("__")) {
    let O;
    $ ? O = c ? `${c} ${e.name}` : e.name : O = await Ze(e.name), L.name = O, await a.log(`Renamed page from "${C}" to "${O}"`);
  } else $ && c && (L.name.startsWith(c) || (L.name = `${c} ${L.name}`));
  return {
    success: !0,
    page: L,
    deferredInstances: m || void 0
  };
}
async function dt(e) {
  var i, o, l;
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
    const m = pa(r);
    if (!m.success)
      return await a.error(m.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: m.error,
        data: {}
      };
    const f = m.metadata;
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
    const $ = ma(u);
    if (!$.success)
      return $.error === "No collections table found in JSON" ? (await a.log($.error), await a.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: f.name }
      }) : (await a.error($.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: $.error,
        data: {}
      });
    const c = $.collectionTable;
    await a.log(
      `Loaded collections table with ${c.getSize()} collection(s)`
    ), await a.log(
      "Matching collections with existing local collections..."
    );
    const { recognizedCollections: w, potentialMatches: A, collectionsToCreate: P } = await fa(c, e.preCreatedCollections);
    await ua(
      A,
      w,
      P,
      e.collectionChoices
    ), await ha(
      w,
      c,
      A
    ), await ya(
      P,
      w,
      n,
      e.preCreatedCollections
    ), await a.log("Loading variables table...");
    const p = ba(u);
    if (!p.success)
      return p.error === "No variables table found in JSON" ? (await a.log(p.error), await a.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no variables to process)",
        data: { pageName: f.name }
      }) : (await a.error(p.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: p.error,
        data: {}
      });
    const v = p.variableTable;
    await a.log(
      `Loaded variables table with ${v.getSize()} variable(s)`
    );
    const { recognizedVariables: C, newlyCreatedVariables: L } = await wa(
      v,
      c,
      w,
      n
    );
    await a.log("Loading instance table...");
    const x = $a(u);
    if (x) {
      const I = x.getSerializedTable(), N = Object.values(I).filter(
        (G) => G.instanceType === "internal"
      ), T = Object.values(I).filter(
        (G) => G.instanceType === "remote"
      );
      await a.log(
        `Loaded instance table with ${x.getSize()} instance(s) (${N.length} internal, ${T.length} remote)`
      );
    } else
      await a.log("No instance table found in JSON");
    const U = [], M = (i = e.isMainPage) != null ? i : !0, S = (o = e.alwaysCreateCopy) != null ? o : !1, E = (l = e.skipUniqueNaming) != null ? l : !1, O = e.constructionIcon || "";
    let V = null;
    x && (V = await Ea(
      x,
      v,
      c,
      C,
      w,
      O
    ));
    const R = await Aa(
      f,
      u,
      v,
      c,
      x,
      C,
      V,
      U,
      M,
      w,
      S,
      E,
      O
    );
    if (!R.success)
      return await a.error(R.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: R.error,
        data: {}
      };
    const g = R.page, y = C.size + L.length, s = R.deferredInstances || U, d = (s == null ? void 0 : s.length) || 0;
    if (await a.log("=== Import Complete ==="), await a.log(
      `Successfully processed ${w.size} collection(s), ${y} variable(s), and created page "${g.name}"${d > 0 ? ` (${d} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`
    ), d > 0) {
      await a.log(
        `  [DEBUG] Returning ${d} deferred instance(s) in response`
      );
      for (const I of s)
        await a.log(
          `    - "${I.nodeData.name}" from page "${I.instanceEntry.componentPageName}"`
        );
    }
    const b = R.pageId || g.id;
    return {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: {
        pageName: g.name,
        pageId: b,
        // Include pageId for tracking (used for both new and reused pages)
        deferredInstances: d > 0 ? s : void 0,
        createdEntities: {
          pageIds: [g.id],
          collectionIds: n.map((I) => I.id),
          variableIds: L.map((I) => I.id)
        }
      }
    };
  } catch (r) {
    const m = r instanceof Error ? r.message : "Unknown error occurred";
    return await a.error(`Import failed: ${m}`), r instanceof Error && r.stack && await a.error(`Stack trace: ${r.stack}`), console.error("Error importing page:", r), {
      type: "importPage",
      success: !1,
      error: !0,
      message: m,
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
  for (const l of e)
    try {
      const { placeholderFrameId: r, instanceEntry: m, nodeData: f, parentNodeId: h } = l, u = await figma.getNodeByIdAsync(
        r
      ), $ = await figma.getNodeByIdAsync(
        h
      );
      if (!u || !$) {
        const v = `Deferred instance "${f.name}" - could not find placeholder frame (${r}) or parent node (${h})`;
        await a.error(v), o.push(v), i++;
        continue;
      }
      let c = figma.root.children.find((v) => {
        const C = v.name === m.componentPageName, L = t && v.name === `${t} ${m.componentPageName}`;
        return C || L;
      });
      if (!c) {
        const v = ne(
          m.componentPageName
        );
        c = figma.root.children.find((C) => ne(C.name) === v);
      }
      if (!c && t) {
        const v = figma.root.children.map((C) => C.name).slice(0, 10);
        await a.log(
          `  [DEBUG] Looking for page "${m.componentPageName}" (or "${t} ${m.componentPageName}"). Available pages (first 10): ${v.join(", ")}`
        );
      }
      if (!c) {
        const v = t ? `"${m.componentPageName}" or "${t} ${m.componentPageName}"` : `"${m.componentPageName}"`, C = `Deferred instance "${f.name}" still cannot find referenced page (tried: ${v}, and clean name matching)`;
        await a.error(C), o.push(C), i++;
        continue;
      }
      const w = (v, C, L, x, U) => {
        if (C.length === 0) {
          let O = null;
          const V = ne(L);
          for (const R of v.children || [])
            if (R.type === "COMPONENT") {
              const g = R.name === L, y = ne(R.name) === V;
              if (g || y) {
                if (O || (O = R), g && x)
                  try {
                    const s = R.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (s && JSON.parse(s).id === x)
                      return R;
                  } catch (s) {
                  }
                else if (g)
                  return R;
              }
            } else if (R.type === "COMPONENT_SET") {
              if (U) {
                const g = R.name === U, y = ne(R.name) === ne(U);
                if (!g && !y)
                  continue;
              }
              for (const g of R.children || [])
                if (g.type === "COMPONENT") {
                  const y = g.name === L, s = ne(g.name) === V;
                  if (y || s) {
                    if (O || (O = g), y && x)
                      try {
                        const d = g.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (d && JSON.parse(d).id === x)
                          return g;
                      } catch (d) {
                      }
                    else if (y)
                      return g;
                  }
                }
            }
          return O;
        }
        const [M, ...S] = C, E = ne(M);
        for (const O of v.children || []) {
          const V = O.name === M, R = ne(O.name) === E;
          if (V || R) {
            if (S.length === 0 && O.type === "COMPONENT_SET") {
              if (U) {
                const y = O.name === U, s = ne(O.name) === ne(U);
                if (!y && !s)
                  continue;
              }
              const g = ne(L);
              for (const y of O.children || [])
                if (y.type === "COMPONENT") {
                  const s = y.name === L, d = ne(y.name) === g;
                  if (s || d) {
                    if (x)
                      try {
                        const b = y.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (b && JSON.parse(b).id === x)
                          return y;
                      } catch (b) {
                      }
                    if (s)
                      return y;
                  }
                }
              return null;
            }
            return w(
              O,
              S,
              L,
              x,
              U
            );
          }
        }
        return null;
      }, A = w(
        c,
        m.path || [],
        m.componentName,
        m.componentGuid,
        m.componentSetName
      );
      if (!A) {
        const v = m.path && m.path.length > 0 ? ` at path [${m.path.join(" → ")}]` : " at page root", C = `Deferred instance "${f.name}" still cannot find component "${m.componentName}" on page "${m.componentPageName}"${v}`;
        await a.error(C), o.push(C), i++;
        continue;
      }
      const P = A.createInstance();
      if (P.name = f.name || u.name.replace("[Deferred: ", "").replace("]", ""), P.x = u.x, P.y = u.y, u.width !== void 0 && u.height !== void 0 && P.resize(u.width, u.height), m.variantProperties && Object.keys(m.variantProperties).length > 0)
        try {
          const v = await P.getMainComponentAsync();
          if (v) {
            let C = null;
            const L = v.type;
            if (L === "COMPONENT_SET" ? C = v.componentPropertyDefinitions : L === "COMPONENT" && v.parent && v.parent.type === "COMPONENT_SET" ? C = v.parent.componentPropertyDefinitions : await a.warning(
              `Cannot set variant properties for resolved instance "${f.name}" - main component is not a COMPONENT_SET or variant`
            ), C) {
              const x = {};
              for (const [U, M] of Object.entries(
                m.variantProperties
              )) {
                const S = U.split("#")[0];
                C[S] && (x[S] = M);
              }
              Object.keys(x).length > 0 && P.setProperties(x);
            }
          }
        } catch (v) {
          await a.warning(
            `Failed to set variant properties for resolved instance "${f.name}": ${v}`
          );
        }
      if (m.componentProperties && Object.keys(m.componentProperties).length > 0)
        try {
          const v = await P.getMainComponentAsync();
          if (v) {
            let C = null;
            const L = v.type;
            if (L === "COMPONENT_SET" ? C = v.componentPropertyDefinitions : L === "COMPONENT" && v.parent && v.parent.type === "COMPONENT_SET" ? C = v.parent.componentPropertyDefinitions : L === "COMPONENT" && (C = v.componentPropertyDefinitions), C)
              for (const [x, U] of Object.entries(
                m.componentProperties
              )) {
                const M = x.split("#")[0];
                if (C[M])
                  try {
                    P.setProperties({
                      [M]: U
                    });
                  } catch (S) {
                    await a.warning(
                      `Failed to set component property "${M}" for resolved instance "${f.name}": ${S}`
                    );
                  }
              }
          }
        } catch (v) {
          await a.warning(
            `Failed to set component properties for resolved instance "${f.name}": ${v}`
          );
        }
      const p = $.children.indexOf(u);
      $.insertChild(p, P), u.remove(), await a.log(
        `  ✓ Resolved deferred instance "${f.name}" from component "${m.componentName}" on page "${m.componentPageName}"`
      ), n++;
    } catch (r) {
      const m = r instanceof Error ? r.message : String(r), f = `Failed to resolve deferred instance "${l.nodeData.name}": ${m}`;
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
    for (const m of i)
      try {
        const f = await figma.variables.getVariableByIdAsync(m);
        if (f) {
          const h = f.variableCollectionId;
          n.includes(h) || (f.remove(), o++);
        }
      } catch (f) {
        await a.warning(
          `Could not delete variable ${m.substring(0, 8)}...: ${f}`
        );
      }
    let l = 0;
    for (const m of n)
      try {
        const f = await figma.variables.getVariableCollectionByIdAsync(m);
        f && (f.remove(), l++);
      } catch (f) {
        await a.warning(
          `Could not delete collection ${m.substring(0, 8)}...: ${f}`
        );
      }
    await figma.loadAllPagesAsync();
    let r = 0;
    for (const m of t)
      try {
        const f = await figma.getNodeByIdAsync(m);
        f && f.type === "PAGE" && (f.remove(), r++);
      } catch (f) {
        await a.warning(
          `Could not delete page ${m.substring(0, 8)}...: ${f}`
        );
      }
    return await a.log(
      `Cleanup complete: Deleted ${r} page(s), ${l} collection(s), ${o} variable(s)`
    ), {
      type: "cleanupCreatedEntities",
      success: !0,
      error: !1,
      message: "Cleanup completed successfully",
      data: {
        deletedPages: r,
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
      const l = o.expandedJsonData, r = l.metadata;
      if (!r || !r.name || !r.guid) {
        await a.warning(
          `Skipping ${n} - missing or invalid metadata`
        );
        continue;
      }
      const m = [];
      if (l.instances) {
        const h = Ae.fromTable(
          l.instances
        ).getSerializedTable();
        for (const u of Object.values(h))
          u.instanceType === "normal" && u.componentPageName && (m.includes(u.componentPageName) || m.push(u.componentPageName));
      }
      t.push({
        fileName: n,
        pageName: r.name,
        pageGuid: r.guid,
        dependencies: m,
        jsonData: i
        // Store original JSON data for import
      }), await a.log(
        `  ${n}: "${r.name}" depends on: ${m.length > 0 ? m.join(", ") : "none"}`
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
  const l = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), m = [], f = (h) => {
    if (l.has(h.pageName))
      return !1;
    if (r.has(h.pageName)) {
      const u = m.findIndex(
        ($) => $.pageName === h.pageName
      );
      if (u !== -1) {
        const $ = m.slice(u).concat([h]);
        return n.push($), !0;
      }
      return !1;
    }
    r.add(h.pageName), m.push(h);
    for (const u of h.dependencies) {
      const $ = o.get(u);
      $ && f($);
    }
    return r.delete(h.pageName), m.pop(), l.add(h.pageName), t.push(h), !1;
  };
  for (const h of e)
    l.has(h.pageName) || f(h);
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
      const o = i.map((l) => `"${l.pageName}"`).join(" → ");
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
  var C, L, x, U, M, S;
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
  const l = /* @__PURE__ */ new Map();
  if (await a.log(
    `Checking collectionChoices: ${e.collectionChoices ? "exists" : "undefined"}`
  ), e.collectionChoices) {
    await a.log("=== Pre-creating Collections ==="), await a.log(
      `Collection choices: tokens=${e.collectionChoices.tokens}, theme=${e.collectionChoices.theme}, layers=${e.collectionChoices.layers}`
    );
    const E = "recursica:collectionId", O = async (R) => {
      const g = await figma.variables.getLocalVariableCollectionsAsync(), y = new Set(g.map((b) => b.name));
      if (!y.has(R))
        return R;
      let s = 1, d = `${R}_${s}`;
      for (; y.has(d); )
        s++, d = `${R}_${s}`;
      return d;
    }, V = [
      { choice: e.collectionChoices.tokens, normalizedName: "Tokens" },
      { choice: e.collectionChoices.theme, normalizedName: "Theme" },
      { choice: e.collectionChoices.layers, normalizedName: "Layer" }
    ];
    for (const { choice: R, normalizedName: g } of V)
      if (R === "new") {
        await a.log(
          `Processing collection type: "${g}" (choice: "new") - will create new collection`
        );
        const y = await O(g), s = figma.variables.createVariableCollection(y);
        if (de(g)) {
          const d = Me(g);
          d && (s.setSharedPluginData(
            "recursica",
            E,
            d
          ), await a.log(
            `  Stored fixed GUID: ${d.substring(0, 8)}...`
          ));
        }
        l.set(g, s), await a.log(
          `✓ Pre-created collection: "${y}" (normalized: "${g}", id: ${s.id.substring(0, 8)}...)`
        );
      } else
        await a.log(
          `Skipping collection type: "${g}" (choice: "existing")`
        );
    l.size > 0 && await a.log(
      `Pre-created ${l.size} collection(s) for reuse across all imports`
    );
  }
  await a.log("=== Importing Pages in Order ===");
  let r = 0, m = 0;
  const f = [...o], h = [], u = {
    pageIds: [],
    collectionIds: [],
    variableIds: []
  }, $ = [];
  if (l.size > 0)
    for (const E of l.values())
      u.collectionIds.push(E.id), await a.log(
        `Tracking pre-created collection: "${E.name}" (${E.id.substring(0, 8)}...)`
      );
  const c = e.mainFileName;
  for (let E = 0; E < n.length; E++) {
    const O = n[E], V = c ? O.fileName === c : E === n.length - 1;
    await a.log(
      `[${E + 1}/${n.length}] Importing ${O.fileName} ("${O.pageName}")${V ? " [MAIN]" : " [DEPENDENCY]"}...`
    );
    try {
      const R = E === 0, g = await dt({
        jsonData: O.jsonData,
        isMainPage: V,
        clearConsole: R,
        collectionChoices: e.collectionChoices,
        alwaysCreateCopy: !0,
        // Wizard imports always create copies (no prompts)
        skipUniqueNaming: (C = e.skipUniqueNaming) != null ? C : !1,
        constructionIcon: e.constructionIcon || "",
        preCreatedCollections: l
        // Pass pre-created collections for reuse
      });
      if (g.success) {
        if (r++, (L = g.data) != null && L.deferredInstances) {
          const y = g.data.deferredInstances;
          Array.isArray(y) && (await a.log(
            `  [DEBUG] Collected ${y.length} deferred instance(s) from ${O.fileName}`
          ), h.push(...y));
        } else
          await a.log(
            `  [DEBUG] No deferred instances in response for ${O.fileName}`
          );
        if ((x = g.data) != null && x.createdEntities) {
          const y = g.data.createdEntities;
          y.pageIds && u.pageIds.push(...y.pageIds), y.collectionIds && u.collectionIds.push(...y.collectionIds), y.variableIds && u.variableIds.push(...y.variableIds);
          const s = ((U = y.pageIds) == null ? void 0 : U[0]) || ((M = g.data) == null ? void 0 : M.pageId);
          (S = g.data) != null && S.pageName && s && $.push({
            name: g.data.pageName,
            pageId: s
          });
        }
      } else
        m++, f.push(
          `Failed to import ${O.fileName}: ${g.message || "Unknown error"}`
        );
    } catch (R) {
      m++;
      const g = R instanceof Error ? R.message : String(R);
      f.push(`Failed to import ${O.fileName}: ${g}`);
    }
  }
  if (h.length > 0) {
    await a.log(
      `=== Resolving ${h.length} Deferred Instance(s) ===`
    );
    try {
      const E = await gt(
        h,
        e.constructionIcon || ""
      );
      await a.log(
        `  Resolved: ${E.resolved}, Failed: ${E.failed}`
      ), E.errors.length > 0 && f.push(...E.errors);
    } catch (E) {
      f.push(
        `Failed to resolve deferred instances: ${E instanceof Error ? E.message : String(E)}`
      );
    }
  }
  const w = Array.from(
    new Set(u.collectionIds)
  ), A = Array.from(
    new Set(u.variableIds)
  ), P = Array.from(new Set(u.pageIds));
  if (await a.log("=== Import Summary ==="), await a.log(
    `  Imported: ${r}, Failed: ${m}, Deferred instances: ${h.length}`
  ), await a.log(
    `  Collections in allCreatedEntityIds: ${u.collectionIds.length}, Unique: ${w.length}`
  ), w.length > 0) {
    await a.log(
      `  Created ${w.length} collection(s)`
    );
    for (const E of w)
      try {
        const O = await figma.variables.getVariableCollectionByIdAsync(E);
        O && await a.log(
          `    - "${O.name}" (${E.substring(0, 8)}...)`
        );
      } catch (O) {
      }
  }
  const p = m === 0, v = p ? `Successfully imported ${r} page(s)${h.length > 0 ? ` (${h.length} deferred instance(s) resolved)` : ""}` : `Import completed with ${m} failure(s). ${f.join("; ")}`;
  return {
    type: "importPagesInOrder",
    success: p,
    error: !p,
    message: v,
    data: {
      imported: r,
      failed: m,
      deferred: h.length,
      errors: f,
      importedPages: $,
      createdEntities: {
        pageIds: P,
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
    const l = JSON.stringify(o, null, 2), r = JSON.parse(l), m = "Copy - " + r.name, f = figma.createPage();
    if (f.name = m, figma.root.appendChild(f), r.children && r.children.length > 0) {
      let $ = function(w) {
        w.forEach((A) => {
          const P = (A.x || 0) + (A.width || 0);
          P > c && (c = P), A.children && A.children.length > 0 && $(A.children);
        });
      };
      console.log(
        "Recreating " + r.children.length + " top-level children..."
      );
      let c = 0;
      $(r.children), console.log("Original content rightmost edge: " + c);
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
        newPageName: m,
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
async function Ia(e) {
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
async function Sa(e) {
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
function Z(e, t = {}) {
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
      (m) => m.id === t.id
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
      return Z("getComponentMetadata", h);
    }
    const r = {
      componentMetadata: JSON.parse(o),
      currentPageIndex: i
    };
    return Z("getComponentMetadata", r);
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
      const l = o, r = l.getPluginData(ht);
      if (r)
        try {
          const m = JSON.parse(r);
          n.push(m);
        } catch (m) {
          console.warn(
            `Failed to parse metadata for page "${l.name}":`,
            m
          );
          const h = {
            _ver: 1,
            id: "",
            name: Oe(l.name),
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
          name: Oe(l.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        n.push(f);
      }
    }
    return Z("getAllComponents", {
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
const ee = "RecursicaPrimaryImport", q = "RecursicaUnderReview", yt = "---", bt = "---", ie = "RecursicaImportDivider", ue = "start", he = "end", le = "⚠️";
async function _a(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children;
    for (const i of t) {
      if (i.type !== "PAGE")
        continue;
      const o = i.getPluginData(ee);
      if (o)
        try {
          const r = JSON.parse(o), m = {
            exists: !0,
            pageId: i.id,
            metadata: r
          };
          return Z(
            "checkForExistingPrimaryImport",
            m
          );
        } catch (r) {
          await a.warning(
            `Failed to parse primary import metadata on page "${i.name}": ${r}`
          );
          continue;
        }
      if (i.getPluginData(q) === "true") {
        const r = i.getPluginData(ee);
        if (r)
          try {
            const m = JSON.parse(r), f = {
              exists: !0,
              pageId: i.id,
              metadata: m
            };
            return Z(
              "checkForExistingPrimaryImport",
              f
            );
          } catch (m) {
          }
        else
          await a.warning(
            `Found page "${i.name}" marked as under review but missing primary import metadata`
          );
      }
    }
    return Z("checkForExistingPrimaryImport", {
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
      (m) => m.type === "PAGE" && m.getPluginData(ie) === ue
    ), n = figma.root.children.find(
      (m) => m.type === "PAGE" && m.getPluginData(ie) === he
    );
    if (t && n) {
      const m = {
        startDividerId: t.id,
        endDividerId: n.id
      };
      return Z("createImportDividers", m);
    }
    const i = figma.createPage();
    i.name = yt, i.setPluginData(ie, ue), i.setPluginData(q, "true");
    const o = figma.createPage();
    o.name = bt, o.setPluginData(ie, he), o.setPluginData(q, "true");
    const l = figma.root.children.indexOf(i);
    figma.root.insertChild(l + 1, o), await a.log("Created import dividers");
    const r = {
      startDividerId: i.id,
      endDividerId: o.id
    };
    return Z("createImportDividers", r);
  } catch (t) {
    return console.error("Error creating import dividers:", t), ce(
      "createImportDividers",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function Ua(e) {
  var t, n, i, o, l, r, m;
  try {
    await a.log("=== Starting Single Component Import ==="), await a.log("Creating start divider..."), await figma.loadAllPagesAsync();
    let f = figma.root.children.find(
      (s) => s.type === "PAGE" && s.getPluginData(ie) === ue
    );
    f || (f = figma.createPage(), f.name = yt, f.setPluginData(ie, ue), f.setPluginData(q, "true"), await a.log("Created start divider"));
    const u = [
      ...e.dependencies.filter(
        (s) => !s.useExisting
      ).map((s) => ({
        fileName: `${s.name}.json`,
        jsonData: s.jsonData
      })),
      {
        fileName: `${e.mainComponent.name}.json`,
        jsonData: e.mainComponent.jsonData
      }
    ];
    await a.log(
      `Importing ${u.length} file(s) in dependency order...`
    );
    const $ = await ut({
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
    if (!$.success)
      throw new Error(
        $.message || "Failed to import pages in order"
      );
    await figma.loadAllPagesAsync();
    const c = figma.root.children;
    let w = c.find(
      (s) => s.type === "PAGE" && s.getPluginData(ie) === he
    );
    if (!w) {
      w = figma.createPage(), w.name = bt, w.setPluginData(
        ie,
        he
      ), w.setPluginData(q, "true");
      let s = c.length;
      for (let d = c.length - 1; d >= 0; d--) {
        const b = c[d];
        if (b.type === "PAGE" && b.getPluginData(ie) !== ue && b.getPluginData(ie) !== he) {
          s = d + 1;
          break;
        }
      }
      figma.root.insertChild(s, w), await a.log("Created end divider");
    }
    await a.log(
      `Import result data structure: ${JSON.stringify(Object.keys($.data || {}))}`
    );
    const A = $.data;
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
    const P = "RecursicaPublishedMetadata", p = e.mainComponent.guid;
    await a.log(
      `Looking for main page by GUID: ${p.substring(0, 8)}...`
    );
    let v, C = null;
    for (const s of A.importedPages)
      try {
        const d = await figma.getNodeByIdAsync(
          s.pageId
        );
        if (d && d.type === "PAGE") {
          const b = d.getPluginData(P);
          if (b)
            try {
              if (JSON.parse(b).id === p) {
                v = s.pageId, C = d, await a.log(
                  `Found main page by GUID: "${d.name}" (ID: ${s.pageId.substring(0, 12)}...)`
                );
                break;
              }
            } catch (I) {
            }
        }
      } catch (d) {
        await a.warning(
          `Error checking page ${s.pageId}: ${d}`
        );
      }
    if (!v) {
      await a.log(
        "Main page not found in importedPages list, searching all pages by GUID..."
      ), await figma.loadAllPagesAsync();
      const s = figma.root.children;
      for (const d of s)
        if (d.type === "PAGE") {
          const b = d.getPluginData(P);
          if (b)
            try {
              if (JSON.parse(b).id === p) {
                v = d.id, C = d, await a.log(
                  `Found main page by GUID in all pages: "${d.name}" (ID: ${d.id.substring(0, 12)}...)`
                );
                break;
              }
            } catch (I) {
            }
        }
    }
    if (!v || !C) {
      await a.error(
        `Failed to find imported main page by GUID: ${p.substring(0, 8)}...`
      ), await a.log("Imported pages were:");
      for (const s of A.importedPages)
        await a.log(
          `  - "${s.name}" (ID: ${s.pageId.substring(0, 12)}...)`
        );
      throw new Error("Failed to find imported main page ID");
    }
    if (!C || C.type !== "PAGE")
      throw new Error("Failed to get main page node");
    for (const s of A.importedPages)
      try {
        const d = await figma.getNodeByIdAsync(
          s.pageId
        );
        if (d && d.type === "PAGE") {
          d.setPluginData(q, "true");
          const b = d.name.replace(/_\d+$/, "");
          if (!b.startsWith(le))
            d.name = `${le} ${b}`;
          else {
            const I = b.replace(le, "").trim();
            d.name = `${le} ${I}`;
          }
        }
      } catch (d) {
        await a.warning(
          `Failed to mark page ${s.pageId} as under review: ${d}`
        );
      }
    await figma.loadAllPagesAsync();
    const L = figma.root.children, x = L.find(
      (s) => s.type === "PAGE" && (s.name === "REMOTES" || s.name === `${le} REMOTES`)
    );
    x && (x.setPluginData(q, "true"), x.name.startsWith(le) || (x.name = `${le} REMOTES`), await a.log(
      "Marked REMOTES page as under review and ensured construction icon"
    ));
    const U = L.find(
      (s) => s.type === "PAGE" && s.getPluginData(ie) === ue
    ), M = L.find(
      (s) => s.type === "PAGE" && s.getPluginData(ie) === he
    );
    if (U && M) {
      const s = L.indexOf(U), d = L.indexOf(M);
      for (let b = s + 1; b < d; b++) {
        const I = L[b];
        I.type === "PAGE" && I.getPluginData(q) !== "true" && (I.setPluginData(q, "true"), await a.log(
          `Marked page "${I.name}" as under review (found between dividers)`
        ));
      }
    }
    const S = [], E = [];
    if (await a.log(
      `[EXTRACTION] Starting collection extraction. Collection IDs in result: ${((l = (o = A == null ? void 0 : A.createdEntities) == null ? void 0 : o.collectionIds) == null ? void 0 : l.length) || 0}`
    ), (r = A == null ? void 0 : A.createdEntities) != null && r.collectionIds) {
      await a.log(
        `[EXTRACTION] Collection IDs to process: ${A.createdEntities.collectionIds.map((s) => s.substring(0, 8) + "...").join(", ")}`
      );
      for (const s of A.createdEntities.collectionIds)
        try {
          const d = await figma.variables.getVariableCollectionByIdAsync(s);
          d ? (S.push({
            collectionId: d.id,
            collectionName: d.name
          }), await a.log(
            `[EXTRACTION] ✓ Extracted collection: "${d.name}" (${s.substring(0, 8)}...)`
          )) : await a.warning(
            `[EXTRACTION] Collection ${s.substring(0, 8)}... not found`
          );
        } catch (d) {
          await a.warning(
            `[EXTRACTION] Failed to get collection ${s.substring(0, 8)}...: ${d}`
          );
        }
    } else
      await a.warning(
        "[EXTRACTION] No collectionIds found in importResultData.createdEntities"
      );
    await a.log(
      `[EXTRACTION] Total collections extracted: ${S.length}`
    ), S.length > 0 && await a.log(
      `[EXTRACTION] Extracted collections: ${S.map((s) => `"${s.collectionName}" (${s.collectionId.substring(0, 8)}...)`).join(", ")}`
    );
    const O = new Set(
      S.map((s) => s.collectionId)
    );
    if ((m = A == null ? void 0 : A.createdEntities) != null && m.variableIds)
      for (const s of A.createdEntities.variableIds)
        try {
          const d = await figma.variables.getVariableByIdAsync(s);
          if (d && d.resolvedType && !O.has(d.variableCollectionId)) {
            const b = await figma.variables.getVariableCollectionByIdAsync(
              d.variableCollectionId
            );
            b && E.push({
              variableId: d.id,
              variableName: d.name,
              collectionId: d.variableCollectionId,
              collectionName: b.name
            });
          }
        } catch (d) {
          await a.warning(
            `Failed to get variable ${s}: ${d}`
          );
        }
    const V = {
      componentGuid: e.mainComponent.guid,
      componentVersion: e.mainComponent.version,
      componentName: e.mainComponent.name,
      importDate: (/* @__PURE__ */ new Date()).toISOString(),
      wizardSelections: e.wizardSelections,
      variableSummary: e.variableSummary,
      createdCollections: S,
      createdVariables: E,
      importError: void 0
      // No error yet
    };
    await a.log(
      `Storing metadata with ${S.length} collection(s) and ${E.length} variable(s)`
    ), C.setPluginData(
      ee,
      JSON.stringify(V)
    ), C.setPluginData(q, "true"), await a.log(
      "Stored primary import metadata on main page and marked as under review"
    );
    const R = [];
    A.importedPages && R.push(
      ...A.importedPages.map((s) => s.pageId)
    ), await a.log("=== Single Component Import Complete ==="), V.importError = void 0, await a.log(
      `[METADATA] About to store metadata with ${S.length} collection(s) and ${E.length} variable(s)`
    ), S.length > 0 && await a.log(
      `[METADATA] Collections to store: ${S.map((s) => `"${s.collectionName}" (${s.collectionId.substring(0, 8)}...)`).join(", ")}`
    ), C.setPluginData(
      ee,
      JSON.stringify(V)
    ), await a.log(
      `[METADATA] Stored metadata: ${S.length} collection(s), ${E.length} variable(s)`
    );
    const g = C.getPluginData(ee);
    if (g)
      try {
        const s = JSON.parse(g);
        await a.log(
          `[METADATA] Verification: Stored metadata has ${s.createdCollections.length} collection(s) and ${s.createdVariables.length} variable(s)`
        );
      } catch (s) {
        await a.warning(
          "[METADATA] Failed to verify stored metadata"
        );
      }
    const y = {
      success: !0,
      mainPageId: C.id,
      importedPageIds: R,
      createdCollections: S,
      createdVariables: E
    };
    return Z("importSingleComponentWithWizard", y);
  } catch (f) {
    const h = f instanceof Error ? f.message : "Unknown error occurred";
    await a.error(`Import failed: ${h}`);
    try {
      await figma.loadAllPagesAsync();
      const u = figma.root.children;
      let $ = null;
      for (const c of u) {
        if (c.type !== "PAGE") continue;
        const w = c.getPluginData(ee);
        if (w)
          try {
            if (JSON.parse(w).componentGuid === e.mainComponent.guid) {
              $ = c;
              break;
            }
          } catch (A) {
          }
      }
      if ($) {
        const c = $.getPluginData(ee);
        if (c)
          try {
            const w = JSON.parse(c);
            await a.log(
              `[CATCH] Found existing metadata with ${w.createdCollections.length} collection(s) and ${w.createdVariables.length} variable(s)`
            ), w.importError = h, $.setPluginData(
              ee,
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
        const c = [];
        for (const P of u) {
          if (P.type !== "PAGE") continue;
          P.getPluginData(q) === "true" && c.push(P);
        }
        const w = [];
        if (e.wizardSelections) {
          const P = await figma.variables.getLocalVariableCollectionsAsync(), p = [
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
          for (const { choice: v, normalizedName: C } of p)
            if (v === "new") {
              const L = P.filter((x) => te(x.name) === C);
              if (L.length > 0) {
                const x = L[0];
                w.push({
                  collectionId: x.id,
                  collectionName: x.name
                }), await a.log(
                  `Found created collection: "${x.name}" (${x.id.substring(0, 8)}...)`
                );
              }
            }
        }
        const A = [];
        if (c.length > 0) {
          const P = c[0], p = {
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
          P.setPluginData(
            ee,
            JSON.stringify(p)
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
    const n = t.getPluginData(ee);
    if (!n)
      throw new Error("Primary import metadata not found on page");
    const i = JSON.parse(n);
    await a.log(
      `Found metadata: ${i.createdCollections.length} collection(s), ${i.createdVariables.length} variable(s) to delete`
    ), await figma.loadAllPagesAsync();
    const o = figma.root.children, l = [];
    for (const c of o) {
      if (c.type !== "PAGE")
        continue;
      c.getPluginData(q) === "true" && (l.push(c), await a.log(
        `Found page to delete: "${c.name}" (under review)`
      ));
    }
    await a.log(
      `Deleting ${i.createdVariables.length} variable(s) from existing collections...`
    );
    let r = 0;
    for (const c of i.createdVariables)
      try {
        const w = await figma.variables.getVariableByIdAsync(
          c.variableId
        );
        w ? (w.remove(), r++, await a.log(
          `Deleted variable: ${c.variableName} from collection ${c.collectionName}`
        )) : await a.warning(
          `Variable ${c.variableName} (${c.variableId}) not found - may have already been deleted`
        );
      } catch (w) {
        await a.warning(
          `Failed to delete variable ${c.variableName}: ${w instanceof Error ? w.message : String(w)}`
        );
      }
    await a.log(
      `Deleting ${i.createdCollections.length} collection(s)...`
    );
    let m = 0;
    for (const c of i.createdCollections)
      try {
        const w = await figma.variables.getVariableCollectionByIdAsync(
          c.collectionId
        );
        w ? (w.remove(), m++, await a.log(
          `Deleted collection: ${c.collectionName} (${c.collectionId})`
        )) : await a.warning(
          `Collection ${c.collectionName} (${c.collectionId}) not found - may have already been deleted`
        );
      } catch (w) {
        await a.warning(
          `Failed to delete collection ${c.collectionName}: ${w instanceof Error ? w.message : String(w)}`
        );
      }
    const f = l.map((c) => ({
      page: c,
      name: c.name,
      id: c.id
    })), h = figma.currentPage;
    if (f.some(
      (c) => c.id === h.id
    )) {
      await figma.loadAllPagesAsync();
      const w = figma.root.children.find(
        (A) => A.type === "PAGE" && !f.some((P) => P.id === A.id)
      );
      w ? (await figma.setCurrentPageAsync(w), await a.log(
        `Switched away from page "${h.name}" before deletion`
      )) : await a.warning(
        "No safe page to switch to - all pages are being deleted"
      );
    }
    for (const { page: c, name: w } of f)
      try {
        let A = !1;
        try {
          await figma.loadAllPagesAsync(), A = figma.root.children.some((p) => p.id === c.id);
        } catch (P) {
          A = !1;
        }
        if (!A) {
          await a.log(`Page "${w}" already deleted, skipping`);
          continue;
        }
        if (figma.currentPage.id === c.id) {
          await figma.loadAllPagesAsync();
          const p = figma.root.children.find(
            (v) => v.type === "PAGE" && v.id !== c.id && !f.some((C) => C.id === v.id)
          );
          p && await figma.setCurrentPageAsync(p);
        }
        c.remove(), await a.log(`Deleted page: "${w}"`);
      } catch (A) {
        await a.warning(
          `Failed to delete page "${w}": ${A instanceof Error ? A.message : String(A)}`
        );
      }
    await a.log("=== Import Group Deletion Complete ===");
    const $ = {
      success: !0,
      deletedPages: l.length,
      deletedCollections: m,
      deletedVariables: r
    };
    return Z("deleteImportGroup", $);
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
      if (f.getPluginData(ee)) {
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
        (u) => u.type === "PAGE" && !i.some(($) => $.id === u.id)
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
          const $ = figma.root.children.find(
            (c) => c.type === "PAGE" && c.id !== h.id && !i.some((w) => w.id === c.id)
          );
          $ && await figma.setCurrentPageAsync($);
        }
        h.remove(), r++, await a.log(`Deleted page: "${f.name}"`);
      } catch (h) {
        await a.warning(
          `Failed to delete page "${f.name}" (${f.id.substring(0, 8)}...): ${h instanceof Error ? h.message : String(h)}`
        );
      }
    return await a.log("=== Failed Import Cleanup Complete ==="), Z("cleanupFailedImport", {
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
    t.setPluginData(ee, ""), t.setPluginData(q, "");
    const n = figma.root.children;
    for (const o of n)
      if (o.type === "PAGE" && o.getPluginData(q) === "true") {
        const r = o.getPluginData(ee);
        if (r)
          try {
            JSON.parse(r), o.setPluginData(q, "");
          } catch (m) {
            o.setPluginData(q, "");
          }
        else
          o.setPluginData(q, "");
      }
    return await a.log(
      "Cleared import metadata from page and related pages"
    ), Z("clearImportMetadata", {
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
        const P = We(A);
        if (!P.success || !P.expandedJsonData) {
          await a.warning(
            `Skipping ${w} - failed to expand JSON: ${P.error || "Unknown error"}`
          );
          continue;
        }
        const p = P.expandedJsonData;
        if (!p.collections)
          continue;
        const C = ve.fromTable(
          p.collections
        );
        if (!p.variables)
          continue;
        const x = Ee.fromTable(p.variables).getTable();
        for (const U of Object.values(x)) {
          if (U._colRef === void 0)
            continue;
          const M = C.getCollectionByIndex(
            U._colRef
          );
          if (M) {
            const E = te(
              M.collectionName
            ).toLowerCase();
            (E === "tokens" || E === "theme" || E === "layer") && t.push({
              name: U.variableName,
              collectionName: E
              // Use lowercase for consistency ("layer" not "layers")
            });
          }
        }
      } catch (P) {
        await a.warning(
          `Error processing ${w}: ${P instanceof Error ? P.message : String(P)}`
        );
        continue;
      }
    const n = await figma.variables.getLocalVariableCollectionsAsync();
    let i = null, o = null, l = null;
    for (const w of n) {
      const P = te(w.name).toLowerCase();
      (P === "tokens" || P === "token") && !i ? i = w : (P === "theme" || P === "themes") && !o ? o = w : (P === "layer" || P === "layers") && !l && (l = w);
    }
    const r = t.filter(
      (w) => w.collectionName === "tokens"
    ), m = t.filter((w) => w.collectionName === "theme"), f = t.filter((w) => w.collectionName === "layer"), h = {
      existing: 0,
      new: 0
    }, u = {
      existing: 0,
      new: 0
    }, $ = {
      existing: 0,
      new: 0
    };
    if (e.tokensCollection === "existing" && i) {
      const w = /* @__PURE__ */ new Set();
      for (const A of i.variableIds)
        try {
          const P = figma.variables.getVariableById(A);
          P && w.add(P.name);
        } catch (P) {
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
          const P = figma.variables.getVariableById(A);
          P && w.add(P.name);
        } catch (P) {
          continue;
        }
      for (const A of m)
        w.has(A.name) ? u.existing++ : u.new++;
    } else
      u.new = m.length;
    if (e.layersCollection === "existing" && l) {
      const w = /* @__PURE__ */ new Set();
      for (const A of l.variableIds)
        try {
          const P = figma.variables.getVariableById(A);
          P && w.add(P.name);
        } catch (P) {
          continue;
        }
      for (const A of f)
        w.has(A.name) ? $.existing++ : $.new++;
    } else
      $.new = f.length;
    return await a.log(
      `Variable summary: Tokens - ${h.existing} existing, ${h.new} new; Theme - ${u.existing} existing, ${u.new} new; Layers - ${$.existing} existing, ${$.new} new`
    ), Z("summarizeVariablesForWizard", {
      tokens: h,
      theme: u,
      layers: $
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
        const l = o.getSharedPluginData("recursica", t);
        return {
          id: o.id,
          name: o.name,
          guid: l || void 0
        };
      })
    };
    return Z(
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
        const l = await figma.variables.getVariableCollectionByIdAsync(o);
        if (l) {
          const r = l.getSharedPluginData(
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
      } catch (l) {
        await a.warning(
          `Failed to get GUID for collection ${o}: ${l instanceof Error ? l.message : String(l)}`
        ), n.push({
          collectionId: o,
          guid: null
        });
      }
    return Z(
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
    const n = t.getPluginData(ee);
    if (!n)
      throw new Error("Primary import metadata not found on page");
    const i = JSON.parse(n);
    await a.log(
      `Found metadata for component: ${i.componentName} (Version: ${i.componentVersion})`
    );
    let o = 0, l = 0;
    const r = "recursica:collectionId";
    for (const p of e.collectionChoices)
      if (p.choice === "merge")
        try {
          const v = await figma.variables.getVariableCollectionByIdAsync(
            p.newCollectionId
          );
          if (!v) {
            await a.warning(
              `New collection ${p.newCollectionId} not found, skipping merge`
            );
            continue;
          }
          let C = null;
          if (p.existingCollectionId)
            C = await figma.variables.getVariableCollectionByIdAsync(
              p.existingCollectionId
            );
          else {
            const E = v.getSharedPluginData(
              "recursica",
              r
            );
            if (E) {
              const O = await figma.variables.getLocalVariableCollectionsAsync();
              for (const V of O)
                if (V.getSharedPluginData(
                  "recursica",
                  r
                ) === E && V.id !== p.newCollectionId) {
                  C = V;
                  break;
                }
              if (!C && (E === ge.LAYER || E === ge.TOKENS || E === ge.THEME)) {
                let V;
                E === ge.LAYER ? V = se.LAYER : E === ge.TOKENS ? V = se.TOKENS : V = se.THEME;
                for (const R of O)
                  if (R.getSharedPluginData(
                    "recursica",
                    r
                  ) === E && R.name === V && R.id !== p.newCollectionId) {
                    C = R;
                    break;
                  }
                C || (C = figma.variables.createVariableCollection(V), C.setSharedPluginData(
                  "recursica",
                  r,
                  E
                ), await a.log(
                  `Created new standard collection: "${V}"`
                ));
              }
            }
          }
          if (!C) {
            await a.warning(
              "Could not find or create existing collection for merge, skipping"
            );
            continue;
          }
          await a.log(
            `Merging collection "${v.name}" (${p.newCollectionId.substring(0, 8)}...) into "${C.name}" (${C.id.substring(0, 8)}...)`
          );
          const L = v.variableIds.map(
            (E) => figma.variables.getVariableByIdAsync(E)
          ), x = await Promise.all(L), U = C.variableIds.map(
            (E) => figma.variables.getVariableByIdAsync(E)
          ), M = await Promise.all(U), S = new Set(
            M.filter((E) => E !== null).map((E) => E.name)
          );
          for (const E of x)
            if (E)
              try {
                if (S.has(E.name)) {
                  await a.warning(
                    `Variable "${E.name}" already exists in collection "${C.name}", skipping`
                  );
                  continue;
                }
                const O = figma.variables.createVariable(
                  E.name,
                  C,
                  E.resolvedType
                );
                for (const V of C.modes) {
                  const R = V.modeId;
                  let g = E.valuesByMode[R];
                  if (g === void 0 && v.modes.length > 0) {
                    const y = v.modes[0].modeId;
                    g = E.valuesByMode[y];
                  }
                  g !== void 0 && O.setValueForMode(R, g);
                }
                await a.log(
                  `  ✓ Copied variable "${E.name}" to collection "${C.name}"`
                );
              } catch (O) {
                await a.warning(
                  `Failed to copy variable "${E.name}": ${O instanceof Error ? O.message : String(O)}`
                );
              }
          v.remove(), o++, await a.log(
            `✓ Merged and deleted collection: ${v.name}`
          );
        } catch (v) {
          await a.warning(
            `Failed to merge collection: ${v instanceof Error ? v.message : String(v)}`
          );
        }
      else
        l++, await a.log(`Kept collection: ${p.newCollectionId}`);
    await a.log("Removing dividers...");
    const m = figma.root.children, f = [];
    for (const p of m) {
      if (p.type !== "PAGE") continue;
      const v = p.getPluginData(ie);
      (v === "start" || v === "end") && f.push(p);
    }
    const h = figma.currentPage;
    if (f.some((p) => p.id === h.id))
      if (t && t.id !== h.id)
        figma.currentPage = t;
      else {
        const p = m.find(
          (v) => v.type === "PAGE" && !f.some((C) => C.id === v.id)
        );
        p && (figma.currentPage = p);
      }
    const u = f.map((p) => p.name);
    for (const p of f)
      try {
        p.remove();
      } catch (v) {
        await a.warning(
          `Failed to delete divider: ${v instanceof Error ? v.message : String(v)}`
        );
      }
    for (const p of u)
      await a.log(`Deleted divider: ${p}`);
    await a.log("Removing construction icons and renaming pages..."), await figma.loadAllPagesAsync();
    const $ = figma.root.children;
    let c = 0;
    const w = "RecursicaPublishedMetadata", A = [];
    for (const p of $)
      if (p.type === "PAGE")
        try {
          if (p.getPluginData(q) === "true") {
            const C = p.getPluginData(w);
            let L = {};
            if (C)
              try {
                L = JSON.parse(C);
              } catch (x) {
              }
            A.push({
              pageId: p.id,
              pageName: p.name,
              pageMetadata: L
            });
          }
        } catch (v) {
          await a.warning(
            `Failed to process page: ${v instanceof Error ? v.message : String(v)}`
          );
        }
    for (const p of A)
      try {
        const v = await figma.getNodeByIdAsync(
          p.pageId
        );
        if (!v || v.type !== "PAGE") {
          await a.warning(
            `Page ${p.pageId} not found, skipping rename`
          );
          continue;
        }
        let C = v.name;
        if (C.startsWith(le) && (C = C.substring(le.length).trim()), C === "REMOTES" || C.includes("REMOTES")) {
          v.name = "REMOTES", c++, await a.log(`Renamed page: "${v.name}" -> "REMOTES"`);
          continue;
        }
        const x = p.pageMetadata.name && p.pageMetadata.name.length > 0 && !p.pageMetadata.name.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        ) ? p.pageMetadata.name : i.componentName || C, U = p.pageMetadata.version !== void 0 ? p.pageMetadata.version : i.componentVersion, M = `${x} (VERSION: ${U})`;
        v.name = M, c++, await a.log(`Renamed page: "${C}" -> "${M}"`);
      } catch (v) {
        await a.warning(
          `Failed to rename page ${p.pageId}: ${v instanceof Error ? v.message : String(v)}`
        );
      }
    if (await a.log("Clearing import metadata..."), t)
      try {
        t.setPluginData(ee, "");
      } catch (p) {
        await a.warning(
          `Failed to clear primary import metadata: ${p instanceof Error ? p.message : String(p)}`
        );
      }
    for (const p of A)
      try {
        const v = await figma.getNodeByIdAsync(
          p.pageId
        );
        v && v.type === "PAGE" && v.setPluginData(q, "");
      } catch (v) {
        await a.warning(
          `Failed to clear under review metadata for page ${p.pageId}: ${v instanceof Error ? v.message : String(v)}`
        );
      }
    const P = {
      mergedCollections: o,
      keptCollections: l,
      pagesRenamed: c
    };
    return await a.log(
      `=== Merge Complete ===
  Merged: ${o} collection(s)
  Kept: ${l} collection(s)
  Renamed: ${c} page(s)`
    ), Z(
      "mergeImportGroup",
      P
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
  loadPages: It,
  exportPage: De,
  importPage: dt,
  cleanupCreatedEntities: Pa,
  resolveDeferredNormalInstances: gt,
  determineImportOrder: ft,
  buildDependencyGraph: pt,
  resolveImportOrder: mt,
  importPagesInOrder: ut,
  quickCopy: Ca,
  storeAuthData: Ia,
  loadAuthData: Sa,
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
    const o = await i(t.data);
    figma.ui.postMessage(Q(J({}, o), {
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
