var lt = Object.defineProperty, dt = Object.defineProperties;
var pt = Object.getOwnPropertyDescriptors;
var Ue = Object.getOwnPropertySymbols;
var ut = Object.prototype.hasOwnProperty, ft = Object.prototype.propertyIsEnumerable;
var Ce = (e, t, n) => t in e ? lt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, z = (e, t) => {
  for (var n in t || (t = {}))
    ut.call(t, n) && Ce(e, n, t[n]);
  if (Ue)
    for (var n of Ue(t))
      ft.call(t, n) && Ce(e, n, t[n]);
  return e;
}, Z = (e, t) => dt(e, pt(t));
var Q = (e, t, n) => Ce(e, typeof t != "symbol" ? t + "" : t, n);
async function mt(e) {
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
async function gt(e) {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "loadPages",
      success: !0,
      error: !1,
      message: "Pages loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        pages: figma.root.children.map((r, c) => ({
          name: r.name,
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
}, Y = Z(z({}, X), {
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
}), D = Z(z({}, X), {
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
}), re = Z(z({}, X), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), Je = Z(z({}, X), {
  cornerRadius: 0
}), ht = Z(z({}, X), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function yt(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return Y;
    case "TEXT":
      return D;
    case "VECTOR":
      return re;
    case "LINE":
      return ht;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return Je;
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
        (r) => !(r in t) || F(e[r], t[r])
      );
    }
    return !0;
  }
  return e !== t;
}
const Pe = {
  LAYER: "00000000-0000-0000-0000-000000000001",
  TOKENS: "00000000-0000-0000-0000-000000000002",
  THEME: "00000000-0000-0000-0000-000000000003"
}, te = {
  LAYER: "Layer",
  TOKENS: "Tokens",
  THEME: "Theme"
};
function ae(e) {
  const t = e.trim(), n = t.toLowerCase();
  return n === "themes" ? te.THEME : n === "token" ? te.TOKENS : n === "layer" ? te.LAYER : n === "tokens" ? te.TOKENS : n === "theme" ? te.THEME : t;
}
function ie(e) {
  const t = ae(e);
  return t === te.LAYER || t === te.TOKENS || t === te.THEME;
}
function xe(e) {
  const t = ae(e);
  if (t === te.LAYER)
    return Pe.LAYER;
  if (t === te.TOKENS)
    return Pe.TOKENS;
  if (t === te.THEME)
    return Pe.THEME;
}
class we {
  constructor() {
    Q(this, "collectionMap");
    // collectionId -> index
    Q(this, "collections");
    // index -> collection data
    Q(this, "normalizedNameMap");
    // normalized name -> index (for standard collections)
    Q(this, "nextIndex");
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
    for (const r of n)
      i.add(r);
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
    if (ie(t.collectionName)) {
      const o = this.findCollectionByNormalizedName(i);
      if (o !== void 0) {
        const u = this.collections[o];
        return u.modes = this.mergeModes(
          u.modes,
          t.modes
        ), this.collectionMap.set(n, o), o;
      }
    }
    const r = this.nextIndex++;
    this.collectionMap.set(n, r);
    const c = Z(z({}, t), {
      collectionName: i
    });
    if (ie(t.collectionName)) {
      const o = xe(
        t.collectionName
      );
      o && (c.collectionGuid = o), this.normalizedNameMap.set(i, r);
    }
    return this.collections[r] = c, r;
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
      const i = this.collections[n], r = z({
        collectionName: i.collectionName,
        modes: i.modes
      }, i.collectionGuid && { collectionGuid: i.collectionGuid });
      t[String(n)] = r;
    }
    return t;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   * Handles both new format (without collectionId/isLocal) and legacy format (with collectionId/isLocal)
   */
  static fromTable(t) {
    var r;
    const n = new we(), i = Object.entries(t).sort(
      (c, o) => parseInt(c[0], 10) - parseInt(o[0], 10)
    );
    for (const [c, o] of i) {
      const u = parseInt(c, 10), f = (r = o.isLocal) != null ? r : !0, h = ae(
        o.collectionName || ""
      ), w = o.collectionId || o.collectionGuid || `temp:${u}:${h}`, E = z({
        collectionName: h,
        collectionId: w,
        isLocal: f,
        modes: o.modes || []
      }, o.collectionGuid && {
        collectionGuid: o.collectionGuid
      });
      n.collectionMap.set(w, u), n.collections[u] = E, ie(h) && n.normalizedNameMap.set(h, u), n.nextIndex = Math.max(
        n.nextIndex,
        u + 1
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
const bt = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, wt = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function Nt(e) {
  var n;
  const t = e.toUpperCase();
  return (n = bt[t]) != null ? n : e;
}
function $t(e) {
  var t;
  return typeof e == "number" ? (t = wt[e]) != null ? t : e.toString() : e;
}
class Ne {
  constructor() {
    Q(this, "variableMap");
    // variableKey -> index
    Q(this, "variables");
    // index -> variable data
    Q(this, "nextIndex");
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
    for (const [i, r] of Object.entries(t))
      typeof r == "object" && r !== null && "_varRef" in r && typeof r._varRef == "number" ? n[i] = {
        _varRef: r._varRef
      } : n[i] = r;
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
      const i = this.variables[n], r = this.serializeValuesByMode(
        i.valuesByMode
      ), c = z(z({
        variableName: i.variableName,
        variableType: Nt(i.variableType)
      }, i._colRef !== void 0 && { _colRef: i._colRef }), r && { valuesByMode: r });
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
    const n = new Ne(), i = Object.entries(t).sort(
      (r, c) => parseInt(r[0], 10) - parseInt(c[0], 10)
    );
    for (const [r, c] of i) {
      const o = parseInt(r, 10), u = $t(c.variableType), f = Z(z({}, c), {
        variableType: u
        // Always a string after expansion
      });
      n.variables[o] = f, n.nextIndex = Math.max(n.nextIndex, o + 1);
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
function vt(e) {
  return {
    _varRef: e
  };
}
function ne(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let Et = 0;
const de = /* @__PURE__ */ new Map();
function At(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const t = de.get(e.requestId);
  t && (de.delete(e.requestId), e.error || !e.guid ? t.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : t.resolve(e.guid));
}
function ke() {
  return new Promise((e, t) => {
    const n = `guid_${Date.now()}_${++Et}`;
    de.set(n, { resolve: e, reject: t }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: n
    }), setTimeout(() => {
      de.has(n) && (de.delete(n), t(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
async function me() {
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
    }), await me();
  },
  log: async (e) => {
    console.log(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    }), await me();
  },
  warning: async (e) => {
    console.warn(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    }), await me();
  },
  error: async (e) => {
    console.error(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    }), await me();
  }
};
function Ct(e, t) {
  const n = t.modes.find((i) => i.modeId === e);
  return n ? n.name : e;
}
async function We(e, t, n, i, r = /* @__PURE__ */ new Set()) {
  const c = {};
  for (const [o, u] of Object.entries(e)) {
    const f = Ct(o, i);
    if (u == null) {
      c[f] = u;
      continue;
    }
    if (typeof u == "string" || typeof u == "number" || typeof u == "boolean") {
      c[f] = u;
      continue;
    }
    if (typeof u == "object" && u !== null && "type" in u && u.type === "VARIABLE_ALIAS" && "id" in u) {
      const h = u.id;
      if (r.has(h)) {
        c[f] = {
          type: "VARIABLE_ALIAS",
          id: h
        };
        continue;
      }
      const w = await figma.variables.getVariableByIdAsync(h);
      if (!w) {
        c[f] = {
          type: "VARIABLE_ALIAS",
          id: h
        };
        continue;
      }
      const E = new Set(r);
      E.add(h);
      const l = await figma.variables.getVariableCollectionByIdAsync(
        w.variableCollectionId
      ), R = w.key;
      if (!R) {
        c[f] = {
          type: "VARIABLE_ALIAS",
          id: h
        };
        continue;
      }
      const p = {
        variableName: w.name,
        variableType: w.resolvedType,
        collectionName: l == null ? void 0 : l.name,
        collectionId: w.variableCollectionId,
        variableKey: R,
        id: h,
        isLocal: !w.remote
      };
      if (l) {
        const I = await Ke(
          l,
          n
        );
        p._colRef = I, w.valuesByMode && (p.valuesByMode = await We(
          w.valuesByMode,
          t,
          n,
          l,
          // Pass collection for mode ID to name conversion
          E
        ));
      }
      const S = t.addVariable(p);
      c[f] = {
        type: "VARIABLE_ALIAS",
        id: h,
        _varRef: S
      };
    } else
      c[f] = u;
  }
  return c;
}
const ge = "recursica:collectionId";
async function Pt(e) {
  if (e.remote === !0) {
    const n = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(n)) {
      const r = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await a.error(r), new Error(r);
    }
    return e.id;
  } else {
    if (ie(e.name)) {
      const r = xe(e.name);
      if (r) {
        const c = e.getSharedPluginData(
          "recursica",
          ge
        );
        return (!c || c.trim() === "") && e.setSharedPluginData(
          "recursica",
          ge,
          r
        ), r;
      }
    }
    const n = e.getSharedPluginData(
      "recursica",
      ge
    );
    if (n && n.trim() !== "")
      return n;
    const i = await ke();
    return e.setSharedPluginData("recursica", ge, i), i;
  }
}
function St(e, t) {
  if (t)
    return;
  const n = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(n))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Ke(e, t) {
  const n = !e.remote, i = t.getCollectionIndex(e.id);
  if (i !== -1)
    return i;
  St(e.name, n);
  const r = await Pt(e), c = e.modes.map((h) => h.name), o = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: n,
    modes: c,
    collectionGuid: r
  }, u = t.addCollection(o), f = n ? "local" : "remote";
  return await a.log(
    `  Added ${f} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), u;
}
async function Te(e, t, n) {
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
    const c = i.key;
    if (!c)
      return console.log("Variable missing key:", e.id), null;
    const o = await Ke(
      r,
      n
    ), u = {
      variableName: i.name,
      variableType: i.resolvedType,
      _colRef: o,
      // Reference to collection table (v2.4.0+)
      variableKey: c,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    i.valuesByMode && (u.valuesByMode = await We(
      i.valuesByMode,
      t,
      n,
      r,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const f = t.addVariable(u);
    return vt(f);
  } catch (i) {
    const r = i instanceof Error ? i.message : String(i);
    throw console.error("Could not resolve variable alias:", e.id, i), new Error(
      `Failed to resolve variable alias ${e.id}: ${r}`
    );
  }
}
async function oe(e, t, n) {
  if (!e || typeof e != "object") return e;
  const i = {};
  for (const r in e)
    if (Object.prototype.hasOwnProperty.call(e, r)) {
      const c = e[r];
      if (c && typeof c == "object" && !Array.isArray(c))
        if (c.type === "VARIABLE_ALIAS") {
          const o = await Te(
            c,
            t,
            n
          );
          o && (i[r] = o);
        } else
          i[r] = await oe(
            c,
            t,
            n
          );
      else Array.isArray(c) ? i[r] = await Promise.all(
        c.map(async (o) => (o == null ? void 0 : o.type) === "VARIABLE_ALIAS" ? await Te(
          o,
          t,
          n
        ) || o : o && typeof o == "object" ? await oe(
          o,
          t,
          n
        ) : o)
      ) : i[r] = c;
    }
  return i;
}
async function He(e, t, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const r = {};
      for (const c in i)
        Object.prototype.hasOwnProperty.call(i, c) && (c === "boundVariables" ? r[c] = await oe(
          i[c],
          t,
          n
        ) : r[c] = i[c]);
      return r;
    })
  );
}
async function qe(e, t, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const r = {};
      for (const c in i)
        Object.prototype.hasOwnProperty.call(i, c) && (c === "boundVariables" ? r[c] = await oe(
          i[c],
          t,
          n
        ) : r[c] = i[c]);
      return r;
    })
  );
}
const le = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  extractBoundVariables: oe,
  resolveVariableAliasMetadata: Te,
  serializeBackgrounds: qe,
  serializeFills: He
}, Symbol.toStringTag, { value: "Module" }));
async function Ye(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  if (e.type && (n.type = e.type, i.add("type")), e.id && (n.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (n.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (n.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (n.y = e.y, i.add("y")), e.width !== void 0 && (n.width = e.width, i.add("width")), e.height !== void 0 && (n.height = e.height, i.add("height")), e.visible !== void 0 && F(e.visible, X.visible) && (n.visible = e.visible, i.add("visible")), e.locked !== void 0 && F(e.locked, X.locked) && (n.locked = e.locked, i.add("locked")), e.opacity !== void 0 && F(e.opacity, X.opacity) && (n.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && F(e.rotation, X.rotation) && (n.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && F(e.blendMode, X.blendMode) && (n.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && F(e.effects, X.effects) && (n.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const r = await He(
      e.fills,
      t.variableTable,
      t.collectionTable
    );
    F(r, X.fills) && (n.fills = r), i.add("fills");
  }
  if (e.strokes !== void 0 && F(e.strokes, X.strokes) && (n.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && F(e.strokeWeight, X.strokeWeight) && (n.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && F(e.strokeAlign, X.strokeAlign) && (n.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const r = await oe(
      e.boundVariables,
      t.variableTable,
      t.collectionTable
    );
    Object.keys(r).length > 0 && (n.boundVariables = r), i.add("boundVariables");
  }
  if (e.backgrounds !== void 0) {
    const r = await qe(
      e.backgrounds,
      t.variableTable,
      t.collectionTable
    );
    r && Array.isArray(r) && r.length > 0 && (n.backgrounds = r), i.add("backgrounds");
  }
  return n;
}
const Tt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseBaseNodeProperties: Ye
}, Symbol.toStringTag, { value: "Module" }));
async function Oe(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  if (e.type === "COMPONENT")
    try {
      e.componentPropertyDefinitions && (n.componentPropertyDefinitions = e.componentPropertyDefinitions, i.add("componentPropertyDefinitions"));
    } catch (r) {
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
const Ot = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseFrameProperties: Oe
}, Symbol.toStringTag, { value: "Module" }));
async function It(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (n.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (n.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (n.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && F(
    e.textAlignHorizontal,
    D.textAlignHorizontal
  ) && (n.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && F(
    e.textAlignVertical,
    D.textAlignVertical
  ) && (n.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && F(e.letterSpacing, D.letterSpacing) && (n.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && F(e.lineHeight, D.lineHeight) && (n.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && F(e.textCase, D.textCase) && (n.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && F(e.textDecoration, D.textDecoration) && (n.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && F(e.textAutoResize, D.textAutoResize) && (n.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && F(
    e.paragraphSpacing,
    D.paragraphSpacing
  ) && (n.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && F(e.paragraphIndent, D.paragraphIndent) && (n.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && F(e.listOptions, D.listOptions) && (n.listOptions = e.listOptions, i.add("listOptions")), n;
}
function Vt(e) {
  const t = e.match(/^(\d+\.?\d*)[eE]([+-]?\d+)$/);
  if (t) {
    const n = parseFloat(t[1]), i = parseInt(t[2]), r = n * Math.pow(10, i);
    return Math.abs(r) < 1e-10 ? "0" : r.toFixed(6).replace(/\.?0+$/, "") || "0";
  }
  return e;
}
function Xe(e) {
  if (!e || typeof e != "string")
    return e;
  let t = e.replace(/(\d+\.?\d*)[eE]([+-]?\d+)/g, (n) => Vt(n));
  return t = t.replace(
    /(\d+\.\d{7,})/g,
    // Match numbers with more than 6 decimal places
    (n) => {
      const i = parseFloat(n);
      return Math.abs(i) < 1e-10 ? "0" : i.toFixed(6).replace(/\.?0+$/, "") || "0";
    }
  ), t = t.replace(
    /([MmLlHhVvCcSsQqTtAaZz])([-\d])/g,
    (n, i, r) => `${i} ${r}`
  ), t = t.replace(/\s+/g, " ").trim(), t;
}
function Ie(e) {
  return Array.isArray(e) ? e.map((t) => ({
    data: Xe(t.data),
    // Normalize winding rule key (use windRule consistently)
    windRule: t.windRule || t.windingRule || "NONZERO"
  })) : e;
}
const Mt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  normalizeSvgPath: Xe,
  normalizeVectorGeometry: Ie
}, Symbol.toStringTag, { value: "Module" }));
async function Rt(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && F(e.fillGeometry, re.fillGeometry) && (n.fillGeometry = Ie(e.fillGeometry), i.add("fillGeometry")), e.strokeGeometry !== void 0 && F(e.strokeGeometry, re.strokeGeometry) && (n.strokeGeometry = Ie(e.strokeGeometry), i.add("strokeGeometry")), e.strokeCap !== void 0 && F(e.strokeCap, re.strokeCap) && (n.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && F(e.strokeJoin, re.strokeJoin) && (n.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && F(e.dashPattern, re.dashPattern) && (n.dashPattern = e.dashPattern, i.add("dashPattern")), n;
}
async function xt(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && F(e.cornerRadius, Je.cornerRadius) && (n.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (n.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, i.add("pointCount")), n;
}
const he = /* @__PURE__ */ new Map();
let kt = 0;
function Lt() {
  return `prompt_${Date.now()}_${++kt}`;
}
const se = {
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
    var u;
    const n = typeof t == "number" ? { timeoutMs: t } : t, i = (u = n == null ? void 0 : n.timeoutMs) != null ? u : 3e5, r = n == null ? void 0 : n.okLabel, c = n == null ? void 0 : n.cancelLabel, o = Lt();
    return new Promise((f, h) => {
      const w = i === -1 ? null : setTimeout(() => {
        he.delete(o), h(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      he.set(o, {
        resolve: f,
        reject: h,
        timeout: w
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: z(z({
          message: e,
          requestId: o
        }, r && { okLabel: r }), c && { cancelLabel: c })
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
    const { requestId: t, action: n } = e, i = he.get(t);
    if (!i) {
      console.warn(
        `Received response for unknown prompt request: ${t}`
      );
      return;
    }
    i.timeout && clearTimeout(i.timeout), he.delete(t), n === "ok" ? i.resolve() : i.reject(new Error("User cancelled"));
  }
}, _t = "RecursicaPublishedMetadata";
function Se(e) {
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
function Fe(e) {
  try {
    const t = e.getPluginData(_t);
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
async function Bt(e, t) {
  var r, c;
  const n = {}, i = /* @__PURE__ */ new Set();
  if (n._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const o = await e.getMainComponentAsync();
    if (!o) {
      const y = e.name || "(unnamed)", A = e.id;
      if (t.detachedComponentsHandled.has(A))
        await a.log(
          `Treating detached instance "${y}" as internal instance (already prompted)`
        );
      else {
        await a.warning(
          `Found detached instance: "${y}" (main component is missing)`
        );
        const s = `Found detached instance "${y}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await se.prompt(s, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(A), await a.log(
            `Treating detached instance "${y}" as internal instance`
          );
        } catch (m) {
          if (m instanceof Error && m.message === "User cancelled") {
            const b = `Export cancelled: Detached instance "${y}" found. Please fix the instance before exporting.`;
            await a.error(b);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch ($) {
              console.warn("Could not scroll to instance:", $);
            }
            throw new Error(b);
          } else
            throw m;
        }
      }
      if (!Se(e).page) {
        const s = `Detached instance "${y}" is not on any page. Cannot export.`;
        throw await a.error(s), new Error(s);
      }
      let k, _;
      try {
        e.variantProperties && (k = e.variantProperties), e.componentProperties && (_ = e.componentProperties);
      } catch (s) {
      }
      const d = z(z({
        instanceType: "internal",
        componentName: y,
        componentNodeId: e.id
      }, k && { variantProperties: k }), _ && { componentProperties: _ }), g = t.instanceTable.addInstance(d);
      return n._instanceRef = g, i.add("_instanceRef"), await a.log(
        `  Exported detached INSTANCE: "${y}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), n;
    }
    const u = e.name || "(unnamed)", f = o.name || "(unnamed)", h = o.remote === !0, E = Se(e).page, l = Se(o), R = l.page;
    let p, S = R;
    if (h)
      if (R) {
        const y = Fe(R);
        y != null && y.id ? (p = "normal", S = R, await a.log(
          `  Component "${f}" is from library but also exists on local page "${R.name}" with metadata. Treating as "normal" instance.`
        )) : (p = "remote", await a.log(
          `  Component "${f}" is from library and exists on local page "${R.name}" but has no metadata. Treating as "remote" instance.`
        ));
      } else
        p = "remote", await a.log(
          `  Component "${f}" is from library and not on a local page. Treating as "remote" instance.`
        );
    else if (R && E && R.id === E.id)
      p = "internal";
    else if (R && E && R.id !== E.id)
      p = "normal";
    else if (R && !E)
      p = "normal";
    else if (!h && l.reason === "detached") {
      const y = o.id;
      if (t.detachedComponentsHandled.has(y))
        p = "remote", await a.log(
          `Treating detached instance "${u}" -> component "${f}" as remote instance (already prompted)`
        );
      else {
        await a.warning(
          `Found detached instance: "${u}" -> component "${f}" (component is not on any page)`
        );
        try {
          await figma.viewport.scrollAndZoomIntoView([o]);
        } catch (T) {
          console.warn("Could not scroll to component:", T);
        }
        const A = `Found detached instance "${u}" attached to component "${f}". This should be fixed. Continue to publish?`;
        try {
          await se.prompt(A, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(y), p = "remote", await a.log(
            `Treating detached instance "${u}" as remote instance (will be created on REMOTES page)`
          );
        } catch (T) {
          if (T instanceof Error && T.message === "User cancelled") {
            const U = `Export cancelled: Detached instance "${u}" found. The component "${f}" is not on any page. Please fix the instance before exporting.`;
            throw await a.error(U), new Error(U);
          } else
            throw T;
        }
      }
    } else
      h || await a.warning(
        `  Instance "${u}" -> component "${f}": componentPage is null but component is not remote. Reason: ${l.reason}. Cannot determine instance type.`
      ), p = "normal";
    let I, x;
    try {
      if (e.variantProperties && (I = e.variantProperties, await a.log(
        `  Instance "${u}" -> variantProperties from instance: ${JSON.stringify(I)}`
      )), typeof e.getProperties == "function")
        try {
          const y = await e.getProperties();
          y && y.variantProperties && (await a.log(
            `  Instance "${u}" -> variantProperties from getProperties(): ${JSON.stringify(y.variantProperties)}`
          ), y.variantProperties && Object.keys(y.variantProperties).length > 0 && (I = y.variantProperties));
        } catch (y) {
          await a.log(
            `  Instance "${u}" -> getProperties() not available or failed: ${y}`
          );
        }
      if (e.componentProperties && (x = e.componentProperties), o.parent && o.parent.type === "COMPONENT_SET") {
        const y = o.parent;
        try {
          const A = y.componentPropertyDefinitions;
          A && await a.log(
            `  Component set "${y.name}" has property definitions: ${JSON.stringify(Object.keys(A))}`
          );
          const T = {}, U = f.split(",").map((k) => k.trim());
          for (const k of U) {
            const _ = k.split("=").map((d) => d.trim());
            if (_.length >= 2) {
              const d = _[0], g = _.slice(1).join("=").trim();
              A && A[d] && (T[d] = g);
            }
          }
          if (Object.keys(T).length > 0 && await a.log(
            `  Parsed variant properties from component name "${f}": ${JSON.stringify(T)}`
          ), I && Object.keys(I).length > 0)
            await a.log(
              `  Using variant properties from instance (source of truth): ${JSON.stringify(I)}`
            );
          else if (Object.keys(T).length > 0)
            I = T, await a.log(
              `  Using variant properties from component name (fallback): ${JSON.stringify(I)}`
            );
          else if (o.variantProperties) {
            const k = o.variantProperties;
            await a.log(
              `  Main component "${f}" has variantProperties: ${JSON.stringify(k)}`
            ), I = k;
          }
        } catch (A) {
          await a.warning(
            `  Could not get variant properties from component set: ${A}`
          );
        }
      }
    } catch (y) {
    }
    let G, B;
    try {
      let y = o.parent;
      const A = [];
      let T = 0;
      const U = 20;
      for (; y && T < U; )
        try {
          const k = y.type, _ = y.name;
          if (k === "COMPONENT_SET" && !B && (B = _), k === "PAGE")
            break;
          const d = _ || "";
          A.unshift(d), y = y.parent, T++;
        } catch (k) {
          break;
        }
      G = A;
    } catch (y) {
    }
    const O = z(z(z(z({
      instanceType: p,
      componentName: f
    }, B && { componentSetName: B }), I && { variantProperties: I }), x && { componentProperties: x }), p === "normal" ? { path: G || [] } : G && G.length > 0 && {
      path: G
    });
    if (p === "internal") {
      O.componentNodeId = o.id, await a.log(
        `  Found INSTANCE: "${u}" -> INTERNAL component "${f}" (ID: ${o.id.substring(0, 8)}...)`
      );
      const y = e.boundVariables, A = o.boundVariables;
      if (y && typeof y == "object") {
        const d = Object.keys(y);
        await a.log(
          `  DEBUG: Internal instance "${u}" -> boundVariables keys: ${d.length > 0 ? d.join(", ") : "none"}`
        );
        for (const s of d) {
          const m = y[s], b = (m == null ? void 0 : m.type) || typeof m;
          await a.log(
            `  DEBUG:   boundVariables.${s}: type=${b}, value=${JSON.stringify(m)}`
          );
        }
        const g = [
          "backgrounds",
          "selectionColor",
          "selectionColors",
          "selection",
          "selectColor"
        ];
        for (const s of g)
          y[s] !== void 0 && await a.log(
            `  DEBUG:   Found potential "Selection colors" property: boundVariables.${s} = ${JSON.stringify(y[s])}`
          );
      } else
        await a.log(
          `  DEBUG: Internal instance "${u}" -> No boundVariables found on instance node`
        );
      if (A && typeof A == "object") {
        const d = Object.keys(A);
        await a.log(
          `  DEBUG: Main component "${f}" -> boundVariables keys: ${d.length > 0 ? d.join(", ") : "none"}`
        );
      }
      const T = e.backgrounds;
      if (T && Array.isArray(T)) {
        await a.log(
          `  DEBUG: Internal instance "${u}" -> backgrounds array length: ${T.length}`
        );
        for (let d = 0; d < T.length; d++) {
          const g = T[d];
          if (g && typeof g == "object") {
            if (await a.log(
              `  DEBUG:   backgrounds[${d}] structure: ${JSON.stringify(Object.keys(g))}`
            ), g.boundVariables) {
              const s = Object.keys(g.boundVariables);
              await a.log(
                `  DEBUG:   backgrounds[${d}].boundVariables keys: ${s.length > 0 ? s.join(", ") : "none"}`
              );
              for (const m of s) {
                const b = g.boundVariables[m];
                await a.log(
                  `  DEBUG:     backgrounds[${d}].boundVariables.${m}: ${JSON.stringify(b)}`
                );
              }
            }
            g.color && await a.log(
              `  DEBUG:   backgrounds[${d}].color: ${JSON.stringify(g.color)}`
            );
          }
        }
      }
      const U = Object.keys(e).filter(
        (d) => !d.startsWith("_") && d !== "parent" && d !== "removed" && typeof e[d] != "function" && d !== "type" && d !== "id" && d !== "name" && d !== "boundVariables" && d !== "backgrounds" && d !== "fills"
      ), k = Object.keys(o).filter(
        (d) => !d.startsWith("_") && d !== "parent" && d !== "removed" && typeof o[d] != "function" && d !== "type" && d !== "id" && d !== "name" && d !== "boundVariables" && d !== "backgrounds" && d !== "fills"
      ), _ = [
        .../* @__PURE__ */ new Set([...U, ...k])
      ].filter(
        (d) => d.toLowerCase().includes("selection") || d.toLowerCase().includes("select") || d.toLowerCase().includes("color") && !d.toLowerCase().includes("fill") && !d.toLowerCase().includes("stroke")
      );
      if (_.length > 0) {
        await a.log(
          `  DEBUG: Found selection/color-related properties: ${_.join(", ")}`
        );
        for (const d of _)
          try {
            if (U.includes(d)) {
              const g = e[d];
              await a.log(
                `  DEBUG:   Instance.${d}: ${JSON.stringify(g)}`
              );
            }
            if (k.includes(d)) {
              const g = o[d];
              await a.log(
                `  DEBUG:   MainComponent.${d}: ${JSON.stringify(g)}`
              );
            }
          } catch (g) {
          }
      } else
        await a.log(
          "  DEBUG: No selection/color-related properties found on instance or main component"
        );
    } else if (p === "normal") {
      const y = S || R;
      if (y) {
        O.componentPageName = y.name;
        const T = Fe(y);
        T != null && T.id && T.version !== void 0 ? (O.componentGuid = T.id, O.componentVersion = T.version, await a.log(
          `  Found INSTANCE: "${u}" -> NORMAL component "${f}" (ID: ${o.id.substring(0, 8)}...) at path [${(G || []).join(" → ")}]`
        )) : await a.warning(
          `  Instance "${u}" -> component "${f}" is classified as normal but page "${y.name}" has no metadata. This instance will not be importable.`
        );
      } else {
        const T = o.id;
        let U = "", k = "";
        switch (l.reason) {
          case "broken_chain":
            U = "The component's parent chain is broken and cannot be traversed to find the page", k = "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            U = "Cannot access the component's parent chain (access error)", k = "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            U = "Cannot determine which page the component is on", k = "Please ensure the component is properly placed on a page.";
        }
        try {
          await figma.viewport.scrollAndZoomIntoView([o]);
        } catch (g) {
          console.warn("Could not scroll to component:", g);
        }
        const _ = `Normal instance "${u}" -> component "${f}" (ID: ${T}) has no componentPage. ${U}. ${k} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", _), await a.error(_);
        const d = new Error(_);
        throw console.error("Throwing error:", d), d;
      }
      G === void 0 && console.warn(
        `Failed to build path for normal instance "${u}" -> component "${f}". Path is required for resolution.`
      );
      const A = G && G.length > 0 ? ` at path [${G.join(" → ")}]` : " at page root";
      await a.log(
        `  Found INSTANCE: "${u}" -> NORMAL component "${f}" (ID: ${o.id.substring(0, 8)}...)${A}`
      );
    } else if (p === "remote") {
      let y, A;
      const T = t.detachedComponentsHandled.has(
        o.id
      );
      if (!T)
        try {
          if (typeof o.getPublishStatusAsync == "function")
            try {
              const k = await o.getPublishStatusAsync();
              k && typeof k == "object" && (k.libraryName && (y = k.libraryName), k.libraryKey && (A = k.libraryKey));
            } catch (k) {
            }
          try {
            const k = figma.teamLibrary;
            if (typeof (k == null ? void 0 : k.getAvailableLibraryComponentSetsAsync) == "function") {
              const _ = await k.getAvailableLibraryComponentSetsAsync();
              if (_ && Array.isArray(_)) {
                for (const d of _)
                  if (d.key === o.key || d.name === o.name) {
                    d.libraryName && (y = d.libraryName), d.libraryKey && (A = d.libraryKey);
                    break;
                  }
              }
            }
          } catch (k) {
          }
        } catch (k) {
          console.warn(
            `Error getting library info for remote component "${f}":`,
            k
          );
        }
      if (y && (O.remoteLibraryName = y), A && (O.remoteLibraryKey = A), T && (O.componentNodeId = o.id), t.instanceTable.getInstanceIndex(O) !== -1)
        await a.log(
          `  Found INSTANCE: "${u}" -> REMOTE component "${f}" (ID: ${o.id.substring(0, 8)}...)${T ? " [DETACHED]" : ""}`
        );
      else
        try {
          const { parseBaseNodeProperties: k } = await Promise.resolve().then(() => Tt), _ = await k(e, t), { parseFrameProperties: d } = await Promise.resolve().then(() => Ot), g = await d(e, t), s = Z(z(z({}, _), g), {
            type: "COMPONENT"
            // Convert to COMPONENT type for recreation (must be after baseProps to override)
          });
          if (e.children && Array.isArray(e.children) && e.children.length > 0) {
            const m = Z(z({}, t), {
              depth: (t.depth || 0) + 1
            }), { extractNodeData: b } = await Promise.resolve().then(() => zt), $ = [];
            for (const N of e.children)
              try {
                let v;
                if (N.type === "INSTANCE")
                  try {
                    const V = await N.getMainComponentAsync();
                    if (V) {
                      const C = await k(
                        N,
                        t
                      ), L = await d(
                        N,
                        t
                      ), K = await b(
                        V,
                        /* @__PURE__ */ new WeakSet(),
                        m
                      );
                      v = Z(z(z(z({}, K), C), L), {
                        type: "COMPONENT"
                        // Convert to COMPONENT
                      });
                    } else
                      v = await b(
                        N,
                        /* @__PURE__ */ new WeakSet(),
                        m
                      ), v.type === "INSTANCE" && (v.type = "COMPONENT"), delete v._instanceRef;
                  } catch (V) {
                    v = await b(
                      N,
                      /* @__PURE__ */ new WeakSet(),
                      m
                    ), v.type === "INSTANCE" && (v.type = "COMPONENT"), delete v._instanceRef;
                  }
                else {
                  v = await b(
                    N,
                    /* @__PURE__ */ new WeakSet(),
                    m
                  );
                  const V = N.boundVariables;
                  if (V && typeof V == "object") {
                    const C = Object.keys(V);
                    C.length > 0 && (await a.log(
                      `  DEBUG: Child "${N.name || "Unnamed"}" -> boundVariables keys: ${C.join(", ")}`
                    ), V.backgrounds !== void 0 && await a.log(
                      `  DEBUG:   Child "${N.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(V.backgrounds)}`
                    ));
                  }
                  if (o.children && Array.isArray(o.children)) {
                    const C = o.children.find(
                      (L) => L.name === N.name
                    );
                    if (C) {
                      const L = C.boundVariables;
                      if (L && typeof L == "object") {
                        const K = Object.keys(L);
                        if (K.length > 0 && (await a.log(
                          `  DEBUG: Main component child "${C.name || "Unnamed"}" -> boundVariables keys: ${K.join(", ")}`
                        ), L.backgrounds !== void 0 && (await a.log(
                          `  DEBUG:   Main component child "${C.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(L.backgrounds)}`
                        ), !V || !V.backgrounds))) {
                          await a.log(
                            "  DEBUG:   Instance child doesn't have boundVariables.backgrounds, but main component child does - preserving from main component"
                          );
                          const { extractBoundVariables: H } = await Promise.resolve().then(() => le), J = await H(
                            L,
                            t.variableTable,
                            t.collectionTable
                          );
                          v.boundVariables || (v.boundVariables = {}), J.backgrounds && (v.boundVariables.backgrounds = J.backgrounds, await a.log(
                            "  DEBUG:   ✓ Added boundVariables.backgrounds to childData from main component child"
                          ));
                        }
                      }
                    }
                  }
                }
                $.push(v);
              } catch (v) {
                console.warn(
                  `Failed to extract child "${N.name || "Unnamed"}" for remote component "${f}":`,
                  v
                );
              }
            s.children = $;
          }
          if (!s)
            throw new Error("Failed to build structure for remote instance");
          try {
            const m = e.boundVariables;
            if (m && typeof m == "object") {
              const M = Object.keys(m);
              await a.log(
                `  DEBUG: Instance "${u}" -> boundVariables keys: ${M.length > 0 ? M.join(", ") : "none"}`
              );
              for (const W of M) {
                const q = m[W], ct = (q == null ? void 0 : q.type) || typeof q;
                if (await a.log(
                  `  DEBUG:   boundVariables.${W}: type=${ct}, value=${JSON.stringify(q)}`
                ), q && typeof q == "object" && !Array.isArray(q)) {
                  const Ae = Object.keys(q);
                  if (Ae.length > 0) {
                    await a.log(
                      `  DEBUG:     boundVariables.${W} has nested keys: ${Ae.join(", ")}`
                    );
                    for (const Ge of Ae) {
                      const fe = q[Ge];
                      fe && typeof fe == "object" && fe.type === "VARIABLE_ALIAS" && await a.log(
                        `  DEBUG:       boundVariables.${W}.${Ge}: VARIABLE_ALIAS id=${fe.id}`
                      );
                    }
                  }
                }
              }
              const j = [
                "backgrounds",
                "selectionColor",
                "selectionColors",
                "selection",
                "selectColor"
              ];
              for (const W of j)
                m[W] !== void 0 && await a.log(
                  `  DEBUG:   Found potential "Selection colors" property: boundVariables.${W} = ${JSON.stringify(m[W])}`
                );
            } else
              await a.log(
                `  DEBUG: Instance "${u}" -> No boundVariables found on instance node`
              );
            const b = m && m.fills !== void 0 && m.fills !== null, $ = s.fills !== void 0 && Array.isArray(s.fills) && s.fills.length > 0, N = e.fills !== void 0 && Array.isArray(e.fills) && e.fills.length > 0, v = o.fills !== void 0 && Array.isArray(o.fills) && o.fills.length > 0;
            if (await a.log(
              `  DEBUG: Instance "${u}" -> fills check: instanceHasFills=${N}, structureHasFills=${$}, mainComponentHasFills=${v}, hasInstanceFillsBoundVar=${!!b}`
            ), b && !$) {
              await a.log(
                "  DEBUG: Instance has boundVariables.fills but structure has no fills - attempting to get fills"
              );
              try {
                if (N) {
                  const { serializeFills: M } = await Promise.resolve().then(() => le), j = await M(
                    e.fills,
                    t.variableTable,
                    t.collectionTable
                  );
                  s.fills = j, await a.log(
                    `  DEBUG: Got ${j.length} fill(s) from instance node`
                  );
                } else if (v) {
                  const { serializeFills: M } = await Promise.resolve().then(() => le), j = await M(
                    o.fills,
                    t.variableTable,
                    t.collectionTable
                  );
                  s.fills = j, await a.log(
                    `  DEBUG: Got ${j.length} fill(s) from main component`
                  );
                } else
                  await a.warning(
                    "  DEBUG: Instance has boundVariables.fills but neither instance nor main component has fills"
                  );
              } catch (M) {
                await a.warning(
                  `  Failed to get fills: ${M}`
                );
              }
            }
            const V = e.selectionColor, C = o.selectionColor;
            V !== void 0 && await a.log(
              `  DEBUG: Instance "${u}" -> selectionColor: ${JSON.stringify(V)}`
            ), C !== void 0 && await a.log(
              `  DEBUG: Main component "${f}" -> selectionColor: ${JSON.stringify(C)}`
            );
            const L = Object.keys(e).filter(
              (M) => !M.startsWith("_") && M !== "parent" && M !== "removed" && typeof e[M] != "function" && M !== "type" && M !== "id" && M !== "name"
            ), K = Object.keys(o).filter(
              (M) => !M.startsWith("_") && M !== "parent" && M !== "removed" && typeof o[M] != "function" && M !== "type" && M !== "id" && M !== "name"
            ), H = [
              .../* @__PURE__ */ new Set([...L, ...K])
            ].filter(
              (M) => M.toLowerCase().includes("selection") || M.toLowerCase().includes("select") || M.toLowerCase().includes("color") && !M.toLowerCase().includes("fill") && !M.toLowerCase().includes("stroke")
            );
            if (H.length > 0) {
              await a.log(
                `  DEBUG: Found selection/color-related properties: ${H.join(", ")}`
              );
              for (const M of H)
                try {
                  if (L.includes(M)) {
                    const j = e[M];
                    await a.log(
                      `  DEBUG:   Instance.${M}: ${JSON.stringify(j)}`
                    );
                  }
                  if (K.includes(M)) {
                    const j = o[M];
                    await a.log(
                      `  DEBUG:   MainComponent.${M}: ${JSON.stringify(j)}`
                    );
                  }
                } catch (j) {
                }
            } else
              await a.log(
                "  DEBUG: No selection/color-related properties found on instance or main component"
              );
            const J = o.boundVariables;
            if (J && typeof J == "object") {
              const M = Object.keys(J);
              if (M.length > 0) {
                await a.log(
                  `  DEBUG: Main component "${f}" -> boundVariables keys: ${M.join(", ")}`
                );
                for (const j of M) {
                  const W = J[j], q = (W == null ? void 0 : W.type) || typeof W;
                  await a.log(
                    `  DEBUG:   Main component boundVariables.${j}: type=${q}, value=${JSON.stringify(W)}`
                  );
                }
              }
            }
            if (m && Object.keys(m).length > 0) {
              await a.log(
                `  DEBUG: Preserving instance's boundVariables in structure (${Object.keys(m).length} key(s))`
              );
              const { extractBoundVariables: M } = await Promise.resolve().then(() => le), j = await M(
                m,
                t.variableTable,
                t.collectionTable
              );
              s.boundVariables || (s.boundVariables = {});
              for (const [W, q] of Object.entries(
                j
              ))
                q !== void 0 && (s.boundVariables[W] !== void 0 && await a.log(
                  `  DEBUG: Structure already has boundVariables.${W} from baseProps, but instance also has it - using instance's boundVariables.${W}`
                ), s.boundVariables[W] = q, await a.log(
                  `  DEBUG: Set boundVariables.${W} in structure: ${JSON.stringify(q)}`
                ));
              j.fills !== void 0 ? await a.log(
                "  DEBUG: ✓ Preserved boundVariables.fills from instance"
              ) : b && await a.warning(
                "  DEBUG: Instance has boundVariables.fills but extractBoundVariables didn't extract it"
              ), j.backgrounds !== void 0 ? await a.log(
                `  DEBUG: ✓ Preserved boundVariables.backgrounds from instance: ${JSON.stringify(j.backgrounds)}`
              ) : m && m.backgrounds !== void 0 && await a.warning(
                "  DEBUG: Instance has boundVariables.backgrounds but extractBoundVariables didn't extract it"
              );
            }
            if (J && Object.keys(J).length > 0) {
              await a.log(
                `  DEBUG: Checking main component's boundVariables for properties not in instance (${Object.keys(J).length} key(s))`
              );
              const { extractBoundVariables: M } = await Promise.resolve().then(() => le), j = await M(
                J,
                t.variableTable,
                t.collectionTable
              );
              s.boundVariables || (s.boundVariables = {});
              for (const [W, q] of Object.entries(
                j
              ))
                q !== void 0 && (s.boundVariables[W] === void 0 ? (s.boundVariables[W] = q, await a.log(
                  `  DEBUG: Added boundVariables.${W} from main component (not in instance): ${JSON.stringify(q)}`
                )) : await a.log(
                  `  DEBUG: Skipped boundVariables.${W} from main component (instance already has it)`
                ));
            }
            await a.log(
              `  DEBUG: Final structure for "${f}": hasFills=${!!s.fills}, fillsCount=${((r = s.fills) == null ? void 0 : r.length) || 0}, hasBoundVars=${!!s.boundVariables}, boundVarsKeys=${s.boundVariables ? Object.keys(s.boundVariables).join(", ") : "none"}`
            ), (c = s.boundVariables) != null && c.fills && await a.log(
              `  DEBUG: Structure boundVariables.fills: ${JSON.stringify(s.boundVariables.fills)}`
            );
          } catch (m) {
            await a.warning(
              `  Failed to handle bound variables for fills: ${m}`
            );
          }
          O.structure = s, T ? await a.log(
            `  Extracted structure for detached component "${f}" (ID: ${o.id.substring(0, 8)}...)`
          ) : await a.log(
            `  Extracted structure from instance for remote component "${f}" (preserving size overrides: ${e.width}x${e.height})`
          ), await a.log(
            `  Found INSTANCE: "${u}" -> REMOTE component "${f}" (ID: ${o.id.substring(0, 8)}...)${T ? " [DETACHED]" : ""}`
          );
        } catch (k) {
          const _ = `Failed to extract structure for remote component "${f}": ${k instanceof Error ? k.message : String(k)}`;
          console.error(_, k), await a.error(_);
        }
    }
    const P = t.instanceTable.addInstance(O);
    n._instanceRef = P, i.add("_instanceRef");
  }
  return n;
}
class ue {
  constructor() {
    Q(this, "instanceMap");
    // unique key -> index
    Q(this, "instances");
    // index -> instance data
    Q(this, "nextIndex");
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
    const n = new ue(), i = Object.entries(t).sort(
      (r, c) => parseInt(r[0], 10) - parseInt(c[0], 10)
    );
    for (const [r, c] of i) {
      const o = parseInt(r, 10), u = n.generateKey(c);
      n.instanceMap.set(u, o), n.instances[o] = c, n.nextIndex = Math.max(n.nextIndex, o + 1);
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
const Ze = {
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
function Gt() {
  const e = {};
  for (const [t, n] of Object.entries(Ze))
    e[n] = t;
  return e;
}
function je(e) {
  var t;
  return (t = Ze[e]) != null ? t : e;
}
function Ut(e) {
  var t;
  return typeof e == "number" ? (t = Gt()[e]) != null ? t : e.toString() : e;
}
const Qe = {
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
}, Ve = {};
for (const [e, t] of Object.entries(Qe))
  Ve[t] = e;
class $e {
  constructor() {
    Q(this, "shortToLong");
    Q(this, "longToShort");
    this.shortToLong = z({}, Ve), this.longToShort = z({}, Qe);
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
      for (const r of Object.keys(t))
        i.add(r);
      for (const [r, c] of Object.entries(t)) {
        const o = this.getShortName(r);
        if (o !== r && !i.has(o)) {
          let u = this.compressObject(c);
          o === "type" && typeof u == "string" && (u = je(u)), n[o] = u;
        } else {
          let u = this.compressObject(c);
          r === "type" && typeof u == "string" && (u = je(u)), n[r] = u;
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
      for (const [i, r] of Object.entries(t)) {
        const c = this.getLongName(i);
        let o = this.expandObject(r);
        (c === "type" || i === "type") && (typeof o == "number" || typeof o == "string") && (o = Ut(o)), n[c] = o;
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
    return z({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(t) {
    const n = new $e();
    n.shortToLong = z(z({}, Ve), t), n.longToShort = {};
    for (const [i, r] of Object.entries(
      n.shortToLong
    ))
      n.longToShort[r] = i;
    return n;
  }
}
function Ft(e, t) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const n = {};
  e.metadata && (n.metadata = e.metadata);
  for (const [i, r] of Object.entries(e))
    i !== "metadata" && (n[i] = t.compressObject(r));
  return n;
}
function jt(e, t) {
  return t.expandObject(e);
}
function be(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
function ve(e) {
  let t = 1;
  return e.children && e.children.length > 0 && e.children.forEach((n) => {
    t += ve(n);
  }), t;
}
async function Ee(e, t = /* @__PURE__ */ new WeakSet(), n = {}) {
  var R, p, S, I, x, G, B;
  if (!e || typeof e != "object")
    return e;
  const i = (R = n.maxNodes) != null ? R : 1e4, r = (p = n.nodeCount) != null ? p : 0;
  if (r >= i)
    return await a.warning(
      `Maximum node count (${i}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: r
    };
  const c = {
    visited: (S = n.visited) != null ? S : /* @__PURE__ */ new WeakSet(),
    depth: (I = n.depth) != null ? I : 0,
    maxDepth: (x = n.maxDepth) != null ? x : 100,
    nodeCount: r + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: n.variableTable,
    collectionTable: n.collectionTable,
    instanceTable: n.instanceTable,
    detachedComponentsHandled: (G = n.detachedComponentsHandled) != null ? G : /* @__PURE__ */ new Set(),
    exportedIds: (B = n.exportedIds) != null ? B : /* @__PURE__ */ new Map()
  };
  if (t.has(e))
    return "[Circular Reference]";
  t.add(e), c.visited = t;
  const o = {}, u = await Ye(e, c);
  if (Object.assign(o, u), o.id && c.exportedIds) {
    const O = c.exportedIds.get(o.id);
    if (O !== void 0) {
      const P = o.name || "Unnamed";
      if (O !== P) {
        const y = `Duplicate ID detected during export: ID "${o.id.substring(0, 8)}..." is used by both "${O}" and "${P}". Each node must have a unique ID.`;
        throw await a.error(y), new Error(y);
      }
      await a.warning(
        `Node "${P}" (ID: ${o.id.substring(0, 8)}...) was encountered multiple times during export. This may indicate a structural issue.`
      );
    } else
      c.exportedIds.set(o.id, o.name || "Unnamed");
  }
  const f = e.type;
  if (f)
    switch (f) {
      case "FRAME":
      case "COMPONENT": {
        const O = await Oe(e);
        Object.assign(o, O);
        break;
      }
      case "INSTANCE": {
        const O = await Bt(
          e,
          c
        );
        Object.assign(o, O);
        const P = await Oe(
          e
        );
        Object.assign(o, P);
        break;
      }
      case "TEXT": {
        const O = await It(e);
        Object.assign(o, O);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const O = await Rt(e);
        Object.assign(o, O);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const O = await xt(e);
        Object.assign(o, O);
        break;
      }
      default:
        c.unhandledKeys.add("_unknownType");
        break;
    }
  const h = Object.getOwnPropertyNames(e), w = /* @__PURE__ */ new Set([
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
  (f === "FRAME" || f === "COMPONENT" || f === "INSTANCE") && (w.add("layoutMode"), w.add("primaryAxisSizingMode"), w.add("counterAxisSizingMode"), w.add("primaryAxisAlignItems"), w.add("counterAxisAlignItems"), w.add("paddingLeft"), w.add("paddingRight"), w.add("paddingTop"), w.add("paddingBottom"), w.add("itemSpacing"), w.add("cornerRadius"), w.add("clipsContent"), w.add("layoutWrap"), w.add("layoutGrow")), f === "TEXT" && (w.add("characters"), w.add("fontName"), w.add("fontSize"), w.add("textAlignHorizontal"), w.add("textAlignVertical"), w.add("letterSpacing"), w.add("lineHeight"), w.add("textCase"), w.add("textDecoration"), w.add("textAutoResize"), w.add("paragraphSpacing"), w.add("paragraphIndent"), w.add("listOptions")), (f === "VECTOR" || f === "LINE") && (w.add("fillGeometry"), w.add("strokeGeometry")), (f === "RECTANGLE" || f === "ELLIPSE" || f === "STAR" || f === "POLYGON") && (w.add("pointCount"), w.add("innerRadius"), w.add("arcData")), f === "INSTANCE" && (w.add("mainComponent"), w.add("componentProperties"));
  for (const O of h)
    typeof e[O] != "function" && (w.has(O) || c.unhandledKeys.add(O));
  c.unhandledKeys.size > 0 && (o._unhandledKeys = Array.from(c.unhandledKeys).sort());
  const E = o._instanceRef !== void 0 && c.instanceTable && f === "INSTANCE";
  let l = !1;
  if (E) {
    const O = c.instanceTable.getInstanceByIndex(
      o._instanceRef
    );
    O && O.instanceType === "normal" && (l = !0, await a.log(
      `  Skipping children extraction for normal instance "${o.name || "Unnamed"}" - will be resolved from referenced component`
    ));
  }
  if (!l && e.children && Array.isArray(e.children)) {
    const O = c.maxDepth;
    if (c.depth >= O)
      o.children = {
        _truncated: !0,
        _reason: `Maximum depth (${O}) reached`,
        _count: e.children.length
      };
    else if (c.nodeCount >= i)
      o.children = {
        _truncated: !0,
        _reason: `Maximum node count (${i}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const P = Z(z({}, c), {
        depth: c.depth + 1
      }), y = [];
      let A = !1;
      for (const T of e.children) {
        if (P.nodeCount >= i) {
          o.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: y.length,
            _total: e.children.length,
            children: y
          }, A = !0;
          break;
        }
        const U = await Ee(T, t, P);
        y.push(U), P.nodeCount && (c.nodeCount = P.nodeCount);
      }
      A || (o.children = y);
    }
  }
  return o;
}
async function Le(e, t = /* @__PURE__ */ new Set(), n = !1) {
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
    const r = figma.root.children;
    if (await a.log(`Loaded ${r.length} page(s)`), i < 0 || i >= r.length)
      return await a.error(
        `Invalid page index: ${i} (valid range: 0-${r.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const c = r[i], o = c.id;
    if (t.has(o))
      return await a.log(
        `Page "${c.name}" has already been processed, skipping...`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Page already processed",
        data: {}
      };
    t.add(o), await a.log(
      `Selected page: "${c.name}" (index: ${i})`
    ), await a.log(
      "Initializing variable, collection, and instance tables..."
    );
    const u = new Ne(), f = new we(), h = new ue();
    await a.log("Fetching team library variable collections...");
    let w = [];
    try {
      if (w = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((m) => ({
        libraryName: m.libraryName,
        key: m.key,
        name: m.name
      })), await a.log(
        `Found ${w.length} library collection(s) in team library`
      ), w.length > 0)
        for (const m of w)
          await a.log(`  - ${m.name} (from ${m.libraryName})`);
    } catch (s) {
      await a.warning(
        `Could not get library variable collections: ${s instanceof Error ? s.message : String(s)}`
      );
    }
    await a.log("Extracting node data from page..."), await a.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await a.log(
      "Collections will be discovered as variables are processed:"
    );
    const E = await Ee(
      c,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: u,
        collectionTable: f,
        instanceTable: h
      }
    );
    await a.log("Node extraction finished");
    const l = ve(E), R = u.getSize(), p = f.getSize(), S = h.getSize();
    if (await a.log("Extraction complete:"), await a.log(`  - Total nodes: ${l}`), await a.log(`  - Unique variables: ${R}`), await a.log(`  - Unique collections: ${p}`), await a.log(`  - Unique instances: ${S}`), p > 0) {
      await a.log("Collections found:");
      const s = f.getTable();
      for (const [m, b] of Object.values(s).entries()) {
        const $ = b.collectionGuid ? ` (GUID: ${b.collectionGuid.substring(0, 8)}...)` : "";
        await a.log(
          `  ${m}: ${b.collectionName}${$} - ${b.modes.length} mode(s)`
        );
      }
    }
    await a.log("Checking for referenced component pages...");
    const I = [], x = h.getSerializedTable(), G = Object.values(x).filter(
      (s) => s.instanceType === "normal"
    );
    if (G.length > 0) {
      await a.log(
        `Found ${G.length} normal instance(s) to check`
      );
      const s = /* @__PURE__ */ new Map();
      for (const m of G)
        if (m.componentPageName) {
          const b = r.find(($) => $.name === m.componentPageName);
          if (b && !t.has(b.id))
            s.has(b.id) || s.set(b.id, b);
          else if (!b) {
            const $ = `Normal instance references component "${m.componentName || "(unnamed)"}" on page "${m.componentPageName}", but that page was not found. Cannot export.`;
            throw await a.error($), new Error($);
          }
        } else {
          const b = `Normal instance references component "${m.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw await a.error(b), new Error(b);
        }
      await a.log(
        `Found ${s.size} unique referenced page(s)`
      );
      for (const [m, b] of s.entries()) {
        const $ = b.name;
        if (t.has(m)) {
          await a.log(`Skipping "${$}" - already processed`);
          continue;
        }
        const N = b.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let v = !1;
        if (N)
          try {
            const C = JSON.parse(N);
            v = !!(C.id && C.version !== void 0);
          } catch (C) {
          }
        const V = `Do you want to also publish referenced component "${$}"?`;
        try {
          await se.prompt(V, {
            okLabel: "Yes",
            cancelLabel: "No",
            timeoutMs: 3e5
            // 5 minutes
          }), await a.log(`Exporting referenced page: "${$}"`);
          const C = r.findIndex(
            (K) => K.id === b.id
          );
          if (C === -1)
            throw await a.error(
              `Could not find page index for "${$}"`
            ), new Error(`Could not find page index for "${$}"`);
          const L = await Le(
            {
              pageIndex: C
            },
            t,
            // Pass the same set to track all processed pages
            !0
            // Mark as recursive call
          );
          if (L.success && L.data) {
            const K = L.data;
            I.push(K), await a.log(
              `Successfully exported referenced page: "${$}"`
            );
          } else
            throw new Error(
              `Failed to export referenced page "${$}": ${L.message}`
            );
        } catch (C) {
          if (C instanceof Error && C.message === "User cancelled")
            if (v)
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
            throw C;
        }
      }
    }
    await a.log("Creating string table...");
    const B = new $e();
    await a.log("Getting page metadata...");
    const O = c.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let P = "", y = 0;
    if (O)
      try {
        const s = JSON.parse(O);
        P = s.id || "", y = s.version || 0;
      } catch (s) {
        await a.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!P) {
      await a.log("Generating new GUID for page..."), P = await ke();
      const s = {
        _ver: 1,
        id: P,
        name: c.name,
        version: y,
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
        exportFormatVersion: "2.7.0",
        // Updated version for string table compression
        figmaApiVersion: figma.apiVersion,
        guid: P,
        version: y,
        name: c.name,
        pluginVersion: "1.0.0"
      },
      stringTable: B.getSerializedTable(),
      collections: f.getSerializedTable(),
      variables: u.getSerializedTable(),
      instances: h.getSerializedTable(),
      libraries: w,
      // Libraries might not need compression, but could be added later
      pageData: E
    };
    await a.log("Compressing JSON data...");
    const T = Ft(A, B);
    await a.log("Serializing to JSON...");
    const U = JSON.stringify(T, null, 2), k = (U.length / 1024).toFixed(2), d = be(c.name).trim().replace(/\s+/g, "_") + ".figma.json";
    return await a.log(`JSON serialization complete: ${k} KB`), await a.log(`Export file: ${d}`), await a.log("=== Export Complete ==="), {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: d,
        jsonData: U,
        pageName: c.name,
        additionalPages: I
        // Populated with referenced component pages
      }
    };
  } catch (i) {
    const r = i instanceof Error ? i.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", i), console.error("Error message:", r), await a.error(`Export failed: ${r}`), i instanceof Error && i.stack && (console.error("Stack trace:", i.stack), await a.error(`Stack trace: ${i.stack}`));
    const c = {
      type: "exportPage",
      success: !1,
      error: !0,
      message: r,
      data: {}
    };
    return console.error("Returning error response:", c), c;
  }
}
const zt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  countTotalNodes: ve,
  exportPage: Le,
  extractNodeData: Ee
}, Symbol.toStringTag, { value: "Module" }));
async function pe(e, t) {
  for (const n of t)
    e.modes.find((r) => r.name === n) || e.addMode(n);
}
const ee = "recursica:collectionId";
async function ye(e) {
  if (e.remote === !0) {
    const n = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(n)) {
      const r = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await a.error(r), new Error(r);
    }
    return e.id;
  } else {
    const n = e.getSharedPluginData(
      "recursica",
      ee
    );
    if (n && n.trim() !== "")
      return n;
    const i = await ke();
    return e.setSharedPluginData("recursica", ee, i), i;
  }
}
function Jt(e, t) {
  const n = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(n))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Wt(e) {
  let t;
  const n = e.collectionName.trim().toLowerCase(), i = ["token", "tokens", "theme", "themes"], r = e.isLocal;
  if (r === !1 || r === void 0 && i.includes(n))
    try {
      const u = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((f) => f.name.trim().toLowerCase() === n);
      if (u) {
        Jt(e.collectionName, !1);
        const f = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          u.key
        );
        if (f.length > 0) {
          const h = await figma.variables.importVariableByKeyAsync(f[0].key), w = await figma.variables.getVariableCollectionByIdAsync(
            h.variableCollectionId
          );
          if (w) {
            if (t = w, e.collectionGuid) {
              const E = t.getSharedPluginData(
                "recursica",
                ee
              );
              (!E || E.trim() === "") && t.setSharedPluginData(
                "recursica",
                ee,
                e.collectionGuid
              );
            } else
              await ye(t);
            return await pe(t, e.modes), { collection: t };
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
    let u;
    if (e.collectionGuid && (u = o.find((f) => f.getSharedPluginData("recursica", ee) === e.collectionGuid)), u || (u = o.find(
      (f) => f.name === e.collectionName
    )), u)
      if (t = u, e.collectionGuid) {
        const f = t.getSharedPluginData(
          "recursica",
          ee
        );
        (!f || f.trim() === "") && t.setSharedPluginData(
          "recursica",
          ee,
          e.collectionGuid
        );
      } else
        await ye(t);
    else
      t = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? t.setSharedPluginData(
        "recursica",
        ee,
        e.collectionGuid
      ) : await ye(t);
  } else {
    const o = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), u = e.collectionName.trim().toLowerCase(), f = o.find((l) => l.name.trim().toLowerCase() === u);
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
    const w = await figma.variables.importVariableByKeyAsync(
      h[0].key
    ), E = await figma.variables.getVariableCollectionByIdAsync(
      w.variableCollectionId
    );
    if (!E)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (t = E, e.collectionGuid) {
      const l = t.getSharedPluginData(
        "recursica",
        ee
      );
      (!l || l.trim() === "") && t.setSharedPluginData(
        "recursica",
        ee,
        e.collectionGuid
      );
    } else
      ye(t);
  }
  return await pe(t, e.modes), { collection: t };
}
async function _e(e, t) {
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
async function Kt(e, t, n, i, r) {
  for (const [c, o] of Object.entries(t)) {
    const u = i.modes.find((h) => h.name === c);
    if (!u) {
      console.warn(
        `Mode "${c}" not found in collection "${i.name}" for variable "${e.name}". Skipping.`
      );
      continue;
    }
    const f = u.modeId;
    try {
      if (o == null)
        continue;
      if (typeof o == "string" || typeof o == "number" || typeof o == "boolean") {
        e.setValueForMode(f, o);
        continue;
      }
      if (typeof o == "object" && o !== null && "_varRef" in o && typeof o._varRef == "number") {
        const h = o;
        let w = null;
        const E = n.getVariableByIndex(
          h._varRef
        );
        if (E) {
          let l = null;
          if (r && E._colRef !== void 0) {
            const R = r.getCollectionByIndex(
              E._colRef
            );
            R && (l = (await Wt(R)).collection);
          }
          l && (w = await _e(
            l,
            E.variableName
          ));
        }
        if (w) {
          const l = {
            type: "VARIABLE_ALIAS",
            id: w.id
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
async function Me(e, t, n, i) {
  const r = figma.variables.createVariable(
    e.variableName,
    t,
    e.variableType
  );
  return e.valuesByMode && await Kt(
    r,
    e.valuesByMode,
    n,
    t,
    // Pass collection to look up modes by name
    i
  ), r;
}
async function Ht(e, t, n, i) {
  const r = t.getVariableByIndex(e);
  if (!r || r._colRef === void 0)
    return null;
  const c = i.get(String(r._colRef));
  if (!c)
    return null;
  const o = await _e(
    c,
    r.variableName
  );
  if (o) {
    let u;
    if (typeof r.variableType == "number" ? u = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[r.variableType] || String(r.variableType) : u = r.variableType, De(o, u))
      return o;
  }
  return await Me(
    r,
    c,
    t,
    n
  );
}
async function qt(e, t, n, i) {
  if (!(!t || typeof t != "object"))
    try {
      const r = e[n];
      if (!r || !Array.isArray(r))
        return;
      const c = t[n];
      if (Array.isArray(c))
        for (let o = 0; o < c.length && o < r.length; o++) {
          const u = c[o];
          if (u && typeof u == "object") {
            if (r[o].boundVariables || (r[o].boundVariables = {}), ne(u)) {
              const f = u._varRef;
              if (f !== void 0) {
                const h = i.get(String(f));
                h && (r[o].boundVariables.color = {
                  type: "VARIABLE_ALIAS",
                  id: h.id
                });
              }
            } else
              for (const [f, h] of Object.entries(
                u
              ))
                if (ne(h)) {
                  const w = h._varRef;
                  if (w !== void 0) {
                    const E = i.get(String(w));
                    E && (r[o].boundVariables[f] = {
                      type: "VARIABLE_ALIAS",
                      id: E.id
                    });
                  }
                }
          }
        }
    } catch (r) {
      console.log(`Error restoring bound variables for ${n}:`, r);
    }
}
function Yt(e, t, n = !1) {
  const i = yt(t);
  if (e.visible === void 0 && (e.visible = i.visible), e.locked === void 0 && (e.locked = i.locked), e.opacity === void 0 && (e.opacity = i.opacity), e.rotation === void 0 && (e.rotation = i.rotation), e.blendMode === void 0 && (e.blendMode = i.blendMode), t === "FRAME" || t === "COMPONENT" || t === "INSTANCE") {
    const r = Y;
    e.layoutMode === void 0 && (e.layoutMode = r.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = r.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = r.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = r.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = r.counterAxisAlignItems), n || (e.paddingLeft === void 0 && (e.paddingLeft = r.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = r.paddingRight), e.paddingTop === void 0 && (e.paddingTop = r.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = r.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = r.itemSpacing));
  }
  if (t === "TEXT") {
    const r = D;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = r.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = r.textAlignVertical), e.textCase === void 0 && (e.textCase = r.textCase), e.textDecoration === void 0 && (e.textDecoration = r.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = r.textAutoResize);
  }
}
async function ce(e, t, n = null, i = null, r = null, c = null, o = null, u = !1, f = null, h = null, w = null, E = null) {
  var y, A, T, U, k, _;
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
        l = o.get(e.id), await a.log(
          `Reusing existing COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id.substring(0, 8)}...)`
        );
      else if (l = figma.createComponent(), await a.log(
        `Created COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id ? e.id.substring(0, 8) + "..." : "no ID"})`
      ), e.componentPropertyDefinitions) {
        const d = e.componentPropertyDefinitions;
        let g = 0, s = 0;
        for (const [m, b] of Object.entries(d))
          try {
            const $ = b.type;
            let N = null;
            if (typeof $ == "string" ? ($ === "TEXT" || $ === "BOOLEAN" || $ === "INSTANCE_SWAP" || $ === "VARIANT") && (N = $) : typeof $ == "number" && (N = {
              2: "TEXT",
              // Text property
              25: "BOOLEAN",
              // Boolean property
              27: "INSTANCE_SWAP",
              // Instance swap property
              26: "VARIANT"
              // Variant property
            }[$] || null), !N) {
              await a.warning(
                `  Unknown property type ${$} (${typeof $}) for property "${m}" in component "${e.name || "Unnamed"}"`
              ), s++;
              continue;
            }
            const v = b.defaultValue, V = m.split("#")[0];
            l.addComponentProperty(
              V,
              N,
              v
            ), g++;
          } catch ($) {
            await a.warning(
              `  Failed to add component property "${m}" to "${e.name || "Unnamed"}": ${$}`
            ), s++;
          }
        g > 0 && await a.log(
          `  Added ${g} component property definition(s) to "${e.name || "Unnamed"}"${s > 0 ? ` (${s} failed)` : ""}`
        );
      }
      break;
    case "COMPONENT_SET": {
      const d = e.children ? e.children.filter((m) => m.type === "COMPONENT").length : 0;
      await a.log(
        `Creating COMPONENT_SET "${e.name || "Unnamed"}" by combining ${d} component variant(s)`
      );
      const g = [];
      let s = null;
      if (e.children && Array.isArray(e.children)) {
        s = figma.createFrame(), s.name = `_temp_${e.name || "COMPONENT_SET"}`, s.visible = !1, ((t == null ? void 0 : t.type) === "PAGE" ? t : figma.currentPage).appendChild(s);
        for (const b of e.children)
          if (b.type === "COMPONENT" && !b._truncated)
            try {
              const $ = await ce(
                b,
                s,
                // Use temp parent for now
                n,
                i,
                r,
                c,
                o,
                u,
                f,
                null,
                // deferredInstances - not needed for component set creation
                null,
                // parentNodeData - not needed here, will be passed correctly in recursive calls
                E
              );
              $ && $.type === "COMPONENT" && (g.push($), await a.log(
                `  Created component variant: "${$.name || "Unnamed"}"`
              ));
            } catch ($) {
              await a.warning(
                `  Failed to create component variant "${b.name || "Unnamed"}": ${$}`
              );
            }
      }
      if (g.length > 0)
        try {
          const m = t || figma.currentPage, b = figma.combineAsVariants(
            g,
            m
          );
          e.name && (b.name = e.name), e.x !== void 0 && (b.x = e.x), e.y !== void 0 && (b.y = e.y), s && s.parent && s.remove(), await a.log(
            `  ✓ Successfully created COMPONENT_SET "${b.name}" with ${g.length} variant(s)`
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
      if (u)
        l = figma.createFrame(), e.name && (l.name = e.name);
      else if (e._instanceRef !== void 0 && r && o) {
        const d = r.getInstanceByIndex(
          e._instanceRef
        );
        if (d && d.instanceType === "internal")
          if (d.componentNodeId)
            if (d.componentNodeId === e.id)
              await a.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), l = figma.createFrame(), e.name && (l.name = e.name);
            else {
              const g = o.get(
                d.componentNodeId
              );
              if (!g) {
                const s = Array.from(o.keys()).slice(
                  0,
                  20
                );
                await a.error(
                  `Component not found for internal instance "${e.name}" (ID: ${d.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), await a.error(
                  `Looking for component ID: ${d.componentNodeId}`
                ), await a.error(
                  `Available IDs in mapping (first 20): ${s.map((v) => v.substring(0, 8) + "...").join(", ")}`
                );
                const m = (v, V) => {
                  if (v.type === "COMPONENT" && v.id === V)
                    return !0;
                  if (v.children && Array.isArray(v.children)) {
                    for (const C of v.children)
                      if (!C._truncated && m(C, V))
                        return !0;
                  }
                  return !1;
                }, b = m(
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
                const $ = s.filter(
                  (v) => v.startsWith(d.componentNodeId.substring(0, 8))
                );
                $.length > 0 && await a.error(
                  `Found IDs with matching prefix: ${$.map((v) => v.substring(0, 8) + "...").join(", ")}`
                );
                const N = `Component not found for internal instance "${e.name}" (ID: ${d.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${s.map((v) => v.substring(0, 8) + "...").join(", ")}`;
                throw new Error(N);
              }
              if (g && g.type === "COMPONENT") {
                if (l = g.createInstance(), await a.log(
                  `✓ Created internal instance "${e.name}" from component "${d.componentName}"`
                ), d.variantProperties && Object.keys(d.variantProperties).length > 0)
                  try {
                    let s = null;
                    if (g.parent && g.parent.type === "COMPONENT_SET")
                      s = g.parent.componentPropertyDefinitions, await a.log(
                        `  DEBUG: Component "${d.componentName}" is inside component set "${g.parent.name}" with ${Object.keys(s || {}).length} property definitions`
                      );
                    else {
                      const m = await l.getMainComponentAsync();
                      if (m) {
                        const b = m.type;
                        await a.log(
                          `  DEBUG: Internal instance "${e.name}" - componentNode parent: ${g.parent ? g.parent.type : "N/A"}, mainComponent type: ${b}, mainComponent parent: ${m.parent ? m.parent.type : "N/A"}`
                        ), b === "COMPONENT_SET" ? s = m.componentPropertyDefinitions : b === "COMPONENT" && m.parent && m.parent.type === "COMPONENT_SET" ? (s = m.parent.componentPropertyDefinitions, await a.log(
                          `  DEBUG: Found component set parent "${m.parent.name}" with ${Object.keys(s || {}).length} property definitions`
                        )) : await a.log(
                          `  Skipping variant properties for internal instance "${e.name}" - component "${d.componentName}" is not yet in a COMPONENT_SET (will be moved later during component set creation)`
                        );
                      }
                    }
                    if (s) {
                      const m = {};
                      for (const [b, $] of Object.entries(
                        d.variantProperties
                      )) {
                        const N = b.split("#")[0];
                        s[N] && (m[N] = $);
                      }
                      Object.keys(m).length > 0 && l.setProperties(m);
                    }
                  } catch (s) {
                    const m = `Failed to set variant properties for instance "${e.name}": ${s}`;
                    throw await a.error(m), new Error(m);
                  }
                if (d.componentProperties && Object.keys(d.componentProperties).length > 0)
                  try {
                    const s = await l.getMainComponentAsync();
                    if (s) {
                      let m = null;
                      const b = s.type;
                      if (b === "COMPONENT_SET" ? m = s.componentPropertyDefinitions : b === "COMPONENT" && s.parent && s.parent.type === "COMPONENT_SET" ? m = s.parent.componentPropertyDefinitions : b === "COMPONENT" && (m = s.componentPropertyDefinitions), m)
                        for (const [$, N] of Object.entries(
                          d.componentProperties
                        )) {
                          const v = $.split("#")[0];
                          if (m[v])
                            try {
                              let V = N;
                              N && typeof N == "object" && "value" in N && (V = N.value), l.setProperties({
                                [v]: V
                              });
                            } catch (V) {
                              const C = `Failed to set component property "${v}" for internal instance "${e.name}": ${V}`;
                              throw await a.error(C), new Error(C);
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
              } else if (!l && g) {
                const s = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${d.componentNodeId.substring(0, 8)}...).`;
                throw await a.error(s), new Error(s);
              }
            }
          else {
            const g = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw await a.error(g), new Error(g);
          }
        else if (d && d.instanceType === "remote")
          if (f) {
            const g = f.get(
              e._instanceRef
            );
            if (g) {
              if (l = g.createInstance(), await a.log(
                `✓ Created remote instance "${e.name}" from component "${d.componentName}" on REMOTES page`
              ), d.variantProperties && Object.keys(d.variantProperties).length > 0)
                try {
                  const s = await l.getMainComponentAsync();
                  if (s) {
                    let m = null;
                    const b = s.type;
                    if (b === "COMPONENT_SET" ? m = s.componentPropertyDefinitions : b === "COMPONENT" && s.parent && s.parent.type === "COMPONENT_SET" ? m = s.parent.componentPropertyDefinitions : await a.log(
                      `Skipping variant properties for remote instance "${e.name}" - main component is not a COMPONENT_SET or variant (expected for remote components)`
                    ), m) {
                      const $ = {};
                      for (const [N, v] of Object.entries(
                        d.variantProperties
                      )) {
                        const V = N.split("#")[0];
                        m[V] && ($[V] = v);
                      }
                      Object.keys($).length > 0 && l.setProperties($);
                    }
                  } else
                    await a.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (s) {
                  const m = `Failed to set variant properties for remote instance "${e.name}": ${s}`;
                  throw await a.error(m), new Error(m);
                }
              if (d.componentProperties && Object.keys(d.componentProperties).length > 0)
                try {
                  const s = await l.getMainComponentAsync();
                  if (s) {
                    let m = null;
                    const b = s.type;
                    if (b === "COMPONENT_SET" ? m = s.componentPropertyDefinitions : b === "COMPONENT" && s.parent && s.parent.type === "COMPONENT_SET" ? m = s.parent.componentPropertyDefinitions : b === "COMPONENT" && (m = s.componentPropertyDefinitions), m)
                      for (const [$, N] of Object.entries(
                        d.componentProperties
                      )) {
                        const v = $.split("#")[0];
                        if (m[v])
                          try {
                            let V = N;
                            N && typeof N == "object" && "value" in N && (V = N.value), l.setProperties({
                              [v]: V
                            });
                          } catch (V) {
                            const C = `Failed to set component property "${v}" for remote instance "${e.name}": ${V}`;
                            throw await a.error(C), new Error(C);
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
            const g = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw await a.error(g), new Error(g);
          }
        else if ((d == null ? void 0 : d.instanceType) === "normal") {
          if (!d.componentPageName) {
            const N = `Normal instance "${e.name}" missing componentPageName. Cannot resolve.`;
            throw await a.error(N), new Error(N);
          }
          await figma.loadAllPagesAsync();
          const g = figma.root.children.find(
            (N) => N.name === d.componentPageName
          );
          if (!g) {
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
            }), l = N;
            break;
          }
          let s = null;
          const m = (N, v, V, C, L) => {
            if (v.length === 0) {
              let J = null;
              for (const M of N.children || [])
                if (M.type === "COMPONENT") {
                  if (M.name === V)
                    if (J || (J = M), C)
                      try {
                        const j = M.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (j && JSON.parse(j).id === C)
                          return M;
                      } catch (j) {
                      }
                    else
                      return M;
                } else if (M.type === "COMPONENT_SET") {
                  if (L && M.name !== L)
                    continue;
                  for (const j of M.children || [])
                    if (j.type === "COMPONENT" && j.name === V)
                      if (J || (J = j), C)
                        try {
                          const W = j.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (W && JSON.parse(W).id === C)
                            return j;
                        } catch (W) {
                        }
                      else
                        return j;
                }
              return J;
            }
            const [K, ...H] = v;
            for (const J of N.children || [])
              if (J.name === K) {
                if (H.length === 0 && J.type === "COMPONENT_SET") {
                  if (L && J.name !== L)
                    continue;
                  for (const M of J.children || [])
                    if (M.type === "COMPONENT" && M.name === V) {
                      if (C)
                        try {
                          const j = M.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (j && JSON.parse(j).id === C)
                            return M;
                        } catch (j) {
                        }
                      return M;
                    }
                  return null;
                }
                return m(
                  J,
                  H,
                  V,
                  C,
                  L
                );
              }
            return null;
          };
          await a.log(
            `  Looking for component "${d.componentName}" on page "${d.componentPageName}"${d.path && d.path.length > 0 ? ` at path [${d.path.join(" → ")}]` : " at page root"}${d.componentGuid ? ` (GUID: ${d.componentGuid.substring(0, 8)}...)` : ""}`
          );
          const b = [], $ = (N, v = 0) => {
            const V = "  ".repeat(v);
            if (N.type === "COMPONENT")
              b.push(`${V}COMPONENT: "${N.name}"`);
            else if (N.type === "COMPONENT_SET") {
              b.push(
                `${V}COMPONENT_SET: "${N.name}"`
              );
              for (const C of N.children || [])
                C.type === "COMPONENT" && b.push(
                  `${V}  └─ COMPONENT: "${C.name}"`
                );
            }
            for (const C of N.children || [])
              $(C, v + 1);
          };
          if ($(g), b.length > 0 ? await a.log(
            `  Available components on page "${d.componentPageName}":
${b.slice(0, 20).join(`
`)}${b.length > 20 ? `
  ... and ${b.length - 20} more` : ""}`
          ) : await a.warning(
            `  No components found on page "${d.componentPageName}"`
          ), s = m(
            g,
            d.path || [],
            d.componentName,
            d.componentGuid,
            d.componentSetName
          ), s && d.componentGuid)
            try {
              const N = s.getPluginData(
                "RecursicaPublishedMetadata"
              );
              if (N) {
                const v = JSON.parse(N);
                v.id !== d.componentGuid ? await a.warning(
                  `  Found component "${d.componentName}" by name but GUID verification failed (expected ${d.componentGuid.substring(0, 8)}..., got ${v.id ? v.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`
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
          if (!s) {
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
            }), l = N;
            break;
          }
          if (l = s.createInstance(), await a.log(
            `  Created normal instance "${e.name}" from component "${d.componentName}" on page "${d.componentPageName}"`
          ), d.variantProperties && Object.keys(d.variantProperties).length > 0)
            try {
              const N = await l.getMainComponentAsync();
              if (N) {
                let v = null;
                const V = N.type;
                if (V === "COMPONENT_SET" ? v = N.componentPropertyDefinitions : V === "COMPONENT" && N.parent && N.parent.type === "COMPONENT_SET" ? v = N.parent.componentPropertyDefinitions : await a.warning(
                  `Cannot set variant properties for normal instance "${e.name}" - main component is not a COMPONENT_SET or variant`
                ), v) {
                  const C = {};
                  for (const [L, K] of Object.entries(
                    d.variantProperties
                  )) {
                    const H = L.split("#")[0];
                    v[H] && (C[H] = K);
                  }
                  Object.keys(C).length > 0 && l.setProperties(C);
                }
              }
            } catch (N) {
              await a.warning(
                `Failed to set variant properties for normal instance "${e.name}": ${N}`
              );
            }
          if (d.componentProperties && Object.keys(d.componentProperties).length > 0)
            try {
              const N = await l.getMainComponentAsync();
              if (N) {
                let v = null;
                const V = N.type;
                if (V === "COMPONENT_SET" ? v = N.componentPropertyDefinitions : V === "COMPONENT" && N.parent && N.parent.type === "COMPONENT_SET" ? v = N.parent.componentPropertyDefinitions : V === "COMPONENT" && (v = N.componentPropertyDefinitions), v) {
                  const C = {};
                  for (const [L, K] of Object.entries(
                    d.componentProperties
                  )) {
                    const H = L.split("#")[0];
                    let J;
                    if (v[L] ? J = L : v[H] ? J = H : J = Object.keys(v).find(
                      (M) => M.split("#")[0] === H
                    ), J) {
                      const M = K && typeof K == "object" && "value" in K ? K.value : K;
                      C[J] = M;
                    } else
                      await a.warning(
                        `Component property "${H}" (from "${L}") does not exist on component "${d.componentName}" for normal instance "${e.name}". Available properties: ${Object.keys(v).join(", ") || "none"}`
                      );
                  }
                  if (Object.keys(C).length > 0)
                    try {
                      await a.log(
                        `  Attempting to set component properties for normal instance "${e.name}": ${Object.keys(C).join(", ")}`
                      ), await a.log(
                        `  Available component properties: ${Object.keys(v).join(", ")}`
                      ), l.setProperties(C), await a.log(
                        `  ✓ Successfully set component properties for normal instance "${e.name}": ${Object.keys(C).join(", ")}`
                      );
                    } catch (L) {
                      await a.warning(
                        `Failed to set component properties for normal instance "${e.name}": ${L}`
                      ), await a.warning(
                        `  Properties attempted: ${JSON.stringify(C)}`
                      ), await a.warning(
                        `  Available properties: ${JSON.stringify(Object.keys(v))}`
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
              l.resize(e.width, e.height);
            } catch (N) {
              await a.log(
                `Note: Could not resize normal instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
              );
            }
        } else {
          const g = `Instance "${e.name}" has unknown or missing instance type: ${(d == null ? void 0 : d.instanceType) || "unknown"}`;
          throw await a.error(g), new Error(g);
        }
      } else {
        const d = `Instance "${e.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        throw await a.error(d), new Error(d);
      }
      break;
    case "GROUP":
      l = figma.createFrame();
      break;
    case "BOOLEAN_OPERATION": {
      const d = `Boolean operation nodes cannot be imported. Found boolean operation: "${e.name}".`;
      throw await a.error(d), new Error(d);
    }
    case "POLYGON":
      l = figma.createPolygon();
      break;
    default: {
      const d = `Unsupported node type: ${e.type}. This node type cannot be imported.`;
      throw await a.error(d), new Error(d);
    }
  }
  if (!l)
    return null;
  e.id && o && (o.set(e.id, l), l.type === "COMPONENT" && await a.log(
    `  Stored COMPONENT "${e.name || "Unnamed"}" in nodeIdMapping (ID: ${e.id.substring(0, 8)}...)`
  )), e._instanceRef !== void 0 && l.type === "INSTANCE" ? (o._instanceTableMap || (o._instanceTableMap = /* @__PURE__ */ new Map()), o._instanceTableMap.set(
    l.id,
    e._instanceRef
  ), await a.log(
    `  Stored instance table mapping: instance "${l.name}" (ID: ${l.id.substring(0, 8)}...) -> instance table index ${e._instanceRef}`
  )) : l.type === "INSTANCE" && await a.log(
    `  WARNING: Instance "${l.name}" (ID: ${l.id.substring(0, 8)}...) has no _instanceRef in nodeData - will use fallback matching in third pass`
  );
  const R = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.paddingLeft || e.boundVariables.paddingRight || e.boundVariables.paddingTop || e.boundVariables.paddingBottom || e.boundVariables.itemSpacing);
  Yt(
    l,
    e.type || "FRAME",
    R
  ), e.name !== void 0 && (l.name = e.name || "Unnamed Node");
  const p = w && w.layoutMode !== void 0 && w.layoutMode !== "NONE", S = t && "layoutMode" in t && t.layoutMode !== "NONE";
  p || S || (e.x !== void 0 && (l.x = e.x), e.y !== void 0 && (l.y = e.y));
  const x = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
  e.type !== "VECTOR" && e.width !== void 0 && e.height !== void 0 && !x && l.resize(e.width, e.height);
  const G = e.boundVariables && typeof e.boundVariables == "object";
  if (e.visible !== void 0 && (l.visible = e.visible), e.locked !== void 0 && (l.locked = e.locked), e.opacity !== void 0 && (!G || !e.boundVariables.opacity) && (l.opacity = e.opacity), e.rotation !== void 0 && (!G || !e.boundVariables.rotation) && (l.rotation = e.rotation), e.blendMode !== void 0 && (!G || !e.boundVariables.blendMode) && (l.blendMode = e.blendMode), e.type !== "INSTANCE") {
    if (e.type === "VECTOR" && e.boundVariables && (await a.log(
      `  DEBUG: VECTOR "${e.name || "Unnamed"}" (ID: ${((y = e.id) == null ? void 0 : y.substring(0, 8)) || "unknown"}...) has boundVariables: ${Object.keys(e.boundVariables).join(", ")}`
    ), e.boundVariables.fills && await a.log(
      `  DEBUG:   boundVariables.fills: ${JSON.stringify(e.boundVariables.fills)}`
    )), e.fills !== void 0)
      try {
        let d = e.fills;
        if (Array.isArray(d) && (d = d.map((g) => {
          if (g && typeof g == "object") {
            const s = z({}, g);
            return delete s.boundVariables, s;
          }
          return g;
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
          const g = [];
          for (let s = 0; s < d.length; s++) {
            const m = d[s], b = e.fills[s];
            if (!b || typeof b != "object") {
              g.push(m);
              continue;
            }
            const $ = b.boundVariables || b.bndVar;
            if (!$) {
              g.push(m);
              continue;
            }
            const N = z({}, m);
            N.boundVariables = {};
            for (const [v, V] of Object.entries($))
              if (e.type === "VECTOR" && await a.log(
                `  DEBUG: Processing fill[${s}].${v} on VECTOR "${l.name || "Unnamed"}": varInfo=${JSON.stringify(V)}`
              ), ne(V)) {
                const C = V._varRef;
                if (C !== void 0) {
                  if (e.type === "VECTOR") {
                    await a.log(
                      `  DEBUG: Looking up variable reference ${C} in recognizedVariables (map has ${c.size} entries)`
                    );
                    const K = Array.from(
                      c.keys()
                    ).slice(0, 10);
                    await a.log(
                      `  DEBUG: Available variable references (first 10): ${K.join(", ")}`
                    );
                    const H = c.has(String(C));
                    if (await a.log(
                      `  DEBUG: Variable reference ${C} ${H ? "found" : "NOT FOUND"} in recognizedVariables`
                    ), !H) {
                      const J = Array.from(
                        c.keys()
                      ).sort((M, j) => parseInt(M) - parseInt(j));
                      await a.log(
                        `  DEBUG: All available variable references: ${J.join(", ")}`
                      );
                    }
                  }
                  let L = c.get(String(C));
                  L || (e.type === "VECTOR" && await a.log(
                    `  DEBUG: Variable ${C} not in recognizedVariables. variableTable=${!!n}, collectionTable=${!!i}, recognizedCollections=${!!E}`
                  ), n && i && E ? (await a.log(
                    `  Variable reference ${C} not in recognizedVariables, attempting to resolve from variable table...`
                  ), L = await Ht(
                    C,
                    n,
                    i,
                    E
                  ) || void 0, L ? (c.set(String(C), L), await a.log(
                    `  ✓ Resolved variable ${L.name} from variable table and added to recognizedVariables`
                  )) : await a.warning(
                    `  Failed to resolve variable ${C} from variable table`
                  )) : e.type === "VECTOR" && await a.warning(
                    `  Cannot resolve variable ${C} from table - missing required parameters`
                  )), L ? (N.boundVariables[v] = {
                    type: "VARIABLE_ALIAS",
                    id: L.id
                  }, await a.log(
                    `  ✓ Restored bound variable for fill[${s}].${v} on "${l.name || "Unnamed"}" (${e.type}): variable ${L.name} (ID: ${L.id.substring(0, 8)}...)`
                  )) : await a.warning(
                    `  Variable reference ${C} not found in recognizedVariables for fill[${s}].${v} on "${l.name || "Unnamed"}"`
                  );
                } else
                  e.type === "VECTOR" && await a.warning(
                    `  DEBUG: Variable reference ${C} is undefined for fill[${s}].${v} on VECTOR "${l.name || "Unnamed"}"`
                  );
              } else
                e.type === "VECTOR" && await a.warning(
                  `  DEBUG: fill[${s}].${v} on VECTOR "${l.name || "Unnamed"}" is not a variable reference: ${JSON.stringify(V)}`
                );
            g.push(N);
          }
          l.fills = g, await a.log(
            `  ✓ Set fills with boundVariables on "${l.name || "Unnamed"}" (${e.type})`
          );
        } else
          l.fills = d;
        e.boundVariables && Object.keys(e.boundVariables).length > 0 && !e.boundVariables.fills && await a.log(
          `  Node "${l.name || "Unnamed"}" (${e.type}) has boundVariables but not for fills: ${Object.keys(e.boundVariables).join(", ")}`
        );
      } catch (d) {
        console.log("Error setting fills:", d);
      }
    else if (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "GROUP")
      try {
        l.fills = [];
      } catch (d) {
        console.log("Error clearing fills:", d);
      }
  }
  if (e.strokes !== void 0)
    try {
      e.strokes.length > 0 ? l.strokes = e.strokes : l.strokes = [];
    } catch (d) {
      console.log("Error setting strokes:", d);
    }
  else if (e.type === "VECTOR")
    try {
      l.strokes = [];
    } catch (d) {
    }
  const B = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.strokeWeight || e.boundVariables.strokeAlign);
  e.strokeWeight !== void 0 ? (!B || !e.boundVariables.strokeWeight) && (l.strokeWeight = e.strokeWeight) : e.type === "VECTOR" && (e.strokes === void 0 || e.strokes.length === 0) && (!B || !e.boundVariables.strokeWeight) && (l.strokeWeight = 0), e.strokeAlign !== void 0 && (!B || !e.boundVariables.strokeAlign) && (l.strokeAlign = e.strokeAlign);
  const O = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.cornerRadius || e.boundVariables.topLeftRadius || e.boundVariables.topRightRadius || e.boundVariables.bottomLeftRadius || e.boundVariables.bottomRightRadius);
  if (e.cornerRadius !== void 0 && (!O || !e.boundVariables.cornerRadius) && (l.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (l.effects = e.effects), e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") {
    if (e.layoutMode !== void 0 && (l.layoutMode = e.layoutMode), e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.boundVariables && c) {
      const g = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ];
      for (const s of g) {
        const m = e.boundVariables[s];
        if (m && ne(m)) {
          const b = m._varRef;
          if (b !== void 0) {
            const $ = c.get(String(b));
            if ($) {
              const N = {
                type: "VARIABLE_ALIAS",
                id: $.id
              };
              l.boundVariables || (l.boundVariables = {});
              const v = l[s], V = (A = l.boundVariables) == null ? void 0 : A[s];
              await a.log(
                `  DEBUG: Attempting to set bound variable for ${s} on "${e.name || "Unnamed"}": current value=${v}, current boundVar=${JSON.stringify(V)}`
              );
              try {
                delete l.boundVariables[s];
              } catch (L) {
              }
              try {
                l.boundVariables[s] = N;
                const L = (T = l.boundVariables) == null ? void 0 : T[s];
                await a.log(
                  `  DEBUG: Immediately after setting ${s} bound variable: ${JSON.stringify(L)}`
                );
              } catch (L) {
                await a.warning(
                  `  Error setting bound variable for ${s}: ${L}`
                );
              }
              const C = (U = l.boundVariables) == null ? void 0 : U[s];
              C && typeof C == "object" && C.type === "VARIABLE_ALIAS" && C.id === $.id ? await a.log(
                `  ✓ Set bound variable for ${s} on "${e.name || "Unnamed"}" (${e.type}): variable ${$.name} (ID: ${$.id.substring(0, 8)}...)`
              ) : await a.warning(
                `  Failed to set bound variable for ${s} on "${e.name || "Unnamed"}" - verification failed. Expected: ${JSON.stringify(N)}, Got: ${JSON.stringify(C)}`
              );
            }
          }
        }
      }
    }
    e.layoutWrap !== void 0 && (l.layoutWrap = e.layoutWrap), e.primaryAxisSizingMode !== void 0 ? l.primaryAxisSizingMode = e.primaryAxisSizingMode : l.primaryAxisSizingMode = "AUTO", e.counterAxisSizingMode !== void 0 ? l.counterAxisSizingMode = e.counterAxisSizingMode : l.counterAxisSizingMode = "AUTO", e.primaryAxisAlignItems !== void 0 && (l.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (l.counterAxisAlignItems = e.counterAxisAlignItems);
    const d = e.boundVariables && typeof e.boundVariables == "object";
    if (d) {
      const g = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ].filter((s) => e.boundVariables[s]);
      g.length > 0 && await a.log(
        `  DEBUG: Node "${e.name || "Unnamed"}" (${e.type}) has bound variables for: ${g.join(", ")}`
      );
    }
    e.paddingLeft !== void 0 && (!d || !e.boundVariables.paddingLeft) && (l.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (!d || !e.boundVariables.paddingRight) && (l.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (!d || !e.boundVariables.paddingTop) && (l.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (!d || !e.boundVariables.paddingBottom) && (l.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (!d || !e.boundVariables.itemSpacing) && (l.itemSpacing = e.itemSpacing), e.layoutGrow !== void 0 && (l.layoutGrow = e.layoutGrow);
  }
  if ((e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (l.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (l.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (l.dashPattern = e.dashPattern), e.type === "VECTOR")) {
    if (e.fillGeometry !== void 0)
      try {
        const { normalizeSvgPath: g } = await Promise.resolve().then(() => Mt), s = e.fillGeometry.map((m) => {
          const b = m.data;
          return {
            data: g(b),
            windingRule: m.windingRule || m.windRule || "NONZERO"
          };
        });
        for (let m = 0; m < e.fillGeometry.length; m++) {
          const b = e.fillGeometry[m].data, $ = s[m].data;
          b !== $ && await a.log(
            `  Normalized path ${m + 1} for "${e.name || "Unnamed"}": ${b.substring(0, 50)}... -> ${$.substring(0, 50)}...`
          );
        }
        l.vectorPaths = s, await a.log(
          `  Set vectorPaths for VECTOR "${e.name || "Unnamed"}" (${s.length} path(s))`
        );
      } catch (g) {
        await a.warning(
          `Error setting vectorPaths for VECTOR "${e.name || "Unnamed"}": ${g}`
        );
      }
    if (e.strokeGeometry !== void 0)
      try {
        l.strokeGeometry = e.strokeGeometry;
      } catch (g) {
        await a.warning(
          `Error setting strokeGeometry for VECTOR "${e.name || "Unnamed"}": ${g}`
        );
      }
    const d = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
    if (e.width !== void 0 && e.height !== void 0 && !d)
      try {
        l.resize(e.width, e.height), await a.log(
          `  Set size for VECTOR "${e.name || "Unnamed"}" to ${e.width}x${e.height}`
        );
      } catch (g) {
        await a.warning(
          `Error setting size for VECTOR "${e.name || "Unnamed"}": ${g}`
        );
      }
  }
  if (e.type === "TEXT" && e.characters !== void 0)
    try {
      if (e.fontName)
        try {
          await figma.loadFontAsync(e.fontName), l.fontName = e.fontName;
        } catch (g) {
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
      const d = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.fontSize || e.boundVariables.letterSpacing || e.boundVariables.lineHeight);
      e.fontSize !== void 0 && (!d || !e.boundVariables.fontSize) && (l.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (l.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (l.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (!d || !e.boundVariables.letterSpacing) && (l.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (!d || !e.boundVariables.lineHeight) && (l.lineHeight = e.lineHeight), e.textCase !== void 0 && (l.textCase = e.textCase), e.textDecoration !== void 0 && (l.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (l.textAutoResize = e.textAutoResize);
    } catch (d) {
      console.log("Error setting text properties: " + d);
      try {
        l.characters = e.characters;
      } catch (g) {
        console.log("Could not set text characters: " + g);
      }
    }
  if (e.boundVariables && c) {
    const d = [
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "paddingBottom",
      "itemSpacing"
    ];
    for (const [g, s] of Object.entries(
      e.boundVariables
    ))
      if (g !== "fills" && !d.includes(g) && ne(s) && n && c) {
        const m = s._varRef;
        if (m !== void 0) {
          const b = c.get(String(m));
          if (b)
            try {
              const $ = {
                type: "VARIABLE_ALIAS",
                id: b.id
              };
              l.boundVariables || (l.boundVariables = {});
              const N = l[g];
              N !== void 0 && l.boundVariables[g] === void 0 && await a.warning(
                `  Property ${g} has direct value ${N} which may prevent bound variable from being set`
              ), l.boundVariables[g] = $;
              const V = (k = l.boundVariables) == null ? void 0 : k[g];
              if (V && typeof V == "object" && V.type === "VARIABLE_ALIAS" && V.id === b.id)
                await a.log(
                  `  ✓ Set bound variable for ${g} on "${e.name || "Unnamed"}" (${e.type}): variable ${b.name} (ID: ${b.id.substring(0, 8)}...)`
                );
              else {
                const C = (_ = l.boundVariables) == null ? void 0 : _[g];
                await a.warning(
                  `  Failed to set bound variable for ${g} on "${e.name || "Unnamed"}" - bound variable not persisted. Property value: ${N}, Expected: ${JSON.stringify($)}, Got: ${JSON.stringify(C)}`
                );
              }
            } catch ($) {
              await a.warning(
                `  Error setting bound variable for ${g} on "${e.name || "Unnamed"}": ${$}`
              );
            }
          else
            await a.warning(
              `  Variable reference ${m} not found in recognizedVariables for ${g} on "${e.name || "Unnamed"}"`
            );
        }
      }
  }
  if (e.boundVariables && c && (e.boundVariables.width || e.boundVariables.height)) {
    const d = e.boundVariables.width, g = e.boundVariables.height;
    if (d && ne(d)) {
      const s = d._varRef;
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
    if (g && ne(g)) {
      const s = g._varRef;
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
  const P = e.id && o && o.has(e.id) && l.type === "COMPONENT" && l.children && l.children.length > 0;
  if (e.children && Array.isArray(e.children) && l.type !== "INSTANCE" && !P) {
    const d = (s) => {
      const m = [];
      for (const b of s)
        b._truncated || (b.type === "COMPONENT" ? (m.push(b), b.children && Array.isArray(b.children) && m.push(...d(b.children))) : b.children && Array.isArray(b.children) && m.push(...d(b.children)));
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
    const g = d(e.children);
    await a.log(
      `  First pass: Creating ${g.length} COMPONENT node(s) (without children)...`
    );
    for (const s of g)
      await a.log(
        `  Collected COMPONENT "${s.name || "Unnamed"}" (ID: ${s.id ? s.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const s of g)
      if (s.id && o && !o.has(s.id)) {
        const m = figma.createComponent();
        if (s.name !== void 0 && (m.name = s.name || "Unnamed Node"), s.componentPropertyDefinitions) {
          const b = s.componentPropertyDefinitions;
          let $ = 0, N = 0;
          for (const [v, V] of Object.entries(b))
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
              }[V.type];
              if (!L) {
                await a.warning(
                  `  Unknown property type ${V.type} for property "${v}" in component "${s.name || "Unnamed"}"`
                ), N++;
                continue;
              }
              const K = V.defaultValue, H = v.split("#")[0];
              m.addComponentProperty(
                H,
                L,
                K
              ), $++;
            } catch (C) {
              await a.warning(
                `  Failed to add component property "${v}" to "${s.name || "Unnamed"}" in first pass: ${C}`
              ), N++;
            }
          $ > 0 && await a.log(
            `  Added ${$} component property definition(s) to "${s.name || "Unnamed"}" in first pass${N > 0 ? ` (${N} failed)` : ""}`
          );
        }
        o.set(s.id, m), await a.log(
          `  Created COMPONENT "${s.name || "Unnamed"}" (ID: ${s.id.substring(0, 8)}...) in first pass`
        );
      }
    for (const s of e.children) {
      if (s._truncated)
        continue;
      const m = await ce(
        s,
        l,
        n,
        i,
        r,
        c,
        o,
        u,
        f,
        null,
        // deferredInstances - not needed for remote structures
        e,
        // parentNodeData - pass the parent's nodeData so children can check for auto-layout
        E
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
      } catch (d) {
        await a.warning(
          `Failed to remove node "${l.name || "Unnamed"}" from parent "${l.parent.name || "Unnamed"}": ${d}`
        );
      }
    t.appendChild(l);
  }
  return l;
}
async function Xt(e, t, n) {
  let i = 0, r = 0, c = 0;
  const o = (f) => {
    const h = [];
    if (f.type === "INSTANCE" && h.push(f), "children" in f && f.children)
      for (const w of f.children)
        h.push(...o(w));
    return h;
  }, u = o(e);
  await a.log(
    `  Found ${u.length} instance(s) to process for variant properties`
  );
  for (const f of u)
    try {
      const h = await f.getMainComponentAsync();
      if (!h) {
        r++;
        continue;
      }
      const w = t.getSerializedTable();
      let E = null, l;
      if (n._instanceTableMap ? (l = n._instanceTableMap.get(
        f.id
      ), l !== void 0 ? (E = w[l], await a.log(
        `  Found instance table index ${l} for instance "${f.name}" (ID: ${f.id.substring(0, 8)}...)`
      )) : await a.log(
        `  No instance table index mapping found for instance "${f.name}" (ID: ${f.id.substring(0, 8)}...), using fallback matching`
      )) : await a.log(
        `  No instance table map found, using fallback matching for instance "${f.name}"`
      ), !E) {
        for (const [p, S] of Object.entries(w))
          if (S.instanceType === "internal" && S.componentNodeId && n.has(S.componentNodeId)) {
            const I = n.get(S.componentNodeId);
            if (I && I.id === h.id) {
              E = S, await a.log(
                `  Matched instance "${f.name}" to instance table entry ${p} by component (less precise)`
              );
              break;
            }
          }
      }
      if (!E) {
        await a.log(
          `  No matching entry found for instance "${f.name}" (main component: ${h.name}, ID: ${h.id.substring(0, 8)}...)`
        ), r++;
        continue;
      }
      if (!E.variantProperties) {
        await a.log(
          `  Instance table entry for "${f.name}" has no variant properties`
        ), r++;
        continue;
      }
      await a.log(
        `  Instance "${f.name}" matched to entry with variant properties: ${JSON.stringify(E.variantProperties)}`
      );
      let R = null;
      if (h.parent && h.parent.type === "COMPONENT_SET" && (R = h.parent.componentPropertyDefinitions), R) {
        const p = {};
        for (const [S, I] of Object.entries(
          E.variantProperties
        )) {
          const x = S.split("#")[0];
          R[x] && (p[x] = I);
        }
        Object.keys(p).length > 0 ? (f.setProperties(p), i++, await a.log(
          `  ✓ Set variant properties on instance "${f.name}": ${JSON.stringify(p)}`
        )) : r++;
      } else
        r++;
    } catch (h) {
      c++, await a.warning(
        `  Failed to set variant properties on instance "${f.name}": ${h}`
      );
    }
  await a.log(
    `  Variant properties set: ${i} processed, ${r} skipped, ${c} errors`
  );
}
async function ze(e) {
  await figma.loadAllPagesAsync();
  const t = figma.root.children, n = new Set(t.map((c) => c.name));
  if (!n.has(e))
    return e;
  let i = 1, r = `${e}_${i}`;
  for (; n.has(r); )
    i++, r = `${e}_${i}`;
  return r;
}
async function Zt(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), n = new Set(t.map((c) => c.name));
  if (!n.has(e))
    return e;
  let i = 1, r = `${e}_${i}`;
  for (; n.has(r); )
    i++, r = `${e}_${i}`;
  return r;
}
async function Qt(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const c of e.variableIds)
    try {
      const o = await figma.variables.getVariableByIdAsync(c);
      o && n.add(o.name);
    } catch (o) {
      continue;
    }
  if (!n.has(t))
    return t;
  let i = 1, r = `${t}_${i}`;
  for (; n.has(r); )
    i++, r = `${t}_${i}`;
  return r;
}
function De(e, t) {
  const n = e.resolvedType.toUpperCase(), i = t.toUpperCase();
  return n === i;
}
async function Dt(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), n = ae(e.collectionName);
  if (ie(e.collectionName)) {
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
        ee
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
function en(e) {
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
function et(e) {
  if (!e.stringTable)
    return {
      success: !1,
      error: "Invalid JSON format. String table is required."
    };
  let t;
  try {
    t = $e.fromTable(e.stringTable);
  } catch (i) {
    return {
      success: !1,
      error: `Failed to load string table: ${i instanceof Error ? i.message : "Unknown error"}`
    };
  }
  const n = jt(e, t);
  return {
    success: !0,
    stringTable: t,
    expandedJsonData: n
  };
}
function tn(e) {
  if (!e.collections)
    return {
      success: !1,
      error: "No collections table found in JSON"
    };
  try {
    return {
      success: !0,
      collectionTable: we.fromTable(
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
async function nn(e) {
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), r = e.getTable();
  for (const [c, o] of Object.entries(r)) {
    if (o.isLocal === !1) {
      await a.log(
        `Skipping remote collection: "${o.collectionName}" (index ${c})`
      );
      continue;
    }
    const u = await Dt(o);
    u.matchType === "recognized" ? (await a.log(
      `✓ Recognized collection by GUID: "${o.collectionName}" (index ${c})`
    ), t.set(c, u.collection)) : u.matchType === "potential" ? (await a.log(
      `? Potential match by name: "${o.collectionName}" (index ${c})`
    ), n.set(c, {
      entry: o,
      collection: u.collection
    })) : (await a.log(
      `✗ No match found for collection: "${o.collectionName}" (index ${c}) - will create new`
    ), i.set(c, o));
  }
  return await a.log(
    `Collection matching complete: ${t.size} recognized, ${n.size} potential matches, ${i.size} to create`
  ), {
    recognizedCollections: t,
    potentialMatches: n,
    collectionsToCreate: i
  };
}
async function an(e, t, n) {
  if (e.size !== 0) {
    await a.log(
      `Prompting user for ${e.size} potential match(es)...`
    );
    for (const [i, { entry: r, collection: c }] of e.entries())
      try {
        const o = ie(r.collectionName) ? ae(r.collectionName) : c.name, u = `Found existing "${o}" variable collection. Should I use it?`;
        await a.log(
          `Prompting user about potential match: "${o}"`
        ), await se.prompt(u, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await a.log(
          `✓ User confirmed: Using existing collection "${o}" (index ${i})`
        ), t.set(i, c), await pe(c, r.modes), await a.log(
          `  ✓ Ensured modes for collection "${o}" (${r.modes.length} mode(s))`
        );
      } catch (o) {
        await a.log(
          `✗ User rejected: Will create new collection for "${r.collectionName}" (index ${i})`
        ), n.set(i, r);
      }
  }
}
async function rn(e, t, n) {
  if (e.size === 0)
    return;
  await a.log("Ensuring modes exist for recognized collections...");
  const i = t.getTable();
  for (const [r, c] of e.entries()) {
    const o = i[r];
    o && (n.has(r) || (await pe(c, o.modes), await a.log(
      `  ✓ Ensured modes for collection "${c.name}" (${o.modes.length} mode(s))`
    )));
  }
}
async function on(e, t, n) {
  if (e.size !== 0) {
    await a.log(
      `Creating ${e.size} new collection(s)...`
    );
    for (const [i, r] of e.entries()) {
      const c = ae(r.collectionName), o = await Zt(c);
      o !== c ? await a.log(
        `Creating collection: "${o}" (normalized: "${c}" - name conflict resolved)`
      ) : await a.log(`Creating collection: "${o}"`);
      const u = figma.variables.createVariableCollection(o);
      n.push(u);
      let f;
      if (ie(r.collectionName)) {
        const h = xe(r.collectionName);
        h && (f = h);
      } else r.collectionGuid && (f = r.collectionGuid);
      f && (u.setSharedPluginData(
        "recursica",
        ee,
        f
      ), await a.log(
        `  Stored GUID: ${f.substring(0, 8)}...`
      )), await pe(u, r.modes), await a.log(
        `  ✓ Created collection "${o}" with ${r.modes.length} mode(s)`
      ), t.set(i, u);
    }
    await a.log("Collection creation complete");
  }
}
function sn(e) {
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
async function cn(e, t, n, i) {
  const r = /* @__PURE__ */ new Map(), c = [], o = new Set(
    i.map((h) => h.id)
  );
  await a.log("Matching and creating variables in collections...");
  const u = e.getTable(), f = /* @__PURE__ */ new Map();
  for (const [h, w] of Object.entries(u)) {
    if (w._colRef === void 0)
      continue;
    const E = n.get(String(w._colRef));
    if (!E)
      continue;
    f.has(E.id) || f.set(E.id, {
      collectionName: E.name,
      existing: 0,
      created: 0
    });
    const l = f.get(E.id), R = o.has(
      E.id
    );
    let p;
    typeof w.variableType == "number" ? p = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[w.variableType] || String(w.variableType) : p = w.variableType;
    const S = await _e(
      E,
      w.variableName
    );
    if (S)
      if (De(S, p))
        r.set(h, S), l.existing++;
      else {
        await a.warning(
          `Type mismatch for variable "${w.variableName}" in collection "${E.name}": expected ${p}, found ${S.resolvedType}. Creating new variable with incremented name.`
        );
        const I = await Qt(
          E,
          w.variableName
        ), x = await Me(
          Z(z({}, w), {
            variableName: I,
            variableType: p
          }),
          E,
          e,
          t
        );
        R || c.push(x), r.set(h, x), l.created++;
      }
    else {
      const I = await Me(
        Z(z({}, w), {
          variableType: p
        }),
        E,
        e,
        t
      );
      R || c.push(I), r.set(h, I), l.created++;
    }
  }
  await a.log("Variable processing complete:");
  for (const h of f.values())
    await a.log(
      `  "${h.collectionName}": ${h.existing} existing, ${h.created} created`
    );
  return {
    recognizedVariables: r,
    newlyCreatedVariables: c
  };
}
function ln(e) {
  if (!e.instances)
    return null;
  try {
    return ue.fromTable(e.instances);
  } catch (t) {
    return null;
  }
}
function dn(e) {
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
function Be(e) {
  if (!e || typeof e != "object")
    return;
  e.type !== void 0 && (e.type = dn(e.type));
  const t = e.children !== void 0 ? "children" : e.child !== void 0 ? "child" : null;
  if (t && (t === "child" && !e.children && (e.children = e.child, delete e.child), Array.isArray(e.children)))
    for (const n of e.children)
      Be(n);
  e.fillG !== void 0 && e.fillGeometry === void 0 && (e.fillGeometry = e.fillG, delete e.fillG), e.strkG !== void 0 && e.strokeGeometry === void 0 && (e.strokeGeometry = e.strkG, delete e.strkG), e.child && !e.children && (e.children = e.child, delete e.child);
}
async function pn(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const c of e.children)
    (c.type === "FRAME" || c.type === "COMPONENT") && n.add(c.name);
  if (!n.has(t))
    return t;
  let i = 1, r = `${t}_${i}`;
  for (; n.has(r); )
    i++, r = `${t}_${i}`;
  return r;
}
async function un(e, t, n, i, r) {
  var l;
  const c = e.getSerializedTable(), o = Object.values(c).filter(
    (R) => R.instanceType === "remote"
  ), u = /* @__PURE__ */ new Map();
  if (o.length === 0)
    return await a.log("No remote instances found"), u;
  await a.log(
    `Processing ${o.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  let h = figma.root.children.find((R) => R.name === "REMOTES");
  if (h ? await a.log("Found existing REMOTES page") : (h = figma.createPage(), h.name = "REMOTES", await a.log("Created REMOTES page")), !h.children.some(
    (R) => R.type === "FRAME" && R.name === "Title"
  )) {
    const R = { family: "Inter", style: "Bold" }, p = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(R), await figma.loadFontAsync(p);
    const S = figma.createFrame();
    S.name = "Title", S.layoutMode = "VERTICAL", S.paddingTop = 20, S.paddingBottom = 20, S.paddingLeft = 20, S.paddingRight = 20, S.fills = [];
    const I = figma.createText();
    I.fontName = R, I.characters = "REMOTE INSTANCES", I.fontSize = 24, I.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], S.appendChild(I);
    const x = figma.createText();
    x.fontName = p, x.characters = "These are remotely connected component instances found in our different component pages.", x.fontSize = 14, x.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], S.appendChild(x), h.appendChild(S), await a.log("Created title and description on REMOTES page");
  }
  const E = /* @__PURE__ */ new Map();
  for (const [R, p] of Object.entries(c)) {
    if (p.instanceType !== "remote")
      continue;
    const S = parseInt(R, 10);
    if (await a.log(
      `Processing remote instance ${S}: "${p.componentName}"`
    ), !p.structure) {
      await a.warning(
        `Remote instance "${p.componentName}" missing structure data, skipping`
      );
      continue;
    }
    Be(p.structure);
    const I = p.structure.children !== void 0, x = p.structure.child !== void 0, G = p.structure.children ? p.structure.children.length : p.structure.child ? p.structure.child.length : 0;
    await a.log(
      `  Structure type: ${p.structure.type || "unknown"}, has children: ${G} (children key: ${I}, child key: ${x})`
    );
    let B = p.componentName;
    if (p.path && p.path.length > 0) {
      const P = p.path.filter((y) => y !== "").join(" / ");
      P && (B = `${P} / ${p.componentName}`);
    }
    const O = await pn(
      h,
      B
    );
    O !== B && await a.log(
      `Component name conflict: "${B}" -> "${O}"`
    );
    try {
      if (p.structure.type !== "COMPONENT") {
        await a.warning(
          `Remote instance "${p.componentName}" structure is not a COMPONENT (type: ${p.structure.type}), creating frame fallback`
        );
        const y = figma.createFrame();
        y.name = O;
        const A = await ce(
          p.structure,
          y,
          t,
          n,
          null,
          i,
          E,
          !0,
          // isRemoteStructure: true
          null,
          // remoteComponentMap - not needed here
          null,
          // deferredInstances - not needed for remote instances
          null,
          // parentNodeData - not available for remote structures
          r
        );
        A ? (y.appendChild(A), h.appendChild(y), await a.log(
          `✓ Created remote instance frame fallback: "${O}"`
        )) : y.remove();
        continue;
      }
      const P = figma.createComponent();
      P.name = O, h.appendChild(P), await a.log(
        `  Created component node: "${O}"`
      );
      try {
        if (p.structure.componentPropertyDefinitions) {
          const d = p.structure.componentPropertyDefinitions;
          let g = 0, s = 0;
          for (const [m, b] of Object.entries(d))
            try {
              const N = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[b.type];
              if (!N) {
                await a.warning(
                  `  Unknown property type ${b.type} for property "${m}" in component "${p.componentName}"`
                ), s++;
                continue;
              }
              const v = b.defaultValue, V = m.split("#")[0];
              P.addComponentProperty(
                V,
                N,
                v
              ), g++;
            } catch ($) {
              await a.warning(
                `  Failed to add component property "${m}" to "${p.componentName}": ${$}`
              ), s++;
            }
          g > 0 && await a.log(
            `  Added ${g} component property definition(s) to "${p.componentName}"${s > 0 ? ` (${s} failed)` : ""}`
          );
        }
        p.structure.name !== void 0 && (P.name = p.structure.name);
        const y = p.structure.boundVariables && typeof p.structure.boundVariables == "object" && (p.structure.boundVariables.width || p.structure.boundVariables.height);
        p.structure.width !== void 0 && p.structure.height !== void 0 && !y && P.resize(p.structure.width, p.structure.height), p.structure.x !== void 0 && (P.x = p.structure.x), p.structure.y !== void 0 && (P.y = p.structure.y);
        const A = p.structure.boundVariables && typeof p.structure.boundVariables == "object";
        if (p.structure.visible !== void 0 && (P.visible = p.structure.visible), p.structure.opacity !== void 0 && (!A || !p.structure.boundVariables.opacity) && (P.opacity = p.structure.opacity), p.structure.rotation !== void 0 && (!A || !p.structure.boundVariables.rotation) && (P.rotation = p.structure.rotation), p.structure.blendMode !== void 0 && (!A || !p.structure.boundVariables.blendMode) && (P.blendMode = p.structure.blendMode), p.structure.fills !== void 0)
          try {
            let d = p.structure.fills;
            Array.isArray(d) && (d = d.map((g) => {
              if (g && typeof g == "object") {
                const s = z({}, g);
                return delete s.boundVariables, s;
              }
              return g;
            })), P.fills = d, (l = p.structure.boundVariables) != null && l.fills && i && await qt(
              P,
              p.structure.boundVariables,
              "fills",
              i
            );
          } catch (d) {
            await a.warning(
              `Error setting fills for remote component "${p.componentName}": ${d}`
            );
          }
        if (p.structure.strokes !== void 0)
          try {
            P.strokes = p.structure.strokes;
          } catch (d) {
            await a.warning(
              `Error setting strokes for remote component "${p.componentName}": ${d}`
            );
          }
        const T = p.structure.boundVariables && typeof p.structure.boundVariables == "object" && (p.structure.boundVariables.strokeWeight || p.structure.boundVariables.strokeAlign);
        p.structure.strokeWeight !== void 0 && (!T || !p.structure.boundVariables.strokeWeight) && (P.strokeWeight = p.structure.strokeWeight), p.structure.strokeAlign !== void 0 && (!T || !p.structure.boundVariables.strokeAlign) && (P.strokeAlign = p.structure.strokeAlign), p.structure.layoutMode !== void 0 && (P.layoutMode = p.structure.layoutMode), p.structure.primaryAxisSizingMode !== void 0 && (P.primaryAxisSizingMode = p.structure.primaryAxisSizingMode), p.structure.counterAxisSizingMode !== void 0 && (P.counterAxisSizingMode = p.structure.counterAxisSizingMode);
        const U = p.structure.boundVariables && typeof p.structure.boundVariables == "object";
        p.structure.paddingLeft !== void 0 && (!U || !p.structure.boundVariables.paddingLeft) && (P.paddingLeft = p.structure.paddingLeft), p.structure.paddingRight !== void 0 && (!U || !p.structure.boundVariables.paddingRight) && (P.paddingRight = p.structure.paddingRight), p.structure.paddingTop !== void 0 && (!U || !p.structure.boundVariables.paddingTop) && (P.paddingTop = p.structure.paddingTop), p.structure.paddingBottom !== void 0 && (!U || !p.structure.boundVariables.paddingBottom) && (P.paddingBottom = p.structure.paddingBottom), p.structure.itemSpacing !== void 0 && (!U || !p.structure.boundVariables.itemSpacing) && (P.itemSpacing = p.structure.itemSpacing);
        const k = p.structure.boundVariables && typeof p.structure.boundVariables == "object" && (p.structure.boundVariables.cornerRadius || p.structure.boundVariables.topLeftRadius || p.structure.boundVariables.topRightRadius || p.structure.boundVariables.bottomLeftRadius || p.structure.boundVariables.bottomRightRadius);
        if (p.structure.cornerRadius !== void 0 && (!k || !p.structure.boundVariables.cornerRadius) && (P.cornerRadius = p.structure.cornerRadius), p.structure.boundVariables && i) {
          const d = p.structure.boundVariables, g = [
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
          for (const s of g)
            if (d[s] && ne(d[s])) {
              const m = d[s]._varRef;
              if (m !== void 0) {
                const b = i.get(String(m));
                if (b) {
                  const $ = {
                    type: "VARIABLE_ALIAS",
                    id: b.id
                  };
                  P.boundVariables || (P.boundVariables = {}), P.boundVariables[s] = $;
                }
              }
            }
        }
        await a.log(
          `  DEBUG: Structure keys: ${Object.keys(p.structure).join(", ")}, has children: ${!!p.structure.children}, has child: ${!!p.structure.child}`
        );
        const _ = p.structure.children || (p.structure.child ? p.structure.child : null);
        if (await a.log(
          `  DEBUG: childrenArray exists: ${!!_}, isArray: ${Array.isArray(_)}, length: ${_ ? _.length : 0}`
        ), _ && Array.isArray(_) && _.length > 0) {
          await a.log(
            `  Recreating ${_.length} child(ren) for component "${p.componentName}"`
          );
          for (let d = 0; d < _.length; d++) {
            const g = _[d];
            if (await a.log(
              `  DEBUG: Processing child ${d + 1}/${_.length}: ${JSON.stringify({ name: g == null ? void 0 : g.name, type: g == null ? void 0 : g.type, hasTruncated: !!(g != null && g._truncated) })}`
            ), g._truncated) {
              await a.log(
                `  Skipping truncated child: ${g._reason || "Unknown"}`
              );
              continue;
            }
            await a.log(
              `  Recreating child: "${g.name || "Unnamed"}" (type: ${g.type})`
            );
            const s = await ce(
              g,
              P,
              t,
              n,
              null,
              i,
              E,
              !0,
              // isRemoteStructure: true
              null,
              // remoteComponentMap - not needed here
              null,
              // deferredInstances - not needed for remote instances
              p.structure,
              // parentNodeData - pass the component's structure so children can check for auto-layout
              r
            );
            s ? (P.appendChild(s), await a.log(
              `  ✓ Appended child "${g.name || "Unnamed"}" to component "${p.componentName}"`
            )) : await a.warning(
              `  ✗ Failed to create child "${g.name || "Unnamed"}" (type: ${g.type})`
            );
          }
        }
        u.set(S, P), await a.log(
          `✓ Created remote component: "${O}" (index ${S})`
        );
      } catch (y) {
        await a.warning(
          `Error populating remote component "${p.componentName}": ${y instanceof Error ? y.message : "Unknown error"}`
        ), P.remove();
      }
    } catch (P) {
      await a.warning(
        `Error recreating remote instance "${p.componentName}": ${P instanceof Error ? P.message : "Unknown error"}`
      );
    }
  }
  return await a.log(
    `Remote instance processing complete: ${u.size} component(s) created`
  ), u;
}
async function fn(e, t, n, i, r, c, o = null, u = null, f = !1, h = null) {
  await a.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const w = figma.root.children, E = "RecursicaPublishedMetadata";
  let l = null;
  for (const y of w) {
    const A = y.getPluginData(E);
    if (A)
      try {
        if (JSON.parse(A).id === e.guid) {
          l = y;
          break;
        }
      } catch (T) {
        continue;
      }
  }
  let R = !1;
  if (l && !f) {
    let y;
    try {
      const U = l.getPluginData(E);
      U && (y = JSON.parse(U).version);
    } catch (U) {
    }
    const A = y !== void 0 ? ` v${y}` : "", T = `Found existing component "${l.name}${A}". Should I use it or create a copy?`;
    await a.log(
      `Found existing page with same GUID: "${l.name}". Prompting user...`
    );
    try {
      await se.prompt(T, {
        okLabel: "Use",
        cancelLabel: "Copy",
        timeoutMs: 3e5
        // 5 minutes
      }), R = !0, await a.log(
        `User chose to use existing page: "${l.name}"`
      );
    } catch (U) {
      await a.log(
        "User chose to create a copy. Will create new page."
      );
    }
  }
  if (R && l)
    return await figma.setCurrentPageAsync(l), await a.log(
      `Using existing page: "${l.name}" (GUID: ${e.guid.substring(0, 8)}...)`
    ), await a.log(
      `  Instances from other pages will resolve to components on this existing page using componentPageName: "${l.name}"`
    ), {
      success: !0,
      page: l,
      // Include pageId so it can be tracked in importedPages
      pageId: l.id
    };
  const p = w.find((y) => y.name === e.name);
  p && await a.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let S;
  if (l || p) {
    const y = `__${e.name}`;
    S = await ze(y), await a.log(
      `Creating scratch page: "${S}" (will be renamed to "${e.name}" on success)`
    );
  } else
    S = e.name, await a.log(`Creating page: "${S}"`);
  const I = figma.createPage();
  if (I.name = S, await figma.setCurrentPageAsync(I), await a.log(`Switched to page: "${S}"`), !t.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await a.log("Recreating page structure...");
  const x = t.pageData;
  if (x.backgrounds !== void 0)
    try {
      I.backgrounds = x.backgrounds, await a.log(
        `Set page background: ${JSON.stringify(x.backgrounds)}`
      );
    } catch (y) {
      await a.warning(`Failed to set page background: ${y}`);
    }
  Be(x);
  const G = /* @__PURE__ */ new Map(), B = (y, A = []) => {
    if (y.type === "COMPONENT" && y.id && A.push(y.id), y.children && Array.isArray(y.children))
      for (const T of y.children)
        T._truncated || B(T, A);
    return A;
  }, O = B(x);
  if (await a.log(
    `Found ${O.length} COMPONENT node(s) in page data`
  ), O.length > 0 && (await a.log(
    `Component IDs in page data (first 20): ${O.slice(0, 20).map((y) => y.substring(0, 8) + "...").join(", ")}`
  ), x._allComponentIds = O), x.children && Array.isArray(x.children))
    for (const y of x.children) {
      const A = await ce(
        y,
        I,
        n,
        i,
        r,
        c,
        G,
        !1,
        // isRemoteStructure: false - we're creating the main page
        o,
        u,
        x,
        // parentNodeData - pass the page's nodeData so children can check for auto-layout
        h
      );
      A && I.appendChild(A);
    }
  await a.log("Page structure recreated successfully"), r && (await a.log(
    "Third pass: Setting variant properties on instances..."
  ), await Xt(
    I,
    r,
    G
  ));
  const P = {
    _ver: 1,
    id: e.guid,
    name: e.name,
    version: e.version || 0,
    publishDate: (/* @__PURE__ */ new Date()).toISOString(),
    history: {}
  };
  if (I.setPluginData(E, JSON.stringify(P)), await a.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), S.startsWith("__")) {
    const y = await ze(e.name);
    I.name = y, await a.log(`Renamed page from "${S}" to "${y}"`);
  }
  return {
    success: !0,
    page: I
  };
}
async function tt(e) {
  var i;
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
    const c = en(r);
    if (!c.success)
      return await a.error(c.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: c.error,
        data: {}
      };
    const o = c.metadata;
    await a.log(
      `Metadata validated: guid=${o.guid}, name=${o.name}`
    ), await a.log("Loading string table...");
    const u = et(r);
    if (!u.success)
      return await a.error(u.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: u.error,
        data: {}
      };
    await a.log("String table loaded successfully"), await a.log("Expanding JSON data...");
    const f = u.expandedJsonData;
    await a.log("JSON expanded successfully"), await a.log("Loading collections table...");
    const h = tn(f);
    if (!h.success)
      return h.error === "No collections table found in JSON" ? (await a.log(h.error), await a.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: o.name }
      }) : (await a.error(h.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: h.error,
        data: {}
      });
    const w = h.collectionTable;
    await a.log(
      `Loaded collections table with ${w.getSize()} collection(s)`
    ), await a.log(
      "Matching collections with existing local collections..."
    );
    const { recognizedCollections: E, potentialMatches: l, collectionsToCreate: R } = await nn(w);
    await an(
      l,
      E,
      R
    ), await rn(
      E,
      w,
      l
    ), await on(
      R,
      E,
      n
    ), await a.log("Loading variables table...");
    const p = sn(f);
    if (!p.success)
      return p.error === "No variables table found in JSON" ? (await a.log(p.error), await a.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no variables to process)",
        data: { pageName: o.name }
      }) : (await a.error(p.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: p.error,
        data: {}
      });
    const S = p.variableTable;
    await a.log(
      `Loaded variables table with ${S.getSize()} variable(s)`
    );
    const { recognizedVariables: I, newlyCreatedVariables: x } = await cn(
      S,
      w,
      E,
      n
    );
    await a.log("Loading instance table...");
    const G = ln(f);
    if (G) {
      const _ = G.getSerializedTable(), d = Object.values(_).filter(
        (s) => s.instanceType === "internal"
      ), g = Object.values(_).filter(
        (s) => s.instanceType === "remote"
      );
      await a.log(
        `Loaded instance table with ${G.getSize()} instance(s) (${d.length} internal, ${g.length} remote)`
      );
    } else
      await a.log("No instance table found in JSON");
    let B = null;
    G && (B = await un(
      G,
      S,
      w,
      I,
      E
    ));
    const O = [], P = (i = e.isMainPage) != null ? i : !0, y = await fn(
      o,
      f,
      S,
      w,
      G,
      I,
      B,
      O,
      P,
      E
    );
    if (!y.success)
      return await a.error(y.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: y.error,
        data: {}
      };
    const A = y.page, T = I.size + x.length, U = O.length;
    await a.log("=== Import Complete ==="), await a.log(
      `Successfully processed ${E.size} collection(s), ${T} variable(s), and created page "${A.name}"${U > 0 ? ` (${U} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`
    );
    const k = y.pageId || A.id;
    return {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: {
        pageName: A.name,
        pageId: k,
        // Include pageId for tracking (used for both new and reused pages)
        deferredInstances: U > 0 ? O : void 0,
        createdEntities: {
          pageIds: [A.id],
          collectionIds: n.map((_) => _.id),
          variableIds: x.map((_) => _.id)
        }
      }
    };
  } catch (r) {
    const c = r instanceof Error ? r.message : "Unknown error occurred";
    return await a.error(`Import failed: ${c}`), r instanceof Error && r.stack && await a.error(`Stack trace: ${r.stack}`), console.error("Error importing page:", r), {
      type: "importPage",
      success: !1,
      error: !0,
      message: c,
      data: {}
    };
  }
}
async function nt(e) {
  if (e.length === 0)
    return { resolved: 0, failed: 0, errors: [] };
  await a.log(
    `=== Resolving ${e.length} deferred normal instance(s) ===`
  );
  let t = 0, n = 0;
  const i = [];
  await figma.loadAllPagesAsync();
  for (const r of e)
    try {
      const { placeholderFrame: c, instanceEntry: o, nodeData: u, parentNode: f } = r, h = figma.root.children.find(
        (p) => p.name === o.componentPageName
      );
      if (!h) {
        const p = `Deferred instance "${u.name}" still cannot find referenced page "${o.componentPageName}"`;
        await a.error(p), i.push(p), n++;
        continue;
      }
      const w = (p, S, I, x, G) => {
        if (S.length === 0) {
          let P = null;
          for (const y of p.children || [])
            if (y.type === "COMPONENT") {
              if (y.name === I)
                if (P || (P = y), x)
                  try {
                    const A = y.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (A && JSON.parse(A).id === x)
                      return y;
                  } catch (A) {
                  }
                else
                  return y;
            } else if (y.type === "COMPONENT_SET") {
              if (G && y.name !== G)
                continue;
              for (const A of y.children || [])
                if (A.type === "COMPONENT" && A.name === I)
                  if (P || (P = A), x)
                    try {
                      const T = A.getPluginData(
                        "RecursicaPublishedMetadata"
                      );
                      if (T && JSON.parse(T).id === x)
                        return A;
                    } catch (T) {
                    }
                  else
                    return A;
            }
          return P;
        }
        const [B, ...O] = S;
        for (const P of p.children || [])
          if (P.name === B) {
            if (O.length === 0 && P.type === "COMPONENT_SET") {
              if (G && P.name !== G)
                continue;
              for (const y of P.children || [])
                if (y.type === "COMPONENT" && y.name === I) {
                  if (x)
                    try {
                      const A = y.getPluginData(
                        "RecursicaPublishedMetadata"
                      );
                      if (A && JSON.parse(A).id === x)
                        return y;
                    } catch (A) {
                    }
                  return y;
                }
              return null;
            }
            return w(
              P,
              O,
              I,
              x,
              G
            );
          }
        return null;
      }, E = w(
        h,
        o.path || [],
        o.componentName,
        o.componentGuid,
        o.componentSetName
      );
      if (!E) {
        const p = o.path && o.path.length > 0 ? ` at path [${o.path.join(" → ")}]` : " at page root", S = `Deferred instance "${u.name}" still cannot find component "${o.componentName}" on page "${o.componentPageName}"${p}`;
        await a.error(S), i.push(S), n++;
        continue;
      }
      const l = E.createInstance();
      if (l.name = u.name || c.name.replace("[Deferred: ", "").replace("]", ""), l.x = c.x, l.y = c.y, c.width !== void 0 && c.height !== void 0 && l.resize(c.width, c.height), o.variantProperties && Object.keys(o.variantProperties).length > 0)
        try {
          const p = await l.getMainComponentAsync();
          if (p) {
            let S = null;
            const I = p.type;
            if (I === "COMPONENT_SET" ? S = p.componentPropertyDefinitions : I === "COMPONENT" && p.parent && p.parent.type === "COMPONENT_SET" ? S = p.parent.componentPropertyDefinitions : await a.warning(
              `Cannot set variant properties for resolved instance "${u.name}" - main component is not a COMPONENT_SET or variant`
            ), S) {
              const x = {};
              for (const [G, B] of Object.entries(
                o.variantProperties
              )) {
                const O = G.split("#")[0];
                S[O] && (x[O] = B);
              }
              Object.keys(x).length > 0 && l.setProperties(x);
            }
          }
        } catch (p) {
          await a.warning(
            `Failed to set variant properties for resolved instance "${u.name}": ${p}`
          );
        }
      if (o.componentProperties && Object.keys(o.componentProperties).length > 0)
        try {
          const p = await l.getMainComponentAsync();
          if (p) {
            let S = null;
            const I = p.type;
            if (I === "COMPONENT_SET" ? S = p.componentPropertyDefinitions : I === "COMPONENT" && p.parent && p.parent.type === "COMPONENT_SET" ? S = p.parent.componentPropertyDefinitions : I === "COMPONENT" && (S = p.componentPropertyDefinitions), S)
              for (const [x, G] of Object.entries(
                o.componentProperties
              )) {
                const B = x.split("#")[0];
                if (S[B])
                  try {
                    l.setProperties({
                      [B]: G
                    });
                  } catch (O) {
                    await a.warning(
                      `Failed to set component property "${B}" for resolved instance "${u.name}": ${O}`
                    );
                  }
              }
          }
        } catch (p) {
          await a.warning(
            `Failed to set component properties for resolved instance "${u.name}": ${p}`
          );
        }
      const R = f.children.indexOf(c);
      f.insertChild(R, l), c.remove(), await a.log(
        `  ✓ Resolved deferred instance "${u.name}" from component "${o.componentName}" on page "${o.componentPageName}"`
      ), t++;
    } catch (c) {
      const o = c instanceof Error ? c.message : String(c), u = `Failed to resolve deferred instance "${r.nodeData.name}": ${o}`;
      await a.error(u), i.push(u), n++;
    }
  return await a.log(
    `=== Deferred Resolution Complete: ${t} resolved, ${n} failed ===`
  ), { resolved: t, failed: n, errors: i };
}
async function mn(e) {
  await a.log("=== Cleaning up created entities ===");
  try {
    const { pageIds: t, collectionIds: n, variableIds: i } = e;
    let r = 0;
    for (const u of i)
      try {
        const f = figma.variables.getVariableById(u);
        if (f) {
          const h = f.variableCollectionId;
          n.includes(h) || (f.remove(), r++);
        }
      } catch (f) {
        await a.warning(
          `Could not delete variable ${u.substring(0, 8)}...: ${f}`
        );
      }
    let c = 0;
    for (const u of n)
      try {
        const f = figma.variables.getVariableCollectionById(u);
        f && (f.remove(), c++);
      } catch (f) {
        await a.warning(
          `Could not delete collection ${u.substring(0, 8)}...: ${f}`
        );
      }
    await figma.loadAllPagesAsync();
    let o = 0;
    for (const u of t)
      try {
        const f = await figma.getNodeByIdAsync(u);
        f && f.type === "PAGE" && (f.remove(), o++);
      } catch (f) {
        await a.warning(
          `Could not delete page ${u.substring(0, 8)}...: ${f}`
        );
      }
    return await a.log(
      `Cleanup complete: Deleted ${o} page(s), ${c} collection(s), ${r} variable(s)`
    ), {
      type: "cleanupCreatedEntities",
      success: !0,
      error: !1,
      message: "Cleanup completed successfully",
      data: {
        deletedPages: o,
        deletedCollections: c,
        deletedVariables: r
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
async function at(e) {
  const t = [];
  for (const { fileName: n, jsonData: i } of e)
    try {
      const r = et(i);
      if (!r.success || !r.expandedJsonData) {
        await a.warning(
          `Skipping ${n} - failed to expand JSON: ${r.error || "Unknown error"}`
        );
        continue;
      }
      const c = r.expandedJsonData, o = c.metadata;
      if (!o || !o.name || !o.guid) {
        await a.warning(
          `Skipping ${n} - missing or invalid metadata`
        );
        continue;
      }
      const u = [];
      if (c.instances) {
        const h = ue.fromTable(
          c.instances
        ).getSerializedTable();
        for (const w of Object.values(h))
          w.instanceType === "normal" && w.componentPageName && (u.includes(w.componentPageName) || u.push(w.componentPageName));
      }
      t.push({
        fileName: n,
        pageName: o.name,
        pageGuid: o.guid,
        dependencies: u,
        jsonData: i
        // Store original JSON data for import
      }), await a.log(
        `  ${n}: "${o.name}" depends on: ${u.length > 0 ? u.join(", ") : "none"}`
      );
    } catch (r) {
      await a.error(
        `Error processing ${n}: ${r instanceof Error ? r.message : String(r)}`
      );
    }
  return t;
}
function it(e) {
  const t = [], n = [], i = [], r = /* @__PURE__ */ new Map();
  for (const h of e)
    r.set(h.pageName, h);
  const c = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), u = [], f = (h) => {
    if (c.has(h.pageName))
      return !1;
    if (o.has(h.pageName)) {
      const w = u.findIndex(
        (E) => E.pageName === h.pageName
      );
      if (w !== -1) {
        const E = u.slice(w).concat([h]);
        return n.push(E), !0;
      }
      return !1;
    }
    o.add(h.pageName), u.push(h);
    for (const w of h.dependencies) {
      const E = r.get(w);
      E && f(E);
    }
    return o.delete(h.pageName), u.pop(), c.add(h.pageName), t.push(h), !1;
  };
  for (const h of e)
    c.has(h.pageName) || f(h);
  for (const h of e)
    for (const w of h.dependencies)
      r.has(w) || i.push(
        `Page "${h.pageName}" (${h.fileName}) depends on "${w}" which is not in the import set`
      );
  return { order: t, cycles: n, errors: i };
}
async function rt(e) {
  await a.log("=== Building Dependency Graph ===");
  const t = await at(e);
  await a.log("=== Resolving Import Order ===");
  const n = it(t);
  if (n.cycles.length > 0) {
    await a.log(
      `Detected ${n.cycles.length} circular dependency cycle(s):`
    );
    for (const i of n.cycles) {
      const r = i.map((c) => `"${c.pageName}"`).join(" → ");
      await a.log(`  Cycle: ${r} → (back to start)`);
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
    const r = n.order[i];
    await a.log(`  ${i + 1}. ${r.fileName} ("${r.pageName}")`);
  }
  return n;
}
async function gn(e) {
  var p, S, I, x, G;
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
    errors: r
  } = await rt(t);
  r.length > 0 && await a.warning(
    `Found ${r.length} dependency warning(s) - some dependencies may be missing`
  ), i.length > 0 && await a.log(
    `Detected ${i.length} circular dependency cycle(s) - will use deferred resolution`
  ), await a.log("=== Importing Pages in Order ===");
  let c = 0, o = 0;
  const u = [...r], f = [], h = {
    pageIds: [],
    collectionIds: [],
    variableIds: []
  }, w = [], E = e.mainFileName;
  for (let B = 0; B < n.length; B++) {
    const O = n[B], P = E ? O.fileName === E : B === n.length - 1;
    await a.log(
      `[${B + 1}/${n.length}] Importing ${O.fileName} ("${O.pageName}")${P ? " [MAIN]" : " [DEPENDENCY]"}...`
    );
    try {
      const y = B === 0, A = await tt({
        jsonData: O.jsonData,
        isMainPage: P,
        clearConsole: y
      });
      if (A.success) {
        if (c++, (p = A.data) != null && p.deferredInstances) {
          const T = A.data.deferredInstances;
          Array.isArray(T) && f.push(...T);
        }
        if ((S = A.data) != null && S.createdEntities) {
          const T = A.data.createdEntities;
          T.pageIds && h.pageIds.push(...T.pageIds), T.collectionIds && h.collectionIds.push(...T.collectionIds), T.variableIds && h.variableIds.push(...T.variableIds);
          const U = ((I = T.pageIds) == null ? void 0 : I[0]) || ((x = A.data) == null ? void 0 : x.pageId);
          (G = A.data) != null && G.pageName && U && w.push({
            name: A.data.pageName,
            pageId: U
          });
        }
      } else
        o++, u.push(
          `Failed to import ${O.fileName}: ${A.message || "Unknown error"}`
        );
    } catch (y) {
      o++;
      const A = y instanceof Error ? y.message : String(y);
      u.push(`Failed to import ${O.fileName}: ${A}`);
    }
  }
  if (f.length > 0) {
    await a.log(
      `=== Resolving ${f.length} Deferred Instance(s) ===`
    );
    try {
      const B = await nt(f);
      await a.log(
        `  Resolved: ${B.resolved}, Failed: ${B.failed}`
      ), B.errors.length > 0 && u.push(...B.errors);
    } catch (B) {
      u.push(
        `Failed to resolve deferred instances: ${B instanceof Error ? B.message : String(B)}`
      );
    }
  }
  await a.log("=== Import Summary ==="), await a.log(
    `  Imported: ${c}, Failed: ${o}, Deferred instances: ${f.length}`
  );
  const l = o === 0, R = l ? `Successfully imported ${c} page(s)${f.length > 0 ? ` (${f.length} deferred instance(s) resolved)` : ""}` : `Import completed with ${o} failure(s). ${u.join("; ")}`;
  return {
    type: "importPagesInOrder",
    success: l,
    error: !l,
    message: R,
    data: {
      imported: c,
      failed: o,
      deferred: f.length,
      errors: u,
      importedPages: w,
      createdEntities: h
    }
  };
}
async function hn(e) {
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
    const r = await Ee(
      i,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + i.name + " (index: " + n + ")"
    );
    const c = JSON.stringify(r, null, 2), o = JSON.parse(c), u = "Copy - " + o.name, f = figma.createPage();
    if (f.name = u, figma.root.appendChild(f), o.children && o.children.length > 0) {
      let E = function(R) {
        R.forEach((p) => {
          const S = (p.x || 0) + (p.width || 0);
          S > l && (l = S), p.children && p.children.length > 0 && E(p.children);
        });
      };
      console.log(
        "Recreating " + o.children.length + " top-level children..."
      );
      let l = 0;
      E(o.children), console.log("Original content rightmost edge: " + l);
      for (const R of o.children)
        await ce(R, f, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const h = ve(o);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: o.name,
        newPageName: u,
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
async function yn(e) {
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
async function bn(e) {
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
async function wn(e) {
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
async function Nn(e) {
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
function Re(e, t = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: t
  };
}
function ot(e, t, n = {}) {
  const i = t instanceof Error ? t.message : t;
  return {
    type: e,
    success: !1,
    error: !0,
    message: i,
    data: n
  };
}
const st = "RecursicaPublishedMetadata";
async function $n(e) {
  try {
    const t = figma.currentPage;
    await figma.loadAllPagesAsync();
    const i = figma.root.children.findIndex(
      (u) => u.id === t.id
    ), r = t.getPluginData(st);
    if (!r) {
      const h = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: be(t.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: i
      };
      return Re("getComponentMetadata", h);
    }
    const o = {
      componentMetadata: JSON.parse(r),
      currentPageIndex: i
    };
    return Re("getComponentMetadata", o);
  } catch (t) {
    return console.error("Error getting component metadata:", t), ot(
      "getComponentMetadata",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function vn(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children, n = [];
    for (const r of t) {
      if (r.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${r.name} (type: ${r.type})`
        );
        continue;
      }
      const c = r, o = c.getPluginData(st);
      if (o)
        try {
          const u = JSON.parse(o);
          n.push(u);
        } catch (u) {
          console.warn(
            `Failed to parse metadata for page "${c.name}":`,
            u
          );
          const h = {
            _ver: 1,
            id: "",
            name: be(c.name),
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
          name: be(c.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        n.push(f);
      }
    }
    return Re("getAllComponents", {
      components: n
    });
  } catch (t) {
    return console.error("Error getting all components:", t), ot(
      "getAllComponents",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function En(e) {
  try {
    const t = e.requestId, n = e.action;
    return !t || !n ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (se.handleResponse({ requestId: t, action: n }), {
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
async function An(e) {
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
const Cn = {
  getCurrentUser: mt,
  loadPages: gt,
  exportPage: Le,
  importPage: tt,
  cleanupCreatedEntities: mn,
  resolveDeferredNormalInstances: nt,
  determineImportOrder: rt,
  buildDependencyGraph: at,
  resolveImportOrder: it,
  importPagesInOrder: gn,
  quickCopy: hn,
  storeAuthData: yn,
  loadAuthData: bn,
  clearAuthData: wn,
  storeSelectedRepo: Nn,
  getComponentMetadata: $n,
  getAllComponents: vn,
  pluginPromptResponse: En,
  switchToPage: An
}, Pn = Cn;
figma.showUI(__html__, {
  width: 500,
  height: 500
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    At(e);
    return;
  }
  const t = e;
  try {
    const n = t.type, i = Pn[n];
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
    const r = await i(t.data);
    figma.ui.postMessage(Z(z({}, r), {
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
