var Pt = Object.defineProperty, Tt = Object.defineProperties;
var Vt = Object.getOwnPropertyDescriptors;
var at = Object.getOwnPropertySymbols;
var Ot = Object.prototype.hasOwnProperty, Mt = Object.prototype.propertyIsEnumerable;
var De = (e, a, i) => a in e ? Pt(e, a, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[a] = i, q = (e, a) => {
  for (var i in a || (a = {}))
    Ot.call(a, i) && De(e, i, a[i]);
  if (at)
    for (var i of at(a))
      Mt.call(a, i) && De(e, i, a[i]);
  return e;
}, ce = (e, a) => Tt(e, Vt(a));
var ge = (e, a, i) => De(e, typeof a != "symbol" ? a + "" : a, i);
async function Rt(e) {
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
async function xt(e) {
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
const ae = {
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
}, re = ce(q({}, ae), {
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
}), fe = ce(q({}, ae), {
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
}), Ee = ce(q({}, ae), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), rt = ce(q({}, ae), {
  cornerRadius: 0
}), kt = ce(q({}, ae), {
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
      return Ee;
    case "LINE":
      return kt;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return rt;
    default:
      return ae;
  }
}
function K(e, a) {
  if (Array.isArray(e))
    return Array.isArray(a) ? e.length !== a.length || e.some((i, n) => K(i, a[n])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof a == "object" && a !== null) {
      const i = Object.keys(e), n = Object.keys(a);
      return i.length !== n.length ? !0 : i.some(
        (r) => !(r in a) || K(e[r], a[r])
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
function Ge(e) {
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
    for (const r of i)
      n.add(r);
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
    const r = this.nextIndex++;
    this.collectionMap.set(i, r);
    const c = ce(q({}, a), {
      collectionName: n
    });
    if (ye(a.collectionName)) {
      const o = Ge(
        a.collectionName
      );
      o && (c.collectionGuid = o), this.normalizedNameMap.set(n, r);
    }
    return this.collections[r] = c, r;
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
      const n = this.collections[i], r = q({
        collectionName: n.collectionName,
        modes: n.modes
      }, n.collectionGuid && { collectionGuid: n.collectionGuid });
      a[String(i)] = r;
    }
    return a;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   * Handles both new format (without collectionId/isLocal) and legacy format (with collectionId/isLocal)
   */
  static fromTable(a) {
    var r;
    const i = new Oe(), n = Object.entries(a).sort(
      (c, o) => parseInt(c[0], 10) - parseInt(o[0], 10)
    );
    for (const [c, o] of n) {
      const d = parseInt(c, 10), p = (r = o.isLocal) != null ? r : !0, f = de(
        o.collectionName || ""
      ), m = o.collectionId || o.collectionGuid || `temp:${d}:${f}`, h = q({
        collectionName: f,
        collectionId: m,
        isLocal: p,
        modes: o.modes || []
      }, o.collectionGuid && {
        collectionGuid: o.collectionGuid
      });
      i.collectionMap.set(m, d), i.collections[d] = h, ye(f) && i.normalizedNameMap.set(f, d), i.nextIndex = Math.max(
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
    for (const [n, r] of Object.entries(a))
      typeof r == "object" && r !== null && "_varRef" in r && typeof r._varRef == "number" ? i[n] = {
        _varRef: r._varRef
      } : i[n] = r;
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
      const n = this.variables[i], r = this.serializeValuesByMode(
        n.valuesByMode
      ), c = q(q({
        variableName: n.variableName,
        variableType: Ut(n.variableType)
      }, n._colRef !== void 0 && { _colRef: n._colRef }), r && { valuesByMode: r });
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
      (r, c) => parseInt(r[0], 10) - parseInt(c[0], 10)
    );
    for (const [r, c] of n) {
      const o = parseInt(r, 10), d = Gt(c.variableType), p = ce(q({}, c), {
        variableType: d
        // Always a string after expansion
      });
      i.variables[o] = p, i.nextIndex = Math.max(i.nextIndex, o + 1);
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
function zt(e) {
  return {
    _varRef: e
  };
}
function $e(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let _t = 0;
const Ve = /* @__PURE__ */ new Map();
function jt(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const a = Ve.get(e.requestId);
  a && (Ve.delete(e.requestId), e.error || !e.guid ? a.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : a.resolve(e.guid));
}
function Ye() {
  return new Promise((e, a) => {
    const i = `guid_${Date.now()}_${++_t}`;
    Ve.set(i, { resolve: e, reject: a }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: i
    }), setTimeout(() => {
      Ve.has(i) && (Ve.delete(i), a(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
async function xe() {
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
    }), await xe();
  },
  log: async (e) => {
    console.log(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    }), await xe();
  },
  warning: async (e) => {
    console.warn(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    }), await xe();
  },
  error: async (e) => {
    console.error(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    }), await xe();
  }
};
function Dt(e, a) {
  const i = a.modes.find((n) => n.modeId === e);
  return i ? i.name : e;
}
async function st(e, a, i, n, r = /* @__PURE__ */ new Set()) {
  const c = {};
  for (const [o, d] of Object.entries(e)) {
    const p = Dt(o, n);
    if (d == null) {
      c[p] = d;
      continue;
    }
    if (typeof d == "string" || typeof d == "number" || typeof d == "boolean") {
      c[p] = d;
      continue;
    }
    if (typeof d == "object" && d !== null && "type" in d && d.type === "VARIABLE_ALIAS" && "id" in d) {
      const f = d.id;
      if (r.has(f)) {
        c[p] = {
          type: "VARIABLE_ALIAS",
          id: f
        };
        continue;
      }
      const m = await figma.variables.getVariableByIdAsync(f);
      if (!m) {
        c[p] = {
          type: "VARIABLE_ALIAS",
          id: f
        };
        continue;
      }
      const h = new Set(r);
      h.add(f);
      const s = await figma.variables.getVariableCollectionByIdAsync(
        m.variableCollectionId
      ), b = m.key;
      if (!b) {
        c[p] = {
          type: "VARIABLE_ALIAS",
          id: f
        };
        continue;
      }
      const l = {
        variableName: m.name,
        variableType: m.resolvedType,
        collectionName: s == null ? void 0 : s.name,
        collectionId: m.variableCollectionId,
        variableKey: b,
        id: f,
        isLocal: !m.remote
      };
      if (s) {
        const g = await ct(
          s,
          i
        );
        l._colRef = g, m.valuesByMode && (l.valuesByMode = await st(
          m.valuesByMode,
          a,
          i,
          s,
          // Pass collection for mode ID to name conversion
          h
        ));
      }
      const E = a.addVariable(l);
      c[p] = {
        type: "VARIABLE_ALIAS",
        id: f,
        _varRef: E
      };
    } else
      c[p] = d;
  }
  return c;
}
const ke = "recursica:collectionId";
async function Ht(e) {
  if (e.remote === !0) {
    const i = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(i)) {
      const r = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await t.error(r), new Error(r);
    }
    return e.id;
  } else {
    if (ye(e.name)) {
      const r = Ge(e.name);
      if (r) {
        const c = e.getSharedPluginData(
          "recursica",
          ke
        );
        return (!c || c.trim() === "") && e.setSharedPluginData(
          "recursica",
          ke,
          r
        ), r;
      }
    }
    const i = e.getSharedPluginData(
      "recursica",
      ke
    );
    if (i && i.trim() !== "")
      return i;
    const n = await Ye();
    return e.setSharedPluginData("recursica", ke, n), n;
  }
}
function Jt(e, a) {
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
  Jt(e.name, i);
  const r = await Ht(e), c = e.modes.map((f) => f.name), o = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: i,
    modes: c,
    collectionGuid: r
  }, d = a.addCollection(o), p = i ? "local" : "remote";
  return await t.log(
    `  Added ${p} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), d;
}
async function Je(e, a, i) {
  if (!e || typeof e != "object" || e.type !== "VARIABLE_ALIAS")
    return null;
  try {
    const n = await figma.variables.getVariableByIdAsync(e.id);
    if (!n)
      return console.log("Could not resolve variable alias:", e.id), null;
    const r = await figma.variables.getVariableCollectionByIdAsync(
      n.variableCollectionId
    );
    if (!r)
      return console.log("Could not resolve collection for variable:", e.id), null;
    const c = n.key;
    if (!c)
      return console.log("Variable missing key:", e.id), null;
    const o = await ct(
      r,
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
      r,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const p = a.addVariable(d);
    return zt(p);
  } catch (n) {
    const r = n instanceof Error ? n.message : String(n);
    throw console.error("Could not resolve variable alias:", e.id, n), new Error(
      `Failed to resolve variable alias ${e.id}: ${r}`
    );
  }
}
async function Ce(e, a, i) {
  if (!e || typeof e != "object") return e;
  const n = {};
  for (const r in e)
    if (Object.prototype.hasOwnProperty.call(e, r)) {
      const c = e[r];
      if (c && typeof c == "object" && !Array.isArray(c))
        if (c.type === "VARIABLE_ALIAS") {
          const o = await Je(
            c,
            a,
            i
          );
          o && (n[r] = o);
        } else
          n[r] = await Ce(
            c,
            a,
            i
          );
      else Array.isArray(c) ? n[r] = await Promise.all(
        c.map(async (o) => (o == null ? void 0 : o.type) === "VARIABLE_ALIAS" ? await Je(
          o,
          a,
          i
        ) || o : o && typeof o == "object" ? await Ce(
          o,
          a,
          i
        ) : o)
      ) : n[r] = c;
    }
  return n;
}
async function lt(e, a, i) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (n) => {
      if (!n || typeof n != "object") return n;
      const r = {};
      for (const c in n)
        Object.prototype.hasOwnProperty.call(n, c) && (c === "boundVariables" ? r[c] = await Ce(
          n[c],
          a,
          i
        ) : r[c] = n[c]);
      return r;
    })
  );
}
async function dt(e, a, i) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (n) => {
      if (!n || typeof n != "object") return n;
      const r = {};
      for (const c in n)
        Object.prototype.hasOwnProperty.call(n, c) && (c === "boundVariables" ? r[c] = await Ce(
          n[c],
          a,
          i
        ) : r[c] = n[c]);
      return r;
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
  var d, p;
  const i = {}, n = /* @__PURE__ */ new Set();
  e.type && (i.type = e.type, n.add("type")), e.id && (i.id = e.id, n.add("id")), e.name !== void 0 && e.name !== "" && (i.name = e.name, n.add("name")), e.x !== void 0 && e.x !== 0 && (i.x = e.x, n.add("x")), e.y !== void 0 && e.y !== 0 && (i.y = e.y, n.add("y")), e.width !== void 0 && (i.width = e.width, n.add("width")), e.height !== void 0 && (i.height = e.height, n.add("height"));
  const r = e.name || "Unnamed";
  e.preserveRatio !== void 0 && console.log(
    `[ISSUE #3 EXPORT DEBUG] "${r}" has preserveRatio: ${e.preserveRatio} (NOT being exported - needs to be added!)`
  );
  const c = e.type;
  if (c === "FRAME" || c === "COMPONENT" || c === "INSTANCE" || c === "GROUP" || c === "BOOLEAN_OPERATION" || c === "VECTOR" || c === "STAR" || c === "LINE" || c === "ELLIPSE" || c === "POLYGON" || c === "RECTANGLE" || c === "TEXT") {
    const f = e.constraintHorizontal !== void 0 ? e.constraintHorizontal : (d = e.constraints) == null ? void 0 : d.horizontal, m = e.constraintVertical !== void 0 ? e.constraintVertical : (p = e.constraints) == null ? void 0 : p.vertical;
    f !== void 0 ? K(
      f,
      ae.constraintHorizontal
    ) ? (i.constraintHorizontal = f, n.add("constraintHorizontal"), console.log(
      `[ISSUE #4 EXPORT] "${r}" (${c}) exporting constraintHorizontal: ${f} (different from default: ${ae.constraintHorizontal})`
    )) : console.log(
      `[ISSUE #4 EXPORT DEBUG] "${r}" (${c}) has constraintHorizontal: ${f} (default, not exporting)`
    ) : console.log(
      `[ISSUE #4 EXPORT DEBUG] "${r}" (${c}) constraintHorizontal is undefined (checked both direct property and constraints.horizontal)`
    ), m !== void 0 ? K(
      m,
      ae.constraintVertical
    ) ? (i.constraintVertical = m, n.add("constraintVertical"), console.log(
      `[ISSUE #4 EXPORT] "${r}" (${c}) exporting constraintVertical: ${m} (different from default: ${ae.constraintVertical})`
    )) : console.log(
      `[ISSUE #4 EXPORT DEBUG] "${r}" (${c}) has constraintVertical: ${m} (default, not exporting)`
    ) : console.log(
      `[ISSUE #4 EXPORT DEBUG] "${r}" (${c}) constraintVertical is undefined (checked both direct property and constraints.vertical)`
    );
  }
  if (e.visible !== void 0 && K(e.visible, ae.visible) && (i.visible = e.visible, n.add("visible")), e.locked !== void 0 && K(e.locked, ae.locked) && (i.locked = e.locked, n.add("locked")), e.opacity !== void 0 && K(e.opacity, ae.opacity) && (i.opacity = e.opacity, n.add("opacity")), e.rotation !== void 0 && K(e.rotation, ae.rotation) && (i.rotation = e.rotation, n.add("rotation")), e.blendMode !== void 0 && K(e.blendMode, ae.blendMode) && (i.blendMode = e.blendMode, n.add("blendMode")), e.effects !== void 0 && K(e.effects, ae.effects) && (i.effects = e.effects, n.add("effects")), e.fills !== void 0) {
    const f = await lt(
      e.fills,
      a.variableTable,
      a.collectionTable
    );
    K(f, ae.fills) && (i.fills = f), n.add("fills");
  }
  if (e.strokes !== void 0 && K(e.strokes, ae.strokes) && (i.strokes = e.strokes, n.add("strokes")), e.strokeWeight !== void 0 && K(e.strokeWeight, ae.strokeWeight) && (i.strokeWeight = e.strokeWeight, n.add("strokeWeight")), e.strokeAlign !== void 0 && K(e.strokeAlign, ae.strokeAlign) && (i.strokeAlign = e.strokeAlign, n.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const f = await Ce(
      e.boundVariables,
      a.variableTable,
      a.collectionTable
    );
    Object.keys(f).length > 0 && (i.boundVariables = f), n.add("boundVariables");
  }
  if (e.backgrounds !== void 0) {
    const f = await dt(
      e.backgrounds,
      a.variableTable,
      a.collectionTable
    );
    f && Array.isArray(f) && f.length > 0 && (i.backgrounds = f), n.add("backgrounds");
  }
  return i;
}
const Wt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseBaseNodeProperties: gt
}, Symbol.toStringTag, { value: "Module" }));
async function We(e, a) {
  const i = {}, n = /* @__PURE__ */ new Set();
  if (e.type === "COMPONENT")
    try {
      e.componentPropertyDefinitions && (i.componentPropertyDefinitions = e.componentPropertyDefinitions, n.add("componentPropertyDefinitions"));
    } catch (r) {
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
  parseFrameProperties: We
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
    const i = parseFloat(a[1]), n = parseInt(a[2]), r = i * Math.pow(10, n);
    return Math.abs(r) < 1e-10 ? "0" : r.toFixed(6).replace(/\.?0+$/, "") || "0";
  }
  return e;
}
function pt(e) {
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
    (i, n, r) => `${n} ${r}`
  ), a = a.replace(/\s+/g, " ").trim(), a;
}
function Ke(e) {
  return Array.isArray(e) ? e.map((a) => ({
    data: pt(a.data),
    // Normalize winding rule key (use windRule consistently)
    windRule: a.windRule || a.windingRule || "NONZERO"
  })) : e;
}
const Yt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  normalizeSvgPath: pt,
  normalizeVectorGeometry: Ke
}, Symbol.toStringTag, { value: "Module" }));
async function Zt(e, a) {
  const i = {}, n = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && K(e.fillGeometry, Ee.fillGeometry) && (i.fillGeometry = Ke(e.fillGeometry), n.add("fillGeometry")), e.strokeGeometry !== void 0 && K(e.strokeGeometry, Ee.strokeGeometry) && (i.strokeGeometry = Ke(e.strokeGeometry), n.add("strokeGeometry")), e.strokeCap !== void 0 && K(e.strokeCap, Ee.strokeCap) && (i.strokeCap = e.strokeCap, n.add("strokeCap")), e.strokeJoin !== void 0 && K(e.strokeJoin, Ee.strokeJoin) && (i.strokeJoin = e.strokeJoin, n.add("strokeJoin")), e.dashPattern !== void 0 && K(e.dashPattern, Ee.dashPattern) && (i.dashPattern = e.dashPattern, n.add("dashPattern")), i;
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
    const i = typeof a == "number" ? { timeoutMs: a } : a, n = (d = i == null ? void 0 : i.timeoutMs) != null ? d : 3e5, r = i == null ? void 0 : i.okLabel, c = i == null ? void 0 : i.cancelLabel, o = ta();
    return new Promise((p, f) => {
      const m = n === -1 ? null : setTimeout(() => {
        Le.delete(o), f(new Error(`Plugin prompt timeout: ${e}`));
      }, n);
      Le.set(o, {
        resolve: p,
        reject: f,
        timeout: m
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: q(q({
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
function He(e) {
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
  var r, c;
  const i = {}, n = /* @__PURE__ */ new Set();
  if (i._isInstance = !0, n.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const o = await e.getMainComponentAsync();
    if (!o) {
      const O = e.name || "(unnamed)", R = e.id;
      if (a.detachedComponentsHandled.has(R))
        await t.log(
          `Treating detached instance "${O}" as internal instance (already prompted)`
        );
      else {
        await t.warning(
          `Found detached instance: "${O}" (main component is missing)`
        );
        const S = `Found detached instance "${O}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await Ie.prompt(S, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), a.detachedComponentsHandled.add(R), await t.log(
            `Treating detached instance "${O}" as internal instance`
          );
        } catch (P) {
          if (P instanceof Error && P.message === "User cancelled") {
            const _ = `Export cancelled: Detached instance "${O}" found. Please fix the instance before exporting.`;
            await t.error(_);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch (z) {
              console.warn("Could not scroll to instance:", z);
            }
            throw new Error(_);
          } else
            throw P;
        }
      }
      if (!He(e).page) {
        const S = `Detached instance "${O}" is not on any page. Cannot export.`;
        throw await t.error(S), new Error(S);
      }
      let L, F;
      try {
        e.variantProperties && (L = e.variantProperties), e.componentProperties && (F = e.componentProperties);
      } catch (S) {
      }
      const I = q(q({
        instanceType: "internal",
        componentName: O,
        componentNodeId: e.id
      }, L && { variantProperties: L }), F && { componentProperties: F }), G = a.instanceTable.addInstance(I);
      return i._instanceRef = G, n.add("_instanceRef"), await t.log(
        `  Exported detached INSTANCE: "${O}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), i;
    }
    const d = e.name || "(unnamed)", p = o.name || "(unnamed)", f = o.remote === !0, h = He(e).page, s = He(o);
    let b = s.page;
    if (!b && f)
      try {
        await figma.loadAllPagesAsync();
        const O = figma.root.children;
        let R = null;
        for (const C of O)
          try {
            if (C.findOne(
              (L) => L.id === o.id
            )) {
              R = C;
              break;
            }
          } catch (k) {
          }
        if (!R) {
          const C = o.id.split(":")[0];
          for (const k of O) {
            const L = k.id.split(":")[0];
            if (C === L) {
              R = k;
              break;
            }
          }
        }
        R && (b = R);
      } catch (O) {
      }
    let l, E = b;
    if (f)
      if (b) {
        const O = it(b);
        l = "normal", E = b, O != null && O.id ? await t.log(
          `  Component "${p}" is from library but also exists on local page "${b.name}" with metadata. Treating as "normal" instance.`
        ) : await t.log(
          `  Component "${p}" is from library and exists on local page "${b.name}" (no metadata). Treating as "normal" instance - page should be published first.`
        );
      } else
        l = "remote", await t.log(
          `  Component "${p}" is from library and not on a local page. Treating as "remote" instance.`
        );
    else if (b && h && b.id === h.id)
      l = "internal";
    else if (b && h && b.id !== h.id)
      l = "normal";
    else if (b && !h)
      l = "normal";
    else if (!f && s.reason === "detached") {
      const O = o.id;
      if (a.detachedComponentsHandled.has(O))
        l = "remote", await t.log(
          `Treating detached instance "${d}" -> component "${p}" as remote instance (already prompted)`
        );
      else {
        await t.warning(
          `Found detached instance: "${d}" -> component "${p}" (component is not on any page)`
        );
        try {
          await figma.viewport.scrollAndZoomIntoView([o]);
        } catch (C) {
          console.warn("Could not scroll to component:", C);
        }
        const R = `Found detached instance "${d}" attached to component "${p}". This should be fixed. Continue to publish?`;
        try {
          await Ie.prompt(R, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), a.detachedComponentsHandled.add(O), l = "remote", await t.log(
            `Treating detached instance "${d}" as remote instance (will be created on REMOTES page)`
          );
        } catch (C) {
          if (C instanceof Error && C.message === "User cancelled") {
            const k = `Export cancelled: Detached instance "${d}" found. The component "${p}" is not on any page. Please fix the instance before exporting.`;
            throw await t.error(k), new Error(k);
          } else
            throw C;
        }
      }
    } else
      f || await t.warning(
        `  Instance "${d}" -> component "${p}": componentPage is null but component is not remote. Reason: ${s.reason}. Cannot determine instance type.`
      ), l = "normal";
    let g, u;
    try {
      if (e.variantProperties && (g = e.variantProperties, await t.log(
        `  Instance "${d}" -> variantProperties from instance: ${JSON.stringify(g)}`
      )), typeof e.getProperties == "function")
        try {
          const O = await e.getProperties();
          O && O.variantProperties && (await t.log(
            `  Instance "${d}" -> variantProperties from getProperties(): ${JSON.stringify(O.variantProperties)}`
          ), O.variantProperties && Object.keys(O.variantProperties).length > 0 && (g = O.variantProperties));
        } catch (O) {
          await t.log(
            `  Instance "${d}" -> getProperties() not available or failed: ${O}`
          );
        }
      if (e.componentProperties && (u = e.componentProperties), o.parent && o.parent.type === "COMPONENT_SET") {
        const O = o.parent;
        try {
          const R = O.componentPropertyDefinitions;
          R && await t.log(
            `  Component set "${O.name}" has property definitions: ${JSON.stringify(Object.keys(R))}`
          );
          const C = {}, k = p.split(",").map((L) => L.trim());
          for (const L of k) {
            const F = L.split("=").map((I) => I.trim());
            if (F.length >= 2) {
              const I = F[0], G = F.slice(1).join("=").trim();
              R && R[I] && (C[I] = G);
            }
          }
          if (Object.keys(C).length > 0 && await t.log(
            `  Parsed variant properties from component name "${p}": ${JSON.stringify(C)}`
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
              `  Main component "${p}" has variantProperties: ${JSON.stringify(L)}`
            ), g = L;
          }
        } catch (R) {
          await t.warning(
            `  Could not get variant properties from component set: ${R}`
          );
        }
      }
    } catch (O) {
    }
    let y, x;
    try {
      let O = o.parent;
      const R = [];
      let C = 0;
      const k = 20;
      for (; O && C < k; )
        try {
          const L = O.type, F = O.name;
          if (L === "COMPONENT_SET" && !x && (x = F), L === "PAGE")
            break;
          const I = F || "";
          R.unshift(I), (x === "arrow-top-right-on-square" || p === "arrow-top-right-on-square") && await t.log(
            `  [PATH BUILD] Added segment: "${I}" (type: ${L}) to path for component "${p}"`
          ), O = O.parent, C++;
        } catch (L) {
          (x === "arrow-top-right-on-square" || p === "arrow-top-right-on-square") && await t.warning(
            `  [PATH BUILD] Error building path for "${p}": ${L}`
          );
          break;
        }
      y = R, (x === "arrow-top-right-on-square" || p === "arrow-top-right-on-square") && await t.log(
        `  [PATH BUILD] Final path for component "${p}": [${R.join(" → ")}]`
      );
    } catch (O) {
    }
    const M = q(q(q(q({
      instanceType: l,
      componentName: p
    }, x && { componentSetName: x }), g && { variantProperties: g }), u && { componentProperties: u }), l === "normal" ? { path: y || [] } : y && y.length > 0 && {
      path: y
    });
    if (l === "internal") {
      M.componentNodeId = o.id, await t.log(
        `  Found INSTANCE: "${d}" -> INTERNAL component "${p}" (ID: ${o.id.substring(0, 8)}...)`
      );
      const O = e.boundVariables, R = o.boundVariables;
      if (O && typeof O == "object") {
        const I = Object.keys(O);
        await t.log(
          `  DEBUG: Internal instance "${d}" -> boundVariables keys: ${I.length > 0 ? I.join(", ") : "none"}`
        );
        for (const S of I) {
          const P = O[S], _ = (P == null ? void 0 : P.type) || typeof P;
          await t.log(
            `  DEBUG:   boundVariables.${S}: type=${_}, value=${JSON.stringify(P)}`
          );
        }
        const G = [
          "backgrounds",
          "selectionColor",
          "selectionColors",
          "selection",
          "selectColor"
        ];
        for (const S of G)
          O[S] !== void 0 && await t.log(
            `  DEBUG:   Found potential "Selection colors" property: boundVariables.${S} = ${JSON.stringify(O[S])}`
          );
      } else
        await t.log(
          `  DEBUG: Internal instance "${d}" -> No boundVariables found on instance node`
        );
      if (R && typeof R == "object") {
        const I = Object.keys(R);
        await t.log(
          `  DEBUG: Main component "${p}" -> boundVariables keys: ${I.length > 0 ? I.join(", ") : "none"}`
        );
      }
      const C = e.backgrounds;
      if (C && Array.isArray(C)) {
        await t.log(
          `  DEBUG: Internal instance "${d}" -> backgrounds array length: ${C.length}`
        );
        for (let I = 0; I < C.length; I++) {
          const G = C[I];
          if (G && typeof G == "object") {
            if (await t.log(
              `  DEBUG:   backgrounds[${I}] structure: ${JSON.stringify(Object.keys(G))}`
            ), G.boundVariables) {
              const S = Object.keys(G.boundVariables);
              await t.log(
                `  DEBUG:   backgrounds[${I}].boundVariables keys: ${S.length > 0 ? S.join(", ") : "none"}`
              );
              for (const P of S) {
                const _ = G.boundVariables[P];
                await t.log(
                  `  DEBUG:     backgrounds[${I}].boundVariables.${P}: ${JSON.stringify(_)}`
                );
              }
            }
            G.color && await t.log(
              `  DEBUG:   backgrounds[${I}].color: ${JSON.stringify(G.color)}`
            );
          }
        }
      }
      const k = Object.keys(e).filter(
        (I) => !I.startsWith("_") && I !== "parent" && I !== "removed" && typeof e[I] != "function" && I !== "type" && I !== "id" && I !== "name" && I !== "boundVariables" && I !== "backgrounds" && I !== "fills"
      ), L = Object.keys(o).filter(
        (I) => !I.startsWith("_") && I !== "parent" && I !== "removed" && typeof o[I] != "function" && I !== "type" && I !== "id" && I !== "name" && I !== "boundVariables" && I !== "backgrounds" && I !== "fills"
      ), F = [
        .../* @__PURE__ */ new Set([...k, ...L])
      ].filter(
        (I) => I.toLowerCase().includes("selection") || I.toLowerCase().includes("select") || I.toLowerCase().includes("color") && !I.toLowerCase().includes("fill") && !I.toLowerCase().includes("stroke")
      );
      if (F.length > 0) {
        await t.log(
          `  DEBUG: Found selection/color-related properties: ${F.join(", ")}`
        );
        for (const I of F)
          try {
            if (k.includes(I)) {
              const G = e[I];
              await t.log(
                `  DEBUG:   Instance.${I}: ${JSON.stringify(G)}`
              );
            }
            if (L.includes(I)) {
              const G = o[I];
              await t.log(
                `  DEBUG:   MainComponent.${I}: ${JSON.stringify(G)}`
              );
            }
          } catch (G) {
          }
      } else
        await t.log(
          "  DEBUG: No selection/color-related properties found on instance or main component"
        );
    } else if (l === "normal") {
      const O = E || b;
      if (O) {
        M.componentPageName = O.name;
        const C = it(O);
        C != null && C.id && C.version !== void 0 ? (M.componentGuid = C.id, M.componentVersion = C.version, await t.log(
          `  Found INSTANCE: "${d}" -> NORMAL component "${p}" (ID: ${o.id.substring(0, 8)}...) at path [${(y || []).join(" → ")}]`
        )) : await t.warning(
          `  Instance "${d}" -> component "${p}" is classified as normal but page "${O.name}" has no metadata. This instance will not be importable.`
        );
      } else {
        const C = o.id;
        let k = "", L = "";
        switch (s.reason) {
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
        } catch (G) {
          console.warn("Could not scroll to component:", G);
        }
        const F = `Normal instance "${d}" -> component "${p}" (ID: ${C}) has no componentPage. ${k}. ${L} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", F), await t.error(F);
        const I = new Error(F);
        throw console.error("Throwing error:", I), I;
      }
      y === void 0 && console.warn(
        `Failed to build path for normal instance "${d}" -> component "${p}". Path is required for resolution.`
      );
      const R = y && y.length > 0 ? ` at path [${y.join(" → ")}]` : " at page root";
      await t.log(
        `  Found INSTANCE: "${d}" -> NORMAL component "${p}" (ID: ${o.id.substring(0, 8)}...)${R}`
      );
    } else if (l === "remote") {
      let O, R;
      const C = a.detachedComponentsHandled.has(
        o.id
      );
      if (!C)
        try {
          if (typeof o.getPublishStatusAsync == "function")
            try {
              const L = await o.getPublishStatusAsync();
              L && typeof L == "object" && (L.libraryName && (O = L.libraryName), L.libraryKey && (R = L.libraryKey));
            } catch (L) {
            }
          try {
            const L = figma.teamLibrary;
            if (typeof (L == null ? void 0 : L.getAvailableLibraryComponentSetsAsync) == "function") {
              const F = await L.getAvailableLibraryComponentSetsAsync();
              if (F && Array.isArray(F)) {
                for (const I of F)
                  if (I.key === o.key || I.name === o.name) {
                    I.libraryName && (O = I.libraryName), I.libraryKey && (R = I.libraryKey);
                    break;
                  }
              }
            }
          } catch (L) {
          }
        } catch (L) {
          console.warn(
            `Error getting library info for remote component "${p}":`,
            L
          );
        }
      if (O && (M.remoteLibraryName = O), R && (M.remoteLibraryKey = R), C && (M.componentNodeId = o.id), a.instanceTable.getInstanceIndex(M) !== -1)
        await t.log(
          `  Found INSTANCE: "${d}" -> REMOTE component "${p}" (ID: ${o.id.substring(0, 8)}...)${C ? " [DETACHED]" : ""}`
        );
      else
        try {
          const { parseBaseNodeProperties: L } = await Promise.resolve().then(() => Wt), F = await L(e, a), { parseFrameProperties: I } = await Promise.resolve().then(() => Kt), G = await I(e, a), S = ce(q(q({}, F), G), {
            type: "COMPONENT"
            // Convert to COMPONENT type for recreation (must be after baseProps to override)
          });
          if (e.children && Array.isArray(e.children) && e.children.length > 0) {
            const P = ce(q({}, a), {
              depth: (a.depth || 0) + 1
            }), { extractNodeData: _ } = await Promise.resolve().then(() => ca), z = [];
            for (const W of e.children)
              try {
                let D;
                if (W.type === "INSTANCE")
                  try {
                    const H = await W.getMainComponentAsync();
                    if (H) {
                      const Y = await L(
                        W,
                        a
                      ), v = await I(
                        W,
                        a
                      ), B = await _(
                        H,
                        /* @__PURE__ */ new WeakSet(),
                        P
                      );
                      D = ce(q(q(q({}, B), Y), v), {
                        type: "COMPONENT"
                        // Convert to COMPONENT
                      });
                    } else
                      D = await _(
                        W,
                        /* @__PURE__ */ new WeakSet(),
                        P
                      ), D.type === "INSTANCE" && (D.type = "COMPONENT"), delete D._instanceRef;
                  } catch (H) {
                    D = await _(
                      W,
                      /* @__PURE__ */ new WeakSet(),
                      P
                    ), D.type === "INSTANCE" && (D.type = "COMPONENT"), delete D._instanceRef;
                  }
                else {
                  D = await _(
                    W,
                    /* @__PURE__ */ new WeakSet(),
                    P
                  );
                  const H = W.boundVariables;
                  if (H && typeof H == "object") {
                    const Y = Object.keys(H);
                    Y.length > 0 && (await t.log(
                      `  DEBUG: Child "${W.name || "Unnamed"}" -> boundVariables keys: ${Y.join(", ")}`
                    ), H.backgrounds !== void 0 && await t.log(
                      `  DEBUG:   Child "${W.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(H.backgrounds)}`
                    ));
                  }
                  if (o.children && Array.isArray(o.children)) {
                    const Y = o.children.find(
                      (v) => v.name === W.name
                    );
                    if (Y) {
                      const v = Y.boundVariables;
                      if (v && typeof v == "object") {
                        const B = Object.keys(v);
                        if (B.length > 0 && (await t.log(
                          `  DEBUG: Main component child "${Y.name || "Unnamed"}" -> boundVariables keys: ${B.join(", ")}`
                        ), v.backgrounds !== void 0 && (await t.log(
                          `  DEBUG:   Main component child "${Y.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(v.backgrounds)}`
                        ), !H || !H.backgrounds))) {
                          await t.log(
                            "  DEBUG:   Instance child doesn't have boundVariables.backgrounds, but main component child does - preserving from main component"
                          );
                          const { extractBoundVariables: w } = await Promise.resolve().then(() => Te), N = await w(
                            v,
                            a.variableTable,
                            a.collectionTable
                          );
                          D.boundVariables || (D.boundVariables = {}), N.backgrounds && (D.boundVariables.backgrounds = N.backgrounds, await t.log(
                            "  DEBUG:   ✓ Added boundVariables.backgrounds to childData from main component child"
                          ));
                        }
                      }
                    }
                  }
                }
                z.push(D);
              } catch (D) {
                console.warn(
                  `Failed to extract child "${W.name || "Unnamed"}" for remote component "${p}":`,
                  D
                );
              }
            S.children = z;
          }
          if (!S)
            throw new Error("Failed to build structure for remote instance");
          try {
            const P = e.boundVariables;
            if (P && typeof P == "object") {
              const $ = Object.keys(P);
              await t.log(
                `  DEBUG: Instance "${d}" -> boundVariables keys: ${$.length > 0 ? $.join(", ") : "none"}`
              );
              for (const A of $) {
                const T = P[A], j = (T == null ? void 0 : T.type) || typeof T;
                if (await t.log(
                  `  DEBUG:   boundVariables.${A}: type=${j}, value=${JSON.stringify(T)}`
                ), T && typeof T == "object" && !Array.isArray(T)) {
                  const J = Object.keys(T);
                  if (J.length > 0) {
                    await t.log(
                      `  DEBUG:     boundVariables.${A} has nested keys: ${J.join(", ")}`
                    );
                    for (const X of J) {
                      const ee = T[X];
                      ee && typeof ee == "object" && ee.type === "VARIABLE_ALIAS" && await t.log(
                        `  DEBUG:       boundVariables.${A}.${X}: VARIABLE_ALIAS id=${ee.id}`
                      );
                    }
                  }
                }
              }
              const V = [
                "backgrounds",
                "selectionColor",
                "selectionColors",
                "selection",
                "selectColor"
              ];
              for (const A of V)
                P[A] !== void 0 && await t.log(
                  `  DEBUG:   Found potential "Selection colors" property: boundVariables.${A} = ${JSON.stringify(P[A])}`
                );
            } else
              await t.log(
                `  DEBUG: Instance "${d}" -> No boundVariables found on instance node`
              );
            const _ = P && P.fills !== void 0 && P.fills !== null, z = S.fills !== void 0 && Array.isArray(S.fills) && S.fills.length > 0, W = e.fills !== void 0 && Array.isArray(e.fills) && e.fills.length > 0, D = o.fills !== void 0 && Array.isArray(o.fills) && o.fills.length > 0;
            if (await t.log(
              `  DEBUG: Instance "${d}" -> fills check: instanceHasFills=${W}, structureHasFills=${z}, mainComponentHasFills=${D}, hasInstanceFillsBoundVar=${!!_}`
            ), _ && !z) {
              await t.log(
                "  DEBUG: Instance has boundVariables.fills but structure has no fills - attempting to get fills"
              );
              try {
                if (W) {
                  const { serializeFills: $ } = await Promise.resolve().then(() => Te), V = await $(
                    e.fills,
                    a.variableTable,
                    a.collectionTable
                  );
                  S.fills = V, await t.log(
                    `  DEBUG: Got ${V.length} fill(s) from instance node`
                  );
                } else if (D) {
                  const { serializeFills: $ } = await Promise.resolve().then(() => Te), V = await $(
                    o.fills,
                    a.variableTable,
                    a.collectionTable
                  );
                  S.fills = V, await t.log(
                    `  DEBUG: Got ${V.length} fill(s) from main component`
                  );
                } else
                  await t.warning(
                    "  DEBUG: Instance has boundVariables.fills but neither instance nor main component has fills"
                  );
              } catch ($) {
                await t.warning(
                  `  Failed to get fills: ${$}`
                );
              }
            }
            const H = e.selectionColor, Y = o.selectionColor;
            H !== void 0 && await t.log(
              `  DEBUG: Instance "${d}" -> selectionColor: ${JSON.stringify(H)}`
            ), Y !== void 0 && await t.log(
              `  DEBUG: Main component "${p}" -> selectionColor: ${JSON.stringify(Y)}`
            );
            const v = Object.keys(e).filter(
              ($) => !$.startsWith("_") && $ !== "parent" && $ !== "removed" && typeof e[$] != "function" && $ !== "type" && $ !== "id" && $ !== "name"
            ), B = Object.keys(o).filter(
              ($) => !$.startsWith("_") && $ !== "parent" && $ !== "removed" && typeof o[$] != "function" && $ !== "type" && $ !== "id" && $ !== "name"
            ), w = [
              .../* @__PURE__ */ new Set([...v, ...B])
            ].filter(
              ($) => $.toLowerCase().includes("selection") || $.toLowerCase().includes("select") || $.toLowerCase().includes("color") && !$.toLowerCase().includes("fill") && !$.toLowerCase().includes("stroke")
            );
            if (w.length > 0) {
              await t.log(
                `  DEBUG: Found selection/color-related properties: ${w.join(", ")}`
              );
              for (const $ of w)
                try {
                  if (v.includes($)) {
                    const V = e[$];
                    await t.log(
                      `  DEBUG:   Instance.${$}: ${JSON.stringify(V)}`
                    );
                  }
                  if (B.includes($)) {
                    const V = o[$];
                    await t.log(
                      `  DEBUG:   MainComponent.${$}: ${JSON.stringify(V)}`
                    );
                  }
                } catch (V) {
                }
            } else
              await t.log(
                "  DEBUG: No selection/color-related properties found on instance or main component"
              );
            const N = o.boundVariables;
            if (N && typeof N == "object") {
              const $ = Object.keys(N);
              if ($.length > 0) {
                await t.log(
                  `  DEBUG: Main component "${p}" -> boundVariables keys: ${$.join(", ")}`
                );
                for (const V of $) {
                  const A = N[V], T = (A == null ? void 0 : A.type) || typeof A;
                  await t.log(
                    `  DEBUG:   Main component boundVariables.${V}: type=${T}, value=${JSON.stringify(A)}`
                  );
                }
              }
            }
            if (P && Object.keys(P).length > 0) {
              await t.log(
                `  DEBUG: Preserving instance's boundVariables in structure (${Object.keys(P).length} key(s))`
              );
              const { extractBoundVariables: $ } = await Promise.resolve().then(() => Te), V = await $(
                P,
                a.variableTable,
                a.collectionTable
              );
              S.boundVariables || (S.boundVariables = {});
              for (const [A, T] of Object.entries(
                V
              ))
                T !== void 0 && (S.boundVariables[A] !== void 0 && await t.log(
                  `  DEBUG: Structure already has boundVariables.${A} from baseProps, but instance also has it - using instance's boundVariables.${A}`
                ), S.boundVariables[A] = T, await t.log(
                  `  DEBUG: Set boundVariables.${A} in structure: ${JSON.stringify(T)}`
                ));
              V.fills !== void 0 ? await t.log(
                "  DEBUG: ✓ Preserved boundVariables.fills from instance"
              ) : _ && await t.warning(
                "  DEBUG: Instance has boundVariables.fills but extractBoundVariables didn't extract it"
              ), V.backgrounds !== void 0 ? await t.log(
                `  DEBUG: ✓ Preserved boundVariables.backgrounds from instance: ${JSON.stringify(V.backgrounds)}`
              ) : P && P.backgrounds !== void 0 && await t.warning(
                "  DEBUG: Instance has boundVariables.backgrounds but extractBoundVariables didn't extract it"
              );
            }
            if (N && Object.keys(N).length > 0) {
              await t.log(
                `  DEBUG: Checking main component's boundVariables for properties not in instance (${Object.keys(N).length} key(s))`
              );
              const { extractBoundVariables: $ } = await Promise.resolve().then(() => Te), V = await $(
                N,
                a.variableTable,
                a.collectionTable
              );
              S.boundVariables || (S.boundVariables = {});
              for (const [A, T] of Object.entries(
                V
              ))
                T !== void 0 && (S.boundVariables[A] === void 0 ? (S.boundVariables[A] = T, await t.log(
                  `  DEBUG: Added boundVariables.${A} from main component (not in instance): ${JSON.stringify(T)}`
                )) : await t.log(
                  `  DEBUG: Skipped boundVariables.${A} from main component (instance already has it)`
                ));
            }
            await t.log(
              `  DEBUG: Final structure for "${p}": hasFills=${!!S.fills}, fillsCount=${((r = S.fills) == null ? void 0 : r.length) || 0}, hasBoundVars=${!!S.boundVariables}, boundVarsKeys=${S.boundVariables ? Object.keys(S.boundVariables).join(", ") : "none"}`
            ), (c = S.boundVariables) != null && c.fills && await t.log(
              `  DEBUG: Structure boundVariables.fills: ${JSON.stringify(S.boundVariables.fills)}`
            );
          } catch (P) {
            await t.warning(
              `  Failed to handle bound variables for fills: ${P}`
            );
          }
          M.structure = S, C ? await t.log(
            `  Extracted structure for detached component "${p}" (ID: ${o.id.substring(0, 8)}...)`
          ) : await t.log(
            `  Extracted structure from instance for remote component "${p}" (preserving size overrides: ${e.width}x${e.height})`
          ), await t.log(
            `  Found INSTANCE: "${d}" -> REMOTE component "${p}" (ID: ${o.id.substring(0, 8)}...)${C ? " [DETACHED]" : ""}`
          );
        } catch (L) {
          const F = `Failed to extract structure for remote component "${p}": ${L instanceof Error ? L.message : String(L)}`;
          console.error(F, L), await t.error(F);
        }
    }
    const U = a.instanceTable.addInstance(M);
    i._instanceRef = U, n.add("_instanceRef");
  }
  return i;
}
class Re {
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
    const i = new Re(), n = Object.entries(a).sort(
      (r, c) => parseInt(r[0], 10) - parseInt(c[0], 10)
    );
    for (const [r, c] of n) {
      const o = parseInt(r, 10), d = i.generateKey(c);
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
const mt = {
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
  for (const [a, i] of Object.entries(mt))
    e[i] = a;
  return e;
}
function nt(e) {
  var a;
  return (a = mt[e]) != null ? a : e;
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
  libraryName: "libNm",
  // Different from remoteLibraryName (rLibN)
  constraintHorizontal: "cnsHr",
  // Constraint horizontal (5 chars)
  constraintVertical: "cnsVr"
  // Constraint vertical (5 chars)
}, qe = {};
for (const [e, a] of Object.entries(ft))
  qe[a] = e;
class ze {
  constructor() {
    ge(this, "shortToLong");
    ge(this, "longToShort");
    this.shortToLong = q({}, qe), this.longToShort = q({}, ft);
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
      for (const r of Object.keys(a))
        n.add(r);
      for (const [r, c] of Object.entries(a)) {
        const o = this.getShortName(r);
        if (o !== r && !n.has(o)) {
          let d = this.compressObject(c);
          o === "type" && typeof d == "string" && (d = nt(d)), i[o] = d;
        } else {
          let d = this.compressObject(c);
          r === "type" && typeof d == "string" && (d = nt(d)), i[r] = d;
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
      for (const [n, r] of Object.entries(a)) {
        const c = this.getLongName(n);
        let o = this.expandObject(r);
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
    const i = new ze();
    i.shortToLong = q(q({}, qe), a), i.longToShort = {};
    for (const [n, r] of Object.entries(
      i.shortToLong
    ))
      i.longToShort[r] = n;
    return i;
  }
}
function ra(e, a) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const i = {};
  e.metadata && (i.metadata = e.metadata);
  for (const [n, r] of Object.entries(e))
    n !== "metadata" && (i[n] = a.compressObject(r));
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
async function je(e, a = /* @__PURE__ */ new WeakSet(), i = {}) {
  var b, l, E, g, u, y, x;
  if (!e || typeof e != "object")
    return e;
  const n = (b = i.maxNodes) != null ? b : 1e4, r = (l = i.nodeCount) != null ? l : 0;
  if (r >= n)
    return await t.warning(
      `Maximum node count (${n}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${n}) reached`,
      _nodeCount: r
    };
  const c = {
    visited: (E = i.visited) != null ? E : /* @__PURE__ */ new WeakSet(),
    depth: (g = i.depth) != null ? g : 0,
    maxDepth: (u = i.maxDepth) != null ? u : 100,
    nodeCount: r + 1,
    maxNodes: n,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: i.variableTable,
    collectionTable: i.collectionTable,
    instanceTable: i.instanceTable,
    detachedComponentsHandled: (y = i.detachedComponentsHandled) != null ? y : /* @__PURE__ */ new Set(),
    exportedIds: (x = i.exportedIds) != null ? x : /* @__PURE__ */ new Map()
  };
  if (a.has(e))
    return "[Circular Reference]";
  a.add(e), c.visited = a;
  const o = {}, d = await gt(e, c);
  if (Object.assign(o, d), o.id && c.exportedIds) {
    const M = c.exportedIds.get(o.id);
    if (M !== void 0) {
      const U = o.name || "Unnamed";
      if (M !== U) {
        const O = `Duplicate ID detected during export: ID "${o.id.substring(0, 8)}..." is used by both "${M}" and "${U}". Each node must have a unique ID.`;
        throw await t.error(O), new Error(O);
      }
      await t.warning(
        `Node "${U}" (ID: ${o.id.substring(0, 8)}...) was encountered multiple times during export. This may indicate a structural issue.`
      );
    } else
      c.exportedIds.set(o.id, o.name || "Unnamed");
  }
  const p = e.type;
  if (p)
    switch (p) {
      case "FRAME":
      case "COMPONENT": {
        const M = await We(e);
        Object.assign(o, M);
        break;
      }
      case "INSTANCE": {
        const M = await ia(
          e,
          c
        );
        Object.assign(o, M);
        const U = await We(
          e
        );
        Object.assign(o, U);
        break;
      }
      case "TEXT": {
        const M = await qt(e);
        Object.assign(o, M);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const M = await Zt(e);
        Object.assign(o, M);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const M = await Qt(e);
        Object.assign(o, M);
        break;
      }
      default:
        c.unhandledKeys.add("_unknownType");
        break;
    }
  const f = Object.getOwnPropertyNames(e), m = /* @__PURE__ */ new Set([
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
  (p === "FRAME" || p === "COMPONENT" || p === "INSTANCE") && (m.add("layoutMode"), m.add("primaryAxisSizingMode"), m.add("counterAxisSizingMode"), m.add("primaryAxisAlignItems"), m.add("counterAxisAlignItems"), m.add("paddingLeft"), m.add("paddingRight"), m.add("paddingTop"), m.add("paddingBottom"), m.add("itemSpacing"), m.add("counterAxisSpacing"), m.add("cornerRadius"), m.add("clipsContent"), m.add("layoutWrap"), m.add("layoutGrow")), p === "TEXT" && (m.add("characters"), m.add("fontName"), m.add("fontSize"), m.add("textAlignHorizontal"), m.add("textAlignVertical"), m.add("letterSpacing"), m.add("lineHeight"), m.add("textCase"), m.add("textDecoration"), m.add("textAutoResize"), m.add("paragraphSpacing"), m.add("paragraphIndent"), m.add("listOptions")), (p === "VECTOR" || p === "LINE") && (m.add("fillGeometry"), m.add("strokeGeometry")), (p === "RECTANGLE" || p === "ELLIPSE" || p === "STAR" || p === "POLYGON") && (m.add("pointCount"), m.add("innerRadius"), m.add("arcData")), p === "INSTANCE" && (m.add("mainComponent"), m.add("componentProperties"));
  for (const M of f)
    typeof e[M] != "function" && (m.has(M) || c.unhandledKeys.add(M));
  c.unhandledKeys.size > 0 && (o._unhandledKeys = Array.from(c.unhandledKeys).sort());
  const h = o._instanceRef !== void 0 && c.instanceTable && p === "INSTANCE";
  let s = !1;
  if (h) {
    const M = c.instanceTable.getInstanceByIndex(
      o._instanceRef
    );
    M && M.instanceType === "normal" && (s = !0, await t.log(
      `  Skipping children extraction for normal instance "${o.name || "Unnamed"}" - will be resolved from referenced component`
    ));
  }
  if (!s && e.children && Array.isArray(e.children)) {
    const M = c.maxDepth;
    if (c.depth >= M)
      o.children = {
        _truncated: !0,
        _reason: `Maximum depth (${M}) reached`,
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
      const U = ce(q({}, c), {
        depth: c.depth + 1
      }), O = [];
      let R = !1;
      for (const C of e.children) {
        if (U.nodeCount >= n) {
          o.children = {
            _truncated: !0,
            _reason: `Maximum node count (${n}) reached during children processing`,
            _processed: O.length,
            _total: e.children.length,
            children: O
          }, R = !0;
          break;
        }
        const k = await je(C, a, U);
        O.push(k), U.nodeCount && (c.nodeCount = U.nodeCount);
      }
      R || (o.children = O);
    }
  }
  return o;
}
async function Ue(e, a = /* @__PURE__ */ new Set(), i = !1, n = /* @__PURE__ */ new Set()) {
  i || (await t.clear(), await t.log("=== Starting Page Export ==="));
  try {
    const r = e.pageIndex;
    if (r === void 0 || typeof r != "number")
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
    const c = figma.root.children;
    if (await t.log(`Loaded ${c.length} page(s)`), r < 0 || r >= c.length)
      return await t.error(
        `Invalid page index: ${r} (valid range: 0-${c.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const o = c[r], d = o.id;
    if (e.skipPrompts) {
      if (n.has(d))
        return await t.log(
          `Page "${o.name}" already discovered, skipping discovery...`
        ), {
          type: "exportPage",
          success: !0,
          error: !1,
          message: "Page already discovered",
          data: {
            filename: "",
            pageData: {},
            pageName: o.name,
            additionalPages: [],
            discoveredReferencedPages: []
          }
        };
      n.add(d);
    } else {
      if (a.has(d))
        return await t.log(
          `Page "${o.name}" has already been processed, skipping...`
        ), {
          type: "exportPage",
          success: !1,
          error: !0,
          message: "Page already processed",
          data: {}
        };
      a.add(d);
    }
    await t.log(
      `Selected page: "${o.name}" (index: ${r})`
    ), await t.log(
      "Initializing variable, collection, and instance tables..."
    );
    const p = new Me(), f = new Oe(), m = new Re();
    await t.log("Extracting node data from page..."), await t.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await t.log(
      "Collections will be discovered as variables are processed:"
    );
    const h = await je(
      o,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: p,
        collectionTable: f,
        instanceTable: m
      }
    );
    await t.log("Node extraction finished");
    const s = _e(h), b = p.getSize(), l = f.getSize(), E = m.getSize();
    await t.log("Extraction complete:"), await t.log(`  - Total nodes: ${s}`), await t.log(`  - Unique variables: ${b}`), await t.log(`  - Unique collections: ${l}`), await t.log(`  - Unique instances: ${E}`);
    const g = m.getSerializedTable(), u = /* @__PURE__ */ new Map();
    for (const [z, W] of Object.entries(g))
      if (W.instanceType === "remote") {
        const D = parseInt(z, 10);
        u.set(D, W);
      }
    if (u.size > 0) {
      await t.error(
        `Found ${u.size} remote instance(s) - remote instances are not supported during publishing`
      );
      const z = (Y, v, B = [], w = !1) => {
        const N = [];
        if (!Y || typeof Y != "object")
          return N;
        if (w || Y.type === "PAGE") {
          const T = Y.children || Y.child;
          if (Array.isArray(T))
            for (const j of T)
              j && typeof j == "object" && N.push(
                ...z(
                  j,
                  v,
                  [],
                  !1
                )
              );
          return N;
        }
        const $ = Y.name || "";
        if (typeof Y._instanceRef == "number" && Y._instanceRef === v) {
          const T = $ || "(unnamed)", j = B.length > 0 ? [...B, T] : [T];
          return N.push({
            path: j,
            nodeName: T
          }), N;
        }
        const V = $ ? [...B, $] : B, A = Y.children || Y.child;
        if (Array.isArray(A))
          for (const T of A)
            T && typeof T == "object" && N.push(
              ...z(
                T,
                v,
                V,
                !1
              )
            );
        return N;
      }, W = [];
      let D = 1;
      for (const [Y, v] of u.entries()) {
        const B = v.componentName || "(unnamed)", w = v.componentSetName, N = z(
          h,
          Y,
          [],
          !0
        );
        let $ = "";
        N.length > 0 ? $ = `
   Location(s): ${N.map((j) => {
          const J = j.path.length > 0 ? j.path.join(" → ") : "page root";
          return `"${j.nodeName}" at ${J}`;
        }).join(", ")}` : $ = `
   Location: (unable to determine - instance may be deeply nested)`;
        const V = w ? `Component: "${B}" (from component set "${w}")` : `Component: "${B}"`, A = v.remoteLibraryName ? `
   Library: ${v.remoteLibraryName}` : "";
        W.push(
          `${D}. ${V}${A}${$}`
        ), D++;
      }
      const H = `Cannot publish: Remote instances are not supported. Please remove all remote instances before publishing.

Found ${u.size} remote instance(s):
${W.join(`

`)}

To fix this:
1. Locate each remote instance component listed above using the path(s) shown
2. Replace it with a local component or remove it
3. Try publishing again`;
      throw await t.error(H), new Error(H);
    }
    if (l > 0) {
      await t.log("Collections found:");
      const z = f.getTable();
      for (const [W, D] of Object.values(z).entries()) {
        const H = D.collectionGuid ? ` (GUID: ${D.collectionGuid.substring(0, 8)}...)` : "";
        await t.log(
          `  ${W}: ${D.collectionName}${H} - ${D.modes.length} mode(s)`
        );
      }
    }
    await t.log("Checking for referenced component pages...");
    const y = [], x = [], M = Object.values(g).filter(
      (z) => z.instanceType === "normal"
    );
    if (M.length > 0) {
      await t.log(
        `Found ${M.length} normal instance(s) to check`
      );
      const z = /* @__PURE__ */ new Map();
      for (const W of M)
        if (W.componentPageName) {
          const D = c.find((H) => H.name === W.componentPageName);
          if (D && !a.has(D.id))
            z.has(D.id) || z.set(D.id, D);
          else if (!D) {
            const H = `Normal instance references component "${W.componentName || "(unnamed)"}" on page "${W.componentPageName}", but that page was not found. Cannot export.`;
            throw await t.error(H), new Error(H);
          }
        } else {
          const D = `Normal instance references component "${W.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw await t.error(D), new Error(D);
        }
      await t.log(
        `Found ${z.size} unique referenced page(s)`
      );
      for (const [W, D] of z.entries()) {
        const H = D.name;
        if (a.has(W)) {
          await t.log(`Skipping "${H}" - already processed`);
          continue;
        }
        const Y = D.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let v = !1;
        if (Y)
          try {
            const $ = JSON.parse(Y);
            v = !!($.id && $.version !== void 0);
          } catch ($) {
          }
        const B = c.findIndex(
          ($) => $.id === D.id
        );
        if (B === -1)
          throw await t.error(
            `Could not find page index for "${H}"`
          ), new Error(`Could not find page index for "${H}"`);
        const w = Array.from(M).find(
          ($) => $.componentPageName === H
        ), N = w == null ? void 0 : w.componentName;
        if (e.skipPrompts) {
          W === d ? await t.log(
            `Skipping "${H}" - this is the original page being published`
          ) : x.find(
            (V) => V.pageId === W
          ) || (x.push({
            pageId: W,
            pageName: H,
            pageIndex: B,
            hasMetadata: v,
            componentName: N
          }), await t.log(
            `Discovered referenced page: "${H}" (will be handled by wizard)`
          )), await t.log(
            `Checking dependencies of "${H}" for transitive dependencies...`
          );
          try {
            const $ = await Ue(
              {
                pageIndex: B,
                skipPrompts: !0
                // Keep skipPrompts true to just discover, not export
              },
              a,
              // Pass the same set (won't be used during discovery)
              !0,
              // Mark as recursive call
              n
              // Pass the same discoveredPages set to avoid infinite loops
            );
            if ($.success && $.data) {
              const V = $.data;
              if (V.discoveredReferencedPages)
                for (const A of V.discoveredReferencedPages) {
                  if (A.pageId === d) {
                    await t.log(
                      `  Skipping "${A.pageName}" - this is the original page being published`
                    );
                    continue;
                  }
                  x.find(
                    (j) => j.pageId === A.pageId
                  ) || (x.push(A), await t.log(
                    `  Discovered transitive dependency: "${A.pageName}" (from ${H})`
                  ));
                }
            }
          } catch ($) {
            await t.warning(
              `Could not discover dependencies of "${H}": ${$ instanceof Error ? $.message : String($)}`
            );
          }
        } else {
          const $ = `Do you want to also publish referenced component "${H}"?`;
          try {
            await Ie.prompt($, {
              okLabel: "Yes",
              cancelLabel: "No",
              timeoutMs: 3e5
              // 5 minutes
            }), await t.log(`Exporting referenced page: "${H}"`);
            const V = c.findIndex(
              (T) => T.id === D.id
            );
            if (V === -1)
              throw await t.error(
                `Could not find page index for "${H}"`
              ), new Error(`Could not find page index for "${H}"`);
            const A = await Ue(
              {
                pageIndex: V
              },
              a,
              // Pass the same set to track all processed pages
              !0,
              // Mark as recursive call
              n
              // Pass discovered pages set (empty during actual export)
            );
            if (A.success && A.data) {
              const T = A.data;
              y.push(T), await t.log(
                `Successfully exported referenced page: "${H}"`
              );
            } else
              throw new Error(
                `Failed to export referenced page "${H}": ${A.message}`
              );
          } catch (V) {
            if (V instanceof Error && V.message === "User cancelled")
              if (v)
                await t.log(
                  `User declined to publish "${H}", but page has existing metadata. Continuing with existing metadata.`
                );
              else
                throw await t.error(
                  `Export cancelled: Referenced page "${H}" has no metadata and user declined to publish it.`
                ), new Error(
                  `Cannot continue export: Referenced component "${H}" has no metadata. Please publish it first or choose to publish it now.`
                );
            else
              throw V;
          }
        }
      }
    }
    await t.log("Creating string table...");
    const U = new ze();
    await t.log("Getting page metadata...");
    const O = o.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let R = "", C = 0;
    if (O)
      try {
        const z = JSON.parse(O);
        R = z.id || "", C = z.version || 0;
      } catch (z) {
        await t.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!R) {
      await t.log("Generating new GUID for page..."), R = await Ye();
      const z = {
        _ver: 1,
        id: R,
        name: o.name,
        version: C,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      o.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(z)
      );
    }
    await t.log("Creating export data structure...");
    const k = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "1.0.0",
        figmaApiVersion: figma.apiVersion,
        guid: R,
        version: C,
        name: o.name,
        pluginVersion: "1.0.0"
      },
      stringTable: U.getSerializedTable(),
      collections: f.getSerializedTable(),
      variables: p.getSerializedTable(),
      instances: m.getSerializedTable(),
      pageData: h
    };
    await t.log("Compressing JSON data...");
    const L = ra(k, U);
    await t.log("Serializing to JSON...");
    const F = JSON.stringify(L, null, 2), I = (F.length / 1024).toFixed(2), S = Fe(o.name).trim().replace(/\s+/g, "_") + ".figma.json";
    await t.log(`JSON serialization complete: ${I} KB`), await t.log(`Export file: ${S}`), await t.log("=== Export Complete ===");
    const P = JSON.parse(F);
    return {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: S,
        pageData: P,
        pageName: o.name,
        additionalPages: y,
        // Populated with referenced component pages
        discoveredReferencedPages: x.length > 0 ? (
          // Filter out the original page - it shouldn't be in the discovered list since it's the one being published
          x.filter((z) => z.pageId !== d)
        ) : void 0
        // Only include if there are discovered pages
      }
    };
  } catch (r) {
    const c = r instanceof Error ? r.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", r), console.error("Error message:", c), await t.error(`Export failed: ${c}`), r instanceof Error && r.stack && (console.error("Stack trace:", r.stack), await t.error(`Stack trace: ${r.stack}`));
    const o = {
      type: "exportPage",
      success: !1,
      error: !0,
      message: c,
      data: {}
    };
    return console.error("Returning error response:", o), o;
  }
}
const ca = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  countTotalNodes: _e,
  exportPage: Ue,
  extractNodeData: je
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
      const r = i.name;
      e.renameMode(i.modeId, n), ut.set(`${e.id}:${r}`, n), await t.log(
        `  Renamed default mode "${r}" to "${n}"`
      );
    } catch (r) {
      await t.warning(
        `  Failed to rename default mode "${i.name}" to "${n}": ${r}`
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
      const r = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await t.error(r), new Error(r);
    }
    return e.id;
  } else {
    const i = e.getSharedPluginData(
      "recursica",
      ue
    );
    if (i && i.trim() !== "")
      return i;
    const n = await Ye();
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
  const i = e.collectionName.trim().toLowerCase(), n = ["token", "tokens", "theme", "themes"], r = e.isLocal;
  if (r === !1 || r === void 0 && n.includes(i))
    try {
      const d = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((p) => p.name.trim().toLowerCase() === i);
      if (d) {
        la(e.collectionName, !1);
        const p = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          d.key
        );
        if (p.length > 0) {
          const f = await figma.variables.importVariableByKeyAsync(p[0].key), m = await figma.variables.getVariableCollectionByIdAsync(
            f.variableCollectionId
          );
          if (m) {
            if (a = m, e.collectionGuid) {
              const h = a.getSharedPluginData(
                "recursica",
                ue
              );
              (!h || h.trim() === "") && a.setSharedPluginData(
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
      if (r === !1)
        throw new Error(
          `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
        );
      console.log("Could not import external collection, trying local:", o);
    }
  if (r !== !1) {
    const o = await figma.variables.getLocalVariableCollectionsAsync();
    let d;
    if (e.collectionGuid && (d = o.find((p) => p.getSharedPluginData("recursica", ue) === e.collectionGuid)), d || (d = o.find(
      (p) => p.name === e.collectionName
    )), d)
      if (a = d, e.collectionGuid) {
        const p = a.getSharedPluginData(
          "recursica",
          ue
        );
        (!p || p.trim() === "") && a.setSharedPluginData(
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
    const o = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), d = e.collectionName.trim().toLowerCase(), p = o.find((s) => s.name.trim().toLowerCase() === d);
    if (!p)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const f = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      p.key
    );
    if (f.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const m = await figma.variables.importVariableByKeyAsync(
      f[0].key
    ), h = await figma.variables.getVariableCollectionByIdAsync(
      m.variableCollectionId
    );
    if (!h)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (a = h, e.collectionGuid) {
      const s = a.getSharedPluginData(
        "recursica",
        ue
      );
      (!s || s.trim() === "") && a.setSharedPluginData(
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
async function ga(e, a, i, n, r) {
  await t.log(
    `Restoring values for variable "${e.name}" (type: ${e.resolvedType}):`
  ), await t.log(
    `  valuesByMode keys: ${Object.keys(a).join(", ")}`
  );
  for (const [c, o] of Object.entries(a)) {
    const d = ut.get(`${n.id}:${c}`) || c;
    let p = n.modes.find((m) => m.name === d);
    if (p || (p = n.modes.find((m) => m.name === c)), !p) {
      await t.warning(
        `Mode "${c}" (mapped: "${d}") not found in collection "${n.name}" for variable "${e.name}". Available modes: ${n.modes.map((m) => m.name).join(", ")}. Skipping.`
      );
      continue;
    }
    const f = p.modeId;
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
        const m = o, h = {
          r: m.r,
          g: m.g,
          b: m.b
        };
        m.a !== void 0 && (h.a = m.a), e.setValueForMode(f, h);
        const s = e.valuesByMode[f];
        if (await t.log(
          `  Set color value for "${e.name}" mode "${c}": r=${h.r.toFixed(3)}, g=${h.g.toFixed(3)}, b=${h.b.toFixed(3)}${h.a !== void 0 ? `, a=${h.a.toFixed(3)}` : ""}`
        ), await t.log(
          `  Read back value: ${JSON.stringify(s)}`
        ), typeof s == "object" && s !== null && "r" in s && "g" in s && "b" in s) {
          const b = s, l = Math.abs(b.r - h.r) < 1e-3, E = Math.abs(b.g - h.g) < 1e-3, g = Math.abs(b.b - h.b) < 1e-3;
          !l || !E || !g ? await t.warning(
            `  ⚠️ Value mismatch! Set: r=${h.r}, g=${h.g}, b=${h.b}, Read back: r=${b.r}, g=${b.g}, b=${b.b}`
          ) : await t.log(
            "  ✓ Value verified: read-back matches what we set"
          );
        } else
          await t.warning(
            `  ⚠️ Read-back value is not an RGB object: ${JSON.stringify(s)}`
          );
        continue;
      }
      if (typeof o == "object" && o !== null && "_varRef" in o && typeof o._varRef == "number") {
        const m = o;
        let h = null;
        const s = i.getVariableByIndex(
          m._varRef
        );
        if (s) {
          let b = null;
          if (r && s._colRef !== void 0) {
            const l = r.getCollectionByIndex(
              s._colRef
            );
            l && (b = (await da(l)).collection);
          }
          b && (h = await Ze(
            b,
            s.variableName
          ));
        }
        if (h) {
          const b = {
            type: "VARIABLE_ALIAS",
            id: h.id
          };
          e.setValueForMode(f, b);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${c}" in variable "${e.name}". Variable reference index: ${m._varRef}`
          );
      }
    } catch (m) {
      typeof o == "object" && o !== null && !("_varRef" in o) && !("r" in o && "g" in o && "b" in o) && await t.warning(
        `Unhandled value type for mode "${c}" in variable "${e.name}": ${JSON.stringify(o)}`
      ), console.warn(
        `Error setting value for mode "${c}" in variable "${e.name}":`,
        m
      );
    }
  }
}
async function Xe(e, a, i, n) {
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
  const r = figma.variables.createVariable(
    e.variableName,
    a,
    e.variableType
  );
  if (e.valuesByMode && await ga(
    r,
    e.valuesByMode,
    i,
    a,
    // Pass collection to look up modes by name
    n
  ), e.valuesByMode && r.valuesByMode) {
    await t.log(`  Verifying values for "${e.variableName}":`);
    for (const [c, o] of Object.entries(
      e.valuesByMode
    )) {
      const d = a.modes.find((p) => p.name === c);
      if (d) {
        const p = r.valuesByMode[d.modeId];
        await t.log(
          `    Mode "${c}": expected=${JSON.stringify(o)}, actual=${JSON.stringify(p)}`
        );
      }
    }
  }
  return r;
}
async function pa(e, a, i, n) {
  const r = a.getVariableByIndex(e);
  if (!r || r._colRef === void 0)
    return null;
  const c = n.get(String(r._colRef));
  if (!c)
    return null;
  const o = await Ze(
    c,
    r.variableName
  );
  if (o) {
    let d;
    if (typeof r.variableType == "number" ? d = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[r.variableType] || String(r.variableType) : d = r.variableType, ht(o, d))
      return o;
  }
  return await Xe(
    r,
    c,
    a,
    i
  );
}
async function ma(e, a, i, n) {
  if (!(!a || typeof a != "object"))
    try {
      const r = e[i];
      if (!r || !Array.isArray(r))
        return;
      const c = a[i];
      if (Array.isArray(c))
        for (let o = 0; o < c.length && o < r.length; o++) {
          const d = c[o];
          if (d && typeof d == "object") {
            if (r[o].boundVariables || (r[o].boundVariables = {}), $e(d)) {
              const p = d._varRef;
              if (p !== void 0) {
                const f = n.get(String(p));
                f && (r[o].boundVariables.color = {
                  type: "VARIABLE_ALIAS",
                  id: f.id
                });
              }
            } else
              for (const [p, f] of Object.entries(
                d
              ))
                if ($e(f)) {
                  const m = f._varRef;
                  if (m !== void 0) {
                    const h = n.get(String(m));
                    h && (r[o].boundVariables[p] = {
                      type: "VARIABLE_ALIAS",
                      id: h.id
                    });
                  }
                }
          }
        }
    } catch (r) {
      console.log(`Error restoring bound variables for ${i}:`, r);
    }
}
function fa(e, a, i = !1) {
  const n = Lt(a);
  if (e.visible === void 0 && (e.visible = n.visible), e.locked === void 0 && (e.locked = n.locked), e.opacity === void 0 && (e.opacity = n.opacity), e.rotation === void 0 && (e.rotation = n.rotation), e.blendMode === void 0 && (e.blendMode = n.blendMode), a === "FRAME" || a === "COMPONENT" || a === "INSTANCE") {
    const r = re;
    e.layoutMode === void 0 && (e.layoutMode = r.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = r.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = r.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = r.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = r.counterAxisAlignItems), i || (e.paddingLeft === void 0 && (e.paddingLeft = r.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = r.paddingRight), e.paddingTop === void 0 && (e.paddingTop = r.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = r.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = r.itemSpacing), e.counterAxisSpacing === void 0 && (e.counterAxisSpacing = r.counterAxisSpacing));
  }
  if (a === "TEXT") {
    const r = fe;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = r.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = r.textAlignVertical), e.textCase === void 0 && (e.textCase = r.textCase), e.textDecoration === void 0 && (e.textDecoration = r.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = r.textAutoResize);
  }
}
async function Pe(e, a, i = null, n = null, r = null, c = null, o = null, d = !1, p = null, f = null, m = null, h = null) {
  var R, C, k, L, F, I, G, S, P, _, z, W, D, H, Y;
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
        s = o.get(e.id), await t.log(
          `Reusing existing COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id.substring(0, 8)}...)`
        );
      else if (s = figma.createComponent(), await t.log(
        `Created COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id ? e.id.substring(0, 8) + "..." : "no ID"})`
      ), e.componentPropertyDefinitions) {
        const v = e.componentPropertyDefinitions;
        let B = 0, w = 0;
        for (const [N, $] of Object.entries(v))
          try {
            const V = $.type;
            let A = null;
            if (typeof V == "string" ? (V === "TEXT" || V === "BOOLEAN" || V === "INSTANCE_SWAP" || V === "VARIANT") && (A = V) : typeof V == "number" && (A = {
              2: "TEXT",
              // Text property
              25: "BOOLEAN",
              // Boolean property
              27: "INSTANCE_SWAP",
              // Instance swap property
              26: "VARIANT"
              // Variant property
            }[V] || null), !A) {
              await t.warning(
                `  Unknown property type ${V} (${typeof V}) for property "${N}" in component "${e.name || "Unnamed"}"`
              ), w++;
              continue;
            }
            const T = $.defaultValue, j = N.split("#")[0];
            s.addComponentProperty(
              j,
              A,
              T
            ), B++;
          } catch (V) {
            await t.warning(
              `  Failed to add component property "${N}" to "${e.name || "Unnamed"}": ${V}`
            ), w++;
          }
        B > 0 && await t.log(
          `  Added ${B} component property definition(s) to "${e.name || "Unnamed"}"${w > 0 ? ` (${w} failed)` : ""}`
        );
      }
      break;
    case "COMPONENT_SET": {
      const v = e.children ? e.children.filter((N) => N.type === "COMPONENT").length : 0;
      await t.log(
        `Creating COMPONENT_SET "${e.name || "Unnamed"}" by combining ${v} component variant(s)`
      );
      const B = [];
      let w = null;
      if (e.children && Array.isArray(e.children)) {
        w = figma.createFrame(), w.name = `_temp_${e.name || "COMPONENT_SET"}`, w.visible = !1, ((a == null ? void 0 : a.type) === "PAGE" ? a : figma.currentPage).appendChild(w);
        for (const $ of e.children)
          if ($.type === "COMPONENT" && !$._truncated)
            try {
              const V = await Pe(
                $,
                w,
                // Use temp parent for now
                i,
                n,
                r,
                c,
                o,
                d,
                p,
                f,
                // Pass deferredInstances through for component set creation
                null,
                // parentNodeData - not needed here, will be passed correctly in recursive calls
                h
              );
              V && V.type === "COMPONENT" && (B.push(V), await t.log(
                `  Created component variant: "${V.name || "Unnamed"}"`
              ));
            } catch (V) {
              await t.warning(
                `  Failed to create component variant "${$.name || "Unnamed"}": ${V}`
              );
            }
      }
      if (B.length > 0)
        try {
          const N = a || figma.currentPage, $ = figma.combineAsVariants(
            B,
            N
          );
          e.name && ($.name = e.name), e.x !== void 0 && ($.x = e.x), e.y !== void 0 && ($.y = e.y), w && w.parent && w.remove(), await t.log(
            `  ✓ Successfully created COMPONENT_SET "${$.name}" with ${B.length} variant(s)`
          ), s = $;
        } catch (N) {
          if (await t.warning(
            `  Failed to combine components into COMPONENT_SET "${e.name || "Unnamed"}": ${N}. Falling back to frame.`
          ), s = figma.createFrame(), e.name && (s.name = e.name), w && w.children.length > 0) {
            for (const $ of w.children)
              s.appendChild($);
            w.remove();
          }
        }
      else
        await t.warning(
          `  No valid component variants found for COMPONENT_SET "${e.name || "Unnamed"}". Creating frame instead.`
        ), s = figma.createFrame(), e.name && (s.name = e.name), w && w.remove();
      break;
    }
    case "INSTANCE":
      if (d)
        s = figma.createFrame(), e.name && (s.name = e.name);
      else if (e._instanceRef !== void 0 && r && o) {
        const v = r.getInstanceByIndex(
          e._instanceRef
        );
        if (v && v.instanceType === "internal")
          if (v.componentNodeId)
            if (v.componentNodeId === e.id)
              await t.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), s = figma.createFrame(), e.name && (s.name = e.name);
            else {
              const B = o.get(
                v.componentNodeId
              );
              if (!B) {
                const w = Array.from(o.keys()).slice(
                  0,
                  20
                );
                await t.error(
                  `Component not found for internal instance "${e.name}" (ID: ${v.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), await t.error(
                  `Looking for component ID: ${v.componentNodeId}`
                ), await t.error(
                  `Available IDs in mapping (first 20): ${w.map((T) => T.substring(0, 8) + "...").join(", ")}`
                );
                const N = (T, j) => {
                  if (T.type === "COMPONENT" && T.id === j)
                    return !0;
                  if (T.children && Array.isArray(T.children)) {
                    for (const J of T.children)
                      if (!J._truncated && N(J, j))
                        return !0;
                  }
                  return !1;
                }, $ = N(
                  e,
                  v.componentNodeId
                );
                await t.error(
                  `Component ID ${v.componentNodeId.substring(0, 8)}... exists in current node tree: ${$}`
                ), await t.error(
                  `WARNING: Component ID ${v.componentNodeId.substring(0, 8)}... not found in nodeIdMapping. This might indicate:`
                ), await t.error(
                  "  1. The component doesn't exist in the pageData (detached component?)"
                ), await t.error(
                  "  2. The component wasn't collected in the first pass"
                ), await t.error(
                  "  3. The component ID in the instance table doesn't match the actual component ID"
                );
                const V = w.filter(
                  (T) => T.startsWith(v.componentNodeId.substring(0, 8))
                );
                V.length > 0 && await t.error(
                  `Found IDs with matching prefix: ${V.map((T) => T.substring(0, 8) + "...").join(", ")}`
                );
                const A = `Component not found for internal instance "${e.name}" (ID: ${v.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${w.map((T) => T.substring(0, 8) + "...").join(", ")}`;
                throw new Error(A);
              }
              if (B && B.type === "COMPONENT") {
                if (s = B.createInstance(), await t.log(
                  `✓ Created internal instance "${e.name}" from component "${v.componentName}"`
                ), v.variantProperties && Object.keys(v.variantProperties).length > 0)
                  try {
                    let w = null;
                    if (B.parent && B.parent.type === "COMPONENT_SET")
                      w = B.parent.componentPropertyDefinitions, await t.log(
                        `  DEBUG: Component "${v.componentName}" is inside component set "${B.parent.name}" with ${Object.keys(w || {}).length} property definitions`
                      );
                    else {
                      const N = await s.getMainComponentAsync();
                      if (N) {
                        const $ = N.type;
                        await t.log(
                          `  DEBUG: Internal instance "${e.name}" - componentNode parent: ${B.parent ? B.parent.type : "N/A"}, mainComponent type: ${$}, mainComponent parent: ${N.parent ? N.parent.type : "N/A"}`
                        ), $ === "COMPONENT_SET" ? w = N.componentPropertyDefinitions : $ === "COMPONENT" && N.parent && N.parent.type === "COMPONENT_SET" ? (w = N.parent.componentPropertyDefinitions, await t.log(
                          `  DEBUG: Found component set parent "${N.parent.name}" with ${Object.keys(w || {}).length} property definitions`
                        )) : await t.log(
                          `  Skipping variant properties for internal instance "${e.name}" - component "${v.componentName}" is not yet in a COMPONENT_SET (will be moved later during component set creation)`
                        );
                      }
                    }
                    if (w) {
                      const N = {};
                      for (const [$, V] of Object.entries(
                        v.variantProperties
                      )) {
                        const A = $.split("#")[0];
                        w[A] && (N[A] = V);
                      }
                      Object.keys(N).length > 0 && s.setProperties(N);
                    }
                  } catch (w) {
                    const N = `Failed to set variant properties for instance "${e.name}": ${w}`;
                    throw await t.error(N), new Error(N);
                  }
                if (v.componentProperties && Object.keys(v.componentProperties).length > 0)
                  try {
                    const w = await s.getMainComponentAsync();
                    if (w) {
                      let N = null;
                      const $ = w.type;
                      if ($ === "COMPONENT_SET" ? N = w.componentPropertyDefinitions : $ === "COMPONENT" && w.parent && w.parent.type === "COMPONENT_SET" ? N = w.parent.componentPropertyDefinitions : $ === "COMPONENT" && (N = w.componentPropertyDefinitions), N)
                        for (const [V, A] of Object.entries(
                          v.componentProperties
                        )) {
                          const T = V.split("#")[0];
                          if (N[T])
                            try {
                              let j = A;
                              A && typeof A == "object" && "value" in A && (j = A.value), s.setProperties({
                                [T]: j
                              });
                            } catch (j) {
                              const J = `Failed to set component property "${T}" for internal instance "${e.name}": ${j}`;
                              throw await t.error(J), new Error(J);
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
              } else if (!s && B) {
                const w = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${v.componentNodeId.substring(0, 8)}...).`;
                throw await t.error(w), new Error(w);
              }
            }
          else {
            const B = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw await t.error(B), new Error(B);
          }
        else if (v && v.instanceType === "remote")
          if (p) {
            const B = p.get(
              e._instanceRef
            );
            if (B) {
              if (s = B.createInstance(), await t.log(
                `✓ Created remote instance "${e.name}" from component "${v.componentName}" on REMOTES page`
              ), v.variantProperties && Object.keys(v.variantProperties).length > 0)
                try {
                  const w = await s.getMainComponentAsync();
                  if (w) {
                    let N = null;
                    const $ = w.type;
                    if ($ === "COMPONENT_SET" ? N = w.componentPropertyDefinitions : $ === "COMPONENT" && w.parent && w.parent.type === "COMPONENT_SET" ? N = w.parent.componentPropertyDefinitions : await t.log(
                      `Skipping variant properties for remote instance "${e.name}" - main component is not a COMPONENT_SET or variant (expected for remote components)`
                    ), N) {
                      const V = {};
                      for (const [A, T] of Object.entries(
                        v.variantProperties
                      )) {
                        const j = A.split("#")[0];
                        N[j] && (V[j] = T);
                      }
                      Object.keys(V).length > 0 && s.setProperties(V);
                    }
                  } else
                    await t.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (w) {
                  const N = `Failed to set variant properties for remote instance "${e.name}": ${w}`;
                  throw await t.error(N), new Error(N);
                }
              if (v.componentProperties && Object.keys(v.componentProperties).length > 0)
                try {
                  const w = await s.getMainComponentAsync();
                  if (w) {
                    let N = null;
                    const $ = w.type;
                    if ($ === "COMPONENT_SET" ? N = w.componentPropertyDefinitions : $ === "COMPONENT" && w.parent && w.parent.type === "COMPONENT_SET" ? N = w.parent.componentPropertyDefinitions : $ === "COMPONENT" && (N = w.componentPropertyDefinitions), N)
                      for (const [V, A] of Object.entries(
                        v.componentProperties
                      )) {
                        const T = V.split("#")[0];
                        if (N[T])
                          try {
                            let j = A;
                            A && typeof A == "object" && "value" in A && (j = A.value), s.setProperties({
                              [T]: j
                            });
                          } catch (j) {
                            const J = `Failed to set component property "${T}" for remote instance "${e.name}": ${j}`;
                            throw await t.error(J), new Error(J);
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
                  s.resize(e.width, e.height);
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
            const B = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw await t.error(B), new Error(B);
          }
        else if ((v == null ? void 0 : v.instanceType) === "normal") {
          if (!v.componentPageName) {
            const A = `Normal instance "${e.name}" missing componentPageName. Cannot resolve.`;
            throw await t.error(A), new Error(A);
          }
          await figma.loadAllPagesAsync();
          const B = figma.root.children.find(
            (A) => A.name === v.componentPageName
          );
          if (!B) {
            await t.log(
              `  Deferring normal instance "${e.name}" - referenced page "${v.componentPageName}" does not exist yet (may be circular reference or not yet imported)`
            );
            const A = figma.createFrame();
            if (A.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (A.x = e.x), e.y !== void 0 && (A.y = e.y), e.width !== void 0 && e.height !== void 0 ? A.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && A.resize(e.w, e.h), f) {
              const T = {
                placeholderFrameId: A.id,
                instanceEntry: v,
                nodeData: e,
                parentNodeId: a.id,
                instanceIndex: e._instanceRef
              };
              f.push(T), await t.log(
                `  [DEBUG] Added deferred instance "${e.name}" to array (array length: ${f.length})`
              );
            } else
              await t.log(
                `  [DEBUG] deferredInstances array is null/undefined - cannot store deferred instance "${e.name}"`
              );
            s = A;
            break;
          }
          let w = null;
          const N = (A, T, j, J, X) => {
            if (T.length === 0) {
              let Z = null;
              for (const te of A.children || [])
                if (te.type === "COMPONENT") {
                  if (te.name === j)
                    if (Z || (Z = te), J)
                      try {
                        const ne = te.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (ne && JSON.parse(ne).id === J)
                          return te;
                      } catch (ne) {
                      }
                    else
                      return te;
                } else if (te.type === "COMPONENT_SET") {
                  if (X && te.name !== X)
                    continue;
                  for (const ne of te.children || [])
                    if (ne.type === "COMPONENT" && ne.name === j)
                      if (Z || (Z = ne), J)
                        try {
                          const Se = ne.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (Se && JSON.parse(Se).id === J)
                            return ne;
                        } catch (Se) {
                        }
                      else
                        return ne;
                }
              return Z;
            }
            const [ee, ...Q] = T;
            for (const Z of A.children || [])
              if (Z.name === ee) {
                if (Q.length === 0 && Z.type === "COMPONENT_SET") {
                  if (X && Z.name !== X)
                    continue;
                  for (const te of Z.children || [])
                    if (te.type === "COMPONENT" && te.name === j) {
                      if (J)
                        try {
                          const ne = te.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (ne && JSON.parse(ne).id === J)
                            return te;
                        } catch (ne) {
                        }
                      return te;
                    }
                  return null;
                }
                return N(
                  Z,
                  Q,
                  j,
                  J,
                  X
                );
              }
            return null;
          };
          await t.log(
            `  Looking for component "${v.componentName}" on page "${v.componentPageName}"${v.path && v.path.length > 0 ? ` at path [${v.path.join(" → ")}]` : " at page root"}${v.componentGuid ? ` (GUID: ${v.componentGuid.substring(0, 8)}...)` : ""}`
          );
          const $ = [], V = (A, T = 0) => {
            const j = "  ".repeat(T);
            if (A.type === "COMPONENT")
              $.push(`${j}COMPONENT: "${A.name}"`);
            else if (A.type === "COMPONENT_SET") {
              $.push(
                `${j}COMPONENT_SET: "${A.name}"`
              );
              for (const J of A.children || [])
                J.type === "COMPONENT" && $.push(
                  `${j}  └─ COMPONENT: "${J.name}"`
                );
            }
            for (const J of A.children || [])
              V(J, T + 1);
          };
          if (V(B), $.length > 0 ? await t.log(
            `  Available components on page "${v.componentPageName}":
${$.slice(0, 20).join(`
`)}${$.length > 20 ? `
  ... and ${$.length - 20} more` : ""}`
          ) : await t.warning(
            `  No components found on page "${v.componentPageName}"`
          ), w = N(
            B,
            v.path || [],
            v.componentName,
            v.componentGuid,
            v.componentSetName
          ), w && v.componentGuid)
            try {
              const A = w.getPluginData(
                "RecursicaPublishedMetadata"
              );
              if (A) {
                const T = JSON.parse(A);
                T.id !== v.componentGuid ? await t.warning(
                  `  Found component "${v.componentName}" by name but GUID verification failed (expected ${v.componentGuid.substring(0, 8)}..., got ${T.id ? T.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`
                ) : await t.log(
                  `  Found component "${v.componentName}" with matching GUID ${v.componentGuid.substring(0, 8)}...`
                );
              } else
                await t.warning(
                  `  Found component "${v.componentName}" by name but no metadata found. Using name match as fallback.`
                );
            } catch (A) {
              await t.warning(
                `  Found component "${v.componentName}" by name but GUID verification failed. Using name match as fallback.`
              );
            }
          if (!w) {
            await t.log(
              `  Deferring normal instance "${e.name}" - component "${v.componentName}" not found on page "${v.componentPageName}" (may not be created yet due to circular reference)`
            );
            const A = figma.createFrame();
            if (A.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (A.x = e.x), e.y !== void 0 && (A.y = e.y), e.width !== void 0 && e.height !== void 0 ? A.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && A.resize(e.w, e.h), f) {
              const T = {
                placeholderFrameId: A.id,
                instanceEntry: v,
                nodeData: e,
                parentNodeId: a.id,
                instanceIndex: e._instanceRef
              };
              f.push(T), await t.log(
                `  [DEBUG] Added deferred instance "${e.name}" to array (array length: ${f.length})`
              );
            } else
              await t.log(
                `  [DEBUG] deferredInstances array is null/undefined - cannot store deferred instance "${e.name}"`
              );
            s = A;
            break;
          }
          if (s = w.createInstance(), await t.log(
            `  Created normal instance "${e.name}" from component "${v.componentName}" on page "${v.componentPageName}"`
          ), v.variantProperties && Object.keys(v.variantProperties).length > 0)
            try {
              const A = await s.getMainComponentAsync();
              if (A) {
                let T = null;
                const j = A.type;
                if (j === "COMPONENT_SET" ? T = A.componentPropertyDefinitions : j === "COMPONENT" && A.parent && A.parent.type === "COMPONENT_SET" ? T = A.parent.componentPropertyDefinitions : await t.warning(
                  `Cannot set variant properties for normal instance "${e.name}" - main component is not a COMPONENT_SET or variant`
                ), T) {
                  const J = {};
                  for (const [X, ee] of Object.entries(
                    v.variantProperties
                  )) {
                    const Q = X.split("#")[0];
                    T[Q] && (J[Q] = ee);
                  }
                  Object.keys(J).length > 0 && s.setProperties(J);
                }
              }
            } catch (A) {
              await t.warning(
                `Failed to set variant properties for normal instance "${e.name}": ${A}`
              );
            }
          if (v.componentProperties && Object.keys(v.componentProperties).length > 0)
            try {
              const A = await s.getMainComponentAsync();
              if (A) {
                let T = null;
                const j = A.type;
                if (j === "COMPONENT_SET" ? T = A.componentPropertyDefinitions : j === "COMPONENT" && A.parent && A.parent.type === "COMPONENT_SET" ? T = A.parent.componentPropertyDefinitions : j === "COMPONENT" && (T = A.componentPropertyDefinitions), T) {
                  const J = {};
                  for (const [X, ee] of Object.entries(
                    v.componentProperties
                  )) {
                    const Q = X.split("#")[0];
                    let Z;
                    if (T[X] ? Z = X : T[Q] ? Z = Q : Z = Object.keys(T).find(
                      (te) => te.split("#")[0] === Q
                    ), Z) {
                      const te = ee && typeof ee == "object" && "value" in ee ? ee.value : ee;
                      J[Z] = te;
                    } else
                      await t.warning(
                        `Component property "${Q}" (from "${X}") does not exist on component "${v.componentName}" for normal instance "${e.name}". Available properties: ${Object.keys(T).join(", ") || "none"}`
                      );
                  }
                  if (Object.keys(J).length > 0)
                    try {
                      await t.log(
                        `  Attempting to set component properties for normal instance "${e.name}": ${Object.keys(J).join(", ")}`
                      ), await t.log(
                        `  Available component properties: ${Object.keys(T).join(", ")}`
                      ), s.setProperties(J), await t.log(
                        `  ✓ Successfully set component properties for normal instance "${e.name}": ${Object.keys(J).join(", ")}`
                      );
                    } catch (X) {
                      await t.warning(
                        `Failed to set component properties for normal instance "${e.name}": ${X}`
                      ), await t.warning(
                        `  Properties attempted: ${JSON.stringify(J)}`
                      ), await t.warning(
                        `  Available properties: ${JSON.stringify(Object.keys(T))}`
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
              s.resize(e.width, e.height);
            } catch (A) {
              await t.log(
                `Note: Could not resize normal instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
              );
            }
        } else {
          const B = `Instance "${e.name}" has unknown or missing instance type: ${(v == null ? void 0 : v.instanceType) || "unknown"}`;
          throw await t.error(B), new Error(B);
        }
      } else {
        const v = `Instance "${e.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        throw await t.error(v), new Error(v);
      }
      break;
    case "GROUP":
      s = figma.createFrame();
      break;
    case "BOOLEAN_OPERATION": {
      const v = `Boolean operation nodes cannot be imported. Found boolean operation: "${e.name}".`;
      throw await t.error(v), new Error(v);
    }
    case "POLYGON":
      s = figma.createPolygon();
      break;
    default: {
      const v = `Unsupported node type: ${e.type}. This node type cannot be imported.`;
      throw await t.error(v), new Error(v);
    }
  }
  if (!s)
    return null;
  e.id && o && (o.set(e.id, s), s.type === "COMPONENT" && await t.log(
    `  Stored COMPONENT "${e.name || "Unnamed"}" in nodeIdMapping (ID: ${e.id.substring(0, 8)}...)`
  )), e._instanceRef !== void 0 && s.type === "INSTANCE" ? (o._instanceTableMap || (o._instanceTableMap = /* @__PURE__ */ new Map()), o._instanceTableMap.set(
    s.id,
    e._instanceRef
  ), await t.log(
    `  Stored instance table mapping: instance "${s.name}" (ID: ${s.id.substring(0, 8)}...) -> instance table index ${e._instanceRef}`
  )) : s.type === "INSTANCE" && await t.log(
    `  WARNING: Instance "${s.name}" (ID: ${s.id.substring(0, 8)}...) has no _instanceRef in nodeData - will use fallback matching in third pass`
  );
  const b = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.paddingLeft || e.boundVariables.paddingRight || e.boundVariables.paddingTop || e.boundVariables.paddingBottom || e.boundVariables.itemSpacing);
  fa(
    s,
    e.type || "FRAME",
    b
  ), e.name !== void 0 && (s.name = e.name || "Unnamed Node");
  const l = m && m.layoutMode !== void 0 && m.layoutMode !== "NONE", E = a && "layoutMode" in a && a.layoutMode !== "NONE";
  l || E || (e.x !== void 0 && (s.x = e.x), e.y !== void 0 && (s.y = e.y));
  const u = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height), y = e.name || "Unnamed";
  if (e.preserveRatio !== void 0 && await t.log(
    `  [ISSUE #3 DEBUG] "${y}" has preserveRatio in nodeData: ${e.preserveRatio}`
  ), e.constraints !== void 0 && await t.log(
    `  [ISSUE #4 DEBUG] "${y}" has constraints in nodeData: ${JSON.stringify(e.constraints)}`
  ), (e.constraintHorizontal !== void 0 || e.constraintVertical !== void 0) && await t.log(
    `  [ISSUE #4 DEBUG] "${y}" has constraintHorizontal: ${e.constraintHorizontal}, constraintVertical: ${e.constraintVertical}`
  ), e.type !== "VECTOR" && e.width !== void 0 && e.height !== void 0 && !u) {
    const v = s.preserveRatio;
    v !== void 0 && await t.log(
      `  [ISSUE #3 DEBUG] "${y}" preserveRatio before resize: ${v}`
    ), s.resize(e.width, e.height);
    const B = s.preserveRatio;
    B !== void 0 ? await t.log(
      `  [ISSUE #3 DEBUG] "${y}" preserveRatio after resize: ${B}`
    ) : e.preserveRatio !== void 0 && await t.warning(
      `  ⚠️ ISSUE #3: "${y}" preserveRatio was in nodeData (${e.preserveRatio}) but not set on node!`
    );
    const w = s.constraints, N = s.constraintHorizontal, $ = s.constraintVertical;
    if (w !== void 0 && await t.log(
      `  [ISSUE #4 DEBUG] "${y}" constraints after resize: ${JSON.stringify(w)}`
    ), (N !== void 0 || $ !== void 0) && await t.log(
      `  [ISSUE #4 DEBUG] "${y}" constraintHorizontal: ${N}, constraintVertical: ${$}`
    ), e.constraintHorizontal !== void 0) {
      const T = e.constraintHorizontal;
      N !== T ? (await t.log(
        `  [ISSUE #4] Setting constraintHorizontal to ${T} for "${y}" (was ${N})`
      ), s.constraintHorizontal = T) : await t.log(
        `  [ISSUE #4] constraintHorizontal already correct (${T}) for "${y}"`
      );
    } else if (((R = e.constraints) == null ? void 0 : R.horizontal) !== void 0) {
      const T = e.constraints.horizontal;
      N !== T && (await t.log(
        `  [ISSUE #4] Setting constraintHorizontal to ${T} for "${y}" (was ${N}) from constraints object`
      ), s.constraintHorizontal = T);
    }
    if (e.constraintVertical !== void 0) {
      const T = e.constraintVertical;
      $ !== T ? (await t.log(
        `  [ISSUE #4] Setting constraintVertical to ${T} for "${y}" (was ${$})`
      ), s.constraintVertical = T) : await t.log(
        `  [ISSUE #4] constraintVertical already correct (${T}) for "${y}"`
      );
    } else if (((C = e.constraints) == null ? void 0 : C.vertical) !== void 0) {
      const T = e.constraints.vertical;
      $ !== T && (await t.log(
        `  [ISSUE #4] Setting constraintVertical to ${T} for "${y}" (was ${$}) from constraints object`
      ), s.constraintVertical = T);
    }
    const V = s.constraintHorizontal, A = s.constraintVertical;
    if (e.constraintHorizontal !== void 0 || e.constraintVertical !== void 0 || e.constraints !== void 0) {
      const T = e.constraintHorizontal || ((k = e.constraints) == null ? void 0 : k.horizontal), j = e.constraintVertical || ((L = e.constraints) == null ? void 0 : L.vertical);
      T !== void 0 && V !== T && await t.warning(
        `  ⚠️ ISSUE #4: "${y}" constraintHorizontal mismatch after setting! Expected: ${T}, Got: ${V}`
      ), j !== void 0 && A !== j && await t.warning(
        `  ⚠️ ISSUE #4: "${y}" constraintVertical mismatch after setting! Expected: ${j}, Got: ${A}`
      ), T !== void 0 && j !== void 0 && V === T && A === j && await t.log(
        `  ✓ ISSUE #4: "${y}" constraints set correctly: H=${V}, V=${A}`
      );
    }
  } else
    e.constraintHorizontal !== void 0 ? (await t.log(
      `  [ISSUE #4] Setting constraintHorizontal to ${e.constraintHorizontal} for "${y}" (no resize)`
    ), s.constraintHorizontal = e.constraintHorizontal) : ((F = e.constraints) == null ? void 0 : F.horizontal) !== void 0 && (await t.log(
      `  [ISSUE #4] Setting constraintHorizontal to ${e.constraints.horizontal} for "${y}" from constraints object (no resize)`
    ), s.constraintHorizontal = e.constraints.horizontal), e.constraintVertical !== void 0 ? (await t.log(
      `  [ISSUE #4] Setting constraintVertical to ${e.constraintVertical} for "${y}" (no resize)`
    ), s.constraintVertical = e.constraintVertical) : ((I = e.constraints) == null ? void 0 : I.vertical) !== void 0 && (await t.log(
      `  [ISSUE #4] Setting constraintVertical to ${e.constraints.vertical} for "${y}" from constraints object (no resize)`
    ), s.constraintVertical = e.constraints.vertical);
  const x = e.boundVariables && typeof e.boundVariables == "object";
  if (e.visible !== void 0 && (s.visible = e.visible), e.locked !== void 0 && (s.locked = e.locked), e.opacity !== void 0 && (!x || !e.boundVariables.opacity) && (s.opacity = e.opacity), e.rotation !== void 0 && (!x || !e.boundVariables.rotation) && (s.rotation = e.rotation), e.blendMode !== void 0 && (!x || !e.boundVariables.blendMode) && (s.blendMode = e.blendMode), e.type !== "INSTANCE") {
    if (e.type === "VECTOR" && e.boundVariables && (await t.log(
      `  DEBUG: VECTOR "${e.name || "Unnamed"}" (ID: ${((G = e.id) == null ? void 0 : G.substring(0, 8)) || "unknown"}...) has boundVariables: ${Object.keys(e.boundVariables).join(", ")}`
    ), e.boundVariables.fills && await t.log(
      `  DEBUG:   boundVariables.fills: ${JSON.stringify(e.boundVariables.fills)}`
    )), e.fills !== void 0)
      try {
        let v = e.fills;
        const B = e.name || "Unnamed";
        if (Array.isArray(v))
          for (let w = 0; w < v.length; w++) {
            const N = v[w];
            N && typeof N == "object" && N.selectionColor !== void 0 && await t.log(
              `  [ISSUE #2 DEBUG] "${B}" fill[${w}] has selectionColor: ${JSON.stringify(N.selectionColor)}`
            );
          }
        if (Array.isArray(v)) {
          const w = e.name || "Unnamed";
          for (let N = 0; N < v.length; N++) {
            const $ = v[N];
            $ && typeof $ == "object" && $.selectionColor !== void 0 && await t.warning(
              `  ⚠️ ISSUE #2: "${w}" fill[${N}] has selectionColor that will be preserved: ${JSON.stringify($.selectionColor)}`
            );
          }
          v = v.map((N) => {
            if (N && typeof N == "object") {
              const $ = q({}, N);
              return delete $.boundVariables, $;
            }
            return N;
          });
        }
        if (e.fills && Array.isArray(e.fills) && c) {
          if (e.type === "VECTOR") {
            await t.log(
              `  DEBUG: VECTOR "${e.name || "Unnamed"}" has ${e.fills.length} fill(s)`
            );
            for (let V = 0; V < e.fills.length; V++) {
              const A = e.fills[V];
              if (A && typeof A == "object") {
                const T = A.boundVariables || A.bndVar;
                T ? await t.log(
                  `  DEBUG:   fill[${V}] has boundVariables: ${JSON.stringify(T)}`
                ) : await t.log(
                  `  DEBUG:   fill[${V}] has no boundVariables`
                );
              }
            }
          }
          const w = [];
          for (let V = 0; V < v.length; V++) {
            const A = v[V], T = e.fills[V];
            if (!T || typeof T != "object") {
              w.push(A);
              continue;
            }
            const j = T.boundVariables || T.bndVar;
            if (!j) {
              w.push(A);
              continue;
            }
            const J = q({}, A);
            J.boundVariables = {};
            for (const [X, ee] of Object.entries(j))
              if (e.type === "VECTOR" && await t.log(
                `  DEBUG: Processing fill[${V}].${X} on VECTOR "${s.name || "Unnamed"}": varInfo=${JSON.stringify(ee)}`
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
                    const ne = c.has(String(Q));
                    if (await t.log(
                      `  DEBUG: Variable reference ${Q} ${ne ? "found" : "NOT FOUND"} in recognizedVariables`
                    ), !ne) {
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
                    `  DEBUG: Variable ${Q} not in recognizedVariables. variableTable=${!!i}, collectionTable=${!!n}, recognizedCollections=${!!h}`
                  ), i && n && h ? (await t.log(
                    `  Variable reference ${Q} not in recognizedVariables, attempting to resolve from variable table...`
                  ), Z = await pa(
                    Q,
                    i,
                    n,
                    h
                  ) || void 0, Z ? (c.set(String(Q), Z), await t.log(
                    `  ✓ Resolved variable ${Z.name} from variable table and added to recognizedVariables`
                  )) : await t.warning(
                    `  Failed to resolve variable ${Q} from variable table`
                  )) : e.type === "VECTOR" && await t.warning(
                    `  Cannot resolve variable ${Q} from table - missing required parameters`
                  )), Z ? (J.boundVariables[X] = {
                    type: "VARIABLE_ALIAS",
                    id: Z.id
                  }, await t.log(
                    `  ✓ Restored bound variable for fill[${V}].${X} on "${s.name || "Unnamed"}" (${e.type}): variable ${Z.name} (ID: ${Z.id.substring(0, 8)}...)`
                  )) : await t.warning(
                    `  Variable reference ${Q} not found in recognizedVariables for fill[${V}].${X} on "${s.name || "Unnamed"}"`
                  );
                } else
                  e.type === "VECTOR" && await t.warning(
                    `  DEBUG: Variable reference ${Q} is undefined for fill[${V}].${X} on VECTOR "${s.name || "Unnamed"}"`
                  );
              } else
                e.type === "VECTOR" && await t.warning(
                  `  DEBUG: fill[${V}].${X} on VECTOR "${s.name || "Unnamed"}" is not a variable reference: ${JSON.stringify(ee)}`
                );
            w.push(J);
          }
          s.fills = w, await t.log(
            `  ✓ Set fills with boundVariables on "${s.name || "Unnamed"}" (${e.type})`
          );
          const N = s.fills, $ = e.name || "Unnamed";
          if (Array.isArray(N))
            for (let V = 0; V < N.length; V++) {
              const A = N[V];
              A && typeof A == "object" && A.selectionColor !== void 0 && await t.warning(
                `  ⚠️ ISSUE #2: "${$}" fill[${V}] has selectionColor AFTER setting with boundVariables: ${JSON.stringify(A.selectionColor)}`
              );
            }
        } else {
          s.fills = v;
          const w = s.fills, N = e.name || "Unnamed";
          if (Array.isArray(w))
            for (let $ = 0; $ < w.length; $++) {
              const V = w[$];
              V && typeof V == "object" && V.selectionColor !== void 0 && await t.warning(
                `  ⚠️ ISSUE #2: "${N}" fill[${$}] has selectionColor AFTER setting: ${JSON.stringify(V.selectionColor)}`
              );
            }
        }
        e.boundVariables && Object.keys(e.boundVariables).length > 0 && !e.boundVariables.fills && await t.log(
          `  Node "${s.name || "Unnamed"}" (${e.type}) has boundVariables but not for fills: ${Object.keys(e.boundVariables).join(", ")}`
        );
      } catch (v) {
        console.log("Error setting fills:", v);
      }
    else if (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "GROUP")
      try {
        s.fills = [];
      } catch (v) {
        console.log("Error clearing fills:", v);
      }
  }
  if (e.strokes !== void 0)
    try {
      e.strokes.length > 0 ? s.strokes = e.strokes : s.strokes = [];
    } catch (v) {
      console.log("Error setting strokes:", v);
    }
  else if (e.type === "VECTOR")
    try {
      s.strokes = [];
    } catch (v) {
    }
  const M = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.strokeWeight || e.boundVariables.strokeAlign);
  e.strokeWeight !== void 0 ? (!M || !e.boundVariables.strokeWeight) && (s.strokeWeight = e.strokeWeight) : e.type === "VECTOR" && (e.strokes === void 0 || e.strokes.length === 0) && (!M || !e.boundVariables.strokeWeight) && (s.strokeWeight = 0), e.strokeAlign !== void 0 && (!M || !e.boundVariables.strokeAlign) && (s.strokeAlign = e.strokeAlign);
  const U = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.cornerRadius || e.boundVariables.topLeftRadius || e.boundVariables.topRightRadius || e.boundVariables.bottomLeftRadius || e.boundVariables.bottomRightRadius);
  if (e.cornerRadius !== void 0 && (!U || !e.boundVariables.cornerRadius) && (s.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (s.effects = e.effects), e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") {
    if (e.layoutMode !== void 0 && (["NONE", "HORIZONTAL", "VERTICAL"].includes(e.layoutMode) ? s.layoutMode = e.layoutMode : await t.warning(
      `Invalid layoutMode value "${e.layoutMode}" for node "${e.name || "Unnamed"}", skipping layoutMode setting`
    )), e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.boundVariables && c) {
      const B = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ];
      for (const w of B) {
        const N = e.boundVariables[w];
        if (N && $e(N)) {
          const $ = N._varRef;
          if ($ !== void 0) {
            const V = c.get(String($));
            if (V) {
              const A = {
                type: "VARIABLE_ALIAS",
                id: V.id
              };
              s.boundVariables || (s.boundVariables = {});
              const T = s[w], j = (S = s.boundVariables) == null ? void 0 : S[w];
              await t.log(
                `  DEBUG: Attempting to set bound variable for ${w} on "${e.name || "Unnamed"}": current value=${T}, current boundVar=${JSON.stringify(j)}`
              );
              try {
                s.setBoundVariable(w, null);
              } catch (X) {
              }
              try {
                s.setBoundVariable(w, V);
                const X = (P = s.boundVariables) == null ? void 0 : P[w];
                await t.log(
                  `  DEBUG: Immediately after setting ${w} bound variable: ${JSON.stringify(X)}`
                );
              } catch (X) {
                await t.warning(
                  `  Error setting bound variable for ${w}: ${X instanceof Error ? X.message : String(X)}`
                );
              }
              const J = (_ = s.boundVariables) == null ? void 0 : _[w];
              if (w === "itemSpacing") {
                const X = s[w], ee = (z = s.boundVariables) == null ? void 0 : z[w];
                await t.log(
                  `  [ISSUE #1 DEBUG] itemSpacing variable binding for "${e.name || "Unnamed"}":`
                ), await t.log(
                  `    - Expected variable ref: ${$}`
                ), await t.log(
                  `    - Final itemSpacing value: ${X}`
                ), await t.log(
                  `    - Final boundVariable: ${JSON.stringify(ee)}`
                ), await t.log(
                  `    - Variable found: ${V ? `Yes (ID: ${V.id})` : "No"}`
                ), !J || !J.id ? await t.warning(
                  "    ⚠️ ISSUE #1: itemSpacing variable binding FAILED - boundVariable not set correctly!"
                ) : await t.log(
                  "    ✓ itemSpacing variable binding SUCCESS"
                );
              }
              J && typeof J == "object" && J.type === "VARIABLE_ALIAS" && J.id === V.id ? await t.log(
                `  ✓ Set bound variable for ${w} on "${e.name || "Unnamed"}" (${e.type}): variable ${V.name} (ID: ${V.id.substring(0, 8)}...)`
              ) : await t.warning(
                `  Failed to set bound variable for ${w} on "${e.name || "Unnamed"}" - verification failed. Expected: ${JSON.stringify(A)}, Got: ${JSON.stringify(J)}`
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
    ), s.itemSpacing = e.itemSpacing, await t.log(
      `  ✓ Set itemSpacing to ${s.itemSpacing} (verified)`
    )) : (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && await t.log(
      `  DEBUG: Not setting itemSpacing for "${e.name || "Unnamed"}": layoutMode=${e.layoutMode}, itemSpacing=${e.itemSpacing}`
    ), e.layoutWrap !== void 0 && (s.layoutWrap = e.layoutWrap), e.primaryAxisSizingMode !== void 0 ? s.primaryAxisSizingMode = e.primaryAxisSizingMode : s.primaryAxisSizingMode = "AUTO", e.counterAxisSizingMode !== void 0 ? s.counterAxisSizingMode = e.counterAxisSizingMode : s.counterAxisSizingMode = "AUTO", e.primaryAxisAlignItems !== void 0 && (s.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (s.counterAxisAlignItems = e.counterAxisAlignItems);
    const v = e.boundVariables && typeof e.boundVariables == "object";
    if (v) {
      const B = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ].filter((w) => e.boundVariables[w]);
      B.length > 0 && await t.log(
        `  DEBUG: Node "${e.name || "Unnamed"}" (${e.type}) has bound variables for: ${B.join(", ")}`
      );
    }
    if (e.paddingLeft !== void 0 && (!v || !e.boundVariables.paddingLeft) && (s.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (!v || !e.boundVariables.paddingRight) && (s.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (!v || !e.boundVariables.paddingTop) && (s.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (!v || !e.boundVariables.paddingBottom) && (s.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && s.layoutMode !== void 0 && s.layoutMode !== "NONE") {
      const B = ((W = s.boundVariables) == null ? void 0 : W.itemSpacing) !== void 0;
      !B && (!v || !e.boundVariables.itemSpacing) ? s.itemSpacing !== e.itemSpacing && (await t.log(
        `  Setting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (late setting)`
      ), s.itemSpacing = e.itemSpacing) : B && await t.log(
        `  Skipping late setting of itemSpacing for "${e.name || "Unnamed"}" - already bound to variable`
      );
    }
    e.counterAxisSpacing !== void 0 && (!v || !e.boundVariables.counterAxisSpacing) && s.layoutMode !== void 0 && s.layoutMode !== "NONE" && (s.counterAxisSpacing = e.counterAxisSpacing), e.layoutGrow !== void 0 && (s.layoutGrow = e.layoutGrow);
  }
  if ((e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (s.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (s.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (s.dashPattern = e.dashPattern), e.type === "VECTOR")) {
    if (e.fillGeometry !== void 0)
      try {
        const { normalizeSvgPath: B } = await Promise.resolve().then(() => Yt), w = e.fillGeometry.map((N) => {
          const $ = N.data;
          return {
            data: B($),
            windingRule: N.windingRule || N.windRule || "NONZERO"
          };
        });
        for (let N = 0; N < e.fillGeometry.length; N++) {
          const $ = e.fillGeometry[N].data, V = w[N].data;
          $ !== V && await t.log(
            `  Normalized path ${N + 1} for "${e.name || "Unnamed"}": ${$.substring(0, 50)}... -> ${V.substring(0, 50)}...`
          );
        }
        s.vectorPaths = w, await t.log(
          `  Set vectorPaths for VECTOR "${e.name || "Unnamed"}" (${w.length} path(s))`
        );
      } catch (B) {
        await t.warning(
          `Error setting vectorPaths for VECTOR "${e.name || "Unnamed"}": ${B}`
        );
      }
    if (e.strokeGeometry !== void 0)
      try {
        s.strokeGeometry = e.strokeGeometry;
      } catch (B) {
        await t.warning(
          `Error setting strokeGeometry for VECTOR "${e.name || "Unnamed"}": ${B}`
        );
      }
    const v = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
    if (e.width !== void 0 && e.height !== void 0 && !v)
      try {
        s.resize(e.width, e.height), await t.log(
          `  Set size for VECTOR "${e.name || "Unnamed"}" to ${e.width}x${e.height}`
        );
      } catch (B) {
        await t.warning(
          `Error setting size for VECTOR "${e.name || "Unnamed"}": ${B}`
        );
      }
  }
  if (e.type === "TEXT" && e.characters !== void 0)
    try {
      if (e.fontName)
        try {
          await figma.loadFontAsync(e.fontName), s.fontName = e.fontName;
        } catch (B) {
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
      const v = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.fontSize || e.boundVariables.letterSpacing || e.boundVariables.lineHeight);
      e.fontSize !== void 0 && (!v || !e.boundVariables.fontSize) && (s.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (s.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (s.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (!v || !e.boundVariables.letterSpacing) && (s.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (!v || !e.boundVariables.lineHeight) && (s.lineHeight = e.lineHeight), e.textCase !== void 0 && (s.textCase = e.textCase), e.textDecoration !== void 0 && (s.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (s.textAutoResize = e.textAutoResize);
    } catch (v) {
      console.log("Error setting text properties: " + v);
      try {
        s.characters = e.characters;
      } catch (B) {
        console.log("Could not set text characters: " + B);
      }
    }
  if (e.boundVariables && c) {
    const v = [
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "paddingBottom",
      "itemSpacing"
    ];
    for (const [B, w] of Object.entries(
      e.boundVariables
    ))
      if (B !== "fills" && !v.includes(B) && $e(w) && i && c) {
        const N = w._varRef;
        if (N !== void 0) {
          const $ = c.get(String(N));
          if ($)
            try {
              const V = {
                type: "VARIABLE_ALIAS",
                id: $.id
              };
              s.boundVariables || (s.boundVariables = {});
              const A = s[B];
              A !== void 0 && s.boundVariables[B] === void 0 && await t.warning(
                `  Property ${B} has direct value ${A} which may prevent bound variable from being set`
              ), s.boundVariables[B] = V;
              const j = (D = s.boundVariables) == null ? void 0 : D[B];
              if (j && typeof j == "object" && j.type === "VARIABLE_ALIAS" && j.id === $.id)
                await t.log(
                  `  ✓ Set bound variable for ${B} on "${e.name || "Unnamed"}" (${e.type}): variable ${$.name} (ID: ${$.id.substring(0, 8)}...)`
                );
              else {
                const J = (H = s.boundVariables) == null ? void 0 : H[B];
                await t.warning(
                  `  Failed to set bound variable for ${B} on "${e.name || "Unnamed"}" - bound variable not persisted. Property value: ${A}, Expected: ${JSON.stringify(V)}, Got: ${JSON.stringify(J)}`
                );
              }
            } catch (V) {
              await t.warning(
                `  Error setting bound variable for ${B} on "${e.name || "Unnamed"}": ${V}`
              );
            }
          else
            await t.warning(
              `  Variable reference ${N} not found in recognizedVariables for ${B} on "${e.name || "Unnamed"}"`
            );
        }
      }
  }
  if (e.boundVariables && c && (e.boundVariables.width || e.boundVariables.height)) {
    const v = e.boundVariables.width, B = e.boundVariables.height;
    if (v && $e(v)) {
      const w = v._varRef;
      if (w !== void 0) {
        const N = c.get(String(w));
        if (N) {
          const $ = {
            type: "VARIABLE_ALIAS",
            id: N.id
          };
          s.boundVariables || (s.boundVariables = {}), s.boundVariables.width = $;
        }
      }
    }
    if (B && $e(B)) {
      const w = B._varRef;
      if (w !== void 0) {
        const N = c.get(String(w));
        if (N) {
          const $ = {
            type: "VARIABLE_ALIAS",
            id: N.id
          };
          s.boundVariables || (s.boundVariables = {}), s.boundVariables.height = $;
        }
      }
    }
  }
  const O = e.id && o && o.has(e.id) && s.type === "COMPONENT" && s.children && s.children.length > 0;
  if (e.children && Array.isArray(e.children) && s.type !== "INSTANCE" && !O) {
    const v = (w) => {
      const N = [];
      for (const $ of w)
        $._truncated || ($.type === "COMPONENT" ? (N.push($), $.children && Array.isArray($.children) && N.push(...v($.children))) : $.children && Array.isArray($.children) && N.push(...v($.children)));
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
    const B = v(e.children);
    await t.log(
      `  First pass: Creating ${B.length} COMPONENT node(s) (without children)...`
    );
    for (const w of B)
      await t.log(
        `  Collected COMPONENT "${w.name || "Unnamed"}" (ID: ${w.id ? w.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const w of B)
      if (w.id && o && !o.has(w.id)) {
        const N = figma.createComponent();
        if (w.name !== void 0 && (N.name = w.name || "Unnamed Node"), w.componentPropertyDefinitions) {
          const $ = w.componentPropertyDefinitions;
          let V = 0, A = 0;
          for (const [T, j] of Object.entries($))
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
              }[j.type];
              if (!X) {
                await t.warning(
                  `  Unknown property type ${j.type} for property "${T}" in component "${w.name || "Unnamed"}"`
                ), A++;
                continue;
              }
              const ee = j.defaultValue, Q = T.split("#")[0];
              N.addComponentProperty(
                Q,
                X,
                ee
              ), V++;
            } catch (J) {
              await t.warning(
                `  Failed to add component property "${T}" to "${w.name || "Unnamed"}" in first pass: ${J}`
              ), A++;
            }
          V > 0 && await t.log(
            `  Added ${V} component property definition(s) to "${w.name || "Unnamed"}" in first pass${A > 0 ? ` (${A} failed)` : ""}`
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
        s,
        i,
        n,
        r,
        c,
        o,
        d,
        p,
        f,
        // Pass deferredInstances through for recursive calls
        e,
        // parentNodeData - pass the parent's nodeData so children can check for auto-layout
        h
      );
      if (N && N.parent !== s) {
        if (N.parent && typeof N.parent.removeChild == "function")
          try {
            N.parent.removeChild(N);
          } catch ($) {
            await t.warning(
              `Failed to remove child "${N.name || "Unnamed"}" from parent "${N.parent.name || "Unnamed"}": ${$}`
            );
          }
        s.appendChild(N);
      }
    }
  }
  if (a && s.parent !== a) {
    if (s.parent && typeof s.parent.removeChild == "function")
      try {
        s.parent.removeChild(s);
      } catch (v) {
        await t.warning(
          `Failed to remove node "${s.name || "Unnamed"}" from parent "${s.parent.name || "Unnamed"}": ${v}`
        );
      }
    a.appendChild(s);
  }
  if ((s.type === "FRAME" || s.type === "COMPONENT" || s.type === "INSTANCE") && e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.itemSpacing !== void 0) {
    const v = ((Y = s.boundVariables) == null ? void 0 : Y.itemSpacing) !== void 0, B = e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.itemSpacing;
    if (v)
      await t.log(
        `  FINAL CHECK: itemSpacing is bound to variable for "${e.name || "Unnamed"}" - skipping direct value fix`
      );
    else if (B)
      await t.warning(
        `  FINAL CHECK: itemSpacing should be bound to variable for "${e.name || "Unnamed"}" but binding is missing!`
      );
    else {
      const w = s.itemSpacing;
      w !== e.itemSpacing ? (await t.log(
        `  FINAL FIX: Resetting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (was ${w})`
      ), s.itemSpacing = e.itemSpacing, await t.log(
        `  FINAL FIX: Verified itemSpacing is now ${s.itemSpacing}`
      )) : await t.log(
        `  FINAL CHECK: itemSpacing is already correct (${w}) for "${e.name || "Unnamed"}"`
      );
    }
  }
  return s;
}
async function ua(e, a, i) {
  let n = 0, r = 0, c = 0;
  const o = (p) => {
    const f = [];
    if (p.type === "INSTANCE" && f.push(p), "children" in p && p.children)
      for (const m of p.children)
        f.push(...o(m));
    return f;
  }, d = o(e);
  await t.log(
    `  Found ${d.length} instance(s) to process for variant properties`
  );
  for (const p of d)
    try {
      const f = await p.getMainComponentAsync();
      if (!f) {
        r++;
        continue;
      }
      const m = a.getSerializedTable();
      let h = null, s;
      if (i._instanceTableMap ? (s = i._instanceTableMap.get(
        p.id
      ), s !== void 0 ? (h = m[s], await t.log(
        `  Found instance table index ${s} for instance "${p.name}" (ID: ${p.id.substring(0, 8)}...)`
      )) : await t.log(
        `  No instance table index mapping found for instance "${p.name}" (ID: ${p.id.substring(0, 8)}...), using fallback matching`
      )) : await t.log(
        `  No instance table map found, using fallback matching for instance "${p.name}"`
      ), !h) {
        for (const [l, E] of Object.entries(m))
          if (E.instanceType === "internal" && E.componentNodeId && i.has(E.componentNodeId)) {
            const g = i.get(E.componentNodeId);
            if (g && g.id === f.id) {
              h = E, await t.log(
                `  Matched instance "${p.name}" to instance table entry ${l} by component (less precise)`
              );
              break;
            }
          }
      }
      if (!h) {
        await t.log(
          `  No matching entry found for instance "${p.name}" (main component: ${f.name}, ID: ${f.id.substring(0, 8)}...)`
        ), r++;
        continue;
      }
      if (!h.variantProperties) {
        await t.log(
          `  Instance table entry for "${p.name}" has no variant properties`
        ), r++;
        continue;
      }
      await t.log(
        `  Instance "${p.name}" matched to entry with variant properties: ${JSON.stringify(h.variantProperties)}`
      );
      let b = null;
      if (f.parent && f.parent.type === "COMPONENT_SET" && (b = f.parent.componentPropertyDefinitions), b) {
        const l = {};
        for (const [E, g] of Object.entries(
          h.variantProperties
        )) {
          const u = E.split("#")[0];
          b[u] && (l[u] = g);
        }
        Object.keys(l).length > 0 ? (p.setProperties(l), n++, await t.log(
          `  ✓ Set variant properties on instance "${p.name}": ${JSON.stringify(l)}`
        )) : r++;
      } else
        r++;
    } catch (f) {
      c++, await t.warning(
        `  Failed to set variant properties on instance "${p.name}": ${f}`
      );
    }
  await t.log(
    `  Variant properties set: ${n} processed, ${r} skipped, ${c} errors`
  );
}
async function ot(e) {
  await figma.loadAllPagesAsync();
  const a = figma.root.children, i = new Set(a.map((c) => c.name));
  if (!i.has(e))
    return e;
  let n = 1, r = `${e}_${n}`;
  for (; i.has(r); )
    n++, r = `${e}_${n}`;
  return r;
}
async function ha(e) {
  const a = await figma.variables.getLocalVariableCollectionsAsync(), i = new Set(a.map((c) => c.name));
  if (!i.has(e))
    return e;
  let n = 1, r = `${e}_${n}`;
  for (; i.has(r); )
    n++, r = `${e}_${n}`;
  return r;
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
  let n = 1, r = `${a}_${n}`;
  for (; i.has(r); )
    n++, r = `${a}_${n}`;
  return r;
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
    a = ze.fromTable(e.stringTable);
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
  const i = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), c = e.getTable();
  for (const [o, d] of Object.entries(c)) {
    if (d.isLocal === !1) {
      await t.log(
        `Skipping remote collection: "${d.collectionName}" (index ${o})`
      );
      continue;
    }
    const p = de(d.collectionName), f = a == null ? void 0 : a.get(p);
    if (f) {
      await t.log(
        `✓ Using pre-created collection: "${p}" (index ${o})`
      ), i.set(o, f);
      continue;
    }
    const m = await ya(d);
    m.matchType === "recognized" ? (await t.log(
      `✓ Recognized collection by GUID: "${d.collectionName}" (index ${o})`
    ), i.set(o, m.collection)) : m.matchType === "potential" ? (await t.log(
      `? Potential match by name: "${d.collectionName}" (index ${o})`
    ), n.set(o, {
      entry: d,
      collection: m.collection
    })) : (await t.log(
      `✗ No match found for collection: "${d.collectionName}" (index ${o}) - will create new`
    ), r.set(o, d));
  }
  return await t.log(
    `Collection matching complete: ${i.size} recognized, ${n.size} potential matches, ${r.size} to create`
  ), {
    recognizedCollections: i,
    potentialMatches: n,
    collectionsToCreate: r
  };
}
async function va(e, a, i, n) {
  if (e.size !== 0) {
    if (n) {
      await t.log(
        `Using wizard selections for ${e.size} potential match(es)...`
      );
      for (const [r, { entry: c, collection: o }] of e.entries()) {
        const d = de(
          c.collectionName
        ).toLowerCase();
        let p = !1;
        d === "tokens" || d === "token" ? p = n.tokens === "existing" : d === "theme" || d === "themes" ? p = n.theme === "existing" : (d === "layer" || d === "layers") && (p = n.layers === "existing");
        const f = ye(c.collectionName) ? de(c.collectionName) : o.name;
        p ? (await t.log(
          `✓ Wizard selection: Using existing collection "${f}" (index ${r})`
        ), a.set(r, o), await ve(o, c.modes), await t.log(
          `  ✓ Ensured modes for collection "${f}" (${c.modes.length} mode(s))`
        )) : (await t.log(
          `✗ Wizard selection: Will create new collection for "${c.collectionName}" (index ${r})`
        ), i.set(r, c));
      }
      return;
    }
    await t.log(
      `Prompting user for ${e.size} potential match(es)...`
    );
    for (const [r, { entry: c, collection: o }] of e.entries())
      try {
        const d = ye(c.collectionName) ? de(c.collectionName) : o.name, p = `Found existing "${d}" variable collection. Should I use it?`;
        await t.log(
          `Prompting user about potential match: "${d}"`
        ), await Ie.prompt(p, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await t.log(
          `✓ User confirmed: Using existing collection "${d}" (index ${r})`
        ), a.set(r, o), await ve(o, c.modes), await t.log(
          `  ✓ Ensured modes for collection "${d}" (${c.modes.length} mode(s))`
        );
      } catch (d) {
        await t.log(
          `✗ User rejected: Will create new collection for "${c.collectionName}" (index ${r})`
        ), i.set(r, c);
      }
  }
}
async function Ea(e, a, i) {
  if (e.size === 0)
    return;
  await t.log("Ensuring modes exist for recognized collections...");
  const n = a.getTable();
  for (const [r, c] of e.entries()) {
    const o = n[r];
    o && (i.has(r) || (await ve(c, o.modes), await t.log(
      `  ✓ Ensured modes for collection "${c.name}" (${o.modes.length} mode(s))`
    )));
  }
}
async function Na(e, a, i, n) {
  if (e.size !== 0) {
    await t.log(
      `Processing ${e.size} collection(s) to create...`
    );
    for (const [r, c] of e.entries()) {
      const o = de(c.collectionName), d = n == null ? void 0 : n.get(o);
      if (d) {
        await t.log(
          `Reusing pre-created collection: "${o}" (index ${r}, id: ${d.id.substring(0, 8)}...)`
        ), a.set(r, d), await ve(d, c.modes), i.push(d);
        continue;
      }
      const p = await ha(o);
      p !== o ? await t.log(
        `Creating collection: "${p}" (normalized: "${o}" - name conflict resolved)`
      ) : await t.log(`Creating collection: "${p}"`);
      const f = figma.variables.createVariableCollection(p);
      i.push(f);
      let m;
      if (ye(c.collectionName)) {
        const h = Ge(c.collectionName);
        h && (m = h);
      } else c.collectionGuid && (m = c.collectionGuid);
      m && (f.setSharedPluginData(
        "recursica",
        ue,
        m
      ), await t.log(
        `  Stored GUID: ${m.substring(0, 8)}...`
      )), await ve(f, c.modes), await t.log(
        `  ✓ Created collection "${p}" with ${c.modes.length} mode(s)`
      ), a.set(r, f);
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
  const r = /* @__PURE__ */ new Map(), c = [], o = new Set(
    n.map((h) => h.id)
  );
  await t.log("Matching and creating variables in collections...");
  const d = e.getTable(), p = /* @__PURE__ */ new Map();
  for (const [h, s] of Object.entries(d)) {
    if (s._colRef === void 0)
      continue;
    const b = i.get(String(s._colRef));
    if (!b)
      continue;
    p.has(b.id) || p.set(b.id, {
      collectionName: b.name,
      existing: 0,
      created: 0
    });
    const l = p.get(b.id), E = o.has(
      b.id
    );
    let g;
    typeof s.variableType == "number" ? g = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[s.variableType] || String(s.variableType) : g = s.variableType;
    const u = await Ze(
      b,
      s.variableName
    );
    if (u)
      if (ht(u, g))
        r.set(h, u), l.existing++;
      else {
        await t.warning(
          `Type mismatch for variable "${s.variableName}" in collection "${b.name}": expected ${g}, found ${u.resolvedType}. Creating new variable with incremented name.`
        );
        const y = await ba(
          b,
          s.variableName
        ), x = await Xe(
          ce(q({}, s), {
            variableName: y,
            variableType: g
          }),
          b,
          e,
          a
        );
        E || c.push(x), r.set(h, x), l.created++;
      }
    else {
      const y = await Xe(
        ce(q({}, s), {
          variableType: g
        }),
        b,
        e,
        a
      );
      E || c.push(y), r.set(h, y), l.created++;
    }
  }
  await t.log("Variable processing complete:");
  for (const h of p.values())
    await t.log(
      `  "${h.collectionName}": ${h.existing} existing, ${h.created} created`
    );
  await t.log(
    "Final verification: Reading back all COLOR variables..."
  );
  let f = 0, m = 0;
  for (const h of c)
    if (h.resolvedType === "COLOR") {
      const s = await figma.variables.getVariableCollectionByIdAsync(
        h.variableCollectionId
      );
      if (!s) {
        await t.warning(
          `  ⚠️ Variable "${h.name}" has no variableCollection (ID: ${h.variableCollectionId})`
        );
        continue;
      }
      const b = s.modes;
      if (!b || b.length === 0) {
        await t.warning(
          `  ⚠️ Variable "${h.name}" collection has no modes`
        );
        continue;
      }
      for (const l of b) {
        const E = h.valuesByMode[l.modeId];
        if (E && typeof E == "object" && "r" in E) {
          const g = E;
          Math.abs(g.r - 1) < 0.01 && Math.abs(g.g - 1) < 0.01 && Math.abs(g.b - 1) < 0.01 ? (m++, await t.warning(
            `  ⚠️ Variable "${h.name}" mode "${l.name}" is WHITE: r=${g.r.toFixed(3)}, g=${g.g.toFixed(3)}, b=${g.b.toFixed(3)}`
          )) : (f++, await t.log(
            `  ✓ Variable "${h.name}" mode "${l.name}" has color: r=${g.r.toFixed(3)}, g=${g.g.toFixed(3)}, b=${g.b.toFixed(3)}`
          ));
        } else E && typeof E == "object" && "type" in E || await t.warning(
          `  ⚠️ Variable "${h.name}" mode "${l.name}" has unexpected value type: ${JSON.stringify(E)}`
        );
      }
    }
  return await t.log(
    `Final verification complete: ${f} color variables verified, ${m} white variables found`
  ), {
    recognizedVariables: r,
    newlyCreatedVariables: c
  };
}
function Ia(e) {
  if (!e.instances)
    return null;
  try {
    return Re.fromTable(e.instances);
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
  let n = 1, r = `${a}_${n}`;
  for (; i.has(r); )
    n++, r = `${a}_${n}`;
  return r;
}
async function Va(e, a, i, n, r, c = "") {
  var l;
  const o = e.getSerializedTable(), d = Object.values(o).filter(
    (E) => E.instanceType === "remote"
  ), p = /* @__PURE__ */ new Map();
  if (d.length === 0)
    return await t.log("No remote instances found"), p;
  await t.log(
    `Processing ${d.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  const f = figma.root.children, m = c ? `${c} REMOTES` : "REMOTES";
  let h = f.find(
    (E) => E.name === "REMOTES" || E.name === m
  );
  if (h ? (await t.log("Found existing REMOTES page"), c && !h.name.startsWith(c) && (h.name = m)) : (h = figma.createPage(), h.name = m, await t.log("Created REMOTES page")), d.length > 0 && (h.setPluginData("RecursicaUnderReview", "true"), await t.log("Marked REMOTES page as under review")), !h.children.some(
    (E) => E.type === "FRAME" && E.name === "Title"
  )) {
    const E = { family: "Inter", style: "Bold" }, g = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(E), await figma.loadFontAsync(g);
    const u = figma.createFrame();
    u.name = "Title", u.layoutMode = "VERTICAL", u.paddingTop = 20, u.paddingBottom = 20, u.paddingLeft = 20, u.paddingRight = 20, u.fills = [];
    const y = figma.createText();
    y.fontName = E, y.characters = "REMOTE INSTANCES", y.fontSize = 24, y.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], u.appendChild(y);
    const x = figma.createText();
    x.fontName = g, x.characters = "These are remotely connected component instances found in our different component pages.", x.fontSize = 14, x.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], u.appendChild(x), h.appendChild(u), await t.log("Created title and description on REMOTES page");
  }
  const b = /* @__PURE__ */ new Map();
  for (const [E, g] of Object.entries(o)) {
    if (g.instanceType !== "remote")
      continue;
    const u = parseInt(E, 10);
    if (await t.log(
      `Processing remote instance ${u}: "${g.componentName}"`
    ), !g.structure) {
      await t.warning(
        `Remote instance "${g.componentName}" missing structure data, skipping`
      );
      continue;
    }
    et(g.structure);
    const y = g.structure.children !== void 0, x = g.structure.child !== void 0, M = g.structure.children ? g.structure.children.length : g.structure.child ? g.structure.child.length : 0;
    await t.log(
      `  Structure type: ${g.structure.type || "unknown"}, has children: ${M} (children key: ${y}, child key: ${x})`
    );
    let U = g.componentName;
    if (g.path && g.path.length > 0) {
      const R = g.path.filter((C) => C !== "").join(" / ");
      R && (U = `${R} / ${g.componentName}`);
    }
    const O = await Ta(
      h,
      U
    );
    O !== U && await t.log(
      `Component name conflict: "${U}" -> "${O}"`
    );
    try {
      if (g.structure.type !== "COMPONENT") {
        await t.warning(
          `Remote instance "${g.componentName}" structure is not a COMPONENT (type: ${g.structure.type}), creating frame fallback`
        );
        const C = figma.createFrame();
        C.name = O;
        const k = await Pe(
          g.structure,
          C,
          a,
          i,
          null,
          n,
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
        k ? (C.appendChild(k), h.appendChild(C), await t.log(
          `✓ Created remote instance frame fallback: "${O}"`
        )) : C.remove();
        continue;
      }
      const R = figma.createComponent();
      R.name = O, h.appendChild(R), await t.log(
        `  Created component node: "${O}"`
      );
      try {
        if (g.structure.componentPropertyDefinitions) {
          const S = g.structure.componentPropertyDefinitions;
          let P = 0, _ = 0;
          for (const [z, W] of Object.entries(S))
            try {
              const H = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[W.type];
              if (!H) {
                await t.warning(
                  `  Unknown property type ${W.type} for property "${z}" in component "${g.componentName}"`
                ), _++;
                continue;
              }
              const Y = W.defaultValue, v = z.split("#")[0];
              R.addComponentProperty(
                v,
                H,
                Y
              ), P++;
            } catch (D) {
              await t.warning(
                `  Failed to add component property "${z}" to "${g.componentName}": ${D}`
              ), _++;
            }
          P > 0 && await t.log(
            `  Added ${P} component property definition(s) to "${g.componentName}"${_ > 0 ? ` (${_} failed)` : ""}`
          );
        }
        g.structure.name !== void 0 && (R.name = g.structure.name);
        const C = g.structure.boundVariables && typeof g.structure.boundVariables == "object" && (g.structure.boundVariables.width || g.structure.boundVariables.height);
        g.structure.width !== void 0 && g.structure.height !== void 0 && !C && R.resize(g.structure.width, g.structure.height), g.structure.x !== void 0 && (R.x = g.structure.x), g.structure.y !== void 0 && (R.y = g.structure.y);
        const k = g.structure.boundVariables && typeof g.structure.boundVariables == "object";
        if (g.structure.visible !== void 0 && (R.visible = g.structure.visible), g.structure.opacity !== void 0 && (!k || !g.structure.boundVariables.opacity) && (R.opacity = g.structure.opacity), g.structure.rotation !== void 0 && (!k || !g.structure.boundVariables.rotation) && (R.rotation = g.structure.rotation), g.structure.blendMode !== void 0 && (!k || !g.structure.boundVariables.blendMode) && (R.blendMode = g.structure.blendMode), g.structure.fills !== void 0)
          try {
            let S = g.structure.fills;
            Array.isArray(S) && (S = S.map((P) => {
              if (P && typeof P == "object") {
                const _ = q({}, P);
                return delete _.boundVariables, _;
              }
              return P;
            })), R.fills = S, (l = g.structure.boundVariables) != null && l.fills && n && await ma(
              R,
              g.structure.boundVariables,
              "fills",
              n
            );
          } catch (S) {
            await t.warning(
              `Error setting fills for remote component "${g.componentName}": ${S}`
            );
          }
        if (g.structure.strokes !== void 0)
          try {
            R.strokes = g.structure.strokes;
          } catch (S) {
            await t.warning(
              `Error setting strokes for remote component "${g.componentName}": ${S}`
            );
          }
        const L = g.structure.boundVariables && typeof g.structure.boundVariables == "object" && (g.structure.boundVariables.strokeWeight || g.structure.boundVariables.strokeAlign);
        g.structure.strokeWeight !== void 0 && (!L || !g.structure.boundVariables.strokeWeight) && (R.strokeWeight = g.structure.strokeWeight), g.structure.strokeAlign !== void 0 && (!L || !g.structure.boundVariables.strokeAlign) && (R.strokeAlign = g.structure.strokeAlign), g.structure.layoutMode !== void 0 && (R.layoutMode = g.structure.layoutMode), g.structure.primaryAxisSizingMode !== void 0 && (R.primaryAxisSizingMode = g.structure.primaryAxisSizingMode), g.structure.counterAxisSizingMode !== void 0 && (R.counterAxisSizingMode = g.structure.counterAxisSizingMode);
        const F = g.structure.boundVariables && typeof g.structure.boundVariables == "object";
        g.structure.paddingLeft !== void 0 && (!F || !g.structure.boundVariables.paddingLeft) && (R.paddingLeft = g.structure.paddingLeft), g.structure.paddingRight !== void 0 && (!F || !g.structure.boundVariables.paddingRight) && (R.paddingRight = g.structure.paddingRight), g.structure.paddingTop !== void 0 && (!F || !g.structure.boundVariables.paddingTop) && (R.paddingTop = g.structure.paddingTop), g.structure.paddingBottom !== void 0 && (!F || !g.structure.boundVariables.paddingBottom) && (R.paddingBottom = g.structure.paddingBottom), g.structure.itemSpacing !== void 0 && (!F || !g.structure.boundVariables.itemSpacing) && (R.itemSpacing = g.structure.itemSpacing);
        const I = g.structure.boundVariables && typeof g.structure.boundVariables == "object" && (g.structure.boundVariables.cornerRadius || g.structure.boundVariables.topLeftRadius || g.structure.boundVariables.topRightRadius || g.structure.boundVariables.bottomLeftRadius || g.structure.boundVariables.bottomRightRadius);
        if (g.structure.cornerRadius !== void 0 && (!I || !g.structure.boundVariables.cornerRadius) && (R.cornerRadius = g.structure.cornerRadius), g.structure.boundVariables && n) {
          const S = g.structure.boundVariables, P = [
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
          for (const _ of P)
            if (S[_] && $e(S[_])) {
              const z = S[_]._varRef;
              if (z !== void 0) {
                const W = n.get(String(z));
                if (W) {
                  const D = {
                    type: "VARIABLE_ALIAS",
                    id: W.id
                  };
                  R.boundVariables || (R.boundVariables = {}), R.boundVariables[_] = D;
                }
              }
            }
        }
        await t.log(
          `  DEBUG: Structure keys: ${Object.keys(g.structure).join(", ")}, has children: ${!!g.structure.children}, has child: ${!!g.structure.child}`
        );
        const G = g.structure.children || (g.structure.child ? g.structure.child : null);
        if (await t.log(
          `  DEBUG: childrenArray exists: ${!!G}, isArray: ${Array.isArray(G)}, length: ${G ? G.length : 0}`
        ), G && Array.isArray(G) && G.length > 0) {
          await t.log(
            `  Recreating ${G.length} child(ren) for component "${g.componentName}"`
          );
          for (let S = 0; S < G.length; S++) {
            const P = G[S];
            if (await t.log(
              `  DEBUG: Processing child ${S + 1}/${G.length}: ${JSON.stringify({ name: P == null ? void 0 : P.name, type: P == null ? void 0 : P.type, hasTruncated: !!(P != null && P._truncated) })}`
            ), P._truncated) {
              await t.log(
                `  Skipping truncated child: ${P._reason || "Unknown"}`
              );
              continue;
            }
            await t.log(
              `  Recreating child: "${P.name || "Unnamed"}" (type: ${P.type})`
            );
            const _ = await Pe(
              P,
              R,
              a,
              i,
              null,
              n,
              b,
              !0,
              // isRemoteStructure: true
              null,
              // remoteComponentMap - not needed here
              null,
              // deferredInstances - not needed for remote instances
              g.structure,
              // parentNodeData - pass the component's structure so children can check for auto-layout
              r
            );
            _ ? (R.appendChild(_), await t.log(
              `  ✓ Appended child "${P.name || "Unnamed"}" to component "${g.componentName}"`
            )) : await t.warning(
              `  ✗ Failed to create child "${P.name || "Unnamed"}" (type: ${P.type})`
            );
          }
        }
        p.set(u, R), await t.log(
          `✓ Created remote component: "${O}" (index ${u})`
        );
      } catch (C) {
        await t.warning(
          `Error populating remote component "${g.componentName}": ${C instanceof Error ? C.message : "Unknown error"}`
        ), R.remove();
      }
    } catch (R) {
      await t.warning(
        `Error recreating remote instance "${g.componentName}": ${R instanceof Error ? R.message : "Unknown error"}`
      );
    }
  }
  return await t.log(
    `Remote instance processing complete: ${p.size} component(s) created`
  ), p;
}
async function Oa(e, a, i, n, r, c, o = null, d = null, p = !1, f = null, m = !1, h = !1, s = "") {
  await t.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const b = figma.root.children, l = "RecursicaPublishedMetadata";
  let E = null;
  for (const k of b) {
    const L = k.getPluginData(l);
    if (L)
      try {
        if (JSON.parse(L).id === e.guid) {
          E = k;
          break;
        }
      } catch (F) {
        continue;
      }
  }
  let g = !1;
  if (E && !p && !m) {
    let k;
    try {
      const I = E.getPluginData(l);
      I && (k = JSON.parse(I).version);
    } catch (I) {
    }
    const L = k !== void 0 ? ` v${k}` : "", F = `Found existing component "${E.name}${L}". Should I use it or create a copy?`;
    await t.log(
      `Found existing page with same GUID: "${E.name}". Prompting user...`
    );
    try {
      await Ie.prompt(F, {
        okLabel: "Use",
        cancelLabel: "Copy",
        timeoutMs: 3e5
        // 5 minutes
      }), g = !0, await t.log(
        `User chose to use existing page: "${E.name}"`
      );
    } catch (I) {
      await t.log(
        "User chose to create a copy. Will create new page."
      );
    }
  }
  if (g && E)
    return await figma.setCurrentPageAsync(E), await t.log(
      `Using existing page: "${E.name}" (GUID: ${e.guid.substring(0, 8)}...)`
    ), await t.log(
      `  Instances from other pages will resolve to components on this existing page using componentPageName: "${E.name}"`
    ), {
      success: !0,
      page: E,
      // Include pageId so it can be tracked in importedPages
      pageId: E.id
    };
  const u = b.find((k) => k.name === e.name);
  u && await t.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let y;
  if (E || u) {
    const k = `__${e.name}`;
    y = await ot(k), await t.log(
      `Creating scratch page: "${y}" (will be renamed to "${e.name}" on success)`
    );
  } else
    y = e.name, await t.log(`Creating page: "${y}"`);
  const x = figma.createPage();
  if (x.name = y, await figma.setCurrentPageAsync(x), await t.log(`Switched to page: "${y}"`), !a.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await t.log("Recreating page structure...");
  const M = a.pageData;
  if (M.backgrounds !== void 0)
    try {
      x.backgrounds = M.backgrounds, await t.log(
        `Set page background: ${JSON.stringify(M.backgrounds)}`
      );
    } catch (k) {
      await t.warning(`Failed to set page background: ${k}`);
    }
  et(M);
  const U = /* @__PURE__ */ new Map(), O = (k, L = []) => {
    if (k.type === "COMPONENT" && k.id && L.push(k.id), k.children && Array.isArray(k.children))
      for (const F of k.children)
        F._truncated || O(F, L);
    return L;
  }, R = O(M);
  if (await t.log(
    `Found ${R.length} COMPONENT node(s) in page data`
  ), R.length > 0 && (await t.log(
    `Component IDs in page data (first 20): ${R.slice(0, 20).map((k) => k.substring(0, 8) + "...").join(", ")}`
  ), M._allComponentIds = R), M.children && Array.isArray(M.children))
    for (const k of M.children) {
      const L = await Pe(
        k,
        x,
        i,
        n,
        r,
        c,
        U,
        !1,
        // isRemoteStructure: false - we're creating the main page
        o,
        d,
        M,
        // parentNodeData - pass the page's nodeData so children can check for auto-layout
        f
      );
      L && x.appendChild(L);
    }
  await t.log("Page structure recreated successfully"), r && (await t.log(
    "Third pass: Setting variant properties on instances..."
  ), await ua(
    x,
    r,
    U
  ));
  const C = {
    _ver: 1,
    id: e.guid,
    name: e.name,
    version: e.version || 0,
    publishDate: (/* @__PURE__ */ new Date()).toISOString(),
    history: {}
  };
  if (x.setPluginData(l, JSON.stringify(C)), await t.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), y.startsWith("__")) {
    let k;
    h ? k = s ? `${s} ${e.name}` : e.name : k = await ot(e.name), x.name = k, await t.log(`Renamed page from "${y}" to "${k}"`);
  } else h && s && (x.name.startsWith(s) || (x.name = `${s} ${x.name}`));
  return {
    success: !0,
    page: x,
    deferredInstances: d || void 0
  };
}
async function bt(e) {
  var n, r, c;
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
    const p = d.metadata;
    await t.log(
      `Metadata validated: guid=${p.guid}, name=${p.name}`
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
    const m = f.expandedJsonData;
    await t.log("JSON expanded successfully"), await t.log("Loading collections table...");
    const h = $a(m);
    if (!h.success)
      return h.error === "No collections table found in JSON" ? (await t.log(h.error), await t.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: p.name }
      }) : (await t.error(h.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: h.error,
        data: {}
      });
    const s = h.collectionTable;
    await t.log(
      `Loaded collections table with ${s.getSize()} collection(s)`
    ), await t.log(
      "Matching collections with existing local collections..."
    );
    const { recognizedCollections: b, potentialMatches: l, collectionsToCreate: E } = await Sa(s, e.preCreatedCollections);
    await va(
      l,
      b,
      E,
      e.collectionChoices
    ), await Ea(
      b,
      s,
      l
    ), await Na(
      E,
      b,
      i,
      e.preCreatedCollections
    ), await t.log("Loading variables table...");
    const g = Aa(m);
    if (!g.success)
      return g.error === "No variables table found in JSON" ? (await t.log(g.error), await t.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no variables to process)",
        data: { pageName: p.name }
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
    const { recognizedVariables: y, newlyCreatedVariables: x } = await Ca(
      u,
      s,
      b,
      i
    );
    await t.log("Loading instance table...");
    const M = Ia(m);
    if (M) {
      const z = M.getSerializedTable(), W = Object.values(z).filter(
        (H) => H.instanceType === "internal"
      ), D = Object.values(z).filter(
        (H) => H.instanceType === "remote"
      );
      await t.log(
        `Loaded instance table with ${M.getSize()} instance(s) (${W.length} internal, ${D.length} remote)`
      );
    } else
      await t.log("No instance table found in JSON");
    const U = [], O = (n = e.isMainPage) != null ? n : !0, R = (r = e.alwaysCreateCopy) != null ? r : !1, C = (c = e.skipUniqueNaming) != null ? c : !1, k = e.constructionIcon || "";
    let L = null;
    M && (L = await Va(
      M,
      u,
      s,
      y,
      b,
      k
    ));
    const F = await Oa(
      p,
      m,
      u,
      s,
      M,
      y,
      L,
      U,
      O,
      b,
      R,
      C,
      k
    );
    if (!F.success)
      return await t.error(F.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: F.error,
        data: {}
      };
    const I = F.page, G = y.size + x.length, S = F.deferredInstances || U, P = (S == null ? void 0 : S.length) || 0;
    if (await t.log("=== Import Complete ==="), await t.log(
      `Successfully processed ${b.size} collection(s), ${G} variable(s), and created page "${I.name}"${P > 0 ? ` (${P} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`
    ), P > 0) {
      await t.log(
        `  [DEBUG] Returning ${P} deferred instance(s) in response`
      );
      for (const z of S)
        await t.log(
          `    - "${z.nodeData.name}" from page "${z.instanceEntry.componentPageName}"`
        );
    }
    const _ = F.pageId || I.id;
    return {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: {
        pageName: I.name,
        pageId: _,
        // Include pageId for tracking (used for both new and reused pages)
        deferredInstances: P > 0 ? S : void 0,
        createdEntities: {
          pageIds: [I.id],
          collectionIds: i.map((z) => z.id),
          variableIds: x.map((z) => z.id)
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
  const r = [];
  await figma.loadAllPagesAsync();
  for (const c of e)
    try {
      const { placeholderFrameId: o, instanceEntry: d, nodeData: p, parentNodeId: f } = c, m = await figma.getNodeByIdAsync(
        o
      ), h = await figma.getNodeByIdAsync(
        f
      );
      if (!m || !h) {
        const u = `Deferred instance "${p.name}" - could not find placeholder frame (${o}) or parent node (${f})`;
        await t.error(u), r.push(u), n++;
        continue;
      }
      let s = figma.root.children.find((u) => {
        const y = u.name === d.componentPageName, x = a && u.name === `${a} ${d.componentPageName}`;
        return y || x;
      });
      if (!s) {
        const u = oe(
          d.componentPageName
        );
        s = figma.root.children.find((y) => oe(y.name) === u);
      }
      if (!s && a) {
        const u = figma.root.children.map((y) => y.name).slice(0, 10);
        await t.log(
          `  [DEBUG] Looking for page "${d.componentPageName}" (or "${a} ${d.componentPageName}"). Available pages (first 10): ${u.join(", ")}`
        );
      }
      if (!s) {
        const u = a ? `"${d.componentPageName}" or "${a} ${d.componentPageName}"` : `"${d.componentPageName}"`, y = `Deferred instance "${p.name}" still cannot find referenced page (tried: ${u}, and clean name matching)`;
        await t.error(y), r.push(y), n++;
        continue;
      }
      const b = (u, y, x, M, U) => {
        if (y.length === 0) {
          let k = null;
          const L = oe(x);
          for (const F of u.children || [])
            if (F.type === "COMPONENT") {
              const I = F.name === x, G = oe(F.name) === L;
              if (I || G) {
                if (k || (k = F), I && M)
                  try {
                    const S = F.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (S && JSON.parse(S).id === M)
                      return F;
                  } catch (S) {
                  }
                else if (I)
                  return F;
              }
            } else if (F.type === "COMPONENT_SET") {
              if (U) {
                const I = F.name === U, G = oe(F.name) === oe(U);
                if (!I && !G)
                  continue;
              }
              for (const I of F.children || [])
                if (I.type === "COMPONENT") {
                  const G = I.name === x, S = oe(I.name) === L;
                  if (G || S) {
                    if (k || (k = I), G && M)
                      try {
                        const P = I.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (P && JSON.parse(P).id === M)
                          return I;
                      } catch (P) {
                      }
                    else if (G)
                      return I;
                  }
                }
            }
          return k;
        }
        const [O, ...R] = y, C = oe(O);
        for (const k of u.children || []) {
          const L = k.name === O, F = oe(k.name) === C;
          if (L || F) {
            if (R.length === 0) {
              if (k.type === "COMPONENT_SET") {
                if (U) {
                  const S = k.name === U, P = oe(k.name) === oe(U);
                  if (!S && !P)
                    continue;
                }
                const I = oe(x);
                let G = null;
                for (const S of k.children || [])
                  if (S.type === "COMPONENT") {
                    const P = S.name === x, _ = oe(S.name) === I;
                    if (P || _) {
                      if (G || (G = S), M)
                        try {
                          const z = S.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (z && JSON.parse(z).id === M)
                            return S;
                        } catch (z) {
                        }
                      if (P)
                        return S;
                    }
                  }
                return G || null;
              }
              return null;
            }
            return R.length > 0 ? b(
              k,
              R,
              x,
              M,
              U
            ) : null;
          }
        }
        return null;
      };
      await t.log(
        `  [DEBUG] Searching for component "${d.componentName}" on page "${s.name}"`
      ), d.path && d.path.length > 0 ? await t.log(
        `  [DEBUG] Component path: [${d.path.join(" → ")}]`
      ) : await t.log("  [DEBUG] Component is at page root"), d.componentSetName && await t.log(
        `  [DEBUG] Component set name: "${d.componentSetName}"`
      ), d.componentGuid && await t.log(
        `  [DEBUG] Component GUID: ${d.componentGuid.substring(0, 8)}...`
      );
      const l = s.children.slice(0, 10).map((u) => `${u.type}: "${u.name}"${u.type === "COMPONENT_SET" ? ` (${u.children.length} variants)` : ""}`);
      await t.log(
        `  [DEBUG] Top-level nodes on page "${s.name}" (first 10): ${l.join(", ")}`
      );
      let E = b(
        s,
        d.path || [],
        d.componentName,
        d.componentGuid,
        d.componentSetName
      );
      if (!E && d.componentSetName) {
        await t.log(
          `  [DEBUG] Path-based search failed, trying recursive search for COMPONENT_SET "${d.componentSetName}"`
        );
        const u = (y, x = 0) => {
          if (x > 5) return null;
          for (const M of y.children || []) {
            if (M.type === "COMPONENT_SET") {
              const U = M.name === d.componentSetName, O = oe(M.name) === oe(d.componentSetName || "");
              if (U || O) {
                const R = oe(
                  d.componentName
                );
                for (const C of M.children || [])
                  if (C.type === "COMPONENT") {
                    const k = C.name === d.componentName, L = oe(C.name) === R;
                    if (k || L) {
                      if (d.componentGuid)
                        try {
                          const F = C.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (F && JSON.parse(F).id === d.componentGuid)
                            return C;
                        } catch (F) {
                        }
                      return C;
                    }
                  }
              }
            }
            if (M.type === "FRAME" || M.type === "GROUP") {
              const U = u(M, x + 1);
              if (U) return U;
            }
          }
          return null;
        };
        E = u(s), E && await t.log(
          `  [DEBUG] Found component via recursive search: "${E.name}"`
        );
      }
      if (!E) {
        const u = d.path && d.path.length > 0 ? ` at path [${d.path.join(" → ")}]` : " at page root", y = [], x = (U, O = 0) => {
          if (!(O > 3) && ((U.type === "COMPONENT" || U.type === "COMPONENT_SET") && y.push(
            `${U.type}: "${U.name}"${U.type === "COMPONENT_SET" ? ` (${U.children.length} variants)` : ""}`
          ), U.children && Array.isArray(U.children)))
            for (const R of U.children.slice(0, 10))
              x(R, O + 1);
        };
        x(s), await t.log(
          `  [DEBUG] Available components on page "${s.name}" (first 20): ${y.slice(0, 20).join(", ")}`
        );
        const M = `Deferred instance "${p.name}" still cannot find component "${d.componentName}" on page "${d.componentPageName}"${u}`;
        await t.error(M), r.push(M), n++;
        continue;
      }
      const g = E.createInstance();
      if (g.name = p.name || m.name.replace("[Deferred: ", "").replace("]", ""), g.x = m.x, g.y = m.y, m.width !== void 0 && m.height !== void 0 && g.resize(m.width, m.height), d.variantProperties && Object.keys(d.variantProperties).length > 0)
        try {
          const u = await g.getMainComponentAsync();
          if (u) {
            let y = null;
            const x = u.type;
            if (x === "COMPONENT_SET" ? y = u.componentPropertyDefinitions : x === "COMPONENT" && u.parent && u.parent.type === "COMPONENT_SET" ? y = u.parent.componentPropertyDefinitions : await t.warning(
              `Cannot set variant properties for resolved instance "${p.name}" - main component is not a COMPONENT_SET or variant`
            ), y) {
              const M = {};
              for (const [U, O] of Object.entries(
                d.variantProperties
              )) {
                const R = U.split("#")[0];
                y[R] && (M[R] = O);
              }
              Object.keys(M).length > 0 && g.setProperties(M);
            }
          }
        } catch (u) {
          await t.warning(
            `Failed to set variant properties for resolved instance "${p.name}": ${u}`
          );
        }
      if (d.componentProperties && Object.keys(d.componentProperties).length > 0)
        try {
          const u = await g.getMainComponentAsync();
          if (u) {
            let y = null;
            const x = u.type;
            if (x === "COMPONENT_SET" ? y = u.componentPropertyDefinitions : x === "COMPONENT" && u.parent && u.parent.type === "COMPONENT_SET" ? y = u.parent.componentPropertyDefinitions : x === "COMPONENT" && (y = u.componentPropertyDefinitions), y)
              for (const [M, U] of Object.entries(
                d.componentProperties
              )) {
                const O = M.split("#")[0];
                if (y[O])
                  try {
                    g.setProperties({
                      [O]: U
                    });
                  } catch (R) {
                    await t.warning(
                      `Failed to set component property "${O}" for resolved instance "${p.name}": ${R}`
                    );
                  }
              }
          }
        } catch (u) {
          await t.warning(
            `Failed to set component properties for resolved instance "${p.name}": ${u}`
          );
        }
      if ("children" in h && "insertChild" in h) {
        const u = h.children.indexOf(m);
        h.insertChild(u, g), m.remove();
      } else {
        const u = `Parent node does not support children operations for deferred instance "${p.name}"`;
        await t.error(u), r.push(u);
        continue;
      }
      await t.log(
        `  ✓ Resolved deferred instance "${p.name}" from component "${d.componentName}" on page "${d.componentPageName}"`
      ), i++;
    } catch (o) {
      const d = o instanceof Error ? o.message : String(o), p = `Failed to resolve deferred instance "${c.nodeData.name}": ${d}`;
      await t.error(p), r.push(p), n++;
    }
  return await t.log(
    `=== Deferred Resolution Complete: ${i} resolved, ${n} failed ===`
  ), { resolved: i, failed: n, errors: r };
}
async function Ma(e) {
  await t.log("=== Cleaning up created entities ===");
  try {
    const { pageIds: a, collectionIds: i, variableIds: n } = e;
    let r = 0;
    for (const d of n)
      try {
        const p = await figma.variables.getVariableByIdAsync(d);
        if (p) {
          const f = p.variableCollectionId;
          i.includes(f) || (p.remove(), r++);
        }
      } catch (p) {
        await t.warning(
          `Could not delete variable ${d.substring(0, 8)}...: ${p}`
        );
      }
    let c = 0;
    for (const d of i)
      try {
        const p = await figma.variables.getVariableCollectionByIdAsync(d);
        p && (p.remove(), c++);
      } catch (p) {
        await t.warning(
          `Could not delete collection ${d.substring(0, 8)}...: ${p}`
        );
      }
    await figma.loadAllPagesAsync();
    let o = 0;
    for (const d of a)
      try {
        const p = await figma.getNodeByIdAsync(d);
        p && p.type === "PAGE" && (p.remove(), o++);
      } catch (p) {
        await t.warning(
          `Could not delete page ${d.substring(0, 8)}...: ${p}`
        );
      }
    return await t.log(
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
      const r = Qe(n);
      if (!r.success || !r.expandedJsonData) {
        await t.warning(
          `Skipping ${i} - failed to expand JSON: ${r.error || "Unknown error"}`
        );
        continue;
      }
      const c = r.expandedJsonData, o = c.metadata;
      if (!o || !o.name || !o.guid) {
        await t.warning(
          `Skipping ${i} - missing or invalid metadata`
        );
        continue;
      }
      const d = [];
      if (c.instances) {
        const f = Re.fromTable(
          c.instances
        ).getSerializedTable();
        for (const m of Object.values(f))
          m.instanceType === "normal" && m.componentPageName && (d.includes(m.componentPageName) || d.push(m.componentPageName));
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
    } catch (r) {
      await t.error(
        `Error processing ${i}: ${r instanceof Error ? r.message : String(r)}`
      );
    }
  return a;
}
function $t(e) {
  const a = [], i = [], n = [], r = /* @__PURE__ */ new Map();
  for (const f of e)
    r.set(f.pageName, f);
  const c = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), d = [], p = (f) => {
    if (c.has(f.pageName))
      return !1;
    if (o.has(f.pageName)) {
      const m = d.findIndex(
        (h) => h.pageName === f.pageName
      );
      if (m !== -1) {
        const h = d.slice(m).concat([f]);
        return i.push(h), !0;
      }
      return !1;
    }
    o.add(f.pageName), d.push(f);
    for (const m of f.dependencies) {
      const h = r.get(m);
      h && p(h);
    }
    return o.delete(f.pageName), d.pop(), c.add(f.pageName), a.push(f), !1;
  };
  for (const f of e)
    c.has(f.pageName) || p(f);
  for (const f of e)
    for (const m of f.dependencies)
      r.has(m) || n.push(
        `Page "${f.pageName}" (${f.fileName}) depends on "${m}" which is not in the import set`
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
      const r = n.map((c) => `"${c.pageName}"`).join(" → ");
      await t.log(`  Cycle: ${r} → (back to start)`);
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
    const r = i.order[n];
    await t.log(`  ${n + 1}. ${r.fileName} ("${r.pageName}")`);
  }
  return i;
}
async function vt(e) {
  var y, x, M, U, O, R;
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
    errors: r
  } = await St(a);
  r.length > 0 && await t.warning(
    `Found ${r.length} dependency warning(s) - some dependencies may be missing`
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
    const C = "recursica:collectionId", k = async (F) => {
      const I = await figma.variables.getLocalVariableCollectionsAsync(), G = new Set(I.map((_) => _.name));
      if (!G.has(F))
        return F;
      let S = 1, P = `${F}_${S}`;
      for (; G.has(P); )
        S++, P = `${F}_${S}`;
      return P;
    }, L = [
      { choice: e.collectionChoices.tokens, normalizedName: "Tokens" },
      { choice: e.collectionChoices.theme, normalizedName: "Theme" },
      { choice: e.collectionChoices.layers, normalizedName: "Layer" }
    ];
    for (const { choice: F, normalizedName: I } of L)
      if (F === "new") {
        await t.log(
          `Processing collection type: "${I}" (choice: "new") - will create new collection`
        );
        const G = await k(I), S = figma.variables.createVariableCollection(G);
        if (ye(I)) {
          const P = Ge(I);
          P && (S.setSharedPluginData(
            "recursica",
            C,
            P
          ), await t.log(
            `  Stored fixed GUID: ${P.substring(0, 8)}...`
          ));
        }
        c.set(I, S), await t.log(
          `✓ Pre-created collection: "${G}" (normalized: "${I}", id: ${S.id.substring(0, 8)}...)`
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
  const p = [...r], f = [], m = {
    pageIds: [],
    collectionIds: [],
    variableIds: []
  }, h = [];
  if (c.size > 0)
    for (const C of c.values())
      m.collectionIds.push(C.id), await t.log(
        `Tracking pre-created collection: "${C.name}" (${C.id.substring(0, 8)}...)`
      );
  const s = e.mainFileName;
  for (let C = 0; C < i.length; C++) {
    const k = i[C], L = s ? k.fileName === s : C === i.length - 1;
    await t.log(
      `[${C + 1}/${i.length}] Importing ${k.fileName} ("${k.pageName}")${L ? " [MAIN]" : " [DEPENDENCY]"}...`
    );
    try {
      const F = C === 0, I = await bt({
        jsonData: k.jsonData,
        isMainPage: L,
        clearConsole: F,
        collectionChoices: e.collectionChoices,
        alwaysCreateCopy: !0,
        // Wizard imports always create copies (no prompts)
        skipUniqueNaming: (y = e.skipUniqueNaming) != null ? y : !1,
        constructionIcon: e.constructionIcon || "",
        preCreatedCollections: c
        // Pass pre-created collections for reuse
      });
      if (I.success) {
        if (o++, (x = I.data) != null && x.deferredInstances) {
          const G = I.data.deferredInstances;
          Array.isArray(G) && (await t.log(
            `  [DEBUG] Collected ${G.length} deferred instance(s) from ${k.fileName}`
          ), f.push(...G));
        } else
          await t.log(
            `  [DEBUG] No deferred instances in response for ${k.fileName}`
          );
        if ((M = I.data) != null && M.createdEntities) {
          const G = I.data.createdEntities;
          G.pageIds && m.pageIds.push(...G.pageIds), G.collectionIds && m.collectionIds.push(...G.collectionIds), G.variableIds && m.variableIds.push(...G.variableIds);
          const S = ((U = G.pageIds) == null ? void 0 : U[0]) || ((O = I.data) == null ? void 0 : O.pageId);
          (R = I.data) != null && R.pageName && S && h.push({
            name: I.data.pageName,
            pageId: S
          });
        }
      } else
        d++, p.push(
          `Failed to import ${k.fileName}: ${I.message || "Unknown error"}`
        );
    } catch (F) {
      d++;
      const I = F instanceof Error ? F.message : String(F);
      p.push(`Failed to import ${k.fileName}: ${I}`);
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
      ), C.errors.length > 0 && p.push(...C.errors);
    } catch (C) {
      p.push(
        `Failed to resolve deferred instances: ${C instanceof Error ? C.message : String(C)}`
      );
    }
  }
  const b = Array.from(
    new Set(m.collectionIds)
  ), l = Array.from(
    new Set(m.variableIds)
  ), E = Array.from(new Set(m.pageIds));
  if (await t.log("=== Import Summary ==="), await t.log(
    `  Imported: ${o}, Failed: ${d}, Deferred instances: ${f.length}`
  ), await t.log(
    `  Collections in allCreatedEntityIds: ${m.collectionIds.length}, Unique: ${b.length}`
  ), b.length > 0) {
    await t.log(
      `  Created ${b.length} collection(s)`
    );
    for (const C of b)
      try {
        const k = await figma.variables.getVariableCollectionByIdAsync(C);
        k && await t.log(
          `    - "${k.name}" (${C.substring(0, 8)}...)`
        );
      } catch (k) {
      }
  }
  const g = d === 0, u = g ? `Successfully imported ${o} page(s)${f.length > 0 ? ` (${f.length} deferred instance(s) resolved)` : ""}` : `Import completed with ${d} failure(s). ${p.join("; ")}`;
  return {
    type: "importPagesInOrder",
    success: g,
    error: !g,
    message: u,
    data: {
      imported: o,
      failed: d,
      deferred: f.length,
      errors: p,
      importedPages: h,
      createdEntities: {
        pageIds: E,
        collectionIds: b,
        variableIds: l
      }
    }
  };
}
async function Ra(e) {
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
    const r = await je(
      n,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + n.name + " (index: " + i + ")"
    );
    const c = JSON.stringify(r, null, 2), o = JSON.parse(c), d = "Copy - " + o.name, p = figma.createPage();
    if (p.name = d, figma.root.appendChild(p), o.children && o.children.length > 0) {
      let h = function(b) {
        b.forEach((l) => {
          const E = (l.x || 0) + (l.width || 0);
          E > s && (s = E), l.children && l.children.length > 0 && h(l.children);
        });
      };
      console.log(
        "Recreating " + o.children.length + " top-level children..."
      );
      let s = 0;
      h(o.children), console.log("Original content rightmost edge: " + s);
      for (const b of o.children)
        await Pe(b, p, null, null);
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
async function xa(e) {
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
function me(e, a, i = {}) {
  const n = a instanceof Error ? a.message : a;
  return {
    type: e,
    success: !1,
    error: !0,
    message: n,
    data: i
  };
}
const Et = "RecursicaPublishedMetadata";
async function za(e) {
  try {
    const a = figma.currentPage;
    await figma.loadAllPagesAsync();
    const n = figma.root.children.findIndex(
      (d) => d.id === a.id
    ), r = a.getPluginData(Et);
    if (!r) {
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
      componentMetadata: JSON.parse(r),
      currentPageIndex: n
    };
    return se("getComponentMetadata", o);
  } catch (a) {
    return console.error("Error getting component metadata:", a), me(
      "getComponentMetadata",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function _a(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children, i = [];
    for (const r of a) {
      if (r.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${r.name} (type: ${r.type})`
        );
        continue;
      }
      const c = r, o = c.getPluginData(Et);
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
        const p = {
          _ver: 1,
          id: "",
          name: Fe(c.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        i.push(p);
      }
    }
    return se("getAllComponents", {
      components: i
    });
  } catch (a) {
    return console.error("Error getting all components:", a), me(
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
const le = "RecursicaPrimaryImport", ie = "RecursicaUnderReview", Nt = "---", At = "---", pe = "RecursicaImportDivider", Ne = "start", Ae = "end", be = "⚠️";
async function Ha(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children;
    for (const n of a) {
      if (n.type !== "PAGE")
        continue;
      const r = n.getPluginData(le);
      if (r)
        try {
          const o = JSON.parse(r), d = {
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
      if (n.getPluginData(ie) === "true") {
        const o = n.getPluginData(le);
        if (o)
          try {
            const d = JSON.parse(o), p = {
              exists: !0,
              pageId: n.id,
              metadata: d
            };
            return se(
              "checkForExistingPrimaryImport",
              p
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
    return console.error("Error checking for existing primary import:", a), me(
      "checkForExistingPrimaryImport",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function Ja(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children.find(
      (d) => d.type === "PAGE" && d.getPluginData(pe) === Ne
    ), i = figma.root.children.find(
      (d) => d.type === "PAGE" && d.getPluginData(pe) === Ae
    );
    if (a && i) {
      const d = {
        startDividerId: a.id,
        endDividerId: i.id
      };
      return se("createImportDividers", d);
    }
    const n = figma.createPage();
    n.name = Nt, n.setPluginData(pe, Ne), n.setPluginData(ie, "true");
    const r = figma.createPage();
    r.name = At, r.setPluginData(pe, Ae), r.setPluginData(ie, "true");
    const c = figma.root.children.indexOf(n);
    figma.root.insertChild(c + 1, r), await t.log("Created import dividers");
    const o = {
      startDividerId: n.id,
      endDividerId: r.id
    };
    return se("createImportDividers", o);
  } catch (a) {
    return console.error("Error creating import dividers:", a), me(
      "createImportDividers",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function Wa(e) {
  var a, i, n, r, c, o, d;
  try {
    await t.log("=== Starting Single Component Import ==="), await t.log("Creating start divider..."), await figma.loadAllPagesAsync();
    let p = figma.root.children.find(
      (S) => S.type === "PAGE" && S.getPluginData(pe) === Ne
    );
    p || (p = figma.createPage(), p.name = Nt, p.setPluginData(pe, Ne), p.setPluginData(ie, "true"), await t.log("Created start divider"));
    const m = [
      ...e.dependencies.filter(
        (S) => !S.useExisting
      ).map((S) => ({
        fileName: `${S.name}.json`,
        jsonData: S.jsonData
      })),
      {
        fileName: `${e.mainComponent.name}.json`,
        jsonData: e.mainComponent.jsonData
      }
    ];
    await t.log(
      `Importing ${m.length} file(s) in dependency order...`
    );
    const h = await vt({
      jsonFiles: m,
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
    if (!h.success)
      throw new Error(
        h.message || "Failed to import pages in order"
      );
    await figma.loadAllPagesAsync();
    const s = figma.root.children;
    let b = s.find(
      (S) => S.type === "PAGE" && S.getPluginData(pe) === Ae
    );
    if (!b) {
      b = figma.createPage(), b.name = At, b.setPluginData(
        pe,
        Ae
      ), b.setPluginData(ie, "true");
      let S = s.length;
      for (let P = s.length - 1; P >= 0; P--) {
        const _ = s[P];
        if (_.type === "PAGE" && _.getPluginData(pe) !== Ne && _.getPluginData(pe) !== Ae) {
          S = P + 1;
          break;
        }
      }
      figma.root.insertChild(S, b), await t.log("Created end divider");
    }
    await t.log(
      `Import result data structure: ${JSON.stringify(Object.keys(h.data || {}))}`
    );
    const l = h.data;
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
    const E = "RecursicaPublishedMetadata", g = e.mainComponent.guid;
    await t.log(
      `Looking for main page by GUID: ${g.substring(0, 8)}...`
    );
    let u, y = null;
    for (const S of l.importedPages)
      try {
        const P = await figma.getNodeByIdAsync(
          S.pageId
        );
        if (P && P.type === "PAGE") {
          const _ = P.getPluginData(E);
          if (_)
            try {
              if (JSON.parse(_).id === g) {
                u = S.pageId, y = P, await t.log(
                  `Found main page by GUID: "${P.name}" (ID: ${S.pageId.substring(0, 12)}...)`
                );
                break;
              }
            } catch (z) {
            }
        }
      } catch (P) {
        await t.warning(
          `Error checking page ${S.pageId}: ${P}`
        );
      }
    if (!u) {
      await t.log(
        "Main page not found in importedPages list, searching all pages by GUID..."
      ), await figma.loadAllPagesAsync();
      const S = figma.root.children;
      for (const P of S)
        if (P.type === "PAGE") {
          const _ = P.getPluginData(E);
          if (_)
            try {
              if (JSON.parse(_).id === g) {
                u = P.id, y = P, await t.log(
                  `Found main page by GUID in all pages: "${P.name}" (ID: ${P.id.substring(0, 12)}...)`
                );
                break;
              }
            } catch (z) {
            }
        }
    }
    if (!u || !y) {
      await t.error(
        `Failed to find imported main page by GUID: ${g.substring(0, 8)}...`
      ), await t.log("Imported pages were:");
      for (const S of l.importedPages)
        await t.log(
          `  - "${S.name}" (ID: ${S.pageId.substring(0, 12)}...)`
        );
      throw new Error("Failed to find imported main page ID");
    }
    if (!y || y.type !== "PAGE")
      throw new Error("Failed to get main page node");
    for (const S of l.importedPages)
      try {
        const P = await figma.getNodeByIdAsync(
          S.pageId
        );
        if (P && P.type === "PAGE") {
          P.setPluginData(ie, "true");
          const _ = P.name.replace(/_\d+$/, "");
          if (!_.startsWith(be))
            P.name = `${be} ${_}`;
          else {
            const z = _.replace(be, "").trim();
            P.name = `${be} ${z}`;
          }
        }
      } catch (P) {
        await t.warning(
          `Failed to mark page ${S.pageId} as under review: ${P}`
        );
      }
    await figma.loadAllPagesAsync();
    const x = figma.root.children, M = x.find(
      (S) => S.type === "PAGE" && (S.name === "REMOTES" || S.name === `${be} REMOTES`)
    );
    M && (M.setPluginData(ie, "true"), M.name.startsWith(be) || (M.name = `${be} REMOTES`), await t.log(
      "Marked REMOTES page as under review and ensured construction icon"
    ));
    const U = x.find(
      (S) => S.type === "PAGE" && S.getPluginData(pe) === Ne
    ), O = x.find(
      (S) => S.type === "PAGE" && S.getPluginData(pe) === Ae
    );
    if (U && O) {
      const S = x.indexOf(U), P = x.indexOf(O);
      for (let _ = S + 1; _ < P; _++) {
        const z = x[_];
        z.type === "PAGE" && z.getPluginData(ie) !== "true" && (z.setPluginData(ie, "true"), await t.log(
          `Marked page "${z.name}" as under review (found between dividers)`
        ));
      }
    }
    const R = [], C = [];
    if (await t.log(
      `[EXTRACTION] Starting collection extraction. Collection IDs in result: ${((c = (r = l == null ? void 0 : l.createdEntities) == null ? void 0 : r.collectionIds) == null ? void 0 : c.length) || 0}`
    ), (o = l == null ? void 0 : l.createdEntities) != null && o.collectionIds) {
      await t.log(
        `[EXTRACTION] Collection IDs to process: ${l.createdEntities.collectionIds.map((S) => S.substring(0, 8) + "...").join(", ")}`
      );
      for (const S of l.createdEntities.collectionIds)
        try {
          const P = await figma.variables.getVariableCollectionByIdAsync(S);
          P ? (R.push({
            collectionId: P.id,
            collectionName: P.name
          }), await t.log(
            `[EXTRACTION] ✓ Extracted collection: "${P.name}" (${S.substring(0, 8)}...)`
          )) : await t.warning(
            `[EXTRACTION] Collection ${S.substring(0, 8)}... not found`
          );
        } catch (P) {
          await t.warning(
            `[EXTRACTION] Failed to get collection ${S.substring(0, 8)}...: ${P}`
          );
        }
    } else
      await t.warning(
        "[EXTRACTION] No collectionIds found in importResultData.createdEntities"
      );
    await t.log(
      `[EXTRACTION] Total collections extracted: ${R.length}`
    ), R.length > 0 && await t.log(
      `[EXTRACTION] Extracted collections: ${R.map((S) => `"${S.collectionName}" (${S.collectionId.substring(0, 8)}...)`).join(", ")}`
    );
    const k = new Set(
      R.map((S) => S.collectionId)
    );
    if ((d = l == null ? void 0 : l.createdEntities) != null && d.variableIds)
      for (const S of l.createdEntities.variableIds)
        try {
          const P = await figma.variables.getVariableByIdAsync(S);
          if (P && P.resolvedType && !k.has(P.variableCollectionId)) {
            const _ = await figma.variables.getVariableCollectionByIdAsync(
              P.variableCollectionId
            );
            _ && C.push({
              variableId: P.id,
              variableName: P.name,
              collectionId: P.variableCollectionId,
              collectionName: _.name
            });
          }
        } catch (P) {
          await t.warning(
            `Failed to get variable ${S}: ${P}`
          );
        }
    const L = {
      componentGuid: e.mainComponent.guid,
      componentVersion: e.mainComponent.version,
      componentName: e.mainComponent.name,
      importDate: (/* @__PURE__ */ new Date()).toISOString(),
      wizardSelections: e.wizardSelections,
      variableSummary: e.variableSummary,
      createdCollections: R,
      createdVariables: C,
      importError: void 0
      // No error yet
    };
    await t.log(
      `Storing metadata with ${R.length} collection(s) and ${C.length} variable(s)`
    ), y.setPluginData(
      le,
      JSON.stringify(L)
    ), y.setPluginData(ie, "true"), await t.log(
      "Stored primary import metadata on main page and marked as under review"
    );
    const F = [];
    l.importedPages && F.push(
      ...l.importedPages.map((S) => S.pageId)
    ), await t.log("=== Single Component Import Complete ==="), L.importError = void 0, await t.log(
      `[METADATA] About to store metadata with ${R.length} collection(s) and ${C.length} variable(s)`
    ), R.length > 0 && await t.log(
      `[METADATA] Collections to store: ${R.map((S) => `"${S.collectionName}" (${S.collectionId.substring(0, 8)}...)`).join(", ")}`
    ), y.setPluginData(
      le,
      JSON.stringify(L)
    ), await t.log(
      `[METADATA] Stored metadata: ${R.length} collection(s), ${C.length} variable(s)`
    );
    const I = y.getPluginData(le);
    if (I)
      try {
        const S = JSON.parse(I);
        await t.log(
          `[METADATA] Verification: Stored metadata has ${S.createdCollections.length} collection(s) and ${S.createdVariables.length} variable(s)`
        );
      } catch (S) {
        await t.warning(
          "[METADATA] Failed to verify stored metadata"
        );
      }
    const G = {
      success: !0,
      mainPageId: y.id,
      importedPageIds: F,
      createdCollections: R,
      createdVariables: C
    };
    return se("importSingleComponentWithWizard", G);
  } catch (p) {
    const f = p instanceof Error ? p.message : "Unknown error occurred";
    await t.error(`Import failed: ${f}`);
    try {
      await figma.loadAllPagesAsync();
      const m = figma.root.children;
      let h = null;
      for (const s of m) {
        if (s.type !== "PAGE") continue;
        const b = s.getPluginData(le);
        if (b)
          try {
            if (JSON.parse(b).componentGuid === e.mainComponent.guid) {
              h = s;
              break;
            }
          } catch (l) {
          }
      }
      if (h) {
        const s = h.getPluginData(le);
        if (s)
          try {
            const b = JSON.parse(s);
            await t.log(
              `[CATCH] Found existing metadata with ${b.createdCollections.length} collection(s) and ${b.createdVariables.length} variable(s)`
            ), b.importError = f, h.setPluginData(
              le,
              JSON.stringify(b)
            ), await t.log(
              `[CATCH] Updated existing metadata with error. Collections: ${b.createdCollections.length}, Variables: ${b.createdVariables.length}`
            );
          } catch (b) {
            await t.warning(
              `[CATCH] Failed to update metadata: ${b}`
            );
          }
      } else {
        await t.log(
          "No existing metadata found, attempting to collect created entities for cleanup..."
        );
        const s = [];
        for (const E of m) {
          if (E.type !== "PAGE") continue;
          E.getPluginData(ie) === "true" && s.push(E);
        }
        const b = [];
        if (e.wizardSelections) {
          const E = await figma.variables.getLocalVariableCollectionsAsync(), g = [
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
          for (const { choice: u, normalizedName: y } of g)
            if (u === "new") {
              const x = E.filter((M) => de(M.name) === y);
              if (x.length > 0) {
                const M = x[0];
                b.push({
                  collectionId: M.id,
                  collectionName: M.name
                }), await t.log(
                  `Found created collection: "${M.name}" (${M.id.substring(0, 8)}...)`
                );
              }
            }
        }
        const l = [];
        if (s.length > 0) {
          const E = s[0], g = {
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
            createdVariables: l,
            importError: f
          };
          E.setPluginData(
            le,
            JSON.stringify(g)
          ), await t.log(
            `Created fallback metadata with ${b.length} collection(s) and error information`
          );
        }
      }
    } catch (m) {
      await t.warning(
        `Failed to store error metadata: ${m instanceof Error ? m.message : String(m)}`
      );
    }
    return me(
      "importSingleComponentWithWizard",
      p instanceof Error ? p : new Error(String(p))
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
    const r = figma.root.children, c = [];
    for (const s of r) {
      if (s.type !== "PAGE")
        continue;
      s.getPluginData(ie) === "true" && (c.push(s), await t.log(
        `Found page to delete: "${s.name}" (under review)`
      ));
    }
    await t.log(
      `Deleting ${n.createdVariables.length} variable(s) from existing collections...`
    );
    let o = 0;
    for (const s of n.createdVariables)
      try {
        const b = await figma.variables.getVariableByIdAsync(
          s.variableId
        );
        b ? (b.remove(), o++, await t.log(
          `Deleted variable: ${s.variableName} from collection ${s.collectionName}`
        )) : await t.warning(
          `Variable ${s.variableName} (${s.variableId}) not found - may have already been deleted`
        );
      } catch (b) {
        await t.warning(
          `Failed to delete variable ${s.variableName}: ${b instanceof Error ? b.message : String(b)}`
        );
      }
    await t.log(
      `Deleting ${n.createdCollections.length} collection(s)...`
    );
    let d = 0;
    for (const s of n.createdCollections)
      try {
        const b = await figma.variables.getVariableCollectionByIdAsync(
          s.collectionId
        );
        b ? (b.remove(), d++, await t.log(
          `Deleted collection: ${s.collectionName} (${s.collectionId})`
        )) : await t.warning(
          `Collection ${s.collectionName} (${s.collectionId}) not found - may have already been deleted`
        );
      } catch (b) {
        await t.warning(
          `Failed to delete collection ${s.collectionName}: ${b instanceof Error ? b.message : String(b)}`
        );
      }
    const p = c.map((s) => ({
      page: s,
      name: s.name,
      id: s.id
    })), f = figma.currentPage;
    if (p.some(
      (s) => s.id === f.id
    )) {
      await figma.loadAllPagesAsync();
      const b = figma.root.children.find(
        (l) => l.type === "PAGE" && !p.some((E) => E.id === l.id)
      );
      b ? (await figma.setCurrentPageAsync(b), await t.log(
        `Switched away from page "${f.name}" before deletion`
      )) : await t.warning(
        "No safe page to switch to - all pages are being deleted"
      );
    }
    for (const { page: s, name: b } of p)
      try {
        let l = !1;
        try {
          await figma.loadAllPagesAsync(), l = figma.root.children.some((g) => g.id === s.id);
        } catch (E) {
          l = !1;
        }
        if (!l) {
          await t.log(`Page "${b}" already deleted, skipping`);
          continue;
        }
        if (figma.currentPage.id === s.id) {
          await figma.loadAllPagesAsync();
          const g = figma.root.children.find(
            (u) => u.type === "PAGE" && u.id !== s.id && !p.some((y) => y.id === u.id)
          );
          g && await figma.setCurrentPageAsync(g);
        }
        s.remove(), await t.log(`Deleted page: "${b}"`);
      } catch (l) {
        await t.warning(
          `Failed to delete page "${b}": ${l instanceof Error ? l.message : String(l)}`
        );
      }
    await t.log("=== Import Group Deletion Complete ===");
    const h = {
      success: !0,
      deletedPages: c.length,
      deletedCollections: d,
      deletedVariables: o
    };
    return se("deleteImportGroup", h);
  } catch (a) {
    const i = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Delete failed: ${i}`), me(
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
    for (const p of a) {
      if (p.type !== "PAGE")
        continue;
      if (p.getPluginData(le)) {
        i = p;
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
    for (const p of a) {
      if (p.type !== "PAGE")
        continue;
      p.getPluginData(ie) === "true" && n.push({ id: p.id, name: p.name });
    }
    const r = figma.currentPage;
    if (n.some(
      (p) => p.id === r.id
    )) {
      await figma.loadAllPagesAsync();
      const f = figma.root.children.find(
        (m) => m.type === "PAGE" && !n.some((h) => h.id === m.id)
      );
      f && (await figma.setCurrentPageAsync(f), await t.log(
        `Switched away from page "${r.name}" before deletion`
      ));
    }
    let o = 0;
    for (const p of n)
      try {
        await figma.loadAllPagesAsync();
        const f = await figma.getNodeByIdAsync(
          p.id
        );
        if (!f || f.type !== "PAGE")
          continue;
        if (figma.currentPage.id === f.id) {
          await figma.loadAllPagesAsync();
          const h = figma.root.children.find(
            (s) => s.type === "PAGE" && s.id !== f.id && !n.some((b) => b.id === s.id)
          );
          h && await figma.setCurrentPageAsync(h);
        }
        f.remove(), o++, await t.log(`Deleted page: "${p.name}"`);
      } catch (f) {
        await t.warning(
          `Failed to delete page "${p.name}" (${p.id.substring(0, 8)}...): ${f instanceof Error ? f.message : String(f)}`
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
    return await t.error(`Cleanup failed: ${i}`), me(
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
    a.setPluginData(le, ""), a.setPluginData(ie, "");
    const i = figma.root.children;
    for (const r of i)
      if (r.type === "PAGE" && r.getPluginData(ie) === "true") {
        const o = r.getPluginData(le);
        if (o)
          try {
            JSON.parse(o), r.setPluginData(ie, "");
          } catch (d) {
            r.setPluginData(ie, "");
          }
        else
          r.setPluginData(ie, "");
      }
    return await t.log(
      "Cleared import metadata from page and related pages"
    ), se("clearImportMetadata", {
      success: !0
    });
  } catch (a) {
    const i = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Clear metadata failed: ${i}`), me(
      "clearImportMetadata",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function Xa(e) {
  try {
    await t.log("=== Summarizing Variables for Wizard ===");
    const a = [];
    for (const { fileName: b, jsonData: l } of e.jsonFiles)
      try {
        const E = Qe(l);
        if (!E.success || !E.expandedJsonData) {
          await t.warning(
            `Skipping ${b} - failed to expand JSON: ${E.error || "Unknown error"}`
          );
          continue;
        }
        const g = E.expandedJsonData;
        if (!g.collections)
          continue;
        const y = Oe.fromTable(
          g.collections
        );
        if (!g.variables)
          continue;
        const M = Me.fromTable(g.variables).getTable();
        for (const U of Object.values(M)) {
          if (U._colRef === void 0)
            continue;
          const O = y.getCollectionByIndex(
            U._colRef
          );
          if (O) {
            const C = de(
              O.collectionName
            ).toLowerCase();
            (C === "tokens" || C === "theme" || C === "layer") && a.push({
              name: U.variableName,
              collectionName: C
              // Use lowercase for consistency ("layer" not "layers")
            });
          }
        }
      } catch (E) {
        await t.warning(
          `Error processing ${b}: ${E instanceof Error ? E.message : String(E)}`
        );
        continue;
      }
    const i = await figma.variables.getLocalVariableCollectionsAsync();
    let n = null, r = null, c = null;
    for (const b of i) {
      const E = de(b.name).toLowerCase();
      (E === "tokens" || E === "token") && !n ? n = b : (E === "theme" || E === "themes") && !r ? r = b : (E === "layer" || E === "layers") && !c && (c = b);
    }
    const o = a.filter(
      (b) => b.collectionName === "tokens"
    ), d = a.filter((b) => b.collectionName === "theme"), p = a.filter((b) => b.collectionName === "layer"), f = {
      existing: 0,
      new: 0
    }, m = {
      existing: 0,
      new: 0
    }, h = {
      existing: 0,
      new: 0
    };
    if (e.tokensCollection === "existing" && n) {
      const b = /* @__PURE__ */ new Set();
      for (const l of n.variableIds)
        try {
          const E = figma.variables.getVariableById(l);
          E && b.add(E.name);
        } catch (E) {
          continue;
        }
      for (const l of o)
        b.has(l.name) ? f.existing++ : f.new++;
    } else
      f.new = o.length;
    if (e.themeCollection === "existing" && r) {
      const b = /* @__PURE__ */ new Set();
      for (const l of r.variableIds)
        try {
          const E = figma.variables.getVariableById(l);
          E && b.add(E.name);
        } catch (E) {
          continue;
        }
      for (const l of d)
        b.has(l.name) ? m.existing++ : m.new++;
    } else
      m.new = d.length;
    if (e.layersCollection === "existing" && c) {
      const b = /* @__PURE__ */ new Set();
      for (const l of c.variableIds)
        try {
          const E = figma.variables.getVariableById(l);
          E && b.add(E.name);
        } catch (E) {
          continue;
        }
      for (const l of p)
        b.has(l.name) ? h.existing++ : h.new++;
    } else
      h.new = p.length;
    return await t.log(
      `Variable summary: Tokens - ${f.existing} existing, ${f.new} new; Theme - ${m.existing} existing, ${m.new} new; Layers - ${h.existing} existing, ${h.new} new`
    ), se("summarizeVariablesForWizard", {
      tokens: f,
      theme: m,
      layers: h
    });
  } catch (a) {
    const i = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Summarize failed: ${i}`), me(
      "summarizeVariablesForWizard",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function Ya(e) {
  try {
    const a = "recursica:collectionId", n = {
      collections: (await figma.variables.getLocalVariableCollectionsAsync()).map((r) => {
        const c = r.getSharedPluginData("recursica", a);
        return {
          id: r.id,
          name: r.name,
          guid: c || void 0
        };
      })
    };
    return se(
      "getLocalVariableCollections",
      n
    );
  } catch (a) {
    return me(
      "getLocalVariableCollections",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function Za(e) {
  try {
    const a = "recursica:collectionId", i = [];
    for (const r of e.collectionIds)
      try {
        const c = await figma.variables.getVariableCollectionByIdAsync(r);
        if (c) {
          const o = c.getSharedPluginData(
            "recursica",
            a
          );
          i.push({
            collectionId: r,
            guid: o || null
          });
        } else
          i.push({
            collectionId: r,
            guid: null
          });
      } catch (c) {
        await t.warning(
          `Failed to get GUID for collection ${r}: ${c instanceof Error ? c.message : String(c)}`
        ), i.push({
          collectionId: r,
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
    return me(
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
    let r = 0, c = 0;
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
          let y = null;
          if (g.existingCollectionId)
            y = await figma.variables.getVariableCollectionByIdAsync(
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
                  y = L;
                  break;
                }
              if (!y && (C === we.LAYER || C === we.TOKENS || C === we.THEME)) {
                let L;
                C === we.LAYER ? L = he.LAYER : C === we.TOKENS ? L = he.TOKENS : L = he.THEME;
                for (const F of k)
                  if (F.getSharedPluginData(
                    "recursica",
                    o
                  ) === C && F.name === L && F.id !== g.newCollectionId) {
                    y = F;
                    break;
                  }
                y || (y = figma.variables.createVariableCollection(L), y.setSharedPluginData(
                  "recursica",
                  o,
                  C
                ), await t.log(
                  `Created new standard collection: "${L}"`
                ));
              }
            }
          }
          if (!y) {
            await t.warning(
              "Could not find or create existing collection for merge, skipping"
            );
            continue;
          }
          await t.log(
            `Merging collection "${u.name}" (${g.newCollectionId.substring(0, 8)}...) into "${y.name}" (${y.id.substring(0, 8)}...)`
          );
          const x = u.variableIds.map(
            (C) => figma.variables.getVariableByIdAsync(C)
          ), M = await Promise.all(x), U = y.variableIds.map(
            (C) => figma.variables.getVariableByIdAsync(C)
          ), O = await Promise.all(U), R = new Set(
            O.filter((C) => C !== null).map((C) => C.name)
          );
          for (const C of M)
            if (C)
              try {
                if (R.has(C.name)) {
                  await t.warning(
                    `Variable "${C.name}" already exists in collection "${y.name}", skipping`
                  );
                  continue;
                }
                const k = figma.variables.createVariable(
                  C.name,
                  y,
                  C.resolvedType
                );
                for (const L of y.modes) {
                  const F = L.modeId;
                  let I = C.valuesByMode[F];
                  if (I === void 0 && u.modes.length > 0) {
                    const G = u.modes[0].modeId;
                    I = C.valuesByMode[G];
                  }
                  I !== void 0 && k.setValueForMode(F, I);
                }
                await t.log(
                  `  ✓ Copied variable "${C.name}" to collection "${y.name}"`
                );
              } catch (k) {
                await t.warning(
                  `Failed to copy variable "${C.name}": ${k instanceof Error ? k.message : String(k)}`
                );
              }
          u.remove(), r++, await t.log(
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
    const d = figma.root.children, p = [];
    for (const g of d) {
      if (g.type !== "PAGE") continue;
      const u = g.getPluginData(pe);
      (u === "start" || u === "end") && p.push(g);
    }
    const f = figma.currentPage;
    if (p.some((g) => g.id === f.id))
      if (a && a.id !== f.id)
        figma.currentPage = a;
      else {
        const g = d.find(
          (u) => u.type === "PAGE" && !p.some((y) => y.id === u.id)
        );
        g && (figma.currentPage = g);
      }
    const m = p.map((g) => g.name);
    for (const g of p)
      try {
        g.remove();
      } catch (u) {
        await t.warning(
          `Failed to delete divider: ${u instanceof Error ? u.message : String(u)}`
        );
      }
    for (const g of m)
      await t.log(`Deleted divider: ${g}`);
    await t.log("Removing construction icons and renaming pages..."), await figma.loadAllPagesAsync();
    const h = figma.root.children;
    let s = 0;
    const b = "RecursicaPublishedMetadata", l = [];
    for (const g of h)
      if (g.type === "PAGE")
        try {
          if (g.getPluginData(ie) === "true") {
            const y = g.getPluginData(b);
            let x = {};
            if (y)
              try {
                x = JSON.parse(y);
              } catch (M) {
              }
            l.push({
              pageId: g.id,
              pageName: g.name,
              pageMetadata: x
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
        let y = u.name;
        if (y.startsWith(be) && (y = y.substring(be.length).trim()), y === "REMOTES" || y.includes("REMOTES")) {
          u.name = "REMOTES", s++, await t.log(`Renamed page: "${u.name}" -> "REMOTES"`);
          continue;
        }
        const M = g.pageMetadata.name && g.pageMetadata.name.length > 0 && !g.pageMetadata.name.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        ) ? g.pageMetadata.name : n.componentName || y, U = g.pageMetadata.version !== void 0 ? g.pageMetadata.version : n.componentVersion, O = `${M} (VERSION: ${U})`;
        u.name = O, s++, await t.log(`Renamed page: "${y}" -> "${O}"`);
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
        u && u.type === "PAGE" && u.setPluginData(ie, "");
      } catch (u) {
        await t.warning(
          `Failed to clear under review metadata for page ${g.pageId}: ${u instanceof Error ? u.message : String(u)}`
        );
      }
    const E = {
      mergedCollections: r,
      keptCollections: c,
      pagesRenamed: s
    };
    return await t.log(
      `=== Merge Complete ===
  Merged: ${r} collection(s)
  Kept: ${c} collection(s)
  Renamed: ${s} page(s)`
    ), se(
      "mergeImportGroup",
      E
    );
  } catch (a) {
    return await t.error(
      `Merge failed: ${a instanceof Error ? a.message : String(a)}`
    ), me(
      "mergeImportGroup",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function ei(e) {
  var a, i, n, r, c;
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
    const p = figma.variables.createVariableCollection("Test"), f = p.modes[0], m = figma.variables.createVariable(
      "Spacing",
      p,
      "FLOAT"
    );
    m.setValueForMode(f.modeId, 16), await t.log(
      `Created variable: "${m.name}" = ${m.valuesByMode[f.modeId]} in collection "${p.name}"`
    );
    const h = [];
    await t.log(
      `
--- Approach 1: Set layoutMode, then immediately bind ---`
    );
    try {
      const l = figma.createFrame();
      l.name = "Test Frame 1 - Immediate Bind", d.appendChild(l), l.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL"), l.setBoundVariable("itemSpacing", m), await t.log(
        "  Set bound variable immediately after layoutMode"
      );
      const E = (a = l.boundVariables) == null ? void 0 : a.itemSpacing, g = l.itemSpacing, u = E !== void 0;
      await t.log(`  Result: ${u ? "SUCCESS" : "FAILED"}`), await t.log(`  itemSpacing value: ${g}`), await t.log(`  boundVariable: ${JSON.stringify(E)}`), h.push({
        approach: "1 - Immediate bind after layoutMode",
        success: u,
        message: u ? "Variable binding succeeded" : "Variable binding failed",
        details: {
          itemSpacing: g,
          boundVariable: E
        }
      });
    } catch (l) {
      await t.error(
        `  Approach 1 failed with error: ${l instanceof Error ? l.message : String(l)}`
      ), h.push({
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
      ), l.itemSpacing = 0, await t.log("  Set itemSpacing to 0"), l.setBoundVariable("itemSpacing", m), await t.log("  Set bound variable after clearing");
      const E = (i = l.boundVariables) == null ? void 0 : i.itemSpacing, g = l.itemSpacing, u = E !== void 0;
      await t.log(`  Result: ${u ? "SUCCESS" : "FAILED"}`), await t.log(`  itemSpacing value: ${g}`), await t.log(`  boundVariable: ${JSON.stringify(E)}`), h.push({
        approach: "2 - Clear then bind",
        success: u,
        message: u ? "Variable binding succeeded" : "Variable binding failed",
        details: {
          itemSpacing: g,
          boundVariable: E
        }
      });
    } catch (l) {
      await t.error(
        `  Approach 2 failed with error: ${l instanceof Error ? l.message : String(l)}`
      ), h.push({
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
        l.setBoundVariable("itemSpacing", m), await t.log("  Set bound variable before layoutMode");
      } catch (y) {
        await t.log(
          `  Could not set bound variable before layoutMode (expected): ${y instanceof Error ? y.message : String(y)}`
        );
      }
      l.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL");
      const E = (n = l.boundVariables) == null ? void 0 : n.itemSpacing, g = l.itemSpacing, u = E !== void 0;
      await t.log(`  Result: ${u ? "SUCCESS" : "FAILED"}`), await t.log(`  itemSpacing value: ${g}`), await t.log(`  boundVariable: ${JSON.stringify(E)}`), h.push({
        approach: "3 - Bind before layoutMode",
        success: u,
        message: u ? "Variable binding succeeded" : "Variable binding failed",
        details: {
          itemSpacing: g,
          boundVariable: E
        }
      });
    } catch (l) {
      await t.error(
        `  Approach 3 failed with error: ${l instanceof Error ? l.message : String(l)}`
      ), h.push({
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
      } catch (y) {
        await t.log(
          `  No bound variable to remove (expected): ${y instanceof Error ? y.message : String(y)}`
        );
      }
      l.setBoundVariable("itemSpacing", m), await t.log("  Set bound variable after remove");
      const E = (r = l.boundVariables) == null ? void 0 : r.itemSpacing, g = l.itemSpacing, u = E !== void 0;
      await t.log(`  Result: ${u ? "SUCCESS" : "FAILED"}`), await t.log(`  itemSpacing value: ${g}`), await t.log(`  boundVariable: ${JSON.stringify(E)}`), h.push({
        approach: "4 - Remove then bind",
        success: u,
        message: u ? "Variable binding succeeded" : "Variable binding failed",
        details: {
          itemSpacing: g,
          boundVariable: E
        }
      });
    } catch (l) {
      await t.error(
        `  Approach 4 failed with error: ${l instanceof Error ? l.message : String(l)}`
      ), h.push({
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
      l.name = "Test Frame 5 - Wait Then Bind", d.appendChild(l), l.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL"), await new Promise((y) => setTimeout(y, 10)), await t.log("  Waited 10ms"), l.setBoundVariable("itemSpacing", m), await t.log("  Set bound variable after wait");
      const E = (c = l.boundVariables) == null ? void 0 : c.itemSpacing, g = l.itemSpacing, u = E !== void 0;
      await t.log(`  Result: ${u ? "SUCCESS" : "FAILED"}`), await t.log(`  itemSpacing value: ${g}`), await t.log(`  boundVariable: ${JSON.stringify(E)}`), h.push({
        approach: "5 - Wait then bind",
        success: u,
        message: u ? "Variable binding succeeded" : "Variable binding failed",
        details: {
          itemSpacing: g,
          boundVariable: E
        }
      });
    } catch (l) {
      await t.error(
        `  Approach 5 failed with error: ${l instanceof Error ? l.message : String(l)}`
      ), h.push({
        approach: "5 - Wait then bind",
        success: !1,
        message: `Error: ${l instanceof Error ? l.message : String(l)}`
      });
    }
    await t.log(`
=== Test Summary ===`);
    const s = h.filter((l) => l.success), b = h.filter((l) => !l.success);
    await t.log(
      `Successful approaches: ${s.length}/${h.length}`
    );
    for (const l of h)
      await t.log(
        `  ${l.approach}: ${l.success ? "✓ SUCCESS" : "✗ FAILED"} - ${l.message}`
      );
    return {
      success: s.length > 0,
      message: `Test completed: ${s.length}/${h.length} approaches succeeded`,
      details: {
        results: h,
        successfulApproaches: s.map((l) => l.approach),
        failedApproaches: b.map((l) => l.approach)
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
  var a, i, n, r, c, o, d, p;
  try {
    await t.log(
      "=== Test: itemSpacing Variable Binding - Import Simulation ==="
    );
    const f = await figma.getNodeByIdAsync(e);
    if (!f || f.type !== "PAGE")
      throw new Error("Test page not found");
    const m = f.children.find(
      (H) => H.type === "FRAME" && H.name === "Test"
    );
    if (!m)
      throw new Error("Test frame container not found on page");
    await t.log("Creating test variable collection and variable...");
    const h = figma.variables.createVariableCollection("Test"), s = h.modes[0], b = figma.variables.createVariable(
      "Spacing",
      h,
      "FLOAT"
    );
    b.setValueForMode(s.modeId, 16), await t.log(
      `Created variable: "${b.name}" = ${b.valuesByMode[s.modeId]} in collection "${h.name}"`
    ), await t.log(`
--- Simulating Import Process ---`);
    const l = figma.createFrame();
    l.name = "Import Simulation Frame", m.appendChild(l), await t.log("  Created frame"), l.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL"), await t.log(
      `  itemSpacing after layoutMode: ${l.itemSpacing}`
    ), await t.log(
      "  Setting bound variable using setBoundVariable() API..."
    );
    try {
      l.setBoundVariable("itemSpacing", null);
    } catch (H) {
    }
    l.setBoundVariable("itemSpacing", b), await t.log(
      "  Called setBoundVariable('itemSpacing', variable)"
    );
    const E = (a = l.boundVariables) == null ? void 0 : a.itemSpacing, g = l.itemSpacing;
    if (await t.log(
      `  After setting binding: itemSpacing=${g}, boundVar=${JSON.stringify(E)}`
    ), !E)
      return {
        success: !1,
        message: "Binding failed immediately after setBoundVariable()",
        details: {
          itemSpacing: g,
          boundVariable: E
        }
      };
    await t.log("  Setting other layout properties..."), l.primaryAxisSizingMode = "AUTO", l.counterAxisSizingMode = "AUTO", l.primaryAxisAlignItems = "MIN", l.counterAxisAlignItems = "MIN", await t.log(
      "  Set primaryAxisSizingMode, counterAxisSizingMode, alignItems"
    );
    const u = (i = l.boundVariables) == null ? void 0 : i.itemSpacing, y = l.itemSpacing;
    await t.log(
      `  After layout properties: itemSpacing=${y}, boundVar=${JSON.stringify(u)}`
    ), await t.log("  Setting padding properties..."), l.paddingLeft = 0, l.paddingRight = 0, l.paddingTop = 0, l.paddingBottom = 0, await t.log("  Set padding to 0");
    const x = (n = l.boundVariables) == null ? void 0 : n.itemSpacing, M = l.itemSpacing;
    await t.log(
      `  After padding: itemSpacing=${M}, boundVar=${JSON.stringify(x)}`
    ), await t.log("  Simulating 'late setting' code...");
    const U = 0, O = !0, R = { itemSpacing: !0 }, C = ((r = l.boundVariables) == null ? void 0 : r.itemSpacing) !== void 0;
    U !== void 0 && l.layoutMode !== void 0 && (!C && (!O || !R.itemSpacing) || C && await t.log(
      "  ✓ Late setting correctly skipped (binding exists)"
    ));
    const k = (c = l.boundVariables) == null ? void 0 : c.itemSpacing, L = l.itemSpacing;
    await t.log(
      `  After late setting: itemSpacing=${L}, boundVar=${JSON.stringify(k)}`
    ), await t.log("  Appending children (might reset itemSpacing)...");
    const F = figma.createFrame();
    F.name = "Child 1", F.resize(50, 50), l.appendChild(F);
    const I = figma.createFrame();
    I.name = "Child 2", I.resize(50, 50), l.appendChild(I), await t.log("  Appended 2 children");
    const G = (o = l.boundVariables) == null ? void 0 : o.itemSpacing, S = l.itemSpacing;
    await t.log(
      `  After appending children: itemSpacing=${S}, boundVar=${JSON.stringify(G)}`
    ), await t.log("  Simulating 'FINAL FIX' code..."), ((d = l.boundVariables) == null ? void 0 : d.itemSpacing) !== void 0 ? await t.log(
      "  ✓ FINAL FIX correctly skipped (binding exists)"
    ) : !0 && await t.log(
      "  ⚠️ FINAL FIX: Binding should exist but doesn't!"
    );
    const z = (p = l.boundVariables) == null ? void 0 : p.itemSpacing, W = l.itemSpacing;
    await t.log(
      `  FINAL: itemSpacing=${W}, boundVar=${JSON.stringify(z)}`
    );
    const D = z !== void 0 && z.id === b.id;
    return await t.log(`
=== Import Simulation Summary ===`), await t.log(
      `Result: ${D ? "SUCCESS" : "FAILED"} - Binding ${D ? "survived" : "was lost"} through import simulation`
    ), {
      success: D,
      message: D ? "Variable binding survived the import simulation" : "Variable binding was lost during import simulation",
      details: {
        afterSet: {
          itemSpacing: g,
          boundVariable: E
        },
        afterLayout: {
          itemSpacing: y,
          boundVariable: u
        },
        afterPadding: {
          itemSpacing: M,
          boundVariable: x
        },
        afterLate: {
          itemSpacing: L,
          boundVariable: k
        },
        afterChildren: {
          itemSpacing: S,
          boundVariable: G
        },
        final: {
          itemSpacing: W,
          boundVariable: z
        }
      }
    };
  } catch (f) {
    const m = f instanceof Error ? f.message : "Unknown error occurred";
    return await t.error(`Import simulation test failed: ${m}`), {
      success: !1,
      message: `Test error: ${m}`
    };
  }
}
async function ai(e) {
  var a, i, n, r;
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
      (O) => O.type === "FRAME" && O.name === "Test"
    );
    if (!o)
      throw new Error("Test frame container not found on page");
    await t.log("Creating test variable collection and variable...");
    const d = figma.variables.createVariableCollection("Test"), p = d.modes[0], f = figma.variables.createVariable(
      "Spacing",
      d,
      "FLOAT"
    );
    f.setValueForMode(p.modeId, 16), await t.log(
      `Created variable: "${f.name}" = ${f.valuesByMode[p.modeId]} in collection "${d.name}"`
    ), await t.log(`
--- Simulating OLD BROKEN Import Process ---`);
    const m = figma.createFrame();
    m.name = "Failure Demo Frame", o.appendChild(m), await t.log("  Created frame"), m.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL"), await t.log(
      `  itemSpacing after layoutMode: ${m.itemSpacing}`
    ), await t.log(
      "  ⚠️ BROKEN: Attempting to set bound variable using direct assignment..."
    );
    try {
      m.boundVariables = ce(q({}, m.boundVariables || {}), {
        itemSpacing: {
          type: "VARIABLE_ALIAS",
          id: f.id
        }
      }), await t.log(
        "  Called (frame as any).boundVariables.itemSpacing = alias (BROKEN APPROACH)"
      );
    } catch (O) {
      await t.log(
        `  Direct assignment failed (expected): ${O instanceof Error ? O.message : String(O)}`
      );
    }
    const h = (a = m.boundVariables) == null ? void 0 : a.itemSpacing, s = m.itemSpacing;
    await t.log(
      `  After broken set: itemSpacing=${s}, boundVar=${JSON.stringify(h)}`
    ), await t.log(
      "  Attempting to fix by using setBoundVariable() API..."
    );
    try {
      m.setBoundVariable("itemSpacing", f), await t.log(
        "  Called setBoundVariable('itemSpacing', variable)"
      );
    } catch (O) {
      await t.log(
        `  setBoundVariable failed: ${O instanceof Error ? O.message : String(O)}`
      );
    }
    const b = (i = m.boundVariables) == null ? void 0 : i.itemSpacing, l = m.itemSpacing;
    await t.log(
      `  After correct set: itemSpacing=${l}, boundVar=${JSON.stringify(b)}`
    ), await t.log(
      "  ⚠️ BROKEN: Simulating 'late setting' code WITHOUT checking if bound..."
    );
    const E = 0;
    E !== void 0 && m.layoutMode !== void 0 && (await t.log(
      "  ⚠️ Late setting OVERRIDING itemSpacing without checking if bound!"
    ), m.itemSpacing = E);
    const g = (n = m.boundVariables) == null ? void 0 : n.itemSpacing, u = m.itemSpacing;
    await t.log(
      `  After broken late setting: itemSpacing=${u}, boundVar=${JSON.stringify(g)}`
    ), await t.log(
      "  ⚠️ BROKEN: Simulating 'FINAL FIX' code WITHOUT checking if bound..."
    );
    const y = 0;
    (m.layoutMode === "VERTICAL" || m.layoutMode === "HORIZONTAL") && y !== void 0 && (await t.log(
      "  ⚠️ FINAL FIX OVERRIDING itemSpacing without checking if bound!"
    ), m.itemSpacing = y);
    const x = (r = m.boundVariables) == null ? void 0 : r.itemSpacing, M = m.itemSpacing;
    await t.log(
      `  FINAL: itemSpacing=${M}, boundVar=${JSON.stringify(x)}`
    );
    const U = x === void 0;
    return await t.log(`
=== Failure Demonstration Summary ===`), await t.log(
      `Result: ${U ? "FAILURE DEMONSTRATED ✓" : "UNEXPECTED - Binding survived"} - ${U ? "Binding was lost as expected (demonstrating the bug)" : "Binding survived (unexpected - bug may be fixed)"}`
    ), {
      success: U,
      // Success = we demonstrated the failure
      message: U ? "Failure demonstrated: Binding was lost using old broken approach" : "Unexpected: Binding survived (bug may already be fixed)",
      details: {
        afterBrokenSet: {
          itemSpacing: s,
          boundVariable: h
        },
        afterCorrectSet: {
          itemSpacing: l,
          boundVariable: b
        },
        afterLate: {
          itemSpacing: u,
          boundVariable: g
        },
        final: {
          itemSpacing: M,
          boundVariable: x
        },
        bindingLost: U
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
  var a, i, n, r, c, o, d, p;
  try {
    await t.log(
      "=== Test: itemSpacing Variable Binding - FIX DEMONSTRATION ==="
    ), await t.log(
      "This test demonstrates the NEW FIXED approach that correctly preserves binding."
    );
    const f = await figma.getNodeByIdAsync(e);
    if (!f || f.type !== "PAGE")
      throw new Error("Test page not found");
    const m = f.children.find(
      (H) => H.type === "FRAME" && H.name === "Test"
    );
    if (!m)
      throw new Error("Test frame container not found on page");
    await t.log("Creating test variable collection and variable...");
    const h = figma.variables.createVariableCollection("Test"), s = h.modes[0], b = figma.variables.createVariable(
      "Spacing",
      h,
      "FLOAT"
    );
    b.setValueForMode(s.modeId, 16), await t.log(
      `Created variable: "${b.name}" = ${b.valuesByMode[s.modeId]} in collection "${h.name}"`
    ), await t.log(`
--- Simulating NEW FIXED Import Process ---`);
    const l = figma.createFrame();
    l.name = "Fix Demo Frame", m.appendChild(l), await t.log("  Created frame"), l.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL"), await t.log(
      `  itemSpacing after layoutMode: ${l.itemSpacing}`
    ), await t.log(
      "  ✓ FIXED: Setting bound variable using setBoundVariable() API..."
    );
    try {
      l.setBoundVariable("itemSpacing", null);
    } catch (H) {
    }
    l.setBoundVariable("itemSpacing", b), await t.log(
      "  Called setBoundVariable('itemSpacing', variable) (CORRECT APPROACH)"
    );
    const E = (a = l.boundVariables) == null ? void 0 : a.itemSpacing, g = l.itemSpacing;
    if (await t.log(
      `  After setting binding: itemSpacing=${g}, boundVar=${JSON.stringify(E)}`
    ), !E)
      return {
        success: !1,
        message: "Binding failed immediately after setBoundVariable()",
        details: {
          itemSpacing: g,
          boundVariable: E
        }
      };
    await t.log("  Setting other layout properties..."), l.primaryAxisSizingMode = "AUTO", l.counterAxisSizingMode = "AUTO", l.primaryAxisAlignItems = "MIN", l.counterAxisAlignItems = "MIN", await t.log(
      "  Set primaryAxisSizingMode, counterAxisSizingMode, alignItems"
    );
    const u = (i = l.boundVariables) == null ? void 0 : i.itemSpacing, y = l.itemSpacing;
    await t.log(
      `  After layout properties: itemSpacing=${y}, boundVar=${JSON.stringify(u)}`
    ), await t.log("  Setting padding properties..."), l.paddingLeft = 0, l.paddingRight = 0, l.paddingTop = 0, l.paddingBottom = 0, await t.log("  Set padding to 0");
    const x = (n = l.boundVariables) == null ? void 0 : n.itemSpacing, M = l.itemSpacing;
    await t.log(
      `  After padding: itemSpacing=${M}, boundVar=${JSON.stringify(x)}`
    ), await t.log(
      "  ✓ FIXED: Simulating 'late setting' code WITH check if bound..."
    );
    const U = 0, O = !0, R = { itemSpacing: !0 }, C = ((r = l.boundVariables) == null ? void 0 : r.itemSpacing) !== void 0;
    U !== void 0 && l.layoutMode !== void 0 && (!C && (!O || !R.itemSpacing) || C && await t.log(
      "  ✓ Late setting correctly skipped (binding exists) - FIXED!"
    ));
    const k = (c = l.boundVariables) == null ? void 0 : c.itemSpacing, L = l.itemSpacing;
    await t.log(
      `  After fixed late setting: itemSpacing=${L}, boundVar=${JSON.stringify(k)}`
    ), await t.log("  Appending children (might reset itemSpacing)...");
    const F = figma.createFrame();
    F.name = "Child 1", F.resize(50, 50), l.appendChild(F);
    const I = figma.createFrame();
    I.name = "Child 2", I.resize(50, 50), l.appendChild(I), await t.log("  Appended 2 children");
    const G = (o = l.boundVariables) == null ? void 0 : o.itemSpacing, S = l.itemSpacing;
    await t.log(
      `  After appending children: itemSpacing=${S}, boundVar=${JSON.stringify(G)}`
    ), await t.log(
      "  ✓ FIXED: Simulating 'FINAL FIX' code WITH check if bound..."
    );
    const P = ((d = l.boundVariables) == null ? void 0 : d.itemSpacing) !== void 0, _ = 0;
    (l.type === "FRAME" || l.type === "COMPONENT" || l.type === "INSTANCE") && (l.layoutMode === "VERTICAL" || l.layoutMode === "HORIZONTAL") && _ !== void 0 && (P ? await t.log(
      "  ✓ FINAL FIX correctly skipped (binding exists) - FIXED!"
    ) : (await t.log(
      "  FINAL FIX would set direct value (but binding doesn't exist, so OK)"
    ), l.itemSpacing = _));
    const z = (p = l.boundVariables) == null ? void 0 : p.itemSpacing, W = l.itemSpacing;
    await t.log(
      `  FINAL: itemSpacing=${W}, boundVar=${JSON.stringify(z)}`
    );
    const D = z !== void 0 && z.id === b.id;
    return await t.log(`
=== Fix Demonstration Summary ===`), await t.log(
      `Result: ${D ? "SUCCESS ✓" : "FAILED ✗"} - Binding ${D ? "survived" : "was lost"} through fixed import simulation`
    ), {
      success: D,
      message: D ? "Fix demonstrated: Binding survived using new fixed approach" : "Fix failed: Binding was lost (unexpected)",
      details: {
        afterSet: {
          itemSpacing: g,
          boundVariable: E
        },
        afterLayout: {
          itemSpacing: y,
          boundVariable: u
        },
        afterPadding: {
          itemSpacing: M,
          boundVariable: x
        },
        afterLate: {
          itemSpacing: L,
          boundVariable: k
        },
        afterChildren: {
          itemSpacing: S,
          boundVariable: G
        },
        final: {
          itemSpacing: W,
          boundVariable: z
        },
        bindingSurvived: D
      }
    };
  } catch (f) {
    const m = f instanceof Error ? f.message : "Unknown error occurred";
    return await t.error(`Fix demonstration test failed: ${m}`), {
      success: !1,
      message: `Test error: ${m}`
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
      (y) => y.type === "FRAME" && y.name === "Test"
    );
    if (!i)
      throw new Error("Test frame container not found on page");
    await t.log(
      `
--- Step 1: Create frame with SCALE constraints ---`
    );
    const n = figma.createFrame();
    n.name = "Original Frame - SCALE Constraints", n.resize(100, 100), i.appendChild(n), n.constraintHorizontal = "SCALE", n.constraintVertical = "SCALE", await t.log("  Set constraintHorizontal to SCALE"), await t.log("  Set constraintVertical to SCALE");
    const r = n.constraintHorizontal, c = n.constraintVertical;
    if (await t.log(
      `  Original constraints: H=${r}, V=${c}`
    ), r !== "SCALE" || c !== "SCALE")
      return {
        success: !1,
        message: "Failed to set SCALE constraints on original frame",
        details: {
          constraintHorizontal: r,
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
    const p = {
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
    f.name = "Imported Frame - SCALE Constraints", f.resize(p.width, p.height), i.appendChild(f);
    const m = f.constraintHorizontal, h = f.constraintVertical;
    await t.log(
      `  Constraints before setting: H=${m}, V=${h} (expected: MIN, MIN)`
    ), p.constraintHorizontal !== void 0 && (f.constraintHorizontal = p.constraintHorizontal, await t.log(
      `  Set constraintHorizontal to ${p.constraintHorizontal}`
    )), p.constraintVertical !== void 0 && (f.constraintVertical = p.constraintVertical, await t.log(
      `  Set constraintVertical to ${p.constraintVertical}`
    )), await t.log(`
--- Step 4: Verify Imported Constraints ---`);
    const s = f.constraintHorizontal, b = f.constraintVertical;
    await t.log(
      `  Imported constraints: H=${s}, V=${b}`
    ), await t.log("  Expected constraints: H=SCALE, V=SCALE");
    const l = s === "SCALE" && b === "SCALE";
    l ? await t.log("  ✓ Constraints correctly imported as SCALE") : await t.warning(
      `  ⚠️ Constraints mismatch! Expected SCALE, got H=${s}, V=${b}`
    ), await t.log(`
--- Step 5: Test Other Constraint Values ---`);
    const E = [
      { h: "MIN", v: "MIN", name: "MIN/MIN" },
      { h: "CENTER", v: "CENTER", name: "CENTER/CENTER" },
      { h: "MAX", v: "MAX", name: "MAX/MAX" },
      { h: "STRETCH", v: "STRETCH", name: "STRETCH/STRETCH" }
    ], g = [];
    for (const y of E) {
      const x = figma.createFrame();
      x.name = `Test Frame - ${y.name}`, x.resize(50, 50), i.appendChild(x), x.constraintHorizontal = y.h, x.constraintVertical = y.v;
      const M = x.constraintHorizontal, U = x.constraintVertical, O = M === y.h && U === y.v;
      g.push({
        name: y.name,
        success: O,
        details: {
          expected: { h: y.h, v: y.v },
          actual: { h: M, v: U }
        }
      }), O ? await t.log(
        `  ✓ ${y.name}: Correctly set to H=${M}, V=${U}`
      ) : await t.warning(
        `  ⚠️ ${y.name}: Expected H=${y.h}, V=${y.v}, got H=${M}, V=${U}`
      );
    }
    const u = g.every((y) => y.success);
    return {
      success: l && u,
      message: l && u ? "Constraints correctly exported and imported (SCALE preserved)" : `Constraints test failed: SCALE=${l ? "PASS" : "FAIL"}, Other values=${u ? "PASS" : "FAIL"}`,
      details: {
        original: {
          constraintHorizontal: r,
          constraintVertical: c
        },
        exported: {
          constraintHorizontal: o,
          constraintVertical: d
        },
        imported: {
          constraintHorizontal: s,
          constraintVertical: b
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
      (x) => x.type === "PAGE" && x.name === "Test"
    );
    i ? await t.log('Found existing "Test" page') : (i = figma.createPage(), i.name = "Test", await t.log('Created "Test" page')), await figma.setCurrentPageAsync(i);
    const n = i.children.find(
      (x) => x.type === "FRAME" && x.name === "Test"
    );
    n && (await t.log(
      'Found existing "Test" frame, deleting it and all children...'
    ), n.remove(), await t.log('Deleted existing "Test" frame'));
    const r = figma.createFrame();
    r.name = "Test", i.appendChild(r), await t.log('Created new "Test" frame container');
    const c = [];
    await t.log(`
` + "=".repeat(60)), await t.log("TEST 1: Original 5 Approaches"), await t.log("=".repeat(60));
    const o = await ei(i.id);
    c.push({
      name: "Original 5 Approaches",
      success: o.success,
      message: o.message,
      details: o.details
    }), r.remove();
    const d = figma.createFrame();
    d.name = "Test", i.appendChild(d), await t.log(`
` + "=".repeat(60)), await t.log("TEST 2: Import Simulation"), await t.log("=".repeat(60));
    const p = await ti(
      i.id
    );
    c.push({
      name: "Import Simulation",
      success: p.success,
      message: p.message,
      details: p.details
    }), d.remove();
    const f = figma.createFrame();
    f.name = "Test", i.appendChild(f), await t.log(`
` + "=".repeat(60)), await t.log(
      "TEST 3: Failure Demonstration (Old Broken Approach)"
    ), await t.log("=".repeat(60));
    const m = await ai(
      i.id
    );
    c.push({
      name: "Failure Demonstration",
      success: m.success,
      message: m.message,
      details: m.details
    }), f.remove();
    const h = figma.createFrame();
    h.name = "Test", i.appendChild(h), await t.log(`
` + "=".repeat(60)), await t.log("TEST 4: Fix Demonstration (New Fixed Approach)"), await t.log("=".repeat(60));
    const s = await ii(i.id);
    c.push({
      name: "Fix Demonstration",
      success: s.success,
      message: s.message,
      details: s.details
    }), h.remove();
    const b = figma.createFrame();
    b.name = "Test", i.appendChild(b), await t.log(`
` + "=".repeat(60)), await t.log("TEST 5: Constraints Import/Export (Issue #4)"), await t.log("=".repeat(60));
    const l = await ni(i.id);
    c.push({
      name: "Constraints Import/Export",
      success: l.success,
      message: l.message,
      details: l.details
    }), await t.log(`
` + "=".repeat(60)), await t.log("=== ALL TESTS COMPLETE ==="), await t.log("=".repeat(60));
    const E = c.filter((x) => x.success), g = c.filter((x) => !x.success);
    await t.log(
      `Total: ${c.length} | Passed: ${E.length} | Failed: ${g.length}`
    );
    for (const x of c)
      await t.log(
        `  ${x.success ? "✓" : "✗"} ${x.name}: ${x.message}`
      );
    const y = {
      testResults: {
        success: o.success && p.success && m.success && // This "success" means we demonstrated the failure
        s.success && l.success,
        message: `All tests completed: ${E.length}/${c.length} passed`,
        details: {
          summary: {
            total: c.length,
            passed: E.length,
            failed: g.length
          },
          tests: c
        }
      },
      allTests: c
    };
    return se("runTest", y);
  } catch (a) {
    const i = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Test failed: ${i}`), me("runTest", i);
  }
}
const ri = {
  getCurrentUser: Rt,
  loadPages: xt,
  exportPage: Ue,
  importPage: bt,
  cleanupCreatedEntities: Ma,
  resolveDeferredNormalInstances: yt,
  determineImportOrder: St,
  buildDependencyGraph: wt,
  resolveImportOrder: $t,
  importPagesInOrder: vt,
  quickCopy: Ra,
  storeAuthData: xa,
  loadAuthData: ka,
  clearAuthData: La,
  storeImportData: Ba,
  loadImportData: Fa,
  clearImportData: Ua,
  storeSelectedRepo: Ga,
  getComponentMetadata: za,
  getAllComponents: _a,
  pluginPromptResponse: ja,
  switchToPage: Da,
  checkForExistingPrimaryImport: Ha,
  createImportDividers: Ja,
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
    const r = await n(a.data);
    figma.ui.postMessage(ce(q({}, r), {
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
