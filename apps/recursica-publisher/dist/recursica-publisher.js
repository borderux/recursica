var wt = Object.defineProperty, $t = Object.defineProperties;
var Nt = Object.getOwnPropertyDescriptors;
var He = Object.getOwnPropertySymbols;
var vt = Object.prototype.hasOwnProperty, Et = Object.prototype.propertyIsEnumerable;
var ke = (e, t, n) => t in e ? wt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, j = (e, t) => {
  for (var n in t || (t = {}))
    vt.call(t, n) && ke(e, n, t[n]);
  if (He)
    for (var n of He(t))
      Et.call(t, n) && ke(e, n, t[n]);
  return e;
}, Q = (e, t) => $t(e, Nt(t));
var ae = (e, t, n) => ke(e, typeof t != "symbol" ? t + "" : t, n);
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
async function Ct(e) {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "loadPages",
      success: !0,
      error: !1,
      message: "Pages loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        pages: figma.root.children.map((o, c) => ({
          name: o.name,
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
}, Y = Q(j({}, X), {
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
}), ie = Q(j({}, X), {
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
}), fe = Q(j({}, X), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), Ze = Q(j({}, X), {
  cornerRadius: 0
}), At = Q(j({}, X), {
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
      return ie;
    case "VECTOR":
      return fe;
    case "LINE":
      return At;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return Ze;
    default:
      return X;
  }
}
function F(e, t) {
  if (Array.isArray(e))
    return Array.isArray(t) ? e.length !== t.length || e.some((n, i) => F(n, t[i])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof t == "object" && t !== null) {
      const n = Object.keys(e), i = Object.keys(t);
      return n.length !== i.length ? !0 : n.some(
        (o) => !(o in t) || F(e[o], t[o])
      );
    }
    return !0;
  }
  return e !== t;
}
const de = {
  LAYER: "00000000-0000-0000-0000-000000000001",
  TOKENS: "00000000-0000-0000-0000-000000000002",
  THEME: "00000000-0000-0000-0000-000000000003"
}, re = {
  LAYER: "Layer",
  TOKENS: "Tokens",
  THEME: "Theme"
};
function te(e) {
  const t = e.trim(), i = t.replace(/_\d+$/, "").toLowerCase();
  return i === "themes" || i === "theme" ? re.THEME : i === "token" || i === "tokens" ? re.TOKENS : i === "layer" || i === "layers" ? re.LAYER : t;
}
function le(e) {
  const t = te(e);
  return t === re.LAYER || t === re.TOKENS || t === re.THEME;
}
function Oe(e) {
  const t = te(e);
  if (t === re.LAYER)
    return de.LAYER;
  if (t === re.TOKENS)
    return de.TOKENS;
  if (t === re.THEME)
    return de.THEME;
}
class Ne {
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
    if (le(t.collectionName)) {
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
    const c = Q(j({}, t), {
      collectionName: i
    });
    if (le(t.collectionName)) {
      const r = Oe(
        t.collectionName
      );
      r && (c.collectionGuid = r), this.normalizedNameMap.set(i, o);
    }
    return this.collections[o] = c, o;
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
    const n = new Ne(), i = Object.entries(t).sort(
      (c, r) => parseInt(c[0], 10) - parseInt(r[0], 10)
    );
    for (const [c, r] of i) {
      const p = parseInt(c, 10), f = (o = r.isLocal) != null ? o : !0, h = te(
        r.collectionName || ""
      ), y = r.collectionId || r.collectionGuid || `temp:${p}:${h}`, C = j({
        collectionName: h,
        collectionId: y,
        isLocal: f,
        modes: r.modes || []
      }, r.collectionGuid && {
        collectionGuid: r.collectionGuid
      });
      n.collectionMap.set(y, p), n.collections[p] = C, le(h) && n.normalizedNameMap.set(h, p), n.nextIndex = Math.max(
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
function Vt(e) {
  var t;
  return typeof e == "number" ? (t = Tt[e]) != null ? t : e.toString() : e;
}
class ve {
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
      ), c = j(j({
        variableName: i.variableName,
        variableType: Ot(i.variableType)
      }, i._colRef !== void 0 && { _colRef: i._colRef }), o && { valuesByMode: o });
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
    const n = new ve(), i = Object.entries(t).sort(
      (o, c) => parseInt(o[0], 10) - parseInt(c[0], 10)
    );
    for (const [o, c] of i) {
      const r = parseInt(o, 10), p = Vt(c.variableType), f = Q(j({}, c), {
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
function Mt(e) {
  return {
    _varRef: e
  };
}
function ge(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let xt = 0;
const $e = /* @__PURE__ */ new Map();
function Rt(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const t = $e.get(e.requestId);
  t && ($e.delete(e.requestId), e.error || !e.guid ? t.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : t.resolve(e.guid));
}
function ze() {
  return new Promise((e, t) => {
    const n = `guid_${Date.now()}_${++xt}`;
    $e.set(n, { resolve: e, reject: t }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: n
    }), setTimeout(() => {
      $e.has(n) && ($e.delete(n), t(new Error("Timeout waiting for GUID from UI")));
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
function kt(e, t) {
  const n = t.modes.find((i) => i.modeId === e);
  return n ? n.name : e;
}
async function Qe(e, t, n, i, o = /* @__PURE__ */ new Set()) {
  const c = {};
  for (const [r, p] of Object.entries(e)) {
    const f = kt(r, i);
    if (p == null) {
      c[f] = p;
      continue;
    }
    if (typeof p == "string" || typeof p == "number" || typeof p == "boolean") {
      c[f] = p;
      continue;
    }
    if (typeof p == "object" && p !== null && "type" in p && p.type === "VARIABLE_ALIAS" && "id" in p) {
      const h = p.id;
      if (o.has(h)) {
        c[f] = {
          type: "VARIABLE_ALIAS",
          id: h
        };
        continue;
      }
      const y = await figma.variables.getVariableByIdAsync(h);
      if (!y) {
        c[f] = {
          type: "VARIABLE_ALIAS",
          id: h
        };
        continue;
      }
      const C = new Set(o);
      C.add(h);
      const l = await figma.variables.getVariableCollectionByIdAsync(
        y.variableCollectionId
      ), v = y.key;
      if (!v) {
        c[f] = {
          type: "VARIABLE_ALIAS",
          id: h
        };
        continue;
      }
      const $ = {
        variableName: y.name,
        variableType: y.resolvedType,
        collectionName: l == null ? void 0 : l.name,
        collectionId: y.variableCollectionId,
        variableKey: v,
        id: h,
        isLocal: !y.remote
      };
      if (l) {
        const d = await et(
          l,
          n
        );
        $._colRef = d, y.valuesByMode && ($.valuesByMode = await Qe(
          y.valuesByMode,
          t,
          n,
          l,
          // Pass collection for mode ID to name conversion
          C
        ));
      }
      const w = t.addVariable($);
      c[f] = {
        type: "VARIABLE_ALIAS",
        id: h,
        _varRef: w
      };
    } else
      c[f] = p;
  }
  return c;
}
const Ae = "recursica:collectionId";
async function Gt(e) {
  if (e.remote === !0) {
    const n = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(n)) {
      const o = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await a.error(o), new Error(o);
    }
    return e.id;
  } else {
    if (le(e.name)) {
      const o = Oe(e.name);
      if (o) {
        const c = e.getSharedPluginData(
          "recursica",
          Ae
        );
        return (!c || c.trim() === "") && e.setSharedPluginData(
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
    const i = await ze();
    return e.setSharedPluginData("recursica", Ae, i), i;
  }
}
function _t(e, t) {
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
  _t(e.name, n);
  const o = await Gt(e), c = e.modes.map((h) => h.name), r = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: n,
    modes: c,
    collectionGuid: o
  }, p = t.addCollection(r), f = n ? "local" : "remote";
  return await a.log(
    `  Added ${f} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), p;
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
    const c = i.key;
    if (!c)
      return console.log("Variable missing key:", e.id), null;
    const r = await et(
      o,
      n
    ), p = {
      variableName: i.name,
      variableType: i.resolvedType,
      _colRef: r,
      // Reference to collection table (v2.4.0+)
      variableKey: c,
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
    return Mt(f);
  } catch (i) {
    const o = i instanceof Error ? i.message : String(i);
    throw console.error("Could not resolve variable alias:", e.id, i), new Error(
      `Failed to resolve variable alias ${e.id}: ${o}`
    );
  }
}
async function he(e, t, n) {
  if (!e || typeof e != "object") return e;
  const i = {};
  for (const o in e)
    if (Object.prototype.hasOwnProperty.call(e, o)) {
      const c = e[o];
      if (c && typeof c == "object" && !Array.isArray(c))
        if (c.type === "VARIABLE_ALIAS") {
          const r = await _e(
            c,
            t,
            n
          );
          r && (i[o] = r);
        } else
          i[o] = await he(
            c,
            t,
            n
          );
      else Array.isArray(c) ? i[o] = await Promise.all(
        c.map(async (r) => (r == null ? void 0 : r.type) === "VARIABLE_ALIAS" ? await _e(
          r,
          t,
          n
        ) || r : r && typeof r == "object" ? await he(
          r,
          t,
          n
        ) : r)
      ) : i[o] = c;
    }
  return i;
}
async function tt(e, t, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const o = {};
      for (const c in i)
        Object.prototype.hasOwnProperty.call(i, c) && (c === "boundVariables" ? o[c] = await he(
          i[c],
          t,
          n
        ) : o[c] = i[c]);
      return o;
    })
  );
}
async function at(e, t, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const o = {};
      for (const c in i)
        Object.prototype.hasOwnProperty.call(i, c) && (c === "boundVariables" ? o[c] = await he(
          i[c],
          t,
          n
        ) : o[c] = i[c]);
      return o;
    })
  );
}
const we = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  extractBoundVariables: he,
  resolveVariableAliasMetadata: _e,
  serializeBackgrounds: at,
  serializeFills: tt
}, Symbol.toStringTag, { value: "Module" }));
async function nt(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  if (e.type && (n.type = e.type, i.add("type")), e.id && (n.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (n.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (n.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (n.y = e.y, i.add("y")), e.width !== void 0 && (n.width = e.width, i.add("width")), e.height !== void 0 && (n.height = e.height, i.add("height")), e.visible !== void 0 && F(e.visible, X.visible) && (n.visible = e.visible, i.add("visible")), e.locked !== void 0 && F(e.locked, X.locked) && (n.locked = e.locked, i.add("locked")), e.opacity !== void 0 && F(e.opacity, X.opacity) && (n.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && F(e.rotation, X.rotation) && (n.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && F(e.blendMode, X.blendMode) && (n.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && F(e.effects, X.effects) && (n.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const o = await tt(
      e.fills,
      t.variableTable,
      t.collectionTable
    );
    F(o, X.fills) && (n.fills = o), i.add("fills");
  }
  if (e.strokes !== void 0 && F(e.strokes, X.strokes) && (n.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && F(e.strokeWeight, X.strokeWeight) && (n.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && F(e.strokeAlign, X.strokeAlign) && (n.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const o = await he(
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
const Lt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseBaseNodeProperties: nt
}, Symbol.toStringTag, { value: "Module" }));
async function Le(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  if (e.type === "COMPONENT")
    try {
      e.componentPropertyDefinitions && (n.componentPropertyDefinitions = e.componentPropertyDefinitions, i.add("componentPropertyDefinitions"));
    } catch (o) {
    }
  return e.layoutMode !== void 0 && F(e.layoutMode, Y.layoutMode) && (n.layoutMode = e.layoutMode, i.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && F(
    e.primaryAxisSizingMode,
    Y.primaryAxisSizingMode
  ) && (n.primaryAxisSizingMode = e.primaryAxisSizingMode, i.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && F(
    e.counterAxisSizingMode,
    Y.counterAxisSizingMode
  ) && (n.counterAxisSizingMode = e.counterAxisSizingMode, i.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && F(
    e.primaryAxisAlignItems,
    Y.primaryAxisAlignItems
  ) && (n.primaryAxisAlignItems = e.primaryAxisAlignItems, i.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && F(
    e.counterAxisAlignItems,
    Y.counterAxisAlignItems
  ) && (n.counterAxisAlignItems = e.counterAxisAlignItems, i.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && F(e.paddingLeft, Y.paddingLeft) && (n.paddingLeft = e.paddingLeft, i.add("paddingLeft")), e.paddingRight !== void 0 && F(e.paddingRight, Y.paddingRight) && (n.paddingRight = e.paddingRight, i.add("paddingRight")), e.paddingTop !== void 0 && F(e.paddingTop, Y.paddingTop) && (n.paddingTop = e.paddingTop, i.add("paddingTop")), e.paddingBottom !== void 0 && F(e.paddingBottom, Y.paddingBottom) && (n.paddingBottom = e.paddingBottom, i.add("paddingBottom")), e.itemSpacing !== void 0 && F(e.itemSpacing, Y.itemSpacing) && (n.itemSpacing = e.itemSpacing, i.add("itemSpacing")), e.cornerRadius !== void 0 && F(e.cornerRadius, Y.cornerRadius) && (n.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.clipsContent !== void 0 && F(e.clipsContent, Y.clipsContent) && (n.clipsContent = e.clipsContent, i.add("clipsContent")), e.layoutWrap !== void 0 && F(e.layoutWrap, Y.layoutWrap) && (n.layoutWrap = e.layoutWrap, i.add("layoutWrap")), e.layoutGrow !== void 0 && F(e.layoutGrow, Y.layoutGrow) && (n.layoutGrow = e.layoutGrow, i.add("layoutGrow")), n;
}
const Bt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseFrameProperties: Le
}, Symbol.toStringTag, { value: "Module" }));
async function Ut(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (n.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (n.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (n.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && F(
    e.textAlignHorizontal,
    ie.textAlignHorizontal
  ) && (n.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && F(
    e.textAlignVertical,
    ie.textAlignVertical
  ) && (n.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && F(e.letterSpacing, ie.letterSpacing) && (n.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && F(e.lineHeight, ie.lineHeight) && (n.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && F(e.textCase, ie.textCase) && (n.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && F(e.textDecoration, ie.textDecoration) && (n.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && F(e.textAutoResize, ie.textAutoResize) && (n.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && F(
    e.paragraphSpacing,
    ie.paragraphSpacing
  ) && (n.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && F(e.paragraphIndent, ie.paragraphIndent) && (n.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && F(e.listOptions, ie.listOptions) && (n.listOptions = e.listOptions, i.add("listOptions")), n;
}
function Ft(e) {
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
  let t = e.replace(/(\d+\.?\d*)[eE]([+-]?\d+)/g, (n) => Ft(n));
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
function Be(e) {
  return Array.isArray(e) ? e.map((t) => ({
    data: it(t.data),
    // Normalize winding rule key (use windRule consistently)
    windRule: t.windRule || t.windingRule || "NONZERO"
  })) : e;
}
const zt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  normalizeSvgPath: it,
  normalizeVectorGeometry: Be
}, Symbol.toStringTag, { value: "Module" }));
async function jt(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && F(e.fillGeometry, fe.fillGeometry) && (n.fillGeometry = Be(e.fillGeometry), i.add("fillGeometry")), e.strokeGeometry !== void 0 && F(e.strokeGeometry, fe.strokeGeometry) && (n.strokeGeometry = Be(e.strokeGeometry), i.add("strokeGeometry")), e.strokeCap !== void 0 && F(e.strokeCap, fe.strokeCap) && (n.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && F(e.strokeJoin, fe.strokeJoin) && (n.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && F(e.dashPattern, fe.dashPattern) && (n.dashPattern = e.dashPattern, i.add("dashPattern")), n;
}
async function Dt(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && F(e.cornerRadius, Ze.cornerRadius) && (n.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (n.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, i.add("pointCount")), n;
}
const Ie = /* @__PURE__ */ new Map();
let Jt = 0;
function Wt() {
  return `prompt_${Date.now()}_${++Jt}`;
}
const ye = {
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
    const n = typeof t == "number" ? { timeoutMs: t } : t, i = (p = n == null ? void 0 : n.timeoutMs) != null ? p : 3e5, o = n == null ? void 0 : n.okLabel, c = n == null ? void 0 : n.cancelLabel, r = Wt();
    return new Promise((f, h) => {
      const y = i === -1 ? null : setTimeout(() => {
        Ie.delete(r), h(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      Ie.set(r, {
        resolve: f,
        reject: h,
        timeout: y
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: j(j({
          message: e,
          requestId: r
        }, o && { okLabel: o }), c && { cancelLabel: c })
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
}, Kt = "RecursicaPublishedMetadata";
function Ge(e) {
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
  var o, c;
  const n = {}, i = /* @__PURE__ */ new Set();
  if (n._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const r = await e.getMainComponentAsync();
    if (!r) {
      const A = e.name || "(unnamed)", I = e.id;
      if (t.detachedComponentsHandled.has(I))
        await a.log(
          `Treating detached instance "${A}" as internal instance (already prompted)`
        );
      else {
        await a.warning(
          `Found detached instance: "${A}" (main component is missing)`
        );
        const s = `Found detached instance "${A}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await ye.prompt(s, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(I), await a.log(
            `Treating detached instance "${A}" as internal instance`
          );
        } catch (m) {
          if (m instanceof Error && m.message === "User cancelled") {
            const b = `Export cancelled: Detached instance "${A}" found. Please fix the instance before exporting.`;
            await a.error(b);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch (T) {
              console.warn("Could not scroll to instance:", T);
            }
            throw new Error(b);
          } else
            throw m;
        }
      }
      if (!Ge(e).page) {
        const s = `Detached instance "${A}" is not on any page. Cannot export.`;
        throw await a.error(s), new Error(s);
      }
      let M, k;
      try {
        e.variantProperties && (M = e.variantProperties), e.componentProperties && (k = e.componentProperties);
      } catch (s) {
      }
      const g = j(j({
        instanceType: "internal",
        componentName: A,
        componentNodeId: e.id
      }, M && { variantProperties: M }), k && { componentProperties: k }), u = t.instanceTable.addInstance(g);
      return n._instanceRef = u, i.add("_instanceRef"), await a.log(
        `  Exported detached INSTANCE: "${A}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), n;
    }
    const p = e.name || "(unnamed)", f = r.name || "(unnamed)", h = r.remote === !0, C = Ge(e).page, l = Ge(r), v = l.page;
    let $, w = v;
    if (h)
      if (v) {
        const A = qe(v);
        A != null && A.id ? ($ = "normal", w = v, await a.log(
          `  Component "${f}" is from library but also exists on local page "${v.name}" with metadata. Treating as "normal" instance.`
        )) : ($ = "remote", await a.log(
          `  Component "${f}" is from library and exists on local page "${v.name}" but has no metadata. Treating as "remote" instance.`
        ));
      } else
        $ = "remote", await a.log(
          `  Component "${f}" is from library and not on a local page. Treating as "remote" instance.`
        );
    else if (v && C && v.id === C.id)
      $ = "internal";
    else if (v && C && v.id !== C.id)
      $ = "normal";
    else if (v && !C)
      $ = "normal";
    else if (!h && l.reason === "detached") {
      const A = r.id;
      if (t.detachedComponentsHandled.has(A))
        $ = "remote", await a.log(
          `Treating detached instance "${p}" -> component "${f}" as remote instance (already prompted)`
        );
      else {
        await a.warning(
          `Found detached instance: "${p}" -> component "${f}" (component is not on any page)`
        );
        try {
          await figma.viewport.scrollAndZoomIntoView([r]);
        } catch (N) {
          console.warn("Could not scroll to component:", N);
        }
        const I = `Found detached instance "${p}" attached to component "${f}". This should be fixed. Continue to publish?`;
        try {
          await ye.prompt(I, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(A), $ = "remote", await a.log(
            `Treating detached instance "${p}" as remote instance (will be created on REMOTES page)`
          );
        } catch (N) {
          if (N instanceof Error && N.message === "User cancelled") {
            const V = `Export cancelled: Detached instance "${p}" found. The component "${f}" is not on any page. Please fix the instance before exporting.`;
            throw await a.error(V), new Error(V);
          } else
            throw N;
        }
      }
    } else
      h || await a.warning(
        `  Instance "${p}" -> component "${f}": componentPage is null but component is not remote. Reason: ${l.reason}. Cannot determine instance type.`
      ), $ = "normal";
    let d, E;
    try {
      if (e.variantProperties && (d = e.variantProperties, await a.log(
        `  Instance "${p}" -> variantProperties from instance: ${JSON.stringify(d)}`
      )), typeof e.getProperties == "function")
        try {
          const A = await e.getProperties();
          A && A.variantProperties && (await a.log(
            `  Instance "${p}" -> variantProperties from getProperties(): ${JSON.stringify(A.variantProperties)}`
          ), A.variantProperties && Object.keys(A.variantProperties).length > 0 && (d = A.variantProperties));
        } catch (A) {
          await a.log(
            `  Instance "${p}" -> getProperties() not available or failed: ${A}`
          );
        }
      if (e.componentProperties && (E = e.componentProperties), r.parent && r.parent.type === "COMPONENT_SET") {
        const A = r.parent;
        try {
          const I = A.componentPropertyDefinitions;
          I && await a.log(
            `  Component set "${A.name}" has property definitions: ${JSON.stringify(Object.keys(I))}`
          );
          const N = {}, V = f.split(",").map((M) => M.trim());
          for (const M of V) {
            const k = M.split("=").map((g) => g.trim());
            if (k.length >= 2) {
              const g = k[0], u = k.slice(1).join("=").trim();
              I && I[g] && (N[g] = u);
            }
          }
          if (Object.keys(N).length > 0 && await a.log(
            `  Parsed variant properties from component name "${f}": ${JSON.stringify(N)}`
          ), d && Object.keys(d).length > 0)
            await a.log(
              `  Using variant properties from instance (source of truth): ${JSON.stringify(d)}`
            );
          else if (Object.keys(N).length > 0)
            d = N, await a.log(
              `  Using variant properties from component name (fallback): ${JSON.stringify(d)}`
            );
          else if (r.variantProperties) {
            const M = r.variantProperties;
            await a.log(
              `  Main component "${f}" has variantProperties: ${JSON.stringify(M)}`
            ), d = M;
          }
        } catch (I) {
          await a.warning(
            `  Could not get variant properties from component set: ${I}`
          );
        }
      }
    } catch (A) {
    }
    let S, B;
    try {
      let A = r.parent;
      const I = [];
      let N = 0;
      const V = 20;
      for (; A && N < V; )
        try {
          const M = A.type, k = A.name;
          if (M === "COMPONENT_SET" && !B && (B = k), M === "PAGE")
            break;
          const g = k || "";
          I.unshift(g), A = A.parent, N++;
        } catch (M) {
          break;
        }
      S = I;
    } catch (A) {
    }
    const R = j(j(j(j({
      instanceType: $,
      componentName: f
    }, B && { componentSetName: B }), d && { variantProperties: d }), E && { componentProperties: E }), $ === "normal" ? { path: S || [] } : S && S.length > 0 && {
      path: S
    });
    if ($ === "internal") {
      R.componentNodeId = r.id, await a.log(
        `  Found INSTANCE: "${p}" -> INTERNAL component "${f}" (ID: ${r.id.substring(0, 8)}...)`
      );
      const A = e.boundVariables, I = r.boundVariables;
      if (A && typeof A == "object") {
        const g = Object.keys(A);
        await a.log(
          `  DEBUG: Internal instance "${p}" -> boundVariables keys: ${g.length > 0 ? g.join(", ") : "none"}`
        );
        for (const s of g) {
          const m = A[s], b = (m == null ? void 0 : m.type) || typeof m;
          await a.log(
            `  DEBUG:   boundVariables.${s}: type=${b}, value=${JSON.stringify(m)}`
          );
        }
        const u = [
          "backgrounds",
          "selectionColor",
          "selectionColors",
          "selection",
          "selectColor"
        ];
        for (const s of u)
          A[s] !== void 0 && await a.log(
            `  DEBUG:   Found potential "Selection colors" property: boundVariables.${s} = ${JSON.stringify(A[s])}`
          );
      } else
        await a.log(
          `  DEBUG: Internal instance "${p}" -> No boundVariables found on instance node`
        );
      if (I && typeof I == "object") {
        const g = Object.keys(I);
        await a.log(
          `  DEBUG: Main component "${f}" -> boundVariables keys: ${g.length > 0 ? g.join(", ") : "none"}`
        );
      }
      const N = e.backgrounds;
      if (N && Array.isArray(N)) {
        await a.log(
          `  DEBUG: Internal instance "${p}" -> backgrounds array length: ${N.length}`
        );
        for (let g = 0; g < N.length; g++) {
          const u = N[g];
          if (u && typeof u == "object") {
            if (await a.log(
              `  DEBUG:   backgrounds[${g}] structure: ${JSON.stringify(Object.keys(u))}`
            ), u.boundVariables) {
              const s = Object.keys(u.boundVariables);
              await a.log(
                `  DEBUG:   backgrounds[${g}].boundVariables keys: ${s.length > 0 ? s.join(", ") : "none"}`
              );
              for (const m of s) {
                const b = u.boundVariables[m];
                await a.log(
                  `  DEBUG:     backgrounds[${g}].boundVariables.${m}: ${JSON.stringify(b)}`
                );
              }
            }
            u.color && await a.log(
              `  DEBUG:   backgrounds[${g}].color: ${JSON.stringify(u.color)}`
            );
          }
        }
      }
      const V = Object.keys(e).filter(
        (g) => !g.startsWith("_") && g !== "parent" && g !== "removed" && typeof e[g] != "function" && g !== "type" && g !== "id" && g !== "name" && g !== "boundVariables" && g !== "backgrounds" && g !== "fills"
      ), M = Object.keys(r).filter(
        (g) => !g.startsWith("_") && g !== "parent" && g !== "removed" && typeof r[g] != "function" && g !== "type" && g !== "id" && g !== "name" && g !== "boundVariables" && g !== "backgrounds" && g !== "fills"
      ), k = [
        .../* @__PURE__ */ new Set([...V, ...M])
      ].filter(
        (g) => g.toLowerCase().includes("selection") || g.toLowerCase().includes("select") || g.toLowerCase().includes("color") && !g.toLowerCase().includes("fill") && !g.toLowerCase().includes("stroke")
      );
      if (k.length > 0) {
        await a.log(
          `  DEBUG: Found selection/color-related properties: ${k.join(", ")}`
        );
        for (const g of k)
          try {
            if (V.includes(g)) {
              const u = e[g];
              await a.log(
                `  DEBUG:   Instance.${g}: ${JSON.stringify(u)}`
              );
            }
            if (M.includes(g)) {
              const u = r[g];
              await a.log(
                `  DEBUG:   MainComponent.${g}: ${JSON.stringify(u)}`
              );
            }
          } catch (u) {
          }
      } else
        await a.log(
          "  DEBUG: No selection/color-related properties found on instance or main component"
        );
    } else if ($ === "normal") {
      const A = w || v;
      if (A) {
        R.componentPageName = A.name;
        const N = qe(A);
        N != null && N.id && N.version !== void 0 ? (R.componentGuid = N.id, R.componentVersion = N.version, await a.log(
          `  Found INSTANCE: "${p}" -> NORMAL component "${f}" (ID: ${r.id.substring(0, 8)}...) at path [${(S || []).join(" → ")}]`
        )) : await a.warning(
          `  Instance "${p}" -> component "${f}" is classified as normal but page "${A.name}" has no metadata. This instance will not be importable.`
        );
      } else {
        const N = r.id;
        let V = "", M = "";
        switch (l.reason) {
          case "broken_chain":
            V = "The component's parent chain is broken and cannot be traversed to find the page", M = "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            V = "Cannot access the component's parent chain (access error)", M = "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            V = "Cannot determine which page the component is on", M = "Please ensure the component is properly placed on a page.";
        }
        try {
          await figma.viewport.scrollAndZoomIntoView([r]);
        } catch (u) {
          console.warn("Could not scroll to component:", u);
        }
        const k = `Normal instance "${p}" -> component "${f}" (ID: ${N}) has no componentPage. ${V}. ${M} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", k), await a.error(k);
        const g = new Error(k);
        throw console.error("Throwing error:", g), g;
      }
      S === void 0 && console.warn(
        `Failed to build path for normal instance "${p}" -> component "${f}". Path is required for resolution.`
      );
      const I = S && S.length > 0 ? ` at path [${S.join(" → ")}]` : " at page root";
      await a.log(
        `  Found INSTANCE: "${p}" -> NORMAL component "${f}" (ID: ${r.id.substring(0, 8)}...)${I}`
      );
    } else if ($ === "remote") {
      let A, I;
      const N = t.detachedComponentsHandled.has(
        r.id
      );
      if (!N)
        try {
          if (typeof r.getPublishStatusAsync == "function")
            try {
              const M = await r.getPublishStatusAsync();
              M && typeof M == "object" && (M.libraryName && (A = M.libraryName), M.libraryKey && (I = M.libraryKey));
            } catch (M) {
            }
          try {
            const M = figma.teamLibrary;
            if (typeof (M == null ? void 0 : M.getAvailableLibraryComponentSetsAsync) == "function") {
              const k = await M.getAvailableLibraryComponentSetsAsync();
              if (k && Array.isArray(k)) {
                for (const g of k)
                  if (g.key === r.key || g.name === r.name) {
                    g.libraryName && (A = g.libraryName), g.libraryKey && (I = g.libraryKey);
                    break;
                  }
              }
            }
          } catch (M) {
          }
        } catch (M) {
          console.warn(
            `Error getting library info for remote component "${f}":`,
            M
          );
        }
      if (A && (R.remoteLibraryName = A), I && (R.remoteLibraryKey = I), N && (R.componentNodeId = r.id), t.instanceTable.getInstanceIndex(R) !== -1)
        await a.log(
          `  Found INSTANCE: "${p}" -> REMOTE component "${f}" (ID: ${r.id.substring(0, 8)}...)${N ? " [DETACHED]" : ""}`
        );
      else
        try {
          const { parseBaseNodeProperties: M } = await Promise.resolve().then(() => Lt), k = await M(e, t), { parseFrameProperties: g } = await Promise.resolve().then(() => Bt), u = await g(e, t), s = Q(j(j({}, k), u), {
            type: "COMPONENT"
            // Convert to COMPONENT type for recreation (must be after baseProps to override)
          });
          if (e.children && Array.isArray(e.children) && e.children.length > 0) {
            const m = Q(j({}, t), {
              depth: (t.depth || 0) + 1
            }), { extractNodeData: b } = await Promise.resolve().then(() => Qt), T = [];
            for (const P of e.children)
              try {
                let O;
                if (P.type === "INSTANCE")
                  try {
                    const G = await P.getMainComponentAsync();
                    if (G) {
                      const x = await M(
                        P,
                        t
                      ), U = await g(
                        P,
                        t
                      ), W = await b(
                        G,
                        /* @__PURE__ */ new WeakSet(),
                        m
                      );
                      O = Q(j(j(j({}, W), x), U), {
                        type: "COMPONENT"
                        // Convert to COMPONENT
                      });
                    } else
                      O = await b(
                        P,
                        /* @__PURE__ */ new WeakSet(),
                        m
                      ), O.type === "INSTANCE" && (O.type = "COMPONENT"), delete O._instanceRef;
                  } catch (G) {
                    O = await b(
                      P,
                      /* @__PURE__ */ new WeakSet(),
                      m
                    ), O.type === "INSTANCE" && (O.type = "COMPONENT"), delete O._instanceRef;
                  }
                else {
                  O = await b(
                    P,
                    /* @__PURE__ */ new WeakSet(),
                    m
                  );
                  const G = P.boundVariables;
                  if (G && typeof G == "object") {
                    const x = Object.keys(G);
                    x.length > 0 && (await a.log(
                      `  DEBUG: Child "${P.name || "Unnamed"}" -> boundVariables keys: ${x.join(", ")}`
                    ), G.backgrounds !== void 0 && await a.log(
                      `  DEBUG:   Child "${P.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(G.backgrounds)}`
                    ));
                  }
                  if (r.children && Array.isArray(r.children)) {
                    const x = r.children.find(
                      (U) => U.name === P.name
                    );
                    if (x) {
                      const U = x.boundVariables;
                      if (U && typeof U == "object") {
                        const W = Object.keys(U);
                        if (W.length > 0 && (await a.log(
                          `  DEBUG: Main component child "${x.name || "Unnamed"}" -> boundVariables keys: ${W.join(", ")}`
                        ), U.backgrounds !== void 0 && (await a.log(
                          `  DEBUG:   Main component child "${x.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(U.backgrounds)}`
                        ), !G || !G.backgrounds))) {
                          await a.log(
                            "  DEBUG:   Instance child doesn't have boundVariables.backgrounds, but main component child does - preserving from main component"
                          );
                          const { extractBoundVariables: K } = await Promise.resolve().then(() => we), D = await K(
                            U,
                            t.variableTable,
                            t.collectionTable
                          );
                          O.boundVariables || (O.boundVariables = {}), D.backgrounds && (O.boundVariables.backgrounds = D.backgrounds, await a.log(
                            "  DEBUG:   ✓ Added boundVariables.backgrounds to childData from main component child"
                          ));
                        }
                      }
                    }
                  }
                }
                T.push(O);
              } catch (O) {
                console.warn(
                  `Failed to extract child "${P.name || "Unnamed"}" for remote component "${f}":`,
                  O
                );
              }
            s.children = T;
          }
          if (!s)
            throw new Error("Failed to build structure for remote instance");
          try {
            const m = e.boundVariables;
            if (m && typeof m == "object") {
              const _ = Object.keys(m);
              await a.log(
                `  DEBUG: Instance "${p}" -> boundVariables keys: ${_.length > 0 ? _.join(", ") : "none"}`
              );
              for (const J of _) {
                const H = m[J], bt = (H == null ? void 0 : H.type) || typeof H;
                if (await a.log(
                  `  DEBUG:   boundVariables.${J}: type=${bt}, value=${JSON.stringify(H)}`
                ), H && typeof H == "object" && !Array.isArray(H)) {
                  const Re = Object.keys(H);
                  if (Re.length > 0) {
                    await a.log(
                      `  DEBUG:     boundVariables.${J} has nested keys: ${Re.join(", ")}`
                    );
                    for (const Ke of Re) {
                      const Pe = H[Ke];
                      Pe && typeof Pe == "object" && Pe.type === "VARIABLE_ALIAS" && await a.log(
                        `  DEBUG:       boundVariables.${J}.${Ke}: VARIABLE_ALIAS id=${Pe.id}`
                      );
                    }
                  }
                }
              }
              const z = [
                "backgrounds",
                "selectionColor",
                "selectionColors",
                "selection",
                "selectColor"
              ];
              for (const J of z)
                m[J] !== void 0 && await a.log(
                  `  DEBUG:   Found potential "Selection colors" property: boundVariables.${J} = ${JSON.stringify(m[J])}`
                );
            } else
              await a.log(
                `  DEBUG: Instance "${p}" -> No boundVariables found on instance node`
              );
            const b = m && m.fills !== void 0 && m.fills !== null, T = s.fills !== void 0 && Array.isArray(s.fills) && s.fills.length > 0, P = e.fills !== void 0 && Array.isArray(e.fills) && e.fills.length > 0, O = r.fills !== void 0 && Array.isArray(r.fills) && r.fills.length > 0;
            if (await a.log(
              `  DEBUG: Instance "${p}" -> fills check: instanceHasFills=${P}, structureHasFills=${T}, mainComponentHasFills=${O}, hasInstanceFillsBoundVar=${!!b}`
            ), b && !T) {
              await a.log(
                "  DEBUG: Instance has boundVariables.fills but structure has no fills - attempting to get fills"
              );
              try {
                if (P) {
                  const { serializeFills: _ } = await Promise.resolve().then(() => we), z = await _(
                    e.fills,
                    t.variableTable,
                    t.collectionTable
                  );
                  s.fills = z, await a.log(
                    `  DEBUG: Got ${z.length} fill(s) from instance node`
                  );
                } else if (O) {
                  const { serializeFills: _ } = await Promise.resolve().then(() => we), z = await _(
                    r.fills,
                    t.variableTable,
                    t.collectionTable
                  );
                  s.fills = z, await a.log(
                    `  DEBUG: Got ${z.length} fill(s) from main component`
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
            const G = e.selectionColor, x = r.selectionColor;
            G !== void 0 && await a.log(
              `  DEBUG: Instance "${p}" -> selectionColor: ${JSON.stringify(G)}`
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
                    const z = e[_];
                    await a.log(
                      `  DEBUG:   Instance.${_}: ${JSON.stringify(z)}`
                    );
                  }
                  if (W.includes(_)) {
                    const z = r[_];
                    await a.log(
                      `  DEBUG:   MainComponent.${_}: ${JSON.stringify(z)}`
                    );
                  }
                } catch (z) {
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
                for (const z of _) {
                  const J = D[z], H = (J == null ? void 0 : J.type) || typeof J;
                  await a.log(
                    `  DEBUG:   Main component boundVariables.${z}: type=${H}, value=${JSON.stringify(J)}`
                  );
                }
              }
            }
            if (m && Object.keys(m).length > 0) {
              await a.log(
                `  DEBUG: Preserving instance's boundVariables in structure (${Object.keys(m).length} key(s))`
              );
              const { extractBoundVariables: _ } = await Promise.resolve().then(() => we), z = await _(
                m,
                t.variableTable,
                t.collectionTable
              );
              s.boundVariables || (s.boundVariables = {});
              for (const [J, H] of Object.entries(
                z
              ))
                H !== void 0 && (s.boundVariables[J] !== void 0 && await a.log(
                  `  DEBUG: Structure already has boundVariables.${J} from baseProps, but instance also has it - using instance's boundVariables.${J}`
                ), s.boundVariables[J] = H, await a.log(
                  `  DEBUG: Set boundVariables.${J} in structure: ${JSON.stringify(H)}`
                ));
              z.fills !== void 0 ? await a.log(
                "  DEBUG: ✓ Preserved boundVariables.fills from instance"
              ) : b && await a.warning(
                "  DEBUG: Instance has boundVariables.fills but extractBoundVariables didn't extract it"
              ), z.backgrounds !== void 0 ? await a.log(
                `  DEBUG: ✓ Preserved boundVariables.backgrounds from instance: ${JSON.stringify(z.backgrounds)}`
              ) : m && m.backgrounds !== void 0 && await a.warning(
                "  DEBUG: Instance has boundVariables.backgrounds but extractBoundVariables didn't extract it"
              );
            }
            if (D && Object.keys(D).length > 0) {
              await a.log(
                `  DEBUG: Checking main component's boundVariables for properties not in instance (${Object.keys(D).length} key(s))`
              );
              const { extractBoundVariables: _ } = await Promise.resolve().then(() => we), z = await _(
                D,
                t.variableTable,
                t.collectionTable
              );
              s.boundVariables || (s.boundVariables = {});
              for (const [J, H] of Object.entries(
                z
              ))
                H !== void 0 && (s.boundVariables[J] === void 0 ? (s.boundVariables[J] = H, await a.log(
                  `  DEBUG: Added boundVariables.${J} from main component (not in instance): ${JSON.stringify(H)}`
                )) : await a.log(
                  `  DEBUG: Skipped boundVariables.${J} from main component (instance already has it)`
                ));
            }
            await a.log(
              `  DEBUG: Final structure for "${f}": hasFills=${!!s.fills}, fillsCount=${((o = s.fills) == null ? void 0 : o.length) || 0}, hasBoundVars=${!!s.boundVariables}, boundVarsKeys=${s.boundVariables ? Object.keys(s.boundVariables).join(", ") : "none"}`
            ), (c = s.boundVariables) != null && c.fills && await a.log(
              `  DEBUG: Structure boundVariables.fills: ${JSON.stringify(s.boundVariables.fills)}`
            );
          } catch (m) {
            await a.warning(
              `  Failed to handle bound variables for fills: ${m}`
            );
          }
          R.structure = s, N ? await a.log(
            `  Extracted structure for detached component "${f}" (ID: ${r.id.substring(0, 8)}...)`
          ) : await a.log(
            `  Extracted structure from instance for remote component "${f}" (preserving size overrides: ${e.width}x${e.height})`
          ), await a.log(
            `  Found INSTANCE: "${p}" -> REMOTE component "${f}" (ID: ${r.id.substring(0, 8)}...)${N ? " [DETACHED]" : ""}`
          );
        } catch (M) {
          const k = `Failed to extract structure for remote component "${f}": ${M instanceof Error ? M.message : String(M)}`;
          console.error(k, M), await a.error(k);
        }
    }
    const L = t.instanceTable.addInstance(R);
    n._instanceRef = L, i.add("_instanceRef");
  }
  return n;
}
class Ee {
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
    const n = new Ee(), i = Object.entries(t).sort(
      (o, c) => parseInt(o[0], 10) - parseInt(c[0], 10)
    );
    for (const [o, c] of i) {
      const r = parseInt(o, 10), p = n.generateKey(c);
      n.instanceMap.set(p, r), n.instances[r] = c, n.nextIndex = Math.max(n.nextIndex, r + 1);
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
const ot = {
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
  for (const [t, n] of Object.entries(ot))
    e[n] = t;
  return e;
}
function Ye(e) {
  var t;
  return (t = ot[e]) != null ? t : e;
}
function Yt(e) {
  var t;
  return typeof e == "number" ? (t = qt()[e]) != null ? t : e.toString() : e;
}
const rt = {
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
}, Ue = {};
for (const [e, t] of Object.entries(rt))
  Ue[t] = e;
class Ve {
  constructor() {
    ae(this, "shortToLong");
    ae(this, "longToShort");
    this.shortToLong = j({}, Ue), this.longToShort = j({}, rt);
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
      for (const [o, c] of Object.entries(t)) {
        const r = this.getShortName(o);
        if (r !== o && !i.has(r)) {
          let p = this.compressObject(c);
          r === "type" && typeof p == "string" && (p = Ye(p)), n[r] = p;
        } else {
          let p = this.compressObject(c);
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
        const c = this.getLongName(i);
        let r = this.expandObject(o);
        (c === "type" || i === "type") && (typeof r == "number" || typeof r == "string") && (r = Yt(r)), n[c] = r;
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
    const n = new Ve();
    n.shortToLong = j(j({}, Ue), t), n.longToShort = {};
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
function Te(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
function Me(e) {
  let t = 1;
  return e.children && e.children.length > 0 && e.children.forEach((n) => {
    t += Me(n);
  }), t;
}
async function xe(e, t = /* @__PURE__ */ new WeakSet(), n = {}) {
  var v, $, w, d, E, S, B;
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
  const c = {
    visited: (w = n.visited) != null ? w : /* @__PURE__ */ new WeakSet(),
    depth: (d = n.depth) != null ? d : 0,
    maxDepth: (E = n.maxDepth) != null ? E : 100,
    nodeCount: o + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: n.variableTable,
    collectionTable: n.collectionTable,
    instanceTable: n.instanceTable,
    detachedComponentsHandled: (S = n.detachedComponentsHandled) != null ? S : /* @__PURE__ */ new Set(),
    exportedIds: (B = n.exportedIds) != null ? B : /* @__PURE__ */ new Map()
  };
  if (t.has(e))
    return "[Circular Reference]";
  t.add(e), c.visited = t;
  const r = {}, p = await nt(e, c);
  if (Object.assign(r, p), r.id && c.exportedIds) {
    const R = c.exportedIds.get(r.id);
    if (R !== void 0) {
      const L = r.name || "Unnamed";
      if (R !== L) {
        const A = `Duplicate ID detected during export: ID "${r.id.substring(0, 8)}..." is used by both "${R}" and "${L}". Each node must have a unique ID.`;
        throw await a.error(A), new Error(A);
      }
      await a.warning(
        `Node "${L}" (ID: ${r.id.substring(0, 8)}...) was encountered multiple times during export. This may indicate a structural issue.`
      );
    } else
      c.exportedIds.set(r.id, r.name || "Unnamed");
  }
  const f = e.type;
  if (f)
    switch (f) {
      case "FRAME":
      case "COMPONENT": {
        const R = await Le(e);
        Object.assign(r, R);
        break;
      }
      case "INSTANCE": {
        const R = await Ht(
          e,
          c
        );
        Object.assign(r, R);
        const L = await Le(
          e
        );
        Object.assign(r, L);
        break;
      }
      case "TEXT": {
        const R = await Ut(e);
        Object.assign(r, R);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const R = await jt(e);
        Object.assign(r, R);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const R = await Dt(e);
        Object.assign(r, R);
        break;
      }
      default:
        c.unhandledKeys.add("_unknownType");
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
  for (const R of h)
    typeof e[R] != "function" && (y.has(R) || c.unhandledKeys.add(R));
  c.unhandledKeys.size > 0 && (r._unhandledKeys = Array.from(c.unhandledKeys).sort());
  const C = r._instanceRef !== void 0 && c.instanceTable && f === "INSTANCE";
  let l = !1;
  if (C) {
    const R = c.instanceTable.getInstanceByIndex(
      r._instanceRef
    );
    R && R.instanceType === "normal" && (l = !0, await a.log(
      `  Skipping children extraction for normal instance "${r.name || "Unnamed"}" - will be resolved from referenced component`
    ));
  }
  if (!l && e.children && Array.isArray(e.children)) {
    const R = c.maxDepth;
    if (c.depth >= R)
      r.children = {
        _truncated: !0,
        _reason: `Maximum depth (${R}) reached`,
        _count: e.children.length
      };
    else if (c.nodeCount >= i)
      r.children = {
        _truncated: !0,
        _reason: `Maximum node count (${i}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const L = Q(j({}, c), {
        depth: c.depth + 1
      }), A = [];
      let I = !1;
      for (const N of e.children) {
        if (L.nodeCount >= i) {
          r.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: A.length,
            _total: e.children.length,
            children: A
          }, I = !0;
          break;
        }
        const V = await xe(N, t, L);
        A.push(V), L.nodeCount && (c.nodeCount = L.nodeCount);
      }
      I || (r.children = A);
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
    const c = o[i], r = c.id;
    if (t.has(r))
      return await a.log(
        `Page "${c.name}" has already been processed, skipping...`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Page already processed",
        data: {}
      };
    t.add(r), await a.log(
      `Selected page: "${c.name}" (index: ${i})`
    ), await a.log(
      "Initializing variable, collection, and instance tables..."
    );
    const p = new ve(), f = new Ne(), h = new Ee();
    await a.log("Extracting node data from page..."), await a.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await a.log(
      "Collections will be discovered as variables are processed:"
    );
    const y = await xe(
      c,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: p,
        collectionTable: f,
        instanceTable: h
      }
    );
    await a.log("Node extraction finished");
    const C = Me(y), l = p.getSize(), v = f.getSize(), $ = h.getSize();
    if (await a.log("Extraction complete:"), await a.log(`  - Total nodes: ${C}`), await a.log(`  - Unique variables: ${l}`), await a.log(`  - Unique collections: ${v}`), await a.log(`  - Unique instances: ${$}`), v > 0) {
      await a.log("Collections found:");
      const s = f.getTable();
      for (const [m, b] of Object.values(s).entries()) {
        const T = b.collectionGuid ? ` (GUID: ${b.collectionGuid.substring(0, 8)}...)` : "";
        await a.log(
          `  ${m}: ${b.collectionName}${T} - ${b.modes.length} mode(s)`
        );
      }
    }
    await a.log("Checking for referenced component pages...");
    const w = [], d = h.getSerializedTable(), E = Object.values(d).filter(
      (s) => s.instanceType === "normal"
    );
    if (E.length > 0) {
      await a.log(
        `Found ${E.length} normal instance(s) to check`
      );
      const s = /* @__PURE__ */ new Map();
      for (const m of E)
        if (m.componentPageName) {
          const b = o.find((T) => T.name === m.componentPageName);
          if (b && !t.has(b.id))
            s.has(b.id) || s.set(b.id, b);
          else if (!b) {
            const T = `Normal instance references component "${m.componentName || "(unnamed)"}" on page "${m.componentPageName}", but that page was not found. Cannot export.`;
            throw await a.error(T), new Error(T);
          }
        } else {
          const b = `Normal instance references component "${m.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw await a.error(b), new Error(b);
        }
      await a.log(
        `Found ${s.size} unique referenced page(s)`
      );
      for (const [m, b] of s.entries()) {
        const T = b.name;
        if (t.has(m)) {
          await a.log(`Skipping "${T}" - already processed`);
          continue;
        }
        const P = b.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let O = !1;
        if (P)
          try {
            const x = JSON.parse(P);
            O = !!(x.id && x.version !== void 0);
          } catch (x) {
          }
        const G = `Do you want to also publish referenced component "${T}"?`;
        try {
          await ye.prompt(G, {
            okLabel: "Yes",
            cancelLabel: "No",
            timeoutMs: 3e5
            // 5 minutes
          }), await a.log(`Exporting referenced page: "${T}"`);
          const x = o.findIndex(
            (W) => W.id === b.id
          );
          if (x === -1)
            throw await a.error(
              `Could not find page index for "${T}"`
            ), new Error(`Could not find page index for "${T}"`);
          const U = await je(
            {
              pageIndex: x
            },
            t,
            // Pass the same set to track all processed pages
            !0
            // Mark as recursive call
          );
          if (U.success && U.data) {
            const W = U.data;
            w.push(W), await a.log(
              `Successfully exported referenced page: "${T}"`
            );
          } else
            throw new Error(
              `Failed to export referenced page "${T}": ${U.message}`
            );
        } catch (x) {
          if (x instanceof Error && x.message === "User cancelled")
            if (O)
              await a.log(
                `User declined to publish "${T}", but page has existing metadata. Continuing with existing metadata.`
              );
            else
              throw await a.error(
                `Export cancelled: Referenced page "${T}" has no metadata and user declined to publish it.`
              ), new Error(
                `Cannot continue export: Referenced component "${T}" has no metadata. Please publish it first or choose to publish it now.`
              );
          else
            throw x;
        }
      }
    }
    await a.log("Creating string table...");
    const S = new Ve();
    await a.log("Getting page metadata...");
    const B = c.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let R = "", L = 0;
    if (B)
      try {
        const s = JSON.parse(B);
        R = s.id || "", L = s.version || 0;
      } catch (s) {
        await a.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!R) {
      await a.log("Generating new GUID for page..."), R = await ze();
      const s = {
        _ver: 1,
        id: R,
        name: c.name,
        version: L,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      c.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(s)
      );
    }
    await a.log("Creating export data structure...");
    const A = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "1.0.0",
        figmaApiVersion: figma.apiVersion,
        guid: R,
        version: L,
        name: c.name,
        pluginVersion: "1.0.0"
      },
      stringTable: S.getSerializedTable(),
      collections: f.getSerializedTable(),
      variables: p.getSerializedTable(),
      instances: h.getSerializedTable(),
      pageData: y
    };
    await a.log("Compressing JSON data...");
    const I = Xt(A, S);
    await a.log("Serializing to JSON...");
    const N = JSON.stringify(I, null, 2), V = (N.length / 1024).toFixed(2), k = Te(c.name).trim().replace(/\s+/g, "_") + ".figma.json";
    await a.log(`JSON serialization complete: ${V} KB`), await a.log(`Export file: ${k}`), await a.log("=== Export Complete ===");
    const g = JSON.parse(N);
    return {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: k,
        pageData: g,
        pageName: c.name,
        additionalPages: w
        // Populated with referenced component pages
      }
    };
  } catch (i) {
    const o = i instanceof Error ? i.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", i), console.error("Error message:", o), await a.error(`Export failed: ${o}`), i instanceof Error && i.stack && (console.error("Stack trace:", i.stack), await a.error(`Stack trace: ${i.stack}`));
    const c = {
      type: "exportPage",
      success: !1,
      error: !0,
      message: o,
      data: {}
    };
    return console.error("Returning error response:", c), c;
  }
}
const Qt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  countTotalNodes: Me,
  exportPage: je,
  extractNodeData: xe
}, Symbol.toStringTag, { value: "Module" }));
async function pe(e, t) {
  for (const n of t)
    e.modes.find((o) => o.name === n) || e.addMode(n);
}
const oe = "recursica:collectionId";
async function Se(e) {
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
      oe
    );
    if (n && n.trim() !== "")
      return n;
    const i = await ze();
    return e.setSharedPluginData("recursica", oe, i), i;
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
              const C = t.getSharedPluginData(
                "recursica",
                oe
              );
              (!C || C.trim() === "") && t.setSharedPluginData(
                "recursica",
                oe,
                e.collectionGuid
              );
            } else
              await Se(t);
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
    if (e.collectionGuid && (p = r.find((f) => f.getSharedPluginData("recursica", oe) === e.collectionGuid)), p || (p = r.find(
      (f) => f.name === e.collectionName
    )), p)
      if (t = p, e.collectionGuid) {
        const f = t.getSharedPluginData(
          "recursica",
          oe
        );
        (!f || f.trim() === "") && t.setSharedPluginData(
          "recursica",
          oe,
          e.collectionGuid
        );
      } else
        await Se(t);
    else
      t = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? t.setSharedPluginData(
        "recursica",
        oe,
        e.collectionGuid
      ) : await Se(t);
  } else {
    const r = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), p = e.collectionName.trim().toLowerCase(), f = r.find((l) => l.name.trim().toLowerCase() === p);
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
    ), C = await figma.variables.getVariableCollectionByIdAsync(
      y.variableCollectionId
    );
    if (!C)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (t = C, e.collectionGuid) {
      const l = t.getSharedPluginData(
        "recursica",
        oe
      );
      (!l || l.trim() === "") && t.setSharedPluginData(
        "recursica",
        oe,
        e.collectionGuid
      );
    } else
      Se(t);
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
  for (const [c, r] of Object.entries(t)) {
    const p = i.modes.find((h) => h.name === c);
    if (!p) {
      console.warn(
        `Mode "${c}" not found in collection "${i.name}" for variable "${e.name}". Skipping.`
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
        const C = n.getVariableByIndex(
          h._varRef
        );
        if (C) {
          let l = null;
          if (o && C._colRef !== void 0) {
            const v = o.getCollectionByIndex(
              C._colRef
            );
            v && (l = (await ta(v)).collection);
          }
          l && (y = await De(
            l,
            C.variableName
          ));
        }
        if (y) {
          const l = {
            type: "VARIABLE_ALIAS",
            id: y.id
          };
          e.setValueForMode(f, l);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${c}" in variable "${e.name}". Variable reference index: ${h._varRef}`
          );
      }
    } catch (h) {
      console.warn(
        `Error setting value for mode "${c}" in variable "${e.name}":`,
        h
      );
    }
  }
}
async function Fe(e, t, n, i) {
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
  const c = i.get(String(o._colRef));
  if (!c)
    return null;
  const r = await De(
    c,
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
  return await Fe(
    o,
    c,
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
      const c = t[n];
      if (Array.isArray(c))
        for (let r = 0; r < c.length && r < o.length; r++) {
          const p = c[r];
          if (p && typeof p == "object") {
            if (o[r].boundVariables || (o[r].boundVariables = {}), ge(p)) {
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
                if (ge(h)) {
                  const y = h._varRef;
                  if (y !== void 0) {
                    const C = i.get(String(y));
                    C && (o[r].boundVariables[f] = {
                      type: "VARIABLE_ALIAS",
                      id: C.id
                    });
                  }
                }
          }
        }
    } catch (o) {
      console.log(`Error restoring bound variables for ${n}:`, o);
    }
}
function oa(e, t, n = !1) {
  const i = It(t);
  if (e.visible === void 0 && (e.visible = i.visible), e.locked === void 0 && (e.locked = i.locked), e.opacity === void 0 && (e.opacity = i.opacity), e.rotation === void 0 && (e.rotation = i.rotation), e.blendMode === void 0 && (e.blendMode = i.blendMode), t === "FRAME" || t === "COMPONENT" || t === "INSTANCE") {
    const o = Y;
    e.layoutMode === void 0 && (e.layoutMode = o.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = o.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = o.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = o.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = o.counterAxisAlignItems), n || (e.paddingLeft === void 0 && (e.paddingLeft = o.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = o.paddingRight), e.paddingTop === void 0 && (e.paddingTop = o.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = o.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = o.itemSpacing));
  }
  if (t === "TEXT") {
    const o = ie;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = o.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = o.textAlignVertical), e.textCase === void 0 && (e.textCase = o.textCase), e.textDecoration === void 0 && (e.textDecoration = o.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = o.textAutoResize);
  }
}
async function be(e, t, n = null, i = null, o = null, c = null, r = null, p = !1, f = null, h = null, y = null, C = null) {
  var A, I, N, V, M, k;
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
      if (e.id && r && r.has(e.id))
        l = r.get(e.id), await a.log(
          `Reusing existing COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id.substring(0, 8)}...)`
        );
      else if (l = figma.createComponent(), await a.log(
        `Created COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id ? e.id.substring(0, 8) + "..." : "no ID"})`
      ), e.componentPropertyDefinitions) {
        const g = e.componentPropertyDefinitions;
        let u = 0, s = 0;
        for (const [m, b] of Object.entries(g))
          try {
            const T = b.type;
            let P = null;
            if (typeof T == "string" ? (T === "TEXT" || T === "BOOLEAN" || T === "INSTANCE_SWAP" || T === "VARIANT") && (P = T) : typeof T == "number" && (P = {
              2: "TEXT",
              // Text property
              25: "BOOLEAN",
              // Boolean property
              27: "INSTANCE_SWAP",
              // Instance swap property
              26: "VARIANT"
              // Variant property
            }[T] || null), !P) {
              await a.warning(
                `  Unknown property type ${T} (${typeof T}) for property "${m}" in component "${e.name || "Unnamed"}"`
              ), s++;
              continue;
            }
            const O = b.defaultValue, G = m.split("#")[0];
            l.addComponentProperty(
              G,
              P,
              O
            ), u++;
          } catch (T) {
            await a.warning(
              `  Failed to add component property "${m}" to "${e.name || "Unnamed"}": ${T}`
            ), s++;
          }
        u > 0 && await a.log(
          `  Added ${u} component property definition(s) to "${e.name || "Unnamed"}"${s > 0 ? ` (${s} failed)` : ""}`
        );
      }
      break;
    case "COMPONENT_SET": {
      const g = e.children ? e.children.filter((m) => m.type === "COMPONENT").length : 0;
      await a.log(
        `Creating COMPONENT_SET "${e.name || "Unnamed"}" by combining ${g} component variant(s)`
      );
      const u = [];
      let s = null;
      if (e.children && Array.isArray(e.children)) {
        s = figma.createFrame(), s.name = `_temp_${e.name || "COMPONENT_SET"}`, s.visible = !1, ((t == null ? void 0 : t.type) === "PAGE" ? t : figma.currentPage).appendChild(s);
        for (const b of e.children)
          if (b.type === "COMPONENT" && !b._truncated)
            try {
              const T = await be(
                b,
                s,
                // Use temp parent for now
                n,
                i,
                o,
                c,
                r,
                p,
                f,
                null,
                // deferredInstances - not needed for component set creation
                null,
                // parentNodeData - not needed here, will be passed correctly in recursive calls
                C
              );
              T && T.type === "COMPONENT" && (u.push(T), await a.log(
                `  Created component variant: "${T.name || "Unnamed"}"`
              ));
            } catch (T) {
              await a.warning(
                `  Failed to create component variant "${b.name || "Unnamed"}": ${T}`
              );
            }
      }
      if (u.length > 0)
        try {
          const m = t || figma.currentPage, b = figma.combineAsVariants(
            u,
            m
          );
          e.name && (b.name = e.name), e.x !== void 0 && (b.x = e.x), e.y !== void 0 && (b.y = e.y), s && s.parent && s.remove(), await a.log(
            `  ✓ Successfully created COMPONENT_SET "${b.name}" with ${u.length} variant(s)`
          ), l = b;
        } catch (m) {
          if (await a.warning(
            `  Failed to combine components into COMPONENT_SET "${e.name || "Unnamed"}": ${m}. Falling back to frame.`
          ), l = figma.createFrame(), e.name && (l.name = e.name), s && s.children.length > 0) {
            for (const b of s.children)
              l.appendChild(b);
            s.remove();
          }
        }
      else
        await a.warning(
          `  No valid component variants found for COMPONENT_SET "${e.name || "Unnamed"}". Creating frame instead.`
        ), l = figma.createFrame(), e.name && (l.name = e.name), s && s.remove();
      break;
    }
    case "INSTANCE":
      if (p)
        l = figma.createFrame(), e.name && (l.name = e.name);
      else if (e._instanceRef !== void 0 && o && r) {
        const g = o.getInstanceByIndex(
          e._instanceRef
        );
        if (g && g.instanceType === "internal")
          if (g.componentNodeId)
            if (g.componentNodeId === e.id)
              await a.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), l = figma.createFrame(), e.name && (l.name = e.name);
            else {
              const u = r.get(
                g.componentNodeId
              );
              if (!u) {
                const s = Array.from(r.keys()).slice(
                  0,
                  20
                );
                await a.error(
                  `Component not found for internal instance "${e.name}" (ID: ${g.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), await a.error(
                  `Looking for component ID: ${g.componentNodeId}`
                ), await a.error(
                  `Available IDs in mapping (first 20): ${s.map((O) => O.substring(0, 8) + "...").join(", ")}`
                );
                const m = (O, G) => {
                  if (O.type === "COMPONENT" && O.id === G)
                    return !0;
                  if (O.children && Array.isArray(O.children)) {
                    for (const x of O.children)
                      if (!x._truncated && m(x, G))
                        return !0;
                  }
                  return !1;
                }, b = m(
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
                const T = s.filter(
                  (O) => O.startsWith(g.componentNodeId.substring(0, 8))
                );
                T.length > 0 && await a.error(
                  `Found IDs with matching prefix: ${T.map((O) => O.substring(0, 8) + "...").join(", ")}`
                );
                const P = `Component not found for internal instance "${e.name}" (ID: ${g.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${s.map((O) => O.substring(0, 8) + "...").join(", ")}`;
                throw new Error(P);
              }
              if (u && u.type === "COMPONENT") {
                if (l = u.createInstance(), await a.log(
                  `✓ Created internal instance "${e.name}" from component "${g.componentName}"`
                ), g.variantProperties && Object.keys(g.variantProperties).length > 0)
                  try {
                    let s = null;
                    if (u.parent && u.parent.type === "COMPONENT_SET")
                      s = u.parent.componentPropertyDefinitions, await a.log(
                        `  DEBUG: Component "${g.componentName}" is inside component set "${u.parent.name}" with ${Object.keys(s || {}).length} property definitions`
                      );
                    else {
                      const m = await l.getMainComponentAsync();
                      if (m) {
                        const b = m.type;
                        await a.log(
                          `  DEBUG: Internal instance "${e.name}" - componentNode parent: ${u.parent ? u.parent.type : "N/A"}, mainComponent type: ${b}, mainComponent parent: ${m.parent ? m.parent.type : "N/A"}`
                        ), b === "COMPONENT_SET" ? s = m.componentPropertyDefinitions : b === "COMPONENT" && m.parent && m.parent.type === "COMPONENT_SET" ? (s = m.parent.componentPropertyDefinitions, await a.log(
                          `  DEBUG: Found component set parent "${m.parent.name}" with ${Object.keys(s || {}).length} property definitions`
                        )) : await a.log(
                          `  Skipping variant properties for internal instance "${e.name}" - component "${g.componentName}" is not yet in a COMPONENT_SET (will be moved later during component set creation)`
                        );
                      }
                    }
                    if (s) {
                      const m = {};
                      for (const [b, T] of Object.entries(
                        g.variantProperties
                      )) {
                        const P = b.split("#")[0];
                        s[P] && (m[P] = T);
                      }
                      Object.keys(m).length > 0 && l.setProperties(m);
                    }
                  } catch (s) {
                    const m = `Failed to set variant properties for instance "${e.name}": ${s}`;
                    throw await a.error(m), new Error(m);
                  }
                if (g.componentProperties && Object.keys(g.componentProperties).length > 0)
                  try {
                    const s = await l.getMainComponentAsync();
                    if (s) {
                      let m = null;
                      const b = s.type;
                      if (b === "COMPONENT_SET" ? m = s.componentPropertyDefinitions : b === "COMPONENT" && s.parent && s.parent.type === "COMPONENT_SET" ? m = s.parent.componentPropertyDefinitions : b === "COMPONENT" && (m = s.componentPropertyDefinitions), m)
                        for (const [T, P] of Object.entries(
                          g.componentProperties
                        )) {
                          const O = T.split("#")[0];
                          if (m[O])
                            try {
                              let G = P;
                              P && typeof P == "object" && "value" in P && (G = P.value), l.setProperties({
                                [O]: G
                              });
                            } catch (G) {
                              const x = `Failed to set component property "${O}" for internal instance "${e.name}": ${G}`;
                              throw await a.error(x), new Error(x);
                            }
                        }
                    } else
                      await a.warning(
                        `Cannot set component properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (s) {
                    if (s instanceof Error)
                      throw s;
                    const m = `Failed to set component properties for instance "${e.name}": ${s}`;
                    throw await a.error(m), new Error(m);
                  }
              } else if (!l && u) {
                const s = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${g.componentNodeId.substring(0, 8)}...).`;
                throw await a.error(s), new Error(s);
              }
            }
          else {
            const u = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw await a.error(u), new Error(u);
          }
        else if (g && g.instanceType === "remote")
          if (f) {
            const u = f.get(
              e._instanceRef
            );
            if (u) {
              if (l = u.createInstance(), await a.log(
                `✓ Created remote instance "${e.name}" from component "${g.componentName}" on REMOTES page`
              ), g.variantProperties && Object.keys(g.variantProperties).length > 0)
                try {
                  const s = await l.getMainComponentAsync();
                  if (s) {
                    let m = null;
                    const b = s.type;
                    if (b === "COMPONENT_SET" ? m = s.componentPropertyDefinitions : b === "COMPONENT" && s.parent && s.parent.type === "COMPONENT_SET" ? m = s.parent.componentPropertyDefinitions : await a.log(
                      `Skipping variant properties for remote instance "${e.name}" - main component is not a COMPONENT_SET or variant (expected for remote components)`
                    ), m) {
                      const T = {};
                      for (const [P, O] of Object.entries(
                        g.variantProperties
                      )) {
                        const G = P.split("#")[0];
                        m[G] && (T[G] = O);
                      }
                      Object.keys(T).length > 0 && l.setProperties(T);
                    }
                  } else
                    await a.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (s) {
                  const m = `Failed to set variant properties for remote instance "${e.name}": ${s}`;
                  throw await a.error(m), new Error(m);
                }
              if (g.componentProperties && Object.keys(g.componentProperties).length > 0)
                try {
                  const s = await l.getMainComponentAsync();
                  if (s) {
                    let m = null;
                    const b = s.type;
                    if (b === "COMPONENT_SET" ? m = s.componentPropertyDefinitions : b === "COMPONENT" && s.parent && s.parent.type === "COMPONENT_SET" ? m = s.parent.componentPropertyDefinitions : b === "COMPONENT" && (m = s.componentPropertyDefinitions), m)
                      for (const [T, P] of Object.entries(
                        g.componentProperties
                      )) {
                        const O = T.split("#")[0];
                        if (m[O])
                          try {
                            let G = P;
                            P && typeof P == "object" && "value" in P && (G = P.value), l.setProperties({
                              [O]: G
                            });
                          } catch (G) {
                            const x = `Failed to set component property "${O}" for remote instance "${e.name}": ${G}`;
                            throw await a.error(x), new Error(x);
                          }
                      }
                  } else
                    await a.warning(
                      `Cannot set component properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (s) {
                  if (s instanceof Error)
                    throw s;
                  const m = `Failed to set component properties for remote instance "${e.name}": ${s}`;
                  throw await a.error(m), new Error(m);
                }
              if (e.width !== void 0 && e.height !== void 0)
                try {
                  l.resize(e.width, e.height);
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
            const u = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw await a.error(u), new Error(u);
          }
        else if ((g == null ? void 0 : g.instanceType) === "normal") {
          if (!g.componentPageName) {
            const P = `Normal instance "${e.name}" missing componentPageName. Cannot resolve.`;
            throw await a.error(P), new Error(P);
          }
          await figma.loadAllPagesAsync();
          const u = figma.root.children.find(
            (P) => P.name === g.componentPageName
          );
          if (!u) {
            await a.log(
              `  Deferring normal instance "${e.name}" - referenced page "${g.componentPageName}" does not exist yet (may be circular reference or not yet imported)`
            );
            const P = figma.createFrame();
            P.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (P.x = e.x), e.y !== void 0 && (P.y = e.y), e.width !== void 0 && e.height !== void 0 ? P.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && P.resize(e.w, e.h), h && h.push({
              placeholderFrame: P,
              instanceEntry: g,
              nodeData: e,
              parentNode: t,
              instanceIndex: e._instanceRef
            }), l = P;
            break;
          }
          let s = null;
          const m = (P, O, G, x, U) => {
            if (O.length === 0) {
              let D = null;
              for (const _ of P.children || [])
                if (_.type === "COMPONENT") {
                  if (_.name === G)
                    if (D || (D = _), x)
                      try {
                        const z = _.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (z && JSON.parse(z).id === x)
                          return _;
                      } catch (z) {
                      }
                    else
                      return _;
                } else if (_.type === "COMPONENT_SET") {
                  if (U && _.name !== U)
                    continue;
                  for (const z of _.children || [])
                    if (z.type === "COMPONENT" && z.name === G)
                      if (D || (D = z), x)
                        try {
                          const J = z.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (J && JSON.parse(J).id === x)
                            return z;
                        } catch (J) {
                        }
                      else
                        return z;
                }
              return D;
            }
            const [W, ...K] = O;
            for (const D of P.children || [])
              if (D.name === W) {
                if (K.length === 0 && D.type === "COMPONENT_SET") {
                  if (U && D.name !== U)
                    continue;
                  for (const _ of D.children || [])
                    if (_.type === "COMPONENT" && _.name === G) {
                      if (x)
                        try {
                          const z = _.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (z && JSON.parse(z).id === x)
                            return _;
                        } catch (z) {
                        }
                      return _;
                    }
                  return null;
                }
                return m(
                  D,
                  K,
                  G,
                  x,
                  U
                );
              }
            return null;
          };
          await a.log(
            `  Looking for component "${g.componentName}" on page "${g.componentPageName}"${g.path && g.path.length > 0 ? ` at path [${g.path.join(" → ")}]` : " at page root"}${g.componentGuid ? ` (GUID: ${g.componentGuid.substring(0, 8)}...)` : ""}`
          );
          const b = [], T = (P, O = 0) => {
            const G = "  ".repeat(O);
            if (P.type === "COMPONENT")
              b.push(`${G}COMPONENT: "${P.name}"`);
            else if (P.type === "COMPONENT_SET") {
              b.push(
                `${G}COMPONENT_SET: "${P.name}"`
              );
              for (const x of P.children || [])
                x.type === "COMPONENT" && b.push(
                  `${G}  └─ COMPONENT: "${x.name}"`
                );
            }
            for (const x of P.children || [])
              T(x, O + 1);
          };
          if (T(u), b.length > 0 ? await a.log(
            `  Available components on page "${g.componentPageName}":
${b.slice(0, 20).join(`
`)}${b.length > 20 ? `
  ... and ${b.length - 20} more` : ""}`
          ) : await a.warning(
            `  No components found on page "${g.componentPageName}"`
          ), s = m(
            u,
            g.path || [],
            g.componentName,
            g.componentGuid,
            g.componentSetName
          ), s && g.componentGuid)
            try {
              const P = s.getPluginData(
                "RecursicaPublishedMetadata"
              );
              if (P) {
                const O = JSON.parse(P);
                O.id !== g.componentGuid ? await a.warning(
                  `  Found component "${g.componentName}" by name but GUID verification failed (expected ${g.componentGuid.substring(0, 8)}..., got ${O.id ? O.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`
                ) : await a.log(
                  `  Found component "${g.componentName}" with matching GUID ${g.componentGuid.substring(0, 8)}...`
                );
              } else
                await a.warning(
                  `  Found component "${g.componentName}" by name but no metadata found. Using name match as fallback.`
                );
            } catch (P) {
              await a.warning(
                `  Found component "${g.componentName}" by name but GUID verification failed. Using name match as fallback.`
              );
            }
          if (!s) {
            await a.log(
              `  Deferring normal instance "${e.name}" - component "${g.componentName}" not found on page "${g.componentPageName}" (may not be created yet due to circular reference)`
            );
            const P = figma.createFrame();
            P.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (P.x = e.x), e.y !== void 0 && (P.y = e.y), e.width !== void 0 && e.height !== void 0 ? P.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && P.resize(e.w, e.h), h && h.push({
              placeholderFrame: P,
              instanceEntry: g,
              nodeData: e,
              parentNode: t,
              instanceIndex: e._instanceRef
            }), l = P;
            break;
          }
          if (l = s.createInstance(), await a.log(
            `  Created normal instance "${e.name}" from component "${g.componentName}" on page "${g.componentPageName}"`
          ), g.variantProperties && Object.keys(g.variantProperties).length > 0)
            try {
              const P = await l.getMainComponentAsync();
              if (P) {
                let O = null;
                const G = P.type;
                if (G === "COMPONENT_SET" ? O = P.componentPropertyDefinitions : G === "COMPONENT" && P.parent && P.parent.type === "COMPONENT_SET" ? O = P.parent.componentPropertyDefinitions : await a.warning(
                  `Cannot set variant properties for normal instance "${e.name}" - main component is not a COMPONENT_SET or variant`
                ), O) {
                  const x = {};
                  for (const [U, W] of Object.entries(
                    g.variantProperties
                  )) {
                    const K = U.split("#")[0];
                    O[K] && (x[K] = W);
                  }
                  Object.keys(x).length > 0 && l.setProperties(x);
                }
              }
            } catch (P) {
              await a.warning(
                `Failed to set variant properties for normal instance "${e.name}": ${P}`
              );
            }
          if (g.componentProperties && Object.keys(g.componentProperties).length > 0)
            try {
              const P = await l.getMainComponentAsync();
              if (P) {
                let O = null;
                const G = P.type;
                if (G === "COMPONENT_SET" ? O = P.componentPropertyDefinitions : G === "COMPONENT" && P.parent && P.parent.type === "COMPONENT_SET" ? O = P.parent.componentPropertyDefinitions : G === "COMPONENT" && (O = P.componentPropertyDefinitions), O) {
                  const x = {};
                  for (const [U, W] of Object.entries(
                    g.componentProperties
                  )) {
                    const K = U.split("#")[0];
                    let D;
                    if (O[U] ? D = U : O[K] ? D = K : D = Object.keys(O).find(
                      (_) => _.split("#")[0] === K
                    ), D) {
                      const _ = W && typeof W == "object" && "value" in W ? W.value : W;
                      x[D] = _;
                    } else
                      await a.warning(
                        `Component property "${K}" (from "${U}") does not exist on component "${g.componentName}" for normal instance "${e.name}". Available properties: ${Object.keys(O).join(", ") || "none"}`
                      );
                  }
                  if (Object.keys(x).length > 0)
                    try {
                      await a.log(
                        `  Attempting to set component properties for normal instance "${e.name}": ${Object.keys(x).join(", ")}`
                      ), await a.log(
                        `  Available component properties: ${Object.keys(O).join(", ")}`
                      ), l.setProperties(x), await a.log(
                        `  ✓ Successfully set component properties for normal instance "${e.name}": ${Object.keys(x).join(", ")}`
                      );
                    } catch (U) {
                      await a.warning(
                        `Failed to set component properties for normal instance "${e.name}": ${U}`
                      ), await a.warning(
                        `  Properties attempted: ${JSON.stringify(x)}`
                      ), await a.warning(
                        `  Available properties: ${JSON.stringify(Object.keys(O))}`
                      );
                    }
                }
              } else
                await a.warning(
                  `Cannot set component properties for normal instance "${e.name}" - main component not found`
                );
            } catch (P) {
              await a.warning(
                `Failed to set component properties for normal instance "${e.name}": ${P}`
              );
            }
          if (e.width !== void 0 && e.height !== void 0)
            try {
              l.resize(e.width, e.height);
            } catch (P) {
              await a.log(
                `Note: Could not resize normal instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
              );
            }
        } else {
          const u = `Instance "${e.name}" has unknown or missing instance type: ${(g == null ? void 0 : g.instanceType) || "unknown"}`;
          throw await a.error(u), new Error(u);
        }
      } else {
        const g = `Instance "${e.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        throw await a.error(g), new Error(g);
      }
      break;
    case "GROUP":
      l = figma.createFrame();
      break;
    case "BOOLEAN_OPERATION": {
      const g = `Boolean operation nodes cannot be imported. Found boolean operation: "${e.name}".`;
      throw await a.error(g), new Error(g);
    }
    case "POLYGON":
      l = figma.createPolygon();
      break;
    default: {
      const g = `Unsupported node type: ${e.type}. This node type cannot be imported.`;
      throw await a.error(g), new Error(g);
    }
  }
  if (!l)
    return null;
  e.id && r && (r.set(e.id, l), l.type === "COMPONENT" && await a.log(
    `  Stored COMPONENT "${e.name || "Unnamed"}" in nodeIdMapping (ID: ${e.id.substring(0, 8)}...)`
  )), e._instanceRef !== void 0 && l.type === "INSTANCE" ? (r._instanceTableMap || (r._instanceTableMap = /* @__PURE__ */ new Map()), r._instanceTableMap.set(
    l.id,
    e._instanceRef
  ), await a.log(
    `  Stored instance table mapping: instance "${l.name}" (ID: ${l.id.substring(0, 8)}...) -> instance table index ${e._instanceRef}`
  )) : l.type === "INSTANCE" && await a.log(
    `  WARNING: Instance "${l.name}" (ID: ${l.id.substring(0, 8)}...) has no _instanceRef in nodeData - will use fallback matching in third pass`
  );
  const v = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.paddingLeft || e.boundVariables.paddingRight || e.boundVariables.paddingTop || e.boundVariables.paddingBottom || e.boundVariables.itemSpacing);
  oa(
    l,
    e.type || "FRAME",
    v
  ), e.name !== void 0 && (l.name = e.name || "Unnamed Node");
  const $ = y && y.layoutMode !== void 0 && y.layoutMode !== "NONE", w = t && "layoutMode" in t && t.layoutMode !== "NONE";
  $ || w || (e.x !== void 0 && (l.x = e.x), e.y !== void 0 && (l.y = e.y));
  const E = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
  e.type !== "VECTOR" && e.width !== void 0 && e.height !== void 0 && !E && l.resize(e.width, e.height);
  const S = e.boundVariables && typeof e.boundVariables == "object";
  if (e.visible !== void 0 && (l.visible = e.visible), e.locked !== void 0 && (l.locked = e.locked), e.opacity !== void 0 && (!S || !e.boundVariables.opacity) && (l.opacity = e.opacity), e.rotation !== void 0 && (!S || !e.boundVariables.rotation) && (l.rotation = e.rotation), e.blendMode !== void 0 && (!S || !e.boundVariables.blendMode) && (l.blendMode = e.blendMode), e.type !== "INSTANCE") {
    if (e.type === "VECTOR" && e.boundVariables && (await a.log(
      `  DEBUG: VECTOR "${e.name || "Unnamed"}" (ID: ${((A = e.id) == null ? void 0 : A.substring(0, 8)) || "unknown"}...) has boundVariables: ${Object.keys(e.boundVariables).join(", ")}`
    ), e.boundVariables.fills && await a.log(
      `  DEBUG:   boundVariables.fills: ${JSON.stringify(e.boundVariables.fills)}`
    )), e.fills !== void 0)
      try {
        let g = e.fills;
        if (Array.isArray(g) && (g = g.map((u) => {
          if (u && typeof u == "object") {
            const s = j({}, u);
            return delete s.boundVariables, s;
          }
          return u;
        })), e.fills && Array.isArray(e.fills) && c) {
          if (e.type === "VECTOR") {
            await a.log(
              `  DEBUG: VECTOR "${e.name || "Unnamed"}" has ${e.fills.length} fill(s)`
            );
            for (let s = 0; s < e.fills.length; s++) {
              const m = e.fills[s];
              if (m && typeof m == "object") {
                const b = m.boundVariables || m.bndVar;
                b ? await a.log(
                  `  DEBUG:   fill[${s}] has boundVariables: ${JSON.stringify(b)}`
                ) : await a.log(
                  `  DEBUG:   fill[${s}] has no boundVariables`
                );
              }
            }
          }
          const u = [];
          for (let s = 0; s < g.length; s++) {
            const m = g[s], b = e.fills[s];
            if (!b || typeof b != "object") {
              u.push(m);
              continue;
            }
            const T = b.boundVariables || b.bndVar;
            if (!T) {
              u.push(m);
              continue;
            }
            const P = j({}, m);
            P.boundVariables = {};
            for (const [O, G] of Object.entries(T))
              if (e.type === "VECTOR" && await a.log(
                `  DEBUG: Processing fill[${s}].${O} on VECTOR "${l.name || "Unnamed"}": varInfo=${JSON.stringify(G)}`
              ), ge(G)) {
                const x = G._varRef;
                if (x !== void 0) {
                  if (e.type === "VECTOR") {
                    await a.log(
                      `  DEBUG: Looking up variable reference ${x} in recognizedVariables (map has ${c.size} entries)`
                    );
                    const W = Array.from(
                      c.keys()
                    ).slice(0, 10);
                    await a.log(
                      `  DEBUG: Available variable references (first 10): ${W.join(", ")}`
                    );
                    const K = c.has(String(x));
                    if (await a.log(
                      `  DEBUG: Variable reference ${x} ${K ? "found" : "NOT FOUND"} in recognizedVariables`
                    ), !K) {
                      const D = Array.from(
                        c.keys()
                      ).sort((_, z) => parseInt(_) - parseInt(z));
                      await a.log(
                        `  DEBUG: All available variable references: ${D.join(", ")}`
                      );
                    }
                  }
                  let U = c.get(String(x));
                  U || (e.type === "VECTOR" && await a.log(
                    `  DEBUG: Variable ${x} not in recognizedVariables. variableTable=${!!n}, collectionTable=${!!i}, recognizedCollections=${!!C}`
                  ), n && i && C ? (await a.log(
                    `  Variable reference ${x} not in recognizedVariables, attempting to resolve from variable table...`
                  ), U = await na(
                    x,
                    n,
                    i,
                    C
                  ) || void 0, U ? (c.set(String(x), U), await a.log(
                    `  ✓ Resolved variable ${U.name} from variable table and added to recognizedVariables`
                  )) : await a.warning(
                    `  Failed to resolve variable ${x} from variable table`
                  )) : e.type === "VECTOR" && await a.warning(
                    `  Cannot resolve variable ${x} from table - missing required parameters`
                  )), U ? (P.boundVariables[O] = {
                    type: "VARIABLE_ALIAS",
                    id: U.id
                  }, await a.log(
                    `  ✓ Restored bound variable for fill[${s}].${O} on "${l.name || "Unnamed"}" (${e.type}): variable ${U.name} (ID: ${U.id.substring(0, 8)}...)`
                  )) : await a.warning(
                    `  Variable reference ${x} not found in recognizedVariables for fill[${s}].${O} on "${l.name || "Unnamed"}"`
                  );
                } else
                  e.type === "VECTOR" && await a.warning(
                    `  DEBUG: Variable reference ${x} is undefined for fill[${s}].${O} on VECTOR "${l.name || "Unnamed"}"`
                  );
              } else
                e.type === "VECTOR" && await a.warning(
                  `  DEBUG: fill[${s}].${O} on VECTOR "${l.name || "Unnamed"}" is not a variable reference: ${JSON.stringify(G)}`
                );
            u.push(P);
          }
          l.fills = u, await a.log(
            `  ✓ Set fills with boundVariables on "${l.name || "Unnamed"}" (${e.type})`
          );
        } else
          l.fills = g;
        e.boundVariables && Object.keys(e.boundVariables).length > 0 && !e.boundVariables.fills && await a.log(
          `  Node "${l.name || "Unnamed"}" (${e.type}) has boundVariables but not for fills: ${Object.keys(e.boundVariables).join(", ")}`
        );
      } catch (g) {
        console.log("Error setting fills:", g);
      }
    else if (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "GROUP")
      try {
        l.fills = [];
      } catch (g) {
        console.log("Error clearing fills:", g);
      }
  }
  if (e.strokes !== void 0)
    try {
      e.strokes.length > 0 ? l.strokes = e.strokes : l.strokes = [];
    } catch (g) {
      console.log("Error setting strokes:", g);
    }
  else if (e.type === "VECTOR")
    try {
      l.strokes = [];
    } catch (g) {
    }
  const B = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.strokeWeight || e.boundVariables.strokeAlign);
  e.strokeWeight !== void 0 ? (!B || !e.boundVariables.strokeWeight) && (l.strokeWeight = e.strokeWeight) : e.type === "VECTOR" && (e.strokes === void 0 || e.strokes.length === 0) && (!B || !e.boundVariables.strokeWeight) && (l.strokeWeight = 0), e.strokeAlign !== void 0 && (!B || !e.boundVariables.strokeAlign) && (l.strokeAlign = e.strokeAlign);
  const R = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.cornerRadius || e.boundVariables.topLeftRadius || e.boundVariables.topRightRadius || e.boundVariables.bottomLeftRadius || e.boundVariables.bottomRightRadius);
  if (e.cornerRadius !== void 0 && (!R || !e.boundVariables.cornerRadius) && (l.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (l.effects = e.effects), e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") {
    if (e.layoutMode !== void 0 && (l.layoutMode = e.layoutMode), e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.boundVariables && c) {
      const u = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ];
      for (const s of u) {
        const m = e.boundVariables[s];
        if (m && ge(m)) {
          const b = m._varRef;
          if (b !== void 0) {
            const T = c.get(String(b));
            if (T) {
              const P = {
                type: "VARIABLE_ALIAS",
                id: T.id
              };
              l.boundVariables || (l.boundVariables = {});
              const O = l[s], G = (I = l.boundVariables) == null ? void 0 : I[s];
              await a.log(
                `  DEBUG: Attempting to set bound variable for ${s} on "${e.name || "Unnamed"}": current value=${O}, current boundVar=${JSON.stringify(G)}`
              );
              try {
                delete l.boundVariables[s];
              } catch (U) {
              }
              try {
                l.boundVariables[s] = P;
                const U = (N = l.boundVariables) == null ? void 0 : N[s];
                await a.log(
                  `  DEBUG: Immediately after setting ${s} bound variable: ${JSON.stringify(U)}`
                );
              } catch (U) {
                await a.warning(
                  `  Error setting bound variable for ${s}: ${U}`
                );
              }
              const x = (V = l.boundVariables) == null ? void 0 : V[s];
              x && typeof x == "object" && x.type === "VARIABLE_ALIAS" && x.id === T.id ? await a.log(
                `  ✓ Set bound variable for ${s} on "${e.name || "Unnamed"}" (${e.type}): variable ${T.name} (ID: ${T.id.substring(0, 8)}...)`
              ) : await a.warning(
                `  Failed to set bound variable for ${s} on "${e.name || "Unnamed"}" - verification failed. Expected: ${JSON.stringify(P)}, Got: ${JSON.stringify(x)}`
              );
            }
          }
        }
      }
    }
    e.layoutWrap !== void 0 && (l.layoutWrap = e.layoutWrap), e.primaryAxisSizingMode !== void 0 ? l.primaryAxisSizingMode = e.primaryAxisSizingMode : l.primaryAxisSizingMode = "AUTO", e.counterAxisSizingMode !== void 0 ? l.counterAxisSizingMode = e.counterAxisSizingMode : l.counterAxisSizingMode = "AUTO", e.primaryAxisAlignItems !== void 0 && (l.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (l.counterAxisAlignItems = e.counterAxisAlignItems);
    const g = e.boundVariables && typeof e.boundVariables == "object";
    if (g) {
      const u = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ].filter((s) => e.boundVariables[s]);
      u.length > 0 && await a.log(
        `  DEBUG: Node "${e.name || "Unnamed"}" (${e.type}) has bound variables for: ${u.join(", ")}`
      );
    }
    e.paddingLeft !== void 0 && (!g || !e.boundVariables.paddingLeft) && (l.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (!g || !e.boundVariables.paddingRight) && (l.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (!g || !e.boundVariables.paddingTop) && (l.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (!g || !e.boundVariables.paddingBottom) && (l.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (!g || !e.boundVariables.itemSpacing) && (l.itemSpacing = e.itemSpacing), e.layoutGrow !== void 0 && (l.layoutGrow = e.layoutGrow);
  }
  if ((e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (l.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (l.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (l.dashPattern = e.dashPattern), e.type === "VECTOR")) {
    if (e.fillGeometry !== void 0)
      try {
        const { normalizeSvgPath: u } = await Promise.resolve().then(() => zt), s = e.fillGeometry.map((m) => {
          const b = m.data;
          return {
            data: u(b),
            windingRule: m.windingRule || m.windRule || "NONZERO"
          };
        });
        for (let m = 0; m < e.fillGeometry.length; m++) {
          const b = e.fillGeometry[m].data, T = s[m].data;
          b !== T && await a.log(
            `  Normalized path ${m + 1} for "${e.name || "Unnamed"}": ${b.substring(0, 50)}... -> ${T.substring(0, 50)}...`
          );
        }
        l.vectorPaths = s, await a.log(
          `  Set vectorPaths for VECTOR "${e.name || "Unnamed"}" (${s.length} path(s))`
        );
      } catch (u) {
        await a.warning(
          `Error setting vectorPaths for VECTOR "${e.name || "Unnamed"}": ${u}`
        );
      }
    if (e.strokeGeometry !== void 0)
      try {
        l.strokeGeometry = e.strokeGeometry;
      } catch (u) {
        await a.warning(
          `Error setting strokeGeometry for VECTOR "${e.name || "Unnamed"}": ${u}`
        );
      }
    const g = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
    if (e.width !== void 0 && e.height !== void 0 && !g)
      try {
        l.resize(e.width, e.height), await a.log(
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
          await figma.loadFontAsync(e.fontName), l.fontName = e.fontName;
        } catch (u) {
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
      l.characters = e.characters;
      const g = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.fontSize || e.boundVariables.letterSpacing || e.boundVariables.lineHeight);
      e.fontSize !== void 0 && (!g || !e.boundVariables.fontSize) && (l.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (l.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (l.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (!g || !e.boundVariables.letterSpacing) && (l.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (!g || !e.boundVariables.lineHeight) && (l.lineHeight = e.lineHeight), e.textCase !== void 0 && (l.textCase = e.textCase), e.textDecoration !== void 0 && (l.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (l.textAutoResize = e.textAutoResize);
    } catch (g) {
      console.log("Error setting text properties: " + g);
      try {
        l.characters = e.characters;
      } catch (u) {
        console.log("Could not set text characters: " + u);
      }
    }
  if (e.boundVariables && c) {
    const g = [
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "paddingBottom",
      "itemSpacing"
    ];
    for (const [u, s] of Object.entries(
      e.boundVariables
    ))
      if (u !== "fills" && !g.includes(u) && ge(s) && n && c) {
        const m = s._varRef;
        if (m !== void 0) {
          const b = c.get(String(m));
          if (b)
            try {
              const T = {
                type: "VARIABLE_ALIAS",
                id: b.id
              };
              l.boundVariables || (l.boundVariables = {});
              const P = l[u];
              P !== void 0 && l.boundVariables[u] === void 0 && await a.warning(
                `  Property ${u} has direct value ${P} which may prevent bound variable from being set`
              ), l.boundVariables[u] = T;
              const G = (M = l.boundVariables) == null ? void 0 : M[u];
              if (G && typeof G == "object" && G.type === "VARIABLE_ALIAS" && G.id === b.id)
                await a.log(
                  `  ✓ Set bound variable for ${u} on "${e.name || "Unnamed"}" (${e.type}): variable ${b.name} (ID: ${b.id.substring(0, 8)}...)`
                );
              else {
                const x = (k = l.boundVariables) == null ? void 0 : k[u];
                await a.warning(
                  `  Failed to set bound variable for ${u} on "${e.name || "Unnamed"}" - bound variable not persisted. Property value: ${P}, Expected: ${JSON.stringify(T)}, Got: ${JSON.stringify(x)}`
                );
              }
            } catch (T) {
              await a.warning(
                `  Error setting bound variable for ${u} on "${e.name || "Unnamed"}": ${T}`
              );
            }
          else
            await a.warning(
              `  Variable reference ${m} not found in recognizedVariables for ${u} on "${e.name || "Unnamed"}"`
            );
        }
      }
  }
  if (e.boundVariables && c && (e.boundVariables.width || e.boundVariables.height)) {
    const g = e.boundVariables.width, u = e.boundVariables.height;
    if (g && ge(g)) {
      const s = g._varRef;
      if (s !== void 0) {
        const m = c.get(String(s));
        if (m) {
          const b = {
            type: "VARIABLE_ALIAS",
            id: m.id
          };
          l.boundVariables || (l.boundVariables = {}), l.boundVariables.width = b;
        }
      }
    }
    if (u && ge(u)) {
      const s = u._varRef;
      if (s !== void 0) {
        const m = c.get(String(s));
        if (m) {
          const b = {
            type: "VARIABLE_ALIAS",
            id: m.id
          };
          l.boundVariables || (l.boundVariables = {}), l.boundVariables.height = b;
        }
      }
    }
  }
  const L = e.id && r && r.has(e.id) && l.type === "COMPONENT" && l.children && l.children.length > 0;
  if (e.children && Array.isArray(e.children) && l.type !== "INSTANCE" && !L) {
    const g = (s) => {
      const m = [];
      for (const b of s)
        b._truncated || (b.type === "COMPONENT" ? (m.push(b), b.children && Array.isArray(b.children) && m.push(...g(b.children))) : b.children && Array.isArray(b.children) && m.push(...g(b.children)));
      return m;
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
    const u = g(e.children);
    await a.log(
      `  First pass: Creating ${u.length} COMPONENT node(s) (without children)...`
    );
    for (const s of u)
      await a.log(
        `  Collected COMPONENT "${s.name || "Unnamed"}" (ID: ${s.id ? s.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const s of u)
      if (s.id && r && !r.has(s.id)) {
        const m = figma.createComponent();
        if (s.name !== void 0 && (m.name = s.name || "Unnamed Node"), s.componentPropertyDefinitions) {
          const b = s.componentPropertyDefinitions;
          let T = 0, P = 0;
          for (const [O, G] of Object.entries(b))
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
              }[G.type];
              if (!U) {
                await a.warning(
                  `  Unknown property type ${G.type} for property "${O}" in component "${s.name || "Unnamed"}"`
                ), P++;
                continue;
              }
              const W = G.defaultValue, K = O.split("#")[0];
              m.addComponentProperty(
                K,
                U,
                W
              ), T++;
            } catch (x) {
              await a.warning(
                `  Failed to add component property "${O}" to "${s.name || "Unnamed"}" in first pass: ${x}`
              ), P++;
            }
          T > 0 && await a.log(
            `  Added ${T} component property definition(s) to "${s.name || "Unnamed"}" in first pass${P > 0 ? ` (${P} failed)` : ""}`
          );
        }
        r.set(s.id, m), await a.log(
          `  Created COMPONENT "${s.name || "Unnamed"}" (ID: ${s.id.substring(0, 8)}...) in first pass`
        );
      }
    for (const s of e.children) {
      if (s._truncated)
        continue;
      const m = await be(
        s,
        l,
        n,
        i,
        o,
        c,
        r,
        p,
        f,
        null,
        // deferredInstances - not needed for remote structures
        e,
        // parentNodeData - pass the parent's nodeData so children can check for auto-layout
        C
      );
      if (m && m.parent !== l) {
        if (m.parent && typeof m.parent.removeChild == "function")
          try {
            m.parent.removeChild(m);
          } catch (b) {
            await a.warning(
              `Failed to remove child "${m.name || "Unnamed"}" from parent "${m.parent.name || "Unnamed"}": ${b}`
            );
          }
        l.appendChild(m);
      }
    }
  }
  if (t && l.parent !== t) {
    if (l.parent && typeof l.parent.removeChild == "function")
      try {
        l.parent.removeChild(l);
      } catch (g) {
        await a.warning(
          `Failed to remove node "${l.name || "Unnamed"}" from parent "${l.parent.name || "Unnamed"}": ${g}`
        );
      }
    t.appendChild(l);
  }
  return l;
}
async function ra(e, t, n) {
  let i = 0, o = 0, c = 0;
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
      let C = null, l;
      if (n._instanceTableMap ? (l = n._instanceTableMap.get(
        f.id
      ), l !== void 0 ? (C = y[l], await a.log(
        `  Found instance table index ${l} for instance "${f.name}" (ID: ${f.id.substring(0, 8)}...)`
      )) : await a.log(
        `  No instance table index mapping found for instance "${f.name}" (ID: ${f.id.substring(0, 8)}...), using fallback matching`
      )) : await a.log(
        `  No instance table map found, using fallback matching for instance "${f.name}"`
      ), !C) {
        for (const [$, w] of Object.entries(y))
          if (w.instanceType === "internal" && w.componentNodeId && n.has(w.componentNodeId)) {
            const d = n.get(w.componentNodeId);
            if (d && d.id === h.id) {
              C = w, await a.log(
                `  Matched instance "${f.name}" to instance table entry ${$} by component (less precise)`
              );
              break;
            }
          }
      }
      if (!C) {
        await a.log(
          `  No matching entry found for instance "${f.name}" (main component: ${h.name}, ID: ${h.id.substring(0, 8)}...)`
        ), o++;
        continue;
      }
      if (!C.variantProperties) {
        await a.log(
          `  Instance table entry for "${f.name}" has no variant properties`
        ), o++;
        continue;
      }
      await a.log(
        `  Instance "${f.name}" matched to entry with variant properties: ${JSON.stringify(C.variantProperties)}`
      );
      let v = null;
      if (h.parent && h.parent.type === "COMPONENT_SET" && (v = h.parent.componentPropertyDefinitions), v) {
        const $ = {};
        for (const [w, d] of Object.entries(
          C.variantProperties
        )) {
          const E = w.split("#")[0];
          v[E] && ($[E] = d);
        }
        Object.keys($).length > 0 ? (f.setProperties($), i++, await a.log(
          `  ✓ Set variant properties on instance "${f.name}": ${JSON.stringify($)}`
        )) : o++;
      } else
        o++;
    } catch (h) {
      c++, await a.warning(
        `  Failed to set variant properties on instance "${f.name}": ${h}`
      );
    }
  await a.log(
    `  Variant properties set: ${i} processed, ${o} skipped, ${c} errors`
  );
}
async function Xe(e) {
  await figma.loadAllPagesAsync();
  const t = figma.root.children, n = new Set(t.map((c) => c.name));
  if (!n.has(e))
    return e;
  let i = 1, o = `${e}_${i}`;
  for (; n.has(o); )
    i++, o = `${e}_${i}`;
  return o;
}
async function sa(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), n = new Set(t.map((c) => c.name));
  if (!n.has(e))
    return e;
  let i = 1, o = `${e}_${i}`;
  for (; n.has(o); )
    i++, o = `${e}_${i}`;
  return o;
}
async function ca(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const c of e.variableIds)
    try {
      const r = await figma.variables.getVariableByIdAsync(c);
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
  const t = await figma.variables.getLocalVariableCollectionsAsync(), n = te(e.collectionName);
  if (le(e.collectionName)) {
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
        oe
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
    t = Ve.fromTable(e.stringTable);
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
function ga(e) {
  if (!e.collections)
    return {
      success: !1,
      error: "No collections table found in JSON"
    };
  try {
    return {
      success: !0,
      collectionTable: Ne.fromTable(
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
async function pa(e, t) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), c = e.getTable();
  for (const [r, p] of Object.entries(c)) {
    if (p.isLocal === !1) {
      await a.log(
        `Skipping remote collection: "${p.collectionName}" (index ${r})`
      );
      continue;
    }
    const f = te(p.collectionName), h = t == null ? void 0 : t.get(f);
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
      for (const [o, { entry: c, collection: r }] of e.entries()) {
        const p = te(
          c.collectionName
        ).toLowerCase();
        let f = !1;
        p === "tokens" || p === "token" ? f = i.tokens === "existing" : p === "theme" || p === "themes" ? f = i.theme === "existing" : (p === "layer" || p === "layers") && (f = i.layers === "existing");
        const h = le(c.collectionName) ? te(c.collectionName) : r.name;
        f ? (await a.log(
          `✓ Wizard selection: Using existing collection "${h}" (index ${o})`
        ), t.set(o, r), await pe(r, c.modes), await a.log(
          `  ✓ Ensured modes for collection "${h}" (${c.modes.length} mode(s))`
        )) : (await a.log(
          `✗ Wizard selection: Will create new collection for "${c.collectionName}" (index ${o})`
        ), n.set(o, c));
      }
      return;
    }
    await a.log(
      `Prompting user for ${e.size} potential match(es)...`
    );
    for (const [o, { entry: c, collection: r }] of e.entries())
      try {
        const p = le(c.collectionName) ? te(c.collectionName) : r.name, f = `Found existing "${p}" variable collection. Should I use it?`;
        await a.log(
          `Prompting user about potential match: "${p}"`
        ), await ye.prompt(f, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await a.log(
          `✓ User confirmed: Using existing collection "${p}" (index ${o})`
        ), t.set(o, r), await pe(r, c.modes), await a.log(
          `  ✓ Ensured modes for collection "${p}" (${c.modes.length} mode(s))`
        );
      } catch (p) {
        await a.log(
          `✗ User rejected: Will create new collection for "${c.collectionName}" (index ${o})`
        ), n.set(o, c);
      }
  }
}
async function ma(e, t, n) {
  if (e.size === 0)
    return;
  await a.log("Ensuring modes exist for recognized collections...");
  const i = t.getTable();
  for (const [o, c] of e.entries()) {
    const r = i[o];
    r && (n.has(o) || (await pe(c, r.modes), await a.log(
      `  ✓ Ensured modes for collection "${c.name}" (${r.modes.length} mode(s))`
    )));
  }
}
async function ua(e, t, n, i) {
  if (e.size !== 0) {
    await a.log(
      `Processing ${e.size} collection(s) to create...`
    );
    for (const [o, c] of e.entries()) {
      const r = te(c.collectionName), p = i == null ? void 0 : i.get(r);
      if (p) {
        await a.log(
          `Reusing pre-created collection: "${r}" (index ${o}, id: ${p.id.substring(0, 8)}...)`
        ), t.set(o, p), await pe(p, c.modes), n.push(p);
        continue;
      }
      const f = await sa(r);
      f !== r ? await a.log(
        `Creating collection: "${f}" (normalized: "${r}" - name conflict resolved)`
      ) : await a.log(`Creating collection: "${f}"`);
      const h = figma.variables.createVariableCollection(f);
      n.push(h);
      let y;
      if (le(c.collectionName)) {
        const C = Oe(c.collectionName);
        C && (y = C);
      } else c.collectionGuid && (y = c.collectionGuid);
      y && (h.setSharedPluginData(
        "recursica",
        oe,
        y
      ), await a.log(
        `  Stored GUID: ${y.substring(0, 8)}...`
      )), await pe(h, c.modes), await a.log(
        `  ✓ Created collection "${f}" with ${c.modes.length} mode(s)`
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
      variableTable: ve.fromTable(e.variables)
    };
  } catch (t) {
    return {
      success: !1,
      error: `Failed to load variables table: ${t instanceof Error ? t.message : "Unknown error"}`
    };
  }
}
async function ya(e, t, n, i) {
  const o = /* @__PURE__ */ new Map(), c = [], r = new Set(
    i.map((h) => h.id)
  );
  await a.log("Matching and creating variables in collections...");
  const p = e.getTable(), f = /* @__PURE__ */ new Map();
  for (const [h, y] of Object.entries(p)) {
    if (y._colRef === void 0)
      continue;
    const C = n.get(String(y._colRef));
    if (!C)
      continue;
    f.has(C.id) || f.set(C.id, {
      collectionName: C.name,
      existing: 0,
      created: 0
    });
    const l = f.get(C.id), v = r.has(
      C.id
    );
    let $;
    typeof y.variableType == "number" ? $ = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[y.variableType] || String(y.variableType) : $ = y.variableType;
    const w = await De(
      C,
      y.variableName
    );
    if (w)
      if (st(w, $))
        o.set(h, w), l.existing++;
      else {
        await a.warning(
          `Type mismatch for variable "${y.variableName}" in collection "${C.name}": expected ${$}, found ${w.resolvedType}. Creating new variable with incremented name.`
        );
        const d = await ca(
          C,
          y.variableName
        ), E = await Fe(
          Q(j({}, y), {
            variableName: d,
            variableType: $
          }),
          C,
          e,
          t
        );
        v || c.push(E), o.set(h, E), l.created++;
      }
    else {
      const d = await Fe(
        Q(j({}, y), {
          variableType: $
        }),
        C,
        e,
        t
      );
      v || c.push(d), o.set(h, d), l.created++;
    }
  }
  await a.log("Variable processing complete:");
  for (const h of f.values())
    await a.log(
      `  "${h.collectionName}": ${h.existing} existing, ${h.created} created`
    );
  return {
    recognizedVariables: o,
    newlyCreatedVariables: c
  };
}
function ba(e) {
  if (!e.instances)
    return null;
  try {
    return Ee.fromTable(e.instances);
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
  for (const c of e.children)
    (c.type === "FRAME" || c.type === "COMPONENT") && n.add(c.name);
  if (!n.has(t))
    return t;
  let i = 1, o = `${t}_${i}`;
  for (; n.has(o); )
    i++, o = `${t}_${i}`;
  return o;
}
async function Na(e, t, n, i, o, c = "") {
  var $;
  const r = e.getSerializedTable(), p = Object.values(r).filter(
    (w) => w.instanceType === "remote"
  ), f = /* @__PURE__ */ new Map();
  if (p.length === 0)
    return await a.log("No remote instances found"), f;
  await a.log(
    `Processing ${p.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  const h = figma.root.children, y = c ? `${c} REMOTES` : "REMOTES";
  let C = h.find(
    (w) => w.name === "REMOTES" || w.name === y
  );
  if (C ? (await a.log("Found existing REMOTES page"), c && !C.name.startsWith(c) && (C.name = y)) : (C = figma.createPage(), C.name = y, await a.log("Created REMOTES page")), p.length > 0 && (C.setPluginData("RecursicaUnderReview", "true"), await a.log("Marked REMOTES page as under review")), !C.children.some(
    (w) => w.type === "FRAME" && w.name === "Title"
  )) {
    const w = { family: "Inter", style: "Bold" }, d = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(w), await figma.loadFontAsync(d);
    const E = figma.createFrame();
    E.name = "Title", E.layoutMode = "VERTICAL", E.paddingTop = 20, E.paddingBottom = 20, E.paddingLeft = 20, E.paddingRight = 20, E.fills = [];
    const S = figma.createText();
    S.fontName = w, S.characters = "REMOTE INSTANCES", S.fontSize = 24, S.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], E.appendChild(S);
    const B = figma.createText();
    B.fontName = d, B.characters = "These are remotely connected component instances found in our different component pages.", B.fontSize = 14, B.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], E.appendChild(B), C.appendChild(E), await a.log("Created title and description on REMOTES page");
  }
  const v = /* @__PURE__ */ new Map();
  for (const [w, d] of Object.entries(r)) {
    if (d.instanceType !== "remote")
      continue;
    const E = parseInt(w, 10);
    if (await a.log(
      `Processing remote instance ${E}: "${d.componentName}"`
    ), !d.structure) {
      await a.warning(
        `Remote instance "${d.componentName}" missing structure data, skipping`
      );
      continue;
    }
    We(d.structure);
    const S = d.structure.children !== void 0, B = d.structure.child !== void 0, R = d.structure.children ? d.structure.children.length : d.structure.child ? d.structure.child.length : 0;
    await a.log(
      `  Structure type: ${d.structure.type || "unknown"}, has children: ${R} (children key: ${S}, child key: ${B})`
    );
    let L = d.componentName;
    if (d.path && d.path.length > 0) {
      const I = d.path.filter((N) => N !== "").join(" / ");
      I && (L = `${I} / ${d.componentName}`);
    }
    const A = await $a(
      C,
      L
    );
    A !== L && await a.log(
      `Component name conflict: "${L}" -> "${A}"`
    );
    try {
      if (d.structure.type !== "COMPONENT") {
        await a.warning(
          `Remote instance "${d.componentName}" structure is not a COMPONENT (type: ${d.structure.type}), creating frame fallback`
        );
        const N = figma.createFrame();
        N.name = A;
        const V = await be(
          d.structure,
          N,
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
        V ? (N.appendChild(V), C.appendChild(N), await a.log(
          `✓ Created remote instance frame fallback: "${A}"`
        )) : N.remove();
        continue;
      }
      const I = figma.createComponent();
      I.name = A, C.appendChild(I), await a.log(
        `  Created component node: "${A}"`
      );
      try {
        if (d.structure.componentPropertyDefinitions) {
          const s = d.structure.componentPropertyDefinitions;
          let m = 0, b = 0;
          for (const [T, P] of Object.entries(s))
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
              }[P.type];
              if (!G) {
                await a.warning(
                  `  Unknown property type ${P.type} for property "${T}" in component "${d.componentName}"`
                ), b++;
                continue;
              }
              const x = P.defaultValue, U = T.split("#")[0];
              I.addComponentProperty(
                U,
                G,
                x
              ), m++;
            } catch (O) {
              await a.warning(
                `  Failed to add component property "${T}" to "${d.componentName}": ${O}`
              ), b++;
            }
          m > 0 && await a.log(
            `  Added ${m} component property definition(s) to "${d.componentName}"${b > 0 ? ` (${b} failed)` : ""}`
          );
        }
        d.structure.name !== void 0 && (I.name = d.structure.name);
        const N = d.structure.boundVariables && typeof d.structure.boundVariables == "object" && (d.structure.boundVariables.width || d.structure.boundVariables.height);
        d.structure.width !== void 0 && d.structure.height !== void 0 && !N && I.resize(d.structure.width, d.structure.height), d.structure.x !== void 0 && (I.x = d.structure.x), d.structure.y !== void 0 && (I.y = d.structure.y);
        const V = d.structure.boundVariables && typeof d.structure.boundVariables == "object";
        if (d.structure.visible !== void 0 && (I.visible = d.structure.visible), d.structure.opacity !== void 0 && (!V || !d.structure.boundVariables.opacity) && (I.opacity = d.structure.opacity), d.structure.rotation !== void 0 && (!V || !d.structure.boundVariables.rotation) && (I.rotation = d.structure.rotation), d.structure.blendMode !== void 0 && (!V || !d.structure.boundVariables.blendMode) && (I.blendMode = d.structure.blendMode), d.structure.fills !== void 0)
          try {
            let s = d.structure.fills;
            Array.isArray(s) && (s = s.map((m) => {
              if (m && typeof m == "object") {
                const b = j({}, m);
                return delete b.boundVariables, b;
              }
              return m;
            })), I.fills = s, ($ = d.structure.boundVariables) != null && $.fills && i && await ia(
              I,
              d.structure.boundVariables,
              "fills",
              i
            );
          } catch (s) {
            await a.warning(
              `Error setting fills for remote component "${d.componentName}": ${s}`
            );
          }
        if (d.structure.strokes !== void 0)
          try {
            I.strokes = d.structure.strokes;
          } catch (s) {
            await a.warning(
              `Error setting strokes for remote component "${d.componentName}": ${s}`
            );
          }
        const M = d.structure.boundVariables && typeof d.structure.boundVariables == "object" && (d.structure.boundVariables.strokeWeight || d.structure.boundVariables.strokeAlign);
        d.structure.strokeWeight !== void 0 && (!M || !d.structure.boundVariables.strokeWeight) && (I.strokeWeight = d.structure.strokeWeight), d.structure.strokeAlign !== void 0 && (!M || !d.structure.boundVariables.strokeAlign) && (I.strokeAlign = d.structure.strokeAlign), d.structure.layoutMode !== void 0 && (I.layoutMode = d.structure.layoutMode), d.structure.primaryAxisSizingMode !== void 0 && (I.primaryAxisSizingMode = d.structure.primaryAxisSizingMode), d.structure.counterAxisSizingMode !== void 0 && (I.counterAxisSizingMode = d.structure.counterAxisSizingMode);
        const k = d.structure.boundVariables && typeof d.structure.boundVariables == "object";
        d.structure.paddingLeft !== void 0 && (!k || !d.structure.boundVariables.paddingLeft) && (I.paddingLeft = d.structure.paddingLeft), d.structure.paddingRight !== void 0 && (!k || !d.structure.boundVariables.paddingRight) && (I.paddingRight = d.structure.paddingRight), d.structure.paddingTop !== void 0 && (!k || !d.structure.boundVariables.paddingTop) && (I.paddingTop = d.structure.paddingTop), d.structure.paddingBottom !== void 0 && (!k || !d.structure.boundVariables.paddingBottom) && (I.paddingBottom = d.structure.paddingBottom), d.structure.itemSpacing !== void 0 && (!k || !d.structure.boundVariables.itemSpacing) && (I.itemSpacing = d.structure.itemSpacing);
        const g = d.structure.boundVariables && typeof d.structure.boundVariables == "object" && (d.structure.boundVariables.cornerRadius || d.structure.boundVariables.topLeftRadius || d.structure.boundVariables.topRightRadius || d.structure.boundVariables.bottomLeftRadius || d.structure.boundVariables.bottomRightRadius);
        if (d.structure.cornerRadius !== void 0 && (!g || !d.structure.boundVariables.cornerRadius) && (I.cornerRadius = d.structure.cornerRadius), d.structure.boundVariables && i) {
          const s = d.structure.boundVariables, m = [
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
          for (const b of m)
            if (s[b] && ge(s[b])) {
              const T = s[b]._varRef;
              if (T !== void 0) {
                const P = i.get(String(T));
                if (P) {
                  const O = {
                    type: "VARIABLE_ALIAS",
                    id: P.id
                  };
                  I.boundVariables || (I.boundVariables = {}), I.boundVariables[b] = O;
                }
              }
            }
        }
        await a.log(
          `  DEBUG: Structure keys: ${Object.keys(d.structure).join(", ")}, has children: ${!!d.structure.children}, has child: ${!!d.structure.child}`
        );
        const u = d.structure.children || (d.structure.child ? d.structure.child : null);
        if (await a.log(
          `  DEBUG: childrenArray exists: ${!!u}, isArray: ${Array.isArray(u)}, length: ${u ? u.length : 0}`
        ), u && Array.isArray(u) && u.length > 0) {
          await a.log(
            `  Recreating ${u.length} child(ren) for component "${d.componentName}"`
          );
          for (let s = 0; s < u.length; s++) {
            const m = u[s];
            if (await a.log(
              `  DEBUG: Processing child ${s + 1}/${u.length}: ${JSON.stringify({ name: m == null ? void 0 : m.name, type: m == null ? void 0 : m.type, hasTruncated: !!(m != null && m._truncated) })}`
            ), m._truncated) {
              await a.log(
                `  Skipping truncated child: ${m._reason || "Unknown"}`
              );
              continue;
            }
            await a.log(
              `  Recreating child: "${m.name || "Unnamed"}" (type: ${m.type})`
            );
            const b = await be(
              m,
              I,
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
              d.structure,
              // parentNodeData - pass the component's structure so children can check for auto-layout
              o
            );
            b ? (I.appendChild(b), await a.log(
              `  ✓ Appended child "${m.name || "Unnamed"}" to component "${d.componentName}"`
            )) : await a.warning(
              `  ✗ Failed to create child "${m.name || "Unnamed"}" (type: ${m.type})`
            );
          }
        }
        f.set(E, I), await a.log(
          `✓ Created remote component: "${A}" (index ${E})`
        );
      } catch (N) {
        await a.warning(
          `Error populating remote component "${d.componentName}": ${N instanceof Error ? N.message : "Unknown error"}`
        ), I.remove();
      }
    } catch (I) {
      await a.warning(
        `Error recreating remote instance "${d.componentName}": ${I instanceof Error ? I.message : "Unknown error"}`
      );
    }
  }
  return await a.log(
    `Remote instance processing complete: ${f.size} component(s) created`
  ), f;
}
async function va(e, t, n, i, o, c, r = null, p = null, f = !1, h = null, y = !1, C = !1, l = "") {
  await a.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const v = figma.root.children, $ = "RecursicaPublishedMetadata";
  let w = null;
  for (const V of v) {
    const M = V.getPluginData($);
    if (M)
      try {
        if (JSON.parse(M).id === e.guid) {
          w = V;
          break;
        }
      } catch (k) {
        continue;
      }
  }
  let d = !1;
  if (w && !f && !y) {
    let V;
    try {
      const g = w.getPluginData($);
      g && (V = JSON.parse(g).version);
    } catch (g) {
    }
    const M = V !== void 0 ? ` v${V}` : "", k = `Found existing component "${w.name}${M}". Should I use it or create a copy?`;
    await a.log(
      `Found existing page with same GUID: "${w.name}". Prompting user...`
    );
    try {
      await ye.prompt(k, {
        okLabel: "Use",
        cancelLabel: "Copy",
        timeoutMs: 3e5
        // 5 minutes
      }), d = !0, await a.log(
        `User chose to use existing page: "${w.name}"`
      );
    } catch (g) {
      await a.log(
        "User chose to create a copy. Will create new page."
      );
    }
  }
  if (d && w)
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
  const E = v.find((V) => V.name === e.name);
  E && await a.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let S;
  if (w || E) {
    const V = `__${e.name}`;
    S = await Xe(V), await a.log(
      `Creating scratch page: "${S}" (will be renamed to "${e.name}" on success)`
    );
  } else
    S = e.name, await a.log(`Creating page: "${S}"`);
  const B = figma.createPage();
  if (B.name = S, await figma.setCurrentPageAsync(B), await a.log(`Switched to page: "${S}"`), !t.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await a.log("Recreating page structure...");
  const R = t.pageData;
  if (R.backgrounds !== void 0)
    try {
      B.backgrounds = R.backgrounds, await a.log(
        `Set page background: ${JSON.stringify(R.backgrounds)}`
      );
    } catch (V) {
      await a.warning(`Failed to set page background: ${V}`);
    }
  We(R);
  const L = /* @__PURE__ */ new Map(), A = (V, M = []) => {
    if (V.type === "COMPONENT" && V.id && M.push(V.id), V.children && Array.isArray(V.children))
      for (const k of V.children)
        k._truncated || A(k, M);
    return M;
  }, I = A(R);
  if (await a.log(
    `Found ${I.length} COMPONENT node(s) in page data`
  ), I.length > 0 && (await a.log(
    `Component IDs in page data (first 20): ${I.slice(0, 20).map((V) => V.substring(0, 8) + "...").join(", ")}`
  ), R._allComponentIds = I), R.children && Array.isArray(R.children))
    for (const V of R.children) {
      const M = await be(
        V,
        B,
        n,
        i,
        o,
        c,
        L,
        !1,
        // isRemoteStructure: false - we're creating the main page
        r,
        p,
        R,
        // parentNodeData - pass the page's nodeData so children can check for auto-layout
        h
      );
      M && B.appendChild(M);
    }
  await a.log("Page structure recreated successfully"), o && (await a.log(
    "Third pass: Setting variant properties on instances..."
  ), await ra(
    B,
    o,
    L
  ));
  const N = {
    _ver: 1,
    id: e.guid,
    name: e.name,
    version: e.version || 0,
    publishDate: (/* @__PURE__ */ new Date()).toISOString(),
    history: {}
  };
  if (B.setPluginData($, JSON.stringify(N)), await a.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), S.startsWith("__")) {
    let V;
    C ? V = l ? `${l} ${e.name}` : e.name : V = await Xe(e.name), B.name = V, await a.log(`Renamed page from "${S}" to "${V}"`);
  } else C && l && (B.name.startsWith(l) || (B.name = `${l} ${B.name}`));
  return {
    success: !0,
    page: B
  };
}
async function ct(e) {
  var i, o, c;
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
    const C = ga(y);
    if (!C.success)
      return C.error === "No collections table found in JSON" ? (await a.log(C.error), await a.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: f.name }
      }) : (await a.error(C.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: C.error,
        data: {}
      });
    const l = C.collectionTable;
    await a.log(
      `Loaded collections table with ${l.getSize()} collection(s)`
    ), await a.log(
      "Matching collections with existing local collections..."
    );
    const { recognizedCollections: v, potentialMatches: $, collectionsToCreate: w } = await pa(l, e.preCreatedCollections);
    await fa(
      $,
      v,
      w,
      e.collectionChoices
    ), await ma(
      v,
      l,
      $
    ), await ua(
      w,
      v,
      n,
      e.preCreatedCollections
    ), await a.log("Loading variables table...");
    const d = ha(y);
    if (!d.success)
      return d.error === "No variables table found in JSON" ? (await a.log(d.error), await a.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no variables to process)",
        data: { pageName: f.name }
      }) : (await a.error(d.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: d.error,
        data: {}
      });
    const E = d.variableTable;
    await a.log(
      `Loaded variables table with ${E.getSize()} variable(s)`
    );
    const { recognizedVariables: S, newlyCreatedVariables: B } = await ya(
      E,
      l,
      v,
      n
    );
    await a.log("Loading instance table...");
    const R = ba(y);
    if (R) {
      const b = R.getSerializedTable(), T = Object.values(b).filter(
        (O) => O.instanceType === "internal"
      ), P = Object.values(b).filter(
        (O) => O.instanceType === "remote"
      );
      await a.log(
        `Loaded instance table with ${R.getSize()} instance(s) (${T.length} internal, ${P.length} remote)`
      );
    } else
      await a.log("No instance table found in JSON");
    const L = [], A = (i = e.isMainPage) != null ? i : !0, I = (o = e.alwaysCreateCopy) != null ? o : !1, N = (c = e.skipUniqueNaming) != null ? c : !1, V = e.constructionIcon || "";
    let M = null;
    R && (M = await Na(
      R,
      E,
      l,
      S,
      v,
      V
    ));
    const k = await va(
      f,
      y,
      E,
      l,
      R,
      S,
      M,
      L,
      A,
      v,
      I,
      N,
      V
    );
    if (!k.success)
      return await a.error(k.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: k.error,
        data: {}
      };
    const g = k.page, u = S.size + B.length, s = L.length;
    await a.log("=== Import Complete ==="), await a.log(
      `Successfully processed ${v.size} collection(s), ${u} variable(s), and created page "${g.name}"${s > 0 ? ` (${s} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`
    );
    const m = k.pageId || g.id;
    return {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: {
        pageName: g.name,
        pageId: m,
        // Include pageId for tracking (used for both new and reused pages)
        deferredInstances: s > 0 ? L : void 0,
        createdEntities: {
          pageIds: [g.id],
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
      const { placeholderFrame: c, instanceEntry: r, nodeData: p, parentNode: f } = o, h = figma.root.children.find(
        ($) => $.name === r.componentPageName
      );
      if (!h) {
        const $ = `Deferred instance "${p.name}" still cannot find referenced page "${r.componentPageName}"`;
        await a.error($), i.push($), n++;
        continue;
      }
      const y = ($, w, d, E, S) => {
        if (w.length === 0) {
          let L = null;
          for (const A of $.children || [])
            if (A.type === "COMPONENT") {
              if (A.name === d)
                if (L || (L = A), E)
                  try {
                    const I = A.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (I && JSON.parse(I).id === E)
                      return A;
                  } catch (I) {
                  }
                else
                  return A;
            } else if (A.type === "COMPONENT_SET") {
              if (S && A.name !== S)
                continue;
              for (const I of A.children || [])
                if (I.type === "COMPONENT" && I.name === d)
                  if (L || (L = I), E)
                    try {
                      const N = I.getPluginData(
                        "RecursicaPublishedMetadata"
                      );
                      if (N && JSON.parse(N).id === E)
                        return I;
                    } catch (N) {
                    }
                  else
                    return I;
            }
          return L;
        }
        const [B, ...R] = w;
        for (const L of $.children || [])
          if (L.name === B) {
            if (R.length === 0 && L.type === "COMPONENT_SET") {
              if (S && L.name !== S)
                continue;
              for (const A of L.children || [])
                if (A.type === "COMPONENT" && A.name === d) {
                  if (E)
                    try {
                      const I = A.getPluginData(
                        "RecursicaPublishedMetadata"
                      );
                      if (I && JSON.parse(I).id === E)
                        return A;
                    } catch (I) {
                    }
                  return A;
                }
              return null;
            }
            return y(
              L,
              R,
              d,
              E,
              S
            );
          }
        return null;
      }, C = y(
        h,
        r.path || [],
        r.componentName,
        r.componentGuid,
        r.componentSetName
      );
      if (!C) {
        const $ = r.path && r.path.length > 0 ? ` at path [${r.path.join(" → ")}]` : " at page root", w = `Deferred instance "${p.name}" still cannot find component "${r.componentName}" on page "${r.componentPageName}"${$}`;
        await a.error(w), i.push(w), n++;
        continue;
      }
      const l = C.createInstance();
      if (l.name = p.name || c.name.replace("[Deferred: ", "").replace("]", ""), l.x = c.x, l.y = c.y, c.width !== void 0 && c.height !== void 0 && l.resize(c.width, c.height), r.variantProperties && Object.keys(r.variantProperties).length > 0)
        try {
          const $ = await l.getMainComponentAsync();
          if ($) {
            let w = null;
            const d = $.type;
            if (d === "COMPONENT_SET" ? w = $.componentPropertyDefinitions : d === "COMPONENT" && $.parent && $.parent.type === "COMPONENT_SET" ? w = $.parent.componentPropertyDefinitions : await a.warning(
              `Cannot set variant properties for resolved instance "${p.name}" - main component is not a COMPONENT_SET or variant`
            ), w) {
              const E = {};
              for (const [S, B] of Object.entries(
                r.variantProperties
              )) {
                const R = S.split("#")[0];
                w[R] && (E[R] = B);
              }
              Object.keys(E).length > 0 && l.setProperties(E);
            }
          }
        } catch ($) {
          await a.warning(
            `Failed to set variant properties for resolved instance "${p.name}": ${$}`
          );
        }
      if (r.componentProperties && Object.keys(r.componentProperties).length > 0)
        try {
          const $ = await l.getMainComponentAsync();
          if ($) {
            let w = null;
            const d = $.type;
            if (d === "COMPONENT_SET" ? w = $.componentPropertyDefinitions : d === "COMPONENT" && $.parent && $.parent.type === "COMPONENT_SET" ? w = $.parent.componentPropertyDefinitions : d === "COMPONENT" && (w = $.componentPropertyDefinitions), w)
              for (const [E, S] of Object.entries(
                r.componentProperties
              )) {
                const B = E.split("#")[0];
                if (w[B])
                  try {
                    l.setProperties({
                      [B]: S
                    });
                  } catch (R) {
                    await a.warning(
                      `Failed to set component property "${B}" for resolved instance "${p.name}": ${R}`
                    );
                  }
              }
          }
        } catch ($) {
          await a.warning(
            `Failed to set component properties for resolved instance "${p.name}": ${$}`
          );
        }
      const v = f.children.indexOf(c);
      f.insertChild(v, l), c.remove(), await a.log(
        `  ✓ Resolved deferred instance "${p.name}" from component "${r.componentName}" on page "${r.componentPageName}"`
      ), t++;
    } catch (c) {
      const r = c instanceof Error ? c.message : String(c), p = `Failed to resolve deferred instance "${o.nodeData.name}": ${r}`;
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
    let c = 0;
    for (const p of n)
      try {
        const f = await figma.variables.getVariableCollectionByIdAsync(p);
        f && (f.remove(), c++);
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
      `Cleanup complete: Deleted ${r} page(s), ${c} collection(s), ${o} variable(s)`
    ), {
      type: "cleanupCreatedEntities",
      success: !0,
      error: !1,
      message: "Cleanup completed successfully",
      data: {
        deletedPages: r,
        deletedCollections: c,
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
      const c = o.expandedJsonData, r = c.metadata;
      if (!r || !r.name || !r.guid) {
        await a.warning(
          `Skipping ${n} - missing or invalid metadata`
        );
        continue;
      }
      const p = [];
      if (c.instances) {
        const h = Ee.fromTable(
          c.instances
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
function gt(e) {
  const t = [], n = [], i = [], o = /* @__PURE__ */ new Map();
  for (const h of e)
    o.set(h.pageName, h);
  const c = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), p = [], f = (h) => {
    if (c.has(h.pageName))
      return !1;
    if (r.has(h.pageName)) {
      const y = p.findIndex(
        (C) => C.pageName === h.pageName
      );
      if (y !== -1) {
        const C = p.slice(y).concat([h]);
        return n.push(C), !0;
      }
      return !1;
    }
    r.add(h.pageName), p.push(h);
    for (const y of h.dependencies) {
      const C = o.get(y);
      C && f(C);
    }
    return r.delete(h.pageName), p.pop(), c.add(h.pageName), t.push(h), !1;
  };
  for (const h of e)
    c.has(h.pageName) || f(h);
  for (const h of e)
    for (const y of h.dependencies)
      o.has(y) || i.push(
        `Page "${h.pageName}" (${h.fileName}) depends on "${y}" which is not in the import set`
      );
  return { order: t, cycles: n, errors: i };
}
async function pt(e) {
  await a.log("=== Building Dependency Graph ===");
  const t = await dt(e);
  await a.log("=== Resolving Import Order ===");
  const n = gt(t);
  if (n.cycles.length > 0) {
    await a.log(
      `Detected ${n.cycles.length} circular dependency cycle(s):`
    );
    for (const i of n.cycles) {
      const o = i.map((c) => `"${c.pageName}"`).join(" → ");
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
  var S, B, R, L, A, I;
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
  } = await pt(t);
  o.length > 0 && await a.warning(
    `Found ${o.length} dependency warning(s) - some dependencies may be missing`
  ), i.length > 0 && await a.log(
    `Detected ${i.length} circular dependency cycle(s) - will use deferred resolution`
  );
  const c = /* @__PURE__ */ new Map();
  if (await a.log(
    `Checking collectionChoices: ${e.collectionChoices ? "exists" : "undefined"}`
  ), e.collectionChoices) {
    await a.log("=== Pre-creating Collections ==="), await a.log(
      `Collection choices: tokens=${e.collectionChoices.tokens}, theme=${e.collectionChoices.theme}, layers=${e.collectionChoices.layers}`
    );
    const N = "recursica:collectionId", V = async (k) => {
      const g = await figma.variables.getLocalVariableCollectionsAsync(), u = new Set(g.map((b) => b.name));
      if (!u.has(k))
        return k;
      let s = 1, m = `${k}_${s}`;
      for (; u.has(m); )
        s++, m = `${k}_${s}`;
      return m;
    }, M = [
      { choice: e.collectionChoices.tokens, normalizedName: "Tokens" },
      { choice: e.collectionChoices.theme, normalizedName: "Theme" },
      { choice: e.collectionChoices.layers, normalizedName: "Layer" }
    ];
    for (const { choice: k, normalizedName: g } of M)
      if (k === "new") {
        await a.log(
          `Processing collection type: "${g}" (choice: "new") - will create new collection`
        );
        const u = await V(g), s = figma.variables.createVariableCollection(u);
        if (le(g)) {
          const m = Oe(g);
          m && (s.setSharedPluginData(
            "recursica",
            N,
            m
          ), await a.log(
            `  Stored fixed GUID: ${m.substring(0, 8)}...`
          ));
        }
        c.set(g, s), await a.log(
          `✓ Pre-created collection: "${u}" (normalized: "${g}", id: ${s.id.substring(0, 8)}...)`
        );
      } else
        await a.log(
          `Skipping collection type: "${g}" (choice: "existing")`
        );
    c.size > 0 && await a.log(
      `Pre-created ${c.size} collection(s) for reuse across all imports`
    );
  }
  await a.log("=== Importing Pages in Order ===");
  let r = 0, p = 0;
  const f = [...o], h = [], y = {
    pageIds: [],
    collectionIds: [],
    variableIds: []
  }, C = [];
  if (c.size > 0)
    for (const N of c.values())
      y.collectionIds.push(N.id), await a.log(
        `Tracking pre-created collection: "${N.name}" (${N.id.substring(0, 8)}...)`
      );
  const l = e.mainFileName;
  for (let N = 0; N < n.length; N++) {
    const V = n[N], M = l ? V.fileName === l : N === n.length - 1;
    await a.log(
      `[${N + 1}/${n.length}] Importing ${V.fileName} ("${V.pageName}")${M ? " [MAIN]" : " [DEPENDENCY]"}...`
    );
    try {
      const k = N === 0, g = await ct({
        jsonData: V.jsonData,
        isMainPage: M,
        clearConsole: k,
        collectionChoices: e.collectionChoices,
        alwaysCreateCopy: !0,
        // Wizard imports always create copies (no prompts)
        skipUniqueNaming: (S = e.skipUniqueNaming) != null ? S : !1,
        constructionIcon: e.constructionIcon || "",
        preCreatedCollections: c
        // Pass pre-created collections for reuse
      });
      if (g.success) {
        if (r++, (B = g.data) != null && B.deferredInstances) {
          const u = g.data.deferredInstances;
          Array.isArray(u) && h.push(...u);
        }
        if ((R = g.data) != null && R.createdEntities) {
          const u = g.data.createdEntities;
          u.pageIds && y.pageIds.push(...u.pageIds), u.collectionIds && y.collectionIds.push(...u.collectionIds), u.variableIds && y.variableIds.push(...u.variableIds);
          const s = ((L = u.pageIds) == null ? void 0 : L[0]) || ((A = g.data) == null ? void 0 : A.pageId);
          (I = g.data) != null && I.pageName && s && C.push({
            name: g.data.pageName,
            pageId: s
          });
        }
      } else
        p++, f.push(
          `Failed to import ${V.fileName}: ${g.message || "Unknown error"}`
        );
    } catch (k) {
      p++;
      const g = k instanceof Error ? k.message : String(k);
      f.push(`Failed to import ${V.fileName}: ${g}`);
    }
  }
  if (h.length > 0) {
    await a.log(
      `=== Resolving ${h.length} Deferred Instance(s) ===`
    );
    try {
      const N = await lt(h);
      await a.log(
        `  Resolved: ${N.resolved}, Failed: ${N.failed}`
      ), N.errors.length > 0 && f.push(...N.errors);
    } catch (N) {
      f.push(
        `Failed to resolve deferred instances: ${N instanceof Error ? N.message : String(N)}`
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
    for (const N of v)
      try {
        const V = await figma.variables.getVariableCollectionByIdAsync(N);
        V && await a.log(
          `    - "${V.name}" (${N.substring(0, 8)}...)`
        );
      } catch (V) {
      }
  }
  const d = p === 0, E = d ? `Successfully imported ${r} page(s)${h.length > 0 ? ` (${h.length} deferred instance(s) resolved)` : ""}` : `Import completed with ${p} failure(s). ${f.join("; ")}`;
  return {
    type: "importPagesInOrder",
    success: d,
    error: !d,
    message: E,
    data: {
      imported: r,
      failed: p,
      deferred: h.length,
      errors: f,
      importedPages: C,
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
    const o = await xe(
      i,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + i.name + " (index: " + n + ")"
    );
    const c = JSON.stringify(o, null, 2), r = JSON.parse(c), p = "Copy - " + r.name, f = figma.createPage();
    if (f.name = p, figma.root.appendChild(f), r.children && r.children.length > 0) {
      let C = function(v) {
        v.forEach(($) => {
          const w = ($.x || 0) + ($.width || 0);
          w > l && (l = w), $.children && $.children.length > 0 && C($.children);
        });
      };
      console.log(
        "Recreating " + r.children.length + " top-level children..."
      );
      let l = 0;
      C(r.children), console.log("Original content rightmost edge: " + l);
      for (const v of r.children)
        await be(v, f, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const h = Me(r);
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
async function Ca(e) {
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
async function Aa(e) {
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
function Z(e, t = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: t
  };
}
function se(e, t, n = {}) {
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
          name: Te(t.name),
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
    return console.error("Error getting component metadata:", t), se(
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
      const c = o, r = c.getPluginData(mt);
      if (r)
        try {
          const p = JSON.parse(r);
          n.push(p);
        } catch (p) {
          console.warn(
            `Failed to parse metadata for page "${c.name}":`,
            p
          );
          const h = {
            _ver: 1,
            id: "",
            name: Te(c.name),
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
          name: Te(c.name),
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
    return console.error("Error getting all components:", t), se(
      "getAllComponents",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function Va(e) {
  try {
    const t = e.requestId, n = e.action;
    return !t || !n ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (ye.handleResponse({ requestId: t, action: n }), {
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
async function Ma(e) {
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
const ee = "RecursicaPrimaryImport", q = "RecursicaUnderReview", ut = "---", ht = "---", ne = "RecursicaImportDivider", me = "start", ue = "end", ce = "⚠️";
async function xa(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children;
    for (const i of t) {
      if (i.type !== "PAGE")
        continue;
      const o = i.getPluginData(ee);
      if (o)
        try {
          const r = JSON.parse(o), p = {
            exists: !0,
            pageId: i.id,
            metadata: r
          };
          return Z(
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
        const r = i.getPluginData(ee);
        if (r)
          try {
            const p = JSON.parse(r), f = {
              exists: !0,
              pageId: i.id,
              metadata: p
            };
            return Z(
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
    return Z("checkForExistingPrimaryImport", {
      exists: !1
    });
  } catch (t) {
    return console.error("Error checking for existing primary import:", t), se(
      "checkForExistingPrimaryImport",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function Ra(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children.find(
      (p) => p.type === "PAGE" && p.getPluginData(ne) === me
    ), n = figma.root.children.find(
      (p) => p.type === "PAGE" && p.getPluginData(ne) === ue
    );
    if (t && n) {
      const p = {
        startDividerId: t.id,
        endDividerId: n.id
      };
      return Z("createImportDividers", p);
    }
    const i = figma.createPage();
    i.name = ut, i.setPluginData(ne, me), i.setPluginData(q, "true");
    const o = figma.createPage();
    o.name = ht, o.setPluginData(ne, ue), o.setPluginData(q, "true");
    const c = figma.root.children.indexOf(i);
    figma.root.insertChild(c + 1, o), await a.log("Created import dividers");
    const r = {
      startDividerId: i.id,
      endDividerId: o.id
    };
    return Z("createImportDividers", r);
  } catch (t) {
    return console.error("Error creating import dividers:", t), se(
      "createImportDividers",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function ka(e) {
  var t, n, i, o, c, r, p, f;
  try {
    await a.log("=== Starting Single Component Import ==="), await a.log("Creating start divider..."), await figma.loadAllPagesAsync();
    let h = figma.root.children.find(
      (u) => u.type === "PAGE" && u.getPluginData(ne) === me
    );
    h || (h = figma.createPage(), h.name = ut, h.setPluginData(ne, me), h.setPluginData(q, "true"), await a.log("Created start divider"));
    const C = [
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
      `Importing ${C.length} file(s) in dependency order...`
    );
    const l = await ft({
      jsonFiles: C,
      mainFileName: `${e.mainComponent.name}.json`,
      collectionChoices: {
        tokens: e.wizardSelections.tokensCollection,
        theme: e.wizardSelections.themeCollection,
        layers: e.wizardSelections.layersCollection
      },
      skipUniqueNaming: !0,
      // Don't add _<number> suffix for wizard imports
      constructionIcon: ce
      // Add construction icon to page names
    });
    if (!l.success)
      throw new Error(
        l.message || "Failed to import pages in order"
      );
    await figma.loadAllPagesAsync();
    const v = figma.root.children;
    let $ = v.find(
      (u) => u.type === "PAGE" && u.getPluginData(ne) === ue
    );
    if (!$) {
      $ = figma.createPage(), $.name = ht, $.setPluginData(
        ne,
        ue
      ), $.setPluginData(q, "true");
      let u = v.length;
      for (let s = v.length - 1; s >= 0; s--) {
        const m = v[s];
        if (m.type === "PAGE" && m.getPluginData(ne) !== me && m.getPluginData(ne) !== ue) {
          u = s + 1;
          break;
        }
      }
      figma.root.insertChild(u, $), await a.log("Created end divider");
    }
    await a.log(
      `Import result data structure: ${JSON.stringify(Object.keys(l.data || {}))}`
    );
    const w = l.data;
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
    const d = (o = w.importedPages.find(
      (u) => u.name === e.mainComponent.name || u.name === `${ce} ${e.mainComponent.name}`
    )) == null ? void 0 : o.pageId;
    if (!d)
      throw new Error("Failed to find imported main page ID");
    const E = await figma.getNodeByIdAsync(
      d
    );
    if (!E || E.type !== "PAGE")
      throw new Error("Failed to get main page node");
    for (const u of w.importedPages)
      try {
        const s = await figma.getNodeByIdAsync(
          u.pageId
        );
        if (s && s.type === "PAGE") {
          s.setPluginData(q, "true");
          const m = s.name.replace(/_\d+$/, "");
          if (!m.startsWith(ce))
            s.name = `${ce} ${m}`;
          else {
            const b = m.replace(ce, "").trim();
            s.name = `${ce} ${b}`;
          }
        }
      } catch (s) {
        await a.warning(
          `Failed to mark page ${u.pageId} as under review: ${s}`
        );
      }
    await figma.loadAllPagesAsync();
    const S = figma.root.children, B = S.find(
      (u) => u.type === "PAGE" && (u.name === "REMOTES" || u.name === `${ce} REMOTES`)
    );
    B && (B.setPluginData(q, "true"), B.name.startsWith(ce) || (B.name = `${ce} REMOTES`), await a.log(
      "Marked REMOTES page as under review and ensured construction icon"
    ));
    const R = S.find(
      (u) => u.type === "PAGE" && u.getPluginData(ne) === me
    ), L = S.find(
      (u) => u.type === "PAGE" && u.getPluginData(ne) === ue
    );
    if (R && L) {
      const u = S.indexOf(R), s = S.indexOf(L);
      for (let m = u + 1; m < s; m++) {
        const b = S[m];
        b.type === "PAGE" && b.getPluginData(q) !== "true" && (b.setPluginData(q, "true"), await a.log(
          `Marked page "${b.name}" as under review (found between dividers)`
        ));
      }
    }
    const A = [], I = [];
    if (await a.log(
      `[EXTRACTION] Starting collection extraction. Collection IDs in result: ${((r = (c = w == null ? void 0 : w.createdEntities) == null ? void 0 : c.collectionIds) == null ? void 0 : r.length) || 0}`
    ), (p = w == null ? void 0 : w.createdEntities) != null && p.collectionIds) {
      await a.log(
        `[EXTRACTION] Collection IDs to process: ${w.createdEntities.collectionIds.map((u) => u.substring(0, 8) + "...").join(", ")}`
      );
      for (const u of w.createdEntities.collectionIds)
        try {
          const s = await figma.variables.getVariableCollectionByIdAsync(u);
          s ? (A.push({
            collectionId: s.id,
            collectionName: s.name
          }), await a.log(
            `[EXTRACTION] ✓ Extracted collection: "${s.name}" (${u.substring(0, 8)}...)`
          )) : await a.warning(
            `[EXTRACTION] Collection ${u.substring(0, 8)}... not found`
          );
        } catch (s) {
          await a.warning(
            `[EXTRACTION] Failed to get collection ${u.substring(0, 8)}...: ${s}`
          );
        }
    } else
      await a.warning(
        "[EXTRACTION] No collectionIds found in importResultData.createdEntities"
      );
    await a.log(
      `[EXTRACTION] Total collections extracted: ${A.length}`
    ), A.length > 0 && await a.log(
      `[EXTRACTION] Extracted collections: ${A.map((u) => `"${u.collectionName}" (${u.collectionId.substring(0, 8)}...)`).join(", ")}`
    );
    const N = new Set(
      A.map((u) => u.collectionId)
    );
    if ((f = w == null ? void 0 : w.createdEntities) != null && f.variableIds)
      for (const u of w.createdEntities.variableIds)
        try {
          const s = await figma.variables.getVariableByIdAsync(u);
          if (s && s.resolvedType && !N.has(s.variableCollectionId)) {
            const m = await figma.variables.getVariableCollectionByIdAsync(
              s.variableCollectionId
            );
            m && I.push({
              variableId: s.id,
              variableName: s.name,
              collectionId: s.variableCollectionId,
              collectionName: m.name
            });
          }
        } catch (s) {
          await a.warning(
            `Failed to get variable ${u}: ${s}`
          );
        }
    const V = {
      componentGuid: e.mainComponent.guid,
      componentVersion: e.mainComponent.version,
      componentName: e.mainComponent.name,
      importDate: (/* @__PURE__ */ new Date()).toISOString(),
      wizardSelections: e.wizardSelections,
      variableSummary: e.variableSummary,
      createdCollections: A,
      createdVariables: I,
      importError: void 0
      // No error yet
    };
    await a.log(
      `Storing metadata with ${A.length} collection(s) and ${I.length} variable(s)`
    ), E.setPluginData(
      ee,
      JSON.stringify(V)
    ), E.setPluginData(q, "true"), await a.log(
      "Stored primary import metadata on main page and marked as under review"
    );
    const M = [];
    w.importedPages && M.push(
      ...w.importedPages.map((u) => u.pageId)
    ), await a.log("=== Single Component Import Complete ==="), V.importError = void 0, await a.log(
      `[METADATA] About to store metadata with ${A.length} collection(s) and ${I.length} variable(s)`
    ), A.length > 0 && await a.log(
      `[METADATA] Collections to store: ${A.map((u) => `"${u.collectionName}" (${u.collectionId.substring(0, 8)}...)`).join(", ")}`
    ), E.setPluginData(
      ee,
      JSON.stringify(V)
    ), await a.log(
      `[METADATA] Stored metadata: ${A.length} collection(s), ${I.length} variable(s)`
    );
    const k = E.getPluginData(ee);
    if (k)
      try {
        const u = JSON.parse(k);
        await a.log(
          `[METADATA] Verification: Stored metadata has ${u.createdCollections.length} collection(s) and ${u.createdVariables.length} variable(s)`
        );
      } catch (u) {
        await a.warning(
          "[METADATA] Failed to verify stored metadata"
        );
      }
    const g = {
      success: !0,
      mainPageId: E.id,
      importedPageIds: M,
      createdCollections: A,
      createdVariables: I
    };
    return Z("importSingleComponentWithWizard", g);
  } catch (h) {
    const y = h instanceof Error ? h.message : "Unknown error occurred";
    await a.error(`Import failed: ${y}`);
    try {
      await figma.loadAllPagesAsync();
      const C = figma.root.children;
      let l = null;
      for (const v of C) {
        if (v.type !== "PAGE") continue;
        const $ = v.getPluginData(ee);
        if ($)
          try {
            if (JSON.parse($).componentGuid === e.mainComponent.guid) {
              l = v;
              break;
            }
          } catch (w) {
          }
      }
      if (l) {
        const v = l.getPluginData(ee);
        if (v)
          try {
            const $ = JSON.parse(v);
            await a.log(
              `[CATCH] Found existing metadata with ${$.createdCollections.length} collection(s) and ${$.createdVariables.length} variable(s)`
            ), $.importError = y, l.setPluginData(
              ee,
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
        for (const d of C) {
          if (d.type !== "PAGE") continue;
          d.getPluginData(q) === "true" && v.push(d);
        }
        const $ = [];
        if (e.wizardSelections) {
          const d = await figma.variables.getLocalVariableCollectionsAsync(), E = [
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
          for (const { choice: S, normalizedName: B } of E)
            if (S === "new") {
              const R = d.filter((L) => te(L.name) === B);
              if (R.length > 0) {
                const L = R[0];
                $.push({
                  collectionId: L.id,
                  collectionName: L.name
                }), await a.log(
                  `Found created collection: "${L.name}" (${L.id.substring(0, 8)}...)`
                );
              }
            }
        }
        const w = [];
        if (v.length > 0) {
          const d = v[0], E = {
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
          d.setPluginData(
            ee,
            JSON.stringify(E)
          ), await a.log(
            `Created fallback metadata with ${$.length} collection(s) and error information`
          );
        }
      }
    } catch (C) {
      await a.warning(
        `Failed to store error metadata: ${C instanceof Error ? C.message : String(C)}`
      );
    }
    return se(
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
    const n = t.getPluginData(ee);
    if (!n)
      throw new Error("Primary import metadata not found on page");
    const i = JSON.parse(n);
    await a.log(
      `Found metadata: ${i.createdCollections.length} collection(s), ${i.createdVariables.length} variable(s) to delete`
    ), await figma.loadAllPagesAsync();
    const o = figma.root.children, c = [];
    for (const l of o) {
      if (l.type !== "PAGE")
        continue;
      l.getPluginData(q) === "true" && (c.push(l), await a.log(
        `Found page to delete: "${l.name}" (under review)`
      ));
    }
    await a.log(
      `Deleting ${i.createdVariables.length} variable(s) from existing collections...`
    );
    let r = 0;
    for (const l of i.createdVariables)
      try {
        const v = await figma.variables.getVariableByIdAsync(
          l.variableId
        );
        v ? (v.remove(), r++, await a.log(
          `Deleted variable: ${l.variableName} from collection ${l.collectionName}`
        )) : await a.warning(
          `Variable ${l.variableName} (${l.variableId}) not found - may have already been deleted`
        );
      } catch (v) {
        await a.warning(
          `Failed to delete variable ${l.variableName}: ${v instanceof Error ? v.message : String(v)}`
        );
      }
    await a.log(
      `Deleting ${i.createdCollections.length} collection(s)...`
    );
    let p = 0;
    for (const l of i.createdCollections)
      try {
        const v = await figma.variables.getVariableCollectionByIdAsync(
          l.collectionId
        );
        v ? (v.remove(), p++, await a.log(
          `Deleted collection: ${l.collectionName} (${l.collectionId})`
        )) : await a.warning(
          `Collection ${l.collectionName} (${l.collectionId}) not found - may have already been deleted`
        );
      } catch (v) {
        await a.warning(
          `Failed to delete collection ${l.collectionName}: ${v instanceof Error ? v.message : String(v)}`
        );
      }
    const f = c.map((l) => ({
      page: l,
      name: l.name,
      id: l.id
    })), h = figma.currentPage;
    if (f.some(
      (l) => l.id === h.id
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
    for (const { page: l, name: v } of f)
      try {
        let $ = !1;
        try {
          await figma.loadAllPagesAsync(), $ = figma.root.children.some((d) => d.id === l.id);
        } catch (w) {
          $ = !1;
        }
        if (!$) {
          await a.log(`Page "${v}" already deleted, skipping`);
          continue;
        }
        if (figma.currentPage.id === l.id) {
          await figma.loadAllPagesAsync();
          const d = figma.root.children.find(
            (E) => E.type === "PAGE" && E.id !== l.id && !f.some((S) => S.id === E.id)
          );
          d && await figma.setCurrentPageAsync(d);
        }
        l.remove(), await a.log(`Deleted page: "${v}"`);
      } catch ($) {
        await a.warning(
          `Failed to delete page "${v}": ${$ instanceof Error ? $.message : String($)}`
        );
      }
    await a.log("=== Import Group Deletion Complete ===");
    const C = {
      success: !0,
      deletedPages: c.length,
      deletedCollections: p,
      deletedVariables: r
    };
    return Z("deleteImportGroup", C);
  } catch (t) {
    const n = t instanceof Error ? t.message : "Unknown error occurred";
    return await a.error(`Delete failed: ${n}`), se(
      "deleteImportGroup",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
async function Ga(e) {
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
        (y) => y.type === "PAGE" && !i.some((C) => C.id === y.id)
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
          const C = figma.root.children.find(
            (l) => l.type === "PAGE" && l.id !== h.id && !i.some((v) => v.id === l.id)
          );
          C && await figma.setCurrentPageAsync(C);
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
    return await a.error(`Cleanup failed: ${n}`), se(
      "cleanupFailedImport",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
async function _a(e) {
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
          } catch (p) {
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
    return await a.error(`Clear metadata failed: ${n}`), se(
      "clearImportMetadata",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
async function La(e) {
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
        const d = w.expandedJsonData;
        if (!d.collections)
          continue;
        const S = Ne.fromTable(
          d.collections
        );
        if (!d.variables)
          continue;
        const R = ve.fromTable(d.variables).getTable();
        for (const L of Object.values(R)) {
          if (L._colRef === void 0)
            continue;
          const A = S.getCollectionByIndex(
            L._colRef
          );
          if (A) {
            const N = te(
              A.collectionName
            ).toLowerCase();
            (N === "tokens" || N === "theme" || N === "layer") && t.push({
              name: L.variableName,
              collectionName: N
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
    let i = null, o = null, c = null;
    for (const v of n) {
      const w = te(v.name).toLowerCase();
      (w === "tokens" || w === "token") && !i ? i = v : (w === "theme" || w === "themes") && !o ? o = v : (w === "layer" || w === "layers") && !c && (c = v);
    }
    const r = t.filter(
      (v) => v.collectionName === "tokens"
    ), p = t.filter((v) => v.collectionName === "theme"), f = t.filter((v) => v.collectionName === "layer"), h = {
      existing: 0,
      new: 0
    }, y = {
      existing: 0,
      new: 0
    }, C = {
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
    if (e.layersCollection === "existing" && c) {
      const v = /* @__PURE__ */ new Set();
      for (const $ of c.variableIds)
        try {
          const w = figma.variables.getVariableById($);
          w && v.add(w.name);
        } catch (w) {
          continue;
        }
      for (const $ of f)
        v.has($.name) ? C.existing++ : C.new++;
    } else
      C.new = f.length;
    return await a.log(
      `Variable summary: Tokens - ${h.existing} existing, ${h.new} new; Theme - ${y.existing} existing, ${y.new} new; Layers - ${C.existing} existing, ${C.new} new`
    ), Z("summarizeVariablesForWizard", {
      tokens: h,
      theme: y,
      layers: C
    });
  } catch (t) {
    const n = t instanceof Error ? t.message : "Unknown error occurred";
    return await a.error(`Summarize failed: ${n}`), se(
      "summarizeVariablesForWizard",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
async function Ba(e) {
  try {
    const t = "recursica:collectionId", i = {
      collections: (await figma.variables.getLocalVariableCollectionsAsync()).map((o) => {
        const c = o.getSharedPluginData("recursica", t);
        return {
          id: o.id,
          name: o.name,
          guid: c || void 0
        };
      })
    };
    return Z("getLocalVariableCollections", i);
  } catch (t) {
    return se(
      "getLocalVariableCollections",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
async function Ua(e) {
  try {
    const t = "recursica:collectionId", n = [];
    for (const o of e.collectionIds)
      try {
        const c = await figma.variables.getVariableCollectionByIdAsync(o);
        if (c) {
          const r = c.getSharedPluginData(
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
      } catch (c) {
        await a.warning(
          `Failed to get GUID for collection ${o}: ${c instanceof Error ? c.message : String(c)}`
        ), n.push({
          collectionId: o,
          guid: null
        });
      }
    return Z("getCollectionGuids", {
      collectionGuids: n
    });
  } catch (t) {
    return se(
      "getCollectionGuids",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
async function Fa(e) {
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
    let o = 0, c = 0;
    const r = "recursica:collectionId";
    for (const d of e.collectionChoices)
      if (d.choice === "merge")
        try {
          const E = await figma.variables.getVariableCollectionByIdAsync(
            d.newCollectionId
          );
          if (!E) {
            await a.warning(
              `New collection ${d.newCollectionId} not found, skipping merge`
            );
            continue;
          }
          let S = null;
          if (d.existingCollectionId)
            S = await figma.variables.getVariableCollectionByIdAsync(
              d.existingCollectionId
            );
          else {
            const N = E.getSharedPluginData(
              "recursica",
              r
            );
            if (N) {
              const V = await figma.variables.getLocalVariableCollectionsAsync();
              for (const M of V)
                if (M.getSharedPluginData(
                  "recursica",
                  r
                ) === N && M.id !== d.newCollectionId) {
                  S = M;
                  break;
                }
              if (!S && (N === de.LAYER || N === de.TOKENS || N === de.THEME)) {
                let M;
                N === de.LAYER ? M = re.LAYER : N === de.TOKENS ? M = re.TOKENS : M = re.THEME;
                for (const k of V)
                  if (k.getSharedPluginData(
                    "recursica",
                    r
                  ) === N && k.name === M && k.id !== d.newCollectionId) {
                    S = k;
                    break;
                  }
                S || (S = figma.variables.createVariableCollection(M), S.setSharedPluginData(
                  "recursica",
                  r,
                  N
                ), await a.log(
                  `Created new standard collection: "${M}"`
                ));
              }
            }
          }
          if (!S) {
            await a.warning(
              "Could not find or create existing collection for merge, skipping"
            );
            continue;
          }
          await a.log(
            `Merging collection "${E.name}" (${d.newCollectionId.substring(0, 8)}...) into "${S.name}" (${S.id.substring(0, 8)}...)`
          );
          const B = E.variableIds.map(
            (N) => figma.variables.getVariableByIdAsync(N)
          ), R = await Promise.all(B), L = S.variableIds.map(
            (N) => figma.variables.getVariableByIdAsync(N)
          ), A = await Promise.all(L), I = new Set(
            A.filter((N) => N !== null).map((N) => N.name)
          );
          for (const N of R)
            if (N)
              try {
                if (I.has(N.name)) {
                  await a.warning(
                    `Variable "${N.name}" already exists in collection "${S.name}", skipping`
                  );
                  continue;
                }
                const V = figma.variables.createVariable(
                  N.name,
                  S,
                  N.resolvedType
                );
                for (const M of S.modes) {
                  const k = M.modeId;
                  let g = N.valuesByMode[k];
                  if (g === void 0 && E.modes.length > 0) {
                    const u = E.modes[0].modeId;
                    g = N.valuesByMode[u];
                  }
                  g !== void 0 && V.setValueForMode(k, g);
                }
                await a.log(
                  `  ✓ Copied variable "${N.name}" to collection "${S.name}"`
                );
              } catch (V) {
                await a.warning(
                  `Failed to copy variable "${N.name}": ${V instanceof Error ? V.message : String(V)}`
                );
              }
          E.remove(), o++, await a.log(
            `✓ Merged and deleted collection: ${E.name}`
          );
        } catch (E) {
          await a.warning(
            `Failed to merge collection: ${E instanceof Error ? E.message : String(E)}`
          );
        }
      else
        c++, await a.log(`Kept collection: ${d.newCollectionId}`);
    await a.log("Removing dividers...");
    const p = figma.root.children, f = [];
    for (const d of p) {
      if (d.type !== "PAGE") continue;
      const E = d.getPluginData(ne);
      (E === "start" || E === "end") && f.push(d);
    }
    const h = figma.currentPage;
    if (f.some((d) => d.id === h.id))
      if (t && t.id !== h.id)
        figma.currentPage = t;
      else {
        const d = p.find(
          (E) => E.type === "PAGE" && !f.some((S) => S.id === E.id)
        );
        d && (figma.currentPage = d);
      }
    const y = f.map((d) => d.name);
    for (const d of f)
      try {
        d.remove();
      } catch (E) {
        await a.warning(
          `Failed to delete divider: ${E instanceof Error ? E.message : String(E)}`
        );
      }
    for (const d of y)
      await a.log(`Deleted divider: ${d}`);
    await a.log("Removing construction icons and renaming pages..."), await figma.loadAllPagesAsync();
    const C = figma.root.children;
    let l = 0;
    const v = "RecursicaPublishedMetadata", $ = [];
    for (const d of C)
      if (d.type === "PAGE")
        try {
          if (d.getPluginData(q) === "true") {
            const S = d.getPluginData(v);
            let B = {};
            if (S)
              try {
                B = JSON.parse(S);
              } catch (R) {
              }
            $.push({
              pageId: d.id,
              pageName: d.name,
              pageMetadata: B
            });
          }
        } catch (E) {
          await a.warning(
            `Failed to process page: ${E instanceof Error ? E.message : String(E)}`
          );
        }
    for (const d of $)
      try {
        const E = await figma.getNodeByIdAsync(
          d.pageId
        );
        if (!E || E.type !== "PAGE") {
          await a.warning(
            `Page ${d.pageId} not found, skipping rename`
          );
          continue;
        }
        let S = E.name;
        if (S.startsWith(ce) && (S = S.substring(ce.length).trim()), S === "REMOTES" || S.includes("REMOTES")) {
          E.name = "REMOTES", l++, await a.log(`Renamed page: "${E.name}" -> "REMOTES"`);
          continue;
        }
        const R = d.pageMetadata.name && d.pageMetadata.name.length > 0 && !d.pageMetadata.name.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        ) ? d.pageMetadata.name : i.componentName || S, L = d.pageMetadata.version !== void 0 ? d.pageMetadata.version : i.componentVersion, A = `${R} (VERSION: ${L})`;
        E.name = A, l++, await a.log(`Renamed page: "${S}" -> "${A}"`);
      } catch (E) {
        await a.warning(
          `Failed to rename page ${d.pageId}: ${E instanceof Error ? E.message : String(E)}`
        );
      }
    if (await a.log("Clearing import metadata..."), t)
      try {
        t.setPluginData(ee, "");
      } catch (d) {
        await a.warning(
          `Failed to clear primary import metadata: ${d instanceof Error ? d.message : String(d)}`
        );
      }
    for (const d of $)
      try {
        const E = await figma.getNodeByIdAsync(
          d.pageId
        );
        E && E.type === "PAGE" && E.setPluginData(q, "");
      } catch (E) {
        await a.warning(
          `Failed to clear under review metadata for page ${d.pageId}: ${E instanceof Error ? E.message : String(E)}`
        );
      }
    const w = {
      mergedCollections: o,
      keptCollections: c,
      pagesRenamed: l
    };
    return await a.log(
      `=== Merge Complete ===
  Merged: ${o} collection(s)
  Kept: ${c} collection(s)
  Renamed: ${l} page(s)`
    ), Z("mergeImportGroup", w);
  } catch (t) {
    return await a.error(
      `Merge failed: ${t instanceof Error ? t.message : String(t)}`
    ), se(
      "mergeImportGroup",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
const za = {
  getCurrentUser: Pt,
  loadPages: Ct,
  exportPage: je,
  importPage: ct,
  cleanupCreatedEntities: Ea,
  resolveDeferredNormalInstances: lt,
  determineImportOrder: pt,
  buildDependencyGraph: dt,
  resolveImportOrder: gt,
  importPagesInOrder: ft,
  quickCopy: Pa,
  storeAuthData: Ca,
  loadAuthData: Aa,
  clearAuthData: Ia,
  storeSelectedRepo: Sa,
  getComponentMetadata: Ta,
  getAllComponents: Oa,
  pluginPromptResponse: Va,
  switchToPage: Ma,
  checkForExistingPrimaryImport: xa,
  createImportDividers: Ra,
  importSingleComponentWithWizard: ka,
  deleteImportGroup: yt,
  clearImportMetadata: _a,
  cleanupFailedImport: Ga,
  summarizeVariablesForWizard: La,
  getLocalVariableCollections: Ba,
  getCollectionGuids: Ua,
  mergeImportGroup: Fa
}, ja = za;
figma.showUI(__html__, {
  width: 500,
  height: 500
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    Rt(e);
    return;
  }
  const t = e;
  try {
    const n = t.type, i = ja[n];
    if (!i) {
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
    const o = await i(t.data);
    figma.ui.postMessage(Q(j({}, o), {
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
