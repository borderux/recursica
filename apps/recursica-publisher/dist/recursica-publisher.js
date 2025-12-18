var ia = Object.defineProperty, oa = Object.defineProperties;
var ra = Object.getOwnPropertyDescriptors;
var It = Object.getOwnPropertySymbols;
var sa = Object.prototype.hasOwnProperty, la = Object.prototype.propertyIsEnumerable;
var pt = (e, a, n) => a in e ? ia(e, a, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[a] = n, de = (e, a) => {
  for (var n in a || (a = {}))
    sa.call(a, n) && pt(e, n, a[n]);
  if (It)
    for (var n of It(a))
      la.call(a, n) && pt(e, n, a[n]);
  return e;
}, Ee = (e, a) => oa(e, ra(a));
var Ae = (e, a, n) => pt(e, typeof a != "symbol" ? a + "" : a, n);
async function ca(e) {
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
async function da(e) {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "loadPages",
      success: !0,
      error: !1,
      message: "Pages loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        pages: figma.root.children.map((l, s) => ({
          name: l.name,
          index: s
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
const ve = {
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
}, Ce = Ee(de({}, ve), {
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
}), Oe = Ee(de({}, ve), {
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
}), He = Ee(de({}, ve), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), Mt = Ee(de({}, ve), {
  cornerRadius: 0
}), ga = Ee(de({}, ve), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function fa(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return Ce;
    case "TEXT":
      return Oe;
    case "VECTOR":
      return He;
    case "LINE":
      return ga;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return Mt;
    default:
      return ve;
  }
}
function le(e, a) {
  if (Array.isArray(e))
    return Array.isArray(a) ? e.length !== a.length || e.some((n, i) => le(n, a[i])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof a == "object" && a !== null) {
      const n = Object.keys(e), i = Object.keys(a);
      return n.length !== i.length ? !0 : n.some(
        (l) => !(l in a) || le(e[l], a[l])
      );
    }
    return !0;
  }
  return e !== a;
}
const Le = {
  LAYER: "00000000-0000-0000-0000-000000000001",
  TOKENS: "00000000-0000-0000-0000-000000000002",
  THEME: "00000000-0000-0000-0000-000000000003"
}, Me = {
  LAYER: "Layer",
  TOKENS: "Tokens",
  THEME: "Theme"
};
function Se(e) {
  const a = e.trim(), i = a.replace(/_\d+$/, "").toLowerCase();
  return i === "themes" || i === "theme" ? Me.THEME : i === "token" || i === "tokens" ? Me.TOKENS : i === "layer" || i === "layers" ? Me.LAYER : a;
}
function Ue(e) {
  const a = Se(e);
  return a === Me.LAYER || a === Me.TOKENS || a === Me.THEME;
}
function lt(e) {
  const a = Se(e);
  if (a === Me.LAYER)
    return Le.LAYER;
  if (a === Me.TOKENS)
    return Le.TOKENS;
  if (a === Me.THEME)
    return Le.THEME;
}
class et {
  constructor() {
    Ae(this, "collectionMap");
    // collectionId -> index
    Ae(this, "collections");
    // index -> collection data
    Ae(this, "normalizedNameMap");
    // normalized name -> index (for standard collections)
    Ae(this, "nextIndex");
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
    for (const l of n)
      i.add(l);
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
    const i = Se(
      a.collectionName
    );
    if (Ue(a.collectionName)) {
      const o = this.findCollectionByNormalizedName(i);
      if (o !== void 0) {
        const d = this.collections[o];
        return d.modes = this.mergeModes(
          d.modes,
          a.modes
        ), this.collectionMap.set(n, o), o;
      }
    }
    const l = this.nextIndex++;
    this.collectionMap.set(n, l);
    const s = Ee(de({}, a), {
      collectionName: i
    });
    if (Ue(a.collectionName)) {
      const o = lt(
        a.collectionName
      );
      o && (s.collectionGuid = o), this.normalizedNameMap.set(i, l);
    }
    return this.collections[l] = s, l;
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
      const i = this.collections[n], l = de({
        collectionName: i.collectionName,
        modes: i.modes
      }, i.collectionGuid && { collectionGuid: i.collectionGuid });
      a[String(n)] = l;
    }
    return a;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   * Handles both new format (without collectionId/isLocal) and legacy format (with collectionId/isLocal)
   */
  static fromTable(a) {
    var l;
    const n = new et(), i = Object.entries(a).sort(
      (s, o) => parseInt(s[0], 10) - parseInt(o[0], 10)
    );
    for (const [s, o] of i) {
      const d = parseInt(s, 10), g = (l = o.isLocal) != null ? l : !0, w = Se(
        o.collectionName || ""
      ), u = o.collectionId || o.collectionGuid || `temp:${d}:${w}`, $ = de({
        collectionName: w,
        collectionId: u,
        isLocal: g,
        modes: o.modes || []
      }, o.collectionGuid && {
        collectionGuid: o.collectionGuid
      });
      n.collectionMap.set(u, d), n.collections[d] = $, Ue(w) && n.normalizedNameMap.set(w, d), n.nextIndex = Math.max(
        n.nextIndex,
        d + 1
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
const ma = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, pa = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function ua(e) {
  var n;
  const a = e.toUpperCase();
  return (n = ma[a]) != null ? n : e;
}
function ha(e) {
  var a;
  return typeof e == "number" ? (a = pa[e]) != null ? a : e.toString() : e;
}
class tt {
  constructor() {
    Ae(this, "variableMap");
    // variableKey -> index
    Ae(this, "variables");
    // index -> variable data
    Ae(this, "nextIndex");
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
    for (const [i, l] of Object.entries(a))
      typeof l == "object" && l !== null && "_varRef" in l && typeof l._varRef == "number" ? n[i] = {
        _varRef: l._varRef
      } : n[i] = l;
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
      const i = this.variables[n], l = this.serializeValuesByMode(
        i.valuesByMode
      ), s = de(de({
        variableName: i.variableName,
        variableType: ua(i.variableType)
      }, i._colRef !== void 0 && { _colRef: i._colRef }), l && { valuesByMode: l });
      a[String(n)] = s;
    }
    return a;
  }
  /**
   * Reconstructs a VariableTable from a serialized table object
   * Handles both new format (without variableKey) and legacy format (with variableKey)
   * Expands compressed variable types (numbers) back to strings
   */
  static fromTable(a) {
    const n = new tt(), i = Object.entries(a).sort(
      (l, s) => parseInt(l[0], 10) - parseInt(s[0], 10)
    );
    for (const [l, s] of i) {
      const o = parseInt(l, 10), d = ha(s.variableType), g = Ee(de({}, s), {
        variableType: d
        // Always a string after expansion
      });
      n.variables[o] = g, n.nextIndex = Math.max(n.nextIndex, o + 1);
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
function ya(e) {
  return {
    _varRef: e
  };
}
function Fe(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let wa = 0;
const Qe = /* @__PURE__ */ new Map();
function ba(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const a = Qe.get(e.requestId);
  a && (Qe.delete(e.requestId), e.error || !e.guid ? a.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : a.resolve(e.guid));
}
function vt() {
  return new Promise((e, a) => {
    const n = `guid_${Date.now()}_${++wa}`;
    Qe.set(n, { resolve: e, reject: a }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: n
    }), setTimeout(() => {
      Qe.has(n) && (Qe.delete(n), a(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
async function nt() {
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
    }), await nt();
  },
  log: async (e) => {
    console.log(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    }), await nt();
  },
  warning: async (e) => {
    console.warn(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    }), await nt();
  },
  error: async (e) => {
    console.error(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    }), await nt();
  }
};
function $a(e, a) {
  const n = a.modes.find((i) => i.modeId === e);
  return n ? n.name : e;
}
async function xt(e, a, n, i, l = /* @__PURE__ */ new Set()) {
  const s = {};
  for (const [o, d] of Object.entries(e)) {
    const g = $a(o, i);
    if (d == null) {
      s[g] = d;
      continue;
    }
    if (typeof d == "string" || typeof d == "number" || typeof d == "boolean") {
      s[g] = d;
      continue;
    }
    if (typeof d == "object" && d !== null && "type" in d && d.type === "VARIABLE_ALIAS" && "id" in d) {
      const w = d.id;
      if (l.has(w)) {
        s[g] = {
          type: "VARIABLE_ALIAS",
          id: w
        };
        continue;
      }
      const u = await figma.variables.getVariableByIdAsync(w);
      if (!u) {
        s[g] = {
          type: "VARIABLE_ALIAS",
          id: w
        };
        continue;
      }
      const $ = new Set(l);
      $.add(w);
      const b = await figma.variables.getVariableCollectionByIdAsync(
        u.variableCollectionId
      ), p = u.key;
      if (!p) {
        s[g] = {
          type: "VARIABLE_ALIAS",
          id: w
        };
        continue;
      }
      const r = {
        variableName: u.name,
        variableType: u.resolvedType,
        collectionName: b == null ? void 0 : b.name,
        collectionId: u.variableCollectionId,
        variableKey: p,
        id: w,
        isLocal: !u.remote
      };
      if (b) {
        const c = await Rt(
          b,
          n
        );
        r._colRef = c, u.valuesByMode && (r.valuesByMode = await xt(
          u.valuesByMode,
          a,
          n,
          b,
          // Pass collection for mode ID to name conversion
          $
        ));
      }
      const y = a.addVariable(r);
      s[g] = {
        type: "VARIABLE_ALIAS",
        id: w,
        _varRef: y
      };
    } else
      s[g] = d;
  }
  return s;
}
const it = "recursica:collectionId";
async function va(e) {
  if (e.remote === !0) {
    const n = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(n)) {
      const l = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await t.error(l), new Error(l);
    }
    return e.id;
  } else {
    if (Ue(e.name)) {
      const l = lt(e.name);
      if (l) {
        const s = e.getSharedPluginData(
          "recursica",
          it
        );
        return (!s || s.trim() === "") && e.setSharedPluginData(
          "recursica",
          it,
          l
        ), l;
      }
    }
    const n = e.getSharedPluginData(
      "recursica",
      it
    );
    if (n && n.trim() !== "")
      return n;
    const i = await vt();
    return e.setSharedPluginData("recursica", it, i), i;
  }
}
function Ca(e, a) {
  if (a)
    return;
  const n = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(n))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Rt(e, a) {
  const n = !e.remote, i = a.getCollectionIndex(e.id);
  if (i !== -1)
    return i;
  Ca(e.name, n);
  const l = await va(e), s = e.modes.map((w) => w.name), o = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: n,
    modes: s,
    collectionGuid: l
  }, d = a.addCollection(o), g = n ? "local" : "remote";
  return await t.log(
    `  Added ${g} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), d;
}
async function ht(e, a, n) {
  if (!e || typeof e != "object" || e.type !== "VARIABLE_ALIAS")
    return null;
  try {
    const i = await figma.variables.getVariableByIdAsync(e.id);
    if (!i)
      return console.log("Could not resolve variable alias:", e.id), null;
    const l = await figma.variables.getVariableCollectionByIdAsync(
      i.variableCollectionId
    );
    if (!l)
      return console.log("Could not resolve collection for variable:", e.id), null;
    const s = i.key;
    if (!s)
      return console.log("Variable missing key:", e.id), null;
    const o = await Rt(
      l,
      n
    ), d = {
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
    i.valuesByMode && (d.valuesByMode = await xt(
      i.valuesByMode,
      a,
      n,
      l,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const g = a.addVariable(d);
    return ya(g);
  } catch (i) {
    const l = i instanceof Error ? i.message : String(i);
    throw console.error("Could not resolve variable alias:", e.id, i), new Error(
      `Failed to resolve variable alias ${e.id}: ${l}`
    );
  }
}
async function Xe(e, a, n) {
  if (!e || typeof e != "object") return e;
  const i = {};
  for (const l in e)
    if (Object.prototype.hasOwnProperty.call(e, l)) {
      const s = e[l];
      if (s && typeof s == "object" && !Array.isArray(s))
        if (s.type === "VARIABLE_ALIAS") {
          const o = await ht(
            s,
            a,
            n
          );
          o && (i[l] = o);
        } else
          i[l] = await Xe(
            s,
            a,
            n
          );
      else Array.isArray(s) ? i[l] = await Promise.all(
        s.map(async (o) => (o == null ? void 0 : o.type) === "VARIABLE_ALIAS" ? await ht(
          o,
          a,
          n
        ) || o : o && typeof o == "object" ? await Xe(
          o,
          a,
          n
        ) : o)
      ) : i[l] = s;
    }
  return i;
}
async function kt(e, a, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const l = {};
      for (const s in i)
        Object.prototype.hasOwnProperty.call(i, s) && (s === "boundVariables" ? l[s] = await Xe(
          i[s],
          a,
          n
        ) : l[s] = i[s]);
      return l;
    })
  );
}
async function Ut(e, a, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const l = {};
      for (const s in i)
        Object.prototype.hasOwnProperty.call(i, s) && (s === "boundVariables" ? l[s] = await Xe(
          i[s],
          a,
          n
        ) : l[s] = i[s]);
      return l;
    })
  );
}
const Je = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  extractBoundVariables: Xe,
  resolveVariableAliasMetadata: ht,
  serializeBackgrounds: Ut,
  serializeFills: kt
}, Symbol.toStringTag, { value: "Module" }));
async function Bt(e, a) {
  var g, w;
  const n = {}, i = /* @__PURE__ */ new Set();
  e.type && (n.type = e.type, i.add("type")), e.id && (n.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (n.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (n.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (n.y = e.y, i.add("y")), e.width !== void 0 && (n.width = e.width, i.add("width")), e.height !== void 0 && (n.height = e.height, i.add("height"));
  const l = e.name || "Unnamed";
  e.preserveRatio !== void 0 && await t.log(
    `[ISSUE #3 EXPORT DEBUG] "${l}" has preserveRatio: ${e.preserveRatio} (NOT being exported - needs to be added!)`
  );
  const s = e.type;
  if (s === "FRAME" || s === "COMPONENT" || s === "INSTANCE" || s === "GROUP" || s === "BOOLEAN_OPERATION" || s === "VECTOR" || s === "STAR" || s === "LINE" || s === "ELLIPSE" || s === "POLYGON" || s === "RECTANGLE" || s === "TEXT") {
    const u = e.constraintHorizontal !== void 0 ? e.constraintHorizontal : (g = e.constraints) == null ? void 0 : g.horizontal, $ = e.constraintVertical !== void 0 ? e.constraintVertical : (w = e.constraints) == null ? void 0 : w.vertical;
    u !== void 0 && le(
      u,
      ve.constraintHorizontal
    ) && (n.constraintHorizontal = u, i.add("constraintHorizontal")), $ !== void 0 && le(
      $,
      ve.constraintVertical
    ) && (n.constraintVertical = $, i.add("constraintVertical"));
  }
  if (e.visible !== void 0 && le(e.visible, ve.visible) && (n.visible = e.visible, i.add("visible")), e.locked !== void 0 && le(e.locked, ve.locked) && (n.locked = e.locked, i.add("locked")), e.opacity !== void 0 && le(e.opacity, ve.opacity) && (n.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && le(e.rotation, ve.rotation) && (n.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && le(e.blendMode, ve.blendMode) && (n.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && le(e.effects, ve.effects) && (n.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const u = await kt(
      e.fills,
      a.variableTable,
      a.collectionTable
    );
    le(u, ve.fills) && (n.fills = u), i.add("fills");
  }
  if (e.strokes !== void 0 && le(e.strokes, ve.strokes) && (n.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && le(e.strokeWeight, ve.strokeWeight) && (n.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && le(e.strokeAlign, ve.strokeAlign) && (n.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const u = e.name || "Unnamed", $ = Object.keys(e.boundVariables);
    $.length > 0 ? await t.log(
      `[ISSUE #2 EXPORT DEBUG] "${u}" (${e.type}) has boundVariables for: ${$.join(", ")}`
    ) : await t.log(
      `[ISSUE #2 EXPORT DEBUG] "${u}" (${e.type}) has no boundVariables`
    );
    const b = await Xe(
      e.boundVariables,
      a.variableTable,
      a.collectionTable
    ), p = Object.keys(b);
    p.length > 0 && await t.log(
      `[ISSUE #2 EXPORT DEBUG] "${u}" extracted boundVariables: ${p.join(", ")}`
    ), Object.keys(b).length > 0 && (n.boundVariables = b), i.add("boundVariables");
  }
  if (e.backgrounds !== void 0) {
    const u = await Ut(
      e.backgrounds,
      a.variableTable,
      a.collectionTable
    );
    u && Array.isArray(u) && u.length > 0 && (n.backgrounds = u), i.add("backgrounds");
  }
  const d = e.selectionColor;
  return d !== void 0 && (n.selectionColor = d, i.add("selectionColor")), n;
}
const Na = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseBaseNodeProperties: Bt
}, Symbol.toStringTag, { value: "Module" }));
async function yt(e, a) {
  const n = {}, i = /* @__PURE__ */ new Set();
  if (e.type === "COMPONENT")
    try {
      e.componentPropertyDefinitions && (n.componentPropertyDefinitions = e.componentPropertyDefinitions, i.add("componentPropertyDefinitions"));
    } catch (l) {
    }
  return e.layoutMode !== void 0 && le(e.layoutMode, Ce.layoutMode) && (n.layoutMode = e.layoutMode, i.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && le(
    e.primaryAxisSizingMode,
    Ce.primaryAxisSizingMode
  ) && (n.primaryAxisSizingMode = e.primaryAxisSizingMode, i.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && le(
    e.counterAxisSizingMode,
    Ce.counterAxisSizingMode
  ) && (n.counterAxisSizingMode = e.counterAxisSizingMode, i.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && le(
    e.primaryAxisAlignItems,
    Ce.primaryAxisAlignItems
  ) && (n.primaryAxisAlignItems = e.primaryAxisAlignItems, i.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && le(
    e.counterAxisAlignItems,
    Ce.counterAxisAlignItems
  ) && (n.counterAxisAlignItems = e.counterAxisAlignItems, i.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && le(e.paddingLeft, Ce.paddingLeft) && (n.paddingLeft = e.paddingLeft, i.add("paddingLeft")), e.paddingRight !== void 0 && le(e.paddingRight, Ce.paddingRight) && (n.paddingRight = e.paddingRight, i.add("paddingRight")), e.paddingTop !== void 0 && le(e.paddingTop, Ce.paddingTop) && (n.paddingTop = e.paddingTop, i.add("paddingTop")), e.paddingBottom !== void 0 && le(e.paddingBottom, Ce.paddingBottom) && (n.paddingBottom = e.paddingBottom, i.add("paddingBottom")), e.itemSpacing !== void 0 && le(e.itemSpacing, Ce.itemSpacing) && (n.itemSpacing = e.itemSpacing, i.add("itemSpacing")), e.counterAxisSpacing !== void 0 && le(
    e.counterAxisSpacing,
    Ce.counterAxisSpacing
  ) && (n.counterAxisSpacing = e.counterAxisSpacing, i.add("counterAxisSpacing")), e.cornerRadius !== void 0 && le(e.cornerRadius, Ce.cornerRadius) && (n.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.clipsContent !== void 0 && le(e.clipsContent, Ce.clipsContent) && (n.clipsContent = e.clipsContent, i.add("clipsContent")), e.layoutWrap !== void 0 && le(e.layoutWrap, Ce.layoutWrap) && (n.layoutWrap = e.layoutWrap, i.add("layoutWrap")), e.layoutGrow !== void 0 && le(e.layoutGrow, Ce.layoutGrow) && (n.layoutGrow = e.layoutGrow, i.add("layoutGrow")), n;
}
const Ea = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseFrameProperties: yt
}, Symbol.toStringTag, { value: "Module" }));
async function Sa(e, a) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (n.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (n.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (n.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && le(
    e.textAlignHorizontal,
    Oe.textAlignHorizontal
  ) && (n.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && le(
    e.textAlignVertical,
    Oe.textAlignVertical
  ) && (n.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && le(e.letterSpacing, Oe.letterSpacing) && (n.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && le(e.lineHeight, Oe.lineHeight) && (n.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && le(e.textCase, Oe.textCase) && (n.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && le(e.textDecoration, Oe.textDecoration) && (n.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && le(e.textAutoResize, Oe.textAutoResize) && (n.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && le(
    e.paragraphSpacing,
    Oe.paragraphSpacing
  ) && (n.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && le(e.paragraphIndent, Oe.paragraphIndent) && (n.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && le(e.listOptions, Oe.listOptions) && (n.listOptions = e.listOptions, i.add("listOptions")), n;
}
function Ia(e) {
  const a = e.match(/^(\d+\.?\d*)[eE]([+-]?\d+)$/);
  if (a) {
    const n = parseFloat(a[1]), i = parseInt(a[2]), l = n * Math.pow(10, i);
    return Math.abs(l) < 1e-10 ? "0" : l.toFixed(6).replace(/\.?0+$/, "") || "0";
  }
  return e;
}
function Lt(e) {
  if (!e || typeof e != "string")
    return e;
  let a = e.replace(/(\d+\.?\d*)[eE]([+-]?\d+)/g, (n) => Ia(n));
  return a = a.replace(
    /(\d+\.\d{7,})/g,
    // Match numbers with more than 6 decimal places
    (n) => {
      const i = parseFloat(n);
      return Math.abs(i) < 1e-10 ? "0" : i.toFixed(6).replace(/\.?0+$/, "") || "0";
    }
  ), a = a.replace(
    /([MmLlHhVvCcSsQqTtAaZz])([-\d])/g,
    (n, i, l) => `${i} ${l}`
  ), a = a.replace(/\s+/g, " ").trim(), a;
}
function wt(e) {
  return Array.isArray(e) ? e.map((a) => ({
    data: Lt(a.data),
    // Normalize winding rule key (use windRule consistently)
    windRule: a.windRule || a.windingRule || "NONZERO"
  })) : e;
}
const Aa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  normalizeSvgPath: Lt,
  normalizeVectorGeometry: wt
}, Symbol.toStringTag, { value: "Module" }));
async function Pa(e, a) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && le(e.fillGeometry, He.fillGeometry) && (n.fillGeometry = wt(e.fillGeometry), i.add("fillGeometry")), e.strokeGeometry !== void 0 && le(e.strokeGeometry, He.strokeGeometry) && (n.strokeGeometry = wt(e.strokeGeometry), i.add("strokeGeometry")), e.strokeCap !== void 0 && le(e.strokeCap, He.strokeCap) && (n.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && le(e.strokeJoin, He.strokeJoin) && (n.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && le(e.dashPattern, He.dashPattern) && (n.dashPattern = e.dashPattern, i.add("dashPattern")), n;
}
async function Ta(e, a) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && le(e.cornerRadius, Mt.cornerRadius) && (n.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (n.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, i.add("pointCount")), n;
}
const ot = /* @__PURE__ */ new Map();
let Oa = 0;
function Va() {
  return `prompt_${Date.now()}_${++Oa}`;
}
const Ye = {
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
    const n = typeof a == "number" ? { timeoutMs: a } : a, i = (d = n == null ? void 0 : n.timeoutMs) != null ? d : 3e5, l = n == null ? void 0 : n.okLabel, s = n == null ? void 0 : n.cancelLabel, o = Va();
    return new Promise((g, w) => {
      const u = i === -1 ? null : setTimeout(() => {
        ot.delete(o), w(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      ot.set(o, {
        resolve: g,
        reject: w,
        timeout: u
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: de(de({
          message: e,
          requestId: o
        }, l && { okLabel: l }), s && { cancelLabel: s })
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
    const { requestId: a, action: n } = e, i = ot.get(a);
    if (!i) {
      console.warn(
        `Received response for unknown prompt request: ${a}`
      );
      return;
    }
    i.timeout && clearTimeout(i.timeout), ot.delete(a), n === "ok" ? i.resolve() : i.reject(new Error("User cancelled"));
  }
}, Ma = "RecursicaPublishedMetadata";
function ut(e) {
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
function At(e) {
  try {
    const a = e.getPluginData(Ma);
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
async function xa(e, a) {
  var l, s;
  const n = {}, i = /* @__PURE__ */ new Set();
  if (n._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const o = await e.getMainComponentAsync();
    if (!o) {
      const P = e.name || "(unnamed)", E = e.id;
      if (a.detachedComponentsHandled.has(E))
        await t.log(
          `Treating detached instance "${P}" as internal instance (already prompted)`
        );
      else {
        await t.warning(
          `Found detached instance: "${P}" (main component is missing)`
        );
        const A = `Found detached instance "${P}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await Ye.prompt(A, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), a.detachedComponentsHandled.add(E), await t.log(
            `Treating detached instance "${P}" as internal instance`
          );
        } catch (O) {
          if (O instanceof Error && O.message === "User cancelled") {
            const K = `Export cancelled: Detached instance "${P}" found. Please fix the instance before exporting.`;
            await t.error(K);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch (ne) {
              console.warn("Could not scroll to instance:", ne);
            }
            throw new Error(K);
          } else
            throw O;
        }
      }
      if (!ut(e).page) {
        const A = `Detached instance "${P}" is not on any page. Cannot export.`;
        throw await t.error(A), new Error(A);
      }
      let C, v;
      try {
        e.variantProperties && (C = e.variantProperties), e.componentProperties && (v = e.componentProperties);
      } catch (A) {
      }
      const h = de(de({
        instanceType: "internal",
        componentName: P,
        componentNodeId: e.id
      }, C && { variantProperties: C }), v && { componentProperties: v }), I = a.instanceTable.addInstance(h);
      return n._instanceRef = I, i.add("_instanceRef"), await t.log(
        `  Exported detached INSTANCE: "${P}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), n;
    }
    const d = e.name || "(unnamed)", g = o.name || "(unnamed)", w = o.remote === !0, $ = ut(e).page, b = ut(o);
    let p = b.page;
    if (!p && w)
      try {
        await figma.loadAllPagesAsync();
        const P = figma.root.children;
        let E = null;
        for (const k of P)
          try {
            if (k.findOne(
              (C) => C.id === o.id
            )) {
              E = k;
              break;
            }
          } catch (j) {
          }
        if (!E) {
          const k = o.id.split(":")[0];
          for (const j of P) {
            const C = j.id.split(":")[0];
            if (k === C) {
              E = j;
              break;
            }
          }
        }
        E && (p = E);
      } catch (P) {
      }
    let r, y = p;
    if (w)
      if (p) {
        const P = At(p);
        r = "normal", y = p, P != null && P.id ? await t.log(
          `  Component "${g}" is from library but also exists on local page "${p.name}" with metadata. Treating as "normal" instance.`
        ) : await t.log(
          `  Component "${g}" is from library and exists on local page "${p.name}" (no metadata). Treating as "normal" instance - page should be published first.`
        );
      } else
        r = "remote", await t.log(
          `  Component "${g}" is from library and not on a local page. Treating as "remote" instance.`
        );
    else if (p && $ && p.id === $.id)
      r = "internal";
    else if (p && $ && p.id !== $.id)
      r = "normal";
    else if (p && !$)
      r = "normal";
    else if (!w && b.reason === "detached") {
      const P = o.id;
      if (a.detachedComponentsHandled.has(P))
        r = "remote", await t.log(
          `Treating detached instance "${d}" -> component "${g}" as remote instance (already prompted)`
        );
      else {
        await t.warning(
          `Found detached instance: "${d}" -> component "${g}" (component is not on any page)`
        );
        try {
          await figma.viewport.scrollAndZoomIntoView([o]);
        } catch (k) {
          console.warn("Could not scroll to component:", k);
        }
        const E = `Found detached instance "${d}" attached to component "${g}". This should be fixed. Continue to publish?`;
        try {
          await Ye.prompt(E, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), a.detachedComponentsHandled.add(P), r = "remote", await t.log(
            `Treating detached instance "${d}" as remote instance (will be created on REMOTES page)`
          );
        } catch (k) {
          if (k instanceof Error && k.message === "User cancelled") {
            const j = `Export cancelled: Detached instance "${d}" found. The component "${g}" is not on any page. Please fix the instance before exporting.`;
            throw await t.error(j), new Error(j);
          } else
            throw k;
        }
      }
    } else
      w || await t.warning(
        `  Instance "${d}" -> component "${g}": componentPage is null but component is not remote. Reason: ${b.reason}. Cannot determine instance type.`
      ), r = "normal";
    let c, T;
    try {
      if (e.variantProperties && (c = e.variantProperties, await t.log(
        `  Instance "${d}" -> variantProperties from instance: ${JSON.stringify(c)}`
      )), typeof e.getProperties == "function")
        try {
          const P = await e.getProperties();
          P && P.variantProperties && (await t.log(
            `  Instance "${d}" -> variantProperties from getProperties(): ${JSON.stringify(P.variantProperties)}`
          ), P.variantProperties && Object.keys(P.variantProperties).length > 0 && (c = P.variantProperties));
        } catch (P) {
          await t.log(
            `  Instance "${d}" -> getProperties() not available or failed: ${P}`
          );
        }
      if (e.componentProperties && (T = e.componentProperties), o.parent && o.parent.type === "COMPONENT_SET") {
        const P = o.parent;
        try {
          const E = P.componentPropertyDefinitions;
          E && await t.log(
            `  Component set "${P.name}" has property definitions: ${JSON.stringify(Object.keys(E))}`
          );
          const k = {}, j = g.split(",").map((C) => C.trim());
          for (const C of j) {
            const v = C.split("=").map((h) => h.trim());
            if (v.length >= 2) {
              const h = v[0], I = v.slice(1).join("=").trim();
              E && E[h] && (k[h] = I);
            }
          }
          if (Object.keys(k).length > 0 && await t.log(
            `  Parsed variant properties from component name "${g}": ${JSON.stringify(k)}`
          ), c && Object.keys(c).length > 0)
            await t.log(
              `  Using variant properties from instance (source of truth): ${JSON.stringify(c)}`
            );
          else if (Object.keys(k).length > 0)
            c = k, await t.log(
              `  Using variant properties from component name (fallback): ${JSON.stringify(c)}`
            );
          else if (o.variantProperties) {
            const C = o.variantProperties;
            await t.log(
              `  Main component "${g}" has variantProperties: ${JSON.stringify(C)}`
            ), c = C;
          }
        } catch (E) {
          await t.warning(
            `  Could not get variant properties from component set: ${E}`
          );
        }
      }
    } catch (P) {
    }
    let N, V;
    try {
      let P = o.parent;
      const E = [];
      let k = 0;
      const j = 20;
      for (; P && k < j; )
        try {
          const C = P.type, v = P.name;
          if (C === "COMPONENT_SET" && !V && (V = v), C === "PAGE")
            break;
          const h = v || "";
          E.unshift(h), (V === "arrow-top-right-on-square" || g === "arrow-top-right-on-square") && await t.log(
            `  [PATH BUILD] Added segment: "${h}" (type: ${C}) to path for component "${g}"`
          ), P = P.parent, k++;
        } catch (C) {
          (V === "arrow-top-right-on-square" || g === "arrow-top-right-on-square") && await t.warning(
            `  [PATH BUILD] Error building path for "${g}": ${C}`
          );
          break;
        }
      N = E, (V === "arrow-top-right-on-square" || g === "arrow-top-right-on-square") && await t.log(
        `  [PATH BUILD] Final path for component "${g}": [${E.join(" → ")}]`
      );
    } catch (P) {
    }
    const R = de(de(de(de({
      instanceType: r,
      componentName: g
    }, V && { componentSetName: V }), c && { variantProperties: c }), T && { componentProperties: T }), r === "normal" ? { path: N || [] } : N && N.length > 0 && {
      path: N
    });
    if (r === "internal") {
      R.componentNodeId = o.id, await t.log(
        `  Found INSTANCE: "${d}" -> INTERNAL component "${g}" (ID: ${o.id.substring(0, 8)}...)`
      );
      const P = e.boundVariables, E = o.boundVariables;
      if (P && typeof P == "object") {
        const h = Object.keys(P);
        await t.log(
          `  DEBUG: Internal instance "${d}" -> boundVariables keys: ${h.length > 0 ? h.join(", ") : "none"}`
        );
        for (const A of h) {
          const O = P[A], K = (O == null ? void 0 : O.type) || typeof O;
          await t.log(
            `  DEBUG:   boundVariables.${A}: type=${K}, value=${JSON.stringify(O)}`
          );
        }
        const I = [
          "backgrounds",
          "selectionColor",
          "selectionColors",
          "selection",
          "selectColor"
        ];
        for (const A of I)
          P[A] !== void 0 && await t.log(
            `  DEBUG:   Found potential "Selection colors" property: boundVariables.${A} = ${JSON.stringify(P[A])}`
          );
      } else
        await t.log(
          `  DEBUG: Internal instance "${d}" -> No boundVariables found on instance node`
        );
      if (E && typeof E == "object") {
        const h = Object.keys(E);
        await t.log(
          `  DEBUG: Main component "${g}" -> boundVariables keys: ${h.length > 0 ? h.join(", ") : "none"}`
        );
      }
      const k = e.backgrounds;
      if (k && Array.isArray(k)) {
        await t.log(
          `  DEBUG: Internal instance "${d}" -> backgrounds array length: ${k.length}`
        );
        for (let h = 0; h < k.length; h++) {
          const I = k[h];
          if (I && typeof I == "object") {
            if (await t.log(
              `  DEBUG:   backgrounds[${h}] structure: ${JSON.stringify(Object.keys(I))}`
            ), I.boundVariables) {
              const A = Object.keys(I.boundVariables);
              await t.log(
                `  DEBUG:   backgrounds[${h}].boundVariables keys: ${A.length > 0 ? A.join(", ") : "none"}`
              );
              for (const O of A) {
                const K = I.boundVariables[O];
                await t.log(
                  `  DEBUG:     backgrounds[${h}].boundVariables.${O}: ${JSON.stringify(K)}`
                );
              }
            }
            I.color && await t.log(
              `  DEBUG:   backgrounds[${h}].color: ${JSON.stringify(I.color)}`
            );
          }
        }
      }
      const j = Object.keys(e).filter(
        (h) => !h.startsWith("_") && h !== "parent" && h !== "removed" && typeof e[h] != "function" && h !== "type" && h !== "id" && h !== "name" && h !== "boundVariables" && h !== "backgrounds" && h !== "fills"
      ), C = Object.keys(o).filter(
        (h) => !h.startsWith("_") && h !== "parent" && h !== "removed" && typeof o[h] != "function" && h !== "type" && h !== "id" && h !== "name" && h !== "boundVariables" && h !== "backgrounds" && h !== "fills"
      ), v = [
        .../* @__PURE__ */ new Set([...j, ...C])
      ].filter(
        (h) => h.toLowerCase().includes("selection") || h.toLowerCase().includes("select") || h.toLowerCase().includes("color") && !h.toLowerCase().includes("fill") && !h.toLowerCase().includes("stroke")
      );
      if (v.length > 0) {
        await t.log(
          `  DEBUG: Found selection/color-related properties: ${v.join(", ")}`
        );
        for (const h of v)
          try {
            if (j.includes(h)) {
              const I = e[h];
              await t.log(
                `  DEBUG:   Instance.${h}: ${JSON.stringify(I)}`
              );
            }
            if (C.includes(h)) {
              const I = o[h];
              await t.log(
                `  DEBUG:   MainComponent.${h}: ${JSON.stringify(I)}`
              );
            }
          } catch (I) {
          }
      } else
        await t.log(
          "  DEBUG: No selection/color-related properties found on instance or main component"
        );
    } else if (r === "normal") {
      const P = y || p;
      if (P) {
        R.componentPageName = P.name;
        const k = At(P);
        k != null && k.id && k.version !== void 0 ? (R.componentGuid = k.id, R.componentVersion = k.version, await t.log(
          `  Found INSTANCE: "${d}" -> NORMAL component "${g}" (ID: ${o.id.substring(0, 8)}...) at path [${(N || []).join(" → ")}]`
        )) : await t.warning(
          `  Instance "${d}" -> component "${g}" is classified as normal but page "${P.name}" has no metadata. This instance will not be importable.`
        );
      } else {
        const k = o.id;
        let j = "", C = "";
        switch (b.reason) {
          case "broken_chain":
            j = "The component's parent chain is broken and cannot be traversed to find the page", C = "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            j = "Cannot access the component's parent chain (access error)", C = "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            j = "Cannot determine which page the component is on", C = "Please ensure the component is properly placed on a page.";
        }
        try {
          await figma.viewport.scrollAndZoomIntoView([o]);
        } catch (I) {
          console.warn("Could not scroll to component:", I);
        }
        const v = `Normal instance "${d}" -> component "${g}" (ID: ${k}) has no componentPage. ${j}. ${C} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", v), await t.error(v);
        const h = new Error(v);
        throw console.error("Throwing error:", h), h;
      }
      N === void 0 && console.warn(
        `Failed to build path for normal instance "${d}" -> component "${g}". Path is required for resolution.`
      );
      const E = N && N.length > 0 ? ` at path [${N.join(" → ")}]` : " at page root";
      await t.log(
        `  Found INSTANCE: "${d}" -> NORMAL component "${g}" (ID: ${o.id.substring(0, 8)}...)${E}`
      );
    } else if (r === "remote") {
      let P, E;
      const k = a.detachedComponentsHandled.has(
        o.id
      );
      if (!k)
        try {
          if (typeof o.getPublishStatusAsync == "function")
            try {
              const C = await o.getPublishStatusAsync();
              C && typeof C == "object" && (C.libraryName && (P = C.libraryName), C.libraryKey && (E = C.libraryKey));
            } catch (C) {
            }
          try {
            const C = figma.teamLibrary;
            if (typeof (C == null ? void 0 : C.getAvailableLibraryComponentSetsAsync) == "function") {
              const v = await C.getAvailableLibraryComponentSetsAsync();
              if (v && Array.isArray(v)) {
                for (const h of v)
                  if (h.key === o.key || h.name === o.name) {
                    h.libraryName && (P = h.libraryName), h.libraryKey && (E = h.libraryKey);
                    break;
                  }
              }
            }
          } catch (C) {
          }
        } catch (C) {
          console.warn(
            `Error getting library info for remote component "${g}":`,
            C
          );
        }
      if (P && (R.remoteLibraryName = P), E && (R.remoteLibraryKey = E), k && (R.componentNodeId = o.id), a.instanceTable.getInstanceIndex(R) !== -1)
        await t.log(
          `  Found INSTANCE: "${d}" -> REMOTE component "${g}" (ID: ${o.id.substring(0, 8)}...)${k ? " [DETACHED]" : ""}`
        );
      else
        try {
          const { parseBaseNodeProperties: C } = await Promise.resolve().then(() => Na), v = await C(e, a), { parseFrameProperties: h } = await Promise.resolve().then(() => Ea), I = await h(e, a), A = Ee(de(de({}, v), I), {
            type: "COMPONENT"
            // Convert to COMPONENT type for recreation (must be after baseProps to override)
          });
          if (e.children && Array.isArray(e.children) && e.children.length > 0) {
            const O = Ee(de({}, a), {
              depth: (a.depth || 0) + 1
            }), { extractNodeData: K } = await Promise.resolve().then(() => La), ne = [];
            for (const M of e.children)
              try {
                let L;
                if (M.type === "INSTANCE")
                  try {
                    const z = await M.getMainComponentAsync();
                    if (z) {
                      const J = await C(
                        M,
                        a
                      ), D = await h(
                        M,
                        a
                      ), W = await K(
                        z,
                        /* @__PURE__ */ new WeakSet(),
                        O
                      );
                      L = Ee(de(de(de({}, W), J), D), {
                        type: "COMPONENT"
                        // Convert to COMPONENT
                      });
                    } else
                      L = await K(
                        M,
                        /* @__PURE__ */ new WeakSet(),
                        O
                      ), L.type === "INSTANCE" && (L.type = "COMPONENT"), delete L._instanceRef;
                  } catch (z) {
                    L = await K(
                      M,
                      /* @__PURE__ */ new WeakSet(),
                      O
                    ), L.type === "INSTANCE" && (L.type = "COMPONENT"), delete L._instanceRef;
                  }
                else {
                  L = await K(
                    M,
                    /* @__PURE__ */ new WeakSet(),
                    O
                  );
                  const z = M.boundVariables;
                  if (z && typeof z == "object") {
                    const J = Object.keys(z);
                    J.length > 0 && (await t.log(
                      `  DEBUG: Child "${M.name || "Unnamed"}" -> boundVariables keys: ${J.join(", ")}`
                    ), z.backgrounds !== void 0 && await t.log(
                      `  DEBUG:   Child "${M.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(z.backgrounds)}`
                    ));
                  }
                  if (o.children && Array.isArray(o.children)) {
                    const J = o.children.find(
                      (D) => D.name === M.name
                    );
                    if (J) {
                      const D = J.boundVariables;
                      if (D && typeof D == "object") {
                        const W = Object.keys(D);
                        if (W.length > 0 && (await t.log(
                          `  DEBUG: Main component child "${J.name || "Unnamed"}" -> boundVariables keys: ${W.join(", ")}`
                        ), D.backgrounds !== void 0 && (await t.log(
                          `  DEBUG:   Main component child "${J.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(D.backgrounds)}`
                        ), !z || !z.backgrounds))) {
                          await t.log(
                            "  DEBUG:   Instance child doesn't have boundVariables.backgrounds, but main component child does - preserving from main component"
                          );
                          const { extractBoundVariables: te } = await Promise.resolve().then(() => Je), q = await te(
                            D,
                            a.variableTable,
                            a.collectionTable
                          );
                          L.boundVariables || (L.boundVariables = {}), q.backgrounds && (L.boundVariables.backgrounds = q.backgrounds, await t.log(
                            "  DEBUG:   ✓ Added boundVariables.backgrounds to childData from main component child"
                          ));
                        }
                      }
                    }
                  }
                }
                ne.push(L);
              } catch (L) {
                console.warn(
                  `Failed to extract child "${M.name || "Unnamed"}" for remote component "${g}":`,
                  L
                );
              }
            A.children = ne;
          }
          if (!A)
            throw new Error("Failed to build structure for remote instance");
          try {
            const O = e.boundVariables;
            if (O && typeof O == "object") {
              const G = Object.keys(O);
              await t.log(
                `  DEBUG: Instance "${d}" -> boundVariables keys: ${G.length > 0 ? G.join(", ") : "none"}`
              );
              for (const Q of G) {
                const ee = O[Q], oe = (ee == null ? void 0 : ee.type) || typeof ee;
                if (await t.log(
                  `  DEBUG:   boundVariables.${Q}: type=${oe}, value=${JSON.stringify(ee)}`
                ), ee && typeof ee == "object" && !Array.isArray(ee)) {
                  const se = Object.keys(ee);
                  if (se.length > 0) {
                    await t.log(
                      `  DEBUG:     boundVariables.${Q} has nested keys: ${se.join(", ")}`
                    );
                    for (const re of se) {
                      const ce = ee[re];
                      ce && typeof ce == "object" && ce.type === "VARIABLE_ALIAS" && await t.log(
                        `  DEBUG:       boundVariables.${Q}.${re}: VARIABLE_ALIAS id=${ce.id}`
                      );
                    }
                  }
                }
              }
              const Z = [
                "backgrounds",
                "selectionColor",
                "selectionColors",
                "selection",
                "selectColor"
              ];
              for (const Q of Z)
                O[Q] !== void 0 && await t.log(
                  `  DEBUG:   Found potential "Selection colors" property: boundVariables.${Q} = ${JSON.stringify(O[Q])}`
                );
            } else
              await t.log(
                `  DEBUG: Instance "${d}" -> No boundVariables found on instance node`
              );
            const K = O && O.fills !== void 0 && O.fills !== null, ne = A.fills !== void 0 && Array.isArray(A.fills) && A.fills.length > 0, M = e.fills !== void 0 && Array.isArray(e.fills) && e.fills.length > 0, L = o.fills !== void 0 && Array.isArray(o.fills) && o.fills.length > 0;
            if (await t.log(
              `  DEBUG: Instance "${d}" -> fills check: instanceHasFills=${M}, structureHasFills=${ne}, mainComponentHasFills=${L}, hasInstanceFillsBoundVar=${!!K}`
            ), K && !ne) {
              await t.log(
                "  DEBUG: Instance has boundVariables.fills but structure has no fills - attempting to get fills"
              );
              try {
                if (M) {
                  const { serializeFills: G } = await Promise.resolve().then(() => Je), Z = await G(
                    e.fills,
                    a.variableTable,
                    a.collectionTable
                  );
                  A.fills = Z, await t.log(
                    `  DEBUG: Got ${Z.length} fill(s) from instance node`
                  );
                } else if (L) {
                  const { serializeFills: G } = await Promise.resolve().then(() => Je), Z = await G(
                    o.fills,
                    a.variableTable,
                    a.collectionTable
                  );
                  A.fills = Z, await t.log(
                    `  DEBUG: Got ${Z.length} fill(s) from main component`
                  );
                } else
                  await t.warning(
                    "  DEBUG: Instance has boundVariables.fills but neither instance nor main component has fills"
                  );
              } catch (G) {
                await t.warning(
                  `  Failed to get fills: ${G}`
                );
              }
            }
            const z = e.selectionColor, J = o.selectionColor;
            z !== void 0 && await t.log(
              `  DEBUG: Instance "${d}" -> selectionColor: ${JSON.stringify(z)}`
            ), J !== void 0 && await t.log(
              `  DEBUG: Main component "${g}" -> selectionColor: ${JSON.stringify(J)}`
            );
            const D = Object.keys(e).filter(
              (G) => !G.startsWith("_") && G !== "parent" && G !== "removed" && typeof e[G] != "function" && G !== "type" && G !== "id" && G !== "name"
            ), W = Object.keys(o).filter(
              (G) => !G.startsWith("_") && G !== "parent" && G !== "removed" && typeof o[G] != "function" && G !== "type" && G !== "id" && G !== "name"
            ), te = [
              .../* @__PURE__ */ new Set([...D, ...W])
            ].filter(
              (G) => G.toLowerCase().includes("selection") || G.toLowerCase().includes("select") || G.toLowerCase().includes("color") && !G.toLowerCase().includes("fill") && !G.toLowerCase().includes("stroke")
            );
            if (te.length > 0) {
              await t.log(
                `  DEBUG: Found selection/color-related properties: ${te.join(", ")}`
              );
              for (const G of te)
                try {
                  if (D.includes(G)) {
                    const Z = e[G];
                    await t.log(
                      `  DEBUG:   Instance.${G}: ${JSON.stringify(Z)}`
                    );
                  }
                  if (W.includes(G)) {
                    const Z = o[G];
                    await t.log(
                      `  DEBUG:   MainComponent.${G}: ${JSON.stringify(Z)}`
                    );
                  }
                } catch (Z) {
                }
            } else
              await t.log(
                "  DEBUG: No selection/color-related properties found on instance or main component"
              );
            const q = o.boundVariables;
            if (q && typeof q == "object") {
              const G = Object.keys(q);
              if (G.length > 0) {
                await t.log(
                  `  DEBUG: Main component "${g}" -> boundVariables keys: ${G.join(", ")}`
                ), G.includes("selectionColor") ? await t.log(
                  `[ISSUE #2 EXPORT] Main component "${g}" HAS selectionColor in boundVariables: ${JSON.stringify(q.selectionColor)}`
                ) : await t.log(
                  `[ISSUE #2 EXPORT] Main component "${g}" does NOT have selectionColor in boundVariables (has: ${G.join(", ")})`
                );
                for (const Z of G) {
                  const Q = q[Z], ee = (Q == null ? void 0 : Q.type) || typeof Q;
                  await t.log(
                    `  DEBUG:   Main component boundVariables.${Z}: type=${ee}, value=${JSON.stringify(Q)}`
                  );
                }
              } else
                await t.log(
                  `[ISSUE #2 EXPORT] Main component "${g}" has no boundVariables`
                );
            } else
              await t.log(
                `[ISSUE #2 EXPORT] Main component "${g}" boundVariables is null/undefined`
              );
            if (O && Object.keys(O).length > 0) {
              await t.log(
                `  DEBUG: Preserving instance's boundVariables in structure (${Object.keys(O).length} key(s))`
              );
              const { extractBoundVariables: G } = await Promise.resolve().then(() => Je), Z = await G(
                O,
                a.variableTable,
                a.collectionTable
              );
              A.boundVariables || (A.boundVariables = {});
              for (const [Q, ee] of Object.entries(
                Z
              ))
                ee !== void 0 && (A.boundVariables[Q] !== void 0 && await t.log(
                  `  DEBUG: Structure already has boundVariables.${Q} from baseProps, but instance also has it - using instance's boundVariables.${Q}`
                ), A.boundVariables[Q] = ee, await t.log(
                  `  DEBUG: Set boundVariables.${Q} in structure: ${JSON.stringify(ee)}`
                ));
              Z.fills !== void 0 ? await t.log(
                "  DEBUG: ✓ Preserved boundVariables.fills from instance"
              ) : K && await t.warning(
                "  DEBUG: Instance has boundVariables.fills but extractBoundVariables didn't extract it"
              ), Z.backgrounds !== void 0 ? await t.log(
                `  DEBUG: ✓ Preserved boundVariables.backgrounds from instance: ${JSON.stringify(Z.backgrounds)}`
              ) : O && O.backgrounds !== void 0 && await t.warning(
                "  DEBUG: Instance has boundVariables.backgrounds but extractBoundVariables didn't extract it"
              );
            }
            if (q && Object.keys(q).length > 0) {
              await t.log(
                `  DEBUG: Checking main component's boundVariables for properties not in instance (${Object.keys(q).length} key(s))`
              );
              const { extractBoundVariables: G } = await Promise.resolve().then(() => Je), Z = await G(
                q,
                a.variableTable,
                a.collectionTable
              );
              A.boundVariables || (A.boundVariables = {});
              for (const [Q, ee] of Object.entries(
                Z
              ))
                ee !== void 0 && (A.boundVariables[Q] === void 0 ? (A.boundVariables[Q] = ee, Q === "selectionColor" ? await t.log(
                  `[ISSUE #2 EXPORT] Added boundVariables.selectionColor from main component "${g}" to instance "${d}": ${JSON.stringify(ee)}`
                ) : await t.log(
                  `  DEBUG: Added boundVariables.${Q} from main component (not in instance): ${JSON.stringify(ee)}`
                )) : Q === "selectionColor" ? await t.log(
                  `[ISSUE #2 EXPORT] Skipped boundVariables.selectionColor from main component "${g}" (instance "${d}" already has it)`
                ) : await t.log(
                  `  DEBUG: Skipped boundVariables.${Q} from main component (instance already has it)`
                ));
            }
            await t.log(
              `  DEBUG: Final structure for "${g}": hasFills=${!!A.fills}, fillsCount=${((l = A.fills) == null ? void 0 : l.length) || 0}, hasBoundVars=${!!A.boundVariables}, boundVarsKeys=${A.boundVariables ? Object.keys(A.boundVariables).join(", ") : "none"}`
            ), (s = A.boundVariables) != null && s.fills && await t.log(
              `  DEBUG: Structure boundVariables.fills: ${JSON.stringify(A.boundVariables.fills)}`
            );
          } catch (O) {
            await t.warning(
              `  Failed to handle bound variables for fills: ${O}`
            );
          }
          R.structure = A, k ? await t.log(
            `  Extracted structure for detached component "${g}" (ID: ${o.id.substring(0, 8)}...)`
          ) : await t.log(
            `  Extracted structure from instance for remote component "${g}" (preserving size overrides: ${e.width}x${e.height})`
          ), await t.log(
            `  Found INSTANCE: "${d}" -> REMOTE component "${g}" (ID: ${o.id.substring(0, 8)}...)${k ? " [DETACHED]" : ""}`
          );
        } catch (C) {
          const v = `Failed to extract structure for remote component "${g}": ${C instanceof Error ? C.message : String(C)}`;
          console.error(v, C), await t.error(v);
        }
    }
    if (r === "normal" && o) {
      if (e.children && Array.isArray(e.children) && e.children.length > 0) {
        await t.log(
          `[DEBUG] Normal instance "${d}" has ${e.children.length} child(ren) (unexpected for normal instance):`
        );
        for (let P = 0; P < Math.min(e.children.length, 5); P++) {
          const E = e.children[P];
          if (E) {
            const k = E.name || `Child ${P}`, j = E.type || "UNKNOWN", C = E.boundVariables, v = E.fills;
            if (await t.log(
              `[DEBUG]   Child ${P}: "${k}" (${j}) - hasBoundVars=${!!C}, hasFills=${!!v}`
            ), C) {
              const h = Object.keys(C);
              await t.log(
                `[DEBUG]     boundVariables: ${h.join(", ")}`
              );
            }
          }
        }
      }
      if (o.children && Array.isArray(o.children) && o.children.length > 0) {
        await t.log(
          `[DEBUG] Main component "${g}" has ${o.children.length} child(ren):`
        );
        for (let P = 0; P < Math.min(o.children.length, 5); P++) {
          const E = o.children[P];
          if (E) {
            const k = E.name || `Child ${P}`, j = E.type || "UNKNOWN", C = E.boundVariables, v = E.fills;
            if (await t.log(
              `[DEBUG]   Main component child ${P}: "${k}" (${j}) - hasBoundVars=${!!C}, hasFills=${!!v}`
            ), C) {
              const h = Object.keys(C);
              await t.log(
                `[DEBUG]     boundVariables: ${h.join(", ")}`
              ), C.fills && await t.log(
                `[DEBUG]     boundVariables.fills: ${JSON.stringify(C.fills)}`
              );
            }
            if (v && Array.isArray(v) && v.length > 0) {
              const h = v[0];
              h && typeof h == "object" && await t.log(
                `[DEBUG]     fills[0]: type=${h.type}, color=${JSON.stringify(h.color)}`
              );
            }
            if (e.children && Array.isArray(e.children) && P < e.children.length) {
              const h = e.children[P];
              if (h && h.name === k) {
                const I = h.boundVariables, A = I ? Object.keys(I) : [], O = C ? Object.keys(C) : [], K = A.filter(
                  (ne) => !O.includes(ne)
                );
                if (K.length > 0) {
                  await t.log(
                    `[DEBUG] Instance "${d}" child "${k}" has instance override bound variables: ${K.join(", ")} (will be exported with instance children)`
                  );
                  for (const ne of K)
                    await t.log(
                      `[DEBUG]   Instance child boundVariables.${ne}: ${JSON.stringify(I[ne])}`
                    );
                }
              }
            }
          }
        }
      }
      try {
        const P = o.boundVariables;
        if (P && typeof P == "object") {
          const E = Object.keys(P);
          if (E.length > 0) {
            await t.log(
              `[ISSUE #2 EXPORT] Normal instance "${d}" -> checking main component "${g}" boundVariables (${E.length} key(s))`
            ), E.includes("selectionColor") ? await t.log(
              `[ISSUE #2 EXPORT] Main component "${g}" HAS selectionColor in boundVariables: ${JSON.stringify(P.selectionColor)}`
            ) : await t.log(
              `[ISSUE #2 EXPORT] Main component "${g}" does NOT have selectionColor in boundVariables (has: ${E.join(", ")})`
            );
            const { extractBoundVariables: k } = await Promise.resolve().then(() => Je), j = await k(
              P,
              a.variableTable,
              a.collectionTable
            );
            n.boundVariables || (n.boundVariables = {});
            for (const [C, v] of Object.entries(
              j
            ))
              v !== void 0 && (n.boundVariables[C] === void 0 ? (n.boundVariables[C] = v, C === "selectionColor" ? await t.log(
                `[ISSUE #2 EXPORT] Added boundVariables.selectionColor from main component "${g}" to normal instance "${d}": ${JSON.stringify(v)}`
              ) : await t.log(
                `  DEBUG: Added boundVariables.${C} from main component to normal instance: ${JSON.stringify(v)}`
              )) : C === "selectionColor" && await t.log(
                `[ISSUE #2 EXPORT] Skipped boundVariables.selectionColor from main component "${g}" (normal instance "${d}" already has it)`
              ));
          } else
            await t.log(
              `[ISSUE #2 EXPORT] Main component "${g}" has no boundVariables`
            );
        } else
          await t.log(
            `[ISSUE #2 EXPORT] Main component "${g}" boundVariables is null/undefined`
          );
      } catch (P) {
        await t.warning(
          `[ISSUE #2 EXPORT] Error checking main component boundVariables for normal instance "${d}": ${P}`
        );
      }
    }
    const ae = a.instanceTable.addInstance(R);
    n._instanceRef = ae, i.add("_instanceRef");
  }
  return n;
}
class at {
  constructor() {
    Ae(this, "instanceMap");
    // unique key -> index
    Ae(this, "instances");
    // index -> instance data
    Ae(this, "nextIndex");
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
    const n = new at(), i = Object.entries(a).sort(
      (l, s) => parseInt(l[0], 10) - parseInt(s[0], 10)
    );
    for (const [l, s] of i) {
      const o = parseInt(l, 10), d = n.generateKey(s);
      n.instanceMap.set(d, o), n.instances[o] = s, n.nextIndex = Math.max(n.nextIndex, o + 1);
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
const Ft = {
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
function Ra() {
  const e = {};
  for (const [a, n] of Object.entries(Ft))
    e[n] = a;
  return e;
}
function Pt(e) {
  var a;
  return (a = Ft[e]) != null ? a : e;
}
function ka(e) {
  var a;
  return typeof e == "number" ? (a = Ra()[e]) != null ? a : e.toString() : e;
}
const Gt = {
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
}, bt = {};
for (const [e, a] of Object.entries(Gt))
  bt[a] = e;
class ct {
  constructor() {
    Ae(this, "shortToLong");
    Ae(this, "longToShort");
    this.shortToLong = de({}, bt), this.longToShort = de({}, Gt);
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
      for (const l of Object.keys(a))
        i.add(l);
      for (const [l, s] of Object.entries(a)) {
        const o = this.getShortName(l);
        if (o !== l && !i.has(o)) {
          let d = this.compressObject(s);
          o === "type" && typeof d == "string" && (d = Pt(d)), n[o] = d;
        } else {
          let d = this.compressObject(s);
          l === "type" && typeof d == "string" && (d = Pt(d)), n[l] = d;
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
      for (const [i, l] of Object.entries(a)) {
        const s = this.getLongName(i);
        let o = this.expandObject(l);
        (s === "type" || i === "type") && (typeof o == "number" || typeof o == "string") && (o = ka(o)), n[s] = o;
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
    return de({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(a) {
    const n = new ct();
    n.shortToLong = de(de({}, bt), a), n.longToShort = {};
    for (const [i, l] of Object.entries(
      n.shortToLong
    ))
      n.longToShort[l] = i;
    return n;
  }
}
function Ua(e, a) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const n = {};
  e.metadata && (n.metadata = e.metadata);
  for (const [i, l] of Object.entries(e))
    i !== "metadata" && (n[i] = a.compressObject(l));
  return n;
}
function Ba(e, a) {
  return a.expandObject(e);
}
function st(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
function dt(e) {
  let a = 1;
  return e.children && e.children.length > 0 && e.children.forEach((n) => {
    a += dt(n);
  }), a;
}
function _t(e) {
  let a = 0;
  if ((e.cnsHr !== void 0 || e.cnsVr !== void 0) && (a = 1), (e.constraintHorizontal !== void 0 || e.constraintVertical !== void 0) && a === 0 && (a = 1), e.children && Array.isArray(e.children))
    for (const n of e.children)
      n && typeof n == "object" && (a += _t(n));
  return a;
}
async function gt(e, a = /* @__PURE__ */ new WeakSet(), n = {}) {
  var $, b, p, r, y, c, T;
  if (!e || typeof e != "object")
    return e;
  const i = ($ = n.maxNodes) != null ? $ : 1e4, l = (b = n.nodeCount) != null ? b : 0;
  if (l >= i)
    return await t.warning(
      `Maximum node count (${i}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: l
    };
  const s = {
    visited: (p = n.visited) != null ? p : /* @__PURE__ */ new WeakSet(),
    depth: (r = n.depth) != null ? r : 0,
    maxDepth: (y = n.maxDepth) != null ? y : 100,
    nodeCount: l + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: n.variableTable,
    collectionTable: n.collectionTable,
    instanceTable: n.instanceTable,
    detachedComponentsHandled: (c = n.detachedComponentsHandled) != null ? c : /* @__PURE__ */ new Set(),
    exportedIds: (T = n.exportedIds) != null ? T : /* @__PURE__ */ new Map()
  };
  if (a.has(e))
    return "[Circular Reference]";
  a.add(e), s.visited = a;
  const o = {}, d = await Bt(e, s);
  if (Object.assign(o, d), o.id && s.exportedIds) {
    const N = s.exportedIds.get(o.id);
    if (N !== void 0) {
      const V = o.name || "Unnamed";
      if (N !== V) {
        const R = `Duplicate ID detected during export: ID "${o.id.substring(0, 8)}..." is used by both "${N}" and "${V}". Each node must have a unique ID.`;
        throw await t.error(R), new Error(R);
      }
      await t.warning(
        `Node "${V}" (ID: ${o.id.substring(0, 8)}...) was encountered multiple times during export. This may indicate a structural issue.`
      );
    } else
      s.exportedIds.set(o.id, o.name || "Unnamed");
  }
  const g = e.type;
  if (g)
    switch (g) {
      case "FRAME":
      case "COMPONENT": {
        const N = await yt(e);
        Object.assign(o, N);
        break;
      }
      case "INSTANCE": {
        const N = await xa(
          e,
          s
        );
        Object.assign(o, N);
        const V = await yt(
          e
        );
        Object.assign(o, V);
        break;
      }
      case "TEXT": {
        const N = await Sa(e);
        Object.assign(o, N);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const N = await Pa(e);
        Object.assign(o, N);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const N = await Ta(e);
        Object.assign(o, N);
        break;
      }
      default:
        s.unhandledKeys.add("_unknownType");
        break;
    }
  const w = Object.getOwnPropertyNames(e), u = /* @__PURE__ */ new Set([
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
  (g === "FRAME" || g === "COMPONENT" || g === "INSTANCE") && (u.add("layoutMode"), u.add("primaryAxisSizingMode"), u.add("counterAxisSizingMode"), u.add("primaryAxisAlignItems"), u.add("counterAxisAlignItems"), u.add("paddingLeft"), u.add("paddingRight"), u.add("paddingTop"), u.add("paddingBottom"), u.add("itemSpacing"), u.add("counterAxisSpacing"), u.add("cornerRadius"), u.add("clipsContent"), u.add("layoutWrap"), u.add("layoutGrow")), g === "TEXT" && (u.add("characters"), u.add("fontName"), u.add("fontSize"), u.add("textAlignHorizontal"), u.add("textAlignVertical"), u.add("letterSpacing"), u.add("lineHeight"), u.add("textCase"), u.add("textDecoration"), u.add("textAutoResize"), u.add("paragraphSpacing"), u.add("paragraphIndent"), u.add("listOptions")), (g === "VECTOR" || g === "LINE") && (u.add("fillGeometry"), u.add("strokeGeometry")), (g === "RECTANGLE" || g === "ELLIPSE" || g === "STAR" || g === "POLYGON") && (u.add("pointCount"), u.add("innerRadius"), u.add("arcData")), g === "INSTANCE" && (u.add("mainComponent"), u.add("componentProperties"));
  for (const N of w)
    typeof e[N] != "function" && (u.has(N) || s.unhandledKeys.add(N));
  if (s.unhandledKeys.size > 0 && (o._unhandledKeys = Array.from(s.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const N = s.maxDepth;
    if (s.depth >= N)
      o.children = {
        _truncated: !0,
        _reason: `Maximum depth (${N}) reached`,
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
      const V = Ee(de({}, s), {
        depth: s.depth + 1
      }), R = [];
      let ae = !1;
      for (const P of e.children) {
        if (V.nodeCount >= i) {
          o.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: R.length,
            _total: e.children.length,
            children: R
          }, ae = !0;
          break;
        }
        const E = await gt(P, a, V);
        R.push(E), V.nodeCount && (s.nodeCount = V.nodeCount);
      }
      ae || (o.children = R);
    }
  }
  return o;
}
async function We(e, a = /* @__PURE__ */ new Set(), n = !1, i = /* @__PURE__ */ new Set()) {
  e.clearConsole !== !1 && !n ? (await t.clear(), await t.log("=== Starting Page Export ===")) : n || await t.log("=== Starting Page Export ===");
  try {
    const s = e.pageIndex;
    if (s === void 0 || typeof s != "number")
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
    if (await t.log(`Loaded ${o.length} page(s)`), s < 0 || s >= o.length)
      return await t.error(
        `Invalid page index: ${s} (valid range: 0-${o.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const d = o[s], g = d.id;
    if (e.skipPrompts) {
      if (i.has(g))
        return await t.log(
          `Page "${d.name}" already discovered, skipping discovery...`
        ), {
          type: "exportPage",
          success: !0,
          error: !1,
          message: "Page already discovered",
          data: {
            filename: "",
            pageData: {},
            pageName: d.name,
            additionalPages: [],
            discoveredReferencedPages: []
          }
        };
      i.add(g);
    } else {
      if (a.has(g))
        return await t.log(
          `Page "${d.name}" has already been processed, skipping...`
        ), {
          type: "exportPage",
          success: !1,
          error: !0,
          message: "Page already processed",
          data: {}
        };
      a.add(g);
    }
    await t.log(
      `Selected page: "${d.name}" (index: ${s})`
    ), await t.log(
      "Initializing variable, collection, and instance tables..."
    );
    const w = new tt(), u = new et(), $ = new at();
    await t.log("Extracting node data from page..."), await t.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await t.log(
      "Collections will be discovered as variables are processed:"
    );
    const b = await gt(
      d,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: w,
        collectionTable: u,
        instanceTable: $
      }
    );
    await t.log("Node extraction finished");
    const p = dt(b), r = w.getSize(), y = u.getSize(), c = $.getSize(), T = _t(b);
    await t.log("Extraction complete:"), await t.log(`  - Total nodes: ${p}`), await t.log(`  - Unique variables: ${r}`), await t.log(`  - Unique collections: ${y}`), await t.log(`  - Unique instances: ${c}`), await t.log(
      `  - Nodes with constraints exported: ${T}`
    );
    const N = $.getSerializedTable(), V = /* @__PURE__ */ new Map();
    for (const [z, J] of Object.entries(N))
      if (J.instanceType === "remote") {
        const D = parseInt(z, 10);
        V.set(D, J);
      }
    if (e.validateOnly) {
      await t.log("=== Validation Mode ===");
      const z = await figma.variables.getLocalVariableCollectionsAsync(), J = /* @__PURE__ */ new Set(), D = /* @__PURE__ */ new Set();
      for (const ee of z)
        J.add(ee.id), D.add(ee.name);
      D.add("Token"), D.add("Tokens"), D.add("Theme"), D.add("Themes");
      const W = [], te = [];
      for (const ee of V.values()) {
        const oe = ee.componentName || "(unnamed)";
        W.push({
          componentName: oe,
          pageName: d.name
        }), te.push({
          type: "externalReference",
          message: `External reference found: "${oe}" references a component from another file`,
          componentName: oe,
          pageName: d.name
        });
      }
      const q = [], G = u.getTable();
      for (const ee of Object.values(G))
        ee.isLocal ? J.has(ee.collectionId) || (q.push({
          collectionName: ee.collectionName,
          collectionId: ee.collectionId,
          pageName: d.name
        }), te.push({
          type: "unknownCollection",
          message: `Unknown local collection: "${ee.collectionName}"`,
          collectionName: ee.collectionName,
          pageName: d.name
        })) : D.has(ee.collectionName) || (q.push({
          collectionName: ee.collectionName,
          collectionId: ee.collectionId,
          pageName: d.name
        }), te.push({
          type: "unknownCollection",
          message: `Unknown remote collection: "${ee.collectionName}". Remote collections must be named "Token", "Tokens", "Theme", or "Themes"`,
          collectionName: ee.collectionName,
          pageName: d.name
        }));
      const Z = Object.values(G).map(
        (ee) => ee.collectionName
      ), Q = {
        hasErrors: te.length > 0,
        errors: te,
        externalReferences: W,
        unknownCollections: q,
        discoveredCollections: Z
      };
      return await t.log("Validation complete:"), await t.log(
        `  - External references: ${W.length}`
      ), await t.log(
        `  - Unknown collections: ${q.length}`
      ), await t.log(`  - Has errors: ${Q.hasErrors}`), {
        type: "exportPage",
        success: !0,
        error: !1,
        message: "Validation complete",
        data: {
          filename: "",
          pageData: {},
          pageName: d.name,
          additionalPages: [],
          validationResult: Q
        }
      };
    }
    if (V.size > 0) {
      await t.error(
        `Found ${V.size} remote instance(s) - remote instances are not supported during publishing`
      );
      const z = (te, q, G = [], Z = !1) => {
        const Q = [];
        if (!te || typeof te != "object")
          return Q;
        if (Z || te.type === "PAGE") {
          const re = te.children || te.child;
          if (Array.isArray(re))
            for (const ce of re)
              ce && typeof ce == "object" && Q.push(
                ...z(
                  ce,
                  q,
                  [],
                  !1
                )
              );
          return Q;
        }
        const ee = te.name || "";
        if (typeof te._instanceRef == "number" && te._instanceRef === q) {
          const re = ee || "(unnamed)", ce = G.length > 0 ? [...G, re] : [re];
          return Q.push({
            path: ce,
            nodeName: re
          }), Q;
        }
        const oe = ee ? [...G, ee] : G, se = te.children || te.child;
        if (Array.isArray(se))
          for (const re of se)
            re && typeof re == "object" && Q.push(
              ...z(
                re,
                q,
                oe,
                !1
              )
            );
        return Q;
      }, J = [];
      let D = 1;
      for (const [te, q] of V.entries()) {
        const G = q.componentName || "(unnamed)", Z = q.componentSetName, Q = z(
          b,
          te,
          [],
          !0
        );
        let ee = "";
        Q.length > 0 ? ee = `
   Location(s): ${Q.map((ce) => {
          const ye = ce.path.length > 0 ? ce.path.join(" → ") : "page root";
          return `"${ce.nodeName}" at ${ye}`;
        }).join(", ")}` : ee = `
   Location: (unable to determine - instance may be deeply nested)`;
        const oe = Z ? `Component: "${G}" (from component set "${Z}")` : `Component: "${G}"`, se = q.remoteLibraryName ? `
   Library: ${q.remoteLibraryName}` : "";
        J.push(
          `${D}. ${oe}${se}${ee}`
        ), D++;
      }
      const W = `Cannot publish: Remote instances are not supported. Please remove all remote instances before publishing.

Found ${V.size} remote instance(s):
${J.join(`

`)}

To fix this:
1. Locate each remote instance component listed above using the path(s) shown
2. Replace it with a local component or remove it
3. Try publishing again`;
      throw await t.error(W), new Error(W);
    }
    if (y > 0) {
      await t.log("Collections found:");
      const z = u.getTable();
      for (const [J, D] of Object.values(z).entries()) {
        const W = D.collectionGuid ? ` (GUID: ${D.collectionGuid.substring(0, 8)}...)` : "";
        await t.log(
          `  ${J}: ${D.collectionName}${W} - ${D.modes.length} mode(s)`
        );
      }
    }
    let R;
    if (e.skipPrompts) {
      await t.log("Running validation on main page...");
      try {
        const z = await We(
          {
            pageIndex: s,
            validateOnly: !0
          },
          a,
          !0,
          // Mark as recursive call
          i
        );
        if (z.success && z.data) {
          const J = z.data;
          J.validationResult && (R = J.validationResult, await t.log(
            `Main page validation: ${R.hasErrors ? "FAILED" : "PASSED"}`
          ), R.hasErrors && await t.warning(
            `Found ${R.errors.length} validation error(s) in main page`
          ));
        }
      } catch (z) {
        await t.warning(
          `Could not validate main page: ${z instanceof Error ? z.message : String(z)}`
        );
      }
    }
    await t.log("Checking for referenced component pages...");
    const ae = [], P = [], E = Object.values(N).filter(
      (z) => z.instanceType === "normal"
    );
    if (E.length > 0) {
      await t.log(
        `Found ${E.length} normal instance(s) to check`
      );
      const z = /* @__PURE__ */ new Map();
      for (const J of E)
        if (J.componentPageName) {
          const D = o.find((W) => W.name === J.componentPageName);
          if (D && !a.has(D.id))
            z.has(D.id) || z.set(D.id, D);
          else if (!D) {
            const W = `Normal instance references component "${J.componentName || "(unnamed)"}" on page "${J.componentPageName}", but that page was not found. Cannot export.`;
            throw await t.error(W), new Error(W);
          }
        } else {
          const D = `Normal instance references component "${J.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw await t.error(D), new Error(D);
        }
      await t.log(
        `Found ${z.size} unique referenced page(s)`
      );
      for (const [J, D] of z.entries()) {
        const W = D.name;
        if (a.has(J)) {
          await t.log(`Skipping "${W}" - already processed`);
          continue;
        }
        const te = D.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let q = !1, G = 0;
        if (te)
          try {
            const oe = JSON.parse(te);
            q = !!(oe.id && oe.version !== void 0), G = oe.version || 0;
          } catch (oe) {
          }
        const Z = o.findIndex(
          (oe) => oe.id === D.id
        );
        if (Z === -1)
          throw await t.error(
            `Could not find page index for "${W}"`
          ), new Error(`Could not find page index for "${W}"`);
        const Q = Array.from(E).find(
          (oe) => oe.componentPageName === W
        ), ee = Q == null ? void 0 : Q.componentName;
        if (e.skipPrompts) {
          J === g ? await t.log(
            `Skipping "${W}" - this is the original page being published`
          ) : P.find(
            (se) => se.pageId === J
          ) || (P.push({
            pageId: J,
            pageName: W,
            pageIndex: Z,
            hasMetadata: q,
            componentName: ee,
            localVersion: G
          }), await t.log(
            `Discovered referenced page: "${W}" (local version: ${G}) (will be handled by wizard)`
          )), await t.log(
            `Validating "${W}" for external references and unknown collections...`
          );
          try {
            const oe = await We(
              {
                pageIndex: Z,
                validateOnly: !0
                // Run validation only
              },
              a,
              !0,
              // Mark as recursive call
              i
            );
            if (oe.success && oe.data) {
              const se = oe.data;
              if (se.validationResult) {
                R || (R = {
                  hasErrors: !1,
                  errors: [],
                  externalReferences: [],
                  unknownCollections: [],
                  discoveredCollections: []
                }), R.errors.push(
                  ...se.validationResult.errors
                ), R.externalReferences.push(
                  ...se.validationResult.externalReferences
                ), R.unknownCollections.push(
                  ...se.validationResult.unknownCollections
                );
                for (const re of se.validationResult.discoveredCollections)
                  R.discoveredCollections.includes(
                    re
                  ) || R.discoveredCollections.push(
                    re
                  );
                R.hasErrors = R.errors.length > 0, await t.log(
                  `  Validation for "${W}": ${se.validationResult.hasErrors ? "FAILED" : "PASSED"}`
                ), se.validationResult.hasErrors && await t.warning(
                  `  Found ${se.validationResult.errors.length} validation error(s) in "${W}"`
                );
              }
            }
          } catch (oe) {
            await t.warning(
              `Could not validate "${W}": ${oe instanceof Error ? oe.message : String(oe)}`
            );
          }
          await t.log(
            `Checking dependencies of "${W}" for transitive dependencies...`
          );
          try {
            const oe = await We(
              {
                pageIndex: Z,
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
            if (oe.success && oe.data) {
              const se = oe.data;
              if (se.discoveredReferencedPages)
                for (const re of se.discoveredReferencedPages) {
                  if (re.pageId === g) {
                    await t.log(
                      `  Skipping "${re.pageName}" - this is the original page being published`
                    );
                    continue;
                  }
                  P.find(
                    (ye) => ye.pageId === re.pageId
                  ) || (P.push(re), await t.log(
                    `  Discovered transitive dependency: "${re.pageName}" (from ${W})`
                  ));
                }
            }
          } catch (oe) {
            await t.warning(
              `Could not discover dependencies of "${W}": ${oe instanceof Error ? oe.message : String(oe)}`
            );
          }
        } else {
          const oe = `Do you want to also publish referenced component "${W}"?`;
          try {
            await Ye.prompt(oe, {
              okLabel: "Yes",
              cancelLabel: "No",
              timeoutMs: 3e5
              // 5 minutes
            }), await t.log(`Exporting referenced page: "${W}"`);
            const se = o.findIndex(
              (ce) => ce.id === D.id
            );
            if (se === -1)
              throw await t.error(
                `Could not find page index for "${W}"`
              ), new Error(`Could not find page index for "${W}"`);
            const re = await We(
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
            if (re.success && re.data) {
              const ce = re.data;
              ae.push(ce), await t.log(
                `Successfully exported referenced page: "${W}"`
              );
            } else
              throw new Error(
                `Failed to export referenced page "${W}": ${re.message}`
              );
          } catch (se) {
            if (se instanceof Error && se.message === "User cancelled")
              if (q)
                await t.log(
                  `User declined to publish "${W}", but page has existing metadata. Continuing with existing metadata.`
                );
              else
                throw await t.error(
                  `Export cancelled: Referenced page "${W}" has no metadata and user declined to publish it.`
                ), new Error(
                  `Cannot continue export: Referenced component "${W}" has no metadata. Please publish it first or choose to publish it now.`
                );
            else
              throw se;
          }
        }
      }
    }
    await t.log("Creating string table...");
    const k = new ct();
    await t.log("Getting page metadata...");
    const j = d.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let C = "", v = 0;
    if (j)
      try {
        const z = JSON.parse(j);
        C = z.id || "", v = z.version || 0;
      } catch (z) {
        await t.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!C) {
      await t.log("Generating new GUID for page..."), C = await vt();
      const z = {
        _ver: 1,
        id: C,
        name: d.name,
        version: v,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      d.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(z)
      );
    }
    await t.log("Creating export data structure...");
    const h = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "1.0.0",
        figmaApiVersion: figma.apiVersion,
        guid: C,
        version: v,
        name: d.name,
        pluginVersion: "1.0.0"
      },
      stringTable: k.getSerializedTable(),
      collections: u.getSerializedTable(),
      variables: w.getSerializedTable(),
      instances: $.getSerializedTable(),
      pageData: b
    };
    await t.log("Compressing JSON data...");
    const I = Ua(h, k);
    await t.log("Serializing to JSON...");
    const A = JSON.stringify(I, null, 2), O = (A.length / 1024).toFixed(2), ne = st(d.name).trim().replace(/\s+/g, "_") + ".figma.json";
    await t.log(`JSON serialization complete: ${O} KB`), await t.log(`Export file: ${ne}`), await t.log("=== Export Complete ===");
    const M = JSON.parse(A);
    return {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: ne,
        pageData: M,
        pageName: d.name,
        additionalPages: ae,
        // Populated with referenced component pages
        discoveredReferencedPages: P.length > 0 ? (
          // Filter out the original page - it shouldn't be in the discovered list since it's the one being published
          P.filter((z) => z.pageId !== g)
        ) : void 0,
        // Only include if there are discovered pages
        validationResult: R
        // Include aggregated validation results if in discovery mode
      }
    };
  } catch (s) {
    const o = s instanceof Error ? s.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", s), console.error("Error message:", o), await t.error(`Export failed: ${o}`), s instanceof Error && s.stack && (console.error("Stack trace:", s.stack), await t.error(`Stack trace: ${s.stack}`));
    const d = {
      type: "exportPage",
      success: !1,
      error: !0,
      message: o,
      data: {}
    };
    return console.error("Returning error response:", d), d;
  }
}
const La = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  countTotalNodes: dt,
  exportPage: We,
  extractNodeData: gt
}, Symbol.toStringTag, { value: "Module" }));
function ue(e) {
  return e.replace(/[^a-zA-Z0-9]/g, "");
}
const zt = /* @__PURE__ */ new Map();
async function je(e, a) {
  if (a.length === 0)
    return;
  const n = e.modes.find(
    (i) => i.name === "Mode 1" || i.name === "Default"
  );
  if (n && !a.includes(n.name)) {
    const i = a[0];
    try {
      const l = n.name;
      e.renameMode(n.modeId, i), zt.set(`${e.id}:${l}`, i), await t.log(
        `  Renamed default mode "${l}" to "${i}"`
      );
    } catch (l) {
      await t.warning(
        `  Failed to rename default mode "${n.name}" to "${i}": ${l}`
      );
    }
  }
  for (const i of a)
    e.modes.find((s) => s.name === i) || e.addMode(i);
}
const Ve = "recursica:collectionId";
async function rt(e) {
  if (e.remote === !0) {
    const n = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(n)) {
      const l = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await t.error(l), new Error(l);
    }
    return e.id;
  } else {
    const n = e.getSharedPluginData(
      "recursica",
      Ve
    );
    if (n && n.trim() !== "")
      return n;
    const i = await vt();
    return e.setSharedPluginData("recursica", Ve, i), i;
  }
}
function Fa(e, a) {
  const n = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(n))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Ga(e) {
  let a;
  const n = e.collectionName.trim().toLowerCase(), i = ["token", "tokens", "theme", "themes"], l = e.isLocal;
  if (l === !1 || l === void 0 && i.includes(n))
    try {
      const d = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((g) => g.name.trim().toLowerCase() === n);
      if (d) {
        Fa(e.collectionName, !1);
        const g = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          d.key
        );
        if (g.length > 0) {
          const w = await figma.variables.importVariableByKeyAsync(g[0].key), u = await figma.variables.getVariableCollectionByIdAsync(
            w.variableCollectionId
          );
          if (u) {
            if (a = u, e.collectionGuid) {
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
              await rt(a);
            return await je(a, e.modes), { collection: a };
          }
        }
      }
    } catch (o) {
      if (l === !1)
        throw new Error(
          `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
        );
      console.log("Could not import external collection, trying local:", o);
    }
  if (l !== !1) {
    const o = await figma.variables.getLocalVariableCollectionsAsync();
    let d;
    if (e.collectionGuid && (d = o.find((g) => g.getSharedPluginData("recursica", Ve) === e.collectionGuid)), d || (d = o.find(
      (g) => g.name === e.collectionName
    )), d)
      if (a = d, e.collectionGuid) {
        const g = a.getSharedPluginData(
          "recursica",
          Ve
        );
        (!g || g.trim() === "") && a.setSharedPluginData(
          "recursica",
          Ve,
          e.collectionGuid
        );
      } else
        await rt(a);
    else
      a = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? a.setSharedPluginData(
        "recursica",
        Ve,
        e.collectionGuid
      ) : await rt(a);
  } else {
    const o = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), d = e.collectionName.trim().toLowerCase(), g = o.find((b) => b.name.trim().toLowerCase() === d);
    if (!g)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const w = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      g.key
    );
    if (w.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const u = await figma.variables.importVariableByKeyAsync(
      w[0].key
    ), $ = await figma.variables.getVariableCollectionByIdAsync(
      u.variableCollectionId
    );
    if (!$)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (a = $, e.collectionGuid) {
      const b = a.getSharedPluginData(
        "recursica",
        Ve
      );
      (!b || b.trim() === "") && a.setSharedPluginData(
        "recursica",
        Ve,
        e.collectionGuid
      );
    } else
      rt(a);
  }
  return await je(a, e.modes), { collection: a };
}
async function Ct(e, a) {
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
async function _a(e, a, n, i, l) {
  await t.log(
    `Restoring values for variable "${e.name}" (type: ${e.resolvedType}):`
  ), await t.log(
    `  valuesByMode keys: ${Object.keys(a).join(", ")}`
  );
  for (const [s, o] of Object.entries(a)) {
    const d = zt.get(`${i.id}:${s}`) || s;
    let g = i.modes.find((u) => u.name === d);
    if (g || (g = i.modes.find((u) => u.name === s)), !g) {
      await t.warning(
        `Mode "${s}" (mapped: "${d}") not found in collection "${i.name}" for variable "${e.name}". Available modes: ${i.modes.map((u) => u.name).join(", ")}. Skipping.`
      );
      continue;
    }
    const w = g.modeId;
    try {
      if (o == null) {
        await t.log(
          `  Mode "${s}": value is null/undefined, skipping`
        );
        continue;
      }
      if (await t.log(
        `  Mode "${s}": value type=${typeof o}, value=${JSON.stringify(o)}`
      ), typeof o == "string" || typeof o == "number" || typeof o == "boolean") {
        e.setValueForMode(w, o);
        continue;
      }
      if (typeof o == "object" && o !== null && "r" in o && "g" in o && "b" in o && typeof o.r == "number" && typeof o.g == "number" && typeof o.b == "number") {
        const u = o, $ = {
          r: u.r,
          g: u.g,
          b: u.b
        };
        u.a !== void 0 && ($.a = u.a), e.setValueForMode(w, $);
        const b = e.valuesByMode[w];
        if (await t.log(
          `  Set color value for "${e.name}" mode "${s}": r=${$.r.toFixed(3)}, g=${$.g.toFixed(3)}, b=${$.b.toFixed(3)}${$.a !== void 0 ? `, a=${$.a.toFixed(3)}` : ""}`
        ), await t.log(
          `  Read back value: ${JSON.stringify(b)}`
        ), typeof b == "object" && b !== null && "r" in b && "g" in b && "b" in b) {
          const p = b, r = Math.abs(p.r - $.r) < 1e-3, y = Math.abs(p.g - $.g) < 1e-3, c = Math.abs(p.b - $.b) < 1e-3;
          !r || !y || !c ? await t.warning(
            `  ⚠️ Value mismatch! Set: r=${$.r}, g=${$.g}, b=${$.b}, Read back: r=${p.r}, g=${p.g}, b=${p.b}`
          ) : await t.log(
            "  ✓ Value verified: read-back matches what we set"
          );
        } else
          await t.warning(
            `  ⚠️ Read-back value is not an RGB object: ${JSON.stringify(b)}`
          );
        continue;
      }
      if (typeof o == "object" && o !== null && "_varRef" in o && typeof o._varRef == "number") {
        const u = o;
        let $ = null;
        const b = n.getVariableByIndex(
          u._varRef
        );
        if (b) {
          let p = null;
          if (l && b._colRef !== void 0) {
            const r = l.getCollectionByIndex(
              b._colRef
            );
            r && (p = (await Ga(r)).collection);
          }
          p && ($ = await Ct(
            p,
            b.variableName
          ));
        }
        if ($) {
          const p = {
            type: "VARIABLE_ALIAS",
            id: $.id
          };
          e.setValueForMode(w, p);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${s}" in variable "${e.name}". Variable reference index: ${u._varRef}`
          );
      }
    } catch (u) {
      typeof o == "object" && o !== null && !("_varRef" in o) && !("r" in o && "g" in o && "b" in o) && await t.warning(
        `Unhandled value type for mode "${s}" in variable "${e.name}": ${JSON.stringify(o)}`
      ), console.warn(
        `Error setting value for mode "${s}" in variable "${e.name}":`,
        u
      );
    }
  }
}
async function $t(e, a, n, i) {
  if (await t.log(
    `Creating variable "${e.variableName}" (type: ${e.variableType})`
  ), e.valuesByMode) {
    await t.log(
      `  valuesByMode has ${Object.keys(e.valuesByMode).length} mode(s): ${Object.keys(e.valuesByMode).join(", ")}`
    );
    for (const [s, o] of Object.entries(e.valuesByMode))
      await t.log(
        `  Mode "${s}": ${JSON.stringify(o)} (type: ${typeof o})`
      );
  } else
    await t.log(
      `  No valuesByMode found for variable "${e.variableName}"`
    );
  const l = figma.variables.createVariable(
    e.variableName,
    a,
    e.variableType
  );
  if (e.valuesByMode && await _a(
    l,
    e.valuesByMode,
    n,
    a,
    // Pass collection to look up modes by name
    i
  ), e.valuesByMode && l.valuesByMode) {
    await t.log(`  Verifying values for "${e.variableName}":`);
    for (const [s, o] of Object.entries(
      e.valuesByMode
    )) {
      const d = a.modes.find((g) => g.name === s);
      if (d) {
        const g = l.valuesByMode[d.modeId];
        await t.log(
          `    Mode "${s}": expected=${JSON.stringify(o)}, actual=${JSON.stringify(g)}`
        );
      }
    }
  }
  return l;
}
async function za(e, a, n, i) {
  const l = a.getVariableByIndex(e);
  if (!l || l._colRef === void 0)
    return null;
  const s = i.get(String(l._colRef));
  if (!s)
    return null;
  const o = await Ct(
    s,
    l.variableName
  );
  if (o) {
    let d;
    if (typeof l.variableType == "number" ? d = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[l.variableType] || String(l.variableType) : d = l.variableType, Dt(o, d))
      return o;
  }
  return await $t(
    l,
    s,
    a,
    n
  );
}
async function jt(e, a, n, i) {
  if (!(!a || typeof a != "object"))
    try {
      const l = e[n];
      if (!l || !Array.isArray(l))
        return;
      const s = a[n];
      if (Array.isArray(s))
        for (let o = 0; o < s.length && o < l.length; o++) {
          const d = s[o];
          if (d && typeof d == "object") {
            if (l[o].boundVariables || (l[o].boundVariables = {}), Fe(d)) {
              const g = d._varRef;
              if (g !== void 0) {
                const w = i.get(String(g));
                w && (l[o].boundVariables.color = {
                  type: "VARIABLE_ALIAS",
                  id: w.id
                });
              }
            } else
              for (const [g, w] of Object.entries(
                d
              ))
                if (Fe(w)) {
                  const u = w._varRef;
                  if (u !== void 0) {
                    const $ = i.get(String(u));
                    $ && (l[o].boundVariables[g] = {
                      type: "VARIABLE_ALIAS",
                      id: $.id
                    });
                  }
                }
          }
        }
    } catch (l) {
      console.log(`Error restoring bound variables for ${n}:`, l);
    }
}
function ja(e, a, n = !1) {
  const i = fa(a);
  if (e.visible === void 0 && (e.visible = i.visible), e.locked === void 0 && (e.locked = i.locked), e.opacity === void 0 && (e.opacity = i.opacity), e.rotation === void 0 && (e.rotation = i.rotation), e.blendMode === void 0 && (e.blendMode = i.blendMode), a === "FRAME" || a === "COMPONENT" || a === "INSTANCE") {
    const l = Ce;
    e.layoutMode === void 0 && (e.layoutMode = l.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = l.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = l.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = l.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = l.counterAxisAlignItems), n || (e.paddingLeft === void 0 && (e.paddingLeft = l.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = l.paddingRight), e.paddingTop === void 0 && (e.paddingTop = l.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = l.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = l.itemSpacing), e.counterAxisSpacing === void 0 && (e.counterAxisSpacing = l.counterAxisSpacing));
  }
  if (a === "TEXT") {
    const l = Oe;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = l.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = l.textAlignVertical), e.textCase === void 0 && (e.textCase = l.textCase), e.textDecoration === void 0 && (e.textDecoration = l.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = l.textAutoResize);
  }
}
async function De(e, a, n = null, i = null, l = null, s = null, o = null, d = !1, g = null, w = null, u = null, $ = null, b = null, p) {
  var j, C, v, h, I, A, O, K, ne, M, L, z, J, D, W, te, q, G, Z, Q, ee, oe, se, re, ce, ye, $e, xe, Be, ke, Ge, Ze, _e, x, ge;
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
        const f = e.componentPropertyDefinitions;
        let U = 0, m = 0;
        for (const [S, F] of Object.entries(f))
          try {
            const _ = F.type;
            let B = null;
            if (typeof _ == "string" ? (_ === "TEXT" || _ === "BOOLEAN" || _ === "INSTANCE_SWAP" || _ === "VARIANT") && (B = _) : typeof _ == "number" && (B = {
              2: "TEXT",
              // Text property
              25: "BOOLEAN",
              // Boolean property
              27: "INSTANCE_SWAP",
              // Instance swap property
              26: "VARIANT"
              // Variant property
            }[_] || null), !B) {
              await t.warning(
                `  Unknown property type ${_} (${typeof _}) for property "${S}" in component "${e.name || "Unnamed"}"`
              ), m++;
              continue;
            }
            const H = F.defaultValue, Y = S.split("#")[0];
            r.addComponentProperty(
              Y,
              B,
              H
            ), U++;
          } catch (_) {
            await t.warning(
              `  Failed to add component property "${S}" to "${e.name || "Unnamed"}": ${_}`
            ), m++;
          }
        U > 0 && await t.log(
          `  Added ${U} component property definition(s) to "${e.name || "Unnamed"}"${m > 0 ? ` (${m} failed)` : ""}`
        );
      }
      break;
    case "COMPONENT_SET": {
      const f = e.children ? e.children.filter((S) => S.type === "COMPONENT").length : 0;
      await t.log(
        `Creating COMPONENT_SET "${e.name || "Unnamed"}" by combining ${f} component variant(s)`
      );
      const U = [];
      let m = null;
      if (e.children && Array.isArray(e.children)) {
        m = figma.createFrame(), m.name = `_temp_${e.name || "COMPONENT_SET"}`, m.visible = !1, ((a == null ? void 0 : a.type) === "PAGE" ? a : figma.currentPage).appendChild(m);
        for (const F of e.children)
          if (F.type === "COMPONENT" && !F._truncated)
            try {
              const _ = await De(
                F,
                m,
                // Use temp parent for now
                n,
                i,
                l,
                s,
                o,
                d,
                g,
                w,
                // Pass deferredInstances through for component set creation
                null,
                // parentNodeData - not needed here, will be passed correctly in recursive calls
                $,
                b,
                // Pass placeholderFrameIds through for component set creation
                void 0
                // currentPlaceholderId - component set creation is not inside a placeholder
              );
              _ && _.type === "COMPONENT" && (U.push(_), await t.log(
                `  Created component variant: "${_.name || "Unnamed"}"`
              ));
            } catch (_) {
              await t.warning(
                `  Failed to create component variant "${F.name || "Unnamed"}": ${_}`
              );
            }
      }
      if (U.length > 0)
        try {
          const S = a || figma.currentPage, F = figma.combineAsVariants(
            U,
            S
          );
          e.name && (F.name = e.name), e.x !== void 0 && (F.x = e.x), e.y !== void 0 && (F.y = e.y), m && m.parent && m.remove(), await t.log(
            `  ✓ Successfully created COMPONENT_SET "${F.name}" with ${U.length} variant(s)`
          ), r = F;
        } catch (S) {
          if (await t.warning(
            `  Failed to combine components into COMPONENT_SET "${e.name || "Unnamed"}": ${S}. Falling back to frame.`
          ), r = figma.createFrame(), e.name && (r.name = e.name), m && m.children.length > 0) {
            for (const F of m.children)
              r.appendChild(F);
            m.remove();
          }
        }
      else
        await t.warning(
          `  No valid component variants found for COMPONENT_SET "${e.name || "Unnamed"}". Creating frame instead.`
        ), r = figma.createFrame(), e.name && (r.name = e.name), m && m.remove();
      break;
    }
    case "INSTANCE":
      if (d)
        r = figma.createFrame(), e.name && (r.name = e.name);
      else if (e._instanceRef !== void 0 && l && o) {
        const f = l.getInstanceByIndex(
          e._instanceRef
        );
        if (f && f.instanceType === "internal")
          if (f.componentNodeId)
            if (f.componentNodeId === e.id)
              await t.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), r = figma.createFrame(), e.name && (r.name = e.name);
            else {
              const U = o.get(
                f.componentNodeId
              );
              if (!U) {
                const m = Array.from(o.keys()).slice(
                  0,
                  20
                );
                await t.error(
                  `Component not found for internal instance "${e.name}" (ID: ${f.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), await t.error(
                  `Looking for component ID: ${f.componentNodeId}`
                ), await t.error(
                  `Available IDs in mapping (first 20): ${m.map((H) => H.substring(0, 8) + "...").join(", ")}`
                );
                const S = (H, Y) => {
                  if (H.type === "COMPONENT" && H.id === Y)
                    return !0;
                  if (H.children && Array.isArray(H.children)) {
                    for (const X of H.children)
                      if (!X._truncated && S(X, Y))
                        return !0;
                  }
                  return !1;
                }, F = S(
                  e,
                  f.componentNodeId
                );
                await t.error(
                  `Component ID ${f.componentNodeId.substring(0, 8)}... exists in current node tree: ${F}`
                ), await t.error(
                  `WARNING: Component ID ${f.componentNodeId.substring(0, 8)}... not found in nodeIdMapping. This might indicate:`
                ), await t.error(
                  "  1. The component doesn't exist in the pageData (detached component?)"
                ), await t.error(
                  "  2. The component wasn't collected in the first pass"
                ), await t.error(
                  "  3. The component ID in the instance table doesn't match the actual component ID"
                );
                const _ = m.filter(
                  (H) => H.startsWith(f.componentNodeId.substring(0, 8))
                );
                _.length > 0 && await t.error(
                  `Found IDs with matching prefix: ${_.map((H) => H.substring(0, 8) + "...").join(", ")}`
                );
                const B = `Component not found for internal instance "${e.name}" (ID: ${f.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${m.map((H) => H.substring(0, 8) + "...").join(", ")}`;
                throw new Error(B);
              }
              if (U && U.type === "COMPONENT") {
                if (r = U.createInstance(), await t.log(
                  `✓ Created internal instance "${e.name}" from component "${f.componentName}"`
                ), f.variantProperties && Object.keys(f.variantProperties).length > 0)
                  try {
                    let m = null;
                    if (U.parent && U.parent.type === "COMPONENT_SET")
                      m = U.parent.componentPropertyDefinitions, await t.log(
                        `  DEBUG: Component "${f.componentName}" is inside component set "${U.parent.name}" with ${Object.keys(m || {}).length} property definitions`
                      );
                    else {
                      const S = await r.getMainComponentAsync();
                      if (S) {
                        const F = S.type;
                        await t.log(
                          `  DEBUG: Internal instance "${e.name}" - componentNode parent: ${U.parent ? U.parent.type : "N/A"}, mainComponent type: ${F}, mainComponent parent: ${S.parent ? S.parent.type : "N/A"}`
                        ), F === "COMPONENT_SET" ? m = S.componentPropertyDefinitions : F === "COMPONENT" && S.parent && S.parent.type === "COMPONENT_SET" ? (m = S.parent.componentPropertyDefinitions, await t.log(
                          `  DEBUG: Found component set parent "${S.parent.name}" with ${Object.keys(m || {}).length} property definitions`
                        )) : await t.log(
                          `  Skipping variant properties for internal instance "${e.name}" - component "${f.componentName}" is not yet in a COMPONENT_SET (will be moved later during component set creation)`
                        );
                      }
                    }
                    if (m) {
                      const S = {};
                      for (const [F, _] of Object.entries(
                        f.variantProperties
                      )) {
                        const B = F.split("#")[0];
                        m[B] && (S[B] = _);
                      }
                      Object.keys(S).length > 0 && r.setProperties(S);
                    }
                  } catch (m) {
                    const S = `Failed to set variant properties for instance "${e.name}": ${m}`;
                    throw await t.error(S), new Error(S);
                  }
                if (f.componentProperties && Object.keys(f.componentProperties).length > 0)
                  try {
                    const m = await r.getMainComponentAsync();
                    if (m) {
                      let S = null;
                      const F = m.type;
                      if (F === "COMPONENT_SET" ? S = m.componentPropertyDefinitions : F === "COMPONENT" && m.parent && m.parent.type === "COMPONENT_SET" ? S = m.parent.componentPropertyDefinitions : F === "COMPONENT" && (S = m.componentPropertyDefinitions), S)
                        for (const [_, B] of Object.entries(
                          f.componentProperties
                        )) {
                          const H = _.split("#")[0];
                          if (S[H])
                            try {
                              let Y = B;
                              B && typeof B == "object" && "value" in B && (Y = B.value), r.setProperties({
                                [H]: Y
                              });
                            } catch (Y) {
                              const X = `Failed to set component property "${H}" for internal instance "${e.name}": ${Y}`;
                              throw await t.error(X), new Error(X);
                            }
                        }
                    } else
                      await t.warning(
                        `Cannot set component properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (m) {
                    if (m instanceof Error)
                      throw m;
                    const S = `Failed to set component properties for instance "${e.name}": ${m}`;
                    throw await t.error(S), new Error(S);
                  }
              } else if (!r && U) {
                const m = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${f.componentNodeId.substring(0, 8)}...).`;
                throw await t.error(m), new Error(m);
              }
            }
          else {
            const U = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw await t.error(U), new Error(U);
          }
        else if (f && f.instanceType === "remote")
          if (g) {
            const U = g.get(
              e._instanceRef
            );
            if (U) {
              if (r = U.createInstance(), await t.log(
                `✓ Created remote instance "${e.name}" from component "${f.componentName}" on REMOTES page`
              ), f.variantProperties && Object.keys(f.variantProperties).length > 0)
                try {
                  const m = await r.getMainComponentAsync();
                  if (m) {
                    let S = null;
                    const F = m.type;
                    if (F === "COMPONENT_SET" ? S = m.componentPropertyDefinitions : F === "COMPONENT" && m.parent && m.parent.type === "COMPONENT_SET" ? S = m.parent.componentPropertyDefinitions : await t.log(
                      `Skipping variant properties for remote instance "${e.name}" - main component is not a COMPONENT_SET or variant (expected for remote components)`
                    ), S) {
                      const _ = {};
                      for (const [B, H] of Object.entries(
                        f.variantProperties
                      )) {
                        const Y = B.split("#")[0];
                        S[Y] && (_[Y] = H);
                      }
                      Object.keys(_).length > 0 && r.setProperties(_);
                    }
                  } else
                    await t.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (m) {
                  const S = `Failed to set variant properties for remote instance "${e.name}": ${m}`;
                  throw await t.error(S), new Error(S);
                }
              if (f.componentProperties && Object.keys(f.componentProperties).length > 0)
                try {
                  const m = await r.getMainComponentAsync();
                  if (m) {
                    let S = null;
                    const F = m.type;
                    if (F === "COMPONENT_SET" ? S = m.componentPropertyDefinitions : F === "COMPONENT" && m.parent && m.parent.type === "COMPONENT_SET" ? S = m.parent.componentPropertyDefinitions : F === "COMPONENT" && (S = m.componentPropertyDefinitions), S)
                      for (const [_, B] of Object.entries(
                        f.componentProperties
                      )) {
                        const H = _.split("#")[0];
                        if (S[H])
                          try {
                            let Y = B;
                            B && typeof B == "object" && "value" in B && (Y = B.value), r.setProperties({
                              [H]: Y
                            });
                          } catch (Y) {
                            const X = `Failed to set component property "${H}" for remote instance "${e.name}": ${Y}`;
                            throw await t.error(X), new Error(X);
                          }
                      }
                  } else
                    await t.warning(
                      `Cannot set component properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (m) {
                  if (m instanceof Error)
                    throw m;
                  const S = `Failed to set component properties for remote instance "${e.name}": ${m}`;
                  throw await t.error(S), new Error(S);
                }
              if (e.width !== void 0 && e.height !== void 0)
                try {
                  r.resize(e.width, e.height);
                } catch (m) {
                  await t.log(
                    `Note: Could not resize remote instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
                  );
                }
            } else {
              const m = `Remote component not found for instance "${e.name}" (index ${e._instanceRef}). The remote component should have been created on the REMOTES page.`;
              throw await t.error(m), new Error(m);
            }
          } else {
            const U = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw await t.error(U), new Error(U);
          }
        else if ((f == null ? void 0 : f.instanceType) === "normal") {
          if (!f.componentPageName) {
            const B = `Normal instance "${e.name}" missing componentPageName. Cannot resolve.`;
            throw await t.error(B), new Error(B);
          }
          await figma.loadAllPagesAsync();
          const U = figma.root.children.find(
            (B) => B.name === f.componentPageName
          );
          if (!U) {
            await t.log(
              `  Deferring normal instance "${e.name}" - referenced page "${f.componentPageName}" does not exist yet (may be circular reference or not yet imported)`
            );
            const B = figma.createFrame();
            if (B.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (B.x = e.x), e.y !== void 0 && (B.y = e.y), e.width !== void 0 && e.height !== void 0 ? B.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && B.resize(e.w, e.h), b && b.add(B.id), w) {
              const H = p;
              H ? await t.log(
                `[NESTED] Creating child deferred instance "${e.name}" with parent placeholder ID ${H.substring(0, 8)}... (immediate parent: "${a.name}" ${a.id.substring(0, 8)}...)`
              ) : await t.log(
                `[NESTED] Creating top-level deferred instance "${e.name}" - parent "${a.name}" (${a.id.substring(0, 8)}...)`
              );
              let Y = a.id;
              if (H)
                try {
                  const ie = await figma.getNodeByIdAsync(H);
                  ie && ie.parent && (Y = ie.parent.id);
                } catch (ie) {
                  Y = a.id;
                }
              const X = {
                placeholderFrameId: B.id,
                instanceEntry: f,
                nodeData: e,
                parentNodeId: Y,
                parentPlaceholderId: H,
                instanceIndex: e._instanceRef
              };
              w.push(X);
            }
            r = B;
            break;
          }
          let m = null;
          const S = (B, H, Y, X, ie) => {
            if (H.length === 0) {
              let me = null;
              for (const he of B.children || [])
                if (he.type === "COMPONENT") {
                  if (he.name === Y)
                    if (me || (me = he), X)
                      try {
                        const we = he.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (we && JSON.parse(we).id === X)
                          return he;
                      } catch (we) {
                      }
                    else
                      return he;
                } else if (he.type === "COMPONENT_SET") {
                  if (ie && he.name !== ie)
                    continue;
                  for (const we of he.children || [])
                    if (we.type === "COMPONENT" && we.name === Y)
                      if (me || (me = we), X)
                        try {
                          const ze = we.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (ze && JSON.parse(ze).id === X)
                            return we;
                        } catch (ze) {
                        }
                      else
                        return we;
                }
              return me;
            }
            const [pe, ...fe] = H;
            for (const me of B.children || [])
              if (me.name === pe) {
                if (fe.length === 0 && me.type === "COMPONENT_SET") {
                  if (ie && me.name !== ie)
                    continue;
                  for (const he of me.children || [])
                    if (he.type === "COMPONENT" && he.name === Y) {
                      if (X)
                        try {
                          const we = he.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (we && JSON.parse(we).id === X)
                            return he;
                        } catch (we) {
                        }
                      return he;
                    }
                  return null;
                }
                return S(
                  me,
                  fe,
                  Y,
                  X,
                  ie
                );
              }
            return null;
          };
          await t.log(
            `  Looking for component "${f.componentName}" on page "${f.componentPageName}"${f.path && f.path.length > 0 ? ` at path [${f.path.join(" → ")}]` : " at page root"}${f.componentGuid ? ` (GUID: ${f.componentGuid.substring(0, 8)}...)` : ""}`
          );
          const F = [], _ = (B, H = 0) => {
            const Y = "  ".repeat(H);
            if (B.type === "COMPONENT")
              F.push(`${Y}COMPONENT: "${B.name}"`);
            else if (B.type === "COMPONENT_SET") {
              F.push(
                `${Y}COMPONENT_SET: "${B.name}"`
              );
              for (const X of B.children || [])
                X.type === "COMPONENT" && F.push(
                  `${Y}  └─ COMPONENT: "${X.name}"`
                );
            }
            for (const X of B.children || [])
              _(X, H + 1);
          };
          if (_(U), F.length > 0 ? await t.log(
            `  Available components on page "${f.componentPageName}":
${F.slice(0, 20).join(`
`)}${F.length > 20 ? `
  ... and ${F.length - 20} more` : ""}`
          ) : await t.warning(
            `  No components found on page "${f.componentPageName}"`
          ), m = S(
            U,
            f.path || [],
            f.componentName,
            f.componentGuid,
            f.componentSetName
          ), m && f.componentGuid)
            try {
              const B = m.getPluginData(
                "RecursicaPublishedMetadata"
              );
              if (B) {
                const H = JSON.parse(B);
                H.id !== f.componentGuid ? await t.warning(
                  `  Found component "${f.componentName}" by name but GUID verification failed (expected ${f.componentGuid.substring(0, 8)}..., got ${H.id ? H.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`
                ) : await t.log(
                  `  Found component "${f.componentName}" with matching GUID ${f.componentGuid.substring(0, 8)}...`
                );
              } else
                await t.warning(
                  `  Found component "${f.componentName}" by name but no metadata found. Using name match as fallback.`
                );
            } catch (B) {
              await t.warning(
                `  Found component "${f.componentName}" by name but GUID verification failed. Using name match as fallback.`
              );
            }
          if (!m) {
            await t.log(
              `  Deferring normal instance "${e.name}" - component "${f.componentName}" not found on page "${f.componentPageName}" (may not be created yet due to circular reference)`
            );
            const B = figma.createFrame();
            if (B.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (B.x = e.x), e.y !== void 0 && (B.y = e.y), e.width !== void 0 && e.height !== void 0 ? B.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && B.resize(e.w, e.h), b && b.add(B.id), w) {
              const H = p;
              H ? await t.log(
                `[NESTED] Creating child deferred instance "${e.name}" with parent placeholder ID ${H.substring(0, 8)}... (immediate parent: "${a.name}" ${a.id.substring(0, 8)}...)`
              ) : await t.log(
                `[NESTED] Creating top-level deferred instance "${e.name}" - parent "${a.name}" (${a.id.substring(0, 8)}...)`
              );
              let Y = a.id;
              if (H)
                try {
                  const ie = await figma.getNodeByIdAsync(H);
                  ie && ie.parent && (Y = ie.parent.id);
                } catch (ie) {
                  Y = a.id;
                }
              const X = {
                placeholderFrameId: B.id,
                instanceEntry: f,
                nodeData: e,
                parentNodeId: Y,
                parentPlaceholderId: H,
                instanceIndex: e._instanceRef
              };
              w.push(X);
            }
            r = B;
            break;
          }
          if (r = m.createInstance(), await t.log(
            `  Created normal instance "${e.name}" from component "${f.componentName}" on page "${f.componentPageName}"`
          ), f.variantProperties && Object.keys(f.variantProperties).length > 0)
            try {
              const B = await r.getMainComponentAsync();
              if (B) {
                let H = null;
                const Y = B.type;
                if (Y === "COMPONENT_SET" ? H = B.componentPropertyDefinitions : Y === "COMPONENT" && B.parent && B.parent.type === "COMPONENT_SET" ? H = B.parent.componentPropertyDefinitions : await t.warning(
                  `Cannot set variant properties for normal instance "${e.name}" - main component is not a COMPONENT_SET or variant`
                ), H) {
                  const X = {};
                  for (const [ie, pe] of Object.entries(
                    f.variantProperties
                  )) {
                    const fe = ie.split("#")[0];
                    H[fe] && (X[fe] = pe);
                  }
                  Object.keys(X).length > 0 && r.setProperties(X);
                }
              }
            } catch (B) {
              await t.warning(
                `Failed to set variant properties for normal instance "${e.name}": ${B}`
              );
            }
          if (f.componentProperties && Object.keys(f.componentProperties).length > 0)
            try {
              const B = await r.getMainComponentAsync();
              if (B) {
                let H = null;
                const Y = B.type;
                if (Y === "COMPONENT_SET" ? H = B.componentPropertyDefinitions : Y === "COMPONENT" && B.parent && B.parent.type === "COMPONENT_SET" ? H = B.parent.componentPropertyDefinitions : Y === "COMPONENT" && (H = B.componentPropertyDefinitions), H) {
                  const X = {};
                  for (const [ie, pe] of Object.entries(
                    f.componentProperties
                  )) {
                    const fe = ie.split("#")[0];
                    let me;
                    if (H[ie] ? me = ie : H[fe] ? me = fe : me = Object.keys(H).find(
                      (he) => he.split("#")[0] === fe
                    ), me) {
                      const he = pe && typeof pe == "object" && "value" in pe ? pe.value : pe;
                      X[me] = he;
                    } else
                      await t.warning(
                        `Component property "${fe}" (from "${ie}") does not exist on component "${f.componentName}" for normal instance "${e.name}". Available properties: ${Object.keys(H).join(", ") || "none"}`
                      );
                  }
                  if (Object.keys(X).length > 0)
                    try {
                      await t.log(
                        `  Attempting to set component properties for normal instance "${e.name}": ${Object.keys(X).join(", ")}`
                      ), await t.log(
                        `  Available component properties: ${Object.keys(H).join(", ")}`
                      ), r.setProperties(X), await t.log(
                        `  ✓ Successfully set component properties for normal instance "${e.name}": ${Object.keys(X).join(", ")}`
                      );
                    } catch (ie) {
                      await t.warning(
                        `Failed to set component properties for normal instance "${e.name}": ${ie}`
                      ), await t.warning(
                        `  Properties attempted: ${JSON.stringify(X)}`
                      ), await t.warning(
                        `  Available properties: ${JSON.stringify(Object.keys(H))}`
                      );
                    }
                }
              } else
                await t.warning(
                  `Cannot set component properties for normal instance "${e.name}" - main component not found`
                );
            } catch (B) {
              await t.warning(
                `Failed to set component properties for normal instance "${e.name}": ${B}`
              );
            }
          if (e.width !== void 0 && e.height !== void 0)
            try {
              r.resize(e.width, e.height);
            } catch (B) {
              await t.log(
                `Note: Could not resize normal instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
              );
            }
        } else {
          const U = `Instance "${e.name}" has unknown or missing instance type: ${(f == null ? void 0 : f.instanceType) || "unknown"}`;
          throw await t.error(U), new Error(U);
        }
      } else {
        const f = `Instance "${e.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        throw await t.error(f), new Error(f);
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
      const f = `Unsupported node type: ${e.type}. This node type cannot be imported.`;
      throw await t.error(f), new Error(f);
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
  const y = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.paddingLeft || e.boundVariables.paddingRight || e.boundVariables.paddingTop || e.boundVariables.paddingBottom || e.boundVariables.itemSpacing);
  ja(
    r,
    e.type || "FRAME",
    y
  ), e.name !== void 0 && (r.name = e.name || "Unnamed Node");
  const c = u && u.layoutMode !== void 0 && u.layoutMode !== "NONE", T = a && "layoutMode" in a && a.layoutMode !== "NONE";
  c || T || (e.x !== void 0 && (r.x = e.x), e.y !== void 0 && (r.y = e.y));
  const V = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height), R = e.name || "Unnamed";
  if (e.preserveRatio !== void 0 && await t.log(
    `  [ISSUE #3 DEBUG] "${R}" has preserveRatio in nodeData: ${e.preserveRatio}`
  ), e.constraints !== void 0 && await t.log(
    `  [ISSUE #4 DEBUG] "${R}" has constraints in nodeData: ${JSON.stringify(e.constraints)}`
  ), (e.constraintHorizontal !== void 0 || e.constraintVertical !== void 0) && await t.log(
    `  [ISSUE #4 DEBUG] "${R}" has constraintHorizontal: ${e.constraintHorizontal}, constraintVertical: ${e.constraintVertical}`
  ), e.type !== "VECTOR" && e.type !== "BOOLEAN_OPERATION" && e.width !== void 0 && e.height !== void 0 && !V) {
    const f = r.preserveRatio;
    f !== void 0 && await t.log(
      `  [ISSUE #3 DEBUG] "${R}" preserveRatio before resize: ${f}`
    ), r.resize(e.width, e.height);
    const U = r.preserveRatio;
    U !== void 0 ? await t.log(
      `  [ISSUE #3 DEBUG] "${R}" preserveRatio after resize: ${U}`
    ) : e.preserveRatio !== void 0 && await t.warning(
      `  ⚠️ ISSUE #3: "${R}" preserveRatio was in nodeData (${e.preserveRatio}) but not set on node!`
    );
    const m = e.constraintHorizontal || ((j = e.constraints) == null ? void 0 : j.horizontal), S = e.constraintVertical || ((C = e.constraints) == null ? void 0 : C.vertical);
    (m !== void 0 || S !== void 0) && await t.log(
      `  [ISSUE #4] "${R}" (${e.type}) - Expected constraints from JSON: H=${m || "undefined"}, V=${S || "undefined"}`
    );
    const F = (v = r.constraints) == null ? void 0 : v.horizontal, _ = (h = r.constraints) == null ? void 0 : h.vertical;
    (m !== void 0 || S !== void 0) && await t.log(
      `  [ISSUE #4] "${R}" (${e.type}) - Constraints after resize (before setting): H=${F || "undefined"}, V=${_ || "undefined"}`
    );
    const B = e.constraintHorizontal !== void 0 || ((I = e.constraints) == null ? void 0 : I.horizontal) !== void 0, H = e.constraintVertical !== void 0 || ((A = e.constraints) == null ? void 0 : A.vertical) !== void 0;
    if (B || H) {
      const ie = e.constraintHorizontal || ((O = e.constraints) == null ? void 0 : O.horizontal), pe = e.constraintVertical || ((K = e.constraints) == null ? void 0 : K.vertical), fe = ie || F || "MIN", me = pe || _ || "MIN";
      try {
        await t.log(
          `  [ISSUE #4] Setting constraints for "${R}" (${e.type}): H=${fe} (from ${ie || "default"}), V=${me} (from ${pe || "default"})`
        ), r.constraints = {
          horizontal: fe,
          vertical: me
        };
        const he = (ne = r.constraints) == null ? void 0 : ne.horizontal, we = (M = r.constraints) == null ? void 0 : M.vertical;
        he === fe && we === me ? await t.log(
          `  [ISSUE #4] ✓ Constraints set successfully: H=${he}, V=${we} for "${R}"`
        ) : await t.warning(
          `  [ISSUE #4] ⚠️ Constraints set but verification failed! Expected H=${fe}, V=${me}, got H=${he || "undefined"}, V=${we || "undefined"} for "${R}"`
        );
      } catch (he) {
        await t.warning(
          `  [ISSUE #4] ✗ Failed to set constraints for "${R}" (${e.type}): ${he instanceof Error ? he.message : String(he)}`
        );
      }
    }
    const Y = r.constraintHorizontal, X = r.constraintVertical;
    (m !== void 0 || S !== void 0) && (await t.log(
      `  [ISSUE #4] "${R}" (${e.type}) - Final constraints: H=${Y || "undefined"}, V=${X || "undefined"}`
    ), m !== void 0 && Y !== m && await t.warning(
      `  ⚠️ ISSUE #4: "${R}" constraintHorizontal mismatch! Expected: ${m}, Got: ${Y || "undefined"}`
    ), S !== void 0 && X !== S && await t.warning(
      `  ⚠️ ISSUE #4: "${R}" constraintVertical mismatch! Expected: ${S}, Got: ${X || "undefined"}`
    ), m !== void 0 && S !== void 0 && Y === m && X === S && await t.log(
      `  ✓ ISSUE #4: "${R}" constraints correctly set: H=${Y}, V=${X}`
    ));
  } else {
    const f = e.constraintHorizontal || ((L = e.constraints) == null ? void 0 : L.horizontal), U = e.constraintVertical || ((z = e.constraints) == null ? void 0 : z.vertical);
    if ((f !== void 0 || U !== void 0) && (e.type === "VECTOR" || e.type === "BOOLEAN_OPERATION" ? await t.log(
      `  [ISSUE #4] "${R}" (VECTOR) - Constraints already set earlier (skipping "no resize" path)`
    ) : await t.log(
      `  [ISSUE #4] "${R}" (${e.type}) - Setting constraints (no resize): Expected H=${f || "undefined"}, V=${U || "undefined"}`
    )), e.type !== "VECTOR") {
      const m = e.constraintHorizontal !== void 0 || ((J = e.constraints) == null ? void 0 : J.horizontal) !== void 0, S = e.constraintVertical !== void 0 || ((D = e.constraints) == null ? void 0 : D.vertical) !== void 0;
      if (m || S) {
        const F = e.constraintHorizontal || ((W = e.constraints) == null ? void 0 : W.horizontal), _ = e.constraintVertical || ((te = e.constraints) == null ? void 0 : te.vertical), B = r.constraints || {}, H = B.horizontal || "MIN", Y = B.vertical || "MIN", X = F || H, ie = _ || Y;
        try {
          await t.log(
            `  [ISSUE #4] Setting constraints for "${R}" (${e.type}) (no resize): H=${X} (from ${F || "current"}), V=${ie} (from ${_ || "current"})`
          ), r.constraints = {
            horizontal: X,
            vertical: ie
          };
          const pe = (q = r.constraints) == null ? void 0 : q.horizontal, fe = (G = r.constraints) == null ? void 0 : G.vertical;
          pe === X && fe === ie ? await t.log(
            `  [ISSUE #4] ✓ Constraints set successfully (no resize): H=${pe}, V=${fe} for "${R}"`
          ) : await t.warning(
            `  [ISSUE #4] ⚠️ Constraints set but verification failed (no resize)! Expected H=${X}, V=${ie}, got H=${pe || "undefined"}, V=${fe || "undefined"} for "${R}"`
          );
        } catch (pe) {
          await t.warning(
            `  [ISSUE #4] ✗ Failed to set constraints for "${R}" (${e.type}) (no resize): ${pe instanceof Error ? pe.message : String(pe)}`
          );
        }
      }
    }
    if (e.type !== "VECTOR" && e.type !== "BOOLEAN_OPERATION" && (f !== void 0 || U !== void 0)) {
      const m = (Z = r.constraints) == null ? void 0 : Z.horizontal, S = (Q = r.constraints) == null ? void 0 : Q.vertical;
      await t.log(
        `  [ISSUE #4] "${R}" (${e.type}) - Final constraints (no resize): H=${m || "undefined"}, V=${S || "undefined"}`
      ), f !== void 0 && m !== f && await t.warning(
        `  ⚠️ ISSUE #4: "${R}" constraintHorizontal mismatch! Expected: ${f}, Got: ${m || "undefined"}`
      ), U !== void 0 && S !== U && await t.warning(
        `  ⚠️ ISSUE #4: "${R}" constraintVertical mismatch! Expected: ${U}, Got: ${S || "undefined"}`
      ), f !== void 0 && U !== void 0 && m === f && S === U && await t.log(
        `  ✓ ISSUE #4: "${R}" constraints correctly set (no resize): H=${m}, V=${S}`
      );
    }
  }
  const ae = e.boundVariables && typeof e.boundVariables == "object";
  if (e.visible !== void 0 && (r.visible = e.visible), e.locked !== void 0 && (r.locked = e.locked), e.opacity !== void 0 && (!ae || !e.boundVariables.opacity) && (r.opacity = e.opacity), e.rotation !== void 0 && (!ae || !e.boundVariables.rotation) && (r.rotation = e.rotation), e.blendMode !== void 0 && (!ae || !e.boundVariables.blendMode) && (r.blendMode = e.blendMode), e.type !== "INSTANCE") {
    if (e.type === "VECTOR" && e.boundVariables && (await t.log(
      `  DEBUG: VECTOR "${e.name || "Unnamed"}" (ID: ${((ee = e.id) == null ? void 0 : ee.substring(0, 8)) || "unknown"}...) has boundVariables: ${Object.keys(e.boundVariables).join(", ")}`
    ), e.boundVariables.fills && await t.log(
      `  DEBUG:   boundVariables.fills: ${JSON.stringify(e.boundVariables.fills)}`
    )), e.fills !== void 0)
      try {
        let f = e.fills;
        const U = e.name || "Unnamed";
        if (Array.isArray(f))
          for (let m = 0; m < f.length; m++) {
            const S = f[m];
            S && typeof S == "object" && S.selectionColor !== void 0 && await t.log(
              `  [ISSUE #2 DEBUG] "${U}" fill[${m}] has selectionColor: ${JSON.stringify(S.selectionColor)}`
            );
          }
        if (Array.isArray(f)) {
          const m = e.name || "Unnamed";
          for (let S = 0; S < f.length; S++) {
            const F = f[S];
            F && typeof F == "object" && F.selectionColor !== void 0 && await t.warning(
              `  ⚠️ ISSUE #2: "${m}" fill[${S}] has selectionColor that will be preserved: ${JSON.stringify(F.selectionColor)}`
            );
          }
          f = f.map((S) => {
            if (S && typeof S == "object") {
              const F = de({}, S);
              return delete F.boundVariables, F;
            }
            return S;
          });
        }
        if (e.fills && Array.isArray(e.fills) && s) {
          if (e.type === "VECTOR") {
            await t.log(
              `  DEBUG: VECTOR "${e.name || "Unnamed"}" has ${e.fills.length} fill(s)`
            );
            for (let _ = 0; _ < e.fills.length; _++) {
              const B = e.fills[_];
              if (B && typeof B == "object") {
                const H = B.boundVariables || B.bndVar;
                H ? await t.log(
                  `  DEBUG:   fill[${_}] has boundVariables: ${JSON.stringify(H)}`
                ) : await t.log(
                  `  DEBUG:   fill[${_}] has no boundVariables`
                );
              }
            }
          }
          const m = [];
          for (let _ = 0; _ < f.length; _++) {
            const B = f[_], H = e.fills[_];
            if (!H || typeof H != "object") {
              m.push(B);
              continue;
            }
            const Y = H.boundVariables || H.bndVar;
            if (!Y) {
              m.push(B);
              continue;
            }
            const X = de({}, B);
            X.boundVariables = {};
            for (const [ie, pe] of Object.entries(Y))
              if (e.type === "VECTOR" && await t.log(
                `  DEBUG: Processing fill[${_}].${ie} on VECTOR "${r.name || "Unnamed"}": varInfo=${JSON.stringify(pe)}`
              ), Fe(pe)) {
                const fe = pe._varRef;
                if (fe !== void 0) {
                  if (e.type === "VECTOR") {
                    await t.log(
                      `  DEBUG: Looking up variable reference ${fe} in recognizedVariables (map has ${s.size} entries)`
                    );
                    const he = Array.from(
                      s.keys()
                    ).slice(0, 10);
                    await t.log(
                      `  DEBUG: Available variable references (first 10): ${he.join(", ")}`
                    );
                    const we = s.has(String(fe));
                    if (await t.log(
                      `  DEBUG: Variable reference ${fe} ${we ? "found" : "NOT FOUND"} in recognizedVariables`
                    ), !we) {
                      const ze = Array.from(
                        s.keys()
                      ).sort((St, na) => parseInt(St) - parseInt(na));
                      await t.log(
                        `  DEBUG: All available variable references: ${ze.join(", ")}`
                      );
                    }
                  }
                  let me = s.get(String(fe));
                  me || (e.type === "VECTOR" && await t.log(
                    `  DEBUG: Variable ${fe} not in recognizedVariables. variableTable=${!!n}, collectionTable=${!!i}, recognizedCollections=${!!$}`
                  ), n && i && $ ? (await t.log(
                    `  Variable reference ${fe} not in recognizedVariables, attempting to resolve from variable table...`
                  ), me = await za(
                    fe,
                    n,
                    i,
                    $
                  ) || void 0, me ? (s.set(String(fe), me), await t.log(
                    `  ✓ Resolved variable ${me.name} from variable table and added to recognizedVariables`
                  )) : await t.warning(
                    `  Failed to resolve variable ${fe} from variable table`
                  )) : e.type === "VECTOR" && await t.warning(
                    `  Cannot resolve variable ${fe} from table - missing required parameters`
                  )), me ? (X.boundVariables[ie] = {
                    type: "VARIABLE_ALIAS",
                    id: me.id
                  }, await t.log(
                    `  ✓ Restored bound variable for fill[${_}].${ie} on "${r.name || "Unnamed"}" (${e.type}): variable ${me.name} (ID: ${me.id.substring(0, 8)}...)`
                  )) : await t.warning(
                    `  Variable reference ${fe} not found in recognizedVariables for fill[${_}].${ie} on "${r.name || "Unnamed"}"`
                  );
                } else
                  e.type === "VECTOR" && await t.warning(
                    `  DEBUG: Variable reference ${fe} is undefined for fill[${_}].${ie} on VECTOR "${r.name || "Unnamed"}"`
                  );
              } else
                e.type === "VECTOR" && await t.warning(
                  `  DEBUG: fill[${_}].${ie} on VECTOR "${r.name || "Unnamed"}" is not a variable reference: ${JSON.stringify(pe)}`
                );
            m.push(X);
          }
          r.fills = m, await t.log(
            `  ✓ Set fills with boundVariables on "${r.name || "Unnamed"}" (${e.type})`
          );
          const S = r.fills, F = e.name || "Unnamed";
          if (Array.isArray(S))
            for (let _ = 0; _ < S.length; _++) {
              const B = S[_];
              B && typeof B == "object" && B.selectionColor !== void 0 && await t.warning(
                `  ⚠️ ISSUE #2: "${F}" fill[${_}] has selectionColor AFTER setting with boundVariables: ${JSON.stringify(B.selectionColor)}`
              );
            }
        } else {
          r.fills = f;
          const m = r.fills, S = e.name || "Unnamed";
          if (Array.isArray(m))
            for (let F = 0; F < m.length; F++) {
              const _ = m[F];
              _ && typeof _ == "object" && _.selectionColor !== void 0 && await t.warning(
                `  ⚠️ ISSUE #2: "${S}" fill[${F}] has selectionColor AFTER setting: ${JSON.stringify(_.selectionColor)}`
              );
            }
        }
        e.boundVariables && Object.keys(e.boundVariables).length > 0 && !e.boundVariables.fills && await t.log(
          `  Node "${r.name || "Unnamed"}" (${e.type}) has boundVariables but not for fills: ${Object.keys(e.boundVariables).join(", ")}`
        );
      } catch (f) {
        console.log("Error setting fills:", f);
      }
    else if (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "GROUP")
      try {
        r.fills = [];
      } catch (f) {
        console.log("Error clearing fills:", f);
      }
  }
  if (e.strokes !== void 0)
    try {
      e.strokes.length > 0 ? r.strokes = e.strokes : r.strokes = [];
    } catch (f) {
      console.log("Error setting strokes:", f);
    }
  else if (e.type === "VECTOR")
    try {
      r.strokes = [];
    } catch (f) {
    }
  const P = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.strokeWeight || e.boundVariables.strokeAlign);
  e.strokeWeight !== void 0 ? (!P || !e.boundVariables.strokeWeight) && (r.strokeWeight = e.strokeWeight) : e.type === "VECTOR" && (e.strokes === void 0 || e.strokes.length === 0) && (!P || !e.boundVariables.strokeWeight) && (r.strokeWeight = 0), e.strokeAlign !== void 0 && (!P || !e.boundVariables.strokeAlign) && (r.strokeAlign = e.strokeAlign);
  const E = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.cornerRadius || e.boundVariables.topLeftRadius || e.boundVariables.topRightRadius || e.boundVariables.bottomLeftRadius || e.boundVariables.bottomRightRadius);
  if (e.cornerRadius !== void 0 && (!E || !e.boundVariables.cornerRadius) && (r.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (r.effects = e.effects), e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") {
    if (e.layoutMode !== void 0 && (["NONE", "HORIZONTAL", "VERTICAL"].includes(e.layoutMode) ? r.layoutMode = e.layoutMode : await t.warning(
      `Invalid layoutMode value "${e.layoutMode}" for node "${e.name || "Unnamed"}", skipping layoutMode setting`
    )), e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.boundVariables && s) {
      const U = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ];
      for (const m of U) {
        const S = e.boundVariables[m];
        if (S && Fe(S)) {
          const F = S._varRef;
          if (F !== void 0) {
            const _ = s.get(String(F));
            if (_) {
              const B = {
                type: "VARIABLE_ALIAS",
                id: _.id
              };
              r.boundVariables || (r.boundVariables = {});
              const H = r[m], Y = (oe = r.boundVariables) == null ? void 0 : oe[m];
              await t.log(
                `  DEBUG: Attempting to set bound variable for ${m} on "${e.name || "Unnamed"}": current value=${H}, current boundVar=${JSON.stringify(Y)}`
              );
              try {
                r.setBoundVariable(m, null);
              } catch (ie) {
              }
              try {
                r.setBoundVariable(m, _);
                const ie = (se = r.boundVariables) == null ? void 0 : se[m];
                await t.log(
                  `  DEBUG: Immediately after setting ${m} bound variable: ${JSON.stringify(ie)}`
                );
              } catch (ie) {
                await t.warning(
                  `  Error setting bound variable for ${m}: ${ie instanceof Error ? ie.message : String(ie)}`
                );
              }
              const X = (re = r.boundVariables) == null ? void 0 : re[m];
              if (m === "itemSpacing") {
                const ie = r[m], pe = (ce = r.boundVariables) == null ? void 0 : ce[m];
                await t.log(
                  `  [ISSUE #1 DEBUG] itemSpacing variable binding for "${e.name || "Unnamed"}":`
                ), await t.log(
                  `    - Expected variable ref: ${F}`
                ), await t.log(
                  `    - Final itemSpacing value: ${ie}`
                ), await t.log(
                  `    - Final boundVariable: ${JSON.stringify(pe)}`
                ), await t.log(
                  `    - Variable found: ${_ ? `Yes (ID: ${_.id})` : "No"}`
                ), !X || !X.id ? await t.warning(
                  "    ⚠️ ISSUE #1: itemSpacing variable binding FAILED - boundVariable not set correctly!"
                ) : await t.log(
                  "    ✓ itemSpacing variable binding SUCCESS"
                );
              }
              X && typeof X == "object" && X.type === "VARIABLE_ALIAS" && X.id === _.id ? await t.log(
                `  ✓ Set bound variable for ${m} on "${e.name || "Unnamed"}" (${e.type}): variable ${_.name} (ID: ${_.id.substring(0, 8)}...)`
              ) : await t.warning(
                `  Failed to set bound variable for ${m} on "${e.name || "Unnamed"}" - verification failed. Expected: ${JSON.stringify(B)}, Got: ${JSON.stringify(X)}`
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
    const f = e.boundVariables && typeof e.boundVariables == "object";
    if (f) {
      const U = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ].filter((m) => e.boundVariables[m]);
      U.length > 0 && await t.log(
        `  DEBUG: Node "${e.name || "Unnamed"}" (${e.type}) has bound variables for: ${U.join(", ")}`
      );
    }
    if (e.paddingLeft !== void 0 && (!f || !e.boundVariables.paddingLeft) && (r.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (!f || !e.boundVariables.paddingRight) && (r.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (!f || !e.boundVariables.paddingTop) && (r.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (!f || !e.boundVariables.paddingBottom) && (r.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && r.layoutMode !== void 0 && r.layoutMode !== "NONE") {
      const U = ((ye = r.boundVariables) == null ? void 0 : ye.itemSpacing) !== void 0;
      !U && (!f || !e.boundVariables.itemSpacing) ? r.itemSpacing !== e.itemSpacing && (await t.log(
        `  Setting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (late setting)`
      ), r.itemSpacing = e.itemSpacing) : U && await t.log(
        `  Skipping late setting of itemSpacing for "${e.name || "Unnamed"}" - already bound to variable`
      );
    }
    e.counterAxisSpacing !== void 0 && (!f || !e.boundVariables.counterAxisSpacing) && r.layoutMode !== void 0 && r.layoutMode !== "NONE" && (r.counterAxisSpacing = e.counterAxisSpacing), e.layoutGrow !== void 0 && (r.layoutGrow = e.layoutGrow);
  }
  if ((e.type === "VECTOR" || e.type === "BOOLEAN_OPERATION" || e.type === "LINE") && (e.strokeCap !== void 0 && (r.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (r.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (r.dashPattern = e.dashPattern), e.type === "VECTOR" || e.type === "BOOLEAN_OPERATION")) {
    if (e.fillGeometry !== void 0)
      try {
        const { normalizeSvgPath: S } = await Promise.resolve().then(() => Aa), F = e.fillGeometry.map((_) => {
          const B = _.data;
          return {
            data: S(B),
            windingRule: _.windingRule || _.windRule || "NONZERO"
          };
        });
        for (let _ = 0; _ < e.fillGeometry.length; _++) {
          const B = e.fillGeometry[_].data, H = F[_].data;
          B !== H && await t.log(
            `  Normalized path ${_ + 1} for "${e.name || "Unnamed"}": ${B.substring(0, 50)}... -> ${H.substring(0, 50)}...`
          );
        }
        r.vectorPaths = F, await t.log(
          `  Set vectorPaths for VECTOR "${e.name || "Unnamed"}" (${F.length} path(s))`
        );
      } catch (S) {
        await t.warning(
          `Error setting vectorPaths for VECTOR "${e.name || "Unnamed"}": ${S}`
        );
      }
    if (e.strokeGeometry !== void 0)
      try {
        r.strokeGeometry = e.strokeGeometry;
      } catch (S) {
        await t.warning(
          `Error setting strokeGeometry for VECTOR "${e.name || "Unnamed"}": ${S}`
        );
      }
    const f = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
    if (e.width !== void 0 && e.height !== void 0 && !f)
      try {
        r.resize(e.width, e.height), await t.log(
          `  Set size for VECTOR "${e.name || "Unnamed"}" to ${e.width}x${e.height}`
        );
      } catch (S) {
        await t.warning(
          `Error setting size for VECTOR "${e.name || "Unnamed"}": ${S}`
        );
      }
    const U = e.constraintHorizontal || (($e = e.constraints) == null ? void 0 : $e.horizontal), m = e.constraintVertical || ((xe = e.constraints) == null ? void 0 : xe.vertical);
    if (U !== void 0 || m !== void 0) {
      await t.log(
        `  [ISSUE #4] "${e.name || "Unnamed"}" (VECTOR) - Setting constraints immediately after size: Expected H=${U || "undefined"}, V=${m || "undefined"}`
      );
      const S = r.constraints || {}, F = S.horizontal || "MIN", _ = S.vertical || "MIN", B = U || F, H = m || _;
      try {
        r.constraints = {
          horizontal: B,
          vertical: H
        };
        const ie = (Be = r.constraints) == null ? void 0 : Be.horizontal, pe = (ke = r.constraints) == null ? void 0 : ke.vertical;
        ie === B && pe === H ? await t.log(
          `  [ISSUE #4] ✓ Constraints set successfully for "${e.name || "Unnamed"}" (VECTOR): H=${ie}, V=${pe}`
        ) : await t.warning(
          `  [ISSUE #4] ⚠️ Constraints set but verification failed! Expected H=${B}, V=${H}, got H=${ie || "undefined"}, V=${pe || "undefined"} for "${e.name || "Unnamed"}"`
        );
      } catch (ie) {
        await t.warning(
          `  [ISSUE #4] ✗ Failed to set constraints for "${e.name || "Unnamed"}" (VECTOR): ${ie instanceof Error ? ie.message : String(ie)}`
        );
      }
      const Y = (Ge = r.constraints) == null ? void 0 : Ge.horizontal, X = (Ze = r.constraints) == null ? void 0 : Ze.vertical;
      await t.log(
        `  [ISSUE #4] "${e.name || "Unnamed"}" (VECTOR) - Final constraints after immediate setting: H=${Y || "undefined"}, V=${X || "undefined"}`
      ), U !== void 0 && Y !== U && await t.warning(
        `  ⚠️ ISSUE #4: "${e.name || "Unnamed"}" constraintHorizontal mismatch! Expected: ${U}, Got: ${Y || "undefined"}`
      ), m !== void 0 && X !== m && await t.warning(
        `  ⚠️ ISSUE #4: "${e.name || "Unnamed"}" constraintVertical mismatch! Expected: ${m}, Got: ${X || "undefined"}`
      ), U !== void 0 && m !== void 0 && Y === U && X === m && await t.log(
        `  ✓ ISSUE #4: "${e.name || "Unnamed"}" (VECTOR) constraints correctly set: H=${Y}, V=${X}`
      );
    }
  }
  if (e.type === "TEXT" && e.characters !== void 0)
    try {
      if (e.fontName)
        try {
          await figma.loadFontAsync(e.fontName), r.fontName = e.fontName;
        } catch (U) {
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
      const f = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.fontSize || e.boundVariables.letterSpacing || e.boundVariables.lineHeight);
      e.fontSize !== void 0 && (!f || !e.boundVariables.fontSize) && (r.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (r.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (r.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (!f || !e.boundVariables.letterSpacing) && (r.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (!f || !e.boundVariables.lineHeight) && (r.lineHeight = e.lineHeight), e.textCase !== void 0 && (r.textCase = e.textCase), e.textDecoration !== void 0 && (r.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (r.textAutoResize = e.textAutoResize);
    } catch (f) {
      console.log("Error setting text properties: " + f);
      try {
        r.characters = e.characters;
      } catch (U) {
        console.log("Could not set text characters: " + U);
      }
    }
  if (e.selectionColor !== void 0) {
    const f = e.name || "Unnamed";
    if (e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.selectionColor !== void 0)
      await t.log(
        `  [ISSUE #2] Skipping direct selectionColor value for "${f}" - will be set via bound variable`
      );
    else
      try {
        r.selectionColor = e.selectionColor, await t.log(
          `  [ISSUE #2] Set selectionColor (direct value) on "${f}": ${JSON.stringify(e.selectionColor)}`
        );
      } catch (m) {
        await t.warning(
          `  [ISSUE #2] Failed to set selectionColor on "${f}": ${m instanceof Error ? m.message : String(m)}`
        );
      }
  }
  if (e.boundVariables && s) {
    const f = [
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "paddingBottom",
      "itemSpacing"
    ];
    for (const [U, m] of Object.entries(
      e.boundVariables
    ))
      if (U !== "fills" && !f.includes(U)) {
        if (U === "selectionColor") {
          const S = e.name || "Unnamed";
          await t.log(
            `  [ISSUE #2] Restoring bound variable for selectionColor on "${S}"`
          );
        }
        if (Fe(m) && n && s) {
          const S = m._varRef;
          if (S !== void 0) {
            const F = s.get(String(S));
            if (F)
              try {
                const _ = {
                  type: "VARIABLE_ALIAS",
                  id: F.id
                };
                r.boundVariables || (r.boundVariables = {});
                const B = r[U];
                B !== void 0 && r.boundVariables[U] === void 0 && await t.warning(
                  `  Property ${U} has direct value ${B} which may prevent bound variable from being set`
                ), r.boundVariables[U] = _;
                const Y = (_e = r.boundVariables) == null ? void 0 : _e[U];
                if (Y && typeof Y == "object" && Y.type === "VARIABLE_ALIAS" && Y.id === F.id)
                  await t.log(
                    `  ✓ Set bound variable for ${U} on "${e.name || "Unnamed"}" (${e.type}): variable ${F.name} (ID: ${F.id.substring(0, 8)}...)`
                  );
                else {
                  const X = (x = r.boundVariables) == null ? void 0 : x[U];
                  await t.warning(
                    `  Failed to set bound variable for ${U} on "${e.name || "Unnamed"}" - bound variable not persisted. Property value: ${B}, Expected: ${JSON.stringify(_)}, Got: ${JSON.stringify(X)}`
                  );
                }
              } catch (_) {
                await t.warning(
                  `  Error setting bound variable for ${U} on "${e.name || "Unnamed"}": ${_}`
                );
              }
            else
              await t.warning(
                `  Variable reference ${S} not found in recognizedVariables for ${U} on "${e.name || "Unnamed"}"`
              );
          }
        }
      }
  }
  if (e.boundVariables && s && (e.boundVariables.width || e.boundVariables.height)) {
    const f = e.boundVariables.width, U = e.boundVariables.height;
    if (f && Fe(f)) {
      const m = f._varRef;
      if (m !== void 0) {
        const S = s.get(String(m));
        if (S) {
          const F = {
            type: "VARIABLE_ALIAS",
            id: S.id
          };
          r.boundVariables || (r.boundVariables = {}), r.boundVariables.width = F;
        }
      }
    }
    if (U && Fe(U)) {
      const m = U._varRef;
      if (m !== void 0) {
        const S = s.get(String(m));
        if (S) {
          const F = {
            type: "VARIABLE_ALIAS",
            id: S.id
          };
          r.boundVariables || (r.boundVariables = {}), r.boundVariables.height = F;
        }
      }
    }
  }
  const k = e.id && o && o.has(e.id) && r.type === "COMPONENT" && r.children && r.children.length > 0;
  if (e.children && Array.isArray(e.children) && r.type !== "INSTANCE" && !k) {
    const f = (m) => {
      const S = [];
      for (const F of m)
        F._truncated || (F.type === "COMPONENT" ? (S.push(F), F.children && Array.isArray(F.children) && S.push(...f(F.children))) : F.children && Array.isArray(F.children) && S.push(...f(F.children)));
      return S;
    };
    for (const m of e.children) {
      if (m._truncated) {
        console.log(
          `Skipping truncated children: ${m._reason || "Unknown"}`
        );
        continue;
      }
      m.type;
    }
    const U = f(e.children);
    await t.log(
      `  First pass: Creating ${U.length} COMPONENT node(s) (without children)...`
    );
    for (const m of U)
      await t.log(
        `  Collected COMPONENT "${m.name || "Unnamed"}" (ID: ${m.id ? m.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const m of U)
      if (m.id && o && !o.has(m.id)) {
        const S = figma.createComponent();
        if (m.name !== void 0 && (S.name = m.name || "Unnamed Node"), m.componentPropertyDefinitions) {
          const F = m.componentPropertyDefinitions;
          let _ = 0, B = 0;
          for (const [H, Y] of Object.entries(F))
            try {
              const ie = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[Y.type];
              if (!ie) {
                await t.warning(
                  `  Unknown property type ${Y.type} for property "${H}" in component "${m.name || "Unnamed"}"`
                ), B++;
                continue;
              }
              const pe = Y.defaultValue, fe = H.split("#")[0];
              S.addComponentProperty(
                fe,
                ie,
                pe
              ), _++;
            } catch (X) {
              await t.warning(
                `  Failed to add component property "${H}" to "${m.name || "Unnamed"}" in first pass: ${X}`
              ), B++;
            }
          _ > 0 && await t.log(
            `  Added ${_} component property definition(s) to "${m.name || "Unnamed"}" in first pass${B > 0 ? ` (${B} failed)` : ""}`
          );
        }
        o.set(m.id, S), await t.log(
          `  Created COMPONENT "${m.name || "Unnamed"}" (ID: ${m.id.substring(0, 8)}...) in first pass`
        );
      }
    for (const m of e.children) {
      if (m._truncated)
        continue;
      const S = r && b && b.has(r.id) ? r.id : p, F = await De(
        m,
        r,
        n,
        i,
        l,
        s,
        o,
        d,
        g,
        w,
        // Pass deferredInstances through for recursive calls
        e,
        // parentNodeData - pass the parent's nodeData so children can check for auto-layout
        $,
        b,
        // Pass placeholderFrameIds through for recursive calls
        S
        // Pass currentPlaceholderId down (or placeholder ID if newNode is a placeholder)
      );
      if (F && F.parent !== r) {
        if (F.parent && typeof F.parent.removeChild == "function")
          try {
            F.parent.removeChild(F);
          } catch (_) {
            await t.warning(
              `Failed to remove child "${F.name || "Unnamed"}" from parent "${F.parent.name || "Unnamed"}": ${_}`
            );
          }
        r.appendChild(F);
      }
    }
  }
  if (a && r.parent !== a) {
    if (r.parent && typeof r.parent.removeChild == "function")
      try {
        r.parent.removeChild(r);
      } catch (f) {
        await t.warning(
          `Failed to remove node "${r.name || "Unnamed"}" from parent "${r.parent.name || "Unnamed"}": ${f}`
        );
      }
    a.appendChild(r);
  }
  if ((r.type === "FRAME" || r.type === "COMPONENT" || r.type === "INSTANCE") && e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.itemSpacing !== void 0) {
    const f = ((ge = r.boundVariables) == null ? void 0 : ge.itemSpacing) !== void 0, U = e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.itemSpacing;
    if (f)
      await t.log(
        `  FINAL CHECK: itemSpacing is bound to variable for "${e.name || "Unnamed"}" - skipping direct value fix`
      );
    else if (U)
      await t.warning(
        `  FINAL CHECK: itemSpacing should be bound to variable for "${e.name || "Unnamed"}" but binding is missing!`
      );
    else {
      const m = r.itemSpacing;
      m !== e.itemSpacing ? (await t.log(
        `  FINAL FIX: Resetting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (was ${m})`
      ), r.itemSpacing = e.itemSpacing, await t.log(
        `  FINAL FIX: Verified itemSpacing is now ${r.itemSpacing}`
      )) : await t.log(
        `  FINAL CHECK: itemSpacing is already correct (${m}) for "${e.name || "Unnamed"}"`
      );
    }
  }
  return r;
}
async function Da(e, a, n) {
  let i = 0, l = 0, s = 0;
  const o = (g) => {
    const w = [];
    if (g.type === "INSTANCE" && w.push(g), "children" in g && g.children)
      for (const u of g.children)
        w.push(...o(u));
    return w;
  }, d = o(e);
  await t.log(
    `  Found ${d.length} instance(s) to process for variant properties`
  );
  for (const g of d)
    try {
      const w = await g.getMainComponentAsync();
      if (!w) {
        l++;
        continue;
      }
      const u = a.getSerializedTable();
      let $ = null, b;
      if (n._instanceTableMap ? (b = n._instanceTableMap.get(
        g.id
      ), b !== void 0 ? ($ = u[b], await t.log(
        `  Found instance table index ${b} for instance "${g.name}" (ID: ${g.id.substring(0, 8)}...)`
      )) : await t.log(
        `  No instance table index mapping found for instance "${g.name}" (ID: ${g.id.substring(0, 8)}...), using fallback matching`
      )) : await t.log(
        `  No instance table map found, using fallback matching for instance "${g.name}"`
      ), !$) {
        for (const [r, y] of Object.entries(u))
          if (y.instanceType === "internal" && y.componentNodeId && n.has(y.componentNodeId)) {
            const c = n.get(y.componentNodeId);
            if (c && c.id === w.id) {
              $ = y, await t.log(
                `  Matched instance "${g.name}" to instance table entry ${r} by component (less precise)`
              );
              break;
            }
          }
      }
      if (!$) {
        await t.log(
          `  No matching entry found for instance "${g.name}" (main component: ${w.name}, ID: ${w.id.substring(0, 8)}...)`
        ), l++;
        continue;
      }
      if (!$.variantProperties) {
        await t.log(
          `  Instance table entry for "${g.name}" has no variant properties`
        ), l++;
        continue;
      }
      await t.log(
        `  Instance "${g.name}" matched to entry with variant properties: ${JSON.stringify($.variantProperties)}`
      );
      let p = null;
      if (w.parent && w.parent.type === "COMPONENT_SET" && (p = w.parent.componentPropertyDefinitions), p) {
        const r = {};
        for (const [y, c] of Object.entries(
          $.variantProperties
        )) {
          const T = y.split("#")[0];
          p[T] && (r[T] = c);
        }
        Object.keys(r).length > 0 ? (g.setProperties(r), i++, await t.log(
          `  ✓ Set variant properties on instance "${g.name}": ${JSON.stringify(r)}`
        )) : l++;
      } else
        l++;
    } catch (w) {
      s++, await t.warning(
        `  Failed to set variant properties on instance "${g.name}": ${w}`
      );
    }
  await t.log(
    `  Variant properties set: ${i} processed, ${l} skipped, ${s} errors`
  );
}
async function Tt(e) {
  await figma.loadAllPagesAsync();
  const a = figma.root.children, n = new Set(a.map((s) => s.name));
  if (!n.has(e))
    return e;
  let i = 1, l = `${e}_${i}`;
  for (; n.has(l); )
    i++, l = `${e}_${i}`;
  return l;
}
async function Ja(e) {
  const a = await figma.variables.getLocalVariableCollectionsAsync(), n = new Set(a.map((s) => s.name));
  if (!n.has(e))
    return e;
  let i = 1, l = `${e}_${i}`;
  for (; n.has(l); )
    i++, l = `${e}_${i}`;
  return l;
}
async function Ha(e, a) {
  const n = /* @__PURE__ */ new Set();
  for (const s of e.variableIds)
    try {
      const o = await figma.variables.getVariableByIdAsync(s);
      o && n.add(o.name);
    } catch (o) {
      continue;
    }
  if (!n.has(a))
    return a;
  let i = 1, l = `${a}_${i}`;
  for (; n.has(l); )
    i++, l = `${a}_${i}`;
  return l;
}
function Dt(e, a) {
  const n = e.resolvedType.toUpperCase(), i = a.toUpperCase();
  return n === i;
}
async function Wa(e) {
  const a = await figma.variables.getLocalVariableCollectionsAsync(), n = Se(e.collectionName);
  if (Ue(e.collectionName)) {
    for (const i of a)
      if (Se(i.name) === n)
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
function Ka(e) {
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
function ft(e) {
  if (!e.stringTable)
    return {
      success: !1,
      error: "Invalid JSON format. String table is required."
    };
  let a;
  try {
    a = ct.fromTable(e.stringTable);
  } catch (i) {
    return {
      success: !1,
      error: `Failed to load string table: ${i instanceof Error ? i.message : "Unknown error"}`
    };
  }
  const n = Ba(e, a);
  return {
    success: !0,
    stringTable: a,
    expandedJsonData: n
  };
}
function Jt(e) {
  if (!e.collections)
    return {
      success: !1,
      error: "No collections table found in JSON"
    };
  try {
    return {
      success: !0,
      collectionTable: et.fromTable(
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
async function qa(e, a) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), s = e.getTable();
  for (const [o, d] of Object.entries(s)) {
    if (d.isLocal === !1) {
      await t.log(
        `Skipping remote collection: "${d.collectionName}" (index ${o})`
      );
      continue;
    }
    const g = Se(d.collectionName), w = a == null ? void 0 : a.get(g);
    if (w) {
      await t.log(
        `✓ Using pre-created collection: "${g}" (index ${o})`
      ), n.set(o, w);
      continue;
    }
    const u = await Wa(d);
    u.matchType === "recognized" ? (await t.log(
      `✓ Recognized collection by GUID: "${d.collectionName}" (index ${o})`
    ), n.set(o, u.collection)) : u.matchType === "potential" ? (await t.log(
      `? Potential match by name: "${d.collectionName}" (index ${o})`
    ), i.set(o, {
      entry: d,
      collection: u.collection
    })) : (await t.log(
      `✗ No match found for collection: "${d.collectionName}" (index ${o}) - will create new`
    ), l.set(o, d));
  }
  return await t.log(
    `Collection matching complete: ${n.size} recognized, ${i.size} potential matches, ${l.size} to create`
  ), {
    recognizedCollections: n,
    potentialMatches: i,
    collectionsToCreate: l
  };
}
async function Xa(e, a, n, i) {
  if (e.size !== 0) {
    if (i) {
      await t.log(
        `Using wizard selections for ${e.size} potential match(es)...`
      );
      for (const [l, { entry: s, collection: o }] of e.entries()) {
        const d = Se(
          s.collectionName
        ).toLowerCase();
        let g = !1;
        d === "tokens" || d === "token" ? g = i.tokens === "existing" : d === "theme" || d === "themes" ? g = i.theme === "existing" : (d === "layer" || d === "layers") && (g = i.layers === "existing");
        const w = Ue(s.collectionName) ? Se(s.collectionName) : o.name;
        g ? (await t.log(
          `✓ Wizard selection: Using existing collection "${w}" (index ${l})`
        ), a.set(l, o), await je(o, s.modes), await t.log(
          `  ✓ Ensured modes for collection "${w}" (${s.modes.length} mode(s))`
        )) : (await t.log(
          `✗ Wizard selection: Will create new collection for "${s.collectionName}" (index ${l})`
        ), n.set(l, s));
      }
      return;
    }
    await t.log(
      `Prompting user for ${e.size} potential match(es)...`
    );
    for (const [l, { entry: s, collection: o }] of e.entries())
      try {
        const d = Ue(s.collectionName) ? Se(s.collectionName) : o.name, g = `Found existing "${d}" variable collection. Should I use it?`;
        await t.log(
          `Prompting user about potential match: "${d}"`
        ), await Ye.prompt(g, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await t.log(
          `✓ User confirmed: Using existing collection "${d}" (index ${l})`
        ), a.set(l, o), await je(o, s.modes), await t.log(
          `  ✓ Ensured modes for collection "${d}" (${s.modes.length} mode(s))`
        );
      } catch (d) {
        await t.log(
          `✗ User rejected: Will create new collection for "${s.collectionName}" (index ${l})`
        ), n.set(l, s);
      }
  }
}
async function Ya(e, a, n) {
  if (e.size === 0)
    return;
  await t.log("Ensuring modes exist for recognized collections...");
  const i = a.getTable();
  for (const [l, s] of e.entries()) {
    const o = i[l];
    o && (n.has(l) || (await je(s, o.modes), await t.log(
      `  ✓ Ensured modes for collection "${s.name}" (${o.modes.length} mode(s))`
    )));
  }
}
async function Za(e, a, n, i) {
  if (e.size !== 0) {
    await t.log(
      `Processing ${e.size} collection(s) to create...`
    );
    for (const [l, s] of e.entries()) {
      const o = Se(s.collectionName), d = i == null ? void 0 : i.get(o);
      if (d) {
        await t.log(
          `Reusing pre-created collection: "${o}" (index ${l}, id: ${d.id.substring(0, 8)}...)`
        ), a.set(l, d), await je(d, s.modes), n.push(d);
        continue;
      }
      const g = await Ja(o);
      g !== o ? await t.log(
        `Creating collection: "${g}" (normalized: "${o}" - name conflict resolved)`
      ) : await t.log(`Creating collection: "${g}"`);
      const w = figma.variables.createVariableCollection(g);
      n.push(w);
      let u;
      if (Ue(s.collectionName)) {
        const $ = lt(s.collectionName);
        $ && (u = $);
      } else s.collectionGuid && (u = s.collectionGuid);
      u && (w.setSharedPluginData(
        "recursica",
        Ve,
        u
      ), await t.log(
        `  Stored GUID: ${u.substring(0, 8)}...`
      )), await je(w, s.modes), await t.log(
        `  ✓ Created collection "${g}" with ${s.modes.length} mode(s)`
      ), a.set(l, w);
    }
    await t.log("Collection creation complete");
  }
}
function Ht(e) {
  if (!e.variables)
    return {
      success: !1,
      error: "No variables table found in JSON"
    };
  try {
    return {
      success: !0,
      variableTable: tt.fromTable(e.variables)
    };
  } catch (a) {
    return {
      success: !1,
      error: `Failed to load variables table: ${a instanceof Error ? a.message : "Unknown error"}`
    };
  }
}
async function Wt(e, a, n, i) {
  const l = /* @__PURE__ */ new Map(), s = [], o = new Set(
    i.map(($) => $.id)
  );
  await t.log("Matching and creating variables in collections...");
  const d = e.getTable(), g = /* @__PURE__ */ new Map();
  for (const [$, b] of Object.entries(d)) {
    if (b._colRef === void 0)
      continue;
    const p = n.get(String(b._colRef));
    if (!p)
      continue;
    g.has(p.id) || g.set(p.id, {
      collectionName: p.name,
      existing: 0,
      created: 0
    });
    const r = g.get(p.id), y = o.has(
      p.id
    );
    let c;
    typeof b.variableType == "number" ? c = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[b.variableType] || String(b.variableType) : c = b.variableType;
    const T = await Ct(
      p,
      b.variableName
    );
    if (T)
      if (Dt(T, c))
        l.set($, T), r.existing++;
      else {
        await t.warning(
          `Type mismatch for variable "${b.variableName}" in collection "${p.name}": expected ${c}, found ${T.resolvedType}. Creating new variable with incremented name.`
        );
        const N = await Ha(
          p,
          b.variableName
        ), V = await $t(
          Ee(de({}, b), {
            variableName: N,
            variableType: c
          }),
          p,
          e,
          a
        );
        y || s.push(V), l.set($, V), r.created++;
      }
    else {
      const N = await $t(
        Ee(de({}, b), {
          variableType: c
        }),
        p,
        e,
        a
      );
      y || s.push(N), l.set($, N), r.created++;
    }
  }
  await t.log("Variable processing complete:");
  for (const $ of g.values())
    await t.log(
      `  "${$.collectionName}": ${$.existing} existing, ${$.created} created`
    );
  await t.log(
    "Final verification: Reading back all COLOR variables..."
  );
  let w = 0, u = 0;
  for (const $ of s)
    if ($.resolvedType === "COLOR") {
      const b = await figma.variables.getVariableCollectionByIdAsync(
        $.variableCollectionId
      );
      if (!b) {
        await t.warning(
          `  ⚠️ Variable "${$.name}" has no variableCollection (ID: ${$.variableCollectionId})`
        );
        continue;
      }
      const p = b.modes;
      if (!p || p.length === 0) {
        await t.warning(
          `  ⚠️ Variable "${$.name}" collection has no modes`
        );
        continue;
      }
      for (const r of p) {
        const y = $.valuesByMode[r.modeId];
        if (y && typeof y == "object" && "r" in y) {
          const c = y;
          Math.abs(c.r - 1) < 0.01 && Math.abs(c.g - 1) < 0.01 && Math.abs(c.b - 1) < 0.01 ? (u++, await t.warning(
            `  ⚠️ Variable "${$.name}" mode "${r.name}" is WHITE: r=${c.r.toFixed(3)}, g=${c.g.toFixed(3)}, b=${c.b.toFixed(3)}`
          )) : (w++, await t.log(
            `  ✓ Variable "${$.name}" mode "${r.name}" has color: r=${c.r.toFixed(3)}, g=${c.g.toFixed(3)}, b=${c.b.toFixed(3)}`
          ));
        } else y && typeof y == "object" && "type" in y || await t.warning(
          `  ⚠️ Variable "${$.name}" mode "${r.name}" has unexpected value type: ${JSON.stringify(y)}`
        );
      }
    }
  return await t.log(
    `Final verification complete: ${w} color variables verified, ${u} white variables found`
  ), {
    recognizedVariables: l,
    newlyCreatedVariables: s
  };
}
function Qa(e) {
  if (!e.instances)
    return null;
  try {
    return at.fromTable(e.instances);
  } catch (a) {
    return null;
  }
}
function en(e) {
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
function mt(e) {
  if (!e || typeof e != "object")
    return;
  e.type !== void 0 && (e.type = en(e.type));
  const a = e.children !== void 0 ? "children" : e.child !== void 0 ? "child" : null;
  if (a && (a === "child" && !e.children && (e.children = e.child, delete e.child), Array.isArray(e.children)))
    for (const n of e.children)
      mt(n);
  e.fillG !== void 0 && e.fillGeometry === void 0 && (e.fillGeometry = e.fillG, delete e.fillG), e.strkG !== void 0 && e.strokeGeometry === void 0 && (e.strokeGeometry = e.strkG, delete e.strkG), e.child && !e.children && (e.children = e.child, delete e.child);
}
async function tn(e, a) {
  const n = /* @__PURE__ */ new Set();
  for (const s of e.children)
    (s.type === "FRAME" || s.type === "COMPONENT") && n.add(s.name);
  if (!n.has(a))
    return a;
  let i = 1, l = `${a}_${i}`;
  for (; n.has(l); )
    i++, l = `${a}_${i}`;
  return l;
}
async function an(e, a, n, i, l, s = "") {
  var r;
  const o = e.getSerializedTable(), d = Object.values(o).filter(
    (y) => y.instanceType === "remote"
  ), g = /* @__PURE__ */ new Map();
  if (d.length === 0)
    return await t.log("No remote instances found"), g;
  await t.log(
    `Processing ${d.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  const w = figma.root.children, u = s ? `${s} REMOTES` : "REMOTES";
  let $ = w.find(
    (y) => y.name === "REMOTES" || y.name === u
  );
  if ($ ? (await t.log("Found existing REMOTES page"), s && !$.name.startsWith(s) && ($.name = u)) : ($ = figma.createPage(), $.name = u, await t.log("Created REMOTES page")), d.length > 0 && ($.setPluginData("RecursicaUnderReview", "true"), await t.log("Marked REMOTES page as under review")), !$.children.some(
    (y) => y.type === "FRAME" && y.name === "Title"
  )) {
    const y = { family: "Inter", style: "Bold" }, c = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(y), await figma.loadFontAsync(c);
    const T = figma.createFrame();
    T.name = "Title", T.layoutMode = "VERTICAL", T.paddingTop = 20, T.paddingBottom = 20, T.paddingLeft = 20, T.paddingRight = 20, T.fills = [];
    const N = figma.createText();
    N.fontName = y, N.characters = "REMOTE INSTANCES", N.fontSize = 24, N.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], T.appendChild(N);
    const V = figma.createText();
    V.fontName = c, V.characters = "These are remotely connected component instances found in our different component pages.", V.fontSize = 14, V.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], T.appendChild(V), $.appendChild(T), await t.log("Created title and description on REMOTES page");
  }
  const p = /* @__PURE__ */ new Map();
  for (const [y, c] of Object.entries(o)) {
    if (c.instanceType !== "remote")
      continue;
    const T = parseInt(y, 10);
    if (await t.log(
      `Processing remote instance ${T}: "${c.componentName}"`
    ), !c.structure) {
      await t.warning(
        `Remote instance "${c.componentName}" missing structure data, skipping`
      );
      continue;
    }
    mt(c.structure);
    const N = c.structure.children !== void 0, V = c.structure.child !== void 0, R = c.structure.children ? c.structure.children.length : c.structure.child ? c.structure.child.length : 0;
    await t.log(
      `  Structure type: ${c.structure.type || "unknown"}, has children: ${R} (children key: ${N}, child key: ${V})`
    );
    let ae = c.componentName;
    if (c.path && c.path.length > 0) {
      const E = c.path.filter((k) => k !== "").join(" / ");
      E && (ae = `${E} / ${c.componentName}`);
    }
    const P = await tn(
      $,
      ae
    );
    P !== ae && await t.log(
      `Component name conflict: "${ae}" -> "${P}"`
    );
    try {
      if (c.structure.type !== "COMPONENT") {
        await t.warning(
          `Remote instance "${c.componentName}" structure is not a COMPONENT (type: ${c.structure.type}), creating frame fallback`
        );
        const k = figma.createFrame();
        k.name = P;
        const j = await De(
          c.structure,
          k,
          a,
          n,
          null,
          i,
          p,
          !0,
          // isRemoteStructure: true
          null,
          // remoteComponentMap - not needed here
          null,
          // deferredInstances - not needed for remote instances
          null,
          // parentNodeData - not available for remote structures
          l,
          null,
          // placeholderFrameIds - not needed for remote instances
          void 0
          // currentPlaceholderId - remote instances are not inside placeholders
        );
        j ? (k.appendChild(j), $.appendChild(k), await t.log(
          `✓ Created remote instance frame fallback: "${P}"`
        )) : k.remove();
        continue;
      }
      const E = figma.createComponent();
      E.name = P, $.appendChild(E), await t.log(
        `  Created component node: "${P}"`
      );
      try {
        if (c.structure.componentPropertyDefinitions) {
          const A = c.structure.componentPropertyDefinitions;
          let O = 0, K = 0;
          for (const [ne, M] of Object.entries(A))
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
              }[M.type];
              if (!z) {
                await t.warning(
                  `  Unknown property type ${M.type} for property "${ne}" in component "${c.componentName}"`
                ), K++;
                continue;
              }
              const J = M.defaultValue, D = ne.split("#")[0];
              E.addComponentProperty(
                D,
                z,
                J
              ), O++;
            } catch (L) {
              await t.warning(
                `  Failed to add component property "${ne}" to "${c.componentName}": ${L}`
              ), K++;
            }
          O > 0 && await t.log(
            `  Added ${O} component property definition(s) to "${c.componentName}"${K > 0 ? ` (${K} failed)` : ""}`
          );
        }
        c.structure.name !== void 0 && (E.name = c.structure.name);
        const k = c.structure.boundVariables && typeof c.structure.boundVariables == "object" && (c.structure.boundVariables.width || c.structure.boundVariables.height);
        c.structure.width !== void 0 && c.structure.height !== void 0 && !k && E.resize(c.structure.width, c.structure.height), c.structure.x !== void 0 && (E.x = c.structure.x), c.structure.y !== void 0 && (E.y = c.structure.y);
        const j = c.structure.boundVariables && typeof c.structure.boundVariables == "object";
        if (c.structure.visible !== void 0 && (E.visible = c.structure.visible), c.structure.opacity !== void 0 && (!j || !c.structure.boundVariables.opacity) && (E.opacity = c.structure.opacity), c.structure.rotation !== void 0 && (!j || !c.structure.boundVariables.rotation) && (E.rotation = c.structure.rotation), c.structure.blendMode !== void 0 && (!j || !c.structure.boundVariables.blendMode) && (E.blendMode = c.structure.blendMode), c.structure.fills !== void 0)
          try {
            let A = c.structure.fills;
            Array.isArray(A) && (A = A.map((O) => {
              if (O && typeof O == "object") {
                const K = de({}, O);
                return delete K.boundVariables, K;
              }
              return O;
            })), E.fills = A, (r = c.structure.boundVariables) != null && r.fills && i && await jt(
              E,
              c.structure.boundVariables,
              "fills",
              i
            );
          } catch (A) {
            await t.warning(
              `Error setting fills for remote component "${c.componentName}": ${A}`
            );
          }
        if (c.structure.strokes !== void 0)
          try {
            E.strokes = c.structure.strokes;
          } catch (A) {
            await t.warning(
              `Error setting strokes for remote component "${c.componentName}": ${A}`
            );
          }
        const C = c.structure.boundVariables && typeof c.structure.boundVariables == "object" && (c.structure.boundVariables.strokeWeight || c.structure.boundVariables.strokeAlign);
        c.structure.strokeWeight !== void 0 && (!C || !c.structure.boundVariables.strokeWeight) && (E.strokeWeight = c.structure.strokeWeight), c.structure.strokeAlign !== void 0 && (!C || !c.structure.boundVariables.strokeAlign) && (E.strokeAlign = c.structure.strokeAlign), c.structure.layoutMode !== void 0 && (E.layoutMode = c.structure.layoutMode), c.structure.primaryAxisSizingMode !== void 0 && (E.primaryAxisSizingMode = c.structure.primaryAxisSizingMode), c.structure.counterAxisSizingMode !== void 0 && (E.counterAxisSizingMode = c.structure.counterAxisSizingMode);
        const v = c.structure.boundVariables && typeof c.structure.boundVariables == "object";
        c.structure.paddingLeft !== void 0 && (!v || !c.structure.boundVariables.paddingLeft) && (E.paddingLeft = c.structure.paddingLeft), c.structure.paddingRight !== void 0 && (!v || !c.structure.boundVariables.paddingRight) && (E.paddingRight = c.structure.paddingRight), c.structure.paddingTop !== void 0 && (!v || !c.structure.boundVariables.paddingTop) && (E.paddingTop = c.structure.paddingTop), c.structure.paddingBottom !== void 0 && (!v || !c.structure.boundVariables.paddingBottom) && (E.paddingBottom = c.structure.paddingBottom), c.structure.itemSpacing !== void 0 && (!v || !c.structure.boundVariables.itemSpacing) && (E.itemSpacing = c.structure.itemSpacing);
        const h = c.structure.boundVariables && typeof c.structure.boundVariables == "object" && (c.structure.boundVariables.cornerRadius || c.structure.boundVariables.topLeftRadius || c.structure.boundVariables.topRightRadius || c.structure.boundVariables.bottomLeftRadius || c.structure.boundVariables.bottomRightRadius);
        if (c.structure.cornerRadius !== void 0 && (!h || !c.structure.boundVariables.cornerRadius) && (E.cornerRadius = c.structure.cornerRadius), c.structure.boundVariables && i) {
          const A = c.structure.boundVariables, O = [
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
          for (const K of O)
            if (A[K] && Fe(A[K])) {
              const ne = A[K]._varRef;
              if (ne !== void 0) {
                const M = i.get(String(ne));
                if (M) {
                  const L = {
                    type: "VARIABLE_ALIAS",
                    id: M.id
                  };
                  E.boundVariables || (E.boundVariables = {}), E.boundVariables[K] = L;
                }
              }
            }
        }
        await t.log(
          `  DEBUG: Structure keys: ${Object.keys(c.structure).join(", ")}, has children: ${!!c.structure.children}, has child: ${!!c.structure.child}`
        );
        const I = c.structure.children || (c.structure.child ? c.structure.child : null);
        if (await t.log(
          `  DEBUG: childrenArray exists: ${!!I}, isArray: ${Array.isArray(I)}, length: ${I ? I.length : 0}`
        ), I && Array.isArray(I) && I.length > 0) {
          await t.log(
            `  Recreating ${I.length} child(ren) for component "${c.componentName}"`
          );
          for (let A = 0; A < I.length; A++) {
            const O = I[A];
            if (await t.log(
              `  DEBUG: Processing child ${A + 1}/${I.length}: ${JSON.stringify({ name: O == null ? void 0 : O.name, type: O == null ? void 0 : O.type, hasTruncated: !!(O != null && O._truncated) })}`
            ), O._truncated) {
              await t.log(
                `  Skipping truncated child: ${O._reason || "Unknown"}`
              );
              continue;
            }
            await t.log(
              `  Recreating child: "${O.name || "Unnamed"}" (type: ${O.type})`
            );
            const K = await De(
              O,
              E,
              a,
              n,
              null,
              i,
              p,
              !0,
              // isRemoteStructure: true
              null,
              // remoteComponentMap - not needed here
              null,
              // deferredInstances - not needed for remote instances
              c.structure,
              // parentNodeData - pass the component's structure so children can check for auto-layout
              l,
              null,
              // placeholderFrameIds - not needed for remote instances
              void 0
              // currentPlaceholderId - remote instances are not inside placeholders
            );
            K ? (E.appendChild(K), await t.log(
              `  ✓ Appended child "${O.name || "Unnamed"}" to component "${c.componentName}"`
            )) : await t.warning(
              `  ✗ Failed to create child "${O.name || "Unnamed"}" (type: ${O.type})`
            );
          }
        }
        g.set(T, E), await t.log(
          `✓ Created remote component: "${P}" (index ${T})`
        );
      } catch (k) {
        await t.warning(
          `Error populating remote component "${c.componentName}": ${k instanceof Error ? k.message : "Unknown error"}`
        ), E.remove();
      }
    } catch (E) {
      await t.warning(
        `Error recreating remote instance "${c.componentName}": ${E instanceof Error ? E.message : "Unknown error"}`
      );
    }
  }
  return await t.log(
    `Remote instance processing complete: ${g.size} component(s) created`
  ), g;
}
async function nn(e, a, n, i, l, s, o = null, d = null, g = null, w = !1, u = null, $ = !1, b = !1, p = "") {
  await t.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const r = figma.root.children, y = "RecursicaPublishedMetadata";
  let c = null;
  for (const C of r) {
    const v = C.getPluginData(y);
    if (v)
      try {
        if (JSON.parse(v).id === e.guid) {
          c = C;
          break;
        }
      } catch (h) {
        continue;
      }
  }
  let T = !1;
  if (c && !w && !$) {
    let C;
    try {
      const I = c.getPluginData(y);
      I && (C = JSON.parse(I).version);
    } catch (I) {
    }
    const v = C !== void 0 ? ` v${C}` : "", h = `Found existing component "${c.name}${v}". Should I use it or create a copy?`;
    await t.log(
      `Found existing page with same GUID: "${c.name}". Prompting user...`
    );
    try {
      await Ye.prompt(h, {
        okLabel: "Use",
        cancelLabel: "Copy",
        timeoutMs: 3e5
        // 5 minutes
      }), T = !0, await t.log(
        `User chose to use existing page: "${c.name}"`
      );
    } catch (I) {
      await t.log(
        "User chose to create a copy. Will create new page."
      );
    }
  }
  if (T && c)
    return await figma.setCurrentPageAsync(c), await t.log(
      `Using existing page: "${c.name}" (GUID: ${e.guid.substring(0, 8)}...)`
    ), await t.log(
      `  Instances from other pages will resolve to components on this existing page using componentPageName: "${c.name}"`
    ), {
      success: !0,
      page: c,
      // Include pageId so it can be tracked in importedPages
      pageId: c.id
    };
  const N = r.find((C) => C.name === e.name);
  N && await t.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let V;
  if (c || N) {
    const C = `__${e.name}`;
    V = await Tt(C), await t.log(
      `Creating scratch page: "${V}" (will be renamed to "${e.name}" on success)`
    );
  } else
    V = e.name, await t.log(`Creating page: "${V}"`);
  const R = figma.createPage();
  if (R.name = V, await figma.setCurrentPageAsync(R), await t.log(`Switched to page: "${V}"`), !a.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await t.log("Recreating page structure...");
  const ae = a.pageData;
  if (ae.backgrounds !== void 0)
    try {
      R.backgrounds = ae.backgrounds, await t.log(
        `Set page background: ${JSON.stringify(ae.backgrounds)}`
      );
    } catch (C) {
      await t.warning(`Failed to set page background: ${C}`);
    }
  mt(ae);
  const P = /* @__PURE__ */ new Map(), E = (C, v = []) => {
    if (C.type === "COMPONENT" && C.id && v.push(C.id), C.children && Array.isArray(C.children))
      for (const h of C.children)
        h._truncated || E(h, v);
    return v;
  }, k = E(ae);
  if (await t.log(
    `Found ${k.length} COMPONENT node(s) in page data`
  ), k.length > 0 && (await t.log(
    `Component IDs in page data (first 20): ${k.slice(0, 20).map((C) => C.substring(0, 8) + "...").join(", ")}`
  ), ae._allComponentIds = k), ae.children && Array.isArray(ae.children))
    for (const C of ae.children) {
      const v = await De(
        C,
        R,
        n,
        i,
        l,
        s,
        P,
        !1,
        // isRemoteStructure: false - we're creating the main page
        o,
        d,
        ae,
        // parentNodeData - pass the page's nodeData so children can check for auto-layout
        u,
        g,
        void 0
        // currentPlaceholderId - page root is not inside a placeholder
      );
      v && R.appendChild(v);
    }
  await t.log("Page structure recreated successfully"), l && (await t.log(
    "Third pass: Setting variant properties on instances..."
  ), await Da(
    R,
    l,
    P
  ));
  const j = {
    _ver: 1,
    id: e.guid,
    name: e.name,
    version: e.version || 0,
    publishDate: (/* @__PURE__ */ new Date()).toISOString(),
    history: {}
  };
  if (R.setPluginData(y, JSON.stringify(j)), await t.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), V.startsWith("__")) {
    let C;
    b ? C = p ? `${p} ${e.name}` : e.name : C = await Tt(e.name), R.name = C, await t.log(`Renamed page from "${V}" to "${C}"`);
  } else b && p && (R.name.startsWith(p) || (R.name = `${p} ${R.name}`));
  return {
    success: !0,
    page: R,
    deferredInstances: d || void 0
  };
}
async function Nt(e) {
  var i, l, s;
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
    const d = Ka(o);
    if (!d.success)
      return await t.error(d.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: d.error,
        data: {}
      };
    const g = d.metadata;
    await t.log(
      `Metadata validated: guid=${g.guid}, name=${g.name}`
    ), await t.log("Loading string table...");
    const w = ft(o);
    if (!w.success)
      return await t.error(w.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: w.error,
        data: {}
      };
    await t.log("String table loaded successfully"), await t.log("Expanding JSON data...");
    const u = w.expandedJsonData;
    await t.log("JSON expanded successfully"), await t.log("Loading collections table...");
    const $ = Jt(u);
    if (!$.success)
      return $.error === "No collections table found in JSON" ? (await t.log($.error), await t.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: g.name }
      }) : (await t.error($.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: $.error,
        data: {}
      });
    const b = $.collectionTable;
    await t.log(
      `Loaded collections table with ${b.getSize()} collection(s)`
    ), await t.log(
      "Matching collections with existing local collections..."
    );
    const { recognizedCollections: p, potentialMatches: r, collectionsToCreate: y } = await qa(b, e.preCreatedCollections);
    await Xa(
      r,
      p,
      y,
      e.collectionChoices
    ), await Ya(
      p,
      b,
      r
    ), await Za(
      y,
      p,
      n,
      e.preCreatedCollections
    ), await t.log("Loading variables table...");
    const c = Ht(u);
    if (!c.success)
      return c.error === "No variables table found in JSON" ? (await t.log(c.error), await t.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no variables to process)",
        data: { pageName: g.name }
      }) : (await t.error(c.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: c.error,
        data: {}
      });
    const T = c.variableTable;
    await t.log(
      `Loaded variables table with ${T.getSize()} variable(s)`
    );
    const { recognizedVariables: N, newlyCreatedVariables: V } = await Wt(
      T,
      b,
      p,
      n
    );
    await t.log("Loading instance table...");
    const R = Qa(u);
    if (R) {
      const M = R.getSerializedTable(), L = Object.values(M).filter(
        (J) => J.instanceType === "internal"
      ), z = Object.values(M).filter(
        (J) => J.instanceType === "remote"
      );
      await t.log(
        `Loaded instance table with ${R.getSize()} instance(s) (${L.length} internal, ${z.length} remote)`
      );
    } else
      await t.log("No instance table found in JSON");
    const ae = [], P = /* @__PURE__ */ new Set(), E = (i = e.isMainPage) != null ? i : !0, k = (l = e.alwaysCreateCopy) != null ? l : !1, j = (s = e.skipUniqueNaming) != null ? s : !1, C = e.constructionIcon || "";
    let v = null;
    R && (v = await an(
      R,
      T,
      b,
      N,
      p,
      C
    ));
    const h = await nn(
      g,
      u,
      T,
      b,
      R,
      N,
      v,
      ae,
      P,
      E,
      p,
      k,
      j,
      C
    );
    if (!h.success)
      return await t.error(h.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: h.error,
        data: {}
      };
    const I = h.page, A = N.size + V.length, O = h.deferredInstances || ae, K = (O == null ? void 0 : O.length) || 0;
    if (await t.log("=== Import Complete ==="), await t.log(
      `Successfully processed ${p.size} collection(s), ${A} variable(s), and created page "${I.name}"${K > 0 ? ` (${K} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`
    ), K > 0)
      for (const M of O)
        await t.log(
          `    - "${M.nodeData.name}" from page "${M.instanceEntry.componentPageName}"`
        );
    const ne = h.pageId || I.id;
    return {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: {
        pageName: I.name,
        pageId: ne,
        // Include pageId for tracking (used for both new and reused pages)
        deferredInstances: K > 0 ? O : void 0,
        createdEntities: {
          pageIds: [I.id],
          collectionIds: n.map((M) => M.id),
          variableIds: V.map((M) => M.id)
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
async function Ot(e, a, n) {
  var i, l;
  if (!(!n || !a.children || !Array.isArray(a.children) || !e.children || e.children.length === 0)) {
    await t.log(
      `[FILL-BOUND] Applying fill bound variables to instance "${e.name}" children. Instance has ${e.children.length} child(ren), JSON has ${((i = a.children) == null ? void 0 : i.length) || 0} child(ren)`
    );
    for (const s of e.children) {
      if (!("fills" in s) || !Array.isArray(s.fills)) {
        await t.log(
          `[FILL-BOUND] Skipping child "${s.name}" - no fills property`
        );
        continue;
      }
      const o = a.children.find(
        (d) => d.name === s.name
      );
      if (!o) {
        await t.log(
          `[FILL-BOUND] No JSON data found for child "${s.name}" in instance "${e.name}"`
        );
        continue;
      }
      if (!((l = o.boundVariables) != null && l.fills)) {
        await t.log(
          `[FILL-BOUND] Child "${s.name}" in instance "${e.name}" has no fill bound variables in JSON`
        );
        continue;
      }
      await t.log(
        `[FILL-BOUND] Found fill bound variables for child "${s.name}" in instance "${e.name}"`
      );
      try {
        if (!n) {
          await t.warning(
            "[FILL-BOUND] Cannot apply fill bound variables: recognizedVariables is null"
          );
          continue;
        }
        const d = o.boundVariables.fills;
        if (!Array.isArray(d))
          continue;
        const g = [];
        for (let w = 0; w < s.fills.length && w < d.length; w++) {
          const u = s.fills[w], $ = d[w];
          if ($ && typeof $ == "object") {
            let b = null;
            if ($._varRef !== void 0) {
              const p = $._varRef;
              b = n.get(String(p)) || null;
            } else if ($.color) {
              const p = $.color;
              p._varRef !== void 0 ? b = n.get(String(p._varRef)) || null : p.type === "VARIABLE_ALIAS" && p.id && (b = await figma.variables.getVariableByIdAsync(
                p.id
              ));
            } else $.type === "VARIABLE_ALIAS" && $.id && (b = await figma.variables.getVariableByIdAsync(
              $.id
            ));
            if (b && u.type === "SOLID") {
              const p = u, r = {
                type: "SOLID",
                visible: p.visible,
                opacity: p.opacity,
                blendMode: p.blendMode,
                color: de({}, p.color)
                // This will be overridden by the variable
              }, y = figma.variables.setBoundVariableForPaint(
                r,
                "color",
                b
              );
              g.push(y), await t.log(
                `[FILL-BOUND] ✓ Bound variable "${b.name}" (${b.id}) to fill[${w}].color on child "${s.name}"`
              );
            } else b ? (g.push(u), b ? u.type !== "SOLID" && await t.log(
              `[FILL-BOUND] Fill[${w}] on child "${s.name}" is type "${u.type}" - variable binding for non-solid fills not yet implemented`
            ) : await t.warning(
              `[FILL-BOUND] Could not resolve variable for fill[${w}] on child "${s.name}"`
            )) : g.push(u);
          } else
            g.push(u);
        }
        s.fills = g, await t.log(
          `[FILL-BOUND] ✓ Applied fill bound variables to child "${s.name}" in instance "${e.name}" (${g.length} fill(s))`
        );
      } catch (d) {
        await t.warning(
          `Error applying fill bound variables to instance child "${s.name}": ${d instanceof Error ? d.message : String(d)}`
        );
      }
    }
    await t.log(
      `[FILL-BOUND] Finished applying fill bound variables to instance "${e.name}" children`
    );
  }
}
async function Vt(e, a) {
  if (!a.children || !Array.isArray(a.children) || !e.children || e.children.length === 0)
    return;
  const n = (s, o) => {
    if ("children" in s && Array.isArray(s.children))
      for (const d of s.children) {
        if (d.name === o)
          return d;
        const g = n(d, o);
        if (g)
          return g;
      }
    return null;
  };
  for (const s of a.children) {
    if (!s || !s.name)
      continue;
    n(
      e,
      s.name
    ) || await t.warning(
      `Child "${s.name}" in JSON does not exist in instance "${e.name}" - skipping (instance override or Figma limitation)`
    );
  }
  const i = new Set(
    (a.children || []).map((s) => s == null ? void 0 : s.name).filter(Boolean)
  ), l = e.children.filter(
    (s) => !i.has(s.name)
  );
  l.length > 0 && await t.log(
    `Instance "${e.name}" has ${l.length} child(ren) not in JSON - keeping default children: ${l.map((s) => s.name).join(", ")}`
  );
}
async function Et(e, a = "", n = null, i = null, l = null, s = null) {
  var b;
  if (e.length === 0)
    return { resolved: 0, failed: 0, errors: [] };
  await t.log(
    `=== Resolving ${e.length} deferred normal instance(s) ===`
  );
  let o = 0, d = 0;
  const g = [];
  await figma.loadAllPagesAsync();
  const w = (p, r, y = /* @__PURE__ */ new Set()) => {
    if (!p.parentPlaceholderId || y.has(p.placeholderFrameId))
      return 0;
    y.add(p.placeholderFrameId);
    const c = r.find(
      (T) => T.placeholderFrameId === p.parentPlaceholderId
    );
    return c ? 1 + w(c, r, y) : 0;
  }, u = e.map((p) => ({
    deferred: p,
    depth: w(p, e)
  }));
  if (u.sort((p, r) => r.depth - p.depth), await t.log(
    `[BOTTOM-UP] Sorted ${e.length} deferred instance(s) by depth (deepest first)`
  ), u.length > 0) {
    const p = Math.max(...u.map((r) => r.depth));
    await t.log(
      `[BOTTOM-UP] Depth range: 0 (root) to ${p} (deepest)`
    );
  }
  const $ = /* @__PURE__ */ new Set();
  for (const p of e)
    p.parentPlaceholderId && ($.add(p.placeholderFrameId), await t.log(
      `[NESTED] Pre-marked child deferred instance "${p.nodeData.name}" (placeholder: ${p.placeholderFrameId.substring(0, 8)}..., parent placeholder: ${p.parentPlaceholderId.substring(0, 8)}...)`
    ));
  await t.log(
    `[NESTED] Pre-marked ${$.size} child deferred instance(s) to skip in main loop`
  );
  for (const { deferred: p } of u) {
    if ($.has(p.placeholderFrameId)) {
      await t.log(
        `[NESTED] Skipping child deferred instance "${p.nodeData.name}" (placeholder: ${p.placeholderFrameId.substring(0, 8)}...) - will be resolved when parent is resolved`
      );
      continue;
    }
    try {
      const { placeholderFrameId: r, instanceEntry: y, nodeData: c, parentNodeId: T } = p, N = await figma.getNodeByIdAsync(
        r
      ), V = await figma.getNodeByIdAsync(
        T
      );
      if (!N || !V) {
        const v = p.parentPlaceholderId !== void 0, h = $.has(r), I = `Deferred instance "${c.name}" - could not find placeholder frame (${r.substring(0, 8)}...) or parent node (${T.substring(0, 8)}...). Was child deferred: ${v}, Was marked: ${h}`;
        await t.error(I), v && !h && await t.error(
          `[NESTED] BUG: Child deferred instance "${c.name}" was not properly marked! parentPlaceholderId: ${(b = p.parentPlaceholderId) == null ? void 0 : b.substring(0, 8)}...`
        ), g.push(I), d++;
        continue;
      }
      let R = figma.root.children.find((v) => {
        const h = v.name === y.componentPageName, I = a && v.name === `${a} ${y.componentPageName}`;
        return h || I;
      });
      if (!R) {
        const v = ue(
          y.componentPageName
        );
        R = figma.root.children.find((h) => ue(h.name) === v);
      }
      if (!R) {
        const v = a ? `"${y.componentPageName}" or "${a} ${y.componentPageName}"` : `"${y.componentPageName}"`, h = `Deferred instance "${c.name}" still cannot find referenced page (tried: ${v}, and clean name matching)`;
        await t.error(h), g.push(h), d++;
        continue;
      }
      const ae = (v, h, I, A, O) => {
        if (h.length === 0) {
          let L = null;
          const z = ue(I);
          for (const J of v.children || [])
            if (J.type === "COMPONENT") {
              const D = J.name === I, W = ue(J.name) === z;
              if (D || W) {
                if (L || (L = J), D && A)
                  try {
                    const te = J.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (te && JSON.parse(te).id === A)
                      return J;
                  } catch (te) {
                  }
                else if (D)
                  return J;
              }
            } else if (J.type === "COMPONENT_SET") {
              if (O) {
                const D = J.name === O, W = ue(J.name) === ue(O);
                if (!D && !W)
                  continue;
              }
              for (const D of J.children || [])
                if (D.type === "COMPONENT") {
                  const W = D.name === I, te = ue(D.name) === z;
                  if (W || te) {
                    if (L || (L = D), W && A)
                      try {
                        const q = D.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (q && JSON.parse(q).id === A)
                          return D;
                      } catch (q) {
                      }
                    else if (W)
                      return D;
                  }
                }
            }
          return L;
        }
        const [K, ...ne] = h, M = ue(K);
        for (const L of v.children || []) {
          const z = L.name === K, J = ue(L.name) === M;
          if (z || J) {
            if (ne.length === 0) {
              if (L.type === "COMPONENT_SET") {
                if (O) {
                  const te = L.name === O, q = ue(L.name) === ue(O);
                  if (!te && !q)
                    continue;
                }
                const D = ue(I);
                let W = null;
                for (const te of L.children || [])
                  if (te.type === "COMPONENT") {
                    const q = te.name === I, G = ue(te.name) === D;
                    if (q || G) {
                      if (W || (W = te), A)
                        try {
                          const Z = te.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (Z && JSON.parse(Z).id === A)
                            return te;
                        } catch (Z) {
                        }
                      if (q)
                        return te;
                    }
                  }
                return W || null;
              }
              return null;
            }
            return ne.length > 0 ? ae(
              L,
              ne,
              I,
              A,
              O
            ) : null;
          }
        }
        return null;
      };
      let P = ae(
        R,
        y.path || [],
        y.componentName,
        y.componentGuid,
        y.componentSetName
      );
      if (!P && y.componentSetName) {
        const v = (h, I = 0) => {
          if (I > 5) return null;
          for (const A of h.children || []) {
            if (A.type === "COMPONENT_SET") {
              const O = A.name === y.componentSetName, K = ue(A.name) === ue(y.componentSetName || "");
              if (O || K) {
                const ne = ue(
                  y.componentName
                );
                for (const M of A.children || [])
                  if (M.type === "COMPONENT") {
                    const L = M.name === y.componentName, z = ue(M.name) === ne;
                    if (L || z) {
                      if (y.componentGuid)
                        try {
                          const J = M.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (J && JSON.parse(J).id === y.componentGuid)
                            return M;
                        } catch (J) {
                        }
                      return M;
                    }
                  }
              }
            }
            if (A.type === "FRAME" || A.type === "GROUP") {
              const O = v(A, I + 1);
              if (O) return O;
            }
          }
          return null;
        };
        P = v(R);
      }
      if (!P) {
        const v = y.path && y.path.length > 0 ? ` at path [${y.path.join(" → ")}]` : " at page root", h = [], I = (O, K = 0) => {
          if (!(K > 3) && ((O.type === "COMPONENT" || O.type === "COMPONENT_SET") && h.push(
            `${O.type}: "${O.name}"${O.type === "COMPONENT_SET" ? ` (${O.children.length} variants)` : ""}`
          ), O.children && Array.isArray(O.children)))
            for (const ne of O.children.slice(0, 10))
              I(ne, K + 1);
        };
        I(R);
        const A = `Deferred instance "${c.name}" still cannot find component "${y.componentName}" on page "${y.componentPageName}"${v}`;
        await t.error(A), g.push(A), d++;
        continue;
      }
      const E = P.createInstance();
      if (E.name = c.name || N.name.replace("[Deferred: ", "").replace("]", ""), E.x = N.x, E.y = N.y, N.width !== void 0 && N.height !== void 0 && E.resize(N.width, N.height), y.variantProperties && Object.keys(y.variantProperties).length > 0)
        try {
          const v = await E.getMainComponentAsync();
          if (v) {
            let h = null;
            const I = v.type;
            if (I === "COMPONENT_SET" ? h = v.componentPropertyDefinitions : I === "COMPONENT" && v.parent && v.parent.type === "COMPONENT_SET" ? h = v.parent.componentPropertyDefinitions : await t.warning(
              `Cannot set variant properties for resolved instance "${c.name}" - main component is not a COMPONENT_SET or variant`
            ), h) {
              const A = {};
              for (const [O, K] of Object.entries(
                y.variantProperties
              )) {
                const ne = O.split("#")[0];
                h[ne] && (A[ne] = K);
              }
              Object.keys(A).length > 0 && E.setProperties(A);
            }
          }
        } catch (v) {
          await t.warning(
            `Failed to set variant properties for resolved instance "${c.name}": ${v}`
          );
        }
      if (y.componentProperties && Object.keys(y.componentProperties).length > 0)
        try {
          const v = await E.getMainComponentAsync();
          if (v) {
            let h = null;
            const I = v.type;
            if (I === "COMPONENT_SET" ? h = v.componentPropertyDefinitions : I === "COMPONENT" && v.parent && v.parent.type === "COMPONENT_SET" ? h = v.parent.componentPropertyDefinitions : I === "COMPONENT" && (h = v.componentPropertyDefinitions), h)
              for (const [A, O] of Object.entries(
                y.componentProperties
              )) {
                const K = A.split("#")[0];
                if (h[K])
                  try {
                    E.setProperties({
                      [K]: O
                    });
                  } catch (ne) {
                    await t.warning(
                      `Failed to set component property "${K}" for resolved instance "${c.name}": ${ne}`
                    );
                  }
              }
          }
        } catch (v) {
          await t.warning(
            `Failed to set component properties for resolved instance "${c.name}": ${v}`
          );
        }
      await Ot(
        E,
        c,
        n
      ), await Vt(E, c), await t.log(
        `[NESTED] Extracting child deferred instances for placeholder "${c.name}" (${r.substring(0, 8)}...). Total deferred instances: ${e.length}`
      );
      const k = async (v) => {
        try {
          const h = await figma.getNodeByIdAsync(v);
          if (!h || !h.parent) return !1;
          let I = h.parent;
          for (; I; ) {
            if (I.id === r)
              return !0;
            if (I.type === "PAGE")
              break;
            I = I.parent;
          }
          return !1;
        } catch (h) {
          return !1;
        }
      }, j = [];
      for (const v of e)
        v.parentPlaceholderId === r ? (j.push(v), await t.log(
          `[NESTED]   - Found child by parentPlaceholderId: "${v.nodeData.name}" (placeholder: ${v.placeholderFrameId.substring(0, 8)}...)`
        )) : await k(
          v.placeholderFrameId
        ) && (j.push(v), await t.log(
          `[NESTED]   - Found child by structural check: "${v.nodeData.name}" (placeholder: ${v.placeholderFrameId.substring(0, 8)}...) - placeholder is inside current placeholder`
        ));
      await t.log(
        `[NESTED] Found ${j.length} child deferred instance(s) for placeholder "${c.name}"`
      );
      for (const v of j)
        $.add(v.placeholderFrameId);
      if ("children" in V && "insertChild" in V) {
        const v = V.children.indexOf(N);
        V.insertChild(v, E), N.remove();
      } else {
        const v = `Parent node does not support children operations for deferred instance "${c.name}"`;
        await t.error(v), g.push(v);
        continue;
      }
      const C = (v, h) => {
        const I = [];
        if (v.name === h && I.push(v), "children" in v)
          for (const A of v.children)
            I.push(...C(A, h));
        return I;
      };
      for (const v of j)
        try {
          const h = C(
            E,
            v.nodeData.name
          );
          if (h.length === 0) {
            await t.warning(
              `  Could not find matching child "${v.nodeData.name}" in resolved instance "${c.name}" - child may not exist in component`
            );
            continue;
          }
          if (h.length > 1) {
            const q = `Cannot resolve child deferred instance "${v.nodeData.name}": multiple children with same name in instance "${c.name}"`;
            await t.error(q), g.push(q), d++;
            continue;
          }
          const I = h[0], A = v.instanceEntry;
          let O = figma.root.children.find((q) => {
            const G = q.name === A.componentPageName, Z = a && q.name === `${a} ${A.componentPageName}`;
            return G || Z;
          });
          if (!O) {
            const q = ue(
              A.componentPageName
            );
            O = figma.root.children.find((G) => ue(G.name) === q);
          }
          if (!O) {
            await t.warning(
              `  Could not find referenced page for child deferred instance "${v.nodeData.name}"`
            );
            continue;
          }
          const K = (q, G, Z, Q, ee) => {
            if (G.length === 0) {
              let se = null;
              for (const re of q.children || [])
                if (re.type === "COMPONENT") {
                  const ce = ue(re.name), ye = ue(Z);
                  if (ce === ye)
                    if (se || (se = re), Q)
                      try {
                        const $e = re.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if ($e && JSON.parse($e).id === Q)
                          return re;
                      } catch ($e) {
                      }
                    else
                      return re;
                } else if (re.type === "COMPONENT_SET" && ee) {
                  const ce = ue(re.name), ye = ue(ee);
                  if (ce === ye) {
                    for (const $e of re.children)
                      if ($e.type === "COMPONENT") {
                        const xe = ue(
                          $e.name
                        ), Be = ue(Z);
                        if (xe === Be)
                          if (se || (se = $e), Q)
                            try {
                              const ke = $e.getPluginData(
                                "RecursicaPublishedMetadata"
                              );
                              if (ke && JSON.parse(ke).id === Q)
                                return $e;
                            } catch (ke) {
                            }
                          else
                            return $e;
                      }
                  }
                }
              return se;
            }
            let oe = q;
            for (const se of G) {
              const re = ue(se), ce = (oe.children || []).find(
                (ye) => ue(ye.name) === re
              );
              if (!ce) return null;
              oe = ce;
            }
            if (oe.type === "COMPONENT") {
              const se = ue(oe.name), re = ue(Z);
              if (se === re)
                if (Q)
                  try {
                    const ce = oe.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (ce && JSON.parse(ce).id === Q)
                      return oe;
                  } catch (ce) {
                    return null;
                  }
                else
                  return oe;
            } else if (oe.type === "COMPONENT_SET" && ee) {
              for (const se of oe.children)
                if (se.type === "COMPONENT") {
                  const re = ue(se.name), ce = ue(Z);
                  if (re === ce)
                    if (Q)
                      try {
                        const ye = se.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (ye && JSON.parse(ye).id === Q)
                          return se;
                      } catch (ye) {
                        continue;
                      }
                    else
                      return se;
                }
            }
            return null;
          };
          let ne = A.componentSetName;
          !ne && v.nodeData.name && (ne = v.nodeData.name, await t.log(
            `  [NESTED] componentSetName not provided, using child name "${ne}" as fallback`
          )), await t.log(
            `  [NESTED] Looking for component: page="${O.name}", componentSet="${ne}", component="${A.componentName}", path=[${(A.path || []).join(", ")}]`
          );
          const M = (q) => {
            const G = [];
            if (q.type === "COMPONENT_SET" && G.push(q), "children" in q && Array.isArray(q.children))
              for (const Z of q.children)
                G.push(...M(Z));
            return G;
          }, L = M(O);
          await t.log(
            `  [NESTED] Found ${L.length} component set(s) on page "${O.name}" (recursive search): ${L.map((q) => q.name).join(", ")}`
          );
          const z = O.children.map(
            (q) => `${q.type}:${q.name}`
          );
          await t.log(
            `  [NESTED] Direct children of page "${O.name}" (${z.length}): ${z.slice(0, 10).join(", ")}${z.length > 10 ? "..." : ""}`
          );
          const J = K(
            O,
            A.path || [],
            A.componentName,
            A.componentGuid,
            ne
          );
          if (!J) {
            if (await t.warning(
              `  Could not find component "${A.componentName}" (componentSet: "${ne}") for child deferred instance "${v.nodeData.name}" on page "${O.name}"`
            ), ne) {
              const q = ue(ne), G = L.filter((Z) => ue(Z.name) === q);
              if (G.length > 0) {
                await t.log(
                  `  [NESTED] Found ${G.length} component set(s) with matching clean name "${q}": ${G.map((Z) => Z.name).join(", ")}`
                );
                for (const Z of G) {
                  const Q = Z.children.filter(
                    (ee) => ee.type === "COMPONENT"
                  );
                  await t.log(
                    `  [NESTED] Component set "${Z.name}" has ${Q.length} variant(s): ${Q.map((ee) => ee.name).join(", ")}`
                  );
                }
              }
            }
            continue;
          }
          const D = J.createInstance();
          D.name = v.nodeData.name || I.name, D.x = I.x, D.y = I.y, I.width !== void 0 && I.height !== void 0 && D.resize(I.width, I.height), await Ot(
            D,
            v.nodeData,
            n
          ), await Vt(
            D,
            v.nodeData
          );
          const W = I.parent;
          if (!W || !("children" in W)) {
            const q = `Cannot replace child "${v.nodeData.name}": parent does not support children`;
            await t.error(q), g.push(q), d++;
            continue;
          }
          const te = W.children.indexOf(I);
          W.insertChild(te, D), I.remove(), await t.log(
            `  ✓ Resolved nested child deferred instance "${v.nodeData.name}" in "${c.name}"`
          );
        } catch (h) {
          await t.warning(
            `  Error resolving child deferred instance "${v.nodeData.name}": ${h instanceof Error ? h.message : String(h)}`
          );
        }
      await t.log(
        `  ✓ Resolved deferred instance "${c.name}" from component "${y.componentName}" on page "${y.componentPageName}"`
      ), o++;
    } catch (r) {
      const y = r instanceof Error ? r.message : String(r), c = `Failed to resolve deferred instance "${p.nodeData.name}": ${y}`;
      await t.error(c), g.push(c), d++;
    }
  }
  return await t.log(
    `=== Deferred Resolution Complete: ${o} resolved, ${d} failed ===`
  ), { resolved: o, failed: d, errors: g };
}
async function Kt(e) {
  await t.log("=== Cleaning up created entities ===");
  try {
    const { pageIds: a, collectionIds: n, variableIds: i } = e;
    let l = 0;
    for (const d of i)
      try {
        const g = await figma.variables.getVariableByIdAsync(d);
        if (g) {
          const w = g.variableCollectionId;
          n.includes(w) || (g.remove(), l++);
        }
      } catch (g) {
        await t.warning(
          `Could not delete variable ${d.substring(0, 8)}...: ${g}`
        );
      }
    let s = 0;
    for (const d of n)
      try {
        const g = await figma.variables.getVariableCollectionByIdAsync(d);
        g && (g.remove(), s++);
      } catch (g) {
        await t.warning(
          `Could not delete collection ${d.substring(0, 8)}...: ${g}`
        );
      }
    await figma.loadAllPagesAsync();
    let o = 0;
    for (const d of a)
      try {
        const g = await figma.getNodeByIdAsync(d);
        g && g.type === "PAGE" && (g.remove(), o++);
      } catch (g) {
        await t.warning(
          `Could not delete page ${d.substring(0, 8)}...: ${g}`
        );
      }
    return await t.log(
      `Cleanup complete: Deleted ${o} page(s), ${s} collection(s), ${l} variable(s)`
    ), {
      type: "cleanupCreatedEntities",
      success: !0,
      error: !1,
      message: "Cleanup completed successfully",
      data: {
        deletedPages: o,
        deletedCollections: s,
        deletedVariables: l
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
const on = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cleanupCreatedEntities: Kt,
  importPage: Nt,
  loadAndExpandJson: ft,
  loadCollectionTable: Jt,
  loadVariableTable: Ht,
  matchAndCreateVariables: Wt,
  normalizeStructureTypes: mt,
  recreateNodeFromData: De,
  resolveDeferredNormalInstances: Et,
  restoreBoundVariablesForFills: jt
}, Symbol.toStringTag, { value: "Module" }));
async function qt(e) {
  const a = [];
  for (const { fileName: n, jsonData: i } of e)
    try {
      const l = ft(i);
      if (!l.success || !l.expandedJsonData) {
        await t.warning(
          `Skipping ${n} - failed to expand JSON: ${l.error || "Unknown error"}`
        );
        continue;
      }
      const s = l.expandedJsonData, o = s.metadata;
      if (!o || !o.name || !o.guid) {
        await t.warning(
          `Skipping ${n} - missing or invalid metadata`
        );
        continue;
      }
      const d = [];
      if (s.instances) {
        const w = at.fromTable(
          s.instances
        ).getSerializedTable();
        for (const u of Object.values(w))
          u.instanceType === "normal" && u.componentPageName && (d.includes(u.componentPageName) || d.push(u.componentPageName));
      }
      a.push({
        fileName: n,
        pageName: o.name,
        pageGuid: o.guid,
        dependencies: d,
        jsonData: i
        // Store original JSON data for import
      }), await t.log(
        `  ${n}: "${o.name}" depends on: ${d.length > 0 ? d.join(", ") : "none"}`
      );
    } catch (l) {
      await t.error(
        `Error processing ${n}: ${l instanceof Error ? l.message : String(l)}`
      );
    }
  return a;
}
function Xt(e) {
  const a = [], n = [], i = [], l = /* @__PURE__ */ new Map();
  for (const w of e)
    l.set(w.pageName, w);
  const s = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), d = [], g = (w) => {
    if (s.has(w.pageName))
      return !1;
    if (o.has(w.pageName)) {
      const u = d.findIndex(
        ($) => $.pageName === w.pageName
      );
      if (u !== -1) {
        const $ = d.slice(u).concat([w]);
        return n.push($), !0;
      }
      return !1;
    }
    o.add(w.pageName), d.push(w);
    for (const u of w.dependencies) {
      const $ = l.get(u);
      $ && g($);
    }
    return o.delete(w.pageName), d.pop(), s.add(w.pageName), a.push(w), !1;
  };
  for (const w of e)
    s.has(w.pageName) || g(w);
  for (const w of e)
    for (const u of w.dependencies)
      l.has(u) || i.push(
        `Page "${w.pageName}" (${w.fileName}) depends on "${u}" which is not in the import set`
      );
  return { order: a, cycles: n, errors: i };
}
async function Yt(e) {
  await t.log("=== Building Dependency Graph ===");
  const a = await qt(e);
  await t.log("=== Resolving Import Order ===");
  const n = Xt(a);
  if (n.cycles.length > 0) {
    await t.log(
      `Detected ${n.cycles.length} circular dependency cycle(s):`
    );
    for (const i of n.cycles) {
      const l = i.map((s) => `"${s.pageName}"`).join(" → ");
      await t.log(`  Cycle: ${l} → (back to start)`);
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
    const l = n.order[i];
    await t.log(`  ${i + 1}. ${l.fileName} ("${l.pageName}")`);
  }
  return n;
}
async function Zt(e) {
  var V, R, ae, P, E, k;
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
    errors: l
  } = await Yt(a);
  l.length > 0 && await t.warning(
    `Found ${l.length} dependency warning(s) - some dependencies may be missing`
  ), i.length > 0 && await t.log(
    `Detected ${i.length} circular dependency cycle(s) - will use deferred resolution`
  );
  const s = /* @__PURE__ */ new Map();
  if (await t.log(
    `Checking collectionChoices: ${e.collectionChoices ? "exists" : "undefined"}`
  ), e.collectionChoices) {
    await t.log("=== Pre-creating Collections ==="), await t.log(
      `Collection choices: tokens=${e.collectionChoices.tokens}, theme=${e.collectionChoices.theme}, layers=${e.collectionChoices.layers}`
    );
    const j = "recursica:collectionId", C = async (h) => {
      const I = await figma.variables.getLocalVariableCollectionsAsync(), A = new Set(I.map((ne) => ne.name));
      if (!A.has(h))
        return h;
      let O = 1, K = `${h}_${O}`;
      for (; A.has(K); )
        O++, K = `${h}_${O}`;
      return K;
    }, v = [
      { choice: e.collectionChoices.tokens, normalizedName: "Tokens" },
      { choice: e.collectionChoices.theme, normalizedName: "Theme" },
      { choice: e.collectionChoices.layers, normalizedName: "Layer" }
    ];
    for (const { choice: h, normalizedName: I } of v)
      if (h === "new") {
        await t.log(
          `Processing collection type: "${I}" (choice: "new") - will create new collection`
        );
        const A = await C(I), O = figma.variables.createVariableCollection(A);
        if (Ue(I)) {
          const K = lt(I);
          K && (O.setSharedPluginData(
            "recursica",
            j,
            K
          ), await t.log(
            `  Stored fixed GUID: ${K.substring(0, 8)}...`
          ));
        }
        s.set(I, O), await t.log(
          `✓ Pre-created collection: "${A}" (normalized: "${I}", id: ${O.id.substring(0, 8)}...)`
        );
      } else
        await t.log(
          `Skipping collection type: "${I}" (choice: "existing")`
        );
    s.size > 0 && await t.log(
      `Pre-created ${s.size} collection(s) for reuse across all imports`
    );
  }
  await t.log("=== Importing Pages in Order ===");
  let o = 0, d = 0;
  const g = [...l], w = [], u = {
    pageIds: [],
    collectionIds: [],
    variableIds: []
  }, $ = [];
  if (s.size > 0)
    for (const j of s.values())
      u.collectionIds.push(j.id), await t.log(
        `Tracking pre-created collection: "${j.name}" (${j.id.substring(0, 8)}...)`
      );
  const b = e.mainFileName;
  for (let j = 0; j < n.length; j++) {
    const C = n[j], v = b ? C.fileName === b : j === n.length - 1;
    await t.log(
      `[${j + 1}/${n.length}] Importing ${C.fileName} ("${C.pageName}")${v ? " [MAIN]" : " [DEPENDENCY]"}...`
    );
    try {
      const h = j === 0, I = await Nt({
        jsonData: C.jsonData,
        isMainPage: v,
        clearConsole: h,
        collectionChoices: e.collectionChoices,
        alwaysCreateCopy: !0,
        // Wizard imports always create copies (no prompts)
        skipUniqueNaming: (V = e.skipUniqueNaming) != null ? V : !1,
        constructionIcon: e.constructionIcon || "",
        preCreatedCollections: s
        // Pass pre-created collections for reuse
      });
      if (I.success) {
        if (o++, (R = I.data) != null && R.deferredInstances) {
          const A = I.data.deferredInstances;
          Array.isArray(A) && (await t.log(
            `  [DEBUG] Collected ${A.length} deferred instance(s) from ${C.fileName}`
          ), w.push(...A));
        } else
          await t.log(
            `  [DEBUG] No deferred instances in response for ${C.fileName}`
          );
        if ((ae = I.data) != null && ae.createdEntities) {
          const A = I.data.createdEntities;
          A.pageIds && u.pageIds.push(...A.pageIds), A.collectionIds && u.collectionIds.push(...A.collectionIds), A.variableIds && u.variableIds.push(...A.variableIds);
          const O = ((P = A.pageIds) == null ? void 0 : P[0]) || ((E = I.data) == null ? void 0 : E.pageId);
          (k = I.data) != null && k.pageName && O && $.push({
            name: I.data.pageName,
            pageId: O
          });
        }
      } else
        d++, g.push(
          `Failed to import ${C.fileName}: ${I.message || "Unknown error"}`
        );
    } catch (h) {
      d++;
      const I = h instanceof Error ? h.message : String(h);
      g.push(`Failed to import ${C.fileName}: ${I}`);
    }
  }
  let p = 0;
  if (w.length > 0) {
    await t.log(
      `=== Resolving ${w.length} Deferred Instance(s) ===`
    );
    try {
      await t.log(
        "  Rebuilding variable and collection tables from imported JSON files..."
      );
      const {
        loadAndExpandJson: j,
        loadCollectionTable: C,
        loadVariableTable: v,
        matchAndCreateVariables: h
      } = await Promise.resolve().then(() => on), I = [], A = [];
      for (const z of n)
        try {
          const J = j(z.jsonData);
          if (J.success && J.expandedJsonData) {
            const D = J.expandedJsonData, W = C(D);
            W.success && W.collectionTable && A.push(W.collectionTable);
            const te = v(D);
            te.success && te.variableTable && I.push(te.variableTable);
          }
        } catch (J) {
          await t.warning(
            `  Could not load tables from ${z.fileName}: ${J}`
          );
        }
      let O = null, K = null;
      I.length > 0 && (O = I[I.length - 1], await t.log(
        `  Using variable table with ${O.getSize()} variable(s)`
      )), A.length > 0 && (K = A[A.length - 1], await t.log(
        `  Using collection table with ${K.getSize()} collection(s)`
      ));
      const ne = /* @__PURE__ */ new Map();
      if (K) {
        const z = await figma.variables.getLocalVariableCollectionsAsync(), J = /* @__PURE__ */ new Map();
        for (const W of z) {
          const te = Se(W.name);
          J.set(te, W);
        }
        const D = K.getTable();
        for (const [W, te] of Object.entries(
          D
        )) {
          const q = te, G = Se(
            q.collectionName
          ), Z = J.get(G);
          Z ? (ne.set(W, Z), await t.log(
            `  Matched collection table index ${W} ("${q.collectionName}") to collection "${Z.name}"`
          )) : await t.warning(
            `  Could not find collection for table index ${W} ("${q.collectionName}")`
          );
        }
      }
      let M = /* @__PURE__ */ new Map();
      if (O && K) {
        const { recognizedVariables: z } = await h(
          O,
          K,
          ne,
          []
          // newlyCreatedCollections - empty since they're already created
        );
        M = z, await t.log(
          `  Built recognizedVariables map with ${M.size} variable(s)`
        );
      } else
        await t.warning(
          "  Could not build recognizedVariables map - variable or collection table missing"
        );
      const L = await Et(
        w,
        e.constructionIcon || "",
        M,
        O || null,
        K || null,
        ne
      );
      await t.log(
        `  Resolved: ${L.resolved}, Failed: ${L.failed}`
      ), L.errors.length > 0 && (g.push(...L.errors), p = L.failed);
    } catch (j) {
      const C = `Failed to resolve deferred instances: ${j instanceof Error ? j.message : String(j)}`;
      g.push(C), p = w.length;
    }
  }
  const r = Array.from(
    new Set(u.collectionIds)
  ), y = Array.from(
    new Set(u.variableIds)
  ), c = Array.from(new Set(u.pageIds));
  if (await t.log("=== Import Summary ==="), await t.log(
    `  Imported: ${o}, Failed: ${d}, Deferred instances: ${w.length}, Deferred resolution failed: ${p}`
  ), await t.log(
    `  Collections in allCreatedEntityIds: ${u.collectionIds.length}, Unique: ${r.length}`
  ), r.length > 0) {
    await t.log(
      `  Created ${r.length} collection(s)`
    );
    for (const j of r)
      try {
        const C = await figma.variables.getVariableCollectionByIdAsync(j);
        C && await t.log(
          `    - "${C.name}" (${j.substring(0, 8)}...)`
        );
      } catch (C) {
      }
  }
  const T = d === 0 && p === 0, N = T ? `Successfully imported ${o} page(s)${w.length > 0 ? ` (${w.length} deferred instance(s) resolved)` : ""}` : `Import completed with ${d} failure(s). ${g.join("; ")}`;
  return {
    type: "importPagesInOrder",
    success: T,
    error: !T,
    message: N,
    data: {
      imported: o,
      failed: d,
      deferred: w.length,
      errors: g,
      importedPages: $,
      createdEntities: {
        pageIds: c,
        collectionIds: r,
        variableIds: y
      }
    }
  };
}
async function rn(e) {
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
    const l = await gt(
      i,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + i.name + " (index: " + n + ")"
    );
    const s = JSON.stringify(l, null, 2), o = JSON.parse(s), d = "Copy - " + o.name, g = figma.createPage();
    if (g.name = d, figma.root.appendChild(g), o.children && o.children.length > 0) {
      let $ = function(p) {
        p.forEach((r) => {
          const y = (r.x || 0) + (r.width || 0);
          y > b && (b = y), r.children && r.children.length > 0 && $(r.children);
        });
      };
      console.log(
        "Recreating " + o.children.length + " top-level children..."
      );
      let b = 0;
      $(o.children), console.log("Original content rightmost edge: " + b);
      for (const p of o.children)
        await De(p, g, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const w = dt(o);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: o.name,
        newPageName: d,
        totalNodes: w
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
async function sn(e) {
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
async function ln(e) {
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
async function cn(e) {
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
async function dn(e) {
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
async function gn(e) {
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
async function fn(e) {
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
async function mn(e) {
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
function Ne(e, a = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: a
  };
}
function Te(e, a, n = {}) {
  const i = a instanceof Error ? a.message : a;
  return {
    type: e,
    success: !1,
    error: !0,
    message: i,
    data: n
  };
}
const Qt = "RecursicaPublishedMetadata";
async function pn(e) {
  try {
    const a = figma.currentPage;
    await figma.loadAllPagesAsync();
    const i = figma.root.children.findIndex(
      (d) => d.id === a.id
    ), l = a.getPluginData(Qt);
    if (!l) {
      const w = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: st(a.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: i
      };
      return Ne("getComponentMetadata", w);
    }
    const o = {
      componentMetadata: JSON.parse(l),
      currentPageIndex: i
    };
    return Ne("getComponentMetadata", o);
  } catch (a) {
    return console.error("Error getting component metadata:", a), Te(
      "getComponentMetadata",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function un(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children, n = [];
    for (const l of a) {
      if (l.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${l.name} (type: ${l.type})`
        );
        continue;
      }
      const s = l, o = s.getPluginData(Qt);
      if (o)
        try {
          const d = JSON.parse(o);
          n.push(d);
        } catch (d) {
          console.warn(
            `Failed to parse metadata for page "${s.name}":`,
            d
          );
          const w = {
            _ver: 1,
            id: "",
            name: st(s.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          n.push(w);
        }
      else {
        const g = {
          _ver: 1,
          id: "",
          name: st(s.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        n.push(g);
      }
    }
    return Ne("getAllComponents", {
      components: n
    });
  } catch (a) {
    return console.error("Error getting all components:", a), Te(
      "getAllComponents",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function hn(e) {
  try {
    const a = e.requestId, n = e.action;
    return !a || !n ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (Ye.handleResponse({ requestId: a, action: n }), {
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
async function yn(e) {
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
const Ie = "RecursicaPrimaryImport", be = "RecursicaUnderReview", ea = "---", ta = "---", Pe = "RecursicaImportDivider", Ke = "start", qe = "end", Re = "⚠️";
async function wn(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children;
    for (const i of a) {
      if (i.type !== "PAGE")
        continue;
      const l = i.getPluginData(Ie);
      if (l)
        try {
          const o = JSON.parse(l), d = {
            exists: !0,
            pageId: i.id,
            metadata: o
          };
          return Ne(
            "checkForExistingPrimaryImport",
            d
          );
        } catch (o) {
          await t.warning(
            `Failed to parse primary import metadata on page "${i.name}": ${o}`
          );
          continue;
        }
      if (i.getPluginData(be) === "true") {
        const o = i.getPluginData(Ie);
        if (o)
          try {
            const d = JSON.parse(o), g = {
              exists: !0,
              pageId: i.id,
              metadata: d
            };
            return Ne(
              "checkForExistingPrimaryImport",
              g
            );
          } catch (d) {
          }
        else
          await t.warning(
            `Found page "${i.name}" marked as under review but missing primary import metadata`
          );
      }
    }
    return Ne("checkForExistingPrimaryImport", {
      exists: !1
    });
  } catch (a) {
    return console.error("Error checking for existing primary import:", a), Te(
      "checkForExistingPrimaryImport",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function bn(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children.find(
      (d) => d.type === "PAGE" && d.getPluginData(Pe) === Ke
    ), n = figma.root.children.find(
      (d) => d.type === "PAGE" && d.getPluginData(Pe) === qe
    );
    if (a && n) {
      const d = {
        startDividerId: a.id,
        endDividerId: n.id
      };
      return Ne("createImportDividers", d);
    }
    const i = figma.createPage();
    i.name = ea, i.setPluginData(Pe, Ke), i.setPluginData(be, "true");
    const l = figma.createPage();
    l.name = ta, l.setPluginData(Pe, qe), l.setPluginData(be, "true");
    const s = figma.root.children.indexOf(i);
    figma.root.insertChild(s + 1, l), await t.log("Created import dividers");
    const o = {
      startDividerId: i.id,
      endDividerId: l.id
    };
    return Ne("createImportDividers", o);
  } catch (a) {
    return console.error("Error creating import dividers:", a), Te(
      "createImportDividers",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function $n(e) {
  var a, n, i, l, s, o, d, g, w, u, $, b;
  try {
    await t.log("=== Starting Single Component Import ==="), await t.log("Creating start divider..."), await figma.loadAllPagesAsync();
    let p = figma.root.children.find(
      (M) => M.type === "PAGE" && M.getPluginData(Pe) === Ke
    );
    p || (p = figma.createPage(), p.name = ea, p.setPluginData(Pe, Ke), p.setPluginData(be, "true"), await t.log("Created start divider"));
    const y = [
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
      `Importing ${y.length} file(s) in dependency order...`
    );
    const c = await Zt({
      jsonFiles: y,
      mainFileName: `${e.mainComponent.name}.json`,
      collectionChoices: {
        tokens: e.wizardSelections.tokensCollection,
        theme: e.wizardSelections.themeCollection,
        layers: e.wizardSelections.layersCollection
      },
      skipUniqueNaming: !0,
      // Don't add _<number> suffix for wizard imports
      constructionIcon: Re
      // Add construction icon to page names
    });
    if (!c.success)
      throw new Error(
        c.message || "Failed to import pages in order"
      );
    await figma.loadAllPagesAsync();
    const T = figma.root.children;
    let N = T.find(
      (M) => M.type === "PAGE" && M.getPluginData(Pe) === qe
    );
    if (!N) {
      N = figma.createPage(), N.name = ta, N.setPluginData(
        Pe,
        qe
      ), N.setPluginData(be, "true");
      let M = T.length;
      for (let L = T.length - 1; L >= 0; L--) {
        const z = T[L];
        if (z.type === "PAGE" && z.getPluginData(Pe) !== Ke && z.getPluginData(Pe) !== qe) {
          M = L + 1;
          break;
        }
      }
      figma.root.insertChild(M, N), await t.log("Created end divider");
    }
    await t.log(
      `Import result data structure: ${JSON.stringify(Object.keys(c.data || {}))}`
    );
    const V = c.data;
    if (await t.log(
      `Import result has createdEntities: ${!!(V != null && V.createdEntities)}`
    ), V != null && V.createdEntities ? (await t.log(
      `  Collection IDs: ${((a = V.createdEntities.collectionIds) == null ? void 0 : a.length) || 0}`
    ), (n = V.createdEntities.collectionIds) != null && n.length && await t.log(
      `  Collection IDs: ${V.createdEntities.collectionIds.map((M) => M.substring(0, 8) + "...").join(", ")}`
    ), await t.log(
      `  Variable IDs: ${((i = V.createdEntities.variableIds) == null ? void 0 : i.length) || 0}`
    ), await t.log(
      `  Page IDs: ${((l = V.createdEntities.pageIds) == null ? void 0 : l.length) || 0}`
    )) : await t.warning(
      "Import result does not have createdEntities - cleanup may not work correctly"
    ), !(V != null && V.importedPages) || V.importedPages.length === 0)
      throw new Error("No pages were imported");
    const R = "RecursicaPublishedMetadata", ae = e.mainComponent.guid;
    await t.log(
      `Looking for main page by GUID: ${ae.substring(0, 8)}...`
    );
    let P, E = null;
    for (const M of V.importedPages)
      try {
        const L = await figma.getNodeByIdAsync(
          M.pageId
        );
        if (L && L.type === "PAGE") {
          const z = L.getPluginData(R);
          if (z)
            try {
              if (JSON.parse(z).id === ae) {
                P = M.pageId, E = L, await t.log(
                  `Found main page by GUID: "${L.name}" (ID: ${M.pageId.substring(0, 12)}...)`
                );
                break;
              }
            } catch (J) {
            }
        }
      } catch (L) {
        await t.warning(
          `Error checking page ${M.pageId}: ${L}`
        );
      }
    if (!P) {
      await t.log(
        "Main page not found in importedPages list, searching all pages by GUID..."
      ), await figma.loadAllPagesAsync();
      const M = figma.root.children;
      for (const L of M)
        if (L.type === "PAGE") {
          const z = L.getPluginData(R);
          if (z)
            try {
              if (JSON.parse(z).id === ae) {
                P = L.id, E = L, await t.log(
                  `Found main page by GUID in all pages: "${L.name}" (ID: ${L.id.substring(0, 12)}...)`
                );
                break;
              }
            } catch (J) {
            }
        }
    }
    if (!P || !E) {
      await t.error(
        `Failed to find imported main page by GUID: ${ae.substring(0, 8)}...`
      ), await t.log("Imported pages were:");
      for (const M of V.importedPages)
        await t.log(
          `  - "${M.name}" (ID: ${M.pageId.substring(0, 12)}...)`
        );
      throw new Error("Failed to find imported main page ID");
    }
    if (!E || E.type !== "PAGE")
      throw new Error("Failed to get main page node");
    for (const M of V.importedPages)
      try {
        const L = await figma.getNodeByIdAsync(
          M.pageId
        );
        if (L && L.type === "PAGE") {
          L.setPluginData(be, "true");
          const z = L.name.replace(/_\d+$/, "");
          if (!z.startsWith(Re))
            L.name = `${Re} ${z}`;
          else {
            const J = z.replace(Re, "").trim();
            L.name = `${Re} ${J}`;
          }
        }
      } catch (L) {
        await t.warning(
          `Failed to mark page ${M.pageId} as under review: ${L}`
        );
      }
    await figma.loadAllPagesAsync();
    const k = figma.root.children, j = k.find(
      (M) => M.type === "PAGE" && (M.name === "REMOTES" || M.name === `${Re} REMOTES`)
    );
    j && (j.setPluginData(be, "true"), j.name.startsWith(Re) || (j.name = `${Re} REMOTES`), await t.log(
      "Marked REMOTES page as under review and ensured construction icon"
    ));
    const C = k.find(
      (M) => M.type === "PAGE" && M.getPluginData(Pe) === Ke
    ), v = k.find(
      (M) => M.type === "PAGE" && M.getPluginData(Pe) === qe
    );
    if (C && v) {
      const M = k.indexOf(C), L = k.indexOf(v);
      for (let z = M + 1; z < L; z++) {
        const J = k[z];
        J.type === "PAGE" && J.getPluginData(be) !== "true" && (J.setPluginData(be, "true"), await t.log(
          `Marked page "${J.name}" as under review (found between dividers)`
        ));
      }
    }
    const h = [], I = [];
    if (await t.log(
      `[EXTRACTION] Starting collection extraction. Collection IDs in result: ${((o = (s = V == null ? void 0 : V.createdEntities) == null ? void 0 : s.collectionIds) == null ? void 0 : o.length) || 0}`
    ), (d = V == null ? void 0 : V.createdEntities) != null && d.collectionIds) {
      await t.log(
        `[EXTRACTION] Collection IDs to process: ${V.createdEntities.collectionIds.map((M) => M.substring(0, 8) + "...").join(", ")}`
      );
      for (const M of V.createdEntities.collectionIds)
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
    ), (g = V == null ? void 0 : V.createdEntities) != null && g.variableIds) {
      await t.log(
        `[EXTRACTION] Processing ${V.createdEntities.variableIds.length} variable ID(s)...`
      );
      for (const M of V.createdEntities.variableIds)
        try {
          const L = await figma.variables.getVariableByIdAsync(M);
          if (L && L.resolvedType) {
            const z = await figma.variables.getVariableCollectionByIdAsync(
              L.variableCollectionId
            );
            z ? I.push({
              variableId: L.id,
              variableName: L.name,
              collectionId: L.variableCollectionId,
              collectionName: z.name
            }) : I.push({
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
        `[EXTRACTION] Total variables extracted: ${I.length}`
      );
    } else
      await t.warning(
        "[EXTRACTION] No variableIds found in importResultData.createdEntities"
      );
    if (h.length === 0 && ((u = (w = V == null ? void 0 : V.createdEntities) == null ? void 0 : w.collectionIds) != null && u.length)) {
      await t.warning(
        "[EXTRACTION] Collection extraction failed, but IDs are available - creating fallback entries"
      );
      for (const M of V.createdEntities.collectionIds)
        h.push({
          collectionId: M,
          collectionName: `Unknown (${M.substring(0, 8)}...)`
        });
    }
    if (I.length === 0 && ((b = ($ = V == null ? void 0 : V.createdEntities) == null ? void 0 : $.variableIds) != null && b.length)) {
      await t.warning(
        "[EXTRACTION] Variable extraction failed, but IDs are available - creating fallback entries"
      );
      for (const M of V.createdEntities.variableIds)
        I.push({
          variableId: M,
          variableName: `Unknown (${M.substring(0, 8)}...)`,
          collectionId: "unknown",
          collectionName: "Unknown"
        });
    }
    const A = {
      componentGuid: e.mainComponent.guid,
      componentVersion: e.mainComponent.version,
      componentName: e.mainComponent.name,
      importDate: (/* @__PURE__ */ new Date()).toISOString(),
      wizardSelections: e.wizardSelections,
      variableSummary: e.variableSummary,
      createdCollections: h,
      createdVariables: I,
      importError: void 0
      // No error yet
    };
    await t.log(
      `Storing metadata with ${h.length} collection(s) and ${I.length} variable(s)`
    ), E.setPluginData(
      Ie,
      JSON.stringify(A)
    ), E.setPluginData(be, "true"), await t.log(
      "Stored primary import metadata on main page and marked as under review"
    );
    const O = [];
    V.importedPages && O.push(
      ...V.importedPages.map((M) => M.pageId)
    ), await t.log("=== Single Component Import Complete ==="), A.importError = void 0, await t.log(
      `[METADATA] About to store metadata with ${h.length} collection(s) and ${I.length} variable(s)`
    ), h.length > 0 && await t.log(
      `[METADATA] Collections to store: ${h.map((M) => `"${M.collectionName}" (${M.collectionId.substring(0, 8)}...)`).join(", ")}`
    ), E.setPluginData(
      Ie,
      JSON.stringify(A)
    ), await t.log(
      `[METADATA] Stored metadata: ${h.length} collection(s), ${I.length} variable(s)`
    );
    const K = E.getPluginData(Ie);
    if (K)
      try {
        const M = JSON.parse(K);
        await t.log(
          `[METADATA] Verification: Stored metadata has ${M.createdCollections.length} collection(s) and ${M.createdVariables.length} variable(s)`
        );
      } catch (M) {
        await t.warning(
          "[METADATA] Failed to verify stored metadata"
        );
      }
    const ne = {
      success: !0,
      mainPageId: E.id,
      importedPageIds: O,
      createdCollections: h,
      createdVariables: I
    };
    return Ne("importSingleComponentWithWizard", ne);
  } catch (p) {
    const r = p instanceof Error ? p.message : "Unknown error occurred";
    await t.error(`Import failed: ${r}`);
    try {
      await figma.loadAllPagesAsync();
      const y = figma.root.children;
      let c = null;
      for (const T of y) {
        if (T.type !== "PAGE") continue;
        const N = T.getPluginData(Ie);
        if (N)
          try {
            if (JSON.parse(N).componentGuid === e.mainComponent.guid) {
              c = T;
              break;
            }
          } catch (V) {
          }
      }
      if (c) {
        const T = c.getPluginData(Ie);
        if (T)
          try {
            const N = JSON.parse(T);
            await t.log(
              `[CATCH] Found existing metadata with ${N.createdCollections.length} collection(s) and ${N.createdVariables.length} variable(s)`
            ), N.importError = r, c.setPluginData(
              Ie,
              JSON.stringify(N)
            ), await t.log(
              `[CATCH] Updated existing metadata with error. Collections: ${N.createdCollections.length}, Variables: ${N.createdVariables.length}`
            );
          } catch (N) {
            await t.warning(
              `[CATCH] Failed to update metadata: ${N}`
            );
          }
      } else {
        await t.log(
          "No existing metadata found, attempting to collect created entities for cleanup..."
        );
        const T = [];
        for (const R of y) {
          if (R.type !== "PAGE") continue;
          R.getPluginData(be) === "true" && T.push(R);
        }
        const N = [];
        if (e.wizardSelections) {
          const R = await figma.variables.getLocalVariableCollectionsAsync(), ae = [
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
          for (const { choice: P, normalizedName: E } of ae)
            if (P === "new") {
              const k = R.filter((j) => Se(j.name) === E);
              if (k.length > 0) {
                const j = k[0];
                N.push({
                  collectionId: j.id,
                  collectionName: j.name
                }), await t.log(
                  `Found created collection: "${j.name}" (${j.id.substring(0, 8)}...)`
                );
              }
            }
        }
        const V = [];
        if (T.length > 0) {
          const R = T[0], ae = {
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
            createdCollections: N,
            createdVariables: V,
            importError: r
          };
          R.setPluginData(
            Ie,
            JSON.stringify(ae)
          ), await t.log(
            `Created fallback metadata with ${N.length} collection(s) and error information`
          );
        }
      }
    } catch (y) {
      await t.warning(
        `Failed to store error metadata: ${y instanceof Error ? y.message : String(y)}`
      );
    }
    return Te(
      "importSingleComponentWithWizard",
      p instanceof Error ? p : new Error(String(p))
    );
  }
}
async function aa(e) {
  try {
    await t.log("=== Starting Import Group Deletion ==="), await figma.loadAllPagesAsync();
    const a = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!a || a.type !== "PAGE")
      throw new Error("Main page not found");
    const n = a.getPluginData(Ie);
    if (!n)
      throw new Error("Primary import metadata not found on page");
    const i = JSON.parse(n);
    await t.log(
      `Found metadata: ${i.createdCollections.length} collection(s), ${i.createdVariables.length} variable(s) to delete`
    ), await figma.loadAllPagesAsync();
    const l = figma.root.children, s = [];
    for (const b of l) {
      if (b.type !== "PAGE")
        continue;
      b.getPluginData(be) === "true" && (s.push(b), await t.log(
        `Found page to delete: "${b.name}" (under review)`
      ));
    }
    await t.log(
      `Deleting ${i.createdVariables.length} variable(s) from existing collections...`
    );
    let o = 0;
    for (const b of i.createdVariables)
      try {
        const p = await figma.variables.getVariableByIdAsync(
          b.variableId
        );
        p ? (p.remove(), o++, await t.log(
          `Deleted variable: ${b.variableName} from collection ${b.collectionName}`
        )) : await t.warning(
          `Variable ${b.variableName} (${b.variableId}) not found - may have already been deleted`
        );
      } catch (p) {
        await t.warning(
          `Failed to delete variable ${b.variableName}: ${p instanceof Error ? p.message : String(p)}`
        );
      }
    await t.log(
      `Deleting ${i.createdCollections.length} collection(s)...`
    );
    let d = 0;
    for (const b of i.createdCollections)
      try {
        const p = await figma.variables.getVariableCollectionByIdAsync(
          b.collectionId
        );
        p ? (p.remove(), d++, await t.log(
          `Deleted collection: ${b.collectionName} (${b.collectionId})`
        )) : await t.warning(
          `Collection ${b.collectionName} (${b.collectionId}) not found - may have already been deleted`
        );
      } catch (p) {
        await t.warning(
          `Failed to delete collection ${b.collectionName}: ${p instanceof Error ? p.message : String(p)}`
        );
      }
    const g = s.map((b) => ({
      page: b,
      name: b.name,
      id: b.id
    })), w = figma.currentPage;
    if (g.some(
      (b) => b.id === w.id
    )) {
      await figma.loadAllPagesAsync();
      const p = figma.root.children.find(
        (r) => r.type === "PAGE" && !g.some((y) => y.id === r.id)
      );
      p ? (await figma.setCurrentPageAsync(p), await t.log(
        `Switched away from page "${w.name}" before deletion`
      )) : await t.warning(
        "No safe page to switch to - all pages are being deleted"
      );
    }
    for (const { page: b, name: p } of g)
      try {
        let r = !1;
        try {
          await figma.loadAllPagesAsync(), r = figma.root.children.some((c) => c.id === b.id);
        } catch (y) {
          r = !1;
        }
        if (!r) {
          await t.log(`Page "${p}" already deleted, skipping`);
          continue;
        }
        if (figma.currentPage.id === b.id) {
          await figma.loadAllPagesAsync();
          const c = figma.root.children.find(
            (T) => T.type === "PAGE" && T.id !== b.id && !g.some((N) => N.id === T.id)
          );
          c && await figma.setCurrentPageAsync(c);
        }
        b.remove(), await t.log(`Deleted page: "${p}"`);
      } catch (r) {
        await t.warning(
          `Failed to delete page "${p}": ${r instanceof Error ? r.message : String(r)}`
        );
      }
    await t.log("=== Import Group Deletion Complete ===");
    const $ = {
      success: !0,
      deletedPages: s.length,
      deletedCollections: d,
      deletedVariables: o
    };
    return Ne("deleteImportGroup", $);
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Delete failed: ${n}`), Te(
      "deleteImportGroup",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function vn(e) {
  try {
    await t.log("=== Cleaning up failed import ==="), await figma.loadAllPagesAsync();
    const a = figma.root.children, n = "RecursicaPublishedMetadata", i = "RecursicaCreatedEntities";
    let l = !1;
    for (const r of a) {
      if (r.type !== "PAGE")
        continue;
      if (r.getPluginData(i)) {
        l = !0;
        break;
      }
    }
    if (l)
      await t.log(
        "Found pages with RecursicaCreatedEntities, using new cleanup logic"
      );
    else {
      let r = null;
      for (const y of a) {
        if (y.type !== "PAGE")
          continue;
        if (y.getPluginData(Ie)) {
          r = y;
          break;
        }
      }
      if (r)
        return await t.log(
          "Found page with PRIMARY_IMPORT_KEY (old system), using deleteImportGroup"
        ), await aa({ pageId: r.id });
      await t.log(
        "No primary metadata found, looking for pages with UNDER_REVIEW_KEY or PAGE_METADATA_KEY"
      );
    }
    const s = [], o = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set();
    await t.log(
      `Scanning ${a.length} page(s) for created entities...`
    );
    for (const r of a) {
      if (r.type !== "PAGE")
        continue;
      const y = r.getPluginData(i);
      if (y)
        try {
          const c = JSON.parse(y);
          if (c.collectionIds) {
            for (const T of c.collectionIds)
              o.add(T);
            await t.log(
              `  Found ${c.collectionIds.length} collection ID(s) on page "${r.name}"`
            );
          }
          if (c.variableIds) {
            for (const T of c.variableIds)
              d.add(T);
            await t.log(
              `  Found ${c.variableIds.length} variable ID(s) on page "${r.name}"`
            );
          }
        } catch (c) {
          await t.warning(
            `  Failed to parse created entities from page "${r.name}": ${c}`
          );
        }
    }
    await t.log(
      `Scanning ${a.length} page(s) for pages to delete...`
    );
    for (const r of a) {
      if (r.type !== "PAGE")
        continue;
      const y = r.getPluginData(be), c = r.getPluginData(n), T = r.getPluginData(i);
      if (await t.log(
        `  Checking page "${r.name}": underReview=${y === "true"}, hasMetadata=${!!c}, hasCreatedEntities=${!!T}`
      ), y === "true" || c)
        if (s.push({ id: r.id, name: r.name }), await t.log(
          `Found page to delete: "${r.name}" (underReview: ${y === "true"}, hasMetadata: ${!!c})`
        ), T)
          try {
            const N = JSON.parse(T);
            if (N.pageIds) {
              for (const V of N.pageIds)
                if (!s.some((R) => R.id === V)) {
                  const R = await figma.getNodeByIdAsync(
                    V
                  );
                  if (R && R.type === "PAGE") {
                    s.push({
                      id: R.id,
                      name: R.name
                    }), await t.log(
                      `  Added additional page from createdEntities.pageIds: "${R.name}"`
                    );
                    const ae = R.getPluginData(i);
                    if (ae)
                      try {
                        const P = JSON.parse(
                          ae
                        );
                        if (P.collectionIds) {
                          for (const E of P.collectionIds)
                            o.add(E);
                          await t.log(
                            `  Extracted ${P.collectionIds.length} collection ID(s) from additional page "${R.name}"`
                          );
                        }
                        if (P.variableIds) {
                          for (const E of P.variableIds)
                            d.add(E);
                          await t.log(
                            `  Extracted ${P.variableIds.length} variable ID(s) from additional page "${R.name}"`
                          );
                        }
                      } catch (P) {
                        await t.warning(
                          `  Failed to parse created entities from additional page "${R.name}": ${P}`
                        );
                      }
                  }
                }
            }
            if (N.collectionIds) {
              for (const V of N.collectionIds)
                o.add(V);
              await t.log(
                `  Extracted ${N.collectionIds.length} collection ID(s) from page "${r.name}": ${N.collectionIds.map((V) => V.substring(0, 8) + "...").join(", ")}`
              );
            } else
              await t.log(
                `  No collectionIds found in createdEntities for page "${r.name}"`
              );
            if (N.variableIds) {
              for (const V of N.variableIds)
                d.add(V);
              await t.log(
                `  Extracted ${N.variableIds.length} variable ID(s) from page "${r.name}": ${N.variableIds.map((V) => V.substring(0, 8) + "...").join(", ")}`
              );
            } else
              await t.log(
                `  No variableIds found in createdEntities for page "${r.name}"`
              );
          } catch (N) {
            await t.warning(
              `  Failed to parse created entities from page "${r.name}": ${N}`
            ), await t.warning(
              `  Created entities string: ${T.substring(0, 200)}...`
            );
          }
        else
          await t.log(
            `  No created entities data found on page "${r.name}"`
          );
    }
    await t.log(
      `Cleanup summary: Found ${s.length} page(s) to delete, ${o.size} collection(s) to delete, ${d.size} variable(s) to delete`
    );
    const g = figma.currentPage;
    if (s.some(
      (r) => r.id === g.id
    )) {
      await figma.loadAllPagesAsync();
      const y = figma.root.children.find(
        (c) => c.type === "PAGE" && !s.some((T) => T.id === c.id)
      );
      y && (await figma.setCurrentPageAsync(y), await t.log(
        `Switched away from page "${g.name}" before deletion`
      ));
    }
    let u = 0;
    for (const r of s)
      try {
        await figma.loadAllPagesAsync();
        const y = await figma.getNodeByIdAsync(
          r.id
        );
        if (!y || y.type !== "PAGE")
          continue;
        if (figma.currentPage.id === y.id) {
          await figma.loadAllPagesAsync();
          const T = figma.root.children.find(
            (N) => N.type === "PAGE" && N.id !== y.id && !s.some((V) => V.id === N.id)
          );
          T && await figma.setCurrentPageAsync(T);
        }
        y.remove(), u++, await t.log(`Deleted page: "${r.name}"`);
      } catch (y) {
        await t.warning(
          `Failed to delete page "${r.name}" (${r.id.substring(0, 8)}...): ${y instanceof Error ? y.message : String(y)}`
        );
      }
    let $ = 0, b = 0;
    for (const r of d)
      try {
        const y = await figma.variables.getVariableByIdAsync(r);
        if (y) {
          const c = y.variableCollectionId;
          o.has(c) || (y.remove(), b++, await t.log(
            `Deleted variable: ${y.name} (${r.substring(0, 8)}...)`
          ));
        }
      } catch (y) {
        await t.warning(
          `Could not delete variable ${r.substring(0, 8)}...: ${y instanceof Error ? y.message : String(y)}`
        );
      }
    for (const r of o)
      try {
        const y = await figma.variables.getVariableCollectionByIdAsync(r);
        y && (y.remove(), $++, await t.log(
          `Deleted collection: "${y.name}" (${r.substring(0, 8)}...)`
        ));
      } catch (y) {
        await t.warning(
          `Could not delete collection ${r.substring(0, 8)}...: ${y instanceof Error ? y.message : String(y)}`
        );
      }
    return await t.log("=== Failed Import Cleanup Complete ==="), Ne("cleanupFailedImport", {
      success: !0,
      deletedPages: u,
      deletedCollections: $,
      deletedVariables: b
    });
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Cleanup failed: ${n}`), Te(
      "cleanupFailedImport",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function Cn(e) {
  try {
    await t.log("=== Clearing Import Metadata ==="), await figma.loadAllPagesAsync();
    const a = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!a || a.type !== "PAGE")
      throw new Error("Page not found");
    a.setPluginData(Ie, ""), a.setPluginData(be, "");
    const n = figma.root.children;
    for (const l of n)
      if (l.type === "PAGE" && l.getPluginData(be) === "true") {
        const o = l.getPluginData(Ie);
        if (o)
          try {
            JSON.parse(o), l.setPluginData(be, "");
          } catch (d) {
            l.setPluginData(be, "");
          }
        else
          l.setPluginData(be, "");
      }
    return await t.log(
      "Cleared import metadata from page and related pages"
    ), Ne("clearImportMetadata", {
      success: !0
    });
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Clear metadata failed: ${n}`), Te(
      "clearImportMetadata",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function Nn(e) {
  try {
    await t.log("=== Summarizing Variables for Wizard ===");
    const a = [];
    for (const { fileName: p, jsonData: r } of e.jsonFiles)
      try {
        const y = ft(r);
        if (!y.success || !y.expandedJsonData) {
          await t.warning(
            `Skipping ${p} - failed to expand JSON: ${y.error || "Unknown error"}`
          );
          continue;
        }
        const c = y.expandedJsonData;
        if (!c.collections)
          continue;
        const N = et.fromTable(
          c.collections
        );
        if (!c.variables)
          continue;
        const R = tt.fromTable(c.variables).getTable();
        for (const ae of Object.values(R)) {
          if (ae._colRef === void 0)
            continue;
          const P = N.getCollectionByIndex(
            ae._colRef
          );
          if (P) {
            const k = Se(
              P.collectionName
            ).toLowerCase();
            (k === "tokens" || k === "theme" || k === "layer") && a.push({
              name: ae.variableName,
              collectionName: k
              // Use lowercase for consistency ("layer" not "layers")
            });
          }
        }
      } catch (y) {
        await t.warning(
          `Error processing ${p}: ${y instanceof Error ? y.message : String(y)}`
        );
        continue;
      }
    const n = await figma.variables.getLocalVariableCollectionsAsync();
    let i = null, l = null, s = null;
    for (const p of n) {
      const y = Se(p.name).toLowerCase();
      (y === "tokens" || y === "token") && !i ? i = p : (y === "theme" || y === "themes") && !l ? l = p : (y === "layer" || y === "layers") && !s && (s = p);
    }
    const o = a.filter(
      (p) => p.collectionName === "tokens"
    ), d = a.filter((p) => p.collectionName === "theme"), g = a.filter((p) => p.collectionName === "layer"), w = {
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
      const p = /* @__PURE__ */ new Set();
      for (const r of i.variableIds)
        try {
          const y = figma.variables.getVariableById(r);
          y && p.add(y.name);
        } catch (y) {
          continue;
        }
      for (const r of o)
        p.has(r.name) ? w.existing++ : w.new++;
    } else
      w.new = o.length;
    if (e.themeCollection === "existing" && l) {
      const p = /* @__PURE__ */ new Set();
      for (const r of l.variableIds)
        try {
          const y = figma.variables.getVariableById(r);
          y && p.add(y.name);
        } catch (y) {
          continue;
        }
      for (const r of d)
        p.has(r.name) ? u.existing++ : u.new++;
    } else
      u.new = d.length;
    if (e.layersCollection === "existing" && s) {
      const p = /* @__PURE__ */ new Set();
      for (const r of s.variableIds)
        try {
          const y = figma.variables.getVariableById(r);
          y && p.add(y.name);
        } catch (y) {
          continue;
        }
      for (const r of g)
        p.has(r.name) ? $.existing++ : $.new++;
    } else
      $.new = g.length;
    return await t.log(
      `Variable summary: Tokens - ${w.existing} existing, ${w.new} new; Theme - ${u.existing} existing, ${u.new} new; Layers - ${$.existing} existing, ${$.new} new`
    ), Ne("summarizeVariablesForWizard", {
      tokens: w,
      theme: u,
      layers: $
    });
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Summarize failed: ${n}`), Te(
      "summarizeVariablesForWizard",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function En(e) {
  try {
    const a = "recursica:collectionId", i = {
      collections: (await figma.variables.getLocalVariableCollectionsAsync()).map((l) => {
        const s = l.getSharedPluginData("recursica", a);
        return {
          id: l.id,
          name: l.name,
          guid: s || void 0
        };
      })
    };
    return Ne(
      "getLocalVariableCollections",
      i
    );
  } catch (a) {
    return Te(
      "getLocalVariableCollections",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function Sn(e) {
  try {
    const a = "recursica:collectionId", n = [];
    for (const l of e.collectionIds)
      try {
        const s = await figma.variables.getVariableCollectionByIdAsync(l);
        if (s) {
          const o = s.getSharedPluginData(
            "recursica",
            a
          );
          n.push({
            collectionId: l,
            guid: o || null
          });
        } else
          n.push({
            collectionId: l,
            guid: null
          });
      } catch (s) {
        await t.warning(
          `Failed to get GUID for collection ${l}: ${s instanceof Error ? s.message : String(s)}`
        ), n.push({
          collectionId: l,
          guid: null
        });
      }
    return Ne(
      "getCollectionGuids",
      {
        collectionGuids: n
      }
    );
  } catch (a) {
    return Te(
      "getCollectionGuids",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function In(e) {
  try {
    await t.log("=== Starting Import Group Merge ==="), await figma.loadAllPagesAsync();
    const a = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!a || a.type !== "PAGE")
      throw new Error("Main page not found");
    const n = a.getPluginData(Ie);
    if (!n)
      throw new Error("Primary import metadata not found on page");
    const i = JSON.parse(n);
    await t.log(
      `Found metadata for component: ${i.componentName} (Version: ${i.componentVersion})`
    );
    let l = 0, s = 0;
    const o = "recursica:collectionId";
    for (const c of e.collectionChoices)
      if (c.choice === "merge")
        try {
          const T = await figma.variables.getVariableCollectionByIdAsync(
            c.newCollectionId
          );
          if (!T) {
            await t.warning(
              `New collection ${c.newCollectionId} not found, skipping merge`
            );
            continue;
          }
          let N = null;
          if (c.existingCollectionId)
            N = await figma.variables.getVariableCollectionByIdAsync(
              c.existingCollectionId
            );
          else {
            const k = T.getSharedPluginData(
              "recursica",
              o
            );
            if (k) {
              const j = await figma.variables.getLocalVariableCollectionsAsync();
              for (const C of j)
                if (C.getSharedPluginData(
                  "recursica",
                  o
                ) === k && C.id !== c.newCollectionId) {
                  N = C;
                  break;
                }
              if (!N && (k === Le.LAYER || k === Le.TOKENS || k === Le.THEME)) {
                let C;
                k === Le.LAYER ? C = Me.LAYER : k === Le.TOKENS ? C = Me.TOKENS : C = Me.THEME;
                for (const v of j)
                  if (v.getSharedPluginData(
                    "recursica",
                    o
                  ) === k && v.name === C && v.id !== c.newCollectionId) {
                    N = v;
                    break;
                  }
                N || (N = figma.variables.createVariableCollection(C), N.setSharedPluginData(
                  "recursica",
                  o,
                  k
                ), await t.log(
                  `Created new standard collection: "${C}"`
                ));
              }
            }
          }
          if (!N) {
            await t.warning(
              "Could not find or create existing collection for merge, skipping"
            );
            continue;
          }
          await t.log(
            `Merging collection "${T.name}" (${c.newCollectionId.substring(0, 8)}...) into "${N.name}" (${N.id.substring(0, 8)}...)`
          );
          const V = T.variableIds.map(
            (k) => figma.variables.getVariableByIdAsync(k)
          ), R = await Promise.all(V), ae = N.variableIds.map(
            (k) => figma.variables.getVariableByIdAsync(k)
          ), P = await Promise.all(ae), E = new Set(
            P.filter((k) => k !== null).map((k) => k.name)
          );
          for (const k of R)
            if (k)
              try {
                if (E.has(k.name)) {
                  await t.warning(
                    `Variable "${k.name}" already exists in collection "${N.name}", skipping`
                  );
                  continue;
                }
                const j = figma.variables.createVariable(
                  k.name,
                  N,
                  k.resolvedType
                );
                for (const C of N.modes) {
                  const v = C.modeId;
                  let h = k.valuesByMode[v];
                  if (h === void 0 && T.modes.length > 0) {
                    const I = T.modes[0].modeId;
                    h = k.valuesByMode[I];
                  }
                  h !== void 0 && j.setValueForMode(v, h);
                }
                await t.log(
                  `  ✓ Copied variable "${k.name}" to collection "${N.name}"`
                );
              } catch (j) {
                await t.warning(
                  `Failed to copy variable "${k.name}": ${j instanceof Error ? j.message : String(j)}`
                );
              }
          T.remove(), l++, await t.log(
            `✓ Merged and deleted collection: ${T.name}`
          );
        } catch (T) {
          await t.warning(
            `Failed to merge collection: ${T instanceof Error ? T.message : String(T)}`
          );
        }
      else
        s++, await t.log(`Kept collection: ${c.newCollectionId}`);
    await t.log("Removing dividers...");
    const d = figma.root.children, g = [];
    for (const c of d) {
      if (c.type !== "PAGE") continue;
      const T = c.getPluginData(Pe);
      (T === "start" || T === "end") && g.push(c);
    }
    const w = figma.currentPage;
    if (g.some((c) => c.id === w.id))
      if (a && a.id !== w.id)
        figma.currentPage = a;
      else {
        const c = d.find(
          (T) => T.type === "PAGE" && !g.some((N) => N.id === T.id)
        );
        c && (figma.currentPage = c);
      }
    const u = g.map((c) => c.name);
    for (const c of g)
      try {
        c.remove();
      } catch (T) {
        await t.warning(
          `Failed to delete divider: ${T instanceof Error ? T.message : String(T)}`
        );
      }
    for (const c of u)
      await t.log(`Deleted divider: ${c}`);
    await t.log("Removing construction icons and renaming pages..."), await figma.loadAllPagesAsync();
    const $ = figma.root.children;
    let b = 0;
    const p = "RecursicaPublishedMetadata", r = [];
    for (const c of $)
      if (c.type === "PAGE")
        try {
          if (c.getPluginData(be) === "true") {
            const N = c.getPluginData(p);
            let V = {};
            if (N)
              try {
                V = JSON.parse(N);
              } catch (R) {
              }
            r.push({
              pageId: c.id,
              pageName: c.name,
              pageMetadata: V
            });
          }
        } catch (T) {
          await t.warning(
            `Failed to process page: ${T instanceof Error ? T.message : String(T)}`
          );
        }
    for (const c of r)
      try {
        const T = await figma.getNodeByIdAsync(
          c.pageId
        );
        if (!T || T.type !== "PAGE") {
          await t.warning(
            `Page ${c.pageId} not found, skipping rename`
          );
          continue;
        }
        let N = T.name;
        if (N.startsWith(Re) && (N = N.substring(Re.length).trim()), N === "REMOTES" || N.includes("REMOTES")) {
          T.name = "REMOTES", b++, await t.log(`Renamed page: "${T.name}" -> "REMOTES"`);
          continue;
        }
        const R = c.pageMetadata.name && c.pageMetadata.name.length > 0 && !c.pageMetadata.name.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        ) ? c.pageMetadata.name : i.componentName || N, ae = c.pageMetadata.version !== void 0 ? c.pageMetadata.version : i.componentVersion, P = `${R} (VERSION: ${ae})`;
        T.name = P, b++, await t.log(`Renamed page: "${N}" -> "${P}"`);
      } catch (T) {
        await t.warning(
          `Failed to rename page ${c.pageId}: ${T instanceof Error ? T.message : String(T)}`
        );
      }
    if (await t.log("Clearing import metadata..."), a)
      try {
        a.setPluginData(Ie, "");
      } catch (c) {
        await t.warning(
          `Failed to clear primary import metadata: ${c instanceof Error ? c.message : String(c)}`
        );
      }
    for (const c of r)
      try {
        const T = await figma.getNodeByIdAsync(
          c.pageId
        );
        T && T.type === "PAGE" && T.setPluginData(be, "");
      } catch (T) {
        await t.warning(
          `Failed to clear under review metadata for page ${c.pageId}: ${T instanceof Error ? T.message : String(T)}`
        );
      }
    const y = {
      mergedCollections: l,
      keptCollections: s,
      pagesRenamed: b
    };
    return await t.log(
      `=== Merge Complete ===
  Merged: ${l} collection(s)
  Kept: ${s} collection(s)
  Renamed: ${b} page(s)`
    ), Ne(
      "mergeImportGroup",
      y
    );
  } catch (a) {
    return await t.error(
      `Merge failed: ${a instanceof Error ? a.message : String(a)}`
    ), Te(
      "mergeImportGroup",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function An(e) {
  var a, n;
  try {
    await t.log(
      "=== Test: Instance Children and Overrides Behavior ==="
    );
    const i = await figma.getNodeByIdAsync(e);
    if (!i || i.type !== "PAGE")
      throw new Error("Test page not found");
    const l = i.children.find(
      (x) => x.type === "FRAME" && x.name === "Test"
    );
    if (!l)
      throw new Error("Test frame container not found on page");
    const s = [];
    await t.log(
      `
--- Test 1: Component with children → Create instance ---`
    );
    const o = figma.createComponent();
    o.name = "Test Component - With Children", o.resize(200, 200), l.appendChild(o);
    const d = figma.createFrame();
    d.name = "Child 1", d.resize(50, 50), d.x = 10, d.y = 10, o.appendChild(d);
    const g = figma.createFrame();
    g.name = "Child 2", g.resize(50, 50), g.x = 70, g.y = 10, o.appendChild(g), await t.log(
      `  Created component "${o.name}" with ${o.children.length} children`
    ), await t.log(
      `  Component children: ${o.children.map((x) => x.name).join(", ")}`
    );
    const w = o.createInstance();
    w.name = "Instance 1 - From Component", l.appendChild(w), await t.log(
      `  Created instance "${w.name}" from component`
    );
    const u = w.children.length;
    if (await t.log(
      `  Instance children count immediately after creation: ${u}`
    ), u > 0) {
      await t.log(
        `  Instance children: ${w.children.map((f) => f.name).join(", ")}`
      ), await t.log(
        `  Instance child types: ${w.children.map((f) => f.type).join(", ")}`
      );
      const x = w.children[0];
      if (await t.log(
        `  First child: name="${x.name}", type="${x.type}", id="${x.id}"`
      ), await t.log(
        `  First child parent: ${(a = x.parent) == null ? void 0 : a.name} (id: ${(n = x.parent) == null ? void 0 : n.id})`
      ), "mainComponent" in x) {
        const f = await x.getMainComponentAsync();
        await t.log(
          `  First child mainComponent: ${(f == null ? void 0 : f.name) || "none"}`
        );
      }
      await t.log(
        `  Component children IDs: ${o.children.map((f) => f.id).join(", ")}`
      ), await t.log(
        `  Instance children IDs: ${w.children.map((f) => f.id).join(", ")}`
      );
      const ge = w.children[0].id !== o.children[0].id;
      await t.log(
        `  Are instance children different nodes from component children? ${ge}`
      );
    } else
      await t.log(
        "  ⚠️ Instance has NO children immediately after creation"
      );
    if (s.push({
      test: "Instance has children immediately",
      success: u > 0,
      details: {
        instanceChildrenCount: u,
        componentChildrenCount: o.children.length,
        instanceChildren: w.children.map((x) => ({
          name: x.name,
          type: x.type,
          id: x.id
        }))
      }
    }), await t.log(
      `
--- Test 2: Create instance override by replacing child ---`
    ), u > 0) {
      const x = w.children[0];
      await t.log(
        `  Original child to replace: "${x.name}" (id: ${x.id})`
      );
      const ge = figma.createFrame();
      ge.name = "Override Child", ge.resize(60, 60), ge.x = x.x, ge.y = x.y, l.appendChild(ge), await t.log(
        `  Created override child "${ge.name}" as child of Test frame`
      );
      let f = !1, U;
      try {
        const m = w.children.indexOf(x);
        w.insertChild(m, ge), x.remove(), f = !0, await t.log(
          `  ✓ Successfully replaced child at index ${m}`
        );
      } catch (m) {
        U = m instanceof Error ? m.message : String(m), await t.log(
          `  ✗ Cannot move node into instance: ${U}`
        ), await t.log(
          "  → This means we cannot directly move placeholder children into instances"
        ), await t.log(
          "  → We must create NEW nodes and copy properties instead"
        ), ge.remove();
      }
      if (f) {
        await t.log(
          `  Instance children after override: ${w.children.map((S) => S.name).join(", ")}`
        ), await t.log(
          `  Instance children count after override: ${w.children.length}`
        ), await t.log(
          `  Component children after override: ${o.children.map((S) => S.name).join(", ")}`
        ), await t.log(
          `  Component children count after override: ${o.children.length}`
        );
        const m = o.children.length === 2 && o.children[0].name === "Child 1" && o.children[1].name === "Child 2";
        s.push({
          test: "Instance override doesn't affect component",
          success: m,
          details: {
            instanceChildrenAfterOverride: w.children.map((S) => ({
              name: S.name,
              type: S.type,
              id: S.id
            })),
            componentChildrenAfterOverride: o.children.map((S) => ({
              name: S.name,
              type: S.type,
              id: S.id
            }))
          }
        });
      } else
        await t.log(
          "  → Cannot move nodes into instances - must create new nodes instead"
        ), s.push({
          test: "Instance override doesn't affect component",
          success: !0,
          // This is expected behavior
          details: {
            overrideAttempted: !0,
            overrideError: U,
            note: "Cannot move nodes into instances - must create new nodes and copy properties"
          }
        });
    } else
      await t.log(
        "  ⚠️ Skipping override test - instance has no children"
      ), s.push({
        test: "Instance override doesn't affect component",
        success: !1,
        details: { reason: "Instance has no children to override" }
      });
    await t.log(
      `
--- Test 3: Merge placeholder children into instance ---`
    );
    const $ = o.createInstance();
    $.name = "Instance 2 - For Placeholder Merge", $.x = 250, l.appendChild($), await t.log(
      `  Created instance "${$.name}" with ${$.children.length} children`
    );
    const b = figma.createFrame();
    b.name = "[Deferred: Placeholder]", b.resize(200, 200), l.appendChild(b);
    const p = figma.createFrame();
    p.name = "Child 1", p.resize(60, 60), p.x = 10, p.y = 10, b.appendChild(p);
    const r = figma.createFrame();
    r.name = "Placeholder Only Child", r.resize(50, 50), r.x = 80, r.y = 10, b.appendChild(r), await t.log(
      `  Created placeholder with ${b.children.length} children: ${b.children.map((x) => x.name).join(", ")}`
    ), await t.log(
      `  Instance has ${$.children.length} children: ${$.children.map((x) => x.name).join(", ")}`
    );
    let y = !1, c = {}, T;
    if ($.children.length > 0 && b.children.length > 0) {
      await t.log("  Attempting to merge placeholder children..."), await t.log(
        "  → Since we cannot move nodes into instances, we'll test creating new nodes"
      );
      const x = [];
      for (const f of b.children) {
        const U = $.children.find(
          (m) => m.name === f.name
        );
        if (U) {
          await t.log(
            `  Found matching child "${f.name}" in instance - attempting to replace`
          );
          try {
            const m = $.children.indexOf(U);
            $.insertChild(m, f), U.remove(), x.push({
              name: f.name,
              source: "replaced existing"
            }), await t.log(
              `    ✓ Successfully replaced "${f.name}"`
            );
          } catch (m) {
            const S = m instanceof Error ? m.message : String(m);
            await t.log(
              `    ✗ Cannot move "${f.name}" into instance: ${S}`
            ), await t.log(
              "    → Must create new node and copy properties instead"
            ), x.push({
              name: f.name,
              source: "replaced existing (failed)",
              error: S
            }), T = S;
          }
        } else {
          await t.log(
            `  No matching child for "${f.name}" - attempting to append`
          );
          try {
            $.appendChild(f), x.push({
              name: f.name,
              source: "appended new"
            }), await t.log(
              `    ✓ Successfully appended "${f.name}"`
            );
          } catch (m) {
            const S = m instanceof Error ? m.message : String(m);
            await t.log(
              `    ✗ Cannot append "${f.name}" to instance: ${S}`
            ), await t.log(
              "    → Must create new node and copy properties instead"
            ), x.push({
              name: f.name,
              source: "appended new (failed)",
              error: S
            }), T = S;
          }
        }
      }
      await t.log(
        `  After merge attempt, instance has ${$.children.length} children: ${$.children.map((f) => f.name).join(", ")}`
      );
      const ge = x.filter(
        (f) => !f.error && f.source !== "replaced existing (failed)" && f.source !== "appended new (failed)"
      );
      T ? (await t.log(
        "  → Merge failed: Cannot move nodes into instances (expected behavior)"
      ), await t.log(
        "  → Solution: Must create NEW nodes and copy properties from placeholder children"
      ), y = !0) : y = ge.length > 0, c = {
        mergedChildren: x,
        successfulMerges: ge.length,
        failedMerges: x.length - ge.length,
        mergeError: T,
        finalInstanceChildren: $.children.map((f) => ({
          name: f.name,
          type: f.type,
          id: f.id
        })),
        finalInstanceChildrenCount: $.children.length,
        note: T ? "Cannot move nodes into instances - must create new nodes and copy properties" : "Merge succeeded"
      };
    } else
      await t.log(
        "  ⚠️ Cannot merge - instance or placeholder has no children"
      ), c = {
        instanceChildrenCount: $.children.length,
        placeholderChildrenCount: b.children.length
      };
    s.push({
      test: "Merge placeholder children into instance",
      success: y,
      details: c
    }), await t.log(`
--- Test 4: getMainComponent behavior ---`);
    const N = await w.getMainComponentAsync();
    if (await t.log(
      `  Instance mainComponent: ${(N == null ? void 0 : N.name) || "none"} (id: ${(N == null ? void 0 : N.id) || "none"})`
    ), await t.log(
      `  MainComponent type: ${(N == null ? void 0 : N.type) || "none"}`
    ), N) {
      await t.log(
        `  MainComponent children: ${N.children.map((ge) => ge.name).join(", ")}`
      ), await t.log(
        `  MainComponent children count: ${N.children.length}`
      ), await t.log(
        `  Instance children count: ${w.children.length}`
      );
      const x = w.children.length === N.children.length && w.children.every(
        (ge, f) => ge.name === N.children[f].name
      );
      await t.log(
        `  Do instance children match mainComponent children? ${x}`
      ), s.push({
        test: "getMainComponent returns component",
        success: N.id === o.id,
        details: {
          mainComponentId: N.id,
          componentId: o.id,
          childrenMatch: x,
          instanceChildrenCount: w.children.length,
          mainComponentChildrenCount: N.children.length
        }
      });
    } else
      s.push({
        test: "getMainComponent returns component",
        success: !1,
        details: { reason: "getMainComponentAsync returned null" }
      });
    await t.log(
      `
--- Test 5: Recreate children from JSON (simulating deferred resolution) ---`
    );
    const V = figma.createComponent();
    V.name = "Test Component - For JSON Recreation", V.resize(300, 300), l.appendChild(V);
    const R = figma.createFrame();
    R.name = "Default Child 1", R.resize(50, 50), R.fills = [{ type: "SOLID", color: { r: 1, g: 0, b: 0 } }], V.appendChild(R);
    const ae = figma.createFrame();
    ae.name = "Default Child 2", ae.resize(50, 50), ae.fills = [{ type: "SOLID", color: { r: 0, g: 1, b: 0 } }], V.appendChild(ae);
    const P = figma.createFrame();
    P.name = "Default Child 3", P.resize(50, 50), P.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 1 } }], V.appendChild(P), await t.log(
      `  Created component "${V.name}" with ${V.children.length} default children`
    ), await t.log(
      `  Default children: ${V.children.map((x) => x.name).join(", ")}`
    );
    const E = V.createInstance();
    E.name = "Instance 3 - For JSON Recreation", E.x = 350, l.appendChild(E), await t.log(
      `  Created instance "${E.name}" with ${E.children.length} default children`
    ), await t.log(
      `  Instance default children: ${E.children.map((x) => x.name).join(", ")}`
    );
    const k = [
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
      `  JSON children to recreate: ${k.map((x) => x.name).join(", ")}`
    ), await t.log(
      "  Strategy: Match by name, update matches in place, cannot add new ones (Figma limitation), keep defaults not in JSON"
    );
    let j = !0;
    const C = {
      defaultChildrenBefore: E.children.map((x) => ({
        name: x.name,
        type: x.type,
        fills: "fills" in x ? x.fills : void 0
      })),
      jsonChildren: k.map((x) => ({ name: x.name, type: x.type }))
    }, v = [], h = [];
    for (const x of k) {
      const ge = E.children.find(
        (f) => f.name === x.name
      );
      if (ge) {
        await t.log(
          `  Found matching child "${x.name}" - attempting to update in place`
        );
        try {
          if ("fills" in ge && x.fills) {
            const f = ge.fills;
            await t.log(
              `    Current fills before update: ${JSON.stringify(f)}`
            ), ge.fills = x.fills;
            const U = ge.fills;
            await t.log(
              `    Fills after update: ${JSON.stringify(U)}`
            ), Array.isArray(U) && U.length > 0 && U[0].type === "SOLID" && U[0].color.r === x.fills[0].color.r && U[0].color.g === x.fills[0].color.g && U[0].color.b === x.fills[0].color.b ? (await t.log(
              `    ✓ Successfully updated "${x.name}" fills in place`
            ), v.push(x.name)) : (await t.log(
              "    ✗ Update assignment succeeded but fills didn't change (read-only?)"
            ), j = !1);
          } else
            await t.log(
              `    ⚠ Cannot update "${x.name}" - node type doesn't support fills`
            );
        } catch (f) {
          const U = f instanceof Error ? f.message : String(f);
          await t.log(
            `    ✗ Cannot update "${x.name}": ${U}`
          ), j = !1;
        }
      } else
        await t.log(
          `  No matching child for "${x.name}" - cannot add to instance (Figma limitation)`
        ), await t.log(
          "    → Children that exist only in JSON cannot be added to instances"
        ), h.push(x.name);
    }
    await t.log(
      "  Testing: Can we modify other properties (like name, size) of instance children?"
    );
    let I = !1;
    if (E.children.length > 0) {
      const x = E.children[0], ge = x.name, f = "width" in x ? x.width : void 0;
      try {
        x.name = "Modified Name", "resize" in x && f && x.resize(f + 10, x.height), I = !0, await t.log(
          "    ✓ Can modify properties (name, size) of instance children"
        ), x.name = ge, "resize" in x && f && x.resize(f, x.height);
      } catch (U) {
        const m = U instanceof Error ? U.message : String(U);
        await t.log(
          `    ✗ Cannot modify properties of instance children: ${m}`
        );
      }
    }
    const A = E.children.filter(
      (x) => !k.some((ge) => ge.name === x.name)
    );
    await t.log(
      `  Kept default children (not in JSON): ${A.map((x) => x.name).join(", ")}`
    ), await t.log(
      `  Final instance children: ${E.children.map((x) => x.name).join(", ")}`
    ), await t.log(
      `  Final instance children count: ${E.children.length}`
    ), C.finalChildren = E.children.map((x) => ({
      name: x.name,
      type: x.type
    })), C.keptDefaultChildren = A.map((x) => ({
      name: x.name,
      type: x.type
    })), C.finalChildrenCount = E.children.length, C.updatedChildren = v, C.skippedChildren = h, C.canModifyProperties = I;
    const O = E.children.some(
      (x) => x.name === "Default Child 1"
    ), K = E.children.some(
      (x) => x.name === "JSON Only Child"
    ), ne = E.children.some(
      (x) => x.name === "Default Child 2"
    ), M = E.children.some(
      (x) => x.name === "Default Child 3"
    ), L = E.children.find(
      (x) => x.name === "Default Child 1"
    );
    let z = !1;
    if (L && "fills" in L) {
      const x = L.fills;
      Array.isArray(x) && x.length > 0 && x[0].type === "SOLID" && (z = x[0].color.r === 1 && x[0].color.g === 1 && x[0].color.b === 0);
    }
    const J = O && z && !K && // Should NOT exist (Figma limitation)
    ne && M && E.children.length === 3;
    await t.log(`  Meets expectations: ${J}`), await t.log(`    - "Default Child 1" updated: ${z}`), await t.log(
      `    - "JSON Only Child" added: ${K} (expected: false - cannot add new children)`
    ), await t.log(
      `    - Default children kept: ${ne && M}`
    ), s.push({
      test: "Recreate children from JSON",
      success: j && J,
      details: Ee(de({}, C), {
        meetsExpectations: J,
        hasJsonChild1: O,
        child1Updated: z,
        hasJsonOnlyChild: K,
        hasDefaultChild2: ne,
        hasDefaultChild3: M,
        note: j && J ? "Successfully updated existing children in place, kept defaults not in JSON. Cannot add new children to instances (Figma limitation)." : "Failed to update children or expectations not met"
      })
    }), await t.log(
      `
--- Test 6: Bottom-up resolution order (nested deferred instances) ---`
    );
    const D = figma.createFrame();
    D.name = "[Deferred: Parent]", D.resize(200, 200), l.appendChild(D);
    const W = figma.createFrame();
    W.name = "[Deferred: Child]", W.resize(100, 100), W.x = 10, W.y = 10, D.appendChild(W);
    const te = figma.createFrame();
    te.name = "[Deferred: Grandchild]", te.resize(50, 50), te.x = 10, te.y = 10, W.appendChild(te), await t.log(
      "  Created nested structure: Parent -> Child -> Grandchild"
    ), await t.log(
      `  Parent placeholder has ${D.children.length} child(ren)`
    ), await t.log(
      `  Child placeholder has ${W.children.length} child(ren)`
    );
    let q = !0;
    const G = {};
    await t.log("  Step 1: Resolving grandchild (leaf node)...");
    const Z = figma.createComponent();
    Z.name = "Grandchild Component", Z.resize(50, 50), l.appendChild(Z);
    const Q = Z.createInstance();
    Q.name = "Grandchild Instance", l.appendChild(Q);
    const ee = te.parent;
    if (ee && "children" in ee) {
      const x = ee.children.indexOf(
        te
      );
      ee.insertChild(x, Q), te.remove(), await t.log(
        "    ✓ Resolved grandchild - replaced placeholder with instance"
      ), G.grandchildResolved = !0;
    } else
      await t.log("    ✗ Could not resolve grandchild"), q = !1;
    await t.log(
      "  Step 2: Resolving child (has resolved grandchild inside)..."
    );
    const oe = figma.createComponent();
    oe.name = "Child Component", oe.resize(100, 100), l.appendChild(oe);
    const se = oe.createInstance();
    se.name = "Child Instance", l.appendChild(se);
    const re = D.children.find(
      (x) => x.name === "[Deferred: Child]"
    );
    if (!re)
      await t.log(
        "    ✗ Child placeholder lost after resolving grandchild"
      ), q = !1;
    else if (!("children" in re))
      await t.log(
        "    ✗ Child placeholder does not support children"
      ), q = !1;
    else {
      re.children.find(
        (U) => U.name === "Grandchild Instance"
      ) ? (await t.log(
        "    ✓ Grandchild still accessible inside child placeholder"
      ), G.grandchildStillAccessible = !0) : await t.log(
        "    ⚠ Grandchild not found inside child placeholder (may have been moved)"
      );
      const ge = re.children.find(
        (U) => U.name === "Grandchild Instance"
      ), f = re.parent;
      if (f && "children" in f) {
        const U = f.children.indexOf(
          re
        );
        f.insertChild(U, se), re.remove(), await t.log(
          "    ✓ Resolved child - replaced placeholder with instance"
        ), G.childResolved = !0, ge && (await t.log(
          "    ⚠ Grandchild instance was in child placeholder and is now lost"
        ), await t.log(
          "    → This demonstrates the need to extract children before replacing placeholders"
        ), G.grandchildLost = !0);
      } else
        await t.log("    ✗ Could not resolve child"), q = !1;
    }
    await t.log(
      "  Step 3: Resolving parent (has resolved child inside)..."
    );
    const ce = figma.createComponent();
    ce.name = "Parent Component", ce.resize(200, 200), l.appendChild(ce);
    const ye = ce.createInstance();
    ye.name = "Parent Instance", l.appendChild(ye);
    const $e = D.children.find(
      (x) => x.name === "Child Instance"
    );
    $e ? (await t.log(
      "    ✓ Child still accessible inside parent placeholder"
    ), G.childStillAccessible = !0, l.appendChild($e), await t.log(
      "    ✓ Extracted child instance from parent placeholder"
    ), G.childExtracted = !0) : (await t.log(
      "    ✗ Child not found inside parent placeholder - cannot extract"
    ), q = !1);
    const xe = D.parent;
    if (xe && "children" in xe) {
      const x = xe.children.indexOf(D);
      if (xe.insertChild(x, ye), D.remove(), await t.log(
        "    ✓ Resolved parent - replaced placeholder with instance"
      ), G.parentResolved = !0, $e)
        try {
          ye.appendChild($e), await t.log(
            "    ✓ Added child instance to parent instance"
          ), G.childAddedToParent = !0;
        } catch (ge) {
          const f = ge instanceof Error ? ge.message : String(ge);
          await t.log(
            `    ✗ Cannot add child to parent instance: ${f}`
          ), await t.log(
            "    → This is the Figma limitation - cannot add children to instances"
          ), await t.log(
            "    → Child instance remains in testFrame (not in final structure)"
          ), G.childAddedToParent = !1, G.childAddError = f;
        }
    } else
      await t.log("    ✗ Could not resolve parent"), q = !1;
    await t.log("  Verifying bottom-up resolution worked...");
    const Be = l.children.find(
      (x) => x.name === "Parent Instance"
    ), ke = l.children.find(
      (x) => x.name === "Child Instance"
    );
    let Ge = !1;
    Be && ke ? (Ge = !0, await t.log(
      "    ✓ Bottom-up resolution worked: Parent resolved, child extracted"
    ), await t.log(
      "    ⚠ Child cannot be added to parent instance (Figma limitation)"
    )) : Be ? await t.log(
      "    ⚠ Parent resolved but child not found (may have been lost)"
    ) : await t.log("    ✗ Parent not resolved"), G.bottomUpWorked = Ge, G.finalParentExists = !!Be, G.childExtractedExists = !!ke, G.note = "Bottom-up resolution works, but Figma limitation prevents adding children to instances. This demonstrates the need for a different approach (e.g., matching by name and replacing at parent level).", G.note = "Bottom-up resolution (leaf to root) ensures nested placeholders are resolved before their parents are replaced", s.push({
      test: "Bottom-up resolution order",
      success: q && Ge,
      details: G
    }), await t.log(`
--- Test Summary ---`);
    const Ze = s.every((x) => x.success), _e = s.filter((x) => x.success).length;
    await t.log(
      `  Tests passed: ${_e}/${s.length}`
    );
    for (const x of s)
      await t.log(
        `  ${x.success ? "✓" : "✗"} ${x.test}: ${x.success ? "PASS" : "FAIL"}`
      );
    return {
      success: Ze,
      message: Ze ? "All instance children and override tests passed" : `${_e}/${s.length} tests passed - see details`,
      details: {
        testResults: s,
        summary: {
          total: s.length,
          passed: _e,
          failed: s.length - _e
        }
      }
    };
  } catch (i) {
    const l = i instanceof Error ? i.message : "Unknown error occurred";
    return await t.error(`Test failed: ${l}`), {
      success: !1,
      message: `Test error: ${l}`
    };
  }
}
async function Pn(e) {
  try {
    await t.log("=== Starting Test ==="), await t.log('Cleaning up "Test" variable collection...');
    const a = await figma.variables.getLocalVariableCollectionsAsync();
    for (const b of a)
      if (b.name === "Test") {
        await t.log(
          `  Found existing "Test" collection (ID: ${b.id.substring(0, 8)}...), deleting...`
        );
        const p = await figma.variables.getLocalVariablesAsync();
        for (const r of p)
          r.variableCollectionId === b.id && r.remove();
        b.remove(), await t.log('  Deleted "Test" collection');
      }
    await figma.loadAllPagesAsync();
    let i = figma.root.children.find(
      (b) => b.type === "PAGE" && b.name === "Test"
    );
    i ? await t.log('Found existing "Test" page') : (i = figma.createPage(), i.name = "Test", await t.log('Created "Test" page')), await figma.setCurrentPageAsync(i);
    const l = i.children.find(
      (b) => b.type === "FRAME" && b.name === "Test"
    );
    l && (await t.log(
      'Found existing "Test" frame, deleting it and all children...'
    ), l.remove(), await t.log('Deleted existing "Test" frame'));
    const s = figma.createFrame();
    s.name = "Test", i.appendChild(s), await t.log('Created new "Test" frame container');
    const o = [];
    await t.log(`
` + "=".repeat(60)), await t.log("TEST 9: Instance Children and Overrides Behavior"), await t.log("=".repeat(60));
    const d = await An(i.id);
    o.push({
      name: "Instance Children and Overrides",
      success: d.success,
      message: d.message,
      details: d.details
    }), await t.log(`
` + "=".repeat(60)), await t.log("=== ALL TESTS COMPLETE ==="), await t.log("=".repeat(60));
    const g = o.filter((b) => b.success), w = o.filter((b) => !b.success);
    await t.log(
      `Total: ${o.length} | Passed: ${g.length} | Failed: ${w.length}`
    );
    for (const b of o)
      await t.log(
        `  ${b.success ? "✓" : "✗"} ${b.name}: ${b.message}`
      );
    const $ = {
      testResults: {
        success: d.success,
        message: `All tests completed: ${g.length}/${o.length} passed`,
        details: {
          summary: {
            total: o.length,
            passed: g.length,
            failed: w.length
          },
          tests: o
        }
      },
      allTests: o
    };
    return Ne("runTest", $);
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Test failed: ${n}`), Te("runTest", n);
  }
}
const Tn = {
  getCurrentUser: ca,
  loadPages: da,
  exportPage: We,
  importPage: Nt,
  cleanupCreatedEntities: Kt,
  resolveDeferredNormalInstances: Et,
  determineImportOrder: Yt,
  buildDependencyGraph: qt,
  resolveImportOrder: Xt,
  importPagesInOrder: Zt,
  quickCopy: rn,
  storeAuthData: sn,
  loadAuthData: ln,
  clearAuthData: cn,
  storeImportData: dn,
  loadImportData: gn,
  clearImportData: fn,
  storeSelectedRepo: mn,
  getComponentMetadata: pn,
  getAllComponents: un,
  pluginPromptResponse: hn,
  switchToPage: yn,
  checkForExistingPrimaryImport: wn,
  createImportDividers: bn,
  importSingleComponentWithWizard: $n,
  deleteImportGroup: aa,
  clearImportMetadata: Cn,
  cleanupFailedImport: vn,
  summarizeVariablesForWizard: Nn,
  getLocalVariableCollections: En,
  getCollectionGuids: Sn,
  mergeImportGroup: In,
  runTest: Pn
}, On = Tn;
figma.showUI(__html__, {
  width: 500,
  height: 500
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    ba(e);
    return;
  }
  const a = e;
  try {
    const n = a.type, i = On[n];
    if (!i) {
      console.warn("Unknown message type:", a.type);
      const s = {
        type: a.type,
        success: !1,
        error: !0,
        message: "Unknown message type: " + a.type,
        data: {},
        requestId: a.requestId
      };
      figma.ui.postMessage(s);
      return;
    }
    const l = await i(a.data);
    figma.ui.postMessage(Ee(de({}, l), {
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
