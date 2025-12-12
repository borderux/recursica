var $t = Object.defineProperty, vt = Object.defineProperties;
var Nt = Object.getOwnPropertyDescriptors;
var He = Object.getOwnPropertySymbols;
var Et = Object.prototype.hasOwnProperty, At = Object.prototype.propertyIsEnumerable;
var ke = (e, t, n) => t in e ? $t(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, J = (e, t) => {
  for (var n in t || (t = {}))
    Et.call(t, n) && ke(e, n, t[n]);
  if (He)
    for (var n of He(t))
      At.call(t, n) && ke(e, n, t[n]);
  return e;
}, Q = (e, t) => vt(e, Nt(t));
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
        pages: figma.root.children.map((r, l) => ({
          name: r.name,
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
}), ie = Q(J({}, X), {
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
}), me = Q(J({}, X), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), Ze = Q(J({}, X), {
  cornerRadius: 0
}), It = Q(J({}, X), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function St(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return Y;
    case "TEXT":
      return ie;
    case "VECTOR":
      return me;
    case "LINE":
      return It;
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
        (r) => !(r in t) || z(e[r], t[r])
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
    const i = te(
      t.collectionName
    );
    if (le(t.collectionName)) {
      const o = this.findCollectionByNormalizedName(i);
      if (o !== void 0) {
        const f = this.collections[o];
        return f.modes = this.mergeModes(
          f.modes,
          t.modes
        ), this.collectionMap.set(n, o), o;
      }
    }
    const r = this.nextIndex++;
    this.collectionMap.set(n, r);
    const l = Q(J({}, t), {
      collectionName: i
    });
    if (le(t.collectionName)) {
      const o = Oe(
        t.collectionName
      );
      o && (l.collectionGuid = o), this.normalizedNameMap.set(i, r);
    }
    return this.collections[r] = l, r;
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
      const i = this.collections[n], r = J({
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
    const n = new ve(), i = Object.entries(t).sort(
      (l, o) => parseInt(l[0], 10) - parseInt(o[0], 10)
    );
    for (const [l, o] of i) {
      const f = parseInt(l, 10), m = (r = o.isLocal) != null ? r : !0, u = te(
        o.collectionName || ""
      ), y = o.collectionId || o.collectionGuid || `temp:${f}:${u}`, v = J({
        collectionName: u,
        collectionId: y,
        isLocal: m,
        modes: o.modes || []
      }, o.collectionGuid && {
        collectionGuid: o.collectionGuid
      });
      n.collectionMap.set(y, f), n.collections[f] = v, le(u) && n.normalizedNameMap.set(u, f), n.nextIndex = Math.max(
        n.nextIndex,
        f + 1
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
const Tt = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, Ot = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function Mt(e) {
  var n;
  const t = e.toUpperCase();
  return (n = Tt[t]) != null ? n : e;
}
function Vt(e) {
  var t;
  return typeof e == "number" ? (t = Ot[e]) != null ? t : e.toString() : e;
}
class Ne {
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
      ), l = J(J({
        variableName: i.variableName,
        variableType: Mt(i.variableType)
      }, i._colRef !== void 0 && { _colRef: i._colRef }), r && { valuesByMode: r });
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
      (r, l) => parseInt(r[0], 10) - parseInt(l[0], 10)
    );
    for (const [r, l] of i) {
      const o = parseInt(r, 10), f = Vt(l.variableType), m = Q(J({}, l), {
        variableType: f
        // Always a string after expansion
      });
      n.variables[o] = m, n.nextIndex = Math.max(n.nextIndex, o + 1);
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
function xt(e) {
  return {
    _varRef: e
  };
}
function ge(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let Rt = 0;
const $e = /* @__PURE__ */ new Map();
function kt(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const t = $e.get(e.requestId);
  t && ($e.delete(e.requestId), e.error || !e.guid ? t.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : t.resolve(e.guid));
}
function ze() {
  return new Promise((e, t) => {
    const n = `guid_${Date.now()}_${++Rt}`;
    $e.set(n, { resolve: e, reject: t }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: n
    }), setTimeout(() => {
      $e.has(n) && ($e.delete(n), t(new Error("Timeout waiting for GUID from UI")));
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
function Lt(e, t) {
  const n = t.modes.find((i) => i.modeId === e);
  return n ? n.name : e;
}
async function Qe(e, t, n, i, r = /* @__PURE__ */ new Set()) {
  const l = {};
  for (const [o, f] of Object.entries(e)) {
    const m = Lt(o, i);
    if (f == null) {
      l[m] = f;
      continue;
    }
    if (typeof f == "string" || typeof f == "number" || typeof f == "boolean") {
      l[m] = f;
      continue;
    }
    if (typeof f == "object" && f !== null && "type" in f && f.type === "VARIABLE_ALIAS" && "id" in f) {
      const u = f.id;
      if (r.has(u)) {
        l[m] = {
          type: "VARIABLE_ALIAS",
          id: u
        };
        continue;
      }
      const y = await figma.variables.getVariableByIdAsync(u);
      if (!y) {
        l[m] = {
          type: "VARIABLE_ALIAS",
          id: u
        };
        continue;
      }
      const v = new Set(r);
      v.add(u);
      const s = await figma.variables.getVariableCollectionByIdAsync(
        y.variableCollectionId
      ), b = y.key;
      if (!b) {
        l[m] = {
          type: "VARIABLE_ALIAS",
          id: u
        };
        continue;
      }
      const w = {
        variableName: y.name,
        variableType: y.resolvedType,
        collectionName: s == null ? void 0 : s.name,
        collectionId: y.variableCollectionId,
        variableKey: b,
        id: u,
        isLocal: !y.remote
      };
      if (s) {
        const d = await et(
          s,
          n
        );
        w._colRef = d, y.valuesByMode && (w.valuesByMode = await Qe(
          y.valuesByMode,
          t,
          n,
          s,
          // Pass collection for mode ID to name conversion
          v
        ));
      }
      const A = t.addVariable(w);
      l[m] = {
        type: "VARIABLE_ALIAS",
        id: u,
        _varRef: A
      };
    } else
      l[m] = f;
  }
  return l;
}
const Ce = "recursica:collectionId";
async function Gt(e) {
  if (e.remote === !0) {
    const n = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(n)) {
      const r = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await a.error(r), new Error(r);
    }
    return e.id;
  } else {
    if (le(e.name)) {
      const r = Oe(e.name);
      if (r) {
        const l = e.getSharedPluginData(
          "recursica",
          Ce
        );
        return (!l || l.trim() === "") && e.setSharedPluginData(
          "recursica",
          Ce,
          r
        ), r;
      }
    }
    const n = e.getSharedPluginData(
      "recursica",
      Ce
    );
    if (n && n.trim() !== "")
      return n;
    const i = await ze();
    return e.setSharedPluginData("recursica", Ce, i), i;
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
  const r = await Gt(e), l = e.modes.map((u) => u.name), o = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: n,
    modes: l,
    collectionGuid: r
  }, f = t.addCollection(o), m = n ? "local" : "remote";
  return await a.log(
    `  Added ${m} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), f;
}
async function Ge(e, t, n) {
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
    const l = i.key;
    if (!l)
      return console.log("Variable missing key:", e.id), null;
    const o = await et(
      r,
      n
    ), f = {
      variableName: i.name,
      variableType: i.resolvedType,
      _colRef: o,
      // Reference to collection table (v2.4.0+)
      variableKey: l,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    i.valuesByMode && (f.valuesByMode = await Qe(
      i.valuesByMode,
      t,
      n,
      r,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const m = t.addVariable(f);
    return xt(m);
  } catch (i) {
    const r = i instanceof Error ? i.message : String(i);
    throw console.error("Could not resolve variable alias:", e.id, i), new Error(
      `Failed to resolve variable alias ${e.id}: ${r}`
    );
  }
}
async function ye(e, t, n) {
  if (!e || typeof e != "object") return e;
  const i = {};
  for (const r in e)
    if (Object.prototype.hasOwnProperty.call(e, r)) {
      const l = e[r];
      if (l && typeof l == "object" && !Array.isArray(l))
        if (l.type === "VARIABLE_ALIAS") {
          const o = await Ge(
            l,
            t,
            n
          );
          o && (i[r] = o);
        } else
          i[r] = await ye(
            l,
            t,
            n
          );
      else Array.isArray(l) ? i[r] = await Promise.all(
        l.map(async (o) => (o == null ? void 0 : o.type) === "VARIABLE_ALIAS" ? await Ge(
          o,
          t,
          n
        ) || o : o && typeof o == "object" ? await ye(
          o,
          t,
          n
        ) : o)
      ) : i[r] = l;
    }
  return i;
}
async function tt(e, t, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const r = {};
      for (const l in i)
        Object.prototype.hasOwnProperty.call(i, l) && (l === "boundVariables" ? r[l] = await ye(
          i[l],
          t,
          n
        ) : r[l] = i[l]);
      return r;
    })
  );
}
async function at(e, t, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const r = {};
      for (const l in i)
        Object.prototype.hasOwnProperty.call(i, l) && (l === "boundVariables" ? r[l] = await ye(
          i[l],
          t,
          n
        ) : r[l] = i[l]);
      return r;
    })
  );
}
const we = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  extractBoundVariables: ye,
  resolveVariableAliasMetadata: Ge,
  serializeBackgrounds: at,
  serializeFills: tt
}, Symbol.toStringTag, { value: "Module" }));
async function nt(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  if (e.type && (n.type = e.type, i.add("type")), e.id && (n.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (n.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (n.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (n.y = e.y, i.add("y")), e.width !== void 0 && (n.width = e.width, i.add("width")), e.height !== void 0 && (n.height = e.height, i.add("height")), e.visible !== void 0 && z(e.visible, X.visible) && (n.visible = e.visible, i.add("visible")), e.locked !== void 0 && z(e.locked, X.locked) && (n.locked = e.locked, i.add("locked")), e.opacity !== void 0 && z(e.opacity, X.opacity) && (n.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && z(e.rotation, X.rotation) && (n.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && z(e.blendMode, X.blendMode) && (n.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && z(e.effects, X.effects) && (n.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const r = await tt(
      e.fills,
      t.variableTable,
      t.collectionTable
    );
    z(r, X.fills) && (n.fills = r), i.add("fills");
  }
  if (e.strokes !== void 0 && z(e.strokes, X.strokes) && (n.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && z(e.strokeWeight, X.strokeWeight) && (n.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && z(e.strokeAlign, X.strokeAlign) && (n.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const r = await ye(
      e.boundVariables,
      t.variableTable,
      t.collectionTable
    );
    Object.keys(r).length > 0 && (n.boundVariables = r), i.add("boundVariables");
  }
  if (e.backgrounds !== void 0) {
    const r = await at(
      e.backgrounds,
      t.variableTable,
      t.collectionTable
    );
    r && Array.isArray(r) && r.length > 0 && (n.backgrounds = r), i.add("backgrounds");
  }
  return n;
}
const Bt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseBaseNodeProperties: nt
}, Symbol.toStringTag, { value: "Module" }));
async function _e(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  if (e.type === "COMPONENT")
    try {
      e.componentPropertyDefinitions && (n.componentPropertyDefinitions = e.componentPropertyDefinitions, i.add("componentPropertyDefinitions"));
    } catch (r) {
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
const Ut = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseFrameProperties: _e
}, Symbol.toStringTag, { value: "Module" }));
async function Ft(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (n.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (n.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (n.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && z(
    e.textAlignHorizontal,
    ie.textAlignHorizontal
  ) && (n.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && z(
    e.textAlignVertical,
    ie.textAlignVertical
  ) && (n.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && z(e.letterSpacing, ie.letterSpacing) && (n.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && z(e.lineHeight, ie.lineHeight) && (n.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && z(e.textCase, ie.textCase) && (n.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && z(e.textDecoration, ie.textDecoration) && (n.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && z(e.textAutoResize, ie.textAutoResize) && (n.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && z(
    e.paragraphSpacing,
    ie.paragraphSpacing
  ) && (n.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && z(e.paragraphIndent, ie.paragraphIndent) && (n.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && z(e.listOptions, ie.listOptions) && (n.listOptions = e.listOptions, i.add("listOptions")), n;
}
function zt(e) {
  const t = e.match(/^(\d+\.?\d*)[eE]([+-]?\d+)$/);
  if (t) {
    const n = parseFloat(t[1]), i = parseInt(t[2]), r = n * Math.pow(10, i);
    return Math.abs(r) < 1e-10 ? "0" : r.toFixed(6).replace(/\.?0+$/, "") || "0";
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
    (n, i, r) => `${i} ${r}`
  ), t = t.replace(/\s+/g, " ").trim(), t;
}
function Be(e) {
  return Array.isArray(e) ? e.map((t) => ({
    data: it(t.data),
    // Normalize winding rule key (use windRule consistently)
    windRule: t.windRule || t.windingRule || "NONZERO"
  })) : e;
}
const jt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  normalizeSvgPath: it,
  normalizeVectorGeometry: Be
}, Symbol.toStringTag, { value: "Module" }));
async function Dt(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && z(e.fillGeometry, me.fillGeometry) && (n.fillGeometry = Be(e.fillGeometry), i.add("fillGeometry")), e.strokeGeometry !== void 0 && z(e.strokeGeometry, me.strokeGeometry) && (n.strokeGeometry = Be(e.strokeGeometry), i.add("strokeGeometry")), e.strokeCap !== void 0 && z(e.strokeCap, me.strokeCap) && (n.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && z(e.strokeJoin, me.strokeJoin) && (n.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && z(e.dashPattern, me.dashPattern) && (n.dashPattern = e.dashPattern, i.add("dashPattern")), n;
}
async function Jt(e, t) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && z(e.cornerRadius, Ze.cornerRadius) && (n.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (n.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, i.add("pointCount")), n;
}
const Ie = /* @__PURE__ */ new Map();
let Wt = 0;
function Kt() {
  return `prompt_${Date.now()}_${++Wt}`;
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
    var f;
    const n = typeof t == "number" ? { timeoutMs: t } : t, i = (f = n == null ? void 0 : n.timeoutMs) != null ? f : 3e5, r = n == null ? void 0 : n.okLabel, l = n == null ? void 0 : n.cancelLabel, o = Kt();
    return new Promise((m, u) => {
      const y = i === -1 ? null : setTimeout(() => {
        Ie.delete(o), u(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      Ie.set(o, {
        resolve: m,
        reject: u,
        timeout: y
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: J(J({
          message: e,
          requestId: o
        }, r && { okLabel: r }), l && { cancelLabel: l })
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
}, Ht = "RecursicaPublishedMetadata";
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
function qe(e) {
  try {
    const t = e.getPluginData(Ht);
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
async function qt(e, t) {
  var r, l;
  const n = {}, i = /* @__PURE__ */ new Set();
  if (n._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const o = await e.getMainComponentAsync();
    if (!o) {
      const I = e.name || "(unnamed)", C = e.id;
      if (t.detachedComponentsHandled.has(C))
        await a.log(
          `Treating detached instance "${I}" as internal instance (already prompted)`
        );
      else {
        await a.warning(
          `Found detached instance: "${I}" (main component is missing)`
        );
        const c = `Found detached instance "${I}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await he.prompt(c, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(C), await a.log(
            `Treating detached instance "${I}" as internal instance`
          );
        } catch (g) {
          if (g instanceof Error && g.message === "User cancelled") {
            const h = `Export cancelled: Detached instance "${I}" found. Please fix the instance before exporting.`;
            await a.error(h);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch (S) {
              console.warn("Could not scroll to instance:", S);
            }
            throw new Error(h);
          } else
            throw g;
        }
      }
      if (!Le(e).page) {
        const c = `Detached instance "${I}" is not on any page. Cannot export.`;
        throw await a.error(c), new Error(c);
      }
      let M, L;
      try {
        e.variantProperties && (M = e.variantProperties), e.componentProperties && (L = e.componentProperties);
      } catch (c) {
      }
      const p = J(J({
        instanceType: "internal",
        componentName: I,
        componentNodeId: e.id
      }, M && { variantProperties: M }), L && { componentProperties: L }), $ = t.instanceTable.addInstance(p);
      return n._instanceRef = $, i.add("_instanceRef"), await a.log(
        `  Exported detached INSTANCE: "${I}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), n;
    }
    const f = e.name || "(unnamed)", m = o.name || "(unnamed)", u = o.remote === !0, v = Le(e).page, s = Le(o);
    let b = s.page;
    if (!b && u)
      try {
        await figma.loadAllPagesAsync();
        const I = figma.root.children;
        let C = null;
        for (const E of I)
          try {
            if (E.findOne(
              (M) => M.id === o.id
            )) {
              C = E;
              break;
            }
          } catch (V) {
          }
        if (!C) {
          const E = o.id.split(":")[0];
          for (const V of I) {
            const M = V.id.split(":")[0];
            if (E === M) {
              C = V;
              break;
            }
          }
        }
        C && (b = C);
      } catch (I) {
      }
    let w, A = b;
    if (u)
      if (b) {
        const I = qe(b);
        w = "normal", A = b, I != null && I.id ? await a.log(
          `  Component "${m}" is from library but also exists on local page "${b.name}" with metadata. Treating as "normal" instance.`
        ) : await a.log(
          `  Component "${m}" is from library and exists on local page "${b.name}" (no metadata). Treating as "normal" instance - page should be published first.`
        );
      } else
        w = "remote", await a.log(
          `  Component "${m}" is from library and not on a local page. Treating as "remote" instance.`
        );
    else if (b && v && b.id === v.id)
      w = "internal";
    else if (b && v && b.id !== v.id)
      w = "normal";
    else if (b && !v)
      w = "normal";
    else if (!u && s.reason === "detached") {
      const I = o.id;
      if (t.detachedComponentsHandled.has(I))
        w = "remote", await a.log(
          `Treating detached instance "${f}" -> component "${m}" as remote instance (already prompted)`
        );
      else {
        await a.warning(
          `Found detached instance: "${f}" -> component "${m}" (component is not on any page)`
        );
        try {
          await figma.viewport.scrollAndZoomIntoView([o]);
        } catch (E) {
          console.warn("Could not scroll to component:", E);
        }
        const C = `Found detached instance "${f}" attached to component "${m}". This should be fixed. Continue to publish?`;
        try {
          await he.prompt(C, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(I), w = "remote", await a.log(
            `Treating detached instance "${f}" as remote instance (will be created on REMOTES page)`
          );
        } catch (E) {
          if (E instanceof Error && E.message === "User cancelled") {
            const V = `Export cancelled: Detached instance "${f}" found. The component "${m}" is not on any page. Please fix the instance before exporting.`;
            throw await a.error(V), new Error(V);
          } else
            throw E;
        }
      }
    } else
      u || await a.warning(
        `  Instance "${f}" -> component "${m}": componentPage is null but component is not remote. Reason: ${s.reason}. Cannot determine instance type.`
      ), w = "normal";
    let d, P;
    try {
      if (e.variantProperties && (d = e.variantProperties, await a.log(
        `  Instance "${f}" -> variantProperties from instance: ${JSON.stringify(d)}`
      )), typeof e.getProperties == "function")
        try {
          const I = await e.getProperties();
          I && I.variantProperties && (await a.log(
            `  Instance "${f}" -> variantProperties from getProperties(): ${JSON.stringify(I.variantProperties)}`
          ), I.variantProperties && Object.keys(I.variantProperties).length > 0 && (d = I.variantProperties));
        } catch (I) {
          await a.log(
            `  Instance "${f}" -> getProperties() not available or failed: ${I}`
          );
        }
      if (e.componentProperties && (P = e.componentProperties), o.parent && o.parent.type === "COMPONENT_SET") {
        const I = o.parent;
        try {
          const C = I.componentPropertyDefinitions;
          C && await a.log(
            `  Component set "${I.name}" has property definitions: ${JSON.stringify(Object.keys(C))}`
          );
          const E = {}, V = m.split(",").map((M) => M.trim());
          for (const M of V) {
            const L = M.split("=").map((p) => p.trim());
            if (L.length >= 2) {
              const p = L[0], $ = L.slice(1).join("=").trim();
              C && C[p] && (E[p] = $);
            }
          }
          if (Object.keys(E).length > 0 && await a.log(
            `  Parsed variant properties from component name "${m}": ${JSON.stringify(E)}`
          ), d && Object.keys(d).length > 0)
            await a.log(
              `  Using variant properties from instance (source of truth): ${JSON.stringify(d)}`
            );
          else if (Object.keys(E).length > 0)
            d = E, await a.log(
              `  Using variant properties from component name (fallback): ${JSON.stringify(d)}`
            );
          else if (o.variantProperties) {
            const M = o.variantProperties;
            await a.log(
              `  Main component "${m}" has variantProperties: ${JSON.stringify(M)}`
            ), d = M;
          }
        } catch (C) {
          await a.warning(
            `  Could not get variant properties from component set: ${C}`
          );
        }
      }
    } catch (I) {
    }
    let O, _;
    try {
      let I = o.parent;
      const C = [];
      let E = 0;
      const V = 20;
      for (; I && E < V; )
        try {
          const M = I.type, L = I.name;
          if (M === "COMPONENT_SET" && !_ && (_ = L), M === "PAGE")
            break;
          const p = L || "";
          C.unshift(p), I = I.parent, E++;
        } catch (M) {
          break;
        }
      O = C;
    } catch (I) {
    }
    const x = J(J(J(J({
      instanceType: w,
      componentName: m
    }, _ && { componentSetName: _ }), d && { variantProperties: d }), P && { componentProperties: P }), w === "normal" ? { path: O || [] } : O && O.length > 0 && {
      path: O
    });
    if (w === "internal") {
      x.componentNodeId = o.id, await a.log(
        `  Found INSTANCE: "${f}" -> INTERNAL component "${m}" (ID: ${o.id.substring(0, 8)}...)`
      );
      const I = e.boundVariables, C = o.boundVariables;
      if (I && typeof I == "object") {
        const p = Object.keys(I);
        await a.log(
          `  DEBUG: Internal instance "${f}" -> boundVariables keys: ${p.length > 0 ? p.join(", ") : "none"}`
        );
        for (const c of p) {
          const g = I[c], h = (g == null ? void 0 : g.type) || typeof g;
          await a.log(
            `  DEBUG:   boundVariables.${c}: type=${h}, value=${JSON.stringify(g)}`
          );
        }
        const $ = [
          "backgrounds",
          "selectionColor",
          "selectionColors",
          "selection",
          "selectColor"
        ];
        for (const c of $)
          I[c] !== void 0 && await a.log(
            `  DEBUG:   Found potential "Selection colors" property: boundVariables.${c} = ${JSON.stringify(I[c])}`
          );
      } else
        await a.log(
          `  DEBUG: Internal instance "${f}" -> No boundVariables found on instance node`
        );
      if (C && typeof C == "object") {
        const p = Object.keys(C);
        await a.log(
          `  DEBUG: Main component "${m}" -> boundVariables keys: ${p.length > 0 ? p.join(", ") : "none"}`
        );
      }
      const E = e.backgrounds;
      if (E && Array.isArray(E)) {
        await a.log(
          `  DEBUG: Internal instance "${f}" -> backgrounds array length: ${E.length}`
        );
        for (let p = 0; p < E.length; p++) {
          const $ = E[p];
          if ($ && typeof $ == "object") {
            if (await a.log(
              `  DEBUG:   backgrounds[${p}] structure: ${JSON.stringify(Object.keys($))}`
            ), $.boundVariables) {
              const c = Object.keys($.boundVariables);
              await a.log(
                `  DEBUG:   backgrounds[${p}].boundVariables keys: ${c.length > 0 ? c.join(", ") : "none"}`
              );
              for (const g of c) {
                const h = $.boundVariables[g];
                await a.log(
                  `  DEBUG:     backgrounds[${p}].boundVariables.${g}: ${JSON.stringify(h)}`
                );
              }
            }
            $.color && await a.log(
              `  DEBUG:   backgrounds[${p}].color: ${JSON.stringify($.color)}`
            );
          }
        }
      }
      const V = Object.keys(e).filter(
        (p) => !p.startsWith("_") && p !== "parent" && p !== "removed" && typeof e[p] != "function" && p !== "type" && p !== "id" && p !== "name" && p !== "boundVariables" && p !== "backgrounds" && p !== "fills"
      ), M = Object.keys(o).filter(
        (p) => !p.startsWith("_") && p !== "parent" && p !== "removed" && typeof o[p] != "function" && p !== "type" && p !== "id" && p !== "name" && p !== "boundVariables" && p !== "backgrounds" && p !== "fills"
      ), L = [
        .../* @__PURE__ */ new Set([...V, ...M])
      ].filter(
        (p) => p.toLowerCase().includes("selection") || p.toLowerCase().includes("select") || p.toLowerCase().includes("color") && !p.toLowerCase().includes("fill") && !p.toLowerCase().includes("stroke")
      );
      if (L.length > 0) {
        await a.log(
          `  DEBUG: Found selection/color-related properties: ${L.join(", ")}`
        );
        for (const p of L)
          try {
            if (V.includes(p)) {
              const $ = e[p];
              await a.log(
                `  DEBUG:   Instance.${p}: ${JSON.stringify($)}`
              );
            }
            if (M.includes(p)) {
              const $ = o[p];
              await a.log(
                `  DEBUG:   MainComponent.${p}: ${JSON.stringify($)}`
              );
            }
          } catch ($) {
          }
      } else
        await a.log(
          "  DEBUG: No selection/color-related properties found on instance or main component"
        );
    } else if (w === "normal") {
      const I = A || b;
      if (I) {
        x.componentPageName = I.name;
        const E = qe(I);
        E != null && E.id && E.version !== void 0 ? (x.componentGuid = E.id, x.componentVersion = E.version, await a.log(
          `  Found INSTANCE: "${f}" -> NORMAL component "${m}" (ID: ${o.id.substring(0, 8)}...) at path [${(O || []).join(" → ")}]`
        )) : await a.warning(
          `  Instance "${f}" -> component "${m}" is classified as normal but page "${I.name}" has no metadata. This instance will not be importable.`
        );
      } else {
        const E = o.id;
        let V = "", M = "";
        switch (s.reason) {
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
          await figma.viewport.scrollAndZoomIntoView([o]);
        } catch ($) {
          console.warn("Could not scroll to component:", $);
        }
        const L = `Normal instance "${f}" -> component "${m}" (ID: ${E}) has no componentPage. ${V}. ${M} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", L), await a.error(L);
        const p = new Error(L);
        throw console.error("Throwing error:", p), p;
      }
      O === void 0 && console.warn(
        `Failed to build path for normal instance "${f}" -> component "${m}". Path is required for resolution.`
      );
      const C = O && O.length > 0 ? ` at path [${O.join(" → ")}]` : " at page root";
      await a.log(
        `  Found INSTANCE: "${f}" -> NORMAL component "${m}" (ID: ${o.id.substring(0, 8)}...)${C}`
      );
    } else if (w === "remote") {
      let I, C;
      const E = t.detachedComponentsHandled.has(
        o.id
      );
      if (!E)
        try {
          if (typeof o.getPublishStatusAsync == "function")
            try {
              const M = await o.getPublishStatusAsync();
              M && typeof M == "object" && (M.libraryName && (I = M.libraryName), M.libraryKey && (C = M.libraryKey));
            } catch (M) {
            }
          try {
            const M = figma.teamLibrary;
            if (typeof (M == null ? void 0 : M.getAvailableLibraryComponentSetsAsync) == "function") {
              const L = await M.getAvailableLibraryComponentSetsAsync();
              if (L && Array.isArray(L)) {
                for (const p of L)
                  if (p.key === o.key || p.name === o.name) {
                    p.libraryName && (I = p.libraryName), p.libraryKey && (C = p.libraryKey);
                    break;
                  }
              }
            }
          } catch (M) {
          }
        } catch (M) {
          console.warn(
            `Error getting library info for remote component "${m}":`,
            M
          );
        }
      if (I && (x.remoteLibraryName = I), C && (x.remoteLibraryKey = C), E && (x.componentNodeId = o.id), t.instanceTable.getInstanceIndex(x) !== -1)
        await a.log(
          `  Found INSTANCE: "${f}" -> REMOTE component "${m}" (ID: ${o.id.substring(0, 8)}...)${E ? " [DETACHED]" : ""}`
        );
      else
        try {
          const { parseBaseNodeProperties: M } = await Promise.resolve().then(() => Bt), L = await M(e, t), { parseFrameProperties: p } = await Promise.resolve().then(() => Ut), $ = await p(e, t), c = Q(J(J({}, L), $), {
            type: "COMPONENT"
            // Convert to COMPONENT type for recreation (must be after baseProps to override)
          });
          if (e.children && Array.isArray(e.children) && e.children.length > 0) {
            const g = Q(J({}, t), {
              depth: (t.depth || 0) + 1
            }), { extractNodeData: h } = await Promise.resolve().then(() => ea), S = [];
            for (const N of e.children)
              try {
                let T;
                if (N.type === "INSTANCE")
                  try {
                    const k = await N.getMainComponentAsync();
                    if (k) {
                      const R = await M(
                        N,
                        t
                      ), B = await p(
                        N,
                        t
                      ), D = await h(
                        k,
                        /* @__PURE__ */ new WeakSet(),
                        g
                      );
                      T = Q(J(J(J({}, D), R), B), {
                        type: "COMPONENT"
                        // Convert to COMPONENT
                      });
                    } else
                      T = await h(
                        N,
                        /* @__PURE__ */ new WeakSet(),
                        g
                      ), T.type === "INSTANCE" && (T.type = "COMPONENT"), delete T._instanceRef;
                  } catch (k) {
                    T = await h(
                      N,
                      /* @__PURE__ */ new WeakSet(),
                      g
                    ), T.type === "INSTANCE" && (T.type = "COMPONENT"), delete T._instanceRef;
                  }
                else {
                  T = await h(
                    N,
                    /* @__PURE__ */ new WeakSet(),
                    g
                  );
                  const k = N.boundVariables;
                  if (k && typeof k == "object") {
                    const R = Object.keys(k);
                    R.length > 0 && (await a.log(
                      `  DEBUG: Child "${N.name || "Unnamed"}" -> boundVariables keys: ${R.join(", ")}`
                    ), k.backgrounds !== void 0 && await a.log(
                      `  DEBUG:   Child "${N.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(k.backgrounds)}`
                    ));
                  }
                  if (o.children && Array.isArray(o.children)) {
                    const R = o.children.find(
                      (B) => B.name === N.name
                    );
                    if (R) {
                      const B = R.boundVariables;
                      if (B && typeof B == "object") {
                        const D = Object.keys(B);
                        if (D.length > 0 && (await a.log(
                          `  DEBUG: Main component child "${R.name || "Unnamed"}" -> boundVariables keys: ${D.join(", ")}`
                        ), B.backgrounds !== void 0 && (await a.log(
                          `  DEBUG:   Main component child "${R.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(B.backgrounds)}`
                        ), !k || !k.backgrounds))) {
                          await a.log(
                            "  DEBUG:   Instance child doesn't have boundVariables.backgrounds, but main component child does - preserving from main component"
                          );
                          const { extractBoundVariables: K } = await Promise.resolve().then(() => we), W = await K(
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
                S.push(T);
              } catch (T) {
                console.warn(
                  `Failed to extract child "${N.name || "Unnamed"}" for remote component "${m}":`,
                  T
                );
              }
            c.children = S;
          }
          if (!c)
            throw new Error("Failed to build structure for remote instance");
          try {
            const g = e.boundVariables;
            if (g && typeof g == "object") {
              const G = Object.keys(g);
              await a.log(
                `  DEBUG: Instance "${f}" -> boundVariables keys: ${G.length > 0 ? G.join(", ") : "none"}`
              );
              for (const j of G) {
                const H = g[j], wt = (H == null ? void 0 : H.type) || typeof H;
                if (await a.log(
                  `  DEBUG:   boundVariables.${j}: type=${wt}, value=${JSON.stringify(H)}`
                ), H && typeof H == "object" && !Array.isArray(H)) {
                  const Re = Object.keys(H);
                  if (Re.length > 0) {
                    await a.log(
                      `  DEBUG:     boundVariables.${j} has nested keys: ${Re.join(", ")}`
                    );
                    for (const Ke of Re) {
                      const Ae = H[Ke];
                      Ae && typeof Ae == "object" && Ae.type === "VARIABLE_ALIAS" && await a.log(
                        `  DEBUG:       boundVariables.${j}.${Ke}: VARIABLE_ALIAS id=${Ae.id}`
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
                g[j] !== void 0 && await a.log(
                  `  DEBUG:   Found potential "Selection colors" property: boundVariables.${j} = ${JSON.stringify(g[j])}`
                );
            } else
              await a.log(
                `  DEBUG: Instance "${f}" -> No boundVariables found on instance node`
              );
            const h = g && g.fills !== void 0 && g.fills !== null, S = c.fills !== void 0 && Array.isArray(c.fills) && c.fills.length > 0, N = e.fills !== void 0 && Array.isArray(e.fills) && e.fills.length > 0, T = o.fills !== void 0 && Array.isArray(o.fills) && o.fills.length > 0;
            if (await a.log(
              `  DEBUG: Instance "${f}" -> fills check: instanceHasFills=${N}, structureHasFills=${S}, mainComponentHasFills=${T}, hasInstanceFillsBoundVar=${!!h}`
            ), h && !S) {
              await a.log(
                "  DEBUG: Instance has boundVariables.fills but structure has no fills - attempting to get fills"
              );
              try {
                if (N) {
                  const { serializeFills: G } = await Promise.resolve().then(() => we), F = await G(
                    e.fills,
                    t.variableTable,
                    t.collectionTable
                  );
                  c.fills = F, await a.log(
                    `  DEBUG: Got ${F.length} fill(s) from instance node`
                  );
                } else if (T) {
                  const { serializeFills: G } = await Promise.resolve().then(() => we), F = await G(
                    o.fills,
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
              } catch (G) {
                await a.warning(
                  `  Failed to get fills: ${G}`
                );
              }
            }
            const k = e.selectionColor, R = o.selectionColor;
            k !== void 0 && await a.log(
              `  DEBUG: Instance "${f}" -> selectionColor: ${JSON.stringify(k)}`
            ), R !== void 0 && await a.log(
              `  DEBUG: Main component "${m}" -> selectionColor: ${JSON.stringify(R)}`
            );
            const B = Object.keys(e).filter(
              (G) => !G.startsWith("_") && G !== "parent" && G !== "removed" && typeof e[G] != "function" && G !== "type" && G !== "id" && G !== "name"
            ), D = Object.keys(o).filter(
              (G) => !G.startsWith("_") && G !== "parent" && G !== "removed" && typeof o[G] != "function" && G !== "type" && G !== "id" && G !== "name"
            ), K = [
              .../* @__PURE__ */ new Set([...B, ...D])
            ].filter(
              (G) => G.toLowerCase().includes("selection") || G.toLowerCase().includes("select") || G.toLowerCase().includes("color") && !G.toLowerCase().includes("fill") && !G.toLowerCase().includes("stroke")
            );
            if (K.length > 0) {
              await a.log(
                `  DEBUG: Found selection/color-related properties: ${K.join(", ")}`
              );
              for (const G of K)
                try {
                  if (B.includes(G)) {
                    const F = e[G];
                    await a.log(
                      `  DEBUG:   Instance.${G}: ${JSON.stringify(F)}`
                    );
                  }
                  if (D.includes(G)) {
                    const F = o[G];
                    await a.log(
                      `  DEBUG:   MainComponent.${G}: ${JSON.stringify(F)}`
                    );
                  }
                } catch (F) {
                }
            } else
              await a.log(
                "  DEBUG: No selection/color-related properties found on instance or main component"
              );
            const W = o.boundVariables;
            if (W && typeof W == "object") {
              const G = Object.keys(W);
              if (G.length > 0) {
                await a.log(
                  `  DEBUG: Main component "${m}" -> boundVariables keys: ${G.join(", ")}`
                );
                for (const F of G) {
                  const j = W[F], H = (j == null ? void 0 : j.type) || typeof j;
                  await a.log(
                    `  DEBUG:   Main component boundVariables.${F}: type=${H}, value=${JSON.stringify(j)}`
                  );
                }
              }
            }
            if (g && Object.keys(g).length > 0) {
              await a.log(
                `  DEBUG: Preserving instance's boundVariables in structure (${Object.keys(g).length} key(s))`
              );
              const { extractBoundVariables: G } = await Promise.resolve().then(() => we), F = await G(
                g,
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
              ) : h && await a.warning(
                "  DEBUG: Instance has boundVariables.fills but extractBoundVariables didn't extract it"
              ), F.backgrounds !== void 0 ? await a.log(
                `  DEBUG: ✓ Preserved boundVariables.backgrounds from instance: ${JSON.stringify(F.backgrounds)}`
              ) : g && g.backgrounds !== void 0 && await a.warning(
                "  DEBUG: Instance has boundVariables.backgrounds but extractBoundVariables didn't extract it"
              );
            }
            if (W && Object.keys(W).length > 0) {
              await a.log(
                `  DEBUG: Checking main component's boundVariables for properties not in instance (${Object.keys(W).length} key(s))`
              );
              const { extractBoundVariables: G } = await Promise.resolve().then(() => we), F = await G(
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
              `  DEBUG: Final structure for "${m}": hasFills=${!!c.fills}, fillsCount=${((r = c.fills) == null ? void 0 : r.length) || 0}, hasBoundVars=${!!c.boundVariables}, boundVarsKeys=${c.boundVariables ? Object.keys(c.boundVariables).join(", ") : "none"}`
            ), (l = c.boundVariables) != null && l.fills && await a.log(
              `  DEBUG: Structure boundVariables.fills: ${JSON.stringify(c.boundVariables.fills)}`
            );
          } catch (g) {
            await a.warning(
              `  Failed to handle bound variables for fills: ${g}`
            );
          }
          x.structure = c, E ? await a.log(
            `  Extracted structure for detached component "${m}" (ID: ${o.id.substring(0, 8)}...)`
          ) : await a.log(
            `  Extracted structure from instance for remote component "${m}" (preserving size overrides: ${e.width}x${e.height})`
          ), await a.log(
            `  Found INSTANCE: "${f}" -> REMOTE component "${m}" (ID: ${o.id.substring(0, 8)}...)${E ? " [DETACHED]" : ""}`
          );
        } catch (M) {
          const L = `Failed to extract structure for remote component "${m}": ${M instanceof Error ? M.message : String(M)}`;
          console.error(L, M), await a.error(L);
        }
    }
    const U = t.instanceTable.addInstance(x);
    n._instanceRef = U, i.add("_instanceRef");
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
      (r, l) => parseInt(r[0], 10) - parseInt(l[0], 10)
    );
    for (const [r, l] of i) {
      const o = parseInt(r, 10), f = n.generateKey(l);
      n.instanceMap.set(f, o), n.instances[o] = l, n.nextIndex = Math.max(n.nextIndex, o + 1);
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
function Yt() {
  const e = {};
  for (const [t, n] of Object.entries(ot))
    e[n] = t;
  return e;
}
function Ye(e) {
  var t;
  return (t = ot[e]) != null ? t : e;
}
function Xt(e) {
  var t;
  return typeof e == "number" ? (t = Yt()[e]) != null ? t : e.toString() : e;
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
}, Ue = {};
for (const [e, t] of Object.entries(rt))
  Ue[t] = e;
class Me {
  constructor() {
    ae(this, "shortToLong");
    ae(this, "longToShort");
    this.shortToLong = J({}, Ue), this.longToShort = J({}, rt);
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
      for (const [r, l] of Object.entries(t)) {
        const o = this.getShortName(r);
        if (o !== r && !i.has(o)) {
          let f = this.compressObject(l);
          o === "type" && typeof f == "string" && (f = Ye(f)), n[o] = f;
        } else {
          let f = this.compressObject(l);
          r === "type" && typeof f == "string" && (f = Ye(f)), n[r] = f;
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
        const l = this.getLongName(i);
        let o = this.expandObject(r);
        (l === "type" || i === "type") && (typeof o == "number" || typeof o == "string") && (o = Xt(o)), n[l] = o;
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
    const n = new Me();
    n.shortToLong = J(J({}, Ue), t), n.longToShort = {};
    for (const [i, r] of Object.entries(
      n.shortToLong
    ))
      n.longToShort[r] = i;
    return n;
  }
}
function Zt(e, t) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const n = {};
  e.metadata && (n.metadata = e.metadata);
  for (const [i, r] of Object.entries(e))
    i !== "metadata" && (n[i] = t.compressObject(r));
  return n;
}
function Qt(e, t) {
  return t.expandObject(e);
}
function Te(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
function Ve(e) {
  let t = 1;
  return e.children && e.children.length > 0 && e.children.forEach((n) => {
    t += Ve(n);
  }), t;
}
async function xe(e, t = /* @__PURE__ */ new WeakSet(), n = {}) {
  var b, w, A, d, P, O, _;
  if (!e || typeof e != "object")
    return e;
  const i = (b = n.maxNodes) != null ? b : 1e4, r = (w = n.nodeCount) != null ? w : 0;
  if (r >= i)
    return await a.warning(
      `Maximum node count (${i}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: r
    };
  const l = {
    visited: (A = n.visited) != null ? A : /* @__PURE__ */ new WeakSet(),
    depth: (d = n.depth) != null ? d : 0,
    maxDepth: (P = n.maxDepth) != null ? P : 100,
    nodeCount: r + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: n.variableTable,
    collectionTable: n.collectionTable,
    instanceTable: n.instanceTable,
    detachedComponentsHandled: (O = n.detachedComponentsHandled) != null ? O : /* @__PURE__ */ new Set(),
    exportedIds: (_ = n.exportedIds) != null ? _ : /* @__PURE__ */ new Map()
  };
  if (t.has(e))
    return "[Circular Reference]";
  t.add(e), l.visited = t;
  const o = {}, f = await nt(e, l);
  if (Object.assign(o, f), o.id && l.exportedIds) {
    const x = l.exportedIds.get(o.id);
    if (x !== void 0) {
      const U = o.name || "Unnamed";
      if (x !== U) {
        const I = `Duplicate ID detected during export: ID "${o.id.substring(0, 8)}..." is used by both "${x}" and "${U}". Each node must have a unique ID.`;
        throw await a.error(I), new Error(I);
      }
      await a.warning(
        `Node "${U}" (ID: ${o.id.substring(0, 8)}...) was encountered multiple times during export. This may indicate a structural issue.`
      );
    } else
      l.exportedIds.set(o.id, o.name || "Unnamed");
  }
  const m = e.type;
  if (m)
    switch (m) {
      case "FRAME":
      case "COMPONENT": {
        const x = await _e(e);
        Object.assign(o, x);
        break;
      }
      case "INSTANCE": {
        const x = await qt(
          e,
          l
        );
        Object.assign(o, x);
        const U = await _e(
          e
        );
        Object.assign(o, U);
        break;
      }
      case "TEXT": {
        const x = await Ft(e);
        Object.assign(o, x);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const x = await Dt(e);
        Object.assign(o, x);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const x = await Jt(e);
        Object.assign(o, x);
        break;
      }
      default:
        l.unhandledKeys.add("_unknownType");
        break;
    }
  const u = Object.getOwnPropertyNames(e), y = /* @__PURE__ */ new Set([
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
  (m === "FRAME" || m === "COMPONENT" || m === "INSTANCE") && (y.add("layoutMode"), y.add("primaryAxisSizingMode"), y.add("counterAxisSizingMode"), y.add("primaryAxisAlignItems"), y.add("counterAxisAlignItems"), y.add("paddingLeft"), y.add("paddingRight"), y.add("paddingTop"), y.add("paddingBottom"), y.add("itemSpacing"), y.add("counterAxisSpacing"), y.add("cornerRadius"), y.add("clipsContent"), y.add("layoutWrap"), y.add("layoutGrow")), m === "TEXT" && (y.add("characters"), y.add("fontName"), y.add("fontSize"), y.add("textAlignHorizontal"), y.add("textAlignVertical"), y.add("letterSpacing"), y.add("lineHeight"), y.add("textCase"), y.add("textDecoration"), y.add("textAutoResize"), y.add("paragraphSpacing"), y.add("paragraphIndent"), y.add("listOptions")), (m === "VECTOR" || m === "LINE") && (y.add("fillGeometry"), y.add("strokeGeometry")), (m === "RECTANGLE" || m === "ELLIPSE" || m === "STAR" || m === "POLYGON") && (y.add("pointCount"), y.add("innerRadius"), y.add("arcData")), m === "INSTANCE" && (y.add("mainComponent"), y.add("componentProperties"));
  for (const x of u)
    typeof e[x] != "function" && (y.has(x) || l.unhandledKeys.add(x));
  l.unhandledKeys.size > 0 && (o._unhandledKeys = Array.from(l.unhandledKeys).sort());
  const v = o._instanceRef !== void 0 && l.instanceTable && m === "INSTANCE";
  let s = !1;
  if (v) {
    const x = l.instanceTable.getInstanceByIndex(
      o._instanceRef
    );
    x && x.instanceType === "normal" && (s = !0, await a.log(
      `  Skipping children extraction for normal instance "${o.name || "Unnamed"}" - will be resolved from referenced component`
    ));
  }
  if (!s && e.children && Array.isArray(e.children)) {
    const x = l.maxDepth;
    if (l.depth >= x)
      o.children = {
        _truncated: !0,
        _reason: `Maximum depth (${x}) reached`,
        _count: e.children.length
      };
    else if (l.nodeCount >= i)
      o.children = {
        _truncated: !0,
        _reason: `Maximum node count (${i}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const U = Q(J({}, l), {
        depth: l.depth + 1
      }), I = [];
      let C = !1;
      for (const E of e.children) {
        if (U.nodeCount >= i) {
          o.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: I.length,
            _total: e.children.length,
            children: I
          }, C = !0;
          break;
        }
        const V = await xe(E, t, U);
        I.push(V), U.nodeCount && (l.nodeCount = U.nodeCount);
      }
      C || (o.children = I);
    }
  }
  return o;
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
    const l = r[i], o = l.id;
    if (t.has(o))
      return await a.log(
        `Page "${l.name}" has already been processed, skipping...`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Page already processed",
        data: {}
      };
    t.add(o), await a.log(
      `Selected page: "${l.name}" (index: ${i})`
    ), await a.log(
      "Initializing variable, collection, and instance tables..."
    );
    const f = new Ne(), m = new ve(), u = new Ee();
    await a.log("Extracting node data from page..."), await a.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await a.log(
      "Collections will be discovered as variables are processed:"
    );
    const y = await xe(
      l,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: f,
        collectionTable: m,
        instanceTable: u
      }
    );
    await a.log("Node extraction finished");
    const v = Ve(y), s = f.getSize(), b = m.getSize(), w = u.getSize();
    await a.log("Extraction complete:"), await a.log(`  - Total nodes: ${v}`), await a.log(`  - Unique variables: ${s}`), await a.log(`  - Unique collections: ${b}`), await a.log(`  - Unique instances: ${w}`);
    const A = u.getSerializedTable(), d = /* @__PURE__ */ new Map();
    for (const [g, h] of Object.entries(A))
      if (h.instanceType === "remote") {
        const S = parseInt(g, 10);
        d.set(S, h);
      }
    if (d.size > 0) {
      await a.error(
        `Found ${d.size} remote instance(s) - remote instances are not supported during publishing`
      );
      const g = (T, k, R = [], B = !1) => {
        const D = [];
        if (!T || typeof T != "object")
          return D;
        if (B || T.type === "PAGE") {
          const F = T.children || T.child;
          if (Array.isArray(F))
            for (const j of F)
              j && typeof j == "object" && D.push(
                ...g(
                  j,
                  k,
                  [],
                  !1
                )
              );
          return D;
        }
        const K = T.name || "";
        if (typeof T._instanceRef == "number" && T._instanceRef === k) {
          const F = K || "(unnamed)", j = R.length > 0 ? [...R, F] : [F];
          return D.push({
            path: j,
            nodeName: F
          }), D;
        }
        const W = K ? [...R, K] : R, G = T.children || T.child;
        if (Array.isArray(G))
          for (const F of G)
            F && typeof F == "object" && D.push(
              ...g(
                F,
                k,
                W,
                !1
              )
            );
        return D;
      }, h = [];
      let S = 1;
      for (const [T, k] of d.entries()) {
        const R = k.componentName || "(unnamed)", B = k.componentSetName, D = g(
          y,
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
        const W = B ? `Component: "${R}" (from component set "${B}")` : `Component: "${R}"`, G = k.remoteLibraryName ? `
   Library: ${k.remoteLibraryName}` : "";
        h.push(
          `${S}. ${W}${G}${K}`
        ), S++;
      }
      const N = `Cannot publish: Remote instances are not supported. Please remove all remote instances before publishing.

Found ${d.size} remote instance(s):
${h.join(`

`)}

To fix this:
1. Locate each remote instance component listed above using the path(s) shown
2. Replace it with a local component or remove it
3. Try publishing again`;
      throw await a.error(N), new Error(N);
    }
    if (b > 0) {
      await a.log("Collections found:");
      const g = m.getTable();
      for (const [h, S] of Object.values(g).entries()) {
        const N = S.collectionGuid ? ` (GUID: ${S.collectionGuid.substring(0, 8)}...)` : "";
        await a.log(
          `  ${h}: ${S.collectionName}${N} - ${S.modes.length} mode(s)`
        );
      }
    }
    await a.log("Checking for referenced component pages...");
    const P = [], O = Object.values(A).filter(
      (g) => g.instanceType === "normal"
    );
    if (O.length > 0) {
      await a.log(
        `Found ${O.length} normal instance(s) to check`
      );
      const g = /* @__PURE__ */ new Map();
      for (const h of O)
        if (h.componentPageName) {
          const S = r.find((N) => N.name === h.componentPageName);
          if (S && !t.has(S.id))
            g.has(S.id) || g.set(S.id, S);
          else if (!S) {
            const N = `Normal instance references component "${h.componentName || "(unnamed)"}" on page "${h.componentPageName}", but that page was not found. Cannot export.`;
            throw await a.error(N), new Error(N);
          }
        } else {
          const S = `Normal instance references component "${h.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw await a.error(S), new Error(S);
        }
      await a.log(
        `Found ${g.size} unique referenced page(s)`
      );
      for (const [h, S] of g.entries()) {
        const N = S.name;
        if (t.has(h)) {
          await a.log(`Skipping "${N}" - already processed`);
          continue;
        }
        const T = S.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let k = !1;
        if (T)
          try {
            const B = JSON.parse(T);
            k = !!(B.id && B.version !== void 0);
          } catch (B) {
          }
        const R = `Do you want to also publish referenced component "${N}"?`;
        try {
          await he.prompt(R, {
            okLabel: "Yes",
            cancelLabel: "No",
            timeoutMs: 3e5
            // 5 minutes
          }), await a.log(`Exporting referenced page: "${N}"`);
          const B = r.findIndex(
            (K) => K.id === S.id
          );
          if (B === -1)
            throw await a.error(
              `Could not find page index for "${N}"`
            ), new Error(`Could not find page index for "${N}"`);
          const D = await je(
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
            P.push(K), await a.log(
              `Successfully exported referenced page: "${N}"`
            );
          } else
            throw new Error(
              `Failed to export referenced page "${N}": ${D.message}`
            );
        } catch (B) {
          if (B instanceof Error && B.message === "User cancelled")
            if (k)
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
    const _ = new Me();
    await a.log("Getting page metadata...");
    const x = l.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let U = "", I = 0;
    if (x)
      try {
        const g = JSON.parse(x);
        U = g.id || "", I = g.version || 0;
      } catch (g) {
        await a.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!U) {
      await a.log("Generating new GUID for page..."), U = await ze();
      const g = {
        _ver: 1,
        id: U,
        name: l.name,
        version: I,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      l.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(g)
      );
    }
    await a.log("Creating export data structure...");
    const C = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "1.0.0",
        figmaApiVersion: figma.apiVersion,
        guid: U,
        version: I,
        name: l.name,
        pluginVersion: "1.0.0"
      },
      stringTable: _.getSerializedTable(),
      collections: m.getSerializedTable(),
      variables: f.getSerializedTable(),
      instances: u.getSerializedTable(),
      pageData: y
    };
    await a.log("Compressing JSON data...");
    const E = Zt(C, _);
    await a.log("Serializing to JSON...");
    const V = JSON.stringify(E, null, 2), M = (V.length / 1024).toFixed(2), p = Te(l.name).trim().replace(/\s+/g, "_") + ".figma.json";
    await a.log(`JSON serialization complete: ${M} KB`), await a.log(`Export file: ${p}`), await a.log("=== Export Complete ===");
    const $ = JSON.parse(V);
    return {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: p,
        pageData: $,
        pageName: l.name,
        additionalPages: P
        // Populated with referenced component pages
      }
    };
  } catch (i) {
    const r = i instanceof Error ? i.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", i), console.error("Error message:", r), await a.error(`Export failed: ${r}`), i instanceof Error && i.stack && (console.error("Stack trace:", i.stack), await a.error(`Stack trace: ${i.stack}`));
    const l = {
      type: "exportPage",
      success: !1,
      error: !0,
      message: r,
      data: {}
    };
    return console.error("Returning error response:", l), l;
  }
}
const ea = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  countTotalNodes: Ve,
  exportPage: je,
  extractNodeData: xe
}, Symbol.toStringTag, { value: "Module" })), st = /* @__PURE__ */ new Map();
async function pe(e, t) {
  if (t.length === 0)
    return;
  const n = e.modes.find(
    (i) => i.name === "Mode 1" || i.name === "Default"
  );
  if (n && !t.includes(n.name)) {
    const i = t[0];
    try {
      const r = n.name;
      e.renameMode(n.modeId, i), st.set(`${e.id}:${r}`, i), await a.log(
        `  Renamed default mode "${r}" to "${i}"`
      );
    } catch (r) {
      await a.warning(
        `  Failed to rename default mode "${n.name}" to "${i}": ${r}`
      );
    }
  }
  for (const i of t)
    e.modes.find((l) => l.name === i) || e.addMode(i);
}
const oe = "recursica:collectionId";
async function Se(e) {
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
      oe
    );
    if (n && n.trim() !== "")
      return n;
    const i = await ze();
    return e.setSharedPluginData("recursica", oe, i), i;
  }
}
function ta(e, t) {
  const n = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(n))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function aa(e) {
  let t;
  const n = e.collectionName.trim().toLowerCase(), i = ["token", "tokens", "theme", "themes"], r = e.isLocal;
  if (r === !1 || r === void 0 && i.includes(n))
    try {
      const f = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((m) => m.name.trim().toLowerCase() === n);
      if (f) {
        ta(e.collectionName, !1);
        const m = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          f.key
        );
        if (m.length > 0) {
          const u = await figma.variables.importVariableByKeyAsync(m[0].key), y = await figma.variables.getVariableCollectionByIdAsync(
            u.variableCollectionId
          );
          if (y) {
            if (t = y, e.collectionGuid) {
              const v = t.getSharedPluginData(
                "recursica",
                oe
              );
              (!v || v.trim() === "") && t.setSharedPluginData(
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
    } catch (o) {
      if (r === !1)
        throw new Error(
          `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
        );
      console.log("Could not import external collection, trying local:", o);
    }
  if (r !== !1) {
    const o = await figma.variables.getLocalVariableCollectionsAsync();
    let f;
    if (e.collectionGuid && (f = o.find((m) => m.getSharedPluginData("recursica", oe) === e.collectionGuid)), f || (f = o.find(
      (m) => m.name === e.collectionName
    )), f)
      if (t = f, e.collectionGuid) {
        const m = t.getSharedPluginData(
          "recursica",
          oe
        );
        (!m || m.trim() === "") && t.setSharedPluginData(
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
    const o = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), f = e.collectionName.trim().toLowerCase(), m = o.find((s) => s.name.trim().toLowerCase() === f);
    if (!m)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const u = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      m.key
    );
    if (u.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const y = await figma.variables.importVariableByKeyAsync(
      u[0].key
    ), v = await figma.variables.getVariableCollectionByIdAsync(
      y.variableCollectionId
    );
    if (!v)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (t = v, e.collectionGuid) {
      const s = t.getSharedPluginData(
        "recursica",
        oe
      );
      (!s || s.trim() === "") && t.setSharedPluginData(
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
async function na(e, t, n, i, r) {
  await a.log(
    `Restoring values for variable "${e.name}" (type: ${e.resolvedType}):`
  ), await a.log(
    `  valuesByMode keys: ${Object.keys(t).join(", ")}`
  );
  for (const [l, o] of Object.entries(t)) {
    const f = st.get(`${i.id}:${l}`) || l;
    let m = i.modes.find((y) => y.name === f);
    if (m || (m = i.modes.find((y) => y.name === l)), !m) {
      await a.warning(
        `Mode "${l}" (mapped: "${f}") not found in collection "${i.name}" for variable "${e.name}". Available modes: ${i.modes.map((y) => y.name).join(", ")}. Skipping.`
      );
      continue;
    }
    const u = m.modeId;
    try {
      if (o == null) {
        await a.log(
          `  Mode "${l}": value is null/undefined, skipping`
        );
        continue;
      }
      if (await a.log(
        `  Mode "${l}": value type=${typeof o}, value=${JSON.stringify(o)}`
      ), typeof o == "string" || typeof o == "number" || typeof o == "boolean") {
        e.setValueForMode(u, o);
        continue;
      }
      if (typeof o == "object" && o !== null && "r" in o && "g" in o && "b" in o && typeof o.r == "number" && typeof o.g == "number" && typeof o.b == "number") {
        const y = o, v = {
          r: y.r,
          g: y.g,
          b: y.b
        };
        y.a !== void 0 && (v.a = y.a), e.setValueForMode(u, v);
        const s = e.valuesByMode[u];
        if (await a.log(
          `  Set color value for "${e.name}" mode "${l}": r=${v.r.toFixed(3)}, g=${v.g.toFixed(3)}, b=${v.b.toFixed(3)}${v.a !== void 0 ? `, a=${v.a.toFixed(3)}` : ""}`
        ), await a.log(
          `  Read back value: ${JSON.stringify(s)}`
        ), typeof s == "object" && s !== null && "r" in s && "g" in s && "b" in s) {
          const b = s, w = Math.abs(b.r - v.r) < 1e-3, A = Math.abs(b.g - v.g) < 1e-3, d = Math.abs(b.b - v.b) < 1e-3;
          !w || !A || !d ? await a.warning(
            `  ⚠️ Value mismatch! Set: r=${v.r}, g=${v.g}, b=${v.b}, Read back: r=${b.r}, g=${b.g}, b=${b.b}`
          ) : await a.log(
            "  ✓ Value verified: read-back matches what we set"
          );
        } else
          await a.warning(
            `  ⚠️ Read-back value is not an RGB object: ${JSON.stringify(s)}`
          );
        continue;
      }
      if (typeof o == "object" && o !== null && "_varRef" in o && typeof o._varRef == "number") {
        const y = o;
        let v = null;
        const s = n.getVariableByIndex(
          y._varRef
        );
        if (s) {
          let b = null;
          if (r && s._colRef !== void 0) {
            const w = r.getCollectionByIndex(
              s._colRef
            );
            w && (b = (await aa(w)).collection);
          }
          b && (v = await De(
            b,
            s.variableName
          ));
        }
        if (v) {
          const b = {
            type: "VARIABLE_ALIAS",
            id: v.id
          };
          e.setValueForMode(u, b);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${l}" in variable "${e.name}". Variable reference index: ${y._varRef}`
          );
      }
    } catch (y) {
      typeof o == "object" && o !== null && !("_varRef" in o) && !("r" in o && "g" in o && "b" in o) && await a.warning(
        `Unhandled value type for mode "${l}" in variable "${e.name}": ${JSON.stringify(o)}`
      ), console.warn(
        `Error setting value for mode "${l}" in variable "${e.name}":`,
        y
      );
    }
  }
}
async function Fe(e, t, n, i) {
  if (await a.log(
    `Creating variable "${e.variableName}" (type: ${e.variableType})`
  ), e.valuesByMode) {
    await a.log(
      `  valuesByMode has ${Object.keys(e.valuesByMode).length} mode(s): ${Object.keys(e.valuesByMode).join(", ")}`
    );
    for (const [l, o] of Object.entries(e.valuesByMode))
      await a.log(
        `  Mode "${l}": ${JSON.stringify(o)} (type: ${typeof o})`
      );
  } else
    await a.log(
      `  No valuesByMode found for variable "${e.variableName}"`
    );
  const r = figma.variables.createVariable(
    e.variableName,
    t,
    e.variableType
  );
  if (e.valuesByMode && await na(
    r,
    e.valuesByMode,
    n,
    t,
    // Pass collection to look up modes by name
    i
  ), e.valuesByMode && r.valuesByMode) {
    await a.log(`  Verifying values for "${e.variableName}":`);
    for (const [l, o] of Object.entries(
      e.valuesByMode
    )) {
      const f = t.modes.find((m) => m.name === l);
      if (f) {
        const m = r.valuesByMode[f.modeId];
        await a.log(
          `    Mode "${l}": expected=${JSON.stringify(o)}, actual=${JSON.stringify(m)}`
        );
      }
    }
  }
  return r;
}
async function ia(e, t, n, i) {
  const r = t.getVariableByIndex(e);
  if (!r || r._colRef === void 0)
    return null;
  const l = i.get(String(r._colRef));
  if (!l)
    return null;
  const o = await De(
    l,
    r.variableName
  );
  if (o) {
    let f;
    if (typeof r.variableType == "number" ? f = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[r.variableType] || String(r.variableType) : f = r.variableType, ct(o, f))
      return o;
  }
  return await Fe(
    r,
    l,
    t,
    n
  );
}
async function oa(e, t, n, i) {
  if (!(!t || typeof t != "object"))
    try {
      const r = e[n];
      if (!r || !Array.isArray(r))
        return;
      const l = t[n];
      if (Array.isArray(l))
        for (let o = 0; o < l.length && o < r.length; o++) {
          const f = l[o];
          if (f && typeof f == "object") {
            if (r[o].boundVariables || (r[o].boundVariables = {}), ge(f)) {
              const m = f._varRef;
              if (m !== void 0) {
                const u = i.get(String(m));
                u && (r[o].boundVariables.color = {
                  type: "VARIABLE_ALIAS",
                  id: u.id
                });
              }
            } else
              for (const [m, u] of Object.entries(
                f
              ))
                if (ge(u)) {
                  const y = u._varRef;
                  if (y !== void 0) {
                    const v = i.get(String(y));
                    v && (r[o].boundVariables[m] = {
                      type: "VARIABLE_ALIAS",
                      id: v.id
                    });
                  }
                }
          }
        }
    } catch (r) {
      console.log(`Error restoring bound variables for ${n}:`, r);
    }
}
function ra(e, t, n = !1) {
  const i = St(t);
  if (e.visible === void 0 && (e.visible = i.visible), e.locked === void 0 && (e.locked = i.locked), e.opacity === void 0 && (e.opacity = i.opacity), e.rotation === void 0 && (e.rotation = i.rotation), e.blendMode === void 0 && (e.blendMode = i.blendMode), t === "FRAME" || t === "COMPONENT" || t === "INSTANCE") {
    const r = Y;
    e.layoutMode === void 0 && (e.layoutMode = r.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = r.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = r.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = r.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = r.counterAxisAlignItems), n || (e.paddingLeft === void 0 && (e.paddingLeft = r.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = r.paddingRight), e.paddingTop === void 0 && (e.paddingTop = r.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = r.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = r.itemSpacing), e.counterAxisSpacing === void 0 && (e.counterAxisSpacing = r.counterAxisSpacing));
  }
  if (t === "TEXT") {
    const r = ie;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = r.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = r.textAlignVertical), e.textCase === void 0 && (e.textCase = r.textCase), e.textDecoration === void 0 && (e.textDecoration = r.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = r.textAutoResize);
  }
}
async function be(e, t, n = null, i = null, r = null, l = null, o = null, f = !1, m = null, u = null, y = null, v = null) {
  var I, C, E, V, M, L;
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
      if (e.id && o && o.has(e.id))
        s = o.get(e.id), await a.log(
          `Reusing existing COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id.substring(0, 8)}...)`
        );
      else if (s = figma.createComponent(), await a.log(
        `Created COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id ? e.id.substring(0, 8) + "..." : "no ID"})`
      ), e.componentPropertyDefinitions) {
        const p = e.componentPropertyDefinitions;
        let $ = 0, c = 0;
        for (const [g, h] of Object.entries(p))
          try {
            const S = h.type;
            let N = null;
            if (typeof S == "string" ? (S === "TEXT" || S === "BOOLEAN" || S === "INSTANCE_SWAP" || S === "VARIANT") && (N = S) : typeof S == "number" && (N = {
              2: "TEXT",
              // Text property
              25: "BOOLEAN",
              // Boolean property
              27: "INSTANCE_SWAP",
              // Instance swap property
              26: "VARIANT"
              // Variant property
            }[S] || null), !N) {
              await a.warning(
                `  Unknown property type ${S} (${typeof S}) for property "${g}" in component "${e.name || "Unnamed"}"`
              ), c++;
              continue;
            }
            const T = h.defaultValue, k = g.split("#")[0];
            s.addComponentProperty(
              k,
              N,
              T
            ), $++;
          } catch (S) {
            await a.warning(
              `  Failed to add component property "${g}" to "${e.name || "Unnamed"}": ${S}`
            ), c++;
          }
        $ > 0 && await a.log(
          `  Added ${$} component property definition(s) to "${e.name || "Unnamed"}"${c > 0 ? ` (${c} failed)` : ""}`
        );
      }
      break;
    case "COMPONENT_SET": {
      const p = e.children ? e.children.filter((g) => g.type === "COMPONENT").length : 0;
      await a.log(
        `Creating COMPONENT_SET "${e.name || "Unnamed"}" by combining ${p} component variant(s)`
      );
      const $ = [];
      let c = null;
      if (e.children && Array.isArray(e.children)) {
        c = figma.createFrame(), c.name = `_temp_${e.name || "COMPONENT_SET"}`, c.visible = !1, ((t == null ? void 0 : t.type) === "PAGE" ? t : figma.currentPage).appendChild(c);
        for (const h of e.children)
          if (h.type === "COMPONENT" && !h._truncated)
            try {
              const S = await be(
                h,
                c,
                // Use temp parent for now
                n,
                i,
                r,
                l,
                o,
                f,
                m,
                null,
                // deferredInstances - not needed for component set creation
                null,
                // parentNodeData - not needed here, will be passed correctly in recursive calls
                v
              );
              S && S.type === "COMPONENT" && ($.push(S), await a.log(
                `  Created component variant: "${S.name || "Unnamed"}"`
              ));
            } catch (S) {
              await a.warning(
                `  Failed to create component variant "${h.name || "Unnamed"}": ${S}`
              );
            }
      }
      if ($.length > 0)
        try {
          const g = t || figma.currentPage, h = figma.combineAsVariants(
            $,
            g
          );
          e.name && (h.name = e.name), e.x !== void 0 && (h.x = e.x), e.y !== void 0 && (h.y = e.y), c && c.parent && c.remove(), await a.log(
            `  ✓ Successfully created COMPONENT_SET "${h.name}" with ${$.length} variant(s)`
          ), s = h;
        } catch (g) {
          if (await a.warning(
            `  Failed to combine components into COMPONENT_SET "${e.name || "Unnamed"}": ${g}. Falling back to frame.`
          ), s = figma.createFrame(), e.name && (s.name = e.name), c && c.children.length > 0) {
            for (const h of c.children)
              s.appendChild(h);
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
      if (f)
        s = figma.createFrame(), e.name && (s.name = e.name);
      else if (e._instanceRef !== void 0 && r && o) {
        const p = r.getInstanceByIndex(
          e._instanceRef
        );
        if (p && p.instanceType === "internal")
          if (p.componentNodeId)
            if (p.componentNodeId === e.id)
              await a.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), s = figma.createFrame(), e.name && (s.name = e.name);
            else {
              const $ = o.get(
                p.componentNodeId
              );
              if (!$) {
                const c = Array.from(o.keys()).slice(
                  0,
                  20
                );
                await a.error(
                  `Component not found for internal instance "${e.name}" (ID: ${p.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), await a.error(
                  `Looking for component ID: ${p.componentNodeId}`
                ), await a.error(
                  `Available IDs in mapping (first 20): ${c.map((T) => T.substring(0, 8) + "...").join(", ")}`
                );
                const g = (T, k) => {
                  if (T.type === "COMPONENT" && T.id === k)
                    return !0;
                  if (T.children && Array.isArray(T.children)) {
                    for (const R of T.children)
                      if (!R._truncated && g(R, k))
                        return !0;
                  }
                  return !1;
                }, h = g(
                  e,
                  p.componentNodeId
                );
                await a.error(
                  `Component ID ${p.componentNodeId.substring(0, 8)}... exists in current node tree: ${h}`
                ), await a.error(
                  `WARNING: Component ID ${p.componentNodeId.substring(0, 8)}... not found in nodeIdMapping. This might indicate:`
                ), await a.error(
                  "  1. The component doesn't exist in the pageData (detached component?)"
                ), await a.error(
                  "  2. The component wasn't collected in the first pass"
                ), await a.error(
                  "  3. The component ID in the instance table doesn't match the actual component ID"
                );
                const S = c.filter(
                  (T) => T.startsWith(p.componentNodeId.substring(0, 8))
                );
                S.length > 0 && await a.error(
                  `Found IDs with matching prefix: ${S.map((T) => T.substring(0, 8) + "...").join(", ")}`
                );
                const N = `Component not found for internal instance "${e.name}" (ID: ${p.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${c.map((T) => T.substring(0, 8) + "...").join(", ")}`;
                throw new Error(N);
              }
              if ($ && $.type === "COMPONENT") {
                if (s = $.createInstance(), await a.log(
                  `✓ Created internal instance "${e.name}" from component "${p.componentName}"`
                ), p.variantProperties && Object.keys(p.variantProperties).length > 0)
                  try {
                    let c = null;
                    if ($.parent && $.parent.type === "COMPONENT_SET")
                      c = $.parent.componentPropertyDefinitions, await a.log(
                        `  DEBUG: Component "${p.componentName}" is inside component set "${$.parent.name}" with ${Object.keys(c || {}).length} property definitions`
                      );
                    else {
                      const g = await s.getMainComponentAsync();
                      if (g) {
                        const h = g.type;
                        await a.log(
                          `  DEBUG: Internal instance "${e.name}" - componentNode parent: ${$.parent ? $.parent.type : "N/A"}, mainComponent type: ${h}, mainComponent parent: ${g.parent ? g.parent.type : "N/A"}`
                        ), h === "COMPONENT_SET" ? c = g.componentPropertyDefinitions : h === "COMPONENT" && g.parent && g.parent.type === "COMPONENT_SET" ? (c = g.parent.componentPropertyDefinitions, await a.log(
                          `  DEBUG: Found component set parent "${g.parent.name}" with ${Object.keys(c || {}).length} property definitions`
                        )) : await a.log(
                          `  Skipping variant properties for internal instance "${e.name}" - component "${p.componentName}" is not yet in a COMPONENT_SET (will be moved later during component set creation)`
                        );
                      }
                    }
                    if (c) {
                      const g = {};
                      for (const [h, S] of Object.entries(
                        p.variantProperties
                      )) {
                        const N = h.split("#")[0];
                        c[N] && (g[N] = S);
                      }
                      Object.keys(g).length > 0 && s.setProperties(g);
                    }
                  } catch (c) {
                    const g = `Failed to set variant properties for instance "${e.name}": ${c}`;
                    throw await a.error(g), new Error(g);
                  }
                if (p.componentProperties && Object.keys(p.componentProperties).length > 0)
                  try {
                    const c = await s.getMainComponentAsync();
                    if (c) {
                      let g = null;
                      const h = c.type;
                      if (h === "COMPONENT_SET" ? g = c.componentPropertyDefinitions : h === "COMPONENT" && c.parent && c.parent.type === "COMPONENT_SET" ? g = c.parent.componentPropertyDefinitions : h === "COMPONENT" && (g = c.componentPropertyDefinitions), g)
                        for (const [S, N] of Object.entries(
                          p.componentProperties
                        )) {
                          const T = S.split("#")[0];
                          if (g[T])
                            try {
                              let k = N;
                              N && typeof N == "object" && "value" in N && (k = N.value), s.setProperties({
                                [T]: k
                              });
                            } catch (k) {
                              const R = `Failed to set component property "${T}" for internal instance "${e.name}": ${k}`;
                              throw await a.error(R), new Error(R);
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
              } else if (!s && $) {
                const c = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${p.componentNodeId.substring(0, 8)}...).`;
                throw await a.error(c), new Error(c);
              }
            }
          else {
            const $ = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw await a.error($), new Error($);
          }
        else if (p && p.instanceType === "remote")
          if (m) {
            const $ = m.get(
              e._instanceRef
            );
            if ($) {
              if (s = $.createInstance(), await a.log(
                `✓ Created remote instance "${e.name}" from component "${p.componentName}" on REMOTES page`
              ), p.variantProperties && Object.keys(p.variantProperties).length > 0)
                try {
                  const c = await s.getMainComponentAsync();
                  if (c) {
                    let g = null;
                    const h = c.type;
                    if (h === "COMPONENT_SET" ? g = c.componentPropertyDefinitions : h === "COMPONENT" && c.parent && c.parent.type === "COMPONENT_SET" ? g = c.parent.componentPropertyDefinitions : await a.log(
                      `Skipping variant properties for remote instance "${e.name}" - main component is not a COMPONENT_SET or variant (expected for remote components)`
                    ), g) {
                      const S = {};
                      for (const [N, T] of Object.entries(
                        p.variantProperties
                      )) {
                        const k = N.split("#")[0];
                        g[k] && (S[k] = T);
                      }
                      Object.keys(S).length > 0 && s.setProperties(S);
                    }
                  } else
                    await a.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (c) {
                  const g = `Failed to set variant properties for remote instance "${e.name}": ${c}`;
                  throw await a.error(g), new Error(g);
                }
              if (p.componentProperties && Object.keys(p.componentProperties).length > 0)
                try {
                  const c = await s.getMainComponentAsync();
                  if (c) {
                    let g = null;
                    const h = c.type;
                    if (h === "COMPONENT_SET" ? g = c.componentPropertyDefinitions : h === "COMPONENT" && c.parent && c.parent.type === "COMPONENT_SET" ? g = c.parent.componentPropertyDefinitions : h === "COMPONENT" && (g = c.componentPropertyDefinitions), g)
                      for (const [S, N] of Object.entries(
                        p.componentProperties
                      )) {
                        const T = S.split("#")[0];
                        if (g[T])
                          try {
                            let k = N;
                            N && typeof N == "object" && "value" in N && (k = N.value), s.setProperties({
                              [T]: k
                            });
                          } catch (k) {
                            const R = `Failed to set component property "${T}" for remote instance "${e.name}": ${k}`;
                            throw await a.error(R), new Error(R);
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
            const $ = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw await a.error($), new Error($);
          }
        else if ((p == null ? void 0 : p.instanceType) === "normal") {
          if (!p.componentPageName) {
            const N = `Normal instance "${e.name}" missing componentPageName. Cannot resolve.`;
            throw await a.error(N), new Error(N);
          }
          await figma.loadAllPagesAsync();
          const $ = figma.root.children.find(
            (N) => N.name === p.componentPageName
          );
          if (!$) {
            await a.log(
              `  Deferring normal instance "${e.name}" - referenced page "${p.componentPageName}" does not exist yet (may be circular reference or not yet imported)`
            );
            const N = figma.createFrame();
            N.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (N.x = e.x), e.y !== void 0 && (N.y = e.y), e.width !== void 0 && e.height !== void 0 ? N.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && N.resize(e.w, e.h), u && u.push({
              placeholderFrame: N,
              instanceEntry: p,
              nodeData: e,
              parentNode: t,
              instanceIndex: e._instanceRef
            }), s = N;
            break;
          }
          let c = null;
          const g = (N, T, k, R, B) => {
            if (T.length === 0) {
              let W = null;
              for (const G of N.children || [])
                if (G.type === "COMPONENT") {
                  if (G.name === k)
                    if (W || (W = G), R)
                      try {
                        const F = G.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (F && JSON.parse(F).id === R)
                          return G;
                      } catch (F) {
                      }
                    else
                      return G;
                } else if (G.type === "COMPONENT_SET") {
                  if (B && G.name !== B)
                    continue;
                  for (const F of G.children || [])
                    if (F.type === "COMPONENT" && F.name === k)
                      if (W || (W = F), R)
                        try {
                          const j = F.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (j && JSON.parse(j).id === R)
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
                  for (const G of W.children || [])
                    if (G.type === "COMPONENT" && G.name === k) {
                      if (R)
                        try {
                          const F = G.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (F && JSON.parse(F).id === R)
                            return G;
                        } catch (F) {
                        }
                      return G;
                    }
                  return null;
                }
                return g(
                  W,
                  K,
                  k,
                  R,
                  B
                );
              }
            return null;
          };
          await a.log(
            `  Looking for component "${p.componentName}" on page "${p.componentPageName}"${p.path && p.path.length > 0 ? ` at path [${p.path.join(" → ")}]` : " at page root"}${p.componentGuid ? ` (GUID: ${p.componentGuid.substring(0, 8)}...)` : ""}`
          );
          const h = [], S = (N, T = 0) => {
            const k = "  ".repeat(T);
            if (N.type === "COMPONENT")
              h.push(`${k}COMPONENT: "${N.name}"`);
            else if (N.type === "COMPONENT_SET") {
              h.push(
                `${k}COMPONENT_SET: "${N.name}"`
              );
              for (const R of N.children || [])
                R.type === "COMPONENT" && h.push(
                  `${k}  └─ COMPONENT: "${R.name}"`
                );
            }
            for (const R of N.children || [])
              S(R, T + 1);
          };
          if (S($), h.length > 0 ? await a.log(
            `  Available components on page "${p.componentPageName}":
${h.slice(0, 20).join(`
`)}${h.length > 20 ? `
  ... and ${h.length - 20} more` : ""}`
          ) : await a.warning(
            `  No components found on page "${p.componentPageName}"`
          ), c = g(
            $,
            p.path || [],
            p.componentName,
            p.componentGuid,
            p.componentSetName
          ), c && p.componentGuid)
            try {
              const N = c.getPluginData(
                "RecursicaPublishedMetadata"
              );
              if (N) {
                const T = JSON.parse(N);
                T.id !== p.componentGuid ? await a.warning(
                  `  Found component "${p.componentName}" by name but GUID verification failed (expected ${p.componentGuid.substring(0, 8)}..., got ${T.id ? T.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`
                ) : await a.log(
                  `  Found component "${p.componentName}" with matching GUID ${p.componentGuid.substring(0, 8)}...`
                );
              } else
                await a.warning(
                  `  Found component "${p.componentName}" by name but no metadata found. Using name match as fallback.`
                );
            } catch (N) {
              await a.warning(
                `  Found component "${p.componentName}" by name but GUID verification failed. Using name match as fallback.`
              );
            }
          if (!c) {
            await a.log(
              `  Deferring normal instance "${e.name}" - component "${p.componentName}" not found on page "${p.componentPageName}" (may not be created yet due to circular reference)`
            );
            const N = figma.createFrame();
            N.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (N.x = e.x), e.y !== void 0 && (N.y = e.y), e.width !== void 0 && e.height !== void 0 ? N.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && N.resize(e.w, e.h), u && u.push({
              placeholderFrame: N,
              instanceEntry: p,
              nodeData: e,
              parentNode: t,
              instanceIndex: e._instanceRef
            }), s = N;
            break;
          }
          if (s = c.createInstance(), await a.log(
            `  Created normal instance "${e.name}" from component "${p.componentName}" on page "${p.componentPageName}"`
          ), p.variantProperties && Object.keys(p.variantProperties).length > 0)
            try {
              const N = await s.getMainComponentAsync();
              if (N) {
                let T = null;
                const k = N.type;
                if (k === "COMPONENT_SET" ? T = N.componentPropertyDefinitions : k === "COMPONENT" && N.parent && N.parent.type === "COMPONENT_SET" ? T = N.parent.componentPropertyDefinitions : await a.warning(
                  `Cannot set variant properties for normal instance "${e.name}" - main component is not a COMPONENT_SET or variant`
                ), T) {
                  const R = {};
                  for (const [B, D] of Object.entries(
                    p.variantProperties
                  )) {
                    const K = B.split("#")[0];
                    T[K] && (R[K] = D);
                  }
                  Object.keys(R).length > 0 && s.setProperties(R);
                }
              }
            } catch (N) {
              await a.warning(
                `Failed to set variant properties for normal instance "${e.name}": ${N}`
              );
            }
          if (p.componentProperties && Object.keys(p.componentProperties).length > 0)
            try {
              const N = await s.getMainComponentAsync();
              if (N) {
                let T = null;
                const k = N.type;
                if (k === "COMPONENT_SET" ? T = N.componentPropertyDefinitions : k === "COMPONENT" && N.parent && N.parent.type === "COMPONENT_SET" ? T = N.parent.componentPropertyDefinitions : k === "COMPONENT" && (T = N.componentPropertyDefinitions), T) {
                  const R = {};
                  for (const [B, D] of Object.entries(
                    p.componentProperties
                  )) {
                    const K = B.split("#")[0];
                    let W;
                    if (T[B] ? W = B : T[K] ? W = K : W = Object.keys(T).find(
                      (G) => G.split("#")[0] === K
                    ), W) {
                      const G = D && typeof D == "object" && "value" in D ? D.value : D;
                      R[W] = G;
                    } else
                      await a.warning(
                        `Component property "${K}" (from "${B}") does not exist on component "${p.componentName}" for normal instance "${e.name}". Available properties: ${Object.keys(T).join(", ") || "none"}`
                      );
                  }
                  if (Object.keys(R).length > 0)
                    try {
                      await a.log(
                        `  Attempting to set component properties for normal instance "${e.name}": ${Object.keys(R).join(", ")}`
                      ), await a.log(
                        `  Available component properties: ${Object.keys(T).join(", ")}`
                      ), s.setProperties(R), await a.log(
                        `  ✓ Successfully set component properties for normal instance "${e.name}": ${Object.keys(R).join(", ")}`
                      );
                    } catch (B) {
                      await a.warning(
                        `Failed to set component properties for normal instance "${e.name}": ${B}`
                      ), await a.warning(
                        `  Properties attempted: ${JSON.stringify(R)}`
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
              s.resize(e.width, e.height);
            } catch (N) {
              await a.log(
                `Note: Could not resize normal instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
              );
            }
        } else {
          const $ = `Instance "${e.name}" has unknown or missing instance type: ${(p == null ? void 0 : p.instanceType) || "unknown"}`;
          throw await a.error($), new Error($);
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
  e.id && o && (o.set(e.id, s), s.type === "COMPONENT" && await a.log(
    `  Stored COMPONENT "${e.name || "Unnamed"}" in nodeIdMapping (ID: ${e.id.substring(0, 8)}...)`
  )), e._instanceRef !== void 0 && s.type === "INSTANCE" ? (o._instanceTableMap || (o._instanceTableMap = /* @__PURE__ */ new Map()), o._instanceTableMap.set(
    s.id,
    e._instanceRef
  ), await a.log(
    `  Stored instance table mapping: instance "${s.name}" (ID: ${s.id.substring(0, 8)}...) -> instance table index ${e._instanceRef}`
  )) : s.type === "INSTANCE" && await a.log(
    `  WARNING: Instance "${s.name}" (ID: ${s.id.substring(0, 8)}...) has no _instanceRef in nodeData - will use fallback matching in third pass`
  );
  const b = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.paddingLeft || e.boundVariables.paddingRight || e.boundVariables.paddingTop || e.boundVariables.paddingBottom || e.boundVariables.itemSpacing);
  ra(
    s,
    e.type || "FRAME",
    b
  ), e.name !== void 0 && (s.name = e.name || "Unnamed Node");
  const w = y && y.layoutMode !== void 0 && y.layoutMode !== "NONE", A = t && "layoutMode" in t && t.layoutMode !== "NONE";
  w || A || (e.x !== void 0 && (s.x = e.x), e.y !== void 0 && (s.y = e.y));
  const P = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
  e.type !== "VECTOR" && e.width !== void 0 && e.height !== void 0 && !P && s.resize(e.width, e.height);
  const O = e.boundVariables && typeof e.boundVariables == "object";
  if (e.visible !== void 0 && (s.visible = e.visible), e.locked !== void 0 && (s.locked = e.locked), e.opacity !== void 0 && (!O || !e.boundVariables.opacity) && (s.opacity = e.opacity), e.rotation !== void 0 && (!O || !e.boundVariables.rotation) && (s.rotation = e.rotation), e.blendMode !== void 0 && (!O || !e.boundVariables.blendMode) && (s.blendMode = e.blendMode), e.type !== "INSTANCE") {
    if (e.type === "VECTOR" && e.boundVariables && (await a.log(
      `  DEBUG: VECTOR "${e.name || "Unnamed"}" (ID: ${((I = e.id) == null ? void 0 : I.substring(0, 8)) || "unknown"}...) has boundVariables: ${Object.keys(e.boundVariables).join(", ")}`
    ), e.boundVariables.fills && await a.log(
      `  DEBUG:   boundVariables.fills: ${JSON.stringify(e.boundVariables.fills)}`
    )), e.fills !== void 0)
      try {
        let p = e.fills;
        if (Array.isArray(p) && (p = p.map(($) => {
          if ($ && typeof $ == "object") {
            const c = J({}, $);
            return delete c.boundVariables, c;
          }
          return $;
        })), e.fills && Array.isArray(e.fills) && l) {
          if (e.type === "VECTOR") {
            await a.log(
              `  DEBUG: VECTOR "${e.name || "Unnamed"}" has ${e.fills.length} fill(s)`
            );
            for (let c = 0; c < e.fills.length; c++) {
              const g = e.fills[c];
              if (g && typeof g == "object") {
                const h = g.boundVariables || g.bndVar;
                h ? await a.log(
                  `  DEBUG:   fill[${c}] has boundVariables: ${JSON.stringify(h)}`
                ) : await a.log(
                  `  DEBUG:   fill[${c}] has no boundVariables`
                );
              }
            }
          }
          const $ = [];
          for (let c = 0; c < p.length; c++) {
            const g = p[c], h = e.fills[c];
            if (!h || typeof h != "object") {
              $.push(g);
              continue;
            }
            const S = h.boundVariables || h.bndVar;
            if (!S) {
              $.push(g);
              continue;
            }
            const N = J({}, g);
            N.boundVariables = {};
            for (const [T, k] of Object.entries(S))
              if (e.type === "VECTOR" && await a.log(
                `  DEBUG: Processing fill[${c}].${T} on VECTOR "${s.name || "Unnamed"}": varInfo=${JSON.stringify(k)}`
              ), ge(k)) {
                const R = k._varRef;
                if (R !== void 0) {
                  if (e.type === "VECTOR") {
                    await a.log(
                      `  DEBUG: Looking up variable reference ${R} in recognizedVariables (map has ${l.size} entries)`
                    );
                    const D = Array.from(
                      l.keys()
                    ).slice(0, 10);
                    await a.log(
                      `  DEBUG: Available variable references (first 10): ${D.join(", ")}`
                    );
                    const K = l.has(String(R));
                    if (await a.log(
                      `  DEBUG: Variable reference ${R} ${K ? "found" : "NOT FOUND"} in recognizedVariables`
                    ), !K) {
                      const W = Array.from(
                        l.keys()
                      ).sort((G, F) => parseInt(G) - parseInt(F));
                      await a.log(
                        `  DEBUG: All available variable references: ${W.join(", ")}`
                      );
                    }
                  }
                  let B = l.get(String(R));
                  B || (e.type === "VECTOR" && await a.log(
                    `  DEBUG: Variable ${R} not in recognizedVariables. variableTable=${!!n}, collectionTable=${!!i}, recognizedCollections=${!!v}`
                  ), n && i && v ? (await a.log(
                    `  Variable reference ${R} not in recognizedVariables, attempting to resolve from variable table...`
                  ), B = await ia(
                    R,
                    n,
                    i,
                    v
                  ) || void 0, B ? (l.set(String(R), B), await a.log(
                    `  ✓ Resolved variable ${B.name} from variable table and added to recognizedVariables`
                  )) : await a.warning(
                    `  Failed to resolve variable ${R} from variable table`
                  )) : e.type === "VECTOR" && await a.warning(
                    `  Cannot resolve variable ${R} from table - missing required parameters`
                  )), B ? (N.boundVariables[T] = {
                    type: "VARIABLE_ALIAS",
                    id: B.id
                  }, await a.log(
                    `  ✓ Restored bound variable for fill[${c}].${T} on "${s.name || "Unnamed"}" (${e.type}): variable ${B.name} (ID: ${B.id.substring(0, 8)}...)`
                  )) : await a.warning(
                    `  Variable reference ${R} not found in recognizedVariables for fill[${c}].${T} on "${s.name || "Unnamed"}"`
                  );
                } else
                  e.type === "VECTOR" && await a.warning(
                    `  DEBUG: Variable reference ${R} is undefined for fill[${c}].${T} on VECTOR "${s.name || "Unnamed"}"`
                  );
              } else
                e.type === "VECTOR" && await a.warning(
                  `  DEBUG: fill[${c}].${T} on VECTOR "${s.name || "Unnamed"}" is not a variable reference: ${JSON.stringify(k)}`
                );
            $.push(N);
          }
          s.fills = $, await a.log(
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
  const _ = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.strokeWeight || e.boundVariables.strokeAlign);
  e.strokeWeight !== void 0 ? (!_ || !e.boundVariables.strokeWeight) && (s.strokeWeight = e.strokeWeight) : e.type === "VECTOR" && (e.strokes === void 0 || e.strokes.length === 0) && (!_ || !e.boundVariables.strokeWeight) && (s.strokeWeight = 0), e.strokeAlign !== void 0 && (!_ || !e.boundVariables.strokeAlign) && (s.strokeAlign = e.strokeAlign);
  const x = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.cornerRadius || e.boundVariables.topLeftRadius || e.boundVariables.topRightRadius || e.boundVariables.bottomLeftRadius || e.boundVariables.bottomRightRadius);
  if (e.cornerRadius !== void 0 && (!x || !e.boundVariables.cornerRadius) && (s.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (s.effects = e.effects), e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") {
    if (e.layoutMode !== void 0 && (["NONE", "HORIZONTAL", "VERTICAL"].includes(e.layoutMode) ? s.layoutMode = e.layoutMode : await a.warning(
      `Invalid layoutMode value "${e.layoutMode}" for node "${e.name || "Unnamed"}", skipping layoutMode setting`
    )), e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.boundVariables && l) {
      const $ = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ];
      for (const c of $) {
        const g = e.boundVariables[c];
        if (g && ge(g)) {
          const h = g._varRef;
          if (h !== void 0) {
            const S = l.get(String(h));
            if (S) {
              const N = {
                type: "VARIABLE_ALIAS",
                id: S.id
              };
              s.boundVariables || (s.boundVariables = {});
              const T = s[c], k = (C = s.boundVariables) == null ? void 0 : C[c];
              await a.log(
                `  DEBUG: Attempting to set bound variable for ${c} on "${e.name || "Unnamed"}": current value=${T}, current boundVar=${JSON.stringify(k)}`
              );
              try {
                delete s.boundVariables[c];
              } catch (B) {
              }
              try {
                s.boundVariables[c] = N;
                const B = (E = s.boundVariables) == null ? void 0 : E[c];
                await a.log(
                  `  DEBUG: Immediately after setting ${c} bound variable: ${JSON.stringify(B)}`
                );
              } catch (B) {
                await a.warning(
                  `  Error setting bound variable for ${c}: ${B}`
                );
              }
              const R = (V = s.boundVariables) == null ? void 0 : V[c];
              R && typeof R == "object" && R.type === "VARIABLE_ALIAS" && R.id === S.id ? await a.log(
                `  ✓ Set bound variable for ${c} on "${e.name || "Unnamed"}" (${e.type}): variable ${S.name} (ID: ${S.id.substring(0, 8)}...)`
              ) : await a.warning(
                `  Failed to set bound variable for ${c} on "${e.name || "Unnamed"}" - verification failed. Expected: ${JSON.stringify(N)}, Got: ${JSON.stringify(R)}`
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
      const $ = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ].filter((c) => e.boundVariables[c]);
      $.length > 0 && await a.log(
        `  DEBUG: Node "${e.name || "Unnamed"}" (${e.type}) has bound variables for: ${$.join(", ")}`
      );
    }
    e.paddingLeft !== void 0 && (!p || !e.boundVariables.paddingLeft) && (s.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (!p || !e.boundVariables.paddingRight) && (s.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (!p || !e.boundVariables.paddingTop) && (s.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (!p || !e.boundVariables.paddingBottom) && (s.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (!p || !e.boundVariables.itemSpacing) && s.layoutMode !== void 0 && s.layoutMode !== "NONE" && s.itemSpacing !== e.itemSpacing && (await a.log(
      `  Setting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (late setting)`
    ), s.itemSpacing = e.itemSpacing), e.counterAxisSpacing !== void 0 && (!p || !e.boundVariables.counterAxisSpacing) && s.layoutMode !== void 0 && s.layoutMode !== "NONE" && (s.counterAxisSpacing = e.counterAxisSpacing), e.layoutGrow !== void 0 && (s.layoutGrow = e.layoutGrow);
  }
  if ((e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (s.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (s.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (s.dashPattern = e.dashPattern), e.type === "VECTOR")) {
    if (e.fillGeometry !== void 0)
      try {
        const { normalizeSvgPath: $ } = await Promise.resolve().then(() => jt), c = e.fillGeometry.map((g) => {
          const h = g.data;
          return {
            data: $(h),
            windingRule: g.windingRule || g.windRule || "NONZERO"
          };
        });
        for (let g = 0; g < e.fillGeometry.length; g++) {
          const h = e.fillGeometry[g].data, S = c[g].data;
          h !== S && await a.log(
            `  Normalized path ${g + 1} for "${e.name || "Unnamed"}": ${h.substring(0, 50)}... -> ${S.substring(0, 50)}...`
          );
        }
        s.vectorPaths = c, await a.log(
          `  Set vectorPaths for VECTOR "${e.name || "Unnamed"}" (${c.length} path(s))`
        );
      } catch ($) {
        await a.warning(
          `Error setting vectorPaths for VECTOR "${e.name || "Unnamed"}": ${$}`
        );
      }
    if (e.strokeGeometry !== void 0)
      try {
        s.strokeGeometry = e.strokeGeometry;
      } catch ($) {
        await a.warning(
          `Error setting strokeGeometry for VECTOR "${e.name || "Unnamed"}": ${$}`
        );
      }
    const p = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
    if (e.width !== void 0 && e.height !== void 0 && !p)
      try {
        s.resize(e.width, e.height), await a.log(
          `  Set size for VECTOR "${e.name || "Unnamed"}" to ${e.width}x${e.height}`
        );
      } catch ($) {
        await a.warning(
          `Error setting size for VECTOR "${e.name || "Unnamed"}": ${$}`
        );
      }
  }
  if (e.type === "TEXT" && e.characters !== void 0)
    try {
      if (e.fontName)
        try {
          await figma.loadFontAsync(e.fontName), s.fontName = e.fontName;
        } catch ($) {
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
      } catch ($) {
        console.log("Could not set text characters: " + $);
      }
    }
  if (e.boundVariables && l) {
    const p = [
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "paddingBottom",
      "itemSpacing"
    ];
    for (const [$, c] of Object.entries(
      e.boundVariables
    ))
      if ($ !== "fills" && !p.includes($) && ge(c) && n && l) {
        const g = c._varRef;
        if (g !== void 0) {
          const h = l.get(String(g));
          if (h)
            try {
              const S = {
                type: "VARIABLE_ALIAS",
                id: h.id
              };
              s.boundVariables || (s.boundVariables = {});
              const N = s[$];
              N !== void 0 && s.boundVariables[$] === void 0 && await a.warning(
                `  Property ${$} has direct value ${N} which may prevent bound variable from being set`
              ), s.boundVariables[$] = S;
              const k = (M = s.boundVariables) == null ? void 0 : M[$];
              if (k && typeof k == "object" && k.type === "VARIABLE_ALIAS" && k.id === h.id)
                await a.log(
                  `  ✓ Set bound variable for ${$} on "${e.name || "Unnamed"}" (${e.type}): variable ${h.name} (ID: ${h.id.substring(0, 8)}...)`
                );
              else {
                const R = (L = s.boundVariables) == null ? void 0 : L[$];
                await a.warning(
                  `  Failed to set bound variable for ${$} on "${e.name || "Unnamed"}" - bound variable not persisted. Property value: ${N}, Expected: ${JSON.stringify(S)}, Got: ${JSON.stringify(R)}`
                );
              }
            } catch (S) {
              await a.warning(
                `  Error setting bound variable for ${$} on "${e.name || "Unnamed"}": ${S}`
              );
            }
          else
            await a.warning(
              `  Variable reference ${g} not found in recognizedVariables for ${$} on "${e.name || "Unnamed"}"`
            );
        }
      }
  }
  if (e.boundVariables && l && (e.boundVariables.width || e.boundVariables.height)) {
    const p = e.boundVariables.width, $ = e.boundVariables.height;
    if (p && ge(p)) {
      const c = p._varRef;
      if (c !== void 0) {
        const g = l.get(String(c));
        if (g) {
          const h = {
            type: "VARIABLE_ALIAS",
            id: g.id
          };
          s.boundVariables || (s.boundVariables = {}), s.boundVariables.width = h;
        }
      }
    }
    if ($ && ge($)) {
      const c = $._varRef;
      if (c !== void 0) {
        const g = l.get(String(c));
        if (g) {
          const h = {
            type: "VARIABLE_ALIAS",
            id: g.id
          };
          s.boundVariables || (s.boundVariables = {}), s.boundVariables.height = h;
        }
      }
    }
  }
  const U = e.id && o && o.has(e.id) && s.type === "COMPONENT" && s.children && s.children.length > 0;
  if (e.children && Array.isArray(e.children) && s.type !== "INSTANCE" && !U) {
    const p = (c) => {
      const g = [];
      for (const h of c)
        h._truncated || (h.type === "COMPONENT" ? (g.push(h), h.children && Array.isArray(h.children) && g.push(...p(h.children))) : h.children && Array.isArray(h.children) && g.push(...p(h.children)));
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
    const $ = p(e.children);
    await a.log(
      `  First pass: Creating ${$.length} COMPONENT node(s) (without children)...`
    );
    for (const c of $)
      await a.log(
        `  Collected COMPONENT "${c.name || "Unnamed"}" (ID: ${c.id ? c.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const c of $)
      if (c.id && o && !o.has(c.id)) {
        const g = figma.createComponent();
        if (c.name !== void 0 && (g.name = c.name || "Unnamed Node"), c.componentPropertyDefinitions) {
          const h = c.componentPropertyDefinitions;
          let S = 0, N = 0;
          for (const [T, k] of Object.entries(h))
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
              }[k.type];
              if (!B) {
                await a.warning(
                  `  Unknown property type ${k.type} for property "${T}" in component "${c.name || "Unnamed"}"`
                ), N++;
                continue;
              }
              const D = k.defaultValue, K = T.split("#")[0];
              g.addComponentProperty(
                K,
                B,
                D
              ), S++;
            } catch (R) {
              await a.warning(
                `  Failed to add component property "${T}" to "${c.name || "Unnamed"}" in first pass: ${R}`
              ), N++;
            }
          S > 0 && await a.log(
            `  Added ${S} component property definition(s) to "${c.name || "Unnamed"}" in first pass${N > 0 ? ` (${N} failed)` : ""}`
          );
        }
        o.set(c.id, g), await a.log(
          `  Created COMPONENT "${c.name || "Unnamed"}" (ID: ${c.id.substring(0, 8)}...) in first pass`
        );
      }
    for (const c of e.children) {
      if (c._truncated)
        continue;
      const g = await be(
        c,
        s,
        n,
        i,
        r,
        l,
        o,
        f,
        m,
        null,
        // deferredInstances - not needed for remote structures
        e,
        // parentNodeData - pass the parent's nodeData so children can check for auto-layout
        v
      );
      if (g && g.parent !== s) {
        if (g.parent && typeof g.parent.removeChild == "function")
          try {
            g.parent.removeChild(g);
          } catch (h) {
            await a.warning(
              `Failed to remove child "${g.name || "Unnamed"}" from parent "${g.parent.name || "Unnamed"}": ${h}`
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
      } catch (p) {
        await a.warning(
          `Failed to remove node "${s.name || "Unnamed"}" from parent "${s.parent.name || "Unnamed"}": ${p}`
        );
      }
    t.appendChild(s);
  }
  if ((s.type === "FRAME" || s.type === "COMPONENT" || s.type === "INSTANCE") && e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.itemSpacing !== void 0 && !(e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.itemSpacing)) {
    const $ = s.itemSpacing;
    $ !== e.itemSpacing ? (await a.log(
      `  FINAL FIX: Resetting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (was ${$})`
    ), s.itemSpacing = e.itemSpacing, await a.log(
      `  FINAL FIX: Verified itemSpacing is now ${s.itemSpacing}`
    )) : await a.log(
      `  FINAL CHECK: itemSpacing is already correct (${$}) for "${e.name || "Unnamed"}"`
    );
  }
  return s;
}
async function sa(e, t, n) {
  let i = 0, r = 0, l = 0;
  const o = (m) => {
    const u = [];
    if (m.type === "INSTANCE" && u.push(m), "children" in m && m.children)
      for (const y of m.children)
        u.push(...o(y));
    return u;
  }, f = o(e);
  await a.log(
    `  Found ${f.length} instance(s) to process for variant properties`
  );
  for (const m of f)
    try {
      const u = await m.getMainComponentAsync();
      if (!u) {
        r++;
        continue;
      }
      const y = t.getSerializedTable();
      let v = null, s;
      if (n._instanceTableMap ? (s = n._instanceTableMap.get(
        m.id
      ), s !== void 0 ? (v = y[s], await a.log(
        `  Found instance table index ${s} for instance "${m.name}" (ID: ${m.id.substring(0, 8)}...)`
      )) : await a.log(
        `  No instance table index mapping found for instance "${m.name}" (ID: ${m.id.substring(0, 8)}...), using fallback matching`
      )) : await a.log(
        `  No instance table map found, using fallback matching for instance "${m.name}"`
      ), !v) {
        for (const [w, A] of Object.entries(y))
          if (A.instanceType === "internal" && A.componentNodeId && n.has(A.componentNodeId)) {
            const d = n.get(A.componentNodeId);
            if (d && d.id === u.id) {
              v = A, await a.log(
                `  Matched instance "${m.name}" to instance table entry ${w} by component (less precise)`
              );
              break;
            }
          }
      }
      if (!v) {
        await a.log(
          `  No matching entry found for instance "${m.name}" (main component: ${u.name}, ID: ${u.id.substring(0, 8)}...)`
        ), r++;
        continue;
      }
      if (!v.variantProperties) {
        await a.log(
          `  Instance table entry for "${m.name}" has no variant properties`
        ), r++;
        continue;
      }
      await a.log(
        `  Instance "${m.name}" matched to entry with variant properties: ${JSON.stringify(v.variantProperties)}`
      );
      let b = null;
      if (u.parent && u.parent.type === "COMPONENT_SET" && (b = u.parent.componentPropertyDefinitions), b) {
        const w = {};
        for (const [A, d] of Object.entries(
          v.variantProperties
        )) {
          const P = A.split("#")[0];
          b[P] && (w[P] = d);
        }
        Object.keys(w).length > 0 ? (m.setProperties(w), i++, await a.log(
          `  ✓ Set variant properties on instance "${m.name}": ${JSON.stringify(w)}`
        )) : r++;
      } else
        r++;
    } catch (u) {
      l++, await a.warning(
        `  Failed to set variant properties on instance "${m.name}": ${u}`
      );
    }
  await a.log(
    `  Variant properties set: ${i} processed, ${r} skipped, ${l} errors`
  );
}
async function Xe(e) {
  await figma.loadAllPagesAsync();
  const t = figma.root.children, n = new Set(t.map((l) => l.name));
  if (!n.has(e))
    return e;
  let i = 1, r = `${e}_${i}`;
  for (; n.has(r); )
    i++, r = `${e}_${i}`;
  return r;
}
async function ca(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), n = new Set(t.map((l) => l.name));
  if (!n.has(e))
    return e;
  let i = 1, r = `${e}_${i}`;
  for (; n.has(r); )
    i++, r = `${e}_${i}`;
  return r;
}
async function la(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const l of e.variableIds)
    try {
      const o = await figma.variables.getVariableByIdAsync(l);
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
function ct(e, t) {
  const n = e.resolvedType.toUpperCase(), i = t.toUpperCase();
  return n === i;
}
async function da(e) {
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
function ga(e) {
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
    t = Me.fromTable(e.stringTable);
  } catch (i) {
    return {
      success: !1,
      error: `Failed to load string table: ${i instanceof Error ? i.message : "Unknown error"}`
    };
  }
  const n = Qt(e, t);
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
async function ma(e, t) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), l = e.getTable();
  for (const [o, f] of Object.entries(l)) {
    if (f.isLocal === !1) {
      await a.log(
        `Skipping remote collection: "${f.collectionName}" (index ${o})`
      );
      continue;
    }
    const m = te(f.collectionName), u = t == null ? void 0 : t.get(m);
    if (u) {
      await a.log(
        `✓ Using pre-created collection: "${m}" (index ${o})`
      ), n.set(o, u);
      continue;
    }
    const y = await da(f);
    y.matchType === "recognized" ? (await a.log(
      `✓ Recognized collection by GUID: "${f.collectionName}" (index ${o})`
    ), n.set(o, y.collection)) : y.matchType === "potential" ? (await a.log(
      `? Potential match by name: "${f.collectionName}" (index ${o})`
    ), i.set(o, {
      entry: f,
      collection: y.collection
    })) : (await a.log(
      `✗ No match found for collection: "${f.collectionName}" (index ${o}) - will create new`
    ), r.set(o, f));
  }
  return await a.log(
    `Collection matching complete: ${n.size} recognized, ${i.size} potential matches, ${r.size} to create`
  ), {
    recognizedCollections: n,
    potentialMatches: i,
    collectionsToCreate: r
  };
}
async function fa(e, t, n, i) {
  if (e.size !== 0) {
    if (i) {
      await a.log(
        `Using wizard selections for ${e.size} potential match(es)...`
      );
      for (const [r, { entry: l, collection: o }] of e.entries()) {
        const f = te(
          l.collectionName
        ).toLowerCase();
        let m = !1;
        f === "tokens" || f === "token" ? m = i.tokens === "existing" : f === "theme" || f === "themes" ? m = i.theme === "existing" : (f === "layer" || f === "layers") && (m = i.layers === "existing");
        const u = le(l.collectionName) ? te(l.collectionName) : o.name;
        m ? (await a.log(
          `✓ Wizard selection: Using existing collection "${u}" (index ${r})`
        ), t.set(r, o), await pe(o, l.modes), await a.log(
          `  ✓ Ensured modes for collection "${u}" (${l.modes.length} mode(s))`
        )) : (await a.log(
          `✗ Wizard selection: Will create new collection for "${l.collectionName}" (index ${r})`
        ), n.set(r, l));
      }
      return;
    }
    await a.log(
      `Prompting user for ${e.size} potential match(es)...`
    );
    for (const [r, { entry: l, collection: o }] of e.entries())
      try {
        const f = le(l.collectionName) ? te(l.collectionName) : o.name, m = `Found existing "${f}" variable collection. Should I use it?`;
        await a.log(
          `Prompting user about potential match: "${f}"`
        ), await he.prompt(m, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await a.log(
          `✓ User confirmed: Using existing collection "${f}" (index ${r})`
        ), t.set(r, o), await pe(o, l.modes), await a.log(
          `  ✓ Ensured modes for collection "${f}" (${l.modes.length} mode(s))`
        );
      } catch (f) {
        await a.log(
          `✗ User rejected: Will create new collection for "${l.collectionName}" (index ${r})`
        ), n.set(r, l);
      }
  }
}
async function ua(e, t, n) {
  if (e.size === 0)
    return;
  await a.log("Ensuring modes exist for recognized collections...");
  const i = t.getTable();
  for (const [r, l] of e.entries()) {
    const o = i[r];
    o && (n.has(r) || (await pe(l, o.modes), await a.log(
      `  ✓ Ensured modes for collection "${l.name}" (${o.modes.length} mode(s))`
    )));
  }
}
async function ya(e, t, n, i) {
  if (e.size !== 0) {
    await a.log(
      `Processing ${e.size} collection(s) to create...`
    );
    for (const [r, l] of e.entries()) {
      const o = te(l.collectionName), f = i == null ? void 0 : i.get(o);
      if (f) {
        await a.log(
          `Reusing pre-created collection: "${o}" (index ${r}, id: ${f.id.substring(0, 8)}...)`
        ), t.set(r, f), await pe(f, l.modes), n.push(f);
        continue;
      }
      const m = await ca(o);
      m !== o ? await a.log(
        `Creating collection: "${m}" (normalized: "${o}" - name conflict resolved)`
      ) : await a.log(`Creating collection: "${m}"`);
      const u = figma.variables.createVariableCollection(m);
      n.push(u);
      let y;
      if (le(l.collectionName)) {
        const v = Oe(l.collectionName);
        v && (y = v);
      } else l.collectionGuid && (y = l.collectionGuid);
      y && (u.setSharedPluginData(
        "recursica",
        oe,
        y
      ), await a.log(
        `  Stored GUID: ${y.substring(0, 8)}...`
      )), await pe(u, l.modes), await a.log(
        `  ✓ Created collection "${m}" with ${l.modes.length} mode(s)`
      ), t.set(r, u);
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
async function ba(e, t, n, i) {
  const r = /* @__PURE__ */ new Map(), l = [], o = new Set(
    i.map((v) => v.id)
  );
  await a.log("Matching and creating variables in collections...");
  const f = e.getTable(), m = /* @__PURE__ */ new Map();
  for (const [v, s] of Object.entries(f)) {
    if (s._colRef === void 0)
      continue;
    const b = n.get(String(s._colRef));
    if (!b)
      continue;
    m.has(b.id) || m.set(b.id, {
      collectionName: b.name,
      existing: 0,
      created: 0
    });
    const w = m.get(b.id), A = o.has(
      b.id
    );
    let d;
    typeof s.variableType == "number" ? d = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[s.variableType] || String(s.variableType) : d = s.variableType;
    const P = await De(
      b,
      s.variableName
    );
    if (P)
      if (ct(P, d))
        r.set(v, P), w.existing++;
      else {
        await a.warning(
          `Type mismatch for variable "${s.variableName}" in collection "${b.name}": expected ${d}, found ${P.resolvedType}. Creating new variable with incremented name.`
        );
        const O = await la(
          b,
          s.variableName
        ), _ = await Fe(
          Q(J({}, s), {
            variableName: O,
            variableType: d
          }),
          b,
          e,
          t
        );
        A || l.push(_), r.set(v, _), w.created++;
      }
    else {
      const O = await Fe(
        Q(J({}, s), {
          variableType: d
        }),
        b,
        e,
        t
      );
      A || l.push(O), r.set(v, O), w.created++;
    }
  }
  await a.log("Variable processing complete:");
  for (const v of m.values())
    await a.log(
      `  "${v.collectionName}": ${v.existing} existing, ${v.created} created`
    );
  await a.log(
    "Final verification: Reading back all COLOR variables..."
  );
  let u = 0, y = 0;
  for (const v of l)
    if (v.resolvedType === "COLOR") {
      const s = await figma.variables.getVariableCollectionByIdAsync(
        v.variableCollectionId
      );
      if (!s) {
        await a.warning(
          `  ⚠️ Variable "${v.name}" has no variableCollection (ID: ${v.variableCollectionId})`
        );
        continue;
      }
      const b = s.modes;
      if (!b || b.length === 0) {
        await a.warning(
          `  ⚠️ Variable "${v.name}" collection has no modes`
        );
        continue;
      }
      for (const w of b) {
        const A = v.valuesByMode[w.modeId];
        if (A && typeof A == "object" && "r" in A) {
          const d = A;
          Math.abs(d.r - 1) < 0.01 && Math.abs(d.g - 1) < 0.01 && Math.abs(d.b - 1) < 0.01 ? (y++, await a.warning(
            `  ⚠️ Variable "${v.name}" mode "${w.name}" is WHITE: r=${d.r.toFixed(3)}, g=${d.g.toFixed(3)}, b=${d.b.toFixed(3)}`
          )) : (u++, await a.log(
            `  ✓ Variable "${v.name}" mode "${w.name}" has color: r=${d.r.toFixed(3)}, g=${d.g.toFixed(3)}, b=${d.b.toFixed(3)}`
          ));
        } else A && typeof A == "object" && "type" in A || await a.warning(
          `  ⚠️ Variable "${v.name}" mode "${w.name}" has unexpected value type: ${JSON.stringify(A)}`
        );
      }
    }
  return await a.log(
    `Final verification complete: ${u} color variables verified, ${y} white variables found`
  ), {
    recognizedVariables: r,
    newlyCreatedVariables: l
  };
}
function wa(e) {
  if (!e.instances)
    return null;
  try {
    return Ee.fromTable(e.instances);
  } catch (t) {
    return null;
  }
}
function $a(e) {
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
  e.type !== void 0 && (e.type = $a(e.type));
  const t = e.children !== void 0 ? "children" : e.child !== void 0 ? "child" : null;
  if (t && (t === "child" && !e.children && (e.children = e.child, delete e.child), Array.isArray(e.children)))
    for (const n of e.children)
      We(n);
  e.fillG !== void 0 && e.fillGeometry === void 0 && (e.fillGeometry = e.fillG, delete e.fillG), e.strkG !== void 0 && e.strokeGeometry === void 0 && (e.strokeGeometry = e.strkG, delete e.strkG), e.child && !e.children && (e.children = e.child, delete e.child);
}
async function va(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const l of e.children)
    (l.type === "FRAME" || l.type === "COMPONENT") && n.add(l.name);
  if (!n.has(t))
    return t;
  let i = 1, r = `${t}_${i}`;
  for (; n.has(r); )
    i++, r = `${t}_${i}`;
  return r;
}
async function Na(e, t, n, i, r, l = "") {
  var w;
  const o = e.getSerializedTable(), f = Object.values(o).filter(
    (A) => A.instanceType === "remote"
  ), m = /* @__PURE__ */ new Map();
  if (f.length === 0)
    return await a.log("No remote instances found"), m;
  await a.log(
    `Processing ${f.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  const u = figma.root.children, y = l ? `${l} REMOTES` : "REMOTES";
  let v = u.find(
    (A) => A.name === "REMOTES" || A.name === y
  );
  if (v ? (await a.log("Found existing REMOTES page"), l && !v.name.startsWith(l) && (v.name = y)) : (v = figma.createPage(), v.name = y, await a.log("Created REMOTES page")), f.length > 0 && (v.setPluginData("RecursicaUnderReview", "true"), await a.log("Marked REMOTES page as under review")), !v.children.some(
    (A) => A.type === "FRAME" && A.name === "Title"
  )) {
    const A = { family: "Inter", style: "Bold" }, d = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(A), await figma.loadFontAsync(d);
    const P = figma.createFrame();
    P.name = "Title", P.layoutMode = "VERTICAL", P.paddingTop = 20, P.paddingBottom = 20, P.paddingLeft = 20, P.paddingRight = 20, P.fills = [];
    const O = figma.createText();
    O.fontName = A, O.characters = "REMOTE INSTANCES", O.fontSize = 24, O.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], P.appendChild(O);
    const _ = figma.createText();
    _.fontName = d, _.characters = "These are remotely connected component instances found in our different component pages.", _.fontSize = 14, _.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], P.appendChild(_), v.appendChild(P), await a.log("Created title and description on REMOTES page");
  }
  const b = /* @__PURE__ */ new Map();
  for (const [A, d] of Object.entries(o)) {
    if (d.instanceType !== "remote")
      continue;
    const P = parseInt(A, 10);
    if (await a.log(
      `Processing remote instance ${P}: "${d.componentName}"`
    ), !d.structure) {
      await a.warning(
        `Remote instance "${d.componentName}" missing structure data, skipping`
      );
      continue;
    }
    We(d.structure);
    const O = d.structure.children !== void 0, _ = d.structure.child !== void 0, x = d.structure.children ? d.structure.children.length : d.structure.child ? d.structure.child.length : 0;
    await a.log(
      `  Structure type: ${d.structure.type || "unknown"}, has children: ${x} (children key: ${O}, child key: ${_})`
    );
    let U = d.componentName;
    if (d.path && d.path.length > 0) {
      const C = d.path.filter((E) => E !== "").join(" / ");
      C && (U = `${C} / ${d.componentName}`);
    }
    const I = await va(
      v,
      U
    );
    I !== U && await a.log(
      `Component name conflict: "${U}" -> "${I}"`
    );
    try {
      if (d.structure.type !== "COMPONENT") {
        await a.warning(
          `Remote instance "${d.componentName}" structure is not a COMPONENT (type: ${d.structure.type}), creating frame fallback`
        );
        const E = figma.createFrame();
        E.name = I;
        const V = await be(
          d.structure,
          E,
          t,
          n,
          null,
          i,
          b,
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
        V ? (E.appendChild(V), v.appendChild(E), await a.log(
          `✓ Created remote instance frame fallback: "${I}"`
        )) : E.remove();
        continue;
      }
      const C = figma.createComponent();
      C.name = I, v.appendChild(C), await a.log(
        `  Created component node: "${I}"`
      );
      try {
        if (d.structure.componentPropertyDefinitions) {
          const c = d.structure.componentPropertyDefinitions;
          let g = 0, h = 0;
          for (const [S, N] of Object.entries(c))
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
              }[N.type];
              if (!k) {
                await a.warning(
                  `  Unknown property type ${N.type} for property "${S}" in component "${d.componentName}"`
                ), h++;
                continue;
              }
              const R = N.defaultValue, B = S.split("#")[0];
              C.addComponentProperty(
                B,
                k,
                R
              ), g++;
            } catch (T) {
              await a.warning(
                `  Failed to add component property "${S}" to "${d.componentName}": ${T}`
              ), h++;
            }
          g > 0 && await a.log(
            `  Added ${g} component property definition(s) to "${d.componentName}"${h > 0 ? ` (${h} failed)` : ""}`
          );
        }
        d.structure.name !== void 0 && (C.name = d.structure.name);
        const E = d.structure.boundVariables && typeof d.structure.boundVariables == "object" && (d.structure.boundVariables.width || d.structure.boundVariables.height);
        d.structure.width !== void 0 && d.structure.height !== void 0 && !E && C.resize(d.structure.width, d.structure.height), d.structure.x !== void 0 && (C.x = d.structure.x), d.structure.y !== void 0 && (C.y = d.structure.y);
        const V = d.structure.boundVariables && typeof d.structure.boundVariables == "object";
        if (d.structure.visible !== void 0 && (C.visible = d.structure.visible), d.structure.opacity !== void 0 && (!V || !d.structure.boundVariables.opacity) && (C.opacity = d.structure.opacity), d.structure.rotation !== void 0 && (!V || !d.structure.boundVariables.rotation) && (C.rotation = d.structure.rotation), d.structure.blendMode !== void 0 && (!V || !d.structure.boundVariables.blendMode) && (C.blendMode = d.structure.blendMode), d.structure.fills !== void 0)
          try {
            let c = d.structure.fills;
            Array.isArray(c) && (c = c.map((g) => {
              if (g && typeof g == "object") {
                const h = J({}, g);
                return delete h.boundVariables, h;
              }
              return g;
            })), C.fills = c, (w = d.structure.boundVariables) != null && w.fills && i && await oa(
              C,
              d.structure.boundVariables,
              "fills",
              i
            );
          } catch (c) {
            await a.warning(
              `Error setting fills for remote component "${d.componentName}": ${c}`
            );
          }
        if (d.structure.strokes !== void 0)
          try {
            C.strokes = d.structure.strokes;
          } catch (c) {
            await a.warning(
              `Error setting strokes for remote component "${d.componentName}": ${c}`
            );
          }
        const M = d.structure.boundVariables && typeof d.structure.boundVariables == "object" && (d.structure.boundVariables.strokeWeight || d.structure.boundVariables.strokeAlign);
        d.structure.strokeWeight !== void 0 && (!M || !d.structure.boundVariables.strokeWeight) && (C.strokeWeight = d.structure.strokeWeight), d.structure.strokeAlign !== void 0 && (!M || !d.structure.boundVariables.strokeAlign) && (C.strokeAlign = d.structure.strokeAlign), d.structure.layoutMode !== void 0 && (C.layoutMode = d.structure.layoutMode), d.structure.primaryAxisSizingMode !== void 0 && (C.primaryAxisSizingMode = d.structure.primaryAxisSizingMode), d.structure.counterAxisSizingMode !== void 0 && (C.counterAxisSizingMode = d.structure.counterAxisSizingMode);
        const L = d.structure.boundVariables && typeof d.structure.boundVariables == "object";
        d.structure.paddingLeft !== void 0 && (!L || !d.structure.boundVariables.paddingLeft) && (C.paddingLeft = d.structure.paddingLeft), d.structure.paddingRight !== void 0 && (!L || !d.structure.boundVariables.paddingRight) && (C.paddingRight = d.structure.paddingRight), d.structure.paddingTop !== void 0 && (!L || !d.structure.boundVariables.paddingTop) && (C.paddingTop = d.structure.paddingTop), d.structure.paddingBottom !== void 0 && (!L || !d.structure.boundVariables.paddingBottom) && (C.paddingBottom = d.structure.paddingBottom), d.structure.itemSpacing !== void 0 && (!L || !d.structure.boundVariables.itemSpacing) && (C.itemSpacing = d.structure.itemSpacing);
        const p = d.structure.boundVariables && typeof d.structure.boundVariables == "object" && (d.structure.boundVariables.cornerRadius || d.structure.boundVariables.topLeftRadius || d.structure.boundVariables.topRightRadius || d.structure.boundVariables.bottomLeftRadius || d.structure.boundVariables.bottomRightRadius);
        if (d.structure.cornerRadius !== void 0 && (!p || !d.structure.boundVariables.cornerRadius) && (C.cornerRadius = d.structure.cornerRadius), d.structure.boundVariables && i) {
          const c = d.structure.boundVariables, g = [
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
          for (const h of g)
            if (c[h] && ge(c[h])) {
              const S = c[h]._varRef;
              if (S !== void 0) {
                const N = i.get(String(S));
                if (N) {
                  const T = {
                    type: "VARIABLE_ALIAS",
                    id: N.id
                  };
                  C.boundVariables || (C.boundVariables = {}), C.boundVariables[h] = T;
                }
              }
            }
        }
        await a.log(
          `  DEBUG: Structure keys: ${Object.keys(d.structure).join(", ")}, has children: ${!!d.structure.children}, has child: ${!!d.structure.child}`
        );
        const $ = d.structure.children || (d.structure.child ? d.structure.child : null);
        if (await a.log(
          `  DEBUG: childrenArray exists: ${!!$}, isArray: ${Array.isArray($)}, length: ${$ ? $.length : 0}`
        ), $ && Array.isArray($) && $.length > 0) {
          await a.log(
            `  Recreating ${$.length} child(ren) for component "${d.componentName}"`
          );
          for (let c = 0; c < $.length; c++) {
            const g = $[c];
            if (await a.log(
              `  DEBUG: Processing child ${c + 1}/${$.length}: ${JSON.stringify({ name: g == null ? void 0 : g.name, type: g == null ? void 0 : g.type, hasTruncated: !!(g != null && g._truncated) })}`
            ), g._truncated) {
              await a.log(
                `  Skipping truncated child: ${g._reason || "Unknown"}`
              );
              continue;
            }
            await a.log(
              `  Recreating child: "${g.name || "Unnamed"}" (type: ${g.type})`
            );
            const h = await be(
              g,
              C,
              t,
              n,
              null,
              i,
              b,
              !0,
              // isRemoteStructure: true
              null,
              // remoteComponentMap - not needed here
              null,
              // deferredInstances - not needed for remote instances
              d.structure,
              // parentNodeData - pass the component's structure so children can check for auto-layout
              r
            );
            h ? (C.appendChild(h), await a.log(
              `  ✓ Appended child "${g.name || "Unnamed"}" to component "${d.componentName}"`
            )) : await a.warning(
              `  ✗ Failed to create child "${g.name || "Unnamed"}" (type: ${g.type})`
            );
          }
        }
        m.set(P, C), await a.log(
          `✓ Created remote component: "${I}" (index ${P})`
        );
      } catch (E) {
        await a.warning(
          `Error populating remote component "${d.componentName}": ${E instanceof Error ? E.message : "Unknown error"}`
        ), C.remove();
      }
    } catch (C) {
      await a.warning(
        `Error recreating remote instance "${d.componentName}": ${C instanceof Error ? C.message : "Unknown error"}`
      );
    }
  }
  return await a.log(
    `Remote instance processing complete: ${m.size} component(s) created`
  ), m;
}
async function Ea(e, t, n, i, r, l, o = null, f = null, m = !1, u = null, y = !1, v = !1, s = "") {
  await a.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const b = figma.root.children, w = "RecursicaPublishedMetadata";
  let A = null;
  for (const V of b) {
    const M = V.getPluginData(w);
    if (M)
      try {
        if (JSON.parse(M).id === e.guid) {
          A = V;
          break;
        }
      } catch (L) {
        continue;
      }
  }
  let d = !1;
  if (A && !m && !y) {
    let V;
    try {
      const p = A.getPluginData(w);
      p && (V = JSON.parse(p).version);
    } catch (p) {
    }
    const M = V !== void 0 ? ` v${V}` : "", L = `Found existing component "${A.name}${M}". Should I use it or create a copy?`;
    await a.log(
      `Found existing page with same GUID: "${A.name}". Prompting user...`
    );
    try {
      await he.prompt(L, {
        okLabel: "Use",
        cancelLabel: "Copy",
        timeoutMs: 3e5
        // 5 minutes
      }), d = !0, await a.log(
        `User chose to use existing page: "${A.name}"`
      );
    } catch (p) {
      await a.log(
        "User chose to create a copy. Will create new page."
      );
    }
  }
  if (d && A)
    return await figma.setCurrentPageAsync(A), await a.log(
      `Using existing page: "${A.name}" (GUID: ${e.guid.substring(0, 8)}...)`
    ), await a.log(
      `  Instances from other pages will resolve to components on this existing page using componentPageName: "${A.name}"`
    ), {
      success: !0,
      page: A,
      // Include pageId so it can be tracked in importedPages
      pageId: A.id
    };
  const P = b.find((V) => V.name === e.name);
  P && await a.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let O;
  if (A || P) {
    const V = `__${e.name}`;
    O = await Xe(V), await a.log(
      `Creating scratch page: "${O}" (will be renamed to "${e.name}" on success)`
    );
  } else
    O = e.name, await a.log(`Creating page: "${O}"`);
  const _ = figma.createPage();
  if (_.name = O, await figma.setCurrentPageAsync(_), await a.log(`Switched to page: "${O}"`), !t.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await a.log("Recreating page structure...");
  const x = t.pageData;
  if (x.backgrounds !== void 0)
    try {
      _.backgrounds = x.backgrounds, await a.log(
        `Set page background: ${JSON.stringify(x.backgrounds)}`
      );
    } catch (V) {
      await a.warning(`Failed to set page background: ${V}`);
    }
  We(x);
  const U = /* @__PURE__ */ new Map(), I = (V, M = []) => {
    if (V.type === "COMPONENT" && V.id && M.push(V.id), V.children && Array.isArray(V.children))
      for (const L of V.children)
        L._truncated || I(L, M);
    return M;
  }, C = I(x);
  if (await a.log(
    `Found ${C.length} COMPONENT node(s) in page data`
  ), C.length > 0 && (await a.log(
    `Component IDs in page data (first 20): ${C.slice(0, 20).map((V) => V.substring(0, 8) + "...").join(", ")}`
  ), x._allComponentIds = C), x.children && Array.isArray(x.children))
    for (const V of x.children) {
      const M = await be(
        V,
        _,
        n,
        i,
        r,
        l,
        U,
        !1,
        // isRemoteStructure: false - we're creating the main page
        o,
        f,
        x,
        // parentNodeData - pass the page's nodeData so children can check for auto-layout
        u
      );
      M && _.appendChild(M);
    }
  await a.log("Page structure recreated successfully"), r && (await a.log(
    "Third pass: Setting variant properties on instances..."
  ), await sa(
    _,
    r,
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
  if (_.setPluginData(w, JSON.stringify(E)), await a.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), O.startsWith("__")) {
    let V;
    v ? V = s ? `${s} ${e.name}` : e.name : V = await Xe(e.name), _.name = V, await a.log(`Renamed page from "${O}" to "${V}"`);
  } else v && s && (_.name.startsWith(s) || (_.name = `${s} ${_.name}`));
  return {
    success: !0,
    page: _
  };
}
async function lt(e) {
  var i, r, l;
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
    const f = ga(o);
    if (!f.success)
      return await a.error(f.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: f.error,
        data: {}
      };
    const m = f.metadata;
    await a.log(
      `Metadata validated: guid=${m.guid}, name=${m.name}`
    ), await a.log("Loading string table...");
    const u = Je(o);
    if (!u.success)
      return await a.error(u.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: u.error,
        data: {}
      };
    await a.log("String table loaded successfully"), await a.log("Expanding JSON data...");
    const y = u.expandedJsonData;
    await a.log("JSON expanded successfully"), await a.log("Loading collections table...");
    const v = pa(y);
    if (!v.success)
      return v.error === "No collections table found in JSON" ? (await a.log(v.error), await a.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: m.name }
      }) : (await a.error(v.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: v.error,
        data: {}
      });
    const s = v.collectionTable;
    await a.log(
      `Loaded collections table with ${s.getSize()} collection(s)`
    ), await a.log(
      "Matching collections with existing local collections..."
    );
    const { recognizedCollections: b, potentialMatches: w, collectionsToCreate: A } = await ma(s, e.preCreatedCollections);
    await fa(
      w,
      b,
      A,
      e.collectionChoices
    ), await ua(
      b,
      s,
      w
    ), await ya(
      A,
      b,
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
        data: { pageName: m.name }
      }) : (await a.error(d.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: d.error,
        data: {}
      });
    const P = d.variableTable;
    await a.log(
      `Loaded variables table with ${P.getSize()} variable(s)`
    );
    const { recognizedVariables: O, newlyCreatedVariables: _ } = await ba(
      P,
      s,
      b,
      n
    );
    await a.log("Loading instance table...");
    const x = wa(y);
    if (x) {
      const h = x.getSerializedTable(), S = Object.values(h).filter(
        (T) => T.instanceType === "internal"
      ), N = Object.values(h).filter(
        (T) => T.instanceType === "remote"
      );
      await a.log(
        `Loaded instance table with ${x.getSize()} instance(s) (${S.length} internal, ${N.length} remote)`
      );
    } else
      await a.log("No instance table found in JSON");
    const U = [], I = (i = e.isMainPage) != null ? i : !0, C = (r = e.alwaysCreateCopy) != null ? r : !1, E = (l = e.skipUniqueNaming) != null ? l : !1, V = e.constructionIcon || "";
    let M = null;
    x && (M = await Na(
      x,
      P,
      s,
      O,
      b,
      V
    ));
    const L = await Ea(
      m,
      y,
      P,
      s,
      x,
      O,
      M,
      U,
      I,
      b,
      C,
      E,
      V
    );
    if (!L.success)
      return await a.error(L.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: L.error,
        data: {}
      };
    const p = L.page, $ = O.size + _.length, c = U.length;
    await a.log("=== Import Complete ==="), await a.log(
      `Successfully processed ${b.size} collection(s), ${$} variable(s), and created page "${p.name}"${c > 0 ? ` (${c} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`
    );
    const g = L.pageId || p.id;
    return {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: {
        pageName: p.name,
        pageId: g,
        // Include pageId for tracking (used for both new and reused pages)
        deferredInstances: c > 0 ? U : void 0,
        createdEntities: {
          pageIds: [p.id],
          collectionIds: n.map((h) => h.id),
          variableIds: _.map((h) => h.id)
        }
      }
    };
  } catch (o) {
    const f = o instanceof Error ? o.message : "Unknown error occurred";
    return await a.error(`Import failed: ${f}`), o instanceof Error && o.stack && await a.error(`Stack trace: ${o.stack}`), console.error("Error importing page:", o), {
      type: "importPage",
      success: !1,
      error: !0,
      message: f,
      data: {}
    };
  }
}
async function dt(e) {
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
      const { placeholderFrame: l, instanceEntry: o, nodeData: f, parentNode: m } = r, u = figma.root.children.find(
        (w) => w.name === o.componentPageName
      );
      if (!u) {
        const w = `Deferred instance "${f.name}" still cannot find referenced page "${o.componentPageName}"`;
        await a.error(w), i.push(w), n++;
        continue;
      }
      const y = (w, A, d, P, O) => {
        if (A.length === 0) {
          let U = null;
          for (const I of w.children || [])
            if (I.type === "COMPONENT") {
              if (I.name === d)
                if (U || (U = I), P)
                  try {
                    const C = I.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (C && JSON.parse(C).id === P)
                      return I;
                  } catch (C) {
                  }
                else
                  return I;
            } else if (I.type === "COMPONENT_SET") {
              if (O && I.name !== O)
                continue;
              for (const C of I.children || [])
                if (C.type === "COMPONENT" && C.name === d)
                  if (U || (U = C), P)
                    try {
                      const E = C.getPluginData(
                        "RecursicaPublishedMetadata"
                      );
                      if (E && JSON.parse(E).id === P)
                        return C;
                    } catch (E) {
                    }
                  else
                    return C;
            }
          return U;
        }
        const [_, ...x] = A;
        for (const U of w.children || [])
          if (U.name === _) {
            if (x.length === 0 && U.type === "COMPONENT_SET") {
              if (O && U.name !== O)
                continue;
              for (const I of U.children || [])
                if (I.type === "COMPONENT" && I.name === d) {
                  if (P)
                    try {
                      const C = I.getPluginData(
                        "RecursicaPublishedMetadata"
                      );
                      if (C && JSON.parse(C).id === P)
                        return I;
                    } catch (C) {
                    }
                  return I;
                }
              return null;
            }
            return y(
              U,
              x,
              d,
              P,
              O
            );
          }
        return null;
      }, v = y(
        u,
        o.path || [],
        o.componentName,
        o.componentGuid,
        o.componentSetName
      );
      if (!v) {
        const w = o.path && o.path.length > 0 ? ` at path [${o.path.join(" → ")}]` : " at page root", A = `Deferred instance "${f.name}" still cannot find component "${o.componentName}" on page "${o.componentPageName}"${w}`;
        await a.error(A), i.push(A), n++;
        continue;
      }
      const s = v.createInstance();
      if (s.name = f.name || l.name.replace("[Deferred: ", "").replace("]", ""), s.x = l.x, s.y = l.y, l.width !== void 0 && l.height !== void 0 && s.resize(l.width, l.height), o.variantProperties && Object.keys(o.variantProperties).length > 0)
        try {
          const w = await s.getMainComponentAsync();
          if (w) {
            let A = null;
            const d = w.type;
            if (d === "COMPONENT_SET" ? A = w.componentPropertyDefinitions : d === "COMPONENT" && w.parent && w.parent.type === "COMPONENT_SET" ? A = w.parent.componentPropertyDefinitions : await a.warning(
              `Cannot set variant properties for resolved instance "${f.name}" - main component is not a COMPONENT_SET or variant`
            ), A) {
              const P = {};
              for (const [O, _] of Object.entries(
                o.variantProperties
              )) {
                const x = O.split("#")[0];
                A[x] && (P[x] = _);
              }
              Object.keys(P).length > 0 && s.setProperties(P);
            }
          }
        } catch (w) {
          await a.warning(
            `Failed to set variant properties for resolved instance "${f.name}": ${w}`
          );
        }
      if (o.componentProperties && Object.keys(o.componentProperties).length > 0)
        try {
          const w = await s.getMainComponentAsync();
          if (w) {
            let A = null;
            const d = w.type;
            if (d === "COMPONENT_SET" ? A = w.componentPropertyDefinitions : d === "COMPONENT" && w.parent && w.parent.type === "COMPONENT_SET" ? A = w.parent.componentPropertyDefinitions : d === "COMPONENT" && (A = w.componentPropertyDefinitions), A)
              for (const [P, O] of Object.entries(
                o.componentProperties
              )) {
                const _ = P.split("#")[0];
                if (A[_])
                  try {
                    s.setProperties({
                      [_]: O
                    });
                  } catch (x) {
                    await a.warning(
                      `Failed to set component property "${_}" for resolved instance "${f.name}": ${x}`
                    );
                  }
              }
          }
        } catch (w) {
          await a.warning(
            `Failed to set component properties for resolved instance "${f.name}": ${w}`
          );
        }
      const b = m.children.indexOf(l);
      m.insertChild(b, s), l.remove(), await a.log(
        `  ✓ Resolved deferred instance "${f.name}" from component "${o.componentName}" on page "${o.componentPageName}"`
      ), t++;
    } catch (l) {
      const o = l instanceof Error ? l.message : String(l), f = `Failed to resolve deferred instance "${r.nodeData.name}": ${o}`;
      await a.error(f), i.push(f), n++;
    }
  return await a.log(
    `=== Deferred Resolution Complete: ${t} resolved, ${n} failed ===`
  ), { resolved: t, failed: n, errors: i };
}
async function Aa(e) {
  await a.log("=== Cleaning up created entities ===");
  try {
    const { pageIds: t, collectionIds: n, variableIds: i } = e;
    let r = 0;
    for (const f of i)
      try {
        const m = await figma.variables.getVariableByIdAsync(f);
        if (m) {
          const u = m.variableCollectionId;
          n.includes(u) || (m.remove(), r++);
        }
      } catch (m) {
        await a.warning(
          `Could not delete variable ${f.substring(0, 8)}...: ${m}`
        );
      }
    let l = 0;
    for (const f of n)
      try {
        const m = await figma.variables.getVariableCollectionByIdAsync(f);
        m && (m.remove(), l++);
      } catch (m) {
        await a.warning(
          `Could not delete collection ${f.substring(0, 8)}...: ${m}`
        );
      }
    await figma.loadAllPagesAsync();
    let o = 0;
    for (const f of t)
      try {
        const m = await figma.getNodeByIdAsync(f);
        m && m.type === "PAGE" && (m.remove(), o++);
      } catch (m) {
        await a.warning(
          `Could not delete page ${f.substring(0, 8)}...: ${m}`
        );
      }
    return await a.log(
      `Cleanup complete: Deleted ${o} page(s), ${l} collection(s), ${r} variable(s)`
    ), {
      type: "cleanupCreatedEntities",
      success: !0,
      error: !1,
      message: "Cleanup completed successfully",
      data: {
        deletedPages: o,
        deletedCollections: l,
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
async function gt(e) {
  const t = [];
  for (const { fileName: n, jsonData: i } of e)
    try {
      const r = Je(i);
      if (!r.success || !r.expandedJsonData) {
        await a.warning(
          `Skipping ${n} - failed to expand JSON: ${r.error || "Unknown error"}`
        );
        continue;
      }
      const l = r.expandedJsonData, o = l.metadata;
      if (!o || !o.name || !o.guid) {
        await a.warning(
          `Skipping ${n} - missing or invalid metadata`
        );
        continue;
      }
      const f = [];
      if (l.instances) {
        const u = Ee.fromTable(
          l.instances
        ).getSerializedTable();
        for (const y of Object.values(u))
          y.instanceType === "normal" && y.componentPageName && (f.includes(y.componentPageName) || f.push(y.componentPageName));
      }
      t.push({
        fileName: n,
        pageName: o.name,
        pageGuid: o.guid,
        dependencies: f,
        jsonData: i
        // Store original JSON data for import
      }), await a.log(
        `  ${n}: "${o.name}" depends on: ${f.length > 0 ? f.join(", ") : "none"}`
      );
    } catch (r) {
      await a.error(
        `Error processing ${n}: ${r instanceof Error ? r.message : String(r)}`
      );
    }
  return t;
}
function pt(e) {
  const t = [], n = [], i = [], r = /* @__PURE__ */ new Map();
  for (const u of e)
    r.set(u.pageName, u);
  const l = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), f = [], m = (u) => {
    if (l.has(u.pageName))
      return !1;
    if (o.has(u.pageName)) {
      const y = f.findIndex(
        (v) => v.pageName === u.pageName
      );
      if (y !== -1) {
        const v = f.slice(y).concat([u]);
        return n.push(v), !0;
      }
      return !1;
    }
    o.add(u.pageName), f.push(u);
    for (const y of u.dependencies) {
      const v = r.get(y);
      v && m(v);
    }
    return o.delete(u.pageName), f.pop(), l.add(u.pageName), t.push(u), !1;
  };
  for (const u of e)
    l.has(u.pageName) || m(u);
  for (const u of e)
    for (const y of u.dependencies)
      r.has(y) || i.push(
        `Page "${u.pageName}" (${u.fileName}) depends on "${y}" which is not in the import set`
      );
  return { order: t, cycles: n, errors: i };
}
async function mt(e) {
  await a.log("=== Building Dependency Graph ===");
  const t = await gt(e);
  await a.log("=== Resolving Import Order ===");
  const n = pt(t);
  if (n.cycles.length > 0) {
    await a.log(
      `Detected ${n.cycles.length} circular dependency cycle(s):`
    );
    for (const i of n.cycles) {
      const r = i.map((l) => `"${l.pageName}"`).join(" → ");
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
async function ft(e) {
  var O, _, x, U, I, C;
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
  } = await mt(t);
  r.length > 0 && await a.warning(
    `Found ${r.length} dependency warning(s) - some dependencies may be missing`
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
    const E = "recursica:collectionId", V = async (L) => {
      const p = await figma.variables.getLocalVariableCollectionsAsync(), $ = new Set(p.map((h) => h.name));
      if (!$.has(L))
        return L;
      let c = 1, g = `${L}_${c}`;
      for (; $.has(g); )
        c++, g = `${L}_${c}`;
      return g;
    }, M = [
      { choice: e.collectionChoices.tokens, normalizedName: "Tokens" },
      { choice: e.collectionChoices.theme, normalizedName: "Theme" },
      { choice: e.collectionChoices.layers, normalizedName: "Layer" }
    ];
    for (const { choice: L, normalizedName: p } of M)
      if (L === "new") {
        await a.log(
          `Processing collection type: "${p}" (choice: "new") - will create new collection`
        );
        const $ = await V(p), c = figma.variables.createVariableCollection($);
        if (le(p)) {
          const g = Oe(p);
          g && (c.setSharedPluginData(
            "recursica",
            E,
            g
          ), await a.log(
            `  Stored fixed GUID: ${g.substring(0, 8)}...`
          ));
        }
        l.set(p, c), await a.log(
          `✓ Pre-created collection: "${$}" (normalized: "${p}", id: ${c.id.substring(0, 8)}...)`
        );
      } else
        await a.log(
          `Skipping collection type: "${p}" (choice: "existing")`
        );
    l.size > 0 && await a.log(
      `Pre-created ${l.size} collection(s) for reuse across all imports`
    );
  }
  await a.log("=== Importing Pages in Order ===");
  let o = 0, f = 0;
  const m = [...r], u = [], y = {
    pageIds: [],
    collectionIds: [],
    variableIds: []
  }, v = [];
  if (l.size > 0)
    for (const E of l.values())
      y.collectionIds.push(E.id), await a.log(
        `Tracking pre-created collection: "${E.name}" (${E.id.substring(0, 8)}...)`
      );
  const s = e.mainFileName;
  for (let E = 0; E < n.length; E++) {
    const V = n[E], M = s ? V.fileName === s : E === n.length - 1;
    await a.log(
      `[${E + 1}/${n.length}] Importing ${V.fileName} ("${V.pageName}")${M ? " [MAIN]" : " [DEPENDENCY]"}...`
    );
    try {
      const L = E === 0, p = await lt({
        jsonData: V.jsonData,
        isMainPage: M,
        clearConsole: L,
        collectionChoices: e.collectionChoices,
        alwaysCreateCopy: !0,
        // Wizard imports always create copies (no prompts)
        skipUniqueNaming: (O = e.skipUniqueNaming) != null ? O : !1,
        constructionIcon: e.constructionIcon || "",
        preCreatedCollections: l
        // Pass pre-created collections for reuse
      });
      if (p.success) {
        if (o++, (_ = p.data) != null && _.deferredInstances) {
          const $ = p.data.deferredInstances;
          Array.isArray($) && u.push(...$);
        }
        if ((x = p.data) != null && x.createdEntities) {
          const $ = p.data.createdEntities;
          $.pageIds && y.pageIds.push(...$.pageIds), $.collectionIds && y.collectionIds.push(...$.collectionIds), $.variableIds && y.variableIds.push(...$.variableIds);
          const c = ((U = $.pageIds) == null ? void 0 : U[0]) || ((I = p.data) == null ? void 0 : I.pageId);
          (C = p.data) != null && C.pageName && c && v.push({
            name: p.data.pageName,
            pageId: c
          });
        }
      } else
        f++, m.push(
          `Failed to import ${V.fileName}: ${p.message || "Unknown error"}`
        );
    } catch (L) {
      f++;
      const p = L instanceof Error ? L.message : String(L);
      m.push(`Failed to import ${V.fileName}: ${p}`);
    }
  }
  if (u.length > 0) {
    await a.log(
      `=== Resolving ${u.length} Deferred Instance(s) ===`
    );
    try {
      const E = await dt(u);
      await a.log(
        `  Resolved: ${E.resolved}, Failed: ${E.failed}`
      ), E.errors.length > 0 && m.push(...E.errors);
    } catch (E) {
      m.push(
        `Failed to resolve deferred instances: ${E instanceof Error ? E.message : String(E)}`
      );
    }
  }
  const b = Array.from(
    new Set(y.collectionIds)
  ), w = Array.from(
    new Set(y.variableIds)
  ), A = Array.from(new Set(y.pageIds));
  if (await a.log("=== Import Summary ==="), await a.log(
    `  Imported: ${o}, Failed: ${f}, Deferred instances: ${u.length}`
  ), await a.log(
    `  Collections in allCreatedEntityIds: ${y.collectionIds.length}, Unique: ${b.length}`
  ), b.length > 0) {
    await a.log(
      `  Created ${b.length} collection(s)`
    );
    for (const E of b)
      try {
        const V = await figma.variables.getVariableCollectionByIdAsync(E);
        V && await a.log(
          `    - "${V.name}" (${E.substring(0, 8)}...)`
        );
      } catch (V) {
      }
  }
  const d = f === 0, P = d ? `Successfully imported ${o} page(s)${u.length > 0 ? ` (${u.length} deferred instance(s) resolved)` : ""}` : `Import completed with ${f} failure(s). ${m.join("; ")}`;
  return {
    type: "importPagesInOrder",
    success: d,
    error: !d,
    message: P,
    data: {
      imported: o,
      failed: f,
      deferred: u.length,
      errors: m,
      importedPages: v,
      createdEntities: {
        pageIds: A,
        collectionIds: b,
        variableIds: w
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
    const r = await xe(
      i,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + i.name + " (index: " + n + ")"
    );
    const l = JSON.stringify(r, null, 2), o = JSON.parse(l), f = "Copy - " + o.name, m = figma.createPage();
    if (m.name = f, figma.root.appendChild(m), o.children && o.children.length > 0) {
      let v = function(b) {
        b.forEach((w) => {
          const A = (w.x || 0) + (w.width || 0);
          A > s && (s = A), w.children && w.children.length > 0 && v(w.children);
        });
      };
      console.log(
        "Recreating " + o.children.length + " top-level children..."
      );
      let s = 0;
      v(o.children), console.log("Original content rightmost edge: " + s);
      for (const b of o.children)
        await be(b, m, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const u = Ve(o);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: o.name,
        newPageName: f,
        totalNodes: u
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
async function Sa(e) {
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
async function Ta(e) {
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
async function Oa(e) {
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
async function Ma(e) {
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
async function Va(e) {
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
const ut = "RecursicaPublishedMetadata";
async function xa(e) {
  try {
    const t = figma.currentPage;
    await figma.loadAllPagesAsync();
    const i = figma.root.children.findIndex(
      (f) => f.id === t.id
    ), r = t.getPluginData(ut);
    if (!r) {
      const u = {
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
      return Z("getComponentMetadata", u);
    }
    const o = {
      componentMetadata: JSON.parse(r),
      currentPageIndex: i
    };
    return Z("getComponentMetadata", o);
  } catch (t) {
    return console.error("Error getting component metadata:", t), se(
      "getComponentMetadata",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function Ra(e) {
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
      const l = r, o = l.getPluginData(ut);
      if (o)
        try {
          const f = JSON.parse(o);
          n.push(f);
        } catch (f) {
          console.warn(
            `Failed to parse metadata for page "${l.name}":`,
            f
          );
          const u = {
            _ver: 1,
            id: "",
            name: Te(l.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          n.push(u);
        }
      else {
        const m = {
          _ver: 1,
          id: "",
          name: Te(l.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        n.push(m);
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
async function ka(e) {
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
const ee = "RecursicaPrimaryImport", q = "RecursicaUnderReview", yt = "---", ht = "---", ne = "RecursicaImportDivider", fe = "start", ue = "end", ce = "⚠️";
async function Ga(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children;
    for (const i of t) {
      if (i.type !== "PAGE")
        continue;
      const r = i.getPluginData(ee);
      if (r)
        try {
          const o = JSON.parse(r), f = {
            exists: !0,
            pageId: i.id,
            metadata: o
          };
          return Z(
            "checkForExistingPrimaryImport",
            f
          );
        } catch (o) {
          await a.warning(
            `Failed to parse primary import metadata on page "${i.name}": ${o}`
          );
          continue;
        }
      if (i.getPluginData(q) === "true") {
        const o = i.getPluginData(ee);
        if (o)
          try {
            const f = JSON.parse(o), m = {
              exists: !0,
              pageId: i.id,
              metadata: f
            };
            return Z(
              "checkForExistingPrimaryImport",
              m
            );
          } catch (f) {
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
async function _a(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children.find(
      (f) => f.type === "PAGE" && f.getPluginData(ne) === fe
    ), n = figma.root.children.find(
      (f) => f.type === "PAGE" && f.getPluginData(ne) === ue
    );
    if (t && n) {
      const f = {
        startDividerId: t.id,
        endDividerId: n.id
      };
      return Z("createImportDividers", f);
    }
    const i = figma.createPage();
    i.name = yt, i.setPluginData(ne, fe), i.setPluginData(q, "true");
    const r = figma.createPage();
    r.name = ht, r.setPluginData(ne, ue), r.setPluginData(q, "true");
    const l = figma.root.children.indexOf(i);
    figma.root.insertChild(l + 1, r), await a.log("Created import dividers");
    const o = {
      startDividerId: i.id,
      endDividerId: r.id
    };
    return Z("createImportDividers", o);
  } catch (t) {
    return console.error("Error creating import dividers:", t), se(
      "createImportDividers",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function Ba(e) {
  var t, n, i, r, l, o, f;
  try {
    await a.log("=== Starting Single Component Import ==="), await a.log("Creating start divider..."), await figma.loadAllPagesAsync();
    let m = figma.root.children.find(
      (c) => c.type === "PAGE" && c.getPluginData(ne) === fe
    );
    m || (m = figma.createPage(), m.name = yt, m.setPluginData(ne, fe), m.setPluginData(q, "true"), await a.log("Created start divider"));
    const y = [
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
      `Importing ${y.length} file(s) in dependency order...`
    );
    const v = await ft({
      jsonFiles: y,
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
    if (!v.success)
      throw new Error(
        v.message || "Failed to import pages in order"
      );
    await figma.loadAllPagesAsync();
    const s = figma.root.children;
    let b = s.find(
      (c) => c.type === "PAGE" && c.getPluginData(ne) === ue
    );
    if (!b) {
      b = figma.createPage(), b.name = ht, b.setPluginData(
        ne,
        ue
      ), b.setPluginData(q, "true");
      let c = s.length;
      for (let g = s.length - 1; g >= 0; g--) {
        const h = s[g];
        if (h.type === "PAGE" && h.getPluginData(ne) !== fe && h.getPluginData(ne) !== ue) {
          c = g + 1;
          break;
        }
      }
      figma.root.insertChild(c, b), await a.log("Created end divider");
    }
    await a.log(
      `Import result data structure: ${JSON.stringify(Object.keys(v.data || {}))}`
    );
    const w = v.data;
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
    const A = "RecursicaPublishedMetadata", d = e.mainComponent.guid;
    await a.log(
      `Looking for main page by GUID: ${d.substring(0, 8)}...`
    );
    let P, O = null;
    for (const c of w.importedPages)
      try {
        const g = await figma.getNodeByIdAsync(
          c.pageId
        );
        if (g && g.type === "PAGE") {
          const h = g.getPluginData(A);
          if (h)
            try {
              if (JSON.parse(h).id === d) {
                P = c.pageId, O = g, await a.log(
                  `Found main page by GUID: "${g.name}" (ID: ${c.pageId.substring(0, 12)}...)`
                );
                break;
              }
            } catch (S) {
            }
        }
      } catch (g) {
        await a.warning(
          `Error checking page ${c.pageId}: ${g}`
        );
      }
    if (!P) {
      await a.log(
        "Main page not found in importedPages list, searching all pages by GUID..."
      ), await figma.loadAllPagesAsync();
      const c = figma.root.children;
      for (const g of c)
        if (g.type === "PAGE") {
          const h = g.getPluginData(A);
          if (h)
            try {
              if (JSON.parse(h).id === d) {
                P = g.id, O = g, await a.log(
                  `Found main page by GUID in all pages: "${g.name}" (ID: ${g.id.substring(0, 12)}...)`
                );
                break;
              }
            } catch (S) {
            }
        }
    }
    if (!P || !O) {
      await a.error(
        `Failed to find imported main page by GUID: ${d.substring(0, 8)}...`
      ), await a.log("Imported pages were:");
      for (const c of w.importedPages)
        await a.log(
          `  - "${c.name}" (ID: ${c.pageId.substring(0, 12)}...)`
        );
      throw new Error("Failed to find imported main page ID");
    }
    if (!O || O.type !== "PAGE")
      throw new Error("Failed to get main page node");
    for (const c of w.importedPages)
      try {
        const g = await figma.getNodeByIdAsync(
          c.pageId
        );
        if (g && g.type === "PAGE") {
          g.setPluginData(q, "true");
          const h = g.name.replace(/_\d+$/, "");
          if (!h.startsWith(ce))
            g.name = `${ce} ${h}`;
          else {
            const S = h.replace(ce, "").trim();
            g.name = `${ce} ${S}`;
          }
        }
      } catch (g) {
        await a.warning(
          `Failed to mark page ${c.pageId} as under review: ${g}`
        );
      }
    await figma.loadAllPagesAsync();
    const _ = figma.root.children, x = _.find(
      (c) => c.type === "PAGE" && (c.name === "REMOTES" || c.name === `${ce} REMOTES`)
    );
    x && (x.setPluginData(q, "true"), x.name.startsWith(ce) || (x.name = `${ce} REMOTES`), await a.log(
      "Marked REMOTES page as under review and ensured construction icon"
    ));
    const U = _.find(
      (c) => c.type === "PAGE" && c.getPluginData(ne) === fe
    ), I = _.find(
      (c) => c.type === "PAGE" && c.getPluginData(ne) === ue
    );
    if (U && I) {
      const c = _.indexOf(U), g = _.indexOf(I);
      for (let h = c + 1; h < g; h++) {
        const S = _[h];
        S.type === "PAGE" && S.getPluginData(q) !== "true" && (S.setPluginData(q, "true"), await a.log(
          `Marked page "${S.name}" as under review (found between dividers)`
        ));
      }
    }
    const C = [], E = [];
    if (await a.log(
      `[EXTRACTION] Starting collection extraction. Collection IDs in result: ${((l = (r = w == null ? void 0 : w.createdEntities) == null ? void 0 : r.collectionIds) == null ? void 0 : l.length) || 0}`
    ), (o = w == null ? void 0 : w.createdEntities) != null && o.collectionIds) {
      await a.log(
        `[EXTRACTION] Collection IDs to process: ${w.createdEntities.collectionIds.map((c) => c.substring(0, 8) + "...").join(", ")}`
      );
      for (const c of w.createdEntities.collectionIds)
        try {
          const g = await figma.variables.getVariableCollectionByIdAsync(c);
          g ? (C.push({
            collectionId: g.id,
            collectionName: g.name
          }), await a.log(
            `[EXTRACTION] ✓ Extracted collection: "${g.name}" (${c.substring(0, 8)}...)`
          )) : await a.warning(
            `[EXTRACTION] Collection ${c.substring(0, 8)}... not found`
          );
        } catch (g) {
          await a.warning(
            `[EXTRACTION] Failed to get collection ${c.substring(0, 8)}...: ${g}`
          );
        }
    } else
      await a.warning(
        "[EXTRACTION] No collectionIds found in importResultData.createdEntities"
      );
    await a.log(
      `[EXTRACTION] Total collections extracted: ${C.length}`
    ), C.length > 0 && await a.log(
      `[EXTRACTION] Extracted collections: ${C.map((c) => `"${c.collectionName}" (${c.collectionId.substring(0, 8)}...)`).join(", ")}`
    );
    const V = new Set(
      C.map((c) => c.collectionId)
    );
    if ((f = w == null ? void 0 : w.createdEntities) != null && f.variableIds)
      for (const c of w.createdEntities.variableIds)
        try {
          const g = await figma.variables.getVariableByIdAsync(c);
          if (g && g.resolvedType && !V.has(g.variableCollectionId)) {
            const h = await figma.variables.getVariableCollectionByIdAsync(
              g.variableCollectionId
            );
            h && E.push({
              variableId: g.id,
              variableName: g.name,
              collectionId: g.variableCollectionId,
              collectionName: h.name
            });
          }
        } catch (g) {
          await a.warning(
            `Failed to get variable ${c}: ${g}`
          );
        }
    const M = {
      componentGuid: e.mainComponent.guid,
      componentVersion: e.mainComponent.version,
      componentName: e.mainComponent.name,
      importDate: (/* @__PURE__ */ new Date()).toISOString(),
      wizardSelections: e.wizardSelections,
      variableSummary: e.variableSummary,
      createdCollections: C,
      createdVariables: E,
      importError: void 0
      // No error yet
    };
    await a.log(
      `Storing metadata with ${C.length} collection(s) and ${E.length} variable(s)`
    ), O.setPluginData(
      ee,
      JSON.stringify(M)
    ), O.setPluginData(q, "true"), await a.log(
      "Stored primary import metadata on main page and marked as under review"
    );
    const L = [];
    w.importedPages && L.push(
      ...w.importedPages.map((c) => c.pageId)
    ), await a.log("=== Single Component Import Complete ==="), M.importError = void 0, await a.log(
      `[METADATA] About to store metadata with ${C.length} collection(s) and ${E.length} variable(s)`
    ), C.length > 0 && await a.log(
      `[METADATA] Collections to store: ${C.map((c) => `"${c.collectionName}" (${c.collectionId.substring(0, 8)}...)`).join(", ")}`
    ), O.setPluginData(
      ee,
      JSON.stringify(M)
    ), await a.log(
      `[METADATA] Stored metadata: ${C.length} collection(s), ${E.length} variable(s)`
    );
    const p = O.getPluginData(ee);
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
    const $ = {
      success: !0,
      mainPageId: O.id,
      importedPageIds: L,
      createdCollections: C,
      createdVariables: E
    };
    return Z("importSingleComponentWithWizard", $);
  } catch (m) {
    const u = m instanceof Error ? m.message : "Unknown error occurred";
    await a.error(`Import failed: ${u}`);
    try {
      await figma.loadAllPagesAsync();
      const y = figma.root.children;
      let v = null;
      for (const s of y) {
        if (s.type !== "PAGE") continue;
        const b = s.getPluginData(ee);
        if (b)
          try {
            if (JSON.parse(b).componentGuid === e.mainComponent.guid) {
              v = s;
              break;
            }
          } catch (w) {
          }
      }
      if (v) {
        const s = v.getPluginData(ee);
        if (s)
          try {
            const b = JSON.parse(s);
            await a.log(
              `[CATCH] Found existing metadata with ${b.createdCollections.length} collection(s) and ${b.createdVariables.length} variable(s)`
            ), b.importError = u, v.setPluginData(
              ee,
              JSON.stringify(b)
            ), await a.log(
              `[CATCH] Updated existing metadata with error. Collections: ${b.createdCollections.length}, Variables: ${b.createdVariables.length}`
            );
          } catch (b) {
            await a.warning(
              `[CATCH] Failed to update metadata: ${b}`
            );
          }
      } else {
        await a.log(
          "No existing metadata found, attempting to collect created entities for cleanup..."
        );
        const s = [];
        for (const A of y) {
          if (A.type !== "PAGE") continue;
          A.getPluginData(q) === "true" && s.push(A);
        }
        const b = [];
        if (e.wizardSelections) {
          const A = await figma.variables.getLocalVariableCollectionsAsync(), d = [
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
          for (const { choice: P, normalizedName: O } of d)
            if (P === "new") {
              const _ = A.filter((x) => te(x.name) === O);
              if (_.length > 0) {
                const x = _[0];
                b.push({
                  collectionId: x.id,
                  collectionName: x.name
                }), await a.log(
                  `Found created collection: "${x.name}" (${x.id.substring(0, 8)}...)`
                );
              }
            }
        }
        const w = [];
        if (s.length > 0) {
          const A = s[0], d = {
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
            createdCollections: b,
            createdVariables: w,
            importError: u
          };
          A.setPluginData(
            ee,
            JSON.stringify(d)
          ), await a.log(
            `Created fallback metadata with ${b.length} collection(s) and error information`
          );
        }
      }
    } catch (y) {
      await a.warning(
        `Failed to store error metadata: ${y instanceof Error ? y.message : String(y)}`
      );
    }
    return se(
      "importSingleComponentWithWizard",
      m instanceof Error ? m : new Error(String(m))
    );
  }
}
async function bt(e) {
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
    const r = figma.root.children, l = [];
    for (const s of r) {
      if (s.type !== "PAGE")
        continue;
      s.getPluginData(q) === "true" && (l.push(s), await a.log(
        `Found page to delete: "${s.name}" (under review)`
      ));
    }
    await a.log(
      `Deleting ${i.createdVariables.length} variable(s) from existing collections...`
    );
    let o = 0;
    for (const s of i.createdVariables)
      try {
        const b = await figma.variables.getVariableByIdAsync(
          s.variableId
        );
        b ? (b.remove(), o++, await a.log(
          `Deleted variable: ${s.variableName} from collection ${s.collectionName}`
        )) : await a.warning(
          `Variable ${s.variableName} (${s.variableId}) not found - may have already been deleted`
        );
      } catch (b) {
        await a.warning(
          `Failed to delete variable ${s.variableName}: ${b instanceof Error ? b.message : String(b)}`
        );
      }
    await a.log(
      `Deleting ${i.createdCollections.length} collection(s)...`
    );
    let f = 0;
    for (const s of i.createdCollections)
      try {
        const b = await figma.variables.getVariableCollectionByIdAsync(
          s.collectionId
        );
        b ? (b.remove(), f++, await a.log(
          `Deleted collection: ${s.collectionName} (${s.collectionId})`
        )) : await a.warning(
          `Collection ${s.collectionName} (${s.collectionId}) not found - may have already been deleted`
        );
      } catch (b) {
        await a.warning(
          `Failed to delete collection ${s.collectionName}: ${b instanceof Error ? b.message : String(b)}`
        );
      }
    const m = l.map((s) => ({
      page: s,
      name: s.name,
      id: s.id
    })), u = figma.currentPage;
    if (m.some(
      (s) => s.id === u.id
    )) {
      await figma.loadAllPagesAsync();
      const b = figma.root.children.find(
        (w) => w.type === "PAGE" && !m.some((A) => A.id === w.id)
      );
      b ? (await figma.setCurrentPageAsync(b), await a.log(
        `Switched away from page "${u.name}" before deletion`
      )) : await a.warning(
        "No safe page to switch to - all pages are being deleted"
      );
    }
    for (const { page: s, name: b } of m)
      try {
        let w = !1;
        try {
          await figma.loadAllPagesAsync(), w = figma.root.children.some((d) => d.id === s.id);
        } catch (A) {
          w = !1;
        }
        if (!w) {
          await a.log(`Page "${b}" already deleted, skipping`);
          continue;
        }
        if (figma.currentPage.id === s.id) {
          await figma.loadAllPagesAsync();
          const d = figma.root.children.find(
            (P) => P.type === "PAGE" && P.id !== s.id && !m.some((O) => O.id === P.id)
          );
          d && await figma.setCurrentPageAsync(d);
        }
        s.remove(), await a.log(`Deleted page: "${b}"`);
      } catch (w) {
        await a.warning(
          `Failed to delete page "${b}": ${w instanceof Error ? w.message : String(w)}`
        );
      }
    await a.log("=== Import Group Deletion Complete ===");
    const v = {
      success: !0,
      deletedPages: l.length,
      deletedCollections: f,
      deletedVariables: o
    };
    return Z("deleteImportGroup", v);
  } catch (t) {
    const n = t instanceof Error ? t.message : "Unknown error occurred";
    return await a.error(`Delete failed: ${n}`), se(
      "deleteImportGroup",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
async function Ua(e) {
  try {
    await a.log("=== Cleaning up failed import ==="), await figma.loadAllPagesAsync();
    const t = figma.root.children;
    let n = null;
    for (const m of t) {
      if (m.type !== "PAGE")
        continue;
      if (m.getPluginData(ee)) {
        n = m;
        break;
      }
    }
    if (n)
      return await a.log(
        "Found page with metadata, using deleteImportGroup"
      ), await bt({ pageId: n.id });
    await a.log(
      "No metadata found, deleting pages with UNDER_REVIEW_KEY"
    );
    const i = [];
    for (const m of t) {
      if (m.type !== "PAGE")
        continue;
      m.getPluginData(q) === "true" && i.push({ id: m.id, name: m.name });
    }
    const r = figma.currentPage;
    if (i.some(
      (m) => m.id === r.id
    )) {
      await figma.loadAllPagesAsync();
      const u = figma.root.children.find(
        (y) => y.type === "PAGE" && !i.some((v) => v.id === y.id)
      );
      u && (await figma.setCurrentPageAsync(u), await a.log(
        `Switched away from page "${r.name}" before deletion`
      ));
    }
    let o = 0;
    for (const m of i)
      try {
        await figma.loadAllPagesAsync();
        const u = await figma.getNodeByIdAsync(
          m.id
        );
        if (!u || u.type !== "PAGE")
          continue;
        if (figma.currentPage.id === u.id) {
          await figma.loadAllPagesAsync();
          const v = figma.root.children.find(
            (s) => s.type === "PAGE" && s.id !== u.id && !i.some((b) => b.id === s.id)
          );
          v && await figma.setCurrentPageAsync(v);
        }
        u.remove(), o++, await a.log(`Deleted page: "${m.name}"`);
      } catch (u) {
        await a.warning(
          `Failed to delete page "${m.name}" (${m.id.substring(0, 8)}...): ${u instanceof Error ? u.message : String(u)}`
        );
      }
    return await a.log("=== Failed Import Cleanup Complete ==="), Z("cleanupFailedImport", {
      success: !0,
      deletedPages: o,
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
async function Fa(e) {
  try {
    await a.log("=== Clearing Import Metadata ==="), await figma.loadAllPagesAsync();
    const t = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!t || t.type !== "PAGE")
      throw new Error("Page not found");
    t.setPluginData(ee, ""), t.setPluginData(q, "");
    const n = figma.root.children;
    for (const r of n)
      if (r.type === "PAGE" && r.getPluginData(q) === "true") {
        const o = r.getPluginData(ee);
        if (o)
          try {
            JSON.parse(o), r.setPluginData(q, "");
          } catch (f) {
            r.setPluginData(q, "");
          }
        else
          r.setPluginData(q, "");
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
async function za(e) {
  try {
    await a.log("=== Summarizing Variables for Wizard ===");
    const t = [];
    for (const { fileName: b, jsonData: w } of e.jsonFiles)
      try {
        const A = Je(w);
        if (!A.success || !A.expandedJsonData) {
          await a.warning(
            `Skipping ${b} - failed to expand JSON: ${A.error || "Unknown error"}`
          );
          continue;
        }
        const d = A.expandedJsonData;
        if (!d.collections)
          continue;
        const O = ve.fromTable(
          d.collections
        );
        if (!d.variables)
          continue;
        const x = Ne.fromTable(d.variables).getTable();
        for (const U of Object.values(x)) {
          if (U._colRef === void 0)
            continue;
          const I = O.getCollectionByIndex(
            U._colRef
          );
          if (I) {
            const E = te(
              I.collectionName
            ).toLowerCase();
            (E === "tokens" || E === "theme" || E === "layer") && t.push({
              name: U.variableName,
              collectionName: E
              // Use lowercase for consistency ("layer" not "layers")
            });
          }
        }
      } catch (A) {
        await a.warning(
          `Error processing ${b}: ${A instanceof Error ? A.message : String(A)}`
        );
        continue;
      }
    const n = await figma.variables.getLocalVariableCollectionsAsync();
    let i = null, r = null, l = null;
    for (const b of n) {
      const A = te(b.name).toLowerCase();
      (A === "tokens" || A === "token") && !i ? i = b : (A === "theme" || A === "themes") && !r ? r = b : (A === "layer" || A === "layers") && !l && (l = b);
    }
    const o = t.filter(
      (b) => b.collectionName === "tokens"
    ), f = t.filter((b) => b.collectionName === "theme"), m = t.filter((b) => b.collectionName === "layer"), u = {
      existing: 0,
      new: 0
    }, y = {
      existing: 0,
      new: 0
    }, v = {
      existing: 0,
      new: 0
    };
    if (e.tokensCollection === "existing" && i) {
      const b = /* @__PURE__ */ new Set();
      for (const w of i.variableIds)
        try {
          const A = figma.variables.getVariableById(w);
          A && b.add(A.name);
        } catch (A) {
          continue;
        }
      for (const w of o)
        b.has(w.name) ? u.existing++ : u.new++;
    } else
      u.new = o.length;
    if (e.themeCollection === "existing" && r) {
      const b = /* @__PURE__ */ new Set();
      for (const w of r.variableIds)
        try {
          const A = figma.variables.getVariableById(w);
          A && b.add(A.name);
        } catch (A) {
          continue;
        }
      for (const w of f)
        b.has(w.name) ? y.existing++ : y.new++;
    } else
      y.new = f.length;
    if (e.layersCollection === "existing" && l) {
      const b = /* @__PURE__ */ new Set();
      for (const w of l.variableIds)
        try {
          const A = figma.variables.getVariableById(w);
          A && b.add(A.name);
        } catch (A) {
          continue;
        }
      for (const w of m)
        b.has(w.name) ? v.existing++ : v.new++;
    } else
      v.new = m.length;
    return await a.log(
      `Variable summary: Tokens - ${u.existing} existing, ${u.new} new; Theme - ${y.existing} existing, ${y.new} new; Layers - ${v.existing} existing, ${v.new} new`
    ), Z("summarizeVariablesForWizard", {
      tokens: u,
      theme: y,
      layers: v
    });
  } catch (t) {
    const n = t instanceof Error ? t.message : "Unknown error occurred";
    return await a.error(`Summarize failed: ${n}`), se(
      "summarizeVariablesForWizard",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
async function ja(e) {
  try {
    const t = "recursica:collectionId", i = {
      collections: (await figma.variables.getLocalVariableCollectionsAsync()).map((r) => {
        const l = r.getSharedPluginData("recursica", t);
        return {
          id: r.id,
          name: r.name,
          guid: l || void 0
        };
      })
    };
    return Z(
      "getLocalVariableCollections",
      i
    );
  } catch (t) {
    return se(
      "getLocalVariableCollections",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
async function Da(e) {
  try {
    const t = "recursica:collectionId", n = [];
    for (const r of e.collectionIds)
      try {
        const l = await figma.variables.getVariableCollectionByIdAsync(r);
        if (l) {
          const o = l.getSharedPluginData(
            "recursica",
            t
          );
          n.push({
            collectionId: r,
            guid: o || null
          });
        } else
          n.push({
            collectionId: r,
            guid: null
          });
      } catch (l) {
        await a.warning(
          `Failed to get GUID for collection ${r}: ${l instanceof Error ? l.message : String(l)}`
        ), n.push({
          collectionId: r,
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
    return se(
      "getCollectionGuids",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
async function Ja(e) {
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
    let r = 0, l = 0;
    const o = "recursica:collectionId";
    for (const d of e.collectionChoices)
      if (d.choice === "merge")
        try {
          const P = await figma.variables.getVariableCollectionByIdAsync(
            d.newCollectionId
          );
          if (!P) {
            await a.warning(
              `New collection ${d.newCollectionId} not found, skipping merge`
            );
            continue;
          }
          let O = null;
          if (d.existingCollectionId)
            O = await figma.variables.getVariableCollectionByIdAsync(
              d.existingCollectionId
            );
          else {
            const E = P.getSharedPluginData(
              "recursica",
              o
            );
            if (E) {
              const V = await figma.variables.getLocalVariableCollectionsAsync();
              for (const M of V)
                if (M.getSharedPluginData(
                  "recursica",
                  o
                ) === E && M.id !== d.newCollectionId) {
                  O = M;
                  break;
                }
              if (!O && (E === de.LAYER || E === de.TOKENS || E === de.THEME)) {
                let M;
                E === de.LAYER ? M = re.LAYER : E === de.TOKENS ? M = re.TOKENS : M = re.THEME;
                for (const L of V)
                  if (L.getSharedPluginData(
                    "recursica",
                    o
                  ) === E && L.name === M && L.id !== d.newCollectionId) {
                    O = L;
                    break;
                  }
                O || (O = figma.variables.createVariableCollection(M), O.setSharedPluginData(
                  "recursica",
                  o,
                  E
                ), await a.log(
                  `Created new standard collection: "${M}"`
                ));
              }
            }
          }
          if (!O) {
            await a.warning(
              "Could not find or create existing collection for merge, skipping"
            );
            continue;
          }
          await a.log(
            `Merging collection "${P.name}" (${d.newCollectionId.substring(0, 8)}...) into "${O.name}" (${O.id.substring(0, 8)}...)`
          );
          const _ = P.variableIds.map(
            (E) => figma.variables.getVariableByIdAsync(E)
          ), x = await Promise.all(_), U = O.variableIds.map(
            (E) => figma.variables.getVariableByIdAsync(E)
          ), I = await Promise.all(U), C = new Set(
            I.filter((E) => E !== null).map((E) => E.name)
          );
          for (const E of x)
            if (E)
              try {
                if (C.has(E.name)) {
                  await a.warning(
                    `Variable "${E.name}" already exists in collection "${O.name}", skipping`
                  );
                  continue;
                }
                const V = figma.variables.createVariable(
                  E.name,
                  O,
                  E.resolvedType
                );
                for (const M of O.modes) {
                  const L = M.modeId;
                  let p = E.valuesByMode[L];
                  if (p === void 0 && P.modes.length > 0) {
                    const $ = P.modes[0].modeId;
                    p = E.valuesByMode[$];
                  }
                  p !== void 0 && V.setValueForMode(L, p);
                }
                await a.log(
                  `  ✓ Copied variable "${E.name}" to collection "${O.name}"`
                );
              } catch (V) {
                await a.warning(
                  `Failed to copy variable "${E.name}": ${V instanceof Error ? V.message : String(V)}`
                );
              }
          P.remove(), r++, await a.log(
            `✓ Merged and deleted collection: ${P.name}`
          );
        } catch (P) {
          await a.warning(
            `Failed to merge collection: ${P instanceof Error ? P.message : String(P)}`
          );
        }
      else
        l++, await a.log(`Kept collection: ${d.newCollectionId}`);
    await a.log("Removing dividers...");
    const f = figma.root.children, m = [];
    for (const d of f) {
      if (d.type !== "PAGE") continue;
      const P = d.getPluginData(ne);
      (P === "start" || P === "end") && m.push(d);
    }
    const u = figma.currentPage;
    if (m.some((d) => d.id === u.id))
      if (t && t.id !== u.id)
        figma.currentPage = t;
      else {
        const d = f.find(
          (P) => P.type === "PAGE" && !m.some((O) => O.id === P.id)
        );
        d && (figma.currentPage = d);
      }
    const y = m.map((d) => d.name);
    for (const d of m)
      try {
        d.remove();
      } catch (P) {
        await a.warning(
          `Failed to delete divider: ${P instanceof Error ? P.message : String(P)}`
        );
      }
    for (const d of y)
      await a.log(`Deleted divider: ${d}`);
    await a.log("Removing construction icons and renaming pages..."), await figma.loadAllPagesAsync();
    const v = figma.root.children;
    let s = 0;
    const b = "RecursicaPublishedMetadata", w = [];
    for (const d of v)
      if (d.type === "PAGE")
        try {
          if (d.getPluginData(q) === "true") {
            const O = d.getPluginData(b);
            let _ = {};
            if (O)
              try {
                _ = JSON.parse(O);
              } catch (x) {
              }
            w.push({
              pageId: d.id,
              pageName: d.name,
              pageMetadata: _
            });
          }
        } catch (P) {
          await a.warning(
            `Failed to process page: ${P instanceof Error ? P.message : String(P)}`
          );
        }
    for (const d of w)
      try {
        const P = await figma.getNodeByIdAsync(
          d.pageId
        );
        if (!P || P.type !== "PAGE") {
          await a.warning(
            `Page ${d.pageId} not found, skipping rename`
          );
          continue;
        }
        let O = P.name;
        if (O.startsWith(ce) && (O = O.substring(ce.length).trim()), O === "REMOTES" || O.includes("REMOTES")) {
          P.name = "REMOTES", s++, await a.log(`Renamed page: "${P.name}" -> "REMOTES"`);
          continue;
        }
        const x = d.pageMetadata.name && d.pageMetadata.name.length > 0 && !d.pageMetadata.name.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        ) ? d.pageMetadata.name : i.componentName || O, U = d.pageMetadata.version !== void 0 ? d.pageMetadata.version : i.componentVersion, I = `${x} (VERSION: ${U})`;
        P.name = I, s++, await a.log(`Renamed page: "${O}" -> "${I}"`);
      } catch (P) {
        await a.warning(
          `Failed to rename page ${d.pageId}: ${P instanceof Error ? P.message : String(P)}`
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
    for (const d of w)
      try {
        const P = await figma.getNodeByIdAsync(
          d.pageId
        );
        P && P.type === "PAGE" && P.setPluginData(q, "");
      } catch (P) {
        await a.warning(
          `Failed to clear under review metadata for page ${d.pageId}: ${P instanceof Error ? P.message : String(P)}`
        );
      }
    const A = {
      mergedCollections: r,
      keptCollections: l,
      pagesRenamed: s
    };
    return await a.log(
      `=== Merge Complete ===
  Merged: ${r} collection(s)
  Kept: ${l} collection(s)
  Renamed: ${s} page(s)`
    ), Z(
      "mergeImportGroup",
      A
    );
  } catch (t) {
    return await a.error(
      `Merge failed: ${t instanceof Error ? t.message : String(t)}`
    ), se(
      "mergeImportGroup",
      t instanceof Error ? t : new Error(String(t))
    );
  }
}
const Wa = {
  getCurrentUser: Pt,
  loadPages: Ct,
  exportPage: je,
  importPage: lt,
  cleanupCreatedEntities: Aa,
  resolveDeferredNormalInstances: dt,
  determineImportOrder: mt,
  buildDependencyGraph: gt,
  resolveImportOrder: pt,
  importPagesInOrder: ft,
  quickCopy: Pa,
  storeAuthData: Ca,
  loadAuthData: Ia,
  clearAuthData: Sa,
  storeImportData: Ta,
  loadImportData: Oa,
  clearImportData: Ma,
  storeSelectedRepo: Va,
  getComponentMetadata: xa,
  getAllComponents: Ra,
  pluginPromptResponse: ka,
  switchToPage: La,
  checkForExistingPrimaryImport: Ga,
  createImportDividers: _a,
  importSingleComponentWithWizard: Ba,
  deleteImportGroup: bt,
  clearImportMetadata: Fa,
  cleanupFailedImport: Ua,
  summarizeVariablesForWizard: za,
  getLocalVariableCollections: ja,
  getCollectionGuids: Da,
  mergeImportGroup: Ja
}, Ka = Wa;
figma.showUI(__html__, {
  width: 500,
  height: 500
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    kt(e);
    return;
  }
  const t = e;
  try {
    const n = t.type, i = Ka[n];
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
    const r = await i(t.data);
    figma.ui.postMessage(Q(J({}, r), {
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
