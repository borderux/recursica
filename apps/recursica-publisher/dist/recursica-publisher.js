var Pt = Object.defineProperty, Tt = Object.defineProperties;
var Vt = Object.getOwnPropertyDescriptors;
var at = Object.getOwnPropertySymbols;
var Ot = Object.prototype.hasOwnProperty, Mt = Object.prototype.propertyIsEnumerable;
var je = (e, a, i) => a in e ? Pt(e, a, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[a] = i, q = (e, a) => {
  for (var i in a || (a = {}))
    Ot.call(a, i) && je(e, i, a[i]);
  if (at)
    for (var i of at(a))
      Mt.call(a, i) && je(e, i, a[i]);
  return e;
}, ce = (e, a) => Tt(e, Vt(a));
var ge = (e, a, i) => je(e, typeof a != "symbol" ? a + "" : a, i);
async function xt(e) {
  var a;
  try {
    return {
      type: "getCurrentUser",
      success: !0,
      error: !1,
      message: "Current user retrieved successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        userId: ((a = figma.currentUser) == null ? void 0 : a.id) || null
      }
    };
  } catch (i) {
    return {
      type: "getCurrentUser",
      success: !1,
      error: !0,
      message: i instanceof Error ? i.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Rt(e) {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "loadPages",
      success: !0,
      error: !1,
      message: "Pages loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        pages: figma.root.children.map((s, c) => ({
          name: s.name,
          index: c
        }))
      }
    };
  } catch (a) {
    return console.error("Error loading pages:", a), {
      type: "loadPages",
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {}
    };
  }
}
const ne = {
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
  dashPattern: [],
  constraintHorizontal: "MIN",
  // Default: Left/Top
  constraintVertical: "MIN"
  // Default: Left/Top
}, re = ce(q({}, ne), {
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
}), fe = ce(q({}, ne), {
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
}), Ne = ce(q({}, ne), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), rt = ce(q({}, ne), {
  cornerRadius: 0
}), kt = ce(q({}, ne), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function Lt(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return re;
    case "TEXT":
      return fe;
    case "VECTOR":
      return Ne;
    case "LINE":
      return kt;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return rt;
    default:
      return ne;
  }
}
function K(e, a) {
  if (Array.isArray(e))
    return Array.isArray(a) ? e.length !== a.length || e.some((i, n) => K(i, a[n])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof a == "object" && a !== null) {
      const i = Object.keys(e), n = Object.keys(a);
      return i.length !== n.length ? !0 : i.some(
        (s) => !(s in a) || K(e[s], a[s])
      );
    }
    return !0;
  }
  return e !== a;
}
const we = {
  LAYER: "00000000-0000-0000-0000-000000000001",
  TOKENS: "00000000-0000-0000-0000-000000000002",
  THEME: "00000000-0000-0000-0000-000000000003"
}, he = {
  LAYER: "Layer",
  TOKENS: "Tokens",
  THEME: "Theme"
};
function de(e) {
  const a = e.trim(), n = a.replace(/_\d+$/, "").toLowerCase();
  return n === "themes" || n === "theme" ? he.THEME : n === "token" || n === "tokens" ? he.TOKENS : n === "layer" || n === "layers" ? he.LAYER : a;
}
function ye(e) {
  const a = de(e);
  return a === he.LAYER || a === he.TOKENS || a === he.THEME;
}
function Ue(e) {
  const a = de(e);
  if (a === he.LAYER)
    return we.LAYER;
  if (a === he.TOKENS)
    return we.TOKENS;
  if (a === he.THEME)
    return we.THEME;
}
class Oe {
  constructor() {
    ge(this, "collectionMap");
    // collectionId -> index
    ge(this, "collections");
    // index -> collection data
    ge(this, "normalizedNameMap");
    // normalized name -> index (for standard collections)
    ge(this, "nextIndex");
    this.collectionMap = /* @__PURE__ */ new Map(), this.collections = [], this.normalizedNameMap = /* @__PURE__ */ new Map(), this.nextIndex = 0;
  }
  /**
   * Finds a collection by normalized name (for standard collections)
   * Returns the index if found, -1 otherwise
   */
  findCollectionByNormalizedName(a) {
    return this.normalizedNameMap.get(a);
  }
  /**
   * Merges modes from a new collection into an existing collection entry
   * Ensures all unique modes are present
   */
  mergeModes(a, i) {
    const n = new Set(a);
    for (const s of i)
      n.add(s);
    return Array.from(n);
  }
  /**
   * Adds a collection to the table if it doesn't already exist
   * For standard collections (Layer, Tokens, Theme), merges by normalized name
   * Returns the index of the collection (existing or newly added)
   */
  addCollection(a) {
    const i = a.collectionId;
    if (this.collectionMap.has(i))
      return this.collectionMap.get(i);
    const n = de(
      a.collectionName
    );
    if (ye(a.collectionName)) {
      const o = this.findCollectionByNormalizedName(n);
      if (o !== void 0) {
        const d = this.collections[o];
        return d.modes = this.mergeModes(
          d.modes,
          a.modes
        ), this.collectionMap.set(i, o), o;
      }
    }
    const s = this.nextIndex++;
    this.collectionMap.set(i, s);
    const c = ce(q({}, a), {
      collectionName: n
    });
    if (ye(a.collectionName)) {
      const o = Ue(
        a.collectionName
      );
      o && (c.collectionGuid = o), this.normalizedNameMap.set(n, s);
    }
    return this.collections[s] = c, s;
  }
  /**
   * Gets the index of a collection by its collectionId
   * Returns -1 if not found
   */
  getCollectionIndex(a) {
    var i;
    return (i = this.collectionMap.get(a)) != null ? i : -1;
  }
  /**
   * Gets a collection entry by index
   */
  getCollectionByIndex(a) {
    return this.collections[a];
  }
  /**
   * Gets the complete table as an object with string keys
   * Used for internal operations (includes all fields)
   */
  getTable() {
    const a = {};
    for (let i = 0; i < this.collections.length; i++)
      a[String(i)] = this.collections[i];
    return a;
  }
  /**
   * Gets the table with only serialized fields (excludes internal-only fields)
   * Used for JSON serialization to reduce size
   * Filters out: collectionId, isLocal (internal-only fields)
   * Keeps: collectionName, collectionGuid, modes
   */
  getSerializedTable() {
    const a = {};
    for (let i = 0; i < this.collections.length; i++) {
      const n = this.collections[i], s = q({
        collectionName: n.collectionName,
        modes: n.modes
      }, n.collectionGuid && { collectionGuid: n.collectionGuid });
      a[String(i)] = s;
    }
    return a;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   * Handles both new format (without collectionId/isLocal) and legacy format (with collectionId/isLocal)
   */
  static fromTable(a) {
    var s;
    const i = new Oe(), n = Object.entries(a).sort(
      (c, o) => parseInt(c[0], 10) - parseInt(o[0], 10)
    );
    for (const [c, o] of n) {
      const d = parseInt(c, 10), m = (s = o.isLocal) != null ? s : !0, f = de(
        o.collectionName || ""
      ), p = o.collectionId || o.collectionGuid || `temp:${d}:${f}`, y = q({
        collectionName: f,
        collectionId: p,
        isLocal: m,
        modes: o.modes || []
      }, o.collectionGuid && {
        collectionGuid: o.collectionGuid
      });
      i.collectionMap.set(p, d), i.collections[d] = y, ye(f) && i.normalizedNameMap.set(f, d), i.nextIndex = Math.max(
        i.nextIndex,
        d + 1
      );
    }
    return i;
  }
  /**
   * Gets the total number of collections in the table
   */
  getSize() {
    return this.collections.length;
  }
}
const Bt = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, Ft = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function Ut(e) {
  var i;
  const a = e.toUpperCase();
  return (i = Bt[a]) != null ? i : e;
}
function Gt(e) {
  var a;
  return typeof e == "number" ? (a = Ft[e]) != null ? a : e.toString() : e;
}
class Me {
  constructor() {
    ge(this, "variableMap");
    // variableKey -> index
    ge(this, "variables");
    // index -> variable data
    ge(this, "nextIndex");
    this.variableMap = /* @__PURE__ */ new Map(), this.variables = [], this.nextIndex = 0;
  }
  /**
   * Adds a variable to the table if it doesn't already exist
   * Returns the index of the variable (existing or newly added)
   */
  addVariable(a) {
    const i = a.variableKey;
    if (!i)
      return -1;
    if (this.variableMap.has(i))
      return this.variableMap.get(i);
    const n = this.nextIndex++;
    return this.variableMap.set(i, n), this.variables[n] = a, n;
  }
  /**
   * Gets the index of a variable by its variableKey
   * Returns -1 if not found
   */
  getVariableIndex(a) {
    var i;
    return (i = this.variableMap.get(a)) != null ? i : -1;
  }
  /**
   * Gets a variable entry by index
   */
  getVariableByIndex(a) {
    return this.variables[a];
  }
  /**
   * Gets the complete table as an object with string keys
   * Used for JSON serialization
   * Includes all fields (for backward compatibility)
   */
  getTable() {
    const a = {};
    for (let i = 0; i < this.variables.length; i++)
      a[String(i)] = this.variables[i];
    return a;
  }
  /**
   * Serializes valuesByMode, removing type and id from VariableAliasSerialized objects
   * Only keeps _varRef since that's sufficient to identify a variable reference
   */
  serializeValuesByMode(a) {
    if (!a)
      return;
    const i = {};
    for (const [n, s] of Object.entries(a))
      typeof s == "object" && s !== null && "_varRef" in s && typeof s._varRef == "number" ? i[n] = {
        _varRef: s._varRef
      } : i[n] = s;
    return i;
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
    const a = {};
    for (let i = 0; i < this.variables.length; i++) {
      const n = this.variables[i], s = this.serializeValuesByMode(
        n.valuesByMode
      ), c = q(q({
        variableName: n.variableName,
        variableType: Ut(n.variableType)
      }, n._colRef !== void 0 && { _colRef: n._colRef }), s && { valuesByMode: s });
      a[String(i)] = c;
    }
    return a;
  }
  /**
   * Reconstructs a VariableTable from a serialized table object
   * Handles both new format (without variableKey) and legacy format (with variableKey)
   * Expands compressed variable types (numbers) back to strings
   */
  static fromTable(a) {
    const i = new Me(), n = Object.entries(a).sort(
      (s, c) => parseInt(s[0], 10) - parseInt(c[0], 10)
    );
    for (const [s, c] of n) {
      const o = parseInt(s, 10), d = Gt(c.variableType), m = ce(q({}, c), {
        variableType: d
        // Always a string after expansion
      });
      i.variables[o] = m, i.nextIndex = Math.max(i.nextIndex, o + 1);
    }
    return i;
  }
  /**
   * Gets the total number of variables in the table
   */
  getSize() {
    return this.variables.length;
  }
}
function _t(e) {
  return {
    _varRef: e
  };
}
function $e(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let zt = 0;
const Ve = /* @__PURE__ */ new Map();
function jt(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const a = Ve.get(e.requestId);
  a && (Ve.delete(e.requestId), e.error || !e.guid ? a.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : a.resolve(e.guid));
}
function Xe() {
  return new Promise((e, a) => {
    const i = `guid_${Date.now()}_${++zt}`;
    Ve.set(i, { resolve: e, reject: a }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: i
    }), setTimeout(() => {
      Ve.has(i) && (Ve.delete(i), a(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
async function Re() {
  return new Promise((e) => setTimeout(e, 0));
}
const t = {
  clear: async () => {
    console.clear(), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: "__CLEAR__"
      }
    }), await Re();
  },
  log: async (e) => {
    console.log(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    }), await Re();
  },
  warning: async (e) => {
    console.warn(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    }), await Re();
  },
  error: async (e) => {
    console.error(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    }), await Re();
  }
};
function Dt(e, a) {
  const i = a.modes.find((n) => n.modeId === e);
  return i ? i.name : e;
}
async function st(e, a, i, n, s = /* @__PURE__ */ new Set()) {
  const c = {};
  for (const [o, d] of Object.entries(e)) {
    const m = Dt(o, n);
    if (d == null) {
      c[m] = d;
      continue;
    }
    if (typeof d == "string" || typeof d == "number" || typeof d == "boolean") {
      c[m] = d;
      continue;
    }
    if (typeof d == "object" && d !== null && "type" in d && d.type === "VARIABLE_ALIAS" && "id" in d) {
      const f = d.id;
      if (s.has(f)) {
        c[m] = {
          type: "VARIABLE_ALIAS",
          id: f
        };
        continue;
      }
      const p = await figma.variables.getVariableByIdAsync(f);
      if (!p) {
        c[m] = {
          type: "VARIABLE_ALIAS",
          id: f
        };
        continue;
      }
      const y = new Set(s);
      y.add(f);
      const r = await figma.variables.getVariableCollectionByIdAsync(
        p.variableCollectionId
      ), h = p.key;
      if (!h) {
        c[m] = {
          type: "VARIABLE_ALIAS",
          id: f
        };
        continue;
      }
      const l = {
        variableName: p.name,
        variableType: p.resolvedType,
        collectionName: r == null ? void 0 : r.name,
        collectionId: p.variableCollectionId,
        variableKey: h,
        id: f,
        isLocal: !p.remote
      };
      if (r) {
        const g = await ct(
          r,
          i
        );
        l._colRef = g, p.valuesByMode && (l.valuesByMode = await st(
          p.valuesByMode,
          a,
          i,
          r,
          // Pass collection for mode ID to name conversion
          y
        ));
      }
      const v = a.addVariable(l);
      c[m] = {
        type: "VARIABLE_ALIAS",
        id: f,
        _varRef: v
      };
    } else
      c[m] = d;
  }
  return c;
}
const ke = "recursica:collectionId";
async function Jt(e) {
  if (e.remote === !0) {
    const i = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(i)) {
      const s = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await t.error(s), new Error(s);
    }
    return e.id;
  } else {
    if (ye(e.name)) {
      const s = Ue(e.name);
      if (s) {
        const c = e.getSharedPluginData(
          "recursica",
          ke
        );
        return (!c || c.trim() === "") && e.setSharedPluginData(
          "recursica",
          ke,
          s
        ), s;
      }
    }
    const i = e.getSharedPluginData(
      "recursica",
      ke
    );
    if (i && i.trim() !== "")
      return i;
    const n = await Xe();
    return e.setSharedPluginData("recursica", ke, n), n;
  }
}
function Ht(e, a) {
  if (a)
    return;
  const i = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(i))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function ct(e, a) {
  const i = !e.remote, n = a.getCollectionIndex(e.id);
  if (n !== -1)
    return n;
  Ht(e.name, i);
  const s = await Jt(e), c = e.modes.map((f) => f.name), o = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: i,
    modes: c,
    collectionGuid: s
  }, d = a.addCollection(o), m = i ? "local" : "remote";
  return await t.log(
    `  Added ${m} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), d;
}
async function Je(e, a, i) {
  if (!e || typeof e != "object" || e.type !== "VARIABLE_ALIAS")
    return null;
  try {
    const n = await figma.variables.getVariableByIdAsync(e.id);
    if (!n)
      return console.log("Could not resolve variable alias:", e.id), null;
    const s = await figma.variables.getVariableCollectionByIdAsync(
      n.variableCollectionId
    );
    if (!s)
      return console.log("Could not resolve collection for variable:", e.id), null;
    const c = n.key;
    if (!c)
      return console.log("Variable missing key:", e.id), null;
    const o = await ct(
      s,
      i
    ), d = {
      variableName: n.name,
      variableType: n.resolvedType,
      _colRef: o,
      // Reference to collection table (v2.4.0+)
      variableKey: c,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    n.valuesByMode && (d.valuesByMode = await st(
      n.valuesByMode,
      a,
      i,
      s,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const m = a.addVariable(d);
    return _t(m);
  } catch (n) {
    const s = n instanceof Error ? n.message : String(n);
    throw console.error("Could not resolve variable alias:", e.id, n), new Error(
      `Failed to resolve variable alias ${e.id}: ${s}`
    );
  }
}
async function Ce(e, a, i) {
  if (!e || typeof e != "object") return e;
  const n = {};
  for (const s in e)
    if (Object.prototype.hasOwnProperty.call(e, s)) {
      const c = e[s];
      if (c && typeof c == "object" && !Array.isArray(c))
        if (c.type === "VARIABLE_ALIAS") {
          const o = await Je(
            c,
            a,
            i
          );
          o && (n[s] = o);
        } else
          n[s] = await Ce(
            c,
            a,
            i
          );
      else Array.isArray(c) ? n[s] = await Promise.all(
        c.map(async (o) => (o == null ? void 0 : o.type) === "VARIABLE_ALIAS" ? await Je(
          o,
          a,
          i
        ) || o : o && typeof o == "object" ? await Ce(
          o,
          a,
          i
        ) : o)
      ) : n[s] = c;
    }
  return n;
}
async function lt(e, a, i) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (n) => {
      if (!n || typeof n != "object") return n;
      const s = {};
      for (const c in n)
        Object.prototype.hasOwnProperty.call(n, c) && (c === "boundVariables" ? s[c] = await Ce(
          n[c],
          a,
          i
        ) : s[c] = n[c]);
      return s;
    })
  );
}
async function dt(e, a, i) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (n) => {
      if (!n || typeof n != "object") return n;
      const s = {};
      for (const c in n)
        Object.prototype.hasOwnProperty.call(n, c) && (c === "boundVariables" ? s[c] = await Ce(
          n[c],
          a,
          i
        ) : s[c] = n[c]);
      return s;
    })
  );
}
const Te = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  extractBoundVariables: Ce,
  resolveVariableAliasMetadata: Je,
  serializeBackgrounds: dt,
  serializeFills: lt
}, Symbol.toStringTag, { value: "Module" }));
async function gt(e, a) {
  const i = {}, n = /* @__PURE__ */ new Set();
  e.type && (i.type = e.type, n.add("type")), e.id && (i.id = e.id, n.add("id")), e.name !== void 0 && e.name !== "" && (i.name = e.name, n.add("name")), e.x !== void 0 && e.x !== 0 && (i.x = e.x, n.add("x")), e.y !== void 0 && e.y !== 0 && (i.y = e.y, n.add("y")), e.width !== void 0 && (i.width = e.width, n.add("width")), e.height !== void 0 && (i.height = e.height, n.add("height"));
  const s = e.name || "Unnamed";
  if (e.preserveRatio !== void 0 && console.log(
    `[ISSUE #3 EXPORT DEBUG] "${s}" has preserveRatio: ${e.preserveRatio} (NOT being exported - needs to be added!)`
  ), e.constraintHorizontal !== void 0) {
    const c = e.constraintHorizontal;
    K(
      c,
      ne.constraintHorizontal
    ) && (i.constraintHorizontal = c, n.add("constraintHorizontal"));
  }
  if (e.constraintVertical !== void 0) {
    const c = e.constraintVertical;
    K(c, ne.constraintVertical) && (i.constraintVertical = c, n.add("constraintVertical"));
  }
  if (e.visible !== void 0 && K(e.visible, ne.visible) && (i.visible = e.visible, n.add("visible")), e.locked !== void 0 && K(e.locked, ne.locked) && (i.locked = e.locked, n.add("locked")), e.opacity !== void 0 && K(e.opacity, ne.opacity) && (i.opacity = e.opacity, n.add("opacity")), e.rotation !== void 0 && K(e.rotation, ne.rotation) && (i.rotation = e.rotation, n.add("rotation")), e.blendMode !== void 0 && K(e.blendMode, ne.blendMode) && (i.blendMode = e.blendMode, n.add("blendMode")), e.effects !== void 0 && K(e.effects, ne.effects) && (i.effects = e.effects, n.add("effects")), e.fills !== void 0) {
    const c = await lt(
      e.fills,
      a.variableTable,
      a.collectionTable
    );
    K(c, ne.fills) && (i.fills = c), n.add("fills");
  }
  if (e.strokes !== void 0 && K(e.strokes, ne.strokes) && (i.strokes = e.strokes, n.add("strokes")), e.strokeWeight !== void 0 && K(e.strokeWeight, ne.strokeWeight) && (i.strokeWeight = e.strokeWeight, n.add("strokeWeight")), e.strokeAlign !== void 0 && K(e.strokeAlign, ne.strokeAlign) && (i.strokeAlign = e.strokeAlign, n.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const c = await Ce(
      e.boundVariables,
      a.variableTable,
      a.collectionTable
    );
    Object.keys(c).length > 0 && (i.boundVariables = c), n.add("boundVariables");
  }
  if (e.backgrounds !== void 0) {
    const c = await dt(
      e.backgrounds,
      a.variableTable,
      a.collectionTable
    );
    c && Array.isArray(c) && c.length > 0 && (i.backgrounds = c), n.add("backgrounds");
  }
  return i;
}
const Wt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseBaseNodeProperties: gt
}, Symbol.toStringTag, { value: "Module" }));
async function He(e, a) {
  const i = {}, n = /* @__PURE__ */ new Set();
  if (e.type === "COMPONENT")
    try {
      e.componentPropertyDefinitions && (i.componentPropertyDefinitions = e.componentPropertyDefinitions, n.add("componentPropertyDefinitions"));
    } catch (s) {
    }
  return e.layoutMode !== void 0 && K(e.layoutMode, re.layoutMode) && (i.layoutMode = e.layoutMode, n.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && K(
    e.primaryAxisSizingMode,
    re.primaryAxisSizingMode
  ) && (i.primaryAxisSizingMode = e.primaryAxisSizingMode, n.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && K(
    e.counterAxisSizingMode,
    re.counterAxisSizingMode
  ) && (i.counterAxisSizingMode = e.counterAxisSizingMode, n.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && K(
    e.primaryAxisAlignItems,
    re.primaryAxisAlignItems
  ) && (i.primaryAxisAlignItems = e.primaryAxisAlignItems, n.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && K(
    e.counterAxisAlignItems,
    re.counterAxisAlignItems
  ) && (i.counterAxisAlignItems = e.counterAxisAlignItems, n.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && K(e.paddingLeft, re.paddingLeft) && (i.paddingLeft = e.paddingLeft, n.add("paddingLeft")), e.paddingRight !== void 0 && K(e.paddingRight, re.paddingRight) && (i.paddingRight = e.paddingRight, n.add("paddingRight")), e.paddingTop !== void 0 && K(e.paddingTop, re.paddingTop) && (i.paddingTop = e.paddingTop, n.add("paddingTop")), e.paddingBottom !== void 0 && K(e.paddingBottom, re.paddingBottom) && (i.paddingBottom = e.paddingBottom, n.add("paddingBottom")), e.itemSpacing !== void 0 && K(e.itemSpacing, re.itemSpacing) && (i.itemSpacing = e.itemSpacing, n.add("itemSpacing")), e.counterAxisSpacing !== void 0 && K(
    e.counterAxisSpacing,
    re.counterAxisSpacing
  ) && (i.counterAxisSpacing = e.counterAxisSpacing, n.add("counterAxisSpacing")), e.cornerRadius !== void 0 && K(e.cornerRadius, re.cornerRadius) && (i.cornerRadius = e.cornerRadius, n.add("cornerRadius")), e.clipsContent !== void 0 && K(e.clipsContent, re.clipsContent) && (i.clipsContent = e.clipsContent, n.add("clipsContent")), e.layoutWrap !== void 0 && K(e.layoutWrap, re.layoutWrap) && (i.layoutWrap = e.layoutWrap, n.add("layoutWrap")), e.layoutGrow !== void 0 && K(e.layoutGrow, re.layoutGrow) && (i.layoutGrow = e.layoutGrow, n.add("layoutGrow")), i;
}
const Kt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseFrameProperties: He
}, Symbol.toStringTag, { value: "Module" }));
async function qt(e, a) {
  const i = {}, n = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (i.characters = e.characters, n.add("characters")), e.fontName !== void 0 && (i.fontName = e.fontName, n.add("fontName")), e.fontSize !== void 0 && (i.fontSize = e.fontSize, n.add("fontSize")), e.textAlignHorizontal !== void 0 && K(
    e.textAlignHorizontal,
    fe.textAlignHorizontal
  ) && (i.textAlignHorizontal = e.textAlignHorizontal, n.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && K(
    e.textAlignVertical,
    fe.textAlignVertical
  ) && (i.textAlignVertical = e.textAlignVertical, n.add("textAlignVertical")), e.letterSpacing !== void 0 && K(e.letterSpacing, fe.letterSpacing) && (i.letterSpacing = e.letterSpacing, n.add("letterSpacing")), e.lineHeight !== void 0 && K(e.lineHeight, fe.lineHeight) && (i.lineHeight = e.lineHeight, n.add("lineHeight")), e.textCase !== void 0 && K(e.textCase, fe.textCase) && (i.textCase = e.textCase, n.add("textCase")), e.textDecoration !== void 0 && K(e.textDecoration, fe.textDecoration) && (i.textDecoration = e.textDecoration, n.add("textDecoration")), e.textAutoResize !== void 0 && K(e.textAutoResize, fe.textAutoResize) && (i.textAutoResize = e.textAutoResize, n.add("textAutoResize")), e.paragraphSpacing !== void 0 && K(
    e.paragraphSpacing,
    fe.paragraphSpacing
  ) && (i.paragraphSpacing = e.paragraphSpacing, n.add("paragraphSpacing")), e.paragraphIndent !== void 0 && K(e.paragraphIndent, fe.paragraphIndent) && (i.paragraphIndent = e.paragraphIndent, n.add("paragraphIndent")), e.listOptions !== void 0 && K(e.listOptions, fe.listOptions) && (i.listOptions = e.listOptions, n.add("listOptions")), i;
}
function Xt(e) {
  const a = e.match(/^(\d+\.?\d*)[eE]([+-]?\d+)$/);
  if (a) {
    const i = parseFloat(a[1]), n = parseInt(a[2]), s = i * Math.pow(10, n);
    return Math.abs(s) < 1e-10 ? "0" : s.toFixed(6).replace(/\.?0+$/, "") || "0";
  }
  return e;
}
function mt(e) {
  if (!e || typeof e != "string")
    return e;
  let a = e.replace(/(\d+\.?\d*)[eE]([+-]?\d+)/g, (i) => Xt(i));
  return a = a.replace(
    /(\d+\.\d{7,})/g,
    // Match numbers with more than 6 decimal places
    (i) => {
      const n = parseFloat(i);
      return Math.abs(n) < 1e-10 ? "0" : n.toFixed(6).replace(/\.?0+$/, "") || "0";
    }
  ), a = a.replace(
    /([MmLlHhVvCcSsQqTtAaZz])([-\d])/g,
    (i, n, s) => `${n} ${s}`
  ), a = a.replace(/\s+/g, " ").trim(), a;
}
function We(e) {
  return Array.isArray(e) ? e.map((a) => ({
    data: mt(a.data),
    // Normalize winding rule key (use windRule consistently)
    windRule: a.windRule || a.windingRule || "NONZERO"
  })) : e;
}
const Yt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  normalizeSvgPath: mt,
  normalizeVectorGeometry: We
}, Symbol.toStringTag, { value: "Module" }));
async function Zt(e, a) {
  const i = {}, n = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && K(e.fillGeometry, Ne.fillGeometry) && (i.fillGeometry = We(e.fillGeometry), n.add("fillGeometry")), e.strokeGeometry !== void 0 && K(e.strokeGeometry, Ne.strokeGeometry) && (i.strokeGeometry = We(e.strokeGeometry), n.add("strokeGeometry")), e.strokeCap !== void 0 && K(e.strokeCap, Ne.strokeCap) && (i.strokeCap = e.strokeCap, n.add("strokeCap")), e.strokeJoin !== void 0 && K(e.strokeJoin, Ne.strokeJoin) && (i.strokeJoin = e.strokeJoin, n.add("strokeJoin")), e.dashPattern !== void 0 && K(e.dashPattern, Ne.dashPattern) && (i.dashPattern = e.dashPattern, n.add("dashPattern")), i;
}
async function Qt(e, a) {
  const i = {}, n = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && K(e.cornerRadius, rt.cornerRadius) && (i.cornerRadius = e.cornerRadius, n.add("cornerRadius")), e.pointCount !== void 0 && (i.pointCount = e.pointCount, n.add("pointCount")), e.innerRadius !== void 0 && (i.innerRadius = e.innerRadius, n.add("innerRadius")), e.pointCount !== void 0 && (i.pointCount = e.pointCount, n.add("pointCount")), i;
}
const Le = /* @__PURE__ */ new Map();
let ea = 0;
function ta() {
  return `prompt_${Date.now()}_${++ea}`;
}
const Ie = {
  /**
   * Prompt the user with a message and wait for OK or Cancel response
   * @param message - The message to display to the user
   * @param optionsOrTimeout - Optional configuration object or timeout in milliseconds (for backwards compatibility)
   * @param optionsOrTimeout.timeoutMs - Timeout in milliseconds. Defaults to 300000 (5 minutes). Set to -1 for no timeout.
   * @param optionsOrTimeout.okLabel - Custom label for the OK button. Defaults to "OK".
   * @param optionsOrTimeout.cancelLabel - Custom label for the cancel button. Defaults to "Cancel".
   * @returns Promise that resolves on OK, rejects on Cancel or timeout
   */
  prompt: (e, a) => {
    var d;
    const i = typeof a == "number" ? { timeoutMs: a } : a, n = (d = i == null ? void 0 : i.timeoutMs) != null ? d : 3e5, s = i == null ? void 0 : i.okLabel, c = i == null ? void 0 : i.cancelLabel, o = ta();
    return new Promise((m, f) => {
      const p = n === -1 ? null : setTimeout(() => {
        Le.delete(o), f(new Error(`Plugin prompt timeout: ${e}`));
      }, n);
      Le.set(o, {
        resolve: m,
        reject: f,
        timeout: p
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: q(q({
          message: e,
          requestId: o
        }, s && { okLabel: s }), c && { cancelLabel: c })
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
    const { requestId: a, action: i } = e, n = Le.get(a);
    if (!n) {
      console.warn(
        `Received response for unknown prompt request: ${a}`
      );
      return;
    }
    n.timeout && clearTimeout(n.timeout), Le.delete(a), i === "ok" ? n.resolve() : n.reject(new Error("User cancelled"));
  }
}, aa = "RecursicaPublishedMetadata";
function De(e) {
  let a = e, i = !1;
  try {
    if (i = a.parent !== null && a.parent !== void 0, !i)
      return { page: null, reason: "detached" };
  } catch (n) {
    return { page: null, reason: "detached" };
  }
  for (; a; ) {
    if (a.type === "PAGE")
      return { page: a, reason: "found" };
    try {
      const n = a.parent;
      if (!n)
        return { page: null, reason: "broken_chain" };
      a = n;
    } catch (n) {
      return { page: null, reason: "access_error" };
    }
  }
  return { page: null, reason: "broken_chain" };
}
function it(e) {
  try {
    const a = e.getPluginData(aa);
    if (!a || a.trim() === "")
      return null;
    const i = JSON.parse(a);
    return {
      id: i.id,
      version: i.version
    };
  } catch (a) {
    return null;
  }
}
async function ia(e, a) {
  var s, c;
  const i = {}, n = /* @__PURE__ */ new Set();
  if (i._isInstance = !0, n.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const o = await e.getMainComponentAsync();
    if (!o) {
      const T = e.name || "(unnamed)", x = e.id;
      if (a.detachedComponentsHandled.has(x))
        await t.log(
          `Treating detached instance "${T}" as internal instance (already prompted)`
        );
      else {
        await t.warning(
          `Found detached instance: "${T}" (main component is missing)`
        );
        const $ = `Found detached instance "${T}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await Ie.prompt($, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), a.detachedComponentsHandled.add(x), await t.log(
            `Treating detached instance "${T}" as internal instance`
          );
        } catch (P) {
          if (P instanceof Error && P.message === "User cancelled") {
            const U = `Export cancelled: Detached instance "${T}" found. Please fix the instance before exporting.`;
            await t.error(U);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch (z) {
              console.warn("Could not scroll to instance:", z);
            }
            throw new Error(U);
          } else
            throw P;
        }
      }
      if (!De(e).page) {
        const $ = `Detached instance "${T}" is not on any page. Cannot export.`;
        throw await t.error($), new Error($);
      }
      let L, B;
      try {
        e.variantProperties && (L = e.variantProperties), e.componentProperties && (B = e.componentProperties);
      } catch ($) {
      }
      const I = q(q({
        instanceType: "internal",
        componentName: T,
        componentNodeId: e.id
      }, L && { variantProperties: L }), B && { componentProperties: B }), _ = a.instanceTable.addInstance(I);
      return i._instanceRef = _, n.add("_instanceRef"), await t.log(
        `  Exported detached INSTANCE: "${T}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), i;
    }
    const d = e.name || "(unnamed)", m = o.name || "(unnamed)", f = o.remote === !0, y = De(e).page, r = De(o);
    let h = r.page;
    if (!h && f)
      try {
        await figma.loadAllPagesAsync();
        const T = figma.root.children;
        let x = null;
        for (const C of T)
          try {
            if (C.findOne(
              (L) => L.id === o.id
            )) {
              x = C;
              break;
            }
          } catch (k) {
          }
        if (!x) {
          const C = o.id.split(":")[0];
          for (const k of T) {
            const L = k.id.split(":")[0];
            if (C === L) {
              x = k;
              break;
            }
          }
        }
        x && (h = x);
      } catch (T) {
      }
    let l, v = h;
    if (f)
      if (h) {
        const T = it(h);
        l = "normal", v = h, T != null && T.id ? await t.log(
          `  Component "${m}" is from library but also exists on local page "${h.name}" with metadata. Treating as "normal" instance.`
        ) : await t.log(
          `  Component "${m}" is from library and exists on local page "${h.name}" (no metadata). Treating as "normal" instance - page should be published first.`
        );
      } else
        l = "remote", await t.log(
          `  Component "${m}" is from library and not on a local page. Treating as "remote" instance.`
        );
    else if (h && y && h.id === y.id)
      l = "internal";
    else if (h && y && h.id !== y.id)
      l = "normal";
    else if (h && !y)
      l = "normal";
    else if (!f && r.reason === "detached") {
      const T = o.id;
      if (a.detachedComponentsHandled.has(T))
        l = "remote", await t.log(
          `Treating detached instance "${d}" -> component "${m}" as remote instance (already prompted)`
        );
      else {
        await t.warning(
          `Found detached instance: "${d}" -> component "${m}" (component is not on any page)`
        );
        try {
          await figma.viewport.scrollAndZoomIntoView([o]);
        } catch (C) {
          console.warn("Could not scroll to component:", C);
        }
        const x = `Found detached instance "${d}" attached to component "${m}". This should be fixed. Continue to publish?`;
        try {
          await Ie.prompt(x, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), a.detachedComponentsHandled.add(T), l = "remote", await t.log(
            `Treating detached instance "${d}" as remote instance (will be created on REMOTES page)`
          );
        } catch (C) {
          if (C instanceof Error && C.message === "User cancelled") {
            const k = `Export cancelled: Detached instance "${d}" found. The component "${m}" is not on any page. Please fix the instance before exporting.`;
            throw await t.error(k), new Error(k);
          } else
            throw C;
        }
      }
    } else
      f || await t.warning(
        `  Instance "${d}" -> component "${m}": componentPage is null but component is not remote. Reason: ${r.reason}. Cannot determine instance type.`
      ), l = "normal";
    let g, u;
    try {
      if (e.variantProperties && (g = e.variantProperties, await t.log(
        `  Instance "${d}" -> variantProperties from instance: ${JSON.stringify(g)}`
      )), typeof e.getProperties == "function")
        try {
          const T = await e.getProperties();
          T && T.variantProperties && (await t.log(
            `  Instance "${d}" -> variantProperties from getProperties(): ${JSON.stringify(T.variantProperties)}`
          ), T.variantProperties && Object.keys(T.variantProperties).length > 0 && (g = T.variantProperties));
        } catch (T) {
          await t.log(
            `  Instance "${d}" -> getProperties() not available or failed: ${T}`
          );
        }
      if (e.componentProperties && (u = e.componentProperties), o.parent && o.parent.type === "COMPONENT_SET") {
        const T = o.parent;
        try {
          const x = T.componentPropertyDefinitions;
          x && await t.log(
            `  Component set "${T.name}" has property definitions: ${JSON.stringify(Object.keys(x))}`
          );
          const C = {}, k = m.split(",").map((L) => L.trim());
          for (const L of k) {
            const B = L.split("=").map((I) => I.trim());
            if (B.length >= 2) {
              const I = B[0], _ = B.slice(1).join("=").trim();
              x && x[I] && (C[I] = _);
            }
          }
          if (Object.keys(C).length > 0 && await t.log(
            `  Parsed variant properties from component name "${m}": ${JSON.stringify(C)}`
          ), g && Object.keys(g).length > 0)
            await t.log(
              `  Using variant properties from instance (source of truth): ${JSON.stringify(g)}`
            );
          else if (Object.keys(C).length > 0)
            g = C, await t.log(
              `  Using variant properties from component name (fallback): ${JSON.stringify(g)}`
            );
          else if (o.variantProperties) {
            const L = o.variantProperties;
            await t.log(
              `  Main component "${m}" has variantProperties: ${JSON.stringify(L)}`
            ), g = L;
          }
        } catch (x) {
          await t.warning(
            `  Could not get variant properties from component set: ${x}`
          );
        }
      }
    } catch (T) {
    }
    let b, R;
    try {
      let T = o.parent;
      const x = [];
      let C = 0;
      const k = 20;
      for (; T && C < k; )
        try {
          const L = T.type, B = T.name;
          if (L === "COMPONENT_SET" && !R && (R = B), L === "PAGE")
            break;
          const I = B || "";
          x.unshift(I), (R === "arrow-top-right-on-square" || m === "arrow-top-right-on-square") && await t.log(
            `  [PATH BUILD] Added segment: "${I}" (type: ${L}) to path for component "${m}"`
          ), T = T.parent, C++;
        } catch (L) {
          (R === "arrow-top-right-on-square" || m === "arrow-top-right-on-square") && await t.warning(
            `  [PATH BUILD] Error building path for "${m}": ${L}`
          );
          break;
        }
      b = x, (R === "arrow-top-right-on-square" || m === "arrow-top-right-on-square") && await t.log(
        `  [PATH BUILD] Final path for component "${m}": [${x.join(" → ")}]`
      );
    } catch (T) {
    }
    const V = q(q(q(q({
      instanceType: l,
      componentName: m
    }, R && { componentSetName: R }), g && { variantProperties: g }), u && { componentProperties: u }), l === "normal" ? { path: b || [] } : b && b.length > 0 && {
      path: b
    });
    if (l === "internal") {
      V.componentNodeId = o.id, await t.log(
        `  Found INSTANCE: "${d}" -> INTERNAL component "${m}" (ID: ${o.id.substring(0, 8)}...)`
      );
      const T = e.boundVariables, x = o.boundVariables;
      if (T && typeof T == "object") {
        const I = Object.keys(T);
        await t.log(
          `  DEBUG: Internal instance "${d}" -> boundVariables keys: ${I.length > 0 ? I.join(", ") : "none"}`
        );
        for (const $ of I) {
          const P = T[$], U = (P == null ? void 0 : P.type) || typeof P;
          await t.log(
            `  DEBUG:   boundVariables.${$}: type=${U}, value=${JSON.stringify(P)}`
          );
        }
        const _ = [
          "backgrounds",
          "selectionColor",
          "selectionColors",
          "selection",
          "selectColor"
        ];
        for (const $ of _)
          T[$] !== void 0 && await t.log(
            `  DEBUG:   Found potential "Selection colors" property: boundVariables.${$} = ${JSON.stringify(T[$])}`
          );
      } else
        await t.log(
          `  DEBUG: Internal instance "${d}" -> No boundVariables found on instance node`
        );
      if (x && typeof x == "object") {
        const I = Object.keys(x);
        await t.log(
          `  DEBUG: Main component "${m}" -> boundVariables keys: ${I.length > 0 ? I.join(", ") : "none"}`
        );
      }
      const C = e.backgrounds;
      if (C && Array.isArray(C)) {
        await t.log(
          `  DEBUG: Internal instance "${d}" -> backgrounds array length: ${C.length}`
        );
        for (let I = 0; I < C.length; I++) {
          const _ = C[I];
          if (_ && typeof _ == "object") {
            if (await t.log(
              `  DEBUG:   backgrounds[${I}] structure: ${JSON.stringify(Object.keys(_))}`
            ), _.boundVariables) {
              const $ = Object.keys(_.boundVariables);
              await t.log(
                `  DEBUG:   backgrounds[${I}].boundVariables keys: ${$.length > 0 ? $.join(", ") : "none"}`
              );
              for (const P of $) {
                const U = _.boundVariables[P];
                await t.log(
                  `  DEBUG:     backgrounds[${I}].boundVariables.${P}: ${JSON.stringify(U)}`
                );
              }
            }
            _.color && await t.log(
              `  DEBUG:   backgrounds[${I}].color: ${JSON.stringify(_.color)}`
            );
          }
        }
      }
      const k = Object.keys(e).filter(
        (I) => !I.startsWith("_") && I !== "parent" && I !== "removed" && typeof e[I] != "function" && I !== "type" && I !== "id" && I !== "name" && I !== "boundVariables" && I !== "backgrounds" && I !== "fills"
      ), L = Object.keys(o).filter(
        (I) => !I.startsWith("_") && I !== "parent" && I !== "removed" && typeof o[I] != "function" && I !== "type" && I !== "id" && I !== "name" && I !== "boundVariables" && I !== "backgrounds" && I !== "fills"
      ), B = [
        .../* @__PURE__ */ new Set([...k, ...L])
      ].filter(
        (I) => I.toLowerCase().includes("selection") || I.toLowerCase().includes("select") || I.toLowerCase().includes("color") && !I.toLowerCase().includes("fill") && !I.toLowerCase().includes("stroke")
      );
      if (B.length > 0) {
        await t.log(
          `  DEBUG: Found selection/color-related properties: ${B.join(", ")}`
        );
        for (const I of B)
          try {
            if (k.includes(I)) {
              const _ = e[I];
              await t.log(
                `  DEBUG:   Instance.${I}: ${JSON.stringify(_)}`
              );
            }
            if (L.includes(I)) {
              const _ = o[I];
              await t.log(
                `  DEBUG:   MainComponent.${I}: ${JSON.stringify(_)}`
              );
            }
          } catch (_) {
          }
      } else
        await t.log(
          "  DEBUG: No selection/color-related properties found on instance or main component"
        );
    } else if (l === "normal") {
      const T = v || h;
      if (T) {
        V.componentPageName = T.name;
        const C = it(T);
        C != null && C.id && C.version !== void 0 ? (V.componentGuid = C.id, V.componentVersion = C.version, await t.log(
          `  Found INSTANCE: "${d}" -> NORMAL component "${m}" (ID: ${o.id.substring(0, 8)}...) at path [${(b || []).join(" → ")}]`
        )) : await t.warning(
          `  Instance "${d}" -> component "${m}" is classified as normal but page "${T.name}" has no metadata. This instance will not be importable.`
        );
      } else {
        const C = o.id;
        let k = "", L = "";
        switch (r.reason) {
          case "broken_chain":
            k = "The component's parent chain is broken and cannot be traversed to find the page", L = "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            k = "Cannot access the component's parent chain (access error)", L = "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            k = "Cannot determine which page the component is on", L = "Please ensure the component is properly placed on a page.";
        }
        try {
          await figma.viewport.scrollAndZoomIntoView([o]);
        } catch (_) {
          console.warn("Could not scroll to component:", _);
        }
        const B = `Normal instance "${d}" -> component "${m}" (ID: ${C}) has no componentPage. ${k}. ${L} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", B), await t.error(B);
        const I = new Error(B);
        throw console.error("Throwing error:", I), I;
      }
      b === void 0 && console.warn(
        `Failed to build path for normal instance "${d}" -> component "${m}". Path is required for resolution.`
      );
      const x = b && b.length > 0 ? ` at path [${b.join(" → ")}]` : " at page root";
      await t.log(
        `  Found INSTANCE: "${d}" -> NORMAL component "${m}" (ID: ${o.id.substring(0, 8)}...)${x}`
      );
    } else if (l === "remote") {
      let T, x;
      const C = a.detachedComponentsHandled.has(
        o.id
      );
      if (!C)
        try {
          if (typeof o.getPublishStatusAsync == "function")
            try {
              const L = await o.getPublishStatusAsync();
              L && typeof L == "object" && (L.libraryName && (T = L.libraryName), L.libraryKey && (x = L.libraryKey));
            } catch (L) {
            }
          try {
            const L = figma.teamLibrary;
            if (typeof (L == null ? void 0 : L.getAvailableLibraryComponentSetsAsync) == "function") {
              const B = await L.getAvailableLibraryComponentSetsAsync();
              if (B && Array.isArray(B)) {
                for (const I of B)
                  if (I.key === o.key || I.name === o.name) {
                    I.libraryName && (T = I.libraryName), I.libraryKey && (x = I.libraryKey);
                    break;
                  }
              }
            }
          } catch (L) {
          }
        } catch (L) {
          console.warn(
            `Error getting library info for remote component "${m}":`,
            L
          );
        }
      if (T && (V.remoteLibraryName = T), x && (V.remoteLibraryKey = x), C && (V.componentNodeId = o.id), a.instanceTable.getInstanceIndex(V) !== -1)
        await t.log(
          `  Found INSTANCE: "${d}" -> REMOTE component "${m}" (ID: ${o.id.substring(0, 8)}...)${C ? " [DETACHED]" : ""}`
        );
      else
        try {
          const { parseBaseNodeProperties: L } = await Promise.resolve().then(() => Wt), B = await L(e, a), { parseFrameProperties: I } = await Promise.resolve().then(() => Kt), _ = await I(e, a), $ = ce(q(q({}, B), _), {
            type: "COMPONENT"
            // Convert to COMPONENT type for recreation (must be after baseProps to override)
          });
          if (e.children && Array.isArray(e.children) && e.children.length > 0) {
            const P = ce(q({}, a), {
              depth: (a.depth || 0) + 1
            }), { extractNodeData: U } = await Promise.resolve().then(() => ca), z = [];
            for (const D of e.children)
              try {
                let j;
                if (D.type === "INSTANCE")
                  try {
                    const W = await D.getMainComponentAsync();
                    if (W) {
                      const Y = await L(
                        D,
                        a
                      ), S = await I(
                        D,
                        a
                      ), F = await U(
                        W,
                        /* @__PURE__ */ new WeakSet(),
                        P
                      );
                      j = ce(q(q(q({}, F), Y), S), {
                        type: "COMPONENT"
                        // Convert to COMPONENT
                      });
                    } else
                      j = await U(
                        D,
                        /* @__PURE__ */ new WeakSet(),
                        P
                      ), j.type === "INSTANCE" && (j.type = "COMPONENT"), delete j._instanceRef;
                  } catch (W) {
                    j = await U(
                      D,
                      /* @__PURE__ */ new WeakSet(),
                      P
                    ), j.type === "INSTANCE" && (j.type = "COMPONENT"), delete j._instanceRef;
                  }
                else {
                  j = await U(
                    D,
                    /* @__PURE__ */ new WeakSet(),
                    P
                  );
                  const W = D.boundVariables;
                  if (W && typeof W == "object") {
                    const Y = Object.keys(W);
                    Y.length > 0 && (await t.log(
                      `  DEBUG: Child "${D.name || "Unnamed"}" -> boundVariables keys: ${Y.join(", ")}`
                    ), W.backgrounds !== void 0 && await t.log(
                      `  DEBUG:   Child "${D.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(W.backgrounds)}`
                    ));
                  }
                  if (o.children && Array.isArray(o.children)) {
                    const Y = o.children.find(
                      (S) => S.name === D.name
                    );
                    if (Y) {
                      const S = Y.boundVariables;
                      if (S && typeof S == "object") {
                        const F = Object.keys(S);
                        if (F.length > 0 && (await t.log(
                          `  DEBUG: Main component child "${Y.name || "Unnamed"}" -> boundVariables keys: ${F.join(", ")}`
                        ), S.backgrounds !== void 0 && (await t.log(
                          `  DEBUG:   Main component child "${Y.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(S.backgrounds)}`
                        ), !W || !W.backgrounds))) {
                          await t.log(
                            "  DEBUG:   Instance child doesn't have boundVariables.backgrounds, but main component child does - preserving from main component"
                          );
                          const { extractBoundVariables: w } = await Promise.resolve().then(() => Te), N = await w(
                            S,
                            a.variableTable,
                            a.collectionTable
                          );
                          j.boundVariables || (j.boundVariables = {}), N.backgrounds && (j.boundVariables.backgrounds = N.backgrounds, await t.log(
                            "  DEBUG:   ✓ Added boundVariables.backgrounds to childData from main component child"
                          ));
                        }
                      }
                    }
                  }
                }
                z.push(j);
              } catch (j) {
                console.warn(
                  `Failed to extract child "${D.name || "Unnamed"}" for remote component "${m}":`,
                  j
                );
              }
            $.children = z;
          }
          if (!$)
            throw new Error("Failed to build structure for remote instance");
          try {
            const P = e.boundVariables;
            if (P && typeof P == "object") {
              const E = Object.keys(P);
              await t.log(
                `  DEBUG: Instance "${d}" -> boundVariables keys: ${E.length > 0 ? E.join(", ") : "none"}`
              );
              for (const A of E) {
                const M = P[A], J = (M == null ? void 0 : M.type) || typeof M;
                if (await t.log(
                  `  DEBUG:   boundVariables.${A}: type=${J}, value=${JSON.stringify(M)}`
                ), M && typeof M == "object" && !Array.isArray(M)) {
                  const H = Object.keys(M);
                  if (H.length > 0) {
                    await t.log(
                      `  DEBUG:     boundVariables.${A} has nested keys: ${H.join(", ")}`
                    );
                    for (const X of H) {
                      const ee = M[X];
                      ee && typeof ee == "object" && ee.type === "VARIABLE_ALIAS" && await t.log(
                        `  DEBUG:       boundVariables.${A}.${X}: VARIABLE_ALIAS id=${ee.id}`
                      );
                    }
                  }
                }
              }
              const O = [
                "backgrounds",
                "selectionColor",
                "selectionColors",
                "selection",
                "selectColor"
              ];
              for (const A of O)
                P[A] !== void 0 && await t.log(
                  `  DEBUG:   Found potential "Selection colors" property: boundVariables.${A} = ${JSON.stringify(P[A])}`
                );
            } else
              await t.log(
                `  DEBUG: Instance "${d}" -> No boundVariables found on instance node`
              );
            const U = P && P.fills !== void 0 && P.fills !== null, z = $.fills !== void 0 && Array.isArray($.fills) && $.fills.length > 0, D = e.fills !== void 0 && Array.isArray(e.fills) && e.fills.length > 0, j = o.fills !== void 0 && Array.isArray(o.fills) && o.fills.length > 0;
            if (await t.log(
              `  DEBUG: Instance "${d}" -> fills check: instanceHasFills=${D}, structureHasFills=${z}, mainComponentHasFills=${j}, hasInstanceFillsBoundVar=${!!U}`
            ), U && !z) {
              await t.log(
                "  DEBUG: Instance has boundVariables.fills but structure has no fills - attempting to get fills"
              );
              try {
                if (D) {
                  const { serializeFills: E } = await Promise.resolve().then(() => Te), O = await E(
                    e.fills,
                    a.variableTable,
                    a.collectionTable
                  );
                  $.fills = O, await t.log(
                    `  DEBUG: Got ${O.length} fill(s) from instance node`
                  );
                } else if (j) {
                  const { serializeFills: E } = await Promise.resolve().then(() => Te), O = await E(
                    o.fills,
                    a.variableTable,
                    a.collectionTable
                  );
                  $.fills = O, await t.log(
                    `  DEBUG: Got ${O.length} fill(s) from main component`
                  );
                } else
                  await t.warning(
                    "  DEBUG: Instance has boundVariables.fills but neither instance nor main component has fills"
                  );
              } catch (E) {
                await t.warning(
                  `  Failed to get fills: ${E}`
                );
              }
            }
            const W = e.selectionColor, Y = o.selectionColor;
            W !== void 0 && await t.log(
              `  DEBUG: Instance "${d}" -> selectionColor: ${JSON.stringify(W)}`
            ), Y !== void 0 && await t.log(
              `  DEBUG: Main component "${m}" -> selectionColor: ${JSON.stringify(Y)}`
            );
            const S = Object.keys(e).filter(
              (E) => !E.startsWith("_") && E !== "parent" && E !== "removed" && typeof e[E] != "function" && E !== "type" && E !== "id" && E !== "name"
            ), F = Object.keys(o).filter(
              (E) => !E.startsWith("_") && E !== "parent" && E !== "removed" && typeof o[E] != "function" && E !== "type" && E !== "id" && E !== "name"
            ), w = [
              .../* @__PURE__ */ new Set([...S, ...F])
            ].filter(
              (E) => E.toLowerCase().includes("selection") || E.toLowerCase().includes("select") || E.toLowerCase().includes("color") && !E.toLowerCase().includes("fill") && !E.toLowerCase().includes("stroke")
            );
            if (w.length > 0) {
              await t.log(
                `  DEBUG: Found selection/color-related properties: ${w.join(", ")}`
              );
              for (const E of w)
                try {
                  if (S.includes(E)) {
                    const O = e[E];
                    await t.log(
                      `  DEBUG:   Instance.${E}: ${JSON.stringify(O)}`
                    );
                  }
                  if (F.includes(E)) {
                    const O = o[E];
                    await t.log(
                      `  DEBUG:   MainComponent.${E}: ${JSON.stringify(O)}`
                    );
                  }
                } catch (O) {
                }
            } else
              await t.log(
                "  DEBUG: No selection/color-related properties found on instance or main component"
              );
            const N = o.boundVariables;
            if (N && typeof N == "object") {
              const E = Object.keys(N);
              if (E.length > 0) {
                await t.log(
                  `  DEBUG: Main component "${m}" -> boundVariables keys: ${E.join(", ")}`
                );
                for (const O of E) {
                  const A = N[O], M = (A == null ? void 0 : A.type) || typeof A;
                  await t.log(
                    `  DEBUG:   Main component boundVariables.${O}: type=${M}, value=${JSON.stringify(A)}`
                  );
                }
              }
            }
            if (P && Object.keys(P).length > 0) {
              await t.log(
                `  DEBUG: Preserving instance's boundVariables in structure (${Object.keys(P).length} key(s))`
              );
              const { extractBoundVariables: E } = await Promise.resolve().then(() => Te), O = await E(
                P,
                a.variableTable,
                a.collectionTable
              );
              $.boundVariables || ($.boundVariables = {});
              for (const [A, M] of Object.entries(
                O
              ))
                M !== void 0 && ($.boundVariables[A] !== void 0 && await t.log(
                  `  DEBUG: Structure already has boundVariables.${A} from baseProps, but instance also has it - using instance's boundVariables.${A}`
                ), $.boundVariables[A] = M, await t.log(
                  `  DEBUG: Set boundVariables.${A} in structure: ${JSON.stringify(M)}`
                ));
              O.fills !== void 0 ? await t.log(
                "  DEBUG: ✓ Preserved boundVariables.fills from instance"
              ) : U && await t.warning(
                "  DEBUG: Instance has boundVariables.fills but extractBoundVariables didn't extract it"
              ), O.backgrounds !== void 0 ? await t.log(
                `  DEBUG: ✓ Preserved boundVariables.backgrounds from instance: ${JSON.stringify(O.backgrounds)}`
              ) : P && P.backgrounds !== void 0 && await t.warning(
                "  DEBUG: Instance has boundVariables.backgrounds but extractBoundVariables didn't extract it"
              );
            }
            if (N && Object.keys(N).length > 0) {
              await t.log(
                `  DEBUG: Checking main component's boundVariables for properties not in instance (${Object.keys(N).length} key(s))`
              );
              const { extractBoundVariables: E } = await Promise.resolve().then(() => Te), O = await E(
                N,
                a.variableTable,
                a.collectionTable
              );
              $.boundVariables || ($.boundVariables = {});
              for (const [A, M] of Object.entries(
                O
              ))
                M !== void 0 && ($.boundVariables[A] === void 0 ? ($.boundVariables[A] = M, await t.log(
                  `  DEBUG: Added boundVariables.${A} from main component (not in instance): ${JSON.stringify(M)}`
                )) : await t.log(
                  `  DEBUG: Skipped boundVariables.${A} from main component (instance already has it)`
                ));
            }
            await t.log(
              `  DEBUG: Final structure for "${m}": hasFills=${!!$.fills}, fillsCount=${((s = $.fills) == null ? void 0 : s.length) || 0}, hasBoundVars=${!!$.boundVariables}, boundVarsKeys=${$.boundVariables ? Object.keys($.boundVariables).join(", ") : "none"}`
            ), (c = $.boundVariables) != null && c.fills && await t.log(
              `  DEBUG: Structure boundVariables.fills: ${JSON.stringify($.boundVariables.fills)}`
            );
          } catch (P) {
            await t.warning(
              `  Failed to handle bound variables for fills: ${P}`
            );
          }
          V.structure = $, C ? await t.log(
            `  Extracted structure for detached component "${m}" (ID: ${o.id.substring(0, 8)}...)`
          ) : await t.log(
            `  Extracted structure from instance for remote component "${m}" (preserving size overrides: ${e.width}x${e.height})`
          ), await t.log(
            `  Found INSTANCE: "${d}" -> REMOTE component "${m}" (ID: ${o.id.substring(0, 8)}...)${C ? " [DETACHED]" : ""}`
          );
        } catch (L) {
          const B = `Failed to extract structure for remote component "${m}": ${L instanceof Error ? L.message : String(L)}`;
          console.error(B, L), await t.error(B);
        }
    }
    const G = a.instanceTable.addInstance(V);
    i._instanceRef = G, n.add("_instanceRef");
  }
  return i;
}
class xe {
  constructor() {
    ge(this, "instanceMap");
    // unique key -> index
    ge(this, "instances");
    // index -> instance data
    ge(this, "nextIndex");
    this.instanceMap = /* @__PURE__ */ new Map(), this.instances = [], this.nextIndex = 0;
  }
  /**
   * Generates a unique key for an instance based on its type
   */
  generateKey(a) {
    if (a.instanceType === "internal" && a.componentNodeId) {
      const i = a.variantProperties ? `:${JSON.stringify(a.variantProperties)}` : "";
      return `internal:${a.componentNodeId}${i}`;
    } else {
      if (a.instanceType === "normal" && a.componentGuid && a.componentVersion !== void 0)
        return `normal:${a.componentGuid}:${a.componentVersion}`;
      if (a.instanceType === "remote" && a.remoteLibraryKey)
        return `remote:${a.remoteLibraryKey}:${a.componentName}`;
      if (a.instanceType === "remote" && a.componentNodeId)
        return `remote:detached:${a.componentNodeId}`;
    }
    return a.instanceType === "remote" ? `remote:${a.componentName}:COMPONENT` : `${a.instanceType}:${a.componentName}:COMPONENT`;
  }
  /**
   * Adds an instance to the table if it doesn't already exist
   * Returns the index of the instance (existing or newly added)
   */
  addInstance(a) {
    const i = this.generateKey(a);
    if (this.instanceMap.has(i))
      return this.instanceMap.get(i);
    const n = this.nextIndex++;
    return this.instanceMap.set(i, n), this.instances[n] = a, n;
  }
  /**
   * Gets the index of an instance by its unique key
   * Returns -1 if not found
   */
  getInstanceIndex(a) {
    var n;
    const i = this.generateKey(a);
    return (n = this.instanceMap.get(i)) != null ? n : -1;
  }
  /**
   * Gets an instance entry by index
   */
  getInstanceByIndex(a) {
    return this.instances[a];
  }
  /**
   * Gets the complete table as an object with string keys
   * Used for JSON serialization
   */
  getSerializedTable() {
    const a = {};
    for (let i = 0; i < this.instances.length; i++)
      a[String(i)] = this.instances[i];
    return a;
  }
  /**
   * Reconstructs an InstanceTable from a serialized table object
   */
  static fromTable(a) {
    const i = new xe(), n = Object.entries(a).sort(
      (s, c) => parseInt(s[0], 10) - parseInt(c[0], 10)
    );
    for (const [s, c] of n) {
      const o = parseInt(s, 10), d = i.generateKey(c);
      i.instanceMap.set(d, o), i.instances[o] = c, i.nextIndex = Math.max(i.nextIndex, o + 1);
    }
    return i;
  }
  /**
   * Gets the total number of instances in the table
   */
  getSize() {
    return this.instances.length;
  }
}
const pt = {
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
function na() {
  const e = {};
  for (const [a, i] of Object.entries(pt))
    e[i] = a;
  return e;
}
function nt(e) {
  var a;
  return (a = pt[e]) != null ? a : e;
}
function oa(e) {
  var a;
  return typeof e == "number" ? (a = na()[e]) != null ? a : e.toString() : e;
}
const ft = {
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
}, Ke = {};
for (const [e, a] of Object.entries(ft))
  Ke[a] = e;
class Ge {
  constructor() {
    ge(this, "shortToLong");
    ge(this, "longToShort");
    this.shortToLong = q({}, Ke), this.longToShort = q({}, ft);
  }
  /**
   * Gets the short name for a long property name
   * Returns the short name if mapped, otherwise returns the original
   */
  getShortName(a) {
    return this.longToShort[a] || a;
  }
  /**
   * Gets the long name for a short property name
   * Returns the long name if mapped, otherwise returns the original
   */
  getLongName(a) {
    return this.shortToLong[a] || a;
  }
  /**
   * Recursively replaces all keys in an object with their short names
   * Handles nested objects and arrays
   * Collision detection: if a short name already exists as a key, keep the original key
   * Also compresses special values: node "type" field values and variable "type" field values
   */
  compressObject(a) {
    if (a == null)
      return a;
    if (Array.isArray(a))
      return a.map((i) => this.compressObject(i));
    if (typeof a == "object") {
      const i = {}, n = /* @__PURE__ */ new Set();
      for (const s of Object.keys(a))
        n.add(s);
      for (const [s, c] of Object.entries(a)) {
        const o = this.getShortName(s);
        if (o !== s && !n.has(o)) {
          let d = this.compressObject(c);
          o === "type" && typeof d == "string" && (d = nt(d)), i[o] = d;
        } else {
          let d = this.compressObject(c);
          s === "type" && typeof d == "string" && (d = nt(d)), i[s] = d;
        }
      }
      return i;
    }
    return a;
  }
  /**
   * Recursively replaces all keys in an object with their long names
   * Handles nested objects and arrays
   * Also expands special values: node "type" field values and variable "type" field values
   */
  expandObject(a) {
    if (a == null)
      return a;
    if (Array.isArray(a))
      return a.map((i) => this.expandObject(i));
    if (typeof a == "object") {
      const i = {};
      for (const [n, s] of Object.entries(a)) {
        const c = this.getLongName(n);
        let o = this.expandObject(s);
        (c === "type" || n === "type") && (typeof o == "number" || typeof o == "string") && (o = oa(o)), i[c] = o;
      }
      return i;
    }
    return a;
  }
  /**
   * Gets the serialized string table for JSON export
   * Returns the mapping of short -> long names
   */
  getSerializedTable() {
    return q({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(a) {
    const i = new Ge();
    i.shortToLong = q(q({}, Ke), a), i.longToShort = {};
    for (const [n, s] of Object.entries(
      i.shortToLong
    ))
      i.longToShort[s] = n;
    return i;
  }
}
function ra(e, a) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const i = {};
  e.metadata && (i.metadata = e.metadata);
  for (const [n, s] of Object.entries(e))
    n !== "metadata" && (i[n] = a.compressObject(s));
  return i;
}
function sa(e, a) {
  return a.expandObject(e);
}
function Fe(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
function _e(e) {
  let a = 1;
  return e.children && e.children.length > 0 && e.children.forEach((i) => {
    a += _e(i);
  }), a;
}
async function ze(e, a = /* @__PURE__ */ new WeakSet(), i = {}) {
  var h, l, v, g, u, b, R;
  if (!e || typeof e != "object")
    return e;
  const n = (h = i.maxNodes) != null ? h : 1e4, s = (l = i.nodeCount) != null ? l : 0;
  if (s >= n)
    return await t.warning(
      `Maximum node count (${n}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${n}) reached`,
      _nodeCount: s
    };
  const c = {
    visited: (v = i.visited) != null ? v : /* @__PURE__ */ new WeakSet(),
    depth: (g = i.depth) != null ? g : 0,
    maxDepth: (u = i.maxDepth) != null ? u : 100,
    nodeCount: s + 1,
    maxNodes: n,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: i.variableTable,
    collectionTable: i.collectionTable,
    instanceTable: i.instanceTable,
    detachedComponentsHandled: (b = i.detachedComponentsHandled) != null ? b : /* @__PURE__ */ new Set(),
    exportedIds: (R = i.exportedIds) != null ? R : /* @__PURE__ */ new Map()
  };
  if (a.has(e))
    return "[Circular Reference]";
  a.add(e), c.visited = a;
  const o = {}, d = await gt(e, c);
  if (Object.assign(o, d), o.id && c.exportedIds) {
    const V = c.exportedIds.get(o.id);
    if (V !== void 0) {
      const G = o.name || "Unnamed";
      if (V !== G) {
        const T = `Duplicate ID detected during export: ID "${o.id.substring(0, 8)}..." is used by both "${V}" and "${G}". Each node must have a unique ID.`;
        throw await t.error(T), new Error(T);
      }
      await t.warning(
        `Node "${G}" (ID: ${o.id.substring(0, 8)}...) was encountered multiple times during export. This may indicate a structural issue.`
      );
    } else
      c.exportedIds.set(o.id, o.name || "Unnamed");
  }
  const m = e.type;
  if (m)
    switch (m) {
      case "FRAME":
      case "COMPONENT": {
        const V = await He(e);
        Object.assign(o, V);
        break;
      }
      case "INSTANCE": {
        const V = await ia(
          e,
          c
        );
        Object.assign(o, V);
        const G = await He(
          e
        );
        Object.assign(o, G);
        break;
      }
      case "TEXT": {
        const V = await qt(e);
        Object.assign(o, V);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const V = await Zt(e);
        Object.assign(o, V);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const V = await Qt(e);
        Object.assign(o, V);
        break;
      }
      default:
        c.unhandledKeys.add("_unknownType");
        break;
    }
  const f = Object.getOwnPropertyNames(e), p = /* @__PURE__ */ new Set([
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
  (m === "FRAME" || m === "COMPONENT" || m === "INSTANCE") && (p.add("layoutMode"), p.add("primaryAxisSizingMode"), p.add("counterAxisSizingMode"), p.add("primaryAxisAlignItems"), p.add("counterAxisAlignItems"), p.add("paddingLeft"), p.add("paddingRight"), p.add("paddingTop"), p.add("paddingBottom"), p.add("itemSpacing"), p.add("counterAxisSpacing"), p.add("cornerRadius"), p.add("clipsContent"), p.add("layoutWrap"), p.add("layoutGrow")), m === "TEXT" && (p.add("characters"), p.add("fontName"), p.add("fontSize"), p.add("textAlignHorizontal"), p.add("textAlignVertical"), p.add("letterSpacing"), p.add("lineHeight"), p.add("textCase"), p.add("textDecoration"), p.add("textAutoResize"), p.add("paragraphSpacing"), p.add("paragraphIndent"), p.add("listOptions")), (m === "VECTOR" || m === "LINE") && (p.add("fillGeometry"), p.add("strokeGeometry")), (m === "RECTANGLE" || m === "ELLIPSE" || m === "STAR" || m === "POLYGON") && (p.add("pointCount"), p.add("innerRadius"), p.add("arcData")), m === "INSTANCE" && (p.add("mainComponent"), p.add("componentProperties"));
  for (const V of f)
    typeof e[V] != "function" && (p.has(V) || c.unhandledKeys.add(V));
  c.unhandledKeys.size > 0 && (o._unhandledKeys = Array.from(c.unhandledKeys).sort());
  const y = o._instanceRef !== void 0 && c.instanceTable && m === "INSTANCE";
  let r = !1;
  if (y) {
    const V = c.instanceTable.getInstanceByIndex(
      o._instanceRef
    );
    V && V.instanceType === "normal" && (r = !0, await t.log(
      `  Skipping children extraction for normal instance "${o.name || "Unnamed"}" - will be resolved from referenced component`
    ));
  }
  if (!r && e.children && Array.isArray(e.children)) {
    const V = c.maxDepth;
    if (c.depth >= V)
      o.children = {
        _truncated: !0,
        _reason: `Maximum depth (${V}) reached`,
        _count: e.children.length
      };
    else if (c.nodeCount >= n)
      o.children = {
        _truncated: !0,
        _reason: `Maximum node count (${n}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const G = ce(q({}, c), {
        depth: c.depth + 1
      }), T = [];
      let x = !1;
      for (const C of e.children) {
        if (G.nodeCount >= n) {
          o.children = {
            _truncated: !0,
            _reason: `Maximum node count (${n}) reached during children processing`,
            _processed: T.length,
            _total: e.children.length,
            children: T
          }, x = !0;
          break;
        }
        const k = await ze(C, a, G);
        T.push(k), G.nodeCount && (c.nodeCount = G.nodeCount);
      }
      x || (o.children = T);
    }
  }
  return o;
}
async function Ye(e, a = /* @__PURE__ */ new Set(), i = !1) {
  i || (await t.clear(), await t.log("=== Starting Page Export ==="));
  try {
    const n = e.pageIndex;
    if (n === void 0 || typeof n != "number")
      return await t.error(
        "Invalid page selection: pageIndex is undefined or not a number"
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    await t.log("Loading all pages..."), await figma.loadAllPagesAsync();
    const s = figma.root.children;
    if (await t.log(`Loaded ${s.length} page(s)`), n < 0 || n >= s.length)
      return await t.error(
        `Invalid page index: ${n} (valid range: 0-${s.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const c = s[n], o = c.id;
    if (a.has(o))
      return await t.log(
        `Page "${c.name}" has already been processed, skipping...`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Page already processed",
        data: {}
      };
    a.add(o), await t.log(
      `Selected page: "${c.name}" (index: ${n})`
    ), await t.log(
      "Initializing variable, collection, and instance tables..."
    );
    const d = new Me(), m = new Oe(), f = new xe();
    await t.log("Extracting node data from page..."), await t.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await t.log(
      "Collections will be discovered as variables are processed:"
    );
    const p = await ze(
      c,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: d,
        collectionTable: m,
        instanceTable: f
      }
    );
    await t.log("Node extraction finished");
    const y = _e(p), r = d.getSize(), h = m.getSize(), l = f.getSize();
    await t.log("Extraction complete:"), await t.log(`  - Total nodes: ${y}`), await t.log(`  - Unique variables: ${r}`), await t.log(`  - Unique collections: ${h}`), await t.log(`  - Unique instances: ${l}`);
    const v = f.getSerializedTable(), g = /* @__PURE__ */ new Map();
    for (const [U, z] of Object.entries(v))
      if (z.instanceType === "remote") {
        const D = parseInt(U, 10);
        g.set(D, z);
      }
    if (g.size > 0) {
      await t.error(
        `Found ${g.size} remote instance(s) - remote instances are not supported during publishing`
      );
      const U = (W, Y, S = [], F = !1) => {
        const w = [];
        if (!W || typeof W != "object")
          return w;
        if (F || W.type === "PAGE") {
          const A = W.children || W.child;
          if (Array.isArray(A))
            for (const M of A)
              M && typeof M == "object" && w.push(
                ...U(
                  M,
                  Y,
                  [],
                  !1
                )
              );
          return w;
        }
        const N = W.name || "";
        if (typeof W._instanceRef == "number" && W._instanceRef === Y) {
          const A = N || "(unnamed)", M = S.length > 0 ? [...S, A] : [A];
          return w.push({
            path: M,
            nodeName: A
          }), w;
        }
        const E = N ? [...S, N] : S, O = W.children || W.child;
        if (Array.isArray(O))
          for (const A of O)
            A && typeof A == "object" && w.push(
              ...U(
                A,
                Y,
                E,
                !1
              )
            );
        return w;
      }, z = [];
      let D = 1;
      for (const [W, Y] of g.entries()) {
        const S = Y.componentName || "(unnamed)", F = Y.componentSetName, w = U(
          p,
          W,
          [],
          !0
        );
        let N = "";
        w.length > 0 ? N = `
   Location(s): ${w.map((M) => {
          const J = M.path.length > 0 ? M.path.join(" → ") : "page root";
          return `"${M.nodeName}" at ${J}`;
        }).join(", ")}` : N = `
   Location: (unable to determine - instance may be deeply nested)`;
        const E = F ? `Component: "${S}" (from component set "${F}")` : `Component: "${S}"`, O = Y.remoteLibraryName ? `
   Library: ${Y.remoteLibraryName}` : "";
        z.push(
          `${D}. ${E}${O}${N}`
        ), D++;
      }
      const j = `Cannot publish: Remote instances are not supported. Please remove all remote instances before publishing.

Found ${g.size} remote instance(s):
${z.join(`

`)}

To fix this:
1. Locate each remote instance component listed above using the path(s) shown
2. Replace it with a local component or remove it
3. Try publishing again`;
      throw await t.error(j), new Error(j);
    }
    if (h > 0) {
      await t.log("Collections found:");
      const U = m.getTable();
      for (const [z, D] of Object.values(U).entries()) {
        const j = D.collectionGuid ? ` (GUID: ${D.collectionGuid.substring(0, 8)}...)` : "";
        await t.log(
          `  ${z}: ${D.collectionName}${j} - ${D.modes.length} mode(s)`
        );
      }
    }
    await t.log("Checking for referenced component pages...");
    const u = [], b = [], R = Object.values(v).filter(
      (U) => U.instanceType === "normal"
    );
    if (R.length > 0) {
      await t.log(
        `Found ${R.length} normal instance(s) to check`
      );
      const U = /* @__PURE__ */ new Map();
      for (const z of R)
        if (z.componentPageName) {
          const D = s.find((j) => j.name === z.componentPageName);
          if (D && !a.has(D.id))
            U.has(D.id) || U.set(D.id, D);
          else if (!D) {
            const j = `Normal instance references component "${z.componentName || "(unnamed)"}" on page "${z.componentPageName}", but that page was not found. Cannot export.`;
            throw await t.error(j), new Error(j);
          }
        } else {
          const D = `Normal instance references component "${z.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw await t.error(D), new Error(D);
        }
      await t.log(
        `Found ${U.size} unique referenced page(s)`
      );
      for (const [z, D] of U.entries()) {
        const j = D.name;
        if (a.has(z)) {
          await t.log(`Skipping "${j}" - already processed`);
          continue;
        }
        const W = D.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let Y = !1;
        if (W)
          try {
            const N = JSON.parse(W);
            Y = !!(N.id && N.version !== void 0);
          } catch (N) {
          }
        const S = s.findIndex(
          (N) => N.id === D.id
        );
        if (S === -1)
          throw await t.error(
            `Could not find page index for "${j}"`
          ), new Error(`Could not find page index for "${j}"`);
        const F = Array.from(R).find(
          (N) => N.componentPageName === j
        ), w = F == null ? void 0 : F.componentName;
        if (e.skipPrompts)
          b.push({
            pageId: z,
            pageName: j,
            pageIndex: S,
            hasMetadata: Y,
            componentName: w
          }), await t.log(
            `Discovered referenced page: "${j}" (will be handled by wizard)`
          );
        else {
          const N = `Do you want to also publish referenced component "${j}"?`;
          try {
            await Ie.prompt(N, {
              okLabel: "Yes",
              cancelLabel: "No",
              timeoutMs: 3e5
              // 5 minutes
            }), await t.log(`Exporting referenced page: "${j}"`);
            const E = s.findIndex(
              (A) => A.id === D.id
            );
            if (E === -1)
              throw await t.error(
                `Could not find page index for "${j}"`
              ), new Error(`Could not find page index for "${j}"`);
            const O = await Ye(
              {
                pageIndex: E
              },
              a,
              // Pass the same set to track all processed pages
              !0
              // Mark as recursive call
            );
            if (O.success && O.data) {
              const A = O.data;
              u.push(A), await t.log(
                `Successfully exported referenced page: "${j}"`
              );
            } else
              throw new Error(
                `Failed to export referenced page "${j}": ${O.message}`
              );
          } catch (E) {
            if (E instanceof Error && E.message === "User cancelled")
              if (Y)
                await t.log(
                  `User declined to publish "${j}", but page has existing metadata. Continuing with existing metadata.`
                );
              else
                throw await t.error(
                  `Export cancelled: Referenced page "${j}" has no metadata and user declined to publish it.`
                ), new Error(
                  `Cannot continue export: Referenced component "${j}" has no metadata. Please publish it first or choose to publish it now.`
                );
            else
              throw E;
          }
        }
      }
    }
    await t.log("Creating string table...");
    const V = new Ge();
    await t.log("Getting page metadata...");
    const G = c.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let T = "", x = 0;
    if (G)
      try {
        const U = JSON.parse(G);
        T = U.id || "", x = U.version || 0;
      } catch (U) {
        await t.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!T) {
      await t.log("Generating new GUID for page..."), T = await Xe();
      const U = {
        _ver: 1,
        id: T,
        name: c.name,
        version: x,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      c.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(U)
      );
    }
    await t.log("Creating export data structure...");
    const C = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "1.0.0",
        figmaApiVersion: figma.apiVersion,
        guid: T,
        version: x,
        name: c.name,
        pluginVersion: "1.0.0"
      },
      stringTable: V.getSerializedTable(),
      collections: m.getSerializedTable(),
      variables: d.getSerializedTable(),
      instances: f.getSerializedTable(),
      pageData: p
    };
    await t.log("Compressing JSON data...");
    const k = ra(C, V);
    await t.log("Serializing to JSON...");
    const L = JSON.stringify(k, null, 2), B = (L.length / 1024).toFixed(2), _ = Fe(c.name).trim().replace(/\s+/g, "_") + ".figma.json";
    await t.log(`JSON serialization complete: ${B} KB`), await t.log(`Export file: ${_}`), await t.log("=== Export Complete ===");
    const $ = JSON.parse(L);
    return {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: _,
        pageData: $,
        pageName: c.name,
        additionalPages: u,
        // Populated with referenced component pages
        discoveredReferencedPages: b.length > 0 ? b : void 0
        // Only include if there are discovered pages
      }
    };
  } catch (n) {
    const s = n instanceof Error ? n.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", n), console.error("Error message:", s), await t.error(`Export failed: ${s}`), n instanceof Error && n.stack && (console.error("Stack trace:", n.stack), await t.error(`Stack trace: ${n.stack}`));
    const c = {
      type: "exportPage",
      success: !1,
      error: !0,
      message: s,
      data: {}
    };
    return console.error("Returning error response:", c), c;
  }
}
const ca = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  countTotalNodes: _e,
  exportPage: Ye,
  extractNodeData: ze
}, Symbol.toStringTag, { value: "Module" }));
function oe(e) {
  return e.replace(/[^a-zA-Z0-9]/g, "");
}
const ut = /* @__PURE__ */ new Map();
async function ve(e, a) {
  if (a.length === 0)
    return;
  const i = e.modes.find(
    (n) => n.name === "Mode 1" || n.name === "Default"
  );
  if (i && !a.includes(i.name)) {
    const n = a[0];
    try {
      const s = i.name;
      e.renameMode(i.modeId, n), ut.set(`${e.id}:${s}`, n), await t.log(
        `  Renamed default mode "${s}" to "${n}"`
      );
    } catch (s) {
      await t.warning(
        `  Failed to rename default mode "${i.name}" to "${n}": ${s}`
      );
    }
  }
  for (const n of a)
    e.modes.find((c) => c.name === n) || e.addMode(n);
}
const ue = "recursica:collectionId";
async function Be(e) {
  if (e.remote === !0) {
    const i = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(i)) {
      const s = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await t.error(s), new Error(s);
    }
    return e.id;
  } else {
    const i = e.getSharedPluginData(
      "recursica",
      ue
    );
    if (i && i.trim() !== "")
      return i;
    const n = await Xe();
    return e.setSharedPluginData("recursica", ue, n), n;
  }
}
function la(e, a) {
  const i = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(i))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function da(e) {
  let a;
  const i = e.collectionName.trim().toLowerCase(), n = ["token", "tokens", "theme", "themes"], s = e.isLocal;
  if (s === !1 || s === void 0 && n.includes(i))
    try {
      const d = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((m) => m.name.trim().toLowerCase() === i);
      if (d) {
        la(e.collectionName, !1);
        const m = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          d.key
        );
        if (m.length > 0) {
          const f = await figma.variables.importVariableByKeyAsync(m[0].key), p = await figma.variables.getVariableCollectionByIdAsync(
            f.variableCollectionId
          );
          if (p) {
            if (a = p, e.collectionGuid) {
              const y = a.getSharedPluginData(
                "recursica",
                ue
              );
              (!y || y.trim() === "") && a.setSharedPluginData(
                "recursica",
                ue,
                e.collectionGuid
              );
            } else
              await Be(a);
            return await ve(a, e.modes), { collection: a };
          }
        }
      }
    } catch (o) {
      if (s === !1)
        throw new Error(
          `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
        );
      console.log("Could not import external collection, trying local:", o);
    }
  if (s !== !1) {
    const o = await figma.variables.getLocalVariableCollectionsAsync();
    let d;
    if (e.collectionGuid && (d = o.find((m) => m.getSharedPluginData("recursica", ue) === e.collectionGuid)), d || (d = o.find(
      (m) => m.name === e.collectionName
    )), d)
      if (a = d, e.collectionGuid) {
        const m = a.getSharedPluginData(
          "recursica",
          ue
        );
        (!m || m.trim() === "") && a.setSharedPluginData(
          "recursica",
          ue,
          e.collectionGuid
        );
      } else
        await Be(a);
    else
      a = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? a.setSharedPluginData(
        "recursica",
        ue,
        e.collectionGuid
      ) : await Be(a);
  } else {
    const o = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), d = e.collectionName.trim().toLowerCase(), m = o.find((r) => r.name.trim().toLowerCase() === d);
    if (!m)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const f = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      m.key
    );
    if (f.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const p = await figma.variables.importVariableByKeyAsync(
      f[0].key
    ), y = await figma.variables.getVariableCollectionByIdAsync(
      p.variableCollectionId
    );
    if (!y)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (a = y, e.collectionGuid) {
      const r = a.getSharedPluginData(
        "recursica",
        ue
      );
      (!r || r.trim() === "") && a.setSharedPluginData(
        "recursica",
        ue,
        e.collectionGuid
      );
    } else
      Be(a);
  }
  return await ve(a, e.modes), { collection: a };
}
async function Ze(e, a) {
  for (const i of e.variableIds)
    try {
      const n = await figma.variables.getVariableByIdAsync(i);
      if (n && n.name === a)
        return n;
    } catch (n) {
      continue;
    }
  return null;
}
async function ga(e, a, i, n, s) {
  await t.log(
    `Restoring values for variable "${e.name}" (type: ${e.resolvedType}):`
  ), await t.log(
    `  valuesByMode keys: ${Object.keys(a).join(", ")}`
  );
  for (const [c, o] of Object.entries(a)) {
    const d = ut.get(`${n.id}:${c}`) || c;
    let m = n.modes.find((p) => p.name === d);
    if (m || (m = n.modes.find((p) => p.name === c)), !m) {
      await t.warning(
        `Mode "${c}" (mapped: "${d}") not found in collection "${n.name}" for variable "${e.name}". Available modes: ${n.modes.map((p) => p.name).join(", ")}. Skipping.`
      );
      continue;
    }
    const f = m.modeId;
    try {
      if (o == null) {
        await t.log(
          `  Mode "${c}": value is null/undefined, skipping`
        );
        continue;
      }
      if (await t.log(
        `  Mode "${c}": value type=${typeof o}, value=${JSON.stringify(o)}`
      ), typeof o == "string" || typeof o == "number" || typeof o == "boolean") {
        e.setValueForMode(f, o);
        continue;
      }
      if (typeof o == "object" && o !== null && "r" in o && "g" in o && "b" in o && typeof o.r == "number" && typeof o.g == "number" && typeof o.b == "number") {
        const p = o, y = {
          r: p.r,
          g: p.g,
          b: p.b
        };
        p.a !== void 0 && (y.a = p.a), e.setValueForMode(f, y);
        const r = e.valuesByMode[f];
        if (await t.log(
          `  Set color value for "${e.name}" mode "${c}": r=${y.r.toFixed(3)}, g=${y.g.toFixed(3)}, b=${y.b.toFixed(3)}${y.a !== void 0 ? `, a=${y.a.toFixed(3)}` : ""}`
        ), await t.log(
          `  Read back value: ${JSON.stringify(r)}`
        ), typeof r == "object" && r !== null && "r" in r && "g" in r && "b" in r) {
          const h = r, l = Math.abs(h.r - y.r) < 1e-3, v = Math.abs(h.g - y.g) < 1e-3, g = Math.abs(h.b - y.b) < 1e-3;
          !l || !v || !g ? await t.warning(
            `  ⚠️ Value mismatch! Set: r=${y.r}, g=${y.g}, b=${y.b}, Read back: r=${h.r}, g=${h.g}, b=${h.b}`
          ) : await t.log(
            "  ✓ Value verified: read-back matches what we set"
          );
        } else
          await t.warning(
            `  ⚠️ Read-back value is not an RGB object: ${JSON.stringify(r)}`
          );
        continue;
      }
      if (typeof o == "object" && o !== null && "_varRef" in o && typeof o._varRef == "number") {
        const p = o;
        let y = null;
        const r = i.getVariableByIndex(
          p._varRef
        );
        if (r) {
          let h = null;
          if (s && r._colRef !== void 0) {
            const l = s.getCollectionByIndex(
              r._colRef
            );
            l && (h = (await da(l)).collection);
          }
          h && (y = await Ze(
            h,
            r.variableName
          ));
        }
        if (y) {
          const h = {
            type: "VARIABLE_ALIAS",
            id: y.id
          };
          e.setValueForMode(f, h);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${c}" in variable "${e.name}". Variable reference index: ${p._varRef}`
          );
      }
    } catch (p) {
      typeof o == "object" && o !== null && !("_varRef" in o) && !("r" in o && "g" in o && "b" in o) && await t.warning(
        `Unhandled value type for mode "${c}" in variable "${e.name}": ${JSON.stringify(o)}`
      ), console.warn(
        `Error setting value for mode "${c}" in variable "${e.name}":`,
        p
      );
    }
  }
}
async function qe(e, a, i, n) {
  if (await t.log(
    `Creating variable "${e.variableName}" (type: ${e.variableType})`
  ), e.valuesByMode) {
    await t.log(
      `  valuesByMode has ${Object.keys(e.valuesByMode).length} mode(s): ${Object.keys(e.valuesByMode).join(", ")}`
    );
    for (const [c, o] of Object.entries(e.valuesByMode))
      await t.log(
        `  Mode "${c}": ${JSON.stringify(o)} (type: ${typeof o})`
      );
  } else
    await t.log(
      `  No valuesByMode found for variable "${e.variableName}"`
    );
  const s = figma.variables.createVariable(
    e.variableName,
    a,
    e.variableType
  );
  if (e.valuesByMode && await ga(
    s,
    e.valuesByMode,
    i,
    a,
    // Pass collection to look up modes by name
    n
  ), e.valuesByMode && s.valuesByMode) {
    await t.log(`  Verifying values for "${e.variableName}":`);
    for (const [c, o] of Object.entries(
      e.valuesByMode
    )) {
      const d = a.modes.find((m) => m.name === c);
      if (d) {
        const m = s.valuesByMode[d.modeId];
        await t.log(
          `    Mode "${c}": expected=${JSON.stringify(o)}, actual=${JSON.stringify(m)}`
        );
      }
    }
  }
  return s;
}
async function ma(e, a, i, n) {
  const s = a.getVariableByIndex(e);
  if (!s || s._colRef === void 0)
    return null;
  const c = n.get(String(s._colRef));
  if (!c)
    return null;
  const o = await Ze(
    c,
    s.variableName
  );
  if (o) {
    let d;
    if (typeof s.variableType == "number" ? d = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[s.variableType] || String(s.variableType) : d = s.variableType, ht(o, d))
      return o;
  }
  return await qe(
    s,
    c,
    a,
    i
  );
}
async function pa(e, a, i, n) {
  if (!(!a || typeof a != "object"))
    try {
      const s = e[i];
      if (!s || !Array.isArray(s))
        return;
      const c = a[i];
      if (Array.isArray(c))
        for (let o = 0; o < c.length && o < s.length; o++) {
          const d = c[o];
          if (d && typeof d == "object") {
            if (s[o].boundVariables || (s[o].boundVariables = {}), $e(d)) {
              const m = d._varRef;
              if (m !== void 0) {
                const f = n.get(String(m));
                f && (s[o].boundVariables.color = {
                  type: "VARIABLE_ALIAS",
                  id: f.id
                });
              }
            } else
              for (const [m, f] of Object.entries(
                d
              ))
                if ($e(f)) {
                  const p = f._varRef;
                  if (p !== void 0) {
                    const y = n.get(String(p));
                    y && (s[o].boundVariables[m] = {
                      type: "VARIABLE_ALIAS",
                      id: y.id
                    });
                  }
                }
          }
        }
    } catch (s) {
      console.log(`Error restoring bound variables for ${i}:`, s);
    }
}
function fa(e, a, i = !1) {
  const n = Lt(a);
  if (e.visible === void 0 && (e.visible = n.visible), e.locked === void 0 && (e.locked = n.locked), e.opacity === void 0 && (e.opacity = n.opacity), e.rotation === void 0 && (e.rotation = n.rotation), e.blendMode === void 0 && (e.blendMode = n.blendMode), a === "FRAME" || a === "COMPONENT" || a === "INSTANCE") {
    const s = re;
    e.layoutMode === void 0 && (e.layoutMode = s.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = s.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = s.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = s.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = s.counterAxisAlignItems), i || (e.paddingLeft === void 0 && (e.paddingLeft = s.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = s.paddingRight), e.paddingTop === void 0 && (e.paddingTop = s.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = s.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = s.itemSpacing), e.counterAxisSpacing === void 0 && (e.counterAxisSpacing = s.counterAxisSpacing));
  }
  if (a === "TEXT") {
    const s = fe;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = s.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = s.textAlignVertical), e.textCase === void 0 && (e.textCase = s.textCase), e.textDecoration === void 0 && (e.textDecoration = s.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = s.textAutoResize);
  }
}
async function Pe(e, a, i = null, n = null, s = null, c = null, o = null, d = !1, m = null, f = null, p = null, y = null) {
  var x, C, k, L, B, I, _, $, P, U, z, D, j, W, Y;
  let r;
  switch (e.type) {
    case "FRAME":
      r = figma.createFrame();
      break;
    case "RECTANGLE":
      r = figma.createRectangle();
      break;
    case "ELLIPSE":
      r = figma.createEllipse();
      break;
    case "TEXT":
      r = figma.createText();
      break;
    case "VECTOR":
      r = figma.createVector();
      break;
    case "STAR":
      r = figma.createStar();
      break;
    case "LINE":
      r = figma.createLine();
      break;
    case "COMPONENT":
      if (e.id && o && o.has(e.id))
        r = o.get(e.id), await t.log(
          `Reusing existing COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id.substring(0, 8)}...)`
        );
      else if (r = figma.createComponent(), await t.log(
        `Created COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id ? e.id.substring(0, 8) + "..." : "no ID"})`
      ), e.componentPropertyDefinitions) {
        const S = e.componentPropertyDefinitions;
        let F = 0, w = 0;
        for (const [N, E] of Object.entries(S))
          try {
            const O = E.type;
            let A = null;
            if (typeof O == "string" ? (O === "TEXT" || O === "BOOLEAN" || O === "INSTANCE_SWAP" || O === "VARIANT") && (A = O) : typeof O == "number" && (A = {
              2: "TEXT",
              // Text property
              25: "BOOLEAN",
              // Boolean property
              27: "INSTANCE_SWAP",
              // Instance swap property
              26: "VARIANT"
              // Variant property
            }[O] || null), !A) {
              await t.warning(
                `  Unknown property type ${O} (${typeof O}) for property "${N}" in component "${e.name || "Unnamed"}"`
              ), w++;
              continue;
            }
            const M = E.defaultValue, J = N.split("#")[0];
            r.addComponentProperty(
              J,
              A,
              M
            ), F++;
          } catch (O) {
            await t.warning(
              `  Failed to add component property "${N}" to "${e.name || "Unnamed"}": ${O}`
            ), w++;
          }
        F > 0 && await t.log(
          `  Added ${F} component property definition(s) to "${e.name || "Unnamed"}"${w > 0 ? ` (${w} failed)` : ""}`
        );
      }
      break;
    case "COMPONENT_SET": {
      const S = e.children ? e.children.filter((N) => N.type === "COMPONENT").length : 0;
      await t.log(
        `Creating COMPONENT_SET "${e.name || "Unnamed"}" by combining ${S} component variant(s)`
      );
      const F = [];
      let w = null;
      if (e.children && Array.isArray(e.children)) {
        w = figma.createFrame(), w.name = `_temp_${e.name || "COMPONENT_SET"}`, w.visible = !1, ((a == null ? void 0 : a.type) === "PAGE" ? a : figma.currentPage).appendChild(w);
        for (const E of e.children)
          if (E.type === "COMPONENT" && !E._truncated)
            try {
              const O = await Pe(
                E,
                w,
                // Use temp parent for now
                i,
                n,
                s,
                c,
                o,
                d,
                m,
                f,
                // Pass deferredInstances through for component set creation
                null,
                // parentNodeData - not needed here, will be passed correctly in recursive calls
                y
              );
              O && O.type === "COMPONENT" && (F.push(O), await t.log(
                `  Created component variant: "${O.name || "Unnamed"}"`
              ));
            } catch (O) {
              await t.warning(
                `  Failed to create component variant "${E.name || "Unnamed"}": ${O}`
              );
            }
      }
      if (F.length > 0)
        try {
          const N = a || figma.currentPage, E = figma.combineAsVariants(
            F,
            N
          );
          e.name && (E.name = e.name), e.x !== void 0 && (E.x = e.x), e.y !== void 0 && (E.y = e.y), w && w.parent && w.remove(), await t.log(
            `  ✓ Successfully created COMPONENT_SET "${E.name}" with ${F.length} variant(s)`
          ), r = E;
        } catch (N) {
          if (await t.warning(
            `  Failed to combine components into COMPONENT_SET "${e.name || "Unnamed"}": ${N}. Falling back to frame.`
          ), r = figma.createFrame(), e.name && (r.name = e.name), w && w.children.length > 0) {
            for (const E of w.children)
              r.appendChild(E);
            w.remove();
          }
        }
      else
        await t.warning(
          `  No valid component variants found for COMPONENT_SET "${e.name || "Unnamed"}". Creating frame instead.`
        ), r = figma.createFrame(), e.name && (r.name = e.name), w && w.remove();
      break;
    }
    case "INSTANCE":
      if (d)
        r = figma.createFrame(), e.name && (r.name = e.name);
      else if (e._instanceRef !== void 0 && s && o) {
        const S = s.getInstanceByIndex(
          e._instanceRef
        );
        if (S && S.instanceType === "internal")
          if (S.componentNodeId)
            if (S.componentNodeId === e.id)
              await t.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), r = figma.createFrame(), e.name && (r.name = e.name);
            else {
              const F = o.get(
                S.componentNodeId
              );
              if (!F) {
                const w = Array.from(o.keys()).slice(
                  0,
                  20
                );
                await t.error(
                  `Component not found for internal instance "${e.name}" (ID: ${S.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), await t.error(
                  `Looking for component ID: ${S.componentNodeId}`
                ), await t.error(
                  `Available IDs in mapping (first 20): ${w.map((M) => M.substring(0, 8) + "...").join(", ")}`
                );
                const N = (M, J) => {
                  if (M.type === "COMPONENT" && M.id === J)
                    return !0;
                  if (M.children && Array.isArray(M.children)) {
                    for (const H of M.children)
                      if (!H._truncated && N(H, J))
                        return !0;
                  }
                  return !1;
                }, E = N(
                  e,
                  S.componentNodeId
                );
                await t.error(
                  `Component ID ${S.componentNodeId.substring(0, 8)}... exists in current node tree: ${E}`
                ), await t.error(
                  `WARNING: Component ID ${S.componentNodeId.substring(0, 8)}... not found in nodeIdMapping. This might indicate:`
                ), await t.error(
                  "  1. The component doesn't exist in the pageData (detached component?)"
                ), await t.error(
                  "  2. The component wasn't collected in the first pass"
                ), await t.error(
                  "  3. The component ID in the instance table doesn't match the actual component ID"
                );
                const O = w.filter(
                  (M) => M.startsWith(S.componentNodeId.substring(0, 8))
                );
                O.length > 0 && await t.error(
                  `Found IDs with matching prefix: ${O.map((M) => M.substring(0, 8) + "...").join(", ")}`
                );
                const A = `Component not found for internal instance "${e.name}" (ID: ${S.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${w.map((M) => M.substring(0, 8) + "...").join(", ")}`;
                throw new Error(A);
              }
              if (F && F.type === "COMPONENT") {
                if (r = F.createInstance(), await t.log(
                  `✓ Created internal instance "${e.name}" from component "${S.componentName}"`
                ), S.variantProperties && Object.keys(S.variantProperties).length > 0)
                  try {
                    let w = null;
                    if (F.parent && F.parent.type === "COMPONENT_SET")
                      w = F.parent.componentPropertyDefinitions, await t.log(
                        `  DEBUG: Component "${S.componentName}" is inside component set "${F.parent.name}" with ${Object.keys(w || {}).length} property definitions`
                      );
                    else {
                      const N = await r.getMainComponentAsync();
                      if (N) {
                        const E = N.type;
                        await t.log(
                          `  DEBUG: Internal instance "${e.name}" - componentNode parent: ${F.parent ? F.parent.type : "N/A"}, mainComponent type: ${E}, mainComponent parent: ${N.parent ? N.parent.type : "N/A"}`
                        ), E === "COMPONENT_SET" ? w = N.componentPropertyDefinitions : E === "COMPONENT" && N.parent && N.parent.type === "COMPONENT_SET" ? (w = N.parent.componentPropertyDefinitions, await t.log(
                          `  DEBUG: Found component set parent "${N.parent.name}" with ${Object.keys(w || {}).length} property definitions`
                        )) : await t.log(
                          `  Skipping variant properties for internal instance "${e.name}" - component "${S.componentName}" is not yet in a COMPONENT_SET (will be moved later during component set creation)`
                        );
                      }
                    }
                    if (w) {
                      const N = {};
                      for (const [E, O] of Object.entries(
                        S.variantProperties
                      )) {
                        const A = E.split("#")[0];
                        w[A] && (N[A] = O);
                      }
                      Object.keys(N).length > 0 && r.setProperties(N);
                    }
                  } catch (w) {
                    const N = `Failed to set variant properties for instance "${e.name}": ${w}`;
                    throw await t.error(N), new Error(N);
                  }
                if (S.componentProperties && Object.keys(S.componentProperties).length > 0)
                  try {
                    const w = await r.getMainComponentAsync();
                    if (w) {
                      let N = null;
                      const E = w.type;
                      if (E === "COMPONENT_SET" ? N = w.componentPropertyDefinitions : E === "COMPONENT" && w.parent && w.parent.type === "COMPONENT_SET" ? N = w.parent.componentPropertyDefinitions : E === "COMPONENT" && (N = w.componentPropertyDefinitions), N)
                        for (const [O, A] of Object.entries(
                          S.componentProperties
                        )) {
                          const M = O.split("#")[0];
                          if (N[M])
                            try {
                              let J = A;
                              A && typeof A == "object" && "value" in A && (J = A.value), r.setProperties({
                                [M]: J
                              });
                            } catch (J) {
                              const H = `Failed to set component property "${M}" for internal instance "${e.name}": ${J}`;
                              throw await t.error(H), new Error(H);
                            }
                        }
                    } else
                      await t.warning(
                        `Cannot set component properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (w) {
                    if (w instanceof Error)
                      throw w;
                    const N = `Failed to set component properties for instance "${e.name}": ${w}`;
                    throw await t.error(N), new Error(N);
                  }
              } else if (!r && F) {
                const w = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${S.componentNodeId.substring(0, 8)}...).`;
                throw await t.error(w), new Error(w);
              }
            }
          else {
            const F = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw await t.error(F), new Error(F);
          }
        else if (S && S.instanceType === "remote")
          if (m) {
            const F = m.get(
              e._instanceRef
            );
            if (F) {
              if (r = F.createInstance(), await t.log(
                `✓ Created remote instance "${e.name}" from component "${S.componentName}" on REMOTES page`
              ), S.variantProperties && Object.keys(S.variantProperties).length > 0)
                try {
                  const w = await r.getMainComponentAsync();
                  if (w) {
                    let N = null;
                    const E = w.type;
                    if (E === "COMPONENT_SET" ? N = w.componentPropertyDefinitions : E === "COMPONENT" && w.parent && w.parent.type === "COMPONENT_SET" ? N = w.parent.componentPropertyDefinitions : await t.log(
                      `Skipping variant properties for remote instance "${e.name}" - main component is not a COMPONENT_SET or variant (expected for remote components)`
                    ), N) {
                      const O = {};
                      for (const [A, M] of Object.entries(
                        S.variantProperties
                      )) {
                        const J = A.split("#")[0];
                        N[J] && (O[J] = M);
                      }
                      Object.keys(O).length > 0 && r.setProperties(O);
                    }
                  } else
                    await t.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (w) {
                  const N = `Failed to set variant properties for remote instance "${e.name}": ${w}`;
                  throw await t.error(N), new Error(N);
                }
              if (S.componentProperties && Object.keys(S.componentProperties).length > 0)
                try {
                  const w = await r.getMainComponentAsync();
                  if (w) {
                    let N = null;
                    const E = w.type;
                    if (E === "COMPONENT_SET" ? N = w.componentPropertyDefinitions : E === "COMPONENT" && w.parent && w.parent.type === "COMPONENT_SET" ? N = w.parent.componentPropertyDefinitions : E === "COMPONENT" && (N = w.componentPropertyDefinitions), N)
                      for (const [O, A] of Object.entries(
                        S.componentProperties
                      )) {
                        const M = O.split("#")[0];
                        if (N[M])
                          try {
                            let J = A;
                            A && typeof A == "object" && "value" in A && (J = A.value), r.setProperties({
                              [M]: J
                            });
                          } catch (J) {
                            const H = `Failed to set component property "${M}" for remote instance "${e.name}": ${J}`;
                            throw await t.error(H), new Error(H);
                          }
                      }
                  } else
                    await t.warning(
                      `Cannot set component properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (w) {
                  if (w instanceof Error)
                    throw w;
                  const N = `Failed to set component properties for remote instance "${e.name}": ${w}`;
                  throw await t.error(N), new Error(N);
                }
              if (e.width !== void 0 && e.height !== void 0)
                try {
                  r.resize(e.width, e.height);
                } catch (w) {
                  await t.log(
                    `Note: Could not resize remote instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
                  );
                }
            } else {
              const w = `Remote component not found for instance "${e.name}" (index ${e._instanceRef}). The remote component should have been created on the REMOTES page.`;
              throw await t.error(w), new Error(w);
            }
          } else {
            const F = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw await t.error(F), new Error(F);
          }
        else if ((S == null ? void 0 : S.instanceType) === "normal") {
          if (!S.componentPageName) {
            const A = `Normal instance "${e.name}" missing componentPageName. Cannot resolve.`;
            throw await t.error(A), new Error(A);
          }
          await figma.loadAllPagesAsync();
          const F = figma.root.children.find(
            (A) => A.name === S.componentPageName
          );
          if (!F) {
            await t.log(
              `  Deferring normal instance "${e.name}" - referenced page "${S.componentPageName}" does not exist yet (may be circular reference or not yet imported)`
            );
            const A = figma.createFrame();
            if (A.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (A.x = e.x), e.y !== void 0 && (A.y = e.y), e.width !== void 0 && e.height !== void 0 ? A.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && A.resize(e.w, e.h), f) {
              const M = {
                placeholderFrameId: A.id,
                instanceEntry: S,
                nodeData: e,
                parentNodeId: a.id,
                instanceIndex: e._instanceRef
              };
              f.push(M), await t.log(
                `  [DEBUG] Added deferred instance "${e.name}" to array (array length: ${f.length})`
              );
            } else
              await t.log(
                `  [DEBUG] deferredInstances array is null/undefined - cannot store deferred instance "${e.name}"`
              );
            r = A;
            break;
          }
          let w = null;
          const N = (A, M, J, H, X) => {
            if (M.length === 0) {
              let Z = null;
              for (const te of A.children || [])
                if (te.type === "COMPONENT") {
                  if (te.name === J)
                    if (Z || (Z = te), H)
                      try {
                        const ie = te.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (ie && JSON.parse(ie).id === H)
                          return te;
                      } catch (ie) {
                      }
                    else
                      return te;
                } else if (te.type === "COMPONENT_SET") {
                  if (X && te.name !== X)
                    continue;
                  for (const ie of te.children || [])
                    if (ie.type === "COMPONENT" && ie.name === J)
                      if (Z || (Z = ie), H)
                        try {
                          const Se = ie.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (Se && JSON.parse(Se).id === H)
                            return ie;
                        } catch (Se) {
                        }
                      else
                        return ie;
                }
              return Z;
            }
            const [ee, ...Q] = M;
            for (const Z of A.children || [])
              if (Z.name === ee) {
                if (Q.length === 0 && Z.type === "COMPONENT_SET") {
                  if (X && Z.name !== X)
                    continue;
                  for (const te of Z.children || [])
                    if (te.type === "COMPONENT" && te.name === J) {
                      if (H)
                        try {
                          const ie = te.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (ie && JSON.parse(ie).id === H)
                            return te;
                        } catch (ie) {
                        }
                      return te;
                    }
                  return null;
                }
                return N(
                  Z,
                  Q,
                  J,
                  H,
                  X
                );
              }
            return null;
          };
          await t.log(
            `  Looking for component "${S.componentName}" on page "${S.componentPageName}"${S.path && S.path.length > 0 ? ` at path [${S.path.join(" → ")}]` : " at page root"}${S.componentGuid ? ` (GUID: ${S.componentGuid.substring(0, 8)}...)` : ""}`
          );
          const E = [], O = (A, M = 0) => {
            const J = "  ".repeat(M);
            if (A.type === "COMPONENT")
              E.push(`${J}COMPONENT: "${A.name}"`);
            else if (A.type === "COMPONENT_SET") {
              E.push(
                `${J}COMPONENT_SET: "${A.name}"`
              );
              for (const H of A.children || [])
                H.type === "COMPONENT" && E.push(
                  `${J}  └─ COMPONENT: "${H.name}"`
                );
            }
            for (const H of A.children || [])
              O(H, M + 1);
          };
          if (O(F), E.length > 0 ? await t.log(
            `  Available components on page "${S.componentPageName}":
${E.slice(0, 20).join(`
`)}${E.length > 20 ? `
  ... and ${E.length - 20} more` : ""}`
          ) : await t.warning(
            `  No components found on page "${S.componentPageName}"`
          ), w = N(
            F,
            S.path || [],
            S.componentName,
            S.componentGuid,
            S.componentSetName
          ), w && S.componentGuid)
            try {
              const A = w.getPluginData(
                "RecursicaPublishedMetadata"
              );
              if (A) {
                const M = JSON.parse(A);
                M.id !== S.componentGuid ? await t.warning(
                  `  Found component "${S.componentName}" by name but GUID verification failed (expected ${S.componentGuid.substring(0, 8)}..., got ${M.id ? M.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`
                ) : await t.log(
                  `  Found component "${S.componentName}" with matching GUID ${S.componentGuid.substring(0, 8)}...`
                );
              } else
                await t.warning(
                  `  Found component "${S.componentName}" by name but no metadata found. Using name match as fallback.`
                );
            } catch (A) {
              await t.warning(
                `  Found component "${S.componentName}" by name but GUID verification failed. Using name match as fallback.`
              );
            }
          if (!w) {
            await t.log(
              `  Deferring normal instance "${e.name}" - component "${S.componentName}" not found on page "${S.componentPageName}" (may not be created yet due to circular reference)`
            );
            const A = figma.createFrame();
            if (A.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (A.x = e.x), e.y !== void 0 && (A.y = e.y), e.width !== void 0 && e.height !== void 0 ? A.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && A.resize(e.w, e.h), f) {
              const M = {
                placeholderFrameId: A.id,
                instanceEntry: S,
                nodeData: e,
                parentNodeId: a.id,
                instanceIndex: e._instanceRef
              };
              f.push(M), await t.log(
                `  [DEBUG] Added deferred instance "${e.name}" to array (array length: ${f.length})`
              );
            } else
              await t.log(
                `  [DEBUG] deferredInstances array is null/undefined - cannot store deferred instance "${e.name}"`
              );
            r = A;
            break;
          }
          if (r = w.createInstance(), await t.log(
            `  Created normal instance "${e.name}" from component "${S.componentName}" on page "${S.componentPageName}"`
          ), S.variantProperties && Object.keys(S.variantProperties).length > 0)
            try {
              const A = await r.getMainComponentAsync();
              if (A) {
                let M = null;
                const J = A.type;
                if (J === "COMPONENT_SET" ? M = A.componentPropertyDefinitions : J === "COMPONENT" && A.parent && A.parent.type === "COMPONENT_SET" ? M = A.parent.componentPropertyDefinitions : await t.warning(
                  `Cannot set variant properties for normal instance "${e.name}" - main component is not a COMPONENT_SET or variant`
                ), M) {
                  const H = {};
                  for (const [X, ee] of Object.entries(
                    S.variantProperties
                  )) {
                    const Q = X.split("#")[0];
                    M[Q] && (H[Q] = ee);
                  }
                  Object.keys(H).length > 0 && r.setProperties(H);
                }
              }
            } catch (A) {
              await t.warning(
                `Failed to set variant properties for normal instance "${e.name}": ${A}`
              );
            }
          if (S.componentProperties && Object.keys(S.componentProperties).length > 0)
            try {
              const A = await r.getMainComponentAsync();
              if (A) {
                let M = null;
                const J = A.type;
                if (J === "COMPONENT_SET" ? M = A.componentPropertyDefinitions : J === "COMPONENT" && A.parent && A.parent.type === "COMPONENT_SET" ? M = A.parent.componentPropertyDefinitions : J === "COMPONENT" && (M = A.componentPropertyDefinitions), M) {
                  const H = {};
                  for (const [X, ee] of Object.entries(
                    S.componentProperties
                  )) {
                    const Q = X.split("#")[0];
                    let Z;
                    if (M[X] ? Z = X : M[Q] ? Z = Q : Z = Object.keys(M).find(
                      (te) => te.split("#")[0] === Q
                    ), Z) {
                      const te = ee && typeof ee == "object" && "value" in ee ? ee.value : ee;
                      H[Z] = te;
                    } else
                      await t.warning(
                        `Component property "${Q}" (from "${X}") does not exist on component "${S.componentName}" for normal instance "${e.name}". Available properties: ${Object.keys(M).join(", ") || "none"}`
                      );
                  }
                  if (Object.keys(H).length > 0)
                    try {
                      await t.log(
                        `  Attempting to set component properties for normal instance "${e.name}": ${Object.keys(H).join(", ")}`
                      ), await t.log(
                        `  Available component properties: ${Object.keys(M).join(", ")}`
                      ), r.setProperties(H), await t.log(
                        `  ✓ Successfully set component properties for normal instance "${e.name}": ${Object.keys(H).join(", ")}`
                      );
                    } catch (X) {
                      await t.warning(
                        `Failed to set component properties for normal instance "${e.name}": ${X}`
                      ), await t.warning(
                        `  Properties attempted: ${JSON.stringify(H)}`
                      ), await t.warning(
                        `  Available properties: ${JSON.stringify(Object.keys(M))}`
                      );
                    }
                }
              } else
                await t.warning(
                  `Cannot set component properties for normal instance "${e.name}" - main component not found`
                );
            } catch (A) {
              await t.warning(
                `Failed to set component properties for normal instance "${e.name}": ${A}`
              );
            }
          if (e.width !== void 0 && e.height !== void 0)
            try {
              r.resize(e.width, e.height);
            } catch (A) {
              await t.log(
                `Note: Could not resize normal instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
              );
            }
        } else {
          const F = `Instance "${e.name}" has unknown or missing instance type: ${(S == null ? void 0 : S.instanceType) || "unknown"}`;
          throw await t.error(F), new Error(F);
        }
      } else {
        const S = `Instance "${e.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        throw await t.error(S), new Error(S);
      }
      break;
    case "GROUP":
      r = figma.createFrame();
      break;
    case "BOOLEAN_OPERATION": {
      const S = `Boolean operation nodes cannot be imported. Found boolean operation: "${e.name}".`;
      throw await t.error(S), new Error(S);
    }
    case "POLYGON":
      r = figma.createPolygon();
      break;
    default: {
      const S = `Unsupported node type: ${e.type}. This node type cannot be imported.`;
      throw await t.error(S), new Error(S);
    }
  }
  if (!r)
    return null;
  e.id && o && (o.set(e.id, r), r.type === "COMPONENT" && await t.log(
    `  Stored COMPONENT "${e.name || "Unnamed"}" in nodeIdMapping (ID: ${e.id.substring(0, 8)}...)`
  )), e._instanceRef !== void 0 && r.type === "INSTANCE" ? (o._instanceTableMap || (o._instanceTableMap = /* @__PURE__ */ new Map()), o._instanceTableMap.set(
    r.id,
    e._instanceRef
  ), await t.log(
    `  Stored instance table mapping: instance "${r.name}" (ID: ${r.id.substring(0, 8)}...) -> instance table index ${e._instanceRef}`
  )) : r.type === "INSTANCE" && await t.log(
    `  WARNING: Instance "${r.name}" (ID: ${r.id.substring(0, 8)}...) has no _instanceRef in nodeData - will use fallback matching in third pass`
  );
  const h = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.paddingLeft || e.boundVariables.paddingRight || e.boundVariables.paddingTop || e.boundVariables.paddingBottom || e.boundVariables.itemSpacing);
  fa(
    r,
    e.type || "FRAME",
    h
  ), e.name !== void 0 && (r.name = e.name || "Unnamed Node");
  const l = p && p.layoutMode !== void 0 && p.layoutMode !== "NONE", v = a && "layoutMode" in a && a.layoutMode !== "NONE";
  l || v || (e.x !== void 0 && (r.x = e.x), e.y !== void 0 && (r.y = e.y));
  const u = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height), b = e.name || "Unnamed";
  if (e.preserveRatio !== void 0 && await t.log(
    `  [ISSUE #3 DEBUG] "${b}" has preserveRatio in nodeData: ${e.preserveRatio}`
  ), e.constraints !== void 0 && await t.log(
    `  [ISSUE #4 DEBUG] "${b}" has constraints in nodeData: ${JSON.stringify(e.constraints)}`
  ), (e.constraintHorizontal !== void 0 || e.constraintVertical !== void 0) && await t.log(
    `  [ISSUE #4 DEBUG] "${b}" has constraintHorizontal: ${e.constraintHorizontal}, constraintVertical: ${e.constraintVertical}`
  ), e.type !== "VECTOR" && e.width !== void 0 && e.height !== void 0 && !u) {
    const S = r.preserveRatio;
    S !== void 0 && await t.log(
      `  [ISSUE #3 DEBUG] "${b}" preserveRatio before resize: ${S}`
    ), r.resize(e.width, e.height);
    const F = r.preserveRatio;
    F !== void 0 ? await t.log(
      `  [ISSUE #3 DEBUG] "${b}" preserveRatio after resize: ${F}`
    ) : e.preserveRatio !== void 0 && await t.warning(
      `  ⚠️ ISSUE #3: "${b}" preserveRatio was in nodeData (${e.preserveRatio}) but not set on node!`
    );
    const w = r.constraints, N = r.constraintHorizontal, E = r.constraintVertical;
    if (w !== void 0 && await t.log(
      `  [ISSUE #4 DEBUG] "${b}" constraints after resize: ${JSON.stringify(w)}`
    ), (N !== void 0 || E !== void 0) && await t.log(
      `  [ISSUE #4 DEBUG] "${b}" constraintHorizontal: ${N}, constraintVertical: ${E}`
    ), e.constraintHorizontal !== void 0) {
      const M = e.constraintHorizontal;
      N !== M ? (await t.log(
        `  [ISSUE #4] Setting constraintHorizontal to ${M} for "${b}" (was ${N})`
      ), r.constraintHorizontal = M) : await t.log(
        `  [ISSUE #4] constraintHorizontal already correct (${M}) for "${b}"`
      );
    } else if (((x = e.constraints) == null ? void 0 : x.horizontal) !== void 0) {
      const M = e.constraints.horizontal;
      N !== M && (await t.log(
        `  [ISSUE #4] Setting constraintHorizontal to ${M} for "${b}" (was ${N}) from constraints object`
      ), r.constraintHorizontal = M);
    }
    if (e.constraintVertical !== void 0) {
      const M = e.constraintVertical;
      E !== M ? (await t.log(
        `  [ISSUE #4] Setting constraintVertical to ${M} for "${b}" (was ${E})`
      ), r.constraintVertical = M) : await t.log(
        `  [ISSUE #4] constraintVertical already correct (${M}) for "${b}"`
      );
    } else if (((C = e.constraints) == null ? void 0 : C.vertical) !== void 0) {
      const M = e.constraints.vertical;
      E !== M && (await t.log(
        `  [ISSUE #4] Setting constraintVertical to ${M} for "${b}" (was ${E}) from constraints object`
      ), r.constraintVertical = M);
    }
    const O = r.constraintHorizontal, A = r.constraintVertical;
    if (e.constraintHorizontal !== void 0 || e.constraintVertical !== void 0 || e.constraints !== void 0) {
      const M = e.constraintHorizontal || ((k = e.constraints) == null ? void 0 : k.horizontal), J = e.constraintVertical || ((L = e.constraints) == null ? void 0 : L.vertical);
      M !== void 0 && O !== M && await t.warning(
        `  ⚠️ ISSUE #4: "${b}" constraintHorizontal mismatch after setting! Expected: ${M}, Got: ${O}`
      ), J !== void 0 && A !== J && await t.warning(
        `  ⚠️ ISSUE #4: "${b}" constraintVertical mismatch after setting! Expected: ${J}, Got: ${A}`
      ), M !== void 0 && J !== void 0 && O === M && A === J && await t.log(
        `  ✓ ISSUE #4: "${b}" constraints set correctly: H=${O}, V=${A}`
      );
    }
  } else
    e.constraintHorizontal !== void 0 ? (await t.log(
      `  [ISSUE #4] Setting constraintHorizontal to ${e.constraintHorizontal} for "${b}" (no resize)`
    ), r.constraintHorizontal = e.constraintHorizontal) : ((B = e.constraints) == null ? void 0 : B.horizontal) !== void 0 && (await t.log(
      `  [ISSUE #4] Setting constraintHorizontal to ${e.constraints.horizontal} for "${b}" from constraints object (no resize)`
    ), r.constraintHorizontal = e.constraints.horizontal), e.constraintVertical !== void 0 ? (await t.log(
      `  [ISSUE #4] Setting constraintVertical to ${e.constraintVertical} for "${b}" (no resize)`
    ), r.constraintVertical = e.constraintVertical) : ((I = e.constraints) == null ? void 0 : I.vertical) !== void 0 && (await t.log(
      `  [ISSUE #4] Setting constraintVertical to ${e.constraints.vertical} for "${b}" from constraints object (no resize)`
    ), r.constraintVertical = e.constraints.vertical);
  const R = e.boundVariables && typeof e.boundVariables == "object";
  if (e.visible !== void 0 && (r.visible = e.visible), e.locked !== void 0 && (r.locked = e.locked), e.opacity !== void 0 && (!R || !e.boundVariables.opacity) && (r.opacity = e.opacity), e.rotation !== void 0 && (!R || !e.boundVariables.rotation) && (r.rotation = e.rotation), e.blendMode !== void 0 && (!R || !e.boundVariables.blendMode) && (r.blendMode = e.blendMode), e.type !== "INSTANCE") {
    if (e.type === "VECTOR" && e.boundVariables && (await t.log(
      `  DEBUG: VECTOR "${e.name || "Unnamed"}" (ID: ${((_ = e.id) == null ? void 0 : _.substring(0, 8)) || "unknown"}...) has boundVariables: ${Object.keys(e.boundVariables).join(", ")}`
    ), e.boundVariables.fills && await t.log(
      `  DEBUG:   boundVariables.fills: ${JSON.stringify(e.boundVariables.fills)}`
    )), e.fills !== void 0)
      try {
        let S = e.fills;
        const F = e.name || "Unnamed";
        if (Array.isArray(S))
          for (let w = 0; w < S.length; w++) {
            const N = S[w];
            N && typeof N == "object" && N.selectionColor !== void 0 && await t.log(
              `  [ISSUE #2 DEBUG] "${F}" fill[${w}] has selectionColor: ${JSON.stringify(N.selectionColor)}`
            );
          }
        if (Array.isArray(S)) {
          const w = e.name || "Unnamed";
          for (let N = 0; N < S.length; N++) {
            const E = S[N];
            E && typeof E == "object" && E.selectionColor !== void 0 && await t.warning(
              `  ⚠️ ISSUE #2: "${w}" fill[${N}] has selectionColor that will be preserved: ${JSON.stringify(E.selectionColor)}`
            );
          }
          S = S.map((N) => {
            if (N && typeof N == "object") {
              const E = q({}, N);
              return delete E.boundVariables, E;
            }
            return N;
          });
        }
        if (e.fills && Array.isArray(e.fills) && c) {
          if (e.type === "VECTOR") {
            await t.log(
              `  DEBUG: VECTOR "${e.name || "Unnamed"}" has ${e.fills.length} fill(s)`
            );
            for (let O = 0; O < e.fills.length; O++) {
              const A = e.fills[O];
              if (A && typeof A == "object") {
                const M = A.boundVariables || A.bndVar;
                M ? await t.log(
                  `  DEBUG:   fill[${O}] has boundVariables: ${JSON.stringify(M)}`
                ) : await t.log(
                  `  DEBUG:   fill[${O}] has no boundVariables`
                );
              }
            }
          }
          const w = [];
          for (let O = 0; O < S.length; O++) {
            const A = S[O], M = e.fills[O];
            if (!M || typeof M != "object") {
              w.push(A);
              continue;
            }
            const J = M.boundVariables || M.bndVar;
            if (!J) {
              w.push(A);
              continue;
            }
            const H = q({}, A);
            H.boundVariables = {};
            for (const [X, ee] of Object.entries(J))
              if (e.type === "VECTOR" && await t.log(
                `  DEBUG: Processing fill[${O}].${X} on VECTOR "${r.name || "Unnamed"}": varInfo=${JSON.stringify(ee)}`
              ), $e(ee)) {
                const Q = ee._varRef;
                if (Q !== void 0) {
                  if (e.type === "VECTOR") {
                    await t.log(
                      `  DEBUG: Looking up variable reference ${Q} in recognizedVariables (map has ${c.size} entries)`
                    );
                    const te = Array.from(
                      c.keys()
                    ).slice(0, 10);
                    await t.log(
                      `  DEBUG: Available variable references (first 10): ${te.join(", ")}`
                    );
                    const ie = c.has(String(Q));
                    if (await t.log(
                      `  DEBUG: Variable reference ${Q} ${ie ? "found" : "NOT FOUND"} in recognizedVariables`
                    ), !ie) {
                      const Se = Array.from(
                        c.keys()
                      ).sort((tt, It) => parseInt(tt) - parseInt(It));
                      await t.log(
                        `  DEBUG: All available variable references: ${Se.join(", ")}`
                      );
                    }
                  }
                  let Z = c.get(String(Q));
                  Z || (e.type === "VECTOR" && await t.log(
                    `  DEBUG: Variable ${Q} not in recognizedVariables. variableTable=${!!i}, collectionTable=${!!n}, recognizedCollections=${!!y}`
                  ), i && n && y ? (await t.log(
                    `  Variable reference ${Q} not in recognizedVariables, attempting to resolve from variable table...`
                  ), Z = await ma(
                    Q,
                    i,
                    n,
                    y
                  ) || void 0, Z ? (c.set(String(Q), Z), await t.log(
                    `  ✓ Resolved variable ${Z.name} from variable table and added to recognizedVariables`
                  )) : await t.warning(
                    `  Failed to resolve variable ${Q} from variable table`
                  )) : e.type === "VECTOR" && await t.warning(
                    `  Cannot resolve variable ${Q} from table - missing required parameters`
                  )), Z ? (H.boundVariables[X] = {
                    type: "VARIABLE_ALIAS",
                    id: Z.id
                  }, await t.log(
                    `  ✓ Restored bound variable for fill[${O}].${X} on "${r.name || "Unnamed"}" (${e.type}): variable ${Z.name} (ID: ${Z.id.substring(0, 8)}...)`
                  )) : await t.warning(
                    `  Variable reference ${Q} not found in recognizedVariables for fill[${O}].${X} on "${r.name || "Unnamed"}"`
                  );
                } else
                  e.type === "VECTOR" && await t.warning(
                    `  DEBUG: Variable reference ${Q} is undefined for fill[${O}].${X} on VECTOR "${r.name || "Unnamed"}"`
                  );
              } else
                e.type === "VECTOR" && await t.warning(
                  `  DEBUG: fill[${O}].${X} on VECTOR "${r.name || "Unnamed"}" is not a variable reference: ${JSON.stringify(ee)}`
                );
            w.push(H);
          }
          r.fills = w, await t.log(
            `  ✓ Set fills with boundVariables on "${r.name || "Unnamed"}" (${e.type})`
          );
          const N = r.fills, E = e.name || "Unnamed";
          if (Array.isArray(N))
            for (let O = 0; O < N.length; O++) {
              const A = N[O];
              A && typeof A == "object" && A.selectionColor !== void 0 && await t.warning(
                `  ⚠️ ISSUE #2: "${E}" fill[${O}] has selectionColor AFTER setting with boundVariables: ${JSON.stringify(A.selectionColor)}`
              );
            }
        } else {
          r.fills = S;
          const w = r.fills, N = e.name || "Unnamed";
          if (Array.isArray(w))
            for (let E = 0; E < w.length; E++) {
              const O = w[E];
              O && typeof O == "object" && O.selectionColor !== void 0 && await t.warning(
                `  ⚠️ ISSUE #2: "${N}" fill[${E}] has selectionColor AFTER setting: ${JSON.stringify(O.selectionColor)}`
              );
            }
        }
        e.boundVariables && Object.keys(e.boundVariables).length > 0 && !e.boundVariables.fills && await t.log(
          `  Node "${r.name || "Unnamed"}" (${e.type}) has boundVariables but not for fills: ${Object.keys(e.boundVariables).join(", ")}`
        );
      } catch (S) {
        console.log("Error setting fills:", S);
      }
    else if (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "GROUP")
      try {
        r.fills = [];
      } catch (S) {
        console.log("Error clearing fills:", S);
      }
  }
  if (e.strokes !== void 0)
    try {
      e.strokes.length > 0 ? r.strokes = e.strokes : r.strokes = [];
    } catch (S) {
      console.log("Error setting strokes:", S);
    }
  else if (e.type === "VECTOR")
    try {
      r.strokes = [];
    } catch (S) {
    }
  const V = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.strokeWeight || e.boundVariables.strokeAlign);
  e.strokeWeight !== void 0 ? (!V || !e.boundVariables.strokeWeight) && (r.strokeWeight = e.strokeWeight) : e.type === "VECTOR" && (e.strokes === void 0 || e.strokes.length === 0) && (!V || !e.boundVariables.strokeWeight) && (r.strokeWeight = 0), e.strokeAlign !== void 0 && (!V || !e.boundVariables.strokeAlign) && (r.strokeAlign = e.strokeAlign);
  const G = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.cornerRadius || e.boundVariables.topLeftRadius || e.boundVariables.topRightRadius || e.boundVariables.bottomLeftRadius || e.boundVariables.bottomRightRadius);
  if (e.cornerRadius !== void 0 && (!G || !e.boundVariables.cornerRadius) && (r.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (r.effects = e.effects), e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") {
    if (e.layoutMode !== void 0 && (["NONE", "HORIZONTAL", "VERTICAL"].includes(e.layoutMode) ? r.layoutMode = e.layoutMode : await t.warning(
      `Invalid layoutMode value "${e.layoutMode}" for node "${e.name || "Unnamed"}", skipping layoutMode setting`
    )), e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.boundVariables && c) {
      const F = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ];
      for (const w of F) {
        const N = e.boundVariables[w];
        if (N && $e(N)) {
          const E = N._varRef;
          if (E !== void 0) {
            const O = c.get(String(E));
            if (O) {
              const A = {
                type: "VARIABLE_ALIAS",
                id: O.id
              };
              r.boundVariables || (r.boundVariables = {});
              const M = r[w], J = ($ = r.boundVariables) == null ? void 0 : $[w];
              await t.log(
                `  DEBUG: Attempting to set bound variable for ${w} on "${e.name || "Unnamed"}": current value=${M}, current boundVar=${JSON.stringify(J)}`
              );
              try {
                r.setBoundVariable(w, null);
              } catch (X) {
              }
              try {
                r.setBoundVariable(w, O);
                const X = (P = r.boundVariables) == null ? void 0 : P[w];
                await t.log(
                  `  DEBUG: Immediately after setting ${w} bound variable: ${JSON.stringify(X)}`
                );
              } catch (X) {
                await t.warning(
                  `  Error setting bound variable for ${w}: ${X instanceof Error ? X.message : String(X)}`
                );
              }
              const H = (U = r.boundVariables) == null ? void 0 : U[w];
              if (w === "itemSpacing") {
                const X = r[w], ee = (z = r.boundVariables) == null ? void 0 : z[w];
                await t.log(
                  `  [ISSUE #1 DEBUG] itemSpacing variable binding for "${e.name || "Unnamed"}":`
                ), await t.log(
                  `    - Expected variable ref: ${E}`
                ), await t.log(
                  `    - Final itemSpacing value: ${X}`
                ), await t.log(
                  `    - Final boundVariable: ${JSON.stringify(ee)}`
                ), await t.log(
                  `    - Variable found: ${O ? `Yes (ID: ${O.id})` : "No"}`
                ), !H || !H.id ? await t.warning(
                  "    ⚠️ ISSUE #1: itemSpacing variable binding FAILED - boundVariable not set correctly!"
                ) : await t.log(
                  "    ✓ itemSpacing variable binding SUCCESS"
                );
              }
              H && typeof H == "object" && H.type === "VARIABLE_ALIAS" && H.id === O.id ? await t.log(
                `  ✓ Set bound variable for ${w} on "${e.name || "Unnamed"}" (${e.type}): variable ${O.name} (ID: ${O.id.substring(0, 8)}...)`
              ) : await t.warning(
                `  Failed to set bound variable for ${w} on "${e.name || "Unnamed"}" - verification failed. Expected: ${JSON.stringify(A)}, Got: ${JSON.stringify(H)}`
              );
            }
          }
        }
      }
    }
    e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.itemSpacing !== void 0 ? e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.itemSpacing ? await t.log(
      `  Skipping itemSpacing (bound to variable) for "${e.name || "Unnamed"}"`
    ) : (await t.log(
      `  Setting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (${e.type})`
    ), r.itemSpacing = e.itemSpacing, await t.log(
      `  ✓ Set itemSpacing to ${r.itemSpacing} (verified)`
    )) : (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && await t.log(
      `  DEBUG: Not setting itemSpacing for "${e.name || "Unnamed"}": layoutMode=${e.layoutMode}, itemSpacing=${e.itemSpacing}`
    ), e.layoutWrap !== void 0 && (r.layoutWrap = e.layoutWrap), e.primaryAxisSizingMode !== void 0 ? r.primaryAxisSizingMode = e.primaryAxisSizingMode : r.primaryAxisSizingMode = "AUTO", e.counterAxisSizingMode !== void 0 ? r.counterAxisSizingMode = e.counterAxisSizingMode : r.counterAxisSizingMode = "AUTO", e.primaryAxisAlignItems !== void 0 && (r.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (r.counterAxisAlignItems = e.counterAxisAlignItems);
    const S = e.boundVariables && typeof e.boundVariables == "object";
    if (S) {
      const F = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ].filter((w) => e.boundVariables[w]);
      F.length > 0 && await t.log(
        `  DEBUG: Node "${e.name || "Unnamed"}" (${e.type}) has bound variables for: ${F.join(", ")}`
      );
    }
    if (e.paddingLeft !== void 0 && (!S || !e.boundVariables.paddingLeft) && (r.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (!S || !e.boundVariables.paddingRight) && (r.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (!S || !e.boundVariables.paddingTop) && (r.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (!S || !e.boundVariables.paddingBottom) && (r.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && r.layoutMode !== void 0 && r.layoutMode !== "NONE") {
      const F = ((D = r.boundVariables) == null ? void 0 : D.itemSpacing) !== void 0;
      !F && (!S || !e.boundVariables.itemSpacing) ? r.itemSpacing !== e.itemSpacing && (await t.log(
        `  Setting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (late setting)`
      ), r.itemSpacing = e.itemSpacing) : F && await t.log(
        `  Skipping late setting of itemSpacing for "${e.name || "Unnamed"}" - already bound to variable`
      );
    }
    e.counterAxisSpacing !== void 0 && (!S || !e.boundVariables.counterAxisSpacing) && r.layoutMode !== void 0 && r.layoutMode !== "NONE" && (r.counterAxisSpacing = e.counterAxisSpacing), e.layoutGrow !== void 0 && (r.layoutGrow = e.layoutGrow);
  }
  if ((e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (r.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (r.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (r.dashPattern = e.dashPattern), e.type === "VECTOR")) {
    if (e.fillGeometry !== void 0)
      try {
        const { normalizeSvgPath: F } = await Promise.resolve().then(() => Yt), w = e.fillGeometry.map((N) => {
          const E = N.data;
          return {
            data: F(E),
            windingRule: N.windingRule || N.windRule || "NONZERO"
          };
        });
        for (let N = 0; N < e.fillGeometry.length; N++) {
          const E = e.fillGeometry[N].data, O = w[N].data;
          E !== O && await t.log(
            `  Normalized path ${N + 1} for "${e.name || "Unnamed"}": ${E.substring(0, 50)}... -> ${O.substring(0, 50)}...`
          );
        }
        r.vectorPaths = w, await t.log(
          `  Set vectorPaths for VECTOR "${e.name || "Unnamed"}" (${w.length} path(s))`
        );
      } catch (F) {
        await t.warning(
          `Error setting vectorPaths for VECTOR "${e.name || "Unnamed"}": ${F}`
        );
      }
    if (e.strokeGeometry !== void 0)
      try {
        r.strokeGeometry = e.strokeGeometry;
      } catch (F) {
        await t.warning(
          `Error setting strokeGeometry for VECTOR "${e.name || "Unnamed"}": ${F}`
        );
      }
    const S = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
    if (e.width !== void 0 && e.height !== void 0 && !S)
      try {
        r.resize(e.width, e.height), await t.log(
          `  Set size for VECTOR "${e.name || "Unnamed"}" to ${e.width}x${e.height}`
        );
      } catch (F) {
        await t.warning(
          `Error setting size for VECTOR "${e.name || "Unnamed"}": ${F}`
        );
      }
  }
  if (e.type === "TEXT" && e.characters !== void 0)
    try {
      if (e.fontName)
        try {
          await figma.loadFontAsync(e.fontName), r.fontName = e.fontName;
        } catch (F) {
          await figma.loadFontAsync({
            family: "Roboto",
            style: "Regular"
          }), r.fontName = { family: "Roboto", style: "Regular" };
        }
      else
        await figma.loadFontAsync({
          family: "Roboto",
          style: "Regular"
        }), r.fontName = { family: "Roboto", style: "Regular" };
      r.characters = e.characters;
      const S = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.fontSize || e.boundVariables.letterSpacing || e.boundVariables.lineHeight);
      e.fontSize !== void 0 && (!S || !e.boundVariables.fontSize) && (r.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (r.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (r.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (!S || !e.boundVariables.letterSpacing) && (r.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (!S || !e.boundVariables.lineHeight) && (r.lineHeight = e.lineHeight), e.textCase !== void 0 && (r.textCase = e.textCase), e.textDecoration !== void 0 && (r.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (r.textAutoResize = e.textAutoResize);
    } catch (S) {
      console.log("Error setting text properties: " + S);
      try {
        r.characters = e.characters;
      } catch (F) {
        console.log("Could not set text characters: " + F);
      }
    }
  if (e.boundVariables && c) {
    const S = [
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "paddingBottom",
      "itemSpacing"
    ];
    for (const [F, w] of Object.entries(
      e.boundVariables
    ))
      if (F !== "fills" && !S.includes(F) && $e(w) && i && c) {
        const N = w._varRef;
        if (N !== void 0) {
          const E = c.get(String(N));
          if (E)
            try {
              const O = {
                type: "VARIABLE_ALIAS",
                id: E.id
              };
              r.boundVariables || (r.boundVariables = {});
              const A = r[F];
              A !== void 0 && r.boundVariables[F] === void 0 && await t.warning(
                `  Property ${F} has direct value ${A} which may prevent bound variable from being set`
              ), r.boundVariables[F] = O;
              const J = (j = r.boundVariables) == null ? void 0 : j[F];
              if (J && typeof J == "object" && J.type === "VARIABLE_ALIAS" && J.id === E.id)
                await t.log(
                  `  ✓ Set bound variable for ${F} on "${e.name || "Unnamed"}" (${e.type}): variable ${E.name} (ID: ${E.id.substring(0, 8)}...)`
                );
              else {
                const H = (W = r.boundVariables) == null ? void 0 : W[F];
                await t.warning(
                  `  Failed to set bound variable for ${F} on "${e.name || "Unnamed"}" - bound variable not persisted. Property value: ${A}, Expected: ${JSON.stringify(O)}, Got: ${JSON.stringify(H)}`
                );
              }
            } catch (O) {
              await t.warning(
                `  Error setting bound variable for ${F} on "${e.name || "Unnamed"}": ${O}`
              );
            }
          else
            await t.warning(
              `  Variable reference ${N} not found in recognizedVariables for ${F} on "${e.name || "Unnamed"}"`
            );
        }
      }
  }
  if (e.boundVariables && c && (e.boundVariables.width || e.boundVariables.height)) {
    const S = e.boundVariables.width, F = e.boundVariables.height;
    if (S && $e(S)) {
      const w = S._varRef;
      if (w !== void 0) {
        const N = c.get(String(w));
        if (N) {
          const E = {
            type: "VARIABLE_ALIAS",
            id: N.id
          };
          r.boundVariables || (r.boundVariables = {}), r.boundVariables.width = E;
        }
      }
    }
    if (F && $e(F)) {
      const w = F._varRef;
      if (w !== void 0) {
        const N = c.get(String(w));
        if (N) {
          const E = {
            type: "VARIABLE_ALIAS",
            id: N.id
          };
          r.boundVariables || (r.boundVariables = {}), r.boundVariables.height = E;
        }
      }
    }
  }
  const T = e.id && o && o.has(e.id) && r.type === "COMPONENT" && r.children && r.children.length > 0;
  if (e.children && Array.isArray(e.children) && r.type !== "INSTANCE" && !T) {
    const S = (w) => {
      const N = [];
      for (const E of w)
        E._truncated || (E.type === "COMPONENT" ? (N.push(E), E.children && Array.isArray(E.children) && N.push(...S(E.children))) : E.children && Array.isArray(E.children) && N.push(...S(E.children)));
      return N;
    };
    for (const w of e.children) {
      if (w._truncated) {
        console.log(
          `Skipping truncated children: ${w._reason || "Unknown"}`
        );
        continue;
      }
      w.type;
    }
    const F = S(e.children);
    await t.log(
      `  First pass: Creating ${F.length} COMPONENT node(s) (without children)...`
    );
    for (const w of F)
      await t.log(
        `  Collected COMPONENT "${w.name || "Unnamed"}" (ID: ${w.id ? w.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const w of F)
      if (w.id && o && !o.has(w.id)) {
        const N = figma.createComponent();
        if (w.name !== void 0 && (N.name = w.name || "Unnamed Node"), w.componentPropertyDefinitions) {
          const E = w.componentPropertyDefinitions;
          let O = 0, A = 0;
          for (const [M, J] of Object.entries(E))
            try {
              const X = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[J.type];
              if (!X) {
                await t.warning(
                  `  Unknown property type ${J.type} for property "${M}" in component "${w.name || "Unnamed"}"`
                ), A++;
                continue;
              }
              const ee = J.defaultValue, Q = M.split("#")[0];
              N.addComponentProperty(
                Q,
                X,
                ee
              ), O++;
            } catch (H) {
              await t.warning(
                `  Failed to add component property "${M}" to "${w.name || "Unnamed"}" in first pass: ${H}`
              ), A++;
            }
          O > 0 && await t.log(
            `  Added ${O} component property definition(s) to "${w.name || "Unnamed"}" in first pass${A > 0 ? ` (${A} failed)` : ""}`
          );
        }
        o.set(w.id, N), await t.log(
          `  Created COMPONENT "${w.name || "Unnamed"}" (ID: ${w.id.substring(0, 8)}...) in first pass`
        );
      }
    for (const w of e.children) {
      if (w._truncated)
        continue;
      const N = await Pe(
        w,
        r,
        i,
        n,
        s,
        c,
        o,
        d,
        m,
        f,
        // Pass deferredInstances through for recursive calls
        e,
        // parentNodeData - pass the parent's nodeData so children can check for auto-layout
        y
      );
      if (N && N.parent !== r) {
        if (N.parent && typeof N.parent.removeChild == "function")
          try {
            N.parent.removeChild(N);
          } catch (E) {
            await t.warning(
              `Failed to remove child "${N.name || "Unnamed"}" from parent "${N.parent.name || "Unnamed"}": ${E}`
            );
          }
        r.appendChild(N);
      }
    }
  }
  if (a && r.parent !== a) {
    if (r.parent && typeof r.parent.removeChild == "function")
      try {
        r.parent.removeChild(r);
      } catch (S) {
        await t.warning(
          `Failed to remove node "${r.name || "Unnamed"}" from parent "${r.parent.name || "Unnamed"}": ${S}`
        );
      }
    a.appendChild(r);
  }
  if ((r.type === "FRAME" || r.type === "COMPONENT" || r.type === "INSTANCE") && e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.itemSpacing !== void 0) {
    const S = ((Y = r.boundVariables) == null ? void 0 : Y.itemSpacing) !== void 0, F = e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.itemSpacing;
    if (S)
      await t.log(
        `  FINAL CHECK: itemSpacing is bound to variable for "${e.name || "Unnamed"}" - skipping direct value fix`
      );
    else if (F)
      await t.warning(
        `  FINAL CHECK: itemSpacing should be bound to variable for "${e.name || "Unnamed"}" but binding is missing!`
      );
    else {
      const w = r.itemSpacing;
      w !== e.itemSpacing ? (await t.log(
        `  FINAL FIX: Resetting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (was ${w})`
      ), r.itemSpacing = e.itemSpacing, await t.log(
        `  FINAL FIX: Verified itemSpacing is now ${r.itemSpacing}`
      )) : await t.log(
        `  FINAL CHECK: itemSpacing is already correct (${w}) for "${e.name || "Unnamed"}"`
      );
    }
  }
  return r;
}
async function ua(e, a, i) {
  let n = 0, s = 0, c = 0;
  const o = (m) => {
    const f = [];
    if (m.type === "INSTANCE" && f.push(m), "children" in m && m.children)
      for (const p of m.children)
        f.push(...o(p));
    return f;
  }, d = o(e);
  await t.log(
    `  Found ${d.length} instance(s) to process for variant properties`
  );
  for (const m of d)
    try {
      const f = await m.getMainComponentAsync();
      if (!f) {
        s++;
        continue;
      }
      const p = a.getSerializedTable();
      let y = null, r;
      if (i._instanceTableMap ? (r = i._instanceTableMap.get(
        m.id
      ), r !== void 0 ? (y = p[r], await t.log(
        `  Found instance table index ${r} for instance "${m.name}" (ID: ${m.id.substring(0, 8)}...)`
      )) : await t.log(
        `  No instance table index mapping found for instance "${m.name}" (ID: ${m.id.substring(0, 8)}...), using fallback matching`
      )) : await t.log(
        `  No instance table map found, using fallback matching for instance "${m.name}"`
      ), !y) {
        for (const [l, v] of Object.entries(p))
          if (v.instanceType === "internal" && v.componentNodeId && i.has(v.componentNodeId)) {
            const g = i.get(v.componentNodeId);
            if (g && g.id === f.id) {
              y = v, await t.log(
                `  Matched instance "${m.name}" to instance table entry ${l} by component (less precise)`
              );
              break;
            }
          }
      }
      if (!y) {
        await t.log(
          `  No matching entry found for instance "${m.name}" (main component: ${f.name}, ID: ${f.id.substring(0, 8)}...)`
        ), s++;
        continue;
      }
      if (!y.variantProperties) {
        await t.log(
          `  Instance table entry for "${m.name}" has no variant properties`
        ), s++;
        continue;
      }
      await t.log(
        `  Instance "${m.name}" matched to entry with variant properties: ${JSON.stringify(y.variantProperties)}`
      );
      let h = null;
      if (f.parent && f.parent.type === "COMPONENT_SET" && (h = f.parent.componentPropertyDefinitions), h) {
        const l = {};
        for (const [v, g] of Object.entries(
          y.variantProperties
        )) {
          const u = v.split("#")[0];
          h[u] && (l[u] = g);
        }
        Object.keys(l).length > 0 ? (m.setProperties(l), n++, await t.log(
          `  ✓ Set variant properties on instance "${m.name}": ${JSON.stringify(l)}`
        )) : s++;
      } else
        s++;
    } catch (f) {
      c++, await t.warning(
        `  Failed to set variant properties on instance "${m.name}": ${f}`
      );
    }
  await t.log(
    `  Variant properties set: ${n} processed, ${s} skipped, ${c} errors`
  );
}
async function ot(e) {
  await figma.loadAllPagesAsync();
  const a = figma.root.children, i = new Set(a.map((c) => c.name));
  if (!i.has(e))
    return e;
  let n = 1, s = `${e}_${n}`;
  for (; i.has(s); )
    n++, s = `${e}_${n}`;
  return s;
}
async function ha(e) {
  const a = await figma.variables.getLocalVariableCollectionsAsync(), i = new Set(a.map((c) => c.name));
  if (!i.has(e))
    return e;
  let n = 1, s = `${e}_${n}`;
  for (; i.has(s); )
    n++, s = `${e}_${n}`;
  return s;
}
async function ba(e, a) {
  const i = /* @__PURE__ */ new Set();
  for (const c of e.variableIds)
    try {
      const o = await figma.variables.getVariableByIdAsync(c);
      o && i.add(o.name);
    } catch (o) {
      continue;
    }
  if (!i.has(a))
    return a;
  let n = 1, s = `${a}_${n}`;
  for (; i.has(s); )
    n++, s = `${a}_${n}`;
  return s;
}
function ht(e, a) {
  const i = e.resolvedType.toUpperCase(), n = a.toUpperCase();
  return i === n;
}
async function ya(e) {
  const a = await figma.variables.getLocalVariableCollectionsAsync(), i = de(e.collectionName);
  if (ye(e.collectionName)) {
    for (const n of a)
      if (de(n.name) === i)
        return {
          collection: n,
          matchType: "potential"
        };
    return {
      collection: null,
      matchType: "none"
    };
  }
  if (e.collectionGuid) {
    for (const n of a)
      if (n.getSharedPluginData(
        "recursica",
        ue
      ) === e.collectionGuid)
        return {
          collection: n,
          matchType: "recognized"
        };
  }
  for (const n of a)
    if (n.name === e.collectionName)
      return {
        collection: n,
        matchType: "potential"
      };
  return {
    collection: null,
    matchType: "none"
  };
}
function wa(e) {
  if (!e.metadata)
    return {
      success: !1,
      error: "Invalid JSON format. Expected metadata."
    };
  const a = e.metadata;
  return !a.guid || typeof a.guid != "string" ? {
    success: !1,
    error: "Invalid metadata. Missing or invalid 'guid' field."
  } : !a.name || typeof a.name != "string" ? {
    success: !1,
    error: "Invalid metadata. Missing or invalid 'name' field."
  } : {
    success: !0,
    metadata: {
      guid: a.guid,
      name: a.name,
      version: a.version
    }
  };
}
function Qe(e) {
  if (!e.stringTable)
    return {
      success: !1,
      error: "Invalid JSON format. String table is required."
    };
  let a;
  try {
    a = Ge.fromTable(e.stringTable);
  } catch (n) {
    return {
      success: !1,
      error: `Failed to load string table: ${n instanceof Error ? n.message : "Unknown error"}`
    };
  }
  const i = sa(e, a);
  return {
    success: !0,
    stringTable: a,
    expandedJsonData: i
  };
}
function $a(e) {
  if (!e.collections)
    return {
      success: !1,
      error: "No collections table found in JSON"
    };
  try {
    return {
      success: !0,
      collectionTable: Oe.fromTable(
        e.collections
      )
    };
  } catch (a) {
    return {
      success: !1,
      error: `Failed to load collections table: ${a instanceof Error ? a.message : "Unknown error"}`
    };
  }
}
async function Sa(e, a) {
  const i = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), c = e.getTable();
  for (const [o, d] of Object.entries(c)) {
    if (d.isLocal === !1) {
      await t.log(
        `Skipping remote collection: "${d.collectionName}" (index ${o})`
      );
      continue;
    }
    const m = de(d.collectionName), f = a == null ? void 0 : a.get(m);
    if (f) {
      await t.log(
        `✓ Using pre-created collection: "${m}" (index ${o})`
      ), i.set(o, f);
      continue;
    }
    const p = await ya(d);
    p.matchType === "recognized" ? (await t.log(
      `✓ Recognized collection by GUID: "${d.collectionName}" (index ${o})`
    ), i.set(o, p.collection)) : p.matchType === "potential" ? (await t.log(
      `? Potential match by name: "${d.collectionName}" (index ${o})`
    ), n.set(o, {
      entry: d,
      collection: p.collection
    })) : (await t.log(
      `✗ No match found for collection: "${d.collectionName}" (index ${o}) - will create new`
    ), s.set(o, d));
  }
  return await t.log(
    `Collection matching complete: ${i.size} recognized, ${n.size} potential matches, ${s.size} to create`
  ), {
    recognizedCollections: i,
    potentialMatches: n,
    collectionsToCreate: s
  };
}
async function va(e, a, i, n) {
  if (e.size !== 0) {
    if (n) {
      await t.log(
        `Using wizard selections for ${e.size} potential match(es)...`
      );
      for (const [s, { entry: c, collection: o }] of e.entries()) {
        const d = de(
          c.collectionName
        ).toLowerCase();
        let m = !1;
        d === "tokens" || d === "token" ? m = n.tokens === "existing" : d === "theme" || d === "themes" ? m = n.theme === "existing" : (d === "layer" || d === "layers") && (m = n.layers === "existing");
        const f = ye(c.collectionName) ? de(c.collectionName) : o.name;
        m ? (await t.log(
          `✓ Wizard selection: Using existing collection "${f}" (index ${s})`
        ), a.set(s, o), await ve(o, c.modes), await t.log(
          `  ✓ Ensured modes for collection "${f}" (${c.modes.length} mode(s))`
        )) : (await t.log(
          `✗ Wizard selection: Will create new collection for "${c.collectionName}" (index ${s})`
        ), i.set(s, c));
      }
      return;
    }
    await t.log(
      `Prompting user for ${e.size} potential match(es)...`
    );
    for (const [s, { entry: c, collection: o }] of e.entries())
      try {
        const d = ye(c.collectionName) ? de(c.collectionName) : o.name, m = `Found existing "${d}" variable collection. Should I use it?`;
        await t.log(
          `Prompting user about potential match: "${d}"`
        ), await Ie.prompt(m, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await t.log(
          `✓ User confirmed: Using existing collection "${d}" (index ${s})`
        ), a.set(s, o), await ve(o, c.modes), await t.log(
          `  ✓ Ensured modes for collection "${d}" (${c.modes.length} mode(s))`
        );
      } catch (d) {
        await t.log(
          `✗ User rejected: Will create new collection for "${c.collectionName}" (index ${s})`
        ), i.set(s, c);
      }
  }
}
async function Na(e, a, i) {
  if (e.size === 0)
    return;
  await t.log("Ensuring modes exist for recognized collections...");
  const n = a.getTable();
  for (const [s, c] of e.entries()) {
    const o = n[s];
    o && (i.has(s) || (await ve(c, o.modes), await t.log(
      `  ✓ Ensured modes for collection "${c.name}" (${o.modes.length} mode(s))`
    )));
  }
}
async function Ea(e, a, i, n) {
  if (e.size !== 0) {
    await t.log(
      `Processing ${e.size} collection(s) to create...`
    );
    for (const [s, c] of e.entries()) {
      const o = de(c.collectionName), d = n == null ? void 0 : n.get(o);
      if (d) {
        await t.log(
          `Reusing pre-created collection: "${o}" (index ${s}, id: ${d.id.substring(0, 8)}...)`
        ), a.set(s, d), await ve(d, c.modes), i.push(d);
        continue;
      }
      const m = await ha(o);
      m !== o ? await t.log(
        `Creating collection: "${m}" (normalized: "${o}" - name conflict resolved)`
      ) : await t.log(`Creating collection: "${m}"`);
      const f = figma.variables.createVariableCollection(m);
      i.push(f);
      let p;
      if (ye(c.collectionName)) {
        const y = Ue(c.collectionName);
        y && (p = y);
      } else c.collectionGuid && (p = c.collectionGuid);
      p && (f.setSharedPluginData(
        "recursica",
        ue,
        p
      ), await t.log(
        `  Stored GUID: ${p.substring(0, 8)}...`
      )), await ve(f, c.modes), await t.log(
        `  ✓ Created collection "${m}" with ${c.modes.length} mode(s)`
      ), a.set(s, f);
    }
    await t.log("Collection creation complete");
  }
}
function Aa(e) {
  if (!e.variables)
    return {
      success: !1,
      error: "No variables table found in JSON"
    };
  try {
    return {
      success: !0,
      variableTable: Me.fromTable(e.variables)
    };
  } catch (a) {
    return {
      success: !1,
      error: `Failed to load variables table: ${a instanceof Error ? a.message : "Unknown error"}`
    };
  }
}
async function Ca(e, a, i, n) {
  const s = /* @__PURE__ */ new Map(), c = [], o = new Set(
    n.map((y) => y.id)
  );
  await t.log("Matching and creating variables in collections...");
  const d = e.getTable(), m = /* @__PURE__ */ new Map();
  for (const [y, r] of Object.entries(d)) {
    if (r._colRef === void 0)
      continue;
    const h = i.get(String(r._colRef));
    if (!h)
      continue;
    m.has(h.id) || m.set(h.id, {
      collectionName: h.name,
      existing: 0,
      created: 0
    });
    const l = m.get(h.id), v = o.has(
      h.id
    );
    let g;
    typeof r.variableType == "number" ? g = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[r.variableType] || String(r.variableType) : g = r.variableType;
    const u = await Ze(
      h,
      r.variableName
    );
    if (u)
      if (ht(u, g))
        s.set(y, u), l.existing++;
      else {
        await t.warning(
          `Type mismatch for variable "${r.variableName}" in collection "${h.name}": expected ${g}, found ${u.resolvedType}. Creating new variable with incremented name.`
        );
        const b = await ba(
          h,
          r.variableName
        ), R = await qe(
          ce(q({}, r), {
            variableName: b,
            variableType: g
          }),
          h,
          e,
          a
        );
        v || c.push(R), s.set(y, R), l.created++;
      }
    else {
      const b = await qe(
        ce(q({}, r), {
          variableType: g
        }),
        h,
        e,
        a
      );
      v || c.push(b), s.set(y, b), l.created++;
    }
  }
  await t.log("Variable processing complete:");
  for (const y of m.values())
    await t.log(
      `  "${y.collectionName}": ${y.existing} existing, ${y.created} created`
    );
  await t.log(
    "Final verification: Reading back all COLOR variables..."
  );
  let f = 0, p = 0;
  for (const y of c)
    if (y.resolvedType === "COLOR") {
      const r = await figma.variables.getVariableCollectionByIdAsync(
        y.variableCollectionId
      );
      if (!r) {
        await t.warning(
          `  ⚠️ Variable "${y.name}" has no variableCollection (ID: ${y.variableCollectionId})`
        );
        continue;
      }
      const h = r.modes;
      if (!h || h.length === 0) {
        await t.warning(
          `  ⚠️ Variable "${y.name}" collection has no modes`
        );
        continue;
      }
      for (const l of h) {
        const v = y.valuesByMode[l.modeId];
        if (v && typeof v == "object" && "r" in v) {
          const g = v;
          Math.abs(g.r - 1) < 0.01 && Math.abs(g.g - 1) < 0.01 && Math.abs(g.b - 1) < 0.01 ? (p++, await t.warning(
            `  ⚠️ Variable "${y.name}" mode "${l.name}" is WHITE: r=${g.r.toFixed(3)}, g=${g.g.toFixed(3)}, b=${g.b.toFixed(3)}`
          )) : (f++, await t.log(
            `  ✓ Variable "${y.name}" mode "${l.name}" has color: r=${g.r.toFixed(3)}, g=${g.g.toFixed(3)}, b=${g.b.toFixed(3)}`
          ));
        } else v && typeof v == "object" && "type" in v || await t.warning(
          `  ⚠️ Variable "${y.name}" mode "${l.name}" has unexpected value type: ${JSON.stringify(v)}`
        );
      }
    }
  return await t.log(
    `Final verification complete: ${f} color variables verified, ${p} white variables found`
  ), {
    recognizedVariables: s,
    newlyCreatedVariables: c
  };
}
function Ia(e) {
  if (!e.instances)
    return null;
  try {
    return xe.fromTable(e.instances);
  } catch (a) {
    return null;
  }
}
function Pa(e) {
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
function et(e) {
  if (!e || typeof e != "object")
    return;
  e.type !== void 0 && (e.type = Pa(e.type));
  const a = e.children !== void 0 ? "children" : e.child !== void 0 ? "child" : null;
  if (a && (a === "child" && !e.children && (e.children = e.child, delete e.child), Array.isArray(e.children)))
    for (const i of e.children)
      et(i);
  e.fillG !== void 0 && e.fillGeometry === void 0 && (e.fillGeometry = e.fillG, delete e.fillG), e.strkG !== void 0 && e.strokeGeometry === void 0 && (e.strokeGeometry = e.strkG, delete e.strkG), e.child && !e.children && (e.children = e.child, delete e.child);
}
async function Ta(e, a) {
  const i = /* @__PURE__ */ new Set();
  for (const c of e.children)
    (c.type === "FRAME" || c.type === "COMPONENT") && i.add(c.name);
  if (!i.has(a))
    return a;
  let n = 1, s = `${a}_${n}`;
  for (; i.has(s); )
    n++, s = `${a}_${n}`;
  return s;
}
async function Va(e, a, i, n, s, c = "") {
  var l;
  const o = e.getSerializedTable(), d = Object.values(o).filter(
    (v) => v.instanceType === "remote"
  ), m = /* @__PURE__ */ new Map();
  if (d.length === 0)
    return await t.log("No remote instances found"), m;
  await t.log(
    `Processing ${d.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  const f = figma.root.children, p = c ? `${c} REMOTES` : "REMOTES";
  let y = f.find(
    (v) => v.name === "REMOTES" || v.name === p
  );
  if (y ? (await t.log("Found existing REMOTES page"), c && !y.name.startsWith(c) && (y.name = p)) : (y = figma.createPage(), y.name = p, await t.log("Created REMOTES page")), d.length > 0 && (y.setPluginData("RecursicaUnderReview", "true"), await t.log("Marked REMOTES page as under review")), !y.children.some(
    (v) => v.type === "FRAME" && v.name === "Title"
  )) {
    const v = { family: "Inter", style: "Bold" }, g = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(v), await figma.loadFontAsync(g);
    const u = figma.createFrame();
    u.name = "Title", u.layoutMode = "VERTICAL", u.paddingTop = 20, u.paddingBottom = 20, u.paddingLeft = 20, u.paddingRight = 20, u.fills = [];
    const b = figma.createText();
    b.fontName = v, b.characters = "REMOTE INSTANCES", b.fontSize = 24, b.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], u.appendChild(b);
    const R = figma.createText();
    R.fontName = g, R.characters = "These are remotely connected component instances found in our different component pages.", R.fontSize = 14, R.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], u.appendChild(R), y.appendChild(u), await t.log("Created title and description on REMOTES page");
  }
  const h = /* @__PURE__ */ new Map();
  for (const [v, g] of Object.entries(o)) {
    if (g.instanceType !== "remote")
      continue;
    const u = parseInt(v, 10);
    if (await t.log(
      `Processing remote instance ${u}: "${g.componentName}"`
    ), !g.structure) {
      await t.warning(
        `Remote instance "${g.componentName}" missing structure data, skipping`
      );
      continue;
    }
    et(g.structure);
    const b = g.structure.children !== void 0, R = g.structure.child !== void 0, V = g.structure.children ? g.structure.children.length : g.structure.child ? g.structure.child.length : 0;
    await t.log(
      `  Structure type: ${g.structure.type || "unknown"}, has children: ${V} (children key: ${b}, child key: ${R})`
    );
    let G = g.componentName;
    if (g.path && g.path.length > 0) {
      const x = g.path.filter((C) => C !== "").join(" / ");
      x && (G = `${x} / ${g.componentName}`);
    }
    const T = await Ta(
      y,
      G
    );
    T !== G && await t.log(
      `Component name conflict: "${G}" -> "${T}"`
    );
    try {
      if (g.structure.type !== "COMPONENT") {
        await t.warning(
          `Remote instance "${g.componentName}" structure is not a COMPONENT (type: ${g.structure.type}), creating frame fallback`
        );
        const C = figma.createFrame();
        C.name = T;
        const k = await Pe(
          g.structure,
          C,
          a,
          i,
          null,
          n,
          h,
          !0,
          // isRemoteStructure: true
          null,
          // remoteComponentMap - not needed here
          null,
          // deferredInstances - not needed for remote instances
          null,
          // parentNodeData - not available for remote structures
          s
        );
        k ? (C.appendChild(k), y.appendChild(C), await t.log(
          `✓ Created remote instance frame fallback: "${T}"`
        )) : C.remove();
        continue;
      }
      const x = figma.createComponent();
      x.name = T, y.appendChild(x), await t.log(
        `  Created component node: "${T}"`
      );
      try {
        if (g.structure.componentPropertyDefinitions) {
          const $ = g.structure.componentPropertyDefinitions;
          let P = 0, U = 0;
          for (const [z, D] of Object.entries($))
            try {
              const W = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[D.type];
              if (!W) {
                await t.warning(
                  `  Unknown property type ${D.type} for property "${z}" in component "${g.componentName}"`
                ), U++;
                continue;
              }
              const Y = D.defaultValue, S = z.split("#")[0];
              x.addComponentProperty(
                S,
                W,
                Y
              ), P++;
            } catch (j) {
              await t.warning(
                `  Failed to add component property "${z}" to "${g.componentName}": ${j}`
              ), U++;
            }
          P > 0 && await t.log(
            `  Added ${P} component property definition(s) to "${g.componentName}"${U > 0 ? ` (${U} failed)` : ""}`
          );
        }
        g.structure.name !== void 0 && (x.name = g.structure.name);
        const C = g.structure.boundVariables && typeof g.structure.boundVariables == "object" && (g.structure.boundVariables.width || g.structure.boundVariables.height);
        g.structure.width !== void 0 && g.structure.height !== void 0 && !C && x.resize(g.structure.width, g.structure.height), g.structure.x !== void 0 && (x.x = g.structure.x), g.structure.y !== void 0 && (x.y = g.structure.y);
        const k = g.structure.boundVariables && typeof g.structure.boundVariables == "object";
        if (g.structure.visible !== void 0 && (x.visible = g.structure.visible), g.structure.opacity !== void 0 && (!k || !g.structure.boundVariables.opacity) && (x.opacity = g.structure.opacity), g.structure.rotation !== void 0 && (!k || !g.structure.boundVariables.rotation) && (x.rotation = g.structure.rotation), g.structure.blendMode !== void 0 && (!k || !g.structure.boundVariables.blendMode) && (x.blendMode = g.structure.blendMode), g.structure.fills !== void 0)
          try {
            let $ = g.structure.fills;
            Array.isArray($) && ($ = $.map((P) => {
              if (P && typeof P == "object") {
                const U = q({}, P);
                return delete U.boundVariables, U;
              }
              return P;
            })), x.fills = $, (l = g.structure.boundVariables) != null && l.fills && n && await pa(
              x,
              g.structure.boundVariables,
              "fills",
              n
            );
          } catch ($) {
            await t.warning(
              `Error setting fills for remote component "${g.componentName}": ${$}`
            );
          }
        if (g.structure.strokes !== void 0)
          try {
            x.strokes = g.structure.strokes;
          } catch ($) {
            await t.warning(
              `Error setting strokes for remote component "${g.componentName}": ${$}`
            );
          }
        const L = g.structure.boundVariables && typeof g.structure.boundVariables == "object" && (g.structure.boundVariables.strokeWeight || g.structure.boundVariables.strokeAlign);
        g.structure.strokeWeight !== void 0 && (!L || !g.structure.boundVariables.strokeWeight) && (x.strokeWeight = g.structure.strokeWeight), g.structure.strokeAlign !== void 0 && (!L || !g.structure.boundVariables.strokeAlign) && (x.strokeAlign = g.structure.strokeAlign), g.structure.layoutMode !== void 0 && (x.layoutMode = g.structure.layoutMode), g.structure.primaryAxisSizingMode !== void 0 && (x.primaryAxisSizingMode = g.structure.primaryAxisSizingMode), g.structure.counterAxisSizingMode !== void 0 && (x.counterAxisSizingMode = g.structure.counterAxisSizingMode);
        const B = g.structure.boundVariables && typeof g.structure.boundVariables == "object";
        g.structure.paddingLeft !== void 0 && (!B || !g.structure.boundVariables.paddingLeft) && (x.paddingLeft = g.structure.paddingLeft), g.structure.paddingRight !== void 0 && (!B || !g.structure.boundVariables.paddingRight) && (x.paddingRight = g.structure.paddingRight), g.structure.paddingTop !== void 0 && (!B || !g.structure.boundVariables.paddingTop) && (x.paddingTop = g.structure.paddingTop), g.structure.paddingBottom !== void 0 && (!B || !g.structure.boundVariables.paddingBottom) && (x.paddingBottom = g.structure.paddingBottom), g.structure.itemSpacing !== void 0 && (!B || !g.structure.boundVariables.itemSpacing) && (x.itemSpacing = g.structure.itemSpacing);
        const I = g.structure.boundVariables && typeof g.structure.boundVariables == "object" && (g.structure.boundVariables.cornerRadius || g.structure.boundVariables.topLeftRadius || g.structure.boundVariables.topRightRadius || g.structure.boundVariables.bottomLeftRadius || g.structure.boundVariables.bottomRightRadius);
        if (g.structure.cornerRadius !== void 0 && (!I || !g.structure.boundVariables.cornerRadius) && (x.cornerRadius = g.structure.cornerRadius), g.structure.boundVariables && n) {
          const $ = g.structure.boundVariables, P = [
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
          for (const U of P)
            if ($[U] && $e($[U])) {
              const z = $[U]._varRef;
              if (z !== void 0) {
                const D = n.get(String(z));
                if (D) {
                  const j = {
                    type: "VARIABLE_ALIAS",
                    id: D.id
                  };
                  x.boundVariables || (x.boundVariables = {}), x.boundVariables[U] = j;
                }
              }
            }
        }
        await t.log(
          `  DEBUG: Structure keys: ${Object.keys(g.structure).join(", ")}, has children: ${!!g.structure.children}, has child: ${!!g.structure.child}`
        );
        const _ = g.structure.children || (g.structure.child ? g.structure.child : null);
        if (await t.log(
          `  DEBUG: childrenArray exists: ${!!_}, isArray: ${Array.isArray(_)}, length: ${_ ? _.length : 0}`
        ), _ && Array.isArray(_) && _.length > 0) {
          await t.log(
            `  Recreating ${_.length} child(ren) for component "${g.componentName}"`
          );
          for (let $ = 0; $ < _.length; $++) {
            const P = _[$];
            if (await t.log(
              `  DEBUG: Processing child ${$ + 1}/${_.length}: ${JSON.stringify({ name: P == null ? void 0 : P.name, type: P == null ? void 0 : P.type, hasTruncated: !!(P != null && P._truncated) })}`
            ), P._truncated) {
              await t.log(
                `  Skipping truncated child: ${P._reason || "Unknown"}`
              );
              continue;
            }
            await t.log(
              `  Recreating child: "${P.name || "Unnamed"}" (type: ${P.type})`
            );
            const U = await Pe(
              P,
              x,
              a,
              i,
              null,
              n,
              h,
              !0,
              // isRemoteStructure: true
              null,
              // remoteComponentMap - not needed here
              null,
              // deferredInstances - not needed for remote instances
              g.structure,
              // parentNodeData - pass the component's structure so children can check for auto-layout
              s
            );
            U ? (x.appendChild(U), await t.log(
              `  ✓ Appended child "${P.name || "Unnamed"}" to component "${g.componentName}"`
            )) : await t.warning(
              `  ✗ Failed to create child "${P.name || "Unnamed"}" (type: ${P.type})`
            );
          }
        }
        m.set(u, x), await t.log(
          `✓ Created remote component: "${T}" (index ${u})`
        );
      } catch (C) {
        await t.warning(
          `Error populating remote component "${g.componentName}": ${C instanceof Error ? C.message : "Unknown error"}`
        ), x.remove();
      }
    } catch (x) {
      await t.warning(
        `Error recreating remote instance "${g.componentName}": ${x instanceof Error ? x.message : "Unknown error"}`
      );
    }
  }
  return await t.log(
    `Remote instance processing complete: ${m.size} component(s) created`
  ), m;
}
async function Oa(e, a, i, n, s, c, o = null, d = null, m = !1, f = null, p = !1, y = !1, r = "") {
  await t.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const h = figma.root.children, l = "RecursicaPublishedMetadata";
  let v = null;
  for (const k of h) {
    const L = k.getPluginData(l);
    if (L)
      try {
        if (JSON.parse(L).id === e.guid) {
          v = k;
          break;
        }
      } catch (B) {
        continue;
      }
  }
  let g = !1;
  if (v && !m && !p) {
    let k;
    try {
      const I = v.getPluginData(l);
      I && (k = JSON.parse(I).version);
    } catch (I) {
    }
    const L = k !== void 0 ? ` v${k}` : "", B = `Found existing component "${v.name}${L}". Should I use it or create a copy?`;
    await t.log(
      `Found existing page with same GUID: "${v.name}". Prompting user...`
    );
    try {
      await Ie.prompt(B, {
        okLabel: "Use",
        cancelLabel: "Copy",
        timeoutMs: 3e5
        // 5 minutes
      }), g = !0, await t.log(
        `User chose to use existing page: "${v.name}"`
      );
    } catch (I) {
      await t.log(
        "User chose to create a copy. Will create new page."
      );
    }
  }
  if (g && v)
    return await figma.setCurrentPageAsync(v), await t.log(
      `Using existing page: "${v.name}" (GUID: ${e.guid.substring(0, 8)}...)`
    ), await t.log(
      `  Instances from other pages will resolve to components on this existing page using componentPageName: "${v.name}"`
    ), {
      success: !0,
      page: v,
      // Include pageId so it can be tracked in importedPages
      pageId: v.id
    };
  const u = h.find((k) => k.name === e.name);
  u && await t.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let b;
  if (v || u) {
    const k = `__${e.name}`;
    b = await ot(k), await t.log(
      `Creating scratch page: "${b}" (will be renamed to "${e.name}" on success)`
    );
  } else
    b = e.name, await t.log(`Creating page: "${b}"`);
  const R = figma.createPage();
  if (R.name = b, await figma.setCurrentPageAsync(R), await t.log(`Switched to page: "${b}"`), !a.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await t.log("Recreating page structure...");
  const V = a.pageData;
  if (V.backgrounds !== void 0)
    try {
      R.backgrounds = V.backgrounds, await t.log(
        `Set page background: ${JSON.stringify(V.backgrounds)}`
      );
    } catch (k) {
      await t.warning(`Failed to set page background: ${k}`);
    }
  et(V);
  const G = /* @__PURE__ */ new Map(), T = (k, L = []) => {
    if (k.type === "COMPONENT" && k.id && L.push(k.id), k.children && Array.isArray(k.children))
      for (const B of k.children)
        B._truncated || T(B, L);
    return L;
  }, x = T(V);
  if (await t.log(
    `Found ${x.length} COMPONENT node(s) in page data`
  ), x.length > 0 && (await t.log(
    `Component IDs in page data (first 20): ${x.slice(0, 20).map((k) => k.substring(0, 8) + "...").join(", ")}`
  ), V._allComponentIds = x), V.children && Array.isArray(V.children))
    for (const k of V.children) {
      const L = await Pe(
        k,
        R,
        i,
        n,
        s,
        c,
        G,
        !1,
        // isRemoteStructure: false - we're creating the main page
        o,
        d,
        V,
        // parentNodeData - pass the page's nodeData so children can check for auto-layout
        f
      );
      L && R.appendChild(L);
    }
  await t.log("Page structure recreated successfully"), s && (await t.log(
    "Third pass: Setting variant properties on instances..."
  ), await ua(
    R,
    s,
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
  if (R.setPluginData(l, JSON.stringify(C)), await t.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), b.startsWith("__")) {
    let k;
    y ? k = r ? `${r} ${e.name}` : e.name : k = await ot(e.name), R.name = k, await t.log(`Renamed page from "${b}" to "${k}"`);
  } else y && r && (R.name.startsWith(r) || (R.name = `${r} ${R.name}`));
  return {
    success: !0,
    page: R,
    deferredInstances: d || void 0
  };
}
async function bt(e) {
  var n, s, c;
  e.clearConsole !== !1 && await t.clear(), await t.log("=== Starting Page Import ===");
  const i = [];
  try {
    const o = e.jsonData;
    if (!o)
      return await t.error("JSON data is required"), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "JSON data is required",
        data: {}
      };
    await t.log("Validating metadata...");
    const d = wa(o);
    if (!d.success)
      return await t.error(d.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: d.error,
        data: {}
      };
    const m = d.metadata;
    await t.log(
      `Metadata validated: guid=${m.guid}, name=${m.name}`
    ), await t.log("Loading string table...");
    const f = Qe(o);
    if (!f.success)
      return await t.error(f.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: f.error,
        data: {}
      };
    await t.log("String table loaded successfully"), await t.log("Expanding JSON data...");
    const p = f.expandedJsonData;
    await t.log("JSON expanded successfully"), await t.log("Loading collections table...");
    const y = $a(p);
    if (!y.success)
      return y.error === "No collections table found in JSON" ? (await t.log(y.error), await t.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: m.name }
      }) : (await t.error(y.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: y.error,
        data: {}
      });
    const r = y.collectionTable;
    await t.log(
      `Loaded collections table with ${r.getSize()} collection(s)`
    ), await t.log(
      "Matching collections with existing local collections..."
    );
    const { recognizedCollections: h, potentialMatches: l, collectionsToCreate: v } = await Sa(r, e.preCreatedCollections);
    await va(
      l,
      h,
      v,
      e.collectionChoices
    ), await Na(
      h,
      r,
      l
    ), await Ea(
      v,
      h,
      i,
      e.preCreatedCollections
    ), await t.log("Loading variables table...");
    const g = Aa(p);
    if (!g.success)
      return g.error === "No variables table found in JSON" ? (await t.log(g.error), await t.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no variables to process)",
        data: { pageName: m.name }
      }) : (await t.error(g.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: g.error,
        data: {}
      });
    const u = g.variableTable;
    await t.log(
      `Loaded variables table with ${u.getSize()} variable(s)`
    );
    const { recognizedVariables: b, newlyCreatedVariables: R } = await Ca(
      u,
      r,
      h,
      i
    );
    await t.log("Loading instance table...");
    const V = Ia(p);
    if (V) {
      const z = V.getSerializedTable(), D = Object.values(z).filter(
        (W) => W.instanceType === "internal"
      ), j = Object.values(z).filter(
        (W) => W.instanceType === "remote"
      );
      await t.log(
        `Loaded instance table with ${V.getSize()} instance(s) (${D.length} internal, ${j.length} remote)`
      );
    } else
      await t.log("No instance table found in JSON");
    const G = [], T = (n = e.isMainPage) != null ? n : !0, x = (s = e.alwaysCreateCopy) != null ? s : !1, C = (c = e.skipUniqueNaming) != null ? c : !1, k = e.constructionIcon || "";
    let L = null;
    V && (L = await Va(
      V,
      u,
      r,
      b,
      h,
      k
    ));
    const B = await Oa(
      m,
      p,
      u,
      r,
      V,
      b,
      L,
      G,
      T,
      h,
      x,
      C,
      k
    );
    if (!B.success)
      return await t.error(B.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: B.error,
        data: {}
      };
    const I = B.page, _ = b.size + R.length, $ = B.deferredInstances || G, P = ($ == null ? void 0 : $.length) || 0;
    if (await t.log("=== Import Complete ==="), await t.log(
      `Successfully processed ${h.size} collection(s), ${_} variable(s), and created page "${I.name}"${P > 0 ? ` (${P} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`
    ), P > 0) {
      await t.log(
        `  [DEBUG] Returning ${P} deferred instance(s) in response`
      );
      for (const z of $)
        await t.log(
          `    - "${z.nodeData.name}" from page "${z.instanceEntry.componentPageName}"`
        );
    }
    const U = B.pageId || I.id;
    return {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: {
        pageName: I.name,
        pageId: U,
        // Include pageId for tracking (used for both new and reused pages)
        deferredInstances: P > 0 ? $ : void 0,
        createdEntities: {
          pageIds: [I.id],
          collectionIds: i.map((z) => z.id),
          variableIds: R.map((z) => z.id)
        }
      }
    };
  } catch (o) {
    const d = o instanceof Error ? o.message : "Unknown error occurred";
    return await t.error(`Import failed: ${d}`), o instanceof Error && o.stack && await t.error(`Stack trace: ${o.stack}`), console.error("Error importing page:", o), {
      type: "importPage",
      success: !1,
      error: !0,
      message: d,
      data: {}
    };
  }
}
async function yt(e, a = "") {
  if (e.length === 0)
    return { resolved: 0, failed: 0, errors: [] };
  await t.log(
    `=== Resolving ${e.length} deferred normal instance(s) ===`
  );
  let i = 0, n = 0;
  const s = [];
  await figma.loadAllPagesAsync();
  for (const c of e)
    try {
      const { placeholderFrameId: o, instanceEntry: d, nodeData: m, parentNodeId: f } = c, p = await figma.getNodeByIdAsync(
        o
      ), y = await figma.getNodeByIdAsync(
        f
      );
      if (!p || !y) {
        const u = `Deferred instance "${m.name}" - could not find placeholder frame (${o}) or parent node (${f})`;
        await t.error(u), s.push(u), n++;
        continue;
      }
      let r = figma.root.children.find((u) => {
        const b = u.name === d.componentPageName, R = a && u.name === `${a} ${d.componentPageName}`;
        return b || R;
      });
      if (!r) {
        const u = oe(
          d.componentPageName
        );
        r = figma.root.children.find((b) => oe(b.name) === u);
      }
      if (!r && a) {
        const u = figma.root.children.map((b) => b.name).slice(0, 10);
        await t.log(
          `  [DEBUG] Looking for page "${d.componentPageName}" (or "${a} ${d.componentPageName}"). Available pages (first 10): ${u.join(", ")}`
        );
      }
      if (!r) {
        const u = a ? `"${d.componentPageName}" or "${a} ${d.componentPageName}"` : `"${d.componentPageName}"`, b = `Deferred instance "${m.name}" still cannot find referenced page (tried: ${u}, and clean name matching)`;
        await t.error(b), s.push(b), n++;
        continue;
      }
      const h = (u, b, R, V, G) => {
        if (b.length === 0) {
          let k = null;
          const L = oe(R);
          for (const B of u.children || [])
            if (B.type === "COMPONENT") {
              const I = B.name === R, _ = oe(B.name) === L;
              if (I || _) {
                if (k || (k = B), I && V)
                  try {
                    const $ = B.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if ($ && JSON.parse($).id === V)
                      return B;
                  } catch ($) {
                  }
                else if (I)
                  return B;
              }
            } else if (B.type === "COMPONENT_SET") {
              if (G) {
                const I = B.name === G, _ = oe(B.name) === oe(G);
                if (!I && !_)
                  continue;
              }
              for (const I of B.children || [])
                if (I.type === "COMPONENT") {
                  const _ = I.name === R, $ = oe(I.name) === L;
                  if (_ || $) {
                    if (k || (k = I), _ && V)
                      try {
                        const P = I.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (P && JSON.parse(P).id === V)
                          return I;
                      } catch (P) {
                      }
                    else if (_)
                      return I;
                  }
                }
            }
          return k;
        }
        const [T, ...x] = b, C = oe(T);
        for (const k of u.children || []) {
          const L = k.name === T, B = oe(k.name) === C;
          if (L || B) {
            if (x.length === 0) {
              if (k.type === "COMPONENT_SET") {
                if (G) {
                  const $ = k.name === G, P = oe(k.name) === oe(G);
                  if (!$ && !P)
                    continue;
                }
                const I = oe(R);
                let _ = null;
                for (const $ of k.children || [])
                  if ($.type === "COMPONENT") {
                    const P = $.name === R, U = oe($.name) === I;
                    if (P || U) {
                      if (_ || (_ = $), V)
                        try {
                          const z = $.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (z && JSON.parse(z).id === V)
                            return $;
                        } catch (z) {
                        }
                      if (P)
                        return $;
                    }
                  }
                return _ || null;
              }
              return null;
            }
            return x.length > 0 ? h(
              k,
              x,
              R,
              V,
              G
            ) : null;
          }
        }
        return null;
      };
      await t.log(
        `  [DEBUG] Searching for component "${d.componentName}" on page "${r.name}"`
      ), d.path && d.path.length > 0 ? await t.log(
        `  [DEBUG] Component path: [${d.path.join(" → ")}]`
      ) : await t.log("  [DEBUG] Component is at page root"), d.componentSetName && await t.log(
        `  [DEBUG] Component set name: "${d.componentSetName}"`
      ), d.componentGuid && await t.log(
        `  [DEBUG] Component GUID: ${d.componentGuid.substring(0, 8)}...`
      );
      const l = r.children.slice(0, 10).map((u) => `${u.type}: "${u.name}"${u.type === "COMPONENT_SET" ? ` (${u.children.length} variants)` : ""}`);
      await t.log(
        `  [DEBUG] Top-level nodes on page "${r.name}" (first 10): ${l.join(", ")}`
      );
      let v = h(
        r,
        d.path || [],
        d.componentName,
        d.componentGuid,
        d.componentSetName
      );
      if (!v && d.componentSetName) {
        await t.log(
          `  [DEBUG] Path-based search failed, trying recursive search for COMPONENT_SET "${d.componentSetName}"`
        );
        const u = (b, R = 0) => {
          if (R > 5) return null;
          for (const V of b.children || []) {
            if (V.type === "COMPONENT_SET") {
              const G = V.name === d.componentSetName, T = oe(V.name) === oe(d.componentSetName || "");
              if (G || T) {
                const x = oe(
                  d.componentName
                );
                for (const C of V.children || [])
                  if (C.type === "COMPONENT") {
                    const k = C.name === d.componentName, L = oe(C.name) === x;
                    if (k || L) {
                      if (d.componentGuid)
                        try {
                          const B = C.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (B && JSON.parse(B).id === d.componentGuid)
                            return C;
                        } catch (B) {
                        }
                      return C;
                    }
                  }
              }
            }
            if (V.type === "FRAME" || V.type === "GROUP") {
              const G = u(V, R + 1);
              if (G) return G;
            }
          }
          return null;
        };
        v = u(r), v && await t.log(
          `  [DEBUG] Found component via recursive search: "${v.name}"`
        );
      }
      if (!v) {
        const u = d.path && d.path.length > 0 ? ` at path [${d.path.join(" → ")}]` : " at page root", b = [], R = (G, T = 0) => {
          if (!(T > 3) && ((G.type === "COMPONENT" || G.type === "COMPONENT_SET") && b.push(
            `${G.type}: "${G.name}"${G.type === "COMPONENT_SET" ? ` (${G.children.length} variants)` : ""}`
          ), G.children && Array.isArray(G.children)))
            for (const x of G.children.slice(0, 10))
              R(x, T + 1);
        };
        R(r), await t.log(
          `  [DEBUG] Available components on page "${r.name}" (first 20): ${b.slice(0, 20).join(", ")}`
        );
        const V = `Deferred instance "${m.name}" still cannot find component "${d.componentName}" on page "${d.componentPageName}"${u}`;
        await t.error(V), s.push(V), n++;
        continue;
      }
      const g = v.createInstance();
      if (g.name = m.name || p.name.replace("[Deferred: ", "").replace("]", ""), g.x = p.x, g.y = p.y, p.width !== void 0 && p.height !== void 0 && g.resize(p.width, p.height), d.variantProperties && Object.keys(d.variantProperties).length > 0)
        try {
          const u = await g.getMainComponentAsync();
          if (u) {
            let b = null;
            const R = u.type;
            if (R === "COMPONENT_SET" ? b = u.componentPropertyDefinitions : R === "COMPONENT" && u.parent && u.parent.type === "COMPONENT_SET" ? b = u.parent.componentPropertyDefinitions : await t.warning(
              `Cannot set variant properties for resolved instance "${m.name}" - main component is not a COMPONENT_SET or variant`
            ), b) {
              const V = {};
              for (const [G, T] of Object.entries(
                d.variantProperties
              )) {
                const x = G.split("#")[0];
                b[x] && (V[x] = T);
              }
              Object.keys(V).length > 0 && g.setProperties(V);
            }
          }
        } catch (u) {
          await t.warning(
            `Failed to set variant properties for resolved instance "${m.name}": ${u}`
          );
        }
      if (d.componentProperties && Object.keys(d.componentProperties).length > 0)
        try {
          const u = await g.getMainComponentAsync();
          if (u) {
            let b = null;
            const R = u.type;
            if (R === "COMPONENT_SET" ? b = u.componentPropertyDefinitions : R === "COMPONENT" && u.parent && u.parent.type === "COMPONENT_SET" ? b = u.parent.componentPropertyDefinitions : R === "COMPONENT" && (b = u.componentPropertyDefinitions), b)
              for (const [V, G] of Object.entries(
                d.componentProperties
              )) {
                const T = V.split("#")[0];
                if (b[T])
                  try {
                    g.setProperties({
                      [T]: G
                    });
                  } catch (x) {
                    await t.warning(
                      `Failed to set component property "${T}" for resolved instance "${m.name}": ${x}`
                    );
                  }
              }
          }
        } catch (u) {
          await t.warning(
            `Failed to set component properties for resolved instance "${m.name}": ${u}`
          );
        }
      if ("children" in y && "insertChild" in y) {
        const u = y.children.indexOf(p);
        y.insertChild(u, g), p.remove();
      } else {
        const u = `Parent node does not support children operations for deferred instance "${m.name}"`;
        await t.error(u), s.push(u);
        continue;
      }
      await t.log(
        `  ✓ Resolved deferred instance "${m.name}" from component "${d.componentName}" on page "${d.componentPageName}"`
      ), i++;
    } catch (o) {
      const d = o instanceof Error ? o.message : String(o), m = `Failed to resolve deferred instance "${c.nodeData.name}": ${d}`;
      await t.error(m), s.push(m), n++;
    }
  return await t.log(
    `=== Deferred Resolution Complete: ${i} resolved, ${n} failed ===`
  ), { resolved: i, failed: n, errors: s };
}
async function Ma(e) {
  await t.log("=== Cleaning up created entities ===");
  try {
    const { pageIds: a, collectionIds: i, variableIds: n } = e;
    let s = 0;
    for (const d of n)
      try {
        const m = await figma.variables.getVariableByIdAsync(d);
        if (m) {
          const f = m.variableCollectionId;
          i.includes(f) || (m.remove(), s++);
        }
      } catch (m) {
        await t.warning(
          `Could not delete variable ${d.substring(0, 8)}...: ${m}`
        );
      }
    let c = 0;
    for (const d of i)
      try {
        const m = await figma.variables.getVariableCollectionByIdAsync(d);
        m && (m.remove(), c++);
      } catch (m) {
        await t.warning(
          `Could not delete collection ${d.substring(0, 8)}...: ${m}`
        );
      }
    await figma.loadAllPagesAsync();
    let o = 0;
    for (const d of a)
      try {
        const m = await figma.getNodeByIdAsync(d);
        m && m.type === "PAGE" && (m.remove(), o++);
      } catch (m) {
        await t.warning(
          `Could not delete page ${d.substring(0, 8)}...: ${m}`
        );
      }
    return await t.log(
      `Cleanup complete: Deleted ${o} page(s), ${c} collection(s), ${s} variable(s)`
    ), {
      type: "cleanupCreatedEntities",
      success: !0,
      error: !1,
      message: "Cleanup completed successfully",
      data: {
        deletedPages: o,
        deletedCollections: c,
        deletedVariables: s
      }
    };
  } catch (a) {
    const i = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Cleanup failed: ${i}`), {
      type: "cleanupCreatedEntities",
      success: !1,
      error: !0,
      message: i,
      data: {}
    };
  }
}
async function wt(e) {
  const a = [];
  for (const { fileName: i, jsonData: n } of e)
    try {
      const s = Qe(n);
      if (!s.success || !s.expandedJsonData) {
        await t.warning(
          `Skipping ${i} - failed to expand JSON: ${s.error || "Unknown error"}`
        );
        continue;
      }
      const c = s.expandedJsonData, o = c.metadata;
      if (!o || !o.name || !o.guid) {
        await t.warning(
          `Skipping ${i} - missing or invalid metadata`
        );
        continue;
      }
      const d = [];
      if (c.instances) {
        const f = xe.fromTable(
          c.instances
        ).getSerializedTable();
        for (const p of Object.values(f))
          p.instanceType === "normal" && p.componentPageName && (d.includes(p.componentPageName) || d.push(p.componentPageName));
      }
      a.push({
        fileName: i,
        pageName: o.name,
        pageGuid: o.guid,
        dependencies: d,
        jsonData: n
        // Store original JSON data for import
      }), await t.log(
        `  ${i}: "${o.name}" depends on: ${d.length > 0 ? d.join(", ") : "none"}`
      );
    } catch (s) {
      await t.error(
        `Error processing ${i}: ${s instanceof Error ? s.message : String(s)}`
      );
    }
  return a;
}
function $t(e) {
  const a = [], i = [], n = [], s = /* @__PURE__ */ new Map();
  for (const f of e)
    s.set(f.pageName, f);
  const c = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), d = [], m = (f) => {
    if (c.has(f.pageName))
      return !1;
    if (o.has(f.pageName)) {
      const p = d.findIndex(
        (y) => y.pageName === f.pageName
      );
      if (p !== -1) {
        const y = d.slice(p).concat([f]);
        return i.push(y), !0;
      }
      return !1;
    }
    o.add(f.pageName), d.push(f);
    for (const p of f.dependencies) {
      const y = s.get(p);
      y && m(y);
    }
    return o.delete(f.pageName), d.pop(), c.add(f.pageName), a.push(f), !1;
  };
  for (const f of e)
    c.has(f.pageName) || m(f);
  for (const f of e)
    for (const p of f.dependencies)
      s.has(p) || n.push(
        `Page "${f.pageName}" (${f.fileName}) depends on "${p}" which is not in the import set`
      );
  return { order: a, cycles: i, errors: n };
}
async function St(e) {
  await t.log("=== Building Dependency Graph ===");
  const a = await wt(e);
  await t.log("=== Resolving Import Order ===");
  const i = $t(a);
  if (i.cycles.length > 0) {
    await t.log(
      `Detected ${i.cycles.length} circular dependency cycle(s):`
    );
    for (const n of i.cycles) {
      const s = n.map((c) => `"${c.pageName}"`).join(" → ");
      await t.log(`  Cycle: ${s} → (back to start)`);
    }
    await t.log(
      "  Circular dependencies will be handled with deferred instance resolution"
    );
  }
  if (i.errors.length > 0) {
    await t.warning(
      `Found ${i.errors.length} missing dependency warning(s):`
    );
    for (const n of i.errors)
      await t.warning(`  ${n}`);
  }
  await t.log(
    `Import order determined: ${i.order.length} page(s)`
  );
  for (let n = 0; n < i.order.length; n++) {
    const s = i.order[n];
    await t.log(`  ${n + 1}. ${s.fileName} ("${s.pageName}")`);
  }
  return i;
}
async function vt(e) {
  var b, R, V, G, T, x;
  const { jsonFiles: a } = e;
  if (!a || !Array.isArray(a))
    return {
      type: "importPagesInOrder",
      success: !1,
      error: !0,
      message: "jsonFiles must be an array",
      data: {}
    };
  await t.log("=== Determining Import Order ===");
  const {
    order: i,
    cycles: n,
    errors: s
  } = await St(a);
  s.length > 0 && await t.warning(
    `Found ${s.length} dependency warning(s) - some dependencies may be missing`
  ), n.length > 0 && await t.log(
    `Detected ${n.length} circular dependency cycle(s) - will use deferred resolution`
  );
  const c = /* @__PURE__ */ new Map();
  if (await t.log(
    `Checking collectionChoices: ${e.collectionChoices ? "exists" : "undefined"}`
  ), e.collectionChoices) {
    await t.log("=== Pre-creating Collections ==="), await t.log(
      `Collection choices: tokens=${e.collectionChoices.tokens}, theme=${e.collectionChoices.theme}, layers=${e.collectionChoices.layers}`
    );
    const C = "recursica:collectionId", k = async (B) => {
      const I = await figma.variables.getLocalVariableCollectionsAsync(), _ = new Set(I.map((U) => U.name));
      if (!_.has(B))
        return B;
      let $ = 1, P = `${B}_${$}`;
      for (; _.has(P); )
        $++, P = `${B}_${$}`;
      return P;
    }, L = [
      { choice: e.collectionChoices.tokens, normalizedName: "Tokens" },
      { choice: e.collectionChoices.theme, normalizedName: "Theme" },
      { choice: e.collectionChoices.layers, normalizedName: "Layer" }
    ];
    for (const { choice: B, normalizedName: I } of L)
      if (B === "new") {
        await t.log(
          `Processing collection type: "${I}" (choice: "new") - will create new collection`
        );
        const _ = await k(I), $ = figma.variables.createVariableCollection(_);
        if (ye(I)) {
          const P = Ue(I);
          P && ($.setSharedPluginData(
            "recursica",
            C,
            P
          ), await t.log(
            `  Stored fixed GUID: ${P.substring(0, 8)}...`
          ));
        }
        c.set(I, $), await t.log(
          `✓ Pre-created collection: "${_}" (normalized: "${I}", id: ${$.id.substring(0, 8)}...)`
        );
      } else
        await t.log(
          `Skipping collection type: "${I}" (choice: "existing")`
        );
    c.size > 0 && await t.log(
      `Pre-created ${c.size} collection(s) for reuse across all imports`
    );
  }
  await t.log("=== Importing Pages in Order ===");
  let o = 0, d = 0;
  const m = [...s], f = [], p = {
    pageIds: [],
    collectionIds: [],
    variableIds: []
  }, y = [];
  if (c.size > 0)
    for (const C of c.values())
      p.collectionIds.push(C.id), await t.log(
        `Tracking pre-created collection: "${C.name}" (${C.id.substring(0, 8)}...)`
      );
  const r = e.mainFileName;
  for (let C = 0; C < i.length; C++) {
    const k = i[C], L = r ? k.fileName === r : C === i.length - 1;
    await t.log(
      `[${C + 1}/${i.length}] Importing ${k.fileName} ("${k.pageName}")${L ? " [MAIN]" : " [DEPENDENCY]"}...`
    );
    try {
      const B = C === 0, I = await bt({
        jsonData: k.jsonData,
        isMainPage: L,
        clearConsole: B,
        collectionChoices: e.collectionChoices,
        alwaysCreateCopy: !0,
        // Wizard imports always create copies (no prompts)
        skipUniqueNaming: (b = e.skipUniqueNaming) != null ? b : !1,
        constructionIcon: e.constructionIcon || "",
        preCreatedCollections: c
        // Pass pre-created collections for reuse
      });
      if (I.success) {
        if (o++, (R = I.data) != null && R.deferredInstances) {
          const _ = I.data.deferredInstances;
          Array.isArray(_) && (await t.log(
            `  [DEBUG] Collected ${_.length} deferred instance(s) from ${k.fileName}`
          ), f.push(..._));
        } else
          await t.log(
            `  [DEBUG] No deferred instances in response for ${k.fileName}`
          );
        if ((V = I.data) != null && V.createdEntities) {
          const _ = I.data.createdEntities;
          _.pageIds && p.pageIds.push(..._.pageIds), _.collectionIds && p.collectionIds.push(..._.collectionIds), _.variableIds && p.variableIds.push(..._.variableIds);
          const $ = ((G = _.pageIds) == null ? void 0 : G[0]) || ((T = I.data) == null ? void 0 : T.pageId);
          (x = I.data) != null && x.pageName && $ && y.push({
            name: I.data.pageName,
            pageId: $
          });
        }
      } else
        d++, m.push(
          `Failed to import ${k.fileName}: ${I.message || "Unknown error"}`
        );
    } catch (B) {
      d++;
      const I = B instanceof Error ? B.message : String(B);
      m.push(`Failed to import ${k.fileName}: ${I}`);
    }
  }
  if (f.length > 0) {
    await t.log(
      `=== Resolving ${f.length} Deferred Instance(s) ===`
    );
    try {
      const C = await yt(
        f,
        e.constructionIcon || ""
      );
      await t.log(
        `  Resolved: ${C.resolved}, Failed: ${C.failed}`
      ), C.errors.length > 0 && m.push(...C.errors);
    } catch (C) {
      m.push(
        `Failed to resolve deferred instances: ${C instanceof Error ? C.message : String(C)}`
      );
    }
  }
  const h = Array.from(
    new Set(p.collectionIds)
  ), l = Array.from(
    new Set(p.variableIds)
  ), v = Array.from(new Set(p.pageIds));
  if (await t.log("=== Import Summary ==="), await t.log(
    `  Imported: ${o}, Failed: ${d}, Deferred instances: ${f.length}`
  ), await t.log(
    `  Collections in allCreatedEntityIds: ${p.collectionIds.length}, Unique: ${h.length}`
  ), h.length > 0) {
    await t.log(
      `  Created ${h.length} collection(s)`
    );
    for (const C of h)
      try {
        const k = await figma.variables.getVariableCollectionByIdAsync(C);
        k && await t.log(
          `    - "${k.name}" (${C.substring(0, 8)}...)`
        );
      } catch (k) {
      }
  }
  const g = d === 0, u = g ? `Successfully imported ${o} page(s)${f.length > 0 ? ` (${f.length} deferred instance(s) resolved)` : ""}` : `Import completed with ${d} failure(s). ${m.join("; ")}`;
  return {
    type: "importPagesInOrder",
    success: g,
    error: !g,
    message: u,
    data: {
      imported: o,
      failed: d,
      deferred: f.length,
      errors: m,
      importedPages: y,
      createdEntities: {
        pageIds: v,
        collectionIds: h,
        variableIds: l
      }
    }
  };
}
async function xa(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children;
    console.log("Found " + a.length + " pages in the document");
    const i = 11, n = a[i];
    if (!n)
      return {
        type: "quickCopy",
        success: !1,
        error: !0,
        message: "No page found at index 11",
        data: {}
      };
    const s = await ze(
      n,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + n.name + " (index: " + i + ")"
    );
    const c = JSON.stringify(s, null, 2), o = JSON.parse(c), d = "Copy - " + o.name, m = figma.createPage();
    if (m.name = d, figma.root.appendChild(m), o.children && o.children.length > 0) {
      let y = function(h) {
        h.forEach((l) => {
          const v = (l.x || 0) + (l.width || 0);
          v > r && (r = v), l.children && l.children.length > 0 && y(l.children);
        });
      };
      console.log(
        "Recreating " + o.children.length + " top-level children..."
      );
      let r = 0;
      y(o.children), console.log("Original content rightmost edge: " + r);
      for (const h of o.children)
        await Pe(h, m, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const f = _e(o);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: o.name,
        newPageName: d,
        totalNodes: f
      }
    };
  } catch (a) {
    return console.error("Error performing quick copy:", a), {
      type: "quickCopy",
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Ra(e) {
  try {
    const a = e.accessToken, i = e.selectedRepo;
    return a ? (await figma.clientStorage.setAsync("accessToken", a), i && await figma.clientStorage.setAsync("selectedRepo", i), e.hasWriteAccess !== void 0 && await figma.clientStorage.setAsync("hasWriteAccess", e.hasWriteAccess), {
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
  } catch (a) {
    return {
      type: "storeAuthData",
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function ka(e) {
  try {
    const a = await figma.clientStorage.getAsync("accessToken"), i = await figma.clientStorage.getAsync("selectedRepo"), n = await figma.clientStorage.getAsync("hasWriteAccess");
    return {
      type: "loadAuthData",
      success: !0,
      error: !1,
      message: "Auth data loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        accessToken: a || void 0,
        selectedRepo: i || void 0,
        hasWriteAccess: n != null ? n : void 0
      }
    };
  } catch (a) {
    return {
      type: "loadAuthData",
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function La(e) {
  try {
    return await figma.clientStorage.deleteAsync("accessToken"), await figma.clientStorage.deleteAsync("selectedRepo"), await figma.clientStorage.deleteAsync("hasWriteAccess"), {
      type: "clearAuthData",
      success: !0,
      error: !1,
      message: "Auth data cleared successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    };
  } catch (a) {
    return {
      type: "clearAuthData",
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Ba(e) {
  try {
    return await figma.clientStorage.setAsync("importData", e.importData), {
      type: "storeImportData",
      success: !0,
      error: !1,
      message: "Import data stored successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    };
  } catch (a) {
    return {
      type: "storeImportData",
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Fa(e) {
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
  } catch (a) {
    return {
      type: "loadImportData",
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Ua(e) {
  try {
    return await figma.clientStorage.deleteAsync("importData"), {
      type: "clearImportData",
      success: !0,
      error: !1,
      message: "Import data cleared successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    };
  } catch (a) {
    return {
      type: "clearImportData",
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Ga(e) {
  try {
    const a = e.selectedRepo;
    return a ? (await figma.clientStorage.setAsync("selectedRepo", a), {
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
  } catch (a) {
    return {
      type: "storeSelectedRepo",
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {}
    };
  }
}
function se(e, a = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: a
  };
}
function pe(e, a, i = {}) {
  const n = a instanceof Error ? a.message : a;
  return {
    type: e,
    success: !1,
    error: !0,
    message: n,
    data: i
  };
}
const Nt = "RecursicaPublishedMetadata";
async function _a(e) {
  try {
    const a = figma.currentPage;
    await figma.loadAllPagesAsync();
    const n = figma.root.children.findIndex(
      (d) => d.id === a.id
    ), s = a.getPluginData(Nt);
    if (!s) {
      const f = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: Fe(a.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: n
      };
      return se("getComponentMetadata", f);
    }
    const o = {
      componentMetadata: JSON.parse(s),
      currentPageIndex: n
    };
    return se("getComponentMetadata", o);
  } catch (a) {
    return console.error("Error getting component metadata:", a), pe(
      "getComponentMetadata",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function za(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children, i = [];
    for (const s of a) {
      if (s.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${s.name} (type: ${s.type})`
        );
        continue;
      }
      const c = s, o = c.getPluginData(Nt);
      if (o)
        try {
          const d = JSON.parse(o);
          i.push(d);
        } catch (d) {
          console.warn(
            `Failed to parse metadata for page "${c.name}":`,
            d
          );
          const f = {
            _ver: 1,
            id: "",
            name: Fe(c.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          i.push(f);
        }
      else {
        const m = {
          _ver: 1,
          id: "",
          name: Fe(c.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        i.push(m);
      }
    }
    return se("getAllComponents", {
      components: i
    });
  } catch (a) {
    return console.error("Error getting all components:", a), pe(
      "getAllComponents",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function ja(e) {
  try {
    const a = e.requestId, i = e.action;
    return !a || !i ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (Ie.handleResponse({ requestId: a, action: i }), {
      type: "pluginPromptResponse",
      success: !0,
      error: !1,
      message: "Prompt response handled successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    });
  } catch (a) {
    return {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Da(e) {
  try {
    const { pageId: a } = e;
    await figma.loadAllPagesAsync();
    const i = await figma.getNodeByIdAsync(a);
    return !i || i.type !== "PAGE" ? {
      type: "switchToPage",
      success: !1,
      error: !0,
      message: `Page with ID ${a.substring(0, 8)}... not found`,
      data: {}
    } : (await figma.setCurrentPageAsync(i), {
      type: "switchToPage",
      success: !0,
      error: !1,
      message: `Switched to page "${i.name}"`,
      data: {
        pageName: i.name
      }
    });
  } catch (a) {
    return {
      type: "switchToPage",
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {}
    };
  }
}
const le = "RecursicaPrimaryImport", ae = "RecursicaUnderReview", Et = "---", At = "---", me = "RecursicaImportDivider", Ee = "start", Ae = "end", be = "⚠️";
async function Ja(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children;
    for (const n of a) {
      if (n.type !== "PAGE")
        continue;
      const s = n.getPluginData(le);
      if (s)
        try {
          const o = JSON.parse(s), d = {
            exists: !0,
            pageId: n.id,
            metadata: o
          };
          return se(
            "checkForExistingPrimaryImport",
            d
          );
        } catch (o) {
          await t.warning(
            `Failed to parse primary import metadata on page "${n.name}": ${o}`
          );
          continue;
        }
      if (n.getPluginData(ae) === "true") {
        const o = n.getPluginData(le);
        if (o)
          try {
            const d = JSON.parse(o), m = {
              exists: !0,
              pageId: n.id,
              metadata: d
            };
            return se(
              "checkForExistingPrimaryImport",
              m
            );
          } catch (d) {
          }
        else
          await t.warning(
            `Found page "${n.name}" marked as under review but missing primary import metadata`
          );
      }
    }
    return se("checkForExistingPrimaryImport", {
      exists: !1
    });
  } catch (a) {
    return console.error("Error checking for existing primary import:", a), pe(
      "checkForExistingPrimaryImport",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function Ha(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children.find(
      (d) => d.type === "PAGE" && d.getPluginData(me) === Ee
    ), i = figma.root.children.find(
      (d) => d.type === "PAGE" && d.getPluginData(me) === Ae
    );
    if (a && i) {
      const d = {
        startDividerId: a.id,
        endDividerId: i.id
      };
      return se("createImportDividers", d);
    }
    const n = figma.createPage();
    n.name = Et, n.setPluginData(me, Ee), n.setPluginData(ae, "true");
    const s = figma.createPage();
    s.name = At, s.setPluginData(me, Ae), s.setPluginData(ae, "true");
    const c = figma.root.children.indexOf(n);
    figma.root.insertChild(c + 1, s), await t.log("Created import dividers");
    const o = {
      startDividerId: n.id,
      endDividerId: s.id
    };
    return se("createImportDividers", o);
  } catch (a) {
    return console.error("Error creating import dividers:", a), pe(
      "createImportDividers",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function Wa(e) {
  var a, i, n, s, c, o, d;
  try {
    await t.log("=== Starting Single Component Import ==="), await t.log("Creating start divider..."), await figma.loadAllPagesAsync();
    let m = figma.root.children.find(
      ($) => $.type === "PAGE" && $.getPluginData(me) === Ee
    );
    m || (m = figma.createPage(), m.name = Et, m.setPluginData(me, Ee), m.setPluginData(ae, "true"), await t.log("Created start divider"));
    const p = [
      ...e.dependencies.filter(
        ($) => !$.useExisting
      ).map(($) => ({
        fileName: `${$.name}.json`,
        jsonData: $.jsonData
      })),
      {
        fileName: `${e.mainComponent.name}.json`,
        jsonData: e.mainComponent.jsonData
      }
    ];
    await t.log(
      `Importing ${p.length} file(s) in dependency order...`
    );
    const y = await vt({
      jsonFiles: p,
      mainFileName: `${e.mainComponent.name}.json`,
      collectionChoices: {
        tokens: e.wizardSelections.tokensCollection,
        theme: e.wizardSelections.themeCollection,
        layers: e.wizardSelections.layersCollection
      },
      skipUniqueNaming: !0,
      // Don't add _<number> suffix for wizard imports
      constructionIcon: be
      // Add construction icon to page names
    });
    if (!y.success)
      throw new Error(
        y.message || "Failed to import pages in order"
      );
    await figma.loadAllPagesAsync();
    const r = figma.root.children;
    let h = r.find(
      ($) => $.type === "PAGE" && $.getPluginData(me) === Ae
    );
    if (!h) {
      h = figma.createPage(), h.name = At, h.setPluginData(
        me,
        Ae
      ), h.setPluginData(ae, "true");
      let $ = r.length;
      for (let P = r.length - 1; P >= 0; P--) {
        const U = r[P];
        if (U.type === "PAGE" && U.getPluginData(me) !== Ee && U.getPluginData(me) !== Ae) {
          $ = P + 1;
          break;
        }
      }
      figma.root.insertChild($, h), await t.log("Created end divider");
    }
    await t.log(
      `Import result data structure: ${JSON.stringify(Object.keys(y.data || {}))}`
    );
    const l = y.data;
    if (await t.log(
      `Import result has createdEntities: ${!!(l != null && l.createdEntities)}`
    ), l != null && l.createdEntities && (await t.log(
      `  Collection IDs: ${((a = l.createdEntities.collectionIds) == null ? void 0 : a.length) || 0}`
    ), await t.log(
      `  Variable IDs: ${((i = l.createdEntities.variableIds) == null ? void 0 : i.length) || 0}`
    ), await t.log(
      `  Page IDs: ${((n = l.createdEntities.pageIds) == null ? void 0 : n.length) || 0}`
    )), !(l != null && l.importedPages) || l.importedPages.length === 0)
      throw new Error("No pages were imported");
    const v = "RecursicaPublishedMetadata", g = e.mainComponent.guid;
    await t.log(
      `Looking for main page by GUID: ${g.substring(0, 8)}...`
    );
    let u, b = null;
    for (const $ of l.importedPages)
      try {
        const P = await figma.getNodeByIdAsync(
          $.pageId
        );
        if (P && P.type === "PAGE") {
          const U = P.getPluginData(v);
          if (U)
            try {
              if (JSON.parse(U).id === g) {
                u = $.pageId, b = P, await t.log(
                  `Found main page by GUID: "${P.name}" (ID: ${$.pageId.substring(0, 12)}...)`
                );
                break;
              }
            } catch (z) {
            }
        }
      } catch (P) {
        await t.warning(
          `Error checking page ${$.pageId}: ${P}`
        );
      }
    if (!u) {
      await t.log(
        "Main page not found in importedPages list, searching all pages by GUID..."
      ), await figma.loadAllPagesAsync();
      const $ = figma.root.children;
      for (const P of $)
        if (P.type === "PAGE") {
          const U = P.getPluginData(v);
          if (U)
            try {
              if (JSON.parse(U).id === g) {
                u = P.id, b = P, await t.log(
                  `Found main page by GUID in all pages: "${P.name}" (ID: ${P.id.substring(0, 12)}...)`
                );
                break;
              }
            } catch (z) {
            }
        }
    }
    if (!u || !b) {
      await t.error(
        `Failed to find imported main page by GUID: ${g.substring(0, 8)}...`
      ), await t.log("Imported pages were:");
      for (const $ of l.importedPages)
        await t.log(
          `  - "${$.name}" (ID: ${$.pageId.substring(0, 12)}...)`
        );
      throw new Error("Failed to find imported main page ID");
    }
    if (!b || b.type !== "PAGE")
      throw new Error("Failed to get main page node");
    for (const $ of l.importedPages)
      try {
        const P = await figma.getNodeByIdAsync(
          $.pageId
        );
        if (P && P.type === "PAGE") {
          P.setPluginData(ae, "true");
          const U = P.name.replace(/_\d+$/, "");
          if (!U.startsWith(be))
            P.name = `${be} ${U}`;
          else {
            const z = U.replace(be, "").trim();
            P.name = `${be} ${z}`;
          }
        }
      } catch (P) {
        await t.warning(
          `Failed to mark page ${$.pageId} as under review: ${P}`
        );
      }
    await figma.loadAllPagesAsync();
    const R = figma.root.children, V = R.find(
      ($) => $.type === "PAGE" && ($.name === "REMOTES" || $.name === `${be} REMOTES`)
    );
    V && (V.setPluginData(ae, "true"), V.name.startsWith(be) || (V.name = `${be} REMOTES`), await t.log(
      "Marked REMOTES page as under review and ensured construction icon"
    ));
    const G = R.find(
      ($) => $.type === "PAGE" && $.getPluginData(me) === Ee
    ), T = R.find(
      ($) => $.type === "PAGE" && $.getPluginData(me) === Ae
    );
    if (G && T) {
      const $ = R.indexOf(G), P = R.indexOf(T);
      for (let U = $ + 1; U < P; U++) {
        const z = R[U];
        z.type === "PAGE" && z.getPluginData(ae) !== "true" && (z.setPluginData(ae, "true"), await t.log(
          `Marked page "${z.name}" as under review (found between dividers)`
        ));
      }
    }
    const x = [], C = [];
    if (await t.log(
      `[EXTRACTION] Starting collection extraction. Collection IDs in result: ${((c = (s = l == null ? void 0 : l.createdEntities) == null ? void 0 : s.collectionIds) == null ? void 0 : c.length) || 0}`
    ), (o = l == null ? void 0 : l.createdEntities) != null && o.collectionIds) {
      await t.log(
        `[EXTRACTION] Collection IDs to process: ${l.createdEntities.collectionIds.map(($) => $.substring(0, 8) + "...").join(", ")}`
      );
      for (const $ of l.createdEntities.collectionIds)
        try {
          const P = await figma.variables.getVariableCollectionByIdAsync($);
          P ? (x.push({
            collectionId: P.id,
            collectionName: P.name
          }), await t.log(
            `[EXTRACTION] ✓ Extracted collection: "${P.name}" (${$.substring(0, 8)}...)`
          )) : await t.warning(
            `[EXTRACTION] Collection ${$.substring(0, 8)}... not found`
          );
        } catch (P) {
          await t.warning(
            `[EXTRACTION] Failed to get collection ${$.substring(0, 8)}...: ${P}`
          );
        }
    } else
      await t.warning(
        "[EXTRACTION] No collectionIds found in importResultData.createdEntities"
      );
    await t.log(
      `[EXTRACTION] Total collections extracted: ${x.length}`
    ), x.length > 0 && await t.log(
      `[EXTRACTION] Extracted collections: ${x.map(($) => `"${$.collectionName}" (${$.collectionId.substring(0, 8)}...)`).join(", ")}`
    );
    const k = new Set(
      x.map(($) => $.collectionId)
    );
    if ((d = l == null ? void 0 : l.createdEntities) != null && d.variableIds)
      for (const $ of l.createdEntities.variableIds)
        try {
          const P = await figma.variables.getVariableByIdAsync($);
          if (P && P.resolvedType && !k.has(P.variableCollectionId)) {
            const U = await figma.variables.getVariableCollectionByIdAsync(
              P.variableCollectionId
            );
            U && C.push({
              variableId: P.id,
              variableName: P.name,
              collectionId: P.variableCollectionId,
              collectionName: U.name
            });
          }
        } catch (P) {
          await t.warning(
            `Failed to get variable ${$}: ${P}`
          );
        }
    const L = {
      componentGuid: e.mainComponent.guid,
      componentVersion: e.mainComponent.version,
      componentName: e.mainComponent.name,
      importDate: (/* @__PURE__ */ new Date()).toISOString(),
      wizardSelections: e.wizardSelections,
      variableSummary: e.variableSummary,
      createdCollections: x,
      createdVariables: C,
      importError: void 0
      // No error yet
    };
    await t.log(
      `Storing metadata with ${x.length} collection(s) and ${C.length} variable(s)`
    ), b.setPluginData(
      le,
      JSON.stringify(L)
    ), b.setPluginData(ae, "true"), await t.log(
      "Stored primary import metadata on main page and marked as under review"
    );
    const B = [];
    l.importedPages && B.push(
      ...l.importedPages.map(($) => $.pageId)
    ), await t.log("=== Single Component Import Complete ==="), L.importError = void 0, await t.log(
      `[METADATA] About to store metadata with ${x.length} collection(s) and ${C.length} variable(s)`
    ), x.length > 0 && await t.log(
      `[METADATA] Collections to store: ${x.map(($) => `"${$.collectionName}" (${$.collectionId.substring(0, 8)}...)`).join(", ")}`
    ), b.setPluginData(
      le,
      JSON.stringify(L)
    ), await t.log(
      `[METADATA] Stored metadata: ${x.length} collection(s), ${C.length} variable(s)`
    );
    const I = b.getPluginData(le);
    if (I)
      try {
        const $ = JSON.parse(I);
        await t.log(
          `[METADATA] Verification: Stored metadata has ${$.createdCollections.length} collection(s) and ${$.createdVariables.length} variable(s)`
        );
      } catch ($) {
        await t.warning(
          "[METADATA] Failed to verify stored metadata"
        );
      }
    const _ = {
      success: !0,
      mainPageId: b.id,
      importedPageIds: B,
      createdCollections: x,
      createdVariables: C
    };
    return se("importSingleComponentWithWizard", _);
  } catch (m) {
    const f = m instanceof Error ? m.message : "Unknown error occurred";
    await t.error(`Import failed: ${f}`);
    try {
      await figma.loadAllPagesAsync();
      const p = figma.root.children;
      let y = null;
      for (const r of p) {
        if (r.type !== "PAGE") continue;
        const h = r.getPluginData(le);
        if (h)
          try {
            if (JSON.parse(h).componentGuid === e.mainComponent.guid) {
              y = r;
              break;
            }
          } catch (l) {
          }
      }
      if (y) {
        const r = y.getPluginData(le);
        if (r)
          try {
            const h = JSON.parse(r);
            await t.log(
              `[CATCH] Found existing metadata with ${h.createdCollections.length} collection(s) and ${h.createdVariables.length} variable(s)`
            ), h.importError = f, y.setPluginData(
              le,
              JSON.stringify(h)
            ), await t.log(
              `[CATCH] Updated existing metadata with error. Collections: ${h.createdCollections.length}, Variables: ${h.createdVariables.length}`
            );
          } catch (h) {
            await t.warning(
              `[CATCH] Failed to update metadata: ${h}`
            );
          }
      } else {
        await t.log(
          "No existing metadata found, attempting to collect created entities for cleanup..."
        );
        const r = [];
        for (const v of p) {
          if (v.type !== "PAGE") continue;
          v.getPluginData(ae) === "true" && r.push(v);
        }
        const h = [];
        if (e.wizardSelections) {
          const v = await figma.variables.getLocalVariableCollectionsAsync(), g = [
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
          for (const { choice: u, normalizedName: b } of g)
            if (u === "new") {
              const R = v.filter((V) => de(V.name) === b);
              if (R.length > 0) {
                const V = R[0];
                h.push({
                  collectionId: V.id,
                  collectionName: V.name
                }), await t.log(
                  `Found created collection: "${V.name}" (${V.id.substring(0, 8)}...)`
                );
              }
            }
        }
        const l = [];
        if (r.length > 0) {
          const v = r[0], g = {
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
            createdCollections: h,
            createdVariables: l,
            importError: f
          };
          v.setPluginData(
            le,
            JSON.stringify(g)
          ), await t.log(
            `Created fallback metadata with ${h.length} collection(s) and error information`
          );
        }
      }
    } catch (p) {
      await t.warning(
        `Failed to store error metadata: ${p instanceof Error ? p.message : String(p)}`
      );
    }
    return pe(
      "importSingleComponentWithWizard",
      m instanceof Error ? m : new Error(String(m))
    );
  }
}
async function Ct(e) {
  try {
    await t.log("=== Starting Import Group Deletion ==="), await figma.loadAllPagesAsync();
    const a = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!a || a.type !== "PAGE")
      throw new Error("Main page not found");
    const i = a.getPluginData(le);
    if (!i)
      throw new Error("Primary import metadata not found on page");
    const n = JSON.parse(i);
    await t.log(
      `Found metadata: ${n.createdCollections.length} collection(s), ${n.createdVariables.length} variable(s) to delete`
    ), await figma.loadAllPagesAsync();
    const s = figma.root.children, c = [];
    for (const r of s) {
      if (r.type !== "PAGE")
        continue;
      r.getPluginData(ae) === "true" && (c.push(r), await t.log(
        `Found page to delete: "${r.name}" (under review)`
      ));
    }
    await t.log(
      `Deleting ${n.createdVariables.length} variable(s) from existing collections...`
    );
    let o = 0;
    for (const r of n.createdVariables)
      try {
        const h = await figma.variables.getVariableByIdAsync(
          r.variableId
        );
        h ? (h.remove(), o++, await t.log(
          `Deleted variable: ${r.variableName} from collection ${r.collectionName}`
        )) : await t.warning(
          `Variable ${r.variableName} (${r.variableId}) not found - may have already been deleted`
        );
      } catch (h) {
        await t.warning(
          `Failed to delete variable ${r.variableName}: ${h instanceof Error ? h.message : String(h)}`
        );
      }
    await t.log(
      `Deleting ${n.createdCollections.length} collection(s)...`
    );
    let d = 0;
    for (const r of n.createdCollections)
      try {
        const h = await figma.variables.getVariableCollectionByIdAsync(
          r.collectionId
        );
        h ? (h.remove(), d++, await t.log(
          `Deleted collection: ${r.collectionName} (${r.collectionId})`
        )) : await t.warning(
          `Collection ${r.collectionName} (${r.collectionId}) not found - may have already been deleted`
        );
      } catch (h) {
        await t.warning(
          `Failed to delete collection ${r.collectionName}: ${h instanceof Error ? h.message : String(h)}`
        );
      }
    const m = c.map((r) => ({
      page: r,
      name: r.name,
      id: r.id
    })), f = figma.currentPage;
    if (m.some(
      (r) => r.id === f.id
    )) {
      await figma.loadAllPagesAsync();
      const h = figma.root.children.find(
        (l) => l.type === "PAGE" && !m.some((v) => v.id === l.id)
      );
      h ? (await figma.setCurrentPageAsync(h), await t.log(
        `Switched away from page "${f.name}" before deletion`
      )) : await t.warning(
        "No safe page to switch to - all pages are being deleted"
      );
    }
    for (const { page: r, name: h } of m)
      try {
        let l = !1;
        try {
          await figma.loadAllPagesAsync(), l = figma.root.children.some((g) => g.id === r.id);
        } catch (v) {
          l = !1;
        }
        if (!l) {
          await t.log(`Page "${h}" already deleted, skipping`);
          continue;
        }
        if (figma.currentPage.id === r.id) {
          await figma.loadAllPagesAsync();
          const g = figma.root.children.find(
            (u) => u.type === "PAGE" && u.id !== r.id && !m.some((b) => b.id === u.id)
          );
          g && await figma.setCurrentPageAsync(g);
        }
        r.remove(), await t.log(`Deleted page: "${h}"`);
      } catch (l) {
        await t.warning(
          `Failed to delete page "${h}": ${l instanceof Error ? l.message : String(l)}`
        );
      }
    await t.log("=== Import Group Deletion Complete ===");
    const y = {
      success: !0,
      deletedPages: c.length,
      deletedCollections: d,
      deletedVariables: o
    };
    return se("deleteImportGroup", y);
  } catch (a) {
    const i = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Delete failed: ${i}`), pe(
      "deleteImportGroup",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function Ka(e) {
  try {
    await t.log("=== Cleaning up failed import ==="), await figma.loadAllPagesAsync();
    const a = figma.root.children;
    let i = null;
    for (const m of a) {
      if (m.type !== "PAGE")
        continue;
      if (m.getPluginData(le)) {
        i = m;
        break;
      }
    }
    if (i)
      return await t.log(
        "Found page with metadata, using deleteImportGroup"
      ), await Ct({ pageId: i.id });
    await t.log(
      "No metadata found, deleting pages with UNDER_REVIEW_KEY"
    );
    const n = [];
    for (const m of a) {
      if (m.type !== "PAGE")
        continue;
      m.getPluginData(ae) === "true" && n.push({ id: m.id, name: m.name });
    }
    const s = figma.currentPage;
    if (n.some(
      (m) => m.id === s.id
    )) {
      await figma.loadAllPagesAsync();
      const f = figma.root.children.find(
        (p) => p.type === "PAGE" && !n.some((y) => y.id === p.id)
      );
      f && (await figma.setCurrentPageAsync(f), await t.log(
        `Switched away from page "${s.name}" before deletion`
      ));
    }
    let o = 0;
    for (const m of n)
      try {
        await figma.loadAllPagesAsync();
        const f = await figma.getNodeByIdAsync(
          m.id
        );
        if (!f || f.type !== "PAGE")
          continue;
        if (figma.currentPage.id === f.id) {
          await figma.loadAllPagesAsync();
          const y = figma.root.children.find(
            (r) => r.type === "PAGE" && r.id !== f.id && !n.some((h) => h.id === r.id)
          );
          y && await figma.setCurrentPageAsync(y);
        }
        f.remove(), o++, await t.log(`Deleted page: "${m.name}"`);
      } catch (f) {
        await t.warning(
          `Failed to delete page "${m.name}" (${m.id.substring(0, 8)}...): ${f instanceof Error ? f.message : String(f)}`
        );
      }
    return await t.log("=== Failed Import Cleanup Complete ==="), se("cleanupFailedImport", {
      success: !0,
      deletedPages: o,
      deletedCollections: 0,
      // Can't clean up without metadata
      deletedVariables: 0
      // Can't clean up without metadata
    });
  } catch (a) {
    const i = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Cleanup failed: ${i}`), pe(
      "cleanupFailedImport",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function qa(e) {
  try {
    await t.log("=== Clearing Import Metadata ==="), await figma.loadAllPagesAsync();
    const a = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!a || a.type !== "PAGE")
      throw new Error("Page not found");
    a.setPluginData(le, ""), a.setPluginData(ae, "");
    const i = figma.root.children;
    for (const s of i)
      if (s.type === "PAGE" && s.getPluginData(ae) === "true") {
        const o = s.getPluginData(le);
        if (o)
          try {
            JSON.parse(o), s.setPluginData(ae, "");
          } catch (d) {
            s.setPluginData(ae, "");
          }
        else
          s.setPluginData(ae, "");
      }
    return await t.log(
      "Cleared import metadata from page and related pages"
    ), se("clearImportMetadata", {
      success: !0
    });
  } catch (a) {
    const i = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Clear metadata failed: ${i}`), pe(
      "clearImportMetadata",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function Xa(e) {
  try {
    await t.log("=== Summarizing Variables for Wizard ===");
    const a = [];
    for (const { fileName: h, jsonData: l } of e.jsonFiles)
      try {
        const v = Qe(l);
        if (!v.success || !v.expandedJsonData) {
          await t.warning(
            `Skipping ${h} - failed to expand JSON: ${v.error || "Unknown error"}`
          );
          continue;
        }
        const g = v.expandedJsonData;
        if (!g.collections)
          continue;
        const b = Oe.fromTable(
          g.collections
        );
        if (!g.variables)
          continue;
        const V = Me.fromTable(g.variables).getTable();
        for (const G of Object.values(V)) {
          if (G._colRef === void 0)
            continue;
          const T = b.getCollectionByIndex(
            G._colRef
          );
          if (T) {
            const C = de(
              T.collectionName
            ).toLowerCase();
            (C === "tokens" || C === "theme" || C === "layer") && a.push({
              name: G.variableName,
              collectionName: C
              // Use lowercase for consistency ("layer" not "layers")
            });
          }
        }
      } catch (v) {
        await t.warning(
          `Error processing ${h}: ${v instanceof Error ? v.message : String(v)}`
        );
        continue;
      }
    const i = await figma.variables.getLocalVariableCollectionsAsync();
    let n = null, s = null, c = null;
    for (const h of i) {
      const v = de(h.name).toLowerCase();
      (v === "tokens" || v === "token") && !n ? n = h : (v === "theme" || v === "themes") && !s ? s = h : (v === "layer" || v === "layers") && !c && (c = h);
    }
    const o = a.filter(
      (h) => h.collectionName === "tokens"
    ), d = a.filter((h) => h.collectionName === "theme"), m = a.filter((h) => h.collectionName === "layer"), f = {
      existing: 0,
      new: 0
    }, p = {
      existing: 0,
      new: 0
    }, y = {
      existing: 0,
      new: 0
    };
    if (e.tokensCollection === "existing" && n) {
      const h = /* @__PURE__ */ new Set();
      for (const l of n.variableIds)
        try {
          const v = figma.variables.getVariableById(l);
          v && h.add(v.name);
        } catch (v) {
          continue;
        }
      for (const l of o)
        h.has(l.name) ? f.existing++ : f.new++;
    } else
      f.new = o.length;
    if (e.themeCollection === "existing" && s) {
      const h = /* @__PURE__ */ new Set();
      for (const l of s.variableIds)
        try {
          const v = figma.variables.getVariableById(l);
          v && h.add(v.name);
        } catch (v) {
          continue;
        }
      for (const l of d)
        h.has(l.name) ? p.existing++ : p.new++;
    } else
      p.new = d.length;
    if (e.layersCollection === "existing" && c) {
      const h = /* @__PURE__ */ new Set();
      for (const l of c.variableIds)
        try {
          const v = figma.variables.getVariableById(l);
          v && h.add(v.name);
        } catch (v) {
          continue;
        }
      for (const l of m)
        h.has(l.name) ? y.existing++ : y.new++;
    } else
      y.new = m.length;
    return await t.log(
      `Variable summary: Tokens - ${f.existing} existing, ${f.new} new; Theme - ${p.existing} existing, ${p.new} new; Layers - ${y.existing} existing, ${y.new} new`
    ), se("summarizeVariablesForWizard", {
      tokens: f,
      theme: p,
      layers: y
    });
  } catch (a) {
    const i = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Summarize failed: ${i}`), pe(
      "summarizeVariablesForWizard",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function Ya(e) {
  try {
    const a = "recursica:collectionId", n = {
      collections: (await figma.variables.getLocalVariableCollectionsAsync()).map((s) => {
        const c = s.getSharedPluginData("recursica", a);
        return {
          id: s.id,
          name: s.name,
          guid: c || void 0
        };
      })
    };
    return se(
      "getLocalVariableCollections",
      n
    );
  } catch (a) {
    return pe(
      "getLocalVariableCollections",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function Za(e) {
  try {
    const a = "recursica:collectionId", i = [];
    for (const s of e.collectionIds)
      try {
        const c = await figma.variables.getVariableCollectionByIdAsync(s);
        if (c) {
          const o = c.getSharedPluginData(
            "recursica",
            a
          );
          i.push({
            collectionId: s,
            guid: o || null
          });
        } else
          i.push({
            collectionId: s,
            guid: null
          });
      } catch (c) {
        await t.warning(
          `Failed to get GUID for collection ${s}: ${c instanceof Error ? c.message : String(c)}`
        ), i.push({
          collectionId: s,
          guid: null
        });
      }
    return se(
      "getCollectionGuids",
      {
        collectionGuids: i
      }
    );
  } catch (a) {
    return pe(
      "getCollectionGuids",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function Qa(e) {
  try {
    await t.log("=== Starting Import Group Merge ==="), await figma.loadAllPagesAsync();
    const a = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!a || a.type !== "PAGE")
      throw new Error("Main page not found");
    const i = a.getPluginData(le);
    if (!i)
      throw new Error("Primary import metadata not found on page");
    const n = JSON.parse(i);
    await t.log(
      `Found metadata for component: ${n.componentName} (Version: ${n.componentVersion})`
    );
    let s = 0, c = 0;
    const o = "recursica:collectionId";
    for (const g of e.collectionChoices)
      if (g.choice === "merge")
        try {
          const u = await figma.variables.getVariableCollectionByIdAsync(
            g.newCollectionId
          );
          if (!u) {
            await t.warning(
              `New collection ${g.newCollectionId} not found, skipping merge`
            );
            continue;
          }
          let b = null;
          if (g.existingCollectionId)
            b = await figma.variables.getVariableCollectionByIdAsync(
              g.existingCollectionId
            );
          else {
            const C = u.getSharedPluginData(
              "recursica",
              o
            );
            if (C) {
              const k = await figma.variables.getLocalVariableCollectionsAsync();
              for (const L of k)
                if (L.getSharedPluginData(
                  "recursica",
                  o
                ) === C && L.id !== g.newCollectionId) {
                  b = L;
                  break;
                }
              if (!b && (C === we.LAYER || C === we.TOKENS || C === we.THEME)) {
                let L;
                C === we.LAYER ? L = he.LAYER : C === we.TOKENS ? L = he.TOKENS : L = he.THEME;
                for (const B of k)
                  if (B.getSharedPluginData(
                    "recursica",
                    o
                  ) === C && B.name === L && B.id !== g.newCollectionId) {
                    b = B;
                    break;
                  }
                b || (b = figma.variables.createVariableCollection(L), b.setSharedPluginData(
                  "recursica",
                  o,
                  C
                ), await t.log(
                  `Created new standard collection: "${L}"`
                ));
              }
            }
          }
          if (!b) {
            await t.warning(
              "Could not find or create existing collection for merge, skipping"
            );
            continue;
          }
          await t.log(
            `Merging collection "${u.name}" (${g.newCollectionId.substring(0, 8)}...) into "${b.name}" (${b.id.substring(0, 8)}...)`
          );
          const R = u.variableIds.map(
            (C) => figma.variables.getVariableByIdAsync(C)
          ), V = await Promise.all(R), G = b.variableIds.map(
            (C) => figma.variables.getVariableByIdAsync(C)
          ), T = await Promise.all(G), x = new Set(
            T.filter((C) => C !== null).map((C) => C.name)
          );
          for (const C of V)
            if (C)
              try {
                if (x.has(C.name)) {
                  await t.warning(
                    `Variable "${C.name}" already exists in collection "${b.name}", skipping`
                  );
                  continue;
                }
                const k = figma.variables.createVariable(
                  C.name,
                  b,
                  C.resolvedType
                );
                for (const L of b.modes) {
                  const B = L.modeId;
                  let I = C.valuesByMode[B];
                  if (I === void 0 && u.modes.length > 0) {
                    const _ = u.modes[0].modeId;
                    I = C.valuesByMode[_];
                  }
                  I !== void 0 && k.setValueForMode(B, I);
                }
                await t.log(
                  `  ✓ Copied variable "${C.name}" to collection "${b.name}"`
                );
              } catch (k) {
                await t.warning(
                  `Failed to copy variable "${C.name}": ${k instanceof Error ? k.message : String(k)}`
                );
              }
          u.remove(), s++, await t.log(
            `✓ Merged and deleted collection: ${u.name}`
          );
        } catch (u) {
          await t.warning(
            `Failed to merge collection: ${u instanceof Error ? u.message : String(u)}`
          );
        }
      else
        c++, await t.log(`Kept collection: ${g.newCollectionId}`);
    await t.log("Removing dividers...");
    const d = figma.root.children, m = [];
    for (const g of d) {
      if (g.type !== "PAGE") continue;
      const u = g.getPluginData(me);
      (u === "start" || u === "end") && m.push(g);
    }
    const f = figma.currentPage;
    if (m.some((g) => g.id === f.id))
      if (a && a.id !== f.id)
        figma.currentPage = a;
      else {
        const g = d.find(
          (u) => u.type === "PAGE" && !m.some((b) => b.id === u.id)
        );
        g && (figma.currentPage = g);
      }
    const p = m.map((g) => g.name);
    for (const g of m)
      try {
        g.remove();
      } catch (u) {
        await t.warning(
          `Failed to delete divider: ${u instanceof Error ? u.message : String(u)}`
        );
      }
    for (const g of p)
      await t.log(`Deleted divider: ${g}`);
    await t.log("Removing construction icons and renaming pages..."), await figma.loadAllPagesAsync();
    const y = figma.root.children;
    let r = 0;
    const h = "RecursicaPublishedMetadata", l = [];
    for (const g of y)
      if (g.type === "PAGE")
        try {
          if (g.getPluginData(ae) === "true") {
            const b = g.getPluginData(h);
            let R = {};
            if (b)
              try {
                R = JSON.parse(b);
              } catch (V) {
              }
            l.push({
              pageId: g.id,
              pageName: g.name,
              pageMetadata: R
            });
          }
        } catch (u) {
          await t.warning(
            `Failed to process page: ${u instanceof Error ? u.message : String(u)}`
          );
        }
    for (const g of l)
      try {
        const u = await figma.getNodeByIdAsync(
          g.pageId
        );
        if (!u || u.type !== "PAGE") {
          await t.warning(
            `Page ${g.pageId} not found, skipping rename`
          );
          continue;
        }
        let b = u.name;
        if (b.startsWith(be) && (b = b.substring(be.length).trim()), b === "REMOTES" || b.includes("REMOTES")) {
          u.name = "REMOTES", r++, await t.log(`Renamed page: "${u.name}" -> "REMOTES"`);
          continue;
        }
        const V = g.pageMetadata.name && g.pageMetadata.name.length > 0 && !g.pageMetadata.name.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        ) ? g.pageMetadata.name : n.componentName || b, G = g.pageMetadata.version !== void 0 ? g.pageMetadata.version : n.componentVersion, T = `${V} (VERSION: ${G})`;
        u.name = T, r++, await t.log(`Renamed page: "${b}" -> "${T}"`);
      } catch (u) {
        await t.warning(
          `Failed to rename page ${g.pageId}: ${u instanceof Error ? u.message : String(u)}`
        );
      }
    if (await t.log("Clearing import metadata..."), a)
      try {
        a.setPluginData(le, "");
      } catch (g) {
        await t.warning(
          `Failed to clear primary import metadata: ${g instanceof Error ? g.message : String(g)}`
        );
      }
    for (const g of l)
      try {
        const u = await figma.getNodeByIdAsync(
          g.pageId
        );
        u && u.type === "PAGE" && u.setPluginData(ae, "");
      } catch (u) {
        await t.warning(
          `Failed to clear under review metadata for page ${g.pageId}: ${u instanceof Error ? u.message : String(u)}`
        );
      }
    const v = {
      mergedCollections: s,
      keptCollections: c,
      pagesRenamed: r
    };
    return await t.log(
      `=== Merge Complete ===
  Merged: ${s} collection(s)
  Kept: ${c} collection(s)
  Renamed: ${r} page(s)`
    ), se(
      "mergeImportGroup",
      v
    );
  } catch (a) {
    return await t.error(
      `Merge failed: ${a instanceof Error ? a.message : String(a)}`
    ), pe(
      "mergeImportGroup",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function ei(e) {
  var a, i, n, s, c;
  try {
    await t.log("=== Test: itemSpacing Variable Binding ===");
    const o = await figma.getNodeByIdAsync(e);
    if (!o || o.type !== "PAGE")
      throw new Error("Test page not found");
    const d = o.children.find(
      (l) => l.type === "FRAME" && l.name === "Test"
    );
    if (!d)
      throw new Error("Test frame container not found on page");
    await t.log("Creating test variable collection and variable...");
    const m = figma.variables.createVariableCollection("Test"), f = m.modes[0], p = figma.variables.createVariable(
      "Spacing",
      m,
      "FLOAT"
    );
    p.setValueForMode(f.modeId, 16), await t.log(
      `Created variable: "${p.name}" = ${p.valuesByMode[f.modeId]} in collection "${m.name}"`
    );
    const y = [];
    await t.log(
      `
--- Approach 1: Set layoutMode, then immediately bind ---`
    );
    try {
      const l = figma.createFrame();
      l.name = "Test Frame 1 - Immediate Bind", d.appendChild(l), l.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL"), l.setBoundVariable("itemSpacing", p), await t.log(
        "  Set bound variable immediately after layoutMode"
      );
      const v = (a = l.boundVariables) == null ? void 0 : a.itemSpacing, g = l.itemSpacing, u = v !== void 0;
      await t.log(`  Result: ${u ? "SUCCESS" : "FAILED"}`), await t.log(`  itemSpacing value: ${g}`), await t.log(`  boundVariable: ${JSON.stringify(v)}`), y.push({
        approach: "1 - Immediate bind after layoutMode",
        success: u,
        message: u ? "Variable binding succeeded" : "Variable binding failed",
        details: {
          itemSpacing: g,
          boundVariable: v
        }
      });
    } catch (l) {
      await t.error(
        `  Approach 1 failed with error: ${l instanceof Error ? l.message : String(l)}`
      ), y.push({
        approach: "1 - Immediate bind after layoutMode",
        success: !1,
        message: `Error: ${l instanceof Error ? l.message : String(l)}`
      });
    }
    await t.log(
      `
--- Approach 2: Set layoutMode, clear itemSpacing, then bind ---`
    );
    try {
      const l = figma.createFrame();
      l.name = "Test Frame 2 - Clear Then Bind", d.appendChild(l), l.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL"), await t.log(
        `  itemSpacing after layoutMode: ${l.itemSpacing}`
      ), l.itemSpacing = 0, await t.log("  Set itemSpacing to 0"), l.setBoundVariable("itemSpacing", p), await t.log("  Set bound variable after clearing");
      const v = (i = l.boundVariables) == null ? void 0 : i.itemSpacing, g = l.itemSpacing, u = v !== void 0;
      await t.log(`  Result: ${u ? "SUCCESS" : "FAILED"}`), await t.log(`  itemSpacing value: ${g}`), await t.log(`  boundVariable: ${JSON.stringify(v)}`), y.push({
        approach: "2 - Clear then bind",
        success: u,
        message: u ? "Variable binding succeeded" : "Variable binding failed",
        details: {
          itemSpacing: g,
          boundVariable: v
        }
      });
    } catch (l) {
      await t.error(
        `  Approach 2 failed with error: ${l instanceof Error ? l.message : String(l)}`
      ), y.push({
        approach: "2 - Clear then bind",
        success: !1,
        message: `Error: ${l instanceof Error ? l.message : String(l)}`
      });
    }
    await t.log(
      `
--- Approach 3: Set boundVariable first, then layoutMode ---`
    );
    try {
      const l = figma.createFrame();
      l.name = "Test Frame 3 - Bind Before Layout", d.appendChild(l);
      try {
        l.setBoundVariable("itemSpacing", p), await t.log("  Set bound variable before layoutMode");
      } catch (b) {
        await t.log(
          `  Could not set bound variable before layoutMode (expected): ${b instanceof Error ? b.message : String(b)}`
        );
      }
      l.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL");
      const v = (n = l.boundVariables) == null ? void 0 : n.itemSpacing, g = l.itemSpacing, u = v !== void 0;
      await t.log(`  Result: ${u ? "SUCCESS" : "FAILED"}`), await t.log(`  itemSpacing value: ${g}`), await t.log(`  boundVariable: ${JSON.stringify(v)}`), y.push({
        approach: "3 - Bind before layoutMode",
        success: u,
        message: u ? "Variable binding succeeded" : "Variable binding failed",
        details: {
          itemSpacing: g,
          boundVariable: v
        }
      });
    } catch (l) {
      await t.error(
        `  Approach 3 failed with error: ${l instanceof Error ? l.message : String(l)}`
      ), y.push({
        approach: "3 - Bind before layoutMode",
        success: !1,
        message: `Error: ${l instanceof Error ? l.message : String(l)}`
      });
    }
    await t.log(
      `
--- Approach 4: Remove then set bound variable ---`
    );
    try {
      const l = figma.createFrame();
      l.name = "Test Frame 4 - Remove Then Bind", d.appendChild(l), l.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL"), await t.log(
        `  itemSpacing after layoutMode: ${l.itemSpacing}`
      );
      try {
        l.setBoundVariable("itemSpacing", null), await t.log("  Removed bound variable (if any)");
      } catch (b) {
        await t.log(
          `  No bound variable to remove (expected): ${b instanceof Error ? b.message : String(b)}`
        );
      }
      l.setBoundVariable("itemSpacing", p), await t.log("  Set bound variable after remove");
      const v = (s = l.boundVariables) == null ? void 0 : s.itemSpacing, g = l.itemSpacing, u = v !== void 0;
      await t.log(`  Result: ${u ? "SUCCESS" : "FAILED"}`), await t.log(`  itemSpacing value: ${g}`), await t.log(`  boundVariable: ${JSON.stringify(v)}`), y.push({
        approach: "4 - Remove then bind",
        success: u,
        message: u ? "Variable binding succeeded" : "Variable binding failed",
        details: {
          itemSpacing: g,
          boundVariable: v
        }
      });
    } catch (l) {
      await t.error(
        `  Approach 4 failed with error: ${l instanceof Error ? l.message : String(l)}`
      ), y.push({
        approach: "4 - Remove then bind",
        success: !1,
        message: `Error: ${l instanceof Error ? l.message : String(l)}`
      });
    }
    await t.log(
      `
--- Approach 5: Set layoutMode, wait, then bind ---`
    );
    try {
      const l = figma.createFrame();
      l.name = "Test Frame 5 - Wait Then Bind", d.appendChild(l), l.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL"), await new Promise((b) => setTimeout(b, 10)), await t.log("  Waited 10ms"), l.setBoundVariable("itemSpacing", p), await t.log("  Set bound variable after wait");
      const v = (c = l.boundVariables) == null ? void 0 : c.itemSpacing, g = l.itemSpacing, u = v !== void 0;
      await t.log(`  Result: ${u ? "SUCCESS" : "FAILED"}`), await t.log(`  itemSpacing value: ${g}`), await t.log(`  boundVariable: ${JSON.stringify(v)}`), y.push({
        approach: "5 - Wait then bind",
        success: u,
        message: u ? "Variable binding succeeded" : "Variable binding failed",
        details: {
          itemSpacing: g,
          boundVariable: v
        }
      });
    } catch (l) {
      await t.error(
        `  Approach 5 failed with error: ${l instanceof Error ? l.message : String(l)}`
      ), y.push({
        approach: "5 - Wait then bind",
        success: !1,
        message: `Error: ${l instanceof Error ? l.message : String(l)}`
      });
    }
    await t.log(`
=== Test Summary ===`);
    const r = y.filter((l) => l.success), h = y.filter((l) => !l.success);
    await t.log(
      `Successful approaches: ${r.length}/${y.length}`
    );
    for (const l of y)
      await t.log(
        `  ${l.approach}: ${l.success ? "✓ SUCCESS" : "✗ FAILED"} - ${l.message}`
      );
    return {
      success: r.length > 0,
      message: `Test completed: ${r.length}/${y.length} approaches succeeded`,
      details: {
        results: y,
        successfulApproaches: r.map((l) => l.approach),
        failedApproaches: h.map((l) => l.approach)
      }
    };
  } catch (o) {
    const d = o instanceof Error ? o.message : "Unknown error occurred";
    return await t.error(`Test failed: ${d}`), {
      success: !1,
      message: `Test error: ${d}`
    };
  }
}
async function ti(e) {
  var a, i, n, s, c, o, d, m;
  try {
    await t.log(
      "=== Test: itemSpacing Variable Binding - Import Simulation ==="
    );
    const f = await figma.getNodeByIdAsync(e);
    if (!f || f.type !== "PAGE")
      throw new Error("Test page not found");
    const p = f.children.find(
      (W) => W.type === "FRAME" && W.name === "Test"
    );
    if (!p)
      throw new Error("Test frame container not found on page");
    await t.log("Creating test variable collection and variable...");
    const y = figma.variables.createVariableCollection("Test"), r = y.modes[0], h = figma.variables.createVariable(
      "Spacing",
      y,
      "FLOAT"
    );
    h.setValueForMode(r.modeId, 16), await t.log(
      `Created variable: "${h.name}" = ${h.valuesByMode[r.modeId]} in collection "${y.name}"`
    ), await t.log(`
--- Simulating Import Process ---`);
    const l = figma.createFrame();
    l.name = "Import Simulation Frame", p.appendChild(l), await t.log("  Created frame"), l.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL"), await t.log(
      `  itemSpacing after layoutMode: ${l.itemSpacing}`
    ), await t.log(
      "  Setting bound variable using setBoundVariable() API..."
    );
    try {
      l.setBoundVariable("itemSpacing", null);
    } catch (W) {
    }
    l.setBoundVariable("itemSpacing", h), await t.log(
      "  Called setBoundVariable('itemSpacing', variable)"
    );
    const v = (a = l.boundVariables) == null ? void 0 : a.itemSpacing, g = l.itemSpacing;
    if (await t.log(
      `  After setting binding: itemSpacing=${g}, boundVar=${JSON.stringify(v)}`
    ), !v)
      return {
        success: !1,
        message: "Binding failed immediately after setBoundVariable()",
        details: {
          itemSpacing: g,
          boundVariable: v
        }
      };
    await t.log("  Setting other layout properties..."), l.primaryAxisSizingMode = "AUTO", l.counterAxisSizingMode = "AUTO", l.primaryAxisAlignItems = "MIN", l.counterAxisAlignItems = "MIN", await t.log(
      "  Set primaryAxisSizingMode, counterAxisSizingMode, alignItems"
    );
    const u = (i = l.boundVariables) == null ? void 0 : i.itemSpacing, b = l.itemSpacing;
    await t.log(
      `  After layout properties: itemSpacing=${b}, boundVar=${JSON.stringify(u)}`
    ), await t.log("  Setting padding properties..."), l.paddingLeft = 0, l.paddingRight = 0, l.paddingTop = 0, l.paddingBottom = 0, await t.log("  Set padding to 0");
    const R = (n = l.boundVariables) == null ? void 0 : n.itemSpacing, V = l.itemSpacing;
    await t.log(
      `  After padding: itemSpacing=${V}, boundVar=${JSON.stringify(R)}`
    ), await t.log("  Simulating 'late setting' code...");
    const G = 0, T = !0, x = { itemSpacing: !0 }, C = ((s = l.boundVariables) == null ? void 0 : s.itemSpacing) !== void 0;
    G !== void 0 && l.layoutMode !== void 0 && (!C && (!T || !x.itemSpacing) || C && await t.log(
      "  ✓ Late setting correctly skipped (binding exists)"
    ));
    const k = (c = l.boundVariables) == null ? void 0 : c.itemSpacing, L = l.itemSpacing;
    await t.log(
      `  After late setting: itemSpacing=${L}, boundVar=${JSON.stringify(k)}`
    ), await t.log("  Appending children (might reset itemSpacing)...");
    const B = figma.createFrame();
    B.name = "Child 1", B.resize(50, 50), l.appendChild(B);
    const I = figma.createFrame();
    I.name = "Child 2", I.resize(50, 50), l.appendChild(I), await t.log("  Appended 2 children");
    const _ = (o = l.boundVariables) == null ? void 0 : o.itemSpacing, $ = l.itemSpacing;
    await t.log(
      `  After appending children: itemSpacing=${$}, boundVar=${JSON.stringify(_)}`
    ), await t.log("  Simulating 'FINAL FIX' code..."), ((d = l.boundVariables) == null ? void 0 : d.itemSpacing) !== void 0 ? await t.log(
      "  ✓ FINAL FIX correctly skipped (binding exists)"
    ) : !0 && await t.log(
      "  ⚠️ FINAL FIX: Binding should exist but doesn't!"
    );
    const z = (m = l.boundVariables) == null ? void 0 : m.itemSpacing, D = l.itemSpacing;
    await t.log(
      `  FINAL: itemSpacing=${D}, boundVar=${JSON.stringify(z)}`
    );
    const j = z !== void 0 && z.id === h.id;
    return await t.log(`
=== Import Simulation Summary ===`), await t.log(
      `Result: ${j ? "SUCCESS" : "FAILED"} - Binding ${j ? "survived" : "was lost"} through import simulation`
    ), {
      success: j,
      message: j ? "Variable binding survived the import simulation" : "Variable binding was lost during import simulation",
      details: {
        afterSet: {
          itemSpacing: g,
          boundVariable: v
        },
        afterLayout: {
          itemSpacing: b,
          boundVariable: u
        },
        afterPadding: {
          itemSpacing: V,
          boundVariable: R
        },
        afterLate: {
          itemSpacing: L,
          boundVariable: k
        },
        afterChildren: {
          itemSpacing: $,
          boundVariable: _
        },
        final: {
          itemSpacing: D,
          boundVariable: z
        }
      }
    };
  } catch (f) {
    const p = f instanceof Error ? f.message : "Unknown error occurred";
    return await t.error(`Import simulation test failed: ${p}`), {
      success: !1,
      message: `Test error: ${p}`
    };
  }
}
async function ai(e) {
  var a, i, n, s;
  try {
    await t.log(
      "=== Test: itemSpacing Variable Binding - FAILURE DEMONSTRATION ==="
    ), await t.log(
      "This test demonstrates the OLD BROKEN approach that was causing the issue."
    );
    const c = await figma.getNodeByIdAsync(e);
    if (!c || c.type !== "PAGE")
      throw new Error("Test page not found");
    const o = c.children.find(
      (T) => T.type === "FRAME" && T.name === "Test"
    );
    if (!o)
      throw new Error("Test frame container not found on page");
    await t.log("Creating test variable collection and variable...");
    const d = figma.variables.createVariableCollection("Test"), m = d.modes[0], f = figma.variables.createVariable(
      "Spacing",
      d,
      "FLOAT"
    );
    f.setValueForMode(m.modeId, 16), await t.log(
      `Created variable: "${f.name}" = ${f.valuesByMode[m.modeId]} in collection "${d.name}"`
    ), await t.log(`
--- Simulating OLD BROKEN Import Process ---`);
    const p = figma.createFrame();
    p.name = "Failure Demo Frame", o.appendChild(p), await t.log("  Created frame"), p.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL"), await t.log(
      `  itemSpacing after layoutMode: ${p.itemSpacing}`
    ), await t.log(
      "  ⚠️ BROKEN: Attempting to set bound variable using direct assignment..."
    );
    try {
      p.boundVariables = ce(q({}, p.boundVariables || {}), {
        itemSpacing: {
          type: "VARIABLE_ALIAS",
          id: f.id
        }
      }), await t.log(
        "  Called (frame as any).boundVariables.itemSpacing = alias (BROKEN APPROACH)"
      );
    } catch (T) {
      await t.log(
        `  Direct assignment failed (expected): ${T instanceof Error ? T.message : String(T)}`
      );
    }
    const y = (a = p.boundVariables) == null ? void 0 : a.itemSpacing, r = p.itemSpacing;
    await t.log(
      `  After broken set: itemSpacing=${r}, boundVar=${JSON.stringify(y)}`
    ), await t.log(
      "  Attempting to fix by using setBoundVariable() API..."
    );
    try {
      p.setBoundVariable("itemSpacing", f), await t.log(
        "  Called setBoundVariable('itemSpacing', variable)"
      );
    } catch (T) {
      await t.log(
        `  setBoundVariable failed: ${T instanceof Error ? T.message : String(T)}`
      );
    }
    const h = (i = p.boundVariables) == null ? void 0 : i.itemSpacing, l = p.itemSpacing;
    await t.log(
      `  After correct set: itemSpacing=${l}, boundVar=${JSON.stringify(h)}`
    ), await t.log(
      "  ⚠️ BROKEN: Simulating 'late setting' code WITHOUT checking if bound..."
    );
    const v = 0;
    v !== void 0 && p.layoutMode !== void 0 && (await t.log(
      "  ⚠️ Late setting OVERRIDING itemSpacing without checking if bound!"
    ), p.itemSpacing = v);
    const g = (n = p.boundVariables) == null ? void 0 : n.itemSpacing, u = p.itemSpacing;
    await t.log(
      `  After broken late setting: itemSpacing=${u}, boundVar=${JSON.stringify(g)}`
    ), await t.log(
      "  ⚠️ BROKEN: Simulating 'FINAL FIX' code WITHOUT checking if bound..."
    );
    const b = 0;
    (p.layoutMode === "VERTICAL" || p.layoutMode === "HORIZONTAL") && b !== void 0 && (await t.log(
      "  ⚠️ FINAL FIX OVERRIDING itemSpacing without checking if bound!"
    ), p.itemSpacing = b);
    const R = (s = p.boundVariables) == null ? void 0 : s.itemSpacing, V = p.itemSpacing;
    await t.log(
      `  FINAL: itemSpacing=${V}, boundVar=${JSON.stringify(R)}`
    );
    const G = R === void 0;
    return await t.log(`
=== Failure Demonstration Summary ===`), await t.log(
      `Result: ${G ? "FAILURE DEMONSTRATED ✓" : "UNEXPECTED - Binding survived"} - ${G ? "Binding was lost as expected (demonstrating the bug)" : "Binding survived (unexpected - bug may be fixed)"}`
    ), {
      success: G,
      // Success = we demonstrated the failure
      message: G ? "Failure demonstrated: Binding was lost using old broken approach" : "Unexpected: Binding survived (bug may already be fixed)",
      details: {
        afterBrokenSet: {
          itemSpacing: r,
          boundVariable: y
        },
        afterCorrectSet: {
          itemSpacing: l,
          boundVariable: h
        },
        afterLate: {
          itemSpacing: u,
          boundVariable: g
        },
        final: {
          itemSpacing: V,
          boundVariable: R
        },
        bindingLost: G
      }
    };
  } catch (c) {
    const o = c instanceof Error ? c.message : "Unknown error occurred";
    return await t.error(
      `Failure demonstration test failed: ${o}`
    ), {
      success: !1,
      message: `Test error: ${o}`
    };
  }
}
async function ii(e) {
  var a, i, n, s, c, o, d, m;
  try {
    await t.log(
      "=== Test: itemSpacing Variable Binding - FIX DEMONSTRATION ==="
    ), await t.log(
      "This test demonstrates the NEW FIXED approach that correctly preserves binding."
    );
    const f = await figma.getNodeByIdAsync(e);
    if (!f || f.type !== "PAGE")
      throw new Error("Test page not found");
    const p = f.children.find(
      (W) => W.type === "FRAME" && W.name === "Test"
    );
    if (!p)
      throw new Error("Test frame container not found on page");
    await t.log("Creating test variable collection and variable...");
    const y = figma.variables.createVariableCollection("Test"), r = y.modes[0], h = figma.variables.createVariable(
      "Spacing",
      y,
      "FLOAT"
    );
    h.setValueForMode(r.modeId, 16), await t.log(
      `Created variable: "${h.name}" = ${h.valuesByMode[r.modeId]} in collection "${y.name}"`
    ), await t.log(`
--- Simulating NEW FIXED Import Process ---`);
    const l = figma.createFrame();
    l.name = "Fix Demo Frame", p.appendChild(l), await t.log("  Created frame"), l.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL"), await t.log(
      `  itemSpacing after layoutMode: ${l.itemSpacing}`
    ), await t.log(
      "  ✓ FIXED: Setting bound variable using setBoundVariable() API..."
    );
    try {
      l.setBoundVariable("itemSpacing", null);
    } catch (W) {
    }
    l.setBoundVariable("itemSpacing", h), await t.log(
      "  Called setBoundVariable('itemSpacing', variable) (CORRECT APPROACH)"
    );
    const v = (a = l.boundVariables) == null ? void 0 : a.itemSpacing, g = l.itemSpacing;
    if (await t.log(
      `  After setting binding: itemSpacing=${g}, boundVar=${JSON.stringify(v)}`
    ), !v)
      return {
        success: !1,
        message: "Binding failed immediately after setBoundVariable()",
        details: {
          itemSpacing: g,
          boundVariable: v
        }
      };
    await t.log("  Setting other layout properties..."), l.primaryAxisSizingMode = "AUTO", l.counterAxisSizingMode = "AUTO", l.primaryAxisAlignItems = "MIN", l.counterAxisAlignItems = "MIN", await t.log(
      "  Set primaryAxisSizingMode, counterAxisSizingMode, alignItems"
    );
    const u = (i = l.boundVariables) == null ? void 0 : i.itemSpacing, b = l.itemSpacing;
    await t.log(
      `  After layout properties: itemSpacing=${b}, boundVar=${JSON.stringify(u)}`
    ), await t.log("  Setting padding properties..."), l.paddingLeft = 0, l.paddingRight = 0, l.paddingTop = 0, l.paddingBottom = 0, await t.log("  Set padding to 0");
    const R = (n = l.boundVariables) == null ? void 0 : n.itemSpacing, V = l.itemSpacing;
    await t.log(
      `  After padding: itemSpacing=${V}, boundVar=${JSON.stringify(R)}`
    ), await t.log(
      "  ✓ FIXED: Simulating 'late setting' code WITH check if bound..."
    );
    const G = 0, T = !0, x = { itemSpacing: !0 }, C = ((s = l.boundVariables) == null ? void 0 : s.itemSpacing) !== void 0;
    G !== void 0 && l.layoutMode !== void 0 && (!C && (!T || !x.itemSpacing) || C && await t.log(
      "  ✓ Late setting correctly skipped (binding exists) - FIXED!"
    ));
    const k = (c = l.boundVariables) == null ? void 0 : c.itemSpacing, L = l.itemSpacing;
    await t.log(
      `  After fixed late setting: itemSpacing=${L}, boundVar=${JSON.stringify(k)}`
    ), await t.log("  Appending children (might reset itemSpacing)...");
    const B = figma.createFrame();
    B.name = "Child 1", B.resize(50, 50), l.appendChild(B);
    const I = figma.createFrame();
    I.name = "Child 2", I.resize(50, 50), l.appendChild(I), await t.log("  Appended 2 children");
    const _ = (o = l.boundVariables) == null ? void 0 : o.itemSpacing, $ = l.itemSpacing;
    await t.log(
      `  After appending children: itemSpacing=${$}, boundVar=${JSON.stringify(_)}`
    ), await t.log(
      "  ✓ FIXED: Simulating 'FINAL FIX' code WITH check if bound..."
    );
    const P = ((d = l.boundVariables) == null ? void 0 : d.itemSpacing) !== void 0, U = 0;
    (l.type === "FRAME" || l.type === "COMPONENT" || l.type === "INSTANCE") && (l.layoutMode === "VERTICAL" || l.layoutMode === "HORIZONTAL") && U !== void 0 && (P ? await t.log(
      "  ✓ FINAL FIX correctly skipped (binding exists) - FIXED!"
    ) : (await t.log(
      "  FINAL FIX would set direct value (but binding doesn't exist, so OK)"
    ), l.itemSpacing = U));
    const z = (m = l.boundVariables) == null ? void 0 : m.itemSpacing, D = l.itemSpacing;
    await t.log(
      `  FINAL: itemSpacing=${D}, boundVar=${JSON.stringify(z)}`
    );
    const j = z !== void 0 && z.id === h.id;
    return await t.log(`
=== Fix Demonstration Summary ===`), await t.log(
      `Result: ${j ? "SUCCESS ✓" : "FAILED ✗"} - Binding ${j ? "survived" : "was lost"} through fixed import simulation`
    ), {
      success: j,
      message: j ? "Fix demonstrated: Binding survived using new fixed approach" : "Fix failed: Binding was lost (unexpected)",
      details: {
        afterSet: {
          itemSpacing: g,
          boundVariable: v
        },
        afterLayout: {
          itemSpacing: b,
          boundVariable: u
        },
        afterPadding: {
          itemSpacing: V,
          boundVariable: R
        },
        afterLate: {
          itemSpacing: L,
          boundVariable: k
        },
        afterChildren: {
          itemSpacing: $,
          boundVariable: _
        },
        final: {
          itemSpacing: D,
          boundVariable: z
        },
        bindingSurvived: j
      }
    };
  } catch (f) {
    const p = f instanceof Error ? f.message : "Unknown error occurred";
    return await t.error(`Fix demonstration test failed: ${p}`), {
      success: !1,
      message: `Test error: ${p}`
    };
  }
}
async function ni(e) {
  try {
    await t.log(
      "=== Test: Constraints Import/Export (Issue #4) ==="
    );
    const a = await figma.getNodeByIdAsync(e);
    if (!a || a.type !== "PAGE")
      throw new Error("Test page not found");
    const i = a.children.find(
      (b) => b.type === "FRAME" && b.name === "Test"
    );
    if (!i)
      throw new Error("Test frame container not found on page");
    await t.log(
      `
--- Step 1: Create frame with SCALE constraints ---`
    );
    const n = figma.createFrame();
    n.name = "Original Frame - SCALE Constraints", n.resize(100, 100), i.appendChild(n), n.constraintHorizontal = "SCALE", n.constraintVertical = "SCALE", await t.log("  Set constraintHorizontal to SCALE"), await t.log("  Set constraintVertical to SCALE");
    const s = n.constraintHorizontal, c = n.constraintVertical;
    if (await t.log(
      `  Original constraints: H=${s}, V=${c}`
    ), s !== "SCALE" || c !== "SCALE")
      return {
        success: !1,
        message: "Failed to set SCALE constraints on original frame",
        details: {
          constraintHorizontal: s,
          constraintVertical: c
        }
      };
    await t.log(
      `
--- Step 2: Simulate Export (read constraints) ---`
    );
    const o = n.constraintHorizontal, d = n.constraintVertical;
    await t.log(
      `  Exported constraints: H=${o}, V=${d}`
    );
    const m = {
      type: "FRAME",
      name: "Imported Frame - Should Have SCALE",
      width: 100,
      height: 100,
      constraintHorizontal: o,
      constraintVertical: d
    };
    await t.log(
      `
--- Step 3: Simulate Import (create frame and set constraints) ---`
    );
    const f = figma.createFrame();
    f.name = "Imported Frame - SCALE Constraints", f.resize(m.width, m.height), i.appendChild(f);
    const p = f.constraintHorizontal, y = f.constraintVertical;
    await t.log(
      `  Constraints before setting: H=${p}, V=${y} (expected: MIN, MIN)`
    ), m.constraintHorizontal !== void 0 && (f.constraintHorizontal = m.constraintHorizontal, await t.log(
      `  Set constraintHorizontal to ${m.constraintHorizontal}`
    )), m.constraintVertical !== void 0 && (f.constraintVertical = m.constraintVertical, await t.log(
      `  Set constraintVertical to ${m.constraintVertical}`
    )), await t.log(`
--- Step 4: Verify Imported Constraints ---`);
    const r = f.constraintHorizontal, h = f.constraintVertical;
    await t.log(
      `  Imported constraints: H=${r}, V=${h}`
    ), await t.log("  Expected constraints: H=SCALE, V=SCALE");
    const l = r === "SCALE" && h === "SCALE";
    l ? await t.log("  ✓ Constraints correctly imported as SCALE") : await t.warning(
      `  ⚠️ Constraints mismatch! Expected SCALE, got H=${r}, V=${h}`
    ), await t.log(`
--- Step 5: Test Other Constraint Values ---`);
    const v = [
      { h: "MIN", v: "MIN", name: "MIN/MIN" },
      { h: "CENTER", v: "CENTER", name: "CENTER/CENTER" },
      { h: "MAX", v: "MAX", name: "MAX/MAX" },
      { h: "STRETCH", v: "STRETCH", name: "STRETCH/STRETCH" }
    ], g = [];
    for (const b of v) {
      const R = figma.createFrame();
      R.name = `Test Frame - ${b.name}`, R.resize(50, 50), i.appendChild(R), R.constraintHorizontal = b.h, R.constraintVertical = b.v;
      const V = R.constraintHorizontal, G = R.constraintVertical, T = V === b.h && G === b.v;
      g.push({
        name: b.name,
        success: T,
        details: {
          expected: { h: b.h, v: b.v },
          actual: { h: V, v: G }
        }
      }), T ? await t.log(
        `  ✓ ${b.name}: Correctly set to H=${V}, V=${G}`
      ) : await t.warning(
        `  ⚠️ ${b.name}: Expected H=${b.h}, V=${b.v}, got H=${V}, V=${G}`
      );
    }
    const u = g.every((b) => b.success);
    return {
      success: l && u,
      message: l && u ? "Constraints correctly exported and imported (SCALE preserved)" : `Constraints test failed: SCALE=${l ? "PASS" : "FAIL"}, Other values=${u ? "PASS" : "FAIL"}`,
      details: {
        original: {
          constraintHorizontal: s,
          constraintVertical: c
        },
        exported: {
          constraintHorizontal: o,
          constraintVertical: d
        },
        imported: {
          constraintHorizontal: r,
          constraintVertical: h
        },
        otherValues: g,
        allTestsPassed: l && u
      }
    };
  } catch (a) {
    const i = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Constraints test failed: ${i}`), {
      success: !1,
      message: `Test error: ${i}`
    };
  }
}
async function oi(e) {
  try {
    await t.log("=== Starting Test ==="), await figma.loadAllPagesAsync();
    let i = figma.root.children.find(
      (R) => R.type === "PAGE" && R.name === "Test"
    );
    i ? await t.log('Found existing "Test" page') : (i = figma.createPage(), i.name = "Test", await t.log('Created "Test" page')), await figma.setCurrentPageAsync(i);
    const n = i.children.find(
      (R) => R.type === "FRAME" && R.name === "Test"
    );
    n && (await t.log(
      'Found existing "Test" frame, deleting it and all children...'
    ), n.remove(), await t.log('Deleted existing "Test" frame'));
    const s = figma.createFrame();
    s.name = "Test", i.appendChild(s), await t.log('Created new "Test" frame container');
    const c = [];
    await t.log(`
` + "=".repeat(60)), await t.log("TEST 1: Original 5 Approaches"), await t.log("=".repeat(60));
    const o = await ei(i.id);
    c.push({
      name: "Original 5 Approaches",
      success: o.success,
      message: o.message,
      details: o.details
    }), s.remove();
    const d = figma.createFrame();
    d.name = "Test", i.appendChild(d), await t.log(`
` + "=".repeat(60)), await t.log("TEST 2: Import Simulation"), await t.log("=".repeat(60));
    const m = await ti(
      i.id
    );
    c.push({
      name: "Import Simulation",
      success: m.success,
      message: m.message,
      details: m.details
    }), d.remove();
    const f = figma.createFrame();
    f.name = "Test", i.appendChild(f), await t.log(`
` + "=".repeat(60)), await t.log(
      "TEST 3: Failure Demonstration (Old Broken Approach)"
    ), await t.log("=".repeat(60));
    const p = await ai(
      i.id
    );
    c.push({
      name: "Failure Demonstration",
      success: p.success,
      message: p.message,
      details: p.details
    }), f.remove();
    const y = figma.createFrame();
    y.name = "Test", i.appendChild(y), await t.log(`
` + "=".repeat(60)), await t.log("TEST 4: Fix Demonstration (New Fixed Approach)"), await t.log("=".repeat(60));
    const r = await ii(i.id);
    c.push({
      name: "Fix Demonstration",
      success: r.success,
      message: r.message,
      details: r.details
    }), y.remove();
    const h = figma.createFrame();
    h.name = "Test", i.appendChild(h), await t.log(`
` + "=".repeat(60)), await t.log("TEST 5: Constraints Import/Export (Issue #4)"), await t.log("=".repeat(60));
    const l = await ni(i.id);
    c.push({
      name: "Constraints Import/Export",
      success: l.success,
      message: l.message,
      details: l.details
    }), await t.log(`
` + "=".repeat(60)), await t.log("=== ALL TESTS COMPLETE ==="), await t.log("=".repeat(60));
    const v = c.filter((R) => R.success), g = c.filter((R) => !R.success);
    await t.log(
      `Total: ${c.length} | Passed: ${v.length} | Failed: ${g.length}`
    );
    for (const R of c)
      await t.log(
        `  ${R.success ? "✓" : "✗"} ${R.name}: ${R.message}`
      );
    const b = {
      testResults: {
        success: o.success && m.success && p.success && // This "success" means we demonstrated the failure
        r.success && l.success,
        message: `All tests completed: ${v.length}/${c.length} passed`,
        details: {
          summary: {
            total: c.length,
            passed: v.length,
            failed: g.length
          },
          tests: c
        }
      },
      allTests: c
    };
    return se("runTest", b);
  } catch (a) {
    const i = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Test failed: ${i}`), pe("runTest", i);
  }
}
const ri = {
  getCurrentUser: xt,
  loadPages: Rt,
  exportPage: Ye,
  importPage: bt,
  cleanupCreatedEntities: Ma,
  resolveDeferredNormalInstances: yt,
  determineImportOrder: St,
  buildDependencyGraph: wt,
  resolveImportOrder: $t,
  importPagesInOrder: vt,
  quickCopy: xa,
  storeAuthData: Ra,
  loadAuthData: ka,
  clearAuthData: La,
  storeImportData: Ba,
  loadImportData: Fa,
  clearImportData: Ua,
  storeSelectedRepo: Ga,
  getComponentMetadata: _a,
  getAllComponents: za,
  pluginPromptResponse: ja,
  switchToPage: Da,
  checkForExistingPrimaryImport: Ja,
  createImportDividers: Ha,
  importSingleComponentWithWizard: Wa,
  deleteImportGroup: Ct,
  clearImportMetadata: qa,
  cleanupFailedImport: Ka,
  summarizeVariablesForWizard: Xa,
  getLocalVariableCollections: Ya,
  getCollectionGuids: Za,
  mergeImportGroup: Qa,
  runTest: oi
}, si = ri;
figma.showUI(__html__, {
  width: 500,
  height: 500
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    jt(e);
    return;
  }
  const a = e;
  try {
    const i = a.type, n = si[i];
    if (!n) {
      console.warn("Unknown message type:", a.type);
      const c = {
        type: a.type,
        success: !1,
        error: !0,
        message: "Unknown message type: " + a.type,
        data: {},
        requestId: a.requestId
      };
      figma.ui.postMessage(c);
      return;
    }
    const s = await n(a.data);
    figma.ui.postMessage(ce(q({}, s), {
      requestId: a.requestId
    }));
  } catch (i) {
    console.error("Error handling message:", i);
    const n = {
      type: a.type,
      success: !1,
      error: !0,
      message: i instanceof Error ? i.message : "Unknown error occurred",
      data: {},
      requestId: a.requestId
    };
    figma.ui.postMessage(n);
  }
};
