var ga = Object.defineProperty, fa = Object.defineProperties;
var ma = Object.getOwnPropertyDescriptors;
var ot = Object.getOwnPropertySymbols;
var Ot = Object.prototype.hasOwnProperty, xt = Object.prototype.propertyIsEnumerable;
var wt = (e, a, n) => a in e ? ga(e, a, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[a] = n, ge = (e, a) => {
  for (var n in a || (a = {}))
    Ot.call(a, n) && wt(e, n, a[n]);
  if (ot)
    for (var n of ot(a))
      xt.call(a, n) && wt(e, n, a[n]);
  return e;
}, Ne = (e, a) => fa(e, ma(a));
var Vt = (e, a) => {
  var n = {};
  for (var i in e)
    Ot.call(e, i) && a.indexOf(i) < 0 && (n[i] = e[i]);
  if (e != null && ot)
    for (var i of ot(e))
      a.indexOf(i) < 0 && xt.call(e, i) && (n[i] = e[i]);
  return n;
};
var Ie = (e, a, n) => wt(e, typeof a != "symbol" ? a + "" : a, n);
async function pa(e) {
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
async function ua(e) {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "loadPages",
      success: !0,
      error: !1,
      message: "Pages loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        pages: figma.root.children.map((s, l) => ({
          name: s.name,
          index: l
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
const Se = {
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
}, Ce = Ne(ge({}, Se), {
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
}), xe = Ne(ge({}, Se), {
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
}), Ke = Ne(ge({}, Se), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), Bt = Ne(ge({}, Se), {
  cornerRadius: 0
}), ha = Ne(ge({}, Se), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function ya(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return Ce;
    case "TEXT":
      return xe;
    case "VECTOR":
      return Ke;
    case "LINE":
      return ha;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return Bt;
    default:
      return Se;
  }
}
function de(e, a) {
  if (Array.isArray(e))
    return Array.isArray(a) ? e.length !== a.length || e.some((n, i) => de(n, a[i])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof a == "object" && a !== null) {
      const n = Object.keys(e), i = Object.keys(a);
      return n.length !== i.length ? !0 : n.some(
        (s) => !(s in a) || de(e[s], a[s])
      );
    }
    return !0;
  }
  return e !== a;
}
const Ge = {
  LAYER: "00000000-0000-0000-0000-000000000001",
  TOKENS: "00000000-0000-0000-0000-000000000002",
  THEME: "00000000-0000-0000-0000-000000000003"
}, Re = {
  LAYER: "Layer",
  TOKENS: "Tokens",
  THEME: "Theme"
};
function Ae(e) {
  const a = e.trim(), i = a.replace(/_\d+$/, "").toLowerCase();
  return i === "themes" || i === "theme" ? Re.THEME : i === "token" || i === "tokens" ? Re.TOKENS : i === "layer" || i === "layers" ? Re.LAYER : a;
}
function Be(e) {
  const a = Ae(e);
  return a === Re.LAYER || a === Re.TOKENS || a === Re.THEME;
}
function gt(e) {
  const a = Ae(e);
  if (a === Re.LAYER)
    return Ge.LAYER;
  if (a === Re.TOKENS)
    return Ge.TOKENS;
  if (a === Re.THEME)
    return Ge.THEME;
}
class at {
  constructor() {
    Ie(this, "collectionMap");
    // collectionId -> index
    Ie(this, "collections");
    // index -> collection data
    Ie(this, "normalizedNameMap");
    // normalized name -> index (for standard collections)
    Ie(this, "nextIndex");
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
  mergeModes(a, n) {
    const i = new Set(a);
    for (const s of n)
      i.add(s);
    return Array.from(i);
  }
  /**
   * Adds a collection to the table if it doesn't already exist
   * For standard collections (Layer, Tokens, Theme), merges by normalized name
   * Returns the index of the collection (existing or newly added)
   */
  addCollection(a) {
    const n = a.collectionId;
    if (this.collectionMap.has(n))
      return this.collectionMap.get(n);
    const i = Ae(
      a.collectionName
    );
    if (Be(a.collectionName)) {
      const o = this.findCollectionByNormalizedName(i);
      if (o !== void 0) {
        const c = this.collections[o];
        return c.modes = this.mergeModes(
          c.modes,
          a.modes
        ), this.collectionMap.set(n, o), o;
      }
    }
    const s = this.nextIndex++;
    this.collectionMap.set(n, s);
    const l = Ne(ge({}, a), {
      collectionName: i
    });
    if (Be(a.collectionName)) {
      const o = gt(
        a.collectionName
      );
      o && (l.collectionGuid = o), this.normalizedNameMap.set(i, s);
    }
    return this.collections[s] = l, s;
  }
  /**
   * Gets the index of a collection by its collectionId
   * Returns -1 if not found
   */
  getCollectionIndex(a) {
    var n;
    return (n = this.collectionMap.get(a)) != null ? n : -1;
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
    for (let n = 0; n < this.collections.length; n++)
      a[String(n)] = this.collections[n];
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
    for (let n = 0; n < this.collections.length; n++) {
      const i = this.collections[n], s = ge({
        collectionName: i.collectionName,
        modes: i.modes
      }, i.collectionGuid && { collectionGuid: i.collectionGuid });
      a[String(n)] = s;
    }
    return a;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   * Handles both new format (without collectionId/isLocal) and legacy format (with collectionId/isLocal)
   */
  static fromTable(a) {
    var s;
    const n = new at(), i = Object.entries(a).sort(
      (l, o) => parseInt(l[0], 10) - parseInt(o[0], 10)
    );
    for (const [l, o] of i) {
      const c = parseInt(l, 10), d = (s = o.isLocal) != null ? s : !0, p = Ae(
        o.collectionName || ""
      ), m = o.collectionId || o.collectionGuid || `temp:${c}:${p}`, $ = ge({
        collectionName: p,
        collectionId: m,
        isLocal: d,
        modes: o.modes || []
      }, o.collectionGuid && {
        collectionGuid: o.collectionGuid
      });
      n.collectionMap.set(m, c), n.collections[c] = $, Be(p) && n.normalizedNameMap.set(p, c), n.nextIndex = Math.max(
        n.nextIndex,
        c + 1
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
const wa = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, ba = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function $a(e) {
  var n;
  const a = e.toUpperCase();
  return (n = wa[a]) != null ? n : e;
}
function va(e) {
  var a;
  return typeof e == "number" ? (a = ba[e]) != null ? a : e.toString() : e;
}
class nt {
  constructor() {
    Ie(this, "variableMap");
    // variableKey -> index
    Ie(this, "variables");
    // index -> variable data
    Ie(this, "nextIndex");
    this.variableMap = /* @__PURE__ */ new Map(), this.variables = [], this.nextIndex = 0;
  }
  /**
   * Adds a variable to the table if it doesn't already exist
   * Returns the index of the variable (existing or newly added)
   */
  addVariable(a) {
    const n = a.variableKey;
    if (!n)
      return -1;
    if (this.variableMap.has(n))
      return this.variableMap.get(n);
    const i = this.nextIndex++;
    return this.variableMap.set(n, i), this.variables[i] = a, i;
  }
  /**
   * Gets the index of a variable by its variableKey
   * Returns -1 if not found
   */
  getVariableIndex(a) {
    var n;
    return (n = this.variableMap.get(a)) != null ? n : -1;
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
    for (let n = 0; n < this.variables.length; n++)
      a[String(n)] = this.variables[n];
    return a;
  }
  /**
   * Serializes valuesByMode, removing type and id from VariableAliasSerialized objects
   * Only keeps _varRef since that's sufficient to identify a variable reference
   */
  serializeValuesByMode(a) {
    if (!a)
      return;
    const n = {};
    for (const [i, s] of Object.entries(a))
      typeof s == "object" && s !== null && "_varRef" in s && typeof s._varRef == "number" ? n[i] = {
        _varRef: s._varRef
      } : n[i] = s;
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
    const a = {};
    for (let n = 0; n < this.variables.length; n++) {
      const i = this.variables[n], s = this.serializeValuesByMode(
        i.valuesByMode
      ), l = ge(ge({
        variableName: i.variableName,
        variableType: $a(i.variableType)
      }, i._colRef !== void 0 && { _colRef: i._colRef }), s && { valuesByMode: s });
      a[String(n)] = l;
    }
    return a;
  }
  /**
   * Reconstructs a VariableTable from a serialized table object
   * Handles both new format (without variableKey) and legacy format (with variableKey)
   * Expands compressed variable types (numbers) back to strings
   */
  static fromTable(a) {
    const n = new nt(), i = Object.entries(a).sort(
      (s, l) => parseInt(s[0], 10) - parseInt(l[0], 10)
    );
    for (const [s, l] of i) {
      const o = parseInt(s, 10), c = va(l.variableType), d = Ne(ge({}, l), {
        variableType: c
        // Always a string after expansion
      });
      n.variables[o] = d, n.nextIndex = Math.max(n.nextIndex, o + 1);
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
function Na(e) {
  return {
    _varRef: e
  };
}
function _e(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let Sa = 0;
const tt = /* @__PURE__ */ new Map();
function Ca(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const a = tt.get(e.requestId);
  a && (tt.delete(e.requestId), e.error || !e.guid ? a.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : a.resolve(e.guid));
}
function Et() {
  return new Promise((e, a) => {
    const n = `guid_${Date.now()}_${++Sa}`;
    tt.set(n, { resolve: e, reject: a }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: n
    }), setTimeout(() => {
      tt.has(n) && (tt.delete(n), a(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
async function rt() {
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
    }), await rt();
  },
  log: async (e) => {
    console.log(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    }), await rt();
  },
  warning: async (e) => {
    console.warn(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    }), await rt();
  },
  error: async (e) => {
    console.error(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    }), await rt();
  }
};
function Ea(e, a) {
  const n = a.modes.find((i) => i.modeId === e);
  return n ? n.name : e;
}
async function Ft(e, a, n, i, s = /* @__PURE__ */ new Set()) {
  const l = {};
  for (const [o, c] of Object.entries(e)) {
    const d = Ea(o, i);
    if (c == null) {
      l[d] = c;
      continue;
    }
    if (typeof c == "string" || typeof c == "number" || typeof c == "boolean") {
      l[d] = c;
      continue;
    }
    if (typeof c == "object" && c !== null && "type" in c && c.type === "VARIABLE_ALIAS" && "id" in c) {
      const p = c.id;
      if (s.has(p)) {
        l[d] = {
          type: "VARIABLE_ALIAS",
          id: p
        };
        continue;
      }
      const m = await figma.variables.getVariableByIdAsync(p);
      if (!m) {
        l[d] = {
          type: "VARIABLE_ALIAS",
          id: p
        };
        continue;
      }
      const $ = new Set(s);
      $.add(p);
      const y = await figma.variables.getVariableCollectionByIdAsync(
        m.variableCollectionId
      ), u = m.key;
      if (!u) {
        l[d] = {
          type: "VARIABLE_ALIAS",
          id: p
        };
        continue;
      }
      const b = {
        variableName: m.name,
        variableType: m.resolvedType,
        collectionName: y == null ? void 0 : y.name,
        collectionId: m.variableCollectionId,
        variableKey: u,
        id: p,
        isLocal: !m.remote
      };
      if (y) {
        const w = await Gt(
          y,
          n
        );
        b._colRef = w, m.valuesByMode && (b.valuesByMode = await Ft(
          m.valuesByMode,
          a,
          n,
          y,
          // Pass collection for mode ID to name conversion
          $
        ));
      }
      const r = a.addVariable(b);
      l[d] = {
        type: "VARIABLE_ALIAS",
        id: p,
        _varRef: r
      };
    } else
      l[d] = c;
  }
  return l;
}
const st = "recursica:collectionId";
async function Ia(e) {
  if (e.remote === !0) {
    const n = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(n)) {
      const s = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await t.error(s), new Error(s);
    }
    return e.id;
  } else {
    if (Be(e.name)) {
      const s = gt(e.name);
      if (s) {
        const l = e.getSharedPluginData(
          "recursica",
          st
        );
        return (!l || l.trim() === "") && e.setSharedPluginData(
          "recursica",
          st,
          s
        ), s;
      }
    }
    const n = e.getSharedPluginData(
      "recursica",
      st
    );
    if (n && n.trim() !== "")
      return n;
    const i = await Et();
    return e.setSharedPluginData("recursica", st, i), i;
  }
}
function Aa(e, a) {
  if (a)
    return;
  const n = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(n))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Gt(e, a) {
  const n = !e.remote, i = a.getCollectionIndex(e.id);
  if (i !== -1)
    return i;
  Aa(e.name, n);
  const s = await Ia(e), l = e.modes.map((p) => p.name), o = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: n,
    modes: l,
    collectionGuid: s
  }, c = a.addCollection(o), d = n ? "local" : "remote";
  return await t.log(
    `  Added ${d} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), c;
}
async function $t(e, a, n) {
  if (!e || typeof e != "object" || e.type !== "VARIABLE_ALIAS")
    return null;
  try {
    const i = await figma.variables.getVariableByIdAsync(e.id);
    if (!i)
      return console.log("Could not resolve variable alias:", e.id), null;
    const s = await figma.variables.getVariableCollectionByIdAsync(
      i.variableCollectionId
    );
    if (!s)
      return console.log("Could not resolve collection for variable:", e.id), null;
    const l = i.key;
    if (!l)
      return console.log("Variable missing key:", e.id), null;
    const o = await Gt(
      s,
      n
    ), c = {
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
    i.valuesByMode && (c.valuesByMode = await Ft(
      i.valuesByMode,
      a,
      n,
      s,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const d = a.addVariable(c);
    return Na(d);
  } catch (i) {
    const s = i instanceof Error ? i.message : String(i);
    throw console.error("Could not resolve variable alias:", e.id, i), new Error(
      `Failed to resolve variable alias ${e.id}: ${s}`
    );
  }
}
async function Ze(e, a, n) {
  if (!e || typeof e != "object") return e;
  const i = {};
  for (const s in e)
    if (Object.prototype.hasOwnProperty.call(e, s)) {
      const l = e[s];
      if (l && typeof l == "object" && !Array.isArray(l))
        if (l.type === "VARIABLE_ALIAS") {
          const o = await $t(
            l,
            a,
            n
          );
          o && (i[s] = o);
        } else
          i[s] = await Ze(
            l,
            a,
            n
          );
      else Array.isArray(l) ? i[s] = await Promise.all(
        l.map(async (o) => (o == null ? void 0 : o.type) === "VARIABLE_ALIAS" ? await $t(
          o,
          a,
          n
        ) || o : o && typeof o == "object" ? await Ze(
          o,
          a,
          n
        ) : o)
      ) : i[s] = l;
    }
  return i;
}
async function _t(e, a, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const s = {};
      for (const l in i)
        Object.prototype.hasOwnProperty.call(i, l) && (l === "boundVariables" ? s[l] = await Ze(
          i[l],
          a,
          n
        ) : s[l] = i[l]);
      return s;
    })
  );
}
async function zt(e, a, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const s = {};
      for (const l in i)
        Object.prototype.hasOwnProperty.call(i, l) && (l === "boundVariables" ? s[l] = await Ze(
          i[l],
          a,
          n
        ) : s[l] = i[l]);
      return s;
    })
  );
}
const We = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  extractBoundVariables: Ze,
  resolveVariableAliasMetadata: $t,
  serializeBackgrounds: zt,
  serializeFills: _t
}, Symbol.toStringTag, { value: "Module" }));
async function jt(e, a) {
  var d, p;
  const n = {}, i = /* @__PURE__ */ new Set();
  e.type && (n.type = e.type, i.add("type")), e.id && (n.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (n.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (n.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (n.y = e.y, i.add("y")), e.width !== void 0 && (n.width = e.width, i.add("width")), e.height !== void 0 && (n.height = e.height, i.add("height"));
  const s = e.name || "Unnamed";
  e.preserveRatio !== void 0 && await t.log(
    `[ISSUE #3 EXPORT DEBUG] "${s}" has preserveRatio: ${e.preserveRatio} (NOT being exported - needs to be added!)`
  );
  const l = e.type;
  if (l === "FRAME" || l === "COMPONENT" || l === "INSTANCE" || l === "GROUP" || l === "BOOLEAN_OPERATION" || l === "VECTOR" || l === "STAR" || l === "LINE" || l === "ELLIPSE" || l === "POLYGON" || l === "RECTANGLE" || l === "TEXT") {
    const m = e.constraintHorizontal !== void 0 ? e.constraintHorizontal : (d = e.constraints) == null ? void 0 : d.horizontal, $ = e.constraintVertical !== void 0 ? e.constraintVertical : (p = e.constraints) == null ? void 0 : p.vertical;
    m !== void 0 && de(
      m,
      Se.constraintHorizontal
    ) && (n.constraintHorizontal = m, i.add("constraintHorizontal")), $ !== void 0 && de(
      $,
      Se.constraintVertical
    ) && (n.constraintVertical = $, i.add("constraintVertical"));
  }
  if (e.visible !== void 0 && de(e.visible, Se.visible) && (n.visible = e.visible, i.add("visible")), e.locked !== void 0 && de(e.locked, Se.locked) && (n.locked = e.locked, i.add("locked")), e.opacity !== void 0 && de(e.opacity, Se.opacity) && (n.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && de(e.rotation, Se.rotation) && (n.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && de(e.blendMode, Se.blendMode) && (n.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && de(e.effects, Se.effects) && (n.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const m = await _t(
      e.fills,
      a.variableTable,
      a.collectionTable
    );
    de(m, Se.fills) && (n.fills = m), i.add("fills");
  }
  if (e.strokes !== void 0 && de(e.strokes, Se.strokes) && (n.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && de(e.strokeWeight, Se.strokeWeight) && (n.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && de(e.strokeAlign, Se.strokeAlign) && (n.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const m = e.name || "Unnamed", $ = Object.keys(e.boundVariables);
    $.length > 0 ? await t.log(
      `[ISSUE #2 EXPORT DEBUG] "${m}" (${e.type}) has boundVariables for: ${$.join(", ")}`
    ) : await t.log(
      `[ISSUE #2 EXPORT DEBUG] "${m}" (${e.type}) has no boundVariables`
    );
    const y = await Ze(
      e.boundVariables,
      a.variableTable,
      a.collectionTable
    ), u = Object.keys(y);
    u.length > 0 && await t.log(
      `[ISSUE #2 EXPORT DEBUG] "${m}" extracted boundVariables: ${u.join(", ")}`
    ), Object.keys(y).length > 0 && (n.boundVariables = y), i.add("boundVariables");
  }
  if (e.backgrounds !== void 0) {
    const m = await zt(
      e.backgrounds,
      a.variableTable,
      a.collectionTable
    );
    m && Array.isArray(m) && m.length > 0 && (n.backgrounds = m), i.add("backgrounds");
  }
  const c = e.selectionColor;
  return c !== void 0 && (n.selectionColor = c, i.add("selectionColor")), n;
}
const Pa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseBaseNodeProperties: jt
}, Symbol.toStringTag, { value: "Module" }));
async function vt(e, a) {
  const n = {}, i = /* @__PURE__ */ new Set();
  if (e.type === "COMPONENT")
    try {
      e.componentPropertyDefinitions && (n.componentPropertyDefinitions = e.componentPropertyDefinitions, i.add("componentPropertyDefinitions"));
    } catch (s) {
    }
  return e.layoutMode !== void 0 && de(e.layoutMode, Ce.layoutMode) && (n.layoutMode = e.layoutMode, i.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && de(
    e.primaryAxisSizingMode,
    Ce.primaryAxisSizingMode
  ) && (n.primaryAxisSizingMode = e.primaryAxisSizingMode, i.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && de(
    e.counterAxisSizingMode,
    Ce.counterAxisSizingMode
  ) && (n.counterAxisSizingMode = e.counterAxisSizingMode, i.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && de(
    e.primaryAxisAlignItems,
    Ce.primaryAxisAlignItems
  ) && (n.primaryAxisAlignItems = e.primaryAxisAlignItems, i.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && de(
    e.counterAxisAlignItems,
    Ce.counterAxisAlignItems
  ) && (n.counterAxisAlignItems = e.counterAxisAlignItems, i.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && de(e.paddingLeft, Ce.paddingLeft) && (n.paddingLeft = e.paddingLeft, i.add("paddingLeft")), e.paddingRight !== void 0 && de(e.paddingRight, Ce.paddingRight) && (n.paddingRight = e.paddingRight, i.add("paddingRight")), e.paddingTop !== void 0 && de(e.paddingTop, Ce.paddingTop) && (n.paddingTop = e.paddingTop, i.add("paddingTop")), e.paddingBottom !== void 0 && de(e.paddingBottom, Ce.paddingBottom) && (n.paddingBottom = e.paddingBottom, i.add("paddingBottom")), e.itemSpacing !== void 0 && de(e.itemSpacing, Ce.itemSpacing) && (n.itemSpacing = e.itemSpacing, i.add("itemSpacing")), e.counterAxisSpacing !== void 0 && de(
    e.counterAxisSpacing,
    Ce.counterAxisSpacing
  ) && (n.counterAxisSpacing = e.counterAxisSpacing, i.add("counterAxisSpacing")), e.cornerRadius !== void 0 && de(e.cornerRadius, Ce.cornerRadius) && (n.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.clipsContent !== void 0 && de(e.clipsContent, Ce.clipsContent) && (n.clipsContent = e.clipsContent, i.add("clipsContent")), e.layoutWrap !== void 0 && de(e.layoutWrap, Ce.layoutWrap) && (n.layoutWrap = e.layoutWrap, i.add("layoutWrap")), e.layoutGrow !== void 0 && de(e.layoutGrow, Ce.layoutGrow) && (n.layoutGrow = e.layoutGrow, i.add("layoutGrow")), n;
}
const Ta = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseFrameProperties: vt
}, Symbol.toStringTag, { value: "Module" })), Le = {
  fontSize: 12,
  fontName: { family: "Roboto", style: "Regular" },
  letterSpacing: { value: 0, unit: "PIXELS" },
  lineHeight: { unit: "AUTO" },
  textCase: "ORIGINAL",
  textDecoration: "NONE",
  paragraphSpacing: 0,
  paragraphIndent: 0
};
async function Oa(e, a) {
  const n = {};
  return e.fontSize !== Le.fontSize && (n.fontSize = e.fontSize), (e.fontName.family !== Le.fontName.family || e.fontName.style !== Le.fontName.style) && (n.fontName = e.fontName), JSON.stringify(e.letterSpacing) !== JSON.stringify(Le.letterSpacing) && (n.letterSpacing = e.letterSpacing), JSON.stringify(e.lineHeight) !== JSON.stringify(Le.lineHeight) && (n.lineHeight = e.lineHeight), e.textCase !== Le.textCase && (n.textCase = e.textCase), e.textDecoration !== Le.textDecoration && (n.textDecoration = e.textDecoration), e.paragraphSpacing !== Le.paragraphSpacing && (n.paragraphSpacing = e.paragraphSpacing), e.paragraphIndent !== Le.paragraphIndent && (n.paragraphIndent = e.paragraphIndent), n;
}
async function xa(e, a) {
  const n = {}, i = /* @__PURE__ */ new Set();
  if (e.textStyleId !== void 0 && e.textStyleId !== "")
    try {
      const s = await figma.getStyleByIdAsync(e.textStyleId);
      if (s && s.type === "TEXT") {
        let l = a.styleTable.getStyleIndex(s.key);
        if (l < 0) {
          const o = await Oa(s, a);
          l = a.styleTable.addStyle({
            type: "TEXT",
            name: s.name,
            styleKey: s.key,
            textStyle: o,
            boundVariables: o.boundVariables
          }), await t.log(
            `  [EXPORT] Added text style "${s.name}" to style table at index ${l} for text node "${e.name || "Unnamed"}"`
          );
        } else
          await t.log(
            `  [EXPORT] Reusing existing text style "${s.name}" from style table at index ${l} for text node "${e.name || "Unnamed"}"`
          );
        n._styleRef = l, i.add("_styleRef"), i.add("textStyleId"), await t.log(
          `  [EXPORT] ✓ Exported text node "${e.name || "Unnamed"}" with _styleRef=${l} (style: "${s.name}")`
        );
      } else
        await t.warning(
          `  [EXPORT] Text node "${e.name || "Unnamed"}" has textStyleId but style lookup returned null or wrong type`
        );
    } catch (s) {
      await t.warning(
        `  [EXPORT] Could not look up text style for node "${e.name || "Unnamed"}": ${s}`
      );
    }
  else
    await t.log(
      `  [EXPORT] Text node "${e.name || "Unnamed"}" has no textStyleId (textStyleId=${e.textStyleId})`
    );
  return e.characters !== void 0 && e.characters !== "" && (n.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (n.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (n.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && de(
    e.textAlignHorizontal,
    xe.textAlignHorizontal
  ) && (n.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && de(
    e.textAlignVertical,
    xe.textAlignVertical
  ) && (n.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && de(e.letterSpacing, xe.letterSpacing) && (n.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && de(e.lineHeight, xe.lineHeight) && (n.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && de(e.textCase, xe.textCase) && (n.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && de(e.textDecoration, xe.textDecoration) && (n.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && de(e.textAutoResize, xe.textAutoResize) && (n.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && de(
    e.paragraphSpacing,
    xe.paragraphSpacing
  ) && (n.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && de(e.paragraphIndent, xe.paragraphIndent) && (n.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && de(e.listOptions, xe.listOptions) && (n.listOptions = e.listOptions, i.add("listOptions")), n;
}
function Va(e) {
  const a = e.match(/^(\d+\.?\d*)[eE]([+-]?\d+)$/);
  if (a) {
    const n = parseFloat(a[1]), i = parseInt(a[2]), s = n * Math.pow(10, i);
    return Math.abs(s) < 1e-10 ? "0" : s.toFixed(6).replace(/\.?0+$/, "") || "0";
  }
  return e;
}
function Jt(e) {
  if (!e || typeof e != "string")
    return e;
  let a = e.replace(/(\d+\.?\d*)[eE]([+-]?\d+)/g, (n) => Va(n));
  return a = a.replace(
    /(\d+\.\d{7,})/g,
    // Match numbers with more than 6 decimal places
    (n) => {
      const i = parseFloat(n);
      return Math.abs(i) < 1e-10 ? "0" : i.toFixed(6).replace(/\.?0+$/, "") || "0";
    }
  ), a = a.replace(
    /([MmLlHhVvCcSsQqTtAaZz])([-\d])/g,
    (n, i, s) => `${i} ${s}`
  ), a = a.replace(/\s+/g, " ").trim(), a;
}
function Nt(e) {
  return Array.isArray(e) ? e.map((a) => ({
    data: Jt(a.data),
    // Normalize winding rule key (use windRule consistently)
    windRule: a.windRule || a.windingRule || "NONZERO"
  })) : e;
}
const Ra = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  normalizeSvgPath: Jt,
  normalizeVectorGeometry: Nt
}, Symbol.toStringTag, { value: "Module" }));
async function Ma(e, a) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && de(e.fillGeometry, Ke.fillGeometry) && (n.fillGeometry = Nt(e.fillGeometry), i.add("fillGeometry")), e.strokeGeometry !== void 0 && de(e.strokeGeometry, Ke.strokeGeometry) && (n.strokeGeometry = Nt(e.strokeGeometry), i.add("strokeGeometry")), e.strokeCap !== void 0 && de(e.strokeCap, Ke.strokeCap) && (n.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && de(e.strokeJoin, Ke.strokeJoin) && (n.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && de(e.dashPattern, Ke.dashPattern) && (n.dashPattern = e.dashPattern, i.add("dashPattern")), n;
}
async function ka(e, a) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && de(e.cornerRadius, Bt.cornerRadius) && (n.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (n.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, i.add("pointCount")), n;
}
const lt = /* @__PURE__ */ new Map();
let Ua = 0;
function La() {
  return `prompt_${Date.now()}_${++Ua}`;
}
const Qe = {
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
    var c;
    const n = typeof a == "number" ? { timeoutMs: a } : a, i = (c = n == null ? void 0 : n.timeoutMs) != null ? c : 3e5, s = n == null ? void 0 : n.okLabel, l = n == null ? void 0 : n.cancelLabel, o = La();
    return new Promise((d, p) => {
      const m = i === -1 ? null : setTimeout(() => {
        lt.delete(o), p(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      lt.set(o, {
        resolve: d,
        reject: p,
        timeout: m
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: ge(ge({
          message: e,
          requestId: o
        }, s && { okLabel: s }), l && { cancelLabel: l })
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
    const { requestId: a, action: n } = e, i = lt.get(a);
    if (!i) {
      console.warn(
        `Received response for unknown prompt request: ${a}`
      );
      return;
    }
    i.timeout && clearTimeout(i.timeout), lt.delete(a), n === "ok" ? i.resolve() : i.reject(new Error("User cancelled"));
  }
}, Ba = "RecursicaPublishedMetadata";
function bt(e) {
  let a = e, n = !1;
  try {
    if (n = a.parent !== null && a.parent !== void 0, !n)
      return { page: null, reason: "detached" };
  } catch (i) {
    return { page: null, reason: "detached" };
  }
  for (; a; ) {
    if (a.type === "PAGE")
      return { page: a, reason: "found" };
    try {
      const i = a.parent;
      if (!i)
        return { page: null, reason: "broken_chain" };
      a = i;
    } catch (i) {
      return { page: null, reason: "access_error" };
    }
  }
  return { page: null, reason: "broken_chain" };
}
function Rt(e) {
  try {
    const a = e.getPluginData(Ba);
    if (!a || a.trim() === "")
      return null;
    const n = JSON.parse(a);
    return {
      id: n.id,
      version: n.version
    };
  } catch (a) {
    return null;
  }
}
async function Fa(e, a) {
  var s, l;
  const n = {}, i = /* @__PURE__ */ new Set();
  if (n._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const o = await e.getMainComponentAsync();
    if (!o) {
      const E = e.name || "(unnamed)", T = e.id;
      if (a.detachedComponentsHandled.has(T))
        await t.log(
          `Treating detached instance "${E}" as internal instance (already prompted)`
        );
      else {
        await t.warning(
          `Found detached instance: "${E}" (main component is missing)`
        );
        const I = `Found detached instance "${E}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await Qe.prompt(I, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), a.detachedComponentsHandled.add(T), await t.log(
            `Treating detached instance "${E}" as internal instance`
          );
        } catch (V) {
          if (V instanceof Error && V.message === "User cancelled") {
            const J = `Export cancelled: Detached instance "${E}" found. Please fix the instance before exporting.`;
            await t.error(J);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch (Q) {
              console.warn("Could not scroll to instance:", Q);
            }
            throw new Error(J);
          } else
            throw V;
        }
      }
      if (!bt(e).page) {
        const I = `Detached instance "${E}" is not on any page. Cannot export.`;
        throw await t.error(I), new Error(I);
      }
      let O, v;
      try {
        e.variantProperties && (O = e.variantProperties), e.componentProperties && (v = e.componentProperties);
      } catch (I) {
      }
      const h = ge(ge({
        instanceType: "internal",
        componentName: E,
        componentNodeId: e.id
      }, O && { variantProperties: O }), v && { componentProperties: v }), x = a.instanceTable.addInstance(h);
      return n._instanceRef = x, i.add("_instanceRef"), await t.log(
        `  Exported detached INSTANCE: "${E}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), n;
    }
    const c = e.name || "(unnamed)", d = o.name || "(unnamed)", p = o.remote === !0, $ = bt(e).page, y = bt(o);
    let u = y.page;
    if (!u && p)
      try {
        await figma.loadAllPagesAsync();
        const E = figma.root.children;
        let T = null;
        for (const C of E)
          try {
            if (C.findOne(
              (O) => O.id === o.id
            )) {
              T = C;
              break;
            }
          } catch (F) {
          }
        if (!T) {
          const C = o.id.split(":")[0];
          for (const F of E) {
            const O = F.id.split(":")[0];
            if (C === O) {
              T = F;
              break;
            }
          }
        }
        T && (u = T);
      } catch (E) {
      }
    let b, r = u;
    if (p)
      if (u) {
        const E = Rt(u);
        b = "normal", r = u, E != null && E.id ? await t.log(
          `  Component "${d}" is from library but also exists on local page "${u.name}" with metadata. Treating as "normal" instance.`
        ) : await t.log(
          `  Component "${d}" is from library and exists on local page "${u.name}" (no metadata). Treating as "normal" instance - page should be published first.`
        );
      } else
        b = "remote", await t.log(
          `  Component "${d}" is from library and not on a local page. Treating as "remote" instance.`
        );
    else if (u && $ && u.id === $.id)
      b = "internal";
    else if (u && $ && u.id !== $.id)
      b = "normal";
    else if (u && !$)
      b = "normal";
    else if (!p && y.reason === "detached") {
      const E = o.id;
      if (a.detachedComponentsHandled.has(E))
        b = "remote", await t.log(
          `Treating detached instance "${c}" -> component "${d}" as remote instance (already prompted)`
        );
      else {
        await t.warning(
          `Found detached instance: "${c}" -> component "${d}" (component is not on any page)`
        );
        try {
          await figma.viewport.scrollAndZoomIntoView([o]);
        } catch (C) {
          console.warn("Could not scroll to component:", C);
        }
        const T = `Found detached instance "${c}" attached to component "${d}". This should be fixed. Continue to publish?`;
        try {
          await Qe.prompt(T, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), a.detachedComponentsHandled.add(E), b = "remote", await t.log(
            `Treating detached instance "${c}" as remote instance (will be created on REMOTES page)`
          );
        } catch (C) {
          if (C instanceof Error && C.message === "User cancelled") {
            const F = `Export cancelled: Detached instance "${c}" found. The component "${d}" is not on any page. Please fix the instance before exporting.`;
            throw await t.error(F), new Error(F);
          } else
            throw C;
        }
      }
    } else
      p || await t.warning(
        `  Instance "${c}" -> component "${d}": componentPage is null but component is not remote. Reason: ${y.reason}. Cannot determine instance type.`
      ), b = "normal";
    let w, g;
    try {
      if (e.variantProperties && (w = e.variantProperties, await t.log(
        `  Instance "${c}" -> variantProperties from instance: ${JSON.stringify(w)}`
      )), typeof e.getProperties == "function")
        try {
          const E = await e.getProperties();
          E && E.variantProperties && (await t.log(
            `  Instance "${c}" -> variantProperties from getProperties(): ${JSON.stringify(E.variantProperties)}`
          ), E.variantProperties && Object.keys(E.variantProperties).length > 0 && (w = E.variantProperties));
        } catch (E) {
          await t.log(
            `  Instance "${c}" -> getProperties() not available or failed: ${E}`
          );
        }
      if (e.componentProperties && (g = e.componentProperties), o.parent && o.parent.type === "COMPONENT_SET") {
        const E = o.parent;
        try {
          const T = E.componentPropertyDefinitions;
          T && await t.log(
            `  Component set "${E.name}" has property definitions: ${JSON.stringify(Object.keys(T))}`
          );
          const C = {}, F = d.split(",").map((O) => O.trim());
          for (const O of F) {
            const v = O.split("=").map((h) => h.trim());
            if (v.length >= 2) {
              const h = v[0], x = v.slice(1).join("=").trim();
              T && T[h] && (C[h] = x);
            }
          }
          if (Object.keys(C).length > 0 && await t.log(
            `  Parsed variant properties from component name "${d}": ${JSON.stringify(C)}`
          ), w && Object.keys(w).length > 0)
            await t.log(
              `  Using variant properties from instance (source of truth): ${JSON.stringify(w)}`
            );
          else if (Object.keys(C).length > 0)
            w = C, await t.log(
              `  Using variant properties from component name (fallback): ${JSON.stringify(w)}`
            );
          else if (o.variantProperties) {
            const O = o.variantProperties;
            await t.log(
              `  Main component "${d}" has variantProperties: ${JSON.stringify(O)}`
            ), w = O;
          }
        } catch (T) {
          await t.warning(
            `  Could not get variant properties from component set: ${T}`
          );
        }
      }
    } catch (E) {
    }
    let S, k;
    try {
      let E = o.parent;
      const T = [];
      let C = 0;
      const F = 20;
      for (; E && C < F; )
        try {
          const O = E.type, v = E.name;
          if (O === "COMPONENT_SET" && !k && (k = v), O === "PAGE")
            break;
          const h = v || "";
          T.unshift(h), (k === "arrow-top-right-on-square" || d === "arrow-top-right-on-square") && await t.log(
            `  [PATH BUILD] Added segment: "${h}" (type: ${O}) to path for component "${d}"`
          ), E = E.parent, C++;
        } catch (O) {
          (k === "arrow-top-right-on-square" || d === "arrow-top-right-on-square") && await t.warning(
            `  [PATH BUILD] Error building path for "${d}": ${O}`
          );
          break;
        }
      S = T, (k === "arrow-top-right-on-square" || d === "arrow-top-right-on-square") && await t.log(
        `  [PATH BUILD] Final path for component "${d}": [${T.join(" → ")}]`
      );
    } catch (E) {
    }
    const D = ge(ge(ge(ge({
      instanceType: b,
      componentName: d
    }, k && { componentSetName: k }), w && { variantProperties: w }), g && { componentProperties: g }), b === "normal" ? { path: S || [] } : S && S.length > 0 && {
      path: S
    });
    if (b === "internal") {
      D.componentNodeId = o.id, await t.log(
        `  Found INSTANCE: "${c}" -> INTERNAL component "${d}" (ID: ${o.id.substring(0, 8)}...)`
      );
      const E = e.boundVariables, T = o.boundVariables;
      if (E && typeof E == "object") {
        const h = Object.keys(E);
        await t.log(
          `  DEBUG: Internal instance "${c}" -> boundVariables keys: ${h.length > 0 ? h.join(", ") : "none"}`
        );
        for (const I of h) {
          const V = E[I], J = (V == null ? void 0 : V.type) || typeof V;
          await t.log(
            `  DEBUG:   boundVariables.${I}: type=${J}, value=${JSON.stringify(V)}`
          );
        }
        const x = [
          "backgrounds",
          "selectionColor",
          "selectionColors",
          "selection",
          "selectColor"
        ];
        for (const I of x)
          E[I] !== void 0 && await t.log(
            `  DEBUG:   Found potential "Selection colors" property: boundVariables.${I} = ${JSON.stringify(E[I])}`
          );
      } else
        await t.log(
          `  DEBUG: Internal instance "${c}" -> No boundVariables found on instance node`
        );
      if (T && typeof T == "object") {
        const h = Object.keys(T);
        await t.log(
          `  DEBUG: Main component "${d}" -> boundVariables keys: ${h.length > 0 ? h.join(", ") : "none"}`
        );
      }
      const C = e.backgrounds;
      if (C && Array.isArray(C)) {
        await t.log(
          `  DEBUG: Internal instance "${c}" -> backgrounds array length: ${C.length}`
        );
        for (let h = 0; h < C.length; h++) {
          const x = C[h];
          if (x && typeof x == "object") {
            if (await t.log(
              `  DEBUG:   backgrounds[${h}] structure: ${JSON.stringify(Object.keys(x))}`
            ), x.boundVariables) {
              const I = Object.keys(x.boundVariables);
              await t.log(
                `  DEBUG:   backgrounds[${h}].boundVariables keys: ${I.length > 0 ? I.join(", ") : "none"}`
              );
              for (const V of I) {
                const J = x.boundVariables[V];
                await t.log(
                  `  DEBUG:     backgrounds[${h}].boundVariables.${V}: ${JSON.stringify(J)}`
                );
              }
            }
            x.color && await t.log(
              `  DEBUG:   backgrounds[${h}].color: ${JSON.stringify(x.color)}`
            );
          }
        }
      }
      const F = Object.keys(e).filter(
        (h) => !h.startsWith("_") && h !== "parent" && h !== "removed" && typeof e[h] != "function" && h !== "type" && h !== "id" && h !== "name" && h !== "boundVariables" && h !== "backgrounds" && h !== "fills"
      ), O = Object.keys(o).filter(
        (h) => !h.startsWith("_") && h !== "parent" && h !== "removed" && typeof o[h] != "function" && h !== "type" && h !== "id" && h !== "name" && h !== "boundVariables" && h !== "backgrounds" && h !== "fills"
      ), v = [
        .../* @__PURE__ */ new Set([...F, ...O])
      ].filter(
        (h) => h.toLowerCase().includes("selection") || h.toLowerCase().includes("select") || h.toLowerCase().includes("color") && !h.toLowerCase().includes("fill") && !h.toLowerCase().includes("stroke")
      );
      if (v.length > 0) {
        await t.log(
          `  DEBUG: Found selection/color-related properties: ${v.join(", ")}`
        );
        for (const h of v)
          try {
            if (F.includes(h)) {
              const x = e[h];
              await t.log(
                `  DEBUG:   Instance.${h}: ${JSON.stringify(x)}`
              );
            }
            if (O.includes(h)) {
              const x = o[h];
              await t.log(
                `  DEBUG:   MainComponent.${h}: ${JSON.stringify(x)}`
              );
            }
          } catch (x) {
          }
      } else
        await t.log(
          "  DEBUG: No selection/color-related properties found on instance or main component"
        );
    } else if (b === "normal") {
      const E = r || u;
      if (E) {
        D.componentPageName = E.name;
        const C = Rt(E);
        C != null && C.id && C.version !== void 0 ? (D.componentGuid = C.id, D.componentVersion = C.version, await t.log(
          `  Found INSTANCE: "${c}" -> NORMAL component "${d}" (ID: ${o.id.substring(0, 8)}...) at path [${(S || []).join(" → ")}]`
        )) : await t.warning(
          `  Instance "${c}" -> component "${d}" is classified as normal but page "${E.name}" has no metadata. This instance will not be importable.`
        );
      } else {
        const C = o.id;
        let F = "", O = "";
        switch (y.reason) {
          case "broken_chain":
            F = "The component's parent chain is broken and cannot be traversed to find the page", O = "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            F = "Cannot access the component's parent chain (access error)", O = "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            F = "Cannot determine which page the component is on", O = "Please ensure the component is properly placed on a page.";
        }
        try {
          await figma.viewport.scrollAndZoomIntoView([o]);
        } catch (x) {
          console.warn("Could not scroll to component:", x);
        }
        const v = `Normal instance "${c}" -> component "${d}" (ID: ${C}) has no componentPage. ${F}. ${O} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", v), await t.error(v);
        const h = new Error(v);
        throw console.error("Throwing error:", h), h;
      }
      S === void 0 && console.warn(
        `Failed to build path for normal instance "${c}" -> component "${d}". Path is required for resolution.`
      );
      const T = S && S.length > 0 ? ` at path [${S.join(" → ")}]` : " at page root";
      await t.log(
        `  Found INSTANCE: "${c}" -> NORMAL component "${d}" (ID: ${o.id.substring(0, 8)}...)${T}`
      );
    } else if (b === "remote") {
      let E, T;
      const C = a.detachedComponentsHandled.has(
        o.id
      );
      if (!C)
        try {
          if (typeof o.getPublishStatusAsync == "function")
            try {
              const O = await o.getPublishStatusAsync();
              O && typeof O == "object" && (O.libraryName && (E = O.libraryName), O.libraryKey && (T = O.libraryKey));
            } catch (O) {
            }
          try {
            const O = figma.teamLibrary;
            if (typeof (O == null ? void 0 : O.getAvailableLibraryComponentSetsAsync) == "function") {
              const v = await O.getAvailableLibraryComponentSetsAsync();
              if (v && Array.isArray(v)) {
                for (const h of v)
                  if (h.key === o.key || h.name === o.name) {
                    h.libraryName && (E = h.libraryName), h.libraryKey && (T = h.libraryKey);
                    break;
                  }
              }
            }
          } catch (O) {
          }
        } catch (O) {
          console.warn(
            `Error getting library info for remote component "${d}":`,
            O
          );
        }
      if (E && (D.remoteLibraryName = E), T && (D.remoteLibraryKey = T), C && (D.componentNodeId = o.id), a.instanceTable.getInstanceIndex(D) !== -1)
        await t.log(
          `  Found INSTANCE: "${c}" -> REMOTE component "${d}" (ID: ${o.id.substring(0, 8)}...)${C ? " [DETACHED]" : ""}`
        );
      else
        try {
          const { parseBaseNodeProperties: O } = await Promise.resolve().then(() => Pa), v = await O(e, a), { parseFrameProperties: h } = await Promise.resolve().then(() => Ta), x = await h(e, a), I = Ne(ge(ge({}, v), x), {
            type: "COMPONENT"
            // Convert to COMPONENT type for recreation (must be after baseProps to override)
          });
          if (e.children && Array.isArray(e.children) && e.children.length > 0) {
            const V = Ne(ge({}, a), {
              depth: (a.depth || 0) + 1
            }), { extractNodeData: J } = await Promise.resolve().then(() => Ja), Q = [];
            for (const M of e.children)
              try {
                let L;
                if (M.type === "INSTANCE")
                  try {
                    const X = await M.getMainComponentAsync();
                    if (X) {
                      const z = await O(
                        M,
                        a
                      ), W = await h(
                        M,
                        a
                      ), q = await J(
                        X,
                        /* @__PURE__ */ new WeakSet(),
                        V
                      );
                      L = Ne(ge(ge(ge({}, q), z), W), {
                        type: "COMPONENT"
                        // Convert to COMPONENT
                      });
                    } else
                      L = await J(
                        M,
                        /* @__PURE__ */ new WeakSet(),
                        V
                      ), L.type === "INSTANCE" && (L.type = "COMPONENT"), delete L._instanceRef;
                  } catch (X) {
                    L = await J(
                      M,
                      /* @__PURE__ */ new WeakSet(),
                      V
                    ), L.type === "INSTANCE" && (L.type = "COMPONENT"), delete L._instanceRef;
                  }
                else {
                  L = await J(
                    M,
                    /* @__PURE__ */ new WeakSet(),
                    V
                  );
                  const X = M.boundVariables;
                  if (X && typeof X == "object") {
                    const z = Object.keys(X);
                    z.length > 0 && (await t.log(
                      `  DEBUG: Child "${M.name || "Unnamed"}" -> boundVariables keys: ${z.join(", ")}`
                    ), X.backgrounds !== void 0 && await t.log(
                      `  DEBUG:   Child "${M.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(X.backgrounds)}`
                    ));
                  }
                  if (o.children && Array.isArray(o.children)) {
                    const z = o.children.find(
                      (W) => W.name === M.name
                    );
                    if (z) {
                      const W = z.boundVariables;
                      if (W && typeof W == "object") {
                        const q = Object.keys(W);
                        if (q.length > 0 && (await t.log(
                          `  DEBUG: Main component child "${z.name || "Unnamed"}" -> boundVariables keys: ${q.join(", ")}`
                        ), W.backgrounds !== void 0 && (await t.log(
                          `  DEBUG:   Main component child "${z.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(W.backgrounds)}`
                        ), !X || !X.backgrounds))) {
                          await t.log(
                            "  DEBUG:   Instance child doesn't have boundVariables.backgrounds, but main component child does - preserving from main component"
                          );
                          const { extractBoundVariables: Y } = await Promise.resolve().then(() => We), K = await Y(
                            W,
                            a.variableTable,
                            a.collectionTable
                          );
                          L.boundVariables || (L.boundVariables = {}), K.backgrounds && (L.boundVariables.backgrounds = K.backgrounds, await t.log(
                            "  DEBUG:   ✓ Added boundVariables.backgrounds to childData from main component child"
                          ));
                        }
                      }
                    }
                  }
                }
                Q.push(L);
              } catch (L) {
                console.warn(
                  `Failed to extract child "${M.name || "Unnamed"}" for remote component "${d}":`,
                  L
                );
              }
            I.children = Q;
          }
          if (!I)
            throw new Error("Failed to build structure for remote instance");
          try {
            const V = e.boundVariables;
            if (V && typeof V == "object") {
              const B = Object.keys(V);
              await t.log(
                `  DEBUG: Instance "${c}" -> boundVariables keys: ${B.length > 0 ? B.join(", ") : "none"}`
              );
              for (const ie of B) {
                const re = V[ie], ce = (re == null ? void 0 : re.type) || typeof re;
                if (await t.log(
                  `  DEBUG:   boundVariables.${ie}: type=${ce}, value=${JSON.stringify(re)}`
                ), re && typeof re == "object" && !Array.isArray(re)) {
                  const ne = Object.keys(re);
                  if (ne.length > 0) {
                    await t.log(
                      `  DEBUG:     boundVariables.${ie} has nested keys: ${ne.join(", ")}`
                    );
                    for (const se of ne) {
                      const le = re[se];
                      le && typeof le == "object" && le.type === "VARIABLE_ALIAS" && await t.log(
                        `  DEBUG:       boundVariables.${ie}.${se}: VARIABLE_ALIAS id=${le.id}`
                      );
                    }
                  }
                }
              }
              const ee = [
                "backgrounds",
                "selectionColor",
                "selectionColors",
                "selection",
                "selectColor"
              ];
              for (const ie of ee)
                V[ie] !== void 0 && await t.log(
                  `  DEBUG:   Found potential "Selection colors" property: boundVariables.${ie} = ${JSON.stringify(V[ie])}`
                );
            } else
              await t.log(
                `  DEBUG: Instance "${c}" -> No boundVariables found on instance node`
              );
            const J = V && V.fills !== void 0 && V.fills !== null, Q = I.fills !== void 0 && Array.isArray(I.fills) && I.fills.length > 0, M = e.fills !== void 0 && Array.isArray(e.fills) && e.fills.length > 0, L = o.fills !== void 0 && Array.isArray(o.fills) && o.fills.length > 0;
            if (await t.log(
              `  DEBUG: Instance "${c}" -> fills check: instanceHasFills=${M}, structureHasFills=${Q}, mainComponentHasFills=${L}, hasInstanceFillsBoundVar=${!!J}`
            ), J && !Q) {
              await t.log(
                "  DEBUG: Instance has boundVariables.fills but structure has no fills - attempting to get fills"
              );
              try {
                if (M) {
                  const { serializeFills: B } = await Promise.resolve().then(() => We), ee = await B(
                    e.fills,
                    a.variableTable,
                    a.collectionTable
                  );
                  I.fills = ee, await t.log(
                    `  DEBUG: Got ${ee.length} fill(s) from instance node`
                  );
                } else if (L) {
                  const { serializeFills: B } = await Promise.resolve().then(() => We), ee = await B(
                    o.fills,
                    a.variableTable,
                    a.collectionTable
                  );
                  I.fills = ee, await t.log(
                    `  DEBUG: Got ${ee.length} fill(s) from main component`
                  );
                } else
                  await t.warning(
                    "  DEBUG: Instance has boundVariables.fills but neither instance nor main component has fills"
                  );
              } catch (B) {
                await t.warning(
                  `  Failed to get fills: ${B}`
                );
              }
            }
            const X = e.selectionColor, z = o.selectionColor;
            X !== void 0 && await t.log(
              `  DEBUG: Instance "${c}" -> selectionColor: ${JSON.stringify(X)}`
            ), z !== void 0 && await t.log(
              `  DEBUG: Main component "${d}" -> selectionColor: ${JSON.stringify(z)}`
            );
            const W = Object.keys(e).filter(
              (B) => !B.startsWith("_") && B !== "parent" && B !== "removed" && typeof e[B] != "function" && B !== "type" && B !== "id" && B !== "name"
            ), q = Object.keys(o).filter(
              (B) => !B.startsWith("_") && B !== "parent" && B !== "removed" && typeof o[B] != "function" && B !== "type" && B !== "id" && B !== "name"
            ), Y = [
              .../* @__PURE__ */ new Set([...W, ...q])
            ].filter(
              (B) => B.toLowerCase().includes("selection") || B.toLowerCase().includes("select") || B.toLowerCase().includes("color") && !B.toLowerCase().includes("fill") && !B.toLowerCase().includes("stroke")
            );
            if (Y.length > 0) {
              await t.log(
                `  DEBUG: Found selection/color-related properties: ${Y.join(", ")}`
              );
              for (const B of Y)
                try {
                  if (W.includes(B)) {
                    const ee = e[B];
                    await t.log(
                      `  DEBUG:   Instance.${B}: ${JSON.stringify(ee)}`
                    );
                  }
                  if (q.includes(B)) {
                    const ee = o[B];
                    await t.log(
                      `  DEBUG:   MainComponent.${B}: ${JSON.stringify(ee)}`
                    );
                  }
                } catch (ee) {
                }
            } else
              await t.log(
                "  DEBUG: No selection/color-related properties found on instance or main component"
              );
            const K = o.boundVariables;
            if (K && typeof K == "object") {
              const B = Object.keys(K);
              if (B.length > 0) {
                await t.log(
                  `  DEBUG: Main component "${d}" -> boundVariables keys: ${B.join(", ")}`
                ), B.includes("selectionColor") ? await t.log(
                  `[ISSUE #2 EXPORT] Main component "${d}" HAS selectionColor in boundVariables: ${JSON.stringify(K.selectionColor)}`
                ) : await t.log(
                  `[ISSUE #2 EXPORT] Main component "${d}" does NOT have selectionColor in boundVariables (has: ${B.join(", ")})`
                );
                for (const ee of B) {
                  const ie = K[ee], re = (ie == null ? void 0 : ie.type) || typeof ie;
                  await t.log(
                    `  DEBUG:   Main component boundVariables.${ee}: type=${re}, value=${JSON.stringify(ie)}`
                  );
                }
              } else
                await t.log(
                  `[ISSUE #2 EXPORT] Main component "${d}" has no boundVariables`
                );
            } else
              await t.log(
                `[ISSUE #2 EXPORT] Main component "${d}" boundVariables is null/undefined`
              );
            if (V && Object.keys(V).length > 0) {
              await t.log(
                `  DEBUG: Preserving instance's boundVariables in structure (${Object.keys(V).length} key(s))`
              );
              const { extractBoundVariables: B } = await Promise.resolve().then(() => We), ee = await B(
                V,
                a.variableTable,
                a.collectionTable
              );
              I.boundVariables || (I.boundVariables = {});
              for (const [ie, re] of Object.entries(
                ee
              ))
                re !== void 0 && (I.boundVariables[ie] !== void 0 && await t.log(
                  `  DEBUG: Structure already has boundVariables.${ie} from baseProps, but instance also has it - using instance's boundVariables.${ie}`
                ), I.boundVariables[ie] = re, await t.log(
                  `  DEBUG: Set boundVariables.${ie} in structure: ${JSON.stringify(re)}`
                ));
              ee.fills !== void 0 ? await t.log(
                "  DEBUG: ✓ Preserved boundVariables.fills from instance"
              ) : J && await t.warning(
                "  DEBUG: Instance has boundVariables.fills but extractBoundVariables didn't extract it"
              ), ee.backgrounds !== void 0 ? await t.log(
                `  DEBUG: ✓ Preserved boundVariables.backgrounds from instance: ${JSON.stringify(ee.backgrounds)}`
              ) : V && V.backgrounds !== void 0 && await t.warning(
                "  DEBUG: Instance has boundVariables.backgrounds but extractBoundVariables didn't extract it"
              );
            }
            if (K && Object.keys(K).length > 0) {
              await t.log(
                `  DEBUG: Checking main component's boundVariables for properties not in instance (${Object.keys(K).length} key(s))`
              );
              const { extractBoundVariables: B } = await Promise.resolve().then(() => We), ee = await B(
                K,
                a.variableTable,
                a.collectionTable
              );
              I.boundVariables || (I.boundVariables = {});
              for (const [ie, re] of Object.entries(
                ee
              ))
                re !== void 0 && (I.boundVariables[ie] === void 0 ? (I.boundVariables[ie] = re, ie === "selectionColor" ? await t.log(
                  `[ISSUE #2 EXPORT] Added boundVariables.selectionColor from main component "${d}" to instance "${c}": ${JSON.stringify(re)}`
                ) : await t.log(
                  `  DEBUG: Added boundVariables.${ie} from main component (not in instance): ${JSON.stringify(re)}`
                )) : ie === "selectionColor" ? await t.log(
                  `[ISSUE #2 EXPORT] Skipped boundVariables.selectionColor from main component "${d}" (instance "${c}" already has it)`
                ) : await t.log(
                  `  DEBUG: Skipped boundVariables.${ie} from main component (instance already has it)`
                ));
            }
            await t.log(
              `  DEBUG: Final structure for "${d}": hasFills=${!!I.fills}, fillsCount=${((s = I.fills) == null ? void 0 : s.length) || 0}, hasBoundVars=${!!I.boundVariables}, boundVarsKeys=${I.boundVariables ? Object.keys(I.boundVariables).join(", ") : "none"}`
            ), (l = I.boundVariables) != null && l.fills && await t.log(
              `  DEBUG: Structure boundVariables.fills: ${JSON.stringify(I.boundVariables.fills)}`
            );
          } catch (V) {
            await t.warning(
              `  Failed to handle bound variables for fills: ${V}`
            );
          }
          D.structure = I, C ? await t.log(
            `  Extracted structure for detached component "${d}" (ID: ${o.id.substring(0, 8)}...)`
          ) : await t.log(
            `  Extracted structure from instance for remote component "${d}" (preserving size overrides: ${e.width}x${e.height})`
          ), await t.log(
            `  Found INSTANCE: "${c}" -> REMOTE component "${d}" (ID: ${o.id.substring(0, 8)}...)${C ? " [DETACHED]" : ""}`
          );
        } catch (O) {
          const v = `Failed to extract structure for remote component "${d}": ${O instanceof Error ? O.message : String(O)}`;
          console.error(v, O), await t.error(v);
        }
    }
    if (b === "normal" && o) {
      if (e.children && Array.isArray(e.children) && e.children.length > 0) {
        await t.log(
          `[DEBUG] Normal instance "${c}" has ${e.children.length} child(ren) (unexpected for normal instance):`
        );
        for (let E = 0; E < Math.min(e.children.length, 5); E++) {
          const T = e.children[E];
          if (T) {
            const C = T.name || `Child ${E}`, F = T.type || "UNKNOWN", O = T.boundVariables, v = T.fills;
            if (await t.log(
              `[DEBUG]   Child ${E}: "${C}" (${F}) - hasBoundVars=${!!O}, hasFills=${!!v}`
            ), O) {
              const h = Object.keys(O);
              await t.log(
                `[DEBUG]     boundVariables: ${h.join(", ")}`
              );
            }
          }
        }
      }
      if (o.children && Array.isArray(o.children) && o.children.length > 0) {
        await t.log(
          `[DEBUG] Main component "${d}" has ${o.children.length} child(ren):`
        );
        for (let E = 0; E < Math.min(o.children.length, 5); E++) {
          const T = o.children[E];
          if (T) {
            const C = T.name || `Child ${E}`, F = T.type || "UNKNOWN", O = T.boundVariables, v = T.fills;
            if (await t.log(
              `[DEBUG]   Main component child ${E}: "${C}" (${F}) - hasBoundVars=${!!O}, hasFills=${!!v}`
            ), O) {
              const h = Object.keys(O);
              await t.log(
                `[DEBUG]     boundVariables: ${h.join(", ")}`
              ), O.fills && await t.log(
                `[DEBUG]     boundVariables.fills: ${JSON.stringify(O.fills)}`
              );
            }
            if (v && Array.isArray(v) && v.length > 0) {
              const h = v[0];
              h && typeof h == "object" && await t.log(
                `[DEBUG]     fills[0]: type=${h.type}, color=${JSON.stringify(h.color)}`
              );
            }
            if (e.children && Array.isArray(e.children) && E < e.children.length) {
              const h = e.children[E];
              if (h && h.name === C) {
                const x = h.boundVariables, I = x ? Object.keys(x) : [], V = O ? Object.keys(O) : [], J = I.filter(
                  (Q) => !V.includes(Q)
                );
                if (J.length > 0) {
                  await t.log(
                    `[DEBUG] Instance "${c}" child "${C}" has instance override bound variables: ${J.join(", ")} (will be exported with instance children)`
                  );
                  for (const Q of J)
                    await t.log(
                      `[DEBUG]   Instance child boundVariables.${Q}: ${JSON.stringify(x[Q])}`
                    );
                }
              }
            }
          }
        }
      }
      try {
        const E = o.boundVariables;
        if (E && typeof E == "object") {
          const T = Object.keys(E);
          if (T.length > 0) {
            await t.log(
              `[ISSUE #2 EXPORT] Normal instance "${c}" -> checking main component "${d}" boundVariables (${T.length} key(s))`
            ), T.includes("selectionColor") ? await t.log(
              `[ISSUE #2 EXPORT] Main component "${d}" HAS selectionColor in boundVariables: ${JSON.stringify(E.selectionColor)}`
            ) : await t.log(
              `[ISSUE #2 EXPORT] Main component "${d}" does NOT have selectionColor in boundVariables (has: ${T.join(", ")})`
            );
            const { extractBoundVariables: C } = await Promise.resolve().then(() => We), F = await C(
              E,
              a.variableTable,
              a.collectionTable
            );
            n.boundVariables || (n.boundVariables = {});
            for (const [O, v] of Object.entries(
              F
            ))
              v !== void 0 && (n.boundVariables[O] === void 0 ? (n.boundVariables[O] = v, O === "selectionColor" ? await t.log(
                `[ISSUE #2 EXPORT] Added boundVariables.selectionColor from main component "${d}" to normal instance "${c}": ${JSON.stringify(v)}`
              ) : await t.log(
                `  DEBUG: Added boundVariables.${O} from main component to normal instance: ${JSON.stringify(v)}`
              )) : O === "selectionColor" && await t.log(
                `[ISSUE #2 EXPORT] Skipped boundVariables.selectionColor from main component "${d}" (normal instance "${c}" already has it)`
              ));
          } else
            await t.log(
              `[ISSUE #2 EXPORT] Main component "${d}" has no boundVariables`
            );
        } else
          await t.log(
            `[ISSUE #2 EXPORT] Main component "${d}" boundVariables is null/undefined`
          );
      } catch (E) {
        await t.warning(
          `[ISSUE #2 EXPORT] Error checking main component boundVariables for normal instance "${c}": ${E}`
        );
      }
    }
    const j = a.instanceTable.addInstance(D);
    n._instanceRef = j, i.add("_instanceRef");
  }
  return n;
}
class it {
  constructor() {
    Ie(this, "instanceMap");
    // unique key -> index
    Ie(this, "instances");
    // index -> instance data
    Ie(this, "nextIndex");
    this.instanceMap = /* @__PURE__ */ new Map(), this.instances = [], this.nextIndex = 0;
  }
  /**
   * Generates a unique key for an instance based on its type
   */
  generateKey(a) {
    if (a.instanceType === "internal" && a.componentNodeId) {
      const n = a.variantProperties ? `:${JSON.stringify(a.variantProperties)}` : "";
      return `internal:${a.componentNodeId}${n}`;
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
    const n = this.generateKey(a);
    if (this.instanceMap.has(n))
      return this.instanceMap.get(n);
    const i = this.nextIndex++;
    return this.instanceMap.set(n, i), this.instances[i] = a, i;
  }
  /**
   * Gets the index of an instance by its unique key
   * Returns -1 if not found
   */
  getInstanceIndex(a) {
    var i;
    const n = this.generateKey(a);
    return (i = this.instanceMap.get(n)) != null ? i : -1;
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
    for (let n = 0; n < this.instances.length; n++)
      a[String(n)] = this.instances[n];
    return a;
  }
  /**
   * Reconstructs an InstanceTable from a serialized table object
   */
  static fromTable(a) {
    const n = new it(), i = Object.entries(a).sort(
      (s, l) => parseInt(s[0], 10) - parseInt(l[0], 10)
    );
    for (const [s, l] of i) {
      const o = parseInt(s, 10), c = n.generateKey(l);
      n.instanceMap.set(c, o), n.instances[o] = l, n.nextIndex = Math.max(n.nextIndex, o + 1);
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
class ft {
  constructor() {
    Ie(this, "styles", /* @__PURE__ */ new Map());
    Ie(this, "styleKeyToIndex", /* @__PURE__ */ new Map());
    Ie(this, "nextIndex", 0);
  }
  /**
   * Add a style to the table and return its index
   * If the style already exists (by styleKey), returns the existing index
   */
  addStyle(a) {
    const n = a.styleKey || `${a.type}:${a.name}:${JSON.stringify(a.textStyle || a.paintStyle || a.effectStyle || a.gridStyle)}`, i = this.styleKeyToIndex.get(n);
    if (i !== void 0)
      return i;
    const s = this.nextIndex++;
    return this.styles.set(s, Ne(ge({}, a), { styleKey: n })), this.styleKeyToIndex.set(n, s), s;
  }
  /**
   * Get the index of a style by its styleKey (used during export)
   */
  getStyleIndex(a) {
    var n;
    return (n = this.styleKeyToIndex.get(a)) != null ? n : -1;
  }
  /**
   * Get a style by index
   */
  getStyleByIndex(a) {
    return this.styles.get(a);
  }
  /**
   * Get the number of styles in the table
   */
  getSize() {
    return this.styles.size;
  }
  /**
   * Get the full table (for serialization)
   * Excludes internal styleKey field
   */
  getSerializedTable() {
    const a = {};
    for (const [i, s] of this.styles.entries()) {
      const n = s, { styleKey: l } = n, o = Vt(n, ["styleKey"]);
      a[String(i)] = o;
    }
    return a;
  }
  /**
   * Get the full table with styleKey (for internal use)
   */
  getTable() {
    const a = {};
    for (const [n, i] of this.styles.entries())
      a[String(n)] = i;
    return a;
  }
  /**
   * Reconstruct StyleTable from serialized data
   */
  static fromTable(a) {
    const n = new ft();
    for (const [i, s] of Object.entries(a)) {
      const l = parseInt(i, 10), o = s.styleKey || `${s.type}:${s.name}:${JSON.stringify(s.textStyle || s.paintStyle || s.effectStyle || s.gridStyle)}`;
      n.styles.set(l, Ne(ge({}, s), { styleKey: o })), n.styleKeyToIndex.set(o, l), l >= n.nextIndex && (n.nextIndex = l + 1);
    }
    return n;
  }
}
const Dt = {
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
function Ga() {
  const e = {};
  for (const [a, n] of Object.entries(Dt))
    e[n] = a;
  return e;
}
function Mt(e) {
  var a;
  return (a = Dt[e]) != null ? a : e;
}
function _a(e) {
  var a;
  return typeof e == "number" ? (a = Ga()[e]) != null ? a : e.toString() : e;
}
const Ht = {
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
}, St = {};
for (const [e, a] of Object.entries(Ht))
  St[a] = e;
class mt {
  constructor() {
    Ie(this, "shortToLong");
    Ie(this, "longToShort");
    this.shortToLong = ge({}, St), this.longToShort = ge({}, Ht);
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
      return a.map((n) => this.compressObject(n));
    if (typeof a == "object") {
      const n = {}, i = /* @__PURE__ */ new Set();
      for (const s of Object.keys(a))
        i.add(s);
      for (const [s, l] of Object.entries(a)) {
        const o = this.getShortName(s);
        if (o !== s && !i.has(o)) {
          let c = this.compressObject(l);
          o === "type" && typeof c == "string" && (c = Mt(c)), n[o] = c;
        } else {
          let c = this.compressObject(l);
          s === "type" && typeof c == "string" && (c = Mt(c)), n[s] = c;
        }
      }
      return n;
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
      return a.map((n) => this.expandObject(n));
    if (typeof a == "object") {
      const n = {};
      for (const [i, s] of Object.entries(a)) {
        const l = this.getLongName(i);
        let o = this.expandObject(s);
        (l === "type" || i === "type") && (typeof o == "number" || typeof o == "string") && (o = _a(o)), n[l] = o;
      }
      return n;
    }
    return a;
  }
  /**
   * Gets the serialized string table for JSON export
   * Returns the mapping of short -> long names
   */
  getSerializedTable() {
    return ge({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(a) {
    const n = new mt();
    n.shortToLong = ge(ge({}, St), a), n.longToShort = {};
    for (const [i, s] of Object.entries(
      n.shortToLong
    ))
      n.longToShort[s] = i;
    return n;
  }
}
function za(e, a) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const n = {};
  e.metadata && (n.metadata = e.metadata);
  for (const [i, s] of Object.entries(e))
    i !== "metadata" && (n[i] = a.compressObject(s));
  return n;
}
function ja(e, a) {
  return a.expandObject(e);
}
function dt(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
function pt(e) {
  let a = 1;
  return e.children && e.children.length > 0 && e.children.forEach((n) => {
    a += pt(n);
  }), a;
}
function Wt(e) {
  let a = 0;
  if ((e.cnsHr !== void 0 || e.cnsVr !== void 0) && (a = 1), (e.constraintHorizontal !== void 0 || e.constraintVertical !== void 0) && a === 0 && (a = 1), e.children && Array.isArray(e.children))
    for (const n of e.children)
      n && typeof n == "object" && (a += Wt(n));
  return a;
}
async function ut(e, a = /* @__PURE__ */ new WeakSet(), n = {}) {
  var $, y, u, b, r, w, g;
  if (!e || typeof e != "object")
    return e;
  const i = ($ = n.maxNodes) != null ? $ : 1e4, s = (y = n.nodeCount) != null ? y : 0;
  if (s >= i)
    return await t.warning(
      `Maximum node count (${i}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: s
    };
  const l = {
    visited: (u = n.visited) != null ? u : /* @__PURE__ */ new WeakSet(),
    depth: (b = n.depth) != null ? b : 0,
    maxDepth: (r = n.maxDepth) != null ? r : 100,
    nodeCount: s + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: n.variableTable,
    collectionTable: n.collectionTable,
    instanceTable: n.instanceTable,
    styleTable: n.styleTable,
    detachedComponentsHandled: (w = n.detachedComponentsHandled) != null ? w : /* @__PURE__ */ new Set(),
    exportedIds: (g = n.exportedIds) != null ? g : /* @__PURE__ */ new Map()
  };
  if (a.has(e))
    return "[Circular Reference]";
  a.add(e), l.visited = a;
  const o = {}, c = await jt(e, l);
  if (Object.assign(o, c), o.id && l.exportedIds) {
    const S = l.exportedIds.get(o.id);
    if (S !== void 0) {
      const k = o.name || "Unnamed";
      if (S !== k) {
        const D = `Duplicate ID detected during export: ID "${o.id.substring(0, 8)}..." is used by both "${S}" and "${k}". Each node must have a unique ID.`;
        throw await t.error(D), new Error(D);
      }
      await t.warning(
        `Node "${k}" (ID: ${o.id.substring(0, 8)}...) was encountered multiple times during export. This may indicate a structural issue.`
      );
    } else
      l.exportedIds.set(o.id, o.name || "Unnamed");
  }
  const d = e.type;
  if (d)
    switch (d) {
      case "FRAME":
      case "COMPONENT": {
        const S = await vt(e);
        Object.assign(o, S);
        break;
      }
      case "INSTANCE": {
        const S = await Fa(
          e,
          l
        );
        Object.assign(o, S);
        const k = await vt(
          e
        );
        Object.assign(o, k);
        break;
      }
      case "TEXT": {
        const S = await xa(e, l);
        Object.assign(o, S);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const S = await Ma(e);
        Object.assign(o, S);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const S = await ka(e);
        Object.assign(o, S);
        break;
      }
      default:
        l.unhandledKeys.add("_unknownType");
        break;
    }
  const p = Object.getOwnPropertyNames(e), m = /* @__PURE__ */ new Set([
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
  (d === "FRAME" || d === "COMPONENT" || d === "INSTANCE") && (m.add("layoutMode"), m.add("primaryAxisSizingMode"), m.add("counterAxisSizingMode"), m.add("primaryAxisAlignItems"), m.add("counterAxisAlignItems"), m.add("paddingLeft"), m.add("paddingRight"), m.add("paddingTop"), m.add("paddingBottom"), m.add("itemSpacing"), m.add("counterAxisSpacing"), m.add("cornerRadius"), m.add("clipsContent"), m.add("layoutWrap"), m.add("layoutGrow")), d === "TEXT" && (m.add("characters"), m.add("fontName"), m.add("fontSize"), m.add("textAlignHorizontal"), m.add("textAlignVertical"), m.add("letterSpacing"), m.add("lineHeight"), m.add("textCase"), m.add("textDecoration"), m.add("textAutoResize"), m.add("paragraphSpacing"), m.add("paragraphIndent"), m.add("listOptions")), (d === "VECTOR" || d === "LINE") && (m.add("fillGeometry"), m.add("strokeGeometry")), (d === "RECTANGLE" || d === "ELLIPSE" || d === "STAR" || d === "POLYGON") && (m.add("pointCount"), m.add("innerRadius"), m.add("arcData")), d === "INSTANCE" && (m.add("mainComponent"), m.add("componentProperties"));
  for (const S of p)
    typeof e[S] != "function" && (m.has(S) || l.unhandledKeys.add(S));
  if (l.unhandledKeys.size > 0 && (o._unhandledKeys = Array.from(l.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const S = l.maxDepth;
    if (l.depth >= S)
      o.children = {
        _truncated: !0,
        _reason: `Maximum depth (${S}) reached`,
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
      const k = Ne(ge({}, l), {
        depth: l.depth + 1
      }), D = [];
      let j = !1;
      for (const E of e.children) {
        if (k.nodeCount >= i) {
          o.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: D.length,
            _total: e.children.length,
            children: D
          }, j = !0;
          break;
        }
        const T = await ut(E, a, k);
        D.push(T), k.nodeCount && (l.nodeCount = k.nodeCount);
      }
      j || (o.children = D);
    }
  }
  return o;
}
async function qe(e, a = /* @__PURE__ */ new Set(), n = !1, i = /* @__PURE__ */ new Set()) {
  e.clearConsole !== !1 && !n ? (await t.clear(), await t.log("=== Starting Page Export ===")) : n || await t.log("=== Starting Page Export ===");
  try {
    const l = e.pageIndex;
    if (l === void 0 || typeof l != "number")
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
    const o = figma.root.children;
    if (await t.log(`Loaded ${o.length} page(s)`), l < 0 || l >= o.length)
      return await t.error(
        `Invalid page index: ${l} (valid range: 0-${o.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const c = o[l], d = c.id;
    if (e.skipPrompts) {
      if (i.has(d))
        return await t.log(
          `Page "${c.name}" already discovered, skipping discovery...`
        ), {
          type: "exportPage",
          success: !0,
          error: !1,
          message: "Page already discovered",
          data: {
            filename: "",
            pageData: {},
            pageName: c.name,
            additionalPages: [],
            discoveredReferencedPages: []
          }
        };
      i.add(d);
    } else {
      if (a.has(d))
        return await t.log(
          `Page "${c.name}" has already been processed, skipping...`
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
      `Selected page: "${c.name}" (index: ${l})`
    ), await t.log(
      "Initializing variable, collection, and instance tables..."
    );
    const p = new nt(), m = new at(), $ = new it(), y = new ft();
    await t.log("Extracting node data from page..."), await t.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await t.log(
      "Collections will be discovered as variables are processed:"
    );
    const u = await ut(
      c,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: p,
        collectionTable: m,
        instanceTable: $,
        styleTable: y
      }
    );
    await t.log("Node extraction finished");
    const b = pt(u), r = p.getSize(), w = m.getSize(), g = $.getSize(), S = Wt(u);
    await t.log("Extraction complete:"), await t.log(`  - Total nodes: ${b}`), await t.log(`  - Unique variables: ${r}`), await t.log(`  - Unique collections: ${w}`), await t.log(`  - Unique instances: ${g}`), await t.log(
      `  - Nodes with constraints exported: ${S}`
    );
    const k = $.getSerializedTable(), D = /* @__PURE__ */ new Map();
    for (const [z, W] of Object.entries(k))
      if (W.instanceType === "remote") {
        const q = parseInt(z, 10);
        D.set(q, W);
      }
    if (e.validateOnly) {
      await t.log("=== Validation Mode ===");
      const z = await figma.variables.getLocalVariableCollectionsAsync(), W = /* @__PURE__ */ new Set(), q = /* @__PURE__ */ new Set();
      for (const ce of z)
        W.add(ce.id), q.add(ce.name);
      q.add("Token"), q.add("Tokens"), q.add("Theme"), q.add("Themes");
      const Y = [], K = [];
      for (const ce of D.values()) {
        const ne = ce.componentName || "(unnamed)";
        Y.push({
          componentName: ne,
          pageName: c.name
        }), K.push({
          type: "externalReference",
          message: `External reference found: "${ne}" references a component from another file`,
          componentName: ne,
          pageName: c.name
        });
      }
      const B = [], ee = m.getTable();
      for (const ce of Object.values(ee))
        ce.isLocal ? W.has(ce.collectionId) || (B.push({
          collectionName: ce.collectionName,
          collectionId: ce.collectionId,
          pageName: c.name
        }), K.push({
          type: "unknownCollection",
          message: `Unknown local collection: "${ce.collectionName}"`,
          collectionName: ce.collectionName,
          pageName: c.name
        })) : q.has(ce.collectionName) || (B.push({
          collectionName: ce.collectionName,
          collectionId: ce.collectionId,
          pageName: c.name
        }), K.push({
          type: "unknownCollection",
          message: `Unknown remote collection: "${ce.collectionName}". Remote collections must be named "Token", "Tokens", "Theme", or "Themes"`,
          collectionName: ce.collectionName,
          pageName: c.name
        }));
      const ie = Object.values(ee).map(
        (ce) => ce.collectionName
      ), re = {
        hasErrors: K.length > 0,
        errors: K,
        externalReferences: Y,
        unknownCollections: B,
        discoveredCollections: ie
      };
      return await t.log("Validation complete:"), await t.log(
        `  - External references: ${Y.length}`
      ), await t.log(
        `  - Unknown collections: ${B.length}`
      ), await t.log(`  - Has errors: ${re.hasErrors}`), {
        type: "exportPage",
        success: !0,
        error: !1,
        message: "Validation complete",
        data: {
          filename: "",
          pageData: {},
          pageName: c.name,
          additionalPages: [],
          validationResult: re
        }
      };
    }
    if (D.size > 0) {
      await t.error(
        `Found ${D.size} remote instance(s) - remote instances are not supported during publishing`
      );
      const z = (K, B, ee = [], ie = !1) => {
        const re = [];
        if (!K || typeof K != "object")
          return re;
        if (ie || K.type === "PAGE") {
          const le = K.children || K.child;
          if (Array.isArray(le))
            for (const ue of le)
              ue && typeof ue == "object" && re.push(
                ...z(
                  ue,
                  B,
                  [],
                  !1
                )
              );
          return re;
        }
        const ce = K.name || "";
        if (typeof K._instanceRef == "number" && K._instanceRef === B) {
          const le = ce || "(unnamed)", ue = ee.length > 0 ? [...ee, le] : [le];
          return re.push({
            path: ue,
            nodeName: le
          }), re;
        }
        const ne = ce ? [...ee, ce] : ee, se = K.children || K.child;
        if (Array.isArray(se))
          for (const le of se)
            le && typeof le == "object" && re.push(
              ...z(
                le,
                B,
                ne,
                !1
              )
            );
        return re;
      }, W = [];
      let q = 1;
      for (const [K, B] of D.entries()) {
        const ee = B.componentName || "(unnamed)", ie = B.componentSetName, re = z(
          u,
          K,
          [],
          !0
        );
        let ce = "";
        re.length > 0 ? ce = `
   Location(s): ${re.map((ue) => {
          const be = ue.path.length > 0 ? ue.path.join(" → ") : "page root";
          return `"${ue.nodeName}" at ${be}`;
        }).join(", ")}` : ce = `
   Location: (unable to determine - instance may be deeply nested)`;
        const ne = ie ? `Component: "${ee}" (from component set "${ie}")` : `Component: "${ee}"`, se = B.remoteLibraryName ? `
   Library: ${B.remoteLibraryName}` : "";
        W.push(
          `${q}. ${ne}${se}${ce}`
        ), q++;
      }
      const Y = `Cannot publish: Remote instances are not supported. Please remove all remote instances before publishing.

Found ${D.size} remote instance(s):
${W.join(`

`)}

To fix this:
1. Locate each remote instance component listed above using the path(s) shown
2. Replace it with a local component or remove it
3. Try publishing again`;
      throw await t.error(Y), new Error(Y);
    }
    if (w > 0) {
      await t.log("Collections found:");
      const z = m.getTable();
      for (const [W, q] of Object.values(z).entries()) {
        const Y = q.collectionGuid ? ` (GUID: ${q.collectionGuid.substring(0, 8)}...)` : "";
        await t.log(
          `  ${W}: ${q.collectionName}${Y} - ${q.modes.length} mode(s)`
        );
      }
    }
    let j;
    if (e.skipPrompts) {
      await t.log("Running validation on main page...");
      try {
        const z = await qe(
          {
            pageIndex: l,
            validateOnly: !0
          },
          a,
          !0,
          // Mark as recursive call
          i
        );
        if (z.success && z.data) {
          const W = z.data;
          W.validationResult && (j = W.validationResult, await t.log(
            `Main page validation: ${j.hasErrors ? "FAILED" : "PASSED"}`
          ), j.hasErrors && await t.warning(
            `Found ${j.errors.length} validation error(s) in main page`
          ));
        }
      } catch (z) {
        await t.warning(
          `Could not validate main page: ${z instanceof Error ? z.message : String(z)}`
        );
      }
    }
    await t.log("Checking for referenced component pages...");
    const E = [], T = [], C = Object.values(k).filter(
      (z) => z.instanceType === "normal"
    );
    if (C.length > 0) {
      await t.log(
        `Found ${C.length} normal instance(s) to check`
      );
      const z = /* @__PURE__ */ new Map();
      for (const W of C)
        if (W.componentPageName) {
          const q = o.find((Y) => Y.name === W.componentPageName);
          if (q && !a.has(q.id))
            z.has(q.id) || z.set(q.id, q);
          else if (!q) {
            const Y = `Normal instance references component "${W.componentName || "(unnamed)"}" on page "${W.componentPageName}", but that page was not found. Cannot export.`;
            throw await t.error(Y), new Error(Y);
          }
        } else {
          const q = `Normal instance references component "${W.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw await t.error(q), new Error(q);
        }
      await t.log(
        `Found ${z.size} unique referenced page(s)`
      );
      for (const [W, q] of z.entries()) {
        const Y = q.name;
        if (a.has(W)) {
          await t.log(`Skipping "${Y}" - already processed`);
          continue;
        }
        const K = q.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let B = !1, ee = 0;
        if (K)
          try {
            const ne = JSON.parse(K);
            B = !!(ne.id && ne.version !== void 0), ee = ne.version || 0;
          } catch (ne) {
          }
        const ie = o.findIndex(
          (ne) => ne.id === q.id
        );
        if (ie === -1)
          throw await t.error(
            `Could not find page index for "${Y}"`
          ), new Error(`Could not find page index for "${Y}"`);
        const re = Array.from(C).find(
          (ne) => ne.componentPageName === Y
        ), ce = re == null ? void 0 : re.componentName;
        if (e.skipPrompts) {
          W === d ? await t.log(
            `Skipping "${Y}" - this is the original page being published`
          ) : T.find(
            (se) => se.pageId === W
          ) || (T.push({
            pageId: W,
            pageName: Y,
            pageIndex: ie,
            hasMetadata: B,
            componentName: ce,
            localVersion: ee
          }), await t.log(
            `Discovered referenced page: "${Y}" (local version: ${ee}) (will be handled by wizard)`
          )), await t.log(
            `Validating "${Y}" for external references and unknown collections...`
          );
          try {
            const ne = await qe(
              {
                pageIndex: ie,
                validateOnly: !0
                // Run validation only
              },
              a,
              !0,
              // Mark as recursive call
              i
            );
            if (ne.success && ne.data) {
              const se = ne.data;
              if (se.validationResult) {
                j || (j = {
                  hasErrors: !1,
                  errors: [],
                  externalReferences: [],
                  unknownCollections: [],
                  discoveredCollections: []
                }), j.errors.push(
                  ...se.validationResult.errors
                ), j.externalReferences.push(
                  ...se.validationResult.externalReferences
                ), j.unknownCollections.push(
                  ...se.validationResult.unknownCollections
                );
                for (const le of se.validationResult.discoveredCollections)
                  j.discoveredCollections.includes(
                    le
                  ) || j.discoveredCollections.push(
                    le
                  );
                j.hasErrors = j.errors.length > 0, await t.log(
                  `  Validation for "${Y}": ${se.validationResult.hasErrors ? "FAILED" : "PASSED"}`
                ), se.validationResult.hasErrors && await t.warning(
                  `  Found ${se.validationResult.errors.length} validation error(s) in "${Y}"`
                );
              }
            }
          } catch (ne) {
            await t.warning(
              `Could not validate "${Y}": ${ne instanceof Error ? ne.message : String(ne)}`
            );
          }
          await t.log(
            `Checking dependencies of "${Y}" for transitive dependencies...`
          );
          try {
            const ne = await qe(
              {
                pageIndex: ie,
                skipPrompts: !0
                // Keep skipPrompts true to just discover, not export
              },
              a,
              // Pass the same set (won't be used during discovery)
              !0,
              // Mark as recursive call
              i
              // Pass the same discoveredPages set to avoid infinite loops
            );
            if (ne.success && ne.data) {
              const se = ne.data;
              if (se.discoveredReferencedPages)
                for (const le of se.discoveredReferencedPages) {
                  if (le.pageId === d) {
                    await t.log(
                      `  Skipping "${le.pageName}" - this is the original page being published`
                    );
                    continue;
                  }
                  T.find(
                    (be) => be.pageId === le.pageId
                  ) || (T.push(le), await t.log(
                    `  Discovered transitive dependency: "${le.pageName}" (from ${Y})`
                  ));
                }
            }
          } catch (ne) {
            await t.warning(
              `Could not discover dependencies of "${Y}": ${ne instanceof Error ? ne.message : String(ne)}`
            );
          }
        } else {
          const ne = `Do you want to also publish referenced component "${Y}"?`;
          try {
            await Qe.prompt(ne, {
              okLabel: "Yes",
              cancelLabel: "No",
              timeoutMs: 3e5
              // 5 minutes
            }), await t.log(`Exporting referenced page: "${Y}"`);
            const se = o.findIndex(
              (ue) => ue.id === q.id
            );
            if (se === -1)
              throw await t.error(
                `Could not find page index for "${Y}"`
              ), new Error(`Could not find page index for "${Y}"`);
            const le = await qe(
              {
                pageIndex: se
              },
              a,
              // Pass the same set to track all processed pages
              !0,
              // Mark as recursive call
              i
              // Pass discovered pages set (empty during actual export)
            );
            if (le.success && le.data) {
              const ue = le.data;
              E.push(ue), await t.log(
                `Successfully exported referenced page: "${Y}"`
              );
            } else
              throw new Error(
                `Failed to export referenced page "${Y}": ${le.message}`
              );
          } catch (se) {
            if (se instanceof Error && se.message === "User cancelled")
              if (B)
                await t.log(
                  `User declined to publish "${Y}", but page has existing metadata. Continuing with existing metadata.`
                );
              else
                throw await t.error(
                  `Export cancelled: Referenced page "${Y}" has no metadata and user declined to publish it.`
                ), new Error(
                  `Cannot continue export: Referenced component "${Y}" has no metadata. Please publish it first or choose to publish it now.`
                );
            else
              throw se;
          }
        }
      }
    }
    await t.log("Creating string table...");
    const F = new mt();
    await t.log("Getting page metadata...");
    const O = c.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let v = "", h = 0;
    if (O)
      try {
        const z = JSON.parse(O);
        v = z.id || "", h = z.version || 0;
      } catch (z) {
        await t.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!v) {
      await t.log("Generating new GUID for page..."), v = await Et();
      const z = {
        _ver: 1,
        id: v,
        name: c.name,
        version: h,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      c.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(z)
      );
    }
    await t.log("Creating export data structure...");
    const x = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "1.0.0",
        figmaApiVersion: figma.apiVersion,
        guid: v,
        version: h,
        name: c.name,
        pluginVersion: "1.0.0"
      },
      stringTable: F.getSerializedTable(),
      collections: m.getSerializedTable(),
      variables: p.getSerializedTable(),
      instances: $.getSerializedTable(),
      styles: y.getSerializedTable(),
      pageData: u
    };
    await t.log("Compressing JSON data...");
    const I = za(x, F);
    await t.log("Serializing to JSON...");
    const V = JSON.stringify(I, null, 2), J = (V.length / 1024).toFixed(2), M = dt(c.name).trim().replace(/\s+/g, "_") + ".figma.json";
    await t.log(`JSON serialization complete: ${J} KB`), await t.log(`Export file: ${M}`), await t.log("=== Export Complete ===");
    const L = JSON.parse(V);
    return {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: M,
        pageData: L,
        pageName: c.name,
        additionalPages: E,
        // Populated with referenced component pages
        discoveredReferencedPages: T.length > 0 ? (
          // Filter out the original page - it shouldn't be in the discovered list since it's the one being published
          T.filter((z) => z.pageId !== d)
        ) : void 0,
        // Only include if there are discovered pages
        validationResult: j
        // Include aggregated validation results if in discovery mode
      }
    };
  } catch (l) {
    const o = l instanceof Error ? l.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", l), console.error("Error message:", o), await t.error(`Export failed: ${o}`), l instanceof Error && l.stack && (console.error("Stack trace:", l.stack), await t.error(`Stack trace: ${l.stack}`));
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
const Ja = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  countTotalNodes: pt,
  exportPage: qe,
  extractNodeData: ut
}, Symbol.toStringTag, { value: "Module" }));
function ye(e) {
  return e.replace(/[^a-zA-Z0-9]/g, "");
}
const Kt = /* @__PURE__ */ new Map();
async function De(e, a) {
  if (a.length === 0)
    return;
  const n = e.modes.find(
    (i) => i.name === "Mode 1" || i.name === "Default"
  );
  if (n && !a.includes(n.name)) {
    const i = a[0];
    try {
      const s = n.name;
      e.renameMode(n.modeId, i), Kt.set(`${e.id}:${s}`, i), await t.log(
        `  Renamed default mode "${s}" to "${i}"`
      );
    } catch (s) {
      await t.warning(
        `  Failed to rename default mode "${n.name}" to "${i}": ${s}`
      );
    }
  }
  for (const i of a)
    e.modes.find((l) => l.name === i) || e.addMode(i);
}
const Ve = "recursica:collectionId";
async function ct(e) {
  if (e.remote === !0) {
    const n = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(n)) {
      const s = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await t.error(s), new Error(s);
    }
    return e.id;
  } else {
    const n = e.getSharedPluginData(
      "recursica",
      Ve
    );
    if (n && n.trim() !== "")
      return n;
    const i = await Et();
    return e.setSharedPluginData("recursica", Ve, i), i;
  }
}
function Da(e, a) {
  const n = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(n))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Ha(e) {
  let a;
  const n = e.collectionName.trim().toLowerCase(), i = ["token", "tokens", "theme", "themes"], s = e.isLocal;
  if (s === !1 || s === void 0 && i.includes(n))
    try {
      const c = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((d) => d.name.trim().toLowerCase() === n);
      if (c) {
        Da(e.collectionName, !1);
        const d = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          c.key
        );
        if (d.length > 0) {
          const p = await figma.variables.importVariableByKeyAsync(d[0].key), m = await figma.variables.getVariableCollectionByIdAsync(
            p.variableCollectionId
          );
          if (m) {
            if (a = m, e.collectionGuid) {
              const $ = a.getSharedPluginData(
                "recursica",
                Ve
              );
              (!$ || $.trim() === "") && a.setSharedPluginData(
                "recursica",
                Ve,
                e.collectionGuid
              );
            } else
              await ct(a);
            return await De(a, e.modes), { collection: a };
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
    let c;
    if (e.collectionGuid && (c = o.find((d) => d.getSharedPluginData("recursica", Ve) === e.collectionGuid)), c || (c = o.find(
      (d) => d.name === e.collectionName
    )), c)
      if (a = c, e.collectionGuid) {
        const d = a.getSharedPluginData(
          "recursica",
          Ve
        );
        (!d || d.trim() === "") && a.setSharedPluginData(
          "recursica",
          Ve,
          e.collectionGuid
        );
      } else
        await ct(a);
    else
      a = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? a.setSharedPluginData(
        "recursica",
        Ve,
        e.collectionGuid
      ) : await ct(a);
  } else {
    const o = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), c = e.collectionName.trim().toLowerCase(), d = o.find((y) => y.name.trim().toLowerCase() === c);
    if (!d)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const p = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      d.key
    );
    if (p.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const m = await figma.variables.importVariableByKeyAsync(
      p[0].key
    ), $ = await figma.variables.getVariableCollectionByIdAsync(
      m.variableCollectionId
    );
    if (!$)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (a = $, e.collectionGuid) {
      const y = a.getSharedPluginData(
        "recursica",
        Ve
      );
      (!y || y.trim() === "") && a.setSharedPluginData(
        "recursica",
        Ve,
        e.collectionGuid
      );
    } else
      ct(a);
  }
  return await De(a, e.modes), { collection: a };
}
async function It(e, a) {
  for (const n of e.variableIds)
    try {
      const i = await figma.variables.getVariableByIdAsync(n);
      if (i && i.name === a)
        return i;
    } catch (i) {
      continue;
    }
  return null;
}
async function Wa(e, a, n, i, s) {
  await t.log(
    `Restoring values for variable "${e.name}" (type: ${e.resolvedType}):`
  ), await t.log(
    `  valuesByMode keys: ${Object.keys(a).join(", ")}`
  );
  for (const [l, o] of Object.entries(a)) {
    const c = Kt.get(`${i.id}:${l}`) || l;
    let d = i.modes.find((m) => m.name === c);
    if (d || (d = i.modes.find((m) => m.name === l)), !d) {
      await t.warning(
        `Mode "${l}" (mapped: "${c}") not found in collection "${i.name}" for variable "${e.name}". Available modes: ${i.modes.map((m) => m.name).join(", ")}. Skipping.`
      );
      continue;
    }
    const p = d.modeId;
    try {
      if (o == null) {
        await t.log(
          `  Mode "${l}": value is null/undefined, skipping`
        );
        continue;
      }
      if (await t.log(
        `  Mode "${l}": value type=${typeof o}, value=${JSON.stringify(o)}`
      ), typeof o == "string" || typeof o == "number" || typeof o == "boolean") {
        e.setValueForMode(p, o);
        continue;
      }
      if (typeof o == "object" && o !== null && "r" in o && "g" in o && "b" in o && typeof o.r == "number" && typeof o.g == "number" && typeof o.b == "number") {
        const m = o, $ = {
          r: m.r,
          g: m.g,
          b: m.b
        };
        m.a !== void 0 && ($.a = m.a), e.setValueForMode(p, $);
        const y = e.valuesByMode[p];
        if (await t.log(
          `  Set color value for "${e.name}" mode "${l}": r=${$.r.toFixed(3)}, g=${$.g.toFixed(3)}, b=${$.b.toFixed(3)}${$.a !== void 0 ? `, a=${$.a.toFixed(3)}` : ""}`
        ), await t.log(
          `  Read back value: ${JSON.stringify(y)}`
        ), typeof y == "object" && y !== null && "r" in y && "g" in y && "b" in y) {
          const u = y, b = Math.abs(u.r - $.r) < 1e-3, r = Math.abs(u.g - $.g) < 1e-3, w = Math.abs(u.b - $.b) < 1e-3;
          !b || !r || !w ? await t.warning(
            `  ⚠️ Value mismatch! Set: r=${$.r}, g=${$.g}, b=${$.b}, Read back: r=${u.r}, g=${u.g}, b=${u.b}`
          ) : await t.log(
            "  ✓ Value verified: read-back matches what we set"
          );
        } else
          await t.warning(
            `  ⚠️ Read-back value is not an RGB object: ${JSON.stringify(y)}`
          );
        continue;
      }
      if (typeof o == "object" && o !== null && "_varRef" in o && typeof o._varRef == "number") {
        const m = o;
        let $ = null;
        const y = n.getVariableByIndex(
          m._varRef
        );
        if (y) {
          let u = null;
          if (s && y._colRef !== void 0) {
            const b = s.getCollectionByIndex(
              y._colRef
            );
            b && (u = (await Ha(b)).collection);
          }
          u && ($ = await It(
            u,
            y.variableName
          ));
        }
        if ($) {
          const u = {
            type: "VARIABLE_ALIAS",
            id: $.id
          };
          e.setValueForMode(p, u);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${l}" in variable "${e.name}". Variable reference index: ${m._varRef}`
          );
      }
    } catch (m) {
      typeof o == "object" && o !== null && !("_varRef" in o) && !("r" in o && "g" in o && "b" in o) && await t.warning(
        `Unhandled value type for mode "${l}" in variable "${e.name}": ${JSON.stringify(o)}`
      ), console.warn(
        `Error setting value for mode "${l}" in variable "${e.name}":`,
        m
      );
    }
  }
}
async function Ct(e, a, n, i) {
  if (await t.log(
    `Creating variable "${e.variableName}" (type: ${e.variableType})`
  ), e.valuesByMode) {
    await t.log(
      `  valuesByMode has ${Object.keys(e.valuesByMode).length} mode(s): ${Object.keys(e.valuesByMode).join(", ")}`
    );
    for (const [l, o] of Object.entries(e.valuesByMode))
      await t.log(
        `  Mode "${l}": ${JSON.stringify(o)} (type: ${typeof o})`
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
  if (e.valuesByMode && await Wa(
    s,
    e.valuesByMode,
    n,
    a,
    // Pass collection to look up modes by name
    i
  ), e.valuesByMode && s.valuesByMode) {
    await t.log(`  Verifying values for "${e.variableName}":`);
    for (const [l, o] of Object.entries(
      e.valuesByMode
    )) {
      const c = a.modes.find((d) => d.name === l);
      if (c) {
        const d = s.valuesByMode[c.modeId];
        await t.log(
          `    Mode "${l}": expected=${JSON.stringify(o)}, actual=${JSON.stringify(d)}`
        );
      }
    }
  }
  return s;
}
async function Ka(e, a, n, i) {
  const s = a.getVariableByIndex(e);
  if (!s || s._colRef === void 0)
    return null;
  const l = i.get(String(s._colRef));
  if (!l)
    return null;
  const o = await It(
    l,
    s.variableName
  );
  if (o) {
    let c;
    if (typeof s.variableType == "number" ? c = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[s.variableType] || String(s.variableType) : c = s.variableType, Yt(o, c))
      return o;
  }
  return await Ct(
    s,
    l,
    a,
    n
  );
}
async function qt(e, a, n, i) {
  if (!(!a || typeof a != "object"))
    try {
      const s = e[n];
      if (!s || !Array.isArray(s))
        return;
      const l = a[n];
      if (Array.isArray(l))
        for (let o = 0; o < l.length && o < s.length; o++) {
          const c = l[o];
          if (c && typeof c == "object") {
            if (s[o].boundVariables || (s[o].boundVariables = {}), _e(c)) {
              const d = c._varRef;
              if (d !== void 0) {
                const p = i.get(String(d));
                p && (s[o].boundVariables.color = {
                  type: "VARIABLE_ALIAS",
                  id: p.id
                });
              }
            } else
              for (const [d, p] of Object.entries(
                c
              ))
                if (_e(p)) {
                  const m = p._varRef;
                  if (m !== void 0) {
                    const $ = i.get(String(m));
                    $ && (s[o].boundVariables[d] = {
                      type: "VARIABLE_ALIAS",
                      id: $.id
                    });
                  }
                }
          }
        }
    } catch (s) {
      console.log(`Error restoring bound variables for ${n}:`, s);
    }
}
function Xt(e) {
  if (!e || typeof e != "object")
    return !1;
  if (e._styleRef !== void 0 || e._fillStyleRef !== void 0 || e._effectStyleRef !== void 0 || e._gridStyleRef !== void 0)
    return !0;
  if (Array.isArray(e.fills)) {
    for (const a of e.fills)
      if (a && typeof a == "object" && a._styleRef !== void 0)
        return !0;
  }
  if (Array.isArray(e.backgrounds)) {
    for (const a of e.backgrounds)
      if (a && typeof a == "object" && a._styleRef !== void 0)
        return !0;
  }
  if (Array.isArray(e.children)) {
    for (const a of e.children)
      if (Xt(a))
        return !0;
  }
  return !1;
}
async function qa(e, a) {
  const n = /* @__PURE__ */ new Map();
  await t.log(
    `Importing ${Object.keys(e).length} styles...`
  );
  const i = Object.entries(e).sort(
    (s, l) => parseInt(s[0], 10) - parseInt(l[0], 10)
  );
  for (const [s, l] of i) {
    const o = parseInt(s, 10), c = l.name || "Unnamed Style", d = l.type;
    let p = null;
    switch (d) {
      case "TEXT":
        p = (await figma.getLocalTextStylesAsync()).find(
          ($) => $.name === c
        ) || null;
        break;
      case "PAINT":
        p = (await figma.getLocalPaintStylesAsync()).find(
          ($) => $.name === c
        ) || null;
        break;
      case "EFFECT":
        p = (await figma.getLocalEffectStylesAsync()).find(
          ($) => $.name === c
        ) || null;
        break;
      case "GRID":
        p = (await figma.getLocalGridStylesAsync()).find(
          ($) => $.name === c
        ) || null;
        break;
    }
    if (p) {
      await t.log(
        `  Skipping creation of style "${c}" (type: ${d}) as it already exists. Reusing existing style.`
      ), n.set(o, p);
      continue;
    }
    let m = null;
    try {
      switch (d) {
        case "TEXT":
          m = await Xa(l, a);
          break;
        case "PAINT":
          m = await Ya(l, a);
          break;
        case "EFFECT":
          m = await Za(l, a);
          break;
        case "GRID":
          m = await Qa(l, a);
          break;
        default:
          await t.warning(
            `  Unknown style type "${d}" for style "${c}". Skipping.`
          );
          break;
      }
      m && (n.set(o, m), await t.log(
        `  ✓ Created style "${c}" (type: ${d})`
      ));
    } catch ($) {
      await t.warning(
        `  Failed to create style "${c}" (type: ${d}): ${$}`
      );
    }
  }
  return n;
}
async function Xa(e, a) {
  var i, s, l, o, c, d, p, m;
  const n = figma.createTextStyle();
  if (n.name = e.name, e.textStyle && (e.textStyle.fontName !== void 0 && !((i = e.textStyle.boundVariables) != null && i.fontName) && (await figma.loadFontAsync(e.textStyle.fontName), n.fontName = e.textStyle.fontName), e.textStyle.fontSize !== void 0 && !((s = e.textStyle.boundVariables) != null && s.fontSize) && (n.fontSize = e.textStyle.fontSize), e.textStyle.letterSpacing !== void 0 && !((l = e.textStyle.boundVariables) != null && l.letterSpacing) && (n.letterSpacing = e.textStyle.letterSpacing), e.textStyle.lineHeight !== void 0 && !((o = e.textStyle.boundVariables) != null && o.lineHeight) && (n.lineHeight = e.textStyle.lineHeight), e.textStyle.textCase !== void 0 && !((c = e.textStyle.boundVariables) != null && c.textCase) && (n.textCase = e.textStyle.textCase), e.textStyle.textDecoration !== void 0 && !((d = e.textStyle.boundVariables) != null && d.textDecoration) && (n.textDecoration = e.textStyle.textDecoration), e.textStyle.paragraphSpacing !== void 0 && !((p = e.textStyle.boundVariables) != null && p.paragraphSpacing) && (n.paragraphSpacing = e.textStyle.paragraphSpacing), e.textStyle.paragraphIndent !== void 0 && !((m = e.textStyle.boundVariables) != null && m.paragraphIndent) && (n.paragraphIndent = e.textStyle.paragraphIndent), e.textStyle.boundVariables))
    for (const [$, y] of Object.entries(
      e.textStyle.boundVariables
    )) {
      let u;
      if (typeof y == "object" && y !== null && "_varRef" in y) {
        const b = y._varRef;
        u = a.get(String(b));
      } else {
        const b = typeof y == "string" ? y : String(y);
        u = a.get(b);
      }
      if (u)
        try {
          n.setBoundVariable($, u);
        } catch (b) {
          await t.warning(
            `Could not bind variable to text style property "${$}": ${b}`
          );
        }
    }
  return n;
}
async function Ya(e, a) {
  const n = figma.createPaintStyle();
  return n.name = e.name, e.paintStyle && e.paintStyle.paints && (n.paints = e.paintStyle.paints), n;
}
async function Za(e, a) {
  const n = figma.createEffectStyle();
  return n.name = e.name, e.effectStyle && e.effectStyle.effects && (n.effects = e.effectStyle.effects), n;
}
async function Qa(e, a) {
  const n = figma.createGridStyle();
  return n.name = e.name, e.gridStyle && e.gridStyle.layoutGrids && (n.layoutGrids = e.gridStyle.layoutGrids), n;
}
function en(e, a, n = !1) {
  const i = ya(a);
  if (e.visible === void 0 && (e.visible = i.visible), e.locked === void 0 && (e.locked = i.locked), e.opacity === void 0 && (e.opacity = i.opacity), e.rotation === void 0 && (e.rotation = i.rotation), e.blendMode === void 0 && (e.blendMode = i.blendMode), a === "FRAME" || a === "COMPONENT" || a === "INSTANCE") {
    const s = Ce;
    e.layoutMode === void 0 && (e.layoutMode = s.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = s.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = s.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = s.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = s.counterAxisAlignItems), n || (e.paddingLeft === void 0 && (e.paddingLeft = s.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = s.paddingRight), e.paddingTop === void 0 && (e.paddingTop = s.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = s.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = s.itemSpacing), e.counterAxisSpacing === void 0 && (e.counterAxisSpacing = s.counterAxisSpacing));
  }
  if (a === "TEXT") {
    const s = xe;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = s.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = s.textAlignVertical), e.textCase === void 0 && (e.textCase = s.textCase), e.textDecoration === void 0 && (e.textDecoration = s.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = s.textAutoResize);
  }
}
async function He(e, a, n = null, i = null, s = null, l = null, o = null, c = !1, d = null, p = null, m = null, $ = null, y = null, u, b = null) {
  var O, v, h, x, I, V, J, Q, M, L, X, z, W, q, Y, K, B, ee, ie, re, ce, ne, se, le, ue, be, Me, Fe, Ue, ze, et, je, R, fe, ae;
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
        const N = e.componentPropertyDefinitions;
        let P = 0, f = 0;
        for (const [A, G] of Object.entries(N))
          try {
            const _ = G.type;
            let U = null;
            if (typeof _ == "string" ? (_ === "TEXT" || _ === "BOOLEAN" || _ === "INSTANCE_SWAP" || _ === "VARIANT") && (U = _) : typeof _ == "number" && (U = {
              2: "TEXT",
              // Text property
              25: "BOOLEAN",
              // Boolean property
              27: "INSTANCE_SWAP",
              // Instance swap property
              26: "VARIANT"
              // Variant property
            }[_] || null), !U) {
              await t.warning(
                `  Unknown property type ${_} (${typeof _}) for property "${A}" in component "${e.name || "Unnamed"}"`
              ), f++;
              continue;
            }
            const H = G.defaultValue, te = A.split("#")[0];
            r.addComponentProperty(
              te,
              U,
              H
            ), P++;
          } catch (_) {
            await t.warning(
              `  Failed to add component property "${A}" to "${e.name || "Unnamed"}": ${_}`
            ), f++;
          }
        P > 0 && await t.log(
          `  Added ${P} component property definition(s) to "${e.name || "Unnamed"}"${f > 0 ? ` (${f} failed)` : ""}`
        );
      }
      break;
    case "COMPONENT_SET": {
      const N = e.children ? e.children.filter((A) => A.type === "COMPONENT").length : 0;
      await t.log(
        `Creating COMPONENT_SET "${e.name || "Unnamed"}" by combining ${N} component variant(s)`
      );
      const P = [];
      let f = null;
      if (e.children && Array.isArray(e.children)) {
        f = figma.createFrame(), f.name = `_temp_${e.name || "COMPONENT_SET"}`, f.visible = !1, ((a == null ? void 0 : a.type) === "PAGE" ? a : figma.currentPage).appendChild(f);
        for (const G of e.children)
          if (G.type === "COMPONENT" && !G._truncated)
            try {
              const _ = await He(
                G,
                f,
                // Use temp parent for now
                n,
                i,
                s,
                l,
                o,
                c,
                d,
                p,
                // Pass deferredInstances through for component set creation
                null,
                // parentNodeData - not needed here, will be passed correctly in recursive calls
                $,
                y,
                // Pass placeholderFrameIds through for component set creation
                void 0,
                // currentPlaceholderId - component set creation is not inside a placeholder
                b
                // Pass styleMapping to apply styles
              );
              _ && _.type === "COMPONENT" && (P.push(_), await t.log(
                `  Created component variant: "${_.name || "Unnamed"}"`
              ));
            } catch (_) {
              await t.warning(
                `  Failed to create component variant "${G.name || "Unnamed"}": ${_}`
              );
            }
      }
      if (P.length > 0)
        try {
          const A = a || figma.currentPage, G = figma.combineAsVariants(
            P,
            A
          );
          e.name && (G.name = e.name), e.x !== void 0 && (G.x = e.x), e.y !== void 0 && (G.y = e.y), f && f.parent && f.remove(), await t.log(
            `  ✓ Successfully created COMPONENT_SET "${G.name}" with ${P.length} variant(s)`
          ), r = G;
        } catch (A) {
          if (await t.warning(
            `  Failed to combine components into COMPONENT_SET "${e.name || "Unnamed"}": ${A}. Falling back to frame.`
          ), r = figma.createFrame(), e.name && (r.name = e.name), f && f.children.length > 0) {
            for (const G of f.children)
              r.appendChild(G);
            f.remove();
          }
        }
      else
        await t.warning(
          `  No valid component variants found for COMPONENT_SET "${e.name || "Unnamed"}". Creating frame instead.`
        ), r = figma.createFrame(), e.name && (r.name = e.name), f && f.remove();
      break;
    }
    case "INSTANCE":
      if (c)
        r = figma.createFrame(), e.name && (r.name = e.name);
      else if (e._instanceRef !== void 0 && s && o) {
        const N = s.getInstanceByIndex(
          e._instanceRef
        );
        if (N && N.instanceType === "internal")
          if (N.componentNodeId)
            if (N.componentNodeId === e.id)
              await t.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), r = figma.createFrame(), e.name && (r.name = e.name);
            else {
              const P = o.get(
                N.componentNodeId
              );
              if (!P) {
                const f = Array.from(o.keys()).slice(
                  0,
                  20
                );
                await t.error(
                  `Component not found for internal instance "${e.name}" (ID: ${N.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), await t.error(
                  `Looking for component ID: ${N.componentNodeId}`
                ), await t.error(
                  `Available IDs in mapping (first 20): ${f.map((H) => H.substring(0, 8) + "...").join(", ")}`
                );
                const A = (H, te) => {
                  if (H.type === "COMPONENT" && H.id === te)
                    return !0;
                  if (H.children && Array.isArray(H.children)) {
                    for (const Z of H.children)
                      if (!Z._truncated && A(Z, te))
                        return !0;
                  }
                  return !1;
                }, G = A(
                  e,
                  N.componentNodeId
                );
                await t.error(
                  `Component ID ${N.componentNodeId.substring(0, 8)}... exists in current node tree: ${G}`
                ), await t.error(
                  `WARNING: Component ID ${N.componentNodeId.substring(0, 8)}... not found in nodeIdMapping. This might indicate:`
                ), await t.error(
                  "  1. The component doesn't exist in the pageData (detached component?)"
                ), await t.error(
                  "  2. The component wasn't collected in the first pass"
                ), await t.error(
                  "  3. The component ID in the instance table doesn't match the actual component ID"
                );
                const _ = f.filter(
                  (H) => H.startsWith(N.componentNodeId.substring(0, 8))
                );
                _.length > 0 && await t.error(
                  `Found IDs with matching prefix: ${_.map((H) => H.substring(0, 8) + "...").join(", ")}`
                );
                const U = `Component not found for internal instance "${e.name}" (ID: ${N.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${f.map((H) => H.substring(0, 8) + "...").join(", ")}`;
                throw new Error(U);
              }
              if (P && P.type === "COMPONENT") {
                if (r = P.createInstance(), await t.log(
                  `✓ Created internal instance "${e.name}" from component "${N.componentName}"`
                ), N.variantProperties && Object.keys(N.variantProperties).length > 0)
                  try {
                    let f = null;
                    if (P.parent && P.parent.type === "COMPONENT_SET")
                      f = P.parent.componentPropertyDefinitions, await t.log(
                        `  DEBUG: Component "${N.componentName}" is inside component set "${P.parent.name}" with ${Object.keys(f || {}).length} property definitions`
                      );
                    else {
                      const A = await r.getMainComponentAsync();
                      if (A) {
                        const G = A.type;
                        await t.log(
                          `  DEBUG: Internal instance "${e.name}" - componentNode parent: ${P.parent ? P.parent.type : "N/A"}, mainComponent type: ${G}, mainComponent parent: ${A.parent ? A.parent.type : "N/A"}`
                        ), G === "COMPONENT_SET" ? f = A.componentPropertyDefinitions : G === "COMPONENT" && A.parent && A.parent.type === "COMPONENT_SET" ? (f = A.parent.componentPropertyDefinitions, await t.log(
                          `  DEBUG: Found component set parent "${A.parent.name}" with ${Object.keys(f || {}).length} property definitions`
                        )) : await t.log(
                          `  Skipping variant properties for internal instance "${e.name}" - component "${N.componentName}" is not yet in a COMPONENT_SET (will be moved later during component set creation)`
                        );
                      }
                    }
                    if (f) {
                      const A = {};
                      for (const [G, _] of Object.entries(
                        N.variantProperties
                      )) {
                        const U = G.split("#")[0];
                        f[U] && (A[U] = _);
                      }
                      Object.keys(A).length > 0 && r.setProperties(A);
                    }
                  } catch (f) {
                    const A = `Failed to set variant properties for instance "${e.name}": ${f}`;
                    throw await t.error(A), new Error(A);
                  }
                if (N.componentProperties && Object.keys(N.componentProperties).length > 0)
                  try {
                    const f = await r.getMainComponentAsync();
                    if (f) {
                      let A = null;
                      const G = f.type;
                      if (G === "COMPONENT_SET" ? A = f.componentPropertyDefinitions : G === "COMPONENT" && f.parent && f.parent.type === "COMPONENT_SET" ? A = f.parent.componentPropertyDefinitions : G === "COMPONENT" && (A = f.componentPropertyDefinitions), A)
                        for (const [_, U] of Object.entries(
                          N.componentProperties
                        )) {
                          const H = _.split("#")[0];
                          if (A[H])
                            try {
                              let te = U;
                              U && typeof U == "object" && "value" in U && (te = U.value), r.setProperties({
                                [H]: te
                              });
                            } catch (te) {
                              const Z = `Failed to set component property "${H}" for internal instance "${e.name}": ${te}`;
                              throw await t.error(Z), new Error(Z);
                            }
                        }
                    } else
                      await t.warning(
                        `Cannot set component properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (f) {
                    if (f instanceof Error)
                      throw f;
                    const A = `Failed to set component properties for instance "${e.name}": ${f}`;
                    throw await t.error(A), new Error(A);
                  }
              } else if (!r && P) {
                const f = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${N.componentNodeId.substring(0, 8)}...).`;
                throw await t.error(f), new Error(f);
              }
            }
          else {
            const P = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw await t.error(P), new Error(P);
          }
        else if (N && N.instanceType === "remote")
          if (d) {
            const P = d.get(
              e._instanceRef
            );
            if (P) {
              if (r = P.createInstance(), await t.log(
                `✓ Created remote instance "${e.name}" from component "${N.componentName}" on REMOTES page`
              ), N.variantProperties && Object.keys(N.variantProperties).length > 0)
                try {
                  const f = await r.getMainComponentAsync();
                  if (f) {
                    let A = null;
                    const G = f.type;
                    if (G === "COMPONENT_SET" ? A = f.componentPropertyDefinitions : G === "COMPONENT" && f.parent && f.parent.type === "COMPONENT_SET" ? A = f.parent.componentPropertyDefinitions : await t.log(
                      `Skipping variant properties for remote instance "${e.name}" - main component is not a COMPONENT_SET or variant (expected for remote components)`
                    ), A) {
                      const _ = {};
                      for (const [U, H] of Object.entries(
                        N.variantProperties
                      )) {
                        const te = U.split("#")[0];
                        A[te] && (_[te] = H);
                      }
                      Object.keys(_).length > 0 && r.setProperties(_);
                    }
                  } else
                    await t.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (f) {
                  const A = `Failed to set variant properties for remote instance "${e.name}": ${f}`;
                  throw await t.error(A), new Error(A);
                }
              if (N.componentProperties && Object.keys(N.componentProperties).length > 0)
                try {
                  const f = await r.getMainComponentAsync();
                  if (f) {
                    let A = null;
                    const G = f.type;
                    if (G === "COMPONENT_SET" ? A = f.componentPropertyDefinitions : G === "COMPONENT" && f.parent && f.parent.type === "COMPONENT_SET" ? A = f.parent.componentPropertyDefinitions : G === "COMPONENT" && (A = f.componentPropertyDefinitions), A)
                      for (const [_, U] of Object.entries(
                        N.componentProperties
                      )) {
                        const H = _.split("#")[0];
                        if (A[H])
                          try {
                            let te = U;
                            U && typeof U == "object" && "value" in U && (te = U.value), r.setProperties({
                              [H]: te
                            });
                          } catch (te) {
                            const Z = `Failed to set component property "${H}" for remote instance "${e.name}": ${te}`;
                            throw await t.error(Z), new Error(Z);
                          }
                      }
                  } else
                    await t.warning(
                      `Cannot set component properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (f) {
                  if (f instanceof Error)
                    throw f;
                  const A = `Failed to set component properties for remote instance "${e.name}": ${f}`;
                  throw await t.error(A), new Error(A);
                }
              if (e.width !== void 0 && e.height !== void 0)
                try {
                  r.resize(e.width, e.height);
                } catch (f) {
                  await t.log(
                    `Note: Could not resize remote instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
                  );
                }
            } else {
              const f = `Remote component not found for instance "${e.name}" (index ${e._instanceRef}). The remote component should have been created on the REMOTES page.`;
              throw await t.error(f), new Error(f);
            }
          } else {
            const P = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw await t.error(P), new Error(P);
          }
        else if ((N == null ? void 0 : N.instanceType) === "normal") {
          if (!N.componentPageName) {
            const U = `Normal instance "${e.name}" missing componentPageName. Cannot resolve.`;
            throw await t.error(U), new Error(U);
          }
          await figma.loadAllPagesAsync();
          const P = figma.root.children.find(
            (U) => U.name === N.componentPageName
          );
          if (!P) {
            await t.log(
              `  Deferring normal instance "${e.name}" - referenced page "${N.componentPageName}" does not exist yet (may be circular reference or not yet imported)`
            );
            const U = figma.createFrame();
            if (U.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (U.x = e.x), e.y !== void 0 && (U.y = e.y), e.width !== void 0 && e.height !== void 0 ? U.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && U.resize(e.w, e.h), y && y.add(U.id), p) {
              const H = u;
              H ? await t.log(
                `[NESTED] Creating child deferred instance "${e.name}" with parent placeholder ID ${H.substring(0, 8)}... (immediate parent: "${a.name}" ${a.id.substring(0, 8)}...)`
              ) : await t.log(
                `[NESTED] Creating top-level deferred instance "${e.name}" - parent "${a.name}" (${a.id.substring(0, 8)}...)`
              );
              let te = a.id;
              if (H)
                try {
                  const oe = await figma.getNodeByIdAsync(H);
                  oe && oe.parent && (te = oe.parent.id);
                } catch (oe) {
                  te = a.id;
                }
              const Z = {
                placeholderFrameId: U.id,
                instanceEntry: N,
                nodeData: e,
                parentNodeId: te,
                parentPlaceholderId: H,
                instanceIndex: e._instanceRef
              };
              p.push(Z);
            }
            r = U;
            break;
          }
          let f = null;
          const A = (U, H, te, Z, oe) => {
            if (H.length === 0) {
              let pe = null;
              for (const we of U.children || [])
                if (we.type === "COMPONENT") {
                  if (we.name === te)
                    if (pe || (pe = we), Z)
                      try {
                        const $e = we.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if ($e && JSON.parse($e).id === Z)
                          return we;
                      } catch ($e) {
                      }
                    else
                      return we;
                } else if (we.type === "COMPONENT_SET") {
                  if (oe && we.name !== oe)
                    continue;
                  for (const $e of we.children || [])
                    if ($e.type === "COMPONENT" && $e.name === te)
                      if (pe || (pe = $e), Z)
                        try {
                          const Je = $e.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (Je && JSON.parse(Je).id === Z)
                            return $e;
                        } catch (Je) {
                        }
                      else
                        return $e;
                }
              return pe;
            }
            const [he, ...me] = H;
            for (const pe of U.children || [])
              if (pe.name === he) {
                if (me.length === 0 && pe.type === "COMPONENT_SET") {
                  if (oe && pe.name !== oe)
                    continue;
                  for (const we of pe.children || [])
                    if (we.type === "COMPONENT" && we.name === te) {
                      if (Z)
                        try {
                          const $e = we.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if ($e && JSON.parse($e).id === Z)
                            return we;
                        } catch ($e) {
                        }
                      return we;
                    }
                  return null;
                }
                return A(
                  pe,
                  me,
                  te,
                  Z,
                  oe
                );
              }
            return null;
          };
          await t.log(
            `  Looking for component "${N.componentName}" on page "${N.componentPageName}"${N.path && N.path.length > 0 ? ` at path [${N.path.join(" → ")}]` : " at page root"}${N.componentGuid ? ` (GUID: ${N.componentGuid.substring(0, 8)}...)` : ""}`
          );
          const G = [], _ = (U, H = 0) => {
            const te = "  ".repeat(H);
            if (U.type === "COMPONENT")
              G.push(`${te}COMPONENT: "${U.name}"`);
            else if (U.type === "COMPONENT_SET") {
              G.push(
                `${te}COMPONENT_SET: "${U.name}"`
              );
              for (const Z of U.children || [])
                Z.type === "COMPONENT" && G.push(
                  `${te}  └─ COMPONENT: "${Z.name}"`
                );
            }
            for (const Z of U.children || [])
              _(Z, H + 1);
          };
          if (_(P), G.length > 0 ? await t.log(
            `  Available components on page "${N.componentPageName}":
${G.slice(0, 20).join(`
`)}${G.length > 20 ? `
  ... and ${G.length - 20} more` : ""}`
          ) : await t.warning(
            `  No components found on page "${N.componentPageName}"`
          ), f = A(
            P,
            N.path || [],
            N.componentName,
            N.componentGuid,
            N.componentSetName
          ), f && N.componentGuid)
            try {
              const U = f.getPluginData(
                "RecursicaPublishedMetadata"
              );
              if (U) {
                const H = JSON.parse(U);
                H.id !== N.componentGuid ? await t.warning(
                  `  Found component "${N.componentName}" by name but GUID verification failed (expected ${N.componentGuid.substring(0, 8)}..., got ${H.id ? H.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`
                ) : await t.log(
                  `  Found component "${N.componentName}" with matching GUID ${N.componentGuid.substring(0, 8)}...`
                );
              } else
                await t.warning(
                  `  Found component "${N.componentName}" by name but no metadata found. Using name match as fallback.`
                );
            } catch (U) {
              await t.warning(
                `  Found component "${N.componentName}" by name but GUID verification failed. Using name match as fallback.`
              );
            }
          if (!f) {
            await t.log(
              `  Deferring normal instance "${e.name}" - component "${N.componentName}" not found on page "${N.componentPageName}" (may not be created yet due to circular reference)`
            );
            const U = figma.createFrame();
            if (U.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (U.x = e.x), e.y !== void 0 && (U.y = e.y), e.width !== void 0 && e.height !== void 0 ? U.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && U.resize(e.w, e.h), y && y.add(U.id), p) {
              const H = u;
              H ? await t.log(
                `[NESTED] Creating child deferred instance "${e.name}" with parent placeholder ID ${H.substring(0, 8)}... (immediate parent: "${a.name}" ${a.id.substring(0, 8)}...)`
              ) : await t.log(
                `[NESTED] Creating top-level deferred instance "${e.name}" - parent "${a.name}" (${a.id.substring(0, 8)}...)`
              );
              let te = a.id;
              if (H)
                try {
                  const oe = await figma.getNodeByIdAsync(H);
                  oe && oe.parent && (te = oe.parent.id);
                } catch (oe) {
                  te = a.id;
                }
              const Z = {
                placeholderFrameId: U.id,
                instanceEntry: N,
                nodeData: e,
                parentNodeId: te,
                parentPlaceholderId: H,
                instanceIndex: e._instanceRef
              };
              p.push(Z);
            }
            r = U;
            break;
          }
          if (r = f.createInstance(), await t.log(
            `  Created normal instance "${e.name}" from component "${N.componentName}" on page "${N.componentPageName}"`
          ), N.variantProperties && Object.keys(N.variantProperties).length > 0)
            try {
              const U = await r.getMainComponentAsync();
              if (U) {
                let H = null;
                const te = U.type;
                if (te === "COMPONENT_SET" ? H = U.componentPropertyDefinitions : te === "COMPONENT" && U.parent && U.parent.type === "COMPONENT_SET" ? H = U.parent.componentPropertyDefinitions : await t.warning(
                  `Cannot set variant properties for normal instance "${e.name}" - main component is not a COMPONENT_SET or variant`
                ), H) {
                  const Z = {};
                  for (const [oe, he] of Object.entries(
                    N.variantProperties
                  )) {
                    const me = oe.split("#")[0];
                    H[me] && (Z[me] = he);
                  }
                  Object.keys(Z).length > 0 && r.setProperties(Z);
                }
              }
            } catch (U) {
              await t.warning(
                `Failed to set variant properties for normal instance "${e.name}": ${U}`
              );
            }
          if (N.componentProperties && Object.keys(N.componentProperties).length > 0)
            try {
              const U = await r.getMainComponentAsync();
              if (U) {
                let H = null;
                const te = U.type;
                if (te === "COMPONENT_SET" ? H = U.componentPropertyDefinitions : te === "COMPONENT" && U.parent && U.parent.type === "COMPONENT_SET" ? H = U.parent.componentPropertyDefinitions : te === "COMPONENT" && (H = U.componentPropertyDefinitions), H) {
                  const Z = {};
                  for (const [oe, he] of Object.entries(
                    N.componentProperties
                  )) {
                    const me = oe.split("#")[0];
                    let pe;
                    if (H[oe] ? pe = oe : H[me] ? pe = me : pe = Object.keys(H).find(
                      (we) => we.split("#")[0] === me
                    ), pe) {
                      const we = he && typeof he == "object" && "value" in he ? he.value : he;
                      Z[pe] = we;
                    } else
                      await t.warning(
                        `Component property "${me}" (from "${oe}") does not exist on component "${N.componentName}" for normal instance "${e.name}". Available properties: ${Object.keys(H).join(", ") || "none"}`
                      );
                  }
                  if (Object.keys(Z).length > 0)
                    try {
                      await t.log(
                        `  Attempting to set component properties for normal instance "${e.name}": ${Object.keys(Z).join(", ")}`
                      ), await t.log(
                        `  Available component properties: ${Object.keys(H).join(", ")}`
                      ), r.setProperties(Z), await t.log(
                        `  ✓ Successfully set component properties for normal instance "${e.name}": ${Object.keys(Z).join(", ")}`
                      );
                    } catch (oe) {
                      await t.warning(
                        `Failed to set component properties for normal instance "${e.name}": ${oe}`
                      ), await t.warning(
                        `  Properties attempted: ${JSON.stringify(Z)}`
                      ), await t.warning(
                        `  Available properties: ${JSON.stringify(Object.keys(H))}`
                      );
                    }
                }
              } else
                await t.warning(
                  `Cannot set component properties for normal instance "${e.name}" - main component not found`
                );
            } catch (U) {
              await t.warning(
                `Failed to set component properties for normal instance "${e.name}": ${U}`
              );
            }
          if (e.width !== void 0 && e.height !== void 0)
            try {
              r.resize(e.width, e.height);
            } catch (U) {
              await t.log(
                `Note: Could not resize normal instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
              );
            }
        } else {
          const P = `Instance "${e.name}" has unknown or missing instance type: ${(N == null ? void 0 : N.instanceType) || "unknown"}`;
          throw await t.error(P), new Error(P);
        }
      } else {
        const N = `Instance "${e.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        throw await t.error(N), new Error(N);
      }
      break;
    case "GROUP":
      r = figma.createFrame();
      break;
    case "BOOLEAN_OPERATION": {
      await t.log(
        `Converting BOOLEAN_OPERATION "${e.name}" to VECTOR node (boolean operations cannot be created directly in Figma API)`
      ), r = figma.createVector();
      break;
    }
    case "POLYGON":
      r = figma.createPolygon();
      break;
    default: {
      const N = `Unsupported node type: ${e.type}. This node type cannot be imported.`;
      throw await t.error(N), new Error(N);
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
  const w = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.paddingLeft || e.boundVariables.paddingRight || e.boundVariables.paddingTop || e.boundVariables.paddingBottom || e.boundVariables.itemSpacing);
  en(
    r,
    e.type || "FRAME",
    w
  ), e.name !== void 0 && (r.name = e.name || "Unnamed Node");
  const g = m && m.layoutMode !== void 0 && m.layoutMode !== "NONE", S = a && "layoutMode" in a && a.layoutMode !== "NONE";
  g || S || (e.x !== void 0 && (r.x = e.x), e.y !== void 0 && (r.y = e.y));
  const D = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height), j = e.name || "Unnamed";
  if (e.preserveRatio !== void 0 && await t.log(
    `  [ISSUE #3 DEBUG] "${j}" has preserveRatio in nodeData: ${e.preserveRatio}`
  ), e.constraints !== void 0 && await t.log(
    `  [ISSUE #4 DEBUG] "${j}" has constraints in nodeData: ${JSON.stringify(e.constraints)}`
  ), (e.constraintHorizontal !== void 0 || e.constraintVertical !== void 0) && await t.log(
    `  [ISSUE #4 DEBUG] "${j}" has constraintHorizontal: ${e.constraintHorizontal}, constraintVertical: ${e.constraintVertical}`
  ), e.type !== "VECTOR" && e.type !== "BOOLEAN_OPERATION" && e.width !== void 0 && e.height !== void 0 && !D) {
    const N = r.preserveRatio;
    N !== void 0 && await t.log(
      `  [ISSUE #3 DEBUG] "${j}" preserveRatio before resize: ${N}`
    ), r.resize(e.width, e.height);
    const P = r.preserveRatio;
    P !== void 0 ? await t.log(
      `  [ISSUE #3 DEBUG] "${j}" preserveRatio after resize: ${P}`
    ) : e.preserveRatio !== void 0 && await t.warning(
      `  ⚠️ ISSUE #3: "${j}" preserveRatio was in nodeData (${e.preserveRatio}) but not set on node!`
    );
    const f = e.constraintHorizontal || ((O = e.constraints) == null ? void 0 : O.horizontal), A = e.constraintVertical || ((v = e.constraints) == null ? void 0 : v.vertical);
    (f !== void 0 || A !== void 0) && await t.log(
      `  [ISSUE #4] "${j}" (${e.type}) - Expected constraints from JSON: H=${f || "undefined"}, V=${A || "undefined"}`
    );
    const G = (h = r.constraints) == null ? void 0 : h.horizontal, _ = (x = r.constraints) == null ? void 0 : x.vertical;
    (f !== void 0 || A !== void 0) && await t.log(
      `  [ISSUE #4] "${j}" (${e.type}) - Constraints after resize (before setting): H=${G || "undefined"}, V=${_ || "undefined"}`
    );
    const U = e.constraintHorizontal !== void 0 || ((I = e.constraints) == null ? void 0 : I.horizontal) !== void 0, H = e.constraintVertical !== void 0 || ((V = e.constraints) == null ? void 0 : V.vertical) !== void 0;
    if (U || H) {
      const oe = e.constraintHorizontal || ((J = e.constraints) == null ? void 0 : J.horizontal), he = e.constraintVertical || ((Q = e.constraints) == null ? void 0 : Q.vertical), me = oe || G || "MIN", pe = he || _ || "MIN";
      try {
        await t.log(
          `  [ISSUE #4] Setting constraints for "${j}" (${e.type}): H=${me} (from ${oe || "default"}), V=${pe} (from ${he || "default"})`
        ), r.constraints = {
          horizontal: me,
          vertical: pe
        };
        const we = (M = r.constraints) == null ? void 0 : M.horizontal, $e = (L = r.constraints) == null ? void 0 : L.vertical;
        we === me && $e === pe ? await t.log(
          `  [ISSUE #4] ✓ Constraints set successfully: H=${we}, V=${$e} for "${j}"`
        ) : await t.warning(
          `  [ISSUE #4] ⚠️ Constraints set but verification failed! Expected H=${me}, V=${pe}, got H=${we || "undefined"}, V=${$e || "undefined"} for "${j}"`
        );
      } catch (we) {
        await t.warning(
          `  [ISSUE #4] ✗ Failed to set constraints for "${j}" (${e.type}): ${we instanceof Error ? we.message : String(we)}`
        );
      }
    }
    const te = r.constraintHorizontal, Z = r.constraintVertical;
    (f !== void 0 || A !== void 0) && (await t.log(
      `  [ISSUE #4] "${j}" (${e.type}) - Final constraints: H=${te || "undefined"}, V=${Z || "undefined"}`
    ), f !== void 0 && te !== f && await t.warning(
      `  ⚠️ ISSUE #4: "${j}" constraintHorizontal mismatch! Expected: ${f}, Got: ${te || "undefined"}`
    ), A !== void 0 && Z !== A && await t.warning(
      `  ⚠️ ISSUE #4: "${j}" constraintVertical mismatch! Expected: ${A}, Got: ${Z || "undefined"}`
    ), f !== void 0 && A !== void 0 && te === f && Z === A && await t.log(
      `  ✓ ISSUE #4: "${j}" constraints correctly set: H=${te}, V=${Z}`
    ));
  } else {
    const N = e.constraintHorizontal || ((X = e.constraints) == null ? void 0 : X.horizontal), P = e.constraintVertical || ((z = e.constraints) == null ? void 0 : z.vertical);
    if ((N !== void 0 || P !== void 0) && (e.type === "VECTOR" || e.type === "BOOLEAN_OPERATION" ? await t.log(
      `  [ISSUE #4] "${j}" (VECTOR) - Constraints already set earlier (skipping "no resize" path)`
    ) : await t.log(
      `  [ISSUE #4] "${j}" (${e.type}) - Setting constraints (no resize): Expected H=${N || "undefined"}, V=${P || "undefined"}`
    )), e.type !== "VECTOR") {
      const f = e.constraintHorizontal !== void 0 || ((W = e.constraints) == null ? void 0 : W.horizontal) !== void 0, A = e.constraintVertical !== void 0 || ((q = e.constraints) == null ? void 0 : q.vertical) !== void 0;
      if (f || A) {
        const G = e.constraintHorizontal || ((Y = e.constraints) == null ? void 0 : Y.horizontal), _ = e.constraintVertical || ((K = e.constraints) == null ? void 0 : K.vertical), U = r.constraints || {}, H = U.horizontal || "MIN", te = U.vertical || "MIN", Z = G || H, oe = _ || te;
        try {
          await t.log(
            `  [ISSUE #4] Setting constraints for "${j}" (${e.type}) (no resize): H=${Z} (from ${G || "current"}), V=${oe} (from ${_ || "current"})`
          ), r.constraints = {
            horizontal: Z,
            vertical: oe
          };
          const he = (B = r.constraints) == null ? void 0 : B.horizontal, me = (ee = r.constraints) == null ? void 0 : ee.vertical;
          he === Z && me === oe ? await t.log(
            `  [ISSUE #4] ✓ Constraints set successfully (no resize): H=${he}, V=${me} for "${j}"`
          ) : await t.warning(
            `  [ISSUE #4] ⚠️ Constraints set but verification failed (no resize)! Expected H=${Z}, V=${oe}, got H=${he || "undefined"}, V=${me || "undefined"} for "${j}"`
          );
        } catch (he) {
          await t.warning(
            `  [ISSUE #4] ✗ Failed to set constraints for "${j}" (${e.type}) (no resize): ${he instanceof Error ? he.message : String(he)}`
          );
        }
      }
    }
    if (e.type !== "VECTOR" && e.type !== "BOOLEAN_OPERATION" && (N !== void 0 || P !== void 0)) {
      const f = (ie = r.constraints) == null ? void 0 : ie.horizontal, A = (re = r.constraints) == null ? void 0 : re.vertical;
      await t.log(
        `  [ISSUE #4] "${j}" (${e.type}) - Final constraints (no resize): H=${f || "undefined"}, V=${A || "undefined"}`
      ), N !== void 0 && f !== N && await t.warning(
        `  ⚠️ ISSUE #4: "${j}" constraintHorizontal mismatch! Expected: ${N}, Got: ${f || "undefined"}`
      ), P !== void 0 && A !== P && await t.warning(
        `  ⚠️ ISSUE #4: "${j}" constraintVertical mismatch! Expected: ${P}, Got: ${A || "undefined"}`
      ), N !== void 0 && P !== void 0 && f === N && A === P && await t.log(
        `  ✓ ISSUE #4: "${j}" constraints correctly set (no resize): H=${f}, V=${A}`
      );
    }
  }
  const E = e.boundVariables && typeof e.boundVariables == "object";
  if (e.visible !== void 0 && (r.visible = e.visible), e.locked !== void 0 && (r.locked = e.locked), e.opacity !== void 0 && (!E || !e.boundVariables.opacity) && (r.opacity = e.opacity), e.rotation !== void 0 && (!E || !e.boundVariables.rotation) && (r.rotation = e.rotation), e.blendMode !== void 0 && (!E || !e.boundVariables.blendMode) && (r.blendMode = e.blendMode), e.type !== "INSTANCE") {
    if (e.type === "VECTOR" && e.boundVariables && (await t.log(
      `  DEBUG: VECTOR "${e.name || "Unnamed"}" (ID: ${((ce = e.id) == null ? void 0 : ce.substring(0, 8)) || "unknown"}...) has boundVariables: ${Object.keys(e.boundVariables).join(", ")}`
    ), e.boundVariables.fills && await t.log(
      `  DEBUG:   boundVariables.fills: ${JSON.stringify(e.boundVariables.fills)}`
    )), e.fills !== void 0)
      try {
        let N = e.fills;
        const P = e.name || "Unnamed";
        if (Array.isArray(N))
          for (let f = 0; f < N.length; f++) {
            const A = N[f];
            A && typeof A == "object" && A.selectionColor !== void 0 && await t.log(
              `  [ISSUE #2 DEBUG] "${P}" fill[${f}] has selectionColor: ${JSON.stringify(A.selectionColor)}`
            );
          }
        if (Array.isArray(N)) {
          const f = e.name || "Unnamed";
          for (let A = 0; A < N.length; A++) {
            const G = N[A];
            G && typeof G == "object" && G.selectionColor !== void 0 && await t.warning(
              `  ⚠️ ISSUE #2: "${f}" fill[${A}] has selectionColor that will be preserved: ${JSON.stringify(G.selectionColor)}`
            );
          }
          N = N.map((A) => {
            if (A && typeof A == "object") {
              const G = ge({}, A);
              return delete G.boundVariables, G;
            }
            return A;
          });
        }
        if (e.fills && Array.isArray(e.fills) && l) {
          if (e.type === "VECTOR") {
            await t.log(
              `  DEBUG: VECTOR "${e.name || "Unnamed"}" has ${e.fills.length} fill(s)`
            );
            for (let _ = 0; _ < e.fills.length; _++) {
              const U = e.fills[_];
              if (U && typeof U == "object") {
                const H = U.boundVariables || U.bndVar;
                H ? await t.log(
                  `  DEBUG:   fill[${_}] has boundVariables: ${JSON.stringify(H)}`
                ) : await t.log(
                  `  DEBUG:   fill[${_}] has no boundVariables`
                );
              }
            }
          }
          const f = [];
          for (let _ = 0; _ < N.length; _++) {
            const U = N[_], H = e.fills[_];
            if (!H || typeof H != "object") {
              f.push(U);
              continue;
            }
            const te = H.boundVariables || H.bndVar;
            if (!te) {
              f.push(U);
              continue;
            }
            const Z = ge({}, U);
            Z.boundVariables = {};
            for (const [oe, he] of Object.entries(te))
              if (e.type === "VECTOR" && await t.log(
                `  DEBUG: Processing fill[${_}].${oe} on VECTOR "${r.name || "Unnamed"}": varInfo=${JSON.stringify(he)}`
              ), _e(he)) {
                const me = he._varRef;
                if (me !== void 0) {
                  if (e.type === "VECTOR") {
                    await t.log(
                      `  DEBUG: Looking up variable reference ${me} in recognizedVariables (map has ${l.size} entries)`
                    );
                    const we = Array.from(
                      l.keys()
                    ).slice(0, 10);
                    await t.log(
                      `  DEBUG: Available variable references (first 10): ${we.join(", ")}`
                    );
                    const $e = l.has(String(me));
                    if (await t.log(
                      `  DEBUG: Variable reference ${me} ${$e ? "found" : "NOT FOUND"} in recognizedVariables`
                    ), !$e) {
                      const Je = Array.from(
                        l.keys()
                      ).sort((Tt, da) => parseInt(Tt) - parseInt(da));
                      await t.log(
                        `  DEBUG: All available variable references: ${Je.join(", ")}`
                      );
                    }
                  }
                  let pe = l.get(String(me));
                  pe || (e.type === "VECTOR" && await t.log(
                    `  DEBUG: Variable ${me} not in recognizedVariables. variableTable=${!!n}, collectionTable=${!!i}, recognizedCollections=${!!$}`
                  ), n && i && $ ? (await t.log(
                    `  Variable reference ${me} not in recognizedVariables, attempting to resolve from variable table...`
                  ), pe = await Ka(
                    me,
                    n,
                    i,
                    $
                  ) || void 0, pe ? (l.set(String(me), pe), await t.log(
                    `  ✓ Resolved variable ${pe.name} from variable table and added to recognizedVariables`
                  )) : await t.warning(
                    `  Failed to resolve variable ${me} from variable table`
                  )) : e.type === "VECTOR" && await t.warning(
                    `  Cannot resolve variable ${me} from table - missing required parameters`
                  )), pe ? (Z.boundVariables[oe] = {
                    type: "VARIABLE_ALIAS",
                    id: pe.id
                  }, await t.log(
                    `  ✓ Restored bound variable for fill[${_}].${oe} on "${r.name || "Unnamed"}" (${e.type}): variable ${pe.name} (ID: ${pe.id.substring(0, 8)}...)`
                  )) : await t.warning(
                    `  Variable reference ${me} not found in recognizedVariables for fill[${_}].${oe} on "${r.name || "Unnamed"}"`
                  );
                } else
                  e.type === "VECTOR" && await t.warning(
                    `  DEBUG: Variable reference ${me} is undefined for fill[${_}].${oe} on VECTOR "${r.name || "Unnamed"}"`
                  );
              } else
                e.type === "VECTOR" && await t.warning(
                  `  DEBUG: fill[${_}].${oe} on VECTOR "${r.name || "Unnamed"}" is not a variable reference: ${JSON.stringify(he)}`
                );
            f.push(Z);
          }
          r.fills = f, await t.log(
            `  ✓ Set fills with boundVariables on "${r.name || "Unnamed"}" (${e.type})`
          );
          const A = r.fills, G = e.name || "Unnamed";
          if (Array.isArray(A))
            for (let _ = 0; _ < A.length; _++) {
              const U = A[_];
              U && typeof U == "object" && U.selectionColor !== void 0 && await t.warning(
                `  ⚠️ ISSUE #2: "${G}" fill[${_}] has selectionColor AFTER setting with boundVariables: ${JSON.stringify(U.selectionColor)}`
              );
            }
        } else {
          r.fills = N;
          const f = r.fills, A = e.name || "Unnamed";
          if (Array.isArray(f))
            for (let G = 0; G < f.length; G++) {
              const _ = f[G];
              _ && typeof _ == "object" && _.selectionColor !== void 0 && await t.warning(
                `  ⚠️ ISSUE #2: "${A}" fill[${G}] has selectionColor AFTER setting: ${JSON.stringify(_.selectionColor)}`
              );
            }
        }
        e.boundVariables && Object.keys(e.boundVariables).length > 0 && !e.boundVariables.fills && await t.log(
          `  Node "${r.name || "Unnamed"}" (${e.type}) has boundVariables but not for fills: ${Object.keys(e.boundVariables).join(", ")}`
        );
      } catch (N) {
        console.log("Error setting fills:", N);
      }
    else if (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "GROUP")
      try {
        r.fills = [];
      } catch (N) {
        console.log("Error clearing fills:", N);
      }
  }
  if (e.strokes !== void 0)
    try {
      e.strokes.length > 0 ? r.strokes = e.strokes : r.strokes = [];
    } catch (N) {
      console.log("Error setting strokes:", N);
    }
  else if (e.type === "VECTOR")
    try {
      r.strokes = [];
    } catch (N) {
    }
  const T = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.strokeWeight || e.boundVariables.strokeAlign);
  e.strokeWeight !== void 0 ? (!T || !e.boundVariables.strokeWeight) && (r.strokeWeight = e.strokeWeight) : e.type === "VECTOR" && (e.strokes === void 0 || e.strokes.length === 0) && (!T || !e.boundVariables.strokeWeight) && (r.strokeWeight = 0), e.strokeAlign !== void 0 && (!T || !e.boundVariables.strokeAlign) && (r.strokeAlign = e.strokeAlign);
  const C = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.cornerRadius || e.boundVariables.topLeftRadius || e.boundVariables.topRightRadius || e.boundVariables.bottomLeftRadius || e.boundVariables.bottomRightRadius);
  if (e.cornerRadius !== void 0 && (!C || !e.boundVariables.cornerRadius) && (r.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (r.effects = e.effects), e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") {
    if (e.layoutMode !== void 0 && (["NONE", "HORIZONTAL", "VERTICAL"].includes(e.layoutMode) ? r.layoutMode = e.layoutMode : await t.warning(
      `Invalid layoutMode value "${e.layoutMode}" for node "${e.name || "Unnamed"}", skipping layoutMode setting`
    )), e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.boundVariables && l) {
      const P = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ];
      for (const f of P) {
        const A = e.boundVariables[f];
        if (A && _e(A)) {
          const G = A._varRef;
          if (G !== void 0) {
            const _ = l.get(String(G));
            if (_) {
              const U = {
                type: "VARIABLE_ALIAS",
                id: _.id
              };
              r.boundVariables || (r.boundVariables = {});
              const H = r[f], te = (ne = r.boundVariables) == null ? void 0 : ne[f];
              await t.log(
                `  DEBUG: Attempting to set bound variable for ${f} on "${e.name || "Unnamed"}": current value=${H}, current boundVar=${JSON.stringify(te)}`
              );
              try {
                r.setBoundVariable(f, null);
              } catch (oe) {
              }
              try {
                r.setBoundVariable(f, _);
                const oe = (se = r.boundVariables) == null ? void 0 : se[f];
                await t.log(
                  `  DEBUG: Immediately after setting ${f} bound variable: ${JSON.stringify(oe)}`
                );
              } catch (oe) {
                await t.warning(
                  `  Error setting bound variable for ${f}: ${oe instanceof Error ? oe.message : String(oe)}`
                );
              }
              const Z = (le = r.boundVariables) == null ? void 0 : le[f];
              if (f === "itemSpacing") {
                const oe = r[f], he = (ue = r.boundVariables) == null ? void 0 : ue[f];
                await t.log(
                  `  [ISSUE #1 DEBUG] itemSpacing variable binding for "${e.name || "Unnamed"}":`
                ), await t.log(
                  `    - Expected variable ref: ${G}`
                ), await t.log(
                  `    - Final itemSpacing value: ${oe}`
                ), await t.log(
                  `    - Final boundVariable: ${JSON.stringify(he)}`
                ), await t.log(
                  `    - Variable found: ${_ ? `Yes (ID: ${_.id})` : "No"}`
                ), !Z || !Z.id ? await t.warning(
                  "    ⚠️ ISSUE #1: itemSpacing variable binding FAILED - boundVariable not set correctly!"
                ) : await t.log(
                  "    ✓ itemSpacing variable binding SUCCESS"
                );
              }
              Z && typeof Z == "object" && Z.type === "VARIABLE_ALIAS" && Z.id === _.id ? await t.log(
                `  ✓ Set bound variable for ${f} on "${e.name || "Unnamed"}" (${e.type}): variable ${_.name} (ID: ${_.id.substring(0, 8)}...)`
              ) : await t.warning(
                `  Failed to set bound variable for ${f} on "${e.name || "Unnamed"}" - verification failed. Expected: ${JSON.stringify(U)}, Got: ${JSON.stringify(Z)}`
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
    const N = e.boundVariables && typeof e.boundVariables == "object";
    if (N) {
      const P = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ].filter((f) => e.boundVariables[f]);
      P.length > 0 && await t.log(
        `  DEBUG: Node "${e.name || "Unnamed"}" (${e.type}) has bound variables for: ${P.join(", ")}`
      );
    }
    if (e.paddingLeft !== void 0 && (!N || !e.boundVariables.paddingLeft) && (r.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (!N || !e.boundVariables.paddingRight) && (r.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (!N || !e.boundVariables.paddingTop) && (r.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (!N || !e.boundVariables.paddingBottom) && (r.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && r.layoutMode !== void 0 && r.layoutMode !== "NONE") {
      const P = ((be = r.boundVariables) == null ? void 0 : be.itemSpacing) !== void 0;
      !P && (!N || !e.boundVariables.itemSpacing) ? r.itemSpacing !== e.itemSpacing && (await t.log(
        `  Setting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (late setting)`
      ), r.itemSpacing = e.itemSpacing) : P && await t.log(
        `  Skipping late setting of itemSpacing for "${e.name || "Unnamed"}" - already bound to variable`
      );
    }
    e.counterAxisSpacing !== void 0 && (!N || !e.boundVariables.counterAxisSpacing) && r.layoutMode !== void 0 && r.layoutMode !== "NONE" && (r.counterAxisSpacing = e.counterAxisSpacing), e.layoutGrow !== void 0 && (r.layoutGrow = e.layoutGrow);
  }
  if ((e.type === "VECTOR" || e.type === "BOOLEAN_OPERATION" || e.type === "LINE") && (e.strokeCap !== void 0 && (r.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (r.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (r.dashPattern = e.dashPattern), e.type === "VECTOR" || e.type === "BOOLEAN_OPERATION")) {
    if (e.fillGeometry !== void 0)
      try {
        const { normalizeSvgPath: A } = await Promise.resolve().then(() => Ra), G = e.fillGeometry.map((_) => {
          const U = _.data;
          return {
            data: A(U),
            windingRule: _.windingRule || _.windRule || "NONZERO"
          };
        });
        for (let _ = 0; _ < e.fillGeometry.length; _++) {
          const U = e.fillGeometry[_].data, H = G[_].data;
          U !== H && await t.log(
            `  Normalized path ${_ + 1} for "${e.name || "Unnamed"}": ${U.substring(0, 50)}... -> ${H.substring(0, 50)}...`
          );
        }
        r.vectorPaths = G, await t.log(
          `  Set vectorPaths for VECTOR "${e.name || "Unnamed"}" (${G.length} path(s))`
        );
      } catch (A) {
        await t.warning(
          `Error setting vectorPaths for VECTOR "${e.name || "Unnamed"}": ${A}`
        );
      }
    if (e.strokeGeometry !== void 0)
      try {
        r.strokeGeometry = e.strokeGeometry;
      } catch (A) {
        await t.warning(
          `Error setting strokeGeometry for VECTOR "${e.name || "Unnamed"}": ${A}`
        );
      }
    const N = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
    if (e.width !== void 0 && e.height !== void 0 && !N)
      try {
        r.resize(e.width, e.height), await t.log(
          `  Set size for VECTOR "${e.name || "Unnamed"}" to ${e.width}x${e.height}`
        );
      } catch (A) {
        await t.warning(
          `Error setting size for VECTOR "${e.name || "Unnamed"}": ${A}`
        );
      }
    const P = e.constraintHorizontal || ((Me = e.constraints) == null ? void 0 : Me.horizontal), f = e.constraintVertical || ((Fe = e.constraints) == null ? void 0 : Fe.vertical);
    if (P !== void 0 || f !== void 0) {
      await t.log(
        `  [ISSUE #4] "${e.name || "Unnamed"}" (VECTOR) - Setting constraints immediately after size: Expected H=${P || "undefined"}, V=${f || "undefined"}`
      );
      const A = r.constraints || {}, G = A.horizontal || "MIN", _ = A.vertical || "MIN", U = P || G, H = f || _;
      try {
        r.constraints = {
          horizontal: U,
          vertical: H
        };
        const oe = (Ue = r.constraints) == null ? void 0 : Ue.horizontal, he = (ze = r.constraints) == null ? void 0 : ze.vertical;
        oe === U && he === H ? await t.log(
          `  [ISSUE #4] ✓ Constraints set successfully for "${e.name || "Unnamed"}" (VECTOR): H=${oe}, V=${he}`
        ) : await t.warning(
          `  [ISSUE #4] ⚠️ Constraints set but verification failed! Expected H=${U}, V=${H}, got H=${oe || "undefined"}, V=${he || "undefined"} for "${e.name || "Unnamed"}"`
        );
      } catch (oe) {
        await t.warning(
          `  [ISSUE #4] ✗ Failed to set constraints for "${e.name || "Unnamed"}" (VECTOR): ${oe instanceof Error ? oe.message : String(oe)}`
        );
      }
      const te = (et = r.constraints) == null ? void 0 : et.horizontal, Z = (je = r.constraints) == null ? void 0 : je.vertical;
      await t.log(
        `  [ISSUE #4] "${e.name || "Unnamed"}" (VECTOR) - Final constraints after immediate setting: H=${te || "undefined"}, V=${Z || "undefined"}`
      ), P !== void 0 && te !== P && await t.warning(
        `  ⚠️ ISSUE #4: "${e.name || "Unnamed"}" constraintHorizontal mismatch! Expected: ${P}, Got: ${te || "undefined"}`
      ), f !== void 0 && Z !== f && await t.warning(
        `  ⚠️ ISSUE #4: "${e.name || "Unnamed"}" constraintVertical mismatch! Expected: ${f}, Got: ${Z || "undefined"}`
      ), P !== void 0 && f !== void 0 && te === P && Z === f && await t.log(
        `  ✓ ISSUE #4: "${e.name || "Unnamed"}" (VECTOR) constraints correctly set: H=${te}, V=${Z}`
      );
    }
  }
  if (e.type === "TEXT" && e.characters !== void 0)
    try {
      let N = !1;
      if (await t.log(
        `  Processing TEXT node "${e.name || "Unnamed"}": has _styleRef=${e._styleRef !== void 0}, has styleMapping=${b != null}`
      ), e._styleRef !== void 0)
        if (!b)
          await t.warning(
            `Text node "${e.name || "Unnamed"}" has _styleRef but styles table was not imported. Using individual properties instead.`
          );
        else {
          const P = b.get(e._styleRef);
          if (P && P.type === "TEXT")
            try {
              const f = P;
              await t.log(
                `  Applying text style "${P.name}" to text node "${e.name || "Unnamed"}" (font: ${f.fontName.family} ${f.fontName.style})`
              );
              try {
                await figma.loadFontAsync(f.fontName), await t.log(
                  `  ✓ Loaded font "${f.fontName.family} ${f.fontName.style}" for style "${P.name}"`
                );
              } catch (A) {
                await t.warning(
                  `  Could not load font "${f.fontName.family} ${f.fontName.style}" for style "${P.name}": ${A}. Trying fallback font.`
                );
                try {
                  await figma.loadFontAsync({
                    family: "Roboto",
                    style: "Regular"
                  }), await t.log(
                    '  ✓ Loaded fallback font "Roboto Regular"'
                  );
                } catch (G) {
                  await t.warning(
                    `  Could not load fallback font for style "${P.name}" on text node "${e.name || "Unnamed"}"`
                  );
                }
              }
              await r.setTextStyleIdAsync(P.id), await t.log(
                `  ✓ Set textStyleId to "${P.id}" for style "${P.name}"`
              ), r.characters = e.characters, await t.log(
                `  ✓ Set characters: "${e.characters.substring(0, 50)}${e.characters.length > 50 ? "..." : ""}"`
              ), N = !0, e.textAlignHorizontal !== void 0 && (r.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (r.textAlignVertical = e.textAlignVertical), e.textAutoResize !== void 0 && (r.textAutoResize = e.textAutoResize), e.listOptions !== void 0 && (r.listOptions = e.listOptions);
            } catch (f) {
              await t.warning(
                `Failed to apply style "${P.name}" on text node "${e.name || "Unnamed"}": ${f}. Falling back to individual properties.`
              );
            }
          else
            await t.warning(
              `Text node "${e.name || "Unnamed"}" has invalid _styleRef (${e._styleRef}). Using individual properties instead.`
            );
        }
      if (!N) {
        if (e.fontName)
          try {
            await figma.loadFontAsync(e.fontName), r.fontName = e.fontName;
          } catch (f) {
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
        const P = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.fontSize || e.boundVariables.letterSpacing || e.boundVariables.lineHeight);
        e.fontSize !== void 0 && (!P || !e.boundVariables.fontSize) && (r.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (r.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (r.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (!P || !e.boundVariables.letterSpacing) && (r.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (!P || !e.boundVariables.lineHeight) && (r.lineHeight = e.lineHeight), e.textCase !== void 0 && (r.textCase = e.textCase), e.textDecoration !== void 0 && (r.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (r.textAutoResize = e.textAutoResize);
      }
    } catch (N) {
      console.log("Error setting text properties: " + N);
      try {
        r.characters = e.characters;
      } catch (P) {
        console.log("Could not set text characters: " + P);
      }
    }
  if (e.selectionColor !== void 0) {
    const N = e.name || "Unnamed";
    if (e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.selectionColor !== void 0)
      await t.log(
        `  [ISSUE #2] Skipping direct selectionColor value for "${N}" - will be set via bound variable`
      );
    else
      try {
        r.selectionColor = e.selectionColor, await t.log(
          `  [ISSUE #2] Set selectionColor (direct value) on "${N}": ${JSON.stringify(e.selectionColor)}`
        );
      } catch (f) {
        await t.warning(
          `  [ISSUE #2] Failed to set selectionColor on "${N}": ${f instanceof Error ? f.message : String(f)}`
        );
      }
  }
  if (e.boundVariables && l) {
    const N = [
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "paddingBottom",
      "itemSpacing"
    ];
    for (const [P, f] of Object.entries(
      e.boundVariables
    ))
      if (P !== "fills" && !N.includes(P)) {
        if (P === "selectionColor") {
          const A = e.name || "Unnamed";
          await t.log(
            `  [ISSUE #2] Restoring bound variable for selectionColor on "${A}"`
          );
        }
        if (_e(f) && n && l) {
          const A = f._varRef;
          if (A !== void 0) {
            const G = l.get(String(A));
            if (G)
              try {
                const _ = {
                  type: "VARIABLE_ALIAS",
                  id: G.id
                };
                r.boundVariables || (r.boundVariables = {});
                const U = r[P];
                U !== void 0 && r.boundVariables[P] === void 0 && await t.warning(
                  `  Property ${P} has direct value ${U} which may prevent bound variable from being set`
                ), r.boundVariables[P] = _;
                const te = (R = r.boundVariables) == null ? void 0 : R[P];
                if (te && typeof te == "object" && te.type === "VARIABLE_ALIAS" && te.id === G.id)
                  await t.log(
                    `  ✓ Set bound variable for ${P} on "${e.name || "Unnamed"}" (${e.type}): variable ${G.name} (ID: ${G.id.substring(0, 8)}...)`
                  );
                else {
                  const Z = (fe = r.boundVariables) == null ? void 0 : fe[P];
                  await t.warning(
                    `  Failed to set bound variable for ${P} on "${e.name || "Unnamed"}" - bound variable not persisted. Property value: ${U}, Expected: ${JSON.stringify(_)}, Got: ${JSON.stringify(Z)}`
                  );
                }
              } catch (_) {
                await t.warning(
                  `  Error setting bound variable for ${P} on "${e.name || "Unnamed"}": ${_}`
                );
              }
            else
              await t.warning(
                `  Variable reference ${A} not found in recognizedVariables for ${P} on "${e.name || "Unnamed"}"`
              );
          }
        }
      }
  }
  if (e.boundVariables && l && (e.boundVariables.width || e.boundVariables.height)) {
    const N = e.boundVariables.width, P = e.boundVariables.height;
    if (N && _e(N)) {
      const f = N._varRef;
      if (f !== void 0) {
        const A = l.get(String(f));
        if (A) {
          const G = {
            type: "VARIABLE_ALIAS",
            id: A.id
          };
          r.boundVariables || (r.boundVariables = {}), r.boundVariables.width = G;
        }
      }
    }
    if (P && _e(P)) {
      const f = P._varRef;
      if (f !== void 0) {
        const A = l.get(String(f));
        if (A) {
          const G = {
            type: "VARIABLE_ALIAS",
            id: A.id
          };
          r.boundVariables || (r.boundVariables = {}), r.boundVariables.height = G;
        }
      }
    }
  }
  const F = e.id && o && o.has(e.id) && r.type === "COMPONENT" && r.children && r.children.length > 0;
  if (e.children && Array.isArray(e.children) && r.type !== "INSTANCE" && !F) {
    const N = (f) => {
      const A = [];
      for (const G of f)
        G._truncated || (G.type === "COMPONENT" ? (A.push(G), G.children && Array.isArray(G.children) && A.push(...N(G.children))) : G.children && Array.isArray(G.children) && A.push(...N(G.children)));
      return A;
    };
    for (const f of e.children) {
      if (f._truncated) {
        console.log(
          `Skipping truncated children: ${f._reason || "Unknown"}`
        );
        continue;
      }
      f.type;
    }
    const P = N(e.children);
    await t.log(
      `  First pass: Creating ${P.length} COMPONENT node(s) (without children)...`
    );
    for (const f of P)
      await t.log(
        `  Collected COMPONENT "${f.name || "Unnamed"}" (ID: ${f.id ? f.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const f of P)
      if (f.id && o && !o.has(f.id)) {
        const A = figma.createComponent();
        if (f.name !== void 0 && (A.name = f.name || "Unnamed Node"), f.componentPropertyDefinitions) {
          const G = f.componentPropertyDefinitions;
          let _ = 0, U = 0;
          for (const [H, te] of Object.entries(G))
            try {
              const oe = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[te.type];
              if (!oe) {
                await t.warning(
                  `  Unknown property type ${te.type} for property "${H}" in component "${f.name || "Unnamed"}"`
                ), U++;
                continue;
              }
              const he = te.defaultValue, me = H.split("#")[0];
              A.addComponentProperty(
                me,
                oe,
                he
              ), _++;
            } catch (Z) {
              await t.warning(
                `  Failed to add component property "${H}" to "${f.name || "Unnamed"}" in first pass: ${Z}`
              ), U++;
            }
          _ > 0 && await t.log(
            `  Added ${_} component property definition(s) to "${f.name || "Unnamed"}" in first pass${U > 0 ? ` (${U} failed)` : ""}`
          );
        }
        o.set(f.id, A), await t.log(
          `  Created COMPONENT "${f.name || "Unnamed"}" (ID: ${f.id.substring(0, 8)}...) in first pass`
        );
      }
    for (const f of e.children) {
      if (f._truncated)
        continue;
      const A = r && y && y.has(r.id) ? r.id : u, G = await He(
        f,
        r,
        n,
        i,
        s,
        l,
        o,
        c,
        d,
        p,
        // Pass deferredInstances through for recursive calls
        e,
        // parentNodeData - pass the parent's nodeData so children can check for auto-layout
        $,
        y,
        // Pass placeholderFrameIds through for recursive calls
        A,
        // Pass currentPlaceholderId down (or placeholder ID if newNode is a placeholder)
        b
        // Pass styleMapping to apply styles
      );
      if (G && G.parent !== r) {
        if (G.parent && typeof G.parent.removeChild == "function")
          try {
            G.parent.removeChild(G);
          } catch (_) {
            await t.warning(
              `Failed to remove child "${G.name || "Unnamed"}" from parent "${G.parent.name || "Unnamed"}": ${_}`
            );
          }
        r.appendChild(G);
      }
    }
  }
  if (a && r.parent !== a) {
    if (r.parent && typeof r.parent.removeChild == "function")
      try {
        r.parent.removeChild(r);
      } catch (N) {
        await t.warning(
          `Failed to remove node "${r.name || "Unnamed"}" from parent "${r.parent.name || "Unnamed"}": ${N}`
        );
      }
    a.appendChild(r);
  }
  if ((r.type === "FRAME" || r.type === "COMPONENT" || r.type === "INSTANCE") && e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.itemSpacing !== void 0) {
    const N = ((ae = r.boundVariables) == null ? void 0 : ae.itemSpacing) !== void 0, P = e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.itemSpacing;
    if (N)
      await t.log(
        `  FINAL CHECK: itemSpacing is bound to variable for "${e.name || "Unnamed"}" - skipping direct value fix`
      );
    else if (P)
      await t.warning(
        `  FINAL CHECK: itemSpacing should be bound to variable for "${e.name || "Unnamed"}" but binding is missing!`
      );
    else {
      const f = r.itemSpacing;
      f !== e.itemSpacing ? (await t.log(
        `  FINAL FIX: Resetting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (was ${f})`
      ), r.itemSpacing = e.itemSpacing, await t.log(
        `  FINAL FIX: Verified itemSpacing is now ${r.itemSpacing}`
      )) : await t.log(
        `  FINAL CHECK: itemSpacing is already correct (${f}) for "${e.name || "Unnamed"}"`
      );
    }
  }
  return r;
}
async function tn(e, a, n) {
  let i = 0, s = 0, l = 0;
  const o = (d) => {
    const p = [];
    if (d.type === "INSTANCE" && p.push(d), "children" in d && d.children)
      for (const m of d.children)
        p.push(...o(m));
    return p;
  }, c = o(e);
  await t.log(
    `  Found ${c.length} instance(s) to process for variant properties`
  );
  for (const d of c)
    try {
      const p = await d.getMainComponentAsync();
      if (!p) {
        s++;
        continue;
      }
      const m = a.getSerializedTable();
      let $ = null, y;
      if (n._instanceTableMap ? (y = n._instanceTableMap.get(
        d.id
      ), y !== void 0 ? ($ = m[y], await t.log(
        `  Found instance table index ${y} for instance "${d.name}" (ID: ${d.id.substring(0, 8)}...)`
      )) : await t.log(
        `  No instance table index mapping found for instance "${d.name}" (ID: ${d.id.substring(0, 8)}...), using fallback matching`
      )) : await t.log(
        `  No instance table map found, using fallback matching for instance "${d.name}"`
      ), !$) {
        for (const [b, r] of Object.entries(m))
          if (r.instanceType === "internal" && r.componentNodeId && n.has(r.componentNodeId)) {
            const w = n.get(r.componentNodeId);
            if (w && w.id === p.id) {
              $ = r, await t.log(
                `  Matched instance "${d.name}" to instance table entry ${b} by component (less precise)`
              );
              break;
            }
          }
      }
      if (!$) {
        await t.log(
          `  No matching entry found for instance "${d.name}" (main component: ${p.name}, ID: ${p.id.substring(0, 8)}...)`
        ), s++;
        continue;
      }
      if (!$.variantProperties) {
        await t.log(
          `  Instance table entry for "${d.name}" has no variant properties`
        ), s++;
        continue;
      }
      await t.log(
        `  Instance "${d.name}" matched to entry with variant properties: ${JSON.stringify($.variantProperties)}`
      );
      let u = null;
      if (p.parent && p.parent.type === "COMPONENT_SET" && (u = p.parent.componentPropertyDefinitions), u) {
        const b = {};
        for (const [r, w] of Object.entries(
          $.variantProperties
        )) {
          const g = r.split("#")[0];
          u[g] && (b[g] = w);
        }
        Object.keys(b).length > 0 ? (d.setProperties(b), i++, await t.log(
          `  ✓ Set variant properties on instance "${d.name}": ${JSON.stringify(b)}`
        )) : s++;
      } else
        s++;
    } catch (p) {
      l++, await t.warning(
        `  Failed to set variant properties on instance "${d.name}": ${p}`
      );
    }
  await t.log(
    `  Variant properties set: ${i} processed, ${s} skipped, ${l} errors`
  );
}
async function kt(e) {
  await figma.loadAllPagesAsync();
  const a = figma.root.children, n = new Set(a.map((l) => l.name));
  if (!n.has(e))
    return e;
  let i = 1, s = `${e}_${i}`;
  for (; n.has(s); )
    i++, s = `${e}_${i}`;
  return s;
}
async function an(e) {
  const a = await figma.variables.getLocalVariableCollectionsAsync(), n = new Set(a.map((l) => l.name));
  if (!n.has(e))
    return e;
  let i = 1, s = `${e}_${i}`;
  for (; n.has(s); )
    i++, s = `${e}_${i}`;
  return s;
}
async function nn(e, a) {
  const n = /* @__PURE__ */ new Set();
  for (const l of e.variableIds)
    try {
      const o = await figma.variables.getVariableByIdAsync(l);
      o && n.add(o.name);
    } catch (o) {
      continue;
    }
  if (!n.has(a))
    return a;
  let i = 1, s = `${a}_${i}`;
  for (; n.has(s); )
    i++, s = `${a}_${i}`;
  return s;
}
function Yt(e, a) {
  const n = e.resolvedType.toUpperCase(), i = a.toUpperCase();
  return n === i;
}
async function on(e) {
  const a = await figma.variables.getLocalVariableCollectionsAsync(), n = Ae(e.collectionName);
  if (Be(e.collectionName)) {
    for (const i of a)
      if (Ae(i.name) === n)
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
    for (const i of a)
      if (i.getSharedPluginData(
        "recursica",
        Ve
      ) === e.collectionGuid)
        return {
          collection: i,
          matchType: "recognized"
        };
  }
  for (const i of a)
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
function rn(e) {
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
function ht(e) {
  if (!e.stringTable)
    return {
      success: !1,
      error: "Invalid JSON format. String table is required."
    };
  let a;
  try {
    a = mt.fromTable(e.stringTable);
  } catch (i) {
    return {
      success: !1,
      error: `Failed to load string table: ${i instanceof Error ? i.message : "Unknown error"}`
    };
  }
  const n = ja(e, a);
  return {
    success: !0,
    stringTable: a,
    expandedJsonData: n
  };
}
function Zt(e) {
  if (!e.collections)
    return {
      success: !1,
      error: "No collections table found in JSON"
    };
  try {
    return {
      success: !0,
      collectionTable: at.fromTable(
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
async function sn(e, a) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), l = e.getTable();
  for (const [o, c] of Object.entries(l)) {
    if (c.isLocal === !1) {
      await t.log(
        `Skipping remote collection: "${c.collectionName}" (index ${o})`
      );
      continue;
    }
    const d = Ae(c.collectionName), p = a == null ? void 0 : a.get(d);
    if (p) {
      await t.log(
        `✓ Using pre-created collection: "${d}" (index ${o})`
      ), n.set(o, p);
      continue;
    }
    const m = await on(c);
    m.matchType === "recognized" ? (await t.log(
      `✓ Recognized collection by GUID: "${c.collectionName}" (index ${o})`
    ), n.set(o, m.collection)) : m.matchType === "potential" ? (await t.log(
      `? Potential match by name: "${c.collectionName}" (index ${o})`
    ), i.set(o, {
      entry: c,
      collection: m.collection
    })) : (await t.log(
      `✗ No match found for collection: "${c.collectionName}" (index ${o}) - will create new`
    ), s.set(o, c));
  }
  return await t.log(
    `Collection matching complete: ${n.size} recognized, ${i.size} potential matches, ${s.size} to create`
  ), {
    recognizedCollections: n,
    potentialMatches: i,
    collectionsToCreate: s
  };
}
async function ln(e, a, n, i) {
  if (e.size !== 0) {
    if (i) {
      await t.log(
        `Using wizard selections for ${e.size} potential match(es)...`
      );
      for (const [s, { entry: l, collection: o }] of e.entries()) {
        const c = Ae(
          l.collectionName
        ).toLowerCase();
        let d = !1;
        c === "tokens" || c === "token" ? d = i.tokens === "existing" : c === "theme" || c === "themes" ? d = i.theme === "existing" : (c === "layer" || c === "layers") && (d = i.layers === "existing");
        const p = Be(l.collectionName) ? Ae(l.collectionName) : o.name;
        d ? (await t.log(
          `✓ Wizard selection: Using existing collection "${p}" (index ${s})`
        ), a.set(s, o), await De(o, l.modes), await t.log(
          `  ✓ Ensured modes for collection "${p}" (${l.modes.length} mode(s))`
        )) : (await t.log(
          `✗ Wizard selection: Will create new collection for "${l.collectionName}" (index ${s})`
        ), n.set(s, l));
      }
      return;
    }
    await t.log(
      `Prompting user for ${e.size} potential match(es)...`
    );
    for (const [s, { entry: l, collection: o }] of e.entries())
      try {
        const c = Be(l.collectionName) ? Ae(l.collectionName) : o.name, d = `Found existing "${c}" variable collection. Should I use it?`;
        await t.log(
          `Prompting user about potential match: "${c}"`
        ), await Qe.prompt(d, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await t.log(
          `✓ User confirmed: Using existing collection "${c}" (index ${s})`
        ), a.set(s, o), await De(o, l.modes), await t.log(
          `  ✓ Ensured modes for collection "${c}" (${l.modes.length} mode(s))`
        );
      } catch (c) {
        await t.log(
          `✗ User rejected: Will create new collection for "${l.collectionName}" (index ${s})`
        ), n.set(s, l);
      }
  }
}
async function cn(e, a, n) {
  if (e.size === 0)
    return;
  await t.log("Ensuring modes exist for recognized collections...");
  const i = a.getTable();
  for (const [s, l] of e.entries()) {
    const o = i[s];
    o && (n.has(s) || (await De(l, o.modes), await t.log(
      `  ✓ Ensured modes for collection "${l.name}" (${o.modes.length} mode(s))`
    )));
  }
}
async function dn(e, a, n, i) {
  if (e.size !== 0) {
    await t.log(
      `Processing ${e.size} collection(s) to create...`
    );
    for (const [s, l] of e.entries()) {
      const o = Ae(l.collectionName), c = i == null ? void 0 : i.get(o);
      if (c) {
        await t.log(
          `Reusing pre-created collection: "${o}" (index ${s}, id: ${c.id.substring(0, 8)}...)`
        ), a.set(s, c), await De(c, l.modes), n.push(c);
        continue;
      }
      const d = await an(o);
      d !== o ? await t.log(
        `Creating collection: "${d}" (normalized: "${o}" - name conflict resolved)`
      ) : await t.log(`Creating collection: "${d}"`);
      const p = figma.variables.createVariableCollection(d);
      n.push(p);
      let m;
      if (Be(l.collectionName)) {
        const $ = gt(l.collectionName);
        $ && (m = $);
      } else l.collectionGuid && (m = l.collectionGuid);
      m && (p.setSharedPluginData(
        "recursica",
        Ve,
        m
      ), await t.log(
        `  Stored GUID: ${m.substring(0, 8)}...`
      )), await De(p, l.modes), await t.log(
        `  ✓ Created collection "${d}" with ${l.modes.length} mode(s)`
      ), a.set(s, p);
    }
    await t.log("Collection creation complete");
  }
}
function Qt(e) {
  if (!e.variables)
    return {
      success: !1,
      error: "No variables table found in JSON"
    };
  try {
    return {
      success: !0,
      variableTable: nt.fromTable(e.variables)
    };
  } catch (a) {
    return {
      success: !1,
      error: `Failed to load variables table: ${a instanceof Error ? a.message : "Unknown error"}`
    };
  }
}
async function ea(e, a, n, i) {
  const s = /* @__PURE__ */ new Map(), l = [], o = new Set(
    i.map(($) => $.id)
  );
  await t.log("Matching and creating variables in collections...");
  const c = e.getTable(), d = /* @__PURE__ */ new Map();
  for (const [$, y] of Object.entries(c)) {
    if (y._colRef === void 0)
      continue;
    const u = n.get(String(y._colRef));
    if (!u)
      continue;
    d.has(u.id) || d.set(u.id, {
      collectionName: u.name,
      existing: 0,
      created: 0
    });
    const b = d.get(u.id), r = o.has(
      u.id
    );
    let w;
    typeof y.variableType == "number" ? w = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[y.variableType] || String(y.variableType) : w = y.variableType;
    const g = await It(
      u,
      y.variableName
    );
    if (g)
      if (Yt(g, w))
        s.set($, g), b.existing++;
      else {
        await t.warning(
          `Type mismatch for variable "${y.variableName}" in collection "${u.name}": expected ${w}, found ${g.resolvedType}. Creating new variable with incremented name.`
        );
        const S = await nn(
          u,
          y.variableName
        ), k = await Ct(
          Ne(ge({}, y), {
            variableName: S,
            variableType: w
          }),
          u,
          e,
          a
        );
        r || l.push(k), s.set($, k), b.created++;
      }
    else {
      const S = await Ct(
        Ne(ge({}, y), {
          variableType: w
        }),
        u,
        e,
        a
      );
      r || l.push(S), s.set($, S), b.created++;
    }
  }
  await t.log("Variable processing complete:");
  for (const $ of d.values())
    await t.log(
      `  "${$.collectionName}": ${$.existing} existing, ${$.created} created`
    );
  await t.log(
    "Final verification: Reading back all COLOR variables..."
  );
  let p = 0, m = 0;
  for (const $ of l)
    if ($.resolvedType === "COLOR") {
      const y = await figma.variables.getVariableCollectionByIdAsync(
        $.variableCollectionId
      );
      if (!y) {
        await t.warning(
          `  ⚠️ Variable "${$.name}" has no variableCollection (ID: ${$.variableCollectionId})`
        );
        continue;
      }
      const u = y.modes;
      if (!u || u.length === 0) {
        await t.warning(
          `  ⚠️ Variable "${$.name}" collection has no modes`
        );
        continue;
      }
      for (const b of u) {
        const r = $.valuesByMode[b.modeId];
        if (r && typeof r == "object" && "r" in r) {
          const w = r;
          Math.abs(w.r - 1) < 0.01 && Math.abs(w.g - 1) < 0.01 && Math.abs(w.b - 1) < 0.01 ? (m++, await t.warning(
            `  ⚠️ Variable "${$.name}" mode "${b.name}" is WHITE: r=${w.r.toFixed(3)}, g=${w.g.toFixed(3)}, b=${w.b.toFixed(3)}`
          )) : (p++, await t.log(
            `  ✓ Variable "${$.name}" mode "${b.name}" has color: r=${w.r.toFixed(3)}, g=${w.g.toFixed(3)}, b=${w.b.toFixed(3)}`
          ));
        } else r && typeof r == "object" && "type" in r || await t.warning(
          `  ⚠️ Variable "${$.name}" mode "${b.name}" has unexpected value type: ${JSON.stringify(r)}`
        );
      }
    }
  return await t.log(
    `Final verification complete: ${p} color variables verified, ${m} white variables found`
  ), {
    recognizedVariables: s,
    newlyCreatedVariables: l
  };
}
function gn(e) {
  if (!e.instances)
    return null;
  try {
    return it.fromTable(e.instances);
  } catch (a) {
    return null;
  }
}
function fn(e) {
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
function yt(e) {
  if (!e || typeof e != "object")
    return;
  e.type !== void 0 && (e.type = fn(e.type));
  const a = e.children !== void 0 ? "children" : e.child !== void 0 ? "child" : null;
  if (a && (a === "child" && !e.children && (e.children = e.child, delete e.child), Array.isArray(e.children)))
    for (const n of e.children)
      yt(n);
  e.fillG !== void 0 && e.fillGeometry === void 0 && (e.fillGeometry = e.fillG, delete e.fillG), e.strkG !== void 0 && e.strokeGeometry === void 0 && (e.strokeGeometry = e.strkG, delete e.strkG), e.child && !e.children && (e.children = e.child, delete e.child);
}
async function mn(e, a) {
  const n = /* @__PURE__ */ new Set();
  for (const l of e.children)
    (l.type === "FRAME" || l.type === "COMPONENT") && n.add(l.name);
  if (!n.has(a))
    return a;
  let i = 1, s = `${a}_${i}`;
  for (; n.has(s); )
    i++, s = `${a}_${i}`;
  return s;
}
async function pn(e, a, n, i, s, l = "", o = null) {
  var r;
  const c = e.getSerializedTable(), d = Object.values(c).filter(
    (w) => w.instanceType === "remote"
  ), p = /* @__PURE__ */ new Map();
  if (d.length === 0)
    return await t.log("No remote instances found"), p;
  await t.log(
    `Processing ${d.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  const m = figma.root.children, $ = l ? `${l} REMOTES` : "REMOTES";
  let y = m.find(
    (w) => w.name === "REMOTES" || w.name === $
  );
  if (y ? (await t.log("Found existing REMOTES page"), l && !y.name.startsWith(l) && (y.name = $)) : (y = figma.createPage(), y.name = $, await t.log("Created REMOTES page")), d.length > 0 && (y.setPluginData("RecursicaUnderReview", "true"), await t.log("Marked REMOTES page as under review")), !y.children.some(
    (w) => w.type === "FRAME" && w.name === "Title"
  )) {
    const w = { family: "Inter", style: "Bold" }, g = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(w), await figma.loadFontAsync(g);
    const S = figma.createFrame();
    S.name = "Title", S.layoutMode = "VERTICAL", S.paddingTop = 20, S.paddingBottom = 20, S.paddingLeft = 20, S.paddingRight = 20, S.fills = [];
    const k = figma.createText();
    k.fontName = w, k.characters = "REMOTE INSTANCES", k.fontSize = 24, k.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], S.appendChild(k);
    const D = figma.createText();
    D.fontName = g, D.characters = "These are remotely connected component instances found in our different component pages.", D.fontSize = 14, D.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], S.appendChild(D), y.appendChild(S), await t.log("Created title and description on REMOTES page");
  }
  const b = /* @__PURE__ */ new Map();
  for (const [w, g] of Object.entries(c)) {
    if (g.instanceType !== "remote")
      continue;
    const S = parseInt(w, 10);
    if (await t.log(
      `Processing remote instance ${S}: "${g.componentName}"`
    ), !g.structure) {
      await t.warning(
        `Remote instance "${g.componentName}" missing structure data, skipping`
      );
      continue;
    }
    yt(g.structure);
    const k = g.structure.children !== void 0, D = g.structure.child !== void 0, j = g.structure.children ? g.structure.children.length : g.structure.child ? g.structure.child.length : 0;
    await t.log(
      `  Structure type: ${g.structure.type || "unknown"}, has children: ${j} (children key: ${k}, child key: ${D})`
    );
    let E = g.componentName;
    if (g.path && g.path.length > 0) {
      const C = g.path.filter((F) => F !== "").join(" / ");
      C && (E = `${C} / ${g.componentName}`);
    }
    const T = await mn(
      y,
      E
    );
    T !== E && await t.log(
      `Component name conflict: "${E}" -> "${T}"`
    );
    try {
      if (g.structure.type !== "COMPONENT") {
        await t.warning(
          `Remote instance "${g.componentName}" structure is not a COMPONENT (type: ${g.structure.type}), creating frame fallback`
        );
        const F = figma.createFrame();
        F.name = T;
        const O = await He(
          g.structure,
          F,
          a,
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
          s,
          null,
          // placeholderFrameIds - not needed for remote instances
          void 0,
          // currentPlaceholderId - remote instances are not inside placeholders
          o
          // Pass styleMapping to apply styles
        );
        O ? (F.appendChild(O), y.appendChild(F), await t.log(
          `✓ Created remote instance frame fallback: "${T}"`
        )) : F.remove();
        continue;
      }
      const C = figma.createComponent();
      C.name = T, y.appendChild(C), await t.log(
        `  Created component node: "${T}"`
      );
      try {
        if (g.structure.componentPropertyDefinitions) {
          const V = g.structure.componentPropertyDefinitions;
          let J = 0, Q = 0;
          for (const [M, L] of Object.entries(V))
            try {
              const z = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[L.type];
              if (!z) {
                await t.warning(
                  `  Unknown property type ${L.type} for property "${M}" in component "${g.componentName}"`
                ), Q++;
                continue;
              }
              const W = L.defaultValue, q = M.split("#")[0];
              C.addComponentProperty(
                q,
                z,
                W
              ), J++;
            } catch (X) {
              await t.warning(
                `  Failed to add component property "${M}" to "${g.componentName}": ${X}`
              ), Q++;
            }
          J > 0 && await t.log(
            `  Added ${J} component property definition(s) to "${g.componentName}"${Q > 0 ? ` (${Q} failed)` : ""}`
          );
        }
        g.structure.name !== void 0 && (C.name = g.structure.name);
        const F = g.structure.boundVariables && typeof g.structure.boundVariables == "object" && (g.structure.boundVariables.width || g.structure.boundVariables.height);
        g.structure.width !== void 0 && g.structure.height !== void 0 && !F && C.resize(g.structure.width, g.structure.height), g.structure.x !== void 0 && (C.x = g.structure.x), g.structure.y !== void 0 && (C.y = g.structure.y);
        const O = g.structure.boundVariables && typeof g.structure.boundVariables == "object";
        if (g.structure.visible !== void 0 && (C.visible = g.structure.visible), g.structure.opacity !== void 0 && (!O || !g.structure.boundVariables.opacity) && (C.opacity = g.structure.opacity), g.structure.rotation !== void 0 && (!O || !g.structure.boundVariables.rotation) && (C.rotation = g.structure.rotation), g.structure.blendMode !== void 0 && (!O || !g.structure.boundVariables.blendMode) && (C.blendMode = g.structure.blendMode), g.structure.fills !== void 0)
          try {
            let V = g.structure.fills;
            Array.isArray(V) && (V = V.map((J) => {
              if (J && typeof J == "object") {
                const Q = ge({}, J);
                return delete Q.boundVariables, Q;
              }
              return J;
            })), C.fills = V, (r = g.structure.boundVariables) != null && r.fills && i && await qt(
              C,
              g.structure.boundVariables,
              "fills",
              i
            );
          } catch (V) {
            await t.warning(
              `Error setting fills for remote component "${g.componentName}": ${V}`
            );
          }
        if (g.structure.strokes !== void 0)
          try {
            C.strokes = g.structure.strokes;
          } catch (V) {
            await t.warning(
              `Error setting strokes for remote component "${g.componentName}": ${V}`
            );
          }
        const v = g.structure.boundVariables && typeof g.structure.boundVariables == "object" && (g.structure.boundVariables.strokeWeight || g.structure.boundVariables.strokeAlign);
        g.structure.strokeWeight !== void 0 && (!v || !g.structure.boundVariables.strokeWeight) && (C.strokeWeight = g.structure.strokeWeight), g.structure.strokeAlign !== void 0 && (!v || !g.structure.boundVariables.strokeAlign) && (C.strokeAlign = g.structure.strokeAlign), g.structure.layoutMode !== void 0 && (C.layoutMode = g.structure.layoutMode), g.structure.primaryAxisSizingMode !== void 0 && (C.primaryAxisSizingMode = g.structure.primaryAxisSizingMode), g.structure.counterAxisSizingMode !== void 0 && (C.counterAxisSizingMode = g.structure.counterAxisSizingMode);
        const h = g.structure.boundVariables && typeof g.structure.boundVariables == "object";
        g.structure.paddingLeft !== void 0 && (!h || !g.structure.boundVariables.paddingLeft) && (C.paddingLeft = g.structure.paddingLeft), g.structure.paddingRight !== void 0 && (!h || !g.structure.boundVariables.paddingRight) && (C.paddingRight = g.structure.paddingRight), g.structure.paddingTop !== void 0 && (!h || !g.structure.boundVariables.paddingTop) && (C.paddingTop = g.structure.paddingTop), g.structure.paddingBottom !== void 0 && (!h || !g.structure.boundVariables.paddingBottom) && (C.paddingBottom = g.structure.paddingBottom), g.structure.itemSpacing !== void 0 && (!h || !g.structure.boundVariables.itemSpacing) && (C.itemSpacing = g.structure.itemSpacing);
        const x = g.structure.boundVariables && typeof g.structure.boundVariables == "object" && (g.structure.boundVariables.cornerRadius || g.structure.boundVariables.topLeftRadius || g.structure.boundVariables.topRightRadius || g.structure.boundVariables.bottomLeftRadius || g.structure.boundVariables.bottomRightRadius);
        if (g.structure.cornerRadius !== void 0 && (!x || !g.structure.boundVariables.cornerRadius) && (C.cornerRadius = g.structure.cornerRadius), g.structure.boundVariables && i) {
          const V = g.structure.boundVariables, J = [
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
          for (const Q of J)
            if (V[Q] && _e(V[Q])) {
              const M = V[Q]._varRef;
              if (M !== void 0) {
                const L = i.get(String(M));
                if (L) {
                  const X = {
                    type: "VARIABLE_ALIAS",
                    id: L.id
                  };
                  C.boundVariables || (C.boundVariables = {}), C.boundVariables[Q] = X;
                }
              }
            }
        }
        await t.log(
          `  DEBUG: Structure keys: ${Object.keys(g.structure).join(", ")}, has children: ${!!g.structure.children}, has child: ${!!g.structure.child}`
        );
        const I = g.structure.children || (g.structure.child ? g.structure.child : null);
        if (await t.log(
          `  DEBUG: childrenArray exists: ${!!I}, isArray: ${Array.isArray(I)}, length: ${I ? I.length : 0}`
        ), I && Array.isArray(I) && I.length > 0) {
          await t.log(
            `  Recreating ${I.length} child(ren) for component "${g.componentName}"`
          );
          for (let V = 0; V < I.length; V++) {
            const J = I[V];
            if (await t.log(
              `  DEBUG: Processing child ${V + 1}/${I.length}: ${JSON.stringify({ name: J == null ? void 0 : J.name, type: J == null ? void 0 : J.type, hasTruncated: !!(J != null && J._truncated) })}`
            ), J._truncated) {
              await t.log(
                `  Skipping truncated child: ${J._reason || "Unknown"}`
              );
              continue;
            }
            await t.log(
              `  Recreating child: "${J.name || "Unnamed"}" (type: ${J.type})`
            );
            const Q = await He(
              J,
              C,
              a,
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
              g.structure,
              // parentNodeData - pass the component's structure so children can check for auto-layout
              s,
              null,
              // placeholderFrameIds - not needed for remote instances
              void 0,
              // currentPlaceholderId - remote instances are not inside placeholders
              o
              // Pass styleMapping to apply styles
            );
            Q ? (C.appendChild(Q), await t.log(
              `  ✓ Appended child "${J.name || "Unnamed"}" to component "${g.componentName}"`
            )) : await t.warning(
              `  ✗ Failed to create child "${J.name || "Unnamed"}" (type: ${J.type})`
            );
          }
        }
        p.set(S, C), await t.log(
          `✓ Created remote component: "${T}" (index ${S})`
        );
      } catch (F) {
        await t.warning(
          `Error populating remote component "${g.componentName}": ${F instanceof Error ? F.message : "Unknown error"}`
        ), C.remove();
      }
    } catch (C) {
      await t.warning(
        `Error recreating remote instance "${g.componentName}": ${C instanceof Error ? C.message : "Unknown error"}`
      );
    }
  }
  return await t.log(
    `Remote instance processing complete: ${p.size} component(s) created`
  ), p;
}
async function un(e, a, n, i, s, l, o = null, c = null, d = null, p = !1, m = null, $ = !1, y = !1, u = "", b = null) {
  await t.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const r = figma.root.children, w = "RecursicaPublishedMetadata";
  let g = null;
  for (const v of r) {
    const h = v.getPluginData(w);
    if (h)
      try {
        if (JSON.parse(h).id === e.guid) {
          g = v;
          break;
        }
      } catch (x) {
        continue;
      }
  }
  let S = !1;
  if (g && !p && !$) {
    let v;
    try {
      const I = g.getPluginData(w);
      I && (v = JSON.parse(I).version);
    } catch (I) {
    }
    const h = v !== void 0 ? ` v${v}` : "", x = `Found existing component "${g.name}${h}". Should I use it or create a copy?`;
    await t.log(
      `Found existing page with same GUID: "${g.name}". Prompting user...`
    );
    try {
      await Qe.prompt(x, {
        okLabel: "Use",
        cancelLabel: "Copy",
        timeoutMs: 3e5
        // 5 minutes
      }), S = !0, await t.log(
        `User chose to use existing page: "${g.name}"`
      );
    } catch (I) {
      await t.log(
        "User chose to create a copy. Will create new page."
      );
    }
  }
  if (S && g)
    return await figma.setCurrentPageAsync(g), await t.log(
      `Using existing page: "${g.name}" (GUID: ${e.guid.substring(0, 8)}...)`
    ), await t.log(
      `  Instances from other pages will resolve to components on this existing page using componentPageName: "${g.name}"`
    ), {
      success: !0,
      page: g,
      // Include pageId so it can be tracked in importedPages
      pageId: g.id
    };
  const k = r.find((v) => v.name === e.name);
  k && await t.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let D;
  if (g || k) {
    const v = `__${e.name}`;
    D = await kt(v), await t.log(
      `Creating scratch page: "${D}" (will be renamed to "${e.name}" on success)`
    );
  } else
    D = e.name, await t.log(`Creating page: "${D}"`);
  const j = figma.createPage();
  if (j.name = D, await figma.setCurrentPageAsync(j), await t.log(`Switched to page: "${D}"`), !a.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await t.log("Recreating page structure...");
  const E = a.pageData;
  if (E.backgrounds !== void 0)
    try {
      j.backgrounds = E.backgrounds, await t.log(
        `Set page background: ${JSON.stringify(E.backgrounds)}`
      );
    } catch (v) {
      await t.warning(`Failed to set page background: ${v}`);
    }
  yt(E);
  const T = /* @__PURE__ */ new Map(), C = (v, h = []) => {
    if (v.type === "COMPONENT" && v.id && h.push(v.id), v.children && Array.isArray(v.children))
      for (const x of v.children)
        x._truncated || C(x, h);
    return h;
  }, F = C(E);
  if (await t.log(
    `Found ${F.length} COMPONENT node(s) in page data`
  ), F.length > 0 && (await t.log(
    `Component IDs in page data (first 20): ${F.slice(0, 20).map((v) => v.substring(0, 8) + "...").join(", ")}`
  ), E._allComponentIds = F), E.children && Array.isArray(E.children))
    for (const v of E.children) {
      const h = await He(
        v,
        j,
        n,
        i,
        s,
        l,
        T,
        !1,
        // isRemoteStructure: false - we're creating the main page
        o,
        c,
        E,
        // parentNodeData - pass the page's nodeData so children can check for auto-layout
        m,
        d,
        void 0,
        // currentPlaceholderId - page root is not inside a placeholder
        b
        // Pass styleMapping to apply styles
      );
      h && j.appendChild(h);
    }
  await t.log("Page structure recreated successfully"), s && (await t.log(
    "Third pass: Setting variant properties on instances..."
  ), await tn(
    j,
    s,
    T
  ));
  const O = {
    _ver: 1,
    id: e.guid,
    name: e.name,
    version: e.version || 0,
    publishDate: (/* @__PURE__ */ new Date()).toISOString(),
    history: {}
  };
  if (j.setPluginData(w, JSON.stringify(O)), await t.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), D.startsWith("__")) {
    let v;
    y ? v = u ? `${u} ${e.name}` : e.name : v = await kt(e.name), j.name = v, await t.log(`Renamed page from "${D}" to "${v}"`);
  } else y && u && (j.name.startsWith(u) || (j.name = `${u} ${j.name}`));
  return {
    success: !0,
    page: j,
    deferredInstances: c || void 0
  };
}
async function At(e) {
  var i, s, l;
  e.clearConsole !== !1 && await t.clear(), await t.log("=== Starting Page Import ===");
  const n = [];
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
    const c = rn(o);
    if (!c.success)
      return await t.error(c.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: c.error,
        data: {}
      };
    const d = c.metadata;
    await t.log(
      `Metadata validated: guid=${d.guid}, name=${d.name}`
    ), await t.log("Loading string table...");
    const p = ht(o);
    if (!p.success)
      return await t.error(p.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: p.error,
        data: {}
      };
    await t.log("String table loaded successfully"), await t.log("Expanding JSON data...");
    const m = p.expandedJsonData;
    await t.log("JSON expanded successfully"), await t.log("Loading collections table...");
    const $ = Zt(m);
    if (!$.success)
      return $.error === "No collections table found in JSON" ? (await t.log($.error), await t.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: d.name }
      }) : (await t.error($.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: $.error,
        data: {}
      });
    const y = $.collectionTable;
    await t.log(
      `Loaded collections table with ${y.getSize()} collection(s)`
    ), await t.log(
      "Matching collections with existing local collections..."
    );
    const { recognizedCollections: u, potentialMatches: b, collectionsToCreate: r } = await sn(y, e.preCreatedCollections);
    await ln(
      b,
      u,
      r,
      e.collectionChoices
    ), await cn(
      u,
      y,
      b
    ), await dn(
      r,
      u,
      n,
      e.preCreatedCollections
    ), await t.log("Loading variables table...");
    const w = Qt(m);
    if (!w.success)
      return w.error === "No variables table found in JSON" ? (await t.log(w.error), await t.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no variables to process)",
        data: { pageName: d.name }
      }) : (await t.error(w.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: w.error,
        data: {}
      });
    const g = w.variableTable;
    await t.log(
      `Loaded variables table with ${g.getSize()} variable(s)`
    );
    const { recognizedVariables: S, newlyCreatedVariables: k } = await ea(
      g,
      y,
      u,
      n
    );
    await t.log("Checking for styles table...");
    const D = m.styles !== void 0 && m.styles !== null;
    if (!D) {
      if (Xt(
        m.pageData
      )) {
        const z = "Style references found in page data but styles table is missing from JSON. Cannot import styles.";
        return await t.error(z), {
          type: "importPage",
          success: !1,
          error: !0,
          message: z,
          data: {}
        };
      }
      await t.log(
        "No styles table found in JSON (and no style references detected)"
      );
    }
    let j = null;
    if (D) {
      await t.log("Loading styles table...");
      const X = ft.fromTable(m.styles);
      await t.log(
        `Loaded styles table with ${X.getSize()} style(s)`
      ), j = await qa(
        X.getTable(),
        S
      ), await t.log(
        `Imported ${j.size} style(s) (some may have been skipped if they already exist)`
      );
    }
    await t.log("Loading instance table...");
    const E = gn(m);
    if (E) {
      const X = E.getSerializedTable(), z = Object.values(X).filter(
        (q) => q.instanceType === "internal"
      ), W = Object.values(X).filter(
        (q) => q.instanceType === "remote"
      );
      await t.log(
        `Loaded instance table with ${E.getSize()} instance(s) (${z.length} internal, ${W.length} remote)`
      );
    } else
      await t.log("No instance table found in JSON");
    const T = [], C = /* @__PURE__ */ new Set(), F = (i = e.isMainPage) != null ? i : !0, O = (s = e.alwaysCreateCopy) != null ? s : !1, v = (l = e.skipUniqueNaming) != null ? l : !1, h = e.constructionIcon || "";
    let x = null;
    E && (x = await pn(
      E,
      g,
      y,
      S,
      u,
      h,
      j
      // Pass styleMapping to apply styles
    ));
    const I = await un(
      d,
      m,
      g,
      y,
      E,
      S,
      x,
      T,
      C,
      F,
      u,
      O,
      v,
      h,
      j
      // Pass styleMapping to apply styles
    );
    if (!I.success)
      return await t.error(I.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: I.error,
        data: {}
      };
    const V = I.page, J = S.size + k.length, Q = I.deferredInstances || T, M = (Q == null ? void 0 : Q.length) || 0;
    if (await t.log("=== Import Complete ==="), await t.log(
      `Successfully processed ${u.size} collection(s), ${J} variable(s), and created page "${V.name}"${M > 0 ? ` (${M} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`
    ), M > 0)
      for (const X of Q)
        await t.log(
          `    - "${X.nodeData.name}" from page "${X.instanceEntry.componentPageName}"`
        );
    const L = I.pageId || V.id;
    return {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: {
        pageName: V.name,
        pageId: L,
        // Include pageId for tracking (used for both new and reused pages)
        deferredInstances: M > 0 ? Q : void 0,
        createdEntities: {
          pageIds: [V.id],
          collectionIds: n.map((X) => X.id),
          variableIds: k.map((X) => X.id)
        }
      }
    };
  } catch (o) {
    const c = o instanceof Error ? o.message : "Unknown error occurred";
    return await t.error(`Import failed: ${c}`), o instanceof Error && o.stack && await t.error(`Stack trace: ${o.stack}`), console.error("Error importing page:", o), {
      type: "importPage",
      success: !1,
      error: !0,
      message: c,
      data: {}
    };
  }
}
async function Ut(e, a, n) {
  var i, s;
  if (!(!n || !a.children || !Array.isArray(a.children) || !e.children || e.children.length === 0)) {
    await t.log(
      `[FILL-BOUND] Applying fill bound variables to instance "${e.name}" children. Instance has ${e.children.length} child(ren), JSON has ${((i = a.children) == null ? void 0 : i.length) || 0} child(ren)`
    );
    for (const l of e.children) {
      if (!("fills" in l) || !Array.isArray(l.fills)) {
        await t.log(
          `[FILL-BOUND] Skipping child "${l.name}" - no fills property`
        );
        continue;
      }
      const o = a.children.find(
        (c) => c.name === l.name
      );
      if (!o) {
        await t.log(
          `[FILL-BOUND] No JSON data found for child "${l.name}" in instance "${e.name}"`
        );
        continue;
      }
      if (!((s = o.boundVariables) != null && s.fills)) {
        await t.log(
          `[FILL-BOUND] Child "${l.name}" in instance "${e.name}" has no fill bound variables in JSON`
        );
        continue;
      }
      await t.log(
        `[FILL-BOUND] Found fill bound variables for child "${l.name}" in instance "${e.name}"`
      );
      try {
        if (!n) {
          await t.warning(
            "[FILL-BOUND] Cannot apply fill bound variables: recognizedVariables is null"
          );
          continue;
        }
        const c = o.boundVariables.fills;
        if (!Array.isArray(c))
          continue;
        const d = [];
        for (let p = 0; p < l.fills.length && p < c.length; p++) {
          const m = l.fills[p], $ = c[p];
          if ($ && typeof $ == "object") {
            let y = null;
            if ($._varRef !== void 0) {
              const u = $._varRef;
              y = n.get(String(u)) || null;
            } else if ($.color) {
              const u = $.color;
              u._varRef !== void 0 ? y = n.get(String(u._varRef)) || null : u.type === "VARIABLE_ALIAS" && u.id && (y = await figma.variables.getVariableByIdAsync(
                u.id
              ));
            } else $.type === "VARIABLE_ALIAS" && $.id && (y = await figma.variables.getVariableByIdAsync(
              $.id
            ));
            if (y && m.type === "SOLID") {
              const u = m, b = {
                type: "SOLID",
                visible: u.visible,
                opacity: u.opacity,
                blendMode: u.blendMode,
                color: ge({}, u.color)
                // This will be overridden by the variable
              }, r = figma.variables.setBoundVariableForPaint(
                b,
                "color",
                y
              );
              d.push(r), await t.log(
                `[FILL-BOUND] ✓ Bound variable "${y.name}" (${y.id}) to fill[${p}].color on child "${l.name}"`
              );
            } else y ? (d.push(m), y ? m.type !== "SOLID" && await t.log(
              `[FILL-BOUND] Fill[${p}] on child "${l.name}" is type "${m.type}" - variable binding for non-solid fills not yet implemented`
            ) : await t.warning(
              `[FILL-BOUND] Could not resolve variable for fill[${p}] on child "${l.name}"`
            )) : d.push(m);
          } else
            d.push(m);
        }
        l.fills = d, await t.log(
          `[FILL-BOUND] ✓ Applied fill bound variables to child "${l.name}" in instance "${e.name}" (${d.length} fill(s))`
        );
      } catch (c) {
        await t.warning(
          `Error applying fill bound variables to instance child "${l.name}": ${c instanceof Error ? c.message : String(c)}`
        );
      }
    }
    await t.log(
      `[FILL-BOUND] Finished applying fill bound variables to instance "${e.name}" children`
    );
  }
}
async function Lt(e, a) {
  if (!a.children || !Array.isArray(a.children) || !e.children || e.children.length === 0)
    return;
  const n = (l, o) => {
    if ("children" in l && Array.isArray(l.children))
      for (const c of l.children) {
        if (c.name === o)
          return c;
        const d = n(c, o);
        if (d)
          return d;
      }
    return null;
  };
  for (const l of a.children) {
    if (!l || !l.name)
      continue;
    n(
      e,
      l.name
    ) || await t.warning(
      `Child "${l.name}" in JSON does not exist in instance "${e.name}" - skipping (instance override or Figma limitation)`
    );
  }
  const i = new Set(
    (a.children || []).map((l) => l == null ? void 0 : l.name).filter(Boolean)
  ), s = e.children.filter(
    (l) => !i.has(l.name)
  );
  s.length > 0 && await t.log(
    `Instance "${e.name}" has ${s.length} child(ren) not in JSON - keeping default children: ${s.map((l) => l.name).join(", ")}`
  );
}
async function Pt(e, a = "", n = null, i = null, s = null, l = null) {
  var y;
  if (e.length === 0)
    return { resolved: 0, failed: 0, errors: [] };
  await t.log(
    `=== Resolving ${e.length} deferred normal instance(s) ===`
  );
  let o = 0, c = 0;
  const d = [];
  await figma.loadAllPagesAsync();
  const p = (u, b, r = /* @__PURE__ */ new Set()) => {
    if (!u.parentPlaceholderId || r.has(u.placeholderFrameId))
      return 0;
    r.add(u.placeholderFrameId);
    const w = b.find(
      (g) => g.placeholderFrameId === u.parentPlaceholderId
    );
    return w ? 1 + p(w, b, r) : 0;
  }, m = e.map((u) => ({
    deferred: u,
    depth: p(u, e)
  }));
  if (m.sort((u, b) => b.depth - u.depth), await t.log(
    `[BOTTOM-UP] Sorted ${e.length} deferred instance(s) by depth (deepest first)`
  ), m.length > 0) {
    const u = Math.max(...m.map((b) => b.depth));
    await t.log(
      `[BOTTOM-UP] Depth range: 0 (root) to ${u} (deepest)`
    );
  }
  const $ = /* @__PURE__ */ new Set();
  for (const u of e)
    u.parentPlaceholderId && ($.add(u.placeholderFrameId), await t.log(
      `[NESTED] Pre-marked child deferred instance "${u.nodeData.name}" (placeholder: ${u.placeholderFrameId.substring(0, 8)}..., parent placeholder: ${u.parentPlaceholderId.substring(0, 8)}...)`
    ));
  await t.log(
    `[NESTED] Pre-marked ${$.size} child deferred instance(s) to skip in main loop`
  );
  for (const { deferred: u } of m) {
    if ($.has(u.placeholderFrameId)) {
      await t.log(
        `[NESTED] Skipping child deferred instance "${u.nodeData.name}" (placeholder: ${u.placeholderFrameId.substring(0, 8)}...) - will be resolved when parent is resolved`
      );
      continue;
    }
    try {
      const { placeholderFrameId: b, instanceEntry: r, nodeData: w, parentNodeId: g } = u, S = await figma.getNodeByIdAsync(
        b
      ), k = await figma.getNodeByIdAsync(
        g
      );
      if (!S || !k) {
        const v = u.parentPlaceholderId !== void 0, h = $.has(b), x = `Deferred instance "${w.name}" - could not find placeholder frame (${b.substring(0, 8)}...) or parent node (${g.substring(0, 8)}...). Was child deferred: ${v}, Was marked: ${h}`;
        await t.error(x), v && !h && await t.error(
          `[NESTED] BUG: Child deferred instance "${w.name}" was not properly marked! parentPlaceholderId: ${(y = u.parentPlaceholderId) == null ? void 0 : y.substring(0, 8)}...`
        ), d.push(x), c++;
        continue;
      }
      let D = figma.root.children.find((v) => {
        const h = v.name === r.componentPageName, x = a && v.name === `${a} ${r.componentPageName}`;
        return h || x;
      });
      if (!D) {
        const v = ye(
          r.componentPageName
        );
        D = figma.root.children.find((h) => ye(h.name) === v);
      }
      if (!D) {
        const v = a ? `"${r.componentPageName}" or "${a} ${r.componentPageName}"` : `"${r.componentPageName}"`, h = `Deferred instance "${w.name}" still cannot find referenced page (tried: ${v}, and clean name matching)`;
        await t.error(h), d.push(h), c++;
        continue;
      }
      const j = (v, h, x, I, V) => {
        if (h.length === 0) {
          let L = null;
          const X = ye(x);
          for (const z of v.children || [])
            if (z.type === "COMPONENT") {
              const W = z.name === x, q = ye(z.name) === X;
              if (W || q) {
                if (L || (L = z), W && I)
                  try {
                    const Y = z.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (Y && JSON.parse(Y).id === I)
                      return z;
                  } catch (Y) {
                  }
                else if (W)
                  return z;
              }
            } else if (z.type === "COMPONENT_SET") {
              if (V) {
                const W = z.name === V, q = ye(z.name) === ye(V);
                if (!W && !q)
                  continue;
              }
              for (const W of z.children || [])
                if (W.type === "COMPONENT") {
                  const q = W.name === x, Y = ye(W.name) === X;
                  if (q || Y) {
                    if (L || (L = W), q && I)
                      try {
                        const K = W.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (K && JSON.parse(K).id === I)
                          return W;
                      } catch (K) {
                      }
                    else if (q)
                      return W;
                  }
                }
            }
          return L;
        }
        const [J, ...Q] = h, M = ye(J);
        for (const L of v.children || []) {
          const X = L.name === J, z = ye(L.name) === M;
          if (X || z) {
            if (Q.length === 0) {
              if (L.type === "COMPONENT_SET") {
                if (V) {
                  const Y = L.name === V, K = ye(L.name) === ye(V);
                  if (!Y && !K)
                    continue;
                }
                const W = ye(x);
                let q = null;
                for (const Y of L.children || [])
                  if (Y.type === "COMPONENT") {
                    const K = Y.name === x, B = ye(Y.name) === W;
                    if (K || B) {
                      if (q || (q = Y), I)
                        try {
                          const ee = Y.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (ee && JSON.parse(ee).id === I)
                            return Y;
                        } catch (ee) {
                        }
                      if (K)
                        return Y;
                    }
                  }
                return q || null;
              }
              return null;
            }
            return Q.length > 0 ? j(
              L,
              Q,
              x,
              I,
              V
            ) : null;
          }
        }
        return null;
      };
      let E = j(
        D,
        r.path || [],
        r.componentName,
        r.componentGuid,
        r.componentSetName
      );
      if (!E && r.componentSetName) {
        const v = (h, x = 0) => {
          if (x > 5) return null;
          for (const I of h.children || []) {
            if (I.type === "COMPONENT_SET") {
              const V = I.name === r.componentSetName, J = ye(I.name) === ye(r.componentSetName || "");
              if (V || J) {
                const Q = ye(
                  r.componentName
                );
                for (const M of I.children || [])
                  if (M.type === "COMPONENT") {
                    const L = M.name === r.componentName, X = ye(M.name) === Q;
                    if (L || X) {
                      if (r.componentGuid)
                        try {
                          const z = M.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (z && JSON.parse(z).id === r.componentGuid)
                            return M;
                        } catch (z) {
                        }
                      return M;
                    }
                  }
              }
            }
            if (I.type === "FRAME" || I.type === "GROUP") {
              const V = v(I, x + 1);
              if (V) return V;
            }
          }
          return null;
        };
        E = v(D);
      }
      if (!E) {
        const v = r.path && r.path.length > 0 ? ` at path [${r.path.join(" → ")}]` : " at page root", h = [], x = (V, J = 0) => {
          if (!(J > 3) && ((V.type === "COMPONENT" || V.type === "COMPONENT_SET") && h.push(
            `${V.type}: "${V.name}"${V.type === "COMPONENT_SET" ? ` (${V.children.length} variants)` : ""}`
          ), V.children && Array.isArray(V.children)))
            for (const Q of V.children.slice(0, 10))
              x(Q, J + 1);
        };
        x(D);
        const I = `Deferred instance "${w.name}" still cannot find component "${r.componentName}" on page "${r.componentPageName}"${v}`;
        await t.error(I), d.push(I), c++;
        continue;
      }
      const T = E.createInstance();
      if (T.name = w.name || S.name.replace("[Deferred: ", "").replace("]", ""), T.x = S.x, T.y = S.y, S.width !== void 0 && S.height !== void 0 && T.resize(S.width, S.height), r.variantProperties && Object.keys(r.variantProperties).length > 0)
        try {
          const v = await T.getMainComponentAsync();
          if (v) {
            let h = null;
            const x = v.type;
            if (x === "COMPONENT_SET" ? h = v.componentPropertyDefinitions : x === "COMPONENT" && v.parent && v.parent.type === "COMPONENT_SET" ? h = v.parent.componentPropertyDefinitions : await t.warning(
              `Cannot set variant properties for resolved instance "${w.name}" - main component is not a COMPONENT_SET or variant`
            ), h) {
              const I = {};
              for (const [V, J] of Object.entries(
                r.variantProperties
              )) {
                const Q = V.split("#")[0];
                h[Q] && (I[Q] = J);
              }
              Object.keys(I).length > 0 && T.setProperties(I);
            }
          }
        } catch (v) {
          await t.warning(
            `Failed to set variant properties for resolved instance "${w.name}": ${v}`
          );
        }
      if (r.componentProperties && Object.keys(r.componentProperties).length > 0)
        try {
          const v = await T.getMainComponentAsync();
          if (v) {
            let h = null;
            const x = v.type;
            if (x === "COMPONENT_SET" ? h = v.componentPropertyDefinitions : x === "COMPONENT" && v.parent && v.parent.type === "COMPONENT_SET" ? h = v.parent.componentPropertyDefinitions : x === "COMPONENT" && (h = v.componentPropertyDefinitions), h)
              for (const [I, V] of Object.entries(
                r.componentProperties
              )) {
                const J = I.split("#")[0];
                if (h[J])
                  try {
                    T.setProperties({
                      [J]: V
                    });
                  } catch (Q) {
                    await t.warning(
                      `Failed to set component property "${J}" for resolved instance "${w.name}": ${Q}`
                    );
                  }
              }
          }
        } catch (v) {
          await t.warning(
            `Failed to set component properties for resolved instance "${w.name}": ${v}`
          );
        }
      await Ut(
        T,
        w,
        n
      ), await Lt(T, w), await t.log(
        `[NESTED] Extracting child deferred instances for placeholder "${w.name}" (${b.substring(0, 8)}...). Total deferred instances: ${e.length}`
      );
      const C = async (v) => {
        try {
          const h = await figma.getNodeByIdAsync(v);
          if (!h || !h.parent) return !1;
          let x = h.parent;
          for (; x; ) {
            if (x.id === b)
              return !0;
            if (x.type === "PAGE")
              break;
            x = x.parent;
          }
          return !1;
        } catch (h) {
          return !1;
        }
      }, F = [];
      for (const v of e)
        v.parentPlaceholderId === b ? (F.push(v), await t.log(
          `[NESTED]   - Found child by parentPlaceholderId: "${v.nodeData.name}" (placeholder: ${v.placeholderFrameId.substring(0, 8)}...)`
        )) : await C(
          v.placeholderFrameId
        ) && (F.push(v), await t.log(
          `[NESTED]   - Found child by structural check: "${v.nodeData.name}" (placeholder: ${v.placeholderFrameId.substring(0, 8)}...) - placeholder is inside current placeholder`
        ));
      await t.log(
        `[NESTED] Found ${F.length} child deferred instance(s) for placeholder "${w.name}"`
      );
      for (const v of F)
        $.add(v.placeholderFrameId);
      if ("children" in k && "insertChild" in k) {
        const v = k.children.indexOf(S);
        k.insertChild(v, T), S.remove();
      } else {
        const v = `Parent node does not support children operations for deferred instance "${w.name}"`;
        await t.error(v), d.push(v);
        continue;
      }
      const O = (v, h) => {
        const x = [];
        if (v.name === h && x.push(v), "children" in v)
          for (const I of v.children)
            x.push(...O(I, h));
        return x;
      };
      for (const v of F)
        try {
          const h = O(
            T,
            v.nodeData.name
          );
          if (h.length === 0) {
            await t.warning(
              `  Could not find matching child "${v.nodeData.name}" in resolved instance "${w.name}" - child may not exist in component`
            );
            continue;
          }
          if (h.length > 1) {
            const K = `Cannot resolve child deferred instance "${v.nodeData.name}": multiple children with same name in instance "${w.name}"`;
            await t.error(K), d.push(K), c++;
            continue;
          }
          const x = h[0], I = v.instanceEntry;
          let V = figma.root.children.find((K) => {
            const B = K.name === I.componentPageName, ee = a && K.name === `${a} ${I.componentPageName}`;
            return B || ee;
          });
          if (!V) {
            const K = ye(
              I.componentPageName
            );
            V = figma.root.children.find((B) => ye(B.name) === K);
          }
          if (!V) {
            await t.warning(
              `  Could not find referenced page for child deferred instance "${v.nodeData.name}"`
            );
            continue;
          }
          const J = (K, B, ee, ie, re) => {
            if (B.length === 0) {
              let ne = null;
              for (const se of K.children || [])
                if (se.type === "COMPONENT") {
                  const le = ye(se.name), ue = ye(ee);
                  if (le === ue)
                    if (ne || (ne = se), ie)
                      try {
                        const be = se.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (be && JSON.parse(be).id === ie)
                          return se;
                      } catch (be) {
                      }
                    else
                      return se;
                } else if (se.type === "COMPONENT_SET" && re) {
                  const le = ye(se.name), ue = ye(re);
                  if (le === ue) {
                    for (const be of se.children)
                      if (be.type === "COMPONENT") {
                        const Me = ye(
                          be.name
                        ), Fe = ye(ee);
                        if (Me === Fe)
                          if (ne || (ne = be), ie)
                            try {
                              const Ue = be.getPluginData(
                                "RecursicaPublishedMetadata"
                              );
                              if (Ue && JSON.parse(Ue).id === ie)
                                return be;
                            } catch (Ue) {
                            }
                          else
                            return be;
                      }
                  }
                }
              return ne;
            }
            let ce = K;
            for (const ne of B) {
              const se = ye(ne), le = (ce.children || []).find(
                (ue) => ye(ue.name) === se
              );
              if (!le) return null;
              ce = le;
            }
            if (ce.type === "COMPONENT") {
              const ne = ye(ce.name), se = ye(ee);
              if (ne === se)
                if (ie)
                  try {
                    const le = ce.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (le && JSON.parse(le).id === ie)
                      return ce;
                  } catch (le) {
                    return null;
                  }
                else
                  return ce;
            } else if (ce.type === "COMPONENT_SET" && re) {
              for (const ne of ce.children)
                if (ne.type === "COMPONENT") {
                  const se = ye(ne.name), le = ye(ee);
                  if (se === le)
                    if (ie)
                      try {
                        const ue = ne.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (ue && JSON.parse(ue).id === ie)
                          return ne;
                      } catch (ue) {
                        continue;
                      }
                    else
                      return ne;
                }
            }
            return null;
          };
          let Q = I.componentSetName;
          !Q && v.nodeData.name && (Q = v.nodeData.name, await t.log(
            `  [NESTED] componentSetName not provided, using child name "${Q}" as fallback`
          )), await t.log(
            `  [NESTED] Looking for component: page="${V.name}", componentSet="${Q}", component="${I.componentName}", path=[${(I.path || []).join(", ")}]`
          );
          const M = (K) => {
            const B = [];
            if (K.type === "COMPONENT_SET" && B.push(K), "children" in K && Array.isArray(K.children))
              for (const ee of K.children)
                B.push(...M(ee));
            return B;
          }, L = M(V);
          await t.log(
            `  [NESTED] Found ${L.length} component set(s) on page "${V.name}" (recursive search): ${L.map((K) => K.name).join(", ")}`
          );
          const X = V.children.map(
            (K) => `${K.type}:${K.name}`
          );
          await t.log(
            `  [NESTED] Direct children of page "${V.name}" (${X.length}): ${X.slice(0, 10).join(", ")}${X.length > 10 ? "..." : ""}`
          );
          const z = J(
            V,
            I.path || [],
            I.componentName,
            I.componentGuid,
            Q
          );
          if (!z) {
            if (await t.warning(
              `  Could not find component "${I.componentName}" (componentSet: "${Q}") for child deferred instance "${v.nodeData.name}" on page "${V.name}"`
            ), Q) {
              const K = ye(Q), B = L.filter((ee) => ye(ee.name) === K);
              if (B.length > 0) {
                await t.log(
                  `  [NESTED] Found ${B.length} component set(s) with matching clean name "${K}": ${B.map((ee) => ee.name).join(", ")}`
                );
                for (const ee of B) {
                  const ie = ee.children.filter(
                    (re) => re.type === "COMPONENT"
                  );
                  await t.log(
                    `  [NESTED] Component set "${ee.name}" has ${ie.length} variant(s): ${ie.map((re) => re.name).join(", ")}`
                  );
                }
              }
            }
            continue;
          }
          const W = z.createInstance();
          W.name = v.nodeData.name || x.name, W.x = x.x, W.y = x.y, x.width !== void 0 && x.height !== void 0 && W.resize(x.width, x.height), await Ut(
            W,
            v.nodeData,
            n
          ), await Lt(
            W,
            v.nodeData
          );
          const q = x.parent;
          if (!q || !("children" in q)) {
            const K = `Cannot replace child "${v.nodeData.name}": parent does not support children`;
            await t.error(K), d.push(K), c++;
            continue;
          }
          const Y = q.children.indexOf(x);
          q.insertChild(Y, W), x.remove(), await t.log(
            `  ✓ Resolved nested child deferred instance "${v.nodeData.name}" in "${w.name}"`
          );
        } catch (h) {
          await t.warning(
            `  Error resolving child deferred instance "${v.nodeData.name}": ${h instanceof Error ? h.message : String(h)}`
          );
        }
      await t.log(
        `  ✓ Resolved deferred instance "${w.name}" from component "${r.componentName}" on page "${r.componentPageName}"`
      ), o++;
    } catch (b) {
      const r = b instanceof Error ? b.message : String(b), w = `Failed to resolve deferred instance "${u.nodeData.name}": ${r}`;
      await t.error(w), d.push(w), c++;
    }
  }
  return await t.log(
    `=== Deferred Resolution Complete: ${o} resolved, ${c} failed ===`
  ), { resolved: o, failed: c, errors: d };
}
async function ta(e) {
  await t.log("=== Cleaning up created entities ===");
  try {
    const { pageIds: a, collectionIds: n, variableIds: i } = e;
    let s = 0;
    for (const c of i)
      try {
        const d = await figma.variables.getVariableByIdAsync(c);
        if (d) {
          const p = d.variableCollectionId;
          n.includes(p) || (d.remove(), s++);
        }
      } catch (d) {
        await t.warning(
          `Could not delete variable ${c.substring(0, 8)}...: ${d}`
        );
      }
    let l = 0;
    for (const c of n)
      try {
        const d = await figma.variables.getVariableCollectionByIdAsync(c);
        d && (d.remove(), l++);
      } catch (d) {
        await t.warning(
          `Could not delete collection ${c.substring(0, 8)}...: ${d}`
        );
      }
    await figma.loadAllPagesAsync();
    let o = 0;
    for (const c of a)
      try {
        const d = await figma.getNodeByIdAsync(c);
        d && d.type === "PAGE" && (d.remove(), o++);
      } catch (d) {
        await t.warning(
          `Could not delete page ${c.substring(0, 8)}...: ${d}`
        );
      }
    return await t.log(
      `Cleanup complete: Deleted ${o} page(s), ${l} collection(s), ${s} variable(s)`
    ), {
      type: "cleanupCreatedEntities",
      success: !0,
      error: !1,
      message: "Cleanup completed successfully",
      data: {
        deletedPages: o,
        deletedCollections: l,
        deletedVariables: s
      }
    };
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Cleanup failed: ${n}`), {
      type: "cleanupCreatedEntities",
      success: !1,
      error: !0,
      message: n,
      data: {}
    };
  }
}
const hn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cleanupCreatedEntities: ta,
  importPage: At,
  loadAndExpandJson: ht,
  loadCollectionTable: Zt,
  loadVariableTable: Qt,
  matchAndCreateVariables: ea,
  normalizeStructureTypes: yt,
  recreateNodeFromData: He,
  resolveDeferredNormalInstances: Pt,
  restoreBoundVariablesForFills: qt
}, Symbol.toStringTag, { value: "Module" }));
async function aa(e) {
  const a = [];
  for (const { fileName: n, jsonData: i } of e)
    try {
      const s = ht(i);
      if (!s.success || !s.expandedJsonData) {
        await t.warning(
          `Skipping ${n} - failed to expand JSON: ${s.error || "Unknown error"}`
        );
        continue;
      }
      const l = s.expandedJsonData, o = l.metadata;
      if (!o || !o.name || !o.guid) {
        await t.warning(
          `Skipping ${n} - missing or invalid metadata`
        );
        continue;
      }
      const c = [];
      if (l.instances) {
        const p = it.fromTable(
          l.instances
        ).getSerializedTable();
        for (const m of Object.values(p))
          m.instanceType === "normal" && m.componentPageName && (c.includes(m.componentPageName) || c.push(m.componentPageName));
      }
      a.push({
        fileName: n,
        pageName: o.name,
        pageGuid: o.guid,
        dependencies: c,
        jsonData: i
        // Store original JSON data for import
      }), await t.log(
        `  ${n}: "${o.name}" depends on: ${c.length > 0 ? c.join(", ") : "none"}`
      );
    } catch (s) {
      await t.error(
        `Error processing ${n}: ${s instanceof Error ? s.message : String(s)}`
      );
    }
  return a;
}
function na(e) {
  const a = [], n = [], i = [], s = /* @__PURE__ */ new Map();
  for (const p of e)
    s.set(p.pageName, p);
  const l = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), c = [], d = (p) => {
    if (l.has(p.pageName))
      return !1;
    if (o.has(p.pageName)) {
      const m = c.findIndex(
        ($) => $.pageName === p.pageName
      );
      if (m !== -1) {
        const $ = c.slice(m).concat([p]);
        return n.push($), !0;
      }
      return !1;
    }
    o.add(p.pageName), c.push(p);
    for (const m of p.dependencies) {
      const $ = s.get(m);
      $ && d($);
    }
    return o.delete(p.pageName), c.pop(), l.add(p.pageName), a.push(p), !1;
  };
  for (const p of e)
    l.has(p.pageName) || d(p);
  for (const p of e)
    for (const m of p.dependencies)
      s.has(m) || i.push(
        `Page "${p.pageName}" (${p.fileName}) depends on "${m}" which is not in the import set`
      );
  return { order: a, cycles: n, errors: i };
}
async function ia(e) {
  await t.log("=== Building Dependency Graph ===");
  const a = await aa(e);
  await t.log("=== Resolving Import Order ===");
  const n = na(a);
  if (n.cycles.length > 0) {
    await t.log(
      `Detected ${n.cycles.length} circular dependency cycle(s):`
    );
    for (const i of n.cycles) {
      const s = i.map((l) => `"${l.pageName}"`).join(" → ");
      await t.log(`  Cycle: ${s} → (back to start)`);
    }
    await t.log(
      "  Circular dependencies will be handled with deferred instance resolution"
    );
  }
  if (n.errors.length > 0) {
    await t.warning(
      `Found ${n.errors.length} missing dependency warning(s):`
    );
    for (const i of n.errors)
      await t.warning(`  ${i}`);
  }
  await t.log(
    `Import order determined: ${n.order.length} page(s)`
  );
  for (let i = 0; i < n.order.length; i++) {
    const s = n.order[i];
    await t.log(`  ${i + 1}. ${s.fileName} ("${s.pageName}")`);
  }
  return n;
}
async function oa(e) {
  var k, D, j, E, T, C;
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
    order: n,
    cycles: i,
    errors: s
  } = await ia(a);
  s.length > 0 && await t.warning(
    `Found ${s.length} dependency warning(s) - some dependencies may be missing`
  ), i.length > 0 && await t.log(
    `Detected ${i.length} circular dependency cycle(s) - will use deferred resolution`
  );
  const l = /* @__PURE__ */ new Map();
  if (await t.log(
    `Checking collectionChoices: ${e.collectionChoices ? "exists" : "undefined"}`
  ), e.collectionChoices) {
    await t.log("=== Pre-creating Collections ==="), await t.log(
      `Collection choices: tokens=${e.collectionChoices.tokens}, theme=${e.collectionChoices.theme}, layers=${e.collectionChoices.layers}`
    );
    const F = "recursica:collectionId", O = async (h) => {
      const x = await figma.variables.getLocalVariableCollectionsAsync(), I = new Set(x.map((Q) => Q.name));
      if (!I.has(h))
        return h;
      let V = 1, J = `${h}_${V}`;
      for (; I.has(J); )
        V++, J = `${h}_${V}`;
      return J;
    }, v = [
      { choice: e.collectionChoices.tokens, normalizedName: "Tokens" },
      { choice: e.collectionChoices.theme, normalizedName: "Theme" },
      { choice: e.collectionChoices.layers, normalizedName: "Layer" }
    ];
    for (const { choice: h, normalizedName: x } of v)
      if (h === "new") {
        await t.log(
          `Processing collection type: "${x}" (choice: "new") - will create new collection`
        );
        const I = await O(x), V = figma.variables.createVariableCollection(I);
        if (Be(x)) {
          const J = gt(x);
          J && (V.setSharedPluginData(
            "recursica",
            F,
            J
          ), await t.log(
            `  Stored fixed GUID: ${J.substring(0, 8)}...`
          ));
        }
        l.set(x, V), await t.log(
          `✓ Pre-created collection: "${I}" (normalized: "${x}", id: ${V.id.substring(0, 8)}...)`
        );
      } else
        await t.log(
          `Skipping collection type: "${x}" (choice: "existing")`
        );
    l.size > 0 && await t.log(
      `Pre-created ${l.size} collection(s) for reuse across all imports`
    );
  }
  await t.log("=== Importing Pages in Order ===");
  let o = 0, c = 0;
  const d = [...s], p = [], m = {
    pageIds: [],
    collectionIds: [],
    variableIds: []
  }, $ = [];
  if (l.size > 0)
    for (const F of l.values())
      m.collectionIds.push(F.id), await t.log(
        `Tracking pre-created collection: "${F.name}" (${F.id.substring(0, 8)}...)`
      );
  const y = e.mainFileName;
  for (let F = 0; F < n.length; F++) {
    const O = n[F], v = y ? O.fileName === y : F === n.length - 1;
    await t.log(
      `[${F + 1}/${n.length}] Importing ${O.fileName} ("${O.pageName}")${v ? " [MAIN]" : " [DEPENDENCY]"}...`
    );
    try {
      const h = F === 0, x = await At({
        jsonData: O.jsonData,
        isMainPage: v,
        clearConsole: h,
        collectionChoices: e.collectionChoices,
        alwaysCreateCopy: !0,
        // Wizard imports always create copies (no prompts)
        skipUniqueNaming: (k = e.skipUniqueNaming) != null ? k : !1,
        constructionIcon: e.constructionIcon || "",
        preCreatedCollections: l
        // Pass pre-created collections for reuse
      });
      if (x.success) {
        if (o++, (D = x.data) != null && D.deferredInstances) {
          const I = x.data.deferredInstances;
          Array.isArray(I) && (await t.log(
            `  [DEBUG] Collected ${I.length} deferred instance(s) from ${O.fileName}`
          ), p.push(...I));
        } else
          await t.log(
            `  [DEBUG] No deferred instances in response for ${O.fileName}`
          );
        if ((j = x.data) != null && j.createdEntities) {
          const I = x.data.createdEntities;
          I.pageIds && m.pageIds.push(...I.pageIds), I.collectionIds && m.collectionIds.push(...I.collectionIds), I.variableIds && m.variableIds.push(...I.variableIds);
          const V = ((E = I.pageIds) == null ? void 0 : E[0]) || ((T = x.data) == null ? void 0 : T.pageId);
          (C = x.data) != null && C.pageName && V && $.push({
            name: x.data.pageName,
            pageId: V
          });
        }
      } else
        c++, d.push(
          `Failed to import ${O.fileName}: ${x.message || "Unknown error"}`
        );
    } catch (h) {
      c++;
      const x = h instanceof Error ? h.message : String(h);
      d.push(`Failed to import ${O.fileName}: ${x}`);
    }
  }
  let u = 0;
  if (p.length > 0) {
    await t.log(
      `=== Resolving ${p.length} Deferred Instance(s) ===`
    );
    try {
      await t.log(
        "  Rebuilding variable and collection tables from imported JSON files..."
      );
      const {
        loadAndExpandJson: F,
        loadCollectionTable: O,
        loadVariableTable: v,
        matchAndCreateVariables: h
      } = await Promise.resolve().then(() => hn), x = [], I = [];
      for (const X of n)
        try {
          const z = F(X.jsonData);
          if (z.success && z.expandedJsonData) {
            const W = z.expandedJsonData, q = O(W);
            q.success && q.collectionTable && I.push(q.collectionTable);
            const Y = v(W);
            Y.success && Y.variableTable && x.push(Y.variableTable);
          }
        } catch (z) {
          await t.warning(
            `  Could not load tables from ${X.fileName}: ${z}`
          );
        }
      let V = null, J = null;
      x.length > 0 && (V = x[x.length - 1], await t.log(
        `  Using variable table with ${V.getSize()} variable(s)`
      )), I.length > 0 && (J = I[I.length - 1], await t.log(
        `  Using collection table with ${J.getSize()} collection(s)`
      ));
      const Q = /* @__PURE__ */ new Map();
      if (J) {
        const X = await figma.variables.getLocalVariableCollectionsAsync(), z = /* @__PURE__ */ new Map();
        for (const q of X) {
          const Y = Ae(q.name);
          z.set(Y, q);
        }
        const W = J.getTable();
        for (const [q, Y] of Object.entries(
          W
        )) {
          const K = Y, B = Ae(
            K.collectionName
          ), ee = z.get(B);
          ee ? (Q.set(q, ee), await t.log(
            `  Matched collection table index ${q} ("${K.collectionName}") to collection "${ee.name}"`
          )) : await t.warning(
            `  Could not find collection for table index ${q} ("${K.collectionName}")`
          );
        }
      }
      let M = /* @__PURE__ */ new Map();
      if (V && J) {
        const { recognizedVariables: X } = await h(
          V,
          J,
          Q,
          []
          // newlyCreatedCollections - empty since they're already created
        );
        M = X, await t.log(
          `  Built recognizedVariables map with ${M.size} variable(s)`
        );
      } else
        await t.warning(
          "  Could not build recognizedVariables map - variable or collection table missing"
        );
      const L = await Pt(
        p,
        e.constructionIcon || "",
        M,
        V || null,
        J || null,
        Q
      );
      await t.log(
        `  Resolved: ${L.resolved}, Failed: ${L.failed}`
      ), L.errors.length > 0 && (d.push(...L.errors), u = L.failed);
    } catch (F) {
      const O = `Failed to resolve deferred instances: ${F instanceof Error ? F.message : String(F)}`;
      d.push(O), u = p.length;
    }
  }
  const b = Array.from(
    new Set(m.collectionIds)
  ), r = Array.from(
    new Set(m.variableIds)
  ), w = Array.from(new Set(m.pageIds));
  if (await t.log("=== Import Summary ==="), await t.log(
    `  Imported: ${o}, Failed: ${c}, Deferred instances: ${p.length}, Deferred resolution failed: ${u}`
  ), await t.log(
    `  Collections in allCreatedEntityIds: ${m.collectionIds.length}, Unique: ${b.length}`
  ), b.length > 0) {
    await t.log(
      `  Created ${b.length} collection(s)`
    );
    for (const F of b)
      try {
        const O = await figma.variables.getVariableCollectionByIdAsync(F);
        O && await t.log(
          `    - "${O.name}" (${F.substring(0, 8)}...)`
        );
      } catch (O) {
      }
  }
  const g = c === 0 && u === 0, S = g ? `Successfully imported ${o} page(s)${p.length > 0 ? ` (${p.length} deferred instance(s) resolved)` : ""}` : `Import completed with ${c} failure(s). ${d.join("; ")}`;
  return {
    type: "importPagesInOrder",
    success: g,
    error: !g,
    message: S,
    data: {
      imported: o,
      failed: c,
      deferred: p.length,
      errors: d,
      importedPages: $,
      createdEntities: {
        pageIds: w,
        collectionIds: b,
        variableIds: r
      }
    }
  };
}
async function yn(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children;
    console.log("Found " + a.length + " pages in the document");
    const n = 11, i = a[n];
    if (!i)
      return {
        type: "quickCopy",
        success: !1,
        error: !0,
        message: "No page found at index 11",
        data: {}
      };
    const s = await ut(
      i,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + i.name + " (index: " + n + ")"
    );
    const l = JSON.stringify(s, null, 2), o = JSON.parse(l), c = "Copy - " + o.name, d = figma.createPage();
    if (d.name = c, figma.root.appendChild(d), o.children && o.children.length > 0) {
      let $ = function(u) {
        u.forEach((b) => {
          const r = (b.x || 0) + (b.width || 0);
          r > y && (y = r), b.children && b.children.length > 0 && $(b.children);
        });
      };
      console.log(
        "Recreating " + o.children.length + " top-level children..."
      );
      let y = 0;
      $(o.children), console.log("Original content rightmost edge: " + y);
      for (const u of o.children)
        await He(u, d, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const p = pt(o);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: o.name,
        newPageName: c,
        totalNodes: p
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
async function wn(e) {
  try {
    const a = e.accessToken, n = e.selectedRepo;
    return a ? (await figma.clientStorage.setAsync("accessToken", a), n && await figma.clientStorage.setAsync("selectedRepo", n), e.hasWriteAccess !== void 0 && await figma.clientStorage.setAsync("hasWriteAccess", e.hasWriteAccess), {
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
async function bn(e) {
  try {
    const a = await figma.clientStorage.getAsync("accessToken"), n = await figma.clientStorage.getAsync("selectedRepo"), i = await figma.clientStorage.getAsync("hasWriteAccess");
    return {
      type: "loadAuthData",
      success: !0,
      error: !1,
      message: "Auth data loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        accessToken: a || void 0,
        selectedRepo: n || void 0,
        hasWriteAccess: i != null ? i : void 0
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
async function $n(e) {
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
async function vn(e) {
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
async function Nn(e) {
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
async function Sn(e) {
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
async function Cn(e) {
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
function Ee(e, a = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: a
  };
}
function Oe(e, a, n = {}) {
  const i = a instanceof Error ? a.message : a;
  return {
    type: e,
    success: !1,
    error: !0,
    message: i,
    data: n
  };
}
const ra = "RecursicaPublishedMetadata";
async function En(e) {
  try {
    const a = figma.currentPage;
    await figma.loadAllPagesAsync();
    const i = figma.root.children.findIndex(
      (c) => c.id === a.id
    ), s = a.getPluginData(ra);
    if (!s) {
      const p = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: dt(a.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: i
      };
      return Ee("getComponentMetadata", p);
    }
    const o = {
      componentMetadata: JSON.parse(s),
      currentPageIndex: i
    };
    return Ee("getComponentMetadata", o);
  } catch (a) {
    return console.error("Error getting component metadata:", a), Oe(
      "getComponentMetadata",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function In(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children, n = [];
    for (const s of a) {
      if (s.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${s.name} (type: ${s.type})`
        );
        continue;
      }
      const l = s, o = l.getPluginData(ra);
      if (o)
        try {
          const c = JSON.parse(o);
          n.push(c);
        } catch (c) {
          console.warn(
            `Failed to parse metadata for page "${l.name}":`,
            c
          );
          const p = {
            _ver: 1,
            id: "",
            name: dt(l.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          n.push(p);
        }
      else {
        const d = {
          _ver: 1,
          id: "",
          name: dt(l.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        n.push(d);
      }
    }
    return Ee("getAllComponents", {
      components: n
    });
  } catch (a) {
    return console.error("Error getting all components:", a), Oe(
      "getAllComponents",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function An(e) {
  try {
    const a = e.requestId, n = e.action;
    return !a || !n ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (Qe.handleResponse({ requestId: a, action: n }), {
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
async function Pn(e) {
  try {
    const { pageId: a } = e;
    await figma.loadAllPagesAsync();
    const n = await figma.getNodeByIdAsync(a);
    return !n || n.type !== "PAGE" ? {
      type: "switchToPage",
      success: !1,
      error: !0,
      message: `Page with ID ${a.substring(0, 8)}... not found`,
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
const Pe = "RecursicaPrimaryImport", ve = "RecursicaUnderReview", sa = "---", la = "---", Te = "RecursicaImportDivider", Xe = "start", Ye = "end", ke = "⚠️";
async function Tn(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children;
    for (const i of a) {
      if (i.type !== "PAGE")
        continue;
      const s = i.getPluginData(Pe);
      if (s)
        try {
          const o = JSON.parse(s), c = {
            exists: !0,
            pageId: i.id,
            metadata: o
          };
          return Ee(
            "checkForExistingPrimaryImport",
            c
          );
        } catch (o) {
          await t.warning(
            `Failed to parse primary import metadata on page "${i.name}": ${o}`
          );
          continue;
        }
      if (i.getPluginData(ve) === "true") {
        const o = i.getPluginData(Pe);
        if (o)
          try {
            const c = JSON.parse(o), d = {
              exists: !0,
              pageId: i.id,
              metadata: c
            };
            return Ee(
              "checkForExistingPrimaryImport",
              d
            );
          } catch (c) {
          }
        else
          await t.warning(
            `Found page "${i.name}" marked as under review but missing primary import metadata`
          );
      }
    }
    return Ee("checkForExistingPrimaryImport", {
      exists: !1
    });
  } catch (a) {
    return console.error("Error checking for existing primary import:", a), Oe(
      "checkForExistingPrimaryImport",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function On(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children.find(
      (c) => c.type === "PAGE" && c.getPluginData(Te) === Xe
    ), n = figma.root.children.find(
      (c) => c.type === "PAGE" && c.getPluginData(Te) === Ye
    );
    if (a && n) {
      const c = {
        startDividerId: a.id,
        endDividerId: n.id
      };
      return Ee("createImportDividers", c);
    }
    const i = figma.createPage();
    i.name = sa, i.setPluginData(Te, Xe), i.setPluginData(ve, "true");
    const s = figma.createPage();
    s.name = la, s.setPluginData(Te, Ye), s.setPluginData(ve, "true");
    const l = figma.root.children.indexOf(i);
    figma.root.insertChild(l + 1, s), await t.log("Created import dividers");
    const o = {
      startDividerId: i.id,
      endDividerId: s.id
    };
    return Ee("createImportDividers", o);
  } catch (a) {
    return console.error("Error creating import dividers:", a), Oe(
      "createImportDividers",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function xn(e) {
  var a, n, i, s, l, o, c, d, p, m, $, y;
  try {
    await t.log("=== Starting Single Component Import ==="), await t.log("Creating start divider..."), await figma.loadAllPagesAsync();
    let u = figma.root.children.find(
      (M) => M.type === "PAGE" && M.getPluginData(Te) === Xe
    );
    u || (u = figma.createPage(), u.name = sa, u.setPluginData(Te, Xe), u.setPluginData(ve, "true"), await t.log("Created start divider"));
    const r = [
      ...e.dependencies.filter(
        (M) => !M.useExisting
      ).map((M) => ({
        fileName: `${M.name}.json`,
        jsonData: M.jsonData
      })),
      {
        fileName: `${e.mainComponent.name}.json`,
        jsonData: e.mainComponent.jsonData
      }
    ];
    await t.log(
      `Importing ${r.length} file(s) in dependency order...`
    );
    const w = await oa({
      jsonFiles: r,
      mainFileName: `${e.mainComponent.name}.json`,
      collectionChoices: {
        tokens: e.wizardSelections.tokensCollection,
        theme: e.wizardSelections.themeCollection,
        layers: e.wizardSelections.layersCollection
      },
      skipUniqueNaming: !0,
      // Don't add _<number> suffix for wizard imports
      constructionIcon: ke
      // Add construction icon to page names
    });
    if (!w.success)
      throw new Error(
        w.message || "Failed to import pages in order"
      );
    await figma.loadAllPagesAsync();
    const g = figma.root.children;
    let S = g.find(
      (M) => M.type === "PAGE" && M.getPluginData(Te) === Ye
    );
    if (!S) {
      S = figma.createPage(), S.name = la, S.setPluginData(
        Te,
        Ye
      ), S.setPluginData(ve, "true");
      let M = g.length;
      for (let L = g.length - 1; L >= 0; L--) {
        const X = g[L];
        if (X.type === "PAGE" && X.getPluginData(Te) !== Xe && X.getPluginData(Te) !== Ye) {
          M = L + 1;
          break;
        }
      }
      figma.root.insertChild(M, S), await t.log("Created end divider");
    }
    await t.log(
      `Import result data structure: ${JSON.stringify(Object.keys(w.data || {}))}`
    );
    const k = w.data;
    if (await t.log(
      `Import result has createdEntities: ${!!(k != null && k.createdEntities)}`
    ), k != null && k.createdEntities ? (await t.log(
      `  Collection IDs: ${((a = k.createdEntities.collectionIds) == null ? void 0 : a.length) || 0}`
    ), (n = k.createdEntities.collectionIds) != null && n.length && await t.log(
      `  Collection IDs: ${k.createdEntities.collectionIds.map((M) => M.substring(0, 8) + "...").join(", ")}`
    ), await t.log(
      `  Variable IDs: ${((i = k.createdEntities.variableIds) == null ? void 0 : i.length) || 0}`
    ), await t.log(
      `  Page IDs: ${((s = k.createdEntities.pageIds) == null ? void 0 : s.length) || 0}`
    )) : await t.warning(
      "Import result does not have createdEntities - cleanup may not work correctly"
    ), !(k != null && k.importedPages) || k.importedPages.length === 0)
      throw new Error("No pages were imported");
    const D = "RecursicaPublishedMetadata", j = e.mainComponent.guid;
    await t.log(
      `Looking for main page by GUID: ${j.substring(0, 8)}...`
    );
    let E, T = null;
    for (const M of k.importedPages)
      try {
        const L = await figma.getNodeByIdAsync(
          M.pageId
        );
        if (L && L.type === "PAGE") {
          const X = L.getPluginData(D);
          if (X)
            try {
              if (JSON.parse(X).id === j) {
                E = M.pageId, T = L, await t.log(
                  `Found main page by GUID: "${L.name}" (ID: ${M.pageId.substring(0, 12)}...)`
                );
                break;
              }
            } catch (z) {
            }
        }
      } catch (L) {
        await t.warning(
          `Error checking page ${M.pageId}: ${L}`
        );
      }
    if (!E) {
      await t.log(
        "Main page not found in importedPages list, searching all pages by GUID..."
      ), await figma.loadAllPagesAsync();
      const M = figma.root.children;
      for (const L of M)
        if (L.type === "PAGE") {
          const X = L.getPluginData(D);
          if (X)
            try {
              if (JSON.parse(X).id === j) {
                E = L.id, T = L, await t.log(
                  `Found main page by GUID in all pages: "${L.name}" (ID: ${L.id.substring(0, 12)}...)`
                );
                break;
              }
            } catch (z) {
            }
        }
    }
    if (!E || !T) {
      await t.error(
        `Failed to find imported main page by GUID: ${j.substring(0, 8)}...`
      ), await t.log("Imported pages were:");
      for (const M of k.importedPages)
        await t.log(
          `  - "${M.name}" (ID: ${M.pageId.substring(0, 12)}...)`
        );
      throw new Error("Failed to find imported main page ID");
    }
    if (!T || T.type !== "PAGE")
      throw new Error("Failed to get main page node");
    for (const M of k.importedPages)
      try {
        const L = await figma.getNodeByIdAsync(
          M.pageId
        );
        if (L && L.type === "PAGE") {
          L.setPluginData(ve, "true");
          const X = L.name.replace(/_\d+$/, "");
          if (!X.startsWith(ke))
            L.name = `${ke} ${X}`;
          else {
            const z = X.replace(ke, "").trim();
            L.name = `${ke} ${z}`;
          }
        }
      } catch (L) {
        await t.warning(
          `Failed to mark page ${M.pageId} as under review: ${L}`
        );
      }
    await figma.loadAllPagesAsync();
    const C = figma.root.children, F = C.find(
      (M) => M.type === "PAGE" && (M.name === "REMOTES" || M.name === `${ke} REMOTES`)
    );
    F && (F.setPluginData(ve, "true"), F.name.startsWith(ke) || (F.name = `${ke} REMOTES`), await t.log(
      "Marked REMOTES page as under review and ensured construction icon"
    ));
    const O = C.find(
      (M) => M.type === "PAGE" && M.getPluginData(Te) === Xe
    ), v = C.find(
      (M) => M.type === "PAGE" && M.getPluginData(Te) === Ye
    );
    if (O && v) {
      const M = C.indexOf(O), L = C.indexOf(v);
      for (let X = M + 1; X < L; X++) {
        const z = C[X];
        z.type === "PAGE" && z.getPluginData(ve) !== "true" && (z.setPluginData(ve, "true"), await t.log(
          `Marked page "${z.name}" as under review (found between dividers)`
        ));
      }
    }
    const h = [], x = [];
    if (await t.log(
      `[EXTRACTION] Starting collection extraction. Collection IDs in result: ${((o = (l = k == null ? void 0 : k.createdEntities) == null ? void 0 : l.collectionIds) == null ? void 0 : o.length) || 0}`
    ), (c = k == null ? void 0 : k.createdEntities) != null && c.collectionIds) {
      await t.log(
        `[EXTRACTION] Collection IDs to process: ${k.createdEntities.collectionIds.map((M) => M.substring(0, 8) + "...").join(", ")}`
      );
      for (const M of k.createdEntities.collectionIds)
        try {
          const L = await figma.variables.getVariableCollectionByIdAsync(M);
          L ? (h.push({
            collectionId: L.id,
            collectionName: L.name
          }), await t.log(
            `[EXTRACTION] ✓ Extracted collection: "${L.name}" (${M.substring(0, 8)}...)`
          )) : (h.push({
            collectionId: M,
            collectionName: `Unknown (${M.substring(0, 8)}...)`
          }), await t.warning(
            `[EXTRACTION] Collection ${M.substring(0, 8)}... not found - will still track for cleanup`
          ));
        } catch (L) {
          h.push({
            collectionId: M,
            collectionName: `Unknown (${M.substring(0, 8)}...)`
          }), await t.warning(
            `[EXTRACTION] Failed to get collection ${M.substring(0, 8)}...: ${L} - will still track for cleanup`
          );
        }
    } else
      await t.warning(
        "[EXTRACTION] No collectionIds found in importResultData.createdEntities"
      );
    if (await t.log(
      `[EXTRACTION] Total collections extracted: ${h.length}`
    ), h.length > 0 && await t.log(
      `[EXTRACTION] Extracted collections: ${h.map((M) => `"${M.collectionName}" (${M.collectionId.substring(0, 8)}...)`).join(", ")}`
    ), (d = k == null ? void 0 : k.createdEntities) != null && d.variableIds) {
      await t.log(
        `[EXTRACTION] Processing ${k.createdEntities.variableIds.length} variable ID(s)...`
      );
      for (const M of k.createdEntities.variableIds)
        try {
          const L = await figma.variables.getVariableByIdAsync(M);
          if (L && L.resolvedType) {
            const X = await figma.variables.getVariableCollectionByIdAsync(
              L.variableCollectionId
            );
            X ? x.push({
              variableId: L.id,
              variableName: L.name,
              collectionId: L.variableCollectionId,
              collectionName: X.name
            }) : x.push({
              variableId: L.id,
              variableName: L.name,
              collectionId: L.variableCollectionId,
              collectionName: `Unknown (${L.variableCollectionId.substring(0, 8)}...)`
            });
          }
        } catch (L) {
          await t.warning(
            `Failed to get variable ${M}: ${L}`
          );
        }
      await t.log(
        `[EXTRACTION] Total variables extracted: ${x.length}`
      );
    } else
      await t.warning(
        "[EXTRACTION] No variableIds found in importResultData.createdEntities"
      );
    if (h.length === 0 && ((m = (p = k == null ? void 0 : k.createdEntities) == null ? void 0 : p.collectionIds) != null && m.length)) {
      await t.warning(
        "[EXTRACTION] Collection extraction failed, but IDs are available - creating fallback entries"
      );
      for (const M of k.createdEntities.collectionIds)
        h.push({
          collectionId: M,
          collectionName: `Unknown (${M.substring(0, 8)}...)`
        });
    }
    if (x.length === 0 && ((y = ($ = k == null ? void 0 : k.createdEntities) == null ? void 0 : $.variableIds) != null && y.length)) {
      await t.warning(
        "[EXTRACTION] Variable extraction failed, but IDs are available - creating fallback entries"
      );
      for (const M of k.createdEntities.variableIds)
        x.push({
          variableId: M,
          variableName: `Unknown (${M.substring(0, 8)}...)`,
          collectionId: "unknown",
          collectionName: "Unknown"
        });
    }
    const I = {
      componentGuid: e.mainComponent.guid,
      componentVersion: e.mainComponent.version,
      componentName: e.mainComponent.name,
      importDate: (/* @__PURE__ */ new Date()).toISOString(),
      wizardSelections: e.wizardSelections,
      variableSummary: e.variableSummary,
      createdCollections: h,
      createdVariables: x,
      importError: void 0
      // No error yet
    };
    await t.log(
      `Storing metadata with ${h.length} collection(s) and ${x.length} variable(s)`
    ), T.setPluginData(
      Pe,
      JSON.stringify(I)
    ), T.setPluginData(ve, "true"), await t.log(
      "Stored primary import metadata on main page and marked as under review"
    );
    const V = [];
    k.importedPages && V.push(
      ...k.importedPages.map((M) => M.pageId)
    ), await t.log("=== Single Component Import Complete ==="), I.importError = void 0, await t.log(
      `[METADATA] About to store metadata with ${h.length} collection(s) and ${x.length} variable(s)`
    ), h.length > 0 && await t.log(
      `[METADATA] Collections to store: ${h.map((M) => `"${M.collectionName}" (${M.collectionId.substring(0, 8)}...)`).join(", ")}`
    ), T.setPluginData(
      Pe,
      JSON.stringify(I)
    ), await t.log(
      `[METADATA] Stored metadata: ${h.length} collection(s), ${x.length} variable(s)`
    );
    const J = T.getPluginData(Pe);
    if (J)
      try {
        const M = JSON.parse(J);
        await t.log(
          `[METADATA] Verification: Stored metadata has ${M.createdCollections.length} collection(s) and ${M.createdVariables.length} variable(s)`
        );
      } catch (M) {
        await t.warning(
          "[METADATA] Failed to verify stored metadata"
        );
      }
    const Q = {
      success: !0,
      mainPageId: T.id,
      importedPageIds: V,
      createdCollections: h,
      createdVariables: x
    };
    return Ee("importSingleComponentWithWizard", Q);
  } catch (u) {
    const b = u instanceof Error ? u.message : "Unknown error occurred";
    await t.error(`Import failed: ${b}`);
    try {
      await figma.loadAllPagesAsync();
      const r = figma.root.children;
      let w = null;
      for (const g of r) {
        if (g.type !== "PAGE") continue;
        const S = g.getPluginData(Pe);
        if (S)
          try {
            if (JSON.parse(S).componentGuid === e.mainComponent.guid) {
              w = g;
              break;
            }
          } catch (k) {
          }
      }
      if (w) {
        const g = w.getPluginData(Pe);
        if (g)
          try {
            const S = JSON.parse(g);
            await t.log(
              `[CATCH] Found existing metadata with ${S.createdCollections.length} collection(s) and ${S.createdVariables.length} variable(s)`
            ), S.importError = b, w.setPluginData(
              Pe,
              JSON.stringify(S)
            ), await t.log(
              `[CATCH] Updated existing metadata with error. Collections: ${S.createdCollections.length}, Variables: ${S.createdVariables.length}`
            );
          } catch (S) {
            await t.warning(
              `[CATCH] Failed to update metadata: ${S}`
            );
          }
      } else {
        await t.log(
          "No existing metadata found, attempting to collect created entities for cleanup..."
        );
        const g = [];
        for (const D of r) {
          if (D.type !== "PAGE") continue;
          D.getPluginData(ve) === "true" && g.push(D);
        }
        const S = [];
        if (e.wizardSelections) {
          const D = await figma.variables.getLocalVariableCollectionsAsync(), j = [
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
          for (const { choice: E, normalizedName: T } of j)
            if (E === "new") {
              const C = D.filter((F) => Ae(F.name) === T);
              if (C.length > 0) {
                const F = C[0];
                S.push({
                  collectionId: F.id,
                  collectionName: F.name
                }), await t.log(
                  `Found created collection: "${F.name}" (${F.id.substring(0, 8)}...)`
                );
              }
            }
        }
        const k = [];
        if (g.length > 0) {
          const D = g[0], j = {
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
            createdCollections: S,
            createdVariables: k,
            importError: b
          };
          D.setPluginData(
            Pe,
            JSON.stringify(j)
          ), await t.log(
            `Created fallback metadata with ${S.length} collection(s) and error information`
          );
        }
      }
    } catch (r) {
      await t.warning(
        `Failed to store error metadata: ${r instanceof Error ? r.message : String(r)}`
      );
    }
    return Oe(
      "importSingleComponentWithWizard",
      u instanceof Error ? u : new Error(String(u))
    );
  }
}
async function ca(e) {
  try {
    await t.log("=== Starting Import Group Deletion ==="), await figma.loadAllPagesAsync();
    const a = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!a || a.type !== "PAGE")
      throw new Error("Main page not found");
    const n = a.getPluginData(Pe);
    if (!n)
      throw new Error("Primary import metadata not found on page");
    const i = JSON.parse(n);
    await t.log(
      `Found metadata: ${i.createdCollections.length} collection(s), ${i.createdVariables.length} variable(s) to delete`
    ), await figma.loadAllPagesAsync();
    const s = figma.root.children, l = [];
    for (const y of s) {
      if (y.type !== "PAGE")
        continue;
      y.getPluginData(ve) === "true" && (l.push(y), await t.log(
        `Found page to delete: "${y.name}" (under review)`
      ));
    }
    await t.log(
      `Deleting ${i.createdVariables.length} variable(s) from existing collections...`
    );
    let o = 0;
    for (const y of i.createdVariables)
      try {
        const u = await figma.variables.getVariableByIdAsync(
          y.variableId
        );
        u ? (u.remove(), o++, await t.log(
          `Deleted variable: ${y.variableName} from collection ${y.collectionName}`
        )) : await t.warning(
          `Variable ${y.variableName} (${y.variableId}) not found - may have already been deleted`
        );
      } catch (u) {
        await t.warning(
          `Failed to delete variable ${y.variableName}: ${u instanceof Error ? u.message : String(u)}`
        );
      }
    await t.log(
      `Deleting ${i.createdCollections.length} collection(s)...`
    );
    let c = 0;
    for (const y of i.createdCollections)
      try {
        const u = await figma.variables.getVariableCollectionByIdAsync(
          y.collectionId
        );
        u ? (u.remove(), c++, await t.log(
          `Deleted collection: ${y.collectionName} (${y.collectionId})`
        )) : await t.warning(
          `Collection ${y.collectionName} (${y.collectionId}) not found - may have already been deleted`
        );
      } catch (u) {
        await t.warning(
          `Failed to delete collection ${y.collectionName}: ${u instanceof Error ? u.message : String(u)}`
        );
      }
    const d = l.map((y) => ({
      page: y,
      name: y.name,
      id: y.id
    })), p = figma.currentPage;
    if (d.some(
      (y) => y.id === p.id
    )) {
      await figma.loadAllPagesAsync();
      const u = figma.root.children.find(
        (b) => b.type === "PAGE" && !d.some((r) => r.id === b.id)
      );
      u ? (await figma.setCurrentPageAsync(u), await t.log(
        `Switched away from page "${p.name}" before deletion`
      )) : await t.warning(
        "No safe page to switch to - all pages are being deleted"
      );
    }
    for (const { page: y, name: u } of d)
      try {
        let b = !1;
        try {
          await figma.loadAllPagesAsync(), b = figma.root.children.some((w) => w.id === y.id);
        } catch (r) {
          b = !1;
        }
        if (!b) {
          await t.log(`Page "${u}" already deleted, skipping`);
          continue;
        }
        if (figma.currentPage.id === y.id) {
          await figma.loadAllPagesAsync();
          const w = figma.root.children.find(
            (g) => g.type === "PAGE" && g.id !== y.id && !d.some((S) => S.id === g.id)
          );
          w && await figma.setCurrentPageAsync(w);
        }
        y.remove(), await t.log(`Deleted page: "${u}"`);
      } catch (b) {
        await t.warning(
          `Failed to delete page "${u}": ${b instanceof Error ? b.message : String(b)}`
        );
      }
    await t.log("=== Import Group Deletion Complete ===");
    const $ = {
      success: !0,
      deletedPages: l.length,
      deletedCollections: c,
      deletedVariables: o
    };
    return Ee("deleteImportGroup", $);
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Delete failed: ${n}`), Oe(
      "deleteImportGroup",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function Vn(e) {
  try {
    await t.log("=== Cleaning up failed import ==="), await figma.loadAllPagesAsync();
    const a = figma.root.children, n = "RecursicaPublishedMetadata", i = "RecursicaCreatedEntities";
    let s = !1;
    for (const b of a) {
      if (b.type !== "PAGE")
        continue;
      if (b.getPluginData(i)) {
        s = !0;
        break;
      }
    }
    if (s)
      await t.log(
        "Found pages with RecursicaCreatedEntities, using new cleanup logic"
      );
    else {
      let b = null;
      for (const r of a) {
        if (r.type !== "PAGE")
          continue;
        if (r.getPluginData(Pe)) {
          b = r;
          break;
        }
      }
      if (b)
        return await t.log(
          "Found page with PRIMARY_IMPORT_KEY (old system), using deleteImportGroup"
        ), await ca({ pageId: b.id });
      await t.log(
        "No primary metadata found, looking for pages with UNDER_REVIEW_KEY or PAGE_METADATA_KEY"
      );
    }
    const l = [], o = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set();
    await t.log(
      `Scanning ${a.length} page(s) for created entities...`
    );
    for (const b of a) {
      if (b.type !== "PAGE")
        continue;
      const r = b.getPluginData(i);
      if (r)
        try {
          const w = JSON.parse(r);
          if (w.collectionIds) {
            for (const g of w.collectionIds)
              o.add(g);
            await t.log(
              `  Found ${w.collectionIds.length} collection ID(s) on page "${b.name}"`
            );
          }
          if (w.variableIds) {
            for (const g of w.variableIds)
              c.add(g);
            await t.log(
              `  Found ${w.variableIds.length} variable ID(s) on page "${b.name}"`
            );
          }
        } catch (w) {
          await t.warning(
            `  Failed to parse created entities from page "${b.name}": ${w}`
          );
        }
    }
    await t.log(
      `Scanning ${a.length} page(s) for pages to delete...`
    );
    for (const b of a) {
      if (b.type !== "PAGE")
        continue;
      const r = b.getPluginData(ve), w = b.getPluginData(n), g = b.getPluginData(i);
      if (await t.log(
        `  Checking page "${b.name}": underReview=${r === "true"}, hasMetadata=${!!w}, hasCreatedEntities=${!!g}`
      ), r === "true" || w)
        if (l.push({ id: b.id, name: b.name }), await t.log(
          `Found page to delete: "${b.name}" (underReview: ${r === "true"}, hasMetadata: ${!!w})`
        ), g)
          try {
            const S = JSON.parse(g);
            if (S.pageIds) {
              for (const k of S.pageIds)
                if (!l.some((D) => D.id === k)) {
                  const D = await figma.getNodeByIdAsync(
                    k
                  );
                  if (D && D.type === "PAGE") {
                    l.push({
                      id: D.id,
                      name: D.name
                    }), await t.log(
                      `  Added additional page from createdEntities.pageIds: "${D.name}"`
                    );
                    const j = D.getPluginData(i);
                    if (j)
                      try {
                        const E = JSON.parse(
                          j
                        );
                        if (E.collectionIds) {
                          for (const T of E.collectionIds)
                            o.add(T);
                          await t.log(
                            `  Extracted ${E.collectionIds.length} collection ID(s) from additional page "${D.name}"`
                          );
                        }
                        if (E.variableIds) {
                          for (const T of E.variableIds)
                            c.add(T);
                          await t.log(
                            `  Extracted ${E.variableIds.length} variable ID(s) from additional page "${D.name}"`
                          );
                        }
                      } catch (E) {
                        await t.warning(
                          `  Failed to parse created entities from additional page "${D.name}": ${E}`
                        );
                      }
                  }
                }
            }
            if (S.collectionIds) {
              for (const k of S.collectionIds)
                o.add(k);
              await t.log(
                `  Extracted ${S.collectionIds.length} collection ID(s) from page "${b.name}": ${S.collectionIds.map((k) => k.substring(0, 8) + "...").join(", ")}`
              );
            } else
              await t.log(
                `  No collectionIds found in createdEntities for page "${b.name}"`
              );
            if (S.variableIds) {
              for (const k of S.variableIds)
                c.add(k);
              await t.log(
                `  Extracted ${S.variableIds.length} variable ID(s) from page "${b.name}": ${S.variableIds.map((k) => k.substring(0, 8) + "...").join(", ")}`
              );
            } else
              await t.log(
                `  No variableIds found in createdEntities for page "${b.name}"`
              );
          } catch (S) {
            await t.warning(
              `  Failed to parse created entities from page "${b.name}": ${S}`
            ), await t.warning(
              `  Created entities string: ${g.substring(0, 200)}...`
            );
          }
        else
          await t.log(
            `  No created entities data found on page "${b.name}"`
          );
    }
    await t.log(
      `Cleanup summary: Found ${l.length} page(s) to delete, ${o.size} collection(s) to delete, ${c.size} variable(s) to delete`
    );
    const d = figma.currentPage;
    if (l.some(
      (b) => b.id === d.id
    )) {
      await figma.loadAllPagesAsync();
      const r = figma.root.children.find(
        (w) => w.type === "PAGE" && !l.some((g) => g.id === w.id)
      );
      r && (await figma.setCurrentPageAsync(r), await t.log(
        `Switched away from page "${d.name}" before deletion`
      ));
    }
    let m = 0;
    for (const b of l)
      try {
        await figma.loadAllPagesAsync();
        const r = await figma.getNodeByIdAsync(
          b.id
        );
        if (!r || r.type !== "PAGE")
          continue;
        if (figma.currentPage.id === r.id) {
          await figma.loadAllPagesAsync();
          const g = figma.root.children.find(
            (S) => S.type === "PAGE" && S.id !== r.id && !l.some((k) => k.id === S.id)
          );
          g && await figma.setCurrentPageAsync(g);
        }
        r.remove(), m++, await t.log(`Deleted page: "${b.name}"`);
      } catch (r) {
        await t.warning(
          `Failed to delete page "${b.name}" (${b.id.substring(0, 8)}...): ${r instanceof Error ? r.message : String(r)}`
        );
      }
    let $ = 0, y = 0;
    for (const b of c)
      try {
        const r = await figma.variables.getVariableByIdAsync(b);
        if (r) {
          const w = r.variableCollectionId;
          o.has(w) || (r.remove(), y++, await t.log(
            `Deleted variable: ${r.name} (${b.substring(0, 8)}...)`
          ));
        }
      } catch (r) {
        await t.warning(
          `Could not delete variable ${b.substring(0, 8)}...: ${r instanceof Error ? r.message : String(r)}`
        );
      }
    for (const b of o)
      try {
        const r = await figma.variables.getVariableCollectionByIdAsync(b);
        r && (r.remove(), $++, await t.log(
          `Deleted collection: "${r.name}" (${b.substring(0, 8)}...)`
        ));
      } catch (r) {
        await t.warning(
          `Could not delete collection ${b.substring(0, 8)}...: ${r instanceof Error ? r.message : String(r)}`
        );
      }
    return await t.log("=== Failed Import Cleanup Complete ==="), Ee("cleanupFailedImport", {
      success: !0,
      deletedPages: m,
      deletedCollections: $,
      deletedVariables: y
    });
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Cleanup failed: ${n}`), Oe(
      "cleanupFailedImport",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function Rn(e) {
  try {
    await t.log("=== Clearing Import Metadata ==="), await figma.loadAllPagesAsync();
    const a = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!a || a.type !== "PAGE")
      throw new Error("Page not found");
    a.setPluginData(Pe, ""), a.setPluginData(ve, "");
    const n = figma.root.children;
    for (const s of n)
      if (s.type === "PAGE" && s.getPluginData(ve) === "true") {
        const o = s.getPluginData(Pe);
        if (o)
          try {
            JSON.parse(o), s.setPluginData(ve, "");
          } catch (c) {
            s.setPluginData(ve, "");
          }
        else
          s.setPluginData(ve, "");
      }
    return await t.log(
      "Cleared import metadata from page and related pages"
    ), Ee("clearImportMetadata", {
      success: !0
    });
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Clear metadata failed: ${n}`), Oe(
      "clearImportMetadata",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function Mn(e) {
  try {
    await t.log("=== Summarizing Variables for Wizard ===");
    const a = [];
    for (const { fileName: u, jsonData: b } of e.jsonFiles)
      try {
        const r = ht(b);
        if (!r.success || !r.expandedJsonData) {
          await t.warning(
            `Skipping ${u} - failed to expand JSON: ${r.error || "Unknown error"}`
          );
          continue;
        }
        const w = r.expandedJsonData;
        if (!w.collections)
          continue;
        const S = at.fromTable(
          w.collections
        );
        if (!w.variables)
          continue;
        const D = nt.fromTable(w.variables).getTable();
        for (const j of Object.values(D)) {
          if (j._colRef === void 0)
            continue;
          const E = S.getCollectionByIndex(
            j._colRef
          );
          if (E) {
            const C = Ae(
              E.collectionName
            ).toLowerCase();
            (C === "tokens" || C === "theme" || C === "layer") && a.push({
              name: j.variableName,
              collectionName: C
              // Use lowercase for consistency ("layer" not "layers")
            });
          }
        }
      } catch (r) {
        await t.warning(
          `Error processing ${u}: ${r instanceof Error ? r.message : String(r)}`
        );
        continue;
      }
    const n = await figma.variables.getLocalVariableCollectionsAsync();
    let i = null, s = null, l = null;
    for (const u of n) {
      const r = Ae(u.name).toLowerCase();
      (r === "tokens" || r === "token") && !i ? i = u : (r === "theme" || r === "themes") && !s ? s = u : (r === "layer" || r === "layers") && !l && (l = u);
    }
    const o = a.filter(
      (u) => u.collectionName === "tokens"
    ), c = a.filter((u) => u.collectionName === "theme"), d = a.filter((u) => u.collectionName === "layer"), p = {
      existing: 0,
      new: 0
    }, m = {
      existing: 0,
      new: 0
    }, $ = {
      existing: 0,
      new: 0
    };
    if (e.tokensCollection === "existing" && i) {
      const u = /* @__PURE__ */ new Set();
      for (const b of i.variableIds)
        try {
          const r = figma.variables.getVariableById(b);
          r && u.add(r.name);
        } catch (r) {
          continue;
        }
      for (const b of o)
        u.has(b.name) ? p.existing++ : p.new++;
    } else
      p.new = o.length;
    if (e.themeCollection === "existing" && s) {
      const u = /* @__PURE__ */ new Set();
      for (const b of s.variableIds)
        try {
          const r = figma.variables.getVariableById(b);
          r && u.add(r.name);
        } catch (r) {
          continue;
        }
      for (const b of c)
        u.has(b.name) ? m.existing++ : m.new++;
    } else
      m.new = c.length;
    if (e.layersCollection === "existing" && l) {
      const u = /* @__PURE__ */ new Set();
      for (const b of l.variableIds)
        try {
          const r = figma.variables.getVariableById(b);
          r && u.add(r.name);
        } catch (r) {
          continue;
        }
      for (const b of d)
        u.has(b.name) ? $.existing++ : $.new++;
    } else
      $.new = d.length;
    return await t.log(
      `Variable summary: Tokens - ${p.existing} existing, ${p.new} new; Theme - ${m.existing} existing, ${m.new} new; Layers - ${$.existing} existing, ${$.new} new`
    ), Ee("summarizeVariablesForWizard", {
      tokens: p,
      theme: m,
      layers: $
    });
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Summarize failed: ${n}`), Oe(
      "summarizeVariablesForWizard",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function kn(e) {
  try {
    const a = "recursica:collectionId", i = {
      collections: (await figma.variables.getLocalVariableCollectionsAsync()).map((s) => {
        const l = s.getSharedPluginData("recursica", a);
        return {
          id: s.id,
          name: s.name,
          guid: l || void 0
        };
      })
    };
    return Ee(
      "getLocalVariableCollections",
      i
    );
  } catch (a) {
    return Oe(
      "getLocalVariableCollections",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function Un(e) {
  try {
    const a = "recursica:collectionId", n = [];
    for (const s of e.collectionIds)
      try {
        const l = await figma.variables.getVariableCollectionByIdAsync(s);
        if (l) {
          const o = l.getSharedPluginData(
            "recursica",
            a
          );
          n.push({
            collectionId: s,
            guid: o || null
          });
        } else
          n.push({
            collectionId: s,
            guid: null
          });
      } catch (l) {
        await t.warning(
          `Failed to get GUID for collection ${s}: ${l instanceof Error ? l.message : String(l)}`
        ), n.push({
          collectionId: s,
          guid: null
        });
      }
    return Ee(
      "getCollectionGuids",
      {
        collectionGuids: n
      }
    );
  } catch (a) {
    return Oe(
      "getCollectionGuids",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function Ln(e) {
  try {
    await t.log("=== Starting Import Group Merge ==="), await figma.loadAllPagesAsync();
    const a = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!a || a.type !== "PAGE")
      throw new Error("Main page not found");
    const n = a.getPluginData(Pe);
    if (!n)
      throw new Error("Primary import metadata not found on page");
    const i = JSON.parse(n);
    await t.log(
      `Found metadata for component: ${i.componentName} (Version: ${i.componentVersion})`
    );
    let s = 0, l = 0;
    const o = "recursica:collectionId";
    for (const w of e.collectionChoices)
      if (w.choice === "merge")
        try {
          const g = await figma.variables.getVariableCollectionByIdAsync(
            w.newCollectionId
          );
          if (!g) {
            await t.warning(
              `New collection ${w.newCollectionId} not found, skipping merge`
            );
            continue;
          }
          let S = null;
          if (w.existingCollectionId)
            S = await figma.variables.getVariableCollectionByIdAsync(
              w.existingCollectionId
            );
          else {
            const C = g.getSharedPluginData(
              "recursica",
              o
            );
            if (C) {
              const F = await figma.variables.getLocalVariableCollectionsAsync();
              for (const O of F)
                if (O.getSharedPluginData(
                  "recursica",
                  o
                ) === C && O.id !== w.newCollectionId) {
                  S = O;
                  break;
                }
              if (!S && (C === Ge.LAYER || C === Ge.TOKENS || C === Ge.THEME)) {
                let O;
                C === Ge.LAYER ? O = Re.LAYER : C === Ge.TOKENS ? O = Re.TOKENS : O = Re.THEME;
                for (const v of F)
                  if (v.getSharedPluginData(
                    "recursica",
                    o
                  ) === C && v.name === O && v.id !== w.newCollectionId) {
                    S = v;
                    break;
                  }
                S || (S = figma.variables.createVariableCollection(O), S.setSharedPluginData(
                  "recursica",
                  o,
                  C
                ), await t.log(
                  `Created new standard collection: "${O}"`
                ));
              }
            }
          }
          if (!S) {
            await t.warning(
              "Could not find or create existing collection for merge, skipping"
            );
            continue;
          }
          await t.log(
            `Merging collection "${g.name}" (${w.newCollectionId.substring(0, 8)}...) into "${S.name}" (${S.id.substring(0, 8)}...)`
          );
          const k = g.variableIds.map(
            (C) => figma.variables.getVariableByIdAsync(C)
          ), D = await Promise.all(k), j = S.variableIds.map(
            (C) => figma.variables.getVariableByIdAsync(C)
          ), E = await Promise.all(j), T = new Set(
            E.filter((C) => C !== null).map((C) => C.name)
          );
          for (const C of D)
            if (C)
              try {
                if (T.has(C.name)) {
                  await t.warning(
                    `Variable "${C.name}" already exists in collection "${S.name}", skipping`
                  );
                  continue;
                }
                const F = figma.variables.createVariable(
                  C.name,
                  S,
                  C.resolvedType
                );
                for (const O of S.modes) {
                  const v = O.modeId;
                  let h = C.valuesByMode[v];
                  if (h === void 0 && g.modes.length > 0) {
                    const x = g.modes[0].modeId;
                    h = C.valuesByMode[x];
                  }
                  h !== void 0 && F.setValueForMode(v, h);
                }
                await t.log(
                  `  ✓ Copied variable "${C.name}" to collection "${S.name}"`
                );
              } catch (F) {
                await t.warning(
                  `Failed to copy variable "${C.name}": ${F instanceof Error ? F.message : String(F)}`
                );
              }
          g.remove(), s++, await t.log(
            `✓ Merged and deleted collection: ${g.name}`
          );
        } catch (g) {
          await t.warning(
            `Failed to merge collection: ${g instanceof Error ? g.message : String(g)}`
          );
        }
      else
        l++, await t.log(`Kept collection: ${w.newCollectionId}`);
    await t.log("Removing dividers...");
    const c = figma.root.children, d = [];
    for (const w of c) {
      if (w.type !== "PAGE") continue;
      const g = w.getPluginData(Te);
      (g === "start" || g === "end") && d.push(w);
    }
    const p = figma.currentPage;
    if (d.some((w) => w.id === p.id))
      if (a && a.id !== p.id)
        figma.currentPage = a;
      else {
        const w = c.find(
          (g) => g.type === "PAGE" && !d.some((S) => S.id === g.id)
        );
        w && (figma.currentPage = w);
      }
    const m = d.map((w) => w.name);
    for (const w of d)
      try {
        w.remove();
      } catch (g) {
        await t.warning(
          `Failed to delete divider: ${g instanceof Error ? g.message : String(g)}`
        );
      }
    for (const w of m)
      await t.log(`Deleted divider: ${w}`);
    await t.log("Removing construction icons and renaming pages..."), await figma.loadAllPagesAsync();
    const $ = figma.root.children;
    let y = 0;
    const u = "RecursicaPublishedMetadata", b = [];
    for (const w of $)
      if (w.type === "PAGE")
        try {
          if (w.getPluginData(ve) === "true") {
            const S = w.getPluginData(u);
            let k = {};
            if (S)
              try {
                k = JSON.parse(S);
              } catch (D) {
              }
            b.push({
              pageId: w.id,
              pageName: w.name,
              pageMetadata: k
            });
          }
        } catch (g) {
          await t.warning(
            `Failed to process page: ${g instanceof Error ? g.message : String(g)}`
          );
        }
    for (const w of b)
      try {
        const g = await figma.getNodeByIdAsync(
          w.pageId
        );
        if (!g || g.type !== "PAGE") {
          await t.warning(
            `Page ${w.pageId} not found, skipping rename`
          );
          continue;
        }
        let S = g.name;
        if (S.startsWith(ke) && (S = S.substring(ke.length).trim()), S === "REMOTES" || S.includes("REMOTES")) {
          g.name = "REMOTES", y++, await t.log(`Renamed page: "${g.name}" -> "REMOTES"`);
          continue;
        }
        const D = w.pageMetadata.name && w.pageMetadata.name.length > 0 && !w.pageMetadata.name.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        ) ? w.pageMetadata.name : i.componentName || S, j = w.pageMetadata.version !== void 0 ? w.pageMetadata.version : i.componentVersion, E = `${D} (VERSION: ${j})`;
        g.name = E, y++, await t.log(`Renamed page: "${S}" -> "${E}"`);
      } catch (g) {
        await t.warning(
          `Failed to rename page ${w.pageId}: ${g instanceof Error ? g.message : String(g)}`
        );
      }
    if (await t.log("Clearing import metadata..."), a)
      try {
        a.setPluginData(Pe, "");
      } catch (w) {
        await t.warning(
          `Failed to clear primary import metadata: ${w instanceof Error ? w.message : String(w)}`
        );
      }
    for (const w of b)
      try {
        const g = await figma.getNodeByIdAsync(
          w.pageId
        );
        g && g.type === "PAGE" && g.setPluginData(ve, "");
      } catch (g) {
        await t.warning(
          `Failed to clear under review metadata for page ${w.pageId}: ${g instanceof Error ? g.message : String(g)}`
        );
      }
    const r = {
      mergedCollections: s,
      keptCollections: l,
      pagesRenamed: y
    };
    return await t.log(
      `=== Merge Complete ===
  Merged: ${s} collection(s)
  Kept: ${l} collection(s)
  Renamed: ${y} page(s)`
    ), Ee(
      "mergeImportGroup",
      r
    );
  } catch (a) {
    return await t.error(
      `Merge failed: ${a instanceof Error ? a.message : String(a)}`
    ), Oe(
      "mergeImportGroup",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function Bn(e) {
  var a, n;
  try {
    await t.log(
      "=== Test: Instance Children and Overrides Behavior ==="
    );
    const i = await figma.getNodeByIdAsync(e);
    if (!i || i.type !== "PAGE")
      throw new Error("Test page not found");
    const s = i.children.find(
      (R) => R.type === "FRAME" && R.name === "Test"
    );
    if (!s)
      throw new Error("Test frame container not found on page");
    const l = [];
    await t.log(
      `
--- Test 1: Component with children → Create instance ---`
    );
    const o = figma.createComponent();
    o.name = "Test Component - With Children", o.resize(200, 200), s.appendChild(o);
    const c = figma.createFrame();
    c.name = "Child 1", c.resize(50, 50), c.x = 10, c.y = 10, o.appendChild(c);
    const d = figma.createFrame();
    d.name = "Child 2", d.resize(50, 50), d.x = 70, d.y = 10, o.appendChild(d), await t.log(
      `  Created component "${o.name}" with ${o.children.length} children`
    ), await t.log(
      `  Component children: ${o.children.map((R) => R.name).join(", ")}`
    );
    const p = o.createInstance();
    p.name = "Instance 1 - From Component", s.appendChild(p), await t.log(
      `  Created instance "${p.name}" from component`
    );
    const m = p.children.length;
    if (await t.log(
      `  Instance children count immediately after creation: ${m}`
    ), m > 0) {
      await t.log(
        `  Instance children: ${p.children.map((ae) => ae.name).join(", ")}`
      ), await t.log(
        `  Instance child types: ${p.children.map((ae) => ae.type).join(", ")}`
      );
      const R = p.children[0];
      if (await t.log(
        `  First child: name="${R.name}", type="${R.type}", id="${R.id}"`
      ), await t.log(
        `  First child parent: ${(a = R.parent) == null ? void 0 : a.name} (id: ${(n = R.parent) == null ? void 0 : n.id})`
      ), "mainComponent" in R) {
        const ae = await R.getMainComponentAsync();
        await t.log(
          `  First child mainComponent: ${(ae == null ? void 0 : ae.name) || "none"}`
        );
      }
      await t.log(
        `  Component children IDs: ${o.children.map((ae) => ae.id).join(", ")}`
      ), await t.log(
        `  Instance children IDs: ${p.children.map((ae) => ae.id).join(", ")}`
      );
      const fe = p.children[0].id !== o.children[0].id;
      await t.log(
        `  Are instance children different nodes from component children? ${fe}`
      );
    } else
      await t.log(
        "  ⚠️ Instance has NO children immediately after creation"
      );
    if (l.push({
      test: "Instance has children immediately",
      success: m > 0,
      details: {
        instanceChildrenCount: m,
        componentChildrenCount: o.children.length,
        instanceChildren: p.children.map((R) => ({
          name: R.name,
          type: R.type,
          id: R.id
        }))
      }
    }), await t.log(
      `
--- Test 2: Create instance override by replacing child ---`
    ), m > 0) {
      const R = p.children[0];
      await t.log(
        `  Original child to replace: "${R.name}" (id: ${R.id})`
      );
      const fe = figma.createFrame();
      fe.name = "Override Child", fe.resize(60, 60), fe.x = R.x, fe.y = R.y, s.appendChild(fe), await t.log(
        `  Created override child "${fe.name}" as child of Test frame`
      );
      let ae = !1, N;
      try {
        const P = p.children.indexOf(R);
        p.insertChild(P, fe), R.remove(), ae = !0, await t.log(
          `  ✓ Successfully replaced child at index ${P}`
        );
      } catch (P) {
        N = P instanceof Error ? P.message : String(P), await t.log(
          `  ✗ Cannot move node into instance: ${N}`
        ), await t.log(
          "  → This means we cannot directly move placeholder children into instances"
        ), await t.log(
          "  → We must create NEW nodes and copy properties instead"
        ), fe.remove();
      }
      if (ae) {
        await t.log(
          `  Instance children after override: ${p.children.map((f) => f.name).join(", ")}`
        ), await t.log(
          `  Instance children count after override: ${p.children.length}`
        ), await t.log(
          `  Component children after override: ${o.children.map((f) => f.name).join(", ")}`
        ), await t.log(
          `  Component children count after override: ${o.children.length}`
        );
        const P = o.children.length === 2 && o.children[0].name === "Child 1" && o.children[1].name === "Child 2";
        l.push({
          test: "Instance override doesn't affect component",
          success: P,
          details: {
            instanceChildrenAfterOverride: p.children.map((f) => ({
              name: f.name,
              type: f.type,
              id: f.id
            })),
            componentChildrenAfterOverride: o.children.map((f) => ({
              name: f.name,
              type: f.type,
              id: f.id
            }))
          }
        });
      } else
        await t.log(
          "  → Cannot move nodes into instances - must create new nodes instead"
        ), l.push({
          test: "Instance override doesn't affect component",
          success: !0,
          // This is expected behavior
          details: {
            overrideAttempted: !0,
            overrideError: N,
            note: "Cannot move nodes into instances - must create new nodes and copy properties"
          }
        });
    } else
      await t.log(
        "  ⚠️ Skipping override test - instance has no children"
      ), l.push({
        test: "Instance override doesn't affect component",
        success: !1,
        details: { reason: "Instance has no children to override" }
      });
    await t.log(
      `
--- Test 3: Merge placeholder children into instance ---`
    );
    const $ = o.createInstance();
    $.name = "Instance 2 - For Placeholder Merge", $.x = 250, s.appendChild($), await t.log(
      `  Created instance "${$.name}" with ${$.children.length} children`
    );
    const y = figma.createFrame();
    y.name = "[Deferred: Placeholder]", y.resize(200, 200), s.appendChild(y);
    const u = figma.createFrame();
    u.name = "Child 1", u.resize(60, 60), u.x = 10, u.y = 10, y.appendChild(u);
    const b = figma.createFrame();
    b.name = "Placeholder Only Child", b.resize(50, 50), b.x = 80, b.y = 10, y.appendChild(b), await t.log(
      `  Created placeholder with ${y.children.length} children: ${y.children.map((R) => R.name).join(", ")}`
    ), await t.log(
      `  Instance has ${$.children.length} children: ${$.children.map((R) => R.name).join(", ")}`
    );
    let r = !1, w = {}, g;
    if ($.children.length > 0 && y.children.length > 0) {
      await t.log("  Attempting to merge placeholder children..."), await t.log(
        "  → Since we cannot move nodes into instances, we'll test creating new nodes"
      );
      const R = [];
      for (const ae of y.children) {
        const N = $.children.find(
          (P) => P.name === ae.name
        );
        if (N) {
          await t.log(
            `  Found matching child "${ae.name}" in instance - attempting to replace`
          );
          try {
            const P = $.children.indexOf(N);
            $.insertChild(P, ae), N.remove(), R.push({
              name: ae.name,
              source: "replaced existing"
            }), await t.log(
              `    ✓ Successfully replaced "${ae.name}"`
            );
          } catch (P) {
            const f = P instanceof Error ? P.message : String(P);
            await t.log(
              `    ✗ Cannot move "${ae.name}" into instance: ${f}`
            ), await t.log(
              "    → Must create new node and copy properties instead"
            ), R.push({
              name: ae.name,
              source: "replaced existing (failed)",
              error: f
            }), g = f;
          }
        } else {
          await t.log(
            `  No matching child for "${ae.name}" - attempting to append`
          );
          try {
            $.appendChild(ae), R.push({
              name: ae.name,
              source: "appended new"
            }), await t.log(
              `    ✓ Successfully appended "${ae.name}"`
            );
          } catch (P) {
            const f = P instanceof Error ? P.message : String(P);
            await t.log(
              `    ✗ Cannot append "${ae.name}" to instance: ${f}`
            ), await t.log(
              "    → Must create new node and copy properties instead"
            ), R.push({
              name: ae.name,
              source: "appended new (failed)",
              error: f
            }), g = f;
          }
        }
      }
      await t.log(
        `  After merge attempt, instance has ${$.children.length} children: ${$.children.map((ae) => ae.name).join(", ")}`
      );
      const fe = R.filter(
        (ae) => !ae.error && ae.source !== "replaced existing (failed)" && ae.source !== "appended new (failed)"
      );
      g ? (await t.log(
        "  → Merge failed: Cannot move nodes into instances (expected behavior)"
      ), await t.log(
        "  → Solution: Must create NEW nodes and copy properties from placeholder children"
      ), r = !0) : r = fe.length > 0, w = {
        mergedChildren: R,
        successfulMerges: fe.length,
        failedMerges: R.length - fe.length,
        mergeError: g,
        finalInstanceChildren: $.children.map((ae) => ({
          name: ae.name,
          type: ae.type,
          id: ae.id
        })),
        finalInstanceChildrenCount: $.children.length,
        note: g ? "Cannot move nodes into instances - must create new nodes and copy properties" : "Merge succeeded"
      };
    } else
      await t.log(
        "  ⚠️ Cannot merge - instance or placeholder has no children"
      ), w = {
        instanceChildrenCount: $.children.length,
        placeholderChildrenCount: y.children.length
      };
    l.push({
      test: "Merge placeholder children into instance",
      success: r,
      details: w
    }), await t.log(`
--- Test 4: getMainComponent behavior ---`);
    const S = await p.getMainComponentAsync();
    if (await t.log(
      `  Instance mainComponent: ${(S == null ? void 0 : S.name) || "none"} (id: ${(S == null ? void 0 : S.id) || "none"})`
    ), await t.log(
      `  MainComponent type: ${(S == null ? void 0 : S.type) || "none"}`
    ), S) {
      await t.log(
        `  MainComponent children: ${S.children.map((fe) => fe.name).join(", ")}`
      ), await t.log(
        `  MainComponent children count: ${S.children.length}`
      ), await t.log(
        `  Instance children count: ${p.children.length}`
      );
      const R = p.children.length === S.children.length && p.children.every(
        (fe, ae) => fe.name === S.children[ae].name
      );
      await t.log(
        `  Do instance children match mainComponent children? ${R}`
      ), l.push({
        test: "getMainComponent returns component",
        success: S.id === o.id,
        details: {
          mainComponentId: S.id,
          componentId: o.id,
          childrenMatch: R,
          instanceChildrenCount: p.children.length,
          mainComponentChildrenCount: S.children.length
        }
      });
    } else
      l.push({
        test: "getMainComponent returns component",
        success: !1,
        details: { reason: "getMainComponentAsync returned null" }
      });
    await t.log(
      `
--- Test 5: Recreate children from JSON (simulating deferred resolution) ---`
    );
    const k = figma.createComponent();
    k.name = "Test Component - For JSON Recreation", k.resize(300, 300), s.appendChild(k);
    const D = figma.createFrame();
    D.name = "Default Child 1", D.resize(50, 50), D.fills = [{ type: "SOLID", color: { r: 1, g: 0, b: 0 } }], k.appendChild(D);
    const j = figma.createFrame();
    j.name = "Default Child 2", j.resize(50, 50), j.fills = [{ type: "SOLID", color: { r: 0, g: 1, b: 0 } }], k.appendChild(j);
    const E = figma.createFrame();
    E.name = "Default Child 3", E.resize(50, 50), E.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 1 } }], k.appendChild(E), await t.log(
      `  Created component "${k.name}" with ${k.children.length} default children`
    ), await t.log(
      `  Default children: ${k.children.map((R) => R.name).join(", ")}`
    );
    const T = k.createInstance();
    T.name = "Instance 3 - For JSON Recreation", T.x = 350, s.appendChild(T), await t.log(
      `  Created instance "${T.name}" with ${T.children.length} default children`
    ), await t.log(
      `  Instance default children: ${T.children.map((R) => R.name).join(", ")}`
    );
    const C = [
      {
        name: "Default Child 1",
        type: "FRAME",
        fills: [{ type: "SOLID", color: { r: 1, g: 1, b: 0 } }]
        // Yellow (different from default red)
      },
      {
        name: "JSON Only Child",
        type: "FRAME",
        fills: [{ type: "SOLID", color: { r: 1, g: 0, b: 1 } }]
        // Magenta
      }
    ];
    await t.log(
      `  JSON children to recreate: ${C.map((R) => R.name).join(", ")}`
    ), await t.log(
      "  Strategy: Match by name, update matches in place, cannot add new ones (Figma limitation), keep defaults not in JSON"
    );
    let F = !0;
    const O = {
      defaultChildrenBefore: T.children.map((R) => ({
        name: R.name,
        type: R.type,
        fills: "fills" in R ? R.fills : void 0
      })),
      jsonChildren: C.map((R) => ({ name: R.name, type: R.type }))
    }, v = [], h = [];
    for (const R of C) {
      const fe = T.children.find(
        (ae) => ae.name === R.name
      );
      if (fe) {
        await t.log(
          `  Found matching child "${R.name}" - attempting to update in place`
        );
        try {
          if ("fills" in fe && R.fills) {
            const ae = fe.fills;
            await t.log(
              `    Current fills before update: ${JSON.stringify(ae)}`
            ), fe.fills = R.fills;
            const N = fe.fills;
            await t.log(
              `    Fills after update: ${JSON.stringify(N)}`
            ), Array.isArray(N) && N.length > 0 && N[0].type === "SOLID" && N[0].color.r === R.fills[0].color.r && N[0].color.g === R.fills[0].color.g && N[0].color.b === R.fills[0].color.b ? (await t.log(
              `    ✓ Successfully updated "${R.name}" fills in place`
            ), v.push(R.name)) : (await t.log(
              "    ✗ Update assignment succeeded but fills didn't change (read-only?)"
            ), F = !1);
          } else
            await t.log(
              `    ⚠ Cannot update "${R.name}" - node type doesn't support fills`
            );
        } catch (ae) {
          const N = ae instanceof Error ? ae.message : String(ae);
          await t.log(
            `    ✗ Cannot update "${R.name}": ${N}`
          ), F = !1;
        }
      } else
        await t.log(
          `  No matching child for "${R.name}" - cannot add to instance (Figma limitation)`
        ), await t.log(
          "    → Children that exist only in JSON cannot be added to instances"
        ), h.push(R.name);
    }
    await t.log(
      "  Testing: Can we modify other properties (like name, size) of instance children?"
    );
    let x = !1;
    if (T.children.length > 0) {
      const R = T.children[0], fe = R.name, ae = "width" in R ? R.width : void 0;
      try {
        R.name = "Modified Name", "resize" in R && ae && R.resize(ae + 10, R.height), x = !0, await t.log(
          "    ✓ Can modify properties (name, size) of instance children"
        ), R.name = fe, "resize" in R && ae && R.resize(ae, R.height);
      } catch (N) {
        const P = N instanceof Error ? N.message : String(N);
        await t.log(
          `    ✗ Cannot modify properties of instance children: ${P}`
        );
      }
    }
    const I = T.children.filter(
      (R) => !C.some((fe) => fe.name === R.name)
    );
    await t.log(
      `  Kept default children (not in JSON): ${I.map((R) => R.name).join(", ")}`
    ), await t.log(
      `  Final instance children: ${T.children.map((R) => R.name).join(", ")}`
    ), await t.log(
      `  Final instance children count: ${T.children.length}`
    ), O.finalChildren = T.children.map((R) => ({
      name: R.name,
      type: R.type
    })), O.keptDefaultChildren = I.map((R) => ({
      name: R.name,
      type: R.type
    })), O.finalChildrenCount = T.children.length, O.updatedChildren = v, O.skippedChildren = h, O.canModifyProperties = x;
    const V = T.children.some(
      (R) => R.name === "Default Child 1"
    ), J = T.children.some(
      (R) => R.name === "JSON Only Child"
    ), Q = T.children.some(
      (R) => R.name === "Default Child 2"
    ), M = T.children.some(
      (R) => R.name === "Default Child 3"
    ), L = T.children.find(
      (R) => R.name === "Default Child 1"
    );
    let X = !1;
    if (L && "fills" in L) {
      const R = L.fills;
      Array.isArray(R) && R.length > 0 && R[0].type === "SOLID" && (X = R[0].color.r === 1 && R[0].color.g === 1 && R[0].color.b === 0);
    }
    const z = V && X && !J && // Should NOT exist (Figma limitation)
    Q && M && T.children.length === 3;
    await t.log(`  Meets expectations: ${z}`), await t.log(`    - "Default Child 1" updated: ${X}`), await t.log(
      `    - "JSON Only Child" added: ${J} (expected: false - cannot add new children)`
    ), await t.log(
      `    - Default children kept: ${Q && M}`
    ), l.push({
      test: "Recreate children from JSON",
      success: F && z,
      details: Ne(ge({}, O), {
        meetsExpectations: z,
        hasJsonChild1: V,
        child1Updated: X,
        hasJsonOnlyChild: J,
        hasDefaultChild2: Q,
        hasDefaultChild3: M,
        note: F && z ? "Successfully updated existing children in place, kept defaults not in JSON. Cannot add new children to instances (Figma limitation)." : "Failed to update children or expectations not met"
      })
    }), await t.log(
      `
--- Test 6: Bottom-up resolution order (nested deferred instances) ---`
    );
    const W = figma.createFrame();
    W.name = "[Deferred: Parent]", W.resize(200, 200), s.appendChild(W);
    const q = figma.createFrame();
    q.name = "[Deferred: Child]", q.resize(100, 100), q.x = 10, q.y = 10, W.appendChild(q);
    const Y = figma.createFrame();
    Y.name = "[Deferred: Grandchild]", Y.resize(50, 50), Y.x = 10, Y.y = 10, q.appendChild(Y), await t.log(
      "  Created nested structure: Parent -> Child -> Grandchild"
    ), await t.log(
      `  Parent placeholder has ${W.children.length} child(ren)`
    ), await t.log(
      `  Child placeholder has ${q.children.length} child(ren)`
    );
    let K = !0;
    const B = {};
    await t.log("  Step 1: Resolving grandchild (leaf node)...");
    const ee = figma.createComponent();
    ee.name = "Grandchild Component", ee.resize(50, 50), s.appendChild(ee);
    const ie = ee.createInstance();
    ie.name = "Grandchild Instance", s.appendChild(ie);
    const re = Y.parent;
    if (re && "children" in re) {
      const R = re.children.indexOf(
        Y
      );
      re.insertChild(R, ie), Y.remove(), await t.log(
        "    ✓ Resolved grandchild - replaced placeholder with instance"
      ), B.grandchildResolved = !0;
    } else
      await t.log("    ✗ Could not resolve grandchild"), K = !1;
    await t.log(
      "  Step 2: Resolving child (has resolved grandchild inside)..."
    );
    const ce = figma.createComponent();
    ce.name = "Child Component", ce.resize(100, 100), s.appendChild(ce);
    const ne = ce.createInstance();
    ne.name = "Child Instance", s.appendChild(ne);
    const se = W.children.find(
      (R) => R.name === "[Deferred: Child]"
    );
    if (!se)
      await t.log(
        "    ✗ Child placeholder lost after resolving grandchild"
      ), K = !1;
    else if (!("children" in se))
      await t.log(
        "    ✗ Child placeholder does not support children"
      ), K = !1;
    else {
      se.children.find(
        (N) => N.name === "Grandchild Instance"
      ) ? (await t.log(
        "    ✓ Grandchild still accessible inside child placeholder"
      ), B.grandchildStillAccessible = !0) : await t.log(
        "    ⚠ Grandchild not found inside child placeholder (may have been moved)"
      );
      const fe = se.children.find(
        (N) => N.name === "Grandchild Instance"
      ), ae = se.parent;
      if (ae && "children" in ae) {
        const N = ae.children.indexOf(
          se
        );
        ae.insertChild(N, ne), se.remove(), await t.log(
          "    ✓ Resolved child - replaced placeholder with instance"
        ), B.childResolved = !0, fe && (await t.log(
          "    ⚠ Grandchild instance was in child placeholder and is now lost"
        ), await t.log(
          "    → This demonstrates the need to extract children before replacing placeholders"
        ), B.grandchildLost = !0);
      } else
        await t.log("    ✗ Could not resolve child"), K = !1;
    }
    await t.log(
      "  Step 3: Resolving parent (has resolved child inside)..."
    );
    const le = figma.createComponent();
    le.name = "Parent Component", le.resize(200, 200), s.appendChild(le);
    const ue = le.createInstance();
    ue.name = "Parent Instance", s.appendChild(ue);
    const be = W.children.find(
      (R) => R.name === "Child Instance"
    );
    be ? (await t.log(
      "    ✓ Child still accessible inside parent placeholder"
    ), B.childStillAccessible = !0, s.appendChild(be), await t.log(
      "    ✓ Extracted child instance from parent placeholder"
    ), B.childExtracted = !0) : (await t.log(
      "    ✗ Child not found inside parent placeholder - cannot extract"
    ), K = !1);
    const Me = W.parent;
    if (Me && "children" in Me) {
      const R = Me.children.indexOf(W);
      if (Me.insertChild(R, ue), W.remove(), await t.log(
        "    ✓ Resolved parent - replaced placeholder with instance"
      ), B.parentResolved = !0, be)
        try {
          ue.appendChild(be), await t.log(
            "    ✓ Added child instance to parent instance"
          ), B.childAddedToParent = !0;
        } catch (fe) {
          const ae = fe instanceof Error ? fe.message : String(fe);
          await t.log(
            `    ✗ Cannot add child to parent instance: ${ae}`
          ), await t.log(
            "    → This is the Figma limitation - cannot add children to instances"
          ), await t.log(
            "    → Child instance remains in testFrame (not in final structure)"
          ), B.childAddedToParent = !1, B.childAddError = ae;
        }
    } else
      await t.log("    ✗ Could not resolve parent"), K = !1;
    await t.log("  Verifying bottom-up resolution worked...");
    const Fe = s.children.find(
      (R) => R.name === "Parent Instance"
    ), Ue = s.children.find(
      (R) => R.name === "Child Instance"
    );
    let ze = !1;
    Fe && Ue ? (ze = !0, await t.log(
      "    ✓ Bottom-up resolution worked: Parent resolved, child extracted"
    ), await t.log(
      "    ⚠ Child cannot be added to parent instance (Figma limitation)"
    )) : Fe ? await t.log(
      "    ⚠ Parent resolved but child not found (may have been lost)"
    ) : await t.log("    ✗ Parent not resolved"), B.bottomUpWorked = ze, B.finalParentExists = !!Fe, B.childExtractedExists = !!Ue, B.note = "Bottom-up resolution works, but Figma limitation prevents adding children to instances. This demonstrates the need for a different approach (e.g., matching by name and replacing at parent level).", B.note = "Bottom-up resolution (leaf to root) ensures nested placeholders are resolved before their parents are replaced", l.push({
      test: "Bottom-up resolution order",
      success: K && ze,
      details: B
    }), await t.log(`
--- Test Summary ---`);
    const et = l.every((R) => R.success), je = l.filter((R) => R.success).length;
    await t.log(
      `  Tests passed: ${je}/${l.length}`
    );
    for (const R of l)
      await t.log(
        `  ${R.success ? "✓" : "✗"} ${R.test}: ${R.success ? "PASS" : "FAIL"}`
      );
    return {
      success: et,
      message: et ? "All instance children and override tests passed" : `${je}/${l.length} tests passed - see details`,
      details: {
        testResults: l,
        summary: {
          total: l.length,
          passed: je,
          failed: l.length - je
        }
      }
    };
  } catch (i) {
    const s = i instanceof Error ? i.message : "Unknown error occurred";
    return await t.error(`Test failed: ${s}`), {
      success: !1,
      message: `Test error: ${s}`
    };
  }
}
async function Fn(e) {
  try {
    await t.log("=== Starting Test ==="), await t.log('Cleaning up "Test" variable collection...');
    const a = await figma.variables.getLocalVariableCollectionsAsync();
    for (const y of a)
      if (y.name === "Test") {
        await t.log(
          `  Found existing "Test" collection (ID: ${y.id.substring(0, 8)}...), deleting...`
        );
        const u = await figma.variables.getLocalVariablesAsync();
        for (const b of u)
          b.variableCollectionId === y.id && b.remove();
        y.remove(), await t.log('  Deleted "Test" collection');
      }
    await figma.loadAllPagesAsync();
    let i = figma.root.children.find(
      (y) => y.type === "PAGE" && y.name === "Test"
    );
    i ? await t.log('Found existing "Test" page') : (i = figma.createPage(), i.name = "Test", await t.log('Created "Test" page')), await figma.setCurrentPageAsync(i);
    const s = i.children.find(
      (y) => y.type === "FRAME" && y.name === "Test"
    );
    s && (await t.log(
      'Found existing "Test" frame, deleting it and all children...'
    ), s.remove(), await t.log('Deleted existing "Test" frame'));
    const l = figma.createFrame();
    l.name = "Test", i.appendChild(l), await t.log('Created new "Test" frame container');
    const o = [];
    await t.log(`
` + "=".repeat(60)), await t.log("TEST 9: Instance Children and Overrides Behavior"), await t.log("=".repeat(60));
    const c = await Bn(i.id);
    o.push({
      name: "Instance Children and Overrides",
      success: c.success,
      message: c.message,
      details: c.details
    }), await t.log(`
` + "=".repeat(60)), await t.log("=== ALL TESTS COMPLETE ==="), await t.log("=".repeat(60));
    const d = o.filter((y) => y.success), p = o.filter((y) => !y.success);
    await t.log(
      `Total: ${o.length} | Passed: ${d.length} | Failed: ${p.length}`
    );
    for (const y of o)
      await t.log(
        `  ${y.success ? "✓" : "✗"} ${y.name}: ${y.message}`
      );
    const $ = {
      testResults: {
        success: c.success,
        message: `All tests completed: ${d.length}/${o.length} passed`,
        details: {
          summary: {
            total: o.length,
            passed: d.length,
            failed: p.length
          },
          tests: o
        }
      },
      allTests: o
    };
    return Ee("runTest", $);
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Test failed: ${n}`), Oe("runTest", n);
  }
}
const Gn = {
  getCurrentUser: pa,
  loadPages: ua,
  exportPage: qe,
  importPage: At,
  cleanupCreatedEntities: ta,
  resolveDeferredNormalInstances: Pt,
  determineImportOrder: ia,
  buildDependencyGraph: aa,
  resolveImportOrder: na,
  importPagesInOrder: oa,
  quickCopy: yn,
  storeAuthData: wn,
  loadAuthData: bn,
  clearAuthData: $n,
  storeImportData: vn,
  loadImportData: Nn,
  clearImportData: Sn,
  storeSelectedRepo: Cn,
  getComponentMetadata: En,
  getAllComponents: In,
  pluginPromptResponse: An,
  switchToPage: Pn,
  checkForExistingPrimaryImport: Tn,
  createImportDividers: On,
  importSingleComponentWithWizard: xn,
  deleteImportGroup: ca,
  clearImportMetadata: Rn,
  cleanupFailedImport: Vn,
  summarizeVariablesForWizard: Mn,
  getLocalVariableCollections: kn,
  getCollectionGuids: Un,
  mergeImportGroup: Ln,
  runTest: Fn
}, _n = Gn;
figma.showUI(__html__, {
  width: 500,
  height: 500
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    Ca(e);
    return;
  }
  const a = e;
  try {
    const n = a.type, i = _n[n];
    if (!i) {
      console.warn("Unknown message type:", a.type);
      const l = {
        type: a.type,
        success: !1,
        error: !0,
        message: "Unknown message type: " + a.type,
        data: {},
        requestId: a.requestId
      };
      figma.ui.postMessage(l);
      return;
    }
    const s = await i(a.data);
    figma.ui.postMessage(Ne(ge({}, s), {
      requestId: a.requestId
    }));
  } catch (n) {
    console.error("Error handling message:", n);
    const i = {
      type: a.type,
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {},
      requestId: a.requestId
    };
    figma.ui.postMessage(i);
  }
};
