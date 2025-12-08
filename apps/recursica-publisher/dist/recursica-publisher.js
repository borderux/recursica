var wt = Object.defineProperty, $t = Object.defineProperties;
var Nt = Object.getOwnPropertyDescriptors;
var He = Object.getOwnPropertySymbols;
var vt = Object.prototype.hasOwnProperty, Et = Object.prototype.propertyIsEnumerable;
var Me = (e, t, n) => t in e ? wt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, j = (e, t) => {
  for (var n in t || (t = {}))
    vt.call(t, n) && Me(e, n, t[n]);
  if (He)
    for (var n of He(t))
      Et.call(t, n) && Me(e, n, t[n]);
  return e;
}, Z = (e, t) => $t(e, Nt(t));
var ee = (e, t, n) => Me(e, typeof t != "symbol" ? t + "" : t, n);
async function Pt(e) {
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
async function At(e) {
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
}, Y = Z(j({}, X), {
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
}), ne = Z(j({}, X), {
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
}), ge = Z(j({}, X), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), Ze = Z(j({}, X), {
  cornerRadius: 0
}), Ct = Z(j({}, X), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function It(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return Y;
    case "TEXT":
      return ne;
    case "VECTOR":
      return ge;
    case "LINE":
      return Ct;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return Ze;
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
const ke = {
  LAYER: "00000000-0000-0000-0000-000000000001",
  TOKENS: "00000000-0000-0000-0000-000000000002",
  THEME: "00000000-0000-0000-0000-000000000003"
}, oe = {
  LAYER: "Layer",
  TOKENS: "Tokens",
  THEME: "Theme"
};
function Q(e) {
  const t = e.trim(), n = t.toLowerCase();
  return n === "themes" ? oe.THEME : n === "token" ? oe.TOKENS : n === "layer" || n === "layers" ? oe.LAYER : n === "tokens" ? oe.TOKENS : n === "theme" ? oe.THEME : t;
}
function ce(e) {
  const t = Q(e);
  return t === oe.LAYER || t === oe.TOKENS || t === oe.THEME;
}
function Te(e) {
  const t = Q(e);
  if (t === oe.LAYER)
    return ke.LAYER;
  if (t === oe.TOKENS)
    return ke.TOKENS;
  if (t === oe.THEME)
    return ke.THEME;
}
class $e {
  constructor() {
    ee(this, "collectionMap");
    // collectionId -> index
    ee(this, "collections");
    // index -> collection data
    ee(this, "normalizedNameMap");
    // normalized name -> index (for standard collections)
    ee(this, "nextIndex");
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
    const i = Q(
      t.collectionName
    );
    if (ce(t.collectionName)) {
      const r = this.findCollectionByNormalizedName(i);
      if (r !== void 0) {
        const p = this.collections[r];
        return p.modes = this.mergeModes(
          p.modes,
          t.modes
        ), this.collectionMap.set(n, r), r;
      }
    }
    const o = this.nextIndex++;
    this.collectionMap.set(n, o);
    const l = Z(j({}, t), {
      collectionName: i
    });
    if (ce(t.collectionName)) {
      const r = Te(
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
      const i = this.collections[n], o = j({
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
    const n = new $e(), i = Object.entries(t).sort(
      (l, r) => parseInt(l[0], 10) - parseInt(r[0], 10)
    );
    for (const [l, r] of i) {
      const p = parseInt(l, 10), f = (o = r.isLocal) != null ? o : !0, h = Q(
        r.collectionName || ""
      ), y = r.collectionId || r.collectionGuid || `temp:${p}:${h}`, E = j({
        collectionName: h,
        collectionId: y,
        isLocal: f,
        modes: r.modes || []
      }, r.collectionGuid && {
        collectionGuid: r.collectionGuid
      });
      n.collectionMap.set(y, p), n.collections[p] = E, ce(h) && n.normalizedNameMap.set(h, p), n.nextIndex = Math.max(
        n.nextIndex,
        p + 1
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
const St = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, Tt = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function Ot(e) {
  var n;
  const t = e.toUpperCase();
  return (n = St[t]) != null ? n : e;
}
function xt(e) {
  var t;
  return typeof e == "number" ? (t = Tt[e]) != null ? t : e.toString() : e;
}
class Ne {
  constructor() {
    ee(this, "variableMap");
    // variableKey -> index
    ee(this, "variables");
    // index -> variable data
    ee(this, "nextIndex");
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
      ), l = j(j({
        variableName: i.variableName,
        variableType: Ot(i.variableType)
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
    const n = new Ne(), i = Object.entries(t).sort(
      (o, l) => parseInt(o[0], 10) - parseInt(l[0], 10)
    );
    for (const [o, l] of i) {
      const r = parseInt(o, 10), p = xt(l.variableType), f = Z(j({}, l), {
        variableType: p
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
function Vt(e) {
  return {
    _varRef: e
  };
}
function de(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let Rt = 0;
const we = /* @__PURE__ */ new Map();
function Mt(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const t = we.get(e.requestId);
  t && (we.delete(e.requestId), e.error || !e.guid ? t.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : t.resolve(e.guid));
}
function Fe() {
  return new Promise((e, t) => {
    const n = `guid_${Date.now()}_${++Rt}`;
    we.set(n, { resolve: e, reject: t }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: n
    }), setTimeout(() => {
      we.has(n) && (we.delete(n), t(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
async function Pe() {
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
    }), await Pe();
  },
  log: async (e) => {
    console.log(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    }), await Pe();
  },
  warning: async (e) => {
    console.warn(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    }), await Pe();
  },
  error: async (e) => {
    console.error(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    }), await Pe();
  }
};
function kt(e, t) {
  const n = t.modes.find((i) => i.modeId === e);
  return n ? n.name : e;
}
async function Qe(e, t, n, i, o = /* @__PURE__ */ new Set()) {
  const l = {};
  for (const [r, p] of Object.entries(e)) {
    const f = kt(r, i);
    if (p == null) {
      l[f] = p;
      continue;
    }
    if (typeof p == "string" || typeof p == "number" || typeof p == "boolean") {
      l[f] = p;
      continue;
    }
    if (typeof p == "object" && p !== null && "type" in p && p.type === "VARIABLE_ALIAS" && "id" in p) {
      const h = p.id;
      if (o.has(h)) {
        l[f] = {
          type: "VARIABLE_ALIAS",
          id: h
        };
        continue;
      }
      const y = await figma.variables.getVariableByIdAsync(h);
      if (!y) {
        l[f] = {
          type: "VARIABLE_ALIAS",
          id: h
        };
        continue;
      }
      const E = new Set(o);
      E.add(h);
      const s = await figma.variables.getVariableCollectionByIdAsync(
        y.variableCollectionId
      ), v = y.key;
      if (!v) {
        l[f] = {
          type: "VARIABLE_ALIAS",
          id: h
        };
        continue;
      }
      const $ = {
        variableName: y.name,
        variableType: y.resolvedType,
        collectionName: s == null ? void 0 : s.name,
        collectionId: y.variableCollectionId,
        variableKey: v,
        id: h,
        isLocal: !y.remote
      };
      if (s) {
        const m = await et(
          s,
          n
        );
        $._colRef = m, y.valuesByMode && ($.valuesByMode = await Qe(
          y.valuesByMode,
          t,
          n,
          s,
          // Pass collection for mode ID to name conversion
          E
        ));
      }
      const w = t.addVariable($);
      l[f] = {
        type: "VARIABLE_ALIAS",
        id: h,
        _varRef: w
      };
    } else
      l[f] = p;
  }
  return l;
}
const Ae = "recursica:collectionId";
async function _t(e) {
  if (e.remote === !0) {
    const n = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(n)) {
      const o = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await a.error(o), new Error(o);
    }
    return e.id;
  } else {
    if (ce(e.name)) {
      const o = Te(e.name);
      if (o) {
        const l = e.getSharedPluginData(
          "recursica",
          Ae
        );
        return (!l || l.trim() === "") && e.setSharedPluginData(
          "recursica",
          Ae,
          o
        ), o;
      }
    }
    const n = e.getSharedPluginData(
      "recursica",
      Ae
    );
    if (n && n.trim() !== "")
      return n;
    const i = await Fe();
    return e.setSharedPluginData("recursica", Ae, i), i;
  }
}
function Lt(e, t) {
  if (t)
    return;
  const n = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(n))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function et(e, t) {
  const n = !e.remote, i = t.getCollectionIndex(e.id);
  if (i !== -1)
    return i;
  Lt(e.name, n);
  const o = await _t(e), l = e.modes.map((h) => h.name), r = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: n,
    modes: l,
    collectionGuid: o
  }, p = t.addCollection(r), f = n ? "local" : "remote";
  return await a.log(
    `  Added ${f} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), p;
}
async function Le(e, t, n) {
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
    const r = await et(
      o,
      n
    ), p = {
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
    i.valuesByMode && (p.valuesByMode = await Qe(
      i.valuesByMode,
      t,
      n,
      o,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const f = t.addVariable(p);
    return Vt(f);
  } catch (i) {
    const o = i instanceof Error ? i.message : String(i);
    throw console.error("Could not resolve variable alias:", e.id, i), new Error(
      `Failed to resolve variable alias ${e.id}: ${o}`
    );
  }
}
async function ue(e, t, n) {
  if (!e || typeof e != "object") return e;
  const i = {};
  for (const o in e)
    if (Object.prototype.hasOwnProperty.call(e, o)) {
      const l = e[o];
      if (l && typeof l == "object" && !Array.isArray(l))
        if (l.type === "VARIABLE_ALIAS") {
          const r = await Le(
            l,
            t,
            n
          );
          r && (i[o] = r);
        } else
          i[o] = await ue(
            l,
            t,
            n
          );
      else Array.isArray(l) ? i[o] = await Promise.all(
        l.map(async (r) => (r == null ? void 0 : r.type) === "VARIABLE_ALIAS" ? await Le(
          r,
          t,
          n
        ) || r : r && typeof r == "object" ? await ue(
          r,
          t,
          n
        ) : r)
      ) : i[o] = l;
    }
  return i;
}
async function tt(e, t, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const o = {};
      for (const l in i)
        Object.prototype.hasOwnProperty.call(i, l) && (l === "boundVariables" ? o[l] = await ue(
          i[l],
          t,
          n
        ) : o[l] = i[l]);
      return o;
    })
  );
}
async function at(e, t, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const o = {};
      for (const l in i)
        Object.prototype.hasOwnProperty.call(i, l) && (l === "boundVariables" ? o[l] = await ue(
          i[l],
          t,
          n
        ) : o[l] = i[l]);
      return o;
    })
  );
}
const be = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  extractBoundVariables: ue,
  resolveVariableAliasMetadata: Le,
  serializeBackgrounds: at,
  serializeFills: tt
}, Symbol.toStringTag, { value: "Module" }));
async function nt(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  if (e.type && (n.type = e.type, i.add("type")), e.id && (n.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (n.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (n.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (n.y = e.y, i.add("y")), e.width !== void 0 && (n.width = e.width, i.add("width")), e.height !== void 0 && (n.height = e.height, i.add("height")), e.visible !== void 0 && z(e.visible, X.visible) && (n.visible = e.visible, i.add("visible")), e.locked !== void 0 && z(e.locked, X.locked) && (n.locked = e.locked, i.add("locked")), e.opacity !== void 0 && z(e.opacity, X.opacity) && (n.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && z(e.rotation, X.rotation) && (n.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && z(e.blendMode, X.blendMode) && (n.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && z(e.effects, X.effects) && (n.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const o = await tt(
      e.fills,
      t.variableTable,
      t.collectionTable
    );
    z(o, X.fills) && (n.fills = o), i.add("fills");
  }
  if (e.strokes !== void 0 && z(e.strokes, X.strokes) && (n.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && z(e.strokeWeight, X.strokeWeight) && (n.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && z(e.strokeAlign, X.strokeAlign) && (n.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const o = await ue(
      e.boundVariables,
      t.variableTable,
      t.collectionTable
    );
    Object.keys(o).length > 0 && (n.boundVariables = o), i.add("boundVariables");
  }
  if (e.backgrounds !== void 0) {
    const o = await at(
      e.backgrounds,
      t.variableTable,
      t.collectionTable
    );
    o && Array.isArray(o) && o.length > 0 && (n.backgrounds = o), i.add("backgrounds");
  }
  return n;
}
const Gt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseBaseNodeProperties: nt
}, Symbol.toStringTag, { value: "Module" }));
async function Ge(e, t) {
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
  ) && (n.counterAxisAlignItems = e.counterAxisAlignItems, i.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && z(e.paddingLeft, Y.paddingLeft) && (n.paddingLeft = e.paddingLeft, i.add("paddingLeft")), e.paddingRight !== void 0 && z(e.paddingRight, Y.paddingRight) && (n.paddingRight = e.paddingRight, i.add("paddingRight")), e.paddingTop !== void 0 && z(e.paddingTop, Y.paddingTop) && (n.paddingTop = e.paddingTop, i.add("paddingTop")), e.paddingBottom !== void 0 && z(e.paddingBottom, Y.paddingBottom) && (n.paddingBottom = e.paddingBottom, i.add("paddingBottom")), e.itemSpacing !== void 0 && z(e.itemSpacing, Y.itemSpacing) && (n.itemSpacing = e.itemSpacing, i.add("itemSpacing")), e.cornerRadius !== void 0 && z(e.cornerRadius, Y.cornerRadius) && (n.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.clipsContent !== void 0 && z(e.clipsContent, Y.clipsContent) && (n.clipsContent = e.clipsContent, i.add("clipsContent")), e.layoutWrap !== void 0 && z(e.layoutWrap, Y.layoutWrap) && (n.layoutWrap = e.layoutWrap, i.add("layoutWrap")), e.layoutGrow !== void 0 && z(e.layoutGrow, Y.layoutGrow) && (n.layoutGrow = e.layoutGrow, i.add("layoutGrow")), n;
}
const Ut = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseFrameProperties: Ge
}, Symbol.toStringTag, { value: "Module" }));
async function Bt(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (n.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (n.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (n.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && z(
    e.textAlignHorizontal,
    ne.textAlignHorizontal
  ) && (n.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && z(
    e.textAlignVertical,
    ne.textAlignVertical
  ) && (n.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && z(e.letterSpacing, ne.letterSpacing) && (n.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && z(e.lineHeight, ne.lineHeight) && (n.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && z(e.textCase, ne.textCase) && (n.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && z(e.textDecoration, ne.textDecoration) && (n.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && z(e.textAutoResize, ne.textAutoResize) && (n.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && z(
    e.paragraphSpacing,
    ne.paragraphSpacing
  ) && (n.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && z(e.paragraphIndent, ne.paragraphIndent) && (n.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && z(e.listOptions, ne.listOptions) && (n.listOptions = e.listOptions, i.add("listOptions")), n;
}
function zt(e) {
  const t = e.match(/^(\d+\.?\d*)[eE]([+-]?\d+)$/);
  if (t) {
    const n = parseFloat(t[1]), i = parseInt(t[2]), o = n * Math.pow(10, i);
    return Math.abs(o) < 1e-10 ? "0" : o.toFixed(6).replace(/\.?0+$/, "") || "0";
  }
  return e;
}
function it(e) {
  if (!e || typeof e != "string")
    return e;
  let t = e.replace(/(\d+\.?\d*)[eE]([+-]?\d+)/g, (n) => zt(n));
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
    data: it(t.data),
    // Normalize winding rule key (use windRule consistently)
    windRule: t.windRule || t.windingRule || "NONZERO"
  })) : e;
}
const Ft = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  normalizeSvgPath: it,
  normalizeVectorGeometry: Ue
}, Symbol.toStringTag, { value: "Module" }));
async function jt(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && z(e.fillGeometry, ge.fillGeometry) && (n.fillGeometry = Ue(e.fillGeometry), i.add("fillGeometry")), e.strokeGeometry !== void 0 && z(e.strokeGeometry, ge.strokeGeometry) && (n.strokeGeometry = Ue(e.strokeGeometry), i.add("strokeGeometry")), e.strokeCap !== void 0 && z(e.strokeCap, ge.strokeCap) && (n.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && z(e.strokeJoin, ge.strokeJoin) && (n.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && z(e.dashPattern, ge.dashPattern) && (n.dashPattern = e.dashPattern, i.add("dashPattern")), n;
}
async function Dt(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && z(e.cornerRadius, Ze.cornerRadius) && (n.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (n.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, i.add("pointCount")), n;
}
const Ce = /* @__PURE__ */ new Map();
let Jt = 0;
function Wt() {
  return `prompt_${Date.now()}_${++Jt}`;
}
const he = {
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
    const n = typeof t == "number" ? { timeoutMs: t } : t, i = (p = n == null ? void 0 : n.timeoutMs) != null ? p : 3e5, o = n == null ? void 0 : n.okLabel, l = n == null ? void 0 : n.cancelLabel, r = Wt();
    return new Promise((f, h) => {
      const y = i === -1 ? null : setTimeout(() => {
        Ce.delete(r), h(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      Ce.set(r, {
        resolve: f,
        reject: h,
        timeout: y
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: j(j({
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
    const { requestId: t, action: n } = e, i = Ce.get(t);
    if (!i) {
      console.warn(
        `Received response for unknown prompt request: ${t}`
      );
      return;
    }
    i.timeout && clearTimeout(i.timeout), Ce.delete(t), n === "ok" ? i.resolve() : i.reject(new Error("User cancelled"));
  }
}, Kt = "RecursicaPublishedMetadata";
function _e(e) {
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
function qe(e) {
  try {
    const t = e.getPluginData(Kt);
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
async function Ht(e, t) {
  var o, l;
  const n = {}, i = /* @__PURE__ */ new Set();
  if (n._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const r = await e.getMainComponentAsync();
    if (!r) {
      const P = e.name || "(unnamed)", A = e.id;
      if (t.detachedComponentsHandled.has(A))
        await a.log(
          `Treating detached instance "${P}" as internal instance (already prompted)`
        );
      else {
        await a.warning(
          `Found detached instance: "${P}" (main component is missing)`
        );
        const c = `Found detached instance "${P}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await he.prompt(c, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(A), await a.log(
            `Treating detached instance "${P}" as internal instance`
          );
        } catch (g) {
          if (g instanceof Error && g.message === "User cancelled") {
            const b = `Export cancelled: Detached instance "${P}" found. Please fix the instance before exporting.`;
            await a.error(b);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch (I) {
              console.warn("Could not scroll to instance:", I);
            }
            throw new Error(b);
          } else
            throw g;
        }
      }
      if (!_e(e).page) {
        const c = `Detached instance "${P}" is not on any page. Cannot export.`;
        throw await a.error(c), new Error(c);
      }
      let V, L;
      try {
        e.variantProperties && (V = e.variantProperties), e.componentProperties && (L = e.componentProperties);
      } catch (c) {
      }
      const d = j(j({
        instanceType: "internal",
        componentName: P,
        componentNodeId: e.id
      }, V && { variantProperties: V }), L && { componentProperties: L }), u = t.instanceTable.addInstance(d);
      return n._instanceRef = u, i.add("_instanceRef"), await a.log(
        `  Exported detached INSTANCE: "${P}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), n;
    }
    const p = e.name || "(unnamed)", f = r.name || "(unnamed)", h = r.remote === !0, E = _e(e).page, s = _e(r), v = s.page;
    let $, w = v;
    if (h)
      if (v) {
        const P = qe(v);
        P != null && P.id ? ($ = "normal", w = v, await a.log(
          `  Component "${f}" is from library but also exists on local page "${v.name}" with metadata. Treating as "normal" instance.`
        )) : ($ = "remote", await a.log(
          `  Component "${f}" is from library and exists on local page "${v.name}" but has no metadata. Treating as "remote" instance.`
        ));
      } else
        $ = "remote", await a.log(
          `  Component "${f}" is from library and not on a local page. Treating as "remote" instance.`
        );
    else if (v && E && v.id === E.id)
      $ = "internal";
    else if (v && E && v.id !== E.id)
      $ = "normal";
    else if (v && !E)
      $ = "normal";
    else if (!h && s.reason === "detached") {
      const P = r.id;
      if (t.detachedComponentsHandled.has(P))
        $ = "remote", await a.log(
          `Treating detached instance "${p}" -> component "${f}" as remote instance (already prompted)`
        );
      else {
        await a.warning(
          `Found detached instance: "${p}" -> component "${f}" (component is not on any page)`
        );
        try {
          await figma.viewport.scrollAndZoomIntoView([r]);
        } catch (C) {
          console.warn("Could not scroll to component:", C);
        }
        const A = `Found detached instance "${p}" attached to component "${f}". This should be fixed. Continue to publish?`;
        try {
          await he.prompt(A, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(P), $ = "remote", await a.log(
            `Treating detached instance "${p}" as remote instance (will be created on REMOTES page)`
          );
        } catch (C) {
          if (C instanceof Error && C.message === "User cancelled") {
            const T = `Export cancelled: Detached instance "${p}" found. The component "${f}" is not on any page. Please fix the instance before exporting.`;
            throw await a.error(T), new Error(T);
          } else
            throw C;
        }
      }
    } else
      h || await a.warning(
        `  Instance "${p}" -> component "${f}": componentPage is null but component is not remote. Reason: ${s.reason}. Cannot determine instance type.`
      ), $ = "normal";
    let m, R;
    try {
      if (e.variantProperties && (m = e.variantProperties, await a.log(
        `  Instance "${p}" -> variantProperties from instance: ${JSON.stringify(m)}`
      )), typeof e.getProperties == "function")
        try {
          const P = await e.getProperties();
          P && P.variantProperties && (await a.log(
            `  Instance "${p}" -> variantProperties from getProperties(): ${JSON.stringify(P.variantProperties)}`
          ), P.variantProperties && Object.keys(P.variantProperties).length > 0 && (m = P.variantProperties));
        } catch (P) {
          await a.log(
            `  Instance "${p}" -> getProperties() not available or failed: ${P}`
          );
        }
      if (e.componentProperties && (R = e.componentProperties), r.parent && r.parent.type === "COMPONENT_SET") {
        const P = r.parent;
        try {
          const A = P.componentPropertyDefinitions;
          A && await a.log(
            `  Component set "${P.name}" has property definitions: ${JSON.stringify(Object.keys(A))}`
          );
          const C = {}, T = f.split(",").map((V) => V.trim());
          for (const V of T) {
            const L = V.split("=").map((d) => d.trim());
            if (L.length >= 2) {
              const d = L[0], u = L.slice(1).join("=").trim();
              A && A[d] && (C[d] = u);
            }
          }
          if (Object.keys(C).length > 0 && await a.log(
            `  Parsed variant properties from component name "${f}": ${JSON.stringify(C)}`
          ), m && Object.keys(m).length > 0)
            await a.log(
              `  Using variant properties from instance (source of truth): ${JSON.stringify(m)}`
            );
          else if (Object.keys(C).length > 0)
            m = C, await a.log(
              `  Using variant properties from component name (fallback): ${JSON.stringify(m)}`
            );
          else if (r.variantProperties) {
            const V = r.variantProperties;
            await a.log(
              `  Main component "${f}" has variantProperties: ${JSON.stringify(V)}`
            ), m = V;
          }
        } catch (A) {
          await a.warning(
            `  Could not get variant properties from component set: ${A}`
          );
        }
      }
    } catch (P) {
    }
    let k, B;
    try {
      let P = r.parent;
      const A = [];
      let C = 0;
      const T = 20;
      for (; P && C < T; )
        try {
          const V = P.type, L = P.name;
          if (V === "COMPONENT_SET" && !B && (B = L), V === "PAGE")
            break;
          const d = L || "";
          A.unshift(d), P = P.parent, C++;
        } catch (V) {
          break;
        }
      k = A;
    } catch (P) {
    }
    const O = j(j(j(j({
      instanceType: $,
      componentName: f
    }, B && { componentSetName: B }), m && { variantProperties: m }), R && { componentProperties: R }), $ === "normal" ? { path: k || [] } : k && k.length > 0 && {
      path: k
    });
    if ($ === "internal") {
      O.componentNodeId = r.id, await a.log(
        `  Found INSTANCE: "${p}" -> INTERNAL component "${f}" (ID: ${r.id.substring(0, 8)}...)`
      );
      const P = e.boundVariables, A = r.boundVariables;
      if (P && typeof P == "object") {
        const d = Object.keys(P);
        await a.log(
          `  DEBUG: Internal instance "${p}" -> boundVariables keys: ${d.length > 0 ? d.join(", ") : "none"}`
        );
        for (const c of d) {
          const g = P[c], b = (g == null ? void 0 : g.type) || typeof g;
          await a.log(
            `  DEBUG:   boundVariables.${c}: type=${b}, value=${JSON.stringify(g)}`
          );
        }
        const u = [
          "backgrounds",
          "selectionColor",
          "selectionColors",
          "selection",
          "selectColor"
        ];
        for (const c of u)
          P[c] !== void 0 && await a.log(
            `  DEBUG:   Found potential "Selection colors" property: boundVariables.${c} = ${JSON.stringify(P[c])}`
          );
      } else
        await a.log(
          `  DEBUG: Internal instance "${p}" -> No boundVariables found on instance node`
        );
      if (A && typeof A == "object") {
        const d = Object.keys(A);
        await a.log(
          `  DEBUG: Main component "${f}" -> boundVariables keys: ${d.length > 0 ? d.join(", ") : "none"}`
        );
      }
      const C = e.backgrounds;
      if (C && Array.isArray(C)) {
        await a.log(
          `  DEBUG: Internal instance "${p}" -> backgrounds array length: ${C.length}`
        );
        for (let d = 0; d < C.length; d++) {
          const u = C[d];
          if (u && typeof u == "object") {
            if (await a.log(
              `  DEBUG:   backgrounds[${d}] structure: ${JSON.stringify(Object.keys(u))}`
            ), u.boundVariables) {
              const c = Object.keys(u.boundVariables);
              await a.log(
                `  DEBUG:   backgrounds[${d}].boundVariables keys: ${c.length > 0 ? c.join(", ") : "none"}`
              );
              for (const g of c) {
                const b = u.boundVariables[g];
                await a.log(
                  `  DEBUG:     backgrounds[${d}].boundVariables.${g}: ${JSON.stringify(b)}`
                );
              }
            }
            u.color && await a.log(
              `  DEBUG:   backgrounds[${d}].color: ${JSON.stringify(u.color)}`
            );
          }
        }
      }
      const T = Object.keys(e).filter(
        (d) => !d.startsWith("_") && d !== "parent" && d !== "removed" && typeof e[d] != "function" && d !== "type" && d !== "id" && d !== "name" && d !== "boundVariables" && d !== "backgrounds" && d !== "fills"
      ), V = Object.keys(r).filter(
        (d) => !d.startsWith("_") && d !== "parent" && d !== "removed" && typeof r[d] != "function" && d !== "type" && d !== "id" && d !== "name" && d !== "boundVariables" && d !== "backgrounds" && d !== "fills"
      ), L = [
        .../* @__PURE__ */ new Set([...T, ...V])
      ].filter(
        (d) => d.toLowerCase().includes("selection") || d.toLowerCase().includes("select") || d.toLowerCase().includes("color") && !d.toLowerCase().includes("fill") && !d.toLowerCase().includes("stroke")
      );
      if (L.length > 0) {
        await a.log(
          `  DEBUG: Found selection/color-related properties: ${L.join(", ")}`
        );
        for (const d of L)
          try {
            if (T.includes(d)) {
              const u = e[d];
              await a.log(
                `  DEBUG:   Instance.${d}: ${JSON.stringify(u)}`
              );
            }
            if (V.includes(d)) {
              const u = r[d];
              await a.log(
                `  DEBUG:   MainComponent.${d}: ${JSON.stringify(u)}`
              );
            }
          } catch (u) {
          }
      } else
        await a.log(
          "  DEBUG: No selection/color-related properties found on instance or main component"
        );
    } else if ($ === "normal") {
      const P = w || v;
      if (P) {
        O.componentPageName = P.name;
        const C = qe(P);
        C != null && C.id && C.version !== void 0 ? (O.componentGuid = C.id, O.componentVersion = C.version, await a.log(
          `  Found INSTANCE: "${p}" -> NORMAL component "${f}" (ID: ${r.id.substring(0, 8)}...) at path [${(k || []).join(" → ")}]`
        )) : await a.warning(
          `  Instance "${p}" -> component "${f}" is classified as normal but page "${P.name}" has no metadata. This instance will not be importable.`
        );
      } else {
        const C = r.id;
        let T = "", V = "";
        switch (s.reason) {
          case "broken_chain":
            T = "The component's parent chain is broken and cannot be traversed to find the page", V = "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            T = "Cannot access the component's parent chain (access error)", V = "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            T = "Cannot determine which page the component is on", V = "Please ensure the component is properly placed on a page.";
        }
        try {
          await figma.viewport.scrollAndZoomIntoView([r]);
        } catch (u) {
          console.warn("Could not scroll to component:", u);
        }
        const L = `Normal instance "${p}" -> component "${f}" (ID: ${C}) has no componentPage. ${T}. ${V} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", L), await a.error(L);
        const d = new Error(L);
        throw console.error("Throwing error:", d), d;
      }
      k === void 0 && console.warn(
        `Failed to build path for normal instance "${p}" -> component "${f}". Path is required for resolution.`
      );
      const A = k && k.length > 0 ? ` at path [${k.join(" → ")}]` : " at page root";
      await a.log(
        `  Found INSTANCE: "${p}" -> NORMAL component "${f}" (ID: ${r.id.substring(0, 8)}...)${A}`
      );
    } else if ($ === "remote") {
      let P, A;
      const C = t.detachedComponentsHandled.has(
        r.id
      );
      if (!C)
        try {
          if (typeof r.getPublishStatusAsync == "function")
            try {
              const V = await r.getPublishStatusAsync();
              V && typeof V == "object" && (V.libraryName && (P = V.libraryName), V.libraryKey && (A = V.libraryKey));
            } catch (V) {
            }
          try {
            const V = figma.teamLibrary;
            if (typeof (V == null ? void 0 : V.getAvailableLibraryComponentSetsAsync) == "function") {
              const L = await V.getAvailableLibraryComponentSetsAsync();
              if (L && Array.isArray(L)) {
                for (const d of L)
                  if (d.key === r.key || d.name === r.name) {
                    d.libraryName && (P = d.libraryName), d.libraryKey && (A = d.libraryKey);
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
      if (P && (O.remoteLibraryName = P), A && (O.remoteLibraryKey = A), C && (O.componentNodeId = r.id), t.instanceTable.getInstanceIndex(O) !== -1)
        await a.log(
          `  Found INSTANCE: "${p}" -> REMOTE component "${f}" (ID: ${r.id.substring(0, 8)}...)${C ? " [DETACHED]" : ""}`
        );
      else
        try {
          const { parseBaseNodeProperties: V } = await Promise.resolve().then(() => Gt), L = await V(e, t), { parseFrameProperties: d } = await Promise.resolve().then(() => Ut), u = await d(e, t), c = Z(j(j({}, L), u), {
            type: "COMPONENT"
            // Convert to COMPONENT type for recreation (must be after baseProps to override)
          });
          if (e.children && Array.isArray(e.children) && e.children.length > 0) {
            const g = Z(j({}, t), {
              depth: (t.depth || 0) + 1
            }), { extractNodeData: b } = await Promise.resolve().then(() => Qt), I = [];
            for (const N of e.children)
              try {
                let S;
                if (N.type === "INSTANCE")
                  try {
                    const M = await N.getMainComponentAsync();
                    if (M) {
                      const x = await V(
                        N,
                        t
                      ), U = await d(
                        N,
                        t
                      ), W = await b(
                        M,
                        /* @__PURE__ */ new WeakSet(),
                        g
                      );
                      S = Z(j(j(j({}, W), x), U), {
                        type: "COMPONENT"
                        // Convert to COMPONENT
                      });
                    } else
                      S = await b(
                        N,
                        /* @__PURE__ */ new WeakSet(),
                        g
                      ), S.type === "INSTANCE" && (S.type = "COMPONENT"), delete S._instanceRef;
                  } catch (M) {
                    S = await b(
                      N,
                      /* @__PURE__ */ new WeakSet(),
                      g
                    ), S.type === "INSTANCE" && (S.type = "COMPONENT"), delete S._instanceRef;
                  }
                else {
                  S = await b(
                    N,
                    /* @__PURE__ */ new WeakSet(),
                    g
                  );
                  const M = N.boundVariables;
                  if (M && typeof M == "object") {
                    const x = Object.keys(M);
                    x.length > 0 && (await a.log(
                      `  DEBUG: Child "${N.name || "Unnamed"}" -> boundVariables keys: ${x.join(", ")}`
                    ), M.backgrounds !== void 0 && await a.log(
                      `  DEBUG:   Child "${N.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(M.backgrounds)}`
                    ));
                  }
                  if (r.children && Array.isArray(r.children)) {
                    const x = r.children.find(
                      (U) => U.name === N.name
                    );
                    if (x) {
                      const U = x.boundVariables;
                      if (U && typeof U == "object") {
                        const W = Object.keys(U);
                        if (W.length > 0 && (await a.log(
                          `  DEBUG: Main component child "${x.name || "Unnamed"}" -> boundVariables keys: ${W.join(", ")}`
                        ), U.backgrounds !== void 0 && (await a.log(
                          `  DEBUG:   Main component child "${x.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(U.backgrounds)}`
                        ), !M || !M.backgrounds))) {
                          await a.log(
                            "  DEBUG:   Instance child doesn't have boundVariables.backgrounds, but main component child does - preserving from main component"
                          );
                          const { extractBoundVariables: K } = await Promise.resolve().then(() => be), D = await K(
                            U,
                            t.variableTable,
                            t.collectionTable
                          );
                          S.boundVariables || (S.boundVariables = {}), D.backgrounds && (S.boundVariables.backgrounds = D.backgrounds, await a.log(
                            "  DEBUG:   ✓ Added boundVariables.backgrounds to childData from main component child"
                          ));
                        }
                      }
                    }
                  }
                }
                I.push(S);
              } catch (S) {
                console.warn(
                  `Failed to extract child "${N.name || "Unnamed"}" for remote component "${f}":`,
                  S
                );
              }
            c.children = I;
          }
          if (!c)
            throw new Error("Failed to build structure for remote instance");
          try {
            const g = e.boundVariables;
            if (g && typeof g == "object") {
              const _ = Object.keys(g);
              await a.log(
                `  DEBUG: Instance "${p}" -> boundVariables keys: ${_.length > 0 ? _.join(", ") : "none"}`
              );
              for (const J of _) {
                const H = g[J], bt = (H == null ? void 0 : H.type) || typeof H;
                if (await a.log(
                  `  DEBUG:   boundVariables.${J}: type=${bt}, value=${JSON.stringify(H)}`
                ), H && typeof H == "object" && !Array.isArray(H)) {
                  const Re = Object.keys(H);
                  if (Re.length > 0) {
                    await a.log(
                      `  DEBUG:     boundVariables.${J} has nested keys: ${Re.join(", ")}`
                    );
                    for (const Ke of Re) {
                      const Ee = H[Ke];
                      Ee && typeof Ee == "object" && Ee.type === "VARIABLE_ALIAS" && await a.log(
                        `  DEBUG:       boundVariables.${J}.${Ke}: VARIABLE_ALIAS id=${Ee.id}`
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
              for (const J of F)
                g[J] !== void 0 && await a.log(
                  `  DEBUG:   Found potential "Selection colors" property: boundVariables.${J} = ${JSON.stringify(g[J])}`
                );
            } else
              await a.log(
                `  DEBUG: Instance "${p}" -> No boundVariables found on instance node`
              );
            const b = g && g.fills !== void 0 && g.fills !== null, I = c.fills !== void 0 && Array.isArray(c.fills) && c.fills.length > 0, N = e.fills !== void 0 && Array.isArray(e.fills) && e.fills.length > 0, S = r.fills !== void 0 && Array.isArray(r.fills) && r.fills.length > 0;
            if (await a.log(
              `  DEBUG: Instance "${p}" -> fills check: instanceHasFills=${N}, structureHasFills=${I}, mainComponentHasFills=${S}, hasInstanceFillsBoundVar=${!!b}`
            ), b && !I) {
              await a.log(
                "  DEBUG: Instance has boundVariables.fills but structure has no fills - attempting to get fills"
              );
              try {
                if (N) {
                  const { serializeFills: _ } = await Promise.resolve().then(() => be), F = await _(
                    e.fills,
                    t.variableTable,
                    t.collectionTable
                  );
                  c.fills = F, await a.log(
                    `  DEBUG: Got ${F.length} fill(s) from instance node`
                  );
                } else if (S) {
                  const { serializeFills: _ } = await Promise.resolve().then(() => be), F = await _(
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
              } catch (_) {
                await a.warning(
                  `  Failed to get fills: ${_}`
                );
              }
            }
            const M = e.selectionColor, x = r.selectionColor;
            M !== void 0 && await a.log(
              `  DEBUG: Instance "${p}" -> selectionColor: ${JSON.stringify(M)}`
            ), x !== void 0 && await a.log(
              `  DEBUG: Main component "${f}" -> selectionColor: ${JSON.stringify(x)}`
            );
            const U = Object.keys(e).filter(
              (_) => !_.startsWith("_") && _ !== "parent" && _ !== "removed" && typeof e[_] != "function" && _ !== "type" && _ !== "id" && _ !== "name"
            ), W = Object.keys(r).filter(
              (_) => !_.startsWith("_") && _ !== "parent" && _ !== "removed" && typeof r[_] != "function" && _ !== "type" && _ !== "id" && _ !== "name"
            ), K = [
              .../* @__PURE__ */ new Set([...U, ...W])
            ].filter(
              (_) => _.toLowerCase().includes("selection") || _.toLowerCase().includes("select") || _.toLowerCase().includes("color") && !_.toLowerCase().includes("fill") && !_.toLowerCase().includes("stroke")
            );
            if (K.length > 0) {
              await a.log(
                `  DEBUG: Found selection/color-related properties: ${K.join(", ")}`
              );
              for (const _ of K)
                try {
                  if (U.includes(_)) {
                    const F = e[_];
                    await a.log(
                      `  DEBUG:   Instance.${_}: ${JSON.stringify(F)}`
                    );
                  }
                  if (W.includes(_)) {
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
            const D = r.boundVariables;
            if (D && typeof D == "object") {
              const _ = Object.keys(D);
              if (_.length > 0) {
                await a.log(
                  `  DEBUG: Main component "${f}" -> boundVariables keys: ${_.join(", ")}`
                );
                for (const F of _) {
                  const J = D[F], H = (J == null ? void 0 : J.type) || typeof J;
                  await a.log(
                    `  DEBUG:   Main component boundVariables.${F}: type=${H}, value=${JSON.stringify(J)}`
                  );
                }
              }
            }
            if (g && Object.keys(g).length > 0) {
              await a.log(
                `  DEBUG: Preserving instance's boundVariables in structure (${Object.keys(g).length} key(s))`
              );
              const { extractBoundVariables: _ } = await Promise.resolve().then(() => be), F = await _(
                g,
                t.variableTable,
                t.collectionTable
              );
              c.boundVariables || (c.boundVariables = {});
              for (const [J, H] of Object.entries(
                F
              ))
                H !== void 0 && (c.boundVariables[J] !== void 0 && await a.log(
                  `  DEBUG: Structure already has boundVariables.${J} from baseProps, but instance also has it - using instance's boundVariables.${J}`
                ), c.boundVariables[J] = H, await a.log(
                  `  DEBUG: Set boundVariables.${J} in structure: ${JSON.stringify(H)}`
                ));
              F.fills !== void 0 ? await a.log(
                "  DEBUG: ✓ Preserved boundVariables.fills from instance"
              ) : b && await a.warning(
                "  DEBUG: Instance has boundVariables.fills but extractBoundVariables didn't extract it"
              ), F.backgrounds !== void 0 ? await a.log(
                `  DEBUG: ✓ Preserved boundVariables.backgrounds from instance: ${JSON.stringify(F.backgrounds)}`
              ) : g && g.backgrounds !== void 0 && await a.warning(
                "  DEBUG: Instance has boundVariables.backgrounds but extractBoundVariables didn't extract it"
              );
            }
            if (D && Object.keys(D).length > 0) {
              await a.log(
                `  DEBUG: Checking main component's boundVariables for properties not in instance (${Object.keys(D).length} key(s))`
              );
              const { extractBoundVariables: _ } = await Promise.resolve().then(() => be), F = await _(
                D,
                t.variableTable,
                t.collectionTable
              );
              c.boundVariables || (c.boundVariables = {});
              for (const [J, H] of Object.entries(
                F
              ))
                H !== void 0 && (c.boundVariables[J] === void 0 ? (c.boundVariables[J] = H, await a.log(
                  `  DEBUG: Added boundVariables.${J} from main component (not in instance): ${JSON.stringify(H)}`
                )) : await a.log(
                  `  DEBUG: Skipped boundVariables.${J} from main component (instance already has it)`
                ));
            }
            await a.log(
              `  DEBUG: Final structure for "${f}": hasFills=${!!c.fills}, fillsCount=${((o = c.fills) == null ? void 0 : o.length) || 0}, hasBoundVars=${!!c.boundVariables}, boundVarsKeys=${c.boundVariables ? Object.keys(c.boundVariables).join(", ") : "none"}`
            ), (l = c.boundVariables) != null && l.fills && await a.log(
              `  DEBUG: Structure boundVariables.fills: ${JSON.stringify(c.boundVariables.fills)}`
            );
          } catch (g) {
            await a.warning(
              `  Failed to handle bound variables for fills: ${g}`
            );
          }
          O.structure = c, C ? await a.log(
            `  Extracted structure for detached component "${f}" (ID: ${r.id.substring(0, 8)}...)`
          ) : await a.log(
            `  Extracted structure from instance for remote component "${f}" (preserving size overrides: ${e.width}x${e.height})`
          ), await a.log(
            `  Found INSTANCE: "${p}" -> REMOTE component "${f}" (ID: ${r.id.substring(0, 8)}...)${C ? " [DETACHED]" : ""}`
          );
        } catch (V) {
          const L = `Failed to extract structure for remote component "${f}": ${V instanceof Error ? V.message : String(V)}`;
          console.error(L, V), await a.error(L);
        }
    }
    const G = t.instanceTable.addInstance(O);
    n._instanceRef = G, i.add("_instanceRef");
  }
  return n;
}
class ve {
  constructor() {
    ee(this, "instanceMap");
    // unique key -> index
    ee(this, "instances");
    // index -> instance data
    ee(this, "nextIndex");
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
    const n = new ve(), i = Object.entries(t).sort(
      (o, l) => parseInt(o[0], 10) - parseInt(l[0], 10)
    );
    for (const [o, l] of i) {
      const r = parseInt(o, 10), p = n.generateKey(l);
      n.instanceMap.set(p, r), n.instances[r] = l, n.nextIndex = Math.max(n.nextIndex, r + 1);
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
function qt() {
  const e = {};
  for (const [t, n] of Object.entries(rt))
    e[n] = t;
  return e;
}
function Ye(e) {
  var t;
  return (t = rt[e]) != null ? t : e;
}
function Yt(e) {
  var t;
  return typeof e == "number" ? (t = qt()[e]) != null ? t : e.toString() : e;
}
const ot = {
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
}, Be = {};
for (const [e, t] of Object.entries(ot))
  Be[t] = e;
class Oe {
  constructor() {
    ee(this, "shortToLong");
    ee(this, "longToShort");
    this.shortToLong = j({}, Be), this.longToShort = j({}, ot);
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
          let p = this.compressObject(l);
          r === "type" && typeof p == "string" && (p = Ye(p)), n[r] = p;
        } else {
          let p = this.compressObject(l);
          o === "type" && typeof p == "string" && (p = Ye(p)), n[o] = p;
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
        (l === "type" || i === "type") && (typeof r == "number" || typeof r == "string") && (r = Yt(r)), n[l] = r;
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
    return j({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(t) {
    const n = new Oe();
    n.shortToLong = j(j({}, Be), t), n.longToShort = {};
    for (const [i, o] of Object.entries(
      n.shortToLong
    ))
      n.longToShort[o] = i;
    return n;
  }
}
function Xt(e, t) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const n = {};
  e.metadata && (n.metadata = e.metadata);
  for (const [i, o] of Object.entries(e))
    i !== "metadata" && (n[i] = t.compressObject(o));
  return n;
}
function Zt(e, t) {
  return t.expandObject(e);
}
function Se(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
function xe(e) {
  let t = 1;
  return e.children && e.children.length > 0 && e.children.forEach((n) => {
    t += xe(n);
  }), t;
}
async function Ve(e, t = /* @__PURE__ */ new WeakSet(), n = {}) {
  var v, $, w, m, R, k, B;
  if (!e || typeof e != "object")
    return e;
  const i = (v = n.maxNodes) != null ? v : 1e4, o = ($ = n.nodeCount) != null ? $ : 0;
  if (o >= i)
    return await a.warning(
      `Maximum node count (${i}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: o
    };
  const l = {
    visited: (w = n.visited) != null ? w : /* @__PURE__ */ new WeakSet(),
    depth: (m = n.depth) != null ? m : 0,
    maxDepth: (R = n.maxDepth) != null ? R : 100,
    nodeCount: o + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: n.variableTable,
    collectionTable: n.collectionTable,
    instanceTable: n.instanceTable,
    detachedComponentsHandled: (k = n.detachedComponentsHandled) != null ? k : /* @__PURE__ */ new Set(),
    exportedIds: (B = n.exportedIds) != null ? B : /* @__PURE__ */ new Map()
  };
  if (t.has(e))
    return "[Circular Reference]";
  t.add(e), l.visited = t;
  const r = {}, p = await nt(e, l);
  if (Object.assign(r, p), r.id && l.exportedIds) {
    const O = l.exportedIds.get(r.id);
    if (O !== void 0) {
      const G = r.name || "Unnamed";
      if (O !== G) {
        const P = `Duplicate ID detected during export: ID "${r.id.substring(0, 8)}..." is used by both "${O}" and "${G}". Each node must have a unique ID.`;
        throw await a.error(P), new Error(P);
      }
      await a.warning(
        `Node "${G}" (ID: ${r.id.substring(0, 8)}...) was encountered multiple times during export. This may indicate a structural issue.`
      );
    } else
      l.exportedIds.set(r.id, r.name || "Unnamed");
  }
  const f = e.type;
  if (f)
    switch (f) {
      case "FRAME":
      case "COMPONENT": {
        const O = await Ge(e);
        Object.assign(r, O);
        break;
      }
      case "INSTANCE": {
        const O = await Ht(
          e,
          l
        );
        Object.assign(r, O);
        const G = await Ge(
          e
        );
        Object.assign(r, G);
        break;
      }
      case "TEXT": {
        const O = await Bt(e);
        Object.assign(r, O);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const O = await jt(e);
        Object.assign(r, O);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const O = await Dt(e);
        Object.assign(r, O);
        break;
      }
      default:
        l.unhandledKeys.add("_unknownType");
        break;
    }
  const h = Object.getOwnPropertyNames(e), y = /* @__PURE__ */ new Set([
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
  (f === "FRAME" || f === "COMPONENT" || f === "INSTANCE") && (y.add("layoutMode"), y.add("primaryAxisSizingMode"), y.add("counterAxisSizingMode"), y.add("primaryAxisAlignItems"), y.add("counterAxisAlignItems"), y.add("paddingLeft"), y.add("paddingRight"), y.add("paddingTop"), y.add("paddingBottom"), y.add("itemSpacing"), y.add("cornerRadius"), y.add("clipsContent"), y.add("layoutWrap"), y.add("layoutGrow")), f === "TEXT" && (y.add("characters"), y.add("fontName"), y.add("fontSize"), y.add("textAlignHorizontal"), y.add("textAlignVertical"), y.add("letterSpacing"), y.add("lineHeight"), y.add("textCase"), y.add("textDecoration"), y.add("textAutoResize"), y.add("paragraphSpacing"), y.add("paragraphIndent"), y.add("listOptions")), (f === "VECTOR" || f === "LINE") && (y.add("fillGeometry"), y.add("strokeGeometry")), (f === "RECTANGLE" || f === "ELLIPSE" || f === "STAR" || f === "POLYGON") && (y.add("pointCount"), y.add("innerRadius"), y.add("arcData")), f === "INSTANCE" && (y.add("mainComponent"), y.add("componentProperties"));
  for (const O of h)
    typeof e[O] != "function" && (y.has(O) || l.unhandledKeys.add(O));
  l.unhandledKeys.size > 0 && (r._unhandledKeys = Array.from(l.unhandledKeys).sort());
  const E = r._instanceRef !== void 0 && l.instanceTable && f === "INSTANCE";
  let s = !1;
  if (E) {
    const O = l.instanceTable.getInstanceByIndex(
      r._instanceRef
    );
    O && O.instanceType === "normal" && (s = !0, await a.log(
      `  Skipping children extraction for normal instance "${r.name || "Unnamed"}" - will be resolved from referenced component`
    ));
  }
  if (!s && e.children && Array.isArray(e.children)) {
    const O = l.maxDepth;
    if (l.depth >= O)
      r.children = {
        _truncated: !0,
        _reason: `Maximum depth (${O}) reached`,
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
      const G = Z(j({}, l), {
        depth: l.depth + 1
      }), P = [];
      let A = !1;
      for (const C of e.children) {
        if (G.nodeCount >= i) {
          r.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: P.length,
            _total: e.children.length,
            children: P
          }, A = !0;
          break;
        }
        const T = await Ve(C, t, G);
        P.push(T), G.nodeCount && (l.nodeCount = G.nodeCount);
      }
      A || (r.children = P);
    }
  }
  return r;
}
async function je(e, t = /* @__PURE__ */ new Set(), n = !1) {
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
    const p = new Ne(), f = new $e(), h = new ve();
    await a.log("Fetching team library variable collections...");
    let y = [];
    try {
      if (y = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((b) => ({
        libraryName: b.libraryName,
        key: b.key,
        name: b.name
      })), await a.log(
        `Found ${y.length} library collection(s) in team library`
      ), y.length > 0)
        for (const b of y)
          await a.log(`  - ${b.name} (from ${b.libraryName})`);
    } catch (g) {
      await a.warning(
        `Could not get library variable collections: ${g instanceof Error ? g.message : String(g)}`
      );
    }
    await a.log("Extracting node data from page..."), await a.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await a.log(
      "Collections will be discovered as variables are processed:"
    );
    const E = await Ve(
      l,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: p,
        collectionTable: f,
        instanceTable: h
      }
    );
    await a.log("Node extraction finished");
    const s = xe(E), v = p.getSize(), $ = f.getSize(), w = h.getSize();
    if (await a.log("Extraction complete:"), await a.log(`  - Total nodes: ${s}`), await a.log(`  - Unique variables: ${v}`), await a.log(`  - Unique collections: ${$}`), await a.log(`  - Unique instances: ${w}`), $ > 0) {
      await a.log("Collections found:");
      const g = f.getTable();
      for (const [b, I] of Object.values(g).entries()) {
        const N = I.collectionGuid ? ` (GUID: ${I.collectionGuid.substring(0, 8)}...)` : "";
        await a.log(
          `  ${b}: ${I.collectionName}${N} - ${I.modes.length} mode(s)`
        );
      }
    }
    await a.log("Checking for referenced component pages...");
    const m = [], R = h.getSerializedTable(), k = Object.values(R).filter(
      (g) => g.instanceType === "normal"
    );
    if (k.length > 0) {
      await a.log(
        `Found ${k.length} normal instance(s) to check`
      );
      const g = /* @__PURE__ */ new Map();
      for (const b of k)
        if (b.componentPageName) {
          const I = o.find((N) => N.name === b.componentPageName);
          if (I && !t.has(I.id))
            g.has(I.id) || g.set(I.id, I);
          else if (!I) {
            const N = `Normal instance references component "${b.componentName || "(unnamed)"}" on page "${b.componentPageName}", but that page was not found. Cannot export.`;
            throw await a.error(N), new Error(N);
          }
        } else {
          const I = `Normal instance references component "${b.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw await a.error(I), new Error(I);
        }
      await a.log(
        `Found ${g.size} unique referenced page(s)`
      );
      for (const [b, I] of g.entries()) {
        const N = I.name;
        if (t.has(b)) {
          await a.log(`Skipping "${N}" - already processed`);
          continue;
        }
        const S = I.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let M = !1;
        if (S)
          try {
            const U = JSON.parse(S);
            M = !!(U.id && U.version !== void 0);
          } catch (U) {
          }
        const x = `Do you want to also publish referenced component "${N}"?`;
        try {
          await he.prompt(x, {
            okLabel: "Yes",
            cancelLabel: "No",
            timeoutMs: 3e5
            // 5 minutes
          }), await a.log(`Exporting referenced page: "${N}"`);
          const U = o.findIndex(
            (K) => K.id === I.id
          );
          if (U === -1)
            throw await a.error(
              `Could not find page index for "${N}"`
            ), new Error(`Could not find page index for "${N}"`);
          const W = await je(
            {
              pageIndex: U
            },
            t,
            // Pass the same set to track all processed pages
            !0
            // Mark as recursive call
          );
          if (W.success && W.data) {
            const K = W.data;
            m.push(K), await a.log(
              `Successfully exported referenced page: "${N}"`
            );
          } else
            throw new Error(
              `Failed to export referenced page "${N}": ${W.message}`
            );
        } catch (U) {
          if (U instanceof Error && U.message === "User cancelled")
            if (M)
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
            throw U;
        }
      }
    }
    await a.log("Creating string table...");
    const B = new Oe();
    await a.log("Getting page metadata...");
    const O = l.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let G = "", P = 0;
    if (O)
      try {
        const g = JSON.parse(O);
        G = g.id || "", P = g.version || 0;
      } catch (g) {
        await a.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!G) {
      await a.log("Generating new GUID for page..."), G = await Fe();
      const g = {
        _ver: 1,
        id: G,
        name: l.name,
        version: P,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      l.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(g)
      );
    }
    await a.log("Creating export data structure...");
    const A = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "1.0.0",
        figmaApiVersion: figma.apiVersion,
        guid: G,
        version: P,
        name: l.name,
        pluginVersion: "1.0.0"
      },
      stringTable: B.getSerializedTable(),
      collections: f.getSerializedTable(),
      variables: p.getSerializedTable(),
      instances: h.getSerializedTable(),
      libraries: y,
      // Libraries might not need compression, but could be added later
      pageData: E
    };
    await a.log("Compressing JSON data...");
    const C = Xt(A, B);
    await a.log("Serializing to JSON...");
    const T = JSON.stringify(C, null, 2), V = (T.length / 1024).toFixed(2), d = Se(l.name).trim().replace(/\s+/g, "_") + ".figma.json";
    await a.log(`JSON serialization complete: ${V} KB`), await a.log(`Export file: ${d}`), await a.log("=== Export Complete ===");
    const u = JSON.parse(T);
    return {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: d,
        pageData: u,
        pageName: l.name,
        additionalPages: m
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
const Qt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  countTotalNodes: xe,
  exportPage: je,
  extractNodeData: Ve
}, Symbol.toStringTag, { value: "Module" }));
async function pe(e, t) {
  for (const n of t)
    e.modes.find((o) => o.name === n) || e.addMode(n);
}
const ie = "recursica:collectionId";
async function Ie(e) {
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
      ie
    );
    if (n && n.trim() !== "")
      return n;
    const i = await Fe();
    return e.setSharedPluginData("recursica", ie, i), i;
  }
}
function ea(e, t) {
  const n = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(n))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function ta(e) {
  let t;
  const n = e.collectionName.trim().toLowerCase(), i = ["token", "tokens", "theme", "themes"], o = e.isLocal;
  if (o === !1 || o === void 0 && i.includes(n))
    try {
      const p = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((f) => f.name.trim().toLowerCase() === n);
      if (p) {
        ea(e.collectionName, !1);
        const f = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          p.key
        );
        if (f.length > 0) {
          const h = await figma.variables.importVariableByKeyAsync(f[0].key), y = await figma.variables.getVariableCollectionByIdAsync(
            h.variableCollectionId
          );
          if (y) {
            if (t = y, e.collectionGuid) {
              const E = t.getSharedPluginData(
                "recursica",
                ie
              );
              (!E || E.trim() === "") && t.setSharedPluginData(
                "recursica",
                ie,
                e.collectionGuid
              );
            } else
              await Ie(t);
            return await pe(t, e.modes), { collection: t };
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
    let p;
    if (e.collectionGuid && (p = r.find((f) => f.getSharedPluginData("recursica", ie) === e.collectionGuid)), p || (p = r.find(
      (f) => f.name === e.collectionName
    )), p)
      if (t = p, e.collectionGuid) {
        const f = t.getSharedPluginData(
          "recursica",
          ie
        );
        (!f || f.trim() === "") && t.setSharedPluginData(
          "recursica",
          ie,
          e.collectionGuid
        );
      } else
        await Ie(t);
    else
      t = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? t.setSharedPluginData(
        "recursica",
        ie,
        e.collectionGuid
      ) : await Ie(t);
  } else {
    const r = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), p = e.collectionName.trim().toLowerCase(), f = r.find((s) => s.name.trim().toLowerCase() === p);
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
    const y = await figma.variables.importVariableByKeyAsync(
      h[0].key
    ), E = await figma.variables.getVariableCollectionByIdAsync(
      y.variableCollectionId
    );
    if (!E)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (t = E, e.collectionGuid) {
      const s = t.getSharedPluginData(
        "recursica",
        ie
      );
      (!s || s.trim() === "") && t.setSharedPluginData(
        "recursica",
        ie,
        e.collectionGuid
      );
    } else
      Ie(t);
  }
  return await pe(t, e.modes), { collection: t };
}
async function De(e, t) {
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
async function aa(e, t, n, i, o) {
  for (const [l, r] of Object.entries(t)) {
    const p = i.modes.find((h) => h.name === l);
    if (!p) {
      console.warn(
        `Mode "${l}" not found in collection "${i.name}" for variable "${e.name}". Skipping.`
      );
      continue;
    }
    const f = p.modeId;
    try {
      if (r == null)
        continue;
      if (typeof r == "string" || typeof r == "number" || typeof r == "boolean") {
        e.setValueForMode(f, r);
        continue;
      }
      if (typeof r == "object" && r !== null && "_varRef" in r && typeof r._varRef == "number") {
        const h = r;
        let y = null;
        const E = n.getVariableByIndex(
          h._varRef
        );
        if (E) {
          let s = null;
          if (o && E._colRef !== void 0) {
            const v = o.getCollectionByIndex(
              E._colRef
            );
            v && (s = (await ta(v)).collection);
          }
          s && (y = await De(
            s,
            E.variableName
          ));
        }
        if (y) {
          const s = {
            type: "VARIABLE_ALIAS",
            id: y.id
          };
          e.setValueForMode(f, s);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${l}" in variable "${e.name}". Variable reference index: ${h._varRef}`
          );
      }
    } catch (h) {
      console.warn(
        `Error setting value for mode "${l}" in variable "${e.name}":`,
        h
      );
    }
  }
}
async function ze(e, t, n, i) {
  const o = figma.variables.createVariable(
    e.variableName,
    t,
    e.variableType
  );
  return e.valuesByMode && await aa(
    o,
    e.valuesByMode,
    n,
    t,
    // Pass collection to look up modes by name
    i
  ), o;
}
async function na(e, t, n, i) {
  const o = t.getVariableByIndex(e);
  if (!o || o._colRef === void 0)
    return null;
  const l = i.get(String(o._colRef));
  if (!l)
    return null;
  const r = await De(
    l,
    o.variableName
  );
  if (r) {
    let p;
    if (typeof o.variableType == "number" ? p = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[o.variableType] || String(o.variableType) : p = o.variableType, st(r, p))
      return r;
  }
  return await ze(
    o,
    l,
    t,
    n
  );
}
async function ia(e, t, n, i) {
  if (!(!t || typeof t != "object"))
    try {
      const o = e[n];
      if (!o || !Array.isArray(o))
        return;
      const l = t[n];
      if (Array.isArray(l))
        for (let r = 0; r < l.length && r < o.length; r++) {
          const p = l[r];
          if (p && typeof p == "object") {
            if (o[r].boundVariables || (o[r].boundVariables = {}), de(p)) {
              const f = p._varRef;
              if (f !== void 0) {
                const h = i.get(String(f));
                h && (o[r].boundVariables.color = {
                  type: "VARIABLE_ALIAS",
                  id: h.id
                });
              }
            } else
              for (const [f, h] of Object.entries(
                p
              ))
                if (de(h)) {
                  const y = h._varRef;
                  if (y !== void 0) {
                    const E = i.get(String(y));
                    E && (o[r].boundVariables[f] = {
                      type: "VARIABLE_ALIAS",
                      id: E.id
                    });
                  }
                }
          }
        }
    } catch (o) {
      console.log(`Error restoring bound variables for ${n}:`, o);
    }
}
function ra(e, t, n = !1) {
  const i = It(t);
  if (e.visible === void 0 && (e.visible = i.visible), e.locked === void 0 && (e.locked = i.locked), e.opacity === void 0 && (e.opacity = i.opacity), e.rotation === void 0 && (e.rotation = i.rotation), e.blendMode === void 0 && (e.blendMode = i.blendMode), t === "FRAME" || t === "COMPONENT" || t === "INSTANCE") {
    const o = Y;
    e.layoutMode === void 0 && (e.layoutMode = o.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = o.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = o.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = o.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = o.counterAxisAlignItems), n || (e.paddingLeft === void 0 && (e.paddingLeft = o.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = o.paddingRight), e.paddingTop === void 0 && (e.paddingTop = o.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = o.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = o.itemSpacing));
  }
  if (t === "TEXT") {
    const o = ne;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = o.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = o.textAlignVertical), e.textCase === void 0 && (e.textCase = o.textCase), e.textDecoration === void 0 && (e.textDecoration = o.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = o.textAutoResize);
  }
}
async function ye(e, t, n = null, i = null, o = null, l = null, r = null, p = !1, f = null, h = null, y = null, E = null) {
  var P, A, C, T, V, L;
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
        const d = e.componentPropertyDefinitions;
        let u = 0, c = 0;
        for (const [g, b] of Object.entries(d))
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
                `  Unknown property type ${I} (${typeof I}) for property "${g}" in component "${e.name || "Unnamed"}"`
              ), c++;
              continue;
            }
            const S = b.defaultValue, M = g.split("#")[0];
            s.addComponentProperty(
              M,
              N,
              S
            ), u++;
          } catch (I) {
            await a.warning(
              `  Failed to add component property "${g}" to "${e.name || "Unnamed"}": ${I}`
            ), c++;
          }
        u > 0 && await a.log(
          `  Added ${u} component property definition(s) to "${e.name || "Unnamed"}"${c > 0 ? ` (${c} failed)` : ""}`
        );
      }
      break;
    case "COMPONENT_SET": {
      const d = e.children ? e.children.filter((g) => g.type === "COMPONENT").length : 0;
      await a.log(
        `Creating COMPONENT_SET "${e.name || "Unnamed"}" by combining ${d} component variant(s)`
      );
      const u = [];
      let c = null;
      if (e.children && Array.isArray(e.children)) {
        c = figma.createFrame(), c.name = `_temp_${e.name || "COMPONENT_SET"}`, c.visible = !1, ((t == null ? void 0 : t.type) === "PAGE" ? t : figma.currentPage).appendChild(c);
        for (const b of e.children)
          if (b.type === "COMPONENT" && !b._truncated)
            try {
              const I = await ye(
                b,
                c,
                // Use temp parent for now
                n,
                i,
                o,
                l,
                r,
                p,
                f,
                null,
                // deferredInstances - not needed for component set creation
                null,
                // parentNodeData - not needed here, will be passed correctly in recursive calls
                E
              );
              I && I.type === "COMPONENT" && (u.push(I), await a.log(
                `  Created component variant: "${I.name || "Unnamed"}"`
              ));
            } catch (I) {
              await a.warning(
                `  Failed to create component variant "${b.name || "Unnamed"}": ${I}`
              );
            }
      }
      if (u.length > 0)
        try {
          const g = t || figma.currentPage, b = figma.combineAsVariants(
            u,
            g
          );
          e.name && (b.name = e.name), e.x !== void 0 && (b.x = e.x), e.y !== void 0 && (b.y = e.y), c && c.parent && c.remove(), await a.log(
            `  ✓ Successfully created COMPONENT_SET "${b.name}" with ${u.length} variant(s)`
          ), s = b;
        } catch (g) {
          if (await a.warning(
            `  Failed to combine components into COMPONENT_SET "${e.name || "Unnamed"}": ${g}. Falling back to frame.`
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
      if (p)
        s = figma.createFrame(), e.name && (s.name = e.name);
      else if (e._instanceRef !== void 0 && o && r) {
        const d = o.getInstanceByIndex(
          e._instanceRef
        );
        if (d && d.instanceType === "internal")
          if (d.componentNodeId)
            if (d.componentNodeId === e.id)
              await a.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), s = figma.createFrame(), e.name && (s.name = e.name);
            else {
              const u = r.get(
                d.componentNodeId
              );
              if (!u) {
                const c = Array.from(r.keys()).slice(
                  0,
                  20
                );
                await a.error(
                  `Component not found for internal instance "${e.name}" (ID: ${d.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), await a.error(
                  `Looking for component ID: ${d.componentNodeId}`
                ), await a.error(
                  `Available IDs in mapping (first 20): ${c.map((S) => S.substring(0, 8) + "...").join(", ")}`
                );
                const g = (S, M) => {
                  if (S.type === "COMPONENT" && S.id === M)
                    return !0;
                  if (S.children && Array.isArray(S.children)) {
                    for (const x of S.children)
                      if (!x._truncated && g(x, M))
                        return !0;
                  }
                  return !1;
                }, b = g(
                  e,
                  d.componentNodeId
                );
                await a.error(
                  `Component ID ${d.componentNodeId.substring(0, 8)}... exists in current node tree: ${b}`
                ), await a.error(
                  `WARNING: Component ID ${d.componentNodeId.substring(0, 8)}... not found in nodeIdMapping. This might indicate:`
                ), await a.error(
                  "  1. The component doesn't exist in the pageData (detached component?)"
                ), await a.error(
                  "  2. The component wasn't collected in the first pass"
                ), await a.error(
                  "  3. The component ID in the instance table doesn't match the actual component ID"
                );
                const I = c.filter(
                  (S) => S.startsWith(d.componentNodeId.substring(0, 8))
                );
                I.length > 0 && await a.error(
                  `Found IDs with matching prefix: ${I.map((S) => S.substring(0, 8) + "...").join(", ")}`
                );
                const N = `Component not found for internal instance "${e.name}" (ID: ${d.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${c.map((S) => S.substring(0, 8) + "...").join(", ")}`;
                throw new Error(N);
              }
              if (u && u.type === "COMPONENT") {
                if (s = u.createInstance(), await a.log(
                  `✓ Created internal instance "${e.name}" from component "${d.componentName}"`
                ), d.variantProperties && Object.keys(d.variantProperties).length > 0)
                  try {
                    let c = null;
                    if (u.parent && u.parent.type === "COMPONENT_SET")
                      c = u.parent.componentPropertyDefinitions, await a.log(
                        `  DEBUG: Component "${d.componentName}" is inside component set "${u.parent.name}" with ${Object.keys(c || {}).length} property definitions`
                      );
                    else {
                      const g = await s.getMainComponentAsync();
                      if (g) {
                        const b = g.type;
                        await a.log(
                          `  DEBUG: Internal instance "${e.name}" - componentNode parent: ${u.parent ? u.parent.type : "N/A"}, mainComponent type: ${b}, mainComponent parent: ${g.parent ? g.parent.type : "N/A"}`
                        ), b === "COMPONENT_SET" ? c = g.componentPropertyDefinitions : b === "COMPONENT" && g.parent && g.parent.type === "COMPONENT_SET" ? (c = g.parent.componentPropertyDefinitions, await a.log(
                          `  DEBUG: Found component set parent "${g.parent.name}" with ${Object.keys(c || {}).length} property definitions`
                        )) : await a.log(
                          `  Skipping variant properties for internal instance "${e.name}" - component "${d.componentName}" is not yet in a COMPONENT_SET (will be moved later during component set creation)`
                        );
                      }
                    }
                    if (c) {
                      const g = {};
                      for (const [b, I] of Object.entries(
                        d.variantProperties
                      )) {
                        const N = b.split("#")[0];
                        c[N] && (g[N] = I);
                      }
                      Object.keys(g).length > 0 && s.setProperties(g);
                    }
                  } catch (c) {
                    const g = `Failed to set variant properties for instance "${e.name}": ${c}`;
                    throw await a.error(g), new Error(g);
                  }
                if (d.componentProperties && Object.keys(d.componentProperties).length > 0)
                  try {
                    const c = await s.getMainComponentAsync();
                    if (c) {
                      let g = null;
                      const b = c.type;
                      if (b === "COMPONENT_SET" ? g = c.componentPropertyDefinitions : b === "COMPONENT" && c.parent && c.parent.type === "COMPONENT_SET" ? g = c.parent.componentPropertyDefinitions : b === "COMPONENT" && (g = c.componentPropertyDefinitions), g)
                        for (const [I, N] of Object.entries(
                          d.componentProperties
                        )) {
                          const S = I.split("#")[0];
                          if (g[S])
                            try {
                              let M = N;
                              N && typeof N == "object" && "value" in N && (M = N.value), s.setProperties({
                                [S]: M
                              });
                            } catch (M) {
                              const x = `Failed to set component property "${S}" for internal instance "${e.name}": ${M}`;
                              throw await a.error(x), new Error(x);
                            }
                        }
                    } else
                      await a.warning(
                        `Cannot set component properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (c) {
                    if (c instanceof Error)
                      throw c;
                    const g = `Failed to set component properties for instance "${e.name}": ${c}`;
                    throw await a.error(g), new Error(g);
                  }
              } else if (!s && u) {
                const c = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${d.componentNodeId.substring(0, 8)}...).`;
                throw await a.error(c), new Error(c);
              }
            }
          else {
            const u = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw await a.error(u), new Error(u);
          }
        else if (d && d.instanceType === "remote")
          if (f) {
            const u = f.get(
              e._instanceRef
            );
            if (u) {
              if (s = u.createInstance(), await a.log(
                `✓ Created remote instance "${e.name}" from component "${d.componentName}" on REMOTES page`
              ), d.variantProperties && Object.keys(d.variantProperties).length > 0)
                try {
                  const c = await s.getMainComponentAsync();
                  if (c) {
                    let g = null;
                    const b = c.type;
                    if (b === "COMPONENT_SET" ? g = c.componentPropertyDefinitions : b === "COMPONENT" && c.parent && c.parent.type === "COMPONENT_SET" ? g = c.parent.componentPropertyDefinitions : await a.log(
                      `Skipping variant properties for remote instance "${e.name}" - main component is not a COMPONENT_SET or variant (expected for remote components)`
                    ), g) {
                      const I = {};
                      for (const [N, S] of Object.entries(
                        d.variantProperties
                      )) {
                        const M = N.split("#")[0];
                        g[M] && (I[M] = S);
                      }
                      Object.keys(I).length > 0 && s.setProperties(I);
                    }
                  } else
                    await a.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (c) {
                  const g = `Failed to set variant properties for remote instance "${e.name}": ${c}`;
                  throw await a.error(g), new Error(g);
                }
              if (d.componentProperties && Object.keys(d.componentProperties).length > 0)
                try {
                  const c = await s.getMainComponentAsync();
                  if (c) {
                    let g = null;
                    const b = c.type;
                    if (b === "COMPONENT_SET" ? g = c.componentPropertyDefinitions : b === "COMPONENT" && c.parent && c.parent.type === "COMPONENT_SET" ? g = c.parent.componentPropertyDefinitions : b === "COMPONENT" && (g = c.componentPropertyDefinitions), g)
                      for (const [I, N] of Object.entries(
                        d.componentProperties
                      )) {
                        const S = I.split("#")[0];
                        if (g[S])
                          try {
                            let M = N;
                            N && typeof N == "object" && "value" in N && (M = N.value), s.setProperties({
                              [S]: M
                            });
                          } catch (M) {
                            const x = `Failed to set component property "${S}" for remote instance "${e.name}": ${M}`;
                            throw await a.error(x), new Error(x);
                          }
                      }
                  } else
                    await a.warning(
                      `Cannot set component properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (c) {
                  if (c instanceof Error)
                    throw c;
                  const g = `Failed to set component properties for remote instance "${e.name}": ${c}`;
                  throw await a.error(g), new Error(g);
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
            const u = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw await a.error(u), new Error(u);
          }
        else if ((d == null ? void 0 : d.instanceType) === "normal") {
          if (!d.componentPageName) {
            const N = `Normal instance "${e.name}" missing componentPageName. Cannot resolve.`;
            throw await a.error(N), new Error(N);
          }
          await figma.loadAllPagesAsync();
          const u = figma.root.children.find(
            (N) => N.name === d.componentPageName
          );
          if (!u) {
            await a.log(
              `  Deferring normal instance "${e.name}" - referenced page "${d.componentPageName}" does not exist yet (may be circular reference or not yet imported)`
            );
            const N = figma.createFrame();
            N.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (N.x = e.x), e.y !== void 0 && (N.y = e.y), e.width !== void 0 && e.height !== void 0 ? N.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && N.resize(e.w, e.h), h && h.push({
              placeholderFrame: N,
              instanceEntry: d,
              nodeData: e,
              parentNode: t,
              instanceIndex: e._instanceRef
            }), s = N;
            break;
          }
          let c = null;
          const g = (N, S, M, x, U) => {
            if (S.length === 0) {
              let D = null;
              for (const _ of N.children || [])
                if (_.type === "COMPONENT") {
                  if (_.name === M)
                    if (D || (D = _), x)
                      try {
                        const F = _.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (F && JSON.parse(F).id === x)
                          return _;
                      } catch (F) {
                      }
                    else
                      return _;
                } else if (_.type === "COMPONENT_SET") {
                  if (U && _.name !== U)
                    continue;
                  for (const F of _.children || [])
                    if (F.type === "COMPONENT" && F.name === M)
                      if (D || (D = F), x)
                        try {
                          const J = F.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (J && JSON.parse(J).id === x)
                            return F;
                        } catch (J) {
                        }
                      else
                        return F;
                }
              return D;
            }
            const [W, ...K] = S;
            for (const D of N.children || [])
              if (D.name === W) {
                if (K.length === 0 && D.type === "COMPONENT_SET") {
                  if (U && D.name !== U)
                    continue;
                  for (const _ of D.children || [])
                    if (_.type === "COMPONENT" && _.name === M) {
                      if (x)
                        try {
                          const F = _.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (F && JSON.parse(F).id === x)
                            return _;
                        } catch (F) {
                        }
                      return _;
                    }
                  return null;
                }
                return g(
                  D,
                  K,
                  M,
                  x,
                  U
                );
              }
            return null;
          };
          await a.log(
            `  Looking for component "${d.componentName}" on page "${d.componentPageName}"${d.path && d.path.length > 0 ? ` at path [${d.path.join(" → ")}]` : " at page root"}${d.componentGuid ? ` (GUID: ${d.componentGuid.substring(0, 8)}...)` : ""}`
          );
          const b = [], I = (N, S = 0) => {
            const M = "  ".repeat(S);
            if (N.type === "COMPONENT")
              b.push(`${M}COMPONENT: "${N.name}"`);
            else if (N.type === "COMPONENT_SET") {
              b.push(
                `${M}COMPONENT_SET: "${N.name}"`
              );
              for (const x of N.children || [])
                x.type === "COMPONENT" && b.push(
                  `${M}  └─ COMPONENT: "${x.name}"`
                );
            }
            for (const x of N.children || [])
              I(x, S + 1);
          };
          if (I(u), b.length > 0 ? await a.log(
            `  Available components on page "${d.componentPageName}":
${b.slice(0, 20).join(`
`)}${b.length > 20 ? `
  ... and ${b.length - 20} more` : ""}`
          ) : await a.warning(
            `  No components found on page "${d.componentPageName}"`
          ), c = g(
            u,
            d.path || [],
            d.componentName,
            d.componentGuid,
            d.componentSetName
          ), c && d.componentGuid)
            try {
              const N = c.getPluginData(
                "RecursicaPublishedMetadata"
              );
              if (N) {
                const S = JSON.parse(N);
                S.id !== d.componentGuid ? await a.warning(
                  `  Found component "${d.componentName}" by name but GUID verification failed (expected ${d.componentGuid.substring(0, 8)}..., got ${S.id ? S.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`
                ) : await a.log(
                  `  Found component "${d.componentName}" with matching GUID ${d.componentGuid.substring(0, 8)}...`
                );
              } else
                await a.warning(
                  `  Found component "${d.componentName}" by name but no metadata found. Using name match as fallback.`
                );
            } catch (N) {
              await a.warning(
                `  Found component "${d.componentName}" by name but GUID verification failed. Using name match as fallback.`
              );
            }
          if (!c) {
            await a.log(
              `  Deferring normal instance "${e.name}" - component "${d.componentName}" not found on page "${d.componentPageName}" (may not be created yet due to circular reference)`
            );
            const N = figma.createFrame();
            N.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (N.x = e.x), e.y !== void 0 && (N.y = e.y), e.width !== void 0 && e.height !== void 0 ? N.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && N.resize(e.w, e.h), h && h.push({
              placeholderFrame: N,
              instanceEntry: d,
              nodeData: e,
              parentNode: t,
              instanceIndex: e._instanceRef
            }), s = N;
            break;
          }
          if (s = c.createInstance(), await a.log(
            `  Created normal instance "${e.name}" from component "${d.componentName}" on page "${d.componentPageName}"`
          ), d.variantProperties && Object.keys(d.variantProperties).length > 0)
            try {
              const N = await s.getMainComponentAsync();
              if (N) {
                let S = null;
                const M = N.type;
                if (M === "COMPONENT_SET" ? S = N.componentPropertyDefinitions : M === "COMPONENT" && N.parent && N.parent.type === "COMPONENT_SET" ? S = N.parent.componentPropertyDefinitions : await a.warning(
                  `Cannot set variant properties for normal instance "${e.name}" - main component is not a COMPONENT_SET or variant`
                ), S) {
                  const x = {};
                  for (const [U, W] of Object.entries(
                    d.variantProperties
                  )) {
                    const K = U.split("#")[0];
                    S[K] && (x[K] = W);
                  }
                  Object.keys(x).length > 0 && s.setProperties(x);
                }
              }
            } catch (N) {
              await a.warning(
                `Failed to set variant properties for normal instance "${e.name}": ${N}`
              );
            }
          if (d.componentProperties && Object.keys(d.componentProperties).length > 0)
            try {
              const N = await s.getMainComponentAsync();
              if (N) {
                let S = null;
                const M = N.type;
                if (M === "COMPONENT_SET" ? S = N.componentPropertyDefinitions : M === "COMPONENT" && N.parent && N.parent.type === "COMPONENT_SET" ? S = N.parent.componentPropertyDefinitions : M === "COMPONENT" && (S = N.componentPropertyDefinitions), S) {
                  const x = {};
                  for (const [U, W] of Object.entries(
                    d.componentProperties
                  )) {
                    const K = U.split("#")[0];
                    let D;
                    if (S[U] ? D = U : S[K] ? D = K : D = Object.keys(S).find(
                      (_) => _.split("#")[0] === K
                    ), D) {
                      const _ = W && typeof W == "object" && "value" in W ? W.value : W;
                      x[D] = _;
                    } else
                      await a.warning(
                        `Component property "${K}" (from "${U}") does not exist on component "${d.componentName}" for normal instance "${e.name}". Available properties: ${Object.keys(S).join(", ") || "none"}`
                      );
                  }
                  if (Object.keys(x).length > 0)
                    try {
                      await a.log(
                        `  Attempting to set component properties for normal instance "${e.name}": ${Object.keys(x).join(", ")}`
                      ), await a.log(
                        `  Available component properties: ${Object.keys(S).join(", ")}`
                      ), s.setProperties(x), await a.log(
                        `  ✓ Successfully set component properties for normal instance "${e.name}": ${Object.keys(x).join(", ")}`
                      );
                    } catch (U) {
                      await a.warning(
                        `Failed to set component properties for normal instance "${e.name}": ${U}`
                      ), await a.warning(
                        `  Properties attempted: ${JSON.stringify(x)}`
                      ), await a.warning(
                        `  Available properties: ${JSON.stringify(Object.keys(S))}`
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
              s.resize(e.width, e.height);
            } catch (N) {
              await a.log(
                `Note: Could not resize normal instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
              );
            }
        } else {
          const u = `Instance "${e.name}" has unknown or missing instance type: ${(d == null ? void 0 : d.instanceType) || "unknown"}`;
          throw await a.error(u), new Error(u);
        }
      } else {
        const d = `Instance "${e.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        throw await a.error(d), new Error(d);
      }
      break;
    case "GROUP":
      s = figma.createFrame();
      break;
    case "BOOLEAN_OPERATION": {
      const d = `Boolean operation nodes cannot be imported. Found boolean operation: "${e.name}".`;
      throw await a.error(d), new Error(d);
    }
    case "POLYGON":
      s = figma.createPolygon();
      break;
    default: {
      const d = `Unsupported node type: ${e.type}. This node type cannot be imported.`;
      throw await a.error(d), new Error(d);
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
  const v = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.paddingLeft || e.boundVariables.paddingRight || e.boundVariables.paddingTop || e.boundVariables.paddingBottom || e.boundVariables.itemSpacing);
  ra(
    s,
    e.type || "FRAME",
    v
  ), e.name !== void 0 && (s.name = e.name || "Unnamed Node");
  const $ = y && y.layoutMode !== void 0 && y.layoutMode !== "NONE", w = t && "layoutMode" in t && t.layoutMode !== "NONE";
  $ || w || (e.x !== void 0 && (s.x = e.x), e.y !== void 0 && (s.y = e.y));
  const R = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
  e.type !== "VECTOR" && e.width !== void 0 && e.height !== void 0 && !R && s.resize(e.width, e.height);
  const k = e.boundVariables && typeof e.boundVariables == "object";
  if (e.visible !== void 0 && (s.visible = e.visible), e.locked !== void 0 && (s.locked = e.locked), e.opacity !== void 0 && (!k || !e.boundVariables.opacity) && (s.opacity = e.opacity), e.rotation !== void 0 && (!k || !e.boundVariables.rotation) && (s.rotation = e.rotation), e.blendMode !== void 0 && (!k || !e.boundVariables.blendMode) && (s.blendMode = e.blendMode), e.type !== "INSTANCE") {
    if (e.type === "VECTOR" && e.boundVariables && (await a.log(
      `  DEBUG: VECTOR "${e.name || "Unnamed"}" (ID: ${((P = e.id) == null ? void 0 : P.substring(0, 8)) || "unknown"}...) has boundVariables: ${Object.keys(e.boundVariables).join(", ")}`
    ), e.boundVariables.fills && await a.log(
      `  DEBUG:   boundVariables.fills: ${JSON.stringify(e.boundVariables.fills)}`
    )), e.fills !== void 0)
      try {
        let d = e.fills;
        if (Array.isArray(d) && (d = d.map((u) => {
          if (u && typeof u == "object") {
            const c = j({}, u);
            return delete c.boundVariables, c;
          }
          return u;
        })), e.fills && Array.isArray(e.fills) && l) {
          if (e.type === "VECTOR") {
            await a.log(
              `  DEBUG: VECTOR "${e.name || "Unnamed"}" has ${e.fills.length} fill(s)`
            );
            for (let c = 0; c < e.fills.length; c++) {
              const g = e.fills[c];
              if (g && typeof g == "object") {
                const b = g.boundVariables || g.bndVar;
                b ? await a.log(
                  `  DEBUG:   fill[${c}] has boundVariables: ${JSON.stringify(b)}`
                ) : await a.log(
                  `  DEBUG:   fill[${c}] has no boundVariables`
                );
              }
            }
          }
          const u = [];
          for (let c = 0; c < d.length; c++) {
            const g = d[c], b = e.fills[c];
            if (!b || typeof b != "object") {
              u.push(g);
              continue;
            }
            const I = b.boundVariables || b.bndVar;
            if (!I) {
              u.push(g);
              continue;
            }
            const N = j({}, g);
            N.boundVariables = {};
            for (const [S, M] of Object.entries(I))
              if (e.type === "VECTOR" && await a.log(
                `  DEBUG: Processing fill[${c}].${S} on VECTOR "${s.name || "Unnamed"}": varInfo=${JSON.stringify(M)}`
              ), de(M)) {
                const x = M._varRef;
                if (x !== void 0) {
                  if (e.type === "VECTOR") {
                    await a.log(
                      `  DEBUG: Looking up variable reference ${x} in recognizedVariables (map has ${l.size} entries)`
                    );
                    const W = Array.from(
                      l.keys()
                    ).slice(0, 10);
                    await a.log(
                      `  DEBUG: Available variable references (first 10): ${W.join(", ")}`
                    );
                    const K = l.has(String(x));
                    if (await a.log(
                      `  DEBUG: Variable reference ${x} ${K ? "found" : "NOT FOUND"} in recognizedVariables`
                    ), !K) {
                      const D = Array.from(
                        l.keys()
                      ).sort((_, F) => parseInt(_) - parseInt(F));
                      await a.log(
                        `  DEBUG: All available variable references: ${D.join(", ")}`
                      );
                    }
                  }
                  let U = l.get(String(x));
                  U || (e.type === "VECTOR" && await a.log(
                    `  DEBUG: Variable ${x} not in recognizedVariables. variableTable=${!!n}, collectionTable=${!!i}, recognizedCollections=${!!E}`
                  ), n && i && E ? (await a.log(
                    `  Variable reference ${x} not in recognizedVariables, attempting to resolve from variable table...`
                  ), U = await na(
                    x,
                    n,
                    i,
                    E
                  ) || void 0, U ? (l.set(String(x), U), await a.log(
                    `  ✓ Resolved variable ${U.name} from variable table and added to recognizedVariables`
                  )) : await a.warning(
                    `  Failed to resolve variable ${x} from variable table`
                  )) : e.type === "VECTOR" && await a.warning(
                    `  Cannot resolve variable ${x} from table - missing required parameters`
                  )), U ? (N.boundVariables[S] = {
                    type: "VARIABLE_ALIAS",
                    id: U.id
                  }, await a.log(
                    `  ✓ Restored bound variable for fill[${c}].${S} on "${s.name || "Unnamed"}" (${e.type}): variable ${U.name} (ID: ${U.id.substring(0, 8)}...)`
                  )) : await a.warning(
                    `  Variable reference ${x} not found in recognizedVariables for fill[${c}].${S} on "${s.name || "Unnamed"}"`
                  );
                } else
                  e.type === "VECTOR" && await a.warning(
                    `  DEBUG: Variable reference ${x} is undefined for fill[${c}].${S} on VECTOR "${s.name || "Unnamed"}"`
                  );
              } else
                e.type === "VECTOR" && await a.warning(
                  `  DEBUG: fill[${c}].${S} on VECTOR "${s.name || "Unnamed"}" is not a variable reference: ${JSON.stringify(M)}`
                );
            u.push(N);
          }
          s.fills = u, await a.log(
            `  ✓ Set fills with boundVariables on "${s.name || "Unnamed"}" (${e.type})`
          );
        } else
          s.fills = d;
        e.boundVariables && Object.keys(e.boundVariables).length > 0 && !e.boundVariables.fills && await a.log(
          `  Node "${s.name || "Unnamed"}" (${e.type}) has boundVariables but not for fills: ${Object.keys(e.boundVariables).join(", ")}`
        );
      } catch (d) {
        console.log("Error setting fills:", d);
      }
    else if (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "GROUP")
      try {
        s.fills = [];
      } catch (d) {
        console.log("Error clearing fills:", d);
      }
  }
  if (e.strokes !== void 0)
    try {
      e.strokes.length > 0 ? s.strokes = e.strokes : s.strokes = [];
    } catch (d) {
      console.log("Error setting strokes:", d);
    }
  else if (e.type === "VECTOR")
    try {
      s.strokes = [];
    } catch (d) {
    }
  const B = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.strokeWeight || e.boundVariables.strokeAlign);
  e.strokeWeight !== void 0 ? (!B || !e.boundVariables.strokeWeight) && (s.strokeWeight = e.strokeWeight) : e.type === "VECTOR" && (e.strokes === void 0 || e.strokes.length === 0) && (!B || !e.boundVariables.strokeWeight) && (s.strokeWeight = 0), e.strokeAlign !== void 0 && (!B || !e.boundVariables.strokeAlign) && (s.strokeAlign = e.strokeAlign);
  const O = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.cornerRadius || e.boundVariables.topLeftRadius || e.boundVariables.topRightRadius || e.boundVariables.bottomLeftRadius || e.boundVariables.bottomRightRadius);
  if (e.cornerRadius !== void 0 && (!O || !e.boundVariables.cornerRadius) && (s.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (s.effects = e.effects), e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") {
    if (e.layoutMode !== void 0 && (s.layoutMode = e.layoutMode), e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.boundVariables && l) {
      const u = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ];
      for (const c of u) {
        const g = e.boundVariables[c];
        if (g && de(g)) {
          const b = g._varRef;
          if (b !== void 0) {
            const I = l.get(String(b));
            if (I) {
              const N = {
                type: "VARIABLE_ALIAS",
                id: I.id
              };
              s.boundVariables || (s.boundVariables = {});
              const S = s[c], M = (A = s.boundVariables) == null ? void 0 : A[c];
              await a.log(
                `  DEBUG: Attempting to set bound variable for ${c} on "${e.name || "Unnamed"}": current value=${S}, current boundVar=${JSON.stringify(M)}`
              );
              try {
                delete s.boundVariables[c];
              } catch (U) {
              }
              try {
                s.boundVariables[c] = N;
                const U = (C = s.boundVariables) == null ? void 0 : C[c];
                await a.log(
                  `  DEBUG: Immediately after setting ${c} bound variable: ${JSON.stringify(U)}`
                );
              } catch (U) {
                await a.warning(
                  `  Error setting bound variable for ${c}: ${U}`
                );
              }
              const x = (T = s.boundVariables) == null ? void 0 : T[c];
              x && typeof x == "object" && x.type === "VARIABLE_ALIAS" && x.id === I.id ? await a.log(
                `  ✓ Set bound variable for ${c} on "${e.name || "Unnamed"}" (${e.type}): variable ${I.name} (ID: ${I.id.substring(0, 8)}...)`
              ) : await a.warning(
                `  Failed to set bound variable for ${c} on "${e.name || "Unnamed"}" - verification failed. Expected: ${JSON.stringify(N)}, Got: ${JSON.stringify(x)}`
              );
            }
          }
        }
      }
    }
    e.layoutWrap !== void 0 && (s.layoutWrap = e.layoutWrap), e.primaryAxisSizingMode !== void 0 ? s.primaryAxisSizingMode = e.primaryAxisSizingMode : s.primaryAxisSizingMode = "AUTO", e.counterAxisSizingMode !== void 0 ? s.counterAxisSizingMode = e.counterAxisSizingMode : s.counterAxisSizingMode = "AUTO", e.primaryAxisAlignItems !== void 0 && (s.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (s.counterAxisAlignItems = e.counterAxisAlignItems);
    const d = e.boundVariables && typeof e.boundVariables == "object";
    if (d) {
      const u = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ].filter((c) => e.boundVariables[c]);
      u.length > 0 && await a.log(
        `  DEBUG: Node "${e.name || "Unnamed"}" (${e.type}) has bound variables for: ${u.join(", ")}`
      );
    }
    e.paddingLeft !== void 0 && (!d || !e.boundVariables.paddingLeft) && (s.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (!d || !e.boundVariables.paddingRight) && (s.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (!d || !e.boundVariables.paddingTop) && (s.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (!d || !e.boundVariables.paddingBottom) && (s.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (!d || !e.boundVariables.itemSpacing) && (s.itemSpacing = e.itemSpacing), e.layoutGrow !== void 0 && (s.layoutGrow = e.layoutGrow);
  }
  if ((e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (s.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (s.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (s.dashPattern = e.dashPattern), e.type === "VECTOR")) {
    if (e.fillGeometry !== void 0)
      try {
        const { normalizeSvgPath: u } = await Promise.resolve().then(() => Ft), c = e.fillGeometry.map((g) => {
          const b = g.data;
          return {
            data: u(b),
            windingRule: g.windingRule || g.windRule || "NONZERO"
          };
        });
        for (let g = 0; g < e.fillGeometry.length; g++) {
          const b = e.fillGeometry[g].data, I = c[g].data;
          b !== I && await a.log(
            `  Normalized path ${g + 1} for "${e.name || "Unnamed"}": ${b.substring(0, 50)}... -> ${I.substring(0, 50)}...`
          );
        }
        s.vectorPaths = c, await a.log(
          `  Set vectorPaths for VECTOR "${e.name || "Unnamed"}" (${c.length} path(s))`
        );
      } catch (u) {
        await a.warning(
          `Error setting vectorPaths for VECTOR "${e.name || "Unnamed"}": ${u}`
        );
      }
    if (e.strokeGeometry !== void 0)
      try {
        s.strokeGeometry = e.strokeGeometry;
      } catch (u) {
        await a.warning(
          `Error setting strokeGeometry for VECTOR "${e.name || "Unnamed"}": ${u}`
        );
      }
    const d = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
    if (e.width !== void 0 && e.height !== void 0 && !d)
      try {
        s.resize(e.width, e.height), await a.log(
          `  Set size for VECTOR "${e.name || "Unnamed"}" to ${e.width}x${e.height}`
        );
      } catch (u) {
        await a.warning(
          `Error setting size for VECTOR "${e.name || "Unnamed"}": ${u}`
        );
      }
  }
  if (e.type === "TEXT" && e.characters !== void 0)
    try {
      if (e.fontName)
        try {
          await figma.loadFontAsync(e.fontName), s.fontName = e.fontName;
        } catch (u) {
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
      const d = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.fontSize || e.boundVariables.letterSpacing || e.boundVariables.lineHeight);
      e.fontSize !== void 0 && (!d || !e.boundVariables.fontSize) && (s.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (s.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (s.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (!d || !e.boundVariables.letterSpacing) && (s.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (!d || !e.boundVariables.lineHeight) && (s.lineHeight = e.lineHeight), e.textCase !== void 0 && (s.textCase = e.textCase), e.textDecoration !== void 0 && (s.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (s.textAutoResize = e.textAutoResize);
    } catch (d) {
      console.log("Error setting text properties: " + d);
      try {
        s.characters = e.characters;
      } catch (u) {
        console.log("Could not set text characters: " + u);
      }
    }
  if (e.boundVariables && l) {
    const d = [
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "paddingBottom",
      "itemSpacing"
    ];
    for (const [u, c] of Object.entries(
      e.boundVariables
    ))
      if (u !== "fills" && !d.includes(u) && de(c) && n && l) {
        const g = c._varRef;
        if (g !== void 0) {
          const b = l.get(String(g));
          if (b)
            try {
              const I = {
                type: "VARIABLE_ALIAS",
                id: b.id
              };
              s.boundVariables || (s.boundVariables = {});
              const N = s[u];
              N !== void 0 && s.boundVariables[u] === void 0 && await a.warning(
                `  Property ${u} has direct value ${N} which may prevent bound variable from being set`
              ), s.boundVariables[u] = I;
              const M = (V = s.boundVariables) == null ? void 0 : V[u];
              if (M && typeof M == "object" && M.type === "VARIABLE_ALIAS" && M.id === b.id)
                await a.log(
                  `  ✓ Set bound variable for ${u} on "${e.name || "Unnamed"}" (${e.type}): variable ${b.name} (ID: ${b.id.substring(0, 8)}...)`
                );
              else {
                const x = (L = s.boundVariables) == null ? void 0 : L[u];
                await a.warning(
                  `  Failed to set bound variable for ${u} on "${e.name || "Unnamed"}" - bound variable not persisted. Property value: ${N}, Expected: ${JSON.stringify(I)}, Got: ${JSON.stringify(x)}`
                );
              }
            } catch (I) {
              await a.warning(
                `  Error setting bound variable for ${u} on "${e.name || "Unnamed"}": ${I}`
              );
            }
          else
            await a.warning(
              `  Variable reference ${g} not found in recognizedVariables for ${u} on "${e.name || "Unnamed"}"`
            );
        }
      }
  }
  if (e.boundVariables && l && (e.boundVariables.width || e.boundVariables.height)) {
    const d = e.boundVariables.width, u = e.boundVariables.height;
    if (d && de(d)) {
      const c = d._varRef;
      if (c !== void 0) {
        const g = l.get(String(c));
        if (g) {
          const b = {
            type: "VARIABLE_ALIAS",
            id: g.id
          };
          s.boundVariables || (s.boundVariables = {}), s.boundVariables.width = b;
        }
      }
    }
    if (u && de(u)) {
      const c = u._varRef;
      if (c !== void 0) {
        const g = l.get(String(c));
        if (g) {
          const b = {
            type: "VARIABLE_ALIAS",
            id: g.id
          };
          s.boundVariables || (s.boundVariables = {}), s.boundVariables.height = b;
        }
      }
    }
  }
  const G = e.id && r && r.has(e.id) && s.type === "COMPONENT" && s.children && s.children.length > 0;
  if (e.children && Array.isArray(e.children) && s.type !== "INSTANCE" && !G) {
    const d = (c) => {
      const g = [];
      for (const b of c)
        b._truncated || (b.type === "COMPONENT" ? (g.push(b), b.children && Array.isArray(b.children) && g.push(...d(b.children))) : b.children && Array.isArray(b.children) && g.push(...d(b.children)));
      return g;
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
    const u = d(e.children);
    await a.log(
      `  First pass: Creating ${u.length} COMPONENT node(s) (without children)...`
    );
    for (const c of u)
      await a.log(
        `  Collected COMPONENT "${c.name || "Unnamed"}" (ID: ${c.id ? c.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const c of u)
      if (c.id && r && !r.has(c.id)) {
        const g = figma.createComponent();
        if (c.name !== void 0 && (g.name = c.name || "Unnamed Node"), c.componentPropertyDefinitions) {
          const b = c.componentPropertyDefinitions;
          let I = 0, N = 0;
          for (const [S, M] of Object.entries(b))
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
              }[M.type];
              if (!U) {
                await a.warning(
                  `  Unknown property type ${M.type} for property "${S}" in component "${c.name || "Unnamed"}"`
                ), N++;
                continue;
              }
              const W = M.defaultValue, K = S.split("#")[0];
              g.addComponentProperty(
                K,
                U,
                W
              ), I++;
            } catch (x) {
              await a.warning(
                `  Failed to add component property "${S}" to "${c.name || "Unnamed"}" in first pass: ${x}`
              ), N++;
            }
          I > 0 && await a.log(
            `  Added ${I} component property definition(s) to "${c.name || "Unnamed"}" in first pass${N > 0 ? ` (${N} failed)` : ""}`
          );
        }
        r.set(c.id, g), await a.log(
          `  Created COMPONENT "${c.name || "Unnamed"}" (ID: ${c.id.substring(0, 8)}...) in first pass`
        );
      }
    for (const c of e.children) {
      if (c._truncated)
        continue;
      const g = await ye(
        c,
        s,
        n,
        i,
        o,
        l,
        r,
        p,
        f,
        null,
        // deferredInstances - not needed for remote structures
        e,
        // parentNodeData - pass the parent's nodeData so children can check for auto-layout
        E
      );
      if (g && g.parent !== s) {
        if (g.parent && typeof g.parent.removeChild == "function")
          try {
            g.parent.removeChild(g);
          } catch (b) {
            await a.warning(
              `Failed to remove child "${g.name || "Unnamed"}" from parent "${g.parent.name || "Unnamed"}": ${b}`
            );
          }
        s.appendChild(g);
      }
    }
  }
  if (t && s.parent !== t) {
    if (s.parent && typeof s.parent.removeChild == "function")
      try {
        s.parent.removeChild(s);
      } catch (d) {
        await a.warning(
          `Failed to remove node "${s.name || "Unnamed"}" from parent "${s.parent.name || "Unnamed"}": ${d}`
        );
      }
    t.appendChild(s);
  }
  return s;
}
async function oa(e, t, n) {
  let i = 0, o = 0, l = 0;
  const r = (f) => {
    const h = [];
    if (f.type === "INSTANCE" && h.push(f), "children" in f && f.children)
      for (const y of f.children)
        h.push(...r(y));
    return h;
  }, p = r(e);
  await a.log(
    `  Found ${p.length} instance(s) to process for variant properties`
  );
  for (const f of p)
    try {
      const h = await f.getMainComponentAsync();
      if (!h) {
        o++;
        continue;
      }
      const y = t.getSerializedTable();
      let E = null, s;
      if (n._instanceTableMap ? (s = n._instanceTableMap.get(
        f.id
      ), s !== void 0 ? (E = y[s], await a.log(
        `  Found instance table index ${s} for instance "${f.name}" (ID: ${f.id.substring(0, 8)}...)`
      )) : await a.log(
        `  No instance table index mapping found for instance "${f.name}" (ID: ${f.id.substring(0, 8)}...), using fallback matching`
      )) : await a.log(
        `  No instance table map found, using fallback matching for instance "${f.name}"`
      ), !E) {
        for (const [$, w] of Object.entries(y))
          if (w.instanceType === "internal" && w.componentNodeId && n.has(w.componentNodeId)) {
            const m = n.get(w.componentNodeId);
            if (m && m.id === h.id) {
              E = w, await a.log(
                `  Matched instance "${f.name}" to instance table entry ${$} by component (less precise)`
              );
              break;
            }
          }
      }
      if (!E) {
        await a.log(
          `  No matching entry found for instance "${f.name}" (main component: ${h.name}, ID: ${h.id.substring(0, 8)}...)`
        ), o++;
        continue;
      }
      if (!E.variantProperties) {
        await a.log(
          `  Instance table entry for "${f.name}" has no variant properties`
        ), o++;
        continue;
      }
      await a.log(
        `  Instance "${f.name}" matched to entry with variant properties: ${JSON.stringify(E.variantProperties)}`
      );
      let v = null;
      if (h.parent && h.parent.type === "COMPONENT_SET" && (v = h.parent.componentPropertyDefinitions), v) {
        const $ = {};
        for (const [w, m] of Object.entries(
          E.variantProperties
        )) {
          const R = w.split("#")[0];
          v[R] && ($[R] = m);
        }
        Object.keys($).length > 0 ? (f.setProperties($), i++, await a.log(
          `  ✓ Set variant properties on instance "${f.name}": ${JSON.stringify($)}`
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
async function Xe(e) {
  await figma.loadAllPagesAsync();
  const t = figma.root.children, n = new Set(t.map((l) => l.name));
  if (!n.has(e))
    return e;
  let i = 1, o = `${e}_${i}`;
  for (; n.has(o); )
    i++, o = `${e}_${i}`;
  return o;
}
async function sa(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), n = new Set(t.map((l) => l.name));
  if (!n.has(e))
    return e;
  let i = 1, o = `${e}_${i}`;
  for (; n.has(o); )
    i++, o = `${e}_${i}`;
  return o;
}
async function ca(e, t) {
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
function st(e, t) {
  const n = e.resolvedType.toUpperCase(), i = t.toUpperCase();
  return n === i;
}
async function la(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), n = Q(e.collectionName);
  if (ce(e.collectionName)) {
    for (const i of t)
      if (Q(i.name) === n)
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
        ie
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
function da(e) {
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
function Je(e) {
  if (!e.stringTable)
    return {
      success: !1,
      error: "Invalid JSON format. String table is required."
    };
  let t;
  try {
    t = Oe.fromTable(e.stringTable);
  } catch (i) {
    return {
      success: !1,
      error: `Failed to load string table: ${i instanceof Error ? i.message : "Unknown error"}`
    };
  }
  const n = Zt(e, t);
  return {
    success: !0,
    stringTable: t,
    expandedJsonData: n
  };
}
function pa(e) {
  if (!e.collections)
    return {
      success: !1,
      error: "No collections table found in JSON"
    };
  try {
    return {
      success: !0,
      collectionTable: $e.fromTable(
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
async function ga(e, t) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), l = e.getTable();
  for (const [r, p] of Object.entries(l)) {
    if (p.isLocal === !1) {
      await a.log(
        `Skipping remote collection: "${p.collectionName}" (index ${r})`
      );
      continue;
    }
    const f = Q(p.collectionName), h = t == null ? void 0 : t.get(f);
    if (h) {
      await a.log(
        `✓ Using pre-created collection: "${f}" (index ${r})`
      ), n.set(r, h);
      continue;
    }
    const y = await la(p);
    y.matchType === "recognized" ? (await a.log(
      `✓ Recognized collection by GUID: "${p.collectionName}" (index ${r})`
    ), n.set(r, y.collection)) : y.matchType === "potential" ? (await a.log(
      `? Potential match by name: "${p.collectionName}" (index ${r})`
    ), i.set(r, {
      entry: p,
      collection: y.collection
    })) : (await a.log(
      `✗ No match found for collection: "${p.collectionName}" (index ${r}) - will create new`
    ), o.set(r, p));
  }
  return await a.log(
    `Collection matching complete: ${n.size} recognized, ${i.size} potential matches, ${o.size} to create`
  ), {
    recognizedCollections: n,
    potentialMatches: i,
    collectionsToCreate: o
  };
}
async function fa(e, t, n, i) {
  if (e.size !== 0) {
    if (i) {
      await a.log(
        `Using wizard selections for ${e.size} potential match(es)...`
      );
      for (const [o, { entry: l, collection: r }] of e.entries()) {
        const p = Q(
          l.collectionName
        ).toLowerCase();
        let f = !1;
        p === "tokens" || p === "token" ? f = i.tokens === "existing" : p === "theme" || p === "themes" ? f = i.theme === "existing" : (p === "layer" || p === "layers") && (f = i.layers === "existing");
        const h = ce(l.collectionName) ? Q(l.collectionName) : r.name;
        f ? (await a.log(
          `✓ Wizard selection: Using existing collection "${h}" (index ${o})`
        ), t.set(o, r), await pe(r, l.modes), await a.log(
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
        const p = ce(l.collectionName) ? Q(l.collectionName) : r.name, f = `Found existing "${p}" variable collection. Should I use it?`;
        await a.log(
          `Prompting user about potential match: "${p}"`
        ), await he.prompt(f, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await a.log(
          `✓ User confirmed: Using existing collection "${p}" (index ${o})`
        ), t.set(o, r), await pe(r, l.modes), await a.log(
          `  ✓ Ensured modes for collection "${p}" (${l.modes.length} mode(s))`
        );
      } catch (p) {
        await a.log(
          `✗ User rejected: Will create new collection for "${l.collectionName}" (index ${o})`
        ), n.set(o, l);
      }
  }
}
async function ma(e, t, n) {
  if (e.size === 0)
    return;
  await a.log("Ensuring modes exist for recognized collections...");
  const i = t.getTable();
  for (const [o, l] of e.entries()) {
    const r = i[o];
    r && (n.has(o) || (await pe(l, r.modes), await a.log(
      `  ✓ Ensured modes for collection "${l.name}" (${r.modes.length} mode(s))`
    )));
  }
}
async function ua(e, t, n, i) {
  if (e.size !== 0) {
    await a.log(
      `Processing ${e.size} collection(s) to create...`
    );
    for (const [o, l] of e.entries()) {
      const r = Q(l.collectionName), p = i == null ? void 0 : i.get(r);
      if (p) {
        await a.log(
          `Reusing pre-created collection: "${r}" (index ${o}, id: ${p.id.substring(0, 8)}...)`
        ), t.set(o, p), await pe(p, l.modes), n.push(p);
        continue;
      }
      const f = await sa(r);
      f !== r ? await a.log(
        `Creating collection: "${f}" (normalized: "${r}" - name conflict resolved)`
      ) : await a.log(`Creating collection: "${f}"`);
      const h = figma.variables.createVariableCollection(f);
      n.push(h);
      let y;
      if (ce(l.collectionName)) {
        const E = Te(l.collectionName);
        E && (y = E);
      } else l.collectionGuid && (y = l.collectionGuid);
      y && (h.setSharedPluginData(
        "recursica",
        ie,
        y
      ), await a.log(
        `  Stored GUID: ${y.substring(0, 8)}...`
      )), await pe(h, l.modes), await a.log(
        `  ✓ Created collection "${f}" with ${l.modes.length} mode(s)`
      ), t.set(o, h);
    }
    await a.log("Collection creation complete");
  }
}
function ha(e) {
  if (!e.variables)
    return {
      success: !1,
      error: "No variables table found in JSON"
    };
  try {
    return {
      success: !0,
      variableTable: Ne.fromTable(e.variables)
    };
  } catch (t) {
    return {
      success: !1,
      error: `Failed to load variables table: ${t instanceof Error ? t.message : "Unknown error"}`
    };
  }
}
async function ya(e, t, n, i) {
  const o = /* @__PURE__ */ new Map(), l = [], r = new Set(
    i.map((h) => h.id)
  );
  await a.log("Matching and creating variables in collections...");
  const p = e.getTable(), f = /* @__PURE__ */ new Map();
  for (const [h, y] of Object.entries(p)) {
    if (y._colRef === void 0)
      continue;
    const E = n.get(String(y._colRef));
    if (!E)
      continue;
    f.has(E.id) || f.set(E.id, {
      collectionName: E.name,
      existing: 0,
      created: 0
    });
    const s = f.get(E.id), v = r.has(
      E.id
    );
    let $;
    typeof y.variableType == "number" ? $ = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[y.variableType] || String(y.variableType) : $ = y.variableType;
    const w = await De(
      E,
      y.variableName
    );
    if (w)
      if (st(w, $))
        o.set(h, w), s.existing++;
      else {
        await a.warning(
          `Type mismatch for variable "${y.variableName}" in collection "${E.name}": expected ${$}, found ${w.resolvedType}. Creating new variable with incremented name.`
        );
        const m = await ca(
          E,
          y.variableName
        ), R = await ze(
          Z(j({}, y), {
            variableName: m,
            variableType: $
          }),
          E,
          e,
          t
        );
        v || l.push(R), o.set(h, R), s.created++;
      }
    else {
      const m = await ze(
        Z(j({}, y), {
          variableType: $
        }),
        E,
        e,
        t
      );
      v || l.push(m), o.set(h, m), s.created++;
    }
  }
  await a.log("Variable processing complete:");
  for (const h of f.values())
    await a.log(
      `  "${h.collectionName}": ${h.existing} existing, ${h.created} created`
    );
  return {
    recognizedVariables: o,
    newlyCreatedVariables: l
  };
}
function ba(e) {
  if (!e.instances)
    return null;
  try {
    return ve.fromTable(e.instances);
  } catch (t) {
    return null;
  }
}
function wa(e) {
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
function We(e) {
  if (!e || typeof e != "object")
    return;
  e.type !== void 0 && (e.type = wa(e.type));
  const t = e.children !== void 0 ? "children" : e.child !== void 0 ? "child" : null;
  if (t && (t === "child" && !e.children && (e.children = e.child, delete e.child), Array.isArray(e.children)))
    for (const n of e.children)
      We(n);
  e.fillG !== void 0 && e.fillGeometry === void 0 && (e.fillGeometry = e.fillG, delete e.fillG), e.strkG !== void 0 && e.strokeGeometry === void 0 && (e.strokeGeometry = e.strkG, delete e.strkG), e.child && !e.children && (e.children = e.child, delete e.child);
}
async function $a(e, t) {
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
async function Na(e, t, n, i, o, l = "") {
  var $;
  const r = e.getSerializedTable(), p = Object.values(r).filter(
    (w) => w.instanceType === "remote"
  ), f = /* @__PURE__ */ new Map();
  if (p.length === 0)
    return await a.log("No remote instances found"), f;
  await a.log(
    `Processing ${p.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  const h = figma.root.children, y = l ? `${l} REMOTES` : "REMOTES";
  let E = h.find(
    (w) => w.name === "REMOTES" || w.name === y
  );
  if (E ? (await a.log("Found existing REMOTES page"), l && !E.name.startsWith(l) && (E.name = y)) : (E = figma.createPage(), E.name = y, await a.log("Created REMOTES page")), p.length > 0 && (E.setPluginData("RecursicaUnderReview", "true"), await a.log("Marked REMOTES page as under review")), !E.children.some(
    (w) => w.type === "FRAME" && w.name === "Title"
  )) {
    const w = { family: "Inter", style: "Bold" }, m = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(w), await figma.loadFontAsync(m);
    const R = figma.createFrame();
    R.name = "Title", R.layoutMode = "VERTICAL", R.paddingTop = 20, R.paddingBottom = 20, R.paddingLeft = 20, R.paddingRight = 20, R.fills = [];
    const k = figma.createText();
    k.fontName = w, k.characters = "REMOTE INSTANCES", k.fontSize = 24, k.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], R.appendChild(k);
    const B = figma.createText();
    B.fontName = m, B.characters = "These are remotely connected component instances found in our different component pages.", B.fontSize = 14, B.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], R.appendChild(B), E.appendChild(R), await a.log("Created title and description on REMOTES page");
  }
  const v = /* @__PURE__ */ new Map();
  for (const [w, m] of Object.entries(r)) {
    if (m.instanceType !== "remote")
      continue;
    const R = parseInt(w, 10);
    if (await a.log(
      `Processing remote instance ${R}: "${m.componentName}"`
    ), !m.structure) {
      await a.warning(
        `Remote instance "${m.componentName}" missing structure data, skipping`
      );
      continue;
    }
    We(m.structure);
    const k = m.structure.children !== void 0, B = m.structure.child !== void 0, O = m.structure.children ? m.structure.children.length : m.structure.child ? m.structure.child.length : 0;
    await a.log(
      `  Structure type: ${m.structure.type || "unknown"}, has children: ${O} (children key: ${k}, child key: ${B})`
    );
    let G = m.componentName;
    if (m.path && m.path.length > 0) {
      const A = m.path.filter((C) => C !== "").join(" / ");
      A && (G = `${A} / ${m.componentName}`);
    }
    const P = await $a(
      E,
      G
    );
    P !== G && await a.log(
      `Component name conflict: "${G}" -> "${P}"`
    );
    try {
      if (m.structure.type !== "COMPONENT") {
        await a.warning(
          `Remote instance "${m.componentName}" structure is not a COMPONENT (type: ${m.structure.type}), creating frame fallback`
        );
        const C = figma.createFrame();
        C.name = P;
        const T = await ye(
          m.structure,
          C,
          t,
          n,
          null,
          i,
          v,
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
        T ? (C.appendChild(T), E.appendChild(C), await a.log(
          `✓ Created remote instance frame fallback: "${P}"`
        )) : C.remove();
        continue;
      }
      const A = figma.createComponent();
      A.name = P, E.appendChild(A), await a.log(
        `  Created component node: "${P}"`
      );
      try {
        if (m.structure.componentPropertyDefinitions) {
          const c = m.structure.componentPropertyDefinitions;
          let g = 0, b = 0;
          for (const [I, N] of Object.entries(c))
            try {
              const M = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[N.type];
              if (!M) {
                await a.warning(
                  `  Unknown property type ${N.type} for property "${I}" in component "${m.componentName}"`
                ), b++;
                continue;
              }
              const x = N.defaultValue, U = I.split("#")[0];
              A.addComponentProperty(
                U,
                M,
                x
              ), g++;
            } catch (S) {
              await a.warning(
                `  Failed to add component property "${I}" to "${m.componentName}": ${S}`
              ), b++;
            }
          g > 0 && await a.log(
            `  Added ${g} component property definition(s) to "${m.componentName}"${b > 0 ? ` (${b} failed)` : ""}`
          );
        }
        m.structure.name !== void 0 && (A.name = m.structure.name);
        const C = m.structure.boundVariables && typeof m.structure.boundVariables == "object" && (m.structure.boundVariables.width || m.structure.boundVariables.height);
        m.structure.width !== void 0 && m.structure.height !== void 0 && !C && A.resize(m.structure.width, m.structure.height), m.structure.x !== void 0 && (A.x = m.structure.x), m.structure.y !== void 0 && (A.y = m.structure.y);
        const T = m.structure.boundVariables && typeof m.structure.boundVariables == "object";
        if (m.structure.visible !== void 0 && (A.visible = m.structure.visible), m.structure.opacity !== void 0 && (!T || !m.structure.boundVariables.opacity) && (A.opacity = m.structure.opacity), m.structure.rotation !== void 0 && (!T || !m.structure.boundVariables.rotation) && (A.rotation = m.structure.rotation), m.structure.blendMode !== void 0 && (!T || !m.structure.boundVariables.blendMode) && (A.blendMode = m.structure.blendMode), m.structure.fills !== void 0)
          try {
            let c = m.structure.fills;
            Array.isArray(c) && (c = c.map((g) => {
              if (g && typeof g == "object") {
                const b = j({}, g);
                return delete b.boundVariables, b;
              }
              return g;
            })), A.fills = c, ($ = m.structure.boundVariables) != null && $.fills && i && await ia(
              A,
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
            A.strokes = m.structure.strokes;
          } catch (c) {
            await a.warning(
              `Error setting strokes for remote component "${m.componentName}": ${c}`
            );
          }
        const V = m.structure.boundVariables && typeof m.structure.boundVariables == "object" && (m.structure.boundVariables.strokeWeight || m.structure.boundVariables.strokeAlign);
        m.structure.strokeWeight !== void 0 && (!V || !m.structure.boundVariables.strokeWeight) && (A.strokeWeight = m.structure.strokeWeight), m.structure.strokeAlign !== void 0 && (!V || !m.structure.boundVariables.strokeAlign) && (A.strokeAlign = m.structure.strokeAlign), m.structure.layoutMode !== void 0 && (A.layoutMode = m.structure.layoutMode), m.structure.primaryAxisSizingMode !== void 0 && (A.primaryAxisSizingMode = m.structure.primaryAxisSizingMode), m.structure.counterAxisSizingMode !== void 0 && (A.counterAxisSizingMode = m.structure.counterAxisSizingMode);
        const L = m.structure.boundVariables && typeof m.structure.boundVariables == "object";
        m.structure.paddingLeft !== void 0 && (!L || !m.structure.boundVariables.paddingLeft) && (A.paddingLeft = m.structure.paddingLeft), m.structure.paddingRight !== void 0 && (!L || !m.structure.boundVariables.paddingRight) && (A.paddingRight = m.structure.paddingRight), m.structure.paddingTop !== void 0 && (!L || !m.structure.boundVariables.paddingTop) && (A.paddingTop = m.structure.paddingTop), m.structure.paddingBottom !== void 0 && (!L || !m.structure.boundVariables.paddingBottom) && (A.paddingBottom = m.structure.paddingBottom), m.structure.itemSpacing !== void 0 && (!L || !m.structure.boundVariables.itemSpacing) && (A.itemSpacing = m.structure.itemSpacing);
        const d = m.structure.boundVariables && typeof m.structure.boundVariables == "object" && (m.structure.boundVariables.cornerRadius || m.structure.boundVariables.topLeftRadius || m.structure.boundVariables.topRightRadius || m.structure.boundVariables.bottomLeftRadius || m.structure.boundVariables.bottomRightRadius);
        if (m.structure.cornerRadius !== void 0 && (!d || !m.structure.boundVariables.cornerRadius) && (A.cornerRadius = m.structure.cornerRadius), m.structure.boundVariables && i) {
          const c = m.structure.boundVariables, g = [
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
          for (const b of g)
            if (c[b] && de(c[b])) {
              const I = c[b]._varRef;
              if (I !== void 0) {
                const N = i.get(String(I));
                if (N) {
                  const S = {
                    type: "VARIABLE_ALIAS",
                    id: N.id
                  };
                  A.boundVariables || (A.boundVariables = {}), A.boundVariables[b] = S;
                }
              }
            }
        }
        await a.log(
          `  DEBUG: Structure keys: ${Object.keys(m.structure).join(", ")}, has children: ${!!m.structure.children}, has child: ${!!m.structure.child}`
        );
        const u = m.structure.children || (m.structure.child ? m.structure.child : null);
        if (await a.log(
          `  DEBUG: childrenArray exists: ${!!u}, isArray: ${Array.isArray(u)}, length: ${u ? u.length : 0}`
        ), u && Array.isArray(u) && u.length > 0) {
          await a.log(
            `  Recreating ${u.length} child(ren) for component "${m.componentName}"`
          );
          for (let c = 0; c < u.length; c++) {
            const g = u[c];
            if (await a.log(
              `  DEBUG: Processing child ${c + 1}/${u.length}: ${JSON.stringify({ name: g == null ? void 0 : g.name, type: g == null ? void 0 : g.type, hasTruncated: !!(g != null && g._truncated) })}`
            ), g._truncated) {
              await a.log(
                `  Skipping truncated child: ${g._reason || "Unknown"}`
              );
              continue;
            }
            await a.log(
              `  Recreating child: "${g.name || "Unnamed"}" (type: ${g.type})`
            );
            const b = await ye(
              g,
              A,
              t,
              n,
              null,
              i,
              v,
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
            b ? (A.appendChild(b), await a.log(
              `  ✓ Appended child "${g.name || "Unnamed"}" to component "${m.componentName}"`
            )) : await a.warning(
              `  ✗ Failed to create child "${g.name || "Unnamed"}" (type: ${g.type})`
            );
          }
        }
        f.set(R, A), await a.log(
          `✓ Created remote component: "${P}" (index ${R})`
        );
      } catch (C) {
        await a.warning(
          `Error populating remote component "${m.componentName}": ${C instanceof Error ? C.message : "Unknown error"}`
        ), A.remove();
      }
    } catch (A) {
      await a.warning(
        `Error recreating remote instance "${m.componentName}": ${A instanceof Error ? A.message : "Unknown error"}`
      );
    }
  }
  return await a.log(
    `Remote instance processing complete: ${f.size} component(s) created`
  ), f;
}
async function va(e, t, n, i, o, l, r = null, p = null, f = !1, h = null, y = !1, E = !1, s = "") {
  await a.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const v = figma.root.children, $ = "RecursicaPublishedMetadata";
  let w = null;
  for (const T of v) {
    const V = T.getPluginData($);
    if (V)
      try {
        if (JSON.parse(V).id === e.guid) {
          w = T;
          break;
        }
      } catch (L) {
        continue;
      }
  }
  let m = !1;
  if (w && !f && !y) {
    let T;
    try {
      const d = w.getPluginData($);
      d && (T = JSON.parse(d).version);
    } catch (d) {
    }
    const V = T !== void 0 ? ` v${T}` : "", L = `Found existing component "${w.name}${V}". Should I use it or create a copy?`;
    await a.log(
      `Found existing page with same GUID: "${w.name}". Prompting user...`
    );
    try {
      await he.prompt(L, {
        okLabel: "Use",
        cancelLabel: "Copy",
        timeoutMs: 3e5
        // 5 minutes
      }), m = !0, await a.log(
        `User chose to use existing page: "${w.name}"`
      );
    } catch (d) {
      await a.log(
        "User chose to create a copy. Will create new page."
      );
    }
  }
  if (m && w)
    return await figma.setCurrentPageAsync(w), await a.log(
      `Using existing page: "${w.name}" (GUID: ${e.guid.substring(0, 8)}...)`
    ), await a.log(
      `  Instances from other pages will resolve to components on this existing page using componentPageName: "${w.name}"`
    ), {
      success: !0,
      page: w,
      // Include pageId so it can be tracked in importedPages
      pageId: w.id
    };
  const R = v.find((T) => T.name === e.name);
  R && await a.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let k;
  if (w || R) {
    const T = `__${e.name}`;
    k = await Xe(T), await a.log(
      `Creating scratch page: "${k}" (will be renamed to "${e.name}" on success)`
    );
  } else
    k = e.name, await a.log(`Creating page: "${k}"`);
  const B = figma.createPage();
  if (B.name = k, await figma.setCurrentPageAsync(B), await a.log(`Switched to page: "${k}"`), !t.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await a.log("Recreating page structure...");
  const O = t.pageData;
  if (O.backgrounds !== void 0)
    try {
      B.backgrounds = O.backgrounds, await a.log(
        `Set page background: ${JSON.stringify(O.backgrounds)}`
      );
    } catch (T) {
      await a.warning(`Failed to set page background: ${T}`);
    }
  We(O);
  const G = /* @__PURE__ */ new Map(), P = (T, V = []) => {
    if (T.type === "COMPONENT" && T.id && V.push(T.id), T.children && Array.isArray(T.children))
      for (const L of T.children)
        L._truncated || P(L, V);
    return V;
  }, A = P(O);
  if (await a.log(
    `Found ${A.length} COMPONENT node(s) in page data`
  ), A.length > 0 && (await a.log(
    `Component IDs in page data (first 20): ${A.slice(0, 20).map((T) => T.substring(0, 8) + "...").join(", ")}`
  ), O._allComponentIds = A), O.children && Array.isArray(O.children))
    for (const T of O.children) {
      const V = await ye(
        T,
        B,
        n,
        i,
        o,
        l,
        G,
        !1,
        // isRemoteStructure: false - we're creating the main page
        r,
        p,
        O,
        // parentNodeData - pass the page's nodeData so children can check for auto-layout
        h
      );
      V && B.appendChild(V);
    }
  await a.log("Page structure recreated successfully"), o && (await a.log(
    "Third pass: Setting variant properties on instances..."
  ), await oa(
    B,
    o,
    G
  ));
  const C = {
    _ver: 1,
    id: e.guid,
    name: e.name,
    version: e.version || 0,
    publishDate: (/* @__PURE__ */ new Date()).toISOString(),
    history: {}
  };
  if (B.setPluginData($, JSON.stringify(C)), await a.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), k.startsWith("__")) {
    let T;
    E ? T = s ? `${s} ${e.name}` : e.name : T = await Xe(e.name), B.name = T, await a.log(`Renamed page from "${k}" to "${T}"`);
  } else E && s && (B.name.startsWith(s) || (B.name = `${s} ${B.name}`));
  return {
    success: !0,
    page: B
  };
}
async function ct(e) {
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
    const p = da(r);
    if (!p.success)
      return await a.error(p.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: p.error,
        data: {}
      };
    const f = p.metadata;
    await a.log(
      `Metadata validated: guid=${f.guid}, name=${f.name}`
    ), await a.log("Loading string table...");
    const h = Je(r);
    if (!h.success)
      return await a.error(h.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: h.error,
        data: {}
      };
    await a.log("String table loaded successfully"), await a.log("Expanding JSON data...");
    const y = h.expandedJsonData;
    await a.log("JSON expanded successfully"), await a.log("Loading collections table...");
    const E = pa(y);
    if (!E.success)
      return E.error === "No collections table found in JSON" ? (await a.log(E.error), await a.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: f.name }
      }) : (await a.error(E.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: E.error,
        data: {}
      });
    const s = E.collectionTable;
    await a.log(
      `Loaded collections table with ${s.getSize()} collection(s)`
    ), await a.log(
      "Matching collections with existing local collections..."
    );
    const { recognizedCollections: v, potentialMatches: $, collectionsToCreate: w } = await ga(s, e.preCreatedCollections);
    await fa(
      $,
      v,
      w,
      e.collectionChoices
    ), await ma(
      v,
      s,
      $
    ), await ua(
      w,
      v,
      n,
      e.preCreatedCollections
    ), await a.log("Loading variables table...");
    const m = ha(y);
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
    const R = m.variableTable;
    await a.log(
      `Loaded variables table with ${R.getSize()} variable(s)`
    );
    const { recognizedVariables: k, newlyCreatedVariables: B } = await ya(
      R,
      s,
      v,
      n
    );
    await a.log("Loading instance table...");
    const O = ba(y);
    if (O) {
      const b = O.getSerializedTable(), I = Object.values(b).filter(
        (S) => S.instanceType === "internal"
      ), N = Object.values(b).filter(
        (S) => S.instanceType === "remote"
      );
      await a.log(
        `Loaded instance table with ${O.getSize()} instance(s) (${I.length} internal, ${N.length} remote)`
      );
    } else
      await a.log("No instance table found in JSON");
    const G = [], P = (i = e.isMainPage) != null ? i : !0, A = (o = e.alwaysCreateCopy) != null ? o : !1, C = (l = e.skipUniqueNaming) != null ? l : !1, T = e.constructionIcon || "";
    let V = null;
    O && (V = await Na(
      O,
      R,
      s,
      k,
      v,
      T
    ));
    const L = await va(
      f,
      y,
      R,
      s,
      O,
      k,
      V,
      G,
      P,
      v,
      A,
      C,
      T
    );
    if (!L.success)
      return await a.error(L.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: L.error,
        data: {}
      };
    const d = L.page, u = k.size + B.length, c = G.length;
    await a.log("=== Import Complete ==="), await a.log(
      `Successfully processed ${v.size} collection(s), ${u} variable(s), and created page "${d.name}"${c > 0 ? ` (${c} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`
    );
    const g = L.pageId || d.id;
    return {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: {
        pageName: d.name,
        pageId: g,
        // Include pageId for tracking (used for both new and reused pages)
        deferredInstances: c > 0 ? G : void 0,
        createdEntities: {
          pageIds: [d.id],
          collectionIds: n.map((b) => b.id),
          variableIds: B.map((b) => b.id)
        }
      }
    };
  } catch (r) {
    const p = r instanceof Error ? r.message : "Unknown error occurred";
    return await a.error(`Import failed: ${p}`), r instanceof Error && r.stack && await a.error(`Stack trace: ${r.stack}`), console.error("Error importing page:", r), {
      type: "importPage",
      success: !1,
      error: !0,
      message: p,
      data: {}
    };
  }
}
async function lt(e) {
  if (e.length === 0)
    return { resolved: 0, failed: 0, errors: [] };
  await a.log(
    `=== Resolving ${e.length} deferred normal instance(s) ===`
  );
  let t = 0, n = 0;
  const i = [];
  await figma.loadAllPagesAsync();
  for (const o of e)
    try {
      const { placeholderFrame: l, instanceEntry: r, nodeData: p, parentNode: f } = o, h = figma.root.children.find(
        ($) => $.name === r.componentPageName
      );
      if (!h) {
        const $ = `Deferred instance "${p.name}" still cannot find referenced page "${r.componentPageName}"`;
        await a.error($), i.push($), n++;
        continue;
      }
      const y = ($, w, m, R, k) => {
        if (w.length === 0) {
          let G = null;
          for (const P of $.children || [])
            if (P.type === "COMPONENT") {
              if (P.name === m)
                if (G || (G = P), R)
                  try {
                    const A = P.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (A && JSON.parse(A).id === R)
                      return P;
                  } catch (A) {
                  }
                else
                  return P;
            } else if (P.type === "COMPONENT_SET") {
              if (k && P.name !== k)
                continue;
              for (const A of P.children || [])
                if (A.type === "COMPONENT" && A.name === m)
                  if (G || (G = A), R)
                    try {
                      const C = A.getPluginData(
                        "RecursicaPublishedMetadata"
                      );
                      if (C && JSON.parse(C).id === R)
                        return A;
                    } catch (C) {
                    }
                  else
                    return A;
            }
          return G;
        }
        const [B, ...O] = w;
        for (const G of $.children || [])
          if (G.name === B) {
            if (O.length === 0 && G.type === "COMPONENT_SET") {
              if (k && G.name !== k)
                continue;
              for (const P of G.children || [])
                if (P.type === "COMPONENT" && P.name === m) {
                  if (R)
                    try {
                      const A = P.getPluginData(
                        "RecursicaPublishedMetadata"
                      );
                      if (A && JSON.parse(A).id === R)
                        return P;
                    } catch (A) {
                    }
                  return P;
                }
              return null;
            }
            return y(
              G,
              O,
              m,
              R,
              k
            );
          }
        return null;
      }, E = y(
        h,
        r.path || [],
        r.componentName,
        r.componentGuid,
        r.componentSetName
      );
      if (!E) {
        const $ = r.path && r.path.length > 0 ? ` at path [${r.path.join(" → ")}]` : " at page root", w = `Deferred instance "${p.name}" still cannot find component "${r.componentName}" on page "${r.componentPageName}"${$}`;
        await a.error(w), i.push(w), n++;
        continue;
      }
      const s = E.createInstance();
      if (s.name = p.name || l.name.replace("[Deferred: ", "").replace("]", ""), s.x = l.x, s.y = l.y, l.width !== void 0 && l.height !== void 0 && s.resize(l.width, l.height), r.variantProperties && Object.keys(r.variantProperties).length > 0)
        try {
          const $ = await s.getMainComponentAsync();
          if ($) {
            let w = null;
            const m = $.type;
            if (m === "COMPONENT_SET" ? w = $.componentPropertyDefinitions : m === "COMPONENT" && $.parent && $.parent.type === "COMPONENT_SET" ? w = $.parent.componentPropertyDefinitions : await a.warning(
              `Cannot set variant properties for resolved instance "${p.name}" - main component is not a COMPONENT_SET or variant`
            ), w) {
              const R = {};
              for (const [k, B] of Object.entries(
                r.variantProperties
              )) {
                const O = k.split("#")[0];
                w[O] && (R[O] = B);
              }
              Object.keys(R).length > 0 && s.setProperties(R);
            }
          }
        } catch ($) {
          await a.warning(
            `Failed to set variant properties for resolved instance "${p.name}": ${$}`
          );
        }
      if (r.componentProperties && Object.keys(r.componentProperties).length > 0)
        try {
          const $ = await s.getMainComponentAsync();
          if ($) {
            let w = null;
            const m = $.type;
            if (m === "COMPONENT_SET" ? w = $.componentPropertyDefinitions : m === "COMPONENT" && $.parent && $.parent.type === "COMPONENT_SET" ? w = $.parent.componentPropertyDefinitions : m === "COMPONENT" && (w = $.componentPropertyDefinitions), w)
              for (const [R, k] of Object.entries(
                r.componentProperties
              )) {
                const B = R.split("#")[0];
                if (w[B])
                  try {
                    s.setProperties({
                      [B]: k
                    });
                  } catch (O) {
                    await a.warning(
                      `Failed to set component property "${B}" for resolved instance "${p.name}": ${O}`
                    );
                  }
              }
          }
        } catch ($) {
          await a.warning(
            `Failed to set component properties for resolved instance "${p.name}": ${$}`
          );
        }
      const v = f.children.indexOf(l);
      f.insertChild(v, s), l.remove(), await a.log(
        `  ✓ Resolved deferred instance "${p.name}" from component "${r.componentName}" on page "${r.componentPageName}"`
      ), t++;
    } catch (l) {
      const r = l instanceof Error ? l.message : String(l), p = `Failed to resolve deferred instance "${o.nodeData.name}": ${r}`;
      await a.error(p), i.push(p), n++;
    }
  return await a.log(
    `=== Deferred Resolution Complete: ${t} resolved, ${n} failed ===`
  ), { resolved: t, failed: n, errors: i };
}
async function Ea(e) {
  await a.log("=== Cleaning up created entities ===");
  try {
    const { pageIds: t, collectionIds: n, variableIds: i } = e;
    let o = 0;
    for (const p of i)
      try {
        const f = await figma.variables.getVariableByIdAsync(p);
        if (f) {
          const h = f.variableCollectionId;
          n.includes(h) || (f.remove(), o++);
        }
      } catch (f) {
        await a.warning(
          `Could not delete variable ${p.substring(0, 8)}...: ${f}`
        );
      }
    let l = 0;
    for (const p of n)
      try {
        const f = await figma.variables.getVariableCollectionByIdAsync(p);
        f && (f.remove(), l++);
      } catch (f) {
        await a.warning(
          `Could not delete collection ${p.substring(0, 8)}...: ${f}`
        );
      }
    await figma.loadAllPagesAsync();
    let r = 0;
    for (const p of t)
      try {
        const f = await figma.getNodeByIdAsync(p);
        f && f.type === "PAGE" && (f.remove(), r++);
      } catch (f) {
        await a.warning(
          `Could not delete page ${p.substring(0, 8)}...: ${f}`
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
async function dt(e) {
  const t = [];
  for (const { fileName: n, jsonData: i } of e)
    try {
      const o = Je(i);
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
      const p = [];
      if (l.instances) {
        const h = ve.fromTable(
          l.instances
        ).getSerializedTable();
        for (const y of Object.values(h))
          y.instanceType === "normal" && y.componentPageName && (p.includes(y.componentPageName) || p.push(y.componentPageName));
      }
      t.push({
        fileName: n,
        pageName: r.name,
        pageGuid: r.guid,
        dependencies: p,
        jsonData: i
        // Store original JSON data for import
      }), await a.log(
        `  ${n}: "${r.name}" depends on: ${p.length > 0 ? p.join(", ") : "none"}`
      );
    } catch (o) {
      await a.error(
        `Error processing ${n}: ${o instanceof Error ? o.message : String(o)}`
      );
    }
  return t;
}
function pt(e) {
  const t = [], n = [], i = [], o = /* @__PURE__ */ new Map();
  for (const h of e)
    o.set(h.pageName, h);
  const l = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), p = [], f = (h) => {
    if (l.has(h.pageName))
      return !1;
    if (r.has(h.pageName)) {
      const y = p.findIndex(
        (E) => E.pageName === h.pageName
      );
      if (y !== -1) {
        const E = p.slice(y).concat([h]);
        return n.push(E), !0;
      }
      return !1;
    }
    r.add(h.pageName), p.push(h);
    for (const y of h.dependencies) {
      const E = o.get(y);
      E && f(E);
    }
    return r.delete(h.pageName), p.pop(), l.add(h.pageName), t.push(h), !1;
  };
  for (const h of e)
    l.has(h.pageName) || f(h);
  for (const h of e)
    for (const y of h.dependencies)
      o.has(y) || i.push(
        `Page "${h.pageName}" (${h.fileName}) depends on "${y}" which is not in the import set`
      );
  return { order: t, cycles: n, errors: i };
}
async function gt(e) {
  await a.log("=== Building Dependency Graph ===");
  const t = await dt(e);
  await a.log("=== Resolving Import Order ===");
  const n = pt(t);
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
async function ft(e) {
  var k, B, O, G, P, A;
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
  } = await gt(t);
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
    const C = "recursica:collectionId", T = async (L) => {
      const d = await figma.variables.getLocalVariableCollectionsAsync(), u = new Set(d.map((b) => b.name));
      if (!u.has(L))
        return L;
      let c = 1, g = `${L}_${c}`;
      for (; u.has(g); )
        c++, g = `${L}_${c}`;
      return g;
    }, V = [
      { choice: e.collectionChoices.tokens, normalizedName: "Tokens" },
      { choice: e.collectionChoices.theme, normalizedName: "Theme" },
      { choice: e.collectionChoices.layers, normalizedName: "Layer" }
    ];
    for (const { choice: L, normalizedName: d } of V)
      if (L === "new") {
        await a.log(
          `Processing collection type: "${d}" (choice: "new") - will create new collection`
        );
        const u = await T(d), c = figma.variables.createVariableCollection(u);
        if (ce(d)) {
          const g = Te(d);
          g && (c.setSharedPluginData(
            "recursica",
            C,
            g
          ), await a.log(
            `  Stored fixed GUID: ${g.substring(0, 8)}...`
          ));
        }
        l.set(d, c), await a.log(
          `✓ Pre-created collection: "${u}" (normalized: "${d}", id: ${c.id.substring(0, 8)}...)`
        );
      } else
        await a.log(
          `Skipping collection type: "${d}" (choice: "existing")`
        );
    l.size > 0 && await a.log(
      `Pre-created ${l.size} collection(s) for reuse across all imports`
    );
  }
  await a.log("=== Importing Pages in Order ===");
  let r = 0, p = 0;
  const f = [...o], h = [], y = {
    pageIds: [],
    collectionIds: [],
    variableIds: []
  }, E = [];
  if (l.size > 0)
    for (const C of l.values())
      y.collectionIds.push(C.id), await a.log(
        `Tracking pre-created collection: "${C.name}" (${C.id.substring(0, 8)}...)`
      );
  const s = e.mainFileName;
  for (let C = 0; C < n.length; C++) {
    const T = n[C], V = s ? T.fileName === s : C === n.length - 1;
    await a.log(
      `[${C + 1}/${n.length}] Importing ${T.fileName} ("${T.pageName}")${V ? " [MAIN]" : " [DEPENDENCY]"}...`
    );
    try {
      const L = C === 0, d = await ct({
        jsonData: T.jsonData,
        isMainPage: V,
        clearConsole: L,
        collectionChoices: e.collectionChoices,
        alwaysCreateCopy: !0,
        // Wizard imports always create copies (no prompts)
        skipUniqueNaming: (k = e.skipUniqueNaming) != null ? k : !1,
        constructionIcon: e.constructionIcon || "",
        preCreatedCollections: l
        // Pass pre-created collections for reuse
      });
      if (d.success) {
        if (r++, (B = d.data) != null && B.deferredInstances) {
          const u = d.data.deferredInstances;
          Array.isArray(u) && h.push(...u);
        }
        if ((O = d.data) != null && O.createdEntities) {
          const u = d.data.createdEntities;
          u.pageIds && y.pageIds.push(...u.pageIds), u.collectionIds && y.collectionIds.push(...u.collectionIds), u.variableIds && y.variableIds.push(...u.variableIds);
          const c = ((G = u.pageIds) == null ? void 0 : G[0]) || ((P = d.data) == null ? void 0 : P.pageId);
          (A = d.data) != null && A.pageName && c && E.push({
            name: d.data.pageName,
            pageId: c
          });
        }
      } else
        p++, f.push(
          `Failed to import ${T.fileName}: ${d.message || "Unknown error"}`
        );
    } catch (L) {
      p++;
      const d = L instanceof Error ? L.message : String(L);
      f.push(`Failed to import ${T.fileName}: ${d}`);
    }
  }
  if (h.length > 0) {
    await a.log(
      `=== Resolving ${h.length} Deferred Instance(s) ===`
    );
    try {
      const C = await lt(h);
      await a.log(
        `  Resolved: ${C.resolved}, Failed: ${C.failed}`
      ), C.errors.length > 0 && f.push(...C.errors);
    } catch (C) {
      f.push(
        `Failed to resolve deferred instances: ${C instanceof Error ? C.message : String(C)}`
      );
    }
  }
  const v = Array.from(
    new Set(y.collectionIds)
  ), $ = Array.from(
    new Set(y.variableIds)
  ), w = Array.from(new Set(y.pageIds));
  if (await a.log("=== Import Summary ==="), await a.log(
    `  Imported: ${r}, Failed: ${p}, Deferred instances: ${h.length}`
  ), await a.log(
    `  Collections in allCreatedEntityIds: ${y.collectionIds.length}, Unique: ${v.length}`
  ), v.length > 0) {
    await a.log(
      `  Created ${v.length} collection(s)`
    );
    for (const C of v)
      try {
        const T = await figma.variables.getVariableCollectionByIdAsync(C);
        T && await a.log(
          `    - "${T.name}" (${C.substring(0, 8)}...)`
        );
      } catch (T) {
      }
  }
  const m = p === 0, R = m ? `Successfully imported ${r} page(s)${h.length > 0 ? ` (${h.length} deferred instance(s) resolved)` : ""}` : `Import completed with ${p} failure(s). ${f.join("; ")}`;
  return {
    type: "importPagesInOrder",
    success: m,
    error: !m,
    message: R,
    data: {
      imported: r,
      failed: p,
      deferred: h.length,
      errors: f,
      importedPages: E,
      createdEntities: {
        pageIds: w,
        collectionIds: v,
        variableIds: $
      }
    }
  };
}
async function Pa(e) {
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
    const o = await Ve(
      i,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + i.name + " (index: " + n + ")"
    );
    const l = JSON.stringify(o, null, 2), r = JSON.parse(l), p = "Copy - " + r.name, f = figma.createPage();
    if (f.name = p, figma.root.appendChild(f), r.children && r.children.length > 0) {
      let E = function(v) {
        v.forEach(($) => {
          const w = ($.x || 0) + ($.width || 0);
          w > s && (s = w), $.children && $.children.length > 0 && E($.children);
        });
      };
      console.log(
        "Recreating " + r.children.length + " top-level children..."
      );
      let s = 0;
      E(r.children), console.log("Original content rightmost edge: " + s);
      for (const v of r.children)
        await ye(v, f, null, null);
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
        newPageName: p,
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
async function Aa(e) {
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
async function Ca(e) {
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
async function Ia(e) {
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
async function Sa(e) {
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
function ae(e, t = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: t
  };
}
function le(e, t, n = {}) {
  const i = t instanceof Error ? t.message : t;
  return {
    type: e,
    success: !1,
    error: !0,
    message: i,
    data: n
  };
}
const mt = "RecursicaPublishedMetadata";
async function Ta(e) {
  try {
    const t = figma.currentPage;
    await figma.loadAllPagesAsync();
    const i = figma.root.children.findIndex(
      (p) => p.id === t.id
    ), o = t.getPluginData(mt);
    if (!o) {
      const h = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: Se(t.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: i
      };
      return ae("getComponentMetadata", h);
    }
    const r = {
      componentMetadata: JSON.parse(o),
      currentPageIndex: i
    };
    return ae("getComponentMetadata", r);
  } catch (t) {
    return console.error("Error getting component metadata:", t), le(
      "getComponentMetadata",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function Oa(e) {
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
      const l = o, r = l.getPluginData(mt);
      if (r)
        try {
          const p = JSON.parse(r);
          n.push(p);
        } catch (p) {
          console.warn(
            `Failed to parse metadata for page "${l.name}":`,
            p
          );
          const h = {
            _ver: 1,
            id: "",
            name: Se(l.name),
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
          name: Se(l.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        n.push(f);
      }
    }
    return ae("getAllComponents", {
      components: n
    });
  } catch (t) {
    return console.error("Error getting all components:", t), le(
      "getAllComponents",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function xa(e) {
  try {
    const t = e.requestId, n = e.action;
    return !t || !n ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (he.handleResponse({ requestId: t, action: n }), {
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
async function Va(e) {
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
const te = "RecursicaPrimaryImport", q = "RecursicaUnderReview", ut = "---", ht = "---", re = "RecursicaImportDivider", fe = "start", me = "end", se = "⚠️";
async function Ra(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children;
    for (const i of t) {
      if (i.type !== "PAGE")
        continue;
      const o = i.getPluginData(te);
      if (o)
        try {
          const r = JSON.parse(o), p = {
            exists: !0,
            pageId: i.id,
            metadata: r
          };
          return ae(
            "checkForExistingPrimaryImport",
            p
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
            const p = JSON.parse(r), f = {
              exists: !0,
              pageId: i.id,
              metadata: p
            };
            return ae(
              "checkForExistingPrimaryImport",
              f
            );
          } catch (p) {
          }
        else
          await a.warning(
            `Found page "${i.name}" marked as under review but missing primary import metadata`
          );
      }
    }
    return ae("checkForExistingPrimaryImport", {
      exists: !1
    });
  } catch (t) {
    return console.error("Error checking for existing primary import:", t), le(
      "checkForExistingPrimaryImport",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function Ma(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children.find(
      (p) => p.type === "PAGE" && p.getPluginData(re) === fe
    ), n = figma.root.children.find(
      (p) => p.type === "PAGE" && p.getPluginData(re) === me
    );
    if (t && n) {
      const p = {
        startDividerId: t.id,
        endDividerId: n.id
      };
      return ae("createImportDividers", p);
    }
    const i = figma.createPage();
    i.name = ut, i.setPluginData(re, fe), i.setPluginData(q, "true");
    const o = figma.createPage();
    o.name = ht, o.setPluginData(re, me), o.setPluginData(q, "true");
    const l = figma.root.children.indexOf(i);
    figma.root.insertChild(l + 1, o), await a.log("Created import dividers");
    const r = {
      startDividerId: i.id,
      endDividerId: o.id
    };
    return ae("createImportDividers", r);
  } catch (t) {
    return console.error("Error creating import dividers:", t), le(
      "createImportDividers",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function ka(e) {
  var t, n, i, o, l, r, p, f;
  try {
    await a.log("=== Starting Single Component Import ==="), await a.log("Creating start divider..."), await figma.loadAllPagesAsync();
    let h = figma.root.children.find(
      (u) => u.type === "PAGE" && u.getPluginData(re) === fe
    );
    h || (h = figma.createPage(), h.name = ut, h.setPluginData(re, fe), h.setPluginData(q, "true"), await a.log("Created start divider"));
    const E = [
      ...e.dependencies.filter(
        (u) => !u.useExisting
      ).map((u) => ({
        fileName: `${u.name}.json`,
        jsonData: u.jsonData
      })),
      {
        fileName: `${e.mainComponent.name}.json`,
        jsonData: e.mainComponent.jsonData
      }
    ];
    await a.log(
      `Importing ${E.length} file(s) in dependency order...`
    );
    const s = await ft({
      jsonFiles: E,
      mainFileName: `${e.mainComponent.name}.json`,
      collectionChoices: {
        tokens: e.wizardSelections.tokensCollection,
        theme: e.wizardSelections.themeCollection,
        layers: e.wizardSelections.layersCollection
      },
      skipUniqueNaming: !0,
      // Don't add _<number> suffix for wizard imports
      constructionIcon: se
      // Add construction icon to page names
    });
    if (!s.success)
      throw new Error(
        s.message || "Failed to import pages in order"
      );
    await figma.loadAllPagesAsync();
    const v = figma.root.children;
    let $ = v.find(
      (u) => u.type === "PAGE" && u.getPluginData(re) === me
    );
    if (!$) {
      $ = figma.createPage(), $.name = ht, $.setPluginData(
        re,
        me
      ), $.setPluginData(q, "true");
      let u = v.length;
      for (let c = v.length - 1; c >= 0; c--) {
        const g = v[c];
        if (g.type === "PAGE" && g.getPluginData(re) !== fe && g.getPluginData(re) !== me) {
          u = c + 1;
          break;
        }
      }
      figma.root.insertChild(u, $), await a.log("Created end divider");
    }
    await a.log(
      `Import result data structure: ${JSON.stringify(Object.keys(s.data || {}))}`
    );
    const w = s.data;
    if (await a.log(
      `Import result has createdEntities: ${!!(w != null && w.createdEntities)}`
    ), w != null && w.createdEntities && (await a.log(
      `  Collection IDs: ${((t = w.createdEntities.collectionIds) == null ? void 0 : t.length) || 0}`
    ), await a.log(
      `  Variable IDs: ${((n = w.createdEntities.variableIds) == null ? void 0 : n.length) || 0}`
    ), await a.log(
      `  Page IDs: ${((i = w.createdEntities.pageIds) == null ? void 0 : i.length) || 0}`
    )), !(w != null && w.importedPages) || w.importedPages.length === 0)
      throw new Error("No pages were imported");
    const m = (o = w.importedPages.find(
      (u) => u.name === e.mainComponent.name || u.name === `${se} ${e.mainComponent.name}`
    )) == null ? void 0 : o.pageId;
    if (!m)
      throw new Error("Failed to find imported main page ID");
    const R = await figma.getNodeByIdAsync(
      m
    );
    if (!R || R.type !== "PAGE")
      throw new Error("Failed to get main page node");
    for (const u of w.importedPages)
      try {
        const c = await figma.getNodeByIdAsync(
          u.pageId
        );
        if (c && c.type === "PAGE") {
          c.setPluginData(q, "true");
          const g = c.name.replace(/_\d+$/, "");
          if (!g.startsWith(se))
            c.name = `${se} ${g}`;
          else {
            const b = g.replace(se, "").trim();
            c.name = `${se} ${b}`;
          }
        }
      } catch (c) {
        await a.warning(
          `Failed to mark page ${u.pageId} as under review: ${c}`
        );
      }
    await figma.loadAllPagesAsync();
    const k = figma.root.children, B = k.find(
      (u) => u.type === "PAGE" && (u.name === "REMOTES" || u.name === `${se} REMOTES`)
    );
    B && (B.setPluginData(q, "true"), B.name.startsWith(se) || (B.name = `${se} REMOTES`), await a.log(
      "Marked REMOTES page as under review and ensured construction icon"
    ));
    const O = k.find(
      (u) => u.type === "PAGE" && u.getPluginData(re) === fe
    ), G = k.find(
      (u) => u.type === "PAGE" && u.getPluginData(re) === me
    );
    if (O && G) {
      const u = k.indexOf(O), c = k.indexOf(G);
      for (let g = u + 1; g < c; g++) {
        const b = k[g];
        b.type === "PAGE" && b.getPluginData(q) !== "true" && (b.setPluginData(q, "true"), await a.log(
          `Marked page "${b.name}" as under review (found between dividers)`
        ));
      }
    }
    const P = [], A = [];
    if (await a.log(
      `[EXTRACTION] Starting collection extraction. Collection IDs in result: ${((r = (l = w == null ? void 0 : w.createdEntities) == null ? void 0 : l.collectionIds) == null ? void 0 : r.length) || 0}`
    ), (p = w == null ? void 0 : w.createdEntities) != null && p.collectionIds) {
      await a.log(
        `[EXTRACTION] Collection IDs to process: ${w.createdEntities.collectionIds.map((u) => u.substring(0, 8) + "...").join(", ")}`
      );
      for (const u of w.createdEntities.collectionIds)
        try {
          const c = await figma.variables.getVariableCollectionByIdAsync(u);
          c ? (P.push({
            collectionId: c.id,
            collectionName: c.name
          }), await a.log(
            `[EXTRACTION] ✓ Extracted collection: "${c.name}" (${u.substring(0, 8)}...)`
          )) : await a.warning(
            `[EXTRACTION] Collection ${u.substring(0, 8)}... not found`
          );
        } catch (c) {
          await a.warning(
            `[EXTRACTION] Failed to get collection ${u.substring(0, 8)}...: ${c}`
          );
        }
    } else
      await a.warning(
        "[EXTRACTION] No collectionIds found in importResultData.createdEntities"
      );
    await a.log(
      `[EXTRACTION] Total collections extracted: ${P.length}`
    ), P.length > 0 && await a.log(
      `[EXTRACTION] Extracted collections: ${P.map((u) => `"${u.collectionName}" (${u.collectionId.substring(0, 8)}...)`).join(", ")}`
    );
    const C = new Set(
      P.map((u) => u.collectionId)
    );
    if ((f = w == null ? void 0 : w.createdEntities) != null && f.variableIds)
      for (const u of w.createdEntities.variableIds)
        try {
          const c = await figma.variables.getVariableByIdAsync(u);
          if (c && c.resolvedType && !C.has(c.variableCollectionId)) {
            const g = await figma.variables.getVariableCollectionByIdAsync(
              c.variableCollectionId
            );
            g && A.push({
              variableId: c.id,
              variableName: c.name,
              collectionId: c.variableCollectionId,
              collectionName: g.name
            });
          }
        } catch (c) {
          await a.warning(
            `Failed to get variable ${u}: ${c}`
          );
        }
    const T = {
      componentGuid: e.mainComponent.guid,
      componentVersion: e.mainComponent.version,
      componentName: e.mainComponent.name,
      importDate: (/* @__PURE__ */ new Date()).toISOString(),
      wizardSelections: e.wizardSelections,
      variableSummary: e.variableSummary,
      createdCollections: P,
      createdVariables: A,
      importError: void 0
      // No error yet
    };
    await a.log(
      `Storing metadata with ${P.length} collection(s) and ${A.length} variable(s)`
    ), R.setPluginData(
      te,
      JSON.stringify(T)
    ), R.setPluginData(q, "true"), await a.log(
      "Stored primary import metadata on main page and marked as under review"
    );
    const V = [];
    w.importedPages && V.push(
      ...w.importedPages.map((u) => u.pageId)
    ), await a.log("=== Single Component Import Complete ==="), T.importError = void 0, await a.log(
      `[METADATA] About to store metadata with ${P.length} collection(s) and ${A.length} variable(s)`
    ), P.length > 0 && await a.log(
      `[METADATA] Collections to store: ${P.map((u) => `"${u.collectionName}" (${u.collectionId.substring(0, 8)}...)`).join(", ")}`
    ), R.setPluginData(
      te,
      JSON.stringify(T)
    ), await a.log(
      `[METADATA] Stored metadata: ${P.length} collection(s), ${A.length} variable(s)`
    );
    const L = R.getPluginData(te);
    if (L)
      try {
        const u = JSON.parse(L);
        await a.log(
          `[METADATA] Verification: Stored metadata has ${u.createdCollections.length} collection(s) and ${u.createdVariables.length} variable(s)`
        );
      } catch (u) {
        await a.warning(
          "[METADATA] Failed to verify stored metadata"
        );
      }
    throw new Error(
      "TEST ERROR: Simulated import failure for testing cleanup functionality"
    );
  } catch (h) {
    const y = h instanceof Error ? h.message : "Unknown error occurred";
    await a.error(`Import failed: ${y}`);
    try {
      await figma.loadAllPagesAsync();
      const E = figma.root.children;
      let s = null;
      for (const v of E) {
        if (v.type !== "PAGE") continue;
        const $ = v.getPluginData(te);
        if ($)
          try {
            if (JSON.parse($).componentGuid === e.mainComponent.guid) {
              s = v;
              break;
            }
          } catch (w) {
          }
      }
      if (s) {
        const v = s.getPluginData(te);
        if (v)
          try {
            const $ = JSON.parse(v);
            await a.log(
              `[CATCH] Found existing metadata with ${$.createdCollections.length} collection(s) and ${$.createdVariables.length} variable(s)`
            ), $.importError = y, s.setPluginData(
              te,
              JSON.stringify($)
            ), await a.log(
              `[CATCH] Updated existing metadata with error. Collections: ${$.createdCollections.length}, Variables: ${$.createdVariables.length}`
            );
          } catch ($) {
            await a.warning(
              `[CATCH] Failed to update metadata: ${$}`
            );
          }
      } else {
        await a.log(
          "No existing metadata found, attempting to collect created entities for cleanup..."
        );
        const v = [];
        for (const m of E) {
          if (m.type !== "PAGE") continue;
          m.getPluginData(q) === "true" && v.push(m);
        }
        const $ = [];
        if (e.wizardSelections) {
          const m = await figma.variables.getLocalVariableCollectionsAsync(), R = [
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
          for (const { choice: k, normalizedName: B } of R)
            if (k === "new") {
              const O = m.filter((G) => Q(G.name) === B);
              if (O.length > 0) {
                const G = O[0];
                $.push({
                  collectionId: G.id,
                  collectionName: G.name
                }), await a.log(
                  `Found created collection: "${G.name}" (${G.id.substring(0, 8)}...)`
                );
              }
            }
        }
        const w = [];
        if (v.length > 0) {
          const m = v[0], R = {
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
            createdCollections: $,
            createdVariables: w,
            importError: y
          };
          m.setPluginData(
            te,
            JSON.stringify(R)
          ), await a.log(
            `Created fallback metadata with ${$.length} collection(s) and error information`
          );
        }
      }
    } catch (E) {
      await a.warning(
        `Failed to store error metadata: ${E instanceof Error ? E.message : String(E)}`
      );
    }
    return le(
      "importSingleComponentWithWizard",
      h instanceof Error ? h : new Error(String(h))
    );
  }
}
async function yt(e) {
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
    const o = figma.root.children, l = [];
    for (const s of o) {
      if (s.type !== "PAGE")
        continue;
      s.getPluginData(q) === "true" && (l.push(s), await a.log(
        `Found page to delete: "${s.name}" (under review)`
      ));
    }
    await a.log(
      `Deleting ${i.createdVariables.length} variable(s) from existing collections...`
    );
    let r = 0;
    for (const s of i.createdVariables)
      try {
        const v = await figma.variables.getVariableByIdAsync(
          s.variableId
        );
        v ? (v.remove(), r++, await a.log(
          `Deleted variable: ${s.variableName} from collection ${s.collectionName}`
        )) : await a.warning(
          `Variable ${s.variableName} (${s.variableId}) not found - may have already been deleted`
        );
      } catch (v) {
        await a.warning(
          `Failed to delete variable ${s.variableName}: ${v instanceof Error ? v.message : String(v)}`
        );
      }
    await a.log(
      `Deleting ${i.createdCollections.length} collection(s)...`
    );
    let p = 0;
    for (const s of i.createdCollections)
      try {
        const v = await figma.variables.getVariableCollectionByIdAsync(
          s.collectionId
        );
        v ? (v.remove(), p++, await a.log(
          `Deleted collection: ${s.collectionName} (${s.collectionId})`
        )) : await a.warning(
          `Collection ${s.collectionName} (${s.collectionId}) not found - may have already been deleted`
        );
      } catch (v) {
        await a.warning(
          `Failed to delete collection ${s.collectionName}: ${v instanceof Error ? v.message : String(v)}`
        );
      }
    const f = l.map((s) => ({
      page: s,
      name: s.name,
      id: s.id
    })), h = figma.currentPage;
    if (f.some(
      (s) => s.id === h.id
    )) {
      await figma.loadAllPagesAsync();
      const v = figma.root.children.find(
        ($) => $.type === "PAGE" && !f.some((w) => w.id === $.id)
      );
      v ? (await figma.setCurrentPageAsync(v), await a.log(
        `Switched away from page "${h.name}" before deletion`
      )) : await a.warning(
        "No safe page to switch to - all pages are being deleted"
      );
    }
    for (const { page: s, name: v } of f)
      try {
        let $ = !1;
        try {
          await figma.loadAllPagesAsync(), $ = figma.root.children.some((m) => m.id === s.id);
        } catch (w) {
          $ = !1;
        }
        if (!$) {
          await a.log(`Page "${v}" already deleted, skipping`);
          continue;
        }
        if (figma.currentPage.id === s.id) {
          await figma.loadAllPagesAsync();
          const m = figma.root.children.find(
            (R) => R.type === "PAGE" && R.id !== s.id && !f.some((k) => k.id === R.id)
          );
          m && await figma.setCurrentPageAsync(m);
        }
        s.remove(), await a.log(`Deleted page: "${v}"`);
      } catch ($) {
        await a.warning(
          `Failed to delete page "${v}": ${$ instanceof Error ? $.message : String($)}`
        );
      }
    await a.log("=== Import Group Deletion Complete ===");
    const E = {
      success: !0,
      deletedPages: l.length,
      deletedCollections: p,
      deletedVariables: r
    };
    return ae("deleteImportGroup", E);
  } catch (t) {
    const n = t instanceof Error ? t.message : "Unknown error occurred";
    return await a.error(`Delete failed: ${n}`), le(
      "deleteImportGroup",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
async function _a(e) {
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
      ), await yt({ pageId: n.id });
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
        (y) => y.type === "PAGE" && !i.some((E) => E.id === y.id)
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
          const E = figma.root.children.find(
            (s) => s.type === "PAGE" && s.id !== h.id && !i.some((v) => v.id === s.id)
          );
          E && await figma.setCurrentPageAsync(E);
        }
        h.remove(), r++, await a.log(`Deleted page: "${f.name}"`);
      } catch (h) {
        await a.warning(
          `Failed to delete page "${f.name}" (${f.id.substring(0, 8)}...): ${h instanceof Error ? h.message : String(h)}`
        );
      }
    return await a.log("=== Failed Import Cleanup Complete ==="), ae("cleanupFailedImport", {
      success: !0,
      deletedPages: r,
      deletedCollections: 0,
      // Can't clean up without metadata
      deletedVariables: 0
      // Can't clean up without metadata
    });
  } catch (t) {
    const n = t instanceof Error ? t.message : "Unknown error occurred";
    return await a.error(`Cleanup failed: ${n}`), le(
      "cleanupFailedImport",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
async function La(e) {
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
          } catch (p) {
            o.setPluginData(q, "");
          }
        else
          o.setPluginData(q, "");
      }
    return await a.log(
      "Cleared import metadata from page and related pages"
    ), ae("clearImportMetadata", {
      success: !0
    });
  } catch (t) {
    const n = t instanceof Error ? t.message : "Unknown error occurred";
    return await a.error(`Clear metadata failed: ${n}`), le(
      "clearImportMetadata",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
async function Ga(e) {
  try {
    await a.log("=== Summarizing Variables for Wizard ===");
    const t = [];
    for (const { fileName: v, jsonData: $ } of e.jsonFiles)
      try {
        const w = Je($);
        if (!w.success || !w.expandedJsonData) {
          await a.warning(
            `Skipping ${v} - failed to expand JSON: ${w.error || "Unknown error"}`
          );
          continue;
        }
        const m = w.expandedJsonData;
        if (!m.collections)
          continue;
        const k = $e.fromTable(
          m.collections
        );
        if (!m.variables)
          continue;
        const O = Ne.fromTable(m.variables).getTable();
        for (const G of Object.values(O)) {
          if (G._colRef === void 0)
            continue;
          const P = k.getCollectionByIndex(
            G._colRef
          );
          if (P) {
            const C = Q(
              P.collectionName
            ).toLowerCase();
            (C === "tokens" || C === "theme" || C === "layer") && t.push({
              name: G.variableName,
              collectionName: C
              // Use lowercase for consistency ("layer" not "layers")
            });
          }
        }
      } catch (w) {
        await a.warning(
          `Error processing ${v}: ${w instanceof Error ? w.message : String(w)}`
        );
        continue;
      }
    const n = await figma.variables.getLocalVariableCollectionsAsync();
    let i = null, o = null, l = null;
    for (const v of n) {
      const w = Q(v.name).toLowerCase();
      (w === "tokens" || w === "token") && !i ? i = v : (w === "theme" || w === "themes") && !o ? o = v : (w === "layer" || w === "layers") && !l && (l = v);
    }
    const r = t.filter(
      (v) => v.collectionName === "tokens"
    ), p = t.filter((v) => v.collectionName === "theme"), f = t.filter((v) => v.collectionName === "layer"), h = {
      existing: 0,
      new: 0
    }, y = {
      existing: 0,
      new: 0
    }, E = {
      existing: 0,
      new: 0
    };
    if (e.tokensCollection === "existing" && i) {
      const v = /* @__PURE__ */ new Set();
      for (const $ of i.variableIds)
        try {
          const w = figma.variables.getVariableById($);
          w && v.add(w.name);
        } catch (w) {
          continue;
        }
      for (const $ of r)
        v.has($.name) ? h.existing++ : h.new++;
    } else
      h.new = r.length;
    if (e.themeCollection === "existing" && o) {
      const v = /* @__PURE__ */ new Set();
      for (const $ of o.variableIds)
        try {
          const w = figma.variables.getVariableById($);
          w && v.add(w.name);
        } catch (w) {
          continue;
        }
      for (const $ of p)
        v.has($.name) ? y.existing++ : y.new++;
    } else
      y.new = p.length;
    if (e.layersCollection === "existing" && l) {
      const v = /* @__PURE__ */ new Set();
      for (const $ of l.variableIds)
        try {
          const w = figma.variables.getVariableById($);
          w && v.add(w.name);
        } catch (w) {
          continue;
        }
      for (const $ of f)
        v.has($.name) ? E.existing++ : E.new++;
    } else
      E.new = f.length;
    return await a.log(
      `Variable summary: Tokens - ${h.existing} existing, ${h.new} new; Theme - ${y.existing} existing, ${y.new} new; Layers - ${E.existing} existing, ${E.new} new`
    ), ae("summarizeVariablesForWizard", {
      tokens: h,
      theme: y,
      layers: E
    });
  } catch (t) {
    const n = t instanceof Error ? t.message : "Unknown error occurred";
    return await a.error(`Summarize failed: ${n}`), le(
      "summarizeVariablesForWizard",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
const Ua = {
  getCurrentUser: Pt,
  loadPages: At,
  exportPage: je,
  importPage: ct,
  cleanupCreatedEntities: Ea,
  resolveDeferredNormalInstances: lt,
  determineImportOrder: gt,
  buildDependencyGraph: dt,
  resolveImportOrder: pt,
  importPagesInOrder: ft,
  quickCopy: Pa,
  storeAuthData: Aa,
  loadAuthData: Ca,
  clearAuthData: Ia,
  storeSelectedRepo: Sa,
  getComponentMetadata: Ta,
  getAllComponents: Oa,
  pluginPromptResponse: xa,
  switchToPage: Va,
  checkForExistingPrimaryImport: Ra,
  createImportDividers: Ma,
  importSingleComponentWithWizard: ka,
  deleteImportGroup: yt,
  clearImportMetadata: La,
  cleanupFailedImport: _a,
  summarizeVariablesForWizard: Ga
}, Ba = Ua;
figma.showUI(__html__, {
  width: 500,
  height: 500
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    Mt(e);
    return;
  }
  const t = e;
  try {
    const n = t.type, i = Ba[n];
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
    figma.ui.postMessage(Z(j({}, o), {
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
