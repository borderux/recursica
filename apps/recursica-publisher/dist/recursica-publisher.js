var lt = Object.defineProperty, dt = Object.defineProperties;
var pt = Object.getOwnPropertyDescriptors;
var Be = Object.getOwnPropertySymbols;
var ft = Object.prototype.hasOwnProperty, mt = Object.prototype.propertyIsEnumerable;
var Ae = (e, t, n) => t in e ? lt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, L = (e, t) => {
  for (var n in t || (t = {}))
    ft.call(t, n) && Ae(e, n, t[n]);
  if (Be)
    for (var n of Be(t))
      mt.call(t, n) && Ae(e, n, t[n]);
  return e;
}, q = (e, t) => dt(e, pt(t));
var D = (e, t, n) => Ae(e, typeof t != "symbol" ? t + "" : t, n);
async function ut(e) {
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
        pages: figma.root.children.map((o, s) => ({
          name: o.name,
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
const W = {
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
}, H = q(L({}, W), {
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
}), Y = q(L({}, W), {
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
}), ae = q(L({}, W), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), Je = q(L({}, W), {
  cornerRadius: 0
}), ht = q(L({}, W), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function yt(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return H;
    case "TEXT":
      return Y;
    case "VECTOR":
      return ae;
    case "LINE":
      return ht;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return Je;
    default:
      return W;
  }
}
function _(e, t) {
  if (Array.isArray(e))
    return Array.isArray(t) ? e.length !== t.length || e.some((n, i) => _(n, t[i])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof t == "object" && t !== null) {
      const n = Object.keys(e), i = Object.keys(t);
      return n.length !== i.length ? !0 : n.some(
        (o) => !(o in t) || _(e[o], t[o])
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
}, ee = {
  LAYER: "Layer",
  TOKENS: "Tokens",
  THEME: "Theme"
};
function te(e) {
  const t = e.trim(), n = t.toLowerCase();
  return n === "themes" ? ee.THEME : n === "token" ? ee.TOKENS : n === "layer" ? ee.LAYER : n === "tokens" ? ee.TOKENS : n === "theme" ? ee.THEME : t;
}
function ne(e) {
  const t = te(e);
  return t === ee.LAYER || t === ee.TOKENS || t === ee.THEME;
}
function ke(e) {
  const t = te(e);
  if (t === ee.LAYER)
    return Pe.LAYER;
  if (t === ee.TOKENS)
    return Pe.TOKENS;
  if (t === ee.THEME)
    return Pe.THEME;
}
class we {
  constructor() {
    D(this, "collectionMap");
    // collectionId -> index
    D(this, "collections");
    // index -> collection data
    D(this, "normalizedNameMap");
    // normalized name -> index (for standard collections)
    D(this, "nextIndex");
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
    if (ne(t.collectionName)) {
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
    const s = q(L({}, t), {
      collectionName: i
    });
    if (ne(t.collectionName)) {
      const r = ke(
        t.collectionName
      );
      r && (s.collectionGuid = r), this.normalizedNameMap.set(i, o);
    }
    return this.collections[o] = s, o;
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
      const i = this.collections[n], o = L({
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
    const n = new we(), i = Object.entries(t).sort(
      (s, r) => parseInt(s[0], 10) - parseInt(r[0], 10)
    );
    for (const [s, r] of i) {
      const p = parseInt(s, 10), m = (o = r.isLocal) != null ? o : !0, b = te(
        r.collectionName || ""
      ), w = r.collectionId || r.collectionGuid || `temp:${p}:${b}`, A = L({
        collectionName: b,
        collectionId: w,
        isLocal: m,
        modes: r.modes || []
      }, r.collectionGuid && {
        collectionGuid: r.collectionGuid
      });
      n.collectionMap.set(w, p), n.collections[p] = A, ne(b) && n.normalizedNameMap.set(b, p), n.nextIndex = Math.max(
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
    D(this, "variableMap");
    // variableKey -> index
    D(this, "variables");
    // index -> variable data
    D(this, "nextIndex");
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
      ), s = L(L({
        variableName: i.variableName,
        variableType: Nt(i.variableType)
      }, i._colRef !== void 0 && { _colRef: i._colRef }), o && { valuesByMode: o });
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
      (o, s) => parseInt(o[0], 10) - parseInt(s[0], 10)
    );
    for (const [o, s] of i) {
      const r = parseInt(o, 10), p = $t(s.variableType), m = q(L({}, s), {
        variableType: p
        // Always a string after expansion
      });
      n.variables[r] = m, n.nextIndex = Math.max(n.nextIndex, r + 1);
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
function ye(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let Et = 0;
const le = /* @__PURE__ */ new Map();
function Ct(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const t = le.get(e.requestId);
  t && (le.delete(e.requestId), e.error || !e.guid ? t.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : t.resolve(e.guid));
}
function Ve() {
  return new Promise((e, t) => {
    const n = `guid_${Date.now()}_${++Et}`;
    le.set(n, { resolve: e, reject: t }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: n
    }), setTimeout(() => {
      le.has(n) && (le.delete(n), t(new Error("Timeout waiting for GUID from UI")));
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
function At(e, t) {
  const n = t.modes.find((i) => i.modeId === e);
  return n ? n.name : e;
}
async function Ke(e, t, n, i, o = /* @__PURE__ */ new Set()) {
  const s = {};
  for (const [r, p] of Object.entries(e)) {
    const m = At(r, i);
    if (p == null) {
      s[m] = p;
      continue;
    }
    if (typeof p == "string" || typeof p == "number" || typeof p == "boolean") {
      s[m] = p;
      continue;
    }
    if (typeof p == "object" && p !== null && "type" in p && p.type === "VARIABLE_ALIAS" && "id" in p) {
      const b = p.id;
      if (o.has(b)) {
        s[m] = {
          type: "VARIABLE_ALIAS",
          id: b
        };
        continue;
      }
      const w = await figma.variables.getVariableByIdAsync(b);
      if (!w) {
        s[m] = {
          type: "VARIABLE_ALIAS",
          id: b
        };
        continue;
      }
      const A = new Set(o);
      A.add(b);
      const d = await figma.variables.getVariableCollectionByIdAsync(
        w.variableCollectionId
      ), I = w.key;
      if (!I) {
        s[m] = {
          type: "VARIABLE_ALIAS",
          id: b
        };
        continue;
      }
      const u = {
        variableName: w.name,
        variableType: w.resolvedType,
        collectionName: d == null ? void 0 : d.name,
        collectionId: w.variableCollectionId,
        variableKey: I,
        id: b,
        isLocal: !w.remote
      };
      if (d) {
        const S = await He(
          d,
          n
        );
        u._colRef = S, w.valuesByMode && (u.valuesByMode = await Ke(
          w.valuesByMode,
          t,
          n,
          d,
          // Pass collection for mode ID to name conversion
          A
        ));
      }
      const O = t.addVariable(u);
      s[m] = {
        type: "VARIABLE_ALIAS",
        id: b,
        _varRef: O
      };
    } else
      s[m] = p;
  }
  return s;
}
const ue = "recursica:collectionId";
async function Pt(e) {
  if (e.remote === !0) {
    const n = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(n)) {
      const o = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await a.error(o), new Error(o);
    }
    return e.id;
  } else {
    if (ne(e.name)) {
      const o = ke(e.name);
      if (o) {
        const s = e.getSharedPluginData(
          "recursica",
          ue
        );
        return (!s || s.trim() === "") && e.setSharedPluginData(
          "recursica",
          ue,
          o
        ), o;
      }
    }
    const n = e.getSharedPluginData(
      "recursica",
      ue
    );
    if (n && n.trim() !== "")
      return n;
    const i = await Ve();
    return e.setSharedPluginData("recursica", ue, i), i;
  }
}
function Tt(e, t) {
  if (t)
    return;
  const n = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(n))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function He(e, t) {
  const n = !e.remote, i = t.getCollectionIndex(e.id);
  if (i !== -1)
    return i;
  Tt(e.name, n);
  const o = await Pt(e), s = e.modes.map((b) => b.name), r = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: n,
    modes: s,
    collectionGuid: o
  }, p = t.addCollection(r), m = n ? "local" : "remote";
  return await a.log(
    `  Added ${m} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), p;
}
async function Oe(e, t, n) {
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
    const s = i.key;
    if (!s)
      return console.log("Variable missing key:", e.id), null;
    const r = await He(
      o,
      n
    ), p = {
      variableName: i.name,
      variableType: i.resolvedType,
      _colRef: r,
      // Reference to collection table (v2.4.0+)
      variableKey: s,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    i.valuesByMode && (p.valuesByMode = await Ke(
      i.valuesByMode,
      t,
      n,
      o,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const m = t.addVariable(p);
    return vt(m);
  } catch (i) {
    const o = i instanceof Error ? i.message : String(i);
    throw console.error("Could not resolve variable alias:", e.id, i), new Error(
      `Failed to resolve variable alias ${e.id}: ${o}`
    );
  }
}
async function ie(e, t, n) {
  if (!e || typeof e != "object") return e;
  const i = {};
  for (const o in e)
    if (Object.prototype.hasOwnProperty.call(e, o)) {
      const s = e[o];
      if (s && typeof s == "object" && !Array.isArray(s))
        if (s.type === "VARIABLE_ALIAS") {
          const r = await Oe(
            s,
            t,
            n
          );
          r && (i[o] = r);
        } else
          i[o] = await ie(
            s,
            t,
            n
          );
      else Array.isArray(s) ? i[o] = await Promise.all(
        s.map(async (r) => (r == null ? void 0 : r.type) === "VARIABLE_ALIAS" ? await Oe(
          r,
          t,
          n
        ) || r : r && typeof r == "object" ? await ie(
          r,
          t,
          n
        ) : r)
      ) : i[o] = s;
    }
  return i;
}
async function We(e, t, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const o = {};
      for (const s in i)
        Object.prototype.hasOwnProperty.call(i, s) && (s === "boundVariables" ? o[s] = await ie(
          i[s],
          t,
          n
        ) : o[s] = i[s]);
      return o;
    })
  );
}
async function qe(e, t, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const o = {};
      for (const s in i)
        Object.prototype.hasOwnProperty.call(i, s) && (s === "boundVariables" ? o[s] = await ie(
          i[s],
          t,
          n
        ) : o[s] = i[s]);
      return o;
    })
  );
}
const ce = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  extractBoundVariables: ie,
  resolveVariableAliasMetadata: Oe,
  serializeBackgrounds: qe,
  serializeFills: We
}, Symbol.toStringTag, { value: "Module" }));
async function De(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  if (e.type && (n.type = e.type, i.add("type")), e.id && (n.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (n.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (n.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (n.y = e.y, i.add("y")), e.width !== void 0 && (n.width = e.width, i.add("width")), e.height !== void 0 && (n.height = e.height, i.add("height")), e.visible !== void 0 && _(e.visible, W.visible) && (n.visible = e.visible, i.add("visible")), e.locked !== void 0 && _(e.locked, W.locked) && (n.locked = e.locked, i.add("locked")), e.opacity !== void 0 && _(e.opacity, W.opacity) && (n.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && _(e.rotation, W.rotation) && (n.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && _(e.blendMode, W.blendMode) && (n.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && _(e.effects, W.effects) && (n.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const o = await We(
      e.fills,
      t.variableTable,
      t.collectionTable
    );
    _(o, W.fills) && (n.fills = o), i.add("fills");
  }
  if (e.strokes !== void 0 && _(e.strokes, W.strokes) && (n.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && _(e.strokeWeight, W.strokeWeight) && (n.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && _(e.strokeAlign, W.strokeAlign) && (n.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const o = await ie(
      e.boundVariables,
      t.variableTable,
      t.collectionTable
    );
    Object.keys(o).length > 0 && (n.boundVariables = o), i.add("boundVariables");
  }
  if (e.backgrounds !== void 0) {
    const o = await qe(
      e.backgrounds,
      t.variableTable,
      t.collectionTable
    );
    o && Array.isArray(o) && o.length > 0 && (n.backgrounds = o), i.add("backgrounds");
  }
  return n;
}
const Ot = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseBaseNodeProperties: De
}, Symbol.toStringTag, { value: "Module" }));
async function Se(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  if (e.type === "COMPONENT")
    try {
      e.componentPropertyDefinitions && (n.componentPropertyDefinitions = e.componentPropertyDefinitions, i.add("componentPropertyDefinitions"));
    } catch (o) {
    }
  return e.layoutMode !== void 0 && _(e.layoutMode, H.layoutMode) && (n.layoutMode = e.layoutMode, i.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && _(
    e.primaryAxisSizingMode,
    H.primaryAxisSizingMode
  ) && (n.primaryAxisSizingMode = e.primaryAxisSizingMode, i.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && _(
    e.counterAxisSizingMode,
    H.counterAxisSizingMode
  ) && (n.counterAxisSizingMode = e.counterAxisSizingMode, i.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && _(
    e.primaryAxisAlignItems,
    H.primaryAxisAlignItems
  ) && (n.primaryAxisAlignItems = e.primaryAxisAlignItems, i.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && _(
    e.counterAxisAlignItems,
    H.counterAxisAlignItems
  ) && (n.counterAxisAlignItems = e.counterAxisAlignItems, i.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && _(e.paddingLeft, H.paddingLeft) && (n.paddingLeft = e.paddingLeft, i.add("paddingLeft")), e.paddingRight !== void 0 && _(e.paddingRight, H.paddingRight) && (n.paddingRight = e.paddingRight, i.add("paddingRight")), e.paddingTop !== void 0 && _(e.paddingTop, H.paddingTop) && (n.paddingTop = e.paddingTop, i.add("paddingTop")), e.paddingBottom !== void 0 && _(e.paddingBottom, H.paddingBottom) && (n.paddingBottom = e.paddingBottom, i.add("paddingBottom")), e.itemSpacing !== void 0 && _(e.itemSpacing, H.itemSpacing) && (n.itemSpacing = e.itemSpacing, i.add("itemSpacing")), e.cornerRadius !== void 0 && _(e.cornerRadius, H.cornerRadius) && (n.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.clipsContent !== void 0 && _(e.clipsContent, H.clipsContent) && (n.clipsContent = e.clipsContent, i.add("clipsContent")), e.layoutWrap !== void 0 && _(e.layoutWrap, H.layoutWrap) && (n.layoutWrap = e.layoutWrap, i.add("layoutWrap")), e.layoutGrow !== void 0 && _(e.layoutGrow, H.layoutGrow) && (n.layoutGrow = e.layoutGrow, i.add("layoutGrow")), n;
}
const St = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseFrameProperties: Se
}, Symbol.toStringTag, { value: "Module" }));
async function It(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (n.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (n.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (n.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && _(
    e.textAlignHorizontal,
    Y.textAlignHorizontal
  ) && (n.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && _(
    e.textAlignVertical,
    Y.textAlignVertical
  ) && (n.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && _(e.letterSpacing, Y.letterSpacing) && (n.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && _(e.lineHeight, Y.lineHeight) && (n.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && _(e.textCase, Y.textCase) && (n.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && _(e.textDecoration, Y.textDecoration) && (n.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && _(e.textAutoResize, Y.textAutoResize) && (n.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && _(
    e.paragraphSpacing,
    Y.paragraphSpacing
  ) && (n.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && _(e.paragraphIndent, Y.paragraphIndent) && (n.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && _(e.listOptions, Y.listOptions) && (n.listOptions = e.listOptions, i.add("listOptions")), n;
}
function Mt(e) {
  const t = e.match(/^(\d+\.?\d*)[eE]([+-]?\d+)$/);
  if (t) {
    const n = parseFloat(t[1]), i = parseInt(t[2]), o = n * Math.pow(10, i);
    return Math.abs(o) < 1e-10 ? "0" : o.toFixed(6).replace(/\.?0+$/, "") || "0";
  }
  return e;
}
function Ye(e) {
  if (!e || typeof e != "string")
    return e;
  let t = e.replace(/(\d+\.?\d*)[eE]([+-]?\d+)/g, (n) => Mt(n));
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
function Ie(e) {
  return Array.isArray(e) ? e.map((t) => ({
    data: Ye(t.data),
    // Normalize winding rule key (use windRule consistently)
    windRule: t.windRule || t.windingRule || "NONZERO"
  })) : e;
}
const xt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  normalizeSvgPath: Ye,
  normalizeVectorGeometry: Ie
}, Symbol.toStringTag, { value: "Module" }));
async function Rt(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && _(e.fillGeometry, ae.fillGeometry) && (n.fillGeometry = Ie(e.fillGeometry), i.add("fillGeometry")), e.strokeGeometry !== void 0 && _(e.strokeGeometry, ae.strokeGeometry) && (n.strokeGeometry = Ie(e.strokeGeometry), i.add("strokeGeometry")), e.strokeCap !== void 0 && _(e.strokeCap, ae.strokeCap) && (n.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && _(e.strokeJoin, ae.strokeJoin) && (n.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && _(e.dashPattern, ae.dashPattern) && (n.dashPattern = e.dashPattern, i.add("dashPattern")), n;
}
async function kt(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && _(e.cornerRadius, Je.cornerRadius) && (n.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (n.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, i.add("pointCount")), n;
}
const ge = /* @__PURE__ */ new Map();
let Vt = 0;
function _t() {
  return `prompt_${Date.now()}_${++Vt}`;
}
const re = {
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
    const n = typeof t == "number" ? { timeoutMs: t } : t, i = (p = n == null ? void 0 : n.timeoutMs) != null ? p : 3e5, o = n == null ? void 0 : n.okLabel, s = n == null ? void 0 : n.cancelLabel, r = _t();
    return new Promise((m, b) => {
      const w = i === -1 ? null : setTimeout(() => {
        ge.delete(r), b(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      ge.set(r, {
        resolve: m,
        reject: b,
        timeout: w
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: L(L({
          message: e,
          requestId: r
        }, o && { okLabel: o }), s && { cancelLabel: s })
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
    const { requestId: t, action: n } = e, i = ge.get(t);
    if (!i) {
      console.warn(
        `Received response for unknown prompt request: ${t}`
      );
      return;
    }
    i.timeout && clearTimeout(i.timeout), ge.delete(t), n === "ok" ? i.resolve() : i.reject(new Error("User cancelled"));
  }
}, Lt = "RecursicaPublishedMetadata";
function Te(e) {
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
function ze(e) {
  try {
    const t = e.getPluginData(Lt);
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
async function Gt(e, t) {
  var o, s;
  const n = {}, i = /* @__PURE__ */ new Set();
  if (n._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const r = await e.getMainComponentAsync();
    if (!r) {
      const c = e.name || "(unnamed)", y = e.id;
      if (t.detachedComponentsHandled.has(y))
        await a.log(
          `Treating detached instance "${c}" as internal instance (already prompted)`
        );
      else {
        await a.warning(
          `Found detached instance: "${c}" (main component is missing)`
        );
        const P = `Found detached instance "${c}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await re.prompt(P, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(y), await a.log(
            `Treating detached instance "${c}" as internal instance`
          );
        } catch (T) {
          if (T instanceof Error && T.message === "User cancelled") {
            const x = `Export cancelled: Detached instance "${c}" found. Please fix the instance before exporting.`;
            await a.error(x);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch (V) {
              console.warn("Could not scroll to instance:", V);
            }
            throw new Error(x);
          } else
            throw T;
        }
      }
      if (!Te(e).page) {
        const P = `Detached instance "${c}" is not on any page. Cannot export.`;
        throw await a.error(P), new Error(P);
      }
      let E, C;
      try {
        e.variantProperties && (E = e.variantProperties), e.componentProperties && (C = e.componentProperties);
      } catch (P) {
      }
      const $ = L(L({
        instanceType: "internal",
        componentName: c,
        componentNodeId: e.id
      }, E && { variantProperties: E }), C && { componentProperties: C }), k = t.instanceTable.addInstance($);
      return n._instanceRef = k, i.add("_instanceRef"), await a.log(
        `  Exported detached INSTANCE: "${c}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), n;
    }
    const p = e.name || "(unnamed)", m = r.name || "(unnamed)", b = r.remote === !0, A = Te(e).page, d = Te(r), I = d.page;
    let u, O = I;
    if (b)
      if (I) {
        const c = ze(I);
        c != null && c.id ? (u = "normal", O = I, await a.log(
          `  Component "${m}" is from library but also exists on local page "${I.name}" with metadata. Treating as "normal" instance.`
        )) : (u = "remote", await a.log(
          `  Component "${m}" is from library and exists on local page "${I.name}" but has no metadata. Treating as "remote" instance.`
        ));
      } else
        u = "remote", await a.log(
          `  Component "${m}" is from library and not on a local page. Treating as "remote" instance.`
        );
    else if (I && A && I.id === A.id)
      u = "internal";
    else if (I && A && I.id !== A.id)
      u = "normal";
    else if (I && !A)
      u = "normal";
    else if (!b && d.reason === "detached") {
      const c = r.id;
      if (t.detachedComponentsHandled.has(c))
        u = "remote", await a.log(
          `Treating detached instance "${p}" -> component "${m}" as remote instance (already prompted)`
        );
      else {
        await a.warning(
          `Found detached instance: "${p}" -> component "${m}" (component is not on any page)`
        );
        try {
          await figma.viewport.scrollAndZoomIntoView([r]);
        } catch (f) {
          console.warn("Could not scroll to component:", f);
        }
        const y = `Found detached instance "${p}" attached to component "${m}". This should be fixed. Continue to publish?`;
        try {
          await re.prompt(y, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(c), u = "remote", await a.log(
            `Treating detached instance "${p}" as remote instance (will be created on REMOTES page)`
          );
        } catch (f) {
          if (f instanceof Error && f.message === "User cancelled") {
            const N = `Export cancelled: Detached instance "${p}" found. The component "${m}" is not on any page. Please fix the instance before exporting.`;
            throw await a.error(N), new Error(N);
          } else
            throw f;
        }
      }
    } else
      b || await a.warning(
        `  Instance "${p}" -> component "${m}": componentPage is null but component is not remote. Reason: ${d.reason}. Cannot determine instance type.`
      ), u = "normal";
    let S, M;
    try {
      if (e.variantProperties && (S = e.variantProperties, await a.log(
        `  Instance "${p}" -> variantProperties from instance: ${JSON.stringify(S)}`
      )), typeof e.getProperties == "function")
        try {
          const c = await e.getProperties();
          c && c.variantProperties && (await a.log(
            `  Instance "${p}" -> variantProperties from getProperties(): ${JSON.stringify(c.variantProperties)}`
          ), c.variantProperties && Object.keys(c.variantProperties).length > 0 && (S = c.variantProperties));
        } catch (c) {
          await a.log(
            `  Instance "${p}" -> getProperties() not available or failed: ${c}`
          );
        }
      if (e.componentProperties && (M = e.componentProperties), r.parent && r.parent.type === "COMPONENT_SET") {
        const c = r.parent;
        try {
          const y = c.componentPropertyDefinitions;
          y && await a.log(
            `  Component set "${c.name}" has property definitions: ${JSON.stringify(Object.keys(y))}`
          );
          const f = {}, N = m.split(",").map((E) => E.trim());
          for (const E of N) {
            const C = E.split("=").map(($) => $.trim());
            if (C.length >= 2) {
              const $ = C[0], k = C.slice(1).join("=").trim();
              y && y[$] && (f[$] = k);
            }
          }
          if (Object.keys(f).length > 0 && await a.log(
            `  Parsed variant properties from component name "${m}": ${JSON.stringify(f)}`
          ), S && Object.keys(S).length > 0)
            await a.log(
              `  Using variant properties from instance (source of truth): ${JSON.stringify(S)}`
            );
          else if (Object.keys(f).length > 0)
            S = f, await a.log(
              `  Using variant properties from component name (fallback): ${JSON.stringify(S)}`
            );
          else if (r.variantProperties) {
            const E = r.variantProperties;
            await a.log(
              `  Main component "${m}" has variantProperties: ${JSON.stringify(E)}`
            ), S = E;
          }
        } catch (y) {
          await a.warning(
            `  Could not get variant properties from component set: ${y}`
          );
        }
      }
    } catch (c) {
    }
    let h, v;
    try {
      let c = r.parent;
      const y = [];
      let f = 0;
      const N = 20;
      for (; c && f < N; )
        try {
          const E = c.type, C = c.name;
          if (E === "COMPONENT_SET" && !v && (v = C), E === "PAGE")
            break;
          const $ = C || "";
          y.unshift($), c = c.parent, f++;
        } catch (E) {
          break;
        }
      h = y;
    } catch (c) {
    }
    const l = L(L(L(L({
      instanceType: u,
      componentName: m
    }, v && { componentSetName: v }), S && { variantProperties: S }), M && { componentProperties: M }), u === "normal" ? { path: h || [] } : h && h.length > 0 && {
      path: h
    });
    if (u === "internal") {
      l.componentNodeId = r.id, await a.log(
        `  Found INSTANCE: "${p}" -> INTERNAL component "${m}" (ID: ${r.id.substring(0, 8)}...)`
      );
      const c = e.boundVariables, y = r.boundVariables;
      if (c && typeof c == "object") {
        const $ = Object.keys(c);
        await a.log(
          `  DEBUG: Internal instance "${p}" -> boundVariables keys: ${$.length > 0 ? $.join(", ") : "none"}`
        );
        for (const P of $) {
          const T = c[P], x = (T == null ? void 0 : T.type) || typeof T;
          await a.log(
            `  DEBUG:   boundVariables.${P}: type=${x}, value=${JSON.stringify(T)}`
          );
        }
        const k = [
          "backgrounds",
          "selectionColor",
          "selectionColors",
          "selection",
          "selectColor"
        ];
        for (const P of k)
          c[P] !== void 0 && await a.log(
            `  DEBUG:   Found potential "Selection colors" property: boundVariables.${P} = ${JSON.stringify(c[P])}`
          );
      } else
        await a.log(
          `  DEBUG: Internal instance "${p}" -> No boundVariables found on instance node`
        );
      if (y && typeof y == "object") {
        const $ = Object.keys(y);
        await a.log(
          `  DEBUG: Main component "${m}" -> boundVariables keys: ${$.length > 0 ? $.join(", ") : "none"}`
        );
      }
      const f = e.backgrounds;
      if (f && Array.isArray(f)) {
        await a.log(
          `  DEBUG: Internal instance "${p}" -> backgrounds array length: ${f.length}`
        );
        for (let $ = 0; $ < f.length; $++) {
          const k = f[$];
          if (k && typeof k == "object") {
            if (await a.log(
              `  DEBUG:   backgrounds[${$}] structure: ${JSON.stringify(Object.keys(k))}`
            ), k.boundVariables) {
              const P = Object.keys(k.boundVariables);
              await a.log(
                `  DEBUG:   backgrounds[${$}].boundVariables keys: ${P.length > 0 ? P.join(", ") : "none"}`
              );
              for (const T of P) {
                const x = k.boundVariables[T];
                await a.log(
                  `  DEBUG:     backgrounds[${$}].boundVariables.${T}: ${JSON.stringify(x)}`
                );
              }
            }
            k.color && await a.log(
              `  DEBUG:   backgrounds[${$}].color: ${JSON.stringify(k.color)}`
            );
          }
        }
      }
      const N = Object.keys(e).filter(
        ($) => !$.startsWith("_") && $ !== "parent" && $ !== "removed" && typeof e[$] != "function" && $ !== "type" && $ !== "id" && $ !== "name" && $ !== "boundVariables" && $ !== "backgrounds" && $ !== "fills"
      ), E = Object.keys(r).filter(
        ($) => !$.startsWith("_") && $ !== "parent" && $ !== "removed" && typeof r[$] != "function" && $ !== "type" && $ !== "id" && $ !== "name" && $ !== "boundVariables" && $ !== "backgrounds" && $ !== "fills"
      ), C = [
        .../* @__PURE__ */ new Set([...N, ...E])
      ].filter(
        ($) => $.toLowerCase().includes("selection") || $.toLowerCase().includes("select") || $.toLowerCase().includes("color") && !$.toLowerCase().includes("fill") && !$.toLowerCase().includes("stroke")
      );
      if (C.length > 0) {
        await a.log(
          `  DEBUG: Found selection/color-related properties: ${C.join(", ")}`
        );
        for (const $ of C)
          try {
            if (N.includes($)) {
              const k = e[$];
              await a.log(
                `  DEBUG:   Instance.${$}: ${JSON.stringify(k)}`
              );
            }
            if (E.includes($)) {
              const k = r[$];
              await a.log(
                `  DEBUG:   MainComponent.${$}: ${JSON.stringify(k)}`
              );
            }
          } catch (k) {
          }
      } else
        await a.log(
          "  DEBUG: No selection/color-related properties found on instance or main component"
        );
    } else if (u === "normal") {
      const c = O || I;
      if (c) {
        l.componentPageName = c.name;
        const f = ze(c);
        f != null && f.id && f.version !== void 0 ? (l.componentGuid = f.id, l.componentVersion = f.version, await a.log(
          `  Found INSTANCE: "${p}" -> NORMAL component "${m}" (ID: ${r.id.substring(0, 8)}...) at path [${(h || []).join(" → ")}]`
        )) : await a.warning(
          `  Instance "${p}" -> component "${m}" is classified as normal but page "${c.name}" has no metadata. This instance will not be importable.`
        );
      } else {
        const f = r.id;
        let N = "", E = "";
        switch (d.reason) {
          case "broken_chain":
            N = "The component's parent chain is broken and cannot be traversed to find the page", E = "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            N = "Cannot access the component's parent chain (access error)", E = "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            N = "Cannot determine which page the component is on", E = "Please ensure the component is properly placed on a page.";
        }
        try {
          await figma.viewport.scrollAndZoomIntoView([r]);
        } catch (k) {
          console.warn("Could not scroll to component:", k);
        }
        const C = `Normal instance "${p}" -> component "${m}" (ID: ${f}) has no componentPage. ${N}. ${E} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", C), await a.error(C);
        const $ = new Error(C);
        throw console.error("Throwing error:", $), $;
      }
      h === void 0 && console.warn(
        `Failed to build path for normal instance "${p}" -> component "${m}". Path is required for resolution.`
      );
      const y = h && h.length > 0 ? ` at path [${h.join(" → ")}]` : " at page root";
      await a.log(
        `  Found INSTANCE: "${p}" -> NORMAL component "${m}" (ID: ${r.id.substring(0, 8)}...)${y}`
      );
    } else if (u === "remote") {
      let c, y;
      const f = t.detachedComponentsHandled.has(
        r.id
      );
      if (!f)
        try {
          if (typeof r.getPublishStatusAsync == "function")
            try {
              const E = await r.getPublishStatusAsync();
              E && typeof E == "object" && (E.libraryName && (c = E.libraryName), E.libraryKey && (y = E.libraryKey));
            } catch (E) {
            }
          try {
            const E = figma.teamLibrary;
            if (typeof (E == null ? void 0 : E.getAvailableLibraryComponentSetsAsync) == "function") {
              const C = await E.getAvailableLibraryComponentSetsAsync();
              if (C && Array.isArray(C)) {
                for (const $ of C)
                  if ($.key === r.key || $.name === r.name) {
                    $.libraryName && (c = $.libraryName), $.libraryKey && (y = $.libraryKey);
                    break;
                  }
              }
            }
          } catch (E) {
          }
        } catch (E) {
          console.warn(
            `Error getting library info for remote component "${m}":`,
            E
          );
        }
      if (c && (l.remoteLibraryName = c), y && (l.remoteLibraryKey = y), f && (l.componentNodeId = r.id), t.instanceTable.getInstanceIndex(l) !== -1)
        await a.log(
          `  Found INSTANCE: "${p}" -> REMOTE component "${m}" (ID: ${r.id.substring(0, 8)}...)${f ? " [DETACHED]" : ""}`
        );
      else
        try {
          const { parseBaseNodeProperties: E } = await Promise.resolve().then(() => Ot), C = await E(e, t), { parseFrameProperties: $ } = await Promise.resolve().then(() => St), k = await $(e, t), P = q(L(L({}, C), k), {
            type: "COMPONENT"
            // Convert to COMPONENT type for recreation (must be after baseProps to override)
          });
          if (e.children && Array.isArray(e.children) && e.children.length > 0) {
            const T = q(L({}, t), {
              depth: (t.depth || 0) + 1
            }), { extractNodeData: x } = await Promise.resolve().then(() => jt), V = [];
            for (const U of e.children)
              try {
                let B;
                if (U.type === "INSTANCE")
                  try {
                    const K = await U.getMainComponentAsync();
                    if (K) {
                      const z = await E(
                        U,
                        t
                      ), J = await $(
                        U,
                        t
                      ), Z = await x(
                        K,
                        /* @__PURE__ */ new WeakSet(),
                        T
                      );
                      B = q(L(L(L({}, Z), z), J), {
                        type: "COMPONENT"
                        // Convert to COMPONENT
                      });
                    } else
                      B = await x(
                        U,
                        /* @__PURE__ */ new WeakSet(),
                        T
                      ), B.type === "INSTANCE" && (B.type = "COMPONENT"), delete B._instanceRef;
                  } catch (K) {
                    B = await x(
                      U,
                      /* @__PURE__ */ new WeakSet(),
                      T
                    ), B.type === "INSTANCE" && (B.type = "COMPONENT"), delete B._instanceRef;
                  }
                else {
                  B = await x(
                    U,
                    /* @__PURE__ */ new WeakSet(),
                    T
                  );
                  const K = U.boundVariables;
                  if (K && typeof K == "object") {
                    const z = Object.keys(K);
                    z.length > 0 && (await a.log(
                      `  DEBUG: Child "${U.name || "Unnamed"}" -> boundVariables keys: ${z.join(", ")}`
                    ), K.backgrounds !== void 0 && await a.log(
                      `  DEBUG:   Child "${U.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(K.backgrounds)}`
                    ));
                  }
                  if (r.children && Array.isArray(r.children)) {
                    const z = r.children.find(
                      (J) => J.name === U.name
                    );
                    if (z) {
                      const J = z.boundVariables;
                      if (J && typeof J == "object") {
                        const Z = Object.keys(J);
                        if (Z.length > 0 && (await a.log(
                          `  DEBUG: Main component child "${z.name || "Unnamed"}" -> boundVariables keys: ${Z.join(", ")}`
                        ), J.backgrounds !== void 0 && (await a.log(
                          `  DEBUG:   Main component child "${z.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(J.backgrounds)}`
                        ), !K || !K.backgrounds))) {
                          await a.log(
                            "  DEBUG:   Instance child doesn't have boundVariables.backgrounds, but main component child does - preserving from main component"
                          );
                          const { extractBoundVariables: se } = await Promise.resolve().then(() => ce), Q = await se(
                            J,
                            t.variableTable,
                            t.collectionTable
                          );
                          B.boundVariables || (B.boundVariables = {}), Q.backgrounds && (B.boundVariables.backgrounds = Q.backgrounds, await a.log(
                            "  DEBUG:   ✓ Added boundVariables.backgrounds to childData from main component child"
                          ));
                        }
                      }
                    }
                  }
                }
                V.push(B);
              } catch (B) {
                console.warn(
                  `Failed to extract child "${U.name || "Unnamed"}" for remote component "${m}":`,
                  B
                );
              }
            P.children = V;
          }
          if (!P)
            throw new Error("Failed to build structure for remote instance");
          try {
            const T = e.boundVariables;
            if (T && typeof T == "object") {
              const R = Object.keys(T);
              await a.log(
                `  DEBUG: Instance "${p}" -> boundVariables keys: ${R.length > 0 ? R.join(", ") : "none"}`
              );
              for (const G of R) {
                const j = T[G], ct = (j == null ? void 0 : j.type) || typeof j;
                if (await a.log(
                  `  DEBUG:   boundVariables.${G}: type=${ct}, value=${JSON.stringify(j)}`
                ), j && typeof j == "object" && !Array.isArray(j)) {
                  const Ce = Object.keys(j);
                  if (Ce.length > 0) {
                    await a.log(
                      `  DEBUG:     boundVariables.${G} has nested keys: ${Ce.join(", ")}`
                    );
                    for (const Ue of Ce) {
                      const fe = j[Ue];
                      fe && typeof fe == "object" && fe.type === "VARIABLE_ALIAS" && await a.log(
                        `  DEBUG:       boundVariables.${G}.${Ue}: VARIABLE_ALIAS id=${fe.id}`
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
              for (const G of F)
                T[G] !== void 0 && await a.log(
                  `  DEBUG:   Found potential "Selection colors" property: boundVariables.${G} = ${JSON.stringify(T[G])}`
                );
            } else
              await a.log(
                `  DEBUG: Instance "${p}" -> No boundVariables found on instance node`
              );
            const x = T && T.fills !== void 0 && T.fills !== null, V = P.fills !== void 0 && Array.isArray(P.fills) && P.fills.length > 0, U = e.fills !== void 0 && Array.isArray(e.fills) && e.fills.length > 0, B = r.fills !== void 0 && Array.isArray(r.fills) && r.fills.length > 0;
            if (await a.log(
              `  DEBUG: Instance "${p}" -> fills check: instanceHasFills=${U}, structureHasFills=${V}, mainComponentHasFills=${B}, hasInstanceFillsBoundVar=${!!x}`
            ), x && !V) {
              await a.log(
                "  DEBUG: Instance has boundVariables.fills but structure has no fills - attempting to get fills"
              );
              try {
                if (U) {
                  const { serializeFills: R } = await Promise.resolve().then(() => ce), F = await R(
                    e.fills,
                    t.variableTable,
                    t.collectionTable
                  );
                  P.fills = F, await a.log(
                    `  DEBUG: Got ${F.length} fill(s) from instance node`
                  );
                } else if (B) {
                  const { serializeFills: R } = await Promise.resolve().then(() => ce), F = await R(
                    r.fills,
                    t.variableTable,
                    t.collectionTable
                  );
                  P.fills = F, await a.log(
                    `  DEBUG: Got ${F.length} fill(s) from main component`
                  );
                } else
                  await a.warning(
                    "  DEBUG: Instance has boundVariables.fills but neither instance nor main component has fills"
                  );
              } catch (R) {
                await a.warning(
                  `  Failed to get fills: ${R}`
                );
              }
            }
            const K = e.selectionColor, z = r.selectionColor;
            K !== void 0 && await a.log(
              `  DEBUG: Instance "${p}" -> selectionColor: ${JSON.stringify(K)}`
            ), z !== void 0 && await a.log(
              `  DEBUG: Main component "${m}" -> selectionColor: ${JSON.stringify(z)}`
            );
            const J = Object.keys(e).filter(
              (R) => !R.startsWith("_") && R !== "parent" && R !== "removed" && typeof e[R] != "function" && R !== "type" && R !== "id" && R !== "name"
            ), Z = Object.keys(r).filter(
              (R) => !R.startsWith("_") && R !== "parent" && R !== "removed" && typeof r[R] != "function" && R !== "type" && R !== "id" && R !== "name"
            ), se = [
              .../* @__PURE__ */ new Set([...J, ...Z])
            ].filter(
              (R) => R.toLowerCase().includes("selection") || R.toLowerCase().includes("select") || R.toLowerCase().includes("color") && !R.toLowerCase().includes("fill") && !R.toLowerCase().includes("stroke")
            );
            if (se.length > 0) {
              await a.log(
                `  DEBUG: Found selection/color-related properties: ${se.join(", ")}`
              );
              for (const R of se)
                try {
                  if (J.includes(R)) {
                    const F = e[R];
                    await a.log(
                      `  DEBUG:   Instance.${R}: ${JSON.stringify(F)}`
                    );
                  }
                  if (Z.includes(R)) {
                    const F = r[R];
                    await a.log(
                      `  DEBUG:   MainComponent.${R}: ${JSON.stringify(F)}`
                    );
                  }
                } catch (F) {
                }
            } else
              await a.log(
                "  DEBUG: No selection/color-related properties found on instance or main component"
              );
            const Q = r.boundVariables;
            if (Q && typeof Q == "object") {
              const R = Object.keys(Q);
              if (R.length > 0) {
                await a.log(
                  `  DEBUG: Main component "${m}" -> boundVariables keys: ${R.join(", ")}`
                );
                for (const F of R) {
                  const G = Q[F], j = (G == null ? void 0 : G.type) || typeof G;
                  await a.log(
                    `  DEBUG:   Main component boundVariables.${F}: type=${j}, value=${JSON.stringify(G)}`
                  );
                }
              }
            }
            if (T && Object.keys(T).length > 0) {
              await a.log(
                `  DEBUG: Preserving instance's boundVariables in structure (${Object.keys(T).length} key(s))`
              );
              const { extractBoundVariables: R } = await Promise.resolve().then(() => ce), F = await R(
                T,
                t.variableTable,
                t.collectionTable
              );
              P.boundVariables || (P.boundVariables = {});
              for (const [G, j] of Object.entries(
                F
              ))
                j !== void 0 && (P.boundVariables[G] !== void 0 && await a.log(
                  `  DEBUG: Structure already has boundVariables.${G} from baseProps, but instance also has it - using instance's boundVariables.${G}`
                ), P.boundVariables[G] = j, await a.log(
                  `  DEBUG: Set boundVariables.${G} in structure: ${JSON.stringify(j)}`
                ));
              F.fills !== void 0 ? await a.log(
                "  DEBUG: ✓ Preserved boundVariables.fills from instance"
              ) : x && await a.warning(
                "  DEBUG: Instance has boundVariables.fills but extractBoundVariables didn't extract it"
              ), F.backgrounds !== void 0 ? await a.log(
                `  DEBUG: ✓ Preserved boundVariables.backgrounds from instance: ${JSON.stringify(F.backgrounds)}`
              ) : T && T.backgrounds !== void 0 && await a.warning(
                "  DEBUG: Instance has boundVariables.backgrounds but extractBoundVariables didn't extract it"
              );
            }
            if (Q && Object.keys(Q).length > 0) {
              await a.log(
                `  DEBUG: Checking main component's boundVariables for properties not in instance (${Object.keys(Q).length} key(s))`
              );
              const { extractBoundVariables: R } = await Promise.resolve().then(() => ce), F = await R(
                Q,
                t.variableTable,
                t.collectionTable
              );
              P.boundVariables || (P.boundVariables = {});
              for (const [G, j] of Object.entries(
                F
              ))
                j !== void 0 && (P.boundVariables[G] === void 0 ? (P.boundVariables[G] = j, await a.log(
                  `  DEBUG: Added boundVariables.${G} from main component (not in instance): ${JSON.stringify(j)}`
                )) : await a.log(
                  `  DEBUG: Skipped boundVariables.${G} from main component (instance already has it)`
                ));
            }
            await a.log(
              `  DEBUG: Final structure for "${m}": hasFills=${!!P.fills}, fillsCount=${((o = P.fills) == null ? void 0 : o.length) || 0}, hasBoundVars=${!!P.boundVariables}, boundVarsKeys=${P.boundVariables ? Object.keys(P.boundVariables).join(", ") : "none"}`
            ), (s = P.boundVariables) != null && s.fills && await a.log(
              `  DEBUG: Structure boundVariables.fills: ${JSON.stringify(P.boundVariables.fills)}`
            );
          } catch (T) {
            await a.warning(
              `  Failed to handle bound variables for fills: ${T}`
            );
          }
          l.structure = P, f ? await a.log(
            `  Extracted structure for detached component "${m}" (ID: ${r.id.substring(0, 8)}...)`
          ) : await a.log(
            `  Extracted structure from instance for remote component "${m}" (preserving size overrides: ${e.width}x${e.height})`
          ), await a.log(
            `  Found INSTANCE: "${p}" -> REMOTE component "${m}" (ID: ${r.id.substring(0, 8)}...)${f ? " [DETACHED]" : ""}`
          );
        } catch (E) {
          const C = `Failed to extract structure for remote component "${m}": ${E instanceof Error ? E.message : String(E)}`;
          console.error(C, E), await a.error(C);
        }
    }
    const g = t.instanceTable.addInstance(l);
    n._instanceRef = g, i.add("_instanceRef");
  }
  return n;
}
class pe {
  constructor() {
    D(this, "instanceMap");
    // unique key -> index
    D(this, "instances");
    // index -> instance data
    D(this, "nextIndex");
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
    const n = new pe(), i = Object.entries(t).sort(
      (o, s) => parseInt(o[0], 10) - parseInt(s[0], 10)
    );
    for (const [o, s] of i) {
      const r = parseInt(o, 10), p = n.generateKey(s);
      n.instanceMap.set(p, r), n.instances[r] = s, n.nextIndex = Math.max(n.nextIndex, r + 1);
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
const Xe = {
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
function Ut() {
  const e = {};
  for (const [t, n] of Object.entries(Xe))
    e[n] = t;
  return e;
}
function Fe(e) {
  var t;
  return (t = Xe[e]) != null ? t : e;
}
function Bt(e) {
  var t;
  return typeof e == "number" ? (t = Ut()[e]) != null ? t : e.toString() : e;
}
const Ze = {
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
}, Me = {};
for (const [e, t] of Object.entries(Ze))
  Me[t] = e;
class $e {
  constructor() {
    D(this, "shortToLong");
    D(this, "longToShort");
    this.shortToLong = L({}, Me), this.longToShort = L({}, Ze);
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
      for (const [o, s] of Object.entries(t)) {
        const r = this.getShortName(o);
        if (r !== o && !i.has(r)) {
          let p = this.compressObject(s);
          r === "type" && typeof p == "string" && (p = Fe(p)), n[r] = p;
        } else {
          let p = this.compressObject(s);
          o === "type" && typeof p == "string" && (p = Fe(p)), n[o] = p;
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
        const s = this.getLongName(i);
        let r = this.expandObject(o);
        (s === "type" || i === "type") && (typeof r == "number" || typeof r == "string") && (r = Bt(r)), n[s] = r;
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
    return L({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(t) {
    const n = new $e();
    n.shortToLong = L(L({}, Me), t), n.longToShort = {};
    for (const [i, o] of Object.entries(
      n.shortToLong
    ))
      n.longToShort[o] = i;
    return n;
  }
}
function zt(e, t) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const n = {};
  e.metadata && (n.metadata = e.metadata);
  for (const [i, o] of Object.entries(e))
    i !== "metadata" && (n[i] = t.compressObject(o));
  return n;
}
function Ft(e, t) {
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
  var I, u, O, S, M, h, v;
  if (!e || typeof e != "object")
    return e;
  const i = (I = n.maxNodes) != null ? I : 1e4, o = (u = n.nodeCount) != null ? u : 0;
  if (o >= i)
    return await a.warning(
      `Maximum node count (${i}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: o
    };
  const s = {
    visited: (O = n.visited) != null ? O : /* @__PURE__ */ new WeakSet(),
    depth: (S = n.depth) != null ? S : 0,
    maxDepth: (M = n.maxDepth) != null ? M : 100,
    nodeCount: o + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: n.variableTable,
    collectionTable: n.collectionTable,
    instanceTable: n.instanceTable,
    detachedComponentsHandled: (h = n.detachedComponentsHandled) != null ? h : /* @__PURE__ */ new Set(),
    exportedIds: (v = n.exportedIds) != null ? v : /* @__PURE__ */ new Map()
  };
  if (t.has(e))
    return "[Circular Reference]";
  t.add(e), s.visited = t;
  const r = {}, p = await De(e, s);
  if (Object.assign(r, p), r.id && s.exportedIds) {
    const l = s.exportedIds.get(r.id);
    if (l !== void 0) {
      const g = r.name || "Unnamed";
      if (l !== g) {
        const c = `Duplicate ID detected during export: ID "${r.id.substring(0, 8)}..." is used by both "${l}" and "${g}". Each node must have a unique ID.`;
        throw await a.error(c), new Error(c);
      }
      await a.warning(
        `Node "${g}" (ID: ${r.id.substring(0, 8)}...) was encountered multiple times during export. This may indicate a structural issue.`
      );
    } else
      s.exportedIds.set(r.id, r.name || "Unnamed");
  }
  const m = e.type;
  if (m)
    switch (m) {
      case "FRAME":
      case "COMPONENT": {
        const l = await Se(e);
        Object.assign(r, l);
        break;
      }
      case "INSTANCE": {
        const l = await Gt(
          e,
          s
        );
        Object.assign(r, l);
        const g = await Se(
          e
        );
        Object.assign(r, g);
        break;
      }
      case "TEXT": {
        const l = await It(e);
        Object.assign(r, l);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const l = await Rt(e);
        Object.assign(r, l);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const l = await kt(e);
        Object.assign(r, l);
        break;
      }
      default:
        s.unhandledKeys.add("_unknownType");
        break;
    }
  const b = Object.getOwnPropertyNames(e), w = /* @__PURE__ */ new Set([
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
  (m === "FRAME" || m === "COMPONENT" || m === "INSTANCE") && (w.add("layoutMode"), w.add("primaryAxisSizingMode"), w.add("counterAxisSizingMode"), w.add("primaryAxisAlignItems"), w.add("counterAxisAlignItems"), w.add("paddingLeft"), w.add("paddingRight"), w.add("paddingTop"), w.add("paddingBottom"), w.add("itemSpacing"), w.add("cornerRadius"), w.add("clipsContent"), w.add("layoutWrap"), w.add("layoutGrow")), m === "TEXT" && (w.add("characters"), w.add("fontName"), w.add("fontSize"), w.add("textAlignHorizontal"), w.add("textAlignVertical"), w.add("letterSpacing"), w.add("lineHeight"), w.add("textCase"), w.add("textDecoration"), w.add("textAutoResize"), w.add("paragraphSpacing"), w.add("paragraphIndent"), w.add("listOptions")), (m === "VECTOR" || m === "LINE") && (w.add("fillGeometry"), w.add("strokeGeometry")), (m === "RECTANGLE" || m === "ELLIPSE" || m === "STAR" || m === "POLYGON") && (w.add("pointCount"), w.add("innerRadius"), w.add("arcData")), m === "INSTANCE" && (w.add("mainComponent"), w.add("componentProperties"));
  for (const l of b)
    typeof e[l] != "function" && (w.has(l) || s.unhandledKeys.add(l));
  s.unhandledKeys.size > 0 && (r._unhandledKeys = Array.from(s.unhandledKeys).sort());
  const A = r._instanceRef !== void 0 && s.instanceTable && m === "INSTANCE";
  let d = !1;
  if (A) {
    const l = s.instanceTable.getInstanceByIndex(
      r._instanceRef
    );
    l && l.instanceType === "normal" && (d = !0, await a.log(
      `  Skipping children extraction for normal instance "${r.name || "Unnamed"}" - will be resolved from referenced component`
    ));
  }
  if (!d && e.children && Array.isArray(e.children)) {
    const l = s.maxDepth;
    if (s.depth >= l)
      r.children = {
        _truncated: !0,
        _reason: `Maximum depth (${l}) reached`,
        _count: e.children.length
      };
    else if (s.nodeCount >= i)
      r.children = {
        _truncated: !0,
        _reason: `Maximum node count (${i}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const g = q(L({}, s), {
        depth: s.depth + 1
      }), c = [];
      let y = !1;
      for (const f of e.children) {
        if (g.nodeCount >= i) {
          r.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: c.length,
            _total: e.children.length,
            children: c
          }, y = !0;
          break;
        }
        const N = await Ee(f, t, g);
        c.push(N), g.nodeCount && (s.nodeCount = g.nodeCount);
      }
      y || (r.children = c);
    }
  }
  return r;
}
async function _e(e, t = /* @__PURE__ */ new Set(), n = !1) {
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
    const s = o[i], r = s.id;
    if (t.has(r))
      return await a.log(
        `Page "${s.name}" has already been processed, skipping...`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Page already processed",
        data: {}
      };
    t.add(r), await a.log(
      `Selected page: "${s.name}" (index: ${i})`
    ), await a.log(
      "Initializing variable, collection, and instance tables..."
    );
    const p = new Ne(), m = new we(), b = new pe();
    await a.log("Fetching team library variable collections...");
    let w = [];
    try {
      if (w = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((T) => ({
        libraryName: T.libraryName,
        key: T.key,
        name: T.name
      })), await a.log(
        `Found ${w.length} library collection(s) in team library`
      ), w.length > 0)
        for (const T of w)
          await a.log(`  - ${T.name} (from ${T.libraryName})`);
    } catch (P) {
      await a.warning(
        `Could not get library variable collections: ${P instanceof Error ? P.message : String(P)}`
      );
    }
    await a.log("Extracting node data from page..."), await a.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await a.log(
      "Collections will be discovered as variables are processed:"
    );
    const A = await Ee(
      s,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: p,
        collectionTable: m,
        instanceTable: b
      }
    );
    await a.log("Node extraction finished");
    const d = ve(A), I = p.getSize(), u = m.getSize(), O = b.getSize();
    if (await a.log("Extraction complete:"), await a.log(`  - Total nodes: ${d}`), await a.log(`  - Unique variables: ${I}`), await a.log(`  - Unique collections: ${u}`), await a.log(`  - Unique instances: ${O}`), u > 0) {
      await a.log("Collections found:");
      const P = m.getTable();
      for (const [T, x] of Object.values(P).entries()) {
        const V = x.collectionGuid ? ` (GUID: ${x.collectionGuid.substring(0, 8)}...)` : "";
        await a.log(
          `  ${T}: ${x.collectionName}${V} - ${x.modes.length} mode(s)`
        );
      }
    }
    await a.log("Checking for referenced component pages...");
    const S = [], M = b.getSerializedTable(), h = Object.values(M).filter(
      (P) => P.instanceType === "normal"
    );
    if (h.length > 0) {
      await a.log(
        `Found ${h.length} normal instance(s) to check`
      );
      const P = /* @__PURE__ */ new Map();
      for (const T of h)
        if (T.componentPageName) {
          const x = o.find((V) => V.name === T.componentPageName);
          if (x && !t.has(x.id))
            P.has(x.id) || P.set(x.id, x);
          else if (!x) {
            const V = `Normal instance references component "${T.componentName || "(unnamed)"}" on page "${T.componentPageName}", but that page was not found. Cannot export.`;
            throw await a.error(V), new Error(V);
          }
        } else {
          const x = `Normal instance references component "${T.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw await a.error(x), new Error(x);
        }
      await a.log(
        `Found ${P.size} unique referenced page(s)`
      );
      for (const [T, x] of P.entries()) {
        const V = x.name;
        if (t.has(T)) {
          await a.log(`Skipping "${V}" - already processed`);
          continue;
        }
        const U = x.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let B = !1;
        if (U)
          try {
            const z = JSON.parse(U);
            B = !!(z.id && z.version !== void 0);
          } catch (z) {
          }
        const K = `Do you want to also publish referenced component "${V}"?`;
        try {
          await re.prompt(K, {
            okLabel: "Yes",
            cancelLabel: "No",
            timeoutMs: 3e5
            // 5 minutes
          }), await a.log(`Exporting referenced page: "${V}"`);
          const z = o.findIndex(
            (Z) => Z.id === x.id
          );
          if (z === -1)
            throw await a.error(
              `Could not find page index for "${V}"`
            ), new Error(`Could not find page index for "${V}"`);
          const J = await _e(
            {
              pageIndex: z
            },
            t,
            // Pass the same set to track all processed pages
            !0
            // Mark as recursive call
          );
          if (J.success && J.data) {
            const Z = J.data;
            S.push(Z), await a.log(
              `Successfully exported referenced page: "${V}"`
            );
          } else
            throw new Error(
              `Failed to export referenced page "${V}": ${J.message}`
            );
        } catch (z) {
          if (z instanceof Error && z.message === "User cancelled")
            if (B)
              await a.log(
                `User declined to publish "${V}", but page has existing metadata. Continuing with existing metadata.`
              );
            else
              throw await a.error(
                `Export cancelled: Referenced page "${V}" has no metadata and user declined to publish it.`
              ), new Error(
                `Cannot continue export: Referenced component "${V}" has no metadata. Please publish it first or choose to publish it now.`
              );
          else
            throw z;
        }
      }
    }
    await a.log("Creating string table...");
    const v = new $e();
    await a.log("Getting page metadata...");
    const l = s.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let g = "", c = 0;
    if (l)
      try {
        const P = JSON.parse(l);
        g = P.id || "", c = P.version || 0;
      } catch (P) {
        await a.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!g) {
      await a.log("Generating new GUID for page..."), g = await Ve();
      const P = {
        _ver: 1,
        id: g,
        name: s.name,
        version: c,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      s.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(P)
      );
    }
    await a.log("Creating export data structure...");
    const y = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "2.7.0",
        // Updated version for string table compression
        figmaApiVersion: figma.apiVersion,
        guid: g,
        version: c,
        name: s.name,
        pluginVersion: "1.0.0"
      },
      stringTable: v.getSerializedTable(),
      collections: m.getSerializedTable(),
      variables: p.getSerializedTable(),
      instances: b.getSerializedTable(),
      libraries: w,
      // Libraries might not need compression, but could be added later
      pageData: A
    };
    await a.log("Compressing JSON data...");
    const f = zt(y, v);
    await a.log("Serializing to JSON...");
    const N = JSON.stringify(f, null, 2), E = (N.length / 1024).toFixed(2), $ = be(s.name).trim().replace(/\s+/g, "_") + ".rec.json";
    return await a.log(`JSON serialization complete: ${E} KB`), await a.log(`Export file: ${$}`), await a.log("=== Export Complete ==="), {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: $,
        jsonData: N,
        pageName: s.name,
        additionalPages: S
        // Populated with referenced component pages
      }
    };
  } catch (i) {
    const o = i instanceof Error ? i.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", i), console.error("Error message:", o), await a.error(`Export failed: ${o}`), i instanceof Error && i.stack && (console.error("Stack trace:", i.stack), await a.error(`Stack trace: ${i.stack}`));
    const s = {
      type: "exportPage",
      success: !1,
      error: !0,
      message: o,
      data: {}
    };
    return console.error("Returning error response:", s), s;
  }
}
const jt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  countTotalNodes: ve,
  exportPage: _e,
  extractNodeData: Ee
}, Symbol.toStringTag, { value: "Module" }));
async function de(e, t) {
  for (const n of t)
    e.modes.find((o) => o.name === n) || e.addMode(n);
}
const X = "recursica:collectionId";
async function he(e) {
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
      X
    );
    if (n && n.trim() !== "")
      return n;
    const i = await Ve();
    return e.setSharedPluginData("recursica", X, i), i;
  }
}
function Jt(e, t) {
  const n = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(n))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Kt(e) {
  let t;
  const n = e.collectionName.trim().toLowerCase(), i = ["token", "tokens", "theme", "themes"], o = e.isLocal;
  if (o === !1 || o === void 0 && i.includes(n))
    try {
      const p = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((m) => m.name.trim().toLowerCase() === n);
      if (p) {
        Jt(e.collectionName, !1);
        const m = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          p.key
        );
        if (m.length > 0) {
          const b = await figma.variables.importVariableByKeyAsync(m[0].key), w = await figma.variables.getVariableCollectionByIdAsync(
            b.variableCollectionId
          );
          if (w) {
            if (t = w, e.collectionGuid) {
              const A = t.getSharedPluginData(
                "recursica",
                X
              );
              (!A || A.trim() === "") && t.setSharedPluginData(
                "recursica",
                X,
                e.collectionGuid
              );
            } else
              await he(t);
            return await de(t, e.modes), { collection: t };
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
    if (e.collectionGuid && (p = r.find((m) => m.getSharedPluginData("recursica", X) === e.collectionGuid)), p || (p = r.find(
      (m) => m.name === e.collectionName
    )), p)
      if (t = p, e.collectionGuid) {
        const m = t.getSharedPluginData(
          "recursica",
          X
        );
        (!m || m.trim() === "") && t.setSharedPluginData(
          "recursica",
          X,
          e.collectionGuid
        );
      } else
        await he(t);
    else
      t = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? t.setSharedPluginData(
        "recursica",
        X,
        e.collectionGuid
      ) : await he(t);
  } else {
    const r = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), p = e.collectionName.trim().toLowerCase(), m = r.find((d) => d.name.trim().toLowerCase() === p);
    if (!m)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const b = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      m.key
    );
    if (b.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const w = await figma.variables.importVariableByKeyAsync(
      b[0].key
    ), A = await figma.variables.getVariableCollectionByIdAsync(
      w.variableCollectionId
    );
    if (!A)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (t = A, e.collectionGuid) {
      const d = t.getSharedPluginData(
        "recursica",
        X
      );
      (!d || d.trim() === "") && t.setSharedPluginData(
        "recursica",
        X,
        e.collectionGuid
      );
    } else
      he(t);
  }
  return await de(t, e.modes), { collection: t };
}
async function Le(e, t) {
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
async function Ht(e, t, n, i, o) {
  for (const [s, r] of Object.entries(t)) {
    const p = i.modes.find((b) => b.name === s);
    if (!p) {
      console.warn(
        `Mode "${s}" not found in collection "${i.name}" for variable "${e.name}". Skipping.`
      );
      continue;
    }
    const m = p.modeId;
    try {
      if (r == null)
        continue;
      if (typeof r == "string" || typeof r == "number" || typeof r == "boolean") {
        e.setValueForMode(m, r);
        continue;
      }
      if (typeof r == "object" && r !== null && "_varRef" in r && typeof r._varRef == "number") {
        const b = r;
        let w = null;
        const A = n.getVariableByIndex(
          b._varRef
        );
        if (A) {
          let d = null;
          if (o && A._colRef !== void 0) {
            const I = o.getCollectionByIndex(
              A._colRef
            );
            I && (d = (await Kt(I)).collection);
          }
          d && (w = await Le(
            d,
            A.variableName
          ));
        }
        if (w) {
          const d = {
            type: "VARIABLE_ALIAS",
            id: w.id
          };
          e.setValueForMode(m, d);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${s}" in variable "${e.name}". Variable reference index: ${b._varRef}`
          );
      }
    } catch (b) {
      console.warn(
        `Error setting value for mode "${s}" in variable "${e.name}":`,
        b
      );
    }
  }
}
async function xe(e, t, n, i) {
  const o = figma.variables.createVariable(
    e.variableName,
    t,
    e.variableType
  );
  return e.valuesByMode && await Ht(
    o,
    e.valuesByMode,
    n,
    t,
    // Pass collection to look up modes by name
    i
  ), o;
}
async function Wt(e, t, n, i) {
  const o = t.getVariableByIndex(e);
  if (!o || o._colRef === void 0)
    return null;
  const s = i.get(String(o._colRef));
  if (!s)
    return null;
  const r = await Le(
    s,
    o.variableName
  );
  if (r) {
    let p;
    if (typeof o.variableType == "number" ? p = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[o.variableType] || String(o.variableType) : p = o.variableType, Qe(r, p))
      return r;
  }
  return await xe(
    o,
    s,
    t,
    n
  );
}
async function qt(e, t, n, i) {
  if (!(!t || typeof t != "object"))
    try {
      const o = e[n];
      if (!o || !Array.isArray(o))
        return;
      const s = t[n];
      if (Array.isArray(s))
        for (let r = 0; r < s.length && r < o.length; r++) {
          const p = s[r];
          if (p && typeof p == "object") {
            if (o[r].boundVariables || (o[r].boundVariables = {}), ye(p)) {
              const m = p._varRef;
              if (m !== void 0) {
                const b = i.get(String(m));
                b && (o[r].boundVariables.color = {
                  type: "VARIABLE_ALIAS",
                  id: b.id
                });
              }
            } else
              for (const [m, b] of Object.entries(
                p
              ))
                if (ye(b)) {
                  const w = b._varRef;
                  if (w !== void 0) {
                    const A = i.get(String(w));
                    A && (o[r].boundVariables[m] = {
                      type: "VARIABLE_ALIAS",
                      id: A.id
                    });
                  }
                }
          }
        }
    } catch (o) {
      console.log(`Error restoring bound variables for ${n}:`, o);
    }
}
function Dt(e, t) {
  const n = yt(t);
  if (e.visible === void 0 && (e.visible = n.visible), e.locked === void 0 && (e.locked = n.locked), e.opacity === void 0 && (e.opacity = n.opacity), e.rotation === void 0 && (e.rotation = n.rotation), e.blendMode === void 0 && (e.blendMode = n.blendMode), t === "FRAME" || t === "COMPONENT" || t === "INSTANCE") {
    const i = H;
    e.layoutMode === void 0 && (e.layoutMode = i.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = i.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = i.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = i.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = i.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = i.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = i.paddingRight), e.paddingTop === void 0 && (e.paddingTop = i.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = i.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = i.itemSpacing);
  }
  if (t === "TEXT") {
    const i = Y;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = i.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = i.textAlignVertical), e.textCase === void 0 && (e.textCase = i.textCase), e.textDecoration === void 0 && (e.textDecoration = i.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = i.textAutoResize);
  }
}
async function oe(e, t, n = null, i = null, o = null, s = null, r = null, p = !1, m = null, b = null, w = null, A = null) {
  var M;
  let d;
  switch (e.type) {
    case "FRAME":
      d = figma.createFrame();
      break;
    case "RECTANGLE":
      d = figma.createRectangle();
      break;
    case "ELLIPSE":
      d = figma.createEllipse();
      break;
    case "TEXT":
      d = figma.createText();
      break;
    case "VECTOR":
      d = figma.createVector();
      break;
    case "STAR":
      d = figma.createStar();
      break;
    case "LINE":
      d = figma.createLine();
      break;
    case "COMPONENT":
      if (e.id && r && r.has(e.id))
        d = r.get(e.id), await a.log(
          `Reusing existing COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id.substring(0, 8)}...)`
        );
      else if (d = figma.createComponent(), await a.log(
        `Created COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id ? e.id.substring(0, 8) + "..." : "no ID"})`
      ), e.componentPropertyDefinitions) {
        const h = e.componentPropertyDefinitions;
        let v = 0, l = 0;
        for (const [g, c] of Object.entries(h))
          try {
            const y = c.type;
            let f = null;
            if (typeof y == "string" ? (y === "TEXT" || y === "BOOLEAN" || y === "INSTANCE_SWAP" || y === "VARIANT") && (f = y) : typeof y == "number" && (f = {
              2: "TEXT",
              // Text property
              25: "BOOLEAN",
              // Boolean property
              27: "INSTANCE_SWAP",
              // Instance swap property
              26: "VARIANT"
              // Variant property
            }[y] || null), !f) {
              await a.warning(
                `  Unknown property type ${y} (${typeof y}) for property "${g}" in component "${e.name || "Unnamed"}"`
              ), l++;
              continue;
            }
            const N = c.defaultValue, E = g.split("#")[0];
            d.addComponentProperty(
              E,
              f,
              N
            ), v++;
          } catch (y) {
            await a.warning(
              `  Failed to add component property "${g}" to "${e.name || "Unnamed"}": ${y}`
            ), l++;
          }
        v > 0 && await a.log(
          `  Added ${v} component property definition(s) to "${e.name || "Unnamed"}"${l > 0 ? ` (${l} failed)` : ""}`
        );
      }
      break;
    case "COMPONENT_SET": {
      const h = e.children ? e.children.filter((g) => g.type === "COMPONENT").length : 0;
      await a.log(
        `Creating COMPONENT_SET "${e.name || "Unnamed"}" by combining ${h} component variant(s)`
      );
      const v = [];
      let l = null;
      if (e.children && Array.isArray(e.children)) {
        l = figma.createFrame(), l.name = `_temp_${e.name || "COMPONENT_SET"}`, l.visible = !1, ((t == null ? void 0 : t.type) === "PAGE" ? t : figma.currentPage).appendChild(l);
        for (const c of e.children)
          if (c.type === "COMPONENT" && !c._truncated)
            try {
              const y = await oe(
                c,
                l,
                // Use temp parent for now
                n,
                i,
                o,
                s,
                r,
                p,
                m,
                null,
                // deferredInstances - not needed for component set creation
                null,
                // parentNodeData - not needed here, will be passed correctly in recursive calls
                A
              );
              y && y.type === "COMPONENT" && (v.push(y), await a.log(
                `  Created component variant: "${y.name || "Unnamed"}"`
              ));
            } catch (y) {
              await a.warning(
                `  Failed to create component variant "${c.name || "Unnamed"}": ${y}`
              );
            }
      }
      if (v.length > 0)
        try {
          const g = t || figma.currentPage, c = figma.combineAsVariants(
            v,
            g
          );
          e.name && (c.name = e.name), e.x !== void 0 && (c.x = e.x), e.y !== void 0 && (c.y = e.y), l && l.parent && l.remove(), await a.log(
            `  ✓ Successfully created COMPONENT_SET "${c.name}" with ${v.length} variant(s)`
          ), d = c;
        } catch (g) {
          if (await a.warning(
            `  Failed to combine components into COMPONENT_SET "${e.name || "Unnamed"}": ${g}. Falling back to frame.`
          ), d = figma.createFrame(), e.name && (d.name = e.name), l && l.children.length > 0) {
            for (const c of l.children)
              d.appendChild(c);
            l.remove();
          }
        }
      else
        await a.warning(
          `  No valid component variants found for COMPONENT_SET "${e.name || "Unnamed"}". Creating frame instead.`
        ), d = figma.createFrame(), e.name && (d.name = e.name), l && l.remove();
      break;
    }
    case "INSTANCE":
      if (p)
        d = figma.createFrame(), e.name && (d.name = e.name);
      else if (e._instanceRef !== void 0 && o && r) {
        const h = o.getInstanceByIndex(
          e._instanceRef
        );
        if (h && h.instanceType === "internal")
          if (h.componentNodeId)
            if (h.componentNodeId === e.id)
              await a.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), d = figma.createFrame(), e.name && (d.name = e.name);
            else {
              const v = r.get(
                h.componentNodeId
              );
              if (!v) {
                const l = Array.from(r.keys()).slice(
                  0,
                  20
                );
                await a.error(
                  `Component not found for internal instance "${e.name}" (ID: ${h.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), await a.error(
                  `Looking for component ID: ${h.componentNodeId}`
                ), await a.error(
                  `Available IDs in mapping (first 20): ${l.map((N) => N.substring(0, 8) + "...").join(", ")}`
                );
                const g = (N, E) => {
                  if (N.type === "COMPONENT" && N.id === E)
                    return !0;
                  if (N.children && Array.isArray(N.children)) {
                    for (const C of N.children)
                      if (!C._truncated && g(C, E))
                        return !0;
                  }
                  return !1;
                }, c = g(
                  e,
                  h.componentNodeId
                );
                await a.error(
                  `Component ID ${h.componentNodeId.substring(0, 8)}... exists in current node tree: ${c}`
                ), await a.error(
                  `WARNING: Component ID ${h.componentNodeId.substring(0, 8)}... not found in nodeIdMapping. This might indicate:`
                ), await a.error(
                  "  1. The component doesn't exist in the pageData (detached component?)"
                ), await a.error(
                  "  2. The component wasn't collected in the first pass"
                ), await a.error(
                  "  3. The component ID in the instance table doesn't match the actual component ID"
                );
                const y = l.filter(
                  (N) => N.startsWith(h.componentNodeId.substring(0, 8))
                );
                y.length > 0 && await a.error(
                  `Found IDs with matching prefix: ${y.map((N) => N.substring(0, 8) + "...").join(", ")}`
                );
                const f = `Component not found for internal instance "${e.name}" (ID: ${h.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${l.map((N) => N.substring(0, 8) + "...").join(", ")}`;
                throw new Error(f);
              }
              if (v && v.type === "COMPONENT") {
                if (d = v.createInstance(), await a.log(
                  `✓ Created internal instance "${e.name}" from component "${h.componentName}"`
                ), h.variantProperties && Object.keys(h.variantProperties).length > 0)
                  try {
                    let l = null;
                    if (v.parent && v.parent.type === "COMPONENT_SET")
                      l = v.parent.componentPropertyDefinitions, await a.log(
                        `  DEBUG: Component "${h.componentName}" is inside component set "${v.parent.name}" with ${Object.keys(l || {}).length} property definitions`
                      );
                    else {
                      const g = await d.getMainComponentAsync();
                      if (g) {
                        const c = g.type;
                        await a.log(
                          `  DEBUG: Internal instance "${e.name}" - componentNode parent: ${v.parent ? v.parent.type : "N/A"}, mainComponent type: ${c}, mainComponent parent: ${g.parent ? g.parent.type : "N/A"}`
                        ), c === "COMPONENT_SET" ? l = g.componentPropertyDefinitions : c === "COMPONENT" && g.parent && g.parent.type === "COMPONENT_SET" ? (l = g.parent.componentPropertyDefinitions, await a.log(
                          `  DEBUG: Found component set parent "${g.parent.name}" with ${Object.keys(l || {}).length} property definitions`
                        )) : await a.log(
                          `  Skipping variant properties for internal instance "${e.name}" - component "${h.componentName}" is not yet in a COMPONENT_SET (will be moved later during component set creation)`
                        );
                      }
                    }
                    if (l) {
                      const g = {};
                      for (const [c, y] of Object.entries(
                        h.variantProperties
                      )) {
                        const f = c.split("#")[0];
                        l[f] && (g[f] = y);
                      }
                      Object.keys(g).length > 0 && d.setProperties(g);
                    }
                  } catch (l) {
                    const g = `Failed to set variant properties for instance "${e.name}": ${l}`;
                    throw await a.error(g), new Error(g);
                  }
                if (h.componentProperties && Object.keys(h.componentProperties).length > 0)
                  try {
                    const l = await d.getMainComponentAsync();
                    if (l) {
                      let g = null;
                      const c = l.type;
                      if (c === "COMPONENT_SET" ? g = l.componentPropertyDefinitions : c === "COMPONENT" && l.parent && l.parent.type === "COMPONENT_SET" ? g = l.parent.componentPropertyDefinitions : c === "COMPONENT" && (g = l.componentPropertyDefinitions), g)
                        for (const [y, f] of Object.entries(
                          h.componentProperties
                        )) {
                          const N = y.split("#")[0];
                          if (g[N])
                            try {
                              let E = f;
                              f && typeof f == "object" && "value" in f && (E = f.value), d.setProperties({
                                [N]: E
                              });
                            } catch (E) {
                              const C = `Failed to set component property "${N}" for internal instance "${e.name}": ${E}`;
                              throw await a.error(C), new Error(C);
                            }
                        }
                    } else
                      await a.warning(
                        `Cannot set component properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (l) {
                    if (l instanceof Error)
                      throw l;
                    const g = `Failed to set component properties for instance "${e.name}": ${l}`;
                    throw await a.error(g), new Error(g);
                  }
              } else if (!d && v) {
                const l = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${h.componentNodeId.substring(0, 8)}...).`;
                throw await a.error(l), new Error(l);
              }
            }
          else {
            const v = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw await a.error(v), new Error(v);
          }
        else if (h && h.instanceType === "remote")
          if (m) {
            const v = m.get(
              e._instanceRef
            );
            if (v) {
              if (d = v.createInstance(), await a.log(
                `✓ Created remote instance "${e.name}" from component "${h.componentName}" on REMOTES page`
              ), h.variantProperties && Object.keys(h.variantProperties).length > 0)
                try {
                  const l = await d.getMainComponentAsync();
                  if (l) {
                    let g = null;
                    const c = l.type;
                    if (c === "COMPONENT_SET" ? g = l.componentPropertyDefinitions : c === "COMPONENT" && l.parent && l.parent.type === "COMPONENT_SET" ? g = l.parent.componentPropertyDefinitions : await a.log(
                      `Skipping variant properties for remote instance "${e.name}" - main component is not a COMPONENT_SET or variant (expected for remote components)`
                    ), g) {
                      const y = {};
                      for (const [f, N] of Object.entries(
                        h.variantProperties
                      )) {
                        const E = f.split("#")[0];
                        g[E] && (y[E] = N);
                      }
                      Object.keys(y).length > 0 && d.setProperties(y);
                    }
                  } else
                    await a.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (l) {
                  const g = `Failed to set variant properties for remote instance "${e.name}": ${l}`;
                  throw await a.error(g), new Error(g);
                }
              if (h.componentProperties && Object.keys(h.componentProperties).length > 0)
                try {
                  const l = await d.getMainComponentAsync();
                  if (l) {
                    let g = null;
                    const c = l.type;
                    if (c === "COMPONENT_SET" ? g = l.componentPropertyDefinitions : c === "COMPONENT" && l.parent && l.parent.type === "COMPONENT_SET" ? g = l.parent.componentPropertyDefinitions : c === "COMPONENT" && (g = l.componentPropertyDefinitions), g)
                      for (const [y, f] of Object.entries(
                        h.componentProperties
                      )) {
                        const N = y.split("#")[0];
                        if (g[N])
                          try {
                            let E = f;
                            f && typeof f == "object" && "value" in f && (E = f.value), d.setProperties({
                              [N]: E
                            });
                          } catch (E) {
                            const C = `Failed to set component property "${N}" for remote instance "${e.name}": ${E}`;
                            throw await a.error(C), new Error(C);
                          }
                      }
                  } else
                    await a.warning(
                      `Cannot set component properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (l) {
                  if (l instanceof Error)
                    throw l;
                  const g = `Failed to set component properties for remote instance "${e.name}": ${l}`;
                  throw await a.error(g), new Error(g);
                }
              if (e.width !== void 0 && e.height !== void 0)
                try {
                  d.resize(e.width, e.height);
                } catch (l) {
                  await a.log(
                    `Note: Could not resize remote instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
                  );
                }
            } else {
              const l = `Remote component not found for instance "${e.name}" (index ${e._instanceRef}). The remote component should have been created on the REMOTES page.`;
              throw await a.error(l), new Error(l);
            }
          } else {
            const v = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw await a.error(v), new Error(v);
          }
        else if ((h == null ? void 0 : h.instanceType) === "normal") {
          if (!h.componentPageName) {
            const f = `Normal instance "${e.name}" missing componentPageName. Cannot resolve.`;
            throw await a.error(f), new Error(f);
          }
          await figma.loadAllPagesAsync();
          const v = figma.root.children.find(
            (f) => f.name === h.componentPageName
          );
          if (!v) {
            await a.log(
              `  Deferring normal instance "${e.name}" - referenced page "${h.componentPageName}" does not exist yet (may be circular reference or not yet imported)`
            );
            const f = figma.createFrame();
            f.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (f.x = e.x), e.y !== void 0 && (f.y = e.y), e.width !== void 0 && e.height !== void 0 ? f.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && f.resize(e.w, e.h), b && b.push({
              placeholderFrame: f,
              instanceEntry: h,
              nodeData: e,
              parentNode: t,
              instanceIndex: e._instanceRef
            }), d = f;
            break;
          }
          let l = null;
          const g = (f, N, E, C, $) => {
            if (N.length === 0) {
              let T = null;
              for (const x of f.children || [])
                if (x.type === "COMPONENT") {
                  if (x.name === E)
                    if (T || (T = x), C)
                      try {
                        const V = x.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (V && JSON.parse(V).id === C)
                          return x;
                      } catch (V) {
                      }
                    else
                      return x;
                } else if (x.type === "COMPONENT_SET") {
                  if ($ && x.name !== $)
                    continue;
                  for (const V of x.children || [])
                    if (V.type === "COMPONENT" && V.name === E)
                      if (T || (T = V), C)
                        try {
                          const U = V.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (U && JSON.parse(U).id === C)
                            return V;
                        } catch (U) {
                        }
                      else
                        return V;
                }
              return T;
            }
            const [k, ...P] = N;
            for (const T of f.children || [])
              if (T.name === k) {
                if (P.length === 0 && T.type === "COMPONENT_SET") {
                  if ($ && T.name !== $)
                    continue;
                  for (const x of T.children || [])
                    if (x.type === "COMPONENT" && x.name === E) {
                      if (C)
                        try {
                          const V = x.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (V && JSON.parse(V).id === C)
                            return x;
                        } catch (V) {
                        }
                      return x;
                    }
                  return null;
                }
                return g(
                  T,
                  P,
                  E,
                  C,
                  $
                );
              }
            return null;
          };
          await a.log(
            `  Looking for component "${h.componentName}" on page "${h.componentPageName}"${h.path && h.path.length > 0 ? ` at path [${h.path.join(" → ")}]` : " at page root"}${h.componentGuid ? ` (GUID: ${h.componentGuid.substring(0, 8)}...)` : ""}`
          );
          const c = [], y = (f, N = 0) => {
            const E = "  ".repeat(N);
            if (f.type === "COMPONENT")
              c.push(`${E}COMPONENT: "${f.name}"`);
            else if (f.type === "COMPONENT_SET") {
              c.push(
                `${E}COMPONENT_SET: "${f.name}"`
              );
              for (const C of f.children || [])
                C.type === "COMPONENT" && c.push(
                  `${E}  └─ COMPONENT: "${C.name}"`
                );
            }
            for (const C of f.children || [])
              y(C, N + 1);
          };
          if (y(v), c.length > 0 ? await a.log(
            `  Available components on page "${h.componentPageName}":
${c.slice(0, 20).join(`
`)}${c.length > 20 ? `
  ... and ${c.length - 20} more` : ""}`
          ) : await a.warning(
            `  No components found on page "${h.componentPageName}"`
          ), l = g(
            v,
            h.path || [],
            h.componentName,
            h.componentGuid,
            h.componentSetName
          ), l && h.componentGuid)
            try {
              const f = l.getPluginData(
                "RecursicaPublishedMetadata"
              );
              if (f) {
                const N = JSON.parse(f);
                N.id !== h.componentGuid ? await a.warning(
                  `  Found component "${h.componentName}" by name but GUID verification failed (expected ${h.componentGuid.substring(0, 8)}..., got ${N.id ? N.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`
                ) : await a.log(
                  `  Found component "${h.componentName}" with matching GUID ${h.componentGuid.substring(0, 8)}...`
                );
              } else
                await a.warning(
                  `  Found component "${h.componentName}" by name but no metadata found. Using name match as fallback.`
                );
            } catch (f) {
              await a.warning(
                `  Found component "${h.componentName}" by name but GUID verification failed. Using name match as fallback.`
              );
            }
          if (!l) {
            await a.log(
              `  Deferring normal instance "${e.name}" - component "${h.componentName}" not found on page "${h.componentPageName}" (may not be created yet due to circular reference)`
            );
            const f = figma.createFrame();
            f.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (f.x = e.x), e.y !== void 0 && (f.y = e.y), e.width !== void 0 && e.height !== void 0 ? f.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && f.resize(e.w, e.h), b && b.push({
              placeholderFrame: f,
              instanceEntry: h,
              nodeData: e,
              parentNode: t,
              instanceIndex: e._instanceRef
            }), d = f;
            break;
          }
          if (d = l.createInstance(), await a.log(
            `  Created normal instance "${e.name}" from component "${h.componentName}" on page "${h.componentPageName}"`
          ), h.variantProperties && Object.keys(h.variantProperties).length > 0)
            try {
              const f = await d.getMainComponentAsync();
              if (f) {
                let N = null;
                const E = f.type;
                if (E === "COMPONENT_SET" ? N = f.componentPropertyDefinitions : E === "COMPONENT" && f.parent && f.parent.type === "COMPONENT_SET" ? N = f.parent.componentPropertyDefinitions : await a.warning(
                  `Cannot set variant properties for normal instance "${e.name}" - main component is not a COMPONENT_SET or variant`
                ), N) {
                  const C = {};
                  for (const [$, k] of Object.entries(
                    h.variantProperties
                  )) {
                    const P = $.split("#")[0];
                    N[P] && (C[P] = k);
                  }
                  Object.keys(C).length > 0 && d.setProperties(C);
                }
              }
            } catch (f) {
              await a.warning(
                `Failed to set variant properties for normal instance "${e.name}": ${f}`
              );
            }
          if (h.componentProperties && Object.keys(h.componentProperties).length > 0)
            try {
              const f = await d.getMainComponentAsync();
              if (f) {
                let N = null;
                const E = f.type;
                if (E === "COMPONENT_SET" ? N = f.componentPropertyDefinitions : E === "COMPONENT" && f.parent && f.parent.type === "COMPONENT_SET" ? N = f.parent.componentPropertyDefinitions : E === "COMPONENT" && (N = f.componentPropertyDefinitions), N) {
                  const C = {};
                  for (const [$, k] of Object.entries(
                    h.componentProperties
                  )) {
                    const P = $.split("#")[0];
                    let T;
                    if (N[$] ? T = $ : N[P] ? T = P : T = Object.keys(N).find(
                      (x) => x.split("#")[0] === P
                    ), T) {
                      const x = k && typeof k == "object" && "value" in k ? k.value : k;
                      C[T] = x;
                    } else
                      await a.warning(
                        `Component property "${P}" (from "${$}") does not exist on component "${h.componentName}" for normal instance "${e.name}". Available properties: ${Object.keys(N).join(", ") || "none"}`
                      );
                  }
                  if (Object.keys(C).length > 0)
                    try {
                      await a.log(
                        `  Attempting to set component properties for normal instance "${e.name}": ${Object.keys(C).join(", ")}`
                      ), await a.log(
                        `  Available component properties: ${Object.keys(N).join(", ")}`
                      ), d.setProperties(C), await a.log(
                        `  ✓ Successfully set component properties for normal instance "${e.name}": ${Object.keys(C).join(", ")}`
                      );
                    } catch ($) {
                      await a.warning(
                        `Failed to set component properties for normal instance "${e.name}": ${$}`
                      ), await a.warning(
                        `  Properties attempted: ${JSON.stringify(C)}`
                      ), await a.warning(
                        `  Available properties: ${JSON.stringify(Object.keys(N))}`
                      );
                    }
                }
              } else
                await a.warning(
                  `Cannot set component properties for normal instance "${e.name}" - main component not found`
                );
            } catch (f) {
              await a.warning(
                `Failed to set component properties for normal instance "${e.name}": ${f}`
              );
            }
          if (e.width !== void 0 && e.height !== void 0)
            try {
              d.resize(e.width, e.height);
            } catch (f) {
              await a.log(
                `Note: Could not resize normal instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
              );
            }
        } else {
          const v = `Instance "${e.name}" has unknown or missing instance type: ${(h == null ? void 0 : h.instanceType) || "unknown"}`;
          throw await a.error(v), new Error(v);
        }
      } else {
        const h = `Instance "${e.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        throw await a.error(h), new Error(h);
      }
      break;
    case "GROUP":
      d = figma.createFrame();
      break;
    case "BOOLEAN_OPERATION": {
      const h = `Boolean operation nodes cannot be imported. Found boolean operation: "${e.name}".`;
      throw await a.error(h), new Error(h);
    }
    case "POLYGON":
      d = figma.createPolygon();
      break;
    default: {
      const h = `Unsupported node type: ${e.type}. This node type cannot be imported.`;
      throw await a.error(h), new Error(h);
    }
  }
  if (!d)
    return null;
  e.id && r && (r.set(e.id, d), d.type === "COMPONENT" && await a.log(
    `  Stored COMPONENT "${e.name || "Unnamed"}" in nodeIdMapping (ID: ${e.id.substring(0, 8)}...)`
  )), e._instanceRef !== void 0 && d.type === "INSTANCE" ? (r._instanceTableMap || (r._instanceTableMap = /* @__PURE__ */ new Map()), r._instanceTableMap.set(
    d.id,
    e._instanceRef
  ), await a.log(
    `  Stored instance table mapping: instance "${d.name}" (ID: ${d.id.substring(0, 8)}...) -> instance table index ${e._instanceRef}`
  )) : d.type === "INSTANCE" && await a.log(
    `  WARNING: Instance "${d.name}" (ID: ${d.id.substring(0, 8)}...) has no _instanceRef in nodeData - will use fallback matching in third pass`
  ), Dt(d, e.type || "FRAME"), e.name !== void 0 && (d.name = e.name || "Unnamed Node");
  const I = w && w.layoutMode !== void 0 && w.layoutMode !== "NONE", u = t && "layoutMode" in t && t.layoutMode !== "NONE";
  if (I || u || (e.x !== void 0 && (d.x = e.x), e.y !== void 0 && (d.y = e.y)), e.type !== "VECTOR" && e.width !== void 0 && e.height !== void 0 && d.resize(e.width, e.height), e.visible !== void 0 && (d.visible = e.visible), e.locked !== void 0 && (d.locked = e.locked), e.opacity !== void 0 && (d.opacity = e.opacity), e.rotation !== void 0 && (d.rotation = e.rotation), e.blendMode !== void 0 && (d.blendMode = e.blendMode), e.type !== "INSTANCE") {
    if (e.type === "VECTOR" && e.boundVariables && (await a.log(
      `  DEBUG: VECTOR "${e.name || "Unnamed"}" (ID: ${((M = e.id) == null ? void 0 : M.substring(0, 8)) || "unknown"}...) has boundVariables: ${Object.keys(e.boundVariables).join(", ")}`
    ), e.boundVariables.fills && await a.log(
      `  DEBUG:   boundVariables.fills: ${JSON.stringify(e.boundVariables.fills)}`
    )), e.fills !== void 0)
      try {
        let h = e.fills;
        if (Array.isArray(h) && (h = h.map((v) => {
          if (v && typeof v == "object") {
            const l = L({}, v);
            return delete l.boundVariables, l;
          }
          return v;
        })), e.fills && Array.isArray(e.fills) && s) {
          if (e.type === "VECTOR") {
            await a.log(
              `  DEBUG: VECTOR "${e.name || "Unnamed"}" has ${e.fills.length} fill(s)`
            );
            for (let l = 0; l < e.fills.length; l++) {
              const g = e.fills[l];
              if (g && typeof g == "object") {
                const c = g.boundVariables || g.bndVar;
                c ? await a.log(
                  `  DEBUG:   fill[${l}] has boundVariables: ${JSON.stringify(c)}`
                ) : await a.log(
                  `  DEBUG:   fill[${l}] has no boundVariables`
                );
              }
            }
          }
          const v = [];
          for (let l = 0; l < h.length; l++) {
            const g = h[l], c = e.fills[l];
            if (!c || typeof c != "object") {
              v.push(g);
              continue;
            }
            const y = c.boundVariables || c.bndVar;
            if (!y) {
              v.push(g);
              continue;
            }
            const f = L({}, g);
            f.boundVariables = {};
            for (const [N, E] of Object.entries(y))
              if (e.type === "VECTOR" && await a.log(
                `  DEBUG: Processing fill[${l}].${N} on VECTOR "${d.name || "Unnamed"}": varInfo=${JSON.stringify(E)}`
              ), ye(E)) {
                const C = E._varRef;
                if (C !== void 0) {
                  if (e.type === "VECTOR") {
                    await a.log(
                      `  DEBUG: Looking up variable reference ${C} in recognizedVariables (map has ${s.size} entries)`
                    );
                    const k = Array.from(
                      s.keys()
                    ).slice(0, 10);
                    await a.log(
                      `  DEBUG: Available variable references (first 10): ${k.join(", ")}`
                    );
                    const P = s.has(String(C));
                    if (await a.log(
                      `  DEBUG: Variable reference ${C} ${P ? "found" : "NOT FOUND"} in recognizedVariables`
                    ), !P) {
                      const T = Array.from(
                        s.keys()
                      ).sort((x, V) => parseInt(x) - parseInt(V));
                      await a.log(
                        `  DEBUG: All available variable references: ${T.join(", ")}`
                      );
                    }
                  }
                  let $ = s.get(String(C));
                  $ || (e.type === "VECTOR" && await a.log(
                    `  DEBUG: Variable ${C} not in recognizedVariables. variableTable=${!!n}, collectionTable=${!!i}, recognizedCollections=${!!A}`
                  ), n && i && A ? (await a.log(
                    `  Variable reference ${C} not in recognizedVariables, attempting to resolve from variable table...`
                  ), $ = await Wt(
                    C,
                    n,
                    i,
                    A
                  ) || void 0, $ ? (s.set(String(C), $), await a.log(
                    `  ✓ Resolved variable ${$.name} from variable table and added to recognizedVariables`
                  )) : await a.warning(
                    `  Failed to resolve variable ${C} from variable table`
                  )) : e.type === "VECTOR" && await a.warning(
                    `  Cannot resolve variable ${C} from table - missing required parameters`
                  )), $ ? (f.boundVariables[N] = {
                    type: "VARIABLE_ALIAS",
                    id: $.id
                  }, await a.log(
                    `  ✓ Restored bound variable for fill[${l}].${N} on "${d.name || "Unnamed"}" (${e.type}): variable ${$.name} (ID: ${$.id.substring(0, 8)}...)`
                  )) : await a.warning(
                    `  Variable reference ${C} not found in recognizedVariables for fill[${l}].${N} on "${d.name || "Unnamed"}"`
                  );
                } else
                  e.type === "VECTOR" && await a.warning(
                    `  DEBUG: Variable reference ${C} is undefined for fill[${l}].${N} on VECTOR "${d.name || "Unnamed"}"`
                  );
              } else
                e.type === "VECTOR" && await a.warning(
                  `  DEBUG: fill[${l}].${N} on VECTOR "${d.name || "Unnamed"}" is not a variable reference: ${JSON.stringify(E)}`
                );
            v.push(f);
          }
          d.fills = v, await a.log(
            `  ✓ Set fills with boundVariables on "${d.name || "Unnamed"}" (${e.type})`
          );
        } else
          d.fills = h;
        e.boundVariables && Object.keys(e.boundVariables).length > 0 && !e.boundVariables.fills && await a.log(
          `  Node "${d.name || "Unnamed"}" (${e.type}) has boundVariables but not for fills: ${Object.keys(e.boundVariables).join(", ")}`
        );
      } catch (h) {
        console.log("Error setting fills:", h);
      }
    else if (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "GROUP")
      try {
        d.fills = [];
      } catch (h) {
        console.log("Error clearing fills:", h);
      }
  }
  if (e.strokes !== void 0)
    try {
      e.strokes.length > 0 ? d.strokes = e.strokes : d.strokes = [];
    } catch (h) {
      console.log("Error setting strokes:", h);
    }
  else if (e.type === "VECTOR")
    try {
      d.strokes = [];
    } catch (h) {
    }
  if (e.strokeWeight !== void 0 ? d.strokeWeight = e.strokeWeight : e.type === "VECTOR" && (e.strokes === void 0 || e.strokes.length === 0) && (d.strokeWeight = 0), e.strokeAlign !== void 0 && (d.strokeAlign = e.strokeAlign), e.cornerRadius !== void 0 && (d.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (d.effects = e.effects), (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && (e.layoutMode !== void 0 && (d.layoutMode = e.layoutMode), e.layoutWrap !== void 0 && (d.layoutWrap = e.layoutWrap), e.primaryAxisSizingMode !== void 0 && (d.primaryAxisSizingMode = e.primaryAxisSizingMode), e.counterAxisSizingMode !== void 0 && (d.counterAxisSizingMode = e.counterAxisSizingMode), e.primaryAxisAlignItems !== void 0 && (d.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (d.counterAxisAlignItems = e.counterAxisAlignItems), e.paddingLeft !== void 0 && (d.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (d.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (d.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (d.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (d.itemSpacing = e.itemSpacing), e.layoutGrow !== void 0 && (d.layoutGrow = e.layoutGrow)), (e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (d.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (d.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (d.dashPattern = e.dashPattern), e.type === "VECTOR")) {
    if (e.fillGeometry !== void 0)
      try {
        const { normalizeSvgPath: h } = await Promise.resolve().then(() => xt), v = e.fillGeometry.map((l) => {
          const g = l.data;
          return {
            data: h(g),
            windingRule: l.windingRule || l.windRule || "NONZERO"
          };
        });
        for (let l = 0; l < e.fillGeometry.length; l++) {
          const g = e.fillGeometry[l].data, c = v[l].data;
          g !== c && await a.log(
            `  Normalized path ${l + 1} for "${e.name || "Unnamed"}": ${g.substring(0, 50)}... -> ${c.substring(0, 50)}...`
          );
        }
        d.vectorPaths = v, await a.log(
          `  Set vectorPaths for VECTOR "${e.name || "Unnamed"}" (${v.length} path(s))`
        );
      } catch (h) {
        await a.warning(
          `Error setting vectorPaths for VECTOR "${e.name || "Unnamed"}": ${h}`
        );
      }
    if (e.strokeGeometry !== void 0)
      try {
        d.strokeGeometry = e.strokeGeometry;
      } catch (h) {
        await a.warning(
          `Error setting strokeGeometry for VECTOR "${e.name || "Unnamed"}": ${h}`
        );
      }
    if (e.width !== void 0 && e.height !== void 0)
      try {
        d.resize(e.width, e.height), await a.log(
          `  Set size for VECTOR "${e.name || "Unnamed"}" to ${e.width}x${e.height}`
        );
      } catch (h) {
        await a.warning(
          `Error setting size for VECTOR "${e.name || "Unnamed"}": ${h}`
        );
      }
  }
  if (e.type === "TEXT" && e.characters !== void 0)
    try {
      if (e.fontName)
        try {
          await figma.loadFontAsync(e.fontName), d.fontName = e.fontName;
        } catch (h) {
          await figma.loadFontAsync({
            family: "Roboto",
            style: "Regular"
          }), d.fontName = { family: "Roboto", style: "Regular" };
        }
      else
        await figma.loadFontAsync({
          family: "Roboto",
          style: "Regular"
        }), d.fontName = { family: "Roboto", style: "Regular" };
      d.characters = e.characters, e.fontSize !== void 0 && (d.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (d.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (d.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (d.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (d.lineHeight = e.lineHeight), e.textCase !== void 0 && (d.textCase = e.textCase), e.textDecoration !== void 0 && (d.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (d.textAutoResize = e.textAutoResize);
    } catch (h) {
      console.log("Error setting text properties: " + h);
      try {
        d.characters = e.characters;
      } catch (v) {
        console.log("Could not set text characters: " + v);
      }
    }
  if (e.boundVariables) {
    for (const [h, v] of Object.entries(
      e.boundVariables
    ))
      if (h !== "fills" && ye(v) && n && s) {
        const l = v._varRef;
        if (l !== void 0) {
          const g = s.get(String(l));
          if (g) {
            const c = {
              type: "VARIABLE_ALIAS",
              id: g.id
            };
            d.boundVariables || (d.boundVariables = {}), d.boundVariables[h] || (d.boundVariables[h] = c);
          }
        }
      }
  }
  const S = e.id && r && r.has(e.id) && d.type === "COMPONENT" && d.children && d.children.length > 0;
  if (e.children && Array.isArray(e.children) && d.type !== "INSTANCE" && !S) {
    const h = (l) => {
      const g = [];
      for (const c of l)
        c._truncated || (c.type === "COMPONENT" ? (g.push(c), c.children && Array.isArray(c.children) && g.push(...h(c.children))) : c.children && Array.isArray(c.children) && g.push(...h(c.children)));
      return g;
    };
    for (const l of e.children) {
      if (l._truncated) {
        console.log(
          `Skipping truncated children: ${l._reason || "Unknown"}`
        );
        continue;
      }
      l.type;
    }
    const v = h(e.children);
    await a.log(
      `  First pass: Creating ${v.length} COMPONENT node(s) (without children)...`
    );
    for (const l of v)
      await a.log(
        `  Collected COMPONENT "${l.name || "Unnamed"}" (ID: ${l.id ? l.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const l of v)
      if (l.id && r && !r.has(l.id)) {
        const g = figma.createComponent();
        if (l.name !== void 0 && (g.name = l.name || "Unnamed Node"), l.componentPropertyDefinitions) {
          const c = l.componentPropertyDefinitions;
          let y = 0, f = 0;
          for (const [N, E] of Object.entries(c))
            try {
              const $ = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[E.type];
              if (!$) {
                await a.warning(
                  `  Unknown property type ${E.type} for property "${N}" in component "${l.name || "Unnamed"}"`
                ), f++;
                continue;
              }
              const k = E.defaultValue, P = N.split("#")[0];
              g.addComponentProperty(
                P,
                $,
                k
              ), y++;
            } catch (C) {
              await a.warning(
                `  Failed to add component property "${N}" to "${l.name || "Unnamed"}" in first pass: ${C}`
              ), f++;
            }
          y > 0 && await a.log(
            `  Added ${y} component property definition(s) to "${l.name || "Unnamed"}" in first pass${f > 0 ? ` (${f} failed)` : ""}`
          );
        }
        r.set(l.id, g), await a.log(
          `  Created COMPONENT "${l.name || "Unnamed"}" (ID: ${l.id.substring(0, 8)}...) in first pass`
        );
      }
    for (const l of e.children) {
      if (l._truncated)
        continue;
      const g = await oe(
        l,
        d,
        n,
        i,
        o,
        s,
        r,
        p,
        m,
        null,
        // deferredInstances - not needed for remote structures
        e,
        // parentNodeData - pass the parent's nodeData so children can check for auto-layout
        A
      );
      if (g && g.parent !== d) {
        if (g.parent && typeof g.parent.removeChild == "function")
          try {
            g.parent.removeChild(g);
          } catch (c) {
            await a.warning(
              `Failed to remove child "${g.name || "Unnamed"}" from parent "${g.parent.name || "Unnamed"}": ${c}`
            );
          }
        d.appendChild(g);
      }
    }
  }
  if (t && d.parent !== t) {
    if (d.parent && typeof d.parent.removeChild == "function")
      try {
        d.parent.removeChild(d);
      } catch (h) {
        await a.warning(
          `Failed to remove node "${d.name || "Unnamed"}" from parent "${d.parent.name || "Unnamed"}": ${h}`
        );
      }
    t.appendChild(d);
  }
  return d;
}
async function Yt(e, t, n) {
  let i = 0, o = 0, s = 0;
  const r = (m) => {
    const b = [];
    if (m.type === "INSTANCE" && b.push(m), "children" in m && m.children)
      for (const w of m.children)
        b.push(...r(w));
    return b;
  }, p = r(e);
  await a.log(
    `  Found ${p.length} instance(s) to process for variant properties`
  );
  for (const m of p)
    try {
      const b = await m.getMainComponentAsync();
      if (!b) {
        o++;
        continue;
      }
      const w = t.getSerializedTable();
      let A = null, d;
      if (n._instanceTableMap ? (d = n._instanceTableMap.get(
        m.id
      ), d !== void 0 ? (A = w[d], await a.log(
        `  Found instance table index ${d} for instance "${m.name}" (ID: ${m.id.substring(0, 8)}...)`
      )) : await a.log(
        `  No instance table index mapping found for instance "${m.name}" (ID: ${m.id.substring(0, 8)}...), using fallback matching`
      )) : await a.log(
        `  No instance table map found, using fallback matching for instance "${m.name}"`
      ), !A) {
        for (const [u, O] of Object.entries(w))
          if (O.instanceType === "internal" && O.componentNodeId && n.has(O.componentNodeId)) {
            const S = n.get(O.componentNodeId);
            if (S && S.id === b.id) {
              A = O, await a.log(
                `  Matched instance "${m.name}" to instance table entry ${u} by component (less precise)`
              );
              break;
            }
          }
      }
      if (!A) {
        await a.log(
          `  No matching entry found for instance "${m.name}" (main component: ${b.name}, ID: ${b.id.substring(0, 8)}...)`
        ), o++;
        continue;
      }
      if (!A.variantProperties) {
        await a.log(
          `  Instance table entry for "${m.name}" has no variant properties`
        ), o++;
        continue;
      }
      await a.log(
        `  Instance "${m.name}" matched to entry with variant properties: ${JSON.stringify(A.variantProperties)}`
      );
      let I = null;
      if (b.parent && b.parent.type === "COMPONENT_SET" && (I = b.parent.componentPropertyDefinitions), I) {
        const u = {};
        for (const [O, S] of Object.entries(
          A.variantProperties
        )) {
          const M = O.split("#")[0];
          I[M] && (u[M] = S);
        }
        Object.keys(u).length > 0 ? (m.setProperties(u), i++, await a.log(
          `  ✓ Set variant properties on instance "${m.name}": ${JSON.stringify(u)}`
        )) : o++;
      } else
        o++;
    } catch (b) {
      s++, await a.warning(
        `  Failed to set variant properties on instance "${m.name}": ${b}`
      );
    }
  await a.log(
    `  Variant properties set: ${i} processed, ${o} skipped, ${s} errors`
  );
}
async function je(e) {
  await figma.loadAllPagesAsync();
  const t = figma.root.children, n = new Set(t.map((s) => s.name));
  if (!n.has(e))
    return e;
  let i = 1, o = `${e}_${i}`;
  for (; n.has(o); )
    i++, o = `${e}_${i}`;
  return o;
}
async function Xt(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), n = new Set(t.map((s) => s.name));
  if (!n.has(e))
    return e;
  let i = 1, o = `${e}_${i}`;
  for (; n.has(o); )
    i++, o = `${e}_${i}`;
  return o;
}
async function Zt(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const s of e.variableIds)
    try {
      const r = await figma.variables.getVariableByIdAsync(s);
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
function Qe(e, t) {
  const n = e.resolvedType.toUpperCase(), i = t.toUpperCase();
  return n === i;
}
async function Qt(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), n = te(e.collectionName);
  if (ne(e.collectionName)) {
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
        X
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
  const n = Ft(e, t);
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
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), o = e.getTable();
  for (const [s, r] of Object.entries(o)) {
    if (r.isLocal === !1) {
      await a.log(
        `Skipping remote collection: "${r.collectionName}" (index ${s})`
      );
      continue;
    }
    const p = await Qt(r);
    p.matchType === "recognized" ? (await a.log(
      `✓ Recognized collection by GUID: "${r.collectionName}" (index ${s})`
    ), t.set(s, p.collection)) : p.matchType === "potential" ? (await a.log(
      `? Potential match by name: "${r.collectionName}" (index ${s})`
    ), n.set(s, {
      entry: r,
      collection: p.collection
    })) : (await a.log(
      `✗ No match found for collection: "${r.collectionName}" (index ${s}) - will create new`
    ), i.set(s, r));
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
    for (const [i, { entry: o, collection: s }] of e.entries())
      try {
        const r = ne(o.collectionName) ? te(o.collectionName) : s.name, p = `Found existing "${r}" variable collection. Should I use it?`;
        await a.log(
          `Prompting user about potential match: "${r}"`
        ), await re.prompt(p, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await a.log(
          `✓ User confirmed: Using existing collection "${r}" (index ${i})`
        ), t.set(i, s), await de(s, o.modes), await a.log(
          `  ✓ Ensured modes for collection "${r}" (${o.modes.length} mode(s))`
        );
      } catch (r) {
        await a.log(
          `✗ User rejected: Will create new collection for "${o.collectionName}" (index ${i})`
        ), n.set(i, o);
      }
  }
}
async function rn(e, t, n) {
  if (e.size === 0)
    return;
  await a.log("Ensuring modes exist for recognized collections...");
  const i = t.getTable();
  for (const [o, s] of e.entries()) {
    const r = i[o];
    r && (n.has(o) || (await de(s, r.modes), await a.log(
      `  ✓ Ensured modes for collection "${s.name}" (${r.modes.length} mode(s))`
    )));
  }
}
async function on(e, t, n) {
  if (e.size !== 0) {
    await a.log(
      `Creating ${e.size} new collection(s)...`
    );
    for (const [i, o] of e.entries()) {
      const s = te(o.collectionName), r = await Xt(s);
      r !== s ? await a.log(
        `Creating collection: "${r}" (normalized: "${s}" - name conflict resolved)`
      ) : await a.log(`Creating collection: "${r}"`);
      const p = figma.variables.createVariableCollection(r);
      n.push(p);
      let m;
      if (ne(o.collectionName)) {
        const b = ke(o.collectionName);
        b && (m = b);
      } else o.collectionGuid && (m = o.collectionGuid);
      m && (p.setSharedPluginData(
        "recursica",
        X,
        m
      ), await a.log(
        `  Stored GUID: ${m.substring(0, 8)}...`
      )), await de(p, o.modes), await a.log(
        `  ✓ Created collection "${r}" with ${o.modes.length} mode(s)`
      ), t.set(i, p);
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
  const o = /* @__PURE__ */ new Map(), s = [], r = new Set(
    i.map((b) => b.id)
  );
  await a.log("Matching and creating variables in collections...");
  const p = e.getTable(), m = /* @__PURE__ */ new Map();
  for (const [b, w] of Object.entries(p)) {
    if (w._colRef === void 0)
      continue;
    const A = n.get(String(w._colRef));
    if (!A)
      continue;
    m.has(A.id) || m.set(A.id, {
      collectionName: A.name,
      existing: 0,
      created: 0
    });
    const d = m.get(A.id), I = r.has(
      A.id
    );
    let u;
    typeof w.variableType == "number" ? u = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[w.variableType] || String(w.variableType) : u = w.variableType;
    const O = await Le(
      A,
      w.variableName
    );
    if (O)
      if (Qe(O, u))
        o.set(b, O), d.existing++;
      else {
        await a.warning(
          `Type mismatch for variable "${w.variableName}" in collection "${A.name}": expected ${u}, found ${O.resolvedType}. Creating new variable with incremented name.`
        );
        const S = await Zt(
          A,
          w.variableName
        ), M = await xe(
          q(L({}, w), {
            variableName: S,
            variableType: u
          }),
          A,
          e,
          t
        );
        I || s.push(M), o.set(b, M), d.created++;
      }
    else {
      const S = await xe(
        q(L({}, w), {
          variableType: u
        }),
        A,
        e,
        t
      );
      I || s.push(S), o.set(b, S), d.created++;
    }
  }
  await a.log("Variable processing complete:");
  for (const b of m.values())
    await a.log(
      `  "${b.collectionName}": ${b.existing} existing, ${b.created} created`
    );
  return {
    recognizedVariables: o,
    newlyCreatedVariables: s
  };
}
function ln(e) {
  if (!e.instances)
    return null;
  try {
    return pe.fromTable(e.instances);
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
function Ge(e) {
  if (!e || typeof e != "object")
    return;
  e.type !== void 0 && (e.type = dn(e.type));
  const t = e.children !== void 0 ? "children" : e.child !== void 0 ? "child" : null;
  if (t && (t === "child" && !e.children && (e.children = e.child, delete e.child), Array.isArray(e.children)))
    for (const n of e.children)
      Ge(n);
  e.fillG !== void 0 && e.fillGeometry === void 0 && (e.fillGeometry = e.fillG, delete e.fillG), e.strkG !== void 0 && e.strokeGeometry === void 0 && (e.strokeGeometry = e.strkG, delete e.strkG), e.child && !e.children && (e.children = e.child, delete e.child);
}
async function pn(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const s of e.children)
    (s.type === "FRAME" || s.type === "COMPONENT") && n.add(s.name);
  if (!n.has(t))
    return t;
  let i = 1, o = `${t}_${i}`;
  for (; n.has(o); )
    i++, o = `${t}_${i}`;
  return o;
}
async function fn(e, t, n, i, o) {
  var d;
  const s = e.getSerializedTable(), r = Object.values(s).filter(
    (I) => I.instanceType === "remote"
  ), p = /* @__PURE__ */ new Map();
  if (r.length === 0)
    return await a.log("No remote instances found"), p;
  await a.log(
    `Processing ${r.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  let b = figma.root.children.find((I) => I.name === "REMOTES");
  if (b ? await a.log("Found existing REMOTES page") : (b = figma.createPage(), b.name = "REMOTES", await a.log("Created REMOTES page")), !b.children.some(
    (I) => I.type === "FRAME" && I.name === "Title"
  )) {
    const I = { family: "Inter", style: "Bold" }, u = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(I), await figma.loadFontAsync(u);
    const O = figma.createFrame();
    O.name = "Title", O.layoutMode = "VERTICAL", O.paddingTop = 20, O.paddingBottom = 20, O.paddingLeft = 20, O.paddingRight = 20, O.fills = [];
    const S = figma.createText();
    S.fontName = I, S.characters = "REMOTE INSTANCES", S.fontSize = 24, S.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], O.appendChild(S);
    const M = figma.createText();
    M.fontName = u, M.characters = "These are remotely connected component instances found in our different component pages.", M.fontSize = 14, M.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], O.appendChild(M), b.appendChild(O), await a.log("Created title and description on REMOTES page");
  }
  const A = /* @__PURE__ */ new Map();
  for (const [I, u] of Object.entries(s)) {
    if (u.instanceType !== "remote")
      continue;
    const O = parseInt(I, 10);
    if (await a.log(
      `Processing remote instance ${O}: "${u.componentName}"`
    ), !u.structure) {
      await a.warning(
        `Remote instance "${u.componentName}" missing structure data, skipping`
      );
      continue;
    }
    Ge(u.structure);
    const S = u.structure.children !== void 0, M = u.structure.child !== void 0, h = u.structure.children ? u.structure.children.length : u.structure.child ? u.structure.child.length : 0;
    await a.log(
      `  Structure type: ${u.structure.type || "unknown"}, has children: ${h} (children key: ${S}, child key: ${M})`
    );
    let v = u.componentName;
    if (u.path && u.path.length > 0) {
      const g = u.path.filter((c) => c !== "").join(" / ");
      g && (v = `${g} / ${u.componentName}`);
    }
    const l = await pn(
      b,
      v
    );
    l !== v && await a.log(
      `Component name conflict: "${v}" -> "${l}"`
    );
    try {
      if (u.structure.type !== "COMPONENT") {
        await a.warning(
          `Remote instance "${u.componentName}" structure is not a COMPONENT (type: ${u.structure.type}), creating frame fallback`
        );
        const c = figma.createFrame();
        c.name = l;
        const y = await oe(
          u.structure,
          c,
          t,
          n,
          null,
          i,
          A,
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
        y ? (c.appendChild(y), b.appendChild(c), await a.log(
          `✓ Created remote instance frame fallback: "${l}"`
        )) : c.remove();
        continue;
      }
      const g = figma.createComponent();
      g.name = l, b.appendChild(g), await a.log(
        `  Created component node: "${l}"`
      );
      try {
        if (u.structure.componentPropertyDefinitions) {
          const y = u.structure.componentPropertyDefinitions;
          let f = 0, N = 0;
          for (const [E, C] of Object.entries(y))
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
              }[C.type];
              if (!k) {
                await a.warning(
                  `  Unknown property type ${C.type} for property "${E}" in component "${u.componentName}"`
                ), N++;
                continue;
              }
              const P = C.defaultValue, T = E.split("#")[0];
              g.addComponentProperty(
                T,
                k,
                P
              ), f++;
            } catch ($) {
              await a.warning(
                `  Failed to add component property "${E}" to "${u.componentName}": ${$}`
              ), N++;
            }
          f > 0 && await a.log(
            `  Added ${f} component property definition(s) to "${u.componentName}"${N > 0 ? ` (${N} failed)` : ""}`
          );
        }
        if (u.structure.name !== void 0 && (g.name = u.structure.name), u.structure.width !== void 0 && u.structure.height !== void 0 && g.resize(u.structure.width, u.structure.height), u.structure.x !== void 0 && (g.x = u.structure.x), u.structure.y !== void 0 && (g.y = u.structure.y), u.structure.visible !== void 0 && (g.visible = u.structure.visible), u.structure.opacity !== void 0 && (g.opacity = u.structure.opacity), u.structure.rotation !== void 0 && (g.rotation = u.structure.rotation), u.structure.blendMode !== void 0 && (g.blendMode = u.structure.blendMode), u.structure.fills !== void 0)
          try {
            let y = u.structure.fills;
            Array.isArray(y) && (y = y.map((f) => {
              if (f && typeof f == "object") {
                const N = L({}, f);
                return delete N.boundVariables, N;
              }
              return f;
            })), g.fills = y, (d = u.structure.boundVariables) != null && d.fills && i && await qt(
              g,
              u.structure.boundVariables,
              "fills",
              i
            );
          } catch (y) {
            await a.warning(
              `Error setting fills for remote component "${u.componentName}": ${y}`
            );
          }
        if (u.structure.strokes !== void 0)
          try {
            g.strokes = u.structure.strokes;
          } catch (y) {
            await a.warning(
              `Error setting strokes for remote component "${u.componentName}": ${y}`
            );
          }
        u.structure.layoutMode !== void 0 && (g.layoutMode = u.structure.layoutMode), u.structure.primaryAxisSizingMode !== void 0 && (g.primaryAxisSizingMode = u.structure.primaryAxisSizingMode), u.structure.counterAxisSizingMode !== void 0 && (g.counterAxisSizingMode = u.structure.counterAxisSizingMode), u.structure.paddingLeft !== void 0 && (g.paddingLeft = u.structure.paddingLeft), u.structure.paddingRight !== void 0 && (g.paddingRight = u.structure.paddingRight), u.structure.paddingTop !== void 0 && (g.paddingTop = u.structure.paddingTop), u.structure.paddingBottom !== void 0 && (g.paddingBottom = u.structure.paddingBottom), u.structure.itemSpacing !== void 0 && (g.itemSpacing = u.structure.itemSpacing), u.structure.cornerRadius !== void 0 && (g.cornerRadius = u.structure.cornerRadius), await a.log(
          `  DEBUG: Structure keys: ${Object.keys(u.structure).join(", ")}, has children: ${!!u.structure.children}, has child: ${!!u.structure.child}`
        );
        const c = u.structure.children || (u.structure.child ? u.structure.child : null);
        if (await a.log(
          `  DEBUG: childrenArray exists: ${!!c}, isArray: ${Array.isArray(c)}, length: ${c ? c.length : 0}`
        ), c && Array.isArray(c) && c.length > 0) {
          await a.log(
            `  Recreating ${c.length} child(ren) for component "${u.componentName}"`
          );
          for (let y = 0; y < c.length; y++) {
            const f = c[y];
            if (await a.log(
              `  DEBUG: Processing child ${y + 1}/${c.length}: ${JSON.stringify({ name: f == null ? void 0 : f.name, type: f == null ? void 0 : f.type, hasTruncated: !!(f != null && f._truncated) })}`
            ), f._truncated) {
              await a.log(
                `  Skipping truncated child: ${f._reason || "Unknown"}`
              );
              continue;
            }
            await a.log(
              `  Recreating child: "${f.name || "Unnamed"}" (type: ${f.type})`
            );
            const N = await oe(
              f,
              g,
              t,
              n,
              null,
              i,
              A,
              !0,
              // isRemoteStructure: true
              null,
              // remoteComponentMap - not needed here
              null,
              // deferredInstances - not needed for remote instances
              u.structure,
              // parentNodeData - pass the component's structure so children can check for auto-layout
              o
            );
            N ? (g.appendChild(N), await a.log(
              `  ✓ Appended child "${f.name || "Unnamed"}" to component "${u.componentName}"`
            )) : await a.warning(
              `  ✗ Failed to create child "${f.name || "Unnamed"}" (type: ${f.type})`
            );
          }
        }
        p.set(O, g), await a.log(
          `✓ Created remote component: "${l}" (index ${O})`
        );
      } catch (c) {
        await a.warning(
          `Error populating remote component "${u.componentName}": ${c instanceof Error ? c.message : "Unknown error"}`
        ), g.remove();
      }
    } catch (g) {
      await a.warning(
        `Error recreating remote instance "${u.componentName}": ${g instanceof Error ? g.message : "Unknown error"}`
      );
    }
  }
  return await a.log(
    `Remote instance processing complete: ${p.size} component(s) created`
  ), p;
}
async function mn(e, t, n, i, o, s, r = null, p = null, m = !1, b = null) {
  await a.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const w = figma.root.children, A = "RecursicaPublishedMetadata";
  let d = null;
  for (const c of w) {
    const y = c.getPluginData(A);
    if (y)
      try {
        if (JSON.parse(y).id === e.guid) {
          d = c;
          break;
        }
      } catch (f) {
        continue;
      }
  }
  let I = !1;
  if (d && !m) {
    let c;
    try {
      const N = d.getPluginData(A);
      N && (c = JSON.parse(N).version);
    } catch (N) {
    }
    const y = c !== void 0 ? ` v${c}` : "", f = `Found existing component "${d.name}${y}". Should I use it or create a copy?`;
    await a.log(
      `Found existing page with same GUID: "${d.name}". Prompting user...`
    );
    try {
      await re.prompt(f, {
        okLabel: "Use",
        cancelLabel: "Copy",
        timeoutMs: 3e5
        // 5 minutes
      }), I = !0, await a.log(
        `User chose to use existing page: "${d.name}"`
      );
    } catch (N) {
      await a.log(
        "User chose to create a copy. Will create new page."
      );
    }
  }
  if (I && d)
    return await figma.setCurrentPageAsync(d), await a.log(
      `Using existing page: "${d.name}" (GUID: ${e.guid.substring(0, 8)}...)`
    ), await a.log(
      `  Instances from other pages will resolve to components on this existing page using componentPageName: "${d.name}"`
    ), {
      success: !0,
      page: d,
      // Include pageId so it can be tracked in importedPages
      pageId: d.id
    };
  const u = w.find((c) => c.name === e.name);
  u && await a.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let O;
  if (d || u) {
    const c = `__${e.name}`;
    O = await je(c), await a.log(
      `Creating scratch page: "${O}" (will be renamed to "${e.name}" on success)`
    );
  } else
    O = e.name, await a.log(`Creating page: "${O}"`);
  const S = figma.createPage();
  if (S.name = O, await figma.setCurrentPageAsync(S), await a.log(`Switched to page: "${O}"`), !t.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await a.log("Recreating page structure...");
  const M = t.pageData;
  if (M.backgrounds !== void 0)
    try {
      S.backgrounds = M.backgrounds, await a.log(
        `Set page background: ${JSON.stringify(M.backgrounds)}`
      );
    } catch (c) {
      await a.warning(`Failed to set page background: ${c}`);
    }
  Ge(M);
  const h = /* @__PURE__ */ new Map(), v = (c, y = []) => {
    if (c.type === "COMPONENT" && c.id && y.push(c.id), c.children && Array.isArray(c.children))
      for (const f of c.children)
        f._truncated || v(f, y);
    return y;
  }, l = v(M);
  if (await a.log(
    `Found ${l.length} COMPONENT node(s) in page data`
  ), l.length > 0 && (await a.log(
    `Component IDs in page data (first 20): ${l.slice(0, 20).map((c) => c.substring(0, 8) + "...").join(", ")}`
  ), M._allComponentIds = l), M.children && Array.isArray(M.children))
    for (const c of M.children) {
      const y = await oe(
        c,
        S,
        n,
        i,
        o,
        s,
        h,
        !1,
        // isRemoteStructure: false - we're creating the main page
        r,
        p,
        M,
        // parentNodeData - pass the page's nodeData so children can check for auto-layout
        b
      );
      y && S.appendChild(y);
    }
  await a.log("Page structure recreated successfully"), o && (await a.log(
    "Third pass: Setting variant properties on instances..."
  ), await Yt(
    S,
    o,
    h
  ));
  const g = {
    _ver: 1,
    id: e.guid,
    name: e.name,
    version: e.version || 0,
    publishDate: (/* @__PURE__ */ new Date()).toISOString(),
    history: {}
  };
  if (S.setPluginData(A, JSON.stringify(g)), await a.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), O.startsWith("__")) {
    const c = await je(e.name);
    S.name = c, await a.log(`Renamed page from "${O}" to "${c}"`);
  }
  return {
    success: !0,
    page: S
  };
}
async function tt(e) {
  var i;
  e.clearConsole !== !1 && await a.clear(), await a.log("=== Starting Page Import ===");
  const n = [];
  try {
    const o = e.jsonData;
    if (!o)
      return await a.error("JSON data is required"), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "JSON data is required",
        data: {}
      };
    await a.log("Validating metadata...");
    const s = en(o);
    if (!s.success)
      return await a.error(s.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: s.error,
        data: {}
      };
    const r = s.metadata;
    await a.log(
      `Metadata validated: guid=${r.guid}, name=${r.name}`
    ), await a.log("Loading string table...");
    const p = et(o);
    if (!p.success)
      return await a.error(p.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: p.error,
        data: {}
      };
    await a.log("String table loaded successfully"), await a.log("Expanding JSON data...");
    const m = p.expandedJsonData;
    await a.log("JSON expanded successfully"), await a.log("Loading collections table...");
    const b = tn(m);
    if (!b.success)
      return b.error === "No collections table found in JSON" ? (await a.log(b.error), await a.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: r.name }
      }) : (await a.error(b.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: b.error,
        data: {}
      });
    const w = b.collectionTable;
    await a.log(
      `Loaded collections table with ${w.getSize()} collection(s)`
    ), await a.log(
      "Matching collections with existing local collections..."
    );
    const { recognizedCollections: A, potentialMatches: d, collectionsToCreate: I } = await nn(w);
    await an(
      d,
      A,
      I
    ), await rn(
      A,
      w,
      d
    ), await on(
      I,
      A,
      n
    ), await a.log("Loading variables table...");
    const u = sn(m);
    if (!u.success)
      return u.error === "No variables table found in JSON" ? (await a.log(u.error), await a.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no variables to process)",
        data: { pageName: r.name }
      }) : (await a.error(u.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: u.error,
        data: {}
      });
    const O = u.variableTable;
    await a.log(
      `Loaded variables table with ${O.getSize()} variable(s)`
    );
    const { recognizedVariables: S, newlyCreatedVariables: M } = await cn(
      O,
      w,
      A,
      n
    );
    await a.log("Loading instance table...");
    const h = ln(m);
    if (h) {
      const C = h.getSerializedTable(), $ = Object.values(C).filter(
        (P) => P.instanceType === "internal"
      ), k = Object.values(C).filter(
        (P) => P.instanceType === "remote"
      );
      await a.log(
        `Loaded instance table with ${h.getSize()} instance(s) (${$.length} internal, ${k.length} remote)`
      );
    } else
      await a.log("No instance table found in JSON");
    let v = null;
    h && (v = await fn(
      h,
      O,
      w,
      S,
      A
    ));
    const l = [], g = (i = e.isMainPage) != null ? i : !0, c = await mn(
      r,
      m,
      O,
      w,
      h,
      S,
      v,
      l,
      g,
      A
    );
    if (!c.success)
      return await a.error(c.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: c.error,
        data: {}
      };
    const y = c.page, f = S.size + M.length, N = l.length;
    await a.log("=== Import Complete ==="), await a.log(
      `Successfully processed ${A.size} collection(s), ${f} variable(s), and created page "${y.name}"${N > 0 ? ` (${N} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`
    );
    const E = c.pageId || y.id;
    return {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: {
        pageName: y.name,
        pageId: E,
        // Include pageId for tracking (used for both new and reused pages)
        deferredInstances: N > 0 ? l : void 0,
        createdEntities: {
          pageIds: [y.id],
          collectionIds: n.map((C) => C.id),
          variableIds: M.map((C) => C.id)
        }
      }
    };
  } catch (o) {
    const s = o instanceof Error ? o.message : "Unknown error occurred";
    return await a.error(`Import failed: ${s}`), o instanceof Error && o.stack && await a.error(`Stack trace: ${o.stack}`), console.error("Error importing page:", o), {
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
  for (const o of e)
    try {
      const { placeholderFrame: s, instanceEntry: r, nodeData: p, parentNode: m } = o, b = figma.root.children.find(
        (u) => u.name === r.componentPageName
      );
      if (!b) {
        const u = `Deferred instance "${p.name}" still cannot find referenced page "${r.componentPageName}"`;
        await a.error(u), i.push(u), n++;
        continue;
      }
      const w = (u, O, S, M, h) => {
        if (O.length === 0) {
          let g = null;
          for (const c of u.children || [])
            if (c.type === "COMPONENT") {
              if (c.name === S)
                if (g || (g = c), M)
                  try {
                    const y = c.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (y && JSON.parse(y).id === M)
                      return c;
                  } catch (y) {
                  }
                else
                  return c;
            } else if (c.type === "COMPONENT_SET") {
              if (h && c.name !== h)
                continue;
              for (const y of c.children || [])
                if (y.type === "COMPONENT" && y.name === S)
                  if (g || (g = y), M)
                    try {
                      const f = y.getPluginData(
                        "RecursicaPublishedMetadata"
                      );
                      if (f && JSON.parse(f).id === M)
                        return y;
                    } catch (f) {
                    }
                  else
                    return y;
            }
          return g;
        }
        const [v, ...l] = O;
        for (const g of u.children || [])
          if (g.name === v) {
            if (l.length === 0 && g.type === "COMPONENT_SET") {
              if (h && g.name !== h)
                continue;
              for (const c of g.children || [])
                if (c.type === "COMPONENT" && c.name === S) {
                  if (M)
                    try {
                      const y = c.getPluginData(
                        "RecursicaPublishedMetadata"
                      );
                      if (y && JSON.parse(y).id === M)
                        return c;
                    } catch (y) {
                    }
                  return c;
                }
              return null;
            }
            return w(
              g,
              l,
              S,
              M,
              h
            );
          }
        return null;
      }, A = w(
        b,
        r.path || [],
        r.componentName,
        r.componentGuid,
        r.componentSetName
      );
      if (!A) {
        const u = r.path && r.path.length > 0 ? ` at path [${r.path.join(" → ")}]` : " at page root", O = `Deferred instance "${p.name}" still cannot find component "${r.componentName}" on page "${r.componentPageName}"${u}`;
        await a.error(O), i.push(O), n++;
        continue;
      }
      const d = A.createInstance();
      if (d.name = p.name || s.name.replace("[Deferred: ", "").replace("]", ""), d.x = s.x, d.y = s.y, s.width !== void 0 && s.height !== void 0 && d.resize(s.width, s.height), r.variantProperties && Object.keys(r.variantProperties).length > 0)
        try {
          const u = await d.getMainComponentAsync();
          if (u) {
            let O = null;
            const S = u.type;
            if (S === "COMPONENT_SET" ? O = u.componentPropertyDefinitions : S === "COMPONENT" && u.parent && u.parent.type === "COMPONENT_SET" ? O = u.parent.componentPropertyDefinitions : await a.warning(
              `Cannot set variant properties for resolved instance "${p.name}" - main component is not a COMPONENT_SET or variant`
            ), O) {
              const M = {};
              for (const [h, v] of Object.entries(
                r.variantProperties
              )) {
                const l = h.split("#")[0];
                O[l] && (M[l] = v);
              }
              Object.keys(M).length > 0 && d.setProperties(M);
            }
          }
        } catch (u) {
          await a.warning(
            `Failed to set variant properties for resolved instance "${p.name}": ${u}`
          );
        }
      if (r.componentProperties && Object.keys(r.componentProperties).length > 0)
        try {
          const u = await d.getMainComponentAsync();
          if (u) {
            let O = null;
            const S = u.type;
            if (S === "COMPONENT_SET" ? O = u.componentPropertyDefinitions : S === "COMPONENT" && u.parent && u.parent.type === "COMPONENT_SET" ? O = u.parent.componentPropertyDefinitions : S === "COMPONENT" && (O = u.componentPropertyDefinitions), O)
              for (const [M, h] of Object.entries(
                r.componentProperties
              )) {
                const v = M.split("#")[0];
                if (O[v])
                  try {
                    d.setProperties({
                      [v]: h
                    });
                  } catch (l) {
                    await a.warning(
                      `Failed to set component property "${v}" for resolved instance "${p.name}": ${l}`
                    );
                  }
              }
          }
        } catch (u) {
          await a.warning(
            `Failed to set component properties for resolved instance "${p.name}": ${u}`
          );
        }
      const I = m.children.indexOf(s);
      m.insertChild(I, d), s.remove(), await a.log(
        `  ✓ Resolved deferred instance "${p.name}" from component "${r.componentName}" on page "${r.componentPageName}"`
      ), t++;
    } catch (s) {
      const r = s instanceof Error ? s.message : String(s), p = `Failed to resolve deferred instance "${o.nodeData.name}": ${r}`;
      await a.error(p), i.push(p), n++;
    }
  return await a.log(
    `=== Deferred Resolution Complete: ${t} resolved, ${n} failed ===`
  ), { resolved: t, failed: n, errors: i };
}
async function un(e) {
  await a.log("=== Cleaning up created entities ===");
  try {
    const { pageIds: t, collectionIds: n, variableIds: i } = e;
    let o = 0;
    for (const p of i)
      try {
        const m = figma.variables.getVariableById(p);
        if (m) {
          const b = m.variableCollectionId;
          n.includes(b) || (m.remove(), o++);
        }
      } catch (m) {
        await a.warning(
          `Could not delete variable ${p.substring(0, 8)}...: ${m}`
        );
      }
    let s = 0;
    for (const p of n)
      try {
        const m = figma.variables.getVariableCollectionById(p);
        m && (m.remove(), s++);
      } catch (m) {
        await a.warning(
          `Could not delete collection ${p.substring(0, 8)}...: ${m}`
        );
      }
    await figma.loadAllPagesAsync();
    let r = 0;
    for (const p of t)
      try {
        const m = await figma.getNodeByIdAsync(p);
        m && m.type === "PAGE" && (m.remove(), r++);
      } catch (m) {
        await a.warning(
          `Could not delete page ${p.substring(0, 8)}...: ${m}`
        );
      }
    return await a.log(
      `Cleanup complete: Deleted ${r} page(s), ${s} collection(s), ${o} variable(s)`
    ), {
      type: "cleanupCreatedEntities",
      success: !0,
      error: !1,
      message: "Cleanup completed successfully",
      data: {
        deletedPages: r,
        deletedCollections: s,
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
async function at(e) {
  const t = [];
  for (const { fileName: n, jsonData: i } of e)
    try {
      const o = et(i);
      if (!o.success || !o.expandedJsonData) {
        await a.warning(
          `Skipping ${n} - failed to expand JSON: ${o.error || "Unknown error"}`
        );
        continue;
      }
      const s = o.expandedJsonData, r = s.metadata;
      if (!r || !r.name || !r.guid) {
        await a.warning(
          `Skipping ${n} - missing or invalid metadata`
        );
        continue;
      }
      const p = [];
      if (s.instances) {
        const b = pe.fromTable(
          s.instances
        ).getSerializedTable();
        for (const w of Object.values(b))
          w.instanceType === "normal" && w.componentPageName && (p.includes(w.componentPageName) || p.push(w.componentPageName));
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
function it(e) {
  const t = [], n = [], i = [], o = /* @__PURE__ */ new Map();
  for (const b of e)
    o.set(b.pageName, b);
  const s = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), p = [], m = (b) => {
    if (s.has(b.pageName))
      return !1;
    if (r.has(b.pageName)) {
      const w = p.findIndex(
        (A) => A.pageName === b.pageName
      );
      if (w !== -1) {
        const A = p.slice(w).concat([b]);
        return n.push(A), !0;
      }
      return !1;
    }
    r.add(b.pageName), p.push(b);
    for (const w of b.dependencies) {
      const A = o.get(w);
      A && m(A);
    }
    return r.delete(b.pageName), p.pop(), s.add(b.pageName), t.push(b), !1;
  };
  for (const b of e)
    s.has(b.pageName) || m(b);
  for (const b of e)
    for (const w of b.dependencies)
      o.has(w) || i.push(
        `Page "${b.pageName}" (${b.fileName}) depends on "${w}" which is not in the import set`
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
      const o = i.map((s) => `"${s.pageName}"`).join(" → ");
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
async function gn(e) {
  var u, O, S, M, h;
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
  } = await rt(t);
  o.length > 0 && await a.warning(
    `Found ${o.length} dependency warning(s) - some dependencies may be missing`
  ), i.length > 0 && await a.log(
    `Detected ${i.length} circular dependency cycle(s) - will use deferred resolution`
  ), await a.log("=== Importing Pages in Order ===");
  let s = 0, r = 0;
  const p = [...o], m = [], b = {
    pageIds: [],
    collectionIds: [],
    variableIds: []
  }, w = [], A = e.mainFileName;
  for (let v = 0; v < n.length; v++) {
    const l = n[v], g = A ? l.fileName === A : v === n.length - 1;
    await a.log(
      `[${v + 1}/${n.length}] Importing ${l.fileName} ("${l.pageName}")${g ? " [MAIN]" : " [DEPENDENCY]"}...`
    );
    try {
      const c = v === 0, y = await tt({
        jsonData: l.jsonData,
        isMainPage: g,
        clearConsole: c
      });
      if (y.success) {
        if (s++, (u = y.data) != null && u.deferredInstances) {
          const f = y.data.deferredInstances;
          Array.isArray(f) && m.push(...f);
        }
        if ((O = y.data) != null && O.createdEntities) {
          const f = y.data.createdEntities;
          f.pageIds && b.pageIds.push(...f.pageIds), f.collectionIds && b.collectionIds.push(...f.collectionIds), f.variableIds && b.variableIds.push(...f.variableIds);
          const N = ((S = f.pageIds) == null ? void 0 : S[0]) || ((M = y.data) == null ? void 0 : M.pageId);
          (h = y.data) != null && h.pageName && N && w.push({
            name: y.data.pageName,
            pageId: N
          });
        }
      } else
        r++, p.push(
          `Failed to import ${l.fileName}: ${y.message || "Unknown error"}`
        );
    } catch (c) {
      r++;
      const y = c instanceof Error ? c.message : String(c);
      p.push(`Failed to import ${l.fileName}: ${y}`);
    }
  }
  if (m.length > 0) {
    await a.log(
      `=== Resolving ${m.length} Deferred Instance(s) ===`
    );
    try {
      const v = await nt(m);
      await a.log(
        `  Resolved: ${v.resolved}, Failed: ${v.failed}`
      ), v.errors.length > 0 && p.push(...v.errors);
    } catch (v) {
      p.push(
        `Failed to resolve deferred instances: ${v instanceof Error ? v.message : String(v)}`
      );
    }
  }
  await a.log("=== Import Summary ==="), await a.log(
    `  Imported: ${s}, Failed: ${r}, Deferred instances: ${m.length}`
  );
  const d = r === 0, I = d ? `Successfully imported ${s} page(s)${m.length > 0 ? ` (${m.length} deferred instance(s) resolved)` : ""}` : `Import completed with ${r} failure(s). ${p.join("; ")}`;
  return {
    type: "importPagesInOrder",
    success: d,
    error: !d,
    message: I,
    data: {
      imported: s,
      failed: r,
      deferred: m.length,
      errors: p,
      importedPages: w,
      createdEntities: b
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
    const o = await Ee(
      i,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + i.name + " (index: " + n + ")"
    );
    const s = JSON.stringify(o, null, 2), r = JSON.parse(s), p = "Copy - " + r.name, m = figma.createPage();
    if (m.name = p, figma.root.appendChild(m), r.children && r.children.length > 0) {
      let A = function(I) {
        I.forEach((u) => {
          const O = (u.x || 0) + (u.width || 0);
          O > d && (d = O), u.children && u.children.length > 0 && A(u.children);
        });
      };
      console.log(
        "Recreating " + r.children.length + " top-level children..."
      );
      let d = 0;
      A(r.children), console.log("Original content rightmost edge: " + d);
      for (const I of r.children)
        await oe(I, m, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const b = ve(r);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: r.name,
        newPageName: p,
        totalNodes: b
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
      (p) => p.id === t.id
    ), o = t.getPluginData(st);
    if (!o) {
      const b = {
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
      return Re("getComponentMetadata", b);
    }
    const r = {
      componentMetadata: JSON.parse(o),
      currentPageIndex: i
    };
    return Re("getComponentMetadata", r);
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
    for (const o of t) {
      if (o.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${o.name} (type: ${o.type})`
        );
        continue;
      }
      const s = o, r = s.getPluginData(st);
      if (r)
        try {
          const p = JSON.parse(r);
          n.push(p);
        } catch (p) {
          console.warn(
            `Failed to parse metadata for page "${s.name}":`,
            p
          );
          const b = {
            _ver: 1,
            id: "",
            name: be(s.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          n.push(b);
        }
      else {
        const m = {
          _ver: 1,
          id: "",
          name: be(s.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        n.push(m);
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
    } : (re.handleResponse({ requestId: t, action: n }), {
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
async function Cn(e) {
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
const An = {
  getCurrentUser: ut,
  loadPages: gt,
  exportPage: _e,
  importPage: tt,
  cleanupCreatedEntities: un,
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
  switchToPage: Cn
}, Pn = An;
figma.showUI(__html__, {
  width: 500,
  height: 500
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    Ct(e);
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
    const o = await i(t.data);
    figma.ui.postMessage(q(L({}, o), {
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
