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
    const s = Z(z({}, t), {
      collectionName: i
    });
    if (ie(t.collectionName)) {
      const o = xe(
        t.collectionName
      );
      o && (s.collectionGuid = o), this.normalizedNameMap.set(i, r);
    }
    return this.collections[r] = s, r;
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
      (s, o) => parseInt(s[0], 10) - parseInt(o[0], 10)
    );
    for (const [s, o] of i) {
      const u = parseInt(s, 10), f = (r = o.isLocal) != null ? r : !0, h = ae(
        o.collectionName || ""
      ), N = o.collectionId || o.collectionGuid || `temp:${u}:${h}`, E = z({
        collectionName: h,
        collectionId: N,
        isLocal: f,
        modes: o.modes || []
      }, o.collectionGuid && {
        collectionGuid: o.collectionGuid
      });
      n.collectionMap.set(N, u), n.collections[u] = E, ie(h) && n.normalizedNameMap.set(h, u), n.nextIndex = Math.max(
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
      ), s = z(z({
        variableName: i.variableName,
        variableType: Nt(i.variableType)
      }, i._colRef !== void 0 && { _colRef: i._colRef }), r && { valuesByMode: r });
      t[String(n)] = s;
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
      (r, s) => parseInt(r[0], 10) - parseInt(s[0], 10)
    );
    for (const [r, s] of i) {
      const o = parseInt(r, 10), u = $t(s.variableType), f = Z(z({}, s), {
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
  const s = {};
  for (const [o, u] of Object.entries(e)) {
    const f = Ct(o, i);
    if (u == null) {
      s[f] = u;
      continue;
    }
    if (typeof u == "string" || typeof u == "number" || typeof u == "boolean") {
      s[f] = u;
      continue;
    }
    if (typeof u == "object" && u !== null && "type" in u && u.type === "VARIABLE_ALIAS" && "id" in u) {
      const h = u.id;
      if (r.has(h)) {
        s[f] = {
          type: "VARIABLE_ALIAS",
          id: h
        };
        continue;
      }
      const N = await figma.variables.getVariableByIdAsync(h);
      if (!N) {
        s[f] = {
          type: "VARIABLE_ALIAS",
          id: h
        };
        continue;
      }
      const E = new Set(r);
      E.add(h);
      const c = await figma.variables.getVariableCollectionByIdAsync(
        N.variableCollectionId
      ), R = N.key;
      if (!R) {
        s[f] = {
          type: "VARIABLE_ALIAS",
          id: h
        };
        continue;
      }
      const p = {
        variableName: N.name,
        variableType: N.resolvedType,
        collectionName: c == null ? void 0 : c.name,
        collectionId: N.variableCollectionId,
        variableKey: R,
        id: h,
        isLocal: !N.remote
      };
      if (c) {
        const V = await Ke(
          c,
          n
        );
        p._colRef = V, N.valuesByMode && (p.valuesByMode = await We(
          N.valuesByMode,
          t,
          n,
          c,
          // Pass collection for mode ID to name conversion
          E
        ));
      }
      const P = t.addVariable(p);
      s[f] = {
        type: "VARIABLE_ALIAS",
        id: h,
        _varRef: P
      };
    } else
      s[f] = u;
  }
  return s;
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
        const s = e.getSharedPluginData(
          "recursica",
          ge
        );
        return (!s || s.trim() === "") && e.setSharedPluginData(
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
  const r = await Pt(e), s = e.modes.map((h) => h.name), o = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: n,
    modes: s,
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
    const s = i.key;
    if (!s)
      return console.log("Variable missing key:", e.id), null;
    const o = await Ke(
      r,
      n
    ), u = {
      variableName: i.name,
      variableType: i.resolvedType,
      _colRef: o,
      // Reference to collection table (v2.4.0+)
      variableKey: s,
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
      const s = e[r];
      if (s && typeof s == "object" && !Array.isArray(s))
        if (s.type === "VARIABLE_ALIAS") {
          const o = await Te(
            s,
            t,
            n
          );
          o && (i[r] = o);
        } else
          i[r] = await oe(
            s,
            t,
            n
          );
      else Array.isArray(s) ? i[r] = await Promise.all(
        s.map(async (o) => (o == null ? void 0 : o.type) === "VARIABLE_ALIAS" ? await Te(
          o,
          t,
          n
        ) || o : o && typeof o == "object" ? await oe(
          o,
          t,
          n
        ) : o)
      ) : i[r] = s;
    }
  return i;
}
async function He(e, t, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const r = {};
      for (const s in i)
        Object.prototype.hasOwnProperty.call(i, s) && (s === "boundVariables" ? r[s] = await oe(
          i[s],
          t,
          n
        ) : r[s] = i[s]);
      return r;
    })
  );
}
async function qe(e, t, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const r = {};
      for (const s in i)
        Object.prototype.hasOwnProperty.call(i, s) && (s === "boundVariables" ? r[s] = await oe(
          i[s],
          t,
          n
        ) : r[s] = i[s]);
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
    const n = typeof t == "number" ? { timeoutMs: t } : t, i = (u = n == null ? void 0 : n.timeoutMs) != null ? u : 3e5, r = n == null ? void 0 : n.okLabel, s = n == null ? void 0 : n.cancelLabel, o = Lt();
    return new Promise((f, h) => {
      const N = i === -1 ? null : setTimeout(() => {
        he.delete(o), h(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      he.set(o, {
        resolve: f,
        reject: h,
        timeout: N
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: z(z({
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
  var r, s;
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
        const d = `Found detached instance "${y}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await se.prompt(d, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(A), await a.log(
            `Treating detached instance "${y}" as internal instance`
          );
        } catch (m) {
          if (m instanceof Error && m.message === "User cancelled") {
            const w = `Export cancelled: Detached instance "${y}" found. Please fix the instance before exporting.`;
            await a.error(w);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch ($) {
              console.warn("Could not scroll to instance:", $);
            }
            throw new Error(w);
          } else
            throw m;
        }
      }
      if (!Se(e).page) {
        const d = `Detached instance "${y}" is not on any page. Cannot export.`;
        throw await a.error(d), new Error(d);
      }
      let L, _;
      try {
        e.variantProperties && (L = e.variantProperties), e.componentProperties && (_ = e.componentProperties);
      } catch (d) {
      }
      const l = z(z({
        instanceType: "internal",
        componentName: y,
        componentNodeId: e.id
      }, L && { variantProperties: L }), _ && { componentProperties: _ }), g = t.instanceTable.addInstance(l);
      return n._instanceRef = g, i.add("_instanceRef"), await a.log(
        `  Exported detached INSTANCE: "${y}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), n;
    }
    const u = e.name || "(unnamed)", f = o.name || "(unnamed)", h = o.remote === !0, E = Se(e).page, c = Se(o), R = c.page;
    let p, P = R;
    if (h)
      if (R) {
        const y = Fe(R);
        y != null && y.id ? (p = "normal", P = R, await a.log(
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
    else if (!h && c.reason === "detached") {
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
        `  Instance "${u}" -> component "${f}": componentPage is null but component is not remote. Reason: ${c.reason}. Cannot determine instance type.`
      ), p = "normal";
    let V, x;
    try {
      if (e.variantProperties && (V = e.variantProperties, await a.log(
        `  Instance "${u}" -> variantProperties from instance: ${JSON.stringify(V)}`
      )), typeof e.getProperties == "function")
        try {
          const y = await e.getProperties();
          y && y.variantProperties && (await a.log(
            `  Instance "${u}" -> variantProperties from getProperties(): ${JSON.stringify(y.variantProperties)}`
          ), y.variantProperties && Object.keys(y.variantProperties).length > 0 && (V = y.variantProperties));
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
          const T = {}, U = f.split(",").map((L) => L.trim());
          for (const L of U) {
            const _ = L.split("=").map((l) => l.trim());
            if (_.length >= 2) {
              const l = _[0], g = _.slice(1).join("=").trim();
              A && A[l] && (T[l] = g);
            }
          }
          if (Object.keys(T).length > 0 && await a.log(
            `  Parsed variant properties from component name "${f}": ${JSON.stringify(T)}`
          ), V && Object.keys(V).length > 0)
            await a.log(
              `  Using variant properties from instance (source of truth): ${JSON.stringify(V)}`
            );
          else if (Object.keys(T).length > 0)
            V = T, await a.log(
              `  Using variant properties from component name (fallback): ${JSON.stringify(V)}`
            );
          else if (o.variantProperties) {
            const L = o.variantProperties;
            await a.log(
              `  Main component "${f}" has variantProperties: ${JSON.stringify(L)}`
            ), V = L;
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
          const L = y.type, _ = y.name;
          if (L === "COMPONENT_SET" && !B && (B = _), L === "PAGE")
            break;
          const l = _ || "";
          A.unshift(l), y = y.parent, T++;
        } catch (L) {
          break;
        }
      G = A;
    } catch (y) {
    }
    const O = z(z(z(z({
      instanceType: p,
      componentName: f
    }, B && { componentSetName: B }), V && { variantProperties: V }), x && { componentProperties: x }), p === "normal" ? { path: G || [] } : G && G.length > 0 && {
      path: G
    });
    if (p === "internal") {
      O.componentNodeId = o.id, await a.log(
        `  Found INSTANCE: "${u}" -> INTERNAL component "${f}" (ID: ${o.id.substring(0, 8)}...)`
      );
      const y = e.boundVariables, A = o.boundVariables;
      if (y && typeof y == "object") {
        const l = Object.keys(y);
        await a.log(
          `  DEBUG: Internal instance "${u}" -> boundVariables keys: ${l.length > 0 ? l.join(", ") : "none"}`
        );
        for (const d of l) {
          const m = y[d], w = (m == null ? void 0 : m.type) || typeof m;
          await a.log(
            `  DEBUG:   boundVariables.${d}: type=${w}, value=${JSON.stringify(m)}`
          );
        }
        const g = [
          "backgrounds",
          "selectionColor",
          "selectionColors",
          "selection",
          "selectColor"
        ];
        for (const d of g)
          y[d] !== void 0 && await a.log(
            `  DEBUG:   Found potential "Selection colors" property: boundVariables.${d} = ${JSON.stringify(y[d])}`
          );
      } else
        await a.log(
          `  DEBUG: Internal instance "${u}" -> No boundVariables found on instance node`
        );
      if (A && typeof A == "object") {
        const l = Object.keys(A);
        await a.log(
          `  DEBUG: Main component "${f}" -> boundVariables keys: ${l.length > 0 ? l.join(", ") : "none"}`
        );
      }
      const T = e.backgrounds;
      if (T && Array.isArray(T)) {
        await a.log(
          `  DEBUG: Internal instance "${u}" -> backgrounds array length: ${T.length}`
        );
        for (let l = 0; l < T.length; l++) {
          const g = T[l];
          if (g && typeof g == "object") {
            if (await a.log(
              `  DEBUG:   backgrounds[${l}] structure: ${JSON.stringify(Object.keys(g))}`
            ), g.boundVariables) {
              const d = Object.keys(g.boundVariables);
              await a.log(
                `  DEBUG:   backgrounds[${l}].boundVariables keys: ${d.length > 0 ? d.join(", ") : "none"}`
              );
              for (const m of d) {
                const w = g.boundVariables[m];
                await a.log(
                  `  DEBUG:     backgrounds[${l}].boundVariables.${m}: ${JSON.stringify(w)}`
                );
              }
            }
            g.color && await a.log(
              `  DEBUG:   backgrounds[${l}].color: ${JSON.stringify(g.color)}`
            );
          }
        }
      }
      const U = Object.keys(e).filter(
        (l) => !l.startsWith("_") && l !== "parent" && l !== "removed" && typeof e[l] != "function" && l !== "type" && l !== "id" && l !== "name" && l !== "boundVariables" && l !== "backgrounds" && l !== "fills"
      ), L = Object.keys(o).filter(
        (l) => !l.startsWith("_") && l !== "parent" && l !== "removed" && typeof o[l] != "function" && l !== "type" && l !== "id" && l !== "name" && l !== "boundVariables" && l !== "backgrounds" && l !== "fills"
      ), _ = [
        .../* @__PURE__ */ new Set([...U, ...L])
      ].filter(
        (l) => l.toLowerCase().includes("selection") || l.toLowerCase().includes("select") || l.toLowerCase().includes("color") && !l.toLowerCase().includes("fill") && !l.toLowerCase().includes("stroke")
      );
      if (_.length > 0) {
        await a.log(
          `  DEBUG: Found selection/color-related properties: ${_.join(", ")}`
        );
        for (const l of _)
          try {
            if (U.includes(l)) {
              const g = e[l];
              await a.log(
                `  DEBUG:   Instance.${l}: ${JSON.stringify(g)}`
              );
            }
            if (L.includes(l)) {
              const g = o[l];
              await a.log(
                `  DEBUG:   MainComponent.${l}: ${JSON.stringify(g)}`
              );
            }
          } catch (g) {
          }
      } else
        await a.log(
          "  DEBUG: No selection/color-related properties found on instance or main component"
        );
    } else if (p === "normal") {
      const y = P || R;
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
        let U = "", L = "";
        switch (c.reason) {
          case "broken_chain":
            U = "The component's parent chain is broken and cannot be traversed to find the page", L = "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            U = "Cannot access the component's parent chain (access error)", L = "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            U = "Cannot determine which page the component is on", L = "Please ensure the component is properly placed on a page.";
        }
        try {
          await figma.viewport.scrollAndZoomIntoView([o]);
        } catch (g) {
          console.warn("Could not scroll to component:", g);
        }
        const _ = `Normal instance "${u}" -> component "${f}" (ID: ${T}) has no componentPage. ${U}. ${L} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", _), await a.error(_);
        const l = new Error(_);
        throw console.error("Throwing error:", l), l;
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
              const L = await o.getPublishStatusAsync();
              L && typeof L == "object" && (L.libraryName && (y = L.libraryName), L.libraryKey && (A = L.libraryKey));
            } catch (L) {
            }
          try {
            const L = figma.teamLibrary;
            if (typeof (L == null ? void 0 : L.getAvailableLibraryComponentSetsAsync) == "function") {
              const _ = await L.getAvailableLibraryComponentSetsAsync();
              if (_ && Array.isArray(_)) {
                for (const l of _)
                  if (l.key === o.key || l.name === o.name) {
                    l.libraryName && (y = l.libraryName), l.libraryKey && (A = l.libraryKey);
                    break;
                  }
              }
            }
          } catch (L) {
          }
        } catch (L) {
          console.warn(
            `Error getting library info for remote component "${f}":`,
            L
          );
        }
      if (y && (O.remoteLibraryName = y), A && (O.remoteLibraryKey = A), T && (O.componentNodeId = o.id), t.instanceTable.getInstanceIndex(O) !== -1)
        await a.log(
          `  Found INSTANCE: "${u}" -> REMOTE component "${f}" (ID: ${o.id.substring(0, 8)}...)${T ? " [DETACHED]" : ""}`
        );
      else
        try {
          const { parseBaseNodeProperties: L } = await Promise.resolve().then(() => Tt), _ = await L(e, t), { parseFrameProperties: l } = await Promise.resolve().then(() => Ot), g = await l(e, t), d = Z(z(z({}, _), g), {
            type: "COMPONENT"
            // Convert to COMPONENT type for recreation (must be after baseProps to override)
          });
          if (e.children && Array.isArray(e.children) && e.children.length > 0) {
            const m = Z(z({}, t), {
              depth: (t.depth || 0) + 1
            }), { extractNodeData: w } = await Promise.resolve().then(() => zt), $ = [];
            for (const b of e.children)
              try {
                let v;
                if (b.type === "INSTANCE")
                  try {
                    const I = await b.getMainComponentAsync();
                    if (I) {
                      const S = await L(
                        b,
                        t
                      ), k = await l(
                        b,
                        t
                      ), K = await w(
                        I,
                        /* @__PURE__ */ new WeakSet(),
                        m
                      );
                      v = Z(z(z(z({}, K), S), k), {
                        type: "COMPONENT"
                        // Convert to COMPONENT
                      });
                    } else
                      v = await w(
                        b,
                        /* @__PURE__ */ new WeakSet(),
                        m
                      ), v.type === "INSTANCE" && (v.type = "COMPONENT"), delete v._instanceRef;
                  } catch (I) {
                    v = await w(
                      b,
                      /* @__PURE__ */ new WeakSet(),
                      m
                    ), v.type === "INSTANCE" && (v.type = "COMPONENT"), delete v._instanceRef;
                  }
                else {
                  v = await w(
                    b,
                    /* @__PURE__ */ new WeakSet(),
                    m
                  );
                  const I = b.boundVariables;
                  if (I && typeof I == "object") {
                    const S = Object.keys(I);
                    S.length > 0 && (await a.log(
                      `  DEBUG: Child "${b.name || "Unnamed"}" -> boundVariables keys: ${S.join(", ")}`
                    ), I.backgrounds !== void 0 && await a.log(
                      `  DEBUG:   Child "${b.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(I.backgrounds)}`
                    ));
                  }
                  if (o.children && Array.isArray(o.children)) {
                    const S = o.children.find(
                      (k) => k.name === b.name
                    );
                    if (S) {
                      const k = S.boundVariables;
                      if (k && typeof k == "object") {
                        const K = Object.keys(k);
                        if (K.length > 0 && (await a.log(
                          `  DEBUG: Main component child "${S.name || "Unnamed"}" -> boundVariables keys: ${K.join(", ")}`
                        ), k.backgrounds !== void 0 && (await a.log(
                          `  DEBUG:   Main component child "${S.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(k.backgrounds)}`
                        ), !I || !I.backgrounds))) {
                          await a.log(
                            "  DEBUG:   Instance child doesn't have boundVariables.backgrounds, but main component child does - preserving from main component"
                          );
                          const { extractBoundVariables: H } = await Promise.resolve().then(() => le), J = await H(
                            k,
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
                  `Failed to extract child "${b.name || "Unnamed"}" for remote component "${f}":`,
                  v
                );
              }
            d.children = $;
          }
          if (!d)
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
            const w = m && m.fills !== void 0 && m.fills !== null, $ = d.fills !== void 0 && Array.isArray(d.fills) && d.fills.length > 0, b = e.fills !== void 0 && Array.isArray(e.fills) && e.fills.length > 0, v = o.fills !== void 0 && Array.isArray(o.fills) && o.fills.length > 0;
            if (await a.log(
              `  DEBUG: Instance "${u}" -> fills check: instanceHasFills=${b}, structureHasFills=${$}, mainComponentHasFills=${v}, hasInstanceFillsBoundVar=${!!w}`
            ), w && !$) {
              await a.log(
                "  DEBUG: Instance has boundVariables.fills but structure has no fills - attempting to get fills"
              );
              try {
                if (b) {
                  const { serializeFills: M } = await Promise.resolve().then(() => le), j = await M(
                    e.fills,
                    t.variableTable,
                    t.collectionTable
                  );
                  d.fills = j, await a.log(
                    `  DEBUG: Got ${j.length} fill(s) from instance node`
                  );
                } else if (v) {
                  const { serializeFills: M } = await Promise.resolve().then(() => le), j = await M(
                    o.fills,
                    t.variableTable,
                    t.collectionTable
                  );
                  d.fills = j, await a.log(
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
            const I = e.selectionColor, S = o.selectionColor;
            I !== void 0 && await a.log(
              `  DEBUG: Instance "${u}" -> selectionColor: ${JSON.stringify(I)}`
            ), S !== void 0 && await a.log(
              `  DEBUG: Main component "${f}" -> selectionColor: ${JSON.stringify(S)}`
            );
            const k = Object.keys(e).filter(
              (M) => !M.startsWith("_") && M !== "parent" && M !== "removed" && typeof e[M] != "function" && M !== "type" && M !== "id" && M !== "name"
            ), K = Object.keys(o).filter(
              (M) => !M.startsWith("_") && M !== "parent" && M !== "removed" && typeof o[M] != "function" && M !== "type" && M !== "id" && M !== "name"
            ), H = [
              .../* @__PURE__ */ new Set([...k, ...K])
            ].filter(
              (M) => M.toLowerCase().includes("selection") || M.toLowerCase().includes("select") || M.toLowerCase().includes("color") && !M.toLowerCase().includes("fill") && !M.toLowerCase().includes("stroke")
            );
            if (H.length > 0) {
              await a.log(
                `  DEBUG: Found selection/color-related properties: ${H.join(", ")}`
              );
              for (const M of H)
                try {
                  if (k.includes(M)) {
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
              d.boundVariables || (d.boundVariables = {});
              for (const [W, q] of Object.entries(
                j
              ))
                q !== void 0 && (d.boundVariables[W] !== void 0 && await a.log(
                  `  DEBUG: Structure already has boundVariables.${W} from baseProps, but instance also has it - using instance's boundVariables.${W}`
                ), d.boundVariables[W] = q, await a.log(
                  `  DEBUG: Set boundVariables.${W} in structure: ${JSON.stringify(q)}`
                ));
              j.fills !== void 0 ? await a.log(
                "  DEBUG: ✓ Preserved boundVariables.fills from instance"
              ) : w && await a.warning(
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
              d.boundVariables || (d.boundVariables = {});
              for (const [W, q] of Object.entries(
                j
              ))
                q !== void 0 && (d.boundVariables[W] === void 0 ? (d.boundVariables[W] = q, await a.log(
                  `  DEBUG: Added boundVariables.${W} from main component (not in instance): ${JSON.stringify(q)}`
                )) : await a.log(
                  `  DEBUG: Skipped boundVariables.${W} from main component (instance already has it)`
                ));
            }
            await a.log(
              `  DEBUG: Final structure for "${f}": hasFills=${!!d.fills}, fillsCount=${((r = d.fills) == null ? void 0 : r.length) || 0}, hasBoundVars=${!!d.boundVariables}, boundVarsKeys=${d.boundVariables ? Object.keys(d.boundVariables).join(", ") : "none"}`
            ), (s = d.boundVariables) != null && s.fills && await a.log(
              `  DEBUG: Structure boundVariables.fills: ${JSON.stringify(d.boundVariables.fills)}`
            );
          } catch (m) {
            await a.warning(
              `  Failed to handle bound variables for fills: ${m}`
            );
          }
          O.structure = d, T ? await a.log(
            `  Extracted structure for detached component "${f}" (ID: ${o.id.substring(0, 8)}...)`
          ) : await a.log(
            `  Extracted structure from instance for remote component "${f}" (preserving size overrides: ${e.width}x${e.height})`
          ), await a.log(
            `  Found INSTANCE: "${u}" -> REMOTE component "${f}" (ID: ${o.id.substring(0, 8)}...)${T ? " [DETACHED]" : ""}`
          );
        } catch (L) {
          const _ = `Failed to extract structure for remote component "${f}": ${L instanceof Error ? L.message : String(L)}`;
          console.error(_, L), await a.error(_);
        }
    }
    const C = t.instanceTable.addInstance(O);
    n._instanceRef = C, i.add("_instanceRef");
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
      (r, s) => parseInt(r[0], 10) - parseInt(s[0], 10)
    );
    for (const [r, s] of i) {
      const o = parseInt(r, 10), u = n.generateKey(s);
      n.instanceMap.set(u, o), n.instances[o] = s, n.nextIndex = Math.max(n.nextIndex, o + 1);
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
      for (const [r, s] of Object.entries(t)) {
        const o = this.getShortName(r);
        if (o !== r && !i.has(o)) {
          let u = this.compressObject(s);
          o === "type" && typeof u == "string" && (u = je(u)), n[o] = u;
        } else {
          let u = this.compressObject(s);
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
        const s = this.getLongName(i);
        let o = this.expandObject(r);
        (s === "type" || i === "type") && (typeof o == "number" || typeof o == "string") && (o = Ut(o)), n[s] = o;
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
  var R, p, P, V, x, G, B;
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
  const s = {
    visited: (P = n.visited) != null ? P : /* @__PURE__ */ new WeakSet(),
    depth: (V = n.depth) != null ? V : 0,
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
  t.add(e), s.visited = t;
  const o = {}, u = await Ye(e, s);
  if (Object.assign(o, u), o.id && s.exportedIds) {
    const O = s.exportedIds.get(o.id);
    if (O !== void 0) {
      const C = o.name || "Unnamed";
      if (O !== C) {
        const y = `Duplicate ID detected during export: ID "${o.id.substring(0, 8)}..." is used by both "${O}" and "${C}". Each node must have a unique ID.`;
        throw await a.error(y), new Error(y);
      }
      await a.warning(
        `Node "${C}" (ID: ${o.id.substring(0, 8)}...) was encountered multiple times during export. This may indicate a structural issue.`
      );
    } else
      s.exportedIds.set(o.id, o.name || "Unnamed");
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
          s
        );
        Object.assign(o, O);
        const C = await Oe(
          e
        );
        Object.assign(o, C);
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
        s.unhandledKeys.add("_unknownType");
        break;
    }
  const h = Object.getOwnPropertyNames(e), N = /* @__PURE__ */ new Set([
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
  (f === "FRAME" || f === "COMPONENT" || f === "INSTANCE") && (N.add("layoutMode"), N.add("primaryAxisSizingMode"), N.add("counterAxisSizingMode"), N.add("primaryAxisAlignItems"), N.add("counterAxisAlignItems"), N.add("paddingLeft"), N.add("paddingRight"), N.add("paddingTop"), N.add("paddingBottom"), N.add("itemSpacing"), N.add("cornerRadius"), N.add("clipsContent"), N.add("layoutWrap"), N.add("layoutGrow")), f === "TEXT" && (N.add("characters"), N.add("fontName"), N.add("fontSize"), N.add("textAlignHorizontal"), N.add("textAlignVertical"), N.add("letterSpacing"), N.add("lineHeight"), N.add("textCase"), N.add("textDecoration"), N.add("textAutoResize"), N.add("paragraphSpacing"), N.add("paragraphIndent"), N.add("listOptions")), (f === "VECTOR" || f === "LINE") && (N.add("fillGeometry"), N.add("strokeGeometry")), (f === "RECTANGLE" || f === "ELLIPSE" || f === "STAR" || f === "POLYGON") && (N.add("pointCount"), N.add("innerRadius"), N.add("arcData")), f === "INSTANCE" && (N.add("mainComponent"), N.add("componentProperties"));
  for (const O of h)
    typeof e[O] != "function" && (N.has(O) || s.unhandledKeys.add(O));
  s.unhandledKeys.size > 0 && (o._unhandledKeys = Array.from(s.unhandledKeys).sort());
  const E = o._instanceRef !== void 0 && s.instanceTable && f === "INSTANCE";
  let c = !1;
  if (E) {
    const O = s.instanceTable.getInstanceByIndex(
      o._instanceRef
    );
    O && O.instanceType === "normal" && (c = !0, await a.log(
      `  Skipping children extraction for normal instance "${o.name || "Unnamed"}" - will be resolved from referenced component`
    ));
  }
  if (!c && e.children && Array.isArray(e.children)) {
    const O = s.maxDepth;
    if (s.depth >= O)
      o.children = {
        _truncated: !0,
        _reason: `Maximum depth (${O}) reached`,
        _count: e.children.length
      };
    else if (s.nodeCount >= i)
      o.children = {
        _truncated: !0,
        _reason: `Maximum node count (${i}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const C = Z(z({}, s), {
        depth: s.depth + 1
      }), y = [];
      let A = !1;
      for (const T of e.children) {
        if (C.nodeCount >= i) {
          o.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: y.length,
            _total: e.children.length,
            children: y
          }, A = !0;
          break;
        }
        const U = await Ee(T, t, C);
        y.push(U), C.nodeCount && (s.nodeCount = C.nodeCount);
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
    const s = r[i], o = s.id;
    if (t.has(o))
      return await a.log(
        `Page "${s.name}" has already been processed, skipping...`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Page already processed",
        data: {}
      };
    t.add(o), await a.log(
      `Selected page: "${s.name}" (index: ${i})`
    ), await a.log(
      "Initializing variable, collection, and instance tables..."
    );
    const u = new Ne(), f = new we(), h = new ue();
    await a.log("Fetching team library variable collections...");
    let N = [];
    try {
      if (N = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((w) => ({
        libraryName: w.libraryName,
        key: w.key,
        name: w.name
      })), await a.log(
        `Found ${N.length} library collection(s) in team library`
      ), N.length > 0)
        for (const w of N)
          await a.log(`  - ${w.name} (from ${w.libraryName})`);
    } catch (m) {
      await a.warning(
        `Could not get library variable collections: ${m instanceof Error ? m.message : String(m)}`
      );
    }
    await a.log("Extracting node data from page..."), await a.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await a.log(
      "Collections will be discovered as variables are processed:"
    );
    const E = await Ee(
      s,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: u,
        collectionTable: f,
        instanceTable: h
      }
    );
    await a.log("Node extraction finished");
    const c = ve(E), R = u.getSize(), p = f.getSize(), P = h.getSize();
    if (await a.log("Extraction complete:"), await a.log(`  - Total nodes: ${c}`), await a.log(`  - Unique variables: ${R}`), await a.log(`  - Unique collections: ${p}`), await a.log(`  - Unique instances: ${P}`), p > 0) {
      await a.log("Collections found:");
      const m = f.getTable();
      for (const [w, $] of Object.values(m).entries()) {
        const b = $.collectionGuid ? ` (GUID: ${$.collectionGuid.substring(0, 8)}...)` : "";
        await a.log(
          `  ${w}: ${$.collectionName}${b} - ${$.modes.length} mode(s)`
        );
      }
    }
    await a.log("Checking for referenced component pages...");
    const V = [], x = h.getSerializedTable(), G = Object.values(x).filter(
      (m) => m.instanceType === "normal"
    );
    if (G.length > 0) {
      await a.log(
        `Found ${G.length} normal instance(s) to check`
      );
      const m = /* @__PURE__ */ new Map();
      for (const w of G)
        if (w.componentPageName) {
          const $ = r.find((b) => b.name === w.componentPageName);
          if ($ && !t.has($.id))
            m.has($.id) || m.set($.id, $);
          else if (!$) {
            const b = `Normal instance references component "${w.componentName || "(unnamed)"}" on page "${w.componentPageName}", but that page was not found. Cannot export.`;
            throw await a.error(b), new Error(b);
          }
        } else {
          const $ = `Normal instance references component "${w.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw await a.error($), new Error($);
        }
      await a.log(
        `Found ${m.size} unique referenced page(s)`
      );
      for (const [w, $] of m.entries()) {
        const b = $.name;
        if (t.has(w)) {
          await a.log(`Skipping "${b}" - already processed`);
          continue;
        }
        const v = $.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let I = !1;
        if (v)
          try {
            const k = JSON.parse(v);
            I = !!(k.id && k.version !== void 0);
          } catch (k) {
          }
        const S = `Do you want to also publish referenced component "${b}"?`;
        try {
          await se.prompt(S, {
            okLabel: "Yes",
            cancelLabel: "No",
            timeoutMs: 3e5
            // 5 minutes
          }), await a.log(`Exporting referenced page: "${b}"`);
          const k = r.findIndex(
            (H) => H.id === $.id
          );
          if (k === -1)
            throw await a.error(
              `Could not find page index for "${b}"`
            ), new Error(`Could not find page index for "${b}"`);
          const K = await Le(
            {
              pageIndex: k
            },
            t,
            // Pass the same set to track all processed pages
            !0
            // Mark as recursive call
          );
          if (K.success && K.data) {
            const H = K.data;
            V.push(H), await a.log(
              `Successfully exported referenced page: "${b}"`
            );
          } else
            throw new Error(
              `Failed to export referenced page "${b}": ${K.message}`
            );
        } catch (k) {
          if (k instanceof Error && k.message === "User cancelled")
            if (I)
              await a.log(
                `User declined to publish "${b}", but page has existing metadata. Continuing with existing metadata.`
              );
            else
              throw await a.error(
                `Export cancelled: Referenced page "${b}" has no metadata and user declined to publish it.`
              ), new Error(
                `Cannot continue export: Referenced component "${b}" has no metadata. Please publish it first or choose to publish it now.`
              );
          else
            throw k;
        }
      }
    }
    await a.log("Creating string table...");
    const B = new $e();
    await a.log("Getting page metadata...");
    const O = s.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let C = "", y = 0;
    if (O)
      try {
        const m = JSON.parse(O);
        C = m.id || "", y = m.version || 0;
      } catch (m) {
        await a.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!C) {
      await a.log("Generating new GUID for page..."), C = await ke();
      const m = {
        _ver: 1,
        id: C,
        name: s.name,
        version: y,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      s.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(m)
      );
    }
    await a.log("Creating export data structure...");
    const A = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "1.0.0",
        figmaApiVersion: figma.apiVersion,
        guid: C,
        version: y,
        name: s.name,
        pluginVersion: "1.0.0"
      },
      stringTable: B.getSerializedTable(),
      collections: f.getSerializedTable(),
      variables: u.getSerializedTable(),
      instances: h.getSerializedTable(),
      libraries: N,
      // Libraries might not need compression, but could be added later
      pageData: E
    };
    await a.log("Compressing JSON data...");
    const T = Ft(A, B);
    await a.log("Serializing to JSON...");
    const U = JSON.stringify(T, null, 2), L = (U.length / 1024).toFixed(2), l = be(s.name).trim().replace(/\s+/g, "_") + ".figma.json";
    await a.log(`JSON serialization complete: ${L} KB`), await a.log(`Export file: ${l}`), await a.log("=== Export Complete ===");
    const g = JSON.parse(U);
    return {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: l,
        pageData: g,
        pageName: s.name,
        additionalPages: V
        // Populated with referenced component pages
      }
    };
  } catch (i) {
    const r = i instanceof Error ? i.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", i), console.error("Error message:", r), await a.error(`Export failed: ${r}`), i instanceof Error && i.stack && (console.error("Stack trace:", i.stack), await a.error(`Stack trace: ${i.stack}`));
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
          const h = await figma.variables.importVariableByKeyAsync(f[0].key), N = await figma.variables.getVariableCollectionByIdAsync(
            h.variableCollectionId
          );
          if (N) {
            if (t = N, e.collectionGuid) {
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
    const o = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), u = e.collectionName.trim().toLowerCase(), f = o.find((c) => c.name.trim().toLowerCase() === u);
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
    const N = await figma.variables.importVariableByKeyAsync(
      h[0].key
    ), E = await figma.variables.getVariableCollectionByIdAsync(
      N.variableCollectionId
    );
    if (!E)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (t = E, e.collectionGuid) {
      const c = t.getSharedPluginData(
        "recursica",
        ee
      );
      (!c || c.trim() === "") && t.setSharedPluginData(
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
  for (const [s, o] of Object.entries(t)) {
    const u = i.modes.find((h) => h.name === s);
    if (!u) {
      console.warn(
        `Mode "${s}" not found in collection "${i.name}" for variable "${e.name}". Skipping.`
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
        let N = null;
        const E = n.getVariableByIndex(
          h._varRef
        );
        if (E) {
          let c = null;
          if (r && E._colRef !== void 0) {
            const R = r.getCollectionByIndex(
              E._colRef
            );
            R && (c = (await Wt(R)).collection);
          }
          c && (N = await _e(
            c,
            E.variableName
          ));
        }
        if (N) {
          const c = {
            type: "VARIABLE_ALIAS",
            id: N.id
          };
          e.setValueForMode(f, c);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${s}" in variable "${e.name}". Variable reference index: ${h._varRef}`
          );
      }
    } catch (h) {
      console.warn(
        `Error setting value for mode "${s}" in variable "${e.name}":`,
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
  const s = i.get(String(r._colRef));
  if (!s)
    return null;
  const o = await _e(
    s,
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
    s,
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
      const s = t[n];
      if (Array.isArray(s))
        for (let o = 0; o < s.length && o < r.length; o++) {
          const u = s[o];
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
                  const N = h._varRef;
                  if (N !== void 0) {
                    const E = i.get(String(N));
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
async function ce(e, t, n = null, i = null, r = null, s = null, o = null, u = !1, f = null, h = null, N = null, E = null) {
  var y, A, T, U, L, _;
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
      if (e.id && o && o.has(e.id))
        c = o.get(e.id), await a.log(
          `Reusing existing COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id.substring(0, 8)}...)`
        );
      else if (c = figma.createComponent(), await a.log(
        `Created COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id ? e.id.substring(0, 8) + "..." : "no ID"})`
      ), e.componentPropertyDefinitions) {
        const l = e.componentPropertyDefinitions;
        let g = 0, d = 0;
        for (const [m, w] of Object.entries(l))
          try {
            const $ = w.type;
            let b = null;
            if (typeof $ == "string" ? ($ === "TEXT" || $ === "BOOLEAN" || $ === "INSTANCE_SWAP" || $ === "VARIANT") && (b = $) : typeof $ == "number" && (b = {
              2: "TEXT",
              // Text property
              25: "BOOLEAN",
              // Boolean property
              27: "INSTANCE_SWAP",
              // Instance swap property
              26: "VARIANT"
              // Variant property
            }[$] || null), !b) {
              await a.warning(
                `  Unknown property type ${$} (${typeof $}) for property "${m}" in component "${e.name || "Unnamed"}"`
              ), d++;
              continue;
            }
            const v = w.defaultValue, I = m.split("#")[0];
            c.addComponentProperty(
              I,
              b,
              v
            ), g++;
          } catch ($) {
            await a.warning(
              `  Failed to add component property "${m}" to "${e.name || "Unnamed"}": ${$}`
            ), d++;
          }
        g > 0 && await a.log(
          `  Added ${g} component property definition(s) to "${e.name || "Unnamed"}"${d > 0 ? ` (${d} failed)` : ""}`
        );
      }
      break;
    case "COMPONENT_SET": {
      const l = e.children ? e.children.filter((m) => m.type === "COMPONENT").length : 0;
      await a.log(
        `Creating COMPONENT_SET "${e.name || "Unnamed"}" by combining ${l} component variant(s)`
      );
      const g = [];
      let d = null;
      if (e.children && Array.isArray(e.children)) {
        d = figma.createFrame(), d.name = `_temp_${e.name || "COMPONENT_SET"}`, d.visible = !1, ((t == null ? void 0 : t.type) === "PAGE" ? t : figma.currentPage).appendChild(d);
        for (const w of e.children)
          if (w.type === "COMPONENT" && !w._truncated)
            try {
              const $ = await ce(
                w,
                d,
                // Use temp parent for now
                n,
                i,
                r,
                s,
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
                `  Failed to create component variant "${w.name || "Unnamed"}": ${$}`
              );
            }
      }
      if (g.length > 0)
        try {
          const m = t || figma.currentPage, w = figma.combineAsVariants(
            g,
            m
          );
          e.name && (w.name = e.name), e.x !== void 0 && (w.x = e.x), e.y !== void 0 && (w.y = e.y), d && d.parent && d.remove(), await a.log(
            `  ✓ Successfully created COMPONENT_SET "${w.name}" with ${g.length} variant(s)`
          ), c = w;
        } catch (m) {
          if (await a.warning(
            `  Failed to combine components into COMPONENT_SET "${e.name || "Unnamed"}": ${m}. Falling back to frame.`
          ), c = figma.createFrame(), e.name && (c.name = e.name), d && d.children.length > 0) {
            for (const w of d.children)
              c.appendChild(w);
            d.remove();
          }
        }
      else
        await a.warning(
          `  No valid component variants found for COMPONENT_SET "${e.name || "Unnamed"}". Creating frame instead.`
        ), c = figma.createFrame(), e.name && (c.name = e.name), d && d.remove();
      break;
    }
    case "INSTANCE":
      if (u)
        c = figma.createFrame(), e.name && (c.name = e.name);
      else if (e._instanceRef !== void 0 && r && o) {
        const l = r.getInstanceByIndex(
          e._instanceRef
        );
        if (l && l.instanceType === "internal")
          if (l.componentNodeId)
            if (l.componentNodeId === e.id)
              await a.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), c = figma.createFrame(), e.name && (c.name = e.name);
            else {
              const g = o.get(
                l.componentNodeId
              );
              if (!g) {
                const d = Array.from(o.keys()).slice(
                  0,
                  20
                );
                await a.error(
                  `Component not found for internal instance "${e.name}" (ID: ${l.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), await a.error(
                  `Looking for component ID: ${l.componentNodeId}`
                ), await a.error(
                  `Available IDs in mapping (first 20): ${d.map((v) => v.substring(0, 8) + "...").join(", ")}`
                );
                const m = (v, I) => {
                  if (v.type === "COMPONENT" && v.id === I)
                    return !0;
                  if (v.children && Array.isArray(v.children)) {
                    for (const S of v.children)
                      if (!S._truncated && m(S, I))
                        return !0;
                  }
                  return !1;
                }, w = m(
                  e,
                  l.componentNodeId
                );
                await a.error(
                  `Component ID ${l.componentNodeId.substring(0, 8)}... exists in current node tree: ${w}`
                ), await a.error(
                  `WARNING: Component ID ${l.componentNodeId.substring(0, 8)}... not found in nodeIdMapping. This might indicate:`
                ), await a.error(
                  "  1. The component doesn't exist in the pageData (detached component?)"
                ), await a.error(
                  "  2. The component wasn't collected in the first pass"
                ), await a.error(
                  "  3. The component ID in the instance table doesn't match the actual component ID"
                );
                const $ = d.filter(
                  (v) => v.startsWith(l.componentNodeId.substring(0, 8))
                );
                $.length > 0 && await a.error(
                  `Found IDs with matching prefix: ${$.map((v) => v.substring(0, 8) + "...").join(", ")}`
                );
                const b = `Component not found for internal instance "${e.name}" (ID: ${l.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${d.map((v) => v.substring(0, 8) + "...").join(", ")}`;
                throw new Error(b);
              }
              if (g && g.type === "COMPONENT") {
                if (c = g.createInstance(), await a.log(
                  `✓ Created internal instance "${e.name}" from component "${l.componentName}"`
                ), l.variantProperties && Object.keys(l.variantProperties).length > 0)
                  try {
                    let d = null;
                    if (g.parent && g.parent.type === "COMPONENT_SET")
                      d = g.parent.componentPropertyDefinitions, await a.log(
                        `  DEBUG: Component "${l.componentName}" is inside component set "${g.parent.name}" with ${Object.keys(d || {}).length} property definitions`
                      );
                    else {
                      const m = await c.getMainComponentAsync();
                      if (m) {
                        const w = m.type;
                        await a.log(
                          `  DEBUG: Internal instance "${e.name}" - componentNode parent: ${g.parent ? g.parent.type : "N/A"}, mainComponent type: ${w}, mainComponent parent: ${m.parent ? m.parent.type : "N/A"}`
                        ), w === "COMPONENT_SET" ? d = m.componentPropertyDefinitions : w === "COMPONENT" && m.parent && m.parent.type === "COMPONENT_SET" ? (d = m.parent.componentPropertyDefinitions, await a.log(
                          `  DEBUG: Found component set parent "${m.parent.name}" with ${Object.keys(d || {}).length} property definitions`
                        )) : await a.log(
                          `  Skipping variant properties for internal instance "${e.name}" - component "${l.componentName}" is not yet in a COMPONENT_SET (will be moved later during component set creation)`
                        );
                      }
                    }
                    if (d) {
                      const m = {};
                      for (const [w, $] of Object.entries(
                        l.variantProperties
                      )) {
                        const b = w.split("#")[0];
                        d[b] && (m[b] = $);
                      }
                      Object.keys(m).length > 0 && c.setProperties(m);
                    }
                  } catch (d) {
                    const m = `Failed to set variant properties for instance "${e.name}": ${d}`;
                    throw await a.error(m), new Error(m);
                  }
                if (l.componentProperties && Object.keys(l.componentProperties).length > 0)
                  try {
                    const d = await c.getMainComponentAsync();
                    if (d) {
                      let m = null;
                      const w = d.type;
                      if (w === "COMPONENT_SET" ? m = d.componentPropertyDefinitions : w === "COMPONENT" && d.parent && d.parent.type === "COMPONENT_SET" ? m = d.parent.componentPropertyDefinitions : w === "COMPONENT" && (m = d.componentPropertyDefinitions), m)
                        for (const [$, b] of Object.entries(
                          l.componentProperties
                        )) {
                          const v = $.split("#")[0];
                          if (m[v])
                            try {
                              let I = b;
                              b && typeof b == "object" && "value" in b && (I = b.value), c.setProperties({
                                [v]: I
                              });
                            } catch (I) {
                              const S = `Failed to set component property "${v}" for internal instance "${e.name}": ${I}`;
                              throw await a.error(S), new Error(S);
                            }
                        }
                    } else
                      await a.warning(
                        `Cannot set component properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (d) {
                    if (d instanceof Error)
                      throw d;
                    const m = `Failed to set component properties for instance "${e.name}": ${d}`;
                    throw await a.error(m), new Error(m);
                  }
              } else if (!c && g) {
                const d = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${l.componentNodeId.substring(0, 8)}...).`;
                throw await a.error(d), new Error(d);
              }
            }
          else {
            const g = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw await a.error(g), new Error(g);
          }
        else if (l && l.instanceType === "remote")
          if (f) {
            const g = f.get(
              e._instanceRef
            );
            if (g) {
              if (c = g.createInstance(), await a.log(
                `✓ Created remote instance "${e.name}" from component "${l.componentName}" on REMOTES page`
              ), l.variantProperties && Object.keys(l.variantProperties).length > 0)
                try {
                  const d = await c.getMainComponentAsync();
                  if (d) {
                    let m = null;
                    const w = d.type;
                    if (w === "COMPONENT_SET" ? m = d.componentPropertyDefinitions : w === "COMPONENT" && d.parent && d.parent.type === "COMPONENT_SET" ? m = d.parent.componentPropertyDefinitions : await a.log(
                      `Skipping variant properties for remote instance "${e.name}" - main component is not a COMPONENT_SET or variant (expected for remote components)`
                    ), m) {
                      const $ = {};
                      for (const [b, v] of Object.entries(
                        l.variantProperties
                      )) {
                        const I = b.split("#")[0];
                        m[I] && ($[I] = v);
                      }
                      Object.keys($).length > 0 && c.setProperties($);
                    }
                  } else
                    await a.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (d) {
                  const m = `Failed to set variant properties for remote instance "${e.name}": ${d}`;
                  throw await a.error(m), new Error(m);
                }
              if (l.componentProperties && Object.keys(l.componentProperties).length > 0)
                try {
                  const d = await c.getMainComponentAsync();
                  if (d) {
                    let m = null;
                    const w = d.type;
                    if (w === "COMPONENT_SET" ? m = d.componentPropertyDefinitions : w === "COMPONENT" && d.parent && d.parent.type === "COMPONENT_SET" ? m = d.parent.componentPropertyDefinitions : w === "COMPONENT" && (m = d.componentPropertyDefinitions), m)
                      for (const [$, b] of Object.entries(
                        l.componentProperties
                      )) {
                        const v = $.split("#")[0];
                        if (m[v])
                          try {
                            let I = b;
                            b && typeof b == "object" && "value" in b && (I = b.value), c.setProperties({
                              [v]: I
                            });
                          } catch (I) {
                            const S = `Failed to set component property "${v}" for remote instance "${e.name}": ${I}`;
                            throw await a.error(S), new Error(S);
                          }
                      }
                  } else
                    await a.warning(
                      `Cannot set component properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (d) {
                  if (d instanceof Error)
                    throw d;
                  const m = `Failed to set component properties for remote instance "${e.name}": ${d}`;
                  throw await a.error(m), new Error(m);
                }
              if (e.width !== void 0 && e.height !== void 0)
                try {
                  c.resize(e.width, e.height);
                } catch (d) {
                  await a.log(
                    `Note: Could not resize remote instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
                  );
                }
            } else {
              const d = `Remote component not found for instance "${e.name}" (index ${e._instanceRef}). The remote component should have been created on the REMOTES page.`;
              throw await a.error(d), new Error(d);
            }
          } else {
            const g = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw await a.error(g), new Error(g);
          }
        else if ((l == null ? void 0 : l.instanceType) === "normal") {
          if (!l.componentPageName) {
            const b = `Normal instance "${e.name}" missing componentPageName. Cannot resolve.`;
            throw await a.error(b), new Error(b);
          }
          await figma.loadAllPagesAsync();
          const g = figma.root.children.find(
            (b) => b.name === l.componentPageName
          );
          if (!g) {
            await a.log(
              `  Deferring normal instance "${e.name}" - referenced page "${l.componentPageName}" does not exist yet (may be circular reference or not yet imported)`
            );
            const b = figma.createFrame();
            b.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (b.x = e.x), e.y !== void 0 && (b.y = e.y), e.width !== void 0 && e.height !== void 0 ? b.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && b.resize(e.w, e.h), h && h.push({
              placeholderFrame: b,
              instanceEntry: l,
              nodeData: e,
              parentNode: t,
              instanceIndex: e._instanceRef
            }), c = b;
            break;
          }
          let d = null;
          const m = (b, v, I, S, k) => {
            if (v.length === 0) {
              let J = null;
              for (const M of b.children || [])
                if (M.type === "COMPONENT") {
                  if (M.name === I)
                    if (J || (J = M), S)
                      try {
                        const j = M.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (j && JSON.parse(j).id === S)
                          return M;
                      } catch (j) {
                      }
                    else
                      return M;
                } else if (M.type === "COMPONENT_SET") {
                  if (k && M.name !== k)
                    continue;
                  for (const j of M.children || [])
                    if (j.type === "COMPONENT" && j.name === I)
                      if (J || (J = j), S)
                        try {
                          const W = j.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (W && JSON.parse(W).id === S)
                            return j;
                        } catch (W) {
                        }
                      else
                        return j;
                }
              return J;
            }
            const [K, ...H] = v;
            for (const J of b.children || [])
              if (J.name === K) {
                if (H.length === 0 && J.type === "COMPONENT_SET") {
                  if (k && J.name !== k)
                    continue;
                  for (const M of J.children || [])
                    if (M.type === "COMPONENT" && M.name === I) {
                      if (S)
                        try {
                          const j = M.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (j && JSON.parse(j).id === S)
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
                  I,
                  S,
                  k
                );
              }
            return null;
          };
          await a.log(
            `  Looking for component "${l.componentName}" on page "${l.componentPageName}"${l.path && l.path.length > 0 ? ` at path [${l.path.join(" → ")}]` : " at page root"}${l.componentGuid ? ` (GUID: ${l.componentGuid.substring(0, 8)}...)` : ""}`
          );
          const w = [], $ = (b, v = 0) => {
            const I = "  ".repeat(v);
            if (b.type === "COMPONENT")
              w.push(`${I}COMPONENT: "${b.name}"`);
            else if (b.type === "COMPONENT_SET") {
              w.push(
                `${I}COMPONENT_SET: "${b.name}"`
              );
              for (const S of b.children || [])
                S.type === "COMPONENT" && w.push(
                  `${I}  └─ COMPONENT: "${S.name}"`
                );
            }
            for (const S of b.children || [])
              $(S, v + 1);
          };
          if ($(g), w.length > 0 ? await a.log(
            `  Available components on page "${l.componentPageName}":
${w.slice(0, 20).join(`
`)}${w.length > 20 ? `
  ... and ${w.length - 20} more` : ""}`
          ) : await a.warning(
            `  No components found on page "${l.componentPageName}"`
          ), d = m(
            g,
            l.path || [],
            l.componentName,
            l.componentGuid,
            l.componentSetName
          ), d && l.componentGuid)
            try {
              const b = d.getPluginData(
                "RecursicaPublishedMetadata"
              );
              if (b) {
                const v = JSON.parse(b);
                v.id !== l.componentGuid ? await a.warning(
                  `  Found component "${l.componentName}" by name but GUID verification failed (expected ${l.componentGuid.substring(0, 8)}..., got ${v.id ? v.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`
                ) : await a.log(
                  `  Found component "${l.componentName}" with matching GUID ${l.componentGuid.substring(0, 8)}...`
                );
              } else
                await a.warning(
                  `  Found component "${l.componentName}" by name but no metadata found. Using name match as fallback.`
                );
            } catch (b) {
              await a.warning(
                `  Found component "${l.componentName}" by name but GUID verification failed. Using name match as fallback.`
              );
            }
          if (!d) {
            await a.log(
              `  Deferring normal instance "${e.name}" - component "${l.componentName}" not found on page "${l.componentPageName}" (may not be created yet due to circular reference)`
            );
            const b = figma.createFrame();
            b.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (b.x = e.x), e.y !== void 0 && (b.y = e.y), e.width !== void 0 && e.height !== void 0 ? b.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && b.resize(e.w, e.h), h && h.push({
              placeholderFrame: b,
              instanceEntry: l,
              nodeData: e,
              parentNode: t,
              instanceIndex: e._instanceRef
            }), c = b;
            break;
          }
          if (c = d.createInstance(), await a.log(
            `  Created normal instance "${e.name}" from component "${l.componentName}" on page "${l.componentPageName}"`
          ), l.variantProperties && Object.keys(l.variantProperties).length > 0)
            try {
              const b = await c.getMainComponentAsync();
              if (b) {
                let v = null;
                const I = b.type;
                if (I === "COMPONENT_SET" ? v = b.componentPropertyDefinitions : I === "COMPONENT" && b.parent && b.parent.type === "COMPONENT_SET" ? v = b.parent.componentPropertyDefinitions : await a.warning(
                  `Cannot set variant properties for normal instance "${e.name}" - main component is not a COMPONENT_SET or variant`
                ), v) {
                  const S = {};
                  for (const [k, K] of Object.entries(
                    l.variantProperties
                  )) {
                    const H = k.split("#")[0];
                    v[H] && (S[H] = K);
                  }
                  Object.keys(S).length > 0 && c.setProperties(S);
                }
              }
            } catch (b) {
              await a.warning(
                `Failed to set variant properties for normal instance "${e.name}": ${b}`
              );
            }
          if (l.componentProperties && Object.keys(l.componentProperties).length > 0)
            try {
              const b = await c.getMainComponentAsync();
              if (b) {
                let v = null;
                const I = b.type;
                if (I === "COMPONENT_SET" ? v = b.componentPropertyDefinitions : I === "COMPONENT" && b.parent && b.parent.type === "COMPONENT_SET" ? v = b.parent.componentPropertyDefinitions : I === "COMPONENT" && (v = b.componentPropertyDefinitions), v) {
                  const S = {};
                  for (const [k, K] of Object.entries(
                    l.componentProperties
                  )) {
                    const H = k.split("#")[0];
                    let J;
                    if (v[k] ? J = k : v[H] ? J = H : J = Object.keys(v).find(
                      (M) => M.split("#")[0] === H
                    ), J) {
                      const M = K && typeof K == "object" && "value" in K ? K.value : K;
                      S[J] = M;
                    } else
                      await a.warning(
                        `Component property "${H}" (from "${k}") does not exist on component "${l.componentName}" for normal instance "${e.name}". Available properties: ${Object.keys(v).join(", ") || "none"}`
                      );
                  }
                  if (Object.keys(S).length > 0)
                    try {
                      await a.log(
                        `  Attempting to set component properties for normal instance "${e.name}": ${Object.keys(S).join(", ")}`
                      ), await a.log(
                        `  Available component properties: ${Object.keys(v).join(", ")}`
                      ), c.setProperties(S), await a.log(
                        `  ✓ Successfully set component properties for normal instance "${e.name}": ${Object.keys(S).join(", ")}`
                      );
                    } catch (k) {
                      await a.warning(
                        `Failed to set component properties for normal instance "${e.name}": ${k}`
                      ), await a.warning(
                        `  Properties attempted: ${JSON.stringify(S)}`
                      ), await a.warning(
                        `  Available properties: ${JSON.stringify(Object.keys(v))}`
                      );
                    }
                }
              } else
                await a.warning(
                  `Cannot set component properties for normal instance "${e.name}" - main component not found`
                );
            } catch (b) {
              await a.warning(
                `Failed to set component properties for normal instance "${e.name}": ${b}`
              );
            }
          if (e.width !== void 0 && e.height !== void 0)
            try {
              c.resize(e.width, e.height);
            } catch (b) {
              await a.log(
                `Note: Could not resize normal instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
              );
            }
        } else {
          const g = `Instance "${e.name}" has unknown or missing instance type: ${(l == null ? void 0 : l.instanceType) || "unknown"}`;
          throw await a.error(g), new Error(g);
        }
      } else {
        const l = `Instance "${e.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        throw await a.error(l), new Error(l);
      }
      break;
    case "GROUP":
      c = figma.createFrame();
      break;
    case "BOOLEAN_OPERATION": {
      const l = `Boolean operation nodes cannot be imported. Found boolean operation: "${e.name}".`;
      throw await a.error(l), new Error(l);
    }
    case "POLYGON":
      c = figma.createPolygon();
      break;
    default: {
      const l = `Unsupported node type: ${e.type}. This node type cannot be imported.`;
      throw await a.error(l), new Error(l);
    }
  }
  if (!c)
    return null;
  e.id && o && (o.set(e.id, c), c.type === "COMPONENT" && await a.log(
    `  Stored COMPONENT "${e.name || "Unnamed"}" in nodeIdMapping (ID: ${e.id.substring(0, 8)}...)`
  )), e._instanceRef !== void 0 && c.type === "INSTANCE" ? (o._instanceTableMap || (o._instanceTableMap = /* @__PURE__ */ new Map()), o._instanceTableMap.set(
    c.id,
    e._instanceRef
  ), await a.log(
    `  Stored instance table mapping: instance "${c.name}" (ID: ${c.id.substring(0, 8)}...) -> instance table index ${e._instanceRef}`
  )) : c.type === "INSTANCE" && await a.log(
    `  WARNING: Instance "${c.name}" (ID: ${c.id.substring(0, 8)}...) has no _instanceRef in nodeData - will use fallback matching in third pass`
  );
  const R = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.paddingLeft || e.boundVariables.paddingRight || e.boundVariables.paddingTop || e.boundVariables.paddingBottom || e.boundVariables.itemSpacing);
  Yt(
    c,
    e.type || "FRAME",
    R
  ), e.name !== void 0 && (c.name = e.name || "Unnamed Node");
  const p = N && N.layoutMode !== void 0 && N.layoutMode !== "NONE", P = t && "layoutMode" in t && t.layoutMode !== "NONE";
  p || P || (e.x !== void 0 && (c.x = e.x), e.y !== void 0 && (c.y = e.y));
  const x = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
  e.type !== "VECTOR" && e.width !== void 0 && e.height !== void 0 && !x && c.resize(e.width, e.height);
  const G = e.boundVariables && typeof e.boundVariables == "object";
  if (e.visible !== void 0 && (c.visible = e.visible), e.locked !== void 0 && (c.locked = e.locked), e.opacity !== void 0 && (!G || !e.boundVariables.opacity) && (c.opacity = e.opacity), e.rotation !== void 0 && (!G || !e.boundVariables.rotation) && (c.rotation = e.rotation), e.blendMode !== void 0 && (!G || !e.boundVariables.blendMode) && (c.blendMode = e.blendMode), e.type !== "INSTANCE") {
    if (e.type === "VECTOR" && e.boundVariables && (await a.log(
      `  DEBUG: VECTOR "${e.name || "Unnamed"}" (ID: ${((y = e.id) == null ? void 0 : y.substring(0, 8)) || "unknown"}...) has boundVariables: ${Object.keys(e.boundVariables).join(", ")}`
    ), e.boundVariables.fills && await a.log(
      `  DEBUG:   boundVariables.fills: ${JSON.stringify(e.boundVariables.fills)}`
    )), e.fills !== void 0)
      try {
        let l = e.fills;
        if (Array.isArray(l) && (l = l.map((g) => {
          if (g && typeof g == "object") {
            const d = z({}, g);
            return delete d.boundVariables, d;
          }
          return g;
        })), e.fills && Array.isArray(e.fills) && s) {
          if (e.type === "VECTOR") {
            await a.log(
              `  DEBUG: VECTOR "${e.name || "Unnamed"}" has ${e.fills.length} fill(s)`
            );
            for (let d = 0; d < e.fills.length; d++) {
              const m = e.fills[d];
              if (m && typeof m == "object") {
                const w = m.boundVariables || m.bndVar;
                w ? await a.log(
                  `  DEBUG:   fill[${d}] has boundVariables: ${JSON.stringify(w)}`
                ) : await a.log(
                  `  DEBUG:   fill[${d}] has no boundVariables`
                );
              }
            }
          }
          const g = [];
          for (let d = 0; d < l.length; d++) {
            const m = l[d], w = e.fills[d];
            if (!w || typeof w != "object") {
              g.push(m);
              continue;
            }
            const $ = w.boundVariables || w.bndVar;
            if (!$) {
              g.push(m);
              continue;
            }
            const b = z({}, m);
            b.boundVariables = {};
            for (const [v, I] of Object.entries($))
              if (e.type === "VECTOR" && await a.log(
                `  DEBUG: Processing fill[${d}].${v} on VECTOR "${c.name || "Unnamed"}": varInfo=${JSON.stringify(I)}`
              ), ne(I)) {
                const S = I._varRef;
                if (S !== void 0) {
                  if (e.type === "VECTOR") {
                    await a.log(
                      `  DEBUG: Looking up variable reference ${S} in recognizedVariables (map has ${s.size} entries)`
                    );
                    const K = Array.from(
                      s.keys()
                    ).slice(0, 10);
                    await a.log(
                      `  DEBUG: Available variable references (first 10): ${K.join(", ")}`
                    );
                    const H = s.has(String(S));
                    if (await a.log(
                      `  DEBUG: Variable reference ${S} ${H ? "found" : "NOT FOUND"} in recognizedVariables`
                    ), !H) {
                      const J = Array.from(
                        s.keys()
                      ).sort((M, j) => parseInt(M) - parseInt(j));
                      await a.log(
                        `  DEBUG: All available variable references: ${J.join(", ")}`
                      );
                    }
                  }
                  let k = s.get(String(S));
                  k || (e.type === "VECTOR" && await a.log(
                    `  DEBUG: Variable ${S} not in recognizedVariables. variableTable=${!!n}, collectionTable=${!!i}, recognizedCollections=${!!E}`
                  ), n && i && E ? (await a.log(
                    `  Variable reference ${S} not in recognizedVariables, attempting to resolve from variable table...`
                  ), k = await Ht(
                    S,
                    n,
                    i,
                    E
                  ) || void 0, k ? (s.set(String(S), k), await a.log(
                    `  ✓ Resolved variable ${k.name} from variable table and added to recognizedVariables`
                  )) : await a.warning(
                    `  Failed to resolve variable ${S} from variable table`
                  )) : e.type === "VECTOR" && await a.warning(
                    `  Cannot resolve variable ${S} from table - missing required parameters`
                  )), k ? (b.boundVariables[v] = {
                    type: "VARIABLE_ALIAS",
                    id: k.id
                  }, await a.log(
                    `  ✓ Restored bound variable for fill[${d}].${v} on "${c.name || "Unnamed"}" (${e.type}): variable ${k.name} (ID: ${k.id.substring(0, 8)}...)`
                  )) : await a.warning(
                    `  Variable reference ${S} not found in recognizedVariables for fill[${d}].${v} on "${c.name || "Unnamed"}"`
                  );
                } else
                  e.type === "VECTOR" && await a.warning(
                    `  DEBUG: Variable reference ${S} is undefined for fill[${d}].${v} on VECTOR "${c.name || "Unnamed"}"`
                  );
              } else
                e.type === "VECTOR" && await a.warning(
                  `  DEBUG: fill[${d}].${v} on VECTOR "${c.name || "Unnamed"}" is not a variable reference: ${JSON.stringify(I)}`
                );
            g.push(b);
          }
          c.fills = g, await a.log(
            `  ✓ Set fills with boundVariables on "${c.name || "Unnamed"}" (${e.type})`
          );
        } else
          c.fills = l;
        e.boundVariables && Object.keys(e.boundVariables).length > 0 && !e.boundVariables.fills && await a.log(
          `  Node "${c.name || "Unnamed"}" (${e.type}) has boundVariables but not for fills: ${Object.keys(e.boundVariables).join(", ")}`
        );
      } catch (l) {
        console.log("Error setting fills:", l);
      }
    else if (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "GROUP")
      try {
        c.fills = [];
      } catch (l) {
        console.log("Error clearing fills:", l);
      }
  }
  if (e.strokes !== void 0)
    try {
      e.strokes.length > 0 ? c.strokes = e.strokes : c.strokes = [];
    } catch (l) {
      console.log("Error setting strokes:", l);
    }
  else if (e.type === "VECTOR")
    try {
      c.strokes = [];
    } catch (l) {
    }
  const B = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.strokeWeight || e.boundVariables.strokeAlign);
  e.strokeWeight !== void 0 ? (!B || !e.boundVariables.strokeWeight) && (c.strokeWeight = e.strokeWeight) : e.type === "VECTOR" && (e.strokes === void 0 || e.strokes.length === 0) && (!B || !e.boundVariables.strokeWeight) && (c.strokeWeight = 0), e.strokeAlign !== void 0 && (!B || !e.boundVariables.strokeAlign) && (c.strokeAlign = e.strokeAlign);
  const O = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.cornerRadius || e.boundVariables.topLeftRadius || e.boundVariables.topRightRadius || e.boundVariables.bottomLeftRadius || e.boundVariables.bottomRightRadius);
  if (e.cornerRadius !== void 0 && (!O || !e.boundVariables.cornerRadius) && (c.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (c.effects = e.effects), e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") {
    if (e.layoutMode !== void 0 && (c.layoutMode = e.layoutMode), e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.boundVariables && s) {
      const g = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ];
      for (const d of g) {
        const m = e.boundVariables[d];
        if (m && ne(m)) {
          const w = m._varRef;
          if (w !== void 0) {
            const $ = s.get(String(w));
            if ($) {
              const b = {
                type: "VARIABLE_ALIAS",
                id: $.id
              };
              c.boundVariables || (c.boundVariables = {});
              const v = c[d], I = (A = c.boundVariables) == null ? void 0 : A[d];
              await a.log(
                `  DEBUG: Attempting to set bound variable for ${d} on "${e.name || "Unnamed"}": current value=${v}, current boundVar=${JSON.stringify(I)}`
              );
              try {
                delete c.boundVariables[d];
              } catch (k) {
              }
              try {
                c.boundVariables[d] = b;
                const k = (T = c.boundVariables) == null ? void 0 : T[d];
                await a.log(
                  `  DEBUG: Immediately after setting ${d} bound variable: ${JSON.stringify(k)}`
                );
              } catch (k) {
                await a.warning(
                  `  Error setting bound variable for ${d}: ${k}`
                );
              }
              const S = (U = c.boundVariables) == null ? void 0 : U[d];
              S && typeof S == "object" && S.type === "VARIABLE_ALIAS" && S.id === $.id ? await a.log(
                `  ✓ Set bound variable for ${d} on "${e.name || "Unnamed"}" (${e.type}): variable ${$.name} (ID: ${$.id.substring(0, 8)}...)`
              ) : await a.warning(
                `  Failed to set bound variable for ${d} on "${e.name || "Unnamed"}" - verification failed. Expected: ${JSON.stringify(b)}, Got: ${JSON.stringify(S)}`
              );
            }
          }
        }
      }
    }
    e.layoutWrap !== void 0 && (c.layoutWrap = e.layoutWrap), e.primaryAxisSizingMode !== void 0 ? c.primaryAxisSizingMode = e.primaryAxisSizingMode : c.primaryAxisSizingMode = "AUTO", e.counterAxisSizingMode !== void 0 ? c.counterAxisSizingMode = e.counterAxisSizingMode : c.counterAxisSizingMode = "AUTO", e.primaryAxisAlignItems !== void 0 && (c.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (c.counterAxisAlignItems = e.counterAxisAlignItems);
    const l = e.boundVariables && typeof e.boundVariables == "object";
    if (l) {
      const g = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ].filter((d) => e.boundVariables[d]);
      g.length > 0 && await a.log(
        `  DEBUG: Node "${e.name || "Unnamed"}" (${e.type}) has bound variables for: ${g.join(", ")}`
      );
    }
    e.paddingLeft !== void 0 && (!l || !e.boundVariables.paddingLeft) && (c.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (!l || !e.boundVariables.paddingRight) && (c.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (!l || !e.boundVariables.paddingTop) && (c.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (!l || !e.boundVariables.paddingBottom) && (c.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (!l || !e.boundVariables.itemSpacing) && (c.itemSpacing = e.itemSpacing), e.layoutGrow !== void 0 && (c.layoutGrow = e.layoutGrow);
  }
  if ((e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (c.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (c.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (c.dashPattern = e.dashPattern), e.type === "VECTOR")) {
    if (e.fillGeometry !== void 0)
      try {
        const { normalizeSvgPath: g } = await Promise.resolve().then(() => Mt), d = e.fillGeometry.map((m) => {
          const w = m.data;
          return {
            data: g(w),
            windingRule: m.windingRule || m.windRule || "NONZERO"
          };
        });
        for (let m = 0; m < e.fillGeometry.length; m++) {
          const w = e.fillGeometry[m].data, $ = d[m].data;
          w !== $ && await a.log(
            `  Normalized path ${m + 1} for "${e.name || "Unnamed"}": ${w.substring(0, 50)}... -> ${$.substring(0, 50)}...`
          );
        }
        c.vectorPaths = d, await a.log(
          `  Set vectorPaths for VECTOR "${e.name || "Unnamed"}" (${d.length} path(s))`
        );
      } catch (g) {
        await a.warning(
          `Error setting vectorPaths for VECTOR "${e.name || "Unnamed"}": ${g}`
        );
      }
    if (e.strokeGeometry !== void 0)
      try {
        c.strokeGeometry = e.strokeGeometry;
      } catch (g) {
        await a.warning(
          `Error setting strokeGeometry for VECTOR "${e.name || "Unnamed"}": ${g}`
        );
      }
    const l = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
    if (e.width !== void 0 && e.height !== void 0 && !l)
      try {
        c.resize(e.width, e.height), await a.log(
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
          await figma.loadFontAsync(e.fontName), c.fontName = e.fontName;
        } catch (g) {
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
      const l = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.fontSize || e.boundVariables.letterSpacing || e.boundVariables.lineHeight);
      e.fontSize !== void 0 && (!l || !e.boundVariables.fontSize) && (c.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (c.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (c.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (!l || !e.boundVariables.letterSpacing) && (c.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (!l || !e.boundVariables.lineHeight) && (c.lineHeight = e.lineHeight), e.textCase !== void 0 && (c.textCase = e.textCase), e.textDecoration !== void 0 && (c.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (c.textAutoResize = e.textAutoResize);
    } catch (l) {
      console.log("Error setting text properties: " + l);
      try {
        c.characters = e.characters;
      } catch (g) {
        console.log("Could not set text characters: " + g);
      }
    }
  if (e.boundVariables && s) {
    const l = [
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "paddingBottom",
      "itemSpacing"
    ];
    for (const [g, d] of Object.entries(
      e.boundVariables
    ))
      if (g !== "fills" && !l.includes(g) && ne(d) && n && s) {
        const m = d._varRef;
        if (m !== void 0) {
          const w = s.get(String(m));
          if (w)
            try {
              const $ = {
                type: "VARIABLE_ALIAS",
                id: w.id
              };
              c.boundVariables || (c.boundVariables = {});
              const b = c[g];
              b !== void 0 && c.boundVariables[g] === void 0 && await a.warning(
                `  Property ${g} has direct value ${b} which may prevent bound variable from being set`
              ), c.boundVariables[g] = $;
              const I = (L = c.boundVariables) == null ? void 0 : L[g];
              if (I && typeof I == "object" && I.type === "VARIABLE_ALIAS" && I.id === w.id)
                await a.log(
                  `  ✓ Set bound variable for ${g} on "${e.name || "Unnamed"}" (${e.type}): variable ${w.name} (ID: ${w.id.substring(0, 8)}...)`
                );
              else {
                const S = (_ = c.boundVariables) == null ? void 0 : _[g];
                await a.warning(
                  `  Failed to set bound variable for ${g} on "${e.name || "Unnamed"}" - bound variable not persisted. Property value: ${b}, Expected: ${JSON.stringify($)}, Got: ${JSON.stringify(S)}`
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
  if (e.boundVariables && s && (e.boundVariables.width || e.boundVariables.height)) {
    const l = e.boundVariables.width, g = e.boundVariables.height;
    if (l && ne(l)) {
      const d = l._varRef;
      if (d !== void 0) {
        const m = s.get(String(d));
        if (m) {
          const w = {
            type: "VARIABLE_ALIAS",
            id: m.id
          };
          c.boundVariables || (c.boundVariables = {}), c.boundVariables.width = w;
        }
      }
    }
    if (g && ne(g)) {
      const d = g._varRef;
      if (d !== void 0) {
        const m = s.get(String(d));
        if (m) {
          const w = {
            type: "VARIABLE_ALIAS",
            id: m.id
          };
          c.boundVariables || (c.boundVariables = {}), c.boundVariables.height = w;
        }
      }
    }
  }
  const C = e.id && o && o.has(e.id) && c.type === "COMPONENT" && c.children && c.children.length > 0;
  if (e.children && Array.isArray(e.children) && c.type !== "INSTANCE" && !C) {
    const l = (d) => {
      const m = [];
      for (const w of d)
        w._truncated || (w.type === "COMPONENT" ? (m.push(w), w.children && Array.isArray(w.children) && m.push(...l(w.children))) : w.children && Array.isArray(w.children) && m.push(...l(w.children)));
      return m;
    };
    for (const d of e.children) {
      if (d._truncated) {
        console.log(
          `Skipping truncated children: ${d._reason || "Unknown"}`
        );
        continue;
      }
      d.type;
    }
    const g = l(e.children);
    await a.log(
      `  First pass: Creating ${g.length} COMPONENT node(s) (without children)...`
    );
    for (const d of g)
      await a.log(
        `  Collected COMPONENT "${d.name || "Unnamed"}" (ID: ${d.id ? d.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const d of g)
      if (d.id && o && !o.has(d.id)) {
        const m = figma.createComponent();
        if (d.name !== void 0 && (m.name = d.name || "Unnamed Node"), d.componentPropertyDefinitions) {
          const w = d.componentPropertyDefinitions;
          let $ = 0, b = 0;
          for (const [v, I] of Object.entries(w))
            try {
              const k = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[I.type];
              if (!k) {
                await a.warning(
                  `  Unknown property type ${I.type} for property "${v}" in component "${d.name || "Unnamed"}"`
                ), b++;
                continue;
              }
              const K = I.defaultValue, H = v.split("#")[0];
              m.addComponentProperty(
                H,
                k,
                K
              ), $++;
            } catch (S) {
              await a.warning(
                `  Failed to add component property "${v}" to "${d.name || "Unnamed"}" in first pass: ${S}`
              ), b++;
            }
          $ > 0 && await a.log(
            `  Added ${$} component property definition(s) to "${d.name || "Unnamed"}" in first pass${b > 0 ? ` (${b} failed)` : ""}`
          );
        }
        o.set(d.id, m), await a.log(
          `  Created COMPONENT "${d.name || "Unnamed"}" (ID: ${d.id.substring(0, 8)}...) in first pass`
        );
      }
    for (const d of e.children) {
      if (d._truncated)
        continue;
      const m = await ce(
        d,
        c,
        n,
        i,
        r,
        s,
        o,
        u,
        f,
        null,
        // deferredInstances - not needed for remote structures
        e,
        // parentNodeData - pass the parent's nodeData so children can check for auto-layout
        E
      );
      if (m && m.parent !== c) {
        if (m.parent && typeof m.parent.removeChild == "function")
          try {
            m.parent.removeChild(m);
          } catch (w) {
            await a.warning(
              `Failed to remove child "${m.name || "Unnamed"}" from parent "${m.parent.name || "Unnamed"}": ${w}`
            );
          }
        c.appendChild(m);
      }
    }
  }
  if (t && c.parent !== t) {
    if (c.parent && typeof c.parent.removeChild == "function")
      try {
        c.parent.removeChild(c);
      } catch (l) {
        await a.warning(
          `Failed to remove node "${c.name || "Unnamed"}" from parent "${c.parent.name || "Unnamed"}": ${l}`
        );
      }
    t.appendChild(c);
  }
  return c;
}
async function Xt(e, t, n) {
  let i = 0, r = 0, s = 0;
  const o = (f) => {
    const h = [];
    if (f.type === "INSTANCE" && h.push(f), "children" in f && f.children)
      for (const N of f.children)
        h.push(...o(N));
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
      const N = t.getSerializedTable();
      let E = null, c;
      if (n._instanceTableMap ? (c = n._instanceTableMap.get(
        f.id
      ), c !== void 0 ? (E = N[c], await a.log(
        `  Found instance table index ${c} for instance "${f.name}" (ID: ${f.id.substring(0, 8)}...)`
      )) : await a.log(
        `  No instance table index mapping found for instance "${f.name}" (ID: ${f.id.substring(0, 8)}...), using fallback matching`
      )) : await a.log(
        `  No instance table map found, using fallback matching for instance "${f.name}"`
      ), !E) {
        for (const [p, P] of Object.entries(N))
          if (P.instanceType === "internal" && P.componentNodeId && n.has(P.componentNodeId)) {
            const V = n.get(P.componentNodeId);
            if (V && V.id === h.id) {
              E = P, await a.log(
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
        for (const [P, V] of Object.entries(
          E.variantProperties
        )) {
          const x = P.split("#")[0];
          R[x] && (p[x] = V);
        }
        Object.keys(p).length > 0 ? (f.setProperties(p), i++, await a.log(
          `  ✓ Set variant properties on instance "${f.name}": ${JSON.stringify(p)}`
        )) : r++;
      } else
        r++;
    } catch (h) {
      s++, await a.warning(
        `  Failed to set variant properties on instance "${f.name}": ${h}`
      );
    }
  await a.log(
    `  Variant properties set: ${i} processed, ${r} skipped, ${s} errors`
  );
}
async function ze(e) {
  await figma.loadAllPagesAsync();
  const t = figma.root.children, n = new Set(t.map((s) => s.name));
  if (!n.has(e))
    return e;
  let i = 1, r = `${e}_${i}`;
  for (; n.has(r); )
    i++, r = `${e}_${i}`;
  return r;
}
async function Zt(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), n = new Set(t.map((s) => s.name));
  if (!n.has(e))
    return e;
  let i = 1, r = `${e}_${i}`;
  for (; n.has(r); )
    i++, r = `${e}_${i}`;
  return r;
}
async function Qt(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const s of e.variableIds)
    try {
      const o = await figma.variables.getVariableByIdAsync(s);
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
  for (const [s, o] of Object.entries(r)) {
    if (o.isLocal === !1) {
      await a.log(
        `Skipping remote collection: "${o.collectionName}" (index ${s})`
      );
      continue;
    }
    const u = await Dt(o);
    u.matchType === "recognized" ? (await a.log(
      `✓ Recognized collection by GUID: "${o.collectionName}" (index ${s})`
    ), t.set(s, u.collection)) : u.matchType === "potential" ? (await a.log(
      `? Potential match by name: "${o.collectionName}" (index ${s})`
    ), n.set(s, {
      entry: o,
      collection: u.collection
    })) : (await a.log(
      `✗ No match found for collection: "${o.collectionName}" (index ${s}) - will create new`
    ), i.set(s, o));
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
    for (const [i, { entry: r, collection: s }] of e.entries())
      try {
        const o = ie(r.collectionName) ? ae(r.collectionName) : s.name, u = `Found existing "${o}" variable collection. Should I use it?`;
        await a.log(
          `Prompting user about potential match: "${o}"`
        ), await se.prompt(u, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await a.log(
          `✓ User confirmed: Using existing collection "${o}" (index ${i})`
        ), t.set(i, s), await pe(s, r.modes), await a.log(
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
  for (const [r, s] of e.entries()) {
    const o = i[r];
    o && (n.has(r) || (await pe(s, o.modes), await a.log(
      `  ✓ Ensured modes for collection "${s.name}" (${o.modes.length} mode(s))`
    )));
  }
}
async function on(e, t, n) {
  if (e.size !== 0) {
    await a.log(
      `Creating ${e.size} new collection(s)...`
    );
    for (const [i, r] of e.entries()) {
      const s = ae(r.collectionName), o = await Zt(s);
      o !== s ? await a.log(
        `Creating collection: "${o}" (normalized: "${s}" - name conflict resolved)`
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
  const r = /* @__PURE__ */ new Map(), s = [], o = new Set(
    i.map((h) => h.id)
  );
  await a.log("Matching and creating variables in collections...");
  const u = e.getTable(), f = /* @__PURE__ */ new Map();
  for (const [h, N] of Object.entries(u)) {
    if (N._colRef === void 0)
      continue;
    const E = n.get(String(N._colRef));
    if (!E)
      continue;
    f.has(E.id) || f.set(E.id, {
      collectionName: E.name,
      existing: 0,
      created: 0
    });
    const c = f.get(E.id), R = o.has(
      E.id
    );
    let p;
    typeof N.variableType == "number" ? p = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[N.variableType] || String(N.variableType) : p = N.variableType;
    const P = await _e(
      E,
      N.variableName
    );
    if (P)
      if (De(P, p))
        r.set(h, P), c.existing++;
      else {
        await a.warning(
          `Type mismatch for variable "${N.variableName}" in collection "${E.name}": expected ${p}, found ${P.resolvedType}. Creating new variable with incremented name.`
        );
        const V = await Qt(
          E,
          N.variableName
        ), x = await Me(
          Z(z({}, N), {
            variableName: V,
            variableType: p
          }),
          E,
          e,
          t
        );
        R || s.push(x), r.set(h, x), c.created++;
      }
    else {
      const V = await Me(
        Z(z({}, N), {
          variableType: p
        }),
        E,
        e,
        t
      );
      R || s.push(V), r.set(h, V), c.created++;
    }
  }
  await a.log("Variable processing complete:");
  for (const h of f.values())
    await a.log(
      `  "${h.collectionName}": ${h.existing} existing, ${h.created} created`
    );
  return {
    recognizedVariables: r,
    newlyCreatedVariables: s
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
  for (const s of e.children)
    (s.type === "FRAME" || s.type === "COMPONENT") && n.add(s.name);
  if (!n.has(t))
    return t;
  let i = 1, r = `${t}_${i}`;
  for (; n.has(r); )
    i++, r = `${t}_${i}`;
  return r;
}
async function un(e, t, n, i, r) {
  var c;
  const s = e.getSerializedTable(), o = Object.values(s).filter(
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
    const P = figma.createFrame();
    P.name = "Title", P.layoutMode = "VERTICAL", P.paddingTop = 20, P.paddingBottom = 20, P.paddingLeft = 20, P.paddingRight = 20, P.fills = [];
    const V = figma.createText();
    V.fontName = R, V.characters = "REMOTE INSTANCES", V.fontSize = 24, V.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], P.appendChild(V);
    const x = figma.createText();
    x.fontName = p, x.characters = "These are remotely connected component instances found in our different component pages.", x.fontSize = 14, x.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], P.appendChild(x), h.appendChild(P), await a.log("Created title and description on REMOTES page");
  }
  const E = /* @__PURE__ */ new Map();
  for (const [R, p] of Object.entries(s)) {
    if (p.instanceType !== "remote")
      continue;
    const P = parseInt(R, 10);
    if (await a.log(
      `Processing remote instance ${P}: "${p.componentName}"`
    ), !p.structure) {
      await a.warning(
        `Remote instance "${p.componentName}" missing structure data, skipping`
      );
      continue;
    }
    Be(p.structure);
    const V = p.structure.children !== void 0, x = p.structure.child !== void 0, G = p.structure.children ? p.structure.children.length : p.structure.child ? p.structure.child.length : 0;
    await a.log(
      `  Structure type: ${p.structure.type || "unknown"}, has children: ${G} (children key: ${V}, child key: ${x})`
    );
    let B = p.componentName;
    if (p.path && p.path.length > 0) {
      const C = p.path.filter((y) => y !== "").join(" / ");
      C && (B = `${C} / ${p.componentName}`);
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
      const C = figma.createComponent();
      C.name = O, h.appendChild(C), await a.log(
        `  Created component node: "${O}"`
      );
      try {
        if (p.structure.componentPropertyDefinitions) {
          const l = p.structure.componentPropertyDefinitions;
          let g = 0, d = 0;
          for (const [m, w] of Object.entries(l))
            try {
              const b = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[w.type];
              if (!b) {
                await a.warning(
                  `  Unknown property type ${w.type} for property "${m}" in component "${p.componentName}"`
                ), d++;
                continue;
              }
              const v = w.defaultValue, I = m.split("#")[0];
              C.addComponentProperty(
                I,
                b,
                v
              ), g++;
            } catch ($) {
              await a.warning(
                `  Failed to add component property "${m}" to "${p.componentName}": ${$}`
              ), d++;
            }
          g > 0 && await a.log(
            `  Added ${g} component property definition(s) to "${p.componentName}"${d > 0 ? ` (${d} failed)` : ""}`
          );
        }
        p.structure.name !== void 0 && (C.name = p.structure.name);
        const y = p.structure.boundVariables && typeof p.structure.boundVariables == "object" && (p.structure.boundVariables.width || p.structure.boundVariables.height);
        p.structure.width !== void 0 && p.structure.height !== void 0 && !y && C.resize(p.structure.width, p.structure.height), p.structure.x !== void 0 && (C.x = p.structure.x), p.structure.y !== void 0 && (C.y = p.structure.y);
        const A = p.structure.boundVariables && typeof p.structure.boundVariables == "object";
        if (p.structure.visible !== void 0 && (C.visible = p.structure.visible), p.structure.opacity !== void 0 && (!A || !p.structure.boundVariables.opacity) && (C.opacity = p.structure.opacity), p.structure.rotation !== void 0 && (!A || !p.structure.boundVariables.rotation) && (C.rotation = p.structure.rotation), p.structure.blendMode !== void 0 && (!A || !p.structure.boundVariables.blendMode) && (C.blendMode = p.structure.blendMode), p.structure.fills !== void 0)
          try {
            let l = p.structure.fills;
            Array.isArray(l) && (l = l.map((g) => {
              if (g && typeof g == "object") {
                const d = z({}, g);
                return delete d.boundVariables, d;
              }
              return g;
            })), C.fills = l, (c = p.structure.boundVariables) != null && c.fills && i && await qt(
              C,
              p.structure.boundVariables,
              "fills",
              i
            );
          } catch (l) {
            await a.warning(
              `Error setting fills for remote component "${p.componentName}": ${l}`
            );
          }
        if (p.structure.strokes !== void 0)
          try {
            C.strokes = p.structure.strokes;
          } catch (l) {
            await a.warning(
              `Error setting strokes for remote component "${p.componentName}": ${l}`
            );
          }
        const T = p.structure.boundVariables && typeof p.structure.boundVariables == "object" && (p.structure.boundVariables.strokeWeight || p.structure.boundVariables.strokeAlign);
        p.structure.strokeWeight !== void 0 && (!T || !p.structure.boundVariables.strokeWeight) && (C.strokeWeight = p.structure.strokeWeight), p.structure.strokeAlign !== void 0 && (!T || !p.structure.boundVariables.strokeAlign) && (C.strokeAlign = p.structure.strokeAlign), p.structure.layoutMode !== void 0 && (C.layoutMode = p.structure.layoutMode), p.structure.primaryAxisSizingMode !== void 0 && (C.primaryAxisSizingMode = p.structure.primaryAxisSizingMode), p.structure.counterAxisSizingMode !== void 0 && (C.counterAxisSizingMode = p.structure.counterAxisSizingMode);
        const U = p.structure.boundVariables && typeof p.structure.boundVariables == "object";
        p.structure.paddingLeft !== void 0 && (!U || !p.structure.boundVariables.paddingLeft) && (C.paddingLeft = p.structure.paddingLeft), p.structure.paddingRight !== void 0 && (!U || !p.structure.boundVariables.paddingRight) && (C.paddingRight = p.structure.paddingRight), p.structure.paddingTop !== void 0 && (!U || !p.structure.boundVariables.paddingTop) && (C.paddingTop = p.structure.paddingTop), p.structure.paddingBottom !== void 0 && (!U || !p.structure.boundVariables.paddingBottom) && (C.paddingBottom = p.structure.paddingBottom), p.structure.itemSpacing !== void 0 && (!U || !p.structure.boundVariables.itemSpacing) && (C.itemSpacing = p.structure.itemSpacing);
        const L = p.structure.boundVariables && typeof p.structure.boundVariables == "object" && (p.structure.boundVariables.cornerRadius || p.structure.boundVariables.topLeftRadius || p.structure.boundVariables.topRightRadius || p.structure.boundVariables.bottomLeftRadius || p.structure.boundVariables.bottomRightRadius);
        if (p.structure.cornerRadius !== void 0 && (!L || !p.structure.boundVariables.cornerRadius) && (C.cornerRadius = p.structure.cornerRadius), p.structure.boundVariables && i) {
          const l = p.structure.boundVariables, g = [
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
          for (const d of g)
            if (l[d] && ne(l[d])) {
              const m = l[d]._varRef;
              if (m !== void 0) {
                const w = i.get(String(m));
                if (w) {
                  const $ = {
                    type: "VARIABLE_ALIAS",
                    id: w.id
                  };
                  C.boundVariables || (C.boundVariables = {}), C.boundVariables[d] = $;
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
          for (let l = 0; l < _.length; l++) {
            const g = _[l];
            if (await a.log(
              `  DEBUG: Processing child ${l + 1}/${_.length}: ${JSON.stringify({ name: g == null ? void 0 : g.name, type: g == null ? void 0 : g.type, hasTruncated: !!(g != null && g._truncated) })}`
            ), g._truncated) {
              await a.log(
                `  Skipping truncated child: ${g._reason || "Unknown"}`
              );
              continue;
            }
            await a.log(
              `  Recreating child: "${g.name || "Unnamed"}" (type: ${g.type})`
            );
            const d = await ce(
              g,
              C,
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
            d ? (C.appendChild(d), await a.log(
              `  ✓ Appended child "${g.name || "Unnamed"}" to component "${p.componentName}"`
            )) : await a.warning(
              `  ✗ Failed to create child "${g.name || "Unnamed"}" (type: ${g.type})`
            );
          }
        }
        u.set(P, C), await a.log(
          `✓ Created remote component: "${O}" (index ${P})`
        );
      } catch (y) {
        await a.warning(
          `Error populating remote component "${p.componentName}": ${y instanceof Error ? y.message : "Unknown error"}`
        ), C.remove();
      }
    } catch (C) {
      await a.warning(
        `Error recreating remote instance "${p.componentName}": ${C instanceof Error ? C.message : "Unknown error"}`
      );
    }
  }
  return await a.log(
    `Remote instance processing complete: ${u.size} component(s) created`
  ), u;
}
async function fn(e, t, n, i, r, s, o = null, u = null, f = !1, h = null) {
  await a.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const N = figma.root.children, E = "RecursicaPublishedMetadata";
  let c = null;
  for (const y of N) {
    const A = y.getPluginData(E);
    if (A)
      try {
        if (JSON.parse(A).id === e.guid) {
          c = y;
          break;
        }
      } catch (T) {
        continue;
      }
  }
  let R = !1;
  if (c && !f) {
    let y;
    try {
      const U = c.getPluginData(E);
      U && (y = JSON.parse(U).version);
    } catch (U) {
    }
    const A = y !== void 0 ? ` v${y}` : "", T = `Found existing component "${c.name}${A}". Should I use it or create a copy?`;
    await a.log(
      `Found existing page with same GUID: "${c.name}". Prompting user...`
    );
    try {
      await se.prompt(T, {
        okLabel: "Use",
        cancelLabel: "Copy",
        timeoutMs: 3e5
        // 5 minutes
      }), R = !0, await a.log(
        `User chose to use existing page: "${c.name}"`
      );
    } catch (U) {
      await a.log(
        "User chose to create a copy. Will create new page."
      );
    }
  }
  if (R && c)
    return await figma.setCurrentPageAsync(c), await a.log(
      `Using existing page: "${c.name}" (GUID: ${e.guid.substring(0, 8)}...)`
    ), await a.log(
      `  Instances from other pages will resolve to components on this existing page using componentPageName: "${c.name}"`
    ), {
      success: !0,
      page: c,
      // Include pageId so it can be tracked in importedPages
      pageId: c.id
    };
  const p = N.find((y) => y.name === e.name);
  p && await a.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let P;
  if (c || p) {
    const y = `__${e.name}`;
    P = await ze(y), await a.log(
      `Creating scratch page: "${P}" (will be renamed to "${e.name}" on success)`
    );
  } else
    P = e.name, await a.log(`Creating page: "${P}"`);
  const V = figma.createPage();
  if (V.name = P, await figma.setCurrentPageAsync(V), await a.log(`Switched to page: "${P}"`), !t.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await a.log("Recreating page structure...");
  const x = t.pageData;
  if (x.backgrounds !== void 0)
    try {
      V.backgrounds = x.backgrounds, await a.log(
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
        V,
        n,
        i,
        r,
        s,
        G,
        !1,
        // isRemoteStructure: false - we're creating the main page
        o,
        u,
        x,
        // parentNodeData - pass the page's nodeData so children can check for auto-layout
        h
      );
      A && V.appendChild(A);
    }
  await a.log("Page structure recreated successfully"), r && (await a.log(
    "Third pass: Setting variant properties on instances..."
  ), await Xt(
    V,
    r,
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
  if (V.setPluginData(E, JSON.stringify(C)), await a.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), P.startsWith("__")) {
    const y = await ze(e.name);
    V.name = y, await a.log(`Renamed page from "${P}" to "${y}"`);
  }
  return {
    success: !0,
    page: V
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
    const s = en(r);
    if (!s.success)
      return await a.error(s.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: s.error,
        data: {}
      };
    const o = s.metadata;
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
    const N = h.collectionTable;
    await a.log(
      `Loaded collections table with ${N.getSize()} collection(s)`
    ), await a.log(
      "Matching collections with existing local collections..."
    );
    const { recognizedCollections: E, potentialMatches: c, collectionsToCreate: R } = await nn(N);
    await an(
      c,
      E,
      R
    ), await rn(
      E,
      N,
      c
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
    const P = p.variableTable;
    await a.log(
      `Loaded variables table with ${P.getSize()} variable(s)`
    );
    const { recognizedVariables: V, newlyCreatedVariables: x } = await cn(
      P,
      N,
      E,
      n
    );
    await a.log("Loading instance table...");
    const G = ln(f);
    if (G) {
      const _ = G.getSerializedTable(), l = Object.values(_).filter(
        (d) => d.instanceType === "internal"
      ), g = Object.values(_).filter(
        (d) => d.instanceType === "remote"
      );
      await a.log(
        `Loaded instance table with ${G.getSize()} instance(s) (${l.length} internal, ${g.length} remote)`
      );
    } else
      await a.log("No instance table found in JSON");
    let B = null;
    G && (B = await un(
      G,
      P,
      N,
      V,
      E
    ));
    const O = [], C = (i = e.isMainPage) != null ? i : !0, y = await fn(
      o,
      f,
      P,
      N,
      G,
      V,
      B,
      O,
      C,
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
    const A = y.page, T = V.size + x.length, U = O.length;
    await a.log("=== Import Complete ==="), await a.log(
      `Successfully processed ${E.size} collection(s), ${T} variable(s), and created page "${A.name}"${U > 0 ? ` (${U} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`
    );
    const L = y.pageId || A.id;
    return {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: {
        pageName: A.name,
        pageId: L,
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
    const s = r instanceof Error ? r.message : "Unknown error occurred";
    return await a.error(`Import failed: ${s}`), r instanceof Error && r.stack && await a.error(`Stack trace: ${r.stack}`), console.error("Error importing page:", r), {
      type: "importPage",
      success: !1,
      error: !0,
      message: s,
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
      const { placeholderFrame: s, instanceEntry: o, nodeData: u, parentNode: f } = r, h = figma.root.children.find(
        (p) => p.name === o.componentPageName
      );
      if (!h) {
        const p = `Deferred instance "${u.name}" still cannot find referenced page "${o.componentPageName}"`;
        await a.error(p), i.push(p), n++;
        continue;
      }
      const N = (p, P, V, x, G) => {
        if (P.length === 0) {
          let C = null;
          for (const y of p.children || [])
            if (y.type === "COMPONENT") {
              if (y.name === V)
                if (C || (C = y), x)
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
                if (A.type === "COMPONENT" && A.name === V)
                  if (C || (C = A), x)
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
          return C;
        }
        const [B, ...O] = P;
        for (const C of p.children || [])
          if (C.name === B) {
            if (O.length === 0 && C.type === "COMPONENT_SET") {
              if (G && C.name !== G)
                continue;
              for (const y of C.children || [])
                if (y.type === "COMPONENT" && y.name === V) {
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
            return N(
              C,
              O,
              V,
              x,
              G
            );
          }
        return null;
      }, E = N(
        h,
        o.path || [],
        o.componentName,
        o.componentGuid,
        o.componentSetName
      );
      if (!E) {
        const p = o.path && o.path.length > 0 ? ` at path [${o.path.join(" → ")}]` : " at page root", P = `Deferred instance "${u.name}" still cannot find component "${o.componentName}" on page "${o.componentPageName}"${p}`;
        await a.error(P), i.push(P), n++;
        continue;
      }
      const c = E.createInstance();
      if (c.name = u.name || s.name.replace("[Deferred: ", "").replace("]", ""), c.x = s.x, c.y = s.y, s.width !== void 0 && s.height !== void 0 && c.resize(s.width, s.height), o.variantProperties && Object.keys(o.variantProperties).length > 0)
        try {
          const p = await c.getMainComponentAsync();
          if (p) {
            let P = null;
            const V = p.type;
            if (V === "COMPONENT_SET" ? P = p.componentPropertyDefinitions : V === "COMPONENT" && p.parent && p.parent.type === "COMPONENT_SET" ? P = p.parent.componentPropertyDefinitions : await a.warning(
              `Cannot set variant properties for resolved instance "${u.name}" - main component is not a COMPONENT_SET or variant`
            ), P) {
              const x = {};
              for (const [G, B] of Object.entries(
                o.variantProperties
              )) {
                const O = G.split("#")[0];
                P[O] && (x[O] = B);
              }
              Object.keys(x).length > 0 && c.setProperties(x);
            }
          }
        } catch (p) {
          await a.warning(
            `Failed to set variant properties for resolved instance "${u.name}": ${p}`
          );
        }
      if (o.componentProperties && Object.keys(o.componentProperties).length > 0)
        try {
          const p = await c.getMainComponentAsync();
          if (p) {
            let P = null;
            const V = p.type;
            if (V === "COMPONENT_SET" ? P = p.componentPropertyDefinitions : V === "COMPONENT" && p.parent && p.parent.type === "COMPONENT_SET" ? P = p.parent.componentPropertyDefinitions : V === "COMPONENT" && (P = p.componentPropertyDefinitions), P)
              for (const [x, G] of Object.entries(
                o.componentProperties
              )) {
                const B = x.split("#")[0];
                if (P[B])
                  try {
                    c.setProperties({
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
      const R = f.children.indexOf(s);
      f.insertChild(R, c), s.remove(), await a.log(
        `  ✓ Resolved deferred instance "${u.name}" from component "${o.componentName}" on page "${o.componentPageName}"`
      ), t++;
    } catch (s) {
      const o = s instanceof Error ? s.message : String(s), u = `Failed to resolve deferred instance "${r.nodeData.name}": ${o}`;
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
    let s = 0;
    for (const u of n)
      try {
        const f = figma.variables.getVariableCollectionById(u);
        f && (f.remove(), s++);
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
      const s = r.expandedJsonData, o = s.metadata;
      if (!o || !o.name || !o.guid) {
        await a.warning(
          `Skipping ${n} - missing or invalid metadata`
        );
        continue;
      }
      const u = [];
      if (s.instances) {
        const h = ue.fromTable(
          s.instances
        ).getSerializedTable();
        for (const N of Object.values(h))
          N.instanceType === "normal" && N.componentPageName && (u.includes(N.componentPageName) || u.push(N.componentPageName));
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
  const s = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), u = [], f = (h) => {
    if (s.has(h.pageName))
      return !1;
    if (o.has(h.pageName)) {
      const N = u.findIndex(
        (E) => E.pageName === h.pageName
      );
      if (N !== -1) {
        const E = u.slice(N).concat([h]);
        return n.push(E), !0;
      }
      return !1;
    }
    o.add(h.pageName), u.push(h);
    for (const N of h.dependencies) {
      const E = r.get(N);
      E && f(E);
    }
    return o.delete(h.pageName), u.pop(), s.add(h.pageName), t.push(h), !1;
  };
  for (const h of e)
    s.has(h.pageName) || f(h);
  for (const h of e)
    for (const N of h.dependencies)
      r.has(N) || i.push(
        `Page "${h.pageName}" (${h.fileName}) depends on "${N}" which is not in the import set`
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
      const r = i.map((s) => `"${s.pageName}"`).join(" → ");
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
  var p, P, V, x, G;
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
  let s = 0, o = 0;
  const u = [...r], f = [], h = {
    pageIds: [],
    collectionIds: [],
    variableIds: []
  }, N = [], E = e.mainFileName;
  for (let B = 0; B < n.length; B++) {
    const O = n[B], C = E ? O.fileName === E : B === n.length - 1;
    await a.log(
      `[${B + 1}/${n.length}] Importing ${O.fileName} ("${O.pageName}")${C ? " [MAIN]" : " [DEPENDENCY]"}...`
    );
    try {
      const y = B === 0, A = await tt({
        jsonData: O.jsonData,
        isMainPage: C,
        clearConsole: y
      });
      if (A.success) {
        if (s++, (p = A.data) != null && p.deferredInstances) {
          const T = A.data.deferredInstances;
          Array.isArray(T) && f.push(...T);
        }
        if ((P = A.data) != null && P.createdEntities) {
          const T = A.data.createdEntities;
          T.pageIds && h.pageIds.push(...T.pageIds), T.collectionIds && h.collectionIds.push(...T.collectionIds), T.variableIds && h.variableIds.push(...T.variableIds);
          const U = ((V = T.pageIds) == null ? void 0 : V[0]) || ((x = A.data) == null ? void 0 : x.pageId);
          (G = A.data) != null && G.pageName && U && N.push({
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
    `  Imported: ${s}, Failed: ${o}, Deferred instances: ${f.length}`
  );
  const c = o === 0, R = c ? `Successfully imported ${s} page(s)${f.length > 0 ? ` (${f.length} deferred instance(s) resolved)` : ""}` : `Import completed with ${o} failure(s). ${u.join("; ")}`;
  return {
    type: "importPagesInOrder",
    success: c,
    error: !c,
    message: R,
    data: {
      imported: s,
      failed: o,
      deferred: f.length,
      errors: u,
      importedPages: N,
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
    const s = JSON.stringify(r, null, 2), o = JSON.parse(s), u = "Copy - " + o.name, f = figma.createPage();
    if (f.name = u, figma.root.appendChild(f), o.children && o.children.length > 0) {
      let E = function(R) {
        R.forEach((p) => {
          const P = (p.x || 0) + (p.width || 0);
          P > c && (c = P), p.children && p.children.length > 0 && E(p.children);
        });
      };
      console.log(
        "Recreating " + o.children.length + " top-level children..."
      );
      let c = 0;
      E(o.children), console.log("Original content rightmost edge: " + c);
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
      const s = r, o = s.getPluginData(st);
      if (o)
        try {
          const u = JSON.parse(o);
          n.push(u);
        } catch (u) {
          console.warn(
            `Failed to parse metadata for page "${s.name}":`,
            u
          );
          const h = {
            _ver: 1,
            id: "",
            name: be(s.name),
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
          name: be(s.name),
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
